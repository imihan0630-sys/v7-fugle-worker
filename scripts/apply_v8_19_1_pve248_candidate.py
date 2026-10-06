"""PVE-248 Class-B candidate: runtime/evidence remediation only. NOT authorized for Production merge/deploy."""
from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected one anchor, got {count}")
    text=text.replace(old,new,1)

# Preserve a rollback artifact for PR/CI comparison.
Path("artifacts").mkdir(exist_ok=True)
Path("artifacts/Worker-before-pve248-candidate.mjs").write_text(text,encoding="utf-8")

once(
'''function isAfterMarketSchedule(controller) {
  if (String(controller?.cron || "").toLowerCase() === "35 15 * * mon-fri") return true;
  return false;
}''',
'''function isAfterMarketSchedule(controller) {
  const cron=String(controller?.cron || "").trim().toLowerCase().replace(/\\s+/g," ");
  return cron === "35 15 * * mon-fri" || cron === "35,55 15 * * mon-fri";
}''',
"combined 23:35/23:55 after-market identity"
)

old_fetch='''async function fetchCandles(
  symbol,
  tf,
  env
) {
  const url =
    `https://api.fugle.tw/marketdata/v1.0/stock/intraday/candles/${symbol}` +
    `?timeframe=${tf}&sort=asc`;

  const response =
    await fetchWithDeadline(
      url,
      {
        headers: {
          "X-API-KEY":
            env.FUGLE_API_KEY
        }
      }
    );

  if (!response.ok) {
    const body =
      await response.text();

    throw new Error(
      `${symbol} ${tf}分K API錯誤 ${response.status}: ${body}`
    );
  }

  return await response.json();
}'''
new_fetch='''async function fetchCandles(
  symbol,
  tf,
  env
) {
  const url =
    `https://api.fugle.tw/marketdata/v1.0/stock/intraday/candles/${symbol}` +
    `?timeframe=${tf}&sort=asc`;

  const response =
    await fetchWithDeadline(
      url,
      {
        headers: {
          "X-API-KEY":
            env.FUGLE_API_KEY
        }
      }
    );

  const capturedAt=new Date().toISOString();
  const rawText=await response.text();

  if (!response.ok) {
    throw new Error(
      `${symbol} ${tf}分K API錯誤 ${response.status}: ${rawText}`
    );
  }

  let parsed;
  try { parsed=JSON.parse(rawText); }
  catch { throw new Error(`${symbol} ${tf}分K API回傳非JSON`); }

  if(tf===15 && pvShadowEnabled(env)) {
    parsed.__pvRawProvenance={
      provider:"FUGLE",
      endpoint:url,
      rawPayloadHash:await pvSha256Hex(rawText),
      rawPayloadHashBasis:"EXACT_PROVIDER_RESPONSE_SHA256",
      capturedAt,
      normalizationVersion:"PV_SHADOW_V0_2_PVE248"
    };
  }
  return parsed;
}'''
once(old_fetch,new_fetch,"15m fetch-boundary provenance")

once(
'''          if(pvEnabled) pvSession15=pvExtractCompletedSession15(raw,Date.now(),quote?.previousClose);''',
'''          if(pvEnabled) {
            pvSession15=pvExtractCompletedSession15(raw,Date.now(),quote?.previousClose);
            pvSession15.rawProvenance=raw?.__pvRawProvenance||null;
          }''',
"intraday raw provenance sidecar"
)

once(
'''  const source={sourceBarTimestamp:bar.time,barStart:bar.time,barEnd:new Date(Date.parse(bar.time)+15*60000).toISOString(),sourceFetchedAt:new Date(scheduledTime).toISOString(),sourceFamily:"FUGLE_INTRADAY_15M_LOTS",slotKey:bar.slotKey,completedBar:true,
    dailyIntradayRawCrossDivision:false,baselineVersion:PV_SHADOW_SCHEMA_VERSION};''',
'''  const rawProvenance=session?.rawProvenance||{};
  const source={sourceBarTimestamp:bar.time,barStart:bar.time,barEnd:new Date(Date.parse(bar.time)+15*60000).toISOString(),
    sourceFetchedAt:rawProvenance.capturedAt||new Date(scheduledTime).toISOString(),sourceFamily:"FUGLE_INTRADAY_15M_LOTS",slotKey:bar.slotKey,completedBar:true,
    provider:rawProvenance.provider||null,endpoint:rawProvenance.endpoint||null,rawPayloadHash:rawProvenance.rawPayloadHash||null,
    rawPayloadHashBasis:rawProvenance.rawPayloadHashBasis||null,normalizationVersion:rawProvenance.normalizationVersion||null,
    dailyIntradayRawCrossDivision:false,baselineVersion:PV_SHADOW_SCHEMA_VERSION};''',
"persist intraday raw provenance"
)

