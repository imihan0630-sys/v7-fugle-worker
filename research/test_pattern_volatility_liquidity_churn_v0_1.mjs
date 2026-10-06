import assert from "node:assert/strict";
import {
  classifyContextTiming,
  normalizeChurnByOpportunity,
  classifyRvNoiseSeparation,
  classifyVolLiquidityChurnContext,
  buildInformationLineage
} from "./pattern_volatility_liquidity_churn_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const start="2026-10-01T10:00:00+08:00";
const end="2026-10-01T10:30:00+08:00";

t("VL01 pre-window owner receipt before churn start is causal baseline",()=>{
  const r=classifyContextTiming({
    churnWindowStartAt:start,churnWindowEndAt:end,predictorFreezeAt:start,
    preWindowReceipts:[{asOf:"2026-10-01T09:59:00+08:00"}],
    withinWindowReceipts:[{asOf:"2026-10-01T10:15:00+08:00"}]
  });
  assert.equal(r.status,"VALID");
  assert.equal(r.preWindowRole,"BASELINE_CONTEXT");
});

t("VL02 pre-window receipt observed after churn starts is blocked",()=>{
  const r=classifyContextTiming({
    churnWindowStartAt:start,churnWindowEndAt:end,predictorFreezeAt:start,
    preWindowReceipts:[{asOf:"2026-10-01T10:01:00+08:00"}]
  });
  assert.equal(r.status,"DATA_BLOCKED");
  assert.equal(r.reason,"PRE_WINDOW_RECEIPT_NOT_CAUSAL");
});

t("VL03 same-window realized state cannot backfill earlier predictor",()=>{
  const r=classifyContextTiming({
    churnWindowStartAt:start,churnWindowEndAt:end,predictorFreezeAt:start,
    withinWindowReceipts:[{asOf:"2026-10-01T10:20:00+08:00"}]
  });
  assert.equal(r.status,"VALID");
  assert.equal(r.withinWindowRole,"MECHANISM_OR_MEDIATOR_NOT_BASELINE");
  assert.equal(r.withinWindowMayBackfillEarlierPredictor,false);
});

t("VL04 completed churn window may be historical state for a later decision",()=>{
  const r=classifyContextTiming({
    churnWindowStartAt:start,churnWindowEndAt:end,
    predictorFreezeAt:"2026-10-01T11:00:00+08:00",
    withinWindowReceipts:[{asOf:"2026-10-01T10:20:00+08:00"}]
  });
  assert.equal(r.withinWindowRole,"COMPLETED_HISTORICAL_STATE_FOR_LATER_DECISION");
});

t("VL05 unverified opportunity denominator blocks normalization",()=>{
  const r=normalizeChurnByOpportunity({
    transitionCount:6,sideFlipCount:2,crossingOpportunityReceipt:{valid:false,count:10}
  });
  assert.equal(r.status,"UNKNOWN");
});

t("VL06 zero opportunity denominator never becomes zero churn rate",()=>{
  const r=normalizeChurnByOpportunity({
    transitionCount:0,sideFlipCount:0,crossingOpportunityReceipt:{valid:true,count:0}
  });
  assert.equal(r.status,"UNKNOWN");
  assert.equal(r.reason,"OPPORTUNITY_DENOMINATOR_NONPOSITIVE");
});

t("VL07 verified opportunity denominator yields descriptive rates",()=>{
  const r=normalizeChurnByOpportunity({
    transitionCount:6,sideFlipCount:2,crossingOpportunityReceipt:{valid:true,count:12}
  });
  assert.equal(r.transitionsPerOpportunity,0.5);
  assert.equal(r.sideFlipsPerOpportunity,1/6);
  assert.equal(r.alphaScoreDefined,false);
});

t("VL08 high pre-window volatility is context, not structural failure",()=>{
  const r=classifyVolLiquidityChurnContext({
    preWindowVolatilityReceipt:{ownerHighVolatility:true},
    freshnessReceipt:{state:"FRESH"},
    requiredReceiptsComplete:true
  });
  assert.equal(r.status,"HIGH_VOLATILITY_CONTEXT");
  assert.equal(r.residualStructuralClaimAllowed,false);
});

