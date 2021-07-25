import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Modal, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import PlayerDataModal from './PlayerDataModal';
import PlayerStatsTable from './PlayerStatsTable';
import { PlayerBio, PlayerStatsRow, Position, Squad } from '../types';
import { StoreState } from '../reducers';

interface Props {
    squad: Squad;
    playerToReplace: string;
    position: Position;
    onClose: MouseEventHandler;
}

function assertIsString(obj: unknown): asserts obj is string {
    if (typeof obj === 'string') return;
    else throw new Error('Input must be a string');
}

const _SelectPlayerModal = ({ squad, playerToReplace, position, onClose }: Props) => {
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [searchText, setSearchText] = useState('');
    const isVisible = playerToReplace.length > 0;

    const handleClosePlayerModal = () => {
        setSelectedPlayer('');
    };

    // Use this function to only display rows of players in the position we're drafting for
    // and to work with the searchbox to search for players by name
    const filterFn = (row: PlayerBio) => {
        const lowerCaseSearchText = searchText.toLowerCase();
        return (
            row.position === position &&
            (searchText.length === 0 ||
                row.webName.toLowerCase().includes(lowerCaseSearchText) ||
                row.secondName.toLowerCase().includes(lowerCaseSearchText) ||
                row.firstName.toLowerCase().includes(lowerCaseSearchText))
        );
    };

    // Disable rows of players already in the squad
    const disableFn = (row: PlayerStatsRow) => {
        assertIsString(row.code);
        return squad[position].includes(row.code);
    };

    // Reset searchbox when user closes this modal
    if (!isVisible && searchText.length > 0) {
        setSearchText('');
    }

    return (
        <Modal
            title={
                <div className="select-player-modal-title">
                    <div>Player Selection</div>
                    <Input
                        placeholder="Search by name"
                        prefix={<SearchOutlined />}
                        className="player-search-input player-search-input-modal"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            }
            visible={isVisible}
            onOk={onClose}
            onCancel={onClose}
            footer={[]}
            width={isMobile ? '100vw' : '80vw'}
            className="custom-modal"
        >
            <PlayerStatsTable filterFn={filterFn} disableFn={disableFn} onClickPlayer={setSelectedPlayer} />
            <PlayerDataModal selectedPlayer={selectedPlayer} onClose={handleClosePlayerModal} />
        </Modal>
    );
};

const mapStateToProps = (
    { game }: StoreState,
    ownProps: { playerToReplace: string; position: Position; onClose: MouseEventHandler }
) => {
    const { squad } = game;
    const { playerToReplace, position, onClose } = ownProps;
    return {
        squad,
        playerToReplace,
        position,
        onClose,
    };
};

export default connect(mapStateToProps)(_SelectPlayerModal);
