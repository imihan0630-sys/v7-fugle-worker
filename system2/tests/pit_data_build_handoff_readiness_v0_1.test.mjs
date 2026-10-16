import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildPitDataHandoffStage1ReadinessV0_1 as build}
 from '../runtime/pit_data_build_handoff_readiness_v0_1.mjs';

const load=p=>JSON.parse(readFileSync(p,'utf8'));
const real={
 handoff:load('system2/migration/evidence/S2_DATA_ISSUE1068_PIT_SOURCE_HANDOFF_20261016_V0_1.json'),
 a1:load('system2/migration/evidence/S2_DATA_ISSUE1068_NATIVE_122_A1_PERBAR_PIT_PHYSICAL_20261016_V0_1.json'),
 cfi:load('system2/evidence/S2_M09_REAL_30_NATIVE_CFI_INDEPENDENT_AUDIT_20261015_V0_1.json'),
 ca:load('system2/evidence/S2_M09_20261014_REAL_SIX_CA_NEGATIVE_EXPOSURE_20261015_V0_1.json')
};
async function fakeStage1(override={}){
 const b={schemaVersion:'S2_DAILY_SELECTION_READINESS_V0_1',
  marketDate:'2026-10-15',
  state:'DAILY_STRATEGY_INPUT_INCOMPLETE',ordinaryUniverseCount:1935,
  assessedCount:0,incompleteCount:1935,
  stage1PitInputPassedCount:0,stage1PitInputUnknownCount:1935,
  qualifiedNotSelectedCount:0,watchCount:0,rejectedCount:0,
  sourceInstrumentUniverseKind:'FOUR_DIGIT_SOURCE_MEMBERSHIP_NOT_CLASS_CERTIFIED',
  formallyPITCertifiedUniverseCount:null,
  perMarketPITInputCounts:{
   TWSE:{sourceCount:1000,stage1PitInputPassed:0,stage1PitInputUnknown:1000,
    rejected:0,watch:0,qualifiedNotSelected:0},
   TPEX:{sourceCount:935,stage1PitInputPassed:0,stage1PitInputUnknown:935,
    rejected:0,watch:0,qualifiedNotSelected:0},
  },
  unresolvedReasonCounts:[{code:'PIT_ORDINARY_EQUITY_INSTRUMENT_CLASS_UNVERIFIED',count:1935}],
  qualifiedUnrankedResearchRows:[],
  selectedCount:null,zeroPickDay:null,
  finalSelectionEligible:false,rankCapacityAuthorized:false,
  frozenDecisionWritten:false,cloudflareD1Writes:0,cloudflareR2Writes:0,
  ...override};
 return {...b,receiptHash:await sha256Hex(b)};
}
test('REAL DATA signed original SHA handoff: 0 PIT-proof 1935 UNKNOWN, never selected',async()=>{
 const r=await build(real);
 assert.equal(r.marketDate,'2026-10-15');
 assert.equal(r.sourceSecurityWindowCount,1935);
 assert.equal(r.pitEvidenceEligibleSymbolCount,0);
 assert.equal(r.pitEvidenceUnknownSymbolCount,1935);
 assert.equal(r.stage1ActuallyAssessedCount,null);
 assert.equal(r.selectedCount,null);assert.equal(r.zeroPickDay,null);
 assert.equal(r.frozenD1Written,false);assert.equal(r.shadowAuthorized,false);
 assert.equal(r.cloudflareD1Reads,0);assert.equal(r.cloudflareD1Writes,0);
 assert.match(r.receiptHash,/^[a-f0-9]{64}$/);
});
test('matching research-only Stage1 0 assessed is distinguishable from no actual Stage1',async()=>{
 const r=await build({...real,dailyStage1Readiness:await fakeStage1()});
 assert.equal(r.pitEvidenceUnknownSymbolCount,1935);
 assert.equal(r.stage1ActuallyAssessedCount,0);
 assert.equal(r.stage1ReadinessState,'DAILY_STRATEGY_INPUT_INCOMPLETE');
 assert.equal(r.independentStrategyPitAccepted,false);
 assert.equal(r.selectedCount,null);
});
test('clock-expired and blocked Stage1 remains source-blocked, not a zero pick',async()=>{
 const r=await build({...real,dailyStage1Readiness:await fakeStage1({
  state:'BLOCKED_SOURCE_NOT_SELECTION',
  ordinaryUniverseCount:null,assessedCount:null,incompleteCount:null,
  stage1PitInputPassedCount:null,stage1PitInputUnknownCount:null,
  perMarketPITInputCounts:null,qualifiedNotSelectedCount:null,
  watchCount:null,rejectedCount:null,
  unresolvedReasonCounts:[],qualifiedUnrankedResearchRows:[]
 })});
 assert.equal(r.stage1ActuallyAssessedCount,null);
 assert.equal(r.selectedCount,null);
});
test('re-signed false fully assessed or partial recovered Stage1 is rejected',async()=>{
 for(const patch of [
  {assessedCount:1,incompleteCount:1934,stage1PitInputPassedCount:1,stage1PitInputUnknownCount:1934},
  {ordinaryUniverseCount:1934},
  {stage1PitInputPassedCount:1},
  {qualifiedNotSelectedCount:1},
  {state:'QUALIFIED_RESEARCH_PENDING_RANK_CAPACITY_FROZEN'}
 ]){
  await assert.rejects(build({...real,dailyStage1Readiness:await fakeStage1(patch)}),
    /STAGE1_FALSE_PIT_OR_DENOMINATOR_PROMOTION/);
 }
});

