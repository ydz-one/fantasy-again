import { Position, SquadPlayer, SquadPoints } from '../types';

export function assertIsArrayOfSquadPlayers(obj: unknown): asserts obj is SquadPlayer[] {
    if (Array.isArray(obj) && (obj.length === 0 || obj[0].buyPrice)) return;
    else throw new Error('Input must be an array of SquadPlayer objects');
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

export function assertIsSquadPlayer(obj: unknown): asserts obj is SquadPlayer {
    if (typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, 'buyPrice')) return;
    else throw new Error('Input must be a SquadPlayer object');
}

export function assertIsSquadPoints(obj: unknown): asserts obj is SquadPoints {
    if (obj !== null && typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, 'GK')) return;
    else throw new Error('Input must be a SquadPoints object');
}
