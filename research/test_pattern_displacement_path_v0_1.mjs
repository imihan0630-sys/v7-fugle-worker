import assert from "node:assert/strict";
import {
  signedDistanceToZone,
  buildPathSummary,
  classifyPathComparability
} from "./pattern_displacement_path_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const boundary={lower:100,upper:104};

t("DP01 inside-zone distance is zero",()=>{
  const r=signedDistanceToZone({close:102,...boundary});
  assert.equal(r.location,"INSIDE_ZONE");
  assert.equal(r.signedDistancePrice,0);
});

t("DP02 above-zone signed distance is from upper boundary",()=>{
  const r=signedDistanceToZone({close:110,...boundary});
  assert.equal(r.location,"ABOVE_ZONE");
  assert.equal(r.signedDistancePrice,6);
});

t("DP03 below-zone signed distance is from lower boundary",()=>{
  const r=signedDistanceToZone({close:95,...boundary});
  assert.equal(r.location,"BELOW_ZONE");
  assert.equal(r.signedDistancePrice,-5);
});

t("DP04 path summary keeps current distance and max excursion separate",()=>{
  const r=buildPathSummary({
    boundary,
    bars:[{close:102},{close:112},{close:108},{close:103}],
    currentAtr:2,
    currentReferencePrice:103,
    semanticSpaceVerified:true,
    pathComplete:true
  });
  assert.equal(r.absoluteDistancePrice,0);
  assert.equal(r.maxAbsExcursionPrice,8);
});

t("DP05 cumulative path is not max excursion",()=>{
  const r=buildPathSummary({
    boundary,
    bars:[{close:102},{close:110},{close:106},{close:103}],
    currentAtr:2,
    currentReferencePrice:103,
    semanticSpaceVerified:true,
    pathComplete:true
  });
  assert.equal(r.maxAbsExcursionPrice,6);
  assert.equal(r.cumulativeAbsPathPrice,15);
});

t("DP06 above and below excursions remain directionally separate",()=>{
  const r=buildPathSummary({
    boundary,
    bars:[{close:102},{close:111},{close:98},{close:103}],
    currentAtr:1,
    currentReferencePrice:103,
    semanticSpaceVerified:true,
    pathComplete:true
  });
  assert.equal(r.maxAboveExcursionPrice,7);
  assert.equal(r.maxBelowExcursionPrice,2);
  assert.equal(r.excursionSide,"ABOVE");
});

t("DP07 incomplete path fails closed",()=>{
  const r=buildPathSummary({
    boundary,
    bars:[{close:102},{close:110}],
    semanticSpaceVerified:true,
    pathComplete:false
  });
  assert.equal(r.status,"DATA_BLOCKED");
  assert.equal(r.reason,"PATH_SUMMARY_DATA_BLOCKED");
});

t("DP08 semantic-space failure blocks excursion inference",()=>{
  const r=buildPathSummary({
    boundary,
    bars:[{close:102},{close:110}],
    semanticSpaceVerified:false,
    pathComplete:true
  });
  assert.equal(r.status,"DATA_BLOCKED");
});

t("DP09 missing close is not imputed",()=>{
  const r=buildPathSummary({
    boundary,
    bars:[{close:102},{close:null}],
    semanticSpaceVerified:true,
    pathComplete:true
  });
  assert.equal(r.status,"DATA_BLOCKED");
  assert.equal(r.reason,"PATH_CLOSE_MISSING");
});

t("DP10 no arbitrary far threshold is created",()=>{
  const r=buildPathSummary({
    boundary,
    bars:[{close:102},{close:110}],
    currentAtr:2,
    currentReferencePrice:110,
    semanticSpaceVerified:true,
    pathComplete:true
  });
  assert.equal(r.thresholdedFarStateDefined,false);
});

t("DP11 distance normalization does not move the boundary",()=>{
  const r=buildPathSummary({
    boundary,
    bars:[{close:110}],
    currentAtr:3,
    currentReferencePrice:110,
    semanticSpaceVerified:true,
    pathComplete:true
  });
  assert.equal(r.currentDistanceAtr,2);
  assert.deepEqual(boundary,{lower:100,upper:104});
});

t("DP12 outcome join remains closed",()=>{
  const r=buildPathSummary({
    boundary,
    bars:[{close:110}],
    semanticSpaceVerified:true,
    pathComplete:true
  });
  assert.equal(r.outcomeJoinAllowed,false);
});

t("DP13 common support requires path overlap as well as age overlap",()=>{
  const r=classifyPathComparability({
    ageOverlap:true,
    currentDistanceOverlap:true,
    excursionOverlap:true,
    interactionRecencyOverlap:true,
    interactionHistoryOverlap:true,
    scaleRegimeOverlap:true
  });
  assert.equal(r.status,"COMMON_SUPPORT_VALID");
});

t("DP14 missing excursion support prohibits extrapolation",()=>{
  const r=classifyPathComparability({
    ageOverlap:true,
    currentDistanceOverlap:true,
    excursionOverlap:false,
    interactionRecencyOverlap:true,
    interactionHistoryOverlap:true,
    scaleRegimeOverlap:true
  });
  assert.equal(r.status,"EXTRAPOLATION_PROHIBITED");
});

console.log(`SUMMARY ${pass}/14 PASS`);
