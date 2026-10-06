import assert from "node:assert/strict";
import {
  classifyEventClock,
  continuousCrossEligibility,
  classifyDiscreteRepricingMechanism,
  buildMechanismLineageDiagnostics
} from "./pattern_discrete_repricing_mechanism_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const continuity={verified:true};
const continuous={verified:true,matchingMechanism:"CONTINUOUS"};
const auction={verified:true,matchingMechanism:"CALL_AUCTION"};
const noneLimit={constrained:false};
const noneVi={active:false,restartAuction:false};

t("DR01 unconstrained continuous path remains candidate, not proven structural memory",()=>{
  const r=classifyDiscreteRepricingMechanism({
    sessionReceipt:continuous,priceLimitReceipt:noneLimit,volatilityInterruptionReceipt:noneVi,
    continuityReceipt:continuity,transitionAt:"2026-10-01T10:00:00+08:00"
  });
  assert.equal(r.status,"UNCONSTRAINED_CONTINUOUS_OSCILLATION_CANDIDATE");
});

t("DR02 call auction clearing is not ordinary continuous oscillation",()=>{
  const r=classifyDiscreteRepricingMechanism({
    sessionReceipt:auction,priceLimitReceipt:noneLimit,volatilityInterruptionReceipt:noneVi,
    continuityReceipt:continuity,transitionAt:"2026-10-01T09:00:00+08:00"
  });
  assert.equal(r.status,"AUCTION_CLEARING_REPRICE");
});

t("DR03 price-limit constraint is explicit",()=>{
  const r=classifyDiscreteRepricingMechanism({
    sessionReceipt:continuous,priceLimitReceipt:{constrained:true},volatilityInterruptionReceipt:noneVi,
    continuityReceipt:continuity,transitionAt:"2026-10-01T10:00:00+08:00"
  });
  assert.equal(r.status,"PRICE_LIMIT_CONSTRAINED_PATH");
});

t("DR04 volatility interruption is explicit",()=>{
  const r=classifyDiscreteRepricingMechanism({
    sessionReceipt:continuous,priceLimitReceipt:noneLimit,
    volatilityInterruptionReceipt:{active:true,restartAuction:false},
    continuityReceipt:continuity,transitionAt:"2026-10-01T10:00:00+08:00"
  });
  assert.equal(r.status,"VOLATILITY_INTERRUPTION_REPRICE");
});

t("DR05 VI restart auction becomes mixed rather than single-story rescue",()=>{
  const r=classifyDiscreteRepricingMechanism({
    sessionReceipt:auction,priceLimitReceipt:noneLimit,
    volatilityInterruptionReceipt:{active:true,restartAuction:true},
    continuityReceipt:continuity,transitionAt:"2026-10-01T10:00:00+08:00"
  });
  assert.equal(r.status,"MIXED_MECHANISM");
  assert.deepEqual(new Set(r.mechanismFlags),new Set(["AUCTION_CLEARING_REPRICE","VOLATILITY_INTERRUPTION_REPRICE"]));
});

t("DR06 event known before transition is coincident, not causal proof",()=>{
  const r=classifyDiscreteRepricingMechanism({
    sessionReceipt:continuous,priceLimitReceipt:noneLimit,volatilityInterruptionReceipt:noneVi,
    eventReceipt:{replaySafe:true,knownAt:"2026-10-01T09:55:00+08:00"},
    continuityReceipt:continuity,transitionAt:"2026-10-01T10:00:00+08:00"
  });
  assert.equal(r.status,"EVENT_COINCIDENT_DISCRETE_REPRICE");
  assert.equal(r.eventCausalClaimAllowed,false);
});

t("DR07 event known after transition cannot explain prior move",()=>{
  const r=classifyEventClock({
    eventReceipt:{replaySafe:true,knownAt:"2026-10-01T10:05:00+08:00"},
    transitionAt:"2026-10-01T10:00:00+08:00"
  });
  assert.equal(r.status,"EVENT_POST_HOC_NOT_ELIGIBLE");
});

t("DR08 unknown event clock does not become event-free proof",()=>{
  const r=classifyEventClock({eventReceipt:{replaySafe:false},transitionAt:"2026-10-01T10:00:00+08:00"});
  assert.equal(r.status,"EVENT_CLOCK_UNKNOWN");
});

t("DR09 OHLC-only case cannot identify bid-ask bounce",()=>{
  const r=classifyDiscreteRepricingMechanism({
    sessionReceipt:continuous,priceLimitReceipt:noneLimit,volatilityInterruptionReceipt:noneVi,
    continuityReceipt:continuity,transitionAt:"2026-10-01T10:00:00+08:00"
  });
  assert.equal(r.microstructureReceiptState,"MICROSTRUCTURE_RECEIPT_UNAVAILABLE");
  assert.notEqual(r.status,"MICROSTRUCTURE_BOUNCE_CANDIDATE");
});

