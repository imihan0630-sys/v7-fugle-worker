import assert from "node:assert/strict";
import {
  classifySecurityClassRelation,validateD01FirstWaveAdmission,classifyClassTransition,
  validateCrossClassHistoryStitch,classifyIssuerEventDependency,validateIssuerEventVote,
  validateCrossSecurityParent,validateExistingTargetConversion,validateNewTargetConversion,
  validateMixedConsideration
} from "./pattern_dl135_137_security_class_oracle_v0_1.mjs";

let p=0;const t=(n,f)=>{f();p++;console.log("PASS",n);};

const common={securityIdentity:"SEC-C",issuerIdentity:"ISS1",securityClass:"ORDINARY_COMMON_EQUITY"};
const pref={securityIdentity:"SEC-P",issuerIdentity:"ISS1",securityClass:"PREFERRED_EQUITY"};

t("D13501 same security same class recognized",()=>assert.equal(classifySecurityClassRelation(common,{...common}).status,"SAME_SECURITY_SAME_CLASS"));
t("D13502 same issuer common vs preferred remain different classes",()=>assert.equal(classifySecurityClassRelation(common,pref).status,"SAME_ISSUER_DIFFERENT_SECURITY_CLASS"));
t("D13503 different security identities remain different",()=>assert.equal(classifySecurityClassRelation(common,{securityIdentity:"SEC2",issuerIdentity:"ISS2",securityClass:"ORDINARY_COMMON_EQUITY"}).status,"DIFFERENT_SECURITY"));
t("D13504 domestic ordinary common admitted first wave",()=>assert.equal(validateD01FirstWaveAdmission({securityClass:"ORDINARY_COMMON_EQUITY",domesticEquity:true}).status,"D01_FIRST_WAVE_SECURITY_CLASS_ELIGIBLE"));
t("D13505 warrant blocked from first wave",()=>assert.equal(validateD01FirstWaveAdmission({securityClass:"WARRANT",domesticEquity:false}).status,"NON_ORDINARY_SECURITY_CLASS_BLOCKED"));
t("D13506 explicit future nonordinary module stays separate",()=>assert.equal(validateD01FirstWaveAdmission({securityClass:"PREFERRED_EQUITY",explicitLaterModulePreregistered:true}).status,"OUTSIDE_FIRST_WAVE_SEPARATE_MODULE_REQUIRED"));

t("D13701 same-class admin change can preserve continuity with proof",()=>assert.equal(classifyClassTransition({transitionClass:"SAME_SECURITY_CLASS_ADMINISTRATIVE_CHANGE",identityProvenSame:true,priceSpaceComparable:true}).status,"CLASS_TRANSITION_CONTINUITY_ELIGIBLE"));
t("D13702 same-class admin change without identity proof blocks",()=>assert.equal(classifyClassTransition({transitionClass:"SAME_SECURITY_CLASS_ADMINISTRATIVE_CHANGE",identityProvenSame:false,priceSpaceComparable:true}).status,"CLASS_TRANSITION_IDENTITY_UNKNOWN"));
t("D13703 class successor breaks continuity",()=>assert.equal(classifyClassTransition({transitionClass:"DIFFERENT_CLASS_SUCCESSOR_SECURITY"}).status,"CLASS_TRANSITION_BREAK"));
t("D13704 CB into existing common breaks source-instrument continuity",()=>assert.equal(classifyClassTransition({transitionClass:"CONVERSION_INTO_EXISTING_COMMON_SHARE"}).status,"CLASS_TRANSITION_BREAK"));
t("D13705 new common after conversion breaks source-instrument continuity",()=>assert.equal(classifyClassTransition({transitionClass:"CONVERSION_INTO_NEW_COMMON_SHARE"}).status,"CLASS_TRANSITION_BREAK"));

t("D13507 cross-class stitched history prohibited",()=>assert.equal(validateCrossClassHistoryStitch({sourceSecurityClass:"CB",targetSecurityClass:"ORDINARY_COMMON_EQUITY",sourceSecurityIdentity:"CB1",targetSecurityIdentity:"SEC1",historyStitched:true}).status,"CROSS_CLASS_HISTORY_STITCH_PROHIBITED"));
t("D13508 same-class same-security normal history stitch policy valid",()=>assert.equal(validateCrossClassHistoryStitch({sourceSecurityClass:"ORDINARY_COMMON_EQUITY",targetSecurityClass:"ORDINARY_COMMON_EQUITY",sourceSecurityIdentity:"SEC1",targetSecurityIdentity:"SEC1",historyStitched:true}).status,"HISTORY_STITCH_POLICY_VALID"));

