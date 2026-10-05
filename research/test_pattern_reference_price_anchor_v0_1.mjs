import assert from "node:assert/strict";
import {
  buildReferenceContext,
  validateReferenceFallback,
  classifyReferenceAvailability,
  buildOpenReferenceDistances,
  classifyReferenceCommonSupport
} from "./pattern_reference_price_anchor_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const boundary={lower:100,upper:104};

t("RA01 prior close inside zone is explicit",()=>{
  const r=buildReferenceContext({
    boundary,priorClose:102,priorCloseContinuityVerified:true,
    auctionReferencePrice:98,auctionReferenceSource:"TWSE",auctionReferenceRuleVersion:"R1",
    specialReferenceState:"ORDINARY",tickSize:0.5,atr:2
  });
  assert.equal(r.status,"VALID");
  assert.equal(r.coincidenceState,"PRIOR_CLOSE_INSIDE_STRUCTURE");
});

t("RA02 auction reference inside zone is explicit",()=>{
  const r=buildReferenceContext({
    boundary,priorClose:98,priorCloseContinuityVerified:true,
    auctionReferencePrice:102,auctionReferenceSource:"TWSE",auctionReferenceRuleVersion:"R1",
    specialReferenceState:"ORDINARY"
  });
  assert.equal(r.coincidenceState,"AUCTION_REFERENCE_INSIDE_STRUCTURE");
});

