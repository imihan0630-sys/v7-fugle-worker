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

route_marker='''    // 手動執行盤後全市場掃描（部署驗收／補跑用）
    if (url.pathname === "/api/scan") {'''

route=r'''    // 歷史盤後分段恢復：沿用完全相同的只讀選股核心，先正式寫入監控計畫；
    // 外部鏡像與每日推播由既有補發流程分開處理，避免長請求把選股寫入一起拖死。
    if (url.pathname === "/api/scan/stage-selection") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="POST") return json({error:"Method not allowed"},405,true);
      try {
        const body=await request.json().catch(()=>({}));
        const date=normalizeMarketDate(body.marketDate);
        if(!date || date>taiwanDate() || date<shiftDateString(taiwanDate(),-14)) throw new Error("恢復日期無效、未來或超過14天");
        await loadTradingCalendar(env,Number(date.slice(0,4)));
        if(!isTradingDate(date)) throw new Error("恢復日期不是交易日");
        const loadedConfig=await loadStockConfig(env);
        if((loadedConfig.stocks||[]).some(stock=>stock.positionStage!=="NONE")) {
          throw new Error("OPEN_POSITION_PROTECTED：仍有持倉，不得用歷史恢復覆寫實際持股及原停損計畫");
        }

        const scheduledTime=Date.parse(date+"T10:20:00Z");
        const preview=await runAfterMarketScan(env,scheduledTime,{dryRun:true});
        if(preview?.scanDate!==date) throw new Error("歷史恢復選股日期不一致");
        const formal=validateStocks(Array.isArray(preview?.stocks)?preview.stocks:[]);
        const hybrid=Array.isArray(preview?.hybridStocks)?preview.hybridStocks.slice(0,HYBRID_MAX_STOCKS):[];
        const watch=Array.isArray(preview?.hybridWatchStocks)?preview.hybridWatchStocks.slice(0,HYBRID_WATCH_MAX):[];

        const saved=await saveStockConfig(env,formal,"Staged historical recovery from verified dry-run",STRATEGY_POOL_CAPITAL);
        if(saved.verified!==true) throw new Error("歷史恢復正式監控計畫寫入後讀回不一致");

        await env.STOCKS_KV.put(HYBRID_KV_KEY,JSON.stringify({
          version:VERSION,scanDate:date,planDate:nextTradingDate(date),
          poolId:HYBRID_POOL_ID,poolCapital:STRATEGY_POOL_CAPITAL,shadowOnly:true,stocks:hybrid
        }),{expirationTtl:14*86400});
        await env.STOCKS_KV.put(HYBRID_WATCH_KV_KEY,JSON.stringify({
          version:VERSION,scanDate:date,planDate:nextTradingDate(date),
          state:"HYBRID_WATCH",max:HYBRID_WATCH_MAX,occupiesHybridSlot:false,capitalReserved:0,stocks:watch
        }),{expirationTtl:14*86400});
        await archiveStrategyPools(env,date,{
          FORMAL_GENERAL:formal.filter(stock=>stock.strategyPool==="FORMAL_GENERAL"),
          FORMAL_THOUSAND:formal.filter(stock=>stock.strategyPool==="FORMAL_THOUSAND"),
          [HYBRID_POOL_ID]:hybrid
        });
        await archiveHybridWatchCandidates(env,date,watch);

        const committed={
          ...preview,version:VERSION,dryRun:false,generatedAt:taiwanTime(),
          status:`歷史恢復已完成選股寫入｜非千元Formal ${formal.filter(x=>x.strategyPool==="FORMAL_GENERAL").length}/3｜千元Formal ${formal.filter(x=>x.strategyPool==="FORMAL_THOUSAND").length}/3｜千元Hybrid ${hybrid.length}/3｜WATCH ${watch.length}`,
          selectedCount:formal.length,hybridSelectedCount:hybrid.length,hybridWatchCount:watch.length,
          stocks:formal,hybridStocks:hybrid,hybridWatchStocks:watch,
          config:{saved:true,verified:true,dryRun:false,updatedAt:saved.updatedAt},
          planBridge:{sent:false,verified:false,deferred:true,reason:"STAGED_RECOVERY_PENDING_DELIVERY"},
          threeMin:{sent:false,verified:false,skipped:true,reason:"provider-neutral staged recovery"},
          dailyReport:{sent:false,simulated:false,deferred:true,reason:"STAGED_RECOVERY_PENDING_DELIVERY"},
          threeMinPayload:buildThreeMinPayload(date,STRATEGY_POOL_CAPITAL,formal),
          pipeline:{
            ...(preview.pipeline||{}),
            selectionCompleted:true,configAccepted:true,configVerified:true,
            externalPlanProvider:null,externalPlanAccepted:false,externalPlanVerified:false,
            dailyReportAccepted:false,dailyWebhookAccepted:false,dailyDeliveryState:"PENDING",
            selectionPersisted:true,complete:false
          }
        };
        await env.STOCKS_KV.put(LAST_SCAN_KEY,JSON.stringify(committed),{expirationTtl:14*86400});
        await env.STOCKS_KV.put("V7_LAST_SCAN_ATTEMPT",JSON.stringify({
          status:"SELECTION_PERSISTED",requestedDate:date,scanDate:date,selectedCount:formal.length,
          generatedAt:committed.generatedAt,dailyReport:committed.dailyReport
        }),{expirationTtl:14*86400});

        return json({
          ok:true,version:VERSION,scanDate:date,selectionPersisted:true,
          formalSelectedCount:formal.length,hybridSelectedCount:hybrid.length,hybridWatchCount:watch.length,
          formalSymbols:formal.map(x=>x.symbol),hybridSymbols:hybrid.map(x=>x.symbol),watchSymbols:watch.map(x=>x.symbol),
          nextStep:"POST /api/daily-report/resend；不重跑選股、不改計畫"
        },200,true);
      } catch(err) {
        return json({ok:false,error:String(err)},500,true);
      }
    }

'''

insert_before_once(route_marker,route,"staged historical selection route")

path.write_text(text,encoding="utf-8")
print("Applied V8.9.8 staged recovery")
