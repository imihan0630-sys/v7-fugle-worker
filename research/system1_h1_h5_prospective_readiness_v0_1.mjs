import {buildC5SemanticRepairDiagnostic} from "./system1_c5_semantic_repair_v0_2.mjs";
import {buildSystem1OpportunityLossBridgeV03} from "./system1_opportunity_loss_bridge_v0_3.mjs";
import {buildC5DailyReport} from "./system1_evidence_automation_v0_1.mjs";

const TARGET_STATES=new Set([
  "TARGET_FOUND","TARGET_NONE_SEARCH_COMPLETE","TARGET_UNKNOWN_SOURCE","TARGET_UNKNOWN_GEOMETRY"
]);
const inc=(o,k)=>{o[k]=(o[k]||0)+1;};
const gate=(o,id)=>String(o?.gates?.[id]?.status||"UNKNOWN");

function verify(c1,c2){
  if(c1?.schemaVersion!=="SYSTEM1_C1_ISOLATED_V0_1"||
     c2?.schemaVersion!=="SYSTEM1_C2_PAIRED_LEDGER_V0_1"||
     c2?.completeMatchedCohort!==true||c2?.researchOnly!==true||c2?.formalCoreLocked!==true||
     c1?.sessionDate!==c2?.sessionDate||c1?.populationN!==c2?.tally?.populationN||
     !Array.isArray(c1?.observations)||!Array.isArray(c2?.pairs))
    throw new Error("H1_H5_MATCHED_C1_C2_REQUIRED");
}

function targetAudit(c1){
  const states={},rows=[];
  let legacyTargetRejectedN=0,noneSearchCompleteN=0,unknownSourceN=0,unknownGeometryN=0,
      foundVerifiedN=0,missingSemanticStateN=0,rrRejectedN=0,rrRejectedTargetFoundVerifiedN=0;
  for(const o of c1.observations){
    if(o?.formalResult?.ok!==false) continue;
    const state=String(o?.targetSemanticsV2?.state||"MISSING");
    if(TARGET_STATES.has(state)) inc(states,state); else {inc(states,"MISSING");missingSemanticStateN++;}
    if(gate(o,"AB_SETUP")==="PASS"&&gate(o,"TARGET_AVAILABLE")==="FAIL"){
      legacyTargetRejectedN++;
      rows.push({symbol:String(o.symbol),legacyTargetGate:"FAIL",targetSemanticState:state,
        targetSemanticReason:o?.targetSemanticsV2?.reason??null});
      if(state==="TARGET_NONE_SEARCH_COMPLETE") noneSearchCompleteN++;
      if(state==="TARGET_UNKNOWN_SOURCE") unknownSourceN++;
      if(state==="TARGET_UNKNOWN_GEOMETRY") unknownGeometryN++;
    }
    if(state==="TARGET_FOUND") foundVerifiedN++;
    if(gate(o,"TARGET_AVAILABLE")==="PASS"&&gate(o,"REWARD_RISK")==="FAIL"){
      rrRejectedN++;
      if(state==="TARGET_FOUND") rrRejectedTargetFoundVerifiedN++;
    }
  }
  let h2State;
  if(legacyTargetRejectedN===0) h2State="T0_NO_TARGET_GATE_REJECTIONS_OBSERVED";
  else if(noneSearchCompleteN>0) h2State="T0_FOUR_STATE_ECONOMIC_COHORT_AVAILABLE";
  else if(unknownSourceN>0) h2State="T0_BLOCKED_TARGET_SOURCE_PROVENANCE";
  else if(unknownGeometryN>0) h2State="T0_BLOCKED_TARGET_GEOMETRY_PROVENANCE";
  else h2State="T0_BLOCKED_TARGET_SEMANTIC_CAPTURE";

  let h3State;
  if(rrRejectedN===0) h3State="T0_NO_RR_REJECTIONS_OBSERVED";
  else if(rrRejectedTargetFoundVerifiedN===rrRejectedN) h3State="T0_RR_GEOMETRY_COHORT_READY";
  else h3State="T0_RR_STRUCTURAL_COUNT_AVAILABLE_TARGET_PROVENANCE_BLOCKED";

  return {states,legacyTargetRejectedN,noneSearchCompleteN,unknownSourceN,unknownGeometryN,
    foundVerifiedN,missingSemanticStateN,rrRejectedN,rrRejectedTargetFoundVerifiedN,
    h2State,h3State,rows};
}

