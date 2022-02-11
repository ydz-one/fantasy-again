import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Divider, Layout, Statistic, Checkbox, Row, Col } from 'antd';
import { checkSquadCompleteHOC } from './checkSquadCompleteHOC';
import { StoreState } from '../reducers';
import { makeCaptain, makeViceCaptain, subPlayer, activateChip, deactivateChip } from '../actions';
import { Chip, ChipCount, PlayersBio, PlayersStats, Squad, ValueType } from '../types';
import PlayerDetailsModal from './PlayerDetailsModal';
import SquadLineup from './SquadLineup';
import { preGwDates } from '../data/2020_2021/preGwDates';
import moment from 'moment';
import { statisticsFontSize } from '../constants/ui';
import PlayerBench from './PlayerBench';
import { getSubstitutionTargets, isSubstitute } from '../helpers';
import { checkSeasonEndHOC } from './checkSeasonEndHOC';

const { Content } = Layout;

interface Props {
    playersBio: PlayersBio;
    playersStats: PlayersStats;
    gameweek: number;
    squad: Squad;
    activeChip: Chip | null;
    chipCount: ChipCount;
    isSquadComplete: boolean;
    isSeasonEnd: boolean;
    makeCaptain: typeof makeCaptain;
    makeViceCaptain: typeof makeViceCaptain;
    subPlayer: typeof subPlayer;
    activateChip: typeof activateChip;
    deactivateChip: typeof deactivateChip;
}

interface SubstitutionInfo {
    playerToSubstitute: string;
    substitutionTargets: string[];
}

