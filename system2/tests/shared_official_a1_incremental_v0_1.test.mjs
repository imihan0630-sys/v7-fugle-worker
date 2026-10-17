import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {missingA1MarketDatePairsAfterFetchV0_1}
 from '../scripts/run_shared_official_a1_incremental_v0_1.mjs';
import {discoverSharedA1PreviousSourceArtifactV0_1}
 from '../scripts/discover_shared_official_a1_seed_v0_1.mjs';
import {gzipSync} from 'node:zlib';
import {normalize,resolve} from 'node:path';
import {loadTrustedOfficialA1OriginalsV0_1,createSourceCacheFetchV0_1}
 from '../runtime/shared_official_a1_verified_seed_v0_1.mjs';
import {resolveLatestClosedTaiwanSessionV0_1,chooseVerifiedSeedArtifactV0_1}
 from '../runtime/shared_official_a1_session_clock_v0_1.mjs';
import {buildSharedOfficialA1MarketManifestV0_1,assertSharedOfficialA1ConsumerBoundaryV0_1}
 from '../../shared-knowledge/market-data/shared_official_a1_manifest_v0_1.mjs';
import {buildOfficialHistoricalA1UrlV0_1}
 from '../runtime/official_historical_a1_source_v0_1.mjs';
import {collectOfficial61SessionWindowToLocalEvidenceV0_1 as collectOriginal}
 from '../scripts/run_source_first_official_61_session_collector_v0_1.mjs';
