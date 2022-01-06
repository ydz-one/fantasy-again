import React from 'react';
import { Tag } from 'antd';
import { TEAMS } from '../constants';

interface Props {
    teamCode: string;
    noMargin?: boolean;
    useFullName?: boolean;
}

const getClassName = (noMargin: boolean, useFullName: boolean) => {
    let className = 'team-tag';
    if (noMargin) {
        className += ' no-margin';
    }
    if (useFullName) {
        className += ' team-tag-fullname';
    }
    return className;
};

export const TeamTag = ({ teamCode, noMargin = false, useFullName = false }: Props) => (
    <Tag className={getClassName(noMargin, useFullName)} color={TEAMS[teamCode].color}>
        {useFullName ? TEAMS[teamCode].fullName : TEAMS[teamCode].name}
    </Tag>
);
