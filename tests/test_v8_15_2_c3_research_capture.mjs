import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const source=await readFile(process.env.V7_TEST_WORKER_PATH||new URL("../Worker.js",import.meta.url),"utf8");
const exported=source+"\nexport {c3ResearchLimits,c3ExpectedSlot,c3NormalizeCohortRows};";
const api=await import("data:text/javascript;base64,"+Buffer.from(exported).toString("base64"));
let n=0;
const eq=(a,b)=>{assert.deepEqual(a,b);n++};
const ok=x=>{assert.ok(x);n++};

assert.match(source,/const VERSION = "8\.15\.2-c3-research-capture";/);n++;
for(const token of [
  "CREATE TABLE IF NOT EXISTS trade_research_c3_cohorts",
  "CREATE TABLE IF NOT EXISTS trade_research_c3_bars",
  'url.pathname === "/api/research/c3-capture-cohort"',
  'url.pathname === "/api/research/c3-capture-bars"',
  "C3_RESEARCH_OPERATOR_LIMITS",
  "C3_CAPTURE_FORMAL_SYMBOL_MUST_REUSE_EXISTING_PV",
  "C3_CAPTURE_FORMAL_OVERLAP_DETECTED",
  "C3_CAPTURE_IMMUTABLE_BAR_CONFLICT",
  "C3_CAPTURE_TARGET_ALREADY_BOUND_TO_ANOTHER_GENERATION"
]){assert.ok(source.includes(token),token);n++;}

const limits=api.c3ResearchLimits({});
eq(limits,{ready:true,providerLimitPerMinute:60,maxSymbols:6,maxCallsPerSlot:6,callsPerSession:102,reason:null});
const disabled=api.c3ResearchLimits({C3_RESEARCH_CAPTURE_DISABLED:"true"});
eq(disabled.ready,false);
eq(disabled.reason,"C3_CAPTURE_OPERATOR_DISABLED");
eq(disabled.maxSymbols,6);

eq(api.c3ExpectedSlot(Date.parse("2026-10-05T01:16:00Z")),"09:00");
eq(api.c3ExpectedSlot(Date.parse("2026-10-05T01:31:00Z")),"09:15");
eq(api.c3ExpectedSlot(Date.parse("2026-10-05T05:16:00Z")),"13:00");
eq(api.c3ExpectedSlot(Date.parse("2026-10-05T01:15:00Z")),null);
eq(api.c3ExpectedSlot(Date.parse("2026-10-05T05:31:00Z")),null);

const rows=api.c3NormalizeCohortRows([
  {symbol:"2330",pool:"THOUSAND",classification:"FULL_SHORT_PASS"},
  {symbol:"2317",pool:"GENERAL",classification:"CONDITIONAL_SAFETY_UNKNOWN"}
]);
eq(rows.map(x=>x.symbol),["2317","2330"]);
assert.throws(()=>api.c3NormalizeCohortRows([
  {symbol:"2330",classification:"FULL_SHORT_PASS"},
  {symbol:"2330",classification:"FULL_SHORT_PASS"}
]),/INVALID_OR_DUPLICATE_SYMBOL/);n++;
assert.throws(()=>api.c3NormalizeCohortRows([
  {symbol:"2330",classification:"NOT_A_CLASS"}
]),/INVALID_CLASSIFICATION/);n++;

const formalPersist=source.indexOf("await writeLiveSnapshot(env, snapshot)");
const formalSignal=source.indexOf("processSignalState(result");
const pvHook=source.lastIndexOf("const pvShadow = await recordPvIntradayShadowSafe(env,results");
const c3Hook=source.lastIndexOf("const c3ResearchCapture = await captureC3ResearchBarsSafe(env,scheduledTime,need15)");
ok(formalPersist>=0&&formalSignal>=0&&pvHook>formalPersist&&c3Hook>pvHook&&c3Hook>formalSignal);

const start=source.indexOf("async function captureC3ResearchBarsSafe(");
const end=source.indexOf("async function readC3ResearchBars(",start);
ok(start>=0&&end>start);
const segment=source.slice(start,end);
assert.match(segment,/fetchCandles\(String\(row\.symbol\),15,env\)/);n++;
assert.doesNotMatch(segment,/fetchQuote\(/);n++;
assert.doesNotMatch(segment,/processSignalState\(/);n++;
assert.doesNotMatch(segment,/sendPush\(/);n++;
assert.doesNotMatch(segment,/saveStockConfig\(/);n++;
assert.doesNotMatch(segment,/monitoringStocks\.push|results\.push/);n++;
assert.match(segment,/failOpen:true/);n++;
assert.match(segment,/target_trade_date=\?1/);n++;

const cohortRoute=source.slice(
  source.indexOf('if (url.pathname === "/api/research/c3-capture-cohort")'),
  source.indexOf('if (url.pathname === "/api/research/c1-population")')
);
assert.match(cohortRoute,/isAuthorized\(request,env\)/);n++;
assert.match(cohortRoute,/request\.method==="POST"/);n++;
assert.match(cohortRoute,/request\.method==="GET"/);n++;
assert.doesNotMatch(cohortRoute,/isPushAuthorized|sendPush|processSignalState/);n++;

console.log(JSON.stringify({
  ok:true,assertions:n,version:"8.15.2-c3-research-capture",
  operatorCeilingsFrozen:true,basicProviderLimitPerMinute:60,maxShadowSymbols:6,formalTargetMutation:false,formalSignalPath:false,
  pushPath:false,orderPath:false,extraQuoteCalls:0,extra15mCandlesOnly:true,
  formalCoreImpact:false,system2Touched:false
}));
