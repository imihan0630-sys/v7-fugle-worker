import assert from "node:assert/strict";
import {
  classifyIdentityTransition,validateCrossMarketContinuity,classifyBoundaryGap,
  validateSuccessorBreak,classifyOpportunityRelation,validateDurableOpportunityKey,
  validateNoSyntheticTransitionBars,validateModuleTransition,aggregateIdentityDenominator
} from "./pattern_dl122_125_identity_migration_oracle_v0_1.mjs";

let p=0;const t=(n,f)=>{f();p++;console.log("PASS",n);};
const h="a".repeat(64);

t("D12201 same security compatible units eligible",()=>assert.equal(classifyIdentityTransition({identityRelation:"SAME_SECURITY",unitSemanticsCompatible:true}).status,"CONTINUITY_ELIGIBLE"));
t("D12202 proven market migration same security eligible",()=>assert.equal(classifyIdentityTransition({identityRelation:"SAME_SECURITY_MARKET_MIGRATION_PROVEN",unitSemanticsCompatible:true}).status,"CONTINUITY_ELIGIBLE"));
t("D12203 code change with certified equivalence eligible",()=>assert.equal(classifyIdentityTransition({identityRelation:"SAME_SECURITY_CODE_CHANGED_PROVEN_EQUIVALENT",unitSemanticsCompatible:true}).status,"CONTINUITY_ELIGIBLE"));
t("D12204 unit semantics change without transform blocks",()=>assert.equal(classifyIdentityTransition({identityRelation:"SAME_SECURITY",unitSemanticsCompatible:false,unitTransformCertified:false}).status,"CONTINUITY_BLOCKED_UNIT_SEMANTICS"));
t("D12205 successor security blocks continuity",()=>assert.equal(classifyIdentityTransition({identityRelation:"SUCCESSOR_SECURITY"}).status,"CONTINUITY_BLOCKED_IDENTITY_TRANSITION"));
t("D12206 multi-successor blocks continuity",()=>assert.equal(classifyIdentityTransition({identityRelation:"MULTI_SUCCESSOR"}).status,"CONTINUITY_BLOCKED_IDENTITY_TRANSITION"));
t("D12207 unknown identity equivalence blocks",()=>assert.equal(classifyIdentityTransition({identityRelation:"IDENTITY_EQUIVALENCE_UNKNOWN"}).status,"CONTINUITY_BLOCKED_IDENTITY_UNKNOWN"));
t("D12208 membership boundary conflict blocks same-security stitch",()=>assert.equal(classifyIdentityTransition({identityRelation:"SAME_SECURITY",unitSemanticsCompatible:true,membershipBoundaryConflict:true}).status,"CONTINUITY_BLOCKED_MEMBERSHIP_CONFLICT"));

const mig={priorMarket:"TPEX",currentMarket:"TWSE",identityRelation:"SAME_SECURITY_MARKET_MIGRATION_PROVEN",unitSemanticsCompatible:true,oldMembershipClosed:true,newMembershipOpened:true,overlappingMembershipAmbiguity:false,transitionIntervalClassified:true,priceSpaceComparable:true,successorSecurityEvent:false};
t("D12301 proven same-security cross-market migration eligible",()=>{const x=validateCrossMarketContinuity(mig);assert.equal(x.status,"CROSS_MARKET_CONTINUITY_ELIGIBLE");assert.equal(x.effectiveIndependentOpportunityCount,1);});
t("D12302 unknown membership close/open blocks",()=>assert.equal(validateCrossMarketContinuity({...mig,newMembershipOpened:false}).status,"CROSS_MARKET_MEMBERSHIP_BOUNDARY_INCOMPLETE"));
t("D12303 overlapping dual-membership ambiguity blocks",()=>assert.equal(validateCrossMarketContinuity({...mig,overlappingMembershipAmbiguity:true}).status,"CROSS_MARKET_OVERLAP_CONFLICT"));
t("D12304 unknown transition interval blocks",()=>assert.equal(validateCrossMarketContinuity({...mig,transitionIntervalClassified:false}).status,"CROSS_MARKET_INTERVAL_UNKNOWN"));
t("D12305 non-comparable price space blocks",()=>assert.equal(validateCrossMarketContinuity({...mig,priceSpaceComparable:false,priceTransformCertified:false}).status,"CROSS_MARKET_PRICE_SPACE_BLOCKED"));
t("D12306 successor event blocks cross-market continuity",()=>assert.equal(validateCrossMarketContinuity({...mig,successorSecurityEvent:true}).status,"CROSS_MARKET_SUCCESSOR_BREAK"));
t("D12307 migration-boundary gap is specially classified",()=>assert.equal(classifyBoundaryGap({marketMigrationBoundary:true,sameSecurityProven:true,priceSpaceComparable:true,priorClose:10,currentOpen:11}).status,"MARKET_MIGRATION_BOUNDARY_GAP"));
t("D12308 migration gap without identity proof blocks",()=>assert.equal(classifyBoundaryGap({marketMigrationBoundary:true,sameSecurityProven:false,priceSpaceComparable:true,priorClose:10,currentOpen:11}).status,"MIGRATION_BOUNDARY_GAP_BLOCKED"));
t("D12309 ordinary same-security gap allowed away from migration",()=>assert.equal(classifyBoundaryGap({sameSecurityProven:true,priorClose:10,currentOpen:11}).status,"ORDINARY_SAME_SECURITY_RAW_GAP"));
t("D12310 synthetic bar inside transition prohibited",()=>assert.equal(validateNoSyntheticTransitionBars({syntheticBarInserted:true,transitionIntervalClassified:true}).status,"SYNTHETIC_TRANSITION_BAR_PROHIBITED"));

