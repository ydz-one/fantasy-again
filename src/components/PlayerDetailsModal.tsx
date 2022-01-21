import React, { MouseEventHandler, ReactNode } from 'react';
import { connect } from 'react-redux';
import { Modal, Tabs, Statistic, Row, Col, Typography } from 'antd';
import { StoreState } from '../reducers';
import { PlayersBio, PlayersStats, positionData, Squad } from '../types';
import PlayerFixtureHistory from './PlayerFixtureHistory';
import FutureFixtures from './FutureFixtures';
import {
    assertIsPosition,
    formatIctValues,
    formatLargeNumber,
    formatOneDecimalPlace,
    formatPoints,
    formatSelected,
    formatValue,
    getPlayerSellPrice,
} from '../helpers';
import { TeamTag } from './TeamTag';
import { PositionTag } from './PositionTag';

const { TabPane } = Tabs;
const { Title } = Typography;

interface Props {
    selectedPlayer: string;
    onClose: MouseEventHandler;
    children?: ReactNode;
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    gameweek: number;
    squad: Squad;
}

const _PlayerDetailsModal = ({
    selectedPlayer,
    onClose,
    children = null,
    playersBio,
    playersStats,
    gameweek,
    squad,
}: Props) => {
    const { firstName, secondName, teamCode, position } = playersBio[selectedPlayer];
    const { form, value, selected, seasonPoints, latestGwPoints, transfersIn, transfersOut, bonus, ictIndex } =
        playersStats[selectedPlayer];
    assertIsPosition(position);
    const playerIndex = squad[position].findIndex((player) => player.code === selectedPlayer);
    const buyPrice = playerIndex >= 0 ? squad[position][playerIndex].buyPrice : -1;
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
                    <Statistic title="Current Price" value={formatValue(value)} />
                </Col>
                <Col span={6}>
                    <Statistic
                        title="Sell Price"
                        value={
                            buyPrice > 0 ? formatValue(getPlayerSellPrice(selectedPlayer, squad, position, value)) : '-'
                        }
                    />
                </Col>
                <Col span={6}>
                    <Statistic title="Purchase" value={buyPrice > 0 ? formatValue(buyPrice) : '-'} />
                </Col>
                <Col span={6}>
                    <Statistic title="Form" value={formatOneDecimalPlace(form)} />
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
                    <Statistic title="GW Trans In" value={formatLargeNumber(transfersIn)} />
                </Col>
                <Col span={6}>
                    <Statistic title="GW Trans Out" value={formatLargeNumber(transfersOut)} />
                </Col>
                <Col span={6}>
                    <Statistic title="GW Net Trans" value={formatLargeNumber(transfersIn - transfersOut)} />
                </Col>
                <Col span={6}>
                    <Statistic title="Bonus Points" value={formatPoints(bonus)} />
                </Col>
                <Col span={6}>
                    <Statistic title="ICT Index" value={formatIctValues(ictIndex)} />
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
    ownProps: { selectedPlayer: string; onClose: MouseEventHandler; children?: ReactNode }
) => {
    const { playersBio, playersStats } = data;
    const { gameweek, squad } = game;
    const { selectedPlayer, onClose, children } = ownProps;
    return {
        selectedPlayer,
        onClose,
        children,
        playersBio,
        playersStats,
        gameweek,
        squad,
    };
};

export default connect(mapStateToProps)(_PlayerDetailsModal);
