import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {official61SessionSourceReceiptHashBaseV0_1}
 from '../runtime/source_first_official_61_session_collector_v0_1.mjs';
import {candidateSourceRunsForCompletedAuditV0_1 as candidates,
 exactSignedSourceAuditMatchV0_1 as matches,
 requireUniqueExactSourceMatchV0_1 as unique}
 from '../scripts/resolve_data_a1_verified_origin_pair_v0_1.mjs';

const REPO='imihan0630-sys/v7-fugle-worker';
const makeAuditRun=()=>({
 id:500,workflow_id:383035628,
 name:'System2 Shared Official A1 Independent Source Audit (READ ONLY)',
 path:'.github/workflows/system2-shared-official-a1-independent-audit.yml',
 event:'workflow_run',status:'completed',conclusion:'success',
 head_branch:'main',head_sha:'a'.repeat(40),
 created_at:'2026-10-16T16:44:34Z',
 repository:{full_name:REPO}
});
const makeSourceRun=()=>({
 id:499,workflow_id:382852757,
 name:'System2 Shared Official TWSE TPEx A1 Incremental (READ ONLY)',
 path:'.github/workflows/system2-shared-official-a1-incremental-readonly.yml',
 event:'schedule',status:'completed',conclusion:'success',
 head_branch:'main',head_sha:'a'.repeat(40),
 created_at:'2026-10-16T16:42:40Z',
 updated_at:'2026-10-16T16:44:32Z',
 repository:{full_name:REPO}
});
async function signedPair(){
 const source={
  schemaVersion:'S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1',
  marketDate:'2026-10-16',state:'SOURCE_OBSERVED_UNAUDITED',
  calendar:{tradingDates:Array.from({length:61},(_,i)=>{
   const d=new Date('2026-07-01T00:00:00Z');
   d.setUTCDate(d.getUTCDate()+i);
   return d.toISOString().slice(0,10);
  })},
  requestCount:122,plannedMarketDateRequests:122,
  receivedMarketDateCount:122,receipts:Array(122).fill(null).map((_,i)=>({
   market:i%2?'TPEX':'TWSE',marketDate:'2026-10-16',
   capturedAt:'2026-10-16T16:44:00Z'
  })),
  errors:[],bySymbol:{},markets:['TWSE','TPEX'],
  sourceWindowFirstDate:'2026-07-01',sourceWindowLastDate:'2026-10-16',
  sourceRowSymbolWindowsCompleteCount:0,
  sourceQuotaD1Reads:0,sourceQuotaD1Writes:0,
  assessorExecuted:false,qualifiedCandidates:[],selectedCount:null,
  frozenDecisionsDurablyReadBack:false,independentProviderAudited:false,
  noSystem1RuntimeMutations:true
 };
 source.receiptHash=await sha256Hex(official61SessionSourceReceiptHashBaseV0_1(source));
 const audit={
  schemaVersion:'SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1',
  verdict:'ACCEPTED_SOURCE_INTEGRITY_ONLY',marketDate:source.marketDate,
  sourceReceiptHash:source.receiptHash,sourceMarketDatePairsVerified:122,
  originalFilesRehashedAfterDownload:122,originalFilesDecompressedAndParsed:122,
  selectionAuthorized:false,strategyPitCertified:false,frozenWritten:false,
  auditedAtUtc:'2026-10-16T16:45:30Z'
 };
 audit.auditHash=await sha256Hex(audit);
 return {source,audit};
}
test('exact original audit/source run candidate must be successful same code and prior to audit',()=>{
 const found=candidates({auditRun:makeAuditRun(),sourceRuns:[
  makeSourceRun(),{...makeSourceRun(),id:497,head_sha:'b'.repeat(40)},
  {...makeSourceRun(),id:498,updated_at:'2026-10-16T16:45:00Z'},
  {...makeSourceRun(),id:496,conclusion:'failure'},
  {...makeSourceRun(),id:495,repository:{full_name:'foreign/repo'}}
 ]});
 assert.deepEqual(found.map(x=>x.id),[499]);
});
test('reject unrelated audit events, wrong head and missing source archive',()=>{
 assert.throws(()=>candidates({auditRun:{...makeAuditRun(),event:'workflow_dispatch'},
  sourceRuns:[makeSourceRun()]}),/AUDIT_RUN_IDENTITY_OR_CONTEXT_INVALID/);
 assert.throws(()=>candidates({auditRun:makeAuditRun(),
  sourceRuns:[{...makeSourceRun(),head_sha:'b'.repeat(40)}]}),/NO_PLAUSIBLE_COMPLETED_SOURCE_RUN/);
 assert.throws(()=>candidates({auditRun:makeAuditRun(),sourceRuns:[]}),
  /NO_PLAUSIBLE_COMPLETED_SOURCE_RUN/);
});
test('reject duplicate source identity and ambiguous signed matches',()=>{
 assert.throws(()=>candidates({auditRun:makeAuditRun(),
  sourceRuns:[makeSourceRun(),makeSourceRun()]}),/DUPLICATE_SOURCE_RUN_ID/);
 assert.equal(unique([499]),499);
 assert.throws(()=>unique([499,498]),/SOURCE_HASH_MATCH_MISSING_OR_AMBIGUOUS/);
 assert.throws(()=>unique([]),/SOURCE_HASH_MATCH_MISSING_OR_AMBIGUOUS/);
});
test('read-only signed audit must match exact original source hash and exact trading T',async()=>{
 const {source,audit}=await signedPair();
 assert.equal(await matches({auditReceipt:audit,sourceReceipt:source}),true);
 assert.equal(await matches({auditReceipt:audit,
  sourceReceipt:{...source,marketDate:'2026-10-15'}}),false);
 assert.equal(await matches({auditReceipt:audit,
  sourceReceipt:{...source,receiptHash:'0'.repeat(64)}}),false);
});
test('source signature spoofing and independent audit forgery fail closed',async()=>{
 const {source,audit}=await signedPair();
 assert.equal(await matches({auditReceipt:audit,sourceReceipt:{
  ...source,errors:['late but no resign']
 }}),false);
 await assert.rejects(()=>matches({auditReceipt:{
  ...audit,sourceMarketDatePairsVerified:121
 },sourceReceipt:source}),/ORIGINAL_INDEPENDENT_AUDIT_INVALID/);
 await assert.rejects(()=>matches({auditReceipt:{
  ...audit,sourceReceiptHash:'1'.repeat(64)
 },sourceReceipt:source}),/AUDIT_SIGNATURE_REHASH_FAILED/);
});
test('reject clock-after-audit and non-source workflow job',()=>{
 const future={...makeSourceRun(),updated_at:'2026-10-16T16:44:36Z'};
 const other={...makeSourceRun(),path:'.github/workflows/different.yml'};
 assert.throws(()=>candidates({auditRun:makeAuditRun(),sourceRuns:[future,other]}),
  /NO_PLAUSIBLE_COMPLETED_SOURCE_RUN/);
});