t("VL09 clustered high volatility remains volatility context",()=>{
  const r=classifyVolLiquidityChurnContext({
    preWindowClusterReceipt:{ownerClusteredHigh:true},
    freshnessReceipt:{state:"FRESH"},
    requiredReceiptsComplete:true
  });
  assert.equal(r.status,"HIGH_VOLATILITY_CONTEXT");
  assert.ok(r.flags.includes("VOLATILITY_CLUSTER_CONTEXT"));
});

t("VL10 same-window realized-volatility burst is explicit",()=>{
  const r=classifyVolLiquidityChurnContext({
    realizedBurstReceipt:{ownerBurst:true},
    freshnessReceipt:{state:"FRESH"},
    requiredReceiptsComplete:true
  });
  assert.equal(r.status,"REALIZED_VOLATILITY_BURST_CONTEXT");
});

t("VL11 spread widening is context not directional vote",()=>{
  const r=classifyVolLiquidityChurnContext({
    spreadReceipt:{ownerState:"SPREAD_WIDENING"},
    freshnessReceipt:{state:"FRESH"},
    requiredReceiptsComplete:true
  });
  assert.equal(r.status,"SPREAD_DETERIORATION_CONTEXT");
  assert.equal(r.directionalVoteAllowed,false);
});

t("VL12 depth thinning is context not directional vote",()=>{
  const r=classifyVolLiquidityChurnContext({
    depthReceipt:{ownerState:"DEPTH_THINNING"},
    freshnessReceipt:{state:"FRESH"},
    requiredReceiptsComplete:true
  });
  assert.equal(r.status,"DEPTH_DETERIORATION_CONTEXT");
});

t("VL13 volatility plus spread stress becomes mixed",()=>{
  const r=classifyVolLiquidityChurnContext({
    preWindowVolatilityReceipt:{ownerHighVolatility:true},
    spreadReceipt:{ownerState:"SPREAD_STRESSED"},
    freshnessReceipt:{state:"FRESH"},
    requiredReceiptsComplete:true
  });
  assert.equal(r.status,"VOLATILITY_LIQUIDITY_STRESS_MIXED");
});

t("VL14 stale quote fails closed rather than zero depth",()=>{
  const r=classifyVolLiquidityChurnContext({
    freshnessReceipt:{state:"STALE"},
    requiredReceiptsComplete:true
  });
  assert.equal(r.status,"NOT_EVALUABLE");
  assert.equal(r.reason,"QUOTE_BOOK_FRESHNESS_INVALID");
});

t("VL15 transaction RV alone cannot separate efficient-price volatility from noise",()=>{
  const r=classifyRvNoiseSeparation({
    transactionRvReceipt:{valid:true,replaySafe:true}
  });
  assert.equal(r.status,"VOLATILITY_NOISE_SEPARATION_INCOMPLETE");
  assert.equal(r.primaryVolatilityPrimitive,null);
});

t("VL16 valid midquote and transaction RV use midquote as primary",()=>{
  const r=classifyRvNoiseSeparation({
    midquoteRvReceipt:{valid:true,replaySafe:true},
    transactionRvReceipt:{valid:true,replaySafe:true}
  });
  assert.equal(r.primaryVolatilityPrimitive,"MIDQUOTE_RV");
  assert.equal(r.transactionRvRole,"MICROSTRUCTURE_NOISE_DIAGNOSTIC");
});

t("VL17 missing all RV primitives is not evaluable",()=>{
  const r=classifyRvNoiseSeparation({});
  assert.equal(r.status,"VOLATILITY_NOT_EVALUABLE");
});

t("VL18 multiple price-path descriptors remain one default evidence family",()=>{
  const r=buildInformationLineage({
    pricePathRepresentations:["occupancy","transition_count","side_flip","rv"]
  });
  assert.equal(r.rawPriceRepresentationCount,4);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.independentVoteAllowed,false);
});

t("VL19 spread/depth primitive does not auto-increase evidence count",()=>{
  const r=buildInformationLineage({
    pricePathRepresentations:["zone_churn"],
    spreadDepthOwnerPrimitivePresent:true
  });
  assert.equal(r.spreadDepthOwnerPrimitivePresent,true);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
  assert.equal(r.residualIncrementalityStatus,"NOT_VALIDATED");
});

t("VL20 no D01 high-volatility/spread/depth numeric threshold is hard-coded",()=>{
  const source=classifyVolLiquidityChurnContext.toString();
  assert.equal(/0\.0[0-9]|\b\d+\.\d+\b/.test(source),false);
});

console.log(`SUMMARY ${pass}/20 PASS`);
