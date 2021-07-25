import React from 'react';
import { Tag } from 'antd';
import { TEAMS } from '../data/teams';

interface Props {
    teamCode: string;
}

export const TeamTag = ({ teamCode }: Props) => <Tag color={TEAMS[teamCode].color}>{TEAMS[teamCode].name}</Tag>;
