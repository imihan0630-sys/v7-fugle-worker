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
    'const VERSION = "8.15.1-c1-capture-integrity";',
    'const VERSION = "8.15.2-c3-research-capture";',
    "version"
)

replace_once(
    '  D1_SCHEMA_READY = true;',
    r'''  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS trade_research_c3_cohorts (
    generation_id TEXT NOT NULL,
    source_session_date TEXT NOT NULL,
    target_trade_date TEXT NOT NULL,
    source_c1_content_digest TEXT NOT NULL,
    source_c1_universe_digest TEXT NOT NULL,
    source_c2_fingerprint TEXT NOT NULL,
    cohort_digest TEXT NOT NULL,
    symbol TEXT NOT NULL,
    pool TEXT NOT NULL,
    classification TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY(generation_id,symbol)
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_trade_research_c3_cohort_target
    ON trade_research_c3_cohorts(target_trade_date,generation_id)`).run();
  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS trade_research_c3_bars (
    generation_id TEXT NOT NULL,
    target_trade_date TEXT NOT NULL,
    symbol TEXT NOT NULL,
    bar_start TEXT NOT NULL,
    bar_end TEXT NOT NULL,
    scheduled_time INTEGER NOT NULL,
    bar_json TEXT NOT NULL,
    source_fetched_at TEXT NOT NULL,
    source_family TEXT NOT NULL,
    completed_bar INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    PRIMARY KEY(generation_id,symbol,bar_start)
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_trade_research_c3_bars_date
    ON trade_research_c3_bars(target_trade_date,symbol,bar_start)`).run();
  D1_SCHEMA_READY = true;''',
    "C3 research D1 schema"
)

