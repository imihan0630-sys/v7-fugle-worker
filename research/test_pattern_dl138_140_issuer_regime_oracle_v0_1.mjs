import assert from "node:assert/strict";
import {
  validateRegimeBoundaryReceipt,classifyBoundaryPIT,applyStructuralMemoryDisposition,
  classifyD0109BoundaryGap,validateReconfirmation,classifyReconfirmationLifecycle,
  validateEpisodeContinuationId,validateRegimeDenominatorRow,
  validateRegimeParentChildSupport,validateRegimePlacebo,validateNoExtraVote
} from "./pattern_dl138_140_issuer_regime_oracle_v0_1.mjs";

let p=0;const t=(n,f)=>{f();p++;console.log("PASS",n);};
const h="a".repeat(64);

const receipt={regimeBoundaryReceiptId:"RB1",regimeBoundaryVersion:"v1",securityIdentity:"SEC1",boundaryId:"B1",normalizedBoundaryClass:"MAJOR_BUSINESS_REORGANIZATION",structuralMemoryDisposition:"STALE_RECONFIRM_REQUIRED",eventEffectiveAt:"2021-05-01T00:00:00+08:00",firstObservableAt:"2021-04-20T10:00:00+08:00",ownerDomain:"D08",sourceHash:h,replaySafe:true};
t("D13801 complete owner-certified regime receipt passes",()=>assert.equal(validateRegimeBoundaryReceipt(receipt).status,"REGIME_RECEIPT_VALID"));
t("D13802 invalid memory disposition fails",()=>assert.equal(validateRegimeBoundaryReceipt({...receipt,structuralMemoryDisposition:"BULLISH_RESET"}).status,"REGIME_MEMORY_DISPOSITION_INVALID"));
t("D13803 late-known regime class cannot be backdated",()=>assert.equal(classifyBoundaryPIT({firstObservableAt:"2021-05-02",predictorFreezeAt:"2021-05-01",currentTruthClass:"MAJOR_BUSINESS_REORGANIZATION",historicalPITClass:"UNKNOWN_AT_CUTOFF"}).status,"REGIME_CLASS_NOT_PIT_AVAILABLE"));
t("D13804 known regime class is PIT available",()=>assert.equal(classifyBoundaryPIT({firstObservableAt:"2021-04-20",predictorFreezeAt:"2021-05-01",currentTruthClass:"MAJOR_BUSINESS_REORGANIZATION",historicalPITClass:"MAJOR_BUSINESS_REORGANIZATION"}).status,"REGIME_CLASS_PIT_AVAILABLE"));

t("D13805 preserve disposition keeps continuity",()=>assert.equal(applyStructuralMemoryDisposition({moduleId:"D01-07",disposition:"PRESERVE_STRUCTURAL_MEMORY",priorEpisodeId:"E1"}).status,"EPISODE_CONTINUITY_PRESERVED"));
t("D13806 stale disposition blocks ordinary continuity",()=>assert.equal(applyStructuralMemoryDisposition({moduleId:"D01-07",disposition:"STALE_RECONFIRM_REQUIRED",priorEpisodeId:"E1"}).status,"EPISODE_CONTEXT_STALE"));
t("D13807 break disposition terminates structural memory",()=>assert.equal(applyStructuralMemoryDisposition({moduleId:"D01-07",disposition:"BREAK_STRUCTURAL_MEMORY",priorEpisodeId:"E1"}).status,"EPISODE_TERMINATED_REGIME_BREAK"));

t("D13808 D01-09 known regime boundary gap is not ordinary gap",()=>assert.equal(classifyD0109BoundaryGap({sameSecurity:true,regimeBoundaryKnown:true,rawGapFinite:true,ordinaryGapOverride:false}).status,"ISSUER_REGIME_EVENT_GAP"));
t("D13809 identity transition still dominates gap semantics",()=>assert.equal(classifyD0109BoundaryGap({sameSecurity:false,regimeBoundaryKnown:true,rawGapFinite:true}).status,"IDENTITY_TRANSITION_NOT_ORDINARY_GAP"));

const recon={structuralMemoryDisposition:"STALE_RECONFIRM_REQUIRED",reconfirmationMode:"POST_BOUNDARY_RETEST_OF_SURVIVING_ZONE",modePreregistered:true,requiredPostBoundarySourceBarIds:["b1","b2"],reconfirmedAt:"2021-05-10T14:30:00+08:00",predictorFreezeAt:"2021-05-10T14:30:00+08:00",usedPreBoundaryEvidenceAlone:false};
t("D13901 preregistered post-boundary reconfirmation passes",()=>assert.equal(validateReconfirmation(recon).status,"RECONFIRMATION_VALID"));
t("D13902 post-outcome invented mode is rejected",()=>assert.equal(validateReconfirmation({...recon,modePreregistered:false}).status,"RECONFIRMATION_MODE_NOT_PREREGISTERED"));
t("D13903 pre-boundary evidence alone cannot reconfirm",()=>assert.equal(validateReconfirmation({...recon,usedPreBoundaryEvidenceAlone:true}).status,"RECONFIRMATION_PREBOUNDARY_ONLY_PROHIBITED"));
t("D13904 reconfirmation after predictor freeze is lookahead",()=>assert.equal(validateReconfirmation({...recon,reconfirmedAt:"2021-05-11T00:00:00+08:00"}).status,"RECONFIRMATION_LOOKAHEAD"));

