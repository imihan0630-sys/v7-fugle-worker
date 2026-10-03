import assert from "node:assert/strict";
import {buildAsOfEventClockFeature,validateNestedFailureReentry} from "./pattern_first_event_clock_pit_v0_1.mjs";
let pass=0;const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const sessions=["2026-09-21","2026-09-22","2026-09-23","2026-09-24","2026-09-25"];

t("FC01 event today has age zero",()=>{
 const r=buildAsOfEventClockFeature({asOf:"2026-09-25",eventOccurredAt:"2026-09-25",eventAvailableAt:"2026-09-25",firstObservedAt:"2026-09-25",eligibleSessionDates:sessions});
 assert.equal(r.ageEligibleSessions,0);assert.equal(r.occurred,1);
});

t("FC02 prior event has positive eligible-session age",()=>{
 const r=buildAsOfEventClockFeature({asOf:"2026-09-25",eventOccurredAt:"2026-09-22",eligibleSessionDates:sessions});
 assert.equal(r.ageEligibleSessions,3);
});

t("FC03 not-yet-occurred is censored not zero",()=>{
 const r=buildAsOfEventClockFeature({asOf:"2026-09-25",eligibleSessionDates:sessions});
 assert.equal(r.occurred,0);assert.equal(r.ageEligibleSessions,null);
 assert.equal(r.censoringState,"NOT_YET_OCCURRED_THROUGH_ASOF");
});

t("FC04 future event date is leakage-blocked",()=>{
 const r=buildAsOfEventClockFeature({asOf:"2026-09-24",eventOccurredAt:"2026-09-25",eligibleSessionDates:sessions});
 assert.equal(r.reason,"FUTURE_EVENT_CLOCK_IN_PREDICTOR");
});

t("FC05 event known later is unavailable at asOf",()=>{
 const r=buildAsOfEventClockFeature({asOf:"2026-09-24",eventOccurredAt:"2026-09-23",eventAvailableAt:"2026-09-25",eligibleSessionDates:sessions});
 assert.equal(r.reason,"EVENT_NOT_AVAILABLE_BY_ASOF");
});

t("FC06 first-observed later is unavailable at asOf",()=>{
 const r=buildAsOfEventClockFeature({asOf:"2026-09-24",eventOccurredAt:"2026-09-23",eventAvailableAt:"2026-09-23",firstObservedAt:"2026-09-25",eligibleSessionDates:sessions});
 assert.equal(r.reason,"EVENT_NOT_OBSERVED_BY_ASOF");
});

t("FC07 incomplete provenance stays UNKNOWN not censored",()=>{
 const r=buildAsOfEventClockFeature({asOf:"2026-09-25",eligibleSessionDates:sessions,provenanceComplete:false});
 assert.equal(r.status,"UNKNOWN");assert.equal(r.occurred,null);
});

t("FC08 event outside certified session set is blocked",()=>{
 const r=buildAsOfEventClockFeature({asOf:"2026-09-25",eventOccurredAt:"2026-09-20",eligibleSessionDates:sessions});
 assert.equal(r.reason,"EVENT_NOT_IN_CERTIFIED_ELIGIBLE_SET");
});

t("FC09 failure cannot exist without reentry",()=>{
 assert.equal(validateNestedFailureReentry({firstFailureAt:"2026-09-25"}).status,"QA_FAIL");
});

t("FC10 failure cannot precede reentry",()=>{
 const r=validateNestedFailureReentry({firstReentryAt:"2026-09-25",firstFailureAt:"2026-09-24"});
 assert.equal(r.reason,"FAILURE_PRECEDES_REENTRY");
});

t("FC11 same-bar failure/reentry share one source event group",()=>{
 const r=validateNestedFailureReentry({
  firstReentryAt:"2026-09-25",firstFailureAt:"2026-09-25",
  sourceEventGroupKeyReentry:"G1",sourceEventGroupKeyFailure:"G1"
 });
 assert.equal(r.status,"VALID");assert.equal(r.independentConfirmationCount,1);
});

t("FC12 different-time reentry then failure are distinct clocks not votes",()=>{
 const r=validateNestedFailureReentry({firstReentryAt:"2026-09-23",firstFailureAt:"2026-09-25"});
 assert.equal(r.status,"VALID");assert.equal(r.independentConfirmationCount,2);
});

console.log(`SUMMARY ${pass}/12 PASS`);
