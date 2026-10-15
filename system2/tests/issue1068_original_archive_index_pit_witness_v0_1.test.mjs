import test from "node:test";
import assert from "node:assert/strict";
import {SOURCE_URLS,ARCHIVE_PROBES,buildArchiveUrlV0_1,
 verifyArchiveIndexPayloadV0_1,summarizeArchiveIndexEvidenceV0_1}
 from "../migration/issue1068_original_archive_index_probe_readonly_v0_1.mjs";
const utc="2026-10-15T14:15:00.000Z",digest="A".repeat(32);
const w=ARCHIVE_PROBES[0], cc=ARCHIVE_PROBES[2];
const headers=["urlkey","timestamp","original","mimetype","statuscode","digest","length"];
const row=["com,moneydj,www)/kmdj/news/newsviewer.aspx?a=47f2fecb-1aa2-4172-9876-1dba02ca9612","20260525142500",SOURCE_URLS.MONEYDJ,"text/html","200",digest,"9452"];
const way=JSON.stringify([headers,row]);
function check(probe,status=200,body=way){
 return verifyArchiveIndexPayloadV0_1({probe,httpStatus:status,body,observedAtUtc:utc});
}
test("valid archived 2026 May index candidate only, with PIT blocked",()=>{
 const x=check(w);assert.equal(x.interpretation,"INDEX_RECORDS_REPORTED");
 assert.equal(x.verifiedShapeCandidateCount,1);
 assert.equal(x.archiveIndexCandidates[0].archiveTimestampUtc,"20260525142500");
 assert.equal(x.archiveIndexCandidates[0].originalWarcPayloadDownloaded,false);
 assert.equal(x.archiveIndexCandidates[0].historicalAvailableAt,null);
 assert.equal(x.archiveIndexCandidates[0].pitCertified,false);
 assert.equal(x.historicalPITCertified,false);
 assert.equal(x.originalWarcBytesAuthenticated,false);
 assert.equal(x.archiveIndexNegativeIsProofOfNoHistoricalPublication,false);
});
test("CommonCrawl line-delimited exact original URL candidate only",()=>{
 const body=JSON.stringify({url:SOURCE_URLS.MONEYDJ,timestamp:"20260607123456",
  status:"200",mime:"text/html",digest})+"\n";
 const x=check(cc,200,body);assert.equal(x.verifiedShapeCandidateCount,1);
 assert.equal(x.archiveIndexCandidates[0].historicalAvailableAt,null);
});
test("404, 403, 429 and 502 are archive index status, not evidence of never-published",()=>{
 for(const status of [404,403,429,502]){
  const x=check(w,status,"no indexed material");
  assert.equal(x.verifiedShapeCandidateCount,0);
  assert.equal(x.archiveIndexNegativeIsProofOfNoHistoricalPublication,false);
  assert.equal(x.interpretation,status===404?"INDEX_NO_RECORDS_REPORTED":"INDEX_UNAVAILABLE_OR_ACCESS_DENIED");
 }
});
for(const [label,variant] of [
 ["wrong URL",row.map((x,i)=>i===2?"https://evil.example/page":x)],
 ["wrong publisher ID",row.map((x,i)=>i===2?SOURCE_URLS.MONEYDJ.replace("47f2fecb","47f3fecb"):x)],
 ["future capture",row.map((x,i)=>i===1?"20260701123456":x)],
 ["prepublication capture",row.map((x,i)=>i===1?"20260501123456":x)],
 ["non-HTML",row.map((x,i)=>i===3?"application/pdf":x)],
 ["response redirect",row.map((x,i)=>i===4?"301":x)],
 ["digest corrupt",row.map((x,i)=>i===5?"UNVERIFIED":x)],
 ["calendar invalid",row.map((x,i)=>i===1?"20260599090101":x)]
]){
 test("reject forged original archive index row: "+label,()=>{
  const x=check(w,200,JSON.stringify([headers,variant]));
  assert.equal(x.verifiedShapeCandidateCount,0);
  assert.equal(x.historicalPITCertified,false);
 });
}
test("malformed official CDX is UNKNOWN, not negative no-event",()=>{
 const x=check(w,200,'{"not":"cdx"}');
 assert.equal(x.interpretation,"INDEX_RESPONSE_MALFORMED_OR_UNSUPPORTED");
 assert.equal(x.archiveIndexNegativeIsProofOfNoHistoricalPublication,false);
});
test("HTTPS-only archive query endpoints from allowlisted sources",()=>{
 const urls=ARCHIVE_PROBES.map(buildArchiveUrlV0_1);
 assert.equal(urls.length,4);
 assert.ok(urls[0].startsWith("https://web.archive.org/cdx/search/cdx?"));
 assert.ok(urls[2].startsWith("https://index.commoncrawl.org/"));
 assert.throws(()=>buildArchiveUrlV0_1({id:"OTHER",original:SOURCE_URLS.MONEYDJ}),/UNREGISTERED/);
});
test("a valid candidate and three failures cannot promote historical PIT",()=>{
 const all=ARCHIVE_PROBES.map((p,i)=>
  i===0?check(p):check(p,429,"rate limited"));
 const x=summarizeArchiveIndexEvidenceV0_1(all);
 assert.equal(x.archiveIndexRequests,4);
 assert.equal(x.archiveIndexCandidatesCount,1);
 assert.equal(x.originalWarcsDownloadedAndHashed,0);
 assert.equal(x.historicalPITCertifiedCount,0);
 assert.equal(x.historicalExactFirstKnownAtCertified,0);
 assert.equal(x.currentProviderIndexQueryCannotBeBackdated,true);
 assert.equal(x.cloudflareD1Writes,0);
 assert.equal(x.system1FormalTouched,false);
});
test("PIT forgery or missing archived provider fails closed",()=>{
 const all=ARCHIVE_PROBES.map(p=>check(p,404,""));
 const y=structuredClone(all);y[0].historicalPITCertified=true;
 assert.throws(()=>summarizeArchiveIndexEvidenceV0_1(y),/UNQUALIFIED_PIT_PROMOTION/);
 const z=structuredClone(all);z[0].archiveIndexCandidates=[{historicalAvailableAt:"2026-05-22"}];
 assert.throws(()=>summarizeArchiveIndexEvidenceV0_1(z),/UNQUALIFIED_PIT_PROMOTION/);
 assert.throws(()=>summarizeArchiveIndexEvidenceV0_1(all.slice(1)),/PROBE_RESULTS_INCOMPLETE/);
});