helpers=r'''
const C3_RESEARCH_CAPTURE_SCHEMA_VERSION="SYSTEM1_C3_RESEARCH_CAPTURE_RUNTIME_V0_1";
const C3_RESEARCH_CAPTURE_SLOTS=[
  "09:00","09:15","09:30","09:45","10:00","10:15","10:30","10:45","11:00",
  "11:15","11:30","11:45","12:00","12:15","12:30","12:45","13:00"
];
const C3_RESEARCH_CLASSIFICATIONS=new Set(["FULL_SHORT_PASS","CONDITIONAL_SAFETY_UNKNOWN"]);

const C3_RESEARCH_OPERATOR_LIMITS=Object.freeze({
  providerLimitPerMinute:60,
  maxTotalCallsPerMinute:50,
  maxSymbols:6,
  maxCallsPerSlot:6,
  callsPerSession:102
});

function c3ResearchLimits(env) {
  const disabled=String(env?.C3_RESEARCH_CAPTURE_DISABLED||"").trim().toLowerCase()==="true";
  if(disabled) return {ready:false,...C3_RESEARCH_OPERATOR_LIMITS,reason:"C3_CAPTURE_OPERATOR_DISABLED"};
  return {ready:true,...C3_RESEARCH_OPERATOR_LIMITS,reason:null};
}

function c3ResearchDate(value) {
  const s=String(value||"").trim();
  if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||!Number.isFinite(Date.parse(s+"T00:00:00Z"))) return null;
  return s;
}

function c3ExpectedSlot(scheduledTime) {
  const {hour,minute}=taiwanClock(scheduledTime);
  const minutesSinceOpen=hour*60+minute-9*60;
  if(minutesSinceOpen<16||(minutesSinceOpen-1)%15!==0) return null;
  const startMinutes=minutesSinceOpen-16;
  const h=9+Math.floor(startMinutes/60),m=startMinutes%60;
  const slot=String(h).padStart(2,"0")+":"+String(m).padStart(2,"0");
  return C3_RESEARCH_CAPTURE_SLOTS.includes(slot)?slot:null;
}

function c3BarSlot(time) {
  const ms=Date.parse(time);
  if(!Number.isFinite(ms)) return null;
  const p=taiwanClock(ms);
  return String(p.hour).padStart(2,"0")+":"+String(p.minute).padStart(2,"0");
}

function c3NormalizeCohortRows(symbols) {
  if(!Array.isArray(symbols)||!symbols.length) throw new Error("C3_CAPTURE_SYMBOLS_REQUIRED");
  const seen=new Set();
  return symbols.map(item=>{
    const symbol=String(item?.symbol||"").trim();
    const pool=String(item?.pool||"UNKNOWN").trim()||"UNKNOWN";
    const classification=String(item?.classification||"").trim();
    if(!/^[0-9A-Za-z]{2,10}$/.test(symbol)||seen.has(symbol)) throw new Error("C3_CAPTURE_INVALID_OR_DUPLICATE_SYMBOL");
    if(!C3_RESEARCH_CLASSIFICATIONS.has(classification)) throw new Error("C3_CAPTURE_INVALID_CLASSIFICATION");
    seen.add(symbol);
    return {symbol,pool,classification};
  }).sort((a,b)=>a.symbol.localeCompare(b.symbol));
}

async function c3ReadC1Universe(session,generationId) {
  const result=await session.prepare(`SELECT rows_json FROM trade_research_c1_chunks
    WHERE generation_id=?1 ORDER BY chunk_index ASC`).bind(generationId).all();
  const symbols=new Set();
  for(const row of result?.results||[]) {
    let values;try{values=JSON.parse(row.rows_json||"[]");}catch(_){throw new Error("C3_CAPTURE_C1_CHUNK_INVALID");}
    if(!Array.isArray(values)) throw new Error("C3_CAPTURE_C1_CHUNK_INVALID");
    for(const item of values) if(item?.symbol) symbols.add(String(item.symbol));
  }
  return symbols;
}

async function saveC3ResearchCohort(env,body) {
  if(!env?.V7_DB) throw new Error("C3_CAPTURE_D1_REQUIRED");
  const limits=c3ResearchLimits(env);
  if(!limits.ready) throw new Error(limits.reason);
  if(body?.schemaVersion!=="SYSTEM1_C3_RESEARCH_CAPTURE_CONTRACT_V0_1"||
     body?.researchOnly!==true||body?.noFormalTargetMutation!==true||
     body?.noSignalPath!==true||body?.noPushPath!==true||body?.noOrderPath!==true||body?.noCapitalPath!==true)
    throw new Error("C3_CAPTURE_RESEARCH_CONTRACT_REQUIRED");

  const generationId=String(body?.generationId||"").trim();
  const sourceSessionDate=c3ResearchDate(body?.sessionDate);
  const requestedTargetTradeDate=body?.targetTradeDate==null||String(body.targetTradeDate).trim()===""
    ? null : c3ResearchDate(body.targetTradeDate);
  const sourceC1ContentDigest=String(body?.sourceC1ContentDigest||"").trim();
  const sourceC1UniverseDigest=String(body?.sourceC1UniverseDigest||"").trim();
  const sourceC2Fingerprint=String(body?.sourceC2Fingerprint||"").trim();
  const rows=c3NormalizeCohortRows(body?.symbols);
  const declaredMax=Number(body?.maxShadowSymbols);
  const declaredBudget=Number(body?.providerBudgetCallsPerSession);

  if(!generationId||!sourceSessionDate||
     !/^[0-9a-f]{64}$/i.test(sourceC1ContentDigest)||!/^[0-9a-f]{64}$/i.test(sourceC1UniverseDigest)||
     !/^[0-9a-f]{64}$/i.test(sourceC2Fingerprint)) throw new Error("C3_CAPTURE_SOURCE_PROVENANCE_INVALID");
  if(body?.targetTradeDate!=null&&String(body.targetTradeDate).trim()!==""&&!requestedTargetTradeDate)
    throw new Error("C3_CAPTURE_TARGET_DATE_INVALID");
  if(!Number.isInteger(declaredMax)||declaredMax<rows.length||declaredMax>limits.maxSymbols)
    throw new Error("C3_CAPTURE_MAX_SYMBOLS_EXCEEDS_OPERATOR_LIMIT");
  const requiredCalls=rows.length*C3_RESEARCH_CAPTURE_SLOTS.length;
  if(!Number.isInteger(declaredBudget)||declaredBudget<requiredCalls||declaredBudget>limits.callsPerSession||
     rows.length>limits.maxCallsPerSlot) throw new Error("C3_CAPTURE_PROVIDER_BUDGET_REJECTED");

  const sourceYear=Number(sourceSessionDate.slice(0,4));
  await loadTradingCalendar(env,sourceYear);
  if(sourceSessionDate.slice(5,7)==="12") await loadTradingCalendar(env,sourceYear+1);
  if(!isTradingDate(sourceSessionDate)) throw new Error("C3_CAPTURE_SOURCE_NOT_TRADING_SESSION");
  const targetTradeDate=nextTradingDate(sourceSessionDate);
  if(requestedTargetTradeDate&&requestedTargetTradeDate!==targetTradeDate)
    throw new Error("C3_CAPTURE_TARGET_NOT_NEXT_TRADING_SESSION");

  await ensureD1Schema(env);
  const session=env.V7_DB.withSession("first-primary");
  const generation=await session.prepare(`SELECT generation_id,scan_date,content_digest,universe_digest,population_n
    FROM trade_research_c1_generations WHERE generation_id=?1`).bind(generationId).first();
  if(!generation||generation.scan_date!==sourceSessionDate||
     generation.content_digest!==sourceC1ContentDigest||generation.universe_digest!==sourceC1UniverseDigest)
    throw new Error("C3_CAPTURE_C1_GENERATION_MISMATCH");

  const active=await session.prepare(`SELECT generation_id FROM trade_research_c3_cohorts
    WHERE target_trade_date=?1 LIMIT 1`).bind(targetTradeDate).first();
  if(active&&active.generation_id!==generationId) throw new Error("C3_CAPTURE_TARGET_ALREADY_BOUND_TO_ANOTHER_GENERATION");

  const universe=await c3ReadC1Universe(session,generationId);
  if(rows.some(row=>!universe.has(row.symbol))) throw new Error("C3_CAPTURE_SYMBOL_OUTSIDE_C1_UNIVERSE");

  const formal=await loadStockConfig(env);
  const formalSet=new Set((formal?.stocks||[]).map(x=>String(x.symbol)));
  if(rows.some(row=>formalSet.has(row.symbol))) throw new Error("C3_CAPTURE_FORMAL_SYMBOL_MUST_REUSE_EXISTING_PV");

  const cohortDigest=await sha256Hex(JSON.stringify({
    generationId,sourceSessionDate,targetTradeDate,sourceC1ContentDigest,sourceC1UniverseDigest,
    sourceC2Fingerprint,rows
  }));
  const existing=await session.prepare(`SELECT cohort_digest,COUNT(*) AS row_count FROM trade_research_c3_cohorts
    WHERE generation_id=?1 GROUP BY cohort_digest`).bind(generationId).first();
  if(existing) {
    if(existing.cohort_digest!==cohortDigest||Number(existing.row_count)!==rows.length)
      throw new Error("C3_CAPTURE_IMMUTABLE_COHORT_CONFLICT");
    return {ok:true,idempotent:true,generationId,targetTradeDate,cohortDigest,symbols:rows.length,
      requiredCalls,researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true};
  }

  const now=new Date().toISOString();
  await session.batch(rows.map(row=>session.prepare(`INSERT INTO trade_research_c3_cohorts(
    generation_id,source_session_date,target_trade_date,source_c1_content_digest,source_c1_universe_digest,
    source_c2_fingerprint,cohort_digest,symbol,pool,classification,created_at
  ) VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11)`).bind(
    generationId,sourceSessionDate,targetTradeDate,sourceC1ContentDigest,sourceC1UniverseDigest,
    sourceC2Fingerprint,cohortDigest,row.symbol,row.pool,row.classification,now
  )));
  const readback=await session.prepare(`SELECT COUNT(*) AS n,MIN(cohort_digest) AS digest,MAX(cohort_digest) AS digest2
    FROM trade_research_c3_cohorts WHERE generation_id=?1`).bind(generationId).first();
  if(Number(readback?.n)!==rows.length||readback?.digest!==cohortDigest||readback?.digest2!==cohortDigest)
    throw new Error("C3_CAPTURE_COHORT_READBACK_MISMATCH");
  return {ok:true,idempotent:false,generationId,targetTradeDate,cohortDigest,symbols:rows.length,
    requiredCalls,researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true};
}

async function readC3ResearchCohort(env,{generationId=null,targetTradeDate=null}={}) {
  if(!env?.V7_DB) return {ok:false,error:"C3_CAPTURE_D1_REQUIRED",researchOnly:true};
  await ensureD1Schema(env);
  const session=env.V7_DB.withSession("first-primary");
  const gid=String(generationId||"").trim(),date=c3ResearchDate(targetTradeDate);
  let result;
  if(gid) result=await session.prepare(`SELECT generation_id,source_session_date,target_trade_date,source_c1_content_digest,
    source_c1_universe_digest,source_c2_fingerprint,cohort_digest,symbol,pool,classification,created_at
    FROM trade_research_c3_cohorts WHERE generation_id=?1 ORDER BY symbol`).bind(gid).all();
  else if(date) result=await session.prepare(`SELECT generation_id,source_session_date,target_trade_date,source_c1_content_digest,
    source_c1_universe_digest,source_c2_fingerprint,cohort_digest,symbol,pool,classification,created_at
    FROM trade_research_c3_cohorts WHERE target_trade_date=?1 ORDER BY symbol`).bind(date).all();
  else throw new Error("C3_CAPTURE_QUERY_REQUIRES_GENERATION_OR_DATE");
  return {ok:true,rows:result?.results||[],researchOnly:true,decisionImpact:false,formalCoreImpact:false};
}

async function persistC3ResearchBar(session,row,scheduledTime,rawBar) {
  const barStart=String(rawBar?.time||"");
  const startMs=Date.parse(barStart);
  if(!Number.isFinite(startMs)) throw new Error("C3_CAPTURE_BAR_TIME_INVALID");
  const barEnd=new Date(startMs+15*60000).toISOString();
  const payload={
    time:barStart,open:toNumber(rawBar.open),high:toNumber(rawBar.high),low:toNumber(rawBar.low),
    close:toNumber(rawBar.close),volume:toNumber(rawBar.volume),average:toNumber(rawBar.average),
    avg5Volume:toNumber(rawBar.avg5Volume),volumeRatio:toNumber(rawBar.volumeRatio)
  };
  if(["open","high","low","close"].some(k=>!(payload[k]>0))||payload.volume===null||payload.volume<0)
    throw new Error("C3_CAPTURE_BAR_VALUES_INVALID");
  const encoded=JSON.stringify(payload);
  const existing=await session.prepare(`SELECT bar_json FROM trade_research_c3_bars
    WHERE generation_id=?1 AND symbol=?2 AND bar_start=?3`).bind(row.generation_id,row.symbol,barStart).first();
  if(existing) {
    if(existing.bar_json!==encoded) throw new Error("C3_CAPTURE_IMMUTABLE_BAR_CONFLICT");
    return {stored:false,duplicate:true,symbol:row.symbol,barStart};
  }
  const fetchedAt=new Date().toISOString();
  await session.prepare(`INSERT INTO trade_research_c3_bars(
    generation_id,target_trade_date,symbol,bar_start,bar_end,scheduled_time,bar_json,source_fetched_at,source_family,completed_bar,created_at
  ) VALUES(?1,?2,?3,?4,?5,?6,?7,?8,'FUGLE_INTRADAY_CANDLES_15M',1,?8)`).bind(
    row.generation_id,row.target_trade_date,row.symbol,barStart,barEnd,Number(scheduledTime),encoded,fetchedAt
  ).run();
  return {stored:true,duplicate:false,symbol:row.symbol,barStart};
}

async function captureC3ResearchBarsSafe(env,scheduledTime,need15,baseFugleCallsThisMinute=0) {
  if(!need15) return {enabled:true,skipped:true,reason:"NO_NEW_COMPLETED_15M_BAR",extraCalls:0,researchOnly:true,decisionImpact:false};
  if(!env?.V7_DB||!env?.FUGLE_API_KEY) return {enabled:false,skipped:true,reason:"C3_CAPTURE_RUNTIME_BINDING_MISSING",extraCalls:0,researchOnly:true,decisionImpact:false};
  const limits=c3ResearchLimits(env);
  if(!limits.ready) return {enabled:false,skipped:true,reason:limits.reason,extraCalls:0,researchOnly:true,decisionImpact:false};
  const expectedSlot=c3ExpectedSlot(scheduledTime);
  if(!expectedSlot) return {enabled:true,skipped:true,reason:"C3_CAPTURE_NOT_EXPECTED_SLOT",extraCalls:0,researchOnly:true,decisionImpact:false};
  try {
    await ensureD1Schema(env);
    const targetDate=taiwanDate(scheduledTime),session=env.V7_DB.withSession("first-primary");
    const result=await session.prepare(`SELECT generation_id,target_trade_date,symbol,pool,classification
      FROM trade_research_c3_cohorts WHERE target_trade_date=?1 ORDER BY symbol`).bind(targetDate).all();
    const rows=result?.results||[];
    if(!rows.length) return {enabled:true,skipped:true,reason:"NO_ACTIVE_C3_COHORT",extraCalls:0,researchOnly:true,decisionImpact:false};
    if(rows.length>limits.maxSymbols||rows.length>limits.maxCallsPerSlot||
       rows.length*C3_RESEARCH_CAPTURE_SLOTS.length>limits.callsPerSession)
      return {enabled:false,skipped:true,reason:"C3_CAPTURE_ACTIVE_COHORT_EXCEEDS_OPERATOR_LIMITS",extraCalls:0,researchOnly:true,decisionImpact:false,formalCoreImpact:false};
    const baseCalls=Number(baseFugleCallsThisMinute);
    if(!Number.isFinite(baseCalls)||baseCalls<0||baseCalls+rows.length>limits.maxTotalCallsPerMinute)
      return {enabled:false,skipped:true,reason:"C3_CAPTURE_MINUTE_BUDGET_BLOCKED",extraCalls:0,
        baseFugleCallsThisMinute:Number.isFinite(baseCalls)&&baseCalls>=0?baseCalls:null,
        projectedTotalCallsThisMinute:Number.isFinite(baseCalls)&&baseCalls>=0?baseCalls+rows.length:null,
        maxTotalCallsPerMinute:limits.maxTotalCallsPerMinute,
        researchOnly:true,decisionImpact:false,formalCoreImpact:false};

    const formal=await loadStockConfig(env);
    const formalSet=new Set((formal?.stocks||[]).map(x=>String(x.symbol)));
    if(rows.some(row=>formalSet.has(String(row.symbol))))
      return {enabled:false,skipped:true,reason:"C3_CAPTURE_FORMAL_OVERLAP_DETECTED",extraCalls:0,researchOnly:true,decisionImpact:false,formalCoreImpact:false};

    const settled=await Promise.allSettled(rows.map(async row=>{
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
    };
  } catch(error) {
    return {enabled:true,skipped:false,failOpen:true,error:String(error).slice(0,300),extraCalls:0,
      researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true};
  }
}

async function readC3ResearchBars(env,generationId) {
  if(!env?.V7_DB) return {ok:false,error:"C3_CAPTURE_D1_REQUIRED",researchOnly:true};
  const gid=String(generationId||"").trim();
  if(!gid) throw new Error("C3_CAPTURE_GENERATION_REQUIRED");
  await ensureD1Schema(env);
  const result=await env.V7_DB.withSession("first-primary").prepare(`SELECT generation_id,target_trade_date,symbol,bar_start,bar_end,
    scheduled_time,bar_json,source_fetched_at,source_family,completed_bar
    FROM trade_research_c3_bars WHERE generation_id=?1 ORDER BY symbol,bar_start LIMIT 500`).bind(gid).all();
  return {ok:true,generationId:gid,rows:result?.results||[],researchOnly:true,decisionImpact:false,formalCoreImpact:false};
}

'''
replace_once(
    'async function readLiveSnapshot(env) {',
    helpers+'async function readLiveSnapshot(env) {',
    "C3 research helpers"
)

