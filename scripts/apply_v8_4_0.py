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
    'const VERSION = "8.3.1-storage-health";',
    'const VERSION = "8.4.0-github-encrypted-mirror";',
    "runtime version"
)

replace_once(
'''  D1_SCHEMA_READY = true;''',
'''  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS v8_external_mirror_acceptance (
    scan_date TEXT PRIMARY KEY,
    provider TEXT NOT NULL,
    payload_sha256 TEXT NOT NULL,
    external_ref TEXT NOT NULL,
    mirror_path TEXT NOT NULL,
    verified_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_v8_external_mirror_verified
    ON v8_external_mirror_acceptance(verified_at)`).run();
  D1_SCHEMA_READY = true;''',
    "GitHub mirror acceptance schema"
)

anchor='''function threeMinRecords(actual) {'''
helpers=r'''const GITHUB_MIRROR_PROVIDER="D1_GITHUB_ENCRYPTED";

async function readGithubMirrorAcceptance(scanDate,env) {
  if(!env?.V7_DB || !scanDate) return null;
  try {
    await ensureD1Schema(env);
    return await env.V7_DB.withSession("first-primary").prepare(`
      SELECT scan_date,provider,payload_sha256,external_ref,mirror_path,verified_at,updated_at
      FROM v8_external_mirror_acceptance WHERE scan_date=?1
    `).bind(String(scanDate)).first();
  } catch { return null; }
}

async function recordGithubMirrorAcceptance({scanDate,payloadSha256,commitSha,mirrorPath},env) {
  if(!env?.V7_DB) throw new Error("Missing V7_DB");
  await ensureD1Schema(env);
  const archive=await readPlanArchiveD1(scanDate,env);
  if(!archive) throw new Error("D1計畫封存不存在");
  if(String(archive.payload_sha256)!==String(payloadSha256)) throw new Error("外部鏡像hash與D1封存不一致");
  if(!/^[0-9a-f]{40}$/i.test(String(commitSha||""))) throw new Error("GitHub commit SHA無效");
  if(!/^external-mirror\/[A-Za-z0-9_.\/-]+\.enc\.json$/.test(String(mirrorPath||""))) throw new Error("GitHub mirror path無效");
  const now=new Date().toISOString();
  const session=env.V7_DB.withSession("first-primary");
  await session.prepare(`
    INSERT INTO v8_external_mirror_acceptance(scan_date,provider,payload_sha256,external_ref,mirror_path,verified_at,updated_at)
    VALUES(?1,?2,?3,?4,?5,?6,?6)
    ON CONFLICT(scan_date) DO UPDATE SET
      provider=excluded.provider,
      payload_sha256=excluded.payload_sha256,
      external_ref=excluded.external_ref,
      mirror_path=excluded.mirror_path,
      verified_at=excluded.verified_at,
      updated_at=excluded.updated_at
  `).bind(String(scanDate),GITHUB_MIRROR_PROVIDER,String(payloadSha256),String(commitSha),String(mirrorPath),now).run();
  const readback=await readGithubMirrorAcceptance(scanDate,env);
  if(!readback || readback.payload_sha256!==String(payloadSha256) || readback.external_ref!==String(commitSha)) {
    throw new Error("GitHub鏡像驗收D1讀回不一致");
  }
  return readback;
}

async function persistPlanBridge(payload,env) {
  const provider=GITHUB_MIRROR_PROVIDER;
  const d1=await writePlanArchiveD1(payload,env,provider);
  if(isTestMode(env)) return {sent:true,verified:false,simulated:true,provider,d1,reason:"TEST_MODE：不執行真實外部GitHub鏡像"};
  if(!d1.verified) return {sent:false,verified:false,simulated:false,provider,d1,error:"D1主計畫封存未精確讀回"};
  const accepted=await readGithubMirrorAcceptance(payload.scanDate,env);
  const verified=Boolean(accepted && accepted.payload_sha256===d1.sha256);
  return {
    sent:verified,
    verified,
    simulated:false,
    provider,
    d1,
    pendingExternalMirror:!verified,
    github:verified ? {
      verified:true,
      commitSha:accepted.external_ref,
      mirrorPath:accepted.mirror_path,
      verifiedAt:accepted.verified_at,
      sha256:accepted.payload_sha256
    } : null,
    legacyThreeMin:false,
    verificationNote:verified ? "D1主封存＋GitHub加密鏡像已精確驗證" : "D1主封存完成，等待GitHub加密鏡像外部讀回"
  };
}

function threeMinRecords(actual) {'''
replace_once(anchor,helpers,"GitHub encrypted mirror helpers and bridge override")

