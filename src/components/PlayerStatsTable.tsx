import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Table, Tooltip } from 'antd';
import { WarningTwoTone } from '@ant-design/icons';
import {
    columnComparatorFactory,
    fdrFixtureComparatorFactory,
    formatIctValues,
    formatOneDecimalPlace,
    formatPoints,
    formatSelected,
    formatValue,
    getTeamCodeToId,
    getTeamFullNames,
    PLAYER_STATS_COLUMN_LABELS,
} from '../data';
import { TEAM_FULL_NAME_TO_CODE } from '../data/teams';
import { StoreState } from '../reducers';
import {
    DEFAULT_SEASON,
    FdrData,
    FdrFixture,
    NameCellData,
    PlayerBio,
    PlayersBio,
    PlayersStats,
    PlayerStatsRow,
    positionData,
    positions,
} from '../types';
import { PositionTag } from './PositionTag';
import { TeamTag } from './TeamTag';
import { FdrCell } from './FdrCell';

interface Props {
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    fdr: FdrData;
    gameweek: number;
    filterFn: (row: PlayerBio) => boolean;
    disableFn: (row: PlayerStatsRow) => boolean;
    onClickPlayer: Function;
    showPositionFilter: boolean;
}

const TEAM_COLUMN_WIDTH = 76;
const PLAYER_COLUMN_WIDTH = 100;
const DEFAULT_COLUMN_WIDTH = 80;
const WIDER_STATS_COLUMNS_WIDTH = 90;
const FDR_COLUMN_WIDTH = 90;

const WIDER_STATS_COLUMNS: { [key: string]: boolean } = {
    selected: true,
    influence: true,
    creativity: true,
    transfersIn: true,
    transfersOut: true,
};

const otherColumns = [
    'form',
    'value',
    'selected',
    'latestGwPoints',
    'seasonPoints',
    'ictIndex',
    'influence',
    'creativity',
    'threat',
    'transfersIn',
    'transfersOut',
    'bonus',
];

const columnFormatters: { [key: string]: (a: number) => string } = {
    form: formatOneDecimalPlace,
    value: formatValue,
    selected: formatSelected,
    latestGwPoints: formatPoints,
    seasonPoints: formatPoints,
    ictIndex: formatIctValues,
    influence: formatIctValues,
    creativity: formatIctValues,
    threat: formatIctValues,
    bonus: formatPoints,
    // keep transfersIn and transfersOut as undefined because they don't need any special formatters
};

const renderTeamCell = (teamCode: string) => {
    return <TeamTag teamCode={teamCode} />;
};

const renderPlayerCell = (player: NameCellData) => (
    <div>
        <div className="player-cell-name">{player.name}</div>
        <div className="player-cell-info">
            <PositionTag position={player.position} />
            <div>
                {player.injured === 1 && (
                    <Tooltip
                        placement="topLeft"
                        title={player.injury + ' until ' + moment(player.injuryEnd).format('LL')}
                        arrowPointAtCenter
                    >
                        <WarningTwoTone twoToneColor="red" />
                    </Tooltip>
                )}
            </div>
        </div>
    </div>
);

function assertIsNameCellData(obj: unknown): asserts obj is NameCellData {
    if (typeof obj === 'object' && obj !== null && obj.hasOwnProperty('name')) return;
    else throw new Error('Input must be a NameCellData');
}

