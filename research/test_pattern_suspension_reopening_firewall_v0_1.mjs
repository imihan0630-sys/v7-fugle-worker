import assert from "node:assert/strict";
import {
  classifySuspensionState,
  validateReopeningReceipt,
  classifyNoTradeGeometry,
  classifyReopeningGap,
  classifyAnchorFreshness,
  classifyFirstAuctionBreakout,
  buildReopeningLineage,
  classifyReopeningComparator
} from "./pattern_suspension_reopening_firewall_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("SR01 verified same-session halt is distinct",()=>{
  assert.equal(classifySuspensionState({suspensionVerified:true,sameSession:true,noTradeBusinessDays:0}).status,"SAME_SESSION_SHORT_HALT");
});

t("SR02 one-day suspension is distinct",()=>{
  assert.equal(classifySuspensionState({suspensionVerified:true,sameSession:false,noTradeBusinessDays:1}).status,"ONE_BUSINESS_DAY_SUSPENSION");
});

t("SR03 multi-session suspension is distinct",()=>{
  assert.equal(classifySuspensionState({suspensionVerified:true,sameSession:false,noTradeBusinessDays:4}).status,"MULTI_SESSION_SUSPENSION");
});

t("SR04 unknown suspension receipt fails closed",()=>{
  assert.equal(classifySuspensionState({suspensionVerified:false,noTradeBusinessDays:4}).status,"SUSPENSION_STATE_UNKNOWN");
});

t("SR05 replay-safe reopening receipt validates",()=>{
  const r=validateReopeningReceipt({
    suspensionStartAt:"2026-10-01T13:30:00+08:00",
    resumptionAnnouncementAt:"2026-10-06T17:00:00+08:00",
    resumptionEffectiveAt:"2026-10-07T08:30:00+08:00",
    firstMatchingAt:"2026-10-07T09:00:00+08:00",
    predictorFreezeAt:"2026-10-07T09:05:00+08:00",
    reopeningReferencePrice:98,
    replaySafe:true
  });
  assert.equal(r.status,"VALID");
});

t("SR06 post-freeze resumption announcement cannot backfill",()=>{
  const r=validateReopeningReceipt({
    suspensionStartAt:"2026-10-01T13:30:00+08:00",
    resumptionAnnouncementAt:"2026-10-07T10:00:00+08:00",
    resumptionEffectiveAt:"2026-10-07T08:30:00+08:00",
    firstMatchingAt:"2026-10-07T09:00:00+08:00",
    predictorFreezeAt:"2026-10-07T09:05:00+08:00",
    reopeningReferencePrice:98,
    replaySafe:true
  });
  assert.equal(r.status,"POST_FREEZE_RESUMPTION_ANNOUNCEMENT_NOT_ELIGIBLE");
});

t("SR07 forward-filled suspended sessions are contamination",()=>{
  assert.equal(classifyNoTradeGeometry({
    suspendedSessionCount:3,
    pseudoBarsPresent:false,
    forwardFilledCloseUsed:true,
    zeroVolumeBarsUsed:false
  }).status,"PSEUDO_BAR_CONTAMINATION");
});

t("SR08 zero-volume pseudo-bars are contamination",()=>{
  assert.equal(classifyNoTradeGeometry({
    suspendedSessionCount:3,
    pseudoBarsPresent:false,
    forwardFilledCloseUsed:false,
    zeroVolumeBarsUsed:true
  }).status,"PSEUDO_BAR_CONTAMINATION");
});

t("SR09 clean no-trade interval is excluded from geometry",()=>{
  assert.equal(classifyNoTradeGeometry({
    suspendedSessionCount:3,
    pseudoBarsPresent:false,
    forwardFilledCloseUsed:false,
    zeroVolumeBarsUsed:false
  }).status,"NO_TRADE_INTERVAL_EXCLUDED");
});

