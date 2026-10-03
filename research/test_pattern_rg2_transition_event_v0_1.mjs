import assert from "node:assert/strict";
import {buildRg2FirstTransitionEvents,compareRg2TransitionEvent} from "./pattern_rg2_transition_event_v0_1.mjs";
let pass=0; const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const base=()=>({
 relationEpisodeKey:"REL1",structuralIdentityFingerprint:"FP1",
 localSemanticSpaceId:"TECHNICAL_CONTINUITY",parentSemanticSpaceId:"TECHNICAL_CONTINUITY",
 asOf:"2026-10-10",decisionCutoffAt:"2026-10-10T18:10:00+08:00",
 lifecyclePathCompletenessState:"COMPLETE_THROUGH_ASOF",
 clocks:{
  localFirstBreakAt:"2026-10-01",
  firstParentZoneEntryAt:"2026-10-02",
  parentFirstBreakAt:"2026-10-03",
  parentFirstOrdinaryObservableAt:"2026-10-03",
  parentFirstPostBreakOutsideCloseAt:"2026-10-05",
  parentFirstReentryAt:"2026-10-07",
  parentFirstFailureAt:"2026-10-07",
  parentFirstReclaimAt:"2026-10-09"
 },
 availableAtByClock:{
  localFirstBreakAt:"2026-10-01T13:31:00+08:00",
  firstParentZoneEntryAt:"2026-10-02T13:31:00+08:00",
  parentFirstBreakAt:"2026-10-03T13:31:00+08:00",
  parentFirstOrdinaryObservableAt:"2026-10-03T13:31:00+08:00",
  parentFirstPostBreakOutsideCloseAt:"2026-10-05T13:31:00+08:00",
  parentFirstReentryAt:"2026-10-07T13:31:00+08:00",
  parentFirstFailureAt:"2026-10-07T13:31:00+08:00",
  parentFirstReclaimAt:"2026-10-09T13:31:00+08:00"
 }
});

t("TE01 repeated states create one first event per type",()=>{
 const r=buildRg2FirstTransitionEvents(base()); assert.equal(r.status,"VALID");
 assert.equal(new Set(r.events.map(x=>x.transitionEventKey)).size,r.events.length);
});
t("TE02 event date excluded from event identity",()=>{
 const r=buildRg2FirstTransitionEvents(base());
 const e=r.events.find(x=>x.eventType==="PARENT_BREAK_CONFIRMED");
 assert(!decodeURIComponent(e.transitionEventKey).includes("2026-10-03"));
});
t("TE03 future event excluded by asOf prefix",()=>{
 const x=base(); x.asOf="2026-10-06"; x.decisionCutoffAt="2026-10-06T18:10:00+08:00";
 const r=buildRg2FirstTransitionEvents(x);
 assert(!r.events.some(e=>e.eventType==="PARENT_REENTRY"));
 assert(!r.events.some(e=>e.eventType==="PARENT_FAILURE"));
});
t("TE04 failure and reentry same bar share source group",()=>{
 const r=buildRg2FirstTransitionEvents(base());
 const a=r.events.find(e=>e.eventType==="PARENT_REENTRY"),b=r.events.find(e=>e.eventType==="PARENT_FAILURE");
 assert.equal(a.sourceEventGroupKey,b.sourceEventGroupKey);
});
t("TE05 same-day local and parent break share source group",()=>{
 const x=base(); x.clocks.localFirstBreakAt="2026-10-03"; x.availableAtByClock.localFirstBreakAt="2026-10-03T13:31:00+08:00";
 const r=buildRg2FirstTransitionEvents(x);
 const a=r.events.find(e=>e.eventType==="LOCAL_BREAK_CONFIRMED"),b=r.events.find(e=>e.eventType==="PARENT_BREAK_CONFIRMED");
 assert.equal(a.sourceEventGroupKey,b.sourceEventGroupKey);
});
t("TE06 post-break hold must be strictly later than break",()=>{
 const x=base(); x.clocks.parentFirstPostBreakOutsideCloseAt="2026-10-03";
 const r=buildRg2FirstTransitionEvents(x); assert.equal(r.reason,"POST_BREAK_HOLD_NOT_STRICTLY_AFTER_BREAK");
});
t("TE07 failure may equal reentry but not precede it",()=>{
 const x=base(); x.clocks.parentFirstFailureAt="2026-10-06";
 const r=buildRg2FirstTransitionEvents(x); assert.equal(r.reason,"FAILURE_PRECEDES_REENTRY");
});
t("TE08 reclaim must occur after return event",()=>{
 const x=base(); x.clocks.parentFirstReclaimAt="2026-10-07";
 const r=buildRg2FirstTransitionEvents(x); assert.equal(r.reason,"RECLAIM_NOT_AFTER_RETURN_EVENT");
});
t("TE09 incomplete path cannot certify first clocks",()=>{
 const x=base(); x.lifecyclePathCompletenessState="PARTIAL_GAP";
 const r=buildRg2FirstTransitionEvents(x); assert.equal(r.status,"CLOCK_UNCERTIFIED"); assert.equal(r.promotionEventStudyEligible,false);
});
t("TE10 semantic-space conflict fails closed",()=>{
 const x=base(); x.parentSemanticSpaceId="RAW_EXECUTION";
 const r=buildRg2FirstTransitionEvents(x); assert.equal(r.reason,"SEMANTIC_SPACE_CONFLICT");
});
t("TE11 event unavailable by decision cutoff is not backfilled",()=>{
 const x=base(); x.asOf="2026-10-03"; x.decisionCutoffAt="2026-10-03T12:00:00+08:00";
 const r=buildRg2FirstTransitionEvents(x); assert(!r.events.some(e=>e.eventType==="PARENT_BREAK_CONFIRMED"));
});
t("TE12 all transition events are non-voting",()=>{
 const r=buildRg2FirstTransitionEvents(base()); assert(r.events.every(e=>e.independentEventVoteEligible===false));
});
t("TE13 same event key changed first clock is conflict",()=>{
 const r=buildRg2FirstTransitionEvents(base());
 const e=r.events.find(x=>x.eventType==="PARENT_BREAK_CONFIRMED");
 const q={...e,eventOccurredAt:"2026-10-04"};
 const c=compareRg2TransitionEvent(e,q); assert.equal(c.status,"PROVENANCE_CONFLICT"); assert(c.changedFields.includes("eventOccurredAt"));
});
t("TE14 exact replay is idempotent",()=>{
 const r=buildRg2FirstTransitionEvents(base()); const e=r.events[0];
 assert.equal(compareRg2TransitionEvent(e,{...e}).status,"SAME_EVENT_EXACT");
});
t("TE15 zone entry cannot precede local break",()=>{
 const x=base(); x.clocks.firstParentZoneEntryAt="2026-09-30";
 const r=buildRg2FirstTransitionEvents(x); assert.equal(r.reason,"PARENT_ZONE_ENTRY_PRECEDES_LOCAL_BREAK");
});

console.log(`SUMMARY ${pass}/15 PASS`);
