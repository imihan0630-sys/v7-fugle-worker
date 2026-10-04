import assert from "node:assert/strict";

const SOURCE_BASE="https://mopsov.twse.com.tw/mops/web/ajax_t05st02";
const TARGET_YEAR=2025;
const START_DATE="2025-01-01";
const END_QUERY_DATE="2026-01-01";
const PAUSE_MS=160;

const PAR_VALUE_PATTERN=/股票面額|每股面額|變更.{0,8}面額|面額.{0,8}變更|無面額/;
const REVISION_PATTERN=/更正|修正|補充|撤銷|取消|修改|更新|原公告|前次公告|變更原|變更前|調整.{0,12}(?:日期|時程|計畫|內容)|未依.{0,12}執行/;

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

function isoDates(start,end){
  const out=[];
  for(let d=new Date(start+"T00:00:00Z"), stop=new Date(end+"T00:00:00Z"); d<=stop; d=new Date(d.getTime()+86400000)){
    out.push(d.toISOString().slice(0,10));
  }
  return out;
}

function rocParts(iso){
  const [y,m,d]=iso.split("-").map(Number);
  return {year:String(y-1911),month:String(m).padStart(2,"0"),day:String(d).padStart(2,"0")};
}

function stripHtml(s){
  return String(s||"")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ")
    .replace(/<br\s*\/?\s*>/gi," ")
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

function rocDateToIso(text){
  const m=String(text||"").match(/(\d{3})\/(\d{2})\/(\d{2})/);
  if(!m) return null;
  const iso=String(Number(m[1])+1911).padStart(4,"0")+"-"+m[2]+"-"+m[3];
  const d=new Date(iso+"T00:00:00Z");
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0,10)===iso ? iso : null;
}

function parseRows(html,queryDate){
  const rows=[];
  for(const tr of String(html||"").matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)){
    const cells=[...tr[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)]
      .map(m=>stripHtml(m[1]));
    if(cells.length<5) continue;
    const isoDate=rocDateToIso(cells[0]);
    const time=String(cells[1]||"").match(/\b\d{2}:\d{2}:\d{2}\b/)?.[0]||null;
    const symbol=String(cells[2]||"").match(/\b\d{4,6}\b/)?.[0]||null;
    const name=String(cells[3]||"").trim();
    const subject=String(cells[4]||"").trim();
    if(!isoDate || !time || !symbol || !subject) continue;
    rows.push({queryDate,isoDate,time,symbol,name,subject});
  }
  return rows;
}

function buildUrl(iso){
  const p=rocParts(iso);
  const q=new URLSearchParams({
    encodeURIComponent:"1",
    step:"1",
    step00:"0",
    firstin:"1",
    off:"1",
    TYPEK:"sii",
    year:p.year,
    month:p.month,
    day:p.day,
  });
  return SOURCE_BASE+"?"+q.toString();
}

async function fetchDay(iso){
  const url=buildUrl(iso);
  let lastError=null;
  for(let attempt=1;attempt<=2;attempt+=1){
    try{
      const response=await fetch(url,{
        headers:{
          accept:"text/html,application/xhtml+xml,*/*",
          "user-agent":"System2-TWSE-ParValue-T05ST02-Discovery/0.1",
        },
        signal:AbortSignal.timeout(30000),
      });
      const html=await response.text();
      const securityBlocked=/FOR SECURITY REASONS|安全性考量|錯誤代碼/.test(html);
      if(response.ok && !securityBlocked){
        return {
          ok:true,url,httpStatus:response.status,securityBlocked:false,
          noDataObserved:/查無.*重大訊息|資料庫中查無/.test(stripHtml(html)),
          rows:parseRows(html,iso),
          bytes:Buffer.byteLength(html),
        };
      }
      lastError="HTTP "+response.status+(securityBlocked?" SECURITY_BLOCK":"");
    }catch(error){
      lastError=String(error?.message||error);
    }
    if(attempt<2) await sleep(600);
  }
  return {ok:false,url,httpStatus:null,securityBlocked:/SECURITY_BLOCK/.test(lastError||""),error:lastError,rows:[],bytes:0};
}

const queryDates=isoDates(START_DATE,END_QUERY_DATE);
const diagnostics=[];
const uniqueRows=new Map();

