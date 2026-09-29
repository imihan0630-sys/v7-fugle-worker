from pathlib import Path

# V8.14.2 owner-approved Class-C correctness repair.
# Scope: System1 only.
# 1) add authoritative unscheduled whole-market closure receipts for history admission;
# 2) block staged historical recovery when preview/selected-stock dates are stale.
# Formal A/B formulas, scores, ranking, quotas, capital, signals and push semantics are unchanged.

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
    'const VERSION = "8.14.1-tdcc-share-reconciliation";',
    'const VERSION = "8.14.2-unscheduled-closure-recovery-guard";',
    "runtime version"
)

replace_once(
    'const HISTORY_GAP_RECEIPT_FETCH_LIMIT_PER_SEED = 8;',
    'const HISTORY_GAP_RECEIPT_FETCH_LIMIT_PER_SEED = 8;\n'
    'const UNSCHEDULED_MARKET_CLOSURE_SCHEMA = "UNSCHEDULED_MARKET_CLOSURE_RECEIPT_V1";\n'
    'const UNSCHEDULED_MARKET_CLOSURE_TTL_SECONDS = 730 * 24 * 60 * 60;',
    "closure constants"
)

helpers=r'''
function unscheduledMarketClosureKey(market,date) {
  return "V7_UNSCHEDULED_MARKET_CLOSURE:"+market+":"+date;
}

function closureEvidenceClass(rawUrl) {
  try {
    const url=new URL(String(rawUrl||""));
    if(url.protocol!=="https:") return null;
    const host=url.hostname.toLowerCase();
    if(host==="gov.tw" || host.endsWith(".gov.tw") || host==="gov.taipei" || host.endsWith(".gov.taipei")) return "GOVERNMENT";
    if(host==="twse.com.tw" || host.endsWith(".twse.com.tw")) return "TWSE";
    if(host==="tpex.org.tw" || host.endsWith(".tpex.org.tw")) return "TPEx";
    return null;
  } catch(_) {
    return null;
  }
}

function normalizeClosureMarketScope(value) {
  const scope=String(value||"").trim();
  if(scope==="BOTH" || scope==="TWSE" || scope==="TPEx") return scope;
  return null;
}

function validateUnscheduledMarketClosureReceipt(input) {
  const body=input&&typeof input==="object"?input:{};
  const marketDate=normalizeMarketDate(body.marketDate);
  const marketScope=normalizeClosureMarketScope(body.marketScope);
  const closureType=String(body.closureType||"").trim().toUpperCase();
  const authority=String(body.authority||"").trim();
  const decisionKnownAt=String(body.decisionKnownAt||"").trim();
  const urls=Array.from(new Set((Array.isArray(body.officialSourceUrls)?body.officialSourceUrls:[]).map(x=>String(x||"").trim()).filter(Boolean)));
  const allowedTypes=new Set(["TYPHOON","NATURAL_DISASTER","EARTHQUAKE","EMERGENCY","OTHER_OFFICIAL"]);
  if(!marketDate || !/^\d{4}-\d{2}-\d{2}$/.test(marketDate)) throw new Error("臨時休市證據日期無效");
  if(marketDate>taiwanDate() || marketDate<shiftDateString(taiwanDate(),-730)) throw new Error("臨時休市證據日期超出允許範圍");
  if(!marketScope) throw new Error("臨時休市證據 marketScope 必須為 TWSE、TPEx 或 BOTH");
  if(!allowedTypes.has(closureType)) throw new Error("臨時休市證據 closureType 無效");
  if(authority.length<3) throw new Error("臨時休市證據缺 authority");
  if(body.complete!==true) throw new Error("臨時休市證據必須 complete=true");
  const knownMs=Date.parse(decisionKnownAt);
  const openCutoffMs=Date.parse(marketDate+"T09:00:00+08:00");
  if(!Number.isFinite(knownMs) || knownMs>openCutoffMs) throw new Error("臨時休市證據 decisionKnownAt 晚於當日開盤時點或格式無效");
  if(urls.length<2) throw new Error("臨時休市證據至少需要兩個官方來源");
  const classes=urls.map(closureEvidenceClass);
  if(classes.some(x=>!x)) throw new Error("臨時休市證據含非官方或非HTTPS來源");
  if(!classes.includes("GOVERNMENT")) throw new Error("臨時休市證據缺政府停班/災害官方來源");
  if((marketScope==="TWSE" || marketScope==="BOTH") && !classes.includes("TWSE")) throw new Error("臨時休市證據缺TWSE官方規則/公告");
  if((marketScope==="TPEx" || marketScope==="BOTH") && !classes.includes("TPEx")) throw new Error("臨時休市證據缺TPEx官方規則/公告");
  return {
    schemaVersion:UNSCHEDULED_MARKET_CLOSURE_SCHEMA,
    marketDate,marketScope,closureType,authority,decisionKnownAt,
    officialSourceUrls:urls,
    provenanceNotes:String(body.provenanceNotes||"").slice(0,1000),
    complete:true
  };
}

async function closureEvidenceFingerprint(receipt) {
  const canonical=JSON.stringify({
    schemaVersion:receipt.schemaVersion,marketDate:receipt.marketDate,marketScope:receipt.marketScope,
    closureType:receipt.closureType,authority:receipt.authority,decisionKnownAt:receipt.decisionKnownAt,
    officialSourceUrls:[...(receipt.officialSourceUrls||[])].sort()
  });
  const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(canonical));
  return Array.from(new Uint8Array(bytes)).map(x=>x.toString(16).padStart(2,"0")).join("");
}

async function writeUnscheduledMarketClosureReceipt(env,input) {
  if(!env?.STOCKS_KV) throw new Error("找不到 STOCKS_KV Binding");
  const validated=validateUnscheduledMarketClosureReceipt(input);
  const receipt={
    ...validated,
    capturedAt:new Date().toISOString(),
    evidenceFingerprint:await closureEvidenceFingerprint(validated)
  };
  const markets=receipt.marketScope==="BOTH"?["TWSE","TPEx"]:[receipt.marketScope];
  for(const market of markets) {
    await env.STOCKS_KV.put(
      unscheduledMarketClosureKey(market,receipt.marketDate),
      JSON.stringify({...receipt,appliesToMarket:market}),
      {expirationTtl:UNSCHEDULED_MARKET_CLOSURE_TTL_SECONDS}
    );
  }
  return {...receipt,storedMarkets:markets};
}

async function readUnscheduledMarketClosureReceipt(env,market,date) {
  if(!env?.STOCKS_KV || !["TWSE","TPEx"].includes(String(market||""))) return null;
  const raw=await env.STOCKS_KV.get(unscheduledMarketClosureKey(market,date),"json");
  if(!raw || raw.schemaVersion!==UNSCHEDULED_MARKET_CLOSURE_SCHEMA || raw.appliesToMarket!==market || raw.marketDate!==date) return null;
  try {
    const checked=validateUnscheduledMarketClosureReceipt(raw);
    const expected=await closureEvidenceFingerprint(checked);
    if(raw.evidenceFingerprint!==expected) return null;
    return raw;
  } catch(_) {
    return null;
  }
}

function assertHistoricalRecoveryFreshness(stocks,date,preview=null) {
  if(preview?.skipped===true) throw new Error("HISTORICAL_RECOVERY_BLOCKED：preview 為 skipped，不得覆寫正式監控");
  for(const stock of stocks||[]) {
    if(String(stock?.closeDate||"")!==String(date)) {
      throw new Error("HISTORICAL_RECOVERY_STALE_CLOSE_DATE："+String(stock?.symbol||"UNKNOWN")+" closeDate="+String(stock?.closeDate||"NULL")+" target="+date);
    }
    const through=stock?.researchSnapshot?.provenance?.priceBarsThrough;
    if(String(through||"")!==String(date)) {
      throw new Error("HISTORICAL_RECOVERY_STALE_PRICE_BARS："+String(stock?.symbol||"UNKNOWN")+" priceBarsThrough="+String(through||"NULL")+" target="+date);
    }
  }
  return true;
}

'''
insert_before_once('function historyStructuralShape(history,marketDate,requiredBars=HISTORY_REVALIDATION_REQUIRED_PRIOR_BARS) {',helpers,"closure helpers")

