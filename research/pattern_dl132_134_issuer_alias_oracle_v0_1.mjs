// D01 DL-132~134 issuer alias / same-code collision oracle v0.1

export function validateAliasNormalization(r={}){
  if(r.fuzzyMatchUsed===true||r.editDistanceUsed===true||r.brandStemOnly===true)
    return {status:"FUZZY_ALIAS_STITCH_PROHIBITED"};
  if(r.canonicalSecurityIdentity){
    return {status:"ALIAS_NORMALIZATION_SUPPORT_ONLY"};
  }
  if(r.exactAliasIntersection===true && r.sameSymbol===true && r.authoritativeIssuerLink===true)
    return {status:"ALIAS_SUPPORTS_IDENTITY_RESOLUTION"};
  return {status:"IDENTITY_EQUIVALENCE_UNKNOWN"};
}

export function classifyNameChange(r={}){
  if(r.securityIdentityChanged===true||r.issuerIdentityChanged===true)
    return {status:"NAME_COLLISION_DISTINCT_SECURITY"};
  if(r.securityIdentitySame===true && r.issuerIdentitySame===true &&
     r.membershipContinuous===true && r.successorEvent===false &&
     (r.unitSemanticsCompatible===true||r.unitTransformCertified===true))
    return {status:"SAME_SECURITY_NAME_ALIAS_CHANGE"};
  return {status:"IDENTITY_EQUIVALENCE_UNKNOWN"};
}

export function classifySameCodeCollision(a={},b={}){
  if(a.market!==b.market||a.symbol!==b.symbol)return {status:"NOT_A_SAME_CODE_CASE"};
  if(a.securityIdentity&&b.securityIdentity&&a.securityIdentity===b.securityIdentity)
    return {status:"SAME_CODE_SAME_SECURITY"};
  if(a.securityIdentity&&b.securityIdentity&&a.securityIdentity!==b.securityIdentity)
    return {status:"SAME_CODE_DIFFERENT_SECURITY"};
  if(a.issuerIdentity&&b.issuerIdentity&&a.issuerIdentity!==b.issuerIdentity)
    return {status:"SAME_CODE_DIFFERENT_SECURITY"};
  return {status:"IDENTITY_EQUIVALENCE_UNKNOWN"};
}

export function validateMembershipCollision(r={}){
  if(r.overlapSameMarketSymbolDifferentIdentity===true)
    return {status:"IDENTITY_BOUNDARY_CONFLICT"};
  if(r.currentIssuerBackfilledIntoPriorInterval===true)
    return {status:"CURRENT_ISSUER_BACKFILL_PROHIBITED"};
  if(r.codeReuseAfterDelisting===true && r.oldSecurityIdentity!==r.newSecurityIdentity)
    return {status:"CODE_REUSE_NEW_LINEAGE_REQUIRED"};
  return {status:"MEMBERSHIP_COLLISION_CLEAR"};
}

export function validateAliasTimelineRow(r={}){
  const required=["securityIdentity","aliasType","aliasValue","effectiveFrom","sourceId","sourceHash","observedAt"];
  const missing=required.filter(k=>!r[k]);
  if(missing.length)return {status:"ALIAS_TIMELINE_ROW_INCOMPLETE",missing};
  return {status:"ALIAS_TIMELINE_ROW_VALID",missing:[]};
}

export function classifyAliasRevision(oldR={},newR={}){
  const identitySame=
    oldR.securityIdentity===newR.securityIdentity &&
    oldR.issuerIdentity===newR.issuerIdentity &&
    oldR.membershipIntervalId===newR.membershipIntervalId;
  if(identitySame &&
     oldR.exactSessionHash===newR.exactSessionHash &&
     oldR.sourceHistoryHash===newR.sourceHistoryHash &&
     oldR.canonicalGeometryHash===newR.canonicalGeometryHash)
    return {status:"ALIAS_METADATA_ONLY"};
  if(oldR.securityIdentity!==newR.securityIdentity ||
     oldR.issuerIdentity!==newR.issuerIdentity ||
     oldR.membershipIntervalId!==newR.membershipIntervalId)
    return {status:"IDENTITY_REMAP_REQUIRED"};
  return {status:"NON_ALIAS_PROVENANCE_CHANGE"};
}

export function validateR1R7IdentityBinding(r1={},r7={}){
  const fields=["securityIdentity","membershipIntervalId","identityResolutionState","aliasTimelineVersion"];
  const drift=fields.filter(k=>(r1[k]??null)!==(r7[k]??null));
  return {status:drift.length?"R1_R7_IDENTITY_VERSION_MISMATCH":"R1_R7_IDENTITY_VERSION_VALID",drift};
}

export function validateParentChildIdentity(parent={},child={}){
  const fields=["securityIdentity","membershipIntervalId","identityResolutionState","aliasTimelineVersion"];
  const drift=fields.filter(k=>(parent[k]??null)!==(child[k]??null));
  return {status:drift.length?"PARENT_CHILD_IDENTITY_SUPPORT_MISMATCH":"PARENT_CHILD_IDENTITY_SUPPORT_VALID",drift};
}

export function validateAliasMetadataNotAlpha(r={}){
  if(r.aliasCountUsedAsVote===true||r.aliasCountUsedAsScore===true||r.aliasStringUsedAsInformationRoot===true)
    return {status:"ALIAS_METADATA_ALPHA_OVERCLAIM"};
  return {status:"ALIAS_METADATA_NON_ALPHA_VALID"};
}
