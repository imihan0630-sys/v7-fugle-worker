import assert from "node:assert/strict";
import { createHash } from "node:crypto";

const PAGES=[
  {
    id:"TPEX_HALT_MODERN_PAGE",
    url:"https://www.tpex.org.tw/zh-tw/announce/market/halt/historical.html",
  },
  {
    id:"TPEX_HALT_LEGACY_STORAGE_PAGE",
    url:"https://www.tpex.org.tw/storage/zh-tw/web/stock/aftertrading/spendi/sprc_history.htm",
  },
];

const MAX_SCRIPT_BYTES=2_000_000;
const MAX_SCRIPTS=24;
const USER_AGENT="System2-TPEx-Halt-Source-Discovery/0.1";

function sha256(text){ return createHash("sha256").update(text).digest("hex"); }
function unique(xs){ return [...new Set(xs)]; }
function abs(base,value){
  try { return new URL(value,base).toString(); } catch { return null; }
}
function sameTpex(url){
  try {
    const u=new URL(url);
    return u.protocol==="https:" && (u.hostname==="www.tpex.org.tw" || u.hostname==="wwwov.tpex.org.tw");
  } catch { return false; }
}
function extractScriptUrls(html,base){
  return unique([...String(html).matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)]
    .map((m)=>abs(base,m[1])).filter(Boolean)).slice(0,MAX_SCRIPTS);
}
function boundedContext(text,index,radius=260){
  return String(text).slice(Math.max(0,index-radius),Math.min(String(text).length,index+radius));
}
function findSignals(text,sourceUrl){
  const raw=String(text);
  const patterns=[
    /sprc[_a-z0-9./?=&%-]*/gi,
    /halt[_a-z0-9./?=&%-]*/gi,
    /historical[_a-z0-9./?=&%-]*/gi,
    /\/www\/[a-z0-9_\-./?=&%]+/gi,
    /response\s*[:=]\s*["']?(?:json|csv|html)/gi,
    /(?:暫停|恢復)交易/g,
  ];
  const hits=[];
  for(const pattern of patterns){
    for(const match of raw.matchAll(pattern)){
      hits.push({
        token:String(match[0]).slice(0,320),
        index:match.index??0,
        context:boundedContext(raw,match.index??0),
      });
      if(hits.length>=80) break;
    }
    if(hits.length>=80) break;
  }

  const urlTokens=unique([
    ...raw.matchAll(/https?:\/\/[^"'\s<>]+/gi),
    ...raw.matchAll(/["'](\/[^"'\s<>]{4,240})["']/g),
  ].map((m)=>m[1]||m[0]).filter((x)=>
    /halt|sprc|suspend|resume|historical|announce\/market/i.test(x)
  )).map((x)=>({
    raw:x,
    absolute:abs(sourceUrl,x),
  }));

  return {hits,urlTokens};
}

async function fetchText(url){
  const response=await fetch(url,{
    redirect:"follow",
    headers:{
      accept:"text/html,application/javascript,text/javascript,*/*",
      "user-agent":USER_AGENT,
    },
    signal:AbortSignal.timeout(30_000),
  });
  const text=await response.text();
  return {
    requestedUrl:url,
    finalUrl:response.url,
    httpStatus:response.status,
    ok:response.ok,
    contentType:response.headers.get("content-type"),
    bytes:Buffer.byteLength(text),
    payloadHash:sha256(text),
    text,
  };
}

const pages=[];
const scriptCandidates=[];

for(const page of PAGES){
  const fetched=await fetchText(page.url);
  assert.equal(fetched.ok,true,page.id+" HTTP "+fetched.httpStatus);
  const signals=findSignals(fetched.text,fetched.finalUrl);
  const scripts=extractScriptUrls(fetched.text,fetched.finalUrl);
  pages.push({
    id:page.id,
    url:page.url,
    finalUrl:fetched.finalUrl,
    httpStatus:fetched.httpStatus,
    contentType:fetched.contentType,
    bytes:fetched.bytes,
    payloadHash:fetched.payloadHash,
    scriptCount:scripts.length,
    scripts,
    signalCount:signals.hits.length,
    signals:signals.hits.slice(0,30),
    candidateUrls:signals.urlTokens.slice(0,30),
  });
  for(const scriptUrl of scripts){
    if(sameTpex(scriptUrl)) scriptCandidates.push(scriptUrl);
  }
}

const scripts=[];
for(const scriptUrl of unique(scriptCandidates).slice(0,MAX_SCRIPTS)){
  const fetched=await fetchText(scriptUrl);
  if(!fetched.ok) {
    scripts.push({
      url:scriptUrl,
      httpStatus:fetched.httpStatus,
      contentType:fetched.contentType,
      bytes:fetched.bytes,
      state:"HTTP_NOT_READY",
    });
    continue;
  }
  if(fetched.bytes>MAX_SCRIPT_BYTES){
    scripts.push({
      url:scriptUrl,
      httpStatus:fetched.httpStatus,
      contentType:fetched.contentType,
      bytes:fetched.bytes,
      payloadHash:fetched.payloadHash,
      state:"SKIPPED_OVERSIZE",
    });
    continue;
  }
  const signals=findSignals(fetched.text,fetched.finalUrl);
  scripts.push({
    url:scriptUrl,
    finalUrl:fetched.finalUrl,
    httpStatus:fetched.httpStatus,
    contentType:fetched.contentType,
    bytes:fetched.bytes,
    payloadHash:fetched.payloadHash,
    state:"READ",
    signalCount:signals.hits.length,
    signals:signals.hits.slice(0,35),
    candidateUrls:signals.urlTokens.slice(0,35),
  });
}

const candidates=unique([
  ...pages.flatMap((x)=>x.candidateUrls.map((y)=>y.absolute||y.raw)),
  ...scripts.flatMap((x)=>(x.candidateUrls||[]).map((y)=>y.absolute||y.raw)),
].filter(Boolean));

const likelyDataCandidates=candidates.filter((x)=>
  sameTpex(x) &&
  (/\/www\//i.test(x) || /\.php/i.test(x) || /response=/i.test(x)) &&
  /halt|sprc|suspend|resume|announce\/market/i.test(x)
);

const result={
  schemaVersion:"S2_TPEX_HALT_SOURCE_DISCOVERY_V0_1",
  result:likelyDataCandidates.length>0
    ? "CANDIDATE_DATA_ROUTE_DISCOVERED"
    : "NO_STABLE_DATA_ROUTE_DISCOVERED",
  pageCount:pages.length,
  readablePageCount:pages.filter((x)=>x.httpStatus===200).length,
  inspectedSameOriginScriptCount:scripts.filter((x)=>x.state==="READ").length,
  likelyDataCandidateCount:likelyDataCandidates.length,
  likelyDataCandidates,
  pages,
  scripts,

  // Discovery is not capability or completeness.
  tpexSuspensionSourceCapabilityReady:false,
  responseRangeSemanticsCertified:false,
  emptyRangeSemanticsCertified:false,
  suspensionCoverageComplete:false,
  noEventMayBeClaimed:false,
  symbolSessionCompletenessCertified:false,
  technicalContinuityCertified:false,
  historyMutationPerformed:false,
  strategyEvaluationPerformed:false,
  selectionAuthority:false,
  finalSelectionEnabled:false,
  livePushEnabled:false,
  capitalImpact:false,
  orderImpact:false,
  system1RuntimeUsed:false,
};

console.log(JSON.stringify(result,null,2));
