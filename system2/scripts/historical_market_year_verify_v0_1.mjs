import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { createRemoteD1RestAdapter } from "../deploy/remote_d1_rest_adapter.mjs";
import { createRemoteR2S3Adapter } from "../deploy/remote_r2_s3_adapter.mjs";
import {
  readHistoricalColdReceiptV0_1,
  verifyHistoricalColdReceiptV0_1,
} from "../runtime/historical_cold_pack_store_v0_1.mjs";
import { materializeHistoricalA1PackRowsV0_1 } from "../runtime/historical_pack_store_v0_1.mjs";
import { fetchOfficialHistoricalA1RangeV0_1 } from "../runtime/official_historical_backfill_source_v0_1.mjs";
import { buildD08TwseHistoricalUniverseSourceV0_1 } from "../runtime/d08_twse_historical_universe_source_v0_1.mjs";
import { buildHistoricalUniverseRegistryV0_1 } from "../runtime/historical_universe_registry_v0_1.mjs";
import { buildHistoricalMarketYearCoverageV0_1 } from "../runtime/historical_market_year_coverage_v0_1.mjs";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
const r2AccessKeyId=process.env.SYSTEM2_R2_ACCESS_KEY_ID;
const r2SecretAccessKey=process.env.SYSTEM2_R2_SECRET_ACCESS_KEY;
const r2Bucket=String(process.env.SYSTEM2_R2_BUCKET||"system2-historical-research").trim();
const market=String(process.env.SYSTEM2_HISTORY_YEAR_MARKET||"").trim();
const year=Number(process.env.SYSTEM2_HISTORY_YEAR||2017);
const outputPath=String(process.env.SYSTEM2_HISTORY_COVERAGE_OUTPUT||"").trim();
const observedAt=new Date().toISOString();

assert.ok(accountId,"CLOUDFLARE_ACCOUNT_ID is required");
assert.ok(apiToken,"SYSTEM2_CLOUDFLARE_API_TOKEN is required");
assert.ok(r2AccessKeyId,"SYSTEM2_R2_ACCESS_KEY_ID is required");
assert.ok(r2SecretAccessKey,"SYSTEM2_R2_SECRET_ACCESS_KEY is required");
assert.equal(market,"TWSE","V0.1 physical market-year verifier currently supports TWSE only");
assert.ok(Number.isInteger(year)&&year>=2017&&year<=2100,"SYSTEM2_HISTORY_YEAR must be >=2017");

const fromDate=`${year}-01-01`;
const requestedTo=String(process.env.SYSTEM2_HISTORY_VERIFY_TO_DATE||`${year}-12-31`).trim();
assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(requestedTo),"SYSTEM2_HISTORY_VERIFY_TO_DATE must be YYYY-MM-DD");
assert.equal(Number(requestedTo.slice(0,4)),year,"verification to-date must belong to requested year");
const toDate=requestedTo;
const batchId=`S2-HIST-PACK-YEAR|${market}|${year}`;

function sha256Bytes(bytes){
  return createHash("sha256").update(Buffer.from(bytes)).digest("hex");
}
function sha256Text(text){
  return createHash("sha256").update(String(text)).digest("hex");
}
function chunks(values,size){
  const out=[];
  for(let i=0;i<values.length;i+=size)out.push(values.slice(i,i+size));
  return out;
}
function dateFromAny(raw){
  const text=String(raw??"").trim();
  if(!text)return null;
  let m=text.match(/(\d{2,4})[年\/.\-](\d{1,2})[月\/.\-](\d{1,2})/);
  if(m){
    let y=Number(m[1]);
    if(y<1911)y+=1911;
    return `${String(y).padStart(4,"0")}-${String(Number(m[2])).padStart(2,"0")}-${String(Number(m[3])).padStart(2,"0")}`;
  }
  const digits=text.replace(/\D/g,"");
  if(digits.length===8){
    return `${digits.slice(0,4)}-${digits.slice(4,6)}-${digits.slice(6,8)}`;
  }
  if(digits.length===7){
    const y=Number(digits.slice(0,3))+1911;
    return `${y}-${digits.slice(3,5)}-${digits.slice(5,7)}`;
  }
  return null;
}
function normalizedField(value){
  return String(value??"").replace(/<[^>]*>/g,"").replace(/\s+/g,"").trim();
}

