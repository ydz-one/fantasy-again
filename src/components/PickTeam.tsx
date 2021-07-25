import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';

const { Content } = Layout;

const _PickTeam = () => (
    <Content className="site-layout-content">
        <div className="site-layout-background">Pick Team</div>
    </Content>
);

export default connect()(_PickTeam);
