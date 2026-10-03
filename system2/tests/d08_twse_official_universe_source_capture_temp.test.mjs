import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { parseCsvRowsV0_1, parseListingDateV0_1 } from "../runtime/current_listing_metadata_v0_1.mjs";
import { buildHistoricalUniverseRegistryV0_1, buildHistoricalUniverseSnapshotV0_1 } from "../runtime/historical_universe_registry_v0_1.mjs";
import fs from "node:fs";

const sha=s=>createHash("sha256").update(typeof s==="string"?s:JSON.stringify(s)).digest("hex");
const ordinary=s=>/^[1-9][0-9]{3}$/.test(String(s??"").trim());
function parseDate(raw){
  let s=String(raw??"").trim();
  if(!s) return null;
  s=s.replace(/[年月]/g,"/").replace(/日/g,"").replaceAll(".","/");
  return parseListingDateV0_1(s);
}
async function fetchJson(url){
  const r=await fetch(url,{headers:{accept:"application/json","user-agent":"D08-universe-source-only/0.1"}});
  const text=await r.text();
  assert.ok(r.ok,"HTTP "+r.status+" "+url);
  const json=JSON.parse(text);
  return {url,text,json,hash:sha(text)};
}
function tableObjects(payload){
  assert.equal(payload.stat,"OK","TWSE table stat must be OK");
  assert.ok(Array.isArray(payload.fields)&&Array.isArray(payload.data),"TWSE table envelope invalid");
  return payload.data.map(row=>Object.fromEntries(payload.fields.map((h,i)=>[h,row[i]])));
}

const observedAt=new Date().toISOString();

async function fetchTextRetry(url,{attempts=3,timeoutMs=60_000}={}){
  let last=null;
  for(let i=1;i<=attempts;i++){
    try{
      const r=await fetch(url,{
        headers:{accept:"text/csv,text/plain,*/*","user-agent":"D08-universe-source-only/0.1"},
        signal:AbortSignal.timeout(timeoutMs),
      });
      const text=await r.text();
      if(!r.ok) throw new Error("HTTP "+r.status);
      return {url,text,hash:sha(text),attempt:i};
    }catch(e){
      last=e;
      if(i<attempts) await new Promise(r=>setTimeout(r,500*i));
    }
  }
  throw last;
}

async function fetchCurrentTwse(){
  let primaryError=null;
  try{
    const raw=await fetchJson("https://openapi.twse.com.tw/v1/opendata/t187ap03_L");
    assert.ok(Array.isArray(raw.json),"TWSE OpenAPI current company data must be array");
    assert.ok(raw.json.length>500,"TWSE OpenAPI current company data too short");
    const required=["公司代號","公司名稱","上市日期"];
    for(const h of required){
      assert.ok(Object.prototype.hasOwnProperty.call(raw.json[0],h),
        "TWSE OpenAPI missing "+h+"; keys="+Object.keys(raw.json[0]).join("|"));
    }
    const currentRows=raw.json.map(row=>({
      market:"TWSE",
      symbol:String(row["公司代號"]??"").trim(),
      companyName:String(row["公司名稱"]??"").trim()||null,
      industry:String(row["產業別"]??"").trim()||null,
      listingDate:parseDate(row["上市日期"]),
    })).filter(x=>ordinary(x.symbol)&&x.listingDate);
    return {rows:currentRows,source:"TWSE_OPENAPI_T187AP03_L",sourceUrl:raw.url,sourceHash:raw.hash};
  }catch(e){ primaryError=e; }

  const raw=await fetchTextRetry("https://mopsfin.twse.com.tw/opendata/t187ap03_L.csv",{attempts:1,timeoutMs:45_000});
  const rows=parseCsvRowsV0_1(raw.text.replace(/^\\uFEFF/,""));
  assert.ok(rows.length>1,"TWSE company-basic CSV empty");
  const headers=rows[0].map(x=>String(x).trim());
  const idx=Object.fromEntries(headers.map((h,i)=>[h,i]));
  for(const h of ["公司代號","公司名稱","上市日期"]) assert.ok(Number.isInteger(idx[h]),"missing "+h);
  const currentRows=rows.slice(1).map(row=>({
    market:"TWSE",
    symbol:String(row[idx["公司代號"]]??"").trim(),
    companyName:String(row[idx["公司名稱"]]??"").trim()||null,
    industry:Number.isInteger(idx["產業別"])?String(row[idx["產業別"]]??"").trim()||null:null,
    listingDate:parseDate(row[idx["上市日期"]]),
  })).filter(x=>ordinary(x.symbol)&&x.listingDate);
  return {rows:currentRows,source:"MOPS_T187AP03_L_CSV",sourceUrl:raw.url,sourceHash:raw.hash,fallbackReason:String(primaryError)};
}
const current=await fetchCurrentTwse();
const currentTwse=current.rows;
assert.ok(currentTwse.length>500);

