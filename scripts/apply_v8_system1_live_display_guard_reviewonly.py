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
