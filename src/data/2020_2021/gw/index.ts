import gw1 from './gw1.json';
import gw2 from './gw2.json';
import gw3 from './gw3.json';
import gw4 from './gw4.json';
import gw5 from './gw5.json';
import gw6 from './gw6.json';
import gw7 from './gw7.json';
import gw8 from './gw8.json';
import gw9 from './gw9.json';
import gw10 from './gw10.json';
import gw11 from './gw11.json';
import gw12 from './gw12.json';
import gw13 from './gw13.json';
import gw14 from './gw14.json';
import gw15 from './gw15.json';
import gw16 from './gw16.json';
import gw17 from './gw17.json';
import gw18 from './gw18.json';
import gw19 from './gw19.json';
import gw20 from './gw20.json';
import gw21 from './gw21.json';
import gw22 from './gw22.json';
import gw23 from './gw23.json';
import gw24 from './gw24.json';
import gw25 from './gw25.json';
import gw26 from './gw26.json';
import gw27 from './gw27.json';
import gw28 from './gw28.json';
import gw29 from './gw29.json';
import gw30 from './gw30.json';
import gw31 from './gw31.json';
import gw32 from './gw32.json';
import gw33 from './gw33.json';
import gw34 from './gw34.json';
import gw35 from './gw35.json';
import gw36 from './gw36.json';
import gw37 from './gw37.json';
import gw38 from './gw38.json';
import gw1Meta from './gw1_meta.json'
import gw2Meta from './gw2_meta.json'
import gw3Meta from './gw3_meta.json'
import gw4Meta from './gw4_meta.json'
import gw5Meta from './gw5_meta.json'
import gw6Meta from './gw6_meta.json'
import gw7Meta from './gw7_meta.json'
import gw8Meta from './gw8_meta.json'
import gw9Meta from './gw9_meta.json'
import gw10Meta from './gw10_meta.json'
import gw11Meta from './gw11_meta.json'
import gw12Meta from './gw12_meta.json'
import gw13Meta from './gw13_meta.json'
import gw14Meta from './gw14_meta.json'
import gw15Meta from './gw15_meta.json'
import gw16Meta from './gw16_meta.json'
import gw17Meta from './gw17_meta.json'
import gw18Meta from './gw18_meta.json'
import gw19Meta from './gw19_meta.json'
import gw20Meta from './gw20_meta.json'
import gw21Meta from './gw21_meta.json'
import gw22Meta from './gw22_meta.json'
import gw23Meta from './gw23_meta.json'
import gw24Meta from './gw24_meta.json'
import gw25Meta from './gw25_meta.json'
import gw26Meta from './gw26_meta.json'
import gw27Meta from './gw27_meta.json'
import gw28Meta from './gw28_meta.json'
import gw29Meta from './gw29_meta.json'
import gw30Meta from './gw30_meta.json'
import gw31Meta from './gw31_meta.json'
import gw32Meta from './gw32_meta.json'
import gw33Meta from './gw33_meta.json'
import gw34Meta from './gw34_meta.json'
import gw35Meta from './gw35_meta.json'
import gw36Meta from './gw36_meta.json'
import gw37Meta from './gw37_meta.json'
import gw38Meta from './gw38_meta.json'
import { PlayerGw, PlayerGwMeta } from '../../../types';

export const getGw = (gwNum: number): PlayerGw[] => {
    switch (gwNum) {
        case 1: return gw1;
        case 2: return gw2;
        case 3: return gw3;
        case 4: return gw4;
        case 5: return gw5;
        case 6: return gw6;
        case 7: return gw7;
        case 8: return gw8;
        case 9: return gw9;
        case 10: return gw10;
        case 11: return gw11;
        case 12: return gw12;
        case 13: return gw13;
        case 14: return gw14;
        case 15: return gw15;
        case 16: return gw16;
        case 17: return gw17;
        case 18: return gw18;
        case 19: return gw19;
        case 20: return gw20;
        case 21: return gw21;
        case 22: return gw22;
        case 23: return gw23;
        case 24: return gw24;
        case 25: return gw25;
        case 26: return gw26;
        case 27: return gw27;
        case 28: return gw28;
        case 29: return gw29;
        case 30: return gw30;
        case 31: return gw31;
        case 32: return gw32;
        case 33: return gw33;
        case 34: return gw34;
        case 35: return gw35;
        case 36: return gw36;
        case 37: return gw37;
        case 38: return gw38;
        default:
            throw new Error('Gameweek not found');        
    }
}

export const getGwMeta = (gwNum: number): PlayerGwMeta[] => {
    switch (gwNum) {
        case 1: return gw1Meta;
        case 2: return gw2Meta;
        case 3: return gw3Meta;
        case 4: return gw4Meta;
        case 5: return gw5Meta;
        case 6: return gw6Meta;
        case 7: return gw7Meta;
        case 8: return gw8Meta;
        case 9: return gw9Meta;
        case 10: return gw10Meta;
        case 11: return gw11Meta;
        case 12: return gw12Meta;
        case 13: return gw13Meta;
        case 14: return gw14Meta;
        case 15: return gw15Meta;
        case 16: return gw16Meta;
        case 17: return gw17Meta;
        case 18: return gw18Meta;
        case 19: return gw19Meta;
        case 20: return gw20Meta;
        case 21: return gw21Meta;
        case 22: return gw22Meta;
        case 23: return gw23Meta;
        case 24: return gw24Meta;
        case 25: return gw25Meta;
        case 26: return gw26Meta;
        case 27: return gw27Meta;
        case 28: return gw28Meta;
        case 29: return gw29Meta;
        case 30: return gw30Meta;
        case 31: return gw31Meta;
        case 32: return gw32Meta;
        case 33: return gw33Meta;
        case 34: return gw34Meta;
        case 35: return gw35Meta;
        case 36: return gw36Meta;
        case 37: return gw37Meta;
        case 38: return gw38Meta;
        case 39: return gw38Meta; //send the GW metadata from GW 38 for GW 39 for the after the last GW
        default:
            throw new Error('Gameweek not found');        
    }
}
