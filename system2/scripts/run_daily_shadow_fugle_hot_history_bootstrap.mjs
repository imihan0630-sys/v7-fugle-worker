import assert from "node:assert/strict";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import {
  runDailyShadowFugleHotHistoryBootstrapV0_1,
  FUGLE_HOT_HISTORY_DEFAULT_SYMBOL_LIMIT,
  FUGLE_HOT_HISTORY_MAX_SYMBOL_LIMIT,
} from "../runtime/daily_shadow_fugle_hot_history_bootstrap_v0_1.mjs";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
const fugleApiKey = process.env.FUGLE_API_KEY;
const confirm = process.env.SYSTEM2_CONFIRM;
const symbolLimit = Number(
  process.env.SYSTEM2_FUGLE_HOT_HISTORY_SYMBOL_LIMIT || FUGLE_HOT_HISTORY_DEFAULT_SYMBOL_LIMIT,
);
const pauseMs = Number(process.env.SYSTEM2_FUGLE_HOT_HISTORY_PAUSE_MS || 1100);

assert.ok(accountId, "CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(apiToken, "SYSTEM2_CLOUDFLARE_API_TOKEN is required");
assert.ok(fugleApiKey, "FUGLE_API_KEY is required");
assert.equal(
  confirm,
  "WRITE_SYSTEM2_FUGLE_RAW_HOT_HISTORY_ONLY",
  "explicit Fugle hot-history write confirmation is required",
);
assert.ok(
  Number.isInteger(symbolLimit) && symbolLimit >= 1 && symbolLimit <= FUGLE_HOT_HISTORY_MAX_SYMBOL_LIMIT,
  "SYSTEM2_FUGLE_HOT_HISTORY_SYMBOL_LIMIT out of bounds",
);
assert.ok(Number.isInteger(pauseMs) && pauseMs >= 1000 && pauseMs <= 5000, "pause must be 1000..5000ms");

const db = await createRemoteD1RestAdapter({
  accountId,
  apiToken,
  databaseName: "system2-research",
});
const schema = await db.rawQuery(
  "SELECT schema_value FROM s2_schema_meta WHERE schema_key='schema_version' LIMIT 1",
);
assert.equal(schema[0]?.schema_value, "1.1", "isolated D1 schema must remain 1.1");

const result = await runDailyShadowFugleHotHistoryBootstrapV0_1({
  db,
  fugleApiKey,
  symbolLimit,
  pauseMs,
});

const receipt = {
  result: "PASS",
  databaseName: "system2-research",
  d1SchemaVersion: schema[0].schema_value,
  ...result,
  d1UsageObservedThisRun: {
    requestCount: db.metrics.requestCount,
    rowsRead: db.metrics.rowsRead,
    rowsWritten: db.metrics.rowsWritten,
    latestSizeAfterBytes: db.metrics.latestSizeAfter,
  },
};

assert.equal(receipt.rawPriceSpaceOnly, true);
assert.equal(receipt.availabilityBasis, "PROSPECTIVE_OBSERVATION");
assert.equal(receipt.continuityState, "UNVERIFIED");
assert.equal(receipt.continuityPromotionPerformed, false);
assert.equal(receipt.strategyEvaluationPerformed, false);
assert.equal(receipt.capacityRunProduced, false);
assert.equal(receipt.zeroPickClaimed, false);
assert.equal(receipt.selectionAuthority, false);
assert.equal(receipt.finalSelectionEnabled, false);
assert.equal(receipt.livePushEnabled, false);
assert.equal(receipt.orderImpact, false);
assert.equal(receipt.system1RuntimeUsed, false);

console.log(JSON.stringify(receipt, null, 2));
