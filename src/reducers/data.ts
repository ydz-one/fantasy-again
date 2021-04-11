import { getFixtures } from '../data/api';
import { DataAction, DataActionTypes, DataState, DEFAULT_SEASON } from '../types';

const getInitialDataState = () => {
    return {
        fixtures: getFixtures(DEFAULT_SEASON)
    };
}

export const dataReducer = (state: DataState = getInitialDataState(), action: DataAction): DataState => {
    switch (action.type) {
        case DataActionTypes.SetFixturesAction:
            return {
                ...state,
                fixtures: action.payload
            };
        default:
            return state;
    }
}