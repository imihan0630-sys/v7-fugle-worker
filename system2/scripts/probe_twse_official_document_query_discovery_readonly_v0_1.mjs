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
  stableQueryEndpointEstablished:false,
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
