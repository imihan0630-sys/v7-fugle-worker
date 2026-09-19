from pathlib import Path

path = Path("Worker.js")
text = path.read_text(encoding="utf-8")


def replace_once(old: str, new: str, label: str) -> None:
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly 1 match, found {count}")
    text = text.replace(old, new, 1)


replace_once(
    'const VERSION = "8.0.4-3min-current-plan-recovery";',
    'const VERSION = "8.1.0-ops-hardening";',
    "runtime version",
)

replace_once(
'''  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS v7_signal_delivery_state (
    state_key TEXT PRIMARY KEY,snapshot_json TEXT,lease_token TEXT,lease_until INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL
  )`).run();
  D1_SCHEMA_READY = true;''',
'''  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS v7_signal_delivery_state (
    state_key TEXT PRIMARY KEY,snapshot_json TEXT,lease_token TEXT,lease_until INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL
  )`).run();
  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS v7_push_outbox (
    signal_id TEXT PRIMARY KEY,
    trade_date TEXT,
    symbol TEXT,
    signal_type TEXT,
    episode INTEGER,
    delivery_state TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    http_status INTEGER,
    note TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    accepted_at TEXT
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_v7_push_outbox_state_updated
    ON v7_push_outbox(delivery_state,updated_at)`).run();
  D1_SCHEMA_READY = true;''',
    "D1 push outbox schema",
)

