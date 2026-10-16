import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validatePita2330ClockAndSessionChainV0_1 as clock,
 FIXED} from '../migration/issue1068_pita_2330_61_native_source_readback_v0_1.mjs';
const old=JSON.parse(await readFile('system2/migration/evidence/S2_DATA_ISSUE1068_PIT_SOURCE_HANDOFF_20261016_V0_1.json','utf8'));
const days=[...old.officialTradingDates.slice(1),'2026-10-16'];
const good=()=>({
 originalDates:[...days],
 originalBarDates:days.slice(0,-1),
 originalCaptureClocks:Array(60).fill('2026-10-15T13:09:39.163Z'),
 newCaptureUtc:'2026-10-16T13:31:18.152Z',
 auditAtUtc:'2026-10-15T19:53:47.774Z'
});
test('real 2026-07-21..10-16 60+1 official dates and observed clocks can be formed as a source-only chain',()=>{
 assert.equal(days.length,61);
 assert.equal(days.at(0),'2026-07-21');
 assert.equal(days.at(-2),'2026-10-15');
 assert.equal(days.at(-1),'2026-10-16');
 assert.equal(clock(good()),true);
});
test('adversarial 61-session old+new clock / availability / date denominator cannot be backdated',()=>{
 const mutations=[
  x=>x.originalDates.pop(),
  x=>x.originalBarDates.pop(),
  x=>x.originalCaptureClocks.pop(),
  x=>x.originalDates[1]=x.originalDates[0],
  x=>{x.originalDates[x.originalDates.length-1]='2026-10-15';},
  x=>x.originalBarDates[33]='2026-10-11',
  x=>x.originalCaptureClocks[0]='2026-10-16T15:46:00.000Z',
  x=>x.originalCaptureClocks[3]='not-a-clock',
  x=>x.newCaptureUtc='2026-10-16T15:45:00.000Z',
  x=>x.newCaptureUtc='2026-10-16T15:46:00.000Z',
  x=>x.auditAtUtc='2026-10-16T15:46:00.000Z',
  x=>x.cutUtc='2026-10-15T15:45:00.000Z',
 ];
 for(const mutation of mutations){
  const x=good();mutation(x);
  assert.throws(()=>clock(x),/S2_PITA_2330_61_ORIGINAL_/);
 }
});
test('source readback must explicitly segregate original A1 from CFI/CA and never certify selection',async()=>{
 const [src,workflow]=await Promise.all([
  readFile('system2/migration/issue1068_pita_2330_61_native_source_readback_v0_1.mjs','utf8'),
  readFile('.github/workflows/system2-pita-2330-61-native-independent-readback.yml','utf8')
 ]);
 assert.match(src,/old\.receiptHash!==FIXED\.oldSourceReceiptHash/);
 assert.match(src,/originalNativeDaysRehashed:61/);
 assert.match(src,/onlyA1SourceEvidenceVerified:true/);
 assert.match(src,/independentFullPitAuditLaneAccepted:false/);
 assert.match(src,/historicalCfiEffectivePeriodPITCertified:false/);
 assert.match(src,/completeCARevisionsAndAuthoritativeNoEventCertified:false/);
 assert.match(src,/pitSymbolEligibleCount:0,selectedCount:null,zeroPickDay:null/);
 assert.match(src,/cloudflareD1Reads:0,cloudflareD1Writes:0,cloudflareR2Writes:0/);
 assert.doesNotMatch(src,/wrangler|api\.cloudflare\.com|INSERT INTO|git push|orderSubmit/);
 assert.match(workflow,/actions: read/);
 assert.match(workflow,/contents: read/);
 assert.doesNotMatch(workflow,/schedule:|workflow_dispatch:|secrets\.|contents: write/);
 assert.match(workflow,/38797319008/);
 assert.match(workflow,/38908458028/);
 assert.match(workflow,/retention-days: 90/);
 assert.equal(FIXED.cutUtc,'2026-10-16T15:45:00.000Z');
});
