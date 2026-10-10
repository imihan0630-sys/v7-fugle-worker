import assert from "node:assert/strict";
import {
  validateRelatedIssuerReceipt,classifyRelationPIT,validateSecuritySeparation,
  buildCrossSecurityDependencyEdge,validateCrossSecurityVote,validateLeadLagExperiment,
  validateRelationDenominatorRow,validateRelationParentChildSupport,
  validateRelatedIssuerPlacebo,validateUnknownRelationIndependence
} from "./pattern_dl141_143_related_issuer_oracle_v0_1.mjs";

let p=0;const t=(n,f)=>{f();p++;console.log("PASS",n);};
const h="a".repeat(64);

const receipt={relationReceiptId:"RR1",relationReceiptVersion:"v1",securityIdentityA:"S1",securityIdentityB:"S2",normalizedRelationClass:"PARENT_SUBSIDIARY",relationEffectiveFrom:"2021-01-01",firstObservableAt:"2021-01-01",ownerDomain:"D14",sourceHash:h,replaySafe:true};
t("D14101 owner-certified related issuer receipt passes",()=>assert.equal(validateRelatedIssuerReceipt(receipt).status,"RELATED_ISSUER_RECEIPT_VALID"));
t("D14102 invalid relation class fails",()=>assert.equal(validateRelatedIssuerReceipt({...receipt,normalizedRelationClass:"SAME_PATTERN_GROUP"}).status,"RELATED_ISSUER_CLASS_INVALID"));
t("D14103 future relation cannot be backdated",()=>assert.equal(classifyRelationPIT({firstObservableAt:"2021-06-02",predictorFreezeAt:"2021-06-01",relationClassAtCutoff:"UNKNOWN_AT_CUTOFF",currentRelationClass:"PARENT_SUBSIDIARY"}).status,"RELATION_NOT_PIT_AVAILABLE"));
t("D14104 known historical relation is PIT available",()=>assert.equal(classifyRelationPIT({firstObservableAt:"2021-05-01",predictorFreezeAt:"2021-06-01",relationClassAtCutoff:"PARENT_SUBSIDIARY",currentRelationClass:"PARENT_SUBSIDIARY"}).status,"RELATION_PIT_AVAILABLE"));

t("D14105 same issuer different security does not stitch",()=>assert.equal(validateSecuritySeparation({securityIdentityA:"S1",securityIdentityB:"S2",sameIssuer:true,sameGroup:true}).status,"SAME_ISSUER_DIFFERENT_SECURITY_NO_STITCH"));
t("D14106 same group different security does not stitch",()=>assert.equal(validateSecuritySeparation({securityIdentityA:"S1",securityIdentityB:"S2",sameIssuer:false,sameGroup:true}).status,"SAME_GROUP_DIFFERENT_SECURITY_NO_STITCH"));

t("D14201 shared event creates dependency edge",()=>assert.equal(buildCrossSecurityDependencyEdge({securityIdentity:"S1",sharedEventContextId:"EV1",relationClass:"PARENT_SUBSIDIARY"},{securityIdentity:"S2",sharedEventContextId:"EV1",relationClass:"PARENT_SUBSIDIARY"}).status,"SHARED_GROUP_EVENT"));
t("D14202 parent subsidiary relation links nodes",()=>assert.equal(buildCrossSecurityDependencyEdge({securityIdentity:"S1",relationClass:"PARENT_SUBSIDIARY"},{securityIdentity:"S2",relationClass:"NO_KNOWN_RELATED_ISSUER_RELATION"}).status,"PARENT_SUBSIDIARY_DEPENDENCY"));
t("D14203 common controller relation links nodes",()=>assert.equal(buildCrossSecurityDependencyEdge({securityIdentity:"S1",relationClass:"COMMON_CONTROL_RELATION"},{securityIdentity:"S2",relationClass:"NO_KNOWN_RELATED_ISSUER_RELATION"}).status,"COMMON_CONTROLLER_DEPENDENCY"));
t("D14204 unknown relation stays unknown",()=>assert.equal(buildCrossSecurityDependencyEdge({securityIdentity:"S1",relationClass:"RELATED_ISSUER_RELATION_UNKNOWN"},{securityIdentity:"S2",relationClass:"NO_KNOWN_RELATED_ISSUER_RELATION"}).status,"RELATED_ISSUER_RELATION_UNKNOWN"));