replace_once(
'''async function readHistoryCache(env, limit = 500) {''',
'''async function writePushOutbox(env,payload,deliveryState,meta={}) {
  if(!env?.V7_DB) {
    if(!isTestMode(env) && env?.PUSH_WEBHOOK_URL) throw new Error("PUSH_OUTBOX_UNAVAILABLE：正式推播必須有D1 outbox");
    return {stored:false,reason:"D1 unavailable"};
  }
  if(!payload?.signalId) throw new Error("PUSH_OUTBOX_INVALID：signalId缺失");
  await ensureD1Schema(env);
  const now=new Date().toISOString();
  const state=String(deliveryState || "UNKNOWN");
  if(!["PENDING","RESERVED","ACCEPTED","UNKNOWN","FAILED"].includes(state)) throw new Error("PUSH_OUTBOX_INVALID_STATE");
  const session=env.V7_DB.withSession("first-primary");
  await session.prepare(`
    INSERT INTO v7_push_outbox(
      signal_id,trade_date,symbol,signal_type,episode,delivery_state,payload_json,http_status,note,created_at,updated_at,accepted_at
    ) VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12)
    ON CONFLICT(signal_id) DO UPDATE SET
      trade_date=excluded.trade_date,
      symbol=excluded.symbol,
      signal_type=excluded.signal_type,
      episode=excluded.episode,
      delivery_state=excluded.delivery_state,
      payload_json=excluded.payload_json,
      http_status=excluded.http_status,
      note=excluded.note,
      updated_at=excluded.updated_at,
      accepted_at=CASE WHEN excluded.delivery_state='ACCEPTED' THEN excluded.updated_at ELSE v7_push_outbox.accepted_at END
  `).bind(
    String(payload.signalId),
    payload.tradeDate || null,
    payload.stock?.symbol || null,
    payload.signalType || payload.type || null,
    Number.isFinite(Number(meta.episode)) ? Number(meta.episode) : null,
    state,
    JSON.stringify(payload),
    Number.isFinite(Number(meta.httpStatus)) ? Number(meta.httpStatus) : null,
    meta.note ? String(meta.note).slice(0,500) : null,
    now,now,state==="ACCEPTED" ? now : null
  ).run();
  return {stored:true,signalId:payload.signalId,deliveryState:state};
}

async function readPushOutboxSummary(env,limit=20) {
  if(!env?.V7_DB) return {configured:false,total:0,counts:{},unresolved:0,staleUnresolved:0,recent:[]};
  try {
    await ensureD1Schema(env);
    const session=env.V7_DB.withSession("first-primary");
    const countRows=await session.prepare("SELECT delivery_state,COUNT(*) AS count FROM v7_push_outbox GROUP BY delivery_state").all();
    const counts={};
    for(const row of (countRows?.results || [])) counts[String(row.delivery_state)]=Number(row.count || 0);
    const safeLimit=Math.max(1,Math.min(50,Number(limit)||20));
    const recentResult=await session.prepare(`
      SELECT signal_id,trade_date,symbol,signal_type,episode,delivery_state,http_status,created_at,updated_at,accepted_at
      FROM v7_push_outbox ORDER BY updated_at DESC LIMIT ?1
    `).bind(safeLimit).all();
    const staleBefore=new Date(Date.now()-10*60*1000).toISOString();
    const stale=await session.prepare(`
      SELECT COUNT(*) AS count FROM v7_push_outbox
      WHERE delivery_state IN ('PENDING','RESERVED','UNKNOWN','FAILED') AND updated_at < ?1
    `).bind(staleBefore).first();
    const unresolved=(counts.PENDING||0)+(counts.RESERVED||0)+(counts.UNKNOWN||0)+(counts.FAILED||0);
    return {
      configured:true,
      total:Object.values(counts).reduce((sum,value)=>sum+Number(value||0),0),
      counts,
      unresolved,
      staleUnresolved:Number(stale?.count || 0),
      recent:Array.isArray(recentResult?.results) ? recentResult.results : []
    };
  } catch {
    return {configured:true,total:0,counts:{},unresolved:0,staleUnresolved:0,recent:[],readError:true};
  }
}

function requirementLabel(rule) {
  const labels={
    1:"0～6檔、不硬湊",2:"盤後自動掃描",3:"TWSE＋TPEx全市場",4:"千金／非千金3+3",
    5:"主流產業與過熱排除",6:"法人／集中度",7:"A拉回／B突破",8:"20日流動性",
    9:"市值分級",10:"大盤／族群RS",11:"財報／估值／催化",12:"品質綜合評分",
    13:"RR≥2",14:"15分K正式／10分K輔助",15:"加碼成交確認",16:"突破量價／最大追價",
    17:"六類手機主動推播",18:"推播防重複／Outbox",19:"實際持股與操作股數",20:"監控卡片同步",
    21:"總資金重算",22:"零股股數",23:"訊號排序",24:"A/B/C監控狀態",
    25:"每日自動產出隔日計畫",26:"3Min完整POST＋readback",27:"每日結果／0檔回報",
    28:"外部App交叉驗證",29:"完整鏈路總控驗收",30:"股價<10永久排除"
  };
  return labels[rule] || `需求${rule}`;
}

async function buildSystemOverview(env) {
  const latest=env.STOCKS_KV ? await env.STOCKS_KV.get(LAST_SCAN_KEY,"json") : null;
  const config=env.STOCKS_KV ? await env.STOCKS_KV.get(KV_KEY,"json") : null;
  const live=await readLiveSnapshot(env);
  const latestCron=await readLatestCronRun(env);
  const outbox=await readPushOutboxSummary(env,20);
  const recorded=Array.isArray(latest?.diagnostics?.requirements30?.incompleteRules)
    ? latest.diagnostics.requirements30.incompleteRules.map(Number).filter(rule=>rule>=1 && rule<=30)
    : [17,18,19,27,28,29];
  const incompleteRules=[...new Set(recorded)].sort((a,b)=>a-b);
  const rules=Array.from({length:30},(_,index)=>{
    const rule=index+1;
    return {rule,label:requirementLabel(rule),status:incompleteRules.includes(rule)?"PENDING_ACCEPTANCE":"VERIFIED"};
  });
  const scanDate=latest?.scanDate || null;
  const external=scanDate && env.STOCKS_KV ? await env.STOCKS_KV.get(`V7_EXTERNAL_VALIDATION:${scanDate}`,"json") : null;
  const comparison=scanDate && env.STOCKS_KV ? await env.STOCKS_KV.get(`V7_EXTERNAL_COMPARISON:${scanDate}`,"json") : null;
  return {
    version:VERSION,
    generatedAt:taiwanTime(),
    testMode:isTestMode(env),
    requirements:{
      total:30,
      completedCount:30-incompleteRules.length,
      pendingCount:incompleteRules.length,
      complete:incompleteRules.length===0,
      incompleteRules,
      rules
    },
    latestPlan:{
      scanDate,
      generatedAt:latest?.generatedAt || null,
      selectedCount:Number(latest?.selectedCount || 0),
      configUpdatedAt:config?.updatedAt || latest?.config?.updatedAt || null,
      pipeline:latest?.pipeline || null,
      threeMin:{
        accepted:latest?.pipeline?.threeMinAccepted===true,
        verified:latest?.pipeline?.threeMinVerified===true,
        httpStatus:latest?.threeMin?.httpStatus ?? null
      },
      dailyReport:{
        accepted:latest?.pipeline?.dailyReportAccepted===true,
        httpStatus:latest?.dailyReport?.httpStatus ?? null
      }
    },
    liveMonitor:{
      tradeDate:live?.tradeDate || null,
      generatedAt:live?.generatedAt || null,
      monitoredCount:Number(live?.monitoredCount || 0),
      notificationCount:Array.isArray(live?.notifications) ? live.notifications.length : 0
    },
    cron:latestCron ? {
      jobType:latestCron.job_type || null,
      status:latestCron.status || null,
      scheduledAt:latestCron.scheduled_at || null,
      finishedAt:latestCron.finished_at || null,
      error:latestCron.error || null
    } : null,
    integrations:{
      quoteConfigured:Boolean(env.FUGLE_API_KEY),
      phonePushConfigured:Boolean(env.PUSH_WEBHOOK_URL),
      threeMinConfigured:Boolean(env.THREEMIN_API_URL),
      threeMinReadbackConfigured:Boolean(env.THREEMIN_VERIFY_URL),
      kvConfigured:Boolean(env.STOCKS_KV),
      d1Configured:Boolean(env.V7_DB)
    },
    pushOutbox:outbox,
    externalValidation:{
      provided:Boolean(external),
      compared:Boolean(comparison),
      marketDate:scanDate,
      overlapCount:Number(comparison?.overlapCount || 0),
      v7OnlyCount:Array.isArray(comparison?.v7OnlySymbols) ? comparison.v7OnlySymbols.length : null,
      externalOnlyCount:Array.isArray(comparison?.externalOnlySymbols) ? comparison.externalOnlySymbols.length : null
    }
  };
}

function renderSystemOverviewPage(overview) {
  const ruleCards=(overview.requirements?.rules || []).map(item=>`
    <div class="rule ${item.status==="VERIFIED"?"ok":"pending"}">
      <b>#${item.rule}</b> ${h(item.label)}<span>${item.status==="VERIFIED"?"已完成":"待正式驗收"}</span>
    </div>`).join("");
  const pipeline=overview.latestPlan?.pipeline || {};
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="refresh" content="30"><title>V7/V8 系統總控</title><style>
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft JhengHei",sans-serif;background:#f4f6f8;margin:0;padding:18px;color:#222}
  .wrap{max-width:1200px;margin:auto}.top,.grid{display:grid;gap:12px}.top{grid-template-columns:repeat(auto-fit,minmax(190px,1fr));margin-bottom:14px}
  .box,.rule{background:white;border-radius:12px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,.07)}.big{font-size:28px;font-weight:900}.muted{color:#666;font-size:13px}
  .rules{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:8px}.rule{display:flex;gap:8px;align-items:center}.rule span{margin-left:auto;font-weight:800}
  .rule.ok{border-left:6px solid #2e7d32}.rule.pending{border-left:6px solid #d9a400}.bad{color:#b71c1c}.good{color:#1b5e20}
  a{display:inline-block;margin:0 8px 12px 0;padding:9px 13px;border-radius:8px;background:#1f6feb;color:white;text-decoration:none;font-weight:800}
  </style></head><body><div class="wrap">
  <h1>V7/V8 台股半自動交易決策｜系統總控</h1>
  <div><a href="/">回監控首頁</a><a href="/watchlist">動態觀察池</a></div>
  <div class="top">
    <div class="box"><div class="muted">30項完成度</div><div class="big">${overview.requirements.completedCount}/30</div><div>待驗收：${overview.requirements.incompleteRules.join("、") || "無"}</div></div>
    <div class="box"><div class="muted">Worker版本</div><div class="big" style="font-size:18px">${h(overview.version)}</div><div>TEST_MODE=${overview.testMode}</div></div>
    <div class="box"><div class="muted">最新盤後計畫</div><div class="big">${overview.latestPlan.selectedCount} 檔</div><div>${h(overview.latestPlan.scanDate || "-")}</div></div>
    <div class="box"><div class="muted">3Min</div><div class="big ${overview.latestPlan.threeMin.verified?"good":"bad"}">${overview.latestPlan.threeMin.verified?"已驗證":"待驗證"}</div><div>accepted=${pipeline.threeMinAccepted===true}｜readback=${pipeline.threeMinVerified===true}</div></div>
    <div class="box"><div class="muted">每日盤後回報</div><div class="big ${pipeline.dailyReportAccepted===true?"good":"bad"}">${pipeline.dailyReportAccepted===true?"已接受":"待驗收"}</div></div>
    <div class="box"><div class="muted">推播Outbox</div><div class="big">${overview.pushOutbox.unresolved}</div><div>未結案｜逾10分：${overview.pushOutbox.staleUnresolved}</div></div>
  </div>
  <div class="box" style="margin-bottom:14px"><b>鏈路：</b>
    選股 ${pipeline.selectionCompleted===true?"✅":"⏳"}｜
    設定讀回 ${pipeline.configVerified===true?"✅":"⏳"}｜
    3Min ${pipeline.threeMinVerified===true?"✅":"⏳"}｜
    盤後通知 ${pipeline.dailyReportAccepted===true?"✅":"⏳"}｜
    Pipeline ${pipeline.complete===true?"✅":"⏳"}
  </div>
  <h2>30項驗收</h2><div class="rules">${ruleCards}</div>
  <p class="muted">更新：${h(overview.generatedAt)}。此頁只顯示狀態，不揭露API金鑰、Webhook或管理員憑證。</p>
  </div></body></html>`;
}

function buildExternalValidationComparison(marketDate,v7Symbols,reference) {
  const core=[...new Set((v7Symbols || []).map(String))];
  const external=[...new Set((reference?.symbols || []).map(String))];
  const v7Set=new Set(core),externalSet=new Set(external);
  const overlapSymbols=core.filter(symbol=>externalSet.has(symbol));
  const v7OnlySymbols=core.filter(symbol=>!externalSet.has(symbol));
  const externalOnlySymbols=external.filter(symbol=>!v7Set.has(symbol));
  const unionCount=new Set([...core,...external]).size;
  return {
    marketDate,
    source:reference?.source || null,
    provenance:reference?.provenance || null,
    v7Symbols:core,
    externalSymbols:external,
    overlapSymbols,
    v7OnlySymbols,
    externalOnlySymbols,
    overlapCount:overlapSymbols.length,
    unionCount,
    overlapRatePct:unionCount ? round(overlapSymbols.length/unionCount*100,1) : 0,
    v7OverlapPct:core.length ? round(overlapSymbols.length/core.length*100,1) : 0,
    externalOverlapPct:external.length ? round(overlapSymbols.length/external.length*100,1) : 0,
    use:"僅交叉驗證，不改核心分數、資格、交易計畫或跨池配額",
    comparedAt:new Date().toISOString()
  };
}

async function readExternalValidationStats(env,limit=30) {
  if(!env?.STOCKS_KV?.list) return {days:0,records:[],summary:null};
  const listed=await env.STOCKS_KV.list({prefix:"V7_EXTERNAL_COMPARISON:",limit:Math.max(1,Math.min(30,Number(limit)||30))});
  const keys=(listed?.keys || []).map(item=>item.name).sort().reverse().slice(0,30);
  const records=(await Promise.all(keys.map(key=>env.STOCKS_KV.get(key,"json")))).filter(Boolean);
  const totalOverlap=records.reduce((sum,item)=>sum+Number(item.overlapCount||0),0);
  const totalUnion=records.reduce((sum,item)=>sum+Number(item.unionCount||0),0);
  return {
    days:records.length,
    records,
    summary:{
      totalOverlap,
      totalUnion,
      weightedOverlapRatePct:totalUnion ? round(totalOverlap/totalUnion*100,1) : 0
    }
  };
}

async function readHistoryCache(env, limit = 500) {''',
    "ops overview/outbox helpers",
)

