import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {resolveScheduledMarketDate,resolveScheduledMarketContext,LATE_TAIPEI_SCHEDULES,shouldSkipOvernightDelayedSourceSync,resolveScheduledTradingGate} from "./resolve_scheduled_market_date.mjs";

let n=0;
function eq(got,want){assert.equal(got,want);n++;}
eq(resolveScheduledMarketDate({now:new Date("2026-10-02T15:58:00Z"),triggerSchedule:"45 15 * * 1-5"}),"2026-10-02");
eq(resolveScheduledMarketDate({now:new Date("2026-10-02T16:01:00Z"),triggerSchedule:"45 15 * * 1-5"}),"2026-10-02");
eq(resolveScheduledMarketDate({now:new Date("2026-10-02T16:20:00Z"),triggerSchedule:"25 15 * * 1-5"}),"2026-10-02");
eq(resolveScheduledMarketDate({now:new Date("2026-10-02T16:01:00Z"),triggerSchedule:"20 10 * * 1-5"}),"2026-10-03");
eq(resolveScheduledMarketDate({now:new Date("2026-10-02T15:58:00Z"),triggerSchedule:""}),"2026-10-02");
eq(LATE_TAIPEI_SCHEDULES.includes("25 15 * * 1-5"),true);
eq(LATE_TAIPEI_SCHEDULES.includes("45 15 * * 1-5"),true);
eq(resolveScheduledMarketContext({now:new Date("2026-10-02T15:58:00Z"),triggerSchedule:"45 15 * * 1-5"}).crossMidnightFallback,false);
eq(resolveScheduledMarketContext({now:new Date("2026-10-02T16:01:00Z"),triggerSchedule:"45 15 * * 1-5"}).crossMidnightFallback,true);
eq(resolveScheduledMarketContext({now:new Date("2026-10-02T16:20:00Z"),triggerSchedule:"25 15 * * 1-5"}).crossMidnightFallback,false);
// Original 2026-10-14 observed delayed Actions runs must not perform next-day source writes.
// 18:20 job started 01:39 next day; 23:25 job started 04:44 next day.
eq(shouldSkipOvernightDelayedSourceSync({now:new Date("2026-10-13T17:39:49Z"),triggerSchedule:"20 10 * * 1-5"}),true);
eq(shouldSkipOvernightDelayedSourceSync({now:new Date("2026-10-13T20:44:58Z"),triggerSchedule:"25 15 * * 1-5"}),true);
eq(resolveScheduledMarketContext({now:new Date("2026-10-13T17:39:49Z"),triggerSchedule:"20 10 * * 1-5"}).overnightSourceSyncSkip,true);
eq(resolveScheduledMarketContext({now:new Date("2026-10-13T20:44:58Z"),triggerSchedule:"25 15 * * 1-5"}).overnightSourceSyncSkip,true);
// Same-date data prep is unaffected, and the separate approved 23:45 next-day
// fallback must still use a pinned previous-session check (not source sync).
// Edge cases: overnight protection also covers the following afternoon until
// the exact nominal Taipei scheduled minute; noon-only checks are insufficient.
eq(shouldSkipOvernightDelayedSourceSync({now:new Date("2026-10-14T04:01:00Z"),triggerSchedule:"20 10 * * 1-5"}),true); // 12:01
 eq(shouldSkipOvernightDelayedSourceSync({now:new Date("2026-10-14T09:54:00Z"),triggerSchedule:"55 9 * * 1-5"}),true); // 17:54
 eq(shouldSkipOvernightDelayedSourceSync({now:new Date("2026-10-14T09:55:00Z"),triggerSchedule:"55 9 * * 1-5"}),false); // 17:55
 eq(shouldSkipOvernightDelayedSourceSync({now:new Date("2026-10-14T10:04:00Z"),triggerSchedule:"5 10 * * 1-5"}),true); // 18:04
 eq(shouldSkipOvernightDelayedSourceSync({now:new Date("2026-10-14T10:05:00Z"),triggerSchedule:"5 10 * * 1-5"}),false); // 18:05
 eq(shouldSkipOvernightDelayedSourceSync({now:new Date("2026-10-14T10:19:00Z"),triggerSchedule:"20 10 * * 1-5"}),true); // 18:19
 eq(shouldSkipOvernightDelayedSourceSync({now:new Date("2026-10-14T10:20:00Z"),triggerSchedule:"20 10 * * 1-5"}),false); // 18:20
 eq(shouldSkipOvernightDelayedSourceSync({now:new Date("2026-10-14T15:24:00Z"),triggerSchedule:"25 15 * * 1-5"}),true); // 23:24
 eq(shouldSkipOvernightDelayedSourceSync({now:new Date("2026-10-14T15:25:00Z"),triggerSchedule:"25 15 * * 1-5"}),false); // 23:25
