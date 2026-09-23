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

def replace_once_after(marker,old,new,label):
    global text
    start=text.find(marker)
    if start<0:
        raise SystemExit(f"{label}: marker not found")
    head,tail=text[:start],text[start:]
    count=tail.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match after marker, found {count}")
    text=head+tail.replace(old,new,1)

replace_once(
    'const VERSION = "8.9.2-three-pool-push";',
    'const VERSION = "8.9.3-hybrid-watch-layer";',
    "runtime version"
)

replace_once(
    'const HYBRID_KV_KEY = "V9_HYBRID_THOUSAND_SHADOW";',
    '''const HYBRID_KV_KEY = "V9_HYBRID_THOUSAND_SHADOW";
const HYBRID_WATCH_MAX = 5;
const HYBRID_WATCH_KV_KEY = "V9_HYBRID_WATCH";
const HYBRID_WATCH_SIGNAL_PREFIX = "V9_HYBRID_WATCH_SIGNAL:";''',
    "hybrid watch constants"
)

watch_schema=r'''
  await env.V7_DB.prepare("CREATE TABLE IF NOT EXISTS v9_hybrid_watch_lifecycle ("+
    "scan_date TEXT NOT NULL, plan_date TEXT NOT NULL, symbol TEXT NOT NULL, name TEXT, state TEXT NOT NULL, "+
    "reference_close REAL, trigger_price REAL, max_chase REAL, stop REAL, target REAL, watch_reason TEXT, plan_json TEXT NOT NULL, "+
    "triggered_at TEXT, trigger_trade_date TEXT, trigger_market_price REAL, allocation REAL, delivery_state TEXT, "+
    "created_at TEXT NOT NULL, updated_at TEXT NOT NULL, PRIMARY KEY(scan_date,symbol))").run();
  await env.V7_DB.prepare("CREATE INDEX IF NOT EXISTS idx_v9_hybrid_watch_plan_state ON v9_hybrid_watch_lifecycle(plan_date,state)").run();
'''
insert_before_once("  D1_SCHEMA_READY = true;",watch_schema,"hybrid watch D1 schema")

