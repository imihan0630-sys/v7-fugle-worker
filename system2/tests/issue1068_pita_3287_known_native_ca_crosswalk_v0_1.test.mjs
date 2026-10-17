// Negative contract tests; full source ZIP-bound positive replay runs
// in the dedicated READ ONLY action, not from synthetic fixtures.
import test from 'node:test';
import assert from 'node:assert/strict';
import {verify3287NativeDividendBoundary as verify}
 from '../migration/issue1068_pita_3287_known_native_ca_crosswalk_v0_1.mjs';
const base=()=>({
 before:{date:'2026-08-25',symbol:'3287',close:'39.00',nextDayReference:'37.50'},
 after:{date:'2026-08-26',symbol:'3287',close:'37.00',nativeChangeLabel:'除息 '},
 caRow:['115/08/26','3287','廣寰科   ','39.00','37.50','0.000000',
 '1.500000','1.500000','除息','41.25','33.75','37.50','37.50',
 '1.50000000','0.00000000']
});
test('known official dividend ratio is only research crosswalk, not adjusted strategy or PIT',()=>{
 const v=verify(base());
 assert.equal(v.cashDividendPerShare,1.5);
 assert.equal(v.exchangeOfficialExDividendReference,37.5);
 assert.ok(Math.abs(v.originalRawReturnPct-(-5.128205128205132))<1e-8);
 assert.ok(Math.abs(v.officialReferenceReturnPct-(-1.3333333333333308))<1e-8);
 assert.equal(v.candidateReferenceRatio,37.5/39);
 for(const k of ['candidateAdjustmentFormulaApproved','authoritativeOtherActionsExcluded',
  'full61AdjustedPricesCertified','currentPitaFullUsedInputCertified'])
   assert.equal(v[k],false,k);
});
test('16 independent falsifications reject bad code, date, price, CA, clocks',()=>{
 const changes=[
 x=>x.caRow[0]='115/08/25',
 x=>x.caRow[1]='2330',
 x=>x.caRow[2]='其他公司',
 x=>x.caRow[3]='40.00',
 x=>x.caRow[4]='38.00',
 x=>x.caRow[6]='0',
 x=>x.caRow[8]='除權',
 x=>x.caRow[13]='1.00',
 x=>x.before.date='2026-08-24',
 x=>x.before.nextDayReference='39.00',
 x=>x.after.date='2026-08-27',
 x=>x.after.close='38.00',
 x=>x.after.nativeChangeLabel='+0.10',
 x=>x.caObserved='2026-10-17T00:00:00.000Z',
 x=>x.todayObserved='2026-10-16T14:00:00.000Z',
 x=>x.cut='2026-10-17T12:00:00.000Z'
 ];
 for(const fn of changes){const x=base();fn(x);assert.throws(()=>verify(x),/S2_3287_KNOWN_CA_/)}
});
