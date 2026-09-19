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
    'const VERSION = "8.3.0-d1-firestore-bridge";',
    'const VERSION = "8.3.1-storage-health";',
    "runtime version"
)

replace_once(
'''      threeMin:{
        accepted:latest?.pipeline?.threeMinAccepted===true,
        verified:latest?.pipeline?.threeMinVerified===true,
        httpStatus:latest?.threeMin?.httpStatus ?? null
      },''',
'''      externalPlan:{
        provider:latest?.pipeline?.externalPlanProvider || (latest?.pipeline?.threeMinVerified===true ? "D1_THREEMIN_COMPAT" : null),
        accepted:latest?.pipeline?.externalPlanAccepted===true || latest?.pipeline?.threeMinAccepted===true,
        verified:latest?.pipeline?.externalPlanVerified===true || latest?.pipeline?.threeMinVerified===true,
        d1Verified:latest?.pipeline?.d1PlanVerified===true || latest?.planBridge?.d1?.verified===true,
        firebaseAccepted:latest?.pipeline?.firebaseAccepted===true,
        firebaseVerified:latest?.pipeline?.firebaseVerified===true,
        legacyThreeMinVerified:latest?.pipeline?.threeMinVerified===true
      },
      threeMin:{
        accepted:latest?.pipeline?.threeMinAccepted===true,
        verified:latest?.pipeline?.threeMinVerified===true,
        httpStatus:latest?.threeMin?.httpStatus ?? null
      },''',
    "system overview external plan"
)

replace_once(
'''      threeMinConfigured:Boolean(env.THREEMIN_API_URL),
      threeMinReadbackConfigured:Boolean(env.THREEMIN_VERIFY_URL),
      kvConfigured:Boolean(env.STOCKS_KV),
      d1Configured:Boolean(env.V7_DB)''',
'''      planStorageMode:firebaseConfigured(env)?"D1_FIRESTORE":"D1_THREEMIN_COMPAT",
      firebaseConfigured:firebaseConfigured(env),
      threeMinConfigured:Boolean(env.THREEMIN_API_URL),
      threeMinReadbackConfigured:Boolean(env.THREEMIN_VERIFY_URL),
      kvConfigured:Boolean(env.STOCKS_KV),
      d1Configured:Boolean(env.V7_DB)''',
    "system overview storage integrations"
)

replace_once(
'''    <div class="box"><div class="muted">3Min</div><div class="big ${overview.latestPlan.threeMin.verified?"good":"bad"}">${overview.latestPlan.threeMin.verified?"已驗證":"待驗證"}</div><div>accepted=${pipeline.threeMinAccepted===true}｜readback=${pipeline.threeMinVerified===true}</div></div>''',
'''    <div class="box"><div class="muted">計畫主存＋外部鏡像</div><div class="big ${overview.latestPlan.externalPlan.verified?"good":"bad"}">${overview.latestPlan.externalPlan.verified?"已驗證":"待驗證"}</div><div>${h(overview.latestPlan.externalPlan.provider||overview.integrations.planStorageMode)}｜D1=${overview.latestPlan.externalPlan.d1Verified?"✅":"⏳"}｜Firebase=${overview.integrations.firebaseConfigured?(overview.latestPlan.externalPlan.firebaseVerified?"✅":"⏳"):"待設定"}</div></div>''',
    "dashboard storage bridge box"
)

replace_once(
'''    3Min ${pipeline.threeMinVerified===true?"✅":"⏳"}｜''',
'''    計畫鏡像 ${(pipeline.externalPlanVerified===true || pipeline.threeMinVerified===true)?"✅":"⏳"}｜''',
    "dashboard generic plan chain"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.3.1 generic storage health")
