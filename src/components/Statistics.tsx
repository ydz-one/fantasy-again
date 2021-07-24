import React, { useState } from 'react';
import { Layout } from 'antd';
import PlayerDataModal from './PlayerDataModal';
import PlayerStatsTable from './PlayerStatsTable';

const { Content } = Layout;

const Statistics = () => {
    const [selectedPlayer, setSelectedPlayer] = useState('');
  
    const handleClose = () => {
        setSelectedPlayer('');
    };

    return (
        <Content className='site-layout-content'>
            <div className='site-layout-background'>
                <div className='page-title'>
                    <div>Statistics</div>
                </div>             
                <PlayerStatsTable filterFn={() => true} disableFn={() => false} onClickPlayer={setSelectedPlayer} />
                <PlayerDataModal selectedPlayer={selectedPlayer} onClose={handleClose} />
            </div>
        </Content>
    );
};

export default Statistics;