import React from 'react';
import { connect } from 'react-redux';
import { Layout, Card } from 'antd';

const { Content } = Layout;

const _Content = () => (
    <Content className='site-layout-content'>
        <div className="site-layout-background">
            <div className='page-title page-title-two-sections'>
                Points
            </div>
            <Card title="Goalkeeper">
                <Card type="inner" title="Inner Card title" extra={<a href="#">More</a>}>
                    Inner Card content
                </Card>
                <Card
                    style={{ marginTop: 16 }}
                    type="inner"
                    title="Inner Card title"
                    extra={<a href="#">More</a>}
                >
                    Inner Card content
                </Card>
            </Card>
        </div>
    </Content>
);

export default connect()(_Content);