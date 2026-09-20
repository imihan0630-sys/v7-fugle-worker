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
    'const VERSION = "8.6.1-shared-navigation";',
    'const VERSION = "8.6.2-v7-formal-performance";',
    "runtime version"
)

replace_once(
'''  D1_SCHEMA_READY = true;''',
'''  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS v7_formal_scan_backfill (
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
    profit_check REAL,
    reward_risk REAL,
    source TEXT NOT NULL,
    source_json TEXT NOT NULL,
    imported_at TEXT NOT NULL,
    PRIMARY KEY(scan_date,symbol)
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_v7_formal_scan_backfill_date
    ON v7_formal_scan_backfill(scan_date,symbol)`).run();
  D1_SCHEMA_READY = true;''',
    "formal scan backfill schema"
)

anchor='''function journalPerformanceAggregate(rows,keyFn) {'''
helpers=r'''async function importV7FormalScanBackfill(rows,env) {
  if(!env?.V7_DB) return {ok:false,configured:false,error:"Missing V7_DB"};
  if(isTestMode(env)) return {ok:true,configured:true,simulated:true,count:Array.isArray(rows)?rows.length:0};
  if(!Array.isArray(rows)||rows.length<1||rows.length>200) throw new Error("records必須為1~200筆");
  await ensureD1Schema(env);
  const session=env.V7_DB.withSession("first-primary");
  const now=new Date().toISOString();
  let imported=0;
  for(const item of rows) {
    const scanDate=String(item?.scanDate||"").trim(),planDate=String(item?.planDate||"").trim();
    const symbol=String(item?.symbol||"").trim(),name=String(item?.name||"").trim();
    if(!/^\d{4}-\d{2}-\d{2}$/.test(scanDate)||!/^(\d{4}-\d{2}-\d{2})?$/.test(planDate)) throw new Error("V7正式掃描日期格式錯誤");
    if(!/^\d{4,6}$/.test(symbol)) throw new Error("V7正式掃描股票代號錯誤: "+symbol);
    await session.prepare(`
      INSERT INTO v7_formal_scan_backfill(
        scan_date,plan_date,symbol,name,strategy,signal_level,formal_close,buy_low,buy_high,breakout,max_chase,
        stop,profit_check,reward_risk,source,source_json,imported_at
      ) VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17)
      ON CONFLICT(scan_date,symbol) DO UPDATE SET
        plan_date=excluded.plan_date,name=excluded.name,strategy=excluded.strategy,signal_level=excluded.signal_level,
        formal_close=excluded.formal_close,buy_low=excluded.buy_low,buy_high=excluded.buy_high,breakout=excluded.breakout,
        max_chase=excluded.max_chase,stop=excluded.stop,profit_check=excluded.profit_check,reward_risk=excluded.reward_risk,
        source=excluded.source,source_json=excluded.source_json,imported_at=excluded.imported_at
    `).bind(
      scanDate,planDate||null,symbol,name||null,item?.strategy||null,item?.signalLevel||null,journalNumber(item?.formalClose),
      journalNumber(item?.buyLow),journalNumber(item?.buyHigh),journalNumber(item?.breakout),journalNumber(item?.maxChase),
      journalNumber(item?.stop),journalNumber(item?.profitCheck),journalNumber(item?.rewardRisk),
      String(item?.source||"V7_FORMAL_SCAN_BACKFILL"),JSON.stringify(item),now
    ).run();
    imported+=1;
  }
  const verify=await session.prepare("SELECT COUNT(*) AS count FROM v7_formal_scan_backfill").first();
  return {ok:true,configured:true,imported,total:Number(verify?.count||0),importedAt:now,noPlanChanges:true,noPush:true,noTrade:true};
}

async function readV7FormalSelectionPerformance(env,days=730) {
  if(!env?.V7_DB) return {configured:false,rows:[],summary:{total:0,matured:0,pending:0}};
  await ensureD1Schema(env);
  const safeDays=Math.max(1,Math.min(730,Number(days)||730));
  const fromDate=shiftDateString(taiwanDate(),-(safeDays-1));
  const session=env.V7_DB.withSession("first-primary");
  const [backfillRes,journalRes]=await Promise.all([
    session.prepare(`SELECT scan_date,plan_date,symbol,name,strategy,signal_level,formal_close,buy_low,buy_high,breakout,max_chase,
      stop,profit_check,reward_risk,source FROM v7_formal_scan_backfill WHERE scan_date>=?1 ORDER BY scan_date ASC,symbol ASC`).bind(fromDate).all(),
    session.prepare(`SELECT scan_date,plan_date,symbol,name,strategy,signal_level,formal_close,buy_low,buy_high,breakout,max_chase,
      stop,profit_check,reward_risk FROM v8_trade_journal_plans WHERE scan_date>=?1 ORDER BY scan_date ASC,symbol ASC`).bind(fromDate).all()
  ]);
  const merged=new Map();
  for(const r of (backfillRes?.results||[])) merged.set(String(r.scan_date)+"|"+String(r.symbol),{...r,source:r.source||"V7_FORMAL_SCAN_BACKFILL"});
  for(const r of (journalRes?.results||[])) merged.set(String(r.scan_date)+"|"+String(r.symbol),{...r,source:"AUTO_FORMAL_SCAN"});
  const selections=[...merged.values()];
  const symbols=[...new Set(selections.map(r=>String(r.symbol)).filter(Boolean))];
  const histories={};
  for(let i=0;i<symbols.length;i+=50) {
    const chunk=symbols.slice(i,i+50);
    if(!chunk.length) continue;
    const placeholders=chunk.map((_,idx)=>"?"+(idx+1)).join(",");
    const res=await session.prepare("SELECT symbol,history_json FROM v7_history_cache WHERE symbol IN ("+placeholders+")").bind(...chunk).all();
    for(const row of (res?.results||[])) {
      try {
        const parsed=JSON.parse(row.history_json||"[]");
        if(Array.isArray(parsed)&&parsed.length) histories[String(row.symbol)]=parsed;
      } catch(_){}
    }
  }
  const rows=selections.map(sel=>{
    const history=(histories[String(sel.symbol)]||[]).slice().sort((a,b)=>String(a.date||"").localeCompare(String(b.date||"")));
    const latest=history.length?history[history.length-1]:null;
    const baselineBar=history.find(bar=>String(bar.date||"").slice(0,10)===String(sel.scan_date));
    const baseline=journalNumber(sel.formal_close) ?? journalNumber(baselineBar?.close);
    const latestClose=journalNumber(latest?.close),latestDate=latest?.date?String(latest.date).slice(0,10):null;
    const matured=Boolean(baseline!==null&&latestClose!==null&&latestDate&&latestDate>String(sel.scan_date)&&(!sel.plan_date||String(sel.plan_date)<=latestDate));
    const returnPct=matured&&baseline>0?round((latestClose-baseline)/baseline*100,2):null;
    return {
      scanDate:sel.scan_date,planDate:sel.plan_date||null,symbol:String(sel.symbol),name:sel.name||"",
      strategy:sel.strategy||"",signalLevel:sel.signal_level||"",formalClose:baseline,
      latestClose,latestDate,returnPct,status:matured?(returnPct>0?"POSITIVE":returnPct<0?"NEGATIVE":"FLAT"):"PENDING",
      buyLow:journalNumber(sel.buy_low),buyHigh:journalNumber(sel.buy_high),breakout:journalNumber(sel.breakout),
      maxChase:journalNumber(sel.max_chase),stop:journalNumber(sel.stop),profitCheck:journalNumber(sel.profit_check),
      rewardRisk:journalNumber(sel.reward_risk),source:sel.source
    };
  }).sort((a,b)=>b.scanDate.localeCompare(a.scanDate)||a.symbol.localeCompare(b.symbol));
  const matured=rows.filter(r=>r.status!=="PENDING"&&r.returnPct!==null);
  const positive=matured.filter(r=>r.returnPct>0).length,negative=matured.filter(r=>r.returnPct<0).length,flat=matured.filter(r=>r.returnPct===0).length;
  const scanGroups={};
  for(const row of rows) {
    const group=(scanGroups[row.scanDate] ||= {scanDate:row.scanDate,total:0,matured:0,positive:0,negative:0,flat:0,returns:[]});
    group.total+=1;
    if(row.status!=="PENDING"&&row.returnPct!==null){group.matured+=1;group.returns.push(row.returnPct);if(row.returnPct>0)group.positive+=1;else if(row.returnPct<0)group.negative+=1;else group.flat+=1;}
  }
  const byScanDate=Object.values(scanGroups).map(g=>({
    scanDate:g.scanDate,total:g.total,matured:g.matured,positive:g.positive,negative:g.negative,flat:g.flat,
    positiveRate:g.matured?round(g.positive/g.matured*100,2):null,
    averageReturnPct:g.returns.length?round(g.returns.reduce((a,b)=>a+b,0)/g.returns.length,2):null
  })).sort((a,b)=>b.scanDate.localeCompare(a.scanDate));
  return {
    configured:true,windowDays:safeDays,fromDate,toDate:taiwanDate(),
    summary:{total:rows.length,matured:matured.length,pending:rows.length-matured.length,positive,negative,flat,
      positiveRate:matured.length?round(positive/matured.length*100,2):null,
      averageReturnPct:matured.length?round(matured.reduce((sum,r)=>sum+r.returnPct,0)/matured.length,2):null},
    byScanDate,rows,
    definition:"只計V7/V8正式盤後scan入選標的；選股日正式收盤價→D1歷史底庫最新收盤價。尚未經過下一交易日的計畫列為PENDING；不等同BUY→SELL真實交易勝率。"
  };
}

''' + anchor
replace_once(anchor,helpers,"V7 formal selection performance helpers")

