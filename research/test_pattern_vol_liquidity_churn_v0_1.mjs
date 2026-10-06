import assert from "node:assert/strict";
import {
  classifyVolLiquidityContext,
  classifyMicrostructureEstimand,
  classifyCommonSupport,
  quoteTradeComparison
} from "./pattern_vol_liquidity_churn_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const freeze="2026-10-06T10:00:00+08:00";
const r=(x={})=>({
  verified:true,
  owner:"D04_D05",
  asOf:"2026-10-06T09:59:00+08:00",
  sourceVersion:"MV1",
  quoteFresh:true,
  volatilityBurstState:"INACTIVE",
  spreadStressState:"INACTIVE",
  depthStressState:"INACTIVE",
  quotedSpread:1,
  volatilityPriceScale:2,
  ...x
});
const session=r({sessionPosition:"MIDDAY_CONTINUOUS",sessionEdge:false});
const churn={eligibleStateCount:10,stateTransitionCount:4};

t("VL01 invalid zone width is blocked",()=>{
  const x=classifyVolLiquidityContext({zone:{lower:100,upper:100},churnSummary:churn,preEpisode:r(),sessionReceipt:session,predictorFreezeAt:freeze});
  assert.equal(x.status,"DATA_BLOCKED");
  assert.equal(x.reason,"ZONE_WIDTH_INVALID");
});

t("VL02 future pre-episode receipt is blocked",()=>{
  const x=classifyVolLiquidityContext({
    zone:{lower:100,upper:104},churnSummary:churn,
    preEpisode:r({asOf:"2026-10-06T10:01:00+08:00"}),sessionReceipt:session,predictorFreezeAt:freeze
  });
  assert.equal(x.reason,"PRE_EPISODE_RECEIPT_INVALID");
});

t("VL03 wrong owner receipt is blocked",()=>{
  const x=classifyVolLiquidityContext({
    zone:{lower:100,upper:104},churnSummary:churn,
    preEpisode:r({owner:"D01"}),sessionReceipt:session,predictorFreezeAt:freeze
  });
  assert.equal(x.reason,"PRE_EPISODE_RECEIPT_INVALID");
});

t("VL04 baseline context maps to L0",()=>{
  const x=classifyVolLiquidityContext({
    zone:{lower:100,upper:104},churnSummary:churn,preEpisode:r(),sessionReceipt:session,predictorFreezeAt:freeze
  });
  assert.equal(x.researchContextClass,"L0_BASELINE_MICROSTRUCTURE_CONTEXT");
});

t("VL05 volatility burst maps to L1",()=>{
  const x=classifyVolLiquidityContext({
    zone:{lower:100,upper:104},churnSummary:churn,
    preEpisode:r({volatilityBurstState:"ACTIVE"}),sessionReceipt:session,predictorFreezeAt:freeze
  });
  assert.equal(x.researchContextClass,"L1_VOLATILITY_BURST_CONTEXT");
});

t("VL06 spread stress maps to L2",()=>{
  const x=classifyVolLiquidityContext({
    zone:{lower:100,upper:104},churnSummary:churn,
    preEpisode:r({spreadStressState:"ACTIVE"}),sessionReceipt:session,predictorFreezeAt:freeze
  });
  assert.equal(x.researchContextClass,"L2_SPREAD_STRESS_CONTEXT");
});

t("VL07 depth stress maps to L3",()=>{
  const x=classifyVolLiquidityContext({
    zone:{lower:100,upper:104},churnSummary:churn,
    preEpisode:r({depthStressState:"ACTIVE"}),sessionReceipt:session,predictorFreezeAt:freeze
  });
  assert.equal(x.researchContextClass,"L3_DEPTH_STRESS_CONTEXT");
});

t("VL08 multiple stress dimensions map to L4",()=>{
  const x=classifyVolLiquidityContext({
    zone:{lower:100,upper:104},churnSummary:churn,
    preEpisode:r({volatilityBurstState:"ACTIVE",spreadStressState:"ACTIVE"}),sessionReceipt:session,predictorFreezeAt:freeze
  });
  assert.equal(x.researchContextClass,"L4_VOL_LIQ_MIXED_STRESS_CONTEXT");
});

t("VL09 session edge maps to L5 when no stress",()=>{
  const x=classifyVolLiquidityContext({
    zone:{lower:100,upper:104},churnSummary:churn,
    preEpisode:r(),sessionReceipt:r({sessionPosition:"OPENING_SEGMENT",sessionEdge:true}),predictorFreezeAt:freeze
  });
  assert.equal(x.researchContextClass,"L5_SESSION_EDGE_CONTEXT");
});

t("VL10 stale quote is explicit L6 and not zero liquidity",()=>{
  const x=classifyVolLiquidityContext({
    zone:{lower:100,upper:104},churnSummary:churn,
    preEpisode:r({quoteFresh:false,quotedSpread:0}),sessionReceipt:session,predictorFreezeAt:freeze
  });
  assert.equal(x.researchContextClass,"L6_QUOTE_STALE_OR_INCOMPLETE");
  assert.equal(x.quoteStalenessState,"STALE");
});

t("VL11 spread-to-zone-width is descriptive",()=>{
  const x=classifyVolLiquidityContext({
    zone:{lower:100,upper:104},churnSummary:churn,
    preEpisode:r({quotedSpread:2}),sessionReceipt:session,predictorFreezeAt:freeze
  });
  assert.equal(x.spreadToZoneWidth,0.5);
});

