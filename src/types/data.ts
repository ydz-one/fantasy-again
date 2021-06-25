import { NumericLiteral } from "typescript";

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

export type FixtureData = Fixture[][][];

export type Fixture = {
    opponent: number;
    isHome: boolean;
    difficulty: number;
};