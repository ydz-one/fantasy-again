import { Position } from './data';

export interface GameState {
    gameweek: number;
    points: number;
    isSquadComplete: boolean;
    squad: Squad;
    squadPointsHistory: SquadPoints[];
    gwPointsHistory: number[];
    balance: number;
}

export type SquadPlayer = {
    code: string;
    buyPrice: number;
};

export type SquadPlayerPoints = {
    position: string;
    name: string;
    code: string;
    teamCode: string;
    value: string;
    injured: number;
    injury: string;
    injuryEnd: string;
    hasRedCard: boolean;
    captainStatus: string;
    subStatus: string;
};

// The first four keys are kept in all caps to match the position names from the data
export type Squad = {
    GK: SquadPlayer[];
    DEF: SquadPlayer[];
    MID: SquadPlayer[];
    FWD: SquadPlayer[];
    subs: string[];
    subGk: string;
    captain: string;
    viceCaptain: string;
};

export type SquadPoints = {
    GK: SquadPlayerPoints[];
    DEF: SquadPlayerPoints[];
    MID: SquadPlayerPoints[];
    FWD: SquadPlayerPoints[];
    subs: SquadPlayerPoints[];
    subGk: SquadPlayerPoints;
};

export enum Season {
    S2017_2018 = '2017/18',
    S2018_2019 = '2018/19',
    S2019_2020 = '2019/20',
    S2020_2021 = '2020/21',
}

export const prevSeasonMap = {
    [Season.S2020_2021]: Season.S2019_2020.toString(),
};

export const DEFAULT_SEASON = Season.S2020_2021;

export enum GameActionTypes {
    IncrementGameweek = 'IncrementGameweek',
    AddSquadPointsToHistory = 'AddSquadPointsToHistory',
    AddPlayerToSquad = 'AddPlayerToSquad',
    FinalizeSquad = 'FinalizeSquad',
    ResetSquad = 'ResetSquad',
    SetSquad = 'SetSquad',
    MakeCaptain = 'MakeCaptain',
    MakeViceCaptain = 'MakeViceCaptain',
    SubPlayer = 'SubPlayer',
}

export interface IncrementGameweekAction {
    type: GameActionTypes.IncrementGameweek;
}

export interface AddSquadPointsToHistoryAction {
    type: GameActionTypes.AddSquadPointsToHistory;
    payload: {
        squadPoints: SquadPoints;
        gwPoints: number;
    };
}

export interface AddPlayerToSquad {
    type: GameActionTypes.AddPlayerToSquad;
    payload: {
        position: Position;
        playerToReplace: SquadPlayer;
        playerToAdd: SquadPlayer;
    };
}

export interface FinalizeSquad {
    type: GameActionTypes.FinalizeSquad;
}

export interface ResetSquad {
    type: GameActionTypes.ResetSquad;
}

export interface SetSquad {
    type: GameActionTypes.SetSquad;
    payload: Squad;
}

export interface MakeCaptain {
    type: GameActionTypes.MakeCaptain;
    payload: {
        playerCode: string;
    };
}

export interface MakeViceCaptain {
    type: GameActionTypes.MakeViceCaptain;
    payload: {
        playerCode: string;
    };
}

export interface SubPlayer {
    type: GameActionTypes.SubPlayer;
    payload: {
        player1: string;
        player2: string;
    };
}

export type GameAction =
    | IncrementGameweekAction
    | AddSquadPointsToHistoryAction
    | AddPlayerToSquad
    | FinalizeSquad
    | ResetSquad
    | SetSquad
    | MakeCaptain
    | MakeViceCaptain
    | SubPlayer;