export function buildSystem1H1H5ProspectiveReadiness({c1Diagnosis,c2Ledger,c3Registration=null}={}){
  verify(c1Diagnosis,c2Ledger);
  const c5=buildC5SemanticRepairDiagnostic(c1Diagnosis,c2Ledger,{strategy:"SHORT"});
  const c5Daily=buildC5DailyReport(c1Diagnosis,c2Ledger);
  const bridge=buildSystem1OpportunityLossBridgeV03({
    c1Diagnosis,c5SemanticDiagnostic:c5,c3EntryExperiment:null,lifecycleRows:[]
  });
  const target=targetAudit(c1Diagnosis);
  const c3Registered=c3Registration?.registered===true&&c3Registration?.generationId===c2Ledger.generationId;
  const conditional=c5Daily.conditionalShort;
  const h1ConditionalRankableN=Number(conditional?.p1aConditionalRankableN)||0;
  const h1={
    id:"H1_P1A_SEMANTIC_OVERHARDENING",timeLayer:"T0_SCAN_SESSION",
    state:h1ConditionalRankableN>0
      ?"T0_STRUCTURAL_READY_CONDITIONAL_UPPER_BOUND_PRESENT"
      :"T0_STRUCTURAL_READY_CONDITIONAL_RANKABLE_ZERO_ON_DATE",
    structuralN:Number(c5.p1aOnlyN)||0,
    deeperRankableUpperBoundN:Number(c5.p1aRankableN)||0,
    conditionalUpperBound:{
      safetyUnknownN:Number(conditional?.p1aConditionalSafetyUnknownN)||0,
      reachABN:Number(conditional?.p1aConditionalReachABN)||0,
      abPassN:Number(conditional?.p1aConditionalABPassN)||0,
      reachRRN:Number(conditional?.p1aConditionalReachRRN)||0,
      rrPassN:Number(conditional?.p1aConditionalRRPassN)||0,
      gradePassN:Number(conditional?.p1aConditionalGradePassN)||0,
      rankableN:h1ConditionalRankableN,
      interpretation:conditional?.interpretation??"UNKNOWN",
      materialityThresholdStatus:conditional?.materialityThresholdStatus??"NOT_FROZEN",
      unknownToPassMutation:false,
      candidateAuthority:false
    },
    safetyCaptureDemand:c5Daily.safetyCaptureDemandShort,
    blockers:["ECONOMIC_OUTCOME_NOT_JOINED","MATURITY_THRESHOLD_NOT_SATISFIED"]
  };
  const h2={
    id:"H2_TARGET_AVAILABLE_OVERGATING",timeLayer:"T0_SCAN_SESSION",
    state:target.h2State,structuralN:target.noneSearchCompleteN,
    legacyTargetRejectedN:target.legacyTargetRejectedN,
    unknownSourceN:target.unknownSourceN,unknownGeometryN:target.unknownGeometryN,
    blockers:target.h2State==="T0_FOUR_STATE_ECONOMIC_COHORT_AVAILABLE"
      ?["ECONOMIC_OUTCOME_NOT_JOINED"]
      :["TARGET_FOUR_STATE_PROVENANCE_NOT_VERIFIED"]
  };
  const h3={
    id:"H3_RR_GEOMETRY_OVERGATING",timeLayer:"T0_SCAN_SESSION",
    state:target.h3State,structuralN:target.rrRejectedTargetFoundVerifiedN,
    legacyRrRejectedN:target.rrRejectedN,
    blockers:target.h3State==="T0_RR_GEOMETRY_COHORT_READY"
      ?["ECONOMIC_OUTCOME_NOT_JOINED","RR_UNCERTAINTY_DECOMPOSITION_PENDING"]
      :["TARGET_PROVENANCE_NOT_VERIFIED","RR_UNCERTAINTY_DECOMPOSITION_PENDING"]
  };
  const h4={
    id:"H4_B_RETEST_CONFIRMATION_DELAY",timeLayer:"T1_NEXT_TRADING_SESSION",
    state:c3Registered?"T1_CAPTURE_REGISTERED_AWAIT_NEXT_SESSION":"T1_CAPTURE_NOT_REGISTERED_OR_EMPTY",
    structuralN:null,targetTradeDate:c3Registration?.targetTradeDate??null,
    blockers:["NEXT_SESSION_INTRADAY_PATH_NOT_YET_OBSERVED",...(c3Registered?[]:["C3_CAPTURE_REGISTRATION_NOT_VERIFIED"])]
  };
  const h5={
    id:"H5_DOUBLE_MAX_CHASE_DOWNSTREAM",timeLayer:"T1_NEXT_TRADING_SESSION",
    state:"T1_EXHAUSTIVE_MONITOR_RECEIPT_NOT_AVAILABLE",
    structuralN:null,
    classifierReady:true,
    blockers:["EXPECTED_MONITOR_RUN_RECEIPT_NOT_CAPTURED","NEGATIVE_SIGNAL_COVERAGE_NOT_CERTIFIED"]
  };
  return {
    schemaVersion:"SYSTEM1_H1_H5_PROSPECTIVE_READINESS_V0_1",
    sessionDate:c2Ledger.sessionDate,generationId:c2Ledger.generationId,
    populationN:c2Ledger.tally.populationN,
    hypotheses:[h1,h2,h3,h4,h5],
    targetProvenanceAudit:target,
    immediateT0:{
      structurallyComputable:["H1_P1A_SEMANTIC_OVERHARDENING"],
      conditionallyComputable:[
        "H2_TARGET_AVAILABLE_OVERGATING","H3_RR_GEOMETRY_OVERGATING"
      ],
      currentBlockingFact:"C1_V815_TARGET_PROVENANCE_FIELDS_NOT_DURABLY_CAPTURED"
    },
    deferredT1:{
      requiresNextTradingSession:["H4_B_RETEST_CONFIRMATION_DELAY","H5_DOUBLE_MAX_CHASE_DOWNSTREAM"],
      zeroBeforeT1IsForbidden:true
    },
    c5Diagnostic:c5,c5DailyReport:c5Daily,opportunityLossBridge:bridge,
    economicSuperiority:"UNKNOWN",formalOptimizationCandidate:"NONE",
    autoSwitchAuthorized:false,formalCoreLocked:true,researchOnly:true,decisionImpact:false,
    formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
  };
}
