import assert from "node:assert/strict";
import {
  buildAgingState,
  classifyObservability,
  classifyDecayCohortEntry,
  buildInteractionOpportunitySnapshot
} from "./pattern_structural_aging_observability_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const root={firstConfirmedAt:"2026-09-01"};
const version={effectiveAt:"2026-09-10"};
const sessionReceipt={
  complete:true,
  firstConfirmedOrdinal:100,
  versionEffectiveOrdinal:107,
  asOfOrdinal:120
};
const active={
  coverageComplete:true,
  rootLookbackObservable:true,
  detectorExecuted:true,
  objectEmitted:true,
  rootFollowupAvailable:true,
  observableSessionsSinceConfirmation:20
};

t("AG01 eligible-session root age and version age remain separate",()=>{
  const r=buildAgingState({root,currentVersion:version,asOf:"2026-10-01",sessionReceipt,observability:active});
  assert.equal(r.rootAgeEligibleSessions,20);
  assert.equal(r.versionAgeEligibleSessions,13);
});

t("AG02 causal version refresh does not reset root age",()=>{
  const v2={effectiveAt:"2026-09-20"};
  const sr={...sessionReceipt,versionEffectiveOrdinal:115};
  const r=buildAgingState({root,currentVersion:v2,asOf:"2026-10-01",sessionReceipt:sr,observability:active});
  assert.equal(r.rootAgeEligibleSessions,20);
  assert.equal(r.versionAgeEligibleSessions,5);
});

t("AG03 incomplete session ordinal receipt blocks promotion-grade age",()=>{
  const r=buildAgingState({
    root,currentVersion:version,asOf:"2026-10-01",
    sessionReceipt:{...sessionReceipt,complete:false},
    observability:active
  });
  assert.equal(r.status,"DATA_BLOCKED");
});

t("AG04 rolling-window censoring is detector censoring, not market invalidation",()=>{
  const r=classifyObservability({
    coverageComplete:true,
    rootLookbackObservable:false,
    rootFollowupAvailable:true
  });
  assert.equal(r.state,"WINDOW_CENSORED_ROOT_PERSISTED");
  assert.equal(r.eventType,"DETECTOR_CENSORING");
  assert.equal(r.rootFollowupAvailable,true);
});

t("AG05 root chronological age can continue while detector reconstructibility stops",()=>{
  const r=buildAgingState({
    root,currentVersion:version,asOf:"2026-10-01",sessionReceipt,
    observability:{
      coverageComplete:true,
      rootLookbackObservable:false,
      rootFollowupAvailable:true,
      observableSessionsSinceConfirmation:12
    }
  });
  assert.equal(r.rootAgeEligibleSessions,20);
  assert.equal(r.observableSessionAge,12);
  assert.equal(r.detectorReconstructible,false);
  assert.equal(r.rootFollowupAvailable,true);
});

t("AG06 unknown coverage gap is not structural decay",()=>{
  const r=classifyObservability({
    coverageComplete:false,
    rootFollowupAvailable:true
  });
  assert.equal(r.state,"UNKNOWN_COVERAGE_GAP");
  assert.equal(r.eventType,"UNKNOWN");
});

t("AG07 complete detector absence remains detector state",()=>{
  const r=classifyObservability({
    coverageComplete:true,
    rootLookbackObservable:true,
    detectorExecuted:true,
    objectEmitted:false,
    rootFollowupAvailable:true
  });
  assert.equal(r.state,"DETECTOR_ABSENT_COMPLETE_SCAN");
  assert.equal(r.eventType,"DETECTOR_STATE");
});

t("AG08 explicit market invalidation is a market event",()=>{
  const r=classifyObservability({marketInvalidated:true});
  assert.equal(r.state,"MARKET_INVALIDATED");
  assert.equal(r.eventType,"MARKET_EVENT");
});

t("AG09 study end is right censoring rather than failure",()=>{
  const r=classifyObservability({
    studyEnded:true,
    detectorReconstructible:true,
    rootFollowupAvailable:true
  });
  assert.equal(r.state,"STUDY_END_RIGHT_CENSORED");
  assert.equal(r.eventType,"CENSORING");
});

t("AG10 unknown first confirmation is left-truncated and not promotion-grade",()=>{
  const r=classifyDecayCohortEntry({
    firstConfirmationCertified:false,
    observationStartAt:"2026-09-01",
    replayHistoryComplete:false
  });
  assert.equal(r.status,"LEFT_TRUNCATED_FIRST_CONFIRMATION_UNKNOWN");
  assert.equal(r.promotionGrade,false);
});

t("AG11 historical root can be promotion-grade only with exact first confirmation replay",()=>{
  const r=classifyDecayCohortEntry({
    firstConfirmationCertified:true,
    firstConfirmedAt:"2026-08-01",
    observationStartAt:"2026-09-01",
    replayHistoryComplete:true
  });
  assert.equal(r.status,"HISTORICAL_REPLAY_FIRST_CONFIRMATION_CERTIFIED");
  assert.equal(r.promotionGrade,true);
});

t("AG12 non-opportunity day cannot become pseudo failure",()=>{
  const aging=buildAgingState({root,currentVersion:version,asOf:"2026-10-01",sessionReceipt,observability:active});
  const r=buildInteractionOpportunitySnapshot({
    agingState:aging,
    opportunityReceipt:{valid:false},
    asOf:"2026-10-01"
  });
  assert.equal(r.status,"NO_INTERACTION_OPPORTUNITY");
  assert.equal(r.pseudoFailureAllowed,false);
});

t("AG13 interaction history remains separate from age and no decay score is created",()=>{
  const r=buildAgingState({
    root,currentVersion:version,asOf:"2026-10-01",sessionReceipt,observability:active,
    interactionHistory:{priorInteractionCount:7,priorBounceCount:5,priorBreakCount:1,priorReclaimCount:1}
  });
  assert.equal(r.rootAgeEligibleSessions,20);
  assert.equal(r.interactionHistory.priorInteractionCount,7);
  assert.equal(r.interactionHistory.priorBounceCount,5);
  assert.equal(r.scalarDecayScoreDefined,false);
  assert.equal(r.fixedHalfLifeDefined,false);
});

t("AG14 opportunity snapshot contains only pre-opportunity state and no outcome",()=>{
  const aging=buildAgingState({
    root,currentVersion:version,asOf:"2026-10-01",sessionReceipt,observability:active,
    interactionHistory:{priorInteractionCount:2,priorBounceCount:2}
  });
  const r=buildInteractionOpportunitySnapshot({
    agingState:aging,
    opportunityReceipt:{valid:true,asOf:"2026-10-01"},
    asOf:"2026-10-01"
  });
  assert.equal(r.status,"VALID_OPPORTUNITY");
  assert.equal(r.outcomeFieldPresent,false);
  assert.equal(r.pseudoFailureAllowed,false);
});

console.log(`SUMMARY ${pass}/14 PASS`);
