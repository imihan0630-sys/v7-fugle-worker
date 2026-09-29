import assert from "node:assert/strict";
import {
  attachPostCandleConfirmation,
  bindCandleContextReceipt,
} from "./pattern_candle_context_receipt_v0_1.mjs";

const asOfTimestamp="2026-09-29T14:00:00+08:00";
const observation={
  observationId:"OBS-2330-20260929",detectorVersion:"CANDLE_RELATIONAL_V0_1",
  semanticSpace:"TECHNICAL_CONTINUITY",continuityVersion:"TECHNICAL_CONTINUITY_V1",
  previousDate:"2026-09-28",currentDate:"2026-09-29",sourceBarsHash:"sha256:bars-1",
  computedAt:"2026-09-29T13:40:00+08:00",detectorExecuted:true,outcomeFieldsPresent:false,
  referenceRange:{high:105,low:95},geometry:{bodyToRange:0.2,lowerWickRatio:0.7},
  namedMorphologyLabels:["PAPER_UMBRELLA_SHAPE"],
};
const continuityReceipt={
  id:"TC-1",version:"TECHNICAL_CONTINUITY_V1",semanticSpace:"TECHNICAL_CONTINUITY",
  sourceBarsHash:"sha256:bars-1",knownAt:"2026-09-29T13:35:00+08:00",complete:true,
  sourceBarsThroughDate:"2026-09-29",
  corporateActionCoverageComplete:true,unresolvedRelevantEvents:0,
};
const symbolSessionReceipt={
  id:"SESSION-1",knownAt:"2026-09-29T13:35:00+08:00",complete:true,
  states:[
    {date:"2026-09-28",state:"ELIGIBLE_TRADED_SYMBOL_SESSION"},
    {date:"2026-09-29",state:"ELIGIBLE_TRADED_SYMBOL_SESSION"},
  ],
};
const trend=state=>({
  id:`TREND-${state}`,version:"TREND_CONTEXT_V1",methodId:"FROZEN_PRIOR_SWING_V1",state,
  barsThroughDate:"2026-09-28",knownAt:"2026-09-29T09:00:00+08:00",sourceHash:`sha256:trend-${state}`,complete:true,
});
const location=state=>({
  id:`LOCATION-${state}`,version:"STRUCTURAL_LOCATION_V1",state,
  confirmedThroughDate:"2026-09-28",knownAt:"2026-09-29T09:00:00+08:00",sourceHash:`sha256:location-${state}`,complete:true,
});
const input=(trendState="DOWNTREND",locationState="SUPPORT_ZONE")=>({
  asOfTimestamp,observation,continuityReceipt,symbolSessionReceipt,
  trendContextReceipt:trend(trendState),structuralLocationReceipt:location(locationState),
});

// Same shape, different prior trend: geometry identity stays fixed and no directional sign is inherited.
const afterDecline=bindCandleContextReceipt(input("DOWNTREND"));
const afterAdvance=bindCandleContextReceipt(input("UPTREND"));
assert.equal(afterDecline.status,"READY");
assert.equal(afterAdvance.status,"READY");
assert.equal(afterDecline.observationCommitment,afterAdvance.observationCommitment);
assert.equal(afterDecline.trendContext.contextClass,"AFTER_DECLINE");
assert.equal(afterAdvance.trendContext.contextClass,"AFTER_ADVANCE");
assert.equal(afterDecline.directionalEffect,"UNKNOWN");
assert.equal(afterAdvance.traditionalName,null);
assert.equal(afterAdvance.labelVoteCount,null);

// Unknown context does not destroy valid geometry, but it cannot be silently completed.
const unknown=bindCandleContextReceipt(input("UNKNOWN","UNKNOWN"));
assert.equal(unknown.status,"READY_WITH_UNKNOWN_CONTEXT");

// The pattern bar may not define its own prior trend or structural location.
const leakingTrend=bindCandleContextReceipt({...input(),trendContextReceipt:{...trend("DOWNTREND"),barsThroughDate:"2026-09-29"}});
assert.equal(leakingTrend.status,"DATA_BLOCKED");
assert(leakingTrend.reasons.includes("TREND_CONTEXT_USES_PATTERN_OR_FUTURE_BAR"));
const leakingLocation=bindCandleContextReceipt({...input(),structuralLocationReceipt:{...location("SUPPORT_ZONE"),confirmedThroughDate:"2026-09-29"}});
assert.equal(leakingLocation.status,"DATA_BLOCKED");

