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
    'const VERSION = "7.5.29-full-plan-pending-card";',
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

replace_once(
'''function renderCard(r) {
  if (!r.ok) {
    return `
<div class="card status-c">

<div class="title">
${h(r.name)}
${h(r.symbol)}
</div>

<div class="error">
${h(r.error)}
</div>

</div>
`;
  }

  const p =
    r.plan;''',
'''function renderCard(r) {
  if (!r.ok) {
    // 7.5.29：pending / expired 只鎖即時判斷，不隱藏完整交易計畫。
    const p = r.plan || {};
    const expired = String(r.error || "").includes("已過期");
    return `
<div class="card status-c">

<div class="title">
${h(r.name)}
${h(r.symbol)}
</div>

<div>
<span class="badge">${expired ? "計畫已過期" : "等待今日即時資料"}</span>
<span class="badge">通道 ${h(p.channel || "-")}</span>
<span class="badge">訊號 ${h(p.signalLevel || "-")}</span>
</div>

<div class="mode">
操作模式：${modeText(p.mode)}
</div>

<div class="plan">
<b>交易計畫定位</b>
<br>
拉回：${fmt(p.buyLow)}～${fmt(p.buyHigh)}
<br>
突破：${fmt(p.breakout)}｜最大追價：${fmt(p.maxChase)}
<br>
停損：${fmt(p.stop)}｜第一停利：${fmt(p.profitCheck)}
<hr>
建議總投入：${fmt(p.totalAllocation)}｜配置比例：${fmt(p.allocationRatio)}${p.allocationRatio !== null && p.allocationRatio !== undefined ? "%" : ""}
<br>
第一筆：${fmt(p.firstAmount)} 元／約 ${fmt(p.firstShares)} 股
｜第二筆：${fmt(p.secondAmount)} 元／約 ${fmt(p.secondShares)} 股
<br>
總部位：約 ${fmt(p.totalShares)} 股
<br>
第一筆條件：${h(p.firstCondition || "-")}
<br>
第二筆條件：${h(p.secondCondition || "-")}
<br>
優先分數：${fmt(p.priorityScore)}｜RR：${fmt(p.rewardRisk)}｜產業資金：${fmt(p.sectorFlow)}｜RS：${fmt(p.relativeStrength)}
<br>
入選理由：${h(p.selectedReason || "-")}
<br>
持倉階段：${h(positionStageText(p.positionStage))}
｜持倉均價：${fmt(p.averageCost)}
｜實際持股：${p.actualShares===null || p.actualShares===undefined ? "尚未回填" : `${fmt(p.actualShares)}股`}
<br>
減碼檢查價：${fmt(p.reduceAt)}｜正式賣出價：${fmt(p.sellBelow)}
</div>

<div class="warning">
<b>即時判斷已鎖定：</b>${h(r.error || "等待今日資料")}
<br>
完整交易計畫僅供今日定位參考；在當日 Quote / 10分K / 15分K 更新前，不顯示 BUY、ADD 或其他即時執行判斷。
</div>

</div>
`;
  }

  const p =
    r.plan;''',
    "full plan pending card",
)

path.write_text(text, encoding="utf-8")
print("Applied V7.5.29 guarded repair")
