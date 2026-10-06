import assert from "node:assert/strict";
import {
  zoneSide,
  classifyAuctionReceipt,
  validateHistoricalAuctionInference,
  classifyCloseStructuralTransition,
  classifyOpeningContext,
  buildAuctionAttributionFrame
} from "./pattern_auction_attribution_firewall_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const boundary={lower:100,upper:104};
const freeze="2026-10-07T13:24:59+08:00";
const finalAt="2026-10-07T13:30:00+08:00";

t("AU01 final close cannot backfill trial state",()=>{
  const r=validateHistoricalAuctionInference({historical:true,inferTrialFromFinalClose:true});
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"FINAL_CLOSE_CANNOT_BACKFILL_TRIAL");
});

t("AU02 EOD volume cannot become auction imbalance",()=>{
  const r=validateHistoricalAuctionInference({historical:true,inferImbalanceFromEodVolume:true});
  assert.equal(r.reason,"EOD_VOLUME_IS_NOT_AUCTION_IMBALANCE");
});

t("AU03 final auction volume is not imbalance",()=>{
  const r=validateHistoricalAuctionInference({inferImbalanceFromFinalVolume:true});
  assert.equal(r.reason,"FINAL_AUCTION_VOLUME_IS_NOT_IMBALANCE");
});

t("AU04 historical missing trial receipt remains unknown",()=>{
  const r=validateHistoricalAuctionInference({historical:true,nativeTrialReceipt:false});
  assert.equal(r.status,"HISTORICAL_PRE_CLOSE_IMBALANCE_UNKNOWN");
});

t("AU05 native prospective trial receipt before freeze is eligible",()=>{
  const r=classifyAuctionReceipt({
    receipt:{
      phase:"CLOSE_TRIAL",
      knownAt:"2026-10-07T13:24:00+08:00",
      replaySafe:true,
      nativeImbalanceObserved:true,
      trialPrice:103
    },
    predictorFreezeAt:freeze
  });
  assert.equal(r.state,"AUCTION_CONTEXT_AVAILABLE");
  assert.equal(r.baselineEligible,true);
  assert.equal(r.hasNativeImbalance,true);
});

t("AU06 trial receipt observed after freeze is post-opportunity",()=>{
  const r=classifyAuctionReceipt({
    receipt:{phase:"CLOSE_TRIAL",knownAt:"2026-10-07T13:25:30+08:00",replaySafe:true},
    predictorFreezeAt:freeze
  });
  assert.equal(r.state,"POST_OPPORTUNITY_AUCTION_CONTEXT");
});

t("AU07 replay-unsafe auction receipt fails closed",()=>{
  const r=classifyAuctionReceipt({
    receipt:{phase:"CLOSE_TRIAL",knownAt:"2026-10-07T13:24:00+08:00",replaySafe:false},
    predictorFreezeAt:freeze
  });
  assert.equal(r.state,"AUCTION_DATA_BLOCKED");
});

t("AU08 continuous hold surviving final auction is distinct state",()=>{
  const r=classifyCloseStructuralTransition({
    boundary,lastContinuousPrice:106,finalAuctionPrice:105,intendedSide:"ABOVE",
    structureConfirmedAt:"2026-10-07T13:00:00+08:00",
    predictorFreezeAt:freeze,finalMatchAt:finalAt
  });
  assert.equal(r.state,"CONTINUOUS_HOLD_BEFORE_AUCTION");
});

t("AU09 auction can move price into apparent hold",()=>{
  const r=classifyCloseStructuralTransition({
    boundary,lastContinuousPrice:103,finalAuctionPrice:105,intendedSide:"ABOVE",
    structureConfirmedAt:"2026-10-07T13:00:00+08:00",
    predictorFreezeAt:freeze,finalMatchAt:finalAt
  });
  assert.equal(r.state,"AUCTION_MOVED_INTO_HOLD");
});

t("AU10 auction can move price out of prior hold",()=>{
  const r=classifyCloseStructuralTransition({
    boundary,lastContinuousPrice:105,finalAuctionPrice:103,intendedSide:"ABOVE",
    structureConfirmedAt:"2026-10-07T13:00:00+08:00",
    predictorFreezeAt:freeze,finalMatchAt:finalAt
  });
  assert.equal(r.state,"AUCTION_MOVED_OUT_OF_HOLD");
});

