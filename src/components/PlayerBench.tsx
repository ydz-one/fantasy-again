import React from 'react';
import { connect } from 'react-redux';
import { SUB_PLAYER_TITLES } from '../constants';
import { formatPoints, formatValue, getNextFixtures, didPlayerGetRedCard } from '../helpers';
import { StoreState } from '../reducers';
import { FdrData, PlayersBio, PlayersStats, Squad, ValueType } from '../types';
import { PlayerCard } from './PlayerCard';

interface Props {
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    fdr: FdrData;
    squad: Squad;
    gameweek: number;
    handleClickPlayer: Function;
    valueType: ValueType;
}

const _PlayerBench = ({ playersBio, playersStats, fdr, squad, gameweek, handleClickPlayer, valueType }: Props) => {
    return (
        <div className="position-row player-bench-row">
            {[squad.subGk, ...squad.subs].map((playerCode, idx) => {
                const { webName, teamCode, position } = playersBio[playerCode];
                const { value, injured, injury, injuryEnd, latestGwPoints, fixtureStats } = playersStats[playerCode];
                const hasRedCard = didPlayerGetRedCard(fixtureStats, gameweek.toString());
                const valueToShow =
                    valueType === ValueType.FIXTURE
                        ? getNextFixtures(fdr, gameweek, teamCode)
                        : valueType === ValueType.POINTS
                        ? formatPoints(latestGwPoints)
                        : formatValue(value);
                return (
                    <div key={idx}>
                        <PlayerCard
                            position={position}
                            name={webName}
                            teamCode={teamCode}
                            value={valueToShow}
                            injured={injured}
                            injury={injury}
                            injuryEnd={injuryEnd}
                            hasRedCard={hasRedCard}
                            captainStatus=""
                            subStatus={SUB_PLAYER_TITLES[idx]}
                            onClick={() => handleClickPlayer(playerCode)}
                        />
                    </div>
                );
            })}
        </div>
    );
};

const mapStateToProps = (
    { data, game }: StoreState,
    ownProps: { handleClickPlayer: Function; valueType: ValueType }
) => {
    const { playersBio, playersStats, fdr } = data;
    const { squad, gameweek } = game;
    const { handleClickPlayer, valueType } = ownProps;

    return {
        playersBio,
        playersStats,
        fdr,
        squad,
        gameweek,
        handleClickPlayer,
        valueType,
    };
};

export default connect(mapStateToProps)(_PlayerBench);
