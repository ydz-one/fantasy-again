import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import Sider from './Sider';
import Header from './Header';
import Fixtures from './Fixtures';
import Points from './Points';
import PickTeam from './PickTeam';
import Transfers from './Transfers';

const _App = () => (
    <Layout className='app'>
        <Sider />
        <Header />
        <Switch>
            <Route
                path='/fixtures'
                render={() => <Fixtures />}
            />
            <Route
                path='/points'
                render={() => <Points />}
            />
            <Route
                path='/pickteam'
                render={() => <PickTeam />}
            />
            <Route
                path='/transfers'
                render={() => <Transfers />}
            />
            <Redirect to="/fixtures" />
        </Switch>
    </Layout>
);

export const App = connect()(_App);
