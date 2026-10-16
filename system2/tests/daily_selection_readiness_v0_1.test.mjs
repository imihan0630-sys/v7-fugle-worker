import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildDailySelectionReadinessReceiptV0_1 as gate}
 from '../runtime/daily_selection_readiness_v0_1.mjs';
const hash='a'.repeat(64),stamp='2026-10-13T15:45:00Z';
const baseBridge={schemaVersion:'S2_SHARED_A1_SOURCE_LEDGER_BRIDGE_V0_1',
 state:'BLOCKED_NO_ELIGIBLE_SOURCE_LEDGER',marketDate:'2026-10-13',
 freezeAtUtc:stamp,blockers:['INDEPENDENT_SOURCE_AUDIT_NOT_122_OF_122'],
 actualSourcePairs:121,requiredSourcePairs:122,sourceReceiptHash:hash,
 auditReceiptHash:hash,auditedSourceOnly:false,sourceLedger:null,
 evaluation:null,eligibleSourceSymbolCount:null,selectedCount:null,zeroPickDay:null,
 strategyPitCertified:false,selectionAuthorized:false,
 frozenDecisionWritten:false,system1FormalRuntimeTouched:false,
 cloudflareD1Writes:0,cloudflareR2Writes:0};
async function ready({missing=true,qualified=false}={}){
 const symbols=['2330','2454'];
 const rows=symbols.map((symbol,i)=>({symbol,market:'TWSE',
  marketDate:'2026-10-13',companyName:i===0?'台積電':'聯發科',
  sourceRowHash:hash,close:100+i,observedAt:stamp,availableAt:stamp}));
 const rawLedger={schemaVersion:'S2_SOURCE_FIRST_PROSPECTIVE_LEDGER_V0_1',
  sourceState:'READY',marketDate:'2026-10-13',observedAt:stamp,
  sourceOrdinarySymbolCount:2,
  observations:rows,
  selectionState:'NOT_EXECUTED_REQUIRED_PIT_HISTORY_AND_CONTINUITY_MISSING'};
 const ledger={...rawLedger,ledgerSha256:await sha256Hex(rawLedger)};
 const observations=symbols.map((symbol,i)=>({
  symbol,state:qualified&&i===0?'QUALIFIED_NOT_SELECTED':missing?'INCOMPLETE':'WATCH',
  companyName: i===0?'台積電':'聯發科',market:'TWSE',
  strategyValidity:qualified&&i===0?'VALID':'INCOMPLETE',
  entryReadiness:qualified&&i===0?'BUY_ELIGIBLE':'BLOCKED',
  factorsHash:qualified&&i===0?hash:null,
  assessmentHash:qualified&&i===0?hash:null,
  sourceRowHash:hash,evaluatedClose:100+i,
  reasonCodes:qualified&&i===0?['TECHNICAL_SUPPORTIVE']:
    missing?['PIT_CORPORATE_ACTION_CONTINUITY_UNVERIFIED']:[],
 }));
 const incomplete=observations.filter(x=>x.state==='INCOMPLETE').length,
  qualifiedCount=observations.filter(x=>x.state==='QUALIFIED_NOT_SELECTED').length;
 const rawE={schemaVersion:'S2_SOURCE_FIRST_SM_EVALUATION_V0_1',
  marketDate:'2026-10-13',evaluationAtUtc:stamp,
  sourceLedgerHash:ledger.ledgerSha256,
  assessorPolicyId:'S2-ASSESSOR-SM-LAUNCH-001',
  assessorPolicyVersion:'0.1-LAUNCH',strategyId:'SHORT_MOMENTUM',
  strategyVersion:'V0.1-CONTRACT',universeCount:2,
  observations,assessedCount:2-incomplete,incompleteCount:incomplete,
  qualifiedNotSelectedCount:qualifiedCount,selectedCount:null,zeroPickDay:null,
  finalSelectionEnabled:false,ordersEnabled:false};
 const evaluation={...rawE,evaluationHash:await sha256Hex(rawE)};
 const rawA={schemaVersion:'S2_SHARED_OFFICIAL_A1_STAGE1_ADMISSION_V0_1',
  marketDate:'2026-10-13',evaluationAtUtc:stamp,
  currentSourceLedgerHash:ledger.ledgerSha256,
  sourceReceiptHash:hash,independentAuditHash:hash,
  evaluationHash:evaluation.evaluationHash,selectedCount:null,
  zeroPickDay:null,selectionAuthorized:false,durableFrozenDecisionWritten:false};
 const admission={...rawA,admissionHash:await sha256Hex(rawA),evaluation};
 return {...baseBridge,state:'STAGE1_RESEARCH_EXECUTED_PIT_CONTINUITY_GATED',
  sourceLedger:ledger,evaluation:admission,
  actualSourcePairs:122,auditedSourceOnly:true,blockers:[]};
}
test('121/122 is blocked, NEVER clean zero-pick or a candidate',async()=>{
 const r=await gate({bridge:baseBridge,runId:'888'});
 assert.equal(r.state,'BLOCKED_SOURCE_NOT_SELECTION');
 assert.equal(r.selectedCount,null);assert.equal(r.zeroPickDay,null);
 assert.equal(r.ordinaryUniverseCount,null);
 assert.match(r.receiptHash,/^[a-f0-9]{64}$/);
});
test('all unknown continuity: preserve two reasoned incomplete cases',async()=>{
 const r=await gate({bridge:await ready()});
 assert.equal(r.state,'DAILY_STRATEGY_INPUT_INCOMPLETE');
 assert.equal(r.incompleteCount,2);assert.equal(r.assessedCount,0);
 assert.deepEqual(r.unresolvedReasonCounts,[{
  code:'PIT_CORPORATE_ACTION_CONTINUITY_UNVERIFIED',count:2
 }]);
 assert.equal(r.qualifiedNotSelectedCount,0);
 assert.equal(r.zeroPickDay,null);
});
test('qualified research never becomes selected/ranked/frozen',async()=>{
 const r=await gate({bridge:await ready({missing:false,qualified:true})});
 assert.equal(r.state,'QUALIFIED_RESEARCH_PENDING_RANK_CAPACITY_FROZEN');
 assert.equal(r.qualifiedNotSelectedCount,1);
 assert.equal(r.qualifiedUnrankedResearchRows[0].companyName,'台積電');
 assert.equal(r.qualifiedUnrankedResearchRows[0].rank,null);
 assert.equal(r.finalSelectionEligible,false);
 assert.equal(r.selectedCount,null);assert.equal(r.frozenDecisionWritten,false);
});
test('clean zero research qualification still never invents authorized zero pick',async()=>{
 const r=await gate({bridge:await ready({missing:false})});
 assert.equal(r.state,'STRATEGY_ASSESSED_NO_QUALIFIED_RESEARCH_PENDING_FINAL_GATE');
 assert.equal(r.zeroPickDay,null);assert.equal(r.selectedCount,null);
});
test('a changed evaluation row with unchanged hash fails',async()=>{
 const b=await ready();b.evaluation.evaluation.observations[0].state='WATCH';
 await assert.rejects(()=>gate({bridge:b}),/HASH_LINEAGE_OR_STAGE1_AUTHORITY_INVALID/);
});
test('altered source ledger hash provenance fails',async()=>{
 const b=await ready();b.sourceLedger.observations[0].symbol='2317';
 await assert.rejects(()=>gate({bridge:b}),/HASH_LINEAGE_OR_STAGE1_AUTHORITY_INVALID/);
});
test('false frozen or selection flag on bridge fails',async()=>{
 const b=await ready();b.frozenDecisionWritten=true;
 await assert.rejects(()=>gate({bridge:b}),/BOUNDARY_OR_CLOCK_INVALID/);
});

