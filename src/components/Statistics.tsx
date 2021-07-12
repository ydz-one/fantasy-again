import React from 'react';
import { connect } from 'react-redux';
import { Layout, Table, Tag, Tooltip } from 'antd';
import { WarningTwoTone } from '@ant-design/icons';
import { StoreState } from '../reducers';
import { DEFAULT_SEASON, FdrData, NameCellData, PlayersBio, PlayersStats, PlayerStatsRow, positions, positionData } from '../types';
import { columnComparatorFactory, formatOneDecimalPlace, formatPoints, formatSelected, formatValue, getTeamCodeToId, getTeamFullNames, PLAYER_STATS_COLUMN_LABELS } from '../data';
import { TEAMS, TEAM_FULL_NAME_TO_CODE } from '../data/teams';
import moment from 'moment';

const { Content } = Layout;

interface Props {
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    fdr: FdrData;
    gameweek: number;
}
const WIDER_COLUMN_WIDTH = 100;
const DEFAULT_COLUMN_WIDTH = 90;

const otherColumns = [
    'form',
    'value',
    'selected',
    'latest_gw_points',
    'season_points',
    'ict_index',
    'influence',
    'creativity',
    'threat',
    'transfers_in',
    'transfers_out',
    'bonus'
];

const columnFormatters: { [key: string]: (a: number) => string } = {
    form: formatOneDecimalPlace,
    value: formatValue,
    selected: formatSelected,
    latest_gw_points: formatPoints,
    season_points: formatPoints,
    ict_index: formatOneDecimalPlace,
    influence: formatOneDecimalPlace,
    creativity: formatOneDecimalPlace,
    threat: formatOneDecimalPlace,
    bonus: formatPoints
    // keep transfers_in and transfers_out as undefined because they don't need any special formatters
};

const renderTeamCell = (team_code: string) => {
    return <Tag color={TEAMS[team_code].color}>
        {TEAMS[team_code].name}
    </Tag>
}

const renderPlayerCell = (player: NameCellData) => (
    <div>
        <div className='player-cell-name'>
            {player.name}
        </div>
        <div className='player-cell-info'>
            <Tag color={positionData[player.position].color} className={positionData[player.position].isDarkFont ? 'dark-font' : ''}>
                {player.position}
            </Tag>
            <div>
                {player.injured === 1 && <Tooltip placement='topLeft' title={player.injury + ' until ' + moment(player.injury_end).format('LL')} arrowPointAtCenter><WarningTwoTone twoToneColor='red' /></Tooltip>}
            </div>
        </div>
    </div>
);

function assertIsNameCellData(obj: unknown): asserts obj is NameCellData {
    if (typeof obj === 'object' && obj !== null && obj.hasOwnProperty('name')) return;
    else throw new Error('Input must be a NameCellData');
}

function assertIsString(obj: unknown): asserts obj is string {
    if (Object.prototype.toString.call(obj) === '[object String]') return;
    else throw new Error('Input must be a string');
}

const createPlayerStatsTable = (playersBio: PlayersBio, playersStats: PlayersStats, fdr: FdrData, gameweek: number) => {
    const TEAM_FULL_NAMES = getTeamFullNames(DEFAULT_SEASON);
    const TEAM_CODE_TO_ID = getTeamCodeToId(DEFAULT_SEASON);
    PLAYER_STATS_COLUMN_LABELS['latest_gw_points'] = 'GW' + (gameweek || 1);
    const columns: object[] = [
        {
            title: 'Team',
            dataIndex: 'team_code',
            key: 'team_code',
            fixed: 'left',
            width: WIDER_COLUMN_WIDTH,
            render: renderTeamCell,
            filters: TEAM_FULL_NAMES.map(teamFullName => ({
                        text: teamFullName,
                        value: TEAM_FULL_NAME_TO_CODE[teamFullName]
                    })),
            onFilter: (value: string, record: PlayerStatsRow) => {
                return record.team_code === value;
            },
            sorter: {
                compare: (a: PlayerStatsRow, b: PlayerStatsRow) => {
                    assertIsString(a.team_code);
                    assertIsString(b.team_code);
                    const aId = TEAM_CODE_TO_ID[a.team_code];
                    const bId = TEAM_CODE_TO_ID[b.team_code];
                    return aId < bId ? -1 : bId < aId ? 1 : 0;
                }
            }
        },
        {
            title: PLAYER_STATS_COLUMN_LABELS['player'],
            dataIndex: 'player',
            key: 'player',
            fixed: 'left',
            width: WIDER_COLUMN_WIDTH,
            render: renderPlayerCell,
            filters:  positions.map(position => ({
                        text: positionData[position].name,
                        value: position
                    })),
            onFilter: (value: string, record: PlayerStatsRow) => {
                assertIsNameCellData(record.player);
                return record.player.position === value;
            },
            sorter: {
                compare: (a: PlayerStatsRow, b: PlayerStatsRow) => {
                    assertIsNameCellData(a.player);
                    assertIsNameCellData(b.player);
                    const aName = a.player.name;
                    const bName = b.player.name;
                    return aName < bName ? -1 : bName < aName ? 1 : 0;
                }
            }
        }
    ];
    otherColumns.forEach(columnDataIndex => {
        columns.push({
            title: PLAYER_STATS_COLUMN_LABELS[columnDataIndex],
            dataIndex: columnDataIndex,
            key: columnDataIndex,
            width: DEFAULT_COLUMN_WIDTH,
            render: columnFormatters[columnDataIndex],
            sorter: {
                compare: columnComparatorFactory(columnDataIndex)
            }
        })
    });
    // TODO: Add 3 FDR columns
    const data: PlayerStatsRow[] = [];
    for (const [code, player] of Object.entries(playersBio)) {
        const playerStats: any = playersStats[code]; // TODO figure out correct type for playerStats
        const row: PlayerStatsRow = {
            team_code: player.team_code,
            player: {
                name: player.web_name,
                position: player.position,
                injured: playerStats.injured,
                injury: playerStats.injury,
                injury_end: playerStats.injury_end
            }
        };
        otherColumns.forEach(columnDataIndex => {
            row[columnDataIndex] = playerStats[columnDataIndex];
        });
        data.push(row);
    }
    const totalWidth = (columns.length - 2) * DEFAULT_COLUMN_WIDTH + 2 * WIDER_COLUMN_WIDTH;
    data.sort((a: PlayerStatsRow, b: PlayerStatsRow) => b.selected < a.selected ? -1 : a.selected < b.selected ? 1 : 0);
    return <Table dataSource={data} columns={columns} scroll={{ x: totalWidth }} className='custom-table'/>;
}

const _Content = ({ playersBio, playersStats, fdr, gameweek }: Props) => (
    <Content className='site-layout-content'>
        <div className='site-layout-background'>
            <div className='page-title'>
                <div>Statistics</div>
            </div>
            {createPlayerStatsTable(playersBio, playersStats, fdr, gameweek)}
        </div>
    </Content>
);

const mapStateToProps = ({
    data,
    game
}: StoreState) => {
    const { fdr, playersBio, playersStats } = data;
    const { gameweek } = game;
    return {
        playersBio,
        playersStats,
        fdr,
        gameweek
    };
}

export default connect(mapStateToProps)(_Content);