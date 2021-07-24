import React, { Fragment, MouseEventHandler, useState } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { StoreState } from '../reducers';
import { PlayersBio, Position, positions, Squad } from '../types';
import { PlayerCard } from './PlayerCard';
import SelectPlayerModal from './SelectPlayerModal';

const { Content } = Layout;
interface Props {
    playersBio: PlayersBio;
    squad: Squad;
}

const renderSquad = (playersBio: PlayersBio, squad: Squad, handleClickPlayer: Function) => {
    const renderPlayerCard = (position: Position) => (idx: number) =>{
        const code = squad[position][idx];
        let name = '';
        let teamCode = '';
        let playerCode = '-1';
        if (code) {
            playerCode = code;
            name = playersBio[code].webName;
            teamCode = playersBio[code].teamCode;
        }
        return (
            <PlayerCard
                key={idx}
                position={position}
                code={playerCode}
                name={name}
                teamCode={teamCode}
                onClick={() => handleClickPlayer(playerCode, position)}
            />
        );
    };
    
    return (
        <Fragment>
            <div className='position-row'>
                {[0, 1].map(renderPlayerCard(Position.GK))}
            </div>
            <div className='position-row'>
                {[0, 1, 2, 3, 4].map(renderPlayerCard(Position.DEF))}
            </div>
            <div className='position-row'>
                {[0, 1, 2, 3, 4].map(renderPlayerCard(Position.MID))}
            </div>
            <div className='position-row'>
                {[0, 1, 2].map(renderPlayerCard(Position.FWD))}
            </div>
        </Fragment>
    );
};

const _SquadSelection = ({ playersBio, squad }: Props) => {
    const [replacementInfo, setReplacementInfo] = useState({ playerToReplace: '', position: Position.GK });
    const { playerToReplace, position } = replacementInfo;

    const handleClickPlayer = (playerToReplace: string, position: Position) => {
        setReplacementInfo({
            playerToReplace,
            position
        });
    };

    const handleClosePlayerModal = () => {
        setReplacementInfo({
            playerToReplace: '',
            position: Position.GK
        });
    }

    return (
        <Content className='site-layout-content'>
            <div className="site-layout-background">
                <div className='page-title page-title-two-sections'>
                    Squad Selection
                </div>
                {renderSquad(playersBio, squad, handleClickPlayer)}
                <SelectPlayerModal playerToReplace={playerToReplace} position={position} onClose={handleClosePlayerModal} />
            </div>
        </Content>
    );
};

const mapStateToProps = ({
    data,
    game
}: StoreState) => {
    const { playersBio } = data;
    const { squad } = game;
    return {
        playersBio,
        squad
    };
}

export default connect(mapStateToProps)(_SquadSelection);