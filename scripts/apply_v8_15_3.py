from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected exactly 1 match, found {count}")
    text=text.replace(old,new,1)

replace_once(
    'const VERSION = "8.15.2-c3-research-capture";',
    'const VERSION = "8.15.3-c3-quote-context";',
    "version"
)

replace_once(
    'body?.schemaVersion!=="SYSTEM1_C3_RESEARCH_CAPTURE_CONTRACT_V0_1"',
    'body?.schemaVersion!=="SYSTEM1_C3_RESEARCH_CAPTURE_CONTRACT_V0_2"',
    "C3 registration schema V0.2"
)

replace_once(
'''    "close","historyDays","marketReturn20","sectorReturn20","marketCapYi","changePercent",
    "avgVolume20Lots","avgAmount20","spreadPercent","depthScore","chipConcentration",
    "quarterRevenue","revenueQoQ","revenueQuarterYoY","priceBookRatio","priceEarningsRatio",
    "sectorMedianPe","epsYoY","atrPercent"
  ]) out[key]=c1Number(f[key]);
  for(const key of ["orderBookDepthGood","financialBasis","valuationObserved","announcementsVerified"])
    out[key]=typeof f[key]==="boolean"?f[key]:null;''',
'''    "close","historyDays","marketReturn20","sectorReturn20","marketCapYi","changePercent",
    "avgVolume20Lots","avgAmount20","spreadPercent","depthScore","chipConcentration",
    "quarterRevenue","revenueQoQ","revenueQuarterYoY","priceBookRatio","priceEarningsRatio",
    "sectorMedianPe","epsYoY","atrPercent","ret20","maDistance20Pct"
  ]) out[key]=c1Number(f[key]);
  for(const key of ["orderBookDepthGood","financialBasis","valuationObserved","announcementsVerified","lateStage"])
    out[key]=typeof f[key]==="boolean"?f[key]:null;''',
    "C1 selection-time context projection"
)

replace_once(
'''    rewardPerRisk:c1Number(rewardPerRisk),setupQuality:c1Number(setupQuality),
    entryGeometry:{entry:c1Number(entry),stop:c1Number(stop),target:c1Number(target)},
    derivationVersion:"FORMAL_V8_15_OBSERVED_INPUTS_NO_DECISION_IMPACT"''',
'''    rewardPerRisk:c1Number(rewardPerRisk),setupQuality:c1Number(setupQuality),
    entryGeometry:{
      entry:c1Number(entry),stop:c1Number(stop),target:c1Number(target),
      support:channel==="A"?c1Number(setup?.metrics?.support):null,
      breakout:channel==="B"?c1Number(f.priorHigh20):null
    },
    derivationVersion:"FORMAL_V8_15_3_OBSERVED_INPUTS_NO_DECISION_IMPACT"''',
    "C1 support breakout geometry"
)

replace_once(
'''  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_trade_research_c3_bars_date
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
  D1_SCHEMA_READY = true;''',
    "C3 quote research schema"
)

replace_once(
'''  maxTotalCallsPerMinute:50,
  maxSymbols:6,
  maxCallsPerSlot:6,
  callsPerSession:102''',
'''  maxTotalCallsPerMinute:50,
  maxSymbols:3,
  maxCallsPerSlot:6,
  callsPerSession:102''',
    "C3 bounded quote cohort"
)

replace_once(
'''  const requiredCalls=rows.length*C3_RESEARCH_CAPTURE_SLOTS.length;
  if(!Number.isInteger(declaredBudget)||declaredBudget<requiredCalls||declaredBudget>limits.callsPerSession||
     rows.length>limits.maxCallsPerSlot) throw new Error("C3_CAPTURE_PROVIDER_BUDGET_REJECTED");''',
'''  const requiredCalls=rows.length*C3_RESEARCH_CAPTURE_SLOTS.length*2;
  if(!Number.isInteger(declaredBudget)||declaredBudget<requiredCalls||declaredBudget>limits.callsPerSession||
     rows.length*2>limits.maxCallsPerSlot) throw new Error("C3_CAPTURE_PROVIDER_BUDGET_REJECTED");''',
    "C3 two-call budget"
)

