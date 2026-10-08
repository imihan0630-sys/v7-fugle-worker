// DATA_LANE / research-only. Classify observed PIT-eligible symbol session gaps.
// This cannot distinguish physically absent bars from records filtered by PIT gates.
export const RECENT60_GAP_TAXONOMY_VERSION="S2_RECENT60_PIT_ELIGIBLE_GAP_TAXONOMY_V0_1";

const PRIMARY_CAUSES=Object.freeze([
  "CURRENT_MARKET_IDENTITY_UNKNOWN",
  "EXPECTED_SESSION_CONTRACT_UNKNOWN",
  "LISTING_BOUNDARY_UNKNOWN",
  "EXPECTED_SESSION_CALENDAR_INSUFFICIENT",
  "REVISION_AMBIGUOUS",
  "EXPECTED_PIT_SESSION_MISSING",
  "UNEXPECTED_PIT_SESSION_PRESENT",
  "INSUFFICIENT_PIT_ELIGIBLE_HISTORY",
  "CONTINUITY_PROOF_MISSING",
  "READY",
]);

function assertInvariant(condition,message){
  if(!condition)throw new Error("Recent60 taxonomy invariant: "+message);
}

export function classifyRecent60SymbolGap(row){
  assertInvariant(row&&typeof row==="object","diagnostic object required");
  const count=Number(row.selectedDateCount||0);
  const expected=Number(row.expectedSessionCount||0);
  const missing=Number(row.missingExpectedSessionCount||0);
  const unexpected=Number(row.unexpectedSessionCount||0);
  const ambiguous=Number(row.ambiguousDateCount||0);
  const continuity=Number(row.continuityEligibleCount||0);
  const need=Number(row.requiredPriorSessionsForSymbol||0);
  assertInvariant([count,expected,missing,unexpected,ambiguous,continuity,need].every(
    n=>Number.isInteger(n)&&n>=0),"nonnegative integer session counts");
  assertInvariant(missing<=expected,"missing exceeds expected");
  assertInvariant(continuity<=count,"certified continuity exceeds observed history");
  assertInvariant(!(row.continuityReady===true&&row.historyReady!==true),
    "continuity readiness without history readiness");
  assertInvariant(!(row.historyReady===true&&row.exactSessionReconciliationReady!==true),
    "history readiness without exact sessions");

  let cause="INSUFFICIENT_PIT_ELIGIBLE_HISTORY";
  if(!row.market)cause="CURRENT_MARKET_IDENTITY_UNKNOWN";
  else if(row.sessionReconciliationState==="EXPECTED_SESSION_CONTRACT_UNAVAILABLE" ||
      row.blockerCodes?.includes("SYMBOL_LOCAL_EXPECTED_SESSION_CONTRACT_UNAVAILABLE"))
    cause="EXPECTED_SESSION_CONTRACT_UNKNOWN";
  else if(row.sessionReconciliationState==="LISTING_BOUNDARY_UNCERTIFIED")
    cause="LISTING_BOUNDARY_UNKNOWN";
  else if(row.sessionReconciliationState==="EXPECTED_SESSION_CALENDAR_WINDOW_INSUFFICIENT")
    cause="EXPECTED_SESSION_CALENDAR_INSUFFICIENT";
  else if(ambiguous>0)cause="REVISION_AMBIGUOUS";
  else if(missing>0)cause="EXPECTED_PIT_SESSION_MISSING";
  else if(unexpected>0)cause="UNEXPECTED_PIT_SESSION_PRESENT";
  else if(row.historyReady===true)
    cause=row.continuityReady===true?"READY":"CONTINUITY_PROOF_MISSING";
  return cause;
}

function blankCounts(){
  return {
    currentSymbolCount:0,
    historyReadyCount:0,
    continuityReadyCount:0,
    missingExpectedSymbolCount:0,
    missingExpectedSessionTotal:0,
    unexpectedSessionSymbolCount:0,
    ambiguousRevisionSymbolCount:0,
    listingAgeLimitedSymbolCount:0,
    noPriorPitEligibleRowsCount:0,
    zeroExpectedSessionCount:0,
    primaryCauseCounts:Object.fromEntries(PRIMARY_CAUSES.map(c=>[c,0])),
    blockerIncidence:{},
    countBuckets:{"0":0,"1_9":0,"10_29":0,"30_59":0,"60_PLUS":0},
  };
}

function addRow(stats,row,cause){
  stats.currentSymbolCount++;
  if(row.historyReady===true)stats.historyReadyCount++;
  if(row.continuityReady===true)stats.continuityReadyCount++;
  const missing=Number(row.missingExpectedSessionCount||0);
  if(missing>0)stats.missingExpectedSymbolCount++;
  stats.missingExpectedSessionTotal+=missing;
  if(Number(row.unexpectedSessionCount||0)>0)stats.unexpectedSessionSymbolCount++;
  if(Number(row.ambiguousDateCount||0)>0)stats.ambiguousRevisionSymbolCount++;
  if(row.listingAgeLimited===true)stats.listingAgeLimitedSymbolCount++;
  const observed=Number(row.selectedDateCount||0);
  if(observed===0)stats.noPriorPitEligibleRowsCount++;
  if(Number(row.expectedSessionCount||0)===0)stats.zeroExpectedSessionCount++;
  stats.primaryCauseCounts[cause]++;
  const bucket=observed===0?"0":observed<=9?"1_9":observed<=29?"10_29":observed<=59?"30_59":"60_PLUS";
  stats.countBuckets[bucket]++;
  for(const code of new Set(row.blockerCodes||[])){
    const key=String(code);
    stats.blockerIncidence[key]=(stats.blockerIncidence[key]||0)+1;
  }
}

