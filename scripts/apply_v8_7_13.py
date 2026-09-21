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
    'const VERSION = "8.7.12-after-market-2335";',
    'const VERSION = "8.7.13-daily-mobile-alert";',
    "runtime version"
)

# The 2026-09-21 real DAILY_SELECTION reached #v7-alerts at 23:36,
# but the handset did not surface a notification. Incoming-webhook HTTP 2xx
# proves Slack accepted the message, not that iOS displayed it.
# Make the once-per-day formal result an explicit Slack channel mention so
# mention-only mobile notification policies do not silently hide it.
replace_once(
    '      `📋 *${payload.title}*`, payload.instruction,',
    '      `<!channel>\\n📋 *${payload.title}*`, payload.instruction,',
    "daily selection channel alert"
)

# Ask Slack to resolve special mentions for the formal daily result.
replace_once(
'''  const body = isSlackIncomingWebhook
    ? { text: formatSlackSignalMessage(payload) }
    : payload;''',
'''  const body = isSlackIncomingWebhook
    ? { text: formatSlackSignalMessage(payload), ...(payload?.signalType === "DAILY_SELECTION" ? { link_names: 1 } : {}) }
    : payload;''',
    "slack daily mention parsing"
)

# After midnight but before the current trading session has completed, the
# active formal plan still belongs to the previous completed trading day.
# The old recovery guard used the calendar weekday and rejected that valid
# plan with HTTP 409, which also blocked deployments after midnight.
# Idempotent recovery: once the current stored plan has already been accepted and
# exactly read back, repeated recovery checks must return success without another
# external POST. This keeps acceptance probes safe and stable.
replace_once(
    '''        const latest=await env.STOCKS_KV.get(LAST_SCAN_KEY,"json");
        const config=await env.STOCKS_KV.get(KV_KEY,"json");
        if(!latest || !config) return json({error:"缺少目前盤後計畫或監控設定；停止修復",noWrite:true,noPlanChanges:true,noPush:true},409,true);''',
    '''        const latest=await env.STOCKS_KV.get(LAST_SCAN_KEY,"json");
        const config=await env.STOCKS_KV.get(KV_KEY,"json");
        if(!latest || !config) return json({error:"缺少目前盤後計畫或監控設定；停止修復",noWrite:true,noPlanChanges:true,noPush:true},409,true);
        if(latest.threeMin?.sent===true && latest.threeMin?.simulated!==true && latest.threeMin?.verified===true &&
           latest.diagnostics?.requirements30?.requirement26?.complete===true) {
          return json({ok:true,recovered:true,scanDate:latest.scanDate,planDate:latest.threeMinPayload?.planDate||null,
            selectedCount:Number(latest.selectedCount||0),externalPostPerformed:false,recoveredFromExistingRecord:true,
            threeMinAccepted:true,threeMinVerified:true,httpStatus:latest.threeMin?.httpStatus??200,requirement26Complete:true,
            noSelection:true,noPlanChanges:true,noPush:true},200,true);
        }''',
    "already verified current-plan recovery"
)

replace_once(
    '        const currentMarketDate=mostRecentWeekday(today);',
'''        const taipeiHour=Number(new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Taipei",hour:"2-digit",hourCycle:"h23"}).format(new Date()));
        let currentMarketDate=today;
        if(!isTradingDate(today) || taipeiHour<14) {
          currentMarketDate=shiftDateString(today,-1);
          while(!isTradingDate(currentMarketDate)) currentMarketDate=shiftDateString(currentMarketDate,-1);
        }''',
    "current formal plan date across midnight"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.7.13 daily Slack mobile alert hardening")