watch_helpers=r'''
function scoreHybridWatchCandidate(f,sector,strictReason) {
  if (!["早期價格接受尚未成立","Hybrid綜合信心低於B級"].includes(String(strictReason||""))) return null;
  const entry=positiveNumber(f.close),ma20=positiveNumber(f.ma20);
  if (!entry || !ma20) return null;

  const ret5=toNumber(f.ret5) ?? 0;
  const ret20=toNumber(f.ret20) ?? 0;
  const change=toNumber(f.changePercent) ?? 0;
  const volumeRatio=toNumber(f.volumeTodayVsPrev5) ?? 0;
  const closePos=toNumber(f.dailyClosePosition) ?? 0.5;
  const upperShadow=toNumber(f.dailyUpperShadowRatio) ?? 0;
  if (ret5>18 || ret20>30 || change>=9.5 || volumeRatio>2.8 || upperShadow>0.38) return null;
  if (ret20<-12 || entry<ma20*0.97) return null;
  if (Number.isFinite(sector?.breadth) && sector.breadth<35) return null;
  if (Number.isFinite(sector?.avgChange) && sector.avgChange<-1.5) return null;

  const target=nearestRealResistance(f,entry);
  if (target===null || target<=entry) return null;
  const upsidePct=(target/entry-1)*100;
  if (upsidePct<10) return null;

  const fundamental=fundamentalScore(f),inst=institutionalScore(f);
  if (financialDataCount(f)<3 || fundamental<45 || inst<45) return null;

  const triggerPrice=Math.max(ma20, strictReason==="Hybrid綜合信心低於B級" ? entry*1.005 : entry);
  const maxChase=Math.min(entry*1.03,target*0.97);
  if (!(maxChase>=triggerPrice)) return null;

  const atr=Math.max(entry*0.02,((toNumber(f.atrPercent)||0)/100)*entry);
  const structureLow=positiveNumber(f.recentLow5Prev)||ma20;
  let stop=Math.min(ma20*0.975,structureLow-atr*0.10);
  if (!(stop>0 && stop<entry)) stop=entry*0.94;

  const watchScore=clamp(fundamental*0.40+inst*0.40+Math.min(100,50+upsidePct*2)*0.20,0,100);
  const missingCondition = strictReason==="早期價格接受尚未成立"
    ? "等待價格接受：15分K站穩關鍵價、守低且強收"
    : "等待最後價格確認：15分K轉強且不追高";
  return {
    ...f,mode:"HYBRID",channel:"H",watchState:"HYBRID_WATCH",watchReason:strictReason,
    watchScore:round(watchScore,1),referenceClose:entry,
    watchTriggerPrice:round(triggerPrice,2),watchMaxChase:round(maxChase,2),
    watchStop:round(stop,2),watchTarget:round(target,2),hybridUpsidePct:round(upsidePct,1),
    hybridFundamentalScore:round(fundamental,1),hybridSmartMoneyScore:round(inst,1),
    missingCondition,
    selectedReason:"Hybrid WATCH｜基本面與Smart Money已通過；"+missingCondition+"；剩餘空間"+round(upsidePct,1)+"%"
  };
}

function allocateHybridWatchPlans(items,scanDate) {
  return (Array.isArray(items)?items:[]).map((item,index)=>({
    rank:index+1,code:item.symbol,symbol:item.symbol,name:item.name,
    mode:"HYBRID",channel:"H",strategyPool:HYBRID_POOL_ID,
    watchState:"HYBRID_WATCH",shadowOnly:true,pushEnabled:false,
    occupiesHybridSlot:false,capitalReserved:0,totalAllocation:0,
    referenceClose:item.referenceClose,formalClose:item.referenceClose,closeDate:scanDate,planDate:nextTradingDate(scanDate),
    triggerPrice:item.watchTriggerPrice,maxChase:item.watchMaxChase,
    stop:item.watchStop,profitCheck:item.watchTarget,
    watchScore:item.watchScore,hybridUpsidePct:item.hybridUpsidePct,
    hybridFundamentalScore:item.hybridFundamentalScore,hybridSmartMoneyScore:item.hybridSmartMoneyScore,
    watchReason:item.watchReason,missingCondition:item.missingCondition,selectedReason:item.selectedReason
  }));
}

async function archiveHybridWatchCandidates(env,scanDate,watchPlans) {
  if (!env?.V7_DB || isTestMode(env)) return {stored:false,reason:isTestMode(env)?"TEST_MODE":"D1 unavailable"};
  await ensureD1Schema(env);
  const session=env.V7_DB.withSession("first-primary"),now=new Date().toISOString();
  let stored=0;
  for (const plan of (Array.isArray(watchPlans)?watchPlans:[])) {
    await session.prepare("INSERT INTO v9_hybrid_watch_lifecycle "+
      "(scan_date,plan_date,symbol,name,state,reference_close,trigger_price,max_chase,stop,target,watch_reason,plan_json,created_at,updated_at) "+
      "VALUES(?1,?2,?3,?4,'HYBRID_WATCH',?5,?6,?7,?8,?9,?10,?11,?12,?12) "+
      "ON CONFLICT(scan_date,symbol) DO UPDATE SET plan_date=excluded.plan_date,name=excluded.name,reference_close=excluded.reference_close,"+
      "trigger_price=excluded.trigger_price,max_chase=excluded.max_chase,stop=excluded.stop,target=excluded.target,watch_reason=excluded.watch_reason,"+
      "plan_json=excluded.plan_json,updated_at=excluded.updated_at WHERE v9_hybrid_watch_lifecycle.state='HYBRID_WATCH'")
      .bind(scanDate,plan.planDate,String(plan.symbol),String(plan.name||""),toNumber(plan.referenceClose),
        toNumber(plan.triggerPrice),toNumber(plan.maxChase),toNumber(plan.stop),toNumber(plan.profitCheck),
        String(plan.watchReason||""),JSON.stringify(plan),now).run();
    stored+=1;
  }
  return {stored:true,count:stored};
}

function evaluateHybridWatchUpgrade(watch,frame15,currentPrice) {
  const latest=frame15?.latest,previous=frame15?.previous;
  if (!latest) return {eligible:false,state:"HYBRID_WATCH",reason:"等待完整15分K"};
  if (!(currentPrice>0)) return {eligible:false,state:"HYBRID_WATCH",reason:"缺即時價格"};
  if (currentPrice>(toNumber(watch.maxChase)||Infinity)) return {eligible:false,state:"HYBRID_WATCH",reason:"超過WATCH最大追價，不追高"};
  const trigger=toNumber(watch.triggerPrice);
  if (!(trigger>0) || latest.close<trigger) return {eligible:false,state:"HYBRID_WATCH",reason:"尚未站穩WATCH關鍵價"};
  if (latest.bearish && latest.volumeRatio!==null && latest.volumeRatio>=1.3) return {eligible:false,state:"HYBRID_WATCH",reason:"15分K下跌放量，不升級"};
  const higherLow=!previous || latest.low>=previous.low;
  const turnUp=latest.bullish && (!previous || latest.close>previous.close || latest.high>previous.high);
  const priceAccepted=latest.strongClose || latest.reversalK;
  if (!(higherLow && turnUp && priceAccepted)) return {eligible:false,state:"HYBRID_WATCH",reason:"等待15分K守低＋強收＋轉強"};
  return {eligible:true,state:"EARLY_ENTRY_ELIGIBLE",reason:"15分K守低＋強收＋轉強，Hybrid WATCH完成價格確認"};
}

async function upsertHybridPromotedPlan(env,watch,currentPrice,tradeDate,nextState) {
  const hybridState=await env.STOCKS_KV.get(HYBRID_KV_KEY,"json") || {};
  const stocks=Array.isArray(hybridState.stocks)?hybridState.stocks.slice():[];
  const already=stocks.some(x=>String(x.symbol||x.code)===String(watch.symbol));
  const used=stocks.reduce((s,x)=>s+(toNumber(x.totalAllocation)||0),0);
  const remaining=Math.max(0,STRATEGY_POOL_CAPITAL-used);
  const canEnter=!already && stocks.length<HYBRID_MAX_STOCKS && remaining>0;
  const state=already ? "HYBRID_SELECTED" : (canEnter ? nextState : "TRIGGERED_WAITLIST");
  let promoted=null;
  if (canEnter) {
    const totalAllocation=Math.min(Math.round(STRATEGY_POOL_CAPITAL*MAX_SINGLE_POSITION_RATIO/1000)*1000,remaining);
    const firstAmount=Math.round(totalAllocation*0.6),secondAmount=totalAllocation-firstAmount;
    const price=positiveNumber(currentPrice)||positiveNumber(watch.triggerPrice)||positiveNumber(watch.referenceClose);
    promoted={
      code:watch.symbol,symbol:watch.symbol,name:watch.name,rank:stocks.length+1,
      formalClose:price,closeDate:tradeDate,planDate:tradeDate,
      mode:"HYBRID",channel:"H",signalLevel:"B",strategyPool:HYBRID_POOL_ID,
      shadowOnly:true,pushEnabled:false,watchOrigin:true,watchScanDate:watch.scanDate||watch.closeDate||null,
      watchState:state,priorityScore:toNumber(watch.watchScore),allocationRatio:round(totalAllocation/STRATEGY_POOL_CAPITAL*100,1),
      totalAllocation,firstAmount,secondAmount,
      firstShares:sharesFor(firstAmount,price),secondShares:sharesFor(secondAmount,price),
      buyLow:round(Math.max(toNumber(watch.triggerPrice)||price,price*0.992),2),
      buyHigh:round(Math.min(toNumber(watch.maxChase)||price*1.03,price*1.012),2),
      maxChase:toNumber(watch.maxChase),stop:toNumber(watch.stop),profitCheck:toNumber(watch.profitCheck),
      reduceAt:toNumber(watch.profitCheck),positionStage:"NONE",
      firstCondition:"Hybrid WATCH已完成15分K價格確認；仍為第三池Shadow，不等同Formal BUY",
      secondCondition:"僅在後續再次轉強時做Shadow加碼研究",
      selectedReason:(watch.selectedReason||"Hybrid WATCH")+"；盤中升級："+state
    };
    stocks.push(promoted);
    await env.STOCKS_KV.put(HYBRID_KV_KEY,JSON.stringify({
      ...hybridState,version:VERSION,poolId:HYBRID_POOL_ID,poolCapital:STRATEGY_POOL_CAPITAL,shadowOnly:true,
      updatedAt:new Date().toISOString(),stocks
    }),{expirationTtl:14*86400});
    if (env?.V7_DB && !isTestMode(env)) {
      await ensureD1Schema(env);
      const now=new Date().toISOString();
      await env.V7_DB.withSession("first-primary").prepare("INSERT INTO v9_strategy_pool_plans "+
        "(scan_date,pool_id,symbol,name,reference_close,capital,plan_json,created_at,updated_at) "+
        "VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?8) ON CONFLICT(scan_date,pool_id,symbol) DO UPDATE SET "+
        "name=excluded.name,reference_close=excluded.reference_close,capital=excluded.capital,plan_json=excluded.plan_json,updated_at=excluded.updated_at")
        .bind(tradeDate,HYBRID_POOL_ID,String(watch.symbol),String(watch.name||""),price,STRATEGY_POOL_CAPITAL,JSON.stringify(promoted),now).run();
    }
  }
  return {state,promoted,selectedCount:stocks.length,remainingCash:Math.max(0,remaining-(promoted?.totalAllocation||0))};
}

async function promoteHybridWatchCandidate(env,watch,currentPrice,tradeDate,reason) {
  if (!env?.V7_DB && !isTestMode(env)) throw new Error("Hybrid WATCH升級需要D1權威狀態");
  let lease=null;
  const stateKey=HYBRID_WATCH_SIGNAL_PREFIX+String(watch.scanDate||watch.closeDate||"")+":"+String(watch.symbol);
  if (env?.V7_DB) {
    lease=await acquireSignalStateLease(env,stateKey,180000);
    if(!lease) return {state:"LOCKED",sent:false};
    if (lease.snapshot?.completed===true) {
      await releaseSignalLease(env,stateKey,lease.token);
      return {...lease.snapshot,duplicateSuppressed:true};
    }
  }
  try {
    const allocation=await upsertHybridPromotedPlan(env,watch,currentPrice,tradeDate,"EARLY_ENTRY_ELIGIBLE");
    const payload={
      version:VERSION,
      signalId:"HYBRID_WATCH_UPGRADE:"+String(watch.scanDate||watch.closeDate||"")+":"+String(watch.symbol)+":"+tradeDate,
      signalType:"HYBRID_WATCH_UPGRADE",signalLabel:"Hybrid Watch升級",tradeDate,
      title:(allocation.state==="TRIGGERED_WAITLIST"?"⏳ Hybrid Watch 觸發候補｜":"🔥 Hybrid Watch 升級｜")+String(watch.name||"")+" "+String(watch.symbol),
      instruction:allocation.state==="TRIGGERED_WAITLIST"
        ? "價格確認已成立，但第三池已滿3檔；列入候補，不自動踢掉既有標的。"
        : "價格確認已成立，升級為EARLY_ENTRY_ELIGIBLE；占第三池名額並配置Shadow資金。",
      stock:{symbol:String(watch.symbol),name:watch.name||""},currentPrice,
      reason,watchState:allocation.state,triggerPrice:toNumber(watch.triggerPrice),maxChase:toNumber(watch.maxChase),
      suggestedAmount:allocation.promoted?.firstAmount??null,suggestedShares:allocation.promoted?.firstShares??null,
      stop:toNumber(watch.stop),profitCheck:toNumber(watch.profitCheck),time:taiwanTime()
    };
    const outcome=await sendTrackedPush(payload,env,{note:"Hybrid WATCH盤中價格確認升級"});
    if (env?.V7_DB && !isTestMode(env)) {
      await ensureD1Schema(env);
      await env.V7_DB.withSession("first-primary").prepare("UPDATE v9_hybrid_watch_lifecycle SET state=?1,triggered_at=?2,"+
        "trigger_trade_date=?3,trigger_market_price=?4,allocation=?5,delivery_state=?6,updated_at=?2 WHERE scan_date=?7 AND symbol=?8")
        .bind(allocation.state,new Date().toISOString(),tradeDate,currentPrice,allocation.promoted?.totalAllocation||0,
          outcome?.deliveryState||(outcome?.sent===true?"ACCEPTED":"UNKNOWN"),String(watch.scanDate||watch.closeDate||""),String(watch.symbol)).run();
    }
    const completed={completed:true,state:allocation.state,sent:outcome?.sent===true,deliveryState:outcome?.deliveryState||null,
      signalId:payload.signalId,tradeDate,currentPrice,updatedAt:new Date().toISOString()};
    if (lease) await persistSignalStateLease(env,stateKey,lease.token,completed);
    return {...completed,payload};
  } finally {
    if (lease) await releaseSignalLease(env,stateKey,lease.token);
  }
}

async function monitorHybridWatchCandidates(env,scheduledTime,need15,forceFrames) {
  const stored=await env.STOCKS_KV.get(HYBRID_WATCH_KV_KEY,"json");
  const tradeDate=taiwanDate(scheduledTime);
  const all=Array.isArray(stored?.stocks)?stored.stocks:[];
  const active=all.filter(x=>x.watchState==="HYBRID_WATCH" && (!x.planDate || x.planDate===tradeDate));
  if (!active.length || !(need15||forceFrames)) return {activeCount:active.length,checked:0,quoteCalls:0,candleCalls:0,notifications:[],results:[]};
  const results=[],notifications=[];
  for (const watch of active) {
    try {
      const [quote,raw15]=await Promise.all([fetchQuote(watch.symbol,env),fetchCandles(watch.symbol,15,env)]);
      const frame15=analyzeFrame(raw15,15),currentPrice=quotePrice(quote);
      const freshness=executionDataStatus(quote,frame15,frame15,watch.symbol,scheduledTime);
      const decision=freshness.formal15Fresh ? evaluateHybridWatchUpgrade(watch,frame15,currentPrice)
        : {eligible:false,state:"HYBRID_WATCH",reason:freshness.reason};
      let promoted=null;
      if (decision.eligible) {
        promoted=await promoteHybridWatchCandidate(env,watch,currentPrice,tradeDate,decision.reason);
        watch.watchState=promoted.state||watch.watchState;
      }
      results.push({symbol:watch.symbol,name:watch.name,currentPrice,watchState:watch.watchState,decision,
        triggerPrice:watch.triggerPrice,maxChase:watch.maxChase,stop:watch.stop,profitCheck:watch.profitCheck,
        frame15,freshness,promoted});
      if (promoted?.payload) notifications.push(promoted.payload);
    } catch(err) {
      results.push({symbol:watch.symbol,name:watch.name,watchState:watch.watchState,error:String(err)});
    }
  }
  await env.STOCKS_KV.put(HYBRID_WATCH_KV_KEY,JSON.stringify({...stored,version:VERSION,updatedAt:new Date().toISOString(),stocks:all}),{expirationTtl:14*86400});
  return {activeCount:active.length,checked:active.length,quoteCalls:active.length,candleCalls:active.length,notifications,results};
}

async function readHybridWatchPerformance(env,days=365) {
  if(!env?.V7_DB) return {configured:false,rows:[],summary:{},definition:"D1未設定"};
  await ensureD1Schema(env);
  const safeDays=Math.max(1,Math.min(730,Number(days)||365));
  const fromDate=shiftDateString(taiwanDate(),-(safeDays-1));
  const session=env.V7_DB.withSession("first-primary");
  const res=await session.prepare("SELECT * FROM v9_hybrid_watch_lifecycle WHERE scan_date>=?1 ORDER BY scan_date DESC,symbol ASC").bind(fromDate).all();
  const rows0=res?.results||[];
  const symbols=[...new Set(rows0.map(x=>String(x.symbol||"")).filter(Boolean))],histories={};
  for(let i=0;i<symbols.length;i+=50) {
    const chunk=symbols.slice(i,i+50),ph=chunk.map((_,j)=>"?"+(j+1)).join(",");
    const h=await session.prepare("SELECT symbol,history_json FROM v7_history_cache WHERE symbol IN ("+ph+")").bind(...chunk).all();
    for(const row of (h?.results||[])) {
      try {const p=JSON.parse(row.history_json||"[]");if(Array.isArray(p)) histories[String(row.symbol)]=p.slice().sort((a,b)=>String(a.date||"").localeCompare(String(b.date||"")));} catch(_){}
    }
  }
  const horizon=(future,base,n)=>{
    const bar=future[n-1],close=journalNumber(bar?.close);
    return close!==null&&base>0?round((close-base)/base*100,2):null;
  };
  const rows=rows0.map(row=>{
    const base=journalNumber(row.reference_close);
    const future=(histories[String(row.symbol)]||[]).filter(bar=>String(bar.date||"").slice(0,10)>String(row.scan_date));
    return {scanDate:String(row.scan_date),planDate:String(row.plan_date),symbol:String(row.symbol),name:row.name||"",
      state:String(row.state),triggered:row.state!=="HYBRID_WATCH",referenceClose:base,triggerPrice:journalNumber(row.trigger_price),
      triggerTradeDate:row.trigger_trade_date||null,triggerMarketPrice:journalNumber(row.trigger_market_price),
      allocation:journalNumber(row.allocation),deliveryState:row.delivery_state||null,
      d1:horizon(future,base,1),d3:horizon(future,base,3),d5:horizon(future,base,5),d10:horizon(future,base,10),
      watchReason:row.watch_reason||null};
  });
  const mature5=rows.filter(x=>x.d5!==null),triggered=rows.filter(x=>x.triggered),notTriggered=rows.filter(x=>!x.triggered);
  const avg=list=>list.length?round(list.reduce((s,x)=>s+x.d5,0)/list.length,2):null;
  return {configured:true,windowDays:safeDays,rows,summary:{
    totalWatch:rows.length,triggeredCount:triggered.length,triggerRate:rows.length?round(triggered.length/rows.length*100,2):null,
    matureD5:mature5.length,d5PositiveRate:mature5.length?round(mature5.filter(x=>x.d5>0).length/mature5.length*100,2):null,
    d5AverageReturnPct:avg(mature5),
    triggeredD5AverageReturnPct:avg(triggered.filter(x=>x.d5!==null)),
    notTriggeredD5AverageReturnPct:avg(notTriggered.filter(x=>x.d5!==null))
  },definition:"Hybrid WATCH以盤後參考收盤追蹤D1/D3/D5/D10，並分開比較有觸發與未觸發；不把Shadow訊號當成券商實際成交。"};
}

'''
insert_before_once("function allocateHybridPlans(selected,totalCapital,scanDate) {",watch_helpers,"hybrid watch helpers")

