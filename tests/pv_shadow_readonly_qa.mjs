import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const adminToken = process.env.V7_ADMIN_TOKEN;
const scriptName = "fugle-test";
const origin = "https://fugle-test.imihan0630.workers.dev";
const cfOrigin = "https://api.cloudflare.com/client/v4";

assert.ok(accountId, "Missing CLOUDFLARE_ACCOUNT_ID");
assert.ok(apiToken, "Missing CLOUDFLARE_API_TOKEN");
assert.ok(adminToken, "Missing V7_ADMIN_TOKEN");

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonicalize(value[key])]));
  }
  return value === undefined ? null : value;
}

function hash(value) {
  return createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(canonicalize(value))).digest("hex");
}

function taipeiParts(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).formatToParts(now).map(part => [part.type, part.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}

async function jsonFetch(url, options = {}, label = url) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(45000) });
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { data = null; }
  if (!response.ok) throw new Error(`${label} HTTP ${response.status}: ${String(data?.errors?.[0]?.message || text).slice(0, 300)}`);
  return data;
}

const cfHeaders = { authorization: `Bearer ${apiToken}`, accept: "application/json" };
const adminHeaders = { "x-admin-token": adminToken, accept: "application/json", "cache-control": "no-cache" };

async function cfGet(path, label) {
  const data = await jsonFetch(`${cfOrigin}/accounts/${accountId}${path}`, { headers: cfHeaders }, label);
  assert.equal(data?.success, true, `${label} success != true`);
  return data.result;
}

async function adminGet(path) {
  return jsonFetch(`${origin}${path}`, { headers: adminHeaders }, path);
}

function findBinding(bindings, name) {
  return (Array.isArray(bindings) ? bindings : []).find(binding => binding?.name === name);
}

function plainTextBindingValue(binding) {
  for (const key of ["text", "value"]) {
    if (typeof binding?.[key] === "string") return binding[key];
  }
  return null;
}

const [{ date: taipeiDate, time: taipeiTime }, runtime, settings, activeContent, config, scan, cron, live] = await Promise.all([
  Promise.resolve(taipeiParts()),
  jsonFetch(`${origin}/api/version?pvQa=${Date.now()}`, { headers: { accept: "application/json", "cache-control": "no-cache" } }, "runtime"),
  cfGet(`/workers/scripts/${scriptName}/settings`, "Worker settings"),
  fetch(`${cfOrigin}/accounts/${accountId}/workers/scripts/${scriptName}/content/v2`, { headers: cfHeaders, signal: AbortSignal.timeout(45000) }).then(async response => {
    assert.equal(response.ok, true, `Active Worker content HTTP ${response.status}`);
    return response.text();
  }),
  adminGet("/api/config?pvQa=1"),
  adminGet("/api/scan/status?pvQa=1"),
  adminGet("/api/cron/status?pvQa=1"),
  adminGet("/api/live?pvQa=1")
]);

assert.match(String(runtime?.version || ""), /^8\.11\.0-pv-shadow-v0\.1-log-only$/, "Unexpected deployed runtime");

const bindings = settings?.bindings || [];
const pvBinding = findBinding(bindings, "PV_SHADOW_ENABLED");
const pvValue = plainTextBindingValue(pvBinding);
const pvEnabled = String(pvValue || "").toLowerCase() === "true";
assert.equal(pvEnabled, true, "PV_SHADOW_ENABLED is not true in deployed Worker settings");

const d1Binding = findBinding(bindings, "V7_DB");
const databaseId = d1Binding?.id || d1Binding?.database_id;
assert.ok(databaseId, "V7_DB database id is missing from Worker settings");

async function d1Select(sql, params = []) {
  assert.match(sql, /^\s*(SELECT|WITH|PRAGMA)\b/i, "Only read-only SQL is allowed");
  assert.ok(!/\b(INSERT|UPDATE|DELETE|REPLACE|CREATE|DROP|ALTER|VACUUM|ATTACH|DETACH)\b/i.test(sql), "Mutating SQL rejected");
  const body = await jsonFetch(`${cfOrigin}/accounts/${accountId}/d1/database/${databaseId}/query`, {
    method: "POST",
    headers: { ...cfHeaders, "content-type": "application/json" },
    body: JSON.stringify({ sql, params })
  }, "D1 SELECT");
  assert.equal(body?.success, true, "D1 API success != true");
  const result = body?.result?.[0];
  assert.equal(result?.success, true, "D1 SELECT failed");
  assert.equal(Number(result?.meta?.rows_written || 0), 0, "Read-only D1 query wrote rows");
  assert.notEqual(result?.meta?.changed_db, true, "Read-only D1 query changed the database");
  return result?.results || [];
}

