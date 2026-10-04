import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { parseListingDateV0_1 } from "../runtime/current_listing_metadata_v0_1.mjs";
import {
  buildHistoricalUniverseRegistryV0_1,
  buildHistoricalUniverseSnapshotV0_1,
} from "../runtime/historical_universe_registry_v0_1.mjs";
import {
  buildOfficialTradingDatesV0_1,
  fetchOfficialHistoricalA1RangeV0_1,
} from "../runtime/official_historical_backfill_source_v0_1.mjs";
import { fetchOfficialHistoricalA1DateV0_1 } from "../runtime/official_historical_a1_source_v0_1.mjs";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import {
  buildD19UniverseReceiptV0_1,
  buildD19ReturnReceiptV0_1,
  buildD19FactorInputReceiptV0_1,
  buildD19NeutralizationReceiptV0_1,
  buildD19CostReceiptV0_1,
  buildD19ReplayReceiptV0_1,
  D19_FACTOR_RECEIPT_VERSION_V0_1,
} from "../runtime/d19_factor_receipt_adapter_v0_1.mjs";

const fromDate=process.env.D19_TWSE_FROM || "2026-08-03";
const toDate=process.env.D19_TWSE_TO || "2026-08-31";
const datasetStartDate="2023-01-01";
const decisionTimestamp=process.env.D19_TWSE_DECISION || toDate+"T05:40:00Z";
const observedAt=new Date().toISOString();
const sha=(x)=>createHash("sha256").update(typeof x==="string"?x:JSON.stringify(x)).digest("hex");
const ordinary=(x)=>/^[1-9][0-9]{3}$/.test(String(x??"").trim());

function parseDate(raw){
  let s=String(raw??"").trim();
  if(!s)return null;
  s=s.replace(/[年月]/g,"/").replace(/日/g,"").replaceAll(".","/");
  return parseListingDateV0_1(s);
}
async function fetchJson(url){
  const response=await fetch(url,{
    headers:{accept:"application/json","user-agent":"D19-TWSE-universe-coverage/0.1"},
    signal:AbortSignal.timeout(60000),
  });
  const text=await response.text();
  assert.ok(response.ok,"HTTP "+response.status+" "+url);
  return {url,text,json:JSON.parse(text),hash:sha(text)};
}
function tableObjects(payload){
  const ok=payload?.stat==="OK" || String(payload?.status??"").toLowerCase()==="ok";
  assert.equal(ok,true,"TWSE table status invalid");
  assert.ok(Array.isArray(payload.fields)&&Array.isArray(payload.data),"TWSE table envelope invalid");
  return payload.data.map(row=>Object.fromEntries(payload.fields.map((h,i)=>[h,row[i]])));
}
function momentum(rows){
  if(rows.length<21)return null;
  const first=rows[0]?.close,last=rows.at(-1)?.close;
  return Number.isFinite(first)&&first>0&&Number.isFinite(last)&&last>0 ? last/first-1 : null;
}

const current=await fetchJson("https://openapi.twse.com.tw/v1/opendata/t187ap03_L");
assert.ok(Array.isArray(current.json)&&current.json.length>500,"TWSE current-list source incomplete");
const currentRows=current.json.map(row=>({
  market:"TWSE",
  symbol:String(row["公司代號"]??"").trim(),
  companyName:String(row["公司名稱"]??"").trim()||null,
  memberState:"CURRENT",
  listingDate:parseDate(row["上市日期"]),
  delistingDate:null,
  industry:String(row["產業別"]??"").trim()||null,
  sourceId:"TWSE_OPENAPI_T187AP03_L",
  sourceName:"TWSE current listed-company basic data",
  sourceUrl:current.url,
  sourceRowHash:sha(row),
})).filter(x=>ordinary(x.symbol)&&x.listingDate);

const newlisting=await fetchJson("https://www.twse.com.tw/rwd/zh/company/newlisting?response=json");
const delisting=await fetchJson("https://www.twse.com.tw/rwd/zh/company/suspendListing?response=json");
const newRows=tableObjects(newlisting.json).map(x=>({
  symbol:String(x["公司代號"]??"").trim(),
  companyName:String(x["公司簡稱"]??"").trim()||null,
  listingDate:parseDate(x["股票上市買賣日期"]),
  raw:x,
})).filter(x=>ordinary(x.symbol)&&x.listingDate);
const delRows=tableObjects(delisting.json).map(x=>({
  symbol:String(x["上市編號"]??x["公司代號"]??"").trim(),
  companyName:String(x["公司名稱"]??x["公司簡稱"]??"").trim()||null,
  delistingDate:parseDate(x["終止上市日期"]),
  raw:x,
})).filter(x=>ordinary(x.symbol)&&x.delistingDate&&x.delistingDate>=datasetStartDate);

