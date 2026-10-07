import assert from "node:assert/strict";
import {buildSystem1OpportunityLossBridge} from "../research/system1_opportunity_loss_bridge_v0_1.mjs";

const sessionDate="2026-10-07",generationId="C1:2026-10-07:test";
const g=(AB="PASS",T="PASS",RR="PASS",GRADE="PASS")=>({
  AB_SETUP:{status:AB},TARGET_AVAILABLE:{status:T},REWARD_RISK:{status:RR},FINAL_SIGNAL_GRADE:{status:GRADE}
});
const obs=(symbol,formal,gates,pool="GENERAL")=>({
  symbol,pool,gates,formalResult:formal,firstFailureReason:formal?.ok===false?"fixture":null
});
const c1={
  schemaVersion:"SYSTEM1_C1_ISOLATED_V0_1",sessionDate,decisionAt:"2026-10-07T15:35:00+08:00",
  populationN:7,observations:[
    obs("1001",{ok:true,selected:true},g()),
    obs("1002",{ok:false,selected:false},g()),
    obs("1003",{ok:false,selected:false},g("PASS","FAIL","UNKNOWN","UNKNOWN")),
    obs("1004",{ok:false,selected:false},g("PASS","PASS","FAIL","UNKNOWN")),
    obs("1005",{ok:false,selected:false},g("PASS","PASS","PASS","FAIL")),
    obs("1006",{ok:false,selected:false},g("FAIL","UNKNOWN","UNKNOWN","UNKNOWN")),
    obs("1007",{ok:false,selected:false},g("UNKNOWN","UNKNOWN","UNKNOWN","UNKNOWN"))
  ]
};
const c5row=(symbol,minimal,p1a=[])=>({
  symbol,minimalUnblockClass:minimal,p1aBlockSet:p1a,reachStage:"F3_P1A_SEMANTIC_BYPASS"
});
const c5={
  schemaVersion:"SYSTEM1_C5_OVERFILTER_DIAGNOSTIC_V0_2",sessionDate,generationId,strategy:"SHORT",
  rows:[
    c5row("1002","P1A_ONLY",["FINANCIAL_SOURCE_COMPLETENESS"]),
    c5row("1003","PRIMARY_ONLY"),
    c5row("1004","PRIMARY_ONLY"),
    c5row("1005","PRIMARY_ONLY"),
    c5row("1006","PRIMARY_ONLY"),
    c5row("1007","UNKNOWN_CONTAMINATED")
  ],
  p1aOnlyN:1,p1aRankableN:1,researchOnly:true,formalCoreLocked:true,economicSuperiority:"UNKNOWN"
};
const c3={
  schemaVersion:"SYSTEM1_C3_ENTRY_EXPERIMENT_V0_1",sessionDate,generationId,
  tally:{eligiblePairN:2,missingEntryReceiptN:0,formalBaselineUnknownN:0},
  rows:[
    {symbol:"1003",baseSetup:"B",formalBaseline:{status:"NO_TRIGGER"},challenger:{fillStatus:"SIM_FILL"}},
    {symbol:"1004",baseSetup:"B",formalBaseline:{status:"TRIGGERED"},challenger:{fillStatus:"SIM_FILL"}}
  ],
  researchOnly:true,formalCoreLocked:true
};
const lifecycle=[
  {schemaVersion:"SYSTEM1_SELECTED_TO_BUY_CAUSE_ROW_V0_1",sessionDate,generationId,symbol:"1003",coverageComplete:true,cause:"MAX_CHASE_15M_BLOCK_B"},
  {schemaVersion:"SYSTEM1_SELECTED_TO_BUY_CAUSE_ROW_V0_1",sessionDate,generationId,symbol:"1004",coverageComplete:true,cause:"MAX_CHASE_QUOTE_BLOCK"},
  {schemaVersion:"SYSTEM1_SELECTED_TO_BUY_CAUSE_ROW_V0_1",sessionDate,generationId,symbol:"1005",coverageComplete:false,cause:"MAX_CHASE_QUOTE_BLOCK"},
  {schemaVersion:"SYSTEM1_SELECTED_TO_BUY_CAUSE_ROW_V0_1",sessionDate:"2026-10-06",generationId,symbol:"bad",coverageComplete:true,cause:"MAX_CHASE_QUOTE_BLOCK"}
];

