import assert from "node:assert/strict";
import {evaluatePostMarketClockGateV0_1 as evaluate} from "../runtime/post_market_clock_gate_v0_1.mjs";

// Independent AUDIT_LANE shape-gate falsification; synthetic upstream receipts.
// The V0.1 gate is explicitly OFFLINE preflight and does not authorize a freeze.
const H="a".repeat(64),T="2026-10-09";
const source=(sourceId,changes={})=>({
  sourceId,state:"READY",reportedMarketDate:T,entitlement:"AUTHORIZED",
  pointInTimeEligible:true,coverageState:"COMPLETE",sourceHash:H,
  sourceReceiptHash:H,sourceReceiptVerified:true,
  firstObservedAt:"2026-10-09T18:50:00+08:00",
  responseCompletedAt:"2026-10-09T18:50:00+08:00",
  availableAt:null,...changes,
});
const calendar={
  marketDate:T,nextEligibleMarketDate:"2026-10-12",
  state:"VERIFIED_TRADING_DAY",pointInTimeEligible:true,
  sourceHash:H,firstObservedAt:"2026-10-09T18:00:00+08:00",
};
const base={
  targetMarketDate:T,candidateForSessionDate:"2026-10-12",
  phase:"FINAL_FREEZE_ATTEMPT",observedAt:"2026-10-09T23:45:00+08:00",
  calendarReceipt:calendar,requiredUniverseSources:["TWSE_A1","TPEX_A1"],
  sources:[source("TWSE_A1"),source("TPEX_A1")],
  strategies:[{strategyId:"SHORT_MOMENTUM",strategyVersion:"V0.1",
    preregistered:true,assessorReady:true,requiredSourceIds:["TWSE_A1","TPEX_A1"]}],
};
const run=(changes={})=>evaluate({...base,...changes});
const legitimateReady=await run();
const actualBlocked=await run({sources:[source("TWSE_A1"),source("TPEX_A1",{coverageState:"UNKNOWN"})]});
assert.equal(legitimateReady.state,"READY_FOR_DOWNSTREAM_REVALIDATION");
assert.equal(actualBlocked.state,"BLOCKED_REQUIRED_SOURCE");
const recovery=(parent)=>run({
  phase:"CONDITIONAL_RECOVERY_CHECK",
  observedAt:"2026-10-10T00:15:00+08:00",
  priorFinalAttempt:parent,
});
const makeParent=(changes={})=>({
  targetMarketDate:T,phase:"FINAL_FREEZE_ATTEMPT",
  observedAt:actualBlocked.observedAt,status:actualBlocked.state,
  receiptHash:actualBlocked.receiptHash,...changes,
});
const authentic=await recovery(makeParent());
assert.equal(authentic.eligibleForDownstreamReview,true);

// Each adversarial parent must be cryptographically bound to the archived 23:45
// attempt and exact timestamp. The current shape-gate does not have the archive
// and may therefore produce a READY_FOR_DOWNSTREAM_REVALIDATION shape.
const cases=[
  {id:"ARBITRARY_UNSTORED_DIGEST",parent:makeParent({receiptHash:"f".repeat(64)})},
  {id:"READY_RECEIPT_STATUS_FLIPPED_TO_BLOCKED",parent:makeParent({
    receiptHash:legitimateReady.receiptHash,
    observedAt:legitimateReady.observedAt,
  })},
  {id:"IMPOSSIBLE_EARLY_PARENT_CLOCK",parent:makeParent({
    observedAt:"2026-10-09T06:00:00+08:00",
  })},
];
const results=[];
for(const c of cases){
  const out=await recovery(c.parent);
  results.push({
    id:c.id,
    acceptedAsDownstreamReady:out.eligibleForDownstreamReview,
    observedState:out.state,
    hasUnverifiedParentBlocker:out.blockers.some(x=>x.includes("CONDITIONAL_RECOVERY_PARENT_NOT_VERIFIED")),
    failClosed:out.eligibleForDownstreamReview===false,
    admissionSemantics:out.admissionSemantics,
    finalFrozen:out.finalFrozen,
  });
  console.log("AUDIT_POSTMARKET_0015 "+JSON.stringify(results.at(-1)));
}
assert.equal(results.length,3);
assert.ok(results.every(x=>x.finalFrozen===false));
assert.ok(results.every(x=>x.admissionSemantics==="PRELIMINARY_PIT_SOURCE_GATE_NOT_FINAL_CAPACITY_AUTHORIZATION"));
const missing=await recovery(null);
assert.ok(missing.blockers.includes("CONDITIONAL_RECOVERY_PARENT_NOT_VERIFIED"));
assert.equal(missing.eligibleForDownstreamReview,false);
console.log("AUDIT_POSTMARKET_0015_SUMMARY "+JSON.stringify({
  forgedParentCases:results.length,
  shapeReadyDespiteUnverifiedParent:results.filter(x=>x.acceptedAsDownstreamReady).length,
  baselineAuthenticRecoveryReady:authentic.eligibleForDownstreamReview,
  missingParentBlocked:true,
  realArchiveReadbackAttempted:false,
  actualSourceVerified:false,
  productionFrozen:false,
  interpretation:"DOWNSTREAM MUST IMMUTABLY VERIFY PARENT; V0.1 SHAPE GATE ALONE IS NOT AUTHORIZATION",
}));
