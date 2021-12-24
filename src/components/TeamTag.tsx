import React from 'react';
import { Tag } from 'antd';
import { TEAMS } from '../constants';

interface Props {
    teamCode: string;
    noMargin?: boolean;
}

export const TeamTag = ({ teamCode, noMargin = false }: Props) => (
    <Tag className={noMargin ? 'team-tag no-margin' : 'team-tag'} color={TEAMS[teamCode].color}>
        {TEAMS[teamCode].name}
    </Tag>
);
