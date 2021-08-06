import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Divider, Layout, Statistic } from 'antd';
import { checkSquadCompleteHOC } from './checkSquadCompleteHOC';
import { StoreState } from '../reducers';
import { Position, ValueType } from '../types';
import PlayerDetailsModal from './PlayerDetailsModal';
import SquadLineup from './SquadLineup';
import { preGwDates } from '../data/2020_2021/preGwDates';
import moment from 'moment';
import { statisticsFontSize } from '../constants/ui';
import PlayerBench from './PlayerBench';

const { Content } = Layout;

const _PickTeam = () => {
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
                            title="GW1 Deadline"
                            value={moment(preGwDates[0]).add(1, 'days').format('ll')}
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
                <PlayerBench
                    handleClickPlayer={handleClickPlayer}
                    handleSetReplacePlayer={handleSetReplacePlayer}
                    valueType={ValueType.FIXTURE}
                />
                <PlayerDetailsModal
                    selectedPlayer={playerClicked}
                    onClose={() => setPlayerClicked('')}
                    onAccept={() => handleReadyReplacePlayer(playerClicked)}
                />
            </div>
        </Content>
    );
};

const mapStateToProps = ({ data, game }: StoreState) => {
    const { playersBio, playersStats } = data;
    const { squad, balance, isSquadComplete } = game;
    return {
        playersBio,
        playersStats,
        squad,
        balance,
        isSquadComplete,
    };
};

export default connect(mapStateToProps)(checkSquadCompleteHOC(_PickTeam));
