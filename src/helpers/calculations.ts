import { getTeamCodeToId } from '../data';
import { DEFAULT_SEASON, FdrData, PlayersBio, PlayersStats, Position, Squad, SquadPlayer } from '../types';
import { assertIsArrayOfSquadPlayers } from './assertFunctions';

const MAX_PLAYERS_PER_TEAM = 3;

export const getTeamsOverMaxPlayerLimit = (squad: Squad, playersBio: PlayersBio) => {
    const teamPlayerCounts: { [key: string]: number } = {};
    for (const [position, players] of Object.entries(squad)) {
        if (position in Position) {
            assertIsArrayOfSquadPlayers(players);
            players.forEach((player) => {
                const { teamCode } = playersBio[player.code];
                teamPlayerCounts[teamCode] = (teamPlayerCounts[teamCode] | 0) + 1;
            });
        }
    }
    return Object.keys(teamPlayerCounts).filter((team) => teamPlayerCounts[team] > MAX_PLAYERS_PER_TEAM);
};

export const calcNumPlayers = (squad: Squad) => {
    let sum = 0;
    for (const [position, players] of Object.entries(squad)) {
        if (position in Position) {
            sum += players.length;
        }
    }
    return sum;
};

const calcSquadSum =
    (
        getValueFn: (squadPlayer: SquadPlayer) => number,
        filterFn?: (SquadPlayer: SquadPlayer) => boolean,
        modifierFn?: (squad: Squad) => number
    ) =>
    (squad: Squad) => {
        let sum = 0;
        for (const [position, players] of Object.entries(squad)) {
            if (position in Position) {
                assertIsArrayOfSquadPlayers(players);
                sum += players.reduce((acc, player) => {
                    if (filterFn && !filterFn(player)) {
                        return acc;
                    }
                    acc += getValueFn(player);
                    return acc;
                }, 0);
            }
        }
        if (modifierFn) {
            sum += modifierFn(squad);
        }
        return sum;
    };

export const calcSquadBuyPriceTotal = calcSquadSum((player) => player.buyPrice);

export const calcSquadValueTotal = (squad: Squad, playersStats: PlayersStats) => {
    return calcSquadSum((player) => playersStats[player.code].value)(squad);
};

export const didPlayerPlay = (playerCode: string, playersStats: PlayersStats) => {
    const { latestGw, fixtureStats } = playersStats[playerCode];
    return (
        fixtureStats.reduce((totalMinutesPlayed, fixture) => {
            if (fixture.round === latestGw) {
                totalMinutesPlayed += fixture.minutes;
            }
            return totalMinutesPlayed;
        }, 0) > 0
    );
};

export const calcLatestGwPointsTotal = (squad: Squad, playersStats: PlayersStats) => {
    return calcSquadSum(
        (player) => playersStats[player.code].latestGwPoints,
        (player) => player.code !== squad.subGk && !squad.subs.includes(player.code),
        (squad) => {
            if (didPlayerPlay(squad.captain, playersStats)) {
                return playersStats[squad.captain].latestGwPoints;
            }
            return playersStats[squad.viceCaptain].latestGwPoints;
        }
    )(squad);
};

export const getNextFixtures = (fdr: FdrData, gameweek: number, teamCode: string) => {
    const teamId = getTeamCodeToId(DEFAULT_SEASON)[teamCode];
    return fdr[teamId][gameweek];
};
