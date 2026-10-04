import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

const URL="https://mopsov.twse.com.tw/mops/web/t146sb10";

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
function strip(value){
  return String(value||"")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ")
    .replace(/<[^>]+>/g," ")
    .replace(/&nbsp;|&#160;/gi," ")
    .replace(/&amp;/gi,"&").replace(/&lt;/gi,"<").replace(/&gt;/gi,">")
    .replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'")
    .replace(/\s+/g," ").trim();
}
function attr(tag,name){
  const m=String(tag).match(new RegExp(name+"\\s*=\\s*['\"]([^'\"]*)['\"]","i"));
  return m?.[1]??null;
}
function parseForms(html){
  const forms=[];
  for(const m of html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)){
    const head=m[1],body=m[2];
    const inputs=[...body.matchAll(/<input\b[^>]*>/gi)].map(x=>({
      name:attr(x[0],"name"),
      value:attr(x[0],"value"),
      type:attr(x[0],"type"),
      id:attr(x[0],"id"),
    })).filter(x=>x.name||x.id);
    const selects=[...body.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/gi)].map(x=>{
      const tag="<select "+x[1]+">";
      const options=[...x[2].matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/gi)].map(o=>({
        value:attr("<option "+o[1]+">","value"),
        text:strip(o[2]),
        selected:/\bselected\b/i.test(o[1]),
      }));
      return {name:attr(tag,"name"),id:attr(tag,"id"),options};
    });
    forms.push({
      action:attr("<form "+head+">","action"),
      method:attr("<form "+head+">","method"),
      id:attr("<form "+head+">","id"),
      name:attr("<form "+head+">","name"),
      inputs,
      selects,
      textPrefix:strip(body).slice(0,1200),
    });
  }
  return forms;
}

const html=curl(URL);
assert.ok(html.length>10000,"t146sb10 payload unexpectedly small");
const forms=parseForms(html);
const u04Matches=[];
for(const form of forms){
  for(const sel of form.selects){
    for(const opt of sel.options){
      if(/公司法第252|公司法第252及273|有價證券交付|發放股利前/.test(opt.text)){
        u04Matches.push({
          formAction:form.action,formMethod:form.method,formId:form.id,formName:form.name,
          selectName:sel.name,selectId:sel.id,optionValue:opt.value,optionText:opt.text,
          selected:opt.selected,
        });
      }
    }
  }
}

const ajaxHints=[...new Set([
  ...[...html.matchAll(/ajax_[A-Za-z0-9_]+/g)].map(x=>x[0]),
  ...[...html.matchAll(/\/mops\/web\/[A-Za-z0-9_]+/g)].map(x=>x[0]),
])].sort();

const result={
  schemaVersion:"S2_MOPS_U04_LIST_FORM_CONTRACT_V0_1",
  observedAt:new Date().toISOString(),
  sourceUrl:URL,
  payloadBytes:Buffer.byteLength(html),
  payloadSha256:sha256(html),
  formCount:forms.length,
  forms,
  u04MatchCount:u04Matches.length,
  u04Matches,
  ajaxHints,
  listFormContractObserved:u04Matches.length>=1,

  listQueryExecuted:false,
  detailCapabilityObserved:false,
  representativeControlFrozen:false,
  exchangeOperationalJoinProven:false,
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

console.log(JSON.stringify({
  result:result.listFormContractObserved
    ?"MOPS_U04_LIST_FORM_CONTRACT_OBSERVED"
    :"MOPS_U04_LIST_FORM_CONTRACT_NOT_FOUND",
  ...result,
},null,2));

assert.ok(forms.length>=1);
assert.ok(u04Matches.length>=1,"U04 option not found in t146sb10");
assert.equal(result.listQueryExecuted,false);
assert.equal(result.revisionCoverageComplete,false);
assert.equal(result.selectionAuthority,false);
assert.equal(result.system1RuntimeUsed,false);
