from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text=text.replace(old,new,1)

def insert_before_once(marker,addition,label):
    global text
    count=text.count(marker)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 marker, found {count}")
    text=text.replace(marker,addition+marker,1)

replace_once(
    'const VERSION = "8.9.7-recovery-hardening";',
    'const VERSION = "8.9.8-staged-recovery";',
    "runtime version"
)

replace_once(
    '''  const dryRun = options?.dryRun === true;
  const epsReviewOnly=dryRun && options?.epsReviewOnly===true;''',
    '''  const dryRun = options?.dryRun === true;
  const selectionOnly = options?.selectionOnly === true && !dryRun;
  const epsReviewOnly=dryRun && options?.epsReviewOnly===true;''',
    "selection-only mode"
)

scan_core=text.find("async function runAfterMarketScanCore(")
bridge_start=text.find("    bridge = await persistPlanBridge(",scan_core)
if bridge_start<0:
    raise SystemExit("defer external delivery: bridge start not found")
history_marker="\n  }\n\n  const historySeedState"
history_pos=text.find(history_marker,bridge_start)
if history_pos<0:
    raise SystemExit("defer external delivery: history boundary not found")
original=text[bridge_start:history_pos]
indented="\n".join("  "+line for line in original.split("\n"))
deferred='''    if (!selectionOnly) {
'''+indented+'''
    } else {
      bridge = {sent:false,verified:false,simulated:false,deferred:true,provider:"DEFERRED",reason:"SELECTION_ONLY_RECOVERY"};
      report = {sent:false,simulated:false,deferred:true,reason:"SELECTION_ONLY_RECOVERY"};
    }'''
text=text[:bridge_start]+deferred+text[history_pos:]

replace_once(
    '''      complete: !dryRun && saved.verified === true && bridge.verified === true && bridge.simulated !== true && report.sent === true && report.simulated !== true''',
    '''      selectionOnly,
      selectionPersisted: !dryRun && saved.verified === true,
      complete: !dryRun && !selectionOnly && saved.verified === true && bridge.verified === true && bridge.simulated !== true && report.sent === true && report.simulated !== true''',
    "pipeline staged recovery state"
)

replace_once(
    '''        return json(await runAfterMarketScan(env, scheduledTime,{onlyIfMissing:body.onlyIfMissing===true}), 200, true);''',
    '''        if(body.selectionOnly===true && !isAuthorized(request,env)) return json({error:"分段恢復僅接受管理員授權"},401,true);
        return json(await runAfterMarketScan(env, scheduledTime,{onlyIfMissing:body.onlyIfMissing===true,selectionOnly:body.selectionOnly===true}), 200, true);''',
    "scan selection-only endpoint"
)

route_marker='''    // 最近一次盤後選股結果
    if (url.pathname === "/api/scan/status") {'''
route=r'''    if (url.pathname === "/api/scan/deliver") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="POST") return json({error:"Method not allowed"},405,true);
      try {
        const latest=await env.STOCKS_KV?.get(LAST_SCAN_KEY,"json");
        if(!latest?.scanDate || latest?.config?.verified!==true) return json({error:"沒有已驗證的正式盤後選股可補送"},409,true);
        const formal=Array.isArray(latest.stocks)?latest.stocks:[];
        const hybrid=Array.isArray(latest.hybridStocks)?latest.hybridStocks:[];
        const watch=Array.isArray(latest.hybridWatchStocks)?latest.hybridWatchStocks:[];
        let bridge=latest?.threeMin;
        if(!(bridge?.sent===true && bridge?.verified===true)) {
          bridge=await persistPlanBridge(latest.threeMinPayload || buildThreeMinPayload(latest.scanDate,latest.totalCapital,formal),env);
        }
        const reportKey=`V7_DAILY_REPORT:${latest.scanDate}`;
        const previousReport=await env.STOCKS_KV.get(reportKey,"json");
        let report=previousReport?.sent===true && Boolean(previousReport.simulated)===isTestMode(env) ? {...previousReport,deduplicated:true} : null;
        if(!report) {
          const payload=buildDailySelectionPayload(latest.scanDate,formal,latest.diagnostics||{});
          enrichThreePoolDailyPayload(payload,formal,hybrid,latest.strategyOverlap||null,watch);
          report=await sendPush(payload,env);
          if(report.sent) await env.STOCKS_KV.put(reportKey,JSON.stringify(report),{expirationTtl:14*86400});
        }
        const updated={...latest,threeMin:bridge,dailyReport:report,pipeline:{
          ...(latest.pipeline||{}),
          threeMinAccepted:bridge?.sent===true && bridge?.simulated!==true,
          threeMinVerified:bridge?.verified===true && bridge?.simulated!==true,
          dailyReportAccepted:report?.sent===true && report?.simulated!==true,
          selectionPersisted:latest?.config?.verified===true,
          complete:latest?.config?.verified===true && bridge?.verified===true && bridge?.simulated!==true && report?.sent===true && report?.simulated!==true
        }};
        await env.STOCKS_KV.put(LAST_SCAN_KEY,JSON.stringify(updated),{expirationTtl:14*86400});
        await env.STOCKS_KV.put("V7_LAST_SCAN_ATTEMPT",JSON.stringify({
          status:"SUCCESS",requestedDate:latest.scanDate,scanDate:latest.scanDate,selectedCount:formal.length,
          generatedAt:latest.generatedAt,threeMin:bridge,dailyReport:report
        }),{expirationTtl:14*86400});
        return json({ok:updated.pipeline.complete===true,scanDate:latest.scanDate,selectedCount:formal.length,
          hybridSelectedCount:hybrid.length,hybridWatchCount:watch.length,threeMin:bridge,dailyReport:report,pipeline:updated.pipeline},200,true);
      } catch(err) {return json({error:String(err)},500,true);}
    }

'''
insert_before_once(route_marker,route,"staged delivery endpoint")

path.write_text(text,encoding="utf-8")
print("Applied V8.9.8 staged recovery")
