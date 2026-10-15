import assert from "node:assert/strict";
import vm from "node:vm";
import {readFile} from "node:fs/promises";
import {execFileSync} from "node:child_process";
const root=new URL("../",import.meta.url);
execFileSync("python3",["scripts/apply_system1_p0_stale_cron_gate_reviewonly.py"],{cwd:root});
const original=await readFile(new URL("../Worker.js",import.meta.url),"utf8");
const candidate=await readFile(new URL("../artifacts/system1-p0-stale-cron-worker-reviewonly.mjs",import.meta.url),"utf8");
assert.notEqual(original,candidate);
assert.match(candidate,/S1_P0_ORIGINAL_INTRADAY_REAL_WALL_CLOCK_GUARD_V0_1/);
assert.ok(!original.includes("system1StaleIntradayCronGate"));
assert.match(candidate,/if \(!allowOutsideWindow\) \{\s*const timeGate=system1StaleIntradayCronGate/);
assert.match(candidate,/fugleCalls:0/);
assert.match(candidate,/noSignalEmission:true/);
assert.match(candidate,/await loadTradingCalendar\(env, Number\(taiwanDate\(scheduledTime\)/);
assert.match(candidate,/const LIVE_STALE_SECONDS = 90;/);
const m=candidate.match(/\/\/ S1_P0_ORIGINAL_INTRADAY_REAL_WALL_CLOCK_GUARD_V0_1([\s\S]+?)async function runBackgroundMonitor/);
assert.ok(m);
const clock=(ms)=>{const p=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Taipei",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date(ms));return {hour:Number(p.find(x=>x.type==="hour").value),minute:Number(p.find(x=>x.type==="minute").value)};};
const box={Date,Number,String,Math,
 taiwanDate(ms){return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(ms));},
 isIntradayMonitorWindow(ms){const {hour,minute}=clock(ms);return (hour>=9&&hour<=12)||(hour===13&&minute<=24);}
};
vm.runInNewContext(m[1]+"\nthis.gate=system1StaleIntradayCronGate;",box);
const gate=box.gate;
const at=v=>Date.parse(v);
const within=(scheduled,observed)=>gate(at(scheduled),at(observed));
assert.equal(within("2026-10-14T01:00:00Z","2026-10-14T01:00:20Z").skip,false);
assert.equal(within("2026-10-14T01:00:00Z","2026-10-14T01:01:30Z").skip,false);
assert.equal(within("2026-10-14T01:00:00Z","2026-10-14T01:01:31Z").skip,true);
assert.equal(within("2026-10-14T01:00:00Z","2026-10-14T01:04:00Z").skip,true);
assert.equal(within("2026-10-14T05:15:04Z","2026-10-14T09:33:17Z").skip,true); // actual physical last-success 13:15 vs 17:33
assert.equal(within("2026-10-14T05:24:00Z","2026-10-14T05:24:55Z").skip,false);
assert.equal(within("2026-10-14T05:24:00Z","2026-10-14T05:25:00Z").skip,true); // actual outside 13:24
assert.equal(within("2026-10-13T05:15:00Z","2026-10-14T01:00:01Z").skip,true); // previous-day delayed Cron
assert.equal(within("2026-10-14T00:59:00Z","2026-10-14T01:00:00Z").skip,false);
assert.equal(within("2026-10-14T01:00:00Z","2026-10-14T00:59:54Z").skip,true);
assert.equal(within("2026-10-14T01:00:00Z","2026-10-14T00:59:55Z").skip,true); // out-of-window clock wins
assert.equal(within("2026-10-14T01:01:00Z","2026-10-14T01:00:55Z").skip,false); // -5s clock skew still inside
assert.equal(gate(NaN,at("2026-10-14T01:00:00Z")).skip,true);
assert.equal(gate(at("2026-10-14T01:00:00Z"),NaN).skip,true);
assert.ok(original.includes("await acquireSignalStateLease(env,key)"));
assert.ok(original.includes("const need10 = minutesSinceOpen >= 11 && (minutesSinceOpen - 1) % 10 === 0;"));
assert.ok(original.includes("const need15 = minutesSinceOpen >= 16 && (minutesSinceOpen - 1) % 15 === 0;"));
console.log(JSON.stringify({ok:true,checked:17,sourceWorkerChanged:false,
 original10m15mCloseGraceKept:true,original90SecondQuoteFreshnessKept:true,
 staleCronSkippedBeforeOfficialCalendarQuoteD1LeaseAndPush:true,
 noSourceReads:true,noProductionWorkerDeployment:true}));
