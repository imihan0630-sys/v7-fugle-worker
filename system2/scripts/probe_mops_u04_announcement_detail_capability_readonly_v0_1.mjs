import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";

const CONTROL=Object.freeze({
  symbol:"4414",
  companyName:"如興",
  date:"20250703",
  seqNo:"1",
  typek:"sii",
  expectedSubjectFragment:"減資換發股票作業相關事項公告",
});

function sha256(text){ return createHash("sha256").update(String(text)).digest("hex"); }
function stripHtml(value){
  return String(value||"")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ")
    .replace(/<[^>]+>/g," ")
    .replace(/&nbsp;|&#160;/gi," ")
    .replace(/&amp;/gi,"&").replace(/&lt;/gi,"<").replace(/&gt;/gi,">")
    .replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'")
    .replace(/\s+/g," ").trim();
}
function curl(args){
  const p=spawnSync("curl",[
    "--silent","--show-error","--location","--max-time","30",
    ...args,
    "--write-out","\n__HTTP_STATUS__:%{http_code}\n",
  ],{encoding:"utf8",maxBuffer:16*1024*1024});
  if(p.error) throw p.error;
  assert.equal(p.status,0,"curl failed: "+String(p.stderr||"").slice(0,1000));
  const marker="\n__HTTP_STATUS__:";
  const i=p.stdout.lastIndexOf(marker);
  assert.ok(i>=0,"HTTP status marker missing");
  return {body:p.stdout.slice(0,i),status:Number(p.stdout.slice(i+marker.length).trim())};
}
function inspect({id,host,method,response}){
  const text=stripHtml(response.body);
  const securityBlocked=/安全性考量|FOR SECURITY REASONS|PAGE CAN NOT BE ACCESSED/.test(text);
  const symbolObserved=text.includes(CONTROL.symbol);
  const companyObserved=text.includes(CONTROL.companyName);
  const subjectObserved=text.includes(CONTROL.expectedSubjectFragment);
  const correctionObserved=/更正|修正/.test(text);
  const capabilityObserved=
    response.status===200 && !securityBlocked &&
    symbolObserved && companyObserved && subjectObserved && correctionObserved;
  return {
    id,host,method,httpStatus:response.status,
    transportExit:response.transportExit,
    transportError:response.transportError,
    payloadBytes:Buffer.byteLength(response.body),
    payloadSha256:sha256(response.body),
    normalizedTextPrefix:text.slice(0,900),
    securityBlocked,symbolObserved,companyObserved,subjectObserved,correctionObserved,
    capabilityObserved,
  };
}
function detailArgs({host,cookieJar=null}){
  const endpoint=host+"/mops/web/ajax_t67sb02";
  const args=[
    "--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Origin: "+host,
    "--header","Referer: "+host+"/mops/web/t146sb10",
    "--header","User-Agent: System2-MOPS-U04-Detail-Capability/0.2",
  ];
  if(cookieJar) args.push("--cookie",cookieJar,"--cookie-jar",cookieJar);
  args.push(
    "--data-urlencode","step=2",
    "--data-urlencode","co_id="+CONTROL.symbol,
    "--data-urlencode","DATE1="+CONTROL.date,
    "--data-urlencode","SKEY="+CONTROL.seqNo,
    "--data-urlencode","TYPEK="+CONTROL.typek,
    "--data-urlencode","firstin=1",
    endpoint
  );
  return args;
}
function warmSession(host,cookieJar){
  rmSync(cookieJar,{force:true});
  const root=curl([
    "--header","User-Agent: System2-MOPS-U04-Detail-Capability/0.2",
    "--cookie-jar",cookieJar,"--cookie",cookieJar,
    host+"/mops/",
  ]);
  const query=curl([
    "--header","User-Agent: System2-MOPS-U04-Detail-Capability/0.2",
    "--header","Referer: "+host+"/mops/",
    "--cookie-jar",cookieJar,"--cookie",cookieJar,
    host+"/mops/web/t146sb10",
  ]);
  return {
    rootStatus:root.status,
    rootTransportExit:root.transportExit,
    rootTransportError:root.transportError,
    rootSecurityBlocked:/安全性考量|FOR SECURITY REASONS/.test(stripHtml(root.body)),
    queryStatus:query.status,
    queryTransportExit:query.transportExit,
    queryTransportError:query.transportError,
    querySecurityBlocked:/安全性考量|FOR SECURITY REASONS/.test(stripHtml(query.body)),
    queryPayloadBytes:Buffer.byteLength(query.body),
    queryPayloadSha256:sha256(query.body),
  };
}

const attempts=[];

const currentHost="https://mops.twse.com.tw";
attempts.push(inspect({
  id:"CURRENT_DIRECT_POST",host:currentHost,method:"DIRECT_POST",
  response:curl(detailArgs({host:currentHost})),
}));

const currentJar="/tmp/s2-mops-current-u04.cookies";
const currentWarm=warmSession(currentHost,currentJar);
attempts.push(inspect({
  id:"CURRENT_SESSION_POST",host:currentHost,method:"ROOT_GET_QUERY_GET_COOKIE_POST",
  response:curl(detailArgs({host:currentHost,cookieJar:currentJar})),
}));

const oldHost="https://mopsov.twse.com.tw";
attempts.push(inspect({
  id:"MOPSOV_DIRECT_POST",host:oldHost,method:"DIRECT_POST",
  response:curl(detailArgs({host:oldHost})),
}));

const oldJar="/tmp/s2-mopsov-u04.cookies";
const oldWarm=warmSession(oldHost,oldJar);
attempts.push(inspect({
  id:"MOPSOV_SESSION_POST",host:oldHost,method:"ROOT_GET_QUERY_GET_COOKIE_POST",
  response:curl(detailArgs({host:oldHost,cookieJar:oldJar})),
}));

const positive=attempts.find((x)=>x.capabilityObserved) || null;
const result={
  schemaVersion:"S2_MOPS_U04_ANNOUNCEMENT_DETAIL_CAPABILITY_V0_1",
  probeRevision:"0.2-TRANSPORT-CHARACTERIZATION",
  observedAt:new Date().toISOString(),
  control:CONTROL,
  currentWarmup:currentWarm,
  mopsovWarmup:oldWarm,
  attempts,
  attemptCount:attempts.length,
  securityBlockedAttemptCount:attempts.filter((x)=>x.securityBlocked).length,
  detailCapabilityObserved:Boolean(positive),
  successfulTransportId:positive?.id||null,

  historicalListQueryDiscovered:false,
  revisionChainCoverageComplete:false,
  publicAvailabilityLatencyCertified:false,
  knownAtVersionClockCertified:false,
  revisionCoverageComplete:false,
  representativeControlFrozen:false,
  exchangeOperationalJoinProven:false,
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
    ?"MOPS_U04_DETAIL_CAPABILITY_OBSERVED"
    :"MOPS_U04_DETAIL_TRANSPORT_BLOCKED",
  ...result,
},null,2));

assert.equal(attempts.length,4);
assert.ok(attempts.every((x)=>Number.isInteger(x.httpStatus) || x.transportError));
assert.equal(result.historicalListQueryDiscovered,false);
assert.equal(result.revisionCoverageComplete,false);
assert.equal(result.selectionAuthority,false);
assert.equal(result.system1RuntimeUsed,false);
