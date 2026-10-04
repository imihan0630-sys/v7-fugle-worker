import assert from "node:assert/strict";
import {certifyNoRevisionGapThroughCutV0_1} from "../research/d03_two_point_no_revision_gap_v0_1.mjs";

const H=c=>String(c).repeat(64).slice(0,64);
const pre={
 evidenceCutId:"CUT-A",
 evidenceCutoffAt:"2026-10-05T10:05:00.000Z",
 scope:"MARKET_WIDE_OR_FULL_ELIGIBLE_UNIVERSE",
 queryTruncated:false,unknownRequiredLaneCount:0,sourceCutManifestHash:H("a"),
 versions:[
   {versionKey:"2467|20260522|163406|2",sourceReportedAt:"2026-05-22T08:34:06.000Z",firstObservedAt:"2026-10-05T09:55:00.000Z",payloadHash:H("1")},
   {versionKey:"2467|20260522|174213|4",sourceReportedAt:"2026-05-22T09:42:13.000Z",firstObservedAt:"2026-10-05T09:55:10.000Z",payloadHash:H("2")},
 ]
};
const post={
 reconciledAt:"2026-10-05T10:30:00.000Z",
 boundedPopulationComplete:true,queryTruncated:false,populationIdentityStable:true,
 versions:[
   ...pre.versions,
   {versionKey:"2467|20261005|182500|9",sourceReportedAt:"2026-10-05T10:25:00.000Z",firstObservedAt:null,payloadHash:H("3")},
 ]
};
const ok=certifyNoRevisionGapThroughCutV0_1({preCut:pre,postReconciliation:post});
assert.equal(ok.certified,true);
assert.equal(ok.noRevisionGapThroughCut,true);
assert.deepEqual(ok.laterVersions,["2467|20261005|182500|9"]);
assert.equal(ok.ownerCertificationRequired,true);
assert.equal(ok.d03SelfCertificationAuthority,false);

const latePre={
 ...post,
 versions:[
   ...pre.versions,
   {versionKey:"LATE-PRE",sourceReportedAt:"2026-10-05T10:04:30.000Z",firstObservedAt:null,payloadHash:H("4")},
 ]
};
const a=certifyNoRevisionGapThroughCutV0_1({preCut:pre,postReconciliation:latePre});
assert.equal(a.certified,false);assert.ok(a.reasons.includes("LATE_DISCOVERED_PRE_CUT_VERSION"));

const mutate={
 ...post,
 versions:post.versions.map(x=>x.versionKey===pre.versions[0].versionKey?{...x,payloadHash:H("f")}:x)
};
const b=certifyNoRevisionGapThroughCutV0_1({preCut:pre,postReconciliation:mutate});
assert.equal(b.certified,false);assert.ok(b.reasons.includes("VERSION_PAYLOAD_MUTATION"));

const truncated=certifyNoRevisionGapThroughCutV0_1({
 preCut:pre,postReconciliation:{...post,boundedPopulationComplete:false,queryTruncated:true}
});
assert.equal(truncated.certified,false);
assert.ok(truncated.reasons.includes("POST_BOUNDED_POPULATION_INCOMPLETE"));
assert.ok(truncated.reasons.includes("POST_QUERY_TRUNCATED"));

const lateObservedPre={
 ...pre,
 versions:pre.versions.map((x,i)=>i?x:{...x,firstObservedAt:"2026-10-05T10:06:00.000Z"})
};
const c=certifyNoRevisionGapThroughCutV0_1({preCut:lateObservedPre,postReconciliation:post});
assert.equal(c.certified,false);assert.ok(c.reasons.includes("PRE_VERSION_FIRST_OBSERVED_AFTER_CUT"));

const dropped={
 ...post,
 versions:post.versions.filter(x=>x.versionKey!==pre.versions[1].versionKey)
};
const d=certifyNoRevisionGapThroughCutV0_1({preCut:pre,postReconciliation:dropped});
assert.equal(d.certified,false);assert.ok(d.reasons.includes("PRE_VERSION_MISSING_FROM_POST"));

console.log(JSON.stringify({
 status:"PASS",
 validCandidate:ok.status,
 laterPostCutVersionsAllowed:ok.laterVersions,
 blocked:[
  "late-discovered pre-cut version",
  "same-key payload mutation",
  "incomplete/truncated post population",
  "pre version first observed after cutoff",
  "pre version missing from reconciliation"
 ]
},null,2));
