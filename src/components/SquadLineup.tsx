import { valueType } from 'antd/lib/statistic/utils';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { formatPoints, formatValue, getNextFixtures } from '../helpers';
import { StoreState } from '../reducers';
import { FdrData, PlayersBio, PlayersStats, Position, Squad, ValueType } from '../types';
import { EmptyPlayerCard } from './EmptyPlayerCard';
import { PlayerCard } from './PlayerCard';

interface Props {
    fdr: FdrData;
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    squad: Squad;
    gameweek: number;
    handleClickPlayer: Function;
    handleSetReplacePlayer: Function;
    valueType: valueType;
    showSubs: boolean;
    showCap: boolean;
}

const _SquadLineup = ({
    fdr,
    playersBio,
    playersStats,
    squad,
    gameweek,
    handleClickPlayer,
    handleSetReplacePlayer,
    valueType,
    showSubs,
    showCap,
}: Props) => {
    const renderPlayerCard = (position: Position) => (idx: number) => {
        const squadPlayer = squad[position][idx];
        if (!squadPlayer) {
            return <EmptyPlayerCard position={position} onClick={() => handleSetReplacePlayer('-1', position)} />;
        }
        const { code } = squadPlayer;
        const { webName, teamCode } = playersBio[code];
        const { value, injured, injury, injuryEnd, latestGwPoints } = playersStats[code];
        const valueToShow =
            valueType === ValueType.FIXTURE
                ? getNextFixtures(fdr, gameweek, teamCode)
                : valueType === ValueType.POINTS
                ? formatPoints(latestGwPoints)
                : formatValue(value);
        return (
            <PlayerCard
                key={idx}
                position={position}
                name={webName}
                teamCode={teamCode}
                value={valueToShow}
                injured={injured}
                injury={injury}
                injuryEnd={injuryEnd}
                hasRedCard={false}
                captainStatus={!showCap ? '' : squad.captain === code ? 'C' : squad.viceCaptain === code ? 'VC' : ''}
                subStatus=""
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
    ownProps: {
        handleClickPlayer: Function;
        handleSetReplacePlayer: Function;
        valueType: ValueType;
        showSubs?: boolean;
        showCap?: boolean;
    }
) => {
    const { fdr, playersBio, playersStats } = data;
    const { squad, gameweek } = game;
    const { handleClickPlayer, handleSetReplacePlayer, valueType, showSubs = false, showCap = false } = ownProps;

    return {
        fdr,
        playersBio,
        playersStats,
        squad,
        gameweek,
        handleClickPlayer,
        handleSetReplacePlayer,
        valueType,
        showSubs,
        showCap,
    };
};

export default connect(mapStateToProps)(_SquadLineup);