const newlistingRaw=await fetchJson("https://www.twse.com.tw/rwd/zh/company/newlisting?response=json");
const delistedRaw=await fetchJson("https://www.twse.com.tw/rwd/zh/company/suspendListing?response=json");
const newRows=tableObjects(newlistingRaw.json)
  .map(x=>({
    symbol:String(x["公司代號"]??"").trim(),
    companyName:String(x["公司簡稱"]??"").trim()||null,
    listingDate:parseDate(x["股票上市買賣日期"]),
    raw:x,
  }))
  .filter(x=>ordinary(x.symbol)&&x.listingDate);
const delRows=tableObjects(delistedRaw.json)
  .map(x=>({
    symbol:String(x["上市編號"]??x["公司代號"]??"").trim(),
    companyName:String(x["公司名稱"]??x["公司簡稱"]??"").trim()||null,
    delistingDate:parseDate(x["終止上市日期"]),
    raw:x,
  }))
  .filter(x=>ordinary(x.symbol)&&x.delistingDate&&x.delistingDate>="2023-01-01");

assert.ok(newRows.length>100,"newlisting history unexpectedly short");
assert.ok(delRows.length>0,"no 2023+ delisted ordinary rows");

const listingsBySymbol=new Map();
for(const row of newRows){
  if(!listingsBySymbol.has(row.symbol)) listingsBySymbol.set(row.symbol,[]);
  listingsBySymbol.get(row.symbol).push(row);
}
for(const arr of listingsBySymbol.values()) arr.sort((a,b)=>a.listingDate.localeCompare(b.listingDate));

const unmatched=[];
const delistedSourceRows=[];
for(const d of delRows){
  const candidates=(listingsBySymbol.get(d.symbol)||[]).filter(x=>x.listingDate<=d.delistingDate);
  const chosen=candidates.at(-1)||null;
  if(!chosen){
    unmatched.push({symbol:d.symbol,companyName:d.companyName,delistingDate:d.delistingDate});
    continue;
  }
  delistedSourceRows.push({
    market:"TWSE",
    symbol:d.symbol,
    companyName:d.companyName||chosen.companyName,
    memberState:"DELISTED",
    listingDate:chosen.listingDate,
    delistingDate:d.delistingDate,
    industry:null,
    sourceId:"TWSE_NEWLISTING_PLUS_DELISTING",
    sourceName:"TWSE newlisting + suspendListing",
    sourceUrl:"https://www.twse.com.tw/rwd/zh/company/newlisting?response=json | https://www.twse.com.tw/rwd/zh/company/suspendListing?response=json",
    sourceRowHash:sha({newlisting:chosen.raw,delisting:d.raw}),
  });
}
assert.deepEqual(unmatched,[],"2023+ delisted ordinary symbols missing official listing start");

