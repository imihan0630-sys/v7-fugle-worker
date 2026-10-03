import assert from "node:assert/strict";
import {buildP1ASafetyCaptureDemand} from "../research/system1_p1a_safety_capture_demand_v0_1.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const ok=x=>{assert.ok(x);n++;};

const sessionDate="2026-10-02",generationId="g-demand-1";
const c5={
  schemaVersion:"SYSTEM1_C5_SEMANTIC_REPAIR_V0_2",
  sessionDate,generationId,strategy:"SHORT",formalRejectedN:5,p1aRankableN:1,
  rows:[
    {symbol:"AAA",p1aBlockSet:["RS_CONTEXT"],reachStage:"F0_FORMAL_PARENT"},
    {symbol:"BBB",p1aBlockSet:["RS_CONTEXT"],reachStage:"F1_SAFETY_EVALUABLE"},
    {symbol:"CCC",p1aBlockSet:["CHIP_CONCENTRATION_PRESENT"],reachStage:"F0_FORMAL_PARENT"},
    {symbol:"DDD",p1aBlockSet:["FUNDAMENTAL_COMPONENT_COUNT"],reachStage:"F9_RANKABLE"},
    {symbol:"EEE",p1aBlockSet:[],reachStage:"F4_AB_EVALUABLE"}
  ],
  researchOnly:true,formalCoreLocked:true,economicSuperiority:"UNKNOWN"
};
const conditional={
  schemaVersion:"SYSTEM1_P1A_CONDITIONAL_REACH_UPPER_BOUND_V0_1",
  sessionDate,generationId,strategy:"SHORT",
  rows:[
    {symbol:"AAA",conditionalReachStage:"F9_RANKABLE",conditionalP1aRankable:true,
      conditionalSafetyUnknownSet:["EXECUTION_FEASIBILITY","ACCOUNT_RISK","CORPORATE_ACTION_CONTINUITY"],
      verifiedSafetyFailSet:[],conditionalReachBlockedBy:[]},
    {symbol:"BBB",conditionalReachStage:"F1_SAFETY_EVALUABLE",conditionalP1aRankable:false,
      conditionalSafetyUnknownSet:[],verifiedSafetyFailSet:["ACCOUNT_RISK"],conditionalReachBlockedBy:["ACCOUNT_RISK"]},
    {symbol:"CCC",conditionalReachStage:"F5_AB_PASS",conditionalP1aRankable:false,
      conditionalSafetyUnknownSet:["ACCOUNT_RISK"],verifiedSafetyFailSet:[],conditionalReachBlockedBy:["TARGET_AVAILABLE"]},
    {symbol:"DDD",conditionalReachStage:"F9_RANKABLE",conditionalP1aRankable:true,
      conditionalSafetyUnknownSet:[],verifiedSafetyFailSet:[],conditionalReachBlockedBy:[]}
  ],
  researchOnly:true,formalCoreLocked:true
};

const d=buildP1ASafetyCaptureDemand(c5,conditional);
eq(d.schemaVersion,"SYSTEM1_P1A_SAFETY_CAPTURE_DEMAND_V0_1");
eq(d.denominator.formalRejectedN,5);
eq(d.denominator.p1aRowsN,4);
eq(d.denominator.strictF9N,1);
eq(d.denominator.conditionalF9N,2);
eq(d.denominator.incrementalConditionalF9N,1);
eq(d.denominator.conditionalF9WithSafetyUnknownN,1);
eq(d.denominator.conditionalF9WithoutSafetyUnknownN,1);
eq(d.ratios.conditionalF9OfFormalRejectedPct,40);
eq(d.ratios.incrementalConditionalF9OfFormalRejectedPct,20);
eq(d.ratios.conditionalF9OfP1aPct,50);
eq(d.ratios.incrementalConditionalF9OfP1aPct,25);

const family=Object.fromEntries(d.familyDemand.map(x=>[x.family,x]));
eq(family.ACCOUNT_RISK.unresolvedAllP1aN,2);
eq(family.ACCOUNT_RISK.unresolvedConditionalF9N,1);
eq(family.ACCOUNT_RISK.unresolvedIncrementalF9N,1);
eq(family.CORPORATE_ACTION_CONTINUITY.unresolvedAllP1aN,1);
eq(family.CORPORATE_ACTION_CONTINUITY.unresolvedIncrementalF9N,1);
eq(family.EXECUTION_FEASIBILITY.unresolvedIncrementalF9N,1);
eq(family.SOURCE_AUTHENTICITY.unresolvedIncrementalF9N,0);
eq(family.SESSION_CONTINUITY.unresolvedIncrementalF9N,0);

