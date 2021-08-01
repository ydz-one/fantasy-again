import { Squad } from '../../types';

// GW1 squad consisting of official Scout picks and additional subs
export const scoutPickGW1: Squad = {
    GK: [
        { code: '58376', buyPrice: 45 },
        { code: '131897', buyPrice: 45 },
    ],
    DEF: [
        { code: '169187', buyPrice: 75 },
        { code: '156074', buyPrice: 45 },
        { code: '220627', buyPrice: 45 },
        { code: '244723', buyPrice: 40 },
        { code: '214048', buyPrice: 40 },
    ],
    MID: [
        { code: '170137', buyPrice: 55 },
        { code: '118748', buyPrice: 120 },
        { code: '178186', buyPrice: 65 },
        { code: '54694', buyPrice: 120 },
        { code: '40845', buyPrice: 45 },
    ],
    FWD: [
        { code: '200439', buyPrice: 60 },
        { code: '78830', buyPrice: 105 },
        { code: '165153', buyPrice: 95 },
    ],
    SUB: [],
    CAP: '',
    VC: '',
};
