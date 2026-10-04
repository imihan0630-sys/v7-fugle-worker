import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { parseCsvRowsV0_1, parseListingDateV0_1 } from "../runtime/current_listing_metadata_v0_1.mjs";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";

const TWSE_LIST_URL="https://mopsfin.twse.com.tw/opendata/t187ap03_L.csv";
const MOPS_URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const START_YEAR=2010;
const END_YEAR=2019;
const CANDIDATE_CAP=40;

function sleep(ms){ return new Promise((r)=>setTimeout(r,ms)); }
function versionKey(row){ return [row.date||"",row.time||"",row.seqNo||""].join("|"); }

function normalizeSubject(subject){
  return String(subject||"")
    .replace(/^[（(]?(?:更正|修正|補充公告|補充|取消|撤銷)[）)]?[-：:、\s]*/g,"")
    .replace(/(?:更正|修正|補充公告|補充|取消|撤銷)/g,"")
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
  return longer.includes(shorter) && shorter.length/longer.length>=0.78;
}

function stripRowPrefix(rowText,stockCode){
  return String(rowText||"")
    .replace(new RegExp("^"+stockCode+"\\s+\\S+\\s+\\d{3}\\/\\d{2}\\/\\d{2}\\s+\\d{2}:\\d{2}:\\d{2}\\s*"),"")
    .trim();
}

function fetchMopsYear(stockCode,rocYear){
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30",
    "--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-TWSE-Starred-ParValue-Discovery/0.1",
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
  if(p.status!==0){
    throw new Error("curl exit "+p.status+" for "+stockCode+"/"+rocYear+": "+String(p.stderr||"").slice(0,500));
  }
  return p.stdout;
}

async function fetchStarredCandidates(){
  const response=await fetch(TWSE_LIST_URL,{
    headers:{accept:"text/csv,text/plain,*/*","user-agent":"System2-TWSE-Starred-ParValue-Discovery/0.1"},
    signal:AbortSignal.timeout(30000),
  });
  const text=await response.text();
  assert.equal(response.ok,true,"TWSE current-list HTTP "+response.status);
  const rows=parseCsvRowsV0_1(text);
  assert.ok(rows.length>500,"TWSE current-list CSV unexpectedly small");
  const headers=rows[0].map((x)=>String(x).trim());
  const index=Object.fromEntries(headers.map((name,i)=>[name,i]));
  for(const field of ["公司代號","公司簡稱","上市日期"]){
    assert.ok(Number.isInteger(index[field]),"TWSE CSV missing "+field);
  }

  const ordinary=rows.slice(1).map((row)=>{
    const symbol=String(row[index["公司代號"]]||"").trim();
    const shortName=String(row[index["公司簡稱"]]||"").trim();
    const listingDateRaw=String(row[index["上市日期"]]||"").trim();
    if(!/^[1-9][0-9]{3}$/.test(symbol)) return null;
    if(!shortName.includes("*")) return null;
    let listingDate=null;
    try{ listingDate=parseListingDateV0_1(listingDateRaw); }catch{}
    if(!listingDate || listingDate>"2019-12-31") return null;
    return {symbol,shortName,listingDate};
  }).filter(Boolean);

  ordinary.sort((a,b)=>a.listingDate.localeCompare(b.listingDate)||a.symbol.localeCompare(b.symbol));
  const unique=[...new Map(ordinary.map((x)=>[x.symbol,x])).values()];
  return {
    currentCsvRowCount:rows.length-1,
    eligibleStarredPre2020Count:unique.length,
    candidates:unique.slice(0,CANDIDATE_CAP),
  };
}

