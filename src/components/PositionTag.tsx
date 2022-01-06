import React from 'react';
import { Tag } from 'antd';
import { positionData } from '../types';

interface Props {
    position: string;
    useFullName?: boolean;
}

export const PositionTag = ({ position, useFullName = false }: Props) => (
    <Tag color={positionData[position].color} className={positionData[position].isDarkFont ? 'dark-font' : ''}>
        {useFullName ? positionData[position].name : position}
    </Tag>
);
