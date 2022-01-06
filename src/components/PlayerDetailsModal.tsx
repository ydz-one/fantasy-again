import React, { MouseEventHandler, ReactNode } from 'react';
import { connect } from 'react-redux';
import { Modal, Tabs, Statistic, Row, Col, Typography } from 'antd';
import { StoreState } from '../reducers';
import { PlayersBio, PlayersStats } from '../types';
import PlayerFixtureHistory from './PlayerFixtureHistory';
import FutureFixtures from './FutureFixtures';
import { formatOneDecimalPlace, formatPoints, formatSelected, formatValue } from '../helpers';
import { TeamTag } from './TeamTag';
import { PositionTag } from './PositionTag';

const { TabPane } = Tabs;
const { Title } = Typography;

interface Props {
    selectedPlayer: string;
    onClose: MouseEventHandler;
    onAccept?: MouseEventHandler | null;
    children?: ReactNode;
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    gameweek: number;
}

const _PlayerDetailsModal = ({
    selectedPlayer,
    onClose,
    onAccept = null,
    children = null,
    playersBio,
    playersStats,
    gameweek,
}: Props) => {
    const { firstName, secondName, teamCode, position } = playersBio[selectedPlayer];
    const { form, value, selected, seasonPoints, latestGwPoints, transfersIn, transfersOut, bonus } =
        playersStats[selectedPlayer];
    return (
        <Modal title="Player Details" footer={null} onCancel={onClose} visible>
            <p>
                <Title level={3}> {`${firstName} ${secondName}`}</Title>
                <div>
                    <PositionTag position={position} useFullName />
                    <TeamTag teamCode={teamCode} useFullName />
                </div>
            </p>
            <Row>
                <Col span={6}>
                    <Statistic title="Form" value={formatOneDecimalPlace(form)} />
                </Col>
                <Col span={6}>
                    <Statistic title="Current Price" value={formatValue(value)} />
                </Col>
                <Col span={6}>
                    <Statistic title="Selected" value={formatSelected(selected)} />
                </Col>
                <Col span={6}>
                    <Statistic title={`GW ${gameweek}`} value={formatPoints(latestGwPoints)} />
                </Col>
                <Col span={6}>
                    <Statistic title="Total Points" value={formatPoints(seasonPoints)} />
                </Col>
                <Col span={6}>
                    <Statistic title="GW Trans In" value={transfersIn} />
                </Col>
                <Col span={6}>
                    <Statistic title="GW Trans Out" value={transfersOut} />
                </Col>
                <Col span={6}>
                    <Statistic title="Bonus Points" value={formatPoints(bonus)} />
                </Col>
            </Row>
            {children}
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
    ownProps: { selectedPlayer: string; onClose: MouseEventHandler; onAccept?: MouseEventHandler; children?: ReactNode }
) => {
    const { playersBio, playersStats } = data;
    const { gameweek } = game;
    const { selectedPlayer, onClose, onAccept, children } = ownProps;
    return {
        selectedPlayer,
        onClose,
        onAccept,
        children,
        playersBio,
        playersStats,
        gameweek,
    };
};

export default connect(mapStateToProps)(_PlayerDetailsModal);
