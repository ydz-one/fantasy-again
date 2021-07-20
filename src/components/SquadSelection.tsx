import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { EmptyPlayerCard } from './EmptyPlayerCard';

const { Content } = Layout;

const _Content = () => (
    <Content className='site-layout-content'>
        <div className="site-layout-background">
            <div className='page-title page-title-two-sections'>
                Squad Selection
            </div>
            <div className='position-row'>
                <EmptyPlayerCard position='GK' />
                <EmptyPlayerCard position='GK' />
            </div>
            <div className='position-row'>
                <EmptyPlayerCard position='DEF' />
                <EmptyPlayerCard position='DEF' />
                <EmptyPlayerCard position='DEF' />
                <EmptyPlayerCard position='DEF' />
                <EmptyPlayerCard position='DEF' />
            </div>
            <div className='position-row'>
                <EmptyPlayerCard position='MID' />
                <EmptyPlayerCard position='MID' />
                <EmptyPlayerCard position='MID' />
                <EmptyPlayerCard position='MID' />
                <EmptyPlayerCard position='MID' />
            </div>
            <div className='position-row'>
                <EmptyPlayerCard position='FWD' />
                <EmptyPlayerCard position='FWD' />
                <EmptyPlayerCard position='FWD' />
            </div>
        </div>
    </Content>
);

export default connect()(_Content);