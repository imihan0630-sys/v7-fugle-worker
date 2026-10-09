// DATA_LANE Class A: exact frozen October source symbol/date -> Hot D1 raw-key census.
// This is a missing-key/source-value audit, NOT an extras/revisions/PIT/continuity attestation.
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {fetchOfficialHistoricalA1DateV0_1} from "./official_historical_a1_source_v0_1.mjs";

const dates=Object.freeze(["2026-10-01","2026-10-02","2026-10-05",
 "2026-10-06","2026-10-07","2026-10-08"]);
const markets=Object.freeze(["TWSE","TPEX"]);
const sha256=rows=>createHash("sha256").update(JSON.stringify(
 rows.map(r=>[r.symbol,r.open,r.high,r.low,r.close,r.volumeShares,r.tradeValue,r.transactions])
  .sort((a,b)=>a[0].localeCompare(b[0])))).digest("hex");
const sqlFor=n=>"SELECT market,market_date,symbol,price_space,open_price,high_price,low_price,"+
 "close_price,volume_shares,trade_value,transactions,observed_at,available_at,"+
 "availability_basis,pit_replay_eligible,continuity_state,bar_hash "+
 "FROM s2_historical_a1_bars WHERE symbol IN ("+Array(n).fill("?").join(",")+
 ") AND market_date=? AND market=? AND price_space='RAW' LIMIT 151";
const numericEq=(v,w)=>v===null||v===undefined
 ? w===null||w===undefined
 : w!==null&&w!==undefined&&Number.isFinite(Number(v))&&Number.isFinite(Number(w))
  && Math.abs(Number(v)-Number(w))<=0.00001;

export function validateOct08FrozenSourceEvidenceV0_1(evidence){
 assert.equal(evidence?.schemaVersion,
  "S2_20261008_LATEST_COMPLETED_SOURCE_RECEIPTS_PHYSICAL_ACCEPTANCE_V0_1");
 assert.equal(evidence?.verifiedRun?.runId,37878847039);
 assert.equal(evidence?.verifiedRun?.conclusion,"success");
 assert.equal(evidence?.verifiedRun?.headSha,"39ca8dce38fa675874074609fb32d9c44321e944");
 assert.deepEqual(evidence?.officialWindow?.dates,dates);
 assert.equal(evidence?.officialWindow?.marketDateReceiptCount,12);
 const given=evidence?.officialWindow?.samples;
 assert.ok(Array.isArray(given)&&given.length===12);
 const byKey=new Map();
 for(const row of given){
  assert.ok(markets.includes(row.market)&&dates.includes(row.marketDate));
  assert.equal(row.sourceTransport,"PRIMARY");
  assert.match(row.normalizedBarSha256,/^[a-f0-9]{64}$/);
  assert.ok(Number.isInteger(row.ordinarySymbolCount)&&row.ordinarySymbolCount>=700);
  const key=row.market+"|"+row.marketDate;
  assert.ok(!byKey.has(key),"duplicate source receipt");
  byKey.set(key,row);
 }
 assert.equal(byKey.size,12);
 return byKey;
}

