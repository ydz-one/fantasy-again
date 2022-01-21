import React from 'react';
import { Statistic } from 'antd';
import { statisticsFontSize } from '../constants';

interface Props {
    tempFreeTransfers: number;
    tempCost: number;
    tempBalance: number;
}

export const TransferMetrics = ({ tempFreeTransfers, tempCost, tempBalance }: Props) => (
    <div className="transfers-metrics">
        <Statistic
            title="FT"
            value={tempFreeTransfers === Number.MAX_SAFE_INTEGER ? '∞' : tempFreeTransfers}
            valueStyle={{
                ...statisticsFontSize,
                color: tempFreeTransfers > 0 ? '#3f8600' : '#cf1322',
            }}
            className="top-metric"
        />
        <Statistic
            title="Cost"
            value={tempCost}
            valueStyle={{ ...statisticsFontSize, color: tempCost === 0 ? '#3f8600' : '#cf1322' }}
            className="top-metric"
        />
        <Statistic
            title="Bank (£)"
            value={tempBalance / 10}
            valueStyle={{ ...statisticsFontSize, color: tempBalance >= 0 ? '#3f8600' : '#cf1322' }}
            precision={1}
            className="top-metric"
        />
    </div>
);