routes=r'''    if (url.pathname === "/api/research/c3-capture-cohort") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      try {
        if(request.method==="POST") return json(await saveC3ResearchCohort(env,await request.json()),200,true);
        if(request.method==="GET") return json(await readC3ResearchCohort(env,{
          generationId:url.searchParams.get("generationId"),targetTradeDate:url.searchParams.get("targetTradeDate")
        }),200,true);
        return json({error:"Method not allowed"},405,true);
      } catch(error) {
        return json({ok:false,error:String(error),researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true},400,true);
      }
    }

    if (url.pathname === "/api/research/c3-capture-bars") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      try{return json(await readC3ResearchBars(env,url.searchParams.get("generationId")),200,true);}
      catch(error){return json({ok:false,error:String(error),researchOnly:true,decisionImpact:false,formalCoreImpact:false},400,true);}
    }

'''
replace_once(
    '    if (url.pathname === "/api/research/c1-population") {',
    routes+'    if (url.pathname === "/api/research/c1-population") {',
    "C3 research routes"
)

replace_once(
r'''  const pvShadow = await recordPvIntradayShadowSafe(env,results,scheduledTime,forceFrames||need15);
  return {...kvSummary,executionResearchRecorder,pvShadow};''',
r'''  const pvShadow = await recordPvIntradayShadowSafe(env,results,scheduledTime,forceFrames||need15);
  // C3 research capture runs only after Formal signal processing, live-state persistence,
  // and the existing PV Shadow recorder. It never joins monitoringStocks/results.
  const baseCallSummary=kvSummary.fugleCallsThisRun||{};
  const c3ResearchCapture = await captureC3ResearchBarsSafe(env,scheduledTime,need15,Number(baseCallSummary.total||0));
  const c3ExtraCalls=Number(c3ResearchCapture?.extraCalls||0);
  return {...kvSummary,
    fugleCallsThisRun:{...baseCallSummary,c3ResearchCandles:c3ExtraCalls,total:Number(baseCallSummary.total||0)+c3ExtraCalls},
    executionResearchRecorder,pvShadow,c3ResearchCapture};''',
    "C3 post-Formal capture hook"
)

path.write_text(text.replace("\r\n","\n"),encoding="utf-8",newline="\n")
print("Applied V8.15.2 C3 research-only intraday capture; Formal monitoring and signals unchanged")
