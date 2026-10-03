const SAFETY=Object.freeze([
  "SOURCE_AUTHENTICITY","SESSION_CONTINUITY","CORPORATE_ACTION_CONTINUITY","EXECUTION_FEASIBILITY","ACCOUNT_RISK"
]);
const PRE_AB=Object.freeze([
  "HISTORY_60D","RS_CONTEXT","MARKET_CAP_FLOOR","DAILY_ABNORMALITY","LIQUIDITY",
  "SMALL_CAP_SPECIAL","MID_CAP_LIQUIDITY","CHIP_CONCENTRATION_PRESENT",
  "FINANCIAL_SOURCE_COMPLETENESS","ANNOUNCEMENT_RISK","VALUATION_RELATIVE_RISK","SECTOR_GATE"
]);
const POST_AB_PRE_TARGET=Object.freeze(["FUNDAMENTAL_COMPONENT_COUNT","FUNDAMENTAL_QUALITY","ATR_QUALITY"]);
const STAGE_RANK=Object.freeze({
  F0_FORMAL_PARENT:0,F1_SAFETY_EVALUABLE:1,F2_OWNER_UNIVERSE:2,F3_P1A_SEMANTIC_BYPASS:3,
  F4_AB_EVALUABLE:4,F5_AB_PASS:5,F6_TARGET_RR_EVALUABLE:6,F7_RR_PASS:7,F8_GRADE_PASS:8,F9_RANKABLE:9
});
const KNOWN=new Set(["PASS","FAIL","UNKNOWN","NOT_EVALUABLE"]);
const status=(gates,id)=>KNOWN.has(gates?.[id]?.status)?gates[id].status:"UNKNOWN";
const uniq=xs=>[...new Set(xs)].sort();
const inc=(o,k)=>{o[k]=(o[k]||0)+1;};

function nonPass(ids,gates,ignored=new Set()){
  return ids.filter(id=>!ignored.has(id)&&status(gates,id)!=="PASS");
}
function computeConditionalReach(gates,p1aBlockSet,safetyUnknownSet){
  const p1a=new Set(p1aBlockSet||[]);
  const safetyUnknown=new Set(safetyUnknownSet||[]);
  const safetyFail=SAFETY.filter(id=>status(gates,id)==="FAIL");
  const safetyNotEvaluable=SAFETY.filter(id=>status(gates,id)==="NOT_EVALUABLE");
  const unresolvedSafety=SAFETY.filter(id=>status(gates,id)==="UNKNOWN");
  const declared=uniq([...safetyUnknown]);
  if(JSON.stringify(uniq(unresolvedSafety))!==JSON.stringify(declared))
    throw new Error("P1A_CONDITIONAL_SAFETY_SET_MISMATCH");

  let stage="F0_FORMAL_PARENT";
  if(safetyNotEvaluable.length) return {stage,blockedBy:uniq(safetyNotEvaluable),safetyFail,unresolvedSafety};
  stage="F1_SAFETY_EVALUABLE";
  if(safetyFail.length) return {stage,blockedBy:uniq(safetyFail),safetyFail,unresolvedSafety};

  const price=status(gates,"PRICE_FLOOR");
  if(["UNKNOWN","NOT_EVALUABLE"].includes(price))
    return {stage,blockedBy:["PRICE_FLOOR"],safetyFail,unresolvedSafety};
  stage="F2_OWNER_UNIVERSE";
  if(price==="FAIL") return {stage,blockedBy:["PRICE_FLOOR"],safetyFail,unresolvedSafety};

  stage="F3_P1A_SEMANTIC_BYPASS";
  const preBlock=nonPass(PRE_AB,gates,p1a);
  if(preBlock.length) return {stage,blockedBy:uniq(preBlock),safetyFail,unresolvedSafety};

  const ab=status(gates,"AB_SETUP");
  if(["UNKNOWN","NOT_EVALUABLE"].includes(ab))
    return {stage,blockedBy:["AB_SETUP"],safetyFail,unresolvedSafety};
  stage="F4_AB_EVALUABLE";
  if(ab==="FAIL") return {stage,blockedBy:["AB_SETUP"],safetyFail,unresolvedSafety};
  stage="F5_AB_PASS";

  const postBlock=nonPass(POST_AB_PRE_TARGET,gates,p1a);
  if(postBlock.length) return {stage,blockedBy:uniq(postBlock),safetyFail,unresolvedSafety};

  const target=status(gates,"TARGET_AVAILABLE"),rr=status(gates,"REWARD_RISK");
  const targetRrUnknown=[];
  if(target!=="PASS") targetRrUnknown.push("TARGET_AVAILABLE");
  if(["UNKNOWN","NOT_EVALUABLE"].includes(rr)) targetRrUnknown.push("REWARD_RISK");
  if(targetRrUnknown.length) return {stage,blockedBy:uniq(targetRrUnknown),safetyFail,unresolvedSafety};
  stage="F6_TARGET_RR_EVALUABLE";
  if(rr==="FAIL") return {stage,blockedBy:["REWARD_RISK"],safetyFail,unresolvedSafety};
  stage="F7_RR_PASS";

  const grade=status(gates,"FINAL_SIGNAL_GRADE");
  if(grade!=="PASS") return {stage,blockedBy:["FINAL_SIGNAL_GRADE"],safetyFail,unresolvedSafety};
  stage="F8_GRADE_PASS";

  const remaining=[];
  for(const [id,v] of Object.entries(gates||{})){
    const st=KNOWN.has(v?.status)?v.status:"UNKNOWN";
    if(st==="PASS"||p1a.has(id)) continue;
    if(SAFETY.includes(id)&&st==="UNKNOWN") continue;
    remaining.push(id);
  }
  if(remaining.length) return {stage,blockedBy:uniq(remaining),safetyFail,unresolvedSafety};
  return {stage:"F9_RANKABLE",blockedBy:[],safetyFail,unresolvedSafety};
}

