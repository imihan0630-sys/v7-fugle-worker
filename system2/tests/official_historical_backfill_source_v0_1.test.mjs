import assert from "node:assert/strict";
import {
  buildOfficialTradingDatesV0_1,
  fetchOfficialHistoricalA1RangeV0_1,
  buildOfficialBackfillSourceContractsV0_1,
} from "../runtime/official_historical_backfill_source_v0_1.mjs";

const calendar2017 = {
  year: 2017,
  holidays: ["2017-01-02"],
  source: "TWSE_OFFICIAL_HOLIDAY_SCHEDULE",
  queryYearVerified: true,
};

const trading = await buildOfficialTradingDatesV0_1({
  fromDate: "2017-01-01",
  toDate: "2017-01-05",
  calendarsByYear: { 2017: calendar2017 },
  fetchImpl: null,
});
assert.deepEqual(trading.tradingDates, ["2017-01-03", "2017-01-04", "2017-01-05"]);

function tpexPayload(date) {
  const compact = date.replaceAll("-", "");
  const [year, month, day] = date.split("-").map(Number);
  const roc = `${year - 1911}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`;
  return {
    date: compact,
    stat: "ok",
    tables: [{
      title: "上櫃股票行情",
      date: roc,
      fields: ["代號","名稱","收盤","漲跌","開盤","最高","最低","均價","成交股數","成交金額(元)","成交筆數"],
      data: [["6488","環球晶","80.5","+1","79.5","81.5","79","80.2","1,500,000","120,300,000","2,100"]],
    }],
  };
}

const requestedDates = [];
const result = await fetchOfficialHistoricalA1RangeV0_1({
  market: "TPEX",
  fromDate: "2017-01-01",
  toDate: "2017-01-05",
  observedAt: "2026-09-28T12:30:00Z",
  includeRowProvenance: true,
  calendarsByYear: { 2017: calendar2017 },
  fetchImpl: async (url) => {
    const parsed = new URL(url);
    const date = parsed.searchParams.get("date").replaceAll("/", "-");
    requestedDates.push(date);
    return {
      ok: true,
      status: 200,
      json: async () => tpexPayload(date),
    };
  },
});

assert.deepEqual(requestedDates, ["2017-01-03", "2017-01-04", "2017-01-05"]);
assert.equal(result.noNonTradingDateRequests, true);
assert.equal(result.tradingDateCount, 3);
assert.equal(result.fetchedTradingDateCount, 3);
assert.equal(result.rowCount, 3);
assert.equal(result.rows.every((x) => x.symbol === "6488"), true);
assert.equal(result.rows.every((x) => x.sourceId === "A1_TPEX_DAILY_QUOTES_HISTORICAL"), true);
assert.equal(result.rows.every((x) => /^[0-9a-f]{64}$/.test(x.sourceRowHash)), true);
assert.equal(result.dateReceipts.every((x) => x.state === "READY"), true);

let resilientAttempts=0;
const resilient=await fetchOfficialHistoricalA1RangeV0_1({
  market:"TPEX",
  fromDate:"2017-01-03",
  toDate:"2017-01-03",
  observedAt:"2026-09-28T12:30:00Z",
  calendarsByYear:{2017:calendar2017},
  dateTransportRetryRounds:2,
  dateTransportRetryCooldownMs:0,
  fetchImpl:async(url)=>{
    resilientAttempts+=1;
    assert.match(String(url),/\/www\/zh-tw\/afterTrading\/dailyQuotes/,
      "transport recovery must remain PRIMARY-only");
    if(resilientAttempts<=3) return {ok:false,status:520,json:async()=>({})};
    return {ok:true,status:200,json:async()=>tpexPayload("2017-01-03")};
  },
});
assert.equal(resilientAttempts,4,
  "first PRIMARY round exhausts 3 inner attempts; second range round succeeds on first attempt");
assert.equal(resilient.transportRecoveryCount,1);
assert.equal(resilient.dateReceipts[0].transportRecoveryRound,1);
assert.equal(resilient.dateReceipts[0].transportMode,"PRIMARY");
assert.equal(resilient.transportRetryPolicy,"PRIMARY_ONLY_RETRY_AFTER_TRANSPORT_EXHAUSTION");

const legacyCompatible = await fetchOfficialHistoricalA1RangeV0_1({
  market: "TPEX",
  fromDate: "2017-01-03",
  toDate: "2017-01-03",
  observedAt: "2026-09-28T12:30:00Z",
  calendarsByYear: { 2017: calendar2017 },
  fetchImpl: async () => ({ ok: true, status: 200, json: async () => tpexPayload("2017-01-03") }),
});
assert.equal(legacyCompatible.rows[0].sourceRowHash, undefined,
  "legacy inline-pack callers must retain their previously frozen canonical payload");

// Exact official month calendars must take precedence over weekday/holiday guesses.
const exact2026={year:2026,tradingDates:["2026-07-08","2026-07-09","2026-07-13"],source:"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL",tradingDatesExact:true};
const exactRequested=[];
const exactResult=await fetchOfficialHistoricalA1RangeV0_1({
  market:"TPEX",fromDate:"2026-07-08",toDate:"2026-07-13",
  calendarsByYear:{2026:exact2026},
  fetchImpl:async url=>{
    const date=new URL(url).searchParams.get("date").replaceAll("/","-");
    exactRequested.push(date);
    return {ok:true,status:200,json:async()=>tpexPayload(date)};
  },
});
assert.deepEqual(exactRequested,["2026-07-08","2026-07-09","2026-07-13"]);
assert.equal(exactRequested.includes("2026-07-10"),false,"unscheduled trading date must not be requested");
assert.equal(exactResult.tradingDateCount,3);


let observedTicks=0;
const observedRange=await fetchOfficialHistoricalA1RangeV0_1({
  market:"TPEX",fromDate:"2017-01-03",toDate:"2017-01-04",
  calendarsByYear:{2017:calendar2017},
  observedAtFactory:()=>{
    observedTicks+=1;
    return observedTicks===1?"2026-10-08T10:59:01Z":"2026-10-08T10:59:02Z";
  },
  fetchImpl:async url=>({
    ok:true,status:200,
    json:async()=>tpexPayload(new URL(url).searchParams.get("date").replaceAll("/","-")),
  }),
});
assert.equal(observedTicks,2);
assert.deepEqual(observedRange.rows.map(r=>r.observedAt),["2026-10-08T10:59:01Z","2026-10-08T10:59:02Z"]);
await assert.rejects(
  ()=>fetchOfficialHistoricalA1RangeV0_1({market:"TWSE",observedAtFactory:"invalid"}),
  /observedAtFactory must be a function/,
);

const contracts = buildOfficialBackfillSourceContractsV0_1();
assert.equal(contracts.TWSE.authenticationRequired, false);
assert.equal(contracts.TPEX.historicalDateRequired, true);

console.log("System2 official historical range backfill source v0.1 tests passed");
