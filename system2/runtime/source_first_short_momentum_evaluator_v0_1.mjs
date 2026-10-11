// System2 P0 #1132: source-first Stage1 SHORT_MOMENTUM research evaluation.
// Existing owner-frozen strategy only, no System1/V8 Formal, D1, push or orders.
// This is a pure source-injected bridge; it does NOT attest original provider bytes.
import {buildA1HistoryPrimitiveBundle} from './a1_history_primitives_v0_1.mjs';
import {assessStage1StrategyV0_1} from './stage1_assessor_policies_v0_1.mjs';
import {SHORT_MOMENTUM_CONTRACT_V0_1} from './strategy_contracts_v0_1.mjs';
import {buildStrategyStateAssessment} from './strategy_evaluator.mjs';
import {sha256Hex} from './decision_archive.mjs';
const SHA=/^[a-f0-9]{64}$/i,DAY=/^\d{4}-\d{2}-\d{2}$/;
const validUtc=x=>typeof x==='string'&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(x)&&Number.isFinite(Date.parse(x));
const nonneg=x=>Number.isFinite(x)&&x>=0;
const price=x=>Number.isFinite(x)&&x>0;
const sourceState='SOURCE_FIRST_A1_OFFLINE_RESEARCH_ONLY';
function invalid(symbol,code){return {symbol,state:'INCOMPLETE',readiness:'BLOCKED',reasonCodes:[code],
    factorsHash:null,assessmentHash:null,strategyValidity:'INCOMPLETE',entryReadiness:'BLOCKED',
    companyName:null,market:null,sourceRowHash:null,sourceHistoryHash:null,
    evaluatedClose:null};}
