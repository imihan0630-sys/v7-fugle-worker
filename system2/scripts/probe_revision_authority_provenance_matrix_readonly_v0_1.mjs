import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { probeMopsovDirectHistoryV0_1 } from "../runtime/mopsov_direct_history_source_v0_1.mjs";
import {
  MOPS_REVISION_CONTROLS_V0_2,
  summarizeMopsRevisionControlMatrixV0_2,
} from "../runtime/mops_revision_control_matrix_v0_2.mjs";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import { buildRevisionAuthorityProvenanceMatrixV0_1 } from "../runtime/revision_authority_provenance_matrix_v0_1.mjs";

const START="2026-01-01";
const END="2026-10-02";
const fetchedAt=new Date().toISOString();

const mopsResults=[];
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
}
const mopsMatrix=summarizeMopsRevisionControlMatrixV0_2(mopsResults);
assert.equal(mopsMatrix.passCount,5);

const urls=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:END});
const exchangeTargets=[
  {
    controlId:"DIVIDEND_CORRECTION_2467_2026_05",
    sourceId:"TWSE_EX_RIGHT_DIVIDEND_ACTUAL",
    symbol:"2467",
  },
  {
    controlId:"CAPITAL_REDUCTION_SCHEDULE_CORRECTION_1459_2026_06",
    sourceId:"TWSE_CAPITAL_REDUCTION_REFERENCE",
    symbol:"1459",
  },
];
const exchangeEvidence=[];
const exchangeDiagnostics=[];

for(const target of exchangeTargets){
  const source=urls[target.sourceId];
  const response=await fetch(source.url,{
    headers:{
      accept:"application/json,text/plain,*/*",
      "user-agent":"System2-Revision-Authority-Provenance/0.1",
    },
    signal:AbortSignal.timeout(30000),
  });
  const rawText=await response.text();
  assert.equal(response.ok,true,target.sourceId+" HTTP "+response.status);
  const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
    sourceId:target.sourceId,
    sourceUrl:source.url,
    rawText,
    fetchedAt,
    requestedStartDate:START,
    requestedEndDate:END,
  });
  assert.equal(parsed.responseRangeVerified,true);
  assert.equal(parsed.parserComplete,true);
  const matches=parsed.events.filter((x)=>x.symbol===target.symbol);
  for(const event of matches){
    exchangeEvidence.push({
      controlId:target.controlId,
      sourceId:target.sourceId,
      symbol:target.symbol,
      effectiveDate:event.effectiveDate,
      directEvidence:true,
      eventVersionId:event.eventVersionId,
    });
  }
  exchangeDiagnostics.push({
    ...target,
    parserState:parsed.state,
    eventCount:parsed.eventCount,
    matchingSymbolEventCount:matches.length,
    matchingEffectiveDates:matches.map((x)=>x.effectiveDate).sort(),
  });
}

const py=spawnSync("python3",[
  "system2/scripts/probe_sfb_authority_revision_provenance_readonly_v0_1.py"
],{encoding:"utf8",maxBuffer:24*1024*1024});
if(py.error) throw py.error;
if(py.status!==0) throw new Error("SFB probe failed: "+String(py.stderr||"").slice(0,1000));
const sfb=JSON.parse(py.stdout);
assert.equal(sfb.sourceCapabilityReady,true);
const targetRows=sfb.search?.target1342Rows||[];
const regulatorEvidence=targetRows
  .filter((x)=>/廢止|撤銷|取消/.test(String(x.joined||"")) && /現金增資/.test(String(x.joined||"")))
  .map((x)=>({
    controlId:"CASH_CAPITAL_INCREASE_CANCELLATION_1342_2026_07",
    symbol:"1342",
    statusText:"廢止/撤銷",
    directEvidence:true,
    rowNumber:x.rowNumber,
    joined:x.joined,
  }));

const matrix=buildRevisionAuthorityProvenanceMatrixV0_1({
  mopsMatrix,
  exchangeEvidence,
  regulatorEvidence,
});

assert.equal(matrix.frozenControlCount,5);
assert.equal(matrix.frozenControlPassCount,5);
assert.equal(matrix.frozenAuthorityRoutingCoverageComplete,true);
assert.equal(matrix.authorityRevisionCoverageComplete,false);
assert.equal(matrix.knownAtVersionClockCertified,false);
assert.equal(matrix.revisionCoverageComplete,false);
assert.equal(matrix.selectionAuthority,false);
assert.equal(matrix.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result:matrix.state,
  interval:{startDate:START,endDate:END},
  mops:{
    state:mopsMatrix.state,
    passCount:mopsMatrix.passCount,
    controlCount:mopsMatrix.controlCount,
  },
  exchangeDiagnostics,
  regulator:{
    sourceCapabilityReady:sfb.sourceCapabilityReady,
    targetAuthorityEvidenceDirectlyObserved:sfb.targetAuthorityEvidenceDirectlyObserved,
    matchingRevocationRows:regulatorEvidence,
  },
  matrix,
},null,2));
