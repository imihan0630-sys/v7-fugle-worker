import assert from "node:assert/strict";
import {evaluatePve284MethodReceipt,summarizePve284Receipts,CONFIG,PRIMARY_METRIC} from "../research/d02_pve284_d16_predictive_model_method_guard_v0_2.mjs";

let id=0;
const fixture=(key,over={})=>{
 const c=CONFIG[key];
 return {
  owner:"D16-19",methodReceiptId:"M"+(++id),methodVersion:"V1",evidenceKey:key,experimentVersion:"EXP1",
  primaryMetric:PRIMARY_METRIC,outcomeId:c.o,outcomeHorizon:c.h,baselineFeatureSetId:c.b,challengerFeatureSetId:c.c,
  estimatorFamily:"FROZEN_BY_D16_FIXTURE",calibrationMethod:"FROZEN_CALIBRATION_FIXTURE",
  preprocessingVersion:"PRE_V1",featureSelectionPolicy:"NO_POST_OUTCOME_SELECTION",regularizationPolicy:"FROZEN_PRE_OUTCOME",
  trainingWindowPolicy:"EXPANDING_OR_FIXED_FROZEN_BY_D16",validationPartitionPolicy:"DATE_GROUPED_FROZEN",
  calibrationPartitionPolicy:"DATE_GROUPED_DISJOINT_FROZEN",refitPolicy:"FROZEN_PRE_OUTCOME",
  randomSeedPolicy:"DETERMINISTIC_HASHED_SEEDS",missingValuePolicy:"FAIL_CLOSED_OR_FROZEN_IMPUTATION",
  classImbalancePolicy:"FROZEN_PRE_OUTCOME",modelSearchFamilyId:"REGISTERED_FAMILY_V1",candidateMethodCount:1,
  multipleTestingFamilyId:c.f,equalDateWeighting:true,identicalCommonSupport:true,identicalPartitions:true,
  baselineChallengerSameMethodFamily:true,predictionsFrozenBeforeLabels:true,outcomeAccessStateAtFreeze:"OUTCOME_CLOSED",
  frozenAt:"2026-10-08T09:00:00+08:00",methodHash:"a".repeat(64),status:"FROZEN",
  postOutcomeMethodSelectionAllowed:false,unregisteredMethodFamilySearch:false,bestSeedAfterOutcomeAllowed:false,bestCalibrationAfterOutcomeAllowed:false,
  ...over
 };
};
const keys=Object.keys(CONFIG);
assert.equal(keys.length,12);
for(const k of keys)assert.equal(evaluatePve284MethodReceipt(fixture(k)).pass,true,k);
assert.equal(evaluatePve284MethodReceipt(fixture("D02-08:PROVIDER_PRESSURE",{outcomeHorizon:"B4"})).pass,false);
assert.equal(evaluatePve284MethodReceipt(fixture("D02-07:SVB20",{challengerFeatureSetId:"RAW_OBV"})).pass,false);
assert.equal(evaluatePve284MethodReceipt(fixture("D02-10:TREND_VOLUME_INTERACTION",{baselineChallengerSameMethodFamily:false})).pass,false);
assert.equal(evaluatePve284MethodReceipt(fixture("D02-12:TIME_OF_DAY_VOLUME_CURVE",{identicalPartitions:false})).pass,false);
assert.equal(evaluatePve284MethodReceipt(fixture("D02-05:EXTREME_PARTICIPATION",{postOutcomeMethodSelectionAllowed:true})).pass,false);
assert.equal(evaluatePve284MethodReceipt(fixture("D02-09:PIVOT_SIGNED_VOLUME",{bestSeedAfterOutcomeAllowed:true})).pass,false);
assert.equal(evaluatePve284MethodReceipt(fixture("D02-09:PARTICIPATION_TRAJECTORY",{bestCalibrationAfterOutcomeAllowed:true})).pass,false);
let s=summarizePve284Receipts([]);
assert.equal(s.evidenceKeyCount,12);assert.equal(s.allReady,false);
for(const k of keys)assert.equal(s.byKey[k].state,"BLOCKED_METHOD_RECEIPT_MISSING",k);
const oneEach=keys.map(k=>fixture(k));s=summarizePve284Receipts(oneEach);assert.equal(s.allReady,true);
const dup=[...oneEach,fixture("D02-02:H001")];s=summarizePve284Receipts(dup);assert.equal(s.byKey["D02-02:H001"].state,"BLOCKED_MULTIPLE_ACTIVE_METHOD_RECEIPTS");
assert.equal(evaluatePve284MethodReceipt(fixture("D02-02:H001")).maturityPromotionAuthorized,false);
console.log(JSON.stringify({status:"PASS",assertions:37,predictiveEvidenceKeys:12}));
