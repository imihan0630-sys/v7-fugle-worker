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
    'const VERSION = "8.5.2-history-backfill";',
    'const VERSION = "8.6.0-performance-center";',
    "runtime version"
)

anchor='''async function readTradeJournal(env,days=60) {'''
helpers=r'''function journalPerformanceAggregate(rows,keyFn) {
  const groups=new Map();
  for(const row of (rows||[])) {
    const key=String(keyFn(row)||"未分類");
    if(!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(row);
  }
  return [...groups.entries()].map(([key,list])=>{
    const completed=list.filter(item=>item.status!=="OPEN" && Number.isFinite(Number(item.returnPct)));
    const wins=completed.filter(item=>item.status==="WIN").length;
    const losses=completed.filter(item=>item.status==="LOSS").length;
    const flats=completed.filter(item=>item.status==="FLAT").length;
    const winReturns=completed.filter(item=>Number(item.returnPct)>0).map(item=>Number(item.returnPct));
    const lossReturns=completed.filter(item=>Number(item.returnPct)<0).map(item=>Math.abs(Number(item.returnPct)));
    const avgReturn=completed.length ? round(completed.reduce((sum,item)=>sum+Number(item.returnPct),0)/completed.length,2) : null;
    const avgWin=winReturns.length ? round(winReturns.reduce((a,b)=>a+b,0)/winReturns.length,2) : null;
    const avgLoss=lossReturns.length ? round(lossReturns.reduce((a,b)=>a+b,0)/lossReturns.length,2) : null;
    const payoffRatio=avgWin!==null && avgLoss>0 ? round(avgWin/avgLoss,2) : null;
    return {key,total:list.length,completed:completed.length,open:list.length-completed.length,wins,losses,flats,
      winRate:completed.length?round(wins/completed.length*100,2):null,averageReturnPct:avgReturn,
      averageWinPct:avgWin,averageLossPct:avgLoss,payoffRatio};
  }).sort((a,b)=>(b.completed-a.completed)||(b.total-a.total)||a.key.localeCompare(b.key));
}

function journalPerformanceStats(plans,signals) {
  const base=journalTradeStats(plans,signals);
  const planMap=new Map((plans||[]).map(plan=>[String(plan.scan_date)+"|"+String(plan.symbol),plan]));
  const enriched=(base.trades||[]).map(trade=>{
    const plan=planMap.get(trade.key)||{};
    const entryMs=Date.parse(trade.entryTime||""),exitMs=Date.parse(trade.exitTime||"");
    const holdingDays=Number.isFinite(entryMs)&&Number.isFinite(exitMs)?round((exitMs-entryMs)/86400000,2):null;
    const close=journalNumber(plan.formal_close);
    return {...trade,strategy:plan.strategy||"未分類",signalLevel:plan.signal_level||"未分級",formalClose:close,
      priceClass:close!==null&&close>=1000?"千元股":"非千元股",rewardRisk:journalNumber(plan.reward_risk),
      scanDate:plan.scan_date||String(trade.key||"").split("|")[0]||null,
      month:(plan.scan_date||String(trade.key||"").split("|")[0]||"").slice(0,7)||"未知",holdingDays};
  });
  const completed=enriched.filter(item=>item.status!=="OPEN");
  const holding=completed.filter(item=>item.holdingDays!==null);
  const stopLossCount=completed.filter(item=>item.exitType==="STOP_LOSS").length;
  return {...base,trades:enriched,
    averageHoldingDays:holding.length?round(holding.reduce((sum,item)=>sum+item.holdingDays,0)/holding.length,2):null,
    stopLossCount,stopLossRate:completed.length?round(stopLossCount/completed.length*100,2):null,
    sellCount:completed.filter(item=>item.exitType==="SELL").length,
    byStrategy:journalPerformanceAggregate(enriched,item=>item.strategy),
    bySignalLevel:journalPerformanceAggregate(enriched,item=>item.signalLevel),
    byPriceClass:journalPerformanceAggregate(enriched,item=>item.priceClass),
    byMonth:journalPerformanceAggregate(enriched,item=>item.month)};
}

function recoveredJournalStats(rows) {
  const byStatus={},byStrategy={};
  for(const row of (rows||[])) {
    const status=String(row.record_status||"RECOVERED"),strategy=String(row.strategy||"未分類");
    byStatus[status]=(byStatus[status]||0)+1;byStrategy[strategy]=(byStrategy[strategy]||0)+1;
  }
  return {total:(rows||[]).length,
    byStatus:Object.entries(byStatus).map(([key,count])=>({key,count})).sort((a,b)=>b.count-a.count||a.key.localeCompare(b.key)),
    byStrategy:Object.entries(byStrategy).map(([key,count])=>({key,count})).sort((a,b)=>b.count-a.count||a.key.localeCompare(b.key))};
}

function journalCsvCell(value) {
  if(value===null||value===undefined) return "";
  const text=String(value);
  return /[",\r\n]/.test(text)?'"'+text.replaceAll('"','""')+'"':text;
}

function buildTradeJournalCsv(journal) {
  const columns=["record_type","date","plan_date","strategy","signal_level","symbol","name","reference_price","buy_low","buy_high",
    "breakout","max_chase","stop","reduce_at","profit_check","reward_risk","signal_type","occurred_at_taipei","market_price",
    "signal_shares","status","source","notes"];
  const rows=[columns];
  for(const p of (journal.planRows||[])) rows.push(["V8_FORMAL_PLAN",p.scan_date,p.plan_date,p.strategy,p.signal_level,p.symbol,p.name,p.formal_close,
    p.buy_low,p.buy_high,p.breakout,p.max_chase,p.stop,p.reduce_at,p.profit_check,p.reward_risk,"","","","","FORMAL_PLAN","V8-D1",p.selected_reason]);
  for(const s of (journal.signalRows||[])) rows.push(["V8_SIGNAL",s.trade_date,s.plan_date,"","",s.symbol,s.name,"","","","","","","","","",
    s.signal_type,s.occurred_at_taipei,s.market_price,s.signal_shares,s.position_stage,"V8-D1",s.reason]);
  for(const r of (journal.recoveredRows||[])) rows.push(["RECOVERED_HISTORY",r.selection_date,"",r.strategy,r.signal_level,r.symbol,r.name,r.reference_price,
    r.buy_low,r.buy_high,r.breakout,r.max_chase,r.stop,"",r.profit_check,r.reward_risk,"","","","",r.record_status,r.source,r.notes]);
  return "\ufeff"+rows.map(row=>row.map(journalCsvCell).join(",")).join("\r\n");
}

function performanceCenterPage() {
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>V8 績效分析中心</title><style>
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft JhengHei",sans-serif;background:#f4f6f8;margin:0;padding:18px;color:#222}
  .wrap{max-width:1350px;margin:auto}.panel,.card{background:#fff;border-radius:12px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,.07)}
  .panel{margin-bottom:14px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}.big{font-size:26px;font-weight:900}
  .muted{color:#666;font-size:13px}input,select,button,a.btn{padding:10px;border-radius:8px;border:1px solid #bbb}
  button,a.btn{background:#1f6feb;color:#fff;border:0;font-weight:800;cursor:pointer;text-decoration:none;display:inline-block}table{width:100%;border-collapse:collapse;background:#fff}
  th,td{padding:8px;border-bottom:1px solid #eee;text-align:left;font-size:13px}th{background:#eef2f6;position:sticky;top:0}.scroll{overflow:auto;max-height:520px}
  </style></head><body><div class="wrap"><h1>V8 績效分析中心</h1>
  <div class="panel"><a class="btn" href="/journal">回交易日誌</a> <label>ADMIN_TOKEN <input id="token" type="password" autocomplete="off"></label>
  <label>期間 <select id="days"><option>30</option><option>60</option><option>90</option><option>180</option><option>365</option><option selected value="730">730</option></select> 天</label>
  <button onclick="loadPerf()">載入績效</button> <button onclick="downloadCsv()">匯出 Excel 相容 CSV</button>
  <p id="status" class="muted"><b>尚未載入。</b> 主勝率只採正式 V8 BUY → SELL/STOP_LOSS 完成回合；歷史回填不混入主勝率。</p></div>
  <div id="cards" class="grid"></div>
  <div class="panel"><h2>A/B策略績效</h2><div class="scroll"><table><thead><tr><th>策略</th><th>回合</th><th>完成</th><th>勝/敗</th><th>勝率</th><th>平均報酬</th><th>盈虧比</th></tr></thead><tbody id="strategy"></tbody></table></div></div>
  <div class="panel"><h2>訊號等級績效</h2><div class="scroll"><table><thead><tr><th>等級</th><th>回合</th><th>完成</th><th>勝/敗</th><th>勝率</th><th>平均報酬</th><th>盈虧比</th></tr></thead><tbody id="level"></tbody></table></div></div>
  <div class="panel"><h2>千元股 / 非千元股</h2><div class="scroll"><table><thead><tr><th>分類</th><th>回合</th><th>完成</th><th>勝/敗</th><th>勝率</th><th>平均報酬</th><th>盈虧比</th></tr></thead><tbody id="price"></tbody></table></div></div>
  <div class="panel"><h2>每月績效</h2><div class="scroll"><table><thead><tr><th>月份</th><th>回合</th><th>完成</th><th>勝/敗</th><th>勝率</th><th>平均報酬</th></tr></thead><tbody id="month"></tbody></table></div></div>
  <div class="panel"><h2>外部 App 交叉驗證</h2><div id="external" class="muted">尚未載入</div></div>
  <div class="panel"><h2>歷史回填分布</h2><div id="recovered" class="muted">尚未載入</div></div>
  <script>
  const esc=x=>String(x??"").replace(/[&<>]/g,c=>c==="&"?"&amp;":c==="<"?"&lt;":"&gt;");
  document.getElementById("token").value=sessionStorage.getItem("v8AdminToken")||"";
  const row=x=>'<tr><td>'+esc(x.key)+'</td><td>'+esc(x.total)+'</td><td>'+esc(x.completed)+'</td><td>'+esc(x.wins+" / "+x.losses)+'</td><td>'+esc(x.winRate==null?"-":x.winRate+"%")+'</td><td>'+esc(x.averageReturnPct==null?"-":x.averageReturnPct+"%")+'</td><td>'+esc(x.payoffRatio==null?"-":x.payoffRatio)+'</td></tr>';
  async function api(path){const token=document.getElementById("token").value.trim();if(!token)throw new Error("請輸入 ADMIN_TOKEN");sessionStorage.setItem("v8AdminToken",token);const r=await fetch(path,{headers:{"x-admin-token":token}});const d=await r.json();if(!r.ok)throw new Error(d.error||("HTTP "+r.status));return d}
  async function loadPerf(){const st=document.getElementById("status");st.textContent="載入績效中…";try{const days=document.getElementById("days").value,d=await api("/api/journal?days="+encodeURIComponent(days)),p=d.performance||{},e=d.externalValidation||{};st.innerHTML="<b>已載入：</b>"+esc(d.recordedDays)+" 個V8交易日、"+esc(d.plans)+" 筆正式計畫、"+esc(d.recoveredSelections||0)+" 筆歷史回填。";const cards=[["主勝率",p.winRate==null?"-":p.winRate+"%"],["完成回合",p.completedTrades||0],["進行中",p.openTrades||0],["平均報酬",p.averageReturnPct==null?"-":p.averageReturnPct+"%"],["平均持有天數",p.averageHoldingDays==null?"-":p.averageHoldingDays],["停損率",p.stopLossRate==null?"-":p.stopLossRate+"%"],["BUY觸發率",p.buyTriggerRate==null?"-":p.buyTriggerRate+"%"],["停利檢查率",p.profitCheckRate==null?"-":p.profitCheckRate+"%"]];document.getElementById("cards").innerHTML=cards.map(x=>'<div class="card"><div class="muted">'+esc(x[0])+'</div><div class="big">'+esc(x[1])+'</div></div>').join("");document.getElementById("strategy").innerHTML=(p.byStrategy||[]).map(row).join("");document.getElementById("level").innerHTML=(p.bySignalLevel||[]).map(row).join("");document.getElementById("price").innerHTML=(p.byPriceClass||[]).map(row).join("");document.getElementById("month").innerHTML=(p.byMonth||[]).map(x=>'<tr><td>'+esc(x.key)+'</td><td>'+esc(x.total)+'</td><td>'+esc(x.completed)+'</td><td>'+esc(x.wins+" / "+x.losses)+'</td><td>'+esc(x.winRate==null?"-":x.winRate+"%")+'</td><td>'+esc(x.averageReturnPct==null?"-":x.averageReturnPct+"%")+'</td></tr>').join("");document.getElementById("external").innerHTML="累積 "+esc(e.days||0)+" 個交易日；加權重疊率 "+esc(e.summary?.weightedOverlapRatePct??0)+"%；總重疊 "+esc(e.summary?.totalOverlap??0)+" / 聯集 "+esc(e.summary?.totalUnion??0)+"。<br>只做交叉驗證，不改V8核心分數與配額。";const rs=d.recoveredStats||{};document.getElementById("recovered").innerHTML="共 "+esc(rs.total||0)+" 筆。狀態："+esc((rs.byStatus||[]).map(x=>x.key+" "+x.count).join("｜"))+"<br>主要策略："+esc((rs.byStrategy||[]).slice(0,12).map(x=>x.key+" "+x.count).join("｜"))}catch(err){st.innerHTML="<b>載入失敗：</b>"+esc(err.message)}}
  async function downloadCsv(){try{const token=document.getElementById("token").value.trim();if(!token)throw new Error("請輸入 ADMIN_TOKEN");sessionStorage.setItem("v8AdminToken",token);const days=document.getElementById("days").value,r=await fetch("/api/journal/export?days="+encodeURIComponent(days),{headers:{"x-admin-token":token}});if(!r.ok)throw new Error((await r.text()).slice(0,200));const blob=await r.blob(),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="V8_trade_journal_"+new Date().toISOString().slice(0,10)+".csv";a.click();URL.revokeObjectURL(url)}catch(err){document.getElementById("status").innerHTML="<b>匯出失敗：</b>"+esc(err.message)}}
  </script></div></body></html>`;
}

''' + anchor
replace_once(anchor,helpers,"performance helpers and page")

