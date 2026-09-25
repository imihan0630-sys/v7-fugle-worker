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
    'const VERSION = "8.9.9-staged-delivery";',
    'const VERSION = "8.10.0-aideen-independent-pool";',
    "runtime version"
)

insert_after_once(
    'const MAX_STOCKS = 6;',
    '''
const AIDEEN_POOL_ID = "AIDEEN_APP";
const AIDEEN_MAX_STOCKS = 5;
const AIDEEN_KV_KEY = "V10_AIDEEN_APP_POOL";
const AIDEEN_CANDIDATE_RETENTION_DAYS = 730;
''',
    "Aideen constants"
)

# Keep 3+3+3 performance isolated; AIDEEN_APP has its own comparison surface.
replace_once(
'''FROM v9_strategy_pool_plans WHERE scan_date>=?1 ORDER BY scan_date ASC,pool_id ASC,symbol ASC''',
'''FROM v9_strategy_pool_plans WHERE scan_date>=?1 AND pool_id IN ('FORMAL_GENERAL','FORMAL_THOUSAND','HYBRID_THOUSAND_SHADOW') ORDER BY scan_date ASC,pool_id ASC,symbol ASC''',
    "three-pool performance isolation"
)

# Add portal entry without renaming the existing 3+3+3 surface.
replace_once(
'''    {key:"pools",href:"/pools",label:"3+3+3策略池"},''',
'''    {key:"pools",href:"/pools",label:"3+3+3策略池"},
    {key:"aideen",href:"/aideen",label:"愛德恩App池"},''',
    "Aideen portal navigation"
)

