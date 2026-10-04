import assert from "node:assert/strict";
import {
  MOPS_REVISION_CONTROLS_V0_2,
  summarizeMopsRevisionControlMatrixV0_2,
} from "../runtime/mops_revision_control_matrix_v0_2.mjs";

assert.equal(MOPS_REVISION_CONTROLS_V0_2.length, 5);
assert.equal(new Set(MOPS_REVISION_CONTROLS_V0_2.map((x) => x.id)).size, 5);

const synthetic = MOPS_REVISION_CONTROLS_V0_2.map((control) => {
  if (control.mode === "CANCELLATION_ROW") {
    return {
      controlId: control.id,
      state: "MOPS_HISTORY_READABLE_CONTROL_NOT_PROVEN",
      revisionHistoryCapabilityObserved: false,
      historyHttpStatus: 200,
      parsed: {
        rowCount: 6,
        matchingSubjectRowCount: 1,
        originalRowCount: 0,
        correctionOrCancellationRowCount: 1,
        distinctVersionKeyCount: 1,
        rows: [{ rowText: "公告本公司接獲金融監督管理委員會核准撤銷115年現金增資發行普通股案" }],
      },
    };
  }
  return {
    controlId: control.id,
    state: "MOPS_ORIGINAL_AND_CORRECTION_OBSERVED",
    revisionHistoryCapabilityObserved: true,
    historyHttpStatus: 200,
    parsed: {
      rowCount: 8,
      matchingSubjectRowCount: 2,
      originalRowCount: 1,
      correctionOrCancellationRowCount: 1,
      distinctVersionKeyCount: 2,
      rows: [
        { rowText: control.baseSubject },
        { rowText: control.baseSubject + "(更正)" },
      ],
    },
  };
});

const summary = summarizeMopsRevisionControlMatrixV0_2(synthetic);
assert.equal(summary.state, "MULTI_FAMILY_CORRECTION_AND_CANCELLATION_CAPABILITY_OBSERVED");
assert.equal(summary.passCount, 5);
assert.equal(summary.correctionControlPassCount, 4);
assert.equal(summary.cancellationControlPassCount, 1);
assert.equal(summary.actionFamilyObservedCount, 4);
assert.equal(summary.revisionCoverageComplete, false);
assert.equal(summary.boundedIntervalCoverageComplete, false);
assert.equal(summary.technicalContinuityCertified, false);
assert.equal(summary.selectionAuthority, false);
assert.equal(summary.system1RuntimeUsed, false);

const missing = summarizeMopsRevisionControlMatrixV0_2(synthetic.slice(0, -1));
assert.equal(missing.state, "CONTROL_MATRIX_PARTIAL_OR_BLOCKED");
assert.equal(missing.passCount, 4);
assert.equal(missing.cancellationControlPassCount, 0);
assert.equal(missing.revisionCoverageComplete, false);

const badCancellation = synthetic.map((x) => ({...x, parsed: {...x.parsed, rows: [...x.parsed.rows]}}));
const last = badCancellation.at(-1);
last.parsed.rows = [{ rowText: "普通現金增資公告" }];
const bad = summarizeMopsRevisionControlMatrixV0_2(badCancellation);
assert.equal(bad.state, "CONTROL_MATRIX_PARTIAL_OR_BLOCKED");
assert.equal(bad.cancellationControlPassCount, 0);

console.log("System2 MOPS revision control matrix v0.2 tests passed");
