// DATA_LANE #1068 — independent, offline reconciliation of THREE already
// archived Actions originals (SOURCE / SOURCE-AUDIT / DUAL-ACCEPTANCE).
// Validates actual GH SOURCE schedule origin without silently certifying that
// the complete SOURCE->AUDIT->BUILD daily chain ran or met the T 23:45 cut.
// No market/provider GET, Cloudflare/Worker, Cron, scorer or D1 writes.
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {assertSharedOfficialA1ConsumerBoundaryV0_1}
 from '../../shared-knowledge/market-data/shared_official_a1_manifest_v0_1.mjs';
import {official61SessionSourceReceiptHashBaseV0_1}
 from '../runtime/source_first_official_61_session_collector_v0_1.mjs';
import {closestNominalA1CronV0_1}
 from '../runtime/a1_source_schedule_dual_acceptance_v0_1.mjs';

const REPO='imihan0630-sys/v7-fugle-worker';
const SRC='.github/workflows/system2-shared-official-a1-incremental-readonly.yml';
const AUD='.github/workflows/system2-shared-official-a1-independent-audit.yml';
const SHA=/^[a-f0-9]{64}$/i;
const SHA40=/^[a-f0-9]{40}$/i;
const stamp=s=>typeof s==='string'&&Number.isFinite(Date.parse(s))&&
 new Date(s).toISOString()===s;
const deny=s=>{throw Error('S2_DATA_A1_CRON_CHAIN_'+s)};
const unsigned=(x,key)=>Object.fromEntries(Object.entries(x).filter(([k])=>k!==key));
const signed=async(x,key)=>x&&SHA.test(x[key]||'')&&
 await sha256Hex(unsigned(x,key))===x[key];
const num=x=>Number.isSafeInteger(x)&&x>0;
const min=(a,b)=>Number(((Date.parse(a)-Date.parse(b))/60000).toFixed(3));