replace_once(
'''    const reserve = !isTestMode(env) && Boolean(env.PUSH_WEBHOOK_URL);
    if(reserve) {
      if(!saveState) throw new Error("真實推播必須先取得D1權威儲存");
      pendingDeliveries[firedKey]={signalId:payload.signalId,episode,status:"RESERVED",reservedAt:new Date().toISOString()};
      episodes[firedKey]=episode;
      await persistCurrent(); // 成功持久化才可呼叫接收端；崩潰後不能重送同一輪。
    }
    const outcome = await sendPush(payload, env);
    if(reserve) {
      if(outcome.sent) delete pendingDeliveries[firedKey];
      else pendingDeliveries[firedKey]={...pendingDeliveries[firedKey],status:outcome.httpStatus ? "REJECTED_OR_UNKNOWN" : "UNKNOWN",httpStatus:outcome.httpStatus || null,checkedAt:new Date().toISOString()};
    }
    delivered.push({ ...payload, ...outcome, ...(reserve ? {deliveryState:outcome.sent ? "ACCEPTED" : pendingDeliveries[firedKey].status,automaticRetryBlocked:!outcome.sent} : {}) });''',
'''    const reserve = !isTestMode(env) && Boolean(env.PUSH_WEBHOOK_URL);
    if(reserve) {
      if(!saveState) throw new Error("真實推播必須先取得D1權威儲存");
      await writePushOutbox(env,payload,"PENDING",{episode,note:"訊號已建立，等待D1權威狀態保留"});
      pendingDeliveries[firedKey]={signalId:payload.signalId,episode,status:"RESERVED",reservedAt:new Date().toISOString()};
      episodes[firedKey]=episode;
      await persistCurrent(); // 成功持久化才可呼叫接收端；崩潰後不能重送同一輪。
      await writePushOutbox(env,payload,"RESERVED",{episode,note:"D1訊號狀態已保留，允許單次Webhook送出"});
    }
    const outcome = await sendPush(payload, env);
    let deliveryState=null;
    if(reserve) {
      deliveryState=outcome.sent ? "ACCEPTED" : (outcome.httpStatus ? "FAILED" : "UNKNOWN");
      if(outcome.sent) delete pendingDeliveries[firedKey];
      else pendingDeliveries[firedKey]={...pendingDeliveries[firedKey],status:deliveryState,httpStatus:outcome.httpStatus || null,checkedAt:new Date().toISOString()};
      await writePushOutbox(env,payload,deliveryState,{episode,httpStatus:outcome.httpStatus,note:outcome.sent?"Webhook已接受":(outcome.httpStatus?"Webhook明確拒絕；不自動重送":"傳輸結果不明；禁止盲目重送")});
    }
    delivered.push({ ...payload, ...outcome, ...(reserve ? {deliveryState,automaticRetryBlocked:!outcome.sent} : {}) });''',
    "push outbox delivery lifecycle",
)

