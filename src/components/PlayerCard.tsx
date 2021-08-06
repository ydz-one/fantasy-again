import React, { Fragment, MouseEventHandler } from 'react';
import { Badge, Card, Tag } from 'antd';
import { PositionTag } from './PositionTag';
import { TeamTag } from './TeamTag';
import { InjurySymbol } from './InjurySymbol';
import { SubTag } from './SubTag';
import { DEFAULT_SEASON, FdrFixture } from '../types';
import { getTeamNames } from '../data';

export interface PlayerCardProps {
    position: string;
    name: string;
    teamCode: string;
    value: string | FdrFixture[];
    injured: number;
    injury: string;
    injuryEnd: string;
    hasRedCard: boolean;
    captainStatus: string;
    subStatus: string;
    onClick: MouseEventHandler;
}

const renderNextFixtures = (fixtures: FdrFixture[]) => {
    const TEAM_NAMES = getTeamNames(DEFAULT_SEASON);
    if (fixtures.length === 0) {
        return '';
    }
    if (fixtures.length === 1) {
        const fixture = fixtures[0];
        return TEAM_NAMES[fixture.opponent] + (fixture.isHome ? ' (H)' : ' (A)');
    }
    return (
        <Fragment>
            {fixtures.map((fixture) => {
                return (
                    <div key={fixture.opponent}>
                        {TEAM_NAMES[fixture.opponent] + (fixture.isHome ? ' (H)' : ' (A)')}
                    </div>
                );
            })}
        </Fragment>
    );
};

export const PlayerCard = ({
    position,
    name,
    teamCode,
    value,
    injured,
    injury,
    injuryEnd,
    hasRedCard,
    captainStatus,
    subStatus,
    onClick,
}: PlayerCardProps) => (
    <Card hoverable className="player-card" onClick={onClick}>
        <div className="player-card-content">
            <div>
                <div>{name}</div>
                <div>
                    {subStatus.length > 0 && <SubTag title={subStatus} />}
                    <PositionTag position={position} />
                    <TeamTag teamCode={teamCode} />
                    {hasRedCard && (
                        <Tag color={'#ff0000'} className="red-card">
                            .
                        </Tag>
                    )}
                    {injured === 1 && <InjurySymbol injury={injury} injuryEnd={injuryEnd} />}
                </div>
            </div>
            <Badge
                count={captainStatus}
                className="cap-armband"
                style={{ backgroundColor: 'black', top: -16, right: -8 }}
            >
                {typeof value === 'string' ? (
                    <div className="value-or-points">{value}</div>
                ) : (
                    <div className="next-fixtures">{renderNextFixtures(value)}</div>
                )}
            </Badge>
        </div>
    </Card>
);
