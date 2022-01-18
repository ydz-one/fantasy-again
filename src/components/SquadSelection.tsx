import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Divider, Layout, Statistic } from 'antd';
import { StoreState } from '../reducers';
import { addPlayerToSquad, finalizeSquad, resetSquad, setSquad } from '../actions';
import { DEFAULT_SEASON, PlayersBio, PlayersStats, Position, Squad, ValueType } from '../types';
import { calcNumPlayers, assertIsPosition } from '../helpers';
import SelectPlayerModal from './SelectPlayerModal';
import PlayerDetailsModal from './PlayerDetailsModal';
import { getTeamsOverMaxPlayerLimit } from '../helpers';
import { TeamTag } from './TeamTag';
import { getScoutPicksGW1 } from '../data';
import SquadLineup from './SquadLineup';
import { statisticsFontSize } from '../constants/ui';

const { Content } = Layout;
interface Props {
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    squad: Squad;
    balance: number;
    addPlayerToSquad: typeof addPlayerToSquad;
    finalizeSquad: typeof finalizeSquad;
    resetSquad: typeof resetSquad;
    setSquad: typeof setSquad;
}

const _SquadSelection = ({
    playersBio,
    playersStats,
    squad,
    balance,
    addPlayerToSquad,
    finalizeSquad,
    resetSquad,
    setSquad,
}: Props) => {
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
    const history = useHistory();

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
        addPlayerToSquad(
            position,
            { code: playerToReplace, buyPrice: playerToReplace !== '-1' ? playersStats[playerToReplace].value : 0 },
            { code: playerToAdd, buyPrice: playersStats[playerToAdd].value }
        );
        handleCloseSelectPlayerModal();
    };

    const handleReadyReplacePlayer = (playerClicked: string) => {
        const key = playersBio[playerClicked].position;
        assertIsPosition(key);
        const position = Position[key];
        handleSetReplacePlayer(playerClicked, position);
        setPlayerClicked('');
    };

    const handleFinalizeSquad = () => {
        finalizeSquad();
        history.push('/pickteam');
    };

    const handleReset = () => {
        resetSquad();
    };

    const handleSetScoutPicks = () => {
        setSquad(getScoutPicksGW1(DEFAULT_SEASON));
    };

    const numPlayersSelected = calcNumPlayers(squad);
    const isPositiveBalance = balance >= 0;
    const isFullSquad = numPlayersSelected === 15;
    const isSquadEmpty = numPlayersSelected === 0;
    const teamsOverPlayerLimit = getTeamsOverMaxPlayerLimit(squad, playersBio);
    const isSquadValid = isPositiveBalance && isFullSquad && teamsOverPlayerLimit.length === 0;
    return (
        <Content className="site-layout-content">
            <div className="site-layout-background">
                <div className="page-title page-title-two-sections">
                    <div>Squad Selection</div>
                    <div className="center-when-mobile">
                        <div className="squad-selection-metrics">
                            <Statistic
                                title="Selected"
                                value={numPlayersSelected}
                                valueStyle={{ ...statisticsFontSize, color: isFullSquad ? '#3f8600' : '#cf1322' }}
                                suffix={'/15'}
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
                    <Button size="large" className="top-btn" onClick={handleSetScoutPicks} disabled={!isSquadEmpty}>
                        Preset
                    </Button>
                    <Button size="large" className="top-btn" onClick={handleReset} disabled={isSquadEmpty}>
                        Reset
                    </Button>
                </div>
                <Divider className="custom-divider" />
                <SquadLineup
                    handleClickPlayer={handleClickPlayer}
                    handleSetReplacePlayer={handleSetReplacePlayer}
                    showSubs
                    valueType={ValueType.PRICE}
                />
                <Divider className="custom-divider" />
                <div className="bottom-btn-container">
                    <Button
                        size="large"
                        type="primary"
                        onClick={handleFinalizeSquad}
                        className="enter-squad-btn"
                        disabled={!isSquadValid}
                    >
                        Enter Squad
                    </Button>
                    <div className="error-note">
                        {!isPositiveBalance && <span>Not enough money in the bank. </span>}
                        {teamsOverPlayerLimit.length > 0 && (
                            <span>
                                Too many players from{' '}
                                {teamsOverPlayerLimit.map((team) => (
                                    <TeamTag teamCode={team} />
                                ))}
                            </span>
                        )}
                    </div>
                </div>
                {playerClicked.length > 0 && (
                    <PlayerDetailsModal selectedPlayer={playerClicked} onClose={() => setPlayerClicked('')}>
                        <Button
                            type="primary"
                            size="large"
                            className="player-details-modal-btn"
                            onClick={() => handleReadyReplacePlayer(playerClicked)}
                        >
                            Replace
                        </Button>
                    </PlayerDetailsModal>
                )}
                <SelectPlayerModal
                    position={position}
                    playerToReplace={playerToReplace}
                    onChangePlayerToAdd={(playerToAdd: string) => setPlayerToAdd(playerToAdd)}
                    onClose={handleCloseSelectPlayerModal}
                />
                {playerToAdd.length > 0 && (
                    <PlayerDetailsModal selectedPlayer={playerToAdd} onClose={() => setPlayerToAdd('')}>
                        <Button
                            type="primary"
                            size="large"
                            className="player-details-modal-btn"
                            onClick={handleAddPlayerToSquad}
                        >
                            Select
                        </Button>
                    </PlayerDetailsModal>
                )}
            </div>
        </Content>
    );
};

const mapStateToProps = ({ data, game }: StoreState) => {
    const { playersBio, playersStats } = data;
    const { squad, balance } = game;
    return {
        playersBio,
        playersStats,
        squad,
        balance,
    };
};

export default connect(mapStateToProps, { addPlayerToSquad, finalizeSquad, resetSquad, setSquad })(_SquadSelection);
