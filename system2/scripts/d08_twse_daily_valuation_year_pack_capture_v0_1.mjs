import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { gzipSync,gunzipSync } from "node:zlib";
import { fetchHistoricalTwseMonthlyTradingDatesV0_1 } from "../runtime/historical_twse_calendar_v0_1.mjs";
import { fetchOfficialHistoricalA6ValuationDateV0_1 } from "../runtime/official_historical_a6_valuation_v0_1.mjs";
import { buildD08ValuationYearPackV0_1,validateD08ValuationYearPackV0_1 } from "../runtime/d08_twse_daily_valuation_year_pack_v0_1.mjs";
import { createRemoteR2S3Adapter } from "../deploy/remote_r2_s3_adapter.mjs";

const year=Number(process.env.D08_YEAR||"2005");
assert.ok(Number.isInteger(year)&&year>=2005&&year<=2026,"D08_YEAR must be 2005..2026");
const fromDate=year===2005?"2005-09-02":String(year)+"-01-01";
const toDate=year===2026?"2026-08-31":String(year)+"-12-31";
const observedAt=new Date().toISOString();

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId=process.env.SYSTEM2_R2_ACCESS_KEY_ID;
const secretAccessKey=process.env.SYSTEM2_R2_SECRET_ACCESS_KEY;
const bucketName=String(process.env.SYSTEM2_R2_BUCKET||"system2-historical-research").trim();
assert.ok(accountId&&accessKeyId&&secretAccessKey&&bucketName,"R2 credentials/bucket required");

const monthStart=Number(fromDate.slice(5,7));
const monthEnd=Number(toDate.slice(5,7));
const exactTradingDates=[];
for(let month=monthStart;month<=monthEnd;month+=1){
  const monthly=await fetchHistoricalTwseMonthlyTradingDatesV0_1({year,month});
  for(const date of monthly.tradingDates){
    if(date>=fromDate&&date<=toDate) exactTradingDates.push(date);
  }
}
const trading={
  tradingDates:[...new Set(exactTradingDates)].sort(),
  tradingDateCount:new Set(exactTradingDates).size,
  source:"TWSE_OFFICIAL_FMTQIK_MONTHLY_HISTORICAL",
};
assert.ok(trading.tradingDateCount>0,"no exact trading dates "+year);
assert.equal(trading.tradingDateCount,exactTradingDates.length,"duplicate exact trading dates "+year);

const receipts=[];
for(let i=0;i<trading.tradingDates.length;i+=1){
  const date=trading.tradingDates[i];
  const r=await fetchOfficialHistoricalA6ValuationDateV0_1({
    marketDate:date,observedAt,retryAttempts:7,retryDelayMs:1000,
  });
  assert.equal(r.state,"READY","A6 not READY "+r.marketDate);
  assert.equal(r.sourceDateEvidence,r.marketDate);
  receipts.push(r);
  if(i+1<trading.tradingDates.length) await new Promise(resolve=>setTimeout(resolve,120));
}

const pack=buildD08ValuationYearPackV0_1({
  year,fromDate,toDate,calendarSource:trading.source,dayReceipts:receipts,
});
assert.equal(pack.tradingDateCount,trading.tradingDateCount);
assert.equal(validateD08ValuationYearPackV0_1(pack),true);

const json=JSON.stringify(pack);
// packPayloadHash intentionally hashes the canonical core before the hash field is attached.
// The stored-object identity is independently protected by objectSha256 below.
assert.equal(validateD08ValuationYearPackV0_1(pack),true);
const bytes=gzipSync(Buffer.from(json,"utf8"),{level:9});
const objectSha256=createHash("sha256").update(bytes).digest("hex");
const objectKey=["research","d08","twse-daily-valuation-year-pack-v0.1",String(year),pack.packPayloadHash+".json.gz"].join("/");

const store=createRemoteR2S3Adapter({accountId,accessKeyId,secretAccessKey,bucketName});
const prior=await store.head(objectKey);
let inserted=false;
if(prior){
  assert.equal(Number(prior.size),bytes.byteLength,"existing year-pack size mismatch");
  if(prior.customMetadata?.["payload-hash"]) assert.equal(prior.customMetadata["payload-hash"],pack.packPayloadHash);
  if(prior.customMetadata?.["object-sha256"]) assert.equal(prior.customMetadata["object-sha256"],objectSha256);
}else{
  const put=await store.putIfAbsent(objectKey,bytes,{
    contentType:"application/gzip",storageClass:"Standard",
    customMetadata:{
      "payload-hash":pack.packPayloadHash,
      "object-sha256":objectSha256,
      "schema-version":"d08-twse-daily-valuation-year-pack-v0-1",
      "year":String(year),
    },
  });
  assert.ok(put,"year-pack insert failed");
  inserted=true;
}
const read=await store.get(objectKey);
assert.ok(read,"year-pack readback missing");
assert.equal(createHash("sha256").update(Buffer.from(read.bytes)).digest("hex"),objectSha256);
const readPack=JSON.parse(gunzipSync(Buffer.from(read.bytes)).toString("utf8"));
assert.equal(validateD08ValuationYearPackV0_1(readPack),true);
assert.equal(readPack.packPayloadHash,pack.packPayloadHash);

const dayCounts=pack.days.map(d=>d.ordinarySymbolCount);
const peRatios=pack.days.map(d=>d.ordinarySymbolCount?d.peKnownCount/d.ordinarySymbolCount:0);
const pbRatios=pack.days.map(d=>d.ordinarySymbolCount?d.pbKnownCount/d.ordinarySymbolCount:0);
console.log("D08_YEAR_PACK_RECEIPT="+JSON.stringify({
  schemaVersion:"D08_TWSE_DAILY_VALUATION_YEAR_PACK_RECEIPT_V0_1",
  result:"PASS",researchOnly:true,outcomeJoin:false,
  capturedAt:observedAt,year,fromDate,toDate,
  calendarSource:trading.source,tradingDateCount:pack.tradingDateCount,
  totalRows:pack.totalRows,totalPeKnown:pack.totalPeKnown,totalPbKnown:pack.totalPbKnown,
  minDailySymbolCount:Math.min(...dayCounts),maxDailySymbolCount:Math.max(...dayCounts),
  minDailyPeKnownRatio:Math.min(...peRatios),maxDailyPeKnownRatio:Math.max(...peRatios),
  minDailyPbKnownRatio:Math.min(...pbRatios),maxDailyPbKnownRatio:Math.max(...pbRatios),
  sourceBundleHash:pack.sourceBundleHash,packPayloadHash:pack.packPayloadHash,
  objectSha256,objectKey,gzipBytes:bytes.byteLength,inserted,readbackVerified:true,
  guards:{noReturns:true,noD1Writes:true,noSystem1Runtime:true,noFormalCoreImpact:true},
}));
