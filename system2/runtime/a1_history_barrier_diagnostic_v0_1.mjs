// Independent System2 read-only explanation of Stage1's strict 61-day history
// barrier. It cannot change a single eligibility/selected/Frozen decision.
import {sha256Hex} from './decision_archive.mjs';
const SHA=/^[a-f0-9]{64}$/i,DATE=/^\d{4}-\d\d-\d\d$/;
const validUtc=x=>typeof x==='string'&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(x)&&Number.isFinite(Date.parse(x));
const nonneg=x=>Number.isFinite(x)&&x>=0,positive=x=>Number.isFinite(x)&&x>0;
function fail(code){throw Error('S2_A1_HISTORY_BARRIER_'+code);}
function classify(row,h,dates,at){
 if(!h)return 'NO_OFFICIAL_61_SESSION_SYMBOL_HISTORY';
 if(!Array.isArray(h.bars)||h.bars.length!==61)
  return 'SOURCE_61_BAR_WINDOW_LENGTH_INCOMPLETE';
 if(h.marketDate!==row.marketDate||h.symbol!==row.symbol||
    h.market!==row.market||h.priceSpace!=='RAW'||h.volumeUnit!=='SHARES'||
    h.originalProviderResponseVerified!==true||
    h.providerMarketDate!==row.marketDate||!SHA.test(h.originalResponseSha256||''))
  return 'HISTORY_IDENTITY_OR_ORIGINAL_SOURCE_PROOF_INVALID';
 if(!validUtc(h.observedAt)||Date.parse(h.observedAt)>Date.parse(at))
  return 'HISTORY_OBSERVED_AFTER_EVALUATION_OR_INVALID';
 if(h.bars.some((bar,i)=>bar?.date!==dates[i]||
      bar.symbol!==row.symbol||bar.market!==row.market||
      bar.priceSpace!=='RAW'||!SHA.test(bar.sourceRowHash||'')))
  return 'BAR_SESSION_ORDER_OR_RAW_LINEAGE_MISMATCH';
 if(h.bars.some(bar=>!validUtc(bar.availableAt)||
      Date.parse(bar.availableAt)>Date.parse(at)))
  return 'BAR_PUBLIC_AVAILABILITY_AFTER_EVALUATION_OR_INVALID';
 if(h.bars.some(bar=>!positive(bar.open)||!positive(bar.high)||
      !positive(bar.low)||!positive(bar.close)||
      bar.high<Math.max(bar.open,bar.close)||
      bar.low>Math.min(bar.open,bar.close)||
      !nonneg(bar.volumeShares)||!nonneg(bar.tradeValue)))
  return 'BAR_OHLCV_NONTRADE_OR_PRICE_INTEGRITY_INCOMPLETE';
 return 'HISTORY_RULE_MISMATCH_REQUIRES_MANUAL_DIAGNOSTIC';
}
export async function diagnoseSourceFirstHistoryBlockersV0_1({
 bridge,sourceReceipt
}={}){
 const e=bridge?.evaluation?.evaluation,l=bridge?.sourceLedger;
 if(bridge?.state!=='STAGE1_RESEARCH_EXECUTED_PIT_CONTINUITY_GATED'||
    e?.schemaVersion!=='S2_SOURCE_FIRST_SM_EVALUATION_V0_1'||
    l?.schemaVersion!=='S2_SOURCE_FIRST_PROSPECTIVE_LEDGER_V0_1'||
    bridge.marketDate!==sourceReceipt?.marketDate||
    e.marketDate!==sourceReceipt.marketDate||
    sourceReceipt?.receivedMarketDateCount!==122||
    sourceReceipt?.sourceRowSymbolWindowsCompleteCount!==Object.keys(sourceReceipt.bySymbol||{}).length||
    e.universeCount!==l.sourceOrdinarySymbolCount||
    !Array.isArray(e.observations)||!Array.isArray(l.observations)||
    e.observations.length!==l.observations.length)
  fail('SOURCE_OR_STAGE1_IDENTITY_INVALID');
 const dates=sourceReceipt.calendar?.tradingDates;
 if(!Array.isArray(dates)||dates.length!==61||dates.at(-1)!==bridge.marketDate||
    dates.some((d,i)=>!DATE.test(d)||(i>0&&d<=dates[i-1])))
  fail('OFFICIAL_CALENDAR_NOT_SAME_61_DAYS');
 const bySymbol=new Map(l.observations.map(x=>[x.symbol,x]));
 if(bySymbol.size!==l.observations.length)fail('DUPLICATE_SOURCE_SYMBOL');
 const counts=new Map(), examples=new Map();
 let diagnosed=0,unresolvedContinuity=0;
 for(const observed of e.observations){
  if(observed.state!=='INCOMPLETE')continue;
  const row=bySymbol.get(observed.symbol);
  if(!row||row.market!==observed.market||row.marketDate!==bridge.marketDate)
   fail('SOURCE_TO_EVALUATOR_SYMBOL_MISMATCH');
  const reasonCodes=observed.reasonCodes||[];
  if(reasonCodes.includes('PIT_CORPORATE_ACTION_CONTINUITY_UNVERIFIED')){
   unresolvedContinuity++;continue;
  }
  if(reasonCodes.includes('NO_CERTIFIED_PIT_61_SESSION_HISTORY')){
   const hist=sourceReceipt.bySymbol?.[row.market+'|'+row.symbol];
   const reason=classify(row,hist,dates,bridge.freezeAtUtc);
   counts.set(reason,(counts.get(reason)||0)+1);
   if(!examples.has(reason))examples.set(reason,[]);
   if(examples.get(reason).length<8)examples.get(reason).push(row.symbol);
   diagnosed++;continue;
  }
  const other='OTHER_STAGE1_INCOMPLETE_NOT_HISTORY_OR_CA';
  counts.set(other,(counts.get(other)||0)+1);diagnosed++;
 }
 if(diagnosed+unresolvedContinuity!==e.incompleteCount)
  fail('INCOMPLETE_DENOMINATOR_NOT_RECONCILED');
 const detail=[...counts].map(([reason,count])=>({
  reason,count,exampleSymbols:examples.get(reason)||[],
 })).sort((a,b)=>b.count-a.count||a.reason.localeCompare(b.reason));
 const base={
  schemaVersion:'S2_A1_HISTORY_BARRIER_DIAGNOSTIC_V0_1',
  marketDate:bridge.marketDate,sourceAuditHash:bridge.auditReceiptHash,
  sourceLedgerHash:l.ledgerSha256,stage1Hash:e.evaluationHash,
  ordinaryUniverseCount:l.observations.length,
  sourceComplete61WindowSymbolCount:sourceReceipt.sourceRowSymbolWindowsCompleteCount,
  stage1IncompleteCount:e.incompleteCount,
  corporateActionPitUnverifiedCount:unresolvedContinuity,
  remainingHistoryAndOtherIncompleteCount:diagnosed,
  reasonBreakdown:detail,
  selectionAuthorized:false,selectedCount:null,zeroPickDay:null,
  frozenWritten:false,originalSourceModified:false,
  noUnknownPITAutoCleared:true,system1RuntimeChanged:false,
 };
 return Object.freeze({...base,diagnosticHash:await sha256Hex(base)});
}
