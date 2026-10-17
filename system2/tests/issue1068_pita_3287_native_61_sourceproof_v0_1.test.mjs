// Class A DATA: evidence-shape guard only. The SOURCE physical byte replay
// was separately performed against original GitHub Artifact #12060640574.
// This offline test is never independent issuer CA/PIT or trading permission.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const DATA='system2/migration/evidence/S2_DATA_PITA_3287_TPEX_61_SOURCE_ONLY_PHYSICAL_ANCHOR_20261017_V0_1.json';
const evidence=JSON.parse(readFileSync(DATA,'utf8'));
const H=/^[0-9a-f]{64}$/;
function validate(e){
 assert.equal(e.schemaVersion,'S2_DATA_PITA_3287_TPEX_61_SOURCE_ONLY_PHYSICAL_ANCHOR_V0_1');
 assert.equal(e.marketDate,'2026-10-16');
 assert.equal(e.market,'TPEX');
 assert.equal(e.symbol,'3287');
 assert.equal(e.companyName,'廣寰科');
 assert.equal(e.existingSourceRunId,38934081985);
 assert.equal(e.existingSourceArtifactId,12060640574);
 assert.equal(e.exactSourceZipBytes,40641415);
 assert.equal(e.originalArtifactZipSha256IndependentlyRehashed,
 '9a4cc56839b975385f052b7e804211994136c5e9db59bdf645e6198b29e2fe97');
 for(const name of ['sourceBodyHashesChronological61VectorSha256',
  'sourceRowManifestHashesChronological61VectorSha256',
  'physicalFirstObservedClocksChronological61VectorSha256',
  'fullNative61RehashManifestVectorSha256','independentSOURCEAuditHash'])
   assert.match(e[name],H);
 assert.equal(e.actualOriginal61DateWindow,'2026-07-21..2026-10-16');
 assert.equal(e.officialTradingSessions,61);
 assert.equal(e.independentByByteTpexSourceBodiesRehashedThisRun,61);
 assert.equal(e.issuerRowOriginalOHLCVTurnoverMatchedPerDay,61);
 assert.equal(e.rawPayloadDateMatchedPerDay,61);
 assert.equal(e.nativeSessionsCapturedBeforeOriginalCut,60);
 assert.equal(e.nativeSessionsCapturedAfterOriginalCut,1);
 assert.equal(e.firstSession.date,'2026-07-21');
 assert.equal(e.lastSession.date,'2026-10-16');
 assert.equal(e.firstSession.originalBodySha256,
  '2f7be3f217030bb96d3ad467ddb590a983b23427e197a8b196b6cd531a299113');
 assert.equal(e.lastSession.originalBodySha256,
  'c7b0bc4328286dea71197f67b6d90011a7ed7bed138fca15af6c7aa3bc234c97');
 assert.equal(e.lastSession.nativeOHLC.close,59.6);
 assert.equal(e.lastSession.volumeShares,5779391);
 assert.equal(e.lastSession.tradeValue,346333133);
 const cut=Date.parse(e.originalCutUtc);
 assert.equal(e.originalCutUtc,'2026-10-16T15:45:00.000Z');
 assert.ok(Date.parse(e.firstSession.capturedAtUtc)<=cut);
 assert.ok(Date.parse(e.lastSession.capturedAtUtc)>cut);
 assert.equal(e.lastSession.capturedAtUtc,'2026-10-16T16:44:22.393Z');
 assert.equal(e.retrospectiveLateTargetDay,true);
 assert.equal(e.independentSOURCEAuditRunId,38934321405);
 assert.equal(e.independentSOURCEAuditHash,
  'e5c4a283ad25a9a5eea30ebcb0a8ffb0f9c94151c0f94602fe16447db117e84b');
 const c=e.currentNativeCfiObservation;
 assert.equal(c.sourceRunId,38877240888);
 assert.equal(c.sourceArtifactId,12035548392);
 assert.equal(c.code,'3287');
 assert.equal(c.nativeType,'Stocks');
 assert.equal(c.cfi,'ESVUFR');
 assert.equal(c.observedAtUtc,'2026-10-16T08:58:26.502Z');
 assert.match(c.originalBodySha256,H);
 assert.ok(Date.parse(c.observedAtUtc)<=cut);
 assert.equal(c.asOfPositiveOnly,true);
 assert.equal(c.independentCurrentCutClassAudited,false);
 assert.equal(e.sourceIntegrityOnly,true);
 for(const key of ['inputClassAsOfFullPitQualified',
  'historicalOriginalPublicationClocksCertified',
  'corporateActionsRelevantPositiveAndNegativeFullyReconciled',
  'adjustedPriceContinuityAndActualSevenUsedFactorsAudited',
  'issuerTradeabilityAtCutAudited','independentStrategyPitaAccepted',
  'frozenD1Written','shadowAuthorized','system1FormalCoreChanged'])
   assert.equal(e[key],false,key+' must not be promoted');
 assert.equal(e.scopeMarketOrdinaryShareDenominator,null);
 assert.equal(e.selectedCount,null);
 assert.equal(e.zeroPickDay,null);
 assert.equal(e.newOfficialProviderGets,0);
 assert.equal(e.cloudflareD1Reads,0);
 assert.equal(e.cloudflareD1Writes,0);
 assert.equal(e.cloudflareR2Writes,0);
 assert.equal(e.status,
  'SOURCE_ONLY_61_OF_61_READY_FOR_FUTURE_REUSE__ORIGINAL_20261016_2345_PIT_CUT_MISSED');
 return true;
}
test('3287 real 61 original source observation is certified separately from full PIT',()=>{
 assert.equal(validate(evidence),true);
});
test('reject forged source count/clock/class/authority, price and market',()=>{
 const mutate=[
 x=>x.officialTradingSessions=60,
 x=>x.independentByByteTpexSourceBodiesRehashedThisRun=60,
 x=>x.issuerRowOriginalOHLCVTurnoverMatchedPerDay=60,
 x=>x.existingSourceArtifactId=10,
 x=>x.market='TWSE',
 x=>x.lastSession.nativeOHLC.close=59.7,
 x=>x.lastSession.capturedAtUtc='2026-10-16T13:00:00.000Z',
 x=>x.originalCutUtc='2026-10-17T06:00:00.000Z',
 x=>x.retrospectiveLateTargetDay=false,
 x=>x.currentNativeCfiObservation.cfi='CEOGEU',
 x=>x.currentNativeCfiObservation.independentCurrentCutClassAudited=true,
 x=>x.corporateActionsRelevantPositiveAndNegativeFullyReconciled=true,
 x=>x.independentStrategyPitaAccepted=true,
 x=>x.selectedCount=0,
 x=>x.zeroPickDay=true,
 x=>x.frozenD1Written=true,
 x=>x.cloudflareD1Writes=1,
 ];
 for(const fn of mutate){
  const x=structuredClone(evidence);
  fn(x);
  assert.throws(()=>validate(x));
 }
});
