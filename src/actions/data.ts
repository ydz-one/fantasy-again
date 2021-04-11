import { DataActionTypes, FixtureData, SetFixturesAction } from "../types";

export const SetFixtures = (fixtures: FixtureData): SetFixturesAction => {
    return {
        type: DataActionTypes.SetFixturesAction,
        payload: fixtures
    };
}