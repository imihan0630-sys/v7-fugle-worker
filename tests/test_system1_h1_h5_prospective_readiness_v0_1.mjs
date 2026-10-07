import assert from "node:assert/strict";
import {buildSystem1H1H5ProspectiveReadiness} from "../research/system1_h1_h5_prospective_readiness_v0_1.mjs";

const pass={status:"PASS"},fail={status:"FAIL"},unk={status:"UNKNOWN"};
const base={
  SOURCE_AUTHENTICITY:pass,SESSION_CONTINUITY:pass,CORPORATE_ACTION_CONTINUITY:pass,
  EXECUTION_FEASIBILITY:pass,ACCOUNT_RISK:pass,PRICE_FLOOR:pass,HISTORY_60D:pass,
  RS_CONTEXT:pass,MARKET_CAP_FLOOR:pass,DAILY_ABNORMALITY:pass,LIQUIDITY:pass,
  SMALL_CAP_SPECIAL:pass,MID_CAP_LIQUIDITY:pass,CHIP_CONCENTRATION_PRESENT:pass,
  FINANCIAL_SOURCE_COMPLETENESS:pass,ANNOUNCEMENT_RISK:pass,VALUATION_RELATIVE_RISK:pass,
  SECTOR_GATE:pass,AB_SETUP:pass,FUNDAMENTAL_COMPONENT_COUNT:pass,FUNDAMENTAL_QUALITY:pass,
  ATR_QUALITY:pass,TARGET_AVAILABLE:pass,REWARD_RISK:pass,FINAL_SIGNAL_GRADE:pass
};
const obs=(symbol,patch,targetSemanticsV2)=>({
  symbol,pool:"GENERAL",formalResult:{ok:false},firstFailureReason:"fixture",
  gates:{...base,...patch},targetSemanticsV2
});
const sessionDate="2026-10-07",generationId="g-h1h5",decisionAt="2026-10-07T23:35:00+08:00";
const observations=[
  obs("AAA",{RS_CONTEXT:unk},{state:"TARGET_FOUND",reason:null}),
  obs("BBB",{TARGET_AVAILABLE:fail,REWARD_RISK:unk,FINAL_SIGNAL_GRADE:unk},{state:"TARGET_UNKNOWN_SOURCE",reason:"TARGET_SOURCE_PROVENANCE_NOT_VERIFIED"}),
  obs("CCC",{TARGET_AVAILABLE:fail,REWARD_RISK:unk,FINAL_SIGNAL_GRADE:unk},{state:"TARGET_NONE_SEARCH_COMPLETE",reason:null}),
  obs("DDD",{REWARD_RISK:fail,FINAL_SIGNAL_GRADE:unk},{state:"TARGET_FOUND",reason:null}),
  {symbol:"EEE",pool:"GENERAL",formalResult:{ok:true},gates:{...base},targetSemanticsV2:{state:"TARGET_FOUND",reason:null}}
];
const pairs=observations.map(o=>({
  symbol:o.symbol,pool:"GENERAL",sessionDate,parentId:generationId,
  formal:{qualified:o.formalResult.ok===true,selected:false,firstFailure:o.firstFailureReason||null},
  short:{gateStatus:"UNKNOWN",missingSafety:[],withoutSafetyGateStatus:"PASS"},
  swing:{gateStatus:"UNKNOWN",missingSafety:[]},
  researchOnly:true,decisionImpact:false
}));
const c1={schemaVersion:"SYSTEM1_C1_ISOLATED_V0_1",sessionDate,decisionAt,populationN:observations.length,observations};
const c2={schemaVersion:"SYSTEM1_C2_PAIRED_LEDGER_V0_1",generationId,sessionDate,decisionAt,
  completeMatchedCohort:true,researchOnly:true,formalCoreLocked:true,pairs,tally:{populationN:pairs.length}};

