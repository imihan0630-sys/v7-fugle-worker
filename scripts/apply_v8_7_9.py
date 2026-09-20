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
    'const VERSION = "8.7.8-date-cluster-robustness";',
    'const VERSION = "8.7.9-research-evidence-enrichment";',
    "runtime version"
)

helpers=Path("research/evidence_enrichment_v8_7_9.js").read_text(encoding="utf-8").strip()
anchor='''function buildIndependentPoolPreview(item, rank, finalSymbols = new Set()) {'''
replace_once(anchor,helpers+"\n\n"+anchor,"research evidence enrichment helpers")

replace_once(
'''  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_trade_research_shadow_date_cohort
    ON trade_research_shadow_candidates(scan_date,cohort)`).run();
  D1_SCHEMA_READY = true;''',
'''  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_trade_research_shadow_date_cohort
    ON trade_research_shadow_candidates(scan_date,cohort)`).run();
  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS trade_research_external_evidence (
    scan_date TEXT NOT NULL,
    symbol TEXT NOT NULL,
    name TEXT,
    cohort TEXT,
    evidence_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY(scan_date,symbol)
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_trade_research_external_date
    ON trade_research_external_evidence(scan_date,cohort)`).run();
  D1_SCHEMA_READY = true;''',
    "external evidence D1 schema"
)

replace_once(
'''  let shadowArchiveSave = /** @type {any} */ ({ ok:false, saved:0, skipped:true, reason:dryRun?"dry-run":"not-run" });
  let bridge = /** @type {any} */ ({ sent: false, skipped: true, reason: dryRun ? "dry-run" : "not-run" });''',
'''  let shadowArchiveSave = /** @type {any} */ ({ ok:false, saved:0, skipped:true, reason:dryRun?"dry-run":"not-run" });
  let researchEvidenceSave = /** @type {any} */ ({ ok:false, saved:0, skipped:true, reason:dryRun?"dry-run":"not-run", researchOnly:true });
  let bridge = /** @type {any} */ ({ sent: false, skipped: true, reason: dryRun ? "dry-run" : "not-run" });''',
    "external evidence save state"
)

replace_once(
'''  if(!dryRun) {
    try {
      shadowArchiveSave = await persistShadowCandidateArchive(env,scan.shadowArchive);
    } catch(error) {
      shadowArchiveSave = {ok:false,saved:0,error:String(error).slice(0,300),researchOnly:true,noPlanChanges:true,noPush:true,noTrade:true};
    }
  }
  const journal = !dryRun ? await recordTradeJournalDay(''',
'''  if(!dryRun) {
    try {
      shadowArchiveSave = await persistShadowCandidateArchive(env,scan.shadowArchive);
    } catch(error) {
      shadowArchiveSave = {ok:false,saved:0,error:String(error).slice(0,300),researchOnly:true,noPlanChanges:true,noPush:true,noTrade:true};
    }
    try {
      const evidenceBundle = await collectResearchExternalEvidence(scan.shadowArchive);
      researchEvidenceSave = await persistResearchExternalEvidence(env,evidenceBundle);
    } catch(error) {
      researchEvidenceSave = {ok:false,saved:0,error:String(error).slice(0,300),researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noPush:true,noTrade:true};
    }
  }
  const journal = !dryRun ? await recordTradeJournalDay(''',
    "nonblocking official research evidence capture"
)

replace_once(
'''    researchShadowArchive: {
      generated: scan.shadowArchive?.rows?.length || 0,
      generatedCounts: scan.shadowArchive?.counts || {},
      saved: shadowArchiveSave?.saved || 0,
      saveOk: shadowArchiveSave?.ok===true,
      researchOnly: true,
      decisionImpact: false
    },
    diagnostics: {''',
'''    researchShadowArchive: {
      generated: scan.shadowArchive?.rows?.length || 0,
      generatedCounts: scan.shadowArchive?.counts || {},
      saved: shadowArchiveSave?.saved || 0,
      saveOk: shadowArchiveSave?.ok===true,
      researchOnly: true,
      decisionImpact: false
    },
    researchExternalEvidence: {
      saved: researchEvidenceSave?.saved || 0,
      saveOk: researchEvidenceSave?.ok===true,
      providers: researchEvidenceSave?.providers || null,
      researchOnly: true,
      decisionImpact: false,
      formalCoreImpact: false
    },
    diagnostics: {''',
    "scan response evidence summary"
)

replace_once(
'''  const outcomes=archived.map(row=>researchShadowOutcomeForRow(row,histories[String(row.symbol)]||[]));''',
'''  const evidenceResult=await session.prepare("SELECT scan_date,symbol,evidence_json FROM trade_research_external_evidence WHERE scan_date>=?1 ORDER BY scan_date ASC,symbol ASC LIMIT 5000").bind(fromDate).all();
  const evidenceMap=new Map();
  for(const row of evidenceResult?.results||[]) {
    try { evidenceMap.set(String(row.scan_date)+"|"+String(row.symbol),JSON.parse(row.evidence_json||"{}")); } catch(_) {}
  }
  const outcomes=archived.map(row=>{
    const outcome=researchShadowOutcomeForRow(row,histories[String(row.symbol)]||[]);
    outcome.externalEvidence=evidenceMap.get(String(outcome.scanDate)+"|"+String(outcome.symbol))||null;
    return outcome;
  });''',
    "attach external evidence to counterfactual outcomes"
)

