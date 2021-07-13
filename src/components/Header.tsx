import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import moment from 'moment';
import { StoreState } from '../reducers';
import { getPreGwDate } from '../data';
import { DEFAULT_SEASON } from '../types';

const { Header } = Layout;

interface Props {
    gameweek: number;
    points: number;
}

const _Header = ({ gameweek, points }: Props) => (
    <Header className="site-layout-sub-header-background">
        <div className='header-item'>
            <div className='header-item-key'>Points:</div>
            <div className='header-item-value'>{points}</div>
        </div>
        <div className='header-item'>
            <div className='header-item-key'>Upcoming:</div>
            <div className='header-item-value'>GW{gameweek + 1}</div>
        </div>
        <div className='header-item'>
            <div className='header-item-key'>Today:</div>
            <div className='header-item-value'>{moment(getPreGwDate(DEFAULT_SEASON, gameweek)).format('ll')}</div>
        </div>
    </Header>
);

const mapStateToProps = ({
    game
}: StoreState) => {
    const { gameweek, points } = game;
    return {
        gameweek,
        points
    };
}

export default connect(mapStateToProps)(_Header);