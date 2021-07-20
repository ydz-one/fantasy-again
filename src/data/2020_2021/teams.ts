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
            web_name: 'Martínez',
            source_team: '3',
            target_team: '7'
        },
        {
            gw: 2,
            code: '194634',
            web_name: 'Jota',
            source_team: '39',
            target_team: '14'
        }
    ],
    '3': [
        {
            gw: 3,
            code: '40845',
            web_name: 'Stephens',
            source_team: '36',
            target_team: '90'
        }
    ],
    '4': [
        {
            gw: 4,
            code: '88894',
            web_name: 'Barkley',
            source_team: '8',
            target_team: '7'
        },
        {
            gw: 4,
            code: '195473',
            web_name: 'Brewster',
            source_team: '14',
            target_team: '49'
        }
    ],
    '5': [
        {
            gw: 5,
            code: '20467',
            web_name: 'Walcott',
            source_team: '11',
            target_team: '20'
        },
        {
            gw: 5,
            code: '126187',
            web_name: 'Loftus-Cheek',
            source_team: '8',
            target_team: '54'
        }
    ],
    '19': [
        {
            gw: 19,
            code: '18987',
            web_name: 'Snodgrass',
            source_team: '21',
            target_team: '35'
        }
    ],
    '20': [
        {
            gw: 20,
            code: '131897',
            web_name: 'Ryan',
            source_team: '36',
            target_team: '3'
        }
    ],
    '21': [
        {
            gw: 21,
            code: '109322',
            web_name: 'Lingard',
            source_team: '1',
            target_team: '21'
        }
    ],
    '22': [
        {
            gw: 22,
            code: '154043',
            web_name: 'Maitland-Niles',
            source_team: '3',
            target_team: '35'
        },
        {
            gw: 22,
            code: '157882',
            web_name: 'Minamino',
            source_team: '14',
            target_team: '20'
        },
        {
            gw: 22,
            code: '200089',
            web_name: 'Willock',
            source_team: '3',
            target_team: '4'
        }
    ]
}