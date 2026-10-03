import assert from "node:assert/strict";
import { probeOfficialContinuityEmptyRangeV0_1 } from "../runtime/official_continuity_empty_range_probe_v0_1.mjs";

const requestedDate = process.env.SYSTEM2_CA_EMPTY_DATE || "2026-10-03";
const result = await probeOfficialContinuityEmptyRangeV0_1({ requestedDate });

assert.equal(result.sourceCount, 6);
assert.equal(result.certifiedEmptySourceCount, 6, "all six official sources must match frozen empty signatures");
assert.equal(result.emptyRangeSemanticsCertified, true);
assert.equal(result.noEventMayBeClaimed, false);
assert.equal(result.revisionCoverageComplete, false);
assert.equal(result.suspensionCoverageComplete, false);
assert.equal(result.technicalContinuityCertified, false);
assert.equal(result.historyMutationPerformed, false);
assert.equal(result.selectionAuthority, false);
assert.equal(result.system1RuntimeUsed, false);

console.log(JSON.stringify({ result: "PASS", ...result }, null, 2));