old_loop='''  const hybridScored=[];
  const hybridExclusions={};
  for (const f of thousandFeatureRows) {
    const sector=sectorStats[f.industry] || {score:0};
    const result=scoreHybridCandidate(f,sector);
    if (!result.ok) {
      hybridExclusions[result.reason]=(hybridExclusions[result.reason]||0)+1;
      continue;
    }
    hybridScored.push(result);
  }
  hybridScored.sort((a,b)=>b.priorityScore-a.priorityScore || b.hybridUpsidePct-a.hybridUpsidePct || b.hybridSmartMoneyScore-a.hybridSmartMoneyScore);
  const hybridTop=hybridScored.slice(0,HYBRID_MAX_STOCKS);'''
new_loop='''  const hybridScored=[];
  const hybridWatchScored=[];
  const hybridExclusions={};
  for (const f of thousandFeatureRows) {
    const sector=sectorStats[f.industry] || {score:0};
    const result=scoreHybridCandidate(f,sector);
    if (!result.ok) {
      hybridExclusions[result.reason]=(hybridExclusions[result.reason]||0)+1;
      const watch=scoreHybridWatchCandidate(f,sector,result.reason);
      if (watch) hybridWatchScored.push(watch);
      continue;
    }
    hybridScored.push(result);
  }
  hybridScored.sort((a,b)=>b.priorityScore-a.priorityScore || b.hybridUpsidePct-a.hybridUpsidePct || b.hybridSmartMoneyScore-a.hybridSmartMoneyScore);
  const hybridTop=hybridScored.slice(0,HYBRID_MAX_STOCKS);
  const selectedHybridSymbols=new Set(hybridTop.map(x=>String(x.symbol)));
  hybridWatchScored.sort((a,b)=>b.watchScore-a.watchScore || b.hybridUpsidePct-a.hybridUpsidePct || b.hybridSmartMoneyScore-a.hybridSmartMoneyScore);
  const hybridWatchTop=hybridWatchScored.filter(x=>!selectedHybridSymbols.has(String(x.symbol))).slice(0,HYBRID_WATCH_MAX);'''
