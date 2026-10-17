import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {makeSingleKnownExdivReferenceCandidateV0_1 as propose}
 from '../migration/issue1068_pita_2330_reference_ratio_price_space_candidate_v0_1.mjs';
const old=JSON.parse(await readFile(
 'system2/migration/evidence/S2_DATA_ISSUE1068_PIT_SOURCE_HANDOFF_20261016_V0_1.json','utf8'));
const dates=[...old.officialTradingDates.slice(1),'2026-10-16'];
const fixture=()=>{
 const rawBars=dates.map((d,i)=>{
  const price=i===40?2385:i===41?2380:2400;
  return {marketDate:d,market:'TWSE',symbol:'2330',
   open:price,high:price+5,low:price-5,close:price,
   rawRowSha256:'a'.repeat(64)};
 });
 return {dates:[...dates],rawBars};
};
test('one true ex-reference boundary: 41 prior bars proposed on reference scale; 20 raw unchanged',()=>{
 const a=propose(fixture());
 assert.equal(dates.length,61);
 assert.equal(dates[40],'2026-09-15');
 assert.equal(dates[41],'2026-09-16');
 assert.equal(a.knownNativeExDateIndex,41);
 assert.equal(a.preEventReferenceScaledSessions,41);
 assert.equal(a.unchangedPostEventSessions,20);
 assert.equal(a.referenceRatio,2377.99/2385);
 assert.equal(a.proposedPreviousCloseAtReference,2377.99);
 assert.equal(a.referenceBasedExDateReturnPct,0.084525);
 assert.equal(a.rawExDateReturnPct,-0.209644);
 assert.equal(a.referenceScaleSeries.length,61);
 assert.equal(a.referenceScaleSeries[40].proposedOHLC.close,2377.99);
 assert.equal(a.referenceScaleSeries[41].proposedOHLC.close,2380);
 assert.equal(a.referenceScaleSeries[60].proposedOHLC.close,2400);
 assert.equal(a.referenceScaleSeries[0].knownEventPreSide,true);
 assert.equal(a.referenceScaleSeries[41].knownEventPreSide,false);
});
test('native original event reference is not simply the nominal cash dividend',()=>{
 const a=propose(fixture());
 assert.equal(a.rawPreEventClose,2385);
 assert.equal(a.nativeExDividendReference,2377.99);
 assert.equal(a.rawPreEventClose-a.nativeExDividendReference,7.010000000000218);
 assert.notEqual(a.rawPreEventClose-a.nativeExDividendReference,7.000001);
});
test('refuse forged session denominator, event dates, body hash or impossible native OHLC',()=>{
 const scenarios=[
  x=>x.dates.pop(),
  x=>x.rawBars.pop(),
  x=>x.dates[1]=x.dates[0],
  x=>x.dates[0]='2026-07-20',
  x=>x.rawBars[40].close=2377.99,
  x=>x.rawBars[41].close=2385,
  x=>x.rawBars[60].rawRowSha256='',
  x=>x.rawBars[5].market='TPEX',
  x=>x.rawBars[12].symbol='2317',
  x=>x.rawBars[23].low=99999,
  x=>x.rawBars[4].marketDate='2026-10-17',
 ];
 for(const mutate of scenarios){
  const input=fixture();mutate(input);
  assert.throws(()=>propose(input),/S2_PITA_2330_PRICE_SPACE_CANDIDATE_/);
 }
 for(const opts of [
  {exDate:'2026-09-17'},{priorDate:'2026-09-14'},
  {exchangeReference:2385},{exchangeReference:2388},
  {priorNativeClose:999}
 ]){
  assert.throws(()=>propose({...fixture(),...opts}),/S2_PITA_2330_PRICE_SPACE_CANDIDATE_/);
 }
});
test('source-only proposal never has implicit rights to strategy or production',async()=>{
 const [s,w]=await Promise.all([
  readFile('system2/migration/issue1068_pita_2330_reference_ratio_price_space_candidate_v0_1.mjs','utf8'),
  readFile('.github/workflows/system2-data-2330-reference-ratio-source-candidate.yml','utf8')
 ]);
 assert.match(s,/full61DayAdjustedFeatureContinuityAudited:false/);
 assert.match(s,/authoritativeOtherActionsExcluded:false/);
 assert.match(s,/totalReturnOrOfficialAdjustedSeriesClaimed:false/);
 assert.match(s,/completePriceSpaceAdjustmentForStrategy:false/);
 assert.match(s,/pitEligible:false,selectedCount:null,zeroPickDay:null/);
 assert.doesNotMatch(s,/fetch\(|wrangler|api\.cloudflare\.com|INSERT INTO|placeOrder/);
 assert.match(w,/actions: read/);
 assert.match(w,/contents: read/);
 assert.match(w,/retention-days: 90/);
 assert.doesNotMatch(w,/schedule:|workflow_dispatch:|contents: write|secrets\./);
});
