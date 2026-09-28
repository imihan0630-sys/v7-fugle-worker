import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  splitSqlStatements,
  classifyTargetResources,
  assertProvisionConfirmation,
  assertIsolatedDatabaseName,
} from "./d1_admin_core.mjs";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
const confirm = process.env.SYSTEM2_CONFIRM;
const runId = process.env.GITHUB_RUN_ID || "local";
const runAttempt = process.env.GITHUB_RUN_ATTEMPT || "1";

assert.ok(accountId, "CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(apiToken, "SYSTEM2_CLOUDFLARE_API_TOKEN is required");
assertProvisionConfirmation(confirm);

const databaseName = "system2-research";
assertIsolatedDatabaseName(databaseName);

const origin = "https://api.cloudflare.com/client/v4";
const headers = {
  authorization: `Bearer ${apiToken}`,
  accept: "application/json",
  "content-type": "application/json",
};

function digest(value) {
  return createHash("sha256").update(String(value)).digest("hex").slice(0, 12);
}

async function requestJson(url, { method = "GET", body } = {}) {
  const response = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(60000),
  });
  const text = await response.text();
  let data = null;
  try { data = JSON.parse(text); } catch {}
  if (!response.ok || data?.success === false) {
    const message = data?.errors?.[0]?.message || text;
    throw new Error(
      `${method} ${url.replace(accountId, "<account>")} HTTP ${response.status}: ${String(message).slice(0, 500)}`,
    );
  }
  return data;
}

async function cfAccount(path, options) {
  return requestJson(`${origin}/accounts/${accountId}${path}`, options);
}

async function d1Query(databaseId, sql, params = []) {
  const result = await cfAccount(`/d1/database/${databaseId}/query`, {
    method: "POST",
    body: { sql, params },
  });
  const rows = Array.isArray(result?.result) ? result.result : [];
  return rows.flatMap((x) => Array.isArray(x?.results) ? x.results : []);
}

const tokenVerify = await requestJson(`${origin}/accounts/${accountId}/tokens/verify`);
assert.equal(tokenVerify?.success, true, "dedicated System2 Cloudflare token is invalid");

const listed = await cfAccount("/d1/database?per_page=100");
const databases = Array.isArray(listed?.result) ? listed.result : [];
const classification = classifyTargetResources({ databases, workers: [] });

if (classification.state === "AMBIGUOUS_DUPLICATE_RESOURCE") {
  throw new Error("multiple system2-research D1 resources exist; refusing provisioning");
}

let database = classification.database || null;
let created = false;

if (!database) {
  const createdResponse = await cfAccount("/d1/database", {
    method: "POST",
    body: { name: databaseName },
  });
  database = createdResponse?.result;
  created = true;
}

const databaseId = database?.uuid || database?.id;
assert.ok(databaseId, "System2 D1 database ID missing after create/list");
assert.equal(database?.name, databaseName, "unexpected D1 database selected");

const migrationFiles = [
  "../sql/0001_research_core.sql",
  "../sql/0002_historical_store.sql",
  "../sql/0003_backtest_base_dataset.sql",
  "../sql/0004_historical_universe.sql",
  "../sql/0005_historical_packs.sql",
];
for (const migrationFile of migrationFiles) {
  const sqlText = await readFile(new URL(migrationFile, import.meta.url), "utf8");
  const statements = splitSqlStatements(sqlText);
  assert.ok(statements.length > 0, `System2 migration contains no statements: ${migrationFile}`);
  for (const statement of statements) {
    await d1Query(databaseId, statement);
  }
}

