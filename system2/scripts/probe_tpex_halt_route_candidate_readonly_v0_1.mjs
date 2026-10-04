import assert from "node:assert/strict";

const PAGE="https://www.tpex.org.tw/zh-tw/announce/market/halt/historical.html";
const ACTION="bulletin/sprcHis";
const API="https://www.tpex.org.tw/www/zh-tw/"+ACTION;
const YEAR=2026;
const UA="System2-TPEx-Halt-Route-Candidate/0.1";

async function get(url,accept="application/json,text/plain,text/html,*/*"){
  const response=await fetch(url,{
    redirect:"follow",
    headers:{accept,"user-agent":UA},
    signal:AbortSignal.timeout(30000),
  });
  const text=await response.text();
  return {
    requestedUrl:url,
    finalUrl:response.url,
    httpStatus:response.status,
    ok:response.ok,
    contentType:response.headers.get("content-type"),
    text,
  };
}
function parseJson(text){ try{return JSON.parse(text);}catch{return null;} }
function uniq(xs){return [...new Set(xs)];}

const page=await get(PAGE,"text/html,*/*");
assert.equal(page.ok,true,"official TPEx halt page must be readable");
const actionObserved=new RegExp("action\\s*:\\s*[\"']"+ACTION.replace("/","\\/")+"[\"']").test(page.text);
assert.equal(actionObserved,true,"official page must expose "+ACTION);

const cateBlock=page.text.match(/<select\b[^>]*name=["']cate["'][^>]*>([\s\S]*?)<\/select>/i)?.[1]||"";
const categoryValues=uniq([...cateBlock.matchAll(/<option\b[^>]*value=["']?([^"'\s>]*)/gi)].map(m=>m[1]));
const probes=[];
const cateCandidates=uniq(["",...categoryValues]);

for(const cate of cateCandidates){
  const u=new URL(API);
  u.searchParams.set("date",String(YEAR));
  if(cate!=="") u.searchParams.set("cate",cate);
  u.searchParams.set("response","json");
  const fetched=await get(u.toString());
  const json=parseJson(fetched.text);
  const tables=Array.isArray(json?.tables)?json.tables:[];
  const rowCount=tables.reduce((n,t)=>n+(Array.isArray(t?.data)?t.data.length:0),0);
  probes.push({
    cate,
    url:u.toString(),
    finalUrl:fetched.finalUrl,
    httpStatus:fetched.httpStatus,
    contentType:fetched.contentType,
    jsonParsed:json!==null,
    topLevelKeys:json&&typeof json==="object"&&!Array.isArray(json)?Object.keys(json).slice(0,40):[],
    tableCount:tables.length,
    rowCount,
    tableFields:tables.slice(0,3).map(t=>Array.isArray(t?.fields)?t.fields:[]),
    responseIdentity:{
      date:json?.date??null,
      year:json?.year??null,
      stat:json?.stat??json?.status??null,
    },
    bodySample:fetched.text.slice(0,800),
  });
}

const viable=probes.filter(x=>x.httpStatus===200 && x.jsonParsed && x.tableCount>0);
console.log(JSON.stringify({
  schemaVersion:"S2_TPEX_HALT_ROUTE_CANDIDATE_V0_1",
  result:viable.length>0?"OFFICIAL_DATA_ROUTE_PHYSICALLY_OBSERVED":"OFFICIAL_ACTION_OBSERVED_ROUTE_NOT_YET_READY",
  pageHttpStatus:page.httpStatus,
  actionObserved,
  action:ACTION,
  apiCandidate:API,
  categoryValues,
  probeCount:probes.length,
  viableProbeCount:viable.length,
  viableCategories:viable.map(x=>x.cate),
  probes,

  tpexSuspensionSourceCapabilityReady:false,
  responseRangeSemanticsCertified:false,
  emptyRangeSemanticsCertified:false,
  suspensionCoverageComplete:false,
  noEventMayBeClaimed:false,
  symbolSessionCompletenessCertified:false,
  technicalContinuityCertified:false,
  system1RuntimeUsed:false,
},null,2));
