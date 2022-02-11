import { Chip, ChipCount } from '../../types';

export const chipCountUpdateFns = {
    18: function (chipCount: ChipCount) {
        return {
            ...chipCount,
            [Chip.WILD_CARD]: 1,
        };
    },
};