t("D14205 three related nodes cannot default to three independent votes",()=>assert.equal(validateCrossSecurityVote({nodeCount:3,effectiveIndependentEvidenceCount:3,dependencyEdgePresent:true}).status,"DEPENDENCY_LINKED_NODE_COUNT_NOT_INDEPENDENT_VOTES"));
t("D14206 dependency-aware vote policy can remain valid",()=>assert.equal(validateCrossSecurityVote({nodeCount:3,effectiveIndependentEvidenceCount:1,dependencyEdgePresent:true}).status,"CROSS_SECURITY_VOTE_POLICY_VALID"));

t("D14207 lead lag must be preregistered",()=>assert.equal(validateLeadLagExperiment({preregistered:false,predictorFreezeAt:"2021-06-01T10:00:00+08:00",leadMoveObservableAt:"2021-06-01T09:30:00+08:00",outcomeSelected:false}).status,"LEAD_LAG_NOT_PREREGISTERED"));
t("D14208 later lead move cannot confirm earlier predictor",()=>assert.equal(validateLeadLagExperiment({preregistered:true,predictorFreezeAt:"2021-06-01T10:00:00+08:00",leadMoveObservableAt:"2021-06-01T10:30:00+08:00",outcomeSelected:false}).status,"LEAD_MOVE_NOT_AVAILABLE_AT_PREDICTOR"));
t("D14209 valid preregistered PIT lead lag passes",()=>assert.equal(validateLeadLagExperiment({preregistered:true,predictorFreezeAt:"2021-06-01T10:00:00+08:00",leadMoveObservableAt:"2021-06-01T09:30:00+08:00",outcomeSelected:false}).status,"LEAD_LAG_EXPERIMENT_PIT_VALID"));

t("D14301 known dependency remains denominator-accounted",()=>assert.equal(validateRelationDenominatorRow({securityIdentity:"S1",denominatorState:"RELATION_KNOWN_DEPENDENCY"}).status,"RELATION_DENOMINATOR_ROW_VALID"));
t("D14302 unknown relation remains denominator-accounted",()=>assert.equal(validateRelationDenominatorRow({securityIdentity:"S1",denominatorState:"RELATION_UNKNOWN_BLOCKED"}).status,"RELATION_DENOMINATOR_ROW_VALID"));

const pair={securityIdentity:"S1",relationReceiptId:"RR1",normalizedRelationClass:"PARENT_SUBSIDIARY",relationKnowledgeState:"PIT_KNOWN",sharedEventContextId:"EV1",exactSessionHash:h,sourceHistoryHash:h,predictorFreezeAt:"t",blockedRowPolicyId:"B1",censoringPolicyId:"C1",horizon:5,costTreatmentId:"COST1"};
t("D14303 parent child matching relation support passes",()=>assert.equal(validateRelationParentChildSupport(pair,{...pair}).status,"PARENT_CHILD_RELATION_SUPPORT_VALID"));
t("D14304 child cannot silently remove shared event context",()=>assert.equal(validateRelationParentChildSupport(pair,{...pair,sharedEventContextId:null}).status,"PARENT_CHILD_RELATION_SUPPORT_MISMATCH"));

t("D14305 same industry non-group is valid placebo",()=>assert.equal(validateRelatedIssuerPlacebo({placeboFamily:"SAME_INDUSTRY_NON_GROUP_CONTROL",selectedAfterOutcome:false}).status,"RELATED_ISSUER_PLACEBO_VALID"));
t("D14306 outcome-selected placebo prohibited",()=>assert.equal(validateRelatedIssuerPlacebo({placeboFamily:"SAME_GROUP_NO_SHARED_EVENT",selectedAfterOutcome:true}).status,"OUTCOME_SELECTED_PLACEBO_PROHIBITED"));

t("D14307 unknown relation cannot default independent",()=>assert.equal(validateUnknownRelationIndependence({relationState:"RELATED_ISSUER_RELATION_UNKNOWN",assumedIndependent:true}).status,"UNKNOWN_RELATION_INDEPENDENCE_ASSUMPTION_PROHIBITED"));
t("D14308 known no-relation state can use normal policy",()=>assert.equal(validateUnknownRelationIndependence({relationState:"NO_KNOWN_RELATED_ISSUER_RELATION",assumedIndependent:false}).status,"RELATION_INDEPENDENCE_POLICY_VALID"));

console.log(`SUMMARY ${p}/23 PASS`);
