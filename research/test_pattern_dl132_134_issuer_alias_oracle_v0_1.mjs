import assert from "node:assert/strict";
import {
  validateAliasNormalization,classifyNameChange,classifySameCodeCollision,
  validateMembershipCollision,validateAliasTimelineRow,classifyAliasRevision,
  validateR1R7IdentityBinding,validateParentChildIdentity,validateAliasMetadataNotAlpha
} from "./pattern_dl132_134_issuer_alias_oracle_v0_1.mjs";

let p=0;const t=(n,f)=>{f();p++;console.log("PASS",n);};
const h="a".repeat(64);

t("D13201 canonical identity makes alias normalization supporting only",()=>assert.equal(validateAliasNormalization({canonicalSecurityIdentity:"SEC1"}).status,"ALIAS_NORMALIZATION_SUPPORT_ONLY"));
t("D13202 fuzzy matching cannot stitch history",()=>assert.equal(validateAliasNormalization({fuzzyMatchUsed:true}).status,"FUZZY_ALIAS_STITCH_PROHIBITED"));
t("D13203 edit distance cannot stitch history",()=>assert.equal(validateAliasNormalization({editDistanceUsed:true}).status,"FUZZY_ALIAS_STITCH_PROHIBITED"));
t("D13204 exact alias intersection may support resolution with issuer authority",()=>assert.equal(validateAliasNormalization({exactAliasIntersection:true,sameSymbol:true,authoritativeIssuerLink:true}).status,"ALIAS_SUPPORTS_IDENTITY_RESOLUTION"));
t("D13205 alias similarity without authority remains unknown",()=>assert.equal(validateAliasNormalization({exactAliasIntersection:true,sameSymbol:true,authoritativeIssuerLink:false}).status,"IDENTITY_EQUIVALENCE_UNKNOWN"));

t("D13206 same-security company rename preserves lineage",()=>assert.equal(classifyNameChange({securityIdentitySame:true,issuerIdentitySame:true,membershipContinuous:true,successorEvent:false,unitSemanticsCompatible:true}).status,"SAME_SECURITY_NAME_ALIAS_CHANGE"));
t("D13207 changed security identity is distinct security",()=>assert.equal(classifyNameChange({securityIdentityChanged:true,issuerIdentityChanged:false}).status,"NAME_COLLISION_DISTINCT_SECURITY"));
t("D13208 changed issuer identity is distinct security",()=>assert.equal(classifyNameChange({securityIdentityChanged:false,issuerIdentityChanged:true}).status,"NAME_COLLISION_DISTINCT_SECURITY"));
t("D13209 same-name successor event without proof remains unknown",()=>assert.equal(classifyNameChange({securityIdentitySame:true,issuerIdentitySame:true,membershipContinuous:true,successorEvent:true,unitSemanticsCompatible:true}).status,"IDENTITY_EQUIVALENCE_UNKNOWN"));

const a={market:"TWSE",symbol:"1234",securityIdentity:"SEC1",issuerIdentity:"ISS1"};
t("D13301 same code same security is same identity",()=>assert.equal(classifySameCodeCollision(a,{...a}).status,"SAME_CODE_SAME_SECURITY"));
t("D13302 same code different security is collision",()=>assert.equal(classifySameCodeCollision(a,{...a,securityIdentity:"SEC2"}).status,"SAME_CODE_DIFFERENT_SECURITY"));
t("D13303 same code different issuer is collision",()=>assert.equal(classifySameCodeCollision({market:"TWSE",symbol:"1234",issuerIdentity:"ISS1"},{market:"TWSE",symbol:"1234",issuerIdentity:"ISS2"}).status,"SAME_CODE_DIFFERENT_SECURITY"));
t("D13304 different symbol is not same-code case",()=>assert.equal(classifySameCodeCollision(a,{...a,symbol:"5678"}).status,"NOT_A_SAME_CODE_CASE"));
t("D13305 identity unknown stays unknown",()=>assert.equal(classifySameCodeCollision({market:"TWSE",symbol:"1234"},{market:"TWSE",symbol:"1234"}).status,"IDENTITY_EQUIVALENCE_UNKNOWN"));

