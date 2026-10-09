import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import {auditOct08FullSourceKeysHotD1ReadonlyV0_1 as audit}
 from "../runtime/oct08_full_source_to_hot_d1_census_readonly_v0_1.mjs";
const dates=["2026-10-01","2026-10-02","2026-10-05",
 "2026-10-06","2026-10-07","2026-10-08"];
const markets=["TWSE","TPEX"];
const twse=[1086,1086,1087,1087,1086,1086];
const tpex=[887,888,888,889,887,886];
const hash=x=>createHash("sha256").update(JSON.stringify(x)).digest("hex");
const data=new Map();
for(let n=0;n<dates.length;n++)for(const market of markets){
 const qty=market==="TWSE"?twse[n]:tpex[n];
 const rows=Array.from({length:qty},(_,i)=>({
  market,marketDate:dates[n],symbol:String(1000+i),priceSpace:"RAW",
  open:10+i/100,high:11+i/100,low:9+i/100,close:10.5+i/100,
  volumeShares:100000+i,tradeValue:1000000+i,transactions:20+i,
 }));
 data.set(market+"|"+dates[n],rows);
}
const sourceHash=x=>hash(x.map(r=>[
 r.symbol,r.open,r.high,r.low,r.close,r.volumeShares,r.tradeValue,r.transactions,
]).sort((a,b)=>a[0].localeCompare(b[0])));
const evidence={schemaVersion:"S2_20261008_LATEST_COMPLETED_SOURCE_RECEIPTS_PHYSICAL_ACCEPTANCE_V0_1",
 verifiedRun:{runId:37878847039,conclusion:"success",
  headSha:"39ca8dce38fa675874074609fb32d9c44321e944"},
 officialWindow:{marketDateReceiptCount:12,dates,
  samples:dates.flatMap(date=>markets.map(market=>({
   market,marketDate:date,sourceTransport:"PRIMARY",
   ordinarySymbolCount:data.get(market+"|"+date).length,
   normalizedBarSha256:sourceHash(data.get(market+"|"+date)),
  }))),
 }};
