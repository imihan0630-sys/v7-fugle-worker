import {createHash} from "node:crypto";

export const SELECTED_TO_BUY_CAUSES=Object.freeze([
  "DATA_COVERAGE_UNKNOWN","SOURCE_FRESHNESS_BLOCK","PLAN_VALIDITY_BLOCK",
  "A_NEVER_REACHED_ZONE","A_ZONE_FAILED_OR_NO_CONFIRM","B_NO_VALID_BREAKOUT",
  "B_VALID_BREAKOUT_NO_RETEST","B_RETEST_FAILED_OR_NO_REACCELERATION",
  "MAX_CHASE_15M_BLOCK_B","MAX_CHASE_QUOTE_BLOCK","STOP_PLAN_INVALIDATED",
  "TRIAL_QUOTE_BLOCK","BUY_SIGNAL_OBSERVED_NO_FILL_EVIDENCE"
]);
const DATE=/^\d{4}-\d{2}-\d{2}$/;
const finite=x=>typeof x==="number"&&Number.isFinite(x)?x:null;
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==="object"
  ?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const hash=x=>createHash("sha256").update(JSON.stringify(canonical(x))).digest("hex");
const inc=(o,k)=>{o[k]=(o[k]||0)+1;};
const ts=x=>typeof x==="string"&&Number.isFinite(Date.parse(x))?Date.parse(x):NaN;

function validPlan(plan,sessionDate,generationId){
  return plan&&String(plan.symbol||"")&&String(plan.planIdentity||"")&&
    plan.generationId===generationId&&["NONE"].includes(String(plan.positionStage||""))&&
    ["MOMENTUM","PULLBACK"].includes(String(plan.mode||""))&&
    (plan.planDate===null||plan.planDate===undefined||DATE.test(String(plan.planDate)));
}
function sameIdentity(row,sessionDate,generationId,plan){
  return row?.sessionDate===sessionDate&&row?.generationId===generationId&&
    String(row?.symbol||"")===String(plan.symbol)&&String(row?.planIdentity||"")===String(plan.planIdentity);
}
function text(x){return String(x||"");}

export function classifySelectedToBuyMonitorRun(run,plan){
  const base={runId:String(run?.runId||""),observedAt:run?.observedAt??null,
    cause:null,classification:"UNRESOLVED",evidenceStrength:"NONE",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false};
  if(run?.completed!==true||run?.planPresent!==true||run?.result?.ok!==true)
    return {...base,cause:"DATA_COVERAGE_UNKNOWN",classification:"BLOCKED",evidenceStrength:"EXACT_RUN_NEGATIVE"};

  const r=run.result,exec=r.executionData||{},finalLevel=String(r.finalDecision?.level||"UNKNOWN");
  if(exec.quoteFresh!==true||exec.formal15Fresh!==true)
    return {...base,cause:"SOURCE_FRESHNESS_BLOCK",classification:"BLOCKED",evidenceStrength:"EXACT_RUNTIME_STATE"};

  if(plan.planDate&&plan.planDate!==run.sessionDate)
    return {...base,cause:"PLAN_VALIDITY_BLOCK",classification:"BLOCKED",evidenceStrength:"EXACT_PLAN_DATE"};

  if(r.quote?.isTrial===true||/試撮行情/.test(text(r.finalDecision?.text)))
    return {...base,cause:"TRIAL_QUOTE_BLOCK",classification:"BLOCKED",evidenceStrength:"EXACT_RUNTIME_STATE"};

  if(r.stop?.level==="risk")
    return {...base,cause:"STOP_PLAN_INVALIDATED",classification:"BLOCKED",evidenceStrength:"EXACT_RUNTIME_STATE"};

  const maxChase=finite(plan.maxChase),currentPrice=finite(r.currentPrice);
  if(finalLevel==="buy"){
    if(maxChase!==null&&currentPrice!==null&&currentPrice>maxChase)
      return {...base,cause:"MAX_CHASE_QUOTE_BLOCK",classification:"BLOCKED",evidenceStrength:"EXACT_OPERATION_PREDICATE",
        observed:{currentPrice,maxChase}};
    return {...base,classification:"BUY_ELIGIBLE_AT_OPERATION_LAYER",evidenceStrength:"EXACT_RUNTIME_STATE"};
  }

  const latest15=r.frame15?.latest||null,latestClose=finite(latest15?.close);
  if(plan.mode==="MOMENTUM"){
    if(maxChase!==null&&latestClose!==null&&latestClose>maxChase)
      return {...base,cause:"MAX_CHASE_15M_BLOCK_B",classification:"BLOCKED",evidenceStrength:"EXACT_FORMAL_PREDICATE",
        observed:{latest15Close:latestClose,maxChase}};

    const momentumText=text(r.momentum15?.text);
    if(/已站上突破價，但尚未完成量價確認|碰突破價後跌回|B等待15分K有效突破/.test(momentumText))
      return {...base,cause:"B_NO_VALID_BREAKOUT",classification:"BLOCKED",evidenceStrength:"EXACT_FROZEN_TEXT_CONTRACT"};
    if(/突破已確認，等待回測突破位，不直接追/.test(momentumText))
      return {...base,cause:"B_VALID_BREAKOUT_NO_RETEST",classification:"BLOCKED",evidenceStrength:"EXACT_FROZEN_TEXT_CONTRACT"};
    if(/突破後回測失守承接區|已回測承接區並守住，等待完整K轉強確認/.test(momentumText))
      return {...base,cause:"B_RETEST_FAILED_OR_NO_REACCELERATION",classification:"BLOCKED",evidenceStrength:"EXACT_FROZEN_TEXT_CONTRACT"};
  }

  if(plan.mode==="PULLBACK"){
    const pullText=text(r.pullback?.text);
    if(/等待拉回至承接區，不追價/.test(pullText))
      return {...base,cause:"A_NEVER_REACHED_ZONE",classification:"BLOCKED",evidenceStrength:"EXACT_FROZEN_TEXT_CONTRACT"};
    if(/拉回承接區下緣失守|下跌放量，不承接|進入拉回承接區|等待拉回承接條件/.test(pullText))
      return {...base,cause:"A_ZONE_FAILED_OR_NO_CONFIRM",classification:"BLOCKED",evidenceStrength:"EXACT_FROZEN_TEXT_CONTRACT"};
  }
  return {...base,classification:"NO_BUY_CAUSE_UNRESOLVED",evidenceStrength:"COMPLETE_RUN_CAUSE_NOT_IDENTIFIED"};
}

