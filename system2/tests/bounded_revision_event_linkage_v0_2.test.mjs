import assert from "node:assert/strict";
import {classifyBoundedRevisionEventLinkageV0_2,summarizeBoundedRevisionEventLinkageV0_2} from "../runtime/bounded_revision_event_linkage_v0_2.mjs";
const q={transportReady:true,parserComplete:true,noPaginationHint:true,maxYearRowCount:50};
const event={eventKey:"E",sourceId:"TWSE_CAPITAL_REDUCTION_REFERENCE",symbol:"1111",effectiveDate:"2026-09-01"};
const chain=classifyBoundedRevisionEventLinkageV0_2({event,queryEvidence:q,familyRows:[
 {date:"2026-01-01",time:"10:00:00",seqNo:"1",rowText:"1111 A 115/01/01 10:00:00 本公司董事會決議辦理現金減資事宜",correctionOrCancellationHint:false},
 {date:"2026-02-01",time:"11:00:00",seqNo:"2",rowText:"1111 A 115/02/01 11:00:00 本公司董事會決議辦理現金減資事宜(更正內容)",correctionOrCancellationHint:true},
]});
assert.equal(chain.state,"REVISION_CHAIN_OBSERVED");
const single=classifyBoundedRevisionEventLinkageV0_2({event,queryEvidence:q,familyRows:[
 {date:"2026-01-01",time:"10:00:00",seqNo:"1",rowText:"1111 A 115/01/01 10:00:00 股票面額變更",correctionOrCancellationHint:false},
]});
assert.equal(single.state,"SINGLE_VERSION_NO_REVISION_HINT_QUERY_SUPPORTED");
const amb=classifyBoundedRevisionEventLinkageV0_2({event,queryEvidence:q,familyRows:[
 {date:"2026-01-01",time:"10:00:00",seqNo:"1",rowText:"1111 A 115/01/01 10:00:00 減資A",correctionOrCancellationHint:false},
 {date:"2026-03-01",time:"10:00:00",seqNo:"2",rowText:"1111 A 115/03/01 10:00:00 減資B",correctionOrCancellationHint:false},
]});
assert.equal(amb.state,"AMBIGUOUS_MULTIPLE_ACTION_GROUPS");
const sum=summarizeBoundedRevisionEventLinkageV0_2([chain,single,amb]);
assert.equal(sum.eventCount,3);assert.equal(sum.resolvedCount,2);assert.equal(sum.ambiguousCount,1);
assert.equal(sum.boundedRevisionHistoryCoverageComplete,false);
console.log("bounded revision event linkage V0.2 tests PASS");