export const PVE283_SCHEMA="D02_PVE283_NONWAVE1_PRIMARY_METRIC_HORIZON_GUARD_V0_1";
export const PRIMARY_METRIC="DATE_BALANCED_BRIER_LOSS_IMPROVEMENT";
const CFG=Object.freeze({
 "D02-04:DRYUP":{h:"ACTIVE_DRYUP_ENTRY_TO_FIRST_REACCELERATION_OR_STRUCTURE_FAILURE_OR_13_00_CENSOR",o:"DRYUP_TERMINAL_DEMAND_REEXPANSION_FAILURE",s:["B2_PATH_DIAGNOSTIC_ONLY"]},
 "D02-05:EXTREME_PARTICIPATION":{h:"B2",o:"B2_POSITIVE_RETURN_PROBABILITY",s:["B1","B4"]},
 "D02-07:SVB20":{h:"D5",o:"D5_POSITIVE_RETURN_PROBABILITY",s:["D1","D3","D10"]},
 "D02-08:PROVIDER_PRESSURE":{h:"B2",o:"B2_POSITIVE_RETURN_PROBABILITY",s:["B1","B4"]},
 "D02-09:PIVOT_SIGNED_VOLUME":{h:"D5",o:"D5_POSITIVE_RETURN_PROBABILITY",s:["D1","D3","D10"]},
 "D02-09:PARTICIPATION_TRAJECTORY":{h:"B2",o:"B2_POSITIVE_RETURN_PROBABILITY",s:["B1","B4"]},
 "D02-10:TREND_VOLUME_INTERACTION":{h:"B2",o:"B2_RETURN_ALIGNED_WITH_PRESESSION_TREND_DIRECTION",s:["B1","B4"]},
 "D02-12:TIME_OF_DAY_VOLUME_CURVE":{h:"B1_WITHIN_09_00_13_00_BOUNDED_WINDOW",o:"B1_POSITIVE_RETURN_PROBABILITY",s:["B2_WHEN_COMPLETE_NON_RESCUING"]},
 "D02-12:PRICE_BY_VOLUME_PROFILE":{h:"B1_WITHIN_09_00_13_00_BOUNDED_WINDOW",o:"B1_POSITIVE_RETURN_PROBABILITY",s:["B2_WHEN_COMPLETE_NON_RESCUING"]}
});
const uniq=a=>[...new Set(a)];
export function evaluatePve283MetricHorizon(x={}){
 const r=[],key=String(x.evidenceKey||""),c=CFG[key];
 if(!c)r.push("UNSUPPORTED_PVE283_EVIDENCE_KEY");
 if(x.primaryMetric!==PRIMARY_METRIC)r.push("PRIMARY_METRIC_MISMATCH");
 if(x.metricUnit!=="brier_score_points")r.push("METRIC_UNIT_MISMATCH");
 if(x.metricDirection!=="GREATER_THAN_OR_EQUAL")r.push("METRIC_DIRECTION_MISMATCH");
 if(c&&x.outcomeHorizon!==c.h)r.push("PRIMARY_HORIZON_MISMATCH");
 if(c&&x.outcomeFamily!==c.o)r.push("PRIMARY_OUTCOME_MISMATCH");
 const s=Array.isArray(x.sensitivityHorizons)?x.sensitivityHorizons:[];
 if(c&&(s.length!==c.s.length||c.s.some(v=>!s.includes(v))))r.push("SENSITIVITY_HORIZONS_MISMATCH");
 if(x.sensitivityCanRescuePrimary!==false)r.push("SENSITIVITY_RESCUE_FORBIDDEN");
 if(x.rowWeightedPrimary===true)r.push("ROW_WEIGHTED_PRIMARY_FORBIDDEN");
 if(x.equalDateWeighting!==true)r.push("EQUAL_DATE_WEIGHTING_REQUIRED");
 if(x.outcomeBlindFreeze!==true)r.push("OUTCOME_BLIND_FREEZE_REQUIRED");
 if(x.numericTargetFrozen===true)r.push("PVE283_CANNOT_FREEZE_NUMERIC_TARGET");
 if(x.maturityPromotionAuthorized===true)r.push("PVE283_CANNOT_AUTHORIZE_MATURITY");
 return Object.freeze({schemaVersion:PVE283_SCHEMA,evidenceKey:key,pass:r.length===0,reasons:Object.freeze(uniq(r)),numericalTargetAuthorized:false,maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false});
}
export function evaluateD0211Pve283Block(x={}){
 const r=[];
 if(x.evidenceKey!=="D02-11:LIQUIDITY_COUNTERFACTUAL")r.push("D02_11_KEY_REQUIRED");
 if(x.d14CostQualityAnchorReady===true)r.push("USE_FUTURE_SUPERSEDING_CONTRACT_WHEN_D14_READY");
 if(x.primaryUtilityMetricFrozen===true)r.push("D02_11_UTILITY_METRIC_MUST_REMAIN_UNFROZEN");
 if(x.primaryHorizonFrozen===true)r.push("D02_11_HORIZON_MUST_REMAIN_UNFROZEN");
 return Object.freeze({schemaVersion:PVE283_SCHEMA,evidenceKey:"D02-11:LIQUIDITY_COUNTERFACTUAL",pass:r.length===0,reasons:Object.freeze(uniq(r)),state:r.length===0?"BLOCKED_D14_COST_QUALITY":"INVALID_BLOCK_STATE",maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false});
}
