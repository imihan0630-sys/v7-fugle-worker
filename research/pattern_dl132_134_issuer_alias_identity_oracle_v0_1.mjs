// D01 DL-132~134 issuer-alias / symbol-collision / R1-R7 binding oracle v0.1

const SAME_SECURITY_RELATIONS=new Set([
  "SAME_SECURITY_SAME_ISSUER_NAME_CHANGE",
  "SAME_SECURITY_ISSUER_LEGAL_NAME_CHANGE_PROVEN",
  "SAME_SECURITY_CODE_AND_NAME_CHANGE_PROVEN"
]);

export function classifyNameAliasTransition(r={}){
  if(!r.securityIdentityBefore||!r.securityIdentityAfter)return {status:"IDENTITY_UNKNOWN_BLOCKED"};
  if(r.securityIdentityBefore!==r.securityIdentityAfter){
    if(r.normalizedNameBefore&&r.normalizedNameBefore===r.normalizedNameAfter)
      return {status:"DIFFERENT_SECURITY_SIMILAR_NAME"};
    return {status:"SECURITY_IDENTITY_CHANGED"};
  }
  if(r.issuerIdentityBefore&&r.issuerIdentityAfter&&r.issuerIdentityBefore!==r.issuerIdentityAfter)
    return {status:"ISSUER_IDENTITY_CHANGE_SECURITY_UNCHANGED_UNKNOWN"};
  if(r.symbolBefore!==r.symbolAfter && r.nameBefore!==r.nameAfter)
    return {status:"SAME_SECURITY_CODE_AND_NAME_CHANGE_PROVEN"};
  if(r.nameBefore!==r.nameAfter)
    return {status:"SAME_SECURITY_SAME_ISSUER_NAME_CHANGE"};
  return {status:"NO_NAME_IDENTITY_CHANGE"};
}

export function validateNameNormalizationEvidence({normalizedNameEqual,securityIdentityEqual,issuerIdentityEqual}={}){
  if(normalizedNameEqual!==true)return {status:"NO_NORMALIZED_NAME_MATCH"};
  if(securityIdentityEqual===true)return {status:"NAME_MATCH_WITH_SECURITY_IDENTITY_PROVEN"};
  if(issuerIdentityEqual===true)return {status:"NAME_MATCH_WITH_ISSUER_ONLY_NOT_SECURITY"};
  return {status:"FUZZY_NAME_MATCH_NOT_IDENTITY_PROOF"};
}

export function validateHistoricalNameReceipt(r={}){
  const required=["aliasReceiptId","securityIdentity","market","symbol","membershipIntervalId","historicalDisplayName","aliasRelation","effectiveFrom","firstObservableAt","sourceHash"];
  const missing=required.filter(k=>!r[k]);
  if(missing.length)return {status:"ALIAS_RECEIPT_INCOMPLETE",missing};
  if(r.firstObservableAt>r.predictorFreezeAt)return {status:"ALIAS_LOOKAHEAD"};
  if(r.currentDisplayNameUsedAsHistorical===true)return {status:"CURRENT_NAME_BACKFILL_PROHIBITED"};
  return {status:"ALIAS_RECEIPT_PIT_VALID",missing:[]};
}

export function classifyCodeCollision(a={},b={}){
  if(!a.market||!a.symbol||!a.securityIdentity||!a.membershipStart||!a.membershipEndExclusive) return {status:"COLLISION_INPUT_INCOMPLETE"};
  if(!b.market||!b.symbol||!b.securityIdentity||!b.membershipStart||!b.membershipEndExclusive) return {status:"COLLISION_INPUT_INCOMPLETE"};
  if(a.symbol!==b.symbol)return {status:"NO_SYMBOL_COLLISION"};
  if(a.market!==b.market){
    if(a.securityIdentity===b.securityIdentity && a.sameSecurityMigrationProven===true && b.sameSecurityMigrationProven===true)
      return {status:"SAME_SECURITY_CROSS_MARKET_MIGRATION_PROVEN"};
    return {status:"CROSS_MARKET_SAME_SYMBOL_DIFFERENT_OR_UNPROVEN_SECURITY"};
  }
  if(a.securityIdentity===b.securityIdentity)return {status:"SAME_SECURITY_SYMBOL_VERSION"};
  const overlap=a.membershipStart<b.membershipEndExclusive && b.membershipStart<a.membershipEndExclusive;
  if(overlap)return {status:"CONCURRENT_CODE_COLLISION_DATA_CONFLICT"};
  return {status:"SAME_MARKET_SYMBOL_REUSED_DIFFERENT_SECURITY"};
}