const digest=x=>createHash('sha256').update(x).digest('hex');
const dates=Array.from({length:61},(_,i)=>{
 const d=new Date('2026-07-01T00:00:00Z');d.setUTCDate(d.getUTCDate()+i);
 return d.toISOString().slice(0,10);
});
const marketDate=dates.at(-1),market='TWSE',date=dates[0],observed='2026-10-08T09:34:00Z';
const url=buildOfficialHistoricalA1UrlV0_1(market,date);
function fixture(){
 const fields=['證券代號','證券名稱','成交股數','成交筆數','成交金額','開盤價','最高價','最低價','收盤價'];
 const data=Array.from({length:600},(_,i)=>{
  const symbol=String(1000+i);
  return [symbol,'真實驗證樣本'+symbol,'10,000','20','100,000','10','11','9','10.5'];
 });
 const body=Buffer.from(JSON.stringify({date:date.replaceAll('-',''),stat:'OK',
   tables:[{fields,data,title:'當日行情'}]}));
 const r={market,marketDate:date,sourceId:'A1_TWSE_MI_INDEX_HISTORICAL_DAILY',
  sourceUrl:url,originalRawResponseSha256:digest(body),
  originalRawResponseBytes:body.length,capturedAt:observed,rowCount:600};
 const receipt={
  schemaVersion:'S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1',
  marketDate,receipts:[r],calendar:{tradingDates:dates},
  receiptHash:'a'.repeat(64),receivedMarketDateCount:1,plannedMarketDateRequests:122,
  state:'INCOMPLETE'
 };
 return {body,receipt,r};
}
test('61 dates must come from official sorted calendar; weekday cannot certify trade day',()=>{
 const official=['2026-10-09','2026-10-12','2026-10-13'];
 const morning=resolveLatestClosedTaiwanSessionV0_1({
  nowUtc:'2026-10-13T01:00:00Z',officialTradingDates:official});
 assert.equal(morning.marketDate,'2026-10-12');
 assert.equal(morning.retrospectiveOnly,true);
 const night=resolveLatestClosedTaiwanSessionV0_1({
  nowUtc:'2026-10-13T12:30:00Z',officialTradingDates:official});
 assert.equal(night.marketDate,'2026-10-13');
 assert.equal(night.retrospectiveOnly,false);
 const holiday=resolveLatestClosedTaiwanSessionV0_1({
  nowUtc:'2026-10-11T09:00:00Z',officialTradingDates:official});
 assert.equal(holiday.state,'SKIPPED_NO_NEW_OFFICIAL_TRADING_DAY');
});
test('19:00 Taipei is PRELIMINARY_SOURCE_REVIEW only, never final selection',()=>{
 const dates=['2026-10-12','2026-10-13'];
 const before=resolveLatestClosedTaiwanSessionV0_1({
  nowUtc:'2026-10-13T10:59:00Z',officialTradingDates:dates});
 assert.equal(before.marketDate,'2026-10-12');
 const after=resolveLatestClosedTaiwanSessionV0_1({
  nowUtc:'2026-10-13T11:01:00Z',officialTradingDates:dates});
 assert.equal(after.marketDate,'2026-10-13');
 assert.equal(after.sourceReviewClass,'PRELIMINARY_SOURCE_REVIEW_ONLY');
 assert.equal(after.todayProviderFinalityNotAsserted,true);
 assert.equal(after.retrospectiveOnly,false);
 const late=resolveLatestClosedTaiwanSessionV0_1({
  nowUtc:'2026-10-13T15:45:00Z',officialTradingDates:dates});
 assert.equal(late.marketDate,'2026-10-13');
 assert.equal(late.sourceReviewClass,'READONLY_SOURCE_CAPTURE_NOT_FINAL_FREEZE');
});
test('original gzip replay independently checks exact bytes, market/date, known source and time',async()=>{
 const f=fixture();
 const saved=JSON.stringify(f.receipt);
 const prefix='/tmp/verify-originals';
 const read=async(path,encoding)=>{
  if(normalize(String(path))===normalize('/tmp/seed-receipt.json'))return saved;
  if(normalize(String(path))===normalize(resolve(prefix,market+'-'+date+'.json.gz')))return gzipSync(f.body);
  throw Error('UNEXPECTED_SOURCE_FILE');
 };
 const result=await loadTrustedOfficialA1OriginalsV0_1({
  evidenceFile:'/tmp/seed-receipt.json',originalDir:prefix,
  neededTradingDates:dates,now:()=>new Date('2026-10-13T13:00:00Z'),read
 });
 assert.equal(result.trustedReusedOriginalCount,1);
 assert.equal(result.missingPairs.length,121);
 assert.equal(result.storedOriginals.get(url).observedAt,observed);
 let networkCalls=0;
 const wrapped=createSourceCacheFetchV0_1(result,async()=>{
  networkCalls++;throw Error('SHOULD_NOT_FETCH_REUSED_OFFICIAL_PAIR');
 });
 const response=await wrapped(url,{method:'GET'});
 assert.equal(response.ok,true);
 assert.equal(digest(Buffer.from(await response.arrayBuffer())),f.r.originalRawResponseSha256);
 assert.equal(networkCalls,0);
 await assert.rejects(()=>wrapped(url,{method:'POST'}),/GET_ONLY/);
});
test('tampered original body must be rejected before any strategy sees it',async()=>{
 const f=fixture(),raw=Buffer.from(f.body);
 raw[10]^=1;
 await assert.rejects(()=>loadTrustedOfficialA1OriginalsV0_1({
  evidenceFile:'/tmp/seed-receipt.json',originalDir:'/tmp/seed',
  neededTradingDates:dates,
  read:async(path)=>String(path).endsWith('.json.gz')?gzipSync(raw):JSON.stringify(f.receipt)
 }),/HASH_MISMATCH/);
});
test('wrong provider endpoint, dated source or duplicated market-date never reused',async()=>{
 for(const mutation of [
  r=>{r.sourceUrl='https://untrusted.invalid/'},
  r=>{r.marketDate='2026-07-44'},
  r=>{r.capturedAt='2030-01-01T00:00:00Z'},
 ]){
  const f=fixture();mutation(f.receipt.receipts[0]);
  await assert.rejects(()=>loadTrustedOfficialA1OriginalsV0_1({
   evidenceFile:'/tmp/test',originalDir:'/tmp/seed',neededTradingDates:dates,
   read:async(path)=>String(path).endsWith('.json.gz')?gzipSync(f.body):JSON.stringify(f.receipt)
  }));
 }
 const f=fixture();f.receipt.receipts.push({...f.r});
 await assert.rejects(()=>loadTrustedOfficialA1OriginalsV0_1({
  evidenceFile:'/tmp/test',originalDir:'/tmp/seed',neededTradingDates:dates,
  read:async(path)=>String(path).endsWith('.json.gz')?gzipSync(f.body):JSON.stringify(f.receipt)
 }),/DUPLICATE_DATE_MARKET/);
});
test('shared manifest is research-only for both independent systems, never Formals or Frozen',()=>{
 const f=fixture();
 const m=buildSharedOfficialA1MarketManifestV0_1({
  sourceReceipt:f.receipt,issuedAtUtc:'2026-10-13T13:12:00Z',runId:'TEST'
 });
 assert.equal(m.sourceMarketDatePairsValidated,1);
 assert.equal(m.sourceCoverage,'INCOMPLETE_SOURCE_CAPTURE');
 assert.equal(m.storageClass,'GITHUB_ACTIONS_EPHEMERAL_7D');
 assert.equal(m.shortTermCacheMaxRetentionDays,7);
 assert.equal(m.immutableStorageIndependentAudited,false);
 assert.equal(m.sourceRowsEligibleAsSystem1FormalInputs,false);
 assert.equal(m.sourceRowsEligibleAsSystem2FrozenSelection,false);
 assert.equal(m.sourceBlobs[0].firstCapturedAtUtc,observed);
 for(const system of ['SYSTEM1','SYSTEM2']){
  const ok=assertSharedOfficialA1ConsumerBoundaryV0_1(m,{
   system,purpose:'READ_ONLY_SOURCE_RESEARCH'
  });
  assert.equal(ok.mutableD1AccessGranted,false);
 }
 assert.throws(()=>assertSharedOfficialA1ConsumerBoundaryV0_1(m,{
  system:'SYSTEM1',purpose:'FORMAL_SELECT'
 }),/TRADING_DECISION_NOT_AUTHORIZED/);
 assert.throws(()=>assertSharedOfficialA1ConsumerBoundaryV0_1({...m,selectedCount:3},{
  system:'SYSTEM2',purpose:'READ_ONLY_SOURCE_RESEARCH'
 }),/HASH_MISMATCH/);
 assert.throws(()=>buildSharedOfficialA1MarketManifestV0_1({
  sourceReceipt:f.receipt,issuedAtUtc:'2026-10-13T13:12:00Z',
  storageClass:'GITHUB_VERSIONED_IMMUTABLE_BY_CONTENT_HASH_VERIFIED'
 }),/DURABLE_STORAGE_NOT_YET_AUDITED/);
});
test('current run cannot seed from itself, expired artifact is not accepted',()=>{
 const q=chooseVerifiedSeedArtifactV0_1({currentRunId:80,artifacts:[
  {id:1,name:'s2-shared-official-a1-80',expired:false,created_at:'2026-10-13T12:00:00Z',workflow_run:{id:80}},
  {id:2,name:'s2-shared-official-a1-70',expired:true,created_at:'2026-10-13T11:00:00Z',workflow_run:{id:70}},
  {id:3,name:'s2-shared-official-a1-60',expired:false,created_at:'2026-10-13T10:00:00Z',workflow_run:{id:60}}
 ]});
 assert.equal(q.runId,60);
});
console.log('Shared Official 61-Day A1 research-only reuse, clock and provenance guard: PASS');

