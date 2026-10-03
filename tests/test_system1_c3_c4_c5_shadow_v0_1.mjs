import assert from "node:assert/strict";
import {buildC3EntryExperiment,buildC4AllocationExperiment,buildC5OverfilterDiagnostic,gateRole,resolveGateRole,ROLES,C3_CONTRACT} from "../research/system1_c3_c4_c5_shadow_v0_1.mjs";

let n=0;const eq=(a,b)=>{assert.deepEqual(a,b);n++};const ok=x=>{assert.ok(x);n++};
const decisionAt="2026-10-02T23:35:00+08:00",sessionDate="2026-10-02",generationId="c1-gen-1";
const mkPair=(symbol,formalOk=false,extra={})=>({
  symbol,pool:"GENERAL",sessionDate,parentId:generationId,
  formal:{qualified:formalOk,selected:false,firstFailure:extra.firstFailure||"UNKNOWN"},
  short:{gateStatus:extra.shortGateStatus||"PASS",failedGates:[],unknownGates:[],
    withoutSafetyGateStatus:extra.withoutSafetyGateStatus||"PASS",lifecycle:"WATCH_EARLY",
    blockers:[],missingSafety:extra.missingSafety||[]},
  swing:{gateStatus:"UNKNOWN",failedGates:[],unknownGates:["FUNDAMENTAL_QUALITY"],lifecycle:"DATA_BLOCKED",blockers:["FUNDAMENTAL_QUALITY"]},
  buyAuthorized:false,allocation:0,signal:null,researchOnly:true,decisionImpact:false
});
const pairs=[
  mkPair("AAA",false,{firstFailure:"VALUATION_RELATIVE_RISK",shortGateStatus:"UNKNOWN",missingSafety:["ACCOUNT_RISK"]}),
  mkPair("BBB",false,{firstFailure:"LIQUIDITY"}),
  mkPair("CCC",false,{firstFailure:"AB_SETUP"}),
  mkPair("DDD",true)
];
const c2={schemaVersion:"SYSTEM1_C2_PAIRED_LEDGER_V0_1",generationId,sessionDate,decisionAt,fingerprint:"f".repeat(64),
  completeMatchedCohort:true,researchOnly:true,formalCoreLocked:true,pairs,
  tally:{populationN:4,formalRejectedButConditionalShortGatesPassN:1}};

const geomA={authenticated:true,parentId:generationId,sessionDate,knownAt:decisionAt,support:100,breakout:null,stop:95,target:117};
const geomB={authenticated:true,parentId:generationId,sessionDate,knownAt:decisionAt,support:null,breakout:200,stop:190,target:235};
const bar=(endAt,open,high,low,close,volumeRatio=1.3,depthScore=70,gapPct=1)=>({endAt,open,high,low,close,volumeRatio,depthScore,gapPct,completed:true,limitUp:false,lateStage:false});
const receipts=[
  {symbol:"BBB",sessionDate,parentId:generationId,baseSetup:"A",geometry:geomA,formalBaseline:{status:"TRIGGERED",verified:true,parentId:generationId,sessionDate,knownAt:"2026-10-03T09:16:00+08:00"},
   bars:[
    bar("2026-10-03T09:15:00+08:00",101,103,99,101.5,0.9,55,0.5),
    bar("2026-10-03T09:30:00+08:00",102,104,101,103),
    bar("2026-10-03T09:45:00+08:00",103,118,94,110)
   ]},
  {symbol:"CCC",sessionDate,parentId:generationId,baseSetup:"B",geometry:geomB,formalBaseline:{status:"NO_TRIGGER",verified:true,parentId:generationId,sessionDate,knownAt:"2026-10-03T13:30:00+08:00"},
   bars:[
    bar("2026-10-03T09:15:00+08:00",202,204,201,203,1.3,70,1),
    bar("2026-10-03T09:30:00+08:00",204,209,203,208,1.4,75,1),
    bar("2026-10-03T09:45:00+08:00",208,236,207,234,1.5,80,1)
   ]},
  {symbol:"AAA",sessionDate,parentId:generationId,baseSetup:"B",geometry:geomB,formalBaseline:{status:"TRIGGERED"},
   bars:[
    bar("2026-10-03T09:15:00+08:00",202,204,201,203),
    bar("2026-10-03T09:30:00+08:00",204,209,203,208)
   ]}
];
const c3=buildC3EntryExperiment(c2,receipts,{costs:{brokerFeeBpsPerSide:14.25,sellTaxBps:30,slippageBpsPerSide:5}});
eq(c3.schemaVersion,"SYSTEM1_C3_ENTRY_EXPERIMENT_V0_1");
eq(c3.tally.receiptN,3);
eq(c3.tally.eligiblePairN,3);
eq(c3.tally.missingEntryReceiptN,1);
eq(c3.tally.formalBaselineUnknownN,1);
eq(c3.tally.formalTriggeredN,1);
eq(c3.tally.formalNoTriggerChallengerSimFillN,1);
eq(c3.rows.find(x=>x.symbol==="BBB").challenger.outcome,"STOP_FIRST_AMBIGUOUS");
eq(c3.rows.find(x=>x.symbol==="CCC").challenger.outcome,"TARGET");
eq(c3.rows.find(x=>x.symbol==="AAA").challenger.status,"NOT_ELIGIBLE");
eq(c3.rows.find(x=>x.symbol==="AAA").formalBaseline.status,"UNKNOWN");
eq(c3.rows.find(x=>x.symbol==="AAA").formalBaseline.verified,false);
eq(c3.rows.find(x=>x.symbol==="CCC").challenger.fillStatus,"SIM_FILL");
ok(c3.rows.find(x=>x.symbol==="CCC").challenger.simulatedNetReturnPct>0);
eq(c3.economicSuperiority,"UNKNOWN");
eq(c3.noTrade,true);eq(c3.noPush,true);eq(c3.formalCoreLocked,true);
eq(C3_CONTRACT.fillRule,"NEXT_COMPLETED_BAR_OPEN");eq(C3_CONTRACT.ambiguousSameBarExit,"STOP_FIRST");

