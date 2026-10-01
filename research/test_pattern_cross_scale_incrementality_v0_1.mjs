import assert from "node:assert/strict";
import { classifyCrossScaleEvidence, assertPrefixAppendOnly } from "./pattern_cross_scale_incrementality_v0_1.mjs";

const cases = [
  [{sameRootPricePath:true,higherScaleStateRecoverableFromLowerScalePrefix:true},"DETERMINISTIC_RESTATEMENT"],
  [{sameRootPricePath:true,sharedPivotSet:true,sharedBoundaryLifecycle:true},"DETERMINISTIC_RESTATEMENT"],
  [{sameRootPricePath:true,higherScaleAddsStableHierarchyState:true},"TOPOLOGY_REVEAL"],
  [{sameRootPricePath:true,labelChangedOnly:true},"DETERMINISTIC_RESTATEMENT"],
  [{partialHigherScaleBar:true,confirmedAtAvailable:false},"UNKNOWN"],
  [{semanticSpaceMismatch:true},"UNKNOWN"],
  [{sameRootPricePath:false,separatePITProvenanceLane:true},"INDEPENDENT_PROVENANCE"]
];
for (const [input, expected] of cases) assert.equal(classifyCrossScaleEvidence(input).classification, expected);
assert.deepEqual(classifyCrossScaleEvidence(cases[0][0]).independentVoteIncrement, 0);
assert.equal(assertPrefixAppendOnly({
  priorChild:{pivotAt:"2026-01-01",confirmedAt:"2026-01-03",semanticSpaceId:"TECH"},
  laterChild:{pivotAt:"2026-01-01",confirmedAt:"2026-01-03",semanticSpaceId:"TECH"},
  futureParentConfirmedAt:"2026-01-10",asOf:"2026-01-05"
}).parentVisible,false);
assert.equal(assertPrefixAppendOnly({
  priorChild:{pivotAt:"2026-01-01",confirmedAt:"2026-01-03",semanticSpaceId:"TECH"},
  laterChild:{pivotAt:"2026-01-02",confirmedAt:"2026-01-03",semanticSpaceId:"TECH"},
  futureParentConfirmedAt:"2026-01-10",asOf:"2026-01-05"
}).ok,false);
console.log("cross-scale incrementality: 9 assertions PASS");
