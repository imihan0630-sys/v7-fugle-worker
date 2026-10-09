import assert from "node:assert/strict";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
const schemaMutationAllowed = process.env.SYSTEM2_D1_SCHEMA_MUTATION_ALLOWED !== "false";

assert.ok(accountId, "CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(apiToken, "SYSTEM2_CLOUDFLARE_API_TOKEN is required");

const origin = "https://api.cloudflare.com/client/v4";
const headers = {
  authorization: `Bearer ${apiToken}`,
  accept: "application/json",
  "content-type": "application/json",
};

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
  "s2_historical_a1_pack_manifests",
  "s2_historical_cold_backfill_checkpoints",
  "s2_historical_cold_ingest_receipts",
  "s2_historical_universe_registry_receipts",
  "s2_historical_a1_revision_links",
  "s2_historical_revision_receipts",
  "s2_historical_a1_segment_manifests",
  "s2_historical_segment_backfill_checkpoints",
  "s2_historical_segment_ingest_receipts",
  "s2_resonance_watch_pools",
  "s2_resonance_session_cache",
  "s2_resonance_runs",
  "s2_resonance_snapshots",
  "s2_resonance_latest",
  "s2_resonance_episodes",
  "s2_resonance_episode_events",
];

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
      `${method} ${url.replace(accountId, "<account>")} HTTP ${response.status}: ${String(message).slice(0,500)}`,
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

const tokenVerify = await fetch(
  `${origin}/accounts/${accountId}/tokens/verify`,
  { headers, signal: AbortSignal.timeout(60000) },
);
assert.equal(tokenVerify.ok, true, "dedicated System2 Cloudflare token verify failed");

const listed = await cfAccount("/d1/database?per_page=100");
const databases = Array.isArray(listed?.result) ? listed.result : [];
const matches = databases.filter((x) => x?.name === "system2-research");
if (matches.length !== 1) {
  console.log(JSON.stringify({
    result: "PROVISION_REQUIRED",
    reason: matches.length === 0 ? "DATABASE_MISSING" : "AMBIGUOUS_DUPLICATE_RESOURCE",
    databaseCount: matches.length,
    schemaMutationPerformed: false,
  }));
  if (!schemaMutationAllowed) {
    throw new Error("D1_SCHEMA_MUTATION_REQUIRES_QUOTA_RESERVATION");
  }
  await import("./provision_system2_d1.mjs");
} else {
  const databaseId = matches[0].uuid || matches[0].id;
  const tableRows = await d1Query(
    databaseId,
    "SELECT name FROM sqlite_schema WHERE type='table' AND name LIKE 's2_%' ORDER BY name",
  );
  const tables = tableRows.map((x) => x.name);
  const missingTables = requiredTables.filter((name) => !tables.includes(name));
  let schemaVersion = null;
  if (tables.includes("s2_schema_meta")) {
    const rows = await d1Query(
      databaseId,
      "SELECT schema_value FROM s2_schema_meta WHERE schema_key = ? LIMIT 1",
      ["schema_version"],
    );
    schemaVersion = rows[0]?.schema_value || null;
  }

  if (schemaVersion === "1.1" && missingTables.length === 0) {
    console.log(JSON.stringify({
      result: "PASS",
      mode: "READ_ONLY_FAST_PATH",
      databaseName: "system2-research",
      schemaVersion,
      tableCount: tables.length,
      requiredTablesPresent: true,
      schemaMutationPerformed: false,
      writeReadVerification: "SKIPPED_ALREADY_READY",
      productionDatabaseUsed: false,
      productionWorkerChanged: false,
      productionCronChanged: false,
    }, null, 2));
  } else {
    console.log(JSON.stringify({
      result: "PROVISION_REQUIRED",
      reason: "SCHEMA_NOT_READY",
      schemaVersion,
      missingTables,
      schemaMutationPerformed: false,
    }, null, 2));
    if (!schemaMutationAllowed) {
      throw new Error("D1_SCHEMA_MUTATION_REQUIRES_QUOTA_RESERVATION");
    }
    await import("./provision_system2_d1.mjs");
  }
}
