import {buildC4AllocationExperiment} from "./system1_c3_c4_c5_shadow_v0_1.mjs";
import {buildC5SemanticRepairDiagnostic} from "./system1_c5_semantic_repair_v0_2.mjs";
import {buildP1AConditionalReachUpperBound} from "./system1_p1a_conditional_reach_v0_1.mjs";
import {buildP1ASafetyCaptureDemand} from "./system1_p1a_safety_capture_demand_v0_1.mjs";
import {C3_CAPTURE_SLOTS} from "./system1_c3_capture_contract_v0_1.mjs";

const HEX64=/^[0-9a-f]{64}$/i;
const finite=x=>typeof x==="number"&&Number.isFinite(x)?x:null;
const round=(x,d=4)=>Number.isFinite(x)?Math.round(x*10**d)/10**d:null;
const ts=x=>typeof x==="string"&&/(?:Z|[+-]\d\d:\d\d)$/.test(x)?Date.parse(x):NaN;

function verifyC2(c2){
  if(c2?.schemaVersion!=="SYSTEM1_C2_PAIRED_LEDGER_V0_1"||
     c2?.completeMatchedCohort!==true||c2?.researchOnly!==true||
     c2?.formalCoreLocked!==true||!c2?.generationId||!c2?.sessionDate||
     !Number.isFinite(ts(c2?.decisionAt))||!Array.isArray(c2?.pairs)||
     c2.pairs.length!==c2?.tally?.populationN) throw new Error("S1_EVIDENCE_VERIFIED_C2_REQUIRED");
  return c2;
}
function taipeiSlot(iso){
  const ms=Date.parse(iso);
  if(!Number.isFinite(ms)) return null;
  const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Taipei",hour:"2-digit",minute:"2-digit",hourCycle:"h23"})
    .formatToParts(new Date(ms));
  const get=t=>parts.find(x=>x.type===t)?.value;
  return get("hour")+":"+get("minute");
}
function parseBar(row){
  if(row?.completed_bar!==1&&row?.completed_bar!==true) throw new Error("C3_LIVE_BAR_NOT_COMPLETED");
  let bar;
  try{bar=typeof row?.bar_json==="string"?JSON.parse(row.bar_json):row?.bar_json;}catch(_){throw new Error("C3_LIVE_BAR_JSON_INVALID");}
  const start=String(row?.bar_start||bar?.time||""),end=String(row?.bar_end||"");
  if(!Number.isFinite(ts(start))||!Number.isFinite(ts(end))||ts(end)<=ts(start)) throw new Error("C3_LIVE_BAR_TIME_INVALID");
  const out={start,end,slot:taipeiSlot(start),open:finite(bar?.open),high:finite(bar?.high),low:finite(bar?.low),close:finite(bar?.close),
    volume:finite(bar?.volume),volumeRatio:finite(bar?.volumeRatio),depthScore:finite(bar?.depthScore),
    limitUp:typeof bar?.limitUp==="boolean"?bar.limitUp:null,lateStage:typeof bar?.lateStage==="boolean"?bar.lateStage:null};
  if(!C3_CAPTURE_SLOTS.includes(out.slot)||[out.open,out.high,out.low,out.close].some(x=>!(x>0))||
     out.high<Math.max(out.open,out.close)||out.low>Math.min(out.open,out.close)||out.volume===null||out.volume<0)
    throw new Error("C3_LIVE_BAR_VALUES_INVALID");
  return out;
}
function receiptMap(rows,label){
  const map=new Map();
  for(const row of rows||[]){
    const symbol=String(row?.symbol||"").trim();
    if(!symbol||map.has(symbol)) throw new Error(label+"_DUPLICATE_OR_INVALID_SYMBOL");
    map.set(symbol,row);
  }
  return map;
}
function verifiedPriorClose(row,c2){
  if(row?.verified!==true||row?.parentId!==c2.generationId||row?.sessionDate!==c2.sessionDate||
     !(finite(row?.close)>0)||!Number.isFinite(ts(row?.knownAt))||ts(row.knownAt)>ts(c2.decisionAt))
    return null;
  return row.close;
}
function verifiedGeometry(row,c2){
  const g=row?.geometry;
  if(g?.authenticated!==true||g?.parentId!==c2.generationId||g?.sessionDate!==c2.sessionDate||
     !Number.isFinite(ts(g?.knownAt))||ts(g.knownAt)>ts(c2.decisionAt)||!(finite(g.stop)>0)||!(finite(g.target)>0))
    return null;
  if(g.support!=null&&!(finite(g.support)>0)) return null;
  if(g.breakout!=null&&!(finite(g.breakout)>0)) return null;
  return g;
}
function verifiedFormalBaseline(row,c2){
  if(row?.verified!==true||row?.parentId!==c2.generationId||row?.sessionDate!==c2.sessionDate||
     !Number.isFinite(ts(row?.knownAt))||ts(row.knownAt)<=ts(c2.decisionAt)||
     !["TRIGGERED","NO_TRIGGER"].includes(row?.status)) return null;
  return row;
}
function barStateContext(row,barStart){
  if(!row||row?.barStart!==barStart) return null;
  const bidDepth5=finite(row?.bidDepth5),askDepth5=finite(row?.askDepth5),depthImbalance=finite(row?.depthImbalance),spreadPct=finite(row?.spreadPct);
  const limitVerified=row?.verified===true&&typeof row?.limitUp==="boolean";
  const rawDepthComplete=bidDepth5!==null&&bidDepth5>=0&&askDepth5!==null&&askDepth5>=0&&depthImbalance!==null;
  return {
    limitUp:limitVerified?row.limitUp:null,limitVerified,
    marketState:typeof row?.marketState==="string"?row.marketState:null,
    quoteTimestamp:typeof row?.quoteTimestamp==="string"?row.quoteTimestamp:null,
    bidDepth5,askDepth5,depthImbalance,spreadPct,rawDepthComplete,
    rawDepthOnly:row?.rawDepthOnly===true,depthScoreDerived:row?.depthScoreDerived===true
  };
}
function verifiedSelectionContext(pair,c2){
  const x=pair?.selectionContext,p=x?.provenance;
  if(p?.authenticated!==true||p?.parentId!==c2.generationId||p?.sessionDate!==c2.sessionDate||
     !Number.isFinite(ts(p?.knownAt))||ts(p.knownAt)>ts(c2.decisionAt)) return null;
  return {
    close:finite(x.close),depthScore:finite(x.depthScore),
    lateStage:typeof x.lateStage==="boolean"?x.lateStage:null,
    channel:["A","B"].includes(x.channel)?x.channel:null,
    entryGeometry:x.entryGeometry&&typeof x.entryGeometry==="object"?x.entryGeometry:null
  };
}
function geometryFromSelectionContext(ctx,c2){
  const g=ctx?.entryGeometry;
  if(!g||!(finite(g.stop)>0)||!(finite(g.target)>0)) return null;
  const support=g.support==null?null:finite(g.support),breakout=g.breakout==null?null:finite(g.breakout);
  if(g.support!=null&&!(support>0)) return null;
  if(g.breakout!=null&&!(breakout>0)) return null;
  return {authenticated:true,parentId:c2.generationId,sessionDate:c2.sessionDate,knownAt:c2.decisionAt,
    entry:finite(g.entry),stop:g.stop,target:g.target,support,breakout};
}
function eligibleShortSymbols(c2){
  return c2.pairs.filter(p=>p?.short?.gateStatus==="PASS"&&Array.isArray(p?.short?.missingSafety)&&p.short.missingSafety.length===0)
    .map(p=>String(p.symbol));
}

