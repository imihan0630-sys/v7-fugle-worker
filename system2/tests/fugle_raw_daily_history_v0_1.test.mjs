import assert from "node:assert/strict";
import {
  buildFugleRawDailyHistoryUrlV0_1,
  normalizeFugleRawDailyHistoryV0_1,
  fetchFugleRawDailyHistoryV0_1,
  FUGLE_RAW_DAILY_HISTORY_SOURCE_ID,
} from "../runtime/fugle_raw_daily_history_v0_1.mjs";

const observedAt = "2026-10-03T06:30:00.000Z";
const url = buildFugleRawDailyHistoryUrlV0_1({
  symbol: "6488",
  fromDate: "2026-06-01",
  toDate: "2026-10-02",
});
assert.match(url, /historical\/candles\/6488/);
assert.match(url, /timeframe=D/);
assert.match(url, /adjusted=false/);
assert.match(url, /fields=open,high,low,close,volume,turnover/);
assert.match(url, /sort=asc/);

const raw = {
  symbol: "6488",
  type: "EQUITY",
  exchange: "TPEx",
  market: "OTC",
  timeframe: "D",
  adjusted: false,
  sort: "asc",
  data: [
    {
      date: "2026-09-30",
      open: 500,
      high: 510,
      low: 495,
      close: 505,
      volume: 1_000_000,
      turnover: 505_000_000,
      change: 5,
    },
    {
      date: "2026-10-02",
      open: 506,
      high: 520,
      low: 503,
      close: 518,
      volume: 1_200_000,
      turnover: 620_000_000,
      change: 13,
    },
  ],
};

const normalized = await normalizeFugleRawDailyHistoryV0_1({
  symbol: "6488",
  market: "TPEX",
  companyName: "環球晶",
  listingDate: "2015-09-25",
  fromDate: "2026-06-01",
  toDate: "2026-10-02",
  observedAt,
  rawHistory: raw,
});
assert.equal(normalized.state, "READY");
assert.equal(normalized.sourceId, FUGLE_RAW_DAILY_HISTORY_SOURCE_ID);
assert.equal(normalized.requestedAdjusted, false);
assert.equal(normalized.priceSpace, "RAW");
assert.equal(normalized.volumeUnit, "SHARES");
assert.equal(normalized.continuityState, "UNVERIFIED");
assert.equal(normalized.barCount, 2);
assert.deepEqual(normalized.rows.map((x) => x.marketDate), ["2026-09-30", "2026-10-02"]);
assert(normalized.rows.every((x) =>
  x.availableAt === observedAt
  && x.observedAt === observedAt
  && x.availabilityBasis === "PROSPECTIVE_OBSERVATION"
  && x.continuityState === "UNVERIFIED"
  && x.transactions === null
  && x.change === null
));
assert.equal(normalized.rows[0].sourceFields.sourceChange, 5);
assert.match(normalized.payloadHash, /^[a-f0-9]{64}$/);

await assert.rejects(
  normalizeFugleRawDailyHistoryV0_1({
    symbol: "6488",
    market: "TPEX",
    fromDate: "2026-06-01",
    toDate: "2026-10-02",
    observedAt,
    rawHistory: { ...raw, adjusted: true },
  }),
  /must not be adjusted/,
);
await assert.rejects(
  normalizeFugleRawDailyHistoryV0_1({
    symbol: "6488",
    market: "TWSE",
    fromDate: "2026-06-01",
    toDate: "2026-10-02",
    observedAt,
    rawHistory: raw,
  }),
  /exchange mismatch/,
);
await assert.rejects(
  normalizeFugleRawDailyHistoryV0_1({
    symbol: "6488",
    market: "TPEX",
    listingDate: "2026-10-01",
    fromDate: "2026-06-01",
    toDate: "2026-10-02",
    observedAt,
    rawHistory: raw,
  }),
  /precedes official listing date/,
);
await assert.rejects(
  buildFugleRawDailyHistoryUrlV0_1({
    symbol: "6488",
    fromDate: "2025-01-01",
    toDate: "2026-10-02",
  }),
  /<=330/,
);

let attempts = 0;
const fetched = await fetchFugleRawDailyHistoryV0_1({
  apiKey: "test-key",
  symbol: "6488",
  market: "TPEX",
  companyName: "環球晶",
  listingDate: "2015-09-25",
  fromDate: "2026-06-01",
  toDate: "2026-10-02",
  observedAt,
  retryAttempts: 2,
  retryDelayMs: 0,
  fetchImpl: async (requestUrl, options) => {
    attempts += 1;
    assert.match(requestUrl, /adjusted=false/);
    assert.equal(options.headers["X-API-KEY"], "test-key");
    if (attempts === 1) return { ok: false, status: 503, json: async () => ({}) };
    return { ok: true, status: 200, json: async () => raw };
  },
});
assert.equal(attempts, 2);
assert.equal(fetched.state, "READY");
assert.equal(fetched.barCount, 2);

const noData = await fetchFugleRawDailyHistoryV0_1({
  apiKey: "test-key",
  symbol: "7777",
  market: "TPEX",
  fromDate: "2026-10-01",
  toDate: "2026-10-02",
  observedAt,
  retryAttempts: 1,
  fetchImpl: async () => ({ ok: false, status: 404, json: async () => ({}) }),
});
assert.equal(noData.state, "NO_DATA");
assert.equal(noData.barCount, 0);

console.log("System2 Fugle raw daily-history source adapter tests passed");