t("VL12 volatility-to-zone-width is descriptive",()=>{
  const x=classifyVolLiquidityContext({
    zone:{lower:100,upper:104},churnSummary:churn,
    preEpisode:r({volatilityPriceScale:8}),sessionReceipt:session,predictorFreezeAt:freeze
  });
  assert.equal(x.volatilityToZoneWidth,2);
});

t("VL13 transition rate remains separate from volatility",()=>{
  const x=classifyVolLiquidityContext({
    zone:{lower:100,upper:104},churnSummary:{eligibleStateCount:8,stateTransitionCount:4},
    preEpisode:r({volatilityBurstState:"ACTIVE"}),sessionReceipt:session,predictorFreezeAt:freeze
  });
  assert.equal(x.transitionCountPerEligibleState,0.5);
  assert.equal(x.volatilityBurstState,"ACTIVE");
});

t("VL14 same churn different vol-liquidity context remains distinguishable",()=>{
  const a=classifyVolLiquidityContext({
    zone:{lower:100,upper:104},churnSummary:churn,preEpisode:r(),sessionReceipt:session,predictorFreezeAt:freeze
  });
  const b=classifyVolLiquidityContext({
    zone:{lower:100,upper:104},churnSummary:churn,
    preEpisode:r({volatilityBurstState:"ACTIVE",depthStressState:"ACTIVE"}),sessionReceipt:session,predictorFreezeAt:freeze
  });
  assert.equal(a.stateTransitionCount,b.stateTransitionCount);
  assert.notEqual(a.researchContextClass,b.researchContextClass);
});

t("VL15 same volatility context different churn remains distinguishable",()=>{
  const a=classifyVolLiquidityContext({
    zone:{lower:100,upper:104},churnSummary:{eligibleStateCount:10,stateTransitionCount:1},
    preEpisode:r({volatilityBurstState:"ACTIVE"}),sessionReceipt:session,predictorFreezeAt:freeze
  });
  const b=classifyVolLiquidityContext({
    zone:{lower:100,upper:104},churnSummary:{eligibleStateCount:10,stateTransitionCount:8},
    preEpisode:r({volatilityBurstState:"ACTIVE"}),sessionReceipt:session,predictorFreezeAt:freeze
  });
  assert.notEqual(a.transitionCountPerEligibleState,b.transitionCountPerEligibleState);
  assert.equal(a.researchContextClass,b.researchContextClass);
});

t("VL16 within-episode context is marked mediator/mechanism",()=>{
  const x=classifyVolLiquidityContext({
    zone:{lower:100,upper:104},churnSummary:churn,
    preEpisode:r(),
    withinEpisode:r({volatilityBurstState:"ACTIVE"}),
    sessionReceipt:session,predictorFreezeAt:freeze
  });
  assert.equal(x.withinEpisodeContextRole,"MEDIATOR_OR_CONTEMPORANEOUS_MECHANISM");
});

t("VL17 pre-episode estimand permits total-style claim only within defined scope",()=>{
  const x=classifyMicrostructureEstimand({adjustWithinEpisodeMicrostructure:false});
  assert.equal(x.estimand,"E0_PRE_EPISODE_ADJUSTED_CHURN_INCREMENT");
  assert.equal(x.totalEffectClaimAllowed,true);
});

t("VL18 within-episode adjustment changes the estimand",()=>{
  const x=classifyMicrostructureEstimand({adjustWithinEpisodeMicrostructure:true});
  assert.equal(x.estimand,"E1_WITHIN_EPISODE_MICROSTRUCTURE_CONDITIONAL");
  assert.equal(x.totalEffectClaimAllowed,false);
});

t("VL19 common support requires all frozen dimensions",()=>{
  const x=classifyCommonSupport({
    churnOverlap:true,volatilityOverlap:true,spreadOverlap:true,depthOverlap:true,
    sessionOverlap:true,mechanismOverlap:true,geometryOverlap:true
  });
  assert.equal(x.status,"COMMON_SUPPORT_VALID");
});

t("VL20 explicit spread-support failure prohibits extrapolation",()=>{
  const x=classifyCommonSupport({
    churnOverlap:true,volatilityOverlap:true,spreadOverlap:false,depthOverlap:true,
    sessionOverlap:true,mechanismOverlap:true,geometryOverlap:true
  });
  assert.equal(x.status,"EXTRAPOLATION_PROHIBITED");
});

t("VL21 stale quote blocks trade-vs-midpoint comparison",()=>{
  const x=quoteTradeComparison({tradePriceChurnAvailable:true,quoteMidChurnAvailable:true,quoteFresh:false});
  assert.equal(x.status,"NOT_EVALUABLE");
  assert.equal(x.reason,"QUOTE_STALE");
});

t("VL22 valid trade-vs-midpoint comparison is diagnostic, not another vote",()=>{
  const x=quoteTradeComparison({tradePriceChurnAvailable:true,quoteMidChurnAvailable:true,quoteFresh:true});
  assert.equal(x.status,"VALID");
  assert.equal(x.bidAskBounceControlPossible,true);
  assert.equal(x.independentVoteAllowed,false);
});

t("VL23 no scalar stress score or extra vote is created",()=>{
  const x=classifyVolLiquidityContext({
    zone:{lower:100,upper:104},churnSummary:churn,preEpisode:r(),sessionReceipt:session,predictorFreezeAt:freeze
  });
  assert.equal(x.microstructureStressScoreDefined,false);
  assert.equal(x.effectiveIndependentEvidenceCount,1);
  assert.equal(x.independentVoteAllowed,false);
  assert.equal(x.outcomeJoinAllowed,false);
});

console.log(`SUMMARY ${pass}/23 PASS`);