export function auditC3LiveInputs(c2Ledger,{
  captureRows=[],geometryReceipts=[],formalBaselineReceipts=[],priorCloseReceipts=[],barStateReceipts=[],scopeSymbols=null
}={}){
  const c2=verifyC2(c2Ledger),allEligible=eligibleShortSymbols(c2),allEligibleSet=new Set(allEligible);
  let scoped=allEligible;
  if(scopeSymbols!==null){
    if(!Array.isArray(scopeSymbols)||new Set(scopeSymbols.map(String)).size!==scopeSymbols.length) throw new Error("C3_SCOPE_SYMBOLS_INVALID");
    scoped=scopeSymbols.map(String);
    if(scoped.some(symbol=>!allEligibleSet.has(symbol))) throw new Error("C3_SCOPE_OUTSIDE_ELIGIBLE_DENOMINATOR");
  }
  const eligible=new Set(scoped);
  const geometry=receiptMap(geometryReceipts,"C3_GEOMETRY");
  const formal=receiptMap(formalBaselineReceipts,"C3_FORMAL_BASELINE");
  const prior=receiptMap(priorCloseReceipts,"C3_PRIOR_CLOSE");
  const stateByKey=new Map();
  for(const r of barStateReceipts||[]){
    const key=String(r?.symbol||"")+"|"+String(r?.barStart||"");
    if(!r?.symbol||!r?.barStart||stateByKey.has(key)) throw new Error("C3_BAR_STATE_DUPLICATE_OR_INVALID");
    stateByKey.set(key,r);
  }
  const grouped=new Map();
  for(const row of captureRows||[]){
    if(row?.generation_id!==c2.generationId) throw new Error("C3_CAPTURE_GENERATION_MISMATCH");
    const symbol=String(row?.symbol||"");
    if(!eligible.has(symbol)) continue;
    const bar=parseBar(row);
    if(!grouped.has(symbol)) grouped.set(symbol,[]);
    grouped.get(symbol).push(bar);
  }

  const rows=[],readyReceipts=[];
  for(const symbol of [...eligible].sort()){
    const bars=(grouped.get(symbol)||[]).sort((a,b)=>ts(a.start)-ts(b.start));
    const slots=bars.map(x=>x.slot),slotSet=new Set(slots);
    const duplicateSlots=[...new Set(slots.filter((x,i)=>slots.indexOf(x)!==i))];
    const missingSlots=C3_CAPTURE_SLOTS.filter(x=>!slotSet.has(x));
    const blockers=[];
    if(duplicateSlots.length) blockers.push("DUPLICATE_15M_SLOT");
    if(missingSlots.length) blockers.push("INCOMPLETE_15M_SESSION");
    const pair=c2.pairs.find(x=>String(x.symbol)===symbol);
    const ctx=verifiedSelectionContext(pair,c2);
    const explicitGeometry=verifiedGeometry(geometry.get(symbol),c2);
    const g=explicitGeometry||geometryFromSelectionContext(ctx,c2);
    if(!g) blockers.push("GEOMETRY_UNVERIFIED");
    const explicitPrior=verifiedPriorClose(prior.get(symbol),c2);
    const pc=explicitPrior>0?explicitPrior:ctx?.close;
    if(!(pc>0)) blockers.push("PRIOR_CLOSE_UNVERIFIED");
    const selectionDepth=ctx?.depthScore;
    if(selectionDepth===null||selectionDepth===undefined||selectionDepth<0) blockers.push("SELECTION_DEPTH_UNVERIFIED");
    const selectionLateStage=ctx?.lateStage;
    if(typeof selectionLateStage!=="boolean") blockers.push("SELECTION_LATE_STAGE_UNVERIFIED");
    const fb=verifiedFormalBaseline(formal.get(symbol),c2);
    const formalBaseline=fb||{
      verified:false,parentId:c2.generationId,sessionDate:c2.sessionDate,knownAt:null,status:"UNKNOWN",
      reason:"FORMAL_BASELINE_UNAVAILABLE_FOR_SHADOW_ONLY"
    };

    const adapted=[];
    for(const bar of bars){
      const live=barStateContext(stateByKey.get(symbol+"|"+bar.start),bar.start);
      const missing=[];
      if(bar.volumeRatio===null) missing.push("VOLUME_RATIO");
      if(!live?.limitVerified) missing.push("LIVE_LIMIT_STATE");
      if(missing.length) blockers.push("BAR_MICROSTRUCTURE_UNVERIFIED");
      adapted.push({
        startAt:bar.start,endAt:bar.end,slot:bar.slot,
        open:bar.open,high:bar.high,low:bar.low,close:bar.close,
        volumeRatio:bar.volumeRatio,
        depthScore:selectionDepth??null,
        selectionDepthScore:selectionDepth??null,
        depthScoreSemantics:"SELECTION_TIME_CONTEXT_REUSED_NOT_LIVE_ORDER_BOOK",
        liveBidDepth5:live?.bidDepth5??null,liveAskDepth5:live?.askDepth5??null,
        liveDepthImbalance:live?.depthImbalance??null,liveSpreadPct:live?.spreadPct??null,
        liveDepthRawComplete:live?.rawDepthComplete===true,liveDepthScore:null,liveDepthScoreDerived:false,
        gapPct:pc>0?round((bars[0].open/pc-1)*100,6):null,
        completed:true,limitUp:live?.limitVerified?live.limitUp:null,lateStage:selectionLateStage??null,
        selectionContextSemantics:true,liveMarketState:live?.marketState??null,
        liveQuoteTimestamp:live?.quoteTimestamp??null,missingMicrostructure:missing
      });
    }
    const uniqueBlockers=[...new Set(blockers)];
    const status=uniqueBlockers.length?"INPUT_BLOCKED":"READY";
    const baseSetup=ctx?.channel||(["A","B"].includes(geometry.get(symbol)?.baseSetup)?geometry.get(symbol).baseSetup:null);
    if(status==="READY"&&!baseSetup) uniqueBlockers.push("BASE_SETUP_UNVERIFIED");
    const finalStatus=uniqueBlockers.length?"INPUT_BLOCKED":"READY";
    if(finalStatus==="READY"){
      readyReceipts.push({symbol,parentId:c2.generationId,sessionDate:c2.sessionDate,baseSetup,
        geometry:g,formalBaseline,bars:adapted});
    }
    const liveDepthCompleteBars=adapted.filter(x=>x.liveDepthRawComplete===true).length;
    rows.push({symbol,status:finalStatus,barCount:bars.length,missingSlots,duplicateSlots,
      blockers:uniqueBlockers,selectionDepthVerified:selectionDepth!==null&&selectionDepth!==undefined,
      selectionLateStageVerified:typeof selectionLateStage==="boolean",
      liveLimitStateAvailableBars:adapted.filter(x=>typeof x.limitUp==="boolean").length,
      liveDepthCompleteBars,liveDepthCoveragePct:bars.length?round(liveDepthCompleteBars/bars.length*100,4):null,
      liveSpreadAvailableBars:adapted.filter(x=>x.liveSpreadPct!==null).length,
      volumeRatioAvailableBars:adapted.filter(x=>x.volumeRatio!==null).length,
      depthGuardSource:"SELECTION_TIME_DEPTH_SCORE",depthGuardUsesLiveOrderBook:false,
      gapPctVerified:pc>0,geometryVerified:!!g,formalBaselineVerified:!!fb,
      researchOnly:true,decisionImpact:false});
  }
  const readyN=rows.filter(x=>x.status==="READY").length;
  return {schemaVersion:"SYSTEM1_C3_LIVE_INPUT_AUDIT_V0_4",generationId:c2.generationId,sessionDate:c2.sessionDate,
    fullEligibleN:allEligible.length,scope:"CAPTURE_COHORT_OR_FULL_ELIGIBLE",scopedSymbols:[...eligible].sort(),
    eligibleN:rows.length,readyN,blockedN:rows.length-readyN,coveragePct:rows.length?round(readyN/rows.length*100):null,
    rows,readyReceipts,missingMeansUnknown:true,formalBaselineMissingDoesNotBlockChallenger:true,
    formalBaselineUnknownNeverCountedAsNoTrigger:true,selectionDepthNeverImputed:true,selectionLateStageNeverImputed:true,limitStateNeverImputed:true,
    depthGuardSource:"SELECTION_TIME_DEPTH_SCORE_REPLICATED_ACROSS_INTRADAY_BARS",
    liveDepthCapturedForAuditOnly:true,liveDepthScoreMappingPreregistered:false,liveDepthUsedByTrigger:false,
    depthGuardMustNotBeDescribedAsLiveOrderBook:true,
    economicSuperiority:"UNKNOWN",researchOnly:true,decisionImpact:false,formalCoreImpact:false,noTrade:true,noPush:true};
}