replace_once(
'''  <div id="cards" class="grid"></div>''',
'''  <div id="cards" class="grid"></div>
  <div class="panel"><h2>V7 正式盤後選股績效</h2>
  <p class="muted">只包含 V7/V8 系統正式盤後 scan 的入選標的，不包含人工策略、動能 App、候選名單。這裡是「選股日收盤 → 最新收盤」績效；真實交易勝率仍以 BUY → SELL/STOP_LOSS 為準。</p>
  <div id="v7cards" class="grid"></div>
  <div class="scroll"><table><thead><tr><th>選股日</th><th>計畫日</th><th>股票</th><th>策略/等級</th><th>選股日收盤</th><th>最新收盤</th><th>最新日</th><th>績效</th><th>狀態</th></tr></thead><tbody id="v7formal"></tbody></table></div></div>''',
    "V7 formal performance panel"
)

old_load='''const days=document.getElementById("days").value,d=await api("/api/journal?days="+encodeURIComponent(days)),p=d.performance||{},e=d.externalValidation||{};'''
new_load='''const days=document.getElementById("days").value,[d,v7]=await Promise.all([api("/api/journal?days="+encodeURIComponent(days)),api("/api/v7-formal-performance?days="+encodeURIComponent(days))]),p=d.performance||{},e=d.externalValidation||{};'''
replace_once(old_load,new_load,"load formal selection performance")

