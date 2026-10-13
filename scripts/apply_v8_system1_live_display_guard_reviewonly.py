"""Review-only post-build runtime overlay; NEVER invoked by production workflow.
Apply after V8.20.2 generation in an isolated CI check, with no Cloudflare IO.
"""
from pathlib import Path
worker = Path("Worker.js")
text = worker.read_text(encoding="utf-8")
def once(old,new,label):
    global text
    n=text.count(old)
    if n != 1:
        raise RuntimeError("S1_REVIEW_PATCH_ANCHOR_MISMATCH:"+label+":"+str(n))
    text=text.replace(old,new,1)

helper=Path("system1/runtime/live_snapshot_read_model_v0_1.mjs").read_text(encoding="utf-8")
once("function snapshotAgeSeconds(snapshot) {",
     helper.replace("export function reconcileDisplaySnapshotsV0_1(", "function reconcileDisplaySnapshotsV0_1(")+"\nfunction snapshotAgeSeconds(snapshot) {",
     "model_injection")

age_func='''function snapshotAgeSeconds(snapshot) {
  const ms = Date.parse(snapshot?.generatedAtIso || "");
  return Number.isFinite(ms) ? Math.max(0, Math.floor((Date.now() - ms) / 1000)) : null;
}'''
display_func='''
// Admin diagnostic SELECT-only D1 read, avoids ensureD1Schema DDL on GET.
async function auditPrimarySnapshotReadOnly(env) {
  if (!env?.V7_DB) return null;
  const row = await env.V7_DB.withSession("first-primary")
    .prepare("SELECT snapshot FROM v7_live_state WHERE id = 1").first();
  return row?.snapshot ? JSON.parse(row.snapshot) : null;
}
// Read model ONLY. Background signal/capital/plan paths still use original D1.
async function readDisplayLiveState(env, stocks) {
  const primary = await readLiveSnapshot(env);
  const nowMs = Date.now(), tradeDate = taiwanDate(nowMs);
  const intraday = isTradingDate(tradeDate) && isIntradayMonitorWindow(nowMs);
  const old = intraday && (snapshotAgeSeconds(primary) === null ||
    snapshotAgeSeconds(primary) > LIVE_STALE_SECONDS);
  const probe = !primary || primary.tradeDate !== tradeDate || old;
  const kv = probe && env.STOCKS_KV ? await env.STOCKS_KV.get(LAST_MONITOR_KEY,"json") : null;
  return reconcileDisplaySnapshotsV0_1({
    d1:primary, kv, planned:stocks, tradeDate, intraday, nowMs,
    staleSeconds:LIVE_STALE_SECONDS
  });
}
'''
once(age_func, age_func+display_func, "display_reader")

api_old='''      const snapshot = await readLiveSnapshot(env);
      const fallback = !snapshot && env.STOCKS_KV
        ? await env.STOCKS_KV.get(LAST_MONITOR_KEY, "json")
        : null;
      return json(snapshot || fallback || { status: "尚未產生盤中即時狀態" }, 200, true);'''
api_new='''      const current = await loadStockConfig(env);
      const display = await readDisplayLiveState(env,current.stocks);
      return json({
        ...(display.snapshot || { status: "尚未產生盤中即時狀態" }),
        displaySource:display.source, displayDegraded:display.degraded,
        displayPopulationMatches:display.populationMatches,
        displaySnapshotFresh:display.liveFresh,
        displayAgeSeconds:display.selectedAgeSeconds,
        d1PersistenceUnverified:display.d1PersistenceUnverified
      },200,true);'''
once(api_old,api_new,"readonly_live_api")
# Protected source audit: reads original D1/KV snapshots separately with no mutations.
audit_route='''    if (url.pathname === "/api/live/sources") {
      if (!isAuthorized(request, env)) return json({ error: "ADMIN_TOKEN 錯誤" }, 401, true);
      const config = await loadStockConfig(env);
      const [d1, kv] = await Promise.all([
        auditPrimarySnapshotReadOnly(env),
        env.STOCKS_KV ? env.STOCKS_KV.get(LAST_MONITOR_KEY, "json") : Promise.resolve(null)
      ]);
      const nowMs = Date.now(), tradeDate = taiwanDate(nowMs);
      const audited = reconcileDisplaySnapshotsV0_1({
        d1, kv, planned:config.stocks, tradeDate,
        intraday:isTradingDate(tradeDate) && isIntradayMonitorWindow(nowMs),
        nowMs, staleSeconds:LIVE_STALE_SECONDS
      });
      const projection = x => x ? {
        generatedAtIso:x.generatedAtIso||null, tradeDate:x.tradeDate||null,
        monitoredCount:x.monitoredCount??null,
        symbols:Array.isArray(x.results)?x.results.map(y=>String(y.symbol||"")):[],
        liveStoreRecorded:x.liveStoreResult?.stored??null
      }:null;
      return json({
        schema:"SYSTEM1_V8_LIVE_SOURCES_READONLY_V0_1",
        observedAt:new Date(nowMs).toISOString(),tradeDate,
        configSymbols:config.stocks.map(x=>String(x.symbol)),
        d1:projection(d1),kv:projection(kv),
        d1AgeSeconds:audited.d1AgeSeconds,kvAgeSeconds:audited.kvAgeSeconds,
        d1PopulationMatches:audited.d1PopulationMatches,
        kvPopulationMatches:audited.kvPopulationMatches,
        preferredSource:audited.source,
        noWrite:true,noPlanChanges:true,noPush:true,noTrade:true
      },200,true);
    }

'''
once('    if (url.pathname === "/api/live") {',
     audit_route + '    if (url.pathname === "/api/live") {',
     "protected_live_source_audit")


