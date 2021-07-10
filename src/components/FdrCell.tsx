import React from 'react';
import { getTeamNames } from '../data';
import { DEFAULT_SEASON, FdrFixture } from '../types';

interface Props {
    gwFixtures: FdrFixture[]
}

export const FdrCell = ({ gwFixtures }: Props) => {
    const TEAM_NAMES = getTeamNames(DEFAULT_SEASON);

    if (gwFixtures.length === 0) {
        return <div className={'fdr fdr-0'}></div>;
    }
    if (gwFixtures.length === 1) {
        const fixture = gwFixtures[0];
        const cellText = TEAM_NAMES[fixture.opponent] + (fixture.isHome ? ' (H)' : ' (A)');
        return <div className={'fdr fdr-' + fixture.difficulty}>
            {cellText}
        </div>
    }
    const fdrClass = gwFixtures.length === 2 ? 'fdr-double' : 'fdr-triple';
    return <div className='fdr'>
        {gwFixtures.map(fixture => {
            const team = TEAM_NAMES[fixture.opponent];
            const location = fixture.isHome ? '(H)' : '(A)';
            return <div className={fdrClass + ' fdr-sub fdr-' + fixture.difficulty} key={fixture.opponent}>
                {team} <br/> {location}
            </div>
        })}
    </div>
};