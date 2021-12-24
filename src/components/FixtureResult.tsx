import React from 'react';
import { DEFAULT_SEASON, Fixture } from '../types';
import { getTeamIdToCode } from '../data';
import { TeamTag } from './TeamTag';

const TEAM_ID_TO_CODE = getTeamIdToCode(DEFAULT_SEASON);

export interface Props {
    fixtureData: Fixture;
}

export const FixtureResult = ({ fixtureData }: Props) => (
    <div>
        <TeamTag teamCode={TEAM_ID_TO_CODE[fixtureData.teamH - 1]} noMargin />
        <span className="fixture-score">{`${fixtureData.teamHScore} - ${fixtureData.teamAScore}`}</span>
        <TeamTag teamCode={TEAM_ID_TO_CODE[fixtureData.teamA - 1]} noMargin />
    </div>
);
