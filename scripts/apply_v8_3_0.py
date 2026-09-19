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
    'const VERSION = "8.2.1-evidence-driven-acceptance";',
    'const VERSION = "8.3.0-d1-firestore-bridge";',
    "runtime version"
)

replace_once(
'''  D1_SCHEMA_READY = true;''',
'''  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS v8_plan_archive (
    scan_date TEXT PRIMARY KEY,
    plan_date TEXT NOT NULL,
    schema_version TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    payload_sha256 TEXT NOT NULL,
    bridge_provider TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_v8_plan_archive_plan_date
    ON v8_plan_archive(plan_date)`).run();
  D1_SCHEMA_READY = true;''',
    "D1 plan archive schema"
)

anchor='''function threeMinRecords(actual) {'''
helpers=r'''function canonicalPlanJson(value) {
  const normalize=input=>{
    if(Array.isArray(input)) return input.map(normalize);
    if(input && typeof input==="object") {
      const output={};
      for(const key of Object.keys(input).sort()) output[key]=normalize(input[key]);
      return output;
    }
    return input;
  };
  return JSON.stringify(normalize(value));
}

async function sha256Hex(text) {
  const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(text)));
  return [...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,"0")).join("");
}

async function writePlanArchiveD1(payload,env,provider="D1_PRIMARY") {
  if(isTestMode(env)) return {stored:true,verified:false,simulated:true,provider:"D1_PRIMARY",reason:"TEST_MODE：不寫正式D1計畫封存"};
  if(!env?.V7_DB) return {stored:false,verified:false,provider:"D1_PRIMARY",reason:"Missing V7_DB"};
  await ensureD1Schema(env);
  const payloadJson=canonicalPlanJson(payload);
  const hash=await sha256Hex(payloadJson);
  const now=new Date().toISOString();
  const session=env.V7_DB.withSession("first-primary");
  await session.prepare(`
    INSERT INTO v8_plan_archive(scan_date,plan_date,schema_version,payload_json,payload_sha256,bridge_provider,created_at,updated_at)
    VALUES(?1,?2,?3,?4,?5,?6,?7,?7)
    ON CONFLICT(scan_date) DO UPDATE SET
      plan_date=excluded.plan_date,
      schema_version=excluded.schema_version,
      payload_json=excluded.payload_json,
      payload_sha256=excluded.payload_sha256,
      bridge_provider=excluded.bridge_provider,
      updated_at=excluded.updated_at
  `).bind(String(payload.scanDate),String(payload.planDate),String(payload.schemaVersion||"V7_PLAN_2"),payloadJson,hash,String(provider),now).run();
  const row=await session.prepare(`
    SELECT scan_date,plan_date,schema_version,payload_json,payload_sha256,bridge_provider,created_at,updated_at
    FROM v8_plan_archive WHERE scan_date=?1
  `).bind(String(payload.scanDate)).first();
  const verified=Boolean(row) && row.payload_json===payloadJson && row.payload_sha256===hash &&
    row.plan_date===String(payload.planDate) && row.schema_version===String(payload.schemaVersion||"V7_PLAN_2");
  return {stored:true,verified,provider:"D1_PRIMARY",scanDate:payload.scanDate,planDate:payload.planDate,sha256:hash,updatedAt:row?.updated_at||now};
}

async function readPlanArchiveD1(scanDate,env) {
  if(!env?.V7_DB) return null;
  try {
    await ensureD1Schema(env);
    const session=env.V7_DB.withSession("first-primary");
    const row=await session.prepare(`
      SELECT scan_date,plan_date,schema_version,payload_json,payload_sha256,bridge_provider,created_at,updated_at
      FROM v8_plan_archive WHERE scan_date=?1
    `).bind(String(scanDate)).first();
    if(!row) return null;
    return {...row,payload:JSON.parse(row.payload_json)};
  } catch { return null; }
}

function firebaseConfigured(env) {
  return Boolean(env?.FIREBASE_PROJECT_ID && env?.FIREBASE_CLIENT_EMAIL && env?.FIREBASE_PRIVATE_KEY);
}

function base64UrlBytes(bytes) {
  let binary="";
  for(const byte of bytes) binary+=String.fromCharCode(byte);
  return btoa(binary).replaceAll("+","-").replaceAll("/","_").replace(/=+$/,"");
}

function base64UrlText(text) {
  return base64UrlBytes(new TextEncoder().encode(String(text)));
}

function firebasePrivateKeyBuffer(value) {
  const pem=String(value||"").replaceAll("\\n","\n");
  const base64=pem.replace("-----BEGIN PRIVATE KEY-----","").replace("-----END PRIVATE KEY-----","").replace(/\s+/g,"");
  const binary=atob(base64);
  const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
  return bytes.buffer;
}

let FIREBASE_ACCESS_TOKEN_CACHE=null;

async function firebaseAccessToken(env) {
  if(!firebaseConfigured(env)) throw new Error("FIREBASE_NOT_CONFIGURED");
  const now=Math.floor(Date.now()/1000);
  if(FIREBASE_ACCESS_TOKEN_CACHE?.token && FIREBASE_ACCESS_TOKEN_CACHE.expiresAt>now+120) return FIREBASE_ACCESS_TOKEN_CACHE.token;
  const header=base64UrlText(JSON.stringify({alg:"RS256",typ:"JWT"}));
  const claims=base64UrlText(JSON.stringify({
    iss:String(env.FIREBASE_CLIENT_EMAIL),
    sub:String(env.FIREBASE_CLIENT_EMAIL),
    aud:"https://oauth2.googleapis.com/token",
    scope:"https://www.googleapis.com/auth/datastore",
    iat:now,
    exp:now+3600
  }));
  const unsigned=header+"."+claims;
  const key=await crypto.subtle.importKey(
    "pkcs8",firebasePrivateKeyBuffer(env.FIREBASE_PRIVATE_KEY),
    {name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["sign"]
  );
  const signature=await crypto.subtle.sign({name:"RSASSA-PKCS1-v1_5"},key,new TextEncoder().encode(unsigned));
  const assertion=unsigned+"."+base64UrlBytes(new Uint8Array(signature));
  const response=await fetchWithDeadline("https://oauth2.googleapis.com/token",{
    method:"POST",
    headers:{"content-type":"application/x-www-form-urlencoded"},
    body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion}).toString(),
    redirect:"manual"
  });
  if(!response.ok) throw new Error("FIREBASE_OAUTH_HTTP_"+response.status);
  const body=await response.json();
  if(!body?.access_token) throw new Error("FIREBASE_OAUTH_NO_TOKEN");
  FIREBASE_ACCESS_TOKEN_CACHE={token:String(body.access_token),expiresAt:now+Math.max(300,Number(body.expires_in||3600))};
  return FIREBASE_ACCESS_TOKEN_CACHE.token;
}

function firestorePlanUrl(payload,env) {
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(String(env.FIREBASE_PROJECT_ID))}/databases/(default)/documents/v8_plans/${encodeURIComponent(String(payload.scanDate))}`;
}

async function writePlanFirestore(payload,env) {
  if(isTestMode(env)) return {sent:true,verified:false,simulated:true,provider:"FIRESTORE_MIRROR",reason:"TEST_MODE：不寫Firestore"};
  if(!firebaseConfigured(env)) return {sent:false,verified:false,skipped:true,provider:"FIRESTORE_MIRROR",reason:"Firebase尚未設定"};
  try {
    const payloadJson=canonicalPlanJson(payload);
    const hash=await sha256Hex(payloadJson);
    const token=await firebaseAccessToken(env);
    const url=firestorePlanUrl(payload,env);
    const doc={fields:{
      schemaVersion:{stringValue:String(payload.schemaVersion||"V7_PLAN_2")},
      scanDate:{stringValue:String(payload.scanDate)},
      planDate:{stringValue:String(payload.planDate)},
      payloadJson:{stringValue:payloadJson},
      payloadSha256:{stringValue:hash},
      updatedAt:{timestampValue:new Date().toISOString()}
    }};
    const response=await fetchWithDeadline(url,{
      method:"PATCH",
      headers:{"content-type":"application/json",authorization:`Bearer ${token}`},
      body:JSON.stringify(doc),
      redirect:"manual"
    });
    if(!response.ok) return {sent:false,verified:false,httpStatus:response.status,provider:"FIRESTORE_MIRROR",error:"Firestore寫入HTTP失敗"};
    let readback=null;
    for(let attempt=0;attempt<3;attempt++) {
      if(attempt>0) await sleepMs(700*attempt);
      const getResponse=await fetchWithDeadline(url,{
        method:"GET",
        headers:{authorization:`Bearer ${token}`},
        redirect:"manual"
      });
      if(!getResponse.ok) {
        readback={verified:false,httpStatus:getResponse.status,reason:"Firestore讀回HTTP失敗"};
        continue;
      }
      const actual=await getResponse.json();
      const fields=actual?.fields||{};
      const actualJson=fields.payloadJson?.stringValue;
      const actualHash=fields.payloadSha256?.stringValue;
      const verified=actualJson===payloadJson && actualHash===hash &&
        fields.scanDate?.stringValue===String(payload.scanDate) &&
        fields.planDate?.stringValue===String(payload.planDate) &&
        fields.schemaVersion?.stringValue===String(payload.schemaVersion||"V7_PLAN_2");
      readback={verified,httpStatus:getResponse.status,sha256:actualHash||null,
        reason:verified?"Firestore完整payload精確讀回一致":"Firestore讀回payload/hash不一致"};
      if(verified) break;
    }
    return {sent:true,verified:readback?.verified===true,httpStatus:response.status,provider:"FIRESTORE_MIRROR",
      sha256:hash,readback,verificationNote:readback?.reason||"Firestore尚未完成讀回"};
  } catch {
    return {sent:false,verified:false,provider:"FIRESTORE_MIRROR",error:"Firestore傳輸或OAuth驗證失敗"};
  }
}

async function persistPlanBridge(payload,env) {
  const provider=firebaseConfigured(env) ? "D1_FIRESTORE" : "D1_THREEMIN_COMPAT";
  const d1=await writePlanArchiveD1(payload,env,provider);
  if(isTestMode(env)) return {sent:true,verified:false,simulated:true,provider,d1,reason:"TEST_MODE：不執行真實外部鏡像"};
  if(!d1.verified) return {sent:false,verified:false,simulated:false,provider,d1,error:"D1主計畫封存未精確讀回"};
  if(firebaseConfigured(env)) {
    const firebase=await writePlanFirestore(payload,env);
    return {
      sent:firebase.sent===true,
      verified:firebase.verified===true && d1.verified===true,
      simulated:false,
      provider,
      d1,
      firebase,
      readback:firebase.readback || null,
      httpStatus:firebase.httpStatus ?? null,
      verificationNote:firebase.verificationNote || firebase.error || null,
      legacyThreeMin:false
    };
  }
  const threeMin=await sendTo3Min(payload,env);
  return {
    ...threeMin,
    provider,
    d1,
    threeMin,
    legacyThreeMin:true,
    sent:threeMin.sent===true,
    verified:threeMin.verified===true && d1.verified===true
  };
}

function threeMinRecords(actual) {'''
replace_once(anchor,helpers,"D1/Firestore bridge helpers")

