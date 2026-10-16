import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {reconcileExdiv2330InputsV0_1 as reconcile}
 from '../migration/issue1068_pita_2330_exdiv_raw_price_crosswalk_v0_1.mjs';

const p={
 sourcePreSha:'6741abcbc098c17b8f8ea17c27f0a83848e3a3dcfc1880151b0f5a2909d0da4e',
 sourceExSha:'a3d20d9ab2ca7980cf4f03946cd218974cee16d1456589f12f74c89e8864776f',
 caBodySha:'1d8c673fef438beac4cf827388ba76d2febc1c18acfe0b00219a88b2173b7e3e',
 originalA1ReceiptSha:'ff5aa17607fa9cc191599111b27b762a02f599456992f1baf7ee7b854387cfd9',
 originalSixCAReceiptSha:'24a3b535b213034f38ca2ab265ce74b61e685359699646d96c2206714bce4b80',
 currentCaSourceOnlyReceiptSha:'19d3d5f7499028da862016e46887355a1d054a3641fd2a836ad455cab31a647d',
 preOriginalCapturedAtUtc:'2026-10-12T22:41:18.587Z',
 exOriginalCapturedAtUtc:'2026-10-12T22:41:24.486Z',
 caOriginalCapturedAtUtc:'2026-10-16T13:48:50.420Z'
};
function input(){
 return {
  pre:{symbol:'2330',market:'TWSE',date:'2026-09-15',priceSpace:'RAW',
   close:2385,sourceRowHash:'0a8e2eaa4b9061d7e7a81eb0702dfbdd38d92287c9f4fa50daec01dec9682165'},
  ex:{symbol:'2330',market:'TWSE',date:'2026-09-16',priceSpace:'RAW',
   close:2380,sourceRowHash:'2bc5f1db3c369f4b41d76b7ee545adb578b8ba07ffdea126d81cfcb0fe81dd43'},
  ca:{sourceId:'TWSE_EX_RIGHT_DIVIDEND_ACTUAL',
   eventDateNative:'115年09月16日',stockCode:'2330',
   name:'台積電',type:'息',prevClose:'2,385.00',
   reference:'2,377.99',dividend:'7.000001',originalRowSha256:'e'.repeat(64)},
  provenance:{...p}
 };
}
test('the real 2330 source-native ex dividend flips 9/16 raw close vs official reference comparison',async()=>{
 const r=await reconcile(input());
 assert.equal(r.previousCloseRaw,2385);
 assert.equal(r.exDateCloseRaw,2380);
 assert.equal(r.officialExDividendReference,2377.99);
 assert.equal(r.nativeDividendField,7.000001);
 assert.equal(r.officialReferenceGap,7.01);
 assert.equal(r.nativeDividendFieldDiffersFromReferenceGap,true);
 assert.equal(r.rawTwoDayChangePercent,-0.209644);
 assert.equal(r.exDividendReferenceChangePercent,0.084525);
 assert.ok(r.rawTwoDayChangePercent<0);
 assert.ok(r.exDividendReferenceChangePercent>0);
 assert.equal(r['61DayAdjustedFeatureContinuityAudited'],false);
 assert.equal(r.correctedStage1MomentumComputed,false);
 assert.equal(r.authoritativeNegativeNoEventProven,false);
 assert.equal(r.currentSymbolPitEligible,false);
 assert.equal(r.currentAsOfTradeabilityAudited,false);
 assert.equal(r.selectedCount,null);
 assert.equal(r.frozenD1Written,false);
 assert.equal(r.cloudflareD1Writes,0);
 const {receiptHash,...base}=r;
 assert.equal(receiptHash,await sha256Hex(base));
});
test('source date, market, symbol, event and official reference tampering must fail',async()=>{
 const changes=[
  x=>x.pre.market='TPEX',
  x=>x.ex.symbol='2317',
  x=>x.pre.close=2377.99,
  x=>x.ex.close=2385,
  x=>x.ca.reference='2385',
  x=>x.ca.stockCode='2317',
  x=>x.ca.type='權',
  x=>x.ca.originalRowSha256='invalid',
  x=>x.provenance.caBodySha='0'.repeat(64),
  x=>x.provenance.sourceExSha='0'.repeat(64),
  x=>x.provenance.caOriginalCapturedAtUtc='2026-10-16T16:00:00.000Z',
 ];
 for(const change of changes){
  const x=input();change(x);
  await assert.rejects(reconcile(x),/S2_PITA_2330_EXDIV_/);
 }
});
test('original available before 10/16 cut cannot prove issuer published that version by 09/16',async()=>{
 const r=await reconcile(input());
 assert.equal(r.originalIssuerPublicationOnExDateProven,false);
 assert.equal(r.pricingReferenceOnlyNotA61DayAdjustment,true);
 assert.equal(r.independentAuditLaneFullPITAccepted,false);
 assert.equal(r.shadowAuthorized,false);
 assert.equal(r.frozenD1Written,false);
});
test('one existing artifact pair read only, immutable source no provider fetch, no strategy output',async()=>{
 const [s,w]=await Promise.all([
  readFile('system2/migration/issue1068_pita_2330_exdiv_raw_price_crosswalk_v0_1.mjs','utf8'),
  readFile('.github/workflows/system2-pita-2330-real-exdiv-native-price-crosswalk.yml','utf8')
 ]);
 assert.match(s,/rawTwoDayChangePercent/);
 assert.match(s,/exDividendReferenceChangePercent/);
 assert.match(s,/originalIssuerPublicationOnExDateProven:false/);
 assert.match(s,/correctedStage1MomentumComputed:false/);
 assert.doesNotMatch(s,/fetch\(|wrangler|api\.cloudflare\.com|INSERT INTO|git push|orderSubmit/);
 assert.match(w,/run-id: 38797319008/);
 assert.match(w,/run-id: 38910741802/);
 assert.match(w,/actions: read/);
 assert.match(w,/contents: read/);
 assert.match(w,/retention-days: 90/);
 assert.doesNotMatch(w,/schedule:|workflow_dispatch:|secrets\.|contents: write/);
});
