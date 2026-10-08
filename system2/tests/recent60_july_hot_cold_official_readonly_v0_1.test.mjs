import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import {
  FROZEN_RECENT60_SAMPLE_BLOB_SHA,
  selectFrozenRecent60JulySampleV0_1,
  auditFrozenRecent60JulyHotColdV0_1,
} from "../runtime/recent60_july_hot_cold_source_readonly_v0_1.mjs";
import { probeJulyOfficialSourceReadonlyV0_1 } from
  "../runtime/recent60_july_official_source_probe_v0_1.mjs";

const sourcePath="system2/evidence/S2_RECENT60_20261008_FULL_GAP_ARTIFACT_READBACK_20261009_V0_1.json";
const frozen=JSON.parse(await readFile(new URL("../evidence/S2_RECENT60_20261008_FULL_GAP_ARTIFACT_READBACK_20261009_V0_1.json",import.meta.url),"utf8"));
assert.equal(execFileSync("git",["hash-object","--",sourcePath],{
  cwd:process.cwd(),encoding:"utf8",
}).trim(),FROZEN_RECENT60_SAMPLE_BLOB_SHA);
const sample=selectFrozenRecent60JulySampleV0_1(frozen);
assert.equal(sample.length,12);
assert.equal(new Set(sample.map(x=>x.market+"|"+x.symbol)).size,12);
assert.equal(sample[0].symbol,"1563");
assert.equal(sample[6].symbol,"3710");
assert.deepEqual(sample[0].dates,[
  "2026-07-14","2026-07-15","2026-07-16","2026-07-17",
  "2026-07-20","2026-07-21","2026-07-22","2026-07-23",
]);
assert.throws(()=>selectFrozenRecent60JulySampleV0_1({
  ...frozen,sample:{...frozen.sample,requestedDateIdentities:95},
}),/Expected values to be strictly equal/);

function fakeDb({wrongJulyMonth=false,writeInitially=false,unexpectedHotRow=false}={}){
  const sqls=[];
  const metrics={rowsWritten:writeInitially?1:0,rowsRead:0,requestCount:0};
  const db={
    database:{name:"system2-research"},metrics,sqls,
    prepare(sql){
      sqls.push(sql);
      assert.match(sql,/^\s*SELECT\b/i);
      return {bind(...params){
        return {
          async first(){
            const market=params[0];
            if(market!=="TWSE")return null;
            return {
              market:"TWSE",year:2026,month:wrongJulyMonth?8:7,
              state:"COMPLETE",receipt_id:"TWSE-JULY-RECEIPT",
              manifest_rolling_hash:"hash",
            };
          },
          async all(){
            if(sql.includes("s2_historical_a1_bars")){
              const [market,symbol]=params;
              if(market==="TWSE"&&symbol==="1563"){
                return {results:[{
                  market:"TWSE",symbol:"1563",
                  market_date:unexpectedHotRow?"2026-08-01":"2026-07-14",
                  price_space:"RAW",pit_replay_eligible:0,
                }]};
              }
              return {results:[]};
            }
            if(sql.includes("s2_historical_a1_segment_manifests")){
              const [market,symbol]=params;
              if(market==="TWSE"&&symbol==="1563")return {results:[{
                market,symbol,year:2026,month:7,price_space:"RAW",
                segment_manifest_id:"S2HSM-sample",object_key:"path/sample.gz",
                object_sha256:"a".repeat(64),
              }]};
              return {results:[]};
            }
            throw new Error("unrecognized test query");
          },
        };
      }};
    },
  };
  return db;
}
const objectStore={
  backend:"CLOUDFLARE_R2_S3",bucketName:"system2-historical-research",
  async head(){return null;},async get(){return null;},
  async putIfAbsent(){throw new Error("should not be called");},
};
let coldCalls=0;
const coldLoader=async({db,objectStore,market,symbol,fromDate,toDate,priceSpace})=>{
  coldCalls++;
  assert.equal(market,"TWSE");assert.equal(symbol,"1563");
  assert.equal(fromDate,"2026-07-14");assert.equal(toDate,"2026-07-23");
  assert.equal(priceSpace,"RAW");
  assert.throws(()=>db.prepare("UPDATE s2_historical_a1_bars SET bar_hash='x'"),/read-only/);
  assert.throws(()=>db.batch([]),/read-only/);
  assert.throws(()=>objectStore.putIfAbsent("bad",new Uint8Array()),/read-only/);
  return {
    market,symbol,priceSpace,
    rows:[{market,symbol,marketDate:"2026-07-14"}],
    packRefs:[{segmentManifestId:"S2HSM-sample"}],
  };
};
const db=fakeDb();
const result=await auditFrozenRecent60JulyHotColdV0_1({
  db,objectStore,frozenEvidence:frozen,coldLoader,
});
assert.equal(result.sampledSymbolCount,12);
assert.equal(result.sampledDateIdentityCount,96);
assert.equal(result.julyMonthReceipts.TWSE.complete,true);
assert.equal(result.julyMonthReceipts.TPEX.complete,false);
assert.equal(result.causeCounts.HOT_D1_ROW_NOW_PRESENT_PIT_STATUS_UNDETERMINED,1);
assert.equal(result.causeCounts.COLD_MANIFEST_PRESENT_BUT_EXACT_DATE_NOT_IN_PACK,7);
assert.equal(result.causeCounts.COMPLETE_MONTH_RECEIPT_SYMBOL_MANIFEST_ABSENT,40);
assert.equal(result.causeCounts.NO_COMPLETE_MONTH_RECEIPT_OR_SYMBOL_MANIFEST,48);
assert.equal(result.hotRawRowsCurrentlyObserved,1);
assert.equal(result.physicallyReadColdBarsInSampleWindow,1);
assert.equal(result.physicallyReadColdManifests,1);
assert.equal(result.d1RowsWritten,0);
assert.equal(result.coldR2RowsPITEligibleAtHistoricalDate,false);
assert.equal(result.corporateActionNoEventInferred,false);
assert.equal(db.metrics.rowsWritten,0);
assert.equal(coldCalls,1);
assert.ok(db.sqls.every(s=>/^\s*SELECT\b/.test(s)));

