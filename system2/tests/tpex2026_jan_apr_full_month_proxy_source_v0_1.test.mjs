import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import {probeTpex2026SummerMonthSourceV0_1 as probe} from "../runtime/tpex2026_summer_full_month_proxy_source_v0_1.mjs";
const h=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
const mconfig={1:[2,30,21],2:[2,26,12],3:[2,31,22],4:[1,30,20]};
const dates=m=>{const [start,last,n]=mconfig[m],p="2026-"+String(m).padStart(2,"0")+"-";
 return [...Array.from({length:n-1},(_,i)=>p+String(start+i).padStart(2,"0")),p+String(last).padStart(2,"0")];};
const rows=d=>Array.from({length:875},(_,i)=>({
 market:"TPEX",marketDate:d,symbol:String(1000+i),priceSpace:"RAW",continuityState:"UNVERIFIED",
 open:10+i/100,high:11+i/100,low:9+i/100,close:10.5+i/100,
 volumeShares:100000+i,tradeValue:1000000+i,transactions:100+i,
}));
const hashRows=rr=>h(rr.map(r=>[r.symbol,r.open,r.high,r.low,r.close,
 r.volumeShares,r.tradeValue,r.transactions]).sort((a,b)=>a[0].localeCompare(b[0])));
const frozen=m=>({
 schemaVersion:"S2_TPEX2026_CANONICAL_SOURCE_NINE_MONTH_18_SAMPLE_REAL_ACCEPTANCE_20261009_V0_1",
 execution:{runId:37878065621},state:"PASS_9_MONTHS_18_CANONICAL_TPEX_SOURCE_SAMPLES_NOT_FULL_RANGE",
 source:{monthlyCalendarProxyReceipts:[{month:m,twseOfficialSessionCount:dates(m).length,
  twseTradingDateSetSha256:h(dates(m))}],
  sampleReceipts:[dates(m)[0],dates(m).at(-1)].map(d=>({
   month:m,marketDate:d,ordinarySymbolCount:875,normalizedBarSha256:hashRows(rows(d)),
  }))},
});
const cf=m=>async()=>({year:2026,month:m,source:"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL",
 queryMonthVerified:true,tradingDates:dates(m)});
const df=async({marketDate})=>({market:"TPEX",marketDate,state:"READY",
 sourceId:"A1_TPEX_DAILY_QUOTES_HISTORICAL",transportMode:"PRIMARY",
 sourceDateEvidence:marketDate,sourceDateEvidenceBasis:"PAYLOAD_DATE",
 ordinarySymbolCount:875,rows:rows(marketDate)});
const run=(m,o={})=>probe({month:m,frozenNineMonthEvidence:frozen(m),
 calendarFn:cf(m),dailyFn:df,pauseMs:0,...o});
for(const m of [1,2,3,4]){
 const x=await run(m),n=mconfig[m][2];
 assert.equal(x.result,"PASS_"+n+"_OF_"+n+"_TPEX_PRIMARY_ON_TWSE_PROXY_DATES_SOURCE_ONLY");
 assert.equal(x.sourceReceipts.length,n);
 assert.equal(x.previouslyAcceptedSampleMatches,2);
 assert.equal(x.observedStockDateSourceRows,n*875);
 assert.equal(x.cloudflareD1ReadRequests,0);
 assert.equal(x.physicalD1R2StorageCertified,false);
 for(const [mut,re] of [
  [{transportMode:"LEGACY_JSON_FALLBACK"},/LEGACY_TPEX_NOT_ACCEPTED/],
  [{sourceDateEvidence:"2026-09-30"},/TPEX_PAYLOAD_DATE_MISMATCH/],
  [{state:"NO_DATA"},/TPEX_CANONICAL_SOURCE_NOT_READY/],
  [{ordinarySymbolCount:699,rows:rows(dates(m)[0]).slice(0,699)},/IMPLAUSIBLE_TPEX_STOCK_COUNT/],
  [{rows:[...rows(dates(m)[0]).slice(0,874),rows(dates(m)[0])[0]]},/DUPLICATE_TPEX_ORDINARY_SYMBOL/],
 ]){
  await assert.rejects(()=>run(m,{dailyFn:async a=>({...await df(a),...mut})}),re);
 }
 await assert.rejects(()=>run(m,{calendarFn:async()=>({
  ...await cf(m)(),tradingDates:dates(m).slice(1),
 })}),/FROZEN_TWSE_PROXY_MONTH_COUNT_CHANGED/);
 await assert.rejects(()=>run(m,{dailyFn:async a=>{
  const z=await df(a);
  return a.marketDate===dates(m)[0]?{...z,rows:z.rows.map((r,i)=>i===0?{...r,close:r.close+.1}:r)}:z;
 }}),/FROZEN_PRIOR_SAMPLE_ROWSET_DIGEST_CHANGED/);
}
await assert.rejects(()=>run(9),/Only preregistered/);
const wf=await readFile(new URL("../../.github/workflows/system2-tpex2026-jan-apr-monthly-source-readonly.yml",import.meta.url),"utf8");
const script=await readFile(new URL("../scripts/probe_tpex2026_jan_apr_source_readonly_v0_1.mjs",import.meta.url),"utf8");
assert.match(wf,/max-parallel: 2/);
assert.match(wf,/month: \[1, 2, 3, 4\]/);
assert.match(wf,/workflow_dispatch:/);
assert.doesNotMatch(wf,/^\s*schedule:|^\s*workflow_run:/m);
assert.doesNotMatch(wf,/CLOUDFLARE_ACCOUNT_ID|SYSTEM2_CLOUDFLARE_API_TOKEN|wrangler.*deploy/);
assert.doesNotMatch(script,/\.run\s*\(|\.batch\s*\(|\.putIfAbsent\s*\(/);
console.log("TPEX_JAN_APR_FOUR_MONTH_POSITIVE_AND_30_ADVERSARIAL_FAIL_CLOSED_PASS");
