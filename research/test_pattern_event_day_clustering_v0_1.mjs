import assert from "node:assert/strict";
import {
  classifyDecisionRelativeEventState,
  validateSurpriseEligibility,
  validateCalendarVintage,
  buildEventReplicationDiagnostics,
  validateEventExclusionPolicy,
  classifyEventCommonSupport
} from "./pattern_event_day_clustering_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};
const freeze="2026-10-05T18:10:00+08:00";

t("EC01 known future macro schedule is pending, not realized",()=>{
  const r=classifyDecisionRelativeEventState({
    predictorFreezeAt:freeze,
    eventReceipt:{
      coverageComplete:true,
      scheduledAt:"2026-10-05T20:30:00+08:00",
      firstKnownScheduledAt:"2026-09-20T10:00:00+08:00",
      eventFamilyId:"CPI",eventInstanceId:"CPI-202610"
    }
  });
  assert.equal(r.status,"E1_SCHEDULED_PENDING");
});

t("EC02 realized release before freeze is realized-pre-freeze",()=>{
  const r=classifyDecisionRelativeEventState({
    predictorFreezeAt:freeze,
    eventReceipt:{
      coverageComplete:true,
      scheduledAt:"2026-10-05T10:00:00+08:00",
      firstKnownScheduledAt:"2026-09-20T10:00:00+08:00",
      releasedAt:"2026-10-05T10:00:00+08:00",
      firstObservedAt:"2026-10-05T10:00:01+08:00",
      eventFamilyId:"ISSUER_EARNINGS",eventInstanceId:"E1"
    }
  });
  assert.equal(r.status,"E2_REALIZED_PRE_FREEZE");
});

t("EC03 unscheduled disclosure known before freeze is explicit",()=>{
  const r=classifyDecisionRelativeEventState({
    predictorFreezeAt:freeze,
    eventReceipt:{
      coverageComplete:true,unscheduled:true,
      firstObservedAt:"2026-10-05T17:00:00+08:00",
      eventFamilyId:"MATERIAL_DISCLOSURE",eventInstanceId:"U1"
    }
  });
  assert.equal(r.status,"E3_UNSCHEDULED_DISCLOSED_PRE_FREEZE");
});

t("EC04 unscheduled event learned after freeze is future",()=>{
  const r=classifyDecisionRelativeEventState({
    predictorFreezeAt:freeze,
    eventReceipt:{
      coverageComplete:true,unscheduled:true,
      firstObservedAt:"2026-10-05T19:00:00+08:00"
    }
  });
  assert.equal(r.status,"E4_EVENT_AFTER_FREEZE_FUTURE");
});

t("EC05 no-known-event is not absolute no-event claim",()=>{
  const r=classifyDecisionRelativeEventState({
    predictorFreezeAt:freeze,
    eventReceipt:{coverageComplete:true,noKnownEvent:true}
  });
  assert.equal(r.status,"E0_NO_KNOWN_EVENT");
  assert.equal(r.noEventClaimIsAbsolute,false);
});

t("EC06 incomplete coverage is unknown, not no-event",()=>{
  const r=classifyDecisionRelativeEventState({
    predictorFreezeAt:freeze,
    eventReceipt:{coverageComplete:false,noKnownEvent:true}
  });
  assert.equal(r.status,"E5_EVENT_CONTEXT_UNKNOWN");
});

t("EC07 surprise after freeze is future-ineligible",()=>{
  const r=validateSurpriseEligibility({
    predictorFreezeAt:freeze,
    releaseFirstObservedAt:"2026-10-05T20:30:01+08:00",
    consensusKnownAt:"2026-10-05T17:00:00+08:00",
    initialReleaseKnownAt:"2026-10-05T20:30:01+08:00",
    revisionUsed:false
  });
  assert.equal(r.status,"FUTURE_NOT_ELIGIBLE");
});

