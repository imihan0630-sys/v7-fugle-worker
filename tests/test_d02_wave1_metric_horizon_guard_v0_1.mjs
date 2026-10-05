import assert from 'node:assert/strict';
import {evaluateWave1MetricHorizonConfig,classifyH003TerminalState} from '../research/d02_wave1_metric_horizon_guard_v0_1.mjs';

const base=(key='D02-02:H001',o={})=>({
 evidenceKey:key,
 primaryMetric:'DATE_BALANCED_BRIER_LOSS_IMPROVEMENT',
 metricUnit:'brier_score_points',
 metricDirection:'GREATER_THAN_OR_EQUAL',
 rowWeightedPrimary:false,
 equalDateWeighting:true,
 logLossSecondaryRequired:true,
 pv084EffectSizeReportingRequired:true,
 pv086UtilityReportingRequired:true,
 bestMetricAfterOutcomeAllowed:false,
 bestHorizonAfterOutcomeAllowed:false,
 primaryHorizon:key==='D02-06:H003'?'ACTIVE_LIFECYCLE_ENTRY_TO_FIRST_TERMINAL_OR_13_00_CENSOR':'B2',
 sensitivityHorizons:key==='D02-06:H003'?[]:['B1','B4'],
 sensitivityCanRescuePrimary:false,
 horizonInstabilityReviewOnMaterialOppositeSign:true,
 primitiveEventOwner:key==='D02-03:H20'?'D01-05':null,
 maturityDenominator:key==='D02-06:H003'?'H003_HYPOTHESIS_CLEAN_EVENT_COUNT':null,
 bHorizonsRole:key==='D02-06:H003'?'SECONDARY_DIAGNOSTIC_ONLY':null,
 successStates:key==='D02-06:H003'?['B_REACCELERATION','A_REACCELERATION']:[],
 failureStates:key==='D02-06:H003'?['B_FAILED_REENTRY','A_FAILED_REENTRY']:[],
 censoredStates:key==='D02-06:H003'?['B_EXPIRED_AMBIGUOUS','A_EXPIRED_AMBIGUOUS','PRE_EVENT_ONLY_EXPIRY','UNKNOWN']:[],
 ...o
});

for(const key of ['D02-02:H001','D02-03:H20','D02-06:H003']) assert.equal(evaluateWave1MetricHorizonConfig(base(key)).pass,true);
assert.ok(evaluateWave1MetricHorizonConfig(base('D02-02:H001',{primaryMetric:'AUC'})).reasons.includes('PRIMARY_METRIC_MISMATCH'));
assert.ok(evaluateWave1MetricHorizonConfig(base('D02-02:H001',{rowWeightedPrimary:true})).reasons.includes('ROW_WEIGHTED_PRIMARY_FORBIDDEN'));
assert.ok(evaluateWave1MetricHorizonConfig(base('D02-02:H001',{equalDateWeighting:false})).reasons.includes('EQUAL_DATE_WEIGHTING_REQUIRED'));
assert.ok(evaluateWave1MetricHorizonConfig(base('D02-02:H001',{primaryHorizon:'B1'})).reasons.includes('PRIMARY_HORIZON_MUST_BE_B2'));
assert.ok(evaluateWave1MetricHorizonConfig(base('D02-02:H001',{primaryHorizon:'B4'})).reasons.includes('PRIMARY_HORIZON_MUST_BE_B2'));
assert.ok(evaluateWave1MetricHorizonConfig(base('D02-02:H001',{sensitivityHorizons:['B1']})).reasons.includes('B1_B4_SENSITIVITY_REQUIRED'));
assert.ok(evaluateWave1MetricHorizonConfig(base('D02-02:H001',{sensitivityCanRescuePrimary:true})).reasons.includes('SENSITIVITY_RESCUE_FORBIDDEN'));
assert.ok(evaluateWave1MetricHorizonConfig(base('D02-03:H20',{primitiveEventOwner:'D02'})).reasons.includes('H20_PRIMITIVE_OWNER_MISMATCH'));
assert.ok(evaluateWave1MetricHorizonConfig(base('D02-06:H003',{primaryHorizon:'B2'})).reasons.includes('H003_PRIMARY_HORIZON_MISMATCH'));
assert.ok(evaluateWave1MetricHorizonConfig(base('D02-06:H003',{maturityDenominator:'RAW_ACCEPTANCE_KEY_COUNT'})).reasons.includes('H003_DENOMINATOR_MISMATCH'));
assert.ok(evaluateWave1MetricHorizonConfig(base('D02-06:H003',{bHorizonsRole:'PRIMARY'})).reasons.includes('H003_B_HORIZON_ROLE_MISMATCH'));
assert.ok(evaluateWave1MetricHorizonConfig(base('D02-06:H003',{failureStates:['B_FAILED_REENTRY','A_FAILED_REENTRY','PRE_EVENT_ONLY_EXPIRY']})).reasons.includes('PRE_EVENT_ONLY_EXPIRY_CANNOT_BE_FAILURE'));
assert.ok(evaluateWave1MetricHorizonConfig(base('D02-06:H003',{failureStates:['B_FAILED_REENTRY','A_FAILED_REENTRY','B_EXPIRED_AMBIGUOUS']})).reasons.includes('EXPIRED_AMBIGUOUS_CANNOT_BE_FAILURE'));
assert.equal(classifyH003TerminalState('B_FAILED_REENTRY').label,1);
assert.equal(classifyH003TerminalState('A_FAILED_REENTRY').label,1);
assert.equal(classifyH003TerminalState('B_REACCELERATION').label,0);
assert.equal(classifyH003TerminalState('A_REACCELERATION').label,0);
assert.equal(classifyH003TerminalState('PRE_EVENT_ONLY_EXPIRY').label,null);
assert.equal(classifyH003TerminalState('B_EXPIRED_AMBIGUOUS').status,'CENSORED_OR_UNKNOWN');
assert.equal(evaluateWave1MetricHorizonConfig(base('D02-02:H001')).numericalTargetAuthorized,false);
assert.equal(evaluateWave1MetricHorizonConfig(base('D02-02:H001')).maturityPromotionAuthorized,false);
assert.equal(evaluateWave1MetricHorizonConfig(base('D02-02:H001')).formalCoreChangeAuthorized,false);

console.log(JSON.stringify({status:'PASS',tests:23,contract:'D02_WAVE1_METRIC_HORIZON_GUARD_V0_1'}));