replace_once(
'''function buildPushPayload(result, signal, tradeDate = taiwanDate()) {
  const p = result.plan;
  return {
    version: VERSION,
    signalId: `${tradeDate}:${result.symbol}:${result.plan?.positionStage || "NONE"}:${signal.type}`,
    signalType: signal.type,
    signalLabel: signal.label,
    tradeDate,
    positionStage: result.plan?.positionStage || "NONE",
    title: `V7 ${signal.label}｜${result.name} ${result.symbol}`,
    instruction: signal.instruction,
    stock: { symbol: result.symbol, name: result.name },
    currentPrice: result.currentPrice,
    reason: signal.reason+(["STOP_LOSS","SELL","REDUCE"].includes(signal.type) && signal.shares===null ? "；實際持股股數尚未回填，請先核對券商持股，不以預計買進股數代替" : ""),
    suggestedAmount: signal.amount,
    suggestedShares: ["BUY", "ADD"].includes(signal.type) && positiveNumber(result.currentPrice) && toNumber(signal.amount) !== null
      ? sharesFor(signal.amount, result.currentPrice) : signal.shares,
    stop: p.stop,
    profitCheck: p.profitCheck,
    time: taiwanTime()
  };
}''',
'''function buildPushPayload(result, signal, tradeDate = taiwanDate()) {
  const p = result.plan;
  const actualShares=Number.isInteger(p.actualShares) && p.actualShares>0 ? p.actualShares : null;
  const strategy=p.channel==="A" || p.mode==="PULLBACK" ? "A拉回承接" : p.channel==="B" || p.mode==="MOMENTUM" ? "B突破後承接" : (p.channel || p.mode || null);
  return {
    version: VERSION,
    signalId: `${tradeDate}:${result.symbol}:${result.plan?.positionStage || "NONE"}:${signal.type}`,
    signalType: signal.type,
    signalLabel: signal.label,
    tradeDate,
    positionStage: result.plan?.positionStage || "NONE",
    monitorGrade:result.monitorStatus?.grade || null,
    monitorText:result.monitorStatus?.text || null,
    signalLevel:p.signalLevel || null,
    strategy,
    priorityScore:toNumber(p.priorityScore),
    rewardRisk:toNumber(p.rewardRisk),
    title: `V7 ${signal.label}｜${result.name} ${result.symbol}`,
    instruction: signal.instruction,
    stock: { symbol: result.symbol, name: result.name },
    currentPrice: result.currentPrice,
    reason: signal.reason+(["STOP_LOSS","SELL","REDUCE"].includes(signal.type) && signal.shares===null ? "；實際持股股數尚未回填，請先核對券商持股，不以預計買進股數代替" : ""),
    suggestedAmount: signal.amount,
    suggestedShares: ["BUY", "ADD"].includes(signal.type) && positiveNumber(result.currentPrice) && toNumber(signal.amount) !== null
      ? sharesFor(signal.amount, result.currentPrice) : signal.shares,
    actualShares,
    actualPositionKnown:actualShares!==null,
    buyLow:toNumber(p.buyLow),
    buyHigh:toNumber(p.buyHigh),
    breakout:toNumber(p.breakout),
    maxChase:toNumber(p.maxChase),
    firstAmount:toNumber(p.firstAmount),
    secondAmount:toNumber(p.secondAmount),
    stop: p.stop,
    profitCheck: p.profitCheck,
    time: taiwanTime()
  };
}''',
    "richer intraday push payload",
)

