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

const _Options = ({ resetGameState, resetDataState }: Props) => {
    const history = useHistory();
    const [isResetGameModalVisible, setIsResetGameModalVisible] = useState(false);
    const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);
    const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);

    const handleConfirmRestartGame = () => {
        setIsResetGameModalVisible(true);
    };

    const handleResetGameOk = () => {
        resetGameState();
        resetDataState();
        setIsResetGameModalVisible(false);
        history.push('/squadselection');
    };

    const handleResetGameCancel = () => {
        setIsResetGameModalVisible(false);
    };

    const handleShowAboutModal = () => {
        setIsAboutModalVisible(true);
    };

    const handleAboutCancel = () => {
        setIsAboutModalVisible(false);
    };

    const handleShowHelpModal = () => {
        setIsHelpModalVisible(true);
    };

    const handleHelpCancel = () => {
        setIsHelpModalVisible(false);
    };

    return (
        <Content className="site-layout-content">
            <div className="site-layout-background">
                <div className="page-title">Options</div>
                <div className="flex-center-item">
                    <div>
                        <Button size="large" className="top-btn-large options-btn" onClick={handleShowHelpModal}>
                            Help
                        </Button>
                        <Button size="large" className="top-btn-large options-btn" onClick={handleShowAboutModal}>
                            About
                        </Button>
                        <Button size="large" className="top-btn-large options-btn" onClick={handleConfirmRestartGame}>
                            Restart Game
                        </Button>
                    </div>
                    <Modal title="Help" visible={isHelpModalVisible} onCancel={handleHelpCancel} footer={[]}>
                        <p>
                            If you have no idea how to play Fantasy Premier League (FPL), don't worry. There are many
                            beginner guides to help you get started. For example,{' '}
                            <a
                                href="https://www.beatingbetting.co.uk/fantasy-premier-league/beginners-guide/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                this great article
                            </a>{' '}
                            is the one that helped me several years ago before my first season.
                        </p>
                        <p>
                            <a
                                href="https://fantasy.premierleague.com/help/rules"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Here
                            </a>{' '}
                            are the official FPL rules for reference.
                        </p>
                        <p>
                            <a href="https://www.reddit.com/r/FantasyPL/" target="_blank" rel="noopener noreferrer">
                                The FPL subreddit
                            </a>{' '}
                            is also a great place to get the latest news and discuss strategies on the current season.
                        </p>
                    </Modal>
                    <Modal
                        title="About This Game"
                        visible={isAboutModalVisible}
                        onCancel={handleAboutCancel}
                        footer={[]}
                    >
                        <p>
                            This is a free and open source game made with TypeScript, React, and Redux. It is intended
                            as a way for FPL players to play out "what if" scenarios and to try out different transfer
                            and chip strategies. It can also be used as a tutorial for beginner FPL players to prepare
                            for the next season.
                        </p>
                        <p>
                            You can find the source code{' '}
                            <a
                                href="https://github.com/ydz-one/fantasy-again"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                here
                            </a>
                            . Please raise an issue in that repo if you find a bug.
                        </p>
                        <p>
                            If you are studying my code to learn programming and have a specific question about it, feel
                            free to reach out to me and I will answer your question if I am available. My contact
                            details are on{' '}
                            <a href="https://ydz.one/" target="_blank" rel="noopener noreferrer">
                                my website
                            </a>
                            .
                        </p>
                        <p>
                            Special thanks to vaastav for providing the data used in this game in his{' '}
                            <a
                                href="https://github.com/vaastav/Fantasy-Premier-League"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                FPL dataset repo
                            </a>
                            .
                        </p>
                    </Modal>
                    <Modal
                        title="Confirm Restart Game"
                        visible={isResetGameModalVisible}
                        onOk={handleResetGameOk}
                        onCancel={handleResetGameCancel}
                        footer={[
                            <Button key="back" onClick={handleResetGameOk}>
                                Yes
                            </Button>,
                            <Button key="submit" type="primary" onClick={handleResetGameCancel}>
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

export default connect(() => {}, { resetGameState, resetDataState })(_Options);
