import React from 'react';
import { connect } from 'react-redux';
import { Layout, Statistic } from 'antd';
import moment from 'moment';
import { StoreState } from '../reducers';
import { getPreGwDate } from '../data';
import { DEFAULT_SEASON, PlayersStats, Squad } from '../types';
import { statisticsFontSize } from '../constants/ui';
import { calcSquadValueTotal, formatValue } from '../helpers';

const { Header } = Layout;

interface Props {
    gameweek: number;
    points: number;
    squad: Squad;
    playersStats: PlayersStats;
}

const _Header = ({ gameweek, points, squad, playersStats }: Props) => (
    <Header className="site-layout-sub-header-background">
        <Statistic title={'Points'} value={points} className="header-metric" valueStyle={statisticsFontSize} />
        <Statistic
            title={'Squad Value (£)'}
            value={formatValue(calcSquadValueTotal(squad, playersStats), true)}
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

const mapStateToProps = ({ data, game }: StoreState) => {
    const { playersStats } = data;
    const { gameweek, points, squad } = game;
    return {
        gameweek,
        points,
        squad,
        playersStats,
    };
};

export default connect(mapStateToProps)(_Header);