once(
'''  const payload={schemaVersion:PV_SHADOW_SCHEMA_VERSION,source:"FUGLE_HISTORICAL_15M",timeframe:"15",slotTimezone:"Asia/Taipei",slots:PV_SHADOW_OBSERVABLE_SLOTS,sessions};''',
'''  const payload={schemaVersion:PV_SHADOW_SCHEMA_VERSION,source:"FUGLE_HISTORICAL_15M",timeframe:"15",slotTimezone:"Asia/Taipei",slots:PV_SHADOW_OBSERVABLE_SLOTS,
    bootstrapReceipt:cache?.bootstrapReceipt||null,sessions};''',
"persist baseline bootstrap receipt"
)

once(
'''async function pvFetchHistorical15(symbol,from,to,env) {
  const url=`https://api.fugle.tw/marketdata/v1.0/stock/historical/candles/${symbol}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&timeframe=15&fields=open,high,low,close,volume&sort=asc`;
  const response=await fetchWithDeadline(url,{headers:{"X-API-KEY":env.FUGLE_API_KEY}});
  if(!response.ok) throw new Error(`${symbol} PV歷史15分K API錯誤 ${response.status}: ${await response.text()}`);
  return response.json();
}''',
'''async function pvFetchHistorical15(symbol,from,to,env) {
  const url=`https://api.fugle.tw/marketdata/v1.0/stock/historical/candles/${symbol}?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&timeframe=15&fields=open,high,low,close,volume&sort=asc`;
  const response=await fetchWithDeadline(url,{headers:{"X-API-KEY":env.FUGLE_API_KEY}});
  const capturedAt=new Date().toISOString();
  const rawText=await response.text();
  if(!response.ok) throw new Error(`${symbol} PV歷史15分K API錯誤 ${response.status}: ${rawText}`);
  let parsed;
  try { parsed=JSON.parse(rawText); }
  catch { throw new Error(`${symbol} PV歷史15分K API回傳非JSON`); }
  parsed.__pvHistoricalProvenance={
    provider:"FUGLE",
    endpoint:url,
    providerStatus:`HTTP_${response.status}`,
    rawPayloadHash:await pvSha256Hex(rawText),
    rawPayloadHashBasis:"EXACT_PROVIDER_RESPONSE_SHA256",
    capturedAt
  };
  return parsed;
}''',
"historical fetch receipt"
)

once(
'''async function pvBootstrapSymbol(env,plan,marketDate) {
  const symbol=String(plan?.symbol||"");
  let cache=await pvReadBaseline(env,symbol);
  if(cache?.schemaVersion===PV_SHADOW_SCHEMA_VERSION && Number(cache.validSessions)>=PV_SHADOW_MIN_HISTORY) return {symbol,skipped:true,validSessions:cache.validSessions};
  const raw=await pvFetchHistorical15(symbol,shiftDateString(marketDate,-180),shiftDateString(marketDate,-1),env);
  const sessions=pvNormalizeHistoricalSessions(raw,marketDate);
  const merged=pvMergeBaselineSessions(cache?.sessions||[],sessions,cache?.corporateActionResetAt||plan?.corporateActionResetAt||null);
  const saved=await pvWriteBaseline(env,symbol,{sessions:merged,corporateActionResetAt:cache?.corporateActionResetAt||plan?.corporateActionResetAt||null});
  return {symbol,skipped:false,...saved};
}''',
'''async function pvBootstrapSymbol(env,plan,marketDate) {
  const symbol=String(plan?.symbol||"");
  let cache=await pvReadBaseline(env,symbol);
  if(cache?.schemaVersion===PV_SHADOW_SCHEMA_VERSION && Number(cache.validSessions)>=PV_SHADOW_MIN_HISTORY) {
    return {symbol,skipped:true,validSessions:cache.validSessions,finalValidSessions:cache.validSessions,bootstrapReceipt:cache.bootstrapReceipt||null};
  }
  const bootstrapAttemptAt=new Date().toISOString();
  const from=shiftDateString(marketDate,-180),to=shiftDateString(marketDate,-1);
  const raw=await pvFetchHistorical15(symbol,from,to,env);
  const rows=Array.isArray(raw?.data)?raw.data:[];
  const sessions=pvNormalizeHistoricalSessions(raw,marketDate);
  const candidateDates=new Set(rows.filter(bar=>{
    const ms=Date.parse(bar?.date);
    return Number.isFinite(ms) && taiwanDate(ms)<marketDate;
  }).map(bar=>taiwanDate(Date.parse(bar.date))));
  const acceptedDates=new Set(sessions.map(session=>session.marketDate));
  const rejectedDates=[...candidateDates].filter(date=>!acceptedDates.has(date));
  const invalidDateRows=rows.filter(bar=>!Number.isFinite(Date.parse(bar?.date))).length;
  const outOfRangeRows=rows.filter(bar=>{
    const ms=Date.parse(bar?.date);
    return Number.isFinite(ms) && taiwanDate(ms)>=marketDate;
  }).length;
  const nonObservableSlotRows=rows.filter(bar=>{
    const ms=Date.parse(bar?.date);
    return Number.isFinite(ms) && taiwanDate(ms)<marketDate && !pvTaipeiSlot(bar.date);
  }).length;
  const rejectedSessionReasons=[];
  if(rejectedDates.length) rejectedSessionReasons.push(`NO_NORMALIZED_OBSERVABLE_BARS:${rejectedDates.length}`);
  if(invalidDateRows) rejectedSessionReasons.push(`INVALID_DATE_ROWS:${invalidDateRows}`);
  if(outOfRangeRows) rejectedSessionReasons.push(`OUT_OF_RANGE_ROWS:${outOfRangeRows}`);
  if(nonObservableSlotRows) rejectedSessionReasons.push(`NON_OBSERVABLE_SLOT_ROWS:${nonObservableSlotRows}`);
  const provenance=raw?.__pvHistoricalProvenance||{};
  const receipt={
    bootstrapAttemptAt,symbol,from,to,
    providerStatus:provenance.providerStatus||"UNKNOWN",
    provider:provenance.provider||null,
    endpoint:provenance.endpoint||null,
    rawPayloadHash:provenance.rawPayloadHash||null,
    rawPayloadHashBasis:provenance.rawPayloadHashBasis||null,
    capturedAt:provenance.capturedAt||null,
    rawRowCount:rows.length,
    normalizedSessionCount:sessions.length,
    rejectedSessionCount:rejectedDates.length,
    rejectedSessionReasons
  };
  const merged=pvMergeBaselineSessions(cache?.sessions||[],sessions,cache?.corporateActionResetAt||plan?.corporateActionResetAt||null);
  const bootstrapReceipt={...receipt,finalValidSessions:merged.length};
  const saved=await pvWriteBaseline(env,symbol,{sessions:merged,corporateActionResetAt:cache?.corporateActionResetAt||plan?.corporateActionResetAt||null,bootstrapReceipt});
  return {symbol,skipped:false,...receipt,finalValidSessions:saved.validSessions,...saved};
}''',
"bootstrap readiness receipt"
)

