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
    'const VERSION = "8.0.1-requirement11-q4-eps";',
    'const VERSION = "8.0.2-requirement26-acceptance";',
    "runtime version",
)

replace_once(
'''      const audit={...verification,checkedAt:new Date().toISOString()};
      const updated={...latest,threeMin:{...latest.threeMin,verified:verification.verified===true,readback:audit},
        pipeline:{...latest.pipeline,threeMinVerified:verification.verified===true,complete:latest.pipeline?.configVerified===true && verification.verified===true && latest.pipeline?.dailyReportAccepted===true}};
      await env.STOCKS_KV.put(LAST_SCAN_KEY,JSON.stringify(updated),{expirationTtl:14*86400});''',
'''      const audit={...verification,checkedAt:new Date().toISOString()};
      const requirement26Complete=verification.verified===true &&
        latest.threeMin?.sent===true && latest.threeMin?.simulated!==true &&
        latest.threeMinPayload?.schemaVersion==="V7_PLAN_2" &&
        latest.threeMinPayload?.scanDate===latest.scanDate &&
        Array.isArray(latest.threeMinPayload?.stocks);
      const previousRequirements=latest.diagnostics?.requirements30 || {};
      const previousRules=Array.isArray(previousRequirements.incompleteRules) ? previousRequirements.incompleteRules : [17,18,19,26,27,28,29];
      const incompleteRules=requirement26Complete ? previousRules.filter(rule=>rule!==26) : previousRules.includes(26) ? previousRules : [...previousRules,26];
      const requirement26={
        complete:requirement26Complete,
        scanDate:latest.scanDate,
        planDate:latest.threeMinPayload?.planDate || null,
        schemaVersion:latest.threeMinPayload?.schemaVersion || null,
        selectedCount:Array.isArray(latest.threeMinPayload?.stocks) ? latest.threeMinPayload.stocks.length : null,
        externalPostAccepted:latest.threeMin?.sent===true && latest.threeMin?.simulated!==true,
        exactReadbackVerified:verification.verified===true,
        verifiedAt:audit.checkedAt,
        recordId:verification.recordId || null,
        proof:requirement26Complete ? "本交易日完整V7_PLAN_2已真實POST並由既有3Min唯讀來源精確讀回" : "尚缺本交易日完整payload真實POST或外部精確讀回"
      };
      const updated={...latest,
        diagnostics:{...latest.diagnostics,requirements30:{...previousRequirements,complete:false,incompleteRules,requirement26}},
        threeMin:{...latest.threeMin,verified:verification.verified===true,readback:audit},
        pipeline:{...latest.pipeline,threeMinVerified:verification.verified===true,complete:latest.pipeline?.configVerified===true && verification.verified===true && latest.pipeline?.dailyReportAccepted===true}};
      await env.STOCKS_KV.put(LAST_SCAN_KEY,JSON.stringify(updated),{expirationTtl:14*86400});''',
    "3Min readback acceptance persistence",
)

replace_once(
'''    requirements30: {complete:false, incompleteRules:[17,18,19,26,27,28,29], record:"REQUIREMENTS_30.md",pendingAcceptance:"第11項財報已完成Q1-Q4單季EPS、YoY/QoQ、營收/毛利/營益、估值與官方公告催化查核；其餘待完整payload外部寫入、盤中真實訊號／手機實收與外部交叉驗證"},''',
'''    requirements30: {
      complete:false,
      incompleteRules:[17,18,19,26,27,28,29],
      record:"REQUIREMENTS_30.md",
      requirement26:{complete:false,proof:"等待本交易日正式掃描完成完整V7_PLAN_2真實POST＋外部精確讀回"},
      pendingAcceptance:"第11項財報已完成；第26項在本交易日完整V7_PLAN_2真實POST＋外部精確讀回後自動移除；其餘待盤中真實訊號／手機實收與外部交叉驗證"
    },''',
    "requirement 26 base diagnostics",
)

replace_once(
'''    diagnostics: {
      ...scan.diagnostics,
      enrichmentAvailable: enrichment.available,''',
'''    diagnostics: {
      ...scan.diagnostics,
      requirements30:{
        ...scan.diagnostics?.requirements30,
        complete:false,
        incompleteRules:(bridge.verified===true && bridge.sent===true && bridge.simulated!==true ? [17,18,19,27,28,29] : [17,18,19,26,27,28,29]),
        requirement26:{
          complete:bridge.verified===true && bridge.sent===true && bridge.simulated!==true,
          scanDate:marketDate,
          planDate:buildThreeMinPayload(marketDate,totalCapital,stocks).planDate,
          schemaVersion:"V7_PLAN_2",
          selectedCount:stocks.length,
          externalPostAccepted:bridge.sent===true && bridge.simulated!==true,
          exactReadbackVerified:bridge.verified===true && bridge.simulated!==true,
          verifiedAt:bridge.verified===true && bridge.simulated!==true ? new Date().toISOString() : null,
          recordId:bridge.readback?.recordId || null,
          proof:bridge.verified===true && bridge.sent===true && bridge.simulated!==true ? "本交易日完整V7_PLAN_2已真實POST並由既有3Min唯讀來源精確讀回" : "等待本交易日正式掃描完成真實POST＋外部精確讀回"
        }
      },
      enrichmentAvailable: enrichment.available,''',
    "requirement 26 final scan diagnostics",
)

path.write_text(text, encoding="utf-8")
print("Applied V8.0.2 requirement 26 acceptance tracking")
