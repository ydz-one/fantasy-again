export const TEAM_FULL_NAMES = [
    'Arsenal',
    'Aston Villa',
    'Brighton',
    'Burnley',
    'Chelsea',
    'Crystal Palace',
    'Everton',
    'Fulham',
    'Leeds',
    'Leicester',
    'Liverpool',
    'Man City',
    'Man Utd',
    'Newcastle',
    'Sheffield',
    'Southampton',
    'Spurs',
    'West Brom',
    'West Ham',
    'Wolves',
];

export const TEAM_NAMES = [
    'ARS',
    'AVL',
    'BHA',
    'BUR',
    'CHE',
    'CRY',
    'EVE',
    'FUL',
    'LEE',
    'LEI',
    'LIV',
    'MCI',
    'MUN',
    'NEW',
    'SHU',
    'SOU',
    'TOT',
    'WBA',
    'WHU',
    'WOL'
];

export const TEAM_ID_TO_CODE = [
    3,
    7,
    36,
    90,
    8,
    31,
    11,
    54,
    2,
    13,
    14,
    43,
    1,
    4,
    9,
    20,
    6,
    35,
    21,
    39
];

export const TEAM_CODE_TO_ID: { [key: string]: number } = {
    '1': 12,
    '2': 8,
    '3': 0,
    '4': 13,
    '6': 16,
    '7': 1,
    '8': 4,
    '11': 6,
    '13': 9,
    '14': 10,
    '20': 15,
    '21': 18,
    '31': 5,
    '35': 17,
    '36': 2,
    '39': 19,
    '43': 11,
    '49': 14,
    '54': 7,
    '90': 3
};

// the key is the GW number that the player first starts playing for the target team
export const transfers = {
    '2': [
        {
            gw: 2,
            code: '98980',
            webName: 'Martínez',
            sourceTeam: '3',
            targetTeam: '7'
        },
        {
            gw: 2,
            code: '194634',
            webName: 'Jota',
            sourceTeam: '39',
            targetTeam: '14'
        }
    ],
    '3': [
        {
            gw: 3,
            code: '40845',
            webName: 'Stephens',
            sourceTeam: '36',
            targetTeam: '90'
        }
    ],
    '4': [
        {
            gw: 4,
            code: '88894',
            webName: 'Barkley',
            sourceTeam: '8',
            targetTeam: '7'
        },
        {
            gw: 4,
            code: '195473',
            webName: 'Brewster',
            sourceTeam: '14',
            targetTeam: '49'
        }
    ],
    '5': [
        {
            gw: 5,
            code: '20467',
            webName: 'Walcott',
            sourceTeam: '11',
            targetTeam: '20'
        },
        {
            gw: 5,
            code: '126187',
            webName: 'Loftus-Cheek',
            sourceTeam: '8',
            targetTeam: '54'
        }
    ],
    '19': [
        {
            gw: 19,
            code: '18987',
            webName: 'Snodgrass',
            sourceTeam: '21',
            targetTeam: '35'
        }
    ],
    '20': [
        {
            gw: 20,
            code: '131897',
            webName: 'Ryan',
            sourceTeam: '36',
            targetTeam: '3'
        }
    ],
    '21': [
        {
            gw: 21,
            code: '109322',
            webName: 'Lingard',
            sourceTeam: '1',
            targetTeam: '21'
        }
    ],
    '22': [
        {
            gw: 22,
            code: '154043',
            webName: 'Maitland-Niles',
            sourceTeam: '3',
            targetTeam: '35'
        },
        {
            gw: 22,
            code: '157882',
            webName: 'Minamino',
            sourceTeam: '14',
            targetTeam: '20'
        },
        {
            gw: 22,
            code: '200089',
            webName: 'Willock',
            sourceTeam: '3',
            targetTeam: '4'
        }
    ]
}