replace_once(
'''async function persistPlanBridge(payload,env) {
  const provider=firebaseConfigured(env) ? "D1_FIRESTORE" : "D1_THREEMIN_COMPAT";''',
'''async function persistLegacyPlanBridgeV830(payload,env) {
  const provider=firebaseConfigured(env) ? "D1_FIRESTORE" : "D1_THREEMIN_COMPAT";''',
    "disable legacy v8.3 persistPlanBridge"
)

replace_once(
'''        planStorageMode: firebaseConfigured(env) ? "D1_FIRESTORE" : "D1_THREEMIN_COMPAT",
        firebase: firebaseConfigured(env),''',
'''        planStorageMode: GITHUB_MIRROR_PROVIDER,
        githubEncryptedMirror: true,
        firebase: firebaseConfigured(env),''',
    "version storage mode"
)

replace_once(
'''      const archived=latest?.scanDate ? await readPlanArchiveD1(latest.scanDate,env) : null;
      return json({
        version:VERSION,
        mode:firebaseConfigured(env) ? "D1_FIRESTORE" : "D1_THREEMIN_COMPAT",
        d1:{configured:Boolean(env.V7_DB),latestArchived:Boolean(archived),scanDate:archived?.scan_date||null,sha256:archived?.payload_sha256||null},
        firebase:{configured:firebaseConfigured(env),requiredSecrets:["FIREBASE_PROJECT_ID","FIREBASE_CLIENT_EMAIL","FIREBASE_PRIVATE_KEY"]},
        threeMin:{compatibilityMode:!firebaseConfigured(env),configured:Boolean(env.THREEMIN_API_URL && env.THREEMIN_VERIFY_URL)},
        noSecretsExposed:true,noPlanChanges:true,noPush:true,noTrade:true
      },200,true);''',
'''      const archived=latest?.scanDate ? await readPlanArchiveD1(latest.scanDate,env) : null;
      const github=latest?.scanDate ? await readGithubMirrorAcceptance(latest.scanDate,env) : null;
      return json({
        version:VERSION,
        mode:GITHUB_MIRROR_PROVIDER,
        d1:{configured:Boolean(env.V7_DB),latestArchived:Boolean(archived),scanDate:archived?.scan_date||null,sha256:archived?.payload_sha256||null},
        github:{configured:true,encrypted:true,verified:Boolean(github && archived && github.payload_sha256===archived.payload_sha256),
          scanDate:github?.scan_date||null,commitSha:github?.external_ref||null,mirrorPath:github?.mirror_path||null,verifiedAt:github?.verified_at||null},
        firebase:{configured:firebaseConfigured(env),migrationRequired:false},
        threeMin:{compatibilityMode:false,configured:Boolean(env.THREEMIN_API_URL && env.THREEMIN_VERIFY_URL),active:false},
        noSecretsExposed:true,noPlanChanges:true,noPush:true,noTrade:true
      },200,true);''',
    "GitHub-aware storage status"
)

