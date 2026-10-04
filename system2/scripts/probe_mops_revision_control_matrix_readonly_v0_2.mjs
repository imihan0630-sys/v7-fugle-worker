import assert from "node:assert/strict";
import { probeMopsRevisionSourceCapabilityV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";
import {
  MOPS_REVISION_CONTROLS_V0_2,
  summarizeMopsRevisionControlMatrixV0_2,
} from "../runtime/mops_revision_control_matrix_v0_2.mjs";

const results = [];
for (const control of MOPS_REVISION_CONTROLS_V0_2) {
  const result = await probeMopsRevisionSourceCapabilityV0_1({
    stockCode: control.stockCode,
    rocYear: control.rocYear,
    month: control.month,
    expectedDate: control.expectedDate,
    baseSubject: control.baseSubject,
  });
  results.push({
    controlId: control.id,
    ...result,
  });
}

const summary = summarizeMopsRevisionControlMatrixV0_2(results);

assert.equal(summary.revisionCoverageComplete, false);
assert.equal(summary.boundedIntervalCoverageComplete, false);
assert.equal(summary.actionFamilyCoverageComplete, false);
assert.equal(summary.cancellationHistoryComplete, false);
assert.equal(summary.technicalContinuityCertified, false);
assert.equal(summary.historyMutationPerformed, false);
assert.equal(summary.selectionAuthority, false);
assert.equal(summary.system1RuntimeUsed, false);

console.log(JSON.stringify({
  result: summary.state,
  summary,
  rawControls: results.map((x) => ({
    controlId: x.controlId,
    state: x.state,
    historyHttpStatus: x.historyHttpStatus ?? null,
    parsed: x.parsed,
  })),
}, null, 2));
