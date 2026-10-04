import assert from "node:assert/strict";
import { createHash } from "node:crypto";

const BASE="https://www.twse.com.tw/exchangeReport/TWTB7U";
const CONTROLS=Object.freeze([
  {id:"TWSE_PV_4763_2025",date:"20250630",symbol:"4763",expectedEffectiveDate:"2025-06-30"},
  {id:"TWSE_PV_6919_2025",date:"20250721",symbol:"6919",expectedEffectiveDate:"2025-07-21"},
  {id:"TWSE_PV_2327_2025",date:"20250825",symbol:"2327",expectedEffectiveDate:"2025-08-25"},
  {id:"TWSE_PV_8422_2025",date:"20251117",symbol:"8422",expectedEffectiveDate:"2025-11-17"},
  {id:"TWSE_PV_6949_2026_POSITIVE_CONTROL",date:"20260907",symbol:"6949",expectedEffectiveDate:"2026-09-07"},
]);

function sha256(text){ return createHash("sha256").update(text).digest("hex"); }
function strings(value,out=[]){
  if(value==null) return out;
  if(typeof value==="string"||typeof value==="number"||typeof value==="boolean"){
    out.push(String(value)); return out;
  }
  if(Array.isArray(value)){ for(const x of value) strings(x,out); return out; }
  if(typeof value==="object"){ for(const [k,v] of Object.entries(value)){ out.push(String(k)); strings(v,out); } }
  return out;
}
function candidateSymbolPresence(text,symbol){
  return new RegExp("(^|[^0-9])"+symbol+"([^0-9]|$)").test(text);
}
function dateTokens(text){
  const out=new Set();
  for(const m of String(text).matchAll(/(?:20\d{2}[\/-]\d{1,2}[\/-]\d{1,2}|1\d{2}[\/-]\d{1,2}[\/-]\d{1,2}|20\d{6}|1\d{6})/g)) out.add(m[0]);
  return [...out].slice(0,80);
}
function normalizeForCompare(text){
  return String(text).replace(/\s+/g," ").trim();
}

async function fetchOne(control,format){
  const url=BASE+"?date="+encodeURIComponent(control.date)+"&response="+format+"&selectType=";
  const response=await fetch(url,{
    headers:{accept:format==="json"?"application/json,text/plain,*/*":"text/html,text/plain,*/*","user-agent":"System2-TWTB7U-Historical-Semantics/0.1"},
    redirect:"follow",
    signal:AbortSignal.timeout(30000),
  });
  const raw=await response.text();
  let parsed=null;
  let parseError=null;
  if(format==="json"){
    try{ parsed=JSON.parse(raw); }catch(e){ parseError=String(e?.message||e); }
  }
  const flattened=parsed?strings(parsed,[]).join(" | "):normalizeForCompare(raw);
  const responseDate =
    parsed && typeof parsed==="object" && !Array.isArray(parsed)
      ? (parsed.date ?? parsed?.params?.date ?? parsed?.params?.startDate ?? null)
      : null;
  return {
    controlId:control.id,
    requestDate:control.date,
    symbol:control.symbol,
    expectedEffectiveDate:control.expectedEffectiveDate,
    format,
    url,
    httpStatus:response.status,
    ok:response.ok,
    contentType:response.headers.get("content-type")||null,
    payloadBytes:Buffer.byteLength(raw),
    payloadHash:sha256(raw),
    parseReady:format==="json"?parsed!==null:true,
    parseError,
    responseDate:responseDate==null?null:String(responseDate),
    upstreamStatus:parsed?.stat??parsed?.status??null,
    title:parsed?.title??null,
    candidateSymbolObserved:candidateSymbolPresence(flattened,control.symbol),
    observedCandidateSymbols:["4763","6919","2327","8422","6949"].filter(s=>candidateSymbolPresence(flattened,s)),
    dateTokenSample:dateTokens(flattened),
    textSample:flattened.slice(0,1800),
  };
}

