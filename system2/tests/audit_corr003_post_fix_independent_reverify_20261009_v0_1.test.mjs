import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import {
  D1_FREE_LIMITS, evaluateD1AccountQuotaReservationV0_1,
  evaluateD1QuotaResultVarianceV0_1, summarizeD1QuotaLedgerRowsV0_1,
  verifyD1QuotaLedgerReceiptIdentityV0_1, utcQuotaDay,
} from "../runtime/d1_account_quota_budget_v0_1.mjs";

// AUDIT_LANE / detached negative witness. Green CI means probes ran, not HIGH closure.
// No real D1, GraphQL, System1, brokerage, R2 or other external IO.
const registry=JSON.parse(await readFile(new URL("../config/d1_account_writer_registry_v0_1.json",import.meta.url),"utf8"));
const writer=id=>{const x=registry.writers.find(w=>w.id===id);assert.ok(x,id);return x;};
const system1Synthetic={reserveNumberAuthorized:true,authorizedReserveRows:5000,readReserveNumberAuthorized:true,authorizedReadReserveRows:5000,evidenceState:"SYNTHETIC_NOT_AUTHORIZED"};
const usage=(w,r)=>({known:true,rowsWritten:w,rowsRead:r,quotaDay:"2026-10-09",source:"SYNTHETIC"});
const annual={...writer("HISTORICAL_ANNUAL_BACKFILL"),readReservationModel:{type:"FIXED_MEASURED",rowsRead:40000,evidence:"SYNTHETIC_AUDIT_ISOLATION"}};
const choose=(w,read=1000)=>evaluateD1AccountQuotaReservationV0_1({writer:annual,eventName:"workflow_dispatch",accountUsage:usage(20000,read),system1ReservePolicy:system1Synthetic,requestedRowsWritten:w,requestedRowsRead:40000});
assert.equal(D1_FREE_LIMITS.rowsWrittenPerUtcDay,100000);
assert.equal(D1_FREE_LIMITS.rowsReadPerUtcDay,5000000);
assert.equal(D1_FREE_LIMITS.resetAtUtc,"00:00");
for(const n of [0,1,7357]){const r=choose(n);assert.equal(r.state,"QUOTA_BUDGET_DEFER");assert.ok(r.reasonCodes.includes("WRITER_WRITE_RESERVATION_BELOW_VERIFIED_MINIMUM"));}
for(const n of [7358,7359,10000]){const r=choose(n);assert.equal(r.state,"QUOTA_RESERVATION_GRANTED");assert.equal(r.requestedRowsWritten,n);}
const nearRead=evaluateD1AccountQuotaReservationV0_1({writer:writer("HISTORICAL_ANNUAL_BACKFILL"),eventName:"workflow_dispatch",accountUsage:usage(20000,4999999),system1ReservePolicy:system1Synthetic,requestedRowsWritten:7358,requestedRowsRead:0});
assert.equal(nearRead.state,"QUOTA_BUDGET_DEFER");assert.equal(nearRead.physicalAllowed,false);
assert.ok(nearRead.reasonCodes.includes("WRITER_READ_RESERVATION_EVIDENCE_REQUIRED"));
const shadow=writer("DAILY_SHADOW_DIAGNOSTIC");
assert.equal(shadow.readReservationModel.rowsRead,583256);
for(const [read,state] of [[5000000-583256-5000,"QUOTA_RESERVATION_GRANTED"],[5000000-583256-5000+1,"QUOTA_BUDGET_DEFER"]]){
 const result=evaluateD1AccountQuotaReservationV0_1({writer:shadow,eventName:"schedule",accountUsage:usage(1000,read),system1ReservePolicy:system1Synthetic});
 assert.equal(result.state,state);if(state==="QUOTA_RESERVATION_GRANTED")assert.equal(result.projectedRowsRead,5000000);
}
assert.equal(writer("RECENT_A1_WARMUP").readReservationModel.rowsRead,1047112);
assert.match(writer("RECENT_A1_WARMUP").readReservationModel.evidence,/37550201160/);
assert.match(writer("RECENT_A1_WARMUP").readReservationModel.evidence,/112563652301/);
const warm=evaluateD1AccountQuotaReservationV0_1({writer:writer("RECENT_A1_WARMUP"),eventName:"schedule",accountUsage:usage(50000,500000),system1ReservePolicy:system1Synthetic});
assert.equal(warm.adaptiveMaxDates,2);assert.equal(warm.requestedRowsRead,1047112);
assert.equal(warm.requestedRowsWritten,23152);

