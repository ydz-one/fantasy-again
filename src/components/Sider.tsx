import React from 'react';
import { connect } from 'react-redux';
import { Layout, Menu } from 'antd';
import { ScheduleOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const _SideMenu = () => (
    <Sider
        className='sider'
        breakpoint='lg'
        collapsedWidth='0'
    >
        <div>
            <ScheduleOutlined className='sider-icon' />
            <div className='sider-title'>
                <strong>
                    <span className='desktop-text'>Fantasy Again!</span>
                    <span className='mobile-text'>FA!</span>
                </strong>
            </div>
        </div>
        <Menu theme='dark' mode='inline' defaultSelectedKeys={['4']}>
            <Menu.Item key="1">
            Fixtures
            </Menu.Item>
            <Menu.Item key="2">
            Points
            </Menu.Item>
            <Menu.Item key="3">
            Manage
            </Menu.Item>
        </Menu>
    </Sider>
);

export default connect()(_SideMenu);