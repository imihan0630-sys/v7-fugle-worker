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
    'const VERSION = "8.7.7-incremental-factor-diagnostics";',
    'const VERSION = "8.7.8-date-cluster-robustness";',
    "runtime version"
)

helpers=Path("research/cluster_robustness_v8_7_8.js").read_text(encoding="utf-8").strip()
anchor='''function buildIndependentPoolPreview(item, rank, finalSymbols = new Set()) {'''
replace_once(anchor,helpers+"\n\n"+anchor,"date cluster robustness helpers")

replace_once(
'''    incrementalDiagnostics:researchIncrementalFactorDiagnostics(outcomes),
    recentOutcomes:outcomes.slice(-80),''',
'''    incrementalDiagnostics:researchIncrementalFactorDiagnostics(outcomes),
    clusterRobustness:researchDateClusterRobustness(outcomes),
    recentOutcomes:outcomes.slice(-80),''',
    "counterfactual cluster robustness"
)

replace_once(
'''  const governanceMaturity=researchGovernanceMaturity(snapshots,study,counterfactualResearch,regimePersistence,shadowIntegrity,redundancy,costStress);
  const full=snapshots.filter(row=>row.snapshot?.sourceCompleteness==="FULL_FORMAL_SCAN").length;''',
'''  const baseGovernanceMaturity=researchGovernanceMaturity(snapshots,study,counterfactualResearch,regimePersistence,shadowIntegrity,redundancy,costStress);
  const clusterRobustness=counterfactualResearch?.clusterRobustness||researchDateClusterRobustness([]);
  const governanceMaturity=researchApplyClusterRobustnessToMaturity(baseGovernanceMaturity,clusterRobustness);
  const full=snapshots.filter(row=>row.snapshot?.sourceCompleteness==="FULL_FORMAL_SCAN").length;''',
    "cluster adjusted governance maturity"
)

replace_once(
'''    antiOverfit:{redundancy,costStress,governanceMaturity,incrementalDiagnostics:counterfactualResearch?.incrementalDiagnostics||researchIncrementalFactorDiagnostics([])},''',
'''    antiOverfit:{redundancy,costStress,governanceMaturity,
      incrementalDiagnostics:counterfactualResearch?.incrementalDiagnostics||researchIncrementalFactorDiagnostics([]),
      clusterRobustness},''',
    "dashboard cluster robustness payload"
)

replace_once(
'''const inc=ao.incrementalDiagnostics||{};
    document.getElementById("antiOverfit").innerHTML="升級審查資格："+esc(gm.eligibleForFormalReview?"ELIGIBLE_FOR_REVIEW":"LOCKED")+"｜前瞻完整快照 "+esc(gm.evidence?.fullProspectiveSnapshots??0)+"｜D5成熟 "+esc(gm.evidence?.shadowD5Mature??0)+"｜高冗餘組 "+esc(rd.highRedundancyCount??0)+"｜條件對照成熟 "+esc(inc.matureContrasts??0)+"/"+esc(inc.trackedDefinitions??0)+"｜冗餘風險 "+esc((inc.redundancyRisks||[]).join(",")||"0")+"｜成本壓力樣本 "+esc(cs.selectedD5Samples??0)+"<br>阻擋："+esc((gm.blockers||[]).join("｜")||"無；仍需人工重要策略決策")+"<br>"+esc(inc.policy||gm.policy||"");''',
'''const inc=ao.incrementalDiagnostics||{},cr=ao.clusterRobustness||{};
    document.getElementById("antiOverfit").innerHTML="升級審查資格："+esc(gm.eligibleForFormalReview?"ELIGIBLE_FOR_REVIEW":"LOCKED")+"｜前瞻完整快照 "+esc(gm.evidence?.fullProspectiveSnapshots??0)+"｜D5成熟 "+esc(gm.evidence?.shadowD5Mature??0)+"｜高冗餘組 "+esc(rd.highRedundancyCount??0)+"｜條件對照成熟 "+esc(inc.matureContrasts??0)+"/"+esc(inc.trackedDefinitions??0)+"｜日期穩健 "+esc((cr.robustContrastIds||[]).length)+"｜日期脆弱 "+esc((cr.fragileContrastIds||[]).join(",")||"0")+"｜成本壓力樣本 "+esc(cs.selectedD5Samples??0)+"<br>阻擋："+esc((gm.blockers||[]).join("｜")||"無；仍需人工重要策略決策")+"<br>"+esc(cr.policy||inc.policy||gm.policy||"");''',
    "render cluster robustness diagnostics"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.7.8 date-cluster robustness diagnostics")