const tableRows = await d1Select(`SELECT name FROM sqlite_schema WHERE type='table' AND name IN ('v7_pv_shadow_snapshots','v7_pv_outcomes','v7_pv_intraday_baselines','v7_cron_runs','v7_live_state') ORDER BY name`);
const tables = new Set(tableRows.map(row => row.name));
for (const table of ["v7_pv_shadow_snapshots", "v7_pv_outcomes", "v7_pv_intraday_baselines", "v7_cron_runs", "v7_live_state"]) {
  assert.ok(tables.has(table), `Missing D1 table ${table}`);
}

const [baselines, snapshotSummary, duplicateSummary, snapshots, outcomes, recentCrons] = await Promise.all([
  d1Select(`SELECT symbol,schema_version,valid_sessions,last_market_date,corporate_action_reset_at,updated_at FROM v7_pv_intraday_baselines ORDER BY symbol`),
  d1Select(`SELECT market_date,observation_type,COUNT(*) AS row_count,COUNT(DISTINCT symbol) AS symbol_count,SUM(CASE WHEN decision_impact<>0 THEN 1 ELSE 0 END) AS nonzero_decision_impact,MIN(created_at) AS first_created_at,MAX(created_at) AS last_created_at FROM v7_pv_shadow_snapshots GROUP BY market_date,observation_type ORDER BY market_date,observation_type`),
  d1Select(`SELECT COUNT(*) AS duplicate_groups,COALESCE(SUM(row_count-1),0) AS duplicate_rows FROM (SELECT symbol,observed_at,observation_type,COUNT(*) AS row_count FROM v7_pv_shadow_snapshots GROUP BY symbol,observed_at,observation_type HAVING COUNT(*)>1)`),
  d1Select(`SELECT snapshot_id,symbol,market_date,observed_at,observation_type,schema_version,event_key,features_json,context_json,coverage_json,source_json,decision_impact FROM v7_pv_shadow_snapshots ORDER BY created_at DESC LIMIT 1000`),
  d1Select(`SELECT snapshot_id,horizon,direction_return,mfe,mae,range_atr,stop_first,false_break,acceptance_result,outcome_complete,outcome_json FROM v7_pv_outcomes ORDER BY completed_at DESC LIMIT 2000`),
  d1Select(`SELECT id,cron_expression,scheduled_at,started_at,finished_at,job_type,status,skipped,fugle_calls,error FROM v7_cron_runs ORDER BY id DESC LIMIT 40`)
]);

const snapshotFingerprintMismatches = [];
const guardCounts = {};
for (const row of snapshots) {
  const features = JSON.parse(row.features_json || "{}");
  const context = JSON.parse(row.context_json || "{}");
  const coverage = JSON.parse(row.coverage_json || "{}");
  const source = JSON.parse(row.source_json || "{}");
  const storedFingerprint = source.semanticFingerprint || null;
  delete source.semanticFingerprint;
  const calculated = hash({
    snapshotId: row.snapshot_id, schemaVersion: row.schema_version, symbol: row.symbol,
    marketDate: row.market_date, observedAt: row.observed_at, observationType: row.observation_type,
    eventKey: row.event_key, features, context, coverage, source, decisionImpact: false
  });
  if (storedFingerprint !== calculated) snapshotFingerprintMismatches.push(row.snapshot_id);
  const guard = String(features.pvGuardState || "UNKNOWN");
  guardCounts[guard] = (guardCounts[guard] || 0) + 1;
}

