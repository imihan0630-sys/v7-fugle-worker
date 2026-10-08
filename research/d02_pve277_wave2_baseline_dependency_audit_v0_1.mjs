import {evaluateWave2Row} from "./d02_l4_wave2_admission_evaluator_v0_1.mjs";

export const PVE277_SCHEMA="D02_PVE277_WAVE2_BASELINE_DEPENDENCY_AUDIT_V0_1";

export const DEPENDENCY_MATRIX=Object.freeze({
  "D02-04":Object.freeze({class:"DIRECT_INTRADAY_BASELINE_DEPENDENT",required:["SAME_SLOT_VOLUME_BASELINE"]}),
  "D02-05":Object.freeze({class:"DIRECT_INTRADAY_VOLUME_AND_RANGE_BASELINE_DEPENDENT",required:["SAME_SLOT_VOLUME_BASELINE","SAME_SLOT_RANGE_BASELINE"]}),
  "D02-07":Object.freeze({class:"DAILY_CONTINUITY_DEPENDENT_NOT_MEDIAN_BASELINE",required:["DAILY_VOLUME_CONTINUITY"]}),
  "D02-08":Object.freeze({class:"PRIMARY_SOURCE_BASELINE_INDEPENDENT_CONTROL_DEPENDENT",required:["CONTROL_FRESHNESS_AT_INCREMENTAL_COMPARISON"]}),
  "D02-09:PIVOT_SIGNED_VOLUME":Object.freeze({class:"DAILY_CONTINUITY_DEPENDENT_NOT_MEDIAN_BASELINE",required:["DAILY_VOLUME_CONTINUITY"]}),
  "D02-09:PARTICIPATION_TRAJECTORY":Object.freeze({class:"DIRECT_INTRADAY_BASELINE_DEPENDENT",required:["SAME_SLOT_VOLUME_BASELINE","CUMULATIVE_PREFIX_BASELINE_IF_USED","PERSISTENCE_ADJACENCY_IF_USED"]}),
  "D02-10":Object.freeze({class:"DIRECT_PARTICIPATION_LINEAGE_DEPENDENT",required:["PARTICIPATION_BASELINE_LINEAGE"]}),
  "D02-11":Object.freeze({class:"ROLLING_20_SESSION_DAILY_BASELINE_DEPENDENT",required:["EXACT_PRIOR_20_ELIGIBLE_SESSIONS","LATEST_EXPECTED_PRIOR_SESSION","DAILY_UNIT_AND_CA_CONTINUITY"]}),
  "D02-12:TIME_OF_DAY_VOLUME_CURVE":Object.freeze({class:"HISTORICAL_INTRADAY_DENOMINATOR_AND_CONTROL_DEPENDENT",required:["TIME_CURVE_PRIOR_SESSION_DENOMINATOR","SAME_SLOT_RVOL_CONTROL_FRESHNESS","CUMULATIVE_PACE_CONTROL_FRESHNESS"]}),
  "D02-12:PRICE_BY_VOLUME_PROFILE":Object.freeze({class:"PRIMARY_PROSPECTIVE_PROFILE_CONTROL_DEPENDENT",required:["SAME_SLOT_RVOL_CONTROL_FRESHNESS","CUMULATIVE_PACE_CONTROL_FRESHNESS"]})
});

export function dependencyKey(row={}){
  if(row.moduleId==="D02-09") return "D02-09:"+String(row.family||"");
  if(row.moduleId==="D02-12") return "D02-12:"+String(row.family||"");
  return String(row.moduleId||"");
}

export function auditPve277Wave2Dependency(row={}){
  const legacy=evaluateWave2Row(row);
  const key=dependencyKey(row);
  const dep=DEPENDENCY_MATRIX[key]||null;
  return Object.freeze({
    schemaVersion:PVE277_SCHEMA,
    dependencyKey:key,
    dependency:dep,
    legacyAdmissionPass:legacy.pass,
    legacyReasons:Object.freeze([...legacy.reasons]),
    baselineOrContinuityEvidenceExplicitInLegacyRowGate:false,
    newEvidenceRequired:dep!==null,
    primaryFeatureBaselineIndependent:key==="D02-08"||key==="D02-12:PRICE_BY_VOLUME_PROFILE",
    maturityPromotionAuthorized:false,
    formalCoreChangeAuthorized:false
  });
}
