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
    'const VERSION = "8.7.4-counterfactual-research";',
    'const VERSION = "8.7.5-research-governance";',
    "runtime version"
)

helpers=Path("research/governance_v8_7_5.js").read_text(encoding="utf-8").strip()
anchor='''function buildIndependentPoolPreview(item, rank, finalSymbols = new Set()) {'''
replace_once(anchor,helpers+"\n\n"+anchor,"research governance helpers")

replace_once(
'''    multipleTesting:{
      trackedFactorDefinitions:RESEARCH_FACTOR_CATALOG.length,
      rule:"研究因子與參數變體都視為試驗次數；漂亮結果不得只挑贏家報告，後續累積足夠樣本後再導入PBO/Deflated Sharpe等多重測試校正。"
    },''',
'''    multipleTesting:{
      trackedFactorDefinitions:RESEARCH_FACTOR_CATALOG.length,
      trackedExperimentDefinitions:RESEARCH_EXPERIMENT_CATALOG.length,
      trackedExperimentVariants:RESEARCH_EXPERIMENT_CATALOG.reduce((sum,x)=>sum+Number(x.parameterVariants||1),0),
      totalTrackedDefinitions:RESEARCH_FACTOR_CATALOG.length+RESEARCH_EXPERIMENT_CATALOG.length,
      experimentIds:RESEARCH_EXPERIMENT_CATALOG.map(x=>x.id),
      rule:"研究因子、實驗定義與參數變體都列入試驗帳本；漂亮結果不得只挑贏家報告，後續累積足夠樣本後再導入PBO/Deflated Sharpe等多重測試校正。"
    },''',
    "machine readable multiple testing ledger"
)

replace_once(
'''  const [snapshots,paths,shadowCandidates,counterfactualResearch,executionAlpha,regimePersistence]=await Promise.all([
    readResearchSnapshots(env,days),readSelectionPathMetrics(env,days),readShadowCandidateSummary(env,days),
    readShadowCounterfactualResearch(env,researchWindow),readExecutionAlphaResearch(env,researchWindow),
    readResearchRegimePersistence(env,Math.min(180,Math.max(1,Number(days)||180)))
  ]);''',
'''  const [snapshots,paths,shadowCandidates,counterfactualResearch,executionAlpha,regimePersistence,shadowIntegrity]=await Promise.all([
    readResearchSnapshots(env,days),readSelectionPathMetrics(env,days),readShadowCandidateSummary(env,days),
    readShadowCounterfactualResearch(env,researchWindow),readExecutionAlphaResearch(env,researchWindow),
    readResearchRegimePersistence(env,Math.min(180,Math.max(1,Number(days)||180))),
    readShadowArchiveIntegrity(env,Math.min(180,Math.max(1,Number(days)||180)))
  ]);''',
    "load shadow archive integrity"
)

replace_once(
'''    counterfactualResearch,executionAlpha,regimePersistence,
    validationFirewall:{''',
'''    counterfactualResearch,executionAlpha,regimePersistence,shadowIntegrity,
    experimentLedger:researchExperimentLedger(),
    validationFirewall:{''',
    "dashboard governance payload"
)

replace_once(
'''  <div class="panel"><h2>Shadow 對照樣本</h2><div id="shadow" class="muted"></div></div>
  <div class="panel"><h2>驗證防火牆</h2><div id="validation" class="muted"></div></div>''',
'''  <div class="panel"><h2>Shadow 對照樣本</h2><div id="shadow" class="muted"></div></div>
  <div class="panel"><h2>Research 資料完整性</h2><div id="researchIntegrity" class="muted"></div></div>
  <div class="panel"><h2>驗證防火牆</h2><div id="validation" class="muted"></div></div>''',
    "research integrity UI"
)

replace_once(
'''    const sh=d.shadowCandidates||{};document.getElementById("shadow").innerHTML="累積 "+esc(sh.total||0)+" 筆／"+esc(sh.dates||0)+" 個選股日｜"+esc(Object.entries(sh.byCohort||{}).map(x=>x[0]+" "+x[1]).join("｜")||"等待下一個正式盤後選股日")+"<br>"+esc(sh.policy||"");
    const vf=d.validationFirewall||{},pv=vf.overlapPurge||{},mt=vf.multipleTesting||{};''',
'''    const sh=d.shadowCandidates||{};document.getElementById("shadow").innerHTML="累積 "+esc(sh.total||0)+" 筆／"+esc(sh.dates||0)+" 個選股日｜"+esc(Object.entries(sh.byCohort||{}).map(x=>x[0]+" "+x[1]).join("｜")||"等待下一個正式盤後選股日")+"<br>"+esc(sh.policy||"");
    const ri=d.shadowIntegrity||{},el=d.experimentLedger||{};
    document.getElementById("researchIntegrity").innerHTML="狀態："+esc(ri.status||"-")+"｜應有選股日 "+esc(ri.expectedScanDays||0)+"｜已封存 "+esc(ri.archivedScanDays||0)+"｜缺檔 "+esc((ri.missingArchiveDates||[]).length)+"｜SELECTED覆蓋不符 "+esc((ri.selectedCoverageMismatches||[]).length)+"｜無Broad Control "+esc((ri.noBroadControlDates||[]).length)+"<br>機器可讀實驗："+esc(el.trackedExperimentDefinitions||0)+" 定義 / "+esc(el.trackedExperimentVariants||0)+" variants｜正式核心影響：0<br>"+esc(ri.rule||"");
    const vf=d.validationFirewall||{},pv=vf.overlapPurge||{},mt=vf.multipleTesting||{};''',
    "render research integrity"
)

replace_once(
'''目前追蹤因子定義："+esc(mt.trackedFactorDefinitions??"-")+"｜正式核心影響：0''',
'''追蹤因子："+esc(mt.trackedFactorDefinitions??"-")+"｜研究實驗："+esc(mt.trackedExperimentDefinitions??"-")+"｜總定義："+esc(mt.totalTrackedDefinitions??"-")+"｜正式核心影響：0''',
    "render full multiple testing ledger"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.7.5 research governance")
