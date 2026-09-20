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
    'const VERSION = "8.6.2-v7-formal-performance";',
    'const VERSION = "8.6.3-v7-current-close";',
    "runtime version"
)

replace_once(
'''  const rows=selections.map(sel=>{
    const history=(histories[String(sel.symbol)]||[]).slice().sort((a,b)=>String(a.date||"").localeCompare(String(b.date||"")));
    const latest=history.length?history[history.length-1]:null;
    const baselineBar=history.find(bar=>String(bar.date||"").slice(0,10)===String(sel.scan_date));
    const baseline=journalNumber(sel.formal_close) ?? journalNumber(baselineBar?.close);
    const latestClose=journalNumber(latest?.close),latestDate=latest?.date?String(latest.date).slice(0,10):null;''',
'''  const marketState=await env.STOCKS_KV?.get(MARKET_STATE_KEY,"json");
  const marketStateDate=marketState?.lastDate?String(marketState.lastDate).slice(0,10):null;
  const rows=selections.map(sel=>{
    const history=(histories[String(sel.symbol)]||[]).slice().sort((a,b)=>String(a.date||"").localeCompare(String(b.date||"")));
    const latest=history.length?history[history.length-1]:null;
    const baselineBar=history.find(bar=>String(bar.date||"").slice(0,10)===String(sel.scan_date));
    const baseline=journalNumber(sel.formal_close) ?? journalNumber(baselineBar?.close);
    const stateStock=marketState?.stocks?.[String(sel.symbol)]||null;
    const stateClose=journalNumber(stateStock?.close);
    const useState=Boolean(stateClose!==null&&marketStateDate);
    const latestClose=useState?stateClose:journalNumber(latest?.close);
    const latestDate=useState?marketStateDate:(latest?.date?String(latest.date).slice(0,10):null);''',
    "use current compact market state as latest close"
)

replace_once(
'''    definition:"只計V7/V8正式盤後scan入選標的；選股日正式收盤價→D1歷史底庫最新收盤價。尚未經過下一交易日的計畫列為PENDING；不等同BUY→SELL真實交易勝率。"''',
'''    definition:"只計V7/V8正式盤後scan入選標的；選股日正式收盤價→正式盤後市場狀態最新收盤價（D1歷史底庫為fallback）。尚未經過下一交易日的計畫列為PENDING；不等同BUY→SELL真實交易勝率。"''',
    "performance definition"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.6.3 current-close fallback")
