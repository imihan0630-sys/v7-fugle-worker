import assert from "node:assert/strict";
import {
  planDailyShadowFugleHotHistoryBootstrapV0_1,
  runDailyShadowFugleHotHistoryBootstrapV0_1,
  FUGLE_HOT_HISTORY_SYMBOL_COMPLETE_CHECK,
} from "../runtime/daily_shadow_fugle_hot_history_bootstrap_v0_1.mjs";
import { toHistoricalA1BarRows } from "../runtime/historical_store_v0_1.mjs";

class Statement {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql;
    this.params = [];
  }
  bind(...params) {
    this.params = params;
    return this;
  }
  async all() {
    if (this.sql.includes("WITH per_date AS")) return { results: this.db.coverageRows };
    if (this.sql.includes("WHERE check_type=?")) {
      return { results: [...this.db.checks.values()].filter((x) => x.check_type === this.params[0]) };
    }
    if (this.sql.includes("FROM s2_historical_a1_bars") && this.sql.includes("market=?")) {
      const [market, symbol, fromDate, toDate] = this.params;
      return { results: this.db.barRows.filter((x) =>
        x.market === market && x.symbol === symbol
        && x.price_space === "RAW"
        && x.market_date >= fromDate && x.market_date <= toDate) };
    }
    if (this.sql.includes("WHERE bar_id IN")) {
      return { results: this.db.barRows.filter((x) => this.params.includes(x.bar_id)) };
    }
    return { results: [] };
  }
  async first() {
    if (this.sql.includes("FROM s2_infrastructure_checks") && this.sql.includes("check_id")) {
      return this.db.checks.get(String(this.params[0])) || null;
    }
    return null;
  }
}

class Db {
  constructor() {
    this.coverageRows = [];
    this.barRows = [];
    this.checks = new Map();
  }
  prepare(sql) {
    return new Statement(this, sql);
  }
  async batch(statements) {
    const results = [];
    for (const statement of statements) {
      if (statement.sql.startsWith("INSERT INTO s2_infrastructure_checks")) {
        const match = statement.sql.match(/INSERT INTO s2_infrastructure_checks \(([^)]+)\)/);
        assert.ok(match);
        const columns = match[1].split(",").map((x) => x.trim());
        const row = Object.fromEntries(columns.map((key, i) => [key, statement.params[i]]));
        this.checks.set(String(row.check_id), row);
      } else {
        throw new Error("unexpected batch SQL: " + statement.sql);
      }
      results.push({ success: true });
    }
    return results;
  }
}

const listingMetadata = {
  state: "READY",
  byMarketSymbol: {
    "TWSE|1101": {
      market: "TWSE", symbol: "1101", companyName: "台泥", listingDate: "1962-02-09",
    },
    "TWSE|2330": {
      market: "TWSE", symbol: "2330", companyName: "台積電", listingDate: "1994-09-05",
    },
    "TPEX|6488": {
      market: "TPEX", symbol: "6488", companyName: "環球晶", listingDate: "2015-09-25",
    },
    "TPEX|7777": {
      market: "TPEX", symbol: "7777", companyName: "新櫃", listingDate: "2026-09-29",
    },
  },
};

const planDb = new Db();
planDb.coverageRows = [
  {
    market: "TWSE", symbol: "1101", date_count: 60, ambiguous_date_count: 0,
    first_market_date: "2026-07-01", last_market_date: "2026-10-02",
  },
  {
    market: "TWSE", symbol: "2330", date_count: 10, ambiguous_date_count: 0,
    first_market_date: "2026-09-01", last_market_date: "2026-10-02",
  },
  {
    market: "TPEX", symbol: "6488", date_count: 1, ambiguous_date_count: 1,
    first_market_date: "2026-09-24", last_market_date: "2026-09-24",
  },
];
planDb.checks.set("done", {
  check_type: FUGLE_HOT_HISTORY_SYMBOL_COMPLETE_CHECK,
  observed_payload_json: JSON.stringify({ market: "TPEX", symbol: "7777" }),
});

const plan = await planDailyShadowFugleHotHistoryBootstrapV0_1({
  db: planDb,
  listingMetadata,
  asOf: "2026-10-03T06:30:00.000Z",
  toDate: "2026-10-02",
  symbolLimit: 10,
});
assert.equal(plan.selectedSymbolCount, 1);
assert.equal(plan.selected[0].symbol, "2330");
assert.equal(plan.selected[0].existingPitDateCount, 10);
assert.equal(plan.selected[0].fromDate, "2025-12-06");
assert.equal(plan.blocked.length, 1);
assert.equal(plan.blocked[0].symbol, "6488");
assert.equal(plan.blocked[0].state, "EXISTING_HISTORY_AMBIGUITY");
assert.equal(plan.selectionAuthority, false);
assert.equal(plan.continuityPromotionPerformed, false);

