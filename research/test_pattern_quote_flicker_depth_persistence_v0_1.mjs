import assert from "node:assert/strict";
import {
  classifyDepthPersistence,
  classifyPersistenceTiming,
  buildFlickerComparator,
  informationLineage,
  manipulationInferenceGuard
} from "./pattern_quote_flicker_depth_persistence_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("QF01 valid survival receipt can certify durable displayed depth",()=>{
  const r=classifyDepthPersistence({
    eventClockValid:true,orderIdentityAvailable:true,snapshotOnly:false,
    survivalReceipt:{verified:true}
  });
  assert.equal(r.state,"DEPTH_SURVIVAL_CERTIFIED");
});

t("QF02 same-price replacement is distinct from survival",()=>{
  const r=classifyDepthPersistence({
    eventClockValid:true,orderIdentityAvailable:true,snapshotOnly:false,
    replacementReceipt:{verified:true}
  });
  assert.equal(r.state,"DEPTH_REPLACED_SAME_PRICE");
});

t("QF03 verified flicker dominates apparent persistence label",()=>{
  const r=classifyDepthPersistence({
    eventClockValid:true,orderIdentityAvailable:true,snapshotOnly:false,
    survivalReceipt:{verified:true},
    flickerReceipt:{verified:true}
  });
  assert.equal(r.state,"FLICKERING_DISPLAYED_DEPTH");
});

t("QF04 sparse snapshots cannot certify survival",()=>{
  const r=classifyDepthPersistence({
    eventClockValid:true,orderIdentityAvailable:true,snapshotOnly:true,
    survivalReceipt:{verified:true}
  });
  assert.equal(r.state,"DEPTH_PERSISTENCE_UNKNOWN");
  assert.equal(r.reason,"SPARSE_SNAPSHOT_ONLY");
});

t("QF05 incomplete event clock blocks persistence",()=>{
  const r=classifyDepthPersistence({
    eventClockValid:false,orderIdentityAvailable:true,snapshotOnly:false
  });
  assert.equal(r.reason,"EVENT_CLOCK_INCOMPLETE");
});

t("QF06 missing order identity blocks same-order survival",()=>{
  const r=classifyDepthPersistence({
    eventClockValid:true,orderIdentityAvailable:false,snapshotOnly:false
  });
  assert.equal(r.reason,"ORDER_IDENTITY_UNAVAILABLE");
});

t("QF07 future survival cannot become baseline",()=>{
  const r=classifyPersistenceTiming({
    predictorFreezeAt:"2026-10-06T10:00:00+08:00",
    firstObservableAt:"2026-10-06T09:59:00+08:00",
    persistenceKnownAt:"2026-10-06T10:00:05+08:00",
    replaySafe:true,eventClockComplete:true
  });
  assert.equal(r.status,"POST_TREATMENT_PERSISTENCE");
});

t("QF08 pre-freeze persistence receipt may be baseline",()=>{
  const r=classifyPersistenceTiming({
    predictorFreezeAt:"2026-10-06T10:00:00+08:00",
    firstObservableAt:"2026-10-06T09:59:00+08:00",
    persistenceKnownAt:"2026-10-06T09:59:30+08:00",
    replaySafe:true,eventClockComplete:true
  });
  assert.equal(r.status,"BASELINE_AVAILABLE");
});

t("QF09 replay-unsafe receipt fails closed",()=>{
  const r=classifyPersistenceTiming({
    predictorFreezeAt:"2026-10-06T10:00:00+08:00",
    firstObservableAt:"2026-10-06T09:59:00+08:00",
    persistenceKnownAt:"2026-10-06T09:59:30+08:00",
    replaySafe:false,eventClockComplete:true
  });
  assert.equal(r.status,"DATA_BLOCKED");
  assert.equal(r.reason,"REPLAY_UNSAFE");
});

t("QF10 generic flicker comparator remains non-independent",()=>{
  const r=buildFlickerComparator({
    nearFrozenZone:false,contextMatched:true,d05ReceiptVerified:true
  });
  assert.equal(r.status,"G0_GENERIC_FLICKER_OR_REPLACEMENT");
  assert.equal(r.independentVote,false);
});

t("QF11 zone-associated flicker comparator remains non-independent",()=>{
  const r=buildFlickerComparator({
    nearFrozenZone:true,contextMatched:true,d05ReceiptVerified:true
  });
  assert.equal(r.status,"G1_ZONE_ASSOCIATED_FLICKER_OR_REPLACEMENT");
  assert.equal(r.independentVote,false);
});

t("QF12 unmatched comparator context is unknown",()=>{
  const r=buildFlickerComparator({
    nearFrozenZone:true,contextMatched:false,d05ReceiptVerified:true
  });
  assert.equal(r.status,"UNKNOWN");
});

t("QF13 many mechanism receipts remain one causal evidence family",()=>{
  const r=informationLineage({
    parentDecisionId:"P1",
    receipts:["zone","depth","cancel","repost","flicker"]
  });
  assert.equal(r.rawReceiptCount,5);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.independentVoteAllowed,false);
});

t("QF14 flicker alone cannot prove manipulation",()=>{
  const r=manipulationInferenceGuard({
    flickerDetected:true,regulatoryOrOwnerEvidence:false
  });
  assert.equal(r.status,"FLICKER_WITHOUT_MANIPULATION_INFERENCE");
  assert.equal(r.manipulationClaimAllowed,false);
});

t("QF15 external evidence is required for manipulation claim",()=>{
  const r=manipulationInferenceGuard({
    flickerDetected:true,regulatoryOrOwnerEvidence:true
  });
  assert.equal(r.status,"EXTERNAL_MANIPULATION_EVIDENCE_PRESENT");
});

t("QF16 first observation after freeze is post-treatment",()=>{
  const r=classifyPersistenceTiming({
    predictorFreezeAt:"2026-10-06T10:00:00+08:00",
    firstObservableAt:"2026-10-06T10:00:01+08:00",
    persistenceKnownAt:"2026-10-06T10:00:05+08:00",
    replaySafe:true,eventClockComplete:true
  });
  assert.equal(r.status,"POST_TREATMENT");
});

t("QF17 event clock must be complete even if timestamps exist",()=>{
  const r=classifyPersistenceTiming({
    predictorFreezeAt:"2026-10-06T10:00:00+08:00",
    firstObservableAt:"2026-10-06T09:59:00+08:00",
    persistenceKnownAt:"2026-10-06T09:59:30+08:00",
    replaySafe:true,eventClockComplete:false
  });
  assert.equal(r.status,"DATA_BLOCKED");
  assert.equal(r.reason,"EVENT_CLOCK_INCOMPLETE");
});

t("QF18 no certified state remains unknown",()=>{
  const r=classifyDepthPersistence({
    eventClockValid:true,orderIdentityAvailable:true,snapshotOnly:false
  });
  assert.equal(r.state,"DEPTH_PERSISTENCE_UNKNOWN");
});

console.log(`SUMMARY ${pass}/18 PASS`);
