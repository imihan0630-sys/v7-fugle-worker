import assert from "node:assert/strict";
import {
  classifySecurityClassEligibility,validateNoCurrentClassBackfill,classifyClassTransition,
  validateEligibleHistoryWindow,classifyReentry,validateD0109GapAcrossClassBoundary,
  validateEligibilityMask,validateClassDenominatorRow,validateClassParentChildSupport,
  validateClassRevisionReplay
} from "./pattern_dl135_137_security_class_oracle_v0_1.mjs";

let p=0;const t=(n,f)=>{f();p++;console.log("PASS",n);};
const h="a".repeat(64);

t("D13501 ordinary common class passes",()=>assert.equal(classifySecurityClassEligibility({normalizedSecurityClass:"ORDINARY_COMMON_EQUITY",coverageCompleteForDate:true,firstObservableAt:"2021-01-01",predictorFreezeAt:"2021-01-02"}).status,"CLASS_ELIGIBLE_ORDINARY_COMMON"));
t("D13502 preferred class is ineligible by design",()=>assert.equal(classifySecurityClassEligibility({normalizedSecurityClass:"PREFERRED_EQUITY",coverageCompleteForDate:true,firstObservableAt:"2021-01-01",predictorFreezeAt:"2021-01-02"}).status,"CLASS_INELIGIBLE_BY_DESIGN"));
t("D13503 unknown class does not default common",()=>assert.equal(classifySecurityClassEligibility({normalizedSecurityClass:"SECURITY_CLASS_UNKNOWN",coverageCompleteForDate:true,firstObservableAt:"2021-01-01",predictorFreezeAt:"2021-01-02"}).status,"SECURITY_CLASS_UNKNOWN"));
t("D13504 incomplete class coverage remains unknown",()=>assert.equal(classifySecurityClassEligibility({normalizedSecurityClass:"ORDINARY_COMMON_EQUITY",coverageCompleteForDate:false,firstObservableAt:"2021-01-01",predictorFreezeAt:"2021-01-02"}).status,"SECURITY_CLASS_UNKNOWN"));
t("D13505 current class backfill prohibited",()=>assert.equal(validateNoCurrentClassBackfill({historicalClassKnown:false,currentClass:"ORDINARY_COMMON_EQUITY",historicalClass:null,inferredFromCurrent:true}).status,"CURRENT_CLASS_BACKFILL_PROHIBITED"));

t("D13601 same security class exit creates eligibility boundary",()=>assert.equal(classifyClassTransition({securityIdentityBefore:"S1",securityIdentityAfter:"S1",classBefore:"ORDINARY_COMMON_EQUITY",classAfter:"PREFERRED_EQUITY",boundaryKnown:true}).status,"EXIT_FROM_ORDINARY_COMMON"));
t("D13602 same security reentry creates new eligible interval",()=>assert.equal(classifyClassTransition({securityIdentityBefore:"S1",securityIdentityAfter:"S1",classBefore:"PREFERRED_EQUITY",classAfter:"ORDINARY_COMMON_EQUITY",boundaryKnown:true}).status,"ENTRY_INTO_ORDINARY_COMMON"));
t("D13603 unknown class boundary blocks",()=>assert.equal(classifyClassTransition({securityIdentityBefore:"S1",securityIdentityAfter:"S1",classBefore:"PREFERRED_EQUITY",classAfter:"ORDINARY_COMMON_EQUITY",boundaryKnown:false}).status,"CLASS_BOUNDARY_AMBIGUOUS_BLOCKED"));
t("D13604 security replacement uses identity rules",()=>assert.equal(classifyClassTransition({securityIdentityBefore:"S1",securityIdentityAfter:"S2",classBefore:"ORDINARY_COMMON_EQUITY",classAfter:"ORDINARY_COMMON_EQUITY",boundaryKnown:true}).status,"SECURITY_IDENTITY_TRANSITION"));

t("D13605 eligible sequence cannot cross ineligible class interval",()=>assert.equal(validateEligibleHistoryWindow({securityIdentityStable:true,classStates:["ORDINARY_COMMON_EQUITY","PREFERRED_EQUITY","ORDINARY_COMMON_EQUITY"],moduleId:"D01-03"}).status,"ELIGIBILITY_INTERVAL_CROSSED"));
t("D13606 all eligible history passes",()=>assert.equal(validateEligibleHistoryWindow({securityIdentityStable:true,classStates:["ORDINARY_COMMON_EQUITY","ORDINARY_COMMON_EQUITY"],moduleId:"D01-03"}).status,"ELIGIBLE_HISTORY_WINDOW_VALID"));
t("D13607 unknown class in history blocks",()=>assert.equal(validateEligibleHistoryWindow({securityIdentityStable:true,classStates:["ORDINARY_COMMON_EQUITY","SECURITY_CLASS_UNKNOWN"],moduleId:"D01-07"}).status,"CLASS_UNKNOWN_BLOCKED"));

