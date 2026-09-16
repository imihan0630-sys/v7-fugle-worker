/**
 * 台股半自動交易決策監控 V7｜Phase 4
 * 基準：V6 Worker + 韓哥確認的29項V7定稿需求 + 收盤價低於10元剔除。
 * Phase 1：0～6檔、V6資料相容、完整交易計畫、資金股數、監控狀態、動態排序。
 * Phase 2：Cloudflare背景監控、六類操作訊號、手機推播資料、狀態解除後重啟的去重機制。
 * Phase 3：TWSE＋TPEx盤後全市場、0～6檔、資金計畫、自動送入與每日回報。
 * Phase 4.3：A＝拉回承接、B＝突破後承接；18:10自動選0～6檔並寫入隔日監控計畫。
 * 免費版 Fugle 60次/分鐘安全架構：盤中每分鐘只抓 Quote；10/15分K僅在收棒後更新。
 * 即時狀態寫入 Cloudflare D1 primary；監控網頁只讀 D1，不再直接呼叫 Fugle。
 * 7.5.6：盤中訊號狀態修正：未持倉不發停損賣出、同交易日同階段訊號只推一次、系統測試訊息不再顯示空白欄位。
 */
// Cron expression: * 1-4 * * MON-FRI   // 台灣 09:00-12:59 每分鐘
// Cron expression: 0-24 5 * * MON-FRI // 台灣 13:00-13:24 每分鐘
// Cron expression: * 9 * * MON-FRI     // 台灣 17:00-17:59 每分鐘建立歷史日K快取＋逐日法人快照
// Cron expression: 10 10 * * MON-FRI  // 台灣 18:10 盤後掃描
const VERSION = "7.5.11-incremental-repair";
const TEST_MODE_DEFAULT = true;
const KV_KEY = "STOCK_CONFIG_V7";
const LEGACY_KV_KEY = "STOCK_CONFIG_V6";
const MAX_STOCKS = 6;
const MAX_STOCKS_PER_POOL = 3; // 千金股最多3檔、非千金股最多3檔；名額不得跨池挪用
const DEFAULT_TOTAL_CAPITAL = 200000; // 韓哥固定預設資金
const MAX_SINGLE_POSITION_RATIO = 0.35; // 單一標的最多使用總資金35%
const SIGNAL_STATE_PREFIX = "V7_SIGNAL_STATE:";
const LAST_MONITOR_KEY = "V7_LAST_MONITOR_RUN";
const SIGNAL_STATE_TTL_SECONDS = 7 * 24 * 60 * 60;
const MARKET_STATE_KEY = "V7_MARKET_STATE";
const LAST_SCAN_KEY = "V7_LAST_AFTER_MARKET_SCAN";
const LAST_FINALIZE_KEY = "V7_LAST_FINALIZE_CHECK";
const MARKET_STATE_DAYS = 65;
const TWSE_DAILY_URL = "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL";
const TPEX_DAILY_URL = "https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes";
const MIN_CLOSE_PRICE = 10;
const MIN_REWARD_RISK = 2;
const THOUSAND_STOCK_PRICE = 1000;
const SIGNAL_GRADE_A_MIN = 80;
const SIGNAL_GRADE_B_MIN = 65;
const LIVE_STALE_SECONDS = 90;
const HISTORY_WARMUP_LIMIT = 6;
const HISTORY_CACHE_TARGET = 2000;
const HISTORY_SEED_SCHEMA = "full-market-v2";
const HISTORY_LOOKBACK_CALENDAR_DAYS = 120;
const INSTITUTION_SNAPSHOT_LOOKBACK_WEEKDAYS = 5;
const INSTITUTION_STREAK_MAX_DAYS = 3;
const INSTITUTION_SNAPSHOT_MIN_STOCKS = 1500; // 防止只抓到單一市場卻被誤判為完整交易日
let D1_SCHEMA_READY = false;
// TWSE 115年正式開休市表；「開始/最後交易日」不是休市日。
const MARKET_CALENDARS = new Map([[2026, new Set([
  "2026-01-01", "2026-02-12", "2026-02-13", "2026-02-15", "2026-02-16", "2026-02-17",
  "2026-02-18", "2026-02-19", "2026-02-20", "2026-02-27", "2026-02-28",
  "2026-04-03", "2026-04-04", "2026-04-05", "2026-04-06", "2026-05-01", "2026-06-19",
  "2026-09-25", "2026-09-28", "2026-10-09", "2026-10-10", "2026-10-25", "2026-10-26", "2026-12-25"
])]]);

async function loadTradingCalendar(env, year) {
  if (MARKET_CALENDARS.has(year)) return;
  const key = `V7_TRADING_CALENDAR:${year}`;
  const cached = await env.STOCKS_KV?.get(key, "json");
  if (cached?.year === year && Array.isArray(cached.holidays)) { MARKET_CALENDARS.set(year, new Set(cached.holidays)); return; }
  const payload = await fetchJsonWithRetry(`https://www.twse.com.tw/rwd/zh/holidaySchedule/holidaySchedule?response=json&queryYear=${year}`, {redirect:"manual"}, "TWSE交易日曆", 2);
  if (Number(payload.queryYear) !== year || !Array.isArray(payload.data) || !payload.data.length) throw new Error(`${year}年官方交易日曆尚不可用，不能猜測交易日`);
  const holidays = payload.data.filter(row => !String(row[1]).includes("交易日")).map(row => row[0]);
  MARKET_CALENDARS.set(year, new Set(holidays));
  await env.STOCKS_KV?.put(key, JSON.stringify({year, holidays}), {expirationTtl:366 * 86400});
}

function isTradingDate(dateString) {
  const year = Number(dateString.slice(0, 4));
  if (!MARKET_CALENDARS.has(year)) throw new Error(`${year}年交易日曆尚未載入`);
  return ![0, 6].includes(new Date(dateString + "T12:00:00Z").getUTCDay()) && !MARKET_CALENDARS.get(year).has(dateString);
}

function sleepMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchWithDeadline(url, options = {}, milliseconds = 15000) {
  // signal保留到回覆本文讀完；避免官方資料、Webhook或3Min一直等待。
  return fetch(url, {...options, signal: options.signal || AbortSignal.timeout(milliseconds)});
}

function isTransientNetworkError(err) {
  const text = String(err || "");
  return /Network connection lost|fetch failed|connection reset|connection closed|ECONNRESET|ETIMEDOUT|timeout|temporarily unavailable|daemonDown|HTTP\s+(408|425|429|500|502|503|504|520|521|522|523|524|525|526|530)/i.test(text);
}

async function retryTransient(label, fn, attempts = 3) {
  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastError = err;
      if (!isTransientNetworkError(err) || attempt >= attempts) {
        throw new Error(`${label}：${String(err)}`);
      }
      await sleepMs(Math.min(4000, 500 * (2 ** (attempt - 1))));
    }
  }
  throw new Error(`${label}：${String(lastError || "未知網路錯誤")}`);
}

