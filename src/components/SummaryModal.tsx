import React, { MouseEvent as ReactMouseEvent, MouseEventHandler } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Modal, Button, notification } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { StoreState } from '../reducers';
import { getFirstPlacePoints, getMagnusPoints, getMagnusRank, getPreGwDates } from '../data';
import { resetGameState, resetDataState } from '../actions';
import { Chip, ChipHistory, DEFAULT_SEASON, InGameTransfer, PlayersBio, Position, SquadPoints } from '../types';
import { CHIP_LABELS } from '../constants';

interface Props {
    playersBio: PlayersBio;
    points: number;
    squadPointsHistory: SquadPoints[];
    gwPointsHistory: number[];
    transfersHistory: InGameTransfer[][];
    deductionsHistory: number[];
    chipHistory: ChipHistory;
    isModalVisible: boolean;
    onCancel: MouseEventHandler;
    resetGameState: typeof resetGameState;
    resetDataState: typeof resetDataState;
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
            (ranked {magnusRank}) beat you by <span className="text-bold">{magnusPoints - points}</span> points even
            though you had access to all of the fixture results, you donkey!
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

const printSquad = (squadPoints: SquadPoints, playersBio: PlayersBio) => {
    let results = [Position.GK, Position.DEF, Position.MID, Position.FWD].reduce((acc, position) => {
        acc = acc.concat(
            squadPoints[position]
                .map(
                    ({ code, captainStatus }) =>
                        playersBio[code].webName + (captainStatus.length > 0 ? `(${captainStatus})` : '')
                )
                .join(', ')
        );
        return acc.concat(', ');
    }, 'Starters: ');
    results = results.slice(0, results.length - 2);
    return results.concat('. ');
};

const printTransfers = (transfersHistory: InGameTransfer[], playersBio: PlayersBio) => {
    if (transfersHistory.length === 0) {
        return '';
    }
    let result = transfersHistory.reduce((transfers, { playerToSell, playerToBuy }) => {
        transfers = transfers.concat(
            `${playersBio[playerToSell.code].webName} → ${playersBio[playerToBuy.code].webName}, `
        );
        return transfers;
    }, 'Transfers: ');
    return result.slice(0, result.length - 2).concat('. ');
};

const printSubs = (squadPoints: SquadPoints, playersBio: PlayersBio) => {
    let results = 'Subs: ';
    results = results.concat(`${playersBio[squadPoints.subGk.code].webName}, `);
    results = results.concat(squadPoints.subs.map(({ code }) => playersBio[code].webName).join(', '));
    return results.concat('. ');
};

const printSummary = (points: number) =>
    `Final points: ${points}. Beat Magnus Carlsen? ${
        points > getMagnusPoints(DEFAULT_SEASON) ? 'Yes' : 'No'
    }. Beat first place? ${points > getFirstPlacePoints(DEFAULT_SEASON) ? 'Yes\n' : 'No\n'}`;

const _SummaryModal = ({
    playersBio,
    points,
    isModalVisible,
    squadPointsHistory,
    gwPointsHistory,
    transfersHistory,
    deductionsHistory,
    chipHistory,
    onCancel,
    resetGameState,
    resetDataState,
}: Props) => {
    const history = useHistory();

    const getSeasonResults = () => {
        let results = squadPointsHistory.reduce((acc, squadPoints, idx) => {
            acc = acc.concat(`${idx + 1}. `);
            acc = acc.concat(printSquad(squadPointsHistory[idx], playersBio));
            acc = acc.concat(printSubs(squadPointsHistory[idx], playersBio));
            if (idx > 0 && chipHistory[idx] !== Chip.FREE_HIT && chipHistory[idx] !== Chip.WILD_CARD) {
                acc = acc.concat(printTransfers(transfersHistory[idx], playersBio));
            }
            if (chipHistory[idx + 1] != null) {
                acc = acc.concat(`Chip: ${CHIP_LABELS[chipHistory[idx + 1]]}. `);
            }
            acc = acc.concat(
                `Points: ${gwPointsHistory[idx]}` +
                    (deductionsHistory[idx] !== 0 ? `(${deductionsHistory[idx]})\n` : '\n')
            );
            return acc;
        }, '');
        return results.concat(printSummary(points));
    };

    const handleOpenNotification = () => {
        notification.open({
            message: 'Season results copied to clipboard!',
        });
    };

    const handleRestartGame = (event: ReactMouseEvent<Element, MouseEvent>) => {
        resetGameState();
        resetDataState();
        onCancel(event);
        history.push('/squadselection');
    };

    return (
        <Modal
            title="Season Summary"
            visible={isModalVisible}
            onCancel={onCancel}
            footer={[
                <CopyToClipboard text={getSeasonResults()} onCopy={handleOpenNotification}>
                    <Button type="primary">Share Results</Button>
                </CopyToClipboard>,
                <Button onClick={handleRestartGame} type="primary">
                    Restart Game
                </Button>,
            ]}
        >
            <p>
                You finished the {DEFAULT_SEASON} season with <strong>{points}</strong> points!
            </p>
            {getMagnusPointsComparison(points)}
            {getFirstPlacePointsComparison(points)}
        </Modal>
    );
};

const mapStateToProps = (
    { data, game }: StoreState,
    ownProps: {
        isModalVisible: boolean;
        onCancel: MouseEventHandler;
    }
) => {
    const { playersBio } = data;
    const { points, squadPointsHistory, gwPointsHistory, transfersHistory, deductionsHistory, chipHistory } = game;
    const { isModalVisible, onCancel } = ownProps;
    return {
        playersBio,
        points,
        squadPointsHistory,
        gwPointsHistory,
        transfersHistory,
        deductionsHistory,
        chipHistory,
        isModalVisible,
        onCancel,
    };
};

export default connect(mapStateToProps, { resetGameState, resetDataState })(_SummaryModal);