const physical=registry.writers.filter(w=>w.physicalMutation);assert.equal(physical.length,13);
const paths=(await readdir(new URL("../../.github/workflows/",import.meta.url))).filter(s=>s.endsWith(".yml"));
const grouped=[];for(const file of paths){const contents=await readFile(new URL("../../.github/workflows/"+file,import.meta.url),"utf8");if(/group:\s*system2-isolated-d1-writer/.test(contents))grouped.push(".github/workflows/"+file);}
assert.deepEqual(grouped.sort(),registry.writers.map(w=>w.workflow).sort());
for(const w of physical){const source=await readFile(new URL("../../"+w.workflow,import.meta.url),"utf8");
 assert.ok(source.includes("./.github/actions/system2-d1-budget-gate"),w.id);
 assert.match(source,/if:\s*always\(\) && steps\.quota\.outputs\.physical_allowed == [\x27]true[\x27]/,w.id);
 assert.ok(source.includes("execution_outcome: ${{ job.status }}"),w.id);
 assert.ok(source.includes("mode: result"),w.id);
}
const reserve=(k,day="2026-10-09")=>({check_type:"SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",observed_payload_json:JSON.stringify({runKey:k,quotaDay:day,requestedRowsWritten:7358,requestedRowsRead:40000})});
const result=(k)=>({check_type:"SYSTEM2_D1_ACCOUNT_BUDGET_RESULT_V0_1",observed_payload_json:JSON.stringify({runKey:k,quotaDay:"2026-10-09",resultState:"RESULT_FAILURE_OBSERVED_NON_RELEASING",accountRowsWrittenAfter:30000,accountRowsReadAfter:80000})});
const fail=summarizeD1QuotaLedgerRowsV0_1([reserve("a"),result("a")],{quotaDay:"2026-10-09"});
assert.equal(fail.outstandingReservedRowsWritten,7358);assert.equal(fail.outstandingReservedRowsRead,40000);
assert.equal(fail.sameDayReservationReleasePolicy,"NEVER_RELEASE_BEFORE_UTC_RESET");
const retry=summarizeD1QuotaLedgerRowsV0_1([reserve("a"),result("a"),reserve("b")],{quotaDay:"2026-10-09"});
assert.equal(retry.outstandingReservedRowsWritten,14716);assert.equal(retry.outstandingReservedRowsRead,80000);
const rollover=summarizeD1QuotaLedgerRowsV0_1([reserve("a","2026-10-08"),reserve("b")],{quotaDay:"2026-10-09"});
assert.equal(rollover.outstandingReservedRowsWritten,7358);
assert.equal(utcQuotaDay("2026-10-09T00:00:00.000Z"),"2026-10-09");
const over=evaluateD1QuotaResultVarianceV0_1({reservedRowsWritten:7358,reservedRowsRead:40000,observedDeltaRowsWritten:8000,observedDeltaRowsRead:45000});
assert.equal(over.state,"RESULT_RESERVATION_OVERRUN_NON_RELEASING");assert.equal(over.releaseReservationWithinUtcDay,false);
const unknown=evaluateD1QuotaResultVarianceV0_1({reservedRowsWritten:7358,reservedRowsRead:40000,observedDeltaRowsWritten:null,observedDeltaRowsRead:null});
assert.equal(unknown.state,"RESULT_USAGE_UNKNOWN_NON_RELEASING");
const good={checkId:"S2-D1-BUDGET:2026-10-09:run:RESERVATION",checkType:"SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",expectedPayloadJson:"{}",observedPayloadJson:"{\"runKey\":\"run\"}",status:"QUOTA_RESERVATION_GRANTED",checkHash:"hash1"};
const row={check_id:good.checkId,check_type:good.checkType,expected_payload_json:good.expectedPayloadJson,observed_payload_json:good.observedPayloadJson,status:good.status,check_hash:good.checkHash};
assert.equal(verifyD1QuotaLedgerReceiptIdentityV0_1(row,good).idempotent,true);
for(const [key,val] of [["check_hash","bad"],["observed_payload_json","{}"],["expected_payload_json","{\"tampered\":true}"],["status","BAD"],["check_type","BAD"],["check_id","BAD"]])assert.throws(()=>verifyD1QuotaLedgerReceiptIdentityV0_1({...row,[key]:val},good),/D1_QUOTA_LEDGER_IDEMPOTENCY_CONFLICT/);