function inspectMopsYear(candidate,year,html){
  const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({
    html,stockCode:candidate.symbol,expectedDate:null,baseSubject:null,
  });

  const include=/(股票面額.*變更|變更.*股票面額|每股面額.*變更|變更.*每股面額|面額變更.*換發|換發.*面額變更)/;
  const exclude=/(財務報告|每股盈餘|資產負債表|減資|除權|除息)/;

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
        stemCompatibility:original.stem===revision.stem?"EXACT":"CONTAINMENT_78PCT",
      });
    }
  }

  const distinct=new Map();
  for(const chain of chains){
    const key=versionKey(chain.original)+"=>"+versionKey(chain.revision);
    if(!distinct.has(key)) distinct.set(key,chain);
  }

  return {
    year,
    rocYear:year-1911,
    yearlyRowCount:parsed.rowCount,
    actionRowCount:actionRows.length,
    correctionOrCancellationActionRowCount:actionRows.filter((x)=>x.correctionOrCancellationHint).length,
    chainCount:distinct.size,
    representativeControlCandidateObserved:distinct.size>0,
    chains:[...distinct.values()].slice(0,12),
    actionRows:actionRows.slice(0,40),
  };
}

const universe=await fetchStarredCandidates();
assert.ok(universe.eligibleStarredPre2020Count>=1,"no pre-2020 current TWSE starred candidates");

const inspected=[];
let positive=null;
let queryCount=0;

for(let ci=0;ci<universe.candidates.length && !positive;ci+=1){
  const candidate=universe.candidates[ci];
  const listingYear=Number(candidate.listingDate.slice(0,4));
  const fromYear=Math.max(START_YEAR,listingYear);
  const years=[];
  for(let year=fromYear;year<=END_YEAR;year+=1) years.push(year);

  const yearResults=[];
  for(let yi=0;yi<years.length;yi+=1){
    const year=years[yi];
    const html=fetchMopsYear(candidate.symbol,year-1911);
    queryCount+=1;
    const result=inspectMopsYear(candidate,year,html);
    yearResults.push(result);
    if(result.representativeControlCandidateObserved){
      positive={...candidate,positiveYear:year,result};
      break;
    }
    if(yi<years.length-1) await sleep(350);
  }

  inspected.push({
    ...candidate,
    yearsRequested:years,
    yearsQueried:yearResults.map((x)=>x.year),
    positiveYear:yearResults.find((x)=>x.representativeControlCandidateObserved)?.year||null,
    totalActionRows:yearResults.reduce((n,x)=>n+x.actionRowCount,0),
    totalCorrectionActionRows:yearResults.reduce((n,x)=>n+x.correctionOrCancellationActionRowCount,0),
    yearResults:yearResults.filter((x)=>x.actionRowCount>0 || x.chainCount>0),
  });

  if(!positive && ci<universe.candidates.length-1) await sleep(450);
}

const result={
  schemaVersion:"S2_TWSE_PAR_VALUE_STARRED_CANDIDATE_DISCOVERY_V0_1",
  observedAt:new Date().toISOString(),
  source:{
    currentListingSource:TWSE_LIST_URL,
    candidateSemantics:"CURRENT_TWSE_ORDINARY_SHORT_NAME_CONTAINS_STAR_AND_LISTED_BY_2019_12_31",
    starMeaningExternalContract:"NON_10_NTD_PAR_VALUE_OR_NO_PAR_VALUE_SECURITY_SHORT_NAME_ATTRIBUTE",
  },
  searchWindow:{startYear:START_YEAR,endYear:END_YEAR},
  candidateCap:CANDIDATE_CAP,
  currentCsvRowCount:universe.currentCsvRowCount,
  eligibleStarredPre2020Count:universe.eligibleStarredPre2020Count,
  selectedCandidateCount:universe.candidates.length,
  queriedCandidateCount:inspected.length,
  mopsCompanyYearQueryCount:queryCount,
  stoppedAfterFirstPositive:Boolean(positive),
  positiveCandidateCount:positive?1:0,
  positiveCandidate:positive,
  inspected,

  discoveryOnly:true,
  representativeControlFrozen:false,
  exchangeOperationalJoinProven:false,
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

assert.equal(result.discoveryOnly,true);
assert.equal(result.representativeControlFrozen,false);
assert.equal(result.revisionCoverageComplete,false);
assert.equal(result.selectionAuthority,false);
assert.equal(result.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result:positive
    ?"TWSE_PAR_VALUE_STARRED_REVISION_CANDIDATE_OBSERVED"
    :"TWSE_PAR_VALUE_STARRED_DISCOVERY_NEGATIVE",
  ...result,
},null,2));
