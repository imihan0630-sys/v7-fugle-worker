// DATA_LANE #1068. Bounded original public Archive.org/CommonCrawl index discovery ONLY.
// An index row is a CANDIDATE, never authenticated WARC content or historical PIT.
import {createHash} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";

const sha=(x)=>createHash("sha256").update(x).digest("hex");
const MONEYDJ="https://www.moneydj.com/kmdj/news/newsviewer.aspx?a=47f2fecb-1aa2-4172-9876-1dba02ca9612";
const CSUN="https://www.csun.com.tw/investor_news/%E5%85%AC%E5%91%8A%E6%9C%AC%E5%85%AC%E5%8F%B8%E9%99%A4%E6%81%AF%E5%9F%BA%E6%BA%96%E6%97%A5%E7%AD%89%E7%9B%B8%E9%97%9C%E4%BA%8B%E5%AE%9C%E6%9B%B4%E6%AD%A3/";
export const SOURCE_URLS=Object.freeze({MONEYDJ,CSUN});
export const ARCHIVE_PROBES=Object.freeze([
  Object.freeze({id:"WAYBACK_MONEYDJ",provider:"WAYBACK_CDX",original:MONEYDJ,from:"20260522",to:"20260630"}),
  Object.freeze({id:"WAYBACK_ISSUER_CORRECTION",provider:"WAYBACK_CDX",original:CSUN,from:"20260522",to:"20260630"}),
  Object.freeze({id:"CC_2026_25_MONEYDJ",provider:"COMMON_CRAWL_CDX",crawl:"CC-MAIN-2026-25",original:MONEYDJ,from:"20260522",to:"20260630"}),
  Object.freeze({id:"CC_2026_26_MONEYDJ",provider:"COMMON_CRAWL_CDX",crawl:"CC-MAIN-2026-26",original:MONEYDJ,from:"20260522",to:"20260630"})
]);
export function buildArchiveUrlV0_1(probe){
  if(!ARCHIVE_PROBES.some(v=>v.id===probe?.id&&v.original===probe.original))throw Error("UNREGISTERED_ARCHIVE_PROBE");
  const q=new URLSearchParams({url:probe.original,output:"json"});
  if(probe.provider==="WAYBACK_CDX"){
    q.set("from",probe.from);q.set("to",probe.to);q.set("filter","statuscode:200");q.set("limit","30");
    return "https://web.archive.org/cdx/search/cdx?"+q.toString();
  }
  if(probe.provider==="COMMON_CRAWL_CDX"&&/^CC-MAIN-2026-\d{2}$/.test(probe.crawl))
    return "https://index.commoncrawl.org/"+probe.crawl+"-index?"+q.toString();
  throw Error("UNTRUSTED_ARCHIVE_INDEX");
}
const archiveTime=(v)=>typeof v==="string"&&/^2026\d{10}$/.test(v)&&
  Number.isFinite(Date.parse(v.slice(0,4)+"-"+v.slice(4,6)+"-"+v.slice(6,8)+"T"+v.slice(8,10)+":"+v.slice(10,12)+":"+v.slice(12,14)+"Z"));
