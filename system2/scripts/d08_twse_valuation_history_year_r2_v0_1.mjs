import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { gzipSync,gunzipSync } from "node:zlib";
import { createRemoteR2S3Adapter } from "../deploy/remote_r2_s3_adapter.mjs";
import { buildOfficialTradingDatesV0_1 } from "../runtime/official_historical_backfill_source_v0_1.mjs";
import { fetchOfficialHistoricalA6ValuationDateV0_1 } from "../runtime/official_historical_a6_valuation_v0_1.mjs";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId=process.env.SYSTEM2_R2_ACCESS_KEY_ID;
const secretAccessKey=process.env.SYSTEM2_R2_SECRET_ACCESS_KEY;
const bucketName=String(process.env.SYSTEM2_R2_BUCKET||"system2-historical-research").trim();
const year=Number(process.env.D08_VALUATION_HISTORY_YEAR);
assert.ok(accountId&&accessKeyId&&secretAccessKey&&bucketName,"R2 credentials/config required");
assert.ok(Number.isInteger(year)&&year>=2017&&year<=2026,"D08_VALUATION_HISTORY_YEAR must be 2017..2026");

const store=createRemoteR2S3Adapter({accountId,accessKeyId,secretAccessKey,bucketName});
const shaBytes=b=>createHash("sha256").update(Buffer.from(b)).digest("hex");
const shaText=s=>createHash("sha256").update(s).digest("hex");
const manifestKey="research/d08/twse-valuation-history-v0.1/manifests/"+year+".json";

async function readJsonObject(key){
  const x=await store.get(key);
  if(!x) return null;
  return {bytes:x.bytes,json:JSON.parse(Buffer.from(x.bytes).toString("utf8")),metadata:x.metadata};
}

const priorManifest=await readJsonObject(manifestKey);
if(priorManifest){
  const m=priorManifest.json;
  assert.equal(m.schemaVersion,"D08_TWSE_VALUATION_HISTORY_YEAR_MANIFEST_V0_1");
  assert.equal(Number(m.year),year);
  const obj=await store.get(m.objectKey);
  assert.ok(obj,"D08 valuation history object missing for manifest "+year);
  assert.equal(shaBytes(obj.bytes),m.objectSha256,"D08 valuation history object hash mismatch "+year);
  const payload=JSON.parse(gunzipSync(Buffer.from(obj.bytes)).toString("utf8"));
  assert.equal(shaText(JSON.stringify(payload)),m.payloadHash,"D08 valuation history payload mismatch "+year);
  console.log("D08_VAL_HISTORY_YEAR_RECEIPT="+JSON.stringify({
    result:"PASS",state:"ALREADY_COMPLETE",year,bucketName,manifestKey,
    manifest:m,readbackVerified:true,noReturns:true,noD1Writes:true,noFormalCoreImpact:true,
  }));
  process.exit(0);
}

const fromDate=year+"-01-01";
const toDate=year===2026?"2026-08-31":year+"-12-31";
const observedAt=new Date().toISOString();
const trading=await buildOfficialTradingDatesV0_1({fromDate,toDate});
assert.ok(trading.tradingDateCount>(year===2026?150:200),"trading date count unexpectedly low "+year);

const days=[];
for(let i=0;i<trading.tradingDates.length;i+=6){
  const batch=trading.tradingDates.slice(i,i+6);
  const got=await Promise.all(batch.map(async marketDate=>{
    const src=await fetchOfficialHistoricalA6ValuationDateV0_1({marketDate,observedAt});
    assert.equal(src.state,"READY","A6 history not READY "+marketDate);
    assert.equal(src.sourceDateEvidence,marketDate,"A6 history date mismatch "+marketDate);
    const rows=src.rows.map(r=>({
      symbol:r.symbol,companyName:r.companyName,close:r.close,pe:r.pe,pb:r.pb,
      fiscalReportPeriod:r.fiscalReportPeriod,
      sourceRowHash:shaText(JSON.stringify(r.sourceFields)),
    })).sort((a,b)=>a.symbol.localeCompare(b.symbol));
    return {
      marketDate,
      sourceId:src.sourceId,
      sourcePayloadHash:src.sourcePayloadHash,
      sourcePayloadBytes:src.sourcePayloadBytes,
      fieldFingerprint:src.fieldFingerprint,
      ordinarySymbolCount:src.ordinarySymbolCount,
      rows,
    };
  }));
  days.push(...got);
  await new Promise(r=>setTimeout(r,100));
}
days.sort((a,b)=>a.marketDate.localeCompare(b.marketDate));
assert.equal(days.length,trading.tradingDateCount);
const totalRows=days.reduce((s,x)=>s+x.rows.length,0);
assert.ok(totalRows>(year===2026?150000:180000),"annual A6 row count unexpectedly low "+year);
const sourceBundleHash=shaText(days.map(x=>[
  x.marketDate,x.sourcePayloadHash,x.ordinarySymbolCount,x.fieldFingerprint
].join("|")).join("\n"));

