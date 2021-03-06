import { Position } from './data';

export interface GameState {
    gameweek: number;
    points: number;
    isSquadComplete: boolean;
    isSeasonEnd: boolean;
    squad: Squad;
    squadPointsHistory: SquadPoints[];
    gwPointsHistory: number[];
    transfersHistory: InGameTransfer[][]; // array where i is gameweek - 1, and each element is an array of transfers before that gameweek
    deductionsHistory: number[];
    balanceHistory: number[];
    balance: number;
    freeTransfers: number;
    nextGwCost: number;
    activeChip: Chip | null;
    chipCount: ChipCount;
    chipHistory: ChipHistory;
}

export enum Chip {
    BENCH_BOOST,
    FREE_HIT,
    TRIPLE_CAPTAIN,
    WILD_CARD,
}

export type ChipCount = { [key in Chip]: number };

export type ChipHistory = { [key: number]: Chip };

export type SquadPlayer = {
    code: string;
    buyPrice: number;
};

export type SquadPlayerPoints = {
    position: string;
    name: string;
    code: string;
    teamCode: string;
    value: string;
    injured: number;
    injury: string;
    injuryEnd: string;
    hasRedCard: boolean;
    captainStatus: string;
    subStatus: string;
    buyPrice: number;
};

// The first four keys are kept in all caps to match the position names from the data
export type Squad = {
    GK: SquadPlayer[];
    DEF: SquadPlayer[];
    MID: SquadPlayer[];
    FWD: SquadPlayer[];
    subs: string[];
    subGk: string;
    captain: string;
    viceCaptain: string;
};

export type SquadPoints = {
    GK: SquadPlayerPoints[];
    DEF: SquadPlayerPoints[];
    MID: SquadPlayerPoints[];
    FWD: SquadPlayerPoints[];
    subs: SquadPlayerPoints[];
    subGk: SquadPlayerPoints;
};

export enum Season {
    S2017_2018 = '2017/18',
    S2018_2019 = '2018/19',
    S2019_2020 = '2019/20',
    S2020_2021 = '2020/21',
}

export const prevSeasonMap = {
    [Season.S2020_2021]: Season.S2019_2020.toString(),
};

export const DEFAULT_SEASON = Season.S2020_2021;

export type InGameTransfer = {
    playerToSell: { code: string; sellPrice: number };
    playerToBuy: { code: string; buyPrice: number };
};

export enum GameActionTypes {
    IncrementGameweek = 'IncrementGameweek',
    UpdateGameStateAfterGw = 'UpdateGameStateAfterGw',
    AddPlayerToSquad = 'AddPlayerToSquad',
    FinalizeSquad = 'FinalizeSquad',
    ResetSquad = 'ResetSquad',
    SetSquad = 'SetSquad',
    MakeCaptain = 'MakeCaptain',
    MakeViceCaptain = 'MakeViceCaptain',
    SubPlayer = 'SubPlayer',
    FinalizeTransfers = 'FinalizeTransfers',
    ActivateChip = 'ActivateChip',
    ResetGameState = 'ResetGameState',
}

export interface IncrementGameweekAction {
    type: GameActionTypes.IncrementGameweek;
}

export interface AddSquadPointsToHistoryAction {
    type: GameActionTypes.UpdateGameStateAfterGw;
    payload: {
        squadPoints: SquadPoints;
        gwPoints: number;
    };
}

export interface AddPlayerToSquadAction {
    type: GameActionTypes.AddPlayerToSquad;
    payload: {
        position: Position;
        playerToReplace: SquadPlayer;
        playerToAdd: SquadPlayer;
    };
}

export interface FinalizeSquadAction {
    type: GameActionTypes.FinalizeSquad;
}

export interface ResetSquadAction {
    type: GameActionTypes.ResetSquad;
}

export interface SetSquadAction {
    type: GameActionTypes.SetSquad;
    payload: Squad;
}

export interface MakeCaptainAction {
    type: GameActionTypes.MakeCaptain;
    payload: {
        playerCode: string;
    };
}

export interface MakeViceCaptainAction {
    type: GameActionTypes.MakeViceCaptain;
    payload: {
        playerCode: string;
    };
}

export interface SubPlayerAction {
    type: GameActionTypes.SubPlayer;
    payload: {
        player1: string;
        player2: string;
    };
}

export interface FinalizeTransfersAction {
    type: GameActionTypes.FinalizeTransfers;
    payload: {
        newSquad: Squad;
        newBalance: number;
        newNextGwCost: number;
        newFreeTransfers: number;
        transfers: InGameTransfer[];
    };
}

export interface ActivateChipAction {
    type: GameActionTypes.ActivateChip;
    payload: Chip | null;
}

export interface ResetGameStateAction {
    type: GameActionTypes.ResetGameState;
}

export type GameAction =
    | IncrementGameweekAction
    | AddSquadPointsToHistoryAction
    | AddPlayerToSquadAction
    | FinalizeSquadAction
    | ResetSquadAction
    | SetSquadAction
    | MakeCaptainAction
    | MakeViceCaptainAction
    | SubPlayerAction
    | FinalizeTransfersAction
    | ActivateChipAction
    | ResetGameStateAction;
