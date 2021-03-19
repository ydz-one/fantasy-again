import React from 'react';
import { connect } from 'react-redux';
import { SideMenu } from './SideMenu';

const _App = () => (
    <div className="App">
        <SideMenu />
    </div>
);

export const App = connect()(_App);
