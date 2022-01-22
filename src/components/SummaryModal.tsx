import React, { MouseEventHandler } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import { StoreState } from '../reducers';
import { getFirstPlacePoints, getMagnusPoints, getMagnusRank } from '../data';
import { DEFAULT_SEASON } from '../types';

interface Props {
    points: number;
    isModalVisible: boolean;
    onCancel: MouseEventHandler;
}

const getMagnusPointsComparison = (points: number) => {
    const magnusPoints = getMagnusPoints(DEFAULT_SEASON);
    const magnusRank = getMagnusRank(DEFAULT_SEASON);
    if (points > magnusPoints) {
        return (
            <p>
                Wow! You beat{' '}
                <a href="https://en.wikipedia.org/wiki/Magnus_Carlsen" target="_blank" rel="noopener noreferrer">
                    Magnus Carlsen
                </a>{' '}
                (ranked {magnusRank}) by <span className="text-bold">{points - magnusPoints}</span> points! Have you
                considered a career in competitive chess?
            </p>
        );
    }
    if (points === magnusPoints) {
        return (
            <p>
                Cool! You drew with{' '}
                <a href="https://en.wikipedia.org/wiki/Magnus_Carlsen" target="_blank" rel="noopener noreferrer">
                    Magnus Carlsen
                </a>{' '}
                (ranked {magnusRank}), who also had <span className="text-bold">{magnusPoints}</span> points! Have you
                considered a career in competitive chess?
            </p>
        );
    }
    return (
        <p>
            Unfortunately,{' '}
            <a href="https://en.wikipedia.org/wiki/Magnus_Carlsen" target="_blank" rel="noopener noreferrer">
                Magnus Carlsen
            </a>{' '}
            (ranked {magnusRank}) beat you by <span className="text-bold">{magnusPoints - points}</span> points, even
            though you had access to all of the fixture results. Shame on you!
        </p>
    );
};

const getFirstPlacePointsComparison = (points: number) => {
    const firstPlacePoints = getFirstPlacePoints(DEFAULT_SEASON);
    if (points > firstPlacePoints) {
        return (
            <p>
                Very cool! You beat the{' '}
                <a href="https://www.premierleague.com/news/2161356" target="_blank" rel="noopener noreferrer">
                    first place winner
                </a>{' '}
                by <span className="text-bold">{points - firstPlacePoints}</span> points! Now try doing this in real
                FPL.
            </p>
        );
    }
    if (points === firstPlacePoints) {
        return (
            <p>
                Nice! You drew with the{' '}
                <a href="https://www.premierleague.com/news/2161356" target="_blank" rel="noopener noreferrer">
                    first place winner
                </a>
                , who also had <span className="text-bold">{firstPlacePoints}</span> points! Now try doing this in real
                FPL.
            </p>
        );
    }
    return (
        <p>
            You are <span className="text-bold">{firstPlacePoints - points}</span> points away from beating the{' '}
            <a href="https://www.premierleague.com/news/2161356" target="_blank" rel="noopener noreferrer">
                first place winner
            </a>
            ! Why not try again with different transfer/chip strategies?
        </p>
    );
};

const _SummaryModal = ({ points, isModalVisible, onCancel }: Props) => (
    <Modal title="Season Summary" visible={isModalVisible} onCancel={onCancel} footer={[]}>
        <p>
            You finished the {DEFAULT_SEASON} season with <strong>{points}</strong> points!
        </p>
        {getMagnusPointsComparison(points)}
        {getFirstPlacePointsComparison(points)}
    </Modal>
);

const mapStateToProps = ({ game }: StoreState, ownProps: { isModalVisible: boolean; onCancel: MouseEventHandler }) => {
    const { points } = game;
    const { isModalVisible, onCancel } = ownProps;
    return {
        points,
        isModalVisible,
        onCancel,
    };
};

export default connect(mapStateToProps)(_SummaryModal);
