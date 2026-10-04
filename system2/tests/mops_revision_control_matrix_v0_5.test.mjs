import assert from "node:assert/strict";
import {
  MOPS_REVISION_CONTROLS_V0_5,
  TPEX_5356_DIVIDEND_CONTROL_V0_5,
  summarizeMopsRevisionControlMatrixV0_5,
} from "../runtime/mops_revision_control_matrix_v0_5.mjs";

assert.equal(MOPS_REVISION_CONTROLS_V0_5.length,8);
assert.equal(TPEX_5356_DIVIDEND_CONTROL_V0_5.stockCode,"5356");
assert.equal(TPEX_5356_DIVIDEND_CONTROL_V0_5.officialEffectiveDate,"2026-07-08");

const synthetic=MOPS_REVISION_CONTROLS_V0_5.map((c)=>({
  controlId:c.id,
  state:"READY",
  historyHttpStatus:200,
  revisionHistoryCapabilityObserved:c.mode==="ORIGINAL_PLUS_CORRECTION",
  parsed:{
    rowCount:3,
    matchingSubjectRowCount:c.mode==="CANCELLATION_ROW"?1:2,
    originalRowCount:c.mode==="CANCELLATION_ROW"?0:1,
    correctionOrCancellationRowCount:1,
    distinctVersionKeyCount:c.mode==="CANCELLATION_ROW"?1:2,
    rows:c.mode==="CANCELLATION_ROW"
      ? [{rowText:"撤銷",correctionOrCancellationHint:true}]
      : [
          {rowText:"original",correctionOrCancellationHint:false},
          {rowText:"更正",correctionOrCancellationHint:true},
        ],
  },
}));
const matrix=summarizeMopsRevisionControlMatrixV0_5(synthetic);
assert.equal(matrix.controlCount,8);
assert.equal(matrix.passCount,8);
assert.equal(matrix.state,"MULTI_EXCHANGE_MULTI_FAMILY_REVISION_CONTROLS_OBSERVED_V0_5");
assert.ok(matrix.exchangesObserved.includes("TPEX"));
assert.equal(matrix.revisionCoverageComplete,false);
assert.equal(matrix.selectionAuthority,false);
assert.equal(matrix.system1RuntimeUsed,false);

const bad=synthetic.map((x)=>x.controlId===TPEX_5356_DIVIDEND_CONTROL_V0_5.id
  ? {...x,revisionHistoryCapabilityObserved:false}
  : x);
const blocked=summarizeMopsRevisionControlMatrixV0_5(bad);
assert.equal(blocked.passCount,7);
assert.equal(blocked.state,"CONTROL_MATRIX_PARTIAL_OR_BLOCKED");

console.log("MOPS revision control matrix V0.5 tests PASS");