async function fetchTwseSuspensionIntervals(){
  const start=fromDate.replaceAll("-","");
  const end=toDate.replaceAll("-","");
  const url="https://www.twse.com.tw/rwd/zh/afterTrading/TWTAWU"
    +`?startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}&querytype=3&response=json`;
  const response=await fetch(url,{
    headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-DATA-LANE-market-year-verify/0.1"},
    signal:AbortSignal.timeout(60000),
  });
  const rawText=await response.text();
  assert.equal(response.ok,true,"TWTAWU HTTP "+response.status);
  const payload=JSON.parse(rawText);
  const fields=Array.isArray(payload?.fields)?payload.fields.map(normalizedField):[];
  const data=Array.isArray(payload?.data)?payload.data:[];
  assert.ok(fields.length>0,"TWTAWU fields required");
  const symbolIndex=fields.findIndex((x)=>x.includes("證券代號")||x.includes("股票代號")||x==="代號");
  const suspendedIndex=fields.findIndex((x)=>
    (x.includes("停止買賣")||x.includes("暫停交易")||x.includes("停止交易"))&&x.includes("日期"));
  const resumedIndex=fields.findIndex((x)=>
    (x.includes("恢復買賣")||x.includes("恢復交易"))&&x.includes("日期"));
  assert.ok(symbolIndex>=0,"TWTAWU symbol field missing");
  assert.ok(suspendedIndex>=0,"TWTAWU suspension-date field missing: "+fields.join("|"));

  const intervals=[];
  for(const row of data){
    if(!Array.isArray(row))continue;
    const symbol=String(row[symbolIndex]??"").trim();
    if(!/^[1-9][0-9]{3}$/.test(symbol))continue;
    const suspendedFrom=dateFromAny(row[suspendedIndex]);
    const resumedOn=resumedIndex>=0?dateFromAny(row[resumedIndex]):null;
    if(!suspendedFrom)continue;
    intervals.push({
      market:"TWSE",symbol,suspendedFrom,resumedOn,coverageTo:toDate,
      sourceRowHash:sha256Text(JSON.stringify({fields,row})),
    });
  }
  return {
    sourceUrl:url,
    sourceHash:sha256Text(rawText),
    upstreamStatus:payload?.stat??payload?.status??null,
    fields,
    intervalCount:intervals.length,
    intervals,
    absenceCertifiesNoSuspension:false,
    sourceHistoryStart:"2011-10-03",
  };
}

const db=await createRemoteD1RestAdapter({
  accountId,apiToken,databaseName:"system2-research",
});
const objectStore=createRemoteR2S3Adapter({
  accountId,accessKeyId:r2AccessKeyId,secretAccessKey:r2SecretAccessKey,bucketName:r2Bucket,
});

const schema=await db.rawQuery(
  "SELECT schema_value FROM s2_schema_meta WHERE schema_key='schema_version' LIMIT 1"
);
assert.equal(schema[0]?.schema_value,"1.1","isolated D1 must be schema 1.1");

const receipt=await readHistoricalColdReceiptV0_1({db,batchId});
assert.ok(receipt,"completed annual receipt is required");
assert.equal(receipt.state,"COMPLETE","annual receipt must be COMPLETE");
const headVerification=await verifyHistoricalColdReceiptV0_1({db,objectStore,receipt});

const checkpoints=await db.rawQuery(
  "SELECT * FROM s2_historical_cold_backfill_checkpoints WHERE batch_id=? LIMIT 1",
  [batchId],
);
const checkpoint=checkpoints[0]||null;
assert.ok(checkpoint,"historical cold checkpoint missing");
assert.equal(checkpoint.state,"COMPLETE","historical cold checkpoint must be COMPLETE");
assert.equal(Number(checkpoint.object_ready_count),Number(receipt.pack_count),"checkpoint object count mismatch");
assert.equal(Number(checkpoint.manifest_committed_count),Number(receipt.pack_count),"checkpoint manifest count mismatch");
assert.equal(Number(checkpoint.expected_bar_count),Number(receipt.bar_count),"checkpoint bar count mismatch");

