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
    'const VERSION = "8.4.1-provider-neutral-evidence";',
    'const VERSION = "8.5.0-trade-journal";',
    "runtime version"
)

replace_once(
'''  D1_SCHEMA_READY = true;''',
'''  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS v8_trade_journal_days (
    scan_date TEXT PRIMARY KEY,
    plan_date TEXT,
    selected_count INTEGER NOT NULL DEFAULT 0,
    total_capital REAL,
    status TEXT,
    diagnostics_json TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`).run();
  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS v8_trade_journal_plans (
    scan_date TEXT NOT NULL,
    plan_date TEXT,
    symbol TEXT NOT NULL,
    name TEXT,
    strategy TEXT,
    signal_level TEXT,
    formal_close REAL,
    buy_low REAL,
    buy_high REAL,
    breakout REAL,
    max_chase REAL,
    stop REAL,
    sell_below REAL,
    reduce_at REAL,
    profit_check REAL,
    priority_score REAL,
    reward_risk REAL,
    allocation_ratio REAL,
    total_allocation REAL,
    first_shares INTEGER,
    second_shares INTEGER,
    total_shares INTEGER,
    selected_reason TEXT,
    plan_json TEXT NOT NULL,
    recorded_at TEXT NOT NULL,
    PRIMARY KEY(scan_date,symbol)
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_v8_trade_journal_plans_symbol
    ON v8_trade_journal_plans(symbol,scan_date)`).run();
  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS v8_trade_journal_signals (
    event_id TEXT PRIMARY KEY,
    trade_date TEXT NOT NULL,
    plan_scan_date TEXT,
    plan_date TEXT,
    occurred_at TEXT NOT NULL,
    occurred_at_taipei TEXT NOT NULL,
    symbol TEXT NOT NULL,
    name TEXT,
    signal_type TEXT NOT NULL,
    signal_label TEXT,
    position_stage TEXT,
    market_price REAL,
    signal_amount REAL,
    signal_shares INTEGER,
    episode INTEGER,
    reason TEXT,
    instruction TEXT,
    push_eligible INTEGER NOT NULL DEFAULT 0,
    plan_json TEXT NOT NULL,
    event_json TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_v8_trade_journal_signals_date
    ON v8_trade_journal_signals(trade_date,occurred_at)`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_v8_trade_journal_signals_plan
    ON v8_trade_journal_signals(plan_scan_date,symbol,occurred_at)`).run();
  D1_SCHEMA_READY = true;''',
    "trade journal D1 schema"
)

