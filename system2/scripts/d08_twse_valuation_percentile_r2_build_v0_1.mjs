import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { gzipSync,gunzipSync } from "node:zlib";
import { createRemoteR2S3Adapter } from "../deploy/remote_r2_s3_adapter.mjs";
import { buildD08TwseHistoricalUniverseSourceV0_1 } from "../runtime/d08_twse_historical_universe_source_v0_1.mjs";
import { averageRankPercentile } from "../../research/historical_valuation_replay_core_v0_1.mjs";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId=process.env.SYSTEM2_R2_ACCESS_KEY_ID;
const secretAccessKey=process.env.SYSTEM2_R2_SECRET_ACCESS_KEY;
const bucketName=String(process.env.SYSTEM2_R2_BUCKET||"system2-historical-research").trim();
assert.ok(accountId&&accessKeyId&&secretAccessKey&&bucketName,"R2 credentials/config required");
const store=createRemoteR2S3Adapter({accountId,accessKeyId,secretAccessKey,bucketName});
const shaBytes=b=>createHash("sha256").update(Buffer.from(b)).digest("hex");
const shaText=s=>createHash("sha256").update(s).digest("hex");
const scanReceipt=JSON.parse(fs.readFileSync("research/d08_twse_month_end_scan_date_receipt_20261004_v0_1.json","utf8"));
const rawReceipt=JSON.parse(fs.readFileSync("research/d08_twse_raw_valuation_r2_capture_receipt_20261004_v0_1.json","utf8"));
assert.equal(scanReceipt.monthCount,44);
assert.equal(rawReceipt.receipts.length,44);
const rawRefByDate=new Map(rawReceipt.receipts.map(x=>[x.marketDate,x]));
const scanDates=new Set(scanReceipt.scanDates.map(x=>x.scanDate));

async function readObject(key,expectedSha,{gzip=false}={}){
  const obj=await store.get(key);
  assert.ok(obj,"R2 object missing "+key);
  assert.equal(shaBytes(obj.bytes),expectedSha,"R2 object sha mismatch "+key);
  const text=(gzip?gunzipSync(Buffer.from(obj.bytes)):Buffer.from(obj.bytes)).toString("utf8");
  return JSON.parse(text);
}

const annualManifests=[];
const annualPayloads=[];
for(let year=2017;year<=2026;year++){
  const manifestKey="research/d08/twse-valuation-history-v0.1/manifests/"+year+".json";
  const mObj=await store.get(manifestKey);
  assert.ok(mObj,"annual valuation manifest missing "+year);
  const manifest=JSON.parse(Buffer.from(mObj.bytes).toString("utf8"));
  assert.equal(manifest.schemaVersion,"D08_TWSE_VALUATION_HISTORY_YEAR_MANIFEST_V0_1");
  assert.equal(Number(manifest.year),year);
  const payload=await readObject(manifest.objectKey,manifest.objectSha256,{gzip:true});
  assert.equal(shaText(JSON.stringify(payload)),manifest.payloadHash,"annual payload hash mismatch "+year);
  annualManifests.push({...manifest,manifestKey,manifestObjectSha256:shaBytes(mObj.bytes)});
  annualPayloads.push(payload);
}
const annualManifestBundleHash=shaText(annualManifests.map(m=>[
  m.year,m.payloadHash,m.objectSha256,m.sourceBundleHash,m.manifestObjectSha256
].join("|")).join("\n"));

for(const p of annualPayloads){
  for(const day of p.days){
    if(scanDates.has(day.marketDate)){
      const raw=rawRefByDate.get(day.marketDate);
      assert.ok(raw,"raw scan ref missing "+day.marketDate);
      assert.equal(day.sourcePayloadHash,raw.sourcePayloadHash,
        "SOURCE_REVISION_CONFLICT:"+day.marketDate);
    }
  }
}

const observedAt=new Date().toISOString();
const universe=await buildD08TwseHistoricalUniverseSourceV0_1({observedAt});
const membershipById=new Map(universe.registry.memberships.map(x=>[x.membershipId,x]));

