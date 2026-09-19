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
    'const VERSION = "8.0.4-3min-current-plan-recovery";',
    'const VERSION = "8.0.5-system-dashboard";',
    "runtime version",
)

version_route = '''    if (url.pathname === "/api/version") return json({ version: VERSION, testMode: isTestMode(env),
      bindings: { kv: !!env.STOCKS_KV, d1: !!env.V7_DB },
      readiness: { quote: !!env.FUGLE_API_KEY, phonePush: !!env.PUSH_WEBHOOK_URL, threeMin: !!env.THREEMIN_API_URL,
        threeMinReadback: !!env.THREEMIN_VERIFY_URL }, requirements30Complete: false, monitorUrl: url.origin }, 200, true);
'''

routes = version_route + '''
    if (url.pathname === "/api/system-status") {
      if (request.method !== "GET") return json({error:"Method not allowed"},405,true);
      return json(await buildSystemStatus(env,url.origin),200,true);
    }
    if (url.pathname === "/system") {
      if (request.method !== "GET") return new Response("Method not allowed",{status:405});
      return html(renderSystemDashboard(await buildSystemStatus(env,url.origin)),200,true);
    }
'''
replace_once(version_route, routes, "system dashboard routes")

anchor = '''function snapshotAgeSeconds(snapshot) {
  const ms = Date.parse(snapshot?.generatedAtIso || "");
  return Number.isFinite(ms) ? Math.max(0, Math.floor((Date.now() - ms) / 1000)) : null;
}
'''

