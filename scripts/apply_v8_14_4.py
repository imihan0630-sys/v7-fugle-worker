from pathlib import Path

# V8.14.4 System1-only resource repair.
# Reduces after-market peak memory without changing A/B rules, scoring, quotas, capital,
# history-admission semantics, or System2. Full history is compacted to equivalent
# precomputed pivot resistance after feature extraction.

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text=text.replace(old,new,1)

replace_once(
    'const VERSION = "8.14.3-closure-receipt-memo";',
    'const VERSION = "8.14.4-history-memory-compaction";',
    "runtime version"
)

replace_once(
r'''function buildMarketFeatures(stock) {
  const history = Array.isArray(stock.history) ? stock.history.filter(item => toNumber(item.close) !== null) : [];''',
r'''function buildMarketFeatures(stock) {
  const history = Array.isArray(stock.history) ? stock.history.filter(item => toNumber(item.close) !== null) : [];''',
    "feature function anchor"
)

replace_once(
r'''  const dailyUpperShadowRatio = dayRange > 0 ? (todayHigh - Math.max(open, close)) / dayRange : 0;

  return {
    ...stock, historyDays: history.length, close, open, todayHigh, todayLow,''',
r'''  const dailyUpperShadowRatio = dayRange > 0 ? (todayHigh - Math.max(open, close)) / dayRange : 0;
  const resistancePivotHighs = [];
  const resistanceHistory = history.slice(0,-1);
  for (let i=2;i<resistanceHistory.length-2;i+=1) {
    const h=toNumber(resistanceHistory[i]?.high);
    if(h===null) continue;
    const p1=toNumber(resistanceHistory[i-1]?.high),p2=toNumber(resistanceHistory[i-2]?.high);
    const n1=toNumber(resistanceHistory[i+1]?.high),n2=toNumber(resistanceHistory[i+2]?.high);
    if([p1,p2,n1,n2].every(Number.isFinite) && h>=p1 && h>=p2 && h>=n1 && h>=n2) resistancePivotHighs.push(h);
  }
  const { history: _fullHistoryOmitted, ...stockWithoutHistory } = stock;

  return {
    ...stockWithoutHistory, resistancePivotHighs, historyDays: history.length, close, open, todayHigh, todayLow,''',
    "feature history compaction"
)

replace_once(
r'''  const history = Array.isArray(f.history) ? f.history.slice(0, -1) : [];
  for (let i = 2; i < history.length - 2; i += 1) {
    const h = toNumber(history[i]?.high);
    if (h === null || h <= entry * 1.01) continue;
    const isPivot = h >= toNumber(history[i-1]?.high) && h >= toNumber(history[i-2]?.high) &&
      h >= toNumber(history[i+1]?.high) && h >= toNumber(history[i+2]?.high);
    if (isPivot) levels.push(h);
  }''',
r'''  if(Array.isArray(f.resistancePivotHighs)) {
    for(const raw of f.resistancePivotHighs) {
      const h=toNumber(raw);
      if(h!==null && h>entry*1.01) levels.push(h);
    }
  } else {
    // Compatibility fallback for old fixtures/snapshots only.
    const history = Array.isArray(f.history) ? f.history.slice(0, -1) : [];
    for (let i = 2; i < history.length - 2; i += 1) {
      const h = toNumber(history[i]?.high);
      if (h === null || h <= entry * 1.01) continue;
      const isPivot = h >= toNumber(history[i-1]?.high) && h >= toNumber(history[i-2]?.high) &&
        h >= toNumber(history[i+1]?.high) && h >= toNumber(history[i+2]?.high);
      if (isPivot) levels.push(h);
    }
  }''',
    "equivalent resistance lookup"
)

