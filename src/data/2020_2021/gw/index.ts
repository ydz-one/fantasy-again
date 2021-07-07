import gw1 from './gw1.json'
import gw2 from './gw2.json'
import gw3 from './gw3.json'
import gw4 from './gw4.json'
import gw5 from './gw5.json'
import gw6 from './gw6.json'
import gw7 from './gw7.json'
import gw8 from './gw8.json'
import gw9 from './gw9.json'
import gw10 from './gw10.json'
import gw11 from './gw11.json'
import gw12 from './gw12.json'
import gw13 from './gw13.json'
import gw14 from './gw14.json'
import gw15 from './gw15.json'
import gw16 from './gw16.json'
import gw17 from './gw17.json'
import gw18 from './gw18.json'
import gw19 from './gw19.json'
import gw20 from './gw20.json'
import gw21 from './gw21.json'
import gw22 from './gw22.json'
import gw23 from './gw23.json'
import gw24 from './gw24.json'
import gw25 from './gw25.json'
import gw26 from './gw26.json'
import gw27 from './gw27.json'
import gw28 from './gw28.json'
import gw29 from './gw29.json'
import gw30 from './gw30.json'
import gw31 from './gw31.json'
import gw32 from './gw32.json'
import gw33 from './gw33.json'
import gw34 from './gw34.json'
import gw35 from './gw35.json'
import gw36 from './gw36.json'
import gw37 from './gw37.json'
import gw38 from './gw38.json'
import { PlayerGw } from '../../../types'

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
