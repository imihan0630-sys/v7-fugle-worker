import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { probeMopsovDirectHistoryV0_1 } from "../runtime/mopsov_direct_history_source_v0_1.mjs";
import {
  MOPS_REVISION_CONTROLS_V0_3,
  combineMultiMonthMopsRevisionControlResultV0_3,
  summarizeMopsRevisionControlMatrixV0_3,
} from "../runtime/mops_revision_control_matrix_v0_3.mjs";
import {
  certifyMopsovSourceReportedControlV0_1,
  summarizeMopsovSourceReportedClockV0_1,
} from "../runtime/mopsov_source_reported_clock_v0_1.mjs";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import { buildRevisionAuthorityProvenanceMatrixV0_2 } from "../runtime/revision_authority_provenance_matrix_v0_2.mjs";

const START="2026-04-05";
const END="2026-10-02";
const fetchedAt=new Date().toISOString();

const controlResults=[];
const rawRowsByControl=new Map();

for(const control of MOPS_REVISION_CONTROLS_V0_3){
  const months=[...(control.months || [])];
  const monthly=[];
  for(let i=0;i<months.length;i+=1){
    const month=months[i];
    const expectedDate=months.length===1 ? (control.expectedDate ?? null) : null;
    const result=await probeMopsovDirectHistoryV0_1({
      stockCode:control.stockCode,
      rocYear:control.rocYear,
      month,
      expectedDate,
      baseSubject:control.baseSubject,
      observedAt:fetchedAt,
    });
    monthly.push(result);
  }

  let normalized;
  if(months.length===1){
    normalized={controlId:control.id,...monthly[0]};
  }else{
    normalized=combineMultiMonthMopsRevisionControlResultV0_3({control,monthlyResults:monthly});
  }
  controlResults.push(normalized);
  rawRowsByControl.set(control.id,normalized.parsed?.rows || []);
}

const matrix=summarizeMopsRevisionControlMatrixV0_3(controlResults);
assert.equal(matrix.controlCount,6);
assert.equal(matrix.passCount,6);
assert.equal(matrix.state,"MULTI_EXCHANGE_MULTI_FAMILY_REVISION_CONTROLS_OBSERVED");

const control3152=MOPS_REVISION_CONTROLS_V0_3.find((x)=>x.stockCode==="3152");
const result3152=controlResults.find((x)=>x.controlId===control3152.id);
assert.equal(result3152.revisionHistoryCapabilityObserved,true);
assert.deepEqual(result3152.sourceMonthsRequired,[1,5]);
assert.deepEqual(result3152.missingMonths,[]);
assert.equal(result3152.parsed.originalRowCount,1);
assert.equal(result3152.parsed.correctionOrCancellationRowCount,1);
assert.equal(result3152.parsed.distinctVersionKeyCount,2);

const clockControls=MOPS_REVISION_CONTROLS_V0_3.map((control)=>
  certifyMopsovSourceReportedControlV0_1({
    control,
    rows:rawRowsByControl.get(control.id) || [],
  })
);
const clockSummary=summarizeMopsovSourceReportedClockV0_1(clockControls);
assert.equal(clockSummary.passCount,6);
assert.equal(clockSummary.sourceReportedVersionClockSemanticsCertified,true);
assert.equal(clockSummary.knownAtVersionClockCertified,false);