const manifests=await db.rawQuery(
  "SELECT * FROM s2_historical_a1_pack_manifests WHERE market=? AND year=? AND price_space='RAW' ORDER BY symbol",
  [market,year],
);
assert.equal(manifests.length,Number(receipt.pack_count),"manifest count mismatch");

const coldRows=[];
let objectByteHashVerified=0;
for(const part of chunks(manifests,25)){
  const loaded=await Promise.all(part.map(async(manifest)=>{
    const object=await objectStore.get(manifest.object_key);
    assert.ok(object,"R2 object missing: "+manifest.object_key);
    const actualSha=sha256Bytes(object.bytes);
    assert.equal(actualSha,manifest.object_sha256,"R2 object byte hash mismatch: "+manifest.object_key);
    assert.equal(Number(object.bytes.byteLength),Number(manifest.gzip_bytes),"R2 object byte size mismatch: "+manifest.object_key);
    const pack={
      packId:manifest.pack_id,market:manifest.market,symbol:manifest.symbol,year:manifest.year,
      priceSpace:manifest.price_space,firstMarketDate:manifest.first_market_date,lastMarketDate:manifest.last_market_date,
      barCount:manifest.bar_count,payloadHash:manifest.payload_hash,
      gzipBase64:Buffer.from(object.bytes).toString("base64"),
      capturedAt:manifest.captured_at,schemaVersion:manifest.pack_schema_version,
    };
    const materialized=await materializeHistoricalA1PackRowsV0_1({pack});
    assert.equal(materialized.rowCount,Number(manifest.bar_count),"materialized bar count mismatch: "+manifest.pack_id);
    objectByteHashVerified+=1;
    return materialized.rows;
  }));
  for(const rows of loaded)coldRows.push(...rows);
}
assert.equal(objectByteHashVerified,manifests.length,"not all R2 object bytes were verified");
assert.equal(coldRows.length,Number(receipt.bar_count),"cold materialized row count mismatch");

const officialRange=await fetchOfficialHistoricalA1RangeV0_1({
  market,fromDate,toDate,observedAt,pauseMs:10,includeRowProvenance:true,
});
assert.equal(officialRange.fetchedTradingDateCount,officialRange.tradingDateCount,"official session fetch incomplete");

const coldByKey=new Map();
for(const row of coldRows){
  const key=row.marketDate+"|"+row.symbol;
  assert.equal(coldByKey.has(key),false,"duplicate cold bar key: "+key);
  coldByKey.set(key,row);
}
const officialByKey=new Map();
for(const row of officialRange.rows){
  const key=row.marketDate+"|"+row.symbol;
  assert.equal(officialByKey.has(key),false,"duplicate official source key: "+key);
  officialByKey.set(key,row);
}
const missingFromCold=[];
const absentFromFreshOfficial=[];
const sourceRowHashMismatches=[];
for(const [key,row] of officialByKey){
  const cold=coldByKey.get(key);
  if(!cold){missingFromCold.push(key);continue;}
  if(String(cold.sourceRowHash||"")!==String(row.sourceRowHash||"")){
    sourceRowHashMismatches.push(key);
  }
}
for(const key of coldByKey.keys()){
  if(!officialByKey.has(key))absentFromFreshOfficial.push(key);
}

const upstreamUniverse=await buildD08TwseHistoricalUniverseSourceV0_1({
  datasetStartDate:fromDate,observedAt,
});
const sourceRows=upstreamUniverse.registry.memberships.map((m)=>({
  market:m.market,symbol:m.symbol,companyName:m.companyName,industry:m.industry,
  memberState:m.memberState,listingDate:m.listingDate,delistingDate:m.delistingDate,
  sourceId:m.sourceId,sourceName:m.sourceName,sourceUrl:m.sourceUrl,sourceRowHash:m.sourceRowHash,
}));
const firstTradingDateByMarketSymbol=Object.fromEntries(
  upstreamUniverse.registry.memberships
    .filter((m)=>m.firstTradingDate)
    .map((m)=>[m.market+"|"+m.symbol,m.firstTradingDate]),
);
const registry=await buildHistoricalUniverseRegistryV0_1({
  registryId:`S2-DATA-TWSE-${year}-OFFICIAL-UNION-V0.1`,
  sourceRows,firstTradingDateByMarketSymbol,datasetStartDate:fromDate,observedAt,
});
assert.equal(registry.unknownStartCount,0,"TWSE historical universe contains unknown starts");
assert.equal(registry.replayEligibleCount,registry.membershipCount,"TWSE historical universe replay eligibility incomplete");

