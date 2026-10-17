import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {classifyAsOfSourceClockV0_1 as classify}
 from '../migration/issue1068_m09_overnight_native_source_cut_fence_v0_1.mjs';
const cut='2026-10-16T15:45:00.000Z';
test('real M09 CFI30 source post-cut AND 2330 outside thirty: cannot backdate',()=>{
 const r=classify({marketDate:'2026-10-16',
  originalObservedAtUtc:'2026-10-16T19:34:48.743Z',
  independentAuditedAtUtc:'2026-10-16T19:35:06.665Z',
  stockInScope:false});
 assert.equal(r.sourceBeforeCut,false);
 assert.equal(r.independentAuditCompletedAfterCut,true);
 assert.equal(r.sourceUsableForHistoricalTDecision,false);
 assert.equal(r.reason,'SYMBOL_NOT_IN_SOURCE_NATIVE_COHORT');
});
test('real six CA native originals after 23:45 cut cannot borrow T PIT despite six valid original bytes',()=>{
 const r=classify({marketDate:'2026-10-16',
  originalObservedAtUtc:'2026-10-16T19:34:40.323Z',
  independentAuditedAtUtc:'2026-10-16T19:35:07.962Z',stockInScope:true});
 assert.equal(r.sourceBeforeCut,false);
 assert.equal(r.sourceUsableForHistoricalTDecision,false);
 assert.equal(r.reason,'ORIGINAL_FIRST_OBSERVED_AFTER_CUT__NO_RETROACTIVE_ADMISSION');
});
test('later independent hash audit does not make PRE-cut archived source time-invalid',()=>{
 const r=classify({marketDate:'2026-10-16',
  originalObservedAtUtc:'2026-10-16T13:48:50.420Z',
  independentAuditedAtUtc:'2026-10-17T03:35:07.962Z',stockInScope:true});
 assert.equal(r.sourceBeforeCut,true);
 assert.equal(r.independentAuditCompletedAfterCut,true);
 assert.equal(r.sourceUsableForHistoricalTDecision,true);
 assert.match(r.reason,/NO_FULL_PIT_PROMOTION/);
});
test('same-day source observed at cutoff exactly fails strictly before-cut test',()=>{
 const r=classify({marketDate:'2026-10-16',
  originalObservedAtUtc:cut,
  independentAuditedAtUtc:'2026-10-17T03:35:07.962Z',stockInScope:true});
 assert.equal(r.sourceUsableForHistoricalTDecision,false);
});
test('source not in symbol scope does not enter despite pre-cut clock',()=>{
 const r=classify({marketDate:'2026-10-16',
  originalObservedAtUtc:'2026-10-16T09:04:23.145Z',
  independentAuditedAtUtc:'2026-10-16T09:05:00.000Z',stockInScope:false});
 assert.equal(r.sourceBeforeCut,true);
 assert.equal(r.sourceUsableForHistoricalTDecision,false);
});
test('source clock identity and auditor sequencing refuse malformed and future-shifted claims',()=>{
 const cases=[
  {marketDate:'2026-10-15',originalObservedAtUtc:'2026-10-16T09:04:23.145Z',
   independentAuditedAtUtc:'2026-10-16T09:05:00.000Z',stockInScope:true},
  {marketDate:'2026-10-16',cutUtc:'2026-10-16T23:45:00.000Z',
   originalObservedAtUtc:'2026-10-16T09:04:23.145Z',
   independentAuditedAtUtc:'2026-10-16T09:05:00.000Z',stockInScope:true},
  {marketDate:'2026-10-16',originalObservedAtUtc:'bad',
   independentAuditedAtUtc:'2026-10-16T09:05:00.000Z',stockInScope:true},
  {marketDate:'2026-10-16',originalObservedAtUtc:'2026-10-16T09:04:23.145Z',
   independentAuditedAtUtc:'2026-10-16T09:00:00.000Z',stockInScope:true},
  {marketDate:'2026-10-16',originalObservedAtUtc:'2026-10-16T09:04:23.145Z',
   independentAuditedAtUtc:'2026-10-16T09:05:00.000Z',stockInScope:'yes'},
 ];
 for(const p of cases)assert.throws(()=>classify(p),/S2_DATA_M09_NEXTDAY_CUT_/);
});
test('real artifact readback action has no provider GET/new cron/cloud credentials or selection authority',async()=>{
 const [code,workflow]=await Promise.all([
  readFile('system2/migration/issue1068_m09_overnight_native_source_cut_fence_v0_1.mjs','utf8'),
  readFile('.github/workflows/system2-data-m09-overnight-cut-fence-20261017.yml','utf8')
 ]);
 assert.doesNotMatch(code,/fetch\(|wrangler|api\.cloudflare\.com|INSERT INTO|orderSubmit/);
 assert.match(code,/cfiOriginalBodiesRehashed:cfiOriginals/);
 assert.match(code,/caOriginalBodiesRehashed:caOriginals/);
 assert.match(code,/previousTStrategyPITEligible:false,selectedCount:null,zeroPickDay:null/);
 assert.match(code,/caCut\.sourceBeforeCut/);
 assert.match(workflow,/38955846766/);
 assert.match(workflow,/38955973594/);
 assert.match(workflow,/38955973706/);
 assert.match(workflow,/actions: read/);
 assert.match(workflow,/contents: read/);
 assert.doesNotMatch(workflow,/schedule:|workflow_dispatch:|contents: write|secrets\./);
});
