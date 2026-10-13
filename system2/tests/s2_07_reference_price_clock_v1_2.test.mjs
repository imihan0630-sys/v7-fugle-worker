import assert from "node:assert/strict";
import {
  classifyReferencePriceClockRowV1_2,
  evaluateReferencePriceVersionClockV1_2,
} from "../runtime/s2_07_reference_price_clock_v1_2.mjs";

const base={
  symbol:"4806",
  family:"CAPITAL_REDUCTION",
  effectiveDate:"2026-10-02",
  officialEventVersionId:"S2-CA-EVENT:test",
  officialSourceRowHash:"a".repeat(64),
  preActionClose:10.4,
  officialReferencePrice:14.87,
  queryIntegrityExact:true,
};

const schedule={
  date:"2026-09-08",time:"17:03:24",seqNo:"1",
  rowText:"4806 桂田文創 115/09/08 17:03:24 公告本公司減資換發股票作業計畫，預計115/10/02恢復買賣",
};
const pair={
  date:"2026-09-23",time:"08:10:00",seqNo:"2",
  rowText:"4806 桂田文創 減資恢復買賣參考價14.87，最後交易日收盤價10.4",
  correctionOrCancellationHint:false,
};

const classified=classifyReferencePriceClockRowV1_2(pair,{
  symbol:"4806",preActionClose:10.4,officialReferencePrice:14.87,
});
assert.equal(classified.evidenceClass,"REFERENCE_PAIR_EVIDENCE");
assert.equal(classified.sourceReportedAt,"2026-09-23T00:10:00.000Z");

const notProven=evaluateReferencePriceVersionClockV1_2({...base,mopsRows:[schedule]});
assert.equal(notProven.state,"REFERENCE_PRICE_VERSION_CLOCK_NOT_PROVEN");
assert.equal(notProven.referencePairTimestampCandidateObserved,false);
assert.equal(notProven.knownAtVersionClockCertified,false);
assert.equal(notProven.firstKnownAt,null);
assert.ok(notProven.blockers.includes("OFFICIAL_REFERENCE_PRICE_NOT_OBSERVED_IN_TIMESTAMPED_MOPS_ROWS"));

const candidate=evaluateReferencePriceVersionClockV1_2({...base,mopsRows:[schedule,pair]});
assert.equal(candidate.state,"REFERENCE_PAIR_TIMESTAMP_CANDIDATE_OBSERVED_REVIEW_REQUIRED");
assert.equal(candidate.referencePairTimestampCandidateObserved,true);
assert.equal(candidate.earliestReferencePairSourceReportedAt,"2026-09-23T00:10:00.000Z");
assert.equal(candidate.historicalAvailabilityProven,false);
assert.equal(candidate.knownAtVersionClockCertified,false);
assert.equal(candidate.pitEventReplayEligible,false);
assert.equal(candidate.technicalContinuityCertified,false);
assert.equal(candidate.selectionAuthority,false);
assert.equal(candidate.system1RuntimeUsed,false);

const badIntegrity=evaluateReferencePriceVersionClockV1_2({...base,mopsRows:[pair],queryIntegrityExact:false});
assert.equal(badIntegrity.state,"REFERENCE_PRICE_VERSION_CLOCK_NOT_PROVEN");
assert.ok(badIntegrity.blockers.includes("MOPS_QUERY_INTEGRITY_NOT_EXACT"));

const priceOnly={...pair,rowText:"4806 桂田文創 減資恢復買賣參考價14.87"};
const priceOnlyResult=evaluateReferencePriceVersionClockV1_2({...base,mopsRows:[priceOnly]});
assert.equal(priceOnlyResult.referencePriceEvidenceRowCount,1);
assert.equal(priceOnlyResult.referencePairEvidenceRowCount,0);
assert.ok(priceOnlyResult.blockers.includes("OFFICIAL_REFERENCE_PAIR_NOT_OBSERVED_IN_SINGLE_TIMESTAMPED_MOPS_ROW"));
assert.equal(priceOnlyResult.knownAtVersionClockCertified,false);

console.log("S2-07 reference-price version-clock V1.2 tests PASS");
