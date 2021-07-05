export interface DataState {
    fdr: FdrData
}

export enum DataActionTypes {
    SetFdrAction = 'SetFdrAction'
}

export interface SetFdrAction {
    type: DataActionTypes.SetFdrAction;
    payload: FdrData;
}

export type DataAction = SetFdrAction;

export type FdrData = FdrFixture[][][];

export type FdrFixture = {
    opponent: number;
    isHome: boolean;
    difficulty: number;
};