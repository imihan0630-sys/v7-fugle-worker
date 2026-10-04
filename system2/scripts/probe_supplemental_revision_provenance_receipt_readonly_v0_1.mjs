import assert from "node:assert/strict";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import { buildSupplementalRevisionProvenanceReceiptV0_1 } from "../runtime/supplemental_revision_provenance_receipt_v0_1.mjs";

const START="2026-04-05";
const END="2026-10-02";
const fetchedAt=new Date().toISOString();

const sources=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:END});
const historical=Object.entries(sources).filter(([,source])=>
  source.sourceClass==="HISTORICAL_ACTUAL_RESULT_RANGE"
);
assert.equal(historical.length,6);

const finalResultLaneReadiness={};
const finalResultDiagnostics=[];
for(const [sourceId,source] of historical){
  const response=await fetch(source.url,{
    headers:{
      accept:"application/json,text/plain,*/*",
      "user-agent":"System2-Supplemental-Revision-Provenance-Receipt/0.1",
    },
    signal:AbortSignal.timeout(30000),
  });
  const rawText=await response.text();
  assert.equal(response.ok,true,sourceId+" HTTP "+response.status);
  const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
    sourceId,
    sourceUrl:source.url,
    rawText,
    fetchedAt,
    requestedStartDate:START,
    requestedEndDate:END,
  });
  const ready=
    parsed.responseRangeVerified===true &&
    parsed.parserComplete===true &&
    parsed.state==="PARSED";
  finalResultLaneReadiness[sourceId]=ready;
  finalResultDiagnostics.push({
    sourceId,
    state:parsed.state,
    responseRangeVerified:parsed.responseRangeVerified,
    parserComplete:parsed.parserComplete,
    eventCount:parsed.eventCount,
  });
}
assert.equal(Object.values(finalResultLaneReadiness).filter(Boolean).length,6);

const representativeAuthorityLaneCoverage={
  TWSE_EX_RIGHT_DIVIDEND_ACTUAL:true,
  TWSE_CAPITAL_REDUCTION_REFERENCE:true,
  TWSE_PAR_VALUE_CHANGE_REFERENCE:false,
  TPEX_EX_RIGHT_DIVIDEND_ACTUAL:false,
  TPEX_CAPITAL_REDUCTION_REFERENCE:false,
  TPEX_PAR_VALUE_CHANGE_REFERENCE:false,
};
const boundedRevisionHistoryCoverageByLane=Object.fromEntries(
  Object.keys(finalResultLaneReadiness).map((sourceId)=>[sourceId,false])
);

const receipt=buildSupplementalRevisionProvenanceReceiptV0_1({
  startDate:START,
  endDate:END,
  generatedAt:fetchedAt,
  evidenceRefs:[
    "PR#446:636305f79ecde412b27177dc677578d6116bc7d6",
    "PR#448:8c1f9746ffe0593797403a5bc45c1cfbd68e0a35",
    "PR#452:35c7448baf7ef5790b0d5798e23d0ee4653207d1",
    "PR#455:3772f6332465a5912d1ca32314c322b455685d18",
    "PR#471:07aac29e0bc239feb8c756c88095837722512fa8",
    "PR#475:a9dc408e1303f0470359f77dff6f833379862355",
    "PR#480:4fd9e3fa0cbb8f0cb20193d74ebb09035d58085d",
    "PR#483:4c8ecd468632d51e25e93beab2eb9e50ef5d29a6",
  ],
  finalResultLaneReadiness,
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
  representativeAuthorityLaneCoverage,
  boundedRevisionHistoryCoverageByLane,
});

assert.equal(receipt.requiredLaneCount,6);
assert.equal(receipt.finalResultReadyCount,6);
assert.equal(receipt.representativeAuthorityReadyCount,2);
assert.equal(receipt.supplementalRevisionReadyCount,0);
assert.equal(receipt.revisionCoverageComplete,false);
assert.equal(receipt.blockerCounts.PUBLIC_AVAILABILITY_LATENCY_NOT_CERTIFIED,6);
assert.equal(receipt.blockerCounts.KNOWN_AT_VERSION_CLOCK_NOT_CERTIFIED,6);
assert.equal(receipt.blockerCounts.LANE_REPRESENTATIVE_AUTHORITY_ROUTING_NOT_OBSERVED,4);
assert.equal(receipt.blockerCounts.AUTHORITY_REVISION_BOUNDED_COVERAGE_INCOMPLETE,6);
assert.equal(receipt.blockerCounts.BOUNDED_REVISION_HISTORY_COVERAGE_INCOMPLETE,6);
assert.equal(receipt.noEventMayBeClaimed,false);
assert.equal(receipt.technicalContinuityCertified,false);
assert.equal(receipt.selectionAuthority,false);
assert.equal(receipt.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result:"PASS_BLOCKER_DECOMPOSITION",
  finalResultDiagnostics,
  receipt,
},null,2));
