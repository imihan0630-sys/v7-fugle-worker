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
    'const VERSION = "8.1.3-ops-console-acceptance";',
    'const VERSION = "8.2.0-push-receipt-confirmation";',
    "runtime version"
)

replace_once(
'''  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_v7_push_outbox_state_updated
    ON v7_push_outbox(delivery_state,updated_at)`).run();
  D1_SCHEMA_READY = true;''',
'''  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_v7_push_outbox_state_updated
    ON v7_push_outbox(delivery_state,updated_at)`).run();
  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS v7_push_receipts (
    signal_id TEXT PRIMARY KEY,
    confirmed_at TEXT NOT NULL,
    channel TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_v7_push_receipts_confirmed
    ON v7_push_receipts(confirmed_at)`).run();
  D1_SCHEMA_READY = true;''',
    "push receipt D1 schema"
)

anchor='''function requirementLabel(rule) {'''
helpers=r'''function receiptBase64Url(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer))).replaceAll("+","-").replaceAll("/","_").replaceAll("=","");
}

async function signPushReceipt(signalId,env) {
  if(!env?.ADMIN_TOKEN || !signalId) return null;
  const key=await crypto.subtle.importKey(
    "raw",new TextEncoder().encode(String(env.ADMIN_TOKEN)),
    {name:"HMAC",hash:"SHA-256"},false,["sign"]
  );
  const signed=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode("V7_PUSH_RECEIPT:"+String(signalId)));
  return receiptBase64Url(signed).slice(0,24);
}

async function attachReceiptUrl(payload,env) {
  if(isTestMode(env) || !payload?.signalId || !env?.ADMIN_TOKEN) return payload;
  const sig=await signPushReceipt(payload.signalId,env);
  return {...payload,receiptUrl:`https://fugle-test.imihan0630.workers.dev/receipt?signalId=${encodeURIComponent(payload.signalId)}&sig=${encodeURIComponent(sig)}`};
}

async function verifyPushReceiptSignature(signalId,sig,env) {
  if(!signalId || !sig || !env?.ADMIN_TOKEN) return false;
  const expected=await signPushReceipt(signalId,env);
  if(typeof expected!=="string" || expected.length!==String(sig).length) return false;
  let diff=0;
  for(let i=0;i<expected.length;i++) diff|=expected.charCodeAt(i)^String(sig).charCodeAt(i);
  return diff===0;
}

async function recordPushReceipt(env,signalId,channel="PHONE_CONFIRMATION") {
  if(!env?.V7_DB) throw new Error("PUSH_RECEIPT_D1_UNAVAILABLE");
  await ensureD1Schema(env);
  const outbox=await readPushOutboxSignal(env,signalId);
  if(!outbox || outbox.delivery_state!=="ACCEPTED") throw new Error("只有已被Webhook接受的真實推播可以確認收到");
  const now=new Date().toISOString();
  const session=env.V7_DB.withSession("first-primary");
  await session.prepare(`
    INSERT INTO v7_push_receipts(signal_id,confirmed_at,channel,created_at)
    VALUES(?1,?2,?3,?4)
    ON CONFLICT(signal_id) DO UPDATE SET confirmed_at=excluded.confirmed_at,channel=excluded.channel
  `).bind(String(signalId),now,String(channel).slice(0,40),now).run();
  const row=await session.prepare("SELECT signal_id,confirmed_at,channel FROM v7_push_receipts WHERE signal_id=?1")
    .bind(String(signalId)).first();
  return row;
}

async function readPushReceiptSummary(env,limit=50) {
  if(!env?.V7_DB) return {configured:false,total:0,dailySelection:0,intraday:0,signalTypes:[],recent:[]};
  try {
    await ensureD1Schema(env);
    const safeLimit=Math.max(1,Math.min(100,Number(limit)||50));
    const session=env.V7_DB.withSession("first-primary");
    const count=await session.prepare("SELECT COUNT(*) AS count FROM v7_push_receipts").first();
    const daily=await session.prepare(`
      SELECT COUNT(*) AS count FROM v7_push_receipts r
      JOIN v7_push_outbox o ON o.signal_id=r.signal_id
      WHERE o.signal_type='DAILY_SELECTION'
    `).first();
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
    const total=Number(count?.count||0),dailySelection=Number(daily?.count||0);
    return {configured:true,total,dailySelection,intraday:Math.max(0,total-dailySelection),signalTypes,
      recent:Array.isArray(recent?.results)?recent.results:[]};
  } catch {
    return {configured:true,total:0,dailySelection:0,intraday:0,signalTypes:[],recent:[],readError:true};
  }
}

''' + anchor
replace_once(anchor,helpers,"push receipt helpers")

