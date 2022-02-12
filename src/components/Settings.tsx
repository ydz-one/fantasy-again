import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Layout, Button, Modal } from 'antd';
import { resetGameState, resetDataState } from '../actions';

const { Content } = Layout;
interface Props {
    resetGameState: typeof resetGameState;
    resetDataState: typeof resetDataState;
}

const _Settings = ({ resetGameState, resetDataState }: Props) => {
    const history = useHistory();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleConfirmRestartGame = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        resetGameState();
        resetDataState();
        history.push('/squadselection');
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Content className="site-layout-content">
            <div className="site-layout-background">
                <div className="page-title">Settings</div>
                <div className="flex-center-item">
                    <Button
                        size="large"
                        className="top-btn-large top-btn-large-left"
                        onClick={handleConfirmRestartGame}
                    >
                        Restart Game
                    </Button>
                    <Modal
                        title="Confirm Restart Game"
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={[
                            <Button key="back" onClick={handleOk}>
                                Yes
                            </Button>,
                            <Button key="submit" type="primary" onClick={handleCancel}>
                                No
                            </Button>,
                        ]}
                    >
                        <p>Are you sure you want to restart the game?</p>
                    </Modal>
                </div>
            </div>
        </Content>
    );
};

export default connect(() => {}, { resetGameState, resetDataState })(_Settings);
