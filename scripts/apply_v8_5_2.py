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
    'const VERSION = "8.5.0-trade-journal";',
    'const VERSION = "8.5.2-history-backfill";',
    "runtime version"
)

replace_once(
'''  D1_SCHEMA_READY = true;''',
'''  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS v8_trade_journal_recovered (
    selection_date TEXT NOT NULL,
    strategy TEXT NOT NULL,
    symbol TEXT NOT NULL,
    name TEXT,
    reference_price REAL,
    buy_low REAL,
    buy_high REAL,
    breakout REAL,
    max_chase REAL,
    stop REAL,
    profit_check REAL,
    reward_risk REAL,
    signal_level TEXT,
    record_status TEXT NOT NULL,
    source TEXT,
    notes TEXT,
    source_json TEXT NOT NULL,
    imported_at TEXT NOT NULL,
    PRIMARY KEY(selection_date,strategy,symbol)
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_v8_trade_journal_recovered_date
    ON v8_trade_journal_recovered(selection_date,symbol)`).run();
  D1_SCHEMA_READY = true;''',
    "historical recovery schema"
)

anchor='''async function readTradeJournal(env,days=60) {'''
helpers=r'''async function importRecoveredJournalRows(rows,env) {
  if(!env?.V7_DB) return {ok:false,configured:false,error:"Missing V7_DB"};
  if(isTestMode(env)) return {ok:true,configured:true,simulated:true,count:Array.isArray(rows)?rows.length:0};
  if(!Array.isArray(rows) || rows.length<1 || rows.length>500) throw new Error("records必須為1~500筆");
  await ensureD1Schema(env);
  const session=env.V7_DB.withSession("first-primary");
  const now=new Date().toISOString();
  let imported=0;
  for(const item of rows) {
    const date=String(item?.date||"").trim();
    const strategy=String(item?.strategy||"").trim();
    const symbol=String(item?.symbol||"").trim();
    const name=String(item?.name||"").trim();
    const status=String(item?.status||"RECOVERED").trim().toUpperCase();
    const source=String(item?.source||"project-chat").trim();
    const notes=String(item?.notes||"").trim();
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("歷史紀錄日期格式錯誤: "+date);
    if(!strategy || strategy.length>120) throw new Error("歷史紀錄策略欄位錯誤");
    if(!/^\d{4,6}$/.test(symbol)) throw new Error("歷史紀錄股票代號錯誤: "+symbol);
    if(name.length>80 || notes.length>1200 || source.length>80 || status.length>40) throw new Error("歷史紀錄文字欄位過長");
    await session.prepare(`
      INSERT INTO v8_trade_journal_recovered(
        selection_date,strategy,symbol,name,reference_price,buy_low,buy_high,breakout,max_chase,stop,profit_check,
        reward_risk,signal_level,record_status,source,notes,source_json,imported_at
      ) VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,?18)
      ON CONFLICT(selection_date,strategy,symbol) DO UPDATE SET
        name=excluded.name,reference_price=excluded.reference_price,buy_low=excluded.buy_low,buy_high=excluded.buy_high,
        breakout=excluded.breakout,max_chase=excluded.max_chase,stop=excluded.stop,profit_check=excluded.profit_check,
        reward_risk=excluded.reward_risk,signal_level=excluded.signal_level,record_status=excluded.record_status,
        source=excluded.source,notes=excluded.notes,source_json=excluded.source_json,imported_at=excluded.imported_at
    `).bind(
      date,strategy,symbol,name||null,journalNumber(item?.referencePrice),journalNumber(item?.buyLow),journalNumber(item?.buyHigh),
      journalNumber(item?.breakout),journalNumber(item?.maxChase),journalNumber(item?.stop),journalNumber(item?.profitCheck),
      journalNumber(item?.rewardRisk),item?.signalLevel||null,status,source||null,notes||null,JSON.stringify(item),now
    ).run();
    imported+=1;
  }
  const verify=await session.prepare("SELECT COUNT(*) AS count FROM v8_trade_journal_recovered").first();
  return {ok:true,configured:true,imported,total:Number(verify?.count||0),importedAt:now,noPlanChanges:true,noPush:true,noTrade:true};
}

async function readTradeJournal(env,days=60) {'''
replace_once(anchor,helpers,"historical import helper")

replace_once(
'''  const safeDays=Math.max(1,Math.min(365,Number(days)||60));''',
'''  const safeDays=Math.max(1,Math.min(730,Number(days)||60));''',
    "journal window to 730 days"
)