t("D13608 reentry history can be too short by design",()=>assert.equal(classifyReentry({sameSecurity:true,priorEligibleIntervalEnded:true,currentClass:"ORDINARY_COMMON_EQUITY",currentEligibleHistoryCount:5,moduleMinimumHistory:20}).status,"REENTRY_HISTORY_TOO_SHORT_BY_DESIGN"));
t("D13609 reentry becomes ready only after fresh eligible history",()=>assert.equal(classifyReentry({sameSecurity:true,priorEligibleIntervalEnded:true,currentClass:"ORDINARY_COMMON_EQUITY",currentEligibleHistoryCount:20,moduleMinimumHistory:20}).status,"REENTRY_MODULE_HISTORY_READY"));

t("D13610 D01-09 cannot call cross-class boundary ordinary gap",()=>assert.equal(validateD0109GapAcrossClassBoundary({sameSecurity:true,sameEligibilityInterval:false,priorEligibleClose:10,currentOpen:11}).status,"CLASS_TRANSITION_REFERENCE_DISTANCE"));
t("D13611 ordinary gap requires same eligible interval",()=>assert.equal(validateD0109GapAcrossClassBoundary({sameSecurity:true,sameEligibilityInterval:true,priorEligibleClose:10,currentOpen:11}).status,"ORDINARY_GAP_GEOMETRY_ELIGIBLE"));

t("D13612 eligibility mask must be subset of raw history",()=>assert.equal(validateEligibilityMask({rawDates:["d1","d2"],eligibleDates:["d2","d3"],eligibilityMaskHash:h}).status,"ELIGIBILITY_MASK_REFERENCES_NONRAW_DATE"));
t("D13613 valid eligibility mask preserves raw/eligible counts",()=>{const x=validateEligibilityMask({rawDates:["d1","d2","d3"],eligibleDates:["d1","d3"],eligibilityMaskHash:h});assert.equal(x.status,"ELIGIBILITY_MASK_VALID");assert.equal(x.rawCount,3);assert.equal(x.eligibleCount,2);});

t("D13701 ineligible-by-design stays denominator-accounted",()=>assert.equal(validateClassDenominatorRow({securityIdentity:"S1",denominatorState:"CLASS_INELIGIBLE_BY_DESIGN"}).status,"CLASS_DENOMINATOR_ROW_VALID"));
t("D13702 class unknown stays denominator-accounted",()=>assert.equal(validateClassDenominatorRow({securityIdentity:"S1",denominatorState:"CLASS_UNKNOWN_BLOCKED"}).status,"CLASS_DENOMINATOR_ROW_VALID"));

const pair={securityIdentity:"S1",membershipIntervalId:"M1",classReceiptId:"C1",classReceiptVersion:"v1",classEligibilityIntervalId:"CE1",eligibilityMaskHash:h,listingAgeEligibleSessions:100,warmupState:"MODULE_MINIMUM_HISTORY_READY",exactSessionHash:h,sourceHistoryHash:h,predictorFreezeAt:"t",blockedRowPolicyId:"B1"};
t("D13703 parent child matching class support passes",()=>assert.equal(validateClassParentChildSupport(pair,{...pair}).status,"PARENT_CHILD_CLASS_SUPPORT_VALID"));
t("D13704 child cannot use different eligibility mask",()=>assert.equal(validateClassParentChildSupport(pair,{...pair,eligibilityMaskHash:"b".repeat(64)}).status,"PARENT_CHILD_CLASS_SUPPORT_MISMATCH"));

t("D13705 class mask change requires both parent and child replay",()=>assert.equal(validateClassRevisionReplay({oldEligibilityMaskHash:h,newEligibilityMaskHash:"b".repeat(64),parentReplayed:true,childReplayed:false,finalHoldoutBefore:"UNTOUCHED",finalHoldoutAfter:"UNTOUCHED"}).status,"CLASS_REVISION_REPLAY_INCOMPLETE"));
t("D13706 class metadata correction cannot reset consumed holdout",()=>assert.equal(validateClassRevisionReplay({oldEligibilityMaskHash:h,newEligibilityMaskHash:"b".repeat(64),parentReplayed:true,childReplayed:true,finalHoldoutBefore:"CONSUMED",finalHoldoutAfter:"UNTOUCHED"}).status,"FINAL_HOLDOUT_RESET_PROHIBITED"));
t("D13707 fully replayed class revision passes",()=>assert.equal(validateClassRevisionReplay({oldEligibilityMaskHash:h,newEligibilityMaskHash:"b".repeat(64),parentReplayed:true,childReplayed:true,finalHoldoutBefore:"CONSUMED",finalHoldoutAfter:"CONSUMED"}).status,"CLASS_REVISION_REPLAY_VALID"));

console.log(`SUMMARY ${p}/25 PASS`);
