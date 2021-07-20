import React from 'react';
import { Card } from 'antd';
import { PositionTag } from './PositionTag';

interface Props {
    position: string;
}

export const EmptyPlayerCard = ({ position }: Props) => (
    <Card hoverable className='player-card'>
        <div>
            Select a <PositionTag position={position} />
        </div>
    </Card>
)