helpers=r'''
function c3ResearchQuotePayload(quote,symbol,targetDate,scheduledTime) {
  const q=quote||{};
  if(String(q?.symbol||"")!==String(symbol)||String(q?.date||"")!==String(targetDate))
    throw new Error("C3_CAPTURE_QUOTE_SYMBOL_OR_DATE_MISMATCH");
  const micros=Number(q?.lastUpdated ?? q?.closeTime),quoteMs=micros>=1e14?micros/1000:NaN;
  const nowMs=Number(scheduledTime);
  if(!Number.isFinite(quoteMs)||!Number.isFinite(nowMs)||quoteMs>nowMs+5000||nowMs-quoteMs>LIVE_STALE_SECONDS*1000||
     q?.isTrial===true||q?.tradingHalt?.isHalted===true) throw new Error("C3_CAPTURE_QUOTE_STALE_OR_INVALID");
  const bestBid=positiveNumber(q?.bids?.[0]?.price),bestAsk=positiveNumber(q?.asks?.[0]?.price);
  const bids=Array.isArray(q.bids)?q.bids.slice(0,5).map(x=>({price:positiveNumber(x?.price),size:positiveNumber(x?.size)})):null;
  const asks=Array.isArray(q.asks)?q.asks.slice(0,5).map(x=>({price:positiveNumber(x?.price),size:positiveNumber(x?.size)})):null;
  const bidDepth5=Array.isArray(bids)?bids.reduce((sum,x)=>sum+(x.size||0),0):null;
  const askDepth5=Array.isArray(asks)?asks.reduce((sum,x)=>sum+(x.size||0),0):null;
  const depthTotal=(bidDepth5??0)+(askDepth5??0);
  const marketState=q?.tradingHalt?.isHalted===true?"HALTED"
    : q?.isTrial===true?"TRIAL"
    : q?.isContinuous===true?"CONTINUOUS"
    : (q?.isDelayedOpen===true||q?.isDelayedClose===true||q?.isLimitUpHalt===true||q?.isLimitDownHalt===true)?"NON_CONTINUOUS_FLAGGED"
    : "UNKNOWN";
  return {
    symbol:String(symbol),date:String(targetDate),
    quoteTimestamp:Number.isFinite(quoteMs)?new Date(quoteMs).toISOString():null,
    quoteTimestampUnit:Number.isFinite(quoteMs)?"FUGLE_UNIX_MICROSECONDS_NORMALIZED":null,
    bestBid,bestAsk,
    spreadPct:bestBid&&bestAsk&&bestAsk>=bestBid?round((bestAsk-bestBid)/((bestAsk+bestBid)/2)*100,4):null,
    bids,asks,bidDepth5,askDepth5,
    depthImbalance:depthTotal>0?round((bidDepth5-askDepth5)/depthTotal,4):null,
    previousClose:positiveNumber(q.previousClose),openPrice:positiveNumber(q.openPrice),avgPrice:positiveNumber(q.avgPrice),
    tradingHalt:q?.tradingHalt??null,
    isTrial:q?.isTrial===true,
    isContinuous:typeof q?.isContinuous==="boolean"?q.isContinuous:null,
    isDelayedOpen:typeof q?.isDelayedOpen==="boolean"?q.isDelayedOpen:null,
    isDelayedClose:typeof q?.isDelayedClose==="boolean"?q.isDelayedClose:null,
    isLimitUpHalt:typeof q?.isLimitUpHalt==="boolean"?q.isLimitUpHalt:null,
    isLimitDownHalt:typeof q?.isLimitDownHalt==="boolean"?q.isLimitDownHalt:null,
    isLimitUpPrice:typeof q?.isLimitUpPrice==="boolean"?q.isLimitUpPrice:null,
    isLimitDownPrice:typeof q?.isLimitDownPrice==="boolean"?q.isLimitDownPrice:null,
    executionMarketState:marketState,
    marketStateProvenance:"FUGLE_INTRADAY_QUOTE_FLAGS",
    semanticLimit:"Raw research context only. isLimitUpPrice/isLimitDownPrice are preserved when explicitly supplied by Fugle; halt flags remain distinct; raw depth is not converted to depthScore.",
    fetchedAt:new Date(Number(scheduledTime)).toISOString()
  };
}

async function persistC3ResearchQuote(session,row,scheduledTime,barStart,quotePayload) {
  const encoded=JSON.stringify(quotePayload);
  const existing=await session.prepare(`SELECT quote_json FROM trade_research_c3_quotes
    WHERE generation_id=?1 AND symbol=?2 AND bar_start=?3`).bind(row.generation_id,row.symbol,barStart).first();
  if(existing) {
    if(existing.quote_json!==encoded) throw new Error("C3_CAPTURE_IMMUTABLE_QUOTE_CONFLICT");
    return {stored:false,duplicate:true,symbol:row.symbol,barStart};
  }
  const fetchedAt=new Date().toISOString();
  await session.prepare(`INSERT INTO trade_research_c3_quotes(
    generation_id,target_trade_date,symbol,bar_start,scheduled_time,quote_json,source_fetched_at,source_family,created_at
  ) VALUES(?1,?2,?3,?4,?5,?6,?7,'FUGLE_INTRADAY_QUOTE_RAW_CONTEXT',?7)`).bind(
    row.generation_id,row.target_trade_date,row.symbol,barStart,Number(scheduledTime),encoded,fetchedAt
  ).run();
  return {stored:true,duplicate:false,symbol:row.symbol,barStart};
}

'''
replace_once(
    'async function persistC3ResearchBar(session,row,scheduledTime,rawBar) {',
    helpers+'async function persistC3ResearchBar(session,row,scheduledTime,rawBar) {',
    "C3 quote helpers"
)