test('manifest cache duration always matches scheduled workflow and forbids 90-day false labeling',async()=>{
 const {readFileSync}=await import('node:fs');
 const w=readFileSync('.github/workflows/system2-shared-official-a1-incremental-readonly.yml','utf8');
 assert.match(w,/retention-days:\s*7\b/);
 assert.doesNotMatch(w,/contents:\s*write/);
 const p=fixture();
 const m=buildSharedOfficialA1MarketManifestV0_1({
  sourceReceipt:p.receipt,issuedAtUtc:'2026-10-13T13:15:00Z'
 });
 assert.equal(m.shortTermCacheMaxRetentionDays,7);
 assert.equal(m.storageClass,'GITHUB_ACTIONS_EPHEMERAL_7D');
});


test('existing source workflow physically verifies main seed-loader code changes without new cron or writes',async()=>{
 const {readFileSync}=await import('node:fs');
 const y=readFileSync('.github/workflows/system2-shared-official-a1-incremental-readonly.yml','utf8');
 const push=y.split('  push:')[1]?.split('  schedule:')[0];
 assert.ok(push,'main push trigger must remain present');
 for(const p of [
  '.github/workflows/system2-shared-official-a1-incremental-readonly.yml',
  'system2/scripts/discover_shared_official_a1_seed_v0_1.mjs',
  'system2/scripts/run_shared_official_a1_incremental_v0_1.mjs',
 ])assert.ok(push.includes(p),'source-critical code needs same read-only physical validation: '+p);
 assert.ok(y.includes('contents: read'));
 assert.ok(y.includes('actions: read'));
 assert.equal(y.includes('contents: write'),false);
 assert.equal(y.includes('secrets.'),false);
 assert.match(y,/cancel-in-progress: false/);
 assert.ok(y.includes('retention-days: 7'));
});

