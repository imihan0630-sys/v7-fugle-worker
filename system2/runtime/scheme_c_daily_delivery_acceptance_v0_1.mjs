// BUILD_LANE Class A: daily Scheme C acceptance of a signed, *source-only*
// audit -> preview -> origin -> human report. Never certify SOURCE schedule,
// PIT, all-market ranking, Frozen, Shadow or a trade.
import {sha256Hex} from './decision_archive.mjs';

const HASH=/^[0-9a-f]{64}$/i;
const deny=x=>{throw Error('SCHEME_C_DELIVERY_ACCEPTANCE_'+x);};
const unsigned=(x,k)=>Object.fromEntries(Object.entries(x).filter(([n])=>n!==k));
const signed=async(x,k)=>x&&typeof x==='object'&&!Array.isArray(x)&&
 HASH.test(x[k]||'')&&await sha256Hex(unsigned(x,k))===x[k];
const validDay=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&
 Number.isFinite(Date.parse(x+'T00:00:00Z'))&&
 new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
const originStatus=new Set([
 'AUTO_AUDIT_CHILD_RECEIVED__SOURCE_CRON_ORIGIN_UNVERIFIED',
 'OPERATOR_MANUAL_REPLAY_NOT_AUTOMATIC','PR_HISTORICAL_PROOF_ONLY'
]);
const cutStatus=new Set([
 'RESEARCH_RECEIPTS_AT_OR_BEFORE_T2345_NOT_PIT_CERTIFIED',
 'SOURCE_OBSERVED_AFTER_T2345_DESCRIPTIVE_ONLY','SOURCE_NOT_READY'
]);

