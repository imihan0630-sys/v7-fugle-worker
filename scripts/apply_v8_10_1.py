from pathlib import Path

# V8.10.1 Class-B daily-history freshness / continuity guard.
# This patch changes only data-integrity admission for the existing Formal formulas.

path = Path("Worker.js")
text = path.read_text(encoding="utf-8")


def replace_once(old, new, label):
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text = text.replace(old, new, 1)


def insert_before_once(marker, addition, label):
    global text
    count = text.count(marker)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 marker, found {count}")
    text = text.replace(marker, addition + marker, 1)


replace_once(
    'const VERSION = "8.10.0-aideen-independent-pool";',
    'const VERSION = "8.10.1-history-freshness-guard";',
    "runtime version",
)

replace_once(
    'const HISTORY_SEED_SCHEMA = "full-market-v2";',
    'const HISTORY_SEED_SCHEMA = "full-market-v3-history-freshness";\n'
    'const HISTORY_FRESHNESS_REQUIRED_PRIOR_SESSIONS = 60;',
    "history seed schema and freshness window",
)

helpers = r'''
async function loadHistoryFreshnessCalendars(env, marketDate) {
  const start=shiftDateString(marketDate,-HISTORY_LOOKBACK_CALENDAR_DAYS);
  const firstYear=Number(start.slice(0,4)),lastYear=Number(marketDate.slice(0,4));
  for(let year=firstYear;year<=lastYear;year+=1) await loadTradingCalendar(env,year);
}

function expectedTradingSessionsBefore(marketDate, requiredSessions=HISTORY_FRESHNESS_REQUIRED_PRIOR_SESSIONS) {
  const required=Math.max(1,Math.floor(Number(requiredSessions)||HISTORY_FRESHNESS_REQUIRED_PRIOR_SESSIONS));
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(marketDate||""))) {
    return {status:"UNKNOWN",reason:"INVALID_MARKET_DATE",sessions:[],missingCalendarYears:[]};
  }
  const sessions=[],missingCalendarYears=new Set();
  let cursor=shiftDateString(marketDate,-1),scanned=0;
  while(sessions.length<required && scanned<HISTORY_LOOKBACK_CALENDAR_DAYS+370) {
    const year=Number(cursor.slice(0,4));
    if(!MARKET_CALENDARS.has(year)) {
      missingCalendarYears.add(year);
      return {status:"UNKNOWN",reason:"CALENDAR_UNAVAILABLE",sessions:[],missingCalendarYears:[...missingCalendarYears]};
    }
    if(isTradingDate(cursor)) sessions.push(cursor);
    cursor=shiftDateString(cursor,-1);
    scanned+=1;
  }
  if(sessions.length<required) {
    return {status:"UNKNOWN",reason:"CALENDAR_RANGE_INSUFFICIENT",sessions:[],missingCalendarYears:[...missingCalendarYears]};
  }
  return {status:"READY",reason:null,sessions:sessions.reverse(),missingCalendarYears:[]};
}

function validateHistoryFreshness(history, marketDate, options={}) {
  const required=Math.max(1,Math.floor(Number(options.requiredSessions)||HISTORY_FRESHNESS_REQUIRED_PRIOR_SESSIONS));
  const allowTargetDateBar=options.allowTargetDateBar===true;
  const fail=(reason,extra={})=>({
    usable:false,status:reason==="CALENDAR_UNAVAILABLE"||reason==="CALENDAR_RANGE_INSUFFICIENT"?"UNKNOWN":"DATA_INCOMPLETE",
    reason,marketDate,requiredSessions:required,...extra
  });
  if(!Array.isArray(history)) return fail("HISTORY_NOT_ARRAY");
  const dates=[];
  for(const item of history) {
    const date=String(item?.date||"").slice(0,10);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fail("INVALID_BAR_DATE",{barDate:date||null});
    dates.push(date);
  }
  for(let index=1;index<dates.length;index+=1) {
    if(dates[index]===dates[index-1]) return fail("DUPLICATE_BAR_DATE",{barDate:dates[index]});
    if(dates[index]<dates[index-1]) return fail("OUT_OF_ORDER_BAR_DATE",{previousDate:dates[index-1],barDate:dates[index]});
  }
  const future=dates.find(date=>date>marketDate);
  if(future) return fail("FUTURE_BAR_DATE",{barDate:future});
  if(!allowTargetDateBar && dates.includes(marketDate)) return fail("TARGET_DATE_BAR_NOT_ALLOWED",{barDate:marketDate});
  const priorDates=dates.filter(date=>date<marketDate);
  if(priorDates.length<required) return fail("INSUFFICIENT_PRIOR_SESSIONS",{observedPriorSessions:priorDates.length});
  const expected=expectedTradingSessionsBefore(marketDate,required);
  if(expected.status!=="READY") return fail(expected.reason,{missingCalendarYears:expected.missingCalendarYears||[]});
  const recent=priorDates.slice(-required),expectedPriorDate=expected.sessions.at(-1),latestPriorDate=recent.at(-1)||null;
  if(latestPriorDate!==expectedPriorDate) return fail("STALE_LATEST_SESSION",{latestPriorDate,expectedPriorDate});
  const mismatch=recent.findIndex((date,index)=>date!==expected.sessions[index]);
  if(mismatch>=0) return fail("INTERNAL_SESSION_GAP",{
    mismatchIndex:mismatch,observedDate:recent[mismatch],expectedDate:expected.sessions[mismatch],latestPriorDate,expectedPriorDate
  });
  return {usable:true,status:"VALID",reason:null,marketDate,requiredSessions:required,
    observedPriorSessions:priorDates.length,latestPriorDate,expectedPriorDate,targetDateBarIgnored:allowTargetDateBar&&dates.includes(marketDate)};
}

function buildEligibleMarketFeature(stock) {
  if(stock?.historyFreshness?.usable===false) return null;
  return buildMarketFeatures(stock);
}

'''
insert_before_once("function updateMarketState(previous, rows, enrichment, scanDate) {", helpers, "freshness helpers")

