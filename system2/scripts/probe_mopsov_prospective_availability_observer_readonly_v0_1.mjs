import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";
import { MOPS_REVISION_CONTROLS_V0_2 } from "../runtime/mops_revision_control_matrix_v0_2.mjs";
import {
  buildMopsovAvailabilityObservationV0_1,
  summarizeMopsovAvailabilityObservationsV0_1,
} from "../runtime/mopsov_prospective_availability_observer_v0_1.mjs";

const URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
function sleep(ms){ return new Promise((r)=>setTimeout(r,ms)); }
function sha256(text){ return createHash("sha256").update(text).digest("hex"); }

function fetchControl(control){
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30",
    "--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-MOPSOV-Availability-Observer/0.1",
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
  return {parsed,payloadHash:sha256(p.stdout)};
}

const observedAt=new Date().toISOString();
const observations=[];
const physical=[];
for(let i=0;i<MOPS_REVISION_CONTROLS_V0_2.length;i+=1){
  const control=MOPS_REVISION_CONTROLS_V0_2[i];
  const fetched=fetchControl(control);
  const rows=fetched.parsed.rows || [];
  assert.ok(rows.length>=1,"expected at least one matched row for "+control.id);
  const mapped=rows.map((row)=>buildMopsovAvailabilityObservationV0_1({
    controlId:control.id,
    row,
    observedAt,
    observationMode:"RETROSPECTIVE_READBACK",
    sourceUrl:URL,
    payloadHash:fetched.payloadHash,
    sourceFetchId:"PHYSICAL_READBACK:"+control.id,
  }));
  for(const x of mapped){
    assert.equal(x.state,"RETROSPECTIVE_SOURCE_CLOCK_ONLY");
    assert.equal(x.firstObservedAvailableAt,null);
    assert.equal(x.latencyUpperBoundFromSourceReportedSeconds,null);
    assert.equal(x.publicAvailabilityLatencyCertified,false);
    assert.equal(x.knownAtVersionClockCertified,false);
    assert.equal(x.pitReplayUseAsAvailableAtAuthorized,false);
  }
  observations.push(...mapped);
  physical.push({
    controlId:control.id,
    matchedRowCount:rows.length,
    observationStates:mapped.map((x)=>x.state),
    sourceReportedAt:mapped.map((x)=>x.sourceReportedAt),
  });
  if(i<MOPS_REVISION_CONTROLS_V0_2.length-1) await sleep(700);
}
const summary=summarizeMopsovAvailabilityObservationsV0_1(observations);
assert.equal(summary.retrospectiveObservationCount,observations.length);
assert.equal(summary.prospectiveObservationCount,0);
assert.equal(summary.publicAvailabilityLatencyCertified,false);
assert.equal(summary.knownAtVersionClockCertified,false);
assert.equal(summary.pitReplayUseAsAvailableAtAuthorized,false);
assert.equal(summary.revisionCoverageComplete,false);
assert.equal(summary.selectionAuthority,false);
assert.equal(summary.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result:"RETROSPECTIVE_READBACK_FAIL_CLOSED_CONFIRMED",
  observedAt,
  summary,
  physical,
},null,2));