async function resignStage1(bridge){
 const e=bridge.evaluation.evaluation;
 const {evaluationHash,...eBase}=e;
 e.evaluationHash=await sha256Hex(eBase);
 bridge.evaluation.evaluationHash=e.evaluationHash;
 const {admissionHash,evaluation,...aBase}=bridge.evaluation;
 bridge.evaluation.admissionHash=await sha256Hex(aBase);
}
async function resignAll(bridge){
 const {ledgerSha256,...sourceBase}=bridge.sourceLedger;
 bridge.sourceLedger.ledgerSha256=await sha256Hex(sourceBase);
 bridge.evaluation.currentSourceLedgerHash=bridge.sourceLedger.ledgerSha256;
 bridge.evaluation.evaluation.sourceLedgerHash=bridge.sourceLedger.ledgerSha256;
 await resignStage1(bridge);
}
test('re-signed Stage1 cannot borrow a different official source row hash',async()=>{
 const b=await ready({missing:false,qualified:true});
 b.evaluation.evaluation.observations[0].sourceRowHash='b'.repeat(64);
 await resignStage1(b);
 await assert.rejects(()=>gate({bridge:b}),/STAGE1_SOURCE_ROW_LINEAGE_INVALID/);
});
test('re-signed Stage1 cannot change the issuer, market or closing price',async()=>{
 for(const [field,value] of [
  ['companyName','冒用公司名稱'],['market','TPEX'],['evaluatedClose',999]
 ]){
  const b=await ready({missing:false,qualified:true});
  b.evaluation.evaluation.observations[0][field]=value;
  await resignStage1(b);
  await assert.rejects(()=>gate({bridge:b}),/STAGE1_SOURCE_ROW_LINEAGE_INVALID/);
 }
});
test('even a re-signed source ledger rejects first-known source clock after assessment',async()=>{
 const b=await ready();
 b.sourceLedger.observations[0].availableAt='2026-10-14T01:00:00Z';
 b.sourceLedger.observations[0].observedAt='2026-10-14T01:00:00Z';
 await resignAll(b);
 await assert.rejects(()=>gate({bridge:b}),/SOURCE_ROW_IDENTITY_OR_PIT_INVALID/);
});
test('re-signed evaluation cannot use a different assessor policy or future clock',async()=>{
 for(const [field,value] of [
  ['assessorPolicyVersion','0.2-UNAPPROVED'],
  ['evaluationAtUtc','2026-10-14T01:00:00Z'],
  ['sourceLedgerHash','b'.repeat(64)]
 ]){
  const b=await ready();
  b.evaluation.evaluation[field]=value;
  if(field==='evaluationAtUtc')b.evaluation.evaluationAtUtc=value;
  await resignStage1(b);
  await assert.rejects(()=>gate({bridge:b}),/HASH_LINEAGE_OR_STAGE1_AUTHORITY_INVALID/);
 }
});
test('a re-signed source ledger cannot relabel security while keeping stale assessor',async()=>{
 const b=await ready({missing:false,qualified:true});
 b.sourceLedger.observations[0].sourceRowHash='b'.repeat(64);
 await resignAll(b);
 await assert.rejects(()=>gate({bridge:b}),/STAGE1_SOURCE_ROW_LINEAGE_INVALID/);
});