const listingsBySymbol=new Map();
for(const row of newRows){
  if(!listingsBySymbol.has(row.symbol))listingsBySymbol.set(row.symbol,[]);
  listingsBySymbol.get(row.symbol).push(row);
}
for(const rows of listingsBySymbol.values())rows.sort((a,b)=>a.listingDate.localeCompare(b.listingDate));

const tradingAtStart=await buildOfficialTradingDatesV0_1({fromDate:datasetStartDate,toDate:"2023-01-06"});
const datasetFirstTradingDate=tradingAtStart.tradingDates[0];
const firstSession=await fetchOfficialHistoricalA1DateV0_1({
  market:"TWSE",marketDate:datasetFirstTradingDate,observedAt,
});
const firstSessionSymbols=new Set(firstSession.rows.map(x=>x.symbol));
const firstTradingDateByMarketSymbol={};
const delistedRows=[];
for(const d of delRows){
  const candidates=(listingsBySymbol.get(d.symbol)||[]).filter(x=>x.listingDate<=d.delistingDate);
  const chosen=candidates.at(-1)||null;
  if(!chosen){
    assert.ok(firstSessionSymbols.has(d.symbol),"unmatched delisted symbol absent at dataset start: "+d.symbol);
    firstTradingDateByMarketSymbol["TWSE|"+d.symbol]=datasetFirstTradingDate;
  }
  delistedRows.push({
    market:"TWSE",symbol:d.symbol,companyName:d.companyName||chosen?.companyName||null,
    memberState:"DELISTED",listingDate:chosen?.listingDate||null,delistingDate:d.delistingDate,
    industry:null,
    sourceId:chosen?"TWSE_NEWLISTING_PLUS_DELISTING":"TWSE_DATASET_START_HISTORY_PLUS_DELISTING",
    sourceName:chosen?"TWSE newlisting + suspendListing":"TWSE dataset-start presence + suspendListing",
    sourceUrl:chosen?newlisting.url+" | "+delisting.url:firstSession.sourceUrl+" | "+delisting.url,
    sourceRowHash:sha({newlisting:chosen?.raw||null,datasetFirstTradingDate:chosen?null:datasetFirstTradingDate,delisting:d.raw}),
  });
}

const registry=await buildHistoricalUniverseRegistryV0_1({
  registryId:"D19-TWSE-2023-2026-OFFICIAL-UNION-V0.1",
  sourceRows:[...currentRows,...delistedRows],
  firstTradingDateByMarketSymbol,
  datasetStartDate,
  observedAt,
});
assert.equal(registry.unknownStartCount,0);
assert.equal(registry.replayEligibleCount,registry.membershipCount);

const snapshot=await buildHistoricalUniverseSnapshotV0_1({
  snapshotId:"D19-TWSE-"+toDate,
  registry,marketDate:toDate,capturedAt:observedAt,
});
assert.ok(snapshot.memberCount>1000,"TWSE snapshot unexpectedly small");

const range=await fetchOfficialHistoricalA1RangeV0_1({
  market:"TWSE",fromDate,toDate,observedAt,pauseMs:25,includeRowProvenance:true,
});
assert.equal(range.tradingDateCount,21);
assert.equal(range.fetchedTradingDateCount,21);

const rowsBySymbol=new Map();
for(const row of range.rows){
  if(!rowsBySymbol.has(row.symbol))rowsBySymbol.set(row.symbol,[]);
  rowsBySymbol.get(row.symbol).push(row);
}
for(const rows of rowsBySymbol.values())rows.sort((a,b)=>a.marketDate.localeCompare(b.marketDate));

const d19Universe=await buildD19UniverseReceiptV0_1({
  runId:"D19-TWSE-FULL-UNIVERSE|"+toDate,
  marketDate:toDate,
  decisionTimestamp,
  registryId:registry.registryId+"|"+registry.registryHash+"|"+snapshot.snapshotHash,
  universeKind:"TWSE_SURVIVORSHIP_CONTROLLED_HISTORICAL_REGISTRY",
  members:snapshot.members.map(x=>({
    market:x.market,symbol:x.symbol,membershipId:x.membershipId,membershipHash:x.membershipHash,
    replayEligible:true,industry:null,
  })),
  capturedAt:observedAt,
});

