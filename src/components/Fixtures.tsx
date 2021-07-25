import React from 'react';
import { connect } from 'react-redux';
import { Layout, Table } from 'antd';
import { StoreState } from '../reducers';
import { DEFAULT_SEASON, FdrData, FdrFixture, FdrRow } from '../types';
import { fdrFixtureComparatorFactory, getTeamFullNames } from '../data';
import { FdrCell } from './FdrCell';

const { Content } = Layout;

interface Props {
    fdr: FdrData;
    gameweek: number;
}

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
                compare: (a: FdrRow, b: FdrRow) => (a.team < b.team ? -1 : a.team > b.team ? 1 : 0),
            },
        },
    ];
    const maxGW = fdr[0].length;
    for (let i = gameweek; i < maxGW; i++) {
        const gwTitle = 'GW' + (i + 1);
        columns.push({
            title: gwTitle,
            dataIndex: gwTitle,
            key: gwTitle,
            width: 50,
            render: (gwFixtures: FdrFixture[]) => <FdrCell gwFixtures={gwFixtures} />,
            sorter: {
                compare: fdrFixtureComparatorFactory(gwTitle),
            },
        });
    }
    const data: object[] = [];
    fdr.forEach((teamGWs, teamIdx) => {
        const row: FdrRow = {
            team: TEAM_FULL_NAMES[teamIdx],
        };
        teamGWs.forEach((teamGW, teamGWIdx) => {
            if (teamGWIdx < gameweek) return;
            row['GW' + (teamGWIdx + 1)] = teamGW;
        });
        data.push(row);
    });
    const tableWidth = 90 * (maxGW - gameweek + 1);
    return (
        <Table
            dataSource={data}
            columns={columns}
            pagination={false}
            scroll={{ x: tableWidth }}
            className="custom-table"
        />
    );
};

const _Fixtures = ({ fdr, gameweek }: Props) => (
    <Content className="site-layout-content">
        <div className="site-layout-background">
            <div className="page-title page-title-two-sections">
                <div>Fixture Difficulty Rating (FDR)</div>
                <div className="fdr-section">
                    <div className="fdr-key-text">FDR Key:</div>
                    <div>
                        <div className="fdr-key">
                            <div className="fdr-key-square fdr-1">1</div>
                            <div className="fdr-key-square fdr-2">2</div>
                            <div className="fdr-key-square fdr-3">3</div>
                            <div className="fdr-key-square fdr-4">4</div>
                            <div className="fdr-key-square fdr-5">5</div>
                        </div>
                        <div className="fdr-key-label">
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

const mapStateToProps = ({ data, game }: StoreState) => {
    const { fdr } = data;
    const { gameweek } = game;
    return {
        fdr,
        gameweek,
    };
};

export default connect(mapStateToProps)(_Fixtures);
