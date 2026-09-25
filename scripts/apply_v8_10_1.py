from pathlib import Path

# V8.10.1 Class-B proposal: history freshness guard.
# Fixes stale >=60-bar caches being treated as complete on a later market date.
# Formal A/B definitions, ranking, capital, execution, monitoring and push rules are unchanged.

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text=text.replace(old,new,1)

def insert_before_once(marker,addition,label):
    global text
    count=text.count(marker)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 marker, found {count}")
    text=text.replace(marker,addition+marker,1)

replace_once(
    'const VERSION = "8.10.0-aideen-independent-pool";',
    'const VERSION = "8.10.1-history-freshness";',
    "runtime version"
)

replace_once(
    'const HISTORY_SEED_SCHEMA = "full-market-v2";',
    'const HISTORY_SEED_SCHEMA = "full-market-v3-history-freshness";',
    "history seed schema"
)

helpers=r'''
function previousTradingDateForHistory(marketDate) {
  return mostRecentWeekday(shiftDateString(marketDate, -1));
}

function historyFreshnessState(history, marketDate, previousTradingDate) {
  const rows=Array.isArray(history) ? history : [];
  const rawDates=rows.map(item=>String(item?.date || "").slice(0,10)).filter(Boolean);
  const uniqueDates=[...new Set(rawDates)];
  const ordered=rawDates.every((date,index)=>index===0 || rawDates[index-1] < date);
  const noDuplicates=uniqueDates.length===rawDates.length;
  const latestDate=rawDates.length ? rawDates.at(-1) : null;
  const noFuture=rawDates.every(date=>date<=marketDate);
  const latestFresh=latestDate===marketDate || latestDate===previousTradingDate;
  const barCountSufficient=rawDates.length>=60;
  const complete=barCountSufficient && ordered && noDuplicates && noFuture && latestFresh;
  return {
    complete,barCountSufficient,ordered,noDuplicates,noFuture,latestFresh,
    latestDate,marketDate,previousTradingDate,barCount:rawDates.length,
    staleReason:complete ? null :
      !barCountSufficient ? "LT_60_BARS" :
      !ordered ? "DATE_ORDER_INVALID" :
      !noDuplicates ? "DUPLICATE_DATE" :
      !noFuture ? "FUTURE_DATE" :
      !latestFresh ? "LATEST_DATE_STALE" : "UNKNOWN"
  };
}

'''
insert_before_once(
    'async function runHistorySeed(env, scheduledTime = Date.now(), limit = HISTORY_WARMUP_LIMIT) {',
    helpers,
    "history freshness helpers"
)

replace_once(
'''    const cached = await readHistoryCache(env, HISTORY_CACHE_TARGET + 400);
    const completeCached = new Set(Object.entries(cached)
      .filter(([symbol, history]) => targetSet.has(symbol) && Array.isArray(history) && history.length >= 60)
      .map(([symbol]) => symbol));

    const queue = ordered.filter(symbol => !completeCached.has(symbol));''',
'''    const cached = await readHistoryCache(env, HISTORY_CACHE_TARGET + 400);
    const previousTradingDate=previousTradingDateForHistory(marketDate);
    const freshnessBySymbol=new Map(Object.entries(cached)
      .filter(([symbol])=>targetSet.has(symbol))
      .map(([symbol,history])=>[symbol,historyFreshnessState(history,marketDate,previousTradingDate)]));
    const completeCached = new Set([...freshnessBySymbol.entries()]
      .filter(([,state]) => state.complete)
      .map(([symbol]) => symbol));
    const staleCachedSymbols=[...freshnessBySymbol.entries()]
      .filter(([,state])=>state.barCountSufficient && !state.complete)
      .map(([symbol,state])=>({symbol,latestDate:state.latestDate,reason:state.staleReason}));

    const queue = ordered.filter(symbol => !completeCached.has(symbol));''',
    "seed complete cache freshness"
)

replace_once(
'''      insufficientSymbols: [],
      seedSchema: HISTORY_SEED_SCHEMA,''',
'''      insufficientSymbols: [],
      staleCachedSymbols,
      previousTradingDate,
      seedSchema: HISTORY_SEED_SCHEMA,''',
    "seed state freshness diagnostics"
)

replace_once(
'''async function fetchHistoryWarmup(targetRows, marketDate, env) {
  const history = {};
  let fetched = 0;''',
'''async function fetchHistoryWarmup(targetRows, marketDate, env) {
  const history = {};
  const previousTradingDate=previousTradingDateForHistory(marketDate);
  let fetched = 0;''',
    "warmup previous trading date"
)

