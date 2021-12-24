import React from 'react';
import { connect } from 'react-redux';
import { StoreState } from '../reducers';
import { FdrData } from '../types';

interface Props {
    fdr: FdrData;
    teamCode: string;
}

const _FutureFixtures = ({ fdr, teamCode }: Props) => <div></div>;

const mapStateToProps = ({ data }: StoreState, ownProps: { teamCode: string }) => {
    const { fdr } = data;
    const { teamCode } = ownProps;
    return {
        fdr,
        teamCode,
    };
};

export default connect(mapStateToProps)(_FutureFixtures);
