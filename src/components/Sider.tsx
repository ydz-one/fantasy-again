import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { ScheduleOutlined } from '@ant-design/icons';

interface Props extends RouteComponentProps<{}> {
}

const { Sider } = Layout;

const _Sider = ({ location }: Props) => (
    <Sider
        className='sider'
        breakpoint='lg'
        collapsedWidth='0'
    >
        <div className='sider-title'>
            <ScheduleOutlined className='sider-icon' />
            <div className='sider-title-text'>
                <strong>
                    <span className='desktop-text'>Fantasy Again!</span>
                    <span className='mobile-text'>FA!</span>
                </strong>
            </div>
            <div className='slider-season'>
                <span className='desktop-text'>Season:</span> 2019/2020
            </div>
        </div>
        <Menu
            theme='dark'
            mode='inline'
            defaultSelectedKeys={['/fixtures']}
            selectedKeys={[location.pathname]}
        >
            <Menu.Item key="/fixtures">
                <Link to='/fixtures'>
                    Fixtures
                </Link>
            </Menu.Item>
            <Menu.Item key="/points">
                <Link to='/points'>
                    Points
                </Link>
            </Menu.Item>
            <Menu.Item key="/manage">
                <Link to='/manage'>
                    Manage
                </Link>
            </Menu.Item>
        </Menu>
    </Sider>
);

export default connect()(withRouter(_Sider));