import assert from "node:assert/strict";
import {
  aggregateOHLC,classifyDerivedBarRevision,rollingWindowsContainingIndex,classifyRevisionRootEdge,
  revisionRootAccounting,validateAggregationSpace,classifyCrossScaleSensitivity,
  validateCrossScaleReceipt,validateOnePrimitiveManyScales
} from "./pattern_dl113_115_crossscale_revision_lineage_oracle_v0_1.mjs";

let p=0;const t=(n,f)=>{f();p++;console.log("PASS",n);};

const oldRows=[
  {id:"d1",open:10,high:12,low:9,close:11},
  {id:"d2",open:11,high:13,low:10,close:12},
  {id:"d3",open:12,high:14,low:11,close:13}
];

t("D11301 calendar aggregate OHLC deterministic",()=>{const x=aggregateOHLC(oldRows);assert.equal(x.status,"AGGREGATE_READY");assert.equal(x.open,10);assert.equal(x.high,14);assert.equal(x.low,9);assert.equal(x.close,13);});
t("D11302 middle close correction can leave aggregate OHLC unchanged",()=>{const a=aggregateOHLC(oldRows),b=aggregateOHLC([oldRows[0],{...oldRows[1],close:11.5},oldRows[2]]);assert.equal(classifyDerivedBarRevision({oldBar:a,newBar:b}).status,"PRIMITIVE_CHANGED_DERIVED_UNCHANGED");});
t("D11303 corrected aggregate high propagates",()=>{const a=aggregateOHLC(oldRows),b=aggregateOHLC([oldRows[0],{...oldRows[1],high:15},oldRows[2]]);assert.equal(classifyDerivedBarRevision({oldBar:a,newBar:b}).status,"PRIMITIVE_CHANGED_DERIVED_CHANGED");});
t("D11304 session-set correction dominates",()=>assert.equal(classifyDerivedBarRevision({oldBar:{open:1,high:2,low:1,close:2},newBar:{open:1,high:2,low:1,close:2},sessionSetChanged:true}).status,"SESSION_SET_CHANGED_AGGREGATE_CHANGED"));
t("D11305 continuity transform revision tracked separately",()=>assert.equal(classifyDerivedBarRevision({oldBar:{open:1,high:2,low:1,close:2},newBar:{open:1,high:2,low:1,close:2},continuityTransformChanged:true}).status,"CONTINUITY_REVISION_PROPAGATED"));
t("D11306 volume-only correction leaves price aggregate unchanged",()=>assert.equal(classifyDerivedBarRevision({oldBar:{open:1,high:2,low:1,close:2},newBar:{open:1,high:2,low:1,close:2},volumeOnlyChanged:true}).status,"VOLUME_ONLY_PRICE_AGGREGATE_UNCHANGED"));
t("D11307 aggregation definition change starts new lineage",()=>assert.equal(classifyDerivedBarRevision({oldBar:{},newBar:{},aggregationDefinitionChanged:true}).status,"AGGREGATION_DEFINITION_CHANGED"));

t("D11308 rolling one primitive can fan out to multiple windows",()=>assert.equal(rollingWindowsContainingIndex({length:10,index:5,windowSize:4}).length,4));
t("D11309 edge rolling point has fewer windows",()=>assert.equal(rollingWindowsContainingIndex({length:10,index:0,windowSize:4}).length,1));

t("D11401 identical root sets are exact duplicates",()=>assert.equal(classifyRevisionRootEdge({primitiveRevisionRootIds:["R1"]},{primitiveRevisionRootIds:["R1"]}).status,"EXACT_REVISION_DUPLICATE"));
t("D11402 subset root sets are nested",()=>assert.equal(classifyRevisionRootEdge({primitiveRevisionRootIds:["R1"]},{primitiveRevisionRootIds:["R1","R2"]}).status,"NESTED_REVISION_ROOT"));
t("D11403 partial overlap is overlapping",()=>assert.equal(classifyRevisionRootEdge({primitiveRevisionRootIds:["R1","R2"]},{primitiveRevisionRootIds:["R2","R3"]}).status,"OVERLAPPING_REVISION_ROOT"));
t("D11404 disjoint roots remain only candidates",()=>assert.equal(classifyRevisionRootEdge({primitiveRevisionRootIds:["R1"]},{primitiveRevisionRootIds:["R2"]}).status,"DISJOINT_REVISION_ROOT_CANDIDATE"));