function sortedCounts(obj){return Object.entries(obj||{}).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).map(([key,count])=>({key,count}));}
export function buildC5DailyReport(c1Diagnosis,c2Ledger){
  const short=buildC5SemanticRepairDiagnostic(c1Diagnosis,c2Ledger,{strategy:"SHORT"});
  const swing=buildC5SemanticRepairDiagnostic(c1Diagnosis,c2Ledger,{strategy:"SWING"});
  const conditionalShort=buildP1AConditionalReachUpperBound(c1Diagnosis,short);
  const conditionalSwing=buildP1AConditionalReachUpperBound(c1Diagnosis,swing);
  const safetyCaptureDemandShort=buildP1ASafetyCaptureDemand(short,conditionalShort);
  const safetyCaptureDemandSwing=buildP1ASafetyCaptureDemand(swing,conditionalSwing);
  const render=d=>({
    formalRejectedN:d.formalRejectedN,
    p1aRejectedN:d.p1aRejectedN,
    p1aOnlyN:d.p1aOnlyN,
    p1aPlusContextN:d.p1aPlusContextN,
    p1aPlusPrimaryN:d.p1aPlusPrimaryN,
    unknownContaminatedN:d.unknownContaminatedN,
    hardBlockedN:d.hardBlockedN,
    p1aReachABN:d.p1aReachABN,
    p1aABPassN:d.p1aABPassN,
    p1aReachRRN:d.p1aReachRRN,
    p1aRRPassN:d.p1aRRPassN,
    p1aGradePassN:d.p1aGradePassN,
    p1aRankableN:d.p1aRankableN,
    topFailedGates:sortedCounts(d.gateFails).slice(0,10),
    topUnknownGates:sortedCounts(d.gateUnknown).slice(0,10),
    roleFailures:sortedCounts(d.roleFails),
    minimalClasses:sortedCounts(d.minimalClassCounts),
    reachStages:sortedCounts(d.reachCounts)
  });
  const renderConditional=d=>({
    p1aStrictRankableN:d.p1aStrictRankableN,
    p1aConditionalSafetyUnknownN:d.p1aConditionalSafetyUnknownN,
    p1aConditionalReachABN:d.p1aConditionalReachABN,
    p1aConditionalABPassN:d.p1aConditionalABPassN,
    p1aConditionalReachRRN:d.p1aConditionalReachRRN,
    p1aConditionalRRPassN:d.p1aConditionalRRPassN,
    p1aConditionalGradePassN:d.p1aConditionalGradePassN,
    p1aConditionalRankableN:d.p1aConditionalRankableN,
    verifiedSafetyFailN:d.verifiedSafetyFailN,
    nonSafetyUnknownBlockedN:d.nonSafetyUnknownBlockedN,
    stageCounts:sortedCounts(d.stageCounts),
    interpretation:d.interpretation,
    materialityThresholdStatus:d.materialityThresholdStatus,
    safetyCaptureDecision:d.safetyCaptureDecision
  });
  const renderSafetyDemand=d=>({
    denominator:d.denominator,
    ratios:d.ratios,
    familyDemand:d.familyDemand,
    combinationDemand:d.combinationDemand,
    demandState:d.demandState,
    materialityThresholdStatus:d.materialityThresholdStatus,
    materialityClassification:d.materialityClassification,
    captureLaneAuthorization:d.captureLaneAuthorization,
    classBImplementationAuthorized:d.classBImplementationAuthorized
  });
  return {schemaVersion:"SYSTEM1_C5_DAILY_REPORT_V0_4",sessionDate:c2Ledger.sessionDate,generationId:c2Ledger.generationId,
    sourceRoleInventory:"SYSTEM1_A2_GATE_ROLE_INVENTORY_V0_1",
    p1aContract:"SYSTEM1_P1A_MINIMAL_BLOCKING_AND_OUTCOME_CONTRACT_20261003_V0_1",
    conditionalContract:"SYSTEM1_P1A_CONDITIONAL_REACH_UPPER_BOUND_CONTRACT_20261003_V0_1",
    short:render(short),swing:render(swing),
    conditionalShort:renderConditional(conditionalShort),conditionalSwing:renderConditional(conditionalSwing),
    safetyCaptureDemandShort:renderSafetyDemand(safetyCaptureDemandShort),
    safetyCaptureDemandSwing:renderSafetyDemand(safetyCaptureDemandSwing),
    denominatorN:c2Ledger.tally.populationN,
    firstFailureIsNotCausalAttribution:true,unknownNeverPasses:true,p1aRankableIsNotCandidate:true,
    conditionalRankableIsNotCandidate:true,conditionalUnknownToPassMutation:false,
    safetyCaptureDemandIsEngineeringDemandOnly:true,classBImplementationAuthorized:false,
    materialityThresholdInvented:false,candidateCountLiftIsNotSuccess:true,
    economicSuperiority:"UNKNOWN",formalOptimizationCandidate:"NONE",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,noTrade:true,noPush:true};
}

