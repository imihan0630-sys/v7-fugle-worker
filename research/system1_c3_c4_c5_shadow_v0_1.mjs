import {createHash} from "node:crypto";

const ROLES=Object.freeze({
  HARD_INVALIDATION:"HARD_INVALIDATION",
  PRIMARY_ALPHA:"PRIMARY_ALPHA",
  SUPPORTIVE:"SUPPORTIVE",
  CONTEXT_ONLY:"CONTEXT_ONLY",
  UNCERTAINTY:"CONFIDENCE_UNCERTAINTY"
});
export {ROLES};

const SAFETY=new Set(["SOURCE_AUTHENTICITY","SESSION_CONTINUITY","CORPORATE_ACTION_CONTINUITY","EXECUTION_FEASIBILITY","ACCOUNT_RISK"]);
const OWNER_HARD=new Set(["PRICE_FLOOR"]);
const EVENT_HARD=new Set(["ANNOUNCEMENT_RISK"]);
const COMMON_PRIMARY=new Set(["AB_SETUP","SETUP_A","SETUP_B","REWARD_RISK","FINAL_SIGNAL_GRADE"]);
const COMMON_CONTEXT=new Set(["DAILY_ABNORMALITY","ATR_QUALITY","SECTOR_GATE","SECTOR_BREADTH","SECTOR_RETURN","SECTOR_AMOUNT"]);
const COMMON_UNCERTAINTY=new Set(["HISTORY_60D","RS_CONTEXT","LIQUIDITY","CHIP_CONCENTRATION_PRESENT","FINANCIAL_SOURCE_COMPLETENESS","FUNDAMENTAL_COMPONENT_COUNT","TARGET_AVAILABLE"]);
const SHORT_SUPPORTIVE=new Set(["FUNDAMENTAL_QUALITY"]);
const SHORT_CONTEXT=new Set(["MARKET_CAP_FLOOR","SMALL_CAP_SPECIAL","MID_CAP_LIQUIDITY","VALUATION_RELATIVE_RISK"]);
const SWING_PRIMARY=new Set([...SHORT_CONTEXT,"FUNDAMENTAL_QUALITY"]);
export const P1A_GATE_IDS=Object.freeze(["RS_CONTEXT","CHIP_CONCENTRATION_PRESENT","FINANCIAL_SOURCE_COMPLETENESS","FUNDAMENTAL_COMPONENT_COUNT"]);

const finite=x=>typeof x==="number"&&Number.isFinite(x)?x:null;
const round=(x,d=6)=>Number.isFinite(x)?Math.round(x*10**d)/10**d:null;
const ts=x=>typeof x==="string"&&/(?:Z|[+-]\\d\\d:\\d\\d)$/.test(x)?Date.parse(x):NaN;
const hash=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");

export function gateRole(gateId,strategy="SHORT"){
  if(SAFETY.has(gateId)||OWNER_HARD.has(gateId)||EVENT_HARD.has(gateId)) return ROLES.HARD_INVALIDATION;
  if(COMMON_UNCERTAINTY.has(gateId)) return ROLES.UNCERTAINTY;
  if(COMMON_PRIMARY.has(gateId)) return ROLES.PRIMARY_ALPHA;
  if(COMMON_CONTEXT.has(gateId)) return ROLES.CONTEXT_ONLY;
  if(strategy==="SWING"&&SWING_PRIMARY.has(gateId)) return ROLES.PRIMARY_ALPHA;
  if(strategy==="SHORT"&&SHORT_SUPPORTIVE.has(gateId)) return ROLES.SUPPORTIVE;
  if(strategy==="SHORT"&&SHORT_CONTEXT.has(gateId)) return ROLES.CONTEXT_ONLY;
  return ROLES.UNCERTAINTY;
}

export function resolveGateRole(gateId,observation={},strategy="SHORT"){
  const status=String(observation?.status||"UNKNOWN");
  if(SAFETY.has(gateId)) return ROLES.HARD_INVALIDATION;
  if(status==="UNKNOWN"||status==="NOT_EVALUABLE") return ROLES.UNCERTAINTY;
  if(EVENT_HARD.has(gateId)) return status==="FAIL"?ROLES.HARD_INVALIDATION:ROLES.UNCERTAINTY;
  if(OWNER_HARD.has(gateId)) return ROLES.HARD_INVALIDATION;
  return gateRole(gateId,strategy);
}

