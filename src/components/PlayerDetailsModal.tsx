import React, { MouseEventHandler, ReactNode } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Tabs } from 'antd';
import { StoreState } from '../reducers';
import { FdrData, PlayersBio, PlayersStats } from '../types';
import PlayerFixtureHistory from './PlayerFixtureHistory';
import FutureFixtures from './FutureFixtures';

const { TabPane } = Tabs;

interface Props {
    selectedPlayer: string;
    onClose: MouseEventHandler;
    onAccept?: MouseEventHandler | null;
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    fdr: FdrData;
    gameweek: number;
}

const _PlayerDetailsModal = ({
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
    const { teamCode } = playersBio[selectedPlayer];
    return (
        <Modal title="Player Details" visible {...modalProps}>
            <p>{selectedPlayer && playersBio[selectedPlayer].webName}</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <Tabs className="player-fixture-data" centered={true} defaultActiveKey="history" tabBarGutter={0}>
                <TabPane tab={<span>History</span>} key="history">
                    <PlayerFixtureHistory selectedPlayer={selectedPlayer} />
                </TabPane>
                <TabPane tab={<span>Fixtures</span>} key="fixture">
                    <FutureFixtures teamCode={teamCode} />
                </TabPane>
            </Tabs>
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

export default connect(mapStateToProps)(_PlayerDetailsModal);
