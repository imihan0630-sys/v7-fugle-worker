import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { fetchCurrentListingMetadataV0_1, parseListingDateV0_1 } from "../runtime/current_listing_metadata_v0_1.mjs";
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
const current=await fetchCurrentListingMetadataV0_1({
  observedAt,
  minimumByMarket:{TWSE:500,TPEX:400},
});
assert.equal(current.state,"READY");
const currentTwse=Object.values(current.byMarketSymbol).filter(x=>x.market==="TWSE");
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
    current:{source:"MOPS t187ap03_L",count:currentTwse.length,metadataHash:current.metadataHash},
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