helpers=r'''
function aideenMonitorIdentity(value) {
  const symbol=String(value?.symbol || value?.plan?.symbol || value?.code || "").trim();
  const pool=String(value?.strategyPool || value?.plan?.strategyPool || "FORMAL").trim();
  return pool===AIDEEN_POOL_ID ? `${AIDEEN_POOL_ID}:${symbol}` : `${pool}:${symbol}`;
}

function aideenSignalStateKey(result) {
  const symbol=String(result?.symbol || "").trim();
  return SIGNAL_STATE_PREFIX + (result?.plan?.strategyPool===AIDEEN_POOL_ID ? `${AIDEEN_POOL_ID}:${symbol}` : symbol);
}

async function currentBaseCapital(env) {
  const formal=await loadStockConfig(env).catch(()=>null);
  return positiveNumber(formal?.totalCapital) || positiveNumber(env.V7_TOTAL_CAPITAL) || DEFAULT_TOTAL_CAPITAL;
}

function normalizeAideenStrategies(value) {
  const raw=Array.isArray(value)?value:String(value||"").split(/[、,，|/]/);
  const clean=[...new Set(raw.map(x=>String(x||"").trim()).filter(Boolean))];
  if(!clean.length) throw new Error("愛德恩App入選標的必須保留至少一個原始策略來源");
  if(clean.some(x=>x.length>80)) throw new Error("愛德恩App策略名稱過長");
  return clean.slice(0,20);
}

function normalizeAideenDecision(value) {
  const v=String(value||"").toUpperCase();
  if(!["SELECTED","NEAR_MISS","REJECTED"].includes(v)) throw new Error("愛德恩App候選決策必須為 SELECTED / NEAR_MISS / REJECTED");
  return v;
}

function normalizeAideenCandidate(item,index,marketDate) {
  const symbol=String(item?.symbol||item?.code||"").trim();
  if(!/^[1-9][0-9]{3}$/.test(symbol)) throw new Error(`愛德恩候選第${index+1}檔股票代號錯誤`);
  const name=String(item?.name||symbol).trim();
  const appStrategies=normalizeAideenStrategies(item?.appStrategies||item?.strategies||item?.strategy);
  const appSignalPrice=positiveNumber(item?.appSignalPrice ?? item?.signalPrice ?? item?.price);
  if(appSignalPrice===null) throw new Error(`${name}：缺愛德恩App訊號當下價格`);
  const decision=normalizeAideenDecision(item?.decision);
  const reason=String(item?.reason||item?.decisionReason||"").trim();
  if(!reason) throw new Error(`${name}：必須保留入選/淘汰理由，禁止事後補理由`);
  return {
    marketDate,symbol,name,appStrategies,appSignalPrice,
    appSignalTime:Number.isFinite(Date.parse(item?.appSignalTime))?new Date(item.appSignalTime).toISOString():null,
    appRank:toNumber(item?.appRank),
    appMomentum:toNumber(item?.appMomentum),
    decision,reason
  };
}

function normalizeAideenSelected(item,index,marketDate) {
  const symbol=String(item?.symbol||item?.code||"").trim();
  if(!/^[1-9][0-9]{3}$/.test(symbol)) throw new Error(`愛德恩入選第${index+1}檔股票代號錯誤`);
  const name=String(item?.name||symbol).trim();
  if(item?.appLogicPassed!==true) throw new Error(`${name}：尚未確認依愛德恩App原生邏輯通過，禁止寫入愛德恩池`);
  if(item?.secondaryReviewPassed!==true) throw new Error(`${name}：尚未完成二次風險/進場複核，禁止寫入愛德恩池`);
  const appStrategies=normalizeAideenStrategies(item?.appStrategies||item?.strategies||item?.strategy);
  const appSignalPrice=positiveNumber(item?.appSignalPrice ?? item?.signalPrice ?? item?.formalClose);
  if(appSignalPrice===null || appSignalPrice<10) throw new Error(`${name}：愛德恩App訊號價格無效或低於10元`);
  const mode=normalizeMode(item?.mode);
  const buyLow=toNumber(item?.buyLow),buyHigh=toNumber(item?.buyHigh),breakout=toNumber(item?.breakout),maxChase=toNumber(item?.maxChase);
  const stop=positiveNumber(item?.stop),profitCheck=positiveNumber(item?.profitCheck);
  if(mode!=="MOMENTUM" && (!(buyLow>0) || !(buyHigh>0) || buyLow>buyHigh)) throw new Error(`${name}：拉回型缺有效買區`);
  if(mode!=="PULLBACK" && (!(breakout>0) || !(maxChase>0) || maxChase<breakout)) throw new Error(`${name}：強勢型缺突破價/最大追價`);
  if(!(stop>0) || !(profitCheck>0)) throw new Error(`${name}：缺防守價或第一獲利檢查`);
  const aideenScore=toNumber(item?.aideenScore ?? item?.priorityScore);
  if(aideenScore===null || aideenScore<0 || aideenScore>100) throw new Error(`${name}：愛德恩二次篩選分數需介於0~100`);
  const selectedReason=String(item?.selectedReason||item?.reason||"").trim();
  if(!selectedReason) throw new Error(`${name}：缺愛德恩入選理由`);
  return {
    symbol,name,formalClose:appSignalPrice,closeDate:marketDate,planDate:nextTradingDate(marketDate),
    mode,buyLow,buyHigh,breakout,maxChase,stop,profitCheck,reduceAt:profitCheck,
    priorityScore:aideenScore,aideenScore,
    signalLevel:aideenScore>=80?"A":aideenScore>=65?"B":"C",
    sourceRank:index+1,channel:"AIDEEN",strategyPool:AIDEEN_POOL_ID,
    source:"AIDEEN_APP",selectionLogic:"AIDEEN_NATIVE_FIRST_THEN_SECONDARY_REVIEW",
    appLogicPassed:true,secondaryReviewPassed:true,appStrategies,appSignalPrice,
    appSignalTime:Number.isFinite(Date.parse(item?.appSignalTime))?new Date(item.appSignalTime).toISOString():null,
    selectedReason,positionStage:"NONE",pushEnabled:true,
    firstCondition:String(item?.firstCondition||"依愛德恩App原生邏輯先通過，再以完整15分K確認拉回止穩或突破承接").trim(),
    secondCondition:String(item?.secondCondition||"第一筆成立後再等第二次轉強，不因下跌直接加碼").trim()
  };
}

function allocateAideenPlans(selected,totalCapital) {
  if(!Number.isFinite(totalCapital)||totalCapital<=0) throw new Error("愛德恩App池基準資金必須大於0");
  const list=(Array.isArray(selected)?selected:[]).slice(0,AIDEEN_MAX_STOCKS);
  if(!list.length) return [];
  const deployRatio=list.length===1?0.35:list.length===2?0.60:0.85;
  const scoreTotal=list.reduce((s,x)=>s+Math.max(1,toNumber(x.aideenScore)||0),0)||1;
  return list.map((item,index)=>{
    const allocationRatio=Math.min(MAX_SINGLE_POSITION_RATIO,deployRatio*Math.max(1,toNumber(item.aideenScore)||0)/scoreTotal);
    const totalAllocation=Math.floor(totalCapital*allocationRatio/1000)*1000;
    const firstAmount=Math.round(totalAllocation*0.6),secondAmount=totalAllocation-firstAmount;
    const reference=positiveNumber(item.buyHigh)||positiveNumber(item.breakout)||positiveNumber(item.appSignalPrice);
    return {...item,sourceRank:index+1,allocationRatio:round(allocationRatio*100,1),totalAllocation,firstAmount,secondAmount,
      firstShares:sharesFor(firstAmount,reference),secondShares:sharesFor(secondAmount,reference),
      totalShares:sharesFor(firstAmount,reference)+sharesFor(secondAmount,reference)};
  });
}

async function ensureAideenSchema(env) {
  if(!env?.V7_DB) return false;
  await ensureD1Schema(env);
  const session=env.V7_DB.withSession("first-primary");
  await session.prepare(`CREATE TABLE IF NOT EXISTS v10_aideen_candidates(
    market_date TEXT NOT NULL,symbol TEXT NOT NULL,name TEXT,app_strategies_json TEXT NOT NULL,
    app_signal_price REAL,app_signal_time TEXT,app_rank REAL,app_momentum REAL,
    decision TEXT NOT NULL,reason TEXT NOT NULL,created_at TEXT NOT NULL,
    PRIMARY KEY(market_date,symbol)
  )`).run();
  return true;
}

async function recordAideenCandidates(env,marketDate,candidates) {
  if(!env?.V7_DB || isTestMode(env)) return {stored:false,count:0,reason:isTestMode(env)?"TEST_MODE":"D1 unavailable"};
  await ensureAideenSchema(env);
  const session=env.V7_DB.withSession("first-primary"),now=new Date().toISOString();
  await session.prepare("DELETE FROM v10_aideen_candidates WHERE market_date=?1").bind(marketDate).run();
  let stored=0;
  for(const row of candidates) {
    await session.prepare(`INSERT INTO v10_aideen_candidates
      (market_date,symbol,name,app_strategies_json,app_signal_price,app_signal_time,app_rank,app_momentum,decision,reason,created_at)
      VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11)`)
      .bind(marketDate,row.symbol,row.name,JSON.stringify(row.appStrategies),row.appSignalPrice,row.appSignalTime,row.appRank,row.appMomentum,row.decision,row.reason,now).run();
    stored+=1;
  }
  return {stored:true,count:stored};
}

async function loadAideenPool(env) {
  const capital=await currentBaseCapital(env);
  const raw=await env.STOCKS_KV?.get(AIDEEN_KV_KEY,"json");
  if(!raw || !Array.isArray(raw.stocks)) return {
    version:VERSION,poolId:AIDEEN_POOL_ID,label:"愛德恩App",maxStocks:AIDEEN_MAX_STOCKS,
    totalCapital:capital,selectedCount:0,remainingCash:capital,stocks:[],
    rule:"先依愛德恩App原生策略邏輯篩選，再做二次風險/進場複核；0~5檔、不硬湊；不進3+3+3"
  };
  const stocks=allocateAideenPlans(raw.stocks.map((x,index)=>({...x,aideenScore:toNumber(x.aideenScore??x.priorityScore)||0,sourceRank:index+1})),capital);
  return {...raw,version:VERSION,totalCapital:capital,selectedCount:stocks.length,
    remainingCash:capital-stocks.reduce((s,x)=>s+(toNumber(x.totalAllocation)||0),0),stocks,
    maxStocks:AIDEEN_MAX_STOCKS,poolId:AIDEEN_POOL_ID,label:"愛德恩App",
    rule:"先依愛德恩App原生策略邏輯篩選，再做二次風險/進場複核；0~5檔、不硬湊；不進3+3+3"};
}

async function saveAideenPool(env,body) {
  if(!env.STOCKS_KV) throw new Error("找不到 STOCKS_KV Binding");
  const marketDate=normalizeMarketDate(body?.marketDate);
  if(!marketDate || marketDate>taiwanDate() || marketDate<shiftDateString(taiwanDate(),-14)) throw new Error("愛德恩App名單日期無效、未來或過舊");
  await loadTradingCalendar(env,Number(marketDate.slice(0,4)));
  if(!isTradingDate(marketDate)) throw new Error("愛德恩App名單日期不是交易日");
  const inputCandidates=Array.isArray(body?.candidates)?body.candidates:[];
  if(inputCandidates.length>200) throw new Error("愛德恩App單日候選不可超過200檔");
  const candidates=inputCandidates.map((item,index)=>normalizeAideenCandidate(item,index,marketDate));
  const duplicateCandidates=new Set();
  for(const x of candidates) {if(duplicateCandidates.has(x.symbol)) throw new Error("愛德恩App候選不可重複："+x.symbol);duplicateCandidates.add(x.symbol);}
  const selectedInput=Array.isArray(body?.selected)?body.selected:[];
  if(selectedInput.length>AIDEEN_MAX_STOCKS) throw new Error(`愛德恩App池最多${AIDEEN_MAX_STOCKS}檔，不硬湊`);
  const selectedBase=selectedInput.map((item,index)=>normalizeAideenSelected(item,index,marketDate));
  const selectedSymbols=new Set(selectedBase.map(x=>x.symbol));
  if(selectedSymbols.size!==selectedBase.length) throw new Error("愛德恩App入選標的不可重複");
  for(const symbol of selectedSymbols) {
    const row=candidates.find(x=>x.symbol===symbol);
    if(!row || row.decision!=="SELECTED") throw new Error(`愛德恩App入選 ${symbol} 必須在原始候選中標記 SELECTED`);
  }
  const capital=await currentBaseCapital(env);
  const stocks=allocateAideenPlans(selectedBase,capital);
  const payload={
    version:VERSION,poolId:AIDEEN_POOL_ID,label:"愛德恩App",marketDate,planDate:nextTradingDate(marketDate),
    updatedAt:new Date().toISOString(),totalCapital:capital,maxStocks:AIDEEN_MAX_STOCKS,
    selectedCount:stocks.length,remainingCash:capital-stocks.reduce((s,x)=>s+(toNumber(x.totalAllocation)||0),0),
    stocks,source:"ChatGPT依愛德恩App原生邏輯二次篩選",
    rule:"AIDEEN_NATIVE_FIRST；不套Formal A/B資格門檻；最多5檔、不硬湊；與3+3+3隔離"
  };
  await env.STOCKS_KV.put(AIDEEN_KV_KEY,JSON.stringify(payload));
  const readback=await env.STOCKS_KV.get(AIDEEN_KV_KEY,"json");
  if(readback?.updatedAt!==payload.updatedAt || JSON.stringify(readback?.stocks)!==JSON.stringify(stocks)) throw new Error("愛德恩App池KV讀回不一致");
  const candidateArchive=await recordAideenCandidates(env,marketDate,candidates);
  const planArchive=await archiveStrategyPools(env,marketDate,{[AIDEEN_POOL_ID]:stocks});
  return {...payload,verified:true,candidateCount:candidates.length,candidateArchive,planArchive};
}

async function recalculateAideenCapital(env,totalCapital) {
  const raw=await env.STOCKS_KV?.get(AIDEEN_KV_KEY,"json");
  if(!raw || !Array.isArray(raw.stocks)) return {configured:false,totalCapital,selectedCount:0};
  const stocks=allocateAideenPlans(raw.stocks,totalCapital);
  const payload={...raw,version:VERSION,totalCapital,updatedAt:new Date().toISOString(),stocks,
    selectedCount:stocks.length,remainingCash:totalCapital-stocks.reduce((s,x)=>s+(toNumber(x.totalAllocation)||0),0)};
  await env.STOCKS_KV.put(AIDEEN_KV_KEY,JSON.stringify(payload));
  const readback=await env.STOCKS_KV.get(AIDEEN_KV_KEY,"json");
  if(readback?.updatedAt!==payload.updatedAt) throw new Error("愛德恩App資金重算讀回不一致");
  return {configured:true,totalCapital,selectedCount:stocks.length,remainingCash:payload.remainingCash,stocks};
}

async function readAideenSelectionPerformance(env,days=365) {
  if(!env?.V7_DB) return {configured:false,rows:[],candidateCounts:{},definition:"D1未設定"};
  await ensureAideenSchema(env);
  const safeDays=Math.max(1,Math.min(AIDEEN_CANDIDATE_RETENTION_DAYS,Number(days)||365));
  const fromDate=shiftDateString(taiwanDate(),-(safeDays-1));
  const session=env.V7_DB.withSession("first-primary");
  const selectedRes=await session.prepare(`SELECT scan_date,pool_id,symbol,name,reference_close,capital,plan_json
    FROM v9_strategy_pool_plans WHERE scan_date>=?1 AND pool_id=?2 ORDER BY scan_date ASC,symbol ASC`).bind(fromDate,AIDEEN_POOL_ID).all();
  const candidateRes=await session.prepare(`SELECT market_date,symbol,name,app_strategies_json,app_signal_price,decision,reason
    FROM v10_aideen_candidates WHERE market_date>=?1 ORDER BY market_date DESC,symbol ASC`).bind(fromDate).all();
  const selections=selectedRes?.results||[],candidates=candidateRes?.results||[];
  const symbols=[...new Set(selections.map(x=>String(x.symbol||"")).filter(Boolean))],histories={};
  for(let i=0;i<symbols.length;i+=50) {
    const chunk=symbols.slice(i,i+50);if(!chunk.length) continue;
    const placeholders=chunk.map((_,j)=>"?"+(j+1)).join(",");
    const h=await session.prepare("SELECT symbol,history_json FROM v7_history_cache WHERE symbol IN ("+placeholders+")").bind(...chunk).all();
    for(const row of (h?.results||[])) try{const parsed=JSON.parse(row.history_json||"[]");if(Array.isArray(parsed)) histories[String(row.symbol)]=parsed.slice().sort((a,b)=>String(a.date||"").localeCompare(String(b.date||"")));}catch(_){}
  }
  const horizon=(bars,baseline,n)=>{const bar=bars[n-1];return !bar||!(baseline>0)||!Number.isFinite(Number(bar.close))?null:round((Number(bar.close)-baseline)/baseline*100,2);};
  const rows=selections.map(sel=>{
    let plan={};try{plan=JSON.parse(sel.plan_json||"{}")}catch(_){}
    const baseline=positiveNumber(sel.reference_close)||positiveNumber(plan.appSignalPrice)||positiveNumber(plan.formalClose);
    const future=(histories[String(sel.symbol)]||[]).filter(bar=>String(bar.date||"").slice(0,10)>String(sel.scan_date));
    const latest=future.at(-1)||null,latestClose=positiveNumber(latest?.close);
    return {scanDate:String(sel.scan_date),symbol:String(sel.symbol),name:sel.name||plan.name||"",formalClose:baseline,
      d1:horizon(future,baseline,1),d3:horizon(future,baseline,3),d5:horizon(future,baseline,5),
      latestDate:latest?String(latest.date||"").slice(0,10):null,latestClose,
      currentReturnPct:baseline>0&&latestClose!==null?round((latestClose-baseline)/baseline*100,2):null,
      appStrategies:plan.appStrategies||[],aideenScore:toNumber(plan.aideenScore),mode:plan.mode,
      selectedReason:plan.selectedReason||"",totalAllocation:toNumber(plan.totalAllocation)};
  }).sort((a,b)=>b.scanDate.localeCompare(a.scanDate)||a.symbol.localeCompare(b.symbol));
  const mature5=rows.filter(x=>x.d5!==null),tracked=rows.filter(x=>x.currentReturnPct!==null);
  const candidateCounts={SELECTED:0,NEAR_MISS:0,REJECTED:0};
  for(const x of candidates) if(candidateCounts[x.decision]!==undefined) candidateCounts[x.decision]+=1;
  return {configured:true,windowDays:safeDays,fromDate,toDate:taiwanDate(),rows,candidateCounts,
    summary:{totalSelections:rows.length,matureD5:mature5.length,
      d5PositiveRate:mature5.length?round(mature5.filter(x=>x.d5>0).length/mature5.length*100,2):null,
      d5AverageReturnPct:mature5.length?round(mature5.reduce((s,x)=>s+x.d5,0)/mature5.length,2):null,
      trackedPositiveRate:tracked.length?round(tracked.filter(x=>x.currentReturnPct>0).length/tracked.length*100,2):null,
      trackedAverageReturnPct:tracked.length?round(tracked.reduce((s,x)=>s+x.currentReturnPct,0)/tracked.length,2):null},
    definition:"愛德恩App獨立選股追蹤：先按App原生邏輯篩選，再二次複核；以App訊號價格為選股基準觀察D1/D3/D5。與3+3+3分開，不代表實際BUY→SELL交易勝率。"};
}

function aideenPage() {
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>台股交易決策監控系統｜愛德恩App池</title><style>
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft JhengHei",sans-serif;background:#f4f6f8;margin:0;padding:18px;color:#222}
  .wrap{max-width:1400px;margin:auto}.panel,.card{background:#fff;border-radius:12px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,.07);margin-bottom:14px}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:12px}.card{margin:0;border-left:5px solid #0f766e}
  .muted{color:#666;font-size:13px}.big{font-size:22px;font-weight:900}.badge{display:inline-block;padding:3px 8px;border-radius:999px;background:#ecfeff;font-weight:800;font-size:12px;margin-right:5px}
  table{width:100%;border-collapse:collapse}th,td{padding:8px;border-bottom:1px solid #eee;font-size:13px;text-align:left}th{background:#eef2f6}.scroll{overflow:auto;max-height:520px}
  select{padding:8px;border:1px solid #bbb;border-radius:8px}</style></head><body><div class="wrap"><h1>愛德恩App獨立股池</h1>`+portalNav("aideen")+`
  <div class="panel"><b>固定規則：</b>先忠實依愛德恩App自己的策略邏輯篩選，再做二次風險與進場複核；最多5檔，可以0檔，不硬湊。資金跟隨系統基準資金，但與3+3+3完全隔離。</div>
  <div id="status" class="panel muted">載入中…</div><div id="cards" class="grid"></div>
  <div class="panel"><label>績效期間 <select id="days"><option value="90">90天</option><option value="180">180天</option><option value="365" selected>365天</option><option value="730">730天</option></select></label><div id="summary" class="muted" style="margin-top:8px"></div></div>
  <div class="panel"><h2>獨立選股追蹤</h2><div class="scroll"><table><thead><tr><th>日期</th><th>股票</th><th>App策略</th><th>D1</th><th>D3</th><th>D5</th><th>最新</th></tr></thead><tbody id="rows"></tbody></table></div></div>
  <script>
  const esc=x=>String(x??"").replace(/[&<>]/g,c=>c==="&"?"&amp;":c==="<"?"&lt;":"&gt;");const pct=x=>x==null?"-":Number(x).toFixed(2)+"%";const money=x=>x==null?"-":Number(x).toLocaleString("zh-TW");
  async function load(){const days=document.getElementById("days").value;const [p,r]=await Promise.all([fetch("/api/aideen-pool").then(x=>x.json()),fetch("/api/aideen-performance?days="+days).then(x=>x.json())]);
    document.getElementById("status").innerHTML="版本 "+esc(p.version||"-")+"｜名單日 "+esc(p.marketDate||"-")+"｜入選 "+esc(p.selectedCount||0)+"/5｜基準資金 "+money(p.totalCapital)+"｜現金 "+money(p.remainingCash)+"<br>"+esc(p.rule||"");
    document.getElementById("cards").innerHTML=(p.stocks||[]).map(s=>'<div class="card"><div class="big">'+esc(s.name)+" "+esc(s.symbol)+'</div><div><span class="badge">'+esc(s.mode)+'</span><span class="badge">分數 '+esc(s.aideenScore)+'</span></div><div class="muted">App策略：'+esc((s.appStrategies||[]).join("／"))+'</div><div class="muted">買區 '+esc(s.buyLow??"-")+'～'+esc(s.buyHigh??"-")+'｜突破 '+esc(s.breakout??"-")+'｜最大追價 '+esc(s.maxChase??"-")+'</div><div class="muted">防守 '+esc(s.stop)+'｜第一獲利檢查 '+esc(s.profitCheck)+'｜配置 '+money(s.totalAllocation)+'</div><div class="muted">'+esc(s.selectedReason||"")+'</div></div>').join("")||'<div class="panel muted">目前0檔，不硬湊。</div>';
    const q=r.candidateCounts||{},s=r.summary||{};document.getElementById("summary").textContent=(r.definition||"")+"｜候選 SELECTED "+(q.SELECTED||0)+"／NEAR_MISS "+(q.NEAR_MISS||0)+"／REJECTED "+(q.REJECTED||0)+"｜D5勝率 "+pct(s.d5PositiveRate)+"｜D5平均 "+pct(s.d5AverageReturnPct);
    document.getElementById("rows").innerHTML=(r.rows||[]).map(x=>'<tr><td>'+esc(x.scanDate)+'</td><td>'+esc(x.symbol+" "+x.name)+'</td><td>'+esc((x.appStrategies||[]).join("／"))+'</td><td>'+pct(x.d1)+'</td><td>'+pct(x.d3)+'</td><td>'+pct(x.d5)+'</td><td>'+pct(x.currentReturnPct)+'</td></tr>').join("");
  }document.getElementById("days").addEventListener("change",load);load().catch(e=>document.getElementById("status").textContent="載入失敗："+e.message);
  </script></div></body></html>`;
}

'''
insert_before_once("function strategyPoolsPage() {",helpers,"Aideen helpers and page")

