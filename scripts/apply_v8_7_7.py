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
    'const VERSION = "8.7.6-anti-overfit-diagnostics";',
    'const VERSION = "8.7.7-incremental-factor-diagnostics";',
    "runtime version"
)

helpers=Path("research/incremental_v8_7_7.js").read_text(encoding="utf-8").strip()
anchor='''function buildIndependentPoolPreview(item, rank, finalSymbols = new Set()) {'''
replace_once(anchor,helpers+"\n\n"+anchor,"incremental diagnostics helpers")

replace_once(
'''    costStress:researchCostStress(outcomes),
    recentOutcomes:outcomes.slice(-80),''',
'''    costStress:researchCostStress(outcomes),
    incrementalDiagnostics:researchIncrementalFactorDiagnostics(outcomes),
    recentOutcomes:outcomes.slice(-80),''',
    "counterfactual incremental diagnostics"
)

replace_once(
'''      trackedExperimentVariants:RESEARCH_EXPERIMENT_CATALOG.reduce((sum,x)=>sum+Number(x.parameterVariants||1),0),
      totalTrackedDefinitions:RESEARCH_FACTOR_CATALOG.length+RESEARCH_EXPERIMENT_CATALOG.length,
      experimentIds:RESEARCH_EXPERIMENT_CATALOG.map(x=>x.id),''',
'''      trackedExperimentVariants:RESEARCH_EXPERIMENT_CATALOG.reduce((sum,x)=>sum+Number(x.parameterVariants||1),0),
      trackedIncrementalDefinitions:RESEARCH_INCREMENTAL_CONTRASTS.length,
      trackedIncrementalVariants:RESEARCH_INCREMENTAL_CONTRASTS.reduce((sum,x)=>sum+Number(x.parameterVariants||1),0),
      totalTrackedDefinitions:RESEARCH_FACTOR_CATALOG.length+RESEARCH_EXPERIMENT_CATALOG.length+RESEARCH_INCREMENTAL_CONTRASTS.length,
      totalTrackedVariants:RESEARCH_EXPERIMENT_CATALOG.reduce((sum,x)=>sum+Number(x.parameterVariants||1),0)+RESEARCH_INCREMENTAL_CONTRASTS.reduce((sum,x)=>sum+Number(x.parameterVariants||1),0),
      experimentIds:RESEARCH_EXPERIMENT_CATALOG.map(x=>x.id),
      incrementalIds:RESEARCH_INCREMENTAL_CONTRASTS.map(x=>x.id),''',
    "multiple testing incremental ledger"
)

replace_once(
'''    counterfactualResearch,executionAlpha,regimePersistence,shadowIntegrity,
    experimentLedger:researchExperimentLedger(),
    antiOverfit:{redundancy,costStress,governanceMaturity},''',
'''    counterfactualResearch,executionAlpha,regimePersistence,shadowIntegrity,
    experimentLedger:{...researchExperimentLedger(),
      trackedIncrementalDefinitions:RESEARCH_INCREMENTAL_CONTRASTS.length,
      trackedIncrementalVariants:RESEARCH_INCREMENTAL_CONTRASTS.reduce((sum,x)=>sum+Number(x.parameterVariants||1),0),
      incrementalContrastIds:RESEARCH_INCREMENTAL_CONTRASTS.map(x=>x.id)},
    antiOverfit:{redundancy,costStress,governanceMaturity,incrementalDiagnostics:counterfactualResearch?.incrementalDiagnostics||researchIncrementalFactorDiagnostics([])},''',
    "dashboard incremental payload"
)

replace_once(
'''document.getElementById("antiOverfit").innerHTML="升級審查資格："+esc(gm.eligibleForFormalReview?"ELIGIBLE_FOR_REVIEW":"LOCKED")+"｜前瞻完整快照 "+esc(gm.evidence?.fullProspectiveSnapshots??0)+"｜D5成熟 "+esc(gm.evidence?.shadowD5Mature??0)+"｜高冗餘組 "+esc(rd.highRedundancyCount??0)+"｜成本壓力樣本 "+esc(cs.selectedD5Samples??0)+"<br>阻擋："+esc((gm.blockers||[]).join("｜")||"無；仍需人工重要策略決策")+"<br>"+esc(gm.policy||"");''',
'''const inc=ao.incrementalDiagnostics||{};
    document.getElementById("antiOverfit").innerHTML="升級審查資格："+esc(gm.eligibleForFormalReview?"ELIGIBLE_FOR_REVIEW":"LOCKED")+"｜前瞻完整快照 "+esc(gm.evidence?.fullProspectiveSnapshots??0)+"｜D5成熟 "+esc(gm.evidence?.shadowD5Mature??0)+"｜高冗餘組 "+esc(rd.highRedundancyCount??0)+"｜條件對照成熟 "+esc(inc.matureContrasts??0)+"/"+esc(inc.trackedDefinitions??0)+"｜冗餘風險 "+esc((inc.redundancyRisks||[]).join(",")||"0")+"｜成本壓力樣本 "+esc(cs.selectedD5Samples??0)+"<br>阻擋："+esc((gm.blockers||[]).join("｜")||"無；仍需人工重要策略決策")+"<br>"+esc(inc.policy||gm.policy||"");''',
    "render incremental diagnostics"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.7.7 incremental factor diagnostics")
