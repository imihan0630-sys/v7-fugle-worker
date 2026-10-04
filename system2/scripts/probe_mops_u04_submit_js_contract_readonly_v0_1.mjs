import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

const URL="https://mopsov.twse.com.tw/mops/web/t146sb10";
const TOKENS=["co_id_1","code1","TYPEK2","checkbtn","noticeDate","ajax_t146sb10","form1","queryName","inpuType"];

function sha256(text){return createHash("sha256").update(String(text)).digest("hex");}
function curl(url){
  const p=spawnSync("curl",[
    "--silent","--show-error","--location","--http1.1","--compressed",
    "--connect-timeout","10","--max-time","30",
    "--retry","2","--retry-delay","1","--retry-all-errors",
    "--header","User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
    "--header","Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "--header","Accept-Language: zh-TW,zh;q=0.9,en;q=0.6",
    url
  ],{encoding:"utf8",maxBuffer:24*1024*1024});
  if(p.error) throw p.error;
  assert.equal(p.status,0,"curl failed: "+String(p.stderr||"").slice(0,1000));
  return p.stdout;
}
function compact(value){
  return String(value||"")
    .replace(/[\r\n\t]+/g," ")
    .replace(/\s+/g," ")
    .trim();
}
function snippets(text,token,radius=450){
  const out=[];
  let from=0;
  while(out.length<12){
    const i=text.indexOf(token,from);
    if(i<0) break;
    out.push(compact(text.slice(Math.max(0,i-radius),Math.min(text.length,i+token.length+radius))));
    from=i+token.length;
  }
  return [...new Set(out)];
}

const html=curl(URL);
assert.ok(html.length>10000);

const externalScripts=[...html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)]
  .map(x=>x[1]);
const inlineScripts=[...html.matchAll(/<script\b(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(x=>x[1])
  .filter(Boolean);

const tokenEvidence={};
for(const token of TOKENS){
  tokenEvidence[token]={
    htmlSnippets:snippets(html,token),
    inlineScriptSnippets:inlineScripts.flatMap(s=>snippets(s,token)).slice(0,20),
  };
}

const eventHandlerTags=[...html.matchAll(/<(?:form|input|button|a)\b[^>]*(?:onsubmit|onclick)\s*=\s*["'][^"']+["'][^>]*>/gi)]
  .map(x=>compact(x[0]))
  .filter(tag=>TOKENS.some(t=>tag.includes(t)) || /submit|form1|ajax_t146sb10/i.test(tag))
  .slice(0,80);

const interestingInline=inlineScripts
  .map(compact)
  .filter(s=>TOKENS.some(t=>s.includes(t)))
  .map(s=>s.slice(0,6000))
  .slice(0,30);

const result={
  schemaVersion:"S2_MOPS_U04_SUBMIT_JS_CONTRACT_V0_1",
  observedAt:new Date().toISOString(),
  sourceUrl:URL,
  payloadBytes:Buffer.byteLength(html),
  payloadSha256:sha256(html),
  externalScriptCount:externalScripts.length,
  externalScripts,
  inlineScriptCount:inlineScripts.length,
  tokenEvidence,
  eventHandlerTags,
  interestingInline,
  submitSemanticsEvidenceObserved:
    ["co_id_1","code1","TYPEK2","checkbtn"].some(t=>
      tokenEvidence[t].inlineScriptSnippets.length>0 || tokenEvidence[t].htmlSnippets.length>0
    ),

  boundedQueryExecuted:false,
  representativeControlFrozen:false,
  revisionCoverageComplete:false,
  selectionAuthority:false,
  finalSelectionEnabled:false,
  livePushEnabled:false,
  capitalImpact:false,
  orderImpact:false,
  system1RuntimeUsed:false,
};

console.log(JSON.stringify({
  result:result.submitSemanticsEvidenceObserved
    ?"MOPS_U04_SUBMIT_JS_EVIDENCE_OBSERVED"
    :"MOPS_U04_SUBMIT_JS_EVIDENCE_NOT_FOUND",
  ...result,
},null,2));

assert.equal(result.boundedQueryExecuted,false);
assert.equal(result.representativeControlFrozen,false);
assert.equal(result.revisionCoverageComplete,false);
assert.equal(result.selectionAuthority,false);
assert.equal(result.system1RuntimeUsed,false);