const rawSnapshots=new Map();
for(const ref of rawReceipt.receipts){
  const p=await readObject(ref.objectKey,ref.objectSha256,{gzip:true});
  assert.equal(shaText(JSON.stringify(p)),ref.payloadHash,"raw snapshot payload hash mismatch "+ref.marketDate);
  rawSnapshots.set(ref.marketDate,p);
}

const states=new Map();
function stateFor(symbol){
  if(!states.has(symbol)) states.set(symbol,{
    pe:[],pb:[],observationCount:0,lastFiscal:null,lastFiscalChangeDate:null,lastFiscalChangeObservation:null,
  });
  return states.get(symbol);
}
function calcFixed(values,current,n){
  return averageRankPercentile(values.slice(-n),current,{minValid:n});
}
function calcExpanding(values,current,membership){
  const listingDate=membership?.listingDate||null;
  const startBasis=membership?.startBasis||null;
  const complete=listingDate!==null&&listingDate>="2017-01-01"&&startBasis!=="HISTORY_FIRST_TRADING_DATE";
  if(!complete){
    return {
      state:"UNKNOWN",reason:"LEFT_TRUNCATED_BEFORE_2017",percentile:null,
      validObservationCount:values.length,historyComplete:false,
    };
  }
  const r=averageRankPercentile(values,current,{minValid:252});
  return {...r,historyComplete:true};
}
function metricPack(values,current,membership){
  return {
    validHistoryCount:values.length,
    p252:calcFixed(values,current,252),
    p756:calcFixed(values,current,756),
    p1260:calcFixed(values,current,1260),
    expanding:calcExpanding(values,current,membership),
  };
}