await assert.rejects(()=>auditFrozenRecent60JulyHotColdV0_1({
  db:fakeDb({wrongJulyMonth:true}),objectStore,frozenEvidence:frozen,coldLoader,
}),/Expected values to be strictly equal/);
await assert.rejects(()=>auditFrozenRecent60JulyHotColdV0_1({
  db:fakeDb({writeInitially:true}),objectStore,frozenEvidence:frozen,coldLoader,
}),/pre-existing D1 writes/);
await assert.rejects(()=>auditFrozenRecent60JulyHotColdV0_1({
  db:fakeDb({unexpectedHotRow:true}),objectStore,frozenEvidence:frozen,coldLoader,
}),/unexpected hot D1 date/);
await assert.rejects(()=>auditFrozenRecent60JulyHotColdV0_1({
  db:fakeDb(),objectStore,frozenEvidence:frozen,
  coldLoader:async()=>{throw new Error("COLD_OBJECT_SHA256_MISMATCH");},
}),/SHA256_MISMATCH/);

let attempts=0;
const official=await probeJulyOfficialSourceReadonlyV0_1({
  samples:sample,
  now:()=>new Date("2026-10-09T01:00:00Z").toISOString(),
  fetchDate:async({market,marketDate,observedAt})=>{
    attempts++;
    assert.equal(observedAt(),"2026-10-09T01:00:00.000Z");
    if(market==="TPEX"&&marketDate==="2026-07-23")throw new Error("transient official GET failure");
    const symbols=sample.filter(s=>s.market===market).map(s=>s.symbol);
    return {
      market,marketDate,state:"READY",
      sourceId:"OFFICIAL_TEST_ONLY",
      sourceUrl:"https://example.test/canonical",
      sourceDateEvidence:marketDate,sourceDateEvidenceBasis:"PAYLOAD_DATE",
      ordinarySymbolCount:6,rows:symbols.map(symbol=>({symbol})),
    };
  },
});
assert.equal(attempts,4);
assert.equal(official.requestedDateCount,4);
assert.equal(official.verifiedDateCount,3);
assert.equal(official.receipts[3].result,"OFFICIAL_SOURCE_RETRIEVAL_UNVERIFIED");
assert.equal(official.noSourceAbsenceInferredFromNetworkFailure,true);
assert.equal(official.presentNowDoesNotProvePublishedThen,true);

const badSource=await probeJulyOfficialSourceReadonlyV0_1({
  samples:sample,
  fetchDate:async({market,marketDate})=>({
    market,marketDate,sourceDateEvidence:"2026-07-13",
    state:"READY",rows:[{symbol:"1563"}],
  }),
});
assert.equal(badSource.verifiedDateCount,0);

const workflow=await readFile(new URL("../../.github/workflows/system2-recent60-july-hot-cold-official-readonly.yml",import.meta.url),"utf8");
const runner=await readFile(new URL("../scripts/audit_recent60_july_hot_cold_official_readonly_v0_1.mjs",import.meta.url),"utf8");
assert.match(workflow,/permissions:\s*\n\s+contents: read/);
assert.match(workflow,/system2-recent60-july-hot-cold-official-readonly/);
assert.match(workflow,/audit_recent60_july_hot_cold_official_readonly_v0_1\.mjs/);
assert.doesNotMatch(workflow,/provision_system2_d1|wrangler\s+deploy|fugle-test/);
assert.match(runner,/FROZEN_RECENT60_SAMPLE_BLOB_SHA/);
assert.match(runner,/probeJulyOfficialSourceReadonlyV0_1/);
assert.doesNotMatch(runner,/\.run\s*\(|\.batch\s*\(|putIfAbsent\s*\(/);
console.log("System2 recent60 July three-layer frozen sample and read-only boundary tests passed");
