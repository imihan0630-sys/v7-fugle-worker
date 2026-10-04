// D01 DL-029 boundary-identity and detector-version robustness manifest v0.1
// Research-only / outcome-blind.

function finite(x){return typeof x==="number"&&Number.isFinite(x);}
function validBoundary(lower,upper){return finite(lower)&&finite(upper)&&upper>=lower;}

export function buildBoundaryPerturbations({trueZone,gridReceipt}={}){
  const lower=trueZone?.lower, upper=trueZone?.upper;
  const landmark=String(trueZone?.confirmedAt||"");
  if(!validBoundary(lower,upper)||!landmark){
    return {status:"UNKNOWN",reason:"TRUE_ZONE_INVALID",variants:[]};
  }
  if(!gridReceipt||
     gridReceipt.verified!==true||
     !gridReceipt.tickRuleVersion||
     !gridReceipt.tickRuleAsOf||
     gridReceipt.tickRuleAsOf>landmark||
     !finite(gridReceipt.lowerPrev)||
     !finite(gridReceipt.lowerNext)||
     !finite(gridReceipt.upperPrev)||
     !finite(gridReceipt.upperNext)){
    return {status:"DATA_BLOCKED",reason:"TICK_GRID_RECEIPT_INVALID",variants:[]};
  }

  const defs=[
    ["CANONICAL",lower,upper],
    ["SHIFT_DOWN_ONE_GRID_STEP",gridReceipt.lowerPrev,gridReceipt.upperPrev],
    ["SHIFT_UP_ONE_GRID_STEP",gridReceipt.lowerNext,gridReceipt.upperNext],
    ["EXPAND_ONE_GRID_STEP",gridReceipt.lowerPrev,gridReceipt.upperNext],
    ["CONTRACT_ONE_GRID_STEP",gridReceipt.lowerNext,gridReceipt.upperPrev]
  ];

  const variants=defs.map(([id,l,u])=>({
    perturbationId:id,
    lower:l,
    upper:u,
    evaluability:validBoundary(l,u)?"EVALUABLE":"INVALID_CONTRACTION",
    identityClass:"I0_SAME_IDENTITY_SAME_ANCHORS",
    independentSample:false
  }));

  return {
    status:"VALID",
    landmark,
    tickRuleVersion:gridReceipt.tickRuleVersion,
    tickRuleAsOf:gridReceipt.tickRuleAsOf,
    variants,
    bestVariantSelectionAllowed:false,
    outcomeJoinAllowed:false
  };
}

export function buildAnchorJackknifeManifest({trueZone,anchorIds=[],jackknifeVariants=[]}={}){
  const landmark=String(trueZone?.confirmedAt||"");
  const canonicalCandidateId=String(trueZone?.candidateId||"");
  const ids=[...new Set((anchorIds||[]).map(String).filter(Boolean))].sort();

  if(!landmark||!canonicalCandidateId)
    return {status:"UNKNOWN",reason:"TRUE_ZONE_IDENTITY_INVALID",variants:[]};
  if(ids.length<2)
    return {status:"NOT_EVALUABLE",reason:"INSUFFICIENT_ANCHOR_MULTIPLICITY",variants:[]};

  const byOmitted=new Map();
  for(const v of jackknifeVariants||[]){
    const omitted=String(v?.omittedAnchorId||"");
    if(!omitted||!ids.includes(omitted)||byOmitted.has(omitted)) continue;
    byOmitted.set(omitted,v);
  }

  const variants=ids.map(omitted=>{
    const v=byOmitted.get(omitted);
    if(!v){
      return {
        omittedAnchorId:omitted,
        evaluability:"MISSING_REQUIRED_JACKKNIFE_VARIANT",
        identityClass:"I4_NOT_EVALUABLE",
        independentSample:false
      };
    }
    if(String(v.asOf||"")>landmark){
      return {
        omittedAnchorId:omitted,
        evaluability:"FUTURE_STATE_PROHIBITED",
        identityClass:"I4_NOT_EVALUABLE",
        independentSample:false
      };
    }
    if(v.zonePresent!==true){
      return {
        omittedAnchorId:omitted,
        evaluability:"EVALUABLE",
        identityClass:"I3_IDENTITY_DISAPPEARED",
        independentSample:false
      };
    }
    if(!validBoundary(v.lower,v.upper)){
      return {
        omittedAnchorId:omitted,
        evaluability:"BOUNDARY_INVALID",
        identityClass:"I4_NOT_EVALUABLE",
        independentSample:false
      };
    }
    return {
      omittedAnchorId:omitted,
      lower:v.lower,
      upper:v.upper,
      evaluability:"EVALUABLE",
      identityClass:v.sameStructuralLineage===true
        ?"I1_SAME_IDENTITY_REDUCED_ANCHORS"
        :"I2_IDENTITY_CHANGED",
      independentSample:false
    };
  });

  const complete=variants.every(v=>v.evaluability!=="MISSING_REQUIRED_JACKKNIFE_VARIANT");
  return {
    status:complete?"VALID":"INCOMPLETE",
    canonicalCandidateId,
    landmark,
    variants,
    retainAllVariants:true,
    bestVariantSelectionAllowed:false,
    outcomeJoinAllowed:false
  };
}

export function classifyDetectorVersionRelation({
  declaredRelation,
  canonicalManifestHash,
  challengerManifestHash,
  frozenBeforeOutcome
}={}){
  if(declaredRelation==="SEMANTIC_EQUIVALENT"){
    if(!canonicalManifestHash||!challengerManifestHash)
      return {status:"UNKNOWN",reason:"MANIFEST_HASH_MISSING"};
    return canonicalManifestHash===challengerManifestHash
      ?{status:"PASS",classification:"SEMANTIC_EQUIVALENT_REPLAY_PASS"}
      :{status:"FAIL",classification:"SEMANTIC_REGRESSION"};
  }
  if(declaredRelation==="PREDECLARED_VARIANT"){
    return frozenBeforeOutcome===true
      ?{status:"VALID",classification:"PREDECLARED_ROBUSTNESS_CHALLENGER",independentSample:false}
      :{status:"PROHIBITED",classification:"POST_OUTCOME_VERSION_PROHIBITED"};
  }
  return {status:"PROHIBITED",classification:"POST_OUTCOME_VERSION_PROHIBITED"};
}
