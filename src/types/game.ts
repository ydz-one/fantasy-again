export interface GameState {
    gameweek: number,
    points: number
}

export enum Season {
    S2017_2018 = 'S2017_2018',
    S2018_2019 = 'S2018_2019',
    S2019_2020 = 'S2019_2020',
    S2020_2021 = 'S2020_2021'
}

export const DEFAULT_SEASON = Season.S2018_2019;

export enum GameActionTypes {
    IncrementGameweek = 'IncrementGameweek',
    AddPoints = 'AddPoints',
    SetFixtureData = 'SetFixtureData'
}

export interface IncrementGameweekAction {
    type: GameActionTypes.IncrementGameweek;
}

export interface AddPointsAction {
    type: GameActionTypes.AddPoints;
    payload: number;
}

export type GameAction = IncrementGameweekAction | AddPointsAction;