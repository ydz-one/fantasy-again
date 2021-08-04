import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Divider, Layout, Statistic } from 'antd';
import { checkSquadCompleteHOC } from './checkSquadCompleteHOC';
import SquadLineup from './SquadLineup';
import PlayerDetailsModal from './PlayerDetailsModal';
import SelectPlayerModal from './SelectPlayerModal';
import { PlayersBio, PlayersStats, Position, Squad } from '../types';
import { resetSquad, setSquad } from '../actions';
import { TeamTag } from './TeamTag';
import { getTeamsOverMaxPlayerLimit } from '../helpers';
import { StoreState } from '../reducers';
import { statisticsFontSize } from '../constants/ui';

const { Content } = Layout;

interface Props {
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    squad: Squad;
    balance: number;
    isSquadComplete: boolean;
    resetSquad: typeof resetSquad;
    setSquad: typeof setSquad;
}

const _Transfers = ({ playersBio, playersStats, squad, balance, resetSquad, setSquad }: Props) => {
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

    const handleCloseSelectPlayerModal = () => {
        setPlayerToAdd(() => '');
        setReplacementInfo(() => ({
            position: Position.GK,
            playerToReplace: '',
        }));
        setPlayerClicked(() => '');
    };

    const handleAddPlayerToSquad = () => {
        handleCloseSelectPlayerModal();
    };

    const handleReadyReplacePlayer = (playerClicked: string) => {};

    const handleFinalizeSquad = () => {};

    const isPositiveBalance = balance >= 0;
    const teamsOverPlayerLimit = getTeamsOverMaxPlayerLimit(squad, playersBio);
    const isSquadValid = isPositiveBalance && teamsOverPlayerLimit.length === 0;
    const cost = 0;
    const freeTransfers = 1;

    return (
        <Content className="site-layout-content">
            <div className="site-layout-background">
                <div className="page-title page-title-two-sections">
                    <div>Transfers</div>
                    <div className="center-when-mobile">
                        <div className="transfers-metrics">
                            <Statistic
                                title="FT"
                                value={freeTransfers}
                                valueStyle={{ ...statisticsFontSize, color: freeTransfers > 0 ? '#3f8600' : '#cf1322' }}
                                className="top-metric"
                            />
                            <Statistic
                                title="Cost"
                                value={cost}
                                valueStyle={{ ...statisticsFontSize, color: cost === 0 ? '#3f8600' : '#cf1322' }}
                                className="top-metric"
                            />
                            <Statistic
                                title="Bank (£)"
                                value={balance / 10}
                                valueStyle={{ ...statisticsFontSize, color: isPositiveBalance ? '#3f8600' : '#cf1322' }}
                                precision={1}
                                className="top-metric"
                            />
                        </div>
                    </div>
                </div>
                <div className="top-btn-container">
                    <Button size="large" className="top-btn">
                        Free Hit
                    </Button>
                    <Button size="large" className="top-btn">
                        Wildcard
                    </Button>
                </div>
                <Divider className="custom-divider" />
                <SquadLineup
                    handleClickPlayer={handleClickPlayer}
                    handleSetReplacePlayer={handleSetReplacePlayer}
                    showSubs
                />
                <Divider className="custom-divider" />
                <div className="bottom-btn-container">
                    <Button size="large" onClick={handleFinalizeSquad} className="bottom-btn">
                        Cancel
                    </Button>
                    <Button
                        size="large"
                        type="primary"
                        onClick={handleFinalizeSquad}
                        className="bottom-btn"
                        disabled={!isSquadValid}
                    >
                        Next
                    </Button>
                    {teamsOverPlayerLimit.length > 0 && (
                        <div className="error-note">
                            Too many players from{' '}
                            {teamsOverPlayerLimit.map((team) => (
                                <TeamTag teamCode={team} />
                            ))}
                        </div>
                    )}
                </div>
                <PlayerDetailsModal
                    selectedPlayer={playerClicked}
                    onClose={() => setPlayerClicked('')}
                    onAccept={() => handleReadyReplacePlayer(playerClicked)}
                />
                <SelectPlayerModal
                    position={position}
                    playerToReplace={playerToReplace}
                    onChangePlayerToAdd={(playerToAdd: string) => setPlayerToAdd(playerToAdd)}
                    onClose={handleCloseSelectPlayerModal}
                />
                <PlayerDetailsModal
                    selectedPlayer={playerToAdd}
                    onClose={() => setPlayerToAdd('')}
                    onAccept={handleAddPlayerToSquad}
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

export default connect(mapStateToProps, { resetSquad, setSquad })(checkSquadCompleteHOC(_Transfers));
