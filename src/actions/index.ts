import { AnyAction } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { autoSub, calcGwPointsTotal, getSquadPoints } from '../helpers';
import { StoreState } from '../reducers';
import { PlayersBio, Squad } from '../types';
import { loadNewGwData } from './data';
import { updateGameStateAfterGw, incrementGameweek } from './game';

export * from './data';
export * from './game';

export const goToNextGameweek =
    (gameweek: number, squad: Squad, playersBio: PlayersBio): ThunkAction<void, StoreState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(loadNewGwData(gameweek + 1));
        dispatch(incrementGameweek());
        const autoSubbedSquad = autoSub(squad);
        const { playersStats: updatedPlayersStats } = getState().data;
        dispatch(
            updateGameStateAfterGw(
                getSquadPoints(autoSubbedSquad, updatedPlayersStats, playersBio, gameweek),
                calcGwPointsTotal(autoSubbedSquad, updatedPlayersStats)
            )
        );
    };
