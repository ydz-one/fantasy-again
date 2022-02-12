import { Moment } from 'moment';

export interface DataState {
    fdr: FdrData;
    fixtures: Fixtures;
    injuryHistory: InjuryHistory;
    playersHistory: PlayersHistory;
    playersBio: PlayersBio;
    playersStats: PlayersStats;
}

export enum DataActionTypes {
    LoadNewGwData = 'LoadNewGwData',
    ResetDataState = 'ResetDataState',
}

export interface LoadNewGwDataAction {
    type: DataActionTypes.LoadNewGwData;
    payload: {
        gw: PlayerGw[];
        gwMeta: PlayerGwMeta[];
    };
    gwNum: number;
    shouldResetPoints: boolean;
}

export interface ResetDataStateAction {
    type: DataActionTypes.ResetDataState;
}

export type DataAction = LoadNewGwDataAction | ResetDataStateAction;

// 3D array with the following dimensions:
// i: the index position of teams in TEAM_FULL_NAMES and TEAM_NAMES from teams.ts
// j: the gameweek number - 1
// k: fixtures in gameweek (j + 1), there could be multiple fixtures per gameweek
export type FdrData = FdrFixture[][][];

export type FdrFixture = {
    opponent: number;
    isHome: boolean;
    difficulty: number;
    kickoffTime: string;
    round: number;
};

export type PlayerGw = {
    name: string;
    xP: number;
    assists: number;
    bonus: number;
    bps: number;
    cleanSheets: number;
    creativity: number;
    element: string;
    fixture: string;
    goalsConceded: number;
    goalsScored: number;
    ictIndex: number;
    influence: number;
    kickoffTime: string;
    minutes: number;
    opponentTeam: number;
    ownGoals: number;
    penaltiesMissed: number;
    penaltiesSaved: number;
    redCards: number;
    round: string;
    saves: number;
    teamAScore: number;
    teamHScore: number;
    threat: number;
    totalPoints: number;
    wasHome: boolean;
    yellowCards: number;
    webName: string;
    code: string;
};

export type PlayerGwMeta = {
    code: string;
    selected: number;
    transfersBalance: number;
    transfersIn: number;
    transfersOut: number;
    value: number;
};

export type PlayerBio = {
    code: string;
    firstName: string;
    id: string;
    secondName: string;
    teamCode: string;
    webName: string;
    position: string;
    transfers?: TransferEvent[];
};

export type PlayersBio = {
    [key: string]: PlayerBio;
};

export type PlayerFixtureStats = {
    assists: number;
    bonus: number;
    cleanSheets: number;
    fixture: string;
    goalsConceded: number;
    goalsScored: number;
    kickoffTime: Moment;
    minutes: number;
    ownGoals: number;
    penaltiesMissed: number;
    penaltiesSaved: number;
    redCards: number;
    yellowCards: number;
    round: string;
    saves: number;
    totalPoints: number;
};

export type PlayerStats = {
    bonus: number;
    code: string;
    form: number;
    latestGwPoints: number;
    latestGw: string;
    seasonPoints: number;
    selected: number;
    influence: number;
    creativity: number;
    threat: number;
    ictIndex: number;
    value: number;
    injured: number;
    injury: string;
    injuryEnd: string;
    transfersIn: number;
    transfersOut: number;
    fixtureStats: PlayerFixtureStats[];
};

export type PlayersStats = {
    [key: string]: PlayerStats;
};

export type Fixture = {
    code: string;
    event: string;
    id: string;
    kickoffTime: string;
    teamA: number;
    teamAScore: number;
    teamH: number;
    teamHScore: number;
    teamHDifficulty: number;
    teamADifficulty: number;
};

export type Fixtures = {
    [key: string]: Fixture;
};

export type HistoryRecord = {
    assists: number;
    bonus: number;
    bps: number;
    cleanSheets: number;
    creativity: number;
    elementCode: string;
    endCost: number;
    goalsConceded: number;
    goalsScored: number;
    ictIndex: number;
    influence: number;
    minutes: number;
    ownGoals: number;
    penaltiesMissed: number;
    penaltiesSaved: number;
    redCards: number;
    saves: number;
    seasonName: string;
    startCost: number;
    threat: number;
    totalPoints: number;
    yellowCards: number;
};

export type PlayersHistory = {
    [key: string]: {
        [key: string]: HistoryRecord;
    };
};

export type InitialPlayersStats = {
    [key: string]: InitialPlayerStats;
};

export type InitialPlayerStats = {
    value: number;
    selected: number;
    influence: number;
    creativity: number;
    threat: number;
    ictIndex: number;
};

export type InjuryHistory = {
    [key: string]: Injury[];
};

export type Injury = {
    code: string;
    webName: string;
    injured: number;
    injury: string;
    injuryEnd: string;
};

export type TransferData = {
    [key: string]: TransferEvent[];
};

export type TransferEvent = {
    gw: number;
    code: string;
    webName: string;
    sourceTeam: string;
    targetTeam: string;
};

export const positions = ['GK', 'DEF', 'MID', 'FWD'];

export enum Position {
    GK = 'GK',
    DEF = 'DEF',
    MID = 'MID',
    FWD = 'FWD',
}

export const positionData: { [key: string]: { name: string; sortOrder: number; color: string; isDarkFont: boolean } } =
    {
        GK: {
            name: 'Goalkeeper',
            sortOrder: 1,
            color: '#ebff00',
            isDarkFont: true,
        },
        DEF: {
            name: 'Defender',
            sortOrder: 2,
            color: '#00ff87',
            isDarkFont: true,
        },
        MID: {
            name: 'Midfielder',
            sortOrder: 3,
            color: '#05f0ff',
            isDarkFont: true,
        },
        FWD: {
            name: 'Forward',
            sortOrder: 4,
            color: '#e90052',
            isDarkFont: false,
        },
    };
