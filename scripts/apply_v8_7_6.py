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
    'const VERSION = "8.7.5-research-governance";',
    'const VERSION = "8.7.6-anti-overfit-diagnostics";',
    "runtime version"
)

helpers=Path("research/anti_overfit_v8_7_6.js").read_text(encoding="utf-8").strip()
anchor='''function buildIndependentPoolPreview(item, rank, finalSymbols = new Set()) {'''
replace_once(anchor,helpers+"\n\n"+anchor,"anti overfit helpers")

replace_once(
'''    byCohort:researchOutcomeCohortSummary(outcomes),
    selectionAlpha:researchPairedSelectionAlpha(outcomes),
    diagnostics:buildShadowResearchDiagnostics(outcomes),
    recentOutcomes:outcomes.slice(-80),''',
'''    byCohort:researchOutcomeCohortSummary(outcomes),
    selectionAlpha:researchPairedSelectionAlpha(outcomes),
    diagnostics:buildShadowResearchDiagnostics(outcomes),
    costStress:researchCostStress(outcomes),
    recentOutcomes:outcomes.slice(-80),''',
    "counterfactual cost stress"
)

replace_once(
'''  const study=factorStudyFromSnapshots(snapshots,paths.rows,5);
  const promotion=researchPromotionGate(study);
  const full=snapshots.filter(row=>row.snapshot?.sourceCompleteness==="FULL_FORMAL_SCAN").length;''',
'''  const study=factorStudyFromSnapshots(snapshots,paths.rows,5);
  const promotion=researchPromotionGate(study);
  const redundancy=researchFactorRedundancy(snapshots);
  const costStress=counterfactualResearch?.costStress||researchCostStress([]);
  const governanceMaturity=researchGovernanceMaturity(snapshots,study,counterfactualResearch,regimePersistence,shadowIntegrity,redundancy,costStress);
  const full=snapshots.filter(row=>row.snapshot?.sourceCompleteness==="FULL_FORMAL_SCAN").length;''',
    "governance maturity diagnostics"
)

replace_once(
'''    counterfactualResearch,executionAlpha,regimePersistence,shadowIntegrity,
    experimentLedger:researchExperimentLedger(),''',
'''    counterfactualResearch,executionAlpha,regimePersistence,shadowIntegrity,
    experimentLedger:researchExperimentLedger(),
    antiOverfit:{redundancy,costStress,governanceMaturity},''',
    "dashboard anti overfit payload"
)

replace_once(
'''  <div class="panel"><h2>驗證防火牆</h2><div id="validation" class="muted"></div></div>''',
'''  <div class="panel"><h2>防過度擬合診斷</h2><div id="antiOverfit" class="muted"></div></div>
  <div class="panel"><h2>驗證防火牆</h2><div id="validation" class="muted"></div></div>''',
    "anti overfit UI panel"
)

replace_once(
'''    const vf=d.validationFirewall||{},pv=vf.overlapPurge||{},mt=vf.multipleTesting||{};''',
'''    const ao=d.antiOverfit||{},rd=ao.redundancy||{},cs=ao.costStress||{},gm=ao.governanceMaturity||{};
    document.getElementById("antiOverfit").innerHTML="升級審查資格："+esc(gm.eligibleForFormalReview?"ELIGIBLE_FOR_REVIEW":"LOCKED")+"｜前瞻完整快照 "+esc(gm.evidence?.fullProspectiveSnapshots??0)+"｜D5成熟 "+esc(gm.evidence?.shadowD5Mature??0)+"｜高冗餘組 "+esc(rd.highRedundancyCount??0)+"｜成本壓力樣本 "+esc(cs.selectedD5Samples??0)+"<br>阻擋："+esc((gm.blockers||[]).join("｜")||"無；仍需人工重要策略決策")+"<br>"+esc(gm.policy||"");
    const vf=d.validationFirewall||{},pv=vf.overlapPurge||{},mt=vf.multipleTesting||{};''',
    "render anti overfit"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.7.6 anti-overfit diagnostics")
