import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { StoreState } from '../reducers';
import { addPlayerToSquad } from '../actions';
import { PlayersBio, PlayersStats, Position, Squad } from '../types';
import { PlayerCard, PlayerCardProps } from './PlayerCard';
import SelectPlayerModal from './SelectPlayerModal';
import PlayerDataModal from './PlayerDataModal';
import { formatValue } from '../data';
import { EmptyPlayerCard } from './EmptyPlayerCard';

const { Content } = Layout;
interface Props {
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    squad: Squad;
    addPlayerToSquad: typeof addPlayerToSquad;
}

const renderSquad = (
    playersBio: PlayersBio,
    playersStats: PlayersStats,
    squad: Squad,
    handleClickPlayer: Function,
    handleSetReplacePlayer: Function
) => {
    const renderPlayerCard = (position: Position) => (idx: number) => {
        const code = squad[position][idx];
        if (!code) {
            return <EmptyPlayerCard position={position} onClick={() => handleSetReplacePlayer('-1', position)} />;
        }
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
            <div className="position-row">{[0, 1].map(renderPlayerCard(Position.GK))}</div>
            <div className="position-row">{[0, 1, 2, 3, 4].map(renderPlayerCard(Position.DEF))}</div>
            <div className="position-row">{[0, 1, 2, 3, 4].map(renderPlayerCard(Position.MID))}</div>
            <div className="position-row">{[0, 1, 2].map(renderPlayerCard(Position.FWD))}</div>
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

const _SquadSelection = ({ playersBio, playersStats, squad, addPlayerToSquad }: Props) => {
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
        addPlayerToSquad(position, playerToReplace, playerToAdd);
        handleCloseSelectPlayerModal();
    };

    const handleReadyReplacePlayer = (playerClicked: string) => {
        const key = playersBio[playerClicked].position;
        assertIsPosition(key);
        const position = Position[key];
        handleSetReplacePlayer(playerClicked, position);
        setPlayerClicked('');
    };

    return (
        <Content className="site-layout-content">
            <div className="site-layout-background">
                <div className="page-title page-title-two-sections">Squad Selection</div>
                {renderSquad(playersBio, playersStats, squad, handleClickPlayer, handleSetReplacePlayer)}
                <PlayerDataModal
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
                <PlayerDataModal
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
    const { squad } = game;
    return {
        playersBio,
        playersStats,
        squad,
    };
};

export default connect(mapStateToProps, { addPlayerToSquad })(_SquadSelection);