routes=r'''    if (url.pathname === "/aideen") return html(aideenPage(),200,true);

    if (url.pathname === "/api/aideen-pool") {
      if(request.method==="GET") return json(await loadAideenPool(env),200,true);
      if(request.method!=="POST") return json({error:"Method not allowed"},405,true);
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      try{return json(await saveAideenPool(env,await request.json()),200,true);}
      catch(err){return json({error:String(err),poolId:AIDEEN_POOL_ID,formalCoreChanged:false},400,true);}
    }

    if (url.pathname === "/api/aideen-performance") {
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      return json(await readAideenSelectionPerformance(env,url.searchParams.get("days")||365),200,true);
    }

'''
insert_before_once('    if (url.pathname === "/api/config") {',routes,"Aideen routes")

replace_once(
'''        const saved = await saveStockConfig(env, recalculated.stocks, "Capital Recalculation", capital);
        return json({ ...saved, remainingCash: recalculated.remainingCash, monitorUrl: url.origin }, 200, true);''',
'''        const saved = await saveStockConfig(env, recalculated.stocks, "Capital Recalculation", capital);
        const aideen = await recalculateAideenCapital(env, capital);
        return json({ ...saved, remainingCash: recalculated.remainingCash, aideen, monitorUrl: url.origin }, 200, true);''',
    "base capital sync to Aideen"
)

