import assert from "node:assert/strict";
import { loadHistoricalBarsFromSegmentsV0_1 } from "./historical_segmented_cold_store_v0_1.mjs";

export const RECENT60_JULY_HOT_COLD_SOURCE_VERSION =
  "S2_RECENT60_2026_JULY_HOT_COLD_SOURCE_READONLY_V0_1";
export const FROZEN_RECENT60_SAMPLE_BLOB_SHA =
  "5346c9cf908b5ed66266460dc342fce803c2369c";

const JULY_DATES = Object.freeze([
  "2026-07-14","2026-07-15","2026-07-16","2026-07-17",
  "2026-07-20","2026-07-21","2026-07-22","2026-07-23",
]);
const MARKET_ORDER=["TWSE","TPEX"];

export function selectFrozenRecent60JulySampleV0_1(evidence){
  assert.equal(evidence?.schemaVersion,
    "S2_RECENT60_20261008_FULL_GAP_ARTIFACT_READBACK_20261009_V0_1");
  assert.equal(evidence?.source?.workflowRunId,37854849181);
  assert.equal(evidence?.source?.runStatus,"SUCCESS");
  assert.equal(evidence?.time?.marketDate,"2026-10-08");
  assert.equal(evidence?.sample?.marketSymbolCount,12);
  assert.equal(evidence?.sample?.requestedDateIdentities,96);
  assert.equal(evidence?.sample?.allDateObservations,"HOT_D1_ROW_ABSENT");
  assert.deepEqual(evidence.sample.dateSample,JULY_DATES);
  assert.equal(evidence.sample.twseSymbols.length,6);
  assert.equal(evidence.sample.tpexSymbols.length,6);
  const seen=new Set();
  return Object.freeze(MARKET_ORDER.flatMap(market=>{
    const symbols=market==="TWSE" ? evidence.sample.twseSymbols : evidence.sample.tpexSymbols;
    return symbols.map(symbol=>{
      assert.match(symbol,/^[1-9]\d{3}$/);
      const key=market+"|"+symbol;
      assert.ok(!seen.has(key),"duplicate frozen sample identity");
      seen.add(key);
      return Object.freeze({market,symbol,dates:JULY_DATES});
    });
  }));
}

function readOnlyD1(db){
  assert.equal(db?.database?.name,"system2-research","isolated System2 D1 required");
  assert.equal(db?.metrics?.rowsWritten,0,"pre-existing D1 writes forbidden");
  assert.equal(typeof db?.prepare,"function","D1 SELECT adapter required");
  return {
    database:db.database,metrics:db.metrics,
    prepare(sql){
      assert.match(String(sql),/^\s*SELECT\b/i,"read-only audit cannot execute D1 mutations");
      return db.prepare(sql);
    },
    batch(){throw new Error("read-only audit cannot batch D1 mutations");},
  };
}

function readOnlyR2(store){
  assert.equal(store?.backend,"CLOUDFLARE_R2_S3","physical R2 adapter required");
  assert.equal(typeof store?.get,"function");
  assert.equal(typeof store?.head,"function");
  return {
    backend:store.backend,bucketName:store.bucketName,
    head:key=>store.head(key),get:key=>store.get(key),
    putIfAbsent(){throw new Error("read-only audit cannot PUT R2");},
  };
}

function classifySampleDay({hotAnyCount,hotCount,coldCount,manifestCount,receiptComplete}){
  if(hotCount>0)return "HOT_D1_ROW_NOW_PRESENT_PIT_STATUS_UNDETERMINED";
  if(hotAnyCount>0)return "HOT_D1_NON_RAW_ROW_PRESENT_RAW_STILL_ABSENT";
  if(coldCount>0&&receiptComplete)return "COLD_R2_BAR_PRESENT_HOT_D1_ABSENT";
  if(coldCount>0)return "UNRECEIPTED_COLD_R2_BAR_PRESENT_HOT_D1_ABSENT";
  if(manifestCount>0)return "COLD_MANIFEST_PRESENT_BUT_EXACT_DATE_NOT_IN_PACK";
  if(receiptComplete)return "COMPLETE_MONTH_RECEIPT_SYMBOL_MANIFEST_ABSENT";
  return "NO_COMPLETE_MONTH_RECEIPT_OR_SYMBOL_MANIFEST";
}

