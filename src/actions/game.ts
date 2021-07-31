import { GameAction, GameActionTypes, Position, SquadPlayer } from '../types';

export const incrementGameweek = (): GameAction => ({
    type: GameActionTypes.IncrementGameweek,
});

export const addPoints = (points: number): GameAction => ({
    type: GameActionTypes.AddPoints,
    payload: points,
});

export const addPlayerToSquad = (
    position: Position,
    playerToReplace: string,
    playerToAdd: SquadPlayer
): GameAction => ({
    type: GameActionTypes.AddPlayerToSquad,
    payload: {
        position,
        playerToReplace,
        playerToAdd,
    },
});

export const finalizeSquad = (): GameAction => ({
    type: GameActionTypes.FinalizeSquad,
});

export const resetSquad = (): GameAction => ({
    type: GameActionTypes.ResetSquad,
});