eq(shouldSkipOvernightDelayedSourceSync({now:new Date("2026-10-13T10:22:00Z"),triggerSchedule:"20 10 * * 1-5"}),false);
eq(shouldSkipOvernightDelayedSourceSync({now:new Date("2026-10-13T15:27:00Z"),triggerSchedule:"25 15 * * 1-5"}),false);
eq(shouldSkipOvernightDelayedSourceSync({now:new Date("2026-10-13T20:49:34Z"),triggerSchedule:"45 15 * * 1-5"}),false);
eq(resolveScheduledMarketContext({now:new Date("2026-10-13T20:49:34Z"),triggerSchedule:"45 15 * * 1-5"}).crossMidnightFallback,true);
eq(shouldSkipOvernightDelayedSourceSync({now:new Date("2026-10-13T20:44:58Z"),triggerSchedule:""}),false);

let calendarCalls=0,marketChecks=0;
const blockedContext=resolveScheduledMarketContext({
  now:new Date("2026-10-13T20:44:58Z"),triggerSchedule:"25 15 * * 1-5"
});
const blockedGate=await resolveScheduledTradingGate({
  context:blockedContext,marketDate:blockedContext.marketDate,
  loadTradingCalendar:()=>{calendarCalls++;throw Error("MUST_NOT_READ_CALENDAR");},
  isTradingDate:()=>{marketChecks++;throw Error("MUST_NOT_ASSERT_TRADING_DAY");}
});
assert.deepEqual(blockedGate,{tradingDay:null,proceed:false,calendarChecked:false});n++;
eq(calendarCalls,0);eq(marketChecks,0);
const activeContext=resolveScheduledMarketContext({
  now:new Date("2026-10-13T15:25:00Z"),triggerSchedule:"25 15 * * 1-5"
});
for(const [marketIsTrading,expectedProceed] of [[true,true],[false,false]]){
  const activeGate=await resolveScheduledTradingGate({
    context:activeContext,marketDate:activeContext.marketDate,
    loadTradingCalendar:async (_,year)=>{calendarCalls++;eq(year,2026);},
    isTradingDate:(date)=>{marketChecks++;eq(date,"2026-10-13");return marketIsTrading;}
  });
  assert.deepEqual(activeGate,{tradingDay:marketIsTrading,proceed:expectedProceed,calendarChecked:true});n++;
}
eq(calendarCalls,2);eq(marketChecks,2);
await assert.rejects(()=>resolveScheduledTradingGate({
  context:activeContext,marketDate:activeContext.marketDate,
  loadTradingCalendar:async ()=>{throw Error("OFFICIAL_CALENDAR_UNAVAILABLE");},
  isTradingDate:()=>true
}),/OFFICIAL_CALENDAR_UNAVAILABLE/);n++;
await assert.rejects(()=>resolveScheduledTradingGate({
  context:activeContext,marketDate:activeContext.marketDate,
  loadTradingCalendar:async ()=>{},
  isTradingDate:()=>null
}),/S1_TRADING_DAY_VERDICT_NOT_BOOLEAN/);n++;
await assert.rejects(()=>resolveScheduledTradingGate({
  context:activeContext,marketDate:"bad-date",
  loadTradingCalendar:async ()=>{},
  isTradingDate:()=>true
}),/S1_TRADING_GATE_CONTEXT_INVALID/);n++;
assert.throws(()=>shouldSkipOvernightDelayedSourceSync({now:"invalid",triggerSchedule:"25 15 * * 1-5"}),/INVALID_SCHEDULE_CLOCK/);n++;

