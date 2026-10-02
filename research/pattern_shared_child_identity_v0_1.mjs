// Pattern shared-parent child identity helper v0.1
// Class A research-only. No persistence. No outcome input.

function reqString(v,name){
  if(typeof v!=="string" || !v.trim()) throw new Error("MISSING_"+name);
  return v.trim();
}
function sortedStrings(xs,name){
  if(!Array.isArray(xs) || xs.length===0) throw new Error("MISSING_"+name);
  const out=xs.map((x,i)=>reqString(x,`${name}_${i}`));
  if(new Set(out).size!==out.length) throw new Error("DUPLICATE_"+name);
  return [...out];
}
function canonicalTuple(parts){
  return parts.map(x=>encodeURIComponent(String(x))).join("|");
}

export function patternRootItemKey(){ return "ROOT"; }

export function structuralEpisodeKey(input={}){
  const symbol=reqString(input.symbol,"SYMBOL");
  const semantic=reqString(input.semanticSpaceId,"SEMANTIC_SPACE");
  const detector=reqString(input.detectorFamilyVersion,"DETECTOR_FAMILY_VERSION");
  const family=reqString(input.latentFamily,"LATENT_FAMILY");
  const scale=reqString(input.scale,"SCALE");
  const confirmed=reqString(input.initialConfirmedAt,"INITIAL_CONFIRMED_AT");
  const anchors=sortedStrings(input.orderedConfirmedAnchorIds,"ANCHORS");
  return "PATTERN_EPISODE|"+canonicalTuple([symbol,semantic,detector,family,scale,anchors.join(">"),confirmed]);
}

export function rg2RelationKey(input={}){
  return "PATTERN_RG2_RELATION|"+canonicalTuple([
    reqString(input.symbol,"SYMBOL"),
    reqString(input.semanticSpaceId,"SEMANTIC_SPACE"),
    reqString(input.relationDefinitionVersion,"RELATION_DEFINITION_VERSION"),
    reqString(input.localBoundaryId,"LOCAL_BOUNDARY_ID"),
    reqString(input.localBoundaryVersion,"LOCAL_BOUNDARY_VERSION"),
    reqString(input.parentZoneId,"PARENT_ZONE_ID"),
    reqString(input.parentZoneVersion,"PARENT_ZONE_VERSION")
  ]);
}

export function compareImmutablePayload(existing,next,identityFields=[]){
  const changed=[];
  for(const field of identityFields){
    const a=JSON.stringify(existing?.[field]??null);
    const b=JSON.stringify(next?.[field]??null);
    if(a!==b) changed.push(field);
  }
  return changed.length
    ? {status:"PROVENANCE_CONFLICT",changedFields:changed}
    : {status:"SAME_IMMUTABLE_IDENTITY"};
}

export function validatePatternChildIdentity(child={}){
  const required=[
    "parentDecisionReceiptId","captureGeneration","parentScopeId",
    "evidenceItemKey","observerVersion","asOf"
  ];
  const missing=required.filter(k=>typeof child[k]!=="string" || !child[k].trim());
  if(missing.length) return {status:"UNKNOWN",reason:"IDENTITY_INCOMPLETE",missing};
  if(child.evidenceFamily!=="PATTERN") return {status:"DATA_BLOCKED",reason:"WRONG_EVIDENCE_FAMILY"};
  if(child.outcome!==undefined) return {status:"DATA_BLOCKED",reason:"OUTCOME_IN_DECISION_TIME_CHILD"};
  return {status:"VALID"};
}
