import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Divider, Layout, Row, Col, Modal } from 'antd';
import { checkSquadCompleteHOC } from './checkSquadCompleteHOC';
import SquadLineup from './SquadLineup';
import PlayerDetailsModal from './PlayerDetailsModal';
import SelectPlayerModal from './SelectPlayerModal';
import { ConfirmTransfersModal } from './ConfirmTransfersModal';
import { Chip, ChipCount, InGameTransfer, PlayersBio, PlayersStats, Position, Squad, ValueType } from '../types';
import { finalizeTransfers, activateChip } from '../actions';
import { TeamTag } from './TeamTag';
import { assertIsPosition, getPlayerSellPrice, getTeamsOverMaxPlayerLimit, getTempBalance } from '../helpers';
import { StoreState } from '../reducers';
import { TransferMetrics } from './TransferMetrics';
import { checkSeasonEndHOC } from './checkSeasonEndHOC';

const { Content } = Layout;

interface Props {
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    gameweek: number;
    squad: Squad;
    balance: number;
    isSquadComplete: boolean;
    isSeasonEnd: boolean;
    freeTransfers: number;
    nextGwCost: number;
    activeChip: Chip | null;
    chipCount: ChipCount;
    finalizeTransfers: typeof finalizeTransfers;
    activateChip: typeof activateChip;
}

const warnCannotDeactiveChip = () => {
    Modal.warning({
        title: 'Cannot Deactivate Chip',
        content: 'After activation, Free Hit and Wild Card chips cannot be deactivated.',
    });
};

