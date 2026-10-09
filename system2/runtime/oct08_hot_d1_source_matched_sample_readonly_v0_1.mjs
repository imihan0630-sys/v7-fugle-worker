import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {fetchOfficialHistoricalA1DateV0_1} from "./official_historical_a1_source_v0_1.mjs";

const dates=Object.freeze(["2026-10-01","2026-10-02","2026-10-05",
 "2026-10-06","2026-10-07","2026-10-08"]);
const markets=Object.freeze(["TWSE","TPEX"]);
const storedCols=[
 "market","symbol","market_date","price_space","open_price","high_price","low_price",
 "close_price","volume_shares","trade_value","transactions","available_at",
 "observed_at","availability_basis","pit_replay_eligible","continuity_state","bar_hash",
];
const sql="SELECT "+storedCols.join(", ")+" FROM s2_historical_a1_bars "+
 "WHERE symbol = ? AND market_date = ? AND market = ? ORDER BY bar_hash LIMIT 10";
const sha256=v=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const barTuple=v=>[v.symbol,v.open,v.high,v.low,v.close,v.volumeShares,v.tradeValue,v.transactions];
function normalizedHash(rows){
 return sha256(rows.map(barTuple).sort((a,b)=>a[0].localeCompare(b[0])));
}
function assertSourceFreeze(evidence){
 assert.equal(evidence?.schemaVersion,
  "S2_20261008_LATEST_COMPLETED_SOURCE_RECEIPTS_PHYSICAL_ACCEPTANCE_V0_1");
 assert.equal(evidence?.verifiedRun?.runId,37878847039);
 assert.equal(evidence?.verifiedRun?.conclusion,"success");
 assert.equal(evidence?.verifiedRun?.headSha,"39ca8dce38fa675874074609fb32d9c44321e944");
 assert.equal(evidence?.cutoff,"2026-10-08");
 assert.equal(evidence?.officialWindow?.marketDateReceiptCount,12);
 assert.deepEqual(evidence?.officialWindow?.dates,dates);
 const entries=evidence?.officialWindow?.samples;
 assert.ok(Array.isArray(entries)&&entries.length===12,"exact 12 frozen official receipts required");
 const keyed=new Map();
 for(const x of entries){
  assert.ok(markets.includes(x.market)&&dates.includes(x.marketDate));
  const k=x.market+"|"+x.marketDate;
  assert.ok(!keyed.has(k),"duplicate frozen source identity");
  assert.match(x.normalizedBarSha256,/^[a-f0-9]{64}$/);
  assert.ok(Number.isInteger(x.ordinarySymbolCount)&&x.ordinarySymbolCount>=700);
  assert.equal(x.sourceTransport,"PRIMARY");
  keyed.set(k,x);
 }
 assert.equal(keyed.size,12);
 return keyed;
}
const equalNumeric=(a,b)=>a===null||a===undefined
 ? b===null||b===undefined
 : b!==null&&b!==undefined&&Number.isFinite(Number(a))&&Number.isFinite(Number(b))
  && Math.abs(Number(a)-Number(b))<=0.00001;
