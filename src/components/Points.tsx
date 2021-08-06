import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Divider, Layout, Statistic } from 'antd';
import { checkSquadCompleteHOC } from './checkSquadCompleteHOC';
import { StoreState } from '../reducers';
import { Position, ValueType } from '../types';
import PlayerDetailsModal from './PlayerDetailsModal';
import SquadLineup from './SquadLineup';
import PlayerBench from './PlayerBench';
import { statisticsFontSize } from '../constants/ui';

const { Content } = Layout;

const _Points = () => {
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
                    <div>Points</div>
                    <div className="top-metric-section center-when-mobile">
                        <Statistic
                            title="GW1"
                            value={56}
                            suffix="pts"
                            valueStyle={statisticsFontSize}
                            className="top-metric"
                        />
                    </div>
                </div>
                <div className="top-btn-container">
                    <Button size="large" className="top-btn">
                        Previous
                    </Button>
                    <Button size="large" className="top-btn">
                        Next
                    </Button>
                </div>
                <Divider className="custom-divider" />
                <SquadLineup
                    handleClickPlayer={handleClickPlayer}
                    handleSetReplacePlayer={handleSetReplacePlayer}
                    valueType={ValueType.POINTS}
                    showCap
                />
                <Divider className="custom-divider" />
                <PlayerBench
                    handleClickPlayer={handleClickPlayer}
                    handleSetReplacePlayer={handleSetReplacePlayer}
                    valueType={ValueType.POINTS}
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

export default connect(mapStateToProps)(checkSquadCompleteHOC(_Points));