async function fetchJsonWithRetry(url, options, label, attempts = 3) {
  return retryTransient(label, async () => {
    const response = await fetchWithDeadline(url, options);
    if (!response.ok) {
      const preview = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status}${preview ? `：${preview.slice(0, 160)}` : ""}`);
    }
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (_) {
      throw new Error(`回傳不是JSON：${text.slice(0, 120)}`);
    }
  }, attempts);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/version") return json({ version: VERSION, testMode: isTestMode(env),
      bindings: { kv: !!env.STOCKS_KV, d1: !!env.V7_DB },
      readiness: { quote: !!env.FUGLE_API_KEY, phonePush: !!env.PUSH_WEBHOOK_URL, threeMin: !!env.THREEMIN_API_URL,
        threeMinReadback: !!env.THREEMIN_VERIFY_URL }, requirements30Complete: false, monitorUrl: url.origin }, 200, true);

    // 第21條：只重算未建倉交易計畫；不執行下單、不更動實際持股。
    if (url.pathname === "/api/capital") {
      if (!isAuthorized(request, env)) return json({ error: "ADMIN_TOKEN 錯誤" }, 401, true);
      if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, true);
      try {
        const body = await request.json();
        const stored = await env.STOCKS_KV.get(KV_KEY, "json");
        if (!stored || !Array.isArray(stored.stocks)) throw new Error("請先匯入有效交易計畫");
        const capital = positiveNumber(body.totalCapital);
        const recalculated = recalculatePlanCapital(validateStocks(stored.stocks), capital);
        if (body.preview === true) return json({ ok: true, preview: true, ...recalculated }, 200, true);
        const saved = await saveStockConfig(env, recalculated.stocks, "Capital Recalculation", capital);
        return json({ ...saved, remainingCash: recalculated.remainingCash, monitorUrl: url.origin }, 200, true);
      } catch (err) { return json({ error: String(err) }, 400, true); }
    }

    // ==================================================
    // 今日標的一鍵匯入頁
    // ==================================================
    if (url.pathname === "/admin") {
      return html(adminPage(), 200, true);
    }

    // ==================================================
    // 讀取 / 儲存設定 API
    // ==================================================
    if (url.pathname === "/api/config") {
      if (!isAuthorized(request, env)) {
        return json(
          { error: "ADMIN_TOKEN 錯誤" },
          401,
          true
        );
      }

      if (request.method === "GET") {
        const loaded = await loadStockConfig(env);

        return json(
          loaded,
          200,
          true
        );
      }

      if (request.method === "POST") {
        try {
          const body = await request.json();

          const input = extractStocks(body);

          const stocks =
            validateStocks(input);

          const saved =
            await saveStockConfig(
              env,
              stocks,
              "Web Import"
            );

          return json(
            saved,
            200,
            true
          );

        } catch (err) {
          return json(
            { error: String(err) },
            400,
            true
          );
        }
      }

      return json(
        { error: "Method not allowed" },
        405,
        true
      );
    }

    // ==================================================
    // 預留給未來 ChatGPT / Work / API橋接
    // 自動寫入今日標的
    //
    // POST /api/push
    // Header:
    // x-push-token: PUSH_TOKEN
    // ==================================================
    if (url.pathname === "/api/push") {
      if (!isPushAuthorized(request, env)) {
        return json(
          { error: "未授權" },
          401,
          true
        );
      }

      if (request.method !== "POST") {
        return json(
          { error: "只接受 POST" },
          405,
          true
        );
      }

      try {
        const body = await request.json();
const input = extractStocks(body);

const stocks =
  validateStocks(input);

        const saved =
          await saveStockConfig(
            env,
            stocks,
            "API Push"
          );

        return json(
          saved,
          200,
          true
        );

      } catch (err) {
        return json(
          { error: String(err) },
          400,
          true
        );
      }
    }

    // ==================================================
    // Phase 4.5.2：Slack Incoming Webhook 實際送達測試
    // 僅 TEST_MODE=true 可用；需 ADMIN_TOKEN。
    // POST /api/slack-test
    // 不改股票設定、不寫 D1、不產生交易訊號。
    // ==================================================
    if (url.pathname === "/api/slack-test") {
      if (!isTestMode(env)) {
        return json({ error: "TEST_MODE=false，Slack 測試端點已停用" }, 403, true);
      }
      if (!isAuthorized(request, env)) {
        return json({ error: "未授權" }, 401, true);
      }
      if (request.method !== "POST") {
        return json({ error: "只接受 POST" }, 405, true);
      }

      const payload = {
        type: "SYSTEM_TEST",
        title: "V7 Slack 推播鏈路測試",
        symbol: "V7",
        name: "Slack推播鏈路",
        message: "V7 Worker → Slack 實際推播測試成功",
        generatedAt: taiwanTime()
      };

      const result = await sendPushDirect(payload, env);

      return json({
        ok: result.sent === true,
        version: VERSION,
        generatedAt: taiwanTime(),
        testMode: true,
        purpose: "驗證 Worker → Slack Incoming Webhook 真實送達",
        result
      }, result.sent ? 200 : 502, true);
    }

    // ==================================================
    // Phase 4.2 驗收：官方資料來源連線與欄位檢查
    // GET /api/official-data-test?twse=2330&tpex=8299&date=20260911
    // 不寫 D1、不寫 KV、不推播、不改交易設定
    // ==================================================
    if (url.pathname === "/api/official-data-test") {
      if (!isTestMode(env)) {
        return json({ error: "TEST_MODE=false，測試端點已停用" }, 403, true);
      }
      if (request.method !== "GET") {
        return json({ error: "只接受 GET" }, 405, true);
      }
      try {
        const twseSymbol = String(url.searchParams.get("twse") || "2330").trim();
        const tpexSymbol = String(url.searchParams.get("tpex") || "8299").trim();
        const date = String(url.searchParams.get("date") || taiwanDate(Date.now() - 24 * 60 * 60 * 1000)).replaceAll("-", "");
        return json(await runOfficialDataTest(twseSymbol, tpexSymbol, date), 200, true);
      } catch (err) {
        return json({ ok: false, error: String(err) }, 500, true);
      }
    }

    // ==================================================
    // Phase 4.2 驗收：單純測 Fugle Quote
    // 不寫 D1、不產生訊號、不推播
    // GET /api/fugle-quote-test?symbol=2330
    // ==================================================
    if (url.pathname === "/api/fugle-quote-test") {
      if (!isTestMode(env)) {
        return json({ error: "TEST_MODE=false，測試端點已停用" }, 403, true);
      }
      const symbol = String(url.searchParams.get("symbol") || "2330").trim();
      if (!/^[1-9][0-9]{3}$/.test(symbol)) {
        return json({ error: "股票代號格式錯誤" }, 400, true);
      }
      try {
        const quote = await fetchQuote(symbol, env);
        return json({
          version: VERSION,
          ok: true,
          symbol,
          fetchedAt: taiwanTime(),
          price: quotePrice(quote),
          fugleCalls: 1,
          quote
        }, 200, true);
      } catch (err) {
        return json({ ok: false, symbol, error: String(err) }, 500, true);
      }
    }

    // ==================================================
    // Phase 4.2 驗收：測試 10分K + 15分K
    // 不寫 D1、不產生訊號、不推播
    // GET /api/fugle-k-test?symbol=2330
    // ==================================================
    if (url.pathname === "/api/fugle-k-test") {
      if (!isTestMode(env)) {
        return json({ error: "TEST_MODE=false，測試端點已停用" }, 403, true);
      }
      const symbol = String(url.searchParams.get("symbol") || "2330").trim();
      if (!/^[1-9][0-9]{3}$/.test(symbol)) {
        return json({ error: "股票代號格式錯誤" }, 400, true);
      }
      try {
        const [k10, k15] = await Promise.all([
          fetchCandles(symbol, 10, env),
          fetchCandles(symbol, 15, env)
        ]);
        return json({
          version: VERSION,
          ok: true,
          symbol,
          fetchedAt: taiwanTime(),
          fugleCalls: 2,
          k10,
          k15
        }, 200, true);
      } catch (err) {
        return json({ ok: false, symbol, error: String(err) }, 500, true);
      }
    }

    // ==================================================
    // Phase 4.2 驗收用：僅 TEST_MODE=true 時可手動執行
    // GET /api/monitor-test
    // ==================================================
    if (url.pathname === "/api/monitor-test") {
      if (!isTestMode(env)) {
        return json({ error: "TEST_MODE=false，測試端點已停用" }, 403, true);
      }
      if (request.method !== "GET") {
        return json({ error: "只接受 GET" }, 405, true);
      }
      try {
        return json(await runBackgroundMonitor(env, Date.now()), 200, true);
      } catch (err) {
        return json({ error: String(err) }, 500, true);
      }
    }

    // ==================================================
    // 手動執行一次背景監控（測試與驗收用）
    // POST /api/monitor，Header: x-push-token
    // ==================================================
    if (url.pathname === "/api/monitor") {
      if (!isPushAuthorized(request, env)) {
        return json({ error: "未授權" }, 401, true);
      }

      if (request.method !== "POST") {
        return json({ error: "只接受 POST" }, 405, true);
      }

      try {
        return json(await runBackgroundMonitor(env, Date.now(), true), 200, true);
      } catch (err) {
        return json({ error: String(err) }, 500, true);
      }
    }

    // 最近一次背景監控結果
    if (url.pathname === "/api/signals") {
      if (!isAuthorized(request, env)) {
        return json({ error: "ADMIN_TOKEN 錯誤" }, 401, true);
      }

      const latest = env.STOCKS_KV
        ? await env.STOCKS_KV.get(LAST_MONITOR_KEY, "json")
        : null;

      return json(latest || { status: "尚未執行背景監控" }, 200, true);
    }

    // ==================================================
    // Phase 4.5 最終上線驗收頁
    // GET /finalize
    // TEST_MODE=true 時可用 ADMIN_TOKEN 執行「真寫入、假推播」驗收：
    // 會真的寫 STOCK_CONFIG_V7、V7_MARKET_STATE、LAST_SCAN，並送 3Min；
    // 手機推播仍因 TEST_MODE=true 而不會真的送出。
    // ==================================================
    if (url.pathname === "/finalize") {
      if (request.method !== "GET") return html("<h1>只接受 GET</h1>", 405, true);
      return html(finalizePage(isTestMode(env)), 200, true);
    }

    if (url.pathname === "/api/finalize") {
      if (!isAuthorized(request, env)) return json({ error: "ADMIN_TOKEN 錯誤" }, 401, true);
      if (!isTestMode(env)) return json({ error: "TEST_MODE=false，最終驗收端點已停用；正式環境請由18:10 Cron執行" }, 403, true);
      if (request.method !== "POST") return json({ error: "只接受 POST" }, 405, true);
      try {
        const scan = await runAfterMarketScan(env, Date.now(), { dryRun: false });
        const loaded = await loadStockConfig(env);
        const expected = (scan.stocks || []).map(item => String(item.symbol));
        const actual = (loaded.stocks || []).map(item => String(item.symbol));
        const configMatched = JSON.stringify(expected) === JSON.stringify(actual);
        const readiness = await buildProductionReadiness(env);
        const verification = {
          configMatched,
          expectedSymbols: expected,
          savedSymbols: actual,
          configCount: actual.length,
          threeMinSent: scan?.threeMin?.sent === true,
          dailyPhonePushSuppressed: scan?.dailyReport?.phonePushSuppressed === true,
          testMode: true,
          productionReady: readiness.productionReady,
          phonePushReady: readiness.phonePushReady,
          sellPushReady: readiness.sellPushReady
        };
        const result = {
          ok: configMatched && scan?.config?.saved === true,
          version: VERSION,
          generatedAt: taiwanTime(),
          status: configMatched ? "正式鏈路驗收完成：已寫入隔日監控設定" : "正式鏈路驗收失敗：寫入後設定不一致",
          verification,
          readiness,
          scan
        };
        if (env.STOCKS_KV) {
          await env.STOCKS_KV.put(LAST_FINALIZE_KEY, JSON.stringify(result), { expirationTtl: 7 * 24 * 60 * 60 });
        }
        return json(result, result.ok ? 200 : 500, true);
      } catch (err) {
        return json({ ok: false, version: VERSION, error: String(err) }, 500, true);
      }
    }

    if (url.pathname === "/api/finalize/status") {
      if (!isAuthorized(request, env)) return json({ error: "ADMIN_TOKEN 錯誤" }, 401, true);
      if (request.method !== "GET") return json({ error: "只接受 GET" }, 405, true);
      const latest = env.STOCKS_KV ? await env.STOCKS_KV.get(LAST_FINALIZE_KEY, "json") : null;
      return json({ version: VERSION, readiness: await buildProductionReadiness(env), latest }, 200, true);
    }

    // ==================================================
    // Phase 4.2 驗收：盤後全市場 dry-run
    // GET /api/scan-test
    // 只讀測試：不寫 KV、不改監控標的、不送3Min、不推播
    // ==================================================
    // Phase 4.2 工具：一鍵歷史暖機頁
    // GET /history-warmup
    // 僅 TEST_MODE=true 可用。頁面每 10 秒依序呼叫 /api/history-seed?limit=6。
    // ==================================================
    if (url.pathname === "/history-warmup") {
      if (!isTestMode(env)) {
        return html("<h1>TEST_MODE=false，一鍵暖機頁已停用</h1>", 403, true);
      }
      if (request.method !== "GET") {
        return html("<h1>只接受 GET</h1>", 405, true);
      }
      return html(historyWarmupPage(), 200, true);
    }

    // ==================================================
    if (url.pathname === "/api/scan-test") {
      if (!isTestMode(env)) {
        return json({ error: "TEST_MODE=false，測試端點已停用" }, 403, true);
      }
      if (request.method !== "GET") {
        return json({ error: "只接受 GET" }, 405, true);
      }
      try {
        return json(await runAfterMarketScan(env, Date.now(), { dryRun: true }), 200, true);
      } catch (err) {
        return json({ ok: false, error: String(err) }, 500, true);
      }
    }

    // ==================================================
    // Phase 4.2 初始化：建立歷史日K快取
    // GET /api/history-seed?limit=6
    // 僅 TEST_MODE=true 可手動使用；只寫 D1 歷史快取，不改交易設定、不推播。
    // ==================================================
    if (url.pathname === "/api/history-seed") {
      if (!isTestMode(env)) {
        return json({ error: "TEST_MODE=false，歷史暖機端點已停用" }, 403, true);
      }
      if (request.method !== "GET") {
        return json({ error: "只接受 GET" }, 405, true);
      }
      try {
        const limit = Math.max(1, Math.min(HISTORY_WARMUP_LIMIT, Number(url.searchParams.get("limit")) || HISTORY_WARMUP_LIMIT));
        return json(await runHistorySeed(env, Date.now(), limit), 200, true);
      } catch (err) {
        return json({ ok: false, error: String(err) }, 500, true);
      }
    }

    // ==================================================
    // Phase 4.2 驗收：逐日建立法人歷史快照
    // GET /api/institution-seed
    // 每次只補 1 個工作日（TWSE + TPEx 共 2 calls），避免 Free Worker CPU 過重。
    // ==================================================
    if (url.pathname === "/api/institution-seed") {
      if (!isTestMode(env)) {
        return json({ error: "TEST_MODE=false，法人暖機端點已停用" }, 403, true);
      }
      if (request.method !== "GET") {
        return json({ error: "只接受 GET" }, 405, true);
      }
      try {
        const marketDate = mostRecentWeekday(taiwanDate(Date.now()));
        return json(await seedInstitutionSnapshotStep(env, marketDate), 200, true);
      } catch (err) {
        return json({ ok: false, error: String(err) }, 500, true);
      }
    }

    // 手動執行盤後全市場掃描（部署驗收／補跑用）
    if (url.pathname === "/api/scan") {
      if (!isPushAuthorized(request, env) && !isAuthorized(request, env)) return json({ error: "未授權" }, 401, true);
      if (request.method !== "POST") return json({ error: "只接受 POST" }, 405, true);
      try {
        return json(await runAfterMarketScan(env, Date.now()), 200, true);
      } catch (err) {
        return json({ error: String(err) }, 500, true);
      }
    }

    // 最近一次盤後選股結果
    if (url.pathname === "/api/scan/status") {
      if (!isAuthorized(request, env)) return json({ error: "ADMIN_TOKEN 錯誤" }, 401, true);
      const latest = env.STOCKS_KV ? await env.STOCKS_KV.get(LAST_SCAN_KEY, "json") : null;
      return json(latest || { status: "尚未執行盤後掃描" }, 200, true);
    }

    // 公開唯讀、去敏感化的最新盤後推薦，供 ChatGPT 18:15 自動回報使用。
    // 不回傳 ADMIN_TOKEN、FUGLE_API_KEY、Webhook、完整 diagnostics 等內部資訊。
    if (url.pathname === "/api/recommendations") {
      if (request.method !== "GET") return json({ error: "只接受 GET" }, 405, true);
      await loadTradingCalendar(env, Number(taiwanDate().slice(0, 4)));
      if (taiwanDate().slice(5) <= "01-07") await loadTradingCalendar(env, Number(taiwanDate().slice(0, 4)) - 1);
      const latest = env.STOCKS_KV ? await env.STOCKS_KV.get(LAST_SCAN_KEY, "json") : null;
      const attempt = env.STOCKS_KV ? await env.STOCKS_KV.get("V7_LAST_SCAN_ATTEMPT", "json") : null;
      return json(buildPublicRecommendations(latest, attempt), latest || attempt ? 200 : 404, true);
    }

    // ==================================================
    // 即時狀態檢查（驗收用）
    // GET /api/live + x-admin-token
    // ==================================================
    if (url.pathname === "/api/live") {
      if (!isAuthorized(request, env)) return json({ error: "ADMIN_TOKEN 錯誤" }, 401, true);
      const snapshot = await readLiveSnapshot(env);
      const fallback = !snapshot && env.STOCKS_KV
        ? await env.STOCKS_KV.get(LAST_MONITOR_KEY, "json")
        : null;
      return json(snapshot || fallback || { status: "尚未產生盤中即時狀態" }, 200, true);
    }

    // ==================================================
    // Cron 實際執行紀錄（驗收用）
    // GET /api/cron/status + x-admin-token
    // ==================================================
    if (url.pathname === "/api/cron/status") {
      if (!isAuthorized(request, env)) return json({ error: "ADMIN_TOKEN 錯誤" }, 401, true);
      const latest = await readLatestCronRun(env);
      const recent = await readRecentCronRuns(env, 20);
      return json({
        version: VERSION,
        latest: latest || null,
        recent,
        expected: [
          "* 1-4 * * MON-FRI",
          "0-24 5 * * MON-FRI",
          "* 9 * * MON-FRI",
          "10 10 * * MON-FRI"
        ]
      }, 200, true);
    }

    // ==================================================
    // 只有首頁
    // ==================================================
    if (url.pathname !== "/") {
      return new Response(
        "Not Found",
        { status: 404 }
      );
    }

    // ==================================================
    // 讀今日候選股
    // ==================================================
    let loaded;

    try {
      loaded =
        await loadStockConfig(env);

    } catch (err) {
      return html(
        errorPage(String(err)),
        500,
        true
      );
    }

    const stocks =
      loaded.stocks;

    // ==================================================
    // 0 檔
    // ==================================================
    if (!stocks.length) {
      return html(emptyPage(loaded), 200, true);
    }

    // ==================================================
    // Phase 4.2：首頁只讀 Live State，不直接呼叫 Fugle
    // D1 primary 優先；尚未綁定時暫以 KV 最近監控結果 fallback。
    // ==================================================
    const [live, cronStatus] = await Promise.all([
      readLiveSnapshot(env),
      readLatestCronRun(env)
    ]);
    const fallback = !live && env.STOCKS_KV
      ? await env.STOCKS_KV.get(LAST_MONITOR_KEY, "json")
      : null;
    const liveState = live || fallback || null;
    const currentPlanBySymbol = new Map(stocks.map(stock => [String(stock.symbol), stock]));
    const results = Array.isArray(liveState?.results)
      ? liveState.results
          .filter(item => currentPlanBySymbol.has(String(item.symbol)))
          .map(item => ({ ...item, plan: currentPlanBySymbol.get(String(item.symbol)) || item.plan }))
      : [];

    if (url.searchParams.get("format") === "json") {
      return json({
        generatedAt: liveState?.generatedAt || null,
        generatedAtIso: liveState?.generatedAtIso || null,
        version: VERSION,
        testMode: isTestMode(env),
        source: loaded.source,
        liveStore: live ? "D1 primary" : (fallback ? "KV fallback" : "none"),
        configUpdatedAt: loaded.updatedAt,
        apiPolicy: "網頁不呼叫Fugle；背景每分鐘Quote；10/15分K只在收棒分鐘更新",
        cron: cronStatus || null,
        stocks: results
      }, 200, true);
    }

    if (!results.length) {
      return html(waitingLivePage(loaded, liveState, Boolean(env.V7_DB), cronStatus), 200, true);
    }

    return html(renderPage(results, loaded, isTestMode(env), liveState, Boolean(live), cronStatus), 200, true);
  },

  async scheduled(controller, env, ctx) {
    ctx.waitUntil(runScheduledWithAudit(controller, env));
  }
};


// ======================================================
// D1 Live State helpers
// Binding 名稱：V7_DB
// 使用 first-primary，強制讀取最新 primary 狀態，避免讀到 replica lag。
// ======================================================
async function ensureD1Schema(env) {
  if (!env?.V7_DB) return false;
  if (D1_SCHEMA_READY) return true;
  await env.V7_DB.prepare(`
    CREATE TABLE IF NOT EXISTS v7_live_state (
      id INTEGER PRIMARY KEY,
      snapshot TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `).run();
  await env.V7_DB.prepare(`
    CREATE TABLE IF NOT EXISTS v7_cron_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cron_expression TEXT,
      scheduled_time INTEGER,
      scheduled_at TEXT,
      started_at TEXT NOT NULL,
      finished_at TEXT,
      job_type TEXT NOT NULL,
      status TEXT NOT NULL,
      skipped INTEGER NOT NULL DEFAULT 0,
      fugle_calls INTEGER,
      detail TEXT,
      error TEXT
    )
  `).run();
  await env.V7_DB.prepare(`
    CREATE TABLE IF NOT EXISTS v7_history_cache (
      symbol TEXT PRIMARY KEY,
      history_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `).run();
  await env.V7_DB.prepare(`
    CREATE TABLE IF NOT EXISTS v7_history_seed_state (
      id INTEGER PRIMARY KEY,
      market_date TEXT NOT NULL,
      queue_json TEXT NOT NULL,
      cursor INTEGER NOT NULL DEFAULT 0,
      total INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    )
  `).run();
  await env.V7_DB.prepare(`
    CREATE TABLE IF NOT EXISTS v7_institution_snapshots (
      market_date TEXT PRIMARY KEY,
      snapshot_json TEXT NOT NULL,
      stock_count INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    )
  `).run();
  D1_SCHEMA_READY = true;
  return true;
}

async function readLiveSnapshot(env) {
  if (!env?.V7_DB) return null;
  try {
    await ensureD1Schema(env);
    const session = env.V7_DB.withSession("first-primary");
    const row = await session
      .prepare("SELECT snapshot FROM v7_live_state WHERE id = 1")
      .first();
    return row?.snapshot ? JSON.parse(row.snapshot) : null;
  } catch (_) {
    return null;
  }
}

async function writeLiveSnapshot(env, snapshot) {
  if (!env?.V7_DB) return { stored: false, reason: "尚未設定 V7_DB D1 Binding" };
  try {
    await ensureD1Schema(env);
    const session = env.V7_DB.withSession("first-primary");
    const result = await session.prepare(`
      INSERT INTO v7_live_state (id, snapshot, updated_at)
      VALUES (1, ?1, ?2)
      ON CONFLICT(id) DO UPDATE SET
        snapshot = excluded.snapshot,
        updated_at = excluded.updated_at
    `).bind(JSON.stringify(snapshot), snapshot?.generatedAtIso || new Date().toISOString()).run();
    return { stored: true, rowsWritten: result?.meta?.rows_written ?? null };
  } catch (err) {
    return { stored: false, error: String(err) };
  }
}

async function writeCronRun(env, run) {
  if (!env?.V7_DB) return { stored: false, reason: "尚未設定 V7_DB D1 Binding" };
  try {
    await ensureD1Schema(env);
    const session = env.V7_DB.withSession("first-primary");
    const result = await session.prepare(`
      INSERT INTO v7_cron_runs (
        cron_expression, scheduled_time, scheduled_at, started_at, finished_at,
        job_type, status, skipped, fugle_calls, detail, error
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
    `).bind(
      run.cronExpression || null,
      Number.isFinite(Number(run.scheduledTime)) ? Number(run.scheduledTime) : null,
      run.scheduledAt || null,
      run.startedAt || new Date().toISOString(),
      run.finishedAt || null,
      run.jobType || "UNKNOWN",
      run.status || "UNKNOWN",
      run.skipped ? 1 : 0,
      Number.isFinite(Number(run.fugleCalls)) ? Number(run.fugleCalls) : null,
      run.detail || null,
      run.error || null
    ).run();
    return { stored: true, id: result?.meta?.last_row_id ?? null };
  } catch (err) {
    return { stored: false, error: String(err) };
  }
}

async function readLatestCronRun(env) {
  if (!env?.V7_DB) return null;
  try {
    await ensureD1Schema(env);
    const session = env.V7_DB.withSession("first-primary");
    const row = await session.prepare(`
      SELECT id, cron_expression, scheduled_time, scheduled_at, started_at, finished_at,
             job_type, status, skipped, fugle_calls, detail, error
      FROM v7_cron_runs
      ORDER BY id DESC
      LIMIT 1
    `).first();
    return row || null;
  } catch (_) {
    return null;
  }
}

async function readRecentCronRuns(env, limit = 20) {
  if (!env?.V7_DB) return [];
  try {
    await ensureD1Schema(env);
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 20));
    const session = env.V7_DB.withSession("first-primary");
    const result = await session.prepare(`
      SELECT id, cron_expression, scheduled_time, scheduled_at, started_at, finished_at,
             job_type, status, skipped, fugle_calls, detail, error
      FROM v7_cron_runs
      ORDER BY id DESC
      LIMIT ?1
    `).bind(safeLimit).all();
    return Array.isArray(result?.results) ? result.results : [];
  } catch (_) {
    return [];
  }
}

async function readHistoryCache(env, limit = 500) {
  if (!env?.V7_DB) return {};
  await ensureD1Schema(env);

  // 7.4.5：全市場約 1,800+ 檔，每檔又有約 65 根日K。
  // 一次 SELECT 全部 history_json 會讓 D1/Worker 單次結果過大；舊版因此在 catch 後變成空物件，
  // 才出現「D1歷史底庫回補不足(0)」。改用 keyset 分頁，每批最多 100 檔。
  const safeLimit = Math.max(1, Math.min(2500, Number(limit) || 500));
  const pageSize = Math.min(100, safeLimit);
  const session = env.V7_DB.withSession("first-primary");
  const output = {};
  let lastSymbol = "";
  let loaded = 0;

  try {
    while (loaded < safeLimit) {
      const take = Math.min(pageSize, safeLimit - loaded);
      const result = await session.prepare(`
        SELECT symbol, history_json
        FROM v7_history_cache
        WHERE symbol > ?1
        ORDER BY symbol ASC
        LIMIT ?2
      `).bind(lastSymbol, take).all();
      const rows = Array.isArray(result?.results) ? result.results : [];
      if (!rows.length) break;

      for (const row of rows) {
        const symbol = String(row?.symbol || "").trim();
        if (!symbol) continue;
        try {
          const history = JSON.parse(row.history_json || "[]");
          if (Array.isArray(history) && history.length) output[symbol] = history;
        } catch (_) {
          // 單一股票 JSON 損壞只略過該檔，不拖垮整個市場。
        }
      }

      loaded += rows.length;
      lastSymbol = String(rows[rows.length - 1]?.symbol || lastSymbol);
      if (rows.length < take) break;
    }
    return output;
  } catch (err) {
    throw new Error(`D1歷史快取分頁讀取失敗（已讀${loaded}檔）：${String(err)}`);
  }
}

async function writeHistoryCache(env, historyMap) {
  if (!env?.V7_DB) return { stored: 0, reason: "尚未設定 V7_DB" };
  const entries = Object.entries(historyMap || {});
  if (!entries.length) return { stored: 0 };
  await ensureD1Schema(env);
  const session = env.V7_DB.withSession("first-primary");
  let stored = 0;
  for (const [symbol, history] of entries) {
    if (!Array.isArray(history) || history.length < 20) continue;
    await session.prepare(`
      INSERT INTO v7_history_cache (symbol, history_json, updated_at)
      VALUES (?1, ?2, ?3)
      ON CONFLICT(symbol) DO UPDATE SET
        history_json = excluded.history_json,
        updated_at = excluded.updated_at
    `).bind(String(symbol), JSON.stringify(history.slice(-MARKET_STATE_DAYS)), new Date().toISOString()).run();
    stored += 1;
  }
  return { stored };
}

async function historyCacheCount(env) {
  if (!env?.V7_DB) return 0;
  try {
    await ensureD1Schema(env);
    const session = env.V7_DB.withSession("first-primary");
    const row = await session.prepare("SELECT COUNT(*) AS count FROM v7_history_cache").first();
    return Number(row?.count || 0);
  } catch (_) {
    return 0;
  }
}

async function readHistorySeedState(env) {
  if (!env?.V7_DB) return null;
  try {
    await ensureD1Schema(env);
    const session = env.V7_DB.withSession("first-primary");
    const row = await session.prepare(`
      SELECT market_date, queue_json, cursor, total, updated_at
      FROM v7_history_seed_state
      WHERE id = 1
    `).first();
    if (!row?.queue_json) return null;
    const parsed = JSON.parse(row.queue_json);
    const queue = Array.isArray(parsed) ? parsed : (Array.isArray(parsed?.queue) ? parsed.queue : null);
    if (!Array.isArray(queue)) return null;
    return {
      marketDate: String(row.market_date || ""),
      queue,
      cursor: Math.max(0, Number(row.cursor || 0)),
      total: Math.max(0, Number(row.total || queue.length)),
      coverageTarget: Array.isArray(parsed) ? null : Number(parsed?.coverageTarget || 0),
      coverageBase: Array.isArray(parsed) ? null : Number(parsed?.coverageBase || 0),
      resolvedCount: Array.isArray(parsed) ? 0 : Number(parsed?.resolvedCount || 0),
      insufficientSymbols: Array.isArray(parsed) ? [] : (Array.isArray(parsed?.insufficientSymbols) ? parsed.insufficientSymbols : []),
      seedSchema: Array.isArray(parsed) ? null : String(parsed?.seedSchema || ""),
      updatedAt: row.updated_at || null
    };
  } catch (_) {
    return null;
  }
}

async function writeHistorySeedState(env, state) {
  if (!env?.V7_DB) return false;
  await ensureD1Schema(env);
  const session = env.V7_DB.withSession("first-primary");
  await session.prepare(`
    INSERT INTO v7_history_seed_state (id, market_date, queue_json, cursor, total, updated_at)
    VALUES (1, ?1, ?2, ?3, ?4, ?5)
    ON CONFLICT(id) DO UPDATE SET
      market_date = excluded.market_date,
      queue_json = excluded.queue_json,
      cursor = excluded.cursor,
      total = excluded.total,
      updated_at = excluded.updated_at
  `).bind(
    String(state.marketDate || ""),
    JSON.stringify({
      queue: state.queue || [],
      coverageTarget: Math.max(0, Number(state.coverageTarget || 0)),
      coverageBase: Math.max(0, Number(state.coverageBase || 0)),
      resolvedCount: Math.max(0, Number(state.resolvedCount || 0)),
      insufficientSymbols: Array.from(new Set(state.insufficientSymbols || [])).slice(0, HISTORY_CACHE_TARGET),
      seedSchema: String(state.seedSchema || HISTORY_SEED_SCHEMA)
    }),
    Math.max(0, Number(state.cursor || 0)),
    Math.max(0, Number(state.total || (state.queue || []).length)),
    new Date().toISOString()
  ).run();
  return true;
}

function recentWeekdays(endDate, count = INSTITUTION_SNAPSHOT_LOOKBACK_WEEKDAYS) {
  const dates = [];
  let current = String(endDate);
  while (dates.length < count) {
    const [y, m, d] = current.split("-").map(Number);
    const dow = new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay();
    if (dow !== 0 && dow !== 6) dates.push(current);
    current = shiftDateString(current, -1);
  }
  return dates;
}

function rocDateString(dateString) {
  const [y, m, d] = String(dateString).split("-").map(Number);
  return `${String(y - 1911).padStart(3, "0")}/${String(m).padStart(2, "0")}/${String(d).padStart(2, "0")}`;
}

async function readInstitutionSnapshotRows(env, endDate, limit = INSTITUTION_SNAPSHOT_LOOKBACK_WEEKDAYS) {
  if (!env?.V7_DB) return [];
  try {
    await ensureD1Schema(env);
    const session = env.V7_DB.withSession("first-primary");
    const result = await session.prepare(`
      SELECT market_date, snapshot_json, stock_count, updated_at
      FROM v7_institution_snapshots
      WHERE market_date <= ?1
      ORDER BY market_date DESC
      LIMIT ?2
    `).bind(String(endDate), Math.max(1, Math.min(10, Number(limit) || INSTITUTION_SNAPSHOT_LOOKBACK_WEEKDAYS))).all();
    return Array.isArray(result?.results) ? result.results : [];
  } catch (_) {
    return [];
  }
}

async function writeInstitutionSnapshot(env, marketDate, stocks) {
  if (!env?.V7_DB) return { stored: false, reason: "尚未設定 V7_DB" };
  await ensureD1Schema(env);
  const clean = {};
  for (const [symbol, item] of Object.entries(stocks || {})) {
    if (!/^[1-9][0-9]{3}$/.test(symbol)) continue;
    clean[symbol] = {
      foreignNet: toNumber(item.foreignNet) || 0,
      trustNet: toNumber(item.trustNet) || 0,
      dealerNet: toNumber(item.dealerNet) || 0,
      institutionTotalNet: toNumber(item.institutionTotalNet) || 0
    };
  }
  const session = env.V7_DB.withSession("first-primary");
  await session.prepare(`
    INSERT INTO v7_institution_snapshots (market_date, snapshot_json, stock_count, updated_at)
    VALUES (?1, ?2, ?3, ?4)
    ON CONFLICT(market_date) DO UPDATE SET
      snapshot_json = excluded.snapshot_json,
      stock_count = excluded.stock_count,
      updated_at = excluded.updated_at
  `).bind(String(marketDate), JSON.stringify(clean), Object.keys(clean).length, new Date().toISOString()).run();
  return { stored: true, stockCount: Object.keys(clean).length };
}

function parseTwseInstitutionPayload(payload) {
  const fields = Array.isArray(payload?.fields) ? payload.fields : [];
  const data = Array.isArray(payload?.data) ? payload.data : [];
  const stocks = {};
  for (const item of data) {
    const row = Object.fromEntries(fields.map((field, i) => [field, item[i]]));
    const symbol = String(pick(row, ["證券代號"]) || "").trim();
    if (!/^[1-9][0-9]{3}$/.test(symbol)) continue;
    const foreignMain = marketNumber(pick(row, ["外陸資買賣超股數(不含外資自營商)"])) || 0;
    const foreignDealer = marketNumber(pick(row, ["外資自營商買賣超股數"])) || 0;
    const trustNet = marketNumber(pick(row, ["投信買賣超股數"])) || 0;
    const dealerNet = marketNumber(pick(row, ["自營商買賣超股數"])) || 0;
    const total = marketNumber(pick(row, ["三大法人買賣超股數"]));
    stocks[symbol] = {
      foreignNet: foreignMain + foreignDealer,
      trustNet,
      dealerNet,
      institutionTotalNet: total ?? (foreignMain + foreignDealer + trustNet + dealerNet)
    };
  }
  return stocks;
}

function parseTpexInstitutionPayload(payload) {
  const tables = Array.isArray(payload?.tables) ? payload.tables : [];
  const rows = Array.isArray(tables?.[0]?.data) ? tables[0].data : [];
  const stocks = {};
  for (const row of rows) {
    if (!Array.isArray(row) || row.length < 24) continue;
    const symbol = String(row[0] || "").replaceAll("=", "").replaceAll('"', "").trim();
    if (!/^[1-9][0-9]{3}$/.test(symbol)) continue;
    const foreignNet = marketNumber(row[10]) || 0;
    const trustNet = marketNumber(row[13]) || 0;
    const dealerNet = marketNumber(row[22]) || 0;
    const total = marketNumber(row[23]);
    stocks[symbol] = {
      foreignNet,
      trustNet,
      dealerNet,
      institutionTotalNet: total ?? (foreignNet + trustNet + dealerNet)
    };
  }
  return stocks;
}

async function fetchInstitutionSnapshotForDate(marketDate) {
  const ymd = String(marketDate).replaceAll("-", "");
  const twseUrl = `https://www.twse.com.tw/rwd/zh/fund/T86?response=json&date=${encodeURIComponent(ymd)}&selectType=ALL`;
  const tpexUrl = `https://www.tpex.org.tw/www/zh-tw/insti/dailyTrade?type=Daily&sect=EW&date=${encodeURIComponent(rocDateString(marketDate))}&id=&response=json`;
  const [twseResult, tpexResult] = await Promise.all([
    fetchWithDeadline(twseUrl, { headers: { accept: "application/json,text/plain,*/*", "user-agent": "Mozilla/5.0 V7-Institution-History" } })
      .then(async response => response.ok ? { ok: true, payload: await response.json() } : { ok: false, error: `HTTP ${response.status}` })
      .catch(err => ({ ok: false, error: String(err) })),
    fetchWithDeadline(tpexUrl, { headers: { accept: "application/json,text/plain,*/*", "user-agent": "Mozilla/5.0 V7-Institution-History" } })
      .then(async response => response.ok ? { ok: true, payload: await response.json() } : { ok: false, error: `HTTP ${response.status}` })
      .catch(err => ({ ok: false, error: String(err) }))
  ]);

  const twseStocks = twseResult.ok && "payload" in twseResult ? parseTwseInstitutionPayload(twseResult.payload) : {};
  const tpexStocks = tpexResult.ok && "payload" in tpexResult ? parseTpexInstitutionPayload(tpexResult.payload) : {};
  return {
    marketDate,
    stocks: { ...twseStocks, ...tpexStocks },
    sources: {
      twse: { ok: twseResult.ok === true, count: Object.keys(twseStocks).length, error: twseResult.error || null },
      tpex: { ok: tpexResult.ok === true, count: Object.keys(tpexStocks).length, error: tpexResult.error || null }
    },
    calls: 2
  };
}

function isCompleteInstitutionSnapshotRow(row) {
  return Number(row?.stock_count || 0) >= INSTITUTION_SNAPSHOT_MIN_STOCKS;
}

async function seedInstitutionSnapshotStep(env, marketDate) {
  if (!env?.V7_DB) return { skipped: true, status: "尚未設定 V7_DB", calls: 0 };
  const targetDates = recentWeekdays(marketDate, INSTITUTION_SNAPSHOT_LOOKBACK_WEEKDAYS);
  const existing = await readInstitutionSnapshotRows(env, marketDate, 10);
  const existingByDate = new Map(existing.map(row => [String(row.market_date || ""), row]));

  // 7.3.2：V7 只需要最近 3 個「完整」法人交易日來計算連買。
  // 完整交易日已達標時，不再為更舊的 partial 日期重抓，避免一鍵暖機每輪多做無效官方 API 呼叫。
  const completeRowsNow = existing.filter(isCompleteInstitutionSnapshotRow);
  const validDatesNow = completeRowsNow.map(row => row.market_date).slice(0, INSTITUTION_STREAK_MAX_DAYS);
  if (validDatesNow.length >= INSTITUTION_STREAK_MAX_DAYS) {
    return {
      version: VERSION,
      skipped: true,
      status: `法人歷史快照已齊備；完整交易日 ${validDatesNow.length}/${INSTITUTION_STREAK_MAX_DAYS}`,
      targetDates,
      validDates: validDatesNow,
      snapshotCounts: existing.map(row => ({ date: row.market_date, stockCount: Number(row.stock_count || 0), complete: isCompleteInstitutionSnapshotRow(row) })),
      ready: true,
      calls: 0
    };
  }

  // 尚未滿 3 個完整交易日才補缺口；partial 會被 UPSERT 覆蓋修復。
  const nextDate = targetDates.find(date => !isCompleteInstitutionSnapshotRow(existingByDate.get(date)));
  if (!nextDate) {
    return {
      version: VERSION,
      skipped: true,
      status: `法人歷史快照暫無可補日期；完整交易日 ${validDatesNow.length}/${INSTITUTION_STREAK_MAX_DAYS}`,
      targetDates,
      validDates: validDatesNow,
      snapshotCounts: existing.map(row => ({ date: row.market_date, stockCount: Number(row.stock_count || 0), complete: isCompleteInstitutionSnapshotRow(row) })),
      ready: false,
      calls: 0
    };
  }

  const fetched = await fetchInstitutionSnapshotForDate(nextDate);
  const stored = await writeInstitutionSnapshot(env, nextDate, fetched.stocks);
  const refreshed = await readInstitutionSnapshotRows(env, marketDate, 10);
  const completeRows = refreshed.filter(isCompleteInstitutionSnapshotRow);
  const validDates = completeRows.map(row => row.market_date).slice(0, INSTITUTION_STREAK_MAX_DAYS);
  const repaired = (Number(existingByDate.get(nextDate)?.stock_count || 0) > 0);
  return {
    version: VERSION,
    skipped: false,
    status: `${repaired ? "修復" : "建立"}法人快照 ${nextDate}：${stored.stockCount || 0} 檔；完整交易日 ${validDates.length}/${INSTITUTION_STREAK_MAX_DAYS}`,
    seededDate: nextDate,
    repaired,
    stockCount: stored.stockCount || 0,
    complete: (stored.stockCount || 0) >= INSTITUTION_SNAPSHOT_MIN_STOCKS,
    minCompleteStocks: INSTITUTION_SNAPSHOT_MIN_STOCKS,
    sources: fetched.sources,
    targetDates,
    validDates,
    snapshotCounts: refreshed.map(row => ({ date: row.market_date, stockCount: Number(row.stock_count || 0), complete: isCompleteInstitutionSnapshotRow(row) })),
    ready: validDates.length >= INSTITUTION_STREAK_MAX_DAYS,
    calls: fetched.calls
  };
}

async function readInstitutionStreakMap(env, marketDate) {
  const rows = await readInstitutionSnapshotRows(env, marketDate, INSTITUTION_SNAPSHOT_LOOKBACK_WEEKDAYS);
  const snapshots = [];
  const partialDates = [];
  for (const row of rows) {
    const count = Number(row.stock_count || 0);
    if (!isCompleteInstitutionSnapshotRow(row)) {
      if (count > 0) partialDates.push({ date: String(row.market_date || ""), stockCount: count });
      continue;
    }
    try {
      const stocks = JSON.parse(row.snapshot_json || "{}");
      snapshots.push({ date: String(row.market_date || ""), stocks, stockCount: count });
    } catch (_) {}
  }
  const valid = snapshots.slice(0, INSTITUTION_STREAK_MAX_DAYS);
  const symbols = new Set();
  for (const snap of valid) for (const symbol of Object.keys(snap.stocks || {})) symbols.add(symbol);
  const zero = { foreignNet: 0, trustNet: 0, dealerNet: 0, institutionTotalNet: 0 };
  const output = {};
  for (const symbol of symbols) {
    // 完整交易日中若官方表沒有該股票，視為當日法人 0，不視為「缺一天」。
    // 這樣 historyDays 代表市場歷史覆蓋，連買則仍會被 0 正確中斷。
    const sequence = valid.map(snap => snap.stocks?.[symbol] || zero);
    output[symbol] = {
      foreignBuyDays: consecutivePositiveSnapshotDays(sequence, "foreignNet"),
      trustBuyDays: consecutivePositiveSnapshotDays(sequence, "trustNet"),
      dealerBuyDays: consecutivePositiveSnapshotDays(sequence, "dealerNet"),
      institutionHistoryDays: valid.length
    };
  }
  return {
    stocks: output,
    validDates: valid.map(item => item.date),
    snapshotCount: rows.length,
    completeSnapshotCount: snapshots.length,
    partialDates,
    snapshotCounts: rows.map(row => ({ date: row.market_date, stockCount: Number(row.stock_count || 0), complete: isCompleteInstitutionSnapshotRow(row) })),
    ready: valid.length >= INSTITUTION_STREAK_MAX_DAYS
  };
}

function consecutivePositiveSnapshotDays(sequence, key) {
  let count = 0;
  for (const item of sequence) {
    if (!item) break;
    const value = toNumber(item[key]);
    if (value !== null && value > 0) count += 1;
    else break;
  }
  return count;
}

function cronJobLabel(jobType) {
  if (jobType === "HISTORY_WARMUP") return "17:00-17:59 歷史日K＋法人快照暖機";
  if (jobType === "AFTER_MARKET_SCAN") return "18:10 盤後掃描";
  if (jobType === "INTRADAY_MONITOR") return "盤中即時監控";
  return jobType || "未知";
}

function cronStatusLabel(status) {
  if (status === "SUCCESS") return "成功";
  if (status === "SKIPPED") return "已跳過";
  if (status === "FAILED") return "失敗";
  return status || "尚無";
}

async function runScheduledWithAudit(controller, env) {
  const scheduledTime = Number(controller?.scheduledTime || Date.now());
  const cronExpression = String(controller?.cron || "");
  const isAfterMarket = isAfterMarketSchedule(controller);
  const isHistoryWarmup = isHistoryWarmupSchedule(controller);
  const jobType = isHistoryWarmup ? "HISTORY_WARMUP" : (isAfterMarket ? "AFTER_MARKET_SCAN" : "INTRADAY_MONITOR");
  const startedAt = new Date().toISOString();

  try {
    /** @type {any} */
    const result = isHistoryWarmup
      ? await runHistorySeed(env, scheduledTime, HISTORY_WARMUP_LIMIT)
      : (isAfterMarket
        ? await runAfterMarketScan(env, scheduledTime)
        : await runBackgroundMonitor(env, scheduledTime));

    const skipped = Boolean(result?.skipped);
    const fugleCalls = Number(result?.fugleCallsThisRun?.total ?? result?.fugleCalls);
    await writeCronRun(env, {
      cronExpression,
      scheduledTime,
      scheduledAt: new Date(scheduledTime).toISOString(),
      startedAt,
      finishedAt: new Date().toISOString(),
      jobType,
      status: skipped ? "SKIPPED" : "SUCCESS",
      skipped,
      fugleCalls: Number.isFinite(fugleCalls) ? fugleCalls : null,
      detail: result?.status || null,
      error: null
    });
    return result;
  } catch (err) {
    await writeCronRun(env, {
      cronExpression,
      scheduledTime,
      scheduledAt: new Date(scheduledTime).toISOString(),
      startedAt,
      finishedAt: new Date().toISOString(),
      jobType,
      status: "FAILED",
      skipped: false,
      fugleCalls: null,
      detail: null,
      error: String(err)
    });
    throw err;
  }
}

function snapshotAgeSeconds(snapshot) {
  const ms = Date.parse(snapshot?.generatedAtIso || "");
  return Number.isFinite(ms) ? Math.max(0, Math.floor((Date.now() - ms) / 1000)) : null;
}

// ======================================================
// KV 儲存
// ======================================================

async function saveStockConfig(
  env,
  stocks,
  source,
  totalCapital = null
) {
  if (!env.STOCKS_KV) {
    throw new Error(
      "找不到 STOCKS_KV Binding"
    );
  }

  if (totalCapital === null) {
    const previousConfig = await env.STOCKS_KV.get(KV_KEY, "json");
    totalCapital = positiveNumber(previousConfig?.totalCapital);
  }
  const constrained = enforceIndependentPoolQuota(stocks);
  if (constrained.length !== stocks.length) throw new Error("每池最多3檔，禁止跨池補位；請先修正匯入名單");
  const payload = {
    version: 7,
    updatedAt:
      new Date().toISOString(),
    source,
    ...(totalCapital !== null ? { totalCapital } : {}),
    stocks
  };

  await env.STOCKS_KV.put(
    KV_KEY,
    JSON.stringify(payload)
  );
  const readback = await env.STOCKS_KV.get(KV_KEY, "json");
  const verified = readback?.updatedAt === payload.updatedAt && JSON.stringify(readback?.stocks) === JSON.stringify(stocks);

  return {
    ok: true,
    verified,
    verificationNote: verified ? "KV讀回相符" : "寫入已接受，KV讀回尚未相符；不可當作端到端驗收成功",
    count: stocks.length,
    source: "KV",
    updatedAt:
      payload.updatedAt,
    stocks
  };
}

function recalculatePlanCapital(stocks, totalCapital) {
  if (!Number.isFinite(totalCapital) || totalCapital <= 0) throw new Error("總資金必須大於0");
  let totalWeight = 0;
  const next = stocks.map(stock => {
    if (stock.positionStage !== "NONE") throw new Error(`${stock.name}已有持倉：不可用預算重算覆寫持倉股數`);
    const weight = toNumber(stock.allocationRatio);
    if (weight === null || weight < 0 || weight > 100) throw new Error(`${stock.name}缺少有效配置比例，不能猜測權重`);
    totalWeight += weight;
    const price = positiveNumber(stock.buyHigh) || positiveNumber(stock.breakout);
    if (!price) throw new Error(`${stock.name}缺少計畫價格，不能計算股數`);
    const oldTotal = toNumber(stock.totalAllocation);
    const firstRatio = oldTotal > 0 && toNumber(stock.firstAmount) !== null ? stock.firstAmount / oldTotal : 0.6;
    if (firstRatio < 0 || firstRatio > 1) throw new Error(`${stock.name}第一筆比例異常`);
    const totalAllocation = Math.floor(totalCapital * weight / 100);
    const firstAmount = Math.floor(totalAllocation * firstRatio);
    const secondAmount = totalAllocation - firstAmount;
    const firstShares = sharesFor(firstAmount, price);
    const secondShares = sharesFor(secondAmount, price);
    return { ...stock, totalAllocation, firstAmount, secondAmount, firstShares, secondShares,
      totalShares: firstShares + secondShares };
  });
  if (totalWeight > 100 + 1e-8) throw new Error("配置比例總和超過100%，拒絕儲存");
  return { totalCapital, remainingCash: totalCapital - next.reduce((sum, stock) => sum + stock.totalAllocation, 0), stocks: next };
}


// ======================================================
// 讀取設定
// KV 優先
// ======================================================

function enforceIndependentPoolQuota(stocks) {
  const source = Array.isArray(stocks) ? stocks : [];
  const referencePrice = stock => {
    const formal = positiveNumber(stock?.formalClose);
    if (formal !== null) return formal;
    for (const value of [stock?.buyHigh, stock?.buyLow, stock?.breakout, stock?.stop, stock?.profitCheck, stock?.averageCost]) {
      const n = toNumber(value);
      if (n !== null && n > 0) return n;
    }
    return 0;
  };
  const general = source.filter(stock => referencePrice(stock) < THOUSAND_STOCK_PRICE).slice(0, MAX_STOCKS_PER_POOL);
  const thousand = source.filter(stock => referencePrice(stock) >= THOUSAND_STOCK_PRICE).slice(0, MAX_STOCKS_PER_POOL);
  return [...general, ...thousand].sort((a, b) => (toNumber(a?.sourceRank) || 999) - (toNumber(b?.sourceRank) || 999));
}

async function loadStockConfig(env) {
  if (env.STOCKS_KV) {
    let text = await retryTransient("讀取 STOCK_CONFIG_V7", () => env.STOCKS_KV.get(KV_KEY), 3);
    let migratedFrom = null;

    if (!text) {
      text = await retryTransient("讀取 STOCK_CONFIG_V6", () => env.STOCKS_KV.get(LEGACY_KV_KEY), 3);
      migratedFrom = text ? LEGACY_KV_KEY : null;
    }

    if (text) {
      const parsed =
        JSON.parse(text);

      // V6格式
      if (
        parsed &&
        Array.isArray(parsed.stocks)
      ) {
        return {
          source: migratedFrom ? "KV（V6相容讀取）" : "KV",
          updatedAt:
            parsed.updatedAt || null,
          totalCapital: positiveNumber(parsed.totalCapital) || positiveNumber(env.V7_TOTAL_CAPITAL) || DEFAULT_TOTAL_CAPITAL,
          stocks:
            enforceIndependentPoolQuota(validateStocks(
              parsed.stocks
            ))
        };
      }

      // 相容舊陣列
      if (Array.isArray(parsed)) {
        return {
          source: "KV",
          updatedAt: null,
          stocks:
            enforceIndependentPoolQuota(validateStocks(parsed))
        };
      }
    }
  }

  // ==================================================
  // 尚未存V6，先相容舊STOCK_CONFIG
  // ==================================================
  if (env.STOCK_CONFIG) {
    return {
      source:
        "Runtime variable",
      updatedAt: null,
      stocks:
        enforceIndependentPoolQuota(validateStocks(
          JSON.parse(
            env.STOCK_CONFIG
          )
        ))
    };
  }

  return {
    source: "None",
    updatedAt: null,
    stocks: []
  };
}


// ======================================================
// 驗證 0～6 檔
// ======================================================

function extractStocks(body) {
  if (Array.isArray(body)) return body;

  const candidates = [
    body?.stocks,
    body?.candidates,
    body?.payload?.stocks,
    body?.payload?.candidates,
    body?.data?.stocks,
    body?.data?.candidates,
    body?.record?.payload?.stocks,
    body?.record?.payload?.candidates
  ];

  return candidates.find(Array.isArray) || null;
}

function validateStocks(input) {
  if (!Array.isArray(input)) {
    throw new Error(
      "匯入內容必須是 JSON 陣列"
    );
  }

  const active = input.filter(
    item => item && item.enabled !== false && (item.symbol || item.code || item["代號"])
  );

  if (active.length > MAX_STOCKS) {
    throw new Error(
      `最多只能監控${MAX_STOCKS}檔`
    );
  }

  const seen = new Set();

  return active
    .filter(item => {
      const symbol = String(item.symbol || item.code || item["代號"] || "").trim();
      if (seen.has(symbol)) return false;
      seen.add(symbol);
      return true;
    })
    .slice(0, MAX_STOCKS)
    .map(
      (item, index) =>
        normalizeStock(
          item,
          index
        )
    );
}


function normalizeStock(
  item,
  index
) {
  const symbol =
    String(item.symbol || item.code || item["代號"] || "")
      .trim();

  if (
    !/^[0-9A-Za-z]{2,10}$/
      .test(symbol)
  ) {
    throw new Error(
      `第${index + 1}檔股票代號錯誤`
    );
  }

  const buyLow = toNumber(item.buyLow ?? item["買區下緣"]);
  const buyHigh = toNumber(item.buyHigh ?? item["買區上緣"]);
  const breakout = toNumber(item.breakout ?? item["突破價"]);
  const maxChase = toNumber(item.maxChase ?? item["最大追價"]);
  const stop = toNumber(item.stop ?? item["停損"]);
  const profitCheck = toNumber(item.profitCheck ?? item["第一停利檢查"] ?? item["第一停利"]);
  const totalAllocation = toNumber(item.totalAllocation ?? item.totalAmount ?? item["建議總投入"]);
  const firstAmount = toNumber(item.firstAmount ?? item["第一筆金額"]);
  const secondAmount = toNumber(item.secondAmount ?? item["第二筆金額"]);
  const referencePrice = toNumber(item.planPrice ?? item.currentPrice ?? buyHigh ?? breakout);
  const formalClose = toNumber(item.formalClose ?? item.close);
  const resolvedFirstAmount = firstAmount ?? (totalAllocation !== null ? Math.round(totalAllocation * 0.6) : null);
  const resolvedSecondAmount = secondAmount ?? (
    totalAllocation !== null && resolvedFirstAmount !== null
      ? Math.max(0, totalAllocation - resolvedFirstAmount)
      : null
  );
  const resolvedFirstShares = toNumber(item.firstShares ?? item["第一筆股數"]) ?? sharesFor(resolvedFirstAmount, referencePrice);
  const resolvedSecondShares = toNumber(item.secondShares ?? item["第二筆股數"]) ?? sharesFor(resolvedSecondAmount, referencePrice);

  if ((formalClose ?? referencePrice) !== null && (formalClose ?? referencePrice) < 10) {
    throw new Error(`${item.name || item["名稱"] || symbol}：正式價格低於10元，V7禁止納入`);
  }

  const stock = {
    formalClose,
    closeDate: normalizeMarketDate(item.closeDate || item.scanDate),
    planDate: normalizeMarketDate(item.planDate),
    actualShares: toNumber(item.actualShares),
    firstEntryConfirmedAt: Number.isFinite(Date.parse(item.firstEntryConfirmedAt)) ? new Date(item.firstEntryConfirmedAt).toISOString() : null,
    enabled: true,

    symbol,

    name:
      String(
        item.name || item["名稱"] || symbol
      ).trim(),

    mode:
      normalizeMode(
        item.mode || item["操作模式"]
      ),

    buyLow:
      buyLow,

    buyHigh:
      buyHigh,

    breakout:
      breakout,

    maxChase:
      maxChase,

    stop:
      stop,

    profitCheck:
      profitCheck,

    sourceRank: toNumber(item.rank ?? item["排名"]) ?? index + 1,
    channel: String(item.channel ?? item["通道"] ?? "-").trim(),
    signalLevel: normalizeSignalLevel(item.signalLevel ?? item["訊號等級"]),
    priorityScore: toNumber(item.priorityScore ?? item["優先分數"]) ?? 0,
    rewardRisk: toNumber(item.rewardRisk ?? item.rr ?? item.RR ?? item["RR"]) ?? 0,
    sectorFlow: toNumber(item.sectorFlow ?? item["產業資金分數"]) ?? 0,
    relativeStrength: toNumber(item.relativeStrength ?? item.rs ?? item["RS20"] ?? item["RS"]) ?? 0,
    allocationRatio: toNumber(item.allocationRatio ?? item["配置比例"]),
    totalAllocation,
    firstAmount: resolvedFirstAmount,
    secondAmount: resolvedSecondAmount,
    firstShares: resolvedFirstShares,
    secondShares: resolvedSecondShares,
    totalShares: toNumber(item.totalShares ?? item["總股數"]) ?? (
      resolvedFirstShares !== null && resolvedSecondShares !== null
        ? resolvedFirstShares + resolvedSecondShares
        : sharesFor(totalAllocation, referencePrice)
    ),
    firstCondition: String(item.firstCondition ?? item["第一筆條件"] ?? "依15分K正式確認").trim(),
    secondCondition: String(item.secondCondition ?? item["第二筆條件"] ?? "重新止跌或轉強後才加碼，不因下跌直接加碼").trim(),
    selectedReason: String(item.selectedReason ?? item.reason ?? item["入選理由"] ?? "-").trim(),
    positionStage: normalizePositionStage(item.positionStage ?? item["持倉階段"]),
    averageCost: toNumber(item.averageCost ?? item["持倉均價"]),
    reduceAt: toNumber(item.reduceAt ?? item["減碼檢查價"] ?? profitCheck),
    sellBelow: toNumber(item.sellBelow ?? item["正式賣出價"]),
    pushEnabled: item.pushEnabled !== false
  };

  if (
    stock.buyLow !== null &&
    stock.buyHigh !== null &&
    stock.buyLow >
      stock.buyHigh
  ) {
    throw new Error(
      `${stock.name}：拉回下緣不可高於上緣`
    );
  }

  // A＝拉回承接時不使用「突破價／最大追價」作為必要欄位；
  // 此限制只適用 B＝突破後承接（或 BOTH）模式。
  if (
    stock.mode !== "PULLBACK" &&
    stock.breakout !== null &&
    stock.maxChase !== null &&
    stock.maxChase <
      stock.breakout
  ) {
    throw new Error(
      `${stock.name}：最大追價不可低於突破價`
    );
  }

  return stock;
}


function normalizeMode(mode) {
  const m =
    String(mode || "BOTH")
      .toUpperCase();

  if (m === "PULLBACK" || m.includes("拉回")) {
    return "PULLBACK";
  }

  if (m === "MOMENTUM" || m.includes("追漲") || m.includes("突破")) {
    return "MOMENTUM";
  }

  return "BOTH";
}

function normalizeSignalLevel(level) {
  const value = String(level || "C").toUpperCase();
  return ["A", "B", "C"].includes(value) ? value : "C";
}

function normalizePositionStage(stage) {
  const value = String(stage || "NONE").toUpperCase();
  if (["FIRST", "第一筆", "1"].includes(value)) return "FIRST";
  if (["FULL", "已加碼", "滿倉", "2"].includes(value)) return "FULL";
  return "NONE";
}


// ======================================================
// ADMIN TOKEN
// ======================================================

function isAuthorized(
  request,
  env
) {
  if (!env.ADMIN_TOKEN) {
    return false;
  }

  const token =
    request.headers.get(
      "x-admin-token"
    ) || "";

  return (
    token ===
    env.ADMIN_TOKEN
  );
}

function isPushAuthorized(
  request,
  env
) {
  if (!env.PUSH_TOKEN) {
    return false;
  }

  const token =
    request.headers.get(
      "x-push-token"
    ) || "";

  return token === env.PUSH_TOKEN;
}

function isTestMode(env) {
  if (env?.TEST_MODE === undefined) return TEST_MODE_DEFAULT;
  return String(env.TEST_MODE).toLowerCase() !== "false";
}
// ======================================================
// 分析單檔
// ======================================================

async function analyzeStock(
  stock,
  env
) {
  try {
    const [
      raw10,
      raw15
    ] =
      await Promise.all([
        fetchCandles(
          stock.symbol,
          10,
          env
        ),

        fetchCandles(
          stock.symbol,
          15,
          env
        )
      ]);

    const frame10 =
      analyzeFrame(
        raw10,
        10
      );

    const frame15 =
      analyzeFrame(
        raw15,
        15
      );

    // 最新形成中10分K close
    const rawBars =
      raw10?.data || [];

    const currentPrice =
      rawBars.length
        ? rawBars[
            rawBars.length - 1
          ].close
        : null;

    // 拉回
    const pullback =
      stock.mode ===
      "MOMENTUM"

        ? {
            level: "wait",
            text:
              "此股設定為突破後承接型"
          }

        : evaluatePullback(
            frame15,
            stock
          );

    // B：10分K提前觀察突破後回測
    const momentum10 =
      stock.mode ===
      "PULLBACK"

        ? {
            level: "wait",
            text:
              "此股設定為拉回承接型"
          }

        : evaluateMomentum(
            frame10,
            stock,
            "10分K"
          );

    // B：15分K正式確認突破後承接
    const momentum15 =
      stock.mode ===
      "PULLBACK"

        ? {
            level: "wait",
            text:
              "此股設定為拉回承接型"
          }

        : evaluateMomentum(
            frame15,
            stock,
            "15分K"
          );

    const stop =
      evaluateStop(
        frame15,
        frame10,
        currentPrice,
        stock
      );

    const profit =
      evaluateProfit(
        currentPrice,
        stock
      );

    const rawFinalDecision =
      buildFinalDecision({
        pullback,
        momentum10,
        momentum15,
        stop,
        profit
      });
    const finalDecision = applyPlanValidity(stock, rawFinalDecision);

    const monitorStatus = buildMonitorStatus(finalDecision);

    return {
      ok: true,

      symbol:
        stock.symbol,

      name:
        stock.name,

      currentPrice,

      plan: stock,

      frame10,

      frame15,

      pullback,

      momentum10,

      momentum15,

      stop,

      profit,

      finalDecision,
      monitorStatus
    };

  } catch (err) {
    return {
      ok: false,
      symbol:
        stock.symbol,
      name:
        stock.name,
      error:
        String(err)
    };
  }
}


// ======================================================
// Fugle
// ======================================================

async function fetchCandles(
  symbol,
  tf,
  env
) {
  const url =
    `https://api.fugle.tw/marketdata/v1.0/stock/intraday/candles/${symbol}` +
    `?timeframe=${tf}&sort=asc`;

  const response =
    await fetchWithDeadline(
      url,
      {
        headers: {
          "X-API-KEY":
            env.FUGLE_API_KEY
        }
      }
    );

  if (!response.ok) {
    const body =
      await response.text();

    throw new Error(
      `${symbol} ${tf}分K API錯誤 ${response.status}: ${body}`
    );
  }

  return await response.json();
}



async function fetchQuote(symbol, env) {
  const url = `https://api.fugle.tw/marketdata/v1.0/stock/intraday/quote/${symbol}`;
  const response = await fetchWithDeadline(url, {
    headers: { "X-API-KEY": env.FUGLE_API_KEY }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${symbol} Quote API錯誤 ${response.status}: ${body}`);
  }

  return await response.json();
}

function quotePrice(quote) {
  const candidates = [quote?.closePrice, quote?.lastPrice, quote?.price];
  for (const value of candidates) {
    const n = Number(value);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

// ======================================================
// K棒：只使用已完成K
// ======================================================

function analyzeFrame(
  raw,
  tf
) {
  const bars = raw?.data || [];
  const nowMs = Date.now();
  const completed = bars.filter(bar => {
    const start = Date.parse(bar.date);
    const end = start + tf * 60 * 1000;
    return nowMs >= end;
  });

  if (!completed.length) {
    return { timeframe: tf, completedBars: 0, latest: null, previous: null, recent: [] };
  }

  const i = completed.length - 1;
  const recentStart = Math.max(0, completed.length - 12);
  const recent = [];
  for (let idx = recentStart; idx < completed.length; idx += 1) {
    recent.push(buildBar(completed, idx));
  }

  return {
    timeframe: tf,
    completedBars: completed.length,
    latest: buildBar(completed, i),
    previous: completed.length >= 2 ? buildBar(completed, i - 1) : null,
    recent
  };
}

function buildBar(
  bars,
  index
) {
  const bar =
    bars[index];

  const prev5 =
    index >= 5
      ? bars.slice(
          index - 5,
          index
        )
      : [];

  let avg5Volume =
    null;

  let volumeRatio =
    null;

  if (
    prev5.length === 5
  ) {
    avg5Volume =
      prev5.reduce(
        (sum, b) =>
          sum + b.volume,
        0
      ) / 5;

    if (avg5Volume > 0) {
      volumeRatio =
        bar.volume /
        avg5Volume;
    }
  }

  const range =
    bar.high -
    bar.low;

  const body =
    Math.abs(
      bar.close -
      bar.open
    );

  const closePosition =
    range > 0
      ? (
          bar.close -
          bar.low
        ) /
        range
      : 0.5;

  const lowerShadow =
    Math.min(
      bar.open,
      bar.close
    ) -
    bar.low;

  const upperShadow =
    bar.high -
    Math.max(
      bar.open,
      bar.close
    );

  const bullish =
    bar.close >
    bar.open;

  const bearish =
    bar.close <
    bar.open;

  const strongClose =
    closePosition >=
    2 / 3;

  const lowerShadowStop =
    range > 0 &&
    bullish &&
    lowerShadow >=
      Math.max(
        body,
        range * 0.25
      );

  const prev =
    index >= 1
      ? bars[index - 1]
      : null;

  const bullishEngulfing =
    Boolean(
      prev &&
      prev.close <
        prev.open &&
      bullish &&
      bar.open <=
        prev.close &&
      bar.close >=
        prev.open
    );

  return {
    time:
      bar.date,

    open:
      bar.open,

    high:
      bar.high,

    low:
      bar.low,

    close:
      bar.close,

    volume:
      bar.volume,

    average:
      bar.average,

    avg5Volume:
      avg5Volume !== null
        ? round(
            avg5Volume
          )
        : null,

    volumeRatio:
      volumeRatio !== null
        ? round(
            volumeRatio
          )
        : null,

    volumeSignal:
      volumeRatio === null
        ? "近5根資料不足"

        : volumeRatio >= 1.5
        ? "強攻量 ≥1.5倍"

        : volumeRatio >= 1.3
        ? "攻擊量 ≥1.3倍"

        : volumeRatio <= 0.8
        ? "量縮 ≤0.8倍"

        : "一般量",

    closePosition:
      round(
        closePosition *
        100,
        1
      ),

    strongClose,

    bullish,

    bearish,

    lowerShadowStop,

    bullishEngulfing,

    reversalK:
      Boolean(
        lowerShadowStop ||
        bullishEngulfing
      ),

    upperShadowRatio:
      range > 0
        ? round(
            upperShadow /
            range,
            2
          )
        : 0
  };
}


// ======================================================
// A：拉回承接
// ======================================================

function evaluatePullback(
  frame,
  plan
) {
  const latest = frame.latest;
  const previous = frame.previous;

  if (!latest) return { level: "wait", text: "尚無完整15分K" };
  if (plan.buyLow === null || plan.buyHigh === null) {
    return { level: "wait", text: "未設定拉回承接區" };
  }

  if (latest.close < plan.buyLow) {
    return { level: "risk", text: "拉回承接區下緣失守，不接刀" };
  }

  const downVolume = latest.bearish && latest.volumeRatio !== null && latest.volumeRatio >= 1.3;
  if (downVolume) return { level: "risk", text: "下跌放量，不承接" };

  if (previous) {
    const entered = previous.low <= plan.buyHigh && previous.high >= plan.buyLow;
    const held = previous.close >= plan.buyLow;
    const volumeOK = previous.volumeRatio !== null && previous.volumeRatio <= 0.9;
    const reversal = previous.reversalK || previous.strongClose;
    const higherLow = latest.low >= previous.low;
    const turnUp = latest.bullish && (latest.close > previous.close || latest.high > previous.high);

    if (entered && held && volumeOK && reversal && higherLow && turnUp) {
      return {
        level: "buy",
        text: latest.high > previous.high
          ? "A拉回承接成立：量縮止跌＋較高低點＋15分K突破止跌K高點"
          : "A拉回承接成立：量縮止跌＋較高低點＋15分K轉強"
      };
    }
  }

  const entered = latest.low <= plan.buyHigh && latest.high >= plan.buyLow;
  const held = latest.close >= plan.buyLow;
  const idealVolume = latest.volumeRatio !== null && latest.volumeRatio <= 0.9;

  if (entered && held && idealVolume && latest.reversalK) {
    return { level: "watch", text: "A進入拉回承接區且量縮止跌，等待下一根完整15分K轉強" };
  }
  if (entered && held) {
    return { level: "watch", text: "A進入拉回承接區，等待量縮＋止跌＋15分K轉強" };
  }
  if (latest.close > plan.buyHigh) {
    return { level: "wait", text: "A等待拉回至承接區，不追價" };
  }
  return { level: "wait", text: "A等待拉回承接條件" };
}

// ======================================================
// B：突破後承接
// ======================================================

function evaluateMomentum(
  frame,
  plan,
  label
) {
  const latest = frame.latest;
  const recent = Array.isArray(frame.recent) ? frame.recent : [frame.previous, frame.latest].filter(Boolean);

  if (!latest) return { level: "wait", text: `${label}尚無完整K棒` };
  if (plan.breakout === null) return { level: "wait", text: "未設定B突破確認價" };

  const breakout = plan.breakout;
  const retestLow = plan.buyLow ?? breakout * 0.995;
  const retestHigh = plan.buyHigh ?? breakout * 1.01;

  if (plan.maxChase !== null && latest.close > plan.maxChase) {
    return { level: "wait", text: `${label}已離突破位過遠，不追；等待回測承接區` };
  }

  const breakoutBars = recent.filter(bar =>
    bar && bar.close >= breakout * 1.003 &&
    bar.volumeRatio !== null && bar.volumeRatio >= 1.3 &&
    bar.strongClose && bar.upperShadowRatio < 0.45
  );
  const breakoutConfirmed = breakoutBars.length > 0;

  if (!breakoutConfirmed) {
    if (latest.high >= breakout && latest.close < breakout * 0.995) {
      return { level: "risk", text: `${label}碰突破價後跌回，B突破失敗` };
    }
    if (latest.close >= breakout) {
      return { level: "watch", text: `${label}已站上突破價，但尚未完成量價確認` };
    }
    return { level: "wait", text: `B等待${label}有效突破` };
  }

  if (latest.close < retestLow) {
    return { level: "risk", text: `${label}突破後回測失守承接區，B取消` };
  }

  const touchedRetest = latest.low <= retestHigh && latest.high >= retestLow;
  const heldBreakout = latest.close >= breakout * 0.997;
  const retestVolumeOK = latest.volumeRatio === null || latest.volumeRatio <= 1.1;
  const turnUp = latest.bullish && (latest.reversalK || latest.strongClose);
  const noLongUpper = latest.upperShadowRatio < 0.45;

  if (touchedRetest && heldBreakout && retestVolumeOK && turnUp && noLongUpper) {
    return {
      level: "buy",
      text: `${label}B突破後承接成立：已有效突破＋回測守住＋量縮/不爆量＋轉強`
    };
  }

  if (latest.close >= breakout && !touchedRetest) {
    return { level: "watch", text: `${label}突破已確認，等待回測突破位，不直接追` };
  }

  if (touchedRetest && heldBreakout) {
    return { level: "watch", text: `${label}已回測承接區並守住，等待完整K轉強確認` };
  }

  return { level: "watch", text: `${label}B突破已確認，等待回測承接` };
}

// ======================================================
// 停損
// ======================================================

function evaluateStop(
  frame15,
  frame10,
  currentPrice,
  plan
) {
  const latest15 =
    frame15.latest;

  const latest10 =
    frame10.latest;

  if (
    plan.stop === null
  ) {
    return {
      level: "wait",
      text:
        "未設定停損"
    };
  }

  if (
    latest15 &&
    latest15.close <
      plan.stop
  ) {
    return {
      level: "risk",
      text:
        "15分K收破停損價，退出"
    };
  }

  const emergencyVolume =
    latest10 &&
    latest10.bearish &&
    latest10.volumeRatio !==
      null &&
    latest10.volumeRatio >=
      1.3;

  if (
    currentPrice !== null &&
    currentPrice <=
      plan.stop *
      0.992 &&
    emergencyVolume
  ) {
    return {
      level: "watch",
      text:
        "10分K輔助警示：盤中跌破停損0.8%以上且放量；等待15分K正式確認"
    };
  }

  return {
    level: "ok",
    text:
      "停損未觸發"
  };
}


// ======================================================
// 第一停利檢查
// ======================================================

function evaluateProfit(
  currentPrice,
  plan
) {
  if (
    plan.profitCheck === null
  ) {
    return {
      level: "wait",
      text:
        "未設定停利檢查區"
    };
  }

  if (
    currentPrice !== null &&
    currentPrice >=
      plan.profitCheck
  ) {
    return {
      level: "profit",
      text:
        "進入第一停利檢查區，不自動賣出"
    };
  }

  return {
    level: "ok",
    text:
      "尚未進入停利檢查區"
  };
}


// ======================================================
// 最終判斷
// ======================================================

function buildFinalDecision({
  pullback,
  momentum10,
  momentum15,
  stop,
  profit
}) {
  if (
    stop.level === "risk"
  ) {
    return {
      level: "risk",
      text:
        stop.text
    };
  }

  if (
    profit.level ===
    "profit"
  ) {
    return {
      level: "profit",
      text:
        "進入停利檢查區，檢查量價，不自動賣出"
    };
  }

  if (
    pullback.level ===
    "buy"
  ) {
    return {
      level: "buy",
      text:
        "A拉回承接：15分K確認，可第一筆"
    };
  }

  if (
    momentum15.level ===
    "buy"
  ) {
    return {
      level: "buy",
      text:
        "B突破後承接：15分K回測確認成立，可第一筆"
    };
  }

  if (
    momentum10.level ===
    "buy"
  ) {
    return {
      level: "watch",
      text:
        "10分K已出現B突破回測訊號，等待15分K正式確認"
    };
  }

  if (
    pullback.level ===
      "risk" ||
    momentum15.level ===
      "risk"
  ) {
    return {
      level: "risk",
      text:
        "目前不適合進場"
    };
  }

  return {
    level: "wait",
    text: "等待"
  };
}

function applyPlanValidity(plan, decision, quote = null) {
  if (plan.planDate && plan.planDate !== taiwanDate()) {
    if (plan.positionStage === "NONE" || decision.level === "buy") return {level:"wait", text:`交易計畫日期${plan.planDate}並非今日：不建立新部位／加碼；已有持倉續按原風控監控`};
  }
  if (quote?.isTrial === true && decision.level === "buy") return {level:"watch", text:"試撮行情不產生正式買進或加碼指令"};
  return decision;
}

// ======================================================
// V7 卡片分級與動態排序
// A：立即處理；B：接近條件；C：等待
// ======================================================

function buildMonitorStatus(decision) {
  if (["buy", "risk", "profit"].includes(decision.level)) {
    return { grade: "A", text: "立即處理" };
  }

  if (decision.level === "watch") {
    return { grade: "B", text: "接近條件" };
  }

  return { grade: "C", text: "等待" };
}

function compareResults(a, b) {
  const actionWeight = {
    risk: 6,
    buy: 5,
    profit: 4,
    watch: 3,
    wait: 2,
    ok: 1
  };

  const levelWeight = { A: 3, B: 2, C: 1 };
  const aPlan = a.plan || {};
  const bPlan = b.plan || {};
  const comparisons = [
    (actionWeight[b.finalDecision?.level] || 0) - (actionWeight[a.finalDecision?.level] || 0),
    (levelWeight[bPlan.signalLevel] || 0) - (levelWeight[aPlan.signalLevel] || 0),
    (bPlan.priorityScore || 0) - (aPlan.priorityScore || 0),
    (bPlan.rewardRisk || 0) - (aPlan.rewardRisk || 0),
    (bPlan.sectorFlow || 0) - (aPlan.sectorFlow || 0),
    (bPlan.relativeStrength || 0) - (aPlan.relativeStrength || 0),
    (aPlan.sourceRank || 999) - (bPlan.sourceRank || 999)
  ];

  return comparisons.find(value => value !== 0) || 0;
}

// ======================================================
// Phase 2：六類操作訊號、背景監控與去重
// ======================================================

function evaluateOperationSignals(result) {
  if (!result.ok || result.plan?.pushEnabled === false) return [];

  const p = result.plan;
  const signals = [];
  const latest10 = result.frame10?.latest;
  const latest15 = result.frame15?.latest;
  const hasPosition = p.positionStage !== "NONE";
  const heldShares = positiveNumber(p.actualShares) || (p.positionStage === "FIRST" ? p.firstShares : p.totalShares);
  const heldAmount = p.positionStage === "FIRST" ? p.firstAmount : p.totalAllocation;

  if (result.stop?.level === "risk") {
    // 尚未建立部位時，跌破停損價代表「今日買進計畫失效」，不能叫使用者賣出不存在的持股。
    if (!hasPosition) {
      signals.push(operationSignal(
        "PLAN_INVALIDATED",
        "取消進場",
        "尚未建立部位；買進計畫失效，取消今日進場",
        result.stop.text,
        null,
        null
      ));
      return signals;
    }

    signals.push(operationSignal(
      "STOP_LOSS",
      "停損",
      "立即依計畫停損並正式賣出",
      result.stop.text,
      heldAmount,
      heldShares
    ));
    return signals;
  }

  if (
    hasPosition &&
    p.sellBelow !== null &&
    latest15 &&
    latest15.close < p.sellBelow
  ) {
    signals.push(operationSignal(
      "SELL",
      "正式賣出",
      "15分K確認跌破正式賣出價，執行賣出",
      `15分K收盤 ${fmt(latest15.close)} < 正式賣出價 ${fmt(p.sellBelow)}`,
      heldAmount,
      heldShares
    ));
    return signals;
  }

  // B策略：10分K只做提前預警；15分K仍是正式買進/加碼確認。
  // EARLY_ALERT_10M 與 BUY/ADD 使用不同 signal type，因此各自只推一次。
  if (
    !hasPosition &&
    result.finalDecision?.level === "watch" &&
    result.momentum10?.level === "buy"
  ) {
    signals.push(operationSignal(
      "EARLY_ALERT_10M",
      "10分K預警",
      "B突破後承接出現10分K提前訊號，先準備，不立即買進；等待15分K正式確認",
      result.finalDecision.text,
      null,
      null
    ));
  }

  if (result.finalDecision?.level === "buy" && (p.maxChase == null || result.currentPrice <= p.maxChase)) {
    if (p.positionStage === "NONE") {
      signals.push(operationSignal(
        "BUY",
        "買進訊號",
        "第一筆條件成立，可執行第一筆",
        result.finalDecision.text,
        p.firstAmount,
        p.firstShares
      ));
    } else if (p.positionStage === "FIRST") {
      signals.push(operationSignal(
        "ADD",
        "第二筆加碼",
        "重新止跌或轉強確認，可執行第二筆",
        p.secondCondition,
        p.secondAmount,
        p.secondShares
      ));
    }
  }

  const reduceConfirmed =
    hasPosition &&
    p.reduceAt !== null &&
    result.currentPrice !== null &&
    result.currentPrice >= p.reduceAt &&
    latest15?.bearish &&
    latest15.volumeRatio !== null &&
    latest15.volumeRatio >= 1.3;

  if (reduceConfirmed) {
    signals.push(operationSignal(
      "REDUCE",
      "減碼",
      "進入獲利區後15分K放量轉弱正式確認，執行計畫減碼",
      `15分K下跌量比 ${fmt(latest15.volumeRatio)}；10分K僅作輔助`,
      heldAmount != null ? Math.round(heldAmount / 2) : null,
      heldShares != null ? Math.floor(heldShares / 2) : null
    ));
  } else if (hasPosition && result.profit?.level === "profit") {
    signals.push(operationSignal(
      "PROFIT_CHECK",
      "停利檢查",
      "已到第一停利檢查區，檢查量價，不自動賣出",
      result.profit.text,
      null,
      null
    ));
  }

  return signals;
}

function operationSignal(type, label, instruction, reason, amount, shares) {
  return { type, label, instruction, reason, amount, shares };
}

function taiwanClock(value = Date.now()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Taipei", hour: "2-digit", minute: "2-digit", hour12: false
  }).formatToParts(new Date(value));
  const item = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return { hour: Number(item.hour), minute: Number(item.minute) };
}

function isIntradayMonitorWindow(value = Date.now()) {
  const { hour, minute } = taiwanClock(value);
  return (hour >= 9 && hour <= 12) || (hour === 13 && minute <= 24);
}

async function analyzeStockSmart(stock, env, previousResult, need10, need15, forceFrames) {
  try {
    const quote = await fetchQuote(stock.symbol, env);
    const currentPrice = quotePrice(quote) ?? previousResult?.currentPrice ?? null;

    let frame10 = previousResult?.frame10 || { timeframe: 10, completedBars: 0, latest: null, previous: null, recent: [] };
    let frame15 = previousResult?.frame15 || { timeframe: 15, completedBars: 0, latest: null, previous: null, recent: [] };

    const jobs = [];
    const labels = [];
    if (forceFrames || need10 || !previousResult?.frame10) { jobs.push(fetchCandles(stock.symbol, 10, env)); labels.push(10); }
    if (forceFrames || need15 || !previousResult?.frame15) { jobs.push(fetchCandles(stock.symbol, 15, env)); labels.push(15); }

    if (jobs.length) {
      const raws = await Promise.all(jobs);
      raws.forEach((raw, i) => {
        if (labels[i] === 10) frame10 = analyzeFrame(raw, 10);
        if (labels[i] === 15) frame15 = analyzeFrame(raw, 15);
      });
    }

    const pullback = stock.mode === "MOMENTUM"
      ? { level: "wait", text: "此股設定為突破後承接型" }
      : evaluatePullback(frame15, stock);
    const momentum10 = stock.mode === "PULLBACK"
      ? { level: "wait", text: "此股設定為拉回承接型" }
      : evaluateMomentum(frame10, stock, "10分K");
    const momentum15 = stock.mode === "PULLBACK"
      ? { level: "wait", text: "此股設定為拉回承接型" }
      : evaluateMomentum(frame15, stock, "15分K");
    const stop = evaluateStop(frame15, frame10, currentPrice, stock);
    const profit = evaluateProfit(currentPrice, stock);
    const finalDecision = applyPlanValidity(stock, buildFinalDecision({ pullback, momentum10, momentum15, stop, profit }), quote);

    return {
      ok: true, symbol: stock.symbol, name: stock.name, currentPrice, plan: stock,
      frame10, frame15, pullback, momentum10, momentum15, stop, profit, finalDecision,
      monitorStatus: buildMonitorStatus(finalDecision),
      quote: {
        closePrice: quote?.closePrice ?? null,
        lastUpdated: quote?.lastUpdated ?? quote?.closeTime ?? null,
        isTrial: quote?.isTrial === true
      }
    };
  } catch (err) {
    return {
      ...(previousResult || {}),
      ok: false, symbol: stock.symbol, name: stock.name,
      error: String(err)
    };
  }
}

async function runBackgroundMonitor(env, scheduledTime = Date.now(), allowOutsideWindow = false) {
  await loadTradingCalendar(env, Number(taiwanDate(scheduledTime).slice(0, 4)));
  if (!isTradingDate(taiwanDate(scheduledTime))) return {skipped:true, status:"休市日不產生交易訊號", fugleCalls:0};
  if (!env.STOCKS_KV) throw new Error("找不到 STOCKS_KV Binding");
  if (!env.FUGLE_API_KEY) throw new Error("找不到 FUGLE_API_KEY");

  // 防呆：即使 Cron 設錯，13:25 後也不再把試撮當一般盤中行情。
  if (!allowOutsideWindow && !isIntradayMonitorWindow(scheduledTime)) {
    return {
      version: VERSION, generatedAt: taiwanTime(), generatedAtIso: new Date().toISOString(),
      skipped: true, status: "非V7盤中監控時段，已跳過 Fugle 呼叫"
    };
  }

  const loaded = await loadStockConfig(env);
  const previousSnapshot = await readLiveSnapshot(env);
  const sameTradeDate = previousSnapshot?.tradeDate === taiwanDate(scheduledTime);
  const previousMap = new Map(
    (sameTradeDate && Array.isArray(previousSnapshot?.results) ? previousSnapshot.results : [])
      .map(item => [String(item.symbol), item])
  );

  const { hour, minute } = taiwanClock(scheduledTime);
  const minutesSinceOpen = hour * 60 + minute - 9 * 60;
  // 收棒後隔 1 分鐘再抓，避免剛好在整點/10分/15分邊界時資料尚未完成。
  // 10分K：09:11、09:21、09:31...；15分K：09:16、09:31、09:46...
  const need10 = minutesSinceOpen >= 11 && (minutesSinceOpen - 1) % 10 === 0;
  const need15 = minutesSinceOpen >= 16 && (minutesSinceOpen - 1) % 15 === 0;
  const forceFrames = !sameTradeDate || previousMap.size === 0;

  const results = (await Promise.all(
    loaded.stocks.map(stock => analyzeStockSmart(
      stock, env, previousMap.get(String(stock.symbol)), need10, need15, forceFrames
    ))
  ))
    .sort(compareResults)
    .map((item, index) => ({ ...item, displayRank: index + 1 }));

  const notifications = [];
  for (const result of results) {
    notifications.push(...await processSignalState(result, env, taiwanDate(scheduledTime)));
  }

  const quoteCalls = loaded.stocks.length;
  const candleCalls = loaded.stocks.length * ((forceFrames || need10 ? 1 : 0) + (forceFrames || need15 ? 1 : 0));
  const snapshot = {
    version: VERSION,
    scheduledTime,
    generatedAt: taiwanTime(),
    generatedAtIso: new Date().toISOString(),
    tradeDate: taiwanDate(scheduledTime),
    testMode: isTestMode(env),
    monitoredCount: results.length,
    status: results.length ? `完成${results.length}檔智慧背景監控` : "今日 0 檔，維持現金",
    liveStore: env.V7_DB ? "D1 primary" : "KV fallback",
    cadence: { everyMinuteQuote: true, updated10m: forceFrames || need10, updated15m: forceFrames || need15 },
    fugleCallsThisRun: { quote: quoteCalls, candles: candleCalls, total: quoteCalls + candleCalls, freePlanLimitPerMinute: 60 },
    notifications,
    results
  };

  const liveStore = await writeLiveSnapshot(env, snapshot);
  const kvSummary = { ...snapshot, liveStoreResult: liveStore };
  await env.STOCKS_KV.put(
    LAST_MONITOR_KEY,
    JSON.stringify(kvSummary),
    { expirationTtl: 2 * 24 * 60 * 60 }
  );

  return kvSummary;
}

async function processSignalState(result, env, tradeDate = taiwanDate()) {
  if (!result.ok) return [];

  const key = SIGNAL_STATE_PREFIX + result.symbol;
  const rawPrevious = await env.STOCKS_KV.get(key, "json") || {};
  const sameTradeDate = rawPrevious.tradeDate === tradeDate;
  const modeMatches = rawPrevious.testMode === undefined || rawPrevious.testMode === isTestMode(env);
  const previous = sameTradeDate && modeMatches ? rawPrevious : { active: [], fired: [], tradeDate };
  const previousActive = new Set(Array.isArray(previous.active) ? previous.active : []);
  const previousFired = new Set(Array.isArray(previous.fired) ? previous.fired : []);
  const entryBarTime = result.frame15?.latest?.time || null;
  const lastEntrySignalBarTime = rawPrevious.lastEntrySignalBarTime || result.plan?.firstEntryConfirmedAt || null;
  const planDateMatches = !result.plan?.planDate || result.plan.planDate === tradeDate;
  const activeSignals = evaluateOperationSignals(result).filter(signal => {
    if (["BUY", "ADD", "EARLY_ALERT_10M"].includes(signal.type) && (!planDateMatches || result.quote?.isTrial === true)) return false;
    return signal.type !== "ADD" || (entryBarTime && lastEntrySignalBarTime && Date.parse(entryBarTime) > Date.parse(lastEntrySignalBarTime));
  });
  const activeTypes = activeSignals.map(signal => signal.type);
  const activeTypeSet = new Set(activeTypes);
  const delivered = [];
  const storedActive = new Set(
    [...previousActive].filter(type => activeTypeSet.has(type))
  );
  const stageNow = String(result.plan?.positionStage || "NONE");
  const fired = new Set([...previousFired].filter(key => {
    const separator = key.indexOf(":");
    return key.slice(0, separator) === stageNow && activeTypeSet.has(key.slice(separator + 1));
  }));
  const stage = String(result.plan?.positionStage || "NONE");
  const episodes = { ...(previous.episodes || {}) };

  for (const signal of activeSignals) {
    // 同一持續成立的訊號只通知一次；解除後移除鎖定，再成立可再次通知。
    const firedKey = `${stage}:${signal.type}`;
    if (fired.has(firedKey)) {
      storedActive.add(signal.type);
      continue;
    }

    const payload = buildPushPayload(result, signal, tradeDate);
    // 同一成立期間及失敗重試共用ID；解除後的新一輪使用新ID，避免接收端去重擋掉。
    const episode = (Number(episodes[firedKey]) || 0) + 1;
    payload.signalId += `:episode-${episode}`;
    if (!shouldPhonePushSignal(signal.type)) {
      delivered.push({
        ...payload,
        sent: false,
        simulated: false,
        pushSuppressed: true,
        suppressionReason: "此訊號類型未列入V7手機推播"
      });
      storedActive.add(signal.type);
      fired.add(firedKey);
      episodes[firedKey] = episode;
      continue;
    }

    const outcome = await sendPush(payload, env);
    delivered.push({ ...payload, ...outcome });
    if (outcome.sent) {
      storedActive.add(signal.type);
      fired.add(firedKey);
      episodes[firedKey] = episode;
    }
  }

  const nextState = {
    tradeDate,
    testMode: isTestMode(env),
    active: [...storedActive].sort(),
    fired: [...fired].sort(),
    positionStage: stage,
    episodes,
    lastEntrySignalBarTime: delivered.some(item => ["BUY", "ADD"].includes(item.signalType) && item.sent === true) && entryBarTime ? entryBarTime : lastEntrySignalBarTime,
    updatedAt: new Date().toISOString()
  };
  const oldComparable = {
    testMode: previous.testMode,
    episodes: previous.episodes || {},
    lastEntrySignalBarTime: previous.lastEntrySignalBarTime || null,
    tradeDate: previous.tradeDate || tradeDate,
    active: [...previousActive].sort(),
    fired: [...previousFired].sort(),
    positionStage: previous.positionStage || null
  };
  const newComparable = {
    testMode: nextState.testMode,
    episodes: nextState.episodes,
    lastEntrySignalBarTime: nextState.lastEntrySignalBarTime,
    tradeDate: nextState.tradeDate,
    active: nextState.active,
    fired: nextState.fired,
    positionStage: nextState.positionStage
  };

  if (JSON.stringify(newComparable) !== JSON.stringify(oldComparable) || previous.updatedAt === undefined) {
    await env.STOCKS_KV.put(
      key,
      JSON.stringify(nextState),
      { expirationTtl: SIGNAL_STATE_TTL_SECONDS }
    );
  }

  return delivered;
}

function buildPushPayload(result, signal, tradeDate = taiwanDate()) {
  const p = result.plan;
  return {
    version: VERSION,
    signalId: `${tradeDate}:${result.symbol}:${result.plan?.positionStage || "NONE"}:${signal.type}`,
    signalType: signal.type,
    signalLabel: signal.label,
    tradeDate,
    positionStage: result.plan?.positionStage || "NONE",
    title: `V7 ${signal.label}｜${result.name} ${result.symbol}`,
    instruction: signal.instruction,
    stock: { symbol: result.symbol, name: result.name },
    currentPrice: result.currentPrice,
    reason: signal.reason,
    suggestedAmount: signal.amount,
    suggestedShares: ["BUY", "ADD"].includes(signal.type) && positiveNumber(result.currentPrice) && toNumber(signal.amount) !== null
      ? sharesFor(signal.amount, result.currentPrice) : signal.shares,
    stop: p.stop,
    profitCheck: p.profitCheck,
    time: taiwanTime()
  };
}

function formatSlackSignalMessage(payload) {
  if (payload?.signalType === "DAILY_SELECTION") {
    return [
      `📋 *${payload.title}*`, payload.instruction,
      ...(payload.stocks || []).map(stock =>
        `${stock.rank}. ${stock.name} ${stock.symbol}｜${stock.mode}\n第一筆 ${fmt(stock.firstAmount)}元／${stock.firstShares}股：${stock.firstCondition}\n第二筆 ${fmt(stock.secondAmount)}元／${stock.secondShares}股：${stock.secondCondition}\n停損 ${fmt(stock.stop)}｜停利檢查 ${fmt(stock.profitCheck)}\n入選原因：${stock.reason}`),
      `監控：${payload.monitorUrl}`, `時間：${payload.time}`
    ].join("\n\n");
  }
  // 系統／鏈路測試不是交易訊號，直接顯示測試內容，避免出現「現價:-／動作:-／原因:-」空白通知。
  if (payload?.type === "SYSTEM_TEST" || (payload?.message && !payload?.signalType)) {
    return [
      `${payload?.type === "SYSTEM_ALERT" ? "⚠️" : "🧪"} *${payload?.title || "V7 系統測試"}*`,
      String(payload?.message || "V7 系統測試訊息"),
      `時間：${payload?.time || payload?.generatedAt || taiwanTime()}`
    ].filter(Boolean).join("\n");
  }

  const stock = payload?.stock || {};
  const amount = payload?.suggestedAmount !== null && payload?.suggestedAmount !== undefined
    ? `\n建議金額：${Number(payload.suggestedAmount).toLocaleString("zh-TW")} 元`
    : "";
  const shares = payload?.suggestedShares !== null && payload?.suggestedShares !== undefined
    ? `｜${payload.suggestedShares} 股`
    : "";
  const stop = payload?.stop !== null && payload?.stop !== undefined ? `\n停損：${payload.stop}` : "";
  const profit = payload?.profitCheck !== null && payload?.profitCheck !== undefined ? `｜停利檢查：${payload.profitCheck}` : "";
  return [
    `🚦 *${payload?.title || "V7 盤中訊號"}*`,
    `${stock.name || ""} ${stock.symbol || ""}｜現價：${payload?.currentPrice ?? "-"}`,
    `動作：${payload?.instruction || payload?.signalLabel || "-"}`,
    `原因：${payload?.reason || "-"}`,
    `${amount}${shares}`.trim(),
    `${stop}${profit}`.trim(),
    `時間：${payload?.time || taiwanTime()}`
  ].filter(Boolean).join("\n");
}

function shouldPhonePushSignal(type) {
  return [
    "EARLY_ALERT_10M",
    "PLAN_INVALIDATED",
    "BUY",
    "ADD",
    "REDUCE",
    "PROFIT_CHECK",
    "SELL",
    "STOP_LOSS"
  ].includes(type);
}

async function sendPushDirect(payload, env) {
  if (!env.PUSH_WEBHOOK_URL) {
    return { sent: false, simulated: false, error: "尚未設定 PUSH_WEBHOOK_URL" };
  }

  const webhookUrl = String(env.PUSH_WEBHOOK_URL);
  const isSlackIncomingWebhook = /^https:\/\/hooks\.slack\.com\//i.test(webhookUrl);
  const headers = { "content-type": "application/json" };

  if (!isSlackIncomingWebhook && env.PUSH_WEBHOOK_TOKEN) {
    headers.authorization = `Bearer ${env.PUSH_WEBHOOK_TOKEN}`;
  }

  const body = isSlackIncomingWebhook
    ? { text: formatSlackSignalMessage(payload) }
    : payload;

  try {
    const response = await fetchWithDeadline(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      return {
        sent: false,
        simulated: false,
        httpStatus: response.status,
        error: await response.text()
      };
    }

    return { sent: true, simulated: false, httpStatus: response.status };
  } catch (err) {
    return { sent: false, simulated: false, error: String(err) };
  }
}

async function sendPush(payload, env) {
  if (isTestMode(env)) {
    return { sent: true, simulated: true, httpStatus: null };
  }
  return await sendPushDirect(payload, env);
}

// ======================================================
// Phase 4.2：官方資料來源驗收（只讀、無副作用）
// ======================================================

const OFFICIAL_TEST_URLS = {
  twseProfile: "https://openapi.twse.com.tw/v1/opendata/t187ap03_L",
  tpexProfile: "https://www.tpex.org.tw/openapi/v1/mopsfin_t187ap03_O",
  twseRevenue: "https://openapi.twse.com.tw/v1/opendata/t187ap05_L",
  tpexRevenue: "https://www.tpex.org.tw/openapi/v1/mopsfin_t187ap05_O",
  twseProfit: "https://openapi.twse.com.tw/v1/opendata/t187ap17_L",
  tpexProfit: "https://www.tpex.org.tw/openapi/v1/mopsfin_187ap17_O",
  twseEps: "https://openapi.twse.com.tw/v1/opendata/t187ap14_L",
  tpexEps: "https://www.tpex.org.tw/openapi/v1/mopsfin_t187ap14_O",
  tpexInstitution: "https://www.tpex.org.tw/openapi/v1/tpex_3insti_daily_trading"
};

async function runOfficialDataTest(twseSymbol, tpexSymbol, dateYmd) {
  const twseInstitutionUrl =
    `https://www.twse.com.tw/rwd/zh/fund/T86?response=json&date=${encodeURIComponent(dateYmd)}&selectType=ALL`;

  const entries = [
    ["twseProfile", OFFICIAL_TEST_URLS.twseProfile],
    ["tpexProfile", OFFICIAL_TEST_URLS.tpexProfile],
    ["twseRevenue", OFFICIAL_TEST_URLS.twseRevenue],
    ["tpexRevenue", OFFICIAL_TEST_URLS.tpexRevenue],
    ["twseProfit", OFFICIAL_TEST_URLS.twseProfit],
    ["tpexProfit", OFFICIAL_TEST_URLS.tpexProfit],
    ["twseEps", OFFICIAL_TEST_URLS.twseEps],
    ["tpexEps", OFFICIAL_TEST_URLS.tpexEps],
    ["tpexInstitution", OFFICIAL_TEST_URLS.tpexInstitution],
    ["twseInstitution", twseInstitutionUrl]
  ];

  const settled = await Promise.all(entries.map(async ([name, url]) => {
    try {
      const response = await fetchWithDeadline(url, {
        headers: {
          accept: "application/json,text/plain,*/*",
          "user-agent": "Mozilla/5.0 V7-Official-Data-Test"
        }
      });
      const text = await response.text();
      let payload = null;
      try { payload = JSON.parse(text); } catch (_) { payload = null; }
      if (!response.ok) {
        return [name, { ok: false, httpStatus: response.status, error: text.slice(0, 500) }];
      }
      if (payload === null) {
        return [name, { ok: false, httpStatus: response.status, error: "回傳不是 JSON", preview: text.slice(0, 500) }];
      }
      return [name, summarizeOfficialPayload(name, payload, twseSymbol, tpexSymbol)];
    } catch (err) {
      return [name, { ok: false, error: String(err) }];
    }
  }));

  const sourceMap = Object.fromEntries(settled);
  const allOk = Object.values(sourceMap).every(item =>
    item && typeof item === "object" && item.ok !== false
  );

  return {
    version: VERSION,
    ok: allOk,
    fetchedAt: taiwanTime(),
    requested: { twseSymbol, tpexSymbol, institutionalDate: dateYmd },
    calls: entries.length,
    sources: sourceMap
  };
}

function summarizeOfficialPayload(name, payload, twseSymbol, tpexSymbol) {
  if (name === "twseInstitution") {
    const fields = Array.isArray(payload?.fields) ? payload.fields : [];
    const data = Array.isArray(payload?.data) ? payload.data : [];
    const codeIndex = fields.indexOf("證券代號");
    const row = codeIndex >= 0 ? data.find(item => String(item?.[codeIndex] || "").trim() === twseSymbol) : null;
    return {
      ok: String(payload?.stat || "").toUpperCase().includes("OK") || data.length > 0,
      stat: payload?.stat || null,
      date: payload?.date || null,
      rowCount: data.length,
      fields,
      sample: row ? Object.fromEntries(fields.map((field, index) => [field, row[index]])) : null
    };
  }

  const rows = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);
  const symbol = name.startsWith("twse") ? twseSymbol : tpexSymbol;
  const sample = rows.find(row => officialRowSymbol(row) === symbol) || null;
  return {
    ok: true,
    rowCount: rows.length,
    sample,
    sampleKeys: sample && typeof sample === "object" ? Object.keys(sample) : []
  };
}

function parseOfficialCsv(input) {
  const text = String(input).replace(/^\uFEFF/, "");
  const records = []; let row = [], cell = "", quoted = false;
  for (let i=0;i<text.length;i++) {
    const ch=text[i];
    if (ch==='"') {
      if (quoted && text[i+1]==='"') {cell+='"';i++;} else quoted=!quoted;
    } else if (!quoted && ch===',') {row.push(cell);cell="";}
    else if (!quoted && ch==='\n') {row.push(cell.replace(/\r$/, ""));if(row.some(x=>x!==""))records.push(row);row=[];cell="";}
    else cell+=ch;
  }
  if (quoted) throw new Error("官方CSV引號不完整");
  if (cell || row.length) {row.push(cell.replace(/\r$/, ""));records.push(row);}
  const fields=records.shift() || [];
  if (fields.length<4 || !fields.includes("公司代號") || new Set(fields).size!==fields.length) throw new Error("官方CSV欄位不符，不接受HTML或未知格式");
  if (records.some(item=>item.length!==fields.length)) throw new Error("官方CSV列欄數不一致");
  return records.map(item=>Object.fromEntries(fields.map((key,i)=>[key,item[i]])));
}

function officialRowSymbol(row) {
  if (!row || typeof row !== "object") return "";
  const direct = pick(row, [
    "公司代號", "證券代號", "股票代號", "Code", "code", "symbol",
    "SecuritiesCompanyCode", "SecuritiesCode", "SecurityCode", "CompanyCode"
  ]);
  if (direct !== null && direct !== undefined && direct !== "") {
    const candidate = String(direct).trim();
    if (/^[1-9][0-9]{3}$/.test(candidate)) return candidate;
  }

  for (const [key, value] of Object.entries(row)) {
    const normalized = String(key).replaceAll(" ", "").toLowerCase();
    if (
      normalized.includes("companycode") ||
      normalized.includes("securitycode") ||
      normalized.includes("securitiescompanycode") ||
      normalized.includes("股票代號") ||
      normalized.includes("證券代號") ||
      normalized.includes("公司代號")
    ) {
      const candidate = String(value ?? "").trim();
      if (/^[1-9][0-9]{3}$/.test(candidate)) return candidate;
    }
  }
  return "";
}

// ======================================================
// Phase 3：盤後全市場選股
// ======================================================

function isHistoryWarmupSchedule(controller) {
  const cron = String(controller?.cron || "").toLowerCase();
  return cron === "* 9 * * mon-fri" || cron === "*/5 9 * * mon-fri";
}

function isAfterMarketSchedule(controller) {
  if (String(controller?.cron || "").toLowerCase() === "10 10 * * mon-fri") return true;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Taipei", hour: "2-digit", minute: "2-digit", hour12: false
  }).formatToParts(new Date(controller?.scheduledTime || Date.now()));
  const value = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return Number(value.hour) >= 18;
}

async function runAfterMarketScan(env, scheduledTime = Date.now(), options = {}) {
  const requestedDate = taiwanDate(scheduledTime);
  try {
    const summary = await runAfterMarketScanCore(env, scheduledTime, options);
    if (!options.dryRun) await env.STOCKS_KV.put("V7_LAST_SCAN_ATTEMPT", JSON.stringify({
      status: "SUCCESS", requestedDate, scanDate: summary.scanDate, selectedCount: summary.selectedCount,
      generatedAt: summary.generatedAt, threeMin: summary.threeMin, dailyReport: summary.dailyReport
    }), { expirationTtl: 14 * 86400 });
    return summary;
  } catch (err) {
    if (!options.dryRun && env.STOCKS_KV) {
      const previous = await env.STOCKS_KV.get("V7_LAST_SCAN_ATTEMPT", "json");
      const alert = previous?.requestedDate === requestedDate && previous?.failureAlert?.sent === true
        ? previous.failureAlert : await sendPush({ type: "SYSTEM_ALERT", title: "V7盤後分析失敗，尚未產生新標的",
          message: `${String(err).slice(0, 500)}\n這不是今日0檔；舊結果不可當作最新推薦。\n監控：https://fugle-test.imihan0630.workers.dev/`, time: taiwanTime() }, env);
      await env.STOCKS_KV.put("V7_LAST_SCAN_ATTEMPT", JSON.stringify({status:"FAILED", requestedDate,
        generatedAt:taiwanTime(), error:String(err).slice(0, 1500), failureAlert:alert}), { expirationTtl:14 * 86400 });
    }
    throw err;
  }
}

async function runAfterMarketScanCore(env, scheduledTime = Date.now(), options = {}) {
  if (!env.STOCKS_KV) throw new Error("找不到 STOCKS_KV Binding");

  const dryRun = options?.dryRun === true;
  const requestedDate = taiwanDate(scheduledTime);
  await loadTradingCalendar(env, Number(requestedDate.slice(0, 4)));
  if (requestedDate.slice(5) >= "12-31") await loadTradingCalendar(env, Number(requestedDate.slice(0, 4)) + 1);
  const requestedMarketDate = mostRecentWeekday(requestedDate);

  // 7.4.4：市場官方端點若暫時 52x（尤其 TPEx 526），不得讓整個盤後掃描直接失敗。
  // 先嘗試官方盤後 API；任何一邊失敗後，再用已完成的 D1/Fugle 日K底庫＋官方 profile 重建同交易日盤後列。
  const marketFetchResults = await Promise.allSettled([
    fetchClosingRowsWithFallback(env, "TWSE", requestedMarketDate),
    fetchClosingRowsWithFallback(env, "TPEx", requestedMarketDate)
  ]);

  const enrichment = await fetchEnrichment(env, requestedMarketDate);
  const marketDate = requestedMarketDate;
  const cachedHistory = await readHistoryCache(env, HISTORY_CACHE_TARGET + 400);
  const previous = await retryTransient(
    "讀取 V7_MARKET_STATE",
    () => env.STOCKS_KV.get(MARKET_STATE_KEY, "json"),
    3
  ) || { stocks: {} };

  const marketSourceMeta = {};
  const resolveMarketRows = (result, market) => {
    if (result.status === "fulfilled") {
      marketSourceMeta[market] = { source: result.value.source || "OFFICIAL_API", marketDate, fallback: false, count: result.value.length, error: null };
      return result.value;
    }

    const fallbackRows = buildMarketRowsFromHistoryCache(
      market,
      marketDate,
      cachedHistory,
      enrichment,
      previous
    );
    const minFallback = market === "TWSE" ? 600 : 450;
    if (fallbackRows.length < minFallback) {
      const cacheCount = Object.keys(cachedHistory || {}).length;
      const marketExtraCount = Object.values(enrichment?.stocks || {}).filter(item => String(item?.market || "") === market).length;
      const officialProfileCount = Number(enrichment?.meta?.officialMarketCounts?.[market] || 0);
      const marketOldCount = Object.values(previous?.stocks || {}).filter(item => String(item?.market || "") === market).length;
      const datedBars = Object.values(cachedHistory || {}).filter(history =>
        Array.isArray(history) && history.some(item => String(item?.date || "") === String(marketDate))
      ).length;
      throw new Error(`${market}盤後資料官方API失敗，且D1歷史底庫回補不足(${fallbackRows.length})；D1快取=${cacheCount}、${market}合併資料=${marketExtraCount}、${market}官方Profile=${officialProfileCount}、舊市場標記=${marketOldCount}、同日K=${datedBars}：${String(result.reason)}`);
    }
    marketSourceMeta[market] = {
      source: "D1_FUGLE_HISTORY_FALLBACK",
      fallback: true,
      count: fallbackRows.length,
      error: String(result.reason)
    };
    return fallbackRows;
  };

  const twseRows = resolveMarketRows(marketFetchResults[0], "TWSE");
  const tpexRows = resolveMarketRows(marketFetchResults[1], "TPEx");
  const rawRows = [...twseRows, ...tpexRows];

  // 7.2.9 修正：法人連買必須在 mergeEnrichment() 之前合併。
  // 7.2.8 原本先建立 rows，之後才把法人 streak 寫進 enrichment，
  // 因此 rows / marketState 永遠拿不到 foreignBuyDays / trustBuyDays / dealerBuyDays，
  // 診斷才會出現 institutionHistory ready=true 但個股 institutionHistoryDays=0。
  const institutionHistory = await readInstitutionStreakMap(env, marketDate);
  enrichment.stocks ||= {};
  for (const [symbol, streak] of Object.entries(institutionHistory.stocks || {})) {
    if (!enrichment.stocks[symbol]) enrichment.stocks[symbol] = { symbol };
    Object.assign(enrichment.stocks[symbol], streak);
  }

  const rows = mergeEnrichment(rawRows, enrichment);
  const loadedConfig = await loadStockConfig(env);
  const currentSymbols = new Set((loadedConfig.stocks || []).map(item => item.symbol));

  enrichment.history = { ...cachedHistory, ...(enrichment.history || {}) };
  // Free Workers 每次只有很小的 CPU 預算；18:10 不再臨時額外暖機。
  // 歷史日K統一由 17:00-17:59 的 seed-lite 排程分批完成。
  const warmupTargets = [];
  const warmup = { history: {}, fetched: 0, failed: 0 };

  const marketState = updateMarketState(previous, rows, enrichment, marketDate);
  const storedBudget = await env.STOCKS_KV.get(KV_KEY, "json");
  const totalCapital = positiveNumber(storedBudget?.totalCapital) || positiveNumber(env.V7_TOTAL_CAPITAL) || DEFAULT_TOTAL_CAPITAL;
  const scan = selectTomorrowCandidates(marketState, rows, { ...env, V7_TOTAL_CAPITAL: totalCapital }, marketDate);
  if (!scan.diagnostics.with60Days) throw new Error("DATA_INCOMPLETE：沒有可用60日日K，不能把資料缺失回報為今日0檔");
  for (const market of ["TWSE", "TPEx"]) {
    const marketStocks = rows.filter(row => row.market === market);
    if (!marketStocks.some(row => positiveNumber(row.marketCapYi)) || !marketStocks.some(row => financialDataCount(row) >= 3)) {
      throw new Error(`DATA_INCOMPLETE：${market}市值/基本面整批缺失，不能當作正常全市場選股`);
    }
  }
  const stocks = validateStocks(scan.candidates);
  if (!dryRun && (loadedConfig.stocks || []).some(stock => stock.positionStage !== "NONE")) {
    throw new Error("OPEN_POSITION_PROTECTED：仍有持倉，不得用新選股覆蓋實際持股及原停損計畫；需先完成持倉對帳");
  }

  let saved = /** @type {any} */ ({ ok: false, dryRun });
  let bridge = /** @type {any} */ ({ sent: false, skipped: true, reason: dryRun ? "dry-run" : "not-run" });
  let report = /** @type {any} */ ({ sent: false, simulated: true, skipped: dryRun });

  if (!dryRun) {
    // 7.4.5：完整 1,800+ 檔 × 65日 history 已由 D1 保存，不能再整包塞進單一 KV value。
    // KV 只保存當日精簡市場狀態；隔日 60日歷史一律由 D1 v7_history_cache 讀回。
    const compactState = compactMarketStateForKv(marketState);
    await env.STOCKS_KV.put(MARKET_STATE_KEY, JSON.stringify(compactState));
    saved = await saveStockConfig(env, stocks, "Phase 4.3 A/B Strategy Rebase After-market Scan", totalCapital);
    bridge = await sendTo3Min({
      planDate: nextTradingDate(marketDate),
      totalCapital,
      stocks: stocks.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        mode: stock.mode,
        sourcePool: stock.channel,
        buyLow: stock.buyLow,
        buyHigh: stock.buyHigh,
        breakout: stock.breakout,
        maxChase: stock.maxChase,
        stop: stock.stop,
        profitCheck: stock.profitCheck,
        capitalWeight: stock.allocationRatio,
        firstTrancheWeight: stock.totalAllocation ? round(stock.firstAmount / stock.totalAllocation * 100, 1) : 0,
        secondTrancheWeight: stock.totalAllocation ? round(stock.secondAmount / stock.totalAllocation * 100, 1) : 0,
        firstEntryCondition: stock.firstCondition,
        secondEntryCondition: stock.secondCondition,
        priorityScore: stock.priorityScore
      }))
    }, env);
    const reportKey = `V7_DAILY_REPORT:${marketDate}`;
    const previousReport = await env.STOCKS_KV.get(reportKey, "json");
    const dailyPayload = buildDailySelectionPayload(marketDate, stocks, scan.diagnostics);
    report = previousReport?.sent === true && Boolean(previousReport.simulated) === isTestMode(env) ? { ...previousReport, deduplicated: true }
      : await sendPush(dailyPayload, env);
    if (report.sent) await env.STOCKS_KV.put(reportKey, JSON.stringify(report), { expirationTtl: 14 * 86400 });
  }

  const historySeedState = await readHistorySeedState(env);
  const historyTarget = Math.min(HISTORY_CACHE_TARGET, rows.filter(row => row.close >= MIN_CLOSE_PRICE).length);
  const historyResolved = historySeedState?.marketDate === marketDate
    ? Math.max(0, Number(historySeedState?.resolvedCount || 0))
    : 0;
  const historyInsufficient = historySeedState?.marketDate === marketDate
    ? (historySeedState?.insufficientSymbols || []).length
    : 0;

  const summary = {
    version: VERSION,
    dryRun,
    scheduledTime,
    generatedAt: taiwanTime(),
    requestedDate,
    scanDate: marketDate,
    status: stocks.length ? `今日選出 ${stocks.length} 檔；非千金股 ${scan.diagnostics?.finalPoolMerge?.finalGeneralSelected || 0}/3、千金股 ${scan.diagnostics?.finalPoolMerge?.finalThousandSelected || 0}/3；空缺不跨池補位` : `今日 0 檔，維持現金；非千金股 0/3、千金股 0/3`,
    market: { twse: twseRows.length, tpex: tpexRows.length, ordinaryStocks: rows.length },
    selectedCount: stocks.length,
    totalCapital,
    capitalPlan: {
      totalCapital,
      plannedInvestment: stocks.reduce((sum, stock) => sum + (toNumber(stock.totalAllocation) || 0), 0),
      remainingCash: Math.max(0, totalCapital - stocks.reduce((sum, stock) => sum + (toNumber(stock.totalAllocation) || 0), 0)),
      firstTrancheTotal: stocks.reduce((sum, stock) => sum + (toNumber(stock.firstAmount) || 0), 0),
      secondTrancheTotal: stocks.reduce((sum, stock) => sum + (toNumber(stock.secondAmount) || 0), 0),
      rule: "總資金預設20萬；依priorityScore動態分配；第一筆60%/第二筆40%；3檔以上最多動用約85%；單股最多35%；未用資金保留現金"
    },
    stocks,
    thousandStockPool: scan.thousandStockPool || null,
    diagnostics: {
      ...scan.diagnostics,
      enrichmentAvailable: enrichment.available,
      enrichmentStocks: Object.keys(enrichment.stocks || {}).length,
      officialSources: enrichment.meta?.sources || {},
      marketSources: marketSourceMeta,
      institutionHistory: {
        ready: institutionHistory.ready,
        snapshotCount: institutionHistory.snapshotCount,
        completeSnapshotCount: institutionHistory.completeSnapshotCount,
        validDates: institutionHistory.validDates,
        partialDates: institutionHistory.partialDates,
        snapshotCounts: institutionHistory.snapshotCounts
      },
      historyCacheCount: Object.keys(cachedHistory || {}).length,
      historyCacheReadMode: "D1_KEYSET_PAGED_100",
      historyCacheTarget: historyTarget,
      history60DayCount: Number(scan.diagnostics?.with60Days || 0),
      historyWarmupResolved: historyResolved,
      historyInsufficientCount: historyInsufficient,
      historyCoverageComplete: historyTarget > 0 && historyResolved >= historyTarget,
      warmupRequested: warmupTargets.length,
      warmupFetched: warmup.fetched,
      warmupFailed: warmup.failed,
      historySeedSymbols: Object.keys(enrichment.history || {}).length
    },
    config: { saved: saved.ok === true, verified: saved.verified === true, dryRun, updatedAt: saved.updatedAt || null },
    threeMin: bridge,
    dailyReport: report,
    pipeline: {
      scope: "資料選股、匯入與通知傳輸驗證；不代表30條全部已實作或手機已收到",
      selectionCompleted: true,
      configAccepted: saved.ok === true,
      configVerified: saved.verified === true,
      threeMinAccepted: bridge.sent === true && bridge.simulated !== true,
      threeMinVerified: bridge.verified === true && bridge.simulated !== true,
      dailyReportAccepted: report.sent === true && report.simulated !== true,
      complete: !dryRun && saved.verified === true && bridge.verified === true && bridge.simulated !== true && report.sent === true && report.simulated !== true
    }
  };

  if (!dryRun) {
    await env.STOCKS_KV.put(LAST_SCAN_KEY, JSON.stringify(summary), {
      expirationTtl: 14 * 24 * 60 * 60
    });
  }
  return summary;
}