replace_once(
'''    if(rows.length>limits.maxSymbols||rows.length>limits.maxCallsPerSlot||
       rows.length*C3_RESEARCH_CAPTURE_SLOTS.length>limits.callsPerSession)
      return {enabled:false,skipped:true,reason:"C3_CAPTURE_ACTIVE_COHORT_EXCEEDS_OPERATOR_LIMITS",extraCalls:0,researchOnly:true,decisionImpact:false,formalCoreImpact:false};
    const baseCalls=Number(baseFugleCallsThisMinute);
    if(!Number.isFinite(baseCalls)||baseCalls<0||baseCalls+rows.length>limits.maxTotalCallsPerMinute)
      return {enabled:false,skipped:true,reason:"C3_CAPTURE_MINUTE_BUDGET_BLOCKED",extraCalls:0,
        baseFugleCallsThisMinute:Number.isFinite(baseCalls)&&baseCalls>=0?baseCalls:null,
        projectedTotalCallsThisMinute:Number.isFinite(baseCalls)&&baseCalls>=0?baseCalls+rows.length:null,
        maxTotalCallsPerMinute:limits.maxTotalCallsPerMinute,
        researchOnly:true,decisionImpact:false,formalCoreImpact:false};''',
'''    const projectedExtraCalls=rows.length*2;
    if(rows.length>limits.maxSymbols||projectedExtraCalls>limits.maxCallsPerSlot||
       rows.length*C3_RESEARCH_CAPTURE_SLOTS.length*2>limits.callsPerSession)
      return {enabled:false,skipped:true,reason:"C3_CAPTURE_ACTIVE_COHORT_EXCEEDS_OPERATOR_LIMITS",extraCalls:0,researchOnly:true,decisionImpact:false,formalCoreImpact:false};
    const baseCalls=Number(baseFugleCallsThisMinute);
    if(!Number.isFinite(baseCalls)||baseCalls<0||baseCalls+projectedExtraCalls>limits.maxTotalCallsPerMinute)
      return {enabled:false,skipped:true,reason:"C3_CAPTURE_MINUTE_BUDGET_BLOCKED",extraCalls:0,
        baseFugleCallsThisMinute:Number.isFinite(baseCalls)&&baseCalls>=0?baseCalls:null,
        projectedTotalCallsThisMinute:Number.isFinite(baseCalls)&&baseCalls>=0?baseCalls+projectedExtraCalls:null,
        maxTotalCallsPerMinute:limits.maxTotalCallsPerMinute,
        researchOnly:true,decisionImpact:false,formalCoreImpact:false};''',
    "C3 aggregate two-call guard"
)