const out=buildSystem1H1H5ProspectiveReadiness({c1Diagnosis:c1,c2Ledger:c2,c3Registration:null});
assert.equal(out.hypotheses.length,5);
const by=Object.fromEntries(out.hypotheses.map(x=>[x.id,x]));
assert.equal(by.H1_P1A_SEMANTIC_OVERHARDENING.state,"T0_STRUCTURAL_READY_OUTCOME_PENDING");
assert.equal(by.H1_P1A_SEMANTIC_OVERHARDENING.structuralN,1);
assert.equal(by.H2_TARGET_AVAILABLE_OVERGATING.state,"T0_FOUR_STATE_ECONOMIC_COHORT_AVAILABLE");
assert.equal(by.H2_TARGET_AVAILABLE_OVERGATING.structuralN,1);
assert.equal(by.H2_TARGET_AVAILABLE_OVERGATING.legacyTargetRejectedN,2);
assert.equal(by.H2_TARGET_AVAILABLE_OVERGATING.unknownSourceN,1);
assert.equal(by.H3_RR_GEOMETRY_OVERGATING.state,"T0_RR_GEOMETRY_COHORT_READY");
assert.equal(by.H3_RR_GEOMETRY_OVERGATING.structuralN,1);
assert.equal(by.H4_B_RETEST_CONFIRMATION_DELAY.state,"T1_CAPTURE_NOT_REGISTERED_OR_EMPTY");
assert.equal(by.H4_B_RETEST_CONFIRMATION_DELAY.structuralN,null);
assert.equal(by.H5_DOUBLE_MAX_CHASE_DOWNSTREAM.state,"T1_EXHAUSTIVE_MONITOR_RECEIPT_NOT_AVAILABLE");
assert.equal(by.H5_DOUBLE_MAX_CHASE_DOWNSTREAM.classifierReady,true);
assert.equal(out.deferredT1.zeroBeforeT1IsForbidden,true);
assert.equal(out.formalOptimizationCandidate,"NONE");
assert.equal(out.formalCoreImpact,false);

const currentLike={...c1,observations:c1.observations.map(o=>({
  ...o,targetSemanticsV2:o.formalResult?.ok===false?{state:"TARGET_UNKNOWN_SOURCE",reason:"TARGET_SOURCE_PROVENANCE_NOT_VERIFIED"}:o.targetSemanticsV2
}))};
const blocked=buildSystem1H1H5ProspectiveReadiness({c1Diagnosis:currentLike,c2Ledger:c2,c3Registration:{
  registered:true,generationId,targetTradeDate:"2026-10-08"
}});
const bb=Object.fromEntries(blocked.hypotheses.map(x=>[x.id,x]));
assert.equal(bb.H2_TARGET_AVAILABLE_OVERGATING.state,"T0_BLOCKED_TARGET_SOURCE_PROVENANCE");
assert.equal(bb.H2_TARGET_AVAILABLE_OVERGATING.structuralN,0);
assert.equal(bb.H3_RR_GEOMETRY_OVERGATING.state,"T0_RR_STRUCTURAL_COUNT_AVAILABLE_TARGET_PROVENANCE_BLOCKED");
assert.equal(bb.H3_RR_GEOMETRY_OVERGATING.structuralN,0);
assert.equal(bb.H4_B_RETEST_CONFIRMATION_DELAY.state,"T1_CAPTURE_REGISTERED_AWAIT_NEXT_SESSION");
assert.equal(bb.H4_B_RETEST_CONFIRMATION_DELAY.targetTradeDate,"2026-10-08");
assert.equal(blocked.immediateT0.currentBlockingFact,"C1_V815_TARGET_PROVENANCE_FIELDS_NOT_DURABLY_CAPTURED");

assert.throws(()=>buildSystem1H1H5ProspectiveReadiness({
  c1Diagnosis:{...c1,populationN:99},c2Ledger:c2
}),/MATCHED_C1_C2_REQUIRED/);

console.log(JSON.stringify({
  ok:true,assertions:22,t0T1Separated:true,
  targetUnknownNeverOpportunity:true,rrRequiresVerifiedTarget:true,
  zeroBeforeNextSessionForbidden:true,classifierReadyNotCaptureReady:true,
  economicSuperiority:"UNKNOWN",formalOptimizationCandidate:"NONE",formalCoreImpact:false
}));