const tableRows = await d1Query(
  databaseId,
  "SELECT name FROM sqlite_schema WHERE type='table' AND name LIKE 's2_%' ORDER BY name",
);
const tables = tableRows.map((x) => x.name);
const requiredTables = [
  "s2_schema_meta",
  "s2_infrastructure_checks",
  "s2_decisions",
  "s2_shadow_runs",
  "s2_source_session_receipts",
  "s2_shadow_run_fingerprints",
  "s2_strategy_ordering_receipts",
  "s2_ranking_experiment_receipts",
  "s2_rank05_displacement_receipts",
  "s2_strategy_overlap_receipts",
  "s2_candidate_concentration_receipts",
  "s2_capacity_runs",
  "s2_candidate_lifecycle_receipts",
  "s2_candidate_reentry_receipts",
  "s2_historical_ingest_batches",
  "s2_historical_a1_bars",
  "s2_backtest_runs",
  "s2_backtest_checkpoints",
  "s2_historical_base_samples",
  "s2_historical_universe_memberships",
  "s2_historical_universe_snapshots",
  "s2_historical_a1_packs",
  "s2_historical_pack_ingest_receipts",
];
const missingTables = requiredTables.filter((name) => !tables.includes(name));
assert.deepEqual(missingTables, [], `missing System2 tables: ${missingTables.join(", ")}`);

const schemaRows = await d1Query(
  databaseId,
  "SELECT schema_value FROM s2_schema_meta WHERE schema_key = ? LIMIT 1",
  ["schema_version"],
);
assert.equal(schemaRows[0]?.schema_value, "0.9", "unexpected System2 schema version");

const now = new Date().toISOString();
const baseCheckId = `infra-${runId}-${runAttempt}`;
const sentinelPayload = {
  runId,
  runAttempt,
  bindingName: "SYSTEM2_DB",
  databaseName,
  schemaVersion: "0.9",
};
const sentinelHash = createHash("sha256")
  .update(JSON.stringify(sentinelPayload))
  .digest("hex");

await d1Query(
  databaseId,
  `INSERT INTO s2_infrastructure_checks (
    check_id, check_type, check_timestamp, environment, binding_name,
    schema_version, expected_payload_json, observed_payload_json,
    status, check_hash, notes
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    `${baseCheckId}-write`,
    "WRITE_SENTINEL",
    now,
    "ISOLATED_SYSTEM2_D1",
    "SYSTEM2_DB",
    "0.9",
    JSON.stringify(sentinelPayload),
    null,
    "EXPECTED",
    sentinelHash,
    "Created by guarded System2 isolated D1 provisioning workflow",
  ],
);

const sentinelRows = await d1Query(
  databaseId,
  "SELECT check_id, expected_payload_json, check_hash FROM s2_infrastructure_checks WHERE check_id = ? LIMIT 1",
  [`${baseCheckId}-write`],
);
assert.equal(sentinelRows.length, 1, "System2 D1 write/read sentinel not found");
assert.equal(sentinelRows[0].check_hash, sentinelHash, "System2 D1 readback hash mismatch");
assert.equal(
  sentinelRows[0].expected_payload_json,
  JSON.stringify(sentinelPayload),
  "System2 D1 readback payload mismatch",
);

const verifiedPayload = {
  sentinelCheckId: `${baseCheckId}-write`,
  sentinelHash,
  tableCount: tables.length,
  schemaVersion: schemaRows[0].schema_value,
};
const verifiedHash = createHash("sha256")
  .update(JSON.stringify(verifiedPayload))
  .digest("hex");

await d1Query(
  databaseId,
  `INSERT INTO s2_infrastructure_checks (
    check_id, check_type, check_timestamp, environment, binding_name,
    schema_version, expected_payload_json, observed_payload_json,
    status, check_hash, notes
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    `${baseCheckId}-verified`,
    "WRITE_READ_VERIFIED",
    new Date().toISOString(),
    "ISOLATED_SYSTEM2_D1",
    "SYSTEM2_DB",
    "0.9",
    JSON.stringify(sentinelPayload),
    JSON.stringify(verifiedPayload),
    "PASS",
    verifiedHash,
    "Readback verified after isolated schema application",
  ],
);

console.log(JSON.stringify({
  result: "PASS",
  databaseName,
  databaseIdDigest: digest(databaseId),
  created,
  reusedExisting: !created,
  schemaVersion: "0.9",
  tableCount: tables.length,
  requiredTablesPresent: true,
  writeReadVerification: "PASS",
  productionDatabaseUsed: false,
  productionWorkerChanged: false,
  productionCronChanged: false,
}, null, 2));
