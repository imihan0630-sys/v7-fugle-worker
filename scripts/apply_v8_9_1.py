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
    'const VERSION = "8.9.0-three-pool-hybrid-shadow";',
    'const VERSION = "8.9.1-three-pool-dashboard";',
    "runtime version"
)

replace_once(
'''    {key:"performance",href:"/performance",label:"績效分析中心"},
    {key:"research",href:"/research",label:"研究驗證"}''',
'''    {key:"performance",href:"/performance",label:"績效分析中心"},
    {key:"pools",href:"/pools",label:"3+3+3策略池"},
    {key:"research",href:"/research",label:"研究驗證"}''',
    "strategy pool navigation"
)

anchor='''function buildStrategyPoolCapitalSummary(stocks) {'''
helpers=r'''async function readThreePoolSelectionPerformance(env,days=365) {
  if(!env?.V7_DB) return {configured:false,rows:[],byPool:{},definition:"D1未設定"};
  await ensureD1Schema(env);
  const safeDays=Math.max(1,Math.min(730,Number(days)||365));
  const fromDate=shiftDateString(taiwanDate(),-(safeDays-1));
  const session=env.V7_DB.withSession("first-primary");
  const res=await session.prepare(`SELECT scan_date,pool_id,symbol,name,reference_close,capital,plan_json
    FROM v9_strategy_pool_plans WHERE scan_date>=?1 ORDER BY scan_date ASC,pool_id ASC,symbol ASC`).bind(fromDate).all();
  const selections=res?.results||[];
  const symbols=[...new Set(selections.map(row=>String(row.symbol||"")).filter(Boolean))];
  const histories={};
  for(let i=0;i<symbols.length;i+=50) {
    const chunk=symbols.slice(i,i+50);
    if(!chunk.length) continue;
    const placeholders=chunk.map((_,idx)=>"?"+(idx+1)).join(",");
    const h=await session.prepare("SELECT symbol,history_json FROM v7_history_cache WHERE symbol IN ("+placeholders+")").bind(...chunk).all();
    for(const row of (h?.results||[])) {
      try {
        const parsed=JSON.parse(row.history_json||"[]");
        if(Array.isArray(parsed)) histories[String(row.symbol)]=parsed.slice().sort((a,b)=>String(a.date||"").localeCompare(String(b.date||"")));
      } catch(_){}
    }
  }
  const horizon=(bars,baseline,n)=>{
    const bar=bars[n-1];
    if(!bar||!(baseline>0)||!Number.isFinite(Number(bar.close))) return null;
    return round((Number(bar.close)-baseline)/baseline*100,2);
  };
  const rows=selections.map(sel=>{
    let plan={};try{plan=JSON.parse(sel.plan_json||"{}")}catch(_){}
    const baseline=journalNumber(sel.reference_close)??journalNumber(plan.formalClose);
    const history=(histories[String(sel.symbol)]||[]);
    const future=history.filter(bar=>String(bar.date||"").slice(0,10)>String(sel.scan_date));
    const latest=future.at(-1)||null;
    const latestClose=journalNumber(latest?.close);
    const currentReturnPct=baseline>0&&latestClose!==null?round((latestClose-baseline)/baseline*100,2):null;
    return {
      scanDate:String(sel.scan_date),poolId:String(sel.pool_id),symbol:String(sel.symbol),name:sel.name||plan.name||"",
      capital:journalNumber(sel.capital)||STRATEGY_POOL_CAPITAL,formalClose:baseline,
      allocation:journalNumber(plan.totalAllocation),allocationRatio:journalNumber(plan.allocationRatio),
      signalLevel:plan.signalLevel||null,buyLow:journalNumber(plan.buyLow),buyHigh:journalNumber(plan.buyHigh),
      stop:journalNumber(plan.stop),profitCheck:journalNumber(plan.profitCheck),shadowOnly:plan.shadowOnly===true,
      d1:horizon(future,baseline,1),d3:horizon(future,baseline,3),d5:horizon(future,baseline,5),
      latestDate:latest?String(latest.date||"").slice(0,10):null,latestClose,currentReturnPct,
      selectedReason:plan.selectedReason||null
    };
  }).sort((a,b)=>b.scanDate.localeCompare(a.scanDate)||a.poolId.localeCompare(b.poolId)||a.symbol.localeCompare(b.symbol));

  const poolIds=["FORMAL_GENERAL","FORMAL_THOUSAND",HYBRID_POOL_ID];
  const byPool={};
  for(const poolId of poolIds) {
    const list=rows.filter(row=>row.poolId===poolId);
    const mature5=list.filter(row=>row.d5!==null);
    const latestMature=list.filter(row=>row.currentReturnPct!==null);
    byPool[poolId]={
      poolId,capital:STRATEGY_POOL_CAPITAL,totalSelections:list.length,
      matureD5:mature5.length,
      d5PositiveRate:mature5.length?round(mature5.filter(row=>row.d5>0).length/mature5.length*100,2):null,
      d5AverageReturnPct:mature5.length?round(mature5.reduce((s,row)=>s+row.d5,0)/mature5.length,2):null,
      trackedPositiveRate:latestMature.length?round(latestMature.filter(row=>row.currentReturnPct>0).length/latestMature.length*100,2):null,
      trackedAverageReturnPct:latestMature.length?round(latestMature.reduce((s,row)=>s+row.currentReturnPct,0)/latestMature.length,2):null,
      shadowOnly:poolId===HYBRID_POOL_ID
    };
  }

  const overlapByDate={};
  for(const scanDate of [...new Set(rows.map(row=>row.scanDate))]) {
    const formal=new Set(rows.filter(row=>row.scanDate===scanDate&&row.poolId==="FORMAL_THOUSAND").map(row=>row.symbol));
    const hybrid=new Set(rows.filter(row=>row.scanDate===scanDate&&row.poolId===HYBRID_POOL_ID).map(row=>row.symbol));
    const overlap=[...formal].filter(symbol=>hybrid.has(symbol));
    overlapByDate[scanDate]={scanDate,overlapSymbols:overlap,overlapCount:overlap.length};
  }
  return {
    configured:true,windowDays:safeDays,fromDate,toDate:taiwanDate(),rows,byPool,
    overlapByDate:Object.values(overlapByDate).sort((a,b)=>b.scanDate.localeCompare(a.scanDate)),
    definition:"分池選股追蹤績效：以各策略池選股日收盤為基準，觀察D1/D3/D5與最新收盤；用來比較選股邏輯，不等同BUY→SELL實際交易勝率。Hybrid為Shadow。"
  };
}

function strategyPoolsPage() {
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>台股交易決策監控系統｜3+3+3策略池</title><style>
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft JhengHei",sans-serif;background:#f4f6f8;margin:0;padding:18px;color:#222}
  .wrap{max-width:1500px;margin:auto}.panel,.pool,.stock,.metric{background:#fff;border-radius:12px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,.07)}
  .panel{margin-bottom:14px}.pools{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:14px}.stocks{display:grid;gap:10px;margin-top:10px}
  .stock{border-left:5px solid #1f6feb;box-shadow:none;background:#f9fbfd}.shadow{border-left-color:#7c3aed}.muted{color:#666;font-size:13px}.big{font-size:23px;font-weight:900}
  .badge{display:inline-block;padding:3px 8px;border-radius:999px;background:#eef2ff;font-weight:800;font-size:12px;margin-right:5px}.warn{background:#fff3cd}
  .metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:10px}.metric{padding:8px;box-shadow:none;background:#f4f6f8;text-align:center}
  table{width:100%;border-collapse:collapse;background:#fff}th,td{padding:8px;border-bottom:1px solid #eee;font-size:13px;text-align:left}th{background:#eef2f6}.scroll{overflow:auto;max-height:500px}
  select{padding:9px;border:1px solid #bbb;border-radius:8px}</style></head><body><div class="wrap">
  <h1>台股交易決策監控系統｜3+3+3策略池</h1>`+portalNav("pools")+`
  <div class="panel"><b>固定規則：</b>每池最多3檔，沒有符合就是0；每池獨立20萬元，不跨池。千元Formal與Hybrid可以重複入選，但重複只是「跨邏輯一致性」資訊，不會自動升級或加碼。Hybrid目前為Shadow。</div>
  <div id="status" class="panel muted">載入中…</div><div id="pools" class="pools"></div>
  <div class="panel"><label>績效期間 <select id="days"><option value="90">90天</option><option value="180">180天</option><option value="365" selected>365天</option><option value="730">730天</option></select></label>
  <div id="perfSummary" class="muted" style="margin-top:8px"></div></div>
  <div class="panel"><h2>分池選股追蹤</h2><p class="muted">這裡比較選股邏輯，不把尚未發生的BUY模擬成真實成交。</p>
  <div class="scroll"><table><thead><tr><th>日期</th><th>池別</th><th>股票</th><th>D1</th><th>D3</th><th>D5</th><th>最新</th><th>狀態</th></tr></thead><tbody id="rows"></tbody></table></div></div>
  <script>
  const esc=x=>String(x??"").replace(/[&<>]/g,c=>c==="&"?"&amp;":c==="<"?"&lt;":"&gt;");
  const pct=x=>x==null?"-":Number(x).toFixed(2)+"%";const money=x=>x==null?"-":Number(x).toLocaleString("zh-TW");
  const labels={FORMAL_GENERAL:"非千元 Formal",FORMAL_THOUSAND:"千元 Formal",HYBRID_THOUSAND_SHADOW:"千元 Hybrid"};
  async function load(){
    const days=document.getElementById("days").value;
    const [p,r]=await Promise.all([fetch("/api/strategy-pools").then(x=>x.json()),fetch("/api/strategy-pool-performance?days="+days).then(x=>x.json())]);
    document.getElementById("status").innerHTML="版本 "+esc(p.version||"-")+"｜選股日 "+esc(p.scanDate||"-")+"｜架構 "+esc(p.architecture||"3+3+3")+"<br>"+esc(p.rule||"");
    const overlap=new Set(p.overlap?.overlapSymbols||[]);
    document.getElementById("pools").innerHTML=(p.pools||[]).map(pool=>{
      const perf=r.byPool?.[pool.id]||{};
      const cards=(pool.stocks||[]).map(s=>'<div class="stock '+(pool.shadowOnly?"shadow":"")+'"><div class="big">'+esc(s.name||"")+" "+esc(s.symbol||s.code||"")+'</div><div><span class="badge">'+esc(s.signalLevel||s.channel||"-")+'</span>'+(overlap.has(String(s.symbol||s.code||""))?'<span class="badge warn">Formal＋Hybrid共同入選</span>':"")+(pool.shadowOnly?'<span class="badge">SHADOW</span>':"")+'</div><div class="muted">買區 '+esc(s.buyLow??"-")+'～'+esc(s.buyHigh??"-")+'｜停損 '+esc(s.stop??"-")+'｜目標 '+esc(s.profitCheck??"-")+'</div><div class="muted">配置 '+money(s.totalAllocation)+'｜'+esc(s.selectedReason||"")+'</div></div>').join("");
      return '<section class="pool"><div class="big">'+esc(pool.label||labels[pool.id]||pool.id)+'</div><div class="muted">資金 '+money(pool.capital)+'｜入選 '+esc(pool.selectedCount||0)+'/3｜現金 '+money(pool.remainingCash)+'</div><div class="metrics"><div class="metric"><b>D5勝率</b><br>'+pct(perf.d5PositiveRate)+'</div><div class="metric"><b>D5平均</b><br>'+pct(perf.d5AverageReturnPct)+'</div><div class="metric"><b>累積樣本</b><br>'+esc(perf.totalSelections||0)+'</div></div><div class="stocks">'+(cards||'<div class="muted">本池目前0檔，不硬湊。</div>')+'</div></section>';
    }).join("");
    document.getElementById("perfSummary").textContent=r.definition||"";
    document.getElementById("rows").innerHTML=(r.rows||[]).map(x=>'<tr><td>'+esc(x.scanDate)+'</td><td>'+esc(labels[x.poolId]||x.poolId)+'</td><td>'+esc(x.symbol+" "+(x.name||""))+'</td><td>'+pct(x.d1)+'</td><td>'+pct(x.d3)+'</td><td>'+pct(x.d5)+'</td><td>'+pct(x.currentReturnPct)+'</td><td>'+(x.shadowOnly?"SHADOW":"FORMAL")+'</td></tr>').join("");
  }
  document.getElementById("days").addEventListener("change",load);load().catch(err=>document.getElementById("status").textContent="載入失敗："+err.message);
  </script></div></body></html>`;
}

''' + anchor
replace_once(anchor,helpers,"three-pool dashboard helpers")

route_marker='''    if (url.pathname === "/api/strategy-pools") {'''
routes=r'''    if (url.pathname === "/pools") return html(strategyPoolsPage(),200,true);

    if (url.pathname === "/api/strategy-pool-performance") {
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      return json(await readThreePoolSelectionPerformance(env,url.searchParams.get("days")||365),200,true);
    }

''' + route_marker
replace_once(route_marker,routes,"three-pool dashboard routes")

path.write_text(text,encoding="utf-8")
print("Applied V8.9.1 three-pool dashboard")
