import React, { FC, MouseEventHandler, ReactNode } from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'antd';
import { StoreState } from '../reducers';
import { FdrData, PlayersBio, PlayersStats } from '../types';

interface Props {
    selectedPlayer: string;
    onClose: MouseEventHandler;
    onAccept?: MouseEventHandler | null;
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    fdr: FdrData;
    gameweek: number;
}

const _PlayerDataModal = ({
    selectedPlayer,
    onClose,
    onAccept = null,
    playersBio,
    playersStats,
    fdr,
    gameweek,
}: Props) => {
    const modalProps: { onOk: MouseEventHandler; onCancel: MouseEventHandler; footer: ReactNode[] | null } = {
        onOk: onClose,
        onCancel: onClose,
        footer: null,
    };
    if (onAccept) {
        modalProps.onOk = onAccept;
        modalProps.footer = [
            <Button key="cancel" onClick={onClose}>
                Cancel
            </Button>,
            <Button key="select" type="primary" onClick={onAccept}>
                Select
            </Button>,
        ];
    }
    return (
        <Modal title="Basic Modal" visible={selectedPlayer.length > 0} {...modalProps}>
            <p>{selectedPlayer && playersBio[selectedPlayer].webName}</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Modal>
    );
};

const mapStateToProps = (
    { data, game }: StoreState,
    ownProps: { selectedPlayer: string; onClose: MouseEventHandler; onAccept?: MouseEventHandler }
) => {
    const { fdr, playersBio, playersStats } = data;
    const { gameweek } = game;
    const { selectedPlayer, onClose, onAccept } = ownProps;
    return {
        selectedPlayer,
        onClose,
        onAccept,
        playersBio,
        playersStats,
        fdr,
        gameweek,
    };
};

export default connect(mapStateToProps)(_PlayerDataModal);
