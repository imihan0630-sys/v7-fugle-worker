import assert from "node:assert/strict";
import {buildOfficialContinuitySourceUrlsV0_1} from "../runtime/official_continuity_source_capability_v0_1.mjs";
import {parseOfficialHistoricalContinuityPayloadV0_1} from "../runtime/official_continuity_event_parser_v0_1.mjs";

const START="2026-04-05",END="2026-10-02";
const FROZEN=[
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","6176","2026-08-24"],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","1563","2026-09-07"],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","3356","2026-09-21"],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","3591","2026-09-21"],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","1441","2026-09-29"],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","6550","2026-09-29"],
 ["TWSE_PAR_VALUE_CHANGE_REFERENCE","6949","2026-09-07"],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","5381","2026-04-13"],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","6241","2026-08-25"],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","6129","2026-09-14"],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","3710","2026-09-21"],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","8277","2026-09-21"],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","4806","2026-10-02"],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","8937","2026-04-13"],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","3086","2026-04-20"],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","5904","2026-08-10"],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","4747","2026-08-31"],
].map(([sourceId,symbol,effectiveDate])=>({sourceId,symbol,effectiveDate}));

async function fetchText(url){
 const res=await fetch(url,{headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-S2-07-Native-Schedule-Discovery/0.9"},signal:AbortSignal.timeout(30000)});
 const raw=await res.text();
 assert.equal(res.ok,true,url+" HTTP "+res.status);
 return raw;
}

const urls=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:END});
const parsedBySource={};
for(const sourceId of [...new Set(FROZEN.map(x=>x.sourceId))]){
 const source=urls[sourceId];
 assert.ok(source?.url,"missing source URL "+sourceId);
 const raw=await fetchText(source.url);
 const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
  sourceId,sourceUrl:source.url,rawText:raw,fetchedAt:new Date().toISOString(),
  requestedStartDate:START,requestedEndDate:END,
 });
 assert.equal(parsed.responseRangeVerified,true);
 assert.equal(parsed.parserComplete,true);
 parsedBySource[sourceId]=parsed;
}
const events=FROZEN.map(e=>{
 const event=parsedBySource[e.sourceId].events.find(x=>x.symbol===e.symbol&&x.effectiveDate===e.effectiveDate);
 assert.ok(event,"missing official event "+JSON.stringify(e));
 return {
  sourceId:e.sourceId,
  exchange:event.exchange,
  symbol:event.symbol,
  actionFamilyId:event.actionFamilyId,
  eventStage:event.eventStage,
  effectiveDate:event.effectiveDate,
  subtype:event.continuityEffect?.subtype||null,
  detail:event.continuityEffect?.detail||null,
  eventVersionId:event.eventVersionId,
  sourceRowHash:event.sourceRowHash,
  observedAt:event.observedAt,
  knowledgeTimeMode:event.knowledgeTimeMode,
 };
});
console.log(JSON.stringify({
 result:"S2_07_NATIVE_SCHEDULE_DISCOVERY_V0_9_COMPLETE",
 interval:{startDate:START,endDate:END},
 eventCount:events.length,
 events,
 technicalContinuityCertified:false,
 selectionAuthority:false,
 orderImpact:false,
 system1RuntimeUsed:false,
},null,2));