t("D12401 successor may not inherit predecessor episode fields",()=>assert.equal(validateSuccessorBreak({identityRelation:"SUCCESSOR_SECURITY",episodeIdInherited:true}).status,"SUCCESSOR_INHERITANCE_PROHIBITED"));
t("D12402 clean successor break passes",()=>assert.equal(validateSuccessorBreak({identityRelation:"SUCCESSOR_SECURITY"}).status,"SUCCESSOR_BREAK_VALID"));
t("D12403 multi-successor clean break passes",()=>assert.equal(validateSuccessorBreak({identityRelation:"MULTI_SUCCESSOR"}).status,"SUCCESSOR_BREAK_VALID"));
t("D12404 successor reference distance is not ordinary gap",()=>assert.equal(classifyBoundaryGap({identityRelation:"SUCCESSOR_SECURITY",priorClose:10,currentOpen:11}).status,"IDENTITY_TRANSITION_REFERENCE_DISTANCE"));
t("D12405 D01-03 cannot cross predecessor successor identity",()=>assert.equal(validateModuleTransition("D01-03",{crossIdentitySequence:true}).status,"CROSS_IDENTITY_SEQUENCE_PROHIBITED"));
t("D12406 D01-07 cannot continue predecessor base into successor",()=>assert.equal(validateModuleTransition("D01-07",{identityBreak:true,predecessorEpisodeContinued:true}).status,"SUCCESSOR_BASE_INHERITANCE_PROHIBITED"));
t("D12407 D01-09 cannot call cross-identity distance ordinary gap",()=>assert.equal(validateModuleTransition("D01-09",{identityBreak:true,classifiedAsOrdinaryGap:true}).status,"CROSS_IDENTITY_ORDINARY_GAP_PROHIBITED"));
t("D12408 successor first candle belongs only to successor identity",()=>assert.equal(validateModuleTransition("D01-02",{identityBreak:true}).status,"SUCCESSOR_FIRST_BAR_ONLY"));

const a={securityIdentity:"SEC1",market:"TPEX",symbol:"1234",episodeId:"E1",eventContextId:"EV1"};
t("D12501 same identity same episode across markets dedups one root",()=>assert.equal(classifyOpportunityRelation(a,{...a,market:"TWSE"}).status,"SAME_SECURITY_MIGRATION_DUPLICATE_ROOT"));
t("D12502 same identity same episode code change dedups one root",()=>assert.equal(classifyOpportunityRelation(a,{...a,symbol:"5678"}).status,"SAME_SECURITY_CODE_CHANGE_DUPLICATE_ROOT"));
t("D12503 same visible symbol different security is new opportunity",()=>assert.equal(classifyOpportunityRelation(a,{...a,securityIdentity:"SEC2",eventContextId:null}).status,"DISTINCT_SECURITY_NEW_OPPORTUNITY"));
t("D12504 different successors from same event are dependency-linked",()=>assert.equal(classifyOpportunityRelation({...a,securityIdentity:"SEC1"},{...a,securityIdentity:"SEC2",eventContextId:"EV1"}).status,"DISTINCT_SECURITY_DEPENDENCY_LINKED"));
t("D12505 missing durable identity blocks relation",()=>assert.equal(classifyOpportunityRelation({symbol:"1234"},{symbol:"1234"}).status,"OPPORTUNITY_IDENTITY_UNKNOWN"));

const key={securityIdentity:"SEC1",membershipIntervalId:"M1",detectorFamilyId:"D01-07",episodeId:"E1",predictorFreezeAt:"t",exactSessionHash:h,sourceHistoryHash:h};
t("D12506 durable opportunity key passes",()=>assert.equal(validateDurableOpportunityKey(key).status,"DURABLE_OPPORTUNITY_KEY_VALID"));
t("D12507 market-symbol-only key prohibited",()=>assert.equal(validateDurableOpportunityKey({...key,marketSymbolOnly:true}).status,"MARKET_SYMBOL_KEY_PROHIBITED"));
t("D12508 identity denominator retains transition classes",()=>{const x=aggregateIdentityDenominator([{state:"sameSecurityContinuationN"},{state:"marketMigrationContinuationN"},{state:"successorNewOpportunityN"},{state:"identityUnknownBlockedN"}]);assert.equal(x.total,4);assert.equal(x.counts.successorNewOpportunityN,1);});

console.log(`SUMMARY ${p}/34 PASS`);
