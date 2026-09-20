function researchDateClusterRobustness(outcomes,contrasts=RESEARCH_INCREMENTAL_CONTRASTS) {
  const results=[];
  for(const contrast of contrasts) {
    const rows=[];
    for(const outcome of outcomes||[]) {
      const y=toNumber(outcome?.horizons?.[contrast.horizon||"d5"]?.returnPct);
      const x=toNumber(researchGet(outcome?.snapshot,contrast.candidate));
      const z=toNumber(researchGet(outcome?.snapshot,contrast.control));
      if(y===null||x===null||z===null) continue;
      rows.push({scanDate:String(outcome.scanDate||""),x,z,y});
    }
    const dm=researchDemeanByDate(rows);
    const scanDates=[...new Set(dm.map(x=>x.scanDate).filter(Boolean))].sort();
    const baseStats=researchPartialCorrelation(dm.map(x=>x.x),dm.map(x=>x.y),dm.map(x=>x.z));
    const base=baseStats.partial;
    const loo=[];
    for(const heldOutDate of scanDates) {
      const kept=dm.filter(x=>x.scanDate!==heldOutDate);
      const keptDates=[...new Set(kept.map(x=>x.scanDate))].length;
      if(kept.length<30||keptDates<10) continue;
      const s=researchPartialCorrelation(kept.map(x=>x.x),kept.map(x=>x.y),kept.map(x=>x.z));
      if(s.partial!==null) loo.push({heldOutDate,partial:s.partial});
    }
    const mature=dm.length>=60&&scanDates.length>=15&&loo.length>=10;
    const sign=base===null||Math.abs(base)<1e-9?0:Math.sign(base);
    const signConsistencyPct=sign&&loo.length
      ?round(loo.filter(x=>Math.sign(x.partial)===sign).length/loo.length*100,2):null;
    const maxLeaveOneDateDelta=base!==null&&loo.length
      ?round(Math.max(...loo.map(x=>Math.abs(x.partial-base))),3):null;
    const looMin=loo.length?round(Math.min(...loo.map(x=>x.partial)),3):null;
    const looMax=loo.length?round(Math.max(...loo.map(x=>x.partial)),3):null;
    const lowSignal=base===null||Math.abs(base)<0.05;
    const fragile=mature&&!lowSignal&&(
      (signConsistencyPct!==null&&signConsistencyPct<70)||
      (maxLeaveOneDateDelta!==null&&maxLeaveOneDateDelta>=Math.max(0.05,Math.abs(base)*0.75))
    );
    results.push({
      id:contrast.id,label:contrast.label,candidate:contrast.candidate,control:contrast.control,
      horizon:contrast.horizon||"d5",researchOnly:true,decisionImpact:false,formalCoreImpact:false,
      samples:dm.length,independentScanDates:scanDates.length,leaveOneDateRuns:loo.length,
      basePartialCorrelation:base===null?null:round(base,3),
      leaveOneDateMin:looMin,leaveOneDateMax:looMax,
      signConsistencyPct,maxLeaveOneDateDelta,
      status:!mature?"ACCUMULATING":lowSignal?"LOW_SIGNAL":fragile?"FRAGILE_DATE_DEPENDENCE":"DATE_ROBUST_DESCRIPTIVE"
    });
  }
  return {
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    method:"LEAVE_ONE_SCAN_DATE_OUT_PARTIAL_CORRELATION",
    clusteringUnit:"scanDate",
    horizon:"D5",
    contrasts:results,
    trackedDefinitions:contrasts.length,
    matureContrasts:results.filter(x=>x.status!=="ACCUMULATING").length,
    fragileContrastIds:results.filter(x=>x.status==="FRAGILE_DATE_DEPENDENCE").map(x=>x.id),
    robustContrastIds:results.filter(x=>x.status==="DATE_ROBUST_DESCRIPTIVE").map(x=>x.id),
    policy:"同一選股日股票不是獨立樣本；以scanDate作獨立群聚單位，固定做leave-one-date-out敏感度。少於60筆、15個獨立選股日與10次有效留一日檢查只累積；成熟後若方向一致率低於70%，或單一日期移除造成偏相關變動過大，標記日期依賴脆弱。此診斷不產生正式交易規則。"
  };
}

function researchApplyClusterRobustnessToMaturity(baseMaturity,clusterRobustness) {
  const base=baseMaturity||{eligibleForFormalReview:false,blockers:[],evidence:{}};
  const blockers=[...(base.blockers||[])];
  const fragile=clusterRobustness?.fragileContrastIds||[];
  if(fragile.length) blockers.push("條件增量效果存在選股日群聚脆弱性："+fragile.join(","));
  return {
    ...base,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    eligibleForFormalReview:(base.eligibleForFormalReview===true)&&fragile.length===0,
    blockers:[...new Set(blockers)],
    evidence:{
      ...(base.evidence||{}),
      clusterRobustnessStatus:fragile.length?"REVIEW_REQUIRED":"NO_MATURE_FRAGILITY_DETECTED",
      clusterFragilityCount:fragile.length,
      clusterRobustMatureCount:(clusterRobustness?.robustContrastIds||[]).length
    },
    policy:(base.policy||"")+" 日期群聚脆弱性只限制正式升級審查資格，不影響現行正式選股、資金、監控、推播或交易。"
  };
}