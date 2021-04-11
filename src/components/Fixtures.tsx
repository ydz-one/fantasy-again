import React from 'react';
import { connect } from 'react-redux';
import { Layout, Card } from 'antd';
import { StoreState } from '../reducers';
import { FixtureData, Fixture } from '../types';

const { Content } = Layout;

interface Props {
    fixtures: FixtureData;
    gameweek: number;
}

const generateFixtureCards = (gameweekFixtures: Fixture[]) => {
    return gameweekFixtures.map(fixture => <Card key={fixture.id} style={{ width: 300 }}>{fixture.teamH + ' vs ' + fixture.teamA}</Card>)
}

const _Content = ({ fixtures, gameweek }: Props) => (
    <Content className='site-layout-content'>
        <div className="site-layout-background">
            {generateFixtureCards(fixtures[gameweek])}
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