t("DR10 D05 owner-certified bounce candidate is consumable",()=>{
  const r=classifyDiscreteRepricingMechanism({
    sessionReceipt:continuous,priceLimitReceipt:noneLimit,volatilityInterruptionReceipt:noneVi,
    microstructureReceipt:{replaySafe:true,ownerBounceCandidate:true},
    continuityReceipt:continuity,transitionAt:"2026-10-01T10:00:00+08:00"
  });
  assert.equal(r.status,"MICROSTRUCTURE_BOUNCE_CANDIDATE");
});

t("DR11 event plus microstructure bounce is mixed",()=>{
  const r=classifyDiscreteRepricingMechanism({
    sessionReceipt:continuous,priceLimitReceipt:noneLimit,volatilityInterruptionReceipt:noneVi,
    eventReceipt:{replaySafe:true,knownAt:"2026-10-01T09:55:00+08:00"},
    microstructureReceipt:{replaySafe:true,ownerBounceCandidate:true},
    continuityReceipt:continuity,transitionAt:"2026-10-01T10:00:00+08:00"
  });
  assert.equal(r.status,"MIXED_MECHANISM");
});

t("DR12 unknown session fails closed",()=>{
  const r=classifyDiscreteRepricingMechanism({
    sessionReceipt:{verified:false},continuityReceipt:continuity,
    transitionAt:"2026-10-01T10:00:00+08:00"
  });
  assert.equal(r.status,"MECHANISM_NOT_EVALUABLE");
  assert.equal(r.reason,"SESSION_MECHANISM_UNKNOWN");
});

t("DR13 corporate-action/continuity uncertainty fails closed",()=>{
  const r=classifyDiscreteRepricingMechanism({
    sessionReceipt:continuous,continuityReceipt:{verified:false},
    transitionAt:"2026-10-01T10:00:00+08:00"
  });
  assert.equal(r.status,"MECHANISM_NOT_EVALUABLE");
  assert.equal(r.reason,"TECHNICAL_CONTINUITY_UNVERIFIED");
});

t("DR14 halt/resumption ambiguity fails closed",()=>{
  const r=classifyDiscreteRepricingMechanism({
    sessionReceipt:continuous,priceLimitReceipt:noneLimit,volatilityInterruptionReceipt:noneVi,
    haltReceipt:{ambiguous:true},
    continuityReceipt:continuity,transitionAt:"2026-10-01T10:00:00+08:00"
  });
  assert.equal(r.status,"MECHANISM_NOT_EVALUABLE");
  assert.equal(r.reason,"HALT_RESUMPTION_AMBIGUOUS");
});

t("DR15 geometric auction gap across zone is not continuous executed cross",()=>{
  const r=continuousCrossEligibility({
    priorPrice:95,laterPrice:110,boundary:{lower:100,upper:104},
    matchingMechanism:"CALL_AUCTION",
    exactTradeSequenceReceipt:{replaySafe:true,orderedCrossVerified:false},
    continuityReceipt:continuity
  });
  assert.equal(r.geometricSideChange,true);
  assert.equal(r.continuousExecutedCross,false);
  assert.equal(r.status,"DISCRETE_OR_NONCONTINUOUS_CROSS");
});

t("DR16 continuous matching still needs exact ordered sequence for exact cross claim",()=>{
  const r=continuousCrossEligibility({
    priorPrice:95,laterPrice:110,boundary:{lower:100,upper:104},
    matchingMechanism:"CONTINUOUS",
    exactTradeSequenceReceipt:{replaySafe:false,orderedCrossVerified:false},
    continuityReceipt:continuity
  });
  assert.equal(r.status,"CONTINUOUS_CROSS_UNVERIFIED");
  assert.equal(r.continuousExecutedCross,false);
});

t("DR17 verified continuous event sequence can certify trade-through",()=>{
  const r=continuousCrossEligibility({
    priorPrice:95,laterPrice:110,boundary:{lower:100,upper:104},
    matchingMechanism:"CONTINUOUS",
    exactTradeSequenceReceipt:{replaySafe:true,orderedCrossVerified:true},
    continuityReceipt:continuity
  });
  assert.equal(r.status,"CONTINUOUS_TRADE_THROUGH");
  assert.equal(r.continuousExecutedCross,true);
});

t("DR18 mechanism labels do not multiply PRICE_OHLC evidence",()=>{
  const r=buildMechanismLineageDiagnostics({
    priceDerivedRepresentations:["churn","auction_reprice","gap_cross"],
    quoteTradePrimitivePresent:false
  });
  assert.equal(r.rawPriceRepresentationCount,3);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.independentVoteAllowed,false);
});

t("DR19 direct quote primitive still does not auto-create independent vote",()=>{
  const r=buildMechanismLineageDiagnostics({
    priceDerivedRepresentations:["zone_path"],
    quoteTradePrimitivePresent:true
  });
  assert.equal(r.quoteTradePrimitivePresent,true);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.residualIncrementalityStatus,"NOT_VALIDATED");
});

t("DR20 no hard-coded exchange threshold is present in mechanism API",()=>{
  const source=classifyDiscreteRepricingMechanism.toString();
  assert.equal(source.includes("0.10"),false);
  assert.equal(source.includes("3.5"),false);
});

console.log(`SUMMARY ${pass}/20 PASS`);
