import assert from "node:assert/strict";
import { createHash } from "node:crypto";

const PAGE="https://www.twse.com.tw/zh/announcement/announcement/list.html";
const ENDPOINT="https://www.twse.com.tw/rwd/zh/announcement/announcement";
const START_DATE="20250101";
const END_DATE="20251231";

const FROZEN=Object.freeze([
  {symbol:"4763",effectiveDate:"2025-06-30",expectedRefs:Object.freeze(["1140010257","1140011819"])},
  {symbol:"6919",effectiveDate:"2025-07-21",expectedRefs:Object.freeze(["1140012018"])},
  {symbol:"2327",effectiveDate:"2025-08-25",expectedRefs:Object.freeze(["1140014444"])},
  {symbol:"8422",effectiveDate:"2025-11-17",expectedRefs:Object.freeze(["1140020022"])},
]);

const GLOBAL_KEYWORDS=Object.freeze([
  "股票面額","換發新股","更正","修正","撤銷","取消","改期","調整",
]);

const PAR_VALUE_RE=/股票面額|面額變更|變更股票面額|換發新股|換發股票|換發新股票/;
const REVISION_RE=/更正|修正|撤銷|取消|作廢|改期|延後|提前|展延|調整/;

function sha256(text){return createHash("sha256").update(text).digest("hex");}
function normalizeRef(value){return String(value||"").replace(/[^0-9]/g,"");}
function normalizeText(value){return String(value||"").replace(/\s+/g," ").trim();}
function subjectCompanyName(subject,symbol){
  const s=normalizeText(subject);
  const code=String(symbol);
  const patterns=[
    new RegExp("^(.+?)（公司代號[:：]"+code+"）"),
    new RegExp("^(.+?)\\(公司代號[:：]"+code+"\\)"),
    new RegExp("^(.+?)（代號[:：]"+code+"）"),
    new RegExp("^(.+?)\\(代號[:：]"+code+"\\)"),
  ];
  for(const p of patterns){
    const m=s.match(p);
    if(m?.[1]) return m[1].trim();
  }
  return null;
}
function parsePayload(payload){
  assert.ok(payload&&typeof payload==="object"&&!Array.isArray(payload),"payload must be object");
  assert.equal(String(payload.stat||"").toLowerCase(),"ok","TWSE stat must be ok");
  assert.ok(Array.isArray(payload.fields),"fields required");
  assert.ok(Array.isArray(payload.data),"data required");
  const fields=payload.fields.map(String);
  const dateIdx=fields.findIndex(x=>x.includes("發文日期"));
  const refIdx=fields.findIndex(x=>x.includes("發文字號"));
  const subjectIdx=fields.findIndex(x=>x.includes("主旨"));
  const idIdx=fields.findIndex(x=>x.toLowerCase()==="id");
  assert.ok(dateIdx>=0&&refIdx>=0&&subjectIdx>=0&&idIdx>=0,"required TWSE fields missing");
  const rows=payload.data.map((row)=>({
    date:normalizeText(row?.[dateIdx]),
    refNo:normalizeText(row?.[refIdx]),
    refDigits:normalizeRef(row?.[refIdx]),
    subject:normalizeText(row?.[subjectIdx]),
    id:normalizeText(row?.[idIdx]),
  }));
  assert.equal(rows.length,Number(payload.total),"data length must equal total for bounded completeness");
  return {fields,rows,total:Number(payload.total)};
}

const pageResponse=await fetch(PAGE,{
  headers:{accept:"text/html,*/*","user-agent":"System2-TWSE-Official-Document-Bounded-Search/0.1"},
  signal:AbortSignal.timeout(30000),
});
await pageResponse.text();
assert.equal(pageResponse.ok,true,"TWSE announcement page HTTP "+pageResponse.status);
const pageSetCookies=typeof pageResponse.headers.getSetCookie==="function"
  ? pageResponse.headers.getSetCookie()
  : [];
const cookieHeader=pageSetCookies.map(x=>String(x).split(";")[0]).filter(Boolean).join("; ");

async function query(keyword){
  const u=new URL(ENDPOINT);
  u.searchParams.set("startDate",START_DATE);
  u.searchParams.set("endDate",END_DATE);
  u.searchParams.set("keyword",keyword);
  u.searchParams.set("response","json");
  const headers={
    accept:"application/json,text/plain,*/*",
    "accept-language":"zh-TW,zh;q=0.9,en;q=0.7",
    referer:PAGE,
    "x-requested-with":"XMLHttpRequest",
    "user-agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
  };
  if(cookieHeader) headers.cookie=cookieHeader;
  const response=await fetch(u,{headers,redirect:"follow",signal:AbortSignal.timeout(30000)});
  const raw=await response.text();
  assert.equal(response.ok,true,"TWSE query "+keyword+" HTTP "+response.status);
  let payload;
  try{payload=JSON.parse(raw);}catch(error){throw new Error("TWSE query "+keyword+" JSON parse failed: "+error.message);}
  const parsed=parsePayload(payload);
  return {
    keyword,
    requestUrl:u.toString(),
    httpStatus:response.status,
    contentType:response.headers.get("content-type")||null,
    payloadHash:sha256(raw),
    ...parsed,
  };
}

