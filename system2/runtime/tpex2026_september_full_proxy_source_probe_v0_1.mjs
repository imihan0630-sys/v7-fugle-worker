// DATA_LANE, Class A: September 2026 TPEx primary source-only 20-date census.
// TWSE FMTQIK is a calendar PROXY, NOT independent TPEx calendar proof.
// No D1/R2, no historical PIT, no runtime or trading promotion.
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {fetchHistoricalTwseMonthlyTradingDatesV0_1} from "./historical_twse_calendar_v0_1.mjs";
import {fetchOfficialHistoricalA1DateV0_1} from "./official_historical_a1_source_v0_1.mjs";

const sha=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
const isoValid=d=>typeof d==="string"&&/^2026-09-\d\d$/.test(d)
 && Number.isFinite(Date.parse(d+"T00:00:00Z"))
 && new Date(d+"T00:00:00Z").toISOString().slice(0,10)===d;
const tuple=r=>[r.symbol,r.open,r.high,r.low,r.close,r.volumeShares,r.tradeValue,r.transactions];
const rowsetSha=rows=>sha(rows.map(tuple).sort((a,b)=>String(a[0]).localeCompare(String(b[0]))));

export async function probeTpex2026SepFullProxyDatesV0_1({
 calendarFn=fetchHistoricalTwseMonthlyTradingDatesV0_1,
 dailyFn=fetchOfficialHistoricalA1DateV0_1,
 frozenEvidence,onStage=()=>{},pauseMs=450,
}={}){
 assert.equal(typeof calendarFn,"function");
 assert.equal(typeof dailyFn,"function");
 assert.equal(typeof onStage,"function");
 assert.ok(Number.isSafeInteger(pauseMs)&&pauseMs>=0&&pauseMs<=2000);
 assert.equal(frozenEvidence?.schemaVersion,
  "S2_TPEX2026_CANONICAL_SOURCE_NINE_MONTH_18_SAMPLE_REAL_ACCEPTANCE_20261009_V0_1");
 assert.equal(frozenEvidence?.execution?.runId,37878065621);
 assert.equal(frozenEvidence?.state,"PASS_9_MONTHS_18_CANONICAL_TPEX_SOURCE_SAMPLES_NOT_FULL_RANGE");
 const sept=frozenEvidence?.source?.monthlyCalendarProxyReceipts?.find(x=>x.month===9);
 const prior=frozenEvidence?.source?.sampleReceipts?.filter(x=>x.month===9);
 assert.equal(sept?.twseOfficialSessionCount,20);
 assert.match(sept?.twseTradingDateSetSha256,/^[a-f0-9]{64}$/);
 assert.ok(Array.isArray(prior)&&prior.length===2);
 assert.deepEqual(prior.map(x=>x.marketDate),["2026-09-01","2026-09-30"]);
 const calendar=await calendarFn({year:2026,month:9});
 assert.equal(calendar?.source,"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL");
 assert.equal(calendar?.queryMonthVerified,true);
 assert.equal(calendar?.year,2026);
 assert.equal(calendar?.month,9);
 const dates=calendar?.tradingDates;
 assert.ok(Array.isArray(dates)&&dates.length===20,
  "SEPTEMBER_2026_PROXY_CALENDAR_COUNT_REVISED");
 assert.equal(new Set(dates).size,20,"DUPLICATE_PROXY_DATE");
 assert.ok(dates.every(isoValid),"INVALID_PROXY_MONTH_DATE");
 assert.deepEqual(dates,[...dates].sort(),"UNSORTED_PROXY_DATES");
 assert.equal(sha(dates),sept.twseTradingDateSetSha256,
  "FROZEN_PROXY_TRADING_DATE_SET_REVISED");
 assert.deepEqual([dates[0],dates.at(-1)],prior.map(x=>x.marketDate));
 const priorByDate=new Map(prior.map(x=>[x.marketDate,x]));
 const received=[];
 for(const marketDate of dates){
  await onStage({stage:"BEFORE_OFFICIAL_SOURCE",marketDate,completed:received.length});
  const quote=await dailyFn({market:"TPEX",marketDate,
   observedAt:()=>new Date().toISOString()});
  assert.equal(quote?.state,"READY","TPEX_OFFICIAL_SOURCE_NOT_READY");
  assert.equal(quote?.market,"TPEX");
  assert.equal(quote?.marketDate,marketDate);
  assert.equal(quote?.sourceId,"A1_TPEX_DAILY_QUOTES_HISTORICAL");
  assert.equal(quote?.transportMode,"PRIMARY","LEGACY_TPEX_SOURCE_NOT_CANONICAL");
  assert.equal(quote?.sourceDateEvidence,marketDate,
   "TPEX_PRIMARY_PAYLOAD_DATE_MISMATCH");
  assert.ok(["PAYLOAD_DATE","TABLE_ROC_DATE","TABLE_TITLE_ROC_DATE"]
   .includes(quote?.sourceDateEvidenceBasis),"UNVERIFIED_SOURCE_DATE_BASIS");
  assert.ok(Number.isSafeInteger(quote?.ordinarySymbolCount)
   &&quote.ordinarySymbolCount>=700,
   "TPEX_2026_SEPTEMBER_ORDINARY_COUNT_UNSAFE");
  assert.ok(Array.isArray(quote.rows)
   &&quote.rows.length===quote.ordinarySymbolCount);
  assert.ok(quote.rows.every(r=>r.market==="TPEX"&&r.marketDate===marketDate
   &&/^[1-9]\d{3}$/.test(r.symbol)
   &&r.priceSpace==="RAW"&&r.continuityState==="UNVERIFIED"),
   "TPEX_SOURCE_ROW_IDENTITY_OR_PRICE_SPACE_UNSAFE");
  assert.equal(new Set(quote.rows.map(r=>r.symbol)).size,quote.rows.length,
   "TPEX_DUPLICATE_STOCK_ID");
  const hash=rowsetSha(quote.rows);
  const old=priorByDate.get(marketDate);
  if(old){
   assert.equal(quote.ordinarySymbolCount,old.ordinarySymbolCount,
    "TPEX_SEPTEMBER_PREVIOUS_SAMPLE_COUNT_REVISED");
   assert.equal(hash,old.normalizedBarSha256,
    "TPEX_SEPTEMBER_PREVIOUS_SAMPLE_ROWSET_REVISED");
  }
  const receipt=Object.freeze({
   market:"TPEX",marketDate,ordinarySymbolCount:quote.ordinarySymbolCount,
   sourceId:quote.sourceId,transportMode:"PRIMARY",
   sourceDateEvidenceBasis:quote.sourceDateEvidenceBasis,
   normalizedBarSha256:hash,priorSampleExactMatch:Boolean(old),
   historicalFirstKnownAtCertified:false,officialTpexCalendarCertified:false,
  });
  received.push(receipt);
  await onStage({stage:"TPEX_SOURCE_DAY_PASS",marketDate,
   ordinarySymbolCount:quote.ordinarySymbolCount,completed:received.length});
  if(pauseMs>0)await new Promise(resolve=>setTimeout(resolve,pauseMs));
 }
 assert.equal(received.length,20);
 const whole=sha(received.map(x=>[x.marketDate,x.ordinarySymbolCount,x.normalizedBarSha256]));
 return Object.freeze({
  schemaVersion:"S2_TPEX2026_SEPTEMBER_FULL_TWSE_PROXY_DATE_SOURCE_PREFLIGHT_V0_1",
  result:"PASS_20_OF_20_TWSE_PROXY_DATES_TPEX_CANONICAL_SOURCE_ONLY",
  market:"TPEX",year:2026,month:9,exactDateCount:20,
  proxyCalendar:"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL",
  proxyCalendarDigest:sept.twseTradingDateSetSha256,
  sourceReceipts:Object.freeze(received),sourceReceiptDigest:whole,
  stockDateRowsObserved:received.reduce((n,x)=>n+x.ordinarySymbolCount,0),
  priorSeptemberSamplesMatched:2,officialTpexSessionSetCertified:false,
  allTpexSeptemberDatesProven:false,fullYearOrFullNineMonthSourceCertified:false,
  physicalD1R2StorageCertified:false,historicalFirstKnownAtCertified:false,
  pointInTimeReplayAuthorized:false,corporateActionNoEventCertified:false,
  continuityCertified:false,liveSelectionAuthorized:false,
  cloudflareD1ReadRequests:0,cloudflareD1Writes:0,cloudflareR2Calls:0,
  system1RuntimeUsed:false,
 });
}