function originalMatch(url,required){
  try{
    const u=new URL(url),v=new URL(required);
    // http original URL accepted only for archive capture, never a live HTTP fetch.
    if(!["http:","https:"].includes(u.protocol))return false;
    return u.hostname.toLowerCase()===v.hostname.toLowerCase()&&
      decodeURIComponent(u.pathname)===decodeURIComponent(v.pathname)&&
      u.searchParams.get("a")===v.searchParams.get("a");
  }catch{return false}
}
function normalizeIndexRows(raw,provider){
  if(provider==="WAYBACK_CDX"){
    const parsed=JSON.parse(raw);
    if(!Array.isArray(parsed))throw Error("WAYBACK_ROWS_INVALID");
    if(parsed.length===0)return [];
    const header=parsed[0];
    if(!Array.isArray(header)||!header.includes("timestamp")||!header.includes("original"))throw Error("WAYBACK_CDX_HEADER_UNKNOWN");
    return parsed.slice(1).map(row=>Object.fromEntries(header.map((k,i)=>[k,row[i]])));
  }
  if(provider==="COMMON_CRAWL_CDX"){
    if(!raw.trim())return [];
    return raw.trim().split("\n").filter(Boolean).slice(0,40).map(line=>JSON.parse(line));
  }
  throw Error("INDEX_PROVIDER_UNKNOWN");
}
export function verifyArchiveIndexPayloadV0_1({probe,httpStatus,body,observedAtUtc}){
 if(!ARCHIVE_PROBES.some(x=>x.id===probe?.id&&x.original===probe.original))throw Error("INVALID_PROBE");
 if(!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(observedAtUtc||""))throw Error("NO_REAL_OBSERVATION");
 if(!Number.isSafeInteger(httpStatus)||httpStatus<100||httpStatus>599)throw Error("INVALID_HTTP_STATUS");
 if(typeof body!=="string"||Buffer.byteLength(body)>1024*1024)throw Error("OVERSIZED_ARCHIVE_INDEX_RESPONSE");
 let rows=[];
 let interpretation;
 if(httpStatus===404||httpStatus===204)interpretation="INDEX_NO_RECORDS_REPORTED";
 else if(httpStatus===200){
   try{rows=normalizeIndexRows(body,probe.provider);interpretation=rows.length?"INDEX_RECORDS_REPORTED":"INDEX_NO_RECORDS_REPORTED"}
   catch{interpretation="INDEX_RESPONSE_MALFORMED_OR_UNSUPPORTED";}
 }else interpretation="INDEX_UNAVAILABLE_OR_ACCESS_DENIED";
 const validated=[];
 for(const row of rows.slice(0,40)){
   const status=String(row.statuscode??row.status??"");
   const dt=String(row.timestamp??"");
   const url=String(row.original??row.url??"");
   const digest=String(row.digest??"");
   const mime=String(row.mimetype??row.mime??"");
   if(status!=="200"||!archiveTime(dt)||!originalMatch(url,probe.original)||
      dt.slice(0,8)<probe.from||dt.slice(0,8)>probe.to||!/(html|json)/i.test(mime)||
      !/^[A-Z0-9]{32,64}$/i.test(digest))continue;
   validated.push({archiveTimestampUtc:dt,originalUrlExactMatch:true,originalHttpStatus:200,
     archiveIndexMime:mime,archiveIndexDigest:digest,
     archivalCaptureIndexOnly:true,originalWarcPayloadDownloaded:false,
     originalArticleBodyContentShaMatched:false,originalRevisionIdentityCompared:false,
     historicalPublishedAtAuthenticated:false,historicalFirstKnownAt:null,
     historicalAvailableAt:null,pitCertified:false});
 }
 const unique=Array.from(new Map(validated.map(x=>[x.archiveTimestampUtc+"|"+x.archiveIndexDigest,x])).values());
 return {probeId:probe.id,archiveProvider:probe.provider,archiveOriginalUrl:probe.original,
   indexHttpStatus:httpStatus,indexResponseSha256:sha(Buffer.from(body,"utf8")),
   indexResponseBytes:Buffer.byteLength(body),observedAtUtc,interpretation,
   rawIndexRecordCount:rows.length,verifiedShapeCandidateCount:unique.length,
   archiveIndexCandidates:unique.slice(0,10),
   originalWarcBytesAuthenticated:false,historicalPITCertified:false,
   archiveIndexNegativeIsProofOfNoHistoricalPublication:false};
}
export function summarizeArchiveIndexEvidenceV0_1(results){
 if(!Array.isArray(results)||results.length!==ARCHIVE_PROBES.length||
    new Set(results.map(v=>v.probeId)).size!==results.length||
    !ARCHIVE_PROBES.every(p=>results.some(r=>r.probeId===p.id)))throw Error("PROBE_RESULTS_INCOMPLETE");
 if(results.some(r=>r.historicalPITCertified!==false||r.originalWarcBytesAuthenticated!==false||
    r.archiveIndexCandidates?.some(x=>x.pitCertified!==false||x.historicalAvailableAt!==null)))
    throw Error("UNQUALIFIED_PIT_PROMOTION");
 return {schemaVersion:"S2_DATA_ISSUE1068_WARC_CDX_HISTORICAL_AVAILABILITY_INDEX_V0_1",
  state:"PUBLIC_ARCHIVE_INDEX_PROBE_ONLY__WARC_CONTENT_NOT_YET_AUTHENTICATED",
  sourceMopsClockFamily:"2467 ORIGINAL_2026_05_22_AND_CORRECTION",
  archiveIndexRequests:results.length,
  archiveIndexCandidatesCount:results.reduce((n,r)=>n+r.verifiedShapeCandidateCount,0),
  originalWarcsDownloadedAndHashed:0,
  originalVersionPayloadHashMatched:0,historicalExactFirstKnownAtCertified:0,
  historicalPITCertifiedCount:0,
  historicalPITCandidateIndexRowsAreNotAdmissibleWithoutWarcContent:true,
  missingIndexRecordIsNotProofOfNoEvent:true,
  timezoneOrOriginalPublicClockImputed:false,
  currentProviderIndexQueryCannotBeBackdated:true,
  system1FormalTouched:false,cloudflareD1Reads:0,cloudflareD1Writes:0,
  paidResourcesAdded:0,results};
}
async function live(){
 const results=[];
 for(const p of ARCHIVE_PROBES){
   const url=buildArchiveUrlV0_1(p);const start=new Date().toISOString();
   let status=599,body="",error=null;
   try{
     const r=await fetch(url,{headers:{"accept":"application/json,text/plain,*/*",
       "user-agent":"System2-DATA-Archive-Candidate-Probe/0.1"},signal:AbortSignal.timeout(16000)});
     status=r.status;
     const len=Number(r.headers.get("content-length")||"0");
     if(len>1024*1024)throw Error("PROVIDER_CONTENT_LENGTH_OVER_LIMIT");
     const bytes=Buffer.from(await r.arrayBuffer());
     if(bytes.length>1024*1024)throw Error("PROVIDER_BODY_OVER_LIMIT");
     body=bytes.toString("utf8");
   }catch(e){error=String(e?.message||"FETCH_ERROR").slice(0,100)}
   let record;
   try{record=verifyArchiveIndexPayloadV0_1({probe:p,httpStatus:status,body,observedAtUtc:start})}
   catch(e){record={probeId:p.id,archiveProvider:p.provider,indexHttpStatus:status,
      observedAtUtc:start,interpretation:"INDEX_PARSE_OR_FETCH_FAILED",
      rawIndexRecordCount:0,verifiedShapeCandidateCount:0,archiveIndexCandidates:[],
      originalWarcBytesAuthenticated:false,historicalPITCertified:false,
      archiveIndexNegativeIsProofOfNoHistoricalPublication:false}}
   record.fetchError=error;results.push(record);
 }
 return summarizeArchiveIndexEvidenceV0_1(results);
}
const output="/tmp/s2-issue1068-archive-index/sanitized-cdx-index-probe.json";
if(import.meta.url===new URL("file://"+process.argv[1]).href){
 let receipt;
 try{receipt=await live()}
 catch(e){receipt={schemaVersion:"S2_DATA_ISSUE1068_WARC_CDX_HISTORICAL_AVAILABILITY_INDEX_V0_1",
  state:"FAIL_CLOSED",historicalPITCertifiedCount:0,error:String(e?.message||"").slice(0,100)};process.exitCode=2}
 await mkdir("/tmp/s2-issue1068-archive-index",{recursive:true,mode:0o700});
 await writeFile(output,JSON.stringify(receipt,null,2)+"\n",{mode:0o600});
 console.log(JSON.stringify({state:receipt.state,
  indexStatus:receipt.results?.map(x=>({source:x.probeId,status:x.indexHttpStatus,candidates:x.verifiedShapeCandidateCount,
   interpretation:x.interpretation,error:x.fetchError}))??[],
  historicalPIT:receipt.historicalPITCertifiedCount}));
}
