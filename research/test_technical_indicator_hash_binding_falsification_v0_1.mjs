import assert from 'node:assert/strict';
import {buildGuardedTechnicalSnapshot} from './technical_indicator_source_guard_v0_1.mjs';

const rows=Array.from({length:50},(_,i)=>{
  const close=100+i;
  return {symbol:'TEST',date:new Date(Date.UTC(2026,0,i+1)).toISOString().slice(0,10),
    open:close,high:close+1,low:close-1,close,
    symbolSessionVerified:true,technicalContinuity:true,corporateActionContinuityResolved:true,
    observedRawBarIdentity:`raw-${i}`,sourceBarHash:`hash-${i}`,
    rawFieldProvenance:{high:'OBSERVED',low:'OBSERVED',close:'OBSERVED'}};
});
const context={symbol:'TEST',source:'SYNTHETIC',continuitySpace:'TECHNICAL_CONTINUITY',
  pointInTimeEligible:true,asOf:'2026-03-01T12:00:00+08:00',
  sourceAvailableAt:'2026-02-20T12:00:00+08:00',
  parentDecisionReceiptId:'parent',rawHistoryAdmissionReceiptId:'admission',
  continuityReceiptId:'continuity',symbolSessionContractVersion:'session-v1',
  continuityEngineVersion:'engine-v1'};
const original=buildGuardedTechnicalSnapshot(rows,context);
const altered=rows.map(row=>({...row}));
altered[49]={...altered[49],high:altered[49].high+20};
const changed=buildGuardedTechnicalSnapshot(altered,context);
assert.equal(original.dataQualityState,'VALID');
assert.equal(changed.dataQualityState,'VALID');
assert.equal(altered[49].sourceBarHash,rows[49].sourceBarHash);
assert.notDeepEqual(changed.kd,original.kd);
console.log('PASS: unchanged asserted source hash with changed observed high passes isolated guard and changes KD');