const returnReceipts=[];
const factorInputs=[];
const factorRows=[];
const coverage=[];
for(const member of snapshot.members){
  const rows=rowsBySymbol.get(member.symbol)||[];
  const eligibleRows=rows.filter(x=>
    x.marketDate>=fromDate&&x.marketDate<=toDate&&
    x.availableAt&&Date.parse(x.availableAt)<=Date.parse(decisionTimestamp)
  );
  const complete=eligibleRows.length===21 && eligibleRows.every(x=>Number.isFinite(x.close)&&x.close>0&&x.sourceRowHash);
  const value=complete?momentum(eligibleRows):null;
  const observationState=complete&&Number.isFinite(value)?"KNOWN":"UNKNOWN";
  const reason=observationState==="KNOWN"?null:
    eligibleRows.length<21?"INSUFFICIENT_21_SESSION_HISTORY_OR_NONTRADING":
    "INVALID_CLOSE_OR_PROVENANCE";

  const ret=await buildD19ReturnReceiptV0_1({
    runId:"D19-TWSE-FULL-UNIVERSE|"+toDate,
    factorId:"D19-04",symbol:member.symbol,market:"TWSE",marketDate:toDate,decisionTimestamp,
    inputBarHashes:eligibleRows.map(x=>x.sourceRowHash).filter(Boolean),
    continuityPolicyVersion:"RAW_CONTINUITY_UNVERIFIED_V0_1",
    corporateActionPolicyVersion:"CONTINUITY_CERTIFICATION_PENDING_V0_1",
    returnDefinition:"CLOSE_T_MINUS_20_TO_CLOSE_T",
    returnValue:observationState==="KNOWN"?value:null,
    state:observationState,unknownReason:reason,capturedAt:observedAt,
  });
  returnReceipts.push(ret);

  const input=await buildD19FactorInputReceiptV0_1({
    runId:"D19-TWSE-FULL-UNIVERSE|"+toDate,
    factorId:"D19-04",factorVersion:"CROSS_SECTIONAL_MOMENTUM_20S_FULL_TWSE_COVERAGE_V0_1",
    scope:"SYMBOL",scopeKey:"TWSE|"+member.symbol,marketDate:toDate,decisionTimestamp,
    inputs:[{
      inputId:"RAW_RETURN_20S",inputVersion:"V0_1",required:true,state:observationState,
      valueHash:observationState==="KNOWN"?ret.receiptHash:null,
      sourceId:"TWSE_MI_INDEX_HISTORICAL_DAILY",
      payloadHash:eligibleRows.length?await sha256Hex(eligibleRows.map(x=>x.sourceRowHash)):null,
      observedAt:eligibleRows.at(-1)?.observedAt||null,
      availableAt:eligibleRows.at(-1)?.availableAt||null,
      unknownReason:reason,
    }],
    capturedAt:observedAt,
  });
  factorInputs.push(input);
  coverage.push({symbol:member.symbol,rowCount:eligibleRows.length,state:observationState,reason});
  if(observationState==="KNOWN")factorRows.push({symbol:member.symbol,momentum20:value});
}