const currentSourceRows=currentTwse.map(x=>({
  market:"TWSE",
  symbol:x.symbol,
  companyName:x.companyName,
  memberState:"CURRENT",
  listingDate:x.listingDate,
  delistingDate:null,
  industry:x.industry,
  sourceId:"MOPS_T187AP03_L_CURRENT_LISTED_COMPANY",
  sourceName:"MOPS/TWSE listed-company basic data",
  sourceUrl:"https://mopsfin.twse.com.tw/opendata/t187ap03_L.csv",
  sourceRowHash:sha({symbol:x.symbol,companyName:x.companyName,industry:x.industry,listingDate:x.listingDate}),
}));

const registry=await buildHistoricalUniverseRegistryV0_1({
  registryId:"D08-TWSE-2023-2026-OFFICIAL-UNION-V0.1",
  sourceRows:[...currentSourceRows,...delistedSourceRows],
  datasetStartDate:"2023-01-01",
  observedAt,
});
assert.equal(registry.unknownStartCount,0);
assert.equal(registry.replayEligibleCount,registry.membershipCount);

const scan=JSON.parse(fs.readFileSync("research/d08_twse_month_end_scan_date_receipt_20261004_v0_1.json","utf8"));
assert.equal(scan.monthCount,44);
const snapshots=[];
for(const entry of scan.scanDates){
  const snap=await buildHistoricalUniverseSnapshotV0_1({
    snapshotId:"D08-TWSE-"+entry.scanDate,
    registry,
    marketDate:entry.scanDate,
    capturedAt:observedAt,
  });
  const twse=snap.members.filter(x=>x.market==="TWSE");
  assert.equal(twse.length,snap.memberCount);
  snapshots.push({
    scanDate:entry.scanDate,
    memberCount:snap.memberCount,
    snapshotHash:snap.snapshotHash,
    firstSymbol:snap.members[0]?.symbol??null,
    lastSymbol:snap.members.at(-1)?.symbol??null,
  });
}
assert.equal(snapshots.length,44);
assert.ok(Math.min(...snapshots.map(x=>x.memberCount))>500);

const result={
  schemaVersion:"D08_TWSE_OFFICIAL_UNIVERSE_SOURCE_RECEIPT_V0_1",
  result:"PASS",
  generatedAt:observedAt,
  researchOnly:true,
  outcomeJoin:false,
  sources:{
    current:{source:current.source,count:currentTwse.length,sourceHash:current.sourceHash,sourceUrl:current.sourceUrl},
    newlisting:{source:newlistingRaw.url,rowCount:newRows.length,sourceHash:newlistingRaw.hash},
    delisting:{source:delistedRaw.url,rowCount2023Plus:delRows.length,sourceHash:delistedRaw.hash},
  },
  matching:{
    delistedMatchedCount:delistedSourceRows.length,
    delistedUnmatchedCount:unmatched.length,
    unmatched,
  },
  registry:{
    registryId:registry.registryId,
    registryHash:registry.registryHash,
    membershipCount:registry.membershipCount,
    symbolMarketCount:registry.symbolMarketCount,
    replayEligibleCount:registry.replayEligibleCount,
    unknownStartCount:registry.unknownStartCount,
    currentCount:registry.currentCount,
    delistedCount:registry.delistedCount,
  },
  scanClock:{
    scanDateListHash:scan.scanDateListHash,
    snapshotCount:snapshots.length,
    minMemberCount:Math.min(...snapshots.map(x=>x.memberCount)),
    maxMemberCount:Math.max(...snapshots.map(x=>x.memberCount)),
    snapshotBundleHash:sha(snapshots.map(x=>x.scanDate+"|"+x.memberCount+"|"+x.snapshotHash).join("\n")),
    snapshots,
  },
  guards:{
    currentListOnly:false,
    delistedIncluded:true,
    listingStartRequiredForDelisted:true,
    futureDelistingExposedToStrategy:false,
    noReturns:true,
    noFormalCoreImpact:true,
    noD1Writes:true,
  }
};
console.log("D08_OFFICIAL_UNIVERSE_RECEIPT="+JSON.stringify(result));