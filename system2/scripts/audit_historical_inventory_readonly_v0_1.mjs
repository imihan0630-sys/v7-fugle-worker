import assert from "node:assert/strict";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;

assert.ok(accountId, "CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(apiToken, "SYSTEM2_CLOUDFLARE_API_TOKEN is required");

const db = await createRemoteD1RestAdapter({
  accountId,
  apiToken,
  databaseName: "system2-research",
});

const schema = await db.rawQuery(
  "SELECT schema_value FROM s2_schema_meta WHERE schema_key='schema_version' LIMIT 1",
);
assert.equal(schema[0]?.schema_value, "1.1", "isolated D1 schema must remain 1.1");

const [
  barsByMarket,
  ambiguity,
  recentCoverage,
  memberships,
  packsByMarketYear,
  packReceipts,
  coldManifests,
  coldCheckpoints,
  coldReceipts,
  segmentedReceipts,
  segmentedCheckpoints,
  segmentedManifests,
] = await Promise.all([
  db.rawQuery(`
    SELECT market,
           COUNT(*) AS row_count,
           COUNT(DISTINCT canonical_key) AS canonical_key_count,
           COUNT(DISTINCT symbol) AS symbol_count,
           MIN(market_date) AS first_market_date,
           MAX(market_date) AS last_market_date,
           SUM(CASE WHEN pit_replay_eligible=1 AND available_at IS NOT NULL THEN 1 ELSE 0 END) AS pit_eligible_row_count,
           SUM(CASE WHEN continuity_state IN ('CLEAR_NO_ACTION','ADJUSTED_CONTINUITY') THEN 1 ELSE 0 END) AS continuity_eligible_row_count
      FROM s2_historical_a1_bars
     GROUP BY market
     ORDER BY market
  `),
  db.rawQuery(`
    SELECT market, COUNT(*) AS ambiguous_canonical_key_count
      FROM (
        SELECT market, canonical_key
          FROM s2_historical_a1_bars
         GROUP BY market, canonical_key
        HAVING COUNT(DISTINCT bar_hash) > 1
      )
     GROUP BY market
     ORDER BY market
  `),
  db.rawQuery(`
    SELECT market_date, market,
           COUNT(*) AS row_count,
           COUNT(DISTINCT symbol) AS symbol_count,
           SUM(CASE WHEN pit_replay_eligible=1 AND available_at IS NOT NULL THEN 1 ELSE 0 END) AS pit_eligible_row_count,
           SUM(CASE WHEN continuity_state IN ('CLEAR_NO_ACTION','ADJUSTED_CONTINUITY') THEN 1 ELSE 0 END) AS continuity_eligible_row_count
      FROM s2_historical_a1_bars
     WHERE market_date >= date('now','-140 day')
     GROUP BY market_date, market
     ORDER BY market_date DESC, market
     LIMIT 240
  `),
  db.rawQuery(`
    SELECT
      COUNT(*) AS membership_count,
      SUM(CASE WHEN member_state='CURRENT' THEN 1 ELSE 0 END) AS current_count,
      SUM(CASE WHEN replay_eligible=1 THEN 1 ELSE 0 END) AS replay_eligible_count,
      SUM(CASE WHEN listing_date IS NOT NULL THEN 1 ELSE 0 END) AS listing_date_known_count,
      SUM(CASE WHEN first_trading_date IS NOT NULL THEN 1 ELSE 0 END) AS first_trading_date_known_count,
      SUM(CASE WHEN effective_from IS NULL THEN 1 ELSE 0 END) AS unknown_start_count
    FROM s2_historical_universe_memberships
  `),
  db.rawQuery(`
    SELECT market, year,
           COUNT(*) AS pack_count,
           COUNT(DISTINCT symbol) AS symbol_count,
           SUM(bar_count) AS bar_count,
           MIN(first_market_date) AS first_market_date,
           MAX(last_market_date) AS last_market_date
      FROM s2_historical_a1_packs
     GROUP BY market, year
     ORDER BY year DESC, market
  `),
  db.rawQuery("SELECT COUNT(*) AS receipt_count FROM s2_historical_pack_ingest_receipts"),
  db.rawQuery("SELECT COUNT(*) AS manifest_count FROM s2_historical_a1_pack_manifests"),
  db.rawQuery("SELECT COUNT(*) AS checkpoint_count FROM s2_historical_cold_backfill_checkpoints"),
  db.rawQuery("SELECT COUNT(*) AS receipt_count FROM s2_historical_cold_ingest_receipts"),
  db.rawQuery(`SELECT market,year,month,batch_id,state,receipt_id,pack_count,bar_count,manifest_rolling_hash,completed_at
    FROM s2_historical_segment_ingest_receipts WHERE year=2026 ORDER BY market,month`),
  db.rawQuery(`SELECT market,year,month,batch_id,state,expected_pack_count,expected_bar_count,
    object_ready_count,manifest_committed_count,next_pack_index,rolling_hash
    FROM s2_historical_segment_backfill_checkpoints WHERE year=2026 ORDER BY market,month`),
  db.rawQuery(`SELECT market,year,month,COUNT(*) AS manifest_count,COALESCE(SUM(bar_count),0) AS bar_count
    FROM s2_historical_a1_segment_manifests WHERE year=2026 GROUP BY market,year,month ORDER BY market,month`),
]);

const ambiguityByMarket = Object.fromEntries(
  ambiguity.map((row) => [String(row.market), Number(row.ambiguous_canonical_key_count || 0)]),
);
const normalizedBars = barsByMarket.map((row) => ({
  market: String(row.market),
  rowCount: Number(row.row_count || 0),
  canonicalKeyCount: Number(row.canonical_key_count || 0),
  symbolCount: Number(row.symbol_count || 0),
  firstMarketDate: row.first_market_date || null,
  lastMarketDate: row.last_market_date || null,
  pitEligibleRowCount: Number(row.pit_eligible_row_count || 0),
  continuityEligibleRowCount: Number(row.continuity_eligible_row_count || 0),
  ambiguousCanonicalKeyCount: ambiguityByMarket[String(row.market)] || 0,
}));

const universe = memberships[0] || {};
const result = {
  result: "PASS",
  schemaVersion: "SYSTEM2_HISTORICAL_INVENTORY_READONLY_V0_1",
  databaseName: "system2-research",
  d1SchemaVersion: schema[0].schema_value,
  historicalBarsByMarket: normalizedBars,
  recentCoverage: recentCoverage.map((row) => ({
    marketDate: row.market_date,
    market: row.market,
    rowCount: Number(row.row_count || 0),
    symbolCount: Number(row.symbol_count || 0),
    pitEligibleRowCount: Number(row.pit_eligible_row_count || 0),
    continuityEligibleRowCount: Number(row.continuity_eligible_row_count || 0),
  })),
  historicalUniverse: {
    membershipCount: Number(universe.membership_count || 0),
    currentCount: Number(universe.current_count || 0),
    replayEligibleCount: Number(universe.replay_eligible_count || 0),
    listingDateKnownCount: Number(universe.listing_date_known_count || 0),
    firstTradingDateKnownCount: Number(universe.first_trading_date_known_count || 0),
    unknownStartCount: Number(universe.unknown_start_count || 0),
  },
  inlinePacks: {
    byMarketYear: packsByMarketYear.map((row) => ({
      market: row.market,
      year: Number(row.year),
      packCount: Number(row.pack_count || 0),
      symbolCount: Number(row.symbol_count || 0),
      barCount: Number(row.bar_count || 0),
      firstMarketDate: row.first_market_date || null,
      lastMarketDate: row.last_market_date || null,
    })),
    receiptCount: Number(packReceipts[0]?.receipt_count || 0),
  },
  externalColdStoreControlPlane: {
    manifestCount: Number(coldManifests[0]?.manifest_count || 0),
    checkpointCount: Number(coldCheckpoints[0]?.checkpoint_count || 0),
    receiptCount: Number(coldReceipts[0]?.receipt_count || 0),
  },
  // These D1-only receipts/counts do not prove R2 byte-GET or source reconciliation.
  currentYearSegmentControlPlane: {
    receiptCount: segmentedReceipts.length,
    receipts: segmentedReceipts.map(row=>({
      market:String(row.market),year:Number(row.year),month:Number(row.month),
      batchId:String(row.batch_id),state:String(row.state),receiptId:String(row.receipt_id),
      packCount:Number(row.pack_count),barCount:Number(row.bar_count),
      manifestRollingHash:String(row.manifest_rolling_hash),completedAt:String(row.completed_at),
    })),
    checkpoints: segmentedCheckpoints.map(row=>({
      market:String(row.market),year:Number(row.year),month:Number(row.month),
      batchId:String(row.batch_id),state:String(row.state),
      expectedPackCount:Number(row.expected_pack_count),expectedBarCount:Number(row.expected_bar_count),
      objectReadyCount:Number(row.object_ready_count),manifestCommittedCount:Number(row.manifest_committed_count),
      nextPackIndex:Number(row.next_pack_index),rollingHash:String(row.rolling_hash),
    })),
    manifestCounts: segmentedManifests.map(row=>({
      market:String(row.market),year:Number(row.year),month:Number(row.month),
      manifestCount:Number(row.manifest_count),barCount:Number(row.bar_count),
    })),
    assurance:"D1_CONTROL_PLANE_ONLY_R2_BYTE_VERIFICATION_SEPARATE",
  },
  d1Metrics: {
    requestCount: db.metrics.requestCount,
    rowsRead: db.metrics.rowsRead,
    rowsWritten: db.metrics.rowsWritten,
    latestSizeAfterBytes: db.metrics.latestSizeAfter,
  },
  mutationPerformed: false,
  system1RuntimeUsed: false,
};

if (result.d1Metrics.rowsWritten !== 0) {
  throw new Error("read-only historical inventory unexpectedly wrote D1 rows");
}
console.log(JSON.stringify(result, null, 2));
