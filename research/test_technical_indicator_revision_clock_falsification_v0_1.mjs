import assert from 'node:assert/strict';
import {buildGuardedTechnicalSnapshot} from './technical_indicator_source_guard_v0_1.mjs';

const rows=Array.from({length:50},(_,i)=>{
  const close=100+i;
  return {symbol:'TEST',date:new Date(Date.UTC(2026,0,i+1)).toISOString().slice(0,10),
    open:close,high:close+1,low:close-1,close,
    symbolSessionVerified:true,technicalContinuity:true,corporateActionContinuityResolved:true,
    observedRawBarIdentity:`raw-${i}-v1`,sourceBarHash:`digest-${i}-v1`,
    rawFieldProvenance:{high:'OBSERVED',low:'OBSERVED',close:'OBSERVED'}};
});
const context={symbol:'TEST',source:'SYNTHETIC',continuitySpace:'TECHNICAL_CONTINUITY',
  pointInTimeEligible:true,asOf:'2026-03-01T12:00:00+08:00',
  sourceAvailableAt:'2026-02-20T12:00:00+08:00',
  parentDecisionReceiptId:'parent-v1',rawHistoryAdmissionReceiptId:'admission-v1',
  continuityReceiptId:'continuity-v1',symbolSessionContractVersion:'session-v1',
  continuityEngineVersion:'engine-v1'};
const first=buildGuardedTechnicalSnapshot(rows,context);
const revision=rows.map(row=>({...row}));
revision[49]={...revision[49],high:revision[49].high+20,
  observedRawBarIdentity:'raw-49-v2',sourceBarHash:'digest-49-v2',
  firstKnownAt:'2026-03-02T09:00:00+08:00',capturedAt:'2026-03-02T09:05:00+08:00'};
const replay=buildGuardedTechnicalSnapshot(revision,context);
assert.equal(first.dataQualityState,'VALID');
assert.equal(replay.dataQualityState,'VALID');
assert.notDeepEqual(first.kd,replay.kd);
assert.ok(Date.parse(revision[49].firstKnownAt)>Date.parse(context.asOf));
assert.ok(Date.parse(revision[49].capturedAt)>Date.parse(context.asOf));
assert.equal(first.asOf,replay.asOf);
assert.equal(first.parentDecisionReceiptId,replay.parentDecisionReceiptId);
console.log('PASS: later revised bar with a changed asserted digest passes an earlier as-of guard; synthetic counterexample only');
