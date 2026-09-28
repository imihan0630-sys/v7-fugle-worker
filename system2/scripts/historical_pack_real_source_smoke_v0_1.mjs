import assert from "node:assert/strict";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import { fetchOfficialHistoricalA1RangeV0_1 } from "../runtime/official_historical_backfill_source_v0_1.mjs";
import {
  buildAndPersistHistoricalPacksV0_1,
  loadHistoricalBarsFromPacksV0_1,
} from "../runtime/historical_pack_store_v0_1.mjs";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
const fromDate=process.env.SYSTEM2_PACK_SMOKE_FROM || "2026-08-03";
const toDate=process.env.SYSTEM2_PACK_SMOKE_TO || "2026-08-31";
const symbols={
  TWSE:(process.env.SYSTEM2_PACK_SMOKE_TWSE || "2330,2454").split(",").map(x=>x.trim()).filter(Boolean),
  TPEX:(process.env.SYSTEM2_PACK_SMOKE_TPEX || "3105,6488").split(",").map(x=>x.trim()).filter(Boolean),
};
const capturedAt=new Date().toISOString();

assert.ok(accountId,"CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(apiToken,"SYSTEM2_CLOUDFLARE_API_TOKEN is required");

const db=await createRemoteD1RestAdapter({
  accountId,apiToken,databaseName:"system2-research",
});
const schema=await db.rawQuery(
  "SELECT schema_value FROM s2_schema_meta WHERE schema_key='schema_version' LIMIT 1"
);
assert.equal(schema[0]?.schema_value,"0.9","isolated D1 must be schema 0.9");

const receipts=[];
for(const market of ["TWSE","TPEX"]){
  const range=await fetchOfficialHistoricalA1RangeV0_1({
    market,fromDate,toDate,observedAt:capturedAt,pauseMs:50,
  });
  const wanted=new Set(symbols[market]);
  const rows=range.rows.filter(r=>wanted.has(r.symbol));
  for(const symbol of wanted){
    assert.ok(rows.some(r=>r.symbol===symbol),`${market} pack smoke missing ${symbol}`);
  }

  const {packSet,persistence}=await buildAndPersistHistoricalPacksV0_1({
    db,rows,batchId:`S2-PACK-SMOKE|${market}|${fromDate}|${toDate}`,capturedAt,
  });
  assert.equal(packSet.packCount,symbols[market].length);
  assert.equal(persistence.state,"HISTORICAL_PACK_SET_PERSISTED");

  const readbacks=[];
  for(const symbol of symbols[market]){
    const expected=rows.filter(r=>r.symbol===symbol).sort((a,b)=>a.marketDate.localeCompare(b.marketDate));
    const loaded=await loadHistoricalBarsFromPacksV0_1({
      db,market,symbol,fromDate,toDate,priceSpace:"RAW",
    });
    assert.equal(loaded.rowCount,expected.length,`${market} ${symbol} pack readback count mismatch`);
    assert.deepEqual(
      loaded.rows.map(r=>[r.marketDate,r.open,r.high,r.low,r.close,r.volumeShares,r.tradeValue,r.transactions,r.change]),
      expected.map(r=>[r.marketDate,r.open,r.high,r.low,r.close,r.volumeShares,r.tradeValue,r.transactions,r.change]),
      `${market} ${symbol} pack roundtrip mismatch`,
    );
    assert.ok(loaded.rows.every(r=>r.pitReplayEligible===true));
    readbacks.push({symbol,rowCount:loaded.rowCount,packRefs:loaded.packRefs});
  }

  receipts.push({
    market,
    tradingDateCount:range.tradingDateCount,
    sourceRowCount:range.rowCount,
    selectedRowCount:rows.length,
    packCount:packSet.packCount,
    payloadJsonBytes:packSet.payloadJsonBytes,
    gzipBytes:packSet.gzipBytes,
    base64Bytes:packSet.base64Bytes,
    gzipRatio:packSet.payloadJsonBytes ? Number((packSet.gzipBytes/packSet.payloadJsonBytes).toFixed(4)) : null,
    base64Ratio:packSet.payloadJsonBytes ? Number((packSet.base64Bytes/packSet.payloadJsonBytes).toFixed(4)) : null,
    insertedPackCount:persistence.insertedPackCount,
    identicalPackCount:persistence.identicalPackCount,
    readbacks,
  });
}

console.log(JSON.stringify({
  result:"PASS",
  smokeVersion:"S2_HISTORICAL_PACK_REAL_SOURCE_SMOKE_V0_1",
  databaseName:"system2-research",
  schemaVersion:"0.9",
  fromDate,toDate,
  boundedSymbols:symbols,
  receipts,
  d1UsageObservedThisRun:db.metrics,
  fullBackfillPerformed:false,
  system1RuntimeChanged:false,
},null,2));
