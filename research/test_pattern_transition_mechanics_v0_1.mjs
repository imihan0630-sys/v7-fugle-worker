import assert from "node:assert/strict";
import {
  classifyMatchingMechanism,
  classifyPriceConstraint,
  classifyBounceState,
  classifyEventContext,
  discreteCrossingSemantics,
  buildTransitionContextVector
} from "./pattern_transition_mechanics_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const at="2026-10-06T10:00:00+08:00";
const freeze="2026-10-06T10:01:00+08:00";
const receipt=(x)=>({verified:true,asOf:at,effectiveFrom:"2026-01-01T00:00:00+08:00",...x});
const cont=receipt({kind:"CONTINUOUS"});
const free=receipt({state:"UNCONSTRAINED"});

t("TM01 valid continuous mechanism",()=>{
  const r=classifyMatchingMechanism({receipt:cont,transitionAt:at,predictorFreezeAt:freeze});
  assert.equal(r.matchingMechanism,"CONTINUOUS");
  assert.equal(r.discreteRepricing,false);
});

t("TM02 opening auction is discrete repricing",()=>{
  const r=classifyMatchingMechanism({receipt:receipt({kind:"OPEN_CALL_AUCTION"}),transitionAt:at,predictorFreezeAt:freeze});
  assert.equal(r.matchingMechanism,"OPEN_CALL_AUCTION");
  assert.equal(r.discreteRepricing,true);
});

t("TM03 VI reopening is explicit call-auction mechanism",()=>{
  const r=classifyMatchingMechanism({receipt:receipt({kind:"VI_REOPEN_CALL_AUCTION"}),transitionAt:at,predictorFreezeAt:freeze});
  assert.equal(r.matchingMechanism,"VI_REOPEN_CALL_AUCTION");
});

t("TM04 future rule receipt is blocked",()=>{
  const r=classifyMatchingMechanism({
    receipt:{verified:true,asOf:"2026-10-07T10:00:00+08:00",kind:"CONTINUOUS"},
    transitionAt:at,predictorFreezeAt:freeze
  });
  assert.equal(r.status,"DATA_BLOCKED");
});

t("TM05 wrong historical effective range is blocked",()=>{
  const r=classifyMatchingMechanism({
    receipt:{verified:true,asOf:at,effectiveFrom:"2026-10-07T00:00:00+08:00",kind:"CONTINUOUS"},
    transitionAt:at,predictorFreezeAt:freeze
  });
  assert.equal(r.status,"DATA_BLOCKED");
});

t("TM06 price-limit-up constraint is explicit",()=>{
  const r=classifyPriceConstraint({
    receipt:receipt({state:"DAILY_LIMIT_UP_CONSTRAINED"}),transitionAt:at,predictorFreezeAt:freeze
  });
  assert.equal(r.priceConstraintState,"DAILY_LIMIT_UP_CONSTRAINED");
});

t("TM07 special no-limit regime remains separate",()=>{
  const r=classifyPriceConstraint({
    receipt:receipt({state:"SPECIAL_NO_LIMIT_REGIME"}),transitionAt:at,predictorFreezeAt:freeze
  });
  assert.equal(r.priceConstraintState,"SPECIAL_NO_LIMIT_REGIME");
});

t("TM08 OHLC alternation cannot confirm bid-ask bounce",()=>{
  const r=classifyBounceState({ohlcOnly:true,transitionAt:at,predictorFreezeAt:freeze});
  assert.equal(r.microstructureBounceState,"NOT_EVALUABLE");
  assert.equal(r.reason,"OHLC_CANNOT_CONFIRM_BID_ASK_BOUNCE");
});

t("TM09 exact quote/trade receipt can confirm bounce",()=>{
  const r=classifyBounceState({
    bounceReceipt:receipt({exactOrderedTradeQuoteSequence:true,quoteConfirmedBounce:true}),
    transitionAt:at,predictorFreezeAt:freeze
  });
  assert.equal(r.microstructureBounceState,"QUOTE_CONFIRMED_BID_ASK_BOUNCE");
});

t("TM10 exact sequence can reject bounce",()=>{
  const r=classifyBounceState({
    bounceReceipt:receipt({exactOrderedTradeQuoteSequence:true,quoteConfirmedBounce:false}),
    transitionAt:at,predictorFreezeAt:freeze
  });
  assert.equal(r.microstructureBounceState,"EXACT_EVENT_NOT_BOUNCE");
});

t("TM11 incomplete microstructure evidence is candidate only",()=>{
  const r=classifyBounceState({
    bounceReceipt:receipt({exactOrderedTradeQuoteSequence:false}),
    transitionAt:at,predictorFreezeAt:freeze
  });
  assert.equal(r.microstructureBounceState,"CANDIDATE_UNVERIFIED");
});

t("TM12 verified event context does not prove causation",()=>{
  const r=classifyEventContext({
    eventReceipt:receipt({eventPresent:true}),transitionAt:at,predictorFreezeAt:freeze
  });
  assert.equal(r.eventContextState,"VERIFIED_EVENT_CONTEXT");
  assert.equal(r.causationProven,false);
});

