import { readFile, writeFile, appendFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import {
  D1_ACCOUNT_QUOTA_BUDGET_VERSION,
  D1_FREE_LIMITS,
  evaluateD1AccountQuotaReservationV0_1,
  utcQuotaDay,
} from "../runtime/d1_account_quota_budget_v0_1.mjs";

const REGISTRY_PATH = new URL("../config/d1_account_writer_registry_v0_1.json", import.meta.url);
const DEFAULT_RESERVE_POLICY_PATH = new URL(
  "../evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json",
  import.meta.url,
);

function env(name, fallback = "") {
  const value = process.env[name];
  return value === undefined || value === null || value === "" ? fallback : value;
}
function required(name) {
  const value = env(name);
  if (!value) throw new Error(`${name} is required`);
  return value;
}
function integerEnv(name, fallback = null) {
  const value = env(name);
  if (!value) return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) throw new Error(`${name} must be a non-negative integer`);
  return n;
}
function sha256(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
async function loadJson(pathOrUrl) {
  return JSON.parse(await readFile(pathOrUrl, "utf8"));
}
async function setOutput(key, value) {
  const target = env("GITHUB_OUTPUT");
  if (!target) return;
  await appendFile(target, `${key}=${String(value)}\n`);
}
async function appendSummary(text) {
  const target = env("GITHUB_STEP_SUMMARY");
  if (!target) return;
  await appendFile(target, text + "\n");
}
function quotaDayBounds(day) {
  return {
    start: `${day}T00:00:00.000Z`,
    end: `${day}T23:59:59.999Z`,
  };
}

async function queryAccountUsage({ accountId, token, quotaDay, fetchImpl = globalThis.fetch }) {
  const query = `query D1Daily($accountTag: String!, $start: Date!, $end: Date!) {
    viewer {
      accounts(filter: { accountTag: $accountTag }) {
        d1AnalyticsAdaptiveGroups(
          limit: 10000,
          filter: { date_geq: $start, date_leq: $end },
          orderBy: [date_ASC]
        ) {
          sum { rowsRead rowsWritten readQueries writeQueries }
          dimensions { date databaseId }
        }
      }
    }
  }`;
  const response = await fetchImpl("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { accountTag: accountId, start: quotaDay, end: quotaDay },
    }),
    signal: AbortSignal.timeout(30000),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.errors?.length) {
    return Object.freeze({
      known: false,
      quotaDay,
      rowsWritten: null,
      rowsRead: null,
      error: payload?.errors?.[0]?.message || `HTTP_${response.status}`,
    });
  }
  const groups = payload?.data?.viewer?.accounts?.[0]?.d1AnalyticsAdaptiveGroups;
  if (!Array.isArray(groups)) {
    return Object.freeze({
      known: false,
      quotaDay,
      rowsWritten: null,
      rowsRead: null,
      error: "D1_ANALYTICS_GROUPS_MISSING",
    });
  }
  const rowsWritten = groups.reduce((sum, row) => sum + Number(row?.sum?.rowsWritten || 0), 0);
  const rowsRead = groups.reduce((sum, row) => sum + Number(row?.sum?.rowsRead || 0), 0);
  return Object.freeze({
    known: true,
    quotaDay,
    rowsWritten,
    rowsRead,
    databaseGroupCount: groups.length,
    source: "CLOUDFLARE_D1_GRAPHQL_ACCOUNT_ANALYTICS",
  });
}

async function loadQuotaLedger(db, quotaDay) {
  const { start, end } = quotaDayBounds(quotaDay);
  const rows = await db.rawQuery(
    `SELECT check_type, observed_payload_json, check_timestamp
       FROM s2_infrastructure_checks
      WHERE check_timestamp >= ? AND check_timestamp <= ?
        AND check_type IN (
          'SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1',
          'SYSTEM2_D1_ACCOUNT_BUDGET_RESULT_V0_1'
        )
      ORDER BY check_timestamp`,
    [start, end],
  );
  const reservations = new Map();
  const completed = new Set();
  let maxObservedRowsWrittenAfter = 0;
  for (const row of rows) {
    let payload = null;
    try { payload = JSON.parse(row.observed_payload_json); } catch {}
    if (!payload?.runKey) continue;
    if (row.check_type === "SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1") {
      reservations.set(payload.runKey, payload);
    } else {
      completed.add(payload.runKey);
      if (Number.isFinite(Number(payload.accountRowsWrittenAfter))) {
        maxObservedRowsWrittenAfter = Math.max(
          maxObservedRowsWrittenAfter,
          Number(payload.accountRowsWrittenAfter),
        );
      }
    }
  }
  const outstanding = [...reservations.entries()]
    .filter(([key]) => !completed.has(key))
    .reduce((sum, [, payload]) => sum + Number(payload.requestedRowsWritten || 0), 0);
  return Object.freeze({
    outstandingReservedRowsWritten: outstanding,
    reservationCount: reservations.size,
    completedCount: completed.size,
    maxObservedRowsWrittenAfter,
  });
}

