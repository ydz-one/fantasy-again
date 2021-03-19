import { combineReducers } from 'redux';
import { gameReducer } from './game';
import { GameState } from '../types';

export interface StoreState {
    game: GameState;
}

export const reducers = combineReducers<StoreState>({
    game: gameReducer
});