replace_once(old_loop,new_loop,"hybrid selected + watch split")

replace_once(
    '  const hybridPlans=allocateHybridPlans(hybridTop,STRATEGY_POOL_CAPITAL,scanDate);',
    '''  const hybridPlans=allocateHybridPlans(hybridTop,STRATEGY_POOL_CAPITAL,scanDate);
  const hybridWatchPlans=allocateHybridWatchPlans(hybridWatchTop,scanDate);''',
    "hybrid watch plan allocation"
)

replace_once(
    '''  diagnostics.strategyOverlap = {''',
    '''  diagnostics.hybridWatch = {
    state:"HYBRID_WATCH",count:hybridWatchPlans.length,max:HYBRID_WATCH_MAX,occupiesHybridSlot:false,capitalReserved:0,
    shortlist:hybridWatchPlans.map(x=>({rank:x.rank,symbol:x.symbol,name:x.name,watchScore:x.watchScore,
      triggerPrice:x.triggerPrice,maxChase:x.maxChase,stop:x.stop,profitCheck:x.profitCheck,
      missingCondition:x.missingCondition,watchReason:x.watchReason})),
    policy:"基本面＋Smart Money＋剩餘空間先通過；只差價格確認者進WATCH。WATCH不占3席、不占20萬；15分K確認後才升級。"
  };
  diagnostics.strategyOverlap = {''',
    "hybrid watch diagnostics"
)