t("RA03 both references inside zone remain one context state",()=>{
  const r=buildReferenceContext({
    boundary,priorClose:101,priorCloseContinuityVerified:true,
    auctionReferencePrice:103,auctionReferenceSource:"TWSE",auctionReferenceRuleVersion:"R1",
    specialReferenceState:"ORDINARY"
  });
  assert.equal(r.coincidenceState,"BOTH_REFERENCES_INSIDE_STRUCTURE");
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

t("RA04 distinct references remain distinct from structure",()=>{
  const r=buildReferenceContext({
    boundary,priorClose:95,priorCloseContinuityVerified:true,
    auctionReferencePrice:96,auctionReferenceSource:"TWSE",auctionReferenceRuleVersion:"R1",
    specialReferenceState:"ORDINARY"
  });
  assert.equal(r.coincidenceState,"STRUCTURE_DISTINCT_FROM_REFERENCES");
});

t("RA05 exact numeric coincidence is not pattern confirmation",()=>{
  const r=buildReferenceContext({
    boundary,priorClose:102,priorCloseContinuityVerified:true,
    auctionReferencePrice:102,auctionReferenceSource:"TWSE",auctionReferenceRuleVersion:"R1",
    specialReferenceState:"ORDINARY"
  });
  assert.equal(r.referenceCoincidenceIsConfirmation,false);
});

t("RA06 OHLC alone does not identify behavioral anchoring",()=>{
  const r=buildReferenceContext({
    boundary,priorClose:102,priorCloseContinuityVerified:true,
    auctionReferencePrice:102,auctionReferenceSource:"TWSE",auctionReferenceRuleVersion:"R1",
    specialReferenceState:"ORDINARY"
  });
  assert.equal(r.behavioralAnchoringIdentified,false);
});

t("RA07 prior-close continuity failure blocks comparison",()=>{
  const r=buildReferenceContext({
    boundary,priorClose:102,priorCloseContinuityVerified:false,
    auctionReferencePrice:102,auctionReferenceSource:"TWSE",auctionReferenceRuleVersion:"R1"
  });
  assert.equal(r.status,"DATA_BLOCKED");
});

t("RA08 special session without official reference cannot fall back to prior close",()=>{
  const r=buildReferenceContext({
    boundary,priorClose:100,priorCloseContinuityVerified:true,
    auctionReferencePrice:null,
    specialReferenceState:"EX_DIVIDEND"
  });
  assert.equal(r.status,"DATA_BLOCKED");
  assert.equal(r.reason,"SPECIAL_SESSION_REFERENCE_MISSING");
});

t("RA09 fallback guard prohibits special-session prior-close substitution",()=>{
  const r=validateReferenceFallback({
    priorClose:100,auctionReferencePrice:null,
    specialReferenceState:"CAPITAL_REDUCTION",
    officialReferenceVerified:false
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"SPECIAL_SESSION_PRIOR_CLOSE_FALLBACK_PROHIBITED");
});

t("RA10 ordinary missing official reference remains unknown, not equal to prior close",()=>{
  const r=validateReferenceFallback({
    priorClose:100,auctionReferencePrice:null,
    specialReferenceState:"ORDINARY",
    officialReferenceVerified:false
  });
  assert.equal(r.status,"UNKNOWN");
});

t("RA11 distances are stored separately for prior close and auction reference",()=>{
  const r=buildReferenceContext({
    boundary,priorClose:96,priorCloseContinuityVerified:true,
    auctionReferencePrice:98,auctionReferenceSource:"TWSE",auctionReferenceRuleVersion:"R1",
    specialReferenceState:"ORDINARY",tickSize:0.5,atr:2
  });
  assert.equal(r.priorCloseDistancePrice,4);
  assert.equal(r.auctionReferenceDistancePrice,2);
  assert.equal(r.priorCloseDistanceAtr,2);
  assert.equal(r.auctionReferenceDistanceTicks,4);
});

t("RA12 pre-open clock can know references but not open or gap fill",()=>{
  const r=classifyReferenceAvailability({
    predictorFreezeAt:"2026-10-05T08:55:00+08:00",
    priorCloseKnownAt:"2026-10-02T13:30:00+08:00",
    auctionReferenceKnownAt:"2026-10-05T08:30:00+08:00",
    openKnownAt:"2026-10-05T09:00:00+08:00",
    gapFillKnownAt:"2026-10-05T09:20:00+08:00"
  });
  assert.equal(r.priorCloseAvailable,true);
  assert.equal(r.auctionReferenceAvailable,true);
  assert.equal(r.openAvailable,false);
  assert.equal(r.gapFillAvailable,false);
});

t("RA13 at-open predictor still cannot use later gap fill",()=>{
  const r=classifyReferenceAvailability({
    predictorFreezeAt:"2026-10-05T09:00:00+08:00",
    priorCloseKnownAt:"2026-10-02T13:30:00+08:00",
    auctionReferenceKnownAt:"2026-10-05T08:30:00+08:00",
    openKnownAt:"2026-10-05T09:00:00+08:00",
    gapFillKnownAt:"2026-10-05T09:20:00+08:00"
  });
  assert.equal(r.openAvailable,true);
  assert.equal(r.gapFillAvailable,false);
  assert.equal(r.futureGapFillMayBackfillPredictor,false);
});

t("RA14 open distances to prior close and auction reference can differ",()=>{
  const r=buildOpenReferenceDistances({currentOpen:106,priorClose:100,auctionReferencePrice:102});
  assert.equal(r.openDistanceFromPriorClose,6);
  assert.equal(r.openDistanceFromAuctionReference,4);
});

t("RA15 auction reference provenance is mandatory",()=>{
  const r=buildReferenceContext({
    boundary,priorClose:100,priorCloseContinuityVerified:true,
    auctionReferencePrice:100,auctionReferenceSource:"",auctionReferenceRuleVersion:"",
    specialReferenceState:"ORDINARY"
  });
  assert.equal(r.status,"REFERENCE_CONTEXT_UNKNOWN");
});

t("RA16 no arbitrary near-threshold state is created",()=>{
  const r=buildReferenceContext({
    boundary,priorClose:99.9,priorCloseContinuityVerified:true,
    auctionReferencePrice:99.8,auctionReferenceSource:"TWSE",auctionReferenceRuleVersion:"R1",
    specialReferenceState:"ORDINARY"
  });
  assert.equal("nearReference" in r,false);
});

t("RA17 common support requires reference-distance overlap",()=>{
  const r=classifyReferenceCommonSupport({
    gapOverlap:true,referenceDistanceOverlap:true,auctionMechanismOverlap:true,
    volatilityLiquidityOverlap:true,constraintOverlap:true,eventOverlap:true,
    marketSectorGapOverlap:true,regimeOverlap:true
  });
  assert.equal(r.status,"COMMON_SUPPORT_VALID");
});

t("RA18 missing reference-distance support prohibits extrapolation",()=>{
  const r=classifyReferenceCommonSupport({
    gapOverlap:true,referenceDistanceOverlap:false,auctionMechanismOverlap:true,
    volatilityLiquidityOverlap:true,constraintOverlap:true,eventOverlap:true,
    marketSectorGapOverlap:true,regimeOverlap:true
  });
  assert.equal(r.status,"REFERENCE_CONTEXT_EXTRAPOLATION_PROHIBITED");
});

t("RA19 incomplete support remains unknown",()=>{
  const r=classifyReferenceCommonSupport({
    gapOverlap:true,referenceDistanceOverlap:true,auctionMechanismOverlap:true,
    volatilityLiquidityOverlap:true,constraintOverlap:true,eventOverlap:null,
    marketSectorGapOverlap:true,regimeOverlap:true
  });
  assert.equal(r.status,"UNKNOWN");
});

t("RA20 official reference equality with prior close is preserved as two fields",()=>{
  const r=buildReferenceContext({
    boundary,priorClose:100,priorCloseContinuityVerified:true,
    auctionReferencePrice:100,auctionReferenceSource:"TWSE",auctionReferenceRuleVersion:"R1",
    specialReferenceState:"ORDINARY"
  });
  assert.equal(r.priorClose,100);
  assert.equal(r.auctionReferencePrice,100);
  assert.equal(r.status,"VALID");
});

console.log(`SUMMARY ${pass}/20 PASS`);
