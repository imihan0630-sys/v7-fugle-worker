import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { gzipSync, gunzipSync } from "node:zlib";
import { createRemoteR2S3Adapter } from "../deploy/remote_r2_s3_adapter.mjs";
import { buildHistoricalUniverseSnapshotV0_1 } from "../runtime/historical_universe_registry_v0_1.mjs";
import { buildD08TwseHistoricalUniverseSourceV0_1, buildD08SemanticUniverseIdentityV0_1 } from "../runtime/d08_twse_historical_universe_source_v0_1.mjs";
import { fetchOfficialHistoricalA6ValuationDateV0_1 } from "../runtime/official_historical_a6_valuation_v0_1.mjs";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId=process.env.SYSTEM2_R2_ACCESS_KEY_ID;
const secretAccessKey=process.env.SYSTEM2_R2_SECRET_ACCESS_KEY;
const bucketName=String(process.env.SYSTEM2_R2_BUCKET||"system2-historical-research").trim();
assert.ok(accountId,"CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(accessKeyId,"SYSTEM2_R2_ACCESS_KEY_ID is required");
assert.ok(secretAccessKey,"SYSTEM2_R2_SECRET_ACCESS_KEY is required");
assert.ok(bucketName,"SYSTEM2_R2_BUCKET is required");

const shaBytes=bytes=>createHash("sha256").update(Buffer.from(bytes)).digest("hex");
const shaText=text=>createHash("sha256").update(text).digest("hex");
const observedAt=new Date().toISOString();
const scanReceipt=JSON.parse(fs.readFileSync("research/d08_twse_month_end_scan_date_receipt_20261004_v0_1.json","utf8"));
const universeReceipt=JSON.parse(fs.readFileSync("research/d08_twse_official_universe_source_receipt_20261004_v0_1.json","utf8"));
assert.equal(scanReceipt.monthCount,44);
assert.equal(universeReceipt.scanClock.snapshotCount,44);

const expectedByDate=new Map(universeReceipt.scanClock.snapshots.map(x=>[x.scanDate,x]));
const built=await buildD08TwseHistoricalUniverseSourceV0_1({observedAt});
console.log("D08_UNIVERSE_LIVE_RECEIPT="+JSON.stringify(built.sourceReceipt));
const registry=built.registry;
const semanticUniverse=buildD08SemanticUniverseIdentityV0_1(registry);
const semanticBySymbol=new Map(semanticUniverse.memberships.map(x=>[x.market+"|"+x.symbol,x]));
const objectStore=createRemoteR2S3Adapter({
  accountId,accessKeyId,secretAccessKey,bucketName,
});

async function processDate(entry){
  const date=entry.scanDate;
  const membership=await buildHistoricalUniverseSnapshotV0_1({
    snapshotId:"D08-TWSE-"+date,
    registry,marketDate:date,capturedAt:observedAt,
  });
  const expected=expectedByDate.get(date);
  assert.ok(expected,"missing durable universe expectation "+date);
  assert.equal(membership.memberCount,expected.memberCount,"historical universe count drift "+date);

  const source=await fetchOfficialHistoricalA6ValuationDateV0_1({
    marketDate:date,observedAt,
  });
  assert.equal(source.state,"READY","A6 source not READY "+date);
  assert.equal(source.sourceDateEvidence,date,"A6 source date mismatch "+date);
  const bySymbol=new Map(source.rows.map(x=>[x.symbol,x]));
  assert.equal(bySymbol.size,source.rows.length,"A6 duplicate escaped parser");

  const rows=membership.members.map(member=>{
    const semantic=semanticBySymbol.get(member.market+"|"+member.symbol);
    assert.ok(semantic,"semantic membership missing "+member.symbol);
    assert.ok(
      semantic.effectiveFrom<=date && (semantic.effectiveTo===null||semantic.effectiveTo>=date),
      "semantic membership inactive "+member.symbol+" "+date
    );
    const semanticMembershipHash=shaText(JSON.stringify(semantic));
    const v=bySymbol.get(member.symbol)||null;
    const sourceRowHash=v?shaText(JSON.stringify(v.sourceFields)):null;
    return {
      marketDate:date,
      market:"TWSE",
      symbol:member.symbol,
      semanticMembershipHash,
      valuationObserved:!!v,
      close:v?.close??null,
      pe:v?.pe??null,
      pb:v?.pb??null,
      peState:v?v.peState:"SOURCE_ROW_MISSING",
      pbState:v?v.pbState:"SOURCE_ROW_MISSING",
      fiscalReportPeriod:v?.fiscalReportPeriod??null,
      valuationSourceId:v?.sourceId??source.sourceId,
      valuationSourceRowHash:sourceRowHash,
    };
  }).sort((a,b)=>a.symbol.localeCompare(b.symbol));

  assert.equal(rows.length,membership.memberCount);
  const observed=rows.filter(x=>x.valuationObserved).length;
  const peKnown=rows.filter(x=>Number.isFinite(x.pe)).length;
  const pbKnown=rows.filter(x=>Number.isFinite(x.pb)).length;
  const peMissingPbKnown=rows.filter(x=>x.pe===null&&Number.isFinite(x.pb)).length;
  const pbMissingPeKnown=rows.filter(x=>x.pb===null&&Number.isFinite(x.pe)).length;
  const bothMissing=rows.filter(x=>x.pe===null&&x.pb===null).length;
  const fiscalKnown=rows.filter(x=>x.fiscalReportPeriod!==null).length;
  assert.equal(rows.length,peKnown+peMissingPbKnown+bothMissing,
    "PE coverage accounting mismatch "+date);
  assert.equal(rows.length,pbKnown+pbMissingPeKnown+bothMissing,
    "PB coverage accounting mismatch "+date);

  const coverage={
    baseUniverseCount:rows.length,
    valuationRowObservedCount:observed,
    valuationRowMissingCount:rows.length-observed,
    peKnownCount:peKnown,
    pbKnownCount:pbKnown,
    peMissingPbKnownCount:peMissingPbKnown,
    pbMissingPeKnownCount:pbMissingPeKnown,
    bothMissingCount:bothMissing,
    fiscalReportPeriodKnownCount:fiscalKnown,
    valuationObservedRatio:Number((observed/rows.length).toFixed(6)),
    peKnownRatio:Number((peKnown/rows.length).toFixed(6)),
    pbKnownRatio:Number((pbKnown/rows.length).toFixed(6)),
  };

  const semanticSnapshotHash=shaText(JSON.stringify({
    marketDate:date,
    semanticRegistryHash:semanticUniverse.semanticRegistryHash,
    members:rows.map(x=>({symbol:x.symbol,semanticMembershipHash:x.semanticMembershipHash})),
    schemaVersion:"D08_TWSE_SEMANTIC_MEMBERSHIP_SNAPSHOT_V0_1",
  }));
  const payload={
    schemaVersion:"D08_TWSE_RAW_VALUATION_SNAPSHOT_V0_2",
    researchOnly:true,outcomeJoin:false,
    marketDate:date,
    universe:{
      registryId:semanticUniverse.registryId,
      semanticRegistryHash:semanticUniverse.semanticRegistryHash,
      memberCount:membership.memberCount,
      semanticMembershipSnapshotHash:semanticSnapshotHash,
    },
    source:{
      sourceId:source.sourceId,
      sourceDateEvidence:source.sourceDateEvidence,
      sourcePayloadHash:source.sourcePayloadHash,
      sourcePayloadBytes:source.sourcePayloadBytes,
      fieldFingerprint:source.fieldFingerprint,
      ordinarySymbolCount:source.ordinarySymbolCount,
    },
    coverage,
    rows,
  };
  const json=JSON.stringify(payload);
  const payloadHash=shaText(json);
  const bytes=gzipSync(Buffer.from(json,"utf8"),{level:9});
  const objectSha256=shaBytes(bytes);
  const objectKey=["research","d08","twse-raw-valuation-snapshot-v0.2",date,payloadHash+".json.gz"].join("/");

  const prior=await objectStore.head(objectKey);
  if(prior){
    assert.equal(Number(prior.size),bytes.byteLength,"existing D08 object size mismatch "+date);
    if(prior.customMetadata?.["payload-hash"]) assert.equal(prior.customMetadata["payload-hash"],payloadHash);
    if(prior.customMetadata?.["object-sha256"]) assert.equal(prior.customMetadata["object-sha256"],objectSha256);
  }else{
    const inserted=await objectStore.putIfAbsent(objectKey,bytes,{
      contentType:"application/gzip",
      storageClass:"Standard",
      customMetadata:{
        "payload-hash":payloadHash,
        "object-sha256":objectSha256,
        "schema-version":"d08-twse-raw-valuation-v0-2",
        "market-date":date,
      },
    });
    assert.ok(inserted,"D08 R2 snapshot insert failed "+date);
  }
  const readback=await objectStore.get(objectKey);
  assert.ok(readback,"D08 R2 readback missing "+date);
  assert.equal(shaBytes(readback.bytes),objectSha256,"D08 R2 readback hash mismatch "+date);
  const parsed=JSON.parse(gunzipSync(Buffer.from(readback.bytes)).toString("utf8"));
  assert.equal(shaText(JSON.stringify(parsed)),payloadHash,"D08 payload readback hash mismatch "+date);
  assert.equal(parsed.rows.length,rows.length,"D08 row readback mismatch "+date);

  return {
    marketDate:date,
    memberCount:rows.length,
    coverage,
    sourcePayloadHash:source.sourcePayloadHash,
    sourcePayloadBytes:source.sourcePayloadBytes,
    semanticRegistryHash:semanticUniverse.semanticRegistryHash,
    semanticMembershipSnapshotHash:payload.universe.semanticMembershipSnapshotHash,
    payloadHash,objectSha256,objectKey,
    gzipBytes:bytes.byteLength,
    readbackVerified:true,
  };
}

const receipts=[];
for(let i=0;i<scanReceipt.scanDates.length;i+=4){
  const part=scanReceipt.scanDates.slice(i,i+4);
  receipts.push(...await Promise.all(part.map(processDate)));
  await new Promise(r=>setTimeout(r,120));
}
receipts.sort((a,b)=>a.marketDate.localeCompare(b.marketDate));
assert.equal(receipts.length,44);
assert.equal(receipts.every(x=>x.readbackVerified),true);

const summary={
  totalMembershipRows:receipts.reduce((s,x)=>s+x.memberCount,0),
  totalObservedValuationRows:receipts.reduce((s,x)=>s+x.coverage.valuationRowObservedCount,0),
  totalPeKnown:receipts.reduce((s,x)=>s+x.coverage.peKnownCount,0),
  totalPbKnown:receipts.reduce((s,x)=>s+x.coverage.pbKnownCount,0),
  totalSourceRowMissing:receipts.reduce((s,x)=>s+x.coverage.valuationRowMissingCount,0),
  minObservedRatio:Math.min(...receipts.map(x=>x.coverage.valuationObservedRatio)),
  maxObservedRatio:Math.max(...receipts.map(x=>x.coverage.valuationObservedRatio)),
  minPeKnownRatio:Math.min(...receipts.map(x=>x.coverage.peKnownRatio)),
  maxPeKnownRatio:Math.max(...receipts.map(x=>x.coverage.peKnownRatio)),
  minPbKnownRatio:Math.min(...receipts.map(x=>x.coverage.pbKnownRatio)),
  maxPbKnownRatio:Math.max(...receipts.map(x=>x.coverage.pbKnownRatio)),
  totalGzipBytes:receipts.reduce((s,x)=>s+x.gzipBytes,0),
  objectBundleHash:shaText(receipts.map(x=>[
    x.marketDate,x.memberCount,x.payloadHash,x.objectSha256,x.objectKey
  ].join("|")).join("\n")),
};

console.log("D08_RAW_VALUATION_R2_RECEIPT="+JSON.stringify({
  schemaVersion:"D08_TWSE_RAW_VALUATION_R2_CAPTURE_RECEIPT_V0_2",
  result:"PASS",researchOnly:true,outcomeJoin:false,
  capturedAt:observedAt,bucketName,
  scanDateListHash:scanReceipt.scanDateListHash,
  sourceUniverseReceipt:"research/d08_twse_official_universe_source_receipt_20261004_v0_1.json",
  volatileRegistryHash:registry.registryHash,
  semanticRegistryHash:semanticUniverse.semanticRegistryHash,
  universeSourceReceipt:built.sourceReceipt,
  summary,receipts,
  guards:{
    allMembersAccounted:true,
    missingRowsRemainExplicitUnknown:true,
    canonicalPayloadExcludesCaptureClock:true,
    semanticUniverseIdentityExcludesObserverClock:true,
    noReturns:true,noD1Writes:true,noSystem1Runtime:true,noFormalCoreImpact:true,
  },
}));
