import assert from "node:assert/strict";
import {
  historicalTwseCalendarUrls,
  parseHistoricalTwseCalendarV0_1,
  isHistoricalTradingDateV0_1,
  fetchHistoricalTwseCalendarV0_1,
} from "../runtime/historical_twse_calendar_v0_1.mjs";

const rocPayload={
  queryYear:106,
  data:[
    ["106/01/02","休市"],
    ["106/01/03","開始交易日"],
    ["106/02/27","休市"],
    ["106/02/28","休市"],
  ],
};
const roc=parseHistoricalTwseCalendarV0_1(rocPayload,2017);
assert.equal(roc.queryYearConvention,"ROC");
assert.deepEqual(roc.holidays,["2017-01-02","2017-02-27","2017-02-28"]);
assert.equal(isHistoricalTradingDateV0_1("2017-01-02",roc),false);
assert.equal(isHistoricalTradingDateV0_1("2017-01-03",roc),true);
assert.equal(isHistoricalTradingDateV0_1("2017-01-07",roc),false);

const gregPayload={
  queryYear:2026,
  data:[
    ["2026-09-25","休市"],
    ["2026-09-29","開始交易日"],
  ],
};
const greg=parseHistoricalTwseCalendarV0_1(gregPayload,2026);
assert.equal(greg.queryYearConvention,"GREGORIAN");
assert.deepEqual(greg.holidays,["2026-09-25"]);

const urls=historicalTwseCalendarUrls(2017);
assert.equal(urls.length,2);
assert.ok(urls[0].url.includes("queryYear=2017"));
assert.ok(urls[1].url.includes("queryYear=106"));

let calls=0;
const fetched=await fetchHistoricalTwseCalendarV0_1({
  year:2017,
  fetchImpl:async (url)=>{
    calls+=1;
    if(url.includes("queryYear=2017")){
      return {ok:true,status:200,async json(){return {queryYear:2017,data:[]};}};
    }
    return {ok:true,status:200,async json(){return rocPayload;}};
  },
});
assert.equal(calls,2);
assert.equal(fetched.queryYearConvention,"ROC");

console.log("System2 isolated historical TWSE calendar v0.1 tests passed");
