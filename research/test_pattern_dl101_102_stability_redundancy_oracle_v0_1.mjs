import assert from "node:assert/strict";
import {validateParameterVariant,classifyRepresentationStability,validateGapThresholdRole,classifyRedundancyEdge,buildDependencyClusters} from "./pattern_dl101_102_stability_redundancy_oracle_v0_1.mjs";
let p=0;const t=(n,f)=>{f();p++;console.log("PASS",n);};
const h="a".repeat(64);

t("D10101 preregistered parameter variant passes",()=>assert.equal(validateParameterVariant({moduleId:"D01-07",parameterFamilyId:"BASE-F1",variantId:"V1",preregistered:true,selectedAfterOutcome:false}).status,"PARAMETER_VARIANT_VALID"));
t("D10102 outcome-selected scale fails",()=>assert.equal(validateParameterVariant({moduleId:"D01-07",parameterFamilyId:"BASE-F1",variantId:"V2",preregistered:true,selectedAfterOutcome:true}).status,"OUTCOME_SELECTED_PARAMETER_PROHIBITED"));
t("D10103 unregistered threshold fails",()=>assert.equal(validateParameterVariant({moduleId:"D01-02",parameterFamilyId:"CANDLE-F1",variantId:"V9",preregistered:false}).status,"PARAMETER_VARIANT_NOT_PREREGISTERED"));

const a={symbol:"1101",predictorFreezeAt:"t",informationRoot:"PRICE_OHLC",sourceHistoryHash:h,sourceBarIds:["b1","b2"],dataReady:true,structurePresent:true,baseEpisodeId:"E1"};
t("D10104 same episode nearby config is stable",()=>assert.equal(classifyRepresentationStability(a,{...a,sourceBarIds:["b1","b2","b3"]}).status,"STABLE_REPRESENTATION"));
t("D10105 present-vs-absent nearby config is sensitive",()=>assert.equal(classifyRepresentationStability(a,{...a,structurePresent:false}).status,"CONFIG_SENSITIVE_REPRESENTATION"));
t("D10106 different base episode is identity drift",()=>assert.equal(classifyRepresentationStability(a,{...a,baseEpisodeId:"E2"}).status,"IDENTITY_DRIFT"));
t("D10107 raw gap parent must remain continuous",()=>assert.equal(validateGapThresholdRole({primaryParentUsesContinuousGap:false,namedChildThresholdPreregistered:true}).status,"PRIMARY_GAP_PARENT_WRONGLY_THRESHOLD_DEPENDENT"));
t("D10108 preregistered named gap threshold valid child",()=>assert.equal(validateGapThresholdRole({primaryParentUsesContinuousGap:true,namedChildThresholdPreregistered:true,thresholdSelectedAfterOutcome:false}).status,"GAP_THRESHOLD_CHILD_VALID"));

t("D10201 same ordered bars duplicate",()=>assert.equal(classifyRedundancyEdge({informationRoot:"PRICE_OHLC",sourceBarIds:["b1","b2"]},{informationRoot:"PRICE_OHLC",sourceBarIds:["b1","b2"]}).status,"EXACT_REPRESENTATION_DUPLICATE"));
t("D10202 subset bars nested shared root",()=>assert.equal(classifyRedundancyEdge({informationRoot:"PRICE_OHLC",sourceBarIds:["b2"]},{informationRoot:"PRICE_OHLC",sourceBarIds:["b1","b2","b3"]}).status,"NESTED_SHARED_ROOT"));
t("D10203 partial overlap shared root",()=>assert.equal(classifyRedundancyEdge({informationRoot:"PRICE_OHLC",sourceBarIds:["b1","b2"]},{informationRoot:"PRICE_OHLC",sourceBarIds:["b2","b3"]}).status,"OVERLAPPING_SHARED_ROOT"));
t("D10204 same base episode links different labels",()=>assert.equal(classifyRedundancyEdge({informationRoot:"PRICE_OHLC",sourceBarIds:["b1"],baseEpisodeId:"BASE1"},{informationRoot:"PRICE_OHLC",sourceBarIds:["b9"],baseEpisodeId:"BASE1"}).status,"SAME_EPISODE_DIFFERENT_LABEL"));
t("D10205 distinct information root remains candidate",()=>assert.equal(classifyRedundancyEdge({informationRoot:"PRICE_OHLC",sourceBarIds:["b1"]},{informationRoot:"OTHER_ROOT",sourceBarIds:["b1"]}).status,"DISTINCT_ROOT_CANDIDATE"));
t("D10206 shared mechanical context links otherwise disjoint bars",()=>assert.equal(classifyRedundancyEdge({informationRoot:"PRICE_OHLC",sourceBarIds:["b1"],mechanicalContextId:"M1"},{informationRoot:"PRICE_OHLC",sourceBarIds:["b9"],mechanicalContextId:"M1"}).status,"SHARED_MECHANICAL_CONTEXT"));
t("D10207 dependency graph does not invent independent vote count",()=>{const x=buildDependencyClusters([{opportunityId:"O1",informationRoot:"PRICE_OHLC",sourceBarIds:["b1"]},{opportunityId:"O2",informationRoot:"PRICE_OHLC",sourceBarIds:["b1","b2"]},{opportunityId:"O3",informationRoot:"PRICE_OHLC",sourceBarIds:["z1"]}]);assert.equal(x.dependencyClusterCount,2);assert.equal(x.independentVoteCount,null);});

console.log(`SUMMARY ${p}/15 PASS`);
