import { GameAction, GameActionTypes, InGameTransfer, Position, Squad, SquadPlayer, SquadPoints } from '../types';

export const incrementGameweek = (): GameAction => ({
    type: GameActionTypes.IncrementGameweek,
});

export const updateGameStateAfterGw = (squadPoints: SquadPoints, gwPoints: number): GameAction => ({
    type: GameActionTypes.UpdateGameStateAfterGw,
    payload: {
        squadPoints,
        gwPoints,
    },
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

export const setSquad = (squad: Squad): GameAction => ({
    type: GameActionTypes.SetSquad,
    payload: squad,
});

export const makeCaptain = (playerCode: string): GameAction => ({
    type: GameActionTypes.MakeCaptain,
    payload: {
        playerCode,
    },
});

export const makeViceCaptain = (playerCode: string): GameAction => ({
    type: GameActionTypes.MakeViceCaptain,
    payload: {
        playerCode,
    },
});

export const subPlayer = (player1: string, player2: string): GameAction => ({
    type: GameActionTypes.SubPlayer,
    payload: {
        player1,
        player2,
    },
});

export const finalizeTransfers = (
    newSquad: Squad,
    newBalance: number,
    newNextGwCost: number,
    newFreeTransfers: number,
    transfers: InGameTransfer[]
): GameAction => ({
    type: GameActionTypes.FinalizeTransfers,
    payload: {
        newSquad,
        newBalance,
        newNextGwCost,
        newFreeTransfers,
        transfers,
    },
});
