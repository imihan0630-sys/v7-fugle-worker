import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {
  C5_A2_ROLE_MAP_V0_2,C5_ROLES_V0_2,gateRoleV2,buildC5SemanticRepairDiagnostic
} from "../research/system1_c5_semantic_repair_v0_2.mjs";

let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const ok=x=>{assert.ok(x);n++;};

const inventory=JSON.parse(await readFile(new URL("../shared-knowledge/system1_a2_gate_role_inventory_20261003_v0_1.json",import.meta.url),"utf8"));
for(const g of inventory.gates){
  eq(gateRoleV2(g.id,"SHORT"),g.shortRole);
  eq(gateRoleV2(g.id,"SWING"),g.swingRole);
}
eq(gateRoleV2("SECTOR_BREADTH","SHORT"),C5_ROLES_V0_2.CONTEXT_ONLY);
eq(gateRoleV2("SECTOR_RETURN","SWING"),C5_ROLES_V0_2.CONTEXT_ONLY);
eq(gateRoleV2("SETUP_A","SHORT"),C5_ROLES_V0_2.PRIMARY_ALPHA);
eq(gateRoleV2("SETUP_B","SWING"),C5_ROLES_V0_2.PRIMARY_ALPHA);
eq(gateRoleV2("ACCOUNT_RISK","SHORT"),C5_ROLES_V0_2.HARD_INVALIDATION);

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
  symbol,pool:"GENERAL",formalResult:{ok:false},firstFailureReason:reason,
  gates:{...base,...patch}
});
const observations=[
  obs("AAA","RS_CONTEXT",{RS_CONTEXT:unk}),
  obs("BBB","RS_CONTEXT",{RS_CONTEXT:unk,AB_SETUP:fail}),
  obs("CCC","MARKET_CAP_FLOOR",{MARKET_CAP_FLOOR:fail}),
  obs("DDD","ACCOUNT_RISK",{ACCOUNT_RISK:fail}),
  obs("EEE","CHIP_CONCENTRATION_PRESENT",{CHIP_CONCENTRATION_PRESENT:unk,TARGET_AVAILABLE:unk}),
  obs("FFF","FINANCIAL_SOURCE_COMPLETENESS",{FINANCIAL_SOURCE_COMPLETENESS:unk}),
  obs("GGG","RS_CONTEXT",{RS_CONTEXT:unk,SECTOR_GATE:fail})
];
const generationId="g-c5-v2",sessionDate="2026-10-02",decisionAt="2026-10-02T23:35:00+08:00";
const pairs=observations.map(o=>({
  symbol:o.symbol,pool:"GENERAL",sessionDate,parentId:generationId,
  formal:{qualified:false,selected:false,firstFailure:o.firstFailureReason},
  short:{gateStatus:"UNKNOWN",missingSafety:[],withoutSafetyGateStatus:"PASS"},
  swing:{gateStatus:"UNKNOWN",missingSafety:[]},
  researchOnly:true,decisionImpact:false
}));
const c1={schemaVersion:"SYSTEM1_C1_ISOLATED_V0_1",sessionDate,populationN:observations.length,observations};
const c2={schemaVersion:"SYSTEM1_C2_PAIRED_LEDGER_V0_1",generationId,sessionDate,decisionAt,
  completeMatchedCohort:true,researchOnly:true,formalCoreLocked:true,pairs,tally:{populationN:pairs.length}};

const d=buildC5SemanticRepairDiagnostic(c1,c2,{strategy:"SHORT"});
eq(d.schemaVersion,"SYSTEM1_C5_SEMANTIC_REPAIR_V0_2");
eq(d.formalRejectedN,7);
eq(d.p1aRejectedN,5);
eq(d.p1aOnlyN,2);
eq(d.p1aPlusPrimaryN,1);
eq(d.p1aPlusContextN,1);
eq(d.hardBlockedN,1);
eq(d.unknownContaminatedN,1);
eq(d.p1aReachABN,4);
eq(d.p1aABPassN,3);
eq(d.p1aReachRRN,2);
eq(d.p1aRRPassN,2);
eq(d.p1aGradePassN,2);
eq(d.p1aRankableN,2);
eq(d.unknownNeverPasses,true);
eq(d.p1aRankableIsNotCandidate,true);
eq(d.candidateCountLiftIsNotSuccess,true);
eq(d.economicSuperiority,"UNKNOWN");
eq(d.formalOptimizationCandidate,"NONE");

