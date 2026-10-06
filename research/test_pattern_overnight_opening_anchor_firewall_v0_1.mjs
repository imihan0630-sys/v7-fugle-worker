import assert from "node:assert/strict";
import {
  buildPriorCloseGeometry,
  classifyOvernightReceipt,
  validateOpeningPredictorClock,
  classifyOpeningContext,
  classifyOvernightComparator,
  classifyPreviousCloseComparator,
  buildInformationLineage
} from "./pattern_overnight_opening_anchor_firewall_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const boundary={lower:100,upper:104};

t("ON01 prior close and opening distances are separate",()=>{
  const r=buildPriorCloseGeometry({priorClose:99,openingPrice:103,boundary,atr:2});
  assert.equal(r.priorCloseZoneDistance,1);
  assert.equal(r.openingZoneDistance,0);
});
t("ON02 overnight gap is explicit",()=>{
  const r=buildPriorCloseGeometry({priorClose:100,openingPrice:106,boundary,atr:2});
  assert.equal(r.overnightGapPrice,6);
  assert.equal(r.overnightGapAtr,3);
});
t("ON03 opposite-side open is opening gap crossing",()=>{
  const r=buildPriorCloseGeometry({priorClose:98,openingPrice:106,boundary,atr:2});
  assert.equal(r.openingGapCrossing,true);
});
t("ON04 no arbitrary previous-close near threshold is defined",()=>{
  const r=buildPriorCloseGeometry({priorClose:99,openingPrice:103,boundary});
  assert.equal(r.arbitraryNearThresholdDefined,false);
});
t("ON05 eligible corporate receipt must be known by freeze",()=>{
  const r=classifyOvernightReceipt({
    channel:"CORPORATE_OR_FIRM_NEWS",
    firstObservableAt:"2026-10-07T06:00:00+08:00",
    knownAt:"2026-10-07T06:00:00+08:00",
    predictorFreezeAt:"2026-10-07T09:00:10+08:00",
    replaySafe:true
  });
  assert.equal(r.status,"OVERNIGHT_CONTEXT_ELIGIBLE");
});
t("ON06 post-freeze news is not eligible",()=>{
  const r=classifyOvernightReceipt({
    channel:"CORPORATE_OR_FIRM_NEWS",
    firstObservableAt:"2026-10-07T09:01:00+08:00",
    knownAt:"2026-10-07T09:01:00+08:00",
    predictorFreezeAt:"2026-10-07T09:00:10+08:00",
    replaySafe:true
  });
  assert.equal(r.status,"POST_FREEZE_OVERNIGHT_CONTEXT");
});
t("ON07 replay-unsafe overnight receipt is blocked",()=>{
  const r=classifyOvernightReceipt({
    channel:"PREOPEN_INDEX_FUTURES_SIGNAL",
    firstObservableAt:"2026-10-07T08:45:00+08:00",
    knownAt:"2026-10-07T08:45:00+08:00",
    predictorFreezeAt:"2026-10-07T09:00:10+08:00",
    replaySafe:false
  });
  assert.equal(r.status,"DATA_BLOCKED");
});
t("ON08 opening final print must exist before predictor freeze",()=>{
  const r=validateOpeningPredictorClock({
    openingFinalPrintKnownAt:"2026-10-07T09:00:00+08:00",
    predictorFreezeAt:"2026-10-07T09:00:10+08:00",
    endpointWindowStart:"2026-10-07T09:05:00+08:00"
  });
  assert.equal(r.status,"VALID");
});
t("ON09 opening print cannot be predictor and same-time outcome",()=>{
  const r=validateOpeningPredictorClock({
    openingFinalPrintKnownAt:"2026-10-07T09:00:00+08:00",
    predictorFreezeAt:"2026-10-07T09:00:10+08:00",
    endpointWindowStart:"2026-10-07T09:00:10+08:00"
  });
  assert.equal(r.status,"OUTCOME_WINDOW_CLOCK_INVALID");
});
t("ON10 final opening print cannot be backfilled before known",()=>{
  const r=validateOpeningPredictorClock({
    openingFinalPrintKnownAt:"2026-10-07T09:00:00+08:00",
    predictorFreezeAt:"2026-10-07T08:59:50+08:00",
    endpointWindowStart:"2026-10-07T09:05:00+08:00"
  });
  assert.equal(r.status,"OPENING_PRINT_NOT_AVAILABLE_AT_FREEZE");
});
t("ON11 futures signal remains separate channel",()=>{
  const r=classifyOpeningContext({verifiedChannels:["PREOPEN_INDEX_FUTURES_SIGNAL"]});
  assert.equal(r.state,"PREOPEN_INDEX_FUTURES_SIGNAL");
});
t("ON12 options plus futures becomes multiple channels",()=>{
  const r=classifyOpeningContext({verifiedChannels:["PREOPEN_INDEX_FUTURES_SIGNAL","PREOPEN_INDEX_OPTIONS_SIGNAL"]});
  assert.equal(r.state,"MULTIPLE_OVERNIGHT_CHANNELS");
});
t("ON13 previous-close anchor remains separate context",()=>{
  const r=classifyOpeningContext({previousCloseAnchorReceipt:true});
  assert.equal(r.state,"PREVIOUS_CLOSE_ANCHOR_NEAR_ZONE");
});
t("ON14 no verified receipt does not become no causal influence proof",()=>{
  const r=classifyOpeningContext({verifiedChannels:[],unknownContext:true});
  assert.equal(r.state,"OVERNIGHT_CONTEXT_UNKNOWN");
});
t("ON15 generic overnight comparator at zone is explicit",()=>{
  assert.equal(
    classifyOvernightComparator({atZone:true,overnightContextVerified:true}).status,
    "G1_OVERNIGHT_SHOCK_AT_ZONE"
  );
});
t("ON16 generic overnight comparator away from zone is explicit",()=>{
  assert.equal(
    classifyOvernightComparator({atZone:false,overnightContextVerified:true}).status,
    "G0_OVERNIGHT_SHOCK_AWAY_FROM_ZONE"
  );
});
t("ON17 prior-close near-zone comparator is explicit",()=>{
  assert.equal(
    classifyPreviousCloseComparator({nearZone:true,receiptVerified:true}).status,
    "P1_PRIOR_CLOSE_ANCHOR_NEAR_ZONE"
  );
});
t("ON18 unverified prior-close comparator fails closed",()=>{
  assert.equal(
    classifyPreviousCloseComparator({nearZone:true,receiptVerified:false}).status,
    "UNKNOWN"
  );
});
t("ON19 same-direction derivative signals are not independent confirmation",()=>{
  const r=buildInformationLineage({directPriceRepresentations:2,externalContextChannels:2});
  assert.equal(r.independentConfirmationByDirectionOnly,false);
});
t("ON20 default effective evidence count remains one",()=>{
  const r=buildInformationLineage({directPriceRepresentations:3,externalContextChannels:4});
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

console.log(`SUMMARY ${pass}/20 PASS`);