const payload={
  schemaVersion:"D08_TWSE_VALUATION_HISTORY_YEAR_V0_1",
  researchOnly:true,outcomeJoin:false,
  year,fromDate,toDate,capturedAt:observedAt,
  tradingDateCount:days.length,totalRows,sourceBundleHash,days,
};
const json=JSON.stringify(payload);
const payloadHash=shaText(json);
const gz=gzipSync(Buffer.from(json,"utf8"),{level:9});
const objectSha256=shaBytes(gz);
const objectKey="research/d08/twse-valuation-history-v0.1/data/"+year+"/"+payloadHash+".json.gz";

const existing=await store.head(objectKey);
if(!existing){
  const inserted=await store.putIfAbsent(objectKey,gz,{
    contentType:"application/gzip",storageClass:"Standard",
    customMetadata:{
      "payload-hash":payloadHash,"object-sha256":objectSha256,
      "schema-version":"d08-twse-valuation-history-year-v0-1","year":String(year),
    },
  });
  assert.ok(inserted,"annual valuation history object insert failed "+year);
}else{
  assert.equal(Number(existing.size),gz.byteLength,"annual valuation history existing size mismatch "+year);
}
const readback=await store.get(objectKey);
assert.ok(readback,"annual valuation history readback missing "+year);
assert.equal(shaBytes(readback.bytes),objectSha256,"annual valuation history readback hash mismatch "+year);
const unpacked=JSON.parse(gunzipSync(Buffer.from(readback.bytes)).toString("utf8"));
assert.equal(shaText(JSON.stringify(unpacked)),payloadHash,"annual valuation history payload readback mismatch "+year);

const manifest={
  schemaVersion:"D08_TWSE_VALUATION_HISTORY_YEAR_MANIFEST_V0_1",
  year,fromDate,toDate,capturedAt:observedAt,
  tradingDateCount:days.length,totalRows,sourceBundleHash,
  payloadHash,objectSha256,objectKey,gzipBytes:gz.byteLength,
  sourceId:"A6_TWSE_BWIBBU_D_HISTORICAL",
  readbackVerified:true,
};
const manifestBytes=Buffer.from(JSON.stringify(manifest),"utf8");
const manifestSha256=shaBytes(manifestBytes);
const putManifest=await store.putIfAbsent(manifestKey,manifestBytes,{
  contentType:"application/json",storageClass:"Standard",
  customMetadata:{
    "manifest-sha256":manifestSha256,"payload-hash":payloadHash,
    "schema-version":"d08-twse-valuation-history-manifest-v0-1","year":String(year),
  },
});
if(!putManifest){
  const prior=await readJsonObject(manifestKey);
  assert.deepEqual(prior.json,manifest,"immutable annual manifest conflict "+year);
}
const manifestRead=await readJsonObject(manifestKey);
assert.ok(manifestRead,"annual manifest readback missing "+year);
assert.equal(shaBytes(manifestRead.bytes),manifestSha256,"annual manifest readback hash mismatch "+year);

console.log("D08_VAL_HISTORY_YEAR_RECEIPT="+JSON.stringify({
  result:"PASS",state:"YEAR_CAPTURE_COMPLETE",year,bucketName,manifestKey,
  manifest:{...manifest,manifestSha256},
  noReturns:true,noD1Writes:true,noFormalCoreImpact:true,
}));
