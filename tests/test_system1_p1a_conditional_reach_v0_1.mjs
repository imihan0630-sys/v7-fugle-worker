import assert from "node:assert/strict";
import {buildC5SemanticRepairDiagnostic} from "../research/system1_c5_semantic_repair_v0_2.mjs";
import {buildP1AConditionalReachUpperBound} from "../research/system1_p1a_conditional_reach_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const ok=x=>{assert.ok(x);n++;};
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
const obs=(symbol,reason,patch)=>({
  symbol,pool:"GENERAL",formalResult:{ok:false},firstFailureReason:reason,gates:{...base,...patch}
});
const observations=[
  obs("AAA","RS_CONTEXT",{RS_CONTEXT:unk,CORPORATE_ACTION_CONTINUITY:unk,EXECUTION_FEASIBILITY:unk,ACCOUNT_RISK:unk}),
  obs("BBB","RS_CONTEXT",{RS_CONTEXT:unk,ACCOUNT_RISK:fail}),
  obs("CCC","CHIP_CONCENTRATION_PRESENT",{CHIP_CONCENTRATION_PRESENT:unk,ACCOUNT_RISK:unk,TARGET_AVAILABLE:unk}),
  obs("DDD","FUNDAMENTAL_COMPONENT_COUNT",{FUNDAMENTAL_COMPONENT_COUNT:unk}),
  obs("EEE","AB_SETUP",{AB_SETUP:fail}),
  obs("FFF","RS_CONTEXT",{RS_CONTEXT:unk,ACCOUNT_RISK:unk,LIQUIDITY:unk})
];
const generationId="g-cond-1",sessionDate="2026-10-02",decisionAt="2026-10-02T23:35:00+08:00";
const c1={schemaVersion:"SYSTEM1_C1_ISOLATED_V0_1",sessionDate,decisionAt,populationN:observations.length,observations};
const pairs=observations.map(o=>({
  symbol:o.symbol,pool:"GENERAL",sessionDate,parentId:generationId,
  formal:{qualified:false,selected:false,firstFailure:o.firstFailureReason},
  short:{gateStatus:"UNKNOWN",missingSafety:[],withoutSafetyGateStatus:"PASS"},
  swing:{gateStatus:"UNKNOWN",missingSafety:[]},
  researchOnly:true,decisionImpact:false
}));
const c2={schemaVersion:"SYSTEM1_C2_PAIRED_LEDGER_V0_1",generationId,sessionDate,decisionAt,
  completeMatchedCohort:true,researchOnly:true,formalCoreLocked:true,pairs,tally:{populationN:pairs.length}};
const strict=buildC5SemanticRepairDiagnostic(c1,c2,{strategy:"SHORT"});
const before=JSON.stringify(c1);
const d=buildP1AConditionalReachUpperBound(c1,strict);
eq(JSON.stringify(c1),before);

eq(d.schemaVersion,"SYSTEM1_P1A_CONDITIONAL_REACH_UPPER_BOUND_V0_1");
eq(d.p1aStrictRankableN,1);
eq(d.p1aConditionalSafetyUnknownN,3);
eq(d.verifiedSafetyFailN,1);
eq(d.p1aConditionalReachABN,4);
eq(d.p1aConditionalABPassN,4);
eq(d.p1aConditionalReachRRN,2);
eq(d.p1aConditionalRRPassN,2);
eq(d.p1aConditionalGradePassN,2);
eq(d.p1aConditionalRankableN,2);
eq(d.nonSafetyUnknownBlockedN,2);
eq(d.interpretation,"MATERIALITY_THRESHOLD_NOT_FROZEN");
eq(d.materialityThresholdStatus,"NOT_FROZEN");
eq(d.safetyCaptureDecision,"DEFER_UNTIL_MATERIALITY_THRESHOLD_AND_PROSPECTIVE_COUNTS");
eq(d.unknownNeverPasses,true);
eq(d.safetyFailNeverBypassed,true);
eq(d.nonSafetyStatePreserved,true);
eq(d.conditionalRankableIsNotCandidate,true);

