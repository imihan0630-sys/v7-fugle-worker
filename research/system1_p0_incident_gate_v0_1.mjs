// System 1 P0 2026-10-14 original physical incident ledger — PURE, READ-ONLY.
// This module classifies already authenticated external receipts. It NEVER
// queries or mutates production, derives a Formal C1 parent, or submits a POST.
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const ensureDay=(d)=>{if(!DAY.test(String(d||"")))throw Error("TARGET_MARKET_DATE_REQUIRED");return d;};
const whole=(v)=>Number.isInteger(v)&&v>=0;

export function classifyQuarterEpsSnapshot({marketDate,status,preliminaryCount=null}={}){
  ensureDay(marketDate);
  const sameDate=status?.marketDate===marketDate;
  const dataset=status?.datasets?.QUARTER_EPS;
  if(!sameDate||dataset?.ready!==true||!whole(dataset?.count))
    return {state:"EPS_SNAPSHOT_UNVERIFIED",scope:"CANDIDATE_SPECIFIC_NOT_FULL_MARKET",
      candidateEpsReportCount:null,preliminaryCountKnown:false,allCandidateEpsReviewed:false,
      mayDeclareFullMarketEpsCoverage:false,mayClaimNoCandidate:false};
  const n=dataset.count;
  const preliminaryCountKnown=whole(preliminaryCount);
  const allCandidateEpsReviewed=preliminaryCountKnown&&n===preliminaryCount;
  return {state:n===0?"EPS_CANDIDATE_RECEIPT_EMPTY":"EPS_CANDIDATE_RECEIPT_PRESENT",
    scope:"CANDIDATE_SPECIFIC_NOT_FULL_MARKET",candidateEpsReportCount:n,
    preliminaryCountKnown,allCandidateEpsReviewed,
    mayDeclareFullMarketEpsCoverage:false,
    mayClaimNoCandidate:preliminaryCountKnown&&preliminaryCount===0,
    fullMarketFinancialCompletenessCertified:false};
}

export function classifyAmbiguousRecovery({marketDate,priorPostHttpStatus,
 scanStatus=null,c1Generation=null,formalC1Binding=null}={}){
  ensureDay(marketDate);
  const priorUncertain=priorPostHttpStatus===503||priorPostHttpStatus==="TIMEOUT"||
    priorPostHttpStatus==="UNKNOWN";
  const scanDate=scanStatus?.scanDate??null;
  const formalPipelineComplete=scanStatus?.pipeline?.complete===true;
  const scanSameDate=scanDate===marketDate;
  const generationSameDate=c1Generation?.header?.sessionDate===marketDate&&
    c1Generation?.ok===true&&Boolean(c1Generation?.header?.generationId);
  const boundToSameParent=formalC1Binding?.status==="VERIFIED"&&
    formalC1Binding?.c1GenerationId===c1Generation?.header?.generationId;
  let state;
  if(!scanStatus||!scanDate)state="SCAN_READBACK_UNKNOWN";
  else if(!scanSameDate)state="FORMAL_SCAN_NOT_CONFIRMED";
  else if(!formalPipelineComplete)state="FORMAL_PIPELINE_UNVERIFIED";
  else if(!generationSameDate)state="SCAN_RECORDED_BUT_C1_PARENT_UNVERIFIED";
  else if(!boundToSameParent)state="C1_PARENT_UNBOUND_TO_FORMAL_DECISION";
  else state="FORMAL_C1_PARENT_BOUND_READONLY_CONFIRMED";
  return {state,marketDate,scanDate,priorUncertain,formalPipelineComplete,
    immutableC1ReceiptConfirmed:generationSameDate,
    formalC1BindingConfirmed:boundToSameParent,
    businessRecoveryStateUncertain:priorUncertain&&state!=="FORMAL_C1_PARENT_BOUND_READONLY_CONFIRMED",
    mayRetryBusinessPost:false,mayCountAsZeroPicks:false,
    mayPublishFormalPlan:false,noSyntheticC1:true,noPlanChanges:true,noPush:true,noTrade:true};
}

