// D01 DL-030 detector-frontier provenance auditor v0.1
// Research-only / outcome-blind.

function txt(x){return typeof x==="string"?x.trim():"";}
function finite(x){return typeof x==="number"&&Number.isFinite(x);}

export function selectionMarginAtr(observedDirectionalChangeATR,majorK=3){
  if(!finite(observedDirectionalChangeATR)||!finite(majorK))
    return null;
  return observedDirectionalChangeATR-majorK;
}

export function auditFrontierCandidate(c={}){
  const type=txt(c.frontierType);
  const asOf=txt(c.asOf);
  if(!type||!asOf) return {status:"UNKNOWN",reason:"IDENTITY_OR_ASOF_MISSING"};

  if(c.usedFutureBars===true)
    return {status:"DATA_BLOCKED",reason:"FUTURE_BAR_RECONSTRUCTION_PROHIBITED"};

  if(c.semanticSpaceValid!==true||c.sessionPathComplete!==true)
    return {status:"UNKNOWN",reason:"SEMANTIC_OR_SESSION_PROVENANCE_INCOMPLETE"};

  if(type==="F1_BASE_CONFIRMED_MAJOR_REJECTED"){
    if(c.baseConfirmed!==true)
      return {status:"QA_FAIL",reason:"F1_REQUIRES_BASE_CONFIRMATION"};
    if(c.majorEvaluable!==true)
      return {status:"UNKNOWN",reason:"MAJOR_EVALUABILITY_UNKNOWN"};
    if(c.majorConfirmed===true)
      return {status:"QA_FAIL",reason:"F1_CANNOT_BE_MAJOR_CONFIRMED"};
    const margin=selectionMarginAtr(c.observedDirectionalChangeATR,3);
    if(margin===null)
      return {status:"UNKNOWN",reason:"SELECTION_MARGIN_MISSING"};
    return {
      status:"VALID",
      frontierType:type,
      selectionMarginATR:margin,
      causalClaimEligible:false,
      independentVoteEligible:false
    };
  }

  if(type==="F2_MAJOR_SINGLE_GATE_REJECT"){
    if(c.sameMajorProposalPath!==true)
      return {status:"UNKNOWN",reason:"MAJOR_PROPOSAL_LINEAGE_UNCERTIFIED"};
    if(c.failedGateCount!==1)
      return {status:"QA_FAIL",reason:"F2_REQUIRES_EXACTLY_ONE_FAILED_GATE"};
    if(!txt(c.failedGate))
      return {status:"UNKNOWN",reason:"FAILED_GATE_MISSING"};
    const margin=selectionMarginAtr(c.observedDirectionalChangeATR,3);
    return {
      status:margin===null?"UNKNOWN":"VALID",
      frontierType:type,
      selectionMarginATR:margin,
      causalClaimEligible:false,
      independentVoteEligible:false
    };
  }

  return {status:"QA_FAIL",reason:"UNKNOWN_FRONTIER_TYPE"};
}

export function historicalFrontierClass({historicalClass,laterMajorConfirmed=false}={}){
  return {
    historicalClass:txt(historicalClass),
    laterMajorConfirmed:laterMajorConfirmed===true,
    rewriteHistoricalClass:false
  };
}
