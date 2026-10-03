import assert from "node:assert/strict";
import {
  fetchDailyShadowA1SnapshotV0_1,
  DAILY_SHADOW_A1_SOURCE_VERSION,
} from "../runtime/daily_shadow_a1_source_v0_1.mjs";
import { A1_SYMBOL_SNAPSHOT_SOURCES } from "../runtime/a1_symbol_snapshot_adapter.mjs";

const staleTwse = [{
  Date: "1151001",
  Code: "2330",
  Name: "台積電",
  OpeningPrice: "1000",
  HighestPrice: "1010",
  LowestPrice: "995",
  ClosingPrice: "1005",
  TradeVolume: "1000000",
  TradeValue: "1000000000",
  Transaction: "10000",
  Change: "5",
}];
const targetTpex = [{
  Date: "115/10/02",
  SecuritiesCompanyCode: "6488",
  CompanyName: "環球晶",
  Open: "500",
  High: "510",
  Low: "495",
  Close: "505",
  TradingShares: "500000",
  TransactionAmount: "251000000",
  TransactionNumber: "5000",
  Change: "5",
}];

function response(payload) {
  return {
    ok: true,
    status: 200,
    async json() { return payload; },
  };
}

async function primaryFetch(url) {
  if (url === A1_SYMBOL_SNAPSHOT_SOURCES.TWSE.sourceUrl) return response(staleTwse);
  if (url === A1_SYMBOL_SNAPSHOT_SOURCES.TPEX.sourceUrl) return response(targetTpex);
  throw new Error("unexpected URL " + url);
}

let fallbackCalls = [];
async function exactDateFetch({ market, marketDate }) {
  fallbackCalls.push({ market, marketDate });
  assert.equal(market, "TWSE", "target-date TPEX primary must not call fallback");
  return {
    state: "READY",
    market: "TWSE",
    marketDate,
    sourceId: "A1_TWSE_MI_INDEX_HISTORICAL_DAILY",
    sourceName: "TWSE MI_INDEX daily close historical report",
    sourceUrl: "https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=20261002&type=ALLBUT0999",
    sourceDateEvidence: marketDate,
    sourceDateEvidenceBasis: "PAYLOAD_DATE",
    rows: [{
      marketDate,
      market: "TWSE",
      symbol: "2330",
      companyName: "台積電",
      open: 1010,
      high: 1025,
      low: 1005,
      close: 1020,
      volumeShares: 1200000,
      tradeValue: 1220000000,
      transactions: 12000,
      change: 15,
    }],
  };
}

const observed = new Date("2026-10-02T10:40:00.000Z");
const ready = await fetchDailyShadowA1SnapshotV0_1({
  marketDate: "2026-10-02",
  fetchImpl: primaryFetch,
  exactDateFetch,
  now: () => observed,
  minimumByMarket: { TWSE: 1, TPEX: 1 },
});

assert.equal(DAILY_SHADOW_A1_SOURCE_VERSION, "0.3-RESEARCH");
assert.equal(ready.state, "READY");
assert.equal(ready.listingMetadata.state, "SOURCE_ERROR");
assert.deepEqual(fallbackCalls, [{ market: "TWSE", marketDate: "2026-10-02" }]);
assert.equal(ready.transports.TWSE.selection, "EXACT_DATE_FALLBACK");
assert.equal(ready.transports.TWSE.fallback.ok, true);
assert.equal(ready.transports.TPEX.selection, "PRIMARY_LATEST_OPENAPI_TARGET_DATE");
assert.equal(ready.snapshotBatch.ordinarySymbolCount, 2);
assert.equal(ready.snapshotBatch.bySymbol["2330"].close, 1020);
assert.equal(
  ready.snapshotBatch.bySymbol["2330"].provenance.sourceId,
  "A1_TWSE_MI_INDEX_EXACT_DATE_PROSPECTIVE",
);
assert.equal(
  ready.snapshotBatch.bySymbol["2330"].provenance.sourceUrl,
  "https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=20261002&type=ALLBUT0999",
);
assert.equal(
  ready.snapshotBatch.bySymbol["2330"].provenance.availableAt,
  "2026-10-02T10:40:00.000Z",
  "prospective fallback must use actual observation time, not a historical publication guess",
);
assert.equal(
  ready.snapshotBatch.bySymbol["6488"].provenance.sourceId,
  A1_SYMBOL_SNAPSHOT_SOURCES.TPEX.sourceId,
);

const blocked = await fetchDailyShadowA1SnapshotV0_1({
  marketDate: "2026-10-02",
  fetchImpl: primaryFetch,
  exactDateFetch: async () => { throw new Error("SOURCE_DATE_MISMATCH"); },
  now: () => observed,
  minimumByMarket: { TWSE: 1, TPEX: 1 },
});
assert.equal(blocked.state, "INCOMPLETE");
assert.equal(blocked.transports.TWSE.selection, "PRIMARY_NON_TARGET_DATE_FALLBACK_FAILED");
assert.equal(blocked.snapshotBatch.markets.TWSE.targetDateOrdinaryRowCount, 0);
assert.ok(blocked.snapshotBatch.blockerCodes.includes("TWSE:INSUFFICIENT_ORDINARY_SYMBOL_COVERAGE"));

console.log("System2 daily Shadow A1 exact-date fallback tests passed");