replace_once(
'''    stats:journalTradeStats(plans,signals),days:daysList,planRows:plans,signalRows:signals,recoveredRows:recovered
  };''',
'''    stats:journalTradeStats(plans,signals),
    performance:journalPerformanceStats(plans,signals),
    recoveredStats:recoveredJournalStats(recovered),
    externalValidation:await readExternalValidationStats(env,30),
    days:daysList,planRows:plans,signalRows:signals,recoveredRows:recovered
  };''',
    "journal performance payload"
)

route_anchor='''    if (url.pathname === "/api/journal/history-import") {'''
routes=r'''    if (url.pathname === "/performance") return html(performanceCenterPage(),200,true);

    if (url.pathname === "/api/journal/export") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      const journal=await readTradeJournal(env,url.searchParams.get("days")||730);
      const csv=buildTradeJournalCsv(journal);
      return new Response(csv,{status:200,headers:{
        "content-type":"text/csv; charset=utf-8",
        "content-disposition":'attachment; filename="V8_trade_journal.csv"',
        "cache-control":"no-store",
        "x-content-type-options":"nosniff"
      }});
    }

''' + route_anchor
replace_once(route_anchor,routes,"performance and CSV routes")

replace_once(
'''  <h1>V8 選股／訊號交易日誌</h1>''',
'''  <h1>V8 選股／訊號交易日誌</h1><p><a href="/performance" style="display:inline-block;padding:9px 13px;border-radius:8px;background:#1f6feb;color:#fff;text-decoration:none;font-weight:800">績效分析中心</a></p>''',
    "journal performance link"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.6.0 performance center")