async function fetchDate({market,marketDate}){
 const rows=data.get(market+"|"+marketDate);
 return {state:"READY",market,marketDate,sourceDateEvidence:marketDate,
  transportMode:"PRIMARY",ordinarySymbolCount:rows.length,rows};
}
function mockDb({missing=false,mismatch=false,versioned=false,badDatabase=false,
 initialWrites=0,costPerQuery=0,truncated=false,regressAtCall=0}={}){
 const metrics={rowsRead:0,rowsWritten:initialWrites,requestCount:0};
 return {
  metrics,database:{name:badDatabase?"V7_DB":"system2-research"},
  prepare(query){
   assert.match(query,/^SELECT\b/);
   assert.match(query,/FROM s2_historical_a1_bars WHERE symbol IN \(/);
   assert.match(query,/price_space='RAW' LIMIT 151$/);
   return {bind(...args){return {async all(){
    metrics.requestCount++;
    const marketDate=args.at(-2),market=args.at(-1);
    const source=data.get(market+"|"+marketDate);
    assert.ok(source);
    const relevant=new Set(args.slice(0,-2));
    const vals=source.filter(r=>relevant.has(r.symbol)).map(r=>({
      market,market_date:marketDate,symbol:r.symbol,price_space:"RAW",
      open_price:r.open,high_price:r.high,low_price:r.low,close_price:r.close,
      volume_shares:r.volumeShares,trade_value:r.tradeValue,transactions:r.transactions,
      observed_at:"2026-10-09T03:21:00Z",
      available_at:"2026-10-09T03:21:00Z",
      availability_basis:"PROSPECTIVE_OBSERVATION",
      pit_replay_eligible:1,continuity_state:"UNVERIFIED",bar_hash:"a".repeat(64),
    }));
    const key=r=>r.market==="TWSE"&&r.market_date==="2026-10-01"&&r.symbol==="1000";
    let result=missing?vals.filter(r=>!key(r)):vals;
    if(mismatch)result=result.map(r=>key(r)?{...r,close_price:-1}:r);
    if(versioned)for(const r of [...result])if(key(r))result.push({...r,bar_hash:"b".repeat(64)});
    if(truncated)result=Array.from({length:151},(_,i)=>({...vals[0],
     bar_hash:i.toString(16).padStart(64,"0")}));
    metrics.rowsRead+=result.length+costPerQuery;
    if(metrics.requestCount===regressAtCall)metrics.rowsRead=0;
    return {results:result};
   }};}};
  },
 };
}
const success=await audit({db:mockDb(),evidence,fetchDate});
assert.equal(success.result,"PASS_ALL_11843_SOURCE_KEYS_MATCH_D1_VALUES_ONLY");
assert.equal(success.sourceReceiptsMatched,12);
assert.equal(success.sourceRevalidationReceipts.length,12);
assert.equal(success.sourceRevalidationDigest.length,64);
for(const row of success.sourceRevalidationReceipts){
 const expected=evidence.officialWindow.samples.find(x=>x.market===row.market
  &&x.marketDate===row.marketDate);
 assert.equal(row.normalizedBarSha256,expected.normalizedBarSha256);
 assert.equal(row.ordinarySymbolCount,expected.ordinarySymbolCount);
}
assert.equal(success.sourceSymbolDayKeys,11843);
assert.equal(success.counts.matched,11843);
assert.equal(success.actualD1Queries,240);
assert.equal(success.observedD1.rowsWritten,0);
assert.equal(success.historicPITReplayAuthorized,false);
assert.equal(success.d1MissingUnrequestedExtraRecordsNotProvenAbsent,true);
for(const [opts,state,kind] of [
 [{missing:true},"HOT_D1_KEY_ABSENT","missing"],
 [{mismatch:true},"HOT_D1_SOURCE_VALUES_MISMATCH","mismatched"],
 [{versioned:true},"HOT_D1_RAW_MULTIVERSION","multi"],
]){
 const actual=await audit({db:mockDb(opts),evidence,fetchDate});
 assert.equal(actual.result,"BLOCKED_OCT08_MISSING_MISMATCHED_OR_MULTIVERSION_D1_KEYS");
 assert.equal(actual.counts[kind],1);
 assert.ok(actual.discrepancies.some(r=>r.state===state&&r.symbol==="1000"));
 assert.equal(actual.marketYear2026FullPass,false);
}
const noD1=mockDb();
await assert.rejects(()=>audit({db:noD1,evidence,
 fetchDate:async p=>({...await fetchDate(p),rows:(await fetchDate(p)).rows.map((x,i)=>
  i===0?{...x,close:x.close+1}:x)})}),/FULL_SOURCE_HASH_CHANGED/);
assert.equal(noD1.metrics.requestCount,0);
await assert.rejects(()=>audit({db:mockDb({badDatabase:true}),evidence,fetchDate}),
 /isolated System2 database required/);
await assert.rejects(()=>audit({db:mockDb({initialWrites:1}),evidence,fetchDate}),
 /D1 writes already recorded/);
const lowCost=mockDb({costPerQuery:150001});
await assert.rejects(()=>audit({db:lowCost,evidence,fetchDate}),
 /D1_READ_BUDGET_HARD_CAP_AFTER_QUERY/);
assert.equal(lowCost.metrics.requestCount,1);
// The SQL LIMIT 151 can hide rows for a requested symbol when RAW versions
// proliferate; a full result must never become 49 false-missing repair intents.
const cappedDb=mockDb({truncated:true});
await assert.rejects(()=>audit({db:cappedDb,evidence,fetchDate}),
 /HOT_D1_QUERY_RESULT_TRUNCATED_UNSAFE_FOR_ABSENCE_CLASSIFICATION/);
assert.equal(cappedDb.metrics.requestCount,1);
assert.equal(cappedDb.metrics.rowsWritten,0);
// Incomplete/invalid D1 read accounting must not masquerade as zero cost.
const unknownReadDb=mockDb();
unknownReadDb.metrics.rowsRead=Number.NaN;
await assert.rejects(()=>audit({db:unknownReadDb,evidence,fetchDate}),
 /D1_ROWS_READ_METRICS_UNKNOWN_FAIL_CLOSED/);
assert.equal(unknownReadDb.metrics.requestCount,0);
const negativeReadDb=mockDb();
negativeReadDb.metrics.rowsRead=-1;
await assert.rejects(()=>audit({db:negativeReadDb,evidence,fetchDate}),
 /D1_ROWS_READ_METRICS_UNKNOWN_FAIL_CLOSED/);
assert.equal(negativeReadDb.metrics.requestCount,0);
// A valid numeric counter can still rewind on a later SQL response.
// Do not interpret a reset as renewed read headroom.
const revertedCounterDb=mockDb({regressAtCall:2});
await assert.rejects(()=>audit({db:revertedCounterDb,evidence,fetchDate}),
 /D1_ROWS_READ_COUNTER_REGRESSED_FAIL_CLOSED/);
assert.equal(revertedCounterDb.metrics.requestCount,2);
assert.equal(revertedCounterDb.metrics.rowsWritten,0);
await assert.rejects(()=>audit({db:mockDb(),evidence:{
 ...evidence,officialWindow:{...evidence.officialWindow,
 samples:evidence.officialWindow.samples.slice(1)}},fetchDate}));
await assert.rejects(()=>audit({db:mockDb(),evidence,
 fetchDate:async p=>({...await fetchDate(p),transportMode:"LEGACY_JSON_FALLBACK"})}),
 /legacy source not equivalent/);
const workflow=await readFile(new URL(
 "../../.github/workflows/system2-oct08-full-source-hot-d1-census-manual.yml",
 import.meta.url),"utf8");
const runner=await readFile(new URL(
 "../scripts/audit_oct08_full_source_to_hot_d1_census_readonly_v0_1.mjs",
 import.meta.url),"utf8");
assert.match(workflow,/workflow_dispatch:/);
assert.doesNotMatch(workflow,/^\s*push:|^\s*schedule:|^\s*workflow_run:/m);
assert.match(workflow,/group: system2-isolated-d1-writer/);
assert.match(workflow,/cross_system_d1_read_budget_confirmed/);
assert.match(workflow,/no_competing_d1_writer/);
assert.doesNotMatch(workflow,/R2_ACCESS_KEY|wrangler.*deploy|PUSH_WEBHOOK/);
assert.match(runner,/REMEDIATION_LANE_CROSS_SYSTEM_D1_READ_QUOTA_NOT_CONFIRMED/);
assert.doesNotMatch(runner,/\.batch\s*\(|\.run\s*\(|\.putIfAbsent\s*\(/);
console.log("System2 Oct08 11,843 full frozen source-to-D1 key census: positive + 9 fail-closed guards PASS");