replace_once(
    '''    hybridCandidates:hybridPlans,
    diagnostics,''',
    '''    hybridCandidates:hybridPlans,
    hybridWatchCandidates:hybridWatchPlans,
    diagnostics,''',
    "hybrid watch return"
)

insert_after_once(
    '  const hybridStocks = Array.isArray(scan.hybridCandidates) ? scan.hybridCandidates.slice(0,HYBRID_MAX_STOCKS) : [];',
    '''
  const hybridWatchStocks = Array.isArray(scan.hybridWatchCandidates) ? scan.hybridWatchCandidates.slice(0,HYBRID_WATCH_MAX) : [];''',
    "hybrid watch stocks"
)

watch_persist_marker='''    await env.STOCKS_KV.put(HYBRID_KV_KEY,JSON.stringify({
      version:VERSION,scanDate:marketDate,planDate:nextTradingDate(marketDate),
      poolId:HYBRID_POOL_ID,poolCapital:STRATEGY_POOL_CAPITAL,shadowOnly:true,stocks:hybridStocks
    }),{expirationTtl:14*86400});'''
replace_once(
    watch_persist_marker,
    watch_persist_marker+'''
    await env.STOCKS_KV.put(HYBRID_WATCH_KV_KEY,JSON.stringify({
      version:VERSION,scanDate:marketDate,planDate:nextTradingDate(marketDate),
      state:"HYBRID_WATCH",max:HYBRID_WATCH_MAX,occupiesHybridSlot:false,capitalReserved:0,stocks:hybridWatchStocks
    }),{expirationTtl:14*86400});
    await archiveHybridWatchCandidates(env,marketDate,hybridWatchStocks);''',
    "persist hybrid watch"
)

