import assert from "node:assert/strict";
import {
  classifyNameAliasTransition,validateNameNormalizationEvidence,validateHistoricalNameReceipt,
  classifyCodeCollision,validateSameIssuerDifferentSecurity,validateR1Identity,
  classifyAliasBlocking,validateR7IdentityBinding,validatePureRenameFeatureIdentity,
  validateOpportunityKey,validateParentChildIdentitySupport
} from "./pattern_dl132_134_issuer_alias_identity_oracle_v0_1.mjs";

let p=0;const t=(n,f)=>{f();p++;console.log("PASS",n);};
const h="a".repeat(64);

t("D13201 pure rename preserves security identity",()=>assert.equal(classifyNameAliasTransition({securityIdentityBefore:"SEC1",securityIdentityAfter:"SEC1",issuerIdentityBefore:"ISS1",issuerIdentityAfter:"ISS1",symbolBefore:"1234",symbolAfter:"1234",nameBefore:"OLD",nameAfter:"NEW"}).status,"SAME_SECURITY_SAME_ISSUER_NAME_CHANGE"));
t("D13202 code and name change on same security stays same security class",()=>assert.equal(classifyNameAliasTransition({securityIdentityBefore:"SEC1",securityIdentityAfter:"SEC1",issuerIdentityBefore:"ISS1",issuerIdentityAfter:"ISS1",symbolBefore:"1234",symbolAfter:"5678",nameBefore:"OLD",nameAfter:"NEW"}).status,"SAME_SECURITY_CODE_AND_NAME_CHANGE_PROVEN"));
t("D13203 same normalized name different security is not identity proof",()=>assert.equal(classifyNameAliasTransition({securityIdentityBefore:"SEC1",securityIdentityAfter:"SEC2",normalizedNameBefore:"ABC",normalizedNameAfter:"ABC"}).status,"DIFFERENT_SECURITY_SIMILAR_NAME"));
t("D13204 fuzzy name alone does not prove identity",()=>assert.equal(validateNameNormalizationEvidence({normalizedNameEqual:true,securityIdentityEqual:false,issuerIdentityEqual:false}).status,"FUZZY_NAME_MATCH_NOT_IDENTITY_PROOF"));
t("D13205 same issuer alone still does not prove same security",()=>assert.equal(validateNameNormalizationEvidence({normalizedNameEqual:true,securityIdentityEqual:false,issuerIdentityEqual:true}).status,"NAME_MATCH_WITH_ISSUER_ONLY_NOT_SECURITY"));
t("D13206 current name cannot backfill historical name",()=>assert.equal(validateHistoricalNameReceipt({aliasReceiptId:"A1",securityIdentity:"SEC1",market:"TWSE",symbol:"1234",membershipIntervalId:"M1",historicalDisplayName:"OLD",aliasRelation:"CANONICAL_NAME_AT_DATE",effectiveFrom:"2020-01-01",firstObservableAt:"2020-01-01",predictorFreezeAt:"2021-01-01",sourceHash:h,currentDisplayNameUsedAsHistorical:true}).status,"CURRENT_NAME_BACKFILL_PROHIBITED"));
t("D13207 PIT-valid historical alias receipt passes",()=>assert.equal(validateHistoricalNameReceipt({aliasReceiptId:"A1",securityIdentity:"SEC1",market:"TWSE",symbol:"1234",membershipIntervalId:"M1",historicalDisplayName:"OLD",aliasRelation:"CANONICAL_NAME_AT_DATE",effectiveFrom:"2020-01-01",firstObservableAt:"2020-01-01",predictorFreezeAt:"2021-01-01",sourceHash:h,currentDisplayNameUsedAsHistorical:false}).status,"ALIAS_RECEIPT_PIT_VALID"));

const a={market:"TWSE",symbol:"1234",securityIdentity:"SEC1",membershipStart:"2010-01-01",membershipEndExclusive:"2015-01-01"};
const b={market:"TWSE",symbol:"1234",securityIdentity:"SEC2",membershipStart:"2020-01-01",membershipEndExclusive:"2025-01-01"};
t("D13301 non-overlap same-code reuse is different security",()=>assert.equal(classifyCodeCollision(a,b).status,"SAME_MARKET_SYMBOL_REUSED_DIFFERENT_SECURITY"));
t("D13302 overlapping same-code different security blocks R1",()=>assert.equal(classifyCodeCollision(a,{...b,membershipStart:"2014-01-01"}).status,"CONCURRENT_CODE_COLLISION_DATA_CONFLICT"));
t("D13303 same symbol across markets is not same security by default",()=>assert.equal(classifyCodeCollision(a,{...a,market:"TPEX",securityIdentity:"SEC9"}).status,"CROSS_MARKET_SAME_SYMBOL_DIFFERENT_OR_UNPROVEN_SECURITY"));
t("D13304 proven same-security migration can relate cross-market rows",()=>assert.equal(classifyCodeCollision({...a,sameSecurityMigrationProven:true},{...a,market:"TPEX",membershipStart:"2015-01-01",membershipEndExclusive:"2020-01-01",sameSecurityMigrationProven:true}).status,"SAME_SECURITY_CROSS_MARKET_MIGRATION_PROVEN"));
t("D13305 same issuer different security never stitches",()=>assert.equal(validateSameIssuerDifferentSecurity({issuerIdentityEqual:true,securityIdentityEqual:false}).status,"SAME_ISSUER_DIFFERENT_SECURITY_NO_STITCH"));