const _PlayerStatsTable = ({
    playersBio,
    playersStats,
    fdr,
    gameweek,
    filterFn,
    disableFn,
    onClickPlayer,
    showPositionFilter,
}: Props) => {
    const TEAM_FULL_NAMES = getTeamFullNames(DEFAULT_SEASON);
    const TEAM_CODE_TO_ID = getTeamCodeToId(DEFAULT_SEASON);
    PLAYER_STATS_COLUMN_LABELS['latestGwPoints'] = 'GW' + (gameweek || 1);
    // Define columns
    const columns: object[] = [
        {
            title: 'Team',
            dataIndex: 'teamCode',
            key: 'teamCode',
            fixed: 'left',
            width: TEAM_COLUMN_WIDTH,
            render: renderTeamCell,
            filters: TEAM_FULL_NAMES.map((teamFullName) => ({
                text: teamFullName,
                value: TEAM_FULL_NAME_TO_CODE[teamFullName],
            })),
            onFilter: (value: string, record: PlayerStatsRow) => {
                return record.teamCode === value;
            },
        },
        {
            title: PLAYER_STATS_COLUMN_LABELS['player'],
            dataIndex: 'player',
            key: 'player',
            fixed: 'left',
            width: PLAYER_COLUMN_WIDTH,
            render: renderPlayerCell,
            sorter: {
                compare: (a: PlayerStatsRow, b: PlayerStatsRow) => {
                    assertIsNameCellData(a.player);
                    assertIsNameCellData(b.player);
                    const aName = a.player.name;
                    const bName = b.player.name;
                    return aName < bName ? -1 : bName < aName ? 1 : 0;
                },
            },
            ...(showPositionFilter && {
                filters: positions.map((position) => ({
                    text: positionData[position].name,
                    value: position,
                })),
                onFilter: (value: string, record: PlayerStatsRow) => {
                    assertIsNameCellData(record.player);
                    return record.player.position === value;
                },
            }),
        },
    ];
    otherColumns.forEach((columnDataIndex) => {
        columns.push({
            title: PLAYER_STATS_COLUMN_LABELS[columnDataIndex],
            dataIndex: columnDataIndex,
            key: columnDataIndex,
            width: WIDER_STATS_COLUMNS[columnDataIndex] ? WIDER_STATS_COLUMNS_WIDTH : DEFAULT_COLUMN_WIDTH,
            render: columnFormatters[columnDataIndex],
            sorter: {
                compare: columnComparatorFactory(columnDataIndex),
            },
        });
    });
    // Add FDR columns for next 3 GWs
    const gwN = fdr[0].length;
    const endIdx = Math.min(gwN, gameweek + 3);
    const nextThreeGwFdr = [];
    for (let i = gameweek; i < endIdx; i++) {
        const gwTitle = 'GW' + (i + 1);
        nextThreeGwFdr.push({
            gwTitle,
            gwIdx: i,
        });
        columns.push({
            title: gwTitle,
            dataIndex: gwTitle,
            key: gwTitle,
            width: FDR_COLUMN_WIDTH,
            render: (gwFixtures: FdrFixture[]) => <FdrCell gwFixtures={gwFixtures} />,
            sorter: {
                compare: fdrFixtureComparatorFactory(gwTitle),
            },
        });
    }
    // Populate data
    const data: PlayerStatsRow[] = [];
    for (const [code, player] of Object.entries(playersBio)) {
        if (!filterFn(player)) continue;
        const playerStats: any = playersStats[code]; // TODO figure out correct type for playerStats
        const row: PlayerStatsRow = {
            code: player.code,
            teamCode: player.teamCode,
            player: {
                name: player.webName,
                position: player.position,
                injured: playerStats.injured,
                injury: playerStats.injury,
                injuryEnd: playerStats.injuryEnd,
            },
        };
        otherColumns.forEach((columnDataIndex) => {
            row[columnDataIndex] = playerStats[columnDataIndex];
        });
        const teamId = TEAM_CODE_TO_ID[player.teamCode];
        nextThreeGwFdr.forEach(({ gwTitle, gwIdx }) => {
            row[gwTitle] = fdr[teamId][gwIdx];
        });
        data.push(row);
    }
    // Sort columns to order by Selected descending
    data.sort((a: PlayerStatsRow, b: PlayerStatsRow) =>
        b.selected < a.selected ? -1 : a.selected < b.selected ? 1 : 0
    );
    const totalWidth =
        TEAM_COLUMN_WIDTH +
        PLAYER_COLUMN_WIDTH +
        5 * WIDER_STATS_COLUMNS_WIDTH +
        7 * DEFAULT_COLUMN_WIDTH +
        nextThreeGwFdr.length * FDR_COLUMN_WIDTH;
    return (
        <Table
            dataSource={data}
            columns={columns}
            scroll={{ x: totalWidth }}
            className="custom-table player-table"
            rowClassName={(record) => (disableFn(record) ? 'disabled-row' : '')}
            onRow={(record, rowIndex) => ({
                onClick: () => {
                    onClickPlayer(record.code);
                },
            })}
        />
    );
};

const mapStateToProps = (
    { data, game }: StoreState,
    ownProps: {
        filterFn: (row: PlayerBio) => boolean;
        disableFn: (row: PlayerStatsRow) => boolean;
        onClickPlayer: Function;
        showPositionFilter: boolean;
    }
) => {
    const { fdr, playersBio, playersStats } = data;
    const { gameweek } = game;
    const { filterFn, disableFn, onClickPlayer, showPositionFilter } = ownProps;
    return {
        playersBio,
        playersStats,
        fdr,
        gameweek,
        filterFn,
        disableFn,
        onClickPlayer,
        showPositionFilter,
    };
};

export default connect(mapStateToProps)(_PlayerStatsTable);
