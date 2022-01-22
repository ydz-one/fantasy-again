import { autoSub } from '.';
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

describe('autoSub', () => {
    let squad: Squad, didPlayerPlayMap: { [key: string]: boolean };
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
        didPlayerPlayMap = {
            gk1: true,
            gk2: true,
            def1: true,
            def2: true,
            def3: true,
            def4: true,
            def5: true,
            mid1: true,
            mid2: true,
            mid3: true,
            mid4: true,
            mid5: true,
            fwd1: true,
            fwd2: true,
            fwd3: true,
        };
    });

    test('should return the same squad if everyone played in the past GW', () => {
        expect(autoSub(squad, didPlayerPlayMap)).toStrictEqual(squad);
    });

    test('should return the same squad if only the subs did not play', () => {
        didPlayerPlayMap.gk2 = false;
        didPlayerPlayMap.def5 = false;
        didPlayerPlayMap.mid5 = false;
        didPlayerPlayMap.fwd3 = false;
        expect(autoSub(squad, didPlayerPlayMap)).toStrictEqual(squad);
    });

    test('if captain did not play and vice captain did, then vice captain should get the captain armband', () => {
        didPlayerPlayMap.mid2 = false;
        const expectedSquad = JSON.parse(JSON.stringify(squad));
        expectedSquad.captain = 'mid4';
        expectedSquad.viceCaptain = 'mid2';
        expectedSquad.subs = ['mid2', 'mid5', 'fwd3'];
        expect(autoSub(squad, didPlayerPlayMap)).toStrictEqual(expectedSquad);
    });

    test('should autoSub the GK if he did not play and the sub GK did', () => {
        didPlayerPlayMap.gk1 = false;
        const expectedSquad = JSON.parse(JSON.stringify(squad));
        expectedSquad.subGk = 'gk1';
        expect(autoSub(squad, didPlayerPlayMap)).toStrictEqual(expectedSquad);
    });

    test('should not autoSub the GK if both GK and sub GK did not play', () => {
        didPlayerPlayMap.gk1 = false;
        didPlayerPlayMap.gk2 = false;
        expect(autoSub(squad, didPlayerPlayMap)).toStrictEqual(squad);
    });

    test('three starting players, one in each non-GK position, who did not play should be subbed as normal if all subs played', () => {
        didPlayerPlayMap.def1 = false;
        didPlayerPlayMap.mid1 = false;
        didPlayerPlayMap.fwd1 = false;
        const expectedSquad = JSON.parse(JSON.stringify(squad));
        expectedSquad.subs = ['def1', 'mid1', 'fwd1'];
        expect(autoSub(squad, didPlayerPlayMap)).toStrictEqual(expectedSquad);
    });

    test('three starting players, one in each non-GK position, who did not play should be subbed as normal if all subs played, even if subs are in different positions compared to their respective starting players', () => {
        squad.subs = ['mid5', 'fwd3', 'def5'];
        didPlayerPlayMap.def1 = false;
        didPlayerPlayMap.mid1 = false;
        didPlayerPlayMap.fwd1 = false;
        const expectedSquad = JSON.parse(JSON.stringify(squad));
        expectedSquad.subs = ['def1', 'mid1', 'fwd1'];
        expect(autoSub(squad, didPlayerPlayMap)).toStrictEqual(expectedSquad);
    });

    test('two out of four starting defenders did not play - the first defender should be subbed for the first available sub, the second defender should be subbed for the first available defender sub', () => {
        squad.subs = ['mid5', 'fwd3', 'def5'];
        didPlayerPlayMap.def1 = false;
        didPlayerPlayMap.def2 = false;
        const expectedSquad = JSON.parse(JSON.stringify(squad));
        expectedSquad.subs = ['def1', 'fwd3', 'def2'];
        expect(autoSub(squad, didPlayerPlayMap)).toStrictEqual(expectedSquad);
    });

    test('one out of three starting defenders did not play, one midfielder did not play, and the defender subs did not play - the midfielder should be subbed and the defender should not be subbed', () => {
        squad.subs = ['def2', 'def3', 'fwd3'];
        didPlayerPlayMap.def2 = false;
        didPlayerPlayMap.def3 = false;
        didPlayerPlayMap.def4 = false;
        didPlayerPlayMap.mid3 = false;
        const expectedSquad = JSON.parse(JSON.stringify(squad));
        expectedSquad.subs = ['def2', 'def3', 'mid3'];
        expect(autoSub(squad, didPlayerPlayMap)).toStrictEqual(expectedSquad);
    });

    test('the only starting forward did not play, and the first forward sub did not play - the starting forward should be subbed for the second forward sub', () => {
        squad.subs = ['fwd1', 'def3', 'fwd3'];
        didPlayerPlayMap.fwd1 = false;
        didPlayerPlayMap.fwd2 = false;
        const expectedSquad = JSON.parse(JSON.stringify(squad));
        expectedSquad.subs = ['fwd1', 'def3', 'fwd2'];
        expect(autoSub(squad, didPlayerPlayMap)).toStrictEqual(expectedSquad);
    });

    test('the only two starting midfielders did not play, and two midfielder subs did not play - the first starting midfielder should be replaced by the only midfielder sub who played', () => {
        squad.subs = ['mid2', 'mid4', 'mid5'];
        didPlayerPlayMap.mid1 = false;
        didPlayerPlayMap.mid2 = false;
        didPlayerPlayMap.mid3 = false;
        didPlayerPlayMap.mid4 = false;
        const expectedSquad = JSON.parse(JSON.stringify(squad));
        expectedSquad.subs = ['mid2', 'mid4', 'mid1'];
        expect(autoSub(squad, didPlayerPlayMap)).toStrictEqual(expectedSquad);
    });

    test('two out of three starting defender did not play, one out of five starting midfielders did not play, the two starting forwards did not play, and all subs did not play except for one forward sub - the first non-playing starting midfielder should be replaced by the only forward sub who played', () => {
        squad.subs = ['def4', 'def3', 'fwd1'];
        didPlayerPlayMap.def2 = false;
        didPlayerPlayMap.def3 = false;
        didPlayerPlayMap.def4 = false;
        didPlayerPlayMap.def5 = false;
        didPlayerPlayMap.mid3 = false;
        didPlayerPlayMap.fwd2 = false;
        didPlayerPlayMap.fwd3 = false;
        const expectedSquad = JSON.parse(JSON.stringify(squad));
        expectedSquad.subs = ['def4', 'def3', 'mid3'];
        expect(autoSub(squad, didPlayerPlayMap)).toStrictEqual(expectedSquad);
    });

    test('the squad should remain the same if everyone did not play', () => {
        const updatedDidPlayerPlayMap: { [key: string]: boolean } = {};
        for (const playerCode in didPlayerPlayMap) {
            updatedDidPlayerPlayMap[playerCode] = false;
        }
        expect(autoSub(squad, updatedDidPlayerPlayMap)).toStrictEqual(squad);
    });
});