replace_once(
r'''function updateMarketState(previous, rows, enrichment, scanDate) {
  const state = { version: 2, updatedAt: new Date().toISOString(), lastDate: scanDate, stocks: { ...(previous.stocks || {}) } };
  for (const row of rows) {
    const old = state.stocks[row.symbol] || {};
    const seeded = Array.isArray(enrichment.history?.[row.symbol]) ? enrichment.history[row.symbol] : [];
    const oldHistory = Array.isArray(old.history) ? old.history : [];
    let history = seeded.length > oldHistory.length ? seeded : oldHistory;
    history = history.filter(item => String(item.date || "") < scanDate).sort((a, b) => String(a.date).localeCompare(String(b.date)));
    history.push({
      date: scanDate, open: row.open, close: row.close, high: row.high, low: row.low,
      volumeShares: row.volumeShares, tradeValue: row.tradeValue,
      foreignNet: toNumber(row.foreignNet), trustNet: toNumber(row.trustNet), dealerNet: toNumber(row.dealerNet),
      institutionTotalNet: toNumber(row.institutionTotalNet), revenueYoY: toNumber(row.revenueYoY),
      revenueMoM: toNumber(row.revenueMoM), grossMargin: toNumber(row.grossMargin),
      operatingMargin: toNumber(row.operatingMargin), eps: toNumber(row.eps)
    });
    history = history.sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(-MARKET_STATE_DAYS);
    state.stocks[row.symbol] = { ...old, ...row, history };
  }
  return state;
}''',
r'''function updateMarketState(previous, rows, enrichment, scanDate) {
  const state = {version:2,updatedAt:new Date().toISOString(),lastDate:scanDate,stocks:{...(previous.stocks||{})},
    historyFreshness:{marketDate:scanDate,requiredPriorSessions:HISTORY_FRESHNESS_REQUIRED_PRIOR_SESSIONS,usableSymbols:0,unusableSymbols:0,reasons:{},samples:[]}};
  for (const row of rows) {
    const old = state.stocks[row.symbol] || {};
    const seeded = Array.isArray(enrichment.history?.[row.symbol]) ? enrichment.history[row.symbol] : [];
    const oldHistory = Array.isArray(old.history) ? old.history : [];
    const candidates=[{source:"D1_HISTORY_CACHE",history:seeded},{source:"KV_RECENT_FALLBACK",history:oldHistory}]
      .map(item=>({...item,validation:validateHistoryFreshness(item.history,scanDate,{allowTargetDateBar:true})}))
      .filter(item=>item.validation.usable)
      .sort((a,b)=>b.history.length-a.history.length);
    const chosen=candidates[0]||null;
    const failure=chosen?null:validateHistoryFreshness(seeded.length?seeded:oldHistory,scanDate,{allowTargetDateBar:true});
    let history=chosen
      ? chosen.history.filter(item=>String(item?.date||"").slice(0,10)<scanDate)
      : [];
    history.push({
      date: scanDate, open: row.open, close: row.close, high: row.high, low: row.low,
      volumeShares: row.volumeShares, tradeValue: row.tradeValue,
      foreignNet: toNumber(row.foreignNet), trustNet: toNumber(row.trustNet), dealerNet: toNumber(row.dealerNet),
      institutionTotalNet: toNumber(row.institutionTotalNet), revenueYoY: toNumber(row.revenueYoY),
      revenueMoM: toNumber(row.revenueMoM), grossMargin: toNumber(row.grossMargin),
      operatingMargin: toNumber(row.operatingMargin), eps: toNumber(row.eps)
    });
    history=history.slice(-MARKET_STATE_DAYS);
    const historyFreshness=chosen
      ? {...chosen.validation,source:chosen.source}
      : {...failure,source:seeded.length?"D1_HISTORY_CACHE":"KV_RECENT_FALLBACK"};
    if(historyFreshness.usable) state.historyFreshness.usableSymbols+=1;
    else {
      state.historyFreshness.unusableSymbols+=1;
      state.historyFreshness.reasons[historyFreshness.reason]=(state.historyFreshness.reasons[historyFreshness.reason]||0)+1;
      if(state.historyFreshness.samples.length<50) state.historyFreshness.samples.push({symbol:row.symbol,reason:historyFreshness.reason,
        latestPriorDate:historyFreshness.latestPriorDate||null,expectedPriorDate:historyFreshness.expectedPriorDate||null,status:historyFreshness.status});
    }
    state.stocks[row.symbol] = { ...old, ...row, history, historyFreshness };
  }
  return state;
}''',
    "fail-closed market-state history guard",
)

