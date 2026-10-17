import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {official61SessionSourceReceiptHashBaseV0_1}
 from '../runtime/source_first_official_61_session_collector_v0_1.mjs';
import {buildSharedOfficialA1MarketManifestV0_1}
 from '../../shared-knowledge/market-data/shared_official_a1_manifest_v0_1.mjs';
import {makeA1GithubOriginV0_1}
 from '../scripts/record_shared_a1_github_schedule_origin_v0_1.mjs';
import {buildA1DualAcceptanceV0_1}
 from '../runtime/a1_source_schedule_dual_acceptance_v0_1.mjs';
import {reconcileNativeA1CronSourceAuditChainV0_1 as reconcile}
 from '../migration/issue1068_a1_native_cron_source_audit_chain_v0_1.mjs';
const REPO='imihan0630-sys/v7-fugle-worker',SHA='a'.repeat(40);
const SRC='.github/workflows/system2-shared-official-a1-incremental-readonly.yml';
const AUD='.github/workflows/system2-shared-official-a1-independent-audit.yml';
async function fixture({event='schedule',cron='15 12 * * 1-5',late=true}={}){
 const sourceCreated=late?'2026-10-16T16:42:40Z':'2026-10-16T12:16:00Z';
 const sourceStarted=late?'2026-10-16T16:42:44Z':'2026-10-16T12:16:10Z';
 const sourceCompleted=late?'2026-10-16T16:44:32Z':'2026-10-16T12:17:00Z';
 const targetCapture=late?'2026-10-16T16:44:22.393Z':'2026-10-16T12:16:40.000Z';
 const auditCreated=late?'2026-10-16T16:44:34Z':'2026-10-16T12:17:20Z';
 const audited=late?'2026-10-16T16:44:57.000Z':'2026-10-16T12:17:50.000Z';
 const stageAt=late?'2026-10-16T16:45:05.000Z':'2026-10-16T12:18:00.000Z';
 const dates=Array.from({length:61},(_,i)=>{
  const d=new Date('2026-10-16T00:00:00Z');d.setUTCDate(d.getUTCDate()-(60-i));
  return d.toISOString().slice(0,10);
 });
 const receipts=[];
 for(const [i,date] of dates.entries())for(const market of ['TWSE','TPEX']){
  receipts.push({market,marketDate:date,sourceId:market+'_NATIVE',
   sourceUrl:'https://example.test/'+market+'/'+date,
   providerReportedDate:date,originalRawResponseSha256:'a'.repeat(64),
   originalRawResponseBytes:1000,capturedAt:i===60?targetCapture:'2026-10-12T00:00:00.000Z',
   rowCount:market==='TWSE'?700:550,rawProviderBytesPreserved:true});
 }
 const sb={
  schemaVersion:'S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1',
  marketDate:'2026-10-16',calendar:{
   state:'SOURCE_OBSERVED_UNAUDITED',marketDate:'2026-10-16',
   tradingDates:dates,observedAt:'2026-10-16T11:00:00Z',
   providerSource:'FIXTURE_NOT_PROVIDER',verifiedOfficialReadback:false,
   originalCalendarHash:'b'.repeat(64)
  },
  state:'SOURCE_OBSERVED_UNAUDITED',requestCount:122,
  plannedMarketDateRequests:122,receivedMarketDateCount:122,
  sourceWindowFirstDate:dates[0],sourceWindowLastDate:dates.at(-1),
  sourceRowSymbolWindowsCompleteCount:0,markets:['TWSE','TPEX'],
  receipts,errors:[],bySymbol:{},sourceQuotaD1Reads:0,sourceQuotaD1Writes:0,
  assessorExecuted:false,qualifiedCandidates:null,selectedCount:null,
  frozenDecisionsDurablyReadBack:false,independentProviderAudited:false,
  noSystem1RuntimeMutations:true
 };
 const sourceReceipt={...sb,receiptHash:await sha256Hex(
  official61SessionSourceReceiptHashBaseV0_1(sb))};
 const runId=38934081985,auditRunId=38934321405;
 const manifest=buildSharedOfficialA1MarketManifestV0_1({
  sourceReceipt,issuedAtUtc:sourceCompleted.replace('Z','.000Z'),
  runId:String(runId),commitSha:SHA
 });
 const origin=await makeA1GithubOriginV0_1({
  eventName:event,event:event==='schedule'?{schedule:cron}:{},
  runId,runAttempt:1,codeSha:SHA
 });
 const sourceRun={id:runId,repository:{full_name:REPO},
  head_repository:{full_name:REPO},name:'System2 Shared Official TWSE TPEx A1 Incremental (READ ONLY)',
  path:SRC,event,head_branch:'main',head_sha:SHA,
  status:'completed',conclusion:'success',run_attempt:1,
  created_at:sourceCreated,run_started_at:sourceStarted
 };
 const sourceJob={id:117085046435,name:'current_source',run_id:runId,
  status:'completed',conclusion:'success',started_at:sourceStarted,
  completed_at:sourceCompleted};
 const auditBase={
  schemaVersion:'SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1',
  verdict:'ACCEPTED_SOURCE_INTEGRITY_ONLY',
  marketDate:sourceReceipt.marketDate,manifestSha256:manifest.manifestSha256,
  sourceReceiptHash:sourceReceipt.receiptHash,auditedAtUtc:audited,
  sourceMarketDatePairsVerified:122,originalFilesRehashedAfterDownload:122,
  originalFilesDecompressedAndParsed:122,
  officialCalendarTradingDatesVerified:61,
  selectionAuthorized:false,strategyPitCertified:false,frozenWritten:false,
 };
 const auditReceipt={...auditBase,auditHash:await sha256Hex(auditBase)};
 const auditRun={id:auditRunId,repository:{full_name:REPO},
  head_repository:{full_name:REPO},name:'System2 Shared Official A1 Independent Source Audit (READ ONLY)',
  path:AUD,event:'workflow_run',head_branch:'main',head_sha:SHA,
  status:'completed',conclusion:'success',created_at:auditCreated,
  run_started_at:auditCreated
 };
 const stage1Summary={marketDate:'2026-10-16',freezeAtUtc:stageAt,
  state:'STAGE1_RESEARCH_EXECUTED_PIT_CONTINUITY_GATED',
  selectedCount:null,zeroPickDay:null,selectionAuthorized:false,
  frozenDecisionWritten:false};
 const dualReceipt=await buildA1DualAcceptanceV0_1({
  origin,sourceRun,sourceJob,sourceReceipt,independentAudit:auditReceipt,
  stage1Summary,observedAtUtc:'2026-10-17T00:30:00.000Z'
 });
 return {origin,sourceReceipt,manifest,sourceRun,sourceJob,
  auditReceipt,auditRun,dualReceipt,producerArtifactId:12060640574,
  auditArtifactId:12060227504,dualArtifactId:12058994846};
}
test('source schedule true and 122 original pairs, but 267-minute delay and late T stay separately blocked',async()=>{
 const a=await fixture();const r=await reconcile(a);
 assert.equal(r.sourceScheduleEventIndependentlyVerified,true);
 assert.equal(r.exactEventCron,'15 12 * * 1-5');
 assert.equal(r.scheduleEnqueueDelayMinutes,267.667);
 assert.equal(r.schedulePunctualWithin15m,false);
 assert.equal(r.originalSourceMarketPairsIndependentlyAudited,122);
 assert.equal(r.targetDayNativeSourceCapturedBeforeCut,false);
 assert.equal(r.originalTargetDecisionCutSourceReady,false);
 assert.equal(r.completedDailySchemeCAutomaticConsumerCertified,false);
 assert.equal(r.sameDayStrategyPITCertified,false);
 assert.equal(r.selectedCount,null);assert.equal(r.zeroPickDay,null);
 assert.equal(r.frozenD1Written,false);
 const {receiptHash,...base}=r;
 assert.equal(receiptHash,await sha256Hex(base));
});
test('simulated on-time SOURCE and audit only certify source timeliness, never strategy or completed consumer',async()=>{
 const a=await fixture({late:false});
 const r=await reconcile(a);
 assert.equal(r.sourceScheduleEventIndependentlyVerified,true);
 assert.equal(r.originalTargetDecisionCutSourceReady,true);
 assert.equal(r.sameDayStrategyPITCertified,false);
 assert.equal(r.completedDailySchemeCAutomaticConsumerCertified,false);
});
test('push origin is genuinely non-scheduled even if 122 and source clock accepted',async()=>{
 const a=await fixture({event:'push'});
 const r=await reconcile(a);
 assert.equal(r.sourceScheduleEventIndependentlyVerified,false);
 assert.equal(r.exactEventCron,null);
 assert.equal(r.schedulePunctualWithin15m,null);
});
test('does not accept wrong signed native source event cron or run SHA',async()=>{
 const a=await fixture();
 a.origin.eventSchedule='45 15 * * 1-5';
 await assert.rejects(()=>reconcile(a),/ORIGINAL_GITHUB_EVENT_PAYLOAD_IDENTITY_OR_HASH/);
 const b=await fixture();b.sourceRun.head_sha='b'.repeat(40);
 await assert.rejects(()=>reconcile(b),/ORIGINAL_GITHUB_EVENT_PAYLOAD_IDENTITY_OR_HASH|ORIGINAL_GITHUB_REST/);
});
test('does not accept sibling audit run with wrong origin or date',async()=>{
 const a=await fixture();a.auditRun.event='workflow_dispatch';
 await assert.rejects(()=>reconcile(a),/ORIGINAL_GITHUB_REST/);
 const b=await fixture();b.auditRun.head_sha='b'.repeat(40);
 await assert.rejects(()=>reconcile(b),/ORIGINAL_GITHUB_REST/);
});
test('source receipt edited or cross-run audit source hash cannot be laundered',async()=>{
 const a=await fixture();a.sourceReceipt.receipts[1].capturedAt='2026-10-17T01:00:00.000Z';
 await assert.rejects(()=>reconcile(a),/SAME_ORIGINAL_SOURCE_RECEIPT_AND_MANIFEST/);
 const b=await fixture();b.auditReceipt.sourceReceiptHash='f'.repeat(64);
 await assert.rejects(()=>reconcile(b),/INDEPENDENT_AUDIT_SOURCE_RECEIPT/);
});
test('source 121/122 cannot borrow a dual 122/122 PASS',async()=>{
 const a=await fixture();a.sourceReceipt.receipts.pop();
 await assert.rejects(()=>reconcile(a),/SAME_ORIGINAL_SOURCE_RECEIPT_AND_MANIFEST/);
});
test('dual original GH source schedule hash, timeline or audit clock mutation rejected',async()=>{
 const a=await fixture();a.dualReceipt.originalEventOriginHash='0'.repeat(64);
 await assert.rejects(()=>reconcile(a),/SIGNED_DUAL_ORIGIN_CLOCK/);
 const b=await fixture();b.auditReceipt.auditedAtUtc='2026-10-16T16:41:00.000Z';
 await assert.rejects(()=>reconcile(b),/INDEPENDENT_AUDIT_SOURCE_RECEIPT/);
});
test('Data-only PR replay workflow cannot add new Cron, cloud writer, or formal selection',async()=>{
 const w=await readFile('.github/workflows/system2-data-a1-native-cron-audit-chain-replay.yml','utf8');
 assert.match(w,/event: pull_request/);
 assert.match(w,/actions\/download-artifact@v4/);
 assert.match(w,/issue1068_a1_native_cron_source_audit_chain_v0_1.mjs/);
 assert.doesNotMatch(w,/^  schedule:|cloudflare\.com|wrangler deploy|secrets\./m);
 assert.match(w,/contents: read/);
});
