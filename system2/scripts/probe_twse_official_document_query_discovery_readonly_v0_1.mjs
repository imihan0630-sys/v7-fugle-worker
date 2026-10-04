import assert from "node:assert/strict";
import { createHash } from "node:crypto";

const PAGE="https://www.twse.com.tw/zh/announcement/announcement/list.html";
const ALLOWED_HOSTS=new Set(["www.twse.com.tw","wwwc.twse.com.tw"]);
const TERMS=["announcement","公文公告","startDate","endDate","keyword","關鍵字","response=json","rwd/zh","ajax","query"];

function sha256(text){return createHash("sha256").update(text).digest("hex");}
function absolute(base,src){
  try{
    const u=new URL(src,base);
    if(u.protocol!=="https:"||!ALLOWED_HOSTS.has(u.hostname)) return null;
    return u.toString();
  }catch{return null;}
}
function scriptSrcs(html){
  const out=[];
  for(const m of String(html).matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)){
    const u=absolute(PAGE,m[1]);
    if(u&&!out.includes(u)) out.push(u);
  }
  return out;
}
function snippets(text,term,span=260){
  const src=String(text);
  const low=src.toLowerCase();
  const needle=term.toLowerCase();
  const out=[];
  let pos=0;
  while((pos=low.indexOf(needle,pos))>=0&&out.length<12){
    out.push(src.slice(Math.max(0,pos-span),Math.min(src.length,pos+needle.length+span)).replace(/\s+/g," "));
    pos+=needle.length;
  }
  return out;
}
function urlCandidates(text){
  const found=new Set();
  const src=String(text);
  const patterns=[
    /(?:https:\/\/www(?:c)?\.twse\.com\.tw)?\/(?:rwd|api|exchangeReport|announcement|zh\/announcement)[^"'\s<>)]{1,260}/g,
    /["'`](\/[^"'\`]{0,120}(?:announcement|announce|document|notice)[^"'\`]{0,160})["'`]/gi,
  ];
  for(const p of patterns){
    for(const m of src.matchAll(p)){
      const raw=(m[1]||m[0]).replace(/\\u0026/g,"&");
      const u=absolute(PAGE,raw);
      if(u) found.add(u);
    }
  }
  return [...found].slice(0,120);
}

const pageResponse=await fetch(PAGE,{
  headers:{accept:"text/html,*/*","user-agent":"System2-TWSE-Official-Document-Discovery/0.1"},
  signal:AbortSignal.timeout(30000),
});
const pageHtml=await pageResponse.text();
assert.equal(pageResponse.ok,true,"TWSE official-document page HTTP "+pageResponse.status);

const assets=scriptSrcs(pageHtml);
const inspected=[];
const assetBodies=[];
for(const url of assets.slice(0,30)){
  let response,body="";
  try{
    response=await fetch(url,{
      headers:{accept:"application/javascript,text/javascript,text/plain,*/*","user-agent":"System2-TWSE-Official-Document-Discovery/0.1"},
      signal:AbortSignal.timeout(30000),
    });
    body=await response.text();
  }catch(error){
    inspected.push({url,httpStatus:null,error:String(error?.message||error),bytes:0,hash:null,termHits:{},urlCandidates:[]});
    continue;
  }
  assetBodies.push({url,body});
  const termHits={};
  for(const term of TERMS){
    const ss=snippets(body,term);
    if(ss.length) termHits[term]=ss;
  }
  inspected.push({
    url,
    httpStatus:response.status,
    ok:response.ok,
    contentType:response.headers.get("content-type")||null,
    bytes:Buffer.byteLength(body),
    hash:sha256(body),
    termHits,
    urlCandidates:urlCandidates(body),
  });
}

const pageTermHits={};
for(const term of TERMS){
  const ss=snippets(pageHtml,term);
  if(ss.length) pageTermHits[term]=ss;
}
const pageUrlCandidates=urlCandidates(pageHtml);
const allCandidates=[...new Set([
  ...pageUrlCandidates,
  ...inspected.flatMap(x=>x.urlCandidates||[]),
])];

const queryLike=allCandidates.filter(u=>
  /announcement|announce|document|notice|rwd\/zh/i.test(u)
);

const dataApi=pageHtml.match(/<form\b[^>]*\bdata-api=["']([^"']+)["'][^>]*>/i)?.[1]||null;
const configCorpus=[pageHtml,...assetBodies.map(x=>x.body)].join("\n");
const rwdBaseCandidates=new Set();
for(const m of configCorpus.matchAll(/(?:["']?rwd["']?)\s*:\s*["'`](https:\/\/[^"'`]+)["'`]/gi)){
  rwdBaseCandidates.add(m[1].replace(/\/$/,""));
}
for(const m of configCorpus.matchAll(/apiHost\s*[:=]\s*\{([\s\S]{0,1800}?)\}/gi)){
  const x=m[1].match(/(?:["']?rwd["']?)\s*:\s*["'`]([^"'`]+)["'`]/i);
  if(x){
    try{
      const u=new URL(x[1],PAGE);
      if(u.protocol==="https:"&&ALLOWED_HOSTS.has(u.hostname)) rwdBaseCandidates.add(u.toString().replace(/\/$/,""));
    }catch{}
  }
}

const derivedEndpointCandidates=[];
for(const base of rwdBaseCandidates){
  if(dataApi){
    try{
      const u=new URL(base.replace(/\/$/,"")+"/zh"+dataApi);
      if(ALLOWED_HOSTS.has(u.hostname)) derivedEndpointCandidates.push(u.toString());
    }catch{}
  }
}

async function validatePositiveControl(endpoint){
  const u=new URL(endpoint);
  u.searchParams.set("startDate","20250606");
  u.searchParams.set("endDate","20250606");
  u.searchParams.set("keyword","1140010257");
  u.searchParams.set("response","json");
  try{
    const response=await fetch(u,{
      headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-TWSE-Official-Document-Discovery/0.1"},
      signal:AbortSignal.timeout(30000),
    });
    const raw=await response.text();
    let parsed=null;
    try{parsed=JSON.parse(raw);}catch{}
    const flat=parsed?JSON.stringify(parsed):raw;
    const pass=response.ok && /1140010257/.test(flat) && /4763/.test(flat);
    return {
      endpoint,
      requestUrl:u.toString(),
      httpStatus:response.status,
      contentType:response.headers.get("content-type")||null,
      bytes:Buffer.byteLength(raw),
      hash:sha256(raw),
      parseReady:parsed!==null,
      pass,
      hasKnownRef:/1140010257/.test(flat),
      hasKnownSymbol:/4763/.test(flat),
      sample:flat.slice(0,2400),
    };
  }catch(error){
    return {endpoint,requestUrl:u.toString(),httpStatus:null,contentType:null,bytes:0,hash:null,parseReady:false,pass:false,error:String(error?.message||error),hasKnownRef:false,hasKnownSymbol:false,sample:""};
  }
}
const positiveControlResults=[];
for(const endpoint of derivedEndpointCandidates){
  positiveControlResults.push(await validatePositiveControl(endpoint));
}
const stableQueryEndpoint=positiveControlResults.find(x=>x.pass===true)?.endpoint||null;

const result={
  schemaVersion:"S2_TWSE_OFFICIAL_DOCUMENT_QUERY_DISCOVERY_V0_1",
  observedAt:new Date().toISOString(),
  page:{
    url:PAGE,
    httpStatus:pageResponse.status,
    bytes:Buffer.byteLength(pageHtml),
    hash:sha256(pageHtml),
    scriptAssetCount:assets.length,
    termHits:pageTermHits,
    urlCandidates:pageUrlCandidates,
  },
  inspectedScriptCount:inspected.length,
  inspected,
  queryLikeCandidates:queryLike,
  formDataApi:dataApi,
  rwdBaseCandidates:[...rwdBaseCandidates],
  derivedEndpointCandidates,
  positiveControlResults,
  stableQueryEndpoint,
  stableQueryEndpointEstablished:Boolean(stableQueryEndpoint),
  boundedHistoricalQueryPerformed:false,
  representativeControlPromoted:false,
  representativeAuthorityReadyCount:5,
  revisionCoverageComplete:false,
  knownAtVersionClockCertified:false,
  selectionAuthority:false,
  system1RuntimeUsed:false,
};

assert.equal(result.representativeAuthorityReadyCount,5);
assert.equal(result.representativeControlPromoted,false);
assert.equal(result.revisionCoverageComplete,false);
assert.equal(result.system1RuntimeUsed,false);

console.log(JSON.stringify(result,null,2));
