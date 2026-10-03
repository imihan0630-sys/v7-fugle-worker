import assert from "node:assert/strict";
import { probeMopsRevisionSourceCapabilityV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";

const result = await probeMopsRevisionSourceCapabilityV0_1();

assert.equal(result.revisionCoverageComplete, false);
assert.equal(result.noEventMayBeClaimed, false);
assert.equal(result.technicalContinuityCertified, false);
assert.equal(result.historyMutationPerformed, false);
assert.equal(result.selectionAuthority, false);
assert.equal(result.system1RuntimeUsed, false);

console.log(JSON.stringify({
  result: result.revisionHistoryCapabilityObserved ? "PASS_CAPABILITY_OBSERVED" : "PASS_CAPABILITY_NOT_PROVEN",
  ...result,
}, null, 2));
