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
const COMMON_HARD=new Set(["PRICE_FLOOR","HISTORY_60D","DAILY_ABNORMALITY","LIQUIDITY","ANNOUNCEMENT_RISK"]);
const SHORT_PRIMARY=new Set(["RS_CONTEXT","ATR_QUALITY","SECTOR_GATE","SECTOR_BREADTH","SECTOR_RETURN","SECTOR_AMOUNT","AB_SETUP","SETUP_A","SETUP_B","TARGET_AVAILABLE","REWARD_RISK","FINAL_SIGNAL_GRADE"]);
const SWING_PRIMARY=new Set([...SHORT_PRIMARY,"MARKET_CAP_FLOOR","SMALL_CAP_SPECIAL","MID_CAP_LIQUIDITY","CHIP_CONCENTRATION_PRESENT","VALUATION_RELATIVE_RISK","FUNDAMENTAL_COMPONENT_COUNT","FUNDAMENTAL_QUALITY"]);
const SLOW_GATES=["MARKET_CAP_FLOOR","SMALL_CAP_SPECIAL","MID_CAP_LIQUIDITY","CHIP_CONCENTRATION_PRESENT","FINANCIAL_SOURCE_COMPLETENESS","VALUATION_RELATIVE_RISK","FUNDAMENTAL_COMPONENT_COUNT","FUNDAMENTAL_QUALITY"];

const finite=x=>typeof x==="number"&&Number.isFinite(x)?x:null;
const round=(x,d=6)=>Number.isFinite(x)?Math.round(x*10**d)/10**d:null;
const ts=x=>typeof x==="string"&&/(?:Z|[+-]\d\d:\d\d)$/.test(x)?Date.parse(x):NaN;
const hash=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");

export function gateRole(gateId,strategy="SHORT"){
  if(SAFETY.has(gateId)||COMMON_HARD.has(gateId)) return ROLES.HARD_INVALIDATION;
  if(gateId==="FINANCIAL_SOURCE_COMPLETENESS") return ROLES.UNCERTAINTY;
  if(strategy==="SWING"&&SWING_PRIMARY.has(gateId)) return ROLES.PRIMARY_ALPHA;
  if(strategy==="SHORT"&&SHORT_PRIMARY.has(gateId)) return ROLES.PRIMARY_ALPHA;
  if(strategy==="SHORT"&&["CHIP_CONCENTRATION_PRESENT","FUNDAMENTAL_COMPONENT_COUNT","FUNDAMENTAL_QUALITY"].includes(gateId)) return ROLES.SUPPORTIVE;
  if(strategy==="SHORT"&&["MARKET_CAP_FLOOR","SMALL_CAP_SPECIAL","MID_CAP_LIQUIDITY","VALUATION_RELATIVE_RISK"].includes(gateId)) return ROLES.CONTEXT_ONLY;
  if(strategy==="SWING"&&SLOW_GATES.includes(gateId)) return ROLES.PRIMARY_ALPHA;
  return ROLES.UNCERTAINTY;
}

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
  const gateFails={},gateUnknown={},roleFails={},firstFailures={};
  let formalRejectedN=0,optionalOnlyFailN=0,hardOrPrimaryFailN=0,hardUnknownN=0,setupNotReadyN=0,safetyUnknownUpperBoundN=0;
  const rows=[];
  for(const o of c1Diagnosis.observations){
    const pair=pairMap.get(o.symbol);if(!pair) throw new Error("C5_SYMBOL_DENOMINATOR_MISMATCH");
    if(o.formalResult?.ok!==false) continue;
    formalRejectedN++;
    const failed=Object.entries(o.gates).filter(([,v])=>v.status==="FAIL").map(([id])=>id);
    const unknown=Object.entries(o.gates).filter(([,v])=>v.status==="UNKNOWN").map(([id])=>id);
    for(const id of failed){gateFails[id]=(gateFails[id]||0)+1;const role=gateRole(id,strategy);roleFails[role]=(roleFails[role]||0)+1;}
    for(const id of unknown) gateUnknown[id]=(gateUnknown[id]||0)+1;
    const first=o.firstFailureReason||"UNKNOWN";firstFailures[first]=(firstFailures[first]||0)+1;
    const roles=failed.map(id=>gateRole(id,strategy));
    const optionalOnly=failed.length>0&&roles.every(r=>[ROLES.SUPPORTIVE,ROLES.CONTEXT_ONLY,ROLES.UNCERTAINTY].includes(r))&&
      !unknown.some(id=>gateRole(id,strategy)===ROLES.HARD_INVALIDATION);
    if(optionalOnly) optionalOnlyFailN++;
    if(roles.some(r=>r===ROLES.HARD_INVALIDATION||r===ROLES.PRIMARY_ALPHA)) hardOrPrimaryFailN++;
    if(unknown.some(id=>gateRole(id,strategy)===ROLES.HARD_INVALIDATION)) hardUnknownN++;
    if(o.gates?.AB_SETUP?.status==="FAIL"&&!failed.some(id=>gateRole(id,strategy)===ROLES.HARD_INVALIDATION)) setupNotReadyN++;
    if(pair.short?.withoutSafetyGateStatus==="PASS"&&Array.isArray(pair.short?.missingSafety)&&pair.short.missingSafety.length>0) safetyUnknownUpperBoundN++;
    rows.push({symbol:o.symbol,pool:o.pool,firstFailure:first,failedGates:failed,unknownGates:unknown,
      failedRoles:[...new Set(roles)],optionalOnly,shortGateStatus:pair.short?.gateStatus||"UNKNOWN",
      swingGateStatus:pair.swing?.gateStatus||"UNKNOWN",researchOnly:true,decisionImpact:false});
  }
  return {schemaVersion:"SYSTEM1_C5_OVERFILTER_DIAGNOSTIC_V0_1",sessionDate:c2.sessionDate,generationId:c2.generationId,strategy,
    formalRejectedN,gateFails,gateUnknown,roleFails,firstFailures,optionalOnlyFailN,hardOrPrimaryFailN,hardUnknownN,
    setupNotReadyN,safetyUnknownUpperBoundN,conditionalShortUpperBoundN:c2.tally.formalRejectedButConditionalShortGatesPassN,
    rows,firstFailureIsNotCausalAttribution:true,optionalOnlyIsDiagnosticNotAdmission:true,economicSuperiority:"UNKNOWN",
    roleMapFingerprint:hash(Object.fromEntries(Object.keys({...gateFails,...gateUnknown}).sort().map(id=>[id,gateRole(id,strategy)]))),
    formalCoreLocked:true,researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true};
}
