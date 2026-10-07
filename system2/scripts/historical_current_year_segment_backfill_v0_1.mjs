import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import { createRemoteR2S3Adapter } from "../deploy/remote_r2_s3_adapter.mjs";
import { fetchOfficialHistoricalA1RangeV0_1 } from "../runtime/official_historical_backfill_source_v0_1.mjs";
import { buildHistoricalA1PacksResearchV0_1 } from "../runtime/historical_pack_research_v0_1.mjs";
import {
  executeHistoricalSegmentPackSetV0_1,
  readHistoricalSegmentReceiptV0_1,
  finalizeHistoricalSegmentCheckpointFromReceiptV0_1,
} from "../runtime/historical_segmented_cold_store_v0_1.mjs";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
const r2AccessKeyId=process.env.SYSTEM2_R2_ACCESS_KEY_ID;
const r2SecretAccessKey=process.env.SYSTEM2_R2_SECRET_ACCESS_KEY;
const r2Bucket=String(process.env.SYSTEM2_R2_BUCKET||"system2-historical-research").trim();
const market=String(process.env.SYSTEM2_HISTORY_SEGMENT_MARKET||"").trim().toUpperCase();
const outputPath=String(process.env.SYSTEM2_HISTORY_SEGMENT_OUTPUT||"").trim()||null;
const capturedAt=new Date().toISOString();

