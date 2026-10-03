import assert from 'node:assert/strict';
import {
  evaluateDailyVolumeContinuity,
  comparableSessionSetHash,
  signedVolumeBalance,
  evaluatePivotVolumeEligibility
} from '../research/d02_daily_volume_continuity_adapter_v0_1.mjs';

const days=n=>Array.from({length:n},(_,i)=>\`2025-09-\${String(i+1).padStart(2,'0')}\`);
const expected=days(20);
const cutoff='2025-09-30T18:00:00+08:00';
const row=(d,v=100,close=100)=>({
  marketDate:d,
  volumeUnit:'SHARES',
  volumeShares:v,
  close,
  sourceFetchedAt:'2025-09-30T17:00:00+08:00'
});
const baseRows=expected.map((d,i)=>row(d,100+i,i%2?101:100));
const current=row('2025-09-30',220,102);

// F01 clean owner receipts.
let r=evaluateDailyVolumeContinuity({
  marketDate:'2025-09-30',featureKnownAt:cutoff,expectedPriorSessions:expected,
  sourceRows:baseRows,currentRow:current,corporateActionCoverageStatus:'COMPLETE'
});
assert.equal(r.continuityJoinStatus,'PASS');
assert.equal(r.comparableSessionCount,20);
assert.equal(r.pvDailyRvol20>0,true);

// F02 missing corporate-action coverage stays UNKNOWN.
r=evaluateDailyVolumeContinuity({
  marketDate:'2025-09-30',featureKnownAt:cutoff,expectedPriorSessions:expected,
  sourceRows:baseRows,currentRow:current,corporateActionCoverageStatus:'UNKNOWN'
});
assert.equal(r.continuityJoinStatus,'UNKNOWN_BLOCKED');
assert.ok(r.unknownReasons.includes('CORPORATE_ACTION_COVERAGE_UNKNOWN'));

// F03 late-known corporate-action correction cannot rewrite the decision-time state.
r=evaluateDailyVolumeContinuity({
  marketDate:'2025-09-30',featureKnownAt:cutoff,expectedPriorSessions:expected,
  sourceRows:baseRows,currentRow:current,corporateActionCoverageStatus:'COMPLETE',
  corporateActionReceipt:{
    eventFamily:'UNIT_SCALE',
    knownAt:'2025-10-01T09:00:00+08:00',
    unitScaleEffectiveDate:'2025-09-15'
  }
});
assert.equal(r.continuityJoinStatus,'UNKNOWN_BLOCKED');
assert.ok(r.unknownReasons.includes('CORPORATE_ACTION_LATE_KNOWN_AT_DECISION'));

// F04 3593-like UNIT_SCALE crossing without bridge is blocked.
r=evaluateDailyVolumeContinuity({
  marketDate:'2025-09-30',featureKnownAt:cutoff,expectedPriorSessions:expected,
  sourceRows:baseRows,currentRow:current,corporateActionCoverageStatus:'COMPLETE',
  corporateActionReceipt:{
    eventFamily:'UNIT_SCALE',
    knownAt:'2025-09-10T09:00:00+08:00',
    unitScaleEffectiveDate:'2025-09-15',
    unitScaleFactor:0.6
  }
});
assert.equal(r.continuityJoinStatus,'DATA_BLOCKED');
assert.ok(r.unknownReasons.includes('UNIT_SCALE_PATH_UNRESOLVED'));

// F05 8422-like large factor is still blocked even if a downstream boolean would not flip.
r=evaluateDailyVolumeContinuity({
  marketDate:'2025-09-30',featureKnownAt:cutoff,expectedPriorSessions:expected,
  sourceRows:baseRows,currentRow:current,corporateActionCoverageStatus:'COMPLETE',
  corporateActionReceipt:{
    eventFamily:'UNIT_SCALE',
    knownAt:'2025-09-10T09:00:00+08:00',
    unitScaleEffectiveDate:'2025-09-15',
    unitScaleFactor:10
  }
});
assert.ok(r.unknownReasons.includes('UNIT_SCALE_PATH_UNRESOLVED'));

// F06 8454-like SUPPLY_CHANGE: raw activity may pass, comparable participation may not.
const supply={
  eventFamily:'SUPPLY_CHANGE',
  knownAt:'2025-09-10T09:00:00+08:00',
  supplyBreakEffectiveDate:'2025-09-15'
};
r=evaluateDailyVolumeContinuity({
  marketDate:'2025-09-30',featureKnownAt:cutoff,expectedPriorSessions:expected,
  sourceRows:baseRows,currentRow:current,corporateActionCoverageStatus:'COMPLETE',
  corporateActionReceipt:supply,mode:'RAW_ACTIVITY'
});
assert.equal(r.continuityJoinStatus,'PASS');

r=evaluateDailyVolumeContinuity({
  marketDate:'2025-09-30',featureKnownAt:cutoff,expectedPriorSessions:expected,
  sourceRows:baseRows,currentRow:current,corporateActionCoverageStatus:'COMPLETE',
  corporateActionReceipt:supply,mode:'COMPARABLE_PARTICIPATION'
});
assert.equal(r.continuityJoinStatus,'UNKNOWN_BLOCKED');
assert.ok(r.unknownReasons.includes('SUPPLY_BREAK_MIXED_BASELINE'));

// F07 5314-like verified suspension pseudo-bar is rejected.
const exp2=expected.filter(d=>d!=='2025-09-14');
exp2.push('2025-09-21');
exp2.sort();
const rows2=exp2.map(d=>row(d));
rows2.push(row('2025-09-14',0,100));
r=evaluateDailyVolumeContinuity({
  marketDate:'2025-09-30',featureKnownAt:cutoff,expectedPriorSessions:exp2,
  sourceRows:rows2,currentRow:current,verifiedNonSymbolSessions:['2025-09-14'],
  corporateActionCoverageStatus:'COMPLETE'
});
assert.equal(r.continuityJoinStatus,'DATA_BLOCKED');
assert.ok(r.unknownReasons.includes('NON_SYMBOL_SESSION_BAR_PRESENT'));

// F08 factual zero volume remains in the exact expected-session denominator.
const zeroRows=baseRows.map((x,i)=>i===0?{...x,volumeShares:0}:x);
r=evaluateDailyVolumeContinuity({
  marketDate:'2025-09-30',featureKnownAt:cutoff,expectedPriorSessions:expected,
  sourceRows:zeroRows,currentRow:current,corporateActionCoverageStatus:'COMPLETE'
});
assert.equal(r.continuityJoinStatus,'PASS');
assert.equal(r.comparableSessionCount,20);

// F09 missing expected session is blocked; no older-row substitution.
r=evaluateDailyVolumeContinuity({
  marketDate:'2025-09-30',featureKnownAt:cutoff,expectedPriorSessions:expected,
  sourceRows:baseRows.slice(1),currentRow:current,corporateActionCoverageStatus:'COMPLETE'
});
assert.equal(r.continuityJoinStatus,'DATA_BLOCKED');
assert.equal(r.missingExpectedSessionCount,1);

// F10 duplicate source date is blocked.
r=evaluateDailyVolumeContinuity({
  marketDate:'2025-09-30',featureKnownAt:cutoff,expectedPriorSessions:expected,
  sourceRows:[...baseRows,baseRows[0]],currentRow:current,corporateActionCoverageStatus:'COMPLETE'
});
assert.equal(r.continuityJoinStatus,'DATA_BLOCKED');
assert.ok(r.unknownReasons.includes('DUPLICATE_SOURCE_DATE'));

// F11 comparable-session hash is deterministic to order/duplicates.
assert.equal(
  comparableSessionSetHash([...expected].reverse()),
  comparableSessionSetHash([...expected,expected[0]])
);

// F12 signed-volume algebra oracle.
const svb=signedVolumeBalance([
  {close:10,volumeShares:10},
  {close:11,volumeShares:20},
  {close:10,volumeShares:30},
  {close:10,volumeShares:50}
]);
assert.equal(svb,(20-30)/(20+30+50));

// F13 legal confirmed pivots + clean continuity are eligible.
const clean=evaluateDailyVolumeContinuity({
  marketDate:'2025-09-30',featureKnownAt:cutoff,expectedPriorSessions:expected,
  sourceRows:baseRows,currentRow:current,corporateActionCoverageStatus:'COMPLETE'
});
let p=evaluatePivotVolumeEligibility({
  continuityReceipt:clean,
  pivot1:{type:'HIGH',scale:'S1',confirmedAt:'2025-09-10T13:30:00+08:00'},
  pivot2:{type:'HIGH',scale:'S1',confirmedAt:'2025-09-20T13:30:00+08:00'},
  signalAt:'2025-09-20T14:00:00+08:00',
  priceContinuityStatus:'PASS'
});
assert.equal(p.pivotVolumeEligible,true);

// F14 legal pivots cannot rescue an invalid volume path.
const blocked=evaluateDailyVolumeContinuity({
  marketDate:'2025-09-30',featureKnownAt:cutoff,expectedPriorSessions:expected,
  sourceRows:baseRows.slice(1),currentRow:current,corporateActionCoverageStatus:'COMPLETE'
});
p=evaluatePivotVolumeEligibility({
  continuityReceipt:blocked,
  pivot1:{type:'HIGH',scale:'S1',confirmedAt:'2025-09-10T13:30:00+08:00'},
  pivot2:{type:'HIGH',scale:'S1',confirmedAt:'2025-09-20T13:30:00+08:00'},
  signalAt:'2025-09-20T14:00:00+08:00',
  priceContinuityStatus:'PASS'
});
assert.equal(p.pivotVolumeEligible,false);
assert.ok(p.unknownReasons.includes('VOLUME_CONTINUITY_NOT_PASS'));

console.log(JSON.stringify({
  status:'PASS',
  tests:14,
  contract:'D02_DAILY_VOLUME_CONTINUITY_ADAPTER_V0_1'
}));
