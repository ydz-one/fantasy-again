import React, { MouseEventHandler } from 'react';
import { Card } from 'antd';
import { PositionTag } from './PositionTag';

interface Props {
    position: string;
    onClick: MouseEventHandler;
}

export const EmptyPlayerCard = ({ position, onClick }: Props) => (
    <Card hoverable className="player-card" onClick={onClick}>
        <span>
            Select a <PositionTag position={position} />
        </span>
    </Card>
);
