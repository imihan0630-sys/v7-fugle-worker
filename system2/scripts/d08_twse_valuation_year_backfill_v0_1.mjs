import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { gzipSync,gunzipSync } from "node:zlib";
import { createRemoteR2S3Adapter } from "../deploy/remote_r2_s3_adapter.mjs";
import { buildOfficialTradingDatesV0_1 } from "../runtime/official_historical_backfill_source_v0_1.mjs";
import { fetchOfficialHistoricalA6ValuationDateV0_1 } from "../runtime/official_historical_a6_valuation_v0_1.mjs";
import { buildD08HistoricalValuationYearPackV0_1 } from "../runtime/d08_historical_valuation_year_pack_v0_1.mjs";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId=process.env.SYSTEM2_R2_ACCESS_KEY_ID;
const secretAccessKey=process.env.SYSTEM2_R2_SECRET_ACCESS_KEY;
const bucketName=String(process.env.SYSTEM2_R2_BUCKET||"system2-historical-research").trim();
const year=Number(process.env.D08_VALUATION_HISTORY_YEAR);
const capturedAt=new Date().toISOString();
assert.ok(accountId,"CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(accessKeyId,"SYSTEM2_R2_ACCESS_KEY_ID is required");
assert.ok(secretAccessKey,"SYSTEM2_R2_SECRET_ACCESS_KEY is required");
assert.ok(bucketName,"SYSTEM2_R2_BUCKET is required");
assert.ok(Number.isInteger(year)&&year>=2017&&year<=2026,"D08_VALUATION_HISTORY_YEAR must be 2017..2026");

const fromDate=year+"-01-01";
const toDate=year===2026?"2026-08-31":year+"-12-31";
const calendar=await buildOfficialTradingDatesV0_1({fromDate,toDate});
assert.ok(calendar.tradingDates.length>150,"TWSE trading-date coverage unexpectedly low for "+year);
if(year!==2026) assert.ok(calendar.tradingDates.length>220,"TWSE full-year trading dates unexpectedly low "+year);

const dateSources=[];
const dates=calendar.tradingDates;
for(let i=0;i<dates.length;i+=2){
  const batch=dates.slice(i,i+2);
  const got=await Promise.all(batch.map(marketDate=>
    fetchOfficialHistoricalA6ValuationDateV0_1({
      marketDate,
      observedAt:capturedAt,
      retryAttempts:6,
      retryDelayMs:650,
    })
  ));
  for(const source of got){
    assert.equal(source.state,"READY","A6 history source not READY "+source.marketDate);
    assert.equal(source.sourceDateEvidence,source.marketDate,"A6 source date mismatch");
    assert.ok(source.ordinarySymbolCount>500,"A6 ordinary symbol coverage too low "+source.marketDate);
    dateSources.push(source);
  }
  if(i+2<dates.length) await new Promise(r=>setTimeout(r,220));
}
dateSources.sort((a,b)=>a.marketDate.localeCompare(b.marketDate));
assert.equal(dateSources.length,dates.length,"A6 trading-date/source count mismatch");

const built=buildD08HistoricalValuationYearPackV0_1({year,fromDate,toDate,dateSources});
assert.equal(built.canonical.tradingDateCount,dates.length);
assert.ok(built.canonical.rowCount>100000,"annual valuation row count unexpectedly low");

const bytes=gzipSync(Buffer.from(built.payloadJson,"utf8"),{level:9});
const objectSha256=createHash("sha256").update(bytes).digest("hex");
const objectKey=["research","d08","twse-daily-valuation-year-v0.1",String(year),built.payloadHash+".json.gz"].join("/");
const store=createRemoteR2S3Adapter({accountId,accessKeyId,secretAccessKey,bucketName});
const before=await store.head(objectKey);
let objectState="IDENTICAL_OBJECT";
if(before){
  assert.equal(Number(before.size),bytes.byteLength,"existing year-pack object size mismatch");
  if(before.customMetadata?.["payload-hash"]) assert.equal(before.customMetadata["payload-hash"],built.payloadHash);
  if(before.customMetadata?.["object-sha256"]) assert.equal(before.customMetadata["object-sha256"],objectSha256);
}else{
  const inserted=await store.putIfAbsent(objectKey,bytes,{
    contentType:"application/gzip",
    storageClass:"Standard",
    customMetadata:{
      "payload-hash":built.payloadHash,
      "object-sha256":objectSha256,
      "schema-version":"d08-twse-valuation-year-v0-1",
      "calendar-year":String(year),
      "source-bundle-hash":built.sourceBundleHash,
    },
  });
  assert.ok(inserted,"D08 year-pack R2 insert failed");
  objectState="INSERTED_OBJECT";
}
const readback=await store.get(objectKey);
assert.ok(readback,"D08 year-pack R2 readback missing");
assert.equal(createHash("sha256").update(Buffer.from(readback.bytes)).digest("hex"),objectSha256,"year-pack object SHA mismatch");
const parsed=JSON.parse(gunzipSync(Buffer.from(readback.bytes)).toString("utf8"));
assert.equal(JSON.stringify(parsed),built.payloadJson,"year-pack payload readback mismatch");

console.log("D08_VALUATION_YEAR_RECEIPT="+JSON.stringify({
  schemaVersion:"D08_TWSE_HISTORICAL_VALUATION_YEAR_R2_RECEIPT_V0_1",
  result:"PASS",researchOnly:true,outcomeJoin:false,
  capturedAt,bucketName,year,fromDate,toDate,
  tradingDateCount:built.canonical.tradingDateCount,
  rowCount:built.canonical.rowCount,
  peKnownCount:built.canonical.peKnownCount,
  pbKnownCount:built.canonical.pbKnownCount,
  minDailyRows:built.canonical.minDailyRows,
  maxDailyRows:built.canonical.maxDailyRows,
  fieldFingerprints:built.canonical.fieldFingerprints,
  schemaCapabilityVariants:built.canonical.schemaCapabilityVariants,
  fiscalPeriodObservableDateCount:built.canonical.fiscalPeriodObservableDateCount,
  closeObservableDateCount:built.canonical.closeObservableDateCount,
  sourceBundleHash:built.sourceBundleHash,
  payloadHash:built.payloadHash,
  objectSha256,objectKey,gzipBytes:bytes.byteLength,
  objectState,readbackVerified:true,
  historySemantics:{
    fixedWindowsSupported:[252,756,1260],
    expandingStatus:"BOUNDED_FROM_2017_NOT_FULL_SOURCE_HISTORY",
    fullHistoryExpanding:"UNKNOWN_UNTIL_2005_09_01_PLUS_COMPLETE_REPLAY",
  },
  guards:{noReturns:true,noD1Writes:true,noSystem1Runtime:true,noFormalCoreImpact:true},
}));