replace_once(
'''document.getElementById("cards").innerHTML=cards.map(x=>'<div class="card"><div class="muted">'+esc(x[0])+'</div><div class="big">'+esc(x[1])+'</div></div>').join("");document.getElementById("strategy").innerHTML''',
'''document.getElementById("cards").innerHTML=cards.map(x=>'<div class="card"><div class="muted">'+esc(x[0])+'</div><div class="big">'+esc(x[1])+'</div></div>').join("");const vs=v7.summary||{};const vc=[["正式入選",vs.total||0],["已可評估",vs.matured||0],["待觀察",vs.pending||0],["正報酬比",vs.positiveRate==null?"-":vs.positiveRate+"%"],["平均績效",vs.averageReturnPct==null?"-":vs.averageReturnPct+"%"]];document.getElementById("v7cards").innerHTML=vc.map(x=>'<div class="card"><div class="muted">'+esc(x[0])+'</div><div class="big">'+esc(x[1])+'</div></div>').join("");document.getElementById("v7formal").innerHTML=(v7.rows||[]).map(x=>'<tr><td>'+esc(x.scanDate)+'</td><td>'+esc(x.planDate||"-")+'</td><td>'+esc(x.symbol+" "+(x.name||""))+'</td><td>'+esc((x.strategy||"-")+" / "+(x.signalLevel||"-"))+'</td><td>'+esc(x.formalClose==null?"-":x.formalClose)+'</td><td>'+esc(x.latestClose==null?"-":x.latestClose)+'</td><td>'+esc(x.latestDate||"-")+'</td><td>'+esc(x.returnPct==null?"-":x.returnPct+"%")+'</td><td>'+esc(x.status)+'</td></tr>').join("");document.getElementById("strategy").innerHTML''',
    "render V7 formal performance"
)

route_anchor='''    if (url.pathname === "/performance") return html(performanceCenterPage(),200,true);'''
routes=r'''    if (url.pathname === "/api/v7-formal-performance") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      return json(await readV7FormalSelectionPerformance(env,url.searchParams.get("days")||730),200,true);
    }

    if (url.pathname === "/api/v7-formal-backfill") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="POST") return json({error:"Method not allowed"},405,true);
      try {
        const body=await request.json();
        return json(await importV7FormalScanBackfill(body?.records,env),200,true);
      } catch(error) {
        return json({ok:false,error:String(error),noPlanChanges:true,noPush:true,noTrade:true},400,true);
      }
    }

''' + route_anchor
replace_once(route_anchor,routes,"formal performance routes")

path.write_text(text,encoding="utf-8")
print("Applied V8.6.2 V7 formal selection performance")