t("AU11 final auction cannot certify its own pre-close structure predictor",()=>{
  const r=classifyCloseStructuralTransition({
    boundary,lastContinuousPrice:103,finalAuctionPrice:105,intendedSide:"ABOVE",
    structureConfirmedAt:finalAt,predictorFreezeAt:freeze,finalMatchAt:finalAt,
    confirmationSource:"CLOSE_FINAL"
  });
  assert.equal(r.state,"AUCTION_CREATED_OR_CONFIRMED_STRUCTURE");
  assert.equal(r.preAuctionPredictorEligible,false);
  assert.equal(r.samePrintLoopProhibited,true);
});

t("AU12 structure confirmed after predictor freeze is not pre-auction predictor",()=>{
  const r=classifyCloseStructuralTransition({
    boundary,lastContinuousPrice:103,finalAuctionPrice:105,intendedSide:"ABOVE",
    structureConfirmedAt:"2026-10-07T13:26:00+08:00",
    predictorFreezeAt:freeze,finalMatchAt:finalAt
  });
  assert.equal(r.state,"AUCTION_CREATED_OR_CONFIRMED_STRUCTURE");
});

t("AU13 missing continuous context keeps close state unknown",()=>{
  const r=classifyCloseStructuralTransition({
    boundary,finalAuctionPrice:105,intendedSide:"ABOVE",
    structureConfirmedAt:"2026-10-07T13:00:00+08:00",
    predictorFreezeAt:freeze,finalMatchAt:finalAt,
    continuousContextKnown:false
  });
  assert.equal(r.state,"CLOSE_STATE_UNKNOWN");
});

t("AU14 opening price inside prior zone is gap-into-zone context",()=>{
  const r=classifyOpeningContext({
    priorZone:boundary,openingPrice:102,priorClose:95,contextKnown:true
  });
  assert.equal(r.state,"OPEN_CALL_GAP_INTO_ZONE");
});

t("AU15 opening jump across prior zone is gap-through context",()=>{
  const r=classifyOpeningContext({
    priorZone:boundary,openingPrice:106,priorClose:95,contextKnown:true
  });
  assert.equal(r.state,"OPEN_CALL_GAP_THROUGH_ZONE");
});

t("AU16 delayed/constrained open stays explicit",()=>{
  const r=classifyOpeningContext({
    priorZone:boundary,openingPrice:102,contextKnown:true,delayedOrConstrained:true
  });
  assert.equal(r.state,"OPEN_DELAYED_OR_CONSTRAINED");
});

t("AU17 absent historical auction receipt is not silently treated as no imbalance",()=>{
  const r=classifyAuctionReceipt({receipt:null,predictorFreezeAt:freeze,historical:true});
  assert.equal(r.state,"HISTORICAL_AUCTION_STATE_UNKNOWN");
  assert.equal(r.baselineEligible,false);
});

t("AU18 multiple close-session representations remain one effective family",()=>{
  const frame=buildAuctionAttributionFrame({
    parentDecisionId:"P1",
    auctionReceiptState:{state:"AUCTION_CONTEXT_AVAILABLE"},
    closeStructuralState:{state:"AUCTION_MOVED_INTO_HOLD"},
    passiveReplicationContext:"INDEX_REBALANCE_EFFECTIVE",
    rawRepresentationCount:4
  });
  assert.equal(frame.rawRepresentationCount,4);
  assert.equal(frame.effectiveIndependentEvidenceCount,1);
  assert.equal(frame.independentVoteAllowed,false);
});

t("AU19 auction attribution frame keeps outcome join closed",()=>{
  const frame=buildAuctionAttributionFrame({parentDecisionId:"P2"});
  assert.equal(frame.outcomeJoinAllowed,false);
});

t("AU20 zone-side classification is deterministic",()=>{
  assert.equal(zoneSide({price:105,...boundary}).side,"ABOVE");
  assert.equal(zoneSide({price:102,...boundary}).side,"INSIDE");
  assert.equal(zoneSide({price:99,...boundary}).side,"BELOW");
});

console.log(`SUMMARY ${pass}/20 PASS`);
