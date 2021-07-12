import { FdrFixture, PlayerFixtureStats } from "./data";

export interface FdrRow {
    [key: string]: string | FdrFixture[];
};

export interface NameCellData {
    name: string;
    position: string;
    injured: number;
    injury: string;
    injury_end: string; 
}

export interface PlayerStatsRow {
    [key: string]: NameCellData | number | string | FdrFixture[];
};