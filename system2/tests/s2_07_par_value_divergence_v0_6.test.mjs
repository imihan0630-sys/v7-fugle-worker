import assert from "node:assert/strict";
import {classifyParValueMonthOnlyRowV0_6,classifyCancellationEvidenceV0_6} from "../runtime/s2_07_par_value_divergence_v0_6.mjs";

{
 const r=classifyParValueMonthOnlyRowV0_6({
  row:{date:"2026-08-01",time:"07:00:03",seqNo:"1",rowText:"公告本公司股票面額由新台幣10元變更為新台幣5元 公告期間：115年7月22日至115年10月21日"},
  officialDetailDateTokens:["2026-08-20","2026-08-31"],
 });
 assert.equal(r.state,"MONTH_ONLY_RECURRING_NOTICE_COPY");
 assert.equal(r.mayBeDiscardedFromHistory,false);
}
{
 const r=classifyParValueMonthOnlyRowV0_6({
  row:{date:"2026-04-01",time:"07:00:03",seqNo:"1",rowText:"公告本公司股票面額由新台幣10元變更為新台幣2.5元"},
  officialDetailDateTokens:["2026-04-01","2026-04-13"],
 });
 assert.equal(r.state,"MONTH_ONLY_STOP_DATE_FACE_VALUE_NOTICE");
}
{
 const r=classifyCancellationEvidenceV0_6([{date:"2026-01-01",time:"10:00:00",seqNo:"1",rowText:"更正公告換股作業計畫"}]);
 assert.equal(r.state,"CANCELLATION_DISCLOSURE_NOT_OBSERVED_HISTORY_INCOMPLETE");
 assert.equal(r.noCancellationMayBeClaimed,false);
}
{
 const r=classifyCancellationEvidenceV0_6([{date:"2026-01-01",time:"10:00:00",seqNo:"1",rowText:"公告取消換股作業"}]);
 assert.equal(r.state,"CANCELLATION_DISCLOSURE_OBSERVED");
 assert.equal(r.observedCount,1);
}
console.log("S2-07 par-value divergence V0.6 tests PASS");
