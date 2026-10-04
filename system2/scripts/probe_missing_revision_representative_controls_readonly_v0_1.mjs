import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";

const URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const ROC_YEAR=115;

const CANDIDATES=Object.freeze([
  {lane:"TWSE_PAR_VALUE_CHANGE_REFERENCE",exchange:"TWSE",actionFamilyId:"PAR_VALUE_CHANGE",stockCode:"6949",effectiveDate:"2026-09-07"},
  {lane:"TPEX_EX_RIGHT_DIVIDEND_ACTUAL",exchange:"TPEX",actionFamilyId:"EX_RIGHT_DIVIDEND",stockCode:"8102",effectiveDate:"2026-04-07"},
  {lane:"TPEX_EX_RIGHT_DIVIDEND_ACTUAL",exchange:"TPEX",actionFamilyId:"EX_RIGHT_DIVIDEND",stockCode:"4207",effectiveDate:"2026-04-08"},
  {lane:"TPEX_CAPITAL_REDUCTION_REFERENCE",exchange:"TPEX",actionFamilyId:"CAPITAL_REDUCTION",stockCode:"5381",effectiveDate:"2026-04-13"},
  {lane:"TPEX_CAPITAL_REDUCTION_REFERENCE",exchange:"TPEX",actionFamilyId:"CAPITAL_REDUCTION",stockCode:"3152",effectiveDate:"2026-06-30"},
  {lane:"TPEX_PAR_VALUE_CHANGE_REFERENCE",exchange:"TPEX",actionFamilyId:"PAR_VALUE_CHANGE",stockCode:"8937",effectiveDate:"2026-04-13"},
  {lane:"TPEX_PAR_VALUE_CHANGE_REFERENCE",exchange:"TPEX",actionFamilyId:"PAR_VALUE_CHANGE",stockCode:"3086",effectiveDate:"2026-04-20"},
]);

const FAMILY_PATTERNS=Object.freeze({
  EX_RIGHT_DIVIDEND:/除權|除息|除權息|配息|現金股利|股票股利|股利分派|盈餘分配/,
  CAPITAL_REDUCTION:/減資|減資換股|彌補虧損/,
  PAR_VALUE_CHANGE:/每股面額|面額變更|變更面額|票面金額|換發股票|新股票換發/,
});

function sleep(ms){ return new Promise((r)=>setTimeout(r,ms)); }
function sha256(text){ return createHash("sha256").update(text).digest("hex"); }

function fetchAll(stockCode){
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30",
    "--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-Missing-Revision-Control-Discovery/0.1",
    "--data-urlencode","firstin=1",
    "--data-urlencode","step=1",
    "--data-urlencode","TYPEK=all",
    "--data-urlencode","co_id="+stockCode,
    "--data-urlencode","year="+ROC_YEAR,
    "--data-urlencode","month=all",
    "--data-urlencode","b_date=",
    "--data-urlencode","e_date=",
    URL,
  ];
  const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:24*1024*1024});
  if(p.error) throw p.error;
  if(p.status!==0) throw new Error("curl exit "+p.status+" for "+stockCode+": "+String(p.stderr||"").slice(0,500));
  return p.stdout;
}

function subjectText(rowText, stockCode){
  let s=String(rowText||"");
  s=s.replace(new RegExp("^"+stockCode+"\\s+\\S+\\s+\\d{3}\\/\\d{2}\\/\\d{2}\\s+\\d{2}:\\d{2}:\\d{2}\\s*"),"");
  return s.trim();
}

function normalizedStem(subject){
  return String(subject||"")
    .replace(/^[（(]?(?:更正|修正)[）)]?[-：:、\s]*/g,"")
    .replace(/(?:\(|（)(?:更正|修正)[^\)）]*(?:\)|）)/g,"")
    .replace(/公告本公司|本公司|公告/g,"")
    .replace(/[\s()（）:：,，。；;、\-_/]/g,"")
    .trim();
}

