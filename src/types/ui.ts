import { FdrFixture, PlayerFixtureStats } from "./data";

export interface FdrRow {
    [key: string]: string | FdrFixture[];
};

export interface NameCellData {
    name: string;
    team_code: string;
    position: string;
}

export interface PlayerStatsRow {
    [key: string]: NameCellData | number | string | PlayerFixtureStats[];
};