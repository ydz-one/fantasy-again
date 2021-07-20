import React from 'react';
import { Tag } from 'antd';
import { positionData } from '../types';

interface Props {
    position: string;
}

export const PositionTag = ({ position }: Props) => (
    <Tag color={positionData[position].color} className={positionData[position].isDarkFont ? 'dark-font' : ''}>
        {position}
    </Tag>
);