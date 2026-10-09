// CORR-003 independent read-only adversarial audit. A green test result means
// the adversarial evidence probe itself executed, NOT that CORR-003 is closed.
// DATA_LANE must not change REMEDIATION_LANE-owned quota production runtime here.
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {
  evaluateD1AccountQuotaReservationV0_1,
  D1_FREE_LIMITS,
} from "../runtime/d1_account_quota_budget_v0_1.mjs";

const registry=JSON.parse(await readFile(new URL(
 "../config/d1_account_writer_registry_v0_1.json",import.meta.url),"utf8"));
const find=id=>{
 const row=registry.writers.find(w=>w.id===id);
 assert.ok(row,"canonical writer is not registered: "+id);
 return row;
};
const fakeAuthorizedSystem1={
 evidenceState:"SYNTHETIC_ADVERSARIAL_AUDIT_NOT_OPERATIONAL",
 reserveNumberAuthorized:true,authorizedReserveRows:5000,
};
const mkUsage=(rowsWritten,rowsRead)=>({
 known:true,quotaDay:"2026-10-09",rowsWritten,rowsRead,
 source:"SYNTHETIC_ADVERSARIAL_AUDIT_NOT_CLOUDFLARE",
});
const findings=[];
function record(id,observed,condition,description){
 findings.push({id,observed,condition,description});
}

// Positive baselines: no fake System1 reserve ever treated as authorization.
const unknownReserve=evaluateD1AccountQuotaReservationV0_1({
 writer:find("HISTORICAL_ANNUAL_BACKFILL"),eventName:"workflow_dispatch",
 accountUsage:mkUsage(20000,1000),
 system1ReservePolicy:{reserveNumberAuthorized:false,authorizedReserveRows:null},
});
assert.equal(unknownReserve.physicalAllowed,false);
assert.equal(unknownReserve.state,"QUOTA_BUDGET_DEFER");
const blockedPush=evaluateD1AccountQuotaReservationV0_1({
 writer:find("RECENT_A1_WARMUP"),eventName:"push",
 accountUsage:mkUsage(20000,1000),
 system1ReservePolicy:fakeAuthorizedSystem1,
});
assert.equal(blockedPush.physicalAllowed,false);
assert.equal(blockedPush.state,"PUSH_READ_ONLY_ONLY");
assert.equal(D1_FREE_LIMITS.rowsWrittenPerUtcDay,100000);
assert.equal(D1_FREE_LIMITS.rowsReadPerUtcDay,5000000);

// Counterexample 1: FIXED_MEASURED 7,358 rows gets overridden by user-supplied
// reservation=1, even while the writer may mutate much more than one D1 row.
// The UI of HISTORICAL_ANNUAL_BACKFILL has a quota_reservation_rows input.
// There is no evidence-backed lower bound or enforced estimate >= measured.
const annual=find("HISTORICAL_ANNUAL_BACKFILL");
assert.equal(annual.reservationModel.type,"FIXED_MEASURED");
assert.ok(annual.reservationModel.rowsWritten>=7000);
const annualUnderfund=evaluateD1AccountQuotaReservationV0_1({
 writer:annual,eventName:"workflow_dispatch",
 accountUsage:mkUsage(20000,1000),
 system1ReservePolicy:fakeAuthorizedSystem1,
 requestedRowsWritten:1,
});
record("A1_FIXED_MEASURED_CALLER_UNDERESTIMATE",{
 measuredRowsWritten:annual.reservationModel.rowsWritten,
 suppliedRowsWritten:1,
 actualGateState:annualUnderfund.state,
 physicalAllowed:annualUnderfund.physicalAllowed,
 reservedRowsWritten:annualUnderfund.requestedRowsWritten,
 callerOverridesBelowMeasurement:annualUnderfund.physicalAllowed===true
  && annualUnderfund.requestedRowsWritten<annual.reservationModel.rowsWritten,
},"REGRESSION_BLOCKER",
 "Future evidence-authorized System1 reserve permits a 1-row write budget in place of a measured 7,358-row estimate.");
const annualWorkflow=await readFile(new URL(
 "../../.github/workflows/system2-historical-pack-2017-backfill.yml",
 import.meta.url),"utf8");
assert.match(annualWorkflow,/quota_reservation_rows:/);
assert.match(annualWorkflow,/requested_rows_written:\s*\$\{\{ inputs\.quota_reservation_rows \}\}/);

// Counterexample 2: measured rowsRead is 4,999,999, leaving one row to
// Cloudflare Free read ceiling; the physical writer uses default reserved 0.
const readBlindSpot=evaluateD1AccountQuotaReservationV0_1({
 writer:annual,eventName:"workflow_dispatch",
 accountUsage:mkUsage(20000,4999999),
 system1ReservePolicy:fakeAuthorizedSystem1,
 requestedRowsWritten:7358,
 requestedRowsRead:0,
});
record("A2_ZERO_READ_RESERVATION_NEAR_HARD_LIMIT",{
 actualGateState:readBlindSpot.state,
 physicalAllowed:readBlindSpot.physicalAllowed,
 remainingRowsReadBeforeQuery:1,
 admittedRequestedRowsRead:readBlindSpot.requestedRowsRead,
 mightExceedReadLimitIfQueryExceedsOne:readBlindSpot.physicalAllowed===true,
},"REGRESSION_BLOCKER",
 "No evidence-based minimum rowsRead reservation; a physical writer can be admitted with zero read cost while one rowRead remains.");

