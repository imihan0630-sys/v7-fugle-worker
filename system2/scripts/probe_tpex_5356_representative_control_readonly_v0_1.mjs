import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { probeMopsovDirectHistoryV0_1 } from "../runtime/mopsov_direct_history_source_v0_1.mjs";
import {
  MOPS_REVISION_CONTROLS_V0_5,
  TPEX_5356_DIVIDEND_CONTROL_V0_5,
  summarizeMopsRevisionControlMatrixV0_5,
} from "../runtime/mops_revision_control_matrix_v0_5.mjs";
import {
  certifyMopsovSourceReportedControlV0_1,
  summarizeMopsovSourceReportedClockV0_1,
} from "../runtime/mopsov_source_reported_clock_v0_1.mjs";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import { buildRevisionAuthorityProvenanceMatrixV0_4 } from "../runtime/revision_authority_provenance_matrix_v0_4.mjs";
import { buildSupplementalRevisionProvenanceReceiptV0_4 } from "../runtime/supplemental_revision_provenance_receipt_v0_4.mjs";

const fetchedAt=new Date().toISOString();

const controlResults=[];
const rawRowsByControl=new Map();
for(const control of MOPS_REVISION_CONTROLS_V0_5){
  let result;
  if((control.months||[]).length>1){
    const parts=[];
    for(const month of control.months){
      parts.push(await probeMopsovDirectHistoryV0_1({
        stockCode:control.stockCode,rocYear:control.rocYear,month,
        expectedDate:null,baseSubject:control.baseSubject,observedAt:fetchedAt,
      }));
    }
    const rows=parts.flatMap((x)=>x.parsed?.rows||[]);
    result={
      controlId:control.id,
      state:rows.length>=2?"MOPSOV_MULTI_MONTH_REVISION_CHAIN_READY":"MOPSOV_MULTI_MONTH_REVISION_CHAIN_BLOCKED",
      historyHttpStatus:parts.every((x)=>x.historyHttpStatus===200)?200:null,
      revisionHistoryCapabilityObserved:
        rows.some((x)=>!x.correctionOrCancellationHint) &&
        rows.some((x)=>x.correctionOrCancellationHint) &&
        new Set(rows.map((x)=>[x.date||"",x.time||"",x.seqNo||""].join("|"))).size>=2,
      parsed:{
        rowCount:parts.reduce((n,x)=>n+Number(x.parsed?.rowCount||0),0),
        matchingSubjectRowCount:rows.length,
        originalRowCount:rows.filter((x)=>!x.correctionOrCancellationHint).length,
        correctionOrCancellationRowCount:rows.filter((x)=>x.correctionOrCancellationHint).length,
        distinctVersionKeyCount:new Set(rows.map((x)=>[x.date||"",x.time||"",x.seqNo||""].join("|"))).size,
        rows,
      },
    };
  }else{
    result=await probeMopsovDirectHistoryV0_1({
      stockCode:control.stockCode,
      rocYear:control.rocYear,
      month:(control.months||[control.month])[0],
      expectedDate:control.expectedDate ?? null,
      baseSubject:control.baseSubject,
      observedAt:fetchedAt,
    });
  }
  controlResults.push({controlId:control.id,...result});
  rawRowsByControl.set(control.id,result.parsed?.rows||[]);
}

const mopsMatrix=summarizeMopsRevisionControlMatrixV0_5(controlResults);
assert.equal(mopsMatrix.controlCount,8);
assert.equal(mopsMatrix.passCount,8);

const result5356=controlResults.find((x)=>x.controlId===TPEX_5356_DIVIDEND_CONTROL_V0_5.id);
assert.equal(result5356.revisionHistoryCapabilityObserved,true);
assert.equal(result5356.parsed.originalRowCount,1);
assert.ok(result5356.parsed.correctionOrCancellationRowCount>=1);
assert.ok(result5356.parsed.distinctVersionKeyCount>=2);