const outcomeFingerprintMismatches = [];
for (const row of outcomes) {
  const recorded = JSON.parse(row.outcome_json || "{}");
  const calculated = hash({
    snapshotId: row.snapshot_id, horizon: row.horizon, directionReturn: row.direction_return,
    mfe: row.mfe, mae: row.mae, rangeAtr: row.range_atr, stopFirst: row.stop_first,
    falseBreak: row.false_break, acceptanceResult: row.acceptance_result,
    outcomeComplete: row.outcome_complete
  });
  if (recorded.semanticFingerprint !== calculated) outcomeFingerprintMismatches.push(`${row.snapshot_id}:${row.horizon}`);
  assert.equal(recorded.decisionImpact, false, "PV outcome decisionImpact is not false");
}

assert.equal(Number(duplicateSummary?.[0]?.duplicate_rows || 0), 0, "Persisted PV duplicate semantic rows found");
assert.equal(snapshotSummary.reduce((sum, row) => sum + Number(row.nonzero_decision_impact || 0), 0), 0, "PV snapshot decisionImpact is not zero");
assert.deepEqual(snapshotFingerprintMismatches, [], "PV snapshot semantic fingerprint mismatch");
assert.deepEqual(outcomeFingerprintMismatches, [], "PV outcome semantic fingerprint mismatch");
for (const row of baselines) {
  assert.equal(row.schema_version, "PV_SHADOW_V0_1");
  assert.ok(Number(row.valid_sessions) >= 20, `Baseline below 20 sessions: ${row.symbol}`);
  assert.ok(!row.last_market_date || row.last_market_date < taipeiDate, `Baseline leaked current/future session: ${row.symbol}`);
}

