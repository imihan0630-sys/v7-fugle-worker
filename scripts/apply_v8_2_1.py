from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text=text.replace(old,new,1)

def replace_between(start_marker,end_marker,replacement,label):
    global text
    start=text.find(start_marker)
    if start<0:
        raise SystemExit(f"{label}: start marker not found")
    end=text.find(end_marker,start)
    if end<0:
        raise SystemExit(f"{label}: end marker not found")
    text=text[:start]+replacement+text[end:]

replace_once(
    'const VERSION = "8.2.0-push-receipt-confirmation";',
    'const VERSION = "8.2.1-evidence-driven-acceptance";',
    "runtime version"
)

replace_between(
    "async function readPushReceiptSummary(env,limit=50) {",
    "function requirementLabel(rule) {",
r'''async function readPushReceiptSummary(env,limit=50) {
  if(!env?.V7_DB) return {configured:false,total:0,dailySelection:0,intraday:0,signalTypes:[],dailyResultTypes:{},recent:[]};
  try {
    await ensureD1Schema(env);
    const safeLimit=Math.max(1,Math.min(100,Number(limit)||50));
    const session=env.V7_DB.withSession("first-primary");
    const count=await session.prepare("SELECT COUNT(*) AS count FROM v7_push_receipts").first();
    const dailyRows=await session.prepare(`
      SELECT o.payload_json FROM v7_push_receipts r
      JOIN v7_push_outbox o ON o.signal_id=r.signal_id
      WHERE o.signal_type='DAILY_SELECTION'
    `).all();
    const types=await session.prepare(`
      SELECT o.signal_type,COUNT(*) AS count FROM v7_push_receipts r
      JOIN v7_push_outbox o ON o.signal_id=r.signal_id
      WHERE o.signal_type<>'DAILY_SELECTION'
      GROUP BY o.signal_type ORDER BY o.signal_type
    `).all();
    const recent=await session.prepare(`
      SELECT r.signal_id,r.confirmed_at,r.channel,o.trade_date,o.symbol,o.signal_type,o.accepted_at
      FROM v7_push_receipts r JOIN v7_push_outbox o ON o.signal_id=r.signal_id
      ORDER BY r.confirmed_at DESC LIMIT ?1
    `).bind(safeLimit).all();
    const signalTypes=(types?.results||[]).map(row=>({signalType:String(row.signal_type),count:Number(row.count||0)}));
    const dailyResultTypes={};
    for(const row of (dailyRows?.results||[])) {
      try {
        const payload=JSON.parse(String(row.payload_json||"{}"));
        const key=String(payload.resultType||"UNKNOWN");
        dailyResultTypes[key]=(dailyResultTypes[key]||0)+1;
      } catch {
        dailyResultTypes.UNKNOWN=(dailyResultTypes.UNKNOWN||0)+1;
      }
    }
    const total=Number(count?.count||0),dailySelection=(dailyRows?.results||[]).length;
    return {configured:true,total,dailySelection,intraday:Math.max(0,total-dailySelection),signalTypes,dailyResultTypes,
      recent:Array.isArray(recent?.results)?recent.results:[]};
  } catch {
    return {configured:true,total:0,dailySelection:0,intraday:0,signalTypes:[],dailyResultTypes:{},recent:[],readError:true};
  }
}

const EVIDENCE_ACCEPTANCE_KEY="V7_REQUIREMENT_ACCEPTANCE_V1";
const CORE_OPERATION_RECEIPT_TYPES=["BUY","ADD","REDUCE","PROFIT_CHECK","SELL","STOP_LOSS"];

function deriveEvidenceAcceptance({latest,config,outbox,receipts,externalStats,positionAudit,ledger}) {
  const typeCounts=Object.fromEntries((receipts?.signalTypes||[]).map(item=>[String(item.signalType),Number(item.count||0)]));
  const confirmedCore=CORE_OPERATION_RECEIPT_TYPES.filter(type=>(typeCounts[type]||0)>0);
  const missingCore=CORE_OPERATION_RECEIPT_TYPES.filter(type=>(typeCounts[type]||0)<=0);
  const rule17Current=confirmedCore.length===CORE_OPERATION_RECEIPT_TYPES.length;

  const acceptedOutbox=Number(outbox?.counts?.ACCEPTED||0);
  const rule18Current=outbox?.configured===true && outbox?.readError!==true && acceptedOutbox>0 &&
    Number(outbox?.unresolved||0)===0 && Number(outbox?.staleUnresolved||0)===0 && Number(receipts?.total||0)>0;

  const stocks=Array.isArray(config?.stocks)?config.stocks:[];
  const holdings=stocks.filter(stock=>normalizePositionStage(stock.positionStage)!=="NONE");
  const knownHoldings=holdings.filter(stock=>Number.isInteger(Number(stock.actualShares)) && Number(stock.actualShares)>0 &&
    positiveNumber(stock.averageCost)!==null && Number.isFinite(Date.parse(stock.firstEntryConfirmedAt)));
  const rule19Current=holdings.length>0 && knownHoldings.length===holdings.length && positionAudit?.noPlanChanges===true;

  const rule27Current=latest?.pipeline?.dailyReportAccepted===true && Number(receipts?.dailySelection||0)>0;
  const comparisonDays=Number(externalStats?.days||0);
  const rule28Current=comparisonDays>=3;

  const persisted=ledger?.rules && typeof ledger.rules==="object" ? ledger.rules : {};
  const effective=(rule,current)=>current || Boolean(persisted?.[String(rule)]?.acceptedAt);

  const evidence={
    17:{
      currentComplete:rule17Current,
      complete:effective(17,rule17Current),
      progress:`${confirmedCore.length}/6`,
      confirmedTypes:confirmedCore,
      missingTypes:missingCore,
      proof:rule17Current?"六類核心盤中訊號皆有真實手機確認紀錄":`手機實收 ${confirmedCore.length}/6；尚缺 ${missingCore.join("、")||"無"}`
    },
    18:{
      currentComplete:rule18Current,
      complete:effective(18,rule18Current),
      acceptedOutbox,unresolved:Number(outbox?.unresolved||0),staleUnresolved:Number(outbox?.staleUnresolved||0),
      proof:rule18Current?"真實Outbox已有ACCEPTED且目前無未結案／逾時傳輸":"等待真實Outbox ACCEPTED＋手機確認，且未結案與逾時必須為0"
    },
    19:{
      currentComplete:rule19Current,
      complete:effective(19,rule19Current),
      holdingCount:holdings.length,knownHoldingShares:knownHoldings.length,
      proof:rule19Current?"實際持股股數、均價與第一筆成交時間均已回填驗證":holdings.length? `持股資料 ${knownHoldings.length}/${holdings.length} 完整`:"尚未出現可驗收的真實持倉"
    },
    27:{
      currentComplete:rule27Current,
      complete:effective(27,rule27Current),
      dailyReceipts:Number(receipts?.dailySelection||0),
      dailyResultTypes:receipts?.dailyResultTypes||{},
      proof:rule27Current?"每日盤後結果已有真實手機實收；ZERO_MATCH邏輯由正式Regression持續驗證":"等待至少一筆真實盤後結果手機實收"
    },
    28:{
      currentComplete:rule28Current,
      complete:effective(28,rule28Current),
      comparisonDays,
      thresholdDays:3,
      proof:rule28Current?"外部App已累積至少3個交易日交叉比對，可持續統計":"需累積至少3個不同交易日的真實外部App交叉比對"
    }
  };

  const basePipeline=latest?.pipeline?.selectionCompleted===true &&
    latest?.pipeline?.configVerified===true &&
    latest?.pipeline?.threeMinVerified===true &&
    latest?.pipeline?.dailyReportAccepted===true &&
    latest?.pipeline?.complete===true;
  const allFive=[17,18,19,27,28].every(rule=>evidence[rule].complete===true);
  const rule29Current=basePipeline && allFive && Number(outbox?.staleUnresolved||0)===0;
  evidence[29]={
    currentComplete:rule29Current,
    complete:effective(29,rule29Current),
    proof:rule29Current?"17、18、19、27、28均有正式證據，且最新完整Pipeline與3Min讀回正常":"等待其餘正式驗收證據全部齊備後自動完成"
  };
  return evidence;
}

async function readEvidenceAcceptanceInputs(env) {
  const [latest,config,outbox,receipts,externalStats,positionAudit,ledger]=await Promise.all([
    env.STOCKS_KV ? env.STOCKS_KV.get(LAST_SCAN_KEY,"json") : null,
    env.STOCKS_KV ? env.STOCKS_KV.get(KV_KEY,"json") : null,
    readPushOutboxSummary(env,50),
    readPushReceiptSummary(env,100),
    readExternalValidationStats(env,30),
    env.STOCKS_KV ? env.STOCKS_KV.get("V7_POSITION_RECONCILIATION","json") : null,
    env.STOCKS_KV ? env.STOCKS_KV.get(EVIDENCE_ACCEPTANCE_KEY,"json") : null
  ]);
  return {latest,config,outbox,receipts,externalStats,positionAudit,ledger};
}

async function refreshEvidenceAcceptance(env,trigger="SYSTEM") {
  if(!env?.STOCKS_KV) return {changed:false,ledger:null,evidence:null};
  const inputs=await readEvidenceAcceptanceInputs(env);
  let evidence=deriveEvidenceAcceptance(inputs);
  const previous=inputs.ledger && typeof inputs.ledger==="object" ? inputs.ledger : {version:1,rules:{}};
  const rules={...(previous.rules||{})};
  let changed=false;
  const now=new Date().toISOString();
  for(const rule of [17,18,19,27,28]) {
    if(evidence[rule]?.currentComplete===true && !rules[String(rule)]?.acceptedAt) {
      rules[String(rule)]={acceptedAt:now,trigger,proof:evidence[rule].proof};
      changed=true;
    }
  }
  evidence=deriveEvidenceAcceptance({...inputs,ledger:{...previous,rules}});
  if(evidence[29]?.currentComplete===true && !rules["29"]?.acceptedAt) {
    rules["29"]={acceptedAt:now,trigger,proof:evidence[29].proof};
    changed=true;
  }
  const ledger={version:1,updatedAt:changed?now:(previous.updatedAt||null),rules};
  if(changed) await env.STOCKS_KV.put(EVIDENCE_ACCEPTANCE_KEY,JSON.stringify(ledger));
  return {changed,ledger,evidence:deriveEvidenceAcceptance({...inputs,ledger})};
}

function requirementLabel(rule) {''',
    "evidence-driven receipt summary and helpers"
)

