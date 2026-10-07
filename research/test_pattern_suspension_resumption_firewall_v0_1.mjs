import assert from "node:assert/strict";
import {
  classifySessionGap,
  buildSuspensionAgeState,
  classifyResumptionPhase,
  classifyResumptionGap,
  validateSuspensionReceipt,
  classifyStaleAnchor,
  classifySuspensionComparator,
  buildSuspensionLineage,
  classifySuspensionFreshness,
  classifyReopeningDiscovery,
  classifyReopeningRootState
} from "./pattern_suspension_resumption_firewall_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("SR01 verified suspension is not source missingness",()=>{
  const r=classifySessionGap({
    marketSessionExpected:true,verifiedSymbolSuspension:true,sourceBarPresent:false
  });
  assert.equal(r.state,"VERIFIED_SUSPENSION_SESSION");
  assert.equal(r.sourceMissing,false);
});
t("SR02 verified suspension never receives pseudo bar",()=>{
  const r=classifySessionGap({verifiedSymbolSuspension:true});
  assert.equal(r.pseudoBarAllowed,false);
});
t("SR03 unexplained expected-session gap remains missing",()=>{
  const r=classifySessionGap({
    marketSessionExpected:true,verifiedSymbolSuspension:false,sourceBarPresent:false
  });
  assert.equal(r.state,"UNEXPLAINED_SOURCE_OR_SESSION_GAP");
});
t("SR04 suspension days do not increment tradable-session age",()=>{
  const r=buildSuspensionAgeState({
    eligibleSessionAgeBefore:20,eligibleSessionsAfterResumption:1,
    suspensionCalendarDays:10,suspensionMarketSessions:6
  });
  assert.equal(r.eligibleTradingSessionAge,21);
  assert.equal(r.tradingSessionAgeIncrementDuringSuspension,0);
});
t("SR05 calendar information age continues during suspension",()=>{
  const r=buildSuspensionAgeState({
    eligibleSessionAgeBefore:20,eligibleSessionsAfterResumption:0,
    suspensionCalendarDays:10,suspensionMarketSessions:6
  });
  assert.equal(r.calendarInformationAgeIncrement,10);
  assert.equal(r.clocksCollapsed,false);
});
t("SR06 first resumption call print is not continuous touch",()=>{
  const r=classifyResumptionPhase({
    suspensionVerified:true,firstCallPrint:true
  });
  assert.equal(r.state,"RESUMPTION_FIRST_CALL_PRINT");
  assert.equal(r.continuousTouch,false);
});
t("SR07 indicative resumption state is not executed price",()=>{
  const r=classifyResumptionPhase({
    suspensionVerified:true,indicativeOnly:true
  });
  assert.equal(r.state,"RESUMPTION_INDICATIVE_STATE");
  assert.equal(r.executedPrice,false);
});
t("SR08 continuous post-resumption phase is distinct",()=>{
  const r=classifyResumptionPhase({
    suspensionVerified:true,continuousTrading:true
  });
  assert.equal(r.state,"POST_RESUMPTION_CONTINUOUS_TRADING");
});
t("SR09 unverified suspension provenance is explicit",()=>{
  assert.equal(classifyResumptionPhase({suspensionVerified:false}).state,"SUSPENSION_PROVENANCE_UNKNOWN");
});
t("SR10 opposite-side resumption gap does not invent path",()=>{
  const r=classifyResumptionGap({
    lastPreSuspensionPrice:98,resumptionFirstPrint:106,
    boundary:{lower:100,upper:104}
  });
  assert.equal(r.status,"RESUMPTION_GAP_CROSSING");
  assert.equal(r.continuousPathInvented,false);
});
t("SR11 same-side resumption is not gap crossing",()=>{
  const r=classifyResumptionGap({
    lastPreSuspensionPrice:98,resumptionFirstPrint:99,
    boundary:{lower:100,upper:104}
  });
  assert.equal(r.status,"NO_OPPOSITE_SIDE_RESUMPTION_GAP");
});
t("SR12 replay-unsafe suspension receipt is blocked",()=>{
  const r=validateSuspensionReceipt({
    firstObservableAt:"2026-10-01T18:00:00+08:00",
    knownAt:"2026-10-01T18:00:00+08:00",
    suspensionStartAt:"2026-10-02T00:00:00+08:00",
    predictorFreezeAt:"2026-10-07T08:50:00+08:00",
    replaySafe:false
  });
  assert.equal(r.status,"DATA_BLOCKED");
});
t("SR13 post-freeze suspension receipt cannot backfill",()=>{
  const r=validateSuspensionReceipt({
    firstObservableAt:"2026-10-07T10:00:00+08:00",
    knownAt:"2026-10-07T10:00:00+08:00",
    suspensionStartAt:"2026-10-02T00:00:00+08:00",
    predictorFreezeAt:"2026-10-07T08:50:00+08:00",
    replaySafe:true
  });
  assert.equal(r.status,"POST_FREEZE_SUSPENSION_RECEIPT_NOT_ELIGIBLE");
});
t("SR14 valid open-ended suspension receipt remains valid",()=>{
  const r=validateSuspensionReceipt({
    firstObservableAt:"2026-10-01T18:00:00+08:00",
    knownAt:"2026-10-01T18:00:00+08:00",
    suspensionStartAt:"2026-10-02T00:00:00+08:00",
    suspensionEndAt:"",
    predictorFreezeAt:"2026-10-02T08:00:00+08:00",
    replaySafe:true
  });
  assert.equal(r.status,"VALID");
  assert.equal(r.openEnded,true);
});
t("SR15 pre-suspension price is only stale-anchor candidate",()=>{
  const r=classifyStaleAnchor({
    suspensionCalendarDays:12,marketMoveDuringSuspension:0.08,
    sectorMoveDuringSuspension:0.05,oldZoneStillDefined:true
  });
  assert.equal(r.status,"PRE_SUSPENSION_PRICE_STALE_ANCHOR_CANDIDATE");
  assert.equal(r.currentEquilibriumProven,false);
});
t("SR16 invalidated old structure is not stale anchor candidate",()=>{
  const r=classifyStaleAnchor({
    suspensionCalendarDays:12,oldZoneStillDefined:false
  });
  assert.equal(r.status,"OLD_STRUCTURE_NOT_DEFINED");
});
t("SR17 resumption comparator at zone is explicit",()=>{
  assert.equal(
    classifySuspensionComparator({atOldStructuralZone:true,suspensionContextVerified:true}).status,
    "G1_RESUMPTION_EVENT_AT_OLD_STRUCTURAL_ZONE"
  );
});
t("SR18 resumption comparator away from zone is explicit",()=>{
  assert.equal(
    classifySuspensionComparator({atOldStructuralZone:false,suspensionContextVerified:true}).status,
    "G0_RESUMPTION_EVENT_AWAY_FROM_OLD_STRUCTURAL_ZONE"
  );
});
t("SR19 unverified suspension comparator fails closed",()=>{
  assert.equal(
    classifySuspensionComparator({atOldStructuralZone:true,suspensionContextVerified:false}).status,
    "UNKNOWN"
  );
});
t("SR20 news/orderbook context does not create independent vote automatically",()=>{
  const r=buildSuspensionLineage({
    priceRepresentations:3,newsContextPresent:true,orderBookContextPresent:true
  });
  assert.equal(r.externalContextCreatesAutomaticVote,false);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

t("SR21 same-session halt remains distinct from multi-session suspension",()=>{
  assert.equal(
    classifySuspensionFreshness({
      provenanceVerified:true,sameSessionHalt:true,suspensionMarketSessions:0
    }).state,
    "SAME_SESSION_SHORT_HALT"
  );
  assert.equal(
    classifySuspensionFreshness({
      provenanceVerified:true,sameSessionHalt:false,suspensionMarketSessions:3
    }).state,
    "MULTI_SESSION_SUSPENSION"
  );
});

t("SR22 first reopening call alone cannot confirm breakout or root reconfirmation",()=>{
  const r=classifyReopeningDiscovery({
    resumptionFirstCallPrintObserved:true,
    firstContinuousTradeObserved:false,
    registeredDiscoveryWindow:"FIRST_15M",
    selectedWindowAfterOutcome:false
  });
  assert.equal(r.status,"FIRST_CALL_ONLY");
  assert.equal(r.confirmedBreakoutAllowed,false);
  assert.equal(r.rootReconfirmationAllowed,false);
});

t("SR23 post-outcome discovery-window selection is prohibited",()=>{
  const r=classifyReopeningDiscovery({
    resumptionFirstCallPrintObserved:true,
    firstContinuousTradeObserved:true,
    registeredDiscoveryWindow:"FIRST_15M",
    selectedWindowAfterOutcome:true
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"POST_OUTCOME_DISCOVERY_WINDOW_SELECTION");
});

t("SR24 root reconfirmation requires post-reopening confirmation state",()=>{
  assert.equal(
    classifyReopeningRootState({
      oldRootDefined:true,
      corporateActionRebased:false,
      marketInvalidatedByKnownInformation:false,
      postReopeningConfirmation:false,
      breachedDuringDiscovery:false
    }).state,
    "ROOT_PERSISTS_BUT_STALE"
  );
  assert.equal(
    classifyReopeningRootState({
      oldRootDefined:true,
      corporateActionRebased:false,
      marketInvalidatedByKnownInformation:false,
      postReopeningConfirmation:true,
      breachedDuringDiscovery:false
    }).state,
    "ROOT_RECONFIRMED_AFTER_REOPENING"
  );
});

console.log(`SUMMARY ${pass}/24 PASS`);
