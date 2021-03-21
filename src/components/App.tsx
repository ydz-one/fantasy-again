import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import Sider from './Sider';
import Header from './Header';
import Content from './Content';

const _App = () => (
    <Layout className='app'>
        <Sider />
        <Header />
        <Content />
    </Layout>
);

export const App = connect()(_App);