function buildPublicRecommendations(latest, attempt = null) {
  const stocks = Array.isArray(latest?.stocks) ? latest.stocks : [];
  const thousand = latest?.thousandStockPool || null;
  const modeLabel = stock =>
    stock?.channel === "A" || stock?.mode === "PULLBACK" ? "A拉回承接" :
    stock?.channel === "B" || stock?.mode === "MOMENTUM" ? "B突破後承接" :
    stock?.mode || stock?.channel || null;

  return {
    ok: attempt?.status !== "FAILED" && !!latest,
    attempt: attempt ? { status: attempt.status, requestedDate: attempt.requestedDate, generatedAt: attempt.generatedAt } : null,
    isCurrent: latest?.scanDate === mostRecentWeekday(taiwanDate()) && attempt?.status !== "FAILED",
    resultType: attempt?.status === "FAILED" ? "SCAN_FAILED" : !latest ? "NOT_SCANNED" : latest.scanDate !== mostRecentWeekday(taiwanDate()) ? "HISTORICAL" : "CURRENT",
    version: latest?.version || VERSION,
    generatedAt: latest?.generatedAt || null,
    scanDate: latest?.scanDate || null,
    status: attempt?.status === "FAILED" ? "盤後分析失敗；以下僅為上次成功結果，不是最新推薦"
      : !latest ? "尚無成功盤後分析紀錄" : latest.scanDate !== mostRecentWeekday(taiwanDate()) ? "歷史盤後結果，不是今日推薦"
      : latest.status || (stocks.length ? `今日選出 ${stocks.length} 檔` : "今日0檔，不硬塞"),
    selectedCount: stocks.length,
    pipeline: latest?.pipeline || { complete: false, reason: "舊版本未記錄全鏈路驗證，不能推定已完成" },
    totalCapital: toNumber(latest?.totalCapital) || DEFAULT_TOTAL_CAPITAL,
    capitalPlan: latest?.capitalPlan || {
      totalCapital: DEFAULT_TOTAL_CAPITAL,
      plannedInvestment: stocks.reduce((sum, stock) => sum + (toNumber(stock?.totalAllocation) || 0), 0),
      remainingCash: Math.max(0, DEFAULT_TOTAL_CAPITAL - stocks.reduce((sum, stock) => sum + (toNumber(stock?.totalAllocation) || 0), 0))
    },
    stocks: stocks.map(stock => ({
      symbol: String(stock?.symbol || stock?.code || ""),
      name: stock?.name || "",
      strategy: modeLabel(stock),
      signalLevel: stock?.signalLevel || null,
      buyLow: toNumber(stock?.buyLow),
      buyHigh: toNumber(stock?.buyHigh),
      breakout: toNumber(stock?.breakout),
      stop: toNumber(stock?.stop),
      profitCheck: toNumber(stock?.profitCheck),
      rewardRisk: toNumber(stock?.rewardRisk),
      priorityScore: toNumber(stock?.priorityScore),
      allocationRatio: toNumber(stock?.allocationRatio),
      totalAllocation: toNumber(stock?.totalAllocation),
      firstAmount: toNumber(stock?.firstAmount),
      secondAmount: toNumber(stock?.secondAmount),
      firstShares: toNumber(stock?.firstShares),
      secondShares: toNumber(stock?.secondShares),
      totalShares: toNumber(stock?.totalShares),
      selectedReason: stock?.selectedReason || null
    })),
    thousandStockPool: thousand ? {
      poolCount: Number(thousand.poolCount || 0),
      selectedCount: Number(thousand.selectedCount || 0),
      shortlist: Array.isArray(thousand.shortlist)
        ? thousand.shortlist.slice(0, 6).map(item => ({
            symbol: String(item?.symbol || item?.code || ""),
            name: item?.name || "",
            strategy: modeLabel(item),
            signalLevel: item?.signalLevel || null,
            rewardRisk: toNumber(item?.rewardRisk),
            priorityScore: toNumber(item?.priorityScore)
          }))
        : []
    } : null
  };
}

