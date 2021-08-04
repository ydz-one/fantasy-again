import React from 'react';
import { connect } from 'react-redux';
import { formatValue } from '../helpers';
import { StoreState } from '../reducers';
import { PlayersBio, PlayersStats, Squad } from '../types';
import { PlayerCard } from './PlayerCard';

interface Props {
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    squad: Squad;
    handleClickPlayer: Function;
    handleSetReplacePlayer: Function;
}

const _PlayerBench = ({ playersBio, playersStats, squad, handleClickPlayer, handleSetReplacePlayer }: Props) => {
    const titles = ['SGK', 'S1', 'S2', 'S3'];
    return (
        <div className="position-row player-bench-row">
            {[squad.subGk, ...squad.subs].map((playerCode, idx) => {
                const { webName, teamCode, position } = playersBio[playerCode];
                const { value, injured, injury, injuryEnd } = playersStats[playerCode];
                return (
                    <div key={idx}>
                        <PlayerCard
                            position={position}
                            name={webName}
                            teamCode={teamCode}
                            valueOrPoints={formatValue(value)}
                            injured={injured}
                            injury={injury}
                            injuryEnd={injuryEnd}
                            hasRedCard={false}
                            captainStatus=""
                            subStatus={titles[idx]}
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
    ownProps: { handleClickPlayer: Function; handleSetReplacePlayer: Function }
) => {
    const { playersBio, playersStats } = data;
    const { squad } = game;
    const { handleClickPlayer, handleSetReplacePlayer } = ownProps;

    return {
        playersBio,
        playersStats,
        squad,
        handleClickPlayer,
        handleSetReplacePlayer,
    };
};

export default connect(mapStateToProps)(_PlayerBench);
