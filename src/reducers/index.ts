import { combineReducers } from 'redux';
import { gameReducer } from './game';
import { dataReducer } from './data';
import { GameState, DataState } from '../types';

export interface StoreState {
    game: GameState;
    data: DataState;
}

export const reducers = combineReducers<StoreState>({
    game: gameReducer,
    data: dataReducer
});