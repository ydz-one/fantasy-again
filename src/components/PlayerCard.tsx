import React, { MouseEventHandler } from 'react';
import { Badge, Card, Tag } from 'antd';
import { PositionTag } from './PositionTag';
import { TeamTag } from './TeamTag';
import { InjurySymbol } from './InjurySymbol';
import { SubTag } from './SubTag';

export interface PlayerCardProps {
    position: string;
    name: string;
    teamCode: string;
    valueOrPoints: string;
    injured: number;
    injury: string;
    injuryEnd: string;
    hasRedCard: boolean;
    captainStatus: string;
    subStatus: string;
    onClick: MouseEventHandler;
}

export const PlayerCard = ({
    position,
    name,
    teamCode,
    valueOrPoints,
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
                <div className="value-or-points">{valueOrPoints}</div>
            </Badge>
        </div>
    </Card>
);
