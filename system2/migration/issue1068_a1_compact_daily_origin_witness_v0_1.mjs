// DATA_LANE #1068 — repeatable, compact original SOURCE Cron witness for any
// *already audited* real trading date. Reuses TWO existing small signed
// independent-AUDIT artifacts and GitHub native Run/Job REST evidence.
// Never downloads 40MB originals again, never makes provider/Cloudflare GET,
// and never promotes PIT, Frozen, strategy rank, or completed BUILD consumer.
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {closestNominalA1CronV0_1} from '../runtime/a1_source_schedule_dual_acceptance_v0_1.mjs';
const REPO='imihan0630-sys/v7-fugle-worker';
const SOURCE='.github/workflows/system2-shared-official-a1-incremental-readonly.yml';
const AUDIT='.github/workflows/system2-shared-official-a1-independent-audit.yml';
const H=/^[0-9a-f]{64}$/i, H40=/^[0-9a-f]{40}$/i;
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const iso=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(s)&&Number.isFinite(Date.parse(s));
const validDay=s=>typeof s==='string'&&DAY.test(s)&&
 new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
const deny=s=>{throw Error('S2_DATA_A1_DAILY_ORIGIN_'+s)};
const signed=async(x,k)=>x&&typeof x==='object'&&H.test(x[k]||'')&&
 await sha256Hex(Object.fromEntries(Object.entries(x).filter(([p])=>p!==k)))===x[k];
