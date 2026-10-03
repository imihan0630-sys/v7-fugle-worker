import {createHash} from "node:crypto";

export const C5_ROLES_V0_2=Object.freeze({
  HARD_INVALIDATION:"HARD_INVALIDATION",
  PRIMARY_ALPHA:"PRIMARY_ALPHA",
  SUPPORTIVE:"SUPPORTIVE",
  CONTEXT_ONLY:"CONTEXT_ONLY",
  UNCERTAINTY:"CONFIDENCE_UNCERTAINTY"
});

const R=C5_ROLES_V0_2;
const SAFETY=new Set(["SOURCE_AUTHENTICITY","SESSION_CONTINUITY","CORPORATE_ACTION_CONTINUITY","EXECUTION_FEASIBILITY","ACCOUNT_RISK"]);
const P1A_BASE=new Set(["RS_CONTEXT","CHIP_CONCENTRATION_PRESENT","FINANCIAL_SOURCE_COMPLETENESS","FUNDAMENTAL_COMPONENT_COUNT"]);
const COMPONENT_ROLES=Object.freeze({
  SECTOR_BREADTH:{SHORT:R.CONTEXT_ONLY,SWING:R.CONTEXT_ONLY},
  SECTOR_RETURN:{SHORT:R.CONTEXT_ONLY,SWING:R.CONTEXT_ONLY},
  SECTOR_AMOUNT:{SHORT:R.CONTEXT_ONLY,SWING:R.CONTEXT_ONLY},
  SETUP_A:{SHORT:R.PRIMARY_ALPHA,SWING:R.PRIMARY_ALPHA},
  SETUP_B:{SHORT:R.PRIMARY_ALPHA,SWING:R.PRIMARY_ALPHA}
});
export const C5_A2_ROLE_MAP_V0_2=Object.freeze({
  PRICE_FLOOR:{SHORT:R.HARD_INVALIDATION,SWING:R.HARD_INVALIDATION},
  HISTORY_60D:{SHORT:R.UNCERTAINTY,SWING:R.UNCERTAINTY},
  RS_CONTEXT:{SHORT:R.UNCERTAINTY,SWING:R.UNCERTAINTY},
  MARKET_CAP_FLOOR:{SHORT:R.CONTEXT_ONLY,SWING:R.PRIMARY_ALPHA},
  DAILY_ABNORMALITY:{SHORT:R.CONTEXT_ONLY,SWING:R.CONTEXT_ONLY},
  LIQUIDITY:{SHORT:R.UNCERTAINTY,SWING:R.UNCERTAINTY},
  SMALL_CAP_SPECIAL:{SHORT:R.CONTEXT_ONLY,SWING:R.PRIMARY_ALPHA},
  MID_CAP_LIQUIDITY:{SHORT:R.CONTEXT_ONLY,SWING:R.PRIMARY_ALPHA},
  CHIP_CONCENTRATION_PRESENT:{SHORT:R.UNCERTAINTY,SWING:R.UNCERTAINTY},
  FINANCIAL_SOURCE_COMPLETENESS:{SHORT:R.UNCERTAINTY,SWING:R.UNCERTAINTY},
  ANNOUNCEMENT_RISK:{SHORT:R.HARD_INVALIDATION,SWING:R.HARD_INVALIDATION},
  VALUATION_RELATIVE_RISK:{SHORT:R.CONTEXT_ONLY,SWING:R.PRIMARY_ALPHA},
  SECTOR_GATE:{SHORT:R.CONTEXT_ONLY,SWING:R.CONTEXT_ONLY},
  AB_SETUP:{SHORT:R.PRIMARY_ALPHA,SWING:R.PRIMARY_ALPHA},
  FUNDAMENTAL_COMPONENT_COUNT:{SHORT:R.UNCERTAINTY,SWING:R.UNCERTAINTY},
  FUNDAMENTAL_QUALITY:{SHORT:R.SUPPORTIVE,SWING:R.PRIMARY_ALPHA},
  ATR_QUALITY:{SHORT:R.CONTEXT_ONLY,SWING:R.CONTEXT_ONLY},
  TARGET_AVAILABLE:{SHORT:R.UNCERTAINTY,SWING:R.UNCERTAINTY},
  REWARD_RISK:{SHORT:R.PRIMARY_ALPHA,SWING:R.PRIMARY_ALPHA},
  FINAL_SIGNAL_GRADE:{SHORT:R.PRIMARY_ALPHA,SWING:R.PRIMARY_ALPHA},
  ...COMPONENT_ROLES
});

