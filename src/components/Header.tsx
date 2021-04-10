import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { StoreState } from '../reducers';

const { Header } = Layout;

interface Props {
    gameweek: number
}

const _Header = ({ gameweek }: Props) => (
    <Header className="site-layout-sub-header-background">
        <div className='header-item'>
            <div className='header-item-key'>Upcoming:</div>
            <div className='header-item-value'>GW {gameweek + 1}</div>
        </div>
    </Header>
);

const mapStateToProps = ({
    game
}: StoreState) => {
    const { gameweek } = game;
    return {
        gameweek
    };
}

export default connect(mapStateToProps)(_Header);