const clockControls=MOPS_REVISION_CONTROLS_V0_5.map((control)=>
  certifyMopsovSourceReportedControlV0_1({
    control,rows:rawRowsByControl.get(control.id)||[],
  })
);
const clockSummary=summarizeMopsovSourceReportedClockV0_1(clockControls);
assert.equal(clockSummary.passCount,8);
assert.equal(clockSummary.sourceReportedVersionClockSemanticsCertified,true);
assert.equal(clockSummary.knownAtVersionClockCertified,false);

async function officialEvent(target){
  const source=buildOfficialContinuitySourceUrlsV0_1({
    startDate:target.startDate,endDate:target.endDate
  })[target.sourceId];
  const response=await fetch(source.url,{
    headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-5356-Authority-Control/0.5"},
    signal:AbortSignal.timeout(30000),
  });
  const rawText=await response.text();
  assert.equal(response.ok,true,target.sourceId+" HTTP "+response.status);
  const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
    sourceId:target.sourceId,sourceUrl:source.url,rawText,fetchedAt,
    requestedStartDate:target.startDate,requestedEndDate:target.endDate,
  });
  assert.equal(parsed.responseRangeVerified,true);
  assert.equal(parsed.parserComplete,true);
  const matches=parsed.events.filter((x)=>
    x.symbol===target.symbol && x.effectiveDate===target.effectiveDate
  );
  assert.ok(matches.length>=1,target.sourceId+" missing "+target.symbol+" "+target.effectiveDate);
  return matches.map((event)=>({
    controlId:target.controlId,sourceId:target.sourceId,symbol:target.symbol,
    effectiveDate:event.effectiveDate,eventVersionId:event.eventVersionId,directEvidence:true,
  }));
}

const exchangeEvidence=[];
for(const target of [
  {controlId:"DIVIDEND_CORRECTION_2467_2026_05",sourceId:"TWSE_EX_RIGHT_DIVIDEND_ACTUAL",symbol:"2467",effectiveDate:"2026-06-18",startDate:"2026-01-01",endDate:"2026-10-02"},
  {controlId:"CAPITAL_REDUCTION_SCHEDULE_CORRECTION_1459_2026_06",sourceId:"TWSE_CAPITAL_REDUCTION_REFERENCE",symbol:"1459",effectiveDate:"2026-08-03",startDate:"2026-01-01",endDate:"2026-10-02"},
  {controlId:"TPEX_CAPITAL_REDUCTION_DECISION_CORRECTION_3152_2026",sourceId:"TPEX_CAPITAL_REDUCTION_REFERENCE",symbol:"3152",effectiveDate:"2026-06-30",startDate:"2026-01-01",endDate:"2026-10-02"},
  {controlId:"TPEX_PAR_VALUE_CHANGE_CORRECTION_6548_2022",sourceId:"TPEX_PAR_VALUE_CHANGE_REFERENCE",symbol:"6548",effectiveDate:"2022-09-05",startDate:"2022-01-01",endDate:"2022-12-31"},
  {controlId:"TPEX_EX_RIGHT_DIVIDEND_CORRECTION_5356_2026",sourceId:"TPEX_EX_RIGHT_DIVIDEND_ACTUAL",symbol:"5356",effectiveDate:"2026-07-08",startDate:"2026-07-01",endDate:"2026-07-31"},
]){
  exchangeEvidence.push(...await officialEvent(target));
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
    symbol:"1342",statusText:"廢止/撤銷",directEvidence:true,
  }));

const authority=buildRevisionAuthorityProvenanceMatrixV0_4({
  mopsMatrix,exchangeEvidence,regulatorEvidence,
});
assert.equal(authority.frozenControlCount,8);
assert.equal(authority.frozenControlPassCount,8);
assert.equal(authority.frozenAuthorityRoutingCoverageComplete,true);
assert.equal(authority.representativeExchangeLaneCount,5);
assert.ok(authority.representativeExchangeLaneSourceIds.includes("TPEX_EX_RIGHT_DIVIDEND_ACTUAL"));

