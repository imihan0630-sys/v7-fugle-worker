// BUILD_LANE / Class A read-only join: DATA independently reconstructed SOURCE
// schedule->original A1 audit plus BUILD signed Scheme C delivery. This never
// upgrades PR replay, manual recovery or a late T+1 observation to a daily
// at-cut accepted selection. Receipt hashes do not replace native GH REST or
// independent physical DATA/AUDIT attestation.
import {sha256Hex} from './decision_archive.mjs';
import {assessSchemeCDailyDeliveryV0_1}
 from './scheme_c_daily_delivery_acceptance_v0_1.mjs';
const SHA=/^[0-9a-f]{64}$/i;
const DAY=/^\d{4}-\d\d-\d\d$/;
const UTC=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const deny=code=>{throw Error('SCHEME_C_NATIVE_SOURCE_DELIVERY_JOIN_'+code)};
const unsigned=(o,k)=>Object.fromEntries(Object.entries(o).filter(([n])=>n!==k));
const isStamp=s=>typeof s==='string'&&UTC.test(s)&&Number.isFinite(Date.parse(s));
const signed=async(o,k)=>o&&typeof o==='object'&&!Array.isArray(o)&&
 SHA.test(o[k]||'')&&await sha256Hex(unsigned(o,k))===o[k];
