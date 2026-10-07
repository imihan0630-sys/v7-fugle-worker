// D01 DL-098~100 R7 payload / parent comparator / denominator oracle v0.1
const FIRST_WAVE=new Set(["D01-02","D01-03","D01-07","D01-09"]);
const HASH64=/^[a-f0-9]{64}$/i;
const LEDGER_STATES=new Set(["UPSTREAM_DATA_BLOCKED","R7_DATA_BLOCKED","NO_STRUCTURE","STRUCTURE_EMITTED"]);

export function validateCanonicalR7Payload(r={}){
  if(!FIRST_WAVE.has(r.moduleId))return {status:"R7_MODULE_OUTSIDE_FIRST_WAVE"};
  if(r.outcomeFieldsPresent===true)return {status:"R7_OUTCOME_CONTAMINATED"};
  if(!r.predictorFreezeAt||!r.firstObservableAt)return {status:"R7_CLOCK_UNKNOWN"};
  if(r.firstObservableAt>r.predictorFreezeAt)return {status:"R7_LOOKAHEAD"};
  if(!Array.isArray(r.requiredSourceBarIds)||!r.requiredSourceBarIds.length)return {status:"R7_SOURCE_BARS_MISSING"};
  if(new Set(r.requiredSourceBarIds).size!==r.requiredSourceBarIds.length)return {status:"R7_SOURCE_BARS_DUPLICATED"};
  if(!HASH64.test(String(r.exactSessionHash||""))||!HASH64.test(String(r.sourceHistoryHash||"")))return {status:"R7_UPSTREAM_HASH_INVALID"};
  if(!["NO_STRUCTURE","STRUCTURE_EMITTED","DATA_BLOCKED"].includes(r.featureState))return {status:"R7_FEATURE_STATE_INVALID"};
  if(r.replaySafe!==true)return {status:"R7_NOT_REPLAY_SAFE"};
  if(!r.featureValues||typeof r.featureValues!=="object"||Array.isArray(r.featureValues))return {status:"R7_FEATURE_VALUES_MISSING"};
  if(!Array.isArray(r.aliasLabels)||!Array.isArray(r.contextRefs))return {status:"R7_METADATA_ARRAYS_REQUIRED"};
  return {status:"R7_CANONICAL_PAYLOAD_VALID"};
}

export function validateModuleFeatureSemantics(r={}){
  const f=r.featureValues||{};
  if(r.moduleId==="D01-02"){
    const req=["signedBodyToRange","bodyToRange","upperWickToRange","lowerWickToRange","closeLocationInRange"];
    if(!req.every(k=>Number.isFinite(f[k])))return {status:"D0102_GEOMETRY_INCOMPLETE"};
    if(r.informationRoot!=="PRICE_OHLC")return {status:"D0102_ROOT_INVALID"};
  }
  if(r.moduleId==="D01-03"){
    if(!Array.isArray(f.orderedBarGeometry)||f.orderedBarGeometry.length!==r.requiredSourceBarIds?.length)return {status:"D0103_SEQUENCE_GEOMETRY_INCOMPLETE"};
    if(r.informationRoot!=="PRICE_OHLC")return {status:"D0103_ROOT_INVALID"};
  }
  if(r.moduleId==="D01-07"){
    if(r.retrospectiveBackpaint===true)return {status:"D0107_BACKPAINT_PROHIBITED"};
    if(!f.baseEpisodeId||!Number.isInteger(f.widthEligibleSessions)||f.widthEligibleSessions<=0)return {status:"D0107_BASE_GEOMETRY_INCOMPLETE"};
  }
  if(r.moduleId==="D01-09"){
    if(r.r5ContextPass!==true)return {status:"D0109_R5_CONTEXT_REQUIRED"};
    if(!Number.isFinite(f.priorEligibleClose)||!Number.isFinite(f.currentOpen)||!Number.isFinite(f.rawGap))return {status:"D0109_GAP_GEOMETRY_INCOMPLETE"};
  }
  return {status:"MODULE_FEATURE_SEMANTICS_VALID"};
}

export function classifyAliasFamily({moduleId,sourceBarIds=[],aliasLabels=[],baseEpisodeId=null,gapRootId=null}={}){
  if(!FIRST_WAVE.has(moduleId))return {status:"MODULE_OUTSIDE_FIRST_WAVE"};
  let root;
  if(moduleId==="D01-07") root=baseEpisodeId||null;
  else if(moduleId==="D01-09") root=gapRootId||null;
  else root=sourceBarIds.join("|")||null;
  if(!root)return {status:"ALIAS_ROOT_UNKNOWN"};
  return {
    status:"ALIAS_FAMILY_DEDUPED",
    redundancyGroup:root,
    rawAliasCount:new Set(aliasLabels.filter(Boolean)).size,
    effectiveIndependentEvidenceCount:1
  };
}

export function validateParentChildPair(parent={},child={}){
  const fields=["moduleId","market","symbol","targetDate","predictorFreezeAt","exactSessionHash","sourceHistoryHash","foldId","horizonSetId","universeVersion","blockedRowPolicyId"];
  const drift=fields.filter(k=>(parent[k]??null)!==(child[k]??null));
  if(drift.length)return {status:"PARENT_CHILD_IDENTITY_MISMATCH",drift};
  if(parent.role!=="COMMON_PARENT"||child.role!=="NAMED_CHILD")return {status:"PARENT_CHILD_ROLE_INVALID"};
  return {status:"PARENT_CHILD_COMPARISON_ELIGIBLE"};
}

export function validateComparatorFamily({moduleId,parentType}={}){
  const expected={
    "D01-02":"CONTINUOUS_SINGLE_BAR_OHLC_GEOMETRY",
    "D01-03":"ORDERED_N_BAR_OHLC_GEOMETRY",
    "D01-07":"PRIOR_TREND_COMPRESSION_GENERIC_BREAKOUT",
    "D01-09":"RAW_GAP_PLUS_LEGAL_LIMIT_CONTEXT"
  };
  return {status:expected[moduleId]===parentType?"COMMON_PARENT_VALID":"COMMON_PARENT_MISMATCH"};
}

export function validateLedgerRow(r={}){
  if(!r.experimentId||!r.moduleId||!r.universeVersion||!r.foldId||!r.predictorDate||!r.opportunityId)return {status:"LEDGER_IDENTITY_INCOMPLETE"};
  if(!LEDGER_STATES.has(r.state))return {status:"LEDGER_STATE_INVALID"};
  if(!r.informationRoot||!r.redundancyGroup)return {status:"LEDGER_DEPENDENCY_IDENTITY_INCOMPLETE"};
  return {status:"LEDGER_ROW_VALID"};
}

export function aggregateLedger(rows=[]){
  const seen=new Set();
  const counts={UPSTREAM_DATA_BLOCKED:0,R7_DATA_BLOCKED:0,NO_STRUCTURE:0,STRUCTURE_EMITTED:0};
  let duplicates=0;
  for(const r of rows){
    const key=[r.experimentId,r.moduleId,r.universeVersion,r.foldId,r.predictorDate,r.opportunityId].join("|");
    if(seen.has(key)){duplicates++;continue;}
    seen.add(key);
    if(LEDGER_STATES.has(r.state))counts[r.state]++;
  }
  return {status:duplicates?"DUPLICATE_OPPORTUNITY_DETECTED":"DENOMINATOR_ACCOUNTED",uniqueOpportunityCount:seen.size,duplicates,counts};
}
