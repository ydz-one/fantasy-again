import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';

const { Content } = Layout;

const _Transfers = () => (
    <Content className="site-layout-content">
        <div className="site-layout-background">Transfers</div>
    </Content>
);

export default connect()(_Transfers);
