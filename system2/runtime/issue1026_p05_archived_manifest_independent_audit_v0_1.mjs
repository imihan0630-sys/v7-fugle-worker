// Issue #1026 DATA_LANE: independently rehydrate archived P05 SOURCE_ONLY
// manifest and verify all individual stock-date identities/values and PIT locks.
// Zero Cloudflare D1, R2, quota reservation or trade authority.
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
const hash=v=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const days=Object.freeze(["2026-10-01","2026-10-02","2026-10-05",
 "2026-10-06","2026-10-07","2026-10-08"]);
const markets=Object.freeze(["TWSE","TPEX"]);
const code=/^[1-9][0-9]{3}$/;
const sha=/^[0-9a-f]{64}$/;
export function verifyIssue1026P05SourceManifestCoreV0_1({
 manifest,expectedDays,expectedIdentityHash,expectedValueHash,expectedTotal,
}={}){
 assert.ok(Array.isArray(expectedDays)&&expectedDays.length>0);
 assert.ok(Number.isSafeInteger(expectedTotal)&&expectedTotal>0);
 assert.match(expectedIdentityHash||"",sha);
 assert.match(expectedValueHash||"",sha);
 assert.equal(manifest?.sourceOnly,true);
 assert.equal(manifest?.result,"PASS_11843_OFFICIAL_SOURCE_KEYS_ONLY_NO_D1_CENSUS");
 assert.equal(manifest?.hotD1ScoutPhysicalExecuted,0);
 assert.equal(manifest?.hotD1FullPhysicalExecuted,0);
 assert.equal(manifest?.d1SelectsExecutedByManifest,0);
 assert.equal(manifest?.d1WritesExecutedByManifest,0);
 assert.equal(manifest?.r2CallsExecutedByManifest,0);
 assert.equal(manifest?.system1RuntimeUsed,false);
 assert.equal(manifest?.physicalD1MissingKeys,"UNKNOWN");
 assert.equal(manifest?.physicalD1MultiVersionKeys,"UNKNOWN");
 assert.equal(manifest?.pointInTimeAvailableAtAtHistoricalCutCertified,false);
 assert.equal(manifest?.originalFirstKnownAtCertified,false);
 assert.equal(manifest?.selectedToTradeAuthorized,false);
 assert.ok(Array.isArray(manifest?.manifestSourceKeyRows));
 assert.equal(manifest.manifestSourceKeyRows.length,expectedTotal);
 assert.equal(manifest.manifestKeyCount,expectedTotal);
 assert.equal(manifest.officialSourceStockDateKeys,expectedTotal);
 assert.ok(Array.isArray(manifest.dateSourceReceipts));
 assert.equal(manifest.dateSourceReceipts.length,expectedDays.length);
 const all=manifest.manifestSourceKeyRows,seen=new Set(),perDay=[],marketTotals={};
 let idx=0;
 for(const expected of expectedDays){
  assert.ok(markets.includes(expected.market)&&days.includes(expected.marketDate));
  const name=expected.market+"|"+expected.marketDate;
  assert.equal(expected.sourceTransport,"PRIMARY");
  assert.match(expected.frozenNormalizedBarSha256||"",sha);
  const day=manifest.dateSourceReceipts[perDay.length];
  assert.equal(day?.market,expected.market);
  assert.equal(day?.marketDate,expected.marketDate);
  assert.equal(day?.sourceTransport,"PRIMARY");
  assert.equal(day?.ordinarySymbolCount,expected.ordinarySymbolCount);
  assert.equal(day?.frozenNormalizedBarSha256,expected.frozenNormalizedBarSha256);
  assert.equal(day?.originalHistoricalFirstKnownAtCertified,false);
  assert.equal(day?.hotD1ReadbackCertified,false);
  assert.ok(Number.isSafeInteger(expected.ordinarySymbolCount)&&expected.ordinarySymbolCount>0);
  const slice=all.slice(idx,idx+expected.ordinarySymbolCount);
  assert.equal(slice.length,expected.ordinarySymbolCount);
  let last="";
  for(const r of slice){
   assert.equal(r.market,expected.market);
   assert.equal(r.marketDate,expected.marketDate);
   assert.match(r.symbol||"",code);
   assert.ok(r.symbol>last,"SOURCE_KEY_SYMBOLS_NOT_UNIQUELY_SORTED");
   last=r.symbol;
   assert.match(r.sourceValueSha256||"",sha);
   const k=name+"|"+r.symbol;
   assert.ok(!seen.has(k),"SOURCE_KEY_DUPLICATE");
   seen.add(k);
   assert.equal(r.sourceObservationIsRetrospective,true);
   assert.equal(r.historicalOriginalFirstKnownAtCertified,false);
   assert.equal(r.physicalHotD1Presence,"UNKNOWN");
   assert.equal(r.physicalHotD1VersionCount,"UNKNOWN");
   assert.equal(r.originalPITReplayAuthorized,false);
   assert.equal(Object.hasOwn(r,"firstKnownAt"),false,"FABRICATED_HISTORICAL_FIRSTKNOWNAT");
   assert.equal(Object.hasOwn(r,"availableAt"),false,"FABRICATED_HISTORICAL_AVAILABLEAT");
  }
  const ids=hash(slice.map(r=>r.symbol));
  const values=hash(slice.map(r=>[r.symbol,r.sourceValueSha256]));
  assert.equal(ids,day.sourceKeyIdentitySha256,"PER_DAY_SOURCE_KEYSET_DIGEST_DRIFT");
  assert.equal(values,day.sourceKeyValueSha256,"PER_DAY_SOURCE_VALUE_DIGEST_DRIFT");
  perDay.push(Object.freeze({market:expected.market,marketDate:expected.marketDate,
   sourceKeys:slice.length,sourceKeyIdentitySha256:ids,sourceKeyValueSha256:values,
   d1Presence:"UNKNOWN",physicalMissingKeys:"UNKNOWN",
   historicalFirstKnownAt:"UNKNOWN",historicalAvailableAt:"UNKNOWN",
   physicalRevisionVersions:"UNKNOWN",missingOnlyRepairEligible:false,
   originalPITReplayEligible:false}));
  marketTotals[expected.market]=(marketTotals[expected.market]||0)+slice.length;
  idx+=slice.length;
 }
 assert.equal(idx,all.length);
 assert.equal(seen.size,expectedTotal);
 const computedIds=hash(all.map(r=>[r.market,r.marketDate,r.symbol]));
 const computedValues=hash(all.map(r=>[
  r.market,r.marketDate,r.symbol,r.sourceValueSha256]));
 assert.equal(computedIds,manifest.manifestSourceKeysSha256);
 assert.equal(computedValues,manifest.manifestSourceKeyValuesSha256);
 assert.equal(computedIds,expectedIdentityHash,"FROZEN_SOURCE_IDENTITY_PROOF_MISMATCH");
 assert.equal(computedValues,expectedValueHash,"FROZEN_SOURCE_VALUE_PROOF_MISMATCH");
 assert.deepEqual(marketTotals,manifest.marketSourceKeys);
 return Object.freeze({
  result:"PASS_INDEPENDENT_ARCHIVED_ISSUE1026_P05_SOURCE_KEY_REHYDRATION_ONLY",
  sourceKeysIndependentlyValidated:seen.size,marketDateReceipts:perDay.length,
  perDay,marketSourceKeys:marketTotals,
  sourceIdentityHash:computedIds,sourceValueHash:computedValues,
  retrospectiveOnlyKeys:seen.size,unprovenHistoricalFirstKnownAt:seen.size,
  unknownHotD1PresenceKeys:seen.size,
  physicalD1MissingKeys:"UNKNOWN",physicalD1MultiVersionKeys:"UNKNOWN",
  missingOnlyRepairCandidatesPhysical: "UNKNOWN",
  permissionToWrite:false,originalPITReplayAuthorized:false,
  sourceOnly:true,d1SqlReadsByAudit:0,d1SqlWritesByAudit:0,
  r2CallsByAudit:0,quotaReservationGranted:false,
  system1FormalRuntimeChanged:false,cloudflareBillingChanged:false,
 });
}
export function auditIssue1026P05RealArchivedManifestV0_1({
 manifest,acceptance,observedAt,
}={}){
 assert.equal(acceptance?.schemaVersion,
  "S2_ISSUE1026_P05_FULL_OCT08_11843_REAL_OFFICIAL_SOURCE_KEY_MANIFEST_ACCEPTANCE_20261009_V0_1");
 assert.equal(acceptance?.issue,1026);
 assert.equal(acceptance?.acceptanceRun?.id,37944021198);
 assert.equal(acceptance?.acceptanceRun?.jobId,113865467788);
 assert.equal(acceptance?.acceptanceRun?.headSha,
  "eea2a110e9df6f34dffe3e58362bea58ce32a172");
 assert.equal(acceptance?.acceptanceRun?.artifactId,11623192826);
 assert.equal(acceptance?.acceptanceRun?.artifactDigest,
  "sha256:7fe94b715cf265880163fb986d46ab95ff4b6620a9ed23d8363a4bc3e873934f");
 assert.equal(acceptance?.exactSourceScope?.verifiedOfficialStockDateKeys,11843);
 assert.equal(acceptance?.exactSourceScope?.marketDateReceipts,12);
 assert.equal(manifest?.schemaVersion,
  "S2_ISSUE1026_P05_OCT08_FULL_OFFICIAL_SOURCE_KEY_MANIFEST_V0_1");
 assert.equal(manifest?.issue,1026);
 assert.equal(manifest?.originalFrozenSourceRunId,37878847039);
 assert.equal(manifest?.originalFrozenSourceSha,
  "39ca8dce38fa675874074609fb32d9c44321e944");
 assert.equal(manifest?.marketDateCutoff,"2026-10-08");
 assert.ok(typeof observedAt==="string"&&
  Number.isFinite(Date.parse(observedAt))&&
  Date.parse(observedAt)>=Date.parse("2026-10-09T00:00:00Z"));
 const x=acceptance.exactSourceScope.perMarketDate;
 assert.ok(Array.isArray(x)&&x.length===12);
 const expectedDays=x.map((entry,i)=>{
  const actualDay=manifest.dateSourceReceipts?.[i];
  assert.equal(actualDay?.market,entry.market);
  assert.equal(actualDay?.marketDate,entry.date);
  assert.equal(actualDay?.ordinarySymbolCount,entry.sourceKeys);
  return {market:entry.market,marketDate:entry.date,
   ordinarySymbolCount:entry.sourceKeys,
   frozenNormalizedBarSha256:actualDay.frozenNormalizedBarSha256,
   sourceTransport:"PRIMARY"};
 });
 const result=verifyIssue1026P05SourceManifestCoreV0_1({
  manifest,expectedDays,expectedTotal:11843,
  expectedIdentityHash:"67ea4601ab7ea6300ab1cf0a54ba4eafb7d834c03ac83413536273c7dbabe654",
  expectedValueHash:acceptance.exactSourceScope.manifestSourceKeyValueAggregateSha256,
 });
 assert.equal(result.marketSourceKeys.TWSE,6518);
 assert.equal(result.marketSourceKeys.TPEX,5325);
 assert.equal(result.sourceValueHash,
  "2f6c4d8362168cad11c4c230fd26fa06aa189fe87567314aa7a4f8798b006139");
 return Object.freeze({
  schemaVersion:"S2_ISSUE1026_P05_ORIGINAL_ARTIFACT_INDEPENDENT_SOURCE_KEY_AUDIT_V0_1",
  verifiedAt:observedAt,artifactId:11623192826,
  originalArchiveSha256:acceptance.acceptanceRun.artifactDigest,
  ...result,
  originalFirstKnownAtPhysicalEvidenceCertified:false,
  historicalAvailableAtPhysicalEvidenceCertified:false,
  sourceKeyIsNotD1Proof:true,
  physicalScoutActuallyExecuted:0,physicalCensusActuallyExecuted:0,
  fullCensusD1ExtraKeysCertified:false,
 });
}