const _Transfers = ({
    playersBio,
    playersStats,
    gameweek,
    squad,
    balance,
    freeTransfers,
    nextGwCost,
    activeChip,
    chipCount,
    finalizeTransfers,
    activateChip,
}: Props) => {
    const [replacementInfo, setReplacementInfo] = useState({
        position: Position.GK,
        playerToReplace: '',
    });
    // playerClicked is the non-empty player card clicked in the Transfers page; when set, it opens up a player data modal with a button to set that player to be replaced
    const [playerClicked, setPlayerClicked] = useState('');
    // playerToAdd is the player selected from the Player Stats Table; when set, it opens up a player data modal with a button to confirm transfer in
    const [playerToAdd, setPlayerToAdd] = useState('');
    // playerToReplace is the player selected to be replaced; when set, it opens up the Player Stats Table
    const { position, playerToReplace } = replacementInfo;
    const [tempSquad, setTempSquad] = useState<Squad>(JSON.parse(JSON.stringify(squad)));
    const [tempFreeTransfers, setTempFreeTransfers] = useState(freeTransfers);
    const [tempCost, setTempCost] = useState(nextGwCost);
    const [transfers, setTransfers] = useState<InGameTransfer[]>([]);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

    useEffect(() => {
        setTempFreeTransfers(freeTransfers);
        setTempCost(nextGwCost);
        setTempSquad(JSON.parse(JSON.stringify(squad)));
        setTransfers([]);
    }, [freeTransfers, nextGwCost]);

    const isTransferTarget = (player: string) => {
        return transfers.findIndex((transfer) => transfer.playerToBuy.code === player) > -1;
    };

    const handleClickPlayer = (playerClicked: string) => {
        setPlayerClicked(playerClicked);
    };

    const handleSetReplacePlayer = (playerToReplace: string, position: Position) => {
        setReplacementInfo({
            position,
            playerToReplace,
        });
    };

    const handleCloseSelectPlayerModal = () => {
        setPlayerToAdd(() => '');
        setReplacementInfo(() => ({
            position: Position.GK,
            playerToReplace: '',
        }));
        setPlayerClicked(() => '');
    };

    const handleAddTransfer = () => {
        const transferTargetIndex = transfers.findIndex((transfer) => transfer.playerToBuy.code === playerToReplace);
        const playerToSellIndex = transfers.findIndex((transfer) => transfer.playerToSell.code === playerToAdd);

        if (transferTargetIndex > -1 && playerToSellIndex > -1 && transferTargetIndex === playerToSellIndex) {
            // Case 1: Replacing an existing transfer target with the original squad player he is replacing
            // This is a transfer that is an exact reverse of an existing transfer, so we just need to delete that existing transfer
            const deletedTransfer = transfers[transferTargetIndex];
            setTransfers(transfers.slice(0, transferTargetIndex).concat(transfers.slice(transferTargetIndex + 1)));
            const playerToRestoreIndex = tempSquad[position].findIndex(
                (player) => player.code === deletedTransfer.playerToBuy.code
            );
            setTempSquad({
                ...tempSquad,
                [position]: tempSquad[position]
                    .slice(0, playerToRestoreIndex)
                    .concat(squad[position][playerToRestoreIndex])
                    .concat(tempSquad[position].slice(playerToRestoreIndex + 1)),
            });
        } else if (transferTargetIndex > -1) {
            // Case 2: A player to be replaced is an existing transfer target
            // Modify that transfer to change the target to the new playerToAdd
            const prevTransTarget = transfers[transferTargetIndex].playerToBuy;
            const updatedTransfer = {
                playerToSell: {
                    ...transfers[transferTargetIndex].playerToSell,
                },
                playerToBuy: {
                    code: playerToAdd,
                    buyPrice: playersStats[playerToAdd].value,
                },
            };
            setTransfers(
                transfers
                    .slice(0, transferTargetIndex)
                    .concat(updatedTransfer)
                    .concat(transfers.slice(transferTargetIndex + 1))
            );
            const playerToReplaceIndex = tempSquad[position].findIndex(
                (player) => player.code === prevTransTarget.code
            );
            setTempSquad({
                ...tempSquad,
                [position]: tempSquad[position]
                    .slice(0, playerToReplaceIndex)
                    .concat(updatedTransfer.playerToBuy)
                    .concat(tempSquad[position].slice(playerToReplaceIndex + 1)),
            });
        } else if (playerToSellIndex > -1) {
            // Case 3: A player to be added is a player to be sold in an existing transfer T
            // Delete T and restore that player, and create a new transfer where the player to be added is the transfer target of T
            const deletedTransfer = transfers[playerToSellIndex];
            const newTransfer = {
                playerToSell: {
                    code: playerToReplace,
                    sellPrice: getPlayerSellPrice(
                        playerToReplace,
                        squad,
                        position,
                        playersStats[playerToReplace].value
                    ),
                },
                playerToBuy: {
                    ...deletedTransfer.playerToBuy,
                },
            };
            setTransfers(
                transfers.slice(0, playerToSellIndex).concat(transfers.slice(playerToSellIndex + 1).concat(newTransfer))
            );
            const playerToRestoreIndex = tempSquad[position].findIndex(
                (player) => player.code === deletedTransfer.playerToBuy.code
            );
            const playerToReplaceIndex = tempSquad[position].findIndex(
                (player) => player.code === newTransfer.playerToSell.code
            );
            let updatedLineup = tempSquad[position]
                .slice(0, playerToRestoreIndex)
                .concat(squad[position][playerToRestoreIndex])
                .concat(tempSquad[position].slice(playerToRestoreIndex + 1));
            updatedLineup = updatedLineup
                .slice(0, playerToReplaceIndex)
                .concat(newTransfer.playerToBuy)
                .concat(updatedLineup.slice(playerToReplaceIndex + 1));
            setTempSquad({
                ...tempSquad,
                [position]: updatedLineup,
            });
        } else {
            // Case 4: Add a new transfer
            const newTransfer = {
                playerToSell: {
                    code: playerToReplace,
                    sellPrice: getPlayerSellPrice(
                        playerToReplace,
                        squad,
                        position,
                        playersStats[playerToReplace].value
                    ),
                },
                playerToBuy: {
                    code: playerToAdd,
                    buyPrice: playersStats[playerToAdd].value,
                },
            };
            const updatedTransfers = transfers.concat(newTransfer);
            setTransfers(updatedTransfers);
            if (freeTransfers !== Number.MAX_SAFE_INTEGER) {
                setTempFreeTransfers(Math.max(tempFreeTransfers - 1, 0));
                setTempCost(nextGwCost + Math.min((freeTransfers - updatedTransfers.length) * 4, 0));
            }
            const playerToReplaceIndex = tempSquad[position].findIndex(
                (player) => player.code === newTransfer.playerToSell.code
            );
            setTempSquad({
                ...tempSquad,
                [position]: tempSquad[position]
                    .slice(0, playerToReplaceIndex)
                    .concat(newTransfer.playerToBuy)
                    .concat(tempSquad[position].slice(playerToReplaceIndex + 1)),
            });
        }
        handleCloseSelectPlayerModal();
    };

    // Restore playerClicked, who must be a transfer target, to its original squad member and cancel its transfer
    const handleRestorePlayer = () => {
        const transferTargetIndex = transfers.findIndex((transfer) => transfer.playerToBuy.code === playerClicked);
        setTransfers(transfers.slice(0, transferTargetIndex).concat(transfers.slice(transferTargetIndex + 1)));
        const { position: playerClickedPosition } = playersBio[playerClicked];
        assertIsPosition(playerClickedPosition);
        const playerToRestoreIndex = tempSquad[playerClickedPosition].findIndex(
            (player) => player.code === playerClicked
        );
        setTempSquad({
            ...tempSquad,
            [playerClickedPosition]: tempSquad[playerClickedPosition]
                .slice(0, playerToRestoreIndex)
                .concat(squad[playerClickedPosition][playerToRestoreIndex])
                .concat(tempSquad[playerClickedPosition].slice(playerToRestoreIndex + 1)),
        });
        setPlayerClicked('');
    };

    const handleReadyReplacePlayer = () => {
        const { position: playerClickedPosition } = playersBio[playerClicked];
        assertIsPosition(playerClickedPosition);
        handleSetReplacePlayer(playerClicked, playerClickedPosition);
        setPlayerClicked('');
    };

    const highlightTransfers = (playerCode: string) => {
        if (transfers.findIndex((transfer) => transfer.playerToBuy.code === playerCode) > -1) {
            return ' player-card-transfer';
        }
        return '';
    };

    const handleResetTransfers = () => {
        setTransfers([]);
        setTempSquad(JSON.parse(JSON.stringify(squad)));
        setTempCost(nextGwCost);
        setTempFreeTransfers(freeTransfers);
    };

    const handleProceedWithTransfers = () => {
        setIsConfirmModalVisible(true);
    };

    const handleCancelTransfers = () => {
        setIsConfirmModalVisible(false);
    };

    const handleFinalizeTransfers = () => {
        finalizeTransfers(tempSquad, tempBalance, tempCost, tempFreeTransfers, transfers);
        setIsConfirmModalVisible(false);
        setTransfers([]);
    };

    // Free Hit and Wild Card chips cannot be deactivated once activated
    const handleClickChip = (chip: Chip) => {
        if (activeChip === chip) {
            warnCannotDeactiveChip();
        } else {
            activateChip(chip);
        }
    };

    const shouldDisableChip = (chip: Chip) =>
        gameweek === 0 || (activeChip !== null && activeChip !== chip) || (activeChip !== chip && chipCount[chip] < 1);

    const tempBalance = getTempBalance(balance, transfers);
    const isPositiveBalance = tempBalance >= 0;
    const teamsOverPlayerLimit = getTeamsOverMaxPlayerLimit(tempSquad, playersBio);
    const isSquadValid = isPositiveBalance && teamsOverPlayerLimit.length === 0;
    const isFreeHitActive = activeChip === Chip.FREE_HIT;
    const isWildCardActive = activeChip === Chip.WILD_CARD;
    const isFreeHitUsed = chipCount[Chip.FREE_HIT] < 1;
    const isWildCardUsed = chipCount[Chip.WILD_CARD] < 1;

    return (
        <Content className="site-layout-content">
            <div className="site-layout-background">
                <div className="page-title page-title-two-sections">
                    <div>Transfers</div>
                    <div className="center-when-mobile">
                        <TransferMetrics
                            tempFreeTransfers={tempFreeTransfers}
                            tempBalance={tempBalance}
                            tempCost={tempCost}
                        />
                    </div>
                </div>
                <div className="top-btn-container">
                    <Button
                        size="large"
                        className="top-btn"
                        disabled={shouldDisableChip(Chip.FREE_HIT)}
                        type={isFreeHitActive ? 'primary' : 'default'}
                        onClick={() => handleClickChip(Chip.FREE_HIT)}
                    >
                        {`Free Hit${isFreeHitActive ? ' (ON)' : isFreeHitUsed ? ' (USED)' : ''}`}
                    </Button>
                    <Button
                        size="large"
                        className="top-btn"
                        disabled={shouldDisableChip(Chip.WILD_CARD)}
                        type={isWildCardActive ? 'primary' : 'default'}
                        onClick={() => handleClickChip(Chip.WILD_CARD)}
                    >
                        {`Wild Card${isWildCardActive ? ' (ON)' : isWildCardUsed ? ' (USED)' : ''}`}
                    </Button>
                </div>
                <Divider className="custom-divider" />
                <SquadLineup
                    handleClickPlayer={handleClickPlayer}
                    handleSetReplacePlayer={handleSetReplacePlayer}
                    showSubs
                    valueType={ValueType.PRICE}
                    squad={tempSquad}
                    getPlayerCustomClasses={highlightTransfers}
                />
                <Divider className="custom-divider" />
                <div className="bottom-btn-container">
                    <Button
                        size="large"
                        onClick={handleResetTransfers}
                        className="bottom-btn"
                        disabled={transfers.length === 0}
                    >
                        Reset
                    </Button>
                    <Button
                        size="large"
                        type="primary"
                        onClick={handleProceedWithTransfers}
                        className="bottom-btn"
                        disabled={!isSquadValid || transfers.length === 0}
                    >
                        Next
                    </Button>
                    <div className="error-note">
                        {!isPositiveBalance && <span>Not enough money in the bank. </span>}
                        {teamsOverPlayerLimit.length > 0 && (
                            <span>
                                Too many players from{' '}
                                {teamsOverPlayerLimit.map((team) => (
                                    <TeamTag teamCode={team} />
                                ))}
                            </span>
                        )}
                    </div>
                </div>
                {playerClicked.length > 0 && (
                    <PlayerDetailsModal selectedPlayer={playerClicked} onClose={() => setPlayerClicked('')}>
                        <Row>
                            <Col span={12}>
                                <Button
                                    size="large"
                                    className="player-details-modal-btn btn-pair-left"
                                    disabled={!isTransferTarget(playerClicked)}
                                    onClick={handleRestorePlayer}
                                >
                                    Restore
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button
                                    type="primary"
                                    size="large"
                                    className="player-details-modal-btn btn-pair-right"
                                    onClick={handleReadyReplacePlayer}
                                >
                                    Replace
                                </Button>
                            </Col>
                        </Row>
                    </PlayerDetailsModal>
                )}
                <SelectPlayerModal
                    position={position}
                    playerToReplace={playerToReplace}
                    squad={tempSquad}
                    onChangePlayerToAdd={(playerToAdd: string) => setPlayerToAdd(playerToAdd)}
                    onClose={handleCloseSelectPlayerModal}
                />
                {playerToAdd.length > 0 && (
                    <PlayerDetailsModal selectedPlayer={playerToAdd} onClose={() => setPlayerToAdd('')}>
                        <Button
                            type="primary"
                            size="large"
                            className="player-details-modal-btn"
                            onClick={handleAddTransfer}
                        >
                            Select
                        </Button>
                    </PlayerDetailsModal>
                )}
                <ConfirmTransfersModal
                    playersBio={playersBio}
                    isModalVisible={isConfirmModalVisible}
                    transfers={transfers}
                    freeTransfers={freeTransfers}
                    tempBalance={tempBalance}
                    onOk={handleFinalizeTransfers}
                    onCancel={handleCancelTransfers}
                />
            </div>
        </Content>
    );
};

const mapStateToProps = ({ data, game }: StoreState) => {
    const { playersBio, playersStats } = data;
    const { gameweek, squad, balance, isSquadComplete, isSeasonEnd, freeTransfers, nextGwCost, activeChip, chipCount } =
        game;
    return {
        playersBio,
        playersStats,
        gameweek,
        squad,
        balance,
        isSquadComplete,
        isSeasonEnd,
        freeTransfers,
        nextGwCost,
        activeChip,
        chipCount,
    };
};

export default connect(mapStateToProps, { finalizeTransfers, activateChip })(
    checkSeasonEndHOC(checkSquadCompleteHOC(_Transfers))
);