replace_once(
    '    hybridSelectedCount: hybridStocks.length,',
    '''    hybridSelectedCount: hybridStocks.length,
    hybridWatchCount: hybridWatchStocks.length,''',
    "summary hybrid watch count"
)
replace_once(
    '    hybridStocks,',
    '''    hybridStocks,
    hybridWatchStocks,''',
    "summary hybrid watch stocks"
)

replace_once(
    'status: `3+3+3｜非千元Formal ${scan.diagnostics?.finalPoolMerge?.finalGeneralSelected || 0}/3、千元Formal ${scan.diagnostics?.finalPoolMerge?.finalThousandSelected || 0}/3、千元Hybrid ${hybridStocks.length}/3；沒有符合就是0，不跨池、不硬湊`,',
    'status: `3+3+3｜非千元Formal ${scan.diagnostics?.finalPoolMerge?.finalGeneralSelected || 0}/3、千元Formal ${scan.diagnostics?.finalPoolMerge?.finalThousandSelected || 0}/3、千元Hybrid ${hybridStocks.length}/3；Hybrid WATCH ${hybridWatchStocks.length}檔；WATCH不占名額、不占資金`,',
    "status watch count"
)

replace_once(
    'function enrichThreePoolDailyPayload(payload,formalStocks,hybridStocks,overlap=null) {',
    'function enrichThreePoolDailyPayload(payload,formalStocks,hybridStocks,overlap=null,hybridWatchStocks=[]) {',
    "daily payload watch signature"
)
replace_once(
    '''  const hybrid=Array.isArray(hybridStocks)?hybridStocks:[];''',
    '''  const hybrid=Array.isArray(hybridStocks)?hybridStocks:[];
  const watch=Array.isArray(hybridWatchStocks)?hybridWatchStocks:[];''',
    "daily payload watch input"
)
replace_once(
    '''  payload.strategyOverlap=overlap||null;''',
    '''  payload.hybridWatch=watch.map(stock=>({
    rank:stock.rank||null,symbol:String(stock.symbol||stock.code||""),name:stock.name||"",
    watchState:stock.watchState||"HYBRID_WATCH",watchScore:toNumber(stock.watchScore),
    triggerPrice:toNumber(stock.triggerPrice),maxChase:toNumber(stock.maxChase),
    stop:toNumber(stock.stop),profitCheck:toNumber(stock.profitCheck),
    missingCondition:stock.missingCondition||null,reason:stock.selectedReason||null
  }));
  payload.hybridWatchCount=payload.hybridWatch.length;
  payload.strategyOverlap=overlap||null;''',
    "daily payload watch fields"
)
replace_once(
    '''  payload.allPoolsZero=totalDisplayed===0;
  payload.title=totalDisplayed
    ? `V8盤後3+3+3：共 ${totalDisplayed} 檔｜Formal ${formal.length}｜Hybrid ${hybrid.length}`
    : "V8盤後3+3+3：三池 0 檔，維持現金";
  payload.instruction=
    `非千元Formal ${general.length}/3｜千元Formal ${thousand.length}/3｜千元Hybrid ${hybrid.length}/3；`+
    (totalDisplayed===0
      ? "三池皆無符合，不硬湊，維持現金。"
      : "以下依池別列出；Hybrid為Shadow觀察池，不等同正式BUY。");''',
    '''  payload.allPoolsZero=totalDisplayed===0 && watch.length===0;
  payload.title=totalDisplayed
    ? `V8盤後3+3+3：共 ${totalDisplayed} 檔｜Formal ${formal.length}｜Hybrid ${hybrid.length}｜WATCH ${watch.length}`
    : (watch.length ? `V8盤後3+3+3：正式0檔｜Hybrid WATCH ${watch.length}檔` : "V8盤後3+3+3：三池 0 檔，維持現金");
  payload.instruction=
    `非千元Formal ${general.length}/3｜千元Formal ${thousand.length}/3｜千元Hybrid ${hybrid.length}/3｜Hybrid WATCH ${watch.length}/${HYBRID_WATCH_MAX}；`+
    (totalDisplayed===0 && watch.length===0
      ? "三池與WATCH皆無符合，不硬湊，維持現金。"
      : "Hybrid WATCH不占第三池名額、不占資金；盤中15分K完成價格確認才升級。");''',
    "daily payload watch title"
)