export function buildC4DailyComparison(candidates,options={}){
  const exp=buildC4AllocationExperiment(candidates,options);
  return {schemaVersion:"SYSTEM1_C4_DAILY_COMPARISON_V0_1",
    selectedCount:exp.selectedCount,totalCapitalNTD:exp.totalCapitalNTD,nominalDeployRatioPct:exp.nominalDeployRatioPct??0,
    comparators:exp.comparators.map(x=>({name:x.name,plannedAllocationNTD:x.plannedAllocationNTD,
      capitalUtilizationPct:x.capitalUtilizationPct,reserveVsNominalTargetNTD:x.reserveVsNominalTargetNTD,
      plannedStopRiskNTD:x.plannedStopRiskNTD,plannedStopRiskPctCapital:x.plannedStopRiskPctCapital,riskHHI:x.riskHHI,
      rows:x.rows})),
    preferredAllocator:null,economicSuperiority:"UNKNOWN",sameCandidateSet:true,researchOnly:true,
    decisionImpact:false,formalCoreImpact:false,noTrade:true,noPush:true};
}

export const FORMAL_SWITCH_MATURITY_V0_1=Object.freeze({
  matureD5Rows:60,completeProspectiveSnapshots:30,independentScanDates:15,calendarYears:2,marketRegimes:2,
  dateClusterDirectionAgreementPct:70
});