const mins=(a,b)=>Number(((Date.parse(a)-Date.parse(b))/60000).toFixed(3));
export async function witnessDailySourceOriginV0_1({
 auditRun,sourceRun,sourceJob,auditReceipt,dualReceipt
}={}){
 if(!Number.isSafeInteger(auditRun?.id)||auditRun.id<=0||
  !Number.isSafeInteger(sourceRun?.id)||sourceRun.id<=0||
  auditRun.id===sourceRun.id||
  !Number.isSafeInteger(sourceJob?.id)||sourceJob.id<=0||
  sourceJob.run_id!==sourceRun.id||sourceJob.name!=='current_source'||
  sourceJob.status!=='completed'||sourceJob.conclusion!=='success'||
  !iso(sourceJob.started_at)||!iso(sourceJob.completed_at)||
  sourceRun.repository?.full_name!==REPO||
  sourceRun.head_repository?.full_name!==REPO||
  sourceRun.path!==SOURCE||
  sourceRun.name!=='System2 Shared Official TWSE TPEx A1 Incremental (READ ONLY)'||
  sourceRun.head_branch!=='main'||!H40.test(sourceRun.head_sha||'')||
  sourceRun.status!=='completed'||sourceRun.conclusion!=='success'||
  !Number.isSafeInteger(sourceRun.run_attempt)||sourceRun.run_attempt<1||
  !['schedule','push','workflow_dispatch'].includes(sourceRun.event)||
  !iso(sourceRun.created_at)||
  auditRun.repository?.full_name!==REPO||
  auditRun.head_repository?.full_name!==REPO||
  auditRun.path!==AUDIT||
  auditRun.name!=='System2 Shared Official A1 Independent Source Audit (READ ONLY)'||
  auditRun.event!=='workflow_run'||auditRun.head_branch!=='main'||
  auditRun.head_sha!==sourceRun.head_sha||
  auditRun.status!=='completed'||auditRun.conclusion!=='success'||
  !iso(auditRun.created_at)||
  Date.parse(sourceRun.created_at)>Date.parse(sourceJob.started_at)||
  Date.parse(sourceJob.started_at)>Date.parse(sourceJob.completed_at)||
  Date.parse(sourceJob.completed_at)>Date.parse(auditRun.created_at))
   deny('GH_NATIVE_EXACT_SOURCE_AUDIT_JOB_IDENTITY');
 if(!(await signed(auditReceipt,'auditHash'))||
    auditReceipt.schemaVersion!=='SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1'||
    auditReceipt.verdict!=='ACCEPTED_SOURCE_INTEGRITY_ONLY'||
    !validDay(auditReceipt.marketDate)||
    !H.test(auditReceipt.sourceReceiptHash||'')||
    !H.test(auditReceipt.manifestSha256||'')||
    auditReceipt.sourceMarketDatePairsVerified!==122||
    auditReceipt.originalFilesRehashedAfterDownload!==122||
    auditReceipt.originalFilesDecompressedAndParsed!==122||
    auditReceipt.officialCalendarTradingDatesVerified!==61||
    auditReceipt.auditorSeparation!=='INDEPENDENT_READBACK_PROCESS'||
    auditReceipt.selectionAuthorized!==false||
    auditReceipt.strategyPitCertified!==false||
    auditReceipt.selectedCount!==null||
    auditReceipt.zeroPickDay!==null||
    auditReceipt.frozenWritten!==false||
    !iso(auditReceipt.auditedAtUtc)||
    Date.parse(auditReceipt.auditedAtUtc)<Date.parse(auditRun.created_at))
   deny('SIGNED_EXACT_SOURCE_AUDIT_REJECTED');
 if(!(await signed(dualReceipt,'receiptHash'))||
    dualReceipt.schemaVersion!=='S2_A1_DUAL_SOURCE_SCHEDULE_ACCEPTANCE_V0_1'||
    dualReceipt.marketDate!==auditReceipt.marketDate||
    dualReceipt.sourceRunId!==sourceRun.id||
    dualReceipt.sourceRunAttempt!==sourceRun.run_attempt||
    dualReceipt.sourceRunEvent!==sourceRun.event||
    !H.test(dualReceipt.originalEventOriginHash||'')||
    dualReceipt.sourceIntegrity?.state!=='INDEPENDENT_SOURCE_122_OF_122_ACCEPTED'||
    dualReceipt.sourceIntegrity?.independentlyAccepted!==true||
    dualReceipt.sourceIntegrity?.pairsVerified!==122||
    dualReceipt.scheduler?.actualRunCreatedAtUtc!==sourceRun.created_at||
    dualReceipt.scheduler?.actualJobStartedAtUtc!==sourceJob.started_at||
    dualReceipt.scheduler?.actualJobCompletedAtUtc!==sourceJob.completed_at||
    dualReceipt.decisionClock?.independentAuditObservedAtUtc!==auditReceipt.auditedAtUtc||
    dualReceipt.decisionClock?.finalSelectionAuthorized!==false||
    dualReceipt.decisionClock?.selectedCount!==null||
    dualReceipt.decisionClock?.zeroPickDay!==null&&
     dualReceipt.decisionClock?.zeroPickDay!==undefined||
    dualReceipt.decisionClock?.frozenD1Written!==false)
   deny('SIGNED_DUAL_NATIVE_RUN_ID_CLOCK_REJECTED');
 const scheduled=sourceRun.event==='schedule';
 if(scheduled&&!['15 12 * * 1-5','45 15 * * 1-5','15 16 * * 1-5'].includes(dualReceipt.scheduler.cronExpression)||
    !scheduled&&dualReceipt.scheduler.cronExpression!==null)
   deny('GH_NATIVE_CRON_EVENT_DISAGREEMENT');
 const nominal=scheduled?closestNominalA1CronV0_1(dualReceipt.scheduler.cronExpression,sourceRun.created_at):null;
 if(scheduled&&!nominal)deny('GH_SCHEDULE_NOMINAL_NOT_ATTRIBUTABLE');
 if(dualReceipt.scheduler.nominalInferredUtc!==(nominal?.nominalInferredUtc??null)||
    dualReceipt.scheduler.enqueueDelayMinutes!==(scheduled?mins(sourceRun.created_at,nominal.nominalInferredUtc):null))
   deny('GH_NATIVE_CRON_SLO_NOT_REPRODUCIBLE');
 const t=auditReceipt.marketDate;
 const preferredCut=t+'T15:45:00.000Z'; // 23:45 Asia/Taipei, nominal SOURCE-only cut
 const auditedAt=auditReceipt.auditedAtUtc;
 const sourceCompleteAt=sourceJob.completed_at;
 const sourceAndAuditBeforePreferredCut=
  Date.parse(sourceCompleteAt)<=Date.parse(preferredCut)&&
  Date.parse(auditedAt)<=Date.parse(preferredCut);
 const base={
  schemaVersion:'S2_DATA_A1_COMPACT_DAILY_ORIGIN_WITNESS_V0_1',
  marketDate:t,preferredSourceDecisionCutUtc:preferredCut,
  independentAuditRunId:auditRun.id,sourceRunId:sourceRun.id,
  sourceJobId:sourceJob.id,sourceCodeSha:sourceRun.head_sha,
  sourceOriginalReceiptHash:auditReceipt.sourceReceiptHash,
  sourceOriginalManifestSha256:auditReceipt.manifestSha256,
  independentSourceAuditHash:auditReceipt.auditHash,
  signedIndependentDualClockHash:dualReceipt.receiptHash,
  signedOriginalEventHash:dualReceipt.originalEventOriginHash,
  sourceRootGitHubEventNativeVerified:true,
  sourceRootEventType:sourceRun.event,
  sourceRootWasScheduled:scheduled,
  sourceRootScheduleExpression:scheduled?dualReceipt.scheduler.cronExpression:null,
  sourceScheduleNominalInferredUtc:nominal?.nominalInferredUtc??null,
  sourceGitHubActualCreatedAtUtc:sourceRun.created_at,
  sourceGitHubJobCompletedAtUtc:sourceCompleteAt,
  sourceGitHubEnqueueDelayMinutes:scheduled?mins(sourceRun.created_at,nominal.nominalInferredUtc):null,
  sourceSchedule15mSloMet:scheduled?mins(sourceRun.created_at,nominal.nominalInferredUtc)<=15:null,
  sourceOriginalMarketDatePairsIndependentlyAudited:122,
  independentSourceAuditObservedAtUtc:auditedAt,
  sourceAndAuditBeforePreferredCut,
  // This compact derivative is not an audit of all original bytes: it pins the
  // exact signed independent original rehash + source event witness.
  original122SourceBytesRehashedInThisCompactJob:false,
  independentOriginal122SourceBytesRehashedUpstream:true,
  originalTradingDayCaptureTimestampByMarketIndependentlyPinnedHere:false,
  completedScheduledSourceToBUILDConsumerCertified:false,
  stage1ActualUsedInputPITAEligible:false,
  marketOrdinaryEquityDenominator:null,
  selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,tradeAuthorized:false,
  newProviderGets:0,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreChanged:false
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