// Counterexample 3: all 13 registered physical writers reconcile only after
// overall workflow success(). On worker failure after reservation/partial write,
// result receipt is skipped; the outstanding reservation conservatively lingers.
// This is not unauthorized writing but violates full per-run result accounting.
let writerResultSkipOnFailure=0;
for(const writer of registry.writers.filter(w=>w.physicalMutation)){
 const body=await readFile(new URL("../../"+writer.workflow,import.meta.url),"utf8");
 assert.match(body,/\.\/\.github\/actions\/system2-d1-budget-gate/);
 assert.match(body,/mode:\s*result/);
 const i=body.indexOf("mode: result");
 const prefix=body.slice(Math.max(0,i-440),i);
 const skip=/if:\s*steps\.quota\.outputs\.physical_allowed == 'true' && success\(\)/.test(prefix);
 if(skip)writerResultSkipOnFailure++;
}
record("A3_FAILURE_SKIP_RESULT_RECEIPT",{
 registeredPhysicalWriters:registry.writers.filter(w=>w.physicalMutation).length,
 writersSkippingResultOnFailure:writerResultSkipOnFailure,
 allWriterResultsSuccessOnly:writerResultSkipOnFailure===
  registry.writers.filter(w=>w.physicalMutation).length,
},"OPERATIONAL_ACCOUNTING_GAP",
 "A partial/failed physical run does not emit its result receipt; the reservation remains outstanding until the UTC-day rollover.");

// Counterexample 4: INSERT OR IGNORE ledger write does not require a verified
// matching hash/readback on a conflicting existing check_id. Source inspection
// (not a database injection) makes this an unresolved idempotency proof gap.
const gate=await readFile(new URL(
 "../scripts/run_d1_account_quota_gate_v0_1.mjs",import.meta.url),"utf8");
const checks={
 insertIgnore:/INSERT OR IGNORE INTO s2_infrastructure_checks/.test(gate),
 insertSuccessCheck:/result\?\.success === false/.test(gate),
 compareExistingReceiptHash:/compareExistingRow|SELECT\s+check_hash|check_hash\s*=\s*\?|SKIPPED_IDENTICAL/i.test(
  gate.slice(gate.indexOf("async function persistLedgerReceipt"),gate.indexOf("async function main"))),
};
record("A4_LEDGER_COLLISION_IDEMPOTENCY_UNPROVEN",{
  ...checks,uncheckedDuplicateReceiptRisk:checks.insertIgnore&&!checks.compareExistingReceiptHash,
},"PROVENANCE_ACCOUNTING_GAP",
 "Duplicate reservation/result check_id is ignored without proof it matches the intended receipt hash; status should not be inferred from a silent no-op.");

// Do not fail repository CI for reproducing flaws in an independent audit file;
// response state is explicit and prevents accidental promotion.
const known=['A1_FIXED_MEASURED_CALLER_UNDERESTIMATE',
 'A2_ZERO_READ_RESERVATION_NEAR_HARD_LIMIT',
 'A3_FAILURE_SKIP_RESULT_RECEIPT',
 'A4_LEDGER_COLLISION_IDEMPOTENCY_UNPROVEN'];
assert.deepEqual(findings.map(f=>f.id),known);
assert.equal(unknownReserve.paidUpgradeAuthorized,false);
assert.equal(annualUnderfund.paidUpgradeAuthorized,false);
const reproduced=findings.filter(f=>Object.values(f.observed).some(x=>x===true)).length;
const report={
 schemaVersion:"S2_CORR_003_INDEPENDENT_ADVERSARIAL_READONLY_REPRO_V0_1",
 result:"BLOCKED_INDEPENDENT_CLOSURE_REVIEW_COUNTEREXAMPLES_REQUIRE_REMEDIATION",
 mechanism:"OFFLINE_DETERMINISTIC_MAIN_SOURCE_NO_CLOUDFLARE_IO",
 protectedFormalCoreChanged:false,
 actualCloudflareD1ReadsPerformed:0,
 actualCloudflareD1WritesPerformed:0,
 paidPlanUpgradePerformed:false,
 physicalMultiWriterAcceptanceCertified:false,
 syntheticSystem1ReserveMustNeverBePromoted:true,
 scenarioCount:findings.length,
 reproducedFindingCount:reproduced,
 findings,
};
assert.equal(report.scenarioCount,4);
console.log("S2_CORR003_ADVERSARIAL_EVIDENCE "+JSON.stringify(report));
