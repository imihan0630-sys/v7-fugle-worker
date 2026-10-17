import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {makeA1GithubOriginV0_1} from '../scripts/record_shared_a1_github_schedule_origin_v0_1.mjs';
import {buildA1DualAcceptanceV0_1} from '../runtime/a1_source_schedule_dual_acceptance_v0_1.mjs';
import {witnessDailySourceOriginV0_1 as witness}
 from '../migration/issue1068_a1_compact_daily_origin_witness_v0_1.mjs';
const REPO='imihan0630-sys/v7-fugle-worker';
const SRC='.github/workflows/system2-shared-official-a1-incremental-readonly.yml';
const AUD='.github/workflows/system2-shared-official-a1-independent-audit.yml';
const SHA='a'.repeat(40);
async function specimen({day='2026-10-16',late=true,event='schedule'}={}){
 const src=day==='2026-10-16'? {
  created:late?'2026-10-16T16:42:40Z':'2026-10-16T12:17:00Z',
  started:late?'2026-10-16T16:42:44Z':'2026-10-16T12:17:10Z',
  completed:late?'2026-10-16T16:44:32Z':'2026-10-16T12:18:00Z',
  audit:late?'2026-10-16T16:44:57.000Z':'2026-10-16T12:19:00.000Z',
  auditCreated:late?'2026-10-16T16:44:34Z':'2026-10-16T12:18:20Z',
  stage:late?'2026-10-16T16:45:05.000Z':'2026-10-16T12:19:30.000Z'
 }:{
  created:'2026-10-19T12:20:00Z',
  started:'2026-10-19T12:20:05Z',
  completed:'2026-10-19T12:22:00Z',
  auditCreated:'2026-10-19T12:22:20Z',
  audit:'2026-10-19T12:23:00.000Z',
  stage:'2026-10-19T12:23:10.000Z'
 };
 const sr={id:38934081985,repository:{full_name:REPO},head_repository:{full_name:REPO},
  name:'System2 Shared Official TWSE TPEx A1 Incremental (READ ONLY)',
  path:SRC,event,head_branch:'main',head_sha:SHA,status:'completed',
  conclusion:'success',run_attempt:1,created_at:src.created,run_started_at:src.started};
 const sj={id:117085046435,run_id:sr.id,name:'current_source',
  status:'completed',conclusion:'success',started_at:src.started,completed_at:src.completed};
 const ar={id:38934321405,repository:{full_name:REPO},head_repository:{full_name:REPO},
  name:'System2 Shared Official A1 Independent Source Audit (READ ONLY)',
  path:AUD,event:'workflow_run',head_branch:'main',head_sha:SHA,
  status:'completed',conclusion:'success',created_at:src.auditCreated};
 const origin=await makeA1GithubOriginV0_1({
  eventName:event,event:event==='schedule'?{schedule:'15 12 * * 1-5'}:{},
  runId:sr.id,runAttempt:1,codeSha:SHA
 });
 const base={schemaVersion:'SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1',
  marketDate:day,verdict:'ACCEPTED_SOURCE_INTEGRITY_ONLY',
  manifestSha256:'b'.repeat(64),sourceReceiptHash:'c'.repeat(64),
  auditedAtUtc:src.audit,sourceMarketDatePairsVerified:122,
  originalFilesRehashedAfterDownload:122,originalFilesDecompressedAndParsed:122,
  officialCalendarTradingDatesVerified:61,
  auditorSeparation:'INDEPENDENT_READBACK_PROCESS',
  selectionAuthorized:false,strategyPitCertified:false,selectedCount:null,
  zeroPickDay:null,frozenWritten:false};
 const auditReceipt={...base,auditHash:await sha256Hex(base)};
 const dual=await buildA1DualAcceptanceV0_1({
  origin,sourceRun:sr,sourceJob:sj,
  sourceReceipt:{state:'SOURCE_OBSERVED_UNAUDITED',marketDate:day,plannedPairs:122,validatedPairs:122},
  independentAudit:auditReceipt,
  stage1Summary:{marketDate:day,freezeAtUtc:src.stage,
   state:'STAGE1_RESEARCH_EXECUTED_PIT_CONTINUITY_GATED',
   selectedCount:null,zeroPickDay:null,selectionAuthorized:false,frozenDecisionWritten:false},
  observedAtUtc:day==='2026-10-16'?'2026-10-17T00:30:00.000Z':'2026-10-19T15:20:00.000Z'
 });
 return {auditRun:ar,sourceRun:sr,sourceJob:sj,
  auditReceipt,dualReceipt:dual};
}
test('realistic 10/16 20:15 schedule late: signed pair and GH run prove root but T cut remains false',async()=>{
 const f=await specimen();const x=await witness(f);
 assert.equal(x.sourceRootWasScheduled,true);
 assert.equal(x.sourceRootScheduleExpression,'15 12 * * 1-5');
 assert.equal(x.sourceGitHubEnqueueDelayMinutes,267.667);
 assert.equal(x.sourceSchedule15mSloMet,false);
 assert.equal(x.sourceOriginalMarketDatePairsIndependentlyAudited,122);
 assert.equal(x.sourceAndAuditBeforePreferredCut,false);
 assert.equal(x.completedScheduledSourceToBUILDConsumerCertified,false);
 assert.equal(x.original122SourceBytesRehashedInThisCompactJob,false);
 assert.equal(x.selectedCount,null);assert.equal(x.frozenD1Written,false);
 const {receiptHash,...payload}=x;assert.equal(receiptHash,await sha256Hex(payload));
});
test('new 2026-10-19 physical-shaped T can be on time but never claims BUILD/Frozen',async()=>{
 const x=await witness(await specimen({day:'2026-10-19'}));
 assert.equal(x.marketDate,'2026-10-19');
 assert.equal(x.sourceAndAuditBeforePreferredCut,true);
 assert.equal(x.sourceRootWasScheduled,true);
 assert.equal(x.sourceSchedule15mSloMet,true);
 assert.equal(x.completedScheduledSourceToBUILDConsumerCertified,false);
 assert.equal(x.stage1ActualUsedInputPITAEligible,false);
});
test('source origin push is never counted as scheduled even if source 122/122',async()=>{
 const x=await witness(await specimen({event:'push'}));
 assert.equal(x.sourceRootWasScheduled,false);
 assert.equal(x.sourceSchedule15mSloMet,null);
 assert.equal(x.sourceRootScheduleExpression,null);
});
test('audit event manual, wrong head/repo/path, source run status fail-closed',async()=>{
 const a=await specimen();a.auditRun.event='workflow_dispatch';
 await assert.rejects(()=>witness(a),/GH_NATIVE_EXACT_SOURCE_AUDIT_JOB_IDENTITY/);
 const b=await specimen();b.sourceRun.head_sha='b'.repeat(40);
 await assert.rejects(()=>witness(b),/GH_NATIVE_EXACT_SOURCE_AUDIT_JOB_IDENTITY/);
 const c=await specimen();c.auditRun.repository.full_name='another/repo';
 await assert.rejects(()=>witness(c),/GH_NATIVE_EXACT_SOURCE_AUDIT_JOB_IDENTITY/);
});
test('tampered SHA, incorrect market date, or source 121/122 never accepted',async()=>{
 const a=await specimen();a.auditReceipt.marketDate='2026-10-15';
 await assert.rejects(()=>witness(a),/SIGNED_EXACT_SOURCE_AUDIT_REJECTED/);
 const b=await specimen();b.auditReceipt.sourceMarketDatePairsVerified=121;
 await assert.rejects(()=>witness(b),/SIGNED_EXACT_SOURCE_AUDIT_REJECTED/);
 const c=await specimen();c.dualReceipt={...c.dualReceipt,sourceRunId:1};
 await assert.rejects(()=>witness(c),/SIGNED_DUAL_NATIVE_RUN_ID_CLOCK_REJECTED/);
});
test('upstream dual signed cron time does not override native GH source clock',async()=>{
 const a=await specimen();
 a.sourceRun.created_at='2026-10-16T12:15:00Z';
 await assert.rejects(()=>witness(a),/SIGNED_DUAL_NATIVE_RUN_ID_CLOCK_REJECTED/);
 const b=await specimen();
 b.dualReceipt={...b.dualReceipt,scheduler:{...b.dualReceipt.scheduler,cronExpression:'45 15 * * 1-5'}};
 await assert.rejects(()=>witness(b),/SIGNED_DUAL_NATIVE_RUN_ID_CLOCK_REJECTED/);
});
test('PR replay and natural audit-child both avoid new Cron, provider GET, D1 and V8 formal',async()=>{
 const [w,s]=await Promise.all([
  readFile('.github/workflows/system2-data-a1-compact-daily-origin-witness.yml','utf8'),
  readFile('system2/scripts/run_issue1068_a1_compact_daily_origin_witness_readonly_v0_1.mjs','utf8')
 ]);
 assert.match(w,/^  pull_request:/m);
 assert.match(w,/^  workflow_run:/m);
 assert.doesNotMatch(w,/^  schedule:/m);
 assert.match(w,/actions\/download-artifact@v4/);
 assert.doesNotMatch(w,/cloudflare\.com|wrangler deploy|secrets\./);
 assert.match(w,/contents: read/);
 assert.doesNotMatch(s,/https:\/\/api\.twse\.com\.tw|tpex\.org\.tw|api\.cloudflare\.com/);
});
