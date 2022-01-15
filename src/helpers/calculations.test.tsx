import { Position, Squad } from '../types';
import { getSubstitutionTargets } from './calculations';

describe('getSubstitutionTargets', () => {
    let squad: Squad;
    beforeEach(() => {
        squad = {
            GK: [
                {
                    code: '58376',
                    buyPrice: 45,
                },
                {
                    code: '131897',
                    buyPrice: 45,
                },
            ],
            DEF: [
                {
                    code: '169187',
                    buyPrice: 75,
                },
                {
                    code: '156074',
                    buyPrice: 45,
                },
                {
                    code: '220627',
                    buyPrice: 45,
                },
                {
                    code: '244723',
                    buyPrice: 40,
                },
                {
                    code: '214048',
                    buyPrice: 40,
                },
            ],
            MID: [
                {
                    code: '170137',
                    buyPrice: 55,
                },
                {
                    code: '118748',
                    buyPrice: 120,
                },
                {
                    code: '178186',
                    buyPrice: 65,
                },
                {
                    code: '54694',
                    buyPrice: 120,
                },
                {
                    code: '40845',
                    buyPrice: 45,
                },
            ],
            FWD: [
                {
                    code: '200439',
                    buyPrice: 60,
                },
                {
                    code: '78830',
                    buyPrice: 105,
                },
                {
                    code: '165153',
                    buyPrice: 95,
                },
            ],
            subs: ['214048', '40845', '165153'],
            subGk: '131897',
            captain: '118748',
            viceCaptain: '54694',
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
            squad.subs = ['244723', '214048', '165153'];
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
            squad.subs = ['178186', '54694', '40845'];
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
            squad.subs = ['40845', '78830', '165153'];
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
