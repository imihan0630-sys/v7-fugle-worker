import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";

const MOPS_URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const CURRENT_CUTOFF="2026-10-02";

const FAMILY_PATTERNS=Object.freeze({
  EX_RIGHT_DIVIDEND:/除權|除息|除權息|配息|現金股利|股票股利|股利分派|盈餘分配|分派.*股利/,
  PAR_VALUE_CHANGE:/每股面額|面額變更|變更面額|股票面額|票面金額|每股金額/,
});
const FAMILY_EXCLUDES=Object.freeze({
  EX_RIGHT_DIVIDEND:/減資|減資換股|換股|面額變更|每股面額/,
  PAR_VALUE_CHANGE:/減資換股|減資後|除權|除息/,
});

function sleep(ms){ return new Promise((r)=>setTimeout(r,ms)); }
function versionKey(row){ return [row.date||"",row.time||"",row.seqNo||""].join("|"); }
function stripRowPrefix(rowText,stockCode){
  return String(rowText||"")
    .replace(new RegExp("^"+stockCode+"\\s+\\S+\\s+\\d{3}\\/\\d{2}\\/\\d{2}\\s+\\d{2}:\\d{2}:\\d{2}\\s*"),"")
    .trim();
}
function normalizeSubject(subject){
  return String(subject||"")
    .replace(/^[（(]?(?:更正|修正|補充公告|補充)[）)]?[-：:、\s]*/g,"")
    .replace(/(?:更正|修正|補充公告|補充)/g,"")
    .replace(/公告本公司|本公司|公告/g,"")
    .replace(/民國\s*\d+\s*年\s*\d+\s*月\s*\d+\s*日/g,"")
    .replace(/\d{2,4}[\/.-]\d{1,2}[\/.-]\d{1,2}/g,"")
    .replace(/[0-9０-９]+(?:\.[0-9０-９]+)?/g,"")
    .replace(/[\s()（）\[\]【】:：,，。；;、\-_/％%]/g,"")
    .trim();
}
function compatibleStem(a,b){
  if(!a || !b || a.length<6 || b.length<6) return false;
  if(a===b) return true;
  const shorter=a.length<=b.length?a:b;
  const longer=a.length>b.length?a:b;
  return longer.includes(shorter) && shorter.length/longer.length>=0.72;
}
function fetchMopsYear(stockCode,rocYear){
  const p=spawnSync("curl",[
    "--fail","--silent","--show-error","--location","--max-time","30",
    "--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-Final-Two-Revision-Control-Discovery/0.3",
    "--data-urlencode","firstin=1","--data-urlencode","step=1","--data-urlencode","TYPEK=all",
    "--data-urlencode","co_id="+stockCode,"--data-urlencode","year="+rocYear,
    "--data-urlencode","month=all","--data-urlencode","b_date=","--data-urlencode","e_date=",
    MOPS_URL,
  ],{encoding:"utf8",maxBuffer:32*1024*1024});
  if(p.error) throw p.error;
  if(p.status!==0) throw new Error("curl exit "+p.status+" for "+stockCode+"/"+rocYear+": "+String(p.stderr||"").slice(0,500));
  return p.stdout;
}
async function fetchOfficialYear(sourceId,year){
  const startDate=`${year}-01-01`;
  const endDate=year===2026?CURRENT_CUTOFF:`${year}-12-31`;
  const source=buildOfficialContinuitySourceUrlsV0_1({startDate,endDate})[sourceId];
  assert.ok(source,sourceId+" URL missing");
  const response=await fetch(source.url,{
    headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-Final-Two-Revision-Control-Discovery/0.3"},
    signal:AbortSignal.timeout(30000),
  });
  const rawText=await response.text();
  assert.equal(response.ok,true,sourceId+" "+year+" HTTP "+response.status);
  const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
    sourceId,sourceUrl:source.url,rawText,fetchedAt:new Date().toISOString(),
    requestedStartDate:startDate,requestedEndDate:endDate,
  });
  assert.equal(parsed.responseRangeVerified,true,sourceId+" "+year+" range");
  assert.equal(parsed.parserComplete,true,sourceId+" "+year+" parser");
  return parsed;
}
function eventCandidates(sourceId,actionFamilyId,parsedList,excludeKeys=new Set()){
  const rows=[];
  for(const parsed of parsedList){
    for(const event of parsed.events||[]){
      if(!event.symbol || !event.effectiveDate) continue;
      const eventYear=Number(event.effectiveDate.slice(0,4));
      const key=event.symbol+"|"+eventYear;
      if(excludeKeys.has(key)) continue;
      rows.push({
        sourceId,actionFamilyId,symbol:event.symbol,eventYear,rocYear:eventYear-1911,
        officialEffectiveDate:event.effectiveDate,officialEventVersionId:event.eventVersionId,
      });
    }
  }
  const unique=new Map();
  for(const row of rows.sort((a,b)=>
    a.officialEffectiveDate.localeCompare(b.officialEffectiveDate)||a.symbol.localeCompare(b.symbol)
  )){
    const key=row.symbol+"|"+row.eventYear;
    if(!unique.has(key)) unique.set(key,row);
  }
  return [...unique.values()];
}
function stratifiedSample(items,count,skipFirst=0){
  const pool=items.slice(skipFirst);
  if(pool.length<=count) return pool;
  const picked=[];
  const seen=new Set();
  for(let i=0;i<count;i+=1){
    const idx=Math.round(i*(pool.length-1)/(count-1));
    if(!seen.has(idx)){ seen.add(idx); picked.push(pool[idx]); }
  }
  return picked;
}
function inspect(candidate,html){
  const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({
    html,stockCode:candidate.symbol,expectedDate:null,baseSubject:null,
  });
  const include=FAMILY_PATTERNS[candidate.actionFamilyId];
  const exclude=FAMILY_EXCLUDES[candidate.actionFamilyId];
  const actionRows=(parsed.rows||[])
    .filter((row)=>{
      const t=String(row.rowText||"");
      return include.test(t) && !exclude.test(t);
    })
    .map((row)=>{
      const subject=stripRowPrefix(row.rowText,candidate.symbol);
      return {
        date:row.date,time:row.time,seqNo:row.seqNo,
        correctionOrCancellationHint:row.correctionOrCancellationHint===true,
        subject,stem:normalizeSubject(subject),rowText:row.rowText,
      };
    })
    .sort((a,b)=>versionKey(a).localeCompare(versionKey(b)));
  const chains=[];
  for(const revision of actionRows.filter((x)=>x.correctionOrCancellationHint)){
    for(const original of actionRows.filter((x)=>
      !x.correctionOrCancellationHint &&
      versionKey(x)<versionKey(revision) &&
      compatibleStem(x.stem,revision.stem)
    )){
      chains.push({
        original,revision,
        exactStem:original.stem===revision.stem,
        stemCompatibility:original.stem===revision.stem?"EXACT":"CONTAINMENT_72PCT",
      });
    }
  }
  const distinct=new Map();
  for(const chain of chains){
    const key=versionKey(chain.original)+"=>"+versionKey(chain.revision);
    if(!distinct.has(key)) distinct.set(key,chain);
  }
  return {
    yearlyRowCount:parsed.rowCount,
    actionRowCount:actionRows.length,
    correctionOrCancellationActionRowCount:actionRows.filter((x)=>x.correctionOrCancellationHint).length,
    chainCount:distinct.size,
    representativeControlCandidateObserved:distinct.size>0,
    chains:[...distinct.values()].slice(0,12),
  };
}

