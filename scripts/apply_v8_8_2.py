from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text=text.replace(old,new,1)

def insert_after_once(marker,addition,label):
    global text
    count=text.count(marker)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 marker, found {count}")
    text=text.replace(marker,marker+addition,1)

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

send_marker='''      : await sendTrackedPush(dailyPayload, env,{note:"每日盤後結果／0檔回報"});'''
insert_after_once(
    send_marker,
    '''
    if(!isTestMode(env) && (report?.sent!==true || report?.deliveryState!=="ACCEPTED")) {
      throw new Error("DAILY_RESULT_PUSH_NOT_ACCEPTED：盤後選股已完成，但每日結果推播未被Webhook接受；不得把本輪標成成功，也不得把0檔誤當通知完成");
    }''',
    "mandatory daily result acceptance"
)

# Persist explicit zero-selection/push-required semantics with the existing daily-report record.
replace_once(
    '''selectedCount:dailyPayload.selectedCount,checkedAt:new Date().toISOString()''',
    '''selectedCount:dailyPayload.selectedCount,zeroSelection:dailyPayload.zeroSelection,pushRequired:true,checkedAt:new Date().toISOString()''',
    "daily report persisted push semantics"
)

pipeline_marker='''      dailyWebhookAccepted: report.sent === true && report.simulated !== true,''';
insert_after_once(
    pipeline_marker,
    '''
      dailyDeliveryState: report.deliveryState || (report.sent === true ? "WEBHOOK_ACCEPTED_UNTRACKED" : "NOT_ACCEPTED"),
      dailyResultPushRequired: true,
      dailyResultZeroSelection: stocks.length === 0,''',
    "pipeline daily delivery semantics"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.8.2 zero-selection push guard")