function isP1ABlocker(gateId,observation={}){
  const status=String(observation?.status||"UNKNOWN");
  if(gateId==="FUNDAMENTAL_COMPONENT_COUNT") return status==="FAIL"||status==="UNKNOWN";
  if(P1A_GATE_IDS.includes(gateId)) return status==="UNKNOWN";
  if(gateId==="MARKET_CAP_FLOOR") return status==="UNKNOWN";
  return false;
}

function pushUnique(arr,id){if(!arr.includes(id)) arr.push(id);}

export const C3_CONTRACT=Object.freeze({
  schemaVersion:"SYSTEM1_C3_ENTRY_CONTRACT_V0_1",
  supportTolerancePct:1.0,
  supportMinVolumeRatio:0.8,
  supportMinDepthScore:50,
  breakoutAcceptanceBufferPct:0.2,
  breakoutMinVolumeRatio:1.2,
  breakoutMinDepthScore:60,
  breakoutRetestTolerancePct:0.2,
  maxChasePct:2.0,
  maxGapPct:3.0,
  minRemainingRR:2.0,
  fillRule:"NEXT_COMPLETED_BAR_OPEN",
  ambiguousSameBarExit:"STOP_FIRST",
  maxBars:26
});

function verifyC2(c2){
  if(c2?.schemaVersion!=="SYSTEM1_C2_PAIRED_LEDGER_V0_1"||c2?.completeMatchedCohort!==true||
     c2?.researchOnly!==true||c2?.formalCoreLocked!==true||!Array.isArray(c2?.pairs)||
     !c2?.generationId||!Number.isFinite(ts(c2?.decisionAt))) throw new Error("C3_C4_C5_VERIFIED_C2_REQUIRED");
  if(c2.pairs.length!==c2.tally?.populationN) throw new Error("C2_POPULATION_MISMATCH");
  return c2;
}
function verifyGeometry(r,c2){
  const g=r?.geometry;
  if(g?.authenticated!==true||g?.parentId!==c2.generationId||g?.sessionDate!==c2.sessionDate||
     !Number.isFinite(ts(g?.knownAt))||ts(g.knownAt)>ts(c2.decisionAt)) throw new Error("C3_NON_PIT_GEOMETRY");
  for(const k of ["stop","target"]){if(!(finite(g[k])>0)) throw new Error("C3_INVALID_GEOMETRY_"+k.toUpperCase());}
  if(g.support!==null&&g.support!==undefined&&!(finite(g.support)>0)) throw new Error("C3_INVALID_SUPPORT");
  if(g.breakout!==null&&g.breakout!==undefined&&!(finite(g.breakout)>0)) throw new Error("C3_INVALID_BREAKOUT");
  return g;
}
function verifyBars(r,c2){
  if(!Array.isArray(r?.bars)||!r.bars.length||r.bars.length>C3_CONTRACT.maxBars) throw new Error("C3_BARS_REQUIRED");
  let prior=-Infinity;
  return r.bars.map((b,i)=>{
    const end=ts(b?.endAt);
    if(!Number.isFinite(end)||end<=ts(c2.decisionAt)||end<=prior||b?.completed!==true) throw new Error("C3_NON_SEQUENTIAL_COMPLETED_BARS");
    prior=end;
    if(typeof b.limitUp!=="boolean"||typeof b.lateStage!=="boolean") throw new Error("C3_BAR_STATE_REQUIRED");
    const row={index:i,endAt:b.endAt,open:finite(b.open),high:finite(b.high),low:finite(b.low),close:finite(b.close),
      volumeRatio:finite(b.volumeRatio),depthScore:finite(b.depthScore),gapPct:finite(b.gapPct),
      limitUp:b.limitUp,lateStage:b.lateStage};
    if([row.open,row.high,row.low,row.close].some(x=>!(x>0))||row.high<Math.max(row.open,row.close)||row.low>Math.min(row.open,row.close)) throw new Error("C3_INVALID_BAR_GEOMETRY");
    return row;
  });
}
function rr(entry,stop,target){return entry>stop&&target>entry?(target-entry)/(entry-stop):null;}
function validMicrostructure(b,minVolume,minDepth,maxGap){
  return b.volumeRatio!==null&&b.volumeRatio>=minVolume&&b.depthScore!==null&&b.depthScore>=minDepth&&
    b.gapPct!==null&&Math.abs(b.gapPct)<=maxGap&&!b.limitUp&&!b.lateStage;
}
function findSupportTrigger(bars,g){
  if(!(finite(g.support)>0)) return {status:"NOT_APPLICABLE",reason:"SUPPORT_NOT_CAPTURED"};
  for(let i=0;i<bars.length-1;i++){
    const b=bars[i],revisit=b.low<=g.support*(1+C3_CONTRACT.supportTolerancePct/100);
    const reclaimed=b.close>=g.support;
    const chase=(b.close/g.support-1)*100;
    if(revisit&&reclaimed&&chase<=C3_CONTRACT.maxChasePct&&
       validMicrostructure(b,C3_CONTRACT.supportMinVolumeRatio,C3_CONTRACT.supportMinDepthScore,C3_CONTRACT.maxGapPct)&&
       rr(b.close,g.stop,g.target)>=C3_CONTRACT.minRemainingRR) return {status:"TRIGGERED",triggerIndex:i,triggerAt:b.endAt,triggerPrice:b.close};
  }
  return {status:"NO_TRIGGER",reason:"SUPPORT_RECLAIM_NOT_CONFIRMED"};
}
function findContinuationTrigger(bars,g){
  if(!(finite(g.breakout)>0)) return {status:"NOT_APPLICABLE",reason:"BREAKOUT_LEVEL_NOT_CAPTURED"};
  let retested=false;
  for(let i=0;i<bars.length-1;i++){
    const b=bars[i];
    if(b.low<=g.breakout*(1+C3_CONTRACT.breakoutRetestTolerancePct/100)) retested=true;
    const acceptance=b.close>=g.breakout*(1+C3_CONTRACT.breakoutAcceptanceBufferPct/100);
    const chase=(b.close/g.breakout-1)*100;
    if(!retested&&acceptance&&chase<=C3_CONTRACT.maxChasePct&&
       validMicrostructure(b,C3_CONTRACT.breakoutMinVolumeRatio,C3_CONTRACT.breakoutMinDepthScore,C3_CONTRACT.maxGapPct)&&
       rr(b.close,g.stop,g.target)>=C3_CONTRACT.minRemainingRR) return {status:"TRIGGERED",triggerIndex:i,triggerAt:b.endAt,triggerPrice:b.close};
  }
  return {status:"NO_TRIGGER",reason:retested?"RETEST_OCCURRED_BASELINE_ROUTE":"CONTINUATION_NOT_CONFIRMED"};
}
function simulateFillAndExit(trigger,bars,g,costs){
  if(trigger.status!=="TRIGGERED") return {...trigger,fillStatus:"NO_FILL",outcome:"NOT_APPLICABLE",simulatedNetReturnPct:null};
  const fillBar=bars[trigger.triggerIndex+1];
  if(!fillBar) return {...trigger,fillStatus:"NO_NEXT_BAR",outcome:"UNKNOWN",simulatedNetReturnPct:null};
  const slip=costs.slippageBpsPerSide/10000,fee=costs.brokerFeeBpsPerSide/10000,tax=costs.sellTaxBps/10000;
  const rawEntry=fillBar.open,entry=rawEntry*(1+slip);
  const remainingRR=rr(entry,g.stop,g.target);
  if(!(remainingRR>=C3_CONTRACT.minRemainingRR)) return {...trigger,fillStatus:"INVALIDATED_AT_FILL",fillAt:fillBar.endAt,rawEntry,entry:round(entry),remainingRR:round(remainingRR),outcome:"NO_TRADE",simulatedNetReturnPct:null};
  let rawExit=bars.at(-1).close,exitAt=bars.at(-1).endAt,outcome="MARK_TO_LAST_BAR";
  for(let i=trigger.triggerIndex+1;i<bars.length;i++){
    const b=bars[i],stopHit=b.low<=g.stop,targetHit=b.high>=g.target;
    if(stopHit&&targetHit){rawExit=g.stop;exitAt=b.endAt;outcome="STOP_FIRST_AMBIGUOUS";break;}
    if(stopHit){rawExit=g.stop;exitAt=b.endAt;outcome="STOP";break;}
    if(targetHit){rawExit=g.target;exitAt=b.endAt;outcome="TARGET";break;}
  }
  const exit=rawExit*(1-slip),buyCash=entry*(1+fee),sellCash=exit*(1-fee-tax);
  return {...trigger,fillStatus:"SIM_FILL",fillAt:fillBar.endAt,rawEntry:round(rawEntry),entry:round(entry),remainingRR:round(remainingRR),
    exitAt,rawExit:round(rawExit),exit:round(exit),outcome,simulatedNetReturnPct:round((sellCash/buyCash-1)*100)};
}
function verifiedCosts(costs){
  const out={brokerFeeBpsPerSide:finite(costs?.brokerFeeBpsPerSide),sellTaxBps:finite(costs?.sellTaxBps),slippageBpsPerSide:finite(costs?.slippageBpsPerSide)};
  if(Object.values(out).some(x=>x===null||x<0)) throw new Error("C3_FROZEN_COST_CONTRACT_REQUIRED");
  return out;
}

