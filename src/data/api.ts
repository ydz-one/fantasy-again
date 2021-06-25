import { FixtureData, Season } from "../types";
import fixtures1819 from './2018_2019/fixtures.json';
import { TEAM_FULL_NAMES as TEAM_FULL_NAMES_1819, TEAM_NAMES as TEAM_NAMES_1819 } from "./2018_2019/teamNames";

export const getFixtures = (season: Season): FixtureData => {
    switch (season) {
        case Season.S2018_2019:
            return fixtures1819;
        default:
            return [];
    }
};

export const getTeamNames = (season: Season): string[] => {
    switch (season) {
        case Season.S2018_2019:
            return TEAM_NAMES_1819;
        default:
            return [];
    }
};

export const getTeamFullNames = (season: Season): string[] => {
    switch (season) {
        case Season.S2018_2019:
            return TEAM_FULL_NAMES_1819;
        default:
            return [];
    }
};

