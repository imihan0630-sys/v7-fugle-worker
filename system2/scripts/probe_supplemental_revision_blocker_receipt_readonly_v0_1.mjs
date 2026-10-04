import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import { assessOfficialContinuityRevisionSourceV0_1 } from "../runtime/official_continuity_revision_coverage_v0_1.mjs";
import { probeMopsovDirectHistoryV0_1 } from "../runtime/mopsov_direct_history_source_v0_1.mjs";
import {
  MOPS_REVISION_CONTROLS_V0_2,
  summarizeMopsRevisionControlMatrixV0_2,
} from "../runtime/mops_revision_control_matrix_v0_2.mjs";
import {
  certifyMopsovSourceReportedControlV0_1,
  summarizeMopsovSourceReportedClockV0_1,
} from "../runtime/mopsov_source_reported_clock_v0_1.mjs";
import {
  buildMopsovAvailabilityObservationV0_1,
  summarizeMopsovAvailabilityObservationsV0_1,
} from "../runtime/mopsov_prospective_availability_observer_v0_1.mjs";
import { buildRevisionAuthorityProvenanceMatrixV0_1 } from "../runtime/revision_authority_provenance_matrix_v0_1.mjs";
import { buildSupplementalRevisionBlockerReceiptV0_1 } from "../runtime/supplemental_revision_blocker_receipt_v0_1.mjs";

const START="2026-04-05";
const END="2026-10-02";
const fetchedAt=new Date().toISOString();

const urls=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:END});
const officialParsed={};
const sourceAssessments=[];

