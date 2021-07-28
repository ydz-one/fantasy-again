import { FdrFixture } from './data';

export interface FdrRow {
    [key: string]: string | FdrFixture[];
}

export interface NameCellData {
    name: string;
    position: string;
    injured: number;
    injury: string;
    injuryEnd: string;
}

export interface PlayerStatsRow {
    [key: string]: NameCellData | number | string | FdrFixture[];
}
