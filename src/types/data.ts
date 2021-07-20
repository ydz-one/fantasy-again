import { Moment } from "moment";

export interface DataState {
    fdr: FdrData,
    fixtures: Fixtures,
    injuryHistory: InjuryHistory,
    playersHistory: PlayersHistory,
    playersBio: PlayersBio,
    playersStats: PlayersStats
}

export enum DataActionTypes {
    loadNewGwData = 'loadNewGwData'
}

export interface LoadNewGwDataAction {
    type: DataActionTypes.loadNewGwData;
    payload: PlayerGw[];
    gwNum: number,
    shouldResetPoints: boolean;
}

export type DataAction = LoadNewGwDataAction;

export type FdrData = FdrFixture[][][];

export type FdrFixture = {
    opponent: number;
    isHome: boolean;
    difficulty: number;
};

export type PlayerGw = {
    name: string,
    xP: number,
    assists: number,
    bonus: number,
    bps: number,
    clean_sheets: number,
    creativity: number,
    element: string,
    fixture: string,
    goals_conceded: number,
    goals_scored: number,
    ict_index: number,
    influence: number,
    kickoff_time: string,
    minutes: number,
    opponent_team: number,
    own_goals: number,
    penalties_missed: number,
    penalties_saved: number,
    red_cards: number,
    round: string,
    saves: number,
    selected: number,
    team_a_score: number,
    team_h_score: number,
    threat: number,
    total_points: number,
    transfers_balance: number,
    transfers_in: number,
    transfers_out: number,
    value: number,
    was_home: boolean,
    yellow_cards: number,
    web_name: string,
    code: string
};

export type PlayerBio = {
    code: string,
    first_name: string,
    id: string,
    second_name: string,
    team_code: string,
    web_name: string,
    position: string,
    transfers?: TransferEvent[]
};

export type PlayersBio = {
    [key: string] : PlayerBio
};

export type PlayerFixtureStats = {
    assists: number,
    bonus: number,
    clean_sheets: number,
    fixture: string,
    goals_conceded: number,
    goals_scored: number,
    kickoff_time: Moment,
    minutes: number,
    own_goals: number,
    penalties_missed: number,
    penalties_saved: number,
    red_cards: number,
    yellow_cards: number,
    round: string,
    saves: number,
    total_points: number,
    value: number
}

export type PlayerStats = {
    bonus: number,
    code: string,
    form: number,
    latest_gw_points: number,
    latest_gw: string,
    season_points: number,
    selected: number,
    influence: number,
    creativity: number,
    threat: number,
    ict_index: number,
    value: number,
    injured: number,
    injury: string,
    injury_end: string,
    transfers_in: number,
    transfers_out: number,
    fixtureStats: PlayerFixtureStats[]
};

export type PlayersStats = {
    [key: string] : PlayerStats
};

export type Fixture = {
    code: string,
    event: string,
    id: string,
    kickoff_time: string,
    team_a: number,
    team_a_score: number,
    team_h: number,
    team_h_score: number,
    team_h_difficulty: number,
    team_a_difficulty: number
};

export type Fixtures = {
    [key: string] : Fixture
};

export type HistoryRecord = {
    assists: number,
    bonus: number,
    bps: number,
    clean_sheets: number,
    creativity: number,
    element_code: string,
    end_cost: number,
    goals_conceded: number,
    goals_scored: number,
    ict_index: number,
    influence: number,
    minutes: number,
    own_goals: number,
    penalties_missed: number,
    penalties_saved: number,
    red_cards: number,
    saves: number,
    season_name: string,
    start_cost: number,
    threat: number,
    total_points: number,
    yellow_cards: number
};

export type PlayersHistory = {
    [key: string] : {
        [key: string] : HistoryRecord
    }
};

export type InitialPlayersStats = {
    [key: string] : InitialPlayerStats
}

export type InitialPlayerStats = {
    value: number,
    selected: number,
    influence: number,
    creativity: number,
    threat: number,
    ict_index: number
}

export type InjuryHistory = {
    [key: string] : Injury[]
}

export type Injury = {
    code: string,
    web_name: string,
    injured: number,
    injury: string,
    injury_end: string
}

export type TransferData = {
    [key: string]: TransferEvent[]
}

export type TransferEvent = {
    gw: number,
    code: string,
    web_name: string,
    source_team: string,
    target_team: string
}

export const positions = [
    'GK',
    'DEF',
    'MID',
    'FWD'
];

export enum Position {
    GK = 'GK',
    DEF = 'DEF',
    MID = 'MID',
    FWD = 'FWD'
}

export const positionData: { [key: string]: { name: string, sortOrder: number, color: string, isDarkFont: boolean } } = {
    GK: {
        name: 'Goalkeeper',
        sortOrder: 1,
        color: '#ebff00',
        isDarkFont: true
    },
    DEF: {
        name: 'Defender',
        sortOrder: 2,
        color: '#00ff87',
        isDarkFont: true
    },
    MID: {
        name: 'Midfielder',
        sortOrder: 3,
        color: '#05f0ff',
        isDarkFont: true
    },
    FWD: {
        name: 'Forward',
        sortOrder: 4,
        color: '#e90052',
        isDarkFont: false
    }
};