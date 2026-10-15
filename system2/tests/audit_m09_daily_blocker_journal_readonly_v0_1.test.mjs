import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildM09DailyBlockerJournalV0_1 as build}
 from '../scripts/write_m09_daily_blocker_journal_readonly_v0_1.mjs';
import {auditM09DailyBlockerJournalV0_1 as audit}
 from '../scripts/audit_m09_daily_blocker_journal_readonly_v0_1.mjs';
const signed=async(b,key)=>({...b,[key]:await sha256Hex(b)});
async function fixture(){
 const a=await signed({schemaVersion:'SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1',
  verdict:'BLOCKED_SOURCE_INCOMPLETE',marketDate:'2026-10-14',
  sourceReceiptHash:'a'.repeat(64),auditedAtUtc:'2026-10-15T05:40:00Z',
  sourceMarketDatePairsVerified:121,originalFilesRehashedAfterDownload:121,
  originalFilesDecompressedAndParsed:121,
  auditorSeparation:'INDEPENDENT_READBACK_PROCESS',
  strategyPitCertified:false,selectionAuthorized:false,
  frozenWritten:false,selectedCount:null,zeroPickDay:null,
  cloudflareD1Writes:0,cloudflareR2Writes:0},'auditHash');
 const r=await signed({schemaVersion:'S2_DAILY_SELECTION_READINESS_V0_1',
  marketDate:a.marketDate,observedAtUtc:'2026-10-15T05:41:00Z',
  originalSourceReceiptHash:a.sourceReceiptHash,independentSourceAuditHash:a.auditHash,
  sourcePairsObserved:121,sourcePairsRequired:122,workflowRunId:'332',
  state:'BLOCKED_SOURCE_NOT_SELECTION',blockers:['A1_121_OF_122'],
  finalSelectionEligible:false,rankCapacityAuthorized:false,
  noEventCorporateActionAssumed:false,selectedCount:null,zeroPickDay:null,
  frozenDecisionWritten:false,durableFrozenReadbackVerified:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0},'receiptHash');
 const w=await signed({schemaVersion:'S2_PRELIMINARY_PV_WATCH_V0_2',
  marketDate:a.marketDate,observedAtUtc:'2026-10-15T05:41:00Z',
  originalSourceReceiptHash:a.sourceReceiptHash,independentSourceAuditHash:a.auditHash,
  state:'BLOCKED_SOURCE_INCOMPLETE',blockers:['SOURCE_UNAVAILABLE'],
  watchlist:[],selectedCount:null,zeroPickDay:null,
  finalSelectionAuthorized:false,frozenWritten:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0},'receiptHash');
 const j=await build({independentA1Audit:a,selectionReadiness:r,
  preliminaryWatch:w,workflowRunId:'221',observedAtUtc:'2026-10-15T05:43:00Z'});
 return {journal:j,independentA1Audit:a,selectionReadiness:r,
  preliminaryWatch:w,upstreamRunId:'221',now:'2026-10-15T05:45:00Z'};
}
test('independent replay hashes three original receipts and exact journal once',async()=>{
 const input=await fixture(),res=await audit(input);
 assert.equal(res.rehashedUpstreamReceiptCount,3);
 assert.equal(res.fullJournalReproduced,true);
 assert.equal(res.classifiedAsFormalZeroPick,false);
 assert.equal(res.classifiedAsFrozen,false);
 assert.equal(res.cloudflareD1Writes,0);
 const {auditHash,...b}=res;assert.equal(auditHash,await sha256Hex(b));
});
test('cannot borrow different GH upstream run or false prior timestamp',async()=>{
 const input=await fixture();input.upstreamRunId='223';
 await assert.rejects(()=>audit(input),/S2_M09_BLOCKER_INDEPENDENT_UNTRUSTED_UPSTREAM_ID_OR_FORMAL_BOUNDARY/);
 const second=await fixture();second.now='2026-10-15T05:40:00Z';
 await assert.rejects(()=>audit(second),/S2_M09_BLOCKER_INDEPENDENT_UNTRUSTED_UPSTREAM_ID_OR_FORMAL_BOUNDARY/);
});
test('journal data mutation with unchanged hash fails',async()=>{
 const input=await fixture();input.journal={...input.journal,preliminaryObservationCount:12};
 await assert.rejects(()=>audit(input),/S2_M09_BLOCKER_INDEPENDENT_JOURNAL_HASH_TAMPERED/);
});
test('mutating original readiness evidence cannot pass independently',async()=>{
 const input=await fixture();input.selectionReadiness.sourcePairsObserved=122;
 await assert.rejects(()=>audit(input),/S2_M09_BLOCKER_JOURNAL_SIGNED_READINESS_WATCH_LINEAGE_OR_AUTHORITY_INVALID/);
});
test('forged but newly signed journal with wrong blocker code also cannot pass',async()=>{
 const input=await fixture();
 const b={...input.journal,requiredBlockerCodes:['FORGED_NO_EVENT_CLEAR']};
 const {journalHash,...payload}=b;b.journalHash=await sha256Hex(payload);input.journal=b;
 await assert.rejects(()=>audit(input),/S2_M09_BLOCKER_INDEPENDENT_INDEPENDENT_REPLAY_MISMATCH/);
});
test('independent readback workflow cannot create Frozen D1 or claim zero picks',async()=>{
 const yaml=await readFile('.github/workflows/system2-m09-daily-blocker-independent-audit.yml','utf8');
 assert.match(yaml,/workflow_run:/);
 assert.match(yaml,/System2 Shared Official A1 Independent Source Audit/);
 assert.match(yaml,/s2-m09-daily-blocker-journal-/);
 assert.match(yaml,/system2-shared-official-a1-independent-audit-/);
 assert.match(yaml,/contents: read/);assert.match(yaml,/actions: read/);
 assert.doesNotMatch(yaml,/schedule:|secrets\.|contents: write|wrangler deploy|d1 execute/);
});
