import assert from "node:assert/strict";
import {
  computeOvernightGap,
  classifyBoundaryCrossing,
  validateSessionSegmentation,
  classifyPredictorAvailability,
  buildSessionDecomposition,
  classifySessionRobustness
} from "./pattern_session_gap_auction_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("SG01 ordinary overnight gap is measured without implying continuous path",()=>{
  const r=computeOvernightGap({priorClose:100,currentOpen:106,atr:2,continuityVerified:true});
  assert.equal(r.status,"VALID");
  assert.equal(r.overnightGapPrice,6);
  assert.equal(r.overnightGapPct,0.06);
  assert.equal(r.overnightGapAtr,3);
  assert.equal(r.pathContinuityImplied,false);
});

t("SG02 corporate-action discontinuity blocks ordinary gap interpretation",()=>{
  const r=computeOvernightGap({
    priorClose:100,currentOpen:90,continuityVerified:true,corporateActionDiscontinuity:true
  });
  assert.equal(r.status,"DATA_BLOCKED");
  assert.equal(r.reason,"CORPORATE_ACTION_DISCONTINUITY");
});

t("SG03 unverified continuity blocks gap",()=>{
  const r=computeOvernightGap({priorClose:100,currentOpen:106,continuityVerified:false});
  assert.equal(r.status,"DATA_BLOCKED");
});

t("SG04 opening gap through boundary is not continuous cross",()=>{
  const r=classifyBoundaryCrossing({
    priorClose:99,currentOpen:105,
    boundary:{lower:100,upper:104},
    openingSessionState:"OPEN_CALL_AUCTION",
    constrained:false,
    continuousCrossObserved:false,
    continuityVerified:true
  });
  assert.equal(r.state,"OPENING_GAP_CROSS");
  assert.equal(r.pathContinuityImplied,false);
});

t("SG05 verified intraday traded-through crossing remains continuous cross",()=>{
  const r=classifyBoundaryCrossing({
    priorClose:99,currentOpen:99,
    boundary:{lower:100,upper:104},
    openingSessionState:"OPEN_CALL_AUCTION",
    constrained:false,
    continuousCrossObserved:true,
    continuityVerified:true
  });
  assert.equal(r.state,"CONTINUOUS_CROSS");
});

t("SG06 opening inside frozen zone is auction-at-boundary",()=>{
  const r=classifyBoundaryCrossing({
    priorClose:98,currentOpen:102,
    boundary:{lower:100,upper:104},
    openingSessionState:"OPEN_CALL_AUCTION",
    continuityVerified:true
  });
  assert.equal(r.state,"AUCTION_AT_BOUNDARY");
});

t("SG07 constrained opening cross remains explicit",()=>{
  const r=classifyBoundaryCrossing({
    priorClose:99,currentOpen:105,
    boundary:{lower:100,upper:104},
    openingSessionState:"OPEN_CALL_AUCTION",
    constrained:true,
    continuityVerified:true
  });
  assert.equal(r.state,"CONSTRAINED_OPENING_CROSS");
});

t("SG08 unknown session state never defaults to continuous",()=>{
  const r=classifyBoundaryCrossing({
    priorClose:99,currentOpen:105,
    boundary:{lower:100,upper:104},
    openingSessionState:"UNKNOWN",
    continuousCrossObserved:false,
    continuityVerified:true
  });
  assert.equal(r.state,"CROSSING_UNKNOWN");
});

