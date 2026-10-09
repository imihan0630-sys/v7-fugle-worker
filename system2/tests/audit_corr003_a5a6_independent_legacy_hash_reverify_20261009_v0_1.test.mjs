import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { runInNewContext } from "node:vm";
import {
  D1_FREE_LIMITS,
  evaluateD1AccountQuotaReservationV0_1,
  summarizeD1QuotaLedgerRowsV0_1,
} from "../runtime/d1_account_quota_budget_v0_1.mjs";

// Independent, offline AUDIT_LANE post-PR994 replay.
// Reports any additional unsafe production compatibility bypass as evidence;
// a green CI MUST NOT be interpreted as a physical quota acceptance.
const source=await readFile(new URL("../scripts/run_d1_account_quota_gate_v0_1.mjs",import.meta.url),"utf8");
const registry=JSON.parse(await readFile(new URL("../config/d1_account_writer_registry_v0_1.json",import.meta.url),"utf8"));
const s1=JSON.parse(await readFile(new URL("../evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json",import.meta.url),"utf8"));
const writer=registry.writers.find(r=>r.id==="DAILY_SHADOW_DIAGNOSTIC");
assert.ok(writer);
assert.equal(registry.writers.filter(r=>r.physicalMutation).length,13);
assert.equal(s1.reserveNumberAuthorized,false);
assert.equal(s1.authorizedReserveRows,null);
assert.equal(s1.readReserveNumberAuthorized,false);
assert.equal(s1.authorizedReadReserveRows,null);
assert.equal(s1.observedWholeV7DailyRowsWritten.max,2825);

const syntheticSystem1={reserveNumberAuthorized:true,authorizedReserveRows:5000,
  readReserveNumberAuthorized:true,authorizedReadReserveRows:5000,evidenceState:"SYNTHETIC_AUDIT_ONLY"};
const evalSynthetic=(accountUsage,ledger)=>evaluateD1AccountQuotaReservationV0_1({
  writer,eventName:"schedule",accountUsage,system1ReservePolicy:syntheticSystem1,
  ledgerIntegrityState:ledger?.integrityState ?? "VALID",
  outstandingReservedRowsWritten:ledger?.outstandingReservedRowsWritten ?? 0,
  outstandingReservedRowsRead:ledger?.outstandingReservedRowsRead ?? 0,
});
const usage=(w=1000,r=1000)=>({known:true,quotaDay:"2026-10-09",rowsWritten:w,rowsRead:r,source:"SYNTHETIC"});
const sha256=value=>createHash("sha256").update(JSON.stringify(value)).digest("hex");
const quotaDayBounds=day=>({start:day+"T00:00:00.000Z",end:day+"T23:59:59.999Z"});
const start=source.indexOf("async function queryAccountUsage(");
const stop=source.indexOf("async function loadQuotaLedger(",start);
assert.ok(start>=0&&stop>start,"GraphQL parser source boundary");
const query=runInNewContext(source.slice(start,stop)+"\nqueryAccountUsage",{AbortSignal});

const goodGroup={dimensions:{date:"2026-10-09",databaseId:"DB1"},sum:{rowsRead:1500,rowsWritten:1000}};
const respond=(groups,accounts=null)=>async()=>({ok:true,status:200,json:async()=>({data:{viewer:{accounts:accounts??[{d1AnalyticsAdaptiveGroups:groups}]}}})});
const request=async(fetchImpl)=>query({accountId:"SYNTHETIC",token:"NOT_REAL",quotaDay:"2026-10-09",fetchImpl});
assert.equal((await request(respond([goodGroup]))).known,true);
const graphqlMutants=[
 ["missing-rows-read",{...goodGroup,sum:{rowsWritten:1000}}],
 ["missing-rows-written",{...goodGroup,sum:{rowsRead:1500}}],
 ["null-read",{...goodGroup,sum:{rowsWritten:1000,rowsRead:null}}],
 ["string-read",{...goodGroup,sum:{rowsWritten:1000,rowsRead:"1500"}}],
 ["negative-read",{...goodGroup,sum:{rowsWritten:1000,rowsRead:-1}}],
 ["float-read",{...goodGroup,sum:{rowsWritten:1000,rowsRead:1.2}}],
 ["nan-read",{...goodGroup,sum:{rowsWritten:1000,rowsRead:NaN}}],
 ["infinite-read",{...goodGroup,sum:{rowsWritten:1000,rowsRead:Infinity}}],
 ["missing-date",{...goodGroup,dimensions:{databaseId:"DB1"}}],
 ["wrong-date",{...goodGroup,dimensions:{date:"2026-10-08",databaseId:"DB1"}}],
 ["empty-db",{...goodGroup,dimensions:{date:"2026-10-09",databaseId:" "}}],
];
for(const [name,group] of graphqlMutants){
  const parsed=await request(respond([group]));
  assert.equal(parsed.known,false,name);
  assert.equal(parsed.rowsRead,null,name);
  assert.equal(parsed.rowsWritten,null,name);
  const decision=evalSynthetic(parsed);
  assert.equal(decision.state,"QUOTA_BUDGET_DEFER",name);
}
for(const [name,fetch] of [
 ["duplicate-identity",respond([goodGroup,{...goodGroup}])],
 ["empty-groups",respond([])],
 ["two-accounts",respond([goodGroup],[{d1AnalyticsAdaptiveGroups:[goodGroup]},{d1AnalyticsAdaptiveGroups:[goodGroup]}])],
 ["missing-accounts",async()=>({ok:true,status:200,json:async()=>({data:{viewer:{}}})})],
 ["graph-graphql-errors",async()=>({ok:true,status:200,json:async()=>({errors:[{message:"synthetic"}]})})],
]){
 const parsed=await request(fetch);assert.equal(parsed.known,false,name);
 assert.equal(evalSynthetic(parsed).state,"QUOTA_BUDGET_DEFER",name);
}

