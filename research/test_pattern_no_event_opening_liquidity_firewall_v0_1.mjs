import assert from "node:assert/strict";
import {
  classifyPublicEventCoverage,
  classifyInventoryPressure,
  classifyEventPressureMatrix,
  validateStrictResidualCohort,
  validatePressureInference,
  buildNoEventLiquidityFrame
} from "./pattern_no_event_opening_liquidity_firewall_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const freeze="2026-10-07T08:59:30+08:00";
const required=["OFFICIAL","GENERAL_NEWS"];

t("NL01 complete lanes permit no-public-event-complete",()=>{
  const r=classifyPublicEventCoverage({
    requiredLanes:required,coveredLanes:required,coverageComplete:true,
    knownAt:"2026-10-07T08:55:00+08:00",predictorFreezeAt:freeze,eventIdentified:false
  });
  assert.equal(r.state,"NO_PUBLIC_EVENT_IDENTIFIED_COVERAGE_COMPLETE");
  assert.equal(r.baselineEligible,true);
});

t("NL02 incomplete lane coverage remains unknown",()=>{
  const r=classifyPublicEventCoverage({
    requiredLanes:required,coveredLanes:["OFFICIAL"],coverageComplete:true,
    knownAt:"2026-10-07T08:55:00+08:00",predictorFreezeAt:freeze,eventIdentified:false
  });
  assert.equal(r.state,"PUBLIC_EVENT_STATUS_UNKNOWN");
});

t("NL03 coverage receipt after freeze is not baseline evidence",()=>{
  const r=classifyPublicEventCoverage({
    requiredLanes:required,coveredLanes:required,coverageComplete:true,
    knownAt:"2026-10-07T09:05:00+08:00",predictorFreezeAt:freeze,eventIdentified:false
  });
  assert.equal(r.state,"PUBLIC_EVENT_STATUS_UNKNOWN");
  assert.equal(r.baselineEligible,false);
});

t("NL04 event known before freeze is identified context",()=>{
  const r=classifyPublicEventCoverage({
    requiredLanes:required,coveredLanes:required,coverageComplete:true,
    knownAt:"2026-10-07T08:55:00+08:00",predictorFreezeAt:freeze,
    eventIdentified:true,eventKnownAt:"2026-10-07T07:30:00+08:00"
  });
  assert.equal(r.state,"PUBLIC_EVENT_IDENTIFIED");
});

t("NL05 event discovered after open cannot backdate",()=>{
  const r=classifyPublicEventCoverage({
    requiredLanes:required,coveredLanes:required,coverageComplete:true,
    knownAt:"2026-10-07T08:55:00+08:00",predictorFreezeAt:freeze,
    eventIdentified:true,eventKnownAt:"2026-10-07T10:00:00+08:00"
  });
  assert.equal(r.state,"PUBLIC_EVENT_DISCOVERED_AFTER_OPEN");
});

t("NL06 negative prior close OFI is observed sell pressure",()=>{
  const r=classifyInventoryPressure({priorCloseOfi:-0.25,pressureCoverageComplete:true,directionKnown:true});
  assert.equal(r.state,"PRIOR_CLOSE_SELL_PRESSURE_OBSERVED");
});

t("NL07 positive prior close OFI is observed buy pressure",()=>{
  const r=classifyInventoryPressure({priorCloseOfi:0.30,pressureCoverageComplete:true,directionKnown:true});
  assert.equal(r.state,"PRIOR_CLOSE_BUY_PRESSURE_OBSERVED");
});

t("NL08 prior close plus opening pressure creates chain state",()=>{
  const r=classifyInventoryPressure({
    priorCloseOfi:-0.2,
    openingImbalance:{observed:true},
    pressureCoverageComplete:true,
    directionKnown:true
  });
  assert.equal(r.state,"PRIOR_CLOSE_AND_OPENING_PRESSURE_CHAIN");
});

t("NL09 complete pressure coverage with no observation stays no-certified-pressure",()=>{
  const r=classifyInventoryPressure({pressureCoverageComplete:true,directionKnown:true});
  assert.equal(r.state,"NO_CERTIFIED_INVENTORY_PRESSURE_CONTEXT");
  assert.equal(r.observedPressure,false);
});

t("NL10 incomplete pressure coverage remains unknown rather than zero",()=>{
  const r=classifyInventoryPressure({pressureCoverageComplete:false});
  assert.equal(r.state,"PRESSURE_CONTEXT_UNKNOWN");
  assert.equal(r.coverageComplete,false);
});