export function validateSameIssuerDifferentSecurity({issuerIdentityEqual,securityIdentityEqual}={}){
  if(securityIdentityEqual===true)return {status:"SAME_SECURITY"};
  if(issuerIdentityEqual===true)return {status:"SAME_ISSUER_DIFFERENT_SECURITY_NO_STITCH"};
  return {status:"DIFFERENT_ISSUER_SECURITY"};
}

export function validateR1Identity(r={}){
  const required=["r1IdentityReceiptId","securityIdentity","membershipIntervalId","marketSymbolVersionId","market","symbol","membershipStateAtDate","identityCoverageState","sourceHash","firstObservableAt"];
  const missing=required.filter(k=>!r[k]);
  if(missing.length)return {status:"R1_IDENTITY_INCOMPLETE",missing};
  if(r.overlappingDifferentSecurityConflict===true)return {status:"R1_CODE_COLLISION_BLOCKED",missing:[]};
  if(r.identityRelation==="IDENTITY_EQUIVALENCE_UNKNOWN")return {status:"R1_IDENTITY_UNKNOWN_BLOCKED",missing:[]};
  if(r.replaySafe!==true)return {status:"R1_NOT_REPLAY_SAFE",missing:[]};
  return {status:"R1_IDENTITY_VALID",missing:[]};
}

export function classifyAliasBlocking({securityIdentityProven,aliasNeededForIdentityDecision,historicalNameKnown}={}){
  if(securityIdentityProven!==true)return {status:"IDENTITY_CRITICAL_ALIAS_BLOCKED"};
  if(aliasNeededForIdentityDecision===true && historicalNameKnown!==true)return {status:"IDENTITY_CRITICAL_ALIAS_BLOCKED"};
  if(historicalNameKnown!==true)return {status:"ALIAS_METADATA_UNKNOWN_NONBLOCKING"};
  return {status:"ALIAS_READY"};
}

export function validateR7IdentityBinding(r={}){
  const required=["r1IdentityReceiptId","r1IdentityReceiptHash","securityIdentity","membershipIntervalId","marketSymbolVersionId","market","symbol","targetDate","exactSessionHash","sourceHistoryHash","detectorFamilyId","detectorVersion","episodeId","predictorFreezeAt","firstObservableAt"];
  const missing=required.filter(k=>!r[k]);
  if(missing.length)return {status:"R7_IDENTITY_BINDING_INCOMPLETE",missing};
  if(r.firstObservableAt>r.predictorFreezeAt)return {status:"R7_IDENTITY_LOOKAHEAD",missing:[]};
  if(r.identityRelationChangedToDifferentSecurity===true)return {status:"R7_IDENTITY_REPLAY_REQUIRED",missing:[]};
  return {status:"R7_IDENTITY_BINDING_VALID",missing:[]};
}

export function validatePureRenameFeatureIdentity(before={},after={}){
  const critical=["securityIdentity","membershipIntervalId","exactSessionHash","sourceHistoryHash","episodeId","deterministicFeatureHash"];
  const drift=critical.filter(k=>(before[k]??null)!==(after[k]??null));
  if(drift.length)return {status:"NOT_PURE_RENAME_REPLAY_OR_IDENTITY_CHANGED",drift};
  const nameChanged=(before.historicalDisplayName??null)!==(after.historicalDisplayName??null) ||
                    (before.currentDisplayName??null)!==(after.currentDisplayName??null);
  return {status:nameChanged?"PURE_RENAME_FEATURE_IDENTITY_STABLE":"NO_RENAME_CHANGE",drift:[]};
}

export function validateOpportunityKey(r={}){
  const required=["securityIdentity","membershipIntervalId","detectorFamilyId","episodeId","predictorFreezeAt","exactSessionHash","sourceHistoryHash"];
  const missing=required.filter(k=>!r[k]);
  if(missing.length)return {status:"OPPORTUNITY_KEY_INCOMPLETE",missing};
  if(r.displayNameIncludedInDurableKey===true)return {status:"DISPLAY_NAME_IN_DURABLE_KEY_PROHIBITED",missing:[]};
  return {status:"DURABLE_OPPORTUNITY_KEY_VALID",missing:[]};
}

export function validateParentChildIdentitySupport(parent={},child={}){
  const critical=["securityIdentity","membershipIntervalId","exactSessionHash","sourceHistoryHash","predictorFreezeAt","detectorSearchFamilyId","denominatorPolicyId"];
  const drift=critical.filter(k=>(parent[k]??null)!==(child[k]??null));
  if(drift.length)return {status:"PARENT_CHILD_SECURITY_SUPPORT_MISMATCH",drift};
  return {status:"PARENT_CHILD_SECURITY_SUPPORT_VALID",drift:[]};
}
