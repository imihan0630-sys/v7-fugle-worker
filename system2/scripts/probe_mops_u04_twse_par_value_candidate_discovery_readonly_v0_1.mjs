import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { rmSync } from "node:fs";

const HOST="https://mopsov.twse.com.tw";
const PAGE=HOST+"/mops/web/t146sb10";
const ACTION=HOST+"/mops/web/ajax_t146sb10";

const CANDIDATES=Object.freeze([
  {symbol:"4763",officialEffectiveDate:"2025-06-30"},
  {symbol:"6919",officialEffectiveDate:"2025-07-21"},
  {symbol:"2327",officialEffectiveDate:"2025-08-25"},
  {symbol:"8422",officialEffectiveDate:"2025-11-17"},
]);

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
function addDays(iso,days){
  const d=new Date(iso+"T00:00:00.000Z");
  d.setUTCDate(d.getUTCDate()+days);
  return d.toISOString().slice(0,10);
}
function rocCompact(iso){
  const [y,m,d]=iso.split("-").map(Number);
  return String(y-1911).padStart(3,"0")+String(m).padStart(2,"0")+String(d).padStart(2,"0");
}
function runCurl(args){
  const p=spawnSync("curl",[
    "--silent","--show-error","--location","--http1.1","--compressed",
    "--connect-timeout","10","--max-time","35",
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
function rowBlocks(html){
  return [...String(html).matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map(x=>({raw:x[1],text:strip(x[1])}))
    .filter(x=>x.text.length>=3);
}
function analyze(response,symbol){
  const body=String(response.body||"");
  const text=strip(body);
  const blocks=rowBlocks(body);
  const actualRows=blocks.filter(x=>
    /ajax_t67sb02|t67sb02|SKEY|seq_no|co_id/i.test(x.raw) ||
    /(?:^|\s)\d{4,6}(?:\s|$)/.test(x.text)
  );
  const symbolRows=actualRows.filter(x=>x.text.includes(symbol));
  const revisionRows=symbolRows.filter(x=>/更正|修正|撤銷|取消/.test(x.text));
  const parValueRows=symbolRows.filter(x=>/面額|換股|換發|減資|股票面額/.test(x.text));
  const revisionParValueRows=symbolRows.filter(x=>
    /更正|修正|撤銷|取消/.test(x.text) &&
    /面額|換股|換發|減資|股票面額/.test(x.text)
  );
  const detailHints=[...new Set(symbolRows.flatMap(x=>[
    ...[...x.raw.matchAll(/ajax_t67sb02[^"'\s<]*/gi)].map(m=>compact(m[0])),
    ...[...x.raw.matchAll(/t67sb02[^"'\s<]*/gi)].map(m=>compact(m[0])),
    ...[...x.raw.matchAll(/SKEY[^"'\s<]*/gi)].map(m=>compact(m[0])),
  ]))].slice(0,40);
  return {
    httpStatus:response.status,transportExit:response.transportExit,transportError:response.transportError,
    payloadBytes:Buffer.byteLength(body),payloadSha256:sha256(body),
    securityBlocked:/安全性考量|FOR SECURITY REASONS|PAGE CAN NOT BE ACCESSED/.test(text),
    noDataObserved:/查無|無符合|無資料|沒有符合|查無需求資料/.test(text),
    rowCount:blocks.length,
    actualDataRowCount:actualRows.length,
    actualDataRowSamples:actualRows.slice(0,25).map(x=>x.text),
    symbolRowCount:symbolRows.length,
    symbolRows:symbolRows.slice(0,25).map(x=>x.text),
    revisionRowCount:revisionRows.length,
    revisionRows:revisionRows.slice(0,25).map(x=>x.text),
    parValueRowCount:parValueRows.length,
    parValueRows:parValueRows.slice(0,25).map(x=>x.text),
    revisionParValueRowCount:revisionParValueRows.length,
    revisionParValueRows:revisionParValueRows.slice(0,25).map(x=>x.text),
    detailHints,
    normalizedTextPrefix:text.slice(0,1800),
  };
}
function query({id,symbol,scope,startDate,endDate}){
  const jar="/tmp/s2-u04-par-"+id+".cookies";
  const warmup=warm(jar);
  const fields={
    encodeURIComponent:"1",
    step:"1",firstin:"ture",off:"1",
    keyword4:"",code1:"",TYPEK2:"",checkbtn:"",
    queryName:"co_id_1",inpuType:"co_id",
    scope:String(scope),
    co_id_1:scope===1?symbol:"",
    co_id_2:scope===1?symbol:"",
    typek:"sii",
    selecttype:"2",
    date:"4",
    noticeDate:"1",
    yymmdd1:rocCompact(startDate),
    yymmdd2:rocCompact(endDate),
    noticeKind:"11",
    sort:"1",
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
    id,symbol,scope,startDate,endDate,fields,
    warmup:{httpStatus:warmup.status,transportExit:warmup.transportExit,payloadBytes:Buffer.byteLength(warmup.body)},
    response:analyze(response,symbol),
  };
}

const candidates=[];
for(const candidate of CANDIDATES){
  const startDate=addDays(candidate.officialEffectiveDate,-75);
  const endDate=addDays(candidate.officialEffectiveDate,7);
  const company=query({
    id:candidate.symbol+"_COMPANY",symbol:candidate.symbol,scope:1,startDate,endDate,
  });
  const market=query({
    id:candidate.symbol+"_MARKET",symbol:candidate.symbol,scope:2,startDate,endDate,
  });
  const issuerEvidenceObserved=
    company.response.symbolRowCount>0 || market.response.symbolRowCount>0;
  const revisionParValueEvidenceObserved=
    company.response.revisionParValueRowCount>0 || market.response.revisionParValueRowCount>0;
  candidates.push({
    ...candidate,startDate,endDate,
    company,market,
    issuerEvidenceObserved,
    revisionParValueEvidenceObserved,
  });
}

const positive=candidates.filter(x=>x.revisionParValueEvidenceObserved);
const anyIssuer=candidates.filter(x=>x.issuerEvidenceObserved);
const transportReady=candidates.every(x=>
  x.company.response.httpStatus===200 && x.company.response.transportExit===0 &&
  x.market.response.httpStatus===200 && x.market.response.transportExit===0
);

const result={
  schemaVersion:"S2_MOPS_U04_TWSE_PAR_VALUE_CANDIDATE_DISCOVERY_V0_1",
  observedAt:new Date().toISOString(),
  sourcePage:PAGE,
  sourceAction:ACTION,
  noticeKind:"11",
  selecttype:"2",
  candidateCount:candidates.length,
  transportReady,
  issuerEvidenceCandidateCount:anyIssuer.length,
  revisionParValueCandidateCount:positive.length,
  positiveSymbols:positive.map(x=>x.symbol),
  candidates,

  discoveryOnly:true,
  representativeControlFrozen:false,
  authorityRevisionCoverageComplete:false,
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
  result:positive.length>0
    ?"U04_TWSE_PAR_VALUE_REVISION_CANDIDATES_OBSERVED"
    :anyIssuer.length>0
      ?"U04_TWSE_PAR_VALUE_ISSUER_ROWS_WITHOUT_REVISION"
      :"U04_TWSE_PAR_VALUE_CANDIDATE_DISCOVERY_NEGATIVE_OR_INCONCLUSIVE",
  ...result,
},null,2));

assert.equal(result.candidateCount,4);
assert.equal(result.transportReady,true);
assert.equal(result.representativeControlFrozen,false);
assert.equal(result.revisionCoverageComplete,false);
assert.equal(result.selectionAuthority,false);
assert.equal(result.system1RuntimeUsed,false);
