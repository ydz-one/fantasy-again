import { getChipCountUpdateFns, getPreGwDates } from '../data';
import { assertIsSquadPoints, calcSquadBuyPriceTotal } from '../helpers';
import {
    GameState,
    GameAction,
    GameActionTypes,
    Squad,
    SquadPlayer,
    InGameTransfer,
    DEFAULT_SEASON,
    Chip,
    ChipCount,
    SquadPoints,
    SquadPlayerPoints,
    Position,
} from '../types';

const STARTING_BALANCE = 1000;

const getInitialGameState = (): GameState => {
    return {
        gameweek: 0,
        points: 0,
        isSquadComplete: false,
        isSeasonEnd: false,
        squad: {
            GK: [],
            DEF: [],
            MID: [],
            FWD: [],
            subs: [],
            subGk: '-1',
            captain: '-1',
            viceCaptain: '-1',
        },
        squadPointsHistory: [],
        gwPointsHistory: [],
        transfersHistory: getPreGwDates(DEFAULT_SEASON).map(() => []),
        deductionsHistory: [],
        balance: STARTING_BALANCE,
        balanceHistory: [],
        freeTransfers: Number.MAX_SAFE_INTEGER, // MAX_SAFE_INTEGER denotes unlimited transfers (before first GW, and when FH and WC are active)
        nextGwCost: 0,
        activeChip: null,
        chipCount: {
            [Chip.BENCH_BOOST]: 1,
            [Chip.FREE_HIT]: 1,
            [Chip.TRIPLE_CAPTAIN]: 1,
            [Chip.WILD_CARD]: 1,
        },
        chipHistory: {},
    };
};

const getMinValuePlayer = (players: SquadPlayer[]) => {
    return players.reduce((minValPlayer, player) => {
        return minValPlayer.buyPrice < player.buyPrice ? minValPlayer : player;
    }, players[0]);
};

const getTopTwoMaxValuePlayers = (squad: Squad) => {
    const { GK, DEF, MID, FWD } = squad;
    const players = GK.concat(DEF).concat(MID).concat(FWD);
    return players.reduce(
        (maxValPlayers, player) => {
            if (player.buyPrice > maxValPlayers[0].buyPrice) {
                maxValPlayers[1] = maxValPlayers[0];
                maxValPlayers[0] = player;
            } else if (player.buyPrice > maxValPlayers[1].buyPrice) {
                maxValPlayers[1] = player;
            }
            return maxValPlayers;
        },
        [
            { code: '-1', buyPrice: 0 },
            { code: '-1', buyPrice: 0 },
        ]
    );
};

const autoAssignSubs = (squad: Squad) => {
    const { GK, DEF, MID, FWD } = squad;
    const [captain, viceCaptain] = getTopTwoMaxValuePlayers(squad);
    return {
        ...squad,
        subGk: getMinValuePlayer(GK).code,
        subs: [getMinValuePlayer(MID).code, getMinValuePlayer(FWD).code, getMinValuePlayer(DEF).code],
        captain: captain.code,
        viceCaptain: viceCaptain.code,
    };
};

const updateCaptainsAndSubsForTransfers = (squad: Squad, transfers: InGameTransfer[]) => {
    return transfers.reduce((updatedSquad, transfer) => {
        const { code: playerToSellCode } = transfer.playerToSell;
        const { code: playerToBuyCode } = transfer.playerToBuy;
        if (updatedSquad.captain === playerToSellCode) {
            updatedSquad.captain = playerToBuyCode;
        } else if (updatedSquad.viceCaptain === playerToSellCode) {
            updatedSquad.viceCaptain = playerToBuyCode;
        } else if (updatedSquad.subGk === playerToSellCode) {
            updatedSquad.subGk = playerToBuyCode;
        } else {
            const playerIndex = updatedSquad.subs.indexOf(playerToSellCode);
            if (playerIndex > -1) {
                updatedSquad.subs.splice(playerIndex, 1, playerToBuyCode);
            }
        }
        return updatedSquad;
    }, JSON.parse(JSON.stringify(squad)));
};

const getNextGwFreeTransfers = (freeTransfers: number) => {
    if (freeTransfers === Number.MAX_SAFE_INTEGER) {
        return 1;
    }
    return Math.min(2, freeTransfers + 1);
};

const getUpdatedChipCounts = (gameweek: number, chipCount: ChipCount) => {
    const chipCountUpdateFns = getChipCountUpdateFns(DEFAULT_SEASON);
    if (chipCountUpdateFns[gameweek]) {
        return chipCountUpdateFns[gameweek](chipCount);
    }
    return chipCount;
};

