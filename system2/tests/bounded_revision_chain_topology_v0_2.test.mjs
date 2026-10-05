import assert from "node:assert/strict";
import {
  buildBoundedRevisionChainTopologyV0_2,
  normalizeMopsRevisionSubjectV0_2,
  compatibleRevisionStemV0_2,
} from "../runtime/bounded_revision_chain_topology_v0_2.mjs";

assert.equal(
  normalizeMopsRevisionSubjectV0_2("更正公告本公司董事會決議辦理現金減資事宜"),
  normalizeMopsRevisionSubjectV0_2("公告本公司董事會決議辦理現金減資事宜")
);
assert.equal(compatibleRevisionStemV0_2("董事會決議辦理現金減資事宜","董事會決議辦理現金減資事宜"),true);

const laneEvents={
  TWSE_CAPITAL_REDUCTION_REFERENCE:[{symbol:"1111",effectiveDate:"2026-06-01",eventVersionId:"A"}],
  TWSE_PAR_VALUE_CHANGE_REFERENCE:[{symbol:"2222",effectiveDate:"2026-07-01",eventVersionId:"B"}],
  TPEX_CAPITAL_REDUCTION_REFERENCE:[{symbol:"3333",effectiveDate:"2026-08-01",eventVersionId:"C"}],
  TPEX_PAR_VALUE_CHANGE_REFERENCE:[{symbol:"4444",effectiveDate:"2026-09-01",eventVersionId:"D"}],
};
const issuerFamilyRowsBySymbol={
  "1111":{CAPITAL_REDUCTION:[
    {date:"2026-05-01",time:"10:00:00",seqNo:"1",rowText:"1111 A 115/05/01 10:00:00 公告本公司董事會決議辦理現金減資事宜",correctionOrCancellationHint:false},
    {date:"2026-05-02",time:"10:00:00",seqNo:"2",rowText:"1111 A 115/05/02 10:00:00 更正公告本公司董事會決議辦理現金減資事宜",correctionOrCancellationHint:true},
  ]},
  "2222":{PAR_VALUE_CHANGE:[
    {date:"2026-06-01",time:"10:00:00",seqNo:"1",rowText:"2222 B 115/06/01 10:00:00 公告本公司股票面額變更相關事宜",correctionOrCancellationHint:false},
  ]},
  "3333":{CAPITAL_REDUCTION:[
    {date:"2026-07-01",time:"10:00:00",seqNo:"1",rowText:"3333 C 115/07/01 10:00:00 公告本公司減資事宜",correctionOrCancellationHint:false},
    {date:"2026-07-02",time:"10:00:00",seqNo:"2",rowText:"3333 C 115/07/02 10:00:00 更正完全不同主題",correctionOrCancellationHint:true},
  ]},
  "4444":{PAR_VALUE_CHANGE:[
    {date:"2026-08-01",time:"10:00:00",seqNo:"1",rowText:"4444 D 115/08/01 10:00:00 公告本公司股票面額變更相關事宜",correctionOrCancellationHint:false},
  ]},
};

const receipt=await buildBoundedRevisionChainTopologyV0_2({
  startDate:"2026-04-05",endDate:"2026-10-02",
  laneEvents,issuerFamilyRowsBySymbol,generatedAt:"2026-10-05T08:20:00Z",
});
assert.equal(receipt.finalEventCount,4);
assert.equal(receipt.revisionHintEventCount,2);
assert.equal(receipt.resolvedRevisionTopologyEventCount,1);
assert.equal(receipt.unresolvedRevisionTopologyEventCount,1);
assert.equal(receipt.noRevisionHintEventCount,2);
assert.equal(receipt.noRevisionNegativeClaimQualifiedCount,0);
assert.equal(receipt.noRevisionAbsenceSemanticsCertified,false);
assert.equal(receipt.boundedRevisionHistoryCoverageComplete,false);
assert.equal(receipt.knownAtVersionClockCertified,false);
assert.equal(receipt.revisionCoverageComplete,false);

console.log("bounded revision-chain topology V0.2 tests PASS");
