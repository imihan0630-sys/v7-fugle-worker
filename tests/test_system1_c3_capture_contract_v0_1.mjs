import assert from "node:assert/strict";
import {buildC3ResearchCaptureContract,C3_CAPTURE_SLOTS} from "../research/system1_c3_capture_contract_v0_1.mjs";

let n=0;const eq=(a,b)=>{assert.deepEqual(a,b);n++};const ok=x=>{assert.ok(x);n++};
const mk=(symbol,pool,gateStatus,withoutSafety,missingSafety,formalSelected=false)=>({
  symbol,pool,formal:{qualified:formalSelected,selected:formalSelected},
  short:{gateStatus,withoutSafetyGateStatus:withoutSafety,missingSafety,failedGates:[],unknownGates:missingSafety},
  swing:{gateStatus:"UNKNOWN"}
});
const pairs=[
  mk("1001","GENERAL","PASS","PASS",[],true),
  mk("1002","GENERAL","PASS","PASS",[],false),
  mk("1003","GENERAL","UNKNOWN","PASS",["ACCOUNT_RISK"],false),
  mk("1004","THOUSAND","UNKNOWN","PASS",["CORPORATE_ACTION_CONTINUITY","ACCOUNT_RISK"],false),
  mk("1005","GENERAL","FAIL","FAIL",[],false),
  mk("1006","GENERAL","UNKNOWN","UNKNOWN",["ACCOUNT_RISK"],false)
];
const c2={schemaVersion:"SYSTEM1_C2_PAIRED_LEDGER_V0_1",completeMatchedCohort:true,researchOnly:true,formalCoreLocked:true,
  generationId:"gen-20261003",sessionDate:"2026-10-03",fingerprint:"f".repeat(64),pairs,tally:{populationN:pairs.length}};

const a=buildC3ResearchCaptureContract(c2,{formalSymbols:["1001"],maxShadowSymbols:2,providerBudgetCallsPerSession:34,sampleSeed:"fixture"});
eq(a.schemaVersion,"SYSTEM1_C3_RESEARCH_CAPTURE_CONTRACT_V0_1");
eq(a.eligibleN,4);
eq(a.eligibleFormalReuseN,1);
eq(a.eligibleShadowOnlyN,3);
eq(a.capturedShadowOnlyN,2);
eq(a.extraCandleCallsPerSession,34);
eq(a.providerBudgetStatus,"PASS");
eq(a.cohort.filter(x=>x.captureSource==="REUSE_FORMAL_PV_CAPTURE").map(x=>x.symbol),["1001"]);
eq(a.cohort.filter(x=>x.captureSource==="EXTRA_RESEARCH_CANDLE_CAPTURE").length,2);
eq(a.excludedShadowSymbols.length,1);
eq(a.noFormalTargetMutation,true);
eq(a.noSignalPath,true);eq(a.noPushPath,true);eq(a.noOrderPath,true);eq(a.noCapitalPath,true);
eq(a.c5MustUseFullC1C2Denominator,true);
eq(a.missingSafetyNeverUpgradedToPass,true);
eq(a.economicSuperiority,"UNKNOWN");
eq(C3_CAPTURE_SLOTS.length,17);
ok(a.cohort.filter(x=>x.classification==="CONDITIONAL_SAFETY_UNKNOWN").every(x=>x.tradingAuthority===false));

const b=buildC3ResearchCaptureContract(c2,{formalSymbols:["1001"],maxShadowSymbols:3,providerBudgetCallsPerSession:16,includeConditionalSafetyUnknown:false});
eq(b.eligibleN,2);
eq(b.eligibleShadowOnlyN,1);
eq(b.capturedShadowOnlyN,1);
eq(b.extraCandleCallsPerSession,17);
eq(b.providerBudgetStatus,"FAIL");
eq(b.cohort.some(x=>x.classification==="CONDITIONAL_SAFETY_UNKNOWN"),false);

const c=buildC3ResearchCaptureContract(c2,{formalSymbols:["1001"],maxShadowSymbols:2});
eq(c.providerBudgetStatus,"UNKNOWN");
eq(c.providerBudgetCallsPerSession,null);

const d1=buildC3ResearchCaptureContract(c2,{formalSymbols:["1001"],maxShadowSymbols:2,sampleSeed:"stable"});
const d2=buildC3ResearchCaptureContract(c2,{formalSymbols:["1001"],maxShadowSymbols:2,sampleSeed:"stable"});
eq(d1.cohort,d2.cohort);
eq(d1.excludedShadowSymbols,d2.excludedShadowSymbols);

assert.throws(()=>buildC3ResearchCaptureContract(c2,{formalSymbols:["1001"],maxShadowSymbols:0}),/EXPLICIT_MAX_SHADOW_SYMBOLS/);n++;
assert.throws(()=>buildC3ResearchCaptureContract({...c2,completeMatchedCohort:false},{formalSymbols:["1001"],maxShadowSymbols:1}),/VERIFIED_C2_REQUIRED/);n++;
assert.throws(()=>buildC3ResearchCaptureContract(c2,{formalSymbols:["1001","1001"],maxShadowSymbols:1}),/DUPLICATE_FORMAL_SYMBOL/);n++;

console.log(JSON.stringify({ok:true,assertions:n,boundedShadowCapture:true,formalReuseDeduplicated:true,
  explicitCallBudget:true,formalTargetMutation:false,signals:false,orders:false,system2Touched:false}));
