import assert from "node:assert/strict";
import {
  validateQuotePersistenceSource,
  classifyDisplayedLiquidity,
  validatePersistenceTiming,
  classifyIntentClaim,
  comparePersistenceProfile,
  evidenceIdentity
} from "./pattern_quote_flicker_vs_durable_liquidity_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("QF01 sparse snapshots cannot identify quote lifetime",()=>{
  const r=validateQuotePersistenceSource({sourceMode:"SPARSE_SNAPSHOT",eventClockValidity:"VALID_FOR_QUOTE_PERSISTENCE",replaySafe:true});
  assert.equal(r.status,"SNAPSHOT_ONLY_UNKNOWN_PERSISTENCE");
});

t("QF02 invalid event clock blocks persistence inference",()=>{
  const r=validateQuotePersistenceSource({sourceMode:"EVENT_STREAM",eventClockValidity:"UNKNOWN",replaySafe:true});
  assert.equal(r.status,"EVENT_CLOCK_NOT_EVALUABLE");
});

t("QF03 replay unsafe source is data blocked",()=>{
  const r=validateQuotePersistenceSource({sourceMode:"EVENT_STREAM",eventClockValidity:"VALID_FOR_QUOTE_PERSISTENCE",replaySafe:false});
  assert.equal(r.status,"DATA_BLOCKED");
});

t("QF04 event stream can support persistence semantics",()=>{
  const r=validateQuotePersistenceSource({sourceMode:"EVENT_STREAM",eventClockValidity:"VALID_FOR_QUOTE_PERSISTENCE",replaySafe:true});
  assert.equal(r.status,"VALID");
});

t("QF05 repeated snapshot presence alone remains unknown persistence",()=>{
  const r=classifyDisplayedLiquidity({sourceValid:false,snapshotPresent:true});
  assert.equal(r.state,"SNAPSHOT_ONLY_UNKNOWN_PERSISTENCE");
});

t("QF06 persistent but untested display is separate from pressure survival",()=>{
  const r=classifyDisplayedLiquidity({sourceValid:true,persistenceObserved:true,pressureObserved:false});
  assert.equal(r.state,"PERSISTENT_UNTESTED_DISPLAY");
});

t("QF07 pressure-surviving liquidity needs actual pressure evidence",()=>{
  const r=classifyDisplayedLiquidity({sourceValid:true,persistenceObserved:true,pressureObserved:true,survivedPressure:true});
  assert.equal(r.state,"PRESSURE_SURVIVING_LIQUIDITY_CANDIDATE");
});

t("QF08 cancel-repost cycling has its own state",()=>{
  const r=classifyDisplayedLiquidity({sourceValid:true,cancelRepostObserved:true});
  assert.equal(r.state,"CANCEL_REPOST_CYCLING_CANDIDATE");
});

t("QF09 fleeting display has its own state",()=>{
  const r=classifyDisplayedLiquidity({sourceValid:true,fleetingObserved:true});
  assert.equal(r.state,"FLEETING_DISPLAY_CANDIDATE");
});

t("QF10 depletion-refill remains distinct from persistence",()=>{
  const r=classifyDisplayedLiquidity({sourceValid:true,depletionThenRefill:true});
  assert.equal(r.state,"DEPLETION_REFILL_CANDIDATE");
});

t("QF11 quote observed after freeze is not baseline",()=>{
  const r=validatePersistenceTiming({predictorFreezeAt:"2026-10-06T10:00:00+08:00",firstDisplayedAt:"2026-10-06T10:00:01+08:00"});
  assert.equal(r.status,"UNKNOWN");
  assert.equal(r.reason,"DISPLAY_NOT_KNOWN_AT_FREEZE");
});

t("QF12 later quote survival is post-treatment mechanism state",()=>{
  const r=validatePersistenceTiming({
    predictorFreezeAt:"2026-10-06T10:00:00+08:00",
    firstDisplayedAt:"2026-10-06T09:59:59+08:00",
    survivalAssessmentAt:"2026-10-06T10:00:30+08:00"
  });
  assert.equal(r.status,"VALID");
  assert.equal(r.timing.survivalAssessmentAt,"POST_TREATMENT_MECHANISM");
});

t("QF13 rapid cancellation cannot be called spoofing from book data alone",()=>{
  const r=classifyIntentClaim({claim:"SPOOFING_CONFIRMED",externalAuthorityEvidence:false});
  assert.equal(r.status,"PROHIBITED");
});

t("QF14 generic persistence comparator is mandatory",()=>{
  const r=comparePersistenceProfile({genericComparatorVerified:false,zoneLocalized:true,pressureSurvivalResidualValidated:false});
  assert.equal(r.state,"NOT_EVALUABLE");
});

t("QF15 zone-localized persistence is not residual structural proof",()=>{
  const r=comparePersistenceProfile({genericComparatorVerified:true,zoneLocalized:true,pressureSurvivalResidualValidated:false});
  assert.equal(r.state,"ZONE_LOCALIZED_PERSISTENCE_ASSOCIATION");
});

t("QF16 multiple quote/depth receipts remain one causal parent vote",()=>{
  const r=evidenceIdentity({parentDecisionId:"P1",receiptCount:5});
  assert.equal(r.rawReceiptCount,5);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.independentVoteAllowed,false);
});

console.log(`SUMMARY ${pass}/16 PASS`);