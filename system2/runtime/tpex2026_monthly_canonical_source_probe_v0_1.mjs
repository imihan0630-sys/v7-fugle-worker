// DATA_LANE / Class A. Bounded public-source-only historical intake preflight.
// TWSE FMTQIK is a provisional calendar proxy, NOT a TPEx session certificate.
// No D1/R2, Cloudflare API, System1 runtime, PIT promotion or paid provider.
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {fetchHistoricalTwseMonthlyTradingDatesV0_1} from "./historical_twse_calendar_v0_1.mjs";
import {fetchOfficialHistoricalA1DateV0_1} from "./official_historical_a1_source_v0_1.mjs";

export const TPEX_2026_SAMPLE_MONTHS=Object.freeze([1,2,3,4,5,6,7,8,9]);
const YYYY_MM=(month)=>"2026-"+String(month).padStart(2,"0")+"-";
const isValidDate=(value)=>typeof value==="string"
  && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && !Number.isNaN(Date.parse(value+"T00:00:00Z"))
  && new Date(value+"T00:00:00Z").toISOString().slice(0,10)===value;
const sha256=v=>createHash("sha256").update(JSON.stringify(v)).digest("hex");

export async function probeTpex2026CanonicalMonthlySourceV0_1({
  calendarFn=fetchHistoricalTwseMonthlyTradingDatesV0_1,
  dailyFn=fetchOfficialHistoricalA1DateV0_1,
  onStage=()=>{},
  pauseMs=450,
}={}){
  assert.equal(typeof calendarFn,"function");
  assert.equal(typeof dailyFn,"function");
  assert.equal(typeof onStage,"function");
  assert.ok(Number.isInteger(pauseMs)&&pauseMs>=0&&pauseMs<=5000,"bounded public-source interval");
  const months=[],samples=[];
  for(const month of TPEX_2026_SAMPLE_MONTHS){
    await onStage({stage:"TWSE_PROXY_CALENDAR",month,date:null});
    const calendar=await calendarFn({year:2026,month});
    assert.equal(calendar?.source,"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL");
    assert.equal(calendar?.queryMonthVerified,true);
    assert.equal(calendar?.year,2026);
    assert.equal(calendar?.month,month);
    assert.ok(Array.isArray(calendar?.tradingDates)&&calendar.tradingDates.length>=5,
      "exact TWSE month calendar absent or unexpectedly small: "+month);
    assert.equal(new Set(calendar.tradingDates).size,calendar.tradingDates.length,
      "duplicate calendar date: "+month);
    assert.deepEqual(calendar.tradingDates,[...calendar.tradingDates].sort(),
      "monthly dates not sorted: "+month);
    assert.ok(calendar.tradingDates.every(d=>isValidDate(d)&&d.startsWith(YYYY_MM(month))),
      "invalid monthly date: "+month);
    const monthSampleDates=[calendar.tradingDates[0],calendar.tradingDates.at(-1)];
    assert.notEqual(monthSampleDates[0],monthSampleDates[1]);
    const entries=[];
    for(const marketDate of monthSampleDates){
      await onStage({stage:"TPEX_CANONICAL_OFFICIAL_SAMPLE",month,date:marketDate});
      const quote=await dailyFn({
        market:"TPEX",marketDate,observedAt:()=>new Date().toISOString(),
      });
      assert.equal(quote?.state,"READY","TPEx historical date not READY: "+marketDate);
      assert.equal(quote?.market,"TPEX");
      assert.equal(quote?.marketDate,marketDate);
      assert.equal(quote?.sourceId,"A1_TPEX_DAILY_QUOTES_HISTORICAL");
      assert.equal(quote?.transportMode,"PRIMARY",
        "legacy TPEx 不含定價 fallback prohibited");
      assert.equal(quote?.sourceDateEvidence,marketDate,
        "TPEx payload source date mismatch");
      assert.ok(["PAYLOAD_DATE","TABLE_ROC_DATE","TABLE_TITLE_ROC_DATE"]
        .includes(quote?.sourceDateEvidenceBasis),"unverified TPEx source date basis");
      assert.ok(Number.isSafeInteger(quote?.ordinarySymbolCount)
        && quote.ordinarySymbolCount>=300,
        "TPEx canonical source ordinary-symbol sample unexpectedly small: "+marketDate);
      assert.ok(Array.isArray(quote.rows)
        && quote.rows.length===quote.ordinarySymbolCount,
        "TPEx ordinary stock count does not match normalized rows");
      assert.ok(quote.rows.every(x=>x.market==="TPEX"&&x.marketDate===marketDate
        && /^[1-9]\d{3}$/.test(x.symbol)&&x.priceSpace==="RAW"
        && x.continuityState==="UNVERIFIED"),
        "TPEx normalized row identity or continuity semantics changed");
      const symbols=quote.rows.map(x=>x.symbol);
      assert.equal(new Set(symbols).size,symbols.length,
        "TPEx duplicate ordinary symbols");
      const normalizedBarSha256=sha256(quote.rows.map(x=>[
        x.symbol,x.open,x.high,x.low,x.close,x.volumeShares,x.tradeValue,x.transactions,
      ]).sort((a,b)=>a[0].localeCompare(b[0])));
      const sample=Object.freeze({
        month,marketDate,ordinarySymbolCount:quote.ordinarySymbolCount,
        sourceId:quote.sourceId,transportMode:quote.transportMode,
        sourceDateEvidenceBasis:quote.sourceDateEvidenceBasis,
        normalizedBarSha256,
        originalDecisionFirstKnownAtCertified:false,
        officialTpexMarketSessionCertified:false,
      });
      samples.push(sample);
      entries.push(sample);
      await onStage({stage:"SAMPLE_PASS",month,date:marketDate,
        ordinarySymbolCount:sample.ordinarySymbolCount});
      if(pauseMs>0)await new Promise(resolve=>setTimeout(resolve,pauseMs));
    }
    months.push(Object.freeze({
      month,proxyCalendar:"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL",
      twseOfficialSessionCount:calendar.tradingDates.length,
      twseTradingDateSetSha256:sha256(calendar.tradingDates),
      tpexCanonicalSampleDates:Object.freeze(monthSampleDates),
      tpexCanonicalSampleCount:entries.length,
      state:"CANONICAL_PRIMARY_DATE_MATCH_SAMPLE_PASS_PROXY_CALENDAR_ONLY",
    }));
  }
  assert.equal(months.length,9);
  assert.equal(samples.length,18);
  return Object.freeze({
    schemaVersion:"S2_TPEX2026_MONTHLY_CANONICAL_SOURCE_NO_CLOUDFLARE_PREFLIGHT_V0_1",
    result:"PASS_9_MONTHS_18_CANONICAL_TPEX_SOURCE_SAMPLES_NOT_FULL_RANGE",
    market:"TPEX",year:2026,scopeMonths:Object.freeze([...TPEX_2026_SAMPLE_MONTHS]),
    months:Object.freeze(months),samples:Object.freeze(samples),
    tpexPrimaryOnly:true,twseCalendarOnlyProxy:true,
    tpexFullSourceRangeCertified:false,
    tpexOfficialTradingSessionSetCertified:false,
    tpexPhysicalD1R2StorageCertified:false,
    historicalFirstKnownAtCertified:false,historicalPITReplayCertified:false,
    technicalContinuityCertified:false,corpActionNoEventCertified:false,
    marketYearCoveragePromoted:false,liveSelectionAuthorized:false,
    cloudflareD1ReadRequests:0,cloudflareD1Writes:0,cloudflareR2Calls:0,
    system1RuntimeUsed:false,
  });
}
