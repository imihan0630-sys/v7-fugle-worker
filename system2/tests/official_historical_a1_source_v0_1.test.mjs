import assert from "node:assert/strict";
import {
  buildOfficialHistoricalA1UrlV0_1,
  buildOfficialHistoricalA1FallbackUrlsV0_1,
  parseOfficialHistoricalA1PayloadV0_1,
  officialHistoricalA1SourceContractV0_1,
  fetchOfficialHistoricalA1DateV0_1,
} from "../runtime/official_historical_a1_source_v0_1.mjs";

const observedAt = "2026-09-28T12:00:00Z";

const twsePayload2017 = {
  stat: "OK",
  date: "20170103",
  tables: [
    {
      title: "106年01月03日 每日收盤行情(全部(不含權證、牛熊證、可展延牛熊證))",
      fields: [
        "證券代號", "證券名稱", "成交股數", "成交筆數", "成交金額",
        "開盤價", "最高價", "最低價", "收盤價", "漲跌(+/-)", "漲跌價差",
      ],
      data: [
        ["2330", "台積電", "32,000,000", "12,000", "5,920,000,000", "181.50", "185.50", "181.00", "185.00", "+", "4.00"],
        ["0050", "元大台灣50", "2,331,431", "451", "167,301,490", "71.70", "71.90", "71.50", "71.90", "+", "0.10"],
        ["00631L", "元大台灣50正2", "1000", "1", "10000", "10", "10", "10", "10", "+", "0.1"],
      ],
    },
  ],
};

const twse = parseOfficialHistoricalA1PayloadV0_1({
  market: "TWSE",
  marketDate: "2017-01-03",
  payload: twsePayload2017,
  observedAt,
});
assert.equal(twse.state, "READY");
assert.equal(twse.sourceDateEvidence, "2017-01-03");
assert.equal(twse.ordinarySymbolCount, 1);
assert.equal(twse.rows[0].symbol, "2330");
assert.equal(twse.rows[0].companyName, "台積電");
assert.equal(twse.rows[0].volumeShares, 32000000);
assert.equal(twse.rows[0].tradeValue, 5920000000);
assert.equal(twse.rows[0].continuityState, "UNVERIFIED");
assert.equal(twse.rows[0].availableAt, "2017-01-03T05:30:00Z");
assert.equal(twse.historicalPublicationTimestampProven, false);

const tpexPayload2017 = {
  date: "20170103",
  tables: [
    {
      title: "上櫃股票行情",
      date: "106/01/03",
      fields: [
        "代號", "名稱", "收盤", "漲跌", "開盤", "最高", "最低", "均價",
        "成交股數", "成交金額(元)", "成交筆數", "最後買價", "最後賣價",
        "發行股數", "次日 參考價", "次日 漲停價", "次日 跌停價",
      ],
      data: [
        ["6488", "環球晶", "80.50", "+1.00", "79.50", "81.50", "79.00", "80.20", "1,500,000", "120,300,000", "2,100", "80.40", "80.50", "100,000,000", "80.50", "88.50", "72.50"],
        ["006201", "元大富櫃50", "11.00", "-0.01", "11.00", "11.00", "11.00", "11.00", "5,000", "55,000", "4", "11.01", "11.05", "25,946,000", "11.00", "12.10", "9.90"],
      ],
    },
  ],
  stat: "ok",
};

const tpex = parseOfficialHistoricalA1PayloadV0_1({
  market: "TPEX",
  marketDate: "2017-01-03",
  payload: tpexPayload2017,
  observedAt,
});
assert.equal(tpex.state, "READY");
assert.equal(tpex.sourceDateEvidence, "2017-01-03");
assert.equal(tpex.ordinarySymbolCount, 1);
assert.equal(tpex.rows[0].symbol, "6488");
assert.equal(tpex.rows[0].open, 79.5);
assert.equal(tpex.rows[0].high, 81.5);
assert.equal(tpex.rows[0].low, 79);
assert.equal(tpex.rows[0].close, 80.5);
assert.equal(tpex.rows[0].transactions, 2100);

assert.equal(
  buildOfficialHistoricalA1UrlV0_1("TWSE", "2017-01-03"),
  "https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=20170103&type=ALLBUT0999",
);
assert.equal(
  buildOfficialHistoricalA1UrlV0_1("TPEX", "2017-01-03"),
  "https://www.tpex.org.tw/www/zh-tw/afterTrading/dailyQuotes?response=json&date=2017%2F01%2F03",
);
const tpexFallbackUrls = buildOfficialHistoricalA1FallbackUrlsV0_1("TPEX", "2017-01-03");
assert.equal(tpexFallbackUrls.length, 1);
assert.match(tpexFallbackUrls[0], /otc_quotes_no1430\/stk_wn1430_result\.php/);
assert.match(tpexFallbackUrls[0], /d=106%2F01%2F03/);
assert.deepEqual(buildOfficialHistoricalA1FallbackUrlsV0_1("TWSE", "2017-01-03"), []);