replace_once(
'''      const d1=await writePlanArchiveD1(payload,env,firebaseConfigured(env)?"D1_FIRESTORE":"D1_THREEMIN_COMPAT");
      if(!firebaseConfigured(env)) {
        return json({ok:d1.verified===true,migrationReady:false,mode:"D1_THREEMIN_COMPAT",d1,
          firebase:{configured:false,requiredSecrets:["FIREBASE_PROJECT_ID","FIREBASE_CLIENT_EMAIL","FIREBASE_PRIVATE_KEY"]},
          noPlanChanges:true,noPush:true,noThreeMinWrite:true,noTrade:true},428,true);
      }
      const firebase=await writePlanFirestore(payload,env);
      return json({ok:d1.verified===true && firebase.verified===true,migrationReady:d1.verified===true && firebase.verified===true,
        mode:"D1_FIRESTORE",d1,firebase,noPlanChanges:true,noPush:true,noThreeMinWrite:true,noTrade:true},
        d1.verified===true && firebase.verified===true ? 200 : 502,true);''',
'''      const d1=await writePlanArchiveD1(payload,env,GITHUB_MIRROR_PROVIDER);
      const github=await readGithubMirrorAcceptance(payload.scanDate,env);
      const ready=d1.verified===true && github?.payload_sha256===d1.sha256;
      return json({ok:d1.verified===true,migrationReady:ready,mode:GITHUB_MIRROR_PROVIDER,d1,
        github:{encrypted:true,verified:ready,commitSha:github?.external_ref||null,mirrorPath:github?.mirror_path||null},
        noPlanChanges:true,noPush:true,noThreeMinWrite:true,noTrade:true},ready?200:428,true);''',
    "GitHub migration readiness"
)

route_anchor='''    if(url.pathname==="/api/storage/migrate-current") {'''
new_routes=r'''    if(url.pathname==="/api/storage/export-current") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      if(!env.STOCKS_KV || !env.V7_DB) return json({error:"Storage bindings unavailable"},503,true);
      const latest=await env.STOCKS_KV.get(LAST_SCAN_KEY,"json");
      if(!latest || latest.dryRun===true || !latest.scanDate) return json({error:"沒有可匯出的正式盤後計畫"},409,true);
      const payload=latest.planPayload || latest.threeMinPayload || buildThreeMinPayload(latest.scanDate,latest.totalCapital,latest.stocks,false);
      const d1=await writePlanArchiveD1(payload,env,GITHUB_MIRROR_PROVIDER);
      if(!d1.verified) return json({error:"D1主封存尚未精確驗證"},502,true);
      const payloadJson=canonicalPlanJson(payload);
      return json({ok:true,provider:GITHUB_MIRROR_PROVIDER,scanDate:payload.scanDate,planDate:payload.planDate,
        schemaVersion:payload.schemaVersion,payloadJson,sha256:d1.sha256,noPlanChanges:true,noPush:true,noThreeMinWrite:true,noTrade:true},200,true);
    }

    if(url.pathname==="/api/storage/github-accept") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="POST") return json({error:"Method not allowed"},405,true);
      if(!env.STOCKS_KV || !env.V7_DB) return json({error:"Storage bindings unavailable"},503,true);
      try {
        const body=await request.json();
        const scanDate=String(body?.scanDate||"");
        const payloadSha256=String(body?.sha256||"").toLowerCase();
        const commitSha=String(body?.commitSha||"").toLowerCase();
        const mirrorPath=String(body?.mirrorPath||"external-mirror/latest.enc.json");
        if(!/^\d{4}-\d{2}-\d{2}$/.test(scanDate) || !/^[0-9a-f]{64}$/.test(payloadSha256)) throw new Error("鏡像驗收欄位格式錯誤");
        const accepted=await recordGithubMirrorAcceptance({scanDate,payloadSha256,commitSha,mirrorPath},env);
        const latest=await env.STOCKS_KV.get(LAST_SCAN_KEY,"json");
        let latestUpdated=false;
        if(latest?.scanDate===scanDate) {
          const archive=await readPlanArchiveD1(scanDate,env);
          const planBridge={...(latest.planBridge||{}),sent:true,verified:true,simulated:false,provider:GITHUB_MIRROR_PROVIDER,
            pendingExternalMirror:false,d1:{...(latest.planBridge?.d1||{}),verified:true,sha256:archive?.payload_sha256||payloadSha256},
            github:{verified:true,commitSha,mirrorPath,verifiedAt:accepted.verified_at,sha256:payloadSha256},
            legacyThreeMin:false,verificationNote:"GitHub加密鏡像已由獨立raw readback解密並與D1 canonical hash精確比對"};
          const previousRequirements=latest.diagnostics?.requirements30||{};
          const previousRules=Array.isArray(previousRequirements.incompleteRules)?previousRequirements.incompleteRules:[17,18,19,27,28,29];
          const incompleteRules=previousRules.filter(rule=>Number(rule)!==26);
          const requirement26={complete:true,scanDate,planDate:latest.planPayload?.planDate||latest.threeMinPayload?.planDate||null,
            schemaVersion:latest.planPayload?.schemaVersion||latest.threeMinPayload?.schemaVersion||"V7_PLAN_2",
            selectedCount:Number(latest.selectedCount||0),externalPostAccepted:true,exactReadbackVerified:true,verifiedAt:accepted.verified_at,
            recordId:commitSha,proof:"D1主封存＋GitHub AES-256-GCM加密鏡像已由外部raw commit精確讀回"};
          const pipeline={...(latest.pipeline||{}),externalPlanProvider:GITHUB_MIRROR_PROVIDER,externalPlanAccepted:true,
            externalPlanVerified:true,d1PlanVerified:true,threeMinAccepted:null,threeMinVerified:null,
            firebaseAccepted:null,firebaseVerified:null,
            complete:latest.pipeline?.configVerified===true && latest.pipeline?.dailyReportAccepted===true};
          const updated={...latest,version:VERSION,planBridge,pipeline,
            diagnostics:{...latest.diagnostics,requirements30:{...previousRequirements,incompleteRules,requirement26}}};
          await env.STOCKS_KV.put(LAST_SCAN_KEY,JSON.stringify(updated),{expirationTtl:14*86400});
          const verify=await env.STOCKS_KV.get(LAST_SCAN_KEY,"json");
          if(verify?.planBridge?.github?.commitSha!==commitSha || verify?.pipeline?.externalPlanVerified!==true) throw new Error("最新計畫鏡像驗收KV讀回失敗");
          latestUpdated=true;
        }
        return json({ok:true,verified:true,provider:GITHUB_MIRROR_PROVIDER,scanDate,sha256:payloadSha256,commitSha,mirrorPath,
          latestUpdated,noPlanChanges:true,noPush:true,noThreeMinWrite:true,noTrade:true},200,true);
      } catch(error) {
        return json({ok:false,error:String(error),noPlanChanges:true,noPush:true,noThreeMinWrite:true,noTrade:true},400,true);
      }
    }

''' + route_anchor
replace_once(route_anchor,new_routes,"GitHub mirror export/accept routes")

