import { Chip, ChipCount } from '../../types';

export const chipCountUpdateFns = {
    16: function (chipCount: ChipCount) {
        return {
            ...chipCount,
            [Chip.WILD_CARD]: 1,
        };
    },
};