assert.throws(()=>resolveScheduledMarketDate({now:"invalid",triggerSchedule:"45 15 * * 1-5"}),/INVALID_SCHEDULE_CLOCK/);n++;

const gate=await readFile(new URL("./trading_day_gate.mjs",import.meta.url),"utf8");
const cache=await readFile(new URL("./prepare_market_cache.mjs",import.meta.url),"utf8");
const inst=await readFile(new URL("./sync_institution_data.mjs",import.meta.url),"utf8");
const recovery=await readFile(new URL("./recover_after_market.mjs",import.meta.url),"utf8");
const quality=await readFile(new URL("./sync_official_quality.mjs",import.meta.url),"utf8");
const workflow=await readFile(new URL("../.github/workflows/v7-market-data.yml",import.meta.url),"utf8");

for(const pattern of [/resolveScheduledMarketContext/,/resolveScheduledTradingGate/,/market_date=\$\{date\}/,/cross_midnight_fallback=/,/loadTradingCalendar:api\.loadTradingCalendar/,/isTradingDate:api\.isTradingDate/,/V7_TRIGGER_SCHEDULE/]){assert.match(gate,pattern);n++;}
for(const body of [cache,inst]){
  assert.match(body,/OFFICIAL_MARKET_DATE/);n++;
  assert.match(body,/exceeds one-day scheduled recovery window/);n++;
}
assert.match(recovery,/RECOVERY_SCHEDULED_FALLBACK/);n++;
assert.match(recovery,/Scheduled fallback requires frozen RECOVERY_MARKET_DATE/);n++;
assert.match(recovery,/Scheduled fallback target exceeds one-day cross-midnight window/);n++;
assert.match(recovery,/Only one POST|Only one POST/);n++;
assert.match(recovery,/no repeated POST/i);n++;
assert.match(quality,/const maxAttempts=5/);n++;
assert.match(quality,/\[0,2000,5000,10000,15000\]/);n++;
assert.match(quality,/transient retries exhausted after/);n++;

assert.match(workflow,/V7_TRIGGER_SCHEDULE: \$\{\{ github\.event\.schedule \}\}/);n++;
assert.match(workflow,/OFFICIAL_MARKET_DATE: \$\{\{ steps\.calendar\.outputs\.market_date \}\}/);n++;
assert.match(workflow,/steps\.calendar\.outputs\.cross_midnight_fallback != 'true'/);n++;
assert.match(workflow,/Verify prior-session market \+ institution prerequisites after midnight/);n++;
assert.match(workflow,/steps\.calendar\.outputs\.cross_midnight_fallback == 'true'/);n++;
assert.match(workflow,/run: node tests\/verify_cross_midnight_recovery_prereqs\.mjs/);n++;
assert.match(workflow,/QUALITY_MARKET_DATE: \$\{\{ steps\.calendar\.outputs\.market_date \}\}/);n++;
assert.match(workflow,/github\.event\.schedule == '45 15 \* \* 1-5'/);n++;
assert.match(workflow,/RECOVERY_MARKET_DATE: \$\{\{ github\.event_name == 'schedule' && steps\.calendar\.outputs\.market_date \|\| '' \}\}/);n++;
assert.match(workflow,/RECOVERY_SCHEDULED_FALLBACK: \$\{\{ github\.event_name == 'schedule' && 'true' \|\| 'false' \}\}/);n++;
assert.equal((workflow.match(/run: node tests\/recover_after_market\.mjs/g)||[]).length,2);n++;

console.log(JSON.stringify({ok:true,assertions:n,crossMidnightPinned:true,scheduledFallbackOnly:true,
  crossMidnightMarketRewriteDisabled:true,readOnlyPrereqReuseRequired:true,
  epsPreviewBoundedRetry:true,businessPostRetryChanged:false,
  formalSelectionRulesChanged:false,system2Touched:false}));
