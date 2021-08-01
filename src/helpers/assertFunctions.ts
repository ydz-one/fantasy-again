import { SquadPlayer } from '../types';

export function assertIsArrayOfSquadPlayers(obj: unknown): asserts obj is SquadPlayer[] {
    if (Array.isArray(obj) && (obj.length === 0 || obj[0].buyPrice)) return;
    else throw new Error('Input must be an array of players');
}