test('scope does not create orders, D1 writes, public raw data or V8 formal changes',async()=>{
 const {readFile}=await import('node:fs/promises');
 const c=await readFile('system2/runtime/daily_selection_readiness_v0_1.mjs','utf8');
 assert.doesNotMatch(c,/INSERT INTO|api\.cloudflare\.com|git push/);
 assert.match(c,/frozenDecisionWritten:false/);
});

test('BUILD PIT receipt counts all sourced symbols by venue and keeps class uncertified',async()=>{
 const b=await ready({missing:true,qualified:true});
 b.sourceLedger.observations[1].market='TPEX';
 b.evaluation.evaluation.observations[1].market='TPEX';
 await resignAll(b);
 const r=await gate({bridge:b});
 assert.equal(r.ordinaryUniverseCount,2);
 assert.equal(r.stage1PitInputPassedCount,1);
 assert.equal(r.stage1PitInputUnknownCount,1);
 assert.equal(r.assessedCount+r.incompleteCount,r.ordinaryUniverseCount);
 assert.deepEqual(r.perMarketPITInputCounts,{
  TWSE:{sourceCount:1,stage1PitInputPassed:1,stage1PitInputUnknown:0,
        rejected:0,watch:0,qualifiedNotSelected:1},
  TPEX:{sourceCount:1,stage1PitInputPassed:0,stage1PitInputUnknown:1,
        rejected:0,watch:0,qualifiedNotSelected:0},
 });
 assert.equal(r.sourceInstrumentUniverseKind,
  'FOUR_DIGIT_SOURCE_MEMBERSHIP_NOT_CLASS_CERTIFIED');
 assert.equal(r.formallyPITCertifiedUniverseCount,null);
 assert.equal(r.selectedCount,null);
 assert.equal(r.zeroPickDay,null);
 assert.equal(r.frozenDecisionWritten,false);
});
test('a source-blocked 121/122 cannot manufacture either PIT count or zero-picked count',async()=>{
 const r=await gate({bridge:baseBridge});
 assert.equal(r.stage1PitInputPassedCount,null);
 assert.equal(r.stage1PitInputUnknownCount,null);
 assert.equal(r.perMarketPITInputCounts,null);
 assert.equal(r.formallyPITCertifiedUniverseCount,null);
 assert.equal(r.selectedCount,null);
});
test('re-signed INCOMPLETE without auditable reasons must fail closed',async()=>{
 for(const reasons of [[],[''],[' PIT_UNKNOWN'],['PIT_UNKNOWN '],['PIT_UNKNOWN\\nMISLEADING']]){
  const b=await ready();
  b.evaluation.evaluation.observations[0].reasonCodes=reasons;
  await resignStage1(b);
  await assert.rejects(()=>gate({bridge:b}),
   /INCOMPLETE_REASON_MISSING_OR_INVALID/);
 }
});
test('two missing PIT reasons are counted once per symbol, never as two blocked stocks',async()=>{
 const b=await ready();
 b.evaluation.evaluation.observations[0].reasonCodes=[
  'PIT_CFI_VERSION_UNVERIFIED','PIT_CA_NO_EVENT_UNKNOWN','PIT_CFI_VERSION_UNVERIFIED'];
 await resignStage1(b);
 const r=await gate({bridge:b});
 assert.equal(r.stage1PitInputUnknownCount,2);
 assert.deepEqual(r.unresolvedReasonCounts,[
  {code:'PIT_CA_NO_EVENT_UNKNOWN',count:1},
  {code:'PIT_CFI_VERSION_UNVERIFIED',count:1},
  {code:'PIT_CORPORATE_ACTION_CONTINUITY_UNVERIFIED',count:1}
 ]);
 assert.equal(r.selectedCount,null);
});
test('WATCH is assessed but does not gain rank, selection or formal PIT certification',async()=>{
 const r=await gate({bridge:await ready({missing:false})});
 assert.equal(r.stage1PitInputPassedCount,2);
 assert.equal(r.stage1PitInputUnknownCount,0);
 assert.equal(r.perMarketPITInputCounts.TWSE.watch,2);
 assert.equal(r.formallyPITCertifiedUniverseCount,null);
 assert.deepEqual(r.qualifiedUnrankedResearchRows,[]);
 assert.equal(r.rankCapacityAuthorized,false);
});
