import { FixtureData, Season } from "../types";
import { getFixtures as getFixtures20182019 } from './2018-2019/data';

export const getFixtures = (season: Season): FixtureData => {
    switch (season) {
        case Season.S2018_2019:
            return getFixtures20182019();
        default:
            return [];
    }
};

