import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { RouteComponentProps, Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { Layout, Menu } from 'antd';
import { Button } from 'antd';
import { incrementGameweek, loadNewGwData, addSquadPointsToHistory } from '../actions';
import { DEFAULT_SEASON, PlayersBio, PlayersStats, Squad } from '../types';
import { StoreState } from '../reducers';
import { getSquadPoints } from '../helpers';

interface Props extends RouteComponentProps<{}> {
    gameweek: number;
    isSquadComplete: boolean;
    playersStats: PlayersStats;
    playersBio: PlayersBio;
    squad: Squad;
    incrementGameweek: typeof incrementGameweek;
    loadNewGwData: typeof loadNewGwData;
    addSquadPointsToHistory: typeof addSquadPointsToHistory;
}

const { Sider } = Layout;

const _Sider = ({
    gameweek,
    isSquadComplete,
    playersStats,
    playersBio,
    squad,
    location,
    incrementGameweek,
    loadNewGwData,
    addSquadPointsToHistory,
}: Props) => {
    const handleIncrementGameweek = () => {
        loadNewGwData(gameweek + 1);
        addSquadPointsToHistory(getSquadPoints(squad, playersStats, playersBio));
        incrementGameweek();
    };

    return (
        <Sider className="sider" breakpoint="lg" collapsedWidth="0">
            <div className="sider-title">
                <div className="sider-title-text">
                    <strong>
                        <span className="desktop-text">Fantasy Again!</span>
                        <span className="mobile-text">FA!</span>
                    </strong>
                </div>
            </div>
            <div className="slider-season">
                <span className="desktop-text">Season:</span> {DEFAULT_SEASON}
            </div>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['/fixtures']}
                selectedKeys={[location.pathname]}
                className="sider-nav"
            >
                <Menu.Item key="/fixtures">
                    <Link to="/fixtures">Fixtures</Link>
                </Menu.Item>
                {isSquadComplete ? (
                    <Fragment>
                        <Menu.Item key="/points">
                            <Link to="/points">Points</Link>
                        </Menu.Item>
                        <Menu.Item key="/pickteam">
                            <Link to="/pickteam">Pick Team</Link>
                        </Menu.Item>
                        <Menu.Item key="/transfers">
                            <Link to="/transfers">Transfers</Link>
                        </Menu.Item>
                    </Fragment>
                ) : (
                    <Menu.Item key="/squadselection">
                        <Link to="/squadselection">Squad Selection</Link>
                    </Menu.Item>
                )}
                <Menu.Item key="/statistics">
                    <Link to="/statistics">Statistics</Link>
                </Menu.Item>
                <Menu.Item key="/settings">
                    <Link to="/settings">Settings</Link>
                </Menu.Item>
            </Menu>
            <div className="sider-next-gw">
                <Button
                    type="primary"
                    shape="round"
                    size={isMobile ? 'small' : 'middle'}
                    onClick={handleIncrementGameweek}
                >
                    <span className="desktop-text">Next Gameweek</span>
                    <span className="mobile-text">Next GW</span>
                </Button>
            </div>
        </Sider>
    );
};

const mapStateToProps = ({ data, game }: StoreState) => {
    const { playersStats, playersBio } = data;
    const { gameweek, isSquadComplete, squad } = game;
    return {
        gameweek,
        isSquadComplete,
        playersStats,
        playersBio,
        squad,
    };
};

export default connect(mapStateToProps, { incrementGameweek, loadNewGwData, addSquadPointsToHistory })(
    withRouter(_Sider)
);
