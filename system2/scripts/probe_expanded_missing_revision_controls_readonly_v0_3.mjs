import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";

const MOPS_URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const CURRENT_YEAR=2026;
const CURRENT_CUTOFF="2026-10-02";


const LANE_CONFIG=Object.freeze([
  {
    sourceId:"TWSE_PAR_VALUE_CHANGE_REFERENCE",
    actionFamilyId:"PAR_VALUE_CHANGE",
    years:[2017,2018,2019],
    exclude:new Set(),
    offset:0,
    cap:24,
  },
  {
    sourceId:"TPEX_EX_RIGHT_DIVIDEND_ACTUAL",
    actionFamilyId:"EX_RIGHT_DIVIDEND",
    years:[2026],
    exclude:new Set(["8102|2026","4207|2026"]),
    offset:24,
    cap:48,
  },
]);

const FAMILY_PATTERNS=Object.freeze({
  EX_RIGHT_DIVIDEND:/除權|除息|除權息|配息|現金股利|股票股利|股利分派|盈餘分配|分派.*股利/,
  PAR_VALUE_CHANGE:/每股面額|面額變更|變更面額|股票面額|票面金額|每股金額/,
});

const FAMILY_EXCLUDES=Object.freeze({
  EX_RIGHT_DIVIDEND:/減資|減資換股|換股|面額變更|每股面額/,
  PAR_VALUE_CHANGE:/減資換股|減資後|除權|除息/,
});

function sleep(ms){ return new Promise((r)=>setTimeout(r,ms)); }

function endDateForYear(year){
  return year===CURRENT_YEAR ? CURRENT_CUTOFF : `${year}-12-31`;
}

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

function versionKey(row){
  return [row.date||"",row.time||"",row.seqNo||""].join("|");
}

function fetchMopsYear(stockCode,rocYear){
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30",
    "--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-Expanded-Revision-Control-Discovery/0.3",
    "--data-urlencode","firstin=1",
    "--data-urlencode","step=1",
    "--data-urlencode","TYPEK=all",
    "--data-urlencode","co_id="+stockCode,
    "--data-urlencode","year="+rocYear,
    "--data-urlencode","month=all",
    "--data-urlencode","b_date=",
    "--data-urlencode","e_date=",
    MOPS_URL,
  ];
  const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
  if(p.error) throw p.error;
  if(p.status!==0) throw new Error("curl exit "+p.status+" for "+stockCode+"/"+rocYear+": "+String(p.stderr||"").slice(0,500));
  return p.stdout;
}

async function officialCandidates(config){
  const all=[];
  const diagnostics=[];
  for(const year of config.years){
    const startDate=`${year}-01-01`;
    const endDate=endDateForYear(year);
    const urls=buildOfficialContinuitySourceUrlsV0_1({startDate,endDate});
    const source=urls[config.sourceId];
    assert.ok(source,config.sourceId+" URL missing");
    const response=await fetch(source.url,{
      headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-Expanded-Revision-Control-Discovery/0.3"},
      signal:AbortSignal.timeout(30000),
    });
    const rawText=await response.text();
    assert.equal(response.ok,true,config.sourceId+" "+year+" HTTP "+response.status);
    const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
      sourceId:config.sourceId,
      sourceUrl:source.url,
      rawText,
      fetchedAt:new Date().toISOString(),
      requestedStartDate:startDate,
      requestedEndDate:endDate,
    });
    assert.equal(parsed.responseRangeVerified,true,config.sourceId+" "+year+" range");
    assert.equal(parsed.parserComplete,true,config.sourceId+" "+year+" parser");
    diagnostics.push({
      sourceId:config.sourceId,year,eventCount:parsed.eventCount,state:parsed.state,
    });
    for(const event of parsed.events){
      if(!event.symbol || !event.effectiveDate) continue;
      const eventYear=Number(event.effectiveDate.slice(0,4));
      const key=event.symbol+"|"+eventYear;
      if(config.exclude.has(key)) continue;
      all.push({
        sourceId:config.sourceId,
        actionFamilyId:config.actionFamilyId,
        symbol:event.symbol,
        eventYear,
        rocYear:eventYear-1911,
        officialEffectiveDate:event.effectiveDate,
        officialEventVersionId:event.eventVersionId,
      });
    }
  }
  const unique=new Map();
  for(const row of all.sort((a,b)=>
    a.officialEffectiveDate.localeCompare(b.officialEffectiveDate) ||
    a.symbol.localeCompare(b.symbol)
  )){
    const key=row.symbol+"|"+row.eventYear;
    if(!unique.has(key)) unique.set(key,row);
  }
  return {
    diagnostics,
    candidates:[...unique.values()].slice(config.offset,config.offset+config.cap),
    totalUniqueCandidateCount:unique.size,
    candidateOffset:config.offset,
    candidateCap:config.cap,
  };
}

