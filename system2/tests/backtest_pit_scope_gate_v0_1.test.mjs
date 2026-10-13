import test from 'node:test';
import assert from 'node:assert/strict';
import {assessSystem2BacktestPITScopeV0_1 as inspect}
 from '../runtime/backtest_pit_scope_gate_v0_1.mjs';
const sha='a'.repeat(64),at='2025-06-10T12:00:00Z';
const row={symbol:'2330',market:'TWSE',marketDate:'2025-06-10',
 originalSourceHash:sha,firstKnownAt:'2025-06-10T07:00:00Z',
 availableAt:'2025-06-10T08:00:00Z',
 corporateActionVersionHistoryComplete:true,
 correctionAndCancellationHistoryComplete:true,
 caNoEventOrAdjustmentPITProof:true,
 companyActionVersionHash:sha,priceAdjustmentAndContinuityVerified:true,
 factorVersionAndRegimeKnownAtVerified:true};
const run=(observations=[row])=>inspect({
 studyId:'TEST_HISTORY_PIT',requestedDecisionAtUtc:at,observations});
test('complete PIT input only qualifies slice; never auto-certifies backtest alpha',async()=>{
 const r=await run();
 assert.equal(r.studyWidePITEligible,true);
 assert.equal(r.pitSliceEligibleCount,1);
 assert.equal(r.performanceCertificationAuthorized,false);
 assert.equal(r.backtestResearchExecutionPermitted,true);
});
test('unverified corporate revisions still allow diagnostic research not certified return',async()=>{
 const r=await run([{...row,correctionAndCancellationHistoryComplete:false}]);
 assert.equal(r.studyWidePITEligible,false);
 assert.equal(r.diagnosticOnlyCount,1);
 assert.equal(r.sliceDiagnostics[0].status,'DIAGNOSTIC_ONLY_NOT_CERTIFIABLE');
});
test('future publication cannot be backdated into historical winning trade',async()=>{
 const r=await run([{...row,availableAt:'2025-06-11T08:00:00Z'}]);
 assert.equal(r.pitSliceEligibleCount,0);
 assert.match(r.sliceDiagnostics[0].blockers[0],/SOURCE_NOT_PROVEN_KNOWN/);
});
test('sample coverage may be partially PIT-qualified but not study-wide certified',async()=>{
 const r=await run([row,{...row,symbol:'2454',
  companyActionVersionHash:null}]);
 assert.equal(r.pitSliceEligibleCount,1);
 assert.equal(r.diagnosticOnlyCount,1);
 assert.equal(r.studyWidePITEligible,false);
 assert.equal(r.performanceCertificationAuthorized,false);
});
test('duplicate symbols/date cannot inflate denominators',async()=>{
 await assert.rejects(()=>run([row,{...row}]),/DUPLICATE_STUDY_OBSERVATION/);
});
