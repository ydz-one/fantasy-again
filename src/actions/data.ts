import { DataActionTypes, FdrData, SetFdrAction } from "../types";

export const SetFdr = (fdr: FdrData): SetFdrAction => {
    return {
        type: DataActionTypes.SetFdrAction,
        payload: fdr
    };
}