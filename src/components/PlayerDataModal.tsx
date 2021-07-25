import React, { MouseEventHandler } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import { StoreState } from '../reducers';
import { FdrData, PlayersBio, PlayersStats } from '../types';

interface Props {
    selectedPlayer: string;
    onClose: MouseEventHandler;
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    fdr: FdrData;
    gameweek: number;
}

const _PlayerDataModal = ({ selectedPlayer, onClose, playersBio, playersStats, fdr, gameweek }: Props) => (
    <Modal title="Basic Modal" visible={selectedPlayer.length > 0} onOk={onClose} onCancel={onClose}>
        <p>{selectedPlayer && playersBio[selectedPlayer].webName}</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
    </Modal>
);

const mapStateToProps = (
    { data, game }: StoreState,
    ownProps: { selectedPlayer: string; onClose: MouseEventHandler }
) => {
    const { fdr, playersBio, playersStats } = data;
    const { gameweek } = game;
    const { selectedPlayer, onClose } = ownProps;
    return {
        selectedPlayer,
        onClose,
        playersBio,
        playersStats,
        fdr,
        gameweek,
    };
};

export default connect(mapStateToProps)(_PlayerDataModal);
