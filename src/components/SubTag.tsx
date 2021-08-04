import React from 'react';
import { Tag } from 'antd';

interface Props {
    title: string;
}

export const SubTag = ({ title }: Props) => <Tag color="#b6b6af">{title}</Tag>;
