import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import {buildIssue1026Oct08SourceKeyManifestV0_1 as manifest}
 from "../runtime/issue1026_p05_oct08_source_key_manifest_v0_1.mjs";

const H=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
const dates=["2026-10-01","2026-10-02","2026-10-05","2026-10-06",
 "2026-10-07","2026-10-08"];
const markets=["TWSE","TPEX"];
const twse=[1086,1086,1087,1087,1086,1086];
const tpex=[887,888,888,889,887,886];
const map=new Map();
for(let i=0;i<6;i++)for(const market of markets){
 const n=market==="TWSE"?twse[i]:tpex[i];
 map.set(market+"|"+dates[i],Array.from({length:n},(_,j)=>({
  market,marketDate:dates[i],symbol:String(1000+j),
  priceSpace:"RAW",continuityState:"UNVERIFIED",
  open:12+j/100,high:14+j/100,low:11+j/100,close:13+j/100,
  volumeShares:100000+j,tradeValue:1900000+j,transactions:20+j,
 })));
}
const rowTuple=r=>[r.symbol,r.open,r.high,r.low,r.close,
 r.volumeShares,r.tradeValue,r.transactions];
const dateHash=rr=>H(rr.map(rowTuple).sort((a,b)=>a[0].localeCompare(b[0])));
const officialEvidence={
 schemaVersion:"S2_20261008_LATEST_COMPLETED_SOURCE_RECEIPTS_PHYSICAL_ACCEPTANCE_V0_1",
 cutoff:"2026-10-08",
 verifiedRun:{runId:37878847039,conclusion:"success",
  headSha:"39ca8dce38fa675874074609fb32d9c44321e944"},
 officialWindow:{
  sourceResult:"PASS_20261001_08_12_OFFICIAL_SOURCE_DATE_RECEIPTS_ONLY",
  marketDateReceiptCount:12,dates,
  samples:dates.flatMap(marketDate=>markets.map(market=>({
   market,marketDate,sourceId:market==="TWSE"?
    "A1_TWSE_MI_INDEX_HISTORICAL_DAILY":"A1_TPEX_DAILY_QUOTES_HISTORICAL",
   ordinarySymbolCount:map.get(market+"|"+marketDate).length,
   normalizedBarSha256:dateHash(map.get(market+"|"+marketDate)),
   sourceDateEvidenceBasis:"PAYLOAD_DATE",sourceTransport:"PRIMARY",
  }))),
 },
};
const sourceFn=async({market,marketDate})=>({
 state:"READY",market,marketDate,sourceDateEvidence:marketDate,
 sourceId:market==="TWSE"?
  "A1_TWSE_MI_INDEX_HISTORICAL_DAILY":"A1_TPEX_DAILY_QUOTES_HISTORICAL",
 sourceDateEvidenceBasis:"PAYLOAD_DATE",transportMode:"PRIMARY",
 ordinarySymbolCount:map.get(market+"|"+marketDate).length,
 rows:map.get(market+"|"+marketDate),
});
const run=o=>manifest({officialEvidence,fetchDate:sourceFn,...o});
const actual=await run();
assert.equal(actual.result,"PASS_11843_OFFICIAL_SOURCE_KEYS_ONLY_NO_D1_CENSUS");
assert.equal(actual.officialSourceStockDateKeys,11843);
assert.equal(actual.manifestSourceKeyRows.length,11843);
assert.equal(actual.manifestKeyCount,11843);
assert.deepEqual(actual.marketSourceKeys,{TWSE:6518,TPEX:5325});
assert.equal(actual.sourceDateMarketReceipts,12);
assert.equal(actual.dateSourceReceipts.length,12);
assert.equal(actual.manifestSourceKeysSha256.length,64);
assert.equal(actual.manifestSourceKeyValuesSha256.length,64);
assert.equal(actual.d1SelectsExecutedByManifest,0);
assert.equal(actual.d1WritesExecutedByManifest,0);
assert.equal(actual.r2CallsExecutedByManifest,0);
assert.equal(actual.physicalD1MissingKeys,"UNKNOWN");
assert.equal(actual.physicalD1MultiVersionKeys,"UNKNOWN");
assert.equal(actual.originalFirstKnownAtCertified,false);
assert.equal(actual.pointInTimeAvailableAtAtHistoricalCutCertified,false);
assert.equal(actual.hotD1FullPhysicalExecuted,0);
assert.equal(actual.hotD1ScoutPhysicalExecuted,0);
const a2=await run();
assert.equal(a2.manifestSourceKeysSha256,actual.manifestSourceKeysSha256);
assert.equal(a2.manifestSourceKeyValuesSha256,actual.manifestSourceKeyValuesSha256);
const mutant={
 legacy:async v=>({...await sourceFn(v),transportMode:"LEGACY_FALLBACK"}),
 date:async v=>({...await sourceFn(v),sourceDateEvidence:"2026-10-09"}),
 market:async v=>({...await sourceFn(v),market:"NOT_TPEX"}),
 count:async v=>({...await sourceFn(v),ordinarySymbolCount:1}),
 hash:async v=>({...await sourceFn(v),rows:(await sourceFn(v)).rows.map((r,i)=>
  i===0?{...r,close:r.close+1}:r)}),
 duplicate:async v=>({...await sourceFn(v),rows:(await sourceFn(v)).rows.map((r,i)=>
  i===1?{...r,symbol:"1000"}:r)}),
 wrongPIT:async v=>({...await sourceFn(v),rows:(await sourceFn(v)).rows.map((r,i)=>
  i===0?{...r,continuityState:"VERIFIED"}:r)}),
 badBasis:async v=>({...await sourceFn(v),sourceDateEvidenceBasis:"UNVERIFIED"}),
 badId:async v=>({...await sourceFn(v),sourceId:"UNVERIFIED"}),
};
for(const [name,fetchDate] of Object.entries(mutant)){
 await assert.rejects(()=>run({fetchDate}),undefined,name);
}
await assert.rejects(()=>manifest({
 officialEvidence:{...officialEvidence,verifiedRun:{...officialEvidence.verifiedRun,runId:1}},
 fetchDate:sourceFn,
}));
await assert.rejects(()=>manifest({
 officialEvidence:{...officialEvidence,officialWindow:{...officialEvidence.officialWindow,
  marketDateReceiptCount:11}},fetchDate:sourceFn,
}));
await assert.rejects(()=>manifest({
 officialEvidence:{...officialEvidence,officialWindow:{...officialEvidence.officialWindow,
  samples:officialEvidence.officialWindow.samples.map((r,i)=>i===0?
   {...r,normalizedBarSha256:"f".repeat(64)}:r)}},
 fetchDate:sourceFn,
}));
const wf=await readFile(new URL(
 "../../.github/workflows/system2-issue1026-p05-oct08-source-key-manifest-readonly.yml",import.meta.url),"utf8");
const runner=await readFile(new URL(
 "../scripts/probe_issue1026_p05_oct08_source_key_manifest_official_only_v0_1.mjs",import.meta.url),"utf8");
assert.match(wf,/workflow_dispatch:/);
assert.match(wf,/push:[\s\S]*paths:/);
assert.doesNotMatch(wf,/^\s*schedule:|^\s*workflow_run:/m);
assert.doesNotMatch(wf,/CLOUDFLARE_ACCOUNT_ID|SYSTEM2_CLOUDFLARE_API_TOKEN|wrangler.*d1|wrangler.*deploy/);
assert.doesNotMatch(runner,/CLOUDFLARE_|\.batch\s*\(|\.run\s*\(|\.putIfAbsent\s*\(/);
console.log("ISSUE1026_P05_FULL_OCT08_SOURCE_11843_KEY_POSITIVE_PLUS_12_ADVERSARIAL_GUARDS_PASS_ZERO_D1");