const twseParsed=[];
for(let year=2010;year<=2019;year+=1) twseParsed.push(await fetchOfficialYear("TWSE_PAR_VALUE_CHANGE_REFERENCE",year));
const twseAll=eventCandidates(
  "TWSE_PAR_VALUE_CHANGE_REFERENCE","PAR_VALUE_CHANGE",twseParsed,
  new Set(["6949|2026"])
);

const tpexParsed=[await fetchOfficialYear("TPEX_EX_RIGHT_DIVIDEND_ACTUAL",2026)];
const tpexAll=eventCandidates(
  "TPEX_EX_RIGHT_DIVIDEND_ACTUAL","EX_RIGHT_DIVIDEND",tpexParsed,
  new Set(["8102|2026","4207|2026"])
);
const tpexSample=stratifiedSample(tpexAll,48,24);

async function inspectCandidates(candidates){
  const out=[];
  for(let i=0;i<candidates.length;i+=1){
    const candidate=candidates[i];
    const html=fetchMopsYear(candidate.symbol,candidate.rocYear);
    out.push({...candidate,...inspect(candidate,html)});
    if(i<candidates.length-1) await sleep(400);
  }
  return out;
}

const twseInspected=await inspectCandidates(twseAll);
const tpexInspected=await inspectCandidates(tpexSample);
const twsePositives=twseInspected.filter((x)=>x.representativeControlCandidateObserved);
const tpexPositives=tpexInspected.filter((x)=>x.representativeControlCandidateObserved);

const result={
  schemaVersion:"S2_FINAL_TWO_REVISION_CONTROL_DISCOVERY_V0_3",
  observedAt:new Date().toISOString(),
  laneCount:2,
  lanes:[
    {
      sourceId:"TWSE_PAR_VALUE_CHANGE_REFERENCE",
      actionFamilyId:"PAR_VALUE_CHANGE",
      selectionPolicy:"COMPLETE_OFFICIAL_EVENT_SET_2010_2019",
      officialEventCount:twseParsed.reduce((n,x)=>n+Number(x.eventCount||0),0),
      uniqueCandidateCount:twseAll.length,
      queriedCandidateCount:twseInspected.length,
      positiveCandidateCount:twsePositives.length,
      positiveCandidateSymbols:twsePositives.map((x)=>x.symbol),
      positives:twsePositives,
    },
    {
      sourceId:"TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
      actionFamilyId:"EX_RIGHT_DIVIDEND",
      selectionPolicy:"DETERMINISTIC_STRATIFIED_48_AFTER_PRIOR_FIRST_24",
      full2026UniqueCandidateCount:tpexAll.length,
      priorPrefixExcludedCount:Math.min(24,tpexAll.length),
      queriedCandidateCount:tpexInspected.length,
      sampledEffectiveDates:tpexSample.map((x)=>x.officialEffectiveDate),
      positiveCandidateCount:tpexPositives.length,
      positiveCandidateSymbols:tpexPositives.map((x)=>x.symbol),
      positives:tpexPositives,
    },
  ],
  positiveLaneCount:[twsePositives,tpexPositives].filter((x)=>x.length>0).length,
  positiveCandidateCount:twsePositives.length+tpexPositives.length,

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

assert.equal(result.laneCount,2);
assert.equal(result.representativeControlsFrozen,false);
assert.equal(result.revisionCoverageComplete,false);
assert.equal(result.selectionAuthority,false);
assert.equal(result.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result:result.positiveCandidateCount>0
    ?"FINAL_TWO_DISCOVERY_POSITIVES_OBSERVED"
    :"FINAL_TWO_DISCOVERY_NEGATIVE",
  ...result,
},null,2));
