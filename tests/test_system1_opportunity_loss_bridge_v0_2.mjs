import assert from "node:assert/strict";
import {buildSystem1OpportunityLossBridgeV02} from "../research/system1_opportunity_loss_bridge_v0_2.mjs";

const sessionDate="2026-10-07",generationId="C1:2026-10-07:g1";
const g=(AB="PASS",T="PASS",RR="PASS",GRADE="PASS")=>({
  AB_SETUP:{status:AB},TARGET_AVAILABLE:{status:T},REWARD_RISK:{status:RR},FINAL_SIGNAL_GRADE:{status:GRADE}
});
const c1={
  schemaVersion:"SYSTEM1_C1_ISOLATED_V0_1",sessionDate,decisionAt:"2026-10-07T15:35:00+08:00",
  populationN:3,observations:[
    {symbol:"1001",pool:"GENERAL",gates:g(),formalResult:{ok:true,selected:true}},
    {symbol:"1002",pool:"GENERAL",gates:g(),formalResult:{ok:false,selected:false},firstFailureReason:"fixture"},
    {symbol:"1003",pool:"GENERAL",gates:g("PASS","PASS","FAIL","UNKNOWN"),formalResult:{ok:false,selected:false},firstFailureReason:"fixture"}
  ]
};
const c5={
  schemaVersion:"SYSTEM1_C5_OVERFILTER_DIAGNOSTIC_V0_2",sessionDate,generationId,strategy:"SHORT",
  rows:[
    {symbol:"1002",minimalUnblockClass:"P1A_ONLY",p1aBlockSet:["FINANCIAL_SOURCE_COMPLETENESS"],reachStage:"F3_P1A_SEMANTIC_BYPASS"},
    {symbol:"1003",minimalUnblockClass:"PRIMARY_ONLY",p1aBlockSet:[],reachStage:"F6_TARGET_RR_EVALUABLE"}
  ],
  p1aOnlyN:1,p1aRankableN:1,researchOnly:true,formalCoreLocked:true,economicSuperiority:"UNKNOWN"
};
const lifecycle=[
  {
    schemaVersion:"SYSTEM1_SELECTED_TO_BUY_CAUSE_ROW_V0_1",sessionDate,generationId,
    symbol:"1001",planIdentity:"p1",coverageComplete:true,cause:"MAX_CHASE_15M_BLOCK_B",
    secondaryCauses:["MAX_CHASE_QUOTE_BLOCK"],
    causeEventCounts:{MAX_CHASE_15M_BLOCK_B:2,MAX_CHASE_QUOTE_BLOCK:3}
  },
  {
    schemaVersion:"SYSTEM1_SELECTED_TO_BUY_CAUSE_ROW_V0_1",sessionDate,generationId,
    symbol:"1002",planIdentity:"p2",coverageComplete:true,cause:"MAX_CHASE_QUOTE_BLOCK",
    secondaryCauses:[],causeEventCounts:{MAX_CHASE_QUOTE_BLOCK:1}
  },
  {
    schemaVersion:"SYSTEM1_SELECTED_TO_BUY_CAUSE_ROW_V0_1",sessionDate,generationId,
    symbol:"1003",planIdentity:"p3",coverageComplete:false,cause:"MAX_CHASE_QUOTE_BLOCK"
  }
];
const out=buildSystem1OpportunityLossBridgeV02({c1Diagnosis:c1,c5Diagnostic:c5,lifecycleRows:lifecycle});
assert.equal(out.schemaVersion,"SYSTEM1_OPPORTUNITY_LOSS_BRIDGE_V0_2");
assert.equal(out.lifecycle.validCompletePlanN,2);
assert.equal(out.lifecycle.incompleteCoverageN,1);
assert.equal(out.lifecycle.maxChaseUniqueSymbolN,2);
assert.equal(out.lifecycle.maxChaseUniquePlanN,2);
assert.equal(out.lifecycle.maxChaseCauseMembershipN,3);
assert.equal(out.lifecycle.maxChaseEventN,6);
assert.equal(out.lifecycle.componentUniqueSymbols.maxChase15mBlockB,1);
assert.equal(out.lifecycle.componentUniqueSymbols.maxChaseQuoteBlock,2);
assert.equal(out.lifecycle.causeMemberships.MAX_CHASE_15M_BLOCK_B,1);
assert.equal(out.lifecycle.causeMemberships.MAX_CHASE_QUOTE_BLOCK,2);
assert.equal(out.lifecycle.causeEvents.MAX_CHASE_15M_BLOCK_B,2);
assert.equal(out.lifecycle.causeEvents.MAX_CHASE_QUOTE_BLOCK,4);
const h5=out.hypotheses.find(x=>x.id==="H5_DOUBLE_MAX_CHASE_DOWNSTREAM");
assert.equal(h5.structuralN,2);
assert.equal(h5.components.maxChase15mUniqueSymbols,1);
assert.equal(h5.components.maxChaseQuoteUniqueSymbols,2);
assert.equal(h5.components.maxChase15mEvents,2);
assert.equal(h5.components.maxChaseQuoteEvents,4);
assert.equal(out.denominatorRules.maxChaseStructuralNUsesUniqueSymbol,true);
assert.equal(out.interpretation.sameSymbolTwoMaxChaseLayersDoNotBecomeTwoStocks,true);
assert.equal(out.formalOptimizationCandidate,"NONE");
assert.equal(out.formalCoreImpact,false);

const reversed=buildSystem1OpportunityLossBridgeV02({
  c1Diagnosis:{...c1,observations:[...c1.observations].reverse()},
  c5Diagnostic:{...c5,rows:[...c5.rows].reverse()},
  lifecycleRows:[...lifecycle].reverse()
});
assert.equal(reversed.fingerprint,out.fingerprint);

assert.throws(()=>buildSystem1OpportunityLossBridgeV02({
  c1Diagnosis:c1,c5Diagnostic:c5,lifecycleRows:[lifecycle[0],{...lifecycle[0]}]
}),/DUPLICATE_COMPLETE_PLAN_CAUSE_ROW/);

console.log(JSON.stringify({
  ok:true,assertions:22,maxChaseUniqueSymbolDenominator:true,
  layerMembershipSeparated:true,repeatedEventsSeparated:true,
  duplicatePlanRejected:true,deterministicFingerprint:true,
  economicSuperiority:"UNKNOWN",formalOptimizationCandidate:"NONE",formalCoreImpact:false
}));
