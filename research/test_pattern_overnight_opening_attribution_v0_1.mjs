import assert from "node:assert/strict";
import {
  classifyPriorZoneCarry,
  classifyOvernightContext,
  classifyOpeningGapTopology,
  classifyFirstContinuousOpportunity,
  validateOpeningTrialUsage,
  buildOvernightOpeningFrame
} from "./pattern_overnight_opening_attribution_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const zone={lower:100,upper:104};
const freeze="2026-10-07T08:59:30+08:00";

t("OG01 prior-day structure must exist before prior session end",()=>{
  const r=classifyPriorZoneCarry({
    structuralRootId:"R1",
    priorStructureConfirmedAt:"2026-10-06T13:00:00+08:00",
    priorSessionEndAt:"2026-10-06T13:30:00+08:00",
    replaySafe:true,continuityVerified:true
  });
  assert.equal(r.status,"PRIOR_STRUCTURE_CARRY_VALID");
});

t("OG02 later-confirmed structure cannot be backdated",()=>{
  const r=classifyPriorZoneCarry({
    structuralRootId:"R1",
    priorStructureConfirmedAt:"2026-10-06T14:00:00+08:00",
    priorSessionEndAt:"2026-10-06T13:30:00+08:00",
    replaySafe:true,continuityVerified:true
  });
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
});

t("OG03 unresolved corporate action blocks overnight gap interpretation",()=>{
  const r=classifyOvernightContext({
    receipt:{knownAt:"2026-10-07T07:00:00+08:00",replaySafe:true,corporateActionUnresolved:true},
    predictorFreezeAt:freeze
  });
  assert.equal(r.state,"OVERNIGHT_GAP_DATA_BLOCKED");
});

t("OG04 certified overnight context before freeze is eligible",()=>{
  const r=classifyOvernightContext({
    receipt:{knownAt:"2026-10-07T07:00:00+08:00",replaySafe:true,globalMarketMove:true,nightFuturesMove:true},
    predictorFreezeAt:freeze
  });
  assert.equal(r.state,"CERTIFIED_OVERNIGHT_CONTEXT");
  assert.equal(r.channels.length,2);
});

t("OG05 later-discovered context cannot explain earlier open ex ante",()=>{
  const r=classifyOvernightContext({
    receipt:{knownAt:"2026-10-07T10:00:00+08:00",replaySafe:true,issuerEvent:true},
    predictorFreezeAt:freeze
  });
  assert.equal(r.state,"POST_OPEN_DISCOVERED_CONTEXT");
  assert.equal(r.baselineEligible,false);
});

t("OG06 gap from below to above skips zone without continuous cross",()=>{
  const r=classifyOpeningGapTopology({priorPrice:98,openingPrice:106,zone,corporateActionResolved:true});
  assert.equal(r.state,"GAP_FROM_BELOW_TO_ABOVE_ZONE");
  assert.equal(r.zoneSkippedCompletely,true);
  assert.equal(r.tradableZoneCrossObserved,false);
});

t("OG07 gap from above to below skips zone without continuous cross",()=>{
  const r=classifyOpeningGapTopology({priorPrice:106,openingPrice:98,zone,corporateActionResolved:true});
  assert.equal(r.state,"GAP_FROM_ABOVE_TO_BELOW_ZONE");
  assert.equal(r.tradableZoneCrossObserved,false);
});

t("OG08 open inside frozen zone is gap-into-zone context",()=>{
  const r=classifyOpeningGapTopology({priorPrice:95,openingPrice:102,zone,corporateActionResolved:true});
  assert.equal(r.state,"GAP_INTO_ZONE");
});

t("OG09 same-side opening does not create a zone cross",()=>{
  const r=classifyOpeningGapTopology({priorPrice:110,openingPrice:108,zone,corporateActionResolved:true});
  assert.equal(r.state,"GAP_AWAY_FROM_ZONE_SAME_SIDE");
  assert.equal(r.tradableZoneCrossObserved,false);
});