const s1=JSON.parse(await readFile(new URL("../evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json",import.meta.url),"utf8"));
assert.equal(s1.reserveNumberAuthorized,false);assert.equal(s1.authorizedReserveRows,null);
assert.equal(s1.readReserveNumberAuthorized,false);assert.equal(s1.authorizedReadReserveRows,null);
assert.equal(s1.observedWholeV7DailyRowsWritten.max,2825);
assert.equal(evaluateD1AccountQuotaReservationV0_1({writer:shadow,eventName:"schedule",accountUsage:usage(1000,1000),system1ReservePolicy:s1}).physicalAllowed,false);
const gateSource=await readFile(new URL("../scripts/run_d1_account_quota_gate_v0_1.mjs",import.meta.url),"utf8");
assert.ok(gateSource.includes("NOT_DOCUMENTED_BY_VENDOR"));assert.ok(gateSource.includes("NEVER_RELEASE_BEFORE_UTC_RESET"));
assert.doesNotMatch(gateSource,/safetyPercentage|analyticsFreshnessSeconds|freshnessThresholdSeconds/i);

// Additional adversarial cases, OBSERVATIONAL ONLY: do not assert UNSAFE is desirable.
// Re-run the actual private GraphQL parser in an isolated Node VM with fake fetch.
const start=gateSource.indexOf("async function queryAccountUsage(");
const stop=gateSource.indexOf("async function loadQuotaLedger(",start);
assert.ok(start>=0&&stop>start,"GraphQL parser boundaries changed: audit must be rewritten");
const fn=runInNewContext(gateSource.slice(start,stop)+"\nqueryAccountUsage", {AbortSignal});
const mockedFetch=async()=>({ok:true,status:200,json:async()=>({data:{viewer:{accounts:[{d1AnalyticsAdaptiveGroups:[{dimensions:{date:"2026-10-09",databaseId:"synthetic"},sum:{rowsWritten:2000}}]}]}}})});
const incomplete=await fn({accountId:"synthetic",token:"none",quotaDay:"2026-10-09",fetchImpl:mockedFetch});
const graphqlUnsafe=incomplete.known===true&&incomplete.rowsRead===0;
const dryRunFromPartial=evaluateD1AccountQuotaReservationV0_1({writer:shadow,eventName:"schedule",accountUsage:incomplete,system1ReservePolicy:system1Synthetic});
console.log("S2_CORR003_NEW_PROBE "+JSON.stringify({id:"GQL_PARTIAL_ROWS_READ_TREATED_AS_ZERO",state:graphqlUnsafe?"UNSAFE":"SAFE",parserKnown:incomplete.known,parserRowsRead:incomplete.rowsRead,syntheticOtherwiseAuthorizedDecision:dryRunFromPartial.state,noCloudflareIO:true}));

const malformed=summarizeD1QuotaLedgerRowsV0_1([{check_type:"SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",observed_payload_json:"{corrupt",check_id:"synthetic"}],{quotaDay:"2026-10-09"});
const malformedUnsafe=malformed.outstandingReservedRowsWritten===0&&malformed.outstandingReservedRowsRead===0;
const dryRunWithMalformed=evaluateD1AccountQuotaReservationV0_1({writer:shadow,eventName:"schedule",accountUsage:usage(1000,1000),outstandingReservedRowsWritten:malformed.outstandingReservedRowsWritten,outstandingReservedRowsRead:malformed.outstandingReservedRowsRead,system1ReservePolicy:system1Synthetic});
console.log("S2_CORR003_NEW_PROBE "+JSON.stringify({id:"MALFORMED_RESERVATION_LEDGER_ROW_SILENT_SKIP",state:malformedUnsafe?"UNSAFE":"SAFE",reservedWritten:malformed.outstandingReservedRowsWritten,reservedRead:malformed.outstandingReservedRowsRead,syntheticOtherwiseAuthorizedDecision:dryRunWithMalformed.state,noCloudflareIO:true}));

console.log("S2_CORR003_REVERIFY "+JSON.stringify({sourceLevelA1A4:"PASS_FOR_ENUMERATED_CASES",sourceLevelPhysicalAcceptance:false,workflowWriterCount:physical.length,graphqlPartialProbe:graphqlUnsafe?"UNSAFE":"SAFE",ledgerMalformedProbe:malformedUnsafe?"UNSAFE":"SAFE",system1ReserveAuthorized:false,physicalWrites:0}));
