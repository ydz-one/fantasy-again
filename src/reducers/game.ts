import { calcSquadBuyPriceTotal } from '../helpers';
import { GameState, GameAction, GameActionTypes, Squad, SquadPlayer } from '../types';

const STARTING_BALANCE = 1000;

const getInitialGameState = (): GameState => {
    return {
        gameweek: 0,
        points: 0,
        isSquadComplete: false,
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
        balance: STARTING_BALANCE,
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

export const gameReducer = (state: GameState = getInitialGameState(), action: GameAction): GameState => {
    switch (action.type) {
        case GameActionTypes.IncrementGameweek:
            return {
                ...state,
                gameweek: state.gameweek + 1,
            };
        case GameActionTypes.AddSquadPointsToHistory:
            return {
                ...state,
                squadPointsHistory: state.squadPointsHistory.concat(action.payload.squadPoints),
                gwPointsHistory: state.gwPointsHistory.concat(action.payload.gwPoints),
                points: state.points + action.payload.gwPoints,
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
        default:
            return state;
    }
};
