// D01 DL-028 detector-selection salience vs structural-memory firewall v0.1
// Research-only / outcome-blind. Builds a frozen eligible risk-set manifest.
// It does NOT match controls, score salience, inspect outcomes or infer alpha.

function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function overlap(aL,aU,bL,bU){
  return finite(aL)&&finite(aU)&&finite(bL)&&finite(bU)&&aL<=bU&&aU>=bL;
}

export function buildDetectorSalienceRiskSet({
  trueZone,
  candidateAnchors=[]
}={}){
  const landmark=String(trueZone?.confirmedAt||"");
  const symbol=String(trueZone?.symbol||"");
  const semanticSpace=String(trueZone?.semanticSpace||"");
  const detectorVersion=String(trueZone?.detectorVersion||"");
  const trueCandidateId=String(trueZone?.candidateId||"");
  const trueLower=trueZone?.lower;
  const trueUpper=trueZone?.upper;

  if(!landmark||!symbol||!semanticSpace||!detectorVersion||!trueCandidateId||
     !finite(trueLower)||!finite(trueUpper)||trueUpper<trueLower){
    return {
      status:"UNKNOWN",
      reason:"TRUE_ZONE_INVALID",
      eligible:[],
      excluded:[]
    };
  }

  const eligible=[];
  const excluded=[];

  for(const c of candidateAnchors||[]){
    const id=String(c?.candidateId||"");
    const at=String(c?.candidateAt||"");
    const stateAsOf=String(c?.stateAsOf||"");
    const statusAtLandmark=String(c?.statusAtLandmark||"");
    let reason=null;

    if(!id) reason="CANDIDATE_ID_MISSING";
    else if(id===trueCandidateId) reason="TRUE_CANDIDATE_SELF";
    else if(String(c?.symbol||"")!==symbol) reason="SYMBOL_MISMATCH";
    else if(String(c?.semanticSpace||"")!==semanticSpace) reason="SEMANTIC_SPACE_MISMATCH";
    else if(String(c?.detectorVersion||"")!==detectorVersion) reason="DETECTOR_VERSION_MISMATCH";
    else if(!at||at>landmark) reason="FUTURE_OR_INVALID_CANDIDATE_AT";
    else if(!stateAsOf||stateAsOf>landmark) reason="FUTURE_OR_INVALID_STATE_ASOF";
    else if(c?.candidateStateProvenanceVerified!==true||
            c?.eligibleSymbolSession!==true||
            c?.technicalContinuityVerified!==true) reason="PROVENANCE_INCOMPLETE";
    else if(statusAtLandmark!=="UNCONFIRMED_ACTIVE") reason="NOT_UNCONFIRMED_ACTIVE_AT_LANDMARK";
    else if(!finite(c?.lower)||!finite(c?.upper)||c.upper<c.lower) reason="BOUNDARY_INVALID";
    else if(overlap(c.lower,c.upper,trueLower,trueUpper)) reason="OVERLAPS_TRUE_ZONE";
    else if(c?.knownDuplicateRelationAsOfLandmark===true) reason="KNOWN_DUPLICATE_RELATION";

    const base={
      candidateId:id||null,
      candidateAt:at||null,
      stateAsOf:stateAsOf||null,
      statusAtLandmark:statusAtLandmark||null
    };

    if(reason){
      excluded.push({...base,reason});
      continue;
    }

    eligible.push({
      ...base,
      symbol,
      semanticSpace,
      detectorVersion,
      lower:c.lower,
      upper:c.upper,
      salienceSnapshot:c.salienceSnapshot??null,
      opportunityReceipt:c.opportunityReceipt??null,
      candidateClass:"DETECTOR_SALIENCE_CONTROL",
      independentVoteEligible:false
    });
  }

  eligible.sort((a,b)=>
    a.candidateAt.localeCompare(b.candidateAt)||
    a.candidateId.localeCompare(b.candidateId)
  );
  excluded.sort((a,b)=>
    String(a.candidateId).localeCompare(String(b.candidateId))||
    String(a.reason).localeCompare(String(b.reason))
  );

  return {
    status:eligible.length?"VALID":"SALIENCE_CONTROL_NOT_EVALUABLE",
    confirmationLandmark:landmark,
    trueCandidateId,
    symbol,
    semanticSpace,
    detectorVersion,
    eligible,
    excluded,
    retainAllEligibleControls:true,
    matchingAllowedInD01:false,
    outcomeSelectionAllowed:false,
    futureStateBackfillAllowed:false,
    salienceScoreDefined:false,
    inferenceOwner:"D16",
    formalCoreImpact:"NONE"
  };
}
