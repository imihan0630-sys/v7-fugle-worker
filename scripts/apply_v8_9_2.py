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

def insert_after_once(marker,addition,label):
    global text
    count=text.count(marker)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 marker, found {count}")
    text=text.replace(marker,marker+addition,1)

replace_once(
    'const VERSION = "8.9.1-three-pool-dashboard";',
    'const VERSION = "8.9.2-three-pool-push";',
    "runtime version"
)

# Build one mobile/webhook payload that always exposes all 3 pools.
helper=r'''
function dailyPushStock(stock,shadowOnly=false) {
  return {
    rank:stock?.rank||stock?.sourceRank||null,
    symbol:String(stock?.symbol||stock?.code||""),
    name:stock?.name||"",
    signalLevel:stock?.signalLevel||null,
    mode:stock?.mode||null,
    strategyPool:stock?.strategyPool||null,
    buyLow:toNumber(stock?.buyLow),
    buyHigh:toNumber(stock?.buyHigh),
    stop:toNumber(stock?.stop),
    profitCheck:toNumber(stock?.profitCheck),
    totalAllocation:toNumber(stock?.totalAllocation),
    reason:stock?.selectedReason||stock?.reason||null,
    shadowOnly:Boolean(shadowOnly)
  };
}

function enrichThreePoolDailyPayload(payload,formalStocks,hybridStocks,overlap=null) {
  const formal=Array.isArray(formalStocks)?formalStocks:[];
  const hybrid=Array.isArray(hybridStocks)?hybridStocks:[];
  const general=formal.filter(stock=>stock?.strategyPool==="FORMAL_GENERAL" ||
    (stock?.strategyPool==null && (toNumber(stock?.formalClose)||0)<THOUSAND_STOCK_PRICE));
  const thousand=formal.filter(stock=>stock?.strategyPool==="FORMAL_THOUSAND" ||
    (stock?.strategyPool==null && (toNumber(stock?.formalClose)||0)>=THOUSAND_STOCK_PRICE));
  const pools=[
    {id:"FORMAL_GENERAL",label:"非千元 Formal",quota:3,capital:STRATEGY_POOL_CAPITAL,shadowOnly:false,
      stocks:general.map(stock=>dailyPushStock(stock,false))},
    {id:"FORMAL_THOUSAND",label:"千元 Formal",quota:3,capital:STRATEGY_POOL_CAPITAL,shadowOnly:false,
      stocks:thousand.map(stock=>dailyPushStock(stock,false))},
    {id:HYBRID_POOL_ID,label:"千元 Hybrid",quota:3,capital:STRATEGY_POOL_CAPITAL,shadowOnly:true,
      stocks:hybrid.map(stock=>dailyPushStock(stock,true))}
  ];
  const counts=Object.fromEntries(pools.map(pool=>[pool.id,pool.stocks.length]));
  const totalDisplayed=pools.reduce((sum,pool)=>sum+pool.stocks.length,0);
  payload.architecture="3+3+3";
  payload.poolCapital=STRATEGY_POOL_CAPITAL;
  payload.strategyPools=pools;
  payload.poolCounts=counts;
  payload.hybridShadow=pools[2].stocks;
  payload.strategyOverlap=overlap||null;
  payload.formalSelectedCount=formal.length;
  payload.hybridSelectedCount=hybrid.length;
  payload.totalDisplayedCount=totalDisplayed;
  payload.allPoolsZero=totalDisplayed===0;
  payload.title=totalDisplayed
    ? `V8盤後3+3+3：共 ${totalDisplayed} 檔｜Formal ${formal.length}｜Hybrid ${hybrid.length}`
    : "V8盤後3+3+3：三池 0 檔，維持現金";
  payload.instruction=
    `非千元Formal ${general.length}/3｜千元Formal ${thousand.length}/3｜千元Hybrid ${hybrid.length}/3；`+
    (totalDisplayed===0
      ? "三池皆無符合，不硬湊，維持現金。"
      : "以下依池別列出；Hybrid為Shadow觀察池，不等同正式BUY。");
  return payload;
}

'''
insert_before_once("function pick(object, keys) {",helper,"three-pool daily push helper")

old_daily='''    dailyPayload.hybridShadow = hybridStocks.map(stock=>({
      rank:stock.rank||stock.sourceRank,symbol:stock.symbol||stock.code,name:stock.name,
      signalLevel:stock.signalLevel,buyLow:stock.buyLow,buyHigh:stock.buyHigh,stop:stock.stop,
      profitCheck:stock.profitCheck,reason:stock.selectedReason,shadowOnly:true
    }));
    dailyPayload.strategyOverlap = scan.strategyOverlap || null;
    dailyPayload.architecture = "3+3+3";
    dailyPayload.poolCapital = STRATEGY_POOL_CAPITAL;'''
replace_once(
    old_daily,
    '''    enrichThreePoolDailyPayload(dailyPayload,stocks,hybridStocks,scan.strategyOverlap||null);''',
    "enrich daily payload with all three pools"
)

# Replace the DAILY_SELECTION formatter structurally because V8.7.13 adds <!channel>.
fmt_start=text.find("function formatSlackSignalMessage")
daily_token=text.find('payload?.signalType === "DAILY_SELECTION"',fmt_start)
daily_start=text.rfind("  if (",fmt_start,daily_token+1)
daily_end=text.find('  if (payload?.type === "SYSTEM_TEST"',daily_token)
if fmt_start<0 or daily_token<0 or daily_start<0 or daily_end<0:
    raise SystemExit("Slack DAILY_SELECTION formatter boundary not found")
