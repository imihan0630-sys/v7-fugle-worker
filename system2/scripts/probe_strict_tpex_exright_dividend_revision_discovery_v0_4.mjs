import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";

const SOURCE_ID="TPEX_EX_RIGHT_DIVIDEND_ACTUAL";
const ACTION_FAMILY_ID="EX_RIGHT_DIVIDEND";
const YEAR=2026;
const ROC_YEAR=115;
const START_DATE="2026-01-01";
const END_DATE="2026-10-02";
const CANDIDATE_OFFSET=24;
const CANDIDATE_CAP=160;
const EXCLUDE=new Set(["8102|2026","4207|2026"]);
const MOPS_URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";

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

async function fetchMopsYear(stockCode){
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30",
    "--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-Strict-TPEx-ExRight-Dividend-Revision-Discovery/0.4",
    "--data-urlencode","firstin=1",
    "--data-urlencode","step=1",
    "--data-urlencode","TYPEK=all",
    "--data-urlencode","co_id="+stockCode,
    "--data-urlencode","year="+ROC_YEAR,
    "--data-urlencode","month=all",
    "--data-urlencode","b_date=",
    "--data-urlencode","e_date=",
    MOPS_URL,
  ];

  const maxAttempts=4;
  for(let attempt=1;attempt<=maxAttempts;attempt+=1){
    const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
    if(p.error){
      if(attempt<maxAttempts){
        await sleep(600*attempt);
        continue;
      }
      throw p.error;
    }
    if(p.status===0) return p.stdout;

    const stderr=String(p.stderr||"");
    const retryable=
      /(?:429|500|502|503|504)\b/.test(stderr) ||
      [5,6,7,18,28,35,52,55,56,92].includes(Number(p.status));
    if(retryable && attempt<maxAttempts){
      await sleep(700*attempt);
      continue;
    }
    throw new Error(
      "curl exit "+p.status+" for "+stockCode+
      " after "+attempt+" attempt(s): "+stderr.slice(0,500)
    );
  }
  throw new Error("unreachable MOPS retry state for "+stockCode);
}

async function officialCandidates(){
  const urls=buildOfficialContinuitySourceUrlsV0_1({startDate:START_DATE,endDate:END_DATE});
  const source=urls[SOURCE_ID];
  assert.ok(source,SOURCE_ID+" URL missing");
  const response=await fetch(source.url,{
    headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-Strict-TPEx-ExRight-Dividend-Revision-Discovery/0.4"},
    signal:AbortSignal.timeout(30000),
  });
  const rawText=await response.text();
  assert.equal(response.ok,true,SOURCE_ID+" HTTP "+response.status);
  const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
    sourceId:SOURCE_ID,
    sourceUrl:source.url,
    rawText,
    fetchedAt:new Date().toISOString(),
    requestedStartDate:START_DATE,
    requestedEndDate:END_DATE,
  });
  assert.equal(parsed.responseRangeVerified,true);
  assert.equal(parsed.parserComplete,true);

  const unique=new Map();
  for(const event of parsed.events
    .filter((x)=>x.symbol && x.effectiveDate)
    .sort((a,b)=>a.effectiveDate.localeCompare(b.effectiveDate)||a.symbol.localeCompare(b.symbol))
  ){
    const key=event.symbol+"|"+YEAR;
    if(EXCLUDE.has(key)) continue;
    if(!unique.has(key)){
      unique.set(key,{
        sourceId:SOURCE_ID,
        actionFamilyId:ACTION_FAMILY_ID,
        symbol:event.symbol,
        eventYear:YEAR,
        rocYear:ROC_YEAR,
        officialEffectiveDate:event.effectiveDate,
        officialEventVersionId:event.eventVersionId,
      });
    }
  }
  const all=[...unique.values()];
  return {
    officialEventCount:parsed.eventCount,
    totalUniqueOfficialCandidateCount:all.length,
    candidates:all.slice(CANDIDATE_OFFSET,Math.min(all.length,CANDIDATE_OFFSET+CANDIDATE_CAP)),
  };
}

