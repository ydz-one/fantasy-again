import { Position, Squad } from '../types';
import { getSubstitutionTargets } from './calculations';

describe('getSubstitutionTargets', () => {
    let squad: Squad;
    beforeEach(() => {
        squad = {
            GK: [
                {
                    code: 'gk1',
                    buyPrice: 45,
                },
                {
                    code: 'gk2',
                    buyPrice: 45,
                },
            ],
            DEF: [
                {
                    code: 'def1',
                    buyPrice: 75,
                },
                {
                    code: 'def2',
                    buyPrice: 45,
                },
                {
                    code: 'def3',
                    buyPrice: 45,
                },
                {
                    code: 'def4',
                    buyPrice: 40,
                },
                {
                    code: 'def5',
                    buyPrice: 40,
                },
            ],
            MID: [
                {
                    code: 'mid1',
                    buyPrice: 55,
                },
                {
                    code: 'mid2',
                    buyPrice: 120,
                },
                {
                    code: 'mid3',
                    buyPrice: 65,
                },
                {
                    code: 'mid4',
                    buyPrice: 120,
                },
                {
                    code: 'mid5',
                    buyPrice: 45,
                },
            ],
            FWD: [
                {
                    code: 'fwd1',
                    buyPrice: 60,
                },
                {
                    code: 'fwd2',
                    buyPrice: 105,
                },
                {
                    code: 'fwd3',
                    buyPrice: 95,
                },
            ],
            subs: ['def5', 'mid5', 'fwd3'],
            subGk: 'gk2',
            captain: 'mid2',
            viceCaptain: 'mid4',
        };
    });
    describe('GK substitutions', () => {
        test('the substitution target for the GK should be the sub GK', () => {
            expect(getSubstitutionTargets(squad, Position.GK, squad.GK[0].code)).toStrictEqual([squad.GK[1].code]);
        });
        test('the substitution target for the sub GK should be the GK', () => {
            expect(getSubstitutionTargets(squad, Position.GK, squad.GK[1].code)).toStrictEqual([squad.GK[0].code]);
        });
    });
    describe('4-4-2 formation substitutions', () => {
        test('the substitution targets for a starting defender should be all subs', () => {
            expect(getSubstitutionTargets(squad, Position.DEF, squad.DEF[0].code)).toStrictEqual(squad.subs);
        });
        test('the substitution targets for a starting midfielder should be all subs', () => {
            expect(getSubstitutionTargets(squad, Position.MID, squad.MID[0].code)).toStrictEqual(squad.subs);
        });
        test('the substitution targets for a starting forward should be all subs', () => {
            expect(getSubstitutionTargets(squad, Position.FWD, squad.FWD[0].code)).toStrictEqual(squad.subs);
        });
        test('the substitution targets for a benched defender should be all players except self and keepers', () => {
            const playerToSub = squad.subs[0];
            const actualResult = getSubstitutionTargets(squad, Position.DEF, playerToSub);
            actualResult.sort();
            const expectedResult = squad.DEF.concat(squad.MID.concat(squad.FWD))
                .map((player) => player.code)
                .filter((playerCode) => playerCode !== playerToSub);
            expectedResult.sort();
            expect(actualResult).toStrictEqual(expectedResult);
        });
        test('the substitution targets for a benched midfielder should be all players except self and keepers', () => {
            const playerToSub = squad.subs[1];
            const actualResult = getSubstitutionTargets(squad, Position.MID, playerToSub);
            actualResult.sort();
            const expectedResult = squad.DEF.concat(squad.MID.concat(squad.FWD))
                .map((player) => player.code)
                .filter((playerCode) => playerCode !== playerToSub);
            expectedResult.sort();
            expect(actualResult).toStrictEqual(expectedResult);
        });
        test('the substitution targets for a benched forward should be all players except self and keepers', () => {
            const playerToSub = squad.subs[2];
            const actualResult = getSubstitutionTargets(squad, Position.FWD, playerToSub);
            actualResult.sort();
            const expectedResult = squad.DEF.concat(squad.MID.concat(squad.FWD))
                .map((player) => player.code)
                .filter((playerCode) => playerCode !== playerToSub);
            expectedResult.sort();
            expect(actualResult).toStrictEqual(expectedResult);
        });
    });
    describe('3-5-2 formation substitutions', () => {
        beforeEach(() => {
            squad.subs = ['def4', 'def5', 'fwd3'];
        });
        test('the substitution targets for a starting defender should be all defender subs', () => {
            expect(getSubstitutionTargets(squad, Position.DEF, squad.DEF[0].code)).toStrictEqual(
                squad.subs.slice(0, 2)
            );
        });
        test('the substitution targets for a starting midfielder should be all subs', () => {
            expect(getSubstitutionTargets(squad, Position.MID, squad.MID[0].code)).toStrictEqual(squad.subs);
        });
        test('the substitution targets for a starting forward should be all subs', () => {
            expect(getSubstitutionTargets(squad, Position.FWD, squad.FWD[0].code)).toStrictEqual(squad.subs);
        });
        test('the substitution targets for a benched defender should be all players except self and keepers', () => {
            const playerToSub = squad.subs[0];
            const actualResult = getSubstitutionTargets(squad, Position.DEF, playerToSub);
            actualResult.sort();
            const expectedResult = squad.DEF.concat(squad.MID.concat(squad.FWD))
                .map((player) => player.code)
                .filter((playerCode) => playerCode !== playerToSub);
            expectedResult.sort();
            expect(actualResult).toStrictEqual(expectedResult);
        });
        test('the substitution targets for a benched forward should be all players except self, keepers, and starting defenders', () => {
            const playerToSub = squad.subs[2];
            const actualResult = getSubstitutionTargets(squad, Position.FWD, playerToSub);
            actualResult.sort();
            const expectedResult = squad.DEF.filter((defender) => squad.subs.includes(defender.code))
                .concat(squad.MID.concat(squad.FWD))
                .map((player) => player.code)
                .filter((playerCode) => playerCode !== playerToSub);
            expectedResult.sort();
            expect(actualResult).toStrictEqual(expectedResult);
        });
    });
    describe('5-2-3 formation substitutions', () => {
        beforeEach(() => {
            squad.subs = ['mid3', 'mid4', 'mid5'];
        });
        test('the substitution targets for a starting defender should be all subs', () => {
            expect(getSubstitutionTargets(squad, Position.DEF, squad.DEF[0].code)).toStrictEqual(squad.subs);
        });
        test('the substitution targets for a starting midfielder should be all midfielder subs, which is all of them', () => {
            expect(getSubstitutionTargets(squad, Position.MID, squad.MID[0].code)).toStrictEqual(squad.subs);
        });
        test('the substitution targets for a starting forward should be all subs', () => {
            expect(getSubstitutionTargets(squad, Position.FWD, squad.FWD[0].code)).toStrictEqual(squad.subs);
        });
        test('the substitution targets for a benched midfielder should be all players except self and keepers', () => {
            const playerToSub = squad.subs[0];
            const actualResult = getSubstitutionTargets(squad, Position.MID, playerToSub);
            actualResult.sort();
            const expectedResult = squad.DEF.concat(squad.MID.concat(squad.FWD))
                .map((player) => player.code)
                .filter((playerCode) => playerCode !== playerToSub);
            expectedResult.sort();
            expect(actualResult).toStrictEqual(expectedResult);
        });
    });
    describe('5-4-1 formation substitutions', () => {
        beforeEach(() => {
            squad.subs = ['mid5', 'fwd2', 'fwd3'];
        });
        test('the substitution targets for a starting defender should be all subs', () => {
            expect(getSubstitutionTargets(squad, Position.DEF, squad.DEF[0].code)).toStrictEqual(squad.subs);
        });
        test('the substitution targets for a starting midfielder should be all subs', () => {
            expect(getSubstitutionTargets(squad, Position.MID, squad.MID[0].code)).toStrictEqual(squad.subs);
        });
        test('the substitution targets for a starting forward should be all forward subs', () => {
            expect(getSubstitutionTargets(squad, Position.FWD, squad.FWD[0].code)).toStrictEqual(squad.subs.slice(1));
        });
        test('the substitution targets for a benched midfielder should be all players except self, keepers, and the starting foward', () => {
            const playerToSub = squad.subs[0];
            const actualResult = getSubstitutionTargets(squad, Position.MID, playerToSub);
            actualResult.sort();
            const expectedResult = squad.DEF.concat(
                squad.MID.concat(squad.FWD.filter((player) => squad.subs.includes(player.code)))
            )
                .map((player) => player.code)
                .filter((playerCode) => playerCode !== playerToSub);
            expectedResult.sort();
            expect(actualResult).toStrictEqual(expectedResult);
        });
        test('the substitution targets for a benched foward should be all players except self and keepers', () => {
            const playerToSub = squad.subs[1];
            const actualResult = getSubstitutionTargets(squad, Position.FWD, playerToSub);
            actualResult.sort();
            const expectedResult = squad.DEF.concat(squad.MID.concat(squad.FWD))
                .map((player) => player.code)
                .filter((playerCode) => playerCode !== playerToSub);
            expectedResult.sort();
            expect(actualResult).toStrictEqual(expectedResult);
        });
    });
});