helpers = '''function requirementCatalog(incompleteRules) {
  const pending = new Set(Array.isArray(incompleteRules) ? incompleteRules.map(Number) : []);
  const pendingReason = {
    17:"六類盤中操作訊號仍需真實行情觸發與手機端實收驗收",
    18:"跨系統推播在網路結果不明時仍需Outbox稽核與真實端到端驗收",
    19:"賣出／減碼／停損仍需實際持股與成交股數來源驗收",
    27:"每日盤後結果仍需真實手機實收與0檔／資料異常情境驗收",
    28:"外部App交叉驗證尚缺真實參考資料與持續績效統計",
    29:"整體30項尚未全部完成，因此總系統仍保持未完成狀態"
  };
  return Array.from({length:30},(_,index)=>{
    const rule=index+1,isPending=pending.has(rule);
    return {rule,status:isPending?"PENDING_ACCEPTANCE":"COMPLETE",complete:!isPending,reason:isPending?(pendingReason[rule]||"仍待正式環境驗收"):"已完成目前規格與既有驗收"};
  });
}

async function buildSystemStatus(env,origin) {
  const [latest,attempt,cron,live,config] = await Promise.all([
    env.STOCKS_KV ? env.STOCKS_KV.get(LAST_SCAN_KEY,"json") : null,
    env.STOCKS_KV ? env.STOCKS_KV.get("V7_LAST_SCAN_ATTEMPT","json") : null,
    readLatestCronRun(env),readLiveSnapshot(env),
    env.STOCKS_KV ? env.STOCKS_KV.get(KV_KEY,"json") : null
  ]);
  const incompleteRules=Array.isArray(latest?.diagnostics?.requirements30?.incompleteRules)?latest.diagnostics.requirements30.incompleteRules.map(Number).filter(rule=>rule>=1&&rule<=30):[17,18,19,27,28,29];
  const rules=requirementCatalog(incompleteRules),completedCount=rules.filter(item=>item.complete).length,pendingCount=30-completedCount;
  const selected=Array.isArray(latest?.stocks)?latest.stocks:[],liveAge=snapshotAgeSeconds(live),pipeline=latest?.pipeline||{};
  return {
    version:VERSION,generatedAt:taiwanTime(),testMode:isTestMode(env),monitorUrl:origin,dashboardUrl:origin+"/system",
    overall:{requirementsComplete:completedCount,requirementsTotal:30,pendingCount,percent:round(completedCount/30*100,1),complete:pendingCount===0,incompleteRules},
    runtime:{kv:Boolean(env.STOCKS_KV),d1:Boolean(env.V7_DB),fugle:Boolean(env.FUGLE_API_KEY),phonePush:Boolean(env.PUSH_WEBHOOK_URL),threeMinWrite:Boolean(env.THREEMIN_API_URL),threeMinReadback:Boolean(env.THREEMIN_VERIFY_URL),adminConfigured:Boolean(env.ADMIN_TOKEN)},
    cron:cron?{jobType:cron.job_type||null,status:cron.status||null,scheduledAt:cron.scheduled_at||null,finishedAt:cron.finished_at||null,skipped:Boolean(cron.skipped),error:cron.error||null}:null,
    live:{tradeDate:live?.tradeDate||null,generatedAt:live?.generatedAt||null,ageSeconds:liveAge,stale:liveAge!==null?liveAge>LIVE_STALE_SECONDS:null,monitoredCount:Number(live?.monitoredCount||0),notificationCount:Array.isArray(live?.notifications)?live.notifications.length:0},
    afterMarket:{attemptStatus:attempt?.status||null,requestedDate:attempt?.requestedDate||null,scanDate:latest?.scanDate||null,generatedAt:latest?.generatedAt||null,selectedCount:selected.length,selected:selected.map(stock=>({symbol:String(stock.symbol||""),name:stock.name||"",signalLevel:stock.signalLevel||null,channel:stock.channel||null})),configAccepted:pipeline.configAccepted===true,configVerified:pipeline.configVerified===true,threeMinAccepted:pipeline.threeMinAccepted===true,threeMinVerified:pipeline.threeMinVerified===true,dailyReportAccepted:pipeline.dailyReportAccepted===true,pipelineComplete:pipeline.complete===true,configUpdatedAt:config?.updatedAt||latest?.config?.updatedAt||null},
    rules,safety:{secretsExposed:false,readOnly:true,noSelection:true,noPush:true,noPlanChanges:true}
  };
}

function renderSystemDashboard(status) {
  const esc=value=>String(value??"").replace(/[&<>]/g,ch=>ch==="&"?"&amp;":ch==="<"?"&lt;":"&gt;");
  const badge=(ok,yes="完成",no="待驗收")=>"<span class=\"badge "+(ok?"ok":"pending")+"\">"+esc(ok?yes:no)+"</span>";
  const rows=status.rules.map(item=>"<tr><td>"+item.rule+"</td><td>"+badge(item.complete)+"</td><td>"+esc(item.reason)+"</td></tr>").join("");
  const stocks=status.afterMarket.selected.length?status.afterMarket.selected.map(stock=>"<span class=\"stock\">"+esc(stock.symbol)+" "+esc(stock.name)+"</span>").join(" "):"<span class=\"muted\">0檔</span>";
  const cron=status.cron||{};
  return [
    "<!doctype html><html lang=\"zh-Hant\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta http-equiv=\"refresh\" content=\"30\"><title>V8 系統總控驗收</title>",
    "<style>body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Microsoft JhengHei,sans-serif;background:#f4f6f8;margin:0;color:#1f2328}.wrap{max-width:1180px;margin:auto;padding:20px}.top{display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap}h1{margin:0}.sub{color:#667085}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:18px 0}.card{background:#fff;border-radius:14px;padding:16px;box-shadow:0 2px 10px rgba(0,0,0,.06)}.big{font-size:30px;font-weight:900}.ok{background:#e7f7ed;color:#176b36}.pending{background:#fff3cd;color:#7a5700}.badge{display:inline-block;padding:4px 9px;border-radius:999px;font-weight:800;font-size:13px}.row{padding:6px 0;border-bottom:1px solid #eee}table{width:100%;border-collapse:collapse;background:#fff}th,td{padding:10px;border-bottom:1px solid #eee;text-align:left;vertical-align:top}th{background:#eef2f6}.stock{display:inline-block;background:#eef2f6;border-radius:8px;padding:5px 8px;margin:3px}.muted{color:#667085}</style></head><body><div class=\"wrap\">",
    "<div class=\"top\"><div><h1>V8 台股半自動交易決策監控｜30項總控</h1><div class=\"sub\">版本 "+esc(status.version)+"｜更新 "+esc(status.generatedAt)+"｜30秒自動刷新</div></div><div><a href=\"/\">監控首頁</a>｜<a href=\"/api/system-status\">JSON狀態</a></div></div>",
    "<div class=\"grid\"><div class=\"card\"><div class=\"sub\">30項完成度</div><div class=\"big\">"+status.overall.requirementsComplete+"/30</div><div>"+status.overall.percent+"%｜待驗收 "+status.overall.pendingCount+" 項</div></div>",
    "<div class=\"card\"><div class=\"sub\">盤後Pipeline</div><div class=\"big\">"+(status.afterMarket.pipelineComplete?"✅":"⚠️")+"</div>"+badge(status.afterMarket.pipelineComplete,"完整","尚未完整")+"</div>",
    "<div class=\"card\"><div class=\"sub\">3Min</div><div class=\"row\">寫入 "+badge(status.afterMarket.threeMinAccepted)+"</div><div class=\"row\">讀回 "+badge(status.afterMarket.threeMinVerified)+"</div></div>",
    "<div class=\"card\"><div class=\"sub\">Runtime</div><div class=\"row\">KV "+badge(status.runtime.kv)+"</div><div class=\"row\">D1 "+badge(status.runtime.d1)+"</div><div class=\"row\">Fugle "+badge(status.runtime.fugle)+"</div><div class=\"row\">推播設定 "+badge(status.runtime.phonePush)+"</div></div></div>",
    "<div class=\"card\"><h2>最新盤後計畫</h2><div class=\"row\">掃描日："+esc(status.afterMarket.scanDate||"-")+"｜標的："+status.afterMarket.selectedCount+"檔｜設定讀回："+badge(status.afterMarket.configVerified)+"</div><div>"+stocks+"</div></div>",
    "<div class=\"grid\"><div class=\"card\"><h2>最後Cron</h2><div class=\"row\">工作："+esc(cron.jobType||"-")+"</div><div class=\"row\">狀態："+esc(cron.status||"-")+"</div><div class=\"row\">完成："+esc(cron.finishedAt||"-")+"</div></div><div class=\"card\"><h2>盤中Live</h2><div class=\"row\">交易日："+esc(status.live.tradeDate||"-")+"</div><div class=\"row\">監控："+status.live.monitoredCount+"檔</div><div class=\"row\">資料年齡："+(status.live.ageSeconds===null?"-":status.live.ageSeconds+"秒")+"</div></div></div>",
    "<h2>30項驗收狀態</h2><table><thead><tr><th>項目</th><th>狀態</th><th>說明</th></tr></thead><tbody>"+rows+"</tbody></table><p class=\"sub\">本頁只讀，不顯示任何Token、Webhook或秘密值；不重新選股、不推播、不更動交易計畫。</p>",
    "</div></body></html>"
  ].join("");
}

''' + anchor
replace_once(anchor, helpers, "system dashboard helpers")

path.write_text(text, encoding="utf-8")
print("Applied V8.0.5 system acceptance dashboard")