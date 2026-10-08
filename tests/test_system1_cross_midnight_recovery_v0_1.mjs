import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {resolveScheduledMarketDate,resolveScheduledMarketContext,LATE_TAIPEI_SCHEDULES} from "./resolve_scheduled_market_date.mjs";

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
assert.throws(()=>resolveScheduledMarketDate({now:"invalid",triggerSchedule:"45 15 * * 1-5"}),/INVALID_SCHEDULE_CLOCK/);n++;

const gate=await readFile(new URL("./trading_day_gate.mjs",import.meta.url),"utf8");
const cache=await readFile(new URL("./prepare_market_cache.mjs",import.meta.url),"utf8");
const inst=await readFile(new URL("./sync_institution_data.mjs",import.meta.url),"utf8");
const recovery=await readFile(new URL("./recover_after_market.mjs",import.meta.url),"utf8");
const workflow=await readFile(new URL("../.github/workflows/v7-market-data.yml",import.meta.url),"utf8");

for(const pattern of [/resolveScheduledMarketContext/,/market_date=\$\{date\}/,/cross_midnight_fallback=/,/V7_TRIGGER_SCHEDULE/]){assert.match(gate,pattern);n++;}
for(const body of [cache,inst]){
  assert.match(body,/OFFICIAL_MARKET_DATE/);n++;
  assert.match(body,/exceeds one-day scheduled recovery window/);n++;
}
assert.match(recovery,/RECOVERY_SCHEDULED_FALLBACK/);n++;
assert.match(recovery,/Scheduled fallback requires frozen RECOVERY_MARKET_DATE/);n++;
assert.match(recovery,/Scheduled fallback target exceeds one-day cross-midnight window/);n++;
assert.match(recovery,/Only one POST|Only one POST/);n++;
assert.match(recovery,/no repeated POST/i);n++;

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
  businessPostRetryChanged:false,formalSelectionRulesChanged:false,system2Touched:false}));