once(
'''  return pvWriteBaseline(env,symbol,{sessions,corporateActionResetAt:existing.corporateActionResetAt||null});''',
'''  return pvWriteBaseline(env,symbol,{sessions,corporateActionResetAt:existing.corporateActionResetAt||null,bootstrapReceipt:existing.bootstrapReceipt||null});''',
"preserve bootstrap receipt on observed-session roll"
)

helper='''async function runPvBaselineWarmupSidecar(env,scheduledTime=Date.now()) {
  const marketDate=taiwanDate(scheduledTime);
  try {
    if(!pvShadowEnabled(env)) return {enabled:false,decisionImpact:false,skipped:true,reason:"PV_SHADOW_DISABLED",marketDate};
    await loadTradingCalendar(env,Number(marketDate.slice(0,4)));
    if(!isTradingDate(marketDate)) return {enabled:true,decisionImpact:false,skipped:true,reason:"NOT_TRADING_DAY",marketDate};
    const loaded=await loadStockConfig(env);
    const plans=(loaded?.stocks||[]).filter(plan=>plan?.strategyPool!==AIDEEN_POOL_ID);
    if(!plans.length) return {enabled:true,decisionImpact:false,skipped:true,reason:"NO_MONITORED_FORMAL_STOCKS",marketDate};
    const result=await bootstrapPvShadowBaselinesSafe(env,plans,marketDate);
    return {...result,marketDate,attemptedAt:new Date().toISOString(),source:"PVE248_AFTER_MARKET_RESEARCH_SIDECAR"};
  } catch(error) {
    return {enabled:pvShadowEnabled(env),decisionImpact:false,ok:false,marketDate,error:String(error).slice(0,500),source:"PVE248_AFTER_MARKET_RESEARCH_SIDECAR"};
  }
}

'''
once(
'''async function runScheduledWithAudit(controller, env) {''',
helper+'''async function runScheduledWithAudit(controller, env) {''',
"insert fail-open PV baseline sidecar"
)

once(
'''    /** @type {any} */
    const result = isHistoryWarmup
      ? await runHistorySeed(env, scheduledTime, HISTORY_WARMUP_LIMIT)
      : (isAfterMarket
        ? await runAfterMarketScan(env, scheduledTime,{onlyIfMissing:true})
        : await runBackgroundMonitor(env, scheduledTime));''',
'''    /** @type {any} */
    let result;
    if(isHistoryWarmup) {
      result=await runHistorySeed(env, scheduledTime, HISTORY_WARMUP_LIMIT);
    } else if(isAfterMarket) {
      let afterMarketError=null;
      try { result=await runAfterMarketScan(env, scheduledTime,{onlyIfMissing:true}); }
      catch(error) { afterMarketError=error; }
      const pvBaselineWarmup=await runPvBaselineWarmupSidecar(env,scheduledTime);
      if(afterMarketError) throw afterMarketError;
      if(result && typeof result==="object") result={...result,pvBaselineWarmup};
    } else {
      result=await runBackgroundMonitor(env, scheduledTime);
    }''',
"decouple PV baseline warmup from Formal after-market success"
)

once(
'''      detail: result?.status || null,''',
'''      detail: result?.status || result?.reason || null,''',
"persist idempotent recovery reason"
)

path.write_text(text,encoding="utf-8")
print("Applied PVE-248 Class-B candidate; Production merge/deploy not authorized")
