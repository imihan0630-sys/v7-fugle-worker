from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected exactly 1 match, found {count}")
    text=text.replace(old,new,1)

replace_once(
    'const VERSION = "7.5.30-market-consensus-radar";',
    'const VERSION = "7.5.31-push-receipt-clarity";',
    "version"
)

replace_once(
'''    // ==================================================
    // Phase 4.5.2：Slack Incoming Webhook 實際送達測試
    // 僅 TEST_MODE=true 可用；需 ADMIN_TOKEN。
    // POST /api/slack-test''',
'''    // ==================================================
    // 7.5.31：正式環境安全推播鏈路測試
    // 需 ADMIN_TOKEN；只送 SYSTEM_TEST，不改股票設定、不寫交易狀態、不產生交易訊號。
    // POST /api/push-test
    // ==================================================
    if (url.pathname === "/api/push-test") {
      if (!isAuthorized(request, env)) return json({ error: "未授權" }, 401, true);
      if (request.method !== "POST") return json({ error: "只接受 POST" }, 405, true);
      const payload = {
        type: "SYSTEM_TEST",
        title: "V7 手機推播鏈路測試",
        message: "如果你看到這則通知，代表 Worker → Webhook → 手機通知鏈路已實際到達。",
        time: taiwanTime()
      };
      const result = await sendPushDirect(payload, env);
      if (env.STOCKS_KV) await env.STOCKS_KV.put("V7_LAST_PUSH_TEST", JSON.stringify({
        ...result,
        testedAt: new Date().toISOString(),
        testMode: isTestMode(env)
      }), { expirationTtl: 7 * 86400 });
      return json({
        ok: result.sent === true,
        version: VERSION,
        generatedAt: taiwanTime(),
        testMode: isTestMode(env),
        result,
        note: "sent=true 只代表 Webhook HTTP 接受；receiptVerified=false 時仍需手機端實收確認"
      }, result.sent ? 200 : 502, true);
    }

    // ==================================================
    // Phase 4.5.2：Slack Incoming Webhook 實際送達測試
    // 僅 TEST_MODE=true 可用；需 ADMIN_TOKEN。
    // POST /api/slack-test''',
    "production push test endpoint"
)

replace_once(
'''    if (!response.ok) {
      return {
        sent: false,
        simulated: false,
        httpStatus: response.status,
        error: await response.text()
      };
    }

    return { sent: true, simulated: false, httpStatus: response.status };''',
'''    if (!response.ok) {
      return {
        sent: false,
        simulated: false,
        httpStatus: response.status,
        provider: isSlackIncomingWebhook ? "SLACK_WEBHOOK" : "GENERIC_WEBHOOK",
        receiptVerified: false,
        error: await response.text()
      };
    }

    return {
      sent: true,
      simulated: false,
      httpStatus: response.status,
      provider: isSlackIncomingWebhook ? "SLACK_WEBHOOK" : "GENERIC_WEBHOOK",
      receiptVerified: false,
      deliveryMeaning: "Webhook HTTP accepted; phone receipt not independently verified"
    };''',
    "push delivery semantics"
)

replace_once(
'''      dailyReportAccepted: report.sent === true && report.simulated !== true,
      complete: !dryRun && saved.verified === true && bridge.verified === true && bridge.simulated !== true && report.sent === true && report.simulated !== true''',
'''      dailyReportAccepted: report.sent === true && report.simulated !== true,
      dailyWebhookAccepted: report.sent === true && report.simulated !== true,
      phoneReceiptVerified: report.receiptVerified === true,
      complete: !dryRun && saved.verified === true && bridge.verified === true && bridge.simulated !== true && report.sent === true && report.simulated !== true''',
    "pipeline receipt fields"
)

replace_once(
'''      scope: "資料選股、匯入與通知傳輸驗證；不代表30條全部已實作或手機已收到",''',
'''      scope: "資料選股、匯入與Webhook傳輸驗證；Webhook 2xx不等於手機實收，手機收件需獨立確認",''',
    "pipeline scope wording"
)

path.write_text(text,encoding="utf-8")
print("Applied V7.5.31 push receipt clarity")