function featureRowsCoverageComplete(diagnostics, rows) {
  const target = Math.min(HISTORY_CACHE_TARGET, (rows || []).filter(row => row && row.close >= MIN_CLOSE_PRICE).length);
  return Number(diagnostics?.with60Days || 0) >= target;
}

async function fetchClosingRowsWithFallback(env, market, expectedDate) {
  const primary = market === "TWSE" ? env.TWSE_DAILY_URL || TWSE_DAILY_URL : env.TPEX_DAILY_URL || TPEX_DAILY_URL;
  try { return await fetchMarketRows(primary, market, expectedDate); }
  catch (err) {
    if (market !== "TPEx") throw err;
    const dated = `https://www.tpex.org.tw/www/zh-tw/afterTrading/dailyQuotes?date=${encodeURIComponent(expectedDate.replaceAll("-", "/"))}&id=&response=json`;
    const rows = await fetchMarketRows(dated, market, expectedDate);
    rows.source = "TPEX_OFFICIAL_DATED_API";
    return rows;
  }
}

function normalizeMarketDate(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length === 7) return `${Number(digits.slice(0, 3)) + 1911}-${digits.slice(3, 5)}-${digits.slice(5, 7)}`;
  if (digits.length === 8) return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  return null;
}

async function fetchMarketRows(url, market, expectedDate = null) {
  const payload = await fetchJsonWithRetry(
    url,
    { redirect: "manual", headers: { accept: "application/json", "user-agent": "Mozilla/5.0 V7-Market-Scan" } },
    `${market}盤後資料`,
    4
  );
  const table = payload?.tables?.find(item => Array.isArray(item.fields) && Array.isArray(item.data) && item.fields.includes("代號"));
  const source = Array.isArray(payload) ? payload : table
    ? table.data.map(values => Object.fromEntries(table.fields.map((field, index) => [field, values[index]]))) : payload?.data;
  if (!Array.isArray(source)) throw new Error(`${market}盤後資料格式不是陣列`);
  const payloadDate = normalizeMarketDate(payload?.date || table?.date);
  const rows = source.map(row => {
    const date = normalizeMarketDate(row.Date || row.date) || payloadDate;
    if (expectedDate && date !== expectedDate) throw new Error(`${market}盤後資料日期${date || "缺失"}，預期${expectedDate}`);
    const normalized = normalizeMarketRow(row, market);
    return normalized ? { ...normalized, closeDate: date } : null;
  }).filter(Boolean);
  const minimum = market === "TWSE" ? 600 : 450;
  if (rows.length < minimum) throw new Error(`${market}正式盤後資料不足：${rows.length}/${minimum}`);
  return rows;
}