const results=[];
for(let i=0;i<CANDIDATES.length;i+=1){
  const candidate=CANDIDATES[i];
  const html=fetchAll(candidate.stockCode);
  const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({
    html,
    stockCode:candidate.stockCode,
    expectedDate:null,
    baseSubject:null,
  });
  const pattern=FAMILY_PATTERNS[candidate.actionFamilyId];
  const actionRows=(parsed.rows||[])
    .filter((row)=>pattern.test(String(row.rowText||"")))
    .map((row)=>{
      const subject=subjectText(row.rowText,candidate.stockCode);
      return {
        date:row.date,
        time:row.time,
        seqNo:row.seqNo,
        correctionOrCancellationHint:row.correctionOrCancellationHint===true,
        subject,
        normalizedStem:normalizedStem(subject),
        rowText:row.rowText,
      };
    })
    .sort((a,b)=>[a.date||"",a.time||"",a.seqNo||""].join("|").localeCompare([b.date||"",b.time||"",b.seqNo||""].join("|")));

  const byStem=new Map();
  for(const row of actionRows){
    const key=row.normalizedStem||"__EMPTY__";
    if(!byStem.has(key)) byStem.set(key,[]);
    byStem.get(key).push(row);
  }
  const chains=[...byStem.entries()]
    .map(([stem,rows])=>({
      stem,
      rowCount:rows.length,
      originalCount:rows.filter((x)=>!x.correctionOrCancellationHint).length,
      revisionOrCancellationCount:rows.filter((x)=>x.correctionOrCancellationHint).length,
      distinctVersionKeyCount:new Set(rows.map((x)=>[x.date||"",x.time||"",x.seqNo||""].join("|"))).size,
      dates:[...new Set(rows.map((x)=>x.date).filter(Boolean))].sort(),
      rows,
    }))
    .filter((x)=>x.rowCount>=2 && x.originalCount>=1 && x.revisionOrCancellationCount>=1 && x.distinctVersionKeyCount>=2)
    .sort((a,b)=>b.rowCount-a.rowCount || a.stem.localeCompare(b.stem));

  const revisionRows=actionRows.filter((x)=>x.correctionOrCancellationHint);
  results.push({
    ...candidate,
    payloadSha256:sha256(html),
    yearlyRowCount:parsed.rowCount,
    actionRowCount:actionRows.length,
    revisionOrCancellationActionRowCount:revisionRows.length,
    exactStemChainCount:chains.length,
    representativeControlCandidateObserved:chains.length>0,
    candidateChains:chains.slice(0,8),
    actionRows:actionRows.slice(0,40),
  });
  if(i<CANDIDATES.length-1) await sleep(650);
}

const byLane={};
for(const row of results){
  if(!byLane[row.lane]) byLane[row.lane]=[];
  byLane[row.lane].push(row);
}

const laneSummaries=Object.entries(byLane).map(([lane,rows])=>({
  lane,
  candidateSymbolCount:rows.length,
  candidateSymbols:rows.map((x)=>x.stockCode),
  representativeCandidateCount:rows.filter((x)=>x.representativeControlCandidateObserved).length,
  representativeCandidateSymbols:rows.filter((x)=>x.representativeControlCandidateObserved).map((x)=>x.stockCode),
  state:rows.some((x)=>x.representativeControlCandidateObserved)
    ?"REPRESENTATIVE_CHAIN_CANDIDATE_OBSERVED"
    :"NO_EXACT_STEM_REVISION_CHAIN_IN_FROZEN_CANDIDATES",
}));

const result={
  schemaVersion:"S2_MISSING_REVISION_REPRESENTATIVE_CONTROL_DISCOVERY_V0_1",
  observedAt:new Date().toISOString(),
  rocYear:ROC_YEAR,
  frozenCandidateCount:CANDIDATES.length,
  laneCount:laneSummaries.length,
  representativeCandidateCount:results.filter((x)=>x.representativeControlCandidateObserved).length,
  laneSummaries,
  results,

  discoveryOnly:true,
  representativeControlsFrozen:false,
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

assert.equal(result.frozenCandidateCount,7);
assert.equal(result.laneCount,4);
assert.equal(result.representativeControlsFrozen,false);
assert.equal(result.revisionCoverageComplete,false);
assert.equal(result.selectionAuthority,false);
assert.equal(result.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result: result.representativeCandidateCount>0
    ?"DISCOVERY_CANDIDATES_OBSERVED"
    :"DISCOVERY_NEGATIVE_NO_EXACT_STEM_CHAINS",
  ...result,
},null,2));