export async function evaluateSourceFirstShortMomentumV0_1({
 sourceLedger,historyBySymbol={},continuityBySymbol={},calendarReceipt=null,
 evaluationAtUtc,independentOriginalVerification=false
}={}) {
 const blockers=[];
 if(!validUtc(evaluationAtUtc))throw Error('EVALUATION_CLOCK_UTC_INVALID');
 if(!(sourceLedger?.schemaVersion==='S2_SOURCE_FIRST_PROSPECTIVE_LEDGER_V0_1'&&
      sourceLedger.sourceState==='READY'&&DAY.test(sourceLedger.marketDate||'')&&
      SHA.test(sourceLedger.ledgerSha256||'')&&SHA.test(sourceLedger.sourceBatchHash||'')&&
      validUtc(sourceLedger.observedAt)&&Date.parse(sourceLedger.observedAt)<=Date.parse(evaluationAtUtc)&&
      Array.isArray(sourceLedger.observations)&&sourceLedger.observations.length>0&&
      sourceLedger.sourceOrdinarySymbolCount===sourceLedger.observations.length&&
      sourceLedger.selectionState==='NOT_EXECUTED_REQUIRED_PIT_HISTORY_AND_CONTINUITY_MISSING')){
   blockers.push('ACTUAL_SAME_DATE_A1_SOURCE_LEDGER_NOT_ACCEPTED');
 }
 const date=sourceLedger?.marketDate||null, symbols=sourceLedger?.observations||[];
 // No publication-time guess or weekend/calendar interpolation. Only an
 // independently observed official 61-session exact date set can qualify a bar.
 const days=calendarReceipt?.tradingDates;
 if(!(calendarReceipt?.state==='READY'&&calendarReceipt?.verifiedOfficialReadback===true&&
      calendarReceipt?.marketDate===date&&validUtc(calendarReceipt?.observedAt)&&
      Date.parse(calendarReceipt.observedAt)<=Date.parse(evaluationAtUtc)&&
      SHA.test(calendarReceipt?.originalCalendarHash||'')&&
      Array.isArray(days)&&days.length===61&&new Set(days).size===61&&
      days.every((d,i)=>DAY.test(d)&&(i===0||d>days[i-1]))&&days.at(-1)===date))
   blockers.push('OFFICIAL_61_SESSION_CALENDAR_UNVERIFIED');
 if(independentOriginalVerification!==true)blockers.push('INDEPENDENT_ORIGINAL_SOURCE_BYTES_UNVERIFIED');
 const observations=[];
 const uniq=new Set();
 const aggregateOk=blockers.length===0;
 for(const row of symbols){
   const symbol=row?.symbol;
   if(!/^[1-9]\d{3}$/.test(symbol||'')||uniq.has(symbol)){
     blockers.push('SOURCE_UNIVERSE_SYMBOL_IDENTITY_INVALID');continue;
   }
   uniq.add(symbol);
   let detail=invalid(symbol,'NO_CERTIFIED_PIT_61_SESSION_HISTORY');
   detail.companyName=row.companyName||null;detail.market=row.market||null;
   detail.sourceRowHash=row.sourceRowHash||null;
   detail.evaluatedClose=price(row.close)?row.close:null;
   if(!aggregateOk){detail.reasonCodes=[...blockers];observations.push(detail);continue;}
   const h=historyBySymbol?.[symbol], c=continuityBySymbol?.[symbol];
   const hist=h?.bars;
   const histOkay=!!(h?.marketDate===date&&h.symbol===symbol&&h.market===row.market&&
     h.priceSpace==='RAW'&&h.volumeUnit==='SHARES'&&h.originalProviderResponseVerified===true&&
     h.providerMarketDate===date&&SHA.test(h.originalResponseSha256||'')&&
     validUtc(h.observedAt)&&Date.parse(h.observedAt)<=Date.parse(evaluationAtUtc)&&
     Array.isArray(hist)&&hist.length===61&&
     hist.every((bar,i)=>bar?.date===days[i]&&bar.symbol===symbol&&
       bar.market===row.market&&bar.priceSpace==='RAW'&&
       SHA.test(bar.sourceRowHash||'')&&validUtc(bar.availableAt)&&
       Date.parse(bar.availableAt)<=Date.parse(evaluationAtUtc)&&
       Number.isFinite(bar.close)&&bar.close>0&&
       nonneg(bar.volumeShares)&&nonneg(bar.tradeValue)&&
       price(bar.open)&&price(bar.high)&&price(bar.low)&&
       bar.high>=Math.max(bar.open,bar.close)&&bar.low<=Math.min(bar.open,bar.close)));
   if(!histOkay){observations.push(detail);continue;}
   // Current day source in independent history and official daily A1 must agree.
   const current=hist.at(-1);
   if(!(row.sourceRowHash===current.sourceRowHash&&
        row.close===current.close&&row.volumeShares===current.volumeShares)){
     detail.reasonCodes=['CURRENT_HISTORY_VS_DAILY_SOURCE_HASH_PRICE_VOLUME_MISMATCH'];
     observations.push(detail);continue;
   }
   if(!(c?.symbol===symbol&&c.marketDate===date&&
        (c.state==='CLEAR_NO_ACTION'||c.state==='ADJUSTED_CONTINUITY')&&
        c.originalCorporateActionEvidenceVerified===true&&
        c.startSession===days[0]&&c.endSession===date&&SHA.test(c.evidenceSha256||'')&&
        validUtc(c.availableAt)&&Date.parse(c.availableAt)<=Date.parse(evaluationAtUtc))){
     detail.reasonCodes=['PIT_CORPORATE_ACTION_CONTINUITY_UNVERIFIED'];
     observations.push(detail);continue;
   }
   const observedAt=[h.observedAt,sourceLedger.observedAt,c.availableAt,calendarReceipt.observedAt]
     .sort().at(-1);
   const bundle=await buildA1HistoryPrimitiveBundle({
    bundleId:'SRCFIRST-SM-'+symbol+'-'+date,
    symbol,marketDate:date,decisionTimestamp:evaluationAtUtc,
    observedAt,availableAt:observedAt,bars:hist,
    sourceId:h.sourceId||'OFFICIAL_A1_SOURCE_PROVENANCE',
    sourceName:h.sourceName||'Official A1 61-session source',
    priceSpace:'RAW',volumeUnit:'SHARES',continuityState:c.state,
   });
   if(!bundle.pointInTimeEligible||!bundle.continuityEligible||bundle.barCount!==61 ||
      bundle.lastBarDate!==date){
      detail.reasonCodes=['FACTOR_PIT_OR_CONTINUITY_INVALID'];observations.push(detail);continue;
   }
   const raw=assessStage1StrategyV0_1({strategyId:'SHORT_MOMENTUM',factorBundle:bundle});
   const assessed=buildStrategyStateAssessment(SHORT_MOMENTUM_CONTRACT_V0_1,raw);
   const state=assessed.strategyValidity==='VALID'&&assessed.entryReadiness==='BUY_ELIGIBLE'
       ? 'QUALIFIED_NOT_SELECTED'
       : assessed.strategyValidity==='INCOMPLETE'?'INCOMPLETE':
       assessed.strategyValidity==='INVALIDATED'?'REJECTED':'WATCH';
   detail={
     ...detail,state,readiness:assessed.entryReadiness,reasonCodes:[...raw.reasons,...assessed.reasons],
     factorsHash:bundle.bundleHash,assessmentHash:await sha256Hex(assessed),
     strategyValidity:assessed.strategyValidity,entryReadiness:assessed.entryReadiness,
     sourceHistoryHash:h.originalResponseSha256,
     entryPlan:null, // never fabricate stop/targets in stage-1 evidence layer
   };
   observations.push(detail);
 }
 observations.sort((a,b)=>a.symbol.localeCompare(b.symbol));
 const universeCount=sourceLedger?.sourceOrdinarySymbolCount??null;
 if(universeCount!==observations.length||observations.length!==uniq.size)
   blockers.push('EVALUATION_DENOMINATOR_RECONCILIATION_FAILED');
 const incomplete=observations.filter(x=>x.state==='INCOMPLETE').length;
 const qualified=observations.filter(x=>x.state==='QUALIFIED_NOT_SELECTED').length;
 const counted=observations.length-incomplete;
 const complete=blockers.length===0&&incomplete===0;
 const base={
  schemaVersion:'S2_SOURCE_FIRST_SM_EVALUATION_V0_1',mode:sourceState,
  marketDate:date,evaluationAtUtc,sourceLedgerHash:sourceLedger?.ledgerSha256||null,
  officialCalendarHash:calendarReceipt?.originalCalendarHash||null,
  strategyId:'SHORT_MOMENTUM',strategyVersion:SHORT_MOMENTUM_CONTRACT_V0_1.strategyVersion,
  assessorPolicyId:'S2-ASSESSOR-SM-LAUNCH-001',assessorPolicyVersion:'0.1-LAUNCH',
  state:complete?'EVALUATED_OFFLINE_RESEARCH_ONLY':'INCOMPLETE_SOURCE_OR_STRATEGY_EVIDENCE',
  blockers:[...new Set(blockers)].sort(),universeCount,
  assessedCount:counted,incompleteCount:incomplete,
  qualifiedNotSelectedCount:qualified,
  observations, 
  allSourceAndHistoryEvidenceComplete:complete,
  // Qualified != selected. Final rank/capacity, frozen persistence and live
  // physical source audit cannot be inferred from this offline observation.
  qualifiedCandidateCount:complete?qualified:null,
  selectedCount:null,zeroPickDay:null,finalSelectionEnabled:false,
  realMoneyImpact:false,pushEnabled:false,ordersEnabled:false,
  historicalOutcomeAssigned:false,durableFrozenDecisionReadbackVerified:false,
  independentProviderAuditCompletedByThisModule:false,
 };
 return Object.freeze({...base,evaluationHash:await sha256Hex(base)});
}
