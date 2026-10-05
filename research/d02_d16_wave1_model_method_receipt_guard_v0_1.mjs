const nonempty=v=>typeof v==='string'&&v.trim().length>0;
const finite=v=>Number.isFinite(Number(v));
const uniq=a=>[...new Set(a)];
const ok=(x={})=>({pass:true,reasons:[],...x});
const no=(r,x={})=>({pass:false,reasons:uniq(r),...x});
export const D02_D16_WAVE1_METHOD_GUARD_VERSION='D02_D16_WAVE1_METHOD_GUARD_V0_1';
const KEYS=new Set(['D02-02:H001','D02-03:H20','D02-06:H003']);
const HORIZON={
 'D02-02:H001':'B2',
 'D02-03:H20':'B2',
 'D02-06:H003':'ACTIVE_LIFECYCLE_ENTRY_TO_FIRST_TERMINAL_OR_13_00_CENSOR'
};
const OUTCOME={
 'D02-02:H001':'STRUCTURAL_FAILURE_NO_FOLLOW_THROUGH_B2',
 'D02-03:H20':'D01_OWNED_BREAKOUT_STRUCTURAL_FAILURE_NO_FOLLOW_THROUGH_B2',
 'D02-06:H003':'CLEAN_ACTIVE_ACCEPTANCE_LIFECYCLE_TERMINAL_FAILURE'
};

export function evaluateWave1MethodReceipt(x={}){
 const r=[],key=String(x.evidenceKey||'');
 if(!KEYS.has(key))r.push('UNSUPPORTED_EVIDENCE_KEY');
 if(x.owner!=='D16-19')r.push('D16_19_OWNER_REQUIRED');
 for(const [name,val] of [
  ['METHOD_RECEIPT_ID',x.methodReceiptId],['METHOD_VERSION',x.methodVersion],['EXPERIMENT_VERSION',x.experimentVersion],
  ['BASELINE_FEATURE_SET_ID',x.baselineFeatureSetId],['CHALLENGER_FEATURE_SET_ID',x.challengerFeatureSetId],
  ['ESTIMATOR_FAMILY',x.estimatorFamily],['CALIBRATION_METHOD',x.calibrationMethod],['PREPROCESSING_VERSION',x.preprocessingVersion],
  ['FEATURE_SELECTION_POLICY',x.featureSelectionPolicy],['REGULARIZATION_POLICY',x.regularizationPolicy],
  ['TRAINING_WINDOW_POLICY',x.trainingWindowPolicy],['VALIDATION_PARTITION_POLICY',x.validationPartitionPolicy],
  ['CALIBRATION_PARTITION_POLICY',x.calibrationPartitionPolicy],['REFIT_POLICY',x.refitPolicy],
  ['RANDOM_SEED_POLICY',x.randomSeedPolicy],['MISSING_VALUE_POLICY',x.missingValuePolicy],
  ['CLASS_IMBALANCE_POLICY',x.classImbalancePolicy],['MODEL_SEARCH_FAMILY_ID',x.modelSearchFamilyId],
  ['MULTIPLE_TESTING_FAMILY_ID',x.multipleTestingFamilyId],['FROZEN_AT',x.frozenAt],['METHOD_HASH',x.methodHash]
 ]) if(!nonempty(val))r.push(name+'_MISSING');

 if(x.primaryMetric!=='DATE_BALANCED_BRIER_LOSS_IMPROVEMENT')r.push('PRIMARY_METRIC_MISMATCH');
 if(x.outcomeHorizon!==HORIZON[key])r.push('OUTCOME_HORIZON_MISMATCH');
 if(x.outcomeId!==OUTCOME[key])r.push('OUTCOME_ID_MISMATCH');
 if(x.equalDateWeighting!==true)r.push('EQUAL_DATE_WEIGHTING_REQUIRED');
 if(x.identicalCommonSupport!==true)r.push('IDENTICAL_COMMON_SUPPORT_REQUIRED');
 if(x.identicalPartitions!==true)r.push('IDENTICAL_PARTITIONS_REQUIRED');
 if(x.baselineChallengerSameMethodFamily!==true)r.push('SAME_METHOD_FAMILY_REQUIRED_FOR_FEATURE_INCREMENT');
 if(x.predictionsFrozenBeforeLabels!==true)r.push('PREDICTIONS_MUST_BE_FROZEN_BEFORE_LABELS');
 if(x.outcomeAccessStateAtFreeze!=='OUTCOME_CLOSED')r.push('METHOD_FROZEN_AFTER_OUTCOME_ACCESS');
 if(x.status!=='FROZEN')r.push('METHOD_STATUS_NOT_FROZEN');
 if(!finite(x.candidateMethodCount)||Number(x.candidateMethodCount)<1)r.push('CANDIDATE_METHOD_COUNT_INVALID');
 if(x.postOutcomeMethodSelectionAllowed===true)r.push('POST_OUTCOME_METHOD_SELECTION_FORBIDDEN');
 if(x.unregisteredMethodFamilySearch===true)r.push('UNREGISTERED_METHOD_SEARCH_FORBIDDEN');
 if(!Number.isFinite(Date.parse(x.frozenAt)))r.push('FROZEN_AT_INVALID');

 return r.length?no(r,{evidenceKey:key}):ok({evidenceKey:key,promotionGradeMethodReady:true,maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false});
}
