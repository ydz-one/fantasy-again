import React from 'react';
import { connect } from 'react-redux';
import { Layout, Statistic } from 'antd';
import moment from 'moment';
import { StoreState } from '../reducers';
import { getPreGwDate } from '../data';
import { DEFAULT_SEASON } from '../types';
import { statisticsFontSize } from '../constants/ui';

const { Header } = Layout;

interface Props {
    gameweek: number;
    points: number;
}

const _Header = ({ gameweek, points }: Props) => (
    <Header className="site-layout-sub-header-background">
        <Statistic title={'Points'} value={points} className="header-metric" valueStyle={statisticsFontSize} />
        <Statistic
            title={'Squad Value (£)'}
            value={100.0}
            precision={1}
            className="header-metric"
            valueStyle={statisticsFontSize}
        />
        <Statistic
            title={"Today's Date"}
            value={moment(getPreGwDate(DEFAULT_SEASON, gameweek)).format('ll')}
            className="header-metric  header-metric-right"
            valueStyle={statisticsFontSize}
        />
    </Header>
);

const mapStateToProps = ({ game }: StoreState) => {
    const { gameweek, points } = game;
    return {
        gameweek,
        points,
    };
};

export default connect(mapStateToProps)(_Header);
