import assert from "node:assert/strict";
import {
  buildBoundaryPerturbations,
  buildAnchorJackknifeManifest,
  classifyDetectorVersionRelation
} from "./pattern_boundary_detector_robustness_v0_1.mjs";

let pass=0;
const t=(name,fn)=>{fn();pass++;console.log("PASS",name);};

const trueZone={
  candidateId:"T1",
  lower:100,
  upper:104,
  confirmedAt:"2026-09-20"
};

const grid={
  verified:true,
  tickRuleVersion:"TW-TICK-V1",
  tickRuleAsOf:"2026-09-20",
  lowerPrev:99.9,
  lowerNext:100.1,
  upperPrev:103.5,
  upperNext:104.5
};

t("RB01 legal-grid family includes canonical plus four frozen perturbations",()=>{
  const r=buildBoundaryPerturbations({trueZone,gridReceipt:grid});
  assert.equal(r.status,"VALID");
  assert.deepEqual(r.variants.map(x=>x.perturbationId),[
    "CANONICAL",
    "SHIFT_DOWN_ONE_GRID_STEP",
    "SHIFT_UP_ONE_GRID_STEP",
    "EXPAND_ONE_GRID_STEP",
    "CONTRACT_ONE_GRID_STEP"
  ]);
});

t("RB02 grid values are consumed from receipt rather than constant-tick arithmetic",()=>{
  const r=buildBoundaryPerturbations({trueZone,gridReceipt:grid});
  const up=r.variants.find(x=>x.perturbationId==="SHIFT_UP_ONE_GRID_STEP");
  assert.equal(up.lower,100.1);
  assert.equal(up.upper,104.5);
});

t("RB03 future tick rule is fail-closed",()=>{
  const r=buildBoundaryPerturbations({
    trueZone,
    gridReceipt:{...grid,tickRuleAsOf:"2026-09-21"}
  });
  assert.equal(r.status,"DATA_BLOCKED");
});

t("RB04 invalid contraction is retained rather than silently dropped",()=>{
  const r=buildBoundaryPerturbations({
    trueZone,
    gridReceipt:{...grid,lowerNext:103,upperPrev:102}
  });
  const c=r.variants.find(x=>x.perturbationId==="CONTRACT_ONE_GRID_STEP");
  assert.equal(c.evaluability,"INVALID_CONTRACTION");
});

t("RB05 perturbations never become independent samples or best-variant search",()=>{
  const r=buildBoundaryPerturbations({trueZone,gridReceipt:grid});
  assert.equal(r.variants.every(x=>x.independentSample===false),true);
  assert.equal(r.bestVariantSelectionAllowed,false);
  assert.equal(r.outcomeJoinAllowed,false);
});

const anchors=["A1","A2","A3"];

t("RB06 leave-one-anchor-out requires every frozen anchor variant",()=>{
  const r=buildAnchorJackknifeManifest({
    trueZone,
    anchorIds:anchors,
    jackknifeVariants:[
      {omittedAnchorId:"A1",asOf:"2026-09-20",zonePresent:true,lower:100,upper:104,sameStructuralLineage:true},
      {omittedAnchorId:"A2",asOf:"2026-09-20",zonePresent:true,lower:99,upper:104,sameStructuralLineage:true}
    ]
  });
  assert.equal(r.status,"INCOMPLETE");
  assert.equal(r.variants.find(x=>x.omittedAnchorId==="A3").identityClass,"I4_NOT_EVALUABLE");
});

t("RB07 zone disappearance is retained as identity fragility evidence",()=>{
  const r=buildAnchorJackknifeManifest({
    trueZone,
    anchorIds:["A1","A2"],
    jackknifeVariants:[
      {omittedAnchorId:"A1",asOf:"2026-09-20",zonePresent:false},
      {omittedAnchorId:"A2",asOf:"2026-09-20",zonePresent:true,lower:100,upper:103,sameStructuralLineage:true}
    ]
  });
  assert.equal(r.status,"VALID");
  assert.equal(r.variants[0].identityClass,"I3_IDENTITY_DISAPPEARED");
  assert.equal(r.retainAllVariants,true);
});

t("RB08 changed structural lineage is not relabeled as same identity",()=>{
  const r=buildAnchorJackknifeManifest({
    trueZone,
    anchorIds:["A1","A2"],
    jackknifeVariants:[
      {omittedAnchorId:"A1",asOf:"2026-09-20",zonePresent:true,lower:90,upper:94,sameStructuralLineage:false},
      {omittedAnchorId:"A2",asOf:"2026-09-20",zonePresent:true,lower:100,upper:103,sameStructuralLineage:true}
    ]
  });
  assert.equal(r.variants[0].identityClass,"I2_IDENTITY_CHANGED");
});

t("RB09 future jackknife state is prohibited",()=>{
  const r=buildAnchorJackknifeManifest({
    trueZone,
    anchorIds:["A1","A2"],
    jackknifeVariants:[
      {omittedAnchorId:"A1",asOf:"2026-09-21",zonePresent:true,lower:100,upper:103,sameStructuralLineage:true},
      {omittedAnchorId:"A2",asOf:"2026-09-20",zonePresent:true,lower:100,upper:103,sameStructuralLineage:true}
    ]
  });
  assert.equal(r.variants[0].evaluability,"FUTURE_STATE_PROHIBITED");
});

t("RB10 semantically equivalent versions must match manifest hashes",()=>{
  const ok=classifyDetectorVersionRelation({
    declaredRelation:"SEMANTIC_EQUIVALENT",
    canonicalManifestHash:"abc",
    challengerManifestHash:"abc"
  });
  const bad=classifyDetectorVersionRelation({
    declaredRelation:"SEMANTIC_EQUIVALENT",
    canonicalManifestHash:"abc",
    challengerManifestHash:"def"
  });
  assert.equal(ok.classification,"SEMANTIC_EQUIVALENT_REPLAY_PASS");
  assert.equal(bad.classification,"SEMANTIC_REGRESSION");
});

t("RB11 preregistered alternative detector is nested robustness, not new N",()=>{
  const r=classifyDetectorVersionRelation({
    declaredRelation:"PREDECLARED_VARIANT",
    frozenBeforeOutcome:true
  });
  assert.equal(r.status,"VALID");
  assert.equal(r.independentSample,false);
});

t("RB12 post-outcome detector rescue is prohibited",()=>{
  const r=classifyDetectorVersionRelation({
    declaredRelation:"PREDECLARED_VARIANT",
    frozenBeforeOutcome:false
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.classification,"POST_OUTCOME_VERSION_PROHIBITED");
});

console.log(`SUMMARY ${pass}/12 PASS`);
