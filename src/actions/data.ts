import { DataActionTypes, FdrData, SetFixturesAction } from "../types";

export const SetFixtures = (fixtures: FdrData): SetFixturesAction => {
    return {
        type: DataActionTypes.SetFixturesAction,
        payload: fixtures
    };
}