t("D11405 one root across three scales counts one primitive root",()=>{const x=revisionRootAccounting([{primitiveRevisionRootIds:["R1"]},{primitiveRevisionRootIds:["R1"]},{primitiveRevisionRootIds:["R1"]}]);assert.equal(x.rawRevisionRepresentationCount,3);assert.equal(x.primitiveRevisionRootCount,1);assert.equal(x.effectiveIndependentRevisionRootCount,1);});
t("D11406 two primitive roots across many representations count two roots",()=>{const x=revisionRootAccounting([{primitiveRevisionRootIds:["R1"]},{primitiveRevisionRootIds:["R1","R2"]},{primitiveRevisionRootIds:["R2"]}]);assert.equal(x.rawRevisionRepresentationCount,3);assert.equal(x.primitiveRevisionRootCount,2);});

t("D11407 raw aggregation cannot mix continuity constituent",()=>assert.equal(validateAggregationSpace({semanticSpace:"RAW_EXECUTION",constituentSemanticSpaces:["RAW_EXECUTION","TECHNICAL_CONTINUITY"]}).status,"MIXED_SEMANTIC_SPACE_PROHIBITED"));
t("D11408 continuity aggregation with continuity constituents passes",()=>assert.equal(validateAggregationSpace({semanticSpace:"TECHNICAL_CONTINUITY",constituentSemanticSpaces:["TECHNICAL_CONTINUITY","TECHNICAL_CONTINUITY"]}).status,"AGGREGATION_SPACE_VALID"));

t("D11501 no changes after rebuild classified stable",()=>assert.equal(classifyCrossScaleSensitivity([{dataReady:true,derivedBarChanged:false,r7RepresentationChanged:false},{dataReady:true,derivedBarChanged:false,r7RepresentationChanged:false}]).status,"ALL_SCALES_UNCHANGED_AFTER_REBUILD"));
t("D11502 some scales changed classified separately",()=>assert.equal(classifyCrossScaleSensitivity([{dataReady:true,derivedBarChanged:true,r7RepresentationChanged:false},{dataReady:true,derivedBarChanged:false,r7RepresentationChanged:false}]).status,"SOME_SCALES_CHANGED"));
t("D11503 all scales changed classified separately",()=>assert.equal(classifyCrossScaleSensitivity([{dataReady:true,derivedBarChanged:true,r7RepresentationChanged:false},{dataReady:true,derivedBarChanged:false,r7RepresentationChanged:true}]).status,"ALL_OBSERVED_SCALES_CHANGED"));
t("D11504 membership change dominates sensitivity state",()=>assert.equal(classifyCrossScaleSensitivity([{dataReady:true,derivedBarChanged:false,r7RepresentationChanged:false,windowMembershipChanged:true}]).status,"WINDOW_MEMBERSHIP_CHANGED"));
t("D11505 continuity revision state explicit",()=>assert.equal(classifyCrossScaleSensitivity([{dataReady:true,derivedBarChanged:false,r7RepresentationChanged:false,continuitySpaceRevisionChanged:true}]).status,"CONTINUITY_SPACE_REVISION_CHANGED"));
t("D11506 blocked scale keeps audit blocked",()=>assert.equal(classifyCrossScaleSensitivity([{dataReady:false,derivedBarChanged:false,r7RepresentationChanged:false}]).status,"DATA_BLOCKED"));

const receipt={auditId:"A1",sourceVintageFrom:"V1",sourceVintageTo:"V2",symbol:"1101",predictorDate:"2021-06-15",semanticSpace:"RAW_EXECUTION",primitiveRevisionRootIds:["R1"],primitiveRevisionRootCount:1,effectiveIndependentRevisionRootCount:1,rawRevisionRepresentationCount:3,outcomeFieldsPresent:false};
t("D11507 valid cross-scale receipt passes",()=>assert.equal(validateCrossScaleReceipt(receipt).status,"CROSS_SCALE_REVISION_RECEIPT_VALID"));
t("D11508 representation count cannot become independent count above primitive roots",()=>assert.equal(validateCrossScaleReceipt({...receipt,effectiveIndependentRevisionRootCount:3}).status,"REVISION_INDEPENDENCE_OVERCLAIM"));
t("D11509 primitive root count mismatch rejected",()=>assert.equal(validateCrossScaleReceipt({...receipt,primitiveRevisionRootCount:2}).status,"PRIMITIVE_ROOT_COUNT_MISMATCH"));
t("D11510 outcomes prohibited in revision sensitivity",()=>assert.equal(validateCrossScaleReceipt({...receipt,outcomeFieldsPresent:true}).status,"OUTCOME_CONTAMINATION"));
t("D11511 one primitive across multiple scales explicitly identified",()=>assert.equal(validateOnePrimitiveManyScales([{primitiveRevisionRootIds:["R1"]},{primitiveRevisionRootIds:["R1"]},{primitiveRevisionRootIds:["R1"]}]).status,"ONE_ROOT_MULTI_SCALE_FANOUT"));

console.log(`SUMMARY ${p}/28 PASS`);