version_anchor='''    if (url.pathname === "/api/version") return json({ version: VERSION, testMode: isTestMode(env),
      bindings: { kv: !!env.STOCKS_KV, d1: !!env.V7_DB },
      readiness: { quote: !!env.FUGLE_API_KEY, phonePush: !!env.PUSH_WEBHOOK_URL, threeMin: !!env.THREEMIN_API_URL,
        threeMinReadback: !!env.THREEMIN_VERIFY_URL }, requirements30Complete: false, monitorUrl: url.origin }, 200, true);
'''
routes=version_anchor+r'''
    if(url.pathname==="/receipt") {
      const signalId=String(url.searchParams.get("signalId") || "");
      const sig=String(url.searchParams.get("sig") || "");
      if(request.method==="GET") {
        const valid=signalId && sig;
        return html(`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
        <title>V8 推播收到確認</title><style>body{font-family:"Microsoft JhengHei",sans-serif;background:#f4f6f8;padding:24px}.box{max-width:620px;margin:50px auto;background:#fff;padding:28px;border-radius:14px}button{padding:12px 18px;border:0;border-radius:8px;background:#1f6feb;color:#fff;font-weight:800;font-size:18px}</style></head>
        <body><div class="box"><h1>推播收到確認</h1><p>這一步只記錄「你實際看到了這則推播」，不會下單、不會更動交易計畫。</p>
        ${valid?`<form method="post"><input type="hidden" name="signalId" value="${h(signalId)}"><input type="hidden" name="sig" value="${h(sig)}"><button type="submit">確認我已收到</button></form>`:"<p>確認連結不完整。</p>"}
        </div></body></html>`,200,true);
      }
      if(request.method!=="POST") return new Response("Method not allowed",{status:405});
      try {
        const form=await request.formData();
        const postedId=String(form.get("signalId")||"");
        const postedSig=String(form.get("sig")||"");
        if(!(await verifyPushReceiptSignature(postedId,postedSig,env))) return html("<h2>確認連結無效或已失效</h2>",403,true);
        const receipt=await recordPushReceipt(env,postedId,"PHONE_CONFIRMATION");
        return html(`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>已確認收到</title></head>
        <body style="font-family:Microsoft JhengHei,sans-serif;padding:32px"><h1>✅ 已確認收到</h1><p>系統已留下手機實收證據。</p><p>${h(receipt?.confirmed_at||"")}</p></body></html>`,200,true);
      } catch(error) {
        return html(`<h2>無法確認</h2><p>${h(String(error))}</p>`,409,true);
      }
    }

    if(url.pathname==="/api/push-receipts") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      return json(await readPushReceiptSummary(env,url.searchParams.get("limit")||50),200,true);
    }
'''
replace_once(version_anchor,routes,"receipt routes")

replace_once(
'''async function sendTrackedPush(payload,env,meta={}) {
  const track=!isTestMode(env) && Boolean(env.PUSH_WEBHOOK_URL) && Boolean(env.V7_DB);
  if(!track) return await sendPush(payload,env);''',
'''async function sendTrackedPush(payload,env,meta={}) {
  const track=!isTestMode(env) && Boolean(env.PUSH_WEBHOOK_URL) && Boolean(env.V7_DB);
  if(track) payload=await attachReceiptUrl(payload,env);
  if(!track) return await sendPush(payload,env);''',
    "attach receipt to tracked pushes"
)

replace_once(
'''    if (!shouldPhonePushSignal(signal.type)) {
      delivered.push({
        ...payload,
        sent: false,
        simulated: false,
        pushSuppressed: true,
        suppressionReason: "此訊號類型未列入V7手機推播"
      });
      storedActive.add(signal.type);
      fired.add(firedKey);
      episodes[firedKey] = episode;
      continue;
    }

    const reserve = !isTestMode(env) && Boolean(env.PUSH_WEBHOOK_URL);''',
'''    if (!shouldPhonePushSignal(signal.type)) {
      delivered.push({
        ...payload,
        sent: false,
        simulated: false,
        pushSuppressed: true,
        suppressionReason: "此訊號類型未列入V7手機推播"
      });
      storedActive.add(signal.type);
      fired.add(firedKey);
      episodes[firedKey] = episode;
      continue;
    }

    payload=await attachReceiptUrl(payload,env);
    const reserve = !isTestMode(env) && Boolean(env.PUSH_WEBHOOK_URL);''',
    "attach receipt to intraday pushes"
)

replace_once(
'''      `監控：${payload.monitorUrl}`, `時間：${payload.time}`
    ].join("\n\n");''',
'''      `監控：${payload.monitorUrl}`,
      ...(payload.receiptUrl ? [`收到確認：${payload.receiptUrl}`] : []),
      `時間：${payload.time}`
    ].join("\n\n");''',
    "daily receipt link"
)

replace_once(
'''    `訊號ID：${payload?.signalId || "-"}`,
    `時間：${payload?.time || taiwanTime()}`
  ].filter(Boolean).join("\n");''',
'''    `訊號ID：${payload?.signalId || "-"}`,
    payload?.receiptUrl ? `收到確認：${payload.receiptUrl}` : "",
    `時間：${payload?.time || taiwanTime()}`
  ].filter(Boolean).join("\n");''',
    "intraday receipt link"
)

# Add receipt evidence to the operations overview without prematurely marking any rule complete.
replace_once(
'''  const outbox=await readPushOutboxSummary(env,20);''',
'''  const [outbox,receipts]=await Promise.all([readPushOutboxSummary(env,20),readPushReceiptSummary(env,50)]);''',
    "overview receipt summary"
)

replace_once(
'''    pushOutbox:outbox,
    externalValidation:{''',
'''    pushOutbox:outbox,
    pushReceipts:receipts,
    externalValidation:{''',
    "overview receipt evidence"
)

replace_once(
'''    <div class="box"><div class="muted">實際持股回填</div><div class="big">${overview.positions.knownHoldingShares}/${overview.positions.holdingCount}</div><div>有持倉標的已知股數｜${overview.positions.completeForHoldings?"完整":"待回填"}</div></div>
  </div>''',
'''    <div class="box"><div class="muted">實際持股回填</div><div class="big">${overview.positions.knownHoldingShares}/${overview.positions.holdingCount}</div><div>有持倉標的已知股數｜${overview.positions.completeForHoldings?"完整":"待回填"}</div></div>
    <div class="box"><div class="muted">手機實收確認</div><div class="big">${overview.pushReceipts.total}</div><div>盤後 ${overview.pushReceipts.dailySelection}｜盤中 ${overview.pushReceipts.intraday}</div></div>
  </div>''',
    "dashboard receipt evidence"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.2.0 signed push receipt confirmation")
