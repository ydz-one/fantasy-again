import { GameAction, GameActionTypes } from '../types';

export const incrementGameweek = (): GameAction => ({
    type: GameActionTypes.IncrementGameweek,
});

export const addPoints = (points: number): GameAction => ({
    type: GameActionTypes.AddPoints,
    payload: points,
});
