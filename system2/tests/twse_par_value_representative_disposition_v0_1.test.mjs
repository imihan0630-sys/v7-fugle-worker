import assert from "node:assert/strict";
import {
  buildTwseParValueRepresentativeDispositionV0_1,
  TWSE_PAR_VALUE_REQUIRED_EVIDENCE_V0_1,
} from "../runtime/twse_par_value_representative_disposition_v0_1.mjs";
import { buildSupplementalRevisionProvenanceReceiptV0_5 } from "../runtime/supplemental_revision_provenance_receipt_v0_5.mjs";

const evidence=TWSE_PAR_VALUE_REQUIRED_EVIDENCE_V0_1.map(x=>({
  id:x.id,
  result:x.expectedResult,
  physicallyObserved:true,
  evidenceRef:"TEST:"+x.id,
}));

const disposition=buildTwseParValueRepresentativeDispositionV0_1({
  evidence,
  generatedAt:"2026-10-05T03:10:00+08:00",
});
assert.equal(disposition.researchDispositionComplete,true);
assert.equal(
  disposition.state,
  "HISTORICAL_REPRESENTATIVE_REVISION_CONTROL_NOT_ESTABLISHED_WITHIN_EXHAUSTED_OFFICIAL_PATHS"
);
assert.equal(disposition.passedEvidenceCount,6);
assert.equal(disposition.materiallyDistinctSourceFamilyCount,5);
assert.equal(disposition.representativeAuthorityReadyCount,5);
assert.equal(disposition.representativeControlEstablished,false);
assert.equal(disposition.representativeRoutingCoverageComplete,false);
assert.equal(disposition.absoluteHistoricalNonExistenceClaimed,false);
assert.equal(disposition.structuralHistoricalUnavailabilityProven,false);
assert.equal(disposition.blindRepeatAuthorized,false);
assert.equal(disposition.reopenOnNewOfficialEvidence,true);
assert.equal(disposition.revisionCoverageComplete,false);

const incomplete=buildTwseParValueRepresentativeDispositionV0_1({
  evidence:evidence.slice(0,-1),
  generatedAt:"2026-10-05T03:10:00+08:00",
});
assert.equal(incomplete.researchDispositionComplete,false);
assert.equal(incomplete.state,"REPRESENTATIVE_DISPOSITION_EVIDENCE_INCOMPLETE");
assert.equal(incomplete.representativeAuthorityReadyCount,5);

const lanes=[
  "TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
  "TWSE_CAPITAL_REDUCTION_REFERENCE",
  "TWSE_PAR_VALUE_CHANGE_REFERENCE",
  "TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
  "TPEX_CAPITAL_REDUCTION_REFERENCE",
  "TPEX_PAR_VALUE_CHANGE_REFERENCE",
];
const finalReady=Object.fromEntries(lanes.map(x=>[x,true]));
const representative={
  TWSE_EX_RIGHT_DIVIDEND_ACTUAL:true,
  TWSE_CAPITAL_REDUCTION_REFERENCE:true,
  TWSE_PAR_VALUE_CHANGE_REFERENCE:false,
  TPEX_EX_RIGHT_DIVIDEND_ACTUAL:true,
  TPEX_CAPITAL_REDUCTION_REFERENCE:true,
  TPEX_PAR_VALUE_CHANGE_REFERENCE:true,
};
const bounded=Object.fromEntries(lanes.map(x=>[x,false]));

const receipt=buildSupplementalRevisionProvenanceReceiptV0_5({
  twseParValueDisposition:disposition,
  startDate:"2026-04-05",
  endDate:"2026-10-02",
  generatedAt:"2026-10-05T03:10:00+08:00",
  evidenceRefs:["PR#487","PR#535","PR#594","PR#596","PR#597"],
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

assert.equal(receipt.version,"0.5-RESEARCH");
assert.equal(receipt.representativeAuthorityReadyCount,5);
assert.equal(receipt.representativeRoutingResearchDispositionComplete,true);
assert.equal(receipt.representativeRoutingDispositionedGapCount,1);
assert.equal(receipt.remainingRepresentativeGap,"TWSE_PAR_VALUE_CHANGE_REFERENCE");
assert.equal(
  receipt.remainingRepresentativeGapDisposition,
  "HISTORICAL_CONTROL_NOT_ESTABLISHED_WITHIN_EXHAUSTED_OFFICIAL_PATHS"
);
assert.equal(receipt.representativeRoutingCoverageComplete,false);
assert.equal(receipt.blockerCounts.LANE_REPRESENTATIVE_AUTHORITY_ROUTING_NOT_OBSERVED,1);
assert.equal(receipt.revisionCoverageComplete,false);
assert.equal(receipt.noEventMayBeClaimed,false);
assert.equal(receipt.selectionAuthority,false);
assert.equal(receipt.system1RuntimeUsed,false);

assert.throws(()=>buildSupplementalRevisionProvenanceReceiptV0_5({
  twseParValueDisposition:incomplete,
}),/must be complete/);

console.log("TWSE par-value representative disposition V0.1 and supplemental receipt V0.5 tests PASS");