eq(d.combinationDemand.incrementalConditionalF9,[{
  combination:"ACCOUNT_RISK+CORPORATE_ACTION_CONTINUITY+EXECUTION_FEASIBILITY",count:1
}]);
eq(d.demandState,"INCREMENTAL_SAFETY_CAPTURE_DEMAND_MEASURED_THRESHOLD_NOT_FROZEN");
eq(d.materialityThresholdStatus,"NOT_FROZEN");
eq(d.materialityClassification,"UNCLASSIFIED_THRESHOLD_NOT_FROZEN");
eq(d.captureLaneAuthorization,"NONE");
eq(d.classBImplementationAuthorized,false);

const rows=Object.fromEntries(d.rows.map(x=>[x.symbol,x]));
eq(rows.AAA.incrementalConditionalRankable,true);
eq(rows.AAA.unresolvedSafetyFamilies,["ACCOUNT_RISK","CORPORATE_ACTION_CONTINUITY","EXECUTION_FEASIBILITY"]);
eq(rows.BBB.incrementalConditionalRankable,false);
eq(rows.BBB.verifiedSafetyFailSet,["ACCOUNT_RISK"]);
eq(rows.CCC.conditionalRankable,false);
eq(rows.CCC.conditionalReachBlockedBy,["TARGET_AVAILABLE"]);
eq(rows.DDD.strictRankable,true);
eq(rows.DDD.incrementalConditionalRankable,false);
eq(rows.EEE,undefined);

ok(d.rows.every(x=>x.captureAuthorization===false&&x.buyAuthorized===false&&x.allocation===0&&x.signal===null));
eq(d.interpretation.countsMeasureEngineeringDemandNotEconomicBenefit,true);
eq(d.interpretation.incrementalF9IsUpperBoundNotCandidateCount,true);
eq(d.interpretation.positiveDemandDoesNotAuthorizeSafetyCapture,true);
eq(d.economicSuperiority,"UNKNOWN");
eq(d.formalOptimizationCandidate,"NONE");

const noIncremental=buildP1ASafetyCaptureDemand(
  {...c5,rows:[{symbol:"DDD",p1aBlockSet:["FUNDAMENTAL_COMPONENT_COUNT"],reachStage:"F9_RANKABLE"}],formalRejectedN:1,p1aRankableN:1},
  {...conditional,rows:[{symbol:"DDD",conditionalReachStage:"F9_RANKABLE",conditionalP1aRankable:true,
    conditionalSafetyUnknownSet:[],verifiedSafetyFailSet:[],conditionalReachBlockedBy:[]}]}
);
eq(noIncremental.denominator.incrementalConditionalF9N,0);
eq(noIncremental.demandState,"NO_INCREMENTAL_SAFETY_CAPTURE_DEMAND_OBSERVED");
eq(noIncremental.classBImplementationAuthorized,false);

const noP1=buildP1ASafetyCaptureDemand(
  {...c5,rows:[{symbol:"EEE",p1aBlockSet:[],reachStage:"F4_AB_EVALUABLE"}],formalRejectedN:1,p1aRankableN:0},
  {...conditional,rows:[]}
);
eq(noP1.denominator.p1aRowsN,0);
eq(noP1.demandState,"NO_P1A_ROWS");

assert.throws(()=>buildP1ASafetyCaptureDemand(c5,{...conditional,sessionDate:"2026-10-01"}),/MATCHED_INPUTS_REQUIRED/);n++;
assert.throws(()=>buildP1ASafetyCaptureDemand(c5,{...conditional,rows:conditional.rows.slice(0,-1)}),/CONDITIONAL_DENOMINATOR_INCOMPLETE/);n++;
assert.throws(()=>buildP1ASafetyCaptureDemand(c5,{...conditional,rows:conditional.rows.map((x,i)=>i===0?{
  ...x,conditionalSafetyUnknownSet:["NOT_A_SAFETY_FAMILY"]
}:x)}),/NONCANONICAL_FAMILY/);n++;

console.log(JSON.stringify({
  ok:true,assertions:n,incrementalDemandSeparated:true,safetyFailExcludedFromDemand:true,
  strictAlreadyRankableSeparated:true,nonSafetyBlockerPreserved:true,
  materialityThresholdInvented:false,classBAuthorized:false,
  formalCoreImpact:false,system2Touched:false
}));
