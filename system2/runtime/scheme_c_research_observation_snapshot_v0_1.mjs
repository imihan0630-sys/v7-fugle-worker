// System 2 BUILD / Class A optional sidecar of the EXISTING signed Scheme C
// non-PIT report. Never gate user-visible research delivery on sidecar success.
// An Actions Artifact with 30-day expiry is evidence of an observation, NOT
// by itself a durable pre-outcome forward-study archive or official Frozen.
import {sha256Hex} from './decision_archive.mjs';
import {assessSchemeCDailyDeliveryV0_1}
 from './scheme_c_daily_delivery_acceptance_v0_1.mjs';

const SHA=/^[a-f0-9]{64}$/i;
const UTC=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const validUtc=s=>typeof s==='string'&&UTC.test(s)&&
 Number.isFinite(Date.parse(s))&&
 new Date(s).toISOString().slice(0,19)===s.slice(0,19);
const deny=k=>{throw Error('SCHEME_C_RESEARCH_OBSERVATION_'+k)};
const safeAuthorizations=a=>a?.selectedCount===null&&a.zeroPickDay===null&&
 a?.pitA===false&&a.pitB===false&&a.stage1Authorized===false&&
 a.shadowAuthorized===false&&a.frozenD1Written===false&&
 a.ordersAuthorized===false&&a.pushAuthorized===false&&
 a.cloudflareD1Writes===0&&a.cloudflareR2Writes===0;