assert.throws(()=>buildC3EntryExperiment(c2,[{...receipts[0],geometry:{...geomA,knownAt:"2026-10-03T09:00:00+08:00"}}],{costs:{brokerFeeBpsPerSide:14.25,sellTaxBps:30,slippageBpsPerSide:5}}),/C3_NON_PIT_GEOMETRY/);n++;
assert.throws(()=>buildC3EntryExperiment(c2,receipts,{costs:{brokerFeeBpsPerSide:14.25,sellTaxBps:null,slippageBpsPerSide:5}}),/C3_FROZEN_COST_CONTRACT_REQUIRED/);n++;

const c4=buildC4AllocationExperiment([
  {symbol:"X1",priorityScore:90,entry:100,stop:95},
  {symbol:"X2",priorityScore:60,entry:100,stop:90},
  {symbol:"X3",priorityScore:30,entry:100,stop:98}
],{totalCapital:200000,gridNTD:1000,perNameCapRatio:0.35});
eq(c4.schemaVersion,"SYSTEM1_C4_ALLOCATION_EXPERIMENT_V0_1");
eq(c4.nominalDeployRatioPct,85);
eq(c4.perNameCapPct,35);
eq(c4.comparators.length,3);
const formal=c4.comparators.find(x=>x.name.startsWith("FORMAL_"));
const equal=c4.comparators.find(x=>x.name.startsWith("EQUAL_CAPITAL"));
const risk=c4.comparators.find(x=>x.name.startsWith("EQUAL_PLANNED"));
ok(formal.reserveVsNominalTargetNTD>0);
ok(equal.plannedAllocationNTD>=formal.plannedAllocationNTD);
ok(risk.riskHHI<=formal.riskHHI);
eq(c4.preferredAllocator,null);eq(c4.economicSuperiority,"UNKNOWN");eq(c4.noTrade,true);
assert.throws(()=>buildC4AllocationExperiment([{symbol:"X",priorityScore:1,entry:100,stop:101}]),/C4_VERIFIED_IDENTICAL_CANDIDATES_REQUIRED/);n++;