home_old='''    const [live, cronStatus] = await Promise.all([
      readLiveSnapshot(env),
      readLatestCronRun(env)
    ]);
    const fallback = !live && env.STOCKS_KV
      ? await env.STOCKS_KV.get(LAST_MONITOR_KEY, "json")
      : null;
    const liveState = live || fallback || null;'''
home_new='''    const [display, cronStatus] = await Promise.all([
      readDisplayLiveState(env,stocks),
      readLatestCronRun(env)
    ]);
    const liveState = display.snapshot || null;
    const usingD1 = display.source === "D1_PRIMARY";'''
once(home_old,home_new,"homepage_read")
once('''    const currentPlanBySymbol = new Map(stocks.map(stock => [String(stock.symbol), stock]));''',
'''    // Wrong monitored population is NOT a valid trade display, even when
    // the quote timestamp is recent. Original data remains read-only /api/live.
    if (!display.populationMatches && url.searchParams.get("format") !== "json") {
      const message = "監控資料與正式設定股票名單不一致，暫停展示行情與操作訊號；請查驗 Cron / D1 / KV。";
      return html(errorPage(message), 200, true);
    }
    const currentPlanBySymbol = new Map(stocks.map(stock => [String(stock.symbol), stock]));''',
"reject_mismatched_live_cards")

once('liveStore: live ? "D1 primary" : (fallback ? "KV fallback" : "none"),',
     'liveStore: display.source,',"json_display_source")
once('waitingLivePage(loaded, liveState, Boolean(env.V7_DB), cronStatus)',
     'waitingLivePage(loaded, liveState, usingD1, cronStatus)',"waiting_display_source")
once('renderPage(results, loaded, isTestMode(env), liveState, Boolean(live), cronStatus)',
     'renderPage(results, loaded, isTestMode(env), liveState, usingD1, cronStatus)',"page_display_source")

write_old='''  const liveStore = await writeLiveSnapshot(env, snapshot);
  const kvSummary = { ...snapshot, liveStoreResult: liveStore };
  await env.STOCKS_KV.put(
    LAST_MONITOR_KEY,
    JSON.stringify(kvSummary),
    { expirationTtl: 2 * 24 * 60 * 60 }
  );'''
write_new='''  const liveStore = await writeLiveSnapshot(env, snapshot);
  const kvSummary = { ...snapshot, liveStoreResult: liveStore };
  await env.STOCKS_KV.put(
    LAST_MONITOR_KEY,
    JSON.stringify(kvSummary),
    { expirationTtl: 2 * 24 * 60 * 60 }
  );
  // KV mirroring is not evidence that D1 primary persistence succeeded.
  if (env.V7_DB && liveStore.stored !== true)
    throw new Error("LIVE_D1_PERSISTENCE_NOT_VERIFIED");'''
once(write_old,write_new,"d1_ack_required")
# The display's 90-second stale warning is an intraday-only condition.
# Outside market hours keep the final timestamp visible without asking the
# quote to keep updating after close. Never suppress intraday stale warnings.
age_offhours='''function snapshotAgeSeconds(snapshot) {
  if (!isTradingDate(taiwanDate()) || !isIntradayMonitorWindow(Date.now()))
    return null;
  const ms = Date.parse(snapshot?.generatedAtIso || "");
  return Number.isFinite(ms) ? Math.max(0, Math.floor((Date.now() - ms) / 1000)) : null;
}'''
once(age_func,age_offhours,"afterclose_intraday_warning_only")
worker.write_text(text,encoding="utf-8")
print("SYSTEM1_V8_LIVE_RUNTIME_REVIEW_PATCH_APPLIED")
