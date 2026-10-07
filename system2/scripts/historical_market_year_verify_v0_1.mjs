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
import {
  buildHistoricalMarketYearCoverageV0_1,
  buildObservedIntervalUniverseRegistryV0_1,
  parseTpexCmodePositiveStopSessionsV0_1,
  tpexCmodeRocDateV0_1,
} from "../runtime/historical_market_year_coverage_v0_1.mjs";
import { fetchCurrentListingMetadataV0_1 } from "../runtime/current_listing_metadata_v0_1.mjs";
import { fetchTwseRegulatoryLifecycleForSymbolsV0_1 } from "../runtime/twse_regulatory_lifecycle_source_v0_1.mjs";
import { reconcileHistoricalSourceRowsV0_1 } from "../runtime/historical_source_reconciliation_v0_1.mjs";
import { evaluateHistoricalRevisionLineageV0_1 } from "../runtime/historical_revision_lineage_v0_1.mjs";

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
assert.ok(["TWSE","TPEX"].includes(market),"SYSTEM2_HISTORY_YEAR_MARKET must be TWSE or TPEX");
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

async function fetchTpexSuspensionIntervals(){
  const url="https://www.tpex.org.tw/www/zh-tw/bulletin/sprcHis";
  const body=new URLSearchParams({date:String(year),cate:"1",response:"json"});
  let response;
  let rawText="";
  try{
    response=await fetch(url,{
      method:"POST",
      redirect:"follow",
      headers:{
        accept:"application/json,text/plain,*/*",
        "content-type":"application/x-www-form-urlencoded; charset=UTF-8",
        referer:"https://www.tpex.org.tw/zh-tw/announce/market/halt/historical.html",
        "user-agent":"System2-DATA-LANE-market-year-verify/0.3",
      },
      body,
      signal:AbortSignal.timeout(60000),
    });
    rawText=await response.text();
  }catch(error){
    return {
      state:"SOURCE_TRANSPORT_UNAVAILABLE_PARTIAL",
      sourceUrl:url,
      sourceHash:null,
      upstreamStatus:null,
      fields:[],
      intervalCount:0,
      intervals:[],
      absenceCertifiesNoSuspension:false,
      sourceHistoryStart:null,
      limitation:"TPEx halt/resumption transport failed for requested historical year; no absence inference permitted: "+String(error?.message||error),
    };
  }
  const sourceHash=sha256Text(rawText);
  if(!response.ok){
    return {
      state:"SOURCE_HTTP_UNAVAILABLE_PARTIAL",
      sourceUrl:url,
      sourceHash,
      upstreamStatus:"HTTP_"+response.status,
      fields:[],
      intervalCount:0,
      intervals:[],
      absenceCertifiesNoSuspension:false,
      sourceHistoryStart:null,
      limitation:"TPEx halt/resumption historical request returned HTTP "+response.status+"; no absence inference permitted.",
    };
  }

  let payload;
  try{
    payload=JSON.parse(rawText);
  }catch(error){
    return {
      state:"SOURCE_PARSE_UNAVAILABLE_PARTIAL",
      sourceUrl:url,
      sourceHash,
      upstreamStatus:null,
      fields:[],
      intervalCount:0,
      intervals:[],
      absenceCertifiesNoSuspension:false,
      sourceHistoryStart:null,
      limitation:"TPEx halt/resumption historical response was not valid JSON; no absence inference permitted.",
    };
  }

  const tables=Array.isArray(payload?.tables)?payload.tables:[];
  const table=tables[0]||{};
  const fields=Array.isArray(table.fields)?table.fields.map(normalizedField):[];
  const data=Array.isArray(table.data)?table.data:[];
  const totalCount=Number(table.totalCount??data.length);
  const stat=String(payload?.stat??"").trim();

  if(stat.toLowerCase()!=="ok" || (fields.length===0 && data.length>0)){
    return {
      state:"SOURCE_SCHEMA_UNAVAILABLE_PARTIAL",
      sourceUrl:url,
      sourceHash,
      upstreamStatus:stat||null,
      fields,
      intervalCount:0,
      intervals:[],
      absenceCertifiesNoSuspension:false,
      sourceHistoryStart:null,
      limitation:"TPEx halt/resumption historical schema/stat not accepted for requested year; no absence inference permitted.",
    };
  }
  assert.equal(totalCount,data.length,"TPEx sprcHis totalCount must match returned rows");

  if(data.length===0){
    return {
      state:"SOURCE_LOCAL_EMPTY_UNCERTIFIED_HISTORY",
      sourceUrl:url,
      sourceHash,
      upstreamStatus:stat,
      fields,
      intervalCount:0,
      intervals:[],
      absenceCertifiesNoSuspension:false,
      sourceHistoryStart:null,
      limitation:"Source-local empty is preserved, but 2017 all-history completeness is not certified by the bounded 2026 machine contract.",
    };
  }

  const symbolIndex=fields.findIndex((x)=>x.includes("有價證券代號")||x.includes("證券代號")||x==="代號");
  const suspendedIndex=fields.findIndex((x)=>x.includes("暫停交易日期"));
  const resumedIndex=fields.findIndex((x)=>x.includes("恢復交易日期"));
  if(symbolIndex<0 || suspendedIndex<0){
    return {
      state:"SOURCE_FIELD_CONTRACT_UNAVAILABLE_PARTIAL",
      sourceUrl:url,
      sourceHash,
      upstreamStatus:stat,
      fields,
      intervalCount:0,
      intervals:[],
      absenceCertifiesNoSuspension:false,
      sourceHistoryStart:null,
      limitation:"TPEx halt/resumption historical fields did not match certified names; no absence inference permitted.",
    };
  }

  const intervals=[];
  for(const row of data){
    if(!Array.isArray(row))continue;
    const symbol=String(row[symbolIndex]??"").trim();
    if(!/^[1-9][0-9]{3}$/.test(symbol))continue;
    const suspendedFrom=dateFromAny(row[suspendedIndex]);
    const resumedOn=resumedIndex>=0?dateFromAny(row[resumedIndex]):null;
    if(!suspendedFrom)continue;
    intervals.push({
      market:"TPEX",
      symbol,
      suspendedFrom,
      resumedOn,
      coverageTo:toDate,
      sourceRowHash:sha256Text(JSON.stringify({fields,row})),
    });
  }
  return {
    state:"OBSERVED_POSITIVE_INTERVALS_UNCERTIFIED_HISTORY",
    sourceUrl:url,
    sourceHash,
    upstreamStatus:stat,
    fields,
    intervalCount:intervals.length,
    intervals,
    absenceCertifiesNoSuspension:false,
    sourceHistoryStart:null,
    boundedMachineContract:"D03_TPEX_HALT_RESUMPTION_MACHINE_CONTRACT_V0_2",
    allHistoryCompletenessCertified:false,
    limitation:`Positive rows may classify matching gaps; absence outside observed rows does not certify no suspension for ${year}.`,
  };
}