const getSquadPlayer = ({ code, buyPrice }: SquadPlayerPoints): SquadPlayer => ({ code, buyPrice });

const getPlayerCode = ({ code }: SquadPlayerPoints): string => code;

const findCaptainOrViceCaptainCode = (squadPoints: SquadPoints, captainStatus: string) =>
    [Position.GK, Position.DEF, Position.MID, Position.FWD].reduce((targetCode, position) => {
        const playerIndex = squadPoints[position].findIndex((player) => player.captainStatus === captainStatus);
        if (playerIndex > -1) {
            targetCode = squadPoints[position][playerIndex].code;
        }
        return targetCode;
    }, '-1');

const getLastGwSquad = (squadPointsHistory: SquadPoints[]): Squad => {
    const lastGwSquadPoints = squadPointsHistory[squadPointsHistory.length - 1];
    assertIsSquadPoints(lastGwSquadPoints);
    const { GK, DEF, MID, FWD, subs, subGk } = lastGwSquadPoints;

    const getSubsInPosition = (position: Position) => subs.filter((player) => player.position === position);

    return {
        GK: GK.concat(subGk).map(getSquadPlayer),
        DEF: DEF.concat(getSubsInPosition(Position.DEF)).map(getSquadPlayer),
        MID: MID.concat(getSubsInPosition(Position.MID)).map(getSquadPlayer),
        FWD: FWD.concat(getSubsInPosition(Position.FWD)).map(getSquadPlayer),
        subs: subs.map(getPlayerCode),
        subGk: getPlayerCode(subGk),
        captain: findCaptainOrViceCaptainCode(lastGwSquadPoints, 'C'),
        viceCaptain: findCaptainOrViceCaptainCode(lastGwSquadPoints, 'VC'),
    };
};

const getLastGwBalance = (balanceHistory: number[]) => balanceHistory[balanceHistory.length - 1];