replace_once(
'''  const [dayRows,planRows,signalRows]=await Promise.all([
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
  };''',
'''  const [dayRows,planRows,signalRows,recoveredRows]=await Promise.all([
    session.prepare(`SELECT scan_date,plan_date,selected_count,total_capital,status,created_at,updated_at
      FROM v8_trade_journal_days WHERE scan_date>=?1 ORDER BY scan_date DESC LIMIT 366`).bind(fromDate).all(),
    session.prepare(`SELECT scan_date,plan_date,symbol,name,strategy,signal_level,formal_close,buy_low,buy_high,breakout,max_chase,
      stop,sell_below,reduce_at,profit_check,priority_score,reward_risk,allocation_ratio,total_allocation,first_shares,second_shares,
      total_shares,selected_reason,recorded_at FROM v8_trade_journal_plans WHERE scan_date>=?1 ORDER BY scan_date DESC,symbol ASC LIMIT 2200`).bind(fromDate).all(),
    session.prepare(`SELECT event_id,trade_date,plan_scan_date,plan_date,occurred_at,occurred_at_taipei,symbol,name,signal_type,signal_label,
      position_stage,market_price,signal_amount,signal_shares,episode,reason,instruction,push_eligible
      FROM v8_trade_journal_signals WHERE trade_date>=?1 ORDER BY occurred_at ASC LIMIT 6000`).bind(fromDate).all(),
    session.prepare(`SELECT selection_date,strategy,symbol,name,reference_price,buy_low,buy_high,breakout,max_chase,stop,profit_check,
      reward_risk,signal_level,record_status,source,notes,imported_at
      FROM v8_trade_journal_recovered WHERE selection_date>=?1 ORDER BY selection_date DESC,strategy ASC,symbol ASC LIMIT 5000`).bind(fromDate).all()
  ]);
  const daysList=Array.isArray(dayRows?.results)?dayRows.results:[];
  const plans=Array.isArray(planRows?.results)?planRows.results:[];
  const signals=Array.isArray(signalRows?.results)?signalRows.results:[];
  const recovered=Array.isArray(recoveredRows?.results)?recoveredRows.results:[];
  const counts={};
  for(const row of signals) counts[row.signal_type]=(counts[row.signal_type]||0)+1;
  return {
    configured:true,windowDays:safeDays,fromDate,toDate:taiwanDate(),
    recordedDays:daysList.length,plans:plans.length,signals:signals.length,recoveredSelections:recovered.length,signalCounts:counts,
    stats:journalTradeStats(plans,signals),days:daysList,planRows:plans,signalRows:signals,recoveredRows:recovered
  };''',
    "read recovered journal rows"
)

replace_once(
'''  <label style="margin-left:8px">期間 <select id="days"><option>30</option><option selected>60</option><option>90</option><option>180</option><option>365</option></select> 天</label>
  <button onclick="loadJournal()">載入紀錄</button><p class="muted">Token 只保存在本頁 sessionStorage，不寫入網址。勝率只計算已完成的 BUY → SELL/STOP_LOSS 回合，未出場不算輸贏。</p></div>''',
'''  <label style="margin-left:8px">期間 <select id="days"><option>30</option><option selected>60</option><option>90</option><option>180</option><option>365</option><option value="730">730</option></select> 天</label>
  <button onclick="loadJournal()">載入紀錄</button>
  <p id="journalStatus" class="muted"><b>尚未載入資料。</b> 日誌 API 有權限保護；請輸入 ADMIN_TOKEN 後按「載入紀錄」。</p>
  <p class="muted">Token 只保存在本頁 sessionStorage，不寫入網址。主勝率只計算 V8 正式訊號 BUY → SELL/STOP_LOSS；歷史聊天室回填會另外保存，不會偽造成當時真的觸發過盤中訊號。</p></div>''',
    "journal UX and 730-day window"
)

replace_once(
'''  <div class="panel"><h2>所有訊號事件（含時間）</h2><div class="scroll"><table><thead><tr><th>時間</th><th>股票</th><th>訊號</th><th>當時價格</th><th>階段</th><th>股數</th><th>原因</th></tr></thead><tbody id="signals"></tbody></table></div></div>''',
'''  <div class="panel"><h2>歷史聊天室／專案檔案回填</h2><p class="muted">依日期保存過去可核對的策略選股、正式篩選、候選與被取代名單；缺少的價位維持空白，不猜測。SUPERSEDED / SCREENED 類型不納入主勝率。</p><div class="scroll"><table><thead><tr><th>日期</th><th>策略／來源</th><th>股票</th><th>當時參考價</th><th>買進區</th><th>突破/追價</th><th>停損</th><th>停利檢查</th><th>狀態</th><th>備註</th></tr></thead><tbody id="recovered"></tbody></table></div></div>
  <div class="panel"><h2>所有訊號事件（含時間）</h2><div class="scroll"><table><thead><tr><th>時間</th><th>股票</th><th>訊號</th><th>當時價格</th><th>階段</th><th>股數</th><th>原因</th></tr></thead><tbody id="signals"></tbody></table></div></div>''',
    "historical recovered journal table"
)

