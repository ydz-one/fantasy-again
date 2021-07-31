import { Position } from './data';

export interface GameState {
    gameweek: number;
    points: number;
    isSquadComplete: boolean;
    squad: Squad;
    balance: number;
}

export type Squad = {
    GK: SquadPlayer[];
    DEF: SquadPlayer[];
    MID: SquadPlayer[];
    FWD: SquadPlayer[];
    SUB: SquadPlayer[];
    CAP: string;
    VC: string;
};

export type SquadPlayer = {
    code: string;
    buyPrice: number;
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
    AddPoints = 'AddPoints',
    AddPlayerToSquad = 'AddPlayerToSquad',
    FinalizeSquad = 'FinalizeSquad',
    ResetSquad = 'ResetSquad',
}

export interface IncrementGameweekAction {
    type: GameActionTypes.IncrementGameweek;
}

export interface AddPointsAction {
    type: GameActionTypes.AddPoints;
    payload: number;
}

export interface AddPlayerToSquad {
    type: GameActionTypes.AddPlayerToSquad;
    payload: {
        position: Position;
        playerToReplace: string;
        playerToAdd: SquadPlayer;
    };
}

export interface FinalizeSquad {
    type: GameActionTypes.FinalizeSquad;
}

export interface ResetSquad {
    type: GameActionTypes.ResetSquad;
}

export type GameAction = IncrementGameweekAction | AddPointsAction | AddPlayerToSquad | FinalizeSquad | ResetSquad;