t("EC08 revised macro value cannot replace first print",()=>{
  const r=validateSurpriseEligibility({
    predictorFreezeAt:"2026-10-06T18:10:00+08:00",
    releaseFirstObservedAt:"2026-10-05T20:30:01+08:00",
    consensusKnownAt:"2026-10-05T17:00:00+08:00",
    initialReleaseKnownAt:"2026-10-05T20:30:01+08:00",
    revisionUsed:true
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"REVISED_VALUE_NOT_INITIAL_VINTAGE");
});

t("EC09 consensus timestamp must predate release",()=>{
  const r=validateSurpriseEligibility({
    predictorFreezeAt:"2026-10-06T18:10:00+08:00",
    releaseFirstObservedAt:"2026-10-05T20:30:01+08:00",
    consensusKnownAt:"2026-10-05T20:31:00+08:00",
    initialReleaseKnownAt:"2026-10-05T20:30:01+08:00",
    revisionUsed:false
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"CONSENSUS_NOT_PRE_RELEASE");
});

t("EC10 current calendar cannot backfill historical schedule",()=>{
  const r=validateCalendarVintage({
    predictorFreezeAt:freeze,
    capturedAt:"2026-10-05T10:00:00+08:00",
    firstObservedAt:"2026-10-05T10:00:00+08:00",
    usedCurrentCalendarToBackfill:true
  });
  assert.equal(r.status,"PROHIBITED");
});

t("EC11 future-captured schedule is post-hoc",()=>{
  const r=validateCalendarVintage({
    predictorFreezeAt:freeze,
    capturedAt:"2026-10-05T19:00:00+08:00",
    firstObservedAt:"2026-10-05T19:00:00+08:00",
    usedCurrentCalendarToBackfill:false
  });
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
});

t("EC12 many stocks on one event instance remain one event cluster",()=>{
  const r=buildEventReplicationDiagnostics([
    {marketDate:"2026-10-05",symbol:"A",structuralRootId:"R1",eventState:"E1_SCHEDULED_PENDING",eventFamilyId:"FOMC",eventInstanceId:"FOMC-X",commonEventClusterId:"FOMC-X"},
    {marketDate:"2026-10-05",symbol:"B",structuralRootId:"R2",eventState:"E1_SCHEDULED_PENDING",eventFamilyId:"FOMC",eventInstanceId:"FOMC-X",commonEventClusterId:"FOMC-X"},
    {marketDate:"2026-10-05",symbol:"C",structuralRootId:"R3",eventState:"E1_SCHEDULED_PENDING",eventFamilyId:"FOMC",eventInstanceId:"FOMC-X",commonEventClusterId:"FOMC-X"}
  ]);
  assert.equal(r.stockObservationN,3);
  assert.equal(r.eventInstanceClusterN,1);
  assert.equal(r.commonEventClusterN,1);
});

t("EC13 one event spanning multiple market dates is still one event instance",()=>{
  const r=buildEventReplicationDiagnostics([
    {marketDate:"2026-10-05",symbol:"A",structuralRootId:"R1",eventState:"E1_SCHEDULED_PENDING",eventFamilyId:"FOMC",eventInstanceId:"FOMC-X"},
    {marketDate:"2026-10-06",symbol:"A",structuralRootId:"R1",eventState:"E2_REALIZED_PRE_FREEZE",eventFamilyId:"FOMC",eventInstanceId:"FOMC-X"}
  ]);
  assert.equal(r.marketDateClusterN,2);
  assert.equal(r.eventInstanceClusterN,1);
  assert.equal(r.manyMarketDatesOneEventManyReplications,false);
});

t("EC14 repeated FOMC meetings are multiple instances but one family",()=>{
  const r=buildEventReplicationDiagnostics([
    {marketDate:"2026-09-16",symbol:"A",eventState:"E1_SCHEDULED_PENDING",eventFamilyId:"FOMC",eventInstanceId:"FOMC-SEP"},
    {marketDate:"2026-11-04",symbol:"B",eventState:"E1_SCHEDULED_PENDING",eventFamilyId:"FOMC",eventInstanceId:"FOMC-NOV"}
  ]);
  assert.equal(r.eventInstanceClusterN,2);
  assert.equal(r.eventFamilyN,1);
});

t("EC15 non-event market dates are counted separately",()=>{
  const r=buildEventReplicationDiagnostics([
    {marketDate:"2026-10-01",symbol:"A",eventState:"E0_NO_KNOWN_EVENT"},
    {marketDate:"2026-10-02",symbol:"B",eventState:"E0_NO_KNOWN_EVENT"},
    {marketDate:"2026-10-03",symbol:"C",eventState:"E5_EVENT_CONTEXT_UNKNOWN"}
  ]);
  assert.equal(r.nonEventMarketDateN,2);
  assert.equal(r.unknownEventContextN,1);
});

t("EC16 outcome-selected event family exclusion is prohibited",()=>{
  const r=validateEventExclusionPolicy({
    policyFrozenBeforeOutcome:true,
    selectedFamiliesAfterOutcome:true
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"OUTCOME_SELECTED_EVENT_FAMILY");
});

t("EC17 outcome-selected event dates are prohibited",()=>{
  const r=validateEventExclusionPolicy({
    policyFrozenBeforeOutcome:true,
    selectedDatesAfterOutcome:true
  });
  assert.equal(r.reason,"OUTCOME_SELECTED_EVENT_DATES");
});

t("EC18 frozen event sensitivity policy is valid",()=>{
  const r=validateEventExclusionPolicy({
    policyFrozenBeforeOutcome:true,
    selectedFamiliesAfterOutcome:false,
    selectedDatesAfterOutcome:false,
    shockThresholdOutcomeSelected:false
  });
  assert.equal(r.status,"VALID");
});

t("EC19 event/non-event common-support failure prohibits extrapolation",()=>{
  const r=classifyEventCommonSupport({
    sizeLiquidityOverlap:true,sectorOverlap:true,betaMarketRegimeOverlap:true,
    opportunityGeometryOverlap:true,preEventVolatilityOverlap:false,tradabilityOverlap:true
  });
  assert.equal(r.status,"EVENT_CONTEXT_EXTRAPOLATION_PROHIBITED");
});

t("EC20 full event/non-event common support is valid",()=>{
  const r=classifyEventCommonSupport({
    sizeLiquidityOverlap:true,sectorOverlap:true,betaMarketRegimeOverlap:true,
    opportunityGeometryOverlap:true,preEventVolatilityOverlap:true,tradabilityOverlap:true
  });
  assert.equal(r.status,"COMMON_SUPPORT_VALID");
});

console.log(`SUMMARY ${pass}/20 PASS`);
