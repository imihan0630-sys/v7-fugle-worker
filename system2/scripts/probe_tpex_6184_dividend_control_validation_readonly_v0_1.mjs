import assert from "node:assert/strict";
import { probeMopsovDirectHistoryV0_1 } from "../runtime/mopsov_direct_history_source_v0_1.mjs";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";

const observedAt=new Date().toISOString();

const mops=await probeMopsovDirectHistoryV0_1({
  stockCode:"6184",
  rocYear:113,
  month:5,
  expectedDate:null,
  baseSubject:"除息基準日及轉換公司債停止轉換期間",
  observedAt,
});

assert.equal(mops.historyHttpStatus,200);
assert.equal(mops.directHistoryCapabilityObserved,true);
assert.equal(mops.revisionHistoryCapabilityObserved,true);
assert.ok(Number(mops.parsed?.matchingSubjectRowCount)>=2);
assert.ok(Number(mops.parsed?.originalRowCount)>=1);
assert.ok(Number(mops.parsed?.correctionOrCancellationRowCount)>=1);
assert.ok(Number(mops.parsed?.distinctVersionKeyCount)>=2);

const startDate="2024-06-01";
const endDate="2024-06-30";
const source=buildOfficialContinuitySourceUrlsV0_1({startDate,endDate})
  .TPEX_EX_RIGHT_DIVIDEND_ACTUAL;
assert.ok(source);

const response=await fetch(source.url,{
  headers:{
    accept:"application/json,text/plain,*/*",
    "user-agent":"System2-6184-Dividend-Control-Validation/0.1",
  },
  signal:AbortSignal.timeout(30000),
});
const rawText=await response.text();
assert.equal(response.ok,true,"TPEx ex-right/dividend HTTP "+response.status);

const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
  sourceId:"TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
  sourceUrl:source.url,
  rawText,
  fetchedAt:observedAt,
  requestedStartDate:startDate,
  requestedEndDate:endDate,
});
assert.equal(parsed.responseRangeVerified,true);
assert.equal(parsed.parserComplete,true);

const symbolEvents=parsed.events.filter((x)=>x.symbol==="6184");
const rawMentions=String(rawText||"").split(/\\r?\\n/)
  .filter((line)=>line.includes("6184"))
  .slice(0,40);
const matches=symbolEvents.filter((x)=>x.effectiveDate==="2024-06-20");

if(matches.length<1){
  console.log(JSON.stringify({
    result:"TPEX_6184_EXCHANGE_MATCH_DIAGNOSTIC",
    requestedRange:{startDate,endDate},
    parsedState:parsed.state,
    parsedEventCount:parsed.eventCount,
    symbolEvents,
    rawMentions,
  },null,2));
}
assert.ok(matches.length>=1,"missing TPEx 6184 effective date 2024-06-20");

console.log(JSON.stringify({
  result:"TPEX_6184_DIVIDEND_REVISION_CONTROL_CANDIDATE_VERIFIED",
  observedAt,
  issuer:{
    historyHttpStatus:mops.historyHttpStatus,
    matchingSubjectRowCount:mops.parsed.matchingSubjectRowCount,
    originalRowCount:mops.parsed.originalRowCount,
    correctionOrCancellationRowCount:mops.parsed.correctionOrCancellationRowCount,
    distinctVersionKeyCount:mops.parsed.distinctVersionKeyCount,
    rows:mops.parsed.rows,
  },
  exchange:{
    sourceId:"TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
    requestedRange:{startDate,endDate},
    matchingEventCount:matches.length,
    events:matches.map((x)=>({
      symbol:x.symbol,
      effectiveDate:x.effectiveDate,
      eventVersionId:x.eventVersionId,
    })),
  },

  candidateOnly:true,
  representativeControlFrozen:false,
  publicAvailabilityLatencyCertified:false,
  knownAtVersionClockCertified:false,
  authorityRevisionCoverageComplete:false,
  revisionCoverageComplete:false,
  noEventMayBeClaimed:false,
  technicalContinuityCertified:false,
  selectionAuthority:false,
  livePushEnabled:false,
  capitalImpact:false,
  orderImpact:false,
  system1RuntimeUsed:false,
},null,2));