export async function assessSchemeCDailyDeliveryV0_1({
 handoff,origin,reportMeta,reportMarkdown
}={}){
 if(!(await signed(handoff,'receiptHash'))||
    handoff.schemaVersion!=='S2_SCHEME_C_DAILY_AUDIT_HANDOFF_V0_1'||
    !(await signed(origin,'deliveryOriginHash'))||
    origin.schemaVersion!=='S2_SCHEME_C_DELIVERY_ORIGIN_V0_1'||
    !reportMeta||reportMeta.schemaVersion!=='S2_SCHEME_C_DAILY_VISIBLE_REPORT_V0_1'||
    typeof reportMarkdown!=='string'||reportMarkdown.length===0||
    !HASH.test(reportMeta.reportHash||'')||
    await sha256Hex(reportMarkdown)!==reportMeta.reportHash)
  deny('SOURCE_REPORT_CHAIN_SIGNATURE_INVALID');
 if(!validDay(handoff.marketDate)||
    origin.marketDate!==handoff.marketDate||
    reportMeta.marketDate!==handoff.marketDate||
    reportMeta.sourceAuditRunId!==handoff.auditRunId||
    origin.auditRunId!==handoff.auditRunId||
    origin.handoffReceiptHash!==handoff.receiptHash||
    reportMeta.handoffReceiptHash!==handoff.receiptHash||
    !originStatus.has(origin.status)||
    !cutStatus.has(reportMeta.researchReceiptCutStatus)||
    reportMeta.preferredCutAtUtc!==handoff.marketDate+'T15:45:00Z')
  deny('ORIGIN_DATE_RUN_CUT_OR_HASH_MISMATCH');
 if(!Number.isSafeInteger(origin.consumerRunId)||origin.consumerRunId<1||
    !Number.isSafeInteger(handoff.auditRunId)||handoff.auditRunId<1||
    origin.completedDailyAutomaticSourceChainCertified!==false||
    origin.sourceCollectorScheduledOriginIndependentlyVerified!==null||
    origin.naturalAuditChildEventObserved!==
      (origin.status==='AUTO_AUDIT_CHILD_RECEIVED__SOURCE_CRON_ORIGIN_UNVERIFIED')||
    !['workflow_run','workflow_dispatch','pull_request'].includes(origin.consumerTrigger)||
    (origin.consumerTrigger==='workflow_run')!==
      (origin.status==='AUTO_AUDIT_CHILD_RECEIVED__SOURCE_CRON_ORIGIN_UNVERIFIED')||
    (origin.consumerTrigger==='workflow_dispatch')!==
      (origin.status==='OPERATOR_MANUAL_REPLAY_NOT_AUTOMATIC'))
  deny('FALSE_SOURCE_CRON_ORIGIN_AUTHORITY');
 if(handoff.pitACertificationGranted!==false||
    handoff.pitBCertificationGranted!==false||
    handoff.selectedCount!==null||handoff.zeroPickDay!==null||
    handoff.shadowAuthorized!==false||handoff.realStrategyRankAuthorized!==false||
    handoff.frozenD1Written!==false||handoff.pushAuthorized!==false||
    handoff.ordersAuthorized!==false||handoff.cloudflareD1Writes!==0||
    handoff.cloudflareR2Writes!==0||handoff.system1FormalCoreChanged!==false||
    origin.system2PITA!==false||origin.system2PITB!==false||
    origin.selectedCount!==null||origin.zeroPickDay!==null||
    origin.frozenD1Written!==false||origin.ordersAuthorized!==false||
    origin.pushAuthorized!==false||origin.cloudflareD1Writes!==0||
    reportMeta.pitACertified!==false||reportMeta.pitBCertified!==false||
    reportMeta.strategySelectedCount!==null||reportMeta.zeroPickDay!==null||
    reportMeta.frozenWritten!==false||reportMeta.ordersAuthorized!==false||
    reportMeta.pushAuthorized!==false||
    reportMeta.schedulerDispatchDelayMinutes!==null||
    reportMeta.officialProviderPublicationAtUtc!==null)
  deny('FORBIDDEN_SELECTION_OR_TIME_AUTHORITY');
 const ready=handoff.state==='NON_PIT_SOURCE_OBSERVATION_READY';
 if(!ready&&!['INDEPENDENT_SOURCE_INCOMPLETE','PRELIMINARY_SOURCE_NOT_READY'].includes(handoff.state))
  deny('SOURCE_STATE_UNKNOWN');
 if(reportMeta.sourceReady!==ready||
    (ready&&(!Number.isSafeInteger(handoff.descriptiveSourceMatches)||
      !Number.isSafeInteger(handoff.observedPreviewCount)||
      handoff.observedPreviewCount>30||
      reportMeta.displayedCount!==handoff.observedPreviewCount||
      typeof reportMeta.lateSource!=='boolean'||
      !Number.isFinite(reportMeta.independentAuditOffsetMinutes)||
      !Number.isFinite(reportMeta.previewObservationOffsetMinutes)))||
    (!ready&&(reportMeta.researchReceiptCutStatus!=='SOURCE_NOT_READY'||
      reportMeta.displayedCount!==null||
      reportMeta.previewObservationOffsetMinutes!==null)))
  deny('READINESS_AND_COUNTS_INCONSISTENT');
 if(ready&&(
    (reportMeta.researchReceiptCutStatus==='SOURCE_OBSERVED_AFTER_T2345_DESCRIPTIVE_ONLY')!==
      (reportMeta.independentAuditOffsetMinutes>0||
       reportMeta.previewObservationOffsetMinutes>0)||
    reportMeta.lateSource!==
      (reportMeta.researchReceiptCutStatus==='SOURCE_OBSERVED_AFTER_T2345_DESCRIPTIVE_ONLY')||
    !Number.isSafeInteger(handoff.descriptiveSourceMatches)||
    handoff.descriptiveSourceMatches<handoff.observedPreviewCount))
  deny('LATE_CUT_PROVENANCE_OR_DENOMINATOR_INVALID');
 const automaticAuditChild=
    origin.status==='AUTO_AUDIT_CHILD_RECEIVED__SOURCE_CRON_ORIGIN_UNVERIFIED';
 const status=!ready?'SOURCE_NOT_READY'
  :!automaticAuditChild?(origin.status==='PR_HISTORICAL_PROOF_ONLY'
    ?'PR_HISTORICAL_REPLAY_ONLY':'OPERATOR_MANUAL_RECOVERY_ONLY')
  :reportMeta.lateSource?'NATURAL_AUDIT_CHILD_LATE_SOURCE_PREVIEW'
  :'NATURAL_AUDIT_CHILD_ON_TIME_PREVIEW__SOURCE_CRON_UNVERIFIED';
 // Natural audit-child is a *partial* automation gate, not proof of the
 // original collector schedule event or the full P0 launch acceptance.
 const base={
  schemaVersion:'S2_SCHEME_C_DAILY_DELIVERY_ACCEPTANCE_V0_1',
  status,marketDate:handoff.marketDate,
  auditRunId:handoff.auditRunId,consumerRunId:origin.consumerRunId,
  handoffReceiptHash:handoff.receiptHash,
  deliveryOriginHash:origin.deliveryOriginHash,
  humanReportHash:reportMeta.reportHash,
  naturalAuditChildDelivered:ready&&automaticAuditChild,
  originalSourceCronProven:false,
  fullDailyScheduledChainAccepted:false,
  cutAtUtc:reportMeta.preferredCutAtUtc,
  observedByCut:ready&&!reportMeta.lateSource,
  descriptiveSourceMatches:ready?handoff.descriptiveSourceMatches:null,
  displayedPreviewCount:ready?handoff.observedPreviewCount:null,
  fullMarketOrdinaryShareDenominator:null,
  pitA:false,pitB:false,stage1Authorized:false,
  selectedCount:null,zeroPickDay:null,shadowAuthorized:false,
  frozenD1Written:false,pushAuthorized:false,ordersAuthorized:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1FormalCoreChanged:false
 };
 return Object.freeze({...base,acceptanceHash:await sha256Hex(base)});
}
