import { NumericLiteral } from "typescript";

export interface DataState {
    fdr: FdrData
}

export enum DataActionTypes {
    SetFixturesAction = 'SetFixtureAction'
}

export interface SetFixturesAction {
    type: DataActionTypes.SetFixturesAction;
    payload: FdrData;
}

export type DataAction = SetFixturesAction;

export type FdrData = FdrFixture[][][];

export type FdrFixture = {
    opponent: number;
    isHome: boolean;
    difficulty: number;
};