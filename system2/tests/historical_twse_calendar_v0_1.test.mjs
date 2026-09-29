import assert from "node:assert/strict";
import {
  historicalTwseCalendarUrls,
  historicalTwseMonthlyTradingReportUrl,
  parseHistoricalTwseCalendarV0_1,
  parseHistoricalTwseMonthlyTradingDatesV0_1,
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

const fmtqikUrl=historicalTwseMonthlyTradingReportUrl(2017,1);
assert.ok(fmtqikUrl.includes("FMTQIK"));
assert.ok(fmtqikUrl.includes("date=20170101"));

const fmtqikJanuary={
  stat:"OK",
  date:"20170101",
  fields:["日期","成交股數","成交金額","成交筆數","發行量加權股價指數","漲跌點數"],
  data:[
    ["106/01/03","1","2","3","9272.88","19.38"],
    ["106/01/04","1","2","3","9286.96","14.08"],
  ],
};
const january=parseHistoricalTwseMonthlyTradingDatesV0_1(fmtqikJanuary,2017,1);
assert.deepEqual(january.tradingDates,["2017-01-03","2017-01-04"]);
assert.equal(january.source,"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL");

const exactCalendar={
  year:2017,
  holidays:[],
  tradingDates:["2017-01-03","2017-01-04"],
  source:"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL",
};
assert.equal(isHistoricalTradingDateV0_1("2017-01-03",exactCalendar),true);
assert.equal(isHistoricalTradingDateV0_1("2017-01-05",exactCalendar),false);

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

function firstWeekday(year,month){
  for(let day=1;day<=7;day+=1){
    const dow=new Date(Date.UTC(year,month-1,day,12,0,0)).getUTCDay();
    if(dow!==0&&dow!==6)return day;
  }
  throw new Error("weekday fixture failure");
}

function fmtqikFixture(year,month){
  const day=firstWeekday(year,month);
  const rocYear=year-1911;
  const mm=String(month).padStart(2,"0");
  const dd=String(day).padStart(2,"0");
  return {
    stat:"OK",
    date:String(year)+mm+"01",
    fields:["日期","成交股數","成交金額","成交筆數","發行量加權股價指數","漲跌點數"],
    data:[[String(rocYear)+"/"+mm+"/"+dd,"1","2","3","9000","1"]],
  };
}

let fallbackCalls=0;
const fallback=await fetchHistoricalTwseCalendarV0_1({
  year:2017,
  fetchImpl:async (url)=>{
    fallbackCalls+=1;
    if(url.includes("holidaySchedule")){
      return {
        ok:true,
        status:200,
        async json(){
          return {queryYear:2026,data:[["2026-01-01","休市"]]};
        },
      };
    }
    const parsed=new URL(url);
    const anchor=parsed.searchParams.get("date");
    const month=Number(anchor.slice(4,6));
    return {ok:true,status:200,async json(){return fmtqikFixture(2017,month);}};
  },
});
assert.equal(fallbackCalls,14,"two holiday attempts plus twelve FMTQIK months expected");
assert.equal(fallback.source,"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL");
assert.equal(fallback.queryYearConvention,"FMTQIK_MONTHLY");
assert.equal(fallback.tradingDatesExact,true);
assert.equal(fallback.tradingDates.length,12);
assert.equal(fallback.tradingDates.every((date)=>date.startsWith("2017-")),true);

await assert.rejects(
  ()=>Promise.resolve(parseHistoricalTwseMonthlyTradingDatesV0_1({
    ...fmtqikJanuary,
    date:"20260101",
  },2017,1)),
  /payload invalid/,
);

console.log("System2 isolated historical TWSE calendar v0.1 tests passed");
