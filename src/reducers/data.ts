import { getFdr, getFixtures, getPlayersHistory } from '../data/api';
import { DataAction, DataActionTypes, DataState, DEFAULT_SEASON } from '../types';

const getInitialDataState = () => {
    return {
        fdr: getFdr(DEFAULT_SEASON),
        fixtures: getFixtures(DEFAULT_SEASON),
        playersHistory: getPlayersHistory(DEFAULT_SEASON)
    };
}

export const dataReducer = (state: DataState = getInitialDataState(), action: DataAction): DataState => {
    switch (action.type) {
        case DataActionTypes.SetFdrAction:
            return {
                ...state,
                fdr: action.payload
            };
        default:
            return state;
    }
}