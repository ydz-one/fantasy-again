import { Chip, PlayerFixtureStats } from '../types';

export const PLAYER_STATS_COLUMN_LABELS: { [key: string]: string } = {
    player: 'Player',
    form: 'Form',
    value: 'Value',
    selected: 'Selected',
    latestGwPoints: '',
    seasonPoints: 'Total Points',
    ictIndex: 'ICT Index',
    influence: 'Influence',
    creativity: 'Creativity',
    threat: 'Threat',
    transfersIn: 'GW Transfers In',
    transfersOut: 'GW Transfers Out',
    bonus: 'Bonus Points',
};

export const SUB_PLAYER_TITLES = ['S', 'S1', 'S2', 'S3'];

export const PLAYER_FIXTURE_STATS_FIELDS: (keyof PlayerFixtureStats)[] = [
    'minutes',
    'goalsScored',
    'assists',
    'cleanSheets',
    'goalsConceded',
    'saves',
    'ownGoals',
    'penaltiesSaved',
    'penaltiesMissed',
    'yellowCards',
    'redCards',
    'bonus',
];

export const PLAYER_FIXTURE_STATS_FIELD_LABELS: { [key in keyof PlayerFixtureStats]: string } = {
    minutes: 'Minutes',
    goalsScored: 'Goals scored',
    assists: 'Assists',
    cleanSheets: 'Clean sheets',
    goalsConceded: 'Goals conceded',
    saves: 'Save',
    ownGoals: 'Own goals',
    penaltiesSaved: 'Penalties saved',
    penaltiesMissed: 'Penalities missed',
    yellowCards: 'Yellow cards',
    redCards: 'Red cards',
    bonus: 'Bonus',
    fixture: 'Fixture',
    kickoffTime: 'Kickoff',
    round: 'Round',
    totalPoints: 'Total points',
};

export const CHIP_LABELS: { [key in Chip]: string } = {
    [Chip.BENCH_BOOST]: 'Bench Boost',
    [Chip.FREE_HIT]: 'Free Hit',
    [Chip.TRIPLE_CAPTAIN]: 'Triple Captain',
    [Chip.WILD_CARD]: 'Wild Card',
};