const by=Object.fromEntries(d.rows.map(x=>[x.symbol,x]));
eq(by.AAA.minimalUnblockClass,"P1A_ONLY");
eq(by.AAA.reachStage,"F9_RANKABLE");
ok(by.AAA.confidenceBlockSet.includes("RS_CONTEXT"));
ok(by.AAA.unknownDependencySet.includes("RS_CONTEXT"));
eq(by.AAA.hardBlockSet,[]);
eq(by.AAA.sourceVintageReceiptIdsStatus,"UNAVAILABLE_IN_C1_DIAGNOSIS");

eq(by.BBB.minimalUnblockClass,"P1A_PLUS_PRIMARY");
eq(by.BBB.reachStage,"F4_AB_EVALUABLE");
ok(by.BBB.primaryBlockSet.includes("AB_SETUP"));

eq(by.CCC.minimalUnblockClass,"CONTEXT_ONLY");
eq(by.CCC.reachStage,"F3_P1A_SEMANTIC_BYPASS");
eq(by.CCC.p1aBlockSet,[]);
ok(by.CCC.contextBlockSet.includes("MARKET_CAP_FLOOR"));

eq(by.DDD.minimalUnblockClass,"HARD_BLOCKED");
eq(by.DDD.reachStage,"F1_SAFETY_EVALUABLE");
ok(by.DDD.hardBlockSet.includes("ACCOUNT_RISK"));

eq(by.EEE.minimalUnblockClass,"UNKNOWN_CONTAMINATED");
eq(by.EEE.reachStage,"F5_AB_PASS");
ok(by.EEE.p1aBlockSet.includes("CHIP_CONCENTRATION_PRESENT"));
ok(by.EEE.unknownDependencySet.includes("TARGET_AVAILABLE"));

eq(by.FFF.minimalUnblockClass,"P1A_ONLY");
eq(by.FFF.reachStage,"F9_RANKABLE");

eq(by.GGG.minimalUnblockClass,"P1A_PLUS_CONTEXT");
eq(by.GGG.reachStage,"F3_P1A_SEMANTIC_BYPASS");
ok(by.GGG.contextBlockSet.includes("SECTOR_GATE"));

eq(d.roleFails.CONFIDENCE_UNCERTAINTY,0);
eq(d.roleFails.CONTEXT_ONLY,2);
eq(d.roleFails.PRIMARY_ALPHA,1);
eq(d.roleFails.HARD_INVALIDATION,1);
ok(typeof d.roleMapFingerprint==="string"&&d.roleMapFingerprint.length===64);
eq(Object.keys(C5_A2_ROLE_MAP_V0_2).includes("RS_CONTEXT"),true);
eq(C5_A2_ROLE_MAP_V0_2.RS_CONTEXT.SHORT,"CONFIDENCE_UNCERTAINTY");
eq(C5_A2_ROLE_MAP_V0_2.CHIP_CONCENTRATION_PRESENT.SWING,"CONFIDENCE_UNCERTAINTY");
eq(C5_A2_ROLE_MAP_V0_2.FUNDAMENTAL_COMPONENT_COUNT.SHORT,"CONFIDENCE_UNCERTAINTY");
eq(C5_A2_ROLE_MAP_V0_2.DAILY_ABNORMALITY.SHORT,"CONTEXT_ONLY");
eq(C5_A2_ROLE_MAP_V0_2.LIQUIDITY.SHORT,"CONFIDENCE_UNCERTAINTY");
eq(C5_A2_ROLE_MAP_V0_2.SECTOR_GATE.SHORT,"CONTEXT_ONLY");
eq(C5_A2_ROLE_MAP_V0_2.TARGET_AVAILABLE.SHORT,"CONFIDENCE_UNCERTAINTY");

assert.throws(()=>buildC5SemanticRepairDiagnostic({...c1,populationN:6},c2,{strategy:"SHORT"}),/C5_V2_MATCHED_C1_C2_REQUIRED/);n++;
assert.throws(()=>gateRoleV2("RS_CONTEXT","DAYTRADE"),/C5_V2_STRATEGY_INVALID/);n++;

console.log(JSON.stringify({
  ok:true,assertions:n,a2Parity:true,fullBlockingSets:true,p1aReachFunnel:true,
  unknownToPass:false,firstFailureCausal:false,p1aRankableIsCandidate:false,
  economicSuperiority:"UNKNOWN",formalCoreImpact:false,system2Touched:false
}));
