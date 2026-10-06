import assert from "node:assert/strict";
import {
  classifyShockContext,
  buildPreShockReference,
  classifyReceiptTiming,
  buildRecoveryClockSeparation,
  buildShockSnapbackDiagnostics
} from "./pattern_shock_snapback_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const freeze="2026-10-06T10:00:00+08:00";
const opp="2026-10-06T10:01:00+08:00";

t("SS01 preexisting volatility shock is baseline context",()=>{
  const r=classifyShockContext({
    predictorFreezeAt:freeze,structuralOpportunityAt:opp,
    volatilityShock:{present:true,complete:true,startedAt:"2026-10-06T09:58:00+08:00",knownAt:"2026-10-06T09:59:00+08:00"},
    liquidityShock:{present:false,complete:true}
  });
  assert.equal(r.status,"PREEXISTING_VOLATILITY_SHOCK");
  assert.equal(r.baselineEligible,true);
});

t("SS02 mixed preexisting shock remains mixed",()=>{
  const r=classifyShockContext({
    predictorFreezeAt:freeze,structuralOpportunityAt:opp,
    volatilityShock:{present:true,complete:true,startedAt:"2026-10-06T09:58:00+08:00",knownAt:"2026-10-06T09:59:00+08:00"},
    liquidityShock:{present:true,complete:true,startedAt:"2026-10-06T09:57:00+08:00",knownAt:"2026-10-06T09:59:30+08:00"}
  });
  assert.equal(r.status,"PREEXISTING_MIXED_SHOCK");
});

t("SS03 shock starting after freeze cannot be baseline explanation",()=>{
  const r=classifyShockContext({
    predictorFreezeAt:freeze,structuralOpportunityAt:opp,
    volatilityShock:{present:true,complete:true,startedAt:"2026-10-06T10:00:30+08:00",knownAt:"2026-10-06T10:00:30+08:00"},
    liquidityShock:{present:false,complete:true}
  });
  assert.equal(r.status,"SHOCK_BEGINS_AFTER_OPPORTUNITY");
  assert.equal(r.baselineEligible,false);
});

t("SS04 incomplete owner receipts remain unknown",()=>{
  const r=classifyShockContext({predictorFreezeAt:freeze,structuralOpportunityAt:opp});
  assert.equal(r.status,"SHOCK_CONTEXT_UNKNOWN");
});

t("SS05 midquote pre-shock reference is preferred clean reference",()=>{
  const r=buildPreShockReference({
    referenceType:"MIDQUOTE",price:101,knownAt:"2026-10-06T09:59:00+08:00",predictorFreezeAt:freeze,
    structuralBoundary:{lower:100,upper:102}
  });
  assert.equal(r.status,"VALID");
  assert.equal(r.insideStructure,true);
  assert.equal(r.noiseSeparationState,"MIDQUOTE_REFERENCE");
});

t("SS06 transaction proxy preserves noise-separation warning",()=>{
  const r=buildPreShockReference({
    referenceType:"TRANSACTION_PROXY",price:105,knownAt:"2026-10-06T09:59:00+08:00",predictorFreezeAt:freeze,
    structuralBoundary:{lower:100,upper:102}
  });
  assert.equal(r.noiseSeparationState,"REFERENCE_NOISE_SEPARATION_INCOMPLETE");
  assert.equal(r.distanceToStructure,3);
});

t("SS07 future reference cannot enter predictor",()=>{
  const r=buildPreShockReference({
    referenceType:"MIDQUOTE",price:101,knownAt:"2026-10-06T10:02:00+08:00",predictorFreezeAt:freeze,
    structuralBoundary:{lower:100,upper:102}
  });
  assert.equal(r.status,"UNKNOWN");
});

t("SS08 receipt already known by freeze is pre-opportunity context",()=>{
  const r=classifyReceiptTiming({receiptAt:"2026-10-06T09:59:00+08:00",predictorFreezeAt:freeze,structuralOpportunityAt:opp});
  assert.equal(r.status,"PRE_OPPORTUNITY_CONTEXT");
  assert.equal(r.baselineEligible,true);
});

t("SS09 same-window post-freeze context cannot be backfilled",()=>{
  const r=classifyReceiptTiming({receiptAt:"2026-10-06T10:00:30+08:00",predictorFreezeAt:freeze,structuralOpportunityAt:opp});
  assert.equal(r.status,"PRE_TOUCH_POST_FREEZE_CONTEXT");
  assert.equal(r.baselineEligible,false);
});

t("SS10 post-opportunity recovery is mechanism/outcome",()=>{
  const r=classifyReceiptTiming({receiptAt:"2026-10-06T10:05:00+08:00",predictorFreezeAt:freeze,structuralOpportunityAt:opp});
  assert.equal(r.status,"POST_OPPORTUNITY_MECHANISM_OR_OUTCOME");
});

t("SS11 liquidity and price recovery clocks remain separate",()=>{
  const r=buildRecoveryClockSeparation({
    liquidityRecoveryAt:"2026-10-06T10:10:00+08:00",
    priceRecoveryAt:"2026-10-06T10:04:00+08:00",
    priceDiscoveryCompletionAt:"2026-10-06T10:12:00+08:00",
    predictorFreezeAt:freeze
  });
  assert.equal(r.clocksKeptSeparate,true);
  assert.equal(r.liquidityRecoveryEqualsPriceRecovery,false);
});

t("SS12 recovery clock before predictor indicates timing conflict",()=>{
  const r=buildRecoveryClockSeparation({
    liquidityRecoveryAt:"2026-10-06T09:59:00+08:00",
    predictorFreezeAt:freeze
  });
  assert.equal(r.status,"TIMING_CONFLICT");
});

t("SS13 midquote absence keeps snapback noise separation incomplete",()=>{
  const r=buildShockSnapbackDiagnostics({
    shockContext:{status:"PREEXISTING_LIQUIDITY_SHOCK"},
    referenceReceipt:{status:"VALID"},
    midquoteAvailable:false,
    recoveryClocks:{clocksKeptSeparate:true}
  });
  assert.equal(r.noiseSeparationState,"SNAPBACK_NOISE_SEPARATION_INCOMPLETE");
});

t("SS14 diagnostic never equates immediate snapback with structural rejection",()=>{
  const r=buildShockSnapbackDiagnostics({
    shockContext:{status:"NO_PREEXISTING_SHOCK_CONTEXT"},
    midquoteAvailable:true,
    recoveryClocks:{clocksKeptSeparate:true}
  });
  assert.equal(r.immediateSnapbackEqualsStructuralRejection,false);
});

t("SS15 multiple context receipts remain one default evidence count",()=>{
  const r=buildShockSnapbackDiagnostics({
    shockContext:{status:"PREEXISTING_MIXED_SHOCK"},
    referenceReceipt:{status:"VALID"},
    midquoteAvailable:true,
    recoveryClocks:{clocksKeptSeparate:true}
  });
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.residualIncrementalityStatus,"NOT_VALIDATED");
});

t("SS16 outcome join remains closed",()=>{
  const r=buildShockSnapbackDiagnostics({
    shockContext:{status:"PREEXISTING_VOLATILITY_SHOCK"},
    midquoteAvailable:true,
    recoveryClocks:{clocksKeptSeparate:true}
  });
  assert.equal(r.outcomeJoinAllowed,false);
});

console.log(`SUMMARY ${pass}/16 PASS`);
