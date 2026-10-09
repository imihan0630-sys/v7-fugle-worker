import assert from "node:assert/strict";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { buildA1SymbolSnapshotBatch } from "../runtime/a1_symbol_snapshot_adapter.mjs";
import { buildShadowSourceSessionReceipt } from "../runtime/shadow_source_session_receipt.mjs";
import { buildDailyShadowCapacityOrchestrationV0_1 } from "../runtime/daily_shadow_capacity_orchestrator_v0_1.mjs";
import { inspectD08CapacityUniverseLinkV0_1 as inspect }
  from "../runtime/d08_capacity_universe_lineage_gate_v0_1.mjs";

const marketDate="2026-09-29",decisionTimestamp="2026-09-29T07:30:00Z";
const observed="2026-09-29T07:20:00Z";
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
const batch=await buildA1SymbolSnapshotBatch({
 batchId:"D08-FULL-FIXTURE",marketDate,decisionTimestamp,observedAt:observed,
 twseRows:twse,tpexRows:tpex,
});
const source=await buildShadowSourceSessionReceipt({
 receiptId:"D08-FIXTURE-SOURCE",marketDate,decisionTimestamp,capturedAt:observed,
 expectedSources:[
  {sourceId:"A1_TWSE_DAILY_CLOSE",role:"REQUIRED"},
  {sourceId:"A1_TPEX_DAILY_CLOSE",role:"REQUIRED"},
 ],
 observedSources:[
  {sourceId:"A1_TWSE_DAILY_CLOSE",state:"KNOWN",sourceDate:marketDate,
   availableAt:observed,capturedAt:observed,payloadHash:"a".repeat(64),pointInTimeEligible:true},
  {sourceId:"A1_TPEX_DAILY_CLOSE",state:"KNOWN",sourceDate:marketDate,
   availableAt:observed,capturedAt:observed,payloadHash:"b".repeat(64),pointInTimeEligible:true},
 ],
});
const known={observationState:"KNOWN",thesisState:"NEUTRAL",
 reasons:["synthetic-test-only"],warnings:[]};
const rankInputs=batch.symbols.map(symbol=>({
 symbol,companyName:batch.bySymbol[symbol].companyName,
 decisionId:"D08-DEC-"+symbol,strategyId:"SHORT_MOMENTUM",
 strategyVersion:"V0.1-CONTRACT",strategyValidity:"VALID",
 entryReadiness:"WATCH",
 familyAssessments:{TECHNICAL_STRUCTURE:known,PRICE_VOLUME:known,RISK_FRICTION:known},
 warnings:[],
}));
const exclusions=Object.fromEntries(batch.symbols.map(symbol=>[symbol,{
 excluded:false,reasons:[],
}]));
const diagnostics=batch.symbols.map(symbol=>({symbol,state:"ACCOUNTED"}));
const runReceipt={
 runId:"D08-RUN-SHORT_MOMENTUM",marketDate,decisionTimestamp,
 strategyId:"SHORT_MOMENTUM",strategyVersion:"V0.1-CONTRACT",
 runState:"COMPLETE",stateCounts:{INCOMPLETE:0,SOURCE_BLOCKED:0,
 SESSION_INVALID:0,ERROR:0},
};
async function runWith(changes={},newReceipt=runReceipt){
 const base={
  runId:"D08-SYNTH-ORCHESTRATION",marketDate,decisionTimestamp,
  strategyId:"SHORT_MOMENTUM",strategyVersion:"V0.1-CONTRACT",
  a1BatchHash:batch.batchHash,sourceSessionHash:source.sourceSessionHash,
  baseUniverseCount:batch.ordinarySymbolCount,excludedCount:0,
  eligibleCount:batch.ordinarySymbolCount,
  accountedCount:batch.ordinarySymbolCount,exclusions,rankingInputs:rankInputs,
  perSymbolDiagnostics:diagnostics,finalSelectionEnabled:false,
  scheduledCaptureActivated:false,...changes,
 };
 const orchestrationHash=await sha256Hex(base);
 return {...base,orchestrationHash,bundle:{
  strategyId:"SHORT_MOMENTUM",strategyVersion:"V0.1-CONTRACT",
  runReceipt:newReceipt,
 }};
}
const run=await runWith();
const capacity=await buildDailyShadowCapacityOrchestrationV0_1({
 capacityRunId:"CAP-D08-OFFLINE",persistenceBatchId:"PB-D08-OFFLINE",
 marketDate,decisionTimestamp,capturedAt:"2026-09-29T07:31:00Z",
 strategyRuns:[run],
});
assert.equal(capacity.state,"CAPACITY_ZERO_PICK_READY");
assert.equal(capacity.zeroPickDay,true);
const args={a1SymbolSnapshotBatch:batch,sourceSessionReceipt:source,
 strategyRuns:[run],capacityOrchestration:capacity};