replace_once(
'''  const profit = payload?.profitCheck !== null && payload?.profitCheck !== undefined ? `｜停利檢查：${payload.profitCheck}` : "";
  return [''',
'''  const profit = payload?.profitCheck !== null && payload?.profitCheck !== undefined ? `｜停利檢查：${payload.profitCheck}` : "";
  const plan = payload?.strategy ? `策略：${payload.strategy}｜訊號 ${payload.signalLevel || "-"}｜監控 ${payload.monitorGrade || "-"} ${payload.monitorText || ""}` : "";
  const score = payload?.priorityScore !== null && payload?.priorityScore !== undefined ? `優先分數：${payload.priorityScore}｜RR：${payload.rewardRisk ?? "-"}` : "";
  const position = payload?.actualPositionKnown ? `實際持股：${payload.actualShares} 股` : (["STOP_LOSS","SELL","REDUCE"].includes(payload?.signalType) ? "實際持股：尚未回填，禁止用預計股數代替" : "");
  return [''',
    "richer slack metadata",
)

replace_once(
'''    `${stock.name || ""} ${stock.symbol || ""}｜現價：${payload?.currentPrice ?? "-"}`,
    `動作：${payload?.instruction || payload?.signalLabel || "-"}`,
    `原因：${payload?.reason || "-"}`,
    `${amount}${shares}`.trim(),
    `${stop}${profit}`.trim(),
    `時間：${payload?.time || taiwanTime()}`''',
'''    `${stock.name || ""} ${stock.symbol || ""}｜現價：${payload?.currentPrice ?? "-"}`,
    plan,
    score,
    `動作：${payload?.instruction || payload?.signalLabel || "-"}`,
    position,
    `原因：${payload?.reason || "-"}`,
    `${amount}${shares}`.trim(),
    `${stop}${profit}`.trim(),
    `訊號ID：${payload?.signalId || "-"}`,
    `時間：${payload?.time || taiwanTime()}`''',
    "richer slack intraday lines",
)

replace_once(
'''async function sendPush(payload, env) {
  if (isTestMode(env)) {
    return { sent: true, simulated: true, httpStatus: null };
  }
  return await sendPushDirect(payload, env);
}''',
'''async function sendPush(payload, env) {
  if (isTestMode(env)) {
    return { sent: true, simulated: true, httpStatus: null };
  }
  return await sendPushDirect(payload, env);
}

async function sendTrackedPush(payload,env,meta={}) {
  const track=!isTestMode(env) && Boolean(env.PUSH_WEBHOOK_URL) && Boolean(env.V7_DB);
  if(!track) return await sendPush(payload,env);
  await writePushOutbox(env,payload,"PENDING",{...meta,note:"等待單次Webhook送出"});
  await writePushOutbox(env,payload,"RESERVED",{...meta,note:"已保留唯一signalId"});
  const outcome=await sendPush(payload,env);
  const deliveryState=outcome.sent ? "ACCEPTED" : (outcome.httpStatus ? "FAILED" : "UNKNOWN");
  await writePushOutbox(env,payload,deliveryState,{...meta,httpStatus:outcome.httpStatus,
    note:outcome.sent?"Webhook已接受":(outcome.httpStatus?"Webhook明確拒絕":"傳輸結果不明")});
  return {...outcome,deliveryState,automaticRetryBlocked:!outcome.sent};
}''',
    "tracked push helper",
)

