import assert from "node:assert/strict";
import {
  REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_2,
  buildRevisionAuthorityProvenanceMatrixV0_2,
} from "../runtime/revision_authority_provenance_matrix_v0_2.mjs";

const mopsMatrix={controls:REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_2.map((x)=>({
  controlId:x.controlId,
  state:"PASS_CONTROL_OBSERVED",
  pass:true,
}))};
const exchangeEvidence=[
  {controlId:"DIVIDEND_CORRECTION_2467_2026_05",sourceId:"TWSE_EX_RIGHT_DIVIDEND_ACTUAL",symbol:"2467",effectiveDate:"2026-06-18",directEvidence:true},
  {controlId:"CAPITAL_REDUCTION_SCHEDULE_CORRECTION_1459_2026_06",sourceId:"TWSE_CAPITAL_REDUCTION_REFERENCE",symbol:"1459",effectiveDate:"2026-08-03",directEvidence:true},
  {controlId:"TPEX_CAPITAL_REDUCTION_DECISION_CORRECTION_3152_2026",sourceId:"TPEX_CAPITAL_REDUCTION_REFERENCE",symbol:"3152",effectiveDate:"2026-06-30",directEvidence:true},
];
const regulatorEvidence=[{
  controlId:"CASH_CAPITAL_INCREASE_CANCELLATION_1342_2026_07",
  symbol:"1342",
  statusText:"廢止/撤銷",
  directEvidence:true,
}];

const ok=buildRevisionAuthorityProvenanceMatrixV0_2({mopsMatrix,exchangeEvidence,regulatorEvidence});
assert.equal(ok.frozenControlCount,6);
assert.equal(ok.frozenControlPassCount,6);
assert.equal(ok.frozenAuthorityRoutingCoverageComplete,true);
assert.equal(ok.representativeExchangeLaneCount,3);
assert.deepEqual(ok.representativeExchangeLaneSourceIds,[
  "TPEX_CAPITAL_REDUCTION_REFERENCE",
  "TWSE_CAPITAL_REDUCTION_REFERENCE",
  "TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
]);
assert.equal(ok.authorityRevisionCoverageComplete,false);
assert.equal(ok.knownAtVersionClockCertified,false);
assert.equal(ok.revisionCoverageComplete,false);

const wrongDate=buildRevisionAuthorityProvenanceMatrixV0_2({
  mopsMatrix,
  exchangeEvidence:exchangeEvidence.map((x)=>x.symbol==="3152"?{...x,effectiveDate:"2026-06-29"}:x),
  regulatorEvidence,
});
assert.equal(wrongDate.frozenAuthorityRoutingCoverageComplete,false);
assert.equal(
  wrongDate.controls.find((x)=>x.symbol==="3152").pass,
  false
);

console.log("revision authority provenance matrix V0.2 tests PASS");