const pass={status:"PASS"},fail={status:"FAIL"},unk={status:"UNKNOWN"},notEval={status:"NOT_EVALUABLE"};
const baseGates={
 SOURCE_AUTHENTICITY:pass,SESSION_CONTINUITY:pass,CORPORATE_ACTION_CONTINUITY:pass,EXECUTION_FEASIBILITY:pass,ACCOUNT_RISK:pass,
 PRICE_FLOOR:pass,HISTORY_60D:pass,DAILY_ABNORMALITY:pass,LIQUIDITY:pass,ANNOUNCEMENT_RISK:pass,
 RS_CONTEXT:pass,ATR_QUALITY:pass,SECTOR_GATE:pass,AB_SETUP:pass,VALUATION_RELATIVE_RISK:pass,
 FINANCIAL_SOURCE_COMPLETENESS:pass,FUNDAMENTAL_COMPONENT_COUNT:pass,FUNDAMENTAL_QUALITY:pass,
 CHIP_CONCENTRATION_PRESENT:pass,TARGET_AVAILABLE:pass,REWARD_RISK:pass,FINAL_SIGNAL_GRADE:pass
};
const obs=(symbol,reason,gates,okFlag=false)=>({symbol,pool:"GENERAL",formalResult:{ok:okFlag},firstFailureReason:reason,gates:{...baseGates,...gates}});
const c1={schemaVersion:"SYSTEM1_C1_ISOLATED_V0_1",sessionDate,populationN:4,observations:[
  obs("AAA","VALUATION_RELATIVE_RISK",{VALUATION_RELATIVE_RISK:fail}),
  obs("BBB","LIQUIDITY",{LIQUIDITY:fail}),
  obs("CCC","AB_SETUP",{AB_SETUP:fail}),
  obs("DDD",null,{},true)
]};
const c5=buildC5OverfilterDiagnostic(c1,c2,{strategy:"SHORT"});
eq(c5.schemaVersion,"SYSTEM1_C5_OVERFILTER_DIAGNOSTIC_V0_2");
eq(c5.formalRejectedN,3);
eq(c5.optionalOnlyFailN,2);
eq(c5.hardOrPrimaryFailN,1);
eq(c5.hardUnknownN,0);
eq(c5.setupNotReadyN,1);
eq(c5.safetyUnknownUpperBoundN,1);
eq(c5.confidenceOnlyRejectedN,1);
eq(c5.contextOnlyRejectedN,1);
eq(c5.gateFails.LIQUIDITY,1);
eq(c5.gateFails.VALUATION_RELATIVE_RISK,1);
eq(gateRole("VALUATION_RELATIVE_RISK","SHORT"),ROLES.CONTEXT_ONLY);
eq(gateRole("VALUATION_RELATIVE_RISK","SWING"),ROLES.PRIMARY_ALPHA);
eq(resolveGateRole("MARKET_CAP_FLOOR",unk,"SWING"),ROLES.UNCERTAINTY);
eq(resolveGateRole("MARKET_CAP_FLOOR",fail,"SWING"),ROLES.PRIMARY_ALPHA);
eq(resolveGateRole("ANNOUNCEMENT_RISK",unk,"SHORT"),ROLES.UNCERTAINTY);
eq(resolveGateRole("ANNOUNCEMENT_RISK",fail,"SHORT"),ROLES.HARD_INVALIDATION);
eq(c5.firstFailureIsNotCausalAttribution,true);
eq(c5.optionalOnlyIsDiagnosticNotAdmission,true);
eq(c5.p1aRankableIsDiagnosticNotCandidate,true);
eq(c5.unknownNeverPass,true);
eq(c5.economicSuperiority,"UNKNOWN");eq(c5.noTrade,true);eq(c5.noPush,true);
assert.throws(()=>buildC5OverfilterDiagnostic({...c1,populationN:3},c2),/C5_MATCHED_C1_C2_REQUIRED/);n++;

const p1Pairs=[mkPair("P1"),mkPair("P2"),mkPair("P3"),mkPair("P4",true)];
const c2p1={...c2,pairs:p1Pairs,tally:{populationN:4,formalRejectedButConditionalShortGatesPassN:0}};
const c1p1={schemaVersion:"SYSTEM1_C1_ISOLATED_V0_1",sessionDate,populationN:4,observations:[
  obs("P1","CHIP_CONCENTRATION_PRESENT",{CHIP_CONCENTRATION_PRESENT:unk}),
  obs("P2","FUNDAMENTAL_COMPONENT_COUNT",{FUNDAMENTAL_COMPONENT_COUNT:fail,FUNDAMENTAL_QUALITY:notEval}),
  obs("P3","RS_CONTEXT",{RS_CONTEXT:unk,AB_SETUP:fail}),
  obs("P4",null,{},true)
]};
const p1=buildC5OverfilterDiagnostic(c1p1,c2p1,{strategy:"SHORT"});
eq(p1.formalRejectedN,3);
eq(p1.p1aRejectedN,3);
eq(p1.p1aOnlyN,1);
eq(p1.p1aPlusPrimaryN,1);
eq(p1.unknownContaminatedN,1);
eq(p1.p1aReachABN,3);
eq(p1.p1aABPassN,2);
eq(p1.p1aReachRRN,2);
eq(p1.p1aRRPassN,2);
eq(p1.p1aGradePassN,2);
eq(p1.p1aRankableN,1);
eq(p1.p1aOverhardeningCounterfactualN,1);
eq(p1.rows.find(x=>x.symbol==="P1").minimalUnblockClass,"P1A_ONLY");
eq(p1.rows.find(x=>x.symbol==="P1").reachStage,"F9_RANKABLE");
eq(p1.rows.find(x=>x.symbol==="P2").minimalUnblockClass,"UNKNOWN_CONTAMINATED");
eq(p1.rows.find(x=>x.symbol==="P2").reachStage,"F8_GRADE_PASS");
eq(p1.rows.find(x=>x.symbol==="P3").minimalUnblockClass,"P1A_PLUS_PRIMARY");
eq(p1.rows.find(x=>x.symbol==="P3").reachStage,"F4_AB_EVALUABLE");