const outputRefs=[];
const coverageRows=[];
const allDays=annualPayloads.flatMap(p=>p.days).sort((a,b)=>a.marketDate.localeCompare(b.marketDate));
for(const day of allDays){
  for(const r of day.rows){
    const st=stateFor(r.symbol);
    st.observationCount++;
    if(r.fiscalReportPeriod){
      if(st.lastFiscal!==null&&st.lastFiscal!==r.fiscalReportPeriod){
        st.lastFiscalChangeDate=day.marketDate;
        st.lastFiscalChangeObservation=st.observationCount;
      }
      st.lastFiscal=r.fiscalReportPeriod;
    }
    if(Number.isFinite(r.pe)) st.pe.push(r.pe);
    if(Number.isFinite(r.pb)) st.pb.push(r.pb);
  }
  if(!scanDates.has(day.marketDate)) continue;

  const raw=rawSnapshots.get(day.marketDate);
  assert.ok(raw,"raw valuation snapshot missing "+day.marketDate);
  const rows=raw.rows.map(r=>{
    const st=stateFor(r.symbol);
    const membership=membershipById.get(r.membershipId)||null;
    const pe=metricPack(st.pe,r.pe,membership);
    const pb=metricPack(st.pb,r.pb,membership);
    return {
      ...r,
      valuationObservationCountSince2017:st.observationCount,
      listingDate:membership?.listingDate||null,
      listingStartBasis:membership?.startBasis||null,
      fiscalDenominatorChangedToday:st.lastFiscalChangeDate===day.marketDate,
      sessionsSinceFiscalDenominatorChange:st.lastFiscalChangeObservation===null?null:
        st.observationCount-st.lastFiscalChangeObservation,
      peHistory:pe,
      pbHistory:pb,
    };
  });

  const countKnown=(metric,window)=>rows.filter(r=>r[metric+"History"][window].state==="KNOWN").length;
  const coverage={
    baseUniverseCount:rows.length,
    rawValuationObservedCount:rows.filter(r=>r.valuationObserved).length,
    peKnownCurrentCount:rows.filter(r=>Number.isFinite(r.pe)).length,
    pbKnownCurrentCount:rows.filter(r=>Number.isFinite(r.pb)).length,
    pe252KnownCount:countKnown("pe","p252"),
    pe756KnownCount:countKnown("pe","p756"),
    pe1260KnownCount:countKnown("pe","p1260"),
    peExpandingKnownCount:countKnown("pe","expanding"),
    pb252KnownCount:countKnown("pb","p252"),
    pb756KnownCount:countKnown("pb","p756"),
    pb1260KnownCount:countKnown("pb","p1260"),
    pbExpandingKnownCount:countKnown("pb","expanding"),
    fiscalDenominatorChangedTodayCount:rows.filter(r=>r.fiscalDenominatorChangedToday).length,
    sourceRowMissingCount:rows.filter(r=>!r.valuationObserved).length,
  };
  const payload={
    schemaVersion:"D08_TWSE_VALUATION_PERCENTILE_SNAPSHOT_V0_1",
    researchOnly:true,outcomeJoin:false,marketDate:day.marketDate,capturedAt:observedAt,
    rawSnapshot:{payloadHash:rawRefByDate.get(day.marketDate).payloadHash,objectSha256:rawRefByDate.get(day.marketDate).objectSha256},
    history:{fromYear:2017,throughDate:day.marketDate,annualManifestBundleHash},
    coverage,rows,
  };
  const json=JSON.stringify(payload);
  const payloadHash=shaText(json);
  const gz=gzipSync(Buffer.from(json,"utf8"),{level:9});
  const objectSha256=shaBytes(gz);
  const objectKey="research/d08/twse-valuation-percentile-v0.1/"+day.marketDate+"/"+payloadHash+".json.gz";
  const prior=await store.head(objectKey);
  if(!prior){
    const inserted=await store.putIfAbsent(objectKey,gz,{
      contentType:"application/gzip",storageClass:"Standard",
      customMetadata:{
        "payload-hash":payloadHash,"object-sha256":objectSha256,
        "schema-version":"d08-twse-valuation-percentile-v0-1","market-date":day.marketDate,
      },
    });
    assert.ok(inserted,"percentile snapshot insert failed "+day.marketDate);
  }
  const readback=await readObject(objectKey,objectSha256,{gzip:true});
  assert.equal(shaText(JSON.stringify(readback)),payloadHash,"percentile payload readback mismatch "+day.marketDate);
  outputRefs.push({
    marketDate:day.marketDate,payloadHash,objectSha256,objectKey,gzipBytes:gz.byteLength,readbackVerified:true,
  });
  coverageRows.push({marketDate:day.marketDate,...coverage});
}
assert.equal(outputRefs.length,44);
const windows=["pe252KnownCount","pe756KnownCount","pe1260KnownCount","peExpandingKnownCount",
               "pb252KnownCount","pb756KnownCount","pb1260KnownCount","pbExpandingKnownCount"];
const totals=Object.fromEntries(windows.map(k=>[k,coverageRows.reduce((s,x)=>s+x[k],0)]));
const minMax=Object.fromEntries(windows.map(k=>[k,{
  min:Math.min(...coverageRows.map(x=>x[k])),
  max:Math.max(...coverageRows.map(x=>x[k])),
}]));
const objectBundleHash=shaText(outputRefs.map(x=>[
  x.marketDate,x.payloadHash,x.objectSha256,x.objectKey
].join("|")).join("\n"));

console.log("D08_PERCENTILE_R2_RECEIPT="+JSON.stringify({
  schemaVersion:"D08_TWSE_VALUATION_PERCENTILE_R2_RECEIPT_V0_1",
  result:"PASS",researchOnly:true,outcomeJoin:false,capturedAt:observedAt,bucketName,
  historyYears:[2017,2018,2019,2020,2021,2022,2023,2024,2025,2026],
  annualManifestBundleHash,
  rawSnapshotBundleHash:rawReceipt.summary.objectBundleHash,
  scanDateListHash:scanReceipt.scanDateListHash,
  totalScanDates:outputRefs.length,
  totals,minMax,coverageRows,outputRefs,objectBundleHash,
  guards:{
    sourceRevisionParityRequired:true,
    expandingLeftTruncationExplicit:true,
    insufficientHistoryIsUnknown:true,
    peMissingRemainsUnknown:true,
    noReturns:true,noD1Writes:true,noSystem1Runtime:true,noFormalCoreImpact:true,
  }
}));
