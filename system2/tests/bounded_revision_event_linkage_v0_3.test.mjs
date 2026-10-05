import assert from "node:assert/strict";
import {classifyBoundedRevisionEventLinkageV0_3,summarizeBoundedRevisionEventLinkageV0_3} from "../runtime/bounded_revision_event_linkage_v0_3.mjs";

const base={eventKey:"E1",sourceId:"TWSE_CAPITAL_REDUCTION_REFERENCE",symbol:"1441",effectiveDate:"2026-09-29",family:"CAPITAL_REDUCTION"};

{
 const r=classifyBoundedRevisionEventLinkageV0_3({
  event:base,
  perSymbolQueryIntegrity:{exactKeysetReconciliation:true},
  familyRows:[
   {date:"2026-09-03",time:"10:00:00",seqNo:"1",rowText:"訂定減資換股作業計劃及減資換發股票基準日115年9月29日"},
   {date:"2026-09-03",time:"11:00:00",seqNo:"2",rowText:"[更正其他應敘明事項]訂定減資換股作業計劃及減資換發股票基準日115年9月29日",correctionOrCancellationHint:true},
  ],
 });
 assert.equal(r.state,"EVENT_ANCHORED_REVISION_CHAIN_OBSERVED");
 assert.equal(r.eventAnchoredGroupCount,1);
}

{
 const r=classifyBoundedRevisionEventLinkageV0_3({
  event:base,
  perSymbolQueryIntegrity:{exactKeysetReconciliation:true},
  familyRows:[
   {date:"2026-05-01",time:"10:00:00",seqNo:"1",rowText:"董事會決議辦理減資"},
   {date:"2026-08-01",time:"10:00:00",seqNo:"2",rowText:"董事會決議辦理減資"},
  ],
 });
 assert.equal(r.state,"AMBIGUOUS_NO_EVENT_SPECIFIC_ANCHOR");
 assert.equal(r.eventLinkageCoverageComplete,false);
}

{
 const r=classifyBoundedRevisionEventLinkageV0_3({
  event:base,
  perSymbolQueryIntegrity:{exactKeysetReconciliation:true},
  familyRows:[
   {date:"2026-09-01",time:"10:00:00",seqNo:"1",rowText:"代子公司甲公司辦理減資，換股基準日115年9月29日"},
  ],
 });
 assert.equal(r.state,"AMBIGUOUS_NO_EVENT_SPECIFIC_ANCHOR");
 assert.equal(r.eventAnchoredRowCount,0);
}

{
 const r=classifyBoundedRevisionEventLinkageV0_3({
  event:base,
  perSymbolQueryIntegrity:{exactKeysetReconciliation:false},
  familyRows:[
   {date:"2026-09-01",time:"10:00:00",seqNo:"1",rowText:"訂定減資換股基準日115年9月29日"},
  ],
 });
 assert.equal(r.state,"PER_SYMBOL_QUERY_INTEGRITY_NOT_CERTIFIED");
}

{
 const rows=[
  classifyBoundedRevisionEventLinkageV0_3({event:base,perSymbolQueryIntegrity:{exactKeysetReconciliation:true},familyRows:[]}),
 ];
 const s=summarizeBoundedRevisionEventLinkageV0_3(rows);
 assert.equal(s.eventLinkageCoverageComplete,false);
 assert.equal(s.revisionCoverageComplete,false);
 assert.equal(s.tradingAuthority,false);
}

console.log("bounded revision event linkage V0.3 tests PASS");