replace_once(
'''    bridge = await sendTo3Min(buildThreeMinPayload(marketDate,totalCapital,stocks),env);''',
'''    bridge = await persistPlanBridge(buildThreeMinPayload(marketDate,totalCapital,stocks),env);''',
    "after-market bridge switch"
)

replace_once(
'''    threeMin: bridge,
    threeMinPayload: buildThreeMinPayload(marketDate,totalCapital,stocks),
    dailyReport: report,
    pipeline: {
      scope: "資料選股、匯入與通知傳輸驗證；不代表30條全部已實作或手機已收到",
      selectionCompleted: true,
      configAccepted: saved.ok === true,
      configVerified: saved.verified === true,
      threeMinAccepted: bridge.sent === true && bridge.simulated !== true,
      threeMinVerified: bridge.verified === true && bridge.simulated !== true,
      dailyReportAccepted: report.sent === true && report.simulated !== true,
      complete: !dryRun && saved.verified === true && bridge.verified === true && bridge.simulated !== true && report.sent === true && report.simulated !== true
    }''',
'''    planBridge: bridge,
    planPayload: buildThreeMinPayload(marketDate,totalCapital,stocks),
    threeMin: bridge.legacyThreeMin===true ? bridge.threeMin : {sent:false,verified:false,simulated:false,skipped:true,reason:"已切換D1＋Firestore正式橋接"},
    threeMinPayload: buildThreeMinPayload(marketDate,totalCapital,stocks),
    dailyReport: report,
    pipeline: {
      scope: "資料選股、匯入與通知傳輸驗證；不代表30條全部已實作或手機已收到",
      selectionCompleted: true,
      configAccepted: saved.ok === true,
      configVerified: saved.verified === true,
      externalPlanProvider: bridge.provider || null,
      externalPlanAccepted: bridge.sent === true && bridge.simulated !== true,
      externalPlanVerified: bridge.verified === true && bridge.simulated !== true,
      threeMinAccepted: bridge.legacyThreeMin===true ? bridge.sent === true && bridge.simulated !== true : null,
      threeMinVerified: bridge.legacyThreeMin===true ? bridge.verified === true && bridge.simulated !== true : null,
      firebaseAccepted: bridge.provider==="D1_FIRESTORE" ? bridge.firebase?.sent===true : null,
      firebaseVerified: bridge.provider==="D1_FIRESTORE" ? bridge.firebase?.verified===true : null,
      d1PlanVerified: bridge.d1?.verified===true,
      dailyReportAccepted: report.sent === true && report.simulated !== true,
      complete: !dryRun && saved.verified === true && bridge.verified === true && bridge.simulated !== true && report.sent === true && report.simulated !== true
    }''',
    "generic plan bridge summary"
)

