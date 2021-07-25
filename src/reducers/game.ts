import { GameState, GameAction, GameActionTypes, Position } from '../types';

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
                squad: {
                    ...state.squad,
                    [position]:
                        playerToReplace === '-1'
                            ? playersInRole.concat(playerToAdd)
                            : playersInRole.splice(playersInRole.indexOf(playerToReplace), 1, playerToAdd),
                },
            };
        default:
            return state;
    }
};
