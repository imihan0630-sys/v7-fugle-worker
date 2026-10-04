import assert from "node:assert/strict";
import {
  buildRevisionAuthorityProvenanceMatrixV0_1,
  REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_1,
} from "../runtime/revision_authority_provenance_matrix_v0_1.mjs";

const mopsMatrix={
  controls:REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_1.map((x)=>({
    controlId:x.controlId,
    state:"PASS_CONTROL_OBSERVED",
    pass:true,
  })),
};
const exchangeEvidence=[
  {
    controlId:"DIVIDEND_CORRECTION_2467_2026_05",
    sourceId:"TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
    symbol:"2467",
    effectiveDate:"2026-06-18",
    directEvidence:true,
  },
  {
    controlId:"CAPITAL_REDUCTION_SCHEDULE_CORRECTION_1459_2026_06",
    sourceId:"TWSE_CAPITAL_REDUCTION_REFERENCE",
    symbol:"1459",
    effectiveDate:"2026-07-22",
    directEvidence:true,
  },
];
const regulatorEvidence=[{
  controlId:"CASH_CAPITAL_INCREASE_CANCELLATION_1342_2026_07",
  symbol:"1342",
  statusText:"廢止/撤銷",
  directEvidence:true,
}];

const ok=buildRevisionAuthorityProvenanceMatrixV0_1({
  mopsMatrix,exchangeEvidence,regulatorEvidence,
});
assert.equal(ok.frozenControlCount,5);
assert.equal(ok.frozenControlPassCount,5);
assert.equal(ok.frozenAuthorityRoutingCoverageComplete,true);
assert.equal(ok.authorityRevisionCoverageComplete,false);
assert.equal(ok.knownAtVersionClockCertified,false);
assert.equal(ok.revisionCoverageComplete,false);
assert.equal(ok.selectionAuthority,false);
assert.equal(ok.system1RuntimeUsed,false);

const missingExchange=buildRevisionAuthorityProvenanceMatrixV0_1({
  mopsMatrix,
  exchangeEvidence:exchangeEvidence.filter((x)=>x.symbol!=="1459"),
  regulatorEvidence,
});
assert.equal(missingExchange.frozenAuthorityRoutingCoverageComplete,false);
assert.equal(
  missingExchange.controls.find((x)=>x.controlId==="CAPITAL_REDUCTION_SCHEDULE_CORRECTION_1459_2026_06").pass,
  false
);

const missingRegulator=buildRevisionAuthorityProvenanceMatrixV0_1({
  mopsMatrix,
  exchangeEvidence,
  regulatorEvidence:[],
});
assert.equal(missingRegulator.frozenAuthorityRoutingCoverageComplete,false);

const badIssuer={
  controls:mopsMatrix.controls.map((x)=>x.controlId==="CAPITAL_REDUCTION_DECISION_CORRECTION_2321_2026_03"
    ? {...x,pass:false,state:"BLOCKED"}
    : x),
};
const issuerFail=buildRevisionAuthorityProvenanceMatrixV0_1({
  mopsMatrix:badIssuer,exchangeEvidence,regulatorEvidence,
});
assert.equal(issuerFail.frozenAuthorityRoutingCoverageComplete,false);

console.log("revision authority provenance matrix v0.1 tests PASS");