const urls=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:END});
const exchangeTargets=[
  {controlId:"DIVIDEND_CORRECTION_2467_2026_05",sourceId:"TWSE_EX_RIGHT_DIVIDEND_ACTUAL",symbol:"2467",effectiveDate:"2026-06-18"},
  {controlId:"CAPITAL_REDUCTION_SCHEDULE_CORRECTION_1459_2026_06",sourceId:"TWSE_CAPITAL_REDUCTION_REFERENCE",symbol:"1459",effectiveDate:"2026-08-03"},
  {controlId:"TPEX_CAPITAL_REDUCTION_DECISION_CORRECTION_3152_2026",sourceId:"TPEX_CAPITAL_REDUCTION_REFERENCE",symbol:"3152",effectiveDate:"2026-06-30"},
];
const parsedCache=new Map();
const exchangeEvidence=[];
for(const target of exchangeTargets){
  let parsed=parsedCache.get(target.sourceId);
  if(!parsed){
    const source=urls[target.sourceId];
    const response=await fetch(source.url,{
      headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-3152-Authority-Control/0.3"},
      signal:AbortSignal.timeout(30000),
    });
    const rawText=await response.text();
    assert.equal(response.ok,true,target.sourceId+" HTTP "+response.status);
    parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
      sourceId:target.sourceId,
      sourceUrl:source.url,
      rawText,
      fetchedAt,
      requestedStartDate:START,
      requestedEndDate:END,
    });
    assert.equal(parsed.responseRangeVerified,true,target.sourceId+" range");
    assert.equal(parsed.parserComplete,true,target.sourceId+" parser");
    parsedCache.set(target.sourceId,parsed);
  }
  const matches=parsed.events.filter((x)=>
    x.symbol===target.symbol &&
    x.effectiveDate===target.effectiveDate
  );
  assert.ok(matches.length>=1,target.sourceId+" missing "+target.symbol+" "+target.effectiveDate);
  for(const event of matches){
    exchangeEvidence.push({
      controlId:target.controlId,
      sourceId:target.sourceId,
      symbol:target.symbol,
      effectiveDate:event.effectiveDate,
      eventVersionId:event.eventVersionId,
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
    rowNumber:x.rowNumber,
  }));
assert.ok(regulatorEvidence.length>=1);

const authority=buildRevisionAuthorityProvenanceMatrixV0_2({
  mopsMatrix:matrix,
  exchangeEvidence,
  regulatorEvidence,
});
assert.equal(authority.frozenControlCount,6);
assert.equal(authority.frozenControlPassCount,6);
assert.equal(authority.frozenAuthorityRoutingCoverageComplete,true);
assert.equal(authority.representativeExchangeLaneCount,3);
assert.ok(authority.representativeExchangeLaneSourceIds.includes("TPEX_CAPITAL_REDUCTION_REFERENCE"));
assert.equal(authority.authorityRevisionCoverageComplete,false);
assert.equal(authority.knownAtVersionClockCertified,false);
assert.equal(authority.revisionCoverageComplete,false);
assert.equal(authority.selectionAuthority,false);
assert.equal(authority.system1RuntimeUsed,false);

const rows3152=clockControls.find((x)=>x.controlId===control3152.id)?.rows || [];
console.log(JSON.stringify({
  result:"TPEX_3152_REPRESENTATIVE_CONTROL_PHYSICALLY_VERIFIED",
  observedAt:fetchedAt,
  mops:{
    state:matrix.state,
    controlCount:matrix.controlCount,
    passCount:matrix.passCount,
    crossMonthControlCount:matrix.crossMonthControlCount,
    control3152:{
      id:control3152.id,
      months:control3152.months,
      sourceMonthsObserved:result3152.sourceMonthsObserved,
      originalCount:result3152.parsed.originalRowCount,
      revisionCount:result3152.parsed.correctionOrCancellationRowCount,
      distinctVersionKeyCount:result3152.parsed.distinctVersionKeyCount,
      rows:rows3152,
    },
  },
  sourceClock:{
    passCount:clockSummary.passCount,
    certified:clockSummary.sourceReportedVersionClockSemanticsCertified,
    knownAtVersionClockCertified:clockSummary.knownAtVersionClockCertified,
  },
  exchangeEvidence:exchangeEvidence.map((x)=>({
    controlId:x.controlId,sourceId:x.sourceId,symbol:x.symbol,effectiveDate:x.effectiveDate
  })),
  authority,
},null,2));