const db = new Db();
const runListing = {
  state: "READY",
  byMarketSymbol: {
    "TWSE|2330": {
      market: "TWSE", symbol: "2330", companyName: "台積電", listingDate: "1994-09-05",
    },
  },
};
const historicalFetchCalls = [];
const result = await runDailyShadowFugleHotHistoryBootstrapV0_1({
  db,
  fugleApiKey: "secret-test-key",
  asOf: "2026-10-03T06:30:00.000Z",
  toDate: "2026-10-02",
  symbolLimit: 1,
  pauseMs: 0,
  listingMetadataFetch: async () => runListing,
  historicalFetch: async (args) => {
    historicalFetchCalls.push(args);
    return {
      state: "READY",
      sourceId: "FUGLE_MARKETDATA_V1_STOCK_HISTORICAL_DAILY_RAW_PROSPECTIVE",
      sourceName: "fixture",
      sourceUrl: "https://api.fugle.tw/fixture",
      payloadHash: "a".repeat(64),
      observedAt: "2026-10-03T06:30:05.000Z",
      barCount: 2,
      rows: [
        {
          marketDate: "2026-09-30", market: "TWSE", symbol: "2330", companyName: "台積電",
          priceSpace: "RAW", open: 100, high: 105, low: 99, close: 104,
          volumeShares: 1000, tradeValue: 104000, transactions: null, change: null,
          continuityState: "UNVERIFIED",
          observedAt: "2026-10-03T06:30:05.000Z",
          availableAt: "2026-10-03T06:30:05.000Z",
          availabilityBasis: "PROSPECTIVE_OBSERVATION",
          sourceFields: { date: "2026-09-30", close: 104 },
          sourceRowHash: "b".repeat(64),
        },
        {
          marketDate: "2026-10-02", market: "TWSE", symbol: "2330", companyName: "台積電",
          priceSpace: "RAW", open: 105, high: 110, low: 103, close: 109,
          volumeShares: 1200, tradeValue: 130800, transactions: null, change: null,
          continuityState: "UNVERIFIED",
          observedAt: "2026-10-03T06:30:05.000Z",
          availableAt: "2026-10-03T06:30:05.000Z",
          availabilityBasis: "PROSPECTIVE_OBSERVATION",
          sourceFields: { date: "2026-10-02", close: 109 },
          sourceRowHash: "c".repeat(64),
        },
      ],
    };
  },
  historicalPersist: async ({ ingestBatch }) => {
    const rows = toHistoricalA1BarRows(ingestBatch);
    db.barRows.push(...rows);
    return {
      insertedBarCount: rows.length,
      identicalBarCount: 0,
      completionReceiptWrittenLast: true,
    };
  },
  sleep: async () => {},
});
assert.equal(historicalFetchCalls.length, 1);
assert.equal(historicalFetchCalls[0].apiKey, "secret-test-key");
assert.equal(result.state, "BOUNDED_BOOTSTRAP_COMPLETE");
assert.equal(result.processedSymbolCount, 1);
assert.equal(result.insertedBarCount, 2);
assert.equal(result.continuityState, "UNVERIFIED");
assert.equal(result.selectionAuthority, false);
assert.equal(result.capacityRunProduced, false);
assert.equal(result.zeroPickClaimed, false);
assert.equal(result.system1RuntimeUsed, false);
assert.equal(db.barRows.length, 2);
assert(db.barRows.every((x) =>
  x.price_space === "RAW"
  && x.continuity_state === "UNVERIFIED"
  && x.availability_basis === "PROSPECTIVE_OBSERVATION"
  && x.pit_availability_class === "OBSERVED_AVAILABLE_UPPER_BOUND"
));
assert.equal(db.checks.size, 1);
const marker = [...db.checks.values()][0];
assert.equal(marker.check_type, FUGLE_HOT_HISTORY_SYMBOL_COMPLETE_CHECK);
const markerPayload = JSON.parse(marker.observed_payload_json);
assert.equal(markerPayload.state, "RAW_HISTORY_BOOTSTRAP_COMPLETE");
assert.equal(markerPayload.insertedBarCount, 2);
assert.equal(markerPayload.selectionAuthority, false);

const rerunPlan = await planDailyShadowFugleHotHistoryBootstrapV0_1({
  db,
  listingMetadata: runListing,
  asOf: "2026-10-03T06:31:00.000Z",
  toDate: "2026-10-02",
  symbolLimit: 1,
});
assert.equal(rerunPlan.selectedSymbolCount, 0, "completion marker must prevent repeat fetch");

await assert.rejects(
  planDailyShadowFugleHotHistoryBootstrapV0_1({
    db: new Db(),
    listingMetadata: { state: "INCOMPLETE" },
    asOf: "2026-10-03T06:30:00.000Z",
  }),
  /READY current listing metadata/,
);

console.log("System2 bounded Fugle raw hot-history bootstrap tests passed");
