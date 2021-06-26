import { FixtureData, Season } from "../types";
import fixtures1819 from './2018_2019/fixtures.json';
import fixtures1920 from './2019_2020/fixtures.json';
import fixtures2021 from './2020_2021/fixtures.json';
import { TEAM_FULL_NAMES as TEAM_FULL_NAMES_1819, TEAM_NAMES as TEAM_NAMES_1819 } from "./2018_2019/teamNames";

export const getFixtures = (season: Season): FixtureData => {
    switch (season) {
        case Season.S2018_2019:
            return fixtures1819;
        case Season.S2019_2020:
            return fixtures1920;
        case Season.S2020_2021:
            return fixtures2021;
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