replace_once(
'''          proof:bridge.verified===true && bridge.sent===true && bridge.simulated!==true ? "本交易日完整V7_PLAN_2已真實POST並由既有3Min唯讀來源精確讀回" : "等待本交易日正式掃描完成真實POST＋外部精確讀回"''',
'''          proof:bridge.verified===true && bridge.sent===true && bridge.simulated!==true
            ? (bridge.provider==="D1_FIRESTORE" ? "本交易日完整V7_PLAN_2已寫入D1主封存並由Firestore外部鏡像精確讀回" : "本交易日完整V7_PLAN_2已真實POST並由既有3Min唯讀來源精確讀回")
            : "等待本交易日正式掃描完成D1主封存＋外部精確讀回"''',
    "requirement26 provider-aware proof"
)

replace_once(
'''      bindings: { kv: !!env.STOCKS_KV, d1: !!env.V7_DB },
      readiness: { quote: !!env.FUGLE_API_KEY, phonePush: !!env.PUSH_WEBHOOK_URL, threeMin: !!env.THREEMIN_API_URL,
        threeMinReadback: !!env.THREEMIN_VERIFY_URL }, requirements30Complete: false, monitorUrl: url.origin }, 200, true);''',
'''      bindings: { kv: !!env.STOCKS_KV, d1: !!env.V7_DB },
      readiness: { quote: !!env.FUGLE_API_KEY, phonePush: !!env.PUSH_WEBHOOK_URL,
        planStorageMode: firebaseConfigured(env) ? "D1_FIRESTORE" : "D1_THREEMIN_COMPAT",
        firebase: firebaseConfigured(env),
        threeMin: !!env.THREEMIN_API_URL, threeMinReadback: !!env.THREEMIN_VERIFY_URL },
      requirements30Complete: false, monitorUrl: url.origin }, 200, true);''',
    "version storage readiness"
)