const by=Object.fromEntries(d.rows.map(x=>[x.symbol,x]));
eq(by.AAA.strictReachStage,"F0_FORMAL_PARENT");
eq(by.AAA.conditionalReachStage,"F9_RANKABLE");
eq(by.AAA.conditionalOnSafetyUnknown,true);
eq(by.AAA.conditionalSafetyUnknownSet,["ACCOUNT_RISK","CORPORATE_ACTION_CONTINUITY","EXECUTION_FEASIBILITY"]);
eq(by.AAA.conditionalReachBlockedBy,[]);
eq(by.AAA.conditionalP1aRankable,true);

eq(by.BBB.conditionalReachStage,"F1_SAFETY_EVALUABLE");
eq(by.BBB.verifiedSafetyFailSet,["ACCOUNT_RISK"]);
eq(by.BBB.conditionalP1aRankable,false);

eq(by.CCC.conditionalReachStage,"F5_AB_PASS");
eq(by.CCC.conditionalReachBlockedBy,["TARGET_AVAILABLE"]);
eq(by.CCC.conditionalOnSafetyUnknown,true);

eq(by.DDD.strictReachStage,"F9_RANKABLE");
eq(by.DDD.conditionalReachStage,"F9_RANKABLE");
eq(by.DDD.conditionalOnSafetyUnknown,false);

eq(by.FFF.conditionalReachStage,"F3_P1A_SEMANTIC_BYPASS");
eq(by.FFF.conditionalReachBlockedBy,["LIQUIDITY"]);
eq(by.FFF.conditionalP1aRankable,false);

eq(by.EEE,undefined);
ok(d.rows.every(x=>x.researchUpperBoundOnly===true&&x.buyAuthorized===false&&x.allocation===0&&x.signal===null));
ok(d.rows.every(x=>x.unknownToPassMutation===false));

const noP1Obs=[obs("ZZZ","AB_SETUP",{AB_SETUP:fail})];
const noP1C1={...c1,populationN:1,observations:noP1Obs};
const noP1C2={...c2,pairs:[{...pairs[0],symbol:"ZZZ",formal:{qualified:false,selected:false,firstFailure:"AB_SETUP"}}],tally:{populationN:1}};
const noP1Strict=buildC5SemanticRepairDiagnostic(noP1C1,noP1C2,{strategy:"SHORT"});
const noP1=buildP1AConditionalReachUpperBound(noP1C1,noP1Strict);
eq(noP1.p1aConditionalRankableN,0);
eq(noP1.interpretation,"CONDITIONAL_P1A_IMMATERIAL");

const blockedObs=[obs("YYY","RS_CONTEXT",{RS_CONTEXT:unk,ACCOUNT_RISK:unk,TARGET_AVAILABLE:unk})];
const blockedC1={...c1,populationN:1,observations:blockedObs};
const blockedC2={...c2,pairs:[{...pairs[0],symbol:"YYY",formal:{qualified:false,selected:false,firstFailure:"RS_CONTEXT"}}],tally:{populationN:1}};
const blockedStrict=buildC5SemanticRepairDiagnostic(blockedC1,blockedC2,{strategy:"SHORT"});
const blocked=buildP1AConditionalReachUpperBound(blockedC1,blockedStrict);
eq(blocked.p1aConditionalRankableN,0);
eq(blocked.nonSafetyUnknownBlockedN,1);
eq(blocked.interpretation,"CONDITIONAL_P1A_BLOCKED_BY_NONSAFETY_UNKNOWN");

assert.throws(()=>buildP1AConditionalReachUpperBound({...c1,sessionDate:"2026-10-01"},strict),/MATCHED_C1_C5_REQUIRED/);n++;

console.log(JSON.stringify({
  ok:true,assertions:n,conditionalSafetyUnknownOnly:true,verifiedSafetyFailStops:true,
  nonSafetyUnknownPreserved:true,unknownToPassMutation:false,materialityThresholdInvented:false,
  formalCoreImpact:false,system2Touched:false
}));