t("TM13 opening-auction jump across zone does not prove continuous traversal",()=>{
  const r=discreteCrossingSemantics({
    startState:"BELOW",endState:"ABOVE",matchingMechanism:"OPEN_CALL_AUCTION"
  });
  assert.equal(r.crossedZone,true);
  assert.equal(r.intermediatePathObserved,false);
  assert.equal(r.continuousTraversalProven,false);
});

t("TM14 continuous below-to-above retains path as continuous context only",()=>{
  const r=discreteCrossingSemantics({
    startState:"BELOW",endState:"ABOVE",matchingMechanism:"CONTINUOUS"
  });
  assert.equal(r.crossedZone,true);
  assert.equal(r.intermediatePathObserved,true);
});

t("TM15 ordinary continuous case maps to K0",()=>{
  const r=buildTransitionContextVector({
    parentDecisionId:"P1",transitionAt:at,predictorFreezeAt:freeze,
    startState:"BELOW",endState:"INSIDE",
    matchingReceipt:cont,constraintReceipt:free,ohlcOnly:true
  });
  assert.equal(r.researchClass,"K0_ORDINARY_CONTINUOUS_UNCONSTRAINED");
});

t("TM16 opening auction maps to K1",()=>{
  const r=buildTransitionContextVector({
    parentDecisionId:"P1",transitionAt:at,predictorFreezeAt:freeze,
    startState:"BELOW",endState:"ABOVE",
    matchingReceipt:receipt({kind:"OPEN_CALL_AUCTION"}),constraintReceipt:free,ohlcOnly:true
  });
  assert.equal(r.researchClass,"K1_OPEN_OR_CLOSE_AUCTION_REPRICING");
  assert.equal(r.intermediatePathObserved,false);
});

t("TM17 VI reopening maps to K2",()=>{
  const r=buildTransitionContextVector({
    parentDecisionId:"P1",transitionAt:at,predictorFreezeAt:freeze,
    startState:"BELOW",endState:"ABOVE",
    matchingReceipt:receipt({kind:"VI_REOPEN_CALL_AUCTION"}),constraintReceipt:free,ohlcOnly:true
  });
  assert.equal(r.researchClass,"K2_VI_REOPEN_REPRICING");
});

t("TM18 price-limit constraint plus continuous market is mixed rather than ordinary",()=>{
  const r=buildTransitionContextVector({
    parentDecisionId:"P1",transitionAt:at,predictorFreezeAt:freeze,
    startState:"INSIDE",endState:"ABOVE",
    matchingReceipt:cont,
    constraintReceipt:receipt({state:"DAILY_LIMIT_UP_CONSTRAINED"}),
    ohlcOnly:true
  });
  assert.equal(r.researchClass,"K6_MIXED_MECHANISM");
  assert.ok(r.activeMechanisms.includes("PRICE_LIMIT_CONSTRAINED"));
});

t("TM19 event plus opening auction stays multi-axis mixed",()=>{
  const r=buildTransitionContextVector({
    parentDecisionId:"P1",transitionAt:at,predictorFreezeAt:freeze,
    startState:"BELOW",endState:"ABOVE",
    matchingReceipt:receipt({kind:"OPEN_CALL_AUCTION"}),constraintReceipt:free,
    eventReceipt:receipt({eventPresent:true}),ohlcOnly:true
  });
  assert.equal(r.researchClass,"K6_MIXED_MECHANISM");
  assert.ok(r.activeMechanisms.includes("AUCTION_REPRICING"));
  assert.ok(r.activeMechanisms.includes("VERIFIED_EVENT_CONTEXT"));
  assert.equal(r.eventCausationProven,false);
});

t("TM20 quote-confirmed bounce plus continuous state is mixed and non-independent",()=>{
  const r=buildTransitionContextVector({
    parentDecisionId:"P1",transitionAt:at,predictorFreezeAt:freeze,
    startState:"BELOW",endState:"ABOVE",
    matchingReceipt:cont,constraintReceipt:free,
    bounceReceipt:receipt({exactOrderedTradeQuoteSequence:true,quoteConfirmedBounce:true})
  });
  assert.equal(r.researchClass,"K6_MIXED_MECHANISM");
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.independentVoteAllowed,false);
});

t("TM21 missing PIT mechanism receipt fails closed",()=>{
  const r=buildTransitionContextVector({
    parentDecisionId:"P1",transitionAt:at,predictorFreezeAt:freeze,
    startState:"BELOW",endState:"INSIDE",
    matchingReceipt:{verified:false},constraintReceipt:free,ohlcOnly:true
  });
  assert.equal(r.status,"DATA_BLOCKED");
});

t("TM22 transition after predictor freeze is invalid",()=>{
  const r=buildTransitionContextVector({
    parentDecisionId:"P1",
    transitionAt:"2026-10-06T10:02:00+08:00",
    predictorFreezeAt:freeze,
    startState:"BELOW",endState:"INSIDE",
    matchingReceipt:cont,constraintReceipt:free,ohlcOnly:true
  });
  assert.equal(r.status,"UNKNOWN");
  assert.equal(r.reason,"TRANSITION_CLOCK_INVALID");
});

console.log(`SUMMARY ${pass}/22 PASS`);
