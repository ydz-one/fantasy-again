import React from 'react';
import { connect } from 'react-redux';
import { Layout, Table } from 'antd';
import { StoreState } from '../reducers';
import { DEFAULT_SEASON, FdrData, FdrFixture, Season } from '../types';
import { getTeamFullNames, getTeamNames } from '../data';

const { Content } = Layout;

interface Props {
    fdr: FdrData;
    gameweek: number;
}

interface Row {
    [key: string]: string | FdrFixture[];
};

function assertIsArrayOfFdrFixtures(obj: unknown): asserts obj is FdrFixture[] {
    if (Array.isArray(obj) && (obj.length === 0 || obj[0].opponent != null)) return;
    else throw new Error('Input must be a string!');
}

const renderCell = (gwFixtures: FdrFixture[]) => {
    const TEAM_NAMES = getTeamNames(DEFAULT_SEASON);

    if (gwFixtures.length === 0) {
        return <div className={'fdr fdr-0'}></div>;
    }
    if (gwFixtures.length === 1) {
        const fixture = gwFixtures[0];
        const cellText = TEAM_NAMES[fixture.opponent] + (fixture.isHome ? ' (H)' : ' (A)');
        return <div className={'fdr fdr-' + fixture.difficulty}>
            {cellText}
        </div>
    }
    const fdrClass = gwFixtures.length === 2 ? 'fdr-double' : 'fdr-triple';
    return <div className='fdr'>
        {gwFixtures.map(fixture => {
            const team = TEAM_NAMES[fixture.opponent];
            const location = fixture.isHome ? '(H)' : '(A)';
            return <div className={fdrClass + ' fdr-sub fdr-' + fixture.difficulty} key={fixture.opponent}>
                {team} <br/> {location}
            </div>
        })}
    </div>
};

const createFdrTable = (fdr: FdrData, gameweek: number) => {
    const TEAM_FULL_NAMES = getTeamFullNames(DEFAULT_SEASON);
    const columns: object[] = [
        {
            title: 'Team',
            dataIndex: 'team',
            key: 'team',
            fixed: 'left',
            width: 70,
            sorter: {
                compare: (a: Row, b: Row) => a.team < b.team ? -1 : a.team > b.team ? 1 : 0
            }
        }
    ];
    const maxGW = fdr[0].length;
    for (let i = gameweek; i < maxGW; i++) {
        const gwTitle = 'GW' + (i + 1);
        columns.push({
            title: gwTitle,
            dataIndex: gwTitle,
            key: gwTitle,
            width: 50,
            render: renderCell,
            sorter: {
                compare: (a: Row, b: Row) => {
                    const aGW = a[gwTitle];
                    const bGW = b[gwTitle];
                    const result = aGW.length - bGW.length;
                    if (result !== 0 || aGW.length === 0) return result;
                    assertIsArrayOfFdrFixtures(aGW);
                    assertIsArrayOfFdrFixtures(bGW);
                    const aDiffiSum = aGW.reduce((acc, val) => acc + val.difficulty, 0);
                    const bDiffiSum = bGW.reduce((acc, val) => acc + val.difficulty, 0);
                    return bDiffiSum - aDiffiSum;
                }
            }
        });
    }
    const data: object[] = [];
    fdr.forEach((teamGWs, teamIdx) => {
        const row: Row = {
            team: TEAM_FULL_NAMES[teamIdx]
        };
        teamGWs.forEach((teamGW, teamGWIdx) => {
            if (teamGWIdx < gameweek) return;
            row['GW' + (teamGWIdx + 1)] = teamGW;
        });
        data.push(row);
    });
    const tableWidth = 90 * (maxGW - gameweek + 1);
    return <Table dataSource={data} columns={columns} pagination={false} scroll={{ x: tableWidth }} className='custom-table' />;
}

const _Content = ({ fdr, gameweek }: Props) => (
    <Content className='site-layout-content'>
        <div className='site-layout-background'>
            <div className='page-title page-title-two-sections'>
                <div>Fixture Difficulty Rating (FDR)</div>
                <div className='fdr-section'>
                    <div className='fdr-key-text'>FDR Key:</div>
                    <div>
                        <div className='fdr-key'>
                            <div className='fdr-key-square fdr-1'>1</div>
                            <div className='fdr-key-square fdr-2'>2</div>
                            <div className='fdr-key-square fdr-3'>3</div>
                            <div className='fdr-key-square fdr-4'>4</div>
                            <div className='fdr-key-square fdr-5'>5</div>
                        </div>
                        <div className='fdr-key-label'>
                            <div>Easy</div>
                            <div>Hard</div>
                        </div>
                    </div>
                </div>
            </div>
            {createFdrTable(fdr, gameweek)}
        </div>
    </Content>
);

const mapStateToProps = ({
    data,
    game
}: StoreState) => {
    const { fdr } = data;
    const { gameweek } = game;

    return {
        fdr,
        gameweek
    };
}

export default connect(mapStateToProps)(_Content);