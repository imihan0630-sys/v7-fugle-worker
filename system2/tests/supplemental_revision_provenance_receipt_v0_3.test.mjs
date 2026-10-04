import assert from "node:assert/strict";
import { buildSupplementalRevisionProvenanceReceiptV0_3 } from "../runtime/supplemental_revision_provenance_receipt_v0_3.mjs";

const lanes=[
  "TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
  "TWSE_CAPITAL_REDUCTION_REFERENCE",
  "TWSE_PAR_VALUE_CHANGE_REFERENCE",
  "TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
  "TPEX_CAPITAL_REDUCTION_REFERENCE",
  "TPEX_PAR_VALUE_CHANGE_REFERENCE",
];
const finalReady=Object.fromEntries(lanes.map((x)=>[x,true]));
const representative={
  TWSE_EX_RIGHT_DIVIDEND_ACTUAL:true,
  TWSE_CAPITAL_REDUCTION_REFERENCE:true,
  TWSE_PAR_VALUE_CHANGE_REFERENCE:false,
  TPEX_EX_RIGHT_DIVIDEND_ACTUAL:false,
  TPEX_CAPITAL_REDUCTION_REFERENCE:true,
  TPEX_PAR_VALUE_CHANGE_REFERENCE:true,
};
const bounded=Object.fromEntries(lanes.map((x)=>[x,false]));

const receipt=buildSupplementalRevisionProvenanceReceiptV0_3({
  startDate:"2026-04-05",endDate:"2026-10-02",generatedAt:"2026-10-04T07:50:00Z",
  evidenceRefs:["PR#487","PR#503","PR#518"],
  finalResultLaneReadiness:finalReady,
  mopsQueryIntegrity:{
    monthShardReconciliationVerified:true,
    multiControlReconciliationVerified:true,
    emptyMonthSemanticsCertified:true,
    highRowStressVerified:true,
  },
  sourceClockEvidence:{
    sourceReportedVersionClockSemanticsCertified:true,
    publicAvailabilityLatencyCertified:false,
    knownAtVersionClockCertified:false,
    pitReplayUseAsAvailableAtAuthorized:false,
  },
  authorityEvidence:{
    frozenAuthorityRoutingCoverageComplete:true,
    authorityRevisionCoverageComplete:false,
  },
  representativeAuthorityLaneCoverage:representative,
  boundedRevisionHistoryCoverageByLane:bounded,
});

assert.equal(receipt.version,"0.3-RESEARCH");
assert.equal(receipt.evidenceStateVersion,"REPRESENTATIVE_AUTHORITY_4_OF_6");
assert.equal(receipt.representativeAuthorityReadyCount,4);
assert.equal(receipt.blockerCounts.LANE_REPRESENTATIVE_AUTHORITY_ROUTING_NOT_OBSERVED,2);
assert.equal(receipt.blockerCounts.PUBLIC_AVAILABILITY_LATENCY_NOT_CERTIFIED,6);
assert.equal(receipt.blockerCounts.KNOWN_AT_VERSION_CLOCK_NOT_CERTIFIED,6);
assert.equal(receipt.supplementalRevisionReadyCount,0);
assert.equal(receipt.revisionCoverageComplete,false);
assert.equal(receipt.selectionAuthority,false);

console.log("supplemental revision provenance receipt V0.3 tests PASS");
