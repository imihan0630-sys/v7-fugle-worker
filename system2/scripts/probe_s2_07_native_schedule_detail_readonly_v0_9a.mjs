import assert from "node:assert/strict";
import {buildOfficialContinuitySourceUrlsV0_1} from "../runtime/official_continuity_source_capability_v0_1.mjs";
import {parseOfficialHistoricalContinuityPayloadV0_1} from "../runtime/official_continuity_event_parser_v0_1.mjs";

const START="2026-04-05",END="2026-10-02";
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
   const res=await fetch(url,{headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-S2-07-Native-Schedule-Diagnostic/0.9a"},signal:AbortSignal.timeout(timeoutMs)});
   const raw=await res.text();
   if(res.ok)return {res,raw};
   last=new Error("HTTP "+res.status);
  }catch(e){last=e;}
  if(i<attempts)await sleep(500*i);
 }
 throw last||new Error("official-source fetch failed");
}
function normalizeDateToken(value){
 const t=String(value||"").trim();
 const m=t.match(/(?:(\d{3})|(\d{4}))[年\/.\-](\d{1,2})[月\/.\-](\d{1,2})/);
 if(!m)return null;
 const y=m[2]?Number(m[2]):Number(m[1])+1911;
 return String(y).padStart(4,"0")+"-"+String(Number(m[3])).padStart(2,"0")+"-"+String(Number(m[4])).padStart(2,"0");
}
function detailDateTokens(detail){
 const t=String(detail||"");
 const matches=t.match(/(?:\d{3}|\d{4})[年\/.\-]\d{1,2}[月\/.\-]\d{1,2}/g)||[];
 return [...new Set(matches.map(normalizeDateToken).filter(Boolean))].sort();
}

const urls=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:END});
const parsedBySource={};
for(const sourceId of [...new Set(FROZEN.map(x=>x.sourceId))]){
 const source=urls[sourceId];
 assert.ok(source?.url,sourceId+" url");
 const f=await fetchTextWithRetry(source.url);
 const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
  sourceId,sourceUrl:source.url,rawText:f.raw,fetchedAt:new Date().toISOString(),
  requestedStartDate:START,requestedEndDate:END,
 });
 assert.equal(parsed.responseRangeVerified,true,sourceId);
 assert.equal(parsed.parserComplete,true,sourceId);
 parsedBySource[sourceId]=parsed;
}

const rows=FROZEN.map(e=>{
 const official=parsedBySource[e.sourceId].events.find(x=>x.symbol===e.symbol&&x.effectiveDate===e.effectiveDate);
 assert.ok(official,e.sourceId+" "+e.symbol+" "+e.effectiveDate);
 const detail=official.continuityEffect?.detail||null;
 const tokens=detailDateTokens(detail);
 return {
  ...e,
  eventVersionId:official.eventVersionId||null,
  sourceRowHash:official.sourceRowHash||null,
  resumeTradingDate:e.effectiveDate,
  rawDetail:detail,
  detailDateTokens:tokens,
  preResumeDateTokens:tokens.filter(x=>x<e.effectiveDate),
  includesResumeDateToken:tokens.includes(e.effectiveDate),
  nativeStopTradingStartCertified:false,
  nativeScheduleIntervalCertified:false,
  technicalContinuityCertified:false,
  selectionAuthority:false,
  tradingAuthority:false,
 };
});
assert.equal(rows.length,17);
assert.equal(rows.every(x=>x.nativeStopTradingStartCertified===false),true);
assert.equal(rows.every(x=>x.nativeScheduleIntervalCertified===false),true);
console.log(JSON.stringify({
 result:"S2_07_NATIVE_SCHEDULE_DIAGNOSTIC_V0_9A_COMPLETE",
 eventCount:rows.length,
 rawDetailPresentCount:rows.filter(x=>x.rawDetail).length,
 rows,
 boundaries:{
  nearestPriorDateInferenceAllowed:false,
  noSuspensionMayBeClaimed:false,
  rawA1LineageBound:false,
  technicalContinuityCertified:false,
  tradingAuthority:false,
 }
},null,2));
