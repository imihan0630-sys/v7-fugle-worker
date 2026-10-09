import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {probeTpex2026CanonicalMonthlySourceV0_1 as probe}
  from "../runtime/tpex2026_monthly_canonical_source_probe_v0_1.mjs";

const dates=m=>Array.from({length:3},(_,i)=>
  "2026-"+String(m).padStart(2,"0")+"-"+String(3+i*10).padStart(2,"0"));
const calendarFn=async ({year,month})=>({
  year,month,queryMonthVerified:true,
  source:"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL",
  tradingDates:["03","09","13","20","23"].map(d=>
    "2026-"+String(month).padStart(2,"0")+"-"+d),
});
const rows=date=>Array.from({length:310},(_,i)=>({
  market:"TPEX",marketDate:date,
  symbol:String(1000+i),priceSpace:"RAW",continuityState:"UNVERIFIED",
  open:10+i/100,high:11+i/100,low:9+i/100,close:10.5+i/100,
  volumeShares:100000+i,tradeValue:1000000+i,transactions:125+i,
}));
const dailyFn=async ({market,marketDate})=>({
  market,marketDate,state:"READY",
  sourceId:"A1_TPEX_DAILY_QUOTES_HISTORICAL",
  transportMode:"PRIMARY",sourceDateEvidence:marketDate,
  sourceDateEvidenceBasis:"PAYLOAD_DATE",ordinarySymbolCount:310,
  rows:rows(marketDate),
});
const run=async ({cf=calendarFn,df=dailyFn,pauseMs=0}={})=>
  probe({calendarFn:cf,dailyFn:df,pauseMs});

const observed=[];
const pass=await probe({calendarFn,dailyFn,pauseMs:0,onStage:s=>observed.push(s)});
assert.equal(pass.result,"PASS_9_MONTHS_18_CANONICAL_TPEX_SOURCE_SAMPLES_NOT_FULL_RANGE");
assert.deepEqual([...pass.scopeMonths],[1,2,3,4,5,6,7,8,9]);
assert.equal(pass.months.length,9);
assert.equal(pass.samples.length,18);
assert.equal(observed.filter(s=>s.stage==="SAMPLE_PASS").length,18);
assert.equal(pass.tpexOfficialTradingSessionSetCertified,false);
assert.equal(pass.historicalFirstKnownAtCertified,false);
assert.equal(pass.marketYearCoveragePromoted,false);
assert.equal(pass.cloudflareD1Writes,0);
assert.equal(pass.cloudflareR2Calls,0);
assert.ok(pass.samples.every(x=>/^[a-f0-9]{64}$/.test(x.normalizedBarSha256)));
await assert.rejects(()=>run({cf:async a=>({...await calendarFn(a),
  source:"TPEX_UNVERIFIED"})}),/Expected values to be strictly equal/);
await assert.rejects(()=>run({cf:async a=>({...await calendarFn(a),
  tradingDates:["2026-01-03","2026-01-03","2026-01-13","2026-01-20","2026-01-23"]})}),/duplicate calendar date/);
await assert.rejects(()=>run({cf:async a=>({...await calendarFn(a),
  tradingDates:["2026-02-30","2026-02-30","2026-02-30","2026-02-30","2026-02-30"]})}),/duplicate calendar date|invalid monthly date/);
await assert.rejects(()=>run({df:async a=>({...await dailyFn(a),
  sourceDateEvidence:"2026-05-01"})}),/TPEx payload source date mismatch/);
await assert.rejects(()=>run({df:async a=>({...await dailyFn(a),
  transportMode:"LEGACY_JSON_FALLBACK"})}),/legacy TPEx/);
await assert.rejects(()=>run({df:async a=>({...await dailyFn(a),
  ordinarySymbolCount:299,rows:rows(a.marketDate).slice(0,299)})}),/unexpectedly small/);
await assert.rejects(()=>run({df:async a=>({...await dailyFn(a),
  rows:[...rows(a.marketDate).slice(0,309),rows(a.marketDate)[0]]})}),/duplicate ordinary symbols/);
await assert.rejects(()=>run({df:async a=>({...await dailyFn(a),
  sourceId:"A1_TPEX_LEGACY_QUOTES"})}),/Expected values to be strictly equal/);
await assert.rejects(()=>run({df:async a=>({...await dailyFn(a),
  state:"NO_DATA"})}),/TPEx historical date not READY/);
const wf=await readFile(new URL(
  "../../.github/workflows/system2-tpex2026-canonical-source-readonly.yml",import.meta.url),"utf8");
const runner=await readFile(new URL(
  "../scripts/probe_tpex2026_canonical_source_readonly_v0_1.mjs",import.meta.url),"utf8");
assert.match(wf,/workflow_dispatch:/);
assert.match(wf,/push:[\s\S]*paths:/);
assert.doesNotMatch(wf,/^\s*schedule:|^\s*workflow_run:/m);
assert.match(wf,/\.github\/workflows\/system2-tpex2026-canonical-source-readonly\.yml/);
assert.doesNotMatch(wf,/CLOUDFLARE_ACCOUNT_ID|SYSTEM2_CLOUDFLARE_API_TOKEN|SYSTEM2_R2_ACCESS_KEY_ID/);
assert.doesNotMatch(wf,/system2-historical-current-year-segment-backfill|wrangler.*deploy/i);
assert.match(runner,/probeTpex2026CanonicalMonthlySourceV0_1/);
assert.doesNotMatch(runner,/\.run\s*\(|\.batch\s*\(|\.putIfAbsent\s*\(/);
console.log("System2 TPEx 2026 canonical-source 9-month 18-sample fixture + nine falsification guards PASS");
