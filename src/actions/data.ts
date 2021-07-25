import { DataActionTypes, DEFAULT_SEASON, LoadNewGwDataAction } from '../types';
import { getGw, getGwMeta } from '../data';

export const loadNewGwData = (gwNum: number): LoadNewGwDataAction => ({
    type: DataActionTypes.loadNewGwData,
    payload: {
        gw: getGw(DEFAULT_SEASON, gwNum),
        gwMeta: getGwMeta(DEFAULT_SEASON, gwNum + 1), //request gw metadata from a week into the future for accuracy
    },
    gwNum,
    shouldResetPoints: gwNum === 1, //set shouldResetPoints to true if it's gw1 because we need to reset the total points from the previous season
});