replace_once(
r'''    let history=admission.usable
      ? seeded.filter(item=>String(item?.date||"")<scanDate).sort((a,b)=>String(a.date).localeCompare(String(b.date)))
      : [];
    history.push({
      date: scanDate, open: row.open, close: row.close, high: row.high, low: row.low,
      volumeShares: row.volumeShares, tradeValue: row.tradeValue,
      foreignNet: toNumber(row.foreignNet), trustNet: toNumber(row.trustNet), dealerNet: toNumber(row.dealerNet),
      institutionTotalNet: toNumber(row.institutionTotalNet), revenueYoY: toNumber(row.revenueYoY),
      revenueMoM: toNumber(row.revenueMoM), grossMargin: toNumber(row.grossMargin),
      operatingMargin: toNumber(row.operatingMargin), eps: toNumber(row.eps)
    });
    history=history.slice(-MARKET_STATE_DAYS);''',
r'''    let history=[];
    if(admission.usable) {
      // historyStructuralShape already proved ordered, non-duplicate, non-future bars.
      // Reuse the ephemeral D1 array in-place instead of allocating a second 60-day array per symbol.
      history=seeded;
      let keep=0;
      for(let i=0;i<history.length;i+=1) {
        if(String(history[i]?.date||"")<scanDate) history[keep++]=history[i];
      }
      history.length=keep;
      const priorKeep=Math.max(0,MARKET_STATE_DAYS-1);
      if(history.length>priorKeep) history.splice(0,history.length-priorKeep);
    }
    history.push({
      date: scanDate, open: row.open, close: row.close, high: row.high, low: row.low,
      volumeShares: row.volumeShares, tradeValue: row.tradeValue,
      foreignNet: toNumber(row.foreignNet), trustNet: toNumber(row.trustNet), dealerNet: toNumber(row.dealerNet),
      institutionTotalNet: toNumber(row.institutionTotalNet), revenueYoY: toNumber(row.revenueYoY),
      revenueMoM: toNumber(row.revenueMoM), grossMargin: toNumber(row.grossMargin),
      operatingMargin: toNumber(row.operatingMargin), eps: toNumber(row.eps)
    });''',
    "reuse history arrays"
)

replace_once(
    '  const cachedHistory = await readHistoryCache(env, HISTORY_CACHE_TARGET + 400);',
    '  let cachedHistory = await readHistoryCache(env, HISTORY_CACHE_TARGET + 400);\n  const historyCacheLoadedCount=Object.keys(cachedHistory||{}).length;',
    "mutable history cache"
)

replace_once(
r'''  const marketState = updateMarketState(previous, rows, enrichment, marketDate,historyAdmission);
  const storedBudget = await env.STOCKS_KV.get(KV_KEY, "json");''',
r'''  const marketState = updateMarketState(previous, rows, enrichment, marketDate,historyAdmission);
  const historySeedSymbolsCount=Object.keys(enrichment.history||{}).length;
  const compactStateForStorage=!dryRun ? compactMarketStateForKv(marketState) : null;
  // marketState now owns/reuses the validated history arrays. Release duplicate container references before feature work.
  enrichment.history={};
  cachedHistory={};
  const storedBudget = await env.STOCKS_KV.get(KV_KEY, "json");''',
    "release history containers before selection"
)

replace_once(
r'''  let featureRows = Object.values(marketState.stocks)
    .filter(stock => rowMap.has(stock.symbol))
    .map(buildEligibleMarketFeature)
    .filter(Boolean);

  const index=env.V7_OFFICIAL_INDEX;''',
r'''  let featureRows = Object.values(marketState.stocks)
    .filter(stock => rowMap.has(stock.symbol))
    .map(buildEligibleMarketFeature)
    .filter(Boolean);
  // buildMarketFeatures has already reduced the only later history dependency to resistancePivotHighs.
  // Drop full per-symbol history before ranking/research diagnostics to reduce Worker peak memory.
  for(const stock of Object.values(marketState.stocks)) {
    if(stock && typeof stock==="object" && Array.isArray(stock.history)) stock.history=[];
  }

  const index=env.V7_OFFICIAL_INDEX;''',
    "drop marketState full history after feature extraction"
)

replace_once(
r'''    const compactState = compactMarketStateForKv(marketState);
    await env.STOCKS_KV.put(MARKET_STATE_KEY, JSON.stringify(compactState));''',
r'''    if(!compactStateForStorage) throw new Error("compact market state unavailable");
    await env.STOCKS_KV.put(MARKET_STATE_KEY, JSON.stringify(compactStateForStorage));''',
    "persist pre-compaction market state"
)

replace_once(
    '      historyCacheCount: Object.keys(cachedHistory || {}).length,',
    '      historyCacheCount: historyCacheLoadedCount,',
    "history cache diagnostics"
)
replace_once(
    '      historySeedSymbols: Object.keys(enrichment.history || {}).length',
    '      historySeedSymbols: historySeedSymbolsCount',
    "history seed diagnostics"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.14.4 history memory compaction")
