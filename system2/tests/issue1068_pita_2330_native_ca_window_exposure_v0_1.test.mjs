import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {classifyKnownEventExposureV0_1 as inspect,
 attest2330KnownEventWindowV0_1 as proof}
 from '../migration/issue1068_pita_2330_native_ca_window_exposure_v0_1.mjs';
const old=JSON.parse(await readFile(
 'system2/migration/evidence/S2_DATA_ISSUE1068_PIT_SOURCE_HANDOFF_20261016_V0_1.json','utf8'));
const dates=[...old.officialTradingDates.slice(1),'2026-10-16'];
test('actual 61 official sessions locate 9/15→9/16 boundary exactly inside T 20-session return',()=>{
 const r=inspect({dates});
 assert.equal(dates.length,61);
 assert.equal(r.priorEventIndex,40);
 assert.equal(r.knownEventIndex,41);
 assert.equal(r.subsequentTradingSessionsCount,19);
 const by=id=>r.exposureRows.find(x=>x.id===id);
 assert.equal(by('CURRENT_20_PRIOR_CLOSE_RETURN').firstDate,'2026-09-15');
 assert.equal(by('CURRENT_20_PRIOR_CLOSE_RETURN').lastDate,'2026-10-16');
 assert.equal(by('CURRENT_20_PRIOR_CLOSE_RETURN').crossesKnownExDividendRawPriceBoundary,true);
 assert.equal(by('CURRENT_60_PRIOR_CLOSE_RETURN').crossesKnownExDividendRawPriceBoundary,true);
 assert.equal(by('CURRENT_60_CLOSE_PRICE').crossesKnownExDividendRawPriceBoundary,true);
 assert.equal(by('PRIOR_20_CLOSE_PRICE').crossesKnownExDividendRawPriceBoundary,true);
 assert.equal(by('PRIOR_60_HIGH_LOW').crossesKnownExDividendRawPriceBoundary,true);
 assert.equal(by('CURRENT_20_CLOSE_PRICE').firstDate,'2026-09-16');
 assert.equal(by('CURRENT_20_CLOSE_PRICE').crossesKnownExDividendRawPriceBoundary,false);
 assert.equal(by('CURRENT_1D_CLOSE_RETURN').crossesKnownExDividendRawPriceBoundary,false);
 assert.equal(by('CURRENT_20_PRIOR_VOLUME').crossesKnownExDividendRawPriceBoundary,false);
 assert.equal(by('CURRENT_20_PRIOR_TRADE_VALUE').crossesKnownExDividendRawPriceBoundary,false);
 assert.equal(r.exposureRows.filter(x=>x.crossesKnownExDividendRawPriceBoundary).length,5);
 for(const row of r.exposureRows){
  assert.equal(row.adjustedPriceFeatureComputed,false);
  assert.equal(row.authoritativeNoOtherActionEventsCertified,false);
  assert.ok(row.evidenceState.includes('UNKNOWN')||row.crossesKnownExDividendRawPriceBoundary);
 }
});
test('no known-event crossing is not an all-CA NO_EVENT certificate',()=>{
 const e=inspect({dates});
 for(const x of e.exposureRows.filter(x=>!x.crossesKnownExDividendRawPriceBoundary)){
  assert.equal(x.authoritativeNoOtherActionEventsCertified,false);
  assert.notEqual(x.evidenceState,'NO_ACTION');
 }
});
test('missing, duplicated or shifted event boundary must never falsely mark price-space safe',()=>{
 for(const x of [
  dates.slice(1),
  [...dates.slice(0,40),dates[39],...dates.slice(41)],
  [...dates.slice(0,-1),'2026-10-15'],
 ]){
  assert.throws(()=>inspect({dates:x}),/S2_DATA_2330_CA_EXPOSURE_/);
 }
 assert.throws(()=>inspect({dates,knownEventDate:'2026-09-17'}),/S2_DATA_2330_CA_EXPOSURE_/);
 assert.throws(()=>inspect({dates,previousTradeDate:'2026-09-14'}),/S2_DATA_2330_CA_EXPOSURE_/);
});
test('fake unsigned receipt is never accepted as true event continuity',async()=>{
 await assert.rejects(proof({
  a1:{schemaVersion:'S2_DATA_PITA_2330_61_NATIVE_SOURCE_READBACK_V0_1',
   stock:'2330',market:'TWSE',marketDate:'2026-10-16',
   receiptHash:'a'.repeat(64)},
  reference:{receiptHash:'b'.repeat(64)}
 }),/S2_DATA_2330_CA_EXPOSURE_SOURCE_ONLY_61_OR_KNOWN_CA_REFERENCE_IDENTITY_INVALID/);
});
test('source-only original-artifact CI cannot GET provider, score rank or Frozen',async()=>{
 const [source,yml]=await Promise.all([
  readFile('system2/migration/issue1068_pita_2330_native_ca_window_exposure_v0_1.mjs','utf8'),
  readFile('.github/workflows/system2-data-2330-ca-window-exposure-original.yml','utf8')
 ]);
 assert.match(source,/authoritativeNoOtherEventsCertified:false/);
 assert.match(source,/full61BarCAContinuityCertified:false/);
 assert.match(source,/independentAUDITLaneStrategyScopeAccepted:false/);
 assert.match(source,/pitEligible:false,selectedCount:null,zeroPickDay:null,frozenD1Written:false/);
 assert.doesNotMatch(source,/fetch\(|wrangler|api\.cloudflare\.com|INSERT INTO|orderSubmit/);
 assert.match(yml,/38909699033/);
 assert.match(yml,/38916820486/);
 assert.match(yml,/contents: read/);
 assert.match(yml,/actions: read/);
 assert.match(yml,/retention-days: 90/);
 assert.doesNotMatch(yml,/schedule:|workflow_dispatch:|contents: write|secrets\./);
});