t("SG09 opening and later windows must be preregistered",()=>{
  const r=validateSessionSegmentation({
    openingWindowId:"OPEN_0_15",
    laterWindowId:"CONT_AFTER_15",
    frozenBeforeOutcome:false,
    sessionOwnerReceiptVerified:true
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"SESSION_WINDOWS_NOT_PREREGISTERED");
});

t("SG10 valid owner-defined distinct windows pass",()=>{
  const r=validateSessionSegmentation({
    openingWindowId:"OPEN_0_15",
    laterWindowId:"CONT_AFTER_15",
    frozenBeforeOutcome:true,
    sessionOwnerReceiptVerified:true
  });
  assert.equal(r.status,"VALID");
});

t("SG11 pre-open predictor cannot use opening price",()=>{
  const r=classifyPredictorAvailability({
    predictorFreezeAt:"2026-10-05T08:55:00+08:00",
    openKnownAt:"2026-10-05T09:00:00+08:00",
    immediatePostOpenKnownAt:"2026-10-05T09:15:00+08:00",
    laterContinuousKnownAt:"2026-10-05T13:25:00+08:00"
  });
  assert.equal(r.openAvailable,false);
  assert.equal(r.immediatePostOpenAvailable,false);
  assert.equal(r.laterContinuousAvailable,false);
});

t("SG12 at-open predictor still cannot use later continuous path",()=>{
  const r=classifyPredictorAvailability({
    predictorFreezeAt:"2026-10-05T09:00:00+08:00",
    openKnownAt:"2026-10-05T09:00:00+08:00",
    immediatePostOpenKnownAt:"2026-10-05T09:15:00+08:00",
    laterContinuousKnownAt:"2026-10-05T13:25:00+08:00"
  });
  assert.equal(r.openAvailable,true);
  assert.equal(r.immediatePostOpenAvailable,false);
  assert.equal(r.laterContinuousAvailable,false);
});

t("SG13 first-15m predictor cannot backfill later session",()=>{
  const r=classifyPredictorAvailability({
    predictorFreezeAt:"2026-10-05T09:15:00+08:00",
    openKnownAt:"2026-10-05T09:00:00+08:00",
    immediatePostOpenKnownAt:"2026-10-05T09:15:00+08:00",
    laterContinuousKnownAt:"2026-10-05T13:25:00+08:00"
  });
  assert.equal(r.immediatePostOpenAvailable,true);
  assert.equal(r.laterContinuousAvailable,false);
  assert.equal(r.laterSessionComponentsMayBackfillPredictor,false);
});

t("SG14 decomposition remains one PRICE_OHLC evidence family",()=>{
  const r=buildSessionDecomposition({
    parentDecisionId:"P1",
    priorClose:100,currentOpen:106,atr:2,
    continuityVerified:true,
    sessionStateAtFreeze:"OPEN_CALL_AUCTION",
    boundary:{lower:101,upper:104},
    constrained:false,
    continuousCrossObserved:false,
    predictorFreezeAt:"2026-10-05T09:00:00+08:00",
    openKnownAt:"2026-10-05T09:00:00+08:00"
  });
  assert.equal(r.informationRoot,"PRICE_OHLC");
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

t("SG15 decomposition does not open outcome join",()=>{
  const r=buildSessionDecomposition({
    parentDecisionId:"P1",
    priorClose:100,currentOpen:106,
    continuityVerified:true,
    sessionStateAtFreeze:"OPEN_CALL_AUCTION",
    boundary:{lower:101,upper:104},
    predictorFreezeAt:"2026-10-05T09:00:00+08:00",
    openKnownAt:"2026-10-05T09:00:00+08:00"
  });
  assert.equal(r.outcomeJoinAllowed,false);
});

t("SG16 gap-only result is classified as overnight explanation",()=>{
  const r=classifySessionRobustness({
    overnightEvaluable:true,
    openingEvaluable:true,
    immediatePostOpenEvaluable:true,
    laterContinuousEvaluable:true,
    continuousResidualPresent:false,
    gapOnlyPresent:true
  });
  assert.equal(r.state,"M0_OVERNIGHT_GAP_EXPLANATION");
});

t("SG17 later continuous residual is distinct from gap-only effect",()=>{
  const r=classifySessionRobustness({
    overnightEvaluable:true,
    openingEvaluable:true,
    immediatePostOpenEvaluable:true,
    laterContinuousEvaluable:true,
    continuousResidualPresent:true,
    gapOnlyPresent:false
  });
  assert.equal(r.state,"M3_CONTINUOUS_SESSION_RESIDUAL");
});

t("SG18 incomplete session coverage is not evaluable",()=>{
  const r=classifySessionRobustness({
    overnightEvaluable:true,
    openingEvaluable:true,
    immediatePostOpenEvaluable:false,
    laterContinuousEvaluable:true,
    continuousResidualPresent:true,
    gapOnlyPresent:false
  });
  assert.equal(r.state,"M7_NOT_EVALUABLE");
});

t("SG19 both opening/gap and continuous residual can coexist without becoming two votes",()=>{
  const r=classifySessionRobustness({
    overnightEvaluable:true,
    openingEvaluable:true,
    immediatePostOpenEvaluable:true,
    laterContinuousEvaluable:true,
    continuousResidualPresent:true,
    gapOnlyPresent:true
  });
  assert.equal(r.state,"M6_SESSION_ROBUST_PATTERN_CANDIDATE");
});

t("SG20 missing opening price is UNKNOWN rather than zero gap",()=>{
  const r=computeOvernightGap({
    priorClose:100,currentOpen:null,continuityVerified:true
  });
  assert.equal(r.status,"UNKNOWN");
  assert.equal(r.reason,"OPEN_OR_PRIOR_CLOSE_INVALID");
});

console.log(`SUMMARY ${pass}/20 PASS`);
