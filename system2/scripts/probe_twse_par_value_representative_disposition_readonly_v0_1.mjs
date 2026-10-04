import assert from "node:assert/strict";
import { buildTwseParValueRepresentativeDispositionV0_1 } from "../runtime/twse_par_value_representative_disposition_v0_1.mjs";
import { buildSupplementalRevisionProvenanceReceiptV0_5 } from "../runtime/supplemental_revision_provenance_receipt_v0_5.mjs";

const evidence=[
  {
    id:"FINAL_RESULT_DERIVED_2020_2026",
    result:"NEGATIVE_NO_REVISION_CHAIN",
    physicallyObserved:true,
    evidenceRef:"PR#518:5cbe141dd0b0091b0bb4f23d5a27b22696c921d4",
  },
  {
    id:"FINAL_RESULT_ENDPOINT_2010_2019",
    result:"ZERO_OFFICIAL_PAR_VALUE_EVENTS",
    physicallyObserved:true,
    evidenceRef:"PR#528:a0b0fbb26a4038e1f986a106ef92422a946ecfd2",
  },
  {
    id:"STARRED_PRE2020_ISSUER_SCAN",
    result:"NEGATIVE_NO_REVISION_CHAIN",
    physicallyObserved:true,
    evidenceRef:"commit:1763e905fd9f1affb951643920c767c2108adcd4",
  },
  {
    id:"MOPS_U04_2025_FROZEN",
    result:"NEGATIVE_NO_QUALIFYING_ROWS",
    physicallyObserved:true,
    evidenceRef:"PR#577:8d4193acd57405b7ba4f6fe2c778850e3bbf0a0a",
  },
  {
    id:"TWTB7U_HISTORICAL_DATE",
    result:"HISTORICAL_DATE_NOT_OBSERVED",
    physicallyObserved:true,
    evidenceRef:"PR#594:8270b254f1232df98d97792d4fba4b5b27b00882",
  },
  {
    id:"TWSE_OFFICIAL_DOCUMENT_2025",
    result:"BOUNDED_NEGATIVE_NO_REVISION_ROWS",
    physicallyObserved:true,
    evidenceRef:"PR#597:b0926c880ae8fb8900a3d8f0a62cc0591d568e60",
  },
];

const generatedAt=new Date().toISOString();
const disposition=buildTwseParValueRepresentativeDispositionV0_1({evidence,generatedAt});
assert.equal(disposition.researchDispositionComplete,true);
assert.equal(disposition.representativeAuthorityReadyCount,5);
assert.equal(disposition.representativeControlEstablished,false);
assert.equal(disposition.absoluteHistoricalNonExistenceClaimed,false);

const lanes=[
  "TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
  "TWSE_CAPITAL_REDUCTION_REFERENCE",
  "TWSE_PAR_VALUE_CHANGE_REFERENCE",
  "TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
  "TPEX_CAPITAL_REDUCTION_REFERENCE",
  "TPEX_PAR_VALUE_CHANGE_REFERENCE",
];
const receipt=buildSupplementalRevisionProvenanceReceiptV0_5({
  twseParValueDisposition:disposition,
  startDate:"2026-04-05",
  endDate:"2026-10-02",
  generatedAt,
  evidenceRefs:evidence.map(x=>x.evidenceRef),
  finalResultLaneReadiness:Object.fromEntries(lanes.map(x=>[x,true])),
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
  representativeAuthorityLaneCoverage:{
    TWSE_EX_RIGHT_DIVIDEND_ACTUAL:true,
    TWSE_CAPITAL_REDUCTION_REFERENCE:true,
    TWSE_PAR_VALUE_CHANGE_REFERENCE:false,
    TPEX_EX_RIGHT_DIVIDEND_ACTUAL:true,
    TPEX_CAPITAL_REDUCTION_REFERENCE:true,
    TPEX_PAR_VALUE_CHANGE_REFERENCE:true,
  },
  boundedRevisionHistoryCoverageByLane:Object.fromEntries(lanes.map(x=>[x,false])),
});

assert.equal(receipt.representativeAuthorityReadyCount,5);
assert.equal(receipt.representativeRoutingResearchDispositionComplete,true);
assert.equal(receipt.representativeRoutingCoverageComplete,false);
assert.equal(receipt.revisionCoverageComplete,false);
assert.equal(receipt.selectionAuthority,false);
assert.equal(receipt.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result:"TWSE_PAR_VALUE_REPRESENTATIVE_SEARCH_DISPOSITIONED_AT_5_OF_6",
  observedAt:generatedAt,
  disposition,
  receipt:{
    version:receipt.version,
    evidenceStateVersion:receipt.evidenceStateVersion,
    representativeAuthorityReadyCount:receipt.representativeAuthorityReadyCount,
    representativeRoutingResearchDispositionComplete:receipt.representativeRoutingResearchDispositionComplete,
    representativeRoutingDispositionedGapCount:receipt.representativeRoutingDispositionedGapCount,
    remainingRepresentativeGap:receipt.remainingRepresentativeGap,
    remainingRepresentativeGapDisposition:receipt.remainingRepresentativeGapDisposition,
    representativeRoutingCoverageComplete:receipt.representativeRoutingCoverageComplete,
    blockerCounts:receipt.blockerCounts,
    revisionCoverageComplete:receipt.revisionCoverageComplete,
  },
},null,2));
