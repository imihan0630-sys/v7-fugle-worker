import assert from "node:assert/strict";
import { spawnSync, execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { buildOfficialContinuitySourceUrlsV0_1 } from "../runtime/official_continuity_source_capability_v0_1.mjs";
import { parseOfficialHistoricalContinuityPayloadV0_1 } from "../runtime/official_continuity_event_parser_v0_1.mjs";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";
import {
  buildMopsMaterialDetailRequestV0_1,
  parseMopsMaterialDetailHtmlV0_1,
} from "../runtime/mops_material_detail_source_capability_v0_1.mjs";
import { buildBoundedEventVersionLinkageV0_1 } from "../runtime/bounded_event_version_linkage_v0_1.mjs";

const START="2026-04-05";
const END="2026-10-02";
const YEARS=[2025,2026];
const MOPS_URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const LOW_LANES=[
  "TWSE_CAPITAL_REDUCTION_REFERENCE",
  "TWSE_PAR_VALUE_CHANGE_REFERENCE",
  "TPEX_CAPITAL_REDUCTION_REFERENCE",
  "TPEX_PAR_VALUE_CHANGE_REFERENCE",
];

function sleep(ms){ return new Promise((resolve)=>setTimeout(resolve,ms)); }
function sha256(value){ return createHash("sha256").update(String(value)).digest("hex"); }

function familyRows(rows,family){
  if(family==="CAPITAL_REDUCTION"){
    return rows.filter((row)=>/減資/.test(String(row.rowText||"")));
  }
  return rows.filter((row)=>{
    const text=String(row.rowText||"");
    if(/財務報告|合併財務|個體財務|每股盈餘|每股淨值/.test(text)) return false;
    return /股票面額變更|變更股票面額|變更.*股票面額|每股面額變更|面額變更.*換發|換發.*股票面額/.test(text);
  });
}

function fetchMopsYear(stockCode,rocYear){
  const args=[
    "--fail","--silent","--show-error","--location","--http1.1","--compressed",
    "--connect-timeout","10","--max-time","30",
    "--retry","2","--retry-delay","1","--retry-all-errors",
    "--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
    "--header","Accept-Language: zh-TW,zh;q=0.9,en;q=0.6",
    "--data-urlencode","firstin=1",
    "--data-urlencode","step=1",
    "--data-urlencode","TYPEK=all",
    "--data-urlencode","co_id="+stockCode,
    "--data-urlencode","year="+rocYear,
    "--data-urlencode","month=all",
    "--data-urlencode","b_date=",
    "--data-urlencode","e_date=",
    "--write-out","\n__STATUS__:%{http_code}\n",
    MOPS_URL,
  ];
  const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
  if(p.error) throw p.error;
  if(p.status!==0) return {ok:false,httpStatus:0,rows:[],error:String(p.stderr||"").slice(0,500)};
  const marker="\n__STATUS__:";
  const pos=p.stdout.lastIndexOf(marker);
  if(pos<0) return {ok:false,httpStatus:0,rows:[],error:"status marker missing"};
  const html=p.stdout.slice(0,pos);
  const status=Number(p.stdout.slice(pos).match(/__STATUS__:(\d+)/)?.[1]||0);
  let parsed;
  try{
    parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({
      html,stockCode,expectedDate:null,baseSubject:null,
    });
  }catch(error){
    return {ok:false,httpStatus:status,rows:[],error:String(error?.message||error)};
  }
  return {ok:status===200,httpStatus:status,rows:[...(parsed.rows||[])],rowCount:parsed.rowCount};
}

function detailIdentityKey(row){
  return [
    row?.stockCode||"",
    row?.spokeDateRaw||"",
    row?.spokeTimeRaw||"",
    row?.seqNo||"",
    row?.typek||"all",
  ].join("|");
}

function curlDetail(url){
  return new Promise((resolve)=>{
    const marker="\n__STATUS__:";
    execFile("curl",[
      "--silent","--show-error","--location","--http1.1","--compressed",
      "--connect-timeout","10","--max-time","30",
      "--retry","2","--retry-delay","1","--retry-all-errors",
      "--header","User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
      "--header","Accept: text/html,application/xhtml+xml,*/*;q=0.8",
      "--header","Accept-Language: zh-TW,zh;q=0.9,en;q=0.6",
      "--write-out","\n__STATUS__:%{http_code}\n",
      url,
    ],{encoding:"utf8",maxBuffer:32*1024*1024},(error,stdout,stderr)=>{
      const raw=String(stdout||"");
      const pos=raw.lastIndexOf(marker);
      const body=pos>=0?raw.slice(0,pos):raw;
      const status=pos>=0?Number(raw.slice(pos+marker.length).trim()):0;
      resolve({
        ok:!error&&status===200,
        status,
        body,
        error:error?String(stderr||error.message||error).slice(0,1000):null,
      });
    });
  });
}

async function fetchDetailEvidence(row){
  if(!row?.stockCode||!row?.spokeDateRaw||!row?.spokeTimeRaw||!row?.seqNo){
    return {
      detailTransportReady:false,
      detailIdentityObserved:false,
      detailBodyDateTokens:[],
      detailBodyTextHash:null,
      detailPayloadHash:null,
      detailTransportMode:"T05ST01_STEP2_GET_CURL",
      detailError:"DETAIL_IDENTITY_KEY_INCOMPLETE",
    };
  }
  let request;
  try{
    request=buildMopsMaterialDetailRequestV0_1({
      stockCode:row.stockCode,
      spokeDateRaw:row.spokeDateRaw,
      spokeTimeRaw:row.spokeTimeRaw,
      seqNo:row.seqNo,
      typek:row.typek||"all",
    });
  }catch(error){
    return {
      detailTransportReady:false,
      detailIdentityObserved:false,
      detailBodyDateTokens:[],
      detailBodyTextHash:null,
      detailPayloadHash:null,
      detailTransportMode:"T05ST01_STEP2_GET_CURL",
      detailError:String(error?.message||error),
    };
  }

  const response=await curlDetail(request.url);
  if(!response.ok){
    return {
      detailTransportReady:false,
      detailIdentityObserved:false,
      detailBodyDateTokens:[],
      detailBodyTextHash:null,
      detailPayloadHash:response.body?sha256(response.body):null,
      detailTransportMode:"T05ST01_STEP2_GET_CURL",
      detailError:response.error||("HTTP_"+response.status),
    };
  }

  try{
    const parsed=await parseMopsMaterialDetailHtmlV0_1({
      html:response.body,
      stockCode:row.stockCode,
      spokeDateRaw:row.spokeDateRaw,
      spokeTimeRaw:row.spokeTimeRaw,
      seqNo:row.seqNo,
    });
    return {
      detailTransportReady:true,
      detailIdentityObserved:parsed.identityObserved===true,
      detailBodyDateTokens:[...parsed.bodyDateTokens],
      detailBodyTextHash:parsed.bodyTextHash,
      detailPayloadHash:sha256(response.body),
      detailTransportMode:"T05ST01_STEP2_GET_CURL",
      detailError:parsed.identityObserved ? null : "DETAIL_IDENTITY_NOT_OBSERVED",
    };
  }catch(error){
    return {
      detailTransportReady:true,
      detailIdentityObserved:false,
      detailBodyDateTokens:[],
      detailBodyTextHash:null,
      detailPayloadHash:sha256(response.body),
      detailTransportMode:"T05ST01_STEP2_GET_CURL",
      detailError:String(error?.message||error),
    };
  }
}

async function mapLimit(items,limit,fn){
  const out=new Array(items.length);
  let cursor=0;
  async function worker(){
    while(true){
      const index=cursor;
      cursor+=1;
      if(index>=items.length) return;
      out[index]=await fn(items[index],index);
      await sleep(80);
    }
  }
  await Promise.all(Array.from({length:Math.min(limit,items.length)},()=>worker()));
  return out;
}

async function enrichFamilyRowsWithDetails(familyMap){
  const uniqueRows=new Map();
  for(const rows of Object.values(familyMap)){
    for(const row of rows){
      const key=detailIdentityKey(row);
      if(!uniqueRows.has(key)) uniqueRows.set(key,row);
    }
  }
  const entries=[...uniqueRows.entries()];
  const evidences=await mapLimit(entries,4,async ([key,row])=>[key,await fetchDetailEvidence(row)]);
  const evidenceMap=new Map(evidences);
  const enriched={};
  for(const [family,rows] of Object.entries(familyMap)){
    enriched[family]=rows.map((row)=>({
      ...row,
      ...(evidenceMap.get(detailIdentityKey(row))||{
        detailTransportReady:false,
        detailIdentityObserved:false,
        detailBodyDateTokens:[],
        detailBodyTextHash:null,
        detailPayloadHash:null,
        detailTransportMode:"T05ST01_STEP2_GET_CURL",
        detailError:"DETAIL_EVIDENCE_MISSING",
      }),
    }));
  }
  return enriched;
}

const urls=buildOfficialContinuitySourceUrlsV0_1({startDate:START,endDate:END});
const laneEvents={};

for(const sourceId of LOW_LANES){
  const source=urls[sourceId];
  const response=await fetch(source.url,{
    headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-Bounded-Event-Version-Linkage/0.1"},
    signal:AbortSignal.timeout(30000),
  });
  const rawText=await response.text();
  assert.equal(response.ok,true,sourceId+" HTTP "+response.status);
  const parsed=await parseOfficialHistoricalContinuityPayloadV0_1({
    sourceId,
    sourceUrl:source.url,
    rawText,
    fetchedAt:new Date().toISOString(),
    requestedStartDate:START,
    requestedEndDate:END,
  });
  assert.equal(parsed.responseRangeVerified,true,sourceId+" range");
  assert.equal(parsed.parserComplete,true,sourceId+" parser");
  laneEvents[sourceId]=parsed.events.map((event)=>({
    symbol:event.symbol,
    effectiveDate:event.effectiveDate,
    eventVersionId:event.eventVersionId,
  }));
}

const symbols=[...new Set(Object.values(laneEvents).flat().map((x)=>x.symbol))].sort();
const rawIssuerHistories={};

for(let si=0;si<symbols.length;si+=1){
  const symbol=symbols[si];
  const payloads=[];
  let transportReady=true;
  const allRows=[];
  for(let yi=0;yi<YEARS.length;yi+=1){
    const year=YEARS[yi];
    const result=fetchMopsYear(symbol,year-1911);
    payloads.push({
      year,
      httpStatus:result.httpStatus,
      rowCount:result.rowCount??0,
      ok:result.ok,
      error:result.error||null,
    });
    if(!result.ok) transportReady=false;
    allRows.push(...result.rows);
    if(!(si===symbols.length-1&&yi===YEARS.length-1)) await sleep(250);
  }
  const boundedRows=allRows.filter((row)=>row.date&&row.date<=END);
  rawIssuerHistories[symbol]={
    transportReady,
    queriedYears:[...YEARS],
    payloadCount:payloads.length,
    payloads,
    familyRowsByActionFamily:{
      CAPITAL_REDUCTION:familyRows(boundedRows,"CAPITAL_REDUCTION"),
      PAR_VALUE_CHANGE:familyRows(boundedRows,"PAR_VALUE_CHANGE"),
    },
  };
}

const uniqueDetailRows=new Map();
for(const history of Object.values(rawIssuerHistories)){
  for(const rows of Object.values(history.familyRowsByActionFamily)){
    for(const row of rows){
      const key=detailIdentityKey(row);
      if(!uniqueDetailRows.has(key)) uniqueDetailRows.set(key,row);
    }
  }
}
const detailEvidencePairs=await mapLimit(
  [...uniqueDetailRows.entries()],
  6,
  async ([key,row])=>[key,await fetchDetailEvidence(row)],
);
const detailEvidenceMap=new Map(detailEvidencePairs);

const issuerHistories={};
for(const [symbol,history] of Object.entries(rawIssuerHistories)){
  const enrichedFamilies={};
  for(const [family,rows] of Object.entries(history.familyRowsByActionFamily)){
    enrichedFamilies[family]=rows.map((row)=>({
      ...row,
      ...(detailEvidenceMap.get(detailIdentityKey(row))||{
        detailTransportReady:false,
        detailIdentityObserved:false,
        detailBodyDateTokens:[],
        detailBodyTextHash:null,
        detailPayloadHash:null,
        detailTransportMode:"T05ST01_STEP2_GET_CURL",
        detailError:"DETAIL_EVIDENCE_MISSING",
      }),
    }));
  }
  issuerHistories[symbol]={
    ...history,
    familyRowsByActionFamily:enrichedFamilies,
  };
}

const linkage=await buildBoundedEventVersionLinkageV0_1({
  startDate:START,
  endDate:END,
  laneEvents,
  issuerHistories,
  expectedQueryYears:YEARS,
  generatedAt:new Date().toISOString(),
});

assert.equal(linkage.requiredLaneCount,4);
assert.equal(linkage.finalEventCount,23);
assert.equal(linkage.revisionCoverageComplete,false);
assert.equal(linkage.knownAtVersionClockCertified,false);
assert.equal(linkage.selectionAuthority,false);
assert.equal(linkage.system1RuntimeUsed,false);

const concise=linkage.laneResults.map((lane)=>({
  sourceId:lane.sourceId,
  finalEventCount:lane.finalEventCount,
  queryIntegrityCompleteEventCount:lane.queryIntegrityCompleteEventCount,
  detailCoverageCompleteEventCount:lane.detailCoverageCompleteEventCount,
  negativeCompletenessInputReadyEventCount:lane.negativeCompletenessInputReadyEventCount,
  strictLinkedEventCount:lane.strictLinkedEventCount,
  unresolvedEventCount:lane.unresolvedEventCount,
  correctionHintEventCount:lane.correctionHintEventCount,
  cancellationHintEventCount:lane.cancellationHintEventCount,
  boundedEventVersionLinkageComplete:lane.boundedEventVersionLinkageComplete,
  events:lane.events.map((event)=>({
    symbol:event.symbol,
    effectiveDate:event.effectiveDate,
    state:event.state,
    boundedFamilyRowCount:event.boundedFamilyRowCount,
    detailReadyRowCount:event.detailReadyRowCount,
    detailCoverageComplete:event.detailCoverageComplete,
    negativeCompletenessInputReady:event.negativeCompletenessInputReady,
    strictLinkedRowCount:event.strictLinkedRowCount,
    listOnlyCandidateRowCount:event.listOnlyCandidateRowCount,
    strictChainCount:event.strictChainCount,
    strictChainAmbiguityCount:event.strictChainAmbiguityCount,
    ambiguousChains:event.strictChains
      .filter((chain)=>chain.state!=="CHAIN_OBSERVED")
      .map((chain)=>({
        state:chain.state,
        rowCount:chain.rowCount,
        originalCount:chain.originalCount,
        revisionHintCount:chain.revisionHintCount,
        cancellationHintCount:chain.cancellationHintCount,
        versionKeyComplete:chain.versionKeyComplete,
        duplicateVersionKeyCount:chain.duplicateVersionKeyCount,
        versionKeys:chain.versionKeys,
        subjectFingerprintHash:chain.subjectFingerprintHash,
      })),
    correctionHintCount:event.correctionHintCount,
    cancellationHintCount:event.cancellationHintCount,
    queryIntegrityState:event.queryIntegrityState,
    linkageHash:event.linkageHash,
  })),
}));

console.log(JSON.stringify({
  result:"LOW_VOLUME_BOUNDED_EVENT_VERSION_LINKAGE_COMPLETE",
  linkageUniverseHash:linkage.linkageUniverseHash,
  finalEventCount:linkage.finalEventCount,
  queryIntegrityCompleteEventCount:linkage.queryIntegrityCompleteEventCount,
  detailCoverageCompleteEventCount:linkage.detailCoverageCompleteEventCount,
  negativeCompletenessInputReadyEventCount:linkage.negativeCompletenessInputReadyEventCount,
  strictLinkedEventCount:linkage.strictLinkedEventCount,
  unresolvedEventCount:linkage.unresolvedEventCount,
  boundedEventVersionLinkageComplete:linkage.boundedEventVersionLinkageComplete,
  boundedRevisionHistoryCoverageComplete:linkage.boundedRevisionHistoryCoverageComplete,
  lanes:concise,
},null,2));
