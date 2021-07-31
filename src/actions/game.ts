import { GameAction, GameActionTypes, Position, SquadPlayer } from '../types';

export const incrementGameweek = (): GameAction => ({
    type: GameActionTypes.IncrementGameweek,
});

export const addPoints = (points: number): GameAction => ({
    type: GameActionTypes.AddPoints,
    payload: points,
});

// Only use for adding/replacing players on the Select Squad page, not to be used for transfers on the Transfers page
export const addPlayerToSquad = (
    position: Position,
    playerToReplace: SquadPlayer,
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
