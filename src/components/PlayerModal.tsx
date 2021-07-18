import React, { MouseEventHandler } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import { StoreState } from '../reducers';
import { FdrData, PlayersBio, PlayersStats } from '../types';

interface Props {
    selectedPlayer: string,
    handleClose: MouseEventHandler,
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    fdr: FdrData;
    gameweek: number;
}

const _PlayerModal = ({ selectedPlayer, handleClose, playersBio, playersStats, fdr, gameweek }: Props) => (
    <Modal title="Basic Modal" visible={selectedPlayer.length > 0} onOk={handleClose} onCancel={handleClose}>
        <p>{selectedPlayer && playersBio[selectedPlayer].web_name}</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
  </Modal>
);

const mapStateToProps = ({
    data,
    game
}: StoreState, ownProps: { selectedPlayer: string, handleClose: MouseEventHandler }) => {
    const { fdr, playersBio, playersStats } = data;
    const { gameweek } = game;
    const { selectedPlayer, handleClose } = ownProps;
    return {
        selectedPlayer,
        handleClose,
        playersBio,
        playersStats,
        fdr,
        gameweek
    };
}

export default connect(mapStateToProps)(_PlayerModal);