function buildMarketRowsFromHistoryCache(market, marketDate, cachedHistory, enrichment, previous) {
  const out = [];
  const extras = enrichment?.stocks || {};
  const oldStocks = previous?.stocks || {};

  // 7.4.6：以歷史底庫為主迭代，避免 enrichment 某一來源暫時缺列就讓 fallback 整批消失。
  // 市場別優先用 enrichment profile；其次用上一版 market state。
  const allSymbols = new Set([
    ...Object.keys(cachedHistory || {}),
    ...Object.keys(extras || {}),
    ...Object.keys(oldStocks || {})
  ]);

  for (const symbol of allSymbols) {
    if (!/^[1-9][0-9]{3}$/.test(symbol)) continue;
    const extra = extras?.[symbol] || {};
    const old = oldStocks?.[symbol] || {};
    // 7.4.8：fallback 優先使用官方 profile 建立的 market map，禁止自訂 enrichment 覆蓋市場別。
    const officialMarket = enrichment?.meta?.officialMarketBySymbol?.[symbol] || "";
    let resolvedMarket = String(officialMarket || extra?.market || old?.market || "").trim();
    if (resolvedMarket === "OTC" || resolvedMarket === "TPEX") resolvedMarket = "TPEx";
    if (resolvedMarket === "上市") resolvedMarket = "TWSE";
    if (resolvedMarket !== market) continue;

    const history = Array.isArray(cachedHistory?.[symbol]) && cachedHistory[symbol].length
      ? cachedHistory[symbol]
      : (Array.isArray(old?.history) ? old.history : []);
    if (!history.length) continue;

    const sorted = [...history].sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
    const barIndex = sorted.findIndex(item => String(item?.date || "") === String(marketDate));
    if (barIndex < 0) continue;
    const bar = sorted[barIndex];
    const close = marketNumber(bar?.close);
    if (close === null || close < MIN_CLOSE_PRICE) continue;
    const prevClose = barIndex > 0 ? marketNumber(sorted[barIndex - 1]?.close) : null;
    const changePercent = prevClose && prevClose > 0 ? (close - prevClose) / prevClose * 100 : null;

    out.push({
      symbol,
      name: String(extra?.name || old?.name || symbol).trim(),
      market,
      close,
      open: marketNumber(bar?.open) ?? marketNumber(old?.open) ?? close,
      high: marketNumber(bar?.high) ?? close,
      low: marketNumber(bar?.low) ?? close,
      volumeShares: marketNumber(bar?.volumeShares) || 0,
      tradeValue: marketNumber(bar?.tradeValue) || 0,
      changePercent,
      industry: String(extra?.industry || old?.industry || "未分類").trim(),
      marketDataFallback: true
    });
  }

  return out;
}

function normalizeMarketRow(row, market) {
  const symbol = String(pick(row, ["Code", "SecuritiesCompanyCode", "SecuritiesCompanyCode ", "股票代號", "代號"]) || "").trim();
  const name = String(pick(row, ["Name", "CompanyName", "SecuritiesCompanyName", "股票名稱", "名稱"]) || symbol).trim();
  if (!/^[1-9][0-9]{3}$/.test(symbol)) return null;
  if (/(ETF|ETN|指數|權證|認購|認售|特別股|存託|-DR$)/i.test(name)) return null;

  const close = marketNumber(pick(row, ["ClosingPrice", "Close", "收盤價", "收盤"]));
  if (close === null || close < MIN_CLOSE_PRICE) return null;
  const open = marketNumber(pick(row, ["OpeningPrice", "Open", "開盤價", "開盤"]));
  const high = marketNumber(pick(row, ["HighestPrice", "High", "最高價", "最高"]));
  const low = marketNumber(pick(row, ["LowestPrice", "Low", "最低價", "最低"]));
  const volumeShares = marketNumber(pick(row, ["TradeVolume", "TradingShares", "成交股數", "成交量"])) || 0;
  const tradeValue = marketNumber(pick(row, ["TradeValue", "TransactionAmount", "成交金額", "成交金額(元)"])) || 0;
  const change = marketNumber(pick(row, ["Change", "ChangeAmount", "漲跌價差", "漲跌"]));
  const previousClose = change !== null ? close - change : null;
  const changePercent = previousClose && previousClose > 0 ? change / previousClose * 100 : null;

  return {
    symbol, name, market, close,
    open: open ?? close, high: high ?? close, low: low ?? close,
    volumeShares, tradeValue, changePercent,
    industry: String(pick(row, ["Industry", "industry", "產業", "產業別"]) || "未分類").trim()
  };
}

async function fetchEnrichment(env, scanDate) {
  const official = await fetchOfficialEnrichment(env, scanDate);

  let custom = { stocks: {}, history: {}, available: false };
  if (env.V7_ENRICHMENT_JSON) {
    custom = normalizeEnrichmentPayload(JSON.parse(env.V7_ENRICHMENT_JSON));
  } else if (env.V7_ENRICHMENT_API_URL) {
    const url = String(env.V7_ENRICHMENT_API_URL).replaceAll("{date}", scanDate);
    const headers = { accept: "application/json" };
    if (env.V7_ENRICHMENT_API_TOKEN) headers.authorization = `Bearer ${env.V7_ENRICHMENT_API_TOKEN}`;
    try {
      const payload = await fetchJsonWithRetry(url, { headers }, "自訂 enrichment API", 2);
      custom = normalizeEnrichmentPayload(payload);
    } catch (_) {
      // 自訂 enrichment 暫時失敗時，官方資料仍可繼續完成盤後掃描。
      custom = { stocks: {}, history: {}, available: false };
    }
  }

  // 7.4.8：官方公司基本資料的市場別是唯一權威來源。
  // 自訂 enrichment 可能帶有 market:"OTC"、空字串或其他命名；若直接 spread，
  // 會把官方 TPEx 覆蓋掉，導致 TPEx 盤後 API 失敗時 D1 fallback 誤判成 0 檔。
  const stocks = { ...official.stocks };
  const officialMarketBySymbol = {};
  for (const [symbol, item] of Object.entries(official.stocks || {})) {
    if (item?.market === "TWSE" || item?.market === "TPEx") {
      officialMarketBySymbol[symbol] = item.market;
    }
  }

  for (const [symbol, extra] of Object.entries(custom.stocks || {})) {
    const base = stocks[symbol] || {};
    const merged = { ...base, ...extra };
    if (officialMarketBySymbol[symbol]) {
      merged.market = officialMarketBySymbol[symbol];
    } else if (merged.market === "OTC" || merged.market === "TPEX" || merged.market === "TPEx") {
      merged.market = "TPEx";
    } else if (merged.market === "上市" || merged.market === "TWSE") {
      merged.market = "TWSE";
    }
    stocks[symbol] = merged;
  }

  return {
    stocks,
    history: { ...(official.history || {}), ...(custom.history || {}) },
    available: Object.keys(stocks).length > 0,
    meta: {
      ...(official.meta || {}),
      customAvailable: custom.available === true,
      officialMarketBySymbol,
      officialMarketCounts: {
        TWSE: Object.values(officialMarketBySymbol).filter(v => v === "TWSE").length,
        TPEx: Object.values(officialMarketBySymbol).filter(v => v === "TPEx").length
      }
    }
  };
}

async function fetchOfficialEnrichment(env, scanDate) {
  const dateYmd = String(scanDate).replaceAll("-", "");
  const twseInstitutionUrl =
    `https://www.twse.com.tw/rwd/zh/fund/T86?response=json&date=${encodeURIComponent(dateYmd)}&selectType=ALL`;

  const entries = [
    ["twseProfile", OFFICIAL_TEST_URLS.twseProfile],
    ["tpexProfile", OFFICIAL_TEST_URLS.tpexProfile],
    ["twseRevenue", OFFICIAL_TEST_URLS.twseRevenue],
    ["tpexRevenue", OFFICIAL_TEST_URLS.tpexRevenue],
    ["twseProfit", OFFICIAL_TEST_URLS.twseProfit],
    ["tpexProfit", OFFICIAL_TEST_URLS.tpexProfit],
    ["twseEps", OFFICIAL_TEST_URLS.twseEps],
    ["tpexEps", OFFICIAL_TEST_URLS.tpexEps],
    ["tpexInstitution", OFFICIAL_TEST_URLS.tpexInstitution],
    ["twseInstitution", twseInstitutionUrl]
  ];

  const settled = [];
  // 分批最多4條，避免官方10來源再加市場資料時把連線壓在同一瞬間。
  for (let i = 0; i < entries.length; i += 4) {
    const batch = entries.slice(i, i + 4);
    const part = await Promise.all(batch.map(async ([name, url]) => {
      try {
        const payload = await fetchJsonWithRetry(
          url,
          { redirect:"manual", headers: { accept: "application/json,text/plain,*/*", "user-agent": "Mozilla/5.0 V7-Official-Live" } },
          `官方來源 ${name}`,
          2
        );
        if (name === "twseInstitution") {
          const fields = Array.isArray(payload?.fields) ? payload.fields : [];
          const data = Array.isArray(payload?.data) ? payload.data : [];
          if (!fields.length || !data.length || normalizeTwseDate(payload?.date) !== scanDate) throw new Error("上市法人資料缺失或非指定交易日");
          const rows = data.map(item => Object.fromEntries(fields.map((field, j) => [field, item[j]])));
          return [name, { ok: true, rows, date: normalizeTwseDate(payload?.date || dateYmd) }];
        }
        const rows = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);
        if (!rows.length) throw new Error("官方來源沒有有效資料列");
        if (name === "tpexInstitution" && rows.some(row => normalizeMarketDate(row.Date || row.date) !== scanDate)) throw new Error("上櫃法人資料不是指定交易日");
        return [name, { ok: true, rows }];
      } catch (err) {
        const dataset = {twseProfile:"t187ap03_L",tpexProfile:"t187ap03_O",twseRevenue:"t187ap05_L",tpexRevenue:"t187ap05_O",twseEps:"t187ap14_L",tpexEps:"t187ap14_O",twseProfit:"t187ap17_L",tpexProfit:"t187ap17_O"}[name];
        if (dataset) {
          try {
            const response = await fetchWithDeadline(`https://mopsfin.twse.com.tw/opendata/${dataset}.csv`, {redirect:"manual"});
            if (!response.ok) throw new Error(`官方CSV HTTP ${response.status}`);
            const rows = parseOfficialCsv(await response.text());
            const count = rows.filter(row => officialRowSymbol(row)).length;
            if (count < 500) throw new Error(`官方CSV有效公司不足(${count})`);
            const exportDate = normalizeMarketDate(rows[0]?.["出表日期"]);
            if (!exportDate || exportDate > scanDate || exportDate < shiftDateString(scanDate,-7)) throw new Error("官方CSV出表日期缺失、未來或過舊");
            return [name,{ok:true,rows,fallback:"MOPS_OFFICIAL_CSV",exportDate,originalError:String(err).slice(0,300)}];
          } catch (_) {}
        }
        return [name, { ok: false, rows: [], error: String(err) }];
      }
    }));
    settled.push(...part);
  }

  const source = Object.fromEntries(settled);

  // 7.4.2：TWSE T86 偶爾會回 307/安全頁。若 D1 已有該交易日完整法人快照，
  // 直接用 D1 官方快照補回，避免把上市法人當成 0。
  if ((source.twseInstitution?.ok !== true || source.tpexInstitution?.ok !== true) && env?.V7_DB) {
    try {
      const snapshotRows = await readInstitutionSnapshotRows(env, scanDate, 10);
      const exact = snapshotRows.find(row => String(row.market_date || "") === String(scanDate));
      if (exact && isCompleteInstitutionSnapshotRow(exact)) {
        const snapshot = JSON.parse(exact.snapshot_json || "{}");
        const rows = Object.entries(snapshot).map(([symbol, item]) => ({
          "證券代號": symbol,
          "外陸資買賣超股數(不含外資自營商)": toNumber(item?.foreignNet) || 0,
          "外資自營商買賣超股數": 0,
          "投信買賣超股數": toNumber(item?.trustNet) || 0,
          "自營商買賣超股數": toNumber(item?.dealerNet) || 0,
          "三大法人買賣超股數": toNumber(item?.institutionTotalNet) || 0
        }));
        if (source.twseInstitution?.ok !== true) source.twseInstitution = {
          ok: true,
          rows,
          date: String(scanDate),
          fallback: "D1_OFFICIAL_SNAPSHOT",
          originalError: source.twseInstitution?.error || null
        };
        if (source.tpexInstitution?.ok !== true) source.tpexInstitution = {
          ok:true,date:scanDate,fallback:"D1_OFFICIAL_SNAPSHOT",originalError:source.tpexInstitution?.error || null,
          rows:Object.entries(snapshot).map(([symbol,item])=>({Code:symbol,Date:scanDate,
            "ForeignInvestorsInclude MainlandAreaInvestors-Difference":toNumber(item?.foreignNet),
            "ForeignDealers-Difference":0,
            "SecuritiesInvestmentTrustCompanies-Difference":toNumber(item?.trustNet),
            "Dealers-Difference":toNumber(item?.dealerNet),TotalDifference:toNumber(item?.institutionTotalNet)}))
        };
      }
    } catch (_) {}
  }

  const maps = {};
  for (const [name, item] of Object.entries(source)) {
    maps[name] = new Map((item.rows || []).map(row => [officialRowSymbol(row), row]).filter(([symbol]) => symbol));
  }

  const symbols = new Set();
  for (const map of Object.values(maps)) for (const symbol of map.keys()) symbols.add(symbol);
  const stocks = {};

  for (const symbol of symbols) {
    const twse = maps.twseProfile.get(symbol) || null;
    const tpex = maps.tpexProfile.get(symbol) || null;
    const rev = maps.twseRevenue.get(symbol) || maps.tpexRevenue.get(symbol) || null;
    const profit = maps.twseProfit.get(symbol) || maps.tpexProfit.get(symbol) || null;
    const epsRow = maps.twseEps.get(symbol) || maps.tpexEps.get(symbol) || null;
    const instTwse = maps.twseInstitution.get(symbol) || null;
    const instTpex = maps.tpexInstitution.get(symbol) || null;

    // 7.4.6：市場別必須由公司基本資料/市場專屬財務來源判定，不能由法人快照判定。
    // D1 法人快照是 TWSE+TPEx 合併快照；若拿 instTwse 是否存在來判市場，
    // 會把上櫃股票誤判成 TWSE，造成 TPEx 官方盤後 API 失敗時 fallback 變成 0 檔。
    let isTwse;
    if (twse) {
      isTwse = true;
    } else if (tpex) {
      isTwse = false;
    } else {
      const hasTwseOnly = maps.twseRevenue.has(symbol) || maps.twseProfit.has(symbol) || maps.twseEps.has(symbol);
      const hasTpexOnly = maps.tpexRevenue.has(symbol) || maps.tpexProfit.has(symbol) || maps.tpexEps.has(symbol);
      isTwse = hasTwseOnly && !hasTpexOnly;
    }
    const sharesOutstanding = marketNumber(
      isTwse
        ? pick(twse, ["已發行普通股數或TDR原股發行股數", "已發行普通股數"])
        : pick(tpex, ["IssueShares", "已發行普通股數或TDR原股發行股數", "已發行普通股數"])
    );

    const foreignMain = isTwse
      ? marketNumber(pick(instTwse, ["外陸資買賣超股數(不含外資自營商)"]))
      : marketNumber(pick(instTpex, [
          "ForeignInvestorsInclude MainlandAreaInvestors-Difference",
          "Foreign Investors include Mainland Area Investors (Foreign Dealers excluded)-Difference"
        ]));
    const foreignDealer = isTwse
      ? marketNumber(pick(instTwse, ["外資自營商買賣超股數"]))
      : marketNumber(pick(instTpex, ["ForeignDealers-Difference"]));
    const foreignNet = foreignMain !== null || foreignDealer !== null ? (foreignMain ?? 0) + (foreignDealer ?? 0) : null;
    const trustNet = isTwse
      ? marketNumber(pick(instTwse, ["投信買賣超股數"]))
      : marketNumber(pick(instTpex, ["SecuritiesInvestmentTrustCompanies-Difference"]));
    const dealerNet = isTwse
      ? marketNumber(pick(instTwse, ["自營商買賣超股數"]))
      : marketNumber(pick(instTpex, ["Dealers-Difference"]));
    const institutionTotalNet = isTwse
      ? marketNumber(pick(instTwse, ["三大法人買賣超股數"]))
      : marketNumber(pick(instTpex, ["TotalDifference"]));

    const industry = String(
      pick(rev, ["產業別"]) || pick(epsRow, ["產業別"]) || pick(twse, ["產業別"]) ||
      pick(tpex, ["SecuritiesIndustryCode", "產業別"]) || "未分類"
    ).trim();

    const companyName = String(
      isTwse
        ? (pick(twse, ["公司簡稱", "公司名稱"]) || symbol)
        : (pick(tpex, ["CompanyAbbreviation", "CompanyName", "SecuritiesCompanyName", "公司簡稱", "公司名稱"]) || symbol)
    ).trim();

    stocks[symbol] = {
      symbol,
      name: companyName,
      market: isTwse ? "TWSE" : "TPEx",
      industry,
      industryCode: String(pick(twse, ["產業別"]) || pick(tpex, ["SecuritiesIndustryCode", "產業別"]) || "").trim(),
      sharesOutstanding,
      revenueMonth: marketNumber(pick(rev, ["營業收入-當月營收"])),
      revenueMoM: marketNumber(pick(rev, ["營業收入-上月比較增減(%)"])),
      revenueQoQ: null, // 月增率不是季增率；沒有季度營收時不得冒充QoQ。
      revenueYoY: marketNumber(pick(rev, ["營業收入-去年同月增減(%)"])),
      revenueYTDYoY: marketNumber(pick(rev, ["累計營業收入-前期比較增減(%)"])),
      grossMargin: marketNumber(pick(profit, ["毛利率(%)(營業毛利)/(營業收入)", "毛利率"])),
      operatingMargin: marketNumber(pick(profit, ["營業利益率(%)(營業利益)/(營業收入)", "營業利益率"])),
      netMargin: marketNumber(pick(profit, ["稅後純益率(%)(稅後純益)/(營業收入)", "稅後純益率"])),
      eps: marketNumber(pick(epsRow, ["基本每股盈餘(元)", "基本每股盈餘"])),
      financialYear: String(pick(epsRow, ["年度", "Year"]) || ""),
      financialQuarter: String(pick(epsRow, ["季別"]) || ""),
      foreignNet,
      trustNet,
      dealerNet,
      institutionTotalNet: institutionTotalNet ?? ([foreignNet,trustNet,dealerNet].some(value=>value!==null) ? (foreignNet ?? 0) + (trustNet ?? 0) + (dealerNet ?? 0) : null),
      institutionsAligned: foreignNet > 0 && (trustNet ?? 0) > 0 && (dealerNet ?? 0) > 0,
      institutionAnyBuy: foreignNet > 0 || (trustNet ?? 0) > 0 || (dealerNet ?? 0) > 0
    };
  }

  const sourceMeta = Object.fromEntries(Object.entries(source).map(([name, item]) => [name, {
    ok: item.ok === true,
    rowCount: item.rows?.length || 0,
    error: item.error || null,
    fallback: item.fallback || null,
    originalError: item.originalError || null
  }]));
  const asOfDate = source.twseInstitution?.date || scanDate;
  return { stocks, history: {}, available: Object.keys(stocks).length > 0, meta: { asOfDate, sources: sourceMeta } };
}