version_route='''    // 只讀既有3Min紀錄並保存驗收證據；不重選、不重送、不更動交易計畫。'''
storage_route=r'''    if(url.pathname==="/api/storage/status") {
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      const latest=env.STOCKS_KV ? await env.STOCKS_KV.get(LAST_SCAN_KEY,"json") : null;
      const archived=latest?.scanDate ? await readPlanArchiveD1(latest.scanDate,env) : null;
      return json({
        version:VERSION,
        mode:firebaseConfigured(env) ? "D1_FIRESTORE" : "D1_THREEMIN_COMPAT",
        d1:{configured:Boolean(env.V7_DB),latestArchived:Boolean(archived),scanDate:archived?.scan_date||null,sha256:archived?.payload_sha256||null},
        firebase:{configured:firebaseConfigured(env),requiredSecrets:["FIREBASE_PROJECT_ID","FIREBASE_CLIENT_EMAIL","FIREBASE_PRIVATE_KEY"]},
        threeMin:{compatibilityMode:!firebaseConfigured(env),configured:Boolean(env.THREEMIN_API_URL && env.THREEMIN_VERIFY_URL)},
        noSecretsExposed:true,noPlanChanges:true,noPush:true,noTrade:true
      },200,true);
    }

    if(url.pathname==="/api/storage/migrate-current") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="POST") return json({error:"Method not allowed"},405,true);
      if(!env.STOCKS_KV) return json({error:"Missing STOCKS_KV"},503,true);
      const latest=await env.STOCKS_KV.get(LAST_SCAN_KEY,"json");
      if(!latest || latest.dryRun===true || !latest.scanDate || !Array.isArray(latest.stocks)) {
        return json({ok:false,error:"沒有可遷移的正式盤後計畫",noPlanChanges:true,noPush:true,noTrade:true},409,true);
      }
      const payload=latest.planPayload || latest.threeMinPayload || buildThreeMinPayload(latest.scanDate,latest.totalCapital,latest.stocks,false);
      const d1=await writePlanArchiveD1(payload,env,firebaseConfigured(env)?"D1_FIRESTORE":"D1_THREEMIN_COMPAT");
      if(!firebaseConfigured(env)) {
        return json({ok:d1.verified===true,migrationReady:false,mode:"D1_THREEMIN_COMPAT",d1,
          firebase:{configured:false,requiredSecrets:["FIREBASE_PROJECT_ID","FIREBASE_CLIENT_EMAIL","FIREBASE_PRIVATE_KEY"]},
          noPlanChanges:true,noPush:true,noThreeMinWrite:true,noTrade:true},428,true);
      }
      const firebase=await writePlanFirestore(payload,env);
      return json({ok:d1.verified===true && firebase.verified===true,migrationReady:d1.verified===true && firebase.verified===true,
        mode:"D1_FIRESTORE",d1,firebase,noPlanChanges:true,noPush:true,noThreeMinWrite:true,noTrade:true},
        d1.verified===true && firebase.verified===true ? 200 : 502,true);
    }

''' + version_route
replace_once(version_route,storage_route,"storage migration routes")

