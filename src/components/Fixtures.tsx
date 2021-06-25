import React from 'react';
import { connect } from 'react-redux';
import { Layout, Table } from 'antd';
import { StoreState } from '../reducers';
import { FixtureData, Fixture, Season } from '../types';
import { getTeamNames } from '../data';

const { Content } = Layout;

interface Props {
    fixtures: FixtureData;
    gameweek: number;
}

const renderCell = (gwFixtures: Fixture[]) => {
    const TEAM_NAMES = getTeamNames(Season.S2018_2019); // TODO: Remove hardcoded season
    const firstFixture = gwFixtures[0]; // TODO: Make cells compatible with double and triple GWs
    const cellText = firstFixture ? TEAM_NAMES[firstFixture.opponent] + (firstFixture.isHome ? ' (H)' : ' (A)') : '';
    const difficulty = firstFixture ? firstFixture.difficulty : 3;
    return <div className={'fdr fdr-' + difficulty}>
        {cellText}
    </div>
};

const generateFDRTable = (fixtures: FixtureData, gameweek: number) => {
    const TEAM_NAMES = getTeamNames(Season.S2018_2019); // TODO: Remove hardcoded season
    const columns: object[] = [
        {
            title: 'Team',
            dataIndex: 'team',
            key: 'team',
            fixed: 'left',
            width: 50
        }
    ];
    const maxGW = fixtures[0].length;
    for (let i = gameweek; i < maxGW; i++) {
        const title = 'GW' + (i + 1);
        columns.push({
            title,
            dataIndex: title,
            key: title,
            width: 50,
            render: renderCell
        });
    }
    const data: object[] = [];
    fixtures.forEach((teamGWs, teamIdx) => {
        const row: { [key: string]: string | Fixture[]; } = {
            team: TEAM_NAMES[teamIdx]
        };
        teamGWs.forEach((teamGW, teamGWIdx) => {
            if (teamGWIdx < gameweek) return;
            row['GW' + (teamGWIdx + 1)] = teamGW;
        });
        data.push(row);
    });
    return <Table dataSource={data} columns={columns} pagination={false} scroll={{ x: 90 * (maxGW - gameweek + 1) }} className='custom-table' />;
}

const _Content = ({ fixtures, gameweek }: Props) => (
    <Content className='site-layout-content'>
        <div className='site-layout-background'>
            {generateFDRTable(fixtures, gameweek)}
        </div>
    </Content>
);

const mapStateToProps = ({
    data,
    game
}: StoreState) => {
    const { fixtures } = data;
    const { gameweek } = game;

    return {
        fixtures,
        gameweek
    };
}

export default connect(mapStateToProps)(_Content);