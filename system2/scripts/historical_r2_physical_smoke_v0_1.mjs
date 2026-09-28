import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRemoteR2S3Adapter } from "../deploy/remote_r2_s3_adapter.mjs";
import { fetchOfficialHistoricalA1DateV0_1 } from "../runtime/official_historical_a1_source_v0_1.mjs";
import {
  buildHistoricalA1PacksResearchV0_1,
  unpackHistoricalA1PackResearchV0_1,
} from "../runtime/historical_pack_research_v0_1.mjs";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId=process.env.SYSTEM2_R2_ACCESS_KEY_ID;
const secretAccessKey=process.env.SYSTEM2_R2_SECRET_ACCESS_KEY;
const bucketName=String(process.env.SYSTEM2_R2_BUCKET||"system2-historical-research").trim();
const marketDate=String(process.env.SYSTEM2_R2_SMOKE_DATE||"2026-09-24").trim();
const targets={
  TWSE:String(process.env.SYSTEM2_R2_SMOKE_TWSE||"2330").trim(),
  TPEX:String(process.env.SYSTEM2_R2_SMOKE_TPEX||"6488").trim(),
};
const observedAt=new Date().toISOString();

assert.ok(accountId,"CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(accessKeyId,"SYSTEM2_R2_ACCESS_KEY_ID is required");
assert.ok(secretAccessKey,"SYSTEM2_R2_SECRET_ACCESS_KEY is required");
assert.ok(bucketName,"SYSTEM2_R2_BUCKET is required");
assert.match(marketDate,/^\d{4}-\d{2}-\d{2}$/,"SYSTEM2_R2_SMOKE_DATE must be YYYY-MM-DD");

function bytesSha256(bytes){
  return createHash("sha256").update(Buffer.from(bytes)).digest("hex");
}

const objectStore=createRemoteR2S3Adapter({
  accountId,accessKeyId,secretAccessKey,bucketName,
});

const receipts=[];
for(const market of ["TWSE","TPEX"]){
  const source=await fetchOfficialHistoricalA1DateV0_1({
    market,marketDate,observedAt,
  });
  assert.equal(source.state,"READY",`${market} official source must be READY`);
  assert.equal(source.sourceDateEvidence,marketDate,`${market} source date mismatch`);

  const symbol=targets[market];
  const row=source.rows.find((item)=>item.symbol===symbol);
  assert.ok(row,`${market} smoke symbol ${symbol} missing on ${marketDate}`);

  const packSet=await buildHistoricalA1PacksResearchV0_1({
    rows:[{
      ...row,
      sourceId:source.sourceId,
      sourceName:source.sourceName,
      sourceRowHash:bytesSha256(Buffer.from(JSON.stringify(row.sourceFields||{}),"utf8")),
    }],
    capturedAt:observedAt,
  });
  assert.equal(packSet.packCount,1);
  assert.equal(packSet.barCount,1);
  const pack=packSet.packs[0];
  const bytes=Buffer.from(pack.gzipBase64,"base64");
  assert.equal(bytesSha256(bytes),pack.objectSha256);

  const key=[
    "smoke",
    "r2-physical-v0.2",
    market.toLowerCase(),
    symbol,
    marketDate,
    pack.payloadHash+".json.gz",
  ].join("/");

  const before=await objectStore.head(key);
  if(before){
    assert.equal(Number(before.size),bytes.byteLength,"existing smoke object size mismatch");
    if(before.customMetadata?.["payload-hash"]){
      assert.equal(before.customMetadata["payload-hash"],pack.payloadHash,"existing smoke payload hash mismatch");
    }
    if(before.customMetadata?.["object-sha256"]){
      assert.equal(before.customMetadata["object-sha256"],pack.objectSha256,"existing smoke object hash mismatch");
    }
  }else{
    const inserted=await objectStore.putIfAbsent(key,bytes,{
      contentType:"application/gzip",
      storageClass:"Standard",
      customMetadata:{
        "payload-hash":pack.payloadHash,
        "object-sha256":pack.objectSha256,
        "smoke-version":"r2-physical-v0-2",
      },
    });
    assert.ok(inserted,`${market} smoke object insert failed`);
  }

  const stored=await objectStore.get(key);
  assert.ok(stored,`${market} smoke object readback missing`);
  assert.equal(bytesSha256(stored.bytes),pack.objectSha256,`${market} readback sha256 mismatch`);

  const unpacked=await unpackHistoricalA1PackResearchV0_1({
    ...pack,
    gzipBase64:Buffer.from(stored.bytes).toString("base64"),
  });
  assert.equal(unpacked.market,market);
  assert.equal(unpacked.symbol,symbol);
  assert.equal(unpacked.bars.length,1);
  assert.equal(unpacked.bars[0][0],marketDate);

  const duplicate=await objectStore.putIfAbsent(key,bytes,{
    contentType:"application/gzip",
    storageClass:"Standard",
    customMetadata:{
      "payload-hash":pack.payloadHash,
      "object-sha256":pack.objectSha256,
      "smoke-version":"r2-physical-v0-2",
    },
  });
  assert.equal(duplicate,null,`${market} create-only rerun guard did not return existing-object state`);

  const finalHead=await objectStore.head(key);
  assert.ok(finalHead,`${market} final HEAD missing`);
  assert.equal(Number(finalHead.size),bytes.byteLength);

  receipts.push({
    market,
    symbol,
    marketDate,
    objectKey:key,
    gzipBytes:bytes.byteLength,
    payloadHash:pack.payloadHash,
    objectSha256:pack.objectSha256,
    sourceId:source.sourceId,
    sourceDateEvidence:source.sourceDateEvidence,
    readbackVerified:true,
    unpackVerified:true,
    createOnlyRerunVerified:true,
  });
}

console.log(JSON.stringify({
  result:"PASS",
  smokeVersion:"S2_R2_PHYSICAL_SMOKE_V0_2",
  bucketName,
  objectCount:receipts.length,
  receipts,
  d1WritePerformed:false,
  annualManifestWritePerformed:false,
  fullBackfillPerformed:false,
  system1RuntimeChanged:false,
},null,2));
