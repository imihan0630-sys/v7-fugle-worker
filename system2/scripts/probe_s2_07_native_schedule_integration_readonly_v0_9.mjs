import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildOfficialTradingDatesV0_1 } from "../runtime/official_historical_backfill_source_v0_1.mjs";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import {
  parseCorporateActionNativeScheduleV0_9,
  evaluateNativeScheduleIntegrationV0_9,
  summarizeNativeScheduleIntegrationV0_9,
} from "../runtime/s2_07_native_schedule_integration_v0_9.mjs";

const START="2026-04-05";
const END="2026-10-02";
const RECEIPT_URL=new URL("../evidence/S2_07_PROMOTION_LINKAGE_V0_7_PHYSICAL_20261006.json",import.meta.url);
const FROZEN=[
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","6176","2026-08-24","CAPITAL_REDUCTION","TWSE"],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","1563","2026-09-07","CAPITAL_REDUCTION","TWSE"],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","3356","2026-09-21","CAPITAL_REDUCTION","TWSE"],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","3591","2026-09-21","CAPITAL_REDUCTION","TWSE"],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","1441","2026-09-29","CAPITAL_REDUCTION","TWSE"],
 ["TWSE_CAPITAL_REDUCTION_REFERENCE","6550","2026-09-29","CAPITAL_REDUCTION","TWSE"],
 ["TWSE_PAR_VALUE_CHANGE_REFERENCE","6949","2026-09-07","PAR_VALUE_CHANGE","TWSE"],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","5381","2026-04-13","CAPITAL_REDUCTION","TPEX"],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","6241","2026-08-25","CAPITAL_REDUCTION","TPEX"],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","6129","2026-09-14","CAPITAL_REDUCTION","TPEX"],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","3710","2026-09-21","CAPITAL_REDUCTION","TPEX"],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","8277","2026-09-21","CAPITAL_REDUCTION","TPEX"],
 ["TPEX_CAPITAL_REDUCTION_REFERENCE","4806","2026-10-02","CAPITAL_REDUCTION","TPEX"],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","8937","2026-04-13","PAR_VALUE_CHANGE","TPEX"],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","3086","2026-04-20","PAR_VALUE_CHANGE","TPEX"],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","5904","2026-08-10","PAR_VALUE_CHANGE","TPEX"],
 ["TPEX_PAR_VALUE_CHANGE_REFERENCE","4747","2026-08-31","PAR_VALUE_CHANGE","TPEX"],
].map(([sourceId,symbol,effectiveDate,family,market])=>({sourceId,symbol,effectiveDate,family,market}));

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
async function fetchTextWithRetry(url,{attempts=4,timeoutMs=30000}={}){
 let last=null;
 for(let i=1;i<=attempts;i++){
  try{
   const res=await fetch(url,{headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-S2-07-Native-Schedule-Integration/0.9"},signal:AbortSignal.timeout(timeoutMs)});
   const raw=await res.text();
   if(res.ok)return {res,raw};
   last=new Error("HTTP "+res.status);
  }catch(e){last=e;}
  if(i<attempts)await sleep(500*i);
 }
 throw last||new Error("official-source fetch failed");
}

const promotionReceipt=JSON.parse(await readFile(RECEIPT_URL,"utf8"));
assert.equal(promotionReceipt.schemaVersion,"S2_S2_07_PROMOTION_LINKAGE_PHYSICAL_RECEIPT_V0_7");
assert.equal(promotionReceipt.summary.eventCount,17);
const promotionByKey=new Map(promotionReceipt.events.map(x=>[
  [x.market,x.symbol,x.effectiveDate,x.family].join("|"),x,
]));

const urls=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:END});
const parsedBySource={};
for(const sourceId of [...new Set(FROZEN.map(x=>x.sourceId))]){
  const source=urls[sourceId];
  assert.ok(source?.url,sourceId+" source url");
  const fetched=await fetchTextWithRetry(source.url);
  const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
    sourceId,sourceUrl:source.url,rawText:fetched.raw,fetchedAt:new Date().toISOString(),
    requestedStartDate:START,requestedEndDate:END,
  });
  assert.equal(parsed.responseRangeVerified,true,sourceId);
  assert.equal(parsed.parserComplete,true,sourceId);
  parsedBySource[sourceId]=parsed;
}

const calendar=await buildOfficialTradingDatesV0_1({fromDate:START,toDate:END});
assert.ok(calendar.tradingDateCount>0);

const rows=[];
for(const e of FROZEN){
  const official=parsedBySource[e.sourceId].events.find(x=>x.symbol===e.symbol&&x.effectiveDate===e.effectiveDate);
  assert.ok(official,e.sourceId+" "+e.symbol+" "+e.effectiveDate);
  const promotion=promotionByKey.get([e.market,e.symbol,e.effectiveDate,e.family].join("|"));
  assert.ok(promotion,"promotion receipt missing "+e.symbol);
  const schedule=parseCorporateActionNativeScheduleV0_9({
    sourceId:e.sourceId,
    market:e.market,
    rawDetail:official.continuityEffect?.detail||null,
    effectiveDate:e.effectiveDate,
    eventVersionId:official.eventVersionId||null,
    sourceRowHash:official.sourceRowHash||null,
  });
  const integrated=evaluateNativeScheduleIntegrationV0_9({
    event:e,
    promotion:{state:promotion.state},
    marketSessions:calendar.tradingDates,
    schedule,
  });
  rows.push(integrated);
}

const summary=summarizeNativeScheduleIntegrationV0_9(rows);
const ready=rows.filter(x=>x.boundedNativeSymbolSessionEvidenceReady).map(x=>x.symbol).sort();
assert.equal(summary.eventCount,17);
assert.equal(summary.promotionReadyCount,7);
assert.equal(summary.nativeScheduleCertifiedCount,10);
assert.equal(summary.boundedNativeSymbolSessionEvidenceReadyCount,4);
assert.deepEqual(ready,["3086","4806","5381","6241"]);
assert.equal(summary.noSuspensionCertifiedCount,0);
assert.equal(summary.suspensionCoverageComplete,false);
assert.equal(summary.symbolSessionCompletenessCertified,false);
assert.equal(summary.rawA1LineageBound,false);
assert.equal(summary.technicalContinuityCertified,false);
assert.equal(summary.selectionAuthority,false);
assert.equal(summary.orderImpact,false);
for(const row of rows){
  assert.equal(row.noSuspensionMayBeClaimed,false);
  assert.equal(row.rawA1LineageBound,false);
  assert.equal(row.technicalContinuityCertified,false);
  assert.equal(row.system1RuntimeUsed,false);
}

console.log(JSON.stringify({
  result:"S2_07_NATIVE_SCHEDULE_INTEGRATION_V0_9_COMPLETE",
  interval:{startDate:START,endDate:END},
  calendar:{source:calendar.source,tradingDateCount:calendar.tradingDateCount},
  summary,
  readySymbols:ready,
  events:rows,
  boundaries:{
    nearestPriorDateInferenceAllowed:false,
    noSuspensionMayBeClaimed:false,
    rawA1LineageBound:false,
    technicalContinuityCertified:false,
    tradingAuthority:false,
  },
},null,2));
