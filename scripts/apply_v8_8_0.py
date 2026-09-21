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
    'const VERSION = "8.7.13-daily-mobile-alert";',
    'const VERSION = "8.8.0-shadow-execution-recorder";',
    "runtime version"
)

replace_once(
'''  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS v7_signal_delivery_state (
    state_key TEXT PRIMARY KEY,snapshot_json TEXT,lease_token TEXT,lease_until INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL
  )`).run();''',
'''  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS v7_signal_delivery_state (
    state_key TEXT PRIMARY KEY,snapshot_json TEXT,lease_token TEXT,lease_until INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL
  )`).run();
  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS trade_research_execution_snapshots (
    trade_date TEXT NOT NULL,
    symbol TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_key TEXT NOT NULL,
    observed_at TEXT NOT NULL,
    scheduled_time INTEGER NOT NULL,
    payload_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY(trade_date,symbol,event_type,event_key)
  )`).run();''',
    "research execution schema"
)

anchor='''async function readLiveSnapshot(env) {'''
recorder=r'''
function researchIsoFromQuoteTimestamp(value) {
  const raw=Number(value);
  if(!Number.isFinite(raw)) return null;
  const ms=raw>=1e14 ? raw/1000 : raw>=1e11 ? raw : null;
  if(!Number.isFinite(ms)) return null;
  try { return new Date(ms).toISOString(); } catch(_) { return null; }
}

function researchBarTiming(frame,tf) {
  const start=Date.parse(frame?.latest?.time);
  if(!Number.isFinite(start)) return {barStartAt:null,barEndAt:null};
  return {barStartAt:new Date(start).toISOString(),barEndAt:new Date(start+tf*60000).toISOString()};
}

function executionResearchEventTypes(scheduledTime,notifications=[]) {
  const {hour,minute}=taiwanClock(scheduledTime);
  const minutesSinceOpen=hour*60+minute-9*60;
  const events=[];
  if(minutesSinceOpen>=0 && minutesSinceOpen<=2) events.push("OPEN_BASELINE");
  if(minutesSinceOpen>=11 && minutesSinceOpen<=12) events.push("FIRST_10M_COMPLETE");
  if(minutesSinceOpen>=16 && minutesSinceOpen<=17) events.push("FIRST_15M_COMPLETE");
  if(minutesSinceOpen>=31 && minutesSinceOpen<=32) events.push("FIRST_30M_COMPLETE");
  if(Array.isArray(notifications) && notifications.length) events.push("FORMAL_SIGNAL_OBSERVED");
  return [...new Set(events)];
}

function buildExecutionResearchPayload(result,eventType,scheduledTime) {
  const observedAt=new Date().toISOString();
  const t10=researchBarTiming(result?.frame10,10),t15=researchBarTiming(result?.frame15,15);
  const lastTradeAt=researchIsoFromQuoteTimestamp(result?.quote?.lastUpdated);
  return {
    schemaVersion:"execution-shadow-v1",
    researchOnly:true,
    decisionImpact:false,
    eventType,
    tradeDate:taiwanDate(scheduledTime),
    symbol:String(result?.symbol||""),
    name:result?.name||"",
    scheduledTime,
    decisionAt:new Date(scheduledTime).toISOString(),
    observedAt,
    featureKnownAt:observedAt,
    lastTradeAt,
    currentPrice:Number.isFinite(Number(result?.currentPrice))?Number(result.currentPrice):null,
    quoteFresh:result?.executionData?.quoteFresh===true,
    auxiliary10Fresh:result?.executionData?.auxiliary10Fresh===true,
    formal15Fresh:result?.executionData?.formal15Fresh===true,
    frame10:{...t10,latest:result?.frame10?.latest||null},
    frame15:{...t15,latest:result?.frame15?.latest||null},
    openingGapPct:null,
    sessionVwap:null,
    spreadPct:null,
    depthImbalance:null,
    executionMarketState:"UNKNOWN",
    unknownReasons:[
      "OPENING_REFERENCE_NOT_CAPTURED",
      "SESSION_VWAP_NOT_CAPTURED",
      "BID_ASK_NOT_CAPTURED",
      "DEPTH_NOT_CAPTURED",
      "MARKET_MECHANISM_STATE_NOT_VERIFIED"
    ],
    formalDecisionLevel:result?.finalDecision?.level||null,
    formalDecisionText:result?.finalDecision?.text||null
  };
}

async function recordProspectiveExecutionShadow(env,results,scheduledTime,notifications=[]) {
  const events=executionResearchEventTypes(scheduledTime,notifications);
  if(!events.length || !env?.V7_DB || !Array.isArray(results) || !results.length) return {stored:0,events,skipped:true};
  try {
    await ensureD1Schema(env);
    const session=env.V7_DB.withSession("first-primary");
    let stored=0;
    for(const eventType of events) {
      for(const result of results) {
        if(!result?.ok || !result?.symbol) continue;
        const payload=buildExecutionResearchPayload(result,eventType,scheduledTime);
        const eventKey=eventType==="FORMAL_SIGNAL_OBSERVED"
          ? (notifications.filter(x=>String(x?.symbol||"")===String(result.symbol)).map(x=>String(x?.signalId||x?.signalType||"SIGNAL")).sort().join("|")||"SIGNAL")
          : eventType;
        const outcome=await session.prepare(`INSERT OR IGNORE INTO trade_research_execution_snapshots(
          trade_date,symbol,event_type,event_key,observed_at,scheduled_time,payload_json,created_at
        ) VALUES(?1,?2,?3,?4,?5,?6,?7,?5)`).bind(
          taiwanDate(scheduledTime),String(result.symbol),eventType,eventKey,payload.observedAt,Number(scheduledTime),JSON.stringify(payload)
        ).run();
        stored+=Number(outcome?.meta?.changes??outcome?.meta?.rows_written??0);
      }
    }
    return {stored,events,skipped:false};
  } catch(error) {
    console.warn("RESEARCH_EXECUTION_RECORDER_FAIL_OPEN",String(error));
    return {stored:0,events,error:String(error),failOpen:true};
  }
}

async function readExecutionResearchRecorder(env,days=30) {
  if(!env?.V7_DB) return {researchOnly:true,available:false,reason:"D1_UNAVAILABLE"};
  try {
    await ensureD1Schema(env);
    const safeDays=Math.max(1,Math.min(120,Number(days)||30));
    const fromDate=shiftDateString(taiwanDate(),-(safeDays-1));
    const result=await env.V7_DB.withSession("first-primary").prepare(
      "SELECT trade_date,symbol,event_type,event_key,observed_at,scheduled_time,payload_json FROM trade_research_execution_snapshots WHERE trade_date>=?1 ORDER BY trade_date DESC,observed_at DESC LIMIT 500"
    ).bind(fromDate).all();
    const rows=(result?.results||[]).map(row=>{
      let payload={};try{payload=JSON.parse(row.payload_json||"{}")}catch(_){}
      return {...row,payload};
    });
    const byEvent={};for(const row of rows) byEvent[row.event_type]=(byEvent[row.event_type]||0)+1;
    return {researchOnly:true,decisionImpact:false,available:true,windowDays:safeDays,rows:rows.length,byEvent,recent:rows.slice(0,80)};
  } catch(error) {
    return {researchOnly:true,available:false,reason:"RECORDER_READ_FAILED",error:String(error)};
  }
}

'''
replace_once(anchor,recorder+anchor,"execution recorder functions")