export function buildSelectedToBuySessionCauseReceipt({
  sessionDate,generationId,plan,expectedRunIds=[],monitorRuns=[],signalRows=[],signalCoverageComplete=false
}={}){
  if(!DATE.test(String(sessionDate||""))||!String(generationId||"")||!validPlan(plan,sessionDate,generationId))
    throw new Error("SELECTED_TO_BUY_SESSION_IDENTITY_REQUIRED");
  if(!Array.isArray(expectedRunIds)||!Array.isArray(monitorRuns)||!Array.isArray(signalRows))
    throw new Error("SELECTED_TO_BUY_ARRAY_INPUTS_REQUIRED");
  const expected=[...new Set(expectedRunIds.map(String))].sort();
  if(expected.length!==expectedRunIds.length||expected.some(x=>!x)) throw new Error("SELECTED_TO_BUY_EXPECTED_RUN_IDS_INVALID");

  const runMap=new Map(),foreignRuns=[];
  for(const run of monitorRuns){
    if(!sameIdentity(run,sessionDate,generationId,plan)){foreignRuns.push(String(run?.runId||"?"));continue;}
    const id=String(run.runId||"");
    if(!id||runMap.has(id)) throw new Error("SELECTED_TO_BUY_DUPLICATE_RUN");
    if(!Number.isFinite(ts(run.observedAt))) throw new Error("SELECTED_TO_BUY_RUN_CLOCK_REQUIRED");
    runMap.set(id,run);
  }
  const unexpectedRunIds=[...runMap.keys()].filter(id=>!expected.includes(id)).sort();
  const missingRunIds=expected.filter(id=>!runMap.has(id));
  const expectedRuns=expected.map(id=>runMap.get(id)).filter(Boolean);
  const incompleteRunIds=expectedRuns.filter(r=>r.completed!==true||r.planPresent!==true).map(r=>String(r.runId)).sort();
  const monitorCoverageComplete=expected.length>0&&missingRunIds.length===0&&unexpectedRunIds.length===0&&
    incompleteRunIds.length===0&&foreignRuns.length===0;

  const validSignals=[],invalidSignals=[];
  for(const s of signalRows){
    if(!sameIdentity(s,sessionDate,generationId,plan)||!Number.isFinite(ts(s.occurredAt))){invalidSignals.push(s);continue;}
    validSignals.push(s);
  }
  const buySignals=validSignals.filter(s=>String(s.signalType||"")==="BUY");
  const buyObserved=buySignals.length>0;

  const runRows=expectedRuns.sort((a,b)=>expected.indexOf(String(a.runId))-expected.indexOf(String(b.runId)))
    .map(run=>({...classifySelectedToBuyMonitorRun(run,plan),runId:String(run.runId),observedAt:run.observedAt}));
  const causeEventCounts={},causeSet=[];
  for(const r of runRows){
    if(r.cause){inc(causeEventCounts,r.cause);if(!causeSet.includes(r.cause)) causeSet.push(r.cause);}
  }
  causeSet.sort();

  const noBuyCoverageComplete=monitorCoverageComplete&&signalCoverageComplete===true&&!buyObserved;
  let sessionState;
  if(buyObserved) sessionState="BUY_SIGNAL_OBSERVED_NO_FILL_EVIDENCE";
  else if(!noBuyCoverageComplete) sessionState="NO_BUY_UNKNOWN_COVERAGE";
  else sessionState="NO_BUY_COMPLETE";

  const maxChaseCauseSet=causeSet.filter(x=>["MAX_CHASE_15M_BLOCK_B","MAX_CHASE_QUOTE_BLOCK"].includes(x));
  const primaryMaxChaseCause=maxChaseCauseSet.includes("MAX_CHASE_15M_BLOCK_B")
    ?"MAX_CHASE_15M_BLOCK_B":maxChaseCauseSet[0]||null;
  const bridgeCauseRow=primaryMaxChaseCause?{
    schemaVersion:"SYSTEM1_SELECTED_TO_BUY_CAUSE_ROW_V0_1",
    sessionDate,generationId,symbol:String(plan.symbol),planIdentity:String(plan.planIdentity),
    coverageComplete:noBuyCoverageComplete,cause:primaryMaxChaseCause,
    secondaryCauses:maxChaseCauseSet.filter(x=>x!==primaryMaxChaseCause),
    causeEventCounts:Object.fromEntries(maxChaseCauseSet.map(x=>[x,causeEventCounts[x]||0])),
    researchOnly:true,decisionImpact:false,formalCoreImpact:false
  }:null;

  const unresolvedRunN=runRows.filter(r=>r.classification==="NO_BUY_CAUSE_UNRESOLVED"||
    r.cause==="DATA_COVERAGE_UNKNOWN").length;
  const receipt={
    schemaVersion:"SYSTEM1_SELECTED_TO_BUY_SESSION_CAUSE_V0_1",
    sessionDate,generationId,symbol:String(plan.symbol),planIdentity:String(plan.planIdentity),
    mode:plan.mode,expectedRunN:expected.length,observedExpectedRunN:expectedRuns.length,
    monitorCoverageComplete,signalCoverageComplete:signalCoverageComplete===true,
    noBuyCoverageComplete,buyObserved,buySignalN:buySignals.length,
    missingRunIds,unexpectedRunIds,incompleteRunIds,foreignRunN:foreignRuns.length,invalidSignalN:invalidSignals.length,
    sessionState,causeEventCounts,causeSet,unresolvedRunN,
    maxChase:{
      observed:maxChaseCauseSet.length>0,
      uniqueSymbolN:maxChaseCauseSet.length>0?1:0,
      causeMembershipN:maxChaseCauseSet.length,
      causeSet:maxChaseCauseSet,
      eventN:maxChaseCauseSet.reduce((n,x)=>n+(causeEventCounts[x]||0),0)
    },
    bridgeCauseRow,runRows,
    evidenceRules:{
      missingBuyNeverNoBuy:true,
      positiveBuyDoesNotRequireNegativeCoverage:true,
      noBuyRequiresExpectedMonitorCoverage:true,
      noBuyRequiresSignalCoverage:true,
      maxChase15mUsesExactNumericPredicate:true,
      maxChaseQuoteUsesExactOperationPredicate:true,
      textCausesRequireFrozenRuntimePhrases:true,
      actualFillUnknown:true
    },
    economicSuperiority:"UNKNOWN",formalOptimizationCandidate:"NONE",autoSwitchAuthorized:false,
    formalCoreLocked:true,researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    noPlanChanges:true,noTrade:true,noPush:true
  };
  return {...receipt,fingerprint:hash(receipt)};
}
