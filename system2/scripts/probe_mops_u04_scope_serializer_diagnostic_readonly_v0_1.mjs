import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { rmSync } from "node:fs";

const HOST="https://mopsov.twse.com.tw";
const PAGE=HOST+"/mops/web/t146sb10";
const ACTION=HOST+"/mops/web/ajax_t146sb10";
const MOPS2=HOST+"/mops/web/js/mops2.js";
const OUTER=HOST+"/mops/web/js/outerScript/t146sb10.js";

function sha256(text){return createHash("sha256").update(String(text)).digest("hex");}
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
function compact(value){return String(value||"").replace(/[\r\n\t]+/g," ").replace(/\s+/g," ").trim();}
function runCurl(args){
  const p=spawnSync("curl",[
    "--silent","--show-error","--location","--http1.1","--compressed",
    "--connect-timeout","10","--max-time","30",
    "--retry","2","--retry-delay","1","--retry-all-errors",
    ...args,
    "--write-out","\n__HTTP_STATUS__:%{http_code}\n",
  ],{encoding:"utf8",maxBuffer:32*1024*1024});
  if(p.error) throw p.error;
  const stdout=String(p.stdout||"");
  const marker="\n__HTTP_STATUS__:";
  const i=stdout.lastIndexOf(marker);
  return {
    body:i>=0?stdout.slice(0,i):stdout,
    status:i>=0?Number(stdout.slice(i+marker.length).trim()):null,
    transportExit:Number.isInteger(p.status)?p.status:null,
    transportError:p.status===0?null:String(p.stderr||"").slice(0,1000),
  };
}
function get(url,accept="text/html,application/javascript,*/*;q=0.8"){
  return runCurl([
    "--header","User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
    "--header","Accept: "+accept,
    "--header","Accept-Language: zh-TW,zh;q=0.9,en;q=0.6",
    url
  ]);
}
function snippets(text,token,radius=700,max=12){
  const out=[]; let from=0;
  while(out.length<max){
    const i=String(text).indexOf(token,from);
    if(i<0) break;
    out.push(compact(String(text).slice(Math.max(0,i-radius),Math.min(String(text).length,i+token.length+radius))));
    from=i+token.length;
  }
  return [...new Set(out)];
}
function rowTexts(html){
  return [...String(html).matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map(x=>strip(x[1]))
    .filter(x=>x.length>=3);
}
function responseDiagnostics(response){
  const body=String(response.body||"");
  const text=strip(body);
  const rows=rowTexts(body);
  const dataLikeRows=rows.filter(x=>/\b\d{4,6}\b/.test(x)||/如興|長華|愛普|公告/.test(x));
  const detailHints=[...new Set([
    ...[...body.matchAll(/ajax_t67sb02[^"'\s<]*/gi)].map(x=>compact(x[0])),
    ...[...body.matchAll(/t67sb02[^"'\s<]*/gi)].map(x=>compact(x[0])),
    ...[...body.matchAll(/SKEY[^"'\s<]*/gi)].map(x=>compact(x[0])),
  ])].slice(0,40);
  return {
    httpStatus:response.status,
    transportExit:response.transportExit,
    transportError:response.transportError,
    payloadBytes:Buffer.byteLength(body),
    payloadSha256:sha256(body),
    normalizedTextPrefix:text.slice(0,2200),
    securityBlocked:/安全性考量|FOR SECURITY REASONS|PAGE CAN NOT BE ACCESSED/.test(text),
    noDataObserved:/查無|無符合|無資料|沒有符合|查無需求資料/.test(text),
    tableCount:(body.match(/<table\b/gi)||[]).length,
    rowCount:rows.length,
    rowSamples:rows.slice(0,30),
    dataLikeRowCount:dataLikeRows.length,
    dataLikeRowSamples:dataLikeRows.slice(0,30),
    detailHints,
    has4414:text.includes("4414"),
    hasRuentex:text.includes("如興"),
    hasExpectedSubject:text.includes("減資換發股票作業相關事項公告"),
    hasCorrection:/更正|修正/.test(text),
  };
}
function warm(jar){
  rmSync(jar,{force:true});
  return runCurl([
    "--header","User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
    "--header","Accept: text/html,application/xhtml+xml,*/*;q=0.8",
    "--header","Accept-Language: zh-TW,zh;q=0.9,en;q=0.6",
    "--cookie-jar",jar,"--cookie",jar,
    PAGE,
  ]);
}
function postQuery({id,scope,companyFields={},compatFields={}}){
  const jar="/tmp/s2-u04-scope-"+id+".cookies";
  const warmup=warm(jar);
  const fields={
    step:"1",firstin:"ture",off:"1",
    keyword4:"",code1:"",TYPEK2:"",checkbtn:"",
    queryName:"co_id_1",inpuType:"co_id",
    scope:String(scope),
    co_id_1:"",co_id_2:"",
    typek:"sii",selecttype:"0",
    date:"4",noticeDate:"1",
    yymmdd1:"1140701",yymmdd2:"1140705",
    noticeKind:"11",sort:"1",
    ...companyFields,...compatFields,
  };
  const args=[
    "--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Origin: "+HOST,
    "--header","Referer: "+PAGE,
    "--header","User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
    "--header","Accept: text/html,application/xhtml+xml,*/*;q=0.8",
    "--header","Accept-Language: zh-TW,zh;q=0.9,en;q=0.6",
    "--cookie-jar",jar,"--cookie",jar,
  ];
  for(const [k,v] of Object.entries(fields)) args.push("--data-urlencode",k+"="+v);
  args.push(ACTION);
  const response=runCurl(args);
  return {
    id,scope,fields,
    warmup:{status:warmup.status,transportExit:warmup.transportExit,payloadBytes:Buffer.byteLength(warmup.body)},
    response:responseDiagnostics(response),
  };
}

const page=get(PAGE);
assert.equal(page.status,200);
assert.equal(page.transportExit,0);
const outer=get(OUTER,"application/javascript,text/javascript,*/*;q=0.8");
assert.equal(outer.status,200);
assert.equal(outer.transportExit,0);
const mops2=get(MOPS2,"application/javascript,text/javascript,*/*;q=0.8");

const serializerTokens=["function ajax1","ajax1","autoComplete","chkKeyDown","code1","TYPEK2","checkbtn","serialize","FormData","co_id_2"];
const mops2Evidence={};
for(const token of serializerTokens){
  mops2Evidence[token]=snippets(mops2.body,token,900,10);
}
const pageEvidence={
  queryButtonSnippets:[
    ...snippets(page.body,"ajax1",900,20),
    ...snippets(page.body,"查詢",600,20),
  ].slice(0,40),
  formActionSnippets:snippets(page.body,"ajax_t146sb10",800,10),
};

const attempts=[
  postQuery({
    id:"COMPANY_SCOPE_4414",
    scope:1,
    companyFields:{co_id_1:"4414",co_id_2:"4414"},
  }),
  postQuery({
    id:"COMPANY_SCOPE_4414_AUTOCOMPLETE_MIRROR",
    scope:1,
    companyFields:{co_id_1:"4414",co_id_2:"4414"},
    compatFields:{code1:"4414",TYPEK2:"sii",checkbtn:"1",TYPEK:"sii"},
  }),
  postQuery({
    id:"MARKET_SCOPE_SII",
    scope:2,
    compatFields:{TYPEK:"sii"},
  }),
];

const market=attempts.find(x=>x.id==="MARKET_SCOPE_SII");
const company=attempts.find(x=>x.id==="COMPANY_SCOPE_4414");
const controlVisibleInMarket=
  market.response.has4414 || market.response.hasRuentex || market.response.hasExpectedSubject;
const companyFilterLikelyIssue=
  controlVisibleInMarket && !(company.response.has4414||company.response.hasRuentex);
const frozenControlLikelyInvalid=
  market.response.rowCount>0 &&
  market.response.dataLikeRowCount>0 &&
  !controlVisibleInMarket &&
  !market.response.securityBlocked;

const result={
  schemaVersion:"S2_MOPS_U04_SCOPE_SERIALIZER_DIAGNOSTIC_V0_1",
  observedAt:new Date().toISOString(),
  source:{
    page:{url:PAGE,status:page.status,payloadBytes:Buffer.byteLength(page.body),payloadSha256:sha256(page.body)},
    outer:{url:OUTER,status:outer.status,payloadBytes:Buffer.byteLength(outer.body),payloadSha256:sha256(outer.body)},
    mops2:{
      url:MOPS2,status:mops2.status,transportExit:mops2.transportExit,
      payloadBytes:Buffer.byteLength(mops2.body||""),payloadSha256:sha256(mops2.body||""),
      transportError:mops2.transportError,
    },
  },
  serializerEvidence:{mops2:mops2Evidence,page:pageEvidence},
  attempts,
  controlVisibleInMarket,
  companyFilterLikelyIssue,
  frozenControlLikelyInvalid,

  representativeControlFrozen:false,
  historicalListCoverageComplete:false,
  publicAvailabilityLatencyCertified:false,
  knownAtVersionClockCertified:false,
  revisionCoverageComplete:false,
  selectionAuthority:false,
  finalSelectionEnabled:false,
  livePushEnabled:false,
  capitalImpact:false,
  orderImpact:false,
  system1RuntimeUsed:false,
};

console.log(JSON.stringify({
  result:controlVisibleInMarket
    ?"U04_CONTROL_VISIBLE_IN_MARKET_SCOPE"
    :frozenControlLikelyInvalid
      ?"U04_4414_CONTROL_NOT_IN_BOUNDED_MARKET_RESULT"
      :"U04_SCOPE_DIAGNOSTIC_INCONCLUSIVE",
  ...result,
},null,2));

assert.equal(attempts.length,3);
assert.ok(attempts.every(x=>x.response.httpStatus===200 && x.response.transportExit===0));
assert.equal(result.representativeControlFrozen,false);
assert.equal(result.revisionCoverageComplete,false);
assert.equal(result.selectionAuthority,false);
assert.equal(result.system1RuntimeUsed,false);