replace_once(
'''  const memo=receiptMemo||new Map();
  const verifiedNoTradeDates=[];
  for(const gapDate of shape.gapDates) {
    const key=market+":"+gapDate;''',
'''  const memo=receiptMemo||new Map();
  const verifiedNoTradeDates=[];
  const verifiedMarketClosureDates=[];
  for(const gapDate of shape.gapDates) {
    const closure=await readUnscheduledMarketClosureReceipt(env,market,gapDate);
    if(closure) {
      verifiedMarketClosureDates.push(gapDate);
      continue;
    }
    const key=market+":"+gapDate;''',
    "closure-before-presence admission"
)

replace_once(
'''    if(!receipt) return {
      usable:false,status:"UNKNOWN",reason:"OFFICIAL_GAP_PROOF_UNAVAILABLE",
      marketDate,symbol,market,gapDate,verifiedNoTradeDates,shape
    };''',
'''    if(!receipt) return {
      usable:false,status:"UNKNOWN",reason:"OFFICIAL_GAP_PROOF_UNAVAILABLE",
      marketDate,symbol,market,gapDate,verifiedNoTradeDates,verifiedMarketClosureDates,shape
    };''',
    "gap unavailable diagnostics"
)

replace_once(
'''    if(traded.has(symbol)) return {
      usable:false,status:"DATA_INCOMPLETE",reason:"MISSING_OFFICIAL_TRADED_BAR",
      marketDate,symbol,market,gapDate,verifiedNoTradeDates,shape
    };''',
'''    if(traded.has(symbol)) return {
      usable:false,status:"DATA_INCOMPLETE",reason:"MISSING_OFFICIAL_TRADED_BAR",
      marketDate,symbol,market,gapDate,verifiedNoTradeDates,verifiedMarketClosureDates,shape
    };''',
    "missing traded bar diagnostics"
)

