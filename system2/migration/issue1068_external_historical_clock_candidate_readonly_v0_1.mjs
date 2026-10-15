// DATA_LANE #1068: out-of-band historical MOPS timestamp cross-check.
// These are CURRENT retrospective HTTP GETs, NOT evidence of a historical first public retrieval.
import {createHash} from "node:crypto";
import {mkdir,writeFile} from "node:fs/promises";

export const CONTROL=Object.freeze({
 issuer:"2467",symbol:"志聖",
 originalMopsSourceReportedAt:"2026-05-22T16:34:06+08:00",
 correctionMopsSourceReportedAt:"2026-05-22T17:42:13+08:00",
 materialFamily:"公告本公司除息基準日等相關事宜"
});
export const SOURCES=Object.freeze([
 Object.freeze({
  id:"MONEYDJ_ORIGINAL_ARTICLE",domain:"www.moneydj.com",
  url:"https://www.moneydj.com/kmdj/news/newsviewer.aspx?a=47f2fecb-1aa2-4172-9876-1dba02ca9612",
  version:"ORIGINAL",origin:"INDEPENDENT_NEWS_REPUBLISHER",
  expectedDisplayedClock:"2026/05/22 16:37"
 }),
 Object.freeze({
  id:"ISSUER_CORRECTION_MIRROR",domain:"www.csun.com.tw",
  url:"https://www.csun.com.tw/investor_news/%E5%85%AC%E5%91%8A%E6%9C%AC%E5%85%AC%E5%8F%B8%E9%99%A4%E6%81%AF%E5%9F%BA%E6%BA%96%E6%97%A5%E7%AD%89%E7%9B%B8%E9%97%9C%E4%BA%8B%E5%AE%9C%E6%9B%B4%E6%AD%A3/",
  version:"CORRECTION",origin:"ISSUER_MIRROR_NOT_INDEPENDENT_FIRST_PUBLICATION",
  expectedDisplayedClock:"115/05/22 17:42:13"
 })
]);
const sha=s=>createHash("sha256").update(s).digest("hex");
const fail=c=>{throw Error("S2_HISTORICAL_EXTERNAL_CLOCK_"+c)};
const urlOk=(url,source)=>{
 try{const u=new URL(url);return u.protocol==="https:"&&u.hostname===source.domain&&
  u.username===""&&u.password===""&&u.port===""&&u.pathname===new URL(source.url).pathname&&u.search===new URL(source.url).search}
 catch{return false}
};
const htmlText=b=>String(b).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ")
 .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ")
 .replace(/<[^>]*>/g," ").replace(/&nbsp;|&#160;/gi," ")
 .replace(/&amp;/gi,"&").replace(/\s+/g," ").trim();

export function evaluateExternalClockCandidateV0_1({source,finalUrl,rawHtml,observedAtUtc,httpStatus=200}={}){
 if(!SOURCES.some(s=>s.id===source?.id&&s.url===source?.url))fail("UNREGISTERED_SOURCE");
 if(!urlOk(finalUrl,source))fail("UNTRUSTED_REDIRECT");
 if(!/^2026-10-15T\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(observedAtUtc||"")||
   !Number.isFinite(Date.parse(observedAtUtc)))fail("CAPTURE_CLOCK_INVALID");
 if(httpStatus!==200||typeof rawHtml!=="string"||rawHtml.length<150||rawHtml.length>3000000)fail("PAYLOAD_INVALID");
 const txt=htmlText(rawHtml);
 if(!txt.includes(CONTROL.materialFamily))fail("EVENT_VERSION_MISMATCH");
 let displayedClock=null,sourceClockConsistent=false;
 if(source.id==="MONEYDJ_ORIGINAL_ARTICLE"){
  const m=txt.match(/2026\s*\/\s*05\s*\/\s*22\s+16\s*:\s*37/);
  if(!m||!txt.includes("志聖"))fail("EXPECTED_ORIGINAL_PUBLISHER_DISPLAY_CLOCK_MISSING");
  displayedClock="2026-05-22T16:37:00"; // intentionally NO timezone!
  sourceClockConsistent=true; // consistent wall-clock order only, not actual public timestamp
 } else if(source.id==="ISSUER_CORRECTION_MIRROR"){
  if(!txt.includes("更正")||!/(?:發言時間)\s*17:42:13/.test(txt)||
   !/(?:發言日期)\s*115\/05\/22/.test(txt))fail("ISSUER_REVISED_CLOCK_MISMATCH");
  displayedClock="2026-05-22T17:42:13"; // timezone not independently attested by HTML
  sourceClockConsistent=true;
 } else fail("SOURCE_FAMILY_INVALID");
 return Object.freeze({
  sourceId:source.id,sourceDomain:source.domain,origin:source.origin,
  issuer:CONTROL.issuer,version:source.version,
  finalUrl,reportClockDisplayed:displayedClock,
  reportClockTimeZone:"UNKNOWN_SOURCE_UI_CLOCK_NOT_ATTESTED",
  reportClockOriginalHistoricalAvailabilityCertified:false,
  sourceReportedAt:source.version==="ORIGINAL"?CONTROL.originalMopsSourceReportedAt:CONTROL.correctionMopsSourceReportedAt,
  publisherClockCandidateConsistentWithMopsSource:sourceClockConsistent,
  claimOnlyNotOriginalImmutableCapture:true,
  captureAtUtc:observedAtUtc,rawHttpBodySha256:sha(Buffer.from(rawHtml,"utf8")),
  originalIndependentWarcCaptureBeforeCutoffVerified:false,
  originalContentMatchedToArchivedMopsVersion:false,
  verifiedHistoricalAvailableByDecisionTime:false,
  firstKnownAt:null,availableAt:null,
  historicalPITCertified:false,
  shadowBacktestAdmissionAuthorized:false,
  sourceSystem1FormalCoreTouched:false,cloudflareD1Queries:0,cloudflareD1Writes:0
 });
}
export function summarizeExternalCandidatesV0_1(candidates){
 if(!Array.isArray(candidates)||candidates.length!==SOURCES.length||
   new Set(candidates.map(x=>x.sourceId)).size!==SOURCES.length)fail("SOURCES_INCOMPLETE");
 if(!SOURCES.every(s=>candidates.some(c=>c.sourceId===s.id)))fail("EXPECTED_SOURCES_INCOMPLETE");
 if(candidates.some(c=>c.historicalPITCertified||c.firstKnownAt!==null||c.availableAt!==null||
   c.originalIndependentWarcCaptureBeforeCutoffVerified!==false||
   c.originalContentMatchedToArchivedMopsVersion!==false))fail("PIT_AUTHORITY_FORGED");
 return Object.freeze({
  schemaVersion:"S2_DATA_ISSUE1068_EXTERNAL_DISCLOSURE_CLOCK_CANDIDATE_V0_1",
  status:"EXTERNAL_HISTORICAL_PUBLISHER_CLOCK_CANDIDATES_FOUND__NO_ORIGINAL_IMMUTABLE_CAPTURE__PIT_UNKNOWN",
  issuer:"2467",referenceMaterialFamily:CONTROL.materialFamily,
  externalSourcesChecked:candidates.length,versionCandidatesObserved:candidates.length,
  contemporaneousImmutableOriginalWebArchiveWitnessesVerified:0,
  historicalPublicAvailabilityVerifiedVersions:0,
  historicalExactFirstKnownAtVerifiedVersions:0,
  sourceReportedClockCannotBeSubstitutedForAvailableAt:true,
  currentRetrospectiveHTTPGetNotHistoricalCapture:true,
  normalizedTimeZoneNotInvented:true,correctionVersionNotBackdated:true,
  sourceD1RowsRead:0,sourceD1RowsWritten:0,destinationD1RowsWritten:0,
  system1FormalTouched:false,automaticPITPromotion:false,
  items:candidates
 });
}

async function actualGet(source){
 const res=await fetch(source.url,{
  method:"GET",redirect:"follow",headers:{"user-agent":"System2-DATA-Research-Historical-PIT-ReadOnly/0.1","accept":"text/html"},
  signal:AbortSignal.timeout(30000)
 });
 const array=await res.arrayBuffer();
 if(array.byteLength>3000000)fail("HTTP_BYTES_OVER_LIMIT");
 if(res.status!==200)fail("SOURCE_HTTP_NOT_200");
 const raw=Buffer.from(array);
 // Use original real HTTP bytes SHA; UTF-8 text is only for DOM content recognition.
 const evaluated=evaluateExternalClockCandidateV0_1({
  source,finalUrl:res.url,rawHtml:raw.toString("utf8"),
  observedAtUtc:new Date().toISOString(),httpStatus:res.status
 });
 return {...evaluated,rawHttpBodySha256:sha(raw),
  httpResponseDateHeader:res.headers.get("date")||null,
  httpResponseDateHeaderIsHistoricalClock:false,
  originalHttpResponseBytes:raw.length};
}
export async function runOriginalSourceReadOnly(){
 const list=[];
 for(const source of SOURCES)list.push(await actualGet(source));
 return summarizeExternalCandidatesV0_1(list);
}
const path="/tmp/s2-issue1068-external-pit-clock/sanitized-external-clock-candidates.json";
if(process.argv[1]&&import.meta.url===new URL("file://"+process.argv[1]).href){
 let out={schemaVersion:"S2_DATA_ISSUE1068_EXTERNAL_DISCLOSURE_CLOCK_CANDIDATE_V0_1",
  status:"FAIL_CLOSED_EXTERNAL_PIT_CLOCK_NOT_CERTIFIED",historicalPublicAvailabilityVerifiedVersions:0,
  historicalExactFirstKnownAtVerifiedVersions:0,system1FormalTouched:false,
  sourceD1RowsRead:0,sourceD1RowsWritten:0,destinationD1RowsWritten:0};
 try{out=await runOriginalSourceReadOnly()}
 catch(e){out.error=String(e?.message||"").startsWith("S2_HISTORICAL_EXTERNAL_CLOCK_")?String(e.message):"SOURCE_HTTP_OR_PROVIDER_FAILURE";process.exitCode=2}
 finally{
  await mkdir("/tmp/s2-issue1068-external-pit-clock",{recursive:true,mode:0o700});
  await writeFile(path,JSON.stringify(out,null,2)+"\n",{mode:0o600});
  console.log(JSON.stringify({status:out.status,candidates:out.versionCandidatesObserved??0,
   historicalPIT:out.historicalPublicAvailabilityVerifiedVersions,
   D1Writes:out.destinationD1RowsWritten,error:out.error||null}));
 }
}
