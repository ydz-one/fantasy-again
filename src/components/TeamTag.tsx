import React from 'react';
import { Tag } from 'antd';
import { TEAMS } from '../data/teams';

interface Props {
    team_code: string;
}

export const TeamTag = ({ team_code }: Props) => (
    <Tag color={TEAMS[team_code].color}>
        {TEAMS[team_code].name}
    </Tag>
);