async function fetchTpexCmodePositiveStopSessionsV0_1(marketDates=[]){
  const endpoint="https://www.tpex.org.tw/web/stock/aftertrading/cmode/chtm_result.php";
  const dates=[...new Set(marketDates)].sort();
  const intervals=[];
  const receipts=[];
  let successfulDateCount=0;
  let partialDateCount=0;
  let positiveStopSessionCount=0;

  async function fetchOne(marketDate){
    const rocDate=tpexCmodeRocDateV0_1(marketDate);
    const url=new URL(endpoint);
    url.searchParams.set("l","zh-tw");
    url.searchParams.set("o","json");
    url.searchParams.set("d",rocDate);
    let lastError=null;
    for(let attempt=1;attempt<=2;attempt+=1){
      try{
        const response=await fetch(url,{
          redirect:"follow",
          headers:{
            accept:"application/json,text/plain,*/*",
            referer:"https://www.tpex.org.tw/zh-tw/mainboard/trading/info/altered.html",
            "user-agent":"System2-DATA-LANE-tpex-cmode-history/0.1",
          },
          signal:AbortSignal.timeout(15000),
        });
        const rawText=await response.text();
        const sourceHash=sha256Text(rawText);
        if(!response.ok){
          lastError=new Error("HTTP_"+response.status);
          if(attempt<2)continue;
          return {marketDate,state:"HTTP_PARTIAL",httpStatus:response.status,url:url.toString(),sourceHash,intervals:[]};
        }
        let payload;
        try{payload=JSON.parse(rawText);}
        catch(error){
          lastError=error;
          if(attempt<2)continue;
          return {marketDate,state:"PARSE_PARTIAL",httpStatus:response.status,url:url.toString(),sourceHash,intervals:[]};
        }
        const parsed=parseTpexCmodePositiveStopSessionsV0_1({
          marketDate,payload,sourceUrl:url.toString(),sourceHash,coverageTo:toDate,
        });
        return {
          marketDate,state:parsed.state,httpStatus:response.status,url:url.toString(),sourceHash,
          reportDate:parsed.reportDate||null,rowCount:parsed.rowCount||0,
          acceptedRowCount:parsed.acceptedRowCount||0,
          positiveStopCount:parsed.positiveStopCount||0,
          absenceCertifiesNoStop:false,
          intervals:parsed.intervals,
        };
      }catch(error){
        lastError=error;
        if(attempt<2)await new Promise((resolve)=>setTimeout(resolve,750));
      }
    }
    return {
      marketDate,state:"TRANSPORT_PARTIAL",httpStatus:null,url:null,sourceHash:null,
      message:String(lastError?.message||lastError||"unknown").slice(0,300),
      absenceCertifiesNoStop:false,intervals:[],
    };
  }

  for(let i=0;i<dates.length;i+=8){
    const batch=dates.slice(i,i+8);
    const results=await Promise.all(batch.map(fetchOne));
    for(const result of results){
      receipts.push({...result,intervals:undefined});
      if(result.state==="POSITIVE_SESSION_SOURCE_OBSERVED"){
        successfulDateCount+=1;
        positiveStopSessionCount+=Number(result.positiveStopCount||0);
        intervals.push(...result.intervals);
      }else{
        partialDateCount+=1;
      }
    }
  }

  return {
    state:partialDateCount>0
      ? "PARTIAL_POSITIVE_SESSION_EVIDENCE"
      : "OBSERVED_POSITIVE_SESSION_EVIDENCE_UNCERTIFIED_ABSENCE",
    endpoint,
    queriedDateCount:dates.length,
    successfulDateCount,
    partialDateCount,
    positiveStopSessionCount,
    intervalCount:intervals.length,
    intervals,
    receiptSample:receipts.slice(0,100),
    absenceCertifiesNoStop:false,
    historicalDateParameter:"d=ROC_YYY/MM/DD",
    machineContract:"TPEX_CMODE_HISTORICAL_DATE_SCOPED_V0_1",
    sourceDiscoveryProvenance:[
      "TPEx official cmode dataset / historical machine response",
      "date-scoped endpoint uses l=zh-tw&o=json&d=<ROC date>",
    ],
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

const sourceReconciliationBase=reconcileHistoricalSourceRowsV0_1({
  coldRows,
  freshOfficialRows:officialRange.rows,
  sampleLimit:100,
});

let revisionLineage=null;
if(sourceReconciliationBase.canonicalRevisionLineageRequired){
  const persistedRevisionRows=await db.rawQuery(
    `SELECT * FROM s2_historical_a1_bars
      WHERE market=? AND market_date>=? AND market_date<=? AND price_space='RAW'
      ORDER BY canonical_key, available_at, observed_at, bar_hash`,
    [market,fromDate,toDate],
  );
  revisionLineage=evaluateHistoricalRevisionLineageV0_1({
    coldRows,
    freshOfficialRows:officialRange.rows,
    persistedRows:persistedRevisionRows,
    sampleLimit:100,
  });
}

const effectiveDataIntegrityState =
  sourceReconciliationBase.dataIntegrityState==="PASS"
    ? "PASS"
    : (
        sourceReconciliationBase.missingFromColdCount===0
        && sourceReconciliationBase.absentFromFreshOfficialCount===0
        && sourceReconciliationBase.canonicalA1ValueMismatchCount>0
        && revisionLineage?.state==="PIT_REVISION_LINEAGE_READY"
      )
      ? "PASS_WITH_PIT_REVISION_LINEAGE"
      : "BLOCKED";

let registry;
let historicalUniverseEvidence;
let suspension;

if(market==="TWSE"){
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
  registry=await buildHistoricalUniverseRegistryV0_1({
    registryId:`S2-DATA-TWSE-${year}-OFFICIAL-UNION-V0.1`,
    sourceRows,firstTradingDateByMarketSymbol,datasetStartDate:fromDate,observedAt,
  });
  assert.equal(registry.unknownStartCount,0,"TWSE historical universe contains unknown starts");
  assert.equal(registry.replayEligibleCount,registry.membershipCount,"TWSE historical universe replay eligibility incomplete");
  historicalUniverseEvidence={
    readiness:"PASS_OFFICIAL_CURRENT_NEWLISTING_DELISTING_UNION",
    registryId:registry.registryId,
    registryHash:registry.registryHash,
    membershipCount:registry.membershipCount,
    replayEligibleCount:registry.replayEligibleCount,
    currentCount:registry.currentCount,
    delistedCount:registry.delistedCount,
    unknownStartCount:registry.unknownStartCount,
    sourceReceipt:upstreamUniverse.sourceReceipt,
    survivorshipCompleteForDataCoverage:true,
  };
  suspension=await fetchTwseSuspensionIntervals();
}else{
  const currentListing=await fetchCurrentListingMetadataV0_1({
    observedAt,
    markets:["TPEX"],
    minimumByMarket:{TPEX:400},
  });
  assert.equal(currentListing.state,"READY","current listing metadata must be READY");
  registry=buildObservedIntervalUniverseRegistryV0_1({
    market,
    rows:coldRows,
    currentListingByMarketSymbol:currentListing.byMarketSymbol,
    fromDate,
    toDate,
  });
  historicalUniverseEvidence={
    readiness:"PARTIAL_OBSERVED_INTERVAL_NO_OFFICIAL_DELISTING_UNION",
    registryId:`S2-DATA-TPEX-${year}-OBSERVED-INTERVAL-V0.1`,
    registryHash:sha256Text(JSON.stringify(registry.memberships)),
    membershipCount:registry.membershipCount,
    replayEligibleCount:registry.membershipCount,
    currentCount:registry.officialCurrentCount,
    delistedCount:null,
    unknownStartCount:null,
    observedHistoricalOnlyCount:registry.observedHistoricalOnlyCount,
    currentWithoutObservedRowsCount:registry.currentWithoutObservedRowsCount,
    sourceReceipt:{
      currentListingMetadataHash:currentListing.metadataHash,
      currentListingCount:currentListing.counts.TPEX,
      currentListingSourceId:"MOPS_T187AP03_O_CURRENT_LISTED_COMPANY",
      observedIntervalUniverseState:registry.state,
      officialDelistingUnionComplete:false,
    },
    survivorshipCompleteForDataCoverage:false,
  };
  suspension=await fetchTpexSuspensionIntervals();
}

const tradingDates=officialRange.dateReceipts.map((x)=>x.marketDate);
const coverageBeforeLifecycle=buildHistoricalMarketYearCoverageV0_1({
  market,year,fromDate,toDate,
  tradingDates,
  registry,rows:coldRows,suspensionIntervals:suspension.intervals,
});

let lifecycleEvidence={
  state:"NOT_APPLICABLE_FOR_MARKET",
  queriedSymbolCount:0,
  candidateAnnouncementCount:0,
  detailFetchCount:0,
  eventCount:0,
  intervalCount:0,
  reclassifiedUnknownBars:0,
  beforeUnknownBars:coverageBeforeLifecycle.unknownBars,
  afterUnknownBars:coverageBeforeLifecycle.unknownBars,
  beforeMissingReasonCounts:coverageBeforeLifecycle.missingReasonCounts,
  afterMissingReasonCounts:coverageBeforeLifecycle.missingReasonCounts,
  absenceCertifiesNoEvent:false,
  knownAtState:"NOT_APPLICABLE",
  source:"NONE",
};

let lifecycleIntervals=[];
let tpexCmodeEvidence={
  state:"NOT_APPLICABLE_FOR_MARKET",
  queriedDateCount:0,
  successfulDateCount:0,
  partialDateCount:0,
  positiveStopSessionCount:0,
  intervalCount:0,
  reclassifiedUnknownBars:0,
  beforeUnknownBars:coverageBeforeLifecycle.unknownBars,
  afterUnknownBars:coverageBeforeLifecycle.unknownBars,
  beforeMissingReasonCounts:coverageBeforeLifecycle.missingReasonCounts,
  afterMissingReasonCounts:coverageBeforeLifecycle.missingReasonCounts,
  absenceCertifiesNoStop:false,
  source:"NONE",
};
let tpexCmodeIntervals=[];

if(market==="TWSE" && coverageBeforeLifecycle.unknownBars>0){
  const unknownSymbols=coverageBeforeLifecycle.missingBySymbol
    .filter((x)=>Number(x.unknownCount)>0)
    .map((x)=>x.symbol);
  const lifecycle=await fetchTwseRegulatoryLifecycleForSymbolsV0_1({
    symbols:unknownSymbols,
    fromDate,
    toDate,
    observedAt,
    fetchImpl:fetch,
  });
  lifecycleIntervals=lifecycle.intervals;
  const after=buildHistoricalMarketYearCoverageV0_1({
    market,year,fromDate,toDate,
    tradingDates,
    registry,rows:coldRows,
    suspensionIntervals:[...suspension.intervals,...lifecycleIntervals],
  });
  lifecycleEvidence={
    state:lifecycle.state,
    queriedSymbolCount:lifecycle.queriedSymbolCount,
    candidateAnnouncementCount:lifecycle.candidateAnnouncementCount,
    detailFetchCount:lifecycle.detailFetchCount,
    eventCount:lifecycle.eventCount,
    intervalCount:lifecycle.intervalCount,
    partialSymbolCount:lifecycle.partialSymbolCount,
    conflictCount:lifecycle.conflicts.length,
    reclassifiedUnknownBars:coverageBeforeLifecycle.unknownBars-after.unknownBars,
    beforeUnknownBars:coverageBeforeLifecycle.unknownBars,
    afterUnknownBars:after.unknownBars,
    beforeMissingReasonCounts:coverageBeforeLifecycle.missingReasonCounts,
    afterMissingReasonCounts:after.missingReasonCounts,
    intervalSample:lifecycle.intervals.slice(0,50),
    eventSample:lifecycle.events.slice(0,50),
    symbolReceiptSample:lifecycle.symbolReceipts.slice(0,50),
    absenceCertifiesNoEvent:false,
    knownAtState:lifecycle.knownAtState,
    source:"TWSE_OFFICIAL_ANNOUNCEMENT_LIST_DETAIL",
    schemaVersion:lifecycle.schemaVersion,
  };
}

if(market==="TPEX" && coverageBeforeLifecycle.unknownBars>0){
  const cmode=await fetchTpexCmodePositiveStopSessionsV0_1(
    coverageBeforeLifecycle.unknownSessionDates || [],
  );
  tpexCmodeIntervals=cmode.intervals;
  const after=buildHistoricalMarketYearCoverageV0_1({
    market,year,fromDate,toDate,
    tradingDates,
    registry,rows:coldRows,
    suspensionIntervals:[...suspension.intervals,...tpexCmodeIntervals],
  });
  tpexCmodeEvidence={
    state:cmode.state,
    queriedDateCount:cmode.queriedDateCount,
    successfulDateCount:cmode.successfulDateCount,
    partialDateCount:cmode.partialDateCount,
    positiveStopSessionCount:cmode.positiveStopSessionCount,
    intervalCount:cmode.intervalCount,
    reclassifiedUnknownBars:coverageBeforeLifecycle.unknownBars-after.unknownBars,
    beforeUnknownBars:coverageBeforeLifecycle.unknownBars,
    afterUnknownBars:after.unknownBars,
    beforeMissingReasonCounts:coverageBeforeLifecycle.missingReasonCounts,
    afterMissingReasonCounts:after.missingReasonCounts,
    receiptSample:cmode.receiptSample,
    intervalSample:cmode.intervals.slice(0,100),
    absenceCertifiesNoStop:false,
    source:"TPEX_CMODE_HISTORICAL_DATE_SCOPED",
    endpoint:cmode.endpoint,
    historicalDateParameter:cmode.historicalDateParameter,
    machineContract:cmode.machineContract,
    sourceDiscoveryProvenance:cmode.sourceDiscoveryProvenance,
  };
}

const combinedLifecycleIntervals=[...lifecycleIntervals,...tpexCmodeIntervals];
const coverage=combinedLifecycleIntervals.length
  ? buildHistoricalMarketYearCoverageV0_1({
      market,year,fromDate,toDate,
      tradingDates,
      registry,rows:coldRows,
      suspensionIntervals:[...suspension.intervals,...combinedLifecycleIntervals],
    })
  : coverageBeforeLifecycle;

const sourceReconciliation={
  ...sourceReconciliationBase,
  effectiveDataIntegrityState,
  revisionLineage,
  officialTradingDates:officialRange.tradingDateCount,
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

const dataCoverageState = storageVerification.state==="PASS"
  && sourceReconciliation.effectiveDataIntegrityState!=="BLOCKED"
  && coverage.structuralCoverageState==="PASS"
    ? "PASS"
    : "BLOCKED";
const universeReplayPartial = historicalUniverseEvidence.readiness.startsWith("PARTIAL");
const sourceRevisionReplayPartial = sourceReconciliation.sourceVersionState!=="STABLE";
const replayReadinessState = dataCoverageState==="BLOCKED"
  ? "BLOCKED"
  : (universeReplayPartial || coverage.overallState==="PARTIAL" ? "PARTIAL" : coverage.overallState);
const overallState = dataCoverageState==="BLOCKED"
  ? "BLOCKED"
  : replayReadinessState;

const output={
  result:dataCoverageState==="BLOCKED"
    ?"BLOCKED_MARKET_YEAR_VERIFICATION"
    :(replayReadinessState==="PASS"
      ?"PASS_MARKET_YEAR_DATA_AND_REPLAY_READINESS"
      :"PASS_MARKET_YEAR_DATA_PARTIAL_REPLAY_READINESS"),
  verifierVersion:"S2_HISTORICAL_MARKET_YEAR_PHYSICAL_VERIFY_V0_7",
  market,year,fromDate,toDate,
  storageVerification,
  sourceReconciliation,
  historicalUniverse:historicalUniverseEvidence,
  suspensionEvidence:{
    state:suspension.state || "OBSERVED",
    sourceUrl:suspension.sourceUrl,
    sourceHash:suspension.sourceHash,
    upstreamStatus:suspension.upstreamStatus,
    fields:suspension.fields,
    intervalCount:suspension.intervalCount,
    intervalSample:suspension.intervals.slice(0,50),
    absenceCertifiesNoSuspension:false,
    sourceHistoryStart:suspension.sourceHistoryStart,
    limitation:suspension.limitation || null,
  },
  lifecycleEvidence,
  tpexCmodeEvidence,
  coverage,
  dataCoverageState,
  replayReadinessState,
  pitContinuityReadiness:{
    universe:historicalUniverseEvidence.readiness,
    sourceVersion:sourceReconciliation.sourceVersionState,
    symbolSession:coverage.symbolSessionReadiness,
    pit:coverage.pitReadiness,
    continuity:coverage.continuityReadiness,
    technicalPrice:coverage.technicalPriceReadiness,
  },
  overallState,
  system1RuntimeChanged:false,
  system2StrategyAuthorityChanged:false,
  finalSelectionAuthorityChanged:false,
  capitalOrderAuthorityChanged:false,
  d1UsageObservedThisRun:db.metrics,
  observedAt,
  schemaVersion:"S2_HISTORICAL_MARKET_YEAR_PHYSICAL_VERIFICATION_V0_7",
};

const json=JSON.stringify(output,null,2);
if(outputPath)await writeFile(outputPath,json+"\n","utf8");
console.log(json);
if(dataCoverageState==="BLOCKED")process.exitCode=2;
