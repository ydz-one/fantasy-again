import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Layout, Table, Tag, Tooltip } from 'antd';
import { WarningTwoTone } from '@ant-design/icons';
import { StoreState } from '../reducers';
import { FdrCell } from './FdrCell';
import { DEFAULT_SEASON, FdrData, NameCellData, PlayersBio, PlayersStats, PlayerStatsRow, positions, positionData, FdrFixture } from '../types';
import { columnComparatorFactory, fdrFixtureComparatorFactory, formatOneDecimalPlace, formatPoints, formatSelected, formatValue, getTeamCodeToId, getTeamFullNames, PLAYER_STATS_COLUMN_LABELS } from '../data';
import { TEAMS, TEAM_FULL_NAME_TO_CODE } from '../data/teams';
import PlayerModal from './PlayerModal';
import { PositionTag } from './PositionTag';
import { TeamTag } from './TeamTag';

const { Content } = Layout;

interface Props {
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    fdr: FdrData;
    gameweek: number;
}

const TEAM_COLUMN_WIDTH = 76;
const PLAYER_COLUMN_WIDTH = 100;
const DEFAULT_COLUMN_WIDTH = 80;
const WIDER_STATS_COLUMNS_WIDTH = 90;
const FDR_COLUMN_WIDTH = 90;

const WIDER_STATS_COLUMNS: { [key: string] : boolean } = {
    selected: true,
    influence: true,
    creativity: true,
    transfersIn: true,
    transfersOut: true
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
    'bonus'
];

const columnFormatters: { [key: string]: (a: number) => string } = {
    form: formatOneDecimalPlace,
    value: formatValue,
    selected: formatSelected,
    latestGwPoints: formatPoints,
    seasonPoints: formatPoints,
    ictIndex: formatOneDecimalPlace,
    influence: formatOneDecimalPlace,
    creativity: formatOneDecimalPlace,
    threat: formatOneDecimalPlace,
    bonus: formatPoints
    // keep transfersIn and transfersOut as undefined because they don't need any special formatters
};

const renderTeamCell = (teamCode: string) => {
    return <TeamTag teamCode={teamCode} />;
}

const renderPlayerCell = (player: NameCellData) => (
    <div>
        <div className='player-cell-name'>
            {player.name}
        </div>
        <div className='player-cell-info'>
            <PositionTag position={player.position} />
            <div>
                {player.injured === 1 && <Tooltip placement='topLeft' title={player.injury + ' until ' + moment(player.injuryEnd).format('LL')} arrowPointAtCenter><WarningTwoTone twoToneColor='red' /></Tooltip>}
            </div>
        </div>
    </div>
);

function assertIsNameCellData(obj: unknown): asserts obj is NameCellData {
    if (typeof obj === 'object' && obj !== null && obj.hasOwnProperty('name')) return;
    else throw new Error('Input must be a NameCellData');
}

const createPlayerStatsTable = (playersBio: PlayersBio, playersStats: PlayersStats, fdr: FdrData, gameweek: number, setSelectedPlayer: Function) => {
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
            filters: TEAM_FULL_NAMES.map(teamFullName => ({
                        text: teamFullName,
                        value: TEAM_FULL_NAME_TO_CODE[teamFullName]
                    })),
            onFilter: (value: string, record: PlayerStatsRow) => {
                return record.teamCode === value;
            }
        },
        {
            title: PLAYER_STATS_COLUMN_LABELS['player'],
            dataIndex: 'player',
            key: 'player',
            fixed: 'left',
            width: PLAYER_COLUMN_WIDTH,
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
            width: WIDER_STATS_COLUMNS[columnDataIndex] ? WIDER_STATS_COLUMNS_WIDTH : DEFAULT_COLUMN_WIDTH,
            render: columnFormatters[columnDataIndex],
            sorter: {
                compare: columnComparatorFactory(columnDataIndex)
            }
        })
    });
    // Add FDR columns for next 3 GWs
    const gwN = fdr[0].length;
    const endIdx = Math.min(gwN, gameweek + 3);
    const nextThreeGwFdr = [];
    for (let i = gameweek; i < endIdx; i++) {
        const gwTitle = 'GW' + (i + 1);
        nextThreeGwFdr.push({
            gwTitle,
            gwIdx: i
        });
        columns.push({
            title: gwTitle,
            dataIndex: gwTitle,
            key: gwTitle,
            width: FDR_COLUMN_WIDTH,
            render: (gwFixtures: FdrFixture[]) => <FdrCell gwFixtures={gwFixtures} />,
            sorter: {
                compare: fdrFixtureComparatorFactory(gwTitle)
            }
        });
    }
    // Populate data
    const data: PlayerStatsRow[] = [];
    for (const [code, player] of Object.entries(playersBio)) {
        const playerStats: any = playersStats[code]; // TODO figure out correct type for playerStats
        const row: PlayerStatsRow = {
            code: player.code,
            teamCode: player.teamCode,
            player: {
                name: player.webName,
                position: player.position,
                injured: playerStats.injured,
                injury: playerStats.injury,
                injuryEnd: playerStats.injuryEnd
            }
        };
        otherColumns.forEach(columnDataIndex => {
            row[columnDataIndex] = playerStats[columnDataIndex];
        });
        const teamId = TEAM_CODE_TO_ID[player.teamCode];
        nextThreeGwFdr.forEach(({ gwTitle, gwIdx }) => {
            row[gwTitle] = fdr[teamId][gwIdx];
        });
        data.push(row);
    }
    // Sort columns to order by Selected descending
    data.sort((a: PlayerStatsRow, b: PlayerStatsRow) => b.selected < a.selected ? -1 : a.selected < b.selected ? 1 : 0);
    const totalWidth = TEAM_COLUMN_WIDTH + PLAYER_COLUMN_WIDTH + 5 * WIDER_STATS_COLUMNS_WIDTH + 7 * DEFAULT_COLUMN_WIDTH + nextThreeGwFdr.length * FDR_COLUMN_WIDTH;
    return (
        <Table
            dataSource={data}
            columns={columns}
            scroll={{ x: totalWidth }}
            className='custom-table player-table'
            onRow={(record, rowIndex) => (
                {
                    onClick: () => {
                        setSelectedPlayer(record.code);
                    }
                }
            )}
        />
    );
}

const _Content = ({ playersBio, playersStats, fdr, gameweek }: Props) => {
    const [selectedPlayer, setSelectedPlayer] = useState('');
  
    const handleClose = () => {
      setSelectedPlayer('');
    };

    return (
        <Content className='site-layout-content'>
            <div className='site-layout-background'>
                <div className='page-title'>
                    <div>Statistics</div>
                </div>
                {createPlayerStatsTable(playersBio, playersStats, fdr, gameweek, setSelectedPlayer)}
                <PlayerModal selectedPlayer={selectedPlayer} handleClose={handleClose} />
            </div>
        </Content>
    );
};

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