# V8.2.1 evidence logic must treat the new generic plan bridge as valid Rule 26 evidence.
replace_once(
'''  if(latest?.diagnostics?.requirements30?.requirement26?.complete===true ||
     (latest?.pipeline?.threeMinAccepted===true && latest?.pipeline?.threeMinVerified===true)) normalized.delete(26);''',
'''  if(latest?.diagnostics?.requirements30?.requirement26?.complete===true ||
     (latest?.pipeline?.externalPlanAccepted===true && latest?.pipeline?.externalPlanVerified===true) ||
     (latest?.pipeline?.threeMinAccepted===true && latest?.pipeline?.threeMinVerified===true)) normalized.delete(26);''',
    "rule26 generic bridge evidence"
)

replace_once(
'''  const basePipeline=latest?.pipeline?.selectionCompleted===true &&
    latest?.pipeline?.configVerified===true &&
    latest?.pipeline?.threeMinVerified===true &&
    latest?.pipeline?.dailyReportAccepted===true &&
    latest?.pipeline?.complete===true;''',
'''  const basePipeline=latest?.pipeline?.selectionCompleted===true &&
    latest?.pipeline?.configVerified===true &&
    (latest?.pipeline?.externalPlanVerified===true || latest?.pipeline?.threeMinVerified===true) &&
    latest?.pipeline?.dailyReportAccepted===true &&
    latest?.pipeline?.complete===true;''',
    "rule29 generic bridge evidence"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.3.0 D1 + Firestore migration bridge")
