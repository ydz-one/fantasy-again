import React, { MouseEventHandler } from 'react';
import { Badge, Card, Tag } from 'antd';
import { PositionTag } from './PositionTag';
import { TeamTag } from './TeamTag';
import { InjurySymbol } from './InjurySymbol';

export interface PlayerCardProps {
    position: string;
    code: string;
    name: string;
    teamCode: string;
    valueOrPoints: string;
    injured: number;
    injury: string;
    injuryEnd: string;
    hasRedCard: boolean;
    captainStatus: string;
    onClick: MouseEventHandler;
}

export const PlayerCard = ({
    position,
    code,
    name,
    teamCode,
    valueOrPoints,
    injured,
    injury,
    injuryEnd,
    hasRedCard,
    captainStatus,
    onClick,
}: PlayerCardProps) => {
    const isEmpty = code === '-1';
    return (
        <Card hoverable className="player-card" onClick={onClick}>
            {isEmpty ? (
                <span>
                    Select a <PositionTag position={position} />
                </span>
            ) : (
                <div className="player-card-content">
                    <div>
                        <div>{name}</div>

                        <div>
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
                        <div className="value-or-points">{valueOrPoints}</div>
                    </Badge>
                </div>
            )}
        </Card>
    );
};
