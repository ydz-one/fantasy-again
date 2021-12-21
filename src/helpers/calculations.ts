import { getTeamCodeToId } from '../data';
import {
    DEFAULT_SEASON,
    FdrData,
    PlayerFixtureStats,
    PlayersBio,
    PlayersStats,
    Position,
    Squad,
    SquadPlayer,
} from '../types';
import { assertIsArrayOfSquadPlayers } from './assertFunctions';
import { formatPoints } from './formatters';

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

export const didPlayerGetRedCard = (fixtureStats: PlayerFixtureStats[], gameweek: string) => {
    const redCardCount = fixtureStats.reduce((acc, stats: PlayerFixtureStats) => {
        if (stats.round === gameweek) {
            acc += stats.redCards;
        }
        return acc;
    }, 0);
    return redCardCount > 0;
};

export const calcGwPointsTotal = (squad: Squad, playersStats: PlayersStats) => {
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

export const autoSub = (squad: Squad) => {
    // TODO: Implement
    return squad;
};

export const getPointsMultiplier = (isCaptain: boolean, isViceCaptain: boolean, didPlayerPlay: boolean) => {
    if (isCaptain) {
        return 2;
    }
    if (isViceCaptain && !didPlayerPlay) {
        return 2;
    }
    return 1;
};

export const getSquadPoints = (squad: Squad, playersStats: PlayersStats, playersBio: PlayersBio, gameweek: number) => {
    const getPlayerGwPoints = (code: string) => {
        const { webName, teamCode, position } = playersBio[code];
        const { injured, injury, injuryEnd, latestGwPoints, fixtureStats } = playersStats[code];
        const hasRedCard = didPlayerGetRedCard(fixtureStats, gameweek.toString());
        const isCaptain = squad.captain === code;
        const isViceCaptain = squad.viceCaptain === code;
        const pointsMultiplyer = getPointsMultiplier(isCaptain, isViceCaptain, didPlayerPlay(code, playersStats));
        const value = formatPoints(latestGwPoints * pointsMultiplyer);
        const captainStatus = isCaptain ? 'C' : isViceCaptain ? 'VC' : '';
        const subStatus = '';
        return {
            position,
            name: webName,
            code,
            teamCode,
            value,
            injured,
            injury,
            injuryEnd,
            hasRedCard,
            captainStatus,
            subStatus,
        };
    };
    const squadPlayerToSquadPlayerPoints = (player: SquadPlayer) => {
        return getPlayerGwPoints(player.code);
    };
    const shouldShowPlayer = (squadPlayer: SquadPlayer) => {
        return !squad.subs.includes(squadPlayer.code) && squadPlayer.code !== squad.subGk;
    };
    const { GK, DEF, MID, FWD, subs, subGk } = squad;
    return {
        GK: GK.filter(shouldShowPlayer).map(squadPlayerToSquadPlayerPoints),
        DEF: DEF.filter(shouldShowPlayer).map(squadPlayerToSquadPlayerPoints),
        MID: MID.filter(shouldShowPlayer).map(squadPlayerToSquadPlayerPoints),
        FWD: FWD.filter(shouldShowPlayer).map(squadPlayerToSquadPlayerPoints),
        subs: subs.map(getPlayerGwPoints),
        subGk: getPlayerGwPoints(subGk),
    };
};
