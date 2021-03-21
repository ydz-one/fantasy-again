import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';

const { Content } = Layout;

const _Content = () => (
    <Content style={{ margin: '24px 16px 0' }}>
    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
      content
    </div>
  </Content>
);

export default connect()(_Content);