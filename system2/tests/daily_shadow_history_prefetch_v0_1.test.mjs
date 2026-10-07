import assert from "node:assert/strict";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import {
  prefetchDailyShadowPitHistoryV0_1,
  dailyShadowPitPrefetchSqlV0_1,
} from "../runtime/daily_shadow_history_prefetch_v0_1.mjs";

const marketDate="2026-10-07";
const decisionTimestamp="2026-10-07T07:30:00Z";
const dates=["2026-10-02","2026-10-03","2026-10-06"];
const symbols=["1101","1213","2330"];

function row(symbol,date,index,barHashSuffix="A"){
  return {
    bar_id:"BAR-"+symbol+"-"+date+"-"+barHashSuffix,
    canonical_key:["TWSE",symbol,date,"RAW"].join("|"),
    market_date:date,
    market:"TWSE",
    symbol,
    company_name:"fixture-"+symbol,
    price_space:"RAW",
    open_price:100+index,
    high_price:102+index,
    low_price:99+index,
    close_price:101+index,
    volume_shares:1000000+index,
    trade_value:101000000+index,
    transactions:1000+index,
    change_value:1,
    continuity_state:"UNVERIFIED",
    source_id:"TWSE_FIXTURE",
    source_name:"fixture",
    source_url:null,
    source_row_hash:"SRC-"+symbol+"-"+date+"-"+barHashSuffix,
    observed_at:date+"T05:35:00Z",
    available_at:date+"T05:30:00Z",
    pit_availability_class:"PROSPECTIVE_OBSERVED",
    pit_replay_eligible:1,
    captured_at:date+"T05:36:00Z",
    bar_hash:"HASH-"+symbol+"-"+date+"-"+barHashSuffix,
    schema_version:"S2_HISTORICAL_A1_BAR_V0_1",
  };
}

const bySymbol=Object.fromEntries(symbols.map((symbol)=>[
  symbol,
  dates.slice().reverse().map((date,index)=>row(symbol,date,index)),
]));

function fakeDb(source=bySymbol){
  const metrics={batchCalls:0,statements:0};
  return {
    metrics,
    prepare(sql){
      assert.equal(sql,dailyShadowPitPrefetchSqlV0_1());
      return {
        bind(...params){
          return {__statement:true,params};
        },
      };
    },
    async batch(statements){
      metrics.batchCalls+=1;
      metrics.statements+=statements.length;
      return statements.map((statement)=>{
        const [symbol,market,date,priceSpace,clock,minDate,,limit]=statement.params;
        assert.equal(market,"TWSE");
        assert.equal(date,marketDate);
        assert.equal(priceSpace,"RAW");
        assert.equal(clock,decisionTimestamp);
        let rows=[...(source[symbol]||[])];
        if(minDate) rows=rows.filter((x)=>x.market_date>=minDate);
        return {success:true,results:rows.slice(0,limit)};
      });
    },
  };
}

const diagnostics=[];
for(const symbol of symbols){
  diagnostics.push({
    symbol,
    market:"TWSE",
    expectedFirstDate:dates[0],
    requiredPriorSessionsForSymbol:3,
    expectedSessionHash:await sha256Hex({
      market:"TWSE",
      symbol,
      marketDate,
      dates,
    }),
  });
}
const historyCoverage={diagnostics};
const snapshotBatch={
  marketDate,
  symbols,
  bySymbol:Object.fromEntries(symbols.map((symbol)=>[
    symbol,{symbol,market:"TWSE"},
  ])),
};

const db=fakeDb();
const prefetched=await prefetchDailyShadowPitHistoryV0_1({
  db,
  snapshotBatch,
  decisionTimestamp,
  historyCoverage,
  lookbackSessions:3,
  batchSize:2,
});
assert.equal(prefetched.evidence.requestedSymbolCount,3);
assert.equal(prefetched.evidence.cachedSymbolCount,3);
assert.equal(prefetched.evidence.batchRequestCount,2);
assert.equal(prefetched.evidence.statementCount,3);
assert.equal(prefetched.evidence.maxBatchStatementCount,2);
assert.equal(db.metrics.batchCalls,2);
assert.equal(db.metrics.statements,3);
assert.match(prefetched.evidence.prefetchHash,/^[a-f0-9]{64}$/);
assert.equal(prefetched.evidence.readOnly,true);

const loaded=await prefetched.loadPriorHistoricalBars({
  symbol:"1101",
  market:"TWSE",
  marketDate,
  decisionTimestamp,
  lookbackSessions:3,
  priceSpace:"RAW",
});
assert.deepEqual(loaded.map((x)=>x.marketDate),dates);
assert.equal(loaded[0].sourceId,"TWSE_FIXTURE");
assert.equal(loaded[2].symbol,"1101");

const badCoverage={
  diagnostics:diagnostics.map((row)=>row.symbol==="1101"
    ? {...row,expectedSessionHash:"0".repeat(64)}
    : row),
};
const bad=await prefetchDailyShadowPitHistoryV0_1({
  db:fakeDb(),
  snapshotBatch,
  decisionTimestamp,
  historyCoverage:badCoverage,
  lookbackSessions:3,
  batchSize:3,
});
await assert.rejects(
  ()=>bad.loadPriorHistoricalBars({
    symbol:"1101",
    market:"TWSE",
    marketDate,
    decisionTimestamp,
    lookbackSessions:3,
    priceSpace:"RAW",
  }),
  /EXPECTED_SESSION_HASH_MISMATCH/,
);

const ambiguousSource={
  ...bySymbol,
  "1101":[
    ...bySymbol["1101"],
    {...row("1101","2026-10-06",99,"B"),bar_hash:"DIFFERENT-HASH"},
  ],
};
const ambiguous=await prefetchDailyShadowPitHistoryV0_1({
  db:fakeDb(ambiguousSource),
  snapshotBatch,
  decisionTimestamp,
  historyCoverage,
  lookbackSessions:3,
  batchSize:3,
});
await assert.rejects(
  ()=>ambiguous.loadPriorHistoricalBars({
    symbol:"1101",
    market:"TWSE",
    marketDate,
    decisionTimestamp,
    lookbackSessions:3,
    priceSpace:"RAW",
  }),
  /REVISION_AMBIGUITY/,
);

console.log("System2 Daily Shadow bounded PIT history prefetch v0.1 tests passed");
