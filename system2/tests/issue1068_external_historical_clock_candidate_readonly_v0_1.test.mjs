import test from "node:test";
import assert from "node:assert/strict";
import {CONTROL,SOURCES,evaluateExternalClockCandidateV0_1,summarizeExternalCandidatesV0_1}
 from "../migration/issue1068_external_historical_clock_candidate_readonly_v0_1.mjs";
const at="2026-10-15T13:00:00.000Z";
const money='<html><body><h1>志聖 公告本公司除息基準日等相關事宜</h1>人氣(0) 2026/05/22 16:37 公開資訊觀測站重大訊息公告 '+("說明 ".repeat(55))+'</body></html>';
const issuer='<html><body><h1>公告本公司除息基準日等相關事宜(更正)</h1><p>115/05/22</p><table>發言日期 115/05/22 發言時間 17:42:13</table>'+("說明 ".repeat(55))+'</body></html>';
const mk=(s,html)=>evaluateExternalClockCandidateV0_1({source:s,finalUrl:s.url,rawHtml:html,observedAtUtc:at});
const positive=[mk(SOURCES[0],money),mk(SOURCES[1],issuer)];
test("positive: bounded source publisher article + issuer revision are only claims, PIT stays zero",()=>{
 const out=summarizeExternalCandidatesV0_1(positive);
 assert.equal(CONTROL.originalMopsSourceReportedAt,"2026-05-22T16:34:06+08:00");
 assert.equal(CONTROL.correctionMopsSourceReportedAt,"2026-05-22T17:42:13+08:00");
 assert.equal(out.externalSourcesChecked,2);
 assert.equal(out.versionCandidatesObserved,2);
 assert.equal(out.historicalPublicAvailabilityVerifiedVersions,0);
 assert.equal(out.historicalExactFirstKnownAtVerifiedVersions,0);
 assert.equal(out.currentRetrospectiveHTTPGetNotHistoricalCapture,true);
 assert.equal(out.automaticPITPromotion,false);
 for(const v of out.items){
   assert.equal(v.firstKnownAt,null);assert.equal(v.availableAt,null);
   assert.equal(v.reportClockTimeZone,"UNKNOWN_SOURCE_UI_CLOCK_NOT_ATTESTED");
   assert.equal(v.historicalPITCertified,false);
   assert.equal(v.originalIndependentWarcCaptureBeforeCutoffVerified,false);
   assert.equal(v.sourceSystem1FormalCoreTouched,false);
 }
});
for(const [name, source, html, fields] of [
 ["untrusted host",SOURCES[0],money,{finalUrl:"https://untrusted.example/article"}],
 ["HTTP 403",SOURCES[0],money,{httpStatus:403}],
 ["no actual capture clock",SOURCES[0],money,{observedAtUtc:"not-a-date"}],
 ["retro capture masquerades as May",SOURCES[0],money,{observedAtUtc:"2026-05-22T08:40:00Z"}],
 ["missing publisher",SOURCES[0],money.replace("志聖","UNKNOWN"),{}],
 ["fabricated publisher article clock",SOURCES[0],money.replace("16:37","16:34"),{}],
 ["bogus publisher article",SOURCES[0],money.replace(CONTROL.materialFamily,"unrelated news"),{}],
 ["bad original version",SOURCES[1],issuer.replace("更正",""),{}],
 ["forged issuer correction clock",SOURCES[1],issuer.replace("17:42:13","17:41:13"),{}],
 ["issuer absent reported date",SOURCES[1],issuer.replace("發言日期 115/05/22","發言日期 115/05/23"),{}]
]){
 test("failclosed: "+name,()=>{
  assert.throws(()=>evaluateExternalClockCandidateV0_1({
   source,finalUrl:source.url,rawHtml:html,observedAtUtc:at,...fields
  }),/S2_HISTORICAL_EXTERNAL_CLOCK/);
 });
}
for(const [name,fn] of [
 ["invented independent archive witness",v=>v[0].originalIndependentWarcCaptureBeforeCutoffVerified=true],
 ["invented historical firstKnownAt",v=>v[0].firstKnownAt="2026-05-22T08:37:00Z"],
 ["invented historical availableAt",v=>v[0].availableAt="2026-05-22T08:37:00Z"],
 ["fake PIT promotion",v=>v[1].historicalPITCertified=true],
 ["silently dropped second source",v=>v.pop()]
]){
 test("prevent false historical PIT: "+name,()=>{
  const c=structuredClone(positive);fn(c);
  assert.throws(()=>summarizeExternalCandidatesV0_1(c),/S2_HISTORICAL_EXTERNAL_CLOCK/);
 });
}
test("ambiguous 05:45 publication display cannot be converted into precise Asia/Taipei without timezone",()=>{
 const s=structuredClone(SOURCES[0]);
 const bogus=money.replace("16:37","05:45");
 assert.throws(()=>evaluateExternalClockCandidateV0_1({
   source:s,finalUrl:s.url,rawHtml:bogus,observedAtUtc:at
 }),/EXPECTED_ORIGINAL_PUBLISHER_DISPLAY_CLOCK_MISSING/);
});
