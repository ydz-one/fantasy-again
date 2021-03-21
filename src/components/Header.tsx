import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';

const { Header } = Layout;

const _Header = () => (
    <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
);

export default connect()(_Header);