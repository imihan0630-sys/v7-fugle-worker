import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { rmSync } from "node:fs";

const HOST="https://mopsov.twse.com.tw";
const PAGE=HOST+"/mops/web/t146sb10";
const ACTION=HOST+"/mops/web/ajax_t146sb10";
const CONTROL=Object.freeze({
  symbol:"4414",
  companyName:"如興",
  noticeKind:"11",
  expectedSubjectFragment:"減資換發股票作業相關事項公告",
  expectedDateIso:"2025-07-03",
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
function warm(jar){
  rmSync(jar,{force:true});
  return runCurl([
    "--header","User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
    "--header","Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "--header","Accept-Language: zh-TW,zh;q=0.9,en;q=0.6",
    "--cookie-jar",jar,"--cookie",jar,
    PAGE,
  ]);
}
function postAttempt({id,noticeDate,date1,date2}){
  const jar="/tmp/s2-u04-list-"+id+".cookies";
  const warmup=warm(jar);
  const fields={
    step:"1",
    firstin:"ture",
    off:"1",
    keyword4:"",
    code1:"",
    TYPEK2:"",
    checkbtn:"",
    queryName:"co_id_1",
    inpuType:"co_id",
    scope:"1",
    co_id_1:CONTROL.symbol,
    TYPEK:"sii",
    selecttype:"0",
    noticeDate:String(noticeDate),
    yymmdd1:date1,
    yymmdd2:date2,
    noticeKind:CONTROL.noticeKind,
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
  const symbolObserved=text.includes(CONTROL.symbol);
  const companyObserved=text.includes(CONTROL.companyName);
  const subjectObserved=text.includes(CONTROL.expectedSubjectFragment);
  const correctionObserved=/更正|修正/.test(text);
  const noDataObserved=/查無|無符合|無資料|沒有符合/.test(text);
  const listRowsLikely=/<tr\b/i.test(response.body) && (symbolObserved||companyObserved);
  const controlObserved=
    response.status===200 && !securityBlocked &&
    (symbolObserved||companyObserved) &&
    subjectObserved &&
    correctionObserved;
  return {
    id,noticeDate,date1,date2,
    fields,
    warmup:{
      httpStatus:warmup.status,
      transportExit:warmup.transportExit,
      transportError:warmup.transportError,
      payloadBytes:Buffer.byteLength(warmup.body),
      payloadSha256:sha256(warmup.body),
    },
    response:{
      httpStatus:response.status,
      transportExit:response.transportExit,
      transportError:response.transportError,
      payloadBytes:Buffer.byteLength(response.body),
      payloadSha256:sha256(response.body),
      normalizedTextPrefix:text.slice(0,1800),
      securityBlocked,symbolObserved,companyObserved,subjectObserved,correctionObserved,noDataObserved,listRowsLikely,
      controlObserved,
    }
  };
}

const attempts=[
  postAttempt({id:"N1_GREGORIAN",noticeDate:1,date1:"20250701",date2:"20250705"}),
  postAttempt({id:"N2_GREGORIAN",noticeDate:2,date1:"20250701",date2:"20250705"}),
  postAttempt({id:"N1_ROC",noticeDate:1,date1:"1140701",date2:"1140705"}),
  postAttempt({id:"N2_ROC",noticeDate:2,date1:"1140701",date2:"1140705"}),
];

const positive=attempts.find((x)=>x.response.controlObserved)||null;
const structurallyReadable=attempts.filter((x)=>
  x.response.httpStatus===200 &&
  !x.response.securityBlocked &&
  x.response.transportExit===0
);

const result={
  schemaVersion:"S2_MOPS_U04_BOUNDED_LIST_QUERY_V0_1",
  observedAt:new Date().toISOString(),
  control:CONTROL,
  sourcePage:PAGE,
  sourceAction:ACTION,
  attemptCount:attempts.length,
  attempts,
  structurallyReadableAttemptCount:structurallyReadable.length,
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
    ?"MOPS_U04_BOUNDED_LIST_CONTROL_OBSERVED"
    :"MOPS_U04_BOUNDED_LIST_CONTROL_NOT_OBSERVED",
  ...result,
},null,2));

assert.equal(attempts.length,4);
assert.ok(attempts.every((x)=>x.warmup.httpStatus===200 || x.warmup.transportExit!==0));
assert.equal(result.historicalListCoverageComplete,false);
assert.equal(result.revisionCoverageComplete,false);
assert.equal(result.selectionAuthority,false);
assert.equal(result.system1RuntimeUsed,false);
