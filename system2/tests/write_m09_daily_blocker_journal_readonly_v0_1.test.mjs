import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildM09DailyBlockerJournalV0_1 as journal}
 from '../scripts/write_m09_daily_blocker_journal_readonly_v0_1.mjs';
const H='a'.repeat(64);
const clk='2026-10-15T06:00:00Z';
const signed=async(v,k)=>({...v,[k]:await sha256Hex(v)});
async function fixture(pairs=122,{preview=2,late=false}={}){
 const a=await signed({
  schemaVersion:'SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1',
  verdict:pairs===122?'ACCEPTED_SOURCE_INTEGRITY_ONLY':'BLOCKED_SOURCE_INCOMPLETE',
  marketDate:'2026-10-14',auditedAtUtc:'2026-10-15T05:40:00Z',
  sourceReceiptHash:H,sourceMarketDatePairsVerified:pairs,
  originalFilesRehashedAfterDownload:pairs,
  originalFilesDecompressedAndParsed:pairs,
  auditorSeparation:'INDEPENDENT_READBACK_PROCESS',
  strategyPitCertified:false,selectionAuthorized:false,frozenWritten:false,
  selectedCount:null,zeroPickDay:null,cloudflareD1Writes:0,cloudflareR2Writes:0
 },'auditHash');
 const state=pairs!==122||late?'BLOCKED_SOURCE_NOT_SELECTION':'DAILY_STRATEGY_INPUT_INCOMPLETE';
 const r=await signed({
  schemaVersion:'S2_DAILY_SELECTION_READINESS_V0_1',
  marketDate:a.marketDate,workflowRunId:'4321',
  observedAtUtc:'2026-10-15T05:41:00Z',
  independentSourceAuditHash:a.auditHash,originalSourceReceiptHash:a.sourceReceiptHash,
  sourcePairsObserved:pairs,sourcePairsRequired:122,
  state,blockers:['CA_PIT_UNKNOWN'],
  finalSelectionEligible:false,rankCapacityAuthorized:false,
  noEventCorporateActionAssumed:false,
  selectedCount:null,zeroPickDay:null,frozenDecisionWritten:false,
  durableFrozenReadbackVerified:false,cloudflareD1Writes:0,cloudflareR2Writes:0
 },'receiptHash');
 const w=await signed({
  schemaVersion:'S2_PRELIMINARY_PV_WATCH_V0_2',
  marketDate:a.marketDate,observedAtUtc:'2026-10-15T05:41:00Z',
  independentSourceAuditHash:a.auditHash,originalSourceReceiptHash:a.sourceReceiptHash,
  state:pairs!==122?'BLOCKED_SOURCE_INCOMPLETE':'PRELIMINARY_DAILY_OBSERVATION_NOT_FORMAL_SELECTION',
  blockers:['CORPORATE_ACTION_NOT_PIT_CERTIFIED'],
  watchlist:pairs===122?Array.from({length:preview},(_,i)=>({market:'TWSE',symbol:String(2330+i)})):[],
  selectedCount:null,zeroPickDay:null,
  finalSelectionAuthorized:false,frozenWritten:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0
 },'receiptHash');
 return {independentA1Audit:a,selectionReadiness:r,preliminaryWatch:w,
  observedAtUtc:clk,workflowRunId:'5678'};
}
test('genuine 122/122 source accepted only, current preliminary never Frozen/no-pick',async()=>{
 const f=await fixture(),r=await journal(f);
 assert.equal(r.sourceIntegrityAcceptedOnly,true);
 assert.equal(r.originalMarketDatePairsVerified,122);
 assert.equal(r.preliminaryObservationCount,2);
 assert.equal(r.state,'SOURCE_INTEGRITY_ONLY_STRATEGY_PIT_OR_FROZEN_BLOCKED');
 assert.equal(r.userFacingZeroPickClaimAllowed,false);
 assert.equal(r.selectedCount,null);assert.equal(r.zeroPickDay,null);
 assert.equal(r.isFrozenDecisionSnapshot,false);
 assert.equal(r.artifactRetentionDays,90);
 assert.equal(r.cloudflareD1Writes,0);
 const {journalHash,...base}=r;assert.equal(journalHash,await sha256Hex(base));
});
test('121/122 negative self-diagnostic records source-blocked truth, no synthetic picks',async()=>{
 const r=await journal(await fixture(121));
 assert.equal(r.state,'SOURCE_AUDIT_INCOMPLETE_NOT_A_SELECTION');
 assert.equal(r.sourceIntegrityAcceptedOnly,false);
 assert.equal(r.originalMarketDatePairsVerified,121);
 assert.equal(r.preliminaryObservationCount,0);
 assert.equal(r.zeroPickDay,null);
});
test('actual late A1 source with valid 122 pairs still not formal selection',async()=>{
 const r=await journal(await fixture(122,{late:true}));
 assert.equal(r.originalMarketDatePairsVerified,122);
 assert.equal(r.requiredBlockerCodes.includes('CA_PIT_UNKNOWN'),true);
 assert.equal(r.qualifiedAssessorFrozenAuthorized,false);
});
test('a single altered signed preview/code is denied',async()=>{
 const f=await fixture();
 f.preliminaryWatch.watchlist[0].symbol='9103';
 await assert.rejects(()=>journal(f),
  /S2_M09_BLOCKER_JOURNAL_SIGNED_READINESS_WATCH_LINEAGE_OR_AUTHORITY_INVALID/);
});
test('forged source audit count/clock cannot appear in 90d artifact',async()=>{
 const f=await fixture();f.independentA1Audit.sourceMarketDatePairsVerified=121;
 await assert.rejects(()=>journal(f),
  /S2_M09_BLOCKER_JOURNAL_INDEPENDENT_A1_AUDIT_OR_CLOCK_INVALID/);
 const q=await fixture();q.observedAtUtc='2026-10-15T05:35:00Z';
 await assert.rejects(()=>journal(q),
  /S2_M09_BLOCKER_JOURNAL_INDEPENDENT_A1_AUDIT_OR_CLOCK_INVALID/);
});
test('validly signed but inconsistent source lineage is denied',async()=>{
 const f=await fixture();
 f.selectionReadiness.independentSourceAuditHash='f'.repeat(64);
 const {receiptHash,...b}=f.selectionReadiness;
 f.selectionReadiness.receiptHash=await sha256Hex(b);
 await assert.rejects(()=>journal(f),
  /S2_M09_BLOCKER_JOURNAL_SIGNED_READINESS_WATCH_LINEAGE_OR_AUTHORITY_INVALID/);
});
test('zero-pick made-up value always fails even with valid signed SHA',async()=>{
 const f=await fixture();f.selectionReadiness.zeroPickDay=true;
 const {receiptHash,...b}=f.selectionReadiness;
 f.selectionReadiness.receiptHash=await sha256Hex(b);
 await assert.rejects(()=>journal(f),
  /S2_M09_BLOCKER_JOURNAL_SIGNED_READINESS_WATCH_LINEAGE_OR_AUTHORITY_INVALID/);
});
test('no blocker code is incompatible with preserving truth',async()=>{
 const f=await fixture();
 f.selectionReadiness.blockers=[];f.preliminaryWatch.blockers=[];
 for(const [o,k] of [[f.selectionReadiness,'receiptHash'],[f.preliminaryWatch,'receiptHash']]){
  o[k]=await sha256Hex(Object.fromEntries(Object.entries(o).filter(([x])=>x!==k)));
 }
 await assert.rejects(()=>journal(f),/S2_M09_BLOCKER_JOURNAL_MISSING_SOURCE_OR_PIT_BLOCKER/);
});
test('new workflow preserves 90-day distinct blocker artifact and main-only independent audit',async()=>{
 const s=await readFile('.github/workflows/system2-shared-official-a1-independent-audit.yml','utf8');
 assert.match(s,/M09 daily blocked-source and unknown-strategy nonselection journal/);
 assert.match(s,/s2-m09-daily-blocker-journal-/);
 assert.match(s,/retention-days: 90/);
 assert.match(s,/noEventMayBeClaimed|zeroPickDay/);
 assert.doesNotMatch(s,/wrangler deploy|contents: write|d1 execute/);
});
