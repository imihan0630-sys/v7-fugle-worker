import assert from "node:assert/strict";
import {
  patternRootItemKey,structuralEpisodeKey,rg2RelationKey,
  compareImmutablePayload,validatePatternChildIdentity
} from "./pattern_shared_child_identity_v0_1.mjs";

let pass=0; const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const episode={
 symbol:"2330",semanticSpaceId:"TECHNICAL_CONTINUITY",detectorFamilyVersion:"PATTERN_V1",
 latentFamily:"MULTI_TROUGH_TOPOLOGY",scale:"BASE",
 orderedConfirmedAnchorIds:["p1","p2","p3"],initialConfirmedAt:"2026-09-20"
};

t("PC01 ROOT is stable literal",()=>assert.equal(patternRootItemKey(),"ROOT"));

t("PC02 lifecycle state cannot change structural episode key",()=>{
 const a=structuralEpisodeKey({...episode,currentLifecycleState:"MATURE"});
 const b=structuralEpisodeKey({...episode,currentLifecycleState:"BREAKOUT_CONFIRMED"});
 assert.equal(a,b);
});

t("PC03 named label change outside latent identity does not change key",()=>{
 const a=structuralEpisodeKey({...episode,namedLabel:"W_BOTTOM"});
 const b=structuralEpisodeKey({...episode,namedLabel:"INVERSE_HEAD_SHOULDERS"});
 assert.equal(a,b);
});

t("PC04 new anchor set creates new key",()=>{
 const a=structuralEpisodeKey(episode);
 const b=structuralEpisodeKey({...episode,orderedConfirmedAnchorIds:["p1","p2","p4"]});
 assert.notEqual(a,b);
});

const rel={
 symbol:"2330",semanticSpaceId:"TECHNICAL_CONTINUITY",relationDefinitionVersion:"RG2_V1",
 localBoundaryId:"L1",localBoundaryVersion:"1",parentZoneId:"M1",parentZoneVersion:"1"
};

t("PC05 RG2 lifecycle progression does not change relation key",()=>{
 const a=rg2RelationKey({...rel,compoundLifecycleState:"LOCAL_BREAK_STILL_BELOW_PARENT"});
 const b=rg2RelationKey({...rel,compoundLifecycleState:"LOCAL_BREAK_PARENT_HOLDING_ABOVE"});
 assert.equal(a,b);
});

t("PC06 parent zone version change creates new relation key",()=>{
 assert.notEqual(rg2RelationKey(rel),rg2RelationKey({...rel,parentZoneVersion:"2"}));
});

t("PC07 same relation key coordinate mutation is conflict",()=>{
 const a={localLower:98,localUpper:100,parentLower:110,parentUpper:112};
 const b={localLower:98,localUpper:100,parentLower:109,parentUpper:112};
 const r=compareImmutablePayload(a,b,["localLower","localUpper","parentLower","parentUpper"]);
 assert.equal(r.status,"PROVENANCE_CONFLICT");
 assert.deepEqual(r.changedFields,["parentLower"]);
});

t("PC08 mutable lifecycle fields can differ without immutable conflict",()=>{
 const a={localLower:98,parentLower:110,compoundLifecycleState:"A"};
 const b={localLower:98,parentLower:110,compoundLifecycleState:"B"};
 const r=compareImmutablePayload(a,b,["localLower","parentLower"]);
 assert.equal(r.status,"SAME_IMMUTABLE_IDENTITY");
});

t("PC09 child requires shared parent/generation/scope identity",()=>{
 const r=validatePatternChildIdentity({
  evidenceFamily:"PATTERN",parentDecisionReceiptId:"P1",captureGeneration:"G1",parentScopeId:"S1",
  evidenceItemKey:"ROOT",observerVersion:"V1",asOf:"2026-09-25"
 });
 assert.equal(r.status,"VALID");
});

t("PC10 missing capture generation remains UNKNOWN",()=>{
 const r=validatePatternChildIdentity({
  evidenceFamily:"PATTERN",parentDecisionReceiptId:"P1",parentScopeId:"S1",
  evidenceItemKey:"ROOT",observerVersion:"V1",asOf:"2026-09-25"
 });
 assert.equal(r.status,"UNKNOWN");
});

t("PC11 wrong evidence family fails closed",()=>{
 const r=validatePatternChildIdentity({
  evidenceFamily:"TECHNICAL_INDICATOR",parentDecisionReceiptId:"P1",captureGeneration:"G1",parentScopeId:"S1",
  evidenceItemKey:"ROOT",observerVersion:"V1",asOf:"2026-09-25"
 });
 assert.equal(r.reason,"WRONG_EVIDENCE_FAMILY");
});

t("PC12 outcome cannot enter decision-time child",()=>{
 const r=validatePatternChildIdentity({
  evidenceFamily:"PATTERN",parentDecisionReceiptId:"P1",captureGeneration:"G1",parentScopeId:"S1",
  evidenceItemKey:"ROOT",observerVersion:"V1",asOf:"2026-09-25",outcome:{d5:0.1}
 });
 assert.equal(r.reason,"OUTCOME_IN_DECISION_TIME_CHILD");
});

console.log(`SUMMARY ${pass}/12 PASS`);
