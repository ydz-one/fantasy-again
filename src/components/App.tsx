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
import Statistics from './Statistics';
import Options from './Options';
import SquadSelection from './SquadSelection';
import { StoreState } from '../reducers';

interface Props {
    isSquadComplete: boolean;
}

const _App = ({ isSquadComplete }: Props) => (
    <Layout className="app">
        <Sider />
        <Layout className="app">
            <Header />
            <Switch>
                <Route path="/fixtures" render={() => <Fixtures />} />
                <Route path="/squadselection" render={() => <SquadSelection />} />
                <Route path="/points" render={() => <Points />} />
                <Route path="/pickteam" render={() => <PickTeam />} />
                <Route path="/transfers" render={() => <Transfers />} />
                <Route path="/statistics" render={() => <Statistics />} />
                <Route path="/options" render={() => <Options />} />
                {isSquadComplete ? <Redirect to="/pickteam" /> : <Redirect to="/squadselection" />}
            </Switch>
        </Layout>
    </Layout>
);

const mapStateToProps = ({ game }: StoreState) => {
    const { isSquadComplete } = game;
    return {
        isSquadComplete,
    };
};

export const App = connect(mapStateToProps)(_App);