replace_once(
'''function buildDailySelectionPayload(scanDate, stocks, diagnostics) {
  return {
    version: VERSION,
    signalId: `DAILY_SELECTION:${scanDate}`,
    signalType: "DAILY_SELECTION",
    signalLabel: "盤後明日標的",
    title: stocks.length ? `V7盤後選出 ${stocks.length} 檔` : "V7盤後：今日 0 檔，維持現金",
    instruction: stocks.length ? "依目前已實作篩選排名與15分K條件確認，不預先追價；完整30條尚未驗收完成" : "今日無符合目前已實作篩選條件標的，維持現金；完整30條尚未驗收完成",
    time: taiwanTime(),
    monitorUrl: "https://fugle-test.imihan0630.workers.dev/",
    diagnostics,
    stocks: stocks.map(stock => ({
      rank: stock.sourceRank, symbol: stock.symbol, name: stock.name,
      mode: stock.mode, firstAmount: stock.firstAmount, secondAmount: stock.secondAmount,
      firstShares: stock.firstShares, secondShares: stock.secondShares,
      firstCondition: stock.firstCondition, secondCondition: stock.secondCondition,
      stop: stock.stop, profitCheck: stock.profitCheck, reason: stock.selectedReason
    }))
  };
}''',
'''function buildDailySelectionPayload(scanDate, stocks, diagnostics) {
  return {
    version: VERSION,
    signalId: `DAILY_SELECTION:${scanDate}`,
    signalType: "DAILY_SELECTION",
    signalLabel: "盤後明日標的",
    tradeDate:scanDate,
    resultType:stocks.length ? "SELECTED" : "ZERO_MATCH",
    selectedCount:stocks.length,
    title: stocks.length ? `V7盤後選出 ${stocks.length} 檔` : "V7盤後：今日 0 檔，維持現金",
    instruction: stocks.length ? "隔日等待計畫已產生；依15分K正式條件執行，不預先追價" : "今日資料完整但無符合條件標的；維持現金，不硬湊",
    time: taiwanTime(),
    monitorUrl: "https://fugle-test.imihan0630.workers.dev/",
    diagnostics,
    stocks: stocks.map(stock => ({
      rank: stock.sourceRank, symbol: stock.symbol, name: stock.name,
      strategy:stock.channel==="A" || stock.mode==="PULLBACK" ? "A拉回承接" : "B突破後承接",
      signalLevel:stock.signalLevel || null,
      priorityScore:stock.priorityScore,
      rewardRisk:stock.rewardRisk,
      buyLow:stock.buyLow,buyHigh:stock.buyHigh,breakout:stock.breakout,maxChase:stock.maxChase,
      totalAllocation:stock.totalAllocation,
      mode: stock.mode, firstAmount: stock.firstAmount, secondAmount: stock.secondAmount,
      firstShares: stock.firstShares, secondShares: stock.secondShares,
      firstCondition: stock.firstCondition, secondCondition: stock.secondCondition,
      stop: stock.stop, profitCheck: stock.profitCheck, reason: stock.selectedReason
    }))
  };
}''',
    "daily report payload",
)

replace_once(
'''  if (payload?.signalType === "DAILY_SELECTION") {
    return [
      `📋 *${payload.title}*`, payload.instruction,
      ...(payload.stocks || []).map(stock =>
        `${stock.rank}. ${stock.name} ${stock.symbol}｜${stock.mode}\n第一筆 ${fmt(stock.firstAmount)}元／${stock.firstShares}股：${stock.firstCondition}\n第二筆 ${fmt(stock.secondAmount)}元／${stock.secondShares}股：${stock.secondCondition}\n停損 ${fmt(stock.stop)}｜停利檢查 ${fmt(stock.profitCheck)}\n入選原因：${stock.reason}`),
      `監控：${payload.monitorUrl}`, `時間：${payload.time}`
    ].join("\n\n");
  }''',
'''  if (payload?.signalType === "DAILY_SELECTION") {
    const rows=(payload.stocks || []).map(stock =>
      `${stock.rank}. ${stock.name} ${stock.symbol}｜${stock.strategy || stock.mode}｜訊號${stock.signalLevel || "-"}｜優先${fmt(stock.priorityScore)}｜RR ${fmt(stock.rewardRisk)}\n買區 ${fmt(stock.buyLow)}～${fmt(stock.buyHigh)}｜突破 ${fmt(stock.breakout)}｜最大追價 ${fmt(stock.maxChase)}\n第一筆 ${fmt(stock.firstAmount)}元／${stock.firstShares}股：${stock.firstCondition}\n第二筆 ${fmt(stock.secondAmount)}元／${stock.secondShares}股：${stock.secondCondition}\n停損 ${fmt(stock.stop)}｜停利檢查 ${fmt(stock.profitCheck)}\n入選原因：${stock.reason}`);
    return [
      `📋 *${payload.title}*`, payload.instruction,
      ...(rows.length ? rows : ["本輪無符合標的；維持現金，不硬湊。"]),
      `結果：${payload.resultType || "-"}｜共 ${payload.selectedCount ?? 0} 檔`,
      `監控：${payload.monitorUrl}`, `時間：${payload.time}`
    ].join("\n\n");
  }''',
    "daily slack format",
)

