import { PlayerFixtureStats, Position } from '../types';

export const POINTS_SYSTEM: { [key in Position]: { [key in keyof PlayerFixtureStats]?: number } } = {
    GK: {
        goalsScored: 6,
        assists: 3,
        cleanSheets: 4,
        goalsConceded: -0.5,
        saves: 0.33333333333,
        penaltiesMissed: -2,
        penaltiesSaved: 5,
        yellowCards: -1,
        redCards: -3,
        ownGoals: -2,
        bonus: 1,
    },
    DEF: {
        goalsScored: 6,
        assists: 3,
        cleanSheets: 4,
        goalsConceded: -0.5,
        penaltiesMissed: -2,
        yellowCards: -1,
        redCards: -3,
        ownGoals: -2,
        bonus: 1,
    },
    MID: {
        goalsScored: 5,
        assists: 3,
        cleanSheets: 1,
        penaltiesMissed: -2,
        yellowCards: -1,
        redCards: -3,
        ownGoals: -2,
        bonus: 1,
    },
    FWD: {
        goalsScored: 4,
        assists: 3,
        penaltiesMissed: -2,
        yellowCards: -1,
        redCards: -3,
        ownGoals: -2,
        bonus: 1,
    },
};