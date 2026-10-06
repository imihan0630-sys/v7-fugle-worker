import assert from "node:assert/strict";
import {evaluateReferencePriceReconstructionV1_3} from "../runtime/s2_07_reference_reconstruction_v1_3.mjs";

const current=evaluateReferencePriceReconstructionV1_3({
  symbol:"4806",
  family:"CAPITAL_REDUCTION",
  resumeOpenCutoffAt:"2026-10-02T09:00:00+08:00",
  preActionClose:10.4,
  preCloseAvailableAt:"2026-10-04T15:49:07.565Z",
  preClosePitAvailabilityClass:"OBSERVED_AVAILABLE_UPPER_BOUND",
  preClosePitReplayEligible:true,
  approvedNewSharesPer1000:699.6112203,
  approvedRatioSourceReportedAt:"2026-09-08T17:03:24+08:00",
  ratioSourceVersionKey:"2026-09-08|17:03:24|1",
  ratioSourcePayloadHash:"a".repeat(64),
  ratioPublicAvailabilityCertified:false,
  officialReferencePrice:14.87,
});
assert.equal(current.reconstruction.reconstructedReferencePrice,14.87);
assert.equal(current.reconstruction.geometryMatchesOfficial,true);
assert.equal(current.reconstruction.mechanicallyProven,true);
assert.equal(current.clocks.ratioSourceReportedBeforeCutoff,true);
assert.equal(current.clocks.preCloseObservedBeforeCutoff,false);
assert.equal(current.state,"REFERENCE_RECONSTRUCTION_MECHANICALLY_PROVEN_PIT_BLOCKED");
assert.ok(current.blockers.includes("APPROVED_RATIO_PUBLIC_AVAILABILITY_NOT_CERTIFIED"));
assert.ok(current.blockers.includes("PRE_ACTION_CLOSE_AVAILABLE_AFTER_RESUME_CUTOFF"));
assert.equal(current.knownAtVersionClockCertified,false);
assert.equal(current.firstKnownAt,null);
assert.equal(current.pitEventReplayEligible,false);
assert.equal(current.technicalContinuityCertified,false);
assert.equal(current.selectionAuthority,false);

const futureCandidate=evaluateReferencePriceReconstructionV1_3({
  symbol:"4806",family:"CAPITAL_REDUCTION",
  resumeOpenCutoffAt:"2026-10-02T09:00:00+08:00",
  preActionClose:10.4,
  preCloseAvailableAt:"2026-09-22T14:30:00+08:00",
  preClosePitAvailabilityClass:"CONSERVATIVE_SESSION_FINALITY",
  preClosePitReplayEligible:true,
  approvedNewSharesPer1000:699.6112203,
  approvedRatioSourceReportedAt:"2026-09-08T17:03:24+08:00",
  ratioSourceVersionKey:"2026-09-08|17:03:24|1",
  ratioSourcePayloadHash:"b".repeat(64),
  ratioPublicAvailabilityCertified:true,
  officialReferencePrice:14.87,
});
assert.equal(futureCandidate.state,"REFERENCE_RECONSTRUCTION_CLOCK_CANDIDATE_REVIEW_REQUIRED");
assert.equal(futureCandidate.clocks.pitInputClocksReady,true);
assert.equal(futureCandidate.knownAtVersionClockCertified,false);
assert.equal(futureCandidate.pitTechnicalContinuityReplayEligible,false);

const wrongGeometry=evaluateReferencePriceReconstructionV1_3({
  symbol:"4806",family:"CAPITAL_REDUCTION",
  resumeOpenCutoffAt:"2026-10-02T09:00:00+08:00",
  preActionClose:10.4,
  preCloseAvailableAt:"2026-09-22T14:30:00+08:00",
  preClosePitAvailabilityClass:"CONSERVATIVE_SESSION_FINALITY",
  preClosePitReplayEligible:true,
  approvedNewSharesPer1000:700,
  approvedRatioSourceReportedAt:"2026-09-08T17:03:24+08:00",
  ratioSourceVersionKey:"2026-09-08|17:03:24|1",
  ratioSourcePayloadHash:"c".repeat(64),
  ratioPublicAvailabilityCertified:true,
  officialReferencePrice:14.87,
});
assert.equal(wrongGeometry.state,"REFERENCE_RECONSTRUCTION_NOT_PROVEN");
assert.ok(wrongGeometry.blockers.includes("REFERENCE_RECONSTRUCTION_DOES_NOT_MATCH_OFFICIAL"));

console.log("S2-07 reference reconstruction V1.3 tests PASS");
