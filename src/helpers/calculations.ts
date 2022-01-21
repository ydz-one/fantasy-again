import { POINTS_SYSTEM } from '../constants';
import { getTeamCodeToId } from '../data';
import {
    DEFAULT_SEASON,
    FdrData,
    InGameTransfer,
    PlayerFixtureStats,
    PlayersBio,
    PlayersStats,
    Position,
    Squad,
    SquadPlayer,
} from '../types';
import { assertIsArrayOfSquadPlayers, assertIsPosition } from './assertFunctions';
import { formatPoints } from './formatters';

const MAX_PLAYERS_PER_TEAM = 3;
const MIN_FIELED_PLAYERS = {
    GK: 1,
    DEF: 3,
    MID: 2,
    FWD: 1,
};

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

export const calcPoints = (field: keyof PlayerFixtureStats, value: number, position: Position) => {
    if (field === 'minutes') {
        return value >= 60 ? 2 : value > 0 ? 1 : 0;
    }
    const pointsPerValue = POINTS_SYSTEM[position][field];
    if (pointsPerValue == null) {
        return 0;
    }
    if (pointsPerValue < 0) {
        return Math.ceil(pointsPerValue * value);
    }
    return Math.floor(pointsPerValue * value);
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

export const isSubstitute = (squad: Squad, playerCode: string): boolean =>
    squad.subGk === playerCode || squad.subs.includes(playerCode);

export const getNumberOfFieldedPlayers = (squad: Squad, position: Position): number => {
    return squad[position].reduce((count, player) => {
        if (!isSubstitute(squad, player.code)) {
            count++;
        }
        return count;
    }, 0);
};

export const checkIfMinPlayersInPosition = (squad: Squad, position: Position): boolean =>
    getNumberOfFieldedPlayers(squad, position) <= MIN_FIELED_PLAYERS[position];

export const getSubstitutionTargets = (squad: Squad, position: string, playerToSubstitute: string): string[] => {
    assertIsPosition(position);
    if (position === Position.GK) {
        return squad.GK.map((player) => player.code).filter((playerCode) => playerCode !== playerToSubstitute);
    }
    // If a player is a sub, they can substitute with any starting player, as long as subbing the starting player will not bring the number of starting players in that position to be below the minumum
    if (isSubstitute(squad, playerToSubstitute)) {
        return [Position.DEF, Position.MID, Position.FWD].reduce((targets: string[], currPosition) => {
            if (currPosition === position) {
                return targets.concat(
                    squad[currPosition]
                        .map((player) => player.code)
                        .filter((playerCode) => playerCode !== playerToSubstitute)
                );
            }
            if (checkIfMinPlayersInPosition(squad, currPosition)) {
                return targets.concat(
                    squad[currPosition]
                        .map((player) => player.code)
                        .filter((playerCode) => squad.subs.includes(playerCode))
                );
            }
            return targets.concat(squad[currPosition].map((player) => player.code));
        }, []);
    }
    // If a player is starting, they can substitute with any sub, unless his position is at the minimum number of starting players, in which case he can only substitute subs in the same position as him
    if (checkIfMinPlayersInPosition(squad, position)) {
        return squad[position]
            .filter((player) => player.code !== playerToSubstitute && isSubstitute(squad, player.code))
            .map((player) => player.code);
    }
    return squad.subs;
};

export const getPlayerSellPrice = (
    playerToReplace: string,
    squad: Squad,
    position: Position,
    marketValue: number
): number => {
    const playerIndex = squad[position].findIndex((player) => player.code === playerToReplace);
    const { buyPrice } = squad[position][playerIndex];
    const priceDiff = marketValue - buyPrice;
    const profit = priceDiff > 0 ? Math.floor(priceDiff / 2) : priceDiff;
    return buyPrice + profit;
};

export const getTempBalance = (balance: number, transfers: InGameTransfer[]) => {
    return transfers.reduce((tempBalance, transfer) => {
        return tempBalance + transfer.playerToSell.sellPrice - transfer.playerToBuy.buyPrice;
    }, balance);
};

export const getAdditionalTransfers = (freeTransfers: number, transfersMade: number) => {
    if (freeTransfers === Number.MAX_SAFE_INTEGER) {
        return '0';
    }
    const additionalTransfers = transfersMade - freeTransfers;
    const deductions = additionalTransfers * 4;
    return `${additionalTransfers} (-${deductions} pts)`;
};
