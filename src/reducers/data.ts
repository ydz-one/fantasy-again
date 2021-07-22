import moment, { Moment } from 'moment';
import { getFdr, getFixtures, getInitialPlayerStats, getInjuryHistory, getPlayersBio, getPlayersHistory, getPreGwDate, getTransfers } from '../data/api';
import { DataAction, DataActionTypes, DataState, DEFAULT_SEASON, InitialPlayersStats, InjuryHistory, PlayerFixtureStats, PlayersBio, PlayersHistory, PlayersStats, prevSeasonMap, TransferEvent } from '../types';

const updateInjuryData = (playersStats: PlayersStats, injuryHistory: InjuryHistory, gwNum: number) => {
    if (injuryHistory[gwNum]) {
        injuryHistory[gwNum].forEach(injuryData => {
            const { code, injured, injury, injuryEnd } = injuryData;
            if (injured === 1 && playersStats[code]) {
                playersStats[code].injured = injured;
                playersStats[code].injury = injury;
                playersStats[code].injuryEnd = injuryEnd;
            }
        });
    }
};

const populateInitialStats = (initialPlayersStats: InitialPlayersStats, injuryHistory: InjuryHistory, playersHistory: PlayersHistory): PlayersStats => {
    const playersStats: PlayersStats = {};
    const prevSeason = prevSeasonMap[DEFAULT_SEASON];
    for (const [key, obj] of Object.entries(initialPlayersStats)) {
        let bonus = 0;
        let seasonPoints = 0;
        if (playersHistory[key] && Object.keys(playersHistory[key]).length && playersHistory[key][prevSeason]) {
            bonus = playersHistory[key][prevSeason].bonus;
            seasonPoints = playersHistory[key][prevSeason].totalPoints;
        }
        const { value, selected, influence, creativity, threat, ictIndex } = obj;
        const stats = {
            bonus,
            code: key,
            form: 0,
            latestGwPoints: 0,
            latestGw: '0',
            seasonPoints,
            value,
            selected,
            influence,
            creativity,
            threat,
            ictIndex,
            injured: 0,
            injury: '',
            injuryEnd: '',
            transfersIn: 0,
            transfersOut: 0,
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
            const { code, targetTeam } = transfer;
            acc[code] = {
                ...state.playersBio[code],
                teamCode: targetTeam,
                transfers: (state.playersBio[code].transfers || []).concat(transfer)
            };
            return acc;
        }, {})
    }
};

const calculateForm = (preGwDate: Moment, playerFixtures: PlayerFixtureStats[]): number => {
    let sum = 0.0;
    let n = 0;
    const cutoffDate = preGwDate.subtract(30, 'days');
    for (let i = playerFixtures.length - 1; i >= 0; i--) {
        if (playerFixtures[i].kickoffTime.isBefore(cutoffDate)) {
            break;
        }
        sum += playerFixtures[i].totalPoints;
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
            bonus: shouldResetPoints ? 0 : playerStats.bonus,
            seasonPoints: shouldResetPoints ? 0 : playerStats.seasonPoints
        };
    }
    payload.forEach(playerGwData => {
        const { 
            code,
            assists,
            bonus,
            cleanSheets,
            creativity,
            fixture,
            goalsConceded,
            goalsScored,
            ictIndex,
            influence,
            minutes,
            ownGoals,
            penaltiesMissed,
            penaltiesSaved,
            kickoffTime,
            redCards,
            round,
            saves,
            selected,
            threat,
            totalPoints,
            transfersIn,
            transfersOut,
            value,
            yellowCards
        } = playerGwData;
        const { bonus: oldBonus, latestGw, latestGwPoints, seasonPoints, fixtureStats } = newPlayersStats[code];
        fixtureStats.push({
            assists,
            bonus,
            cleanSheets,
            fixture,
            goalsConceded,
            goalsScored,
            kickoffTime: moment(kickoffTime),
            minutes,
            ownGoals,
            penaltiesMissed,
            penaltiesSaved,
            redCards,
            yellowCards,
            round,
            saves,
            totalPoints,
            value
        });
        newPlayersStats[code] = {
            ...newPlayersStats[code],
            bonus: oldBonus + bonus,
            form: calculateForm(moment(getPreGwDate(DEFAULT_SEASON, gwNum)), newPlayersStats[code].fixtureStats),
            latestGwPoints: latestGw === round ? latestGwPoints + totalPoints : totalPoints,
            latestGw: round,
            seasonPoints: seasonPoints + totalPoints,
            selected,
            influence,
            creativity,
            threat,
            ictIndex,
            value,
            injured: 0,
            injury: '',
            injuryEnd: '',
            transfersIn,
            transfersOut,
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