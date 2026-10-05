// D01 DL-036 inherited polarity vs new post-break structure v0.1
// Research-only / outcome-blind / SDA-001 + SDA-002 remediation.

function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function str(x){return String(x??"");}
function uniq(xs=[]){return [...new Set((xs||[]).map(String).filter(Boolean))].sort();}
function subset(a,b){
  const B=new Set(b);
  return a.every(x=>B.has(x));
}

export function intervalOverlapDescriptors(oldBoundary={},newBoundary={},atr=null){
  const a0=oldBoundary.lower,a1=oldBoundary.upper,b0=newBoundary.lower,b1=newBoundary.upper;
  if(!finite(a0)||!finite(a1)||!finite(b0)||!finite(b1)||a1<a0||b1<b0)
    return {status:"UNKNOWN",reason:"BOUNDARY_INVALID"};

  const intersection=Math.max(0,Math.min(a1,b1)-Math.max(a0,b0));
  const union=Math.max(a1,b1)-Math.min(a0,b0);
  const centerA=(a0+a1)/2;
  const centerB=(b0+b1)/2;
  const centerDistance=Math.abs(centerA-centerB);

  return {
    status:"VALID",
    intersectionWidth:intersection,
    unionWidth:union,
    intervalOverlapRatio:union>0?intersection/union:(a0===b0&&a1===b1?1:0),
    centerDistancePrice:centerDistance,
    centerDistanceAtr:finite(atr)&&atr>0?centerDistance/atr:null,
    exactBoundaryEquality:a0===b0&&a1===b1,
    identityDecisionAllowed:false
  };
}

export function classifyPretestAvailability({
  candidate,
  predictorFreezeAt,
  firstRetestOpportunityAt
}={}){
  const freeze=str(predictorFreezeAt);
  const retest=str(firstRetestOpportunityAt);
  const firstObservableAt=str(candidate?.firstObservableAt);
  const confirmedAt=str(candidate?.confirmedAt);
  const latestAnchorAt=str(candidate?.latestAnchorAt);

  if(candidate?.confirmed!==true)
    return {status:"NOT_CONFIRMED_PRETEST",eligible:false};

  if(candidate?.replaySafe!==true)
    return {status:"DATA_BLOCKED",reason:"REPLAY_UNSAFE",eligible:false};

  if(candidate?.futureBarRequired===true)
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"FUTURE_BAR_REQUIRED",eligible:false};

  if(!freeze||!firstObservableAt||!confirmedAt||!latestAnchorAt)
    return {status:"UNKNOWN",reason:"CLOCK_INCOMPLETE",eligible:false};

  if(firstObservableAt>freeze||confirmedAt>freeze||latestAnchorAt>freeze)
    return {status:"POST_HOC_NOT_ELIGIBLE",reason:"CANDIDATE_NOT_AVAILABLE_AT_FREEZE",eligible:false};

  if(retest&&confirmedAt>=retest)
    return {status:"NEW_STRUCTURE_CONFIRMED_AFTER_TEST",reason:"CONFIRMED_AT_OR_AFTER_RETEST",eligible:false};

  return {status:"PRETEST_AVAILABLE",eligible:true};
}