function inspectMopsCandidate(candidate,html){
  const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({
    html,
    stockCode:candidate.symbol,
    expectedDate:null,
    baseSubject:null,
  });
  const include=FAMILY_PATTERNS[candidate.actionFamilyId];
  const exclude=FAMILY_EXCLUDES[candidate.actionFamilyId];
  const actionRows=(parsed.rows||[])
    .filter((row)=>{
      const text=String(row.rowText||"");
      return include.test(text) && !exclude.test(text);
    })
    .map((row)=>{
      const subject=stripRowPrefix(row.rowText,candidate.symbol);
      return {
        date:row.date,time:row.time,seqNo:row.seqNo,
        correctionOrCancellationHint:row.correctionOrCancellationHint===true,
        subject,
        stem:normalizeSubject(subject),
        rowText:row.rowText,
      };
    })
    .sort((a,b)=>versionKey(a).localeCompare(versionKey(b)));

  const chains=[];
  for(const revision of actionRows.filter((x)=>x.correctionOrCancellationHint)){
    const prior=actionRows.filter((x)=>
      !x.correctionOrCancellationHint &&
      versionKey(x)<versionKey(revision) &&
      compatibleStem(x.stem,revision.stem)
    );
    for(const original of prior){
      chains.push({
        original,
        revision,
        exactStem:original.stem===revision.stem,
        stemCompatibility: original.stem===revision.stem ? "EXACT" : "CONTAINMENT_72PCT",
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
    chains:[...distinct.values()].slice(0,10),
    actionRows:actionRows.slice(0,40),
  };
}

const laneResults=[];
for(const config of LANE_CONFIG){
  const official=await officialCandidates(config);
  const inspected=[];
  for(let i=0;i<official.candidates.length;i+=1){
    const candidate=official.candidates[i];
    const html=fetchMopsYear(candidate.symbol,candidate.rocYear);
    inspected.push({
      ...candidate,
      ...inspectMopsCandidate(candidate,html),
    });
    if(i<official.candidates.length-1) await sleep(450);
  }
  const positives=inspected.filter((x)=>x.representativeControlCandidateObserved);
  laneResults.push({
    sourceId:config.sourceId,
    actionFamilyId:config.actionFamilyId,
    years:config.years,
    officialDiagnostics:official.diagnostics,
    totalUniqueOfficialCandidateCount:official.totalUniqueCandidateCount,
    queriedCandidateCount:inspected.length,
    positiveCandidateCount:positives.length,
    positiveCandidateSymbols:positives.map((x)=>x.symbol),
    state:positives.length>0
      ?"EXPANDED_REVISION_CHAIN_CANDIDATES_OBSERVED"
      :"EXPANDED_DISCOVERY_NEGATIVE",
    positives,
    inspected,
  });
}

const result={
  schemaVersion:"S2_EXPANDED_MISSING_REVISION_CONTROL_DISCOVERY_V0_3",
  observedAt:new Date().toISOString(),
  candidatePolicy:"LANE_SPECIFIC_BOUNDED_OFFSET_CAP",
  laneCount:laneResults.length,
  positiveLaneCount:laneResults.filter((x)=>x.positiveCandidateCount>0).length,
  positiveCandidateCount:laneResults.reduce((n,x)=>n+x.positiveCandidateCount,0),
  laneResults,

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
    ?"EXPANDED_DISCOVERY_POSITIVES_OBSERVED"
    :"EXPANDED_DISCOVERY_NEGATIVE",
  ...result,
},null,2));