replace_once(
    '    enrichThreePoolDailyPayload(dailyPayload,stocks,hybridStocks,scan.strategyOverlap||null);',
    '    enrichThreePoolDailyPayload(dailyPayload,stocks,hybridStocks,scan.strategyOverlap||null,hybridWatchStocks);',
    "daily scan watch payload"
)

replace_once(
    '''    const overlap=payload?.strategyOverlap?.overlapSymbols||[];''',
    '''    const watchRows=Array.isArray(payload?.hybridWatch)?payload.hybridWatch:[];
    const watchBlock=watchRows.length ? "【Hybrid WATCH "+watchRows.length+"/"+HYBRID_WATCH_MAX+"】（不占名額／不占資金）\\n"+
      watchRows.map((stock,index)=>(index+1)+". "+stock.name+" "+stock.symbol+"｜等待："+(stock.missingCondition||"-")+
        "\\n觸發價 "+fmt(stock.triggerPrice)+"｜最大追價 "+fmt(stock.maxChase)+"｜停損 "+fmt(stock.stop)+"｜目標 "+fmt(stock.profitCheck)).join("\\n")
      : "【Hybrid WATCH 0/"+HYBRID_WATCH_MAX+"】\\n無符合";
    const overlap=payload?.strategyOverlap?.overlapSymbols||[];''',
    "daily Slack watch block"
)
replace_once(
    '''      ...poolBlocks,
      overlap.length ?''',
    '''      ...poolBlocks,
      watchBlock,
      overlap.length ?''',
    "daily Slack include watch"
)

replace_once(
    '''      const formal=Array.isArray(latest.stocks)?latest.stocks:[];
      const hybrid=Array.isArray(latest.hybridStocks)?latest.hybridStocks:[];
      const payload=buildDailySelectionPayload(latest.scanDate,formal,latest.diagnostics||{});''',
    '''      const formal=Array.isArray(latest.stocks)?latest.stocks:[];
      const hybrid=Array.isArray(latest.hybridStocks)?latest.hybridStocks:[];
      const watch=Array.isArray(latest.hybridWatchStocks)?latest.hybridWatchStocks:[];
      const payload=buildDailySelectionPayload(latest.scanDate,formal,latest.diagnostics||{});''',
    "resend watch read"
)
replace_once(
    '      enrichThreePoolDailyPayload(payload,formal,hybrid,latest.strategyOverlap||null);',
    '      enrichThreePoolDailyPayload(payload,formal,hybrid,latest.strategyOverlap||null,watch);',
    "resend watch payload"
)
replace_once(
    '''        version:VERSION,scanDate:latest.scanDate,formalSelectedCount:formal.length,hybridSelectedCount:hybrid.length,
        totalDisplayedCount:formal.length+hybrid.length,noRescan:true,noPlanChanges:true,noTrade:true,report''',
    '''        version:VERSION,scanDate:latest.scanDate,formalSelectedCount:formal.length,hybridSelectedCount:hybrid.length,
        hybridWatchCount:watch.length,totalDisplayedCount:formal.length+hybrid.length,noRescan:true,noPlanChanges:true,noTrade:true,report''',
    "resend watch count"
)

monitor_helpers=r'''
'''
# watch_helpers already contains monitor functions; integrate into the formal monitor loop.
old_monitor='''  const notifications = [];
  for (const result of results) {
    notifications.push(...await processSignalState(result, env, taiwanDate(scheduledTime)));
  }

  const quoteCalls = loaded.stocks.length;
  const candleCalls = loaded.stocks.length * ((forceFrames || need10 ? 1 : 0) + (forceFrames || need15 ? 1 : 0));'''