assert.ok(accountId,"CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(apiToken,"SYSTEM2_CLOUDFLARE_API_TOKEN is required");
assert.ok(r2AccessKeyId,"SYSTEM2_R2_ACCESS_KEY_ID is required");
assert.ok(r2SecretAccessKey,"SYSTEM2_R2_SECRET_ACCESS_KEY is required");
assert.ok(r2Bucket,"SYSTEM2_R2_BUCKET is required");
assert.ok(["TWSE","TPEX"].includes(market),"SYSTEM2_HISTORY_SEGMENT_MARKET must be TWSE or TPEX");

const taipeiParts=Object.fromEntries(new Intl.DateTimeFormat("en-US",{
  timeZone:"Asia/Taipei",year:"numeric",month:"numeric",day:"numeric",
}).formatToParts(new Date(capturedAt)).filter((x)=>x.type!=="literal").map((x)=>[x.type,Number(x.value)]));
const year=taipeiParts.year;
const currentMonth=taipeiParts.month;
const throughMonth=currentMonth-1;

assert.ok(Number.isInteger(year)&&year>=2017,"current Taipei year invalid");
assert.ok(Number.isInteger(currentMonth)&&currentMonth>=1&&currentMonth<=12,"current Taipei month invalid");

const db=await createRemoteD1RestAdapter({accountId,apiToken,databaseName:"system2-research"});
const objectStore=createRemoteR2S3Adapter({
  accountId,accessKeyId:r2AccessKeyId,secretAccessKey:r2SecretAccessKey,bucketName:r2Bucket,
});
const schema=await db.rawQuery(
  "SELECT schema_value FROM s2_schema_meta WHERE schema_key='schema_version' LIMIT 1"
);
assert.equal(schema[0]?.schema_value,"1.1","isolated D1 must be schema 1.1");

function ym(month){return String(year)+"-"+String(month).padStart(2,"0");}
function monthLastDate(month){
  return new Date(Date.UTC(year,month,0)).toISOString().slice(0,10);
}

const results=[];
if(throughMonth<1){
  const output={
    result:"PASS_NO_COMPLETED_MONTHS",
    market,year,currentTaipeiMonth:currentMonth,throughMonth,
    completedMonthCount:0,insertedMonthCount:0,existingMonthCount:0,
    system1RuntimeChanged:false,
    schemaVersion:"S2_HISTORICAL_CURRENT_YEAR_SEGMENT_BACKFILL_V0_1",
  };
  const json=JSON.stringify(output,null,2);
  if(outputPath) await writeFile(outputPath,json+"\n","utf8");
  console.log(json);
  process.exit(0);
}

for(let month=1;month<=throughMonth;month+=1){
  const monthText=String(month).padStart(2,"0");
  const fromDate=ym(month)+"-01";
  const toDate=monthLastDate(month);
  const batchId=`S2-HIST-SEGMENT-MONTH|${market}|${year}|${monthText}`;

  const existing=await readHistoricalSegmentReceiptV0_1({db,batchId});
  if(existing){
    assert.equal(existing.state,"COMPLETE","existing current-year segment receipt is not COMPLETE");
    const finalized=await finalizeHistoricalSegmentCheckpointFromReceiptV0_1({
      db,objectStore,receipt:existing,capturedAt,
    });
    results.push({
      month,fromDate,toDate,batchId,state:"ALREADY_RECEIPTED",
      receiptId:existing.receipt_id,packCount:Number(existing.pack_count),
      barCount:Number(existing.bar_count),manifestRollingHash:existing.manifest_rolling_hash,
      checkpointRepairPerformed:finalized.checkpointRepairPerformed,
      repairVerification:finalized.verification?.state||null,
    });
    continue;
  }

  const range=await fetchOfficialHistoricalA1RangeV0_1({
    market,fromDate,toDate,observedAt:capturedAt,pauseMs:25,includeRowProvenance:true,
  });
  assert.ok(range.tradingDateCount>=5,`${market} ${year}-${monthText} trading-date count unexpectedly low`);
  assert.equal(range.fetchedTradingDateCount,range.tradingDateCount,"current-year segment date-receipt count mismatch");
  assert.ok(range.rowCount>1000,`${market} ${year}-${monthText} official row count unexpectedly low`);

  const packSet=await buildHistoricalA1PacksResearchV0_1({rows:range.rows,capturedAt});
  assert.ok(packSet.packCount>300,`${market} ${year}-${monthText} pack count unexpectedly low`);
  assert.equal(packSet.barCount,range.rowCount,"current-year segment pack accounting mismatch");

  const persisted=await executeHistoricalSegmentPackSetV0_1({
    db,objectStore,packSet,batchId,capturedAt,market,year,month,
    segmentFromDate:fromDate,segmentToDate:toDate,chunkSize:25,
  });
  assert.equal(persisted.packCount,packSet.packCount);
  assert.equal(persisted.barCount,range.rowCount);
  assert.equal(persisted.verification?.state,"VERIFIED","current-year segment physical verification must PASS");

  results.push({
    month,fromDate,toDate,batchId,state:persisted.state,
    tradingDateCount:range.tradingDateCount,officialRowCount:range.rowCount,
    packCount:persisted.packCount,barCount:persisted.barCount,
    insertedObjectCount:persisted.insertedObjectCount,
    identicalObjectCount:persisted.identicalObjectCount,
    insertedManifestCount:persisted.insertedManifestCount,
    identicalManifestCount:persisted.identicalManifestCount,
    receiptId:persisted.receiptId,
    manifestRollingHash:persisted.rollingHash,
    headObjectCountVerified:persisted.verification.headObjectCountVerified,
    byteGetObjectCountVerified:persisted.verification.byteGetObjectCountVerified,
  });
}

const insertedMonthCount=results.filter((x)=>x.state==="COMPLETE").length;
const existingMonthCount=results.filter((x)=>x.state==="ALREADY_RECEIPTED"||x.state==="ALREADY_COMPLETE").length;
const output={
  result:"PASS_CURRENT_YEAR_COMPLETED_MONTH_SEGMENTS",
  market,year,currentTaipeiMonth:currentMonth,throughMonth,
  completedMonthCount:results.length,insertedMonthCount,existingMonthCount,
  months:results,
  policy:{
    onlyCompletedCalendarMonths:true,
    currentIncompleteMonthWritten:false,
    annualPackMutated:false,
    currentMonthBridge:"EXISTING_HOT_PROSPECTIVE_HISTORY_LANES",
    yearEndCompaction:"FULL_ANNUAL_PACK_AFTER_CALENDAR_YEAR_COMPLETES",
  },
  d1UsageObservedThisRun:db.metrics,
  system1RuntimeChanged:false,
  schemaVersion:"S2_HISTORICAL_CURRENT_YEAR_SEGMENT_BACKFILL_V0_1",
};
const json=JSON.stringify(output,null,2);
if(outputPath) await writeFile(outputPath,json+"\n","utf8");
console.log(json);
