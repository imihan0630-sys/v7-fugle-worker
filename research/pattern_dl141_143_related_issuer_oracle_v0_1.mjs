// D01 DL-141~143 related-issuer dependency oracle v0.1

const RELATION_CLASSES=new Set([
  "PARENT_SUBSIDIARY",
  "SISTER_AFFILIATE_COMMON_CONTROLLER",
  "CROSS_HOLDING_RELATION",
  "COMMON_CONTROL_RELATION",
  "STRATEGIC_AFFILIATE",
  "SHARED_BRAND_ONLY",
  "SHARED_EVENT_EXPOSURE",
  "RELATED_ISSUER_RELATION_UNKNOWN",
  "NO_KNOWN_RELATED_ISSUER_RELATION"
]);

const DENOMINATOR_STATES=new Set([
  "RELATION_CLEAR_NO_KNOWN_DEPENDENCY",
  "RELATION_KNOWN_DEPENDENCY",
  "RELATION_SHARED_EVENT_DEPENDENCY",
  "RELATION_UNKNOWN_BLOCKED",
  "RELATION_NOT_APPLICABLE"
]);

export function validateRelatedIssuerReceipt(r={}){
  const required=[
    "relationReceiptId","relationReceiptVersion",
    "securityIdentityA","securityIdentityB",
    "normalizedRelationClass","relationEffectiveFrom",
    "firstObservableAt","ownerDomain","sourceHash"
  ];
  const missing=required.filter(k=>!r[k]);
  if(missing.length)return {status:"RELATED_ISSUER_RECEIPT_INCOMPLETE",missing};
  if(!RELATION_CLASSES.has(r.normalizedRelationClass))
    return {status:"RELATED_ISSUER_CLASS_INVALID",missing:[]};
  if(r.replaySafe!==true)return {status:"RELATED_ISSUER_RECEIPT_NOT_REPLAY_SAFE",missing:[]};
  return {status:"RELATED_ISSUER_RECEIPT_VALID",missing:[]};
}

export function classifyRelationPIT({firstObservableAt,predictorFreezeAt,relationClassAtCutoff,currentRelationClass}={}){
  if(!firstObservableAt||!predictorFreezeAt)return {status:"RELATION_CLOCK_UNKNOWN"};
  if(firstObservableAt>predictorFreezeAt)
    return {status:"RELATION_NOT_PIT_AVAILABLE",historicalRelation:relationClassAtCutoff??"UNKNOWN_AT_CUTOFF",currentRelation:currentRelationClass??null};
  return {status:"RELATION_PIT_AVAILABLE",historicalRelation:relationClassAtCutoff??currentRelationClass??null,currentRelation:currentRelationClass??null};
}

export function validateSecuritySeparation({securityIdentityA,securityIdentityB,sameIssuer,sameGroup}={}){
  if(!securityIdentityA||!securityIdentityB)return {status:"SECURITY_IDENTITY_UNKNOWN"};
  if(securityIdentityA===securityIdentityB)return {status:"SAME_SECURITY"};
  if(sameIssuer===true)return {status:"SAME_ISSUER_DIFFERENT_SECURITY_NO_STITCH"};
  if(sameGroup===true)return {status:"SAME_GROUP_DIFFERENT_SECURITY_NO_STITCH"};
  return {status:"DIFFERENT_SECURITY_NO_STITCH"};
}

export function buildCrossSecurityDependencyEdge(a={},b={}){
  if(!a.securityIdentity||!b.securityIdentity)return {status:"DEPENDENCY_INPUT_INCOMPLETE"};
  if(a.securityIdentity===b.securityIdentity)return {status:"SAME_SECURITY_NOT_CROSS_SECURITY_EDGE"};
  if(a.sharedEventContextId&&a.sharedEventContextId===b.sharedEventContextId)
    return {status:"SHARED_GROUP_EVENT"};
  if(a.relationClass==="PARENT_SUBSIDIARY"||b.relationClass==="PARENT_SUBSIDIARY")
    return {status:"PARENT_SUBSIDIARY_DEPENDENCY"};
  if(["COMMON_CONTROL_RELATION","SISTER_AFFILIATE_COMMON_CONTROLLER"].includes(a.relationClass) ||
     ["COMMON_CONTROL_RELATION","SISTER_AFFILIATE_COMMON_CONTROLLER"].includes(b.relationClass))
    return {status:"COMMON_CONTROLLER_DEPENDENCY"};
  if(a.relationClass==="CROSS_HOLDING_RELATION"||b.relationClass==="CROSS_HOLDING_RELATION")
    return {status:"CROSS_HOLDING_DEPENDENCY"};
  if(a.relationClass==="RELATED_ISSUER_RELATION_UNKNOWN"||b.relationClass==="RELATED_ISSUER_RELATION_UNKNOWN")
    return {status:"RELATED_ISSUER_RELATION_UNKNOWN"};
  return {status:"NO_KNOWN_CROSS_SECURITY_DEPENDENCY"};
}

