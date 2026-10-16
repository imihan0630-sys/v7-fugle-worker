import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {measureOwnerPITDualTrackV0_1 as measure} from '../migration/pit_dual_track_priority_v0_1.mjs';
const hPath='system2/migration/evidence/S2_DATA_ISSUE1068_PIT_SOURCE_HANDOFF_20261016_V0_1.json';
const cPath='system2/migration/evidence/S2_DATA_ISSUE1068_NATIVE_CFI_ORIGINAL_FOUR_CONTROL_POSITIVES_20261016_V0_1.json';
const load=async()=>Promise.all([hPath,cPath].map(p=>readFile(p,'utf8').then(JSON.parse)));
const copy=x=>JSON.parse(JSON.stringify(x));
const sign=async h=>({...h,receiptHash:await sha256Hex(
 Object.fromEntries(Object.entries(h).filter(([k])=>k!=='receiptHash')))});
test('real main originals: PIT-A is prioritized but 2 current CFI are not 2 historic PIT picks',async()=>{
 const [h,c]=await load(),r=await measure(h,c);
 assert.equal(r.ownerApprovedPriority,'PIT_A_DAILY_SELECTION_FIRST__PIT_B_HISTORIC_PARALLEL');
 assert.equal(r.pitA.sourceSecurityWindows,1935);
 assert.equal(r.pitA.currentlyObservedStockPositive,2);
 assert.equal(r.pitA.historicalPITIndependentlyAccepted,0);
 assert.equal(r.pitA.historyPITUnknown,1935);
 assert.equal(r.pitA.formalSelectedCount,null);
 assert.equal(r.pitA.zeroPickDay,null);
 assert.equal(r.pitB.sourceD1A1Rows,84688);
 assert.equal(r.pitB.destD1A1Rows,59311);
 assert.equal(r.pitB.remainingD1A1Rows,25377);
 assert.equal(r.pitB.historicalBacktestPITCertified,false);
 assert.equal(r.truePitFirstSymbolCertified,false);
 assert.equal(r.selectionAuthorized,false);
 assert.equal(r.frozenD1Written,false);
 assert.equal(r.cloudflareWrites,0);
});
test('fail closed fabricated CFI positive, duplicated original, missing SHA and late historical promotion',async()=>{
 const [h,c]=await load();
 const changes=[
   x=>x.asOfCurrentStockSourcePositive=3,
   x=>x.sourceOriginals[1].code='2330',
   x=>x.sourceOriginals[0].originalSha256='unknown',
   x=>x.sourceOriginals[1].observedAtUtc='2026-10-15T12:00:00Z',
   x=>x.sourceOriginals[2].sourceObservationPositive=true,
   x=>x.independentAuditLaneSigned=true,
   x=>x.historicEffectivePeriodPITCertified=1,
   x=>x.fullStage1MarketDayHistoricalPitEligibleSymbols=1,
   x=>x.caSixFamilyHistoricVersionNoEventComplete=true,
   x=>x.selectedCount=0,
   x=>x.frozenD1Written=true,
 ];
 for(const change of changes){
  const fake=copy(c);change(fake);
  await assert.rejects(()=>measure(h,fake),/S2_PIT_DUAL_TRACK_/);
 }
});
test('rejects signer-consistent fabricated PIT eligibility and missing original-cut audit',async()=>{
 const [h,c]=await load();
 for(const change of [
   x=>{x.handoffScope.pitEligibleSymbolCount=1;x.handoffScope.unresolvedSymbolCount=1934;},
   x=>x.handoffScope.formalSelectedCount=0,
   x=>x.handoffScope.zeroPickDay=true,
   x=>x.handoffScope.selectionAuthorized=true,
   x=>x.handoffScope.historicalBacktestAuthorized=true,
   x=>x.a1OriginalEvidence.originalDecisionCutIndependentArchiveWitness=true,
   x=>x.originalDecisionCutAtUtc='2026-10-16T08:00:00.000Z',
   x=>x.migrationAndAccountState.destinationA1RowsRemaining=0,
   x=>x.migrationAndAccountState.targetR2Entitlement='ENTITLED',
 ]) {
  let fake=copy(h);change(fake);fake=await sign(fake);
  await assert.rejects(()=>measure(fake,c),/S2_PIT_DUAL_TRACK_/);
 }
});
test('non-authorization boundary: no physical GET, Cloudflare, runtime mutation or version promotion',async()=>{
 const [s,doc]=await Promise.all([
  readFile('system2/migration/pit_dual_track_priority_v0_1.mjs','utf8'),
  readFile('system2/migration/PIT_A_DAILY_SELECTION_PIT_B_HISTORICAL_BACKTEST_PRIORITY_V0_1.md','utf8'),
 ]);
 assert.doesNotMatch(s,/fetch\(|wrangler|api\.cloudflare\.com|INSERT INTO|UPDATE s2_|Worker\.js/);
 assert.match(doc,/PIT-A/);
 assert.match(doc,/PIT-B/);
 assert.match(doc,/NO_EVENT/);
 assert.match(doc,/AUDIT_LANE/);
 assert.match(doc,/BUILD_LANE/);
});
