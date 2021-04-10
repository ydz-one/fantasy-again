export interface GameState {
    gameweek : number
}

export enum GameActionTypes {
    IncrementGameweek
}

export type GameAction = IncrementGameweekAction;

export interface IncrementGameweekAction {
    type: GameActionTypes.IncrementGameweek;
}