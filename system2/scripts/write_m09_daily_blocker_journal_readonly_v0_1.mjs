// System2 M09 daily immutable GitHub artifact: evidence of NON-selection.
// This journal does not purport to be a Frozen decision, a qualified
// no-pick day, or a D1 persisted snapshot. It retains failure truth.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {sha256Hex} from '../runtime/decision_archive.mjs';
const OUT='/tmp/s2-m09-daily-blocker-journal';
const H=/^[0-9a-f]{64}$/i;
const strip=(o,k)=>Object.fromEntries(Object.entries(o||{}).filter(([key])=>key!==k));
const time=x=>typeof x==='string'&&Number.isFinite(Date.parse(x))&&
 /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(x);
const date=x=>typeof x==='string'&&/^\d{4}-\d\d-\d\d$/.test(x)&&
 Number.isFinite(Date.parse(x+'T00:00:00Z'))&&
 new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
function deny(code){throw Error('S2_M09_BLOCKER_JOURNAL_'+code)}
async function signed(x,k){
 return x&&H.test(x[k]||'')&&await sha256Hex(strip(x,k))===x[k];
}
export async function buildM09DailyBlockerJournalV0_1({
 independentA1Audit,selectionReadiness,preliminaryWatch,
 observedAtUtc=new Date().toISOString(),
 workflowRunId=null
}={}){
 const a=independentA1Audit,r=selectionReadiness,w=preliminaryWatch;
 if(!time(observedAtUtc)||!date(a?.marketDate)||
  !time(a?.auditedAtUtc)||Date.parse(a.auditedAtUtc)>Date.parse(observedAtUtc)||
  !await signed(a,'auditHash')||
  a.schemaVersion!=='SHARED_OFFICIAL_A1_SOURCE_AUDIT_V0_1'||
  !['BLOCKED_SOURCE_INCOMPLETE','ACCEPTED_SOURCE_INTEGRITY_ONLY'].includes(a.verdict)||
  a.auditorSeparation!=='INDEPENDENT_READBACK_PROCESS'||
  a.strategyPitCertified!==false||a.selectionAuthorized!==false||
  a.frozenWritten!==false||a.selectedCount!==null||a.zeroPickDay!==null||
  a.cloudflareD1Writes!==0||a.cloudflareR2Writes!==0||
  !H.test(a.sourceReceiptHash||'')||
  !Number.isInteger(a.sourceMarketDatePairsVerified)||
  a.sourceMarketDatePairsVerified<0||a.sourceMarketDatePairsVerified>122||
  a.originalFilesRehashedAfterDownload!==a.sourceMarketDatePairsVerified||
  a.originalFilesDecompressedAndParsed!==a.sourceMarketDatePairsVerified)
  deny('INDEPENDENT_A1_AUDIT_OR_CLOCK_INVALID');
 const complete=a.sourceMarketDatePairsVerified===122&&
  a.verdict==='ACCEPTED_SOURCE_INTEGRITY_ONLY';
 if((a.verdict==='ACCEPTED_SOURCE_INTEGRITY_ONLY')!==complete)
  deny('SOURCE_PAIRS_AUDIT_VERDICT_CONFLICT');
 if(!await signed(r,'receiptHash')||!await signed(w,'receiptHash')||
  r?.schemaVersion!=='S2_DAILY_SELECTION_READINESS_V0_1'||
  w?.schemaVersion!=='S2_PRELIMINARY_PV_WATCH_V0_2'||
  r.marketDate!==a.marketDate||w.marketDate!==a.marketDate||
  r.independentSourceAuditHash!==a.auditHash||
  w.independentSourceAuditHash!==a.auditHash||
  r.originalSourceReceiptHash!==a.sourceReceiptHash||
  w.originalSourceReceiptHash!==a.sourceReceiptHash||
  r.sourcePairsObserved!==a.sourceMarketDatePairsVerified||
  r.sourcePairsRequired!==122||
  !time(r.observedAtUtc)||!time(w.observedAtUtc)||
  Date.parse(r.observedAtUtc)>Date.parse(observedAtUtc)||
  Date.parse(w.observedAtUtc)>Date.parse(observedAtUtc)||
  r.finalSelectionEligible!==false||r.rankCapacityAuthorized!==false||
  r.noEventCorporateActionAssumed!==false||
  r.selectedCount!==null||r.zeroPickDay!==null||
  r.frozenDecisionWritten!==false||r.durableFrozenReadbackVerified!==false||
  r.cloudflareD1Writes!==0||r.cloudflareR2Writes!==0||
  w.selectedCount!==null||w.zeroPickDay!==null||
  w.finalSelectionAuthorized!==false||w.frozenWritten!==false||
  w.cloudflareD1Writes!==0||w.cloudflareR2Writes!==0||
  !Array.isArray(w.watchlist)||w.watchlist.length>30)
  deny('SIGNED_READINESS_WATCH_LINEAGE_OR_AUTHORITY_INVALID');
 if(!complete&&(r.state!=='BLOCKED_SOURCE_NOT_SELECTION'||
  w.state!=='BLOCKED_SOURCE_INCOMPLETE'||w.watchlist.length!==0))
  deny('PARTIAL_SOURCE_MUST_BLOCK_ENTIRE_WATCH');
 if(complete&&r.state==='BLOCKED_SOURCE_NOT_SELECTION'&&
  !Array.isArray(r.blockers))
  deny('LATE_SOURCE_BLOCKER_CODES_REQUIRED');
 if(!Array.isArray(r.blockers)||!Array.isArray(w.blockers))
  deny('SOURCE_BLOCKER_LISTS_REQUIRED');
 if(workflowRunId!==null&&!/^[0-9]+$/.test(String(workflowRunId)))
  deny('WORKFLOW_RUN_ID_INVALID');
 const codes=[...new Set([...r.blockers,...w.blockers])].sort();
 if(codes.length===0||codes.some(c=>typeof c!=='string'||!c.trim()||c.length>160))
  deny('MISSING_SOURCE_OR_PIT_BLOCKER');
 const state=!complete?'SOURCE_AUDIT_INCOMPLETE_NOT_A_SELECTION':
  'SOURCE_INTEGRITY_ONLY_STRATEGY_PIT_OR_FROZEN_BLOCKED';
 const base={
  schemaVersion:'S2_M09_DAILY_BLOCKER_JOURNAL_V0_1',
  observedAtUtc,originalMarketDate:a.marketDate,
  sourceRunId:r.workflowRunId??null,
  independentAuditWorkflowRunId:workflowRunId===null?null:String(workflowRunId),
  originalSourceReceiptHash:a.sourceReceiptHash,
  independentA1AuditHash:a.auditHash,
  signedSelectionReadinessHash:r.receiptHash,
  signedPreliminaryWatchHash:w.receiptHash,
  state,sourceIntegrityAcceptedOnly:complete,
  originalMarketDatePairsVerified:a.sourceMarketDatePairsVerified,
  sourceMarketDatePairsRequired:122,
  strategyId:'SHORT_MOMENTUM',strategyVersion:'V0.1-CONTRACT',
  preliminaryState:w.state,
  preliminaryObservationCount:w.watchlist.length,
  preliminaryKnownSecurityTypePITCount:0,
  preliminaryKnownNoEventPITCount:0,
  requiredBlockerCodes:codes,
  ordinaryCommonEquityPITCertified:false,
  sixFamilyCaRevisionCancellationSuspensionPITCertified:false,
  qualifiedAssessorFrozenAuthorized:false,
  officialStrategyResult:null,finalRanking:null,
  selectedCount:null,zeroPickDay:null,
  userFacingZeroPickClaimAllowed:false,
  isFrozenDecisionSnapshot:false,
  artifactRetentionDays:90,
  gitHubArtifactAppendOnlyInRetention:true,
  frozenD1Written:false,independentFrozenD1Readback:false,
  cloudflareD1Writes:0,cloudflareR2Writes:0,
  system1V8FormalCoreTouched:false
 };
 return Object.freeze({...base,journalHash:await sha256Hex(base)});
}
if(process.argv[1]?.endsWith('/write_m09_daily_blocker_journal_readonly_v0_1.mjs')){
 const [a,r,w]=await Promise.all([
  readFile('/tmp/s2-shared-a1-independent-audit/audit-receipt.json','utf8'),
  readFile('/tmp/s2-a1-stage1-readonly/daily-selection-readiness.json','utf8'),
  readFile('/tmp/s2-a1-stage1-readonly/preliminary-pv-watch.json','utf8')
 ]).then(rows=>rows.map(JSON.parse));
 const journal=await buildM09DailyBlockerJournalV0_1({
  independentA1Audit:a,selectionReadiness:r,preliminaryWatch:w,
  workflowRunId:process.env.GITHUB_RUN_ID||null
 });
 await mkdir(OUT,{recursive:true,mode:0o700});
 await writeFile(resolve(OUT,'blocker-journal.json'),
  JSON.stringify(journal,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log(JSON.stringify({state:journal.state,marketDate:journal.originalMarketDate,
  sourcePairs:journal.originalMarketDatePairsVerified,
  blockers:journal.requiredBlockerCodes.length,
  preview:journal.preliminaryObservationCount,
  selectedCount:null,zeroPickDay:null,
  frozenD1Written:false,journalHash:journal.journalHash}));
}