replace_once(
'''  return {
    usable:true,status:shape.gapDates.length?"VALID_WITH_VERIFIED_NO_TRADE_GAPS":"VALID_EXACT_SESSIONS",
    reason:null,marketDate,symbol,market,latestPriorDate:shape.latestPriorDate,
    gapDates:shape.gapDates,verifiedNoTradeDates,requiredBars:shape.requiredBars
  };''',
'''  return {
    usable:true,
    status:verifiedMarketClosureDates.length?"VALID_WITH_VERIFIED_MARKET_CLOSURES":(shape.gapDates.length?"VALID_WITH_VERIFIED_NO_TRADE_GAPS":"VALID_EXACT_SESSIONS"),
    marketClosureStatus:verifiedMarketClosureDates.length?"VERIFIED_MARKET_CLOSURE":null,
    reason:null,marketDate,symbol,market,latestPriorDate:shape.latestPriorDate,
    gapDates:shape.gapDates,verifiedNoTradeDates,verifiedMarketClosureDates,requiredBars:shape.requiredBars
  };''',
    "successful closure admission"
)

replace_once(
'''  const memo=new Map(),bySymbol={},summary={
    marketDate,requiredPriorBars:HISTORY_REVALIDATION_REQUIRED_PRIOR_BARS,
    usableSymbols:0,unusableSymbols:0,reasons:{},verifiedNoTradeGapSymbols:0,samples:[]
  };''',
'''  const memo=new Map(),bySymbol={},summary={
    marketDate,requiredPriorBars:HISTORY_REVALIDATION_REQUIRED_PRIOR_BARS,
    usableSymbols:0,unusableSymbols:0,reasons:{},verifiedNoTradeGapSymbols:0,verifiedMarketClosureSymbols:0,samples:[]
  };''',
    "history admission summary shape"
)

