import assert from "node:assert/strict";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import {
  fetchOfficialHistoricalA1DateV0_1,
  officialHistoricalA1SourceContractV0_1,
} from "../runtime/official_historical_a1_source_v0_1.mjs";
import { buildHistoricalStoreIngestBatch } from "../runtime/historical_store_v0_1.mjs";
import { executeHistoricalIngestBatchBulkV0_1 } from "../runtime/historical_bulk_persistence_v0_1.mjs";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
const marketDate = process.env.SYSTEM2_HISTORY_SMOKE_DATE || "2017-01-03";
const capturedAt = new Date().toISOString();

assert.ok(accountId, "CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(apiToken, "SYSTEM2_CLOUDFLARE_API_TOKEN is required");
assert.match(marketDate, /^\d{4}-\d{2}-\d{2}$/);

const db = await createRemoteD1RestAdapter({
  accountId,
  apiToken,
  databaseName: "system2-research",
});

const schema = await db.rawQuery(
  "SELECT schema_value FROM s2_schema_meta WHERE schema_key='schema_version' LIMIT 1",
);
assert.equal(schema[0]?.schema_value, "0.7", "isolated D1 must be migrated to schema 0.7 first");

const minima = marketDate === "2017-01-03"
  ? { TWSE: 800, TPEX: 650 }
  : { TWSE: 500, TPEX: 450 };

const marketReceipts = [];
for (const market of ["TWSE", "TPEX"]) {
  const contract = officialHistoricalA1SourceContractV0_1(market);
  const batchId = `S2-HIST-CORE-V0.1|${market}|${marketDate}`;

  const existingReceipt = await db.rawQuery(
    "SELECT batch_id, row_count, batch_hash FROM s2_historical_ingest_batches WHERE batch_id = ? LIMIT 1",
    [batchId],
  );
  if (existingReceipt.length) {
    marketReceipts.push({
      market,
      batchId,
      state: "ALREADY_COMPLETE",
      rowCount: Number(existingReceipt[0].row_count),
    });
    continue;
  }

  const source = await fetchOfficialHistoricalA1DateV0_1({
    market,
    marketDate,
    observedAt: capturedAt,
  });
  assert.equal(source.state, "READY");
  assert.equal(source.sourceDateEvidence, marketDate);
  assert.ok(
    source.ordinarySymbolCount >= minima[market],
    `${market} historical coverage unexpectedly low: ${source.ordinarySymbolCount}`,
  );

  const ingestBatch = await buildHistoricalStoreIngestBatch({
    batchId,
    datasetLane: "CORE_2017_PLUS",
    sourceId: contract.sourceId,
    sourceName: contract.sourceName,
    sourceUrl: contract.sourceUrl,
    capturedAt,
    rows: source.rows,
  });

  const persisted = await executeHistoricalIngestBatchBulkV0_1({
    db,
    ingestBatch,
    lookupChunkSize: 80,
    insertChunkSize: 80,
  });

  marketReceipts.push({
    market,
    batchId,
    state: persisted.state,
    sourceRowCount: source.ordinarySymbolCount,
    insertedBarCount: persisted.insertedBarCount,
    identicalBarCount: persisted.identicalBarCount,
    allBarsAccounted: persisted.allBarsAccounted,
    completionReceiptWrittenLast: persisted.completionReceiptWrittenLast,
    batchHash: ingestBatch.batchHash,
  });
}

const coverage = await db.rawQuery(
  `SELECT market, COUNT(*) AS row_count, COUNT(DISTINCT symbol) AS symbol_count,
          MIN(market_date) AS min_date, MAX(market_date) AS max_date
     FROM s2_historical_a1_bars
    WHERE market_date = ?
    GROUP BY market
    ORDER BY market`,
  [marketDate],
);
const ambiguous = await db.rawQuery(
  `SELECT COUNT(*) AS ambiguous_keys FROM (
       SELECT canonical_key
         FROM s2_historical_a1_bars
        WHERE market_date = ?
        GROUP BY canonical_key
       HAVING COUNT(DISTINCT bar_hash) > 1
     )`,
  [marketDate],
);
const batchCoverage = await db.rawQuery(
  `SELECT source_id, row_count, pit_eligible_count, unknown_availability_count
     FROM s2_historical_ingest_batches
    WHERE first_market_date = ? AND last_market_date = ?
    ORDER BY source_id`,
  [marketDate, marketDate],
);

assert.equal(Number(ambiguous[0]?.ambiguous_keys || 0), 0);
for (const market of ["TWSE", "TPEX"]) {
  const row = coverage.find((x) => x.market === market);
  assert.ok(row, "physical D1 coverage missing for " + market);
  assert.ok(Number(row.symbol_count) >= minima[market], "physical D1 symbol coverage low for " + market);
}

console.log(JSON.stringify({
  result: "PASS",
  smokeVersion: "S2_HISTORICAL_D1_PHYSICAL_SMOKE_V0_1",
  databaseName: "system2-research",
  schemaVersion: schema[0].schema_value,
  marketDate,
  capturedAt,
  marketReceipts,
  coverage,
  completionReceipts: batchCoverage,
  ambiguousCanonicalKeys: Number(ambiguous[0]?.ambiguous_keys || 0),
  d1UsageObservedThisRun: {
    requestCount: db.metrics.requestCount,
    rowsRead: db.metrics.rowsRead,
    rowsWritten: db.metrics.rowsWritten,
    latestSizeAfterBytes: db.metrics.latestSizeAfter,
    latestSizeAfterMiB: Number.isFinite(db.metrics.latestSizeAfter)
      ? Number((db.metrics.latestSizeAfter / 1024 / 1024).toFixed(3))
      : null,
  },
  productionDatabaseUsed: false,
  system1RuntimeChanged: false,
}, null, 2));
