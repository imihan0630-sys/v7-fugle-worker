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
    'const VERSION = "8.7.9-research-evidence-enrichment";',
    'const VERSION = "8.7.10-research-readiness-matrix";',
    "runtime version"
)

helpers=Path("research/readiness_v8_7_10.js").read_text(encoding="utf-8").strip()
anchor='''function buildIndependentPoolPreview(item, rank, finalSymbols = new Set()) {'''
replace_once(anchor,helpers+"\n\n"+anchor,"research readiness helpers")

replace_once(
'''  const coverage={};
  for(const h of [1,3,5,10,20]) coverage["d"+h]=outcomes.filter(x=>Number.isFinite(x.horizons?.["d"+h]?.returnPct)).length;
  return {''',
'''  const coverage={};
  for(const h of [1,3,5,10,20]) coverage["d"+h]=outcomes.filter(x=>Number.isFinite(x.horizons?.["d"+h]?.returnPct)).length;
  const twoEngineStudy=researchTwoEngineStudy(outcomes);
  const readinessEvidence=researchReadinessEvidenceFromOutcomes(outcomes,twoEngineStudy);
  return {''',
    "counterfactual readiness evidence"
)

replace_once(
'''    externalEvidenceCoverage:researchExternalEvidenceCoverage(outcomes),
    twoEngineStudy:researchTwoEngineStudy(outcomes),
    recentOutcomes:outcomes.slice(-80),''',
'''    externalEvidenceCoverage:researchExternalEvidenceCoverage(outcomes),
    twoEngineStudy,readinessEvidence,
    recentOutcomes:outcomes.slice(-80),''',
    "counterfactual readiness payload"
)

replace_once(
'''  const clusterRobustness=counterfactualResearch?.clusterRobustness||researchDateClusterRobustness([]);
  const governanceMaturity=researchApplyClusterRobustnessToMaturity(baseGovernanceMaturity,clusterRobustness);
  const full=snapshots.filter(row=>row.snapshot?.sourceCompleteness==="FULL_FORMAL_SCAN").length;''',
'''  const clusterRobustness=counterfactualResearch?.clusterRobustness||researchDateClusterRobustness([]);
  const governanceMaturity=researchApplyClusterRobustnessToMaturity(baseGovernanceMaturity,clusterRobustness);
  const evidenceReadiness=researchEvidenceReadinessMatrix(
    counterfactualResearch?.readinessEvidence||{},
    counterfactualResearch,executionAlpha,regimePersistence,externalEvidence,shadowIntegrity
  );
  const full=snapshots.filter(row=>row.snapshot?.sourceCompleteness==="FULL_FORMAL_SCAN").length;''',
    "dashboard readiness composition"
)

replace_once(
'''    counterfactualResearch,executionAlpha,regimePersistence,shadowIntegrity,externalEvidence,
    experimentLedger:{...researchExperimentLedger(),''',
'''    counterfactualResearch,executionAlpha,regimePersistence,shadowIntegrity,externalEvidence,evidenceReadiness,
    experimentLedger:{...researchExperimentLedger(),''',
    "dashboard readiness payload"
)

replace_once(
'''  <div class="panel"><h2>Two-Engine Momentum</h2><div id="twoEngine" class="muted"></div></div>
  <div class="panel"><h2>防過度擬合診斷</h2><div id="antiOverfit" class="muted"></div></div>''',
'''  <div class="panel"><h2>Two-Engine Momentum</h2><div id="twoEngine" class="muted"></div></div>
  <div class="panel"><h2>Research Evidence Readiness</h2><div id="evidenceReadiness" class="muted"></div></div>
  <div class="panel"><h2>防過度擬合診斷</h2><div id="antiOverfit" class="muted"></div></div>''',
    "readiness UI panel"
)

replace_once(
'''    document.getElementById("twoEngine").innerHTML="R08："+esc(te.status||"ACCUMULATING")+"｜方法 "+esc(te.method||"-")+"｜分類樣本 "+esc(te.assignments||0)+"｜D5同日配對 "+esc(te.paired?.d5?.pairedDates||0)+"<br>"+esc(te.rule||"");
    const ao=d.antiOverfit||{},rd=ao.redundancy||{},cs=ao.costStress||{},gm=ao.governanceMaturity||{};''',
'''    document.getElementById("twoEngine").innerHTML="R08："+esc(te.status||"ACCUMULATING")+"｜方法 "+esc(te.method||"-")+"｜分類樣本 "+esc(te.assignments||0)+"｜D5同日配對 "+esc(te.paired?.d5?.pairedDates||0)+"<br>"+esc(te.rule||"");
    const er=d.evidenceReadiness||{},ers=er.experiments||[];
    document.getElementById("evidenceReadiness").innerHTML="總狀態："+esc(er.status||"-")+"｜DESCRIPTIVE_READY "+esc(er.descriptiveReady||0)+" / "+esc(ers.length||0)+"｜ACCUMULATING "+esc(er.accumulating||0)+"｜WAITING "+esc(er.waitingData||0)+"｜DATA_QUALITY_BLOCKED "+esc(er.dataQualityBlocked||0)+"<br>"+esc(ers.map(x=>x.id+" "+x.status+(x.blockers?.length?"〔"+x.blockers[0]+"〕":"")).join("｜")||"等待第一批前瞻研究資料")+"<br>"+esc(er.policy||"");
    const ao=d.antiOverfit||{},rd=ao.redundancy||{},cs=ao.costStress||{},gm=ao.governanceMaturity||{};''',
    "render readiness matrix"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.7.10 research evidence readiness matrix")
