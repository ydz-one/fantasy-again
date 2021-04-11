export interface DataState {
    fixtures: FixtureData
}

export enum DataActionTypes {
    SetFixturesAction = 'SetFixtureAction'
}

export interface SetFixturesAction {
    type: DataActionTypes.SetFixturesAction;
    payload: FixtureData;
}

export type DataAction = SetFixturesAction;

export type FixtureData = Fixture[][];

export type Fixture = {
    id: number,
    event: number,
    eventDay: number,
    kickoffDate: string,
    teamA: string,
    teamADifficulty: number,
    teamAScore: number,
    teamH: string,
    teamHDifficulty: number,
    teamHScore: number
};