const conditionalPairs=[
  mkPair("CND1",false,{shortGateStatus:"UNKNOWN",missingSafety:["CORPORATE_ACTION_CONTINUITY","EXECUTION_FEASIBILITY","ACCOUNT_RISK"]}),
  mkPair("CND2",false,{shortGateStatus:"FAIL",missingSafety:[]}),
  mkPair("CND3",false,{shortGateStatus:"UNKNOWN",missingSafety:["ACCOUNT_RISK"]}),
  mkPair("CND4",true)
];
const c2Conditional={...c2,pairs:conditionalPairs,tally:{populationN:4,formalRejectedButConditionalShortGatesPassN:1}};
const c1Conditional={schemaVersion:"SYSTEM1_C1_ISOLATED_V0_1",sessionDate,populationN:4,observations:[
  obs("CND1","CHIP_CONCENTRATION_PRESENT",{CHIP_CONCENTRATION_PRESENT:unk,CORPORATE_ACTION_CONTINUITY:unk,EXECUTION_FEASIBILITY:unk,ACCOUNT_RISK:unk}),
  obs("CND2","CORPORATE_ACTION_CONTINUITY",{CHIP_CONCENTRATION_PRESENT:unk,CORPORATE_ACTION_CONTINUITY:fail}),
  obs("CND3","RS_CONTEXT",{RS_CONTEXT:unk,ACCOUNT_RISK:unk,AB_SETUP:fail}),
  obs("CND4",null,{},true)
]};
const conditional=buildC5OverfilterDiagnostic(c1Conditional,c2Conditional,{strategy:"SHORT"});
eq(conditional.p1aRejectedN,3);
eq(conditional.p1aRankableN,0,"strict deployable reach must remain blocked by unresolved safety");
eq(conditional.p1aConditionalSafetyUnknownN,2);
eq(conditional.p1aConditionalReachABN,2);
eq(conditional.p1aConditionalABPassN,1);
eq(conditional.p1aConditionalReachRRN,1);
eq(conditional.p1aConditionalRRPassN,1);
eq(conditional.p1aConditionalGradePassN,1);
eq(conditional.p1aConditionalRankableN,1);
eq(conditional.conditionalP1aIsUpperBoundNotCandidate,true);
const cnd1=conditional.rows.find(x=>x.symbol==="CND1");
eq(cnd1.reachStage,"F0_FORMAL_PARENT");
eq(cnd1.minimalUnblockClass,"HARD_BLOCKED");
eq(cnd1.conditionalReachStage,"F9_RANKABLE");
eq(cnd1.conditionalOnSafetyUnknown,true);
eq(cnd1.conditionalP1aRankable,true);
eq(cnd1.researchUpperBoundOnly,true);
const cnd2=conditional.rows.find(x=>x.symbol==="CND2");
eq(cnd2.conditionalReachStage,"F0_FORMAL_PARENT","verified hard FAIL must never be conditionally bypassed");
eq(cnd2.conditionalP1aRankable,false);
ok(cnd2.conditionalReachBlockedBy.includes("CORPORATE_ACTION_CONTINUITY"));
const cnd3=conditional.rows.find(x=>x.symbol==="CND3");
eq(cnd3.conditionalReachStage,"F4_AB_EVALUABLE");
eq(cnd3.conditionalP1aRankable,false);

console.log(JSON.stringify({ok:true,assertions:n,c3EntryShadow:true,c4AllocationShadow:true,c5Overfilter:true,
  prospectiveAlphaClaims:0,realOrders:0,formalCoreImpact:false,system2Touched:false}));
