import { assertIsArrayOfSquadPlayers } from '../helpers';
import { GameState, GameAction, GameActionTypes, Squad, Position } from '../types';

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
        balance: STARTING_BALANCE,
    };
};

const getSquadValueTotal = (squad: Squad) => {
    let sum = 0;
    for (const [position, players] of Object.entries(squad)) {
        if (position in Position) {
            assertIsArrayOfSquadPlayers(players);
            sum += players.reduce((acc, player) => {
                acc += player.buyPrice;
                return acc;
            }, 0);
        }
    }
    return sum;
};

export const gameReducer = (state: GameState = getInitialGameState(), action: GameAction): GameState => {
    switch (action.type) {
        case GameActionTypes.IncrementGameweek:
            return {
                ...state,
                gameweek: state.gameweek + 1,
            };
        case GameActionTypes.AddPoints:
            return {
                ...state,
                points: state.points + action.payload,
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
                balance: STARTING_BALANCE - getSquadValueTotal(action.payload),
            };
        default:
            return state;
    }
};
