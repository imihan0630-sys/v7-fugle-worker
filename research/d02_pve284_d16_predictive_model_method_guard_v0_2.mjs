const nonempty=v=>typeof v==="string"&&v.trim().length>0;
const finite=v=>Number.isFinite(Number(v));
const uniq=a=>[...new Set(a)];

export const PVE284_SCHEMA="D02_PVE284_D16_PREDICTIVE_MODEL_METHOD_GUARD_V0_2";
export const PRIMARY_METRIC="DATE_BALANCED_BRIER_LOSS_IMPROVEMENT";

export const CONFIG=Object.freeze({
 "D02-02:H001":{h:"B2",o:"STRUCTURAL_FAILURE_NO_FOLLOW_THROUGH_B2",b:"H001_MODEL_B_LOCAL_PREV5_CONTROLS",c:"H001_MODEL_C_PLUS_SAME_SLOT_RVOL20",f:"F1"},
 "D02-03:H20":{h:"B2",o:"D01_OWNED_BREAKOUT_STRUCTURAL_FAILURE_NO_FOLLOW_THROUGH_B2",b:"H20_MODEL_B_LOCAL_PREV5_ON_D01_BREAKOUT",c:"H20_MODEL_C_PLUS_SAME_SLOT_RVOL20_ON_SAME_D01_BREAKOUT",f:"F1"},
 "D02-04:DRYUP":{h:"ACTIVE_DRYUP_ENTRY_TO_FIRST_REACCELERATION_OR_STRUCTURE_FAILURE_OR_13_00_CENSOR",o:"DRYUP_TERMINAL_DEMAND_REEXPANSION_FAILURE",b:"D02_04_PRICE_GEOMETRY_VOLATILITY_LIQUIDITY_CONTROLS",c:"D02_04_BASELINE_PLUS_LOW_PARTICIPATION_DRYUP",f:"F1"},
 "D02-05:EXTREME_PARTICIPATION":{h:"B2",o:"B2_POSITIVE_RETURN_PROBABILITY",b:"D02_05_RESPONSE_VOLATILITY_EVENT_LIQUIDITY_CONTROLS",c:"D02_05_BASELINE_PLUS_EXTREME_PARTICIPATION_INTERACTION",f:"F2"},
 "D02-06:H003":{h:"ACTIVE_LIFECYCLE_ENTRY_TO_FIRST_TERMINAL_OR_13_00_CENSOR",o:"CLEAN_ACTIVE_ACCEPTANCE_LIFECYCLE_TERMINAL_FAILURE",b:"PRICE_GEOMETRY_ONLY_V0_1",c:"PRICE_GEOMETRY_PLUS_VOLUME_EFFORT_V0_1",f:"F2"},
 "D02-07:SVB20":{h:"D5",o:"D5_POSITIVE_RETURN_PROBABILITY",b:"D02_07_MODEL_C_PRICE_DIRECT_VOLUME_RESPONSE_PERSISTENCE",c:"D02_07_MODEL_D_PLUS_SIGNED_VOLUME_BALANCE20",f:"F3"},
 "D02-08:PROVIDER_PRESSURE":{h:"B2",o:"B2_POSITIVE_RETURN_PROBABILITY",b:"D02_08_OHLCV_RVOL_RESPONSE_COVERAGE_LIQUIDITY_CONTROLS",c:"D02_08_BASELINE_PLUS_PROVIDER_TRADE_PRESSURE_PROXY",f:"F4"},
 "D02-09:PIVOT_SIGNED_VOLUME":{h:"D5",o:"D5_POSITIVE_RETURN_PROBABILITY",b:"D02_09_PRIMITIVE_PRICE_VOLUME_TRAJECTORY",c:"D02_09_BASELINE_PLUS_TYPED_PIVOT_SIGNED_VOLUME_DIVERGENCE",f:"F3"},
 "D02-09:PARTICIPATION_TRAJECTORY":{h:"B2",o:"B2_POSITIVE_RETURN_PROBABILITY",b:"D02_09_TRAJECTORY_PRIMITIVE_PRICE_PARTICIPATION_CONTROLS",c:"D02_09_BASELINE_PLUS_TYPED_PARTICIPATION_TRAJECTORY",f:"F3"},
 "D02-10:TREND_VOLUME_INTERACTION":{h:"B2",o:"B2_RETURN_ALIGNED_WITH_PRESESSION_TREND_DIRECTION",b:"D02_10_MODEL_C_DIRECT_TREND_PLUS_PARTICIPATION",c:"D02_10_MODEL_D_PLUS_EXPLICIT_TREND_VOLUME_INTERACTION",f:"F5"},
 "D02-12:TIME_OF_DAY_VOLUME_CURVE":{h:"B1_WITHIN_09_00_13_00_BOUNDED_WINDOW",o:"B1_POSITIVE_RETURN_PROBABILITY",b:"D02_12_RVOL_CUMPACE_PRICE_LOCATION_CONTROLS",c:"D02_12_BASELINE_PLUS_TIME_OF_DAY_VOLUME_CURVE",f:"F5"},
 "D02-12:PRICE_BY_VOLUME_PROFILE":{h:"B1_WITHIN_09_00_13_00_BOUNDED_WINDOW",o:"B1_POSITIVE_RETURN_PROBABILITY",b:"D02_12_RVOL_CUMPACE_PRICE_LOCATION_CONTROLS",c:"D02_12_BASELINE_PLUS_PRICE_BY_VOLUME_PROFILE",f:"F5"}
});

