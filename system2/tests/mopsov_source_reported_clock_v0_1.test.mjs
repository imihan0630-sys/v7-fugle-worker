import assert from "node:assert/strict";
import {
  mopsovSourceReportedAtV0_1,
  certifyMopsovSourceReportedControlV0_1,
  summarizeMopsovSourceReportedClockV0_1,
} from "../runtime/mopsov_source_reported_clock_v0_1.mjs";

function row({date="2026-05-22",time="16:34:06",seqNo="2",revision=false,text="original"}={}){
  return {
    date,time,seqNo,
    spokeDateRaw:date.replaceAll("-",""),
    spokeTimeRaw:time.replaceAll(":",""),
    correctionOrCancellationHint:revision,
    rowText:text,
  };
}
const original=row();
const correction=row({time:"17:42:13",seqNo:"4",revision:true,text:"公告(更正)"});
const c={
  id:"C1",actionFamily:"DIVIDEND_EX_DATE",mode:"ORIGINAL_PLUS_CORRECTION",
};
assert.equal(mopsovSourceReportedAtV0_1(original).eligible,true);
assert.equal(
  mopsovSourceReportedAtV0_1(original).sourceReportedAt,
  "2026-05-22T16:34:06+08:00"
);
assert.equal(certifyMopsovSourceReportedControlV0_1({control:c,rows:[original,correction]}).pass,true);

{
  const bad={...original,spokeTimeRaw:"163405"};
  assert.equal(mopsovSourceReportedAtV0_1(bad).eligible,false);
}
{
  const bad={...original,spokeDateRaw:"20260231"};
  assert.equal(mopsovSourceReportedAtV0_1(bad).eligible,false);
}
{
  const bad={...original,seqNo:"0"};
  assert.equal(mopsovSourceReportedAtV0_1(bad).eligible,false);
}
{
  const earlyCorrection=row({time:"16:00:00",seqNo:"4",revision:true,text:"更正"});
  assert.equal(certifyMopsovSourceReportedControlV0_1({control:c,rows:[original,earlyCorrection]}).pass,false);
}
{
  const duplicate=row({time:"16:34:06",seqNo:"2",revision:true,text:"更正"});
  assert.equal(certifyMopsovSourceReportedControlV0_1({control:c,rows:[original,duplicate]}).pass,false);
}
{
  const cancelControl={id:"C2",actionFamily:"CASH_CAPITAL_INCREASE",mode:"CANCELLATION_ROW"};
  const cancel=row({date:"2026-07-01",time:"16:09:42",seqNo:"1",revision:true,text:"核准撤銷現金增資"});
  assert.equal(certifyMopsovSourceReportedControlV0_1({control:cancelControl,rows:[cancel]}).pass,true);
}

const controls=[
  certifyMopsovSourceReportedControlV0_1({control:{id:"A",actionFamily:"A",mode:"ORIGINAL_PLUS_CORRECTION"},rows:[original,correction]}),
  certifyMopsovSourceReportedControlV0_1({control:{id:"B",actionFamily:"B",mode:"ORIGINAL_PLUS_CORRECTION"},rows:[original,correction]}),
  certifyMopsovSourceReportedControlV0_1({control:{id:"C",actionFamily:"C",mode:"ORIGINAL_PLUS_CORRECTION"},rows:[original,correction]}),
  certifyMopsovSourceReportedControlV0_1({control:{id:"D",actionFamily:"D",mode:"ORIGINAL_PLUS_CORRECTION"},rows:[original,correction]}),
  certifyMopsovSourceReportedControlV0_1({
    control:{id:"E",actionFamily:"E",mode:"CANCELLATION_ROW"},
    rows:[row({date:"2026-07-01",time:"16:09:42",seqNo:"1",revision:true,text:"撤銷"})],
  }),
];
const summary=summarizeMopsovSourceReportedClockV0_1(controls);
assert.equal(summary.sourceReportedVersionClockSemanticsCertified,true);
assert.equal(summary.historicalKnownAtCandidateClockAvailable,true);
assert.equal(summary.publicAvailabilityLatencyCertified,false);
assert.equal(summary.knownAtVersionClockCertified,false);
assert.equal(summary.pitReplayUseAsAvailableAtAuthorized,false);
assert.equal(summary.revisionCoverageComplete,false);
assert.equal(summary.selectionAuthority,false);
assert.equal(summary.system1RuntimeUsed,false);

console.log("MOPSOV source-reported clock V0.1 tests PASS");