const helperStart = activeContent.indexOf("function pvShadowEnabled");
const helperEnd = activeContent.indexOf("async function analyzeStockSmart", helperStart);
assert.ok(helperStart >= 0 && helperEnd > helperStart, "PV helper layer missing from active Worker");
const pvHelperSource = activeContent.slice(helperStart, helperEnd);
const ordinaryLiveCandleCallsAdded = (pvHelperSource.match(/fetchCandles\(/g) || []).length;
assert.equal(ordinaryLiveCandleCallsAdded, 0, "PV helper added ordinary live candle calls");
const formalHook = activeContent.indexOf("const executionResearchRecorder = await recordProspectiveExecutionShadow");
const pvHook = activeContent.indexOf("const pvShadow = await recordPvIntradayShadowSafe", formalHook);
assert.ok(formalHook >= 0 && pvHook > formalHook, "PV intraday hook is not after Formal persistence");

const formalConfigFingerprint = hash({
  updatedAt: config.updatedAt || null,
  totalCapital: config.totalCapital || null,
  stocks: (config.stocks || []).map(stock => ({
    symbol: stock.symbol, strategyPool: stock.strategyPool || null, channel: stock.channel || null,
    buyLow: stock.buyLow ?? null, buyHigh: stock.buyHigh ?? null, breakout: stock.breakout ?? null,
    maxChase: stock.maxChase ?? null, stop: stock.stop ?? null, profitCheck: stock.profitCheck ?? null,
    totalAllocation: stock.totalAllocation ?? null, positionStage: stock.positionStage ?? null
  })).sort((a, b) => String(a.symbol).localeCompare(String(b.symbol)))
});

const formalScan = structuredClone(scan);
delete formalScan.pvShadow;
const formalScanFingerprint = hash({
  scanDate: formalScan.scanDate || null, generatedAt: formalScan.generatedAt || null,
  selectedCount: formalScan.selectedCount ?? null, totalCapital: formalScan.totalCapital ?? null,
  stocks: formalScan.stocks || [], pipeline: formalScan.pipeline || null, config: formalScan.config || null
});

const liveFormal = structuredClone(live);
delete liveFormal.pvShadow;
for (const result of liveFormal.results || []) delete result.pvShadow;
const liveFormalFingerprint = hash({ tradeDate: liveFormal.tradeDate || null, results: liveFormal.results || [] });

const pvScan = scan?.pvShadow || null;
const afterMarketWindow = taipeiTime >= "23:45";
if (afterMarketWindow) {
  assert.equal(scan.scanDate, taipeiDate, "23:35 after-market scan is not from today");
  assert.equal(pvScan?.enabled, true, "After-market PV Shadow did not run enabled");
  assert.equal(pvScan?.decisionImpact, false);
  assert.equal(pvScan?.formalCoreImpact, false);
  assert.equal(pvScan?.bootstrap?.ok, true, "PV baseline bootstrap failed");
  assert.equal(pvScan?.daily?.decisionImpact, false);
  const dailyDetails = pvScan?.daily?.details || [];
  assert.equal(dailyDetails.filter(item => item?.save?.mutationConflict).length, 0, "PV daily mutation conflict reported");
  assert.equal(pvScan?.daily?.zeroPvPushes, true);
  assert.equal(pvScan?.daily?.zeroPvActions, true);
  const requested = Number(pvScan?.bootstrap?.requested || 0);
  assert.ok(baselines.length >= requested, "D1 baseline rows are fewer than requested Formal symbols");
}

const report = {
  schemaVersion: "PV_SHADOW_CLASS_A_READONLY_QA_V1",
  generatedAt: new Date().toISOString(),
  taipeiDate,
  taipeiTime,
  afterMarketWindow,
  readOnly: true,
  runtime: {
    version: runtime.version,
    activeContentSha256: hash(activeContent),
    pvShadowEnabled: pvEnabled,
    pvBindingType: pvBinding?.type || null,
    d1BindingPresent: Boolean(databaseId)
  },
  formalIsolation: {
    decisionImpact: pvScan?.decisionImpact ?? false,
    formalCoreImpact: pvScan?.formalCoreImpact ?? false,
    configFingerprint: formalConfigFingerprint,
    scanFingerprintWithoutPv: formalScanFingerprint,
    liveFingerprintWithoutPv: liveFormalFingerprint,
    activeSourceHookAfterFormal: true,
    zeroPvPushes: pvScan?.daily?.zeroPvPushes ?? null,
    zeroPvActions: pvScan?.daily?.zeroPvActions ?? null
  },
  baseline: {
    rowCount: baselines.length,
    readyCount: baselines.filter(row => Number(row.valid_sessions) >= 20).length,
    minimumSessions: baselines.length ? Math.min(...baselines.map(row => Number(row.valid_sessions))) : null,
    maximumSessions: baselines.length ? Math.max(...baselines.map(row => Number(row.valid_sessions))) : null,
    symbols: baselines.map(row => ({ symbol: row.symbol, validSessions: Number(row.valid_sessions), lastMarketDate: row.last_market_date, updatedAt: row.updated_at }))
  },
  snapshots: {
    summary: snapshotSummary,
    totalRows: snapshotSummary.reduce((sum, row) => sum + Number(row.row_count || 0), 0),
    duplicateGroups: Number(duplicateSummary?.[0]?.duplicate_groups || 0),
    duplicateRows: Number(duplicateSummary?.[0]?.duplicate_rows || 0),
    snapshotFingerprintMismatches: snapshotFingerprintMismatches.length,
    outcomeRows: outcomes.length,
    outcomeFingerprintMismatches: outcomeFingerprintMismatches.length,
    guardCounts,
    nonzeroDecisionImpact: snapshotSummary.reduce((sum, row) => sum + Number(row.nonzero_decision_impact || 0), 0),
    mutationConflictAtRest: 0,
    mutationConflictTelemetry: "scan.pvShadow.daily.details; rejected conflicts are intentionally not persisted as rows"
  },
  afterMarket: pvScan ? {
    schemaVersion: pvScan.schemaVersion,
    enabled: pvScan.enabled,
    decisionImpact: pvScan.decisionImpact,
    formalCoreImpact: pvScan.formalCoreImpact,
    bootstrap: pvScan.bootstrap,
    daily: pvScan.daily
  } : null,
  calls: {
    ordinaryLiveCandleCallsAddedByPv: ordinaryLiveCandleCallsAdded,
    latestLiveReported: live.fugleCallsThisRun || null,
    latestLivePv: live.pvShadow || null,
    recentCronRuns: recentCrons.map(row => ({
      id: row.id, cronExpression: row.cron_expression, scheduledAt: row.scheduled_at,
      jobType: row.job_type, status: row.status, skipped: Boolean(row.skipped),
      fugleCalls: row.fugle_calls, error: row.error
    }))
  },
  cron: {
    latest: cron.latest || cron.latestRun || null,
    currentAfterMarketScanDate: scan.scanDate || null,
    currentAfterMarketPvPresent: Boolean(pvScan)
  }
};

await mkdir("artifacts", { recursive: true });
await writeFile("artifacts/pv-shadow-readonly-qa.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
