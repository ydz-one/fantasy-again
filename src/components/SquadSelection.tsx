import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { StoreState } from '../reducers';
import { addPlayerToSquad } from '../actions';
import { PlayersBio, PlayersStats, Position, positions, Squad } from '../types';
import { PlayerCard } from './PlayerCard';
import SelectPlayerModal from './SelectPlayerModal';
import PlayerDataModal from './PlayerDataModal';
import { formatValue } from '../data';

const { Content } = Layout;
interface Props {
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    squad: Squad;
    addPlayerToSquad: typeof addPlayerToSquad;
}

const renderSquad = (playersBio: PlayersBio, playersStats: PlayersStats, squad: Squad, handleClickPlayer: Function) => {
    const renderPlayerCard = (position: Position) => (idx: number) => {
        const code = squad[position][idx];
        let name = '';
        let teamCode = '';
        let playerCode = '-1';
        let value = 0;
        if (code) {
            playerCode = code;
            name = playersBio[code].webName;
            teamCode = playersBio[code].teamCode;
            value = playersStats[code].value;
        }
        return (
            <PlayerCard
                key={idx}
                position={position}
                code={playerCode}
                name={name}
                teamCode={teamCode}
                valueOrPoints={formatValue(value)}
                onClick={() => handleClickPlayer(playerCode, position)}
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

const _SquadSelection = ({ playersBio, playersStats, squad, addPlayerToSquad }: Props) => {
    const [replacementInfo, setReplacementInfo] = useState({
        position: Position.GK,
        playerToReplace: '',
    });
    const [playerToAdd, setPlayerToAdd] = useState('');
    const { position, playerToReplace } = replacementInfo;

    const handleClickPlayer = (playerToReplace: string, position: Position) => {
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
    };

    const handleAddPlayerToSquad = () => {
        addPlayerToSquad(position, playerToReplace, playerToAdd);
        handleCloseSelectPlayerModal();
    };

    const handleChangePlayerToAdd = (player: string) => {
        setPlayerToAdd(player);
    };

    const handleClosePlayerDataModal = () => {
        setPlayerToAdd('');
    };

    return (
        <Content className="site-layout-content">
            <div className="site-layout-background">
                <div className="page-title page-title-two-sections">Squad Selection</div>
                {renderSquad(playersBio, playersStats, squad, handleClickPlayer)}
                <SelectPlayerModal
                    position={position}
                    playerToReplace={playerToReplace}
                    playerToAdd={playerToAdd}
                    onChangePlayerToAdd={handleChangePlayerToAdd}
                    onClose={handleCloseSelectPlayerModal}
                    onAddPlayerToSquad={handleAddPlayerToSquad}
                />
                <PlayerDataModal
                    selectedPlayer={playerToAdd}
                    onClose={handleClosePlayerDataModal}
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