const FORMAL_PRE_AB=[
  "HISTORY_60D","RS_CONTEXT","MARKET_CAP_FLOOR","DAILY_ABNORMALITY","LIQUIDITY",
  "SMALL_CAP_SPECIAL","MID_CAP_LIQUIDITY","CHIP_CONCENTRATION_PRESENT",
  "FINANCIAL_SOURCE_COMPLETENESS","ANNOUNCEMENT_RISK","VALUATION_RELATIVE_RISK","SECTOR_GATE"
];
const FORMAL_POST_AB_PRE_TARGET=["FUNDAMENTAL_COMPONENT_COUNT","FUNDAMENTAL_QUALITY","ATR_QUALITY"];
const STAGE_RANK=Object.freeze({
  F0_FORMAL_PARENT:0,F1_SAFETY_EVALUABLE:1,F2_OWNER_UNIVERSE:2,F3_P1A_SEMANTIC_BYPASS:3,
  F4_AB_EVALUABLE:4,F5_AB_PASS:5,F6_TARGET_RR_EVALUABLE:6,F7_RR_PASS:7,F8_GRADE_PASS:8,F9_RANKABLE:9
});
const hash=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");

export function gateRoleV2(gateId,strategy="SHORT"){
  if(!["SHORT","SWING"].includes(strategy)) throw new Error("C5_V2_STRATEGY_INVALID");
  if(SAFETY.has(gateId)) return R.HARD_INVALIDATION;
  return C5_A2_ROLE_MAP_V0_2[gateId]?.[strategy]||R.UNCERTAINTY;
}

