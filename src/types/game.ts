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
    code: string;
    points: number;
    team: string;
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
    subs: string[];
    subGk: string;
    captain: string;
    viceCaptain: string;
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
    AddPoints = 'AddPoints',
    AddPlayerToSquad = 'AddPlayerToSquad',
    FinalizeSquad = 'FinalizeSquad',
    ResetSquad = 'ResetSquad',
    SetSquad = 'SetSquad',
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

export interface AddPointsAction {
    type: GameActionTypes.AddPoints;
    payload: number;
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

export type GameAction =
    | IncrementGameweekAction
    | AddSquadPointsToHistoryAction
    | AddPointsAction
    | AddPlayerToSquad
    | FinalizeSquad
    | ResetSquad
    | SetSquad;
