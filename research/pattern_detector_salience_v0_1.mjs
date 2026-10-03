// D01 DL-028 detector-selection salience auditor v0.1
// Research-only / outcome-blind.

function txt(x){return typeof x==="string"?x.trim():"";}

const FORBIDDEN_FUTURE_FIELDS=new Set([
  "futureTouchCount","futureBounceCount","futureFailureCount",
  "futureLiquidity","futureParticipation","futureOutcome"
]);

export function auditSalienceDescriptor({
  parentConfirmedAt,
  parentDecisionCutoffAt,
  descriptor={}
}={}){
  const confirmed=txt(parentConfirmedAt);
  const cutoff=txt(parentDecisionCutoffAt||parentConfirmedAt);
  if(!confirmed||!cutoff)
    return {status:"UNKNOWN",reason:"PARENT_CUTOFF_MISSING"};

  const field=txt(descriptor.field);
  const observedAt=txt(descriptor.observedAt);
  const layer=txt(descriptor.layer);

  if(!field||!observedAt||!layer)
    return {status:"UNKNOWN",reason:"DESCRIPTOR_PROVENANCE_INCOMPLETE"};

  if(FORBIDDEN_FUTURE_FIELDS.has(field))
    return {status:"DATA_BLOCKED",reason:"FUTURE_FIELD_PROHIBITED"};

  if(observedAt>confirmed || observedAt>cutoff)
    return {status:"DATA_BLOCKED",reason:"POST_CONFIRMATION_SALIENCE_LEAKAGE"};

  if(!["O","M","S"].includes(layer))
    return {status:"QA_FAIL",reason:"UNKNOWN_SALIENCE_LAYER"};

  return {
    status:"VALID",
    field,
    layer,
    observedAt,
    causalCutoff:confirmed,
    predictiveVoteEligible:false
  };
}

export function classifyMechanismInterpretation({
  e1Residual=false,
  e2Residual=false,
  e3Residual=false
}={}){
  if(!e1Residual)
    return "GENERIC_LEVEL_CROSSING_EXPLANATION";
  if(!e2Residual)
    return "DETECTOR_MECHANICAL_SELECTION_EXPLANATION";
  if(!e3Residual)
    return "SALIENCE_MEDIATED_MECHANISM_CANDIDATE";
  return "RESIDUAL_STRUCTURAL_IDENTITY_CANDIDATE_NOT_CAUSAL_PROOF";
}

export function salienceMatchability({
  opportunityComplete=false,
  mechanicalComplete=false,
  salienceComplete=false,
  commonSupportStatus="UNKNOWN"
}={}){
  if(!opportunityComplete)
    return {status:"NOT_MATCHABLE",reason:"OPPORTUNITY_LAYER_INCOMPLETE"};
  if(!mechanicalComplete)
    return {status:"NOT_MATCHABLE",reason:"MECHANICAL_SELECTION_LAYER_INCOMPLETE"};

  if(commonSupportStatus==="OUTSIDE_COMMON_SUPPORT")
    return {status:"NOT_MATCHABLE",reason:"OUTSIDE_COMMON_SUPPORT"};

  if(!salienceComplete)
    return {
      status:"E2_MATCHABLE_ONLY",
      e2Eligible:true,
      e3Eligible:false,
      reason:"BEHAVIORAL_SALIENCE_LAYER_INCOMPLETE"
    };

  return {
    status:"E2_E3_MATCHABLE",
    e2Eligible:true,
    e3Eligible:true,
    predictiveVoteEligible:false
  };
}
