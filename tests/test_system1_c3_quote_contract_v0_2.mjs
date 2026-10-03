import assert from "node:assert/strict";
import {buildC3ResearchCaptureContractV02,C3_CAPTURE_SLOTS_V0_2,C3_CALLS_PER_SYMBOL_PER_SLOT_V0_2} from "../research/system1_c3_capture_contract_v0_2.mjs";
import {buildC3RegistrationV02,formalSymbolsV02} from "../research/system1_c3_registration_v0_2.mjs";

let n=0;const eq=(a,b)=>{assert.deepEqual(a,b);n++};const ok=x=>{assert.ok(x);n++};
const hex=x=>String(x).repeat(64).slice(0,64);
const generationId="gen-v02",sessionDate="2026-10-05";
const mk=(symbol,status="PASS",without="PASS",missing=[],selected=false)=>({
  symbol,pool:Number(symbol)>=3000?"THOUSAND":"GENERAL",
  formal:{qualified:selected,selected},
  short:{gateStatus:status,withoutSafetyGateStatus:without,missingSafety:missing},
  swing:{gateStatus:"UNKNOWN"}
});
const pairs=[
  mk("1001","PASS","PASS",[],true),mk("1002"),mk("1003"),mk("3001"),
  mk("3002","UNKNOWN","PASS",["ACCOUNT_RISK"]),mk("3003","FAIL","FAIL",[])
];
const c2={schemaVersion:"SYSTEM1_C2_PAIRED_LEDGER_V0_1",generationId,sessionDate,fingerprint:hex("c"),
  completeMatchedCohort:true,researchOnly:true,formalCoreLocked:true,pairs,tally:{populationN:pairs.length}};
const c1={schemaVersion:"SYSTEM1_C1_EVIDENCE_ARTIFACT_V0_1",
  receipt:{generationId,sessionDate,contentDigest:hex("a"),universeDigest:hex("b")},
  summary:{coverageComplete:true},safety:{researchOnly:true}};

const c=buildC3ResearchCaptureContractV02(c2,{formalSymbols:["1001"],maxShadowSymbols:3,providerBudgetCallsPerSession:102,sampleSeed:"v02"});
eq(c.schemaVersion,"SYSTEM1_C3_RESEARCH_CAPTURE_CONTRACT_V0_2");
eq(C3_CAPTURE_SLOTS_V0_2.length,17);
eq(C3_CALLS_PER_SYMBOL_PER_SLOT_V0_2,2);
eq(c.eligibleN,5);
eq(c.eligibleFormalReuseN,1);
eq(c.eligibleShadowOnlyN,4);
eq(c.capturedShadowOnlyN,3);
eq(c.extraCandleCallsPerSession,51);
eq(c.extraQuoteCallsPerSession,51);
eq(c.extraProviderCallsPerSession,102);
eq(c.providerBudgetStatus,"PASS");
eq(c.cohort.filter(x=>x.captureSource==="EXTRA_RESEARCH_CANDLE_QUOTE_CAPTURE").length,3);
eq(c.excludedShadowSymbols.length,1);
eq(c.rawQuoteContextOnly,true);
eq(c.intradayDepthScoreInvented,false);
eq(c.noFormalTargetMutation,true);eq(c.noSignalPath,true);eq(c.noPushPath,true);eq(c.noOrderPath,true);eq(c.noCapitalPath,true);

const b=buildC3ResearchCaptureContractV02(c2,{formalSymbols:["1001"],maxShadowSymbols:3,providerBudgetCallsPerSession:101,sampleSeed:"v02"});
eq(b.providerBudgetStatus,"FAIL");
assert.throws(()=>buildC3ResearchCaptureContractV02(c2,{formalSymbols:[],maxShadowSymbols:4,providerBudgetCallsPerSession:102}),/1_TO_3/);n++;

eq(formalSymbolsV02({stocks:[{symbol:"1001"}]}),["1001"]);
const r=buildC3RegistrationV02(c1,c2,{stocks:[{symbol:"1001"}]},{maxShadowSymbols:3,providerBudgetCallsPerSession:102,sampleSeed:"v02"});
eq(r.schemaVersion,"SYSTEM1_C3_REGISTRATION_V0_2");
eq(r.status,"READY_TO_REGISTER");
eq(r.extraShadowN,3);
eq(r.requiredExtraCandleCalls,51);
eq(r.requiredExtraQuoteCalls,51);
eq(r.requiredExtraProviderCalls,102);
eq(r.payload.schemaVersion,"SYSTEM1_C3_RESEARCH_CAPTURE_CONTRACT_V0_2");
eq(r.payload.symbols.length,3);
eq(r.payload.symbols.some(x=>x.symbol==="1001"),false);
eq(r.payload.noFormalTargetMutation,true);
assert.throws(()=>buildC3RegistrationV02(c1,c2,{stocks:[{symbol:"1001"}]},{maxShadowSymbols:3,providerBudgetCallsPerSession:101}),/PROVIDER_BUDGET_NOT_PASS/);n++;

const fs=await import("node:fs/promises");
const collector=await fs.readFile(new URL("./collect_system1_c1_c2_evidence.mjs",import.meta.url),"utf8");
assert.match(collector,/buildC3RegistrationV02/);n++;
assert.match(collector,/system1_c3_registration_v0_2/);n++;
assert.match(collector,/maxShadowSymbols:3,providerBudgetCallsPerSession:102/);n++;
assert.match(collector,/requiredExtraQuoteCalls/);n++;
assert.match(collector,/requiredExtraProviderCalls/);n++;

console.log(JSON.stringify({ok:true,assertions:n,c3ContractV02:true,maxShadowSymbols:3,
  candleCalls:51,quoteCalls:51,totalExtraCalls:102,rawQuoteOnly:true,intradayDepthScoreInvented:false,
  formalCoreImpact:false,system2Touched:false}));
