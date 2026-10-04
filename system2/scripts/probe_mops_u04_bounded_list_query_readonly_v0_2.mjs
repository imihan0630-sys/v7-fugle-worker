import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { rmSync } from "node:fs";

const HOST="https://mopsov.twse.com.tw";
const PAGE=HOST+"/mops/web/t146sb10";
const ACTION=HOST+"/mops/web/ajax_t146sb10";
const SCRIPT=HOST+"/mops/web/js/outerScript/t146sb10.js";
const CONTROL=Object.freeze({
  symbol:"4414",
  companyName:"如興",
  noticeKind:"11",
  expectedSubjectFragment:"減資換發股票作業相關事項公告",
});

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
function runCurl(args){
  const p=spawnSync("curl",[
    "--silent","--show-error","--location","--http1.1","--compressed",
    "--connect-timeout","10","--max-time","30",
    "--retry","2","--retry-delay","1","--retry-all-errors",
    ...args,
    "--write-out","\n__HTTP_STATUS__:%{http_code}\n",
  ],{encoding:"utf8",maxBuffer:24*1024*1024});
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
function get(url){
  return runCurl([
    "--header","User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
    "--header","Accept: text/html,application/javascript,*/*;q=0.8",
    "--header","Accept-Language: zh-TW,zh;q=0.9,en;q=0.6",
    url
  ]);
}
function warm(jar){
  rmSync(jar,{force:true});
  return runCurl([
    "--header","User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
    "--header","Accept: text/html,application/xhtml+xml,*/*;q=0.8",
    "--header","Accept-Language: zh-TW,zh;q=0.9,en;q=0.6",
    "--cookie-jar",jar,"--cookie",jar,PAGE
  ]);
}
function attempt(id,extra={}){
  const jar="/tmp/s2-u04-v02-"+id+".cookies";
  const warmup=warm(jar);
  const fields={
    step:"1",firstin:"ture",off:"1",
    keyword4:"",code1:"",TYPEK2:"",checkbtn:"",
    queryName:"co_id_1",inpuType:"co_id",
    scope:"1",
    co_id_1:CONTROL.symbol,
    co_id_2:CONTROL.symbol,
    typek:"sii",
    selecttype:"0",
    date:"4",
    noticeDate:"1",
    yymmdd1:"1140701",
    yymmdd2:"1140705",
    noticeKind:CONTROL.noticeKind,
    sort:"1",
    ...extra,
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
  const text=strip(response.body);
  const securityBlocked=/安全性考量|FOR SECURITY REASONS|PAGE CAN NOT BE ACCESSED/.test(text);
  const validationError=/年度只可輸入|日期格式|輸入錯誤/.test(text);
  const symbolObserved=text.includes(CONTROL.symbol);
  const companyObserved=text.includes(CONTROL.companyName);
  const subjectObserved=text.includes(CONTROL.expectedSubjectFragment);
  const correctionObserved=/更正|修正/.test(text);
  const listControlObserved=
    response.status===200 && response.transportExit===0 &&
    !securityBlocked && !validationError &&
    (symbolObserved||companyObserved) &&
    subjectObserved && correctionObserved;
  return {
    id,fields,
    warmupStatus:warmup.status,
    response:{
      httpStatus:response.status,transportExit:response.transportExit,transportError:response.transportError,
      payloadBytes:Buffer.byteLength(response.body),payloadSha256:sha256(response.body),
      normalizedTextPrefix:text.slice(0,2500),
      securityBlocked,validationError,symbolObserved,companyObserved,subjectObserved,correctionObserved,
      listControlObserved,
    },
  };
}

const jsResponse=get(SCRIPT);
assert.equal(jsResponse.status,200,"official t146sb10.js must be readable");
assert.equal(jsResponse.transportExit,0,"official t146sb10.js transport must succeed");
const js=jsResponse.body;
const assignments={
  co_id_1:/form1\.co_id_1\.value/.test(js),
  co_id_2:/form1\.co_id_2\.value/.test(js),
  date:/form1\.date\.value/.test(js),
  noticeKind:/form1\.noticeKind\.value/.test(js),
  sort:/form1\.sort\.value/.test(js),
  noticeDate:/form1\.noticeDate\.value/.test(js),
};
assert.ok(Object.values(assignments).every(Boolean),"official submit assignments drifted");

const attempts=[
  attempt("VISIBLE_FORM_FIELDS_ONLY"),
  attempt("UPPER_TYPEK_COMPAT",{TYPEK:"sii"}),
  attempt("AUTOCOMPLETE_MIRRORS",{code1:CONTROL.symbol,TYPEK2:"sii",checkbtn:"1"}),
  attempt("AUTOCOMPLETE_MIRRORS_EMPTY_CHECK",{code1:CONTROL.symbol,TYPEK2:"sii",checkbtn:""}),
];
const positive=attempts.find((x)=>x.response.listControlObserved)||null;

const result={
  schemaVersion:"S2_MOPS_U04_BOUNDED_LIST_QUERY_V0_2",
  observedAt:new Date().toISOString(),
  control:CONTROL,
  officialSubmitScript:{
    url:SCRIPT,httpStatus:jsResponse.status,payloadBytes:Buffer.byteLength(js),payloadSha256:sha256(js),assignments,
  },
  attemptCount:attempts.length,
  attempts,
  boundedControlObserved:Boolean(positive),
  successfulAttemptId:positive?.id||null,

  detailCapabilityObserved:false,
  historicalListCoverageComplete:false,
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
  result:positive
    ?"MOPS_U04_BOUNDED_LIST_CONTROL_OBSERVED_V0_2"
    :"MOPS_U04_BOUNDED_LIST_CONTROL_NOT_OBSERVED_V0_2",
  ...result,
},null,2));

assert.equal(attempts.length,4);
assert.equal(result.historicalListCoverageComplete,false);
assert.equal(result.revisionCoverageComplete,false);
assert.equal(result.selectionAuthority,false);
assert.equal(result.system1RuntimeUsed,false);
