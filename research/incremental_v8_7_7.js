const RESEARCH_INCREMENTAL_CONTRASTS=[
  {id:"I01",candidate:"price.residualSectorRs20",control:"price.persistenceScoreResearch",label:"Residual RS beyond Persistence",horizon:"d5",version:"1.0",parameterVariants:1},
  {id:"I02",candidate:"price.persistenceScoreResearch",control:"price.residualSectorRs20",label:"Persistence beyond Residual RS",horizon:"d5",version:"1.0",parameterVariants:1},
  {id:"I03",candidate:"setup.breakoutQualityResearch",control:"volume.volumeTodayVsPrev5",label:"Breakout Quality beyond Attention Volume",horizon:"d5",version:"1.0",parameterVariants:1},
  {id:"I04",candidate:"volume.volumeTodayVsPrev5",control:"setup.breakoutQualityResearch",label:"Attention Volume beyond Breakout Quality",horizon:"d5",version:"1.0",parameterVariants:1},
  {id:"I05",candidate:"setup.overheatPenaltyResearch",control:"setup.breakoutQualityResearch",label:"Overheat beyond Breakout Quality",horizon:"d5",version:"1.0",parameterVariants:1},
  {id:"I06",candidate:"institution.score",control:"price.residualSectorRs20",label:"Institution Score beyond Residual RS",horizon:"d5",version:"1.0",parameterVariants:1},
  {id:"I07",candidate:"setup.compressionScoreResearch",control:"price.volatility20",label:"Compression beyond Raw Volatility",horizon:"d5",version:"1.0",parameterVariants:1}
];

function researchDemeanByDate(rows) {
  const groups=new Map();
  for(const row of rows||[]) {
    const key=String(row.scanDate||"");
    if(!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(row);
  }
  const out=[];
  for(const [scanDate,group] of groups) {
    if(group.length<3) continue;
    const mx=counterfactualMean(group.map(x=>x.x));
    const mz=counterfactualMean(group.map(x=>x.z));
    const my=counterfactualMean(group.map(x=>x.y));
    for(const row of group) out.push({...row,scanDate,x:row.x-mx,z:row.z-mz,y:row.y-my});
  }
  return out;
}

function researchPartialCorrelation(x,y,z) {
  const rxy=researchCorrelation(x,y),rxz=researchCorrelation(x,z),ryz=researchCorrelation(y,z);
  if(rxy===null||rxz===null||ryz===null) return {zeroOrder:rxy,candidateControl:rxz,controlOutcome:ryz,partial:null};
  const denom=Math.sqrt(Math.max(0,(1-rxz*rxz)*(1-ryz*ryz)));
  const partial=denom>1e-9?(rxy-rxz*ryz)/denom:null;
  return {zeroOrder:rxy,candidateControl:rxz,controlOutcome:ryz,partial};
}

function researchIncrementalFactorDiagnostics(outcomes,contrasts=RESEARCH_INCREMENTAL_CONTRASTS) {
  const results=[];
  for(const contrast of contrasts) {
    const rows=[];
    for(const outcome of outcomes||[]) {
      const y=toNumber(outcome?.horizons?.[contrast.horizon||"d5"]?.returnPct);
      const x=toNumber(researchGet(outcome?.snapshot,contrast.candidate));
      const z=toNumber(researchGet(outcome?.snapshot,contrast.control));
      if(y===null||x===null||z===null) continue;
      rows.push({scanDate:String(outcome.scanDate||""),cohort:outcome.cohort||"UNKNOWN",x,z,y});
    }
    const dm=researchDemeanByDate(rows);
    const stats=researchPartialCorrelation(dm.map(x=>x.x),dm.map(x=>x.y),dm.map(x=>x.z));
    const dates=[...new Set(dm.map(x=>x.scanDate))].length;
    const zero=stats.zeroOrder,partial=stats.partial;
    const attenuationPct=zero!==null&&partial!==null&&Math.abs(zero)>1e-9
      ?round((1-Math.min(1,Math.abs(partial)/Math.abs(zero)))*100,2):null;
    const mature=dm.length>=60&&dates>=15;
    const redundancyRisk=mature&&stats.candidateControl!==null&&Math.abs(stats.candidateControl)>=0.70&&
      ((partial!==null&&Math.abs(partial)<0.05)||(attenuationPct!==null&&attenuationPct>=70));
    results.push({
      ...contrast,researchOnly:true,decisionImpact:false,formalCoreImpact:false,
      samples:dm.length,distinctScanDates:dates,
      zeroOrderCorrelation:zero===null?null:round(zero,3),
      candidateControlCorrelation:stats.candidateControl===null?null:round(stats.candidateControl,3),
      controlOutcomeCorrelation:stats.controlOutcome===null?null:round(stats.controlOutcome,3),
      partialCorrelation:partial===null?null:round(partial,3),
      attenuationPct,
      status:mature?(redundancyRisk?"REDUNDANCY_RISK":"DESCRIPTIVE_READY"):"ACCUMULATING"
    });
  }
  return {
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    method:"WITHIN_SCAN_DATE_DEMEANED_PARTIAL_CORRELATION",
    horizon:"D5",
    contrasts:results,
    trackedDefinitions:contrasts.length,
    trackedVariants:contrasts.reduce((sum,x)=>sum+Number(x.parameterVariants||1),0),
    matureContrasts:results.filter(x=>x.status!=="ACCUMULATING").length,
    redundancyRisks:results.filter(x=>x.status==="REDUNDANCY_RISK").map(x=>x.id),
    policy:"條件對照在研究前固定註冊；先在同一選股日內去均值，再看候選因子控制既有因子後與D5結果的偏相關。不得掃描所有配對後只挑漂亮結果；少於60筆且15個成熟選股日只累積，不下結論。"
  };
}