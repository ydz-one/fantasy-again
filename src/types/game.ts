import { Position } from './data';

export interface GameState {
    gameweek: number;
    points: number;
    isSquadComplete: boolean;
    squad: Squad;
}

export type Squad = {
    GK: string[];
    DEF: string[];
    MID: string[];
    FWD: string[];
    SUB: string[];
    CAP: string;
    VC: string;
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
        playerToAdd: string;
    };
}

export type GameAction = IncrementGameweekAction | AddPointsAction | AddPlayerToSquad;