export async function reconcileNativeA1CronSourceAuditChainV0_1({
 origin,sourceReceipt,manifest,sourceRun,sourceJob,
 auditReceipt,auditRun,dualReceipt,producerArtifactId=null,
 auditArtifactId=null,dualArtifactId=null
}={}){
 if(!num(sourceRun?.id)||!num(auditRun?.id)||sourceRun.id===auditRun.id||
    sourceRun.repository?.full_name!==REPO||
    sourceRun.head_repository?.full_name!==REPO||
    sourceRun.path!==SRC||sourceRun.name!=='System2 Shared Official TWSE TPEx A1 Incremental (READ ONLY)'||
    sourceRun.head_branch!=='main'||!SHA40.test(sourceRun.head_sha||'')||
    sourceRun.status!=='completed'||sourceRun.conclusion!=='success'||
    !num(sourceRun.run_attempt)||
    !['schedule','push','workflow_dispatch'].includes(sourceRun.event)||
    !stamp(sourceRun.created_at)||!stamp(sourceRun.run_started_at)||
    auditRun.repository?.full_name!==REPO||auditRun.head_repository?.full_name!==REPO||
    auditRun.path!==AUD||
    auditRun.name!=='System2 Shared Official A1 Independent Source Audit (READ ONLY)'||
    auditRun.head_branch!=='main'||auditRun.head_sha!==sourceRun.head_sha||
    auditRun.event!=='workflow_run'||
    auditRun.status!=='completed'||auditRun.conclusion!=='success'||
    !stamp(auditRun.created_at)||!stamp(auditRun.run_started_at)||
    !num(sourceJob?.id)||sourceJob.run_id!==sourceRun.id||
    sourceJob.name!=='current_source'||sourceJob.status!=='completed'||
    sourceJob.conclusion!=='success'||!stamp(sourceJob.started_at)||
    !stamp(sourceJob.completed_at)||
    Date.parse(sourceRun.created_at)>Date.parse(sourceJob.started_at)||
    Date.parse(sourceJob.started_at)>Date.parse(sourceJob.completed_at)||
    Date.parse(sourceJob.completed_at)>Date.parse(auditRun.created_at))
   deny('ORIGINAL_GITHUB_REST_RUN_JOB_IDENTITY_OR_CLOCK');
 if(origin?.schemaVersion!=='S2_A1_GITHUB_ORIGIN_V0_1'||
    !(await signed(origin,'originHash'))||
    origin.runId!==sourceRun.id||origin.runAttempt!==sourceRun.run_attempt||
    origin.eventName!==sourceRun.event||origin.codeSha!==sourceRun.head_sha||
    origin.selectionAuthorized!==false||origin.frozenD1Written!==false)
   deny('ORIGINAL_GITHUB_EVENT_PAYLOAD_IDENTITY_OR_HASH');
 const scheduled=sourceRun.event==='schedule';
 if((scheduled&&!['15 12 * * 1-5','45 15 * * 1-5','15 16 * * 1-5'].includes(origin.eventSchedule))||
    (!scheduled&&origin.eventSchedule!==null))
   deny('SCHEDULE_EVENT_OR_NON_SCHEDULE_CRON_FORGERY');
 const slot=scheduled?closestNominalA1CronV0_1(origin.eventSchedule,sourceRun.created_at):null;
 if(scheduled&&!slot)deny('SCHEDULE_NOMINAL_SLOT_NOT_ATTRIBUTABLE');
 const scope=assertSharedOfficialA1ConsumerBoundaryV0_1(manifest,{
  system:'SYSTEM2',purpose:'READ_ONLY_SOURCE_RESEARCH'
 });
 if(scope.pointInTimeStrategyUseAuthorized!==false||
    manifest.sourceRunId!==String(sourceRun.id)||
    manifest.sourceCommitSha!==sourceRun.head_sha||
    manifest.sourceMarketDatePairsValidated!==122||
    sourceReceipt?.schemaVersion!=='S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1'||
    sourceReceipt.state!=='SOURCE_OBSERVED_UNAUDITED'||
    sourceReceipt.receivedMarketDateCount!==122||
    sourceReceipt.plannedMarketDateRequests!==122||
    !Array.isArray(sourceReceipt.receipts)||sourceReceipt.receipts.length!==122||
    !Array.isArray(sourceReceipt.errors)||sourceReceipt.errors.length!==0||
    sourceReceipt.marketDate!==manifest.effectiveTradingDay||
    sourceReceipt.receiptHash!==manifest.originalOfficialProvenanceHash||
    await sha256Hex(official61SessionSourceReceiptHashBaseV0_1(sourceReceipt))!==sourceReceipt.receiptHash)
   deny('SAME_ORIGINAL_SOURCE_RECEIPT_AND_MANIFEST_MISMATCH');
 const days=manifest.tradingDates;
 if(!Array.isArray(days)||days.length!==61||
    days.at(-1)!==sourceReceipt.marketDate||
    sourceReceipt.calendar?.tradingDates?.length!==61||
    days.some((d,i)=>d!==sourceReceipt.calendar.tradingDates[i]||
      (i>0&&d<=days[i-1])))
   deny('EXACT_ORIGINAL_CALENDAR_UNVERIFIED');
 const bodyIds=new Set();
 const cut=sourceReceipt.marketDate+'T15:45:00.000Z';
 let lastDayRows=0,latestCapture=null;
 for(const p of sourceReceipt.receipts){
  const id=p.market+'|'+p.marketDate;
  if(!['TWSE','TPEX'].includes(p.market)||!days.includes(p.marketDate)||
     bodyIds.has(id)||!SHA.test(p.originalRawResponseSha256||'')||
     !stamp(p.capturedAt)||Date.parse(p.capturedAt)>Date.parse(sourceJob.completed_at))
   deny('ORIGINAL_PAIR_HASH_DATE_CLOCK_OR_DUPLICATE');
  bodyIds.add(id);
  if(p.marketDate===sourceReceipt.marketDate){
   lastDayRows++;
   if(!latestCapture||Date.parse(p.capturedAt)>Date.parse(latestCapture))
    latestCapture=p.capturedAt;
  }
 }
 if(bodyIds.size!==122||lastDayRows!==2||!latestCapture)
  deny('SAME_T_MARKET_PAIR_OR_SOURCE_CAPTURE_MISSING');
 if(auditReceipt?.schemaVersion!=='SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1'||
    !(await signed(auditReceipt,'auditHash'))||
    auditReceipt.verdict!=='ACCEPTED_SOURCE_INTEGRITY_ONLY'||
    auditReceipt.marketDate!==sourceReceipt.marketDate||
    auditReceipt.sourceReceiptHash!==sourceReceipt.receiptHash||
    auditReceipt.manifestSha256!==manifest.manifestSha256||
    auditReceipt.sourceMarketDatePairsVerified!==122||
    auditReceipt.originalFilesRehashedAfterDownload!==122||
    auditReceipt.originalFilesDecompressedAndParsed!==122||
    auditReceipt.officialCalendarTradingDatesVerified!==61||
    auditReceipt.selectionAuthorized!==false||
    auditReceipt.strategyPitCertified!==false||
    auditReceipt.frozenWritten!==false||
    !stamp(auditReceipt.auditedAtUtc)||
    Date.parse(auditReceipt.auditedAtUtc)<Date.parse(auditRun.created_at)||
    Date.parse(auditReceipt.auditedAtUtc)<Date.parse(sourceJob.completed_at))
   deny('INDEPENDENT_AUDIT_SOURCE_RECEIPT_OR_GH_RUN_MISMATCH');
 if(dualReceipt?.schemaVersion!=='S2_A1_DUAL_SOURCE_SCHEDULE_ACCEPTANCE_V0_1'||
    !(await signed(dualReceipt,'receiptHash'))||
    dualReceipt.sourceRunId!==sourceRun.id||
    dualReceipt.marketDate!==sourceReceipt.marketDate||
    dualReceipt.sourceRunEvent!==sourceRun.event||
    dualReceipt.sourceRunAttempt!==sourceRun.run_attempt||
    dualReceipt.originalEventOriginHash!==origin.originHash||
    dualReceipt.sourceIntegrity?.state!=='INDEPENDENT_SOURCE_122_OF_122_ACCEPTED'||
    dualReceipt.sourceIntegrity?.pairsVerified!==122||
    dualReceipt.sourceIntegrity?.independentlyAccepted!==true||
    dualReceipt.scheduler?.cronExpression!==(scheduled?origin.eventSchedule:null)||
    dualReceipt.scheduler?.actualRunCreatedAtUtc!==sourceRun.created_at||
    dualReceipt.scheduler?.actualJobStartedAtUtc!==sourceJob.started_at||
    dualReceipt.scheduler?.actualJobCompletedAtUtc!==sourceJob.completed_at||
    dualReceipt.scheduler?.nominalInferredUtc!==(slot?.nominalInferredUtc??null)||
    dualReceipt.decisionClock?.finalSelectionAuthorized!==false||
    dualReceipt.decisionClock?.frozenD1Written!==false||
    dualReceipt.decisionClock?.selectedCount!==null||
    dualReceipt.decisionClock?.independentAuditObservedAtUtc!==auditReceipt.auditedAtUtc)
   deny('SIGNED_DUAL_ORIGIN_CLOCK_OR_SOURCE_AUDIT_MISMATCH');
 const scheduledDelay=scheduled?min(sourceRun.created_at,slot.nominalInferredUtc):null;
 if(dualReceipt.scheduler.enqueueDelayMinutes!==scheduledDelay)
   deny('SCHEDULE_DELAY_NOT_REPRODUCIBLE_FROM_REST');
 const originalCutMet=Date.parse(latestCapture)<=Date.parse(cut);
 const sourceCompletedBeforeCut=Date.parse(sourceJob.completed_at)<=Date.parse(cut);
 const auditorCompletedBeforeCut=Date.parse(auditReceipt.auditedAtUtc)<=Date.parse(cut);
 const base={
  schemaVersion:'S2_DATA_A1_NATIVE_CRON_SOURCE_AUDIT_CHAIN_V0_1',
  marketDate:sourceReceipt.marketDate,decisionCutUtc:cut,
  sourceRunId:sourceRun.id,sourceJobId:sourceJob.id,
  independentAuditRunId:auditRun.id,
  producerArtifactId,auditArtifactId,dualArtifactId,
  sourceRunHeadSha:sourceRun.head_sha,
  sourceRunEvent:sourceRun.event,sourceScheduleEventIndependentlyVerified:scheduled,
  exactEventCron:scheduled?origin.eventSchedule:null,
  expectedScheduleNominalInferredUtc:slot?.nominalInferredUtc??null,
  actualRunCreatedAtUtc:sourceRun.created_at,
  actualSourceJobStartedAtUtc:sourceJob.started_at,
  actualSourceJobCompletedAtUtc:sourceJob.completed_at,
  scheduleEnqueueDelayMinutes:scheduledDelay,
  schedulePunctualWithin15m:scheduled?scheduledDelay<=15:null,
  sourceOriginalGithubEventHash:origin.originHash,
  sameSourceManifestSha256:manifest.manifestSha256,
  sameSourceReceiptHash:sourceReceipt.receiptHash,
  originalSourceMarketPairsIndependentlyAudited:122,
  independentSourceAuditHash:auditReceipt.auditHash,
  originalAuditObservedAtUtc:auditReceipt.auditedAtUtc,
  signedSeparateSourceScheduleReceiptHash:dualReceipt.receiptHash,
  targetDayNativePairFirstObservedLatestUtc:latestCapture,
  targetDayNativeSourceCapturedBeforeCut:originalCutMet,
  originalSourceJobFinishedBeforeCut:sourceCompletedBeforeCut,
  originalIndependentSourceAuditFinishedBeforeCut:auditorCompletedBeforeCut,
  originalTargetDecisionCutSourceReady:originalCutMet&&
   sourceCompletedBeforeCut&&auditorCompletedBeforeCut,
  originalAuditChildRunVerified:true,
  completedDailySchemeCAutomaticConsumerCertified:false,
  sameDayStrategyPITCertified:false,fullOrdinaryMarketDenominator:null,
  selectedCount:null,zeroPickDay:null,frozenD1Written:false,
  ordersAuthorized:false,pushAuthorized:false,
  noNewProviderGets:true,cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreChanged:false
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
