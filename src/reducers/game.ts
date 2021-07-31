import { GameState, GameAction, GameActionTypes } from '../types';

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
            SUB: [],
            CAP: '-1',
            VC: '-1',
        },
        balance: 1000,
    };
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
                    SUB: [],
                    CAP: '-1',
                    VC: '-1',
                },
                balance: 1000,
            };
        default:
            return state;
    }
};
