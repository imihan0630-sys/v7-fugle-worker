"""System1 V8.20.1 cross-midnight recovery hardening.
Readback/recovery-only changes. Formal selection core remains unchanged.
"""
from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected one anchor, got {count}")
    text=text.replace(old,new,1)

Path("artifacts").mkdir(exist_ok=True)
Path("artifacts/Worker-before-v8_20_1.mjs").write_text(text,encoding="utf-8")

once(
  'const VERSION = "8.20.0-formal-c1-binding-ledger";',
  'const VERSION = "8.20.1-cross-midnight-recovery-readback";',
  "runtime version"
)



market_anchor='''    // 正常管理員授權的官方行情同步，不下單、不改標的或交易計畫。
    if (url.pathname === "/api/market-data") {'''
market_route='''    // 跨午夜 recovery 只讀既有官方行情快取；不允許補寫歷史行情。
    if (url.pathname === "/api/market-data/status") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      try {
        const today=taiwanDate();
        const requested=String(url.searchParams.get("marketDate")||"").trim();
        const marketDate=normalizeMarketDate(requested);
        if(!marketDate || marketDate>today || marketDate<shiftDateString(today,-14))
          return json({error:"行情狀態日期無效、未來或超過14天",noPlanChanges:true},400,true);
        await loadTradingCalendar(env,Number(marketDate.slice(0,4)));
        if(!isTradingDate(marketDate))
          return json({error:"行情狀態日期不是交易日",noPlanChanges:true},400,true);
        const markets={};
        for(const market of ["TWSE","TPEx"]) {
          const entry=await env.STOCKS_KV?.get(`V7_OFFICIAL_CLOSING:${market}:${marketDate}`,"json");
          markets[market]={
            ready:entry?.marketDate===marketDate&&entry?.market===market&&Array.isArray(entry?.rows)&&entry.rows.length>0,
            count:Array.isArray(entry?.rows)?entry.rows.length:0,
            collectedAt:entry?.collectedAt||null,
            sourceUrl:entry?.sourceUrl||null
          };
        }
        return json({marketDate,ready:markets.TWSE.ready===true&&markets.TPEx.ready===true,markets,
          readOnly:true,historicalBackfillPerformed:false,noPlanChanges:true,noPush:true},200,true);
      } catch(err) {
        return json({error:String(err),readOnly:true,noPlanChanges:true,noPush:true},400,true);
      }
    }

'''+market_anchor
once(market_anchor,market_route,"market status readback route")

path.write_text(text.replace("\r\n","\n"),encoding="utf-8",newline="\n")
print("Applied V8.20.1 cross-midnight recovery readback hardening; Formal Core unchanged")
