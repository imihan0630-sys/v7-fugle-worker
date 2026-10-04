import assert from "node:assert/strict";
import {
  MOPS_REVISION_CONTROLS_V0_3,
  combineMultiMonthMopsRevisionControlResultV0_3,
  summarizeMopsRevisionControlMatrixV0_3,
} from "../runtime/mops_revision_control_matrix_v0_3.mjs";

const control=MOPS_REVISION_CONTROLS_V0_3.find((x)=>x.stockCode==="3152");
assert.ok(control);
assert.deepEqual(control.months,[1,5]);

function monthly(month,rows){
  return {
    control:{month},
    historyHttpStatus:200,
    historyPayloadHash:"hash-"+month,
    directHistoryCapabilityObserved:true,
    parsed:{
      rowCount:rows.length,
      rows,
    },
  };
}
const original={
  date:"2026-01-20",time:"17:14:53",seqNo:"2",
  correctionOrCancellationHint:false,
  rowText:"3152 璟德 115/01/20 17:14:53 本公司董事會決議辦理現金減資事宜",
};
const correction={
  date:"2026-05-28",time:"17:20:08",seqNo:"1",
  correctionOrCancellationHint:true,
  rowText:"3152 璟德 115/05/28 17:20:08 本公司董事會決議辦理現金減資事宜(更正內容)",
};
const combined=combineMultiMonthMopsRevisionControlResultV0_3({
  control,
  monthlyResults:[monthly(1,[original]),monthly(5,[correction])],
});
assert.equal(combined.revisionHistoryCapabilityObserved,true);
assert.equal(combined.parsed.originalRowCount,1);
assert.equal(combined.parsed.correctionOrCancellationRowCount,1);
assert.equal(combined.parsed.distinctVersionKeyCount,2);
assert.deepEqual(combined.missingMonths,[]);

const missing=combineMultiMonthMopsRevisionControlResultV0_3({
  control,
  monthlyResults:[monthly(1,[original])],
});
assert.equal(missing.revisionHistoryCapabilityObserved,false);
assert.deepEqual(missing.missingMonths,[5]);

const synthetic=MOPS_REVISION_CONTROLS_V0_3.map((c)=>({
  controlId:c.id,
  state:"READY",
  historyHttpStatus:200,
  revisionHistoryCapabilityObserved:c.mode==="ORIGINAL_PLUS_CORRECTION",
  parsed:{
    rowCount:2,
    matchingSubjectRowCount:c.mode==="CANCELLATION_ROW"?1:2,
    originalRowCount:c.mode==="CANCELLATION_ROW"?0:1,
    correctionOrCancellationRowCount:1,
    distinctVersionKeyCount:c.mode==="CANCELLATION_ROW"?1:2,
    rows:c.mode==="CANCELLATION_ROW"
      ? [{rowText:"撤銷",correctionOrCancellationHint:true}]
      : [original,correction],
  },
}));
const matrix=summarizeMopsRevisionControlMatrixV0_3(synthetic);
assert.equal(matrix.controlCount,6);
assert.equal(matrix.passCount,6);
assert.equal(matrix.state,"MULTI_EXCHANGE_MULTI_FAMILY_REVISION_CONTROLS_OBSERVED");
assert.equal(matrix.crossMonthControlCount,1);
assert.ok(matrix.exchangesObserved.includes("TPEX"));
assert.equal(matrix.revisionCoverageComplete,false);
assert.equal(matrix.selectionAuthority,false);
assert.equal(matrix.system1RuntimeUsed,false);

console.log("MOPS revision control matrix V0.3 tests PASS");
