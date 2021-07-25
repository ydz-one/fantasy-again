import React, { useState } from 'react';
import { Input, Layout } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PlayerDataModal from './PlayerDataModal';
import PlayerStatsTable from './PlayerStatsTable';
import { PlayerBio } from '../types';

const { Content } = Layout;

const Statistics = () => {
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [searchText, setSearchText] = useState('');

    const handleClose = () => {
        setSelectedPlayer('');
    };

    // Use this function to work with the searchbox to search for players by name
    const filterFn = (row: PlayerBio) => {
        const lowerCaseSearchText = searchText.toLowerCase();
        return (
            searchText.length === 0 ||
            row.webName.toLowerCase().includes(lowerCaseSearchText) ||
            row.secondName.toLowerCase().includes(lowerCaseSearchText) ||
            row.firstName.toLowerCase().includes(lowerCaseSearchText)
        );
    };

    return (
        <Content className="site-layout-content">
            <div className="site-layout-background">
                <div className="page-title select-player-modal-title">
                    <div>Statistics</div>
                    <Input
                        placeholder="Search by name"
                        prefix={<SearchOutlined />}
                        className="player-search-input"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
                <PlayerStatsTable filterFn={filterFn} disableFn={() => false} onClickPlayer={setSelectedPlayer} />
                <PlayerDataModal selectedPlayer={selectedPlayer} onClose={handleClose} />
            </div>
        </Content>
    );
};

export default Statistics;
