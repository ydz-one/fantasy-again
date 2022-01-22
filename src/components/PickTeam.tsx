import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Button, Divider, Layout, Statistic, Checkbox, Row, Col } from 'antd';
import { checkSquadCompleteHOC } from './checkSquadCompleteHOC';
import { StoreState } from '../reducers';
import { makeCaptain, makeViceCaptain, subPlayer } from '../actions';
import { PlayersBio, PlayersStats, Squad, ValueType } from '../types';
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
    balance: number;
    isSquadComplete: boolean;
    isSeasonEnd: boolean;
    makeCaptain: typeof makeCaptain;
    makeViceCaptain: typeof makeViceCaptain;
    subPlayer: typeof subPlayer;
}

interface SubstitutionInfo {
    playerToSubstitute: string;
    substitutionTargets: string[];
}

const _PickTeam = ({ playersBio, gameweek, squad, makeCaptain, makeViceCaptain, subPlayer }: Props) => {
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
                    <Button size="large" className="top-btn-large top-btn-large-left">
                        Bench Boost
                    </Button>
                    <Button size="large" className="top-btn-large">
                        Triple Captain
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
    const { gameweek, squad, balance, isSquadComplete, isSeasonEnd } = game;
    return {
        playersBio,
        playersStats,
        gameweek,
        squad,
        balance,
        isSquadComplete,
        isSeasonEnd,
    };
};

export default connect(mapStateToProps, { makeCaptain, makeViceCaptain, subPlayer })(
    checkSeasonEndHOC(checkSquadCompleteHOC(_PickTeam))
);