function normalizeTwseDate(value) {
  const text = String(value || "").replaceAll("-", "").trim();
  if (/^\d{8}$/.test(text)) return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}`;
  return null;
}

function normalizeEnrichmentPayload(payload) {
  const list = Array.isArray(payload) ? payload : (payload?.stocks || payload?.data || []);
  const stocks = {};
  for (const item of list) {
    const symbol = String(item.symbol || item.code || item["代號"] || "").trim();
    if (symbol) stocks[symbol] = item;
  }
  return { stocks, history: payload?.history || {}, available: list.length > 0 };
}

function mergeEnrichment(rows, enrichment) {
  return rows.map(row => {
    const extra = enrichment.stocks[row.symbol] || {};
    const sharesOutstanding = toNumber(extra.sharesOutstanding ?? extra["發行股數"]);
    const marketCapYi = toNumber(extra.marketCapYi ?? extra.marketCap100m ?? extra["市值_億"])
      ?? (sharesOutstanding ? sharesOutstanding * row.close / 1e8 : null);
    return {
      ...row,
      ...extra,
      symbol: row.symbol,
      name: row.name,
      market: row.market,
      close: row.close,
      open: row.open,
      high: row.high,
      low: row.low,
      volumeShares: row.volumeShares,
      tradeValue: row.tradeValue,
      changePercent: row.changePercent,
      industry: String(extra.industry || extra["產業"] || row.industry || "未分類"),
      marketCapYi
    };
  });
}

function updateMarketState(previous, rows, enrichment, scanDate) {
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
}

function compactMarketStateForKv(marketState) {
  const source = marketState?.stocks || {};
  const stocks = {};
  for (const [symbol, stock] of Object.entries(source)) {
    if (!stock || typeof stock !== "object") continue;
    const { history, ...rest } = stock;
    // 只留最後 3 根作人工/緊急 fallback；正式技術計算仍以 D1 60日底庫為準。
    const recentHistory = Array.isArray(history) ? history.slice(-3) : [];
    stocks[symbol] = { ...rest, history: recentHistory };
  }
  return {
    version: marketState?.version || 2,
    updatedAt: marketState?.updatedAt || new Date().toISOString(),
    lastDate: marketState?.lastDate || null,
    storage: "KV_COMPACT_D1_HISTORY_PRIMARY",
    stocks
  };
}

function selectTomorrowCandidates(marketState, todayRows, env, scanDate) {
  const rowMap = new Map(todayRows.map(row => [row.symbol, row]));
  let featureRows = Object.values(marketState.stocks)
    .filter(stock => rowMap.has(stock.symbol))
    .map(buildMarketFeatures)
    .filter(Boolean);

  const marketReturn20 = average(featureRows.map(row => row.ret20).filter(Number.isFinite));
  featureRows = featureRows.map(row => ({ ...row, marketReturn20 }));
  const sectorStats = buildTodaySectorStats(todayRows, featureRows);
  const diagnostics = {
    scanned: todayRows.length,
    with60Days: featureRows.filter(row => row.historyDays >= 60).length,
    missingEnrichment: featureRows.filter(row => row.marketCapYi === null).length,
    baseEligible: 0,
    rrEligible: 0,
    channelCounts: { A: 0, B: 0 },
    exclusions: {},
    marketReturn20: round(marketReturn20 || 0, 2),
    relativeStrengthBenchmark: "全市場普通股20日報酬等權代理，非實際大盤指數；千金池為池內同儕代理",
    requirements30: {complete:false, incompleteRules:[5,6,10,11,12,26,28,29], record:"REQUIREMENTS_30.md"},
    nearMisses: [],
    industryRadar: sectorStats,
    channelPolicy: {
      A: "拉回承接：多頭結構仍在＋拉回至技術支撐＋量縮/不放量殺低＋未破壞結構；隔日等15分K止跌轉強",
      B: "突破後承接：有效突破平台/前高＋量價確認＋收近高；隔日不追第一段，等回測突破位守住再由15分K確認"
    },
    note: "V7正式策略定義：A=拉回承接，B=突破後承接。18:10分成非千金股池與千金股池獨立篩選；每池最多3檔，未達標名額留空且不得跨池挪用，合計最多6檔。"
  };
  const scored = [];
  const basePoolDiagnostics = [];

  for (const f of featureRows) {
    const sector = sectorStats[f.industry] || { score: 0 };
    const result = scoreCandidate(f, sector);
    if (result.basePassed) {
      diagnostics.baseEligible += 1;
      basePoolDiagnostics.push({ f, sector });
    }
    if (result.rrPassed) diagnostics.rrEligible += 1;
    if (!result.ok) {
      diagnostics.exclusions[result.reason] = (diagnostics.exclusions[result.reason] || 0) + 1;
      if (String(result.reason).includes("A拉回承接/B突破後承接")) {
        diagnostics.nearMisses.push(buildChannelDebug(f, sector));
      }
      continue;
    }
    diagnostics.channelCounts[result.channel] += 1;
    scored.push(result);
  }

  const rankFn = (a, b) =>
    b.rewardPerRisk - a.rewardPerRisk || b.priorityScore - a.priorityScore ||
    b.setupQuality - a.setupQuality || b.sectorFlow - a.sectorFlow || b.relativeStrength - a.relativeStrength;

  scored.sort(rankFn);

  diagnostics.nearMisses = diagnostics.nearMisses
    .sort((a, b) => a.missingCount - b.missingCount || b.nearScore - a.nearScore)
    .slice(0, 12);
  diagnostics.conditionDistribution = buildConditionDistribution(basePoolDiagnostics, sectorStats);

  // ====================================================
  // 千金股專池：收盤價 >= 1,000 元，獨立再分析一次。
  // 使用相同 A/B、RR、風控與B級以上規則；只把RS基準改成千金股自身平均，
  // 讓「高價股彼此之間的相對強弱」可獨立排序。
  // 每池最多3檔；不保證名額、不硬塞，空缺不得讓另一池補位。
  // ====================================================
  const thousandMarketRows = todayRows.filter(row => (toNumber(row.close) || 0) >= THOUSAND_STOCK_PRICE);
  const thousandFeatureRowsRaw = featureRows.filter(row => (toNumber(row.close) || 0) >= THOUSAND_STOCK_PRICE);
  const thousandReturn20 = average(thousandFeatureRowsRaw.map(row => row.ret20).filter(Number.isFinite));
  const thousandFeatureRows = thousandFeatureRowsRaw.map(row => ({ ...row, marketReturn20: thousandReturn20 }));
  const thousandScored = [];
  const thousandExclusions = {};
  const thousandChannelCounts = { A: 0, B: 0 };
  let thousandBaseEligible = 0;
  let thousandRrEligible = 0;

  for (const f of thousandFeatureRows) {
    const sector = sectorStats[f.industry] || { score: 0 };
    const result = scoreCandidate(f, sector);
    if (result.basePassed) thousandBaseEligible += 1;
    if (result.rrPassed) thousandRrEligible += 1;
    if (!result.ok) {
      thousandExclusions[result.reason] = (thousandExclusions[result.reason] || 0) + 1;
      continue;
    }
    thousandChannelCounts[result.channel] += 1;
    thousandScored.push(result);
  }
  thousandScored.sort(rankFn);
  const thousandTop = thousandScored.slice(0, MAX_STOCKS_PER_POOL);

  // 7.5.4：兩個選股池各自保留最多3席，名額完全獨立。
  // 千金股不足3檔時空缺保留；非千金股不得補位。反之亦同。
  const generalTop = scored
    .filter(item => (toNumber(item.close) || 0) < THOUSAND_STOCK_PRICE)
    .slice(0, MAX_STOCKS_PER_POOL);
  const selected = [...generalTop, ...thousandTop].sort(rankFn);
  const finalSymbols = new Set(selected.map(item => item.symbol));

  diagnostics.thousandStockPool = {
    definition: `收盤價>=${THOUSAND_STOCK_PRICE}元之上市/上櫃普通股`,
    threshold: THOUSAND_STOCK_PRICE,
    poolCount: thousandMarketRows.length,
    featureCount: thousandFeatureRows.length,
    with60Days: thousandFeatureRows.filter(row => row.historyDays >= 60).length,
    baseEligible: thousandBaseEligible,
    rrEligible: thousandRrEligible,
    channelCounts: thousandChannelCounts,
    exclusions: thousandExclusions,
    marketReturn20: round(thousandReturn20 || 0, 2),
    selectedCount: thousandTop.length,
    shortlist: thousandTop.map((item, index) => buildIndependentPoolPreview(item, index + 1, finalSymbols)),
    policy: "千金股每天獨立分析；A=拉回承接、B=突破後承接；B級以下不列；0~3檔、不硬塞；千金股保留最多3席，空缺不得由非千金股補位。"
  };
  diagnostics.finalPoolMerge = {
    policy: "3+3獨立名額，不跨池補位",
    generalQuota: MAX_STOCKS_PER_POOL,
    thousandQuota: MAX_STOCKS_PER_POOL,
    generalCandidates: generalTop.length,
    thousandCandidates: thousandTop.length,
    finalSelected: selected.length,
    finalGeneralSelected: generalTop.length,
    finalThousandSelected: thousandTop.length,
    unusedGeneralSlots: MAX_STOCKS_PER_POOL - generalTop.length,
    unusedThousandSlots: MAX_STOCKS_PER_POOL - thousandTop.length
  };

  const totalCapital = positiveNumber(env.V7_TOTAL_CAPITAL) || DEFAULT_TOTAL_CAPITAL;
  return {
    candidates: allocateAndBuildPlans(selected, totalCapital, scanDate),
    diagnostics,
    thousandStockPool: diagnostics.thousandStockPool
  };
}

function buildIndependentPoolPreview(item, rank, finalSymbols = new Set()) {
  const isA = item.channel === "A";
  return {
    rank,
    symbol: item.symbol,
    name: item.name,
    close: round(item.close, 2),
    channel: item.channel,
    mode: isA ? "PULLBACK" : "MOMENTUM",
    signalLevel: item.signalLevel,
    setupQuality: round(item.setupQuality, 1),
    priorityScore: round(item.priorityScore, 1),
    rewardRisk: round(item.rewardRisk, 2),
    buyLow: round(item.planBuyLow, 2),
    buyHigh: round(item.planBuyHigh, 2),
    breakout: isA ? null : round(item.planBreakout || item.priorHigh20, 2),
    stop: round(item.stop, 2),
    profitCheck: round(item.target, 2),
    enteredFinalMonitor: finalSymbols.has(item.symbol),
    selectedReason: item.selectedReason
  };
}

function buildMarketFeatures(stock) {
  const history = Array.isArray(stock.history) ? stock.history.filter(item => toNumber(item.close) !== null) : [];
  if (!history.length) return null;
  const closes = history.map(item => Number(item.close));
  const highs = history.map(item => Number(item.high ?? item.close));
  const lows = history.map(item => Number(item.low ?? item.close));
  const opens = history.map(item => Number(item.open ?? item.close));
  const volumes = history.map(item => Number(item.volumeShares || 0));
  const amounts = history.map(item => Number(item.tradeValue || 0));
  const close = closes.at(-1);
  const open = opens.at(-1);
  const todayHigh = highs.at(-1);
  const todayLow = lows.at(-1);
  const ret20 = closes.length >= 21 ? (close / closes.at(-21) - 1) * 100 : null;
  const ret60 = closes.length >= 61 ? (close / closes.at(-61) - 1) * 100 : null;
  const ranges20 = history.slice(-20).map((item, idx, arr) => {
    const globalIndex = history.length - arr.length + idx;
    const prev = closes[Math.max(0, globalIndex - 1)] || item.close;
    return Math.max(item.high - item.low, Math.abs(item.high - prev), Math.abs(item.low - prev));
  });
  const atr20 = average(ranges20);
  const ma5 = average(closes.slice(-5));
  const ma10 = average(closes.slice(-10));
  const ma20 = average(closes.slice(-20));
  const ma60 = average(closes.slice(-60));
  const prevMa5 = average(closes.slice(-6, -1));
  const prevMa10 = average(closes.slice(-11, -1));
  const prevMa20 = average(closes.slice(-21, -1));
  const priorHigh20 = highs.length >= 21 ? Math.max(...highs.slice(-21, -1)) : Math.max(...highs.slice(0, -1));
  const priorLow20 = lows.length >= 21 ? Math.min(...lows.slice(-21, -1)) : Math.min(...lows.slice(0, -1));
  const priorHigh60 = highs.length >= 61 ? Math.max(...highs.slice(-61, -1)) : Math.max(...highs.slice(0, -1));
  const leftLow = lows.length >= 21 ? Math.min(...lows.slice(-21, -11)) : null;
  const rightLow = lows.length >= 11 ? Math.min(...lows.slice(-11, -1)) : null;
  const recentHigh10 = highs.length >= 11 ? Math.max(...highs.slice(-11, -1)) : Math.max(...highs.slice(0, -1));
  const recentLow5Prev = lows.length >= 6 ? Math.min(...lows.slice(-6, -1)) : Math.min(...lows.slice(0, -1));
  const todayVolume = volumes.at(-1) || 0;
  const prev5Volume = average(volumes.slice(-6, -1));
  const prev20Volume = average(volumes.slice(-21, -1));
  const platformRange20Pct = priorLow20 > 0 ? (priorHigh20 / priorLow20 - 1) * 100 : null;
  const maDistance20Pct = ma20 > 0 ? (close / ma20 - 1) * 100 : null;
  const bullishStack = ma5 > ma10 && ma10 > ma20;
  const justTurnBullish = ma5 > ma10 && ma10 >= ma20 * 0.995 && prevMa5 <= prevMa10;
  const lateStage = (ret20 ?? 0) > 35 || (maDistance20Pct ?? 0) > 25;
  const dayRange = Math.max(0, todayHigh - todayLow);
  const dailyClosePosition = dayRange > 0 ? (close - todayLow) / dayRange : 0.5;
  const dailyUpperShadowRatio = dayRange > 0 ? (todayHigh - Math.max(open, close)) / dayRange : 0;

  return {
    ...stock, historyDays: history.length, close, open, todayHigh, todayLow,
    ma5, ma10, ma20, ma60, prevMa5, prevMa10, prevMa20, bullishStack, justTurnBullish, lateStage,
    atrPercent: atr20 && close ? atr20 / close * 100 : null,
    avgVolume20Lots: average(volumes.slice(-20)) / 1000,
    avgAmount20: average(amounts.slice(-20)),
    volumeRatio: average(volumes.slice(-5)) / Math.max(1, average(volumes.slice(-20))),
    volumeTodayVsPrev5: todayVolume / Math.max(1, prev5Volume),
    volumeContraction5to20: prev5Volume / Math.max(1, prev20Volume),
    volatility20: standardDeviation(closes.slice(-20).map((value, i, all) => i ? (value / all[i - 1] - 1) * 100 : 0)),
    ret20, ret60,
    high20: Math.max(...highs.slice(-20)), low20: Math.min(...lows.slice(-20)),
    high60: Math.max(...highs.slice(-60)), low60: Math.min(...lows.slice(-60)),
    priorHigh20, priorLow20, priorHigh60, recentHigh10, recentLow5Prev,
    platformRange20Pct,
    rightFootHigher: leftLow !== null && rightLow !== null ? rightLow > leftLow : false,
    leftLow, rightLow,
    necklineProximityPct: priorHigh20 > 0 ? close / priorHigh20 * 100 : null,
    dailyClosePosition, dailyUpperShadowRatio,
    marketCapYi: toNumber(stock.marketCapYi),
    foreignBuyDays: toNumber(stock.foreignBuyDays) ?? consecutivePositiveDays(history, "foreignNet"),
    trustBuyDays: toNumber(stock.trustBuyDays) ?? consecutivePositiveDays(history, "trustNet"),
    dealerBuyDays: toNumber(stock.dealerBuyDays) ?? consecutivePositiveDays(history, "dealerNet"),
    institutionHistoryDays: toNumber(stock.institutionHistoryDays) || 0,
    institutionsAligned: toNumber(stock.foreignNet) > 0 && toNumber(stock.trustNet) > 0 && toNumber(stock.dealerNet) > 0
  };
}

function buildTodaySectorStats(rows, features = []) {
  const featureMap = new Map(features.map(item => [item.symbol, item]));
  const groups = {};
  for (const row of rows) {
    const key = row.industry || "未分類";
    (groups[key] ||= []).push(row);
  }
  const raw = Object.entries(groups).map(([industry, items]) => {
    const amount = items.reduce((sum, row) => sum + (row.tradeValue || 0), 0);
    const breadth = items.length ? items.filter(row => (row.changePercent || 0) > 0).length / items.length * 100 : 0;
    const avgChange = average(items.map(row => row.changePercent).filter(Number.isFinite));
    const ready = items.map(item => ({ item, feature: featureMap.get(item.symbol) })).filter(pair => pair.feature?.historyDays >= 20);
    const avgAmount20 = ready.reduce((sum, pair) => sum + (pair.feature.avgAmount20 || 0), 0);
    const avgVolume20 = ready.reduce((sum, pair) => sum + (pair.feature.avgVolume20Lots || 0) * 1000, 0);
    const coveredAmount = ready.reduce((sum, pair) => sum + (pair.item.tradeValue || 0), 0);
    const coveredVolume = ready.reduce((sum, pair) => sum + (pair.item.volumeShares || 0), 0);
    return { industry, score: 0, amount, breadth, avgChange,
      historicalCoverage: ready.length, stockCount: items.length,
      amountVs20DayAverage: avgAmount20 > 0 ? coveredAmount / avgAmount20 : null,
      volumeVs20DayAverage: avgVolume20 > 0 ? coveredVolume / avgVolume20 : null,
      institutionalNetValueEstimate: items.some(row => toNumber(row.institutionTotalNet) !== null)
        ? items.reduce((sum, row) => sum + (toNumber(row.institutionTotalNet) || 0) * row.close, 0) : null,
      flowDefinition: "成交金額/廣度/量能為資金活躍度；法人淨買超乘收盤價僅為估算，不是真實全市場資金淨流入",
      leaders: [...items].sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0)).slice(0, 3)
        .map(row => ({ symbol: row.symbol, name: row.name, changePercent: row.changePercent, tradeValue: row.tradeValue })) };
  });
  const maxAmount = Math.max(1, ...raw.map(item => item.amount));
  const output = {};
  for (const item of raw) {
    item.score = clamp(item.amount / maxAmount * 45 + item.breadth * 0.3 + clamp((item.avgChange || 0) * 5 + 15, 0, 25), 0, 100);
    output[item.industry] = item;
  }
  return output;
}

function buildConditionDistribution(baseItems, sectorStats) {
  const items = Array.isArray(baseItems) ? baseItems : [];
  const baseCount = items.length;
  const pct = count => baseCount ? round(count / baseCount * 100, 1) : 0;
  const aDefs = [
    ["trend", "A多頭結構仍在", ({ f }) => strategySetupState(f).A.checks.trend],
    ["pullback", "A已形成合理拉回2~15%", ({ f }) => strategySetupState(f).A.checks.pullback],
    ["nearSupport", "A接近技術支撐≤4%", ({ f }) => strategySetupState(f).A.checks.nearSupport],
    ["volume", "A拉回量縮/至少未放量殺低", ({ f }) => strategySetupState(f).A.checks.volume],
    ["structure", "A未破壞結構", ({ f }) => strategySetupState(f).A.checks.structure],
    ["notLate", "A非末升段", ({ f }) => strategySetupState(f).A.checks.notLate]
  ];
  const bDefs = [
    ["trend", "B中期結構可承接", ({ f }) => strategySetupState(f).B.checks.trend],
    ["breakout", "B今日有效突破20日平台/前高", ({ f }) => strategySetupState(f).B.checks.breakout],
    ["volume", "B突破量≥前5日均量1.3倍", ({ f }) => strategySetupState(f).B.checks.volume],
    ["strongClose", "B收盤位於日K上緣", ({ f }) => strategySetupState(f).B.checks.strongClose],
    ["upperShadow", "B非爆量長上影", ({ f }) => strategySetupState(f).B.checks.upperShadow],
    ["notLate", "B非末升段", ({ f }) => strategySetupState(f).B.checks.notLate]
  ];

  const summarizeChannel = defs => {
    const passCounts = Object.fromEntries(defs.map(([key, label]) => [key, { label, pass: 0, passRate: 0, fail: 0 }]));
    const onlyMissing = Object.fromEntries(defs.map(([key, label]) => [key, { label, count: 0 }]));
    let fullPass = 0;
    let zeroOrOneMissing = 0;
    for (const item of items) {
      const failed = [];
      for (const [key, , test] of defs) {
        const ok = Boolean(test(item));
        if (ok) passCounts[key].pass += 1; else failed.push(key);
      }
      if (failed.length === 0) fullPass += 1;
      if (failed.length <= 1) zeroOrOneMissing += 1;
      if (failed.length === 1) onlyMissing[failed[0]].count += 1;
    }
    for (const [key] of defs) {
      passCounts[key].fail = baseCount - passCounts[key].pass;
      passCounts[key].passRate = pct(passCounts[key].pass);
    }
    return { denominator: baseCount, fullPass, fullPassRate: pct(fullPass), zeroOrOneMissing, conditions: passCounts, onlyMissing };
  };

  const industryBaseCounts = {};
  for (const { f } of items) industryBaseCounts[f.industry || "未分類"] = (industryBaseCounts[f.industry || "未分類"] || 0) + 1;
  const topSectors = Object.entries(sectorStats || {}).map(([industry, stat]) => ({
    industry, score: round(toNumber(stat.score) || 0, 1), breadth: round(toNumber(stat.breadth) || 0, 1),
    avgChange: round(toNumber(stat.avgChange) || 0, 2), basePoolStocks: industryBaseCounts[industry] || 0
  })).sort((a, b) => b.score - a.score).slice(0, 12);

  const pullbacks = items.map(({ f }) => strategySetupState(f).metrics.pullbackPct).filter(Number.isFinite);
  const supportDistance = items.map(({ f }) => strategySetupState(f).metrics.supportDistancePct).filter(Number.isFinite);
  const volumeBreakouts = items.map(({ f }) => toNumber(f.volumeTodayVsPrev5)).filter(Number.isFinite);
  const streaks = items.map(({ f }) => Math.max(f.foreignBuyDays || 0, f.trustBuyDays || 0, f.dealerBuyDays || 0)).filter(Number.isFinite);

  return {
    denominator: baseCount,
    A: summarizeChannel(aDefs),
    B: summarizeChannel(bDefs),
    metrics: {
      pullbackPct: summarizeNumbers(pullbacks),
      supportDistancePct: summarizeNumbers(supportDistance),
      volumeTodayVsPrev5: summarizeNumbers(volumeBreakouts),
      institutionStreak: summarizeNumbers(streaks)
    },
    rankingOnly: {
      sectorScoreIsHardGate: false,
      sectorScorePurpose: "只作主流/資金排序加分，不再用固定58分封殺A/B",
      topSectors
    },
    interpretationHint: "A/B是兩種進場型態：A拉回承接、B突破後承接；主流、法人、基本面、RS只做品質排序與風險過濾。"
  };
}

function chooseDailySupport(f) {
  const candidates = [f.ma10, f.ma20, f.rightLow, f.recentLow5Prev]
    .map(toNumber).filter(Number.isFinite)
    .filter(level => level > 0 && level <= f.close * 1.015 && level >= f.close * 0.82);
  return candidates.length ? Math.max(...candidates) : toNumber(f.ma20);
}

function strategySetupState(f) {
  const support = chooseDailySupport(f);
  const recentHigh = Math.max(toNumber(f.recentHigh10) || 0, toNumber(f.priorHigh20) || 0);
  const pullbackPct = recentHigh > 0 ? (recentHigh - f.close) / recentHigh * 100 : null;
  const supportDistancePct = support > 0 ? Math.abs(f.close - support) / support * 100 : null;
  const trendA = f.ma20 > 0 && f.ma60 > 0 && f.ma20 >= f.ma60 * 0.995 && f.close >= f.ma20 * 0.97 && f.prevMa20 <= f.ma20 * 1.005;
  const pullbackOK = pullbackPct !== null && pullbackPct >= 2 && pullbackPct <= 15;
  const nearSupport = supportDistancePct !== null && supportDistancePct <= 4;
  const volumeA = (toNumber(f.volumeTodayVsPrev5) || 999) <= 1.05 || (toNumber(f.volumeContraction5to20) || 999) <= 0.95;
  const structureA = f.close >= support * 0.985 && f.todayLow >= (toNumber(f.priorLow20) || 0);
  const notLate = f.lateStage !== true;

  const trendB = f.ma20 > 0 && f.ma60 > 0 && f.ma20 >= f.ma60 * 0.99 && (f.bullishStack === true || f.justTurnBullish === true || f.close > f.ma10);
  const breakoutB = f.priorHigh20 > 0 && f.close >= f.priorHigh20 * 1.002;
  const volumeB = (toNumber(f.volumeTodayVsPrev5) || 0) >= 1.3;
  const strongCloseB = (toNumber(f.dailyClosePosition) || 0) >= 0.65;
  const upperShadowB = (toNumber(f.dailyUpperShadowRatio) || 0) <= 0.35;
  const notLateB = f.lateStage !== true && (toNumber(f.ret20) || 0) <= 30;

  return {
    metrics: { support, recentHigh, pullbackPct, supportDistancePct },
    A: {
      pass: trendA && pullbackOK && nearSupport && volumeA && structureA && notLate,
      checks: { trend: trendA, pullback: pullbackOK, nearSupport, volume: volumeA, structure: structureA, notLate }
    },
    B: {
      pass: trendB && breakoutB && volumeB && strongCloseB && upperShadowB && notLateB,
      checks: { trend: trendB, breakout: breakoutB, volume: volumeB, strongClose: strongCloseB, upperShadow: upperShadowB, notLate: notLateB }
    }
  };
}

function nearestRealResistance(f, entry) {
  const levels = [];
  const add = value => { const n = toNumber(value); if (n !== null && n > entry * 1.01) levels.push(n); };
  add(f.targetPrice);
  add(f.priorHigh20);
  add(f.priorHigh60);
  const history = Array.isArray(f.history) ? f.history.slice(0, -1) : [];
  for (let i = 2; i < history.length - 2; i += 1) {
    const h = toNumber(history[i]?.high);
    if (h === null || h <= entry * 1.01) continue;
    const isPivot = h >= toNumber(history[i-1]?.high) && h >= toNumber(history[i-2]?.high) &&
      h >= toNumber(history[i+1]?.high) && h >= toNumber(history[i+2]?.high);
    if (isPivot) levels.push(h);
  }
  return levels.length ? Math.min(...levels) : null;
}

function financialDataCount(f) {
  return [f.revenueYoY, f.revenueMoM ?? f.revenueQoQ, f.revenueYTDYoY, f.eps, f.grossMargin, f.operatingMargin, f.epsYoY, f.grossMarginYoY, f.operatingMarginYoY]
    .map(toNumber).filter(v => v !== null).length;
}

function summarizeNumbers(values) {
  const nums = (Array.isArray(values) ? values : []).filter(Number.isFinite).sort((a, b) => a - b);
  if (!nums.length) return { count: 0, min: null, p25: null, p50: null, p75: null, p90: null, p95: null, max: null, mean: null };
  return {
    count: nums.length,
    min: round(nums[0], 2),
    p25: round(percentile(nums, 25), 2),
    p50: round(percentile(nums, 50), 2),
    p75: round(percentile(nums, 75), 2),
    p90: round(percentile(nums, 90), 2),
    p95: round(percentile(nums, 95), 2),
    max: round(nums.at(-1), 2),
    mean: round(average(nums), 2)
  };
}

function percentile(sortedValues, p) {
  const values = Array.isArray(sortedValues) ? sortedValues : [];
  if (!values.length) return null;
  if (values.length === 1) return values[0];
  const pos = (values.length - 1) * clamp(p, 0, 100) / 100;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return values[lo];
  const weight = pos - lo;
  return values[lo] * (1 - weight) + values[hi] * weight;
}

function buildChannelDebug(f, sector) {
  const state = strategySetupState(f);
  const inst = institutionalScore(f);
  const fundamental = fundamentalScore(f);
  const rs = (f.ret20 || 0) - (toNumber(f.marketReturn20) || 0);
  const aMessages = {
    trend: "多頭結構仍在（MA20/MA60與價格位置）",
    pullback: `拉回幅度需2~15%，目前${round(state.metrics.pullbackPct || 0, 1)}%`,
    nearSupport: `需接近技術支撐4%內，目前距離${round(state.metrics.supportDistancePct || 0, 1)}%`,
    volume: `拉回需量縮/不放量殺低，目前今日/前5日量×${round(f.volumeTodayVsPrev5 || 0, 2)}`,
    structure: "不得跌破主要支撐與20日結構",
    notLate: `排除末升段，目前20日漲幅${round(f.ret20 || 0, 1)}%`
  };
  const bMessages = {
    trend: "突破後需仍有中期多頭結構",
    breakout: `收盤需有效突破20日前高，目前${round(f.close, 2)}/${round(f.priorHigh20, 2)}`,
    volume: `突破量需≥前5日均量1.3倍，目前×${round(f.volumeTodayVsPrev5 || 0, 2)}`,
    strongClose: `日K需收近高，收盤位置目前${round((f.dailyClosePosition || 0)*100, 1)}%`,
    upperShadow: `長上影比例需≤35%，目前${round((f.dailyUpperShadowRatio || 0)*100, 1)}%`,
    notLate: `突破不可是末升段，目前20日漲幅${round(f.ret20 || 0, 1)}%`
  };
  const missingA = Object.entries(state.A.checks).filter(([,ok]) => !ok).map(([k]) => aMessages[k]);
  const missingB = Object.entries(state.B.checks).filter(([,ok]) => !ok).map(([k]) => bMessages[k]);
  const missingCount = Math.min(missingA.length, missingB.length);
  const nearScore = Math.max(6 - missingA.length, 6 - missingB.length);

  return {
    symbol: f.symbol, name: f.name, industry: f.industry, close: round(f.close, 2),
    ma20: round(f.ma20, 2), ma60: round(f.ma60, 2), ret20: round(f.ret20 || 0, 2), ret60: round(f.ret60 || 0, 2),
    marketReturn20: round(f.marketReturn20 || 0, 2), rs: round(rs, 2),
    support: round(state.metrics.support || 0, 2), pullbackPct: round(state.metrics.pullbackPct || 0, 2),
    supportDistancePct: round(state.metrics.supportDistancePct || 0, 2), priorHigh20: round(f.priorHigh20 || 0, 2),
    volumeTodayVsPrev5: round(f.volumeTodayVsPrev5 || 0, 2), dailyClosePositionPct: round((f.dailyClosePosition || 0)*100, 1),
    dailyUpperShadowPct: round((f.dailyUpperShadowRatio || 0)*100, 1),
    sectorScore: round(sector.score, 1), institutionalScore: round(inst, 1), fundamentalScore: round(fundamental, 1),
    institutionHistoryDays: f.institutionHistoryDays || 0, foreignBuyDays: f.foreignBuyDays || 0, trustBuyDays: f.trustBuyDays || 0, dealerBuyDays: f.dealerBuyDays || 0,
    A: { pass: state.A.pass, mode: "拉回承接", missing: missingA },
    B: { pass: state.B.pass, mode: "突破後承接", missing: missingB },
    missingCount, nearScore
  };
}

function scoreCandidate(f, sector) {
  if (f.close < MIN_CLOSE_PRICE) return reject("股價低於10元", false);
  if (f.historyDays < 60) return reject("歷史資料未滿60日", false);
  if (f.marketCapYi === null) return reject("缺市值資料", false);
  if (f.marketCapYi < 10) return reject("市值低於10億", false);
  if (Math.abs(f.changePercent || 0) >= 9.8) return reject("單日走勢過度異常", false);

  const minLots = f.close >= 1000 ? 300 : 1000;
  let liquidityException = null;
  if (f.avgVolume20Lots < minLots) {
    const spread = toNumber(f.spreadPercent);
    const goodDepth = f.orderBookDepthGood === true || toNumber(f.depthScore) >= 80;
    if (f.avgAmount20 >= 50000000 && spread !== null && spread <= 0.5 && goodDepth) {
      liquidityException = `20日均量${Math.round(f.avgVolume20Lots)}張未達${minLots}張；但均額、深度、價差符合例外`;
    } else return reject("20日流動性不足", false);
  }
  if (f.marketCapYi < 30 && !(f.avgVolume20Lots >= minLots * 1.5 && institutionalScore(f) >= 70)) {
    return reject("10至30億市值缺少強力特殊理由", false);
  }
  if (f.marketCapYi < 100 && f.avgVolume20Lots < minLots * 1.2 && !liquidityException) {
    return reject("30至100億市值流動性要求未達", false);
  }

  const setup = strategySetupState(f);
  let channel = null;
  if (setup.B.pass) channel = "B";
  else if (setup.A.pass) channel = "A";
  if (!channel) return reject("A拉回承接/B突破後承接皆未形成候選", true);

  const inst = institutionalScore(f);
  const fundamental = fundamentalScore(f);
  const fundamentalCount = financialDataCount(f);
  if (fundamentalCount < 3) return reject("基本面資料不足，不能以中立分數假裝通過", true);
  if (fundamentalCount >= 3 && fundamental < 25) return reject("基本面品質明顯不足", true);
  if ((f.atrPercent || 0) < 1.0 || (f.atrPercent || 0) > 10) return reject("波動品質不合格", true);

  const atr = (f.atrPercent || 0) / 100 * f.close;
  const support = setup.metrics.support;
  const breakout = f.priorHigh20;
  let planBuyLow, planBuyHigh, entry, stop;
  if (channel === "A") {
    planBuyLow = support * 0.995;
    planBuyHigh = support * 1.018;
    entry = (planBuyLow + planBuyHigh) / 2;
    const structureLow = toNumber(f.recentLow5Prev) || support;
    stop = Math.min(support * 0.98, structureLow - atr * 0.12);
  } else {
    planBuyLow = breakout * 0.995;
    planBuyHigh = breakout * 1.01;
    entry = breakout * 1.003;
    stop = breakout - Math.max(atr * 0.65, breakout * 0.012);
  }

  const target = nearestRealResistance(f, entry);
  if (target === null) return reject("上方無可驗證實質壓力，無法計算真實RR", true);
  const risk = entry - stop;
  const reward = target - entry;
  const rr = risk > 0 ? reward / risk : 0;
  if (rr < MIN_REWARD_RISK) return reject("預期RR低於2比1", true, false);

  const rs = (f.ret20 || 0) - (toNumber(f.marketReturn20) || 0);
  const fundamentalForRank = fundamental;
  const setupQuality = channel === "A"
    ? clamp(70 - Math.abs((setup.metrics.pullbackPct || 8) - 7) * 3 - (setup.metrics.supportDistancePct || 0) * 3 + (f.volumeTodayVsPrev5 <= 0.9 ? 12 : 4), 0, 100)
    : clamp(55 + Math.min(25, (f.volumeTodayVsPrev5 || 0) * 8) + (f.dailyClosePosition || 0) * 20 - (f.dailyUpperShadowRatio || 0) * 25, 0, 100);

  const priorityScore = clamp(
    setupQuality * 0.28 + sector.score * 0.14 + inst * 0.16 + fundamentalForRank * 0.14 +
    clamp(50 + rs * 2, 0, 100) * 0.14 + clamp(rr * 20, 0, 100) * 0.14, 0, 100
  );
  const reasons = [
    channel === "A" ? "A拉回承接候選" : "B突破後承接候選",
    `策略品質${round(setupQuality, 1)}分`, `產業資金${round(sector.score, 1)}分(排序用)`,
    `RS${round(rs, 1)}`, `法人${round(inst, 1)}分`, `RR ${round(rr, 2)}`
  ];
  if (liquidityException) reasons.push(liquidityException);

  const signalLevel = setupQuality >= SIGNAL_GRADE_A_MIN ? "A" : (setupQuality >= SIGNAL_GRADE_B_MIN ? "B" : "C");
  if (signalLevel === "C") return reject("策略品質低於B級，不列入推薦", true, true);

  return {
    ok: true, basePassed: true, rrPassed: true, ...f, channel, signalLevel, rewardRisk: round(rr, 2), rewardPerRisk: rr,
    priorityScore: round(priorityScore, 1), sectorFlow: round(sector.score, 1), relativeStrength: round(rs, 1),
    entry, stop, target, planBuyLow, planBuyHigh, planBreakout: breakout, setupQuality,
    liquidityException, selectedReason: reasons.join("；")
  };
}

function reject(reason, basePassed = false, rrPassed = false) { return { ok: false, reason, basePassed, rrPassed }; }


function institutionalScore(f) {
  const foreignDays = toNumber(f.foreignBuyDays ?? f["外資連買天數"]) || 0;
  const trustDays = toNumber(f.trustBuyDays ?? f["投信連買天數"]) || 0;
  const dealerDays = toNumber(f.dealerBuyDays) || 0;
  const synced = f.institutionsAligned === true || f["三大法人同步"] === true;
  const concentration = toNumber(f.chipConcentration ?? f["籌碼集中分數"]) || 0;
  const avgVolumeShares = Math.max(1, (toNumber(f.avgVolume20Lots) || 0) * 1000);
  const netRatio = Math.max(0, (toNumber(f.institutionTotalNet) || 0) / avgVolumeShares);
  const currentBuy = (toNumber(f.foreignNet) || 0) > 0 || (toNumber(f.trustNet) || 0) > 0 || (toNumber(f.dealerNet) || 0) > 0;
  return clamp(foreignDays * 8 + trustDays * 10 + dealerDays * 4 + (synced ? 15 : 0) + (currentBuy ? 6 : 0) + clamp(netRatio * 25, 0, 25) + concentration * 0.15, 0, 100);
}

function fundamentalScore(f) {
  const components = [];
  const revenueYoY = toNumber(f.revenueYoY);
  const revenueMoM = toNumber(f.revenueMoM ?? f.revenueQoQ);
  const ytdYoY = toNumber(f.revenueYTDYoY);
  const eps = toNumber(f.eps);
  const gross = toNumber(f.grossMargin);
  const operating = toNumber(f.operatingMargin);

  if (revenueYoY !== null) components.push(scorePositive(revenueYoY, 30));
  if (revenueMoM !== null) components.push(clamp(5 + revenueMoM * 0.5, 0, 10));
  if (ytdYoY !== null) components.push(scorePositive(ytdYoY, 15));
  if (eps !== null) components.push(eps > 0 ? 15 : 0);
  if (gross !== null) components.push(clamp(gross / 50 * 15, 0, 15));
  if (operating !== null) components.push(clamp(operating / 25 * 15, 0, 15));

  const epsYoY = toNumber(f.epsYoY);
  const grossYoY = toNumber(f.grossMarginYoY);
  const opYoY = toNumber(f.operatingMarginYoY);
  if (epsYoY !== null) components.push(scorePositive(epsYoY, 10));
  if (grossYoY !== null) components.push(scorePositive(grossYoY, 5));
  if (opYoY !== null) components.push(scorePositive(opYoY, 5));

  return components.length >= 3 ? clamp(components.reduce((a, b) => a + b, 0), 0, 100) : 0;
}

function scorePositive(value, maxScore) {
  const n = toNumber(value);
  return n === null ? null : clamp(maxScore / 2 + n * 0.5, 0, maxScore);
}

function allocateAndBuildPlans(selected, totalCapital, scanDate) {
  // 資金配置不因「最多6檔」而硬用滿。入選越少，保留現金越多；3檔以上預設最多動用85%。
  // 各股依 V7 priorityScore（已含策略品質、RR、產業、法人、基本面、RS）做權重，單股最多35%。
  const scoreTotal = selected.reduce((sum, item) => sum + Math.max(1, toNumber(item.priorityScore) || 0), 0) || 1;
  const deployRatio = selected.length <= 0 ? 0 : selected.length === 1 ? 0.35 : selected.length === 2 ? 0.60 : 0.85;
  return selected.map((item, index) => {
    const rawRatio = deployRatio * Math.max(1, toNumber(item.priorityScore) || 0) / scoreTotal;
    const ratio = Math.min(MAX_SINGLE_POSITION_RATIO, rawRatio);
    const totalAllocation = Math.floor(totalCapital * ratio / 1000) * 1000;
    const firstAmount = Math.round(totalAllocation * 0.6);
    const secondAmount = totalAllocation - firstAmount;
    const buyLow = round(item.planBuyLow, 2);
    const buyHigh = round(item.planBuyHigh, 2);
    const isA = item.channel === "A";
    // A＝拉回承接：不需要用舊版「突破價／最大追價」欄位硬套。
    // B＝突破後承接：才設定突破確認價與最大追價。
    const breakout = isA ? null : round(item.planBreakout || item.priorHigh20, 2);
    const maxChase = isA ? null : round(buyHigh, 2);
    return {
      code: item.symbol, name: item.name, rank: index + 1,
      formalClose: item.close, closeDate: scanDate, planDate: nextTradingDate(scanDate),
      mode: isA ? "PULLBACK" : "MOMENTUM",
      channel: item.channel, signalLevel: item.signalLevel || "B",
      priorityScore: item.priorityScore, rewardRisk: item.rewardRisk,
      sectorFlow: item.sectorFlow, relativeStrength: item.relativeStrength,
      allocationRatio: round(ratio * 100, 1), totalAllocation, firstAmount, secondAmount,
      firstShares: sharesFor(firstAmount, item.entry), secondShares: sharesFor(secondAmount, item.entry),
      buyLow, buyHigh, breakout, maxChase,
      stop: round(item.stop, 2), profitCheck: round(item.target, 2), reduceAt: round(item.target, 2),
      firstCondition: isA
        ? "A拉回承接：價格進入支撐承接區後，完整15分K量縮止跌、不再破低，下一根轉強才第一筆"
        : "B突破後承接：先確認有效突破；不追第一段，等待回測突破價/承接區守住，完整15分K再轉強才第一筆",
      secondCondition: isA
        ? "第一筆後支撐仍守住，重新量縮止跌並由15分K再次轉強才加碼"
        : "第一筆後突破位持續守住，第二次回測不破或再轉強，15分K確認才加碼",
      selectedReason: `${item.selectedReason}；18:10盤後日 ${scanDate}；此為隔日等待計畫，不代表開盤直接買`,
      positionStage: "NONE", pushEnabled: true
    };
  });
}

function consecutivePositiveDays(history, key) {
  let count = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    const value = toNumber(history[i]?.[key]);
    if (value !== null && value > 0) count += 1;
    else break;
  }
  return count;
}

function chooseHistoryWarmupTargets(rows, previous, currentSymbols, limit, cachedSymbols = new Set(), sectorStats = {}) {
  const prior = previous?.stocks || {};
  return rows
    .filter(row => {
      const history = Array.isArray(prior[row.symbol]?.history) ? prior[row.symbol].history : [];
      return !cachedSymbols.has(row.symbol) &&
        history.length < 60 &&
        row.marketCapYi !== null &&
        row.marketCapYi >= 10 &&
        row.tradeValue >= 10000000;
    })
    .map(row => ({
      row,
      score: coarseWarmupScore(
        row,
        currentSymbols.has(row.symbol),
        sectorStats[row.industry]?.score || 0
      )
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.row);
}

function coarseWarmupScore(row, isCurrent, sectorScore = 0) {
  const amountScore = clamp(Math.log10(Math.max(1, row.tradeValue)) * 8 - 35, 0, 30);
  const capScore = clamp(Math.log10(Math.max(10, row.marketCapYi || 10)) * 8, 0, 18);
  const revenueScore = clamp(10 + (toNumber(row.revenueYoY) || 0) * 0.15, 0, 18);
  const marginScore = clamp((toNumber(row.operatingMargin) || 0) * 0.25, 0, 12);
  const epsScore = (toNumber(row.eps) || 0) > 0 ? 10 : 0;
  const avgVol = Math.max(1, toNumber(row.volumeShares) || 1);
  const net = toNumber(row.institutionTotalNet) || 0;
  const instRatio = net / avgVol;
  const instScore = net > 0 ? clamp(8 + instRatio * 40, 0, 20) : 0;
  const anyBuy = (toNumber(row.foreignNet) || 0) > 0 || (toNumber(row.trustNet) || 0) > 0 || (toNumber(row.dealerNet) || 0) > 0;
  const institutionBonus = anyBuy ? 8 : 0;
  const sectorBonus = clamp(sectorScore * 0.35, 0, 35);
  const trendDay = clamp((toNumber(row.changePercent) || 0) + 5, 0, 10);
  return (isCurrent ? 25 : 0) + amountScore + capScore + revenueScore + marginScore +
    epsScore + instScore + institutionBonus + sectorBonus + trendDay;
}

function buildHistorySeedQueue(rows, currentSymbols, limit = HISTORY_CACHE_TARGET) {
  return rows
    .filter(row => row && row.symbol && row.close >= MIN_CLOSE_PRICE)
    .map(row => {
      const amountScore = clamp(Math.log10(Math.max(1, row.tradeValue)) * 12 - 60, 0, 60);
      const volumeScore = clamp(Math.log10(Math.max(1, row.volumeShares || 1)) * 6 - 18, 0, 24);
      const change = toNumber(row.changePercent) || 0;
      const trendScore = clamp(change + 5, 0, 10);
      const currentBonus = currentSymbols.has(row.symbol) ? 100 : 0;
      return { symbol: row.symbol, score: currentBonus + amountScore + volumeScore + trendScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.symbol);
}

async function runHistorySeed(env, scheduledTime = Date.now(), limit = HISTORY_WARMUP_LIMIT) {
  if (!env?.V7_DB) {
    return {
      version: VERSION,
      skipped: true,
      status: "尚未設定 V7_DB，無法建立歷史快取",
      fugleCalls: 0
    };
  }

  const requestedDate = taiwanDate(scheduledTime);
  await loadTradingCalendar(env, Number(requestedDate.slice(0, 4)));
  if (requestedDate.slice(5) <= "01-07") await loadTradingCalendar(env, Number(requestedDate.slice(0, 4)) - 1);
  const marketDate = mostRecentWeekday(requestedDate);
  const batchLimit = Math.max(1, Math.min(Number(limit) || HISTORY_WARMUP_LIMIT, HISTORY_WARMUP_LIMIT));
  const institutionSeed = await seedInstitutionSnapshotStep(env, marketDate);

  let state = await readHistorySeedState(env);
  let queueRebuilt = false;

  // 7.4.3：舊版 360 檔 seed state 不得沿用。
  // 只要 seed schema 不同、交易日不同、或 queue 結構不存在，就以當日全市場重新建立缺口佇列。
  const needsRebuild = !state ||
    state.seedSchema !== HISTORY_SEED_SCHEMA ||
    state.marketDate !== marketDate ||
    !Array.isArray(state.queue);

  if (needsRebuild) {
    const [twseRows, tpexRows] = await Promise.all([
      fetchMarketRows(env.TWSE_DAILY_URL || TWSE_DAILY_URL, "TWSE"),
      fetchMarketRows(env.TPEX_DAILY_URL || TPEX_DAILY_URL, "TPEx")
    ]);
    const marketRows = [...twseRows, ...tpexRows].filter(row => row && row.close >= MIN_CLOSE_PRICE);
    const loadedConfig = await loadStockConfig(env);
    const currentSymbols = new Set((loadedConfig.stocks || []).map(item => item.symbol));
    const ordered = buildHistorySeedQueue(marketRows, currentSymbols, HISTORY_CACHE_TARGET);
    const targetSet = new Set(ordered);

    // 只有重建佇列時才讀整份 D1 歷史 JSON；正常每10秒批次不再反覆讀 1,000+ 份大 JSON。
    const cached = await readHistoryCache(env, HISTORY_CACHE_TARGET + 400);
    const completeCached = new Set(Object.entries(cached)
      .filter(([symbol, history]) => targetSet.has(symbol) && Array.isArray(history) && history.length >= 60)
      .map(([symbol]) => symbol));

    const queue = ordered.filter(symbol => !completeCached.has(symbol));
    state = {
      marketDate,
      queue,
      cursor: 0,
      total: queue.length,
      coverageTarget: ordered.length,
      coverageBase: completeCached.size,
      resolvedCount: completeCached.size,
      insufficientSymbols: [],
      seedSchema: HISTORY_SEED_SCHEMA,
      updatedAt: null
    };
    await writeHistorySeedState(env, state);
    queueRebuilt = true;
  }

  const target = Math.max(0, Number(state.coverageTarget || 0));
  const total = Math.max(0, Number(state.total || state.queue.length || 0));
  const cursor = Math.max(0, Math.min(Number(state.cursor || 0), total));
  const resolvedBefore = Math.max(0, Math.min(target, Number(state.resolvedCount || state.coverageBase || 0)));
  const cachedCountNow = await historyCacheCount(env);

  if (target > 0 && resolvedBefore >= target) {
    return {
      version: VERSION,
      generatedAt: taiwanTime(),
      marketDate,
      skipped: true,
      status: `全市場歷史底庫已處理完成；${resolvedBefore}/${target}（其中60日不足 ${state.insufficientSymbols?.length || 0} 檔）`,
      progress: resolvedBefore,
      target,
      queueProgress: cursor,
      queueTarget: total,
      cachedTotal: cachedCountNow,
      insufficientCount: state.insufficientSymbols?.length || 0,
      insufficientSymbols: state.insufficientSymbols || [],
      queueRebuilt,
      institutionSeed,
      officialCalls: institutionSeed.calls || 0,
      fugleCalls: 0
    };
  }

  if (cursor >= total) {
    // 尚有未解決缺口通常代表先前網路失敗；清掉 queue 狀態，下一輪依 D1 完整資料重新找真正缺少的股票。
    state = {
      marketDate: "",
      queue: [],
      cursor: 0,
      total: 0,
      coverageTarget: 0,
      coverageBase: 0,
      resolvedCount: 0,
      insufficientSymbols: state.insufficientSymbols || [],
      seedSchema: HISTORY_SEED_SCHEMA,
      updatedAt: null
    };
    await writeHistorySeedState(env, state);
    return {
      version: VERSION,
      generatedAt: taiwanTime(),
      marketDate,
      skipped: false,
      status: `本輪佇列已跑完但全市場仍有缺口 ${resolvedBefore}/${target}，下一輪自動重建缺口`,
      progress: resolvedBefore,
      target,
      cachedTotal: cachedCountNow,
      insufficientCount: state.insufficientSymbols?.length || 0,
      queueProgress: cursor,
      queueTarget: total,
      queueRebuilt,
      institutionSeed,
      officialCalls: institutionSeed.calls || 0,
      fugleCalls: 0
    };
  }

  const symbols = state.queue.slice(cursor, Math.min(total, cursor + batchLimit));
  const targets = symbols.map(symbol => ({ symbol }));
  const warmup = await fetchHistoryWarmup(targets, marketDate, env);
  const stored = await writeHistoryCache(env, warmup.history);

  state.cursor = Math.min(total, cursor + symbols.length);
  state.resolvedCount = Math.min(
    target,
    resolvedBefore + Number(warmup.complete || 0) + Number(warmup.insufficient || 0)
  );
  state.insufficientSymbols = Array.from(new Set([
    ...(state.insufficientSymbols || []),
    ...(warmup.insufficientSymbols || [])
  ]));

  // 暫時性失敗排到佇列尾端再試，不把它誤算為完成。
  if (Array.isArray(warmup.failedSymbols) && warmup.failedSymbols.length) {
    for (const symbol of warmup.failedSymbols) {
      if (!state.queue.slice(state.cursor).includes(symbol)) state.queue.push(symbol);
    }
  }
  state.total = state.queue.length;
  await writeHistorySeedState(env, state);

  const cached = await historyCacheCount(env);
  const progressAfter = Math.min(target, Number(state.resolvedCount || 0));
  return {
    version: VERSION,
    generatedAt: taiwanTime(),
    marketDate,
    skipped: false,
    status: `本輪歷史暖機 成功${warmup.fetched}/失敗${warmup.failed}；全市場已處理 ${progressAfter}/${target}`,
    requested: symbols.length,
    fetched: warmup.fetched,
    complete60: warmup.complete,
    insufficient: warmup.insufficient,
    failed: warmup.failed,
    stored: stored.stored || 0,
    progressBefore: resolvedBefore,
    progressAfter,
    target,
    queueProgressBefore: cursor,
    queueProgressAfter: state.cursor,
    queueTarget: state.total,
    cachedTotal: cached,
    insufficientCount: state.insufficientSymbols.length,
    insufficientSymbols: state.insufficientSymbols.slice(0, 50),
    queueRebuilt,
    institutionSeed,
    officialCalls: institutionSeed.calls || 0,
    symbols,
    fugleCalls: symbols.length
  };
}

async function fetchHistoryWarmup(targetRows, marketDate, env) {
  const history = {};
  let fetched = 0;
  let complete = 0;
  let insufficient = 0;
  let failed = 0;
  const failedSymbols = [];
  const insufficientSymbols = [];
  const from = shiftDateString(marketDate, -HISTORY_LOOKBACK_CALENDAR_DAYS);

  for (let i = 0; i < targetRows.length; i += 6) {
    const batch = targetRows.slice(i, i + 6);
    const results = await Promise.all(batch.map(async row => {
      try {
        const bars = await fetchHistoricalDaily(row.symbol, from, marketDate, env);
        return { symbol: row.symbol, bars };
      } catch (err) {
        return { symbol: row.symbol, error: String(err), bars: [] };
      }
    }));

    for (const item of results) {
      if (item.error || !Array.isArray(item.bars) || item.bars.length === 0) {
        failed += 1;
        failedSymbols.push(item.symbol);
        continue;
      }

      fetched += 1;
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
      insufficientSymbols.push(item.symbol);
    }
  }
  return { history, fetched, complete, insufficient, failed, failedSymbols, insufficientSymbols };
}

async function fetchHistoricalDaily(symbol, from, to, env) {
  if (!env.FUGLE_API_KEY) throw new Error("找不到 FUGLE_API_KEY");
  const url = `https://api.fugle.tw/marketdata/v1.0/stock/historical/candles/${symbol}` +
    `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}` +
    `&timeframe=D&fields=open,high,low,close,volume,turnover,change&sort=asc`;
  const response = await fetchWithDeadline(url, { headers: { "X-API-KEY": env.FUGLE_API_KEY } });
  if (!response.ok) throw new Error(`${symbol} 歷史日K API錯誤 ${response.status}: ${await response.text()}`);
  const payload = await response.json();
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  return rows.map(bar => ({
    date: String(bar.date || "").slice(0, 10), close: marketNumber(bar.close), high: marketNumber(bar.high), low: marketNumber(bar.low),
    volumeShares: marketNumber(bar.volume) || 0, tradeValue: marketNumber(bar.turnover) || 0
  })).filter(bar => bar.date && bar.close !== null);
}

