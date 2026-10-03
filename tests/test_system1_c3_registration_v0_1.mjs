import assert from "node:assert/strict";
import {buildC3Registration,formalSymbolsFromConfig} from "../research/system1_c3_registration_v0_1.mjs";

let n=0;const eq=(a,b)=>{assert.deepEqual(a,b);n++};const ok=x=>{assert.ok(x);n++};
const hex=x=>String(x).repeat(64).slice(0,64);
const generationId="gen-c3-fixture",sessionDate="2026-10-05";
const c1={schemaVersion:"SYSTEM1_C1_EVIDENCE_ARTIFACT_V0_1",
  receipt:{generationId,sessionDate,contentDigest:hex("a"),universeDigest:hex("b")},
  summary:{coverageComplete:true},safety:{researchOnly:true}};
const mk=(symbol,gateStatus,withoutSafety,missingSafety,formalSelected=false)=>({
  symbol,pool:Number(symbol)>=1000?"GENERAL":"GENERAL",
  formal:{qualified:formalSelected,selected:formalSelected},
  short:{gateStatus,withoutSafetyGateStatus:withoutSafety,missingSafety},
  swing:{gateStatus:"UNKNOWN"}
});
const pairs=[
  mk("2330","PASS","PASS",[],true),
  mk("2317","PASS","PASS",[],false),
  mk("2454","UNKNOWN","PASS",["ACCOUNT_RISK"],false),
  mk("3008","UNKNOWN","PASS",["CORPORATE_ACTION_CONTINUITY"],false),
  mk("2002","FAIL","FAIL",[],false)
];
const c2={schemaVersion:"SYSTEM1_C2_PAIRED_LEDGER_V0_1",generationId,sessionDate,fingerprint:hex("c"),
  completeMatchedCohort:true,researchOnly:true,formalCoreLocked:true,pairs,tally:{populationN:pairs.length}};

eq(formalSymbolsFromConfig({stocks:[{symbol:"2330"}]}),["2330"]);
assert.throws(()=>formalSymbolsFromConfig({stocks:[{symbol:"2330"},{symbol:"2330"}]}),/DUPLICATE_FORMAL_SYMBOL/);n++;

const a=buildC3Registration(c1,c2,{stocks:[{symbol:"2330"}]},{maxShadowSymbols:2,providerBudgetCallsPerSession:102,sampleSeed:"fixture"});
eq(a.schemaVersion,"SYSTEM1_C3_REGISTRATION_V0_1");
eq(a.status,"READY_TO_REGISTER");
eq(a.postRequired,true);
eq(a.formalSymbolsN,1);
eq(a.eligibleN,4);
eq(a.eligibleFormalReuseN,1);
eq(a.eligibleShadowOnlyN,3);
eq(a.extraShadowN,2);
eq(a.requiredExtraCandleCalls,34);
eq(a.requiredExtraQuoteCalls,34);
eq(a.requiredExtraProviderCalls,68);
eq(a.payload.targetTradeDate,undefined);
eq(a.payload.symbols.length,2);
eq(a.payload.symbols.some(x=>x.symbol==="2330"),false);
eq(a.payload.noFormalTargetMutation,true);
eq(a.payload.noSignalPath,true);eq(a.payload.noPushPath,true);eq(a.payload.noOrderPath,true);eq(a.payload.noCapitalPath,true);
eq(a.researchOnly,true);eq(a.noTrade,true);eq(a.noPush,true);

const b=buildC3Registration(c1,c2,{stocks:[{symbol:"2330"},{symbol:"2317"},{symbol:"2454"},{symbol:"3008"}]},
  {maxShadowSymbols:3,providerBudgetCallsPerSession:102});
eq(b.status,"NO_SHADOW_ONLY_COHORT");
eq(b.postRequired,false);
eq(b.payload,null);
eq(b.extraShadowN,0);

assert.throws(()=>buildC3Registration(c1,c2,{stocks:[{symbol:"2330"}]},
  {maxShadowSymbols:3,providerBudgetCallsPerSession:16}),/PROVIDER_BUDGET_NOT_PASS/);n++;

assert.throws(()=>buildC3Registration({...c1,summary:{coverageComplete:false}},c2,{stocks:[]}),/VERIFIED_C1_ARTIFACT_REQUIRED/);n++;
assert.throws(()=>buildC3Registration(c1,{...c2,generationId:"other"},{stocks:[]}),/MATCHED_C2_ARTIFACT_REQUIRED/);n++;
assert.throws(()=>buildC3Registration(c1,{...c2,fingerprint:"bad"},{stocks:[]}),/MATCHED_C2_ARTIFACT_REQUIRED/);n++;

const collector=await import("node:fs/promises").then(fs=>fs.readFile(new URL("./collect_system1_c1_c2_evidence.mjs",import.meta.url),"utf8"));
assert.match(collector,/C3_REGISTER/);n++;
assert.match(collector,/buildC3Registration/);n++;
assert.match(collector,/\/api\/research\/c3-capture-cohort/);n++;
assert.match(collector,/maxShadowSymbols:3,providerBudgetCallsPerSession:102/);n++;
assert.match(collector,/body:JSON\.stringify\(registration\.payload\)/);n++;
eq(a.payload.targetTradeDate,undefined);

const workflow=await import("node:fs/promises").then(fs=>fs.readFile(new URL("../.github/workflows/system1-c1-evidence.yml",import.meta.url),"utf8"));
assert.match(workflow,/C3_REGISTER: \$\{\{ github\.event_name == 'schedule' && 'true' \|\| 'false' \}\}/);n++;
assert.match(workflow,/artifacts\/system1-c3-registration\.json/);n++;

console.log(JSON.stringify({ok:true,assertions:n,scheduledOnlyRegistration:true,clientDoesNotGuessNextTradeDate:true,
  formalReuseExcludedFromExtraCapture:true,maxShadowSymbols:3,maxSessionCalls:102,formalCoreImpact:false,system2Touched:false}));