replace_once(
'''  async function loadJournal(){
    const token=document.getElementById("token").value.trim();sessionStorage.setItem("v8AdminToken",token);
    const days=document.getElementById("days").value;
    const r=await fetch("/api/journal?days="+encodeURIComponent(days),{headers:{"x-admin-token":token}});
    const d=await r.json();if(!r.ok){alert(d.error||"讀取失敗");return}
    const s=d.stats||{};''',
'''  async function loadJournal(){
    const status=document.getElementById("journalStatus");
    const token=document.getElementById("token").value.trim();
    if(!token){status.innerHTML="<b>尚未載入：</b>請先輸入 ADMIN_TOKEN。";return}
    sessionStorage.setItem("v8AdminToken",token);
    const days=document.getElementById("days").value;
    status.textContent="讀取交易日誌中…";
    const r=await fetch("/api/journal?days="+encodeURIComponent(days),{headers:{"x-admin-token":token}});
    const d=await r.json();if(!r.ok){status.innerHTML="<b>讀取失敗：</b>"+esc(d.error||("HTTP "+r.status));return}
    status.innerHTML="<b>已載入：</b>"+esc(d.recordedDays)+" 個V8交易日、"+esc(d.plans)+" 筆正式計畫、"+esc(d.recoveredSelections||0)+" 筆歷史回填、"+esc(d.signals)+" 筆訊號事件。";
    const s=d.stats||{};''',
    "journal explicit load state"
)

replace_once(
'''    const cards=[["紀錄交易日",d.recordedDays],["入選計畫",d.plans],["訊號事件",d.signals],["BUY觸發率",s.buyTriggerRate==null?"-":s.buyTriggerRate+"%"],''',
'''    const cards=[["V8紀錄交易日",d.recordedDays],["V8正式計畫",d.plans],["歷史回填",d.recoveredSelections||0],["訊號事件",d.signals],["BUY觸發率",s.buyTriggerRate==null?"-":s.buyTriggerRate+"%"],''',
    "journal summary recovered count"
)

replace_once(
'''    document.getElementById("signals").innerHTML=(d.signalRows||[]).slice().reverse().map(x=>'<tr><td>'+esc(x.occurred_at_taipei||x.occurred_at)+'</td><td>'+esc(x.symbol+" "+(x.name||""))+'</td><td>'+esc(x.signal_type+" "+(x.signal_label||""))+'</td><td>'+fmt(x.market_price)+'</td><td>'+esc(x.position_stage||"-")+'</td><td>'+fmt(x.signal_shares)+'</td><td>'+esc(x.reason||"-")+'</td></tr>').join("");''',
'''    document.getElementById("recovered").innerHTML=(d.recoveredRows||[]).map(x=>'<tr><td>'+esc(x.selection_date)+'</td><td>'+esc(x.strategy||"-")+'<br><span class="muted">'+esc(x.source||"-")+'</span></td><td>'+esc(x.symbol+" "+(x.name||""))+'</td><td>'+fmt(x.reference_price)+'</td><td>'+fmt(x.buy_low)+' ~ '+fmt(x.buy_high)+'</td><td>'+fmt(x.breakout)+' / '+fmt(x.max_chase)+'</td><td>'+fmt(x.stop)+'</td><td>'+fmt(x.profit_check)+'</td><td>'+esc(x.record_status||"-")+'</td><td>'+esc(x.notes||"-")+'</td></tr>').join("");
    document.getElementById("signals").innerHTML=(d.signalRows||[]).slice().reverse().map(x=>'<tr><td>'+esc(x.occurred_at_taipei||x.occurred_at)+'</td><td>'+esc(x.symbol+" "+(x.name||""))+'</td><td>'+esc(x.signal_type+" "+(x.signal_label||""))+'</td><td>'+fmt(x.market_price)+'</td><td>'+esc(x.position_stage||"-")+'</td><td>'+fmt(x.signal_shares)+'</td><td>'+esc(x.reason||"-")+'</td></tr>').join("");''',
    "render recovered rows"
)

route_anchor='''    if (url.pathname === "/api/journal/health") {'''
new_route=r'''    if (url.pathname === "/api/journal/history-import") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="POST") return json({error:"Method not allowed"},405,true);
      try {
        const body=await request.json();
        const result=await importRecoveredJournalRows(body?.records,env);
        return json(result,result.ok?200:502,true);
      } catch(error) {
        return json({ok:false,error:String(error),noPlanChanges:true,noPush:true,noTrade:true},400,true);
      }
    }

''' + route_anchor
replace_once(route_anchor,new_route,"historical import route")

path.write_text(text,encoding="utf-8")
print("Applied V8.5.2 historical project-chat backfill")
