import assert from "node:assert/strict";
import { buildSupplementalRevisionProvenanceReceiptV0_1 } from "../runtime/supplemental_revision_provenance_receipt_v0_1.mjs";

const finalReady={
  TWSE_EX_RIGHT_DIVIDEND_ACTUAL:true,
  TWSE_CAPITAL_REDUCTION_REFERENCE:true,
  TWSE_PAR_VALUE_CHANGE_REFERENCE:true,
  TPEX_EX_RIGHT_DIVIDEND_ACTUAL:true,
  TPEX_CAPITAL_REDUCTION_REFERENCE:true,
  TPEX_PAR_VALUE_CHANGE_REFERENCE:true,
};
const representative={
  TWSE_EX_RIGHT_DIVIDEND_ACTUAL:true,
  TWSE_CAPITAL_REDUCTION_REFERENCE:true,
  TWSE_PAR_VALUE_CHANGE_REFERENCE:false,
  TPEX_EX_RIGHT_DIVIDEND_ACTUAL:false,
  TPEX_CAPITAL_REDUCTION_REFERENCE:false,
  TPEX_PAR_VALUE_CHANGE_REFERENCE:false,
};
const bounded=Object.fromEntries(Object.keys(finalReady).map((x)=>[x,false]));

const current=buildSupplementalRevisionProvenanceReceiptV0_1({
  startDate:"2026-04-05",
  endDate:"2026-10-02",
  generatedAt:"2026-10-04T06:00:00Z",
  evidenceRefs:["PR#446","PR#448","PR#452","PR#455","PR#471","PR#475","PR#480","PR#483"],
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

assert.equal(current.requiredLaneCount,6);
assert.equal(current.finalResultReadyCount,6);
assert.equal(current.representativeAuthorityReadyCount,2);
assert.equal(current.supplementalRevisionReadyCount,0);
assert.equal(current.queryIntegrityReady,true);
assert.equal(current.sourceReportedClockReady,true);
assert.equal(current.publicAvailabilityLatencyCertified,false);
assert.equal(current.knownAtVersionClockCertified,false);
assert.equal(current.frozenAuthorityRoutingCoverageComplete,true);
assert.equal(current.authorityRevisionCoverageComplete,false);
assert.equal(current.revisionCoverageComplete,false);
assert.equal(current.blockerCounts.PUBLIC_AVAILABILITY_LATENCY_NOT_CERTIFIED,6);
assert.equal(current.blockerCounts.KNOWN_AT_VERSION_CLOCK_NOT_CERTIFIED,6);
assert.equal(current.blockerCounts.AUTHORITY_REVISION_BOUNDED_COVERAGE_INCOMPLETE,6);
assert.equal(current.blockerCounts.BOUNDED_REVISION_HISTORY_COVERAGE_INCOMPLETE,6);
assert.equal(current.blockerCounts.LANE_REPRESENTATIVE_AUTHORITY_ROUTING_NOT_OBSERVED,4);
assert.equal(current.selectionAuthority,false);
assert.equal(current.system1RuntimeUsed,false);

const futureComplete=buildSupplementalRevisionProvenanceReceiptV0_1({
  startDate:"2026-04-05",
  endDate:"2026-10-02",
  generatedAt:"2026-10-04T06:00:00Z",
  finalResultLaneReadiness:finalReady,
  mopsQueryIntegrity:{
    monthShardReconciliationVerified:true,
    multiControlReconciliationVerified:true,
    emptyMonthSemanticsCertified:true,
    highRowStressVerified:true,
  },
  sourceClockEvidence:{
    sourceReportedVersionClockSemanticsCertified:true,
    publicAvailabilityLatencyCertified:true,
    knownAtVersionClockCertified:true,
    pitReplayUseAsAvailableAtAuthorized:true,
  },
  authorityEvidence:{
    frozenAuthorityRoutingCoverageComplete:true,
    authorityRevisionCoverageComplete:true,
  },
  representativeAuthorityLaneCoverage:Object.fromEntries(Object.keys(finalReady).map((x)=>[x,true])),
  boundedRevisionHistoryCoverageByLane:Object.fromEntries(Object.keys(finalReady).map((x)=>[x,true])),
});
assert.equal(futureComplete.revisionCoverageComplete,true);
assert.equal(futureComplete.supplementalRevisionReadyCount,6);
assert.equal(futureComplete.noEventMayBeClaimed,false);
assert.equal(futureComplete.technicalContinuityCertified,false);

console.log("supplemental revision provenance receipt v0.1 tests PASS");
