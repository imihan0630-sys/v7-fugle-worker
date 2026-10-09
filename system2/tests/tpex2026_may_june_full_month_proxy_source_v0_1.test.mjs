import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import {probeTpex2026SummerMonthSourceV0_1 as probe}
 from "../runtime/tpex2026_summer_full_month_proxy_source_v0_1.mjs";

const sha=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
const dates=m=>m===5?
 [...Array.from({length:19},(_,i)=>"2026-05-"+String(i+4).padStart(2,"0")),"2026-05-29"]:
 [...Array.from({length:20},(_,i)=>"2026-06-"+String(i+1).padStart(2,"0")),"2026-06-30"];
const rows=d=>Array.from({length:886},(_,i)=>({
 market:"TPEX",marketDate:d,symbol:String(1000+i),priceSpace:"RAW",
 continuityState:"UNVERIFIED",open:10+i/100,high:12+i/100,
 low:9+i/100,close:11+i/100,volumeShares:100000+i,
 tradeValue:1000000+i,transactions:100+i,
}));
const rowhash=rr=>sha(rr.map(r=>[
 r.symbol,r.open,r.high,r.low,r.close,r.volumeShares,r.tradeValue,r.transactions,
]).sort((a,b)=>a[0].localeCompare(b[0])));
const base=m=>({
 schemaVersion:"S2_TPEX2026_CANONICAL_SOURCE_NINE_MONTH_18_SAMPLE_REAL_ACCEPTANCE_20261009_V0_1",
 execution:{runId:37878065621},
 state:"PASS_9_MONTHS_18_CANONICAL_TPEX_SOURCE_SAMPLES_NOT_FULL_RANGE",
 source:{
  monthlyCalendarProxyReceipts:[{month:m,twseOfficialSessionCount:dates(m).length,
   twseTradingDateSetSha256:sha(dates(m))}],
  sampleReceipts:[dates(m)[0],dates(m).at(-1)].map(d=>({
   month:m,marketDate:d,ordinarySymbolCount:886,
   normalizedBarSha256:rowhash(rows(d)),
  })),
 },
});
const cf=m=>async()=>({
 year:2026,month:m,queryMonthVerified:true,
 source:"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL",
 tradingDates:dates(m),
});
const df=async({marketDate})=>({
 market:"TPEX",marketDate,sourceDateEvidence:marketDate,
 sourceDateEvidenceBasis:"PAYLOAD_DATE",
 sourceId:"A1_TPEX_DAILY_QUOTES_HISTORICAL",transportMode:"PRIMARY",
 state:"READY",ordinarySymbolCount:886,rows:rows(marketDate),
});
const run=(m,o={})=>probe({
 month:m,frozenNineMonthEvidence:base(m),calendarFn:cf(m),dailyFn:df,
 pauseMs:0,...o,
});
for(const month of [5,6]){
 const accepted=await run(month);
 const n=month===5?20:21;
 assert.equal(accepted.result,
  "PASS_"+n+"_OF_"+n+"_TPEX_PRIMARY_ON_TWSE_PROXY_DATES_SOURCE_ONLY");
 assert.equal(accepted.twseProxyDateCount,n);
 assert.equal(accepted.sourceReceipts.length,n);
 assert.equal(accepted.observedStockDateSourceRows,n*886);
 assert.equal(accepted.previouslyAcceptedSampleMatches,2);
 assert.equal(accepted.cloudflareD1ReadRequests,0);
 assert.equal(accepted.cloudflareD1Writes,0);
 assert.equal(accepted.cloudflareR2Calls,0);
 assert.equal(accepted.pointInTimeReplayAuthorized,false);
 for(const [mutation,reason] of [
  [{transportMode:"LEGACY_JSON_FALLBACK"},/LEGACY_TPEX_NOT_ACCEPTED/],
  [{sourceDateEvidence:"2026-09-03"},/TPEX_PAYLOAD_DATE_MISMATCH/],
  [{sourceId:"UNVERIFIED"},/Expected values to be strictly equal/],
  [{state:"NO_DATA"},/TPEX_CANONICAL_SOURCE_NOT_READY/],
  [{ordinarySymbolCount:699,rows:rows(dates(month)[0]).slice(0,699)},/IMPLAUSIBLE_TPEX_STOCK_COUNT/],
  [{rows:[...rows(dates(month)[0]).slice(0,885),rows(dates(month)[0])[0]]},/DUPLICATE_TPEX_ORDINARY_SYMBOL/],
 ]){
  await assert.rejects(()=>run(month,{dailyFn:async v=>({...await df(v),...mutation})}),reason);
 }
 await assert.rejects(()=>run(month,{calendarFn:async()=>({
  ...await cf(month)(),tradingDates:dates(month).slice(1),
 })}),/FROZEN_TWSE_PROXY_MONTH_COUNT_CHANGED/);
 await assert.rejects(()=>run(month,{calendarFn:async()=>({
  ...await cf(month)(),tradingDates:[...dates(month).slice(0,-1),dates(month)[0]],
 })}),/DUPLICATE_TRADING_DATE/);
 await assert.rejects(()=>run(month,{dailyFn:async v=>{
  const d=await df(v);
  return v.marketDate===dates(month)[0]?
   {...d,rows:d.rows.map((r,i)=>i===0?{...r,close:r.close+.01}:r)}:d;
 }}),/FROZEN_PRIOR_SAMPLE_ROWSET_DIGEST_CHANGED/);
 await assert.rejects(()=>run(month,{frozenNineMonthEvidence:{
  ...base(month),state:"UNVERIFIED",
 }}));
}
await assert.rejects(()=>run(9),/Only preregistered/);
const wf=await readFile(new URL(
 "../../.github/workflows/system2-tpex2026-may-june-source-readonly.yml",import.meta.url),"utf8");
const runner=await readFile(new URL(
 "../scripts/probe_tpex2026_may_june_source_readonly_v0_1.mjs",import.meta.url),"utf8");
assert.match(wf,/month: \[5, 6\]/);
assert.match(wf,/workflow_dispatch:/);
assert.match(wf,/push:[\s\S]*paths:/);
assert.doesNotMatch(wf,/^\s*schedule:|^\s*workflow_run:/m);
assert.doesNotMatch(wf,/CLOUDFLARE_ACCOUNT_ID|SYSTEM2_CLOUDFLARE_API_TOKEN|wrangler.*deploy/);
assert.doesNotMatch(runner,/\.run\s*\(|\.batch\s*\(|\.putIfAbsent\s*\(/);
console.log("TPEX_2026_MAY_JUNE_SOURCE_TWO_MONTH_POSITIVE_PLUS_21_ADVERSARIAL_CASES_PASS");
