import assert from "node:assert/strict";
import {
  buildOfficialFullMarketDailyUrl,
  conservativeHistoricalAvailableAt,
  normalizeOfficialFullMarketDailyPayloadV0_1,
} from "../runtime/official_full_market_daily_history_adapter_v0_1.mjs";

assert.equal(
  buildOfficialFullMarketDailyUrl({ market: "TWSE", marketDate: "2020-01-02" }),
  "https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=20200102&type=ALLBUT0999&response=json",
);
assert.equal(
  buildOfficialFullMarketDailyUrl({ market: "TPEX", marketDate: "2020-01-02" }),
  "https://www.tpex.org.tw/web/stock/aftertrading/otc_quotes_no1430/stk_wn1430_result.php?l=zh-tw&d=109/01/02&se=EW&o=json",
);
assert.equal(
  conservativeHistoricalAvailableAt("2020-01-02"),
  "2020-01-02T10:10:00.000Z",
);

const twse = await normalizeOfficialFullMarketDailyPayloadV0_1({
  market: "TWSE",
  marketDate: "2020-01-02",
  observedAt: "2026-09-28T13:00:00Z",
  payload: {
    stat: "OK",
    fields1: ["指數", "收盤指數"],
    data1: [["加權股價指數", "12000"]],
    fields9: [
      "證券代號", "證券名稱", "成交股數", "成交筆數", "成交金額",
      "開盤價", "最高價", "最低價", "收盤價", "漲跌(+/-)", "漲跌價差",
    ],
    data9: [
      ["2330", "台積電", "10,000,000", "12,000", "3,400,000,000", "330", "341", "330", "339", "<p>+</p>", "8"],
      ["0050", "元大台灣50", "20,000,000", "9,000", "2,000,000,000", "95", "96", "94", "95", "+", "1"],
      ["2454", "聯發科", "2,000,000", "5,000", "900,000,000", "450", "455", "440", "445", "-", "5"],
    ],
  },
});

assert.equal(twse.ordinarySymbolCount, 2);
assert.deepEqual(twse.rows.map((x) => x.symbol), ["2330", "2454"]);
assert.equal(twse.rows[0].close, 339);
assert.equal(twse.rows[0].change, 8);
assert.equal(twse.rows[1].change, -5);
assert.equal(twse.rows[0].continuityState, "UNVERIFIED");
assert.equal(twse.availableAt, "2020-01-02T10:10:00.000Z");

const tpex = await normalizeOfficialFullMarketDailyPayloadV0_1({
  market: "TPEX",
  marketDate: "2020-01-02",
  observedAt: "2026-09-28T13:00:00Z",
  payload: {
    tables: [{
      fields: [
        "代號", "名稱", "收盤", "漲跌", "開盤", "最高", "最低",
        "均價", "成交股數", "成交金額(元)", "成交筆數",
      ],
      data: [
        ["6488", "環球晶", "400", "+5", "395", "405", "392", "399", "1,500,000", "600,000,000", "2,100"],
        ["006201", "元大富櫃50", "15", "+0.1", "14.9", "15.1", "14.8", "15", "3,000,000", "45,000,000", "800"],
        ["3105", "穩懋", "280", "-3", "283", "285", "278", "281", "4,500,000", "1,260,000,000", "5,200"],
      ],
    }],
  },
});

assert.equal(tpex.ordinarySymbolCount, 2);
assert.deepEqual(tpex.rows.map((x) => x.symbol), ["3105", "6488"]);
assert.equal(tpex.rows[0].change, -3);
assert.equal(tpex.rows[1].volumeShares, 1500000);
assert.equal(tpex.rows[1].tradeValue, 600000000);
assert.equal(tpex.universeEvidenceSemantics.includes("SURVIVORSHIP"), true);

const tpexFallback = await normalizeOfficialFullMarketDailyPayloadV0_1({
  market: "TPEX",
  marketDate: "2020-01-03",
  observedAt: "2026-09-28T13:00:00Z",
  payload: {
    aaData: [
      ["6488", "環球晶", "402", "2", "400", "406", "399", "403", "1,200,000", "482,400,000", "1,900"],
    ],
  },
});
assert.equal(tpexFallback.ordinarySymbolCount, 1);
assert.equal(tpexFallback.rows[0].open, 400);

await assert.rejects(
  () => normalizeOfficialFullMarketDailyPayloadV0_1({
    market: "TWSE",
    marketDate: "2020-01-02",
    observedAt: "2026-09-28T13:00:00Z",
    payload: {
      fields: [
        "證券代號", "證券名稱", "成交股數", "成交筆數", "成交金額",
        "開盤價", "最高價", "最低價", "收盤價", "漲跌(+/-)", "漲跌價差",
      ],
      data: [
        ["2330", "台積電", "1", "1", "1", "340", "330", "335", "338", "+", "1"],
      ],
    },
  }),
  /inconsistent OHLC/,
);

console.log("System2 official full-market daily history adapter v0.1 tests passed");