function gateStatus(gates,id){
  const status=gates?.[id]?.status;
  return ["PASS","FAIL","UNKNOWN"].includes(status)?status:"UNKNOWN";
}
function isP1ABlocker(id,status){
  return P1A_BASE.has(id)||(id==="MARKET_CAP_FLOOR"&&status==="UNKNOWN");
}
function dedupeSorted(xs){return [...new Set(xs)].sort();}
function blockingSets(gates,strategy){
  const hard=[],confidence=[],context=[],primary=[],supportive=[],unknown=[],notEvaluable=[],p1a=[],safetyUnknown=[];
  for(const [id,v] of Object.entries(gates||{})){
    const status=["PASS","FAIL","UNKNOWN"].includes(v?.status)?v.status:"UNKNOWN";
    if(status==="PASS") continue;
    if(status==="UNKNOWN"){
      unknown.push(id);confidence.push(id);
      if(SAFETY.has(id)) safetyUnknown.push(id);
      if(isP1ABlocker(id,status)) p1a.push(id);
      continue;
    }
    const role=gateRoleV2(id,strategy);
    if(role===R.HARD_INVALIDATION) hard.push(id);
    else if(role===R.PRIMARY_ALPHA) primary.push(id);
    else if(role===R.SUPPORTIVE) supportive.push(id);
    else if(role===R.CONTEXT_ONLY) context.push(id);
    else confidence.push(id);
    if(isP1ABlocker(id,status)) p1a.push(id);
  }
  const dependencyIds=[
    ...SAFETY,"PRICE_FLOOR","HISTORY_60D","AB_SETUP","TARGET_AVAILABLE","REWARD_RISK","FINAL_SIGNAL_GRADE"
  ];
  for(const id of dependencyIds) if(gateStatus(gates,id)==="UNKNOWN") notEvaluable.push(id);
  return {
    hardBlockSet:dedupeSorted(hard),confidenceBlockSet:dedupeSorted(confidence),
    contextBlockSet:dedupeSorted(context),primaryBlockSet:dedupeSorted(primary),
    supportiveBlockSet:dedupeSorted(supportive),unknownDependencySet:dedupeSorted(unknown),
    notEvaluableDependencySet:dedupeSorted(notEvaluable),p1aBlockSet:dedupeSorted(p1a),
    safetyUnknownSet:dedupeSorted(safetyUnknown)
  };
}
function nonP1ABlockedBefore(gates,ids){
  for(const id of ids){
    const status=gateStatus(gates,id);
    if(status==="PASS") continue;
    if(isP1ABlocker(id,status)) continue;
    return true;
  }
  return false;
}
function reachStage(gates){
  let stage="F0_FORMAL_PARENT";
  const safetyStatuses=[...SAFETY].map(id=>gateStatus(gates,id));
  if(safetyStatuses.some(x=>x==="UNKNOWN")) return stage;
  stage="F1_SAFETY_EVALUABLE";
  if(safetyStatuses.some(x=>x==="FAIL")) return stage;

  const price=gateStatus(gates,"PRICE_FLOOR");
  if(price==="UNKNOWN") return stage;
  stage="F2_OWNER_UNIVERSE";
  if(price==="FAIL") return stage;

  stage="F3_P1A_SEMANTIC_BYPASS";
  if(nonP1ABlockedBefore(gates,FORMAL_PRE_AB)) return stage;

  const ab=gateStatus(gates,"AB_SETUP");
  if(ab==="UNKNOWN") return stage;
  stage="F4_AB_EVALUABLE";
  if(ab!=="PASS") return stage;
  stage="F5_AB_PASS";

  if(nonP1ABlockedBefore(gates,FORMAL_POST_AB_PRE_TARGET)) return stage;
  const target=gateStatus(gates,"TARGET_AVAILABLE");
  const rr=gateStatus(gates,"REWARD_RISK");
  if(target!=="PASS"||rr==="UNKNOWN") return stage;
  stage="F6_TARGET_RR_EVALUABLE";
  if(rr!=="PASS") return stage;
  stage="F7_RR_PASS";

  const grade=gateStatus(gates,"FINAL_SIGNAL_GRADE");
  if(grade!=="PASS") return stage;
  stage="F8_GRADE_PASS";

  const remaining=Object.entries(gates||{}).filter(([id,v])=>{
    const status=["PASS","FAIL","UNKNOWN"].includes(v?.status)?v.status:"UNKNOWN";
    return status!=="PASS"&&!isP1ABlocker(id,status);
  });
  if(remaining.length===0) stage="F9_RANKABLE";
  return stage;
}
function minimalUnblockClass(sets){
  const hasP1A=sets.p1aBlockSet.length>0;
  if(sets.hardBlockSet.length) return "HARD_BLOCKED";
  const nonP1AUnknown=sets.unknownDependencySet.filter(id=>!sets.p1aBlockSet.includes(id));
  if(sets.safetyUnknownSet.length||nonP1AUnknown.length) return "UNKNOWN_CONTAMINATED";
  if(hasP1A&&sets.primaryBlockSet.length) return "P1A_PLUS_PRIMARY";
  if(hasP1A&&(sets.contextBlockSet.length||sets.supportiveBlockSet.length)) return "P1A_PLUS_CONTEXT";
  if(hasP1A) return "P1A_ONLY";
  if(sets.primaryBlockSet.length) return "PRIMARY_ONLY";
  if(sets.contextBlockSet.length||sets.supportiveBlockSet.length) return "CONTEXT_ONLY";
  if(sets.unknownDependencySet.length||sets.confidenceBlockSet.length) return "UNKNOWN_CONTAMINATED";
  return "NO_RESEARCH_BLOCKER";
}
function inc(obj,key){obj[key]=(obj[key]||0)+1;}