new_monitor='''  const notifications = [];
  for (const result of results) {
    notifications.push(...await processSignalState(result, env, taiwanDate(scheduledTime)));
  }
  const hybridWatchMonitor=await monitorHybridWatchCandidates(env,scheduledTime,need15,forceFrames);
  notifications.push(...(hybridWatchMonitor.notifications||[]));

  const quoteCalls = loaded.stocks.length + (hybridWatchMonitor.quoteCalls||0);
  const candleCalls = loaded.stocks.length * ((forceFrames || need10 ? 1 : 0) + (forceFrames || need15 ? 1 : 0)) + (hybridWatchMonitor.candleCalls||0);'''
replace_once(old_monitor,new_monitor,"intraday hybrid watch monitor")

replace_once(
    '''    monitoredCount: results.length,
    status: results.length ? `完成${results.length}檔智慧背景監控` : "今日 0 檔，維持現金",''',
    '''    monitoredCount: results.length,
    hybridWatchMonitoredCount: hybridWatchMonitor.activeCount||0,
    status: results.length || (hybridWatchMonitor.activeCount||0)
      ? `完成Formal ${results.length}檔＋Hybrid WATCH ${hybridWatchMonitor.activeCount||0}檔監控`
      : "今日正式與WATCH皆0檔，維持現金",''',
    "monitor status hybrid watch"
)
replace_once(
    '''    notifications,
    results''',
    '''    notifications,
    hybridWatch:hybridWatchMonitor,
    results''',
    "monitor snapshot hybrid watch"
)

# Make /api/strategy-pools show current intraday Hybrid promotions plus WATCH state.
replace_once_after(
    '    if (url.pathname === "/api/strategy-pools") {',
    '''      const formal=Array.isArray(latest.stocks)?latest.stocks:[];
      const hybrid=Array.isArray(latest.hybridStocks)?latest.hybridStocks:[];''',
    '''      const formal=Array.isArray(latest.stocks)?latest.stocks:[];
      const currentHybrid=await env.STOCKS_KV?.get(HYBRID_KV_KEY,"json");
      const currentWatch=await env.STOCKS_KV?.get(HYBRID_WATCH_KV_KEY,"json");
      const hybrid=Array.isArray(currentHybrid?.stocks)?currentHybrid.stocks:(Array.isArray(latest.hybridStocks)?latest.hybridStocks:[]);
      const hybridWatch=Array.isArray(currentWatch?.stocks)?currentWatch.stocks:(Array.isArray(latest.hybridWatchStocks)?latest.hybridWatchStocks:[]);''',
    "strategy pools current watch state"
)
replace_once(
    '''        pools,overlap:latest.strategyOverlap||null,
        formalCoreChanged:false,hybridShadowOnly:true''',
    '''        pools,overlap:latest.strategyOverlap||null,
        hybridWatch:{count:hybridWatch.length,max:HYBRID_WATCH_MAX,occupiesHybridSlot:false,capitalReserved:0,stocks:hybridWatch},
        formalCoreChanged:false,hybridShadowOnly:true''',
    "strategy pools watch payload"
)

route_marker='''    if (url.pathname === "/api/strategy-pool-performance") {'''
bootstrap_route=r'''    if (url.pathname === "/api/hybrid-watch/bootstrap-latest") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="POST") return json({error:"Method not allowed"},405,true);
      const latest=await env.STOCKS_KV?.get(LAST_SCAN_KEY,"json");
      if(!latest?.scanDate) return json({ok:false,error:"尚無可重建WATCH的盤後選股日"},404,true);
      const targetDate=String(latest.scanDate);
      const scheduledTime=Date.parse(targetDate+"T18:30:00+08:00");
      const preview=await runAfterMarketScan(env,scheduledTime,{dryRun:true});
      const watch=Array.isArray(preview?.hybridWatchStocks)?preview.hybridWatchStocks.slice(0,HYBRID_WATCH_MAX):[];
      await env.STOCKS_KV.put(HYBRID_WATCH_KV_KEY,JSON.stringify({
        version:VERSION,scanDate:targetDate,planDate:nextTradingDate(targetDate),
        state:"HYBRID_WATCH",max:HYBRID_WATCH_MAX,occupiesHybridSlot:false,capitalReserved:0,
        bootstrappedAt:new Date().toISOString(),stocks:watch
      }),{expirationTtl:14*86400});
      await archiveHybridWatchCandidates(env,targetDate,watch);
      return json({ok:true,version:VERSION,scanDate:targetDate,planDate:nextTradingDate(targetDate),
        hybridWatchCount:watch.length,watchStocks:watch.map(x=>({symbol:x.symbol,name:x.name,triggerPrice:x.triggerPrice,
          maxChase:x.maxChase,missingCondition:x.missingCondition})),
        dryRunSelection:true,noFormalChanges:true,noTrade:true,noPush:true},200,true);
    }

''' + r'''    if (url.pathname === "/api/hybrid-watch-performance") {
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      return json(await readHybridWatchPerformance(env,url.searchParams.get("days")||365),200,true);
    }

'''
insert_before_once(route_marker,bootstrap_route,"hybrid watch routes")

path.write_text(text,encoding="utf-8")
print("Applied V8.9.3 Hybrid WATCH two-layer state machine")