replace_once(
'''        firebaseAccepted:latest?.pipeline?.firebaseAccepted===true,
        firebaseVerified:latest?.pipeline?.firebaseVerified===true,
        legacyThreeMinVerified:latest?.pipeline?.threeMinVerified===true''',
'''        githubAccepted:latest?.pipeline?.externalPlanProvider===GITHUB_MIRROR_PROVIDER && latest?.pipeline?.externalPlanAccepted===true,
        githubVerified:latest?.pipeline?.externalPlanProvider===GITHUB_MIRROR_PROVIDER && latest?.pipeline?.externalPlanVerified===true,
        firebaseAccepted:latest?.pipeline?.firebaseAccepted===true,
        firebaseVerified:latest?.pipeline?.firebaseVerified===true,
        legacyThreeMinVerified:latest?.pipeline?.threeMinVerified===true''',
    "overview GitHub plan state"
)

replace_once(
'''      planStorageMode:firebaseConfigured(env)?"D1_FIRESTORE":"D1_THREEMIN_COMPAT",
      firebaseConfigured:firebaseConfigured(env),''',
'''      planStorageMode:GITHUB_MIRROR_PROVIDER,
      githubEncryptedMirror:true,
      firebaseConfigured:firebaseConfigured(env),''',
    "overview active storage mode"
)

replace_once(
'''<div>${h(overview.latestPlan.externalPlan.provider||overview.integrations.planStorageMode)}｜D1=${overview.latestPlan.externalPlan.d1Verified?"✅":"⏳"}｜Firebase=${overview.integrations.firebaseConfigured?(overview.latestPlan.externalPlan.firebaseVerified?"✅":"⏳"):"待設定"}</div></div>''',
'''<div>${h(overview.latestPlan.externalPlan.provider||overview.integrations.planStorageMode)}｜D1=${overview.latestPlan.externalPlan.d1Verified?"✅":"⏳"}｜GitHub=${overview.latestPlan.externalPlan.githubVerified?"✅":"⏳"}</div></div>''',
    "dashboard GitHub mirror label"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.4.0 GitHub encrypted external mirror")