t("SR10 corporate-action overlap contaminates reopening gap",()=>{
  const r=classifyReopeningGap({
    lastExecutedPrice:100,
    firstReopeningAuctionPrice:93,
    corporateActionOverlap:true,
    priceLimitConstraint:false,
    benchmarkCatchupMaterial:false,
    eventNewsMaterial:false
  });
  assert.equal(r.status,"ATTRIBUTION_CONTAMINATED");
  assert.ok(r.explanations.includes("CORPORATE_ACTION_RESET_EXPLANATION"));
});

t("SR11 benchmark catch-up contaminates reopening gap",()=>{
  const r=classifyReopeningGap({
    lastExecutedPrice:100,
    firstReopeningAuctionPrice:108,
    corporateActionOverlap:false,
    priceLimitConstraint:false,
    benchmarkCatchupMaterial:true,
    eventNewsMaterial:false
  });
  assert.ok(r.explanations.includes("CROSS_MARKET_CATCHUP_EXPLANATION"));
});

t("SR12 price-limit reopening contaminates attribution",()=>{
  const r=classifyReopeningGap({
    lastExecutedPrice:100,
    firstReopeningAuctionPrice:110,
    corporateActionOverlap:false,
    priceLimitConstraint:true,
    benchmarkCatchupMaterial:false,
    eventNewsMaterial:false
  });
  assert.ok(r.explanations.includes("PRICE_LIMIT_CONSTRAINT_EXPLANATION"));
});

t("SR13 unconfounded reopening gap still does not prove structure",()=>{
  const r=classifyReopeningGap({
    lastExecutedPrice:100,
    firstReopeningAuctionPrice:103,
    corporateActionOverlap:false,
    priceLimitConstraint:false,
    benchmarkCatchupMaterial:false,
    eventNewsMaterial:false
  });
  assert.equal(r.status,"STRUCTURAL_RESPONSE_NOT_YET_PROVEN");
});

t("SR14 causal root persistence does not create arbitrary freshness score",()=>{
  const r=classifyAnchorFreshness({
    structuralRootKnown:true,
    suspensionVerified:true,
    noTradeBusinessDays:5,
    informationArrivalKnown:true
  });
  assert.equal(r.status,"ROOT_PERSISTS_BUT_FRESHNESS_REQUIRES_VALIDATION");
  assert.equal(r.arbitraryDecayScoreDefined,false);
});

t("SR15 first reopening auction cross is not confirmation",()=>{
  const r=classifyFirstAuctionBreakout({
    firstAuctionCrossesZone:true,
    preregisteredConfirmationObserved:false
  });
  assert.equal(r.status,"FIRST_AUCTION_CROSS_UNCONFIRMED");
});

t("SR16 later confirmation cannot backfill predictor freeze",()=>{
  const r=classifyFirstAuctionBreakout({
    firstAuctionCrossesZone:true,
    preregisteredConfirmationObserved:true,
    confirmationAt:"2026-10-07T09:30:00+08:00",
    predictorFreezeAt:"2026-10-07T09:05:00+08:00"
  });
  assert.equal(r.status,"CONFIRMATION_NOT_AVAILABLE_AT_FREEZE");
});

t("SR17 price-derived reopening representations remain one information root",()=>{
  const r=buildReopeningLineage({
    rootPresent:true,
    reopeningGapPresent:true,
    firstAuctionBreakoutPresent:true,
    earlyMomentumPresent:true
  });
  assert.equal(r.rawRepresentationCount,4);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

t("SR18 at-zone comparator is explicit",()=>{
  assert.equal(classifyReopeningComparator({
    atStructuralZone:true,
    suspensionContextVerified:true
  }).status,"G1_SUSPENSION_REOPENING_AT_STRUCTURAL_ZONE");
});

t("SR19 away-from-zone comparator is explicit",()=>{
  assert.equal(classifyReopeningComparator({
    atStructuralZone:false,
    suspensionContextVerified:true
  }).status,"G0_SUSPENSION_REOPENING_AWAY_FROM_STRUCTURAL_ZONE");
});

t("SR20 unverified suspension context makes comparator unknown",()=>{
  assert.equal(classifyReopeningComparator({
    atStructuralZone:true,
    suspensionContextVerified:false
  }).status,"UNKNOWN");
});

console.log(`SUMMARY ${pass}/20 PASS`);