export function evaluateFormalSwitchMaturity({
  matureD5Rows=0,completeProspectiveSnapshots=0,scanDates=[],calendarYears=[],marketRegimes=[],
  dateClusterDirectionAgreementPct=null,sourceCoveragePass=false,purgedHoldoutPass=false,
  multipleTestingPass=false,redundancyPass=false,costStressPass=false,
  afterCostReturnAvailable=false,drawdownTailAvailable=false,mfeMaeAvailable=false,
  triggerFillFunnelAvailable=false,turnoverConcentrationAvailable=false,deploymentReserveAvailable=false,
  brokerFillsCashComplete=false
}={}){
  const t=FORMAL_SWITCH_MATURITY_V0_1;
  const uniqueDates=new Set(scanDates).size,uniqueYears=new Set(calendarYears).size,uniqueRegimes=new Set(marketRegimes).size;
  const checks={
    matureD5Rows:matureD5Rows>=t.matureD5Rows,
    completeProspectiveSnapshots:completeProspectiveSnapshots>=t.completeProspectiveSnapshots,
    independentScanDates:uniqueDates>=t.independentScanDates,
    calendarYears:uniqueYears>=t.calendarYears,
    marketRegimes:uniqueRegimes>=t.marketRegimes,
    dateClusterDirectionAgreementPct:finite(dateClusterDirectionAgreementPct)!==null&&dateClusterDirectionAgreementPct>=t.dateClusterDirectionAgreementPct,
    sourceCoveragePass:sourceCoveragePass===true,purgedHoldoutPass:purgedHoldoutPass===true,
    multipleTestingPass:multipleTestingPass===true,redundancyPass:redundancyPass===true,costStressPass:costStressPass===true,
    afterCostReturnAvailable:afterCostReturnAvailable===true,drawdownTailAvailable:drawdownTailAvailable===true,
    mfeMaeAvailable:mfeMaeAvailable===true,triggerFillFunnelAvailable:triggerFillFunnelAvailable===true,
    turnoverConcentrationAvailable:turnoverConcentrationAvailable===true,deploymentReserveAvailable:deploymentReserveAvailable===true,
    brokerFillsCashComplete:brokerFillsCashComplete===true
  };
  const blockers=Object.entries(checks).filter(([,ok])=>!ok).map(([key])=>key);
  return {schemaVersion:"SYSTEM1_FORMAL_SWITCH_MATURITY_GATE_V0_1",thresholds:t,
    observed:{matureD5Rows,completeProspectiveSnapshots,independentScanDates:uniqueDates,calendarYears:uniqueYears,
      marketRegimes:uniqueRegimes,dateClusterDirectionAgreementPct:finite(dateClusterDirectionAgreementPct)},
    checks,blockers,eligibleForClassCReview:blockers.length===0,
    formalOptimizationCandidate:blockers.length===0?"EVIDENCE_GATE_PASSED_REVIEW_REQUIRED":"NO",
    autoSwitchAuthorized:false,formalCoreLocked:true,researchOnly:true,decisionImpact:false,formalCoreImpact:false};
}
