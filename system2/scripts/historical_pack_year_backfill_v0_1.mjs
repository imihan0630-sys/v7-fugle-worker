import assert from "node:assert/strict";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import { createRemoteR2S3Adapter } from "../deploy/remote_r2_s3_adapter.mjs";
import { fetchOfficialHistoricalA1RangeV0_1 } from "../runtime/official_historical_backfill_source_v0_1.mjs";
import { buildHistoricalA1PacksResearchV0_1 } from "../runtime/historical_pack_research_v0_1.mjs";
import {
  executeHistoricalColdPackSetV0_1,
  readHistoricalColdReceiptV0_1,
  verifyHistoricalColdReceiptV0_1,
} from "../runtime/historical_cold_pack_store_v0_1.mjs";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
const r2AccessKeyId=process.env.SYSTEM2_R2_ACCESS_KEY_ID;
const r2SecretAccessKey=process.env.SYSTEM2_R2_SECRET_ACCESS_KEY;
const r2Bucket=String(process.env.SYSTEM2_R2_BUCKET||"system2-historical-research").trim();
const market=String(process.env.SYSTEM2_HISTORY_YEAR_MARKET||"").trim();
const year=Number(process.env.SYSTEM2_HISTORY_YEAR||2017);
const capturedAt=new Date().toISOString();

assert.ok(accountId,"CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(apiToken,"SYSTEM2_CLOUDFLARE_API_TOKEN is required");
assert.ok(r2AccessKeyId,"SYSTEM2_R2_ACCESS_KEY_ID is required");
assert.ok(r2SecretAccessKey,"SYSTEM2_R2_SECRET_ACCESS_KEY is required");
assert.ok(r2Bucket,"SYSTEM2_R2_BUCKET is required");
assert.ok(["TWSE","TPEX"].includes(market),"SYSTEM2_HISTORY_YEAR_MARKET must be TWSE or TPEX");
assert.ok(Number.isInteger(year)&&year>=2017&&year<=2100,"SYSTEM2_HISTORY_YEAR must be >=2017");

const fromDate=`${year}-01-01`;
const toDate=`${year}-12-31`;
const batchId=`S2-HIST-PACK-YEAR|${market}|${year}`;

const db=await createRemoteD1RestAdapter({
  accountId,apiToken,databaseName:"system2-research",
});
const objectStore=createRemoteR2S3Adapter({
  accountId,accessKeyId:r2AccessKeyId,secretAccessKey:r2SecretAccessKey,bucketName:r2Bucket,
});

const schema=await db.rawQuery(
  "SELECT schema_value FROM s2_schema_meta WHERE schema_key='schema_version' LIMIT 1"
);
assert.equal(schema[0]?.schema_value,"1.0","isolated D1 must be schema 1.0");

const existingReceipt=await readHistoricalColdReceiptV0_1({db,batchId});
if(existingReceipt){
  const verified=await verifyHistoricalColdReceiptV0_1({db,objectStore,receipt:existingReceipt});
  const aggregate=await db.rawQuery(
    "SELECT COUNT(*) AS pack_count, COALESCE(SUM(bar_count),0) AS bar_count, MIN(first_market_date) AS first_date, MAX(last_market_date) AS last_date "+
    "FROM s2_historical_a1_pack_manifests WHERE market=? AND year=? AND price_space='RAW'",
    [market,year],
  );
  assert.equal(Number(aggregate[0]?.pack_count||0),Number(existingReceipt.pack_count),"completed cold receipt pack count mismatch");
  assert.equal(Number(aggregate[0]?.bar_count||0),Number(existingReceipt.bar_count),"completed cold receipt bar count mismatch");
  console.log(JSON.stringify({
    result:"PASS",
    state:"ALREADY_COMPLETE",
    databaseName:"system2-research",
    schemaVersion:"1.0",
    market,year,batchId,
    receipt:existingReceipt,
    verification:verified,
    aggregate:aggregate[0]||null,
    d1UsageObservedThisRun:db.metrics,
    system1RuntimeChanged:false,
  },null,2));
  process.exit(0);
}

const range=await fetchOfficialHistoricalA1RangeV0_1({
  market,fromDate,toDate,observedAt:capturedAt,pauseMs:25,includeRowProvenance:true,
});
assert.ok(range.tradingDateCount>200,`${market} ${year} trading-date count unexpectedly low`);
assert.ok(range.rowCount>100000,`${market} ${year} row count unexpectedly low`);

const packSet=await buildHistoricalA1PacksResearchV0_1({
  rows:range.rows,capturedAt,
});
assert.ok(packSet.packCount>500,`${market} ${year} pack count unexpectedly low`);
assert.equal(packSet.barCount,range.rowCount,"pack bar accounting must match official source rows");

const persisted=await executeHistoricalColdPackSetV0_1({
  db,objectStore,packSet,batchId,capturedAt,chunkSize:25,
});
assert.equal(persisted.packCount,packSet.packCount);
assert.equal(persisted.barCount,range.rowCount);

const aggregateRows=await db.rawQuery(
  "SELECT COUNT(*) AS pack_count, COALESCE(SUM(bar_count),0) AS bar_count, "+
  "MIN(first_market_date) AS first_date, MAX(last_market_date) AS last_date, "+
  "COUNT(DISTINCT symbol) AS symbol_count "+
  "FROM s2_historical_a1_pack_manifests WHERE market=? AND year=? AND price_space='RAW'",
  [market,year],
);
const aggregate=aggregateRows[0]||{};
assert.equal(Number(aggregate.pack_count),packSet.packCount,"D1 annual pack count mismatch");
assert.equal(Number(aggregate.bar_count),range.rowCount,"D1 annual bar count mismatch");

const conflicts=await db.rawQuery(
  "SELECT COUNT(*) AS duplicate_keys FROM ("+
  "SELECT market,symbol,year,price_space,COUNT(*) AS n FROM s2_historical_a1_pack_manifests "+
  "WHERE market=? AND year=? GROUP BY market,symbol,year,price_space HAVING n>1)",
  [market,year],
);
assert.equal(Number(conflicts[0]?.duplicate_keys||0),0,"duplicate logical pack keys detected");

console.log(JSON.stringify({
  result:"PASS",
  state:"YEAR_BACKFILL_COMPLETE",
  version:"S2_HISTORICAL_COLD_PACK_YEAR_BACKFILL_V0_1",
  databaseName:"system2-research",
  schemaVersion:"1.0",
  objectBackend:objectStore.backend,
  objectBucket:objectStore.bucketName,
  market,year,batchId,fromDate,toDate,
  tradingDateCount:range.tradingDateCount,
  officialRowCount:range.rowCount,
  packCount:packSet.packCount,
  symbolCount:Number(aggregate.symbol_count||0),
  firstMarketDate:aggregate.first_date||null,
  lastMarketDate:aggregate.last_date||null,
  payloadJsonBytes:packSet.payloadJsonBytes,
  gzipBytes:packSet.gzipBytes,
  base64Bytes:packSet.base64Bytes,
  gzipRatio:packSet.payloadJsonBytes?Number((packSet.gzipBytes/packSet.payloadJsonBytes).toFixed(4)):null,
  base64Ratio:packSet.payloadJsonBytes?Number((packSet.base64Bytes/packSet.payloadJsonBytes).toFixed(4)):null,
  insertedObjectCount:persisted.insertedObjectCount,
  identicalObjectCount:persisted.identicalObjectCount,
  insertedManifestCount:persisted.insertedManifestCount,
  identicalManifestCount:persisted.identicalManifestCount,
  d1UsageObservedThisRun:db.metrics,
  system1RuntimeChanged:false,
},null,2));
