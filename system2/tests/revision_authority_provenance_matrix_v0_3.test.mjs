import assert from "node:assert/strict";
import {
  REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_3,
  buildRevisionAuthorityProvenanceMatrixV0_3,
} from "../runtime/revision_authority_provenance_matrix_v0_3.mjs";

const mopsMatrix={controls:REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_3.map((x)=>({
  controlId:x.controlId,
  state:"PASS_CONTROL_OBSERVED",
  pass:true,
}))};
const exchangeEvidence=[
  {controlId:"DIVIDEND_CORRECTION_2467_2026_05",sourceId:"TWSE_EX_RIGHT_DIVIDEND_ACTUAL",symbol:"2467",effectiveDate:"2026-06-18",directEvidence:true},
  {controlId:"CAPITAL_REDUCTION_SCHEDULE_CORRECTION_1459_2026_06",sourceId:"TWSE_CAPITAL_REDUCTION_REFERENCE",symbol:"1459",effectiveDate:"2026-08-03",directEvidence:true},
  {controlId:"TPEX_CAPITAL_REDUCTION_DECISION_CORRECTION_3152_2026",sourceId:"TPEX_CAPITAL_REDUCTION_REFERENCE",symbol:"3152",effectiveDate:"2026-06-30",directEvidence:true},
  {controlId:"TPEX_PAR_VALUE_CHANGE_CORRECTION_6548_2022",sourceId:"TPEX_PAR_VALUE_CHANGE_REFERENCE",symbol:"6548",effectiveDate:"2022-09-05",directEvidence:true},
];
const regulatorEvidence=[{
  controlId:"CASH_CAPITAL_INCREASE_CANCELLATION_1342_2026_07",
  symbol:"1342",statusText:"廢止/撤銷",directEvidence:true,
}];

const ok=buildRevisionAuthorityProvenanceMatrixV0_3({mopsMatrix,exchangeEvidence,regulatorEvidence});
assert.equal(ok.frozenControlCount,7);
assert.equal(ok.frozenControlPassCount,7);
assert.equal(ok.frozenAuthorityRoutingCoverageComplete,true);
assert.equal(ok.representativeExchangeLaneCount,4);
assert.ok(ok.representativeExchangeLaneSourceIds.includes("TPEX_PAR_VALUE_CHANGE_REFERENCE"));
assert.equal(ok.authorityRevisionCoverageComplete,false);
assert.equal(ok.knownAtVersionClockCertified,false);
assert.equal(ok.revisionCoverageComplete,false);

const wrongDate=buildRevisionAuthorityProvenanceMatrixV0_3({
  mopsMatrix,
  exchangeEvidence:exchangeEvidence.map((x)=>x.symbol==="6548"?{...x,effectiveDate:"2022-09-06"}:x),
  regulatorEvidence,
});
assert.equal(wrongDate.frozenAuthorityRoutingCoverageComplete,false);

console.log("revision authority provenance matrix V0.3 tests PASS");
