import {createHash} from "node:crypto";

const DATE=/^\d{4}-\d{2}-\d{2}$/;
const CAUSES=new Set([
  "DATA_COVERAGE_UNKNOWN","SOURCE_FRESHNESS_BLOCK","PLAN_VALIDITY_BLOCK",
  "A_NEVER_REACHED_ZONE","A_ZONE_FAILED_OR_NO_CONFIRM","B_NO_VALID_BREAKOUT",
  "B_VALID_BREAKOUT_NO_RETEST","B_RETEST_FAILED_OR_NO_REACCELERATION",
  "MAX_CHASE_15M_BLOCK_B","MAX_CHASE_QUOTE_BLOCK","STOP_PLAN_INVALIDATED",
  "TRIAL_QUOTE_BLOCK","BUY_SIGNAL_OBSERVED_NO_FILL_EVIDENCE"
]);
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==="object"
  ?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const hash=x=>createHash("sha256").update(JSON.stringify(canonical(x))).digest("hex");
const inc=(o,k,n=1)=>{o[k]=(o[k]||0)+n;};
const gate=(o,id)=>String(o?.gates?.[id]?.status||"UNKNOWN");

function verifyC1(c1){
  if(c1?.schemaVersion!=="SYSTEM1_C1_ISOLATED_V0_1"||!DATE.test(String(c1?.sessionDate||""))||
     !Array.isArray(c1?.observations)||!Number.isInteger(c1?.populationN)||
     c1.observations.length!==c1.populationN) throw new Error("OPPORTUNITY_LOSS_C1_REQUIRED");
  return c1;
}
function verifyC5(c5,c1){
  if(c5?.schemaVersion!=="SYSTEM1_C5_OVERFILTER_DIAGNOSTIC_V0_2"||
     c5?.sessionDate!==c1.sessionDate||!Array.isArray(c5?.rows)||
     c5?.researchOnly!==true||c5?.formalCoreLocked!==true)
    throw new Error("OPPORTUNITY_LOSS_MATCHED_C5_REQUIRED");
  return c5;
}
function verifyC3(c3,c5){
  if(c3===null||c3===undefined) return null;
  if(c3?.schemaVersion!=="SYSTEM1_C3_ENTRY_EXPERIMENT_V0_1"||
     c3?.sessionDate!==c5.sessionDate||c3?.generationId!==c5.generationId||
     !Array.isArray(c3?.rows)||c3?.researchOnly!==true||c3?.formalCoreLocked!==true)
    throw new Error("OPPORTUNITY_LOSS_MATCHED_C3_REQUIRED");
  return c3;
}
function classifyFormalRejection(o,c5row){
  if(c5row?.minimalUnblockClass==="HARD_BLOCKED") return "HARD_INVALIDATION";
  if(c5row?.minimalUnblockClass==="UNKNOWN_CONTAMINATED") return "UNKNOWN_CONTAMINATED";
  if(c5row?.minimalUnblockClass==="P1A_ONLY") return "P1A_ONLY";
  if(gate(o,"AB_SETUP")==="FAIL") return "AB_SETUP";
  if(gate(o,"AB_SETUP")==="PASS"&&gate(o,"TARGET_AVAILABLE")==="FAIL") return "TARGET_GATE";
  if(gate(o,"TARGET_AVAILABLE")==="PASS"&&gate(o,"REWARD_RISK")==="FAIL") return "RR_GATE";
  if(gate(o,"REWARD_RISK")==="PASS"&&gate(o,"FINAL_SIGNAL_GRADE")==="FAIL") return "GRADE_GATE";
  if(c5row?.minimalUnblockClass==="P1A_PLUS_PRIMARY") return "P1A_PLUS_PRIMARY";
  if(c5row?.minimalUnblockClass==="P1A_PLUS_CONTEXT") return "P1A_PLUS_CONTEXT";
  if(c5row?.minimalUnblockClass==="PRIMARY_ONLY") return "PRIMARY_OTHER";
  if(c5row?.minimalUnblockClass==="CONTEXT_ONLY") return "CONTEXT_ONLY";
  return "OTHER_OR_UNRESOLVED";
}
function validLifecycleRow(r,sessionDate,generationId){
  return r?.schemaVersion==="SYSTEM1_SELECTED_TO_BUY_CAUSE_ROW_V0_1"&&
    r?.sessionDate===sessionDate&&r?.generationId===generationId&&
    typeof r?.symbol==="string"&&r.symbol.length>0&&CAUSES.has(String(r?.cause||""))&&
    typeof r?.coverageComplete==="boolean";
}