replace_once(
'''    diagnostics:buildShadowResearchDiagnostics(outcomes),
    costStress:researchCostStress(outcomes),
    incrementalDiagnostics:researchIncrementalFactorDiagnostics(outcomes),
    clusterRobustness:researchDateClusterRobustness(outcomes),
    recentOutcomes:outcomes.slice(-80),''',
'''    diagnostics:buildShadowResearchDiagnostics(outcomes),
    costStress:researchCostStress(outcomes),
    incrementalDiagnostics:researchIncrementalFactorDiagnostics(outcomes),
    clusterRobustness:researchDateClusterRobustness(outcomes),
    externalEvidenceCoverage:researchExternalEvidenceCoverage(outcomes),
    twoEngineStudy:researchTwoEngineStudy(outcomes),
    recentOutcomes:outcomes.slice(-80),''',
    "counterfactual two-engine diagnostics"
)

replace_once(
'''  const [snapshots,paths,shadowCandidates,counterfactualResearch,executionAlpha,regimePersistence,shadowIntegrity]=await Promise.all([
    readResearchSnapshots(env,days),readSelectionPathMetrics(env,days),readShadowCandidateSummary(env,days),
    readShadowCounterfactualResearch(env,researchWindow),readExecutionAlphaResearch(env,researchWindow),
    readResearchRegimePersistence(env,Math.min(180,Math.max(1,Number(days)||180))),
    readShadowArchiveIntegrity(env,Math.min(180,Math.max(1,Number(days)||180)))
  ]);''',
'''  const [snapshots,paths,shadowCandidates,counterfactualResearch,executionAlpha,regimePersistence,shadowIntegrity,externalEvidence]=await Promise.all([
    readResearchSnapshots(env,days),readSelectionPathMetrics(env,days),readShadowCandidateSummary(env,days),
    readShadowCounterfactualResearch(env,researchWindow),readExecutionAlphaResearch(env,researchWindow),
    readResearchRegimePersistence(env,Math.min(180,Math.max(1,Number(days)||180))),
    readShadowArchiveIntegrity(env,Math.min(180,Math.max(1,Number(days)||180))),
    readResearchExternalEvidenceSummary(env,Math.min(180,Math.max(1,Number(days)||180)))
  ]);''',
    "dashboard external evidence load"
)

replace_once(
'''    counterfactualResearch,executionAlpha,regimePersistence,shadowIntegrity,
    experimentLedger:{...researchExperimentLedger(),''',
'''    counterfactualResearch,executionAlpha,regimePersistence,shadowIntegrity,externalEvidence,
    experimentLedger:{...researchExperimentLedger(),''',
    "dashboard external evidence payload"
)

replace_once(
'''  <div class="panel"><h2>Research 資料完整性</h2><div id="researchIntegrity" class="muted"></div></div>
  <div class="panel"><h2>防過度擬合診斷</h2><div id="antiOverfit" class="muted"></div></div>''',
'''  <div class="panel"><h2>Research 資料完整性</h2><div id="researchIntegrity" class="muted"></div></div>
  <div class="panel"><h2>外部研究證據</h2><div id="externalEvidence" class="muted"></div></div>
  <div class="panel"><h2>Two-Engine Momentum</h2><div id="twoEngine" class="muted"></div></div>
  <div class="panel"><h2>防過度擬合診斷</h2><div id="antiOverfit" class="muted"></div></div>''',
    "research evidence UI panels"
)

replace_once(
'''    const ao=d.antiOverfit||{},rd=ao.redundancy||{},cs=ao.costStress||{},gm=ao.governanceMaturity||{};''',
'''    const ee=d.externalEvidence||{},te=d.counterfactualResearch?.twoEngineStudy||{};
    document.getElementById("externalEvidence").innerHTML="狀態："+esc(ee.status||"-")+"｜累積 "+esc(ee.total||0)+" 筆／"+esc(ee.dates||0)+" 日｜營收可用 "+esc(ee.revenueAvailable||0)+"｜融資券可用 "+esc(ee.marginAvailable||0)+"｜注意旗標 "+esc(ee.attentionFlags||0)+"｜處置旗標 "+esc(ee.dispositionFlags||0)+"<br>"+esc(ee.policy||"");
    document.getElementById("twoEngine").innerHTML="R08："+esc(te.status||"ACCUMULATING")+"｜方法 "+esc(te.method||"-")+"｜分類樣本 "+esc(te.assignments||0)+"｜D5同日配對 "+esc(te.paired?.d5?.pairedDates||0)+"<br>"+esc(te.rule||"");
    const ao=d.antiOverfit||{},rd=ao.redundancy||{},cs=ao.costStress||{},gm=ao.governanceMaturity||{};''',
    "render research evidence and two engine"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.7.9 research evidence enrichment")