replace_between(
    "async function buildSystemOverview(env) {",
    "function renderSystemOverviewPage(overview) {",
r'''async function buildSystemOverview(env) {
  const inputs=await readEvidenceAcceptanceInputs(env);
  const {latest,config,outbox,receipts,externalStats,positionAudit,ledger}=inputs;
  const live=await readLiveSnapshot(env);
  const latestCron=await readLatestCronRun(env);
  const evidence=deriveEvidenceAcceptance(inputs);

  const recorded=Array.isArray(latest?.diagnostics?.requirements30?.incompleteRules)
    ? latest.diagnostics.requirements30.incompleteRules.map(Number).filter(rule=>rule>=1 && rule<=30)
    : [17,18,19,27,28,29];
  const normalized=new Set(recorded);
  normalized.delete(11);
  if(latest?.diagnostics?.requirements30?.requirement26?.complete===true ||
     (latest?.pipeline?.threeMinAccepted===true && latest?.pipeline?.threeMinVerified===true)) normalized.delete(26);

  for(const rule of [17,18,19,27,28,29]) {
    if(evidence[rule]?.complete===true) normalized.delete(rule);
    else normalized.add(rule);
  }

  const incompleteRules=[...normalized].sort((a,b)=>a-b);
  const rules=Array.from({length:30},(_,index)=>{
    const rule=index+1;
    const dynamic=evidence[rule] || null;
    const stored=ledger?.rules?.[String(rule)] || null;
    const baseEvidence=rule===11 ? "V8.0.1官方財報/Q4單季EPS公式與正式驗收"
      : rule===26 && !incompleteRules.includes(26) ? "本期V7_PLAN_2真實POST＋3Min精確readback"
      : null;
    return {
      rule,label:requirementLabel(rule),
      status:incompleteRules.includes(rule)?"PENDING_ACCEPTANCE":"VERIFIED",
      evidence:dynamic?.proof || stored?.proof || baseEvidence,
      acceptedAt:stored?.acceptedAt || null,
      progress:dynamic?.progress || null
    };
  });
  const scanDate=latest?.scanDate || null;
  const external=scanDate && env.STOCKS_KV ? await env.STOCKS_KV.get(`V7_EXTERNAL_VALIDATION:${scanDate}`,"json") : null;
  const comparison=scanDate && env.STOCKS_KV ? await env.STOCKS_KV.get(`V7_EXTERNAL_COMPARISON:${scanDate}`,"json") : null;
  const holdings=Array.isArray(config?.stocks)?config.stocks.filter(stock=>normalizePositionStage(stock.positionStage)!=="NONE"):[];
  const knownHoldings=holdings.filter(stock=>Number.isInteger(Number(stock.actualShares)) && Number(stock.actualShares)>0 &&
    positiveNumber(stock.averageCost)!==null && Number.isFinite(Date.parse(stock.firstEntryConfirmedAt)));

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
      rules,
      acceptancePolicy:{
        rule17:"BUY/ADD/REDUCE/PROFIT_CHECK/SELL/STOP_LOSS 六類核心訊號均需真實手機確認",
        rule18:"Outbox至少1筆ACCEPTED、手機確認至少1筆、未結案與逾10分鐘均為0",
        rule19:"至少1個真實持倉且股數/均價/第一筆成交時間完整",
        rule27:"至少1筆每日盤後結果真實手機確認；ZERO_MATCH由正式Regression持續驗證",
        rule28:"至少3個不同交易日的外部App交叉比對",
        rule29:"17/18/19/27/28完成＋最新正式Pipeline完整"
      }
    },
    acceptanceEvidence:evidence,
    acceptanceLedger:ledger ? {updatedAt:ledger.updatedAt||null,acceptedRules:Object.keys(ledger.rules||{}).map(Number).sort((a,b)=>a-b)} : {updatedAt:null,acceptedRules:[]},
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
    pushReceipts:receipts,
    externalValidation:{
      provided:Boolean(external),
      compared:Boolean(comparison),
      marketDate:scanDate,
      comparisonDays:Number(externalStats?.days||0),
      overlapCount:Number(comparison?.overlapCount || 0),
      v7OnlyCount:Array.isArray(comparison?.v7OnlySymbols) ? comparison.v7OnlySymbols.length : null,
      externalOnlyCount:Array.isArray(comparison?.externalOnlySymbols) ? comparison.externalOnlySymbols.length : null
    },
    positions:{
      total:Array.isArray(config?.stocks) ? config.stocks.length : 0,
      holdingCount:holdings.length,
      knownHoldingShares:knownHoldings.length,
      completeForHoldings:holdings.length>0 && knownHoldings.length===holdings.length,
      lastReconciledAt:positionAudit?.updatedAt || null
    }
  };
}

function renderSystemOverviewPage(overview) {''',
    "evidence-driven system overview"
)