replace_once(
r'''  let featureRows = Object.values(marketState.stocks)
    .filter(stock => rowMap.has(stock.symbol))
    .map(buildMarketFeatures)
    .filter(Boolean);''',
r'''  let featureRows = Object.values(marketState.stocks)
    .filter(stock => rowMap.has(stock.symbol))
    .map(buildEligibleMarketFeature)
    .filter(Boolean);''',
    "Formal feature admission guard",
)

replace_once(
    '  const marketDate = requestedMarketDate;\n  const cachedHistory = await readHistoryCache(env, HISTORY_CACHE_TARGET + 400);',
    '  const marketDate = requestedMarketDate;\n  await loadHistoryFreshnessCalendars(env, marketDate);\n'
    '  const cachedHistory = await readHistoryCache(env, HISTORY_CACHE_TARGET + 400);',
    "after-market calendar coverage",
)

replace_once(
    '  const marketState = updateMarketState(previous, rows, enrichment, marketDate);\n'
    '  const storedBudget = await env.STOCKS_KV.get(KV_KEY, "json");',
    '  const marketState = updateMarketState(previous, rows, enrichment, marketDate);\n'
    '  const storedBudget = await env.STOCKS_KV.get(KV_KEY, "json");',
    "market-state guard anchor",
)

replace_once(
    '  const scan = selectTomorrowCandidates(marketState, rows, { ...env, V7_TOTAL_CAPITAL: totalCapital, V7_OFFICIAL_INDEX:indexData, V7_MARKET_CONSENSUS:marketConsensus }, marketDate);',
    '  const scan = selectTomorrowCandidates(marketState, rows, { ...env, V7_TOTAL_CAPITAL: totalCapital, V7_OFFICIAL_INDEX:indexData, V7_MARKET_CONSENSUS:marketConsensus }, marketDate);\n'
    '  scan.diagnostics.historyFreshness=marketState.historyFreshness;',
    "history freshness diagnostics",
)

