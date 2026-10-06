import assert from "node:assert/strict";
import { closeState, summarizeZoneStates, exactSequenceEligible } from "./pattern_zone_state_transition_v0_1.mjs";
import { barSpanAmbiguity, zonePathLineage } from "./pattern_zone_state_guard_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("ZP01 below state",()=>assert.equal(closeState(99,100,104),"BELOW"));
t("ZP02 lower boundary is inside",()=>assert.equal(closeState(100,100,104),"INSIDE"));
t("ZP03 upper boundary is inside",()=>assert.equal(closeState(104,100,104),"INSIDE"));
t("ZP04 above state",()=>assert.equal(closeState(105,100,104),"ABOVE"));
t("ZP05 invalid boundary is unknown",()=>assert.equal(closeState(101,105,100),"UNKNOWN"));

t("ZP06 intermediate inside path is not direct outside flip",()=>{
  const r=summarizeZoneStates(["BELOW","INSIDE","ABOVE"]);
  assert.equal(r.stateTransitionCount,2);
  assert.equal(r.directOutsideFlipCount,0);
});

t("ZP07 direct below-to-above is one direct flip",()=>{
  const r=summarizeZoneStates(["BELOW","ABOVE"]);
  assert.equal(r.stateTransitionCount,1);
  assert.equal(r.directOutsideFlipCount,1);
});

t("ZP08 equal occupancy can have different churn",()=>{
  const calm=summarizeZoneStates(["INSIDE","INSIDE","BELOW","BELOW"]);
  const churn=summarizeZoneStates(["INSIDE","BELOW","INSIDE","BELOW"]);
  assert.equal(calm.insideStateShare,churn.insideStateShare);
  assert.notEqual(calm.stateTransitionCount,churn.stateTransitionCount);
});

t("ZP09 equal transition count can have different occupancy",()=>{
  const a=summarizeZoneStates(["INSIDE","INSIDE","ABOVE"]);
  const b=summarizeZoneStates(["BELOW","BELOW","ABOVE"]);
  assert.equal(a.stateTransitionCount,b.stateTransitionCount);
  assert.notEqual(a.insideStateShare,b.insideStateShare);
});

t("ZP10 consecutive inside run is preserved",()=>{
  const r=summarizeZoneStates(["BELOW","INSIDE","INSIDE","INSIDE","ABOVE"]);
  assert.equal(r.maxConsecutiveInsideStates,3);
});

t("ZP11 spanning OHLC bar preserves ambiguity",()=>{
  const r=barSpanAmbiguity(99,105,100,104);
  assert.equal(r.spansEntireZone,true);
  assert.equal(r.exactCrossingCount,null);
  assert.equal(r.firstEdgeTouched,null);
  assert.equal(r.exactOrderKnown,false);
});

t("ZP12 non-spanning OHLC still does not invent exact order",()=>{
  const r=barSpanAmbiguity(101,105,100,104);
  assert.equal(r.spansEntireZone,false);
  assert.equal(r.exactCrossingCount,null);
  assert.equal(r.exactOrderKnown,false);
});

t("ZP13 invalid span input is unknown",()=>{
  const r=barSpanAmbiguity(NaN,105,100,104);
  assert.equal(r.status,"UNKNOWN");
});

t("ZP14 exact trade sequence needs complete replay-safe events",()=>{
  assert.equal(exactSequenceEligible("TRADE_EVENT_SEQUENCE",true,true),true);
  assert.equal(exactSequenceEligible("TRADE_EVENT_SEQUENCE",false,true),false);
  assert.equal(exactSequenceEligible("TRADE_EVENT_SEQUENCE",true,false),false);
});

t("ZP15 exact quote sequence is allowed only when complete/replay-safe",()=>{
  assert.equal(exactSequenceEligible("QUOTE_EVENT_SEQUENCE",true,true),true);
});

t("ZP16 OHLC bars cannot become exact event sequence",()=>{
  assert.equal(exactSequenceEligible("OHLC_BAR",true,true),false);
});

t("ZP17 OHLC-only lineage remains one PRICE_OHLC evidence family",()=>{
  const r=zonePathLineage(false);
  assert.deepEqual(r.informationRoots,["PRICE_OHLC"]);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.independentVoteAllowed,false);
  assert.equal(r.d03PathEfficiencyOwnerPreserved,true);
});

t("ZP18 exact event lineage adds timing root but not automatic independent vote",()=>{
  const r=zonePathLineage(true);
  assert.deepEqual(r.informationRoots,["PRICE_OHLC","EVENT_TIME"]);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.independentVoteAllowed,false);
  assert.equal(r.residualIncrementalityStatus,"NOT_VALIDATED");
});

t("ZP19 entropy factor stays undefined in v0.1",()=>{
  const r=zonePathLineage(false);
  assert.equal(r.entropyFactorDefined,false);
});

t("ZP20 path summary never emits directional trading vote",()=>{
  const r=summarizeZoneStates(["BELOW","ABOVE","BELOW"]);
  assert.equal("bullishVote" in r,false);
  assert.equal("bearishVote" in r,false);
});

console.log(`SUMMARY ${pass}/20 PASS`);
