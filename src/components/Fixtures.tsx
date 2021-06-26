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
            return <div className={fdrClass + ' fdr-sub fdr-' + fixture.difficulty}>
                {team} <br/> {location}
            </div>
        })}
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