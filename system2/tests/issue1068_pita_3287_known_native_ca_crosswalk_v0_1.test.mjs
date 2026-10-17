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


import {classify3287KnownExdivWindowExposureV0_1 as exposure}
 from '../migration/issue1068_pita_3287_known_native_ca_crosswalk_v0_1.mjs';
import {CURRENT_LAUNCH_FACTORS}
 from '../runtime/pita_short_momentum_used_input_manifest_v0_1.mjs';
// Genuine 61 trading dates physically observed in original source Artifact
// #12060640574, 2026-10-16. This is a fixed reference for NON-AUTHORIZING
// source-window tests; the actual GH physical workflow re-reads the originals.
const original61Dates=`2026-07-21 2026-07-22 2026-07-23 2026-07-24
2026-07-27 2026-07-28 2026-07-29 2026-07-30 2026-07-31
2026-08-03 2026-08-04 2026-08-05 2026-08-06 2026-08-07
2026-08-10 2026-08-11 2026-08-12 2026-08-13 2026-08-14
2026-08-17 2026-08-18 2026-08-19 2026-08-20 2026-08-21
2026-08-24 2026-08-25 2026-08-26 2026-08-27 2026-08-28
2026-08-31 2026-09-01 2026-09-02 2026-09-03 2026-09-04
2026-09-07 2026-09-08 2026-09-09 2026-09-10 2026-09-11
2026-09-14 2026-09-15 2026-09-16 2026-09-17 2026-09-18
2026-09-21 2026-09-22 2026-09-23 2026-09-24 2026-09-29
2026-09-30 2026-10-01 2026-10-02 2026-10-05 2026-10-06
2026-10-07 2026-10-08 2026-10-12 2026-10-13 2026-10-14
2026-10-15 2026-10-16`.trim().split(/\s+/);
test('3287 original 61-date window contains one known exdiv crossing affecting exactly three 60d raw-price inputs',()=>{
 const r=exposure({dates:original61Dates});
 assert.equal(r.knownEventIndex,26);
 assert.equal(r.priorEventIndex,25);
 assert.equal(r.postEventTradingSessionCount,34);
 assert.deepEqual(r.priceMetricsCrossingKnownExdiv,['ma60','ret60','priorHigh60']);
 const crossing=new Set(r.priceMetricsCrossingKnownExdiv);
 const actualMandatory=new Set(CURRENT_LAUNCH_FACTORS.flatMap(x=>x.mandatoryMetrics));
 for(const id of crossing) assert.ok(actualMandatory.has(id),id+' must remain a real BUILD-required metric');
 assert.equal(r.metricSourceWindows.length,19);
 const expectedNonCross=['ma5','ma10','ma20','ret20','priorHigh20','priorLow20',
  'atr14Pct','volatility20','distanceToMa20','currentCandleShape'];
 for(const id of expectedNonCross)assert.equal(
  r.metricSourceWindows.find(x=>x.metricId===id)?.crossesKnownNativeExdivPriceBoundary,
  false,id);
 for(const r0 of r.metricSourceWindows){
  assert.equal(r0.allRelevantCorporateActionsIndependentlyExcluded,false);
  assert.equal(r0.fullFeaturePriceContinuityAudited,false);
  if(r0.sourceKind!=='PRICE')assert.equal(r0.crossesKnownNativeExdivPriceBoundary,false);
 }
 assert.equal(r.fullPitaFactorAuditAccepted,false);
 assert.equal(r.strategyScoringAuthorized,false);
 assert.equal(r.cannotInferNoOtherCorporateAction,true);
});
test('3287 known event cannot be silently shifted, skipped or interpreted as full CA negative proof',()=>{
 const variants=[
  x=>x.pop(),
  x=>x[0]='2026-07-20',
  x=>x[60]='2026-10-15',
  x=>x[1]=x[0],
  x=>x[26]='2026-08-27',
  x=>x[25]='2026-08-24',
  x=>x[10]='2026-13-01',
  x=>x[12]='2026-02-30',
  x=>{x[25]='2026-08-27';x[26]='2026-08-25';}
 ];
 for(const mutate of variants){
  const x=[...original61Dates];mutate(x);
  assert.throws(()=>exposure({dates:x}),/S2_3287_KNOWN_CA_/);
 }
 assert.throws(()=>exposure({dates:original61Dates,knownEventDate:'2026-09-16'}),/S2_3287_KNOWN_CA_/);
 assert.throws(()=>exposure({dates:original61Dates,priorSession:'2026-08-24'}),/S2_3287_KNOWN_CA_/);
});
