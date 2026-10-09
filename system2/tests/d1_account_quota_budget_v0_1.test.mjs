import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import {
  D1_FREE_LIMITS,
  evaluateD1AccountQuotaReservationV0_1,
  evaluateD1QuotaResultVarianceV0_1,
  resolveWriterReservationV0_1,
  summarizeD1QuotaLedgerRowsV0_1,
  verifyD1QuotaLedgerReceiptIdentityV0_1,
  utcQuotaDay,
} from "../runtime/d1_account_quota_budget_v0_1.mjs";

const registry = JSON.parse(await readFile(
  new URL("../config/d1_account_writer_registry_v0_1.json", import.meta.url),
  "utf8",
));
const byId = Object.fromEntries(registry.writers.map((row) => [row.id, row]));
const authorizedReserve = {
  evidenceState: "SYNTHETIC_AUTHORIZED_TEST_ONLY",
  reserveNumberAuthorized: true,
  authorizedReserveRows: 5000,
};
const unauthorizedReserve = {
  evidenceState: "INSUFFICIENT_FULL_HISTORY_HEALTHY_DAYS",
  reserveNumberAuthorized: false,
  authorizedReserveRows: null,
};
const usage = (rowsWritten, rowsRead = 0) => ({
  known: true,
  quotaDay: "2026-10-09",
  rowsWritten,
  rowsRead,
  source: "TEST",
});

assert.equal(D1_FREE_LIMITS.rowsWrittenPerUtcDay, 100000);
assert.equal(D1_FREE_LIMITS.rowsReadPerUtcDay, 5000000);
assert.equal(D1_FREE_LIMITS.resetAtUtc, "00:00");
assert.equal(D1_FREE_LIMITS.scope, "ACCOUNT_WIDE");

// Unknown account usage and unapproved System1 reserve remain fail closed.
const unknownUsage = evaluateD1AccountQuotaReservationV0_1({
  writer: byId.DAILY_SHADOW_DIAGNOSTIC,
  eventName: "schedule",
  accountUsage: { known: false, quotaDay: "2026-10-09" },
  system1ReservePolicy: authorizedReserve,
});
assert.equal(unknownUsage.state, "QUOTA_BUDGET_DEFER");
assert.ok(unknownUsage.reasonCodes.includes("ACCOUNT_WIDE_D1_USAGE_UNKNOWN"));

const unknownSystem1Reserve = evaluateD1AccountQuotaReservationV0_1({
  writer: byId.DAILY_SHADOW_DIAGNOSTIC,
  eventName: "schedule",
  accountUsage: usage(1000,1000),
  system1ReservePolicy: unauthorizedReserve,
});
assert.equal(unknownSystem1Reserve.state, "QUOTA_BUDGET_DEFER");
assert.ok(unknownSystem1Reserve.reasonCodes.includes("SYSTEM1_AFTER_MARKET_RESERVE_NOT_AUTHORIZED"));
assert.equal(unknownSystem1Reserve.paidUpgradeAuthorized, false);

// A1: measured write cost is a hard lower bound. Caller cannot reduce it.
const annualWithReadEvidence = {
  ...byId.HISTORICAL_ANNUAL_BACKFILL,
  readReservationModel: {
    type: "FIXED_MEASURED",
    rowsRead: 40000,
    evidence: "SYNTHETIC_TEST_ONLY",
  },
};
for (const tooLow of [0,1,7357]) {
  const d = evaluateD1AccountQuotaReservationV0_1({
    writer: annualWithReadEvidence,
    eventName: "workflow_dispatch",
    accountUsage: usage(20000,1000),
    system1ReservePolicy: authorizedReserve,
    requestedRowsWritten: tooLow,
    requestedRowsRead: 40000,
  });
  assert.equal(d.state, "QUOTA_BUDGET_DEFER");
  assert.ok(d.reasonCodes.includes("WRITER_WRITE_RESERVATION_BELOW_VERIFIED_MINIMUM"));
  assert.equal(d.physicalAllowed,false);
}
for (const adequate of [7358,7359,10000]) {
  const d = evaluateD1AccountQuotaReservationV0_1({
    writer: annualWithReadEvidence,
    eventName: "workflow_dispatch",
    accountUsage: usage(20000,1000),
    system1ReservePolicy: authorizedReserve,
    requestedRowsWritten: adequate,
    requestedRowsRead: 40000,
  });
  assert.equal(d.state, "QUOTA_RESERVATION_GRANTED");
  assert.equal(d.requestedRowsWritten,adequate);
  assert.ok(d.requestedRowsWritten>=7358);
}