const e1={issuerEventContextId:"EV1",securityIdentity:"SEC-C"};
const e2={issuerEventContextId:"EV1",securityIdentity:"SEC-P"};
t("D13601 one issuer event across two securities creates dependency",()=>assert.equal(classifyIssuerEventDependency(e1,e2).status,"SAME_ISSUER_EVENT_CROSS_SECURITY_DEPENDENCY"));
t("D13602 same event same security dependency retained",()=>assert.equal(classifyIssuerEventDependency(e1,{...e1}).status,"SAME_EVENT_SAME_SECURITY_DEPENDENCY"));
t("D13603 different event contexts remain distinct",()=>assert.equal(classifyIssuerEventDependency(e1,{issuerEventContextId:"EV2",securityIdentity:"SEC-P"}).status,"DISTINCT_ISSUER_EVENT_CONTEXT"));
t("D13604 one event cannot become one vote per affected security",()=>assert.equal(validateIssuerEventVote({securityObservationCount:3,independentVoteCount:3,sharedIssuerEvent:true}).status,"ISSUER_EVENT_VOTE_MULTIPLICATION_PROHIBITED"));
t("D13605 dependence can remain unquantified for D16",()=>assert.equal(validateIssuerEventVote({securityObservationCount:3,independentVoteCount:null,sharedIssuerEvent:true}).status,"DEPENDENCY_PRESERVED_NO_INDEPENDENCE_ASSUMPTION"));

t("D13606 common-share child cannot use warrant parent",()=>assert.equal(validateCrossSecurityParent({childSecurityIdentity:"SEC-C",parentSecurityIdentity:"WAR1",childSecurityClass:"ORDINARY_COMMON_EQUITY",parentSecurityClass:"WARRANT"}).status,"CROSS_SECURITY_COMMON_PARENT_PROHIBITED"));
t("D13607 same security local parent valid",()=>assert.equal(validateCrossSecurityParent({childSecurityIdentity:"SEC-C",parentSecurityIdentity:"SEC-C",childSecurityClass:"ORDINARY_COMMON_EQUITY",parentSecurityClass:"ORDINARY_COMMON_EQUITY"}).status,"SECURITY_LOCAL_COMMON_PARENT_VALID"));

t("D13706 CB bars cannot be inserted into existing common history",()=>assert.equal(validateExistingTargetConversion({transitionClass:"CONVERSION_INTO_EXISTING_COMMON_SHARE",sourceBarsInsertedIntoTargetHistory:true,targetExistingHistoryPreserved:true}).status,"SOURCE_INSTRUMENT_BARS_IN_TARGET_HISTORY_PROHIBITED"));
t("D13707 existing common history preserved separately",()=>assert.equal(validateExistingTargetConversion({transitionClass:"CONVERSION_INTO_EXISTING_COMMON_SHARE",sourceBarsInsertedIntoTargetHistory:false,targetExistingHistoryPreserved:true}).status,"EXISTING_TARGET_CONVERSION_VALID"));
t("D13708 new target cannot borrow predecessor non-equity bars",()=>assert.equal(validateNewTargetConversion({transitionClass:"CONVERSION_INTO_NEW_COMMON_SHARE",predecessorBarsBorrowed:true,listingWarmupApplied:true}).status,"PREDECESSOR_NON_EQUITY_BARS_BORROW_PROHIBITED"));
t("D13709 new target requires listing warmup",()=>assert.equal(validateNewTargetConversion({transitionClass:"CONVERSION_INTO_NEW_COMMON_SHARE",predecessorBarsBorrowed:false,listingWarmupApplied:false}).status,"NEW_TARGET_LISTING_WARMUP_REQUIRED"));
t("D13710 mixed consideration payoff transform stays outside D01",()=>assert.equal(validateMixedConsideration({transitionClass:"MULTI_CONSIDERATION_TRANSITION",d01EconomicPayoffTransformBuilt:false}).status,"MIXED_CONSIDERATION_OUTSIDE_D01_PAYOFF_SCOPE"));

console.log(`SUMMARY ${p}/25 PASS`);