export function buildC3EntryExperiment(c2Ledger,entryReceipts,{costs}={}){
  const c2=verifyC2(c2Ledger),cost=verifiedCosts(costs);
  const pairMap=new Map(c2.pairs.map(x=>[x.symbol,x]));
  const seen=new Set(),rows=[];
  for(const r of entryReceipts||[]){
    const symbol=String(r?.symbol||"");
    if(!pairMap.has(symbol)||seen.has(symbol)||r?.sessionDate!==c2.sessionDate||r?.parentId!==c2.generationId) throw new Error("C3_RECEIPT_DENOMINATOR_MISMATCH");
    seen.add(symbol);
    const pair=pairMap.get(symbol),g=verifyGeometry(r,c2),bars=verifyBars(r,c2);
    const baseSetup=["A","B"].includes(r?.baseSetup)?r.baseSetup:null;
    const admissible=pair.short?.gateStatus==="PASS"&&Array.isArray(pair.short?.missingSafety)&&pair.short.missingSafety.length===0;
    const fb=r?.formalBaseline;
    const formalVerified=fb?.verified===true&&fb?.parentId===c2.generationId&&fb?.sessionDate===c2.sessionDate&&
      Number.isFinite(ts(fb?.knownAt))&&ts(fb.knownAt)>ts(c2.decisionAt);
    const formalStatus=formalVerified&&["TRIGGERED","NO_TRIGGER"].includes(fb?.status)?fb.status:"UNKNOWN";
    let alt={status:"NOT_ELIGIBLE",reason:admissible?"BASE_SETUP_UNKNOWN":"C2_SHORT_NOT_FULLY_ADMISSIBLE"};
    if(admissible&&baseSetup==="A") alt=findSupportTrigger(bars,g);
    if(admissible&&baseSetup==="B") alt=findContinuationTrigger(bars,g);
    const simulated=simulateFillAndExit(alt,bars,g,cost);
    rows.push({symbol,pool:pair.pool,baseSetup,formalBaseline:{status:formalStatus,verified:formalVerified,reason:formalVerified?(fb?.reason||null):"FORMAL_BASELINE_RECEIPT_UNVERIFIED"},
      challenger:simulated,barCount:bars.length,researchOnly:true,decisionImpact:false,formalSelected:false,buyAuthorized:false,allocation:0,signal:null});
  }
  const eligibleSymbols=c2.pairs.filter(pair=>pair.short?.gateStatus==="PASS"&&Array.isArray(pair.short?.missingSafety)&&pair.short.missingSafety.length===0).map(x=>x.symbol);
  const missingEntryReceiptSymbols=eligibleSymbols.filter(symbol=>!seen.has(symbol));
  const tally={receiptN:rows.length,eligiblePairN:eligibleSymbols.length,missingEntryReceiptN:missingEntryReceiptSymbols.length,
    entryReceiptCoveragePct:eligibleSymbols.length?round((eligibleSymbols.length-missingEntryReceiptSymbols.length)/eligibleSymbols.length*100):null,
    formalBaselineUnknownN:rows.filter(x=>x.formalBaseline.status==="UNKNOWN").length,
    formalTriggeredN:rows.filter(x=>x.formalBaseline.status==="TRIGGERED").length,
    challengerTriggeredN:rows.filter(x=>x.challenger.status==="TRIGGERED").length,
    simFillN:rows.filter(x=>x.challenger.fillStatus==="SIM_FILL").length,
    noTradeAtFillN:rows.filter(x=>x.challenger.fillStatus==="INVALIDATED_AT_FILL").length,
    stopN:rows.filter(x=>["STOP","STOP_FIRST_AMBIGUOUS"].includes(x.challenger.outcome)).length,
    targetN:rows.filter(x=>x.challenger.outcome==="TARGET").length,
    formalNoTriggerChallengerSimFillN:rows.filter(x=>x.formalBaseline.status==="NO_TRIGGER"&&x.challenger.fillStatus==="SIM_FILL").length};
  return {schemaVersion:"SYSTEM1_C3_ENTRY_EXPERIMENT_V0_1",generationId:c2.generationId,sessionDate:c2.sessionDate,
    sourceC2Fingerprint:c2.fingerprint,contract:C3_CONTRACT,costs:cost,tally,missingEntryReceiptSymbols,rows,
    economicSuperiority:"UNKNOWN",prospectiveEvidenceMature:false,formalCoreLocked:true,researchOnly:true,
    decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true};
}