const finalLaneIds=[
  "TWSE_EX_RIGHT_DIVIDEND_ACTUAL","TWSE_CAPITAL_REDUCTION_REFERENCE","TWSE_PAR_VALUE_CHANGE_REFERENCE",
  "TPEX_EX_RIGHT_DIVIDEND_ACTUAL","TPEX_CAPITAL_REDUCTION_REFERENCE","TPEX_PAR_VALUE_CHANGE_REFERENCE",
];
const finalReady=Object.fromEntries(finalLaneIds.map((x)=>[x,true]));
const representative={
  TWSE_EX_RIGHT_DIVIDEND_ACTUAL:true,
  TWSE_CAPITAL_REDUCTION_REFERENCE:true,
  TWSE_PAR_VALUE_CHANGE_REFERENCE:false,
  TPEX_EX_RIGHT_DIVIDEND_ACTUAL:true,
  TPEX_CAPITAL_REDUCTION_REFERENCE:true,
  TPEX_PAR_VALUE_CHANGE_REFERENCE:true,
};
const bounded=Object.fromEntries(finalLaneIds.map((x)=>[x,false]));

const receipt=buildSupplementalRevisionProvenanceReceiptV0_4({
  startDate:"2026-04-05",endDate:"2026-10-02",generatedAt:fetchedAt,
  evidenceRefs:["PR#487","PR#503","PR#520","PR#533"],
  finalResultLaneReadiness:finalReady,
  mopsQueryIntegrity:{
    monthShardReconciliationVerified:true,multiControlReconciliationVerified:true,
    emptyMonthSemanticsCertified:true,highRowStressVerified:true,
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
assert.equal(receipt.representativeAuthorityReadyCount,5);
assert.equal(receipt.blockerCounts.LANE_REPRESENTATIVE_AUTHORITY_ROUTING_NOT_OBSERVED,1);
assert.equal(receipt.supplementalRevisionReadyCount,0);
assert.equal(receipt.revisionCoverageComplete,false);
assert.equal(receipt.selectionAuthority,false);
assert.equal(receipt.system1RuntimeUsed,false);

const rows5356=clockControls.find((x)=>x.controlId===TPEX_5356_DIVIDEND_CONTROL_V0_5.id)?.rows||[];
console.log(JSON.stringify({
  result:"TPEX_5356_DIVIDEND_REPRESENTATIVE_CONTROL_PHYSICALLY_VERIFIED",
  observedAt:fetchedAt,
  mops:{
    state:mopsMatrix.state,controlCount:mopsMatrix.controlCount,passCount:mopsMatrix.passCount,
    control5356:{
      originalCount:result5356.parsed.originalRowCount,
      revisionCount:result5356.parsed.correctionOrCancellationRowCount,
      distinctVersionKeyCount:result5356.parsed.distinctVersionKeyCount,
      rows:rows5356,
    },
  },
  sourceClock:{
    passCount:clockSummary.passCount,
    certified:clockSummary.sourceReportedVersionClockSemanticsCertified,
    knownAtVersionClockCertified:clockSummary.knownAtVersionClockCertified,
  },
  exchangeEvidence:exchangeEvidence.filter((x)=>x.symbol==="5356"),
  authority:{
    state:authority.state,
    frozenControlPassCount:authority.frozenControlPassCount,
    representativeExchangeLaneCount:authority.representativeExchangeLaneCount,
    representativeExchangeLaneSourceIds:authority.representativeExchangeLaneSourceIds,
  },
  receipt:{
    version:receipt.version,
    representativeAuthorityReadyCount:receipt.representativeAuthorityReadyCount,
    supplementalRevisionReadyCount:receipt.supplementalRevisionReadyCount,
    blockerCounts:receipt.blockerCounts,
    remainingRepresentativeGaps:receipt.laneResults
      .filter((x)=>x.representativeAuthorityObserved!==true)
      .map((x)=>x.sourceId),
    revisionCoverageComplete:receipt.revisionCoverageComplete,
  },
},null,2));
