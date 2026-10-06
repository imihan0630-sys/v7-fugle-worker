import assert from "node:assert/strict";
import {
  validateRefillReceipt,
  classifyDepthPath,
  validateTiming,
  localizeRefill,
  classifyRefillMechanism,
  buildEvidenceIdentity
} from "./pattern_queue_refill_vs_structural_rejection_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("QR01 sparse snapshot cannot identify true refill",()=>{
  const r=validateRefillReceipt({d05EventClockValidity:"VALID_FOR_REFILL_ESTIMAND",sourceMode:"SPARSE_SNAPSHOT",replaySafe:true});
  assert.equal(r.status,"REFILL_IDENTIFIABILITY_BLOCKED");
});

t("QR02 invalid D05 event clock blocks refill",()=>{
  const r=validateRefillReceipt({d05EventClockValidity:"UNKNOWN",sourceMode:"EVENT_STREAM",replaySafe:true});
  assert.equal(r.status,"REFILL_IDENTIFIABILITY_BLOCKED");
});

t("QR03 replay unsafe receipt fails closed",()=>{
  const r=validateRefillReceipt({d05EventClockValidity:"VALID_FOR_REFILL_ESTIMAND",sourceMode:"EVENT_STREAM",replaySafe:false});
  assert.equal(r.status,"DATA_BLOCKED");
});

t("QR04 genuine event-stream receipt can be valid",()=>{
  const r=validateRefillReceipt({d05EventClockValidity:"VALID_FOR_REFILL_ESTIMAND",sourceMode:"EVENT_STREAM",replaySafe:true});
  assert.equal(r.status,"VALID");
});

t("QR05 preexisting depth survival differs from refill",()=>{
  const r=classifyDepthPath({preexistingDepthKnown:true,preexistingDepthPresent:true,depletionObserved:false,refillObserved:false});
  assert.equal(r.state,"PREEXISTING_DEPTH_SURVIVED");
});

t("QR06 depletion then valid refill is explicit",()=>{
  const r=classifyDepthPath({preexistingDepthKnown:true,preexistingDepthPresent:true,depletionObserved:true,refillObserved:true,refillReceiptValid:true});
  assert.equal(r.state,"DEPTH_DEPLETED_THEN_REFILLED");
});

t("QR07 depletion without refill remains separate",()=>{
  const r=classifyDepthPath({preexistingDepthKnown:true,preexistingDepthPresent:true,depletionObserved:true,refillObserved:false});
  assert.equal(r.state,"DEPTH_DEPLETED_NO_REFILL");
});

t("QR08 unknown preexisting depth remains unknown",()=>{
  assert.equal(classifyDepthPath({preexistingDepthKnown:false}).state,"DEPTH_STATE_UNKNOWN");
});

t("QR09 observed refill with invalid receipt is blocked",()=>{
  const r=classifyDepthPath({preexistingDepthKnown:true,depletionObserved:true,refillObserved:true,refillReceiptValid:false});
  assert.equal(r.state,"REFILL_IDENTIFIABILITY_BLOCKED");
});

t("QR10 future refill clocks remain post-treatment",()=>{
  const r=validateTiming({
    predictorFreezeAt:"2026-10-06T10:00:00+08:00",
    depthObservedPreFreezeAt:"2026-10-06T09:59:59+08:00",
    refillFirstObservedAt:"2026-10-06T10:00:05+08:00",
    refillConfirmedAt:"2026-10-06T10:00:10+08:00",
    depthRecoveryAt:"2026-10-06T10:01:00+08:00",
    priceRecoveryAt:"2026-10-06T10:02:00+08:00"
  });
  assert.equal(r.status,"VALID");
  assert.ok(r.postTreatmentFields.includes("refillFirstObservedAt"));
});

t("QR11 preexisting depth cannot be first observed after freeze",()=>{
  const r=validateTiming({predictorFreezeAt:"2026-10-06T10:00:00+08:00",depthObservedPreFreezeAt:"2026-10-06T10:00:01+08:00"});
  assert.equal(r.status,"PROHIBITED");
});

t("QR12 refill localization is descriptive only",()=>{
  const r=localizeRefill({refillPrice:101,lower:100,upper:104,atr:2});
  assert.equal(r.refillInsideZone,true);
  assert.equal(r.structuralIdentityDecisionAllowed,false);
  assert.equal(r.mechanismDecisionAllowed,false);
});

t("QR13 refill outside zone gets continuous distance",()=>{
  const r=localizeRefill({refillPrice:108,lower:100,upper:104,atr:2});
  assert.equal(r.refillInsideZone,false);
  assert.equal(r.refillDistanceToZone,4);
  assert.equal(r.refillDistanceAtr,2);
});

t("QR14 generic comparator is mandatory",()=>{
  const r=classifyRefillMechanism({genericComparatorVerified:false,zoneAssociated:true,structuralResidualValidated:false,ownerReceiptValid:true});
  assert.equal(r.state,"NOT_EVALUABLE");
});

t("QR15 zone-associated refill is not structural proof",()=>{
  const r=classifyRefillMechanism({genericComparatorVerified:true,zoneAssociated:true,structuralResidualValidated:false,ownerReceiptValid:true});
  assert.equal(r.state,"ZONE_LOCALIZED_REFILL_ASSOCIATION");
});

t("QR16 multiple mechanism receipts do not multiply N",()=>{
  const r=buildEvidenceIdentity({parentDecisionId:"P1",hasGenuineMicrostructureReceipt:true});
  assert.equal(r.informationRoot,"PRICE_OHLC_PLUS_MICROSTRUCTURE_CONTEXT");
  assert.equal(r.rawReceiptCount,2);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.independentVoteAllowed,false);
});

console.log(`SUMMARY ${pass}/16 PASS`);