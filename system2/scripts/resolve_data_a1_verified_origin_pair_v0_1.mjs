// DATA #1068: join a genuinely completed independent A1 source audit back to
// ONE exact original source run by signed SOURCE RECEIPT HASH, not clock proximity.
// READ-ONLY GitHub Actions archives; no exchange GET, D1/R2, strategy or Frozen.
// The workflow_run webhook provides the AUDIT ID, never a trusted source ID.
import {execFileSync} from 'node:child_process';
import {readFile,appendFile,mkdir,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {official61SessionSourceReceiptHashBaseV0_1}
 from '../runtime/source_first_official_61_session_collector_v0_1.mjs';

const REPO='imihan0630-sys/v7-fugle-worker';
const SOURCE_WORKFLOW_ID=382852757;
const AUDIT_WORKFLOW_ID=383035628;
const SRC='.github/workflows/system2-shared-official-a1-incremental-readonly.yml';
const AUD='.github/workflows/system2-shared-official-a1-independent-audit.yml';
const SOURCE_NAME='System2 Shared Official TWSE TPEx A1 Incremental (READ ONLY)';
const AUDIT_NAME='System2 Shared Official A1 Independent Source Audit (READ ONLY)';
const HASH=/^[a-f0-9]{64}$/;
const SHA=/^[a-f0-9]{40}$/;
const DAY=/^\d{4}-\d\d-\d\d$/;
const LIMIT_MS=48*60*60*1000;
const fail=code=>{throw Error('DATA_A1_AUTO_AUDIT_PAIR_'+code)};
const stamp=x=>typeof x==='string'&&Number.isFinite(Date.parse(x))&&
 /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(x);
const num=x=>Number.isSafeInteger(x)&&x>0;

export function candidateSourceRunsForCompletedAuditV0_1({auditRun,sourceRuns}={}){
 if(!num(auditRun?.id)||auditRun.workflow_id!==AUDIT_WORKFLOW_ID||
  auditRun.name!==AUDIT_NAME||auditRun.path!==AUD||
  auditRun.event!=='workflow_run'||auditRun.status!=='completed'||
  auditRun.conclusion!=='success'||auditRun.head_branch!=='main'||
  auditRun.repository?.full_name!==REPO||
  !SHA.test(auditRun.head_sha||'')||!stamp(auditRun.created_at)||
  !Array.isArray(sourceRuns)||sourceRuns.length>100)
   fail('AUDIT_RUN_IDENTITY_OR_CONTEXT_INVALID');
 const seen=new Set();
 const out=[];
 for(const run of sourceRuns){
  if(run?.workflow_id!==SOURCE_WORKFLOW_ID||run.path!==SRC||
     run.name!==SOURCE_NAME||run.repository?.full_name!==REPO||
     run.head_branch!=='main'||run.head_sha!==auditRun.head_sha||
     !['schedule','push','workflow_dispatch'].includes(run.event)||
     run.status!=='completed'||run.conclusion!=='success'||
     !num(run.id)||!stamp(run.updated_at)||!stamp(run.created_at))
    continue;
  const delay=Date.parse(auditRun.created_at)-Date.parse(run.updated_at);
  if(delay<0||delay>LIMIT_MS)continue;
  if(seen.has(run.id))fail('DUPLICATE_SOURCE_RUN_ID');
  seen.add(run.id);
  out.push(run);
 }
 if(out.length===0)fail('NO_PLAUSIBLE_COMPLETED_SOURCE_RUN');
 return out.sort((a,b)=>a.id-b.id);
}
export async function exactSignedSourceAuditMatchV0_1({auditReceipt,sourceReceipt}={}){
 if(auditReceipt?.schemaVersion!=='SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1'||
   auditReceipt.verdict!=='ACCEPTED_SOURCE_INTEGRITY_ONLY'||
   !DAY.test(auditReceipt.marketDate||'')||
   auditReceipt.sourceMarketDatePairsVerified!==122||
   auditReceipt.originalFilesRehashedAfterDownload!==122||
   auditReceipt.originalFilesDecompressedAndParsed!==122||
   auditReceipt.selectionAuthorized!==false||
   auditReceipt.strategyPitCertified!==false||
   auditReceipt.frozenWritten!==false||
   !HASH.test(auditReceipt.auditHash||'')||
   !HASH.test(auditReceipt.sourceReceiptHash||''))
   fail('ORIGINAL_INDEPENDENT_AUDIT_INVALID');
 const {auditHash,...auditBase}=auditReceipt;
 if(await sha256Hex(auditBase)!==auditHash)fail('AUDIT_SIGNATURE_REHASH_FAILED');
 if(sourceReceipt?.schemaVersion!=='S2_61_SESSION_OFFICIAL_SOURCE_RECEIPT_V0_1'||
   sourceReceipt.state!=='SOURCE_OBSERVED_UNAUDITED'||
   sourceReceipt.marketDate!==auditReceipt.marketDate||
   sourceReceipt.receivedMarketDateCount!==122||
   !Array.isArray(sourceReceipt.receipts)||sourceReceipt.receipts.length!==122||
   !HASH.test(sourceReceipt.receiptHash||'')||
   sourceReceipt.receiptHash!==auditReceipt.sourceReceiptHash)
   return false;
 return await sha256Hex(official61SessionSourceReceiptHashBaseV0_1(sourceReceipt))===
   sourceReceipt.receiptHash;
}
export function requireUniqueExactSourceMatchV0_1(matchedIds){
 if(!Array.isArray(matchedIds)||matchedIds.length!==1||!num(matchedIds[0]))
  fail('SOURCE_HASH_MATCH_MISSING_OR_AMBIGUOUS');
 return matchedIds[0];
}
function github(args){return execFileSync('gh',args,{
 encoding:'utf8',maxBuffer:12*1024*1024,timeout:110000,
 env:process.env,stdio:['ignore','pipe','pipe']
});}
function api(path){return JSON.parse(github(['api',path]));}
async function loadAudit(auditId,root){
 github(['run','download',String(auditId),'-n',
  'system2-shared-official-a1-independent-audit-'+auditId,
  '-D',root]);
 const path=resolve(root,'s2-shared-a1-independent-audit','audit-receipt.json');
 return JSON.parse(await readFile(path,'utf8'));
}
export async function resolveAuditedA1SourceOnlyV0_1({auditId}={}){
 if(!num(auditId))fail('AUDIT_ID_NOT_INTEGER');
 const auditRun=api('repos/'+REPO+'/actions/runs/'+auditId);
 if(auditRun.id!==auditId)fail('AUDIT_RUN_RESPONSE_ID_MISMATCH');
 const recent=api('repos/'+REPO+'/actions/workflows/'+SOURCE_WORKFLOW_ID+
  '/runs?per_page=100');
 const candidates=candidateSourceRunsForCompletedAuditV0_1({
  auditRun,sourceRuns:recent.workflow_runs
 });
 const parent='/tmp/s2-data-a1-auto-pair-'+auditId;
 await mkdir(parent,{recursive:true});
 const receipt=await loadAudit(auditId,resolve(parent,'audit'));
 // Force the receipt's own signature check even when there are no matching
 // candidates, and do not mistake a bogus source for a legitimate other run.
 await exactSignedSourceAuditMatchV0_1({auditReceipt:receipt,sourceReceipt:null});
 const matches=[];
 for(const source of candidates){
  const target=resolve(parent,'source-'+source.id);
  try{
   github(['run','download',String(source.id),'-n',
     's2-shared-official-a1-'+source.id,'-D',target]);
   const raw=await readFile(resolve(target,
    'official-61-'+receipt.marketDate+'.json'),'utf8');
   const obj=JSON.parse(raw);
   if(await exactSignedSourceAuditMatchV0_1({
    auditReceipt:receipt,sourceReceipt:obj
   }))matches.push(source.id);
  }catch(e){
   // A failed archive retrieval or parser is NOT evidence that source was
   // another market date: preserve uncertainty, never choose latest by clock.
   if(e?.code==='ENOENT'){
    fail('CANDIDATE_SOURCE_ARCHIVE_ABSENT_'+source.id);
   }
   if(String(e?.message||'').includes('DATA_A1_AUTO_AUDIT_PAIR_'))throw e;
   fail('CANDIDATE_ARCHIVE_DOWNLOAD_OR_PARSE_ERROR_'+source.id);
  }
 }
 const exact=requireUniqueExactSourceMatchV0_1(matches);
 await rm(parent,{recursive:true,force:true});
 return {auditRunId:auditId,sourceRunId:exact,marketDate:receipt.marketDate,
  sourceReceiptHash:receipt.sourceReceiptHash,
  independentAuditHash:receipt.auditHash,candidatesExamined:candidates.length};
}
if(process.argv[1]?.endsWith('/resolve_data_a1_verified_origin_pair_v0_1.mjs')){
 try{
  const auditId=Number(process.env.S2_A1_AUDIT_RUN_ID);
  const result=await resolveAuditedA1SourceOnlyV0_1({auditId});
  if(!process.env.GITHUB_OUTPUT)fail('GITHUB_OUTPUT_ABSENT');
  await appendFile(process.env.GITHUB_OUTPUT,
   'source_id='+result.sourceRunId+'\n'+
   'audit_id='+result.auditRunId+'\n'+
   'market_date='+result.marketDate+'\n');
  console.log(JSON.stringify({...result,readOnly:true,
   formalSelectionAuthorized:false,sourcePITCertified:false}));
 }catch(e){
  console.error(String(e?.message||'DATA_A1_AUTO_AUDIT_PAIR_UNKNOWN')
    .replace(/[^A-Za-z0-9_]/g,'_').slice(0,150));
  process.exitCode=2;
 }
}
