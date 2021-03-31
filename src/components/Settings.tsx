import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';

const { Content } = Layout;

const _Content = () => (
    <Content className='site-layout-content'>
        <div className="site-layout-background">
            Settings
        </div>
    </Content>
);

export default connect()(_Content);