import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
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