// Fail-closed on malformed current-day ledger, with no real database.
const invalidRows=[
 {check_type:"SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",observed_payload_json:"{broken"},
 {check_type:"SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",observed_payload_json:JSON.stringify({runKey:"run",quotaDay:"2026-10-09",requestedRowsWritten:7358})},
 {check_type:"SYSTEM2_D1_ACCOUNT_BUDGET_RESULT_V0_1",observed_payload_json:JSON.stringify({runKey:"orphan",quotaDay:"2026-10-09",resultState:"RESULT_FAILURE",accountRowsReadAfter:10})},
];
for(const [i,row] of invalidRows.entries()){
 const l=summarizeD1QuotaLedgerRowsV0_1([row],{quotaDay:"2026-10-09"});
 assert.equal(l.integrityState,"INVALID","ledger-mutant-"+i);
 assert.equal(l.outstandingReservedRowsRead,D1_FREE_LIMITS.rowsReadPerUtcDay);
 assert.equal(l.outstandingReservedRowsWritten,D1_FREE_LIMITS.rowsWrittenPerUtcDay);
 assert.equal(evalSynthetic(usage(),l).state,"QUOTA_BUDGET_DEFER");
}
assert.equal(evalSynthetic(usage(),{integrityState:"INVALID",outstandingReservedRowsWritten:0,outstandingReservedRowsRead:0}).state,"QUOTA_BUDGET_DEFER");

const loadStart=source.indexOf("async function loadQuotaLedger(");
const loadStop=source.indexOf("function ledgerExpectedPayloadJson()",loadStart);
assert.ok(loadStart>=0&&loadStop>loadStart);
const loader=runInNewContext(source.slice(loadStart,loadStop)+"\nloadQuotaLedger",{
 quotaDayBounds,summarizeD1QuotaLedgerRowsV0_1,sha256,D1_FREE_LIMITS,Object,JSON,Date,
});
const readLedger=rows=>loader({rawQuery:async()=>rows},"2026-10-09");
const receiptPayload={
  schemaVersion:"S2_D1_ACCOUNT_BUDGET_RESERVATION_V0_2",
  budgetVersion:"S2_D1_ACCOUNT_QUOTA_BUDGET_V0_2",
  directiveId:"S2-CORR-20261007-003",
  runKey:"test-run",quotaDay:"2026-10-09",requestedRowsWritten:7358,requestedRowsRead:40000,
};
const payloadJson=JSON.stringify(receiptPayload);
const expectedJson=JSON.stringify({directiveId:"S2-CORR-20261007-003",accountWide:true,paidUpgradeAuthorized:false});
const id="S2-D1-BUDGET:2026-10-09:test-run:RESERVATION";
function makeReceipt({legacy=false,status="QUOTA_RESERVATION_GRANTED",expectedPayloadJson=expectedJson}={}){
 const check_type="SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1";
 const check_hash=legacy?sha256(receiptPayload):sha256({
   checkId:id,checkType:check_type,expectedPayloadJson,observedPayloadJson:payloadJson,status,
 });
 return {check_id:id,check_type,expected_payload_json:expectedPayloadJson,observed_payload_json:payloadJson,
   status,check_hash,check_timestamp:"2026-10-09T02:00:00.000Z"};
}
// Positive: current full immutable identity succeeds; tampering status without rehash fails.
const valid=await readLedger([makeReceipt()]);
assert.equal(valid.integrityState,"VALID");
const currentTamper=await readLedger([{...makeReceipt(),status:"TAMPERED"}]);
assert.equal(currentTamper.integrityState,"INVALID");

// EXTRA independent attack: legacy payload-only hash on NEW V0.2 schema ignores
// check status/expected payload fields. Does the production loader still trust it?
const legacyV02=await readLedger([makeReceipt({legacy:true})]);
const legacyStatusTamper=await readLedger([makeReceipt({legacy:true,status:"TAMPERED"})]);
const legacyExpectedTamper=await readLedger([makeReceipt({legacy:true,
 expectedPayloadJson:JSON.stringify({directiveId:"S2-CORR-20261007-003",accountWide:false,paidUpgradeAuthorized:true})})]);
const legacyBypass=legacyStatusTamper.integrityState==="VALID"||legacyExpectedTamper.integrityState==="VALID";
const legacyDecision=evalSynthetic(usage(),legacyStatusTamper);
console.log("S2_CORR003_ADDITIONAL_PROBE "+JSON.stringify({
 id:"A7_LEGACY_PAYLOAD_HASH_ACCEPTS_MUTATED_V02_RECEIPT_METADATA",
 status:legacyBypass?"UNSAFE":"SAFE",
 v02LegacyReceiptAccepted:legacyV02.integrityState,
 tamperedStatusAccepted:legacyStatusTamper.integrityState,
 tamperedExpectedPayloadAccepted:legacyExpectedTamper.integrityState,
 syntheticOtherwiseAuthorizedDecision:legacyDecision.state,
 actualCloudflareIO:false,
}));
console.log("S2_CORR003_A5A6_INDEPENDENT_REVERIFY "+JSON.stringify({
 a5MissingPartialInputs:"PASS_FAIL_CLOSED",
 a6MalformedLedgerInputs:"PASS_FAIL_CLOSED",
 productionFullIdentityTamper:"PASS_FAIL_CLOSED",
 a7LegacyHashMetadataSpoof:legacyBypass?"UNSAFE":"SAFE",
 physicalClosureCertified:false,
 system1WriteReadReserveAuthorized:false,
}));
