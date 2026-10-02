import assert from "node:assert/strict";
import {buildC3EntryExperiment,buildC4AllocationExperiment,buildC5OverfilterDiagnostic,gateRole,ROLES,C3_CONTRACT} from "../research/system1_c3_c4_c5_shadow_v0_1.mjs";

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
eq(c3.tally.receiptN,3);\neq(c3.tally.eligiblePairN,3);\neq(c3.tally.missingEntryReceiptN,1);\neq(c3.tally.formalBaselineUnknownN,1);
eq(c3.tally.formalTriggeredN,1);
eq(c3.tally.formalNoTriggerChallengerSimFillN,1);
eq(c3.rows.find(x=>x.symbol==="BBB").challenger.outcome,"STOP_FIRST_AMBIGUOUS");
eq(c3.rows.find(x=>x.symbol==="CCC").challenger.outcome,"TARGET");
eq(c3.rows.find(x=>x.symbol==="AAA").challenger.status,"NOT_ELIGIBLE");\neq(c3.rows.find(x=>x.symbol==="AAA").formalBaseline.status,"UNKNOWN");\neq(c3.rows.find(x=>x.symbol==="AAA").formalBaseline.verified,false);
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

const pass={status:"PASS"},fail={status:"FAIL"},unk={status:"UNKNOWN"};
const baseGates={
 SOURCE_AUTHENTICITY:pass,SESSION_CONTINUITY:pass,CORPORATE_ACTION_CONTINUITY:pass,EXECUTION_FEASIBILITY:pass,ACCOUNT_RISK:pass,
 PRICE_FLOOR:pass,HISTORY_60D:pass,DAILY_ABNORMALITY:pass,LIQUIDITY:pass,ANNOUNCEMENT_RISK:pass,
 RS_CONTEXT:pass,ATR_QUALITY:pass,SECTOR_GATE:pass,AB_SETUP:pass,VALUATION_RELATIVE_RISK:pass,
 FINANCIAL_SOURCE_COMPLETENESS:pass,FUNDAMENTAL_QUALITY:pass,CHIP_CONCENTRATION_PRESENT:pass
};
const obs=(symbol,reason,gates,okFlag=false)=>({symbol,pool:"GENERAL",formalResult:{ok:okFlag},firstFailureReason:reason,gates:{...baseGates,...gates}});
const c1={schemaVersion:"SYSTEM1_C1_ISOLATED_V0_1",sessionDate,populationN:4,observations:[
  obs("AAA","VALUATION_RELATIVE_RISK",{VALUATION_RELATIVE_RISK:fail}),
  obs("BBB","LIQUIDITY",{LIQUIDITY:fail}),
  obs("CCC","AB_SETUP",{AB_SETUP:fail}),
  obs("DDD",null,{},true)
]};
const c5=buildC5OverfilterDiagnostic(c1,c2,{strategy:"SHORT"});
eq(c5.formalRejectedN,3);
eq(c5.optionalOnlyFailN,1);
eq(c5.hardOrPrimaryFailN,2);
eq(c5.setupNotReadyN,1);
eq(c5.safetyUnknownUpperBoundN,1);
eq(c5.gateFails.LIQUIDITY,1);
eq(c5.gateFails.VALUATION_RELATIVE_RISK,1);
eq(gateRole("VALUATION_RELATIVE_RISK","SHORT"),ROLES.CONTEXT_ONLY);
eq(gateRole("VALUATION_RELATIVE_RISK","SWING"),ROLES.PRIMARY_ALPHA);
eq(c5.firstFailureIsNotCausalAttribution,true);
eq(c5.optionalOnlyIsDiagnosticNotAdmission,true);
eq(c5.economicSuperiority,"UNKNOWN");eq(c5.noTrade,true);eq(c5.noPush,true);
assert.throws(()=>buildC5OverfilterDiagnostic({...c1,populationN:3},c2),/C5_MATCHED_C1_C2_REQUIRED/);n++;

console.log(JSON.stringify({ok:true,assertions:n,c3EntryShadow:true,c4AllocationShadow:true,c5Overfilter:true,
  prospectiveAlphaClaims:0,realOrders:0,formalCoreImpact:false,system2Touched:false}));