test('re-signed TWSE/TPEX denominator cannot silently omit or add source securities',async()=>{
 for(const counts of [
  {TWSE:{sourceCount:999,stage1PitInputPassed:0,stage1PitInputUnknown:999,
    rejected:0,watch:0,qualifiedNotSelected:0},
   TPEX:{sourceCount:935,stage1PitInputPassed:0,stage1PitInputUnknown:935,
    rejected:0,watch:0,qualifiedNotSelected:0}},
  {TWSE:{sourceCount:1000,stage1PitInputPassed:1,stage1PitInputUnknown:999,
    rejected:0,watch:0,qualifiedNotSelected:0},
   TPEX:{sourceCount:935,stage1PitInputPassed:0,stage1PitInputUnknown:935,
    rejected:0,watch:0,qualifiedNotSelected:0}},
  {TWSE:{sourceCount:1000,stage1PitInputPassed:0,stage1PitInputUnknown:1000,
    rejected:0,watch:0,qualifiedNotSelected:0}},
 ]){
  await assert.rejects(build({...real,dailyStage1Readiness:await fakeStage1({
    perMarketPITInputCounts:counts,
  })}),/STAGE1_PER_MARKET_OR_UNKNOWN_REASON_INCONSISTENT/);
 }
});
test('a re-signed unknown Stage1 cannot hide false positive candidate, score or reason',async()=>{
 for(const patch of [
  {watchCount:1},
  {rejectedCount:1},
  {qualifiedUnrankedResearchRows:[{symbol:'2330',rank:1}]},
  {unresolvedReasonCounts:[]},
  {formallyPITCertifiedUniverseCount:1935},
  {sourceInstrumentUniverseKind:'ALL_ORDINARY_EQUITY_CERTIFIED'},
 ])await assert.rejects(build({...real,dailyStage1Readiness:await fakeStage1(patch)}),
  /STAGE1_PER_MARKET_OR_UNKNOWN_REASON_INCONSISTENT/);
});
test('a signed blocked-source row cannot hide per-market qualification behind null top counts',async()=>{
 const blocked={state:'BLOCKED_SOURCE_NOT_SELECTION',
  ordinaryUniverseCount:null,assessedCount:null,incompleteCount:null,
  stage1PitInputPassedCount:null,stage1PitInputUnknownCount:null,
  perMarketPITInputCounts:null,qualifiedNotSelectedCount:null,
  watchCount:null,rejectedCount:null,
  qualifiedUnrankedResearchRows:[],unresolvedReasonCounts:[]};
 const passed=await build({...real,dailyStage1Readiness:await fakeStage1(blocked)});
 assert.equal(passed.stage1ActuallyAssessedCount,null);
 for(const patch of [
  {stage1PitInputUnknownCount:1935},
  {perMarketPITInputCounts:{TWSE:{sourceCount:1935}}},
  {qualifiedUnrankedResearchRows:[{symbol:'2330',rank:1}]},
  {qualifiedNotSelectedCount:1},
  {watchCount:0},
 ])await assert.rejects(build({...real,dailyStage1Readiness:
  await fakeStage1({...blocked,...patch})}),/BLOCKED_SOURCE_FAKE_COUNTS/);
});
test('even a re-signed Stage1 changed-market date or frozen claim fails closed',async()=>{
 for(const patch of [
  {marketDate:'2026-10-14'},
  {selectedCount:0},
  {zeroPickDay:true},
  {frozenDecisionWritten:true},
  {rankCapacityAuthorized:true},
  {cloudflareD1Writes:1},
 ]){
  await assert.rejects(build({...real,dailyStage1Readiness:await fakeStage1(patch)}),
    /STAGE1_READINESS_HASH_DATE_OR_AUTHORITY_INVALID/);
 }
});
test('tampered signed Stage1 receipt and incorrect DATA original cannot pass',async()=>{
 const forged=await fakeStage1();
 forged.incompleteCount=0; // not re-signed
 await assert.rejects(build({...real,dailyStage1Readiness:forged}),
   /STAGE1_READINESS_HASH_DATE_OR_AUTHORITY_INVALID/);
 const data=structuredClone(real);data.handoff.handoffScope.pitEligibleSymbolCount=1935;
 await assert.rejects(build(data),/S2_PIT_SOURCE_HANDOFF_/);
});
test('BUILD consumer is read-only and references DATA original instead of fetching',()=>{
 const fs=readFileSync('system2/runtime/pit_data_build_handoff_readiness_v0_1.mjs','utf8');
 assert.doesNotMatch(fs,/\bfetch\s*\(|INSERT INTO|UPDATE\s+|DELETE FROM|api\.cloudflare\.com|git push/);
 assert.match(fs,/validatePitSourceHandoffV0_1/);
 assert.match(fs,/frozenD1Written:false/);
});
