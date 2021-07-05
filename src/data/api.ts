import { FdrData as FdrData, Season } from "../types";
import fdr2021 from './2020_2021/fdr.json';
import { TEAM_FULL_NAMES as TEAM_FULL_NAMES_2021, TEAM_NAMES as TEAM_NAMES_2021 } from "./2020_2021/teams";

export const getFdr = (season: Season): FdrData => {
    switch (season) {
        case Season.S2020_2021:
            return fdr2021;
        default:
            return [];
    }
};

export const getTeamNames = (season: Season): string[] => {
    switch (season) {
        case Season.S2020_2021:
            return TEAM_NAMES_2021;
        default:
            return [];
    }
};

export const getTeamFullNames = (season: Season): string[] => {
    switch (season) {
        case Season.S2020_2021:
            return TEAM_FULL_NAMES_2021;
        default:
            return [];
    }
};