replace_once(
'''  const loaded = await loadStockConfig(env);
  const previousSnapshot = await readLiveSnapshot(env);''',
'''  const loaded = await loadStockConfig(env);
  const aideen = await loadAideenPool(env);
  const monitoringStocks=[...(loaded.stocks||[]),...(aideen.stocks||[])];
  const previousSnapshot = await readLiveSnapshot(env);''',
    "Aideen monitoring load"
)

replace_once(
'''      .map(item => [String(item.symbol), item])
  );''',
'''      .map(item => [aideenMonitorIdentity(item), item])
  );''',
    "monitor snapshot identity"
)

replace_once(
'''    loaded.stocks.map(stock => analyzeStockSmart(
      stock, env, previousMap.get(String(stock.symbol)), need10, need15, forceFrames
    ))''',
'''    monitoringStocks.map(stock => analyzeStockSmart(
      stock, env, previousMap.get(aideenMonitorIdentity(stock)), need10, need15, forceFrames
    ))''',
    "monitor all independent pools"
)

replace_once(
'''  const quoteCalls = loaded.stocks.length + (hybridWatchMonitor.quoteCalls||0);
  const candleCalls = loaded.stocks.length * ((forceFrames || need10 ? 1 : 0) + (forceFrames || need15 ? 1 : 0)) + (hybridWatchMonitor.candleCalls||0);''',
'''  const quoteCalls = monitoringStocks.length + (hybridWatchMonitor.quoteCalls||0);
  const candleCalls = monitoringStocks.length * ((forceFrames || need10 ? 1 : 0) + (forceFrames || need15 ? 1 : 0)) + (hybridWatchMonitor.candleCalls||0);''',
    "monitor call accounting"
)