function deployRatio(n){return n<=0?0:n===1?0.35:n===2?0.60:0.85;}
function cappedRedistribute(weights,targetRatio,cap){
  const n=weights.length,out=Array(n).fill(0),active=new Set(weights.map((_,i)=>i));let remaining=targetRatio;
  while(active.size&&remaining>1e-12){
    const total=[...active].reduce((s,i)=>s+weights[i],0);
    if(!(total>0)) break;
    let clipped=false;
    for(const i of [...active]){
      const proposed=remaining*weights[i]/total;
      if(proposed>cap+1e-12){out[i]=cap;remaining-=cap;active.delete(i);clipped=true;}
    }
    if(!clipped){const denom=[...active].reduce((s,i)=>s+weights[i],0);for(const i of active) out[i]=remaining*weights[i]/denom;remaining=0;}
  }
  return out;
}
function allocationRows(candidates,ratios,totalCapital,gridNTD){
  return candidates.map((x,i)=>{
    const continuous=totalCapital*ratios[i],planned=Math.floor(continuous/gridNTD)*gridNTD;
    const riskPct=(x.entry-x.stop)/x.entry,firstAmount=Math.round(planned*0.6),secondAmount=planned-firstAmount;
    return {symbol:x.symbol,capitalRatioPct:round(ratios[i]*100),continuousAllocationNTD:round(continuous,2),plannedAllocationNTD:planned,
      firstAmountNTD:firstAmount,secondAmountNTD:secondAmount,plannedStopRiskPct:round(riskPct*100),
      plannedStopRiskNTD:round(planned*riskPct,2)};
  });
}
function allocationSummary(name,rows,totalCapital,targetRatio){
  const planned=rows.reduce((s,x)=>s+x.plannedAllocationNTD,0),risks=rows.map(x=>x.plannedStopRiskNTD),riskTotal=risks.reduce((a,b)=>a+b,0);
  return {name,rows,plannedAllocationNTD:round(planned,2),capitalUtilizationPct:round(planned/totalCapital*100),
    reserveVsNominalTargetNTD:round(totalCapital*targetRatio-planned,2),plannedStopRiskNTD:round(riskTotal,2),
    plannedStopRiskPctCapital:round(riskTotal/totalCapital*100),
    riskHHI:riskTotal>0?round(risks.reduce((s,x)=>s+(x/riskTotal)**2,0),8):null};
}
export function buildC4AllocationExperiment(candidates,{totalCapital=200000,gridNTD=1000,perNameCapRatio=0.35}={}){
  const capital=finite(totalCapital),grid=finite(gridNTD),cap=finite(perNameCapRatio);
  if(!(capital>0)||!(grid>0)||!(cap>0&&cap<=1)) throw new Error("C4_INVALID_ALLOCATION_CONTRACT");
  const rows=(candidates||[]).map(x=>({symbol:String(x?.symbol||""),priorityScore:finite(x?.priorityScore),entry:finite(x?.entry),stop:finite(x?.stop)}));
  if(rows.some(x=>!x.symbol||!(x.priorityScore>0)||!(x.entry>0)||!(x.stop>0&&x.stop<x.entry))||new Set(rows.map(x=>x.symbol)).size!==rows.length) throw new Error("C4_VERIFIED_IDENTICAL_CANDIDATES_REQUIRED");
  const target=deployRatio(rows.length);
  if(!rows.length) return {schemaVersion:"SYSTEM1_C4_ALLOCATION_EXPERIMENT_V0_1",selectedCount:0,totalCapitalNTD:capital,comparators:[],preferredAllocator:null,researchOnly:true,decisionImpact:false,formalCoreImpact:false,noTrade:true};
  const scoreTotal=rows.reduce((s,x)=>s+x.priorityScore,0);
  const formalRatios=rows.map(x=>Math.min(cap,target*x.priorityScore/scoreTotal));
  const equalRatios=cappedRedistribute(rows.map(()=>1),target,cap);
  const riskWeights=rows.map(x=>1/((x.entry-x.stop)/x.entry));
  const riskRatios=cappedRedistribute(riskWeights,target,cap);
  const comparators=[
    allocationSummary("FORMAL_SCORE_WEIGHTED_NO_REDISTRIBUTION",allocationRows(rows,formalRatios,capital,grid),capital,target),
    allocationSummary("EQUAL_CAPITAL_SAME_DEPLOY_TARGET",allocationRows(rows,equalRatios,capital,grid),capital,target),
    allocationSummary("EQUAL_PLANNED_STOP_RISK_SAME_DEPLOY_TARGET",allocationRows(rows,riskRatios,capital,grid),capital,target)
  ];
  return {schemaVersion:"SYSTEM1_C4_ALLOCATION_EXPERIMENT_V0_1",selectedCount:rows.length,totalCapitalNTD:capital,
    nominalDeployRatioPct:round(target*100),perNameCapPct:round(cap*100),gridNTD:grid,comparators,
    preferredAllocator:null,economicSuperiority:"UNKNOWN",sameCandidateSet:true,formalCoreLocked:true,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true};
}

