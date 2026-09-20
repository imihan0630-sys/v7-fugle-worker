const SHADOW_ARCHIVE_ENFORCEMENT_DATE="2026-09-21";

const RESEARCH_EXPERIMENT_CATALOG=[
  {id:"R01",version:"1.0",title:"成功突破 vs 假突破",family:"BREAKOUT_PATH",status:"ACCUMULATING",
    frozenAt:"2026-09-20",definition:"選股日收盤在 priorHigh20 之上後，未來3交易日收盤皆守住=HELD_3D；任一收盤跌回=FAILED_CLOSE_WITHIN_3D。",parameterVariants:1},
  {id:"R02",version:"1.0",title:"Selection Alpha vs Execution Alpha",family:"ALPHA_DECOMPOSITION",status:"ACCUMULATING",
    frozenAt:"2026-09-20",definition:"Selection Alpha 採同選股日配對 cohort 差；Execution Alpha 採首次正式 BUY 價相對選股日收盤的價格改善。",parameterVariants:1},
  {id:"R03",version:"1.0",title:"產業輪動與 Persistence",family:"SECTOR_PERSISTENCE",status:"ACCUMULATING",
    frozenAt:"2026-09-20",definition:"相鄰正式研究日 Top5 產業重疊率、Top5 最長連續留榜與 Regime transition。",parameterVariants:1},
  {id:"R04",version:"1.0",title:"Residual RS",family:"RESIDUAL_RS",status:"ACCUMULATING",
    frozenAt:"2026-09-20",definition:"每個選股日 Shadow 橫截面依 residualSectorRs20 中位數分 HIGH/LOW，第一階段比較 D5。",parameterVariants:1},
  {id:"R05",version:"1.0",title:"盤中動能 vs 隔夜動能",family:"RETURN_TIMING",status:"ACCUMULATING",
    frozenAt:"2026-09-20",definition:"Overnight=next open/scan close-1；Intraday=next close/next open-1。",parameterVariants:1},
  {id:"R06",version:"1.0",title:"Market Regime Transition",family:"REGIME_TRANSITION",status:"ACCUMULATING",
    frozenAt:"2026-09-20",definition:"只使用前瞻正式 trade_research_days 的非 UNKNOWN regime 序列，不倒填歷史市場狀態。",parameterVariants:1},
  {id:"R07",version:"1.0",title:"Quiet Strength vs Attention Strength",family:"ATTENTION_STRENGTH",status:"ACCUMULATING",
    frozenAt:"2026-09-20",definition:"Strength=residualSectorRs20、Attention proxy=volumeTodayVsPrev5；每選股日各自以中位數切四象限。",parameterVariants:1}
];

function researchExperimentLedger() {
  const variants=RESEARCH_EXPERIMENT_CATALOG.reduce((sum,x)=>sum+Number(x.parameterVariants||1),0);
  return {
    researchOnly:true,decisionImpact:false,
    trackedExperimentDefinitions:RESEARCH_EXPERIMENT_CATALOG.length,
    trackedExperimentVariants:variants,
    experiments:RESEARCH_EXPERIMENT_CATALOG.map(x=>({...x})),
    rule:"任何新窗口、新門檻、新分類或新參數都必須新增 experiment/version/variant；不得覆寫舊定義後只保留贏家。"
  };
}

function researchShadowIntegrityFromRows(dayRows,shadowRows,enforcementDate=SHADOW_ARCHIVE_ENFORCEMENT_DATE) {
  const days=(dayRows||[])
    .filter(row=>String(row.scan_date||"")>=String(enforcementDate))
    .sort((a,b)=>String(a.scan_date).localeCompare(String(b.scan_date)));
  const grouped={};
  for(const row of shadowRows||[]) {
    const date=String(row.scan_date||"");
    if(date<String(enforcementDate)) continue;
    if(!grouped[date]) grouped[date]={total:0,byCohort:{}};
    const count=Number(row.count??1);
    grouped[date].total+=Number.isFinite(count)?count:0;
    const cohort=String(row.cohort||"UNKNOWN");
    grouped[date].byCohort[cohort]=(grouped[date].byCohort[cohort]||0)+(Number.isFinite(count)?count:0);
  }
  const missingArchiveDates=[],selectedCoverageMismatches=[],noBroadControlDates=[],details=[];
  for(const day of days) {
    const date=String(day.scan_date),selectedCount=Math.max(0,Number(day.selected_count)||0);
    const g=grouped[date]||{total:0,byCohort:{}};
    const selectedShadow=Number(g.byCohort.SELECTED||0),broadControl=Number(g.byCohort.BROAD_CONTROL||0);
    if(g.total===0) missingArchiveDates.push(date);
    if(selectedShadow!==selectedCount) selectedCoverageMismatches.push({scanDate:date,formalSelected:selectedCount,shadowSelected:selectedShadow});
    if(broadControl===0) noBroadControlDates.push(date);
    details.push({scanDate:date,formalSelected:selectedCount,shadowTotal:g.total,selectedShadow,broadControl,byCohort:g.byCohort});
  }
  const anomalyCount=missingArchiveDates.length+selectedCoverageMismatches.length+noBroadControlDates.length;
  return {
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,enforcementDate,
    expectedScanDays:days.length,archivedScanDays:days.filter(x=>(grouped[String(x.scan_date)]?.total||0)>0).length,
    missingArchiveDates,selectedCoverageMismatches,noBroadControlDates,
    status:days.length===0?"WAITING_FIRST_POST_DEPLOY_SCAN":anomalyCount===0?"HEALTHY":"RESEARCH_DATA_GAP",
    details,
    rule:"正式盤後選股不中斷於研究寫入，但研究層必須另外檢查每個正式 scan_date 是否有 Shadow archive、SELECTED 是否完整覆蓋、BROAD_CONTROL 是否存在；缺洞只標記研究資料異常，不影響交易。"
  };
}

async function readShadowArchiveIntegrity(env,days=120) {
  if(!env?.V7_DB) return researchShadowIntegrityFromRows([],[]);
  await ensureD1Schema(env);
  const safeDays=Math.max(1,Math.min(365,Number(days)||120));
  const fromDate=shiftDateString(taiwanDate(),-(safeDays-1));
  const effectiveFrom=fromDate>SHADOW_ARCHIVE_ENFORCEMENT_DATE?fromDate:SHADOW_ARCHIVE_ENFORCEMENT_DATE;
  const session=env.V7_DB.withSession("first-primary");
  const [dayResult,shadowResult]=await Promise.all([
    session.prepare("SELECT scan_date,selected_count,status FROM v8_trade_journal_days WHERE scan_date>=?1 ORDER BY scan_date ASC").bind(effectiveFrom).all(),
    session.prepare("SELECT scan_date,cohort,COUNT(*) AS count FROM trade_research_shadow_candidates WHERE scan_date>=?1 GROUP BY scan_date,cohort ORDER BY scan_date ASC,cohort ASC").bind(effectiveFrom).all()
  ]);
  return researchShadowIntegrityFromRows(dayResult?.results||[],shadowResult?.results||[],SHADOW_ARCHIVE_ENFORCEMENT_DATE);
}