export function classifyStructuralLineage({
  oldRoot,
  newCandidate,
  predictorFreezeAt,
  firstRetestOpportunityAt,
  atr
}={}){
  const availability=classifyPretestAvailability({
    candidate:newCandidate,
    predictorFreezeAt,
    firstRetestOpportunityAt
  });

  if(availability.status==="NEW_STRUCTURE_CONFIRMED_AFTER_TEST"||
     availability.status==="POST_HOC_NOT_ELIGIBLE"){
    return {
      lineageClass:"NEW_STRUCTURE_CONFIRMED_AFTER_TEST",
      availability,
      independentVoteAllowed:false,
      effectiveIndependentEvidenceCount:1
    };
  }

  if(availability.status==="NOT_CONFIRMED_PRETEST"){
    return {
      lineageClass:"INHERITED_ROLE_ONLY",
      availability,
      divergenceState:"NEW_CANDIDATE_NOT_CONFIRMED",
      independentVoteAllowed:false,
      effectiveIndependentEvidenceCount:1
    };
  }

  if(availability.status!=="PRETEST_AVAILABLE"){
    return {
      lineageClass:"SPATIAL_OVERLAP_WITHOUT_LINEAGE",
      availability,
      divergenceState:"IDENTITY_UNRESOLVED",
      independentVoteAllowed:false,
      effectiveIndependentEvidenceCount:1
    };
  }

  const oldAnchors=uniq(oldRoot?.anchorIds);
  const newAnchors=uniq(newCandidate?.anchorIds);
  const sameDeclaredRoot=str(oldRoot?.rootId)&&str(oldRoot?.rootId)===str(newCandidate?.rootId);
  const hasOld=oldAnchors.length>0;
  const hasNew=newAnchors.length>0;

  if(sameDeclaredRoot&&hasOld&&hasNew&&subset(oldAnchors,newAnchors)){
    const added=newAnchors.filter(x=>!oldAnchors.includes(x));
    const occurred=newCandidate?.anchorOccurredAt||{};
    const breakoutAt=str(newCandidate?.breakoutConfirmedAt||oldRoot?.breakoutConfirmedAt);
    const freeze=str(predictorFreezeAt);
    const causal=added.every(id=>{
      const at=str(occurred[id]);
      return at&&(!breakoutAt||at>breakoutAt)&&at<=freeze;
    });
    if(causal){
      return {
        lineageClass:"SAME_ROOT_CAUSAL_EXTENSION",
        addedAnchorIds:added,
        availability,
        independentVoteAllowed:false,
        effectiveIndependentEvidenceCount:1
      };
    }
  }

  const overlap=intervalOverlapDescriptors(
    oldRoot?.boundary||{},
    newCandidate?.boundary||{},
    atr
  );

  if(!str(newCandidate?.rootId)||!hasNew||overlap.status!=="VALID"){
    return {
      lineageClass:"SPATIAL_OVERLAP_WITHOUT_LINEAGE",
      availability,
      overlap,
      divergenceState:"IDENTITY_UNRESOLVED",
      independentVoteAllowed:false,
      effectiveIndependentEvidenceCount:1
    };
  }

  if(str(oldRoot?.rootId)===str(newCandidate?.rootId)){
    return {
      lineageClass:"SPATIAL_OVERLAP_WITHOUT_LINEAGE",
      availability,
      overlap,
      divergenceState:"SAME_ROOT_NON_EXTENSION_CONFLICT",
      independentVoteAllowed:false,
      effectiveIndependentEvidenceCount:1
    };
  }

  if(overlap.intervalOverlapRatio>0||overlap.exactBoundaryEquality){
    return {
      lineageClass:"COLOCATED_DUAL_LINEAGE_PRETEST",
      availability,
      overlap,
      informationRoot:"PRICE_OHLC",
      redundancyGroup:"D01_PRICE_GEOMETRY_SAME_PARENT",
      independentVoteAllowed:false,
      effectiveIndependentEvidenceCount:1,
      residualIncrementalityStatus:"NOT_VALIDATED"
    };
  }

  return {
    lineageClass:"NEW_POST_BREAK_ROOT_NONOVERLAP",
    availability,
    overlap,
    informationRoot:"PRICE_OHLC",
    redundancyGroup:"D01_PRICE_GEOMETRY_SAME_PARENT",
    independentVoteAllowed:false,
    effectiveIndependentEvidenceCount:1,
    residualIncrementalityStatus:"NOT_VALIDATED"
  };
}

export function buildInformationLineageDiagnostics({
  parentDecisionId,
  representations=[]
}={}){
  const parent=str(parentDecisionId);
  if(!parent) return {status:"UNKNOWN",reason:"PARENT_ID_MISSING"};

  const reps=(representations||[]).map((r,i)=>({
    id:str(r.id)||`R${i+1}`,
    informationRoot:str(r.informationRoot)||"PRICE_OHLC",
    representationFamily:str(r.representationFamily)||"D01_PRICE_GEOMETRY",
    structuralRootId:str(r.structuralRootId)||null
  }));

  if(!reps.length) return {status:"UNKNOWN",reason:"REPRESENTATIONS_EMPTY"};

  const roots=uniq(reps.map(x=>x.informationRoot));
  const allPrice=roots.length===1&&roots[0]==="PRICE_OHLC";

  return {
    status:"VALID",
    parentDecisionId:parent,
    rawRepresentationCount:reps.length,
    distinctStructuralRootCount:uniq(reps.map(x=>x.structuralRootId).filter(Boolean)).length,
    informationRoots:roots,
    redundancyGroup:allPrice?"D01_PRICE_GEOMETRY_SAME_PARENT":"MIXED_INFORMATION_ROOTS",
    effectiveIndependentEvidenceCount:allPrice?1:roots.length,
    independentVoteAllowed:allPrice?false:null,
    residualIncrementalityStatus:"NOT_VALIDATED"
  };
}

export function buildReplaySafeCandidateReceipt({
  candidateId,
  firstObservableAt,
  confirmedAt,
  predictorFreezeAt,
  latestAnchorAt,
  futureBarRequired,
  replaySafe,
  divergenceState
}={}){
  const c={
    confirmed:true,
    firstObservableAt,
    confirmedAt,
    latestAnchorAt,
    futureBarRequired,
    replaySafe
  };
  const availability=classifyPretestAvailability({
    candidate:c,
    predictorFreezeAt
  });
  return {
    candidateId:str(candidateId)||null,
    firstObservableAt:str(firstObservableAt)||null,
    confirmedAt:str(confirmedAt)||null,
    predictorFreezeAt:str(predictorFreezeAt)||null,
    latestAnchorAt:str(latestAnchorAt)||null,
    futureBarRequired:futureBarRequired===true,
    replaySafe:replaySafe===true,
    divergenceState:str(divergenceState)||"UNSPECIFIED",
    eligibilityStatus:availability.status,
    eligibleAtFreeze:availability.eligible===true
  };
}