const num=n=>Number.isSafeInteger(n)&&n>0;
export async function joinSchemeCNativeSourceAndDeliveryV0_1({
 dataNativeCronAuditReceipt,schemeCHandoff,schemeCOrigin,
 schemeCReportMeta,schemeCReportMarkdown,schemeCAcceptance
}={}){
 const d=dataNativeCronAuditReceipt;
 if(!await signed(d,'receiptHash')||
    d.schemaVersion!=='S2_DATA_A1_NATIVE_CRON_SOURCE_AUDIT_CHAIN_V0_1'||
    typeof d.marketDate!=='string'||!DAY.test(d.marketDate)||
    !Number.isFinite(Date.parse(d.marketDate+'T00:00:00Z'))||
    new Date(d.marketDate+'T00:00:00Z').toISOString().slice(0,10)!==d.marketDate||
    d.decisionCutUtc!==d.marketDate+'T15:45:00.000Z'||
    d.sourceRunEvent!=='schedule'||
    d.sourceScheduleEventIndependentlyVerified!==true||
    !['15 12 * * 1-5','45 15 * * 1-5','15 16 * * 1-5'].includes(d.exactEventCron)||
    !num(d.sourceRunId)||!num(d.sourceJobId)||
    !num(d.independentAuditRunId)||d.sourceRunId===d.independentAuditRunId||
    d.originalSourceMarketPairsIndependentlyAudited!==122||
    d.originalAuditChildRunVerified!==true||
    !SHA.test(d.sourceOriginalGithubEventHash||'')||
    !SHA.test(d.sameSourceManifestSha256||'')||
    !SHA.test(d.sameSourceReceiptHash||'')||
    !SHA.test(d.independentSourceAuditHash||'')||
    !SHA.test(d.signedSeparateSourceScheduleReceiptHash||'')||
    !isStamp(d.originalAuditObservedAtUtc)||
    !isStamp(d.actualRunCreatedAtUtc)||
    !isStamp(d.actualSourceJobCompletedAtUtc)||
    !isStamp(d.targetDayNativePairFirstObservedLatestUtc)||
    d.completedDailySchemeCAutomaticConsumerCertified!==false||
    d.sameDayStrategyPITCertified!==false||
    d.fullOrdinaryMarketDenominator!==null||
    d.selectedCount!==null||d.zeroPickDay!==null||
    d.frozenD1Written!==false||d.ordersAuthorized!==false||
    d.pushAuthorized!==false||d.cloudflareD1Writes!==0||
    d.cloudflareR2Writes!==0||d.system1FormalCoreChanged!==false)
  deny('DATA_ORIGINAL_REST_SCHEDULE_SOURCE_AUDIT_RECEIPT_INVALID');
 const originalCut=Date.parse(d.decisionCutUtc);
 const originalBeforeCut=Date.parse(d.targetDayNativePairFirstObservedLatestUtc)<=originalCut&&
  Date.parse(d.actualSourceJobCompletedAtUtc)<=originalCut&&
  Date.parse(d.originalAuditObservedAtUtc)<=originalCut;
 if(d.originalTargetDecisionCutSourceReady!==originalBeforeCut||
    d.targetDayNativeSourceCapturedBeforeCut!==
     (Date.parse(d.targetDayNativePairFirstObservedLatestUtc)<=originalCut)||
    d.originalSourceJobFinishedBeforeCut!==
     (Date.parse(d.actualSourceJobCompletedAtUtc)<=originalCut)||
    d.originalIndependentSourceAuditFinishedBeforeCut!==
     (Date.parse(d.originalAuditObservedAtUtc)<=originalCut)||
    Date.parse(d.actualRunCreatedAtUtc)>Date.parse(d.actualSourceJobCompletedAtUtc)||
    Date.parse(d.actualSourceJobCompletedAtUtc)>Date.parse(d.originalAuditObservedAtUtc))
   deny('ORIGINAL_NATIVE_CLOCK_INCOHERENT_OR_BACKDATED');
 // Rebuild from the exact SHA-bound human report, rather than accepting
 // a submitted status string or a matching but unverified run number.
 const recomputed=await assessSchemeCDailyDeliveryV0_1({
  handoff:schemeCHandoff,origin:schemeCOrigin,
  reportMeta:schemeCReportMeta,reportMarkdown:schemeCReportMarkdown
 });
 if(!await signed(schemeCAcceptance,'acceptanceHash')||
    schemeCAcceptance.schemaVersion!=='S2_SCHEME_C_DAILY_DELIVERY_ACCEPTANCE_V0_1'||
    JSON.stringify(recomputed)!==JSON.stringify(schemeCAcceptance))
  deny('SCHEME_C_CHILD_RECEIPT_MISSING_OR_MUTATED');
 if(d.marketDate!==recomputed.marketDate||
    d.independentAuditRunId!==recomputed.auditRunId||
    recomputed.cutAtUtc!==d.decisionCutUtc.replace('.000Z','Z')||
    !num(recomputed.consumerRunId)||recomputed.consumerRunId===d.sourceRunId||
    recomputed.consumerRunId===d.independentAuditRunId)
  deny('SAME_T_SOURCE_AUDIT_CHILD_RUN_ID_OR_DECISION_CUT_MISMATCH');
 // An independently archived SOURCE audit timestamp and the report's
 // independent-audit offset must agree. Differences <0.06m tolerate display
 // rounding; they do not relax the independent decision-cut fence.
 if(typeof schemeCReportMeta.independentAuditOffsetMinutes!=='number'||
    !Number.isFinite(schemeCReportMeta.independentAuditOffsetMinutes)||
    Math.abs((Date.parse(d.originalAuditObservedAtUtc)-originalCut)/60000-
     schemeCReportMeta.independentAuditOffsetMinutes)>0.06)
  deny('REPORT_AUDIT_CLOCK_NOT_EXACT_NATIVE_AUDIT');
 if(!originalBeforeCut&&recomputed.observedByCut)
  deny('POST_CUT_NATIVE_SOURCE_MASQUERADING_AS_ON_TIME_PREVIEW');
 const state=recomputed.status;
 const status=state==='SOURCE_NOT_READY'
  ?'SCHEDULED_SOURCE_AUDIT_VALID__BUILD_SOURCE_NOT_READY'
  :state==='PR_HISTORICAL_REPLAY_ONLY'
    ?'SCHEDULED_SOURCE_AUDIT_VALID__PR_REPLAY_NOT_AUTOMATIC'
    :state==='OPERATOR_MANUAL_RECOVERY_ONLY'
      ?'SCHEDULED_SOURCE_AUDIT_VALID__MANUAL_REPLAY_NOT_AUTOMATIC'
      :state==='NATURAL_AUDIT_CHILD_LATE_SOURCE_PREVIEW'
        ?'SCHEDULED_SOURCE_AUDIT_VALID__NATURAL_CHILD_LATE_NONPIT'
        :'SCHEDULED_SOURCE_AUDIT_VALID__NATURAL_CHILD_ON_TIME_NONPIT__CONSUMER_GH_REST_PENDING';
 const base={
  schemaVersion:'S2_BUILD_SCHEME_C_NATIVE_SOURCE_DELIVERY_JOIN_V0_1',
  marketDate:d.marketDate,decisionCutUtc:d.decisionCutUtc,
  dataOriginalSourceRunId:d.sourceRunId,
  dataIndependentAuditRunId:d.independentAuditRunId,
  schemeCConsumerRunId:recomputed.consumerRunId,
  sourceScheduledEventVerified:true,
  sourceScheduleCron:d.exactEventCron,
  sourceEnqueueDelayMinutes:d.scheduleEnqueueDelayMinutes,
  nativeSourceAuditedPairs:122,
  sameNativeSourceAuditAndSchemeCReceiptLinked:true,
  originalSourceAndAuditReadyAtT2345:originalBeforeCut,
  schemeCDeliveryMode:state,
  naturalAuditChildObserved:recomputed.naturalAuditChildDelivered,
  schemeCReportProducedAtCut:recomputed.observedByCut,
  schemeCVisiblePreviewCount:recomputed.displayedPreviewCount,
  reportMarkdownSha256:recomputed.humanReportHash,
  dataNativeReceiptHash:d.receiptHash,
  schemeCDeliveryAcceptanceHash:recomputed.acceptanceHash,
  status,
  sourceScheduleIndependentlyVerified:true,
  // The SOURCE REST and independent SOURCE audit were physically captured
  // by DATA, but this standalone consumer does not independently read the
  // completed GitHub REST event/status for the Scheme C CHILD. Therefore
  // the completed operational end-to-end chain is NOT certified here.
  schemeCConsumerCompletedGitHubRestIndependentlyVerified:false,
  fullDailyScheduledChainAccepted:false,
  formalStrategyPITACertified:false,formalStrategyPITBCertified:false,
  strategySelectionAuthorized:false,selectedCount:null,zeroPickDay:null,
  fullMarketOrdinaryShareDenominator:null,shadowAuthorized:false,
  frozenD1Written:false,ordersAuthorized:false,pushAuthorized:false,
  cloudflareD1Reads:0,cloudflareD1Writes:0,cloudflareR2Writes:0,
  newProviderMarketGets:0,newCronCount:0,system1FormalCoreChanged:false,
 };
 return Object.freeze({...base,joinHash:await sha256Hex(base)});
}
