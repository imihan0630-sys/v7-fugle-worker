import { deepFreeze } from "./factor_snapshot.mjs";

export const S2_07_RAW_A1_LINEAGE_VERSION="0.10-RESEARCH";

function text(v){return v==null?"":String(v).trim();}
function validDate(v){return /^\d{4}-\d{2}-\d{2}$/.test(text(v));}
function uniqueSortedDates(values){
  const out=[...new Set((Array.isArray(values)?values:[]).map(String))].sort();
  if(!out.every(validDate))throw new Error("marketSessions must contain YYYY-MM-DD dates");
  return out;
}
function addBlocker(blockers,code,detail=null){
  if(!blockers.some(x=>x.code===code&&x.detail===detail))blockers.push({code,detail});
}

export function buildBoundedRawA1SessionPlanV0_10({
  market,
  symbol,
  stopTradingStart,
  resumeTradingDate,
  boundedNativeSymbolSessionEvidenceReady,
  marketSessions=[],
}={}){
  const mkt=text(market).toUpperCase();
  const code=text(symbol);
  const stop=text(stopTradingStart);
  const resume=text(resumeTradingDate);
  if(!["TWSE","TPEX"].includes(mkt))throw new Error("market must be TWSE or TPEX");
  if(!/^[1-9][0-9]{3}$/.test(code))throw new Error("symbol must be four digits");
  if(!validDate(stop)||!validDate(resume))throw new Error("stop/resume dates must be YYYY-MM-DD");
  if(stop>=resume)throw new Error("stopTradingStart must be earlier than resumeTradingDate");
  const sessions=uniqueSortedDates(marketSessions);
  const priorSessions=sessions.filter(x=>x<stop);
  const priorSession=priorSessions.length?priorSessions[priorSessions.length-1]:null;
  const suspendedMarketSessions=sessions.filter(x=>x>=stop&&x<resume);
  const resumeIsMarketSession=sessions.includes(resume);
  const requiredDates=[
    ...(priorSession?[priorSession]:[]),
    ...suspendedMarketSessions,
    ...(resumeIsMarketSession?[resume]:[]),
  ];
  return deepFreeze({
    schemaVersion:"S2_S2_07_RAW_A1_SESSION_PLAN_V0_10",
    version:S2_07_RAW_A1_LINEAGE_VERSION,
    market:mkt,
    symbol:code,
    stopTradingStart:stop,
    resumeTradingDate:resume,
    boundedNativeSymbolSessionEvidenceReady:boundedNativeSymbolSessionEvidenceReady===true,
    priorTradingSession:priorSession,
    suspendedMarketSessions:Object.freeze(suspendedMarketSessions),
    resumeIsMarketSession,
    requiredDates:Object.freeze([...new Set(requiredDates)]),
    historyMutationPerformed:false,
    technicalContinuityCertified:false,
    selectionAuthority:false,
    orderImpact:false,
  });
}