const results=[];
for(const control of CONTROLS){
  for(const format of ["json","html"]){
    try{
      results.push(await fetchOne(control,format));
    }catch(error){
      results.push({
        controlId:control.id,requestDate:control.date,symbol:control.symbol,expectedEffectiveDate:control.expectedEffectiveDate,
        format,url:BASE+"?date="+control.date+"&response="+format+"&selectType=",
        httpStatus:null,ok:false,contentType:null,payloadBytes:0,payloadHash:null,parseReady:false,
        parseError:String(error?.message||error),responseDate:null,upstreamStatus:null,title:null,
        candidateSymbolObserved:false,observedCandidateSymbols:[],dateTokenSample:[],textSample:"",
      });
    }
  }
}

const jsonResults=results.filter(x=>x.format==="json");
const htmlResults=results.filter(x=>x.format==="html");
const historical=jsonResults.filter(x=>x.requestDate.startsWith("2025"));
const positive=jsonResults.find(x=>x.controlId==="TWSE_PV_6949_2026_POSITIVE_CONTROL");

const uniqueHistoricalHashes=new Set(historical.map(x=>x.payloadHash).filter(Boolean));
const historicalCandidateHits=historical.filter(x=>x.candidateSymbolObserved).length;
const allHistoricalSameAsPositive=
  positive?.payloadHash &&
  historical.length>0 &&
  historical.every(x=>x.payloadHash===positive.payloadHash);
const anyRequestIdentityEvidence=historical.some(x=>{
  const token=x.requestDate;
  const y=token.slice(0,4),m=String(Number(token.slice(4,6))),d=String(Number(token.slice(6,8)));
  const roc=String(Number(y)-1911);
  const sample=(x.dateTokenSample||[]).join("|");
  return sample.includes(token) || sample.includes(y+"/"+m+"/"+d) || sample.includes(roc+"/"+m+"/"+d)
    || String(x.responseDate||"").includes(token) || String(x.responseDate||"").includes(y);
});

let state="TWTB7U_HISTORICAL_SEMANTICS_UNRESOLVED";
if(historicalCandidateHits>0 && anyRequestIdentityEvidence){
  state="TWTB7U_HISTORICAL_DATE_CAPABILITY_OBSERVED";
}else if(allHistoricalSameAsPositive || (uniqueHistoricalHashes.size===1 && historicalCandidateHits===0)){
  state="TWTB7U_HISTORICAL_DATE_NOT_OBSERVED";
}

const result={
  schemaVersion:"S2_TWSE_TWTB7U_HISTORICAL_SEMANTICS_V0_1",
  observedAt:new Date().toISOString(),
  state,
  controlCount:CONTROLS.length,
  requestCount:results.length,
  jsonHttpReadyCount:jsonResults.filter(x=>x.ok).length,
  htmlHttpReadyCount:htmlResults.filter(x=>x.ok).length,
  historicalJsonUniquePayloadHashCount:uniqueHistoricalHashes.size,
  historicalCandidateHitCount:historicalCandidateHits,
  positiveControlCandidateObserved:positive?.candidateSymbolObserved===true,
  allHistoricalSameAsPositive:Boolean(allHistoricalSameAsPositive),
  anyRequestIdentityEvidence,
  results,
  representativeControlPromoted:false,
  representativeAuthorityReadyCount:5,
  authorityRevisionCoverageComplete:false,
  publicAvailabilityLatencyCertified:false,
  knownAtVersionClockCertified:false,
  revisionCoverageComplete:false,
  noEventMayBeClaimed:false,
  technicalContinuityCertified:false,
  selectionAuthority:false,
  finalSelectionEnabled:false,
  livePushEnabled:false,
  capitalImpact:false,
  orderImpact:false,
  system1RuntimeUsed:false,
};

assert.equal(result.controlCount,5);
assert.equal(result.requestCount,10);
assert.equal(result.representativeControlPromoted,false);
assert.equal(result.representativeAuthorityReadyCount,5);
assert.equal(result.revisionCoverageComplete,false);
assert.equal(result.system1RuntimeUsed,false);

console.log(JSON.stringify(result,null,2));
