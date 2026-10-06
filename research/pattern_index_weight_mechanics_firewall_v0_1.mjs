// D01 DL-061 index-weight / mega-cap mechanics firewall v0.1
function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function str(x){return String(x??"");}

export function classifyParticipationContext({
  capWeightedReturn,
  equalWeightedReturn,
  medianMemberReturn,
  advanceShare,
  top1ContributionShare,
  top3ContributionShare
}={}){
  if(!finite(capWeightedReturn))
    return {state:"INDEX_CONTRIBUTION_UNKNOWN"};

  if(!finite(equalWeightedReturn)||!finite(medianMemberReturn)||!finite(advanceShare))
    return {state:"MARKET_CONFIRMATION_BREADTH_UNKNOWN"};

  const broad=capWeightedReturn>0&&equalWeightedReturn>0&&medianMemberReturn>0&&advanceShare>0.5;
  const narrow=capWeightedReturn>0&&(equalWeightedReturn<=0||medianMemberReturn<=0||advanceShare<=0.5);
  const concentrated=(finite(top1ContributionShare)&&top1ContributionShare>0.5)||
    (finite(top3ContributionShare)&&top3ContributionShare>0.75);

  if(broad&&!concentrated) return {state:"BROAD_MARKET_CONFIRMATION"};
  if(narrow&&concentrated) return {state:"NARROW_MEGA_CAP_LED_CONFIRMATION"};
  if(narrow) return {state:"CAP_WEIGHTED_UP_EQUAL_WEIGHT_WEAK"};
  return {state:"MIXED_PARTICIPATION"};
}

export function validateHistoricalWeight({
  historicalWeight,
  historicalWeightKnownAt,
  predictorFreezeAt,
  replaySafe
}={}){
  const known=str(historicalWeightKnownAt);
  const freeze=str(predictorFreezeAt);
  if(replaySafe!==true) return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};
  if(!finite(historicalWeight)) return {status:"INDEX_WEIGHT_UNKNOWN"};
  if(!known||!freeze) return {status:"UNKNOWN",reason:"WEIGHT_CLOCK_INCOMPLETE"};
  if(known>freeze) return {status:"POST_HOC_WEIGHT_NOT_ELIGIBLE"};
  return {status:"HISTORICAL_WEIGHT_ELIGIBLE"};
}

export function classifySelfInclusion({
  candidateSymbol,
  constituentSymbols=[],
  exCandidateContextAvailable
}={}){
  const self=constituentSymbols.map(String).includes(str(candidateSymbol));
  if(!self) return {state:"CANDIDATE_NOT_INCLUDED",independentConfirmationAllowed:false};
  return {
    state:"CANDIDATE_SELF_INCLUDED_IN_INDEX_CONTEXT",
    exCandidateContextAvailable:exCandidateContextAvailable===true,
    independentConfirmationAllowed:false
  };
}

export function validatePassiveEventTiming({
  announcedAt,
  firstKnownAt,
  effectiveAt,
  predictorFreezeAt,
  replaySafe
}={}){
  const announced=str(announcedAt),known=str(firstKnownAt),effective=str(effectiveAt),freeze=str(predictorFreezeAt);
  if(replaySafe!==true) return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE"};
  if(!known||!freeze) return {status:"UNKNOWN",reason:"EVENT_CLOCK_INCOMPLETE"};
  if(known>freeze||announced>freeze) return {status:"POST_HOC_INDEX_EVENT_NOT_ELIGIBLE"};
  return {status:"INDEX_EVENT_CONTEXT_ELIGIBLE",effectiveAt:effective||null};
}

export function buildIndexContextDenominator(rows=[]){
  const states=[
    "BROAD_MARKET_CONFIRMATION",
    "NARROW_MEGA_CAP_LED_CONFIRMATION",
    "CAP_WEIGHTED_UP_EQUAL_WEIGHT_WEAK",
    "MIXED_PARTICIPATION",
    "MARKET_CONFIRMATION_BREADTH_UNKNOWN",
    "INDEX_CONTRIBUTION_UNKNOWN",
    "INDEX_WEIGHT_DATA_BLOCKED"
  ];
  const counts=Object.fromEntries(states.map(s=>[s,0]));
  for(const r of rows||[]){
    const s=str(r?.state);
    if(s in counts) counts[s]++; else counts.INDEX_WEIGHT_DATA_BLOCKED++;
  }
  return {counts,total:(rows||[]).length,broadOnlyFilteringAllowed:false,effectiveIndependentEvidenceCount:1};
}
