// Class A BUILD consumer. Joins separately verified DATA native Cron/source/audit
// receipt to actual GitHub REST metadata and optional signed Scheme C delivery.
// No original provider GET, new Cron, workflows dispatch, PIT admission or D1.
import {sha256Hex} from './decision_archive.mjs';
const REPO='imihan0630-sys/v7-fugle-worker';
const WORKFLOW='.github/workflows/system2-scheme-c-daily-audit-preview-consumer.yml';
const SOURCE='.github/workflows/system2-shared-official-a1-incremental-readonly.yml';
const AUDIT='.github/workflows/system2-shared-official-a1-independent-audit.yml';
const HASH=/^[a-f0-9]{64}$/i, SHA40=/^[a-f0-9]{40}$/i;
const err=s=>{throw Error('S2_BUILD_SCHEME_C_CRON_READINESS_'+s)};
const unsigned=(x,k)=>Object.fromEntries(Object.entries(x).filter(([n])=>n!==k));
const signed=async(o,k)=>o&&typeof o==='object'&&!Array.isArray(o)&&HASH.test(o[k]||'')&&
 await sha256Hex(unsigned(o,k))===o[k];
const utc=s=>typeof s==='string'&&
 /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(s)&&
 Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,19)===s.slice(0,19);
const sameRepo=r=>r?.repository?.full_name===REPO&&r?.head_repository?.full_name===REPO;
export async function reconcileSchemeCSourceCronReadinessV0_1({
 sourceChain,sourceRun,auditRun,firstSchemeCCommit,consumerRun=null,
 deliveryOrigin=null,deliveryAcceptance=null
}={}){
 // A hashed DATA receipt is not a self-contained proof of physical SOURCE
 // originals. It MUST be the separately produced DATA canonical contract.
 if(!(await signed(sourceChain,'receiptHash'))||
    sourceChain.schemaVersion!=='S2_DATA_A1_NATIVE_CRON_SOURCE_AUDIT_CHAIN_V0_1'||
    sourceChain.sourceScheduleEventIndependentlyVerified!==true||
    sourceChain.sourceRunEvent!=='schedule'||
    sourceChain.originalSourceMarketPairsIndependentlyAudited!==122||
    !HASH.test(sourceChain.sameSourceReceiptHash||'')||
    !HASH.test(sourceChain.independentSourceAuditHash||'')||
    !HASH.test(sourceChain.sourceOriginalGithubEventHash||'')||
    sourceChain.originalAuditChildRunVerified!==true||
    sourceChain.completedDailySchemeCAutomaticConsumerCertified!==false||
    sourceChain.sameDayStrategyPITCertified!==false||
    sourceChain.selectedCount!==null||sourceChain.zeroPickDay!==null||
    sourceChain.frozenD1Written!==false)
  err('INDEPENDENT_DATA_SOURCE_CRON_CONTRACT_REQUIRED');
 if(!sameRepo(sourceRun)||!sameRepo(auditRun)||
    sourceRun?.id!==sourceChain.sourceRunId||
    auditRun?.id!==sourceChain.independentAuditRunId||
    sourceRun.event!=='schedule'||auditRun.event!=='workflow_run'||
    sourceRun.path!==SOURCE||auditRun.path!==AUDIT||
    sourceRun.head_branch!=='main'||auditRun.head_branch!=='main'||
    sourceRun.head_sha!==sourceChain.sourceRunHeadSha||
    auditRun.head_sha!==sourceRun.head_sha||
    !SHA40.test(sourceRun.head_sha||'')||
    sourceRun.conclusion!=='success'||auditRun.conclusion!=='success'||
    sourceRun.status!=='completed'||auditRun.status!=='completed'||
    !utc(sourceRun.created_at)||!utc(auditRun.created_at)||
    !utc(auditRun.updated_at)||!utc(sourceChain.originalAuditObservedAtUtc)||
    sourceChain.actualRunCreatedAtUtc!==sourceRun.created_at||
    sourceChain.originalAuditObservedAtUtc>auditRun.updated_at)
  err('GITHUB_NATIVE_ORIGINAL_SOURCE_AUDIT_MISMATCH');
 // A workflow cannot be blamed for not consuming an event which completed
 // BEFORE its workflow_run trigger first existed on GitHub default branch.
 const d=firstSchemeCCommit;
 if(!d||!SHA40.test(d.sha||'')||
    d.sha!=='f18c761ee4bc82eb32b27f0ac5a7523cfaaf9ed0'||
    d.commit?.committer?.date!=='2026-10-17T02:25:23Z'||
    !utc(d.commit?.committer?.date)||
    !Array.isArray(d.files)||
    !d.files.some(f=>f.filename===WORKFLOW&&f.status==='added'))
  err('DEPLOYMENT_FIRST_MAIN_ADD_COMMIT_NOT_PROVEN');
 const deployedAt=d.commit.committer.date;
 const auditAlreadyFinishedBeforeDeployment=
   Date.parse(auditRun.updated_at)<Date.parse(deployedAt)&&
   Date.parse(sourceChain.originalAuditObservedAtUtc)<Date.parse(deployedAt);
 let mode;
 if(auditAlreadyFinishedBeforeDeployment){
  if(consumerRun||deliveryOrigin||deliveryAcceptance)
   err('PREDEPLOYMENT_PARENT_CANNOT_BECOME_NATURAL_CHILD');
  mode='PARENT_AUDIT_FINISHED_BEFORE_SCHEME_C_WORKFLOW_DEPLOYMENT';
 }else if(consumerRun===null){
  if(deliveryOrigin||deliveryAcceptance)
   err('DELIVERY_WITHOUT_NATIVE_CONSUMER_RUN');
  mode='PARENT_AFTER_DEPLOYMENT__NO_CHILD_EVIDENCE_SUPPLIED';
 }else {
  if(!sameRepo(consumerRun)||consumerRun.path!==WORKFLOW||
     consumerRun.name!=='System2 Scheme C Daily Independent-Audit Preview Consumer (NO NEW CRON)'||
     consumerRun.event!=='workflow_run'||
     consumerRun.head_branch!=='main'||
     !utc(consumerRun.created_at)||
     Date.parse(consumerRun.created_at)<Date.parse(deployedAt)||
     Date.parse(consumerRun.created_at)<Date.parse(auditRun.created_at)||
     consumerRun.status!=='completed'||consumerRun.conclusion!=='success')
   err('NATURAL_CONSUMER_RUN_REST_UNVERIFIED');
  if(deliveryOrigin===null||deliveryAcceptance===null){
   if(deliveryOrigin||deliveryAcceptance)
    err('PARTIAL_DERIVED_DELIVERY_RECEIPTS');
   mode='NATURAL_CHILD_GITHUB_RUN_ONLY__ARTIFACT_CHAIN_PENDING';
  }else{
   if(!(await signed(deliveryOrigin,'deliveryOriginHash'))||
      !(await signed(deliveryAcceptance,'acceptanceHash'))||
      deliveryOrigin.schemaVersion!=='S2_SCHEME_C_DELIVERY_ORIGIN_V0_1'||
      deliveryAcceptance.schemaVersion!=='S2_SCHEME_C_DAILY_DELIVERY_ACCEPTANCE_V0_1'||
      deliveryOrigin.consumerRunId!==consumerRun.id||
      deliveryAcceptance.consumerRunId!==consumerRun.id||
      deliveryOrigin.auditRunId!==auditRun.id||
      deliveryAcceptance.auditRunId!==auditRun.id||
      deliveryOrigin.marketDate!==sourceChain.marketDate||
      deliveryAcceptance.marketDate!==sourceChain.marketDate||
      deliveryOrigin.consumerTrigger!=='workflow_run'||
      deliveryOrigin.naturalAuditChildEventObserved!==true||
      deliveryOrigin.status!=='AUTO_AUDIT_CHILD_RECEIVED__SOURCE_CRON_ORIGIN_UNVERIFIED'||
      deliveryOrigin.sourceCollectorScheduledOriginIndependentlyVerified!==null||
      deliveryOrigin.completedDailyAutomaticSourceChainCertified!==false||
      deliveryAcceptance.deliveryOriginHash!==deliveryOrigin.deliveryOriginHash||
      !['NATURAL_AUDIT_CHILD_LATE_SOURCE_PREVIEW',
        'NATURAL_AUDIT_CHILD_ON_TIME_PREVIEW__SOURCE_CRON_UNVERIFIED'].includes(deliveryAcceptance.status)||
      deliveryAcceptance.originalSourceCronProven!==false||
      deliveryAcceptance.fullDailyScheduledChainAccepted!==false||
      deliveryAcceptance.pitA!==false||deliveryAcceptance.pitB!==false||
      deliveryAcceptance.selectedCount!==null||
      deliveryAcceptance.zeroPickDay!==null||
      deliveryAcceptance.frozenD1Written!==false||
      deliveryAcceptance.handoffReceiptHash!==deliveryOrigin.handoffReceiptHash||
      (!utc(deliveryAcceptance.cutAtUtc)||
       Date.parse(deliveryAcceptance.cutAtUtc)!==Date.parse(sourceChain.decisionCutUtc))||
      (deliveryAcceptance.observedByCut===true)!==
        (sourceChain.originalTargetDecisionCutSourceReady===true))
    err('SIGNED_CONSUMER_AUDIT_SOURCE_OR_CUT_BINDING_INVALID');
   mode='CRON_SOURCE_TO_NATURAL_NONPIT_DELIVERY_RECONCILED';
  }
 }
 const base={
  schemaVersion:'S2_BUILD_SCHEME_C_SOURCE_CRON_NATURAL_CHAIN_READINESS_V0_1',
  mode,marketDate:sourceChain.marketDate,sourceRunId:sourceRun.id,
  auditRunId:auditRun.id,consumerRunId:consumerRun?.id??null,
  firstWorkflowMainAddedCommit:d.sha,firstWorkflowDeployedAtUtc:deployedAt,
  upstreamAuditFinishedBeforeWorkflowDeployed:auditAlreadyFinishedBeforeDeployment,
  independentlyDataReconciledSourceCron:true,
  sourceOriginalPairCount:122,sourceOriginalCutReady:
    sourceChain.originalTargetDecisionCutSourceReady,
  originalScheduleDelayMinutes:sourceChain.scheduleEnqueueDelayMinutes,
  sourceChainHash:sourceChain.receiptHash,
  consumerDeliveryHash:deliveryAcceptance?.acceptanceHash??null,
  naturalConsumerReceiptReconciled:mode==='CRON_SOURCE_TO_NATURAL_NONPIT_DELIVERY_RECONCILED',
  missingNaturalChildProven:false, // an absent supplied run is not exhaustive negative evidence
  newTradingDayFullP0Acceptance:false,
  ownerClassBCApprovalRequiredForPITA:true,
  pitA:false,pitB:false,selectedCount:null,zeroPickDay:null,
  shadowAuthorized:false,frozenD1Written:false,
  providerGets:0,newCronCount:0,cloudflareD1Writes:0,
  ordersAuthorized:false,pushAuthorized:false,
  system1FormalCoreChanged:false
 };
 return Object.freeze({...base,readinessHash:await sha256Hex(base)});
}