function shiftDateString(dateString, days) {
  const [y, m, d] = String(dateString).split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function mostRecentWeekday(dateString) {
  let current = String(dateString);
  while (true) {
    const [y, m, d] = current.split("-").map(Number);
    const dow = new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay();
    if (dow !== 0 && dow !== 6 && isTradingDate(current)) return current;
    current = shiftDateString(current, -1);
  }
}

async function sendTo3Min(payload, env) {
  if (isTestMode(env)) return { sent: true, simulated: true, verified: false, reason: "TEST_MODE：不呼叫外部3Min服務" };
  if (!env.THREEMIN_API_URL) return { sent: false, verified: false, skipped: true, reason: "未設定 THREEMIN_API_URL，已直接寫入V7 KV；第26條3Min串接未完成" };
  const headers = { "content-type": "application/json" };
  if (env.THREEMIN_API_TOKEN) headers.authorization = `Bearer ${env.THREEMIN_API_TOKEN}`;
  let accepted = false;
  try {
    const response = await fetchWithDeadline(env.THREEMIN_API_URL, { method: "POST", headers, body: JSON.stringify(payload), redirect: "manual" });
    if (!response.ok) return {sent:false, verified:false, httpStatus:response.status, error:"3Min寫入HTTP失敗"};
    accepted = true;
    const receipt = await response.text();
    if (receipt.trim().startsWith("{")) {
      const parsed = JSON.parse(receipt);
      if (parsed.ok === false || parsed.success === false) return {sent:false, verified:false, httpStatus:response.status, error:"3Min回報寫入未成功"};
    }
    if (!env.THREEMIN_VERIFY_URL) return {sent:true, verified:false, httpStatus:response.status, verificationNote:"已接受寫入，但未設定既有服務的唯讀THREEMIN_VERIFY_URL，不能宣稱讀回驗證完成"};
    // 僅使用管理員設定的既有唯讀網址，不推測或建立外部API路徑。
    const readback = await fetchWithDeadline(env.THREEMIN_VERIFY_URL, {method:"GET", headers, redirect:"manual"});
    if (!readback.ok) return {sent:true, verified:false, httpStatus:response.status, verificationNote:`讀回HTTP ${readback.status}`};
    const actual = await readback.json();
    const verified = verifyThreeMinReadback(payload, actual);
    return {sent:true, verified, httpStatus:response.status, verificationNote:verified ? "交易日、資金、全部標的及計畫欄位讀回一致" : "讀回資料與本次交易計畫不一致或服務schema不同"};
  } catch (err) {
    return { sent: accepted, verified: false, error: "3Min傳輸或回覆解析失敗，未完成讀回驗證" };
  }
}

function verifyThreeMinReadback(expected, actual) {
  if (actual?.planDate !== expected.planDate || actual?.totalCapital !== expected.totalCapital || !Array.isArray(actual?.stocks) || actual.stocks.length !== expected.stocks.length) return false;
  const bySymbol = new Map(actual.stocks.map(stock => [stock.symbol, stock]));
  if (bySymbol.size !== expected.stocks.length) return false;
  return expected.stocks.every(stock => {
    const readback = bySymbol.get(stock.symbol);
    return readback && Object.entries(stock).every(([key, value]) => JSON.stringify(readback[key]) === JSON.stringify(value));
  });
}

function buildDailySelectionPayload(scanDate, stocks, diagnostics) {
  return {
    version: VERSION,
    signalId: `DAILY_SELECTION:${scanDate}`,
    signalType: "DAILY_SELECTION",
    signalLabel: "盤後明日標的",
    title: stocks.length ? `V7盤後選出 ${stocks.length} 檔` : "V7盤後：今日 0 檔，維持現金",
    instruction: stocks.length ? "依目前已實作篩選排名與15分K條件確認，不預先追價；完整30條尚未驗收完成" : "今日無符合目前已實作篩選條件標的，維持現金；完整30條尚未驗收完成",
    time: taiwanTime(),
    monitorUrl: "https://fugle-test.imihan0630.workers.dev/",
    diagnostics,
    stocks: stocks.map(stock => ({
      rank: stock.sourceRank, symbol: stock.symbol, name: stock.name,
      mode: stock.mode, firstAmount: stock.firstAmount, secondAmount: stock.secondAmount,
      firstShares: stock.firstShares, secondShares: stock.secondShares,
      firstCondition: stock.firstCondition, secondCondition: stock.secondCondition,
      stop: stock.stop, profitCheck: stock.profitCheck, reason: stock.selectedReason
    }))
  };
}

function pick(object, keys) {
  for (const key of keys) if (object?.[key] !== undefined && object[key] !== "") return object[key];
  return null;
}

function marketNumber(value) {
  if (value === null || value === undefined || value === "" || value === "--") return null;
  const normalized = String(value).replaceAll(",", "").replace(/^X/i, "").replace(/^[＋+]/, "").trim();
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function positiveNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function average(values) {
  const valid = values.filter(Number.isFinite);
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
}

function standardDeviation(values) {
  if (!values.length) return 0;
  const mean = average(values);
  return Math.sqrt(average(values.map(value => (value - mean) ** 2)));
}

function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

function nextTradingDate(dateString) {
  const [y, m, d] = String(dateString).split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12));
  do { date.setUTCDate(date.getUTCDate() + 1); }
  while (!isTradingDate(date.toISOString().slice(0, 10)));
  return date.toISOString().slice(0, 10);
}

function taiwanDate(value = Date.now()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date(value));
  const item = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${item.year}-${item.month}-${item.day}`;
}


// ======================================================
// 主監控頁
// ======================================================

function renderPage(
  results,
  loaded,
  testMode,
  liveState = null,
  usingD1 = false,
  cronStatus = null
) {
  const cards =
    results
      .map(renderCard)
      .join("");

  return `
<!doctype html>
<html lang="zh-Hant">

<head>

<meta charset="utf-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<meta
  http-equiv="refresh"
  content="15"
>

<title>
台股半自動交易決策監控 V7
</title>

<style>

body {
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    "Microsoft JhengHei",
    sans-serif;

  background: #f4f6f8;

  margin: 0;
  padding: 20px;

  color: #222;
}

.wrap {
  max-width: 1500px;
  margin: auto;
}

.top {
  display: flex;
  justify-content:
    space-between;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

h1 {
  margin: 0 0 5px;
}

.sub {
  color: #666;
  margin-bottom: 15px;
}

.button {
  display: inline-block;
  background: #1f6feb;
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 800;
}

.warning {
  background: #fff3cd;
  border: 1px solid #e3b341;
  padding: 12px;
  border-radius: 9px;
  margin-bottom: 16px;
  font-weight: 700;
}

.cronbox {
  background: #eef6ff;
  border: 1px solid #9ec5fe;
  padding: 12px 14px;
  border-radius: 9px;
  margin-bottom: 16px;
  line-height: 1.7;
}

.cronbox strong {
  font-weight: 900;
}

.grid {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(400px,1fr)
    );

  gap: 16px;
}

.card {
  background: white;
  padding: 18px;
  border-radius: 14px;

  box-shadow:
    0 2px 10px
    rgba(0,0,0,.08);
}