export async function auditOct08FullSourceKeysHotD1ReadonlyV0_1({
 db,evidence,fetchDate=fetchOfficialHistoricalA1DateV0_1,
 onStage=()=>{},chunkSize=50,maxRowsRead=150000,
}={}){
 assert.equal(db?.database?.name,"system2-research","isolated System2 database required");
 assert.equal(db?.metrics?.rowsWritten,0,"D1 writes already recorded");
 assert.equal(typeof db?.prepare,"function");
 assert.equal(typeof fetchDate,"function");
 assert.equal(typeof onStage,"function");
 assert.ok(Number.isInteger(chunkSize)&&chunkSize>=10&&chunkSize<=50);
 assert.ok(Number.isInteger(maxRowsRead)&&maxRowsRead>=1000&&maxRowsRead<=150000);
 const frozen=validateOct08FrozenSourceEvidenceV0_1(evidence);
 const matchedSource=[];
 let totalExpected=0;
 // All source rowsets must exactly match original immutable Oct08 proof BEFORE D1.
 for(const marketDate of dates)for(const market of markets){
  await onStage({stage:"FULL_FROZEN_OFFICIAL_SOURCE_REVALIDATION",market,marketDate});
  const receipt=await fetchDate({market,marketDate,
   observedAt:()=>new Date().toISOString()});
  assert.equal(receipt?.state,"READY","canonical daily source not ready");
  assert.equal(receipt?.marketDate,marketDate,"canonical source date mismatch");
  assert.equal(receipt?.sourceDateEvidence,marketDate,"canonical payload date mismatch");
  assert.equal(receipt?.market,market);
  assert.equal(receipt?.transportMode,"PRIMARY","legacy source not equivalent");
  const expected=frozen.get(market+"|"+marketDate);
  assert.equal(receipt?.ordinarySymbolCount,expected.ordinarySymbolCount,
   "FULL_SOURCE_COUNT_CHANGED_FROM_FROZEN");
  assert.equal(receipt.rows?.length,expected.ordinarySymbolCount);
  assert.equal(sha256(receipt.rows),expected.normalizedBarSha256,
   "FULL_SOURCE_HASH_CHANGED_FROM_FROZEN");
  const unique=new Set(receipt.rows.map(r=>r.symbol));
  assert.equal(unique.size,receipt.rows.length,"source contains duplicate symbols");
  const sorted=[...receipt.rows].sort((a,b)=>a.symbol.localeCompare(b.symbol));
  matchedSource.push({market,marketDate,rows:sorted,
   frozenHash:expected.normalizedBarSha256,expected:sorted.length});
  totalExpected+=sorted.length;
  await onStage({stage:"FROZEN_SOURCE_VERIFIED",market,marketDate,
   sourceRowCount:sorted.length});
 }
 assert.equal(matchedSource.length,12);
 assert.equal(totalExpected,11843,"frozen official October 6-session rowset expectation drift");
 // Bind the census to twelve exact official rowset hashes, not a count-only
 // sourceReceiptsMatched flag that a downstream planner cannot verify.
 const sourceRevalidationReceipts=Object.freeze(matchedSource.map(x=>
  Object.freeze({market:x.market,marketDate:x.marketDate,
   ordinarySymbolCount:x.expected,normalizedBarSha256:x.frozenHash})));
 const sourceRevalidationDigest=createHash("sha256").update(
  JSON.stringify(sourceRevalidationReceipts)).digest("hex");
 const details=[],metrics={matched:0,missing:0,mismatched:0,multi:0};
 let queryCount=0,lastCertifiedRowsRead=null;
 for(const source of matchedSource){
  const rowSet=source.rows;
  const marketCount={market:source.market,marketDate:source.marketDate,
   sourceCount:rowSet.length,matched:0,missing:0,mismatched:0,multi:0,
   d1ReadRequests:0};
  for(let i=0;i<rowSet.length;i+=chunkSize){
   assert.ok(Number.isSafeInteger(db.metrics.rowsRead)&&db.metrics.rowsRead>=0,
    "D1_ROWS_READ_METRICS_UNKNOWN_FAIL_CLOSED");
   assert.ok(db.metrics.rowsRead<=maxRowsRead,
    "D1_READ_BUDGET_HARD_CAP_BEFORE_QUERY");
   assert.ok(lastCertifiedRowsRead===null||db.metrics.rowsRead>=lastCertifiedRowsRead,
    "D1_ROWS_READ_COUNTER_REGRESSED_FAIL_CLOSED");
   const beforeRowsRead=db.metrics.rowsRead;
   const batch=rowSet.slice(i,i+chunkSize);
   const symbols=batch.map(r=>r.symbol);
   assert.equal(new Set(symbols).size,batch.length);
   const query=sqlFor(batch.length);
   assert.match(query,/^SELECT\b/);
   assert.match(query,/WHERE symbol IN \(/);
   const block=await db.prepare(query).bind(...symbols,source.marketDate,source.market).all();
   const d1Rows=block?.results;
   assert.ok(Array.isArray(d1Rows)&&d1Rows.length<=151,"bounded source batch D1 response invalid");
   // A full LIMIT 151 result might hide additional RAW versions and requested
   // symbols. Classifying such omitted keys as absent would be unsafe.
   assert.ok(d1Rows.length<151,
    "HOT_D1_QUERY_RESULT_TRUNCATED_UNSAFE_FOR_ABSENCE_CLASSIFICATION");
   assert.ok(Number.isSafeInteger(db.metrics.rowsRead)&&db.metrics.rowsRead>=0,
    "D1_ROWS_READ_METRICS_UNKNOWN_FAIL_CLOSED");
   assert.ok(db.metrics.rowsRead<=maxRowsRead,
    "D1_READ_BUDGET_HARD_CAP_AFTER_QUERY");
   assert.ok(db.metrics.rowsRead>=beforeRowsRead,
    "D1_ROWS_READ_COUNTER_REGRESSED_FAIL_CLOSED");
   lastCertifiedRowsRead=db.metrics.rowsRead;
   assert.equal(db.metrics.rowsWritten,0,"D1 unexpected mutation");
   const whitelisted=new Set(symbols),seen=new Map();
   for(const r of d1Rows){
    assert.equal(r.market,source.market);
    assert.equal(r.market_date,source.marketDate);
    assert.equal(r.price_space,"RAW");
    assert.ok(whitelisted.has(r.symbol),"D1 returned unrequested key");
    if(!seen.has(r.symbol))seen.set(r.symbol,[]);
    seen.get(r.symbol).push(r);
   }
   for(const official of batch){
    const rows=seen.get(official.symbol)||[];
    const state=rows.length===0?"HOT_D1_KEY_ABSENT":
     rows.length>1?"HOT_D1_RAW_MULTIVERSION":
      (["open","high","low","close","volumeShares","tradeValue","transactions"]
       .every((k,j)=>numericEq(official[k],rows[0][
        ["open_price","high_price","low_price","close_price",
         "volume_shares","trade_value","transactions"][j]])))
       ?"SOURCE_VALUES_MATCH_AT_AUDIT_TIME":"HOT_D1_SOURCE_VALUES_MISMATCH";
    const prop=state==="HOT_D1_KEY_ABSENT"?"missing":
     state==="HOT_D1_RAW_MULTIVERSION"?"multi":
     state==="HOT_D1_SOURCE_VALUES_MISMATCH"?"mismatched":"matched";
    marketCount[prop]++;
    metrics[prop]++;
    if(state!=="SOURCE_VALUES_MATCH_AT_AUDIT_TIME"){
     // Each discrepancy can be used for future budgeted, idempotent repair
     // planning. Never backdate original PIT proof or mutate on read.
     details.push(Object.freeze({
      market:source.market,marketDate:source.marketDate,symbol:official.symbol,
      state,seenRawVersions:rows.length,
      originalPITAvailabilityUnproven:true,
     }));
    }
   }
   queryCount++;
   marketCount.d1ReadRequests++;
   await onStage({stage:"D1_CHUNK_CHECKED",market:source.market,
    marketDate:source.marketDate,scanned:i+batch.length,
    total:source.rows.length,missing:marketCount.missing,
    mismatched:marketCount.mismatched,multi:marketCount.multi});
  }
  assert.equal(marketCount.matched+marketCount.missing+
   marketCount.mismatched+marketCount.multi,marketCount.sourceCount);
  details.push(Object.freeze({stage:"DATE_TOTALS",...marketCount}));
 }
 assert.equal(queryCount,matchedSource.reduce((n,x)=>n+Math.ceil(x.rows.length/chunkSize),0),
  "D1 chunk count unexpectedly changed");
 assert.ok(queryCount<=1200,"D1 request upper bound exceeded");
 assert.equal(Object.values(metrics).reduce((a,b)=>a+b,0),totalExpected);
 const allValuesMatch=metrics.matched===totalExpected;
 return Object.freeze({
  schemaVersion:"S2_OCT08_FULL_FROZEN_SOURCE_TO_HOT_D1_KEYS_READONLY_V0_1",
  result:allValuesMatch?"PASS_ALL_11843_SOURCE_KEYS_MATCH_D1_VALUES_ONLY":
   "BLOCKED_OCT08_MISSING_MISMATCHED_OR_MULTIVERSION_D1_KEYS",
  marketDateCutoff:"2026-10-08",sourceReceiptsMatched:12,
  sourceRevalidationReceipts,sourceRevalidationDigest,
  exactTradingDates:Object.freeze([...dates]),sourceSymbolDayKeys:totalExpected,
  selectedD1ChunkSize:chunkSize,actualD1Queries:queryCount,
  counts:Object.freeze(metrics),
  discrepancies:Object.freeze(details),
  observedD1:{requests:db.metrics.requestCount,rowsRead:db.metrics.rowsRead,
   rowsWritten:db.metrics.rowsWritten},
  d1MissingUnrequestedExtraRecordsNotProvenAbsent:true,
  historicOriginalFirstKnownAtCertified:false,
  historicPITReplayAuthorized:false,
  corporateActionNoEventCertified:false,nct01ContinuityCertified:false,
  marketYear2026FullPass:false,liveSystem2SelectionAuthorized:false,
  d1Writes:0,r2Reads:0,r2Writes:0,system1RuntimeUsed:false,
 });
}
