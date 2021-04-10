import { GameState } from '../types';

export const getInitialGameState = (): GameState => {
    return {
        gameweek: 0
    };
}