replace_once(
'''    monitoredCount: results.length,
    hybridWatchMonitoredCount: hybridWatchMonitor.activeCount||0,
    status: results.length || (hybridWatchMonitor.activeCount||0)
      ? `完成Formal ${results.length}檔＋Hybrid WATCH ${hybridWatchMonitor.activeCount||0}檔監控`
      : "今日正式與WATCH皆0檔，維持現金",''',
'''    monitoredCount: results.length,
    formalMonitoredCount:(loaded.stocks||[]).length,
    aideenMonitoredCount:(aideen.stocks||[]).length,
    hybridWatchMonitoredCount: hybridWatchMonitor.activeCount||0,
    status: results.length || (hybridWatchMonitor.activeCount||0)
      ? `完成3+3+3正式監控 ${(loaded.stocks||[]).length}檔＋愛德恩App ${(aideen.stocks||[]).length}檔＋Hybrid WATCH ${hybridWatchMonitor.activeCount||0}檔`
      : "今日正式、愛德恩App與WATCH皆0檔，維持現金",''',
    "monitor pool counts"
)

# Signal-state keys stay backward compatible for Formal stocks; only AIDEEN_APP gets a namespace prefix.
replace_once(
'''  const key=SIGNAL_STATE_PREFIX+result.symbol;''',
'''  const key=aideenSignalStateKey(result);''',
    "Aideen signal lease isolation"
)
replace_once(
'''  const key = SIGNAL_STATE_PREFIX + result.symbol;''',
'''  const key = aideenSignalStateKey(result);''',
    "Aideen signal state isolation"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.10.0 Aideen independent pool")
