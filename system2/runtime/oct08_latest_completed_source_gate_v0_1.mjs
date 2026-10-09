// Class A / DATA_LANE. Official-only retrospective 2026-10-01..08 market close source gate.
// No Cloudflare D1/R2, no backdating observedAt/firstKnownAt, no 60-session PIT promotion.
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {fetchHistoricalTwseMonthlyTradingDatesV0_1} from "./historical_twse_calendar_v0_1.mjs";
import {fetchOfficialHistoricalA1DateV0_1} from "./official_historical_a1_source_v0_1.mjs";

export const OCT08_LATEST_CUTOFF="2026-10-08";
export const OCT08_OFFICIAL_TWSE_SESSIONS=Object.freeze([
  "2026-10-01","2026-10-02","2026-10-05",
  "2026-10-06","2026-10-07","2026-10-08",
]);
const SOURCE_IDS=Object.freeze({
  TWSE:"A1_TWSE_MI_INDEX_HISTORICAL_DAILY",
  TPEX:"A1_TPEX_DAILY_QUOTES_HISTORICAL",
});
const digest=v=>createHash("sha256").update(JSON.stringify(v)).digest("hex");

export async function auditOct08OfficialSourceWindowReadonlyV0_1({
  fetchCalendar=fetchHistoricalTwseMonthlyTradingDatesV0_1,
  fetchDate=fetchOfficialHistoricalA1DateV0_1,
  onReceipt=()=>{},
  pauseMs=300,
}={}){
  assert.equal(typeof fetchCalendar,"function");
  assert.equal(typeof fetchDate,"function");
  assert.equal(typeof onReceipt,"function");
  assert.ok(Number.isInteger(pauseMs)&&pauseMs>=0&&pauseMs<=3000);
  const monthly=await fetchCalendar({year:2026,month:10});
  assert.equal(monthly.year,2026);
  assert.equal(monthly.month,10);
  assert.equal(monthly.source,"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL");
  assert.equal(monthly.queryMonthVerified,true);
  assert.ok(Array.isArray(monthly.tradingDates),"TWSE official exact dates missing");
  const dates=monthly.tradingDates.filter(x=>x>=OCT08_OFFICIAL_TWSE_SESSIONS[0]&&x<=OCT08_LATEST_CUTOFF);
  assert.deepEqual(dates,OCT08_OFFICIAL_TWSE_SESSIONS,
    "OCT1_8_OFFICIAL_EXACT_SESSION_SET_UNEXPECTED");
  const snapshots=[],markets=["TWSE","TPEX"];
  for(const marketDate of dates){
    for(const market of markets){
      const rowset=await fetchDate({
        market,marketDate,observedAt:()=>new Date().toISOString(),
      });
      assert.equal(rowset?.state,"READY","OFFICIAL_SOURCE_NOT_READY "+market+" "+marketDate);
      assert.equal(rowset?.market,market);
      assert.equal(rowset?.marketDate,marketDate);
      assert.equal(rowset?.sourceId,SOURCE_IDS[market]);
      assert.equal(rowset?.sourceDateEvidence,marketDate);
      assert.equal(rowset?.transportMode,"PRIMARY",
        "noncanonical legacy transport cannot certify latest source");
      assert.ok(["PAYLOAD_DATE","TABLE_ROC_DATE","TABLE_TITLE_ROC_DATE"]
        .includes(rowset.sourceDateEvidenceBasis),
        "missing source date evidence");
      assert.ok(Number.isInteger(rowset.ordinarySymbolCount)
        && rowset.ordinarySymbolCount>=(market==="TWSE"?950:700),
        "unexpected small official daily ordinary universe "+marketDate+" "+market);
      assert.ok(Array.isArray(rowset.rows)&&rowset.rows.length===rowset.ordinarySymbolCount);
      const codes=new Set();
      for(const bar of rowset.rows){
        assert.equal(bar.market,market);
        assert.equal(bar.marketDate,marketDate);
        assert.equal(bar.priceSpace,"RAW");
        assert.equal(bar.continuityState,"UNVERIFIED");
        assert.match(bar.symbol,/^[1-9][0-9]{3}$/);
        assert.ok(!codes.has(bar.symbol),"duplicate stock "+market+" "+bar.symbol);
        codes.add(bar.symbol);
      }
      const normalizedBarSha256=digest(rowset.rows.map(x=>[
        x.symbol,x.open,x.high,x.low,x.close,x.volumeShares,x.tradeValue,x.transactions,
      ]).sort((a,b)=>a[0].localeCompare(b[0])));
      const receipt=Object.freeze({
        market,marketDate,sourceId:rowset.sourceId,
        sourceDateEvidenceBasis:rowset.sourceDateEvidenceBasis,
        ordinarySymbolCount:rowset.ordinarySymbolCount,
        normalizedBarSha256,sourceTransport:"PRIMARY",
        dataClock:"POST_FACTO_SOURCE_OBSERVATION_NOT_ORIGINAL_FIRST_KNOWN",
      });
      snapshots.push(receipt);
      await onReceipt(receipt);
      if(pauseMs)await new Promise(r=>setTimeout(r,pauseMs));
    }
  }
  assert.equal(snapshots.length,12);
  return Object.freeze({
    schemaVersion:"S2_OCT08_LATEST_COMPLETED_TWSE_TPEX_OFFICIAL_SOURCE_GATE_V0_1",
    result:"PASS_20261001_08_12_OFFICIAL_SOURCE_DATE_RECEIPTS_ONLY",
    referenceCutoff:OCT08_LATEST_CUTOFF,
    markets:Object.freeze(markets),officialTwseTradingDates:Object.freeze(dates),
    tradingDateCount:dates.length,sourceReceiptCount:snapshots.length,
    snapshots:Object.freeze(snapshots),
    sourceReadyAcrossSampledWindow:true,
    tpexExactExchangeCalendarIndependentlyCertified:false,
    hotD1PhysicalCoverageCertified:false,coldR2PhysicalCoverageCertified:false,
    fullSymbolSessionHistoryCertified:false,
    originalHistoricalPITFirstKnownAtCertified:false,
    continuityAndCorpActionNoEventCertified:false,
    liveStrategySelectionAuthorized:false,
    d1Requests:0,d1RowsWritten:0,r2Requests:0,r2ObjectsWritten:0,
    system1FormalRuntimeUsed:false,
  });
}
