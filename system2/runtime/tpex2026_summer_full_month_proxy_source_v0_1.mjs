// DATA_LANE Class A: bounded JUL and AUG 2026 TPEx official PRIMARY source.
 // TWSE FMTQIK market dates are proxies, not official TPEx session certification.
 // No Cloudflare D1/R2, no historical firstKnownAt replay or System1 writes.
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {fetchHistoricalTwseMonthlyTradingDatesV0_1}
 from "./historical_twse_calendar_v0_1.mjs";
import {fetchOfficialHistoricalA1DateV0_1}
 from "./official_historical_a1_source_v0_1.mjs";

const digest=v=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const ymd=(month)=>"2026-"+String(month).padStart(2,"0")+"-";
const dateValid=(date,month)=>{
 if(typeof date!=="string"||!new RegExp("^"+ymd(month)+"\\d{2}$").test(date))return false;
 const d=new Date(date+"T00:00:00Z");
 return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===date;
};
const barsDigest=rows=>digest(rows.map(r=>[
 r.symbol,r.open,r.high,r.low,r.close,r.volumeShares,r.tradeValue,r.transactions,
]).sort((a,b)=>a[0].localeCompare(b[0])));

export async function probeTpex2026SummerMonthSourceV0_1({
 month,frozenNineMonthEvidence,
 calendarFn=fetchHistoricalTwseMonthlyTradingDatesV0_1,
 dailyFn=fetchOfficialHistoricalA1DateV0_1,
 onStage=()=>{},pauseMs=450,
}={}){
 assert.ok([5,6,7,8].includes(month),"Only preregistered May to August 2026");
 assert.equal(typeof calendarFn,"function");
 assert.equal(typeof dailyFn,"function");
 assert.equal(typeof onStage,"function");
 assert.ok(Number.isSafeInteger(pauseMs)&&pauseMs>=0&&pauseMs<=3000);
 const frozen=frozenNineMonthEvidence;
 assert.equal(frozen?.schemaVersion,
  "S2_TPEX2026_CANONICAL_SOURCE_NINE_MONTH_18_SAMPLE_REAL_ACCEPTANCE_20261009_V0_1");
 assert.equal(frozen?.execution?.runId,37878065621,"Unapproved source baseline");
 assert.equal(frozen?.state,"PASS_9_MONTHS_18_CANONICAL_TPEX_SOURCE_SAMPLES_NOT_FULL_RANGE");
 const monthProof=frozen?.source?.monthlyCalendarProxyReceipts?.find(x=>x.month===month);
 const prior=frozen?.source?.sampleReceipts?.filter(x=>x.month===month);
 const expectedCount=({5:20,6:21,7:22,8:21})[month];
 assert.equal(monthProof?.twseOfficialSessionCount,expectedCount,
  "FROZEN_SOURCE_MONTH_COUNT_UNEXPECTED");
 assert.match(monthProof?.twseTradingDateSetSha256||"",/^[a-f0-9]{64}$/);
 assert.ok(Array.isArray(prior)&&prior.length===2,"PRIOR_CANONICAL_SAMPLES_MISSING");
 const dates=[...new Set(prior.map(x=>x.marketDate))].sort();
 assert.equal(dates.length,2,"PRIOR_SAMPLE_DATES_MISSING");
 const calendar=await calendarFn({year:2026,month});
 assert.equal(calendar?.year,2026);
 assert.equal(calendar?.month,month);
 assert.equal(calendar?.source,"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL");
 assert.equal(calendar?.queryMonthVerified,true);
 assert.ok(Array.isArray(calendar?.tradingDates)
  &&calendar.tradingDates.length===expectedCount,
  "FROZEN_TWSE_PROXY_MONTH_COUNT_CHANGED");
 const full=calendar.tradingDates;
 assert.equal(new Set(full).size,expectedCount,"DUPLICATE_TRADING_DATE");
 assert.ok(full.every(d=>dateValid(d,month)),"INVALID_TRADING_DATE");
 assert.deepEqual(full,[...full].sort(),"UNSORTED_TRADING_DATES");
 assert.equal(digest(full),monthProof.twseTradingDateSetSha256,
  "FROZEN_TWSE_PROXY_MONTH_DATE_SET_HASH_CHANGED");
 assert.deepEqual([full[0],full.at(-1)],dates,"FROZEN_FIRST_LAST_DATE_CHANGED");
 const priorMap=new Map(prior.map(x=>[x.marketDate,x]));
 const receipts=[];
 for(const date of full){
  await onStage({stage:"BEFORE_CANONICAL_OFFICIAL_FETCH",month,date,completed:receipts.length});
  const quote=await dailyFn({market:"TPEX",marketDate:date,observedAt:()=>new Date().toISOString()});
  assert.equal(quote?.state,"READY","TPEX_CANONICAL_SOURCE_NOT_READY");
  assert.equal(quote?.market,"TPEX");
  assert.equal(quote?.marketDate,date);
  assert.equal(quote?.sourceId,"A1_TPEX_DAILY_QUOTES_HISTORICAL");
  assert.equal(quote?.transportMode,"PRIMARY","LEGACY_TPEX_NOT_ACCEPTED");
  assert.equal(quote?.sourceDateEvidence,date,"TPEX_PAYLOAD_DATE_MISMATCH");
  assert.ok(["PAYLOAD_DATE","TABLE_ROC_DATE","TABLE_TITLE_ROC_DATE"]
    .includes(quote?.sourceDateEvidenceBasis),"UNVERIFIED_TPEX_SOURCE_DATE_BASIS");
  assert.ok(Number.isSafeInteger(quote?.ordinarySymbolCount)
    &&quote.ordinarySymbolCount>=700,"IMPLAUSIBLE_TPEX_STOCK_COUNT");
  assert.ok(Array.isArray(quote.rows)&&quote.rows.length===quote.ordinarySymbolCount,
   "STOCK_COUNT_ROWSET_INCONSISTENT");
  assert.ok(quote.rows.every(r=>r.market==="TPEX"&&r.marketDate===date
   &&/^[1-9]\d{3}$/.test(r.symbol)&&r.priceSpace==="RAW"
   &&r.continuityState==="UNVERIFIED"),
   "WRONG_ROW_IDENTITY_OR_PRICE_SPACE");
  assert.equal(new Set(quote.rows.map(r=>r.symbol)).size,quote.rows.length,
   "DUPLICATE_TPEX_ORDINARY_SYMBOL");
  const rowsetHash=barsDigest(quote.rows);
  const old=priorMap.get(date);
  if(old){
   assert.equal(quote.ordinarySymbolCount,old.ordinarySymbolCount,
    "FROZEN_PRIOR_SAMPLE_STOCK_COUNT_CHANGED");
   assert.equal(rowsetHash,old.normalizedBarSha256,
    "FROZEN_PRIOR_SAMPLE_ROWSET_DIGEST_CHANGED");
  }
  const receipt=Object.freeze({month,marketDate:date,
   ordinarySymbolCount:quote.ordinarySymbolCount,
   sourceId:quote.sourceId,transportMode:"PRIMARY",
   sourceDateEvidenceBasis:quote.sourceDateEvidenceBasis,
   normalizedBarSha256:rowsetHash,previouslyAcceptedSampleExactMatch:Boolean(old),
   originalHistoricalFirstKnownAtCertified:false,independentTpexSessionCalendarCertified:false});
  receipts.push(receipt);
  await onStage({stage:"SOURCE_DATE_PASS",month,date,completed:receipts.length,
   ordinarySymbolCount:receipt.ordinarySymbolCount});
  if(pauseMs>0)await new Promise(r=>setTimeout(r,pauseMs));
 }
 assert.equal(receipts.length,expectedCount);
 return Object.freeze({
  schemaVersion:"S2_TPEX2026_SUMMER_FULL_MONTH_PROXY_CANONICAL_SOURCE_V0_1",
  result:"PASS_"+expectedCount+"_OF_"+expectedCount+"_TPEX_PRIMARY_ON_TWSE_PROXY_DATES_SOURCE_ONLY",
  market:"TPEX",year:2026,month,twseProxyDateCount:expectedCount,
  proxyCalendar:"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL",
  proxyDateSetSha256:monthProof.twseTradingDateSetSha256,
  sourceReceipts:Object.freeze(receipts),
  sourceReceiptsAggregateSha256:digest(receipts.map(x=>[
   x.marketDate,x.ordinarySymbolCount,x.normalizedBarSha256])),
  observedStockDateSourceRows:receipts.reduce((sum,x)=>sum+x.ordinarySymbolCount,0),
  previouslyAcceptedSampleMatches:2,
  independentTpexCalendarCertified:false,fullTpexMarketYearSourceCertified:false,
  originalHistoricalFirstKnownAtCertified:false,corpActionNoEventCertified:false,
  technicalContinuityCertified:false,pointInTimeReplayAuthorized:false,
  physicalD1R2StorageCertified:false,liveTradingAuthorized:false,
  cloudflareD1ReadRequests:0,cloudflareD1Writes:0,cloudflareR2Calls:0,
  system1RuntimeUsed:false,
 });
}