replace_between(
    "function renderSystemOverviewPage(overview) {",
    "function buildExternalValidationComparison(marketDate,v7Symbols,reference) {",
r'''function renderSystemOverviewPage(overview) {
  const ruleCards=(overview.requirements?.rules || []).map(item=>`
    <div class="rule ${item.status==="VERIFIED"?"ok":"pending"}">
      <div><b>#${item.rule}</b> ${h(item.label)}
      ${item.progress?`<div class="muted">進度：${h(item.progress)}</div>`:""}
      ${item.evidence?`<div class="muted">${h(item.evidence)}</div>`:""}</div>
      <span>${item.status==="VERIFIED"?"已完成":"待正式驗收"}</span>
    </div>`).join("");
  const pipeline=overview.latestPlan?.pipeline || {};
  const e=overview.acceptanceEvidence || {};
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="refresh" content="30"><title>V7/V8 系統總控</title><style>
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft JhengHei",sans-serif;background:#f4f6f8;margin:0;padding:18px;color:#222}
  .wrap{max-width:1200px;margin:auto}.top,.grid{display:grid;gap:12px}.top{grid-template-columns:repeat(auto-fit,minmax(190px,1fr));margin-bottom:14px}
  .box,.rule{background:white;border-radius:12px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,.07)}.big{font-size:28px;font-weight:900}.muted{color:#666;font-size:13px}
  .rules{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:8px}.rule{display:flex;gap:8px;align-items:flex-start}.rule span{margin-left:auto;font-weight:800;white-space:nowrap}
  .rule.ok{border-left:6px solid #2e7d32}.rule.pending{border-left:6px solid #d9a400}.bad{color:#b71c1c}.good{color:#1b5e20}
  a{display:inline-block;margin:0 8px 12px 0;padding:9px 13px;border-radius:8px;background:#1f6feb;color:white;text-decoration:none;font-weight:800}
  </style></head><body><div class="wrap">
  <h1>V7/V8 台股半自動交易決策｜系統總控</h1>
  <div><a href="/">回監控首頁</a><a href="/watchlist">動態觀察池</a><a href="/admin">管理／驗收資料</a></div>
  <div class="top">
    <div class="box"><div class="muted">30項完成度</div><div class="big">${overview.requirements.completedCount}/30</div><div>待驗收：${overview.requirements.incompleteRules.join("、") || "無"}</div></div>
    <div class="box"><div class="muted">Worker版本</div><div class="big" style="font-size:18px">${h(overview.version)}</div><div>TEST_MODE=${overview.testMode}</div></div>
    <div class="box"><div class="muted">六類核心手機實收</div><div class="big">${h(e[17]?.progress||"0/6")}</div><div>${h(e[17]?.missingTypes?.join("、")||"已齊")}</div></div>
    <div class="box"><div class="muted">推播Outbox</div><div class="big">${overview.pushOutbox.unresolved}</div><div>ACCEPTED ${overview.pushOutbox.counts?.ACCEPTED||0}｜逾10分 ${overview.pushOutbox.staleUnresolved}</div></div>
    <div class="box"><div class="muted">實際持股回填</div><div class="big">${overview.positions.knownHoldingShares}/${overview.positions.holdingCount}</div><div>${overview.positions.completeForHoldings?"完整":"待真實成交資料"}</div></div>
    <div class="box"><div class="muted">盤後手機實收</div><div class="big">${overview.pushReceipts.dailySelection}</div><div>真實確認筆數</div></div>
    <div class="box"><div class="muted">外部App交叉驗證</div><div class="big">${overview.externalValidation.comparisonDays}/3</div><div>交易日累積</div></div>
    <div class="box"><div class="muted">3Min</div><div class="big ${overview.latestPlan.threeMin.verified?"good":"bad"}">${overview.latestPlan.threeMin.verified?"已驗證":"待驗證"}</div><div>accepted=${pipeline.threeMinAccepted===true}｜readback=${pipeline.threeMinVerified===true}</div></div>
  </div>
  <div class="box" style="margin-bottom:14px"><b>完整鏈路：</b>
    選股 ${pipeline.selectionCompleted===true?"✅":"⏳"}｜
    設定讀回 ${pipeline.configVerified===true?"✅":"⏳"}｜
    3Min ${pipeline.threeMinVerified===true?"✅":"⏳"}｜
    盤後通知 ${pipeline.dailyReportAccepted===true?"✅":"⏳"}｜
    手機實收 ${overview.pushReceipts.total>0?"✅":"⏳"}｜
    Pipeline ${pipeline.complete===true?"✅":"⏳"}
  </div>
  <h2>30項驗收</h2><div class="rules">${ruleCards}</div>
  <p class="muted">驗收狀態採證據驅動；一旦取得正式證據會寫入永久驗收帳本，不會因舊掃描或之後清倉而倒退。更新：${h(overview.generatedAt)}。此頁不揭露API金鑰、Webhook或管理員憑證。</p>
  </div></body></html>`;
}

function buildExternalValidationComparison(marketDate,v7Symbols,reference) {''',
    "evidence-driven dashboard"
)

