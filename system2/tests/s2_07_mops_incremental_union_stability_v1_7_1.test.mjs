import assert from "node:assert/strict";
import { extendMopsAppendOnlyUnionV1_7_1 } from "../runtime/s2_07_mops_incremental_union_stability_v1_7_1.mjs";
const H="a".repeat(64);
const K=(n)=>"S2-MOPS-V:"+String(n).repeat(64).slice(0,64);
const P=(n)=>String(n).repeat(64).slice(0,64);
const seed={
  stableEventUniverseHash:H,captureCount:3,unionHash:"b".repeat(64),
  earliestObservedPreserved:true,latestObservedPreserved:true,payloadConflictCount:0,trailingIdenticalTransitions:0,
  captures:[
    {captureId:"C1",capturedAt:"2026-10-07T00:00:00Z"},
    {captureId:"C2",capturedAt:"2026-10-07T01:00:00Z"},
    {captureId:"C3",capturedAt:"2026-10-07T02:00:00Z"},
  ],
  pairwiseTransitions:[{fromCaptureId:"C1",toCaptureId:"C2",identical:false},{fromCaptureId:"C2",toCaptureId:"C3",identical:false}],
  versions:[
    {versionKey:K(1),versionPayloadHash:P(1),stockCode:"2330",sourceReportedAt:"2026-10-01T01:00:00Z",seqNo:"1",firstObservedAt:"2026-10-07T00:00:00Z",latestObservedAt:"2026-10-07T02:00:00Z",observedCaptureIds:["C1","C2","C3"],absentCaptureIds:[],observedQueryRefs:["2330|2026|10"],observedQueryPathClasses:["MONTH"],observationCount:3,presentInLatestCapture:true},
    {versionKey:K(2),versionPayloadHash:P(2),stockCode:"2317",sourceReportedAt:"2026-10-01T01:10:00Z",seqNo:"2",firstObservedAt:"2026-10-07T00:00:00Z",latestObservedAt:"2026-10-07T01:00:00Z",observedCaptureIds:["C1","C2"],absentCaptureIds:["C3"],observedQueryRefs:["2317|2026|10"],observedQueryPathClasses:["MONTH"],observationCount:2,presentInLatestCapture:false},
  ],
};
const fresh={captureId:"C4",receipt:{capturedAt:"2026-10-07T03:00:00Z",stableEventUniverseHash:H,observations:[
  {versionKey:K(1),versionPayloadHash:P(1),stockCode:"2330",sourceReportedAt:"2026-10-01T01:00:00Z",seqNo:"1",observedAt:"2026-10-07T03:00:00Z",sourceQueryRef:"2330|2026|10"},
  {versionKey:K(3),versionPayloadHash:P(3),stockCode:"2454",sourceReportedAt:"2026-10-01T01:20:00Z",seqNo:"3",observedAt:"2026-10-07T03:00:00Z",sourceQueryRef:"2454|2026|10"},
]}};
const out=await extendMopsAppendOnlyUnionV1_7_1({seedReceipt:seed,freshCapture:fresh,requiredStableEventUniverseHash:H});
assert.equal(out.captureCount,4);
assert.equal(out.unionVersionKeyCount,3);
assert.equal(out.latestCaptureVersionKeyCount,2);
assert.equal(out.unionMissingFromLatestCount,1);
assert.equal(out.trailingIdenticalTransitions,0);
assert.equal(out.boundedStabilizationCandidate,false);
assert.equal(out.expectedMopsKeysetComplete,false);
assert.equal(out.noRevisionGapThroughCut,false);
const k1=out.versions.find(v=>v.versionKey===K(1));
const k2=out.versions.find(v=>v.versionKey===K(2));
const k3=out.versions.find(v=>v.versionKey===K(3));
assert.equal(k1.firstObservedAt,"2026-10-07T00:00:00.000Z");
assert.equal(k1.latestObservedAt,"2026-10-07T03:00:00.000Z");
assert.ok(k2.absentCaptureIds.includes("C4"));
assert.deepEqual(k3.absentCaptureIds,["C1","C2","C3"]);
assert.equal(k3.presentInLatestCapture,true);

const stableSeed={...seed,trailingIdenticalTransitions:1,versions:seed.versions.map(v=>v.versionKey===K(2)?{...v,presentInLatestCapture:false}:v)};
const sameFresh={captureId:"C4S",receipt:{capturedAt:"2026-10-07T03:00:00Z",stableEventUniverseHash:H,observations:[
  {versionKey:K(1),versionPayloadHash:P(1),stockCode:"2330",sourceReportedAt:"2026-10-01T01:00:00Z",seqNo:"1",observedAt:"2026-10-07T03:00:00Z",sourceQueryRef:"2330|2026|10"},
]}};
const candidate=await extendMopsAppendOnlyUnionV1_7_1({seedReceipt:stableSeed,freshCapture:sameFresh,requiredStableEventUniverseHash:H});
assert.equal(candidate.trailingIdenticalTransitions,2);
assert.equal(candidate.boundedStabilizationCandidate,true);
assert.equal(candidate.expectedMopsKeysetComplete,false);

const conflictFresh={captureId:"CX",receipt:{capturedAt:"2026-10-07T04:00:00Z",stableEventUniverseHash:H,observations:[
  {versionKey:K(1),versionPayloadHash:P(9),stockCode:"2330",sourceReportedAt:"2026-10-01T01:00:00Z",seqNo:"1",observedAt:"2026-10-07T04:00:00Z",sourceQueryRef:"2330|2026|10"},
]}};
const conflict=await extendMopsAppendOnlyUnionV1_7_1({seedReceipt:seed,freshCapture:conflictFresh,requiredStableEventUniverseHash:H});
assert.equal(conflict.state,"MOPS_APPEND_ONLY_UNION_BLOCKED");
assert.ok(conflict.blockers.includes("CROSS_CAPTURE_PAYLOAD_CONFLICT"));
console.log("S2-07 MOPS incremental union V1.7.1 tests PASS");
