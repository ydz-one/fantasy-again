import { FdrFixture, FdrRow, PlayerStatsRow } from '../types';

const TOTAL_MANAGERS = 6_000_000;
const MILLION = 1_000_000;
const THOUSAND = 1_000;

function assertIsArrayOfFdrFixtures(obj: unknown): asserts obj is FdrFixture[] {
    if (Array.isArray(obj) && (obj.length === 0 || obj[0].opponent != null)) return;
    else throw new Error('Input must be an array of FDR fixtures');
}

export const fdrFixtureComparatorFactory = (gwTitle: string) => (a: FdrRow, b: FdrRow) => {
    const aGW = a[gwTitle];
    const bGW = b[gwTitle];
    const result = aGW.length - bGW.length;
    if (result !== 0 || aGW.length === 0) return result;
    assertIsArrayOfFdrFixtures(aGW);
    assertIsArrayOfFdrFixtures(bGW);
    const aDiffiSum = aGW.reduce((acc, val) => acc + val.difficulty, 0);
    const bDiffiSum = bGW.reduce((acc, val) => acc + val.difficulty, 0);
    return bDiffiSum - aDiffiSum;
};

export const columnComparatorFactory = (dataIndex: string) => (a: PlayerStatsRow, b: PlayerStatsRow) =>
    a[dataIndex] < b[dataIndex] ? -1 : b[dataIndex] < a[dataIndex] ? 1 : 0;

export const formatOneDecimalPlace = (num: number) => Number(num).toFixed(1);

export const formatIctValues = (num: number) => (num < 0 ? '-' : formatOneDecimalPlace(num));

export const formatValue = (value: number, hideSymbol?: boolean) =>
    (hideSymbol === true ? '' : '£') + formatOneDecimalPlace(value / 10) + 'm';

export const formatSelected = (selected: number) =>
    Number(selected / TOTAL_MANAGERS).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 });

export const formatPoints = (points: number) => points + ' pts';

export const formatLargeNumber = (num: number) =>
    Math.abs(num) > MILLION
        ? Math.round((10 * num) / MILLION) / 10 + 'm'
        : Math.abs(num) > THOUSAND
        ? Math.round((10 * num) / THOUSAND) / 10 + 'K'
        : num.toString();
