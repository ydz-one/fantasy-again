import { PlayersBio, Position, Squad, SquadPlayer } from '../types';

const MAX_PLAYERS_PER_TEAM = 3;

function assertIsArrayOfSquadPlayers(obj: unknown): asserts obj is SquadPlayer[] {
    if (Array.isArray(obj) && (obj.length === 0 || obj[0].buyPrice)) return;
    else throw new Error('Input must be an array of players');
}

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
