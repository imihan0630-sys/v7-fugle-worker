// System2 BUILD M09: expose every actual Stage1 assessor result (or actual
// blocker) as a signed, read-only audit trail. Qualified is NOT selected.
// No new strategy evaluation, policy, sources, storage or authorized Frozen.
import {sha256Hex} from './decision_archive.mjs';
import {buildDailySelectionReadinessReceiptV0_1}
 from './daily_selection_readiness_v0_1.mjs';
const SHA=/^[0-9a-f]{64}$/i;
const fail=x=>{throw Error('S2_STAGE1_SYMBOL_ACCOUNTING_'+x);};
const clean=x=>String(x??'UNKNOWN').replace(/[<>|\r\n\t]/g,' ').slice(0,110);
const statuses=['INCOMPLETE','REJECTED','WATCH','QUALIFIED_NOT_SELECTED'];
export async function buildStage1DailySymbolAccountingV0_1({bridge,readiness}={}){
 if(!bridge||!readiness||!SHA.test(readiness.receiptHash||''))
  fail('ORIGINAL_SIGNED_INPUT_REQUIRED');
 // Reuse and execute the ACTUAL existing hash/row/strategy-state validator,
 // rather than inventing a weaker ledger-to-evaluation acceptance shortcut.
 const original=await buildDailySelectionReadinessReceiptV0_1({
  bridge,runId:readiness.workflowRunId
 });
 if(original.receiptHash!==readiness.receiptHash)fail('READINESS_OR_LINEAGE_MUTATED');
 const blocked=readiness.state==='BLOCKED_SOURCE_NOT_SELECTION';
 if(blocked!== (bridge.state==='BLOCKED_NO_ELIGIBLE_SOURCE_LEDGER'))
  fail('BLOCKED_SOURCE_STATE_CONFLICT');
 const stateTotals=Object.fromEntries(statuses.map(x=>[x,0]));
 const rows=[];
 if(!blocked){
  const ev=bridge.evaluation.evaluation;
  if(!Array.isArray(ev.observations))fail('MISSING_EVALUATOR_ROWS');
  for(const o of ev.observations){
   if(!statuses.includes(o.state)||o.state==='INCOMPLETE'&&
       (!Array.isArray(o.reasonCodes)||!o.reasonCodes.length))
    fail('ROW_STATUS_OR_REASON_INCOMPLETE');
   stateTotals[o.state]++;
   const qualified=o.state==='QUALIFIED_NOT_SELECTED';
   rows.push({
    market:o.market,symbol:o.symbol,companyName:o.companyName??null,
    sourceRowHash:o.sourceRowHash,
    status:o.state,
    reasonCodes:[...new Set(o.reasonCodes??[])],
    factorsHash:qualified?o.factorsHash:null,
    assessmentHash:qualified?o.assessmentHash:null,
    // Actual qualified research eligibility != authorized formal ranking.
    rank:null,entryTrigger:null,stop:null,targets:null,
    formalSelected:false,
    stage1EvaluationAtUtc:ev.evaluationAtUtc
   });
  }
  rows.sort((a,b)=>a.market.localeCompare(b.market)||a.symbol.localeCompare(b.symbol));
  if(rows.length!==readiness.ordinaryUniverseCount||
     stateTotals.INCOMPLETE!==readiness.incompleteCount||
     stateTotals.REJECTED!==readiness.rejectedCount||
     stateTotals.WATCH!==readiness.watchCount||
     stateTotals.QUALIFIED_NOT_SELECTED!==readiness.qualifiedNotSelectedCount)
   fail('PER_SYMBOL_DENOMINATOR_MISMATCH');
 }
 if(readiness.selectedCount!==null||readiness.zeroPickDay!==null||
  readiness.finalSelectionEligible!==false||
  readiness.frozenDecisionWritten!==false||
  readiness.durableFrozenReadbackVerified!==false)
  fail('PROTECTED_AUTHORITY_INVALID');
 const base={
  schemaVersion:'S2_STAGE1_DAILY_SYMBOL_ACCOUNTING_V0_1',
  marketDate:readiness.marketDate,observedAtUtc:readiness.observedAtUtc,
  originalSourceReceiptHash:readiness.originalSourceReceiptHash,
  independentA1AuditHash:readiness.independentSourceAuditHash,
  stage1EvaluationHash:readiness.stage1EvaluationHash,
  dailyReadinessReceiptHash:readiness.receiptHash,
  workflowRunId:readiness.workflowRunId,
  strategyId:'SHORT_MOMENTUM',strategyVersion:'V0.1-CONTRACT',
  assessorPolicyId:'S2-ASSESSOR-SM-LAUNCH-001',
  assessorPolicyVersion:'0.1-LAUNCH',
  state:blocked?'SOURCE_BLOCKED_NOT_ZERO_PICK':
   'FULL_SYMBOL_STAGE1_RESEARCH_ACCOUNTED_NOT_FROZEN',
  sourceFourDigitInstrumentCount:blocked?null:rows.length,
  certifiedOrdinaryShareDenominator:null,
  totalSymbolStateCounts:blocked?null:stateTotals,
  unresolvedReasonCounts:readiness.unresolvedReasonCounts,
  blockedSourceReasons:blocked?[...readiness.blockers]:[],
  everyRowHasFormalSelectionAuthorization:false,
  actualQualifiedResearchRows:blocked?null:stateTotals.QUALIFIED_NOT_SELECTED,
  selectedCount:null,zeroPickDay:null,qualifiedNeverImpliedSelected:true,
  usableForFormalSelection:false,officialShadowAuthorized:false,
  frozenD1Written:false,durableFrozenReadbackVerified:false,
  system1FormalCoreChanged:false,cloudflareD1Writes:0,
  rows
 };
 return Object.freeze({...base,receiptHash:await sha256Hex(base)});
}
export function renderStage1DailySymbolAccountingV0_1(r,{maxRows=30}={}){
 if(!r||r.schemaVersion!=='S2_STAGE1_DAILY_SYMBOL_ACCOUNTING_V0_1'||
  !SHA.test(r.receiptHash||'')||!Number.isInteger(maxRows)||
  maxRows<0||maxRows>100)
  fail('RENDER_INPUT_INVALID');
 const out=[
  '## SHORT_MOMENTUM Stage1 逐股評估與缺口（研究專用，非正式選股）','',
  '**市場交易日：** '+clean(r.marketDate)+'｜**實際評估：** '+clean(r.observedAtUtc),
  '**狀態：** '+clean(r.state),
  '**來源：** 官方 A1 稽核識別 '+clean(r.independentA1AuditHash),
  '**四碼證券來源分母：** '+(r.sourceFourDigitInstrumentCount??'UNKNOWN')+
   '；**普通股正式認證分母：UNKNOWN**；**正式入選數：UNKNOWN（不是 0）**',
  '**原始七因子策略：** SHORT_MOMENTUM / V0.1-CONTRACT / 0.1-LAUNCH',
  '**本報告不是排名、Frozen、交易訊號或正式 Shadow。**',''
 ];
 if(r.totalSymbolStateCounts){
  const s=r.totalSymbolStateCounts;
  out.push('評估帳：INCOMPLETE '+s.INCOMPLETE+
   '，REJECTED '+s.REJECTED+
   '，WATCH '+s.WATCH+
   '，QUALIFIED_NOT_SELECTED '+s.QUALIFIED_NOT_SELECTED+'（仍非入選）。','');
 }
 if(r.blockedSourceReasons.length)
  out.push('**來源阻擋：** '+r.blockedSourceReasons.map(clean).join('、'),'');
 if(r.unresolvedReasonCounts?.length){
  out.push('**主要缺口：** '+r.unresolvedReasonCounts.slice(0,10).map(x=>
   clean(x.code)+' ×'+x.count).join('、'),'');
 }
 out.push('| 市場 | 代碼 | 名稱 | Stage1 狀態 | 實際原因（部分） |',
  '|---|---|---|---|---|');
 for(const row of r.rows.slice(0,maxRows))
  out.push('| '+clean(row.market)+' | '+clean(row.symbol)+
    ' | '+clean(row.companyName)+' | '+clean(row.status)+' | '+
    (row.reasonCodes.length?row.reasonCodes.slice(0,3).map(clean).join('；'):'—')+' |');
 if(!r.rows.length)out.push('| — | — | — | '+clean(r.state)+' | 尚無可核對的完整 Stage1 逐股評估 |');
 out.push('','已顯示 '+Math.min(r.rows.length,maxRows)+'/'+r.rows.length+
  ' 筆；完整逐股、原因及 SHA 保留於同一研究 Artifact JSON。',
  '**每日 Stage1 帳本 SHA256：** '+r.receiptHash,'');
 return out.join('\n');
}
