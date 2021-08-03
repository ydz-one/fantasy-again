import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { checkSquadCompleteHOC } from './checkSquadCompleteHOC';
import { StoreState } from '../reducers';

const { Content } = Layout;

const _PickTeam = () => (
    <Content className="site-layout-content">
        <div className="site-layout-background">Pick Team</div>
    </Content>
);

const mapStateToProps = ({ game }: StoreState) => {
    const { isSquadComplete } = game;
    return {
        isSquadComplete,
    };
};

export default connect(mapStateToProps)(checkSquadCompleteHOC(_PickTeam));
