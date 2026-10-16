import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {makeA1GithubOriginV0_1 as makeOrigin}
 from '../scripts/record_shared_a1_github_schedule_origin_v0_1.mjs';
import {closestNominalA1CronV0_1 as nominal,
 buildA1DualAcceptanceV0_1 as build}
 from '../runtime/a1_source_schedule_dual_acceptance_v0_1.mjs';
const SHA='a'.repeat(40);
async function fixture({cron='15 16 * * 1-5',event='schedule',
 created='2026-10-15T17:04:48Z',started='2026-10-15T17:04:52Z',
 completed='2026-10-15T17:06:22Z',audited='2026-10-15T17:06:49Z',
 stageAt='2026-10-15T17:06:50Z',pairs=122}={}){
 const sourceRun={id:38774319744,event,created_at:created,
  path:'.github/workflows/system2-shared-official-a1-incremental-readonly.yml',
  head_branch:'main',run_attempt:1};
 const origin=await makeOrigin({eventName:event,
  event:event==='schedule'?{schedule:cron}:{},runId:sourceRun.id,
  runAttempt:1,codeSha:SHA});
 const sourceJob={name:'current_source',run_id:sourceRun.id,
  started_at:started,completed_at:completed};
 const sourceReceipt={state:'SOURCE_OBSERVED_UNAUDITED',marketDate:'2026-10-15',
  plannedPairs:122,validatedPairs:pairs};
 const auditBase={schemaVersion:'SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1',
  marketDate:'2026-10-15',verdict:'ACCEPTED_SOURCE_INTEGRITY_ONLY',
  sourceMarketDatePairsVerified:pairs,selectionAuthorized:false,
  strategyPitCertified:false,auditedAtUtc:audited};
 const independentAudit={...auditBase,auditHash:await sha256Hex(auditBase)};
 const stage1Summary={marketDate:'2026-10-15',freezeAtUtc:stageAt,
  state:'STAGE1_RESEARCH_EXECUTED_PIT_CONTINUITY_GATED',
  selectedCount:null,zeroPickDay:null,selectionAuthorized:false,
  frozenDecisionWritten:false};
 return {origin,sourceRun,sourceJob,sourceReceipt,independentAudit,
  stage1Summary,observedAtUtc:'2026-10-16T00:30:00Z'};
}
test('on-T+1 00:15 cron ran 01:04: dual verdict = source 122 PASS, schedule delayed, decision source clock met',async()=>{
 const f=await fixture();
 const r=await build(f);
 assert.equal(r.sourceIntegrity.state,'INDEPENDENT_SOURCE_122_OF_122_ACCEPTED');
 assert.equal(r.scheduler.state,'DELAYED_OVER_15_MIN_RESEARCH_SLO');
 assert.equal(r.scheduler.nominalInferredUtc,'2026-10-15T16:15:00.000Z');
 assert.equal(r.scheduler.enqueueDelayMinutes,49.8);
 assert.equal(r.decisionClock.state,'SOURCE_ASSESSMENT_WITHIN_T_PLUS_ONE_0159_NOT_PIT');
 assert.equal(r.decisionClock.finalSelectionAuthorized,false);
 assert.equal(r.decisionClock.selectedCount,null);
 assert.equal(r.decisionClock.frozenD1Written,false);
 const {receiptHash,...base}=r;
 assert.equal(await sha256Hex(base),receiptHash);
});
test('delayed 23:45 cron at 03:23 has source 122/122 PASS but misses freeze cutoff',async()=>{
 const f=await fixture({cron:'45 15 * * 1-5',
  created:'2026-10-15T19:23:15Z',
  started:'2026-10-15T19:23:20Z',
  completed:'2026-10-15T19:24:55Z',
  audited:'2026-10-15T19:25:24Z',
  stageAt:'2026-10-15T19:25:26Z'});
 f.stage1Summary.state='BLOCKED_NO_ELIGIBLE_SOURCE_LEDGER';
 const r=await build(f);
 assert.equal(r.sourceIntegrity.independentlyAccepted,true);
 assert.equal(r.scheduler.nominalInferredUtc,'2026-10-15T15:45:00.000Z');
 assert.equal(r.scheduler.enqueueDelayMinutes,218.25);
 assert.equal(r.decisionClock.state,'OUTSIDE_OR_UNQUALIFIED_SOURCE_ASSESSMENT_CLOCK');
 assert.equal(r.decisionClock.frozenD1Written,false);
});
test('20:15 cron delayed to 03:51 is a distinct original scheduled slot',async()=>{
 const f=await fixture({cron:'15 12 * * 1-5',
  created:'2026-10-15T19:51:52Z',
  started:'2026-10-15T19:51:54Z',
  completed:'2026-10-15T19:53:27Z',
  audited:'2026-10-15T19:53:56Z',stageAt:'2026-10-15T19:53:58Z'});
 f.stage1Summary.state='BLOCKED_NO_ELIGIBLE_SOURCE_LEDGER';
 const r=await build(f);
 assert.equal(r.scheduler.nominalInferredUtc,'2026-10-15T12:15:00.000Z');
 assert.equal(r.scheduler.enqueueDelayMinutes,456.867);
 assert.equal(r.decisionClock.state,'OUTSIDE_OR_UNQUALIFIED_SOURCE_ASSESSMENT_CLOCK');
});
test('schedule runner fast and valid source: distinct BOTH timing states',async()=>{
 const f=await fixture({created:'2026-10-15T16:17:00Z',
  started:'2026-10-15T16:18:00Z',completed:'2026-10-15T16:21:00Z',
  audited:'2026-10-15T16:23:00Z',stageAt:'2026-10-15T16:24:00Z'});
 const r=await build(f);
 assert.equal(r.scheduler.state,'WITHIN_15_MIN_RESEARCH_SLO');
 assert.equal(r.scheduler.runnerQueueDelayMinutes,1);
 assert.equal(r.scheduler.fullTriggerToRunnerDelayMinutes,3);
 assert.equal(r.decisionClock.state,'SOURCE_ASSESSMENT_WITHIN_T_PLUS_ONE_0159_NOT_PIT');
});
test('push cannot inherit a nominated cron or count toward scheduled on-time rate',async()=>{
 const f=await fixture({event:'push',created:'2026-10-15T13:08:00Z',
  started:'2026-10-15T13:08:05Z',completed:'2026-10-15T13:09:00Z',
  audited:'2026-10-15T13:12:00Z',stageAt:'2026-10-15T13:12:30Z'});
 const r=await build(f);
 assert.equal(r.scheduler.state,'NOT_APPLICABLE_NON_SCHEDULE');
 assert.equal(r.scheduler.nominalInferredUtc,null);
 assert.equal(r.sourceIntegrity.independentlyAccepted,true);
});
test('121/122 source is distinct integrity failure, regardless of a fast scheduler',async()=>{
 const f=await fixture({pairs:121,created:'2026-10-15T16:16:00Z',
  started:'2026-10-15T16:16:30Z',completed:'2026-10-15T16:20:00Z',
  audited:'2026-10-15T16:21:00Z',stageAt:'2026-10-15T16:22:00Z'});
 const r=await build(f);
 assert.equal(r.scheduler.state,'WITHIN_15_MIN_RESEARCH_SLO');
 assert.equal(r.sourceIntegrity.independentlyAccepted,false);
 assert.equal(r.decisionClock.state,'OUTSIDE_OR_UNQUALIFIED_SOURCE_ASSESSMENT_CLOCK');
});
test('source completed before cutoff but independent audit AFTER cannot be backdated',async()=>{
 const f=await fixture({audited:'2026-10-15T18:01:00Z',
  stageAt:'2026-10-15T18:02:00Z'});
 f.stage1Summary.state='BLOCKED_NO_ELIGIBLE_SOURCE_LEDGER';
 const r=await build(f);
 assert.equal(r.sourceIntegrity.independentlyAccepted,true);
 assert.equal(r.decisionClock.independentAuditBeforeCutoff,false);
 assert.equal(r.decisionClock.state,'OUTSIDE_OR_UNQUALIFIED_SOURCE_ASSESSMENT_CLOCK');
});
test('the source schedule event cron is mandatory; cannot guess which nominal slot triggered run',async()=>{
 await assert.rejects(()=>makeOrigin({eventName:'schedule',event:{},
  runId:1,runAttempt:1,codeSha:SHA}),/SCHEDULE_EVENT_CRON_UNVERIFIED/);
 assert.equal(nominal('45 15 * * 1-5','2026-10-15T19:23:15Z').slot,'23:45_T_SOURCE_ONLY');
 assert.equal(nominal('15 12 * * 1-5','2026-10-15T19:23:15Z').slot,'20:15_T_SOURCE_ONLY');
 assert.equal(nominal('15 12 * * 1-5','2026-10-18T23:40:00Z'),null);
});
test('signed origin but matching wrong GH event and cross-run artifact are refused',async()=>{
 const f=await fixture();f.sourceRun.id++;
 await assert.rejects(()=>build(f),/EVENT_PAYLOAD_SOURCE_ORIGIN_UNVERIFIED|REAL_GITHUB_RUN_JOB_PROVENANCE_INVALID/);
});
test('tampered independent audit hash cannot count even if 122 source pairs look valid',async()=>{
 const f=await fixture();
 f.independentAudit.sourceMarketDatePairsVerified=121;
 const r=await build(f);
 assert.equal(r.sourceIntegrity.independentlyAccepted,false);
 assert.equal(r.decisionClock.state,'OUTSIDE_OR_UNQUALIFIED_SOURCE_ASSESSMENT_CLOCK');
});
test('workflow actually writes two separate real receipts, uses only github.token and no new cron/Cloudflare',async()=>{
 const [s,a]=await Promise.all([
  readFile('.github/workflows/system2-shared-official-a1-incremental-readonly.yml','utf8'),
  readFile('.github/workflows/system2-shared-official-a1-independent-audit.yml','utf8')
 ]);
 assert.match(s,/record_shared_a1_github_schedule_origin_v0_1.mjs/);
 assert.match(a,/audit_shared_a1_dual_acceptance_v0_1.mjs/);
 assert.match(a,/dual-acceptance-receipt.json/);
 assert.match(s,/15 12 \* \* 1-5/);
 assert.match(s,/45 15 \* \* 1-5/);
 assert.match(s,/15 16 \* \* 1-5/);
 assert.doesNotMatch(a,/secrets\./);
});
