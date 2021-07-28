import React from 'react';
import moment from 'moment';
import { Tooltip } from 'antd';
import { WarningTwoTone } from '@ant-design/icons';

export interface Props {
    injury: string;
    injuryEnd: string;
}

export const InjurySymbol = ({ injury, injuryEnd }: Props) => (
    <Tooltip placement="topLeft" title={injury + ' until ' + moment(injuryEnd).format('LL')} arrowPointAtCenter>
        <WarningTwoTone twoToneColor="red" />
    </Tooltip>
);
