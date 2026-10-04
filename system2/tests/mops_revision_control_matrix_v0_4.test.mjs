import assert from "node:assert/strict";
import {
  MOPS_REVISION_CONTROLS_V0_4,
  TPEX_6548_PAR_VALUE_CONTROL_V0_4,
  summarizeMopsRevisionControlMatrixV0_4,
} from "../runtime/mops_revision_control_matrix_v0_4.mjs";

assert.equal(MOPS_REVISION_CONTROLS_V0_4.length,7);
assert.equal(TPEX_6548_PAR_VALUE_CONTROL_V0_4.stockCode,"6548");
assert.equal(TPEX_6548_PAR_VALUE_CONTROL_V0_4.officialEffectiveDate,"2022-09-05");

const synthetic=MOPS_REVISION_CONTROLS_V0_4.map((c)=>({
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
const matrix=summarizeMopsRevisionControlMatrixV0_4(synthetic);
assert.equal(matrix.controlCount,7);
assert.equal(matrix.passCount,7);
assert.equal(matrix.state,"MULTI_EXCHANGE_MULTI_FAMILY_REVISION_CONTROLS_OBSERVED_V0_4");
assert.ok(matrix.exchangesObserved.includes("TPEX"));
assert.equal(matrix.revisionCoverageComplete,false);
assert.equal(matrix.selectionAuthority,false);
assert.equal(matrix.system1RuntimeUsed,false);

const bad=synthetic.map((x)=>x.controlId===TPEX_6548_PAR_VALUE_CONTROL_V0_4.id
  ? {...x,revisionHistoryCapabilityObserved:false}
  : x);
const blocked=summarizeMopsRevisionControlMatrixV0_4(bad);
assert.equal(blocked.passCount,6);
assert.equal(blocked.state,"CONTROL_MATRIX_PARTIAL_OR_BLOCKED");

console.log("MOPS revision control matrix V0.4 tests PASS");
