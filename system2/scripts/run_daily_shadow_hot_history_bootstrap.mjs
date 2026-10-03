import assert from "node:assert/strict";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import {
  HOT_HISTORY_MAX_SESSIONS_PER_RUN,
  runDailyShadowHotHistoryBootstrapV0_1,
} from "../runtime/daily_shadow_hot_history_bootstrap_v0_1.mjs";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
const confirm = process.env.SYSTEM2_CONFIRM;
const sessionCount = Number(process.env.SYSTEM2_HOT_HISTORY_SESSION_COUNT || HOT_HISTORY_MAX_SESSIONS_PER_RUN);
const runId = String(process.env.GITHUB_RUN_ID || "LOCAL") + ":" + String(process.env.GITHUB_RUN_ATTEMPT || "1");
const revision = String(process.env.GITHUB_SHA || "UNKNOWN");

assert.ok(accountId, "CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(apiToken, "SYSTEM2_CLOUDFLARE_API_TOKEN is required");
assert.equal(confirm, "WRITE_SYSTEM2_HOT_HISTORY_BOOTSTRAP", "explicit hot-history write confirmation is required");
assert.ok(Number.isInteger(sessionCount) && sessionCount >= 1 && sessionCount <= HOT_HISTORY_MAX_SESSIONS_PER_RUN);

const db = await createRemoteD1RestAdapter({
  accountId,
  apiToken,
  databaseName: "system2-research",
});
const schema = await db.rawQuery(
  "SELECT schema_value FROM s2_schema_meta WHERE schema_key='schema_version' LIMIT 1",
);
assert.equal(schema[0]?.schema_value, "1.1", "isolated D1 schema 1.1 is required");

const asOf = new Date().toISOString();
const receipt = await runDailyShadowHotHistoryBootstrapV0_1({
  db,
  runId,
  asOf,
  sessionCount,
});

assert.equal(receipt.selectionAuthority, false);
assert.equal(receipt.capacityWriteAuthorized, false);
assert.equal(receipt.finalSelectionEnabled, false);
assert.equal(receipt.livePushEnabled, false);
assert.equal(receipt.orderImpact, false);
assert.equal(receipt.system1RuntimeUsed, false);
assert.equal(receipt.continuityState, "UNVERIFIED");
assert.ok(receipt.plan.targetDates.length <= HOT_HISTORY_MAX_SESSIONS_PER_RUN);

console.log(JSON.stringify({
  result: "PASS",
  databaseName: "system2-research",
  schemaVersion: schema[0].schema_value,
  revision,
  sessionCount,
  receipt,
  d1UsageObservedThisRun: {
    requestCount: db.metrics.requestCount,
    rowsRead: db.metrics.rowsRead,
    rowsWritten: db.metrics.rowsWritten,
    latestSizeAfterBytes: db.metrics.latestSizeAfter,
    latestSizeAfterMiB: Number.isFinite(db.metrics.latestSizeAfter)
      ? Number((db.metrics.latestSizeAfter / 1024 / 1024).toFixed(3))
      : null,
  },
  system1RuntimeChanged: false,
}, null, 2));