function isNonSafetyUnknownBlock(ids,gates){
  return ids.some(id=>!SAFETY.includes(id)&&["UNKNOWN","NOT_EVALUABLE"].includes(status(gates,id)));
}

export function buildP1AConditionalReachUpperBound(c1Diagnosis,c5Diagnostic){
  if(c1Diagnosis?.schemaVersion!=="SYSTEM1_C1_ISOLATED_V0_1"||
     c5Diagnostic?.schemaVersion!=="SYSTEM1_C5_SEMANTIC_REPAIR_V0_2"||
     c5Diagnostic?.researchOnly!==true||c5Diagnostic?.formalCoreLocked!==true||
     c1Diagnosis?.sessionDate!==c5Diagnostic?.sessionDate||
     !Array.isArray(c1Diagnosis?.observations)||!Array.isArray(c5Diagnostic?.rows))
    throw new Error("P1A_CONDITIONAL_MATCHED_C1_C5_REQUIRED");

  const obsMap=new Map(c1Diagnosis.observations.map(o=>[String(o.symbol),o]));
  const rows=[],stageCounts={};
  let p1aConditionalSafetyUnknownN=0,p1aConditionalReachABN=0,p1aConditionalABPassN=0,
      p1aConditionalReachRRN=0,p1aConditionalRRPassN=0,p1aConditionalGradePassN=0,
      p1aConditionalRankableN=0,verifiedSafetyFailN=0,nonSafetyUnknownBlockedN=0;

  for(const strict of c5Diagnostic.rows){
    if(!Array.isArray(strict?.p1aBlockSet)||strict.p1aBlockSet.length===0) continue;
    const symbol=String(strict.symbol),obs=obsMap.get(symbol);
    if(!obs) throw new Error("P1A_CONDITIONAL_SYMBOL_MISMATCH");
    const before=JSON.stringify(obs.gates||{});
    const computed=computeConditionalReach(obs.gates||{},strict.p1aBlockSet,strict.safetyUnknownSet||[]);
    if(JSON.stringify(obs.gates||{})!==before) throw new Error("P1A_CONDITIONAL_INPUT_MUTATION");

    const conditionalOnSafetyUnknown=computed.unresolvedSafety.length>0;
    if(conditionalOnSafetyUnknown&&computed.safetyFail.length===0) p1aConditionalSafetyUnknownN++;
    if(computed.safetyFail.length) verifiedSafetyFailN++;
    if(isNonSafetyUnknownBlock(computed.blockedBy,obs.gates||{})) nonSafetyUnknownBlockedN++;

    const rank=STAGE_RANK[computed.stage];
    if(rank>=STAGE_RANK.F4_AB_EVALUABLE) p1aConditionalReachABN++;
    if(rank>=STAGE_RANK.F5_AB_PASS) p1aConditionalABPassN++;
    if(rank>=STAGE_RANK.F6_TARGET_RR_EVALUABLE) p1aConditionalReachRRN++;
    if(rank>=STAGE_RANK.F7_RR_PASS) p1aConditionalRRPassN++;
    if(rank>=STAGE_RANK.F8_GRADE_PASS) p1aConditionalGradePassN++;
    if(rank>=STAGE_RANK.F9_RANKABLE) p1aConditionalRankableN++;
    inc(stageCounts,computed.stage);

    rows.push({
      symbol,sessionDate:c5Diagnostic.sessionDate,generationId:c5Diagnostic.generationId,
      strictReachStage:strict.reachStage,
      conditionalReachStage:computed.stage,
      conditionalOnSafetyUnknown,
      conditionalSafetyUnknownSet:computed.unresolvedSafety,
      verifiedSafetyFailSet:computed.safetyFail,
      conditionalReachBlockedBy:computed.blockedBy,
      conditionalP1aRankable:computed.stage==="F9_RANKABLE",
      p1aBlockSet:[...strict.p1aBlockSet],
      researchUpperBoundOnly:true,
      unknownToPassMutation:false,
      formalSelected:false,buyAuthorized:false,allocation:0,signal:null,
      researchOnly:true,decisionImpact:false,formalCoreImpact:false,noTrade:true,noPush:true
    });
  }

  let interpretation;
  if(rows.length===0||p1aConditionalRankableN===0){
    interpretation=nonSafetyUnknownBlockedN>0
      ?"CONDITIONAL_P1A_BLOCKED_BY_NONSAFETY_UNKNOWN"
      :"CONDITIONAL_P1A_IMMATERIAL";
  }else{
    interpretation="MATERIALITY_THRESHOLD_NOT_FROZEN";
  }

  return {
    schemaVersion:"SYSTEM1_P1A_CONDITIONAL_REACH_UPPER_BOUND_V0_1",
    sourceContract:"SYSTEM1_P1A_CONDITIONAL_REACH_UPPER_BOUND_CONTRACT_20261003_V0_1",
    sessionDate:c5Diagnostic.sessionDate,generationId:c5Diagnostic.generationId,strategy:c5Diagnostic.strategy,
    p1aStrictRankableN:c5Diagnostic.p1aRankableN,
    p1aConditionalSafetyUnknownN,
    p1aConditionalReachABN,p1aConditionalABPassN,p1aConditionalReachRRN,p1aConditionalRRPassN,
    p1aConditionalGradePassN,p1aConditionalRankableN,
    verifiedSafetyFailN,nonSafetyUnknownBlockedN,stageCounts,rows,
    interpretation,
    materialityThresholdStatus:"NOT_FROZEN",
    safetyCaptureDecision:"DEFER_UNTIL_MATERIALITY_THRESHOLD_AND_PROSPECTIVE_COUNTS",
    unknownNeverPasses:true,safetyFailNeverBypassed:true,nonSafetyStatePreserved:true,
    conditionalRankableIsNotCandidate:true,researchUpperBoundOnly:true,
    economicSuperiority:"UNKNOWN",formalOptimizationCandidate:"NONE",
    formalCoreLocked:true,researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    noPlanChanges:true,noTrade:true,noPush:true
  };
}
