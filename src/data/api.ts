import { FdrData, Fixtures, PlayersHistory, PlayersBio, PlayerGw, Season, InitialPlayersStats, InjuryHistory, TransferData, PlayerGwMeta } from "../types";
import fdr2021 from './2020_2021/fdr.json';
import fixtures2021 from './2020_2021/fixtures.json';
import history2021 from './2020_2021/history.json';
import initialPlayerStats2021 from './2020_2021/initial_player_stats.json';
import injuryHistory2021 from './2020_2021/injury_history.json';
import players2021 from './2020_2021/players.json';
import { TEAM_CODE_TO_ID as TEAM_CODE_TO_ID_2021, TEAM_FULL_NAMES as TEAM_FULL_NAMES_2021, TEAM_NAMES as TEAM_NAMES_2021, transfers as transfers2021 } from "./2020_2021/teams";
import { getGw as getGw2021, getGwMeta as getGwMeta2021 } from './2020_2021/gw';
import { preGwDates as preGwDates2021 } from "./2020_2021/preGwDates";

export const getFdr = (season: Season): FdrData => {
    switch (season) {
        case Season.S2020_2021:
            return fdr2021;
        default:
            throw new Error('Season not found');
    }
};

export const getPlayersBio = (season: Season): PlayersBio => {
    switch (season) {
        case Season.S2020_2021:
            return players2021;
        default:
            throw new Error('Season not found');
    }
};

export const getFixtures = (season: Season): Fixtures => {
    switch (season) {
        case Season.S2020_2021:
            return fixtures2021;
        default:
            throw new Error('Season not found');
    }
};

export const getPlayersHistory = (season: Season): PlayersHistory => {
    switch (season) {
        case Season.S2020_2021:
            return history2021;
        default:
            throw new Error('Season not found');
    }
};

export const getGw = (season: Season, gwNum: number): PlayerGw[] => {
    switch (season) {
        case Season.S2020_2021:
            return getGw2021(gwNum);
        default:
            throw new Error('Season not found');
    }
};

export const getGwMeta = (season: Season, gwNum: number): PlayerGwMeta[] => {
    switch (season) {
        case Season.S2020_2021:
            return getGwMeta2021(gwNum);
        default:
            throw new Error('Season not found');
    }
};

export const getInitialPlayerStats = (season: Season): InitialPlayersStats => {
    switch (season) {
        case Season.S2020_2021:
            return initialPlayerStats2021;
        default:
            throw new Error('Season not found');
    }
}

export const getInjuryHistory = (season: Season): InjuryHistory => {
    switch (season) {
        case Season.S2020_2021:
            return injuryHistory2021;
        default:
            throw new Error('Season not found');
    }
}

export const getTeamNames = (season: Season): string[] => {
    switch (season) {
        case Season.S2020_2021:
            return TEAM_NAMES_2021;
        default:
            throw new Error('Season not found');
    }
};

export const getTeamFullNames = (season: Season): string[] => {
    switch (season) {
        case Season.S2020_2021:
            return TEAM_FULL_NAMES_2021;
        default:
            throw new Error('Season not found');
    }
};

export const getTeamCodeToId = (season: Season): { [key: string]: number } => {
    switch (season) {
        case Season.S2020_2021:
            return TEAM_CODE_TO_ID_2021;
        default:
            throw new Error('Season not found');
    }
};

export const getTransfers = (season: Season): TransferData => {
    switch (season) {
        case Season.S2020_2021:
            return transfers2021;
        default:
            throw new Error('Season not found');
    }
}

export const getPreGwDate = (season: Season, gwNum: number): string => {
    switch (season) {
        case Season.S2020_2021:
            return preGwDates2021[gwNum];
        default:
            throw new Error('Season not found');
    }
}