function classifyOne(row,original){
 if(!row.length)return "HOT_D1_ROW_ABSENT";
 if(row.length===10)return "REVISION_LIMIT_10_POSSIBLE";
 const raw=row.filter(x=>x.price_space==="RAW");
 if(!raw.length)return "HOT_D1_RAW_SPACE_ABSENT";
 if(raw.length>1)return "D1_RAW_MULTI_VERSION_UNRESOLVED";
 const stored=raw[0];
 const names=["open","high","low","close","volumeShares","tradeValue","transactions"];
 const cols=["open_price","high_price","low_price","close_price","volume_shares",
  "trade_value","transactions"];
 if(names.some((k,i)=>!equalNumeric(original[k],stored[cols[i]])))
  return "D1_RAW_OHLC_VOLUME_MISMATCH";
 return "HOT_D1_RAW_BAR_MATCHED_AT_CURRENT_OBSERVATION";
}
export async function auditOct08HotD1BoundedSourceMatchedReadV0_1({
 db,evidence,fetchDate=fetchOfficialHistoricalA1DateV0_1,
 onStage=()=>{},maxD1RowsRead=35000,
}={}){
 assert.equal(db?.database?.name,"system2-research","only isolated System2 D1");
 assert.equal(db?.metrics?.rowsWritten,0,"pre-existing D1 writes prohibited");
 assert.ok(typeof db?.prepare==="function");
 assert.equal(typeof fetchDate,"function");
 assert.equal(typeof onStage,"function");
 assert.ok(Number.isInteger(maxD1RowsRead)&&maxD1RowsRead>0&&maxD1RowsRead<=35000);
 const freeze=assertSourceFreeze(evidence);
 const verified=[];
 // Stage 1: validate ALL 12 official snapshots first. Source drift cannot be
 // hidden by sampling or misreported as missing D1, and consumes no D1 SQL.
 for(const marketDate of dates){
  for(const market of markets){
   await onStage({stage:"FROZEN_OFFICIAL_REVALIDATION",market,marketDate});
   const raw=await fetchDate({market,marketDate,observedAt:()=>new Date().toISOString()});
   assert.equal(raw?.state,"READY","source not READY "+market+" "+marketDate);
   assert.equal(raw?.sourceDateEvidence,marketDate,"official source date mismatch");
   assert.equal(raw?.marketDate,marketDate);
   assert.equal(raw?.market,market);
   assert.equal(raw?.transportMode,"PRIMARY","legacy source prohibited");
   const expected=freeze.get(market+"|"+marketDate);
   assert.equal(raw?.ordinarySymbolCount,expected.ordinarySymbolCount,
    "SOURCE_ROWSET_CHANGED_SINCE_OCT08_FROZEN_PROOF");
   assert.equal(normalizedHash(raw.rows),expected.normalizedBarSha256,
    "SOURCE_HASH_CHANGED_SINCE_OCT08_FROZEN_PROOF");
   assert.equal(raw.rows.length,expected.ordinarySymbolCount);
   const sorted=[...raw.rows].sort((a,b)=>a.symbol.localeCompare(b.symbol));
   assert.ok(sorted.length>=3);
   const picks=[sorted[0],sorted[Math.floor(sorted.length/2)],sorted.at(-1)];
   assert.equal(new Set(picks.map(x=>x.symbol)).size,3);
   verified.push({market,marketDate,expectedSourceRows:expected.ordinarySymbolCount,
    sourceFullRowsetHash:expected.normalizedBarSha256,picks});
   await onStage({stage:"FROZEN_OFFICIAL_MATCH",market,marketDate,
    sourceCount:raw.ordinarySymbolCount});
  }
 }
 assert.equal(verified.length,12);
 const ro={
  prepare(query){
   assert.equal(query,sql,"only bounded symbol + exact date indexed SELECT permitted");
   const statement=db.prepare(query);
   return {
    bind(...args){
     assert.equal(args.length,3);
     assert.match(String(args[0]),/^[1-9][0-9]{3}$/);
     assert.ok(dates.includes(args[1])&&markets.includes(args[2]));
     const bound=statement.bind(...args);
     return {all:()=>bound.all()};
    },
   };
  },
  batch(){throw Error("D1 mutation prohibited");},
  rawQuery(){throw Error("D1 unrestricted query prohibited");},
 };
 const checks=[];
 for(const item of verified){
  for(const original of item.picks){
   assert.ok(Number.isSafeInteger(db.metrics.rowsRead)&&db.metrics.rowsRead>=0,
    "D1_ROWS_READ_METRICS_UNKNOWN_FAIL_CLOSED");
   assert.ok(db.metrics.rowsRead<=maxD1RowsRead,
    "D1_READ_BUDGET_CAP_EXCEEDED");
   await onStage({stage:"HOT_D1_BOUNDED_SAMPLE",market:item.market,
    marketDate:item.marketDate,symbol:original.symbol});
   const resp=await ro.prepare(sql)
    .bind(original.symbol,item.marketDate,item.market).all();
   const records=resp?.results;
   assert.ok(Array.isArray(records)&&records.length<=10,"bounded D1 response invalid");
   for(const r of records){
    assert.equal(r.market,item.market);
    assert.equal(r.market_date,item.marketDate);
    assert.equal(r.symbol,original.symbol);
   }
   const classification=classifyOne(records,original);
   const current=records.filter(x=>x.price_space==="RAW");
   const check=Object.freeze({
    market:item.market,marketDate:item.marketDate,symbol:original.symbol,
    state:classification,matchingRawCount:current.length,
    d1ObservedAt:current.length===1?current[0].observed_at:null,
    d1AvailableAt:current.length===1?current[0].available_at:null,
    d1AvailabilityBasis:current.length===1?current[0].availability_basis:null,
    d1PitEligibleFlag:current.length===1?Number(current[0].pit_replay_eligible)===1:null,
    d1ContinuityState:current.length===1?current[0].continuity_state:null,
    historicalFirstKnownAtCertified:false,
   });
   checks.push(check);
   await onStage({stage:"SAMPLE_OBSERVED",...check});
   assert.equal(db.metrics.rowsWritten,0,"D1 write occurred during read-only sample");
  }
 }
 assert.equal(checks.length,36);
 assert.ok(Number.isSafeInteger(db.metrics.rowsRead)&&db.metrics.rowsRead>=0,
  "D1_ROWS_READ_METRICS_UNKNOWN_FAIL_CLOSED");
 assert.ok(db.metrics.rowsRead<=maxD1RowsRead,
  "D1_READ_BUDGET_CAP_EXCEEDED");
 const counts=Object.fromEntries([...new Set(checks.map(x=>x.state))]
  .map(state=>[state,checks.filter(x=>x.state===state).length]));
 const matched=checks.filter(x=>x.state==="HOT_D1_RAW_BAR_MATCHED_AT_CURRENT_OBSERVATION").length;
 return Object.freeze({
  schemaVersion:"S2_OCT08_HOT_D1_SOURCE_MATCHED_SAMPLE_READONLY_V0_1",
  result:matched===36?"PASS_36_OF_36_SAMPLED_HOT_D1_BARS_SOURCE_MATCHED_ONLY":
   "BLOCKED_SAMPLED_HOT_D1_PHYSICAL_GAPS_OR_MISMATCHES",
  latestMarketDate:"2026-10-08",sourceReceiptCount:verified.length,
  sampleCount:checks.length,matchedSamples:matched,categoryCounts:counts,
  samples:Object.freeze(checks),observedD1Metrics:Object.freeze({
    requestCount:db.metrics.requestCount,rowsRead:db.metrics.rowsRead,
    rowsWritten:db.metrics.rowsWritten,
  }),
  fullMarketD1CoverageCertified:false,fullSixDateOctoberHotD1Certified:false,
  historicalPITFirstKnownAtCertified:false,technicalContinuityCertified:false,
  sourceMatchedAtRetrospectiveAuditOnly:true,system2LiveSelectionAuthorized:false,
  sourceObservationsAreNotFrozenHistoricDecisionCuts:true,
  d1RowsWritten:0,r2ObjectsWritten:0,system1RuntimeUsed:false,
 });
}
