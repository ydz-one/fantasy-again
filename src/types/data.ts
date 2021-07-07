import { Moment } from "moment";

export interface DataState {
    fdr: FdrData,
    fixtures: Fixtures,
    playersHistory: PlayersHistory
}

export enum DataActionTypes {
    SetFdrAction = 'SetFdrAction'
}

export interface SetFdrAction {
    type: DataActionTypes.SetFdrAction;
    payload: FdrData;
}

export type DataAction = SetFdrAction;

export type FdrData = FdrFixture[][][];

export type FdrFixture = {
    opponent: number;
    isHome: boolean;
    difficulty: number;
};

export type PlayerGw = {
    name: string,
    position: string,
    team: string,
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
    code: string,
    team_code: string,
    injured: number,
    injury: string,
    injury_end: string
};

export type PlayerBio = {
    code: string,
    first_name: string,
    id: string,
    second_name: string,
    team_code: string,
    web_name: string,
    position: string
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
    minutes: number,
    own_goals: number,
    penalties_missed: number,
    penalties_saved: number,
    red_cards: number,
    yellow_cards: number,
    round: string,
    saves: number,
    total_points: number,
    value: number,
    injured: number,
    injury: string
}

export type PlayerStats = {
    code: string,
    form: number,
    latest_gw_points: number,
    total_points: number,
    price: number,
    selected: number,
    influence: number,
    creativity: number,
    threat: number,
    ict_index: number,
    injured: number,
    injury: string,
    injury_end: Moment,
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
    } | {}
};