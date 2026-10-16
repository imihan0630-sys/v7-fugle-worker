import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {consumeRealPita2330Source61V0_1 as consume,
 ACTUAL_A1_2330_ANCHOR_V0_1 as anchor}
 from '../runtime/pit_a_2330_real_a1_source_consumer_v0_1.mjs';

test('No original native DATA receipt cannot imply a PIT-A 61-day evidence pass',async()=>{
 await assert.rejects(consume(),/PHYSICAL_DATA_RECEIPT_REQUIRED/);
 await assert.rejects(consume({dataReadback:{}}),/ORIGINAL_SIGNED_READBACK_OR_PIN_INVALID/);
 assert.equal(anchor.dataReadbackRunId,38909454291);
 assert.equal(anchor.dataReadbackArtifactId,12049697019);
 assert.equal(anchor.marketDate,'2026-10-16');
});
test('Static consumer cannot use PIT-B historical or same-day source-only as strategy grant',()=>{
 const s=readFileSync('system2/runtime/pit_a_2330_real_a1_source_consumer_v0_1.mjs','utf8');
 assert.doesNotMatch(s,/\bfetch\s*\(|INSERT INTO|UPDATE\s+|DELETE FROM|api\.cloudflare\.com|https?:\/\/.*workers\.dev/);
 assert.match(s,/historicalCfiEffectivePeriodPITCertified===false/);
 assert.match(s,/completeCARevisionsAndAuthoritativeNoEventCertified===false/);
 assert.match(s,/independentFullPitAuditLaneAccepted===false/);
 assert.match(s,/pitBHistoricalReplayCertified:false/);
 assert.match(s,/selectedCount:null,zeroPickDay:null/);
});
const file=process.env.S2_BUILD_PITA_REAL_DATA_RECEIPT;
test('ACTUAL immutable DATA 61/61 original rehash: source-only consumer, NOT PIT-A stock', {skip:!file},async()=>{
 const r=JSON.parse(readFileSync(file,'utf8'));
 const x=await consume({dataReadback:r});
 assert.equal(x.state,'PITA_2330_61_A1_ORIGINALS_VERIFIED__CFI_CA_AUDIT_UNKNOWN');
 assert.equal(x.a1OriginalTradingDaysAccepted,61);
 assert.equal(x.currentSymbolFullPITAcceptedCount,0);
 assert.equal(x.currentSymbolUnresolvedCount,1);
 assert.equal(x.fullUniverseOrdinaryShareCount,null);
 assert.equal(x.fullUniversePITUnknownCount,null);
 assert.equal(x.stage1EvaluationAuthorized,false);
 assert.equal(x.stage1ActuallyAssessedCount,null);
 assert.equal(x.selectedCount,null);
 assert.equal(x.zeroPickDay,null);
 assert.equal(x.frozenD1Written,false);
 assert.equal(x.shadowAuthorized,false);
 assert.equal(x.cloudflareD1Writes,0);
 assert.match(x.receiptHash,/^[a-f0-9]{64}$/);
});
test('ACTUAL immutable DATA receipt tampering, copied PIT-B flags, forged acceptance all fail', {skip:!file},async()=>{
 const real=JSON.parse(readFileSync(file,'utf8'));
 for(const patch of [
  x=>x.originalNativeDaysRehashed=60,
  x=>x.windowStartDate='2026-07-20',
  x=>x.targetResearchCutUtc='2026-10-15T15:45:00.000Z',
  x=>x.historicalCfiEffectivePeriodPITCertified=true,
  x=>x.completeCARevisionsAndAuthoritativeNoEventCertified=true,
  x=>x.independentFullPitAuditLaneAccepted=true,
  x=>x.pitSymbolEligibleCount=1,
  x=>x.selectedCount=0,
  x=>x.zeroPickDay=true,
  x=>x.frozenD1Written=true,
  x=>x.cloudflareD1Writes=1,
  x=>x.originalResponseVersionLineage.pop(),
  x=>x.originalResponseVersionLineage[0].originalHistoricalPublicationTimestampCertified=true,
  x=>x.originalResponseVersionLineage[60].actualFirstPhysicalObservedAtUtc='2026-10-17T01:00:00.000Z',
  x=>x.oldIndependentSourceAuditSha256='f'.repeat(64),
 ]){
  const c=structuredClone(real);patch(c);
  await assert.rejects(consume({dataReadback:c}),/S2_BUILD_PITA_2330_A1_/);
 }
});
