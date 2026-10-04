import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";

const ENDPOINT="https://mops.twse.com.tw/mops/web/ajax_t67sb02";
const CONTROL=Object.freeze({
  symbol:"4414",
  companyName:"如興",
  date:"20250703",
  seqNo:"1",
  typek:"sii",
  expectedSubjectFragment:"減資換發股票作業相關事項公告",
});

function sha256(text){
  return createHash("sha256").update(String(text)).digest("hex");
}

function stripHtml(value){
  return String(value||"")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ")
    .replace(/<[^>]+>/g," ")
    .replace(/&nbsp;|&#160;/gi," ")
    .replace(/&amp;/gi,"&")
    .replace(/&lt;/gi,"<")
    .replace(/&gt;/gi,">")
    .replace(/&quot;/gi,'"')
    .replace(/&#39;|&apos;/gi,"'")
    .replace(/\s+/g," ")
    .trim();
}

const args=[
  "--silent","--show-error","--location","--max-time","30",
  "--request","POST",
  "--header","Content-Type: application/x-www-form-urlencoded",
  "--header","Origin: https://mops.twse.com.tw",
  "--header","Referer: https://mops.twse.com.tw/mops/web/t146sb10",
  "--header","User-Agent: System2-MOPS-U04-Detail-Capability/0.1",
  "--data-urlencode","step=2",
  "--data-urlencode","co_id="+CONTROL.symbol,
  "--data-urlencode","DATE1="+CONTROL.date,
  "--data-urlencode","SKEY="+CONTROL.seqNo,
  "--data-urlencode","TYPEK="+CONTROL.typek,
  "--data-urlencode","firstin=1",
  "--write-out","\n__HTTP_STATUS__:%{http_code}\n",
  ENDPOINT,
];
const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:16*1024*1024});
if(p.error) throw p.error;
assert.equal(p.status,0,"curl failed: "+String(p.stderr||"").slice(0,1000));

const marker="\n__HTTP_STATUS__:";
const markerIndex=p.stdout.lastIndexOf(marker);
assert.ok(markerIndex>=0,"HTTP status marker missing");
const html=p.stdout.slice(0,markerIndex);
const status=Number(p.stdout.slice(markerIndex+marker.length).trim());
const text=stripHtml(html);

const securityBlocked=/安全性考量|FOR SECURITY REASONS|PAGE CAN NOT BE ACCESSED/.test(text);
const symbolObserved=text.includes(CONTROL.symbol);
const companyObserved=text.includes(CONTROL.companyName);
const subjectObserved=text.includes(CONTROL.expectedSubjectFragment);
const correctionObserved=/更正|修正/.test(text);
const capabilityObserved=
  status===200 &&
  !securityBlocked &&
  symbolObserved &&
  companyObserved &&
  subjectObserved &&
  correctionObserved;

const result={
  schemaVersion:"S2_MOPS_U04_ANNOUNCEMENT_DETAIL_CAPABILITY_V0_1",
  observedAt:new Date().toISOString(),
  endpoint:ENDPOINT,
  method:"POST_FORM_URLENCODED",
  control:CONTROL,
  httpStatus:status,
  payloadBytes:Buffer.byteLength(html),
  payloadSha256:sha256(html),
  normalizedTextPrefix:text.slice(0,1600),
  securityBlocked,
  symbolObserved,
  companyObserved,
  subjectObserved,
  correctionObserved,
  detailCapabilityObserved:capabilityObserved,

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
  result:capabilityObserved
    ?"MOPS_U04_DETAIL_CAPABILITY_OBSERVED"
    :"MOPS_U04_DETAIL_CAPABILITY_BLOCKED",
  ...result,
},null,2));

assert.equal(status,200,"U04 detail endpoint HTTP status");
assert.equal(securityBlocked,false,"MOPS security page returned");
assert.equal(symbolObserved,true,"control symbol missing");
assert.equal(companyObserved,true,"control company missing");
assert.equal(subjectObserved,true,"control subject missing");
assert.equal(correctionObserved,true,"control correction semantic missing");
assert.equal(capabilityObserved,true);