export function buildSystem1OpportunityLossBridge({
  c1Diagnosis,c5Diagnostic,c3EntryExperiment=null,lifecycleRows=[]
}={}){
  const c1=verifyC1(c1Diagnosis),c5=verifyC5(c5Diagnostic,c1),c3=verifyC3(c3EntryExperiment,c5);
  if(!Array.isArray(lifecycleRows)) throw new Error("OPPORTUNITY_LOSS_LIFECYCLE_ARRAY_REQUIRED");
  const c5Map=new Map(c5.rows.map(r=>[String(r.symbol),r]));
  if(c5Map.size!==c5.rows.length) throw new Error("OPPORTUNITY_LOSS_DUPLICATE_C5_SYMBOL");

  const rejectionBuckets={},targetLegacy={PASS:0,FAIL:0,UNKNOWN:0,NOT_EVALUABLE:0};
  const rows=[];
  let formalSelectedN=0,formalQualifiedN=0,formalRejectedN=0;
  for(const o of c1.observations){
    const symbol=String(o.symbol),formal=o?.formalResult||{};
    if(formal.selected===true) formalSelectedN++;
    if(formal.ok===true){formalQualifiedN++;continue;}
    if(formal.ok!==false) continue;
    formalRejectedN++;
    const c5row=c5Map.get(symbol);
    if(!c5row) throw new Error("OPPORTUNITY_LOSS_C5_DENOMINATOR_MISMATCH");
    const bucket=classifyFormalRejection(o,c5row);
    inc(rejectionBuckets,bucket);
    const t=gate(o,"TARGET_AVAILABLE");
    inc(targetLegacy,Object.hasOwn(targetLegacy,t)?t:"UNKNOWN");
    rows.push({
      symbol,pool:o.pool||null,firstResearchBottleneck:bucket,
      p1aBlockSet:[...(c5row.p1aBlockSet||[])],
      minimalUnblockClass:c5row.minimalUnblockClass||null,
      abStatus:gate(o,"AB_SETUP"),targetGateStatus:t,rrStatus:gate(o,"REWARD_RISK"),
      gradeStatus:gate(o,"FINAL_SIGNAL_GRADE"),
      formalFirstFailure:o.firstFailureReason??null,
      researchOnly:true,decisionImpact:false,formalSelected:false,buyAuthorized:false
    });
  }

  const c3Summary={
    available:c3!==null,eligiblePairN:null,missingEntryReceiptN:null,formalBaselineUnknownN:null,
    bRowsN:null,bFormalNoTriggerN:null,bNoRetestChallengerSimFillN:null,bNoRetestObservedUpperBoundN:null,
    coverageState:c3===null?"CAPTURE_NOT_AVAILABLE":"UNKNOWN"
  };
  if(c3){
    const bRows=c3.rows.filter(r=>r.baseSetup==="B");
    const recovered=bRows.filter(r=>r.formalBaseline?.status==="NO_TRIGGER"&&r.challenger?.fillStatus==="SIM_FILL");
    Object.assign(c3Summary,{
      eligiblePairN:Number(c3.tally?.eligiblePairN)||0,
      missingEntryReceiptN:Number(c3.tally?.missingEntryReceiptN)||0,
      formalBaselineUnknownN:Number(c3.tally?.formalBaselineUnknownN)||0,
      bRowsN:bRows.length,
      bFormalNoTriggerN:bRows.filter(r=>r.formalBaseline?.status==="NO_TRIGGER").length,
      bNoRetestChallengerSimFillN:recovered.length,
      bNoRetestObservedUpperBoundN:recovered.length,
      coverageState:(Number(c3.tally?.missingEntryReceiptN)||0)===0&&
        (Number(c3.tally?.formalBaselineUnknownN)||0)===0?"COMPLETE_FOR_CAPTURED_ELIGIBLE_SET":"PARTIAL_DENOMINATOR"
    });
  }

  const lifecycle={validN:0,completeCoverageN:0,incompleteCoverageN:0,causes:{},invalidN:0};
  for(const r of lifecycleRows){
    if(!validLifecycleRow(r,c1.sessionDate,c5.generationId)){lifecycle.invalidN++;continue;}
    lifecycle.validN++;
    if(r.coverageComplete!==true){lifecycle.incompleteCoverageN++;continue;}
    lifecycle.completeCoverageN++;inc(lifecycle.causes,String(r.cause));
  }
  const maxChase15m=Number(lifecycle.causes.MAX_CHASE_15M_BLOCK_B)||0;
  const maxChaseQuote=Number(lifecycle.causes.MAX_CHASE_QUOTE_BLOCK)||0;

  const hypotheses=[
    {
      id:"H1_P1A_SEMANTIC_OVERHARDENING",
      structuralN:Number(c5.p1aOnlyN)||0,
      deeperRankableUpperBoundN:Number(c5.p1aRankableN)||0,
      evidenceState:(Number(c5.p1aOnlyN)||0)>0?"PROSPECTIVE_COUNTABLE_NO_OUTCOME":"NO_STRUCTURAL_CASE_OBSERVED",
      economicState:"UNKNOWN"
    },
    {
      id:"H2_TARGET_AVAILABLE_OVERGATING",
      structuralN:Number(rejectionBuckets.TARGET_GATE)||0,
      deeperRankableUpperBoundN:null,
      evidenceState:(Number(rejectionBuckets.TARGET_GATE)||0)>0
        ?"LEGACY_TARGET_GATE_OBSERVED_FOUR_STATE_NOT_PRESERVED_IN_C1_DIAGNOSIS"
        :"NO_TARGET_GATE_CASE_OBSERVED",
      economicState:"UNKNOWN"
    },
    {
      id:"H3_RR_GEOMETRY_OVERGATING",
      structuralN:Number(rejectionBuckets.RR_GATE)||0,
      deeperRankableUpperBoundN:null,
      evidenceState:(Number(rejectionBuckets.RR_GATE)||0)>0?"PROSPECTIVE_COUNTABLE_GEOMETRY_OUTCOME_PENDING":"NO_RR_CASE_OBSERVED",
      economicState:"UNKNOWN"
    },
    {
      id:"H4_B_RETEST_CONFIRMATION_DELAY",
      structuralN:c3Summary.bNoRetestObservedUpperBoundN,
      deeperRankableUpperBoundN:null,
      evidenceState:c3===null?"C3_CAPTURE_NOT_AVAILABLE":c3Summary.coverageState,
      economicState:"UNKNOWN"
    },
    {
      id:"H5_DOUBLE_MAX_CHASE_DOWNSTREAM",
      structuralN:lifecycle.completeCoverageN?maxChase15m+maxChaseQuote:null,
      deeperRankableUpperBoundN:null,
      evidenceState:lifecycle.completeCoverageN>0?"EXACT_CAUSE_ROWS_AVAILABLE":"EXACT_DATE_LIFECYCLE_CAPTURE_NOT_AVAILABLE",
      economicState:"UNKNOWN",
      components:{maxChase15mBlockB:maxChase15m,maxChaseQuoteBlock:maxChaseQuote}
    }
  ];

  const investigationQueue=[...hypotheses].sort((a,b)=>{
    const stateRank=s=>s.startsWith("PROSPECTIVE_COUNTABLE")?0:
      s==="COMPLETE_FOR_CAPTURED_ELIGIBLE_SET"?0:
      s==="EXACT_CAUSE_ROWS_AVAILABLE"?0:
      s.startsWith("LEGACY_TARGET_GATE_OBSERVED")?1:
      s==="PARTIAL_DENOMINATOR"?2:3;
    return stateRank(a.evidenceState)-stateRank(b.evidenceState)||
      (Number(b.structuralN)||0)-(Number(a.structuralN)||0)||a.id.localeCompare(b.id);
  }).map((x,i)=>({rank:i+1,id:x.id,evidenceState:x.evidenceState,structuralN:x.structuralN,
    interpretation:"INVESTIGATION_PRIORITY_ONLY_NOT_FORMAL_RELAXATION"}));

  const fingerprint=hash({
    sessionDate:c1.sessionDate,generationId:c5.generationId,
    populationN:c1.populationN,rejectionBuckets,targetLegacy,c3Summary,lifecycle,hypotheses
  });
  return {
    schemaVersion:"SYSTEM1_OPPORTUNITY_LOSS_BRIDGE_V0_1",
    sessionDate:c1.sessionDate,generationId:c5.generationId,populationN:c1.populationN,
    formalSelectedN,formalQualifiedN,formalRejectedN,
    rejectionBuckets,targetLegacyGateStates:targetLegacy,
    c3:c3Summary,lifecycle,hypotheses,investigationQueue,rows,fingerprint,
    denominatorRules:{
      rejectionBucketsMutuallyExclusive:true,
      hypothesesMayOverlapAcrossStages:true,
      unknownNeverOpportunity:true,
      c3MissingReceiptNeverNoTrigger:true,
      targetFourStateNotInferredFromLegacyGate:true,
      maxChaseRequiresCompleteExactCauseRows:true
    },
    interpretation:{
      structuralCountsAreNotExpectedReturn:true,
      investigationRankIsNotEconomicRank:true,
      noGateRemovalAuthorized:true,
      noThresholdTuningAuthorized:true,
      firstFailureNotCausal:true
    },
    economicSuperiority:"UNKNOWN",formalOptimizationCandidate:"NONE",autoSwitchAuthorized:false,
    formalCoreLocked:true,researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    noPlanChanges:true,noTrade:true,noPush:true
  };
}
