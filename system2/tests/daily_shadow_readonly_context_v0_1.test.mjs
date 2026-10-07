import assert from "node:assert/strict";
import { buildDailyShadowReadonlyContextV0_1 } from "../runtime/daily_shadow_readonly_context_v0_1.mjs";

const marketDate="2026-10-07";
const decisionTimestamp="2026-10-07T07:30:00.000Z";
let historyCalls=0;
let lifecycleCalls=0;

const snapshotBatch={
  state:"READY",
  pointInTimeEligible:true,
  marketDate,
  decisionTimestamp,
  ordinarySymbolCount:2,
  symbols:["1101","1213"],
  bySymbol:{
    "1101":{symbol:"1101",market:"TWSE"},
    "1213":{symbol:"1213",market:"TWSE"},
  },
  blockerCodes:[],
};

const a1={
  state:"READY",
  marketDate,
  decisionTimestamp,
  decisionClockMode:"FIXED_CALLER_CLOCK",
  observedAt:"2026-10-07T07:29:00.000Z",
  snapshotBatch,
  listingMetadata:{
    state:"READY",
    byMarketSymbol:{
      "TWSE|1101":{listingDate:"1962-02-09"},
      "TWSE|1213":{listingDate:"1991-12-05"},
    },
  },
};

function historyResult(withLifecycle=false){
  historyCalls+=1;
  const diag1101={
    symbol:"1101",market:"TWSE",
    selectedDateCount:60,
    requiredPriorSessionsForSymbol:60,
    missingExpectedSessionCount:withLifecycle?0:1,
    unexpectedSessionCount:0,
    sessionReconciliationState:"EXACT_EXPECTED_SESSION_SET_AVAILABLE",
    evaluationInputReady:false,
    historyReady:withLifecycle,
    continuityReady:false,
    blockerCodes:withLifecycle
      ? ["SYMBOL_LOCAL_CONTINUITY_NOT_VERIFIED"]
      : ["SYMBOL_LOCAL_EXPECTED_SESSION_MISSING","INSUFFICIENT_PIT_HISTORY"],
    denominatorAccounted:true,
  };
  const diag1213={
    symbol:"1213",market:"TWSE",
    selectedDateCount:50,
    requiredPriorSessionsForSymbol:60,
    missingExpectedSessionCount:10,
    unexpectedSessionCount:0,
    sessionReconciliationState:"EXACT_EXPECTED_SESSION_SET_AVAILABLE",
    evaluationInputReady:false,
    historyReady:false,
    continuityReady:false,
    blockerCodes:["SYMBOL_LOCAL_EXPECTED_SESSION_MISSING","INSUFFICIENT_PIT_HISTORY"],
    denominatorAccounted:true,
  };
  return {
    version:"0.4-RESEARCH",
    state:"HISTORY_COVERAGE_INCOMPLETE",
    marketDate,
    decisionTimestamp,
    currentUniverseCount:2,
    accountedSymbolCount:2,
    accountingComplete:true,
    globalIntegrityState:"READY",
    globalBlockerCodes:[],
    historyReadyCount:withLifecycle?1:0,
    continuityReadyCount:0,
    symbolLocalIncompleteCount:2,
    ambiguousSymbolCount:0,
    historyCoverage:withLifecycle?0.5:0,
    continuityCoverage:0,
    selectionDenominatorComplete:false,
    diagnostics:[diag1101,diag1213],
    readOnly:true,
    externalMutationPerformed:false,
  };
}

const fakeDb={prepare(){ return {}; }};
const context=await buildDailyShadowReadonlyContextV0_1({
  db:fakeDb,
  marketDate,
  decisionTimestamp,
  now:()=>new Date("2026-10-07T07:31:00.000Z"),
  sourceFetch:async()=>a1,
  tradingDateResolver:async()=>({
    state:"READY",
    tradingDates:Array.from({length:80},(_,i)=>{
      const d=new Date("2026-06-01T00:00:00Z");
      d.setUTCDate(d.getUTCDate()+i);
      return d.toISOString().slice(0,10);
    }).filter((d)=>d<marketDate),
    sourceReceiptHash:"a".repeat(64),
  }),
  historyProbe:async({certifiedNoTradingIntervals})=>
    historyResult(Array.isArray(certifiedNoTradingIntervals)&&certifiedNoTradingIntervals.length>0),
  lifecycleFetch:async({symbols})=>{
    lifecycleCalls+=1;
    assert.deepEqual(symbols,["1101"]);
    return {
      state:"READY",
      queriedSymbolCount:1,
      intervalCount:1,
      eventCount:1,
      partialSymbolCount:0,
      intervals:[{
        market:"TWSE",
        symbol:"1101",
        suspendedFrom:"2026-08-10",
        resumedOn:"2026-08-11",
        coverageTo:"2026-10-06",
        sourceRowHash:"LIFE-1101",
      }],
      conflicts:[],
      symbolReceipts:[],
      knownAtState:"HISTORICAL_SOURCE_DATE_ONLY_LAYER_C_NOT_PROVEN",
    };
  },
});

assert.equal(context.schemaVersion,"S2_DAILY_SHADOW_READONLY_CONTEXT_V0_1");
assert.equal(context.readOnly,true);
assert.equal(context.externalMutationPerformed,false);
assert.equal(context.a1.state,"READY");
assert.equal(context.historyCoverage.globalIntegrityState,"READY");
assert.equal(context.historyCoverage.historyReadyCount,1);
assert.equal(context.historyCoverage.continuityReadyCount,0);
assert.equal(context.preflight.state,"READY_FOR_AUTHORIZED_SHADOW_EVALUATION_WITH_SYMBOL_GAPS");
assert.equal(context.preflight.zeroPickMayBeClaimed,false);
assert.equal(context.lifecycle.state,"READY");
assert.deepEqual(context.lifecycle.candidateSymbols,["1101"]);
assert.equal(historyCalls,2);
assert.equal(lifecycleCalls,1);

const noA1=await buildDailyShadowReadonlyContextV0_1({
  db:fakeDb,
  marketDate,
  sourceFetch:async()=>({
    state:"SOURCE_ERROR",
    marketDate,
    decisionTimestamp,
    decisionClockMode:"FIXED_CALLER_CLOCK",
    observedAt:"2026-10-07T07:29:00.000Z",
    snapshotBatch:null,
    listingMetadata:{state:"SOURCE_ERROR",byMarketSymbol:{}},
  }),
  historyProbe:async()=>{throw new Error("must not run");},
  tradingDateResolver:async()=>{throw new Error("must not run");},
  lifecycleFetch:async()=>{throw new Error("must not run");},
});
assert.equal(noA1.historyCoverage.globalIntegrityState,"BLOCKED");
assert.equal(noA1.preflight.state,"INPUTS_NOT_READY");
assert.equal(noA1.readOnly,true);

console.log("System2 Daily Shadow read-only context v0.1 tests passed");