# Persist monotonic acceptance when a handset receipt is genuinely confirmed.
replace_once(
'''  const row=await session.prepare("SELECT signal_id,confirmed_at,channel FROM v7_push_receipts WHERE signal_id=?1")
    .bind(String(signalId)).first();
  return row;''',
'''  const row=await session.prepare("SELECT signal_id,confirmed_at,channel FROM v7_push_receipts WHERE signal_id=?1")
    .bind(String(signalId)).first();
  await refreshEvidenceAcceptance(env,"push-receipt");
  return row;''',
    "refresh acceptance after handset receipt"
)

# Persist acceptance after real position reconciliation.
replace_once(
'''        await env.STOCKS_KV.put("V7_POSITION_RECONCILIATION",JSON.stringify(audit),{expirationTtl:90*86400});
        return json({ok:true,verified:true,updatedAt:next.updatedAt,count:patchBySymbol.size,''',
'''        await env.STOCKS_KV.put("V7_POSITION_RECONCILIATION",JSON.stringify(audit),{expirationTtl:90*86400});
        await refreshEvidenceAcceptance(env,"position-reconciliation");
        return json({ok:true,verified:true,updatedAt:next.updatedAt,count:patchBySymbol.size,''',
    "refresh acceptance after position reconciliation"
)

# Persist acceptance after a real external-App reference is compared.
replace_once(
'''        return json({ok:true,verified:true,count:symbols.length,marketDate:date,comparison,noPlanChanges:true,noPush:true,noThreeMinWrite:true},200,true);''',
'''        await refreshEvidenceAcceptance(env,"external-validation");
        return json({ok:true,verified:true,count:symbols.length,marketDate:date,comparison,noPlanChanges:true,noPush:true,noThreeMinWrite:true},200,true);''',
    "refresh acceptance after external validation"
)

# Protected reconciliation endpoint: evidence-only metadata, never trading state.
route_marker='''    if(url.pathname==="/api/push-receipts") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      return json(await readPushReceiptSummary(env,url.searchParams.get("limit")||50),200,true);
    }
'''
route=route_marker+r'''
    if(url.pathname==="/api/acceptance/reconcile") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="POST") return json({error:"Method not allowed"},405,true);
      const result=await refreshEvidenceAcceptance(env,"manual-reconcile");
      return json({ok:true,changed:result.changed,ledger:result.ledger,evidence:result.evidence,
        noPlanChanges:true,noPush:true,noThreeMinWrite:true,noTrade:true},200,true);
    }
'''
replace_once(route_marker,route,"acceptance reconciliation route")

path.write_text(text,encoding="utf-8")
print("Applied V8.2.1 evidence-driven acceptance")
