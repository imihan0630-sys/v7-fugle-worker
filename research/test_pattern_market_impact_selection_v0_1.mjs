import assert from "node:assert/strict";
import {
  classifyImpactMeasurement,
  computeParticipationRate,
  classifyResponseWindow,
  classifyOwnImpactAlignment,
  validateImpactModelReceipt,
  buildImpactOpportunityDenominator
} from "./pattern_market_impact_selection_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("MI01 no real order means no verified impact",()=>{
  const r=classifyImpactMeasurement({realOrderSubmitted:false});
  assert.equal(r.state,"NO_REAL_ORDER");
  assert.equal(r.verifiedImpact,false);
});

t("MI02 local interval receipt can verify impact measurement",()=>{
  const r=classifyImpactMeasurement({
    realOrderSubmitted:true,
    impactReceipt:{localVerified:true,executedQuantity:1000,marketVolumeInterval:10000}
  });
  assert.equal(r.state,"LOCAL_IMPACT_RECEIPT_VALID");
  assert.equal(r.verifiedImpact,true);
});

t("MI03 foreign or model proxy is not verified realized impact",()=>{
  const r=classifyImpactMeasurement({
    realOrderSubmitted:true,
    modelProxy:{available:true}
  });
  assert.equal(r.state,"IMPACT_MODEL_PROXY_ONLY");
  assert.equal(r.verifiedImpact,false);
});

t("MI04 participation rate uses interval market volume",()=>{
  const r=computeParticipationRate({executedQuantity:2000,marketVolumeInterval:10000});
  assert.equal(r.status,"VALID_INTERVAL_PARTICIPATION");
  assert.equal(r.participationRate,0.2);
});

t("MI05 daily-volume ratio is proxy only",()=>{
  const r=computeParticipationRate({executedQuantity:2000,dailyVolumeProxy:100000});
  assert.equal(r.status,"PROXY_ONLY");
  assert.equal(r.promotionGrade,false);
});

t("MI06 missing interval denominator leaves participation unknown",()=>{
  const r=computeParticipationRate({executedQuantity:2000});
  assert.equal(r.status,"PARTICIPATION_RATE_UNKNOWN");
});

t("MI07 no execution is clean no-execution reference",()=>{
  const r=classifyResponseWindow({
    structuralOpportunityAt:"2026-10-01T09:30:00+08:00",
    predictorFreezeAt:"2026-10-01T09:30:00+08:00",
    responseObservedAt:"2026-10-01T09:31:00+08:00",
    realOrderSubmitted:false
  });
  assert.equal(r.state,"NO_EXECUTION_REFERENCE");
});

t("MI08 response before execution is pre-execution response",()=>{
  const r=classifyResponseWindow({
    structuralOpportunityAt:"2026-10-01T09:30:00+08:00",
    predictorFreezeAt:"2026-10-01T09:30:00+08:00",
    executionStartAt:"2026-10-01T09:32:00+08:00",
    executionEndAt:"2026-10-01T09:35:00+08:00",
    responseObservedAt:"2026-10-01T09:31:00+08:00",
    realOrderSubmitted:true
  });
  assert.equal(r.state,"PRE_EXECUTION_RESPONSE");
});

t("MI09 execution before freeze contaminates baseline",()=>{
  const r=classifyResponseWindow({
    structuralOpportunityAt:"2026-10-01T09:30:00+08:00",
    predictorFreezeAt:"2026-10-01T09:31:00+08:00",
    executionStartAt:"2026-10-01T09:30:30+08:00",
    responseObservedAt:"2026-10-01T09:32:00+08:00",
    realOrderSubmitted:true
  });
  assert.equal(r.state,"EXECUTION_OVERLAP_RESPONSE");
  assert.equal(r.baselineContaminated,true);
});

