import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { StoreState } from '../reducers';
import { PlayersBio, Position, Squad } from '../types';
import { PlayerCard } from './PlayerCard';

const { Content } = Layout;
interface Props {
    playersBio: PlayersBio;
    squad: Squad;
}

const renderSquad = (playersBio: PlayersBio, squad: Squad) => {
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
        return <PlayerCard position={position} code={playerCode} name={name} teamCode={teamCode} />
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

const _SquadSelection = ({ playersBio, squad }: Props) => (
    <Content className='site-layout-content'>
        <div className="site-layout-background">
            <div className='page-title page-title-two-sections'>
                Squad Selection
            </div>
            {renderSquad(playersBio, squad)}
        </div>
    </Content>
);

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