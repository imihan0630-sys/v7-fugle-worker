import assert from "node:assert/strict";
import {validateRequest,validatePayload,validateDecisionPrefix} from "./d01_sara_60m_source_admission_v0_1.mjs";
// All rows below are synthetic and NEVER market-data source witnesses.
const goodRequest={symbol:"1101",from:"2026-08-01",to:"2026-10-08",timeframe:"60"};
const owner={symbol:"1101",exchange:"TWSE",instrumentClass:"ORDINARY_COMMON",
 queryReceiptId:"SYN-QUERY",queryHash:"SYN-HASH",containsActualRows:true,
 bucketTimestampSemantics:"OPEN",bucketEndReceiptVerified:true,
 bucketReceiptId:"SYN-BUCKET",sessionCalendarVerified:true,
 rawPriceSpaceCertified:true,corporateActionCoverageCertified:true,volumeUnit:"LOTS"};
function makeRow(i){
 const start=Date.parse("2026-08-01T09:00:00+08:00")+i*3600000;
 return {date:new Date(start).toISOString(),certifiedEndAt:new Date(start+3600000).toISOString(),
 firstKnownAt:new Date(start+3601000).toISOString(),open:100,high:102,low:99,
 close:101,volume:12,bucketOwnerReceiptId:"SYN-BUCKET",sourceRevisionId:"SYN-REV"};
}
const payload={symbol:"1101",exchange:"TWSE",timeframe:"60",data:[makeRow(0),makeRow(1)]};
const cases=[
 ["official supported 60m request",()=>assert.equal(validateRequest(goodRequest).state,"REQUEST_VALID")],
 ["daily not 60m",()=>assert.equal(validateRequest({...goodRequest,timeframe:"D"}).reason,"NOT_60_MINUTES")],
 ["no minute history before 2023-05-23",()=>assert.equal(validateRequest({...goodRequest,from:"2023-05-22"}).reason,"MINUTE_HISTORY_BEGINS_2023_05_23")],
 ["minute adjusted option forbidden even false",()=>assert.equal(validateRequest({...goodRequest,adjusted:false}).reason,"MINUTE_ADJUSTED_NOT_DOCUMENTED")],
 ["reverse date invalid",()=>assert.equal(validateRequest({...goodRequest,from:"2026-10-09"}).reason,"DATE_RANGE_INVALID")],
 [">=365 days blocked",()=>assert.equal(validateRequest({...goodRequest,from:"2025-08-01"}).reason,"REQUEST_RANGE_ONE_YEAR_OR_MORE")],
 ["opaque connector content id not physical rows",()=>assert.equal(validatePayload({contentId:"FCNT000154?..."},owner).reason,"CONNECTOR_CONTENT_ID_ONLY_NOT_ROWS")],
 ["no source owner receipt",()=>assert.equal(validatePayload(payload,{...owner,queryHash:null}).reason,"OWNER_QUERY_PROVENANCE_MISSING")],
 ["live minute bar clock semantics not established by documentation",()=>assert.equal(validatePayload(payload,{...owner,bucketTimestampSemantics:"UNKNOWN"}).reason,"BAR_TIMESTAMP_MEANING_UNVERIFIED")],
 ["session bucket receipt required",()=>assert.equal(validatePayload(payload,{...owner,bucketEndReceiptVerified:false}).reason,"BUCKET_END_OR_SESSION_NOT_VERIFIED")],
 ["missing corporate action continuity blocks",()=>assert.equal(validatePayload(payload,{...owner,corporateActionCoverageCertified:false}).reason,"CORPORATE_ACTION_CONTINUITY_UNKNOWN")],
 ["minute listed stock volume unit lots",()=>assert.equal(validatePayload(payload,{...owner,volumeUnit:"SHARES"}).reason,"MINUTE_COMMON_STOCK_VOLUME_IS_LOTS")],
 ["no volume unit guess",()=>assert.equal(validatePayload(payload,{...owner,volumeUnit:null}).reason,"VOLUME_UNIT_UNKNOWN")],
 ["60m payload timeframe mismatch",()=>assert.equal(validatePayload({...payload,timeframe:"D"},owner).reason,"PAYLOAD_IDENTITY_OR_PERIOD_CONFLICT")],
 ["invalid OHLC blocked",()=>assert.equal(validatePayload({...payload,data:[{...makeRow(0),low:103}]},owner).reason,"BAR_OHLC_INVALID")],
 ["unversioned bar blocked",()=>assert.equal(validatePayload({...payload,data:[{...makeRow(0),sourceRevisionId:null}]},owner).reason,"BAR_REVISION_UNKNOWN")],
 ["no timezone blocked",()=>assert.equal(validatePayload({...payload,data:[{...makeRow(0),date:"2026-08-01T09:00:00"}]},owner).reason,"BAR_DATE_TZ_ORDER_OR_DUPLICATE")],
 ["two row synthetic admission",()=>assert.equal(validatePayload(payload,owner).state,"PHYSICAL_SOURCE_ADMISSIBLE")],
 ["retroactive revised bar not decision time available",()=>{
 const a={data:[{...makeRow(0),firstKnownAt:"2026-09-01T16:30:00+08:00"}]};
 assert.equal(validateDecisionPrefix(a,"2026-08-02T09:00:00+08:00").reason,"RETROSPECTIVE_REVISION_NOT_AVAILABLE_AT_DECISION");
 }],
 ["244 bars cannot compute MA240 plus slope",()=>{
 const a={data:Array.from({length:244},(_,i)=>makeRow(i))};
 assert.equal(validateDecisionPrefix(a,"2026-09-30T16:30:00+08:00").reason,"PREFIX_WARMUP_INSUFFICIENT");
 }],
 ["245 complete synthetic bars pass prefix-count only",()=>{
 const a={data:Array.from({length:245},(_,i)=>makeRow(i))};
 assert.equal(validateDecisionPrefix(a,"2026-09-30T16:30:00+08:00").state,"PREFIX_READY");
 }]
];
let passed=0,fail=[];
for(const [name,fn] of cases)try{fn();passed++;console.log("PASS "+name)}
 catch(e){fail.push({name,error:e.message});console.error("FAIL "+name+": "+e.message)}
console.log(JSON.stringify({suite:"D01 Sara 60m synthetic source admission",pass:passed,total:cases.length,failed:fail}));
if(fail.length)process.exitCode=1;