new_daily=r'''  if (payload?.signalType === "DAILY_SELECTION") {
    const pools=Array.isArray(payload?.strategyPools)?payload.strategyPools:[];
    const poolBlocks=pools.length ? pools.map(pool=>{
      const header=`【${pool.label} ${(pool.stocks||[]).length}/${pool.quota||3}】${pool.shadowOnly?"（Shadow）":""}`;
      if(!(pool.stocks||[]).length) return header+"\n無符合";
      return header+"\n"+pool.stocks.map((stock,index)=>{
        const zone=stock.buyLow!==null&&stock.buyHigh!==null ? `參考區 ${fmt(stock.buyLow)}～${fmt(stock.buyHigh)}` : "參考區 -";
        const tag=stock.shadowOnly?"Hybrid觀察":"Formal";
        return `${index+1}. ${stock.name} ${stock.symbol}｜${tag}｜${stock.signalLevel||"-"}\n${zone}｜停損 ${fmt(stock.stop)}｜目標 ${fmt(stock.profitCheck)}\n入選原因：${stock.reason||"-"}`;
      }).join("\n");
    }) : (payload.stocks||[]).map(stock =>
      `${stock.rank}. ${stock.name} ${stock.symbol}｜${stock.mode}\n第一筆 ${fmt(stock.firstAmount)}元／${stock.firstShares}股：${stock.firstCondition}\n第二筆 ${fmt(stock.secondAmount)}元／${stock.secondShares}股：${stock.secondCondition}\n停損 ${fmt(stock.stop)}｜停利檢查 ${fmt(stock.profitCheck)}\n入選原因：${stock.reason}`);
    const overlap=payload?.strategyOverlap?.overlapSymbols||[];
    return [
      `<!channel>\n📋 *${payload.title}*`, payload.instruction,
      ...poolBlocks,
      overlap.length ? `共同入選：${overlap.join("、")}（只代表跨邏輯一致性，不自動加碼）` : null,
      `監控：${payload.monitorUrl}`, `時間：${payload.time}`
    ].filter(Boolean).join("\n\n");
  }
'''
text=text[:daily_start]+new_daily+text[daily_end:]

# Persist explicit three-pool counts with the daily report; keep legacy selectedCount/zeroSelection as Formal semantics.
replace_once(
    '''selectedCount:dailyPayload.selectedCount,zeroSelection:dailyPayload.zeroSelection,pushRequired:true,checkedAt:new Date().toISOString()''',
    '''selectedCount:dailyPayload.selectedCount,zeroSelection:dailyPayload.zeroSelection,pushRequired:true,checkedAt:new Date().toISOString(),
          hybridSelectedCount:dailyPayload.hybridSelectedCount,totalDisplayedCount:dailyPayload.totalDisplayedCount,
          allPoolsZero:dailyPayload.allPoolsZero,poolCounts:dailyPayload.poolCounts''',
    "persist three-pool daily counts"
)

insert_after_once(
    '''      dailyResultZeroSelection: stocks.length === 0,''',
    '''
      dailyHybridSelectedCount: hybridStocks.length,
      dailyAllPoolsZero: stocks.length===0 && hybridStocks.length===0,
      dailyPoolCounts: {
        FORMAL_GENERAL:stocks.filter(stock=>stock?.strategyPool==="FORMAL_GENERAL" || (stock?.strategyPool==null && (toNumber(stock?.formalClose)||0)<THOUSAND_STOCK_PRICE)).length,
        FORMAL_THOUSAND:stocks.filter(stock=>stock?.strategyPool==="FORMAL_THOUSAND" || (stock?.strategyPool==null && (toNumber(stock?.formalClose)||0)>=THOUSAND_STOCK_PRICE)).length,
        [HYBRID_POOL_ID]:hybridStocks.length
      },''',
    "pipeline three-pool push fields"
)

# Authorized resend of latest completed daily result. It does not rescan, alter plans, or create Formal signals.
route_marker='''    if (url.pathname === "/api/strategy-pools") {'''
route=r'''    if (url.pathname === "/api/daily-report/resend") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="POST") return json({error:"Method not allowed"},405,true);
      const latest=await env.STOCKS_KV?.get(LAST_SCAN_KEY,"json");
      if(!latest?.scanDate) return json({ok:false,error:"尚無可補發的盤後結果"},404,true);
      const formal=Array.isArray(latest.stocks)?latest.stocks:[];
      const hybrid=Array.isArray(latest.hybridStocks)?latest.hybridStocks:[];
      const payload=buildDailySelectionPayload(latest.scanDate,formal,latest.diagnostics||{});
      enrichThreePoolDailyPayload(payload,formal,hybrid,latest.strategyOverlap||null);
      payload.resendOf=`DAILY_SELECTION:${latest.scanDate}`;
      payload.signalId=`DAILY_SELECTION_RESEND:${latest.scanDate}:${Date.now()}`;
      payload.title=`補發｜${payload.title}`;
      payload.instruction=`${payload.instruction}｜此為原盤後結果補發，不重跑選股、不改交易計畫。`;
      const report=await sendTrackedPush(payload,env,{note:"人工授權補發盤後3+3+3結果"});
      return json({
        ok:report?.sent===true && (isTestMode(env)||report?.deliveryState==="ACCEPTED"),
        version:VERSION,scanDate:latest.scanDate,formalSelectedCount:formal.length,hybridSelectedCount:hybrid.length,
        totalDisplayedCount:formal.length+hybrid.length,noRescan:true,noPlanChanges:true,noTrade:true,report
      },report?.sent===true?200:502,true);
    }

'''
insert_before_once(route_marker,route,"authorized daily report resend route")

path.write_text(text,encoding="utf-8")
print("Applied V8.9.2 three-pool daily push")