helper_anchor='''async function readLiveSnapshot(env) {'''
helpers=r'''function journalNumber(value) {
  const n=Number(value);
  return Number.isFinite(n) ? n : null;
}

function journalInteger(value) {
  const n=Number(value);
  return Number.isInteger(n) ? n : null;
}

function journalStrategy(stock) {
  if(stock?.channel==="A" || stock?.mode==="PULLBACK") return "A拉回承接";
  if(stock?.channel==="B" || stock?.mode==="MOMENTUM") return "B突破後承接";
  return stock?.channel || stock?.mode || null;
}

async function recordTradeJournalDay(scanDate,stocks,totalCapital,status,diagnostics,env) {
  if(!env?.V7_DB || isTestMode(env)) return {stored:false,simulated:isTestMode(env),reason:"正式D1交易日誌僅在Production寫入"};
  try {
    await ensureD1Schema(env);
    const session=env.V7_DB.withSession("first-primary");
    const list=Array.isArray(stocks)?stocks:[];
    const planDate=list.find(stock=>stock?.planDate)?.planDate || nextTradingDate(scanDate);
    const now=new Date().toISOString();
    await session.prepare(`
      INSERT INTO v8_trade_journal_days(scan_date,plan_date,selected_count,total_capital,status,diagnostics_json,created_at,updated_at)
      VALUES(?1,?2,?3,?4,?5,?6,?7,?7)
      ON CONFLICT(scan_date) DO UPDATE SET
        plan_date=excluded.plan_date,
        selected_count=excluded.selected_count,
        total_capital=excluded.total_capital,
        status=excluded.status,
        diagnostics_json=excluded.diagnostics_json,
        updated_at=excluded.updated_at
    `).bind(String(scanDate),planDate||null,list.length,journalNumber(totalCapital),String(status||""),
      JSON.stringify(diagnostics||{}),now).run();
    await session.prepare("DELETE FROM v8_trade_journal_plans WHERE scan_date=?1").bind(String(scanDate)).run();
    for(const stock of list) {
      await session.prepare(`
        INSERT INTO v8_trade_journal_plans(
          scan_date,plan_date,symbol,name,strategy,signal_level,formal_close,buy_low,buy_high,breakout,max_chase,
          stop,sell_below,reduce_at,profit_check,priority_score,reward_risk,allocation_ratio,total_allocation,
          first_shares,second_shares,total_shares,selected_reason,plan_json,recorded_at
        ) VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,?18,?19,?20,?21,?22,?23,?24,?25)
      `).bind(
        String(scanDate),stock?.planDate||planDate||null,String(stock?.symbol||""),String(stock?.name||""),
        journalStrategy(stock),stock?.signalLevel||null,journalNumber(stock?.formalClose),journalNumber(stock?.buyLow),
        journalNumber(stock?.buyHigh),journalNumber(stock?.breakout),journalNumber(stock?.maxChase),journalNumber(stock?.stop),
        journalNumber(stock?.sellBelow),journalNumber(stock?.reduceAt),journalNumber(stock?.profitCheck),
        journalNumber(stock?.priorityScore),journalNumber(stock?.rewardRisk),journalNumber(stock?.allocationRatio),
        journalNumber(stock?.totalAllocation),journalInteger(stock?.firstShares),journalInteger(stock?.secondShares),
        journalInteger(stock?.totalShares),stock?.selectedReason||null,JSON.stringify(stock||{}),now
      ).run();
    }
    const verify=await session.prepare("SELECT selected_count FROM v8_trade_journal_days WHERE scan_date=?1").bind(String(scanDate)).first();
    const count=await session.prepare("SELECT COUNT(*) AS count FROM v8_trade_journal_plans WHERE scan_date=?1").bind(String(scanDate)).first();
    if(Number(verify?.selected_count)!==list.length || Number(count?.count)!==list.length) throw new Error("交易日誌盤後計畫讀回筆數不一致");
    return {stored:true,verified:true,scanDate,planDate,selectedCount:list.length,recordedAt:now};
  } catch(error) {
    console.warn("TRADE_JOURNAL_PLAN_WRITE_FAILED",String(error));
    return {stored:false,verified:false,scanDate,error:String(error)};
  }
}

async function recordTradeJournalSignal(result,signal,eventId,episode,tradeDate,env) {
  if(!env?.V7_DB || isTestMode(env)) return {stored:false,simulated:isTestMode(env)};
  try {
    await ensureD1Schema(env);
    const now=new Date().toISOString();
    const p=result?.plan||{};
    const event={
      eventId:String(eventId||""),
      tradeDate:String(tradeDate||taiwanDate()),
      occurredAt:now,
      occurredAtTaipei:taiwanTime(),
      symbol:String(result?.symbol||p?.symbol||""),
      name:String(result?.name||p?.name||""),
      signalType:String(signal?.type||""),
      signalLabel:signal?.label||null,
      positionStage:normalizePositionStage(p?.positionStage),
      marketPrice:journalNumber(result?.currentPrice),
      amount:journalNumber(signal?.amount),
      shares:journalInteger(signal?.shares),
      episode:Number(episode||1),
      reason:signal?.reason||null,
      instruction:signal?.instruction||null,
      pushEligible:shouldPhonePushSignal(signal?.type),
      planScanDate:p?.closeDate||null,
      planDate:p?.planDate||null
    };
    if(!event.eventId || !event.symbol || !event.signalType) throw new Error("訊號日誌缺必要欄位");
    await env.V7_DB.withSession("first-primary").prepare(`
      INSERT OR IGNORE INTO v8_trade_journal_signals(
        event_id,trade_date,plan_scan_date,plan_date,occurred_at,occurred_at_taipei,symbol,name,signal_type,signal_label,
        position_stage,market_price,signal_amount,signal_shares,episode,reason,instruction,push_eligible,plan_json,event_json,created_at
      ) VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,?18,?19,?20,?21)
    `).bind(
      event.eventId,event.tradeDate,event.planScanDate,event.planDate,event.occurredAt,event.occurredAtTaipei,event.symbol,event.name,
      event.signalType,event.signalLabel,event.positionStage,event.marketPrice,event.amount,event.shares,event.episode,event.reason,
      event.instruction,event.pushEligible?1:0,JSON.stringify(p),JSON.stringify(event),now
    ).run();
    return {stored:true,eventId:event.eventId,occurredAt:event.occurredAt};
  } catch(error) {
    console.warn("TRADE_JOURNAL_SIGNAL_WRITE_FAILED",String(error));
    return {stored:false,error:String(error)};
  }
}

function journalTradeStats(plans,signals) {
  const planKeys=new Set((plans||[]).map(row=>String(row.scan_date)+"|"+String(row.symbol)));
  const grouped=new Map();
  for(const row of (signals||[])) {
    const key=String(row.plan_scan_date||row.trade_date||"")+"|"+String(row.symbol||"");
    if(!grouped.has(key)) grouped.set(key,[]);
    grouped.get(key).push(row);
  }
  const trades=[];
  let buyTriggeredPlans=0,profitCheckPlans=0;
  for(const key of planKeys) {
    const events=(grouped.get(key)||[]).slice().sort((a,b)=>String(a.occurred_at).localeCompare(String(b.occurred_at)));
    const buy=events.find(item=>item.signal_type==="BUY" && journalNumber(item.market_price)!==null);
    if(!buy) continue;
    buyTriggeredPlans+=1;
    if(events.some(item=>item.signal_type==="PROFIT_CHECK" && String(item.occurred_at)>=String(buy.occurred_at))) profitCheckPlans+=1;
    const exit=events.find(item=>["SELL","STOP_LOSS"].includes(item.signal_type) &&
      String(item.occurred_at)>String(buy.occurred_at) && journalNumber(item.market_price)!==null);
    if(!exit) {
      trades.push({key,symbol:buy.symbol,name:buy.name,entryTime:buy.occurred_at,entryPrice:Number(buy.market_price),status:"OPEN",
        profitCheck:events.some(item=>item.signal_type==="PROFIT_CHECK")});
      continue;
    }
    const entryPrice=Number(buy.market_price),exitPrice=Number(exit.market_price);
    const returnPct=entryPrice>0 ? (exitPrice-entryPrice)/entryPrice*100 : null;
    trades.push({key,symbol:buy.symbol,name:buy.name,entryTime:buy.occurred_at,entryPrice,exitTime:exit.occurred_at,exitPrice,
      exitType:exit.signal_type,returnPct:returnPct===null?null:round(returnPct,2),
      status:returnPct>0?"WIN":returnPct<0?"LOSS":"FLAT",profitCheck:events.some(item=>item.signal_type==="PROFIT_CHECK")});
  }
  const completed=trades.filter(item=>item.status!=="OPEN");
  const wins=completed.filter(item=>item.status==="WIN").length;
  const losses=completed.filter(item=>item.status==="LOSS").length;
  const flats=completed.filter(item=>item.status==="FLAT").length;
  const avgReturn=completed.length ? round(completed.reduce((sum,item)=>sum+Number(item.returnPct||0),0)/completed.length,2) : null;
  return {
    definition:"主勝率口徑：每一盤後入選計畫，以首次正式BUY訊號當進場價，第一個SELL或STOP_LOSS正式訊號當出場價；未完成回合不列勝負。ADD/REDUCE/PROFIT_CHECK完整保留於事件紀錄但不改主勝率口徑。",
    selectedPlans:planKeys.size,
    buyTriggeredPlans,
    buyTriggerRate:planKeys.size?round(buyTriggeredPlans/planKeys.size*100,2):null,
    completedTrades:completed.length,
    openTrades:trades.filter(item=>item.status==="OPEN").length,
    wins,losses,flats,
    winRate:completed.length?round(wins/completed.length*100,2):null,
    averageReturnPct:avgReturn,
    profitCheckTriggeredPlans:profitCheckPlans,
    profitCheckRate:buyTriggeredPlans?round(profitCheckPlans/buyTriggeredPlans*100,2):null,
    trades
  };
}

async function readTradeJournal(env,days=60) {
  if(!env?.V7_DB) return {configured:false};
  await ensureD1Schema(env);
  const safeDays=Math.max(1,Math.min(365,Number(days)||60));
  const fromDate=shiftDateString(taiwanDate(),-safeDays);
  const session=env.V7_DB.withSession("first-primary");
  const [dayRows,planRows,signalRows]=await Promise.all([
    session.prepare(`SELECT scan_date,plan_date,selected_count,total_capital,status,created_at,updated_at
      FROM v8_trade_journal_days WHERE scan_date>=?1 ORDER BY scan_date DESC LIMIT 366`).bind(fromDate).all(),
    session.prepare(`SELECT scan_date,plan_date,symbol,name,strategy,signal_level,formal_close,buy_low,buy_high,breakout,max_chase,
      stop,sell_below,reduce_at,profit_check,priority_score,reward_risk,allocation_ratio,total_allocation,first_shares,second_shares,
      total_shares,selected_reason,recorded_at FROM v8_trade_journal_plans WHERE scan_date>=?1 ORDER BY scan_date DESC,symbol ASC LIMIT 2200`).bind(fromDate).all(),
    session.prepare(`SELECT event_id,trade_date,plan_scan_date,plan_date,occurred_at,occurred_at_taipei,symbol,name,signal_type,signal_label,
      position_stage,market_price,signal_amount,signal_shares,episode,reason,instruction,push_eligible
      FROM v8_trade_journal_signals WHERE trade_date>=?1 ORDER BY occurred_at ASC LIMIT 6000`).bind(fromDate).all()
  ]);
  const daysList=Array.isArray(dayRows?.results)?dayRows.results:[];
  const plans=Array.isArray(planRows?.results)?planRows.results:[];
  const signals=Array.isArray(signalRows?.results)?signalRows.results:[];
  const counts={};
  for(const row of signals) counts[row.signal_type]=(counts[row.signal_type]||0)+1;
  return {
    configured:true,windowDays:safeDays,fromDate,toDate:taiwanDate(),
    recordedDays:daysList.length,plans:plans.length,signals:signals.length,signalCounts:counts,
    stats:journalTradeStats(plans,signals),days:daysList,planRows:plans,signalRows:signals
  };
}

async function readTradeJournalHealth(env,scanDate) {
  if(!env?.V7_DB) return {configured:false,ok:false};
  await ensureD1Schema(env);
  const date=String(scanDate||"");
  const session=env.V7_DB.withSession("first-primary");
  const [day,plans,signals]=await Promise.all([
    session.prepare("SELECT scan_date,selected_count,updated_at FROM v8_trade_journal_days WHERE scan_date=?1").bind(date).first(),
    session.prepare("SELECT COUNT(*) AS count FROM v8_trade_journal_plans WHERE scan_date=?1").bind(date).first(),
    session.prepare("SELECT COUNT(*) AS count FROM v8_trade_journal_signals WHERE plan_scan_date=?1").bind(date).first()
  ]);
  const selectedCount=Number(day?.selected_count||0),planCount=Number(plans?.count||0);
  return {configured:true,ok:Boolean(day)&&selectedCount===planCount,scanDate:date,selectedCount,planCount,
    signalCount:Number(signals?.count||0),updatedAt:day?.updated_at||null};
}

function tradeJournalPage() {
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>V8 選股／訊號交易日誌</title><style>
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft JhengHei",sans-serif;background:#f4f6f8;margin:0;padding:18px;color:#222}
  .wrap{max-width:1250px;margin:auto}.panel,.card{background:#fff;border-radius:12px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,.07)}
  .panel{margin-bottom:14px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px}.big{font-size:28px;font-weight:900}
  .muted{color:#666;font-size:13px}input,select,button{padding:10px;border-radius:8px;border:1px solid #bbb}button{background:#1f6feb;color:#fff;border:0;font-weight:800;cursor:pointer}
  table{width:100%;border-collapse:collapse;background:#fff}th,td{padding:8px;border-bottom:1px solid #eee;text-align:left;vertical-align:top;font-size:13px}th{background:#eef2f6;position:sticky;top:0}
  .scroll{overflow:auto;max-height:560px}.win{color:#b91c1c;font-weight:800}.loss{color:#15803d;font-weight:800}
  </style></head><body><div class="wrap"><h1>V8 選股／訊號交易日誌</h1>
  <div class="panel"><label>ADMIN_TOKEN　<input id="token" type="password" autocomplete="off"></label>
  <label style="margin-left:8px">期間 <select id="days"><option>30</option><option selected>60</option><option>90</option><option>180</option><option>365</option></select> 天</label>
  <button onclick="loadJournal()">載入紀錄</button><p class="muted">Token 只保存在本頁 sessionStorage，不寫入網址。勝率只計算已完成的 BUY → SELL/STOP_LOSS 回合，未出場不算輸贏。</p></div>
  <div id="summary" class="grid"></div>
  <div class="panel"><h2>已完成／未完成交易回合</h2><div class="scroll"><table><thead><tr><th>股票</th><th>進場</th><th>出場</th><th>結果</th><th>報酬</th></tr></thead><tbody id="trades"></tbody></table></div></div>
  <div class="panel"><h2>每日選股與建議價位</h2><div class="scroll"><table><thead><tr><th>選股日</th><th>計畫日</th><th>股票</th><th>策略</th><th>買進區</th><th>突破/追價上限</th><th>停損</th><th>減碼</th><th>停利檢查</th><th>RR</th></tr></thead><tbody id="plans"></tbody></table></div></div>
  <div class="panel"><h2>所有訊號事件（含時間）</h2><div class="scroll"><table><thead><tr><th>時間</th><th>股票</th><th>訊號</th><th>當時價格</th><th>階段</th><th>股數</th><th>原因</th></tr></thead><tbody id="signals"></tbody></table></div></div>
  <script>
  const esc=x=>String(x??"").replace(/[&<>]/g,c=>c==="&"?"&amp;":c==="<"?"&lt;":"&gt;");
  document.getElementById("token").value=sessionStorage.getItem("v8AdminToken")||"";
  const fmt=x=>x===null||x===undefined?"-":Number(x).toLocaleString("zh-TW",{maximumFractionDigits:2});
  async function loadJournal(){
    const token=document.getElementById("token").value.trim();sessionStorage.setItem("v8AdminToken",token);
    const days=document.getElementById("days").value;
    const r=await fetch("/api/journal?days="+encodeURIComponent(days),{headers:{"x-admin-token":token}});
    const d=await r.json();if(!r.ok){alert(d.error||"讀取失敗");return}
    const s=d.stats||{};
    const cards=[["紀錄交易日",d.recordedDays],["入選計畫",d.plans],["訊號事件",d.signals],["BUY觸發率",s.buyTriggerRate==null?"-":s.buyTriggerRate+"%"],
      ["完成回合",s.completedTrades],["勝／敗",String(s.wins||0)+" / "+String(s.losses||0)],["主勝率",s.winRate==null?"-":s.winRate+"%"],["平均報酬",s.averageReturnPct==null?"-":s.averageReturnPct+"%"]];
    document.getElementById("summary").innerHTML=cards.map(x=>'<div class="card"><div class="muted">'+esc(x[0])+'</div><div class="big">'+esc(x[1])+'</div></div>').join("");
    document.getElementById("trades").innerHTML=(s.trades||[]).slice().reverse().map(t=>'<tr><td>'+esc(t.symbol+" "+(t.name||""))+'</td><td>'+esc(t.entryTime||"-")+'<br>'+fmt(t.entryPrice)+'</td><td>'+esc(t.exitTime||"尚未出場")+'<br>'+fmt(t.exitPrice)+'</td><td class="'+(t.status==="WIN"?"win":t.status==="LOSS"?"loss":"")+'">'+esc(t.status)+'</td><td>'+esc(t.returnPct==null?"-":t.returnPct+"%")+'</td></tr>').join("");
    document.getElementById("plans").innerHTML=(d.planRows||[]).map(p=>'<tr><td>'+esc(p.scan_date)+'</td><td>'+esc(p.plan_date||"-")+'</td><td>'+esc(p.symbol+" "+(p.name||""))+'</td><td>'+esc(p.strategy||"-")+' / '+esc(p.signal_level||"-")+'</td><td>'+fmt(p.buy_low)+' ~ '+fmt(p.buy_high)+'</td><td>'+fmt(p.breakout)+' / '+fmt(p.max_chase)+'</td><td>'+fmt(p.stop)+'</td><td>'+fmt(p.reduce_at)+'</td><td>'+fmt(p.profit_check)+'</td><td>'+fmt(p.reward_risk)+'</td></tr>').join("");
    document.getElementById("signals").innerHTML=(d.signalRows||[]).slice().reverse().map(x=>'<tr><td>'+esc(x.occurred_at_taipei||x.occurred_at)+'</td><td>'+esc(x.symbol+" "+(x.name||""))+'</td><td>'+esc(x.signal_type+" "+(x.signal_label||""))+'</td><td>'+fmt(x.market_price)+'</td><td>'+esc(x.position_stage||"-")+'</td><td>'+fmt(x.signal_shares)+'</td><td>'+esc(x.reason||"-")+'</td></tr>').join("");
  }
  </script></div></body></html>`;
}

''' + helper_anchor
replace_once(helper_anchor,helpers,"trade journal helpers")

