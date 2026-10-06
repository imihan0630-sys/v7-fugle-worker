import assert from "node:assert/strict";
import {
  validateLimitReference,
  classifyLimitState,
  classifyQueueCarryover,
  classifyStructureLimitColocation,
  validateLimitQueueReceipt,
  classifyLimitComparator,
  buildPriceLineage
} from "./pattern_price_limit_carryover_firewall_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("PL01 verified limit reference is valid",()=>{
  const r=validateLimitReference({
    openingAuctionReferencePrice:100,upperLimitPrice:110,lowerLimitPrice:90,
    ruleReceiptVerified:true,tickReceiptVerified:true
  });
  assert.equal(r.status,"VALID");
});
t("PL02 missing tick/rule receipt blocks limit inference",()=>{
  const r=validateLimitReference({
    openingAuctionReferencePrice:100,upperLimitPrice:110,lowerLimitPrice:90,
    ruleReceiptVerified:true,tickReceiptVerified:false
  });
  assert.equal(r.status,"DATA_BLOCKED");
});
t("PL03 exempt session does not fabricate limits",()=>{
  const r=validateLimitReference({exemptionState:"PRICE_LIMIT_EXEMPT_OR_NOT_APPLICABLE"});
  assert.equal(r.status,"EXEMPT");
  assert.equal(r.limitApplicable,false);
});
t("PL04 proximity is distinct from actual hit",()=>{
  assert.equal(classifyLimitState({proximityOnly:true}).state,"LIMIT_PROXIMITY_ONLY");
});
t("PL05 hit with known queue is explicit",()=>{
  const r=classifyLimitState({hit:true,queueKnown:true,queueVolume:1000});
  assert.equal(r.state,"LIMIT_HIT_WITH_VERIFIED_QUEUE");
  assert.equal(r.visibleLimitQueueVolume,1000);
});
t("PL06 closing at limit without queue remains unknown queue",()=>{
  const r=classifyLimitState({hit:true,closeAtLimit:true,queueKnown:false});
  assert.equal(r.state,"CLOSE_AT_LIMIT_QUEUE_UNKNOWN");
});
t("PL07 close at limit never proves locked queue by itself",()=>{
  const r=classifyLimitState({hit:true,closeAtLimit:true,queueKnown:true,queueVolume:5000});
  assert.equal(r.lockedQueueProven,false);
});
t("PL08 unlock/relock is separate path state",()=>{
  assert.equal(classifyLimitState({hit:true,closeAtLimit:true,unlockRelock:true}).state,"UNLOCK_RELOCK");
});
t("PL09 day-t physical queue does not persist overnight",()=>{
  const r=classifyQueueCarryover({
    dayTQueueKnown:true,dayTQueueVolume:10000,dayTOrderValidityEnd:"2026-10-07T13:30:00+08:00",
    dayT1QueueKnown:true,dayT1QueueVolume:8000
  });
  assert.equal(r.samePhysicalQueuePersistsOvernight,false);
  assert.equal(r.dayT1ResubmittedOrders.identity,"NEXT_SESSION_RESUBMITTED_ORDERS");
});
t("PL10 queue volume is never copied across sessions",()=>{
  const r=classifyQueueCarryover({
    dayTQueueKnown:true,dayTQueueVolume:10000,dayT1QueueKnown:false
  });
  assert.equal(r.dayT1ResubmittedOrders.volume,null);
  assert.equal(r.copiedQueueVolumeAcrossSessions,false);
});
t("PL11 latent demand carryover is a hypothesis, not physical queue identity",()=>{
  const r=classifyQueueCarryover({latentPressureHypothesis:true});
  assert.equal(r.latentCarryover.status,"LATENT_UNMET_DEMAND_OR_SUPPLY_CARRYOVER_CANDIDATE");
  assert.equal(r.samePhysicalQueuePersistsOvernight,false);
});
t("PL12 structural zone overlapping limit is not confluence vote",()=>{
  const r=classifyStructureLimitColocation({zoneLower:109,zoneUpper:111,limitPrice:110});
  assert.equal(r.status,"STRUCTURE_PRICE_LIMIT_COLOCATION");
  assert.equal(r.independentConfluenceVote,false);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});
t("PL13 nonoverlap is explicit",()=>{
  const r=classifyStructureLimitColocation({zoneLower:100,zoneUpper:104,limitPrice:110});
  assert.equal(r.status,"NO_STRUCTURE_LIMIT_COLOCATION");
});
t("PL14 queue receipt after freeze is ineligible",()=>{
  const r=validateLimitQueueReceipt({
    firstObservableAt:"2026-10-07T13:00:00+08:00",
    knownAt:"2026-10-07T13:20:00+08:00",
    predictorFreezeAt:"2026-10-07T13:10:00+08:00",
    replaySafe:true,queueVolume:5000
  });
  assert.equal(r.status,"POST_FREEZE_NOT_ELIGIBLE");
});
t("PL15 replay-unsafe queue receipt is blocked",()=>{
  const r=validateLimitQueueReceipt({
    firstObservableAt:"2026-10-07T13:00:00+08:00",
    knownAt:"2026-10-07T13:00:00+08:00",
    predictorFreezeAt:"2026-10-07T13:10:00+08:00",
    replaySafe:false,queueVolume:5000
  });
  assert.equal(r.status,"DATA_BLOCKED");
});
t("PL16 same-day generic comparator remains explicit",()=>{
  assert.equal(
    classifyLimitComparator({atStructuralZone:true,limitContextVerified:true,nextDay:false}).status,
    "G1_LIMIT_EVENT_AT_STRUCTURAL_ZONE"
  );
});
t("PL17 next-day comparator is separate from same-day comparator",()=>{
  assert.equal(
    classifyLimitComparator({atStructuralZone:true,limitContextVerified:true,nextDay:true}).status,
    "N1_PRIOR_DAY_LIMIT_EVENT_AT_ZONE"
  );
});
t("PL18 unverified limit context fails closed",()=>{
  assert.equal(classifyLimitComparator({atStructuralZone:true,limitContextVerified:false}).status,"UNKNOWN");
});
t("PL19 queue context is not automatic independent evidence",()=>{
  const r=buildPriceLineage({priceRepresentations:3,queueReceiptPresent:true});
  assert.equal(r.queueContextIsAutomaticIndependentVote,false);
});
t("PL20 default effective evidence count remains one",()=>{
  const r=buildPriceLineage({priceRepresentations:4,queueReceiptPresent:true});
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

console.log(`SUMMARY ${pass}/20 PASS`);
