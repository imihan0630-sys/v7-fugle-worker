// D01 DL-096~097 witness firewall and R7 admission oracle v0.1
const FIRST_WAVE=new Set(["D01-02","D01-03","D01-07","D01-09"]);
const HASH64=/^[a-f0-9]{64}$/i;

export function compareWitnessIdentity(a={},b={}){
  const fields=["market","symbol","targetDate","interfaceCutoffAt","exactSessionHash","sourceHistoryHash"];
  const drift=fields.filter(k=>(a[k]??null)!==(b[k]??null));
  return {status:drift.length?"CROSS_WITNESS_NON_EQUIVALENT":"WITNESS_IDENTITY_EQUIVALENT",drift};
}

export function canCrossCreditReceipt({sourceWitness,targetWitness}={}){
  return {status:compareWitnessIdentity(sourceWitness,targetWitness).status==="WITNESS_IDENTITY_EQUIVALENT"
    ?"CROSS_CREDIT_IDENTITY_ELIGIBLE":"CROSS_CREDIT_PROHIBITED"};
}

export function validateR7(r={},upstream={}){
  const missing=["R1","R2","R3","R4","R5","R6"].filter(k=>upstream[k]!=="PASS");
  if(missing.length)return {status:"R7_EMISSION_BLOCKED",missing};
  if(!FIRST_WAVE.has(r.moduleId))return {status:"R7_MODULE_NOT_FIRST_WAVE"};
  if(r.market!=="TWSE"||r.symbol!=="1101"||r.targetDate!=="2021-06-15")return {status:"R7_WITNESS_MISMATCH"};
  if(r.outcomeFieldsPresent===true)return {status:"R7_OUTCOME_CONTAMINATED"};
  if(!r.predictorFreezeAt||!r.firstObservableAt)return {status:"R7_CLOCK_UNKNOWN"};
  if(r.firstObservableAt>r.predictorFreezeAt)return {status:"R7_LOOKAHEAD"};
  if(!Array.isArray(r.requiredSourceBarIds)||!r.requiredSourceBarIds.length)return {status:"R7_SOURCE_BARS_MISSING"};
  if(new Set(r.requiredSourceBarIds).size!==r.requiredSourceBarIds.length)return {status:"R7_SOURCE_BARS_DUPLICATED"};
  if(!HASH64.test(String(r.exactSessionHash||""))||!HASH64.test(String(r.sourceHistoryHash||"")))return {status:"R7_UPSTREAM_HASH_INVALID"};
  if(!["NO_STRUCTURE","STRUCTURE_EMITTED","DATA_BLOCKED"].includes(r.featureState))return {status:"R7_FEATURE_STATE_INVALID"};
  if(!HASH64.test(String(r.deterministicFeatureHash||"")))return {status:"R7_FEATURE_HASH_INVALID"};
  if(r.replaySafe!==true)return {status:"R7_NOT_REPLAY_SAFE"};
  return {status:"R7_ADMITTED"};
}

export function validateModuleRoot(r={}){
  if(["D01-02","D01-03"].includes(r.moduleId)&&r.informationRoot!=="PRICE_OHLC")return {status:"R7_INFORMATION_ROOT_MISMATCH"};
  if(r.moduleId==="D01-09"&&r.priceLimitContextPass!==true)return {status:"R7_D0109_R5_CONTEXT_REQUIRED"};
  if(r.moduleId==="D01-07"&&r.retrospectiveBackpaint===true)return {status:"R7_D0107_BACKPAINT_PROHIBITED"};
  return {status:"R7_MODULE_ROOT_VALID"};
}