// A1 amplification boundary: Recent A1 keeps the measured 11,576 rowsWritten/date.
const warmup = evaluateD1AccountQuotaReservationV0_1({
  writer: byId.RECENT_A1_WARMUP,
  eventName: "schedule",
  accountUsage: usage(50000,500000),
  system1ReservePolicy: authorizedReserve,
});
assert.equal(warmup.state, "QUOTA_RESERVATION_GRANTED");
assert.equal(warmup.adaptiveMaxDates,2);
assert.equal(warmup.requestedRowsWritten,23152);
assert.equal(warmup.requestedRowsRead,1047112);
assert.equal(warmup.analyticsLagPolicy,"GRAPHQL_LOWER_BOUND_PLUS_NON_RELEASING_SAME_DAY_RESERVATIONS");

// A2: unknown read cost is never zero. Writers without verified read cost cannot be granted.
const annualReadUnknown = evaluateD1AccountQuotaReservationV0_1({
  writer: byId.HISTORICAL_ANNUAL_BACKFILL,
  eventName: "workflow_dispatch",
  accountUsage: usage(20000,1000),
  system1ReservePolicy: authorizedReserve,
  requestedRowsWritten: 7358,
  requestedRowsRead: 1,
});
assert.equal(annualReadUnknown.state,"QUOTA_BUDGET_DEFER");
assert.ok(annualReadUnknown.reasonCodes.includes("WRITER_READ_RESERVATION_EVIDENCE_REQUIRED"));

const annualResolved = resolveWriterReservationV0_1({
  writer: byId.HISTORICAL_ANNUAL_BACKFILL,
  requestedRowsWritten: 7358,
  requestedRowsRead: 0,
  availableRowsWrittenBeforeRequest: 50000,
});
assert.equal(annualResolved.state,"RESERVATION_NOT_PROVEN");
assert.equal(annualResolved.readState,"READ_RESERVATION_EVIDENCE_REQUIRED");

// Measured Daily Shadow read cost = 583,256. Exact hard-limit boundary is allowed; +1 is deferred.
const readExact = evaluateD1AccountQuotaReservationV0_1({
  writer: byId.DAILY_SHADOW_DIAGNOSTIC,
  eventName: "schedule",
  accountUsage: usage(1000,5000000-583256),
  system1ReservePolicy: authorizedReserve,
});
assert.equal(readExact.state,"QUOTA_RESERVATION_GRANTED");
assert.equal(readExact.projectedRowsRead,5000000);

const readOver = evaluateD1AccountQuotaReservationV0_1({
  writer: byId.DAILY_SHADOW_DIAGNOSTIC,
  eventName: "schedule",
  accountUsage: usage(1000,5000000-583256+1),
  system1ReservePolicy: authorizedReserve,
});
assert.equal(readOver.state,"QUOTA_BUDGET_DEFER");
assert.ok(readOver.reasonCodes.includes("ROWS_READ_DAILY_BUDGET_EXCEEDED"));

// A2 actual cost overrun is explicit and never releases the reservation.
const readVariance=evaluateD1QuotaResultVarianceV0_1({
  reservedRowsWritten:7358,
  reservedRowsRead:40000,
  observedDeltaRowsWritten:8000,
  observedDeltaRowsRead:45000,
});
assert.equal(readVariance.writeOverrun,true);
assert.equal(readVariance.readOverrun,true);
assert.equal(readVariance.anyOverrun,true);
assert.equal(readVariance.releaseReservationWithinUtcDay,false);
assert.equal(readVariance.state,"RESULT_RESERVATION_OVERRUN_NON_RELEASING");

const unknownVariance=evaluateD1QuotaResultVarianceV0_1({
  reservedRowsWritten:7358,
  reservedRowsRead:40000,
  observedDeltaRowsWritten:null,
  observedDeltaRowsRead:null,
});
assert.equal(unknownVariance.usageKnown,false);
assert.equal(unknownVariance.releaseReservationWithinUtcDay,false);
assert.equal(unknownVariance.state,"RESULT_USAGE_UNKNOWN_NON_RELEASING");

// A3: failure result receipt does not release the reservation; retry reserves independently.
const day="2026-10-09";
const reservation=(runKey,w,r)=>({
  check_type:"SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",
  observed_payload_json:JSON.stringify({runKey,quotaDay:day,requestedRowsWritten:w,requestedRowsRead:r}),
});
const result=(runKey,state,afterW,afterR)=>({
  check_type:"SYSTEM2_D1_ACCOUNT_BUDGET_RESULT_V0_1",
  observed_payload_json:JSON.stringify({
    runKey,quotaDay:day,resultState:state,
    accountRowsWrittenAfter:afterW,accountRowsReadAfter:afterR,
  }),
});
const failureLedger=summarizeD1QuotaLedgerRowsV0_1([
  reservation("100:1:ANNUAL",7358,40000),
  result("100:1:ANNUAL","RESULT_FAILURE_OBSERVED_NON_RELEASING",30000,80000),
],{quotaDay:day});
assert.equal(failureLedger.outstandingReservedRowsWritten,7358);
assert.equal(failureLedger.outstandingReservedRowsRead,40000);
assert.equal(failureLedger.resultCount,1);
assert.equal(failureLedger.sameDayReservationReleasePolicy,"NEVER_RELEASE_BEFORE_UTC_RESET");

