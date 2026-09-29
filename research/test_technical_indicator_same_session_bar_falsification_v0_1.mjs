import assert from 'node:assert/strict';
import {buildGuardedTechnicalSnapshot} from './technical_indicator_source_guard_v0_1.mjs';

// Synthetic source assertions deliberately bypass any real session attestation.
const rows=Array.from({length:50},(_,i)=>{
  const close=100+i;
  return {symbol:'TEST',date:new Date(Date.UTC(2026,0,i+1)).toISOString().slice(0,10),
    open:close,high:close+1,low:close-1,close,
    symbolSessionVerified:true,technicalContinuity:true,corporateActionContinuityResolved:true,
    observedRawBarIdentity:`raw-${i}`,sourceBarHash:`digest-${i}`,
    rawFieldProvenance:{high:'OBSERVED',low:'OBSERVED',close:'OBSERVED'}};
});
const context={symbol:'TEST',source:'SYNTHETIC',continuitySpace:'TECHNICAL_CONTINUITY',
  pointInTimeEligible:true,asOf:'2026-02-19T09:00:00+08:00',
  sourceAvailableAt:'2026-02-18T16:00:00+08:00',
  parentDecisionReceiptId:'parent-v1',rawHistoryAdmissionReceiptId:'admission-v1',
  continuityReceiptId:'continuity-v1',symbolSessionContractVersion:'session-v1',
  continuityEngineVersion:'engine-v1'};
assert.equal(rows.at(-1).date,'2026-02-19');
const ordinary=buildGuardedTechnicalSnapshot(rows,context);
const futureRange=rows.map(row=>({...row}));
futureRange[49]={...futureRange[49],high:futureRange[49].high+20,
  observedRawBarIdentity:'raw-49-future',sourceBarHash:'digest-49-future'};
const replay=buildGuardedTechnicalSnapshot(futureRange,context);
assert.equal(ordinary.dataQualityState,'VALID');
assert.equal(replay.dataQualityState,'VALID');
assert.notDeepEqual(ordinary.kd,replay.kd);
assert.equal(ordinary.asOf,replay.asOf);
console.log('PASS: same-date full daily OHLC is admitted before session completion; synthetic witness only');
