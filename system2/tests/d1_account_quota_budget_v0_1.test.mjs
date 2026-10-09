import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import {
  D1_FREE_LIMITS,
  evaluateD1AccountQuotaReservationV0_1,
  resolveWriterReservationV0_1,
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
  quotaDay: "2026-10-08",
  rowsWritten,
  rowsRead,
  source: "TEST",
});

assert.equal(D1_FREE_LIMITS.rowsWrittenPerUtcDay, 100000);
assert.equal(D1_FREE_LIMITS.rowsReadPerUtcDay, 5000000);
assert.equal(D1_FREE_LIMITS.resetAtUtc, "00:00");
assert.equal(D1_FREE_LIMITS.scope, "ACCOUNT_WIDE");

const unknownUsage = evaluateD1AccountQuotaReservationV0_1({
  writer: byId.DAILY_SHADOW_DIAGNOSTIC,
  eventName: "schedule",
  accountUsage: { known: false, quotaDay: "2026-10-08" },
  system1ReservePolicy: authorizedReserve,
});
assert.equal(unknownUsage.state, "QUOTA_BUDGET_DEFER");
assert.ok(unknownUsage.reasonCodes.includes("ACCOUNT_WIDE_D1_USAGE_UNKNOWN"));

const unknownSystem1Reserve = evaluateD1AccountQuotaReservationV0_1({
  writer: byId.DAILY_SHADOW_DIAGNOSTIC,
  eventName: "schedule",
  accountUsage: usage(1000),
  system1ReservePolicy: unauthorizedReserve,
});
assert.equal(unknownSystem1Reserve.state, "QUOTA_BUDGET_DEFER");
assert.ok(unknownSystem1Reserve.reasonCodes.includes("SYSTEM1_AFTER_MARKET_RESERVE_NOT_AUTHORIZED"));
assert.equal(unknownSystem1Reserve.paidUpgradeAuthorized, false);

const p0 = evaluateD1AccountQuotaReservationV0_1({
  writer: byId.DAILY_SHADOW_DIAGNOSTIC,
  eventName: "schedule",
  accountUsage: usage(78368),
  system1ReservePolicy: authorizedReserve,
});
assert.equal(p0.state, "QUOTA_RESERVATION_GRANTED");
assert.equal(p0.physicalAllowed, true);
assert.equal(p0.requestedRowsWritten, 13130);
assert.equal(p0.projectedRowsWritten, 96506);

const p2Push = evaluateD1AccountQuotaReservationV0_1({
  writer: byId.RECENT_A1_WARMUP,
  eventName: "push",
  accountUsage: usage(0),
  system1ReservePolicy: authorizedReserve,
});
assert.equal(p2Push.state, "PUSH_READ_ONLY_ONLY");
assert.equal(p2Push.physicalAllowed, false);

const warmupAdaptive = evaluateD1AccountQuotaReservationV0_1({
  writer: byId.RECENT_A1_WARMUP,
  eventName: "schedule",
  accountUsage: usage(50000),
  system1ReservePolicy: authorizedReserve,
});
assert.equal(warmupAdaptive.state, "QUOTA_RESERVATION_GRANTED");
assert.equal(warmupAdaptive.adaptiveMaxDates, 2);
assert.equal(warmupAdaptive.requestedRowsWritten, 23152);
assert.equal(warmupAdaptive.projectedRowsWritten, 91290);

const measuredSameDay = evaluateD1AccountQuotaReservationV0_1({
  writer: byId.RECENT_A1_WARMUP,
  eventName: "schedule",
  accountUsage: usage(78368),
  system1ReservePolicy: authorizedReserve,
});
assert.equal(measuredSameDay.state, "QUOTA_BUDGET_DEFER");
assert.equal(measuredSameDay.adaptiveMaxDates, 0);
assert.ok(measuredSameDay.reasonCodes.includes("WRITER_RESERVATION_EXCEEDS_AVAILABLE_HEADROOM"));

const callerUnknown = resolveWriterReservationV0_1({
  writer: byId.HISTORICAL_CURRENT_YEAR_SEGMENT,
  requestedRowsWritten: null,
  requestedRowsRead: 0,
  availableRowsWrittenBeforeRequest: 50000,
});
assert.equal(callerUnknown.state, "RESERVATION_UNKNOWN");

const nearLimit = evaluateD1AccountQuotaReservationV0_1({
  writer: byId.HISTORICAL_ANNUAL_BACKFILL,
  eventName: "workflow_dispatch",
  accountUsage: usage(90000),
  system1ReservePolicy: authorizedReserve,
});
assert.equal(nearLimit.state, "QUOTA_BUDGET_DEFER");

const readOnly = evaluateD1AccountQuotaReservationV0_1({
  writer: byId.OCT08_FULL_SOURCE_HOT_D1_CENSUS,
  eventName: "workflow_dispatch",
  accountUsage: { known: false, quotaDay: "2026-10-08" },
  system1ReservePolicy: unauthorizedReserve,
});
assert.equal(readOnly.state, "READ_ONLY_ALLOWED");
assert.equal(readOnly.physicalAllowed, false);

// Registry completeness: every workflow sharing the isolated writer authority is explicitly classified.
const workflowsDir = new URL("../../.github/workflows/", import.meta.url);
const files = (await readdir(workflowsDir)).filter((name) => name.endsWith(".yml"));
const sharingAuthority = [];
for (const name of files) {
  const body = await readFile(new URL(name, workflowsDir), "utf8");
  if (/group:\s*system2-isolated-d1-writer/.test(body)) {
    sharingAuthority.push(`.github/workflows/${name}`);
  }
}
const registered = registry.writers.map((row) => row.workflow).sort();
assert.deepEqual([...sharingAuthority].sort(), registered, "all shared D1 authority workflows must be registered");

for (const row of registry.writers) {
  assert.ok(["P0", "P1", "P2", "P3", "READ_ONLY"].includes(row.priority));
  assert.equal(typeof row.physicalMutation, "boolean");
  assert.equal(typeof row.pushPhysicalAllowed, "boolean");
  if (row.physicalMutation) assert.notEqual(row.reservationModel?.type, "NONE");
  if (["P2", "P3"].includes(row.priority)) {
    assert.equal(row.pushPhysicalAllowed, false, `${row.id} must not physically mutate D1 on ordinary push`);
  }
}

console.log("System2 account-wide D1 quota budget tests passed");
