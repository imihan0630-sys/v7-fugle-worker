import assert from "node:assert/strict";
import { buildSupplementalRevisionBlockerReceiptV0_1 } from "../runtime/supplemental_revision_blocker_receipt_v0_1.mjs";
import { officialContinuityRevisionRequiredLanesV0_1 } from "../runtime/official_continuity_revision_coverage_v0_1.mjs";

const required=officialContinuityRevisionRequiredLanesV0_1();
const assessments=Object.keys(required).map((sourceId)=>({
  sourceId,
  finalResultRangeReady:true,
}));
const mopsMatrix={controls:[
  {controlId:"DIVIDEND_CORRECTION_2467_2026_05",pass:true},
  {controlId:"CAPITAL_REDUCTION_SCHEDULE_CORRECTION_1459_2026_06",pass:true},
  {controlId:"CAPITAL_REDUCTION_DECISION_CORRECTION_2321_2026_03",pass:true},
  {controlId:"CASH_CAPITAL_INCREASE_CORRECTION_1342_2026_06",pass:true},
  {controlId:"CASH_CAPITAL_INCREASE_CANCELLATION_1342_2026_07",pass:true},
]};
const authorityMatrix={controls:[
  {controlId:"DIVIDEND_CORRECTION_2467_2026_05",pass:true},
  {controlId:"CAPITAL_REDUCTION_SCHEDULE_CORRECTION_1459_2026_06",pass:true},
  {controlId:"CAPITAL_REDUCTION_DECISION_CORRECTION_2321_2026_03",pass:true},
  {controlId:"CASH_CAPITAL_INCREASE_CORRECTION_1342_2026_06",pass:true},
  {controlId:"CASH_CAPITAL_INCREASE_CANCELLATION_1342_2026_07",pass:true},
]};
const sourceClockSummary={
  sourceReportedVersionClockSemanticsCertified:true,
  knownAtVersionClockCertified:false,
};
const prospectiveAvailabilitySummary={
  publicAvailabilityLatencyCertified:false,
  knownAtVersionClockCertified:false,
};

const receipt=buildSupplementalRevisionBlockerReceiptV0_1({
  sourceAssessments:assessments,
  mopsMatrix,
  sourceClockSummary,
  authorityMatrix,
  prospectiveAvailabilitySummary,
  generatedAt:"2026-10-04T06:00:00Z",
});
assert.equal(receipt.requiredLaneCount,6);
assert.equal(receipt.finalResultReadyCount,6);
assert.equal(receipt.representativeIssuerReadyCount,2);
assert.equal(receipt.representativeAuthorityReadyCount,2);
assert.equal(receipt.supplementalRevisionReadyCount,0);
assert.equal(receipt.revisionCoverageComplete,false);
assert.equal(receipt.blockerCounts.PROSPECTIVE_PUBLIC_AVAILABILITY_NOT_CERTIFIED,6);
assert.equal(receipt.blockerCounts.KNOWN_AT_VERSION_CLOCK_NOT_CERTIFIED,6);
assert.equal(receipt.blockerCounts.BOUNDED_SUPPLEMENTAL_REVISION_HISTORY_NOT_PROVEN,6);
assert.equal(receipt.blockerCounts.CANCELLATION_HISTORY_NOT_COMPLETE,6);
assert.equal(receipt.blockerCounts.REPRESENTATIVE_ISSUER_REVISION_CONTROL_NOT_OBSERVED,4);
assert.equal(receipt.blockerCounts.REPRESENTATIVE_AUTHORITY_ROUTE_NOT_OBSERVED,4);

const twseDividend=receipt.lanes.find((x)=>x.sourceId==="TWSE_EX_RIGHT_DIVIDEND_ACTUAL");
assert.equal(twseDividend.issuerRepresentativeObserved,true);
assert.equal(twseDividend.authorityRepresentativeObserved,true);
assert.equal(twseDividend.blockers.includes("REPRESENTATIVE_ISSUER_REVISION_CONTROL_NOT_OBSERVED"),false);

const twsePar=receipt.lanes.find((x)=>x.sourceId==="TWSE_PAR_VALUE_CHANGE_REFERENCE");
assert.equal(twsePar.issuerRepresentativeObserved,false);
assert.equal(twsePar.authorityRepresentativeObserved,false);

const completeMaps=Object.fromEntries(Object.keys(required).map((id)=>[id,true]));
const impossibleUntilKnownAt=buildSupplementalRevisionBlockerReceiptV0_1({
  sourceAssessments:assessments,
  mopsMatrix,
  sourceClockSummary,
  authorityMatrix,
  prospectiveAvailabilitySummary,
  boundedSupplementalCoverageByLane:completeMaps,
  cancellationHistoryCompleteByLane:completeMaps,
  generatedAt:"2026-10-04T06:00:00Z",
});
assert.equal(impossibleUntilKnownAt.revisionCoverageComplete,false);
assert.equal(impossibleUntilKnownAt.selectionAuthority,false);
assert.equal(impossibleUntilKnownAt.system1RuntimeUsed,false);

console.log("supplemental revision blocker receipt v0.1 tests PASS");