const r1={r1IdentityReceiptId:"R1",securityIdentity:"SEC1",membershipIntervalId:"M1",marketSymbolVersionId:"MS1",market:"TWSE",symbol:"1234",membershipStateAtDate:"IN_SCOPE",identityCoverageState:"COMPLETE",sourceHash:h,firstObservableAt:"2021-01-01",replaySafe:true,identityRelation:"SAME_SECURITY"};
t("D13401 clean R1 identity passes",()=>assert.equal(validateR1Identity(r1).status,"R1_IDENTITY_VALID"));
t("D13402 overlapping code collision blocks R1",()=>assert.equal(validateR1Identity({...r1,overlappingDifferentSecurityConflict:true}).status,"R1_CODE_COLLISION_BLOCKED"));
t("D13403 unknown identity relation blocks R1",()=>assert.equal(validateR1Identity({...r1,identityRelation:"IDENTITY_EQUIVALENCE_UNKNOWN"}).status,"R1_IDENTITY_UNKNOWN_BLOCKED"));
t("D13404 historical name unknown can be nonblocking after security identity is proven",()=>assert.equal(classifyAliasBlocking({securityIdentityProven:true,aliasNeededForIdentityDecision:false,historicalNameKnown:false}).status,"ALIAS_METADATA_UNKNOWN_NONBLOCKING"));
t("D13405 missing alias blocks when alias is needed for identity decision",()=>assert.equal(classifyAliasBlocking({securityIdentityProven:true,aliasNeededForIdentityDecision:true,historicalNameKnown:false}).status,"IDENTITY_CRITICAL_ALIAS_BLOCKED"));

const r7={r1IdentityReceiptId:"R1",r1IdentityReceiptHash:h,securityIdentity:"SEC1",membershipIntervalId:"M1",marketSymbolVersionId:"MS1",market:"TWSE",symbol:"1234",targetDate:"2021-01-04",exactSessionHash:h,sourceHistoryHash:h,detectorFamilyId:"D01-02",detectorVersion:"v1",episodeId:"E1",predictorFreezeAt:"2021-01-04T14:30:00+08:00",firstObservableAt:"2021-01-04T14:30:00+08:00"};
t("D13406 R7 identity binding passes",()=>assert.equal(validateR7IdentityBinding(r7).status,"R7_IDENTITY_BINDING_VALID"));
t("D13407 corrected identity relation to different security forces replay",()=>assert.equal(validateR7IdentityBinding({...r7,identityRelationChangedToDifferentSecurity:true}).status,"R7_IDENTITY_REPLAY_REQUIRED"));

const before={securityIdentity:"SEC1",membershipIntervalId:"M1",exactSessionHash:h,sourceHistoryHash:h,episodeId:"E1",deterministicFeatureHash:h,historicalDisplayName:"OLD",currentDisplayName:"NEW"};
t("D13408 pure rename leaves feature identity stable",()=>assert.equal(validatePureRenameFeatureIdentity(before,{...before,historicalDisplayName:"OLD2",currentDisplayName:"NEW2"}).status,"PURE_RENAME_FEATURE_IDENTITY_STABLE"));
t("D13409 security identity change is not pure rename",()=>assert.equal(validatePureRenameFeatureIdentity(before,{...before,securityIdentity:"SEC2",historicalDisplayName:"NEW"}).status,"NOT_PURE_RENAME_REPLAY_OR_IDENTITY_CHANGED"));

const key={securityIdentity:"SEC1",membershipIntervalId:"M1",detectorFamilyId:"D01-02",episodeId:"E1",predictorFreezeAt:"t",exactSessionHash:h,sourceHistoryHash:h};
t("D13410 durable opportunity key excludes display name",()=>assert.equal(validateOpportunityKey({...key,displayNameIncludedInDurableKey:false}).status,"DURABLE_OPPORTUNITY_KEY_VALID"));
t("D13411 putting display name in durable key is prohibited",()=>assert.equal(validateOpportunityKey({...key,displayNameIncludedInDurableKey:true}).status,"DISPLAY_NAME_IN_DURABLE_KEY_PROHIBITED"));

const pair={securityIdentity:"SEC1",membershipIntervalId:"M1",exactSessionHash:h,sourceHistoryHash:h,predictorFreezeAt:"t",detectorSearchFamilyId:"F1",denominatorPolicyId:"D1"};
t("D13412 parent child same security support passes despite display labels",()=>assert.equal(validateParentChildIdentitySupport({...pair,historicalDisplayName:"OLD"},{...pair,historicalDisplayName:"NEW"}).status,"PARENT_CHILD_SECURITY_SUPPORT_VALID"));
t("D13413 different security breaks parent child pairing",()=>assert.equal(validateParentChildIdentitySupport(pair,{...pair,securityIdentity:"SEC2"}).status,"PARENT_CHILD_SECURITY_SUPPORT_MISMATCH"));

console.log(`SUMMARY ${p}/25 PASS`);
