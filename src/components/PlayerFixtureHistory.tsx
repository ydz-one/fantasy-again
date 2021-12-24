import React from 'react';
import { connect } from 'react-redux';
import { Collapse } from 'antd';
import { Fixtures, PlayerFixtureStats, Position } from '../types';
import { StoreState } from '../reducers';
import { FixtureResult } from './FixtureResult';
import { PLAYER_FIXTURE_STATS_FIELDS, PLAYER_FIXTURE_STATS_FIELD_LABELS } from '../constants';
import { assertIsNumber, assertIsPosition, calcPoints } from '../helpers';

const { Panel } = Collapse;

interface Props {
    position: Position;
    fixtures: Fixtures;
    fixtureStats: PlayerFixtureStats[];
    teamCode: string;
}

const createFixtureStatsHeader = (pastFixture: PlayerFixtureStats, fixtures: Fixtures, teamCode: string) => {
    const fixtureData = fixtures[pastFixture.fixture];
    return (
        <div className="flex-space-between">
            <div className="fixture-stats-header-item">{`GW${pastFixture.round}`}</div>
            {<FixtureResult fixtureData={fixtureData} />}
            <div className="fixture-stats-header-item text-align-right">{pastFixture.totalPoints} pts</div>
        </div>
    );
};

const createFixtureStatsBody = (position: Position, fixture: PlayerFixtureStats) => {
    const dataToShow: [keyof PlayerFixtureStats, number, number][] = [];
    PLAYER_FIXTURE_STATS_FIELDS.forEach((field) => {
        const value = fixture[field];
        assertIsNumber(value);
        const points = calcPoints(field, value, position);
        if (field === 'minutes' || points !== 0) {
            dataToShow.push([field, value, points]);
        }
    });
    return (
        <div className="fixture-stats-container">
            <div className="fixture-points-breakdown">
                <p>
                    <strong>Points Breakdown</strong>
                </p>
                {dataToShow.map((data) => (
                    <p key={data[0]}>{PLAYER_FIXTURE_STATS_FIELD_LABELS[data[0]]}</p>
                ))}
            </div>
            <div className="fixture-value-pts">
                <p>Value</p>
                {dataToShow.map((data) => (
                    <p key={data[0]}>{data[1]}</p>
                ))}
            </div>
            <div className="fixture-value-pts">
                <p>Pts</p>
                {dataToShow.map((data) => (
                    <p key={data[0]}>{data[2]}</p>
                ))}
            </div>
        </div>
    );
};

const _PlayerFixtureHistory = ({ position, fixtures, fixtureStats, teamCode }: Props) =>
    fixtureStats.length > 0 ? (
        <Collapse defaultActiveKey={[fixtureStats.length - 1]}>
            {fixtureStats
                .map((pastFixture, idx) => (
                    <Panel header={createFixtureStatsHeader(pastFixture, fixtures, teamCode)} key={idx}>
                        {createFixtureStatsBody(position, pastFixture)}
                    </Panel>
                ))
                .reverse()}
        </Collapse>
    ) : (
        <p className="empty-state-text text-align-center">No fixture history to show</p>
    );

const mapStateToProps = ({ data }: StoreState, ownProps: { selectedPlayer: string }) => {
    const { fixtures, playersBio, playersStats } = data;
    const { selectedPlayer } = ownProps;
    const { fixtureStats } = playersStats[selectedPlayer];
    const { position, teamCode } = playersBio[selectedPlayer];
    assertIsPosition(position);
    return {
        position,
        fixtures,
        fixtureStats,
        teamCode,
    };
};

export default connect(mapStateToProps)(_PlayerFixtureHistory);