export function evaluateBoundedRawA1LineageV0_10({
  plan,
  observations=[],
}={}){
  if(!plan||plan.schemaVersion!=="S2_S2_07_RAW_A1_SESSION_PLAN_V0_10")throw new Error("valid plan is required");
  if(!Array.isArray(observations))throw new Error("observations must be array");
  const blockers=[];
  if(plan.boundedNativeSymbolSessionEvidenceReady!==true)addBlocker(blockers,"NATIVE_SCHEDULE_EVIDENCE_NOT_READY");
  if(!plan.priorTradingSession)addBlocker(blockers,"BOUNDARY_PRIOR_SESSION_NOT_RESOLVED");
  if(!plan.resumeIsMarketSession)addBlocker(blockers,"RESUME_SESSION_NOT_IN_MARKET_CALENDAR");

  const byDate=new Map();
  for(const row of observations){
    if(!row||!validDate(row.marketDate))throw new Error("observation.marketDate must be YYYY-MM-DD");
    if(byDate.has(row.marketDate))throw new Error("duplicate observation marketDate: "+row.marketDate);
    byDate.set(row.marketDate,row);
  }

  const suspendedSet=new Set(plan.suspendedMarketSessions);
  const sessionObservations=[];
  for(const date of plan.requiredDates){
    const row=byDate.get(date)||null;
    if(!row){
      addBlocker(blockers,"RAW_A1_REQUIRED_DATE_OBSERVATION_MISSING",date);
      sessionObservations.push({marketDate:date,state:"OBSERVATION_MISSING"});
      continue;
    }
    if(row.sourceDateEvidence!==date)addBlocker(blockers,"RAW_A1_SOURCE_DATE_MISMATCH",date);
    if(row.rawPriceSpace!=="RAW")addBlocker(blockers,"RAW_A1_PRICE_SPACE_NOT_RAW",date);
    if(!text(row.sourceId)||!text(row.sourceUrl)||!text(row.sourcePopulationHash)){
      addBlocker(blockers,"RAW_A1_SOURCE_PROVENANCE_MISSING",date);
    }

    const tradable=row.tradableOhlcObserved===true;
    let state="SOURCE_DATE_OBSERVED";
    if(date===plan.priorTradingSession){
      state=tradable?"PRE_STOP_TRADABLE_BAR_OBSERVED":"PRE_STOP_TRADABLE_BAR_NOT_OBSERVED";
      if(!tradable)addBlocker(blockers,"PRE_STOP_TRADABLE_BAR_NOT_OBSERVED",date);
    }else if(date===plan.resumeTradingDate){
      state=tradable?"RESUME_TRADABLE_BAR_OBSERVED":"RESUME_TRADABLE_BAR_NOT_OBSERVED";
      if(!tradable)addBlocker(blockers,"RESUME_TRADABLE_BAR_NOT_OBSERVED",date);
    }else if(suspendedSet.has(date)){
      state=tradable?"UNEXPECTED_TRADABLE_BAR_DURING_CERTIFIED_SUSPENSION":"SUSPENSION_SESSION_NO_TRADABLE_BAR_OBSERVED";
      if(tradable)addBlocker(blockers,"UNEXPECTED_TRADABLE_BAR_DURING_CERTIFIED_SUSPENSION",date);
    }
    sessionObservations.push({
      marketDate:date,
      state,
      sourceId:row.sourceId||null,
      sourceUrl:row.sourceUrl||null,
      sourceDateEvidence:row.sourceDateEvidence||null,
      sourceDateEvidenceBasis:row.sourceDateEvidenceBasis||null,
      transportMode:row.transportMode||null,
      rawPriceSpace:row.rawPriceSpace||null,
      sourcePopulationHash:row.sourcePopulationHash||null,
      symbolRowObserved:row.symbolRowObserved===true,
      symbolRowHash:row.symbolRowHash||null,
      tradableOhlcObserved:tradable,
    });
  }

  const rawA1LineageEvidenceReady=blockers.length===0;
  return deepFreeze({
    schemaVersion:"S2_S2_07_RAW_A1_LINEAGE_EVALUATION_V0_10",
    version:S2_07_RAW_A1_LINEAGE_VERSION,
    market:plan.market,
    symbol:plan.symbol,
    stopTradingStart:plan.stopTradingStart,
    resumeTradingDate:plan.resumeTradingDate,
    priorTradingSession:plan.priorTradingSession,
    suspendedMarketSessionCount:plan.suspendedMarketSessions.length,
    requiredDateCount:plan.requiredDates.length,
    state:rawA1LineageEvidenceReady?"BOUNDED_RAW_A1_LINEAGE_EVIDENCE_READY":"RAW_A1_LINEAGE_EVIDENCE_BLOCKED",
    rawA1LineageEvidenceReady,
    blockers:Object.freeze(blockers),
    sessionObservations:Object.freeze(sessionObservations),
    suspendedSessionsTreatedAsMissingData:false,
    historicalPublicationTimestampProven:false,
    pitHistoricalPublicationClockCertified:false,
    rawA1LineageBound:rawA1LineageEvidenceReady,
    technicalContinuityCertified:false,
    continuityTransformPerformed:false,
    historyMutationPerformed:false,
    strategyEvaluationPerformed:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}

export function summarizeBoundedRawA1LineageV0_10(rows=[]){
  if(!Array.isArray(rows))throw new Error("rows must be array");
  const blockerCounts={};
  for(const row of rows)for(const b of row?.blockers||[])blockerCounts[b.code]=(blockerCounts[b.code]||0)+1;
  return deepFreeze({
    schemaVersion:"S2_S2_07_RAW_A1_LINEAGE_SUMMARY_V0_10",
    eventCount:rows.length,
    rawA1LineageEvidenceReadyCount:rows.filter(x=>x?.rawA1LineageEvidenceReady===true).length,
    blockedCount:rows.filter(x=>x?.rawA1LineageEvidenceReady!==true).length,
    totalSuspendedMarketSessions:rows.reduce((n,x)=>n+Number(x?.suspendedMarketSessionCount||0),0),
    blockerCounts:deepFreeze(blockerCounts),
    suspendedSessionsTreatedAsMissingData:false,
    historicalPublicationTimestampProven:false,
    pitHistoricalPublicationClockCertified:false,
    technicalContinuityCertified:false,
    continuityTransformPerformed:false,
    historyMutationPerformed:false,
    selectionAuthority:false,
    finalSelectionEnabled:false,
    livePushEnabled:false,
    capitalImpact:false,
    orderImpact:false,
    system1RuntimeUsed:false,
  });
}
