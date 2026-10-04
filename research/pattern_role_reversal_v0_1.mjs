// D01 DL-034 role-reversal / polarity-flip firewall v0.1
// Research-only / outcome-blind.

function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function str(x){return String(x??"");}

export function buildFlipEligibility({
  structuralRootId,
  structuralVersionId,
  originalRole,
  breakout,
  constraintState="UNCONSTRAINED"
}={}){
  const rootId=str(structuralRootId);
  const versionId=str(structuralVersionId);
  const role=str(originalRole);
  const direction=str(breakout?.direction);
  const confirmedAt=str(breakout?.confirmedAt);
  const eventId=str(breakout?.eventId);
  const confirmed=breakout?.confirmed===true;

  if(!rootId||!versionId||!eventId||!confirmedAt)
    return {status:"UNKNOWN",reason:"IDENTITY_OR_BREAKOUT_RECEIPT_INCOMPLETE"};

  if(!confirmed)
    return {status:"NOT_ELIGIBLE",reason:"CROSSING_NOT_CONFIRMED"};

  let candidateRole=null;
  if(role==="RESISTANCE"&&direction==="UP") candidateRole="SUPPORT";
  else if(role==="SUPPORT"&&direction==="DOWN") candidateRole="RESISTANCE";
  else return {status:"NOT_ELIGIBLE",reason:"ROLE_DIRECTION_MISMATCH"};

  const constrained=constraintState!=="UNCONSTRAINED";

  return {
    status:constrained?"FLIP_ELIGIBLE_CONSTRAINED":"CROSS_CONFIRMED_FLIP_ELIGIBLE",
    structuralRootId:rootId,
    structuralVersionId:versionId,
    originalRole:role,
    candidateRole,
    breakoutEventId:eventId,
    breakoutDirection:direction,
    breakoutConfirmedAt:confirmedAt,
    roleEpisodeStart:confirmedAt,
    createsNewRoot:false,
    firstRetestOutcomeUsed:false,
    independentSample:false,
    constraintState
  };
}

export function classifyFirstFlipTestOpportunity({
  flipCandidate,
  opportunity
}={}){
  if(!flipCandidate||
     !["CROSS_CONFIRMED_FLIP_ELIGIBLE","FLIP_ELIGIBLE_CONSTRAINED"].includes(flipCandidate.status)){
    return {status:"UNKNOWN",reason:"FLIP_CANDIDATE_INVALID"};
  }

  if(opportunity?.valid!==true)
    return {status:"NO_VALID_TEST_OPPORTUNITY",pseudoFailureAllowed:false};

  const at=str(opportunity.at);
  if(!at||at<=flipCandidate.breakoutConfirmedAt)
    return {status:"UNKNOWN",reason:"TEST_CLOCK_INVALID"};

  const approach=str(opportunity.approachSide);
  const expected=flipCandidate.candidateRole==="SUPPORT"?"ABOVE":"BELOW";
  if(approach!==expected)
    return {status:"NOT_OPPOSITE_SIDE_RETEST",expectedApproachSide:expected};

  const constrained=opportunity.constraintState&&opportunity.constraintState!=="UNCONSTRAINED";

  return {
    status:constrained?"FLIP_TEST_OPPORTUNITY_CONSTRAINED":"FIRST_FLIP_TEST_OPPORTUNITY",
    structuralRootId:flipCandidate.structuralRootId,
    structuralVersionId:flipCandidate.structuralVersionId,
    candidateRole:flipCandidate.candidateRole,
    opportunityAt:at,
    approachSide:approach,
    firstRetestOutcomeUsed:false,
    outcomeJoinAllowed:false,
    independentSample:false
  };
}

export function cancelFlipCandidateBeforeTest({
  flipCandidate,
  breakoutLifecycleStateAsOf,
  marketInvalidated,
  continuityVerified
}={}){
  if(!flipCandidate)
    return {status:"UNKNOWN",reason:"FLIP_CANDIDATE_MISSING"};

  if(marketInvalidated===true)
    return {status:"FLIP_CANDIDATE_CANCELLED_BEFORE_TEST",reason:"MARKET_INVALIDATED",failedRetest:false};

  if(continuityVerified===false)
    return {status:"FLIP_CANDIDATE_CANCELLED_BEFORE_TEST",reason:"SEMANTIC_CONTINUITY_FAILED",failedRetest:false};

  if(["FAILED_BREAKOUT","FAILED_BREAKDOWN","RECLAIMED"].includes(str(breakoutLifecycleStateAsOf)))
    return {status:"FLIP_CANDIDATE_CANCELLED_BEFORE_TEST",reason:"BREAKOUT_LIFECYCLE_RECLAIMED",failedRetest:false};

  return {status:"ACTIVE_FLIP_CANDIDATE",reason:null,failedRetest:false};
}

export function classifyPolarityComparator({
  priorOppositeRoleCertified,
  genericBreakoutContextVerified
}={}){
  if(genericBreakoutContextVerified!==true)
    return {status:"UNKNOWN",reason:"GENERIC_BREAKOUT_CONTEXT_UNVERIFIED"};

  return priorOppositeRoleCertified===true
    ?{status:"G1_FORMER_ROLE_POLARITY_CANDIDATE",independentVote:false}
    :{status:"G0_GENERIC_BREAKOUT_RETEST",independentVote:false};
}

export function buildRoleEpisodeAge({
  breakoutConfirmedOrdinal,
  asOfOrdinal
}={}){
  if(!finite(breakoutConfirmedOrdinal)||!finite(asOfOrdinal)||asOfOrdinal<breakoutConfirmedOrdinal)
    return {status:"UNKNOWN",reason:"ROLE_EPISODE_CLOCK_INVALID"};

  return {
    status:"VALID",
    roleEpisodeAgeEligibleSessions:asOfOrdinal-breakoutConfirmedOrdinal,
    startsAtBreakoutConfirmation:true
  };
}