const retryLedger=summarizeD1QuotaLedgerRowsV0_1([
  reservation("100:1:ANNUAL",7358,40000),
  result("100:1:ANNUAL","RESULT_FAILURE_OBSERVED_NON_RELEASING",30000,80000),
  reservation("100:2:ANNUAL",7358,40000),
],{quotaDay:day});
assert.equal(retryLedger.outstandingReservedRowsWritten,14716);
assert.equal(retryLedger.outstandingReservedRowsRead,80000);

// Cross-day recovery: a prior-day receipt does not consume the new UTC-day ledger.
const crossDay=summarizeD1QuotaLedgerRowsV0_1([
  {
    check_type:"SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",
    observed_payload_json:JSON.stringify({runKey:"old",quotaDay:"2026-10-08",requestedRowsWritten:9000,requestedRowsRead:50000}),
  },
  reservation("new",7358,40000),
],{quotaDay:"2026-10-09"});
assert.equal(crossDay.outstandingReservedRowsWritten,7358);
assert.equal(crossDay.outstandingReservedRowsRead,40000);
assert.equal(utcQuotaDay("2026-10-09T00:00:00.000Z"),"2026-10-09");

// A4: identical receipt is idempotent; same ID with changed hash/payload/status is rejected.
const intended={
  checkId:"S2-D1-BUDGET:2026-10-09:run:RESERVATION",
  checkType:"SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",
  expectedPayloadJson:'{"directiveId":"S2-CORR-20261007-003"}',
  observedPayloadJson:'{"runKey":"run","quotaDay":"2026-10-09"}',
  status:"QUOTA_RESERVATION_GRANTED",
  checkHash:"abc123",
};
const existing={
  check_id:intended.checkId,
  check_type:intended.checkType,
  expected_payload_json:intended.expectedPayloadJson,
  observed_payload_json:intended.observedPayloadJson,
  status:intended.status,
  check_hash:intended.checkHash,
};
assert.equal(verifyD1QuotaLedgerReceiptIdentityV0_1(existing,intended).idempotent,true);
for(const [field,value] of [
  ["check_hash","tampered"],
  ["observed_payload_json",'{"runKey":"other"}'],
  ["status","TAMPERED"],
  ["check_type","OTHER_TYPE"],
]){
  assert.throws(
    ()=>verifyD1QuotaLedgerReceiptIdentityV0_1({...existing,[field]:value},intended),
    /D1_QUOTA_LEDGER_IDEMPOTENCY_CONFLICT/,
  );
}

// Existing basic policy checks.
const p2Push = evaluateD1AccountQuotaReservationV0_1({
  writer: byId.RECENT_A1_WARMUP,
  eventName: "push",
  accountUsage: usage(0,0),
  system1ReservePolicy: authorizedReserve,
});
assert.equal(p2Push.state, "PUSH_READ_ONLY_ONLY");
assert.equal(p2Push.physicalAllowed, false);

const readOnly = evaluateD1AccountQuotaReservationV0_1({
  writer: byId.OCT08_FULL_SOURCE_HOT_D1_CENSUS,
  eventName: "workflow_dispatch",
  accountUsage: { known: false, quotaDay: day },
  system1ReservePolicy: unauthorizedReserve,
});
assert.equal(readOnly.state, "READ_ONLY_ALLOWED");
assert.equal(readOnly.physicalAllowed, false);

// Registry completeness and read-cost contract.
const workflowsDir = new URL("../../.github/workflows/", import.meta.url);
const files = (await readdir(workflowsDir)).filter((name) => name.endsWith(".yml"));
const sharingAuthority = [];
for (const name of files) {
  const body = await readFile(new URL(name, workflowsDir), "utf8");
  if (/group:\s*system2-isolated-d1-writer/.test(body)) sharingAuthority.push(`.github/workflows/${name}`);
}
assert.deepEqual([...sharingAuthority].sort(), registry.writers.map((row) => row.workflow).sort());

for (const row of registry.writers) {
  assert.ok(["P0","P1","P2","P3","READ_ONLY"].includes(row.priority));
  assert.equal(typeof row.physicalMutation,"boolean");
  assert.equal(typeof row.pushPhysicalAllowed,"boolean");
  assert.ok(row.readReservationModel,"every registered writer must declare read reservation semantics");
  if(row.physicalMutation){
    assert.notEqual(row.reservationModel?.type,"NONE");
    assert.notEqual(row.readReservationModel?.type,"NONE");
  }else{
    assert.equal(row.readReservationModel?.type,"NONE");
  }
  if(["P2","P3"].includes(row.priority)) assert.equal(row.pushPhysicalAllowed,false);
}

console.log("System2 account-wide D1 quota budget V0.2 tests passed");
