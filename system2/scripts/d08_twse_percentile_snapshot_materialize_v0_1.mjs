import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { gzipSync, gunzipSync } from "node:zlib";
import { createRemoteR2S3Adapter } from "../deploy/remote_r2_s3_adapter.mjs";
import { buildD08TwseHistoricalUniverseSourceV0_2 } from "../runtime/d08_twse_historical_universe_source_v0_2.mjs";
import { buildD08SemanticUniverseIdentityV0_1 } from "../runtime/d08_twse_historical_universe_source_v0_1.mjs";
import { historicalUniverseMembershipActiveOnDateV0_1 } from "../runtime/historical_universe_registry_v0_1.mjs";
import { validateD08ValuationYearPackV0_1 } from "../runtime/d08_twse_daily_valuation_year_pack_v0_1.mjs";
import { buildD08HistoricalValuationPercentileSnapshotV0_1 } from "../runtime/d08_historical_valuation_percentile_snapshot_v0_1.mjs";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId=process.env.SYSTEM2_R2_ACCESS_KEY_ID;
const secretAccessKey=process.env.SYSTEM2_R2_SECRET_ACCESS_KEY;
const bucketName=String(process.env.SYSTEM2_R2_BUCKET||"system2-historical-research").trim();
assert.ok(accountId,"CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(accessKeyId,"SYSTEM2_R2_ACCESS_KEY_ID is required");
assert.ok(secretAccessKey,"SYSTEM2_R2_SECRET_ACCESS_KEY is required");
assert.ok(bucketName,"SYSTEM2_R2_BUCKET is required");

const shaText=value=>createHash("sha256").update(String(value)).digest("hex");
const shaBytes=value=>createHash("sha256").update(Buffer.from(value)).digest("hex");
const observedAt=new Date().toISOString();

const contract=JSON.parse(fs.readFileSync("research/d08_historical_valuation_percentile_snapshot_contract_v0_2.json","utf8"));
const scanReceipt=JSON.parse(fs.readFileSync("research/d08_twse_month_end_scan_date_receipt_20261004_v0_1.json","utf8"));
const universeReceipt=JSON.parse(fs.readFileSync("research/d08_twse_official_universe_source_receipt_20261007_v0_2.json","utf8"));
const rawReceipt=JSON.parse(fs.readFileSync("research/d08_twse_raw_valuation_r2_capture_receipt_20261007_v0_3.json","utf8"));
const archiveManifest=JSON.parse(fs.readFileSync("research/d08_twse_daily_valuation_archive_manifest_20261007_v0_1.json","utf8"));

assert.equal(contract.outcomeGate,"CLOSED");
assert.equal(scanReceipt.monthCount,44);
assert.equal(universeReceipt.scanClock.snapshotCount,44);
assert.equal(rawReceipt.receipts.length,44);
assert.equal(archiveManifest.result,"PASS");
assert.equal(archiveManifest.yearCount,22);
assert.equal(archiveManifest.packBundleHash,contract.sourcePins.dailyArchivePackBundleHash);
assert.equal(universeReceipt.registry.semanticRegistryHash,contract.sourcePins.semanticRegistryHash);
assert.equal(universeReceipt.scanClock.semanticSnapshotBundleHash,contract.sourcePins.universeSemanticSnapshotBundleHash);
assert.equal(rawReceipt.summary.objectBundleHash,contract.sourcePins.rawValuationObjectBundleHash);
assert.equal(rawReceipt.guards.noReturns,true);
assert.equal(rawReceipt.guards.noD1Writes,true);
assert.equal(rawReceipt.guards.noSystem1Runtime,true);

const built=await buildD08TwseHistoricalUniverseSourceV0_2({observedAt});
const semanticUniverse=buildD08SemanticUniverseIdentityV0_1(built.registry);
assert.equal(semanticUniverse.semanticRegistryHash,universeReceipt.registry.semanticRegistryHash,"frozen V0.2 semantic registry drift");
for(const field of ["currentSourceHash","newListingSourceHash","delistingSourceHash"]){
  assert.equal(built.sourceReceipt[field],universeReceipt.sourceReceipt[field],"frozen V0.2 source drift "+field);
}
assert.deepEqual([...built.sourceReceipt.currentListingStartReconciledSymbols],universeReceipt.sourceReceipt.currentListingStartReconciledSymbols);

const semanticBySymbol=new Map();
for(const m of semanticUniverse.memberships){
  const key=m.market+"|"+m.symbol;
  assert.ok(!semanticBySymbol.has(key),"semantic symbol reuse requires episode-aware materializer: "+key);
  semanticBySymbol.set(key,m);
}
const cohortSymbols=new Set([...semanticBySymbol.values()].map(x=>x.symbol));

const objectStore=createRemoteR2S3Adapter({accountId,accessKeyId,secretAccessKey,bucketName});
const historyBySymbol=new Map();

for(const y of archiveManifest.years){
  const stored=await objectStore.get(y.objectKey);
  assert.ok(stored,"missing frozen valuation year pack "+y.year);
  assert.equal(shaBytes(stored.bytes),y.objectSha256,"year-pack byte hash mismatch "+y.year);
  const pack=JSON.parse(gunzipSync(Buffer.from(stored.bytes)).toString("utf8"));
  assert.equal(pack.packPayloadHash,y.packPayloadHash,"year-pack payload hash mismatch "+y.year);
  assert.equal(validateD08ValuationYearPackV0_1(pack),true);
  for(const day of pack.days){
    for(const row of day.rows){
      if(!cohortSymbols.has(row.symbol)) continue;
      if(!historyBySymbol.has(row.symbol)) historyBySymbol.set(row.symbol,[]);
      historyBySymbol.get(row.symbol).push({
        marketDate:day.marketDate,
        symbol:row.symbol,
        pe:row.pe,
        pb:row.pb,
        fiscalReportPeriod:row.fiscalReportPeriod,
      });
    }
  }
}

const rawByDate=new Map(rawReceipt.receipts.map(x=>[x.marketDate,x]));
const universeByDate=new Map(universeReceipt.scanClock.snapshots.map(x=>[x.scanDate,x]));
const materialized=[];

for(const scan of scanReceipt.scanDates){
  const date=scan.scanDate;
  const rawMeta=rawByDate.get(date);
  const universeMeta=universeByDate.get(date);
  assert.ok(rawMeta&&universeMeta,"missing frozen scan metadata "+date);

  const storedRaw=await objectStore.get(rawMeta.objectKey);
  assert.ok(storedRaw,"missing raw V0.3 snapshot "+date);
  assert.equal(shaBytes(storedRaw.bytes),rawMeta.objectSha256,"raw V0.3 byte hash mismatch "+date);
  const raw=JSON.parse(gunzipSync(Buffer.from(storedRaw.bytes)).toString("utf8"));
  assert.equal(shaText(JSON.stringify(raw)),rawMeta.payloadHash,"raw V0.3 payload hash mismatch "+date);
  assert.equal(raw.schemaVersion,"D08_TWSE_RAW_VALUATION_SNAPSHOT_V0_3");
  assert.equal(raw.marketDate,date);
  assert.equal(raw.universe.semanticRegistryHash,semanticUniverse.semanticRegistryHash);
  assert.equal(raw.universe.memberCount,universeMeta.memberCount);
  assert.equal(raw.rows.length,universeMeta.memberCount);

  const members=semanticUniverse.memberships
    .filter(m=>historicalUniverseMembershipActiveOnDateV0_1(m,date))
    .map(m=>({
      ...m,
      semanticMembershipHash:shaText(JSON.stringify(m)),
    }))
    .sort((a,b)=>a.symbol.localeCompare(b.symbol));
  assert.equal(members.length,universeMeta.memberCount,"semantic cohort count mismatch "+date);

  const rawRowBySymbol=new Map(raw.rows.map(r=>[r.symbol,r]));
  assert.equal(rawRowBySymbol.size,raw.rows.length,"raw duplicate symbol "+date);
  for(const member of members){
    const row=rawRowBySymbol.get(member.symbol);
    assert.ok(row,"raw member missing "+date+" "+member.symbol);
    assert.equal(row.semanticMembershipHash,member.semanticMembershipHash,"raw semantic membership mismatch "+date+" "+member.symbol);
  }

  const snapshot=buildD08HistoricalValuationPercentileSnapshotV0_1({
    scanDate:date,
    members,
    rawRows:raw.rows,
    historyBySymbol,
    semanticRegistryHash:semanticUniverse.semanticRegistryHash,
    scanDateListHash:scanReceipt.scanDateListHash,
  });
  assert.equal(snapshot.coverage.memberCount,raw.coverage.baseUniverseCount);
  assert.equal(snapshot.coverage.rawValuationObservedCount,raw.coverage.valuationRowObservedCount);
  assert.equal(snapshot.coverage.peKnownCount,raw.coverage.peKnownCount);
  assert.equal(snapshot.coverage.pbKnownCount,raw.coverage.pbKnownCount);

  const json=JSON.stringify(snapshot);
  const bytes=gzipSync(Buffer.from(json,"utf8"),{level:9});
  const objectSha256=shaBytes(bytes);
  const objectKey=[
    "research","d08","twse-historical-valuation-percentile-snapshot-v0.1",
    date,snapshot.snapshotPayloadHash+".json.gz"
  ].join("/");

  const prior=await objectStore.head(objectKey);
  if(prior){
    assert.equal(Number(prior.size),bytes.byteLength,"existing percentile object size mismatch "+date);
    if(prior.customMetadata?.["snapshot-payload-hash"]){
      assert.equal(prior.customMetadata["snapshot-payload-hash"],snapshot.snapshotPayloadHash);
    }
    if(prior.customMetadata?.["object-sha256"]){
      assert.equal(prior.customMetadata["object-sha256"],objectSha256);
    }
  }else{
    const inserted=await objectStore.putIfAbsent(objectKey,bytes,{
      contentType:"application/gzip",
      storageClass:"Standard",
      customMetadata:{
        "snapshot-payload-hash":snapshot.snapshotPayloadHash,
        "object-sha256":objectSha256,
        "schema-version":"d08-twse-historical-valuation-percentile-snapshot-v0-1",
        "market-date":date,
        "pack-bundle-hash":archiveManifest.packBundleHash,
      },
    });
    assert.ok(inserted,"percentile snapshot insert failed "+date);
  }

  const readback=await objectStore.get(objectKey);
  assert.ok(readback,"percentile snapshot readback missing "+date);
  assert.equal(shaBytes(readback.bytes),objectSha256,"percentile snapshot byte readback mismatch "+date);
  const parsed=JSON.parse(gunzipSync(Buffer.from(readback.bytes)).toString("utf8"));
  const {snapshotPayloadHash,...canonical}=parsed;
  assert.equal(snapshotPayloadHash,snapshot.snapshotPayloadHash);
  assert.equal(shaText(JSON.stringify(canonical)),snapshotPayloadHash,"percentile snapshot canonical hash mismatch "+date);
  assert.equal(parsed.rows.length,snapshot.rows.length);

  materialized.push({
    marketDate:date,
    memberCount:snapshot.coverage.memberCount,
    coverage:snapshot.coverage,
    snapshotPayloadHash:snapshot.snapshotPayloadHash,
    objectSha256,
    objectKey,
    gzipBytes:bytes.byteLength,
    readbackVerified:true,
  });
}

materialized.sort((a,b)=>a.marketDate.localeCompare(b.marketDate));
assert.equal(materialized.length,44);
assert.equal(materialized.every(x=>x.readbackVerified),true);

const coverageFields=[
  "memberCount","rawValuationObservedCount","peKnownCount","pbKnownCount",
  "pe252KnownCount","pe756KnownCount","pe1260KnownCount","peExpandingKnownCount",
  "pb252KnownCount","pb756KnownCount","pb1260KnownCount","pbExpandingKnownCount",
  "fiscalTransitionKnownCount",
];
const coverageTotals=Object.fromEntries(coverageFields.map(field=>[
  field,materialized.reduce((sum,x)=>sum+Number(x.coverage[field]||0),0)
]));
const bundleLines=materialized.map(x=>[
  x.marketDate,x.snapshotPayloadHash,x.memberCount,
  x.coverage.pe252KnownCount,x.coverage.pe756KnownCount,x.coverage.pe1260KnownCount,x.coverage.peExpandingKnownCount,
  x.coverage.pb252KnownCount,x.coverage.pb756KnownCount,x.coverage.pb1260KnownCount,x.coverage.pbExpandingKnownCount,
].join("|"));
const snapshotBundleHash=shaText(bundleLines.join("\n"));
const objectBundleHash=shaText(materialized.map(x=>[
  x.marketDate,x.snapshotPayloadHash,x.objectSha256,x.objectKey
].join("|")).join("\n"));

const receipt={
  schemaVersion:"D08_TWSE_HISTORICAL_VALUATION_PERCENTILE_MATERIALIZATION_RECEIPT_V0_1",
  result:"PASS",
  researchOnly:true,
  outcomeJoin:false,
  capturedAt:observedAt,
  bucketName,
  sourcePins:contract.sourcePins,
  sourceFiles:{
    contract:"research/d08_historical_valuation_percentile_snapshot_contract_v0_2.json",
    archiveManifest:"research/d08_twse_daily_valuation_archive_manifest_20261007_v0_1.json",
    universeReceipt:"research/d08_twse_official_universe_source_receipt_20261007_v0_2.json",
    rawValuationReceipt:"research/d08_twse_raw_valuation_r2_capture_receipt_20261007_v0_3.json",
  },
  scanDateListHash:scanReceipt.scanDateListHash,
  semanticRegistryHash:semanticUniverse.semanticRegistryHash,
  snapshotCount:materialized.length,
  coverageTotals,
  snapshotBundleHash,
  objectBundleHash,
  snapshots:materialized,
  guards:{
    allCohortMembersAccounted:true,
    rawV03CrosscheckExact:true,
    yearPackReadbackVerified:true,
    rawSnapshotReadbackVerified:true,
    percentileSnapshotReadbackVerified:true,
    missingValuesRemainUnknown:true,
    futureHistoryExcluded:true,
    noReturns:true,
    noOutcomeJoin:true,
    noD1Writes:true,
    noSystem1Runtime:true,
    noFormalCoreImpact:true,
  },
  nextGate:"CONTROL_SNAPSHOT_FREEZE_THEN_PREREGISTERED_SHADOW_OUTCOME_JOIN",
};

console.log("D08_PERCENTILE_MATERIALIZATION_RECEIPT="+JSON.stringify(receipt));