assert.equal(
  officialHistoricalA1SourceContractV0_1("TWSE").sourceDateMustMatchRequestedDate,
  true,
);
assert.equal(
  officialHistoricalA1SourceContractV0_1("TPEX").fetchMode,
  "ONE_MARKET_ONE_TRADING_DATE",
);

await assert.rejects(
  async () => parseOfficialHistoricalA1PayloadV0_1({
    market: "TPEX",
    marketDate: "2017-01-03",
    payload: {
      ...tpexPayload2017,
      date: "20260924",
      tables: [{ ...tpexPayload2017.tables[0], date: "115/09/24" }],
    },
    observedAt,
  }),
  /SOURCE_DATE_MISMATCH:TPEX:requested=2017-01-03:received=2026-09-24/,
);

assert.throws(
  () => parseOfficialHistoricalA1PayloadV0_1({
    market: "TWSE",
    marketDate: "2017-01-03",
    payload: { stat: "OK", date: "20170103", tables: [] },
    observedAt,
  }),
  /daily table not found/,
);

let attempts = 0;
const retried = await fetchOfficialHistoricalA1DateV0_1({
  market: "TWSE",
  marketDate: "2017-01-03",
  observedAt,
  retryAttempts: 3,
  retryDelayMs: 0,
  fetchImpl: async () => {
    attempts += 1;
    if (attempts === 1) throw new TypeError("terminated");
    return {
      ok: true,
      status: 200,
      json: async () => twsePayload2017,
    };
  },
});
assert.equal(attempts, 2);
assert.equal(retried.ordinarySymbolCount, 1);

let hasReceivedPayload=false;
let dynamicStampCalls=0;
const dynamicallyObserved=await fetchOfficialHistoricalA1DateV0_1({
  market:"TWSE",marketDate:"2017-01-03",
  observedAt:()=>{
    assert.equal(hasReceivedPayload,true,"observation clock must run after source payload arrives");
    dynamicStampCalls+=1;
    return "2026-10-08T10:59:21Z";
  },
  fetchImpl:async()=>({ok:true,status:200,json:async()=>{hasReceivedPayload=true;return twsePayload2017;}}),
});
assert.equal(dynamicStampCalls,1);
assert.equal(dynamicallyObserved.rows[0].observedAt,"2026-10-08T10:59:21Z");
assert.equal(retried.transportMode, "PRIMARY");

let tpexTransportAttempts = [];
await assert.rejects(
  () => fetchOfficialHistoricalA1DateV0_1({
    market: "TPEX",
    marketDate: "2017-01-03",
    observedAt,
    retryAttempts: 2,
    retryDelayMs: 0,
    fetchImpl: async (url) => {
      tpexTransportAttempts.push(url);
      assert.match(String(url), /\/www\/zh-tw\/afterTrading\/dailyQuotes/);
      return { ok: false, status: 520, json: async () => ({}) };
    },
  }),
  /source exhausted transports/,
);
assert.equal(tpexTransportAttempts.length, 2, "TPEx canonical source retries primary only");
assert.equal(
  officialHistoricalA1SourceContractV0_1("TPEX").canonicalTransportPolicy,
  "PRIMARY_ONLY_FAIL_CLOSED_NON_EQUIVALENT_LEGACY",
);
assert.equal(
  officialHistoricalA1SourceContractV0_1("TPEX").legacyFallbackCanonicalEligible,
  false,
);

let integrityAttempts = 0;
await assert.rejects(
  () => fetchOfficialHistoricalA1DateV0_1({
    market: "TPEX",
    marketDate: "2017-01-03",
    observedAt,
    retryAttempts: 3,
    retryDelayMs: 0,
    fetchImpl: async () => {
      integrityAttempts += 1;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          ...tpexPayload2017,
          date: "20260924",
          tables: [{ ...tpexPayload2017.tables[0], date: "115/09/24" }],
        }),
      };
    },
  }),
  /SOURCE_DATE_MISMATCH/,
);
assert.equal(integrityAttempts, 1, "data-integrity failures must not be retried");

console.log("System2 official historical A1 source adapter v0.1 tests passed");
