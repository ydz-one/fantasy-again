import React from 'react';
import { connect } from 'react-redux';
import { SUB_PLAYER_TITLES } from '../constants';
import { StoreState } from '../reducers';
import { SquadPoints } from '../types';
import { PlayerCard } from './PlayerCard';

interface Props {
    squadPointsHistory: SquadPoints[];
    gameweek: number;
    handleClickPlayer: Function;
}

const _PlayerPointsBench = ({ squadPointsHistory, gameweek, handleClickPlayer }: Props) => {
    const squadPoints = squadPointsHistory[gameweek - 1];
    return (
        <div className="position-row player-bench-row">
            {[squadPoints.subGk, ...squadPoints.subs].map((squadPlayerPoints, idx) => {
                const { code, position, name, teamCode, value, injured, injury, injuryEnd, hasRedCard, captainStatus } =
                    squadPlayerPoints;
                return (
                    <div key={idx}>
                        <PlayerCard
                            position={position}
                            name={name}
                            teamCode={teamCode}
                            value={value}
                            injured={injured}
                            injury={injury}
                            injuryEnd={injuryEnd}
                            hasRedCard={hasRedCard}
                            captainStatus={captainStatus}
                            subStatus={SUB_PLAYER_TITLES[idx]}
                            onClick={() => handleClickPlayer(code)}
                        />
                    </div>
                );
            })}
        </div>
    );
};

const mapStateToProps = ({ game }: StoreState, ownProps: { gameweek: number; handleClickPlayer: Function }) => {
    const { squadPointsHistory } = game;
    const { gameweek, handleClickPlayer } = ownProps;
    return {
        squadPointsHistory,
        gameweek,
        handleClickPlayer,
    };
};

export default connect(mapStateToProps)(_PlayerPointsBench);
