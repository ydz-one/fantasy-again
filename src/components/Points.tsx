import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Divider, Layout, Statistic } from 'antd';
import { checkSquadCompleteHOC } from './checkSquadCompleteHOC';
import { StoreState } from '../reducers';
import PlayerDetailsModal from './PlayerDetailsModal';
import SquadLineup from './SquadLineup';
import SquadPointsLineup from './SquadPointsLineup';
import PlayerBench from './PlayerBench';
import PlayerPointsBench from './PlayerPointsBench';
import { statisticsFontSize } from '../constants/ui';
import { formatPoints } from '../helpers';
import { ValueType } from '../types';

const { Content } = Layout;

interface Props {
    gameweek: number;
    isSquadComplete: boolean;
    gwPointsHistory: number[];
}

const _Points = ({ gameweek, gwPointsHistory }: Props) => {
    const [playerClicked, setPlayerClicked] = useState('');
    const [gwToShow, setGwToShow] = useState(gameweek);

    useEffect(() => {
        setGwToShow(gameweek);
    }, [gameweek]);

    const handleClickPlayer = (playerClicked: string) => {
        setPlayerClicked(playerClicked);
    };

    const handleClickNext = () => {
        setGwToShow((gwToShow) => gwToShow + 1);
    };

    const handleClickPrevious = () => {
        setGwToShow((gwToShow) => gwToShow - 1);
    };

    return (
        <Content className="site-layout-content">
            <div className="site-layout-background">
                <div className="page-title page-title-two-sections">
                    <div>Points</div>
                    <div className="top-metric-section center-when-mobile">
                        <Statistic
                            title={'GW' + (gwToShow || 1)}
                            value={formatPoints(gwPointsHistory[gwToShow - 1] || 0)}
                            valueStyle={statisticsFontSize}
                            className="top-metric"
                        />
                    </div>
                </div>
                <div className="top-btn-container">
                    <Button
                        size="large"
                        className="top-btn"
                        onClick={handleClickPrevious}
                        disabled={gwToShow === 1 || gameweek === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        size="large"
                        className="top-btn"
                        onClick={handleClickNext}
                        disabled={gwToShow === gameweek || gameweek === 0}
                    >
                        Next
                    </Button>
                </div>
                <Divider className="custom-divider" />
                {gwToShow === 0 || gwToShow === gameweek ? (
                    <SquadLineup handleClickPlayer={handleClickPlayer} valueType={ValueType.POINTS} showCap />
                ) : (
                    <SquadPointsLineup gameweek={gwToShow} handleClickPlayer={handleClickPlayer} />
                )}
                <Divider className="custom-divider" />
                {gwToShow === 0 || gwToShow === gameweek ? (
                    <PlayerBench handleClickPlayer={handleClickPlayer} valueType={ValueType.POINTS} />
                ) : (
                    <PlayerPointsBench gameweek={gwToShow} handleClickPlayer={handleClickPlayer} />
                )}
                <PlayerDetailsModal selectedPlayer={playerClicked} onClose={() => setPlayerClicked('')} />
            </div>
        </Content>
    );
};

const mapStateToProps = ({ game }: StoreState) => {
    const { isSquadComplete, gameweek, gwPointsHistory } = game;
    return {
        isSquadComplete,
        gameweek,
        gwPointsHistory,
    };
};

export default connect(mapStateToProps)(checkSquadCompleteHOC(_Points));