export function validateCrossSecurityVote({nodeCount,effectiveIndependentEvidenceCount,dependencyEdgePresent}={}){
  if(!Number.isInteger(nodeCount)||nodeCount<1)return {status:"NODE_COUNT_INVALID"};
  if(dependencyEdgePresent===true && effectiveIndependentEvidenceCount===nodeCount && nodeCount>1)
    return {status:"DEPENDENCY_LINKED_NODE_COUNT_NOT_INDEPENDENT_VOTES"};
  if(!Number.isInteger(effectiveIndependentEvidenceCount)||effectiveIndependentEvidenceCount<1)
    return {status:"INDEPENDENT_EVIDENCE_COUNT_INVALID"};
  return {status:"CROSS_SECURITY_VOTE_POLICY_VALID"};
}

export function validateLeadLagExperiment({preregistered,predictorFreezeAt,leadMoveObservableAt,outcomeSelected}={}){
  if(outcomeSelected===true)return {status:"OUTCOME_SELECTED_LEAD_LAG_PROHIBITED"};
  if(preregistered!==true)return {status:"LEAD_LAG_NOT_PREREGISTERED"};
  if(!predictorFreezeAt||!leadMoveObservableAt)return {status:"LEAD_LAG_CLOCK_UNKNOWN"};
  if(leadMoveObservableAt>predictorFreezeAt)return {status:"LEAD_MOVE_NOT_AVAILABLE_AT_PREDICTOR"};
  return {status:"LEAD_LAG_EXPERIMENT_PIT_VALID"};
}

export function validateRelationDenominatorRow(r={}){
  if(!r.securityIdentity||!r.denominatorState)return {status:"RELATION_DENOMINATOR_IDENTITY_INCOMPLETE"};
  if(!DENOMINATOR_STATES.has(r.denominatorState))return {status:"RELATION_DENOMINATOR_STATE_INVALID"};
  return {status:"RELATION_DENOMINATOR_ROW_VALID"};
}

export function validateRelationParentChildSupport(parent={},child={}){
  const fields=[
    "securityIdentity","relationReceiptId","normalizedRelationClass",
    "relationKnowledgeState","sharedEventContextId",
    "exactSessionHash","sourceHistoryHash","predictorFreezeAt",
    "blockedRowPolicyId","censoringPolicyId","horizon","costTreatmentId"
  ];
  const drift=fields.filter(k=>(parent[k]??null)!==(child[k]??null));
  return {status:drift.length?"PARENT_CHILD_RELATION_SUPPORT_MISMATCH":"PARENT_CHILD_RELATION_SUPPORT_VALID",drift};
}

export function validateRelatedIssuerPlacebo(p={}){
  const allowed=new Set([
    "SAME_INDUSTRY_NON_GROUP_CONTROL",
    "SAME_GROUP_NO_SHARED_EVENT",
    "SHARED_EVENT_NO_D01_PATTERN",
    "ADMINISTRATIVE_GROUP_CHANGE",
    "UNRELATED_SIMULTANEOUS_PATTERN"
  ]);
  if(!allowed.has(p.placeboFamily))return {status:"RELATED_ISSUER_PLACEBO_INVALID"};
  if(p.selectedAfterOutcome===true)return {status:"OUTCOME_SELECTED_PLACEBO_PROHIBITED"};
  return {status:"RELATED_ISSUER_PLACEBO_VALID"};
}

export function validateUnknownRelationIndependence({relationState,assumedIndependent}={}){
  if(relationState==="RELATED_ISSUER_RELATION_UNKNOWN"&&assumedIndependent===true)
    return {status:"UNKNOWN_RELATION_INDEPENDENCE_ASSUMPTION_PROHIBITED"};
  return {status:"RELATION_INDEPENDENCE_POLICY_VALID"};
}