replace_once(
'''      fetched += 1;
      // >=60 日才算真正完成 60 日技術底庫。
      if (item.bars.length >= 60) {
        history[item.symbol] = item.bars.slice(-MARKET_STATE_DAYS);
        complete += 1;
        continue;
      }

      // 新上市/歷史天然不足者標記為「已處理但不足60日」，不讓暖機永遠卡在最後幾檔。
      // 有20日以上仍保留到D1，未來交易日重建佇列時會再次檢查，滿60日後自然升級。
      if (item.bars.length >= 20) history[item.symbol] = item.bars.slice(-MARKET_STATE_DAYS);
      insufficient += 1;
      insufficientSymbols.push(item.symbol);''',
'''      fetched += 1;
      const freshness=historyFreshnessState(item.bars,marketDate,previousTradingDate);
      // >=60 日且最新日期至少到當日/前一交易日，才算真正完成技術底庫。
      if (freshness.complete) {
        history[item.symbol] = item.bars.slice(-MARKET_STATE_DAYS);
        complete += 1;
        continue;
      }
      if (freshness.barCountSufficient) {
        // 60日足夠但日期過舊/重複/逆序：這是資料品質失敗，不得誤算完成。
        failed += 1;
        failedSymbols.push(item.symbol);
        continue;
      }

      // 新上市/歷史天然不足者：只有資料本身是新鮮的，才標記為已處理但不足60日。
      if (!freshness.latestFresh || !freshness.ordered || !freshness.noDuplicates || !freshness.noFuture) {
        failed += 1;
        failedSymbols.push(item.symbol);
        continue;
      }
      if (item.bars.length >= 20) history[item.symbol] = item.bars.slice(-MARKET_STATE_DAYS);
      insufficient += 1;
      insufficientSymbols.push(item.symbol);''',
    "warmup freshness validation"
)

replace_once(
'''  const requestedDate = taiwanDate(scheduledTime);
  await loadTradingCalendar(env, Number(requestedDate.slice(0, 4)));
  if (requestedDate.slice(5) >= "12-31") await loadTradingCalendar(env, Number(requestedDate.slice(0, 4)) + 1);
  const requestedMarketDate = mostRecentWeekday(requestedDate);''',
'''  const requestedDate = taiwanDate(scheduledTime);
  await loadTradingCalendar(env, Number(requestedDate.slice(0, 4)));
  if (requestedDate.slice(5) <= "01-07") await loadTradingCalendar(env, Number(requestedDate.slice(0, 4)) - 1);
  if (requestedDate.slice(5) >= "12-31") await loadTradingCalendar(env, Number(requestedDate.slice(0, 4)) + 1);
  const requestedMarketDate = mostRecentWeekday(requestedDate);''',
    "scan prior year calendar"
)

replace_once(
'''  const rows = mergeEnrichment(rawRows, enrichment);
  const indexData=await readQualitySnapshot(env,"INDEX",marketDate);''',
'''  const rows = mergeEnrichment(rawRows, enrichment);
  const previousTradingDate=previousTradingDateForHistory(marketDate);
  const historyTarget=Math.min(HISTORY_CACHE_TARGET, rows.filter(row=>row && row.close>=MIN_CLOSE_PRICE).length);
  const targetSymbols=new Set(rows.filter(row=>row && row.close>=MIN_CLOSE_PRICE).map(row=>String(row.symbol)));
  const staleHistorySymbols=Object.entries(cachedHistory || {})
    .filter(([symbol,history])=>targetSymbols.has(String(symbol)) && historyFreshnessState(history,marketDate,previousTradingDate).barCountSufficient &&
      !historyFreshnessState(history,marketDate,previousTradingDate).complete)
    .map(([symbol,history])=>{
      const state=historyFreshnessState(history,marketDate,previousTradingDate);
      return {symbol:String(symbol),latestDate:state.latestDate,reason:state.staleReason};
    });
  const historySeedStateBeforeScan=await readHistorySeedState(env);
  const historySeedResolved=historySeedStateBeforeScan?.marketDate===marketDate && historySeedStateBeforeScan?.seedSchema===HISTORY_SEED_SCHEMA
    ? Math.max(0,Number(historySeedStateBeforeScan?.resolvedCount || 0)) : 0;
  const historySeedReady=historyTarget>0 && historySeedResolved>=historyTarget;
  if(staleHistorySymbols.length || !historySeedReady) {
    throw new Error(`DATA_INCOMPLETE：歷史日K新鮮度未完成；seed ${historySeedResolved}/${historyTarget}，過期60日快取 ${staleHistorySymbols.length} 檔${staleHistorySymbols.length ? "（"+staleHistorySymbols.slice(0,8).map(x=>x.symbol+":"+x.latestDate).join(",")+"）" : ""}；保留既有計畫`);
  }
  const indexData=await readQualitySnapshot(env,"INDEX",marketDate);''',
    "scan freshness fail closed"
)

replace_once(
'''  const historySeedState = await readHistorySeedState(env);
  const historyTarget = Math.min(HISTORY_CACHE_TARGET, rows.filter(row => row.close >= MIN_CLOSE_PRICE).length);
  const historyResolved = historySeedState?.marketDate === marketDate
    ? Math.max(0, Number(historySeedState?.resolvedCount || 0))
    : 0;''',
'''  const historySeedState = historySeedStateBeforeScan;
  const historyResolved = historySeedResolved;''',
    "reuse verified history seed state"
)

replace_once(
'''      historyCacheTarget: historyTarget,
      history60DayCount: Number(scan.diagnostics?.with60Days || 0),
      historyWarmupResolved: historyResolved,''',
'''      historyCacheTarget: historyTarget,
      history60DayCount: Number(scan.diagnostics?.with60Days || 0),
      historyFreshnessPreviousTradingDate: previousTradingDate,
      historyStale60DayCount: staleHistorySymbols.length,
      historySeedReady,
      historyWarmupResolved: historyResolved,''',
    "summary freshness diagnostics"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.10.1 history freshness guard")
