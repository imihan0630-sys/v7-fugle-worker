import assert from "node:assert/strict";
import { probeMopsovDirectHistoryV0_1 } from "../runtime/mopsov_direct_history_source_v0_1.mjs";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";

const observedAt=new Date().toISOString();

const mops=await probeMopsovDirectHistoryV0_1({
  stockCode:"5356",
  rocYear:115,
  month:6,
  expectedDate:null,
  baseSubject:"除息基準日及發放日",
  observedAt,
});

assert.equal(mops.historyHttpStatus,200);
assert.equal(mops.directHistoryCapabilityObserved,true);
assert.equal(mops.revisionHistoryCapabilityObserved,true);
assert.ok(Number(mops.parsed?.matchingSubjectRowCount)>=2);
assert.ok(Number(mops.parsed?.originalRowCount)>=1);
assert.ok(Number(mops.parsed?.correctionOrCancellationRowCount)>=1);
assert.ok(Number(mops.parsed?.distinctVersionKeyCount)>=2);

const startDate="2026-07-01";
const endDate="2026-07-31";
const source=buildOfficialContinuitySourceUrlsV0_1({startDate,endDate})
  .TPEX_EX_RIGHT_DIVIDEND_ACTUAL;
assert.ok(source);

const response=await fetch(source.url,{
  headers:{
    accept:"application/json,text/plain,*/*",
    "user-agent":"System2-5356-Dividend-Control-Validation/0.1",
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

const symbolEvents=parsed.events.filter((x)=>x.symbol==="5356");
const matches=symbolEvents.filter((x)=>x.effectiveDate==="2026-07-08");

if(matches.length<1){
  const rawMentions=String(rawText||"").split(/\r?\n/)
    .filter((line)=>line.includes("5356"))
    .slice(0,40);
  console.log(JSON.stringify({
    result:"TPEX_5356_EXCHANGE_MATCH_DIAGNOSTIC",
    parsedState:parsed.state,
    parsedEventCount:parsed.eventCount,
    symbolEvents,
    rawMentions,
  },null,2));
}
assert.ok(matches.length>=1,"missing TPEx 5356 effective date 2026-07-08");

console.log(JSON.stringify({
  result:"TPEX_5356_DIVIDEND_REVISION_CONTROL_CANDIDATE_VERIFIED",
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
