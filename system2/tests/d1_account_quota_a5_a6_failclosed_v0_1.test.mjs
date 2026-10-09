import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import {
  D1_FREE_LIMITS,
  evaluateD1AccountQuotaReservationV0_1,
  summarizeD1QuotaLedgerRowsV0_1,
} from "../runtime/d1_account_quota_budget_v0_1.mjs";

const gateSource = await readFile(
  new URL("../scripts/run_d1_account_quota_gate_v0_1.mjs", import.meta.url),
  "utf8",
);
const registry = JSON.parse(await readFile(
  new URL("../config/d1_account_writer_registry_v0_1.json", import.meta.url),
  "utf8",
));
const shadow = registry.writers.find((row) => row.id === "DAILY_SHADOW_DIAGNOSTIC");
assert.ok(shadow);

const system1Synthetic = {
  reserveNumberAuthorized: true,
  authorizedReserveRows: 5000,
  readReserveNumberAuthorized: true,
  authorizedReadReserveRows: 5000,
  evidenceState: "SYNTHETIC_TEST_ONLY",
};
const usage = (rowsWritten, rowsRead) => ({
  known: true,
  quotaDay: "2026-10-09",
  rowsWritten,
  rowsRead,
  source: "SYNTHETIC_TEST_ONLY",
});