replace_once(
'''    const dailyPayload = buildDailySelectionPayload(marketDate, stocks, scan.diagnostics);
    report = previousReport?.sent === true && Boolean(previousReport.simulated) === isTestMode(env) ? { ...previousReport, deduplicated: true }
      : await sendPush(dailyPayload, env);
    if (report.sent) await env.STOCKS_KV.put(reportKey, JSON.stringify(report), { expirationTtl: 14 * 86400 });''',
'''    const dailyPayload = buildDailySelectionPayload(marketDate, stocks, scan.diagnostics);
    report = previousReport?.sent === true && Boolean(previousReport.simulated) === isTestMode(env) ? { ...previousReport, deduplicated: true }
      : await sendTrackedPush(dailyPayload, env,{note:"每日盤後結果／0檔回報"});
    await env.STOCKS_KV.put(reportKey, JSON.stringify({...report,signalId:dailyPayload.signalId,resultType:dailyPayload.resultType,
      selectedCount:dailyPayload.selectedCount,checkedAt:new Date().toISOString()}), { expirationTtl: 30 * 86400 });''',
    "tracked daily report",
)

replace_once(
'''  scan.diagnostics.externalValidation=externalReference ? {provided:true,marketDate,source:externalReference.source,provenance:externalReference.provenance,
    overlapSymbols:externalReference.symbols.filter(symbol=>selectedSymbols.has(symbol)),externalOnlySymbols:externalReference.symbols.filter(symbol=>!selectedSymbols.has(symbol)),
    use:externalReference.use,coreRulesUnchanged:true} : {provided:false,optional:true,coreRulesUnchanged:true,reason:"未提供外部App參考，核心全市場選股仍獨立運行"};''',
'''  const externalComparison=externalReference ? buildExternalValidationComparison(marketDate,[...selectedSymbols],externalReference) : null;
  scan.diagnostics.externalValidation=externalComparison ? {...externalComparison,provided:true,coreRulesUnchanged:true} :
    {provided:false,optional:true,coreRulesUnchanged:true,reason:"未提供外部App參考，核心全市場選股仍獨立運行"};''',
    "external comparison diagnostics",
)

replace_once(
'''    saved = await saveStockConfig(env, stocks, "Phase 4.3 A/B Strategy Rebase After-market Scan", totalCapital);
    bridge = await sendTo3Min(buildThreeMinPayload(marketDate,totalCapital,stocks),env);''',
'''    saved = await saveStockConfig(env, stocks, "Phase 4.3 A/B Strategy Rebase After-market Scan", totalCapital);
    if(externalComparison) await env.STOCKS_KV.put(`V7_EXTERNAL_COMPARISON:${marketDate}`,JSON.stringify(externalComparison),{expirationTtl:45*86400});
    bridge = await sendTo3Min(buildThreeMinPayload(marketDate,totalCapital,stocks),env);''',
    "persist external comparison",
)