export const HISTORY60_CLASSES=Object.freeze([
  "60_BARS_AND_60_MARKET_SESSIONS_PRESENT",
  "CALENDAR_GAP_NEEDS_LISTING_OR_HALT_PROVENANCE",
  "LATEST_COMPLETED_QUOTE_NOT_PRESENT",
  "FEWER_THAN_60_COMPLETED_BARS"
]);
export function classifyHistory60Census({marketDate,classes,total,perSymbolProvenanceVerified=false}={}){
  ensureDay(marketDate);
  if(!whole(total)||!classes||HISTORY60_CLASSES.some(k=>!whole(classes[k]))||
    HISTORY60_CLASSES.reduce((n,k)=>n+classes[k],0)!==total)
    return {state:"HISTORY_DENOMINATOR_OR_PARTITION_UNVERIFIED",eligibleForFormalFullCoverage:false};
  const [aligned,gaps,stale,short]=HISTORY60_CLASSES.map(k=>classes[k]);
  const exact=aligned===total&&gaps===0&&stale===0&&short===0&&perSymbolProvenanceVerified===true;
  return {state:exact?"HISTORY_FULL_SESSION_COVERAGE_CONFIRMED":"HISTORY_PROVENANCE_PENDING",
    marketDate,total,aligned,listingOrHaltProvenancePending:gaps,
    latestSessionStale:stale,fewerThan60:short,
    gapIsNotAutomaticallyMissingApiData:true,
    eligibleForFormalFullCoverage:exact,mayAutoRepairWithoutVerifiedSource:false};
}

// A monitor is a source-observation identity, NOT a broker holding.
// A stale or trial quote cannot be converted into a valid trade via relabeling.
export function classifyMonitoringSafety({monitorKeys=[],brokerPositions=null,
 closedSymbols=[],quotesByKey={},freshPlanDate=null,marketDate}={}){
  ensureDay(marketDate);
  const ids=new Set();
  for(const key of monitorKeys){
    if(typeof key!=="string"||!/^(FORMAL|AIDEEN_APP):[1-9][0-9]{3}$/.test(key)||ids.has(key))
      throw Error("DUPLICATE_OR_INVALID_MONITOR_IDENTITY");
    ids.add(key);
  }
  const closed=new Set(closedSymbols.map(String));
  const positionsVerified=Array.isArray(brokerPositions);
  const actualHoldings=positionsVerified?new Set(brokerPositions.filter(x=>whole(x?.shares)&&x.shares>0).map(x=>String(x.symbol))):null;
  const monitoringNotPosition=[...ids].filter(k=>closed.has(k.split(":")[1])&&
    (actualHoldings===null||!actualHoldings.has(k.split(":")[1])));
  const trialQuotes=[...ids].filter(k=>quotesByKey[k]?.isTrial===true);
  const staleQuotes=[...ids].filter(k=>quotesByKey[k]?.quoteFresh!==true);
  return {state:!positionsVerified?"BROKER_PORTFOLIO_NOT_RECONCILED":
    (freshPlanDate!==marketDate?"FORMAL_PLAN_NOT_CURRENT":"MONITOR_ONLY_NOT_TRADING_AUTHORITY"),
    monitoringCount:ids.size,monitoringNotPosition,trialQuotes,staleQuotes,
    brokerPositionsVerified:positionsVerified,watchlistIsBrokerHolding:false,
    mayGenerateBuySellAdviceFromWatchlist:false,
    mayUseTrialQuoteForTrade:false,formalPlanCurrent:freshPlanDate===marketDate,
    noBrokerPositionMutation:true,noPush:true,noTrade:true};
}

// Physical provider CPU 10ms and original 90s quote-staleness are hard
// constraints. A source-only CI PASS or GitHub job success cannot override them.
export function classifyCpuReadiness({originalLimitMs=10,providerExceededResources,
  candidateOnly,workerDeployed,observedQuoteAgeSeconds=null,sourceIsTrial=false,
  underlyingBusinessState=null}={}){
  if(originalLimitMs!==10)throw Error("P0_ORIGINAL_FREE_CPU_LIMIT_CHANGED");
  const quoteVerified=Number.isFinite(observedQuoteAgeSeconds)&&
    observedQuoteAgeSeconds>=0&&observedQuoteAgeSeconds<=90&&sourceIsTrial===false;
  const actualPass=providerExceededResources===false&&candidateOnly===false&&
    workerDeployed===true&&quoteVerified&&underlyingBusinessState==="PASS_INTRADAY_MONITOR_FRESHNESS";
  return {state:actualPass?"ACTUAL_PRODUCTION_MONITOR_VERIFIED":"CPU_OR_RUNTIME_NOT_PHYSICALLY_ACCEPTED",
    actualPass,originalLimitMs,originalQuoteFreshSeconds:90,
    trialQuoteBlocked:sourceIsTrial===true,
    providerExceededResources:providerExceededResources===true,
    offlineCandidateIsNotDeployment:candidateOnly===true,
    githubActionSuccessAloneIsNotBusinessSuccess:true,
    freePlanUpgradeNotRequired:false,mayRelaxStaleness:false,mayPush:false,mayTrade:false};
}
