import assert from "node:assert/strict";
import {
 reconcileActionFamilyQueryIntegrityV0_5,
 buildEventSpecificLinkageDiagnosticV0_5,
 detailDateTokensV0_5,
} from "../runtime/s2_07_event_specific_linkage_v0_5.mjs";

assert.deepEqual(detailDateTokensV0_5("<td>115/04/01</td><td>115/04/13</td>"),["2026-04-01","2026-04-13"]);
assert.deepEqual(detailDateTokensV0_5("3591,20260909"),["2026-09-09"]);

{
 const r=reconcileActionFamilyQueryIntegrityV0_5({
  family:"CAPITAL_REDUCTION",startDate:"2026-01-01",endDate:"2026-12-31",
  yearRows:[{date:"2026-02-01",time:"07:00:00",seqNo:"1",rowText:"公告本公司名稱變更"}],
  monthRows:[{date:"2026-02-01",time:"07:00:00",seqNo:"1",rowText:"公告本公司名稱變更"}],
 });
 assert.equal(r.exactKeysetReconciliation,true);
 assert.equal(r.yearFamilyRowCount,0);
}
{
 const r=reconcileActionFamilyQueryIntegrityV0_5({
  family:"PAR_VALUE_CHANGE",startDate:"2026-01-01",endDate:"2026-12-31",
  yearRows:[],
  monthRows:[{date:"2026-08-01",time:"07:00:03",seqNo:"1",rowText:"公告本公司股票面額由新台幣10元變更為新台幣1元，公告期間：115年7月2日至115年10月1日"}],
 });
 assert.equal(r.exactKeysetReconciliation,false);
 assert.equal(r.periodicNoticeOnlyDivergence,true);
}
{
 const event={eventKey:"E",sourceId:"TPEX_CAPITAL_REDUCTION_REFERENCE",symbol:"4806",effectiveDate:"2026-10-02",family:"CAPITAL_REDUCTION",officialSubtype:"彌補虧損",officialDetail:"停止買賣日期:115/09/23 恢復買賣日期:115/10/02"};
 const rows=[
  {date:"2025-09-02",time:"10:00:00",seqNo:"1",rowText:"公告本公司減資換股作業計畫"},
  {date:"2026-02-24",time:"10:00:00",seqNo:"1",rowText:"公告本公司董事會決議辦理減資股本彌補虧損案"},
  {date:"2026-05-29",time:"10:00:00",seqNo:"1",rowText:"本公司辦理減資彌補虧損致債權人公告"},
  {date:"2026-09-07",time:"10:00:00",seqNo:"1",rowText:"更正公告本公司減資換股作業計畫",correctionOrCancellationHint:true},
 ];
 const d=buildEventSpecificLinkageDiagnosticV0_5({event,issuerFamilyRows:rows,actionFamilyQueryIntegrity:{exactKeysetReconciliation:true}});
 assert.equal(d.semanticSeedDate,"2026-02-24");
 assert.equal(d.semanticAlignedVersionKeys.includes("2025-09-02|10:00:00|1"),false);
 assert.equal(d.correctionObserved,true);
 assert.equal(d.eventSpecificAnchorCandidate,true);
 assert.equal(d.promotionLinkageEstablished,false);
 assert.equal(d.noCancellationMayBeClaimed,false);
}
console.log("S2-07 event-specific linkage V0.5 tests PASS");
