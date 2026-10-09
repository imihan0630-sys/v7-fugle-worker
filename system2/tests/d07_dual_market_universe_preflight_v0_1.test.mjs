import assert from "node:assert/strict";
import { buildA1SymbolSnapshotBatch } from "../runtime/a1_symbol_snapshot_adapter.mjs";
import { buildShadowSourceSessionReceipt } from "../runtime/shadow_source_session_receipt.mjs";
import { inspectD07ProspectiveUniverseV0_1 as inspect }
 from "../runtime/d07_dual_market_universe_preflight_v0_1.mjs";
import { sha256Hex } from "../runtime/decision_archive.mjs";

const T="2026-09-29",time="2026-09-29T07:30:00Z",observed="2026-09-29T07:20:00Z";
const H="a".repeat(64);
const twse=Array.from({length:600},(_,i)=>({
  Code:String(1000+i),Name:"TWSE-"+i,Date:"20260929",
  OpeningPrice:"100",HighestPrice:"105",LowestPrice:"95",ClosingPrice:"103",
  TradeVolume:"1500000",TradeValue:"153000000",Transaction:"100",
}));
const tpex=Array.from({length:450},(_,i)=>({
  SecuritiesCompanyCode:String(6000+i),CompanyName:"TPEX-"+i,
  Date:"20260929",Open:"50",High:"55",Low:"49",Close:"52",
  TradingShares:"700000",TransactionAmount:"36000000",TransactionNumber:"80",
}));
const makeBatch=(changes={})=>buildA1SymbolSnapshotBatch({
  batchId:"D07-A1",marketDate:T,decisionTimestamp:time,observedAt:observed,
  twseRows:twse,tpexRows:tpex,...changes,
});
const makeSession=(changes={})=>buildShadowSourceSessionReceipt({
  receiptId:"D07-SOURCE",marketDate:T,decisionTimestamp:time,capturedAt:observed,
  expectedSources:[
    {sourceId:"A1_TWSE_DAILY_CLOSE",role:"REQUIRED"},
    {sourceId:"A1_TPEX_DAILY_CLOSE",role:"REQUIRED"},
  ],
  observedSources:[
    {sourceId:"A1_TWSE_DAILY_CLOSE",state:"KNOWN",sourceDate:T,
      payloadHash:H,availableAt:observed,capturedAt:observed,pointInTimeEligible:true},
    {sourceId:"A1_TPEX_DAILY_CLOSE",state:"KNOWN",sourceDate:T,
      payloadHash:H,availableAt:observed,capturedAt:observed,pointInTimeEligible:true},
  ],...changes,
});
const batch=await makeBatch(),receipt=await makeSession();
assert.equal(batch.state,"READY");
assert.equal(batch.ordinarySymbolCount,1050);
const good=await inspect({a1SymbolSnapshotBatch:batch,sourceSessionReceipt:receipt});
assert.equal(good.state,"READY_FOR_INDEPENDENT_PHYSICAL_PIT_REVALIDATION");
assert.equal(good.fullUniverseCertified,false);
assert.equal(good.physicalPITVerified,false);
assert.equal(good.capacityWriteEnabled,false);
assert.equal(good.finalSelectionEnabled,false);
assert.equal(good.marketLedger.length,2);
assert.deepEqual(good.marketLedger.map(x=>x.observedSymbolCount),[600,450]);
assert.equal(Object.isFrozen(good),true);
assert.equal((await inspect({a1SymbolSnapshotBatch:batch,sourceSessionReceipt:receipt})).preflightHash,good.preflightHash);

// The A1 adapter intentionally supports tiny research fixtures. This D07
// final-universe preflight must NEVER allow their floor override to be used.
const tiny=await makeBatch({twseRows:[twse[0]],tpexRows:[tpex[0]],
 minimumByMarket:{TWSE:1,TPEX:1}});
assert.equal(tiny.state,"READY");
const weak=await inspect({a1SymbolSnapshotBatch:tiny,sourceSessionReceipt:receipt});
assert.equal(weak.state,"BLOCKED_SOURCE_OR_UNIVERSE");
assert.ok(weak.blockers.some(x=>x.includes("COVERAGE_FLOOR_WEAKENED")));
const incomplete=await makeBatch({tpexRows:tpex.slice(0,449)});
const res=await inspect({a1SymbolSnapshotBatch:incomplete,sourceSessionReceipt:receipt});
assert.equal(res.state,"BLOCKED_SOURCE_OR_UNIVERSE");

const missingTpex=await makeSession({
 expectedSources:[{sourceId:"A1_TWSE_DAILY_CLOSE",role:"REQUIRED"}],
 observedSources:[{sourceId:"A1_TWSE_DAILY_CLOSE",state:"KNOWN",
   sourceDate:T,payloadHash:H,availableAt:observed,capturedAt:observed,
   pointInTimeEligible:true}],
});
const absent=await inspect({a1SymbolSnapshotBatch:batch,sourceSessionReceipt:missingTpex});
assert.ok(absent.blockers.includes("D07_BOTH_MARKETS_REQUIRED_WITHOUT_WAIVER"));
const stale=await makeSession({observedSources:[
  {sourceId:"A1_TWSE_DAILY_CLOSE",state:"KNOWN",sourceDate:"2026-09-28",
  payloadHash:H,availableAt:observed,capturedAt:observed,pointInTimeEligible:true},
  {sourceId:"A1_TPEX_DAILY_CLOSE",state:"KNOWN",sourceDate:T,
  payloadHash:H,availableAt:observed,capturedAt:observed,pointInTimeEligible:true},
]});
const staleRes=await inspect({a1SymbolSnapshotBatch:batch,sourceSessionReceipt:stale});
assert.ok(staleRes.blockers.includes("TWSE:SOURCE_PIT_AND_PAYLOAD_PROVENANCE_NOT_VERIFIED"));
const fake={...batch,ordinarySymbolCount:1100};
await assert.rejects(()=>inspect({a1SymbolSnapshotBatch:fake,sourceSessionReceipt:receipt}),/BATCH_HASH_MISMATCH/);

const broken=JSON.parse(JSON.stringify(batch));
broken.markets.TWSE.snapshots[0].sourceFields.ClosingPrice="999";
broken.bySymbol[broken.markets.TWSE.snapshots[0].symbol].sourceFields.ClosingPrice="999";
delete broken.batchHash;
broken.batchHash=await sha256Hex(broken);
const corrupt=await inspect({a1SymbolSnapshotBatch:broken,sourceSessionReceipt:receipt});
assert.ok(corrupt.blockers.includes("TWSE:SYMBOL_RAW_FIELD_HASH_MISMATCH"));
const fakeSession={...receipt,marketDate:"2026-10-01"};
await assert.rejects(()=>inspect({a1SymbolSnapshotBatch:batch,sourceSessionReceipt:fakeSession}),/SOURCE_SESSION_HASH_MISMATCH/);
console.log("System2 D07 TWSE+TPEx PIT/source/denominator preflight PASS; no real source certified");
