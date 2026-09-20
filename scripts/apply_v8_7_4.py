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
    'const VERSION = "8.7.3-validation-firewall";',
    'const VERSION = "8.7.4-counterfactual-research";',
    "runtime version"
)

replace_once(
'''      breakoutDistancePct:toNumber(item?.breakoutDistancePct),dailyClosePosition:toNumber(item?.dailyClosePosition),''',
'''      breakoutDistancePct:toNumber(item?.breakoutDistancePct),breakoutReferencePriceResearch:toNumber(item?.priorHigh20),
      dailyClosePosition:toNumber(item?.dailyClosePosition),''',
    "freeze prospective breakout reference"
)

helpers=Path("research/counterfactual_v8_7_4.js").read_text(encoding="utf-8").strip()
anchor='''function buildIndependentPoolPreview(item, rank, finalSymbols = new Set()) {'''
replace_once(anchor,helpers+"\\n\\n"+anchor,"counterfactual research helpers")

replace_once(
'''async function readResearchDashboard(env,days=730) {
  const [snapshots,paths,shadowCandidates]=await Promise.all([
    readResearchSnapshots(env,days),readSelectionPathMetrics(env,days),readShadowCandidateSummary(env,days)
  ]);''',
'''async function readResearchDashboard(env,days=730) {
  const researchWindow=Math.min(90,Math.max(1,Number(days)||90));
  const [snapshots,paths,shadowCandidates,counterfactualResearch,executionAlpha,regimePersistence]=await Promise.all([
    readResearchSnapshots(env,days),readSelectionPathMetrics(env,days),readShadowCandidateSummary(env,days),
    readShadowCounterfactualResearch(env,researchWindow),readExecutionAlphaResearch(env,researchWindow),
    readResearchRegimePersistence(env,Math.min(180,Math.max(1,Number(days)||180)))
  ]);''',
    "load counterfactual research dashboard"
)

replace_once(
'''    completenessAudit,shadowCandidates,pathPerformance:paths,factorStudy:study,promotionGate:promotion,
    validationFirewall:{''',
'''    completenessAudit,shadowCandidates,pathPerformance:paths,factorStudy:study,promotionGate:promotion,
    counterfactualResearch,executionAlpha,regimePersistence,
    validationFirewall:{''',
    "counterfactual dashboard payload"
)

replace_once(
'''  <div class="panel"><h2>驗證防火牆</h2><div id="validation" class="muted"></div></div>
  <div class="panel"><h2>選股後路徑</h2>''',
'''  <div class="panel"><h2>驗證防火牆</h2><div id="validation" class="muted"></div></div>
  <div class="panel"><h2>Counterfactual／Selection Alpha</h2><div id="counterfactual" class="muted"></div></div>
  <div class="panel"><h2>Execution／Regime／Persistence</h2><div id="executionResearch" class="muted"></div></div>
  <div class="panel"><h2>選股後路徑</h2>''',
    "counterfactual research UI"
)

replace_once(
'''    document.getElementById("validation").innerHTML="方法："+esc(vf.method||"-")+"｜原訓練日 "+esc(pv.rawTrainDates??"-")+"｜purge後 "+esc(pv.purgedTrainDates??"-")+"｜邊界剔除 "+esc((pv.purgedBoundaryDates||[]).length)+"｜holdout "+esc(pv.holdoutDates??"-")+"<br>目前追蹤因子定義："+esc(mt.trackedFactorDefinitions??"-")+"｜正式核心影響：0<br>"+esc(pv.rule||"")+"<br>"+esc(mt.rule||"");
    const ps=d.pathPerformance?.summary?.horizons||{};''',
'''    document.getElementById("validation").innerHTML="方法："+esc(vf.method||"-")+"｜原訓練日 "+esc(pv.rawTrainDates??"-")+"｜purge後 "+esc(pv.purgedTrainDates??"-")+"｜邊界剔除 "+esc((pv.purgedBoundaryDates||[]).length)+"｜holdout "+esc(pv.holdoutDates??"-")+"<br>目前追蹤因子定義："+esc(mt.trackedFactorDefinitions??"-")+"｜正式核心影響：0<br>"+esc(pv.rule||"")+"<br>"+esc(mt.rule||"");
    const cf=d.counterfactualResearch||{},sa=cf.selectionAlpha?.byComparator?.BROAD_CONTROL?.d5||{},bd=cf.diagnostics?.breakout||{},io=cf.diagnostics?.intradayVsOvernight||{},qa=cf.diagnostics?.quietVsAttention?.groups||{},rr=cf.diagnostics?.residualRS||{};
    document.getElementById("counterfactual").innerHTML="Shadow結果 "+esc(cf.outcomeRows||0)+" 筆｜D5成熟 "+esc(cf.coverage?.d5||0)+"｜同日配對 Selection Alpha vs Broad Control(D5)："+esc(sa.avg==null?"-":sa.avg+"%")+"（配對日 "+esc(sa.pairedDates||0)+"）<br>突破守住/失敗："+esc(bd.held3D||0)+" / "+esc(bd.failedClose3D||0)+"｜隔夜平均 "+esc(io.overnightPct?.avg==null?"-":io.overnightPct.avg+"%")+"｜盤中平均 "+esc(io.intradayPct?.avg==null?"-":io.intradayPct.avg+"%")+"<br>Quiet Strength D5 "+esc(qa.QUIET_STRENGTH?.avg==null?"-":qa.QUIET_STRENGTH.avg+"%")+"｜Attention Strength D5 "+esc(qa.ATTENTION_STRENGTH?.avg==null?"-":qa.ATTENTION_STRENGTH.avg+"%")+"｜高/低 Residual RS D5 "+esc(rr.HIGH_RESIDUAL_RS?.avg==null?"-":rr.HIGH_RESIDUAL_RS.avg+"%")+" / "+esc(rr.LOW_RESIDUAL_RS?.avg==null?"-":rr.LOW_RESIDUAL_RS.avg+"%")+"<br>"+esc(cf.governance||"");
    const ex=d.executionAlpha||{},rg=d.regimePersistence||{};
    document.getElementById("executionResearch").innerHTML="BUY觸發 "+esc(ex.buyTriggeredPlans||0)+" / "+esc(ex.selectedPlans||0)+"｜進場價改善平均 "+esc(ex.entryTimingPct?.avg==null?"-":ex.entryTimingPct.avg+"%")+"｜Top5產業延續率 "+esc(rg.top5SectorRetentionPct?.avg==null?"-":rg.top5SectorRetentionPct.avg+"%")+"｜Regime有效日 "+esc(rg.usableDays||0)+"<br>"+esc(ex.definition||"")+"<br>"+esc(rg.rule||"");
    const ps=d.pathPerformance?.summary?.horizons||{};''',
    "render counterfactual research"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.7.4 counterfactual research")
