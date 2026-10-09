import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import {auditOct08HotD1BoundedSourceMatchedReadV0_1 as audit}
 from "../runtime/oct08_hot_d1_source_matched_sample_readonly_v0_1.mjs";

const dates=["2026-10-01","2026-10-02","2026-10-05",
 "2026-10-06","2026-10-07","2026-10-08"];
const markets=["TWSE","TPEX"];
const payloads=new Map();
const hash=v=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
function rows(market,marketDate){
 return Array.from({length:market==="TWSE"?960:720},(_,i)=>({
  market,marketDate,symbol:String(1000+i),
  open:i+10,high:i+11,low:i+9,close:i+10.5,
  volumeShares:100+i,tradeValue:1000+i,transactions:10+i,
  priceSpace:"RAW",continuityState:"UNVERIFIED",
 }));
}
for(const d of dates)for(const m of markets)payloads.set(m+"|"+d,rows(m,d));
const sh=r=>hash(r.map(x=>[
 x.symbol,x.open,x.high,x.low,x.close,x.volumeShares,x.tradeValue,x.transactions,
]).sort((a,b)=>a[0].localeCompare(b[0])));
const frozen={schemaVersion:"S2_20261008_LATEST_COMPLETED_SOURCE_RECEIPTS_PHYSICAL_ACCEPTANCE_V0_1",
 verifiedRun:{runId:37878847039,conclusion:"success",
  headSha:"39ca8dce38fa675874074609fb32d9c44321e944"},
 cutoff:"2026-10-08",officialWindow:{
  dates,marketDateReceiptCount:12,
  samples:dates.flatMap(d=>markets.map(m=>({
   market:m,marketDate:d,ordinarySymbolCount:payloads.get(m+"|"+d).length,
   normalizedBarSha256:sh(payloads.get(m+"|"+d)),sourceTransport:"PRIMARY",
  }))),
 }};
const fetchDate=async({market,marketDate})=>{
 const bars=payloads.get(market+"|"+marketDate);
 return {market,marketDate,sourceDateEvidence:marketDate,
  state:"READY",transportMode:"PRIMARY",ordinarySymbolCount:bars.length,
  rows:bars};
};
function buildDb({missingSymbol="none",mismatchSymbol="none",
 revisionsSymbol="none",wrongDatabase=false,writeCount=0,
 rowsReadPerCall=2}={}){
 const metrics={requestCount:0,rowsRead:0,rowsWritten:writeCount};
 const prepare=sql=>{
  assert.match(sql,/^SELECT\b/);
  assert.match(sql,/WHERE symbol = \? AND market_date = \? AND market = \?/);
  assert.match(sql,/LIMIT 10$/);
  return {bind(symbol,marketDate,market){
   return {async all(){
    metrics.requestCount++;
    metrics.rowsRead+=rowsReadPerCall;
    const original=payloads.get(market+"|"+marketDate)?.find(x=>x.symbol===symbol);
    if(!original)return {results:[]};
    if(symbol===missingSymbol)return {results:[]};
    const toDb=x=>({
     market,market_date:marketDate,symbol,
     price_space:"RAW",open_price:x.open,high_price:x.high,
     low_price:x.low,close_price:x.close,volume_shares:x.volumeShares,
     trade_value:x.tradeValue,transactions:x.transactions,
     observed_at:"2026-10-09T04:00:00Z",
     available_at:"2026-10-09T04:00:00Z",
     availability_basis:"PROSPECTIVE_OBSERVATION",
     pit_replay_eligible:1,continuity_state:"UNVERIFIED",bar_hash:"a".repeat(64),
    });
    const first=toDb(original);
    if(symbol===mismatchSymbol)first.close_price=-1;
    return {results:symbol===revisionsSymbol?[first,{...first,bar_hash:"b".repeat(64)}]:[first]};
   }};
  }};
 };
 return {database:{name:wrongDatabase?"V7_DB":"system2-research"},
  metrics,prepare};
}
let d=buildDb();
let stages=[];
const pass=await audit({db:d,evidence:frozen,fetchDate,onStage:x=>stages.push(x)});
assert.equal(pass.result,"PASS_36_OF_36_SAMPLED_HOT_D1_BARS_SOURCE_MATCHED_ONLY");
assert.equal(pass.sourceReceiptCount,12);
assert.equal(pass.sampleCount,36);
assert.equal(pass.matchedSamples,36);
assert.equal(d.metrics.requestCount,36);
assert.equal(pass.observedD1Metrics.rowsWritten,0);
assert.equal(pass.fullSixDateOctoberHotD1Certified,false);
assert.equal(pass.historicalPITFirstKnownAtCertified,false);
assert.equal(stages.filter(x=>x.stage==="SAMPLE_OBSERVED").length,36);
for(const [args,expected] of [
 [{missingSymbol:"1000"},"HOT_D1_ROW_ABSENT"],
 [{mismatchSymbol:"1000"},"D1_RAW_OHLC_VOLUME_MISMATCH"],
 [{revisionsSymbol:"1000"},"D1_RAW_MULTI_VERSION_UNRESOLVED"],
]){
 const outcome=await audit({db:buildDb(args),evidence:frozen,fetchDate});
 assert.equal(outcome.result,"BLOCKED_SAMPLED_HOT_D1_PHYSICAL_GAPS_OR_MISMATCHES");
 assert.ok(outcome.categoryCounts[expected]>0);
 assert.equal(outcome.fullMarketD1CoverageCertified,false);
}
const altered={...frozen,officialWindow:{...frozen.officialWindow,
 samples:frozen.officialWindow.samples.slice(1)}};