t("OG10 unresolved corporate action blocks topology",()=>{
  const r=classifyOpeningGapTopology({priorPrice:98,openingPrice:106,zone,corporateActionResolved:false});
  assert.equal(r.state,"CORPORATE_ACTION_BLOCKED");
});

t("OG11 gap-through alone is not intraday retest",()=>{
  const gap=classifyOpeningGapTopology({priorPrice:98,openingPrice:106,zone,corporateActionResolved:true});
  const r=classifyFirstContinuousOpportunity({gapTopology:gap,firstContinuousObservation:null,zone});
  assert.equal(r.state,"NO_CONTINUOUS_RETEST");
  assert.equal(r.intradayRetest,false);
});

t("OG12 later continuous trade inside zone is first true retest",()=>{
  const gap=classifyOpeningGapTopology({priorPrice:98,openingPrice:106,zone,corporateActionResolved:true});
  const r=classifyFirstContinuousOpportunity({
    gapTopology:gap,
    firstContinuousObservation:{price:102,at:"2026-10-07T09:12:00+08:00"},
    zone
  });
  assert.equal(r.state,"FIRST_CONTINUOUS_RETEST_AFTER_GAP");
  assert.equal(r.intradayRetest,true);
});

t("OG13 constrained opening remains distinct",()=>{
  const gap=classifyOpeningGapTopology({priorPrice:98,openingPrice:106,zone,corporateActionResolved:true});
  const r=classifyFirstContinuousOpportunity({
    gapTopology:gap,firstContinuousObservation:{price:102},zone,constrained:true
  });
  assert.equal(r.state,"LIMIT_OR_AUCTION_CONSTRAINED");
});

t("OG14 opening price cannot reconstruct historical preopen trial",()=>{
  const r=validateOpeningTrialUsage({historical:true,nativeTrialReceipt:false,inferFromOpenPrice:true});
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"OPEN_PRICE_CANNOT_BACKFILL_PREOPEN_TRIAL");
});

t("OG15 missing historical trial remains unknown",()=>{
  const r=validateOpeningTrialUsage({historical:true,nativeTrialReceipt:false});
  assert.equal(r.status,"PREOPEN_TRIAL_UNKNOWN");
});

t("OG16 prospective trial receipt before freeze is valid",()=>{
  const r=validateOpeningTrialUsage({
    historical:false,nativeTrialReceipt:true,
    trialKnownAt:"2026-10-07T08:58:00+08:00",
    predictorFreezeAt:freeze
  });
  assert.equal(r.status,"VALID_TRIAL_RECEIPT");
  assert.equal(r.eligible,true);
});

t("OG17 trial observed after freeze is post-opportunity",()=>{
  const r=validateOpeningTrialUsage({
    nativeTrialReceipt:true,
    trialKnownAt:"2026-10-07T09:00:00+08:00",
    predictorFreezeAt:freeze
  });
  assert.equal(r.status,"POST_OPPORTUNITY_TRIAL");
});

t("OG18 cross-session representations remain one default evidence family",()=>{
  const frame=buildOvernightOpeningFrame({
    parentDecisionId:"P1",
    priorZoneCarry:{status:"PRIOR_STRUCTURE_CARRY_VALID"},
    overnightContext:{state:"CERTIFIED_OVERNIGHT_CONTEXT"},
    gapTopology:{state:"GAP_FROM_BELOW_TO_ABOVE_ZONE"},
    continuousOpportunity:{state:"NO_CONTINUOUS_RETEST"},
    rawRepresentationCount:5
  });
  assert.equal(frame.rawRepresentationCount,5);
  assert.equal(frame.effectiveIndependentEvidenceCount,1);
  assert.equal(frame.independentVoteAllowed,false);
});

t("OG19 outcome join remains closed",()=>{
  const frame=buildOvernightOpeningFrame({parentDecisionId:"P2"});
  assert.equal(frame.outcomeJoinAllowed,false);
});

t("OG20 missing parent id fails closed",()=>{
  const frame=buildOvernightOpeningFrame({});
  assert.equal(frame.status,"UNKNOWN");
});

console.log(`SUMMARY ${pass}/20 PASS`);