for(const [sourceId,source] of Object.entries(urls)){
  if(source.sourceClass!=="HISTORICAL_ACTUAL_RESULT_RANGE") continue;
  const response=await fetch(source.url,{
    headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-Supplemental-Revision-Blocker/0.1"},
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
  assert.equal(parsed.responseRangeVerified,true,sourceId+" range");
  assert.equal(parsed.parserComplete,true,sourceId+" parser");
  officialParsed[sourceId]=parsed;
  sourceAssessments.push(assessOfficialContinuityRevisionSourceV0_1({
    sourceId,
    parserComplete:parsed.parserComplete,
    responseRangeVerified:parsed.responseRangeVerified,
    fieldNames:parsed.fieldNames,
    eventCount:parsed.eventCount,
    historicalFirstKnownUnknownCount:parsed.historicalFirstKnownUnknownCount,
  }));
}
assert.equal(sourceAssessments.length,6);
assert.equal(sourceAssessments.filter((x)=>x.finalResultRangeReady).length,6);

const mopsResults=[];
const clockResults=[];
const retrospectiveObservations=[];
for(const control of MOPS_REVISION_CONTROLS_V0_2){
  const result=await probeMopsovDirectHistoryV0_1({
    stockCode:control.stockCode,
    rocYear:control.rocYear,
    month:control.month,
    expectedDate:control.expectedDate,
    baseSubject:control.baseSubject,
    observedAt:fetchedAt,
  });
  mopsResults.push({controlId:control.id,...result});
  clockResults.push(certifyMopsovSourceReportedControlV0_1({
    control,
    rows:result.parsed?.rows||[],
  }));
  for(const row of result.parsed?.rows||[]){
    retrospectiveObservations.push(buildMopsovAvailabilityObservationV0_1({
      controlId:control.id,
      row,
      observedAt:fetchedAt,
      observationMode:"RETROSPECTIVE_READBACK",
      payloadHash:result.historyPayloadHash,
      sourceFetchId:"BLOCKER_RECEIPT:"+control.id,
    }));
  }
}
const mopsMatrix=summarizeMopsRevisionControlMatrixV0_2(mopsResults);
const sourceClockSummary=summarizeMopsovSourceReportedClockV0_1(clockResults);
const prospectiveAvailabilitySummary=summarizeMopsovAvailabilityObservationsV0_1(retrospectiveObservations);
assert.equal(mopsMatrix.passCount,5);
assert.equal(sourceClockSummary.sourceReportedVersionClockSemanticsCertified,true);
assert.equal(prospectiveAvailabilitySummary.prospectiveObservationCount,0);
assert.equal(prospectiveAvailabilitySummary.knownAtVersionClockCertified,false);

const exchangeEvidence=[];
for(const target of [
  {controlId:"DIVIDEND_CORRECTION_2467_2026_05",sourceId:"TWSE_EX_RIGHT_DIVIDEND_ACTUAL",symbol:"2467"},
  {controlId:"CAPITAL_REDUCTION_SCHEDULE_CORRECTION_1459_2026_06",sourceId:"TWSE_CAPITAL_REDUCTION_REFERENCE",symbol:"1459"},
]){
  for(const event of officialParsed[target.sourceId].events.filter((x)=>x.symbol===target.symbol)){
    exchangeEvidence.push({
      controlId:target.controlId,
      sourceId:target.sourceId,
      symbol:target.symbol,
      effectiveDate:event.effectiveDate,
      directEvidence:true,
    });
  }
}

const py=spawnSync("python3",["system2/scripts/probe_sfb_authority_revision_provenance_readonly_v0_1.py"],{
  encoding:"utf8",maxBuffer:24*1024*1024
});
if(py.error) throw py.error;
if(py.status!==0) throw new Error("SFB probe failed: "+String(py.stderr||"").slice(0,1000));
const sfb=JSON.parse(py.stdout);
const regulatorEvidence=(sfb.search?.target1342Rows||[])
  .filter((x)=>/廢止|撤銷|取消/.test(String(x.joined||"")) && /現金增資/.test(String(x.joined||"")))
  .map((x)=>({
    controlId:"CASH_CAPITAL_INCREASE_CANCELLATION_1342_2026_07",
    symbol:"1342",
    statusText:"廢止/撤銷",
    directEvidence:true,
  }));

const authorityMatrix=buildRevisionAuthorityProvenanceMatrixV0_1({
  mopsMatrix,exchangeEvidence,regulatorEvidence,
});
assert.equal(authorityMatrix.frozenAuthorityRoutingCoverageComplete,true);

const receipt=buildSupplementalRevisionBlockerReceiptV0_1({
  sourceAssessments,
  mopsMatrix,
  sourceClockSummary,
  authorityMatrix,
  prospectiveAvailabilitySummary,
  generatedAt:fetchedAt,
});

assert.equal(receipt.requiredLaneCount,6);
assert.equal(receipt.finalResultReadyCount,6);
assert.equal(receipt.representativeIssuerReadyCount,2);
assert.equal(receipt.representativeAuthorityReadyCount,2);
assert.equal(receipt.sourceReportedVersionClockSemanticsCertified,true);
assert.equal(receipt.publicAvailabilityLatencyCertified,false);
assert.equal(receipt.knownAtVersionClockCertified,false);
assert.equal(receipt.supplementalRevisionReadyCount,0);
assert.equal(receipt.revisionCoverageComplete,false);
assert.equal(receipt.blockerCounts.PROSPECTIVE_PUBLIC_AVAILABILITY_NOT_CERTIFIED,6);
assert.equal(receipt.blockerCounts.KNOWN_AT_VERSION_CLOCK_NOT_CERTIFIED,6);
assert.equal(receipt.blockerCounts.REPRESENTATIVE_ISSUER_REVISION_CONTROL_NOT_OBSERVED,4);
assert.equal(receipt.blockerCounts.REPRESENTATIVE_AUTHORITY_ROUTE_NOT_OBSERVED,4);
assert.equal(receipt.selectionAuthority,false);
assert.equal(receipt.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result:"SUPPLEMENTAL_REVISION_BLOCKERS_DECOMPOSED",
  interval:{startDate:START,endDate:END},
  mopsState:mopsMatrix.state,
  sourceClockState:sourceClockSummary.state,
  authorityState:authorityMatrix.state,
  prospectiveObservationCount:prospectiveAvailabilitySummary.prospectiveObservationCount,
  receipt,
},null,2));
