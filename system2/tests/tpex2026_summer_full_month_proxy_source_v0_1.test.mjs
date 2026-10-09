import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import {probeTpex2026SummerMonthSourceV0_1 as probe}
 from "../runtime/tpex2026_summer_full_month_proxy_source_v0_1.mjs";

const sha=v=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const makeDates=m=>m===7?
 [...Array.from({length:21},(_,i)=>"2026-07-"+String(i+1).padStart(2,"0")),"2026-07-31"]:
 [...Array.from({length:20},(_,i)=>"2026-08-"+String(i+3).padStart(2,"0")),"2026-08-31"];
const makeRows=(date,n=887)=>Array.from({length:n},(_,i)=>({
 market:"TPEX",marketDate:date,symbol:String(1000+i),priceSpace:"RAW",
 continuityState:"UNVERIFIED",open:10+i/100,high:12+i/100,
 low:9+i/100,close:11+i/100,volumeShares:100000+i,
 tradeValue:1000000+i,transactions:100+i,
}));
const rowsSha=rows=>sha(rows.map(r=>[
 r.symbol,r.open,r.high,r.low,r.close,r.volumeShares,r.tradeValue,r.transactions,
]).sort((a,b)=>a[0].localeCompare(b[0])));
const prior=m=>{
 const dates=makeDates(m);
 return{
  schemaVersion:"S2_TPEX2026_CANONICAL_SOURCE_NINE_MONTH_18_SAMPLE_REAL_ACCEPTANCE_20261009_V0_1",
  execution:{runId:37878065621},
  state:"PASS_9_MONTHS_18_CANONICAL_TPEX_SOURCE_SAMPLES_NOT_FULL_RANGE",
  source:{
   monthlyCalendarProxyReceipts:[{
    month:m,twseOfficialSessionCount:dates.length,
    twseTradingDateSetSha256:sha(dates),
   }],
   sampleReceipts:[dates[0],dates.at(-1)].map(d=>({
    month:m,marketDate:d,ordinarySymbolCount:887,
    normalizedBarSha256:rowsSha(makeRows(d)),
   })),
  },
 };
};
const calendar=m=>async()=>({
 year:2026,month:m,queryMonthVerified:true,
 source:"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL",
 tradingDates:makeDates(m),
});
const daily=async({marketDate})=>({
 market:"TPEX",marketDate,sourceDateEvidence:marketDate,
 sourceDateEvidenceBasis:"PAYLOAD_DATE",sourceId:"A1_TPEX_DAILY_QUOTES_HISTORICAL",
 transportMode:"PRIMARY",state:"READY",ordinarySymbolCount:887,
 rows:makeRows(marketDate),
});
const run=(m=7,o={})=>probe({month:m,
 frozenNineMonthEvidence:prior(m),
 calendarFn:calendar(m),dailyFn:daily,pauseMs:0,...o});
for(const month of [7,8]){
 const x=await run(month);
 const count=month===7?22:21;
 assert.equal(x.result,"PASS_"+count+"_OF_"+count+"_TPEX_PRIMARY_ON_TWSE_PROXY_DATES_SOURCE_ONLY");
 assert.equal(x.sourceReceipts.length,count);
 assert.equal(x.previouslyAcceptedSampleMatches,2);
 assert.equal(x.observedStockDateSourceRows,count*887);
 assert.equal(x.physicalD1R2StorageCertified,false);
 assert.equal(x.independentTpexCalendarCertified,false);
 assert.equal(x.cloudflareD1ReadRequests,0);
 const mutations=[
  [{transportMode:"LEGACY_JSON_FALLBACK"},/LEGACY_TPEX_NOT_ACCEPTED/],
  [{sourceDateEvidence:"2026-09-01"},/TPEX_PAYLOAD_DATE_MISMATCH/],
  [{state:"NO_DATA"},/TPEX_CANONICAL_SOURCE_NOT_READY/],
  [{ordinarySymbolCount:699,rows:makeRows(makeDates(month)[0],699)},/IMPLAUSIBLE_TPEX_STOCK_COUNT/],
  [{rows:[...makeRows(makeDates(month)[0]).slice(0,886),makeRows(makeDates(month)[0])[0]]},/DUPLICATE_TPEX_ORDINARY_SYMBOL/],
  [{sourceId:"LEGACY_SOURCE"},/Expected values to be strictly equal/],
 ];
 for(const [mutation,message] of mutations){
  await assert.rejects(()=>run(month,{dailyFn:async v=>({...await daily(v),...mutation})}),message);
 }
 await assert.rejects(()=>run(month,{calendarFn:async()=>({
  ...await calendar(month)(),tradingDates:makeDates(month).slice(1),
 })}),/FROZEN_TWSE_PROXY_MONTH_COUNT_CHANGED/);
 await assert.rejects(()=>run(month,{calendarFn:async()=>({
  ...await calendar(month)(),tradingDates:[...makeDates(month).slice(0,-1),makeDates(month)[0]],
 })}),/DUPLICATE_TRADING_DATE/);
 await assert.rejects(()=>run(month,{dailyFn:async v=>{
  const d=await daily(v);
  return v.marketDate===makeDates(month)[0]?
   {...d,rows:d.rows.map((r,i)=>i===0?{...r,close:r.close+.01}:r)}:d;
 }}),/FROZEN_PRIOR_SAMPLE_ROWSET_DIGEST_CHANGED/);
 await assert.rejects(()=>run(month,{frozenNineMonthEvidence:{
  ...prior(month),state:"UNVERIFIED",
 }}));
}
await assert.rejects(()=>run(9),/Only preregistered/);
const wf=await readFile(new URL(
 "../../.github/workflows/system2-tpex2026-summer-monthly-source-readonly.yml",import.meta.url),"utf8");
const script=await readFile(new URL(
 "../scripts/probe_tpex2026_summer_month_readonly_v0_1.mjs",import.meta.url),"utf8");
assert.match(wf,/month: \[7, 8\]/);
assert.match(wf,/workflow_dispatch:/);
assert.match(wf,/push:[\s\S]*paths:/);
assert.doesNotMatch(wf,/^\s*schedule:|^\s*workflow_run:/m);
assert.doesNotMatch(wf,/CLOUDFLARE_ACCOUNT_ID|SYSTEM2_CLOUDFLARE_API_TOKEN|wrangler.*deploy/);
assert.doesNotMatch(script,/\.run\s*\(|\.batch\s*\(|\.putIfAbsent\s*\(/);
console.log("TPEX_2026_JULY_AUGUST_SOURCE_2_MONTHS_FIXTURE_PASS_PLUS_19_ADVERSARIAL_GUARDS");