const known=factorRows.length;
const unknown=coverage.length-known;
assert.equal(known+unknown,snapshot.memberCount,"coverage denominator mismatch");
assert.ok(known>0,"no known momentum observations");
const center=factorRows.reduce((s,x)=>s+x.momentum20,0)/known;
const residualHash=await sha256Hex(factorRows.map(x=>[x.symbol,x.momentum20,x.momentum20-center]));
const neutralization=await buildD19NeutralizationReceiptV0_1({
  runId:"D19-TWSE-FULL-UNIVERSE|"+toDate,
  factorId:"D19-04",factorVersion:"CROSS_SECTIONAL_MOMENTUM_20S_FULL_TWSE_COVERAGE_V0_1",
  marketDate:toDate,decisionTimestamp,
  factorSetId:"D19-04-TWSE-MARKET-CENTERING",factorSetVersion:"V0_1",
  method:"WITHIN_TWSE_DEMEAN_KNOWN_ONLY",
  estimationWindow:fromDate+"/"+toDate,validSampleCount:known,
  transformMetadata:{center,knownCount:known,unknownCount:unknown,denominator:snapshot.memberCount},
  residualHash,
  warnings:["CORPORATE_ACTION_CONTINUITY_UNVERIFIED","INDUSTRY_NEUTRALIZATION_NOT_PROVEN","D03_D09_REDUNDANCY_NOT_PROVEN"],
  capturedAt:observedAt,
});
const cost=await buildD19CostReceiptV0_1({
  runId:"D19-TWSE-FULL-UNIVERSE|"+toDate,marketDate:toDate,decisionTimestamp,
  scenarioId:"D19_ENGINEERING_TRANSPORT_ONLY",scenarioVersion:"V0_1",
  turnoverDefinition:"NOT_ESTIMATED_IN_COVERAGE_SMOKE",
  components:[{
    componentId:"ALL_IN_COST_PLACEHOLDER",componentVersion:"V0_1",quality:"MODELED",rate:0,
    sourceId:"D19_ENGINEERING_SMOKE_ONLY",sourceVersion:"V0_1",sourceHash:"NOT_ALPHA_OR_NET_RETURN_EVIDENCE",
  }],
  shortLegRequired:false,borrowabilityState:"NOT_APPLICABLE",capturedAt:observedAt,
});
const blockers=[
  "FULL_TAIWAN_UNIVERSE_TPEX_REGISTRY_NOT_PROVEN",
  "CORPORATE_ACTION_CONTINUITY_UNVERIFIED",
  "INDUSTRY_NEUTRALIZATION_NOT_PROVEN",
  "D03_D09_REDUNDANCY_NOT_PROVEN",
  "COST_PROVENANCE_MODELED_TRANSPORT_ONLY",
];
if(unknown>0)blockers.push("TWSE_FACTOR_INPUT_COVERAGE_INCOMPLETE");

const outputHash=await sha256Hex({
  registryHash:registry.registryHash,snapshotHash:snapshot.snapshotHash,
  coverage:coverage.map(x=>[x.symbol,x.rowCount,x.state,x.reason]),
  knownFactors:factorRows.map(x=>[x.symbol,x.momentum20]),
});
const replay=await buildD19ReplayReceiptV0_1({
  runId:"D19-TWSE-FULL-UNIVERSE|"+toDate,marketDate:toDate,decisionTimestamp,
  factorId:"D19-04",factorVersion:"CROSS_SECTIONAL_MOMENTUM_20S_FULL_TWSE_COVERAGE_V0_1",
  universeReceipt:d19Universe,returnReceipts,factorInputReceipts:factorInputs,
  neutralizationReceipt:neutralization,costReceipt:cost,outputHash,
  codeVersion:D19_FACTOR_RECEIPT_VERSION_V0_1,eligibilityBlockers:blockers,capturedAt:observedAt,
});

const rowCountHistogram=Object.fromEntries(
  [...new Set(coverage.map(x=>x.rowCount))].sort((a,b)=>a-b)
    .map(count=>[String(count),coverage.filter(x=>x.rowCount===count).length])
);
console.log(JSON.stringify({
  result:"PASS_TWSE_FULL_UNIVERSE_COVERAGE_NEGATIVE_L3_GATE",
  smokeVersion:"S2_D19_TWSE_FULL_UNIVERSE_COVERAGE_V0_1",
  fromDate,toDate,decisionTimestamp,
  officialTradingDates:range.tradingDateCount,
  sourceRowCount:range.rowCount,
  historicalRegistry:{
    registryId:registry.registryId,registryHash:registry.registryHash,
    membershipCount:registry.membershipCount,replayEligibleCount:registry.replayEligibleCount,
    currentCount:registry.currentCount,delistedCount:registry.delistedCount,unknownStartCount:registry.unknownStartCount,
  },
  snapshot:{marketDate:toDate,memberCount:snapshot.memberCount,snapshotHash:snapshot.snapshotHash},
  coverage:{
    denominator:snapshot.memberCount,known,unknown,
    knownPct:Number((known/snapshot.memberCount*100).toFixed(4)),
    rowCountHistogram,
    unknownSample:coverage.filter(x=>x.state!=="KNOWN").slice(0,30),
  },
  receipts:{
    universeReceiptHash:d19Universe.receiptHash,
    returnReceiptCount:returnReceipts.length,
    factorInputReceiptCount:factorInputs.length,
    neutralizationReceiptHash:neutralization.receiptHash,
    costReceiptHash:cost.receiptHash,
    replayReceiptHash:replay.receiptHash,
  },
  receiptChainComplete:replay.receiptChainComplete,
  l3DataFeasibilityEligible:replay.l3DataFeasibilityEligible,
  eligibilityBlockers:replay.eligibilityBlockers,
  formalCoreChanged:false,system1RuntimeChanged:false,finalSelectionAuthorized:false,
},null,2));
