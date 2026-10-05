import assert from "node:assert/strict";
import {classifyBoundedRevisionStageLinkageV0_3,summarizeBoundedRevisionStageLinkageV0_3} from "../runtime/bounded_revision_stage_linkage_v0_3.mjs";
const q={transportReady:true,parserComplete:true,noPaginationHint:true,maxYearRowCount:10};
const e={eventKey:"E",sourceId:"TWSE_CAPITAL_REDUCTION_REFERENCE",symbol:"1111",effectiveDate:"2026-08-01",eventStage:"ACTUAL_CAPITAL_REDUCTION_RESUME_REFERENCE"};
const rows=[
 {date:"2026-06-01",time:"10:00:00",seqNo:"1",rowText:"1111 A 115/06/01 10:00:00 董事長訂定現金減資換股基準日及換發股票作業計畫",correctionOrCancellationHint:false},
 {date:"2026-06-02",time:"10:00:00",seqNo:"2",rowText:"1111 A 115/06/02 10:00:00 董事長訂定現金減資換股基準日及換發股票作業計畫(更正內容)",correctionOrCancellationHint:true},
 {date:"2026-07-01",time:"10:00:00",seqNo:"3",rowText:"1111 A 115/07/01 10:00:00 代子公司X辦理現金減資變更登記完成",correctionOrCancellationHint:false},
];
const x=classifyBoundedRevisionStageLinkageV0_3({event:e,familyRows:rows,queryEvidence:q});
assert.equal(x.state,"STAGE_LINKED_REVISION_CHAIN_OBSERVED");assert.equal(x.stageLinkedGroupCount,1);
const y=classifyBoundedRevisionStageLinkageV0_3({event:e,familyRows:[rows[0]],queryEvidence:q});
assert.equal(y.state,"STAGE_LINKED_NO_REVISION_HINT_QUERY_SUPPORTED");
const variants=[
 {date:"2026-06-01",time:"10:00:00",seqNo:"1",rowText:"1111 A 115/06/01 10:00:00 減資換發股票作業計劃及減資換發基準日等相關事宜",correctionOrCancellationHint:false},
 {date:"2026-06-02",time:"10:00:00",seqNo:"2",rowText:"1111 A 115/06/02 10:00:00 更新減資換發股票作業計劃及減資換發基準日等相關事宜",correctionOrCancellationHint:true},
];
const vx=classifyBoundedRevisionStageLinkageV0_3({event:e,familyRows:variants,queryEvidence:q});
assert.equal(vx.state,"STAGE_LINKED_REVISION_CHAIN_OBSERVED");
const bracket=[
 {date:"2026-06-01",time:"10:00:00",seqNo:"1",rowText:"1111 A 115/06/01 10:00:00 訂定減資換股作業計劃及減資換發股票基準日",correctionOrCancellationHint:false},
 {date:"2026-06-02",time:"10:00:00",seqNo:"2",rowText:"1111 A 115/06/02 10:00:00 [更正其他應敘明事項]訂定減資換股作業計劃及減資換發股票基準日",correctionOrCancellationHint:true},
];
assert.equal(classifyBoundedRevisionStageLinkageV0_3({event:e,familyRows:bracket,queryEvidence:q}).state,"STAGE_LINKED_REVISION_CHAIN_OBSERVED");
const dated=[
 {date:"2026-06-01",time:"10:00:00",seqNo:"1",rowText:"1111 A 115/06/01 10:00:00 董事長訂定減資及換發股票基準日",correctionOrCancellationHint:false},
 {date:"2026-06-02",time:"10:00:00",seqNo:"2",rowText:"1111 A 115/06/02 10:00:00 1150623董事長訂定減資及換發股票基準日",correctionOrCancellationHint:true},
];
assert.equal(classifyBoundedRevisionStageLinkageV0_3({event:e,familyRows:dated,queryEvidence:q}).state,"STAGE_LINKED_REVISION_CHAIN_OBSERVED");
const z=summarizeBoundedRevisionStageLinkageV0_3([x,y]);assert.equal(z.stageLinkageCoverageComplete,true);assert.equal(z.boundedRevisionHistoryCoverageComplete,false);
console.log("bounded revision stage linkage V0.3 tests PASS");