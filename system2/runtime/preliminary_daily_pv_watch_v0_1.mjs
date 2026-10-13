// System 2 prospective *preliminary* daily price/volume observation lane.
// This is NOT SHORT_MOMENTUM V0.1-CONTRACT or an entry/exit/rank recommendation.
// It must never backdate historic reconstruction or use unknown CA as "no event".
import {sha256Hex} from './decision_archive.mjs';
import {official61SessionSourceReceiptHashBaseV0_1}
 from './source_first_official_61_session_collector_v0_1.mjs';

const ISO=/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;
const SHA=/^[a-f0-9]{64}$/i;
const isTime=v=>typeof v==='string'&&ISO.test(v)&&Number.isFinite(Date.parse(v));
const positive=v=>Number.isFinite(v)&&v>0;
function deny(code){throw Error('S2_PRELIMINARY_DAILY_'+code);}
export async function buildSystem2PreliminaryDailyWatchV0_1({
 bridge,sourceReceipt,displayLimit=30,
}={}){
 if(!Number.isInteger(displayLimit)||displayLimit<1||displayLimit>100)deny('DISPLAY_LIMIT_INVALID');
 if(!bridge||!sourceReceipt||!isTime(bridge.freezeAtUtc)||
    bridge.marketDate!==sourceReceipt.marketDate||
    bridge.sourceReceiptHash!==sourceReceipt.receiptHash||
    bridge.selectedCount!==null||bridge.zeroPickDay!==null||
    bridge.selectionAuthorized!==false||bridge.frozenDecisionWritten!==false)
  deny('SOURCE_OR_AUTHORITY_MISMATCH');
 const base={
  schemaVersion:'S2_PRELIMINARY_PV_WATCH_V0_1',
  watchVersion:'PRELIMINARY_PRICE_VOLUME_OBSERVATION_V0_1',
  strategyId:null,marketDate:bridge.marketDate,observedAtUtc:bridge.freezeAtUtc,
  lateMorningObservationNotBackdated:
    bridge.state==='SOURCE_LEDGER_DELAYED_PRELIMINARY_ONLY',
  originalSourceReceiptHash:bridge.sourceReceiptHash,
  independentSourceAuditHash:bridge.auditReceiptHash,
  sourceLedgerHash:bridge.sourceLedger?.ledgerSha256??null,
  historicalBacktestCertified:false,
  historicalBacktestPermittedAsCertified:false,
  retrospectivePerformanceCertified:false,
  marketRegimeCertified:false,
  finalStrategyRankApproved:false,
  selectedCount:null,zeroPickDay:null,
  finalSelectionAuthorized:false,
  frozenWritten:false,orderAuthorized:false,pushAuthorized:false,
  system1FormalTouched:false,cloudflareD1Writes:0,cloudflareR2Writes:0,
 };
 if(bridge.state==='BLOCKED_NO_ELIGIBLE_SOURCE_LEDGER'){
  if(bridge.sourceLedger!==null||bridge.evaluation!==null)
   deny('BLOCKED_SOURCE_HAS_LEDGER');
  const blocked={...base,state:'BLOCKED_SOURCE_INCOMPLETE',
   blockers:[...(bridge.blockers||[])],officialUniverseCount:null,
   historyContinuityUsableCount:null,preliminaryMatchedCount:null,
   withheldHistoryCount:null,anomalyQuarantinedCount:null,
   watchlist:[]};
  return {...blocked,receiptHash:await sha256Hex(blocked)};
 }
 if(!['SOURCE_LEDGER_READY_STRATEGY_PIT_NOT_CERTIFIED',
       'STAGE1_RESEARCH_EXECUTED_PIT_CONTINUITY_GATED',
       'SOURCE_LEDGER_DELAYED_PRELIMINARY_ONLY'].includes(bridge.state)||
    bridge.auditedSourceOnly!==true||bridge.actualSourcePairs!==122||
    bridge.requiredSourcePairs!==122||
    !SHA.test(bridge.auditReceiptHash||'')||
    sourceReceipt.receivedMarketDateCount!==122||
    sourceReceipt.sourceRowSymbolWindowsCompleteCount!==
      Object.keys(sourceReceipt.bySymbol||{}).length||
    !SHA.test(sourceReceipt.receiptHash||'')||
    await sha256Hex(official61SessionSourceReceiptHashBaseV0_1(sourceReceipt))!==
     sourceReceipt.receiptHash)
  deny('SOURCE_AUDIT_OR_HASH_NOT_ACCEPTED');
 const ledger=bridge.sourceLedger;
 if(ledger?.sourceState!=='READY'||ledger.marketDate!==bridge.marketDate||
    !Array.isArray(ledger.observations)||
    ledger.observations.length!==ledger.sourceOrdinarySymbolCount||
    !SHA.test(ledger.ledgerSha256||''))
  deny('PROSPECTIVE_SOURCE_LEDGER_INVALID');
 const clock=Date.parse(bridge.freezeAtUtc);
 const dates=sourceReceipt.calendar?.tradingDates;
 if(!Array.isArray(dates)||dates.length!==61||
    dates.at(-1)!==bridge.marketDate||
    dates.some((d,i)=>!/^\d{4}-\d\d-\d\d$/.test(d)||(i>0&&d<=dates[i-1])))
  deny('OFFICIAL_61_CALENDAR_NOT_READY');
 // Hash-verified original market data must be available by this REAL observation.
 // 61-session history is used for PRESENT descriptive ratios, never retrospective
 // stock picks or invented historic first-known timestamps.
 const found=[],symbols=new Set();let withheld=0,quarantined=0,usable=0;
 for(const row of ledger.observations){
  const symbol=row.symbol;
  if(!/^[1-9]\d{3}$/.test(symbol||'')||symbols.has(symbol)||
    !['TWSE','TPEX'].includes(row.market)||row.marketDate!==bridge.marketDate)
   deny('SYMBOL_UNIVERSE_IDENTITY_INVALID');
  symbols.add(symbol);
  const h=sourceReceipt.bySymbol?.[row.market+'|'+symbol],bars=h?.bars;
  if(!Array.isArray(bars)||bars.length!==61||
     h.symbol!==symbol||h.market!==row.market||
     h.marketDate!==bridge.marketDate||
     h.originalProviderResponseVerified!==true||
     !SHA.test(h.originalResponseSha256||'')||
     !isTime(h.observedAt)||Date.parse(h.observedAt)>clock){
   withheld++;continue;
  }
  let valid=true;
  for(let i=0;i<61;i++){
   const b=bars[i];
   if(b?.date!==dates[i]||b.symbol!==symbol||b.market!==row.market||
      b.priceSpace!=='RAW'||!SHA.test(b.sourceRowHash||'')||
      !isTime(b.availableAt)||Date.parse(b.availableAt)>clock||
      ![b.open,b.high,b.low,b.close].every(positive)||
      b.high<Math.max(b.open,b.close)||b.low>Math.min(b.open,b.close)||
      !Number.isFinite(b.volumeShares)||b.volumeShares<0||
      !Number.isFinite(b.tradeValue)||b.tradeValue<0)valid=false;
  }
  if(!valid){withheld++;continue;}
  const last=bars.at(-1);
  if([row.open,row.high,row.low,row.close,row.volumeShares,row.tradeValue]
      .some((n,i)=>n!==[last.open,last.high,last.low,last.close,
                        last.volumeShares,last.tradeValue][i])){
    withheld++;continue;
  }
  // Raw-price discontinuity is a CA/price-adjustment review FLAG,
  // not a claim that an action occurred or did not occur.
  const rawDiscontinuity=bars.slice(1).some((b,i)=>
    Math.abs(b.close/bars[i].close-1)>0.20);
  if(rawDiscontinuity){quarantined++;continue;}
  usable++;
  const sma20=bars.slice(-20).reduce((s,b)=>s+b.close,0)/20;
  const fiveSessionReturn=last.close/bars.at(-6).close-1;
  // Explicit descriptive PRELIMINARY observation, no tuned alpha,
  // scoring weights or changes to frozen SHORT_MOMENTUM evaluator.
  if(last.volumeShares>0&&last.tradeValue>0&&
     last.close>sma20&&fiveSessionReturn>0){
    found.push({
      symbol,companyName:row.companyName||null,market:row.market,
      marketDate:bridge.marketDate,
      // Public CI artifact includes only a bounded derived observation,
      // NEVER verbatim official OHLCV/provider raw rows.
      aboveSma20:true,positiveFiveSessionReturn:true,
      fiveSessionReturnPct:Number((fiveSessionReturn*100).toFixed(5)),
      sourceRowHash:row.sourceRowHash,
      companyActionPitStatus:'UNKNOWN_NOT_CLEARED',
      companyActionWarning:'OFFICIAL_CA_VERSION_AND_RAW_ADJUSTMENT_NOT_CERTIFIED',
      marketRegimeWarning:'MARKET_REGIME_NOT_YET_CERTIFIED',
      riskLevel:'PRELIMINARY_OBSERVATION_ONLY',
      formalStrategyValidity:null,
      strategyRank:null,triggerPrice:null,stop:null,targets:null,
    });
  }
 }
 if(symbols.size!==ledger.observations.length||
    usable+withheld+quarantined!==symbols.size)
  deny('OFFICIAL_UNIVERSE_DENOMINATOR_INVALID');
 // Display order is a transparent recent-return DESC, NOT formal strategy rank.
 found.sort((a,b)=>b.fiveSessionReturnPct-a.fiveSessionReturnPct||
                       a.symbol.localeCompare(b.symbol));
 const receipt={...base,
  state:'PRELIMINARY_DAILY_OBSERVATION_NOT_FORMAL_SELECTION',
  blockers:['COMPANY_ACTION_HISTORICAL_PIT_NOT_CERTIFIED',
    'REGIME_AND_STRATEGY_FINAL_RANK_NOT_CERTIFIED',
    'FROZEN_AND_BACKTEST_PROMOTION_NOT_AUTHORIZED'],
  officialUniverseCount:symbols.size,
  historyContinuityUsableCount:usable,
  withheldHistoryCount:withheld,
  anomalyQuarantinedCount:quarantined,
  preliminaryMatchedCount:found.length,
  displayLimit,displayedCount:Math.min(displayLimit,found.length),
  watchlist:found.slice(0,displayLimit)};
 return Object.freeze({...receipt,receiptHash:await sha256Hex(receipt)});
}