export function evaluatePve284MethodReceipt(x={}){
 const r=[],key=String(x.evidenceKey||""),cfg=CONFIG[key];
 if(!cfg)r.push("UNSUPPORTED_PREDICTIVE_EVIDENCE_KEY");
 if(x.owner!=="D16-19")r.push("D16_19_OWNER_REQUIRED");
 for(const [name,val] of [
  ["METHOD_RECEIPT_ID",x.methodReceiptId],["METHOD_VERSION",x.methodVersion],["EXPERIMENT_VERSION",x.experimentVersion],
  ["ESTIMATOR_FAMILY",x.estimatorFamily],["CALIBRATION_METHOD",x.calibrationMethod],["PREPROCESSING_VERSION",x.preprocessingVersion],
  ["FEATURE_SELECTION_POLICY",x.featureSelectionPolicy],["REGULARIZATION_POLICY",x.regularizationPolicy],
  ["TRAINING_WINDOW_POLICY",x.trainingWindowPolicy],["VALIDATION_PARTITION_POLICY",x.validationPartitionPolicy],
  ["CALIBRATION_PARTITION_POLICY",x.calibrationPartitionPolicy],["REFIT_POLICY",x.refitPolicy],
  ["RANDOM_SEED_POLICY",x.randomSeedPolicy],["MISSING_VALUE_POLICY",x.missingValuePolicy],
  ["CLASS_IMBALANCE_POLICY",x.classImbalancePolicy],["MODEL_SEARCH_FAMILY_ID",x.modelSearchFamilyId],
  ["FROZEN_AT",x.frozenAt],["METHOD_HASH",x.methodHash]
 ]) if(!nonempty(val))r.push(name+"_MISSING");
 if(x.primaryMetric!==PRIMARY_METRIC)r.push("PRIMARY_METRIC_MISMATCH");
 if(cfg&&x.outcomeHorizon!==cfg.h)r.push("OUTCOME_HORIZON_MISMATCH");
 if(cfg&&x.outcomeId!==cfg.o)r.push("OUTCOME_ID_MISMATCH");
 if(cfg&&x.baselineFeatureSetId!==cfg.b)r.push("BASELINE_FEATURE_SET_ID_MISMATCH");
 if(cfg&&x.challengerFeatureSetId!==cfg.c)r.push("CHALLENGER_FEATURE_SET_ID_MISMATCH");
 if(cfg&&x.multipleTestingFamilyId!==cfg.f)r.push("MULTIPLE_TESTING_FAMILY_ID_MISMATCH");
 if(x.equalDateWeighting!==true)r.push("EQUAL_DATE_WEIGHTING_REQUIRED");
 if(x.identicalCommonSupport!==true)r.push("IDENTICAL_COMMON_SUPPORT_REQUIRED");
 if(x.identicalPartitions!==true)r.push("IDENTICAL_PARTITIONS_REQUIRED");
 if(x.baselineChallengerSameMethodFamily!==true)r.push("SAME_METHOD_FAMILY_REQUIRED_FOR_FEATURE_INCREMENT");
 if(x.predictionsFrozenBeforeLabels!==true)r.push("PREDICTIONS_MUST_BE_FROZEN_BEFORE_LABELS");
 if(x.outcomeAccessStateAtFreeze!=="OUTCOME_CLOSED")r.push("METHOD_FROZEN_AFTER_OUTCOME_ACCESS");
 if(x.status!=="FROZEN")r.push("METHOD_STATUS_NOT_FROZEN");
 if(!finite(x.candidateMethodCount)||Number(x.candidateMethodCount)<1)r.push("CANDIDATE_METHOD_COUNT_INVALID");
 if(x.postOutcomeMethodSelectionAllowed===true)r.push("POST_OUTCOME_METHOD_SELECTION_FORBIDDEN");
 if(x.unregisteredMethodFamilySearch===true)r.push("UNREGISTERED_METHOD_SEARCH_FORBIDDEN");
 if(x.bestSeedAfterOutcomeAllowed===true)r.push("POST_OUTCOME_SEED_SELECTION_FORBIDDEN");
 if(x.bestCalibrationAfterOutcomeAllowed===true)r.push("POST_OUTCOME_CALIBRATION_SELECTION_FORBIDDEN");
 if(!Number.isFinite(Date.parse(x.frozenAt)))r.push("FROZEN_AT_INVALID");
 const reasons=uniq(r);
 return Object.freeze({
   schemaVersion:PVE284_SCHEMA,evidenceKey:key,pass:reasons.length===0,reasons:Object.freeze(reasons),
   promotionGradeMethodReady:reasons.length===0,
   numericalTargetAuthorized:false,outcomeAccessAuthorized:false,
   maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false
 });
}

export function summarizePve284Receipts(receipts=[]){
 const a=Array.isArray(receipts)?receipts:[];
 const byKey={};
 for(const key of Object.keys(CONFIG)){
   const rs=a.filter(x=>x?.evidenceKey===key).map(evaluatePve284MethodReceipt);
   const good=rs.filter(x=>x.pass);
   byKey[key]=Object.freeze({receiptCount:rs.length,validFrozenReceiptCount:good.length,state:good.length===1?"READY":good.length===0?"BLOCKED_METHOD_RECEIPT_MISSING":"BLOCKED_MULTIPLE_ACTIVE_METHOD_RECEIPTS"});
 }
 return Object.freeze({schemaVersion:PVE284_SCHEMA,evidenceKeyCount:Object.keys(CONFIG).length,byKey:Object.freeze(byKey),allReady:Object.values(byKey).every(x=>x.state==="READY"),maturityPromotionAuthorized:false,formalCoreChangeAuthorized:false});
}
