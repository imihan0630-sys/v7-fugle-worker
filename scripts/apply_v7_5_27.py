from pathlib import Path

path = Path("Worker.js")
text = path.read_text(encoding="utf-8")


def replace_once(old: str, new: str, label: str) -> None:
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly 1 match, found {count}")
    text = text.replace(old, new, 1)


replace_once(
    'const VERSION = "7.5.26-q1-statement-column-validation";',
    'const VERSION = "7.5.28-stale-live-guard";',
    "version",
)

replace_once(
    '{ redirect: "manual", headers: { accept: "application/json", "user-agent": "Mozilla/5.0 V7-Market-Scan" } },',
    '{ redirect: "follow", headers: { accept: "application/json", "user-agent": "Mozilla/5.0 V7-Market-Scan" } },',
    "market redirect",
)

replace_once(
'''  if (needsRebuild) {
    const [twseRows, tpexRows] = await Promise.all([
      fetchMarketRows(env.TWSE_DAILY_URL || TWSE_DAILY_URL, "TWSE"),
      fetchMarketRows(env.TPEX_DAILY_URL || TPEX_DAILY_URL, "TPEx")
    ]);
    const marketRows = [...twseRows, ...tpexRows].filter(row => row && row.close >= MIN_CLOSE_PRICE);''',
'''  if (needsRebuild) {
    // 7.5.27：歷史暖機與18:10盤後掃描共用同一套官方行情 fallback。
    // 任一市場暫時失敗時保留既有 D1 歷史，不用不完整市場重建 queue；
    // 17:00-17:59 每分鐘排程會在下一輪自動重試，不再把整條 Cron 打成 FAILED。
    const marketResults = await Promise.allSettled([
      fetchClosingRowsWithFallback(env, "TWSE", marketDate),
      fetchClosingRowsWithFallback(env, "TPEx", marketDate)
    ]);
    const sourceErrors = marketResults
      .map((result, index) => result.status === "rejected"
        ? { market: index === 0 ? "TWSE" : "TPEx", error: String(result.reason) }
        : null)
      .filter(Boolean);
    if (sourceErrors.length) {
      return {
        version: VERSION,
        generatedAt: taiwanTime(),
        marketDate,
        skipped: true,
        status: "盤後市場資料暫不可用，保留既有歷史快取並等待下一輪暖機",
        queueRebuilt: false,
        institutionSeed,
        sourceErrors,
        officialCalls: institutionSeed.calls || 0,
        fugleCalls: 0
      };
    }
    const twseRows = marketResults[0].value;
    const tpexRows = marketResults[1].value;
    const marketRows = [...twseRows, ...tpexRows].filter(row => row && row.close >= MIN_CLOSE_PRICE);''',
    "history warmup fallback",
)

replace_once(
'''    const results = Array.isArray(liveState?.results)
      ? liveState.results
          .filter(item => currentPlanBySymbol.has(String(item.symbol)))
          .map(item => ({ ...item, plan: currentPlanBySymbol.get(String(item.symbol)) || item.plan }))
      : [];''',
'''    // 7.5.28：舊交易日的 D1 快照絕不能顯示成今日可執行訊號。
    // 只有 D1 tradeDate 等於台灣今天，才把 live result 當作有效即時卡片；
    // 其餘設定改顯示 pending / expired，避免昨日的「立即處理」誤導今日操作。
    const currentTradeDate = taiwanDate();
    const liveTradeDate = String(liveState?.tradeDate || "");
    const liveIsCurrent = liveTradeDate === currentTradeDate;
    const liveResults = liveIsCurrent && Array.isArray(liveState?.results)
      ? liveState.results
          .filter(item => currentPlanBySymbol.has(String(item.symbol)))
          .map(item => ({ ...item, plan: currentPlanBySymbol.get(String(item.symbol)) || item.plan }))
      : [];
    const liveSymbols = new Set(liveResults.map(item => String(item.symbol)));
    const pendingResults = stocks
      .filter(stock => !liveSymbols.has(String(stock.symbol)))
      .map(stock => {
        const planDate = String(stock?.planDate || "");
        const expired = /^\\d{4}-\\d{2}-\\d{2}$/.test(planDate) && planDate < currentTradeDate;
        const error = expired
          ? `交易計畫日期 ${planDate} 已過期，不可依舊訊號執行`
          : liveIsCurrent
            ? "已匯入監控設定，等待下一輪盤中即時資料更新"
            : `即時資料仍為 ${liveTradeDate || "舊交易日"}，等待 ${currentTradeDate} 新一輪盤中更新`;
        return { ok: false, symbol: stock.symbol, name: stock.name, plan: stock, error };
      });
    const results = [...liveResults, ...pendingResults];''',
    "pending configured stocks with stale-day guard",
)

path.write_text(text, encoding="utf-8")
print("Applied V7.5.28 guarded repair")