export async function auditFrozenRecent60JulyHotColdV0_1({
  db,objectStore,frozenEvidence,
  coldLoader=loadHistoricalBarsFromSegmentsV0_1,
  onSymbol=()=>{},
  batchHotManifestRead=false,
}={}){
  assert.equal(typeof coldLoader,"function");
  const samples=selectFrozenRecent60JulySampleV0_1(frozenEvidence);
  const roDb=readOnlyD1(db),roStore=readOnlyR2(objectStore);
  const receipts={};
  for(const market of MARKET_ORDER){
    const r=await roDb.prepare(
      "SELECT * FROM s2_historical_segment_ingest_receipts WHERE market=? AND year=? AND month=? LIMIT 1"
    ).bind(market,2026,7).first();
    if(r){
      assert.equal(r.market,market);
      assert.equal(Number(r.year),2026);
      assert.equal(Number(r.month),7);
      assert.ok(["COMPLETE","IN_PROGRESS","BLOCKED"].includes(r.state),
        "unknown July cold receipt state");
    }
    receipts[market]=Object.freeze({
      market,year:2026,month:7,found:!!r,
      complete:r?.state==="COMPLETE",
      state:r?.state||"ABSENT",
      receiptId:r?.receipt_id||null,
      manifestRollingHash:r?.manifest_rolling_hash||null,
    });
  }

  const symbols=[],causes={};
  let totalHotRows=0,totalColdRows=0,totalManifests=0;
  const batchedHot={},batchedManifests={};
  if(batchHotManifestRead){
    // Two bounded market-level SELECTs per table replace 12 independent
    // repeated scans. This reduces D1 READ budget pressure without making
    // any new bar, source-date or retrospective PIT assertions.
    for(const market of MARKET_ORDER){
      const marketSamples=samples.filter(x=>x.market===market);
      assert.equal(marketSamples.length,6);
      const symbolIds=marketSamples.map(x=>x.symbol);
      const dates=marketSamples[0].dates;
      assert.equal(dates.length,8);
      assert.ok(marketSamples.every(x=>x.dates.every((d,i)=>d===dates[i])));
      const hotQuery="SELECT market,symbol,market_date,price_space,pit_replay_eligible,available_at,bar_hash "+
        "FROM s2_historical_a1_bars WHERE market=? AND symbol IN ("+
        symbolIds.map(()=>"?").join(",")+") AND market_date IN ("+
        dates.map(()=>"?").join(",")+") ORDER BY symbol,market_date,bar_hash";
      const hotResult=await roDb.prepare(hotQuery).bind(market,...symbolIds,...dates).all();
      const allHot=hotResult?.results||[];
      assert.ok(Array.isArray(allHot));
      for(const row of allHot){
        assert.equal(row.market,market);
        assert.ok(symbolIds.includes(row.symbol),"batched hot row escaped sampled symbols");
        assert.ok(dates.includes(row.market_date),"batched hot row escaped sampled dates");
      }
      batchedHot[market]=allHot;
      const manifestsQuery="SELECT market,symbol,year,month,price_space,segment_manifest_id,object_key,object_sha256 "+
        "FROM s2_historical_a1_segment_manifests WHERE market=? AND symbol IN ("+
        symbolIds.map(()=>"?").join(",")+") AND year=? AND month=? AND price_space=?";
      const manifestResult=await roDb.prepare(manifestsQuery).bind(
        market,...symbolIds,2026,7,"RAW"
      ).all();
      const allManifests=manifestResult?.results||[];
      assert.ok(Array.isArray(allManifests));
      for(const row of allManifests){
        assert.equal(row.market,market);
        assert.ok(symbolIds.includes(row.symbol),"batched cold manifest escaped sampled symbols");
        assert.equal(Number(row.year),2026);
        assert.equal(Number(row.month),7);
        assert.equal(row.price_space,"RAW");
      }
      batchedManifests[market]=allManifests;
    }
  }
  for(const sample of samples){
    const {market,symbol,dates}=sample;
    const hot=batchHotManifestRead ? {results:batchedHot[market].filter(x=>x.symbol===symbol)} :
      await roDb.prepare(
        "SELECT market,symbol,market_date,price_space,pit_replay_eligible,available_at,bar_hash "+
        "FROM s2_historical_a1_bars WHERE market=? AND symbol=? AND market_date IN ("+
        dates.map(()=>"?").join(",")+") ORDER BY market_date,bar_hash"
      ).bind(market,symbol,...dates).all();
    const hotRows=hot?.results||[];
    assert.ok(Array.isArray(hotRows));
    for(const row of hotRows){
      assert.equal(row.market,market);
      assert.equal(row.symbol,symbol);
      assert.ok(dates.includes(row.market_date),"unexpected hot D1 date");
    }
    const rawHot=hotRows.filter(r=>r.price_space==="RAW");
    const manifests=batchHotManifestRead ?
      {results:batchedManifests[market].filter(x=>x.symbol===symbol)} :
      await roDb.prepare(
        "SELECT market,symbol,year,month,price_space,segment_manifest_id,object_key,object_sha256 "+
        "FROM s2_historical_a1_segment_manifests "+
        "WHERE market=? AND symbol=? AND year=? AND month=? AND price_space=?"
      ).bind(market,symbol,2026,7,"RAW").all();
    const found=manifests?.results||[];
    assert.ok(Array.isArray(found)&&found.length<=1,
      "duplicate/unbounded July symbol segment manifests");
    for(const m of found){
      assert.equal(m.market,market);
      assert.equal(m.symbol,symbol);
      assert.equal(Number(m.year),2026);
      assert.equal(Number(m.month),7);
      assert.equal(m.price_space,"RAW");
    }
    let coldRows=[],coldRefs=[];
    if(found.length){
      const result=await coldLoader({
        db:roDb,objectStore:roStore,market,symbol,
        fromDate:dates[0],toDate:dates[dates.length-1],priceSpace:"RAW",
      });
      assert.equal(result.market,market);
      assert.equal(result.symbol,symbol);
      assert.equal(result.priceSpace,"RAW");
      coldRows=result.rows||[];
      coldRefs=result.packRefs||[];
      assert.equal(coldRefs.length,found.length,
        "R2 physical pack ref and D1 July manifest count mismatch");
      for(const row of coldRows){
        assert.equal(row.market,market);
        assert.equal(row.symbol,symbol);
        assert.ok(dates[0]<=row.marketDate&&row.marketDate<=dates.at(-1),
          "cold source escaped bounded observation window");
      }
    }
    const checks=dates.map(date=>{
      const hotAny=hotRows.filter(r=>r.market_date===date);
      const hotForDate=rawHot.filter(r=>r.market_date===date);
      const coldForDate=coldRows.filter(r=>r.marketDate===date);
      const category=classifySampleDay({
        hotAnyCount:hotAny.length,hotCount:hotForDate.length,coldCount:coldForDate.length,
        manifestCount:found.length,receiptComplete:receipts[market].complete,
      });
      causes[category]=(causes[category]||0)+1;
      return Object.freeze({
        date,classification:category,
        hotAnyPriceSpaceRowCount:hotAny.length,
        hotRawRowCount:hotForDate.length,
        coldVerifiedByteBarCount:coldForDate.length,
        hotPitEligibleRowCount:hotForDate.filter(r=>Number(r.pit_replay_eligible)===1).length,
        hotPublicationClockReconfirmed:false,
        coldHistoricalPublicationClockReconfirmed:false,
      });
    });
    const row=Object.freeze({
      market,symbol,monthReceipt:receipts[market].state,
      julySegmentManifestCount:found.length,
      r2PackSha256VerifiedByCanonicalLoader:found.length>0,
      exactJulyDatesChecked:dates.length,checks,
    });
    symbols.push(row);
    totalHotRows+=rawHot.length;
    totalColdRows+=coldRows.length;
    totalManifests+=found.length;
    assert.equal(db.metrics.rowsWritten,0,"no D1 mutation permitted");
    await onSymbol(row);
  }
  assert.equal(symbols.length,12);
  assert.equal(Object.values(causes).reduce((sum,n)=>sum+n,0),96);
  assert.equal(db.metrics.rowsWritten,0,"no D1 mutation permitted");
  return Object.freeze({
    schemaVersion:RECENT60_JULY_HOT_COLD_SOURCE_VERSION,
    marketDate:"2026-10-08",julyWindow:JULY_DATES,
    originalFrozenSampleRun:37854849181,
    originalFrozenSampleBlobSha:FROZEN_RECENT60_SAMPLE_BLOB_SHA,
    sampledSymbolCount:12,sampledDateIdentityCount:96,
    batchedD1ReadPlanUsed:batchHotManifestRead,
    expectedControlPlaneSelectQueries:batchHotManifestRead ? 6 : 26,
    julyMonthReceipts:receipts,
    causeCounts:causes,symbols:Object.freeze(symbols),
    hotRawRowsCurrentlyObserved:totalHotRows,
    physicallyReadColdBarsInSampleWindow:totalColdRows,
    physicallyReadColdManifests:totalManifests,
    absenceMeansColdOrOfficialSourceAbsent:false,
    coldR2RowsPITEligibleAtHistoricalDate:false,
    corporateActionNoEventInferred:false,
    firstKnownAtBackdated:false,
    physicalSampleCannotCertifyFullMarket:true,
    strategySelectionOrReplayAuthorized:false,
    d1RowsWritten:0,r2ObjectsWritten:0,system1RuntimeUsed:false,
  });
}
