import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";
import { MOPS_REVISION_CONTROLS_V0_2 } from "../runtime/mops_revision_control_matrix_v0_2.mjs";
import {
  certifyMopsovSourceReportedControlV0_1,
  summarizeMopsovSourceReportedClockV0_1,
} from "../runtime/mopsov_source_reported_clock_v0_1.mjs";

const URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

function fetchControl(control){
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30",
    "--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-MOPSOV-Source-Reported-Clock/0.1",
    "--data-urlencode","firstin=1",
    "--data-urlencode","step=1",
    "--data-urlencode","TYPEK=all",
    "--data-urlencode","co_id="+control.stockCode,
    "--data-urlencode","year="+control.rocYear,
    "--data-urlencode","month="+control.month,
    "--data-urlencode","b_date=",
    "--data-urlencode","e_date=",
    URL,
  ];
  const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:16*1024*1024});
  if(p.error) throw p.error;
  if(p.status!==0) throw new Error("curl exit "+p.status+" for "+control.id+": "+String(p.stderr||"").slice(0,500));
  const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({
    html:p.stdout,
    stockCode:control.stockCode,
    expectedDate:control.expectedDate,
    baseSubject:control.baseSubject,
  });
  return {
    control,
    historyRowCount:parsed.rowCount,
    matchingSubjectRowCount:parsed.matchingSubjectRowCount,
    result:certifyMopsovSourceReportedControlV0_1({control,rows:parsed.rows}),
  };
}

const physical=[];
for(let i=0;i<MOPS_REVISION_CONTROLS_V0_2.length;i+=1){
  physical.push(fetchControl(MOPS_REVISION_CONTROLS_V0_2[i]));
  if(i<MOPS_REVISION_CONTROLS_V0_2.length-1) await sleep(800);
}
const summary=summarizeMopsovSourceReportedClockV0_1(physical.map((x)=>x.result));

assert.equal(summary.sourceReportedVersionClockSemanticsCertified,true);
assert.equal(summary.passCount,5);
assert.equal(summary.historicalKnownAtCandidateClockAvailable,true);
assert.equal(summary.publicAvailabilityLatencyCertified,false);
assert.equal(summary.knownAtVersionClockCertified,false);
assert.equal(summary.pitReplayUseAsAvailableAtAuthorized,false);
assert.equal(summary.revisionCoverageComplete,false);
assert.equal(summary.selectionAuthority,false);
assert.equal(summary.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result:summary.state,
  summary,
  physical:physical.map((x)=>({
    controlId:x.control.id,
    actionFamily:x.control.actionFamily,
    mode:x.control.mode,
    historyRowCount:x.historyRowCount,
    matchingSubjectRowCount:x.matchingSubjectRowCount,
    pass:x.result.pass,
    rows:x.result.rows,
  })),
},null,2));
