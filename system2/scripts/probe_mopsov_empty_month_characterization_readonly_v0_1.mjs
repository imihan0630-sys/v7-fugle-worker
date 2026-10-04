import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";

const URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";

const CONTROLS=[
  {id:"EMPTY_1459_2026_01",kind:"EMPTY",stockCode:"1459",rocYear:115,month:1},
  {id:"EMPTY_1342_2026_03",kind:"EMPTY",stockCode:"1342",rocYear:115,month:3},
  {id:"EMPTY_1342_2026_08",kind:"EMPTY",stockCode:"1342",rocYear:115,month:8},
  {id:"EMPTY_1342_2026_09",kind:"EMPTY",stockCode:"1342",rocYear:115,month:9},
  {id:"POSITIVE_2467_2026_05",kind:"POSITIVE",stockCode:"2467",rocYear:115,month:5},
  {id:"POSITIVE_1459_2026_06",kind:"POSITIVE",stockCode:"1459",rocYear:115,month:6},
  {id:"POSITIVE_1342_2026_07",kind:"POSITIVE",stockCode:"1342",rocYear:115,month:7},
];

function sha256(text){ return createHash("sha256").update(text).digest("hex"); }
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

function stripHtml(html){
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
    "--header","User-Agent: System2-MOPSOV-Empty-Month-Characterization/0.1",
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
  if(pos<0) throw new Error("response metadata marker missing for "+control.id);
  const html=p.stdout.slice(0,pos);
  const meta=p.stdout.slice(pos+1);
  const httpStatus=Number(meta.match(/__STATUS__:(\d+)/)?.[1]||0);
  const contentType=meta.match(/__TYPE__:(.*)/)?.[1]?.trim()||null;

  const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({
    html,
    stockCode:control.stockCode,
    expectedDate:null,
    baseSubject:null,
  });
  const visible=stripHtml(html);
  const phraseCandidates=[
    "查無資料",
    "無資料",
    "沒有符合條件",
    "查無符合",
    "無符合條件",
    "無重大訊息",
  ];
  const matchedNoDataPhrases=phraseCandidates.filter(x=>visible.includes(x));
  const errorPatterns=[
    "系統發生錯誤",
    "Service Unavailable",
    "Access Denied",
    "驗證碼",
    "禁止存取",
  ];
  const matchedErrorPhrases=errorPatterns.filter(x=>visible.toLowerCase().includes(x.toLowerCase()));

  return {
    id:control.id,
    kind:control.kind,
    stockCode:control.stockCode,
    rocYear:control.rocYear,
    month:control.month,
    httpStatus,
    contentType,
    bytes:Buffer.byteLength(html),
    payloadSha256:sha256(html),
    rowCount:Number(parsed.rowCount),
    matchedNoDataPhrases,
    matchedErrorPhrases,
    structure:{
      hasHtml:/<html/i.test(html),
      hasBody:/<body/i.test(html),
      hasForm:/<form/i.test(html),
      hasTable:/<table/i.test(html),
      hasMops:/mops/i.test(html),
      hasStockCode:visible.includes(control.stockCode),
    },
    visibleTextSample:visible.slice(0,500),
  };
}

const results=[];
for(let i=0;i<CONTROLS.length;i+=1){
  results.push(fetchControl(CONTROLS[i]));
  if(i<CONTROLS.length-1) await sleep(750);
}

const empties=results.filter(x=>x.kind==="EMPTY");
const positives=results.filter(x=>x.kind==="POSITIVE");
const emptyHashes=[...new Set(empties.map(x=>x.payloadSha256))];
const positiveHashes=[...new Set(positives.map(x=>x.payloadSha256))];

const summary={
  schemaVersion:"S2_MOPSOV_EMPTY_MONTH_CHARACTERIZATION_V0_1",
  controlCount:results.length,
  emptyControlCount:empties.length,
  positiveControlCount:positives.length,
  allHttp200:results.every(x=>x.httpStatus===200),
  allHtml:results.every(x=>String(x.contentType||"").includes("text/html")),
  allEmptyRowsZero:empties.every(x=>x.rowCount===0),
  allPositiveRowsNonZero:positives.every(x=>x.rowCount>0),
  uniqueEmptyPayloadHashCount:emptyHashes.length,
  allEmptyPayloadsIdentical:emptyHashes.length===1,
  emptyPayloadHashes:emptyHashes,
  positivePayloadHashes:positiveHashes,
  emptyHashCollidesWithPositive:emptyHashes.some(h=>positiveHashes.includes(h)),
  anyErrorPhrase:results.some(x=>x.matchedErrorPhrases.length>0),
  controls:results,

  // Characterization only. Do not promote from this run.
  emptyMonthSemanticsCertified:false,
  boundedIntervalCoverageComplete:false,
  knownAtVersionClockCertified:false,
  revisionCoverageComplete:false,
  noEventMayBeClaimed:false,
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

assert.equal(summary.allHttp200,true);
assert.equal(summary.allHtml,true);
assert.equal(summary.allEmptyRowsZero,true);
assert.equal(summary.allPositiveRowsNonZero,true);
assert.equal(summary.emptyHashCollidesWithPositive,false);
assert.equal(summary.anyErrorPhrase,false);
assert.equal(summary.emptyMonthSemanticsCertified,false);
assert.equal(summary.revisionCoverageComplete,false);
assert.equal(summary.selectionAuthority,false);
assert.equal(summary.system1RuntimeUsed,false);

console.log(JSON.stringify(summary,null,2));
