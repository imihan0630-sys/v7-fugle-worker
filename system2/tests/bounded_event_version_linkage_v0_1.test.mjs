import assert from "node:assert/strict";
import {
  buildBoundedEventVersionLinkageV0_1,
  extractDateTokensV0_1,
} from "../runtime/bounded_event_version_linkage_v0_1.mjs";

assert.deepEqual(
  [...extractDateTokensV0_1("公告115年6月1日及2026/06/02相關事宜")],
  ["2026-06-01","2026-06-02"],
);

const laneEvents={
  TWSE_CAPITAL_REDUCTION_REFERENCE:[
    {symbol:"1111",effectiveDate:"2026-06-01",eventVersionId:"A"},
  ],
  TWSE_PAR_VALUE_CHANGE_REFERENCE:[
    {symbol:"2222",effectiveDate:"2026-07-01",eventVersionId:"B"},
  ],
  TPEX_CAPITAL_REDUCTION_REFERENCE:[
    {symbol:"3333",effectiveDate:"2026-08-01",eventVersionId:"C"},
  ],
  TPEX_PAR_VALUE_CHANGE_REFERENCE:[
    {symbol:"4444",effectiveDate:"2026-09-01",eventVersionId:"D"},
  ],
};

function history(rows, payloadOverride=null){
  return {
    transportReady:true,
    queriedYears:[2025,2026],
    payloadCount:2,
    payloads:payloadOverride||[
      {year:2025,httpStatus:200,ok:true},
      {year:2026,httpStatus:200,ok:true},
    ],
    familyRowsByActionFamily:rows,
  };
}

const issuerHistories={
  "1111":history({
    CAPITAL_REDUCTION:[
      {
        date:"2026-05-20",time:"09:00:00",seqNo:"1",
        spokeDateRaw:"1150520",spokeTimeRaw:"090000",
        rowText:"1111 公告本公司減資換發股票，預定115/06/01恢復買賣",
        correctionOrCancellationHint:false,
      },
      {
        date:"2026-05-21",time:"10:00:00",seqNo:"2",
        spokeDateRaw:"1150521",spokeTimeRaw:"100000",
        rowText:"1111 更正公告本公司減資換發股票，預定115/06/01恢復買賣",
        correctionOrCancellationHint:true,
      },
    ],
  }),
  "2222":history({
    PAR_VALUE_CHANGE:[
      {
        date:"2026-06-01",time:"09:00:00",seqNo:"3",
        rowText:"2222 股票面額變更換發新股作業",
        correctionOrCancellationHint:false,
      },
    ],
  }),
  "3333":history({
    CAPITAL_REDUCTION:[
      {
        date:"2026-07-01",time:"09:00:00",seqNo:"4",
        rowText:"3333 減資換發股票，115/08/01恢復買賣",
        correctionOrCancellationHint:false,
      },
      {
        date:"2026-07-02",time:null,seqNo:"5",
        rowText:"3333 更正減資換發股票，115/08/01恢復買賣",
        correctionOrCancellationHint:true,
      },
    ],
  }),
  "4444":history({
    PAR_VALUE_CHANGE:[
      {
        date:"2026-08-01",time:"09:00:00",seqNo:"6",
        rowText:"4444 股票面額變更，115/09/01換發",
        correctionOrCancellationHint:false,
      },
    ],
  },[
    {year:2025,httpStatus:200,ok:true},
    {year:2026,httpStatus:500,ok:false},
  ]),
};

const receipt=await buildBoundedEventVersionLinkageV0_1({
  startDate:"2026-04-05",
  endDate:"2026-10-02",
  laneEvents,
  issuerHistories,
  generatedAt:"2026-10-05T10:00:00Z",
});

assert.equal(receipt.finalEventCount,4);
assert.equal(receipt.strictLinkedEventCount,1);
assert.equal(receipt.unresolvedEventCount,3);
assert.equal(receipt.queryIntegrityCompleteEventCount,3);
assert.equal(receipt.boundedEventVersionLinkageComplete,false);
assert.equal(receipt.revisionCoverageComplete,false);
assert.equal(receipt.knownAtVersionClockCertified,false);

const twseCap=receipt.laneResults.find((x)=>x.sourceId==="TWSE_CAPITAL_REDUCTION_REFERENCE");
assert.equal(twseCap.events[0].state,"STRICT_LINKAGE_OBSERVED");
assert.equal(twseCap.events[0].correctionHintCount,1);
assert.equal(twseCap.events[0].strictChains[0].state,"CHAIN_OBSERVED");

const twsePar=receipt.laneResults.find((x)=>x.sourceId==="TWSE_PAR_VALUE_CHANGE_REFERENCE");
assert.equal(twsePar.events[0].state,"HISTORY_BUNDLE_ONLY_UNRESOLVED");

const tpexCap=receipt.laneResults.find((x)=>x.sourceId==="TPEX_CAPITAL_REDUCTION_REFERENCE");
assert.equal(tpexCap.events[0].state,"STRICT_LINKAGE_CHAIN_AMBIGUOUS");

const tpexPar=receipt.laneResults.find((x)=>x.sourceId==="TPEX_PAR_VALUE_CHANGE_REFERENCE");
assert.equal(tpexPar.events[0].state,"QUERY_INTEGRITY_INCOMPLETE");

console.log("bounded event-version linkage V0.1 tests PASS");
