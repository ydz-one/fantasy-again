import { DataActionTypes, DEFAULT_SEASON, FdrData, LoadNewGwDataAction } from "../types";
import { getGw } from "../data";

// export const SetFdr = (fdr: FdrData): SetFdrAction => {
//     return {
//         type: DataActionTypes.SetFdrAction,
//         payload: fdr
//     };
// }

export const loadNewGwData = (gwNum: number): LoadNewGwDataAction => (
    {
        type: DataActionTypes.loadNewGwData,
        payload: getGw(DEFAULT_SEASON, gwNum),
        gwNum,
        shouldResetPoints: gwNum === 1 // set shouldResetPoints to true if it's gw1 because we need to reset the total points from the previous season
    }
);