export const gameReducer = (state: GameState = getInitialGameState(), action: GameAction): GameState => {
    switch (action.type) {
        case GameActionTypes.IncrementGameweek:
            return {
                ...state,
                gameweek: state.gameweek + 1,
                isSeasonEnd: state.gameweek + 1 === getPreGwDates(DEFAULT_SEASON).length - 1,
            };
        case GameActionTypes.UpdateGameStateAfterGw:
            return {
                ...state,
                squad: state.activeChip === Chip.FREE_HIT ? getLastGwSquad(state.squadPointsHistory) : state.squad,
                balance: state.activeChip === Chip.FREE_HIT ? getLastGwBalance(state.balanceHistory) : state.balance,
                balanceHistory: state.balanceHistory.concat(state.balance),
                squadPointsHistory: state.squadPointsHistory.concat(action.payload.squadPoints),
                gwPointsHistory: state.gwPointsHistory.concat(action.payload.gwPoints),
                points: state.points + action.payload.gwPoints + state.nextGwCost,
                deductionsHistory: state.deductionsHistory.concat(state.nextGwCost),
                nextGwCost: 0,
                freeTransfers: getNextGwFreeTransfers(state.freeTransfers),
                chipCount: getUpdatedChipCounts(state.gameweek, state.chipCount),
                activeChip: null,
                chipHistory:
                    state.activeChip == null
                        ? state.chipHistory
                        : { ...state.chipHistory, [state.gameweek]: state.activeChip },
            };
        case GameActionTypes.AddPlayerToSquad:
            const { position, playerToReplace, playerToAdd } = action.payload;
            const playersInRole = state.squad[position];
            return {
                ...state,
                balance: state.balance - playerToAdd.buyPrice + playerToReplace.buyPrice,
                squad: {
                    ...state.squad,
                    [position]:
                        playerToReplace.code === '-1'
                            ? playersInRole.concat(playerToAdd)
                            : playersInRole.map((player) =>
                                  player.code === playerToReplace.code ? playerToAdd : player
                              ),
                },
            };
        case GameActionTypes.FinalizeSquad:
            return {
                ...state,
                squad: autoAssignSubs(state.squad),
                isSquadComplete: true,
            };
        case GameActionTypes.ResetSquad:
            return {
                ...state,
                squad: {
                    GK: [],
                    DEF: [],
                    MID: [],
                    FWD: [],
                    subs: [],
                    subGk: '-1',
                    captain: '-1',
                    viceCaptain: '-1',
                },
                balance: STARTING_BALANCE,
            };
        case GameActionTypes.SetSquad:
            return {
                ...state,
                squad: action.payload,
                balance: STARTING_BALANCE - calcSquadBuyPriceTotal(action.payload),
            };
        case GameActionTypes.MakeCaptain:
            const playerToBeCap = action.payload.playerCode;
            // If the player to be made captain is the existing vice captain, then he switches armbands with the current captain
            if (state.squad.viceCaptain === playerToBeCap) {
                return {
                    ...state,
                    squad: {
                        ...state.squad,
                        captain: state.squad.viceCaptain,
                        viceCaptain: state.squad.captain,
                    },
                };
            }
            return {
                ...state,
                squad: {
                    ...state.squad,
                    captain: playerToBeCap,
                },
            };
        case GameActionTypes.MakeViceCaptain:
            const playerToBeViceCap = action.payload.playerCode;
            // If the player to be made vice captain is the existing captain, then he switches armbands with the current vice captain
            if (state.squad.captain === playerToBeViceCap) {
                return {
                    ...state,
                    squad: {
                        ...state.squad,
                        captain: state.squad.viceCaptain,
                        viceCaptain: state.squad.captain,
                    },
                };
            }
            return {
                ...state,
                squad: {
                    ...state.squad,
                    viceCaptain: playerToBeViceCap,
                },
            };
        case GameActionTypes.SubPlayer:
            const { squad } = state;
            const { player1, player2 } = action.payload;
            const squadChanges: Partial<Squad> = {};
            // captain/vice captain armband swap, if applicable
            if (squad.captain === player1) {
                squadChanges.captain = player2;
            } else if (squad.captain === player2) {
                squadChanges.captain = player1;
            } else if (squad.viceCaptain === player1) {
                squadChanges.viceCaptain = player2;
            } else if (squad.viceCaptain === player2) {
                squadChanges.viceCaptain = player1;
            }
            // substitution
            if (squad.subGk === player1) {
                squadChanges.subGk = player2;
            } else if (squad.subGk === player2) {
                squadChanges.subGk = player1;
            } else if (squad.subs.includes(player1) && squad.subs.includes(player2)) {
                squadChanges.subs = squad.subs.slice();
                const player1Idx = squadChanges.subs.indexOf(player1);
                const player2Idx = squadChanges.subs.indexOf(player2);
                squadChanges.subs.splice(player1Idx, 1, player2);
                squadChanges.subs.splice(player2Idx, 1, player1);
            } else if (squad.subs.includes(player1)) {
                squadChanges.subs = squad.subs.slice();
                squadChanges.subs.splice(squadChanges.subs.indexOf(player1), 1, player2);
            } else if (squad.subs.includes(player2)) {
                squadChanges.subs = squad.subs.slice();
                squadChanges.subs.splice(squadChanges.subs.indexOf(player2), 1, player1);
            }
            return {
                ...state,
                squad: Object.assign(state.squad, squadChanges),
            };
        case GameActionTypes.FinalizeTransfers:
            const { gameweek, transfersHistory } = state;
            const { newSquad, newBalance, newNextGwCost, newFreeTransfers, transfers } = action.payload;
            const updatedNewSquad = updateCaptainsAndSubsForTransfers(newSquad, transfers);
            return {
                ...state,
                squad: updatedNewSquad,
                balance: newBalance,
                nextGwCost: newNextGwCost,
                freeTransfers: newFreeTransfers,
                transfersHistory: [
                    ...transfersHistory.slice(0, gameweek),
                    transfersHistory[gameweek].concat(transfers),
                    ...transfersHistory.slice(gameweek + 1),
                ],
            };
        case GameActionTypes.ActivateChip:
            const { activeChip, chipCount } = state;
            const updatedChipCount = { ...chipCount };
            const chipRelatedUpdates: Partial<GameState> = {};
            if (activeChip != null) {
                updatedChipCount[activeChip]++;
            }
            if (action.payload != null) {
                updatedChipCount[action.payload]--;
            }
            if (action.payload === Chip.WILD_CARD || action.payload === Chip.FREE_HIT) {
                chipRelatedUpdates.freeTransfers = Number.MAX_SAFE_INTEGER;
                chipRelatedUpdates.nextGwCost = 0;
            }
            return {
                ...state,
                activeChip: action.payload,
                chipCount: updatedChipCount,
                ...chipRelatedUpdates,
            };
        case GameActionTypes.ResetGameState:
            return getInitialGameState();
        default:
            return state;
    }
};
