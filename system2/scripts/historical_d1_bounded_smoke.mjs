import assert from "node:assert/strict";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import {
  fetchOfficialFullMarketDailyPayloadV0_1,
  normalizeOfficialFullMarketDailyPayloadV0_1,
} from "../runtime/official_full_market_daily_history_adapter_v0_1.mjs";
import {
  buildHistoricalStoreIngestBatch,
  toHistoricalPersistenceRecords,
} from "../runtime/historical_store_v0_1.mjs";
import { buildSystem2PersistenceBatch } from "../runtime/persistence_batch.mjs";
import { executeSystem2PersistenceBatch } from "../runtime/persistence_executor.mjs";

const CONFIRM = "WRITE_SYSTEM2_HISTORICAL_SMOKE";
assert.equal(
  process.env.SYSTEM2_HISTORICAL_SMOKE_CONFIRM,
  CONFIRM,
  "explicit WRITE_SYSTEM2_HISTORICAL_SMOKE confirmation is required",
);

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
assert.ok(accountId, "CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(apiToken, "SYSTEM2_CLOUDFLARE_API_TOKEN is required");

const marketDate = process.env.SYSTEM2_HISTORICAL_SMOKE_DATE || "2026-09-24";
const symbolsByMarket = {
  TWSE: (process.env.SYSTEM2_HISTORICAL_SMOKE_TWSE || "2330,2454")
    .split(",").map((x) => x.trim()).filter(Boolean),
  TPEX: (process.env.SYSTEM2_HISTORICAL_SMOKE_TPEX || "3105,6488")
    .split(",").map((x) => x.trim()).filter(Boolean),
};
const capturedAt = new Date().toISOString();
const executionId = String(process.env.GITHUB_RUN_ID || "local-" + Date.now());

const db = await createRemoteD1RestAdapter({
  accountId,
  apiToken,
  databaseName: "system2-research",
});

const schemaRows = await db.rawQuery(
  "SELECT schema_value FROM s2_schema_meta WHERE schema_key = ? LIMIT 1",
  ["schema_version"],
);
assert.equal(
  schemaRows[0]?.schema_value,
  "1.1",
  "isolated System2 D1 must be migrated to schema 1.1 before historical smoke write",
);

const requiredTables = [
  "s2_historical_ingest_batches",
  "s2_historical_a1_bars",
  "s2_historical_universe_memberships",
  "s2_historical_universe_snapshots",
];
const tableRows = await db.rawQuery(
  "SELECT name FROM sqlite_schema WHERE type='table' AND name LIKE 's2_%' ORDER BY name",
);
const tableSet = new Set(tableRows.map((x) => x.name));
for (const table of requiredTables) {
  assert.ok(tableSet.has(table), "required isolated System2 D1 table missing: " + table);
}

const receipts = [];
for (const market of ["TWSE", "TPEX"]) {
  const payload = await fetchOfficialFullMarketDailyPayloadV0_1({ market, marketDate });
  const normalized = await normalizeOfficialFullMarketDailyPayloadV0_1({
    market,
    marketDate,
    payload,
    observedAt: capturedAt,
  });

  const requested = new Set(symbolsByMarket[market]);
  const chosen = normalized.rows.filter((row) => requested.has(row.symbol));
  const missing = [...requested].filter((symbol) => !chosen.some((row) => row.symbol === symbol));
  assert.deepEqual(missing, [], market + " bounded smoke symbols missing from official payload");

  const batchId = [
    "S2-HIST-SMOKE",
    marketDate.replaceAll("-", ""),
    market,
    normalized.payloadHash.slice(0, 12),
    executionId,
  ].join("-");

  const ingest = await buildHistoricalStoreIngestBatch({
    batchId,
    datasetLane: "CORE_2017_PLUS",
    sourceId: normalized.sourceId,
    sourceName: normalized.sourceName,
    sourceUrl: normalized.sourceUrl,
    capturedAt,
    rows: chosen,
  });

  const persistence = await buildSystem2PersistenceBatch({
    batchId: batchId + "-PERSIST",
    marketDate,
    decisionTimestamp: normalized.availableAt,
    records: toHistoricalPersistenceRecords(ingest),
    createdAt: capturedAt,
  });

  const firstApply = await executeSystem2PersistenceBatch({
    db,
    batch: persistence,
    bindingName: "SYSTEM2_DB",
  });
  const secondApply = await executeSystem2PersistenceBatch({
    db,
    batch: persistence,
    bindingName: "SYSTEM2_DB",
  });

  assert.equal(firstApply.insertedCount + firstApply.skippedIdenticalCount, persistence.operationCount);
  assert.equal(secondApply.insertedCount, 0, "second bounded smoke write must be idempotent");
  assert.equal(
    secondApply.skippedIdenticalCount,
    persistence.operationCount,
    "second bounded smoke write must skip every identical row",
  );

  const readback = await db.rawQuery(
    "SELECT symbol, market_date, market, close_price, bar_hash, source_id, available_at, pit_replay_eligible " +
    "FROM s2_historical_a1_bars WHERE market_date = ? AND market = ? AND symbol IN (" +
    chosen.map(() => "?").join(",") + ") ORDER BY symbol",
    [marketDate, market, ...chosen.map((x) => x.symbol)],
  );
  assert.equal(readback.length, chosen.length, market + " D1 readback row count mismatch");
  for (const row of readback) {
    assert.equal(row.market_date, marketDate);
    assert.equal(row.market, market);
    assert.equal(Number(row.pit_replay_eligible), 1);
  }

  receipts.push({
    market,
    marketDate,
    requestedSymbols: symbolsByMarket[market],
    officialFullMarketCount: normalized.ordinarySymbolCount,
    selectedRowCount: chosen.length,
    firstApply: {
      operationCount: firstApply.operationCount,
      insertedCount: firstApply.insertedCount,
      skippedIdenticalCount: firstApply.skippedIdenticalCount,
    },
    secondApply: {
      insertedCount: secondApply.insertedCount,
      skippedIdenticalCount: secondApply.skippedIdenticalCount,
    },
    readback: readback.map((x) => ({
      symbol: x.symbol,
      marketDate: x.market_date,
      market: x.market,
      close: x.close_price,
      sourceId: x.source_id,
      availableAt: x.available_at,
      pitReplayEligible: Number(x.pit_replay_eligible) === 1,
      barHash: x.bar_hash,
    })),
  });
}

console.log(JSON.stringify({
  result: "PASS",
  databaseName: "system2-research",
  bindingContract: "SYSTEM2_DB",
  schemaVersion: "1.1",
  marketDate,
  boundedSmokeOnly: true,
  fullBackfillPerformed: false,
  historicalReplayRunPerformed: false,
  receipts,
  d1Metrics: db.metrics,
  noSystem1Mutation: true,
}, null, 2));
