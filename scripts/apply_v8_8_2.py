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
    'const VERSION = "8.8.2-zero-selection-push-guard";',
    "runtime version"
)

old_guard='''        if((lease.snapshot?.status==="SUCCESS" && Boolean(lease.snapshot.testMode)===isTestMode(env)) || (latest?.scanDate===marketDate && Boolean(latest.dailyReport?.simulated)===isTestMode(env))) return {skipped:true,reason:"ALREADY_SCANNED",scanDate:marketDate,noSelectionOrExternalWrite:true};'''
new_guard='''        const dailyResultAccepted=latest?.scanDate===marketDate &&
          latest?.dailyReport?.sent===true &&
          Boolean(latest?.dailyReport?.simulated)===isTestMode(env) &&
          (isTestMode(env) || latest?.dailyReport?.deliveryState==="ACCEPTED");
        if(dailyResultAccepted) return {skipped:true,reason:"ALREADY_SCANNED",scanDate:marketDate,noSelectionOrExternalWrite:true};'''
replace_once(old_guard,new_guard,"after-market idempotency requires accepted daily result")

replace_once(
    '''    selectedCount:stocks.length,
    title: stocks.length ? `V7盤後選出 ${stocks.length} 檔` : "V7盤後：今日 0 檔，維持現金",''',
    '''    selectedCount:stocks.length,
    zeroSelection:stocks.length===0,
    pushRequired:true,
    title: stocks.length ? `V7盤後選出 ${stocks.length} 檔` : "V8盤後選股完成：0 檔符合，維持現金",''',
    "daily payload zero-selection push invariant"
)

replace_once(
    '''    report = previousReport?.sent === true && Boolean(previousReport.simulated) === isTestMode(env) ? { ...previousReport, deduplicated: true }
      : await sendTrackedPush(dailyPayload, env,{note:"每日盤後結果／0檔回報"});
    await env.STOCKS_KV.put(reportKey, JSON.stringify({...report,signalId:dailyPayload.signalId,resultType:dailyPayload.resultType,
      selectedCount:dailyPayload.selectedCount,checkedAt:new Date().toISOString()}), { expirationTtl: 30 * 86400 });''',
    '''    report = previousReport?.sent === true && Boolean(previousReport.simulated) === isTestMode(env) ? { ...previousReport, deduplicated: true }
      : await sendTrackedPush(dailyPayload, env,{note:"每日盤後結果／0檔回報"});
    if(!isTestMode(env) && (report?.sent!==true || report?.deliveryState!=="ACCEPTED")) {
      throw new Error("DAILY_RESULT_PUSH_NOT_ACCEPTED：盤後選股已完成，但每日結果推播未被Webhook接受；不得把本輪標成成功，也不得把0檔誤當通知完成");
    }
    await env.STOCKS_KV.put(reportKey, JSON.stringify({...report,signalId:dailyPayload.signalId,resultType:dailyPayload.resultType,
      selectedCount:dailyPayload.selectedCount,zeroSelection:dailyPayload.zeroSelection,pushRequired:true,
      checkedAt:new Date().toISOString()}), { expirationTtl: 30 * 86400 });''',
    "mandatory daily result acceptance"
)

replace_once(
    '''      dailyWebhookAccepted: report.sent === true && report.simulated !== true,
      phoneReceiptVerified: report.receiptVerified === true,
      complete:''',
    '''      dailyWebhookAccepted: report.sent === true && report.simulated !== true,
      dailyDeliveryState: report.deliveryState || (report.sent === true ? "WEBHOOK_ACCEPTED_UNTRACKED" : "NOT_ACCEPTED"),
      dailyResultPushRequired: true,
      dailyResultZeroSelection: stocks.length === 0,
      phoneReceiptVerified: report.receiptVerified === true,
      complete:''',
    "pipeline daily delivery semantics"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.8.2 zero-selection push guard")
