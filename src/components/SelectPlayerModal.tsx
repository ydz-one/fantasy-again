import React, { MouseEventHandler, useState } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import { isMobile } from 'react-device-detect';
import PlayerDataModal from './PlayerDataModal';
import PlayerStatsTable from './PlayerStatsTable';
import { PlayerBio, PlayerStatsRow, Position, Squad } from '../types';
import { StoreState } from '../reducers';

interface Props {
    squad: Squad
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
  
    const handleClosePlayerModal = () => {
        setSelectedPlayer('');
    };

    // Only display rows of players in the position we're drafting for
    const filterFn = (row: PlayerBio) => row.position === position;

    // Disable rows of players already in the squad
    const disableFn = (row: PlayerStatsRow) => {
        assertIsString(row.code);
        return squad[position].includes(row.code);
    };

    return (
        <Modal title='Player Selection' visible={playerToReplace.length > 0} onOk={onClose} onCancel={onClose} footer={[]} width={isMobile ? '100vw' : '80vw'} className='custom-modal'>           
            <PlayerStatsTable filterFn={filterFn} disableFn={disableFn} onClickPlayer={setSelectedPlayer} />
            <PlayerDataModal selectedPlayer={selectedPlayer} onClose={handleClosePlayerModal} />
        </Modal>
    );
};

const mapStateToProps = ({
    game
}: StoreState, ownProps: { playerToReplace: string, position: Position, onClose: MouseEventHandler }) => {
    const { squad } = game;
    const { playerToReplace, position, onClose } = ownProps;
    return {
        squad,
        playerToReplace,
        position,
        onClose
    };
}

export default connect(mapStateToProps)(_SelectPlayerModal);