import assert from "node:assert/strict";
import fs from "node:fs";
import {evaluatePve283MetricHorizon,evaluateD0211Pve283Block,PRIMARY_METRIC} from "../research/d02_pve283_nonwave1_primary_metric_horizon_guard_v0_1.mjs";
import {classifyPve282} from "../research/d02_pve282_promotion_design_readiness_audit_v0_1.mjs";
const reg=JSON.parse(fs.readFileSync(new URL("../research/d02_l4_effect_target_registry_v0_5.json",import.meta.url),"utf8"));
const keys=["D02-04:DRYUP","D02-05:EXTREME_PARTICIPATION","D02-07:SVB20","D02-08:PROVIDER_PRESSURE","D02-09:PIVOT_SIGNED_VOLUME","D02-09:PARTICIPATION_TRAJECTORY","D02-10:TREND_VOLUME_INTERACTION","D02-12:TIME_OF_DAY_VOLUME_CURVE","D02-12:PRICE_BY_VOLUME_PROFILE"];
for(const k of keys){
 const e=reg.entries[k];
 const r=evaluatePve283MetricHorizon({evidenceKey:k,primaryMetric:e.metric,metricUnit:e.unit,metricDirection:e.direction,outcomeHorizon:e.outcomeHorizon,outcomeFamily:e.outcomeFamily,sensitivityHorizons:e.sensitivityHorizons,sensitivityCanRescuePrimary:e.sensitivityCanRescuePrimary,rowWeightedPrimary:false,equalDateWeighting:true,outcomeBlindFreeze:true,numericTargetFrozen:false,maturityPromotionAuthorized:false});
 assert.equal(r.pass,true,k);
 assert.equal(e.metric,PRIMARY_METRIC,k);
 assert.equal(e.thresholdValue,null,k);
 assert.equal(e.targetHash,null,k);
}
const bad=reg.entries["D02-05:EXTREME_PARTICIPATION"];
assert.equal(evaluatePve283MetricHorizon({evidenceKey:"D02-05:EXTREME_PARTICIPATION",primaryMetric:bad.metric,metricUnit:bad.unit,metricDirection:bad.direction,outcomeHorizon:"B4",outcomeFamily:bad.outcomeFamily,sensitivityHorizons:bad.sensitivityHorizons,sensitivityCanRescuePrimary:false,rowWeightedPrimary:false,equalDateWeighting:true,outcomeBlindFreeze:true,numericTargetFrozen:false}).pass,false);
assert.equal(evaluatePve283MetricHorizon({evidenceKey:"D02-07:SVB20",primaryMetric:PRIMARY_METRIC,metricUnit:"brier_score_points",metricDirection:"GREATER_THAN_OR_EQUAL",outcomeHorizon:"D5",outcomeFamily:"D5_POSITIVE_RETURN_PROBABILITY",sensitivityHorizons:["D1","D3","D10"],sensitivityCanRescuePrimary:true,rowWeightedPrimary:false,equalDateWeighting:true,outcomeBlindFreeze:true,numericTargetFrozen:false}).pass,false);
assert.equal(evaluatePve283MetricHorizon({evidenceKey:"D02-08:PROVIDER_PRESSURE",primaryMetric:PRIMARY_METRIC,metricUnit:"brier_score_points",metricDirection:"GREATER_THAN_OR_EQUAL",outcomeHorizon:"B2",outcomeFamily:"B2_POSITIVE_RETURN_PROBABILITY",sensitivityHorizons:["B1","B4"],sensitivityCanRescuePrimary:false,rowWeightedPrimary:false,equalDateWeighting:true,outcomeBlindFreeze:false,numericTargetFrozen:false}).pass,false);
assert.equal(evaluateD0211Pve283Block({evidenceKey:"D02-11:LIQUIDITY_COUNTERFACTUAL",d14CostQualityAnchorReady:false,primaryUtilityMetricFrozen:false,primaryHorizonFrozen:false}).pass,true);
assert.equal(evaluateD0211Pve283Block({evidenceKey:"D02-11:LIQUIDITY_COUNTERFACTUAL",d14CostQualityAnchorReady:false,primaryUtilityMetricFrozen:true,primaryHorizonFrozen:false}).pass,false);
const readiness=classifyPve282({registry:reg,d14:{statutoryTaxSemanticsKnown:true,ownerCommissionKnown:false,brokerConfirmedSlippageAvailable:false,universalEconomicCostAnchorReady:false,d02_11CostQualityAnchorReady:false},d16:{}});
assert.equal(readiness.counts.targetStates.READY??0,0);
assert.equal(readiness.counts.targetStates.PARTIAL_NUMERIC_JUSTIFICATION_MISSING,13);
assert.equal(readiness.counts.targetStates.BLOCKED_PRIMARY_METRIC_OR_HORIZON_NOT_FROZEN,1);
assert.equal(readiness.targetReadiness["D02-11:LIQUIDITY_COUNTERFACTUAL"].state,"BLOCKED_PRIMARY_METRIC_OR_HORIZON_NOT_FROZEN");
assert.equal(readiness.allPromotionDesignReady,false);
console.log(JSON.stringify({status:"PASS",assertions:48,partialTargets:13,blockedTargets:1}));
