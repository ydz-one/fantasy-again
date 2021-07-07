import moment from 'moment';
import { getFdr, getFixtures, getInitialPlayerStats, getInjuryHistory, getPlayersBio, getPlayersHistory } from '../data/api';
import { DataAction, DataActionTypes, DataState, DEFAULT_SEASON, InitialPlayersStats, InjuryHistory, PlayerFixtureStats, PlayersHistory, PlayersStats, prevSeasonMap } from '../types';

const populateInitialStats = (initialPlayersStats: InitialPlayersStats, injuryHistory: InjuryHistory, playersHistory: PlayersHistory): PlayersStats => {
    const playersStats: PlayersStats = {};
    const prevSeason = prevSeasonMap[DEFAULT_SEASON];
    for (const [key, obj] of Object.entries(initialPlayersStats)) {
        const total_points = playersHistory[key] && Object.keys(playersHistory[key]).length && playersHistory[key][prevSeason] ?
            playersHistory[key][prevSeason].total_points : 0;
        const { value, selected, influence, creativity, threat, ict_index } = obj;
        const stats = {
            code: key,
            form: 0,
            latest_gw_points: 0,
            total_points,
            value,
            selected,
            influence,
            creativity,
            threat,
            ict_index,
            injured: 0,
            injury: '',
            injury_end: '',
            fixtureStats: []
        }
        injuryHistory['1'].forEach(injuryData => {
            const { code, injured, injury, injury_end } = injuryData;
            if (injured === 1 && playersStats[code]) {
                playersStats[code].injured = injured;
                playersStats[code].injury = injury;
                playersStats[code].injury_end = injury_end;
            }
        });
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

export const dataReducer = (state: DataState = getInitialDataState(), action: DataAction): DataState => {
    switch (action.type) {
        case DataActionTypes.SetFdrAction:
            return {
                ...state,
                fdr: action.payload
            };
        default:
            return state;
    }
}