await assert.rejects(()=>audit({db:buildDb(),evidence:altered,fetchDate}),/exact 12/);
await assert.rejects(()=>audit({db:buildDb({wrongDatabase:true}),
 evidence:frozen,fetchDate}),/only isolated System2 D1/);
await assert.rejects(()=>audit({db:buildDb({writeCount:1}),
 evidence:frozen,fetchDate}),/pre-existing D1 writes prohibited/);
const driftDb=buildDb();
await assert.rejects(()=>audit({db:driftDb,evidence:frozen,
 fetchDate:async p=>({...await fetchDate(p),rows:(await fetchDate(p)).rows.map((x,i)=>i===0?
  {...x,close:x.close+5}:x)})}),/SOURCE_HASH_CHANGED/);
assert.equal(driftDb.metrics.requestCount,0,
 "Must fail source revalidation before any D1 indexed query");
await assert.rejects(()=>audit({db:buildDb(),evidence:frozen,
 fetchDate:async p=>({...await fetchDate(p),
  transportMode:"LEGACY_JSON_FALLBACK"})}),/legacy source prohibited/);
await assert.rejects(()=>audit({db:buildDb({rowsReadPerCall:35001}),
 evidence:frozen,fetchDate}),/D1_READ_BUDGET_CAP_EXCEEDED/);

// The final one of 36 indexed reads must obey the same read quota cap.
await assert.rejects(()=>audit({db:buildDb({rowsReadPerCall:1000}),
 evidence:frozen,fetchDate}),/D1_READ_BUDGET_CAP_EXCEEDED/);

const workflow=await readFile(new URL(
 "../../.github/workflows/system2-oct08-hot-d1-source-matched-manual-readonly.yml",
 import.meta.url),"utf8");
const runner=await readFile(new URL(
 "../scripts/audit_oct08_hot_d1_source_matched_sample_readonly_v0_1.mjs",import.meta.url),"utf8");
assert.match(workflow,/workflow_dispatch:/);
assert.doesNotMatch(workflow,/^\s*push:|^\s*schedule:|^\s*workflow_run:/m);
assert.match(workflow,/group: system2-isolated-d1-writer/);
assert.match(workflow,/d1_read_budget_confirmed/);
assert.match(workflow,/no_competing_writer/);
assert.doesNotMatch(workflow,/R2_ACCESS_KEY|R2_SECRET|wrangler.*deploy/);
assert.match(runner,/REMEDIATION_D1_READ_BUDGET_NOT_CONFIRMED/);
assert.match(runner,/BLOCKED_FAIL_CLOSED/);
assert.doesNotMatch(runner,/\.batch\s*\(|\.run\s*\(|\.putIfAbsent\s*\(/);
console.log("System2 Oct08 six-day source-matched Hot D1 36 indexed samples: positive and 9 falsification guards PASS");