route_anchor='''    // ==================================================
    // 今日標的一鍵匯入頁
    // ==================================================
    if (url.pathname === "/admin") {
      return html(adminPage(), 200, true);
    }'''
routes=r'''    // ==================================================
    // V8.5：選股／訊號交易日誌與勝率觀察
    // ==================================================
    if (url.pathname === "/journal") return html(tradeJournalPage(),200,true);

    if (url.pathname === "/api/journal") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      return json(await readTradeJournal(env,url.searchParams.get("days")||60),200,true);
    }

    if (url.pathname === "/api/journal/health") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      const date=normalizeMarketDate(url.searchParams.get("date")) || mostRecentWeekday(taiwanDate());
      return json(await readTradeJournalHealth(env,date),200,true);
    }

    if (url.pathname === "/api/journal/backfill-latest") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="POST") return json({error:"Method not allowed"},405,true);
      if(!env.STOCKS_KV) return json({error:"Missing STOCKS_KV"},503,true);
      const latest=await env.STOCKS_KV.get(LAST_SCAN_KEY,"json");
      if(!latest || latest.dryRun===true || !latest.scanDate) return json({error:"沒有可回填的正式盤後紀錄"},409,true);
      const stored=await recordTradeJournalDay(latest.scanDate,latest.stocks,latest.totalCapital,latest.status,latest.diagnostics,env);
      return json({ok:stored.verified===true,backfilled:true,...stored,noPlanChanges:true,noPush:true,noTrade:true},stored.verified?200:502,true);
    }

''' + route_anchor
replace_once(route_anchor,routes,"trade journal routes")

replace_once(
'''  const historySeedState = await readHistorySeedState(env);''',
'''  const journal = !dryRun ? await recordTradeJournalDay(
    marketDate,stocks,totalCapital,
    stocks.length ? `今日選出 ${stocks.length} 檔` : "今日0檔，維持現金",
    scan.diagnostics,env
  ) : {stored:false,simulated:true};

  const historySeedState = await readHistorySeedState(env);''',
    "record daily selected plans"
)

replace_once(
'''    dailyReport: report,
    pipeline: {''',
'''    dailyReport: report,
    journal,
    pipeline: {''',
    "journal scan summary"
)

replace_once(
'''    payload.signalId += `:episode-${episode}`;''',
'''    payload.signalId += `:episode-${episode}`;
    const journalEvent=await recordTradeJournalSignal(result,signal,payload.signalId,episode,tradeDate,env);
    if(journalEvent?.stored!==true && !isTestMode(env)) console.warn("交易訊號已成立，但日誌寫入未確認",payload.signalId);''',
    "record signal occurrence before push"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.5.0 trade journal")