.status-a { border-top: 7px solid #1f6feb; }
.status-b { border-top: 7px solid #d9a400; }
.status-c { border-top: 7px solid #7b8794; }

.badge {
  display: inline-block;
  padding: 4px 9px;
  border-radius: 999px;
  margin-right: 6px;
  font-size: 13px;
  font-weight: 900;
  background: #eef2f5;
}

.title {
  font-size: 24px;
  font-weight: 900;
}

.mode {
  font-weight: 700;
  color: #555;
  margin-top: 5px;
}

.price {
  font-size: 30px;
  font-weight: 900;
  margin: 12px 0;
}

.plan {
  background: #f7f7f7;
  padding: 12px;
  border-radius: 9px;
  line-height: 1.7;
}

.row {
  display: grid;

  grid-template-columns:
    120px 1fr;

  gap: 8px;
  padding: 8px 0;

  border-bottom:
    1px solid #eee;
}

.label {
  font-weight: 800;
}

.small {
  color: #666;
  font-size: 13px;
}

/* 台股：紅多、綠空 */

.buy {
  background: #fde2e2;
  border: 2px solid #d32f2f;
  color: #b71c1c;
  padding: 6px;
}

.risk {
  background: #e3f4e6;
  border: 2px solid #2e7d32;
  color: #1b5e20;
  padding: 6px;
}

.watch {
  background: #fff3cd;
  border: 2px solid #d9a400;
  padding: 6px;
}

.wait {
  background: #eef2f5;
  border: 1px solid #9aa6b2;
  padding: 6px;
}

.ok {
  background: #f2f2f2;
  padding: 6px;
}

.profit {
  background: #eee5ff;
  border: 2px solid #7e57c2;
  color: #512da8;
  padding: 6px;
}

.decision {
  margin-top: 15px;
  padding: 14px;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 900;
}

.error {
  color: #b71c1c;
  font-weight: 900;
}

</style>

</head>

<body>

<div class="wrap">

<div class="top">

<div>

<h1>
台股半自動交易決策監控 V7
</h1>

<div class="sub">

資料更新：
${h(liveState?.generatedAt || "-")}

｜頁面刷新：15秒

｜即時狀態：${usingD1 ? "D1 primary" : "KV fallback"}

｜動態排序候選：
${results.length} 檔

｜設定來源：
${h(loaded.source)}

｜設定更新：
${h(
  formatIso(
    loaded.updatedAt
  )
)}

｜Fugle：每分鐘Quote、10/15分K收棒才更新

｜10分K提前追強

｜15分K正式確認

｜Phase 2背景推播

</div>

</div>

<a
  class="button"
  href="/admin"
>
⚙ 匯入今日標的
</a>

</div>

<div class="cronbox">
<strong>Cron 實際執行：</strong>
${cronStatus
  ? `${h(cronStatus.cron_expression || "-")}｜${h(cronJobLabel(cronStatus.job_type))}｜${h(cronStatusLabel(cronStatus.status))}｜排程時間 ${h(formatIso(cronStatus.scheduled_at))}｜Fugle ${cronStatus.fugle_calls ?? "-"} calls${cronStatus.error ? `｜錯誤：${h(cronStatus.error)}` : ""}`
  : "尚無實際 Cron 執行紀錄；第一次排程觸發後會自動顯示。"
}
</div>

${snapshotAgeSeconds(liveState) !== null && snapshotAgeSeconds(liveState) > LIVE_STALE_SECONDS
  ? `<div class="warning">⚠ 即時資料已超過 ${snapshotAgeSeconds(liveState)} 秒未更新；請檢查 Cron / Fugle / D1。</div>`
  : ""
}

${!usingD1
  ? `<div class="warning">⚠ 目前尚未使用 D1，即時頁面正在用 KV fallback。完成 V7_DB Binding 後會切換為 primary 最新狀態。</div>`
  : ""
}

${testMode
  ? `
<div class="warning">

目前仍為測試模式。

正式啟用前再把：

環境變數 TEST_MODE = true

改成：

環境變數 TEST_MODE = false

</div>
`
  : ""
}


<div class="grid">

${cards}

</div>

</div>

</body>

</html>
`;
}


// ======================================================
// 股票卡片
// ======================================================

function renderCard(r) {
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
    r.plan;

  return `
<div class="card status-${String(r.monitorStatus?.grade || "C").toLowerCase()}">

<div class="title">
第 ${fmt(r.displayRank)} 名｜
${h(r.name)}
${h(r.symbol)}
</div>

<div>
<span class="badge">${h(r.monitorStatus?.grade || "C")}：${h(r.monitorStatus?.text || "等待")}</span>
<span class="badge">通道 ${h(p.channel)}</span>
<span class="badge">訊號 ${h(p.signalLevel)}</span>
</div>

<div class="mode">

操作模式：
${modeText(p.mode)}

</div>

<div class="price">

目前價：
${fmt(r.currentPrice)}

</div>

<div class="plan">

<b>今日計畫</b>

<br>

拉回：
${fmt(p.buyLow)}
～
${fmt(p.buyHigh)}

<br>

突破：
${fmt(p.breakout)}

｜最大追價：
${fmt(p.maxChase)}

<br>

停損：
${fmt(p.stop)}

｜第一停利：
${fmt(p.profitCheck)}

<hr>

建議總投入：${fmt(p.totalAllocation)}
｜配置比例：${fmt(p.allocationRatio)}${p.allocationRatio !== null ? "%" : ""}

<br>

第一筆：${fmt(p.firstAmount)} 元／約 ${fmt(p.firstShares)} 股
｜第二筆：${fmt(p.secondAmount)} 元／約 ${fmt(p.secondShares)} 股

<br>

總部位：約 ${fmt(p.totalShares)} 股

<br>

第一筆條件：${h(p.firstCondition)}

<br>

第二筆條件：${h(p.secondCondition)}

<br>

優先分數：${fmt(p.priorityScore)}
｜RR：${fmt(p.rewardRisk)}
｜產業資金：${fmt(p.sectorFlow)}
｜RS：${fmt(p.relativeStrength)}

<br>

入選理由：${h(p.selectedReason)}

<br>

持倉階段：${h(positionStageText(p.positionStage))}
｜持倉均價：${fmt(p.averageCost)}
｜減碼檢查價：${fmt(p.reduceAt)}
｜正式賣出價：${fmt(p.sellBelow)}

</div>


${frameHtml(
  "10分K",
  r.frame10
)}


${frameHtml(
  "15分K",
  r.frame15
)}


${statusRow(
  "拉回布局",
  r.pullback
)}


${statusRow(
  "10分K追強",
  r.momentum10
)}


${statusRow(
  "15分K追強",
  r.momentum15
)}


${statusRow(
  "停損",
  r.stop
)}


${statusRow(
  "停利檢查",
  r.profit
)}


<div
  class="
    decision
    ${r.finalDecision.level}
  "
>

最終判斷：

${h(
  r.finalDecision.text
)}

</div>

</div>
`;
}


function frameHtml(
  label,
  frame
) {
  if (!frame.latest) {
    return `
<div class="row">

<div class="label">
${h(label)}
</div>

<div>
尚無完整K棒
</div>

</div>
`;
  }

  const b =
    frame.latest;

  return `
<div class="row">

<div class="label">
${h(label)}
</div>

<div>

收 ${fmt(b.close)}

｜量 ${fmt(b.volume)}

｜量比 ${b.volumeRatio ?? "-"}

｜${h(b.volumeSignal)}

｜收盤位置 ${b.closePosition}%

<div class="small">
${h(b.time)}
</div>

</div>

</div>
`;
}


function statusRow(
  label,
  status
) {
  return `
<div class="row">

<div class="label">
${h(label)}
</div>

<div class="${status.level}">

${h(status.text)}

</div>

</div>
`;
}


// ======================================================
// V7 一鍵歷史暖機頁
// 開啟頁面即自動開始；上一輪完成後等待 10 秒才進下一輪。
// ======================================================
async function buildProductionReadiness(env) {
  await loadTradingCalendar(env, Number(taiwanDate().slice(0, 4)));
  if (taiwanDate().slice(5) <= "01-07") await loadTradingCalendar(env, Number(taiwanDate().slice(0, 4)) - 1);
  const marketDate = mostRecentWeekday(taiwanDate(Date.now()));
  const historyCount = await historyCacheCount(env);
  const seedState = await readHistorySeedState(env);
  const institutionRows = await readInstitutionSnapshotRows(env, marketDate, 10);
  const completeInstitution = institutionRows.filter(isCompleteInstitutionSnapshotRow);
  const loaded = await loadStockConfig(env).catch(() => ({ stocks: [] }));
  const target = Math.max(0, Number(seedState?.coverageTarget || seedState?.total || 0));
  const resolved = Math.max(0, Number(seedState?.resolvedCount || seedState?.cursor || 0));
  const historyReady = target > 0 ? resolved >= target : historyCount >= 1800;
  const checks = {
    STOCKS_KV: Boolean(env.STOCKS_KV),
    V7_DB: Boolean(env.V7_DB),
    ADMIN_TOKEN: Boolean(env.ADMIN_TOKEN),
    FUGLE_API_KEY: Boolean(env.FUGLE_API_KEY),
    THREEMIN_API_URL: Boolean(env.THREEMIN_API_URL),
    THREEMIN_API_TOKEN: Boolean(env.THREEMIN_API_TOKEN),
    THREEMIN_VERIFY_URL: Boolean(env.THREEMIN_VERIFY_URL),
    PUSH_WEBHOOK_URL: Boolean(env.PUSH_WEBHOOK_URL),
    historyReady,
    institution3DaysReady: completeInstitution.length >= 3
  };
  const coreReady = checks.STOCKS_KV && checks.V7_DB && checks.ADMIN_TOKEN && checks.FUGLE_API_KEY &&
    checks.THREEMIN_API_URL && checks.THREEMIN_API_TOKEN && checks.THREEMIN_VERIFY_URL && checks.PUSH_WEBHOOK_URL && !isTestMode(env) &&
    checks.historyReady && checks.institution3DaysReady;
  return {
    version: VERSION,
    generatedAt: taiwanTime(),
    testMode: isTestMode(env),
    productionReady: coreReady,
    phonePushReady: Boolean(env.PUSH_WEBHOOK_URL),
    sellPushReady: Boolean(env.PUSH_WEBHOOK_URL), // 相容舊版欄位
    checks,
    history: { cached: historyCount, target, resolved },
    institution: {
      completeDays: completeInstitution.length,
      validDates: completeInstitution.map(row => row.market_date).slice(0, 3)
    },
    currentConfigCount: Array.isArray(loaded?.stocks) ? loaded.stocks.length : 0,
    expectedCronTaiwan: [
      "09:00-12:59 每分鐘",
      "13:00-13:24 每分鐘",
      "17:00-17:59 每分鐘歷史/法人維護",
      "18:10 盤後選股"
    ],
    note: coreReady
      ? "核心正式環境已就緒；正式切換前確認 phonePushReady，之後將 TEST_MODE 設為 false。"
      : "仍有核心環境項目未就緒，請先依 checks 補齊。"
  };
}

function finalizePage(testMode) {
  const modeText = testMode
    ? "目前 TEST_MODE=true：可安全做最後一次正式鏈路驗收。會真的寫入隔日監控設定與3Min，但手機推播不會真的送出。"
    : "目前 TEST_MODE=false：已是正式模式，此驗收按鈕停用；18:10 Cron 會自動執行。";
  return `<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>V7 最終上線驗收</title>
<style>
body{font-family:"Microsoft JhengHei",sans-serif;background:#f4f6f8;margin:0;padding:24px;color:#111}.box{max-width:980px;margin:auto;background:#fff;border-radius:18px;padding:28px;box-shadow:0 6px 28px rgba(0,0,0,.08)}h1{margin-top:0}.note{background:#f1f5f9;padding:16px;border-radius:12px;line-height:1.7}.warn{background:#fff7ed;padding:14px;border-radius:12px;margin:14px 0}input{width:100%;box-sizing:border-box;padding:12px;border:1px solid #bbb;border-radius:10px;font-size:16px}button{padding:12px 18px;margin:12px 8px 0 0;border:0;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer}.primary{background:#111;color:#fff}.secondary{background:#e5e7eb}pre{white-space:pre-wrap;word-break:break-word;background:#111;color:#eee;padding:18px;border-radius:12px;max-height:520px;overflow:auto}.ok{color:#087f23;font-weight:700}.bad{color:#b42318;font-weight:700}
</style></head><body><div class="box">
<h1>V7 最終上線驗收</h1><div class="note">${modeText}</div>
<div class="warn"><b>這一步不是 dry-run。</b> 它會把當日盤後選出的 0～6 檔真正寫入 <code>STOCK_CONFIG_V7</code>，並送到 3Min sandbox；TEST_MODE=true 時手機推播仍會被模擬/抑制。</div>
<label>ADMIN_TOKEN</label><input id="token" type="password" autocomplete="off" placeholder="貼上 ADMIN_TOKEN">
<button class="primary" onclick="runFinalize()" ${testMode ? "" : "disabled"}>執行最後正式鏈路驗收</button>
<button class="secondary" onclick="loadStatus()">查看目前狀態</button>
<p id="msg"></p><pre id="out">尚未執行</pre>
<script>
const out=document.getElementById('out'),msg=document.getElementById('msg');
function token(){return document.getElementById('token').value.trim()}
async function call(path,method){const t=token();if(!t)throw new Error('請先輸入 ADMIN_TOKEN');const res=await fetch(path,{method,headers:{'x-admin-token':t,'content-type':'application/json'},cache:'no-store'});const data=await res.json();if(!res.ok)throw new Error(data.error||('HTTP '+res.status));return data}
async function runFinalize(){if(!confirm('確定執行最後正式鏈路驗收？會覆寫 STOCK_CONFIG_V7 為本次盤後選股結果。'))return;msg.textContent='執行中，請勿關閉頁面…';out.textContent='掃描全市場並寫入中…';try{const data=await call('/api/finalize','POST');msg.className=data.ok?'ok':'bad';msg.textContent=data.status||'完成';out.textContent=JSON.stringify(data,null,2)}catch(e){msg.className='bad';msg.textContent=String(e);out.textContent=String(e)}}
async function loadStatus(){msg.textContent='讀取中…';try{const data=await call('/api/finalize/status','GET');msg.className=data.readiness?.productionReady?'ok':'bad';msg.textContent=data.readiness?.productionReady?'核心正式環境就緒':'仍有項目未就緒';out.textContent=JSON.stringify(data,null,2)}catch(e){msg.className='bad';msg.textContent=String(e);out.textContent=String(e)}}
</script></div></body></html>`;
}

function historyWarmupPage() {
  return `
<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>V7 一鍵歷史暖機</title>
<style>
body { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft JhengHei",sans-serif; margin:0; background:#f4f6f8; }
.wrap { max-width:760px; margin:40px auto; padding:0 18px; }
.card { background:white; border-radius:16px; padding:24px; box-shadow:0 8px 30px rgba(0,0,0,.08); }
h1 { margin:0 0 8px; font-size:28px; }
.sub { margin:0 0 22px; color:#555; line-height:1.7; }
.bar { width:100%; height:24px; background:#e9ecef; border-radius:999px; overflow:hidden; }
.fill { width:0%; height:100%; background:#333; transition:width .25s ease; }
.big { font-size:32px; font-weight:700; margin:18px 0 4px; }
.grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin:18px 0; }
.box { background:#f7f8fa; padding:12px; border-radius:10px; }
.label { font-size:13px; color:#666; }
.value { margin-top:4px; font-size:18px; font-weight:650; word-break:break-word; }
button { border:0; border-radius:10px; padding:11px 16px; font-size:16px; cursor:pointer; margin-right:8px; }
pre { white-space:pre-wrap; word-break:break-word; background:#111; color:#eee; padding:14px; border-radius:10px; max-height:260px; overflow:auto; }
.note { font-size:14px; color:#666; line-height:1.7; margin-top:16px; }
@media (max-width:600px){ .grid{grid-template-columns:1fr;} .wrap{margin:18px auto;} }
</style>
</head>
<body>
<div class="wrap"><div class="card">
<h1>V7 一鍵歷史暖機</h1>
<p class="sub">頁面會自動每 10 秒處理下一批 6 檔，直到全市場可交易普通股都完成歷史檢查。可取得60日者建立完整底庫；新股若天然不足60日會標記後略過，不會卡住。已完成的股票不重抓。請保持此頁開啟。</p>
<div class="bar"><div class="fill" id="fill"></div></div>
<div class="big" id="progress">準備中…</div>
<div class="grid">
  <div class="box"><div class="label">D1 歷史快取</div><div class="value" id="cached">—</div></div>
  <div class="box"><div class="label">本次成功 / 失敗</div><div class="value" id="batch">—</div></div>
  <div class="box"><div class="label">已執行輪數</div><div class="value" id="rounds">0</div></div>
  <div class="box"><div class="label">60日不足（新股/歷史不足）</div><div class="value" id="insufficient">0</div></div>
  <div class="box"><div class="label">下一輪</div><div class="value" id="next">自動開始</div></div>
</div>
<button onclick="stopWarmup()">停止</button>
<button onclick="resumeWarmup()">繼續</button>
<p class="note">安全設定：每輪最多 6 個 Fugle 歷史日K呼叫，上一輪完成後再等 10 秒，不會重疊請求。TEST_MODE 關閉後此頁會停用。</p>
<pre id="log">等待第一輪…</pre>
</div></div>
<script>
const WAIT_MS = 10000;
let running = true;
let timer = null;
let countdownTimer = null;
let roundCount = 0;
function setText(id, value){ document.getElementById(id).textContent = value; }
function setProgress(current, target){
  const safeTarget = Math.max(1, Number(target || 2000));
  const safeCurrent = Math.max(0, Math.min(Number(current || 0), safeTarget));
  document.getElementById('fill').style.width = ((safeCurrent / safeTarget) * 100).toFixed(1) + '%';
  setText('progress', safeCurrent + ' / ' + safeTarget);
}
function clearTimers(){
  if (timer) clearTimeout(timer);
  if (countdownTimer) clearInterval(countdownTimer);
  timer = null; countdownTimer = null;
}
function stopWarmup(){ running = false; clearTimers(); setText('next','已停止'); }
function resumeWarmup(){ if (running) return; running = true; setText('next','立即執行'); runOne(); }
function scheduleNext(){
  if (!running) return;
  let remain = WAIT_MS / 1000;
  setText('next', remain + ' 秒');
  countdownTimer = setInterval(() => {
    if (!running) { clearTimers(); return; }
    remain -= 1;
    if (remain <= 0) { clearInterval(countdownTimer); countdownTimer = null; return; }
    setText('next', remain + ' 秒');
  }, 1000);
  timer = setTimeout(() => { timer = null; runOne(); }, WAIT_MS);
}
async function runOne(){
  if (!running) return;
  setText('next','執行中…');
  try {
    const response = await fetch('/api/history-seed?limit=6', { cache:'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data && data.error ? data.error : ('HTTP ' + response.status));
    roundCount += 1;
    setText('rounds', roundCount);
    const current = Number(data.progressAfter ?? data.progress ?? 0);
    const target = Number(data.target ?? 2000);
    setProgress(current, target);
    setText('cached', data.cachedTotal != null ? String(data.cachedTotal) : '—');
    setText('batch', String(data.fetched ?? 0) + ' / ' + String(data.failed ?? 0));
    setText('insufficient', String(data.insufficientCount ?? data.insufficient ?? 0));
    document.getElementById('log').textContent = JSON.stringify(data, null, 2);
    const complete = current >= target || (data.skipped === true && Number(data.progress ?? 0) >= target);
    if (complete) {
      running = false; clearTimers();
      setText('next','完成');
      setText('progress', target + ' / ' + target + '　完成');
      document.getElementById('fill').style.width = '100%';
      return;
    }
    scheduleNext();
  } catch (err) {
    running = false; clearTimers();
    setText('next','發生錯誤，請按「繼續」重試');
    document.getElementById('log').textContent = String(err);
  }
}
runOne();
</script>
</body>
</html>`;
}

// ======================================================
// V7 一鍵匯入頁
// 不再一格一格填
// ======================================================

function adminPage() {
  const example =
`[
  {
    "symbol": "6510",
    "name": "精測",
    "mode": "BOTH",
    "buyLow": 3500,
    "buyHigh": 3550,
    "breakout": 3700,
    "maxChase": 3750,
    "stop": 3420,
    "profitCheck": 3900,
    "rank": 1,
    "channel": "A",
    "signalLevel": "A",
    "priorityScore": 88,
    "rewardRisk": 2.6,
    "sectorFlow": 82,
    "relativeStrength": 75,
    "allocationRatio": 30,
    "totalAllocation": 60000,
    "firstAmount": 36000,
    "secondAmount": 24000,
    "firstShares": 10,
    "secondShares": 6,
    "totalShares": 16,
    "firstCondition": "15分K正式確認後第一筆",
    "secondCondition": "重新止跌或轉強後才加碼",
    "selectedReason": "產業資金、RS、法人與價量共振",
    "positionStage": "NONE",
    "averageCost": null,
    "reduceAt": 3900,
    "sellBelow": 3420,
    "pushEnabled": true
  }
]`;

  return `
<!doctype html>
<html lang="zh-Hant">

<head>

<meta charset="utf-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<title>
V7 今日標的一鍵匯入
</title>

<style>

body {
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    "Microsoft JhengHei",
    sans-serif;

  background: #f4f6f8;
  margin: 0;
  padding: 20px;
}

.wrap {
  max-width: 1100px;
  margin: auto;
}

.panel {
  background: white;
  padding: 20px;
  border-radius: 14px;
  margin-bottom: 15px;

  box-shadow:
    0 2px 10px
    rgba(0,0,0,.08);
}

input,
textarea {
  width: 100%;
  box-sizing: border-box;

  padding: 11px;

  border:
    1px solid #bbb;

  border-radius: 8px;

  font-family:
    Consolas,
    monospace;
}

textarea {
  min-height: 430px;
  resize: vertical;
}

label {
  display: block;
  font-weight: 900;
  margin-bottom: 6px;
}

button,
.back {
  display: inline-block;
  border: 0;

  padding:
    11px 16px;

  border-radius: 8px;

  font-weight: 900;

  cursor: pointer;

  text-decoration: none;
}

.primary {
  background: #1f6feb;
  color: white;
}

.secondary {
  background: #e5e7eb;
  color: #222;
}

.danger {
  background: #c62828;
  color: white;
}

.back {
  background: #555;
  color: white;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.msg {
  margin-top: 15px;
  padding: 12px;
  background: #eef2f5;
  border-radius: 8px;
  white-space: pre-wrap;
}

.note {
  line-height: 1.7;
  color: #555;
}

</style>

</head>

<body>

<div class="wrap">

<div class="panel">

<h1>
V7 今日標的一鍵匯入
</h1>

<div class="note">

以後不用一檔一檔填。

ChatGPT 選股完成後，
直接產生整包匯入碼。

你只需貼進下面方框，
按一次「一鍵匯入」。

<br>

/api/push 可接收選股系統輸出的 stocks 或 candidates，
完成串接後不需人工貼入。

</div>

<br>

<a
  class="back"
  href="/"
>
← 回監控頁
</a>

</div>


<div class="panel">

<label>
ADMIN_TOKEN
</label>

<input
  id="token"
  type="password"
  autocomplete="off"
  placeholder="輸入你的 ADMIN_TOKEN"
>

</div>


<div class="panel">

<label>
今日標的匯入碼
</label>
<label for="capital">總資金（元）：只調整未建倉計畫，不下單</label>
<input id="capital" type="number" min="1" value="200000">
<button class="secondary" onclick="changeCapital(true)">預覽資金重算</button>
<button class="primary" onclick="changeCapital(false)">儲存總資金並重算</button>
<p class="note">已有持倉或缺少配置比例時會拒絕重算，避免覆寫持倉股數。</p>

<textarea
  id="payload"
  spellcheck="false"
  placeholder='把 ChatGPT 給你的整包 JSON 貼在這裡'
></textarea>


<div class="actions">

<button
  class="primary"
  onclick="importNow()"
>
一鍵匯入今日標的
</button>

<button
  class="secondary"
  onclick="loadCurrent()"
>
載入目前設定
</button>

<button
  class="danger"
  onclick="clearAll()"
>
今日 0 檔
</button>

</div>


<div
  id="msg"
  class="msg"
>
尚未操作。
</div>

</div>


<div class="panel">

<b>格式範例：</b>

<pre>
${h(example)}
</pre>

</div>

</div>


<script>

function token() {
  return document
    .getElementById("token")
    .value
    .trim();
}


function msg(
  text,
  good = true
) {
  const el =
    document
      .getElementById("msg");

  el.textContent =
    text;

  el.style.background =
    good
      ? "#eef7ee"
      : "#fdeaea";
}


async function callApi(
  method,
  body,
  path = "/api/config"
) {
  const t =
    token();

  if (!t) {
    throw new Error(
      "請先輸入 ADMIN_TOKEN"
    );
  }

  const options = {
    method,

    headers: {
      "x-admin-token": t,
      "content-type":
        "application/json"
    },

    cache: "no-store"
  };

  if (
    body !== undefined
  ) {
    options.body =
      JSON.stringify(body);
  }

  const res =
    await fetch(
      path,
      options
    );

  const data =
    await res.json();

  if (!res.ok) {
    throw new Error(
      data.error ||
      "HTTP " +
      res.status
    );
  }

  return data;
}


async function changeCapital(preview) {
  try {
    const result = await callApi("POST", {totalCapital:Number(document.getElementById("capital").value), preview}, "/api/capital");
    msg((preview ? "預覽，不會寫入：" : "資金重算已儲存：") + JSON.stringify(result, null, 2));
  } catch (e) { msg(String(e), false); }
}

async function importNow() {
  try {
    const text =
      document
        .getElementById("payload")
        .value
        .trim();

    if (!text) {
      throw new Error(
        "請貼上今日標的匯入碼"
      );
    }

    const stocks =
      JSON.parse(text);

    msg(
      "匯入中..."
    );

    const result =
      await callApi(
        "POST",
        { stocks }
      );

    msg(
      "匯入成功！共 " +
      result.count +
      " 檔。\\n回監控頁即可開始使用。"
    );

  } catch (e) {
    msg(
      String(e),
      false
    );
  }
}


async function loadCurrent() {
  try {
    const data =
      await callApi(
        "GET"
      );

    document
      .getElementById(
        "payload"
      )
      .value =
      JSON.stringify(
        data.stocks,
        null,
        2
      );

    msg(
      "已載入目前設定，共 " +
      data.stocks.length +
      " 檔。"
    );

  } catch (e) {
    msg(
      String(e),
      false
    );
  }
}


async function clearAll() {
  if (
    !confirm(
      "確定今天不監控任何標的？"
    )
  ) {
    return;
  }

  try {
    const result =
      await callApi(
        "POST",
        { stocks: [] }
      );

    document
      .getElementById(
        "payload"
      )
      .value = "[]";

    msg(
      "已設定今日 0 檔。"
    );

  } catch (e) {
    msg(
      String(e),
      false
    );
  }
}

</script>

</body>

</html>
`;
}


function waitingLivePage(loaded, liveState, hasD1Binding, cronStatus = null) {
  return `
<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="15">
<title>V7 即時監控初始化</title>
<style>body{font-family:"Microsoft JhengHei",sans-serif;background:#f4f6f8;padding:30px}.box{max-width:900px;margin:70px auto;background:white;padding:30px;border-radius:14px;box-shadow:0 2px 10px rgba(0,0,0,.08)}.ok{font-weight:900;color:#1b5e20}.warn{font-weight:900;color:#9a6700}</style>
</head><body><div class="box"><h1>V7 Phase 4.2 即時監控</h1>
<p>已載入 <b>${loaded.stocks.length}</b> 檔監控標的，但尚未取得第一輪盤中 Live State。</p>
<p class="${hasD1Binding ? "ok" : "warn"}">${hasD1Binding ? "D1 Binding 已存在。" : "尚未設定 V7_DB D1 Binding，目前只能暫用 KV fallback。"}</p>
<p>背景排程跑第一輪後，這個頁面會自動顯示現價、10分K、15分K與操作訊號；網頁只讀 D1，不會呼叫 Fugle API。</p>
<p><b>Cron 實際執行：</b>${cronStatus
  ? `${h(cronStatus.cron_expression || "-")}｜${h(cronJobLabel(cronStatus.job_type))}｜${h(cronStatusLabel(cronStatus.status))}｜${h(formatIso(cronStatus.scheduled_at))}`
  : "尚無紀錄；第一次排程觸發後會自動顯示。"
}</p>
<p>設定來源：${h(loaded.source)}｜設定更新：${h(formatIso(loaded.updatedAt))}</p>
</div></body></html>`;
}

// ======================================================
// 空名單
// ======================================================

function emptyPage(
  loaded
) {
  return `
<!doctype html>

<html lang="zh-Hant">

<head>

<meta charset="utf-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<title>
V7 半自動交易決策監控
</title>

<style>

body {
  font-family:
    "Microsoft JhengHei",
    sans-serif;

  background:
    #f4f6f8;

  padding: 30px;
}

.box {
  max-width: 900px;
  margin: 70px auto;

  background: white;

  padding: 30px;

  border-radius: 14px;
}

a {
  display: inline-block;

  padding:
    10px 16px;

  background:
    #1f6feb;

  color: white;

  text-decoration: none;

  border-radius: 8px;

  font-weight: 900;
}

</style>

</head>

<body>

<div class="box">

<h1>
今日 0 檔，維持現金
</h1>

<p>
設定來源：
${h(loaded.source)}
</p>

<a href="/admin">
⚙ 匯入今日標的
</a>

</div>

</body>

</html>
`;
}


// ======================================================
// 錯誤頁
// ======================================================

function errorPage(error) {
  return `
<!doctype html>

<html>

<head>
<meta charset="utf-8">
</head>

<body>

<h2>
V7 設定錯誤
</h2>

<pre>
${h(error)}
</pre>

<a href="/admin">
前往一鍵匯入
</a>

</body>

</html>
`;
}


// ======================================================
// 工具
// ======================================================

function modeText(mode) {
  if (
    mode === "PULLBACK"
  ) {
    return "拉回承接型";
  }

  if (
    mode === "MOMENTUM"
  ) {
    return "突破後承接型";
  }

  return "A拉回承接＋B突破後承接";
}

function positionStageText(stage) {
  if (stage === "FIRST") return "已完成第一筆";
  if (stage === "FULL") return "已完成第二筆";
  return "尚未持有";
}


function toNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const n =
    Number(value);

  return Number.isFinite(n)
    ? n
    : null;
}

function sharesFor(amount, price) {
  if (amount === null || price === null || price <= 0) return null;
  return Math.floor(amount / price);
}


function fmt(value) {
  if (value === null) {
    return "-";
  }

  return Number(value)
    .toLocaleString(
      "zh-TW",
      {
        maximumFractionDigits: 2
      }
    );
}


function round(
  value,
  digits = 2
) {
  const p =
    10 ** digits;

  return (
    Math.round(
      value * p
    ) / p
  );
}


function taiwanTime() {
  return new Intl.DateTimeFormat(
    "zh-TW",
    {
      timeZone:
        "Asia/Taipei",

      year: "numeric",
      month: "2-digit",
      day: "2-digit",

      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",

      hour12: false
    }
  )
  .format(
    new Date()
  );
}


function formatIso(value) {
  if (!value) {
    return "-";
  }

  try {
    return new Intl.DateTimeFormat(
      "zh-TW",
      {
        timeZone:
          "Asia/Taipei",

        year: "numeric",
        month: "2-digit",
        day: "2-digit",

        hour: "2-digit",
        minute: "2-digit"
      }
    )
    .format(
      new Date(value)
    );

  } catch {
    return value;
  }
}


function h(value) {
  return String(
    value ?? ""
  )
  .replaceAll(
    "&",
    "&amp;"
  )
  .replaceAll(
    "<",
    "&lt;"
  )
  .replaceAll(
    ">",
    "&gt;"
  )
  .replaceAll(
    '"',
    "&quot;"
  )
  .replaceAll(
    "'",
    "&#039;"
  );
}


function json(
  data,
  status = 200,
  noStore = false
) {
  const headers = {
    "content-type":
      "application/json; charset=UTF-8"
  };

  if (noStore) {
    headers[
      "cache-control"
    ] = "no-store";
  }

  return new Response(
    JSON.stringify(
      data,
      null,
      2
    ),
    {
      status,
      headers
    }
  );
}


function html(
  body,
  status = 200,
  noStore = false
) {
  const headers = {
    "content-type":
      "text/html; charset=UTF-8"
  };

  if (noStore) {
    headers[
      "cache-control"
    ] = "no-store";
  }

  return new Response(
    body,
    {
      status,
      headers
    }
  );
}
