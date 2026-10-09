import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {auditOct08OfficialSourceWindowReadonlyV0_1 as audit,
  OCT08_LATEST_CUTOFF,OCT08_OFFICIAL_TWSE_SESSIONS} from
  "../runtime/oct08_latest_completed_source_gate_v0_1.mjs";

const dates=[...OCT08_OFFICIAL_TWSE_SESSIONS];
const calendar=async()=>({year:2026,month:10,
  source:"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL",
  queryMonthVerified:true,tradingDates:dates});
const rows=(market,marketDate)=>Array.from({
  length:market==="TWSE"?960:710,
},(_,i)=>({symbol:String(1000+i),market,marketDate,
  open:10+i,high:11+i,low:9+i,close:10.5+i,
  volumeShares:100+i,tradeValue:1000+i,transactions:20+i,
  priceSpace:"RAW",continuityState:"UNVERIFIED"}));
const quote=async({market,marketDate})=>({
  state:"READY",market,marketDate,
  sourceId:market==="TWSE"?"A1_TWSE_MI_INDEX_HISTORICAL_DAILY":"A1_TPEX_DAILY_QUOTES_HISTORICAL",
  sourceDateEvidence:marketDate,sourceDateEvidenceBasis:"PAYLOAD_DATE",
  transportMode:"PRIMARY",ordinarySymbolCount:market==="TWSE"?960:710,
  rows:rows(market,marketDate),
});
const good=await audit({fetchCalendar:calendar,fetchDate:quote,pauseMs:0});
assert.equal(OCT08_LATEST_CUTOFF,"2026-10-08");
assert.equal(good.result,"PASS_20261001_08_12_OFFICIAL_SOURCE_DATE_RECEIPTS_ONLY");
assert.equal(good.tradingDateCount,6);
assert.equal(good.sourceReceiptCount,12);
assert.deepEqual(good.officialTwseTradingDates,dates);
assert.deepEqual(good.snapshots.map(x=>x.marketDate),dates.flatMap(d=>[d,d]));
assert.ok(good.snapshots.every(x=>/^[a-f0-9]{64}$/.test(x.normalizedBarSha256)));
assert.equal(good.hotD1PhysicalCoverageCertified,false);
assert.equal(good.originalHistoricalPITFirstKnownAtCertified,false);
assert.equal(good.tpexExactExchangeCalendarIndependentlyCertified,false);
assert.equal(good.d1Requests,0);
assert.equal(good.r2Requests,0);
const check=(fCal=calendar,fQuote=quote)=>audit({fetchCalendar:fCal,fetchDate:fQuote,pauseMs:0});
await assert.rejects(()=>check(async()=>({...await calendar(),
  tradingDates:dates.slice(0,5)})),/OCT1_8_OFFICIAL_EXACT_SESSION_SET_UNEXPECTED/);
await assert.rejects(()=>check(async()=>({...await calendar(),
  tradingDates:[...dates.slice(0,5),"2026-10-09"]})),
  /OCT1_8_OFFICIAL_EXACT_SESSION_SET_UNEXPECTED/);
await assert.rejects(()=>check(async()=>({...await calendar(),queryMonthVerified:false})),
  /Expected values to be strictly equal/);
await assert.rejects(()=>check(calendar,async p=>({...await quote(p),
  transportMode:"LEGACY_JSON_FALLBACK"})),/noncanonical legacy/);
await assert.rejects(()=>check(calendar,async p=>({...await quote(p),
  sourceDateEvidence:"2026-10-02"})),/Expected values to be strictly equal/);
await assert.rejects(()=>check(calendar,async p=>({...await quote(p),
  ordinarySymbolCount:p.market==="TWSE"?900:680})),/unexpected small/);
await assert.rejects(()=>check(calendar,async p=>({...await quote(p),
  rows:[...rows(p.market,p.marketDate).slice(0,-1),rows(p.market,p.marketDate)[0]]})),
  /duplicate stock/);
await assert.rejects(()=>check(calendar,async p=>({...await quote(p),
  state:"NO_DATA"})),/OFFICIAL_SOURCE_NOT_READY/);
await assert.rejects(()=>check(calendar,async p=>({...await quote(p),
  sourceId:"BAD"})),/Expected values to be strictly equal/);
await assert.rejects(()=>check(calendar,async p=>({...await quote(p),
  rows:rows(p.market,p.marketDate).map((x,i)=>i?x:{...x,continuityState:"READY"})})),
  /Expected values to be strictly equal/);
const workflow=await readFile(new URL("../../.github/workflows/system2-oct08-official-source-readonly.yml",import.meta.url),"utf8");
const runner=await readFile(new URL("../scripts/audit_oct08_latest_completed_official_source_readonly_v0_1.mjs",import.meta.url),"utf8");
assert.match(workflow,/workflow_dispatch:/);
assert.match(workflow,/push:[\s\S]*paths:/);
assert.doesNotMatch(workflow,/^\s*schedule:|^\s*workflow_run:/m);
assert.doesNotMatch(workflow,/CLOUDFLARE_ACCOUNT_ID|SYSTEM2_CLOUDFLARE_API_TOKEN|SYSTEM2_R2_ACCESS_KEY_ID/);
assert.doesNotMatch(workflow,/wrangler.*deploy|historical_current_year_segment_backfill/);
assert.match(runner,/auditOct08OfficialSourceWindowReadonlyV0_1/);
assert.doesNotMatch(runner,/\.run\s*\(|\.batch\s*\(|\.putIfAbsent\s*\(/);
console.log("System2 Oct08 six-day two-market official source gate + 10 adversarial cases PASS");
