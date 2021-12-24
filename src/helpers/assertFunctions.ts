import { Position, SquadPlayer } from '../types';

export function assertIsArrayOfSquadPlayers(obj: unknown): asserts obj is SquadPlayer[] {
    if (Array.isArray(obj) && (obj.length === 0 || obj[0].buyPrice)) return;
    else throw new Error('Input must be an array of players');
}

export function assertIsPosition(obj: unknown): asserts obj is Position {
    if (
        typeof obj === 'string' &&
        (obj === Position.GK || obj === Position.DEF || obj === Position.MID || obj === Position.FWD)
    )
        return;
    else throw new Error('Input must be a Position');
}

export function assertIsNumber(obj: unknown): asserts obj is number {
    if (typeof obj === 'number') return;
    else throw new Error('Input must be a number');
}
