import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {intakePita2330RealTSessionTradeOnlyV0_1 as intake,
 PHYSICAL_DATA_STATUS_PIN_V0_1 as pin}
 from '../runtime/pita_2330_real_t_status_consumer_v0_1.mjs';
const file=process.env.S2_BUILD_REAL_PITA_T_STATUS_RECEIPT;
test('no actual native DATA evidence implies no T session or decision-cut tradeable',async()=>{
 await assert.rejects(intake(),/ORIGINAL_DATA_RECEIPT_REQUIRED/);
 await assert.rejects(intake({dataReceipt:{}}),/PINNED_ORIGINAL_SOURCE_RECEIPT_HASH_INVALID/);
 assert.equal(pin.marketDate,'2026-10-16');
 assert.equal(pin.dataRunId,38918007652);
});
test('ACTUAL GitHub producer receipt: recognized T-trades; no inferred NO_SUSPENSION',
 {skip:!file},async()=>{
 const d=JSON.parse(readFileSync(file,'utf8'));
 const result=await intake({dataReceipt:d});
 const {receiptHash,...base}=result;
 assert.equal(receiptHash,await sha256Hex(base));
 assert.equal(result.actualTVolumeShares,43046982);
 assert.equal(result.actualTTrades,400499);
 assert.equal(result.sourcePositiveControlCount,1);
 assert.equal(result.sourceObservedNativeStatusBodies,2);
 assert.equal(result.trueAsOfTradingStatusIndependentlyAudited,false);
 assert.equal(result.noSuspensionOrHaltInferredFromEmptyNativeResponse,false);
 assert.equal(result.nextOpenTradeableAuthorized,false);
 assert.equal(result.local2330FullPitaEligible,0);
 assert.equal(result.local2330Unresolved,1);
 assert.equal(result.fullMarketOrdinaryShareCount,null);
 assert.equal(result.selectedCount,null);
 assert.equal(result.zeroPickDay,null);
 assert.equal(result.frozenD1Written,false);
 assert.equal(result.stage1EvaluationAuthorized,false);
});
test('ACTUAL receipt: no counterfeit no-suspension, late clock, extra status gate', 
 {skip:!file},async()=>{
 const d=JSON.parse(readFileSync(file,'utf8'));
 const mutants=[
  x=>x.authoritativeNegativeNoSuspensionCertified=true,
  x=>x.tradeableAtDecisionCutIndependentlyCertified=true,
  x=>x.currentSessionStockActuallyTraded=false,
  x=>x.currentSessionStockTradeCount=0,
  x=>x.currentSessionStockVolumeShares=0,
  x=>x.currentDateTwTaWuNative2330Rows=1,
  x=>x.currentSessionStockTradeValue=0,
  x=>x.actualOriginalStatusCompletedAtUtc='2026-10-16T16:01:00.000Z',
  x=>x.tradingStatusSources[0].sourceId='UNRELATED_CONTROL',
  x=>x.tradingStatusSources[1].rangeStartDate='2026-10-15',
  x=>x.tradingStatusSources[1].absenceCertifiesNoSuspension=true,
  x=>x.tradingStatusSources[1].authoritativeCompletenessCertified=true,
  x=>x.tradingStatusSources[1].firstPhysicalObservedAtUtc='2026-10-17T00:00:00.000Z',
  x=>x.existingA1BodySha256='a'.repeat(64),
  x=>x.selectedCount=0,
  x=>x.zeroPickDay=true,
  x=>x.frozenD1Written=true,
  x=>x.cloudflareD1Writes=1,
 ];
 for(const mutate of mutants){
  const c=structuredClone(d);mutate(c);
  // Deliberately re-sign producer payload; trust must remain externally pinned.
  const {receiptHash,...base}=c;c.receiptHash=await sha256Hex(base);
  await assert.rejects(intake({dataReceipt:c}),/PINNED_ORIGINAL_SOURCE_RECEIPT_HASH_INVALID/);
 }
});
test('consumer cannot touch original GET, Cloudflare or System1 formal core',()=>{
 const s=readFileSync('system2/runtime/pita_2330_real_t_status_consumer_v0_1.mjs','utf8');
 assert.doesNotMatch(s,/\bfetch\s*\(|INSERT INTO|DELETE FROM|UPDATE\s+|https:\/\/api\.cloudflare\.com/);
 assert.match(s,/tradeableAtDecisionCutIndependentlyCertified!==false/);
 assert.match(s,/authoritativeNegativeNoSuspensionCertified!==false/);
 assert.match(s,/selectedCount:null,zeroPickDay:null/);
});
