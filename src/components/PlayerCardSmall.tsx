import React from 'react';
import { Card } from 'antd';
import { PositionTag } from './PositionTag';
import { TeamTag } from './TeamTag';

export interface Props {
    position: string;
    name: string;
    teamCode: string;
    isTarget: boolean;
}

export const PlayerCardSmall = ({ position, name, teamCode, isTarget }: Props) => {
    return (
        <Card className={'player-card player-card-small' + (isTarget ? ' card-pair-right' : ' card-pair-left')}>
            <div className="player-card-content">
                <div>
                    <div>{name}</div>
                    <div>
                        <PositionTag position={position} />
                        <TeamTag teamCode={teamCode} />
                    </div>
                </div>
                <div style={{ color: isTarget ? '#3f8600' : '#cf1322' }}>
                    <strong>{isTarget ? 'IN' : 'OUT'}</strong>
                </div>
            </div>
        </Card>
    );
};