replace_once(
'''if(url.pathname==="/api/external-validation") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(!env.STOCKS_KV) return json({error:"Missing KV"},503,true);
      if(request.method==='GET') {
        await loadTradingCalendar(env,Number(taiwanDate().slice(0,4)));
        const date=normalizeMarketDate(url.searchParams.get('marketDate')) || mostRecentWeekday(taiwanDate());
        return json({marketDate:date,reference:await env.STOCKS_KV.get(`V7_EXTERNAL_VALIDATION:${date}`,"json"),noPlanChanges:true},200,true);
      }
      if(request.method!=='POST') return json({error:"Method not allowed"},405,true);
      try {
        const body=await request.json(),date=normalizeMarketDate(body.marketDate);
        if(!date || date>taiwanDate() || date<shiftDateString(taiwanDate(),-14)) throw new Error("外部參考日期無效，不接受未來或過舊資料");
        await loadTradingCalendar(env,Number(date.slice(0,4)));if(!isTradingDate(date)) throw new Error("外部參考不是交易日");
        if(typeof body.source!=='string' || !body.source.trim() || body.source.length>80 || !Array.isArray(body.symbols) || body.symbols.length>200) throw new Error("外部來源或標的數無效");
        const symbols=body.symbols.map(symbol=>String(symbol).trim());
        if(symbols.some(symbol=>!/^[1-9][0-9]{3}$/.test(symbol)) || new Set(symbols).size!==symbols.length || (body.notes!==undefined && (typeof body.notes!=='string' || body.notes.length>1500))) throw new Error("外部標的重複、非普通股代碼或備註過長");
        const reference={marketDate:date,source:body.source.trim(),symbols,notes:body.notes || '',provenance:"管理員提供之外部參考，未驗證App原始結果",use:"僅交叉驗證，不改核心分數、資格、交易計畫或跨池配額",updatedAt:new Date().toISOString()};
        const key=`V7_EXTERNAL_VALIDATION:${date}`;await env.STOCKS_KV.put(key,JSON.stringify(reference),{expirationTtl:30*86400});
        const readback=await env.STOCKS_KV.get(key,"json");if(JSON.stringify(readback)!==JSON.stringify(reference)) throw new Error("外部參考讀回不一致");
        return json({ok:true,verified:true,count:symbols.length,marketDate:date,noPlanChanges:true,noPush:true,noThreeMinWrite:true},200,true);
      }catch(error){return json({error:String(error)},400,true);}
    }''',
'''if(url.pathname==="/api/external-validation") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(!env.STOCKS_KV) return json({error:"Missing KV"},503,true);
      if(request.method==='GET') {
        await loadTradingCalendar(env,Number(taiwanDate().slice(0,4)));
        const date=normalizeMarketDate(url.searchParams.get('marketDate')) || mostRecentWeekday(taiwanDate());
        return json({marketDate:date,
          reference:await env.STOCKS_KV.get(`V7_EXTERNAL_VALIDATION:${date}`,"json"),
          comparison:await env.STOCKS_KV.get(`V7_EXTERNAL_COMPARISON:${date}`,"json"),
          noPlanChanges:true},200,true);
      }
      if(request.method!=='POST') return json({error:"Method not allowed"},405,true);
      try {
        const body=await request.json(),date=normalizeMarketDate(body.marketDate);
        if(!date || date>taiwanDate() || date<shiftDateString(taiwanDate(),-45)) throw new Error("外部參考日期無效，不接受未來或超過45日資料");
        await loadTradingCalendar(env,Number(date.slice(0,4)));if(!isTradingDate(date)) throw new Error("外部參考不是交易日");
        if(typeof body.source!=='string' || !body.source.trim() || body.source.length>80 || !Array.isArray(body.symbols) || body.symbols.length>200) throw new Error("外部來源或標的數無效");
        const symbols=body.symbols.map(symbol=>String(symbol).trim());
        if(symbols.some(symbol=>!/^[1-9][0-9]{3}$/.test(symbol)) || new Set(symbols).size!==symbols.length || (body.notes!==undefined && (typeof body.notes!=='string' || body.notes.length>1500))) throw new Error("外部標的重複、非普通股代碼或備註過長");
        const reference={marketDate:date,source:body.source.trim(),symbols,notes:body.notes || '',provenance:"管理員提供之外部參考，未驗證App原始結果",use:"僅交叉驗證，不改核心分數、資格、交易計畫或跨池配額",updatedAt:new Date().toISOString()};
        const key=`V7_EXTERNAL_VALIDATION:${date}`;await env.STOCKS_KV.put(key,JSON.stringify(reference),{expirationTtl:45*86400});
        const readback=await env.STOCKS_KV.get(key,"json");if(JSON.stringify(readback)!==JSON.stringify(reference)) throw new Error("外部參考讀回不一致");
        const latest=await env.STOCKS_KV.get(LAST_SCAN_KEY,"json");
        let comparison=null;
        if(latest?.scanDate===date && Array.isArray(latest.stocks)) {
          comparison=buildExternalValidationComparison(date,latest.stocks.map(stock=>stock.symbol),reference);
          await env.STOCKS_KV.put(`V7_EXTERNAL_COMPARISON:${date}`,JSON.stringify(comparison),{expirationTtl:45*86400});
        }
        return json({ok:true,verified:true,count:symbols.length,marketDate:date,comparison,noPlanChanges:true,noPush:true,noThreeMinWrite:true},200,true);
      }catch(error){return json({error:String(error)},400,true);}
    }

    if(url.pathname==="/api/external-validation/stats") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      return json({...await readExternalValidationStats(env,30),noPlanChanges:true,noPush:true,noThreeMinWrite:true},200,true);
    }''',
    "external validation route",
)

marker='''    // 只讀既有3Min紀錄並保存驗收證據；不重選、不重送、不更動交易計畫。
    if (url.pathname === "/api/three-min/verify") {'''
insert='''    if(url.pathname==="/api/system-overview") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      return json(await buildSystemOverview(env),200,true);
    }

    if(url.pathname==="/api/push-outbox") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      return json(await readPushOutboxSummary(env,Number(url.searchParams.get("limit")||20)),200,true);
    }

    if(url.pathname==="/system") {
      if(request.method!=="GET") return new Response("Method not allowed",{status:405});
      const overview=await buildSystemOverview(env);
      // 公開頁面只使用去敏感化狀態；不輸出Outbox逐筆signalId。
      overview.pushOutbox={...overview.pushOutbox,recent:[]};
      return html(renderSystemOverviewPage(overview),200,true);
    }

''' + marker
replace_once(marker,insert,"system overview routes")

replace_once(
'''<a
  class="button"
  href="/admin"
>
⚙ 匯入今日標的
</a>''',
'''<div>
<a class="button" href="/system">📊 系統總控</a>
<a class="button" href="/admin">⚙ 匯入今日標的</a>
</div>''',
    "system dashboard home link",
)

path.write_text(text, encoding="utf-8")
print("Applied V8.1.0 operations hardening")
