import React, { MouseEventHandler } from 'react';
import { Modal, Row, Col } from 'antd';
import { InGameTransfer, PlayersBio } from '../types';
import { PlayerCardSmall } from './PlayerCardSmall';
import { formatValue, getAdditionalTransfers } from '../helpers';

interface Props {
    playersBio: PlayersBio;
    isModalVisible: boolean;
    transfers: InGameTransfer[];
    freeTransfers: number;
    tempBalance: number;
    onOk: MouseEventHandler;
    onCancel: MouseEventHandler;
}

export const ConfirmTransfersModal = ({
    playersBio,
    isModalVisible,
    transfers,
    freeTransfers,
    tempBalance,
    onOk,
    onCancel,
}: Props) => (
    <Modal title="Confirm Transfers" visible={isModalVisible} onOk={onOk} onCancel={onCancel}>
        {transfers.map((transfer, i) => {
            const { playerToSell, playerToBuy } = transfer;
            const {
                webName: playerToSellName,
                teamCode: playerToSellTeamCode,
                position: playerToSellPosition,
            } = playersBio[playerToSell.code];
            const {
                webName: playerToBuyName,
                teamCode: playerToBuyTeamCode,
                position: playerToBuyPosition,
            } = playersBio[playerToBuy.code];
            return (
                <Row key={i}>
                    <Col span={12}>
                        <PlayerCardSmall
                            name={playerToSellName}
                            teamCode={playerToSellTeamCode}
                            position={playerToSellPosition}
                            isTarget={false}
                        />
                    </Col>
                    <Col span={12}>
                        <PlayerCardSmall
                            name={playerToBuyName}
                            teamCode={playerToBuyTeamCode}
                            position={playerToBuyPosition}
                            isTarget
                        />
                    </Col>
                </Row>
            );
        })}
        <div className="transfer-stats-container">
            <div className="transfer-stats-titles">
                <p>Free Transfers Used:</p>
                <p>Additional Transfers Used:</p>
                <p>Left in the Bank:</p>
            </div>
            <div className="transfer-stats-values">
                <p>
                    {freeTransfers === Number.MAX_SAFE_INTEGER
                        ? transfers.length
                        : Math.min(transfers.length, freeTransfers)}
                </p>
                <p>{getAdditionalTransfers(freeTransfers, transfers.length)}</p>
                <p>{formatValue(tempBalance)}</p>
            </div>
        </div>
    </Modal>
);