function verifyCounts(stats){
  assertInvariant(stats.currentSymbolCount===Object.values(stats.primaryCauseCounts)
    .reduce((a,b)=>a+b,0),"nonexclusive primary causes");
  assertInvariant(stats.currentSymbolCount===Object.values(stats.countBuckets)
    .reduce((a,b)=>a+b,0),"bar-count bucket denominator mismatch");
  assertInvariant(stats.continuityReadyCount<=stats.historyReadyCount,
    "continuity cannot exceed history readiness");
}

export function summarizeRecent60PitEligibleGapsV0_1({
  history,marketDate,topN=12,
}={}){
  assertInvariant(history&&Array.isArray(history.diagnostics),"history.diagnostics required");
  assertInvariant(Number.isInteger(topN)&&topN>=0&&topN<=25,"topN must be 0..25");
  const rows=history.diagnostics;
  const summary=blankCounts();
  const markets={TWSE:blankCounts(),TPEX:blankCounts(),UNKNOWN:blankCounts()};
  const ranked=[];
  const identity=new Set();
  for(const row of rows){
    const symbol=String(row.symbol||"").trim();
    const market=row.market==="TWSE"?"TWSE":row.market==="TPEX"?"TPEX":"UNKNOWN";
    const key=market+"|"+symbol;
    assertInvariant(symbol.length>0&&!identity.has(key),"symbol identity missing or duplicated");
    identity.add(key);
    const cause=classifyRecent60SymbolGap(row);
    addRow(summary,row,cause);
    addRow(markets[market],row,cause);
    if(cause!=="READY")ranked.push({
      market,rowSymbol:symbol,primaryCause:cause,
      selectedDateCount:Number(row.selectedDateCount||0),
      requiredPriorSessionsForSymbol:Number(row.requiredPriorSessionsForSymbol||0),
      missingExpectedSessionCount:Number(row.missingExpectedSessionCount||0),
      unexpectedSessionCount:Number(row.unexpectedSessionCount||0),
      ambiguousDateCount:Number(row.ambiguousDateCount||0),
      continuityEligibleCount:Number(row.continuityEligibleCount||0),
      sampleMissingExpectedDates:[...(row.missingExpectedSessionSample||[])].slice(0,8),
    });
  }
  verifyCounts(summary);
  for(const one of Object.values(markets))verifyCounts(one);
  assertInvariant(summary.currentSymbolCount===Number(history.currentUniverseCount),
    "symbol count disagrees with official current-universe denominator");
  assertInvariant(summary.historyReadyCount===Number(history.historyReadyCount),
    "history READY count disagrees with reader");
  assertInvariant(summary.continuityReadyCount===Number(history.continuityReadyCount),
    "continuity READY count disagrees with reader");
  assertInvariant(history.accountingComplete===true,
    "universe accounting must be complete; do not emit misleading gap distribution");
  ranked.sort((a,b)=>
    b.missingExpectedSessionCount-a.missingExpectedSessionCount
    || a.selectedDateCount-b.selectedDateCount
    || a.market.localeCompare(b.market)
    || a.rowSymbol.localeCompare(b.rowSymbol));
  return {
    schemaVersion:RECENT60_GAP_TAXONOMY_VERSION,
    marketDate:String(marketDate||history.marketDate||""),
    requiredPriorSessions:Number(history.requiredPriorSessions||60),
    exactSessionReconciliationEnabled:history.exactSessionReconciliationEnabled===true,
    listingMetadataState:history.listingMetadataState||null,
    globalIntegrityState:history.globalIntegrityState||null,
    primaryCauseSemantics:"MUTUALLY_EXCLUSIVE_FIRST_BLOCKER_PRIORITY_NOT_CAUSAL_PROOF",
    blockerIncidenceSemantics:"NON_EXCLUSIVE_SYMBOL_COUNTS",
    missingExpectedSessionSemantics:"PIT_ELIGIBLE_A1_ROW_ABSENT_FROM_EXACT_SESSION_SET; PHYSICAL_ABSENCE_VS_PIT_FILTER_UNKNOWN",
    certificateSemantics:"CONTINUITY_READY_REQUIRES_INDEPENDENT_CERTIFICATE; ZERO_READY_IS_NOT_ZERO_AVAILABLE_HISTORY",
    sourcePhysicalGapVsPITFilter:"NOT_DISTINGUISHED_BY_THIS_READ_ONLY_RESULT",
    sampleMissingDateSemantics:"AT_MOST_EIGHT_PER_SYMBOL_NOT_A_FULL_MISSING_DATE_POPULATION",
    localSymbolCounts:summary,
    byMarket:markets,
    topMissingPITEligibleExamples:ranked.slice(0,topN),
    requiredNextEvidence:[
      "SEPARATE_PHYSICAL_D1_ROW_PRESENCE_FROM_PIT_ELIGIBILITY_WITH_READONLY_LIVE_QUERY",
      "OBTAIN_COMPLETE_OFFICIAL_SESSION_AND_LISTING_MEMBERSHIP",
      "BIND_SOURCE_HONEST_NO_ACTION_OR_CORPORATE_ACTION_CONTINUITY_RECEIPT",
    ],
    storageMutationPerformed:false,
    system1RuntimeUsed:false,
    sourceDatesBackfilled:false,
    strategyPromotionAuthorized:false,
  };
}