export async function buildSchemeCResearchObservationSnapshotV0_1({
 handoff,deliveryOrigin,reportMeta,reportMarkdown,
 deliveryAcceptance,generatedAtUtc
}={}){
 if(!validUtc(generatedAtUtc))deny('TRUE_GENERATION_CLOCK_REQUIRED');
 const a=await assessSchemeCDailyDeliveryV0_1({
  handoff,origin:deliveryOrigin,reportMeta,reportMarkdown
 });
 if(!deliveryAcceptance||typeof deliveryAcceptance!=='object'||
    Array.isArray(deliveryAcceptance)||
    !SHA.test(deliveryAcceptance.acceptanceHash||'')||
    await sha256Hex(Object.fromEntries(Object.entries(deliveryAcceptance)
     .filter(([k])=>k!=='acceptanceHash')))!==deliveryAcceptance.acceptanceHash||
    JSON.stringify(a)!==JSON.stringify(deliveryAcceptance)||
    !safeAuthorizations(a))deny('SIGNED_RESEARCH_REPORT_OR_DELIVERY_INTEGRITY');
 if(Date.parse(generatedAtUtc)<Date.parse(handoff.auditedAtUtc)||
    a.naturalAuditChildDelivered&&deliveryOrigin.consumerTrigger!=='workflow_run')
  deny('REPORT_CANNOT_PRECEDE_AUDIT_OR_INVENT_NATURAL_EVENT');
 const sourceReady=a.status!=='SOURCE_NOT_READY';
 const p=sourceReady?handoff.previewReport:null;
 if(sourceReady&&(
   !p||p.marketDate!==a.marketDate||
   !validUtc(p.originalObservedAtUtc)||
   Date.parse(generatedAtUtc)<Date.parse(p.originalObservedAtUtc)||
   p.sourceUniverseKind!=='FOUR_DIGIT_INSTRUMENT_NOT_CERTIFIED_ORDINARY_EQUITY'||
   !Number.isSafeInteger(p.sourceUniverseCount)||p.sourceUniverseCount<1||
   !Array.isArray(p.previewRows)||p.previewRows.length!==a.displayedPreviewCount||
   !Number.isSafeInteger(p.preliminarySourceMatchedCount)||
   p.preliminarySourceMatchedCount!==a.descriptiveSourceMatches||
   a.displayedPreviewCount>30||
   p.previewRows.some(row=>row.previewIsTradeRecommendation!==false||
    row.formalStrategyRank!==null||row.formalStrategyScore!==null||
    row.marketDate!==a.marketDate||!SHA.test(row.sourceRowHash||'')||
    row.status!=='RESEARCH_OBSERVATION_ONLY'&&
     row.status!=='CA_OR_CLOCK_REVIEW_HOLD')))
  deny('REAL_SOURCED_PREVIEW_MODEL_OR_ROWS_INCOMPLETE');
 // Only copy existing safe derived observations: no original proprietary
 // OHLCV provider bytes and no new order prices or recommendation.
 const rows=sourceReady?p.previewRows.map(r=>Object.freeze({
  displayOrder:r.previewDisplayOrder,
  symbol:r.symbol,companyName:r.companyName,market:r.market,
  marketDate:r.marketDate,
  relativePriceFiveSessionsPct:r.descriptiveRawFiveSessionReturnPct,
  aboveRawSma20:r.priceAboveRawSma20,
  descriptiveState:r.status,
  evidenceWarnings:[...r.warnings],
  sourceRowHash:r.sourceRowHash,
  formalTradeSignal:false,officialStrategyScore:null
 })):[];
 const base={
  schemaVersion:'S2_SCHEME_C_RESEARCH_OBSERVATION_SNAPSHOT_V0_1',
  observationLane:'NON_PIT_PREVIEW',
  modelId:'PRELIMINARY_DAILY_PRICE_VOLUME',
  modelVersion:'PRELIMINARY_PRICE_VOLUME_OBSERVATION_V0_2',
  modelCriteria:[
   'RAW_CLOSE_ABOVE_RAW_SMA20',
   'RAW_CLOSE_FIVE_TRADING_SESSIONS_RETURN_POSITIVE',
   'OBSERVED_SESSION_VOLUME_SHARES_POSITIVE',
   'OBSERVED_SESSION_TRADE_VALUE_POSITIVE'
  ],
  noShortMomentumSevenFactorClaim:true,
  marketDate:a.marketDate,
  actualReportGeneratedAtUtc:generatedAtUtc,
  originalPreviewObservedAtUtc:sourceReady?p.originalObservedAtUtc:null,
  originalIndependentAuditObservedAtUtc:handoff.auditedAtUtc,
  originalPreferredTCutAtUtc:a.cutAtUtc,
  deliveryMode:a.status,
  originalSourceCronProvenByThisReceipt:false,
  naturalDailyFullChainAccepted:false,
  sourceReady,
  lateSource:sourceReady?reportMeta.lateSource:null,
  sourceUniverseKind:sourceReady?p.sourceUniverseKind:null,
  sourceFourDigitSecuritiesScanned:sourceReady?p.sourceUniverseCount:null,
  fullMarketOrdinaryShareDenominator:null,
  descriptiveMatched:sourceReady?a.descriptiveSourceMatches:null,
  displayedResearchRows:sourceReady?a.displayedPreviewCount:null,
  zeroDescriptiveMatchesWhenVerified:sourceReady?
   a.descriptiveSourceMatches===0:null,
  researchRows:rows,
  githubActionsConsumerRunId:deliveryOrigin.consumerRunId,
  originalAuditRunId:a.auditRunId,
  originalSourceReceiptHash:handoff.originalSourceReceiptHash,
  originalIndependentAuditHash:handoff.independentSourceAuditHash,
  handoffReceiptHash:handoff.receiptHash,
  originReceiptHash:deliveryOrigin.deliveryOriginHash,
  reportMarkdownSha256:a.humanReportHash,
  deliveryAcceptanceHash:a.acceptanceHash,
  recordRetentionDays:30,
  archivalStorage:'EXISTING_GITHUB_ACTIONS_DERIVED_ARTIFACT',
  createdOnceOnly:true,
  readOnlyResearchSnapshot:true,
  historicPRReplayCannotStartProspectivePerformance:true,
  prospectiveForwardPerformanceCertified:false,
  durablePreOutcomeObservationIndependentlyCertified:false,
  snapshotIsOfficialFrozen:false,
  pitACertified:false,pitBCertified:false,
  selectedCount:null,zeroPickDay:null,
  shadowAuthorized:false,frozenD1Written:false,
  pushAuthorized:false,ordersAuthorized:false,
  providerMarketGetsAdded:0,newCronCount:0,cloudflareD1Writes:0,
  cloudflareR2Writes:0,system1FormalCoreChanged:false
 };
 return Object.freeze({...base,snapshotHash:await sha256Hex(base)});
}
