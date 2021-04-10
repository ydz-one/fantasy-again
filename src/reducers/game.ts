import { GameState, GameAction, GameActionTypes } from '../types';
import { getInitialGameState } from '../utils';

export const gameReducer = (state: GameState = getInitialGameState(), action: GameAction): GameState => {
    switch (action.type) {
        case GameActionTypes.IncrementGameweek:
            return {
                ...state,
                gameweek: state.gameweek + 1
            };
        default:
            return state;
    }
};