test('20:15/23:45 T source-only attempts plus 00:15 same-T recovery never grant Frozen authority',async()=>{
 const {readFileSync}=await import('node:fs');
 const w=readFileSync('.github/workflows/system2-shared-official-a1-incremental-readonly.yml','utf8');
 const crons=[...w.matchAll(/-\s+cron:\s*"([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(crons,['15 12 * * 1-5','45 15 * * 1-5','15 16 * * 1-5']);
 assert.equal(new Set(crons).size,3);
 // GitHub Actions uses UTC cron; exactly 20:15, 23:45 and T+1 00:15 Taipei.
 // The extra early run is still the existing RESEARCH-ONLY A1 workflow.
 assert.match(w,/20:15 is an additional source-observation opportunity only/);
 assert.match(w,/no rank, PIT qualification, capacity or Frozen may be inferred/);
 assert.match(w,/contents:\s*read/);
 assert.match(w,/actions:\s*read/);
 assert.doesNotMatch(w,/contents:\s*write|schedule:[\s\S]*secret:|secrets\./);
 assert.match(w,/NO.*final|FINAL_FROZEN|FINAL_FROZEN capacity/i);
 const tradingDates=['2026-10-13','2026-10-14'];
 const early=resolveLatestClosedTaiwanSessionV0_1({
  nowUtc:'2026-10-14T12:15:00Z',officialTradingDates:tradingDates
 });
 assert.equal(early.marketDate,'2026-10-14');
 assert.equal(early.retrospectiveOnly,false);
 assert.equal(early.conditionalNextDayRecovery,false);
 assert.equal(early.sourceReviewClass,'PRELIMINARY_SOURCE_REVIEW_ONLY');
 assert.equal(early.todayProviderFinalityNotAsserted,true);
 const earlier=resolveLatestClosedTaiwanSessionV0_1({
  nowUtc:'2026-10-14T15:45:00Z',officialTradingDates:tradingDates
 });
 assert.equal(earlier.marketDate,'2026-10-14');
 assert.equal(earlier.retrospectiveOnly,false);
 assert.equal(earlier.sourceReviewClass,'READONLY_SOURCE_CAPTURE_NOT_FINAL_FREEZE');
 assert.equal(earlier.sourceWasPublishedByThisResolver,undefined);
 const fallback=resolveLatestClosedTaiwanSessionV0_1({
  nowUtc:'2026-10-14T16:15:00Z',officialTradingDates:tradingDates
 });
 assert.equal(fallback.marketDate,'2026-10-14');
 assert.equal(fallback.taipeiDate,'2026-10-15');
 assert.equal(fallback.retrospectiveOnly,false);
 assert.equal(fallback.conditionalNextDayRecovery,true);
 assert.equal(fallback.todayProviderFinalityNotAsserted,true);
 const unchangedAtNineteen=resolveLatestClosedTaiwanSessionV0_1({
  nowUtc:'2026-10-14T11:00:00Z',officialTradingDates:tradingDates
 });
 assert.equal(unchangedAtNineteen.sourceReviewClass,'PRELIMINARY_SOURCE_REVIEW_ONLY');
 const holiday=resolveLatestClosedTaiwanSessionV0_1({
  nowUtc:'2026-10-16T15:45:00Z',officialTradingDates:tradingDates
 });
 assert.equal(holiday.state,'SKIPPED_NO_NEW_OFFICIAL_TRADING_DAY');
});


test('00:15 T+1 actual observation is source recovery, not retrospective historical backfill',()=>{
 const sessions=['2026-10-12','2026-10-13','2026-10-14'];
 for(const utc of ['2026-10-14T16:00:00Z','2026-10-14T16:15:00Z',
    '2026-10-14T17:59:00Z']){
  const r=resolveLatestClosedTaiwanSessionV0_1({
   nowUtc:utc,officialTradingDates:sessions
  });
  assert.equal(r.marketDate,'2026-10-14');
  assert.equal(r.conditionalNextDayRecovery,true);
  assert.equal(r.retrospectiveOnly,false);
  assert.equal(r.todayProviderFinalityNotAsserted,true);
 }
 const delayed=resolveLatestClosedTaiwanSessionV0_1({
  nowUtc:'2026-10-14T18:00:00Z',officialTradingDates:sessions
 });
 assert.equal(delayed.conditionalNextDayRecovery,false);
 assert.equal(delayed.retrospectiveOnly,true);
 assert.equal(delayed.marketDate,'2026-10-14');
 const tooLate=resolveLatestClosedTaiwanSessionV0_1({
  nowUtc:'2026-10-14T21:12:00Z',officialTradingDates:sessions
 });
 assert.equal(tooLate.conditionalNextDayRecovery,false);
 assert.equal(tooLate.retrospectiveOnly,true);
});
test('source original collector independently rejects a forged or delayed T+1 recovery flag',async()=>{
 const safeFetch=async()=>{throw Error('NETWORK_WOULD_NOT_BE_USED')};
 const stubCalendar=async()=>{throw Error('TEST_CALENDAR_PROVIDER_NOT_PRESENT')};
 const mk=(stamp,extra={})=>collectOriginal({
  marketDate:'2026-10-14',conditionalNextDayRecovery:true,
  outputDir:'/tmp/s2-m09-clock-only-test-fixture',
  now:()=>new Date(stamp),calendarResolver:stubCalendar,fetchImpl:safeFetch,
  ...extra,
 });
 await assert.rejects(()=>mk('2026-10-14T16:15:00Z'),
  /TEST_CALENDAR_PROVIDER_NOT_PRESENT/);
 await assert.rejects(()=>mk('2026-10-14T17:59:59Z'),
  /TEST_CALENDAR_PROVIDER_NOT_PRESENT/);
 for(const invalid of ['2026-10-14T18:00:00Z',
    '2026-10-15T16:15:00Z','2026-10-14T15:45:00Z']){
  await assert.rejects(()=>mk(invalid),/CONDITIONAL_T_PLUS_ONE_RECOVERY_CLOCK_INVALID/);
 }
 await assert.rejects(()=>mk('2026-10-14T16:15:00Z',
  {retrospectiveDiagnosticOnly:true}),/CONDITIONAL_T_PLUS_ONE_RECOVERY_CLOCK_INVALID/);
});


function upstreamRun(id,overrides={}){
 return {id,status:'completed',conclusion:'success',head_branch:'main',
  event:'schedule',...overrides};
}
function upstreamArtifact(id,overrides={}){
 return {id:id+10000,name:'s2-shared-official-a1-'+id,expired:false,
  size_in_bytes:40641415,workflow_run:{id},...overrides};
}
function mockSeedLookup(runs,artifactsByRun,calls){
 return async endpoint=>{
  calls.push(endpoint);
  if(endpoint.includes('/workflows/'))return {workflow_runs:runs};
  const id=Number(endpoint.match(/\/actions\/runs\/(\d+)\/artifacts/)[1]);
  return {artifacts:artifactsByRun[id]||[]};
 };
}
test('seed chooser skips failed or not-main source runs, selects exact successful main',async()=>{
 const calls=[];
 const got=await discoverSharedA1PreviousSourceArtifactV0_1({
  token:'test-token-not-real',currentRunId:301,
  apiFetch:mockSeedLookup([
    upstreamRun(300,{conclusion:'failure'}),
    upstreamRun(299,{head_branch:'test-branch'}),
    upstreamRun(298,{event:'pull_request'}),
    upstreamRun(297)
  ],{300:[upstreamArtifact(300)],299:[upstreamArtifact(299)],
     298:[upstreamArtifact(298)],297:[upstreamArtifact(297)]},calls)
 });
 assert.equal(got.runId,297);
 assert.equal(got.artifactName,'s2-shared-official-a1-297');
 assert.equal(got.kind,'VERIFIED_PRIOR_PIPELINE_ARTIFACT_AVAILABLE');
 assert.equal(calls.length,2);
 assert.match(calls[1],/\/actions\/runs\/297\/artifacts/);
});
test('weekend/holiday successful SKIP attachment is tiny and cannot poison next T seed reuse',async()=>{
 const calls=[];
 const got=await discoverSharedA1PreviousSourceArtifactV0_1({
  token:'test-token-not-real',currentRunId:306,
  apiFetch:mockSeedLookup([upstreamRun(305),upstreamRun(304)],
   {305:[upstreamArtifact(305,{size_in_bytes:1308})],
    304:[upstreamArtifact(304,{size_in_bytes:40641415})]},calls)
 });
 assert.equal(got.runId,304);
 assert.equal(got.artifactName,'s2-shared-official-a1-304');
 assert.equal(got.kind,'VERIFIED_PRIOR_PIPELINE_ARTIFACT_AVAILABLE');
 assert.equal(calls.length,3);
});
test('only tiny skipped artifacts cannot be treated as a true 61-session ZIP even when GH success',async()=>{
 const got=await discoverSharedA1PreviousSourceArtifactV0_1({
  token:'test-token-not-real',currentRunId:306,
  apiFetch:mockSeedLookup([upstreamRun(305),upstreamRun(304)],
   {305:[upstreamArtifact(305,{size_in_bytes:1308})],
    304:[upstreamArtifact(304,{size_in_bytes:0})]},[])
 });
 assert.equal(got.kind,'INITIAL_REAL_PROVIDER_UNAUDITED_SEED');
 assert.equal(got.runId,38317682441);
});
test('conservative skip-size guard is seed optimization only; 64KiB does not certify any source',async()=>{
 const {MIN_SHARED_A1_REUSABLE_SEED_ZIP_BYTES_V0_1:min}=await import(
  '../scripts/discover_shared_official_a1_seed_v0_1.mjs');
 assert.equal(min,65536);
 const got=await discoverSharedA1PreviousSourceArtifactV0_1({
  token:'test-token-not-real',currentRunId:306,
  apiFetch:mockSeedLookup([upstreamRun(305)],
   {305:[upstreamArtifact(305,{size_in_bytes:65536})]},[])
 });
 assert.equal(got.kind,'VERIFIED_PRIOR_PIPELINE_ARTIFACT_AVAILABLE');
 assert.equal(got.runId,305);
 // Admission is reserved for the existing byte-SHA, official date,
 // 122-original content and independent audit. The chooser only
 // returns an artifact identity, not selection/PIT/Frozen authority.
 assert.deepEqual(Object.keys(got).sort(),['artifactName','kind','runId']);
});
test('matching prefix or forged cross-run attachment cannot seed source originals',async()=>{
 const calls=[];
 const got=await discoverSharedA1PreviousSourceArtifactV0_1({
  token:'test-token-not-real',currentRunId:301,
  apiFetch:mockSeedLookup([upstreamRun(300),upstreamRun(299)],
   {300:[
    upstreamArtifact(300,{name:'s2-shared-official-a1-300-FAKE'}),
    upstreamArtifact(300,{workflow_run:{id:299}}),
    upstreamArtifact(300,{expired:true})
   ],299:[upstreamArtifact(299,{size_in_bytes:0})]},calls)
 });
 assert.equal(got.kind,'INITIAL_REAL_PROVIDER_UNAUDITED_SEED');
 assert.equal(got.runId,38317682441);
 assert.equal(calls.length,3);
});
test('valid main source run with provenance matching attached artifact is reusable',async()=>{
 for(const event of ['push','schedule','workflow_dispatch']){
  const got=await discoverSharedA1PreviousSourceArtifactV0_1({
   token:'test-token-not-real',currentRunId:20,
   apiFetch:mockSeedLookup([upstreamRun(19,{event})],
    {19:[upstreamArtifact(19)]},[])
  });
  assert.equal(got.runId,19);
 }
});
test('the current run can never reuse itself even if its old-looking artifact exists',async()=>{
 const calls=[];
 const got=await discoverSharedA1PreviousSourceArtifactV0_1({
  token:'test-token-not-real',currentRunId:55,
  apiFetch:mockSeedLookup([upstreamRun(55)],{55:[upstreamArtifact(55)]},calls)
 });
 assert.equal(got.kind,'INITIAL_REAL_PROVIDER_UNAUDITED_SEED');
 assert.equal(calls.length,1);
});


test('121/122 after physical capture reports EXACT missing official exchange/date',()=>{
 const all=dates.flatMap(date=>['TWSE','TPEX'].map(market=>({market,marketDate:date})));
 const absent=all.pop();
 const evidence=missingA1MarketDatePairsAfterFetchV0_1({
  tradingDates:dates,receipts:all,
  errors:[{market:absent.market,date:absent.marketDate,code:'OFFICIAL_DATE_CAPTURE_FAILED'}]
 });
 assert.deepEqual(evidence,[{market:'TPEX',date:marketDate,
  reasonCode:'OFFICIAL_DATE_CAPTURE_FAILED'}]);
 assert.equal(all.length,121);
});
test('complete 122/122 official original pair set has NO after-fetch gaps',()=>{
 const all=dates.flatMap(date=>['TWSE','TPEX'].map(market=>({market,marketDate:date})));
 assert.deepEqual(missingA1MarketDatePairsAfterFetchV0_1({
  tradingDates:dates,receipts:all,errors:[]
 }),[]);
});
test('provider exception is NOT echoed to logs as raw URL or text',()=>{
 const evidence=missingA1MarketDatePairsAfterFetchV0_1({
  tradingDates:dates,receipts:[],
  errors:[{market:'TWSE',date:marketDate,
   code:'HTTP500 https://sensitive.example.invalid/?token=SECRET'}]
 });
 const t=evidence.find(x=>x.market==='TWSE'&&x.date===marketDate);
 assert.equal(t.reasonCode,'SOURCE_MISSING_REASON_UNKNOWN');
 assert.doesNotMatch(JSON.stringify(evidence),/sensitive|SECRET/);
});
test('unordered/incomplete calendar cannot manufacture an accepted missing pair scope',()=>{
 assert.throws(()=>missingA1MarketDatePairsAfterFetchV0_1({
  tradingDates:[dates[0]],receipts:[]
 }),/DIAGNOSTIC_INPUT_INVALID/);
 assert.throws(()=>missingA1MarketDatePairsAfterFetchV0_1({
  tradingDates:[...dates.slice(0,-1),dates[0]],receipts:[]
 }),/DIAGNOSTIC_INPUT_INVALID/);
});
