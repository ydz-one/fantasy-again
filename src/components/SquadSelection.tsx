import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Divider, Layout, Statistic } from 'antd';
import { StoreState } from '../reducers';
import { addPlayerToSquad, finalizeSquad, resetSquad } from '../actions';
import { PlayersBio, PlayersStats, Position, Squad } from '../types';
import { PlayerCard } from './PlayerCard';
import SelectPlayerModal from './SelectPlayerModal';
import PlayerDetailsModal from './PlayerDetailsModal';
import { formatValue, getTeamsOverMaxPlayerLimit } from '../helpers';
import { EmptyPlayerCard } from './EmptyPlayerCard';
import { TeamTag } from './TeamTag';

const { Content } = Layout;
interface Props {
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    squad: Squad;
    balance: number;
    addPlayerToSquad: typeof addPlayerToSquad;
    finalizeSquad: typeof finalizeSquad;
    resetSquad: typeof resetSquad;
}

const renderSquad = (
    playersBio: PlayersBio,
    playersStats: PlayersStats,
    squad: Squad,
    handleClickPlayer: Function,
    handleSetReplacePlayer: Function
) => {
    const renderPlayerCard = (position: Position) => (idx: number) => {
        const squadPlayer = squad[position][idx];
        if (!squadPlayer) {
            return <EmptyPlayerCard position={position} onClick={() => handleSetReplacePlayer('-1', position)} />;
        }
        const { code } = squadPlayer;
        const { webName, teamCode } = playersBio[code];
        const { value, injured, injury, injuryEnd } = playersStats[code];
        return (
            <PlayerCard
                key={idx}
                position={position}
                name={webName}
                teamCode={teamCode}
                valueOrPoints={formatValue(value)}
                injured={injured}
                injury={injury}
                injuryEnd={injuryEnd}
                hasRedCard={false}
                captainStatus=""
                onClick={() => handleClickPlayer(code)}
            />
        );
    };

    return (
        <Fragment>
            <div className="position-row position-row-top">{[0, 1].map(renderPlayerCard(Position.GK))}</div>
            <div className="position-row">{[0, 1, 2, 3, 4].map(renderPlayerCard(Position.DEF))}</div>
            <div className="position-row">{[0, 1, 2, 3, 4].map(renderPlayerCard(Position.MID))}</div>
            <div className="position-row position-row-bottom">{[0, 1, 2].map(renderPlayerCard(Position.FWD))}</div>
        </Fragment>
    );
};

function assertIsPosition(obj: unknown): asserts obj is Position {
    if (
        typeof obj === 'string' &&
        (obj === Position.GK || obj === Position.DEF || obj === Position.MID || obj === Position.FWD)
    )
        return;
    else throw new Error('Input must be a Position');
}

const calcNumPlayers = (squad: Squad) => {
    let sum = 0;
    for (const [position, players] of Object.entries(squad)) {
        if (position in Position) {
            sum += players.length;
        }
    }
    return sum;
};

const _SquadSelection = ({
    playersBio,
    playersStats,
    squad,
    balance,
    addPlayerToSquad,
    finalizeSquad,
    resetSquad,
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
        addPlayerToSquad(position, playerToReplace, { code: playerToAdd, buyPrice: playersStats[playerToAdd].value });
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
                                valueStyle={{ color: isFullSquad ? '#3f8600' : '#cf1322' }}
                                suffix={'/15'}
                                className="squad-selection-metric squad-selection-metric-left"
                            />
                            <Statistic
                                title="Balance (£)"
                                value={balance / 10}
                                valueStyle={{ color: isPositiveBalance ? '#3f8600' : '#cf1322' }}
                                precision={1}
                                className="squad-selection-metric"
                            />
                        </div>
                    </div>
                </div>
                <div className="top-btn-container">
                    <Button size="large" className="top-btn" disabled>
                        Auto Pick
                    </Button>
                    <Button size="large" className="top-btn" onClick={handleReset} disabled={isSquadEmpty}>
                        Reset
                    </Button>
                </div>
                <Divider className="custom-divider" />
                {renderSquad(playersBio, playersStats, squad, handleClickPlayer, handleSetReplacePlayer)}
                <Divider className="custom-divider" />
                <div className="enter-squad-btn-container">
                    <Button
                        size="large"
                        type="primary"
                        onClick={handleFinalizeSquad}
                        className="enter-squad-btn"
                        disabled={!isSquadValid}
                    >
                        Enter Squad
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
    const { squad, balance } = game;
    return {
        playersBio,
        playersStats,
        squad,
        balance,
    };
};

export default connect(mapStateToProps, { addPlayerToSquad, finalizeSquad, resetSquad })(_SquadSelection);