t("MI10 response during execution is overlap state",()=>{
  const r=classifyResponseWindow({
    structuralOpportunityAt:"2026-10-01T09:30:00+08:00",
    predictorFreezeAt:"2026-10-01T09:30:00+08:00",
    executionStartAt:"2026-10-01T09:31:00+08:00",
    executionEndAt:"2026-10-01T09:35:00+08:00",
    responseObservedAt:"2026-10-01T09:33:00+08:00",
    realOrderSubmitted:true
  });
  assert.equal(r.state,"EXECUTION_OVERLAP_RESPONSE");
});

t("MI11 post execution window is explicit",()=>{
  const r=classifyResponseWindow({
    structuralOpportunityAt:"2026-10-01T09:30:00+08:00",
    predictorFreezeAt:"2026-10-01T09:30:00+08:00",
    executionStartAt:"2026-10-01T09:31:00+08:00",
    executionEndAt:"2026-10-01T09:35:00+08:00",
    responseObservedAt:"2026-10-01T09:40:00+08:00",
    realOrderSubmitted:true
  });
  assert.equal(r.state,"POST_EXECUTION_DECAY_WINDOW");
});

t("MI12 buy aligned with expected up rejection is contamination-aligned",()=>{
  assert.equal(classifyOwnImpactAlignment({side:"BUY",expectedStructuralDirection:"UP"}).state,"ALIGNED");
});

t("MI13 sell aligned with expected down rejection is contamination-aligned",()=>{
  assert.equal(classifyOwnImpactAlignment({side:"SELL",expectedStructuralDirection:"DOWN"}).state,"ALIGNED");
});

t("MI14 opposite direction is explicit",()=>{
  assert.equal(classifyOwnImpactAlignment({side:"SELL",expectedStructuralDirection:"UP"}).state,"OPPOSED");
});

t("MI15 foreign calibration does not qualify as local calibration",()=>{
  const r=validateImpactModelReceipt({
    venue:"TWSE",instrument:"COMMON_STOCK",
    calibrationVenue:"NYSE",calibrationInstrument:"COMMON_STOCK",
    calibrationKnownAt:"2026-09-01",predictorFreezeAt:"2026-10-01"
  });
  assert.equal(r.status,"LOCAL_CALIBRATION_NOT_VALID");
});

t("MI16 future calibration is invalid",()=>{
  const r=validateImpactModelReceipt({
    venue:"TWSE",instrument:"COMMON_STOCK",
    calibrationVenue:"TWSE",calibrationInstrument:"COMMON_STOCK",
    calibrationKnownAt:"2026-10-02",predictorFreezeAt:"2026-10-01"
  });
  assert.equal(r.reason,"CALIBRATION_NOT_KNOWN_AT_FREEZE");
});

t("MI17 local PIT calibration receipt can be valid",()=>{
  const r=validateImpactModelReceipt({
    venue:"TWSE",instrument:"COMMON_STOCK",
    calibrationVenue:"TWSE",calibrationInstrument:"COMMON_STOCK",
    calibrationKnownAt:"2026-09-01",predictorFreezeAt:"2026-10-01",
    outOfSampleStatus:"UNKNOWN"
  });
  assert.equal(r.status,"LOCAL_CALIBRATION_RECEIPT_VALID");
});

t("MI18 denominator preserves nonfills and cancellations",()=>{
  const r=buildImpactOpportunityDenominator([
    {state:"NO_ORDER_SUBMITTED"},
    {state:"FILLED"},
    {state:"CANCELLED"},
    {state:"UNFILLED_STUDY_END"}
  ]);
  assert.equal(r.total,4);
  assert.equal(r.counts.FILLED,1);
  assert.equal(r.counts.CANCELLED,1);
  assert.equal(r.fillOnlySampleAllowed,false);
});

t("MI19 missing states fail into data blocked",()=>{
  const r=buildImpactOpportunityDenominator([{state:"SOMETHING_UNKNOWN"}]);
  assert.equal(r.counts.DATA_BLOCKED,1);
});

t("MI20 linked impact mechanisms remain one effective evidence family",()=>{
  const r=buildImpactOpportunityDenominator([{state:"FILLED"},{state:"PARTIAL"}]);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

console.log(`SUMMARY ${pass}/20 PASS`);
