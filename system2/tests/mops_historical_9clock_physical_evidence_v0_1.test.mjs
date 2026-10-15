import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const original=JSON.parse(readFileSync("system2/migration/evidence/S2_DATA_MOPS_HISTORICAL_NINE_VERSION_CLOCK_PHYSICAL_20261015_V0_1.json","utf8"));
function verify(x){
 assert.equal(x.schemaVersion,"S2_DATA_MOPS_HISTORICAL_SOURCE_CLOCK_NINE_VERSIONS_PHYSICAL_20261015_V0_1");
 assert.equal(x.realGitHubProviderRun.id,38735146839);
 assert.equal(x.realGitHubProviderRun.jobId,116422438931);
 assert.equal(x.realGitHubProviderRun.conclusion,"success");
 assert.equal(x.realGitHubProviderRun.sourceClockControlsPass,5);
 assert.equal(x.realGitHubProviderRun.sourceClockVersionsCount,9);
 assert.equal(x.realGitHubProviderRun.historicalPITCertifiedCount,0);
 assert.equal(x.originalArtifact.id,11972825813);
 assert.equal(x.originalArtifact.providerZipBytes,2402);
 assert.equal(x.originalArtifact.independentlyDownloadedZipBytes,2402);
 assert.equal(x.originalArtifact.providerZipSha256,
   "42550f6b423d19bf09bddbbff7abe587544d762c1ed7276953b04eb6f494a716");
 assert.equal(x.originalArtifact.providerZipSha256,x.originalArtifact.independentlyRecomputedZipSha256);
 assert.equal(x.originalArtifact.innerBytes,13576);
 assert.equal(x.originalArtifact.independentlyRecomputedInnerSha256,
   "9f766158637a3e61e5a8a9399546fe533f24b033079561bf495a03daebea57a9");
 assert.equal(x.originalArtifact.originalJsonIndependentlyDecodedAndParsed,true);
 assert.equal(x.realGitHubProviderRun.originalProducerLedgerSha256,
   "776baeb5f5b151baeb08503db3caeac3151bd6e1ba9b2ce5485b0540ba998064");
 assert.equal(x.exactHistoricalControls.length,5);
 assert.equal(x.sourceReportedVersions.length,9);
 assert.equal(x.exactHistoricalControls.reduce((sum,c)=>sum+c.n,0),9);
 const cset=new Set(x.exactHistoricalControls.map(c=>c.id));
 assert.equal(cset.size,5);
 for(const c of x.exactHistoricalControls){
   assert.match(c.sha,/^[0-9a-f]{64}$/);
   assert.match(c.observed,/^2026-10-15T12:30:/);
 }
 const k=new Set();
 for(const v of x.sourceReportedVersions){
   assert.ok(/^\d{4}$/.test(v.stockCode));
   assert.match(v.sourceReportedAt,/^2026-\d\d-\d\dT\d\d:\d\d:\d\d\+08:00$/);
   assert.ok(Date.parse(v.sourceReportedAt)<Date.parse("2026-10-15T12:30:00Z"));
   assert.equal(v.firstKnownAt,null);
   assert.equal(v.availableAt,null);
   assert.equal(v.historicalPublicAvailabilityProven,false);
   const id=v.stockCode+"|"+v.sourceReportedAt;
   assert.equal(k.has(id),false);
   k.add(id);
 }
 assert.equal(x.scope.exactOriginalHistoricalPublicAvailabilityVerifiedCount,0);
 assert.equal(x.scope.originalHistoricalFirstKnownAtCertifiedCount,0);
 assert.equal(x.scope.pitHistoricalDecisionEligibleCount,0);
 assert.equal(x.scope.unknownFirstKnownRetainedNull,true);
 assert.equal(x.scope.unknownAvailableAtRetainedNull,true);
 assert.equal(x.scope.fullRevisionCoverageCertified,false);
 assert.equal(x.scope.researchOutcomeJoinAuthorized,false);
 assert.equal(x.scope.cloudflareD1Writes,0);
 assert.equal(x.scope.cloudflareR2Writes,0);
 assert.equal(x.scope.system1FormalCoreUntouched,true);
 return true;
}
test("original MOPS source clocks admitted while every historical PIT authority stays explicitly denied",()=>assert.ok(verify(original)));
for(const [name,mutate] of [
 ["fake historical PIT count",v=>{v.scope.pitHistoricalDecisionEligibleCount=1}],
 ["fake historical public availability",v=>{v.scope.exactOriginalHistoricalPublicAvailabilityVerifiedCount=1}],
 ["invented first-known",v=>{v.sourceReportedVersions[0].firstKnownAt="2026-03-09T09:00:00Z"}],
 ["invented available-at",v=>{v.sourceReportedVersions[0].availableAt="2026-03-09T09:00:00Z"}],
 ["wrong original ZIP hash",v=>{v.originalArtifact.providerZipSha256="f".repeat(64)}],
 ["wrong independent ZIP hash",v=>{v.originalArtifact.independentlyRecomputedZipSha256="f".repeat(64)}],
 ["wrong first observation time",v=>{v.exactHistoricalControls[0].observed="2026-03-09T01:00:00Z"}],
 ["duplicated historical version",v=>{v.sourceReportedVersions[1]={...v.sourceReportedVersions[0]}}],
 ["missing historical version",v=>{v.sourceReportedVersions.pop()}],
 ["forged source clock outside frozen range",v=>{v.sourceReportedVersions[0].sourceReportedAt="2027-03-09T17:39:30+08:00"}],
 ["fake official source clock controls",v=>{v.realGitHubProviderRun.sourceClockControlsPass=4}],
 ["fake D1 write",v=>{v.scope.cloudflareD1Writes=1}],
 ["fake audit closure",v=>{v.scope.fullRevisionCoverageCertified=true}]
]){
 test("physical evidence failclosed: "+name,()=>{const v=structuredClone(original);mutate(v);assert.throws(()=>verify(v))});
}
