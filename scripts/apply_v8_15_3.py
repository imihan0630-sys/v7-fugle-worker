from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def one(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text=text.replace(old,new,1)

one('const VERSION = "8.15.2-c3-research-capture";',
    'const VERSION = "8.15.3-c3-quote-context";',"version")

one('''    "avgVolume20Lots","avgAmount20","spreadPercent","depthScore","chipConcentration",
    "quarterRevenue","revenueQoQ","revenueQuarterYoY","priceBookRatio","priceEarningsRatio",
    "sectorMedianPe","epsYoY","atrPercent"
  ]) out[key]=c1Number(f[key]);
  for(const key of ["orderBookDepthGood","financialBasis","valuationObserved","announcementsVerified"])''',
'''    "avgVolume20Lots","avgAmount20","spreadPercent","depthScore","chipConcentration",
    "quarterRevenue","revenueQoQ","revenueQuarterYoY","priceBookRatio","priceEarningsRatio",
    "sectorMedianPe","epsYoY","atrPercent","ret20","maDistance20Pct"
  ]) out[key]=c1Number(f[key]);
  for(const key of ["orderBookDepthGood","financialBasis","valuationObserved","announcementsVerified","lateStage"])''',
"C1 context projection")

one('''  let entry=null,stop=null,target=null,rewardPerRisk=null,setupQuality=null;
  if(channel&&Number.isFinite(atr)) {''',
'''  let entry=null,stop=null,target=null,rewardPerRisk=null,setupQuality=null;
  let supportAnchor=null,breakoutAnchor=null;
  if(channel&&Number.isFinite(atr)) {''',"geometry anchors")

one('''      const support=c1Number(setup?.metrics?.support);
      if(support!==null) {''',
'''      const support=c1Number(setup?.metrics?.support);
      supportAnchor=support;
      if(support!==null) {''',"A support")

one('''      const breakout=c1Number(f.priorHigh20);
      if(breakout!==null) {''',
'''      const breakout=c1Number(f.priorHigh20);
      breakoutAnchor=breakout;
      if(breakout!==null) {''',"B breakout")

one('''    entryGeometry:{entry:c1Number(entry),stop:c1Number(stop),target:c1Number(target)},
    derivationVersion:"FORMAL_V8_15_OBSERVED_INPUTS_NO_DECISION_IMPACT"''',
'''    entryGeometry:{entry:c1Number(entry),stop:c1Number(stop),target:c1Number(target),
      support:c1Number(supportAnchor),breakout:c1Number(breakoutAnchor)},
    derivationVersion:"FORMAL_V8_15_3_OBSERVED_INPUTS_NO_DECISION_IMPACT"''',"geometry receipt")

one('''  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_trade_research_c3_bars_date
    ON trade_research_c3_bars(target_trade_date,symbol,bar_start)`).run();
  D1_SCHEMA_READY = true;''',
'''  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_trade_research_c3_bars_date
    ON trade_research_c3_bars(target_trade_date,symbol,bar_start)`).run();
  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS trade_research_c3_quotes (
    generation_id TEXT NOT NULL,
    target_trade_date TEXT NOT NULL,
    symbol TEXT NOT NULL,
    bar_start TEXT NOT NULL,
    scheduled_time INTEGER NOT NULL,
    quote_json TEXT NOT NULL,
    source_fetched_at TEXT NOT NULL,
    source_family TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY(generation_id,symbol,bar_start)
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_trade_research_c3_quotes_date
    ON trade_research_c3_quotes(target_trade_date,symbol,bar_start)`).run();
  D1_SCHEMA_READY = true;''',"quote schema")

one('const C3_RESEARCH_CAPTURE_SCHEMA_VERSION="SYSTEM1_C3_RESEARCH_CAPTURE_RUNTIME_V0_1";',
    'const C3_RESEARCH_CAPTURE_SCHEMA_VERSION="SYSTEM1_C3_RESEARCH_CAPTURE_RUNTIME_V0_2";',"runtime schema")

one('''const C3_RESEARCH_OPERATOR_LIMITS=Object.freeze({
  providerLimitPerMinute:60,
  maxTotalCallsPerMinute:50,
  maxSymbols:6,
  maxCallsPerSlot:6,
  callsPerSession:102
});''',
'''const C3_RESEARCH_OPERATOR_LIMITS=Object.freeze({
  providerLimitPerMinute:60,
  maxTotalCallsPerMinute:50,
  maxSymbols:3,
  callsPerSymbolPerSlot:2,
  maxCallsPerSlot:6,
  callsPerSession:102
});''',"operator limits")

one('if(body?.schemaVersion!=="SYSTEM1_C3_RESEARCH_CAPTURE_CONTRACT_V0_1"||',
    'if(body?.schemaVersion!=="SYSTEM1_C3_RESEARCH_CAPTURE_CONTRACT_V0_2"||',"contract schema")

one('''  const requiredCalls=rows.length*C3_RESEARCH_CAPTURE_SLOTS.length;
  if(!Number.isInteger(declaredBudget)||declaredBudget<requiredCalls||declaredBudget>limits.callsPerSession||
     rows.length>limits.maxCallsPerSlot) throw new Error("C3_CAPTURE_PROVIDER_BUDGET_REJECTED");''',
'''  const requiredCalls=rows.length*C3_RESEARCH_CAPTURE_SLOTS.length*limits.callsPerSymbolPerSlot;
  if(!Number.isInteger(declaredBudget)||declaredBudget<requiredCalls||declaredBudget>limits.callsPerSession||
     rows.length*limits.callsPerSymbolPerSlot>limits.maxCallsPerSlot) throw new Error("C3_CAPTURE_PROVIDER_BUDGET_REJECTED");''',"cohort budget")

quote_helpers=r'''
function c3QuoteNumber(x) { const n=Number(x);return Number.isFinite(n)?n:null; }
function c3QuoteBool(x) { return typeof x==="boolean"?x:null; }
function c3QuoteSide(rows) {
  if(!Array.isArray(rows)) return null;
  return rows.slice(0,5).map(x=>({price:c3QuoteNumber(x?.price),size:c3QuoteNumber(x?.size)}));
}
function c3NormalizeQuote(raw,symbol) {
  const bids=c3QuoteSide(raw?.bids),asks=c3QuoteSide(raw?.asks);
  const bidDepth5=bids?bids.reduce((sum,x)=>sum+(x.size??0),0):null;
  const askDepth5=asks?asks.reduce((sum,x)=>sum+(x.size??0),0):null;
  const depthTotal=(bidDepth5??0)+(askDepth5??0);
  const bestBid=bids?.[0]?.price??null,bestAsk=asks?.[0]?.price??null;
  const marketState=raw?.tradingHalt?.isHalted===true?"HALTED":
    raw?.isTrial===true?"TRIAL":raw?.isContinuous===true?"CONTINUOUS":
    (raw?.isDelayedOpen===true||raw?.isDelayedClose===true||raw?.isLimitUpHalt===true||raw?.isLimitDownHalt===true)
      ?"NON_CONTINUOUS_FLAGGED":"UNKNOWN";
  const isLimitUpPrice=c3QuoteBool(raw?.isLimitUpPrice),isLimitDownPrice=c3QuoteBool(raw?.isLimitDownPrice);
  const unknownReasons=[];
  if(!(bestBid>0&&bestAsk>0&&bestAsk>=bestBid)) unknownReasons.push("BID_ASK_NOT_AVAILABLE");
  if(!(depthTotal>0)) unknownReasons.push("DEPTH_NOT_AVAILABLE");
  if(marketState==="UNKNOWN") unknownReasons.push("MARKET_MECHANISM_STATE_NOT_VERIFIED");
  if(isLimitUpPrice===null||isLimitDownPrice===null) unknownReasons.push("LIMIT_PRICE_STATE_NOT_VERIFIED");
  return {
    schemaVersion:"SYSTEM1_C3_QUOTE_CONTEXT_V0_1",symbol:String(raw?.symbol||symbol),date:String(raw?.date||""),
    closePrice:c3QuoteNumber(raw?.closePrice),previousClose:c3QuoteNumber(raw?.previousClose),
    lastUpdated:c3QuoteNumber(raw?.lastUpdated??raw?.closeTime),bids,asks,bestBid,bestAsk,
    spreadPct:bestBid>0&&bestAsk>0&&bestAsk>=bestBid?round((bestAsk-bestBid)/((bestAsk+bestBid)/2)*100,6):null,
    bidDepth5,askDepth5,depthImbalance:depthTotal>0?round((bidDepth5-askDepth5)/depthTotal,6):null,
    executionMarketState:marketState,isContinuous:c3QuoteBool(raw?.isContinuous),isTrial:c3QuoteBool(raw?.isTrial),
    isDelayedOpen:c3QuoteBool(raw?.isDelayedOpen),isDelayedClose:c3QuoteBool(raw?.isDelayedClose),
    isLimitUpHalt:c3QuoteBool(raw?.isLimitUpHalt),isLimitDownHalt:c3QuoteBool(raw?.isLimitDownHalt),
    isLimitUpPrice,isLimitDownPrice,tradingHaltIsHalted:c3QuoteBool(raw?.tradingHalt?.isHalted),
    unknownReasons,researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}
async function persistC3ResearchQuote(session,row,scheduledTime,barStart,rawQuote) {
  const payload=c3NormalizeQuote(rawQuote,row.symbol),encoded=JSON.stringify(payload);
  const existing=await session.prepare(`SELECT quote_json FROM trade_research_c3_quotes
    WHERE generation_id=?1 AND symbol=?2 AND bar_start=?3`).bind(row.generation_id,row.symbol,barStart).first();
  if(existing) {
    if(existing.quote_json!==encoded) throw new Error("C3_CAPTURE_IMMUTABLE_QUOTE_CONFLICT");
    return {stored:false,duplicate:true,symbol:row.symbol,barStart,quote:true};
  }
  const fetchedAt=new Date().toISOString();
  await session.prepare(`INSERT INTO trade_research_c3_quotes(
    generation_id,target_trade_date,symbol,bar_start,scheduled_time,quote_json,source_fetched_at,source_family,created_at
  ) VALUES(?1,?2,?3,?4,?5,?6,?7,'FUGLE_INTRADAY_QUOTE',?7)`).bind(
    row.generation_id,row.target_trade_date,row.symbol,barStart,Number(scheduledTime),encoded,fetchedAt
  ).run();
  return {stored:true,duplicate:false,symbol:row.symbol,barStart,quote:true};
}

'''
one('async function captureC3ResearchBarsSafe(env,scheduledTime,need15,baseFugleCallsThisMinute=0) {',
    quote_helpers+'async function captureC3ResearchBarsSafe(env,scheduledTime,need15,baseFugleCallsThisMinute=0) {',"quote helpers")

one('''    if(rows.length>limits.maxSymbols||rows.length>limits.maxCallsPerSlot||
       rows.length*C3_RESEARCH_CAPTURE_SLOTS.length>limits.callsPerSession)
      return {enabled:false,skipped:true,reason:"C3_CAPTURE_ACTIVE_COHORT_EXCEEDS_OPERATOR_LIMITS",extraCalls:0,researchOnly:true,decisionImpact:false,formalCoreImpact:false};
    const baseCalls=Number(baseFugleCallsThisMinute);
    if(!Number.isFinite(baseCalls)||baseCalls<0||baseCalls+rows.length>limits.maxTotalCallsPerMinute)
      return {enabled:false,skipped:true,reason:"C3_CAPTURE_MINUTE_BUDGET_BLOCKED",extraCalls:0,
        baseFugleCallsThisMinute:Number.isFinite(baseCalls)&&baseCalls>=0?baseCalls:null,
        projectedTotalCallsThisMinute:Number.isFinite(baseCalls)&&baseCalls>=0?baseCalls+rows.length:null,''',
'''    const extraCalls=rows.length*limits.callsPerSymbolPerSlot;
    if(rows.length>limits.maxSymbols||extraCalls>limits.maxCallsPerSlot||
       rows.length*C3_RESEARCH_CAPTURE_SLOTS.length*limits.callsPerSymbolPerSlot>limits.callsPerSession)
      return {enabled:false,skipped:true,reason:"C3_CAPTURE_ACTIVE_COHORT_EXCEEDS_OPERATOR_LIMITS",extraCalls:0,researchOnly:true,decisionImpact:false,formalCoreImpact:false};
    const baseCalls=Number(baseFugleCallsThisMinute);
    if(!Number.isFinite(baseCalls)||baseCalls<0||baseCalls+extraCalls>limits.maxTotalCallsPerMinute)
      return {enabled:false,skipped:true,reason:"C3_CAPTURE_MINUTE_BUDGET_BLOCKED",extraCalls:0,
        baseFugleCallsThisMinute:Number.isFinite(baseCalls)&&baseCalls>=0?baseCalls:null,
        projectedTotalCallsThisMinute:Number.isFinite(baseCalls)&&baseCalls>=0?baseCalls+extraCalls:null,''',"minute budget")

one('''    const settled=await Promise.allSettled(rows.map(async row=>{
      const raw=await fetchCandles(String(row.symbol),15,env);
      const frame=analyzeFrame(raw,15,scheduledTime);
      const latest=frame?.latest;
      if(!latest||c3BarSlot(latest.time)!==expectedSlot) throw new Error("C3_CAPTURE_EXPECTED_COMPLETED_BAR_MISSING");
      return persistC3ResearchBar(session,row,scheduledTime,latest);
    }));
    const details=settled.map((item,index)=>item.status==="fulfilled"?item.value:{
      stored:false,duplicate:false,symbol:String(rows[index]?.symbol||""),error:String(item.reason).slice(0,240)
    });
    return {
      enabled:true,skipped:false,targetDate,expectedSlot,cohortSize:rows.length,extraCalls:rows.length,
      baseFugleCallsThisMinute:baseCalls,projectedTotalCallsThisMinute:baseCalls+rows.length,
      maxTotalCallsPerMinute:limits.maxTotalCallsPerMinute,
      stored:details.filter(x=>x.stored).length,duplicates:details.filter(x=>x.duplicate).length,
      errors:details.filter(x=>x.error).length,details,''',
'''    const settled=await Promise.allSettled(rows.map(async row=>{
      const [raw,quote]=await Promise.all([fetchCandles(String(row.symbol),15,env),fetchQuote(String(row.symbol),env)]);
      const frame=analyzeFrame(raw,15,scheduledTime),latest=frame?.latest;
      if(!latest||c3BarSlot(latest.time)!==expectedSlot) throw new Error("C3_CAPTURE_EXPECTED_COMPLETED_BAR_MISSING");
      const barResult=await persistC3ResearchBar(session,row,scheduledTime,latest);
      const quoteResult=await persistC3ResearchQuote(session,row,scheduledTime,String(latest.time),quote);
      return {symbol:row.symbol,bar:barResult,quote:quoteResult};
    }));
    const details=settled.map((item,index)=>item.status==="fulfilled"?item.value:{
      symbol:String(rows[index]?.symbol||""),error:String(item.reason).slice(0,240)
    });
    return {
      enabled:true,skipped:false,targetDate,expectedSlot,cohortSize:rows.length,extraCalls,
      extraCandleCalls:rows.length,extraQuoteCalls:rows.length,
      baseFugleCallsThisMinute:baseCalls,projectedTotalCallsThisMinute:baseCalls+extraCalls,
      maxTotalCallsPerMinute:limits.maxTotalCallsPerMinute,
      storedBars:details.filter(x=>x.bar?.stored).length,storedQuotes:details.filter(x=>x.quote?.stored).length,
      duplicateBars:details.filter(x=>x.bar?.duplicate).length,duplicateQuotes:details.filter(x=>x.quote?.duplicate).length,
      errors:details.filter(x=>x.error).length,details,''',"candle quote capture")

one('async function readC3ResearchBars(env,generationId) {',
r'''async function readC3ResearchQuotes(env,generationId) {
  if(!env?.V7_DB) return {ok:false,error:"C3_CAPTURE_D1_REQUIRED",researchOnly:true};
  const gid=String(generationId||"").trim();
  if(!gid) throw new Error("C3_CAPTURE_GENERATION_REQUIRED");
  await ensureD1Schema(env);
  const result=await env.V7_DB.withSession("first-primary").prepare(`SELECT generation_id,target_trade_date,symbol,bar_start,
    scheduled_time,quote_json,source_fetched_at,source_family FROM trade_research_c3_quotes
    WHERE generation_id=?1 ORDER BY symbol,bar_start LIMIT 500`).bind(gid).all();
  return {ok:true,generationId:gid,rows:result?.results||[],researchOnly:true,decisionImpact:false,formalCoreImpact:false};
}
async function readC3ResearchBars(env,generationId) {''',"quote readback")

one('''    if (url.pathname === "/api/research/c3-capture-bars") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      try{return json(await readC3ResearchBars(env,url.searchParams.get("generationId")),200,true);}
      catch(error){return json({ok:false,error:String(error),researchOnly:true,decisionImpact:false,formalCoreImpact:false},400,true);}
    }

''',
'''    if (url.pathname === "/api/research/c3-capture-bars") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      try{return json(await readC3ResearchBars(env,url.searchParams.get("generationId")),200,true);}
      catch(error){return json({ok:false,error:String(error),researchOnly:true,decisionImpact:false,formalCoreImpact:false},400,true);}
    }
    if (url.pathname === "/api/research/c3-capture-quotes") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      try{return json(await readC3ResearchQuotes(env,url.searchParams.get("generationId")),200,true);}
      catch(error){return json({ok:false,error:String(error),researchOnly:true,decisionImpact:false,formalCoreImpact:false},400,true);}
    }

''',"quote route")

one('''    fugleCallsThisRun:{...baseCallSummary,c3ResearchCandles:c3ExtraCalls,total:Number(baseCallSummary.total||0)+c3ExtraCalls},''',
'''    fugleCallsThisRun:{...baseCallSummary,
      c3ResearchCandles:Number(c3ResearchCapture?.extraCandleCalls||0),
      c3ResearchQuotes:Number(c3ResearchCapture?.extraQuoteCalls||0),
      total:Number(baseCallSummary.total||0)+c3ExtraCalls},''',"call accounting")

path.write_text(text.replace("\r\n","\n"),encoding="utf-8",newline="\n")
print("Applied V8.15.3 C3 quote-context candidate; Formal behavior unchanged")
