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
            VC: '-1'
        }
    };
}

export const gameReducer = (state: GameState = getInitialGameState(), action: GameAction): GameState => {
    switch (action.type) {
        case GameActionTypes.IncrementGameweek:
            return {
                ...state,
                gameweek: state.gameweek + 1
            };
        case GameActionTypes.AddPoints:
            return {
                ...state,
                points: state.points + action.payload
            };
        default:
            return state;
    }
};