import assert from "node:assert/strict";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import { createRemoteR2S3Adapter } from "../deploy/remote_r2_s3_adapter.mjs";
import { classifyHistoricalAnnualResumeStateV0_1 } from "../runtime/historical_annual_resume_preflight_v0_1.mjs";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
const r2AccessKeyId=process.env.SYSTEM2_R2_ACCESS_KEY_ID;
const r2SecretAccessKey=process.env.SYSTEM2_R2_SECRET_ACCESS_KEY;
const r2Bucket=String(process.env.SYSTEM2_R2_BUCKET||"system2-historical-research").trim();
const market=String(process.env.SYSTEM2_HISTORY_YEAR_MARKET||"").trim();
const year=Number(process.env.SYSTEM2_HISTORY_YEAR||0);
assert.ok(accountId,"CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(apiToken,"SYSTEM2_CLOUDFLARE_API_TOKEN is required");
assert.ok(r2AccessKeyId,"SYSTEM2_R2_ACCESS_KEY_ID is required");
assert.ok(r2SecretAccessKey,"SYSTEM2_R2_SECRET_ACCESS_KEY is required");
assert.ok(["TWSE","TPEX"].includes(market),"SYSTEM2_HISTORY_YEAR_MARKET must be TWSE or TPEX");
assert.ok(Number.isInteger(year)&&year>=2017,"SYSTEM2_HISTORY_YEAR must be >= 2017");

const batchId=`S2-HIST-PACK-YEAR|${market}|${year}`;
const db=await createRemoteD1RestAdapter({accountId,apiToken,databaseName:"system2-research"});
const objectStore=createRemoteR2S3Adapter({
  accountId,accessKeyId:r2AccessKeyId,secretAccessKey:r2SecretAccessKey,bucketName:r2Bucket,
});

const schema=await db.rawQuery("SELECT schema_value FROM s2_schema_meta WHERE schema_key='schema_version' LIMIT 1");
assert.equal(schema[0]?.schema_value,"1.1","isolated D1 must be schema 1.1");

const [receipts,checkpoints,manifests]=await Promise.all([
  db.rawQuery("SELECT * FROM s2_historical_cold_ingest_receipts WHERE batch_id=? LIMIT 1",[batchId]),
  db.rawQuery("SELECT * FROM s2_historical_cold_backfill_checkpoints WHERE batch_id=? LIMIT 1",[batchId]),
  db.rawQuery("SELECT * FROM s2_historical_a1_pack_manifests WHERE market=? AND year=? AND price_space='RAW' ORDER BY symbol",[market,year]),
]);

const objectHeadFailures=[];
for(let i=0;i<manifests.length;i+=25){
  const part=manifests.slice(i,i+25);
  const results=await Promise.all(part.map(async(row)=>{
    try{
      const head=await objectStore.head(row.object_key);
      if(!head)return {objectKey:row.object_key,reason:"MISSING"};
      if(Number(head.size)!==Number(row.gzip_bytes))return {objectKey:row.object_key,reason:"SIZE_MISMATCH"};
      const meta=head.customMetadata||{};
      if(meta["payload-hash"]&&meta["payload-hash"]!==row.payload_hash)return {objectKey:row.object_key,reason:"PAYLOAD_HASH_METADATA_MISMATCH"};
      if(meta["object-sha256"]&&meta["object-sha256"]!==row.object_sha256)return {objectKey:row.object_key,reason:"OBJECT_SHA_METADATA_MISMATCH"};
      return null;
    }catch(error){
      return {objectKey:row.object_key,reason:"HEAD_ERROR",message:String(error?.message||error).slice(0,300)};
    }
  }));
  objectHeadFailures.push(...results.filter(Boolean));
}

const result=classifyHistoricalAnnualResumeStateV0_1({
  market,year,receipt:receipts[0]||null,checkpoint:checkpoints[0]||null,manifests,objectHeadFailures,
});

console.log(JSON.stringify({
  result:result.state.startsWith("BLOCKED")?"BLOCKED":"PASS",
  ...result,
  r2Bucket,
  d1UsageObservedThisRun:db.metrics,
  objectHeadFailureSample:objectHeadFailures.slice(0,20),
},null,2));
if(result.state.startsWith("BLOCKED"))process.exitCode=2;