export function buildC5OverfilterDiagnostic(c1Diagnosis,c2Ledger,{strategy="SHORT"}={}){
  const c2=verifyC2(c2Ledger);
  if(!["SHORT","SWING"].includes(strategy)||c1Diagnosis?.schemaVersion!=="SYSTEM1_C1_ISOLATED_V0_1"||
     c1Diagnosis?.sessionDate!==c2.sessionDate||c1Diagnosis?.populationN!==c2.tally.populationN||
     !Array.isArray(c1Diagnosis?.observations)) throw new Error("C5_MATCHED_C1_C2_REQUIRED");
  const pairMap=new Map(c2.pairs.map(x=>[x.symbol,x]));
  const gateFails={},gateUnknown={},gateNotEvaluable={},roleFails={},firstFailures={},minimalUnblockClasses={},reachStages={};
  let formalRejectedN=0,optionalOnlyFailN=0,hardOrPrimaryFailN=0,hardUnknownN=0,setupNotReadyN=0,safetyUnknownUpperBoundN=0;
  let confidenceOnlyRejectedN=0,contextOnlyRejectedN=0,p1aRejectedN=0,p1aOnlyN=0,p1aPlusContextN=0,p1aPlusPrimaryN=0;
  let unknownContaminatedN=0,p1aReachABN=0,p1aABPassN=0,p1aReachRRN=0,p1aRRPassN=0,p1aGradePassN=0,p1aRankableN=0,hardBlockedN=0;
  const rows=[];
  const stageIndex={
    F0_FORMAL_PARENT:0,F1_SAFETY_EVALUABLE:1,F2_OWNER_UNIVERSE:2,F3_P1A_SEMANTIC_BYPASS:3,F4_AB_EVALUABLE:4,
    F5_AB_PASS:5,F6_TARGET_RR_EVALUABLE:6,F7_RR_PASS:7,F8_GRADE_PASS:8,F9_RANKABLE:9
  };
  for(const o of c1Diagnosis.observations){
    const pair=pairMap.get(o.symbol);if(!pair) throw new Error("C5_SYMBOL_DENOMINATOR_MISMATCH");
    if(o.formalResult?.ok!==false) continue;
    formalRejectedN++;
    const entries=Object.entries(o.gates||{});
    const failed=entries.filter(([,v])=>v?.status==="FAIL").map(([id])=>id);
    const unknown=entries.filter(([,v])=>v?.status==="UNKNOWN").map(([id])=>id);
    const notEvaluable=entries.filter(([,v])=>v?.status==="NOT_EVALUABLE").map(([id])=>id);
    for(const id of failed){
      gateFails[id]=(gateFails[id]||0)+1;
      const role=resolveGateRole(id,o.gates[id],strategy);
      roleFails[role]=(roleFails[role]||0)+1;
    }
    for(const id of unknown) gateUnknown[id]=(gateUnknown[id]||0)+1;
    for(const id of notEvaluable) gateNotEvaluable[id]=(gateNotEvaluable[id]||0)+1;
    const first=o.firstFailureReason||"UNKNOWN";firstFailures[first]=(firstFailures[first]||0)+1;

    const hardBlockSet=[],confidenceBlockSet=[],contextBlockSet=[],primaryBlockSet=[],supportiveBlockSet=[];
    const unknownDependencySet=[...unknown],notEvaluableDependencySet=[...notEvaluable];
    for(const id of failed){
      const role=resolveGateRole(id,o.gates[id],strategy);
      if(role===ROLES.HARD_INVALIDATION) pushUnique(hardBlockSet,id);
      else if(role===ROLES.UNCERTAINTY) pushUnique(confidenceBlockSet,id);
      else if(role===ROLES.CONTEXT_ONLY) pushUnique(contextBlockSet,id);
      else if(role===ROLES.PRIMARY_ALPHA) pushUnique(primaryBlockSet,id);
      else if(role===ROLES.SUPPORTIVE) pushUnique(supportiveBlockSet,id);
    }
    for(const id of unknown){
      const role=resolveGateRole(id,o.gates[id],strategy);
      if(role===ROLES.HARD_INVALIDATION) continue;
      pushUnique(confidenceBlockSet,id);
    }
    const hardUnknown=unknown.filter(id=>resolveGateRole(id,o.gates[id],strategy)===ROLES.HARD_INVALIDATION);
    const p1aBlockers=entries.filter(([id,v])=>isP1ABlocker(id,v)).map(([id])=>id);
    if(p1aBlockers.length) p1aRejectedN++;

    const failedRoles=failed.map(id=>resolveGateRole(id,o.gates[id],strategy));
    const optionalOnly=failed.length>0&&failedRoles.every(r=>[ROLES.SUPPORTIVE,ROLES.CONTEXT_ONLY,ROLES.UNCERTAINTY].includes(r))&&hardUnknown.length===0;
    if(optionalOnly) optionalOnlyFailN++;
    if(failedRoles.some(r=>r===ROLES.HARD_INVALIDATION||r===ROLES.PRIMARY_ALPHA)) hardOrPrimaryFailN++;
    if(hardUnknown.length) hardUnknownN++;
    if(o.gates?.AB_SETUP?.status==="FAIL"&&hardBlockSet.length===0&&hardUnknown.length===0) setupNotReadyN++;
    if(pair.short?.withoutSafetyGateStatus==="PASS"&&Array.isArray(pair.short?.missingSafety)&&pair.short.missingSafety.length>0) safetyUnknownUpperBoundN++;

    const onlyConfidence=confidenceBlockSet.length>0&&hardBlockSet.length===0&&hardUnknown.length===0&&contextBlockSet.length===0&&primaryBlockSet.length===0&&supportiveBlockSet.length===0;
    const onlyContext=contextBlockSet.length>0&&hardBlockSet.length===0&&hardUnknown.length===0&&confidenceBlockSet.length===0&&primaryBlockSet.length===0&&supportiveBlockSet.length===0;
    if(onlyConfidence) confidenceOnlyRejectedN++;
    if(onlyContext) contextOnlyRejectedN++;

    let reachStage="F0_FORMAL_PARENT";
    if(hardBlockSet.length===0&&hardUnknown.length===0){
      reachStage="F1_SAFETY_EVALUABLE";
      reachStage="F2_OWNER_UNIVERSE";
      reachStage="F3_P1A_SEMANTIC_BYPASS";
      const ab=String(o.gates?.AB_SETUP?.status||"UNKNOWN");
      if(ab==="PASS"){
        reachStage="F5_AB_PASS";
        const target=String(o.gates?.TARGET_AVAILABLE?.status||"UNKNOWN");
        const rr=String(o.gates?.REWARD_RISK?.status||"UNKNOWN");
        if(target==="PASS"&&(rr==="PASS"||rr==="FAIL")){
          reachStage="F6_TARGET_RR_EVALUABLE";
          if(rr==="PASS"){
            reachStage="F7_RR_PASS";
            const grade=String(o.gates?.FINAL_SIGNAL_GRADE?.status||"UNKNOWN");
            if(grade==="PASS"){
              reachStage="F8_GRADE_PASS";
              const unresolvedNonP1A=entries.some(([id,v])=>{
                if(isP1ABlocker(id,v)) return false;
                const s=String(v?.status||"UNKNOWN");
                return s==="FAIL"||s==="UNKNOWN"||s==="NOT_EVALUABLE";
              });
              if(!unresolvedNonP1A) reachStage="F9_RANKABLE";
            }
          }
        }
      }else if(ab==="FAIL") reachStage="F4_AB_EVALUABLE";
    }
    reachStages[reachStage]=(reachStages[reachStage]||0)+1;

    const downstreamUnknown=[
      ["AB_SETUP","F3_P1A_SEMANTIC_BYPASS"],
      ["TARGET_AVAILABLE","F5_AB_PASS"],
      ["REWARD_RISK","F5_AB_PASS"],
      ["FINAL_SIGNAL_GRADE","F7_RR_PASS"]
    ].some(([id,minStage])=>{
      const s=String(o.gates?.[id]?.status||"UNKNOWN");
      return (s==="UNKNOWN"||s==="NOT_EVALUABLE")&&stageIndex[reachStage]>=stageIndex[minStage];
    });

    let minimalUnblockClass;
    if(hardBlockSet.length||hardUnknown.length) minimalUnblockClass="HARD_BLOCKED";
    else if(p1aBlockers.length&&downstreamUnknown) minimalUnblockClass="UNKNOWN_CONTAMINATED";
    else if(p1aBlockers.length&&primaryBlockSet.length) minimalUnblockClass="P1A_PLUS_PRIMARY";
    else if(p1aBlockers.length&&(contextBlockSet.length||supportiveBlockSet.length)) minimalUnblockClass="P1A_PLUS_CONTEXT";
    else if(p1aBlockers.length) minimalUnblockClass="P1A_ONLY";
    else if(primaryBlockSet.length) minimalUnblockClass="PRIMARY_ONLY";
    else if(contextBlockSet.length||supportiveBlockSet.length) minimalUnblockClass="CONTEXT_ONLY";
    else minimalUnblockClass="UNKNOWN_CONTAMINATED";
    minimalUnblockClasses[minimalUnblockClass]=(minimalUnblockClasses[minimalUnblockClass]||0)+1;

    if(minimalUnblockClass==="HARD_BLOCKED") hardBlockedN++;
    if(minimalUnblockClass==="P1A_ONLY") p1aOnlyN++;
    if(minimalUnblockClass==="P1A_PLUS_CONTEXT") p1aPlusContextN++;
    if(minimalUnblockClass==="P1A_PLUS_PRIMARY") p1aPlusPrimaryN++;
    if(minimalUnblockClass==="UNKNOWN_CONTAMINATED") unknownContaminatedN++;
    if(p1aBlockers.length&&stageIndex[reachStage]>=stageIndex.F4_AB_EVALUABLE) p1aReachABN++;
    if(p1aBlockers.length&&stageIndex[reachStage]>=stageIndex.F5_AB_PASS) p1aABPassN++;
    if(p1aBlockers.length&&stageIndex[reachStage]>=stageIndex.F6_TARGET_RR_EVALUABLE) p1aReachRRN++;
    if(p1aBlockers.length&&stageIndex[reachStage]>=stageIndex.F7_RR_PASS) p1aRRPassN++;
    if(p1aBlockers.length&&stageIndex[reachStage]>=stageIndex.F8_GRADE_PASS) p1aGradePassN++;
    if(p1aBlockers.length&&reachStage==="F9_RANKABLE") p1aRankableN++;

    rows.push({
      symbol:o.symbol,pool:o.pool,firstFailure:first,failedGates:failed,unknownGates:unknown,notEvaluableGates:notEvaluable,
      hardBlockSet,confidenceBlockSet,contextBlockSet,primaryBlockSet,supportiveBlockSet,
      unknownDependencySet,notEvaluableDependencySet,p1aBlockers,minimalUnblockClass,reachStage,
      failedRoles:[...new Set(failedRoles)],optionalOnly,confidenceOnly:onlyConfidence,contextOnly:onlyContext,
      shortGateStatus:pair.short?.gateStatus||"UNKNOWN",swingGateStatus:pair.swing?.gateStatus||"UNKNOWN",
      researchOnly:true,decisionImpact:false
    });
  }
  return {
    schemaVersion:"SYSTEM1_C5_OVERFILTER_DIAGNOSTIC_V0_2",sessionDate:c2.sessionDate,generationId:c2.generationId,strategy,
    formalRejectedN,gateFails,gateUnknown,gateNotEvaluable,roleFails,firstFailures,
    optionalOnlyFailN,hardOrPrimaryFailN,hardUnknownN,setupNotReadyN,safetyUnknownUpperBoundN,
    confidenceOnlyRejectedN,contextOnlyRejectedN,p1aRejectedN,p1aOnlyN,p1aPlusContextN,p1aPlusPrimaryN,unknownContaminatedN,
    p1aReachABN,p1aABPassN,p1aReachRRN,p1aRRPassN,p1aGradePassN,p1aRankableN,p1aOverhardeningCounterfactualN:p1aRankableN,hardBlockedN,
    minimalUnblockClasses,reachStages,
    conditionalShortUpperBoundN:c2.tally.formalRejectedButConditionalShortGatesPassN,
    rows,firstFailureIsNotCausalAttribution:true,optionalOnlyIsDiagnosticNotAdmission:true,
    p1aRankableIsDiagnosticNotCandidate:true,unknownNeverPass:true,economicSuperiority:"UNKNOWN",
    roleResolverVersion:"OBSERVATION_AWARE_A2_V0_1",
    roleMapFingerprint:hash(Object.fromEntries(Object.keys({...gateFails,...gateUnknown,...gateNotEvaluable}).sort().map(id=>[id,gateRole(id,strategy)]))),
    formalCoreLocked:true,researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
  };
}