t("D13905 failed reconfirmation remains explicit",()=>assert.equal(classifyReconfirmationLifecycle({attempted:true,passed:false,expired:false,dataBlocked:false}).status,"RECONFIRMATION_FAILED"));
t("D13906 expired reconfirmation remains explicit",()=>assert.equal(classifyReconfirmationLifecycle({attempted:false,passed:false,expired:true,dataBlocked:false}).status,"RECONFIRMATION_EXPIRED"));

t("D13907 stale episode cannot continue before reconfirmation",()=>assert.equal(validateEpisodeContinuationId({priorEpisodeId:"E1",continuationEpisodeId:"E2",disposition:"STALE_RECONFIRM_REQUIRED",reconfirmed:false}).status,"CONTINUATION_BLOCKED_PENDING_RECONFIRMATION"));
t("D13908 reconfirmed continuation needs a derived new id",()=>assert.equal(validateEpisodeContinuationId({priorEpisodeId:"E1",continuationEpisodeId:"E1",disposition:"STALE_RECONFIRM_REQUIRED",reconfirmed:true}).status,"DERIVED_CONTINUATION_EPISODE_ID_REQUIRED"));
t("D13909 regime break requires new episode id",()=>assert.equal(validateEpisodeContinuationId({priorEpisodeId:"E1",continuationEpisodeId:"E1",disposition:"BREAK_STRUCTURAL_MEMORY",reconfirmed:false}).status,"NEW_EPISODE_ID_REQUIRED_AFTER_BREAK"));

t("D14001 stale pending row stays denominator-accounted",()=>assert.equal(validateRegimeDenominatorRow({securityIdentity:"SEC1",denominatorState:"REGIME_BOUNDARY_STALE_PENDING_RECONFIRMATION"}).status,"REGIME_DENOMINATOR_ROW_VALID"));
t("D14002 failed reconfirmation stays denominator-accounted",()=>assert.equal(validateRegimeDenominatorRow({securityIdentity:"SEC1",denominatorState:"REGIME_RECONFIRMATION_FAILED"}).status,"REGIME_DENOMINATOR_ROW_VALID"));

const pair={securityIdentity:"SEC1",regimeBoundaryReceiptId:"RB1",normalizedBoundaryClass:"MAJOR_BUSINESS_REORGANIZATION",structuralMemoryDisposition:"STALE_RECONFIRM_REQUIRED",boundaryKnowledgeState:"PIT_KNOWN",exactSessionHash:h,sourceHistoryHash:h,predictorFreezeAt:"t",blockedRowPolicyId:"B1",censoringPolicyId:"C1",horizon:5,costTreatmentId:"COST1"};
t("D14003 parent child matching regime support passes",()=>assert.equal(validateRegimeParentChildSupport(pair,{...pair}).status,"PARENT_CHILD_REGIME_SUPPORT_VALID"));
t("D14004 child cannot silently drop regime boundary",()=>assert.equal(validateRegimeParentChildSupport(pair,{...pair,regimeBoundaryReceiptId:null,normalizedBoundaryClass:"NO_MATERIAL_ISSUER_REGIME_BOUNDARY"}).status,"PARENT_CHILD_REGIME_SUPPORT_MISMATCH"));

t("D14005 administrative rename is a valid placebo family",()=>assert.equal(validateRegimePlacebo({placeboFamily:"SAME_SECURITY_ADMINISTRATIVE_RENAME",selectedAfterOutcome:false}).status,"REGIME_PLACEBO_VALID"));
t("D14006 outcome-selected placebo is prohibited",()=>assert.equal(validateRegimePlacebo({placeboFamily:"NO_REGIME_BOUNDARY_SAME_GEOMETRY",selectedAfterOutcome:true}).status,"OUTCOME_SELECTED_PLACEBO_PROHIBITED"));

t("D14007 event context plus pattern is not two votes",()=>assert.equal(validateNoExtraVote({boundaryContextPresent:true,patternRepresentationPresent:true,effectiveIndependentEvidenceCount:2}).status,"REGIME_CONTEXT_DOUBLE_VOTE_PROHIBITED"));
t("D14008 single effective evidence root passes",()=>assert.equal(validateNoExtraVote({boundaryContextPresent:true,patternRepresentationPresent:true,effectiveIndependentEvidenceCount:1}).status,"REGIME_CONTEXT_NO_EXTRA_VOTE"));

console.log(`SUMMARY ${p}/28 PASS`);
