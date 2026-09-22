from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text=text.replace(old,new,1)

replace_once(
    'const VERSION = "8.8.1-execution-coverage";',
    'const VERSION = "8.8.2-zero-selection-push-failsafe";',
    "runtime version"
)

replace_once(
'''  let report = /** @type {any} */ ({ sent: false, simulated: true, skipped: dryRun });''',
'''  let report = /** @type {any} */ ({ sent: false, simulated: true, skipped: dryRun });
  let zeroSelectionConfirmation = /** @type {any} */ ({
    sent:false,simulated:dryRun,skipped:true,reason:dryRun ? "dry-run" : "NOT_ZERO_SELECTION"
  });''',
    "zero-selection state"
)

replace_once(
'''function pick(object, keys) {''',
'''function buildZeroSelectionConfirmPayload(scanDate) {
  return {
    version:VERSION,
    signalId:`DAILY_ZERO_SELECTION_CONFIRM:${scanDate}`,
    signalType:"DAILY_ZERO_SELECTION_CONFIRM",
    signalLabel:"盤後0檔確認",
    tradeDate:scanDate,
    resultType:"ZERO_MATCH",
    selectedCount:0,
    title:"V8盤後正式結果｜0 檔",
    instruction:"盤後掃描已完成；今日沒有符合正式條件的標的。這不是漏跑，明日維持現金等待。",
    time:taiwanTime(),
    monitorUrl:"https://fugle-test.imihan0630.workers.dev/"
  };
}

function pick(object, keys) {''',
    "zero-selection payload helper"
)

replace_once(
'''function formatSlackSignalMessage(payload) {
  if (payload?.signalType === "DAILY_SELECTION") {''',
'''function formatSlackSignalMessage(payload) {
  if (payload?.signalType === "DAILY_ZERO_SELECTION_CONFIRM") {
    return [
      `<!channel>\\n🔔 *${payload.title}*`,
      payload.instruction,
      "正式 SELECTED：0 檔",
      "狀態：掃描完成，不是系統漏跑",
      `監控：${payload.monitorUrl}`,
      `時間：${payload.time}`
    ].join("\\n\\n");
  }
  if (payload?.signalType === "DAILY_SELECTION") {''',
    "zero-selection Slack formatter"
)

replace_once(
'''    ? { text: formatSlackSignalMessage(payload), ...(payload?.signalType === "DAILY_SELECTION" ? { link_names: 1 } : {}) }
    : payload;''',
'''    ? { text: formatSlackSignalMessage(payload), ...(["DAILY_SELECTION","DAILY_ZERO_SELECTION_CONFIRM"].includes(payload?.signalType) ? { link_names: 1 } : {}) }
    : payload;''',
    "zero-selection mention parsing"
)

replace_once(
'''    await env.STOCKS_KV.put(reportKey, JSON.stringify({...report,signalId:dailyPayload.signalId,resultType:dailyPayload.resultType,
      selectedCount:dailyPayload.selectedCount,checkedAt:new Date().toISOString()}), { expirationTtl: 30 * 86400 });''',
'''    await env.STOCKS_KV.put(reportKey, JSON.stringify({...report,signalId:dailyPayload.signalId,resultType:dailyPayload.resultType,
      selectedCount:dailyPayload.selectedCount,checkedAt:new Date().toISOString()}), { expirationTtl: 30 * 86400 });
    if(stocks.length===0) {
      const zeroPayload=buildZeroSelectionConfirmPayload(marketDate);
      zeroSelectionConfirmation=await sendTrackedPush(zeroPayload,env,{note:"盤後0檔備援確認推播"});
    }''',
    "zero-selection failsafe delivery"
)

replace_once(
'''    dailyReport: report,
    journal,''',
'''    dailyReport: report,
    zeroSelectionConfirmation,
    journal,''',
    "zero-selection scan summary"
)

replace_once(
'''      dailyReportAccepted: report.sent === true && report.simulated !== true,''',
'''      dailyReportAccepted: report.sent === true && report.simulated !== true,
      zeroSelectionConfirmationAccepted: stocks.length ? null :
        (zeroSelectionConfirmation.sent === true && zeroSelectionConfirmation.simulated !== true),
      deliverySemantics:"WEBHOOK_ACCEPTED_DOES_NOT_PROVE_HANDSET_RECEIPT",''',
    "zero-selection pipeline evidence"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.8.2 zero-selection push failsafe")