t("NL11 no-event complete plus pressure observed is explicit matrix state",()=>{
  const e={state:"NO_PUBLIC_EVENT_IDENTIFIED_COVERAGE_COMPLETE"};
  const p={state:"OPENING_LIQUIDITY_IMBALANCE_OBSERVED",coverageComplete:true,observedPressure:true};
  const r=classifyEventPressureMatrix({eventCoverage:e,pressure:p});
  assert.equal(r.state,"NO_EVENT_COMPLETE_PRESSURE_OBSERVED");
});

t("NL12 no-event complete plus no observed pressure is separate state",()=>{
  const e={state:"NO_PUBLIC_EVENT_IDENTIFIED_COVERAGE_COMPLETE"};
  const p={state:"NO_CERTIFIED_INVENTORY_PRESSURE_CONTEXT",coverageComplete:true,observedPressure:false};
  const r=classifyEventPressureMatrix({eventCoverage:e,pressure:p});
  assert.equal(r.state,"NO_EVENT_COMPLETE_NO_PRESSURE_OBSERVED");
});

t("NL13 strict residual cohort requires event completeness",()=>{
  const r=validateStrictResidualCohort({
    eventCoverage:{state:"PUBLIC_EVENT_STATUS_UNKNOWN"},
    pressure:{coverageComplete:true,observedPressure:false},
    corporateActionResolved:true,auctionReplaySafe:true
  });
  assert.equal(r.status,"NOT_ELIGIBLE");
  assert.equal(r.reason,"NO_EVENT_COMPLETENESS_NOT_PROVEN");
});

t("NL14 strict residual cohort rejects observed pressure",()=>{
  const r=validateStrictResidualCohort({
    eventCoverage:{state:"NO_PUBLIC_EVENT_IDENTIFIED_COVERAGE_COMPLETE"},
    pressure:{coverageComplete:true,observedPressure:true},
    corporateActionResolved:true,auctionReplaySafe:true
  });
  assert.equal(r.reason,"OBSERVED_PRESSURE_PRESENT");
});

t("NL15 strict residual does not claim no latent pressure",()=>{
  const r=validateStrictResidualCohort({
    eventCoverage:{state:"NO_PUBLIC_EVENT_IDENTIFIED_COVERAGE_COMPLETE"},
    pressure:{coverageComplete:true,observedPressure:false},
    corporateActionResolved:true,auctionReplaySafe:true
  });
  assert.equal(r.status,"STRICT_NO_EVENT_NO_OBSERVED_PRESSURE");
  assert.equal(r.latentPressureExcluded,false);
  assert.equal(r.noInformationClaimAllowed,false);
});

t("NL16 returns cannot reconstruct OFI",()=>{
  const r=validatePressureInference({inferOfiFromReturn:true});
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"RETURN_CANNOT_RECONSTRUCT_OFI");
});

t("NL17 top-five depth cannot reconstruct hidden full book",()=>{
  const r=validatePressureInference({inferHiddenBookFromTopFive:true});
  assert.equal(r.reason,"TOP_FIVE_CANNOT_RECONSTRUCT_FULL_BOOK");
});

t("NL18 reversal cannot identify inventory causally",()=>{
  const r=validatePressureInference({inferInventoryFromReversal:true});
  assert.equal(r.reason,"REVERSAL_DOES_NOT_IDENTIFY_INVENTORY");
});

t("NL19 price/book cannot identify trader intent",()=>{
  const r=validatePressureInference({inferTraderIntent:true});
  assert.equal(r.reason,"PRICE_OR_BOOK_DOES_NOT_IDENTIFY_INTENT");
});

t("NL20 multiple no-event/liquidity representations remain one evidence family",()=>{
  const frame=buildNoEventLiquidityFrame({
    parentDecisionId:"P1",
    eventCoverage:{state:"NO_PUBLIC_EVENT_IDENTIFIED_COVERAGE_COMPLETE"},
    pressure:{state:"NO_CERTIFIED_INVENTORY_PRESSURE_CONTEXT"},
    matrix:{state:"NO_EVENT_COMPLETE_NO_PRESSURE_OBSERVED"},
    rawRepresentationCount:5
  });
  assert.equal(frame.effectiveIndependentEvidenceCount,1);
  assert.equal(frame.independentVoteAllowed,false);
  assert.equal(frame.outcomeJoinAllowed,false);
});

console.log(`SUMMARY ${pass}/20 PASS`);
