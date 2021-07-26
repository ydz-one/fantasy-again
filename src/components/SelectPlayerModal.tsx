import React, { MouseEventHandler, useState } from 'react';
import { connect } from 'react-redux';
import { Modal, Input } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import PlayerStatsTable from './PlayerStatsTable';
import { PlayerBio, PlayerStatsRow, Position, Squad } from '../types';
import { StoreState } from '../reducers';

interface Props {
    squad: Squad;
    position: Position;
    playerToReplace: string;
    onChangePlayerToAdd: Function;
    onClose: MouseEventHandler;
}

function assertIsString(obj: unknown): asserts obj is string {
    if (typeof obj === 'string') return;
    else throw new Error('Input must be a string');
}

const _SelectPlayerModal = ({ squad, position, playerToReplace, onChangePlayerToAdd, onClose }: Props) => {
    const [searchText, setSearchText] = useState('');
    const isVisible = playerToReplace.length > 0;

    const handleClickPlayer = (player: string) => {
        onChangePlayerToAdd(player);
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
                        suffix={searchText.length && <CloseOutlined onClick={() => setSearchText('')} />}
                    />
                </div>
            }
            visible={isVisible}
            onOk={onClose}
            onCancel={onClose}
            footer={null}
            width={isMobile ? '100vw' : '90vw'}
            className="custom-modal"
        >
            <PlayerStatsTable
                filterFn={filterFn}
                disableFn={disableFn}
                onClickPlayer={handleClickPlayer}
                showPositionFilter={false}
            />
        </Modal>
    );
};

const mapStateToProps = (
    { game }: StoreState,
    ownProps: {
        position: Position;
        playerToReplace: string;
        onChangePlayerToAdd: Function;
        onClose: MouseEventHandler;
    }
) => {
    const { squad } = game;
    const { position, playerToReplace, onChangePlayerToAdd, onClose } = ownProps;
    return {
        squad,
        position,
        playerToReplace,
        onChangePlayerToAdd,
        onClose,
    };
};

export default connect(mapStateToProps)(_SelectPlayerModal);