const _PickTeam = ({
    playersBio,
    gameweek,
    squad,
    activeChip,
    chipCount,
    makeCaptain,
    makeViceCaptain,
    subPlayer,
    activateChip,
    deactivateChip,
}: Props) => {
    // playerClicked is the player card clicked whose Player Details modal should be displayed
    const [playerClicked, setPlayerClicked] = useState('');
    const [substitionInfo, setSubstitutionInfo] = useState<SubstitutionInfo>({
        playerToSubstitute: '',
        substitutionTargets: [],
    });

    const handleClickPlayer = (player: string) => {
        const { playerToSubstitute } = substitionInfo;
        if (playerToSubstitute.length > 0) {
            // No need to go thru with the substitution action if the same player is clicked on
            if (playerToSubstitute !== player) {
                subPlayer(playerToSubstitute, player);
            }
            setSubstitutionInfo({
                playerToSubstitute: '',
                substitutionTargets: [],
            });
        } else {
            setPlayerClicked(player);
        }
    };

    const handleSelectPlayerToSubstitute = (playerClicked: string, position: string) => {
        setSubstitutionInfo({
            playerToSubstitute: playerClicked,
            substitutionTargets: getSubstitutionTargets(squad, position, playerClicked),
        });
        setPlayerClicked('');
    };

    const handleMakeCaptain = () => {
        makeCaptain(playerClicked);
        setPlayerClicked('');
    };

    const handleMakeViceCaptain = () => {
        makeViceCaptain(playerClicked);
        setPlayerClicked('');
    };

    const checkPlayerClickable = (playerCode: string) => {
        const { playerToSubstitute, substitutionTargets } = substitionInfo;
        return (
            substitutionTargets.length === 0 ||
            playerToSubstitute === playerCode ||
            substitutionTargets.includes(playerCode)
        );
    };

    const getPlayerCustomClasses = (playerCode: string) => {
        if (substitionInfo.playerToSubstitute === playerCode) {
            return isSubstitute(squad, playerCode) ? ' player-card-sub-on' : ' player-card-sub-off';
        }
        if (substitionInfo.substitutionTargets.includes(playerCode)) {
            return isSubstitute(squad, playerCode)
                ? isSubstitute(squad, substitionInfo.playerToSubstitute)
                    ? ' player-card-sub-other'
                    : ' player-card-sub-on'
                : ' player-card-sub-off';
        }
        return '';
    };

    const handleClickChip = (chip: Chip) => {
        if (activeChip === chip) {
            deactivateChip();
        } else {
            activateChip(chip);
        }
    };

    const shouldDisableChip = (chip: Chip) =>
        activeChip === Chip.FREE_HIT || activeChip === Chip.WILD_CARD || (chipCount[chip] < 1 && activeChip !== chip);

    const isTripleCaptainActive = activeChip === Chip.TRIPLE_CAPTAIN;
    const isBenchBoostActive = activeChip === Chip.BENCH_BOOST;
    const isTripleCaptainUsed = chipCount[Chip.TRIPLE_CAPTAIN] < 1;
    const isBenchBoostUsed = chipCount[Chip.BENCH_BOOST] < 1;

    return (
        <Content className="site-layout-content">
            <div className="site-layout-background">
                <div className="page-title page-title-two-sections">
                    <div>Pick Team</div>
                    <div className="top-metric-section center-when-mobile">
                        <Statistic
                            title={`GW${gameweek + 1} Deadline`}
                            value={moment(preGwDates[gameweek]).add(1, 'days').format('ll')}
                            valueStyle={statisticsFontSize}
                            className="top-metric"
                        />
                    </div>
                </div>
                <div className="top-btn-container">
                    <Button
                        size="large"
                        className="top-btn-large top-btn-large-left"
                        disabled={shouldDisableChip(Chip.BENCH_BOOST)}
                        type={isBenchBoostActive ? 'primary' : 'default'}
                        onClick={() => handleClickChip(Chip.BENCH_BOOST)}
                    >
                        {`Bench Boost${isBenchBoostActive ? ' (ON)' : isBenchBoostUsed ? ' (USED)' : ''}`}
                    </Button>
                    <Button
                        size="large"
                        className="top-btn-large"
                        disabled={shouldDisableChip(Chip.TRIPLE_CAPTAIN)}
                        type={isTripleCaptainActive ? 'primary' : 'default'}
                        onClick={() => handleClickChip(Chip.TRIPLE_CAPTAIN)}
                    >
                        {`TripleCaptain${isTripleCaptainActive ? ' (ON)' : isTripleCaptainUsed ? ' (USED)' : ''}`}
                    </Button>
                </div>
                <Divider className="custom-divider" />
                <SquadLineup
                    handleClickPlayer={handleClickPlayer}
                    showCap
                    valueType={ValueType.FIXTURE}
                    checkPlayerClickable={checkPlayerClickable}
                    getPlayerCustomClasses={getPlayerCustomClasses}
                />
                <Divider className="custom-divider" />
                <PlayerBench
                    handleClickPlayer={handleClickPlayer}
                    valueType={ValueType.FIXTURE}
                    checkPlayerClickable={checkPlayerClickable}
                    getPlayerCustomClasses={getPlayerCustomClasses}
                />
                {playerClicked.length > 0 && (
                    <PlayerDetailsModal selectedPlayer={playerClicked} onClose={() => setPlayerClicked('')}>
                        <Button
                            type="primary"
                            size="large"
                            className="player-details-modal-btn"
                            onClick={() =>
                                handleSelectPlayerToSubstitute(playerClicked, playersBio[playerClicked].position)
                            }
                        >
                            Substitute
                        </Button>
                        <Row>
                            <Col span={12}>
                                <Checkbox
                                    disabled={isSubstitute(squad, playerClicked)}
                                    checked={squad.captain === playerClicked}
                                    onChange={handleMakeCaptain}
                                >
                                    Captain
                                </Checkbox>
                            </Col>
                            <Col span={12}>
                                <Checkbox
                                    disabled={isSubstitute(squad, playerClicked)}
                                    checked={squad.viceCaptain === playerClicked}
                                    onChange={handleMakeViceCaptain}
                                >
                                    Vice Captain
                                </Checkbox>
                            </Col>
                        </Row>
                    </PlayerDetailsModal>
                )}
            </div>
        </Content>
    );
};

const mapStateToProps = ({ data, game }: StoreState) => {
    const { playersBio, playersStats } = data;
    const { gameweek, squad, balance, isSquadComplete, isSeasonEnd, activeChip, chipCount } = game;
    return {
        playersBio,
        playersStats,
        gameweek,
        squad,
        balance,
        activeChip,
        chipCount,
        isSquadComplete,
        isSeasonEnd,
    };
};

export default connect(mapStateToProps, { makeCaptain, makeViceCaptain, subPlayer, activateChip, deactivateChip })(
    checkSeasonEndHOC(checkSquadCompleteHOC(_PickTeam))
);
