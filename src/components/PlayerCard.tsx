import React, { Fragment } from 'react';
import { Card } from 'antd';
import { PositionTag } from './PositionTag';
import { TeamTag } from './TeamTag';

interface Props {
    position: string;
    code: string;
    name: string;
    team_code: string;
}

export const PlayerCard = ({ position, code, name, team_code }: Props) => (
    <Card hoverable className='player-card'>
        <div>
            {code === '-1'
                ? <Fragment>Select a <PositionTag position={position} /></Fragment> 
                : <Fragment><div>{name}</div><TeamTag team_code={team_code} /></Fragment>
            }
        </div>
    </Card>
);