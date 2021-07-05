import { getFdr } from '../data/api';
import { DataAction, DataActionTypes, DataState, DEFAULT_SEASON } from '../types';

const getInitialDataState = () => {
    return {
        fdr: getFdr(DEFAULT_SEASON)
    };
}

export const dataReducer = (state: DataState = getInitialDataState(), action: DataAction): DataState => {
    switch (action.type) {
        case DataActionTypes.SetFixturesAction:
            return {
                ...state,
                fdr: action.payload
            };
        default:
            return state;
    }
}