replace_once(
'''  const liveStore = await writeLiveSnapshot(env, snapshot);
  const kvSummary = { ...snapshot, liveStoreResult: liveStore };
  await env.STOCKS_KV.put(
    LAST_MONITOR_KEY,
    JSON.stringify(kvSummary),
    { expirationTtl: 2 * 24 * 60 * 60 }
  );

  return kvSummary;''',
'''  const liveStore = await writeLiveSnapshot(env, snapshot);
  const kvSummary = { ...snapshot, liveStoreResult: liveStore };
  await env.STOCKS_KV.put(
    LAST_MONITOR_KEY,
    JSON.stringify(kvSummary),
    { expirationTtl: 2 * 24 * 60 * 60 }
  );

  // Research-only prospective recorder. It runs after formal signal evaluation,
  // push processing and live-state persistence. Failure is fail-open and cannot
  // change candidate ranking, signals, capital, monitoring eligibility or push.
  const executionResearchRecorder = await recordProspectiveExecutionShadow(env,results,scheduledTime,notifications);
  return {...kvSummary,executionResearchRecorder};''',
    "monitor recorder hook"
)

replace_once(
'''    if(url.pathname==="/api/institution-status") {''',
'''    if(url.pathname==="/api/research/execution-recorder") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      const days=Number(url.searchParams.get("days")||30);
      return json(await readExecutionResearchRecorder(env,days),200,true);
    }

    if(url.pathname==="/api/institution-status") {''',
    "research recorder api"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.8.0 prospective Shadow Execution Recorder")
