import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import {probeTpex2026SepFullProxyDatesV0_1 as probe}
 from "../runtime/tpex2026_september_full_proxy_source_probe_v0_1.mjs";
const h=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
const dates=[...Array.from({length:19},(_,i)=>"2026-09-"+String(i+1).padStart(2,"0")),"2026-09-30"];
const stockRows=d=>Array.from({length:888},(_,i)=>({
 market:"TPEX",marketDate:d,symbol:String(1000+i),priceSpace:"RAW",
 continuityState:"UNVERIFIED",
 open:10+i/100,high:11+i/100,low:9+i/100,close:10.5+i/100,
 volumeShares:100000+i,tradeValue:1000000+i,transactions:10+i,
}));
const hashRows=rows=>h(rows.map(r=>[r.symbol,r.open,r.high,r.low,r.close,
 r.volumeShares,r.tradeValue,r.transactions]).sort((a,b)=>a[0].localeCompare(b[0])));
const prior={schemaVersion:"S2_TPEX2026_CANONICAL_SOURCE_NINE_MONTH_18_SAMPLE_REAL_ACCEPTANCE_20261009_V0_1",
 execution:{runId:37878065621},
 state:"PASS_9_MONTHS_18_CANONICAL_TPEX_SOURCE_SAMPLES_NOT_FULL_RANGE",
 source:{
  monthlyCalendarProxyReceipts:[{month:9,twseOfficialSessionCount:20,
   twseTradingDateSetSha256:h(dates)}],
  sampleReceipts:[dates[0],dates.at(-1)].map(marketDate=>({
   month:9,marketDate,ordinarySymbolCount:888,
   normalizedBarSha256:hashRows(stockRows(marketDate)),
  })),
 }};
const calendarFn=async()=>({
 source:"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL",
 queryMonthVerified:true,year:2026,month:9,tradingDates:dates,
});
const dailyFn=async({marketDate})=>({
 market:"TPEX",marketDate,sourceDateEvidence:marketDate,
 sourceDateEvidenceBasis:"PAYLOAD_DATE",state:"READY",
 sourceId:"A1_TPEX_DAILY_QUOTES_HISTORICAL",transportMode:"PRIMARY",
 ordinarySymbolCount:888,rows:stockRows(marketDate),
});
const run=async(o={})=>probe({frozenEvidence:prior,
 calendarFn,dailyFn,pauseMs:0,...o});
const yes=await run();
assert.equal(yes.result,"PASS_20_OF_20_TWSE_PROXY_DATES_TPEX_CANONICAL_SOURCE_ONLY");
assert.equal(yes.exactDateCount,20);
assert.equal(yes.sourceReceipts.length,20);
assert.equal(yes.stockDateRowsObserved,17760);
assert.equal(yes.priorSeptemberSamplesMatched,2);
assert.equal(yes.physicalD1R2StorageCertified,false);
assert.equal(yes.officialTpexSessionSetCertified,false);
assert.equal(yes.cloudflareD1ReadRequests,0);
for(const [mut,re] of [
 [{transportMode:"LEGACY_JSON_FALLBACK"},/LEGACY_TPEX_SOURCE_NOT_CANONICAL/],
 [{sourceDateEvidence:"2026-08-31"},/TPEX_PRIMARY_PAYLOAD_DATE_MISMATCH/],
 [{ordinarySymbolCount:699,rows:stockRows(dates[0]).slice(0,699)},/ORDINARY_COUNT_UNSAFE/],
 [{rows:[...stockRows(dates[0]).slice(0,887),stockRows(dates[0])[0]]},/DUPLICATE_STOCK_ID/],
 [{sourceId:"TPEX_LEGACY"},/Expected values to be strictly equal/],
 [{state:"NO_DATA"},/TPEX_OFFICIAL_SOURCE_NOT_READY/],
]){
 await assert.rejects(()=>run({dailyFn:async x=>({...await dailyFn(x),...mut})}),re);
}
await assert.rejects(()=>run({calendarFn:async()=>({
 ...await calendarFn(),tradingDates:dates.slice(0,19)})}),/CALENDAR_COUNT_REVISED/);
await assert.rejects(()=>run({calendarFn:async()=>({
 ...await calendarFn(),tradingDates:[...dates.slice(0,19),dates[0]]})}),/DUPLICATE_PROXY_DATE/);
await assert.rejects(()=>run({dailyFn:async x=>({
 ...await dailyFn(x),
 rows:x.marketDate===dates[0]?stockRows(x.marketDate).map((r,i)=>i===0?{...r,close:r.close+1}:r):stockRows(x.marketDate),
})}),/PREVIOUS_SAMPLE_ROWSET_REVISED/);
await assert.rejects(()=>run({frozenEvidence:{...prior,state:"NOT_ACCEPTED"}}));
const wf=await readFile(new URL(
 "../../.github/workflows/system2-tpex2026-september-full-source-readonly.yml",import.meta.url),"utf8");
const runner=await readFile(new URL(
 "../scripts/probe_tpex2026_september_full_proxy_source_readonly_v0_1.mjs",import.meta.url),"utf8");
assert.match(wf,/workflow_dispatch:/);
assert.match(wf,/push:\s*[\s\S]*paths:/);
assert.doesNotMatch(wf,/^\s*schedule:|^\s*workflow_run:/m);
assert.doesNotMatch(wf,/CLOUDFLARE_ACCOUNT_ID|SYSTEM2_CLOUDFLARE_API_TOKEN|wrangler.*deploy/);
assert.doesNotMatch(runner,/\.run\s*\(|\.batch\s*\(|\.putIfAbsent\s*\(/);
console.log("S2 TPEX SEPTEMBER FULL TWSE-PROXY MONTH SOURCE POSITIVE + 11 ADVERSARIAL GUARDS PASS");
