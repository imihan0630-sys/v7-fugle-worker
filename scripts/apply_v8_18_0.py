"""Additive decision-cutoff provenance for the immutable C1 parent. No Formal decision impact."""
from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected exactly 1 match, found {count}")
    text=text.replace(old,new,1)

replace_once(
    'const VERSION = "8.17.0-shadow-cohort-membership";',
    'const VERSION = "8.18.0-decision-cutoff-provenance";',
    "version"
)

replace_once(
    'function buildC1PopulationReceipt(featureRows,todayRows,marketState,sectorStats,formalResults,selected,scanDate,zeroPickContext=null) {',
    'function buildC1PopulationReceipt(featureRows,todayRows,marketState,sectorStats,formalResults,selected,scanDate,zeroPickContext=null,decisionCutoffAt=null) {',
    "C1 builder cutoff argument"
)

replace_once(
'''  const decisionAt=new Date().toISOString();
  const generationId=`C1:${scanDate}:${crypto.randomUUID()}`;''',
'''  const decisionAt=new Date().toISOString();
  const cutoffMs=decisionCutoffAt===null?null:Date.parse(decisionCutoffAt);
  const decisionMs=Date.parse(decisionAt);
  if(decisionCutoffAt!==null&&(!Number.isFinite(cutoffMs)||cutoffMs>decisionMs))
    throw new Error("C1_DECISION_CUTOFF_INVALID");
  const normalizedDecisionCutoffAt=decisionCutoffAt===null?null:new Date(cutoffMs).toISOString();
  if(normalizedDecisionCutoffAt!==null&&normalizedDecisionCutoffAt.slice(0,10)!==String(scanDate))
    throw new Error("C1_DECISION_CUTOFF_SESSION_MISMATCH");
  const generationId=`C1:${scanDate}:${crypto.randomUUID()}`;''',
    "validate decision cutoff"
)

replace_once(
'''    schemaVersion:C1_POPULATION_SCHEMA_VERSION,generationId,sourceMainSha:C1_SOURCE_MAIN_SHA,
    effectiveRuntimeVersion:VERSION,sessionDate:String(scanDate),decisionAt,capturedAt:decisionAt,''',
'''    schemaVersion:C1_POPULATION_SCHEMA_VERSION,generationId,sourceMainSha:C1_SOURCE_MAIN_SHA,
    effectiveRuntimeVersion:VERSION,sessionDate:String(scanDate),
    decisionCutoffAt:normalizedDecisionCutoffAt,
    decisionCutoffProvenance:normalizedDecisionCutoffAt===null?"MISSING_FIXTURE_OR_LEGACY":"POST_FINAL_FORMAL_INPUT_PRE_SELECTOR_RUNTIME_STAMP_V0_1",
    decisionCutoffRequiredForPromotion:true,
    decisionAt,capturedAt:decisionAt,''',
    "persist cutoff in immutable header"
)

replace_once(
    'function selectTomorrowCandidates(marketState, todayRows, env, scanDate) {',
    'function selectTomorrowCandidates(marketState, todayRows, env, scanDate,decisionCutoffAt=null) {',
    "selector cutoff argument"
)

replace_once(
'''try { c1PopulationReceipt=buildC1PopulationReceipt(featureRows,todayRows,marketState,sectorStats,c1FormalResults,selected,scanDate,c1ZeroPickContext); }''',
'''try { c1PopulationReceipt=buildC1PopulationReceipt(featureRows,todayRows,marketState,sectorStats,c1FormalResults,selected,scanDate,c1ZeroPickContext,decisionCutoffAt); }''',
    "pass cutoff to C1 builder"
)

replace_once(
'''  const marketConsensus=await env.STOCKS_KV.get(`V7_MARKET_CONSENSUS:${marketDate}`,"json");
  const scan = selectTomorrowCandidates(marketState, rows, { ...env, V7_TOTAL_CAPITAL: totalCapital, V7_OFFICIAL_INDEX:indexData, V7_MARKET_CONSENSUS:marketConsensus }, marketDate);''',
'''  const marketConsensus=await env.STOCKS_KV.get(`V7_MARKET_CONSENSUS:${marketDate}`,"json");
  const decisionCutoffAt=new Date().toISOString();
  const scan = selectTomorrowCandidates(marketState, rows, { ...env, V7_TOTAL_CAPITAL: totalCapital, V7_OFFICIAL_INDEX:indexData, V7_MARKET_CONSENSUS:marketConsensus }, marketDate,decisionCutoffAt);''',
    "stamp cutoff after final Formal input before selector"
)

Path("artifacts").mkdir(exist_ok=True)
Path("artifacts/Worker-before-v8_18_0.mjs").write_text(path.read_text(encoding="utf-8"),encoding="utf-8")
path.write_text(text.replace("\r\n","\n"),encoding="utf-8",newline="\n")
print("Applied V8.18.0 decision-cutoff provenance; Formal Core unchanged")
