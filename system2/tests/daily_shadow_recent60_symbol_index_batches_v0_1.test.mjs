import assert from "node:assert/strict";
import { probePitHistoryCoverageV0_1 } from "../runtime/daily_shadow_history_reader_v0_1.mjs";

// Query-index regression: one global scan is replaced by indexable current-universe
// symbol batches. This is not evidence of real Cloudflare rowsRead savings.
const marketDate="2026-10-08";
const decisionTimestamp="2026-10-08T08:00:00Z";
const dates=Array.from({length:61},(_,i)=>
  new Date(Date.UTC(2026,6,i+1)).toISOString().slice(0,10));
const symbols=Array.from({length:101},(_,i)=>String(1000+i));
const snapshotBatch={
  marketDate,symbols,ordinarySymbolCount:symbols.length,
  bySymbol:Object.fromEntries(symbols.map(symbol=>[symbol,{market:"TWSE"}])),
};
const listingMetadata={
  state:"READY",
  byMarketSymbol:Object.fromEntries(symbols.map(symbol=>
    ["TWSE|"+symbol,{listingDate:"2010-01-01"}])),
};
function fakeDb({failBatch=0}={}){
  const calls=[];
  return {
    calls,
    prepare(sql){
      assert.match(sql,/WITH eligible AS/);
      assert.match(sql,/WHERE symbol IN \(/);
      assert.match(sql,/AND market_date >= \?/);
      assert.match(sql,/pit_replay_eligible = 1/);
      assert.match(sql,/available_at <= \?/);
      assert.match(sql,/ROW_NUMBER\(\) OVER/);
      return {
        bind(...params){
          const matched=sql.match(/symbol IN \(([^)]+)\)/);
          assert.ok(matched);
          const symbolCount=matched[1].split(",").length;
          const chunk=params.slice(0,symbolCount);
          assert.ok(chunk.length<=50&&chunk.length>0);
          assert.equal(new Set(chunk).size,chunk.length);
          assert.ok(chunk.every(s=>symbols.includes(s)));
          assert.deepEqual(params.slice(symbolCount),
            [marketDate,"RAW",decisionTimestamp,dates[0],60]);
          const idx=calls.length+1;
          calls.push({idx,chunk});
          return {
            async all(){
              if(failBatch===idx)throw new Error("D1_READ_QUOTA_EXCEEDED");
              return {results:chunk.map(symbol=>({
                symbol,market:"TWSE",selected_date_count:60,
                ambiguous_date_count:0,continuity_eligible_count:0,
                first_selected_date:dates[1],last_selected_date:dates[60],
                selected_dates_csv:dates.slice(1).join(","),
              }))};
            },
          };
        },
      };
    },
  };
}

const db=fakeDb();
const proof=await probePitHistoryCoverageV0_1({
  db,snapshotBatch,decisionTimestamp,
  priorTradingDates:dates,listingMetadata,requiredPriorSessions:60,
});
assert.deepEqual(db.calls.map(x=>x.chunk.length),[50,50,1]);
assert.equal(proof.coverageSymbolCount,101);
assert.equal(proof.coverageSelectCount,3);
assert.equal(proof.coverageReadPlan,"SYMBOL_INDEX_SCOPED_BOUNDED_50");
assert.equal(proof.accountedSymbolCount,101);
assert.equal(proof.historyReadyCount,101);
assert.equal(proof.continuityReadyCount,0);
assert.equal(proof.selectionDenominatorComplete,false);
assert.ok(proof.diagnostics.every(x=>x.historyReady && !x.continuityReady));

const failing=fakeDb({failBatch:2});
await assert.rejects(
  ()=>probePitHistoryCoverageV0_1({
    db:failing,snapshotBatch,decisionTimestamp,
    priorTradingDates:dates,listingMetadata,requiredPriorSessions:60,
  }),
  /D1_READ_QUOTA_EXCEEDED/,
  "mid-batch D1 failures must not return partial/reclassified coverage");
assert.equal(failing.calls.length,2);

const invalid={
  ...snapshotBatch,
  symbols:[...snapshotBatch.symbols,"DROP TABLE"],
};
await assert.rejects(()=>probePitHistoryCoverageV0_1({
  db:fakeDb(),snapshotBatch:invalid,decisionTimestamp,
  priorTradingDates:dates,listingMetadata,requiredPriorSessions:60,
}),/ordinary 4-digit symbol identities/);

const hugeSymbols=Array.from({length:5001},(_,i)=>String(i+1000));
await assert.rejects(()=>probePitHistoryCoverageV0_1({
  db:fakeDb(),snapshotBatch:{...snapshotBatch,symbols:hugeSymbols},
  decisionTimestamp,priorTradingDates:dates,
  listingMetadata,requiredPriorSessions:60,
}),/unexpected unbounded universe/);

console.log("System2 current-symbol indexed 50-batch PIT coverage guards passed");
