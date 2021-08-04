import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { formatValue } from '../helpers';
import { StoreState } from '../reducers';
import { PlayersBio, PlayersStats, Position, Squad } from '../types';
import { EmptyPlayerCard } from './EmptyPlayerCard';
import { PlayerCard } from './PlayerCard';

interface Props {
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    squad: Squad;
    handleClickPlayer: Function;
    handleSetReplacePlayer: Function;
    showSubs: boolean;
}

const _SquadLineup = ({
    playersBio,
    playersStats,
    squad,
    handleClickPlayer,
    handleSetReplacePlayer,
    showSubs,
}: Props) => {
    const renderPlayerCard = (position: Position) => (idx: number) => {
        const squadPlayer = squad[position][idx];
        if (!squadPlayer) {
            return <EmptyPlayerCard position={position} onClick={() => handleSetReplacePlayer('-1', position)} />;
        }
        const { code } = squadPlayer;
        const { webName, teamCode } = playersBio[code];
        const { value, injured, injury, injuryEnd } = playersStats[code];
        return (
            <PlayerCard
                key={idx}
                position={position}
                name={webName}
                teamCode={teamCode}
                valueOrPoints={formatValue(value)}
                injured={injured}
                injury={injury}
                injuryEnd={injuryEnd}
                hasRedCard={false}
                captainStatus=""
                onClick={() => handleClickPlayer(code)}
            />
        );
    };

    const shouldShowPlayer = (position: Position) => (idx: number) => {
        const squadPlayer = squad[position][idx];
        return !squadPlayer || showSubs || (!squad.subs.includes(squadPlayer.code) && squadPlayer.code !== squad.subGk);
    };

    return (
        <Fragment>
            <div className="position-row position-row-top">
                {[0, 1].filter(shouldShowPlayer(Position.GK)).map(renderPlayerCard(Position.GK))}
            </div>
            <div className="position-row">
                {[0, 1, 2, 3, 4].filter(shouldShowPlayer(Position.DEF)).map(renderPlayerCard(Position.DEF))}
            </div>
            <div className="position-row">
                {[0, 1, 2, 3, 4].filter(shouldShowPlayer(Position.MID)).map(renderPlayerCard(Position.MID))}
            </div>
            <div className="position-row position-row-bottom">
                {[0, 1, 2].filter(shouldShowPlayer(Position.FWD)).map(renderPlayerCard(Position.FWD))}
            </div>
        </Fragment>
    );
};

const mapStateToProps = (
    { data, game }: StoreState,
    ownProps: { handleClickPlayer: Function; handleSetReplacePlayer: Function; showSubs?: boolean }
) => {
    const { playersBio, playersStats } = data;
    const { squad } = game;
    const { handleClickPlayer, handleSetReplacePlayer } = ownProps;
    let showSubs = ownProps.showSubs || false;

    return {
        playersBio,
        playersStats,
        squad,
        handleClickPlayer,
        handleSetReplacePlayer,
        showSubs,
    };
};

export default connect(mapStateToProps)(_SquadLineup);
