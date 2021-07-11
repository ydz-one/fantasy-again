import moment, { Moment } from 'moment';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'node:constants';
import { moveMessagePortToContext } from 'node:worker_threads';
import { getFdr, getFixtures, getInitialPlayerStats, getInjuryHistory, getPlayersBio, getPlayersHistory, getPreGwDates, getTransfers } from '../data/api';
import { DataAction, DataActionTypes, DataState, DEFAULT_SEASON, InitialPlayersStats, InjuryHistory, PlayerFixtureStats, PlayersBio, PlayersHistory, PlayersStats, prevSeasonMap, TransferEvent } from '../types';

const updateInjuryData = (playersStats: PlayersStats, injuryHistory: InjuryHistory, gwNum: number) => {
    if (injuryHistory[gwNum]) {
        injuryHistory[gwNum].forEach(injuryData => {
            const { code, injured, injury, injury_end } = injuryData;
            if (injured === 1 && playersStats[code]) {
                playersStats[code].injured = injured;
                playersStats[code].injury = injury;
                playersStats[code].injury_end = injury_end;
            }
        });
    }
};

const populateInitialStats = (initialPlayersStats: InitialPlayersStats, injuryHistory: InjuryHistory, playersHistory: PlayersHistory): PlayersStats => {
    const playersStats: PlayersStats = {};
    const prevSeason = prevSeasonMap[DEFAULT_SEASON];
    for (const [key, obj] of Object.entries(initialPlayersStats)) {
        let bonus = 0;
        let season_points = 0;
        if (playersHistory[key] && Object.keys(playersHistory[key]).length && playersHistory[key][prevSeason]) {
            bonus = playersHistory[key][prevSeason].bonus;
            season_points = playersHistory[key][prevSeason].total_points;
        }
        const { value, selected, influence, creativity, threat, ict_index } = obj;
        const stats = {
            bonus,
            code: key,
            form: 0,
            latest_gw_points: 0,
            latest_gw: '0',
            season_points,
            value,
            selected,
            influence,
            creativity,
            threat,
            ict_index,
            injured: 0,
            injury: '',
            injury_end: '',
            transfers_in: 0,
            transfers_out: 0,
            fixtureStats: []
        }
        updateInjuryData(playersStats, injuryHistory, 0);
        playersStats[key] = stats;
    }
    return playersStats;
}

const getInitialDataState = () => {
    const playersBio = getPlayersBio(DEFAULT_SEASON);
    const playersHistory = getPlayersHistory(DEFAULT_SEASON);
    const injuryHistory = getInjuryHistory(DEFAULT_SEASON);
    const initialPlayerStats = getInitialPlayerStats(DEFAULT_SEASON);
    return {
        fdr: getFdr(DEFAULT_SEASON),
        fixtures: getFixtures(DEFAULT_SEASON),
        injuryHistory,
        playersBio,
        playersHistory,
        playersStats: populateInitialStats(initialPlayerStats, injuryHistory, playersHistory)
    };
}

const updatePlayersBio = (state: DataState, action: DataAction): PlayersBio => {
    const { gwNum } = action;
    const transfers = getTransfers(DEFAULT_SEASON);
    if (!transfers[gwNum]) {
        return state.playersBio;
    }
    return {
        ...state.playersBio,
        ...transfers[gwNum].reduce((acc: PlayersBio, transfer: TransferEvent) => {
            const { code, target_team } = transfer;
            acc[code] = {
                ...state.playersBio[code],
                team_code: target_team
            }
            return acc;
        }, {})
    }
};

const calculateForm = (preGwDate: Moment, playerFixtures: PlayerFixtureStats[]): number => {
    let sum = 0.0;
    let n = 0;
    const cutoffDate = preGwDate.subtract(30, 'days');
    for (let i = playerFixtures.length - 1; i >= 0; i--) {
        if (playerFixtures[i].kickoff_time.isBefore(cutoffDate)) {
            break;
        }
        sum += playerFixtures[i].total_points;
        n++;
    }
    return sum / n;
}

const updatePlayersStats = (state: DataState, action: DataAction): PlayersStats => {
    const { gwNum, payload, shouldResetPoints } = action;
    const newPlayersStats: PlayersStats = {};
    for (const [playerCode, playerStats] of Object.entries(state.playersStats)) {
        newPlayersStats[playerCode] = {
            ...playerStats,
            bonus : shouldResetPoints ? 0 : playerStats.bonus,
            season_points: shouldResetPoints ? 0 : playerStats.season_points
        };
    }
    payload.forEach(playerGwData => {
        const { 
            code,
            assists,
            bonus,
            clean_sheets,
            creativity,
            fixture,
            goals_conceded,
            goals_scored,
            ict_index,
            influence,
            minutes,
            own_goals,
            penalties_missed,
            penalties_saved,
            kickoff_time,
            red_cards,
            round,
            saves,
            selected,
            threat,
            total_points,
            transfers_in,
            transfers_out,
            value,
            yellow_cards
        } = playerGwData;
        const { bonus: oldBonus, latest_gw, latest_gw_points, season_points, fixtureStats } = newPlayersStats[code];
        fixtureStats.push({
            assists,
            bonus,
            clean_sheets,
            fixture,
            goals_conceded,
            goals_scored,
            kickoff_time: moment(kickoff_time),
            minutes,
            own_goals,
            penalties_missed,
            penalties_saved,
            red_cards,
            yellow_cards,
            round,
            saves,
            total_points,
            value
        });
        newPlayersStats[code] = {
            ...newPlayersStats[code],
            bonus: oldBonus + bonus,
            form: calculateForm(getPreGwDates(DEFAULT_SEASON, gwNum), newPlayersStats[code].fixtureStats),
            latest_gw_points: latest_gw === round ? latest_gw_points + total_points : total_points,
            latest_gw: round,
            season_points: season_points + total_points,
            selected,
            influence,
            creativity,
            threat,
            ict_index,
            value,
            injured: 0,
            injury: '',
            injury_end: '',
            transfers_in,
            transfers_out,
            fixtureStats
        }
    });
    updateInjuryData(newPlayersStats, state.injuryHistory, action.gwNum);
    return newPlayersStats;
}

export const dataReducer = (state: DataState = getInitialDataState(), action: DataAction): DataState => {
    switch (action.type) {
        case DataActionTypes.loadNewGwData:
            return {
                ...state,
                playersBio: updatePlayersBio(state, action),
                playersStats: updatePlayersStats(state, action)
            }
        default:
            return state;
    }
}