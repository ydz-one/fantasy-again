import React, { MouseEventHandler } from 'react';
import { Modal } from 'antd';
import { InGameTransfer, PlayersBio } from '../types';

interface Props {
    playersBio: PlayersBio;
    isModalVisible: boolean;
    transfers: InGameTransfer[];
    onOk: MouseEventHandler;
    onCancel: MouseEventHandler;
}

export const ConfirmTransfersModal = ({ playersBio, isModalVisible, transfers, onOk, onCancel }: Props) => (
    <Modal title="Confirm Transfers" visible={isModalVisible} onOk={onOk} onCancel={onCancel}>
        {transfers.map((transfer, i) => (
            <p key={i}>
                {playersBio[transfer.playerToSell.code].webName} to {playersBio[transfer.playerToBuy.code].webName}
            </p>
        ))}
    </Modal>
);
