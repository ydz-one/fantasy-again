import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { RouteComponentProps, Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { Layout, Menu } from 'antd';
import { Button, Modal } from 'antd';
import { goToNextGameweek, resetGameState, resetDataState } from '../actions';
import { DEFAULT_SEASON, PlayersBio, Squad } from '../types';
import { StoreState } from '../reducers';
import SummaryModal from './SummaryModal';

interface Props extends RouteComponentProps<{}> {
    gameweek: number;
    isSquadComplete: boolean;
    isSeasonEnd: boolean;
    playersBio: PlayersBio;
    squad: Squad;
    goToNextGameweek: Function;
}

const { Sider } = Layout;

const warnSquadIncomplete = () => {
    Modal.warning({
        title: 'Squad Selection Incomplete',
        content:
            'You must complete your squad on the Squad Selection page and click "Enter Squad" before proceeding to the next gameweek.',
    });
};

const _Sider = ({ gameweek, isSquadComplete, isSeasonEnd, playersBio, squad, location, goToNextGameweek }: Props) => {
    const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false);

    const handleIncrementGameweek = () => {
        if (isSquadComplete) {
            goToNextGameweek(gameweek, squad, playersBio);
        } else {
            warnSquadIncomplete();
        }
    };

    return (
        <Fragment>
            <Sider className="sider" breakpoint="lg" collapsedWidth="0">
                <div className="sider-title">
                    <div className="sider-title-text">
                        <strong>
                            <span className="desktop-text">Fantasy Again</span>
                            <span className="mobile-text">FA</span>
                        </strong>
                    </div>
                </div>
                <div className="sider-season">
                    <span className="desktop-text">Season:</span> {DEFAULT_SEASON}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['/fixtures']}
                    selectedKeys={[location.pathname]}
                    className="sider-nav"
                >
                    {!isSeasonEnd && (
                        <Menu.Item key="/fixtures">
                            <Link to="/fixtures">Fixtures</Link>
                        </Menu.Item>
                    )}
                    {isSquadComplete ? (
                        <Fragment>
                            <Menu.Item key="/points">
                                <Link to="/points">Points</Link>
                            </Menu.Item>
                            {!isSeasonEnd && (
                                <Fragment>
                                    <Menu.Item key="/pickteam">
                                        <Link to="/pickteam">Pick Team</Link>
                                    </Menu.Item>
                                    <Menu.Item key="/transfers">
                                        <Link to="/transfers">Transfers</Link>
                                    </Menu.Item>
                                </Fragment>
                            )}
                        </Fragment>
                    ) : (
                        <Menu.Item key="/squadselection">
                            <Link to="/squadselection">Squad Selection</Link>
                        </Menu.Item>
                    )}
                    <Menu.Item key="/statistics">
                        <Link to="/statistics">Statistics</Link>
                    </Menu.Item>
                    <Menu.Item key="/options">
                        <Link to="/options">Options</Link>
                    </Menu.Item>
                </Menu>
                <div className="sider-next-gw">
                    {isSeasonEnd ? (
                        <Button
                            type="primary"
                            shape="round"
                            size={isMobile ? 'small' : 'middle'}
                            onClick={() => setIsSummaryModalVisible(true)}
                        >
                            Summary
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            shape="round"
                            size={isMobile ? 'small' : 'middle'}
                            onClick={handleIncrementGameweek}
                        >
                            <span className="desktop-text">Next Gameweek</span>
                            <span className="mobile-text">Next GW</span>
                        </Button>
                    )}
                </div>
            </Sider>
            <SummaryModal isModalVisible={isSummaryModalVisible} onCancel={() => setIsSummaryModalVisible(false)} />
        </Fragment>
    );
};

const mapStateToProps = ({ data, game }: StoreState) => {
    const { playersBio } = data;
    const { gameweek, isSquadComplete, isSeasonEnd, squad } = game;
    return {
        gameweek,
        isSquadComplete,
        isSeasonEnd,
        playersBio,
        squad,
    };
};

export default connect(mapStateToProps, { goToNextGameweek })(withRouter(_Sider));
