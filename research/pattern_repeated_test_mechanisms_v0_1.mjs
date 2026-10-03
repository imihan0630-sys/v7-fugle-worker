// D01 DL-037 repeated-test mechanism evidence auditor v0.1
// Research-only / outcome-blind.

export function mechanismEvidenceCeiling({
 hasPriceHistory=false,
 hasPriceVolume=false,
 hasMicrostructure=false
}={}){
 if(hasMicrostructure)
  return {
   level:"L2_MICROSTRUCTURE",
   maxInterpretation:"ORDER_BOOK_MECHANISM_DIAGNOSTIC",
   causalProof:false
  };
 if(hasPriceVolume)
  return {
   level:"L1_PRICE_VOLUME",
   maxInterpretation:"PRICE_VOLUME_MECHANISM_PROXY",
   causalProof:false
  };
 if(hasPriceHistory)
  return {
   level:"L0_PRICE_HISTORY",
   maxInterpretation:"PATH_PATTERN_DESCRIPTION",
   causalProof:false
  };
 return {level:"NONE",maxInterpretation:"UNKNOWN",causalProof:false};
}

export function auditMechanismClaim({claim,evidenceLevel}={}){
 const directClaims=new Set([
  "RESTING_LIQUIDITY_DEPLETED",
  "ORDER_QUEUE_REPLENISHED",
  "HIDDEN_LIQUIDITY_PRESENT"
 ]);
 if(directClaims.has(claim)&&evidenceLevel!=="L2_MICROSTRUCTURE")
  return {status:"REJECTED",reason:"DIRECT_MICROSTRUCTURE_CLAIM_WITHOUT_L2"};
 return {
  status:"ALLOWED_AS_DESCRIPTIVE_CANDIDATE",
  independentVoteEligible:false,
  universalDirectionalSignAuthorized:false
 };
}
