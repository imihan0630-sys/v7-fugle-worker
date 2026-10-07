import assert from "node:assert/strict";
import {classifySda002ResearchSide,classifySda001ResearchSide,validateD16Handoff,validateCommonParent,validateParentChildSupport,validatePromotionGate} from "./pattern_dl106_107_audit_d16_handoff_oracle_v0_1.mjs";
let p=0;const t=(n,f)=>{f();p++;console.log("PASS",n);};
const h="a".repeat(64);

t("D10601 SDA002 research semantics can be complete while ticket stays open",()=>{const x=classifySda002ResearchSide({geometryFrozen:true,clocksFrozen:true,lifecycleFrozen:true,negativeCasesRetained:true,prefixInvarianceTested:true,versionMigrationFrozen:true,physicalR7:false,SystemGuard:false,D16:false,Audit00:false});assert.equal(x.researchSide,"RESEARCH_SEMANTICS_COMPLETE");assert.equal(x.ticketStatus,"REMEDIATION_IN_PROGRESS");});
t("D10602 SDA002 cannot self-close without 00",()=>assert.equal(classifySda002ResearchSide({geometryFrozen:true,clocksFrozen:true,lifecycleFrozen:true,negativeCasesRetained:true,prefixInvarianceTested:true,versionMigrationFrozen:true,physicalR7:true,SystemGuard:true,D16:true,Audit00:false}).ticketStatus,"REMEDIATION_IN_PROGRESS"));
t("D10603 SDA002 closure eligible only with all external gates",()=>assert.equal(classifySda002ResearchSide({geometryFrozen:true,clocksFrozen:true,lifecycleFrozen:true,negativeCasesRetained:true,prefixInvarianceTested:true,versionMigrationFrozen:true,physicalR7:true,SystemGuard:true,D16:true,Audit00:true}).ticketStatus,"CLOSURE_ELIGIBLE"));
t("D10604 SDA001 D01 research semantics can complete without ticket closure",()=>{const x=classifySda001ResearchSide({informationRootFrozen:true,aliasDedupFrozen:true,parentComparatorsFrozen:true,redundancyGraphFrozen:true,crossScaleFirewallFrozen:true,crossDomainIntegration:false,D16:false,Audit00:false});assert.equal(x.researchSide,"D01_RESEARCH_SEMANTICS_COMPLETE");assert.equal(x.ticketStatus,"REMEDIATION_IN_PROGRESS");});
t("D10605 SDA001 cannot close before cross-domain/D16/00",()=>assert.equal(classifySda001ResearchSide({informationRootFrozen:true,aliasDedupFrozen:true,parentComparatorsFrozen:true,redundancyGraphFrozen:true,crossScaleFirewallFrozen:true,crossDomainIntegration:true,D16:true,Audit00:false}).ticketStatus,"REMEDIATION_IN_PROGRESS"));

t("D10701 frozen D16 handoff valid",()=>assert.equal(validateD16Handoff({modules:["D01-02","D01-03","D01-07","D01-09"],warmupYear:2018,finalHoldoutYear:2024,finalHoldoutLocked:true,horizons:[1,5,20],outcomeJoin:"CLOSED"}).status,"D16_HANDOFF_VALID"));
t("D10702 changed final holdout rejected",()=>assert.equal(validateD16Handoff({modules:["D01-02","D01-03","D01-07","D01-09"],warmupYear:2018,finalHoldoutYear:2023,finalHoldoutLocked:true,horizons:[1,5,20],outcomeJoin:"CLOSED"}).status,"CHRONOLOGY_DRIFT"));
t("D10703 horizon search rejected",()=>assert.equal(validateD16Handoff({modules:["D01-02","D01-03","D01-07","D01-09"],warmupYear:2018,finalHoldoutYear:2024,finalHoldoutLocked:true,horizons:[1,3,5,20],outcomeJoin:"CLOSED"}).status,"HORIZON_DRIFT"));
t("D10704 D01-02 parent valid",()=>assert.equal(validateCommonParent({moduleId:"D01-02",parentType:"CONTINUOUS_SINGLE_BAR_OHLC_GEOMETRY"}).status,"COMMON_PARENT_VALID"));
t("D10705 named candle cannot be its own parent",()=>assert.equal(validateCommonParent({moduleId:"D01-02",parentType:"HAMMER_LABEL"}).status,"COMMON_PARENT_INVALID"));

const pair={universeVersion:"U1",foldId:"F1",symbol:"1101",predictorDate:"2022-03-01",exactSessionHash:h,sourceHistoryHash:h,predictorFreezeAt:"t",blockedRowPolicyId:"B1",censoringPolicyId:"C1",horizon:5,costTreatmentId:"COST1",detectorSearchFamilyId:"D01-CANDLE-F1"};
t("D10706 identical support pairs",()=>assert.equal(validateParentChildSupport(pair,{...pair}).status,"PAIRING_VALID"));
t("D10707 different blocked-row policy blocks pairing",()=>assert.equal(validateParentChildSupport(pair,{...pair,blockedRowPolicyId:"B2"}).status,"PAIRING_BLOCKED"));
t("D10708 detector search family mismatch blocks pairing",()=>assert.equal(validateParentChildSupport(pair,{...pair,detectorSearchFamilyId:"F2"}).status,"PAIRING_BLOCKED"));

t("D10709 physical R1-R7 missing blocks L4",()=>assert.equal(validatePromotionGate({pitReplay:true,deterministicTests:true,physicalR1R7:false,oosOrProspectiveComplete:false,commonParentAvailable:true,multiplicityHandled:true,fullDenominator:true,noPostHoldoutTuning:true}).status,"L4_NOT_ELIGIBLE"));
t("D10710 positive OOS alone insufficient if multiplicity missing",()=>assert.equal(validatePromotionGate({pitReplay:true,deterministicTests:true,physicalR1R7:true,oosOrProspectiveComplete:true,commonParentAvailable:true,multiplicityHandled:false,fullDenominator:true,noPostHoldoutTuning:true}).status,"L4_NOT_ELIGIBLE"));
t("D10711 all gates permit candidate only",()=>assert.equal(validatePromotionGate({pitReplay:true,deterministicTests:true,physicalR1R7:true,oosOrProspectiveComplete:true,commonParentAvailable:true,multiplicityHandled:true,fullDenominator:true,noPostHoldoutTuning:true}).status,"L4_CANDIDATE"));

console.log(`SUMMARY ${p}/16 PASS`);
