const uniq=a=>[...new Set(a)];
const nonempty=v=>typeof v==='string'&&v.trim().length>0;
const ok=(x={})=>({pass:true,reasons:[],...x});
const no=(r,x={})=>({pass:false,reasons:uniq(r),...x});

export const D02_WAVE1_METRIC_HORIZON_GUARD_VERSION='D02_WAVE1_METRIC_HORIZON_GUARD_V0_1';
export const PRIMARY_METRIC='DATE_BALANCED_BRIER_LOSS_IMPROVEMENT';
export const WAVE1_KEYS=new Set(['D02-02:H001','D02-03:H20','D02-06:H003']);
export const H003_SUCCESS=new Set(['B_REACCELERATION','A_REACCELERATION']);
export const H003_FAILURE=new Set(['B_FAILED_REENTRY','A_FAILED_REENTRY']);
export const H003_CENSORED=new Set(['B_EXPIRED_AMBIGUOUS','A_EXPIRED_AMBIGUOUS','PRE_EVENT_ONLY_EXPIRY','UNKNOWN']);

export function evaluateWave1MetricHorizonConfig(x={}){
 const r=[],key=String(x.evidenceKey||'');
 if(!WAVE1_KEYS.has(key))r.push('UNSUPPORTED_WAVE1_EVIDENCE_KEY');
 if(x.primaryMetric!==PRIMARY_METRIC)r.push('PRIMARY_METRIC_MISMATCH');
 if(x.metricUnit!=='brier_score_points')r.push('METRIC_UNIT_MISMATCH');
 if(x.metricDirection!=='GREATER_THAN_OR_EQUAL')r.push('METRIC_DIRECTION_MISMATCH');
 if(x.rowWeightedPrimary===true)r.push('ROW_WEIGHTED_PRIMARY_FORBIDDEN');
 if(x.equalDateWeighting!==true)r.push('EQUAL_DATE_WEIGHTING_REQUIRED');
 if(x.logLossSecondaryRequired!==true)r.push('LOG_LOSS_SECONDARY_REQUIRED');
 if(x.pv084EffectSizeReportingRequired!==true)r.push('PV084_EFFECT_SIZE_REPORTING_REQUIRED');
 if(x.pv086UtilityReportingRequired!==true)r.push('PV086_UTILITY_REPORTING_REQUIRED');
 if(x.bestMetricAfterOutcomeAllowed===true)r.push('POST_OUTCOME_METRIC_SELECTION_FORBIDDEN');
 if(x.bestHorizonAfterOutcomeAllowed===true)r.push('POST_OUTCOME_HORIZON_SELECTION_FORBIDDEN');

 if(key==='D02-02:H001'||key==='D02-03:H20'){
   if(x.primaryHorizon!=='B2')r.push('PRIMARY_HORIZON_MUST_BE_B2');
   const s=Array.isArray(x.sensitivityHorizons)?x.sensitivityHorizons:[];
   if(!(s.length===2&&s.includes('B1')&&s.includes('B4')))r.push('B1_B4_SENSITIVITY_REQUIRED');
   if(x.sensitivityCanRescuePrimary!==false)r.push('SENSITIVITY_RESCUE_FORBIDDEN');
   if(x.horizonInstabilityReviewOnMaterialOppositeSign!==true)r.push('HORIZON_INSTABILITY_REVIEW_REQUIRED');
   if(key==='D02-03:H20'&&x.primitiveEventOwner!=='D01-05')r.push('H20_PRIMITIVE_OWNER_MISMATCH');
 }

 if(key==='D02-06:H003'){
   if(x.primaryHorizon!=='ACTIVE_LIFECYCLE_ENTRY_TO_FIRST_TERMINAL_OR_13_00_CENSOR')r.push('H003_PRIMARY_HORIZON_MISMATCH');
   if(x.maturityDenominator!=='H003_HYPOTHESIS_CLEAN_EVENT_COUNT')r.push('H003_DENOMINATOR_MISMATCH');
   if(x.bHorizonsRole!=='SECONDARY_DIAGNOSTIC_ONLY')r.push('H003_B_HORIZON_ROLE_MISMATCH');
   const succ=new Set(Array.isArray(x.successStates)?x.successStates:[]);
   const fail=new Set(Array.isArray(x.failureStates)?x.failureStates:[]);
   const cens=new Set(Array.isArray(x.censoredStates)?x.censoredStates:[]);
   for(const v of H003_SUCCESS)if(!succ.has(v))r.push('H003_SUCCESS_STATE_MISSING_'+v);
   for(const v of H003_FAILURE)if(!fail.has(v))r.push('H003_FAILURE_STATE_MISSING_'+v);
   for(const v of H003_CENSORED)if(!cens.has(v))r.push('H003_CENSORED_STATE_MISSING_'+v);
   if(fail.has('PRE_EVENT_ONLY_EXPIRY'))r.push('PRE_EVENT_ONLY_EXPIRY_CANNOT_BE_FAILURE');
   if(fail.has('B_EXPIRED_AMBIGUOUS')||fail.has('A_EXPIRED_AMBIGUOUS'))r.push('EXPIRED_AMBIGUOUS_CANNOT_BE_FAILURE');
 }

 return r.length?no(r,{evidenceKey:key}):ok({evidenceKey:key,numericalTargetAuthorized:false,maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false});
}

export function classifyH003TerminalState(state){
 if(H003_FAILURE.has(state))return {label:1,status:'RESOLVED_FAILURE'};
 if(H003_SUCCESS.has(state))return {label:0,status:'RESOLVED_SUCCESS'};
 if(H003_CENSORED.has(state))return {label:null,status:'CENSORED_OR_UNKNOWN'};
 return {label:null,status:'UNREGISTERED_STATE'};
}
