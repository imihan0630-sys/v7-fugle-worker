import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import {
  D1_FREE_LIMITS,
  evaluateD1AccountQuotaReservationV0_1,
  summarizeD1QuotaLedgerRowsV0_1,
} from "../runtime/d1_account_quota_budget_v0_1.mjs";

const source = await readFile(
  new URL("../scripts/run_d1_account_quota_gate_v0_1.mjs", import.meta.url),
  "utf8",
);
const registry = JSON.parse(await readFile(
  new URL("../config/d1_account_writer_registry_v0_1.json", import.meta.url),
  "utf8",
));
const shadow = registry.writers.find((row) => row.id === "DAILY_SHADOW_DIAGNOSTIC");
assert.ok(shadow);

const sha256 = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
const quotaDayBounds = (day) => ({
  start: day + "T00:00:00.000Z",
  end: day + "T23:59:59.999Z",
});
const loadStart = source.indexOf("async function loadQuotaLedger(");
const loadStop = source.indexOf("function ledgerExpectedPayloadJson()", loadStart);
assert.ok(loadStart >= 0 && loadStop > loadStart);
const loadQuotaLedger = runInNewContext(
  source.slice(loadStart, loadStop) + "\nloadQuotaLedger",
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
const readLedger = (rows) =>
  loadQuotaLedger({ rawQuery: async () => rows }, "2026-10-09");

const expectedJson = JSON.stringify({
  directiveId: "S2-CORR-20261007-003",
  accountWide: true,
  paidUpgradeAuthorized: false,
});
const checkType = "SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1";
const checkId = "S2-D1-BUDGET:2026-10-09:test-run:RESERVATION";
const timestamp = "2026-10-09T02:00:00.000Z";

const v02Payload = {
  schemaVersion: "S2_D1_ACCOUNT_BUDGET_RESERVATION_V0_2",
  budgetVersion: "S2_D1_ACCOUNT_QUOTA_BUDGET_V0_2",
  directiveId: "S2-CORR-20261007-003",
  runKey: "test-run",
  writerId: "DAILY_SHADOW_DIAGNOSTIC",
  writerClass: "P0_PROTECTED_OPERATIONAL",
  priority: "P0",
  eventName: "schedule",
  quotaDay: "2026-10-09",
  requestedRowsWritten: 13130,
  requestedRowsRead: 583256,
  paidUpgradeAuthorized: false,
  system1FormalCoreChanged: false,
};
const v02Json = JSON.stringify(v02Payload);
function currentIdentityHash({ expectedPayloadJson = expectedJson, status = "QUOTA_RESERVATION_GRANTED" } = {}) {
  return sha256({
    checkId,
    checkType,
    expectedPayloadJson,
    observedPayloadJson: v02Json,
    status,
  });
}
function v02Row({
  legacy = false,
  status = "QUOTA_RESERVATION_GRANTED",
  expectedPayloadJson = expectedJson,
  checkHash = null,
} = {}) {
  return {
    check_id: checkId,
    check_type: checkType,
    expected_payload_json: expectedPayloadJson,
    observed_payload_json: v02Json,
    status,
    check_hash: checkHash ?? (
      legacy ? sha256(v02Payload) : currentIdentityHash({ expectedPayloadJson, status })
    ),
    check_timestamp: timestamp,
  };
}

// Positive: current V0.2 receipt with full immutable identity hash remains valid.
const currentValid = await readLedger([v02Row()]);
assert.equal(currentValid.integrityState, "VALID");
assert.equal(currentValid.outstandingReservedRowsWritten, 13130);
assert.equal(currentValid.outstandingReservedRowsRead, 583256);

// A7 exact attack: a V0.2 receipt may NOT authenticate with payload-only legacy hash.
for (const [name, row] of [
  ["v02-legacy-payload-hash", v02Row({ legacy: true })],
  ["v02-legacy-status-tamper", v02Row({ legacy: true, status: "TAMPERED" })],
  ["v02-legacy-expected-tamper", v02Row({
    legacy: true,
    expectedPayloadJson: JSON.stringify({
      directiveId: "S2-CORR-20261007-003",
      accountWide: false,
      paidUpgradeAuthorized: true,
    }),
  })],
]) {
  const ledger = await readLedger([row]);
  assert.equal(ledger.integrityState, "INVALID", name);
  assert.equal(
    ledger.integrityErrors[0].code,
    "LEDGER_LEGACY_HASH_CONTRACT_INVALID",
    name,
  );
  assert.equal(ledger.outstandingReservedRowsWritten, D1_FREE_LIMITS.rowsWrittenPerUtcDay, name);
  assert.equal(ledger.outstandingReservedRowsRead, D1_FREE_LIMITS.rowsReadPerUtcDay, name);
}

// Current full-identity hash still catches metadata mutation without rehash.
const fullIdentityStatusTamper = await readLedger([{
  ...v02Row(),
  status: "TAMPERED",
}]);
assert.equal(fullIdentityStatusTamper.integrityState, "INVALID");
assert.equal(fullIdentityStatusTamper.integrityErrors[0].code, "LEDGER_CHECK_HASH_MISMATCH");

// Proven historical legacy contract: original PR #980 wrote V0.1 payload-only hashes.
const v01Payload = {
  schemaVersion: "S2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",
  budgetVersion: "S2_D1_ACCOUNT_QUOTA_BUDGET_V0_1",
  directiveId: "S2-CORR-20261007-003",
  runKey: "legacy-run",
  writerId: "DAILY_SHADOW_DIAGNOSTIC",
  writerClass: "P0_PROTECTED_OPERATIONAL",
  priority: "P0",
  eventName: "schedule",
  quotaDay: "2026-10-09",
  requestedRowsWritten: 13130,
  requestedRowsRead: 0,
  adaptiveMaxDates: null,
  rowsWrittenUsed: 1000,
  rowsReadUsed: 1000,
  projectedRowsWritten: 14138,
  projectedRowsRead: 1000,
  system1ReserveRows: 5000,
  protectedDailyShadowReserveRows: 13130,
  launchAcceptanceReserveRows: 0,
  outstandingReservedRowsWritten: 0,
  rowsWrittenLimit: 100000,
  rowsReadLimit: 5000000,
  resetAtUtc: "00:00",
  accountUsageSource: "CLOUDFLARE_D1_GRAPHQL_ACCOUNT_ANALYTICS",
  system1ReserveEvidenceState: "LEGACY_TEST",
  system1ReserveEvidencePath: "legacy",
  paidUpgradeAuthorized: false,
  system1FormalCoreChanged: false,
};
const v01CheckId = "S2-D1-BUDGET:2026-10-09:legacy-run:RESERVATION";
function v01ReservationRow({
  payload = v01Payload,
  status = "QUOTA_RESERVATION_GRANTED",
  expectedPayloadJson = expectedJson,
} = {}) {
  return {
    check_id: v01CheckId,
    check_type: "SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",
    expected_payload_json: expectedPayloadJson,
    observed_payload_json: JSON.stringify(payload),
    status,
    check_hash: sha256(payload),
    check_timestamp: timestamp,
  };
}

// Positive: authentic V0.1 legacy receipt remains readable, without rewriting history.
const legacyValid = await readLedger([v01ReservationRow()]);
assert.equal(legacyValid.integrityState, "VALID");
assert.equal(legacyValid.outstandingReservedRowsWritten, 13130);

// V0.1 legacy compatibility is narrow: metadata/status/budget/schema cannot drift.
for (const [name, row] of [
  ["v01-status-tamper", v01ReservationRow({ status: "TAMPERED" })],
  ["v01-expected-tamper", v01ReservationRow({
    expectedPayloadJson: JSON.stringify({
      directiveId: "S2-CORR-20261007-003",
      accountWide: true,
      paidUpgradeAuthorized: false,
      extra: "NOT_LEGACY",
    }),
  })],
  ["v01-budget-tamper", v01ReservationRow({
    payload: { ...v01Payload, budgetVersion: "S2_D1_ACCOUNT_QUOTA_BUDGET_V0_2" },
  })],
  ["v01-schema-tamper", v01ReservationRow({
    payload: { ...v01Payload, schemaVersion: "S2_D1_ACCOUNT_BUDGET_RESERVATION_V0_2" },
  })],
  ["v01-paid-tamper", v01ReservationRow({
    payload: { ...v01Payload, paidUpgradeAuthorized: true },
  })],
]) {
  const ledger = await readLedger([row]);
  assert.equal(ledger.integrityState, "INVALID", name);
  assert.equal(ledger.integrityErrors[0].code, "LEDGER_LEGACY_HASH_CONTRACT_INVALID", name);
}

// Positive legacy V0.1 result must also bind status to the original V0.1 resultState.
const resultPayload = {
  schemaVersion: "S2_D1_ACCOUNT_BUDGET_RESULT_V0_1",
  budgetVersion: "S2_D1_ACCOUNT_QUOTA_BUDGET_V0_1",
  directiveId: "S2-CORR-20261007-003",
  runKey: "legacy-run",
  writerId: "DAILY_SHADOW_DIAGNOSTIC",
  writerClass: "P0_PROTECTED_OPERATIONAL",
  priority: "P0",
  quotaDay: "2026-10-09",
  reservationCheckHash: sha256(v01Payload),
  reservedRowsWritten: 13130,
  accountRowsWrittenBefore: 1000,
  accountRowsWrittenAfter: 5000,
  accountRowsReadAfter: 2000,
  accountDeltaRowsWrittenUpperBound: 4000,
  accountUsageKnownAfter: true,
  resultState: "RESULT_RECONCILED_ACCOUNT_DELTA",
  paidUpgradeAuthorized: false,
  system1FormalCoreChanged: false,
};
const resultId = "S2-D1-BUDGET:2026-10-09:legacy-run:RESULT";
function v01ResultRow(status = resultPayload.resultState) {
  return {
    check_id: resultId,
    check_type: "SYSTEM2_D1_ACCOUNT_BUDGET_RESULT_V0_1",
    expected_payload_json: expectedJson,
    observed_payload_json: JSON.stringify(resultPayload),
    status,
    check_hash: sha256(resultPayload),
    check_timestamp: "2026-10-09T02:10:00.000Z",
  };
}
const legacyPair = await readLedger([
  v01ReservationRow(),
  v01ResultRow(),
]);
assert.equal(legacyPair.integrityState, "VALID");
const legacyResultStatusTamper = await readLedger([
  v01ReservationRow(),
  v01ResultRow("TAMPERED"),
]);
assert.equal(legacyResultStatusTamper.integrityState, "INVALID");
assert.equal(
  legacyResultStatusTamper.integrityErrors[0].code,
  "LEDGER_LEGACY_HASH_CONTRACT_INVALID",
);

// Invalid legacy/current ledger still blocks a synthetically otherwise-authorized P0 writer.
const syntheticSystem1 = {
  reserveNumberAuthorized: true,
  authorizedReserveRows: 5000,
  readReserveNumberAuthorized: true,
  authorizedReadReserveRows: 5000,
  evidenceState: "SYNTHETIC_TEST_ONLY",
};
const attacked = await readLedger([v02Row({ legacy: true, status: "TAMPERED" })]);
const decision = evaluateD1AccountQuotaReservationV0_1({
  writer: shadow,
  eventName: "schedule",
  accountUsage: {
    known: true,
    quotaDay: "2026-10-09",
    rowsWritten: 1000,
    rowsRead: 1000,
    source: "SYNTHETIC",
  },
  ledgerIntegrityState: attacked.integrityState,
  outstandingReservedRowsWritten: attacked.outstandingReservedRowsWritten,
  outstandingReservedRowsRead: attacked.outstandingReservedRowsRead,
  system1ReservePolicy: syntheticSystem1,
});
assert.equal(decision.state, "QUOTA_BUDGET_DEFER");
assert.ok(decision.reasonCodes.includes("D1_QUOTA_LEDGER_INTEGRITY_INVALID"));

assert.match(source, /LEDGER_LEGACY_HASH_CONTRACT_INVALID/);
assert.match(source, /S2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1/);
assert.match(source, /S2_D1_ACCOUNT_QUOTA_BUDGET_V0_1/);

console.log("System2 CORR-003 A7 legacy hash identity tests passed");