replace_once(
'''    if(result.usable) {
      summary.usableSymbols+=1;
      if((result.verifiedNoTradeDates||[]).length) summary.verifiedNoTradeGapSymbols+=1;
    } else {''',
'''    if(result.usable) {
      summary.usableSymbols+=1;
      if((result.verifiedNoTradeDates||[]).length) summary.verifiedNoTradeGapSymbols+=1;
      if((result.verifiedMarketClosureDates||[]).length) summary.verifiedMarketClosureSymbols+=1;
    } else {''',
    "closure summary counter"
)

route=r'''    // Owner-approved Class-C correctness repair: authoritative unscheduled whole-market closure receipt.
    // This route writes only history-admission evidence. It does not select stocks or change plans.
    if (url.pathname === "/api/history/closure-proof") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method==="POST") {
        try {
          const body=await request.json().catch(()=>({}));
          const receipt=await writeUnscheduledMarketClosureReceipt(env,body);
          const readback={};
          for(const market of receipt.storedMarkets) {
            readback[market]=await readUnscheduledMarketClosureReceipt(env,market,receipt.marketDate);
            if(!readback[market]) throw new Error("臨時休市證據寫入後讀回驗證失敗："+market);
          }
          return json({ok:true,verified:true,version:VERSION,receipt,readback,noPlanChanges:true,noTrade:true,noPush:true},200,true);
        } catch(err) {
          return json({ok:false,error:String(err),noPlanChanges:true,noTrade:true,noPush:true},400,true);
        }
      }
      if(request.method==="GET") {
        const date=normalizeMarketDate(url.searchParams.get("marketDate"));
        if(!date) return json({error:"marketDate 無效"},400,true);
        return json({
          ok:true,version:VERSION,marketDate:date,
          TWSE:await readUnscheduledMarketClosureReceipt(env,"TWSE",date),
          TPEx:await readUnscheduledMarketClosureReceipt(env,"TPEx",date),
          noPlanChanges:true,noTrade:true,noPush:true
        },200,true);
      }
      return json({error:"Method not allowed"},405,true);
    }

'''
insert_before_once('    // 手動執行盤後全市場掃描（部署驗收／補跑用）',route,"closure proof route")

replace_once(
'''        const formal=validateStocks(Array.isArray(preview?.stocks)?preview.stocks:[]);
        const hybrid=Array.isArray(preview?.hybridStocks)?preview.hybridStocks.slice(0,HYBRID_MAX_STOCKS):[];
        const watch=Array.isArray(preview?.hybridWatchStocks)?preview.hybridWatchStocks.slice(0,HYBRID_WATCH_MAX):[];

        const saved=await saveStockConfig(env,formal,"Staged historical recovery from verified dry-run",STRATEGY_POOL_CAPITAL);''',
'''        const formal=validateStocks(Array.isArray(preview?.stocks)?preview.stocks:[]);
        const hybrid=Array.isArray(preview?.hybridStocks)?preview.hybridStocks.slice(0,HYBRID_MAX_STOCKS):[];
        const watch=Array.isArray(preview?.hybridWatchStocks)?preview.hybridWatchStocks.slice(0,HYBRID_WATCH_MAX):[];
        assertHistoricalRecoveryFreshness(formal,date,preview);

        const saved=await saveStockConfig(env,formal,"Staged historical recovery from verified dry-run",STRATEGY_POOL_CAPITAL);''',
    "staged recovery freshness guard"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.14.2 unscheduled closure + recovery freshness guard")