function inspectCandidate(candidate,html){
  const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({
    html,stockCode:candidate.symbol,expectedDate:null,baseSubject:null,
  });

  const actionRows=(parsed.rows||[])
    .filter((row)=>{
      const text=String(row.rowText||"");
      if(!/除權|除息|除權息|配息|現金股利|股票股利|股利分派|盈餘分配|分派.*股利/.test(text)) return false;
      if(/減資|減資換股|換股|面額變更|每股面額/.test(text)) return false;
      if(/代.*子公司|子公司/.test(text)) return false;
      return true;
    })
    .map((row)=>{
      const subject=stripRowPrefix(row.rowText,candidate.symbol);
      return {
        date:row.date,time:row.time,seqNo:row.seqNo,
        correctionOrCancellationHint:row.correctionOrCancellationHint===true,
        directOperationalSemantics:/除權|除息|除權息|基準日/.test(subject),
        subject,stem:normalizeSubject(subject),rowText:row.rowText,
      };
    })
    .sort((a,b)=>versionKey(a).localeCompare(versionKey(b)));

  const directRevisions=actionRows.filter((x)=>
    x.correctionOrCancellationHint &&
    x.directOperationalSemantics
  );

  const chains=[];
  for(const revision of directRevisions){
    const prior=actionRows.filter((x)=>
      !x.correctionOrCancellationHint &&
      x.directOperationalSemantics &&
      versionKey(x)<versionKey(revision) &&
      compatibleStem(x.stem,revision.stem)
    );
    for(const original of prior){
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
    directOperationalCorrectionRowCount:directRevisions.length,
    strictChainCount:distinct.size,
    strictRepresentativeCandidateObserved:distinct.size>0,
    chains:[...distinct.values()].slice(0,10),
    actionRows:actionRows.slice(0,50),
  };
}

const official=await officialCandidates();
const inspected=[];
let stoppedEarly=false;
for(let i=0;i<official.candidates.length;i+=1){
  const candidate=official.candidates[i];
  const row={...candidate,...inspectCandidate(candidate,await fetchMopsYear(candidate.symbol))};
  inspected.push(row);
  if(row.strictRepresentativeCandidateObserved){
    stoppedEarly=true;
    break;
  }
  if(i<official.candidates.length-1) await sleep(400);
}

const positives=inspected.filter((x)=>x.strictRepresentativeCandidateObserved);
const result={
  schemaVersion:"S2_STRICT_TPEX_EX_RIGHT_DIVIDEND_REVISION_DISCOVERY_V0_4",
  observedAt:new Date().toISOString(),
  sourceId:SOURCE_ID,
  officialEventCount:official.officialEventCount,
  totalUniqueOfficialCandidateCount:official.totalUniqueOfficialCandidateCount,
  candidateOffset:CANDIDATE_OFFSET,
  candidateCap:CANDIDATE_CAP,
  candidateEndExclusive:Math.min(official.totalUniqueOfficialCandidateCount,CANDIDATE_OFFSET+CANDIDATE_CAP),
  queriedCandidateCount:inspected.length,
  stoppedEarly,
  positiveCandidateCount:positives.length,
  positiveCandidateSymbols:positives.map((x)=>x.symbol),
  positives,
  inspected,
  state:positives.length>0
    ?"STRICT_DIRECT_EXRIGHT_DIVIDEND_REVISION_CANDIDATE_OBSERVED"
    :"STRICT_DIRECT_EXRIGHT_DIVIDEND_DISCOVERY_NEGATIVE",

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

assert.equal(result.discoveryOnly,true);
assert.equal(result.representativeControlsFrozen,false);
assert.equal(result.revisionCoverageComplete,false);
assert.equal(result.selectionAuthority,false);
assert.equal(result.system1RuntimeUsed,false);

console.log(JSON.stringify({
  result:positives.length>0
    ?"STRICT_DIRECT_EXRIGHT_DIVIDEND_REVISION_CANDIDATE_OBSERVED"
    :"STRICT_DIRECT_EXRIGHT_DIVIDEND_DISCOVERY_NEGATIVE",
  ...result,
},null,2));
