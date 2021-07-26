import React, { Fragment, MouseEventHandler } from 'react';
import { Card } from 'antd';
import { PositionTag } from './PositionTag';
import { TeamTag } from './TeamTag';

interface Props {
    position: string;
    code: string;
    name: string;
    teamCode: string;
    valueOrPoints: string;
    onClick: MouseEventHandler;
}

export const PlayerCard = ({ position, code, name, teamCode, valueOrPoints, onClick }: Props) => {
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
                        </div>
                    </div>
                    <div className="value-or-points">{valueOrPoints}</div>
                </div>
            )}
        </Card>
    );
};
