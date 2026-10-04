import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";
import { summarizeMopsovEmptyMonthCertificationV0_2 } from "../runtime/mopsov_empty_month_certification_v0_2.mjs";

const URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const EMPTY=[
  {id:"EMPTY_1459_2026_01",stockCode:"1459",rocYear:115,month:1},
  {id:"EMPTY_1342_2026_03",stockCode:"1342",rocYear:115,month:3},
  {id:"EMPTY_1342_2026_08",stockCode:"1342",rocYear:115,month:8},
  {id:"EMPTY_1342_2026_09",stockCode:"1342",rocYear:115,month:9},
];
const POSITIVE=[
  {id:"POSITIVE_2467_2026_05",stockCode:"2467",rocYear:115,month:5},
  {id:"POSITIVE_1459_2026_06",stockCode:"1459",rocYear:115,month:6},
  {id:"POSITIVE_1342_2026_07",stockCode:"1342",rocYear:115,month:7},
];

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
function sha256(text){ return createHash("sha256").update(text).digest("hex"); }
function normalizeVisible(html){
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi," ")
    .replace(/<style[\s\S]*?<\/style>/gi," ")
    .replace(/<[^>]+>/g," ")
    .replace(/&nbsp;|&#160;/gi," ")
    .replace(/&amp;/gi,"&")
    .replace(/\s+/g," ")
    .trim();
}
function fetchControl(control){
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30",
    "--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-MOPSOV-Empty-Month-Certification/0.2",
    "--data-urlencode","firstin=1",
    "--data-urlencode","step=1",
    "--data-urlencode","TYPEK=all",
    "--data-urlencode","co_id="+control.stockCode,
    "--data-urlencode","year="+control.rocYear,
    "--data-urlencode","month="+control.month,
    "--data-urlencode","b_date=",
    "--data-urlencode","e_date=",
    "--write-out","\n__STATUS__:%{http_code}\n__TYPE__:%{content_type}\n",
    URL,
  ];
  const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:16*1024*1024});
  if(p.error) throw p.error;
  if(p.status!==0) throw new Error("curl exit "+p.status+" for "+control.id+": "+String(p.stderr||"").slice(0,500));
  const marker="\n__STATUS__:";
  const pos=p.stdout.lastIndexOf(marker);
  if(pos<0) throw new Error("response metadata marker missing");
  const html=p.stdout.slice(0,pos);
  const meta=p.stdout.slice(pos+1);
  const httpStatus=Number(meta.match(/__STATUS__:(\d+)/)?.[1]||0);
  const contentType=meta.match(/__TYPE__:(.*)/)?.[1]?.trim()||null;
  const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({
    html,stockCode:control.stockCode,expectedDate:null,baseSubject:null,
  });
  const visibleText=normalizeVisible(html);
  const matchedErrorPhrases=["系統發生錯誤","Service Unavailable","Access Denied","驗證碼","禁止存取"]
    .filter((x)=>visibleText.toLowerCase().includes(x.toLowerCase()));
  return {
    ...control,
    httpStatus,
    contentType,
    bytes:Buffer.byteLength(html),
    payloadSha256:sha256(html),
    rowCount:Number(parsed.rowCount),
    visibleText,
    matchedErrorPhrases,
    structure:{
      hasHtml:/<html/i.test(html),
      hasBody:/<body/i.test(html),
      hasForm:/<form/i.test(html),
      hasTable:/<table/i.test(html),
      hasMops:/mops/i.test(html),
      hasStockCode:visibleText.includes(control.stockCode),
    },
  };
}

const emptyObservations=[];
for(const c of EMPTY){
  emptyObservations.push(fetchControl(c));
  await sleep(750);
}
const positiveObservations=[];
for(let i=0;i<POSITIVE.length;i+=1){
  positiveObservations.push(fetchControl(POSITIVE[i]));
  if(i<POSITIVE.length-1) await sleep(750);
}
const summary=summarizeMopsovEmptyMonthCertificationV0_2({emptyObservations,positiveObservations});

assert.equal(summary.emptyMonthSemanticsCertified,true);
assert.equal(summary.emptyPassCount,4);
assert.equal(summary.positivePassCount,3);
assert.equal(summary.revisionCoverageComplete,false);
assert.equal(summary.noEventMayBeClaimed,false);
assert.equal(summary.technicalContinuityCertified,false);
assert.equal(summary.selectionAuthority,false);
assert.equal(summary.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result:summary.state,
  summary,
  observations:{
    empty:emptyObservations.map(x=>({id:x.id,httpStatus:x.httpStatus,contentType:x.contentType,bytes:x.bytes,payloadSha256:x.payloadSha256,rowCount:x.rowCount,visibleText:x.visibleText,structure:x.structure})),
    positive:positiveObservations.map(x=>({id:x.id,httpStatus:x.httpStatus,contentType:x.contentType,bytes:x.bytes,payloadSha256:x.payloadSha256,rowCount:x.rowCount,visibleTextSample:x.visibleText.slice(0,300),structure:x.structure})),
  },
},null,2));
