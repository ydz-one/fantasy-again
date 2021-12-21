import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { StoreState } from '../reducers';
import { SquadPlayerPoints, SquadPoints } from '../types';
import { PlayerCard } from './PlayerCard';

interface Props {
    squadPointsHistory: SquadPoints[];
    gameweek: number;
    handleClickPlayer: Function;
}

const _SquadPointsLineup = ({ squadPointsHistory, gameweek, handleClickPlayer }: Props) => {
    const renderPlayerCard = (squadPlayerPoints: SquadPlayerPoints, idx: number) => {
        const { code, position, name, teamCode, value, injured, injury, injuryEnd, hasRedCard, captainStatus } =
            squadPlayerPoints;
        return (
            <PlayerCard
                key={idx}
                position={position}
                name={name}
                teamCode={teamCode}
                value={value}
                injured={injured}
                injury={injury}
                injuryEnd={injuryEnd}
                hasRedCard={hasRedCard}
                captainStatus={captainStatus}
                subStatus=""
                onClick={() => handleClickPlayer(code)}
            />
        );
    };
    const { GK, DEF, MID, FWD } = squadPointsHistory[gameweek - 1];
    return (
        <Fragment>
            <div className="position-row position-row-top">{GK.map(renderPlayerCard)}</div>
            <div className="position-row">{DEF.map(renderPlayerCard)}</div>
            <div className="position-row">{MID.map(renderPlayerCard)}</div>
            <div className="position-row position-row-bottom">{FWD.map(renderPlayerCard)}</div>
        </Fragment>
    );
};

const mapStateToProps = (
    { game }: StoreState,
    ownProps: {
        gameweek: number;
        handleClickPlayer: Function;
    }
) => {
    const { squadPointsHistory } = game;
    const { gameweek, handleClickPlayer } = ownProps;
    return {
        squadPointsHistory,
        gameweek,
        handleClickPlayer,
    };
};

export default connect(mapStateToProps)(_SquadPointsLineup);
