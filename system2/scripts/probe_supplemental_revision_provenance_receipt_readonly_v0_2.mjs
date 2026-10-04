import assert from "node:assert/strict";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import { REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_2 } from "../runtime/revision_authority_provenance_matrix_v0_2.mjs";
import { MOPS_REVISION_CONTROLS_V0_3 } from "../runtime/mops_revision_control_matrix_v0_3.mjs";
import { buildSupplementalRevisionProvenanceReceiptV0_2 } from "../runtime/supplemental_revision_provenance_receipt_v0_2.mjs";

const START="2026-04-05";
const END="2026-10-02";
const fetchedAt=new Date().toISOString();

assert.equal(MOPS_REVISION_CONTROLS_V0_3.length,6);
assert.equal(REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_2.length,6);
assert.ok(MOPS_REVISION_CONTROLS_V0_3.some((x)=>
  x.stockCode==="3152" &&
  x.laneSourceId==="TPEX_CAPITAL_REDUCTION_REFERENCE" &&
  Array.isArray(x.months) &&
  x.months.join(",")==="1,5"
));
assert.ok(REVISION_AUTHORITY_CONTROL_CONTRACTS_V0_2.some((x)=>
  x.symbol==="3152" &&
  x.requiredRoles.some((r)=>
    r.role==="EXCHANGE" &&
    r.sourceId==="TPEX_CAPITAL_REDUCTION_REFERENCE" &&
    r.expectedEffectiveDate==="2026-06-30"
  )
));

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
      "user-agent":"System2-Supplemental-Revision-Provenance-Receipt/0.2",
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
    eventCount:parsed.eventCount,
    responseRangeVerified:parsed.responseRangeVerified,
    parserComplete:parsed.parserComplete,
  });
}
assert.equal(Object.values(finalResultLaneReadiness).filter(Boolean).length,6);

const representativeAuthorityLaneCoverage={
  TWSE_EX_RIGHT_DIVIDEND_ACTUAL:true,
  TWSE_CAPITAL_REDUCTION_REFERENCE:true,
  TWSE_PAR_VALUE_CHANGE_REFERENCE:false,
  TPEX_EX_RIGHT_DIVIDEND_ACTUAL:false,
  TPEX_CAPITAL_REDUCTION_REFERENCE:true,
  TPEX_PAR_VALUE_CHANGE_REFERENCE:false,
};
const boundedRevisionHistoryCoverageByLane=Object.fromEntries(
  Object.keys(finalResultLaneReadiness).map((sourceId)=>[sourceId,false])
);

const receipt=buildSupplementalRevisionProvenanceReceiptV0_2({
  startDate:START,
  endDate:END,
  generatedAt:fetchedAt,
  evidenceRefs:[
    "PR#487:b75376bb4741ea6ca7eec6c7f09bd32056dcf162",
    "PR#497:e49ed821312fd20d5f281e25e8aadc9198751d84",
    "PR#502:13bd801a6eeb06aa81f8ffde9ce00d794c629247",
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

assert.equal(receipt.finalResultReadyCount,6);
assert.equal(receipt.representativeAuthorityReadyCount,3);
assert.equal(receipt.supplementalRevisionReadyCount,0);
assert.equal(receipt.blockerCounts.LANE_REPRESENTATIVE_AUTHORITY_ROUTING_NOT_OBSERVED,3);
assert.equal(receipt.blockerCounts.PUBLIC_AVAILABILITY_LATENCY_NOT_CERTIFIED,6);
assert.equal(receipt.blockerCounts.KNOWN_AT_VERSION_CLOCK_NOT_CERTIFIED,6);
assert.equal(receipt.blockerCounts.AUTHORITY_REVISION_BOUNDED_COVERAGE_INCOMPLETE,6);
assert.equal(receipt.blockerCounts.BOUNDED_REVISION_HISTORY_COVERAGE_INCOMPLETE,6);
assert.equal(receipt.revisionCoverageComplete,false);
assert.equal(receipt.selectionAuthority,false);
assert.equal(receipt.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result:"PASS_REPRESENTATIVE_AUTHORITY_3_OF_6",
  observedAt:fetchedAt,
  finalResultDiagnostics,
  receipt,
  remainingRepresentativeRoutingGaps:receipt.laneResults
    .filter((x)=>x.representativeAuthorityObserved!==true)
    .map((x)=>x.sourceId),
},null,2));
