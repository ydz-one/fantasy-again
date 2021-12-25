import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { List } from 'antd';
import moment from 'moment';
import { getTeamCodeToId, getTeamIdToCode } from '../data';
import { StoreState } from '../reducers';
import { DEFAULT_SEASON, FdrData } from '../types';
import { TeamTag } from './TeamTag';

const TEAM_CODE_TO_ID = getTeamCodeToId(DEFAULT_SEASON);
const TEAM_ID_TO_CODE = getTeamIdToCode(DEFAULT_SEASON);

interface Props {
    fdr: FdrData;
    gameweek: number;
    teamCode: string;
}

const _FutureFixtures = ({ fdr, gameweek, teamCode }: Props) => {
    const listData = fdr[TEAM_CODE_TO_ID[teamCode]].slice(gameweek).flat();
    return (
        <List
            className="future-fixtures-list"
            dataSource={listData}
            renderItem={(fixture) => (
                <List.Item key={fixture.kickoffTime}>
                    <div className="flex-space-between">
                        <div className="flex-flex-start">
                            <div className={`flex-center-item fdr-player-details-modal fdr-${fixture.difficulty}`}>
                                <span>{fixture.difficulty}</span>
                            </div>
                            <div className="flex-center-item player-details-modal-gameweek">
                                <span>{`GW${fixture.round}`}</span>
                            </div>
                        </div>
                        <div className="future-fixture">
                            {fixture.isHome ? (
                                <Fragment>
                                    <TeamTag teamCode={teamCode} />
                                    <div className="future-fixture-date">
                                        {moment(fixture.kickoffTime).format('MMM DD')}
                                    </div>
                                    <TeamTag teamCode={TEAM_ID_TO_CODE[fixture.opponent]} />
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <TeamTag teamCode={TEAM_ID_TO_CODE[fixture.opponent]} />
                                    <div className="future-fixture-date">
                                        {moment(fixture.kickoffTime).format('MMM DD')}
                                    </div>
                                    <TeamTag teamCode={teamCode} />
                                </Fragment>
                            )}
                        </div>
                        {/* empty div to help center fixture data with flexbox space-between */}
                        <div></div>
                    </div>
                </List.Item>
            )}
        ></List>
    );
};

const mapStateToProps = ({ data, game }: StoreState, ownProps: { teamCode: string }) => {
    const { fdr } = data;
    const { gameweek } = game;
    const { teamCode } = ownProps;
    return {
        fdr,
        gameweek,
        teamCode,
    };
};

export default connect(mapStateToProps)(_FutureFixtures);