function sha256(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
function quotaDayBounds(day) {
  return {
    start: day + "T00:00:00.000Z",
    end: day + "T23:59:59.999Z",
  };
}

// A5: execute the actual private GraphQL parser in a VM with synthetic HTTP 200 payloads.
const queryStart = gateSource.indexOf("async function queryAccountUsage(");
const queryStop = gateSource.indexOf("async function loadQuotaLedger(", queryStart);
assert.ok(queryStart >= 0 && queryStop > queryStart);
const queryAccountUsage = runInNewContext(
  gateSource.slice(queryStart, queryStop) + "\nqueryAccountUsage",
  { AbortSignal },
);

const payloadResponse = (groups, accountsOverride = null) => async () => ({
  ok: true,
  status: 200,
  json: async () => ({
    data: {
      viewer: {
        accounts: accountsOverride ?? [{ d1AnalyticsAdaptiveGroups: groups }],
      },
    },
  }),
});

const validGroups = [
  {
    dimensions: { date: "2026-10-09", databaseId: "db-system2" },
    sum: { rowsWritten: 2000, rowsRead: 3000 },
  },
  {
    dimensions: { date: "2026-10-09", databaseId: "db-system1" },
    sum: { rowsWritten: 50, rowsRead: 70 },
  },
];
const validUsage = await queryAccountUsage({
  accountId: "synthetic",
  token: "none",
  quotaDay: "2026-10-09",
  fetchImpl: payloadResponse(validGroups),
});
assert.equal(validUsage.known, true);
assert.equal(validUsage.rowsWritten, 2050);
assert.equal(validUsage.rowsRead, 3070);
assert.equal(validUsage.databaseGroupCount, 2);

const invalidGraphqlCases = [
  ["missing rowsRead", [{ dimensions: { date: "2026-10-09", databaseId: "db" }, sum: { rowsWritten: 2 } }]],
  ["missing rowsWritten", [{ dimensions: { date: "2026-10-09", databaseId: "db" }, sum: { rowsRead: 2 } }]],
  ["null rowsRead", [{ dimensions: { date: "2026-10-09", databaseId: "db" }, sum: { rowsWritten: 2, rowsRead: null } }]],
  ["null rowsWritten", [{ dimensions: { date: "2026-10-09", databaseId: "db" }, sum: { rowsWritten: null, rowsRead: 2 } }]],
  ["string metric", [{ dimensions: { date: "2026-10-09", databaseId: "db" }, sum: { rowsWritten: "2", rowsRead: 2 } }]],
  ["negative metric", [{ dimensions: { date: "2026-10-09", databaseId: "db" }, sum: { rowsWritten: -1, rowsRead: 2 } }]],
  ["fractional metric", [{ dimensions: { date: "2026-10-09", databaseId: "db" }, sum: { rowsWritten: 1.5, rowsRead: 2 } }]],
  ["nonfinite metric", [{ dimensions: { date: "2026-10-09", databaseId: "db" }, sum: { rowsWritten: Number.POSITIVE_INFINITY, rowsRead: 2 } }]],
  ["missing date", [{ dimensions: { databaseId: "db" }, sum: { rowsWritten: 2, rowsRead: 2 } }]],
  ["wrong date", [{ dimensions: { date: "2026-10-08", databaseId: "db" }, sum: { rowsWritten: 2, rowsRead: 2 } }]],
  ["missing databaseId", [{ dimensions: { date: "2026-10-09" }, sum: { rowsWritten: 2, rowsRead: 2 } }]],
  ["empty databaseId", [{ dimensions: { date: "2026-10-09", databaseId: " " }, sum: { rowsWritten: 2, rowsRead: 2 } }]],
  ["duplicate identity", [
    { dimensions: { date: "2026-10-09", databaseId: "db" }, sum: { rowsWritten: 2, rowsRead: 2 } },
    { dimensions: { date: "2026-10-09", databaseId: "db" }, sum: { rowsWritten: 3, rowsRead: 3 } },
  ]],
  ["empty groups", []],
];
for (const [name, groups] of invalidGraphqlCases) {
  const result = await queryAccountUsage({
    accountId: "synthetic",
    token: "none",
    quotaDay: "2026-10-09",
    fetchImpl: payloadResponse(groups),
  });
  assert.equal(result.known, false, name);
  assert.equal(result.rowsWritten, null, name);
  assert.equal(result.rowsRead, null, name);
  const decision = evaluateD1AccountQuotaReservationV0_1({
    writer: shadow,
    eventName: "schedule",
    accountUsage: result,
    system1ReservePolicy: system1Synthetic,
  });
  assert.equal(decision.state, "QUOTA_BUDGET_DEFER", name);
  assert.ok(decision.reasonCodes.includes("ACCOUNT_WIDE_D1_USAGE_UNKNOWN"), name);
}

for (const [name, accounts] of [
  ["missing accounts", null],
  ["zero accounts", []],
  ["multiple accounts", [
    { d1AnalyticsAdaptiveGroups: validGroups },
    { d1AnalyticsAdaptiveGroups: validGroups },
  ]],
]) {
  const fetchImpl = name === "missing accounts"
    ? async () => ({
      ok: true,
      status: 200,
      json: async () => ({ data: { viewer: {} } }),
    })
    : payloadResponse(validGroups, accounts);
  const result = await queryAccountUsage({
    accountId: "synthetic",
    token: "none",
    quotaDay: "2026-10-09",
    fetchImpl,
  });
  assert.equal(result.known, false, name);
}

// A6: malformed/incomplete same-day ledger data must saturate the hard caps, never disappear.
const malformedCases = [
  ["malformed json", {
    check_type: "SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",
    observed_payload_json: "{corrupt",
  }],
  ["missing runKey", {
    check_type: "SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",
    observed_payload_json: JSON.stringify({
      quotaDay: "2026-10-09",
      requestedRowsWritten: 7358,
      requestedRowsRead: 40000,
    }),
  }],
  ["missing quotaDay", {
    check_type: "SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",
    observed_payload_json: JSON.stringify({
      runKey: "r",
      requestedRowsWritten: 7358,
      requestedRowsRead: 40000,
    }),
  }],
  ["missing write cost", {
    check_type: "SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",
    observed_payload_json: JSON.stringify({
      runKey: "r",
      quotaDay: "2026-10-09",
      requestedRowsRead: 40000,
    }),
  }],
  ["string read cost", {
    check_type: "SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",
    observed_payload_json: JSON.stringify({
      runKey: "r",
      quotaDay: "2026-10-09",
      requestedRowsWritten: 7358,
      requestedRowsRead: "40000",
    }),
  }],
  ["unknown check type", {
    check_type: "OTHER",
    observed_payload_json: JSON.stringify({
      runKey: "r",
      quotaDay: "2026-10-09",
      requestedRowsWritten: 7358,
      requestedRowsRead: 40000,
    }),
  }],
];
for (const [name, row] of malformedCases) {
  const summary = summarizeD1QuotaLedgerRowsV0_1([row], { quotaDay: "2026-10-09" });
  assert.equal(summary.integrityState, "INVALID", name);
  assert.equal(summary.outstandingReservedRowsWritten, D1_FREE_LIMITS.rowsWrittenPerUtcDay, name);
  assert.equal(summary.outstandingReservedRowsRead, D1_FREE_LIMITS.rowsReadPerUtcDay, name);
  const decision = evaluateD1AccountQuotaReservationV0_1({
    writer: shadow,
    eventName: "schedule",
    accountUsage: usage(1000, 1000),
    system1ReservePolicy: system1Synthetic,
    ledgerIntegrityState: summary.integrityState,
    outstandingReservedRowsWritten: summary.outstandingReservedRowsWritten,
    outstandingReservedRowsRead: summary.outstandingReservedRowsRead,
  });
  assert.equal(decision.state, "QUOTA_BUDGET_DEFER", name);
  assert.ok(decision.reasonCodes.includes("D1_QUOTA_LEDGER_INTEGRITY_INVALID"), name);
}

const reservationPayload = (runKey = "r") => ({
  runKey,
  quotaDay: "2026-10-09",
  requestedRowsWritten: 7358,
  requestedRowsRead: 40000,
});
const reservationRow = (runKey = "r") => ({
  check_type: "SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",
  observed_payload_json: JSON.stringify(reservationPayload(runKey)),
});
const duplicateSummary = summarizeD1QuotaLedgerRowsV0_1(
  [reservationRow("dup"), reservationRow("dup")],
  { quotaDay: "2026-10-09" },
);
assert.equal(duplicateSummary.integrityState, "INVALID");
assert.match(duplicateSummary.integrityErrors[0].code, /DUPLICATE_RESERVATION/);

const resultWithoutReservation = summarizeD1QuotaLedgerRowsV0_1([{
  check_type: "SYSTEM2_D1_ACCOUNT_BUDGET_RESULT_V0_1",
  observed_payload_json: JSON.stringify({
    runKey: "orphan",
    quotaDay: "2026-10-09",
    resultState: "RESULT_FAILURE_OBSERVED_NON_RELEASING",
    accountRowsWrittenAfter: 10,
    accountRowsReadAfter: 20,
  }),
}], { quotaDay: "2026-10-09" });
assert.equal(resultWithoutReservation.integrityState, "INVALID");
assert.equal(resultWithoutReservation.integrityErrors[0].code, "LEDGER_RESULT_WITHOUT_RESERVATION");

const badResultMetric = summarizeD1QuotaLedgerRowsV0_1([
  reservationRow("metric"),
  {
    check_type: "SYSTEM2_D1_ACCOUNT_BUDGET_RESULT_V0_1",
    observed_payload_json: JSON.stringify({
      runKey: "metric",
      quotaDay: "2026-10-09",
      resultState: "RESULT_SUCCESS_OBSERVED_NON_RELEASING",
      accountRowsWrittenAfter: "10",
      accountRowsReadAfter: 20,
    }),
  },
], { quotaDay: "2026-10-09" });
assert.equal(badResultMetric.integrityState, "INVALID");

// Production identity validation path.
const expectedJson = JSON.stringify({
  directiveId: "S2-CORR-20261007-003",
  accountWide: true,
  paidUpgradeAuthorized: false,
});
function productionReservationRow({
  runKey = "prod",
  quotaDay = "2026-10-09",
  timestamp = "2026-10-09T02:00:00.000Z",
  checkIdOverride = null,
  checkHashOverride = null,
  schemaVersion = "S2_D1_ACCOUNT_BUDGET_RESERVATION_V0_2",
} = {}) {
  const payload = {
    schemaVersion,
    budgetVersion: "S2_D1_ACCOUNT_QUOTA_BUDGET_V0_2",
    directiveId: "S2-CORR-20261007-003",
    runKey,
    quotaDay,
    requestedRowsWritten: 7358,
    requestedRowsRead: 40000,
  };
  const checkId = checkIdOverride ?? "S2-D1-BUDGET:" + quotaDay + ":" + runKey + ":RESERVATION";
  const observed = JSON.stringify(payload);
  const status = "QUOTA_RESERVATION_GRANTED";
  const checkHash = checkHashOverride ?? sha256({
    checkId,
    checkType: "SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",
    expectedPayloadJson: expectedJson,
    observedPayloadJson: observed,
    status,
  });
  return {
    check_id: checkId,
    check_type: "SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",
    expected_payload_json: expectedJson,
    observed_payload_json: observed,
    status,
    check_hash: checkHash,
    check_timestamp: timestamp,
  };
}

const productionValid = summarizeD1QuotaLedgerRowsV0_1(
  [productionReservationRow()],
  { quotaDay: "2026-10-09", requireReceiptIdentity: true },
);
assert.equal(productionValid.integrityState, "VALID");
assert.equal(productionValid.outstandingReservedRowsWritten, 7358);

for (const [name, row] of [
  ["missing hash", { ...productionReservationRow(), check_hash: null }],
  ["bad check id", productionReservationRow({ checkIdOverride: "BAD" })],
  ["bad schema", productionReservationRow({ schemaVersion: "UNKNOWN" })],
  ["wrong production quota day", productionReservationRow({ quotaDay: "2026-10-08" })],
  ["bad timestamp", productionReservationRow({ timestamp: "not-a-time" })],
]) {
  const summary = summarizeD1QuotaLedgerRowsV0_1(
    [row],
    { quotaDay: "2026-10-09", requireReceiptIdentity: true },
  );
  assert.equal(summary.integrityState, "INVALID", name);
}

// Execute actual private production loader with a fake D1 adapter to verify hash/day checks.
const loadStart = gateSource.indexOf("async function loadQuotaLedger(");
const loadStop = gateSource.indexOf("function ledgerExpectedPayloadJson()", loadStart);
assert.ok(loadStart >= 0 && loadStop > loadStart);
const loadQuotaLedger = runInNewContext(
  gateSource.slice(loadStart, loadStop) + "\nloadQuotaLedger",
  {
    quotaDayBounds,
    summarizeD1QuotaLedgerRowsV0_1,
    sha256,
    D1_FREE_LIMITS,
    Object,
    JSON,
    Date,
  },
);
const dbFor = (rows) => ({ rawQuery: async () => rows });

const loaderValid = await loadQuotaLedger(dbFor([productionReservationRow()]), "2026-10-09");
assert.equal(loaderValid.integrityState, "VALID");

const tamperedHash = await loadQuotaLedger(
  dbFor([productionReservationRow({ checkHashOverride: "0".repeat(64) })]),
  "2026-10-09",
);
assert.equal(tamperedHash.integrityState, "INVALID");
assert.equal(tamperedHash.integrityErrors[0].code, "LEDGER_CHECK_HASH_MISMATCH");
assert.equal(tamperedHash.outstandingReservedRowsWritten, D1_FREE_LIMITS.rowsWrittenPerUtcDay);

const wrongTimestampDay = await loadQuotaLedger(
  dbFor([productionReservationRow({ timestamp: "2026-10-08T23:59:59.000Z" })]),
  "2026-10-09",
);
assert.equal(wrongTimestampDay.integrityState, "INVALID");
assert.equal(wrongTimestampDay.integrityErrors[0].code, "LEDGER_CHECK_TIMESTAMP_WRONG_UTC_DAY");

assert.match(gateSource, /D1_ANALYTICS_GROUP_SUM_PARTIAL_OR_INVALID/);
assert.match(gateSource, /D1_ANALYTICS_GROUP_IDENTITY_DUPLICATE/);
assert.match(gateSource, /requireReceiptIdentity: true/);
assert.match(gateSource, /LEDGER_CHECK_HASH_MISMATCH/);
assert.doesNotMatch(gateSource, /analyticsFreshnessSeconds|safetyPercentage|freshnessThresholdSeconds/i);

console.log("System2 CORR-003 A5/A6 fail-closed adversarial tests passed");
