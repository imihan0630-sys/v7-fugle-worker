// Independent re-computation of the daily NO-SELECTION journal from genuine
// A1 audit + strategy readiness + preliminary receipts. No D1 or Frozen.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {sha256Hex,canonicalStringify} from '../runtime/decision_archive.mjs';
import {buildM09DailyBlockerJournalV0_1}
 from './write_m09_daily_blocker_journal_readonly_v0_1.mjs';
const OUT='/tmp/s2-m09-daily-blocker-independent-readback';
function deny(code){throw Error('S2_M09_BLOCKER_INDEPENDENT_'+code)}
export async function auditM09DailyBlockerJournalV0_1({
 journal,independentA1Audit,selectionReadiness,preliminaryWatch,
 upstreamRunId,now=new Date().toISOString()
}={}){
 if(!/^[0-9]+$/.test(String(upstreamRunId))||
  journal?.schemaVersion!=='S2_M09_DAILY_BLOCKER_JOURNAL_V0_1'||
  journal.independentAuditWorkflowRunId!==String(upstreamRunId)||
  typeof now!=='string'||!Number.isFinite(Date.parse(now))||
  Date.parse(now)<Date.parse(journal.observedAtUtc)||
  journal.userFacingZeroPickClaimAllowed!==false||
  journal.isFrozenDecisionSnapshot!==false||
  journal.frozenD1Written!==false||journal.selectedCount!==null||
  journal.zeroPickDay!==null||journal.cloudflareD1Writes!==0)
  deny('UNTRUSTED_UPSTREAM_ID_OR_FORMAL_BOUNDARY');
 const {journalHash,...content}=journal;
 if(await sha256Hex(content)!==journalHash)
  deny('JOURNAL_HASH_TAMPERED');
 const replay=await buildM09DailyBlockerJournalV0_1({
  independentA1Audit,selectionReadiness,preliminaryWatch,
  observedAtUtc:journal.observedAtUtc,workflowRunId:String(upstreamRunId)
 });
 if(canonicalStringify(journal)!==canonicalStringify(replay))
  deny('INDEPENDENT_REPLAY_MISMATCH');
 const base={
  schemaVersion:'S2_M09_DAILY_BLOCKER_INDEPENDENT_READBACK_V0_1',
  auditedAtUtc:now,upstreamAuditRunId:String(upstreamRunId),
  originalMarketDate:journal.originalMarketDate,
  journalHash:journal.journalHash,
  originalProviderSourceReceiptHash:journal.originalSourceReceiptHash,
  originalIndependentA1AuditHash:journal.independentA1AuditHash,
  originalSelectionReadinessHash:journal.signedSelectionReadinessHash,
  originalPreliminaryWatchHash:journal.signedPreliminaryWatchHash,
  auditorSeparation:'INDEPENDENT_GITHUB_ACTIONS_UPSTREAM_SIGNED_RECEIPT_RECOMPUTATION',
  rehashedUpstreamReceiptCount:3,fullJournalReproduced:true,
  classifiedAsFormalZeroPick:false,classifiedAsFrozen:false,
  PITAssessorQualified:false,selectedCount:null,zeroPickDay:null,
  cloudflareD1Writes:0,cloudflareR2Writes:0,system1FormalCoreTouched:false
 };
 return Object.freeze({...base,auditHash:await sha256Hex(base)});
}
if(process.argv[1]?.endsWith('/audit_m09_daily_blocker_journal_readonly_v0_1.mjs')){
 const root=process.env.S2_BLOCKER_A1_SOURCE_DIR||'/tmp/s2-m09-daily-blocker-original-audit';
 const [j,a,r,w]=await Promise.all([
  readFile('/tmp/s2-m09-daily-blocker-source-readback/blocker-journal.json','utf8'),
  readFile(resolve(root,'s2-shared-a1-independent-audit/audit-receipt.json'),'utf8'),
  readFile(resolve(root,'s2-a1-stage1-readonly/daily-selection-readiness.json'),'utf8'),
  readFile(resolve(root,'s2-a1-stage1-readonly/preliminary-pv-watch.json'),'utf8')
 ]).then(rows=>rows.map(JSON.parse));
 const audit=await auditM09DailyBlockerJournalV0_1({
  journal:j,independentA1Audit:a,selectionReadiness:r,preliminaryWatch:w,
  upstreamRunId:process.env.S2_BLOCKER_SOURCE_RUN_ID
 });
 await mkdir(OUT,{recursive:true,mode:0o700});
 await writeFile(resolve(OUT,'independent-readback.json'),
  JSON.stringify(audit,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({state:'ACCEPTED_NON_SELECTION_JOURNAL_ONLY',
  originalMarketDate:audit.originalMarketDate,rehash:audit.rehashedUpstreamReceiptCount,
  selectedCount:null,zeroPickDay:null,frozenD1Written:false,
  auditHash:audit.auditHash}));
}
