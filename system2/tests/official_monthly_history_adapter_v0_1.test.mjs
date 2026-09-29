import assert from "node:assert/strict";
import {
  buildOfficialMonthlyHistoryUrl,
  normalizeOfficialMonthlyHistoryPayloadV0_1,
} from "../runtime/official_monthly_history_adapter_v0_1.mjs";

assert.equal(
  buildOfficialMonthlyHistoryUrl({
    market: "TWSE",
    symbol: "2330",
    yearMonth: "2026-09",
  }),
  "https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY?date=20260901&stockNo=2330&response=json",
);

assert.equal(
  buildOfficialMonthlyHistoryUrl({
    market: "TPEX",
    symbol: "6488",
    yearMonth: "2026-09",
  }),
  "https://www.tpex.org.tw/web/stock/aftertrading/daily_trading_info/st43_result.php?d=115/09&stkno=6488",
);

const twse = await normalizeOfficialMonthlyHistoryPayloadV0_1({
  market: "TWSE",
  symbol: "2330",
  companyName: "台積電",
  yearMonth: "2026-09",
  observedAt: "2026-10-01T01:00:00Z",
  payload: {
    stat: "OK",
    data: [
      ["2026/09/01", "10,000", "15,200,000", "1500", "1530", "1490", "1520", "+20", "1,200"],
      ["2026/09/02", "11,000", "16,610,000", "1520", "1525", "1500", "1510", "-10", "1,300"],
    ],
  },
});

assert.equal(twse.rowCount, 2);
assert.equal(twse.rows[0].marketDate, "2026-09-01");
assert.equal(twse.rows[0].volumeShares, 10000);
assert.equal(twse.rows[0].tradeValue, 15200000);
assert.equal(twse.rows[0].open, 1500);
assert.equal(twse.rows[0].close, 1520);
assert.equal(twse.rows[0].availableAt, "2026-09-01T05:30:00.000Z");
assert.equal(twse.rows[0].availabilityBasis, "SESSION_CLOSE_FINALITY");
assert.equal(twse.rows[0].sourceId, "TWSE_STOCK_DAY_MONTHLY");

const tpex = await normalizeOfficialMonthlyHistoryPayloadV0_1({
  market: "TPEX",
  symbol: "6488",
  companyName: "環球晶",
  yearMonth: "2026-09",
  observedAt: "2026-10-01T01:00:00Z",
  payload: {
    iTotalRecords: 2,
    aaData: [
      ["115/09/01", "1,500", "765,000,000", "500", "512", "498", "510", "+10", "2,100"],
      ["115/09/02", "1,200", "606,000,000", "510", "511", "502", "505", "-5", "1,900"],
    ],
  },
});

assert.equal(tpex.rowCount, 2);
assert.equal(tpex.rows[0].marketDate, "2026-09-01");
assert.equal(tpex.rows[0].volumeShares, 1500);
assert.equal(tpex.rows[0].tradeValue, 765000000);
assert.equal(tpex.rows[0].high, 512);
assert.equal(tpex.rows[0].low, 498);
assert.equal(tpex.rows[0].sourceId, "TPEX_ST43_MONTHLY");

await assert.rejects(
  () => normalizeOfficialMonthlyHistoryPayloadV0_1({
    market: "TWSE",
    symbol: "2330",
    yearMonth: "2026-09",
    observedAt: "2026-10-01T01:00:00Z",
    payload: {
      stat: "OK",
      data: [
        ["2026/09/01", "10,000", "15,200,000", "1500", "1490", "1530", "1520", "+20", "1,200"],
      ],
    },
  }),
  /inconsistent OHLC/,
);

const noData = await normalizeOfficialMonthlyHistoryPayloadV0_1({
  market: "TWSE",
  symbol: "2330",
  yearMonth: "2010-01",
  observedAt: "2026-10-01T01:00:00Z",
  payload: { stat: "No data in this date!" },
});
assert.equal(noData.rowCount, 0);

console.log("System2 official monthly history adapter v0.1 tests passed");