export function buildC5SemanticRepairDiagnostic(c1Diagnosis,c2Ledger,{strategy="SHORT"}={}){
  if(!["SHORT","SWING"].includes(strategy)||c1Diagnosis?.schemaVersion!=="SYSTEM1_C1_ISOLATED_V0_1"||
     c2Ledger?.schemaVersion!=="SYSTEM1_C2_PAIRED_LEDGER_V0_1"||c2Ledger?.completeMatchedCohort!==true||
     c2Ledger?.researchOnly!==true||c2Ledger?.formalCoreLocked!==true||
     c1Diagnosis?.sessionDate!==c2Ledger?.sessionDate||c1Diagnosis?.populationN!==c2Ledger?.tally?.populationN||
     !Array.isArray(c1Diagnosis?.observations)||!Array.isArray(c2Ledger?.pairs))
    throw new Error("C5_V2_MATCHED_C1_C2_REQUIRED");

  const pairMap=new Map(c2Ledger.pairs.map(x=>[String(x.symbol),x]));
  const roleFails={},gateFails={},gateUnknown={},minimalClassCounts={},reachCounts={},rows=[];
  let formalRejectedN=0,p1aRejectedN=0,hardBlockedN=0,p1aOnlyN=0,p1aPlusContextN=0,p1aPlusPrimaryN=0,
      unknownContaminatedN=0,p1aReachABN=0,p1aABPassN=0,p1aReachRRN=0,p1aRRPassN=0,p1aGradePassN=0,p1aRankableN=0;

  for(const o of c1Diagnosis.observations){
    const pair=pairMap.get(String(o.symbol));
    if(!pair) throw new Error("C5_V2_SYMBOL_DENOMINATOR_MISMATCH");
    if(o.formalResult?.ok!==false) continue;
    formalRejectedN++;
    const gates=o.gates||{},sets=blockingSets(gates,strategy),klass=minimalUnblockClass(sets),reach=reachStage(gates);
    for(const [id,v] of Object.entries(gates)){
      if(v?.status==="FAIL"){inc(gateFails,id);inc(roleFails,gateRoleV2(id,strategy));}
      if(v?.status==="UNKNOWN") inc(gateUnknown,id);
    }
    inc(minimalClassCounts,klass);inc(reachCounts,reach);
    if(sets.p1aBlockSet.length){
      p1aRejectedN++;
      if(klass==="P1A_ONLY") p1aOnlyN++;
      if(klass==="P1A_PLUS_CONTEXT") p1aPlusContextN++;
      if(klass==="P1A_PLUS_PRIMARY") p1aPlusPrimaryN++;
      if(STAGE_RANK[reach]>=STAGE_RANK.F4_AB_EVALUABLE) p1aReachABN++;
      if(STAGE_RANK[reach]>=STAGE_RANK.F5_AB_PASS) p1aABPassN++;
      if(STAGE_RANK[reach]>=STAGE_RANK.F6_TARGET_RR_EVALUABLE) p1aReachRRN++;
      if(STAGE_RANK[reach]>=STAGE_RANK.F7_RR_PASS) p1aRRPassN++;
      if(STAGE_RANK[reach]>=STAGE_RANK.F8_GRADE_PASS) p1aGradePassN++;
      if(STAGE_RANK[reach]>=STAGE_RANK.F9_RANKABLE) p1aRankableN++;
    }
    if(klass==="HARD_BLOCKED") hardBlockedN++;
    if(klass==="UNKNOWN_CONTAMINATED") unknownContaminatedN++;
    rows.push({
      symbol:String(o.symbol),pool:o.pool||pair.pool||null,formalFirstFailure:o.firstFailureReason||"UNKNOWN",
      formalOk:false,...sets,minimalUnblockClass:klass,reachStage:reach,
      decisionAt:c2Ledger.decisionAt,firstFailureIsDescriptiveOnly:true,
      researchOnly:true,decisionImpact:false,formalSelected:false,buyAuthorized:false,allocation:0,signal:null
    });
  }
  return {
    schemaVersion:"SYSTEM1_C5_SEMANTIC_REPAIR_V0_2",
    sourceRoleInventory:"SYSTEM1_A2_GATE_ROLE_INVENTORY_V0_1",
    p1aContract:"SYSTEM1_P1A_MINIMAL_BLOCKING_AND_OUTCOME_CONTRACT_20261003_V0_1",
    sessionDate:c2Ledger.sessionDate,generationId:c2Ledger.generationId,strategy,
    formalRejectedN,p1aRejectedN,p1aOnlyN,p1aPlusContextN,p1aPlusPrimaryN,unknownContaminatedN,
    p1aReachABN,p1aABPassN,p1aReachRRN,p1aRRPassN,p1aGradePassN,p1aRankableN,hardBlockedN,
    gateFails,gateUnknown,roleFails,minimalClassCounts,reachCounts,rows,
    roleMapFingerprint:hash(C5_A2_ROLE_MAP_V0_2),
    firstFailureIsNotCausalAttribution:true,unknownNeverPasses:true,p1aRankableIsNotCandidate:true,
    candidateCountLiftIsNotSuccess:true,economicSuperiority:"UNKNOWN",formalOptimizationCandidate:"NONE",
    formalCoreLocked:true,researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
  };
}
