import assert from "node:assert/strict";
import { buildSupplementalRevisionProvenanceReceiptV0_2 } from "../runtime/supplemental_revision_provenance_receipt_v0_2.mjs";

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
  TPEX_PAR_VALUE_CHANGE_REFERENCE:false,
};
const bounded=Object.fromEntries(lanes.map((x)=>[x,false]));

const receipt=buildSupplementalRevisionProvenanceReceiptV0_2({
  startDate:"2026-04-05",
  endDate:"2026-10-02",
  generatedAt:"2026-10-04T06:20:00Z",
  evidenceRefs:["PR#487","PR#497","PR#502"],
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

assert.equal(receipt.schemaVersion,"S2_SUPPLEMENTAL_REVISION_PROVENANCE_RECEIPT_V0_2");
assert.equal(receipt.version,"0.2-RESEARCH");
assert.equal(receipt.priorReceiptVersion,"0.1-RESEARCH");
assert.equal(receipt.evidenceStateVersion,"REPRESENTATIVE_AUTHORITY_3_OF_6");
assert.equal(receipt.requiredLaneCount,6);
assert.equal(receipt.finalResultReadyCount,6);
assert.equal(receipt.representativeAuthorityReadyCount,3);
assert.equal(receipt.supplementalRevisionReadyCount,0);
assert.equal(receipt.blockerCounts.LANE_REPRESENTATIVE_AUTHORITY_ROUTING_NOT_OBSERVED,3);
assert.equal(receipt.blockerCounts.PUBLIC_AVAILABILITY_LATENCY_NOT_CERTIFIED,6);
assert.equal(receipt.blockerCounts.KNOWN_AT_VERSION_CLOCK_NOT_CERTIFIED,6);
assert.equal(receipt.blockerCounts.AUTHORITY_REVISION_BOUNDED_COVERAGE_INCOMPLETE,6);
assert.equal(receipt.blockerCounts.BOUNDED_REVISION_HISTORY_COVERAGE_INCOMPLETE,6);
assert.equal(receipt.revisionCoverageComplete,false);
assert.equal(receipt.noEventMayBeClaimed,false);
assert.equal(receipt.technicalContinuityCertified,false);
assert.equal(receipt.selectionAuthority,false);
assert.equal(receipt.system1RuntimeUsed,false);

const tpexReduction=receipt.laneResults.find((x)=>x.sourceId==="TPEX_CAPITAL_REDUCTION_REFERENCE");
assert.equal(tpexReduction.representativeAuthorityObserved,true);
assert.equal(tpexReduction.blockers.includes("LANE_REPRESENTATIVE_AUTHORITY_ROUTING_NOT_OBSERVED"),false);

console.log("supplemental revision provenance receipt V0.2 tests PASS");
