import { FdrData, Fixtures, PlayersHistory, PlayersBio, PlayerGw, Season, InitialPlayersStats, InjuryHistory } from "../types";
import fdr2021 from './2020_2021/fdr.json';
import fixtures2021 from './2020_2021/fixtures.json';
import history2021 from './2020_2021/history.json';
import initialPlayerStats2021 from './2020_2021/initial_player_stats.json';
import injuryHistory2021 from './2020_2021/injury_history.json';
import players2021 from './2020_2021/players.json';
import { TEAM_FULL_NAMES as TEAM_FULL_NAMES_2021, TEAM_NAMES as TEAM_NAMES_2021 } from "./2020_2021/teams";
import { getGw as getGw2021 } from './2020_2021/gw';

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

