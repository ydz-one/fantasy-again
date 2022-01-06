import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Divider, Layout, Statistic, Checkbox, Row, Col } from 'antd';
import { checkSquadCompleteHOC } from './checkSquadCompleteHOC';
import { StoreState } from '../reducers';
import { PlayersBio, PlayersStats, Position, Squad, ValueType } from '../types';
import PlayerDetailsModal from './PlayerDetailsModal';
import SquadLineup from './SquadLineup';
import { preGwDates } from '../data/2020_2021/preGwDates';
import moment from 'moment';
import { statisticsFontSize } from '../constants/ui';
import PlayerBench from './PlayerBench';

const { Content } = Layout;

interface Props {
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    gameweek: number;
    squad: Squad;
    balance: number;
    isSquadComplete: boolean;
}

const _PickTeam = ({ gameweek, squad }: Props) => {
    const [replacementInfo, setReplacementInfo] = useState({
        position: Position.GK,
        playerToReplace: '',
    });
    // playerClicked is the non-empty player card clicked in the Squad Selection screen; when set, it opens up a player data modal with a button to set that player to be replaced
    const [playerClicked, setPlayerClicked] = useState('');
    // playerToAdd is the player selected from the Player Stats Table; when set, it opens up a player data modal with a button to confirm transfer in
    const [playerToAdd, setPlayerToAdd] = useState('');
    // playerToReplace is the empty or non-empty player selected to be replaced; when set, it opens up the Player Stats Table
    const { position, playerToReplace } = replacementInfo;

    const isSubstitute = (playerClicked: string) => squad.subGk === playerClicked || squad.subs.includes(playerClicked);

    const handleClickPlayer = (playerClicked: string) => {
        setPlayerClicked(playerClicked);
    };

    const handleSetReplacePlayer = (playerToReplace: string, position: Position) => {
        setReplacementInfo({
            position,
            playerToReplace,
        });
    };

    const handleReadyReplacePlayer = (playerClicked: string) => {};

    return (
        <Content className="site-layout-content">
            <div className="site-layout-background">
                <div className="page-title page-title-two-sections">
                    <div>Pick Team</div>
                    <div className="top-metric-section center-when-mobile">
                        <Statistic
                            title={`GW${gameweek + 1} Deadline`}
                            value={moment(preGwDates[gameweek]).add(1, 'days').format('ll')}
                            valueStyle={statisticsFontSize}
                            className="top-metric"
                        />
                    </div>
                </div>
                <div className="top-btn-container">
                    <Button size="large" className="top-btn-large top-btn-large-left">
                        Bench Boost
                    </Button>
                    <Button size="large" className="top-btn-large">
                        Triple Captain
                    </Button>
                </div>
                <Divider className="custom-divider" />
                <SquadLineup
                    handleClickPlayer={handleClickPlayer}
                    handleSetReplacePlayer={handleSetReplacePlayer}
                    showCap
                    valueType={ValueType.FIXTURE}
                />
                <Divider className="custom-divider" />
                <PlayerBench handleClickPlayer={handleClickPlayer} valueType={ValueType.FIXTURE} />
                {playerClicked.length > 0 && (
                    <PlayerDetailsModal
                        selectedPlayer={playerClicked}
                        onClose={() => setPlayerClicked('')}
                        onAccept={() => handleReadyReplacePlayer(playerClicked)}
                    >
                        <Button type="primary" size="large" className="player-details-modal-btn">
                            Substitute
                        </Button>
                        <Row>
                            <Col span={12}>
                                <Checkbox disabled={isSubstitute(playerClicked)}>Captain</Checkbox>
                            </Col>
                            <Col span={12}>
                                <Checkbox disabled={isSubstitute(playerClicked)}>Vice Captain</Checkbox>
                            </Col>
                        </Row>
                    </PlayerDetailsModal>
                )}
            </div>
        </Content>
    );
};

const mapStateToProps = ({ data, game }: StoreState) => {
    const { playersBio, playersStats } = data;
    const { gameweek, squad, balance, isSquadComplete } = game;
    return {
        playersBio,
        playersStats,
        gameweek,
        squad,
        balance,
        isSquadComplete,
    };
};

export default connect(mapStateToProps)(checkSquadCompleteHOC(_PickTeam));
