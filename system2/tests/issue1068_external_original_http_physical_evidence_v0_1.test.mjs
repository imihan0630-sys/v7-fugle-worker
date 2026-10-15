import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const record=JSON.parse(readFileSync("system2/migration/evidence/S2_DATA_ISSUE1068_2467_EXTERNAL_CLOCK_REAL_HTTP_20261015_V0_1.json","utf8"));
const hex=/^[0-9a-f]{64}$/;
function verify(x){
 assert.equal(x.schemaVersion,"S2_DATA_ISSUE1068_2467_EXTERNAL_PUBLISHER_REAL_GET_PHYSICAL_V0_1");
 assert.equal(x.originalActualGithubRun.runId,38738382917);
 assert.equal(x.originalActualGithubRun.originalMainCommit,"6e99a3ceeff4a136dd360ef3f8c418583c6d5bec");
 assert.equal(x.originalActualGithubRun.offlineConclusion,"success");
 assert.equal(x.originalActualGithubRun.publicGetConclusion,"success");
 assert.equal(x.originalActualGithubRun.originalPublisherGetCount,2);
 assert.equal(x.originalActualGithubRun.cloudflareD1Calls,0);
 assert.equal(x.originalActualGithubRun.cloudflareD1Writes,0);
 assert.equal(x.originalRealArtifacts.id,11973654492);
 assert.equal(x.originalRealArtifacts.originalZipBytes,1628);
 assert.equal(x.originalRealArtifacts.originalInnerBytes,3864);
 assert.equal(x.originalRealArtifacts.githubOriginalProviderZipSha256,"668f9dba5e27b128a1edc1b417ec3eef05ee3dc6e7c49e7d30db15f742da4bc7");
 assert.equal(x.originalRealArtifacts.independentlyRecomputedOriginalZipSha256,x.originalRealArtifacts.githubOriginalProviderZipSha256);
 assert.equal(x.originalRealArtifacts.independentlyRecomputedInnerSha256,"1239fdccec738d9ad7848d19d109d49e3492679a252ae2cc6d00567f3b34514e");
 assert.equal(x.originalRealArtifacts.originalInnerJsonIndependentlyParsed,true);
 assert.equal(x.originalLiveObserved.length,2);
 assert.deepEqual(x.originalLiveObserved.map(v=>v.id),["MONEYDJ_ORIGINAL_ARTICLE","ISSUER_CORRECTION_MIRROR"]);
 for(const v of x.originalLiveObserved){
   assert.match(v.originalHttpBodySha256,hex);
   assert.equal(v.historicalFirstKnownAt,null);
   assert.equal(v.historicalAvailableAt,null);
   assert.equal(v.historicalPITAccepted,false);
   assert.equal(v.originalArchivedMay2026BodyUnavailable,true);
   assert.match(v.currentlyCapturedAtUtc,/^2026-10-15T12:55:/);
   assert.match(v.originalHttpDateHeader,/15 Oct 2026/);
   assert.equal(v.claimedHistoricalClockTimezoneIndependentlyVerified,false);
 }
 assert.equal(x.originalLiveObserved[0].originalHttpResponseBytes,64705);
 assert.equal(x.originalLiveObserved[1].originalHttpResponseBytes,70791);
 assert.equal(x.originalLiveObserved[0].originalHttpBodySha256,"2d6a361e3fd34e070b4430bd534b2a57f0049ff51ef7f9a6ba3188fca2603cc4");
 assert.equal(x.originalLiveObserved[1].originalHttpBodySha256,"856d46ec1d41bf44baa80ebfb3e98ea3a288158aadeaa3a2067cfa92d0dd0008");
 assert.equal(x.scopeAndProhibitedPromotions.crossSourceCurrentContentPresenceVerifiedCount,2);
 assert.equal(x.scopeAndProhibitedPromotions.independentlyAuthenticatedWebArchiveCapturedInMay2026Count,0);
 assert.equal(x.scopeAndProhibitedPromotions.originalContemporaneousImmutableContentShaMatchedCount,0);
 assert.equal(x.scopeAndProhibitedPromotions.actualHistoricalPitCertified,0);
 assert.equal(x.scopeAndProhibitedPromotions.historicalExactFirstKnownAtCertified,0);
 assert.equal(x.scopeAndProhibitedPromotions.articleTimeZoneUnknownNoUtcOffsetInvented,true);
 assert.equal(x.scopeAndProhibitedPromotions.currentOct15HttpDateNotOldPublicationTime,true);
 assert.equal(x.scopeAndProhibitedPromotions.originalIssuerMirrorCannotIndependentlyProveFirstKnown,true);
 assert.equal(x.scopeAndProhibitedPromotions.frozenCertifiable,false);
 assert.equal(x.scopeAndProhibitedPromotions.system2BacktestShadowAllowed,false);
 assert.equal(x.scopeAndProhibitedPromotions.fullCrossAccountG3G4Completed,false);
 assert.equal(x.scopeAndProhibitedPromotions.independentAuditLaneSignedOff,false);
 return true;
}
assert.ok(verify(record));
for(const [name,modify] of [
 ["fake May archive",v=>{v.scopeAndProhibitedPromotions.independentlyAuthenticatedWebArchiveCapturedInMay2026Count=1}],
 ["fake first-known certification",v=>{v.scopeAndProhibitedPromotions.historicalExactFirstKnownAtCertified=1}],
 ["fake original historical PIT",v=>{v.scopeAndProhibitedPromotions.actualHistoricalPitCertified=1}],
 ["backfilled timestamp",v=>{v.originalLiveObserved[0].historicalAvailableAt="2026-05-22T16:37:00+08:00"}],
 ["backfilled first-known",v=>{v.originalLiveObserved[0].historicalFirstKnownAt="2026-05-22T16:37:00+08:00"}],
 ["fabricated archive SHA",v=>{v.originalRealArtifacts.independentlyRecomputedOriginalZipSha256="f".repeat(64)}],
 ["fake article original SHA",v=>{v.originalLiveObserved[0].originalHttpBodySha256="f".repeat(64)}],
 ["fake correction original SHA",v=>{v.originalLiveObserved[1].originalHttpBodySha256="f".repeat(64)}],
 ["incorrect GET size",v=>{v.originalLiveObserved[0].originalHttpResponseBytes=111}],
 ["forged first-known issuer authority",v=>{v.scopeAndProhibitedPromotions.originalIssuerMirrorCannotIndependentlyProveFirstKnown=false}],
 ["fabricated certified timezone",v=>{v.originalLiveObserved[0].claimedHistoricalClockTimezoneIndependentlyVerified=true}],
 ["fake Frozen",v=>{v.scopeAndProhibitedPromotions.frozenCertifiable=true}],
 ["fake G3G4",v=>{v.scopeAndProhibitedPromotions.fullCrossAccountG3G4Completed=true}],
 ["source accounted D1 calls",v=>{v.originalActualGithubRun.cloudflareD1Calls=1}],
 ["fictional original GET count",v=>{v.originalActualGithubRun.originalPublisherGetCount=4}]
]){
 const test=structuredClone(record);modify(test);
 assert.throws(()=>verify(test),name);
}
console.log("Issue1068 external original HTTP SHA evidence 1 positive + 15 failclosed adversarial scenarios PASS; historical PIT remains 0");