replace_once(
    '  const marketDate = mostRecentWeekday(requestedDate);\n  const batchLimit = Math.max(1, Math.min(Number(limit) || HISTORY_WARMUP_LIMIT, HISTORY_WARMUP_LIMIT));',
    '  const marketDate = mostRecentWeekday(requestedDate);\n  await loadHistoryFreshnessCalendars(env, marketDate);\n'
    '  const batchLimit = Math.max(1, Math.min(Number(limit) || HISTORY_WARMUP_LIMIT, HISTORY_WARMUP_LIMIT));',
    "history seed calendar coverage",
)

replace_once(
r'''    const completeCached = new Set(Object.entries(cached)
      .filter(([symbol, history]) => targetSet.has(symbol) && Array.isArray(history) && history.length >= 60)
      .map(([symbol]) => symbol));

    const queue = ordered.filter(symbol => !completeCached.has(symbol));''',
r'''    const freshnessChecks=Object.entries(cached)
      .filter(([symbol])=>targetSet.has(symbol))
      .map(([symbol,history])=>[symbol,validateHistoryFreshness(history,marketDate,{allowTargetDateBar:true})]);
    const completeCached=new Set(freshnessChecks.filter(([,result])=>result.usable).map(([symbol])=>symbol));
    const freshnessRejected=freshnessChecks.filter(([,result])=>!result.usable);

    const queue = ordered.filter(symbol => !completeCached.has(symbol));''',
    "history seed cache classification",
)

replace_once(
    '      insufficientSymbols: [],\n      seedSchema: HISTORY_SEED_SCHEMA,',
    '      insufficientSymbols: [],\n'
    '      historyFreshnessRejectedCount:freshnessRejected.length,\n'
    '      historyFreshnessRejectedSamples:freshnessRejected.slice(0,50).map(([symbol,result])=>({symbol,reason:result.reason,status:result.status,latestPriorDate:result.latestPriorDate||null,expectedPriorDate:result.expectedPriorDate||null})),\n'
    '      seedSchema: HISTORY_SEED_SCHEMA,',
    "history seed freshness evidence",
)

replace_once(
r'''      // >=60 日才算真正完成 60 日技術底庫。
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
r'''      // 60根只是必要條件；還要證明相對 target marketDate 的前一交易日與最近60個官方交易日連續。
      if (item.bars.length >= 60) {
        const freshness=validateHistoryFreshness(item.bars,marketDate,{allowTargetDateBar:true});
        if(freshness.usable) {
          history[item.symbol] = item.bars.slice(-MARKET_STATE_DAYS);
          complete += 1;
          continue;
        }
      }

      // 新上市、停牌缺口或無法證明連續性的資料維持 DATA_INCOMPLETE/UNKNOWN，不進 Formal feature。
      // 有20日以上仍保留到D1供未來重抓/診斷；不把缺口冒充完整60日。
      if (item.bars.length >= 20) history[item.symbol] = item.bars.slice(-MARKET_STATE_DAYS);
      insufficient += 1;
      insufficientSymbols.push(item.symbol);''',
    "freshly fetched history validation",
)

path.write_text(text, encoding="utf-8")
print("Applied V8.10.1 history freshness / continuity guard")