for(let i=0;i<queryDates.length;i+=1){
  const queryDate=queryDates[i];
  const r=await fetchDay(queryDate);
  diagnostics.push({
    queryDate,
    ok:r.ok,
    httpStatus:r.httpStatus,
    securityBlocked:r.securityBlocked===true,
    noDataObserved:r.noDataObserved===true,
    rowCount:r.rows.length,
    bytes:r.bytes,
    error:r.error||null,
  });
  if(r.ok){
    for(const row of r.rows){
      if(!row.isoDate.startsWith(String(TARGET_YEAR)+"-")) continue;
      const key=[row.isoDate,row.time,row.symbol,row.subject].join("|");
      if(!uniqueRows.has(key)) uniqueRows.set(key,row);
    }
  }
  if(i<queryDates.length-1) await sleep(PAUSE_MS);
}

const rows=[...uniqueRows.values()].sort((a,b)=>
  a.isoDate.localeCompare(b.isoDate) ||
  a.time.localeCompare(b.time) ||
  a.symbol.localeCompare(b.symbol)
);

const parValueRows=rows.filter(x=>PAR_VALUE_PATTERN.test(x.subject));
const revisionParValueRows=parValueRows.filter(x=>REVISION_PATTERN.test(x.subject));
const positiveSymbols=[...new Set(revisionParValueRows.map(x=>x.symbol))].sort();

const failedDates=diagnostics.filter(x=>x.ok!==true).map(x=>x.queryDate);
const securityBlockedDates=diagnostics.filter(x=>x.securityBlocked===true).map(x=>x.queryDate);
const annualIndexTransportComplete=failedDates.length===0 && diagnostics.length===queryDates.length;

const result={
  schemaVersion:"S2_TWSE_PAR_VALUE_T05ST02_DISCOVERY_V0_1",
  observedAt:new Date().toISOString(),
  sourceId:"MOPSOV_T05ST02_DAILY_MAJOR_INFORMATION",
  sourceBase:SOURCE_BASE,
  market:"TWSE",
  targetYear:TARGET_YEAR,
  queryStartDate:START_DATE,
  queryEndDate:END_QUERY_DATE,
  queryDateCount:queryDates.length,
  transportReadyCount:diagnostics.filter(x=>x.ok).length,
  annualIndexTransportComplete,
  failedDateCount:failedDates.length,
  failedDates,
  securityBlockedDateCount:securityBlockedDates.length,
  securityBlockedDates,
  uniqueMaterialInformationRowCount:rows.length,
  parValueSubjectRowCount:parValueRows.length,
  revisionParValueCandidateCount:revisionParValueRows.length,
  positiveCandidateSymbolCount:positiveSymbols.length,
  positiveCandidateSymbols:positiveSymbols,
  revisionParValueCandidates:revisionParValueRows,
  parValueRows:parValueRows.slice(0,120),
  dailyDiagnostics:diagnostics,

  discoveryOnly:true,
  representativeControlFrozen:false,
  exchangeOperationalJoinProven:false,
  authorityRevisionCoverageComplete:false,
  publicAvailabilityLatencyCertified:false,
  knownAtVersionClockCertified:false,
  revisionCoverageComplete:false,
  noEventMayBeClaimed:false,
  suspensionCoverageComplete:false,
  symbolSessionCompletenessCertified:false,
  technicalContinuityCertified:false,
  selectionAuthority:false,
  finalSelectionEnabled:false,
  livePushEnabled:false,
  capitalImpact:false,
  orderImpact:false,
  system1RuntimeUsed:false,
};

assert.equal(result.queryDateCount,366);
assert.equal(result.market,"TWSE");
assert.equal(result.discoveryOnly,true);
assert.equal(result.representativeControlFrozen,false);
assert.equal(result.revisionCoverageComplete,false);
assert.equal(result.selectionAuthority,false);
assert.equal(result.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result:!annualIndexTransportComplete
    ?"T05ST02_ANNUAL_DISCOVERY_TRANSPORT_INCOMPLETE"
    : revisionParValueRows.length>0
      ?"T05ST02_TWSE_PAR_VALUE_REVISION_CANDIDATES_OBSERVED"
      :"T05ST02_TWSE_PAR_VALUE_REVISION_DISCOVERY_NEGATIVE",
  ...result,
},null,2));