async function persistLedgerReceipt(db, { checkType, checkId, at, payload, status }) {
  const checkHash = sha256(payload);
  const result = await db.prepare(
    `INSERT OR IGNORE INTO s2_infrastructure_checks (
       check_id, check_type, check_timestamp, environment, binding_name,
       schema_version, expected_payload_json, observed_payload_json,
       status, check_hash, notes
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    checkId,
    checkType,
    at,
    "system2-research",
    "SYSTEM2_DB",
    "1.1",
    JSON.stringify({
      directiveId: "S2-CORR-20261007-003",
      accountWide: true,
      paidUpgradeAuthorized: false,
    }),
    JSON.stringify(payload),
    status,
    checkHash,
    "Compact account-level D1 Free quota reservation/result receipt; no trading authority.",
  ).run();
  if (result?.success === false) throw new Error("quota ledger receipt write failed");
  return Object.freeze({ checkHash });
}

async function main() {
  const mode = env("SYSTEM2_D1_GATE_MODE", "reserve");
  if (!["reserve", "result"].includes(mode)) throw new Error("SYSTEM2_D1_GATE_MODE must be reserve or result");

  const accountId = required("CLOUDFLARE_ACCOUNT_ID");
  const token = env("CLOUDFLARE_API_TOKEN") || required("SYSTEM2_CLOUDFLARE_API_TOKEN");
  const writerId = required("SYSTEM2_D1_WRITER_ID");
  const eventName = env("GITHUB_EVENT_NAME", "workflow_dispatch");
  const runKey = env(
    "SYSTEM2_D1_RUN_KEY",
    `${env("GITHUB_RUN_ID", "local")}:${env("GITHUB_RUN_ATTEMPT", "1")}:${writerId}`,
  );
  const quotaDay = utcQuotaDay(new Date());
  const registry = await loadJson(REGISTRY_PATH);
  const writer = registry.writers.find((row) => row.id === writerId);
  if (!writer) throw new Error(`UNREGISTERED_D1_WRITER:${writerId}`);

  const reservePolicyPath = env("SYSTEM2_SYSTEM1_RESERVE_EVIDENCE_PATH");
  const system1ReservePolicy = await loadJson(
    reservePolicyPath ? new URL(`../../${reservePolicyPath.replace(/^\.\//, "")}`, import.meta.url) : DEFAULT_RESERVE_POLICY_PATH,
  );

  if (mode === "reserve" && (
    writer.physicalMutation === false
    || (eventName === "push" && writer.pushPhysicalAllowed !== true)
  )) {
    const decision = evaluateD1AccountQuotaReservationV0_1({
      writer,
      eventName,
      accountUsage: { known: false, quotaDay },
      system1ReservePolicy,
    });
    const out = Object.freeze({
      schemaVersion: "S2_D1_ACCOUNT_BUDGET_GATE_RECEIPT_V0_1",
      budgetVersion: D1_ACCOUNT_QUOTA_BUDGET_VERSION,
      directiveId: "S2-CORR-20261007-003",
      writerId,
      writerClass: writer.writerClass,
      priority: writer.priority,
      eventName,
      runKey,
      quotaDay,
      ...decision,
      accountUsage: { known: false, quotaDay, source: "NOT_QUERIED_NON_MUTATING_PATH" },
      ledger: null,
      system1ReserveEvidenceState: system1ReservePolicy.evidenceState,
      system1ReserveAuthorized: system1ReservePolicy.reserveNumberAuthorized === true,
      ledgerCheckHash: null,
      paidUpgradeAuthorized: false,
      system1FormalCoreChanged: false,
    });
    const outputPath = env("SYSTEM2_D1_GATE_OUTPUT", "/tmp/system2-d1-budget-reservation.json");
    await writeFile(outputPath, JSON.stringify(out, null, 2) + "\n");
    await setOutput("physical_allowed", "false");
    await setOutput("state", out.state);
    await setOutput("adaptive_max_dates", out.adaptiveMaxDates ?? "");
    await setOutput("reservation_receipt_path", outputPath);
    await appendSummary(
      `D1 account quota gate: ${writerId} — ${out.state}; no Cloudflare D1 call performed on this non-mutating path.`,
    );
    console.log(JSON.stringify(out, null, 2));
    return;
  }

  const db = await createRemoteD1RestAdapter({
    accountId,
    apiToken: env("SYSTEM2_CLOUDFLARE_API_TOKEN") || token,
    databaseName: "system2-research",
  });

  if (mode === "result") {
    const reservationPath = required("SYSTEM2_D1_RESERVATION_RECEIPT_PATH");
    const reservation = await loadJson(reservationPath);
    if (reservation.runKey !== runKey || reservation.writerId !== writerId) {
      throw new Error("reservation receipt identity mismatch");
    }
    const after = await queryAccountUsage({ accountId, token, quotaDay });
    const at = new Date().toISOString();
    const payload = Object.freeze({
      schemaVersion: "S2_D1_ACCOUNT_BUDGET_RESULT_V0_1",
      budgetVersion: D1_ACCOUNT_QUOTA_BUDGET_VERSION,
      directiveId: "S2-CORR-20261007-003",
      runKey,
      writerId,
      writerClass: writer.writerClass,
      priority: writer.priority,
      quotaDay,
      reservationCheckHash: reservation.ledgerCheckHash || null,
      reservedRowsWritten: reservation.requestedRowsWritten,
      accountRowsWrittenBefore: reservation.rowsWrittenUsed,
      accountRowsWrittenAfter: after.known ? after.rowsWritten : null,
      accountRowsReadAfter: after.known ? after.rowsRead : null,
      accountDeltaRowsWrittenUpperBound:
        after.known && Number.isFinite(Number(reservation.rowsWrittenUsed))
          ? Math.max(0, after.rowsWritten - Number(reservation.rowsWrittenUsed))
          : null,
      accountUsageKnownAfter: after.known,
      resultState: after.known ? "RESULT_RECONCILED_ACCOUNT_DELTA" : "RESULT_ACCOUNT_USAGE_UNKNOWN",
      paidUpgradeAuthorized: false,
      system1FormalCoreChanged: false,
    });
    const persisted = await persistLedgerReceipt(db, {
      checkType: "SYSTEM2_D1_ACCOUNT_BUDGET_RESULT_V0_1",
      checkId: `S2-D1-BUDGET:${quotaDay}:${runKey}:RESULT`,
      at,
      payload,
      status: payload.resultState,
    });
    const out = { ...payload, ledgerCheckHash: persisted.checkHash };
    const outputPath = env("SYSTEM2_D1_GATE_OUTPUT", "/tmp/system2-d1-budget-result.json");
    await writeFile(outputPath, JSON.stringify(out, null, 2) + "\n");
    await appendSummary(
      `D1 quota result: ${writerId} — ${payload.resultState}; account rowsWritten after: ${payload.accountRowsWrittenAfter ?? "UNKNOWN"}.`,
    );
    console.log(JSON.stringify(out, null, 2));
    return;
  }

  const usage = await queryAccountUsage({ accountId, token, quotaDay });
  const ledger = await loadQuotaLedger(db, quotaDay);
  const accountUsage = usage.known
    ? Object.freeze({
      ...usage,
      rowsWritten: Math.max(usage.rowsWritten, ledger.maxObservedRowsWrittenAfter),
    })
    : usage;
  const decision = evaluateD1AccountQuotaReservationV0_1({
    writer,
    eventName,
    accountUsage,
    system1ReservePolicy,
    outstandingReservedRowsWritten: ledger.outstandingReservedRowsWritten,
    protectedDailyShadowReserveRows: integerEnv("SYSTEM2_D1_DAILY_SHADOW_RESERVE_ROWS", 13130),
    launchAcceptanceReserveRows: integerEnv("SYSTEM2_D1_LAUNCH_ACCEPTANCE_RESERVE_ROWS", 0),
    requestedRowsWritten: integerEnv("SYSTEM2_D1_REQUESTED_ROWS_WRITTEN", null),
    requestedRowsRead: integerEnv("SYSTEM2_D1_REQUESTED_ROWS_READ", 0),
  });

  const at = new Date().toISOString();
  let ledgerCheckHash = null;
  if (decision.physicalAllowed === true) {
    const payload = Object.freeze({
      schemaVersion: "S2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",
      budgetVersion: D1_ACCOUNT_QUOTA_BUDGET_VERSION,
      directiveId: "S2-CORR-20261007-003",
      runKey,
      writerId,
      writerClass: writer.writerClass,
      priority: writer.priority,
      eventName,
      quotaDay,
      requestedRowsWritten: decision.requestedRowsWritten,
      requestedRowsRead: decision.requestedRowsRead,
      adaptiveMaxDates: decision.adaptiveMaxDates,
      rowsWrittenUsed: decision.rowsWrittenUsed,
      rowsReadUsed: decision.rowsReadUsed,
      projectedRowsWritten: decision.projectedRowsWritten,
      projectedRowsRead: decision.projectedRowsRead,
      system1ReserveRows: decision.system1ReserveRows,
      protectedDailyShadowReserveRows: decision.protectedDailyShadowReserveRows,
      launchAcceptanceReserveRows: decision.launchAcceptanceReserveRows,
      outstandingReservedRowsWritten: decision.outstandingReservedRowsWritten,
      rowsWrittenLimit: D1_FREE_LIMITS.rowsWrittenPerUtcDay,
      rowsReadLimit: D1_FREE_LIMITS.rowsReadPerUtcDay,
      resetAtUtc: D1_FREE_LIMITS.resetAtUtc,
      accountUsageSource: accountUsage.source,
      system1ReserveEvidenceState: system1ReservePolicy.evidenceState,
      system1ReserveEvidencePath: reservePolicyPath || "system2/evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json",
      paidUpgradeAuthorized: false,
      system1FormalCoreChanged: false,
    });
    const persisted = await persistLedgerReceipt(db, {
      checkType: "SYSTEM2_D1_ACCOUNT_BUDGET_RESERVATION_V0_1",
      checkId: `S2-D1-BUDGET:${quotaDay}:${runKey}:RESERVATION`,
      at,
      payload,
      status: "QUOTA_RESERVATION_GRANTED",
    });
    ledgerCheckHash = persisted.checkHash;
  }

  const out = Object.freeze({
    schemaVersion: "S2_D1_ACCOUNT_BUDGET_GATE_RECEIPT_V0_1",
    budgetVersion: D1_ACCOUNT_QUOTA_BUDGET_VERSION,
    directiveId: "S2-CORR-20261007-003",
    writerId,
    writerClass: writer.writerClass,
    priority: writer.priority,
    eventName,
    runKey,
    quotaDay,
    ...decision,
    accountUsage,
    ledger,
    system1ReserveEvidenceState: system1ReservePolicy.evidenceState,
    system1ReserveAuthorized: system1ReservePolicy.reserveNumberAuthorized === true,
    ledgerCheckHash,
    paidUpgradeAuthorized: false,
    system1FormalCoreChanged: false,
  });
  const outputPath = env("SYSTEM2_D1_GATE_OUTPUT", "/tmp/system2-d1-budget-reservation.json");
  await writeFile(outputPath, JSON.stringify(out, null, 2) + "\n");

  await setOutput("physical_allowed", out.physicalAllowed ? "true" : "false");
  await setOutput("state", out.state);
  await setOutput("adaptive_max_dates", out.adaptiveMaxDates ?? "");
  await setOutput("reservation_receipt_path", outputPath);
  await appendSummary(
    `D1 account quota gate: ${writerId} — ${out.state}; physicalAllowed=${out.physicalAllowed}; quotaDay=${quotaDay}; account rowsWritten=${accountUsage.known ? accountUsage.rowsWritten : "UNKNOWN"}; System1 reserve=${out.system1ReserveAuthorized ? system1ReservePolicy.authorizedReserveRows : "UNAUTHORIZED/UNKNOWN"}.`,
  );
  console.log(JSON.stringify(out, null, 2));
}

main().catch(async (error) => {
  const payload = {
    schemaVersion: "S2_D1_ACCOUNT_BUDGET_GATE_ERROR_V0_1",
    state: "QUOTA_BUDGET_DEFER",
    physicalAllowed: false,
    error: String(error?.message || error),
    paidUpgradeAuthorized: false,
  };
  const outputPath = env("SYSTEM2_D1_GATE_OUTPUT", "/tmp/system2-d1-budget-reservation.json");
  await writeFile(outputPath, JSON.stringify(payload, null, 2) + "\n").catch(() => {});
  await setOutput("physical_allowed", "false").catch(() => {});
  await setOutput("state", "QUOTA_BUDGET_DEFER").catch(() => {});
  console.error(JSON.stringify(payload, null, 2));
  process.exitCode = 1;
});
