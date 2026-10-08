import assert from "node:assert/strict";
import {
  classifyRevisionBlastRadius,requiresDownstreamReplay,classifyRepresentationChange,
  validateSensitivityPair,aggregateSensitivity,validateModuleFamilyStratification,
  validateNoArbitraryRobustnessThreshold
} from "./pattern_dl111_112_revision_sensitivity_oracle_v0_1.mjs";

let p=0;const t=(n,f)=>{f();p++;console.log("PASS",n);};
const h="a".repeat(64),h2="b".repeat(64);

t("D11101 R1 membership revision changes window identity",()=>assert.equal(classifyRevisionBlastRadius({receiptFamily:"R1",membershipOrSecurityIdentityChanged:true}).status,"WINDOW_IDENTITY_CHANGED"));
t("D11102 R2 price correction hits price consumers",()=>assert.equal(classifyRevisionBlastRadius({receiptFamily:"R2",priceFieldsChanged:true}).status,"RAW_PRICE_HISTORY_CHANGED"));
t("D11103 R2 volume-only correction is not D01 price revision",()=>assert.equal(classifyRevisionBlastRadius({receiptFamily:"R2",volumeOnlyChanged:true}).status,"NON_D01_FIELD_CHANGED"));
t("D11104 R3 session correction changes window identity",()=>assert.equal(classifyRevisionBlastRadius({receiptFamily:"R3",sessionEligibilityChanged:true}).status,"WINDOW_IDENTITY_CHANGED"));
t("D11105 R4 continuity revision propagates to continuity consumers",()=>assert.equal(classifyRevisionBlastRadius({receiptFamily:"R4",continuityTransformChanged:true}).status,"CONTINUITY_HISTORY_CHANGED"));
t("D11106 R4 confidence-only upgrade does not force geometry rewrite",()=>assert.equal(classifyRevisionBlastRadius({receiptFamily:"R4",validationConfidenceOnly:true}).status,"VALIDATION_CONFIDENCE_ONLY"));
t("D11107 R5 legal reference primarily impacts D01-09",()=>{const x=classifyRevisionBlastRadius({receiptFamily:"R5",referenceOrLimitChanged:true});assert.equal(x.status,"LEGAL_REFERENCE_CONTEXT_CHANGED");assert.equal(x.affectedModules[0],"D01-09");});
t("D11108 R6 matching revision remains context-dependent",()=>assert.equal(classifyRevisionBlastRadius({receiptFamily:"R6",matchingContextChanged:true}).status,"MATCHING_CONTEXT_CHANGED"));
t("D11109 sourceHistoryHash change requires replay",()=>assert.equal(requiresDownstreamReplay({sourceHistoryHashChanged:true}).status,"DOWNSTREAM_REPLAY_REQUIRED"));
t("D11110 no identity commitment change needs no replay",()=>assert.equal(requiresDownstreamReplay({expectedSessionHashChanged:false,sourceHistoryHashChanged:false,continuityTransformHashChanged:false}).status,"NO_DOWNSTREAM_REPLAY_REQUIRED"));

const base={opportunityId:"O1",moduleId:"D01-07",predictorDate:"2021-06-15",experimentFamilyId:"E1",exactSessionHash:h,episodeId:"EP1",firstObservableAt:"t1",confirmedAt:"t2",featureState:"STRUCTURE_EMITTED",canonicalR7PayloadHash:h,outcomeFieldsPresent:false};
t("D11201 unchanged replay classified unchanged",()=>assert.equal(classifyRepresentationChange(base,{...base}).status,"UNCHANGED_REPRESENTATION"));
t("D11202 payload-only drift is value-only change",()=>assert.equal(classifyRepresentationChange(base,{...base,canonicalR7PayloadHash:h2}).status,"VALUE_ONLY_CHANGE_SAME_STATE"));
t("D11203 episode drift classified separately",()=>assert.equal(classifyRepresentationChange(base,{...base,episodeId:"EP2"}).status,"EPISODE_IDENTITY_CHANGE"));
t("D11204 clock drift classified separately",()=>assert.equal(classifyRepresentationChange(base,{...base,confirmedAt:"t3"}).status,"CLOCK_CHANGE"));
t("D11205 session-set drift dominates",()=>assert.equal(classifyRepresentationChange(base,{...base,exactSessionHash:h2}).status,"WINDOW_IDENTITY_CHANGE"));
t("D11206 blocked to emitted is newly evaluable",()=>assert.equal(classifyRepresentationChange({...base,featureState:"DATA_BLOCKED"},{...base,featureState:"STRUCTURE_EMITTED"}).status,"NEWLY_EVALUABLE"));
t("D11207 emitted to blocked is no longer evaluable",()=>assert.equal(classifyRepresentationChange(base,{...base,featureState:"DATA_BLOCKED"}).status,"NO_LONGER_EVALUABLE"));

t("D11208 same opportunity pair valid",()=>assert.equal(validateSensitivityPair(base,{...base}).status,"SENSITIVITY_PAIR_VALID"));
t("D11209 different predictor date blocks pair",()=>assert.equal(validateSensitivityPair(base,{...base,predictorDate:"2021-06-16"}).status,"PAIR_IDENTITY_MISMATCH"));
t("D11210 outcomes cannot enter sensitivity audit",()=>assert.equal(validateSensitivityPair(base,{...base,outcomeFieldsPresent:true}).status,"OUTCOME_CONTAMINATION"));

t("D11211 sensitivity aggregation retains all classes",()=>{const x=aggregateSensitivity([{changeClass:"UNCHANGED_REPRESENTATION"},{changeClass:"VALUE_ONLY_CHANGE_SAME_STATE"},{changeClass:"NEWLY_EVALUABLE"}]);assert.equal(x.affectedOpportunityCount,3);assert.equal(x.counts.NEWLY_EVALUABLE,1);});
t("D11212 module and receipt stratification valid",()=>assert.equal(validateModuleFamilyStratification([{moduleId:"D01-02",receiptFamily:"R2"},{moduleId:"D01-09",receiptFamily:"R5"}]).status,"STRATIFICATION_VALID"));
t("D11213 unknown family rejected",()=>assert.equal(validateModuleFamilyStratification([{moduleId:"D01-02",receiptFamily:"R9"}]).status,"STRATIFICATION_INVALID"));
t("D11214 post-hoc robustness threshold prohibited",()=>assert.equal(validateNoArbitraryRobustnessThreshold({thresholdPreregisteredBeforeCounts:false,thresholdUsedToDeclareRobustness:true}).status,"POST_HOC_ROBUSTNESS_THRESHOLD_PROHIBITED"));
t("D11215 preregistered threshold policy allowed",()=>assert.equal(validateNoArbitraryRobustnessThreshold({thresholdPreregisteredBeforeCounts:true,thresholdUsedToDeclareRobustness:true}).status,"ROBUSTNESS_THRESHOLD_POLICY_VALID"));

console.log(`SUMMARY ${p}/25 PASS`);