const suspension=await fetchTwseSuspensionIntervals();
const coverage=buildHistoricalMarketYearCoverageV0_1({
  market,year,fromDate,toDate,
  tradingDates:officialRange.dateReceipts.map((x)=>x.marketDate),
  registry,rows:coldRows,suspensionIntervals:suspension.intervals,
});

const sourceReconciliation={
  officialTradingDates:officialRange.tradingDateCount,
  freshOfficialRowCount:officialRange.rowCount,
  coldRowCount:coldRows.length,
  missingFromColdCount:missingFromCold.length,
  absentFromFreshOfficialCount:absentFromFreshOfficial.length,
  sourceRowHashMismatchCount:sourceRowHashMismatches.length,
  missingFromColdSample:missingFromCold.slice(0,100),
  absentFromFreshOfficialSample:absentFromFreshOfficial.slice(0,100),
  sourceRowHashMismatchSample:sourceRowHashMismatches.slice(0,100),
  state:missingFromCold.length===0&&absentFromFreshOfficial.length===0&&sourceRowHashMismatches.length===0
    ?"PASS":"BLOCKED",
};

const storageVerification={
  receiptId:receipt.receipt_id,
  batchId,
  completionReceiptState:receipt.state,
  packCount:Number(receipt.pack_count),
  barCount:Number(receipt.bar_count),
  manifestRollingHash:receipt.manifest_rolling_hash,
  checkpointState:checkpoint.state,
  checkpointObjectReadyCount:Number(checkpoint.object_ready_count),
  checkpointManifestCommittedCount:Number(checkpoint.manifest_committed_count),
  headObjectCountVerified:headVerification.objectCountVerified,
  byteGetObjectCountVerified:objectByteHashVerified,
  r2Bucket,
  state:headVerification.state==="VERIFIED"&&objectByteHashVerified===Number(receipt.pack_count)
    ?"PASS":"BLOCKED",
};

const overallState = storageVerification.state==="PASS"
  && sourceReconciliation.state==="PASS"
  && coverage.overallState!=="BLOCKED"
    ? coverage.overallState
    : "BLOCKED";

const output={
  result:overallState==="BLOCKED"?"BLOCKED_MARKET_YEAR_VERIFICATION":"PASS_MARKET_YEAR_VERIFICATION_WITH_READINESS_STATE",
  verifierVersion:"S2_HISTORICAL_MARKET_YEAR_PHYSICAL_VERIFY_V0_1",
  market,year,fromDate,toDate,
  storageVerification,
  sourceReconciliation,
  historicalUniverse:{
    registryId:registry.registryId,
    registryHash:registry.registryHash,
    membershipCount:registry.membershipCount,
    replayEligibleCount:registry.replayEligibleCount,
    currentCount:registry.currentCount,
    delistedCount:registry.delistedCount,
    unknownStartCount:registry.unknownStartCount,
    sourceReceipt:upstreamUniverse.sourceReceipt,
  },
  suspensionEvidence:{
    sourceUrl:suspension.sourceUrl,
    sourceHash:suspension.sourceHash,
    upstreamStatus:suspension.upstreamStatus,
    intervalCount:suspension.intervalCount,
    absenceCertifiesNoSuspension:false,
    sourceHistoryStart:suspension.sourceHistoryStart,
  },
  coverage,
  pitContinuityReadiness:{
    pit:coverage.pitReadiness,
    continuity:coverage.continuityReadiness,
    technicalPrice:coverage.technicalPriceReadiness,
  },
  overallState,
  system1RuntimeChanged:false,
  system2StrategyAuthorityChanged:false,
  finalSelectionAuthorityChanged:false,
  capitalOrderAuthorityChanged:false,
  observedAt,
  schemaVersion:"S2_HISTORICAL_MARKET_YEAR_PHYSICAL_VERIFICATION_V0_1",
};

const json=JSON.stringify(output,null,2);
if(outputPath)await writeFile(outputPath,json+"\n","utf8");
console.log(json);
if(overallState==="BLOCKED")process.exitCode=2;