t("D13306 overlapping different identities fail closed",()=>assert.equal(validateMembershipCollision({overlapSameMarketSymbolDifferentIdentity:true}).status,"IDENTITY_BOUNDARY_CONFLICT"));
t("D13307 current issuer cannot backfill old interval",()=>assert.equal(validateMembershipCollision({currentIssuerBackfilledIntoPriorInterval:true}).status,"CURRENT_ISSUER_BACKFILL_PROHIBITED"));
t("D13308 code reuse after delisting starts new lineage",()=>assert.equal(validateMembershipCollision({codeReuseAfterDelisting:true,oldSecurityIdentity:"SEC1",newSecurityIdentity:"SEC2"}).status,"CODE_REUSE_NEW_LINEAGE_REQUIRED"));

t("D13401 alias timeline row requires source lineage",()=>assert.equal(validateAliasTimelineRow({securityIdentity:"SEC1",aliasType:"SHORT_NAME",aliasValue:"ABC",effectiveFrom:"2021-01-01",sourceId:"S1",sourceHash:h,observedAt:"2021-01-01T00:00:00+08:00"}).status,"ALIAS_TIMELINE_ROW_VALID"));
t("D13402 incomplete alias timeline blocked",()=>assert.equal(validateAliasTimelineRow({securityIdentity:"SEC1",aliasType:"SHORT_NAME"}).status,"ALIAS_TIMELINE_ROW_INCOMPLETE"));

const oldR={securityIdentity:"SEC1",issuerIdentity:"ISS1",membershipIntervalId:"M1",exactSessionHash:h,sourceHistoryHash:h,canonicalGeometryHash:h};
t("D13403 display alias-only change does not change identity",()=>assert.equal(classifyAliasRevision(oldR,{...oldR,displayName:"NEWNAME"}).status,"ALIAS_METADATA_ONLY"));
t("D13404 security remap requires replay",()=>assert.equal(classifyAliasRevision(oldR,{...oldR,securityIdentity:"SEC2"}).status,"IDENTITY_REMAP_REQUIRED"));

const r1={securityIdentity:"SEC1",membershipIntervalId:"M1",identityResolutionState:"CANONICAL_IDENTITY_PROVEN",aliasTimelineVersion:"A1"};
t("D13405 R1 and R7 same identity version passes",()=>assert.equal(validateR1R7IdentityBinding(r1,{...r1}).status,"R1_R7_IDENTITY_VERSION_VALID"));
t("D13406 R1 and R7 alias-version drift blocks",()=>assert.equal(validateR1R7IdentityBinding(r1,{...r1,aliasTimelineVersion:"A2"}).status,"R1_R7_IDENTITY_VERSION_MISMATCH"));
t("D13407 parent child identity support must match",()=>assert.equal(validateParentChildIdentity(r1,{...r1}).status,"PARENT_CHILD_IDENTITY_SUPPORT_VALID"));
t("D13408 remapped child cannot pair with old parent",()=>assert.equal(validateParentChildIdentity(r1,{...r1,securityIdentity:"SEC2"}).status,"PARENT_CHILD_IDENTITY_SUPPORT_MISMATCH"));
t("D13409 alias count cannot become vote",()=>assert.equal(validateAliasMetadataNotAlpha({aliasCountUsedAsVote:true}).status,"ALIAS_METADATA_ALPHA_OVERCLAIM"));
t("D13410 clean alias metadata remains non-alpha",()=>assert.equal(validateAliasMetadataNotAlpha({aliasCountUsedAsVote:false,aliasCountUsedAsScore:false,aliasStringUsedAsInformationRoot:false}).status,"ALIAS_METADATA_NON_ALPHA_VALID"));

console.log(`SUMMARY ${p}/27 PASS`);
