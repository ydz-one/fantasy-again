import React from 'react';
import { connect } from 'react-redux';
import { Layout, Table, Tag, Tooltip } from 'antd';
import { WarningTwoTone } from '@ant-design/icons';
import { StoreState } from '../reducers';
import { FdrData, NameCellData, PlayersBio, PlayersStats, PlayerStatsRow, } from '../types';
import { columnComparatorFactory, formatOneDecimalPlace, formatPoints, formatSelected, formatValue, PLAYER_STATS_COLUMN_LABELS } from '../data';
import { TEAMS } from '../data/teams';
import moment from 'moment';

const { Content } = Layout;

interface Props {
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    fdr: FdrData;
    gameweek: number;
}

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

const renderPlayerCell = (player: NameCellData) => (
    <div>
        <div className='player-cell-name'>
            {player.name}
        </div>
        <div className='player-cell-info'>
            <Tag color={TEAMS[player.team_code].color}>
                {TEAMS[player.team_code].name}
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

const createPlayerStatsTable = (playersBio: PlayersBio, playersStats: PlayersStats, fdr: FdrData, gameweek: number) => {
    PLAYER_STATS_COLUMN_LABELS['latest_gw_points'] = 'GW' + (gameweek || 1);
    const columns: object[] = [
        {
            title: PLAYER_STATS_COLUMN_LABELS['player'],
            dataIndex: 'player',
            key: 'player',
            fixed: 'left',
            width: 90,
            render: renderPlayerCell,
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
            width: 70,
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
            player: {
                name: player.web_name,
                team_code: player.team_code,
                position: player.position,
                injured: playerStats.injured,
                injury: playerStats.injury,
                injury_end: playerStats.injury_end
            }
        }
        otherColumns.forEach(columnDataIndex => {
            row[columnDataIndex] = playerStats[columnDataIndex];
        });
        data.push(row);
    }
    data.sort((a: PlayerStatsRow, b: PlayerStatsRow) => b.selected < a.selected ? -1 : a.selected < b.selected ? 1 : 0);
    return <Table dataSource={data} columns={columns} scroll={{ x: 940 }} className='custom-table'/>;
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