const out=buildSystem1OpportunityLossBridge({c1Diagnosis:c1,c5Diagnostic:c5,c3EntryExperiment:c3,lifecycleRows:lifecycle});
assert.equal(out.formalSelectedN,1);
assert.equal(out.formalQualifiedN,1);
assert.equal(out.formalRejectedN,6);
assert.equal(out.rejectionBuckets.P1A_ONLY,1);
assert.equal(out.rejectionBuckets.TARGET_GATE,1);
assert.equal(out.rejectionBuckets.RR_GATE,1);
assert.equal(out.rejectionBuckets.GRADE_GATE,1);
assert.equal(out.rejectionBuckets.AB_SETUP,1);
assert.equal(out.rejectionBuckets.UNKNOWN_CONTAMINATED,1);
assert.equal(Object.values(out.rejectionBuckets).reduce((a,b)=>a+b,0),out.formalRejectedN);
assert.equal(out.c3.coverageState,"COMPLETE_FOR_CAPTURED_ELIGIBLE_SET");
assert.equal(out.c3.bNoRetestChallengerSimFillN,1);
assert.equal(out.lifecycle.completeCoverageN,2);
assert.equal(out.lifecycle.incompleteCoverageN,1);
assert.equal(out.lifecycle.invalidN,1);
assert.equal(out.lifecycle.causes.MAX_CHASE_15M_BLOCK_B,1);
assert.equal(out.lifecycle.causes.MAX_CHASE_QUOTE_BLOCK,1);
const h=id=>out.hypotheses.find(x=>x.id===id);
assert.equal(h("H1_P1A_SEMANTIC_OVERHARDENING").structuralN,1);
assert.match(h("H2_TARGET_AVAILABLE_OVERGATING").evidenceState,/FOUR_STATE_NOT_PRESERVED/);
assert.equal(h("H3_RR_GEOMETRY_OVERGATING").structuralN,1);
assert.equal(h("H4_B_RETEST_CONFIRMATION_DELAY").structuralN,1);
assert.equal(h("H5_DOUBLE_MAX_CHASE_DOWNSTREAM").structuralN,2);
assert.equal(out.denominatorRules.unknownNeverOpportunity,true);
assert.equal(out.interpretation.investigationRankIsNotEconomicRank,true);
assert.equal(out.formalOptimizationCandidate,"NONE");
assert.equal(out.autoSwitchAuthorized,false);
assert.equal(out.formalCoreImpact,false);

// Missing C3/lifecycle evidence must remain explicit capture gaps, never zero.
const noEntry=buildSystem1OpportunityLossBridge({c1Diagnosis:c1,c5Diagnostic:c5});
assert.equal(h.call({hypotheses:noEntry.hypotheses},"H4_B_RETEST_CONFIRMATION_DELAY"),undefined);
const h2=id=>noEntry.hypotheses.find(x=>x.id===id);
assert.equal(h2("H4_B_RETEST_CONFIRMATION_DELAY").structuralN,null);
assert.equal(h2("H4_B_RETEST_CONFIRMATION_DELAY").evidenceState,"C3_CAPTURE_NOT_AVAILABLE");
assert.equal(h2("H5_DOUBLE_MAX_CHASE_DOWNSTREAM").structuralN,null);
assert.equal(h2("H5_DOUBLE_MAX_CHASE_DOWNSTREAM").evidenceState,"EXACT_DATE_LIFECYCLE_CAPTURE_NOT_AVAILABLE");

// Deterministic fingerprint under C1/C5 row permutation.
const reversed={
  c1Diagnosis:{...c1,observations:[...c1.observations].reverse()},
  c5Diagnostic:{...c5,rows:[...c5.rows].reverse()},
  c3EntryExperiment:{...c3,rows:[...c3.rows].reverse()},
  lifecycleRows:[...lifecycle].reverse()
};
const out2=buildSystem1OpportunityLossBridge(reversed);
assert.equal(out2.fingerprint,out.fingerprint);

await assert.rejects(async()=>buildSystem1OpportunityLossBridge({
  c1Diagnosis:c1,c5Diagnostic:{...c5,sessionDate:"2026-10-06"}
}),/MATCHED_C5_REQUIRED/);

console.log(JSON.stringify({
  ok:true,assertions:31,formalRejectedN:out.formalRejectedN,
  mutuallyExclusiveRejectionBuckets:true,targetFourStateNotInferred:true,
  c3MissingReceiptNeverNoTrigger:true,maxChaseRequiresCompleteCauseRows:true,
  deterministicFingerprint:true,economicSuperiority:"UNKNOWN",
  formalOptimizationCandidate:"NONE",formalCoreImpact:false
}));
