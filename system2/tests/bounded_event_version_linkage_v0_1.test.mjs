import assert from "node:assert/strict";
import {
  buildBoundedEventVersionLinkageV0_1,
  extractDateTokensV0_1,
} from "../runtime/bounded_event_version_linkage_v0_1.mjs";
import {
  buildMopsMaterialDetailRequestV0_1,
  parseMopsMaterialDetailHtmlV0_1,
} from "../runtime/mops_material_detail_source_capability_v0_1.mjs";

assert.deepEqual(
  [...extractDateTokensV0_1("公告115年6月1日及2026/06/02相關事宜")],
  ["2026-06-01","2026-06-02"],
);

const detailRequest=buildMopsMaterialDetailRequestV0_1({
  stockCode:"1111",
  spokeDateRaw:"20260520",
  spokeTimeRaw:"090000",
  seqNo:"1",
  typek:"sii",
});
const detailUrl=new URL(detailRequest.url);
assert.equal(detailUrl.hostname,"mopsov.twse.com.tw");
assert.equal(detailUrl.searchParams.get("step"),"2");
assert.equal(detailUrl.searchParams.get("co_id"),"1111");
assert.equal(detailUrl.searchParams.get("spoke_date"),"20260520");
assert.equal(detailUrl.searchParams.get("spoke_time"),"090000");
assert.equal(detailUrl.searchParams.get("seq_no"),"1");
assert.equal(detailUrl.searchParams.get("year"),"115");

const parsedDetail=await parseMopsMaterialDetailHtmlV0_1({
  html:"<html><body>本資料由 (上市公司) 1111 測試公司 公司提供 序號 1 發言日期 115/05/20 發言時間 09:00:00 主旨 公告本公司減資換發股票 符合條款 第 11 款 事實發生日 115/05/20 說明 1.減資換股基準日115/05/29。 2.新股票上市日期訂為民國115年6月1日。 以上資料均由各公司依規定申報。</body></html>",
  stockCode:"1111",
  spokeDateRaw:"20260520",
  spokeTimeRaw:"090000",
  seqNo:"1",
});
assert.equal(parsedDetail.identityObserved,true);
assert.deepEqual([...parsedDetail.bodyDateTokens],["2026-05-29","2026-06-01"]);
assert.ok(parsedDetail.bodyTextHash.length===64);
assert.equal(parsedDetail.bodyText.includes("以上資料均由"),false);

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

function detail(tokens, suffix){
  return {
    detailTransportReady:true,
    detailIdentityObserved:true,
    detailBodyDateTokens:tokens,
    detailBodyTextHash:"body-"+suffix,
    detailPayloadHash:"payload-"+suffix,
    detailTransportMode:"TEST",
  };
}

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
        spokeDateRaw:"20260520",spokeTimeRaw:"090000",
        rowText:"1111 公告本公司減資換發股票",
        correctionOrCancellationHint:false,
        ...detail(["2026-05-29","2026-06-01"],"1111-a"),
      },
      {
        date:"2026-05-21",time:"10:00:00",seqNo:"2",
        spokeDateRaw:"20260521",spokeTimeRaw:"100000",
        rowText:"1111 更正公告本公司減資換發股票",
        correctionOrCancellationHint:true,
        ...detail(["2026-06-01"],"1111-b"),
      },
    ],
  }),
  "2222":history({
    PAR_VALUE_CHANGE:[
      {
        date:"2026-06-01",time:"09:00:00",seqNo:"3",
        spokeDateRaw:"20260601",spokeTimeRaw:"090000",
        rowText:"2222 股票面額變更換發新股作業",
        correctionOrCancellationHint:false,
        ...detail(["2026-06-30"],"2222-a"),
      },
    ],
  }),
  "3333":history({
    CAPITAL_REDUCTION:[
      {
        date:"2026-07-01",time:"09:00:00",seqNo:"4",
        spokeDateRaw:"20260701",spokeTimeRaw:"090000",
        rowText:"3333 減資換發股票",
        correctionOrCancellationHint:false,
        ...detail(["2026-08-01"],"3333-a"),
      },
      {
        date:"2026-07-02",time:null,seqNo:"5",
        spokeDateRaw:"20260702",spokeTimeRaw:null,
        rowText:"3333 更正減資換發股票",
        correctionOrCancellationHint:true,
        ...detail(["2026-08-01"],"3333-b"),
      },
    ],
  }),
  "4444":history({
    PAR_VALUE_CHANGE:[
      {
        date:"2026-08-01",time:"09:00:00",seqNo:"6",
        spokeDateRaw:"20260801",spokeTimeRaw:"090000",
        rowText:"4444 股票面額變更",
        correctionOrCancellationHint:false,
        ...detail(["2026-09-01"],"4444-a"),
      },
      {
        date:"2025-12-01",time:"08:00:00",seqNo:"7",
        spokeDateRaw:"20251201",spokeTimeRaw:"080000",
        rowText:"4444 過往股票面額變更相關公告",
        correctionOrCancellationHint:false,
        detailTransportReady:false,
        detailIdentityObserved:false,
        detailBodyDateTokens:[],
        detailBodyTextHash:null,
        detailPayloadHash:null,
        detailTransportMode:"TEST",
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
assert.equal(receipt.strictLinkedEventCount,2);
assert.equal(receipt.unresolvedEventCount,2);
assert.equal(receipt.queryIntegrityCompleteEventCount,3);
assert.equal(receipt.detailCoverageCompleteEventCount,3);
assert.equal(receipt.boundedEventVersionLinkageComplete,false);
assert.equal(receipt.revisionCoverageComplete,false);
assert.equal(receipt.knownAtVersionClockCertified,false);

const twseCap=receipt.laneResults.find((x)=>x.sourceId==="TWSE_CAPITAL_REDUCTION_REFERENCE");
assert.equal(twseCap.events[0].state,"STRICT_LINKAGE_OBSERVED");
assert.equal(twseCap.events[0].detailCoverageComplete,true);
assert.equal(twseCap.events[0].correctionHintCount,1);
assert.equal(twseCap.events[0].strictChains[0].state,"CHAIN_OBSERVED");

const twsePar=receipt.laneResults.find((x)=>x.sourceId==="TWSE_PAR_VALUE_CHANGE_REFERENCE");
assert.equal(twsePar.events[0].state,"DETAIL_HISTORY_ONLY_UNRESOLVED");

const tpexCap=receipt.laneResults.find((x)=>x.sourceId==="TPEX_CAPITAL_REDUCTION_REFERENCE");
assert.equal(tpexCap.events[0].state,"STRICT_LINKAGE_CHAIN_AMBIGUOUS");

const tpexPar=receipt.laneResults.find((x)=>x.sourceId==="TPEX_PAR_VALUE_CHANGE_REFERENCE");
assert.equal(tpexPar.events[0].state,"STRICT_LINKAGE_OBSERVED");
assert.equal(tpexPar.events[0].queryIntegrityComplete,false);
assert.equal(tpexPar.events[0].detailCoverageComplete,false);
assert.equal(tpexPar.events[0].negativeCompletenessInputReady,false);
assert.equal(receipt.negativeCompletenessInputReadyEventCount,1);

console.log("bounded event-version linkage V0.1 tests PASS");