// Future-known context, incomplete session membership and unresolved corporate actions fail closed.
const futureContext=bindCandleContextReceipt({...input(),trendContextReceipt:{...trend("DOWNTREND"),knownAt:"2026-09-29T15:00:00+08:00"}});
assert.equal(futureContext.status,"DATA_BLOCKED");
const missingSession=bindCandleContextReceipt({...input(),symbolSessionReceipt:{...symbolSessionReceipt,states:symbolSessionReceipt.states.slice(0,1)}});
assert.equal(missingSession.status,"DATA_BLOCKED");
const unresolvedAction=bindCandleContextReceipt({...input(),continuityReceipt:{...continuityReceipt,unresolvedRelevantEvents:1}});
assert.equal(unresolvedAction.status,"DATA_BLOCKED");
const futureInBaseParent=bindCandleContextReceipt({...input(),continuityReceipt:{...continuityReceipt,sourceBarsThroughDate:"2026-09-30"}});
assert.equal(futureInBaseParent.status,"DATA_BLOCKED");
assert(futureInBaseParent.reasons.includes("CONTINUITY_PARENT_CONTAINS_POST_OBSERVATION_BAR"));

// Mutated observation under a frozen commitment is a provenance conflict.
const mutated={...observation,geometry:{...observation.geometry,lowerWickRatio:0.8}};
const mutation=bindCandleContextReceipt({...input(),observation:mutated,expectedObservationCommitment:afterDecline.observationCommitment});
assert.equal(mutation.status,"PROVENANCE_CONFLICT");

// A post-candle confirmation is a new child receipt and cannot rewrite the original snapshot.
const before=structuredClone(afterDecline);
const confirmationBar={
  date:"2026-09-30",availableAt:"2026-09-30T13:40:00+08:00",close:106,
  semanticSpace:"TECHNICAL_CONTINUITY",continuityReceiptId:"TC-2",parentContinuityReceiptId:"TC-1",
  continuityVersion:"TECHNICAL_CONTINUITY_V1",sourceBarsThroughDate:"2026-09-30",
  symbolSessionState:"ELIGIBLE_TRADED_SYMBOL_SESSION",
};
const confirmed=attachPostCandleConfirmation({contextReceipt:afterDecline,confirmationBar,asOfTimestamp:"2026-09-30T14:00:00+08:00"});
assert.equal(confirmed.status,"READY");
assert.equal(confirmed.confirmationRelation,"CLOSE_ABOVE_OBSERVATION_HIGH");
assert.equal(confirmed.directionalEffect,"UNKNOWN");
assert.deepEqual(afterDecline,before);

const futureConfirmation=attachPostCandleConfirmation({contextReceipt:afterDecline,confirmationBar,asOfTimestamp:"2026-09-30T12:00:00+08:00"});
assert.equal(futureConfirmation.status,"DATA_BLOCKED");
const wrongLineage=attachPostCandleConfirmation({contextReceipt:afterDecline,confirmationBar:{...confirmationBar,parentContinuityReceiptId:"OTHER"},asOfTimestamp:"2026-09-30T14:00:00+08:00"});
assert.equal(wrongLineage.status,"PROVENANCE_CONFLICT");
const reusedGeneration=attachPostCandleConfirmation({contextReceipt:afterDecline,confirmationBar:{...confirmationBar,continuityReceiptId:"TC-1"},asOfTimestamp:"2026-09-30T14:00:00+08:00"});
assert.equal(reusedGeneration.status,"DATA_BLOCKED");
assert(reusedGeneration.reasons.includes("CONFIRMATION_CONTINUITY_GENERATION_NOT_ADVANCED"));

// Same trend but different structural location remains separate context, not a second signal vote.
const resistance=bindCandleContextReceipt(input("DOWNTREND","RESISTANCE_ZONE"));
assert.equal(resistance.observationCommitment,afterDecline.observationCommitment);
assert.notEqual(resistance.structuralLocation.state,afterDecline.structuralLocation.state);
assert.equal(resistance.labelVoteCount,null);

console.log(JSON.stringify({ok:true,status:"PATTERN_CANDLE_CONTEXT_RECEIPT_PASS",assertionGroups:14}));
