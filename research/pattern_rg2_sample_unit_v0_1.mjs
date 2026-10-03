// PATTERN-RG2 sample-unit and dependence helper v0.1
// Class A research-only. Outcome-blind. No runtime/Formal dependency.

function s(v){ return typeof v==="string" ? v.trim() : ""; }

export function classifyParentRg2Relations(input={}) {
  const parentDecisionReceiptId=s(input.parentDecisionReceiptId);
  const scanDate=s(input.scanDate);
  const symbol=s(input.symbol);
  const relations=Array.isArray(input.relations)?input.relations:[];

  const missing=[];
  if(!parentDecisionReceiptId) missing.push("parentDecisionReceiptId");
  if(!scanDate) missing.push("scanDate");
  if(!symbol) missing.push("symbol");
  if(missing.length) return {status:"UNKNOWN",reason:"PARENT_IDENTITY_INCOMPLETE",missing};

  const seen=new Map();
  for(const r of relations){
    const key=s(r?.relationEpisodeKey);
    if(!key) return {status:"DATA_BLOCKED",reason:"RELATION_KEY_MISSING"};
    if(seen.has(key)) {
      const prior=seen.get(key);
      const a=s(prior?.structuralIdentityFingerprint);
      const b=s(r?.structuralIdentityFingerprint);
      return {
        status:a&&b&&a!==b?"PROVENANCE_CONFLICT":"QA_FAIL_DUPLICATE_RELATION",
        reason:a&&b&&a!==b?"SAME_RELATION_KEY_DIFFERENT_STRUCTURAL_FINGERPRINT":"DUPLICATE_RELATION_KEY",
        relationEpisodeKey:key
      };
    }
    seen.set(key,r);
  }

  if(relations.length===0) return {
    status:"VALID",multiplicityStatus:"NO_RG2_RELATION",primaryInferenceEligible:false,
    parentDecisionReceiptId,scanDate,symbol,uniqueRelationCount:0
  };
  if(relations.length===1) return {
    status:"VALID",multiplicityStatus:"SINGLE_RELATION_ELIGIBLE",primaryInferenceEligible:true,
    parentDecisionReceiptId,scanDate,symbol,uniqueRelationCount:1,
    relationEpisodeKey:s(relations[0].relationEpisodeKey)
  };
  return {
    status:"VALID",multiplicityStatus:"MULTI_RELATION_AMBIGUOUS",primaryInferenceEligible:false,
    parentDecisionReceiptId,scanDate,symbol,uniqueRelationCount:relations.length,
    relationEpisodeKeys:[...seen.keys()].sort()
  };
}

export function classifyRg2CommonSupport(input={}) {
  const blockers=[];
  if(input.parentCertified!==true) blockers.push("PARENT_NOT_CERTIFIED");
  if(input.rootRunComplete!==true) blockers.push("PATTERN_ROOT_RUN_INCOMPLETE");
  if(input.multiplicityStatus!=="SINGLE_RELATION_ELIGIBLE") blockers.push("NOT_SINGLE_RELATION_ELIGIBLE");
  if(input.b0Complete!==true) blockers.push("B0_INCOMPLETE");
  if(input.b1Complete!==true) blockers.push("B1_INCOMPLETE");
  if(input.outcomeProvenanceValid!==true) blockers.push("OUTCOME_PROVENANCE_INVALID");
  if(input.laterVintageSubstitution===true) blockers.push("LATER_VINTAGE_SUBSTITUTION");
  if(input.unknownCoercedToZero===true) blockers.push("UNKNOWN_COERCED_TO_ZERO");
  return blockers.length
    ? {status:"NOT_COMMON_SUPPORT",blockers}
    : {status:"COMMON_SUPPORT_ELIGIBLE",blockers:[]};
}

export function buildRg2DependenceIdentity(row={}) {
  const scanDate=s(row.scanDate), symbol=s(row.symbol), relationEpisodeKey=s(row.relationEpisodeKey);
  if(!scanDate||!symbol||!relationEpisodeKey) {
    return {status:"UNKNOWN",reason:"DEPENDENCE_IDENTITY_INCOMPLETE"};
  }
  return {
    status:"VALID",
    dateClusterKey:scanDate,
    symbolClusterKey:symbol,
    relationEpisodeKey
  };
}

function rowOrder(a,b){
  return String(a.scanDate||"").localeCompare(String(b.scanDate||"")) ||
    String(a.asOf||"").localeCompare(String(b.asOf||"")) ||
    String(a.parentDecisionReceiptId||"").localeCompare(String(b.parentDecisionReceiptId||""));
}

export function selectFirstEligibleObservationPerEpisode(rows=[]) {
  const eligible=(rows||[]).filter(r=>r?.commonSupportStatus==="COMMON_SUPPORT_ELIGIBLE" && s(r.relationEpisodeKey));
  eligible.sort(rowOrder);
  const first=new Map();
  for(const r of eligible) if(!first.has(r.relationEpisodeKey)) first.set(r.relationEpisodeKey,r);
  return [...first.values()].sort(rowOrder);
}

export function findEpisodeOverlap(trainRows=[],holdoutRows=[]) {
  const train=new Set((trainRows||[]).map(r=>s(r.relationEpisodeKey)).filter(Boolean));
  const hold=new Set((holdoutRows||[]).map(r=>s(r.relationEpisodeKey)).filter(Boolean));
  return [...hold].filter(k=>train.has(k)).sort();
}

export function purgeTrainingEpisodesSeenInHoldout(trainRows=[],holdoutRows=[]) {
  const overlap=new Set(findEpisodeOverlap(trainRows,holdoutRows));
  return {
    overlapEpisodeKeys:[...overlap].sort(),
    kept:(trainRows||[]).filter(r=>!overlap.has(s(r.relationEpisodeKey))),
    purged:(trainRows||[]).filter(r=>overlap.has(s(r.relationEpisodeKey)))
  };
}

export function buildEqualDateWeights(rows=[]) {
  const eligible=(rows||[]).filter(r=>s(r.scanDate));
  const byDate=new Map();
  for(const r of eligible){
    const d=s(r.scanDate);
    if(!byDate.has(d)) byDate.set(d,[]);
    byDate.get(d).push(r);
  }
  const dates=[...byDate.keys()].sort();
  const D=dates.length;
  if(!D) return [];
  const out=[];
  for(const d of dates){
    const g=byDate.get(d), n=g.length;
    for(const r of g) out.push({...r,dateBalancedWeight:1/(D*n)});
  }
  return out;
}

export function summarizeDateWeights(weightedRows=[]) {
  const sums=new Map();
  for(const r of weightedRows||[]){
    const d=s(r.scanDate);
    sums.set(d,(sums.get(d)||0)+Number(r.dateBalancedWeight||0));
  }
  return [...sums.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([scanDate,totalWeight])=>({scanDate,totalWeight}));
}