const symbolQueries=[];
for(const control of FROZEN) symbolQueries.push(await query(control.symbol));
const globalQueries=[];
for(const keyword of GLOBAL_KEYWORDS) globalQueries.push(await query(keyword));

const globalRows=[];
const globalRowKeys=new Set();
for(const q of globalQueries){
  for(const row of q.rows){
    const key=[row.date,row.refDigits,row.subject,row.id].join("|");
    if(!globalRowKeys.has(key)){
      globalRowKeys.add(key);
      globalRows.push(row);
    }
  }
}

const candidateResults=[];
for(const control of FROZEN){
  const q=symbolQueries.find(x=>x.keyword===control.symbol);
  const expectedRefPresence=Object.fromEntries(
    control.expectedRefs.map(ref=>[ref,q.rows.some(r=>r.refDigits===ref)])
  );
  const baselineReady=Object.values(expectedRefPresence).every(Boolean);
  const symbolParValueRows=q.rows.filter(r=>PAR_VALUE_RE.test(r.subject));
  const companyNames=[...new Set(
    symbolParValueRows.map(r=>subjectCompanyName(r.subject,control.symbol)).filter(Boolean)
  )];
  const globalMatches=globalRows.filter(r=>
    r.subject.includes(control.symbol) ||
    companyNames.some(name=>name.length>=2&&r.subject.includes(name))
  );
  const allRowsMap=new Map();
  for(const row of [...q.rows,...globalMatches]){
    const key=[row.date,row.refDigits,row.subject,row.id].join("|");
    if(!allRowsMap.has(key)) allRowsMap.set(key,row);
  }
  const allCandidateRows=[...allRowsMap.values()].sort((a,b)=>
    a.date.localeCompare(b.date)||a.refDigits.localeCompare(b.refDigits)
  );
  const parValueRows=allCandidateRows.filter(r=>PAR_VALUE_RE.test(r.subject));
  const revisionHintRows=allCandidateRows.filter(r=>
    REVISION_RE.test(r.subject) &&
    (PAR_VALUE_RE.test(r.subject) ||
      r.subject.includes(control.symbol) ||
      companyNames.some(name=>r.subject.includes(name)))
  );
  const revisionParValueRows=revisionHintRows.filter(r=>PAR_VALUE_RE.test(r.subject));

  candidateResults.push({
    symbol:control.symbol,
    effectiveDate:control.effectiveDate,
    expectedRefs:control.expectedRefs,
    expectedRefPresence,
    baselineReady,
    symbolQueryTotal:q.total,
    companyNames,
    allCandidateRowCount:allCandidateRows.length,
    parValueRowCount:parValueRows.length,
    revisionHintRowCount:revisionHintRows.length,
    revisionParValueRowCount:revisionParValueRows.length,
    parValueRows,
    revisionHintRows,
    revisionParValueRows,
  });
}

const allBaselinesReady=candidateResults.every(x=>x.baselineReady);
const positiveCandidates=candidateResults.filter(x=>x.revisionParValueRowCount>0);
const state=!allBaselinesReady
  ?"OFFICIAL_DOCUMENT_BASELINE_CONTROL_FAILED"
  : positiveCandidates.length
    ?"OFFICIAL_DOCUMENT_REVISION_CANDIDATES_OBSERVED"
    :"OFFICIAL_DOCUMENT_BOUNDED_NEGATIVE";

const result={
  schemaVersion:"S2_TWSE_PAR_VALUE_OFFICIAL_DOCUMENT_BOUNDED_SEARCH_V0_1",
  observedAt:new Date().toISOString(),
  state,
  source:{
    endpoint:ENDPOINT,
    sourceContract:"PR#596/c631eb5519d432b7d2659499d4ea34b94d44633d",
    startDate:START_DATE,
    endDate:END_DATE,
    pageSessionCookieObserved:pageSetCookies.length>0,
  },
  candidateCount:FROZEN.length,
  symbolQueryCount:symbolQueries.length,
  globalKeywordQueryCount:globalQueries.length,
  allBaselinesReady,
  positiveCandidateCount:positiveCandidates.length,
  positiveSymbols:positiveCandidates.map(x=>x.symbol),
  symbolQueryDiagnostics:symbolQueries.map(q=>({keyword:q.keyword,total:q.total,payloadHash:q.payloadHash})),
  globalQueryDiagnostics:globalQueries.map(q=>({keyword:q.keyword,total:q.total,payloadHash:q.payloadHash})),
  candidateResults,
  boundedOfficialDocumentSearchPerformed:true,
  representativeControlPromoted:false,
  representativeAuthorityReadyCount:5,
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

assert.equal(result.candidateCount,4);
assert.equal(result.allBaselinesReady,true,"all frozen operational baseline refs must be recovered");
assert.equal(result.representativeControlPromoted,false);
assert.equal(result.representativeAuthorityReadyCount,5);
assert.equal(result.revisionCoverageComplete,false);
assert.equal(result.system1RuntimeUsed,false);

console.log(JSON.stringify(result,null,2));
