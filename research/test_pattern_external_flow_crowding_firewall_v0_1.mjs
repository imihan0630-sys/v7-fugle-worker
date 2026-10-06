import assert from "node:assert/strict";
import {
  classifyExternalFlowReceipt,
  validateExternalFlowTiming,
  classifyFlowAlignment,
  classifyCrowdingEvidence,
  classifyInformationIndependence,
  buildExternalFlowDenominator
} from "./pattern_external_flow_crowding_firewall_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("EF01 missing owner state remains external flow unknown",()=>{
  const r=classifyExternalFlowReceipt({replaySafe:true});
  assert.equal(r.state,"EXTERNAL_FLOW_UNKNOWN");
});

t("EF02 owner-certified same-symbol flow is explicit",()=>{
  const r=classifyExternalFlowReceipt({
    ownerState:"SAME_SYMBOL_DIRECTIONAL_FLOW_PRESENT",
    replaySafe:true
  });
  assert.equal(r.state,"SAME_SYMBOL_DIRECTIONAL_FLOW_PRESENT");
});

t("EF03 owner-certified crowding is explicit",()=>{
  const r=classifyExternalFlowReceipt({
    ownerState:"MULTI_PARTICIPANT_CROWDING_PRESENT",
    replaySafe:true
  });
  assert.equal(r.state,"MULTI_PARTICIPANT_CROWDING_PRESENT");
});

t("EF04 data-blocked flow fails closed",()=>{
  const r=classifyExternalFlowReceipt({dataBlocked:true,replaySafe:true});
  assert.equal(r.state,"FLOW_DATA_BLOCKED");
  assert.equal(r.eligible,false);
});

t("EF05 replay-unsafe flow fails closed",()=>{
  const r=classifyExternalFlowReceipt({
    ownerState:"COMMON_FACTOR_FLOW_PRESENT",
    replaySafe:false
  });
  assert.equal(r.state,"FLOW_DATA_BLOCKED");
});

t("EF06 pre-freeze flow receipt is baseline eligible",()=>{
  const r=validateExternalFlowTiming({
    firstObservableAt:"2026-10-01T09:20:00+08:00",
    knownAt:"2026-10-01T09:25:00+08:00",
    predictorFreezeAt:"2026-10-01T09:30:00+08:00",
    flowWindowEnd:"2026-10-01T09:29:00+08:00",
    replaySafe:true
  });
  assert.equal(r.status,"PRE_FREEZE_FLOW_ELIGIBLE");
});

t("EF07 late-known crowding is post hoc",()=>{
  const r=validateExternalFlowTiming({
    firstObservableAt:"2026-10-01T09:20:00+08:00",
    knownAt:"2026-10-01T09:35:00+08:00",
    predictorFreezeAt:"2026-10-01T09:30:00+08:00",
    replaySafe:true
  });
  assert.equal(r.status,"POST_HOC_EXTERNAL_FLOW_NOT_BASELINE_ELIGIBLE");
});

t("EF08 flow window extending beyond freeze is partial baseline only",()=>{
  const r=validateExternalFlowTiming({
    firstObservableAt:"2026-10-01T09:20:00+08:00",
    knownAt:"2026-10-01T09:25:00+08:00",
    predictorFreezeAt:"2026-10-01T09:30:00+08:00",
    flowWindowEnd:"2026-10-01T09:40:00+08:00",
    replaySafe:true
  });
  assert.equal(r.status,"BASELINE_WINDOW_PARTIAL");
  assert.equal(r.baselineEligiblePartOnly,true);
});

t("EF09 same-direction external flow can align with structural response",()=>{
  const r=classifyFlowAlignment({structuralExpectedDirection:"UP",externalFlowDirection:"UP"});
  assert.equal(r.state,"ALIGNED");
});

t("EF10 opposing external flow remains explicit",()=>{
  const r=classifyFlowAlignment({structuralExpectedDirection:"UP",externalFlowDirection:"DOWN"});
  assert.equal(r.state,"OPPOSED");
});

t("EF11 high volume alone is not crowding",()=>{
  const r=classifyCrowdingEvidence({highVolume:true});
  assert.equal(r.state,"HIGH_VOLUME_ONLY_NOT_CROWDING");
  assert.equal(r.crowdingVerified,false);
});

t("EF12 owner-certified crowding can be verified",()=>{
  const r=classifyCrowdingEvidence({ownerCrowdingState:"MULTI_PARTICIPANT_CROWDING_PRESENT"});
  assert.equal(r.crowdingVerified,true);
});

t("EF13 concentration plus correlation still requires owner validation",()=>{
  const r=classifyCrowdingEvidence({
    participantConcentrationVerified:true,
    correlatedSameDirectionVerified:true
  });
  assert.equal(r.state,"CROWDING_RECEIPT_CANDIDATE");
  assert.equal(r.ownerValidationRequired,true);
});

t("EF14 same PRICE_OHLC flow proxy is not independent evidence",()=>{
  const r=classifyInformationIndependence({
    externalInformationRoot:"PRICE_OHLC",
    structuralInformationRoot:"PRICE_OHLC"
  });
  assert.equal(r.status,"SAME_INFORMATION_ROOT");
  assert.equal(r.independentEvidenceAllowed,false);
});

t("EF15 distinct flow root is only an independence candidate",()=>{
  const r=classifyInformationIndependence({
    externalInformationRoot:"OFFICIAL_PARTICIPANT_FLOW",
    structuralInformationRoot:"PRICE_OHLC"
  });
  assert.equal(r.status,"DISTINCT_INFORMATION_ROOT_CANDIDATE");
  assert.equal(r.independentEvidenceAllowed,false);
});

t("EF16 residual validation is required even for same-root aliases",()=>{
  const r=classifyInformationIndependence({
    externalInformationRoot:"PRICE_OHLC",
    structuralInformationRoot:"PRICE_OHLC",
    residualIncrementalityValidated:true
  });
  assert.equal(r.independentEvidenceAllowed,true);
});

t("EF17 denominator preserves unknown and mixed flow states",()=>{
  const r=buildExternalFlowDenominator([
    {state:"EXTERNAL_FLOW_UNKNOWN"},
    {state:"SAME_SYMBOL_DIRECTIONAL_FLOW_PRESENT"},
    {state:"MIXED_OR_CONFLICTING_FLOW"},
    {state:"FLOW_DATA_BLOCKED"}
  ]);
  assert.equal(r.total,4);
  assert.equal(r.counts.EXTERNAL_FLOW_UNKNOWN,1);
  assert.equal(r.counts.MIXED_OR_CONFLICTING_FLOW,1);
});

t("EF18 crowded-winner-only filtering is prohibited",()=>{
  const r=buildExternalFlowDenominator([{state:"MULTI_PARTICIPANT_CROWDING_PRESENT"}]);
  assert.equal(r.winnerOnlyFilteringAllowed,false);
  assert.equal(r.crowdedOnlyFilteringAllowed,false);
});

t("EF19 external flow mechanisms do not automatically multiply N",()=>{
  const r=buildExternalFlowDenominator([
    {state:"PASSIVE_BASKET_FLOW_PRESENT"},
    {state:"COMMON_FACTOR_FLOW_PRESENT"}
  ]);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

t("EF20 unknown flow is not converted to no flow",()=>{
  const r=buildExternalFlowDenominator([{state:"EXTERNAL_FLOW_UNKNOWN"}]);
  assert.equal(r.counts.EXTERNAL_FLOW_UNKNOWN,1);
});

console.log(`SUMMARY ${pass}/20 PASS`);