const good=await inspect(args);
assert.equal(good.readiness,"RESEARCH_ACCOUNTED_PENDING_PHYSICAL_SOURCE_VERIFICATION");
assert.equal(good.strategyLedger[0].accountedUniverseCount,1050);
assert.equal(good.strategyLedger[0].state,"ACCOUNTED_UNCERTIFIED");
assert.equal(good.requestedZeroPickDay,true);
assert.equal(good.canonicalZeroPickDay,null);
assert.equal(good.zeroPickCertified,false);
assert.equal(good.finalSelectionEnabled,false);
assert.equal(good.d1WriteAuthorized,false);
assert.equal(good.fullUniversePhysicallyVerified,false);
assert.equal(good.livePushEnabled,false);
assert.equal(good.orderImpact,false);
assert.equal(Object.isFrozen(good),true);
assert.equal((await inspect(args)).linkHash,good.linkHash);

const omitted=await runWith({
 rankingInputs:rankInputs.slice(1),eligibleCount:rankInputs.length-1,
 accountedCount:rankInputs.length-1,
});
const omission=await inspect({...args,strategyRuns:[omitted]});
assert.equal(omission.readiness,"BLOCKED_UNIVERSE_OR_DENOMINATOR");
assert.ok(omission.blockers.includes("SHORT_MOMENTUM:RUN_SYMBOL_EXCLUSION_OR_RANK_GAP"));
assert.equal(omission.canonicalZeroPickDay,null);

const flip={...exclusions,[batch.symbols[0]]:{excluded:true,
 reasons:["UNATTESTED_SYNTHETIC_REASON"]}};
const double=await runWith({exclusions:flip,excludedCount:1});
const doubleResult=await inspect({...args,strategyRuns:[double]});
assert.ok(doubleResult.blockers.includes("SHORT_MOMENTUM:RUN_SYMBOL_EXCLUSION_OR_RANK_GAP"));
const fakeClock=await runWith({decisionTimestamp:"2026-09-30T07:30:00Z"});
const badClock=await inspect({...args,strategyRuns:[fakeClock]});
assert.ok(badClock.blockers.includes("SHORT_MOMENTUM:RUN_DECISION_CLOCK_MISMATCH"));

const invalid=await runWith({
 rankingInputs:rankInputs.map((x,i)=>i===0?{...x,
 strategyValidity:"INCOMPLETE",entryReadiness:"BLOCKED"}:x),
}, {...runReceipt,stateCounts:{...runReceipt.stateCounts,INCOMPLETE:1}});
const wrongZero=await inspect({...args,strategyRuns:[invalid]});
assert.ok(wrongZero.blockers.includes("D08_FALSE_CLEAN_ZERO_PICK"));
assert.ok(wrongZero.blockers.includes("SHORT_MOMENTUM:RUN_REQUIRED_EVIDENCE_INCOMPLETE"));

const foreign={
 ...capacity.capacityReceipt,
 globalPool:[{symbol:"9999",memberships:[]}],globalCount:1,
};
foreign.capacityHash=await sha256Hex(Object.fromEntries(
 Object.entries(foreign).filter(([k])=>k!=="capacityHash")
));
const rogue=await inspect({...args,capacityOrchestration:{
 ...capacity,capacityReceipt:foreign,state:"CAPACITY_READY",zeroPickDay:false,
}});
assert.ok(rogue.blockers.includes("D08_GLOBAL_POOL_OUTSIDE_FULL_UNIVERSE"));

const badSource=await buildShadowSourceSessionReceipt({
 receiptId:"D08-NO-TPEX",marketDate,decisionTimestamp,capturedAt:observed,
 expectedSources:[{sourceId:"A1_TWSE_DAILY_CLOSE",role:"REQUIRED"}],
 observedSources:[{sourceId:"A1_TWSE_DAILY_CLOSE",state:"KNOWN",
 sourceDate:marketDate,availableAt:observed,capturedAt:observed,
 payloadHash:"a".repeat(64),pointInTimeEligible:true}],
});
const noTpex=await inspect({...args,sourceSessionReceipt:badSource});
assert.ok(noTpex.blockers.includes("D08_D07_UNIVERSE_SOURCE_BLOCKED"));
assert.equal(noTpex.zeroPickCertified,false);

const swapped=await runWith({a1BatchHash:"f".repeat(64)});
const swappedResult=await inspect({...args,strategyRuns:[swapped]});
assert.ok(swappedResult.blockers.includes("SHORT_MOMENTUM:RUN_SOURCE_HASH_NOT_BOUND"));
assert.equal(swappedResult.canonicalZeroPickDay,null);
console.log("D08 offline 1050-symbol capacity-universe cross-check PASS; false-zero and lineage attacks blocked; no D1 writes");
