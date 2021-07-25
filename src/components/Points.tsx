import React from 'react';
import { connect } from 'react-redux';
import { Layout, Card } from 'antd';

const { Content } = Layout;

const _Points = () => (
    <Content className="site-layout-content">
        <div className="site-layout-background">
            <div className="page-title page-title-two-sections">Points</div>
            <Card title="Goalkeeper" bordered={false}>
                <div className="player-section"></div>
            </Card>
        </div>
    </Content>
);

export default connect()(_Points);