replace_once(
'''    const settled=await Promise.allSettled(rows.map(async row=>{
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
      errors:details.filter(x=>x.error).length,details,
      researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
    };''',
'''    const settled=await Promise.allSettled(rows.map(async row=>{
      const [candleResult,quoteResult]=await Promise.allSettled([
        fetchCandles(String(row.symbol),15,env),
        fetchQuote(String(row.symbol),env)
      ]);
      const detail={symbol:String(row.symbol),barStored:false,barDuplicate:false,quoteStored:false,quoteDuplicate:false,errors:[]};
      let latest=null;
      if(candleResult.status==="fulfilled") {
        const frame=analyzeFrame(candleResult.value,15,scheduledTime);
        latest=frame?.latest;
        if(!latest||c3BarSlot(latest.time)!==expectedSlot) detail.errors.push("C3_CAPTURE_EXPECTED_COMPLETED_BAR_MISSING");
        else {
          const saved=await persistC3ResearchBar(session,row,scheduledTime,latest);
          detail.barStored=saved.stored===true;detail.barDuplicate=saved.duplicate===true;
        }
      } else detail.errors.push(String(candleResult.reason).slice(0,220));
      if(quoteResult.status==="fulfilled"&&latest) {
        try {
          const qp=c3ResearchQuotePayload(quoteResult.value,row.symbol,targetDate,scheduledTime);
          const saved=await persistC3ResearchQuote(session,row,scheduledTime,String(latest.time),qp);
          detail.quoteStored=saved.stored===true;detail.quoteDuplicate=saved.duplicate===true;
        } catch(error) { detail.errors.push(String(error).slice(0,220)); }
      } else if(quoteResult.status==="rejected") detail.errors.push(String(quoteResult.reason).slice(0,220));
      else if(!latest) detail.errors.push("C3_CAPTURE_QUOTE_BAR_LINK_UNAVAILABLE");
      return detail;
    }));
    const details=settled.map((item,index)=>item.status==="fulfilled"?item.value:{
      symbol:String(rows[index]?.symbol||""),barStored:false,barDuplicate:false,quoteStored:false,quoteDuplicate:false,
      errors:[String(item.reason).slice(0,240)]
    });
    return {
      enabled:true,skipped:false,targetDate,expectedSlot,cohortSize:rows.length,extraCalls:projectedExtraCalls,
      baseFugleCallsThisMinute:baseCalls,projectedTotalCallsThisMinute:baseCalls+projectedExtraCalls,
      maxTotalCallsPerMinute:limits.maxTotalCallsPerMinute,
      barsStored:details.filter(x=>x.barStored).length,barsDuplicate:details.filter(x=>x.barDuplicate).length,
      quotesStored:details.filter(x=>x.quoteStored).length,quotesDuplicate:details.filter(x=>x.quoteDuplicate).length,
      errors:details.reduce((sum,x)=>sum+x.errors.length,0),details,
      rawDepthOnly:true,depthScoreDerived:false,
      researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
    };''',
    "C3 candle quote capture"
)

quote_read=r'''
async function readC3ResearchQuotes(env,generationId) {
  if(!env?.V7_DB) return {ok:false,error:"C3_CAPTURE_D1_REQUIRED",researchOnly:true};
  const gid=String(generationId||"").trim();
  if(!gid) throw new Error("C3_CAPTURE_GENERATION_REQUIRED");
  await ensureD1Schema(env);
  const result=await env.V7_DB.withSession("first-primary").prepare(`SELECT generation_id,target_trade_date,symbol,bar_start,
    scheduled_time,quote_json,source_fetched_at,source_family
    FROM trade_research_c3_quotes WHERE generation_id=?1 ORDER BY symbol,bar_start LIMIT 500`).bind(gid).all();
  return {ok:true,generationId:gid,rows:result?.results||[],rawDepthOnly:true,depthScoreDerived:false,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false};
}

'''
replace_once(
    'async function readC3ResearchBars(env,generationId) {',
    quote_read+'async function readC3ResearchBars(env,generationId) {',
    "C3 quote read helper"
)

quote_route=r'''    if (url.pathname === "/api/research/c3-capture-quotes") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      try{return json(await readC3ResearchQuotes(env,url.searchParams.get("generationId")),200,true);}
      catch(error){return json({ok:false,error:String(error),researchOnly:true,decisionImpact:false,formalCoreImpact:false},400,true);}
    }

'''
replace_once(
    '    if (url.pathname === "/api/research/c3-capture-bars") {',
    quote_route+'    if (url.pathname === "/api/research/c3-capture-bars") {',
    "C3 quote read route"
)

replace_once(
'''    fugleCallsThisRun:{...baseCallSummary,c3ResearchCandles:c3ExtraCalls,total:Number(baseCallSummary.total||0)+c3ExtraCalls},''',
'''    fugleCallsThisRun:{
      ...baseCallSummary,
      c3ResearchCandles:Math.floor(c3ExtraCalls/2),
      c3ResearchQuotes:Math.floor(c3ExtraCalls/2),
      total:Number(baseCallSummary.total||0)+c3ExtraCalls
    },''',
    "C3 split call accounting"
)

path.write_text(text.replace("\r\n","\n"),encoding="utf-8",newline="\n")
print("Applied V8.15.3 C3 raw quote context; Formal selection/signals unchanged")
