import React, { Fragment, MouseEventHandler } from 'react';
import { Card } from 'antd';
import { PositionTag } from './PositionTag';
import { TeamTag } from './TeamTag';

interface Props {
    position: string;
    code: string;
    name: string;
    teamCode: string;
    onClick: MouseEventHandler;
}

export const PlayerCard = ({ position, code, name, teamCode, onClick }: Props) => (
    <Card hoverable className="player-card" onClick={onClick}>
        <div>
            {code === '-1' ? (
                <Fragment>
                    Select a <PositionTag position={position} />
                </Fragment>
            ) : (
                <Fragment>
                    <div>{name}</div>
                    <TeamTag teamCode={teamCode} />
                </Fragment>
            )}
        </div>
    </Card>
);
