function researchCorrelation(xs,ys) {
  const pairs=[];
  for(let i=0;i<Math.min(xs.length,ys.length);i++) {
    const x=Number(xs[i]),y=Number(ys[i]);
    if(Number.isFinite(x)&&Number.isFinite(y)) pairs.push([x,y]);
  }
  if(pairs.length<6) return null;
  const ax=pairs.reduce((s,p)=>s+p[0],0)/pairs.length;
  const ay=pairs.reduce((s,p)=>s+p[1],0)/pairs.length;
  let num=0,dx=0,dy=0;
  for(const [x,y] of pairs){const a=x-ax,b=y-ay;num+=a*b;dx+=a*a;dy+=b*b;}
  if(!(dx>0)&&!(dy>0)) return null;
  if(!(dx>0)||!(dy>0)) return null;
  return num/Math.sqrt(dx*dy);
}

function researchFactorRedundancy(snapshotRows,catalog=RESEARCH_FACTOR_CATALOG) {
  const rows=(snapshotRows||[]).filter(row=>row?.snapshot && row.snapshot.sourceCompleteness==="FULL_FORMAL_SCAN");
  const pairs=[];
  for(let i=0;i<catalog.length;i++) for(let j=i+1;j<catalog.length;j++) {
    const a=catalog[i],b=catalog[j],xs=[],ys=[];
    for(const row of rows) {
      const x=toNumber(researchGet(row.snapshot,a.key)),y=toNumber(researchGet(row.snapshot,b.key));
      if(x!==null&&y!==null){xs.push(x);ys.push(y);}
    }
    const corr=researchCorrelation(xs,ys);
    if(corr!==null) pairs.push({a:a.key,b:b.key,aLabel:a.label,bLabel:b.label,n:xs.length,correlation:round(corr,3),absCorrelation:round(Math.abs(corr),3)});
  }
  const high=pairs.filter(x=>x.n>=20&&x.absCorrelation>=0.85).sort((a,b)=>b.absCorrelation-a.absCorrelation);
  return {
    researchOnly:true,decisionImpact:false,method:"PAIRWISE_PEARSON_FULL_FORMAL_SCAN",
    fullSnapshotRows:rows.length,pairCount:pairs.length,highRedundancyCount:high.length,
    highRedundancyPairs:high.slice(0,30),
    status:rows.length<30?"ACCUMULATING":high.length?"REVIEW_REQUIRED":"NO_HIGH_REDUNDANCY_DETECTED",
    rule:"高度相關不代表因子無效，但代表可能重複計算同一訊息；任何正式升級前需檢查增量效果，禁止只因兩個相關因子都漂亮就雙重加權。"
  };
}

function researchCostStress(outcomes) {
  const selected=(outcomes||[]).filter(x=>x.cohort==="SELECTED"&&Number.isFinite(x.horizons?.d5?.returnPct));
  const gross=selected.map(x=>Number(x.horizons.d5.returnPct));
  const scenarios=[30,60,100].map(roundTripBps=>{
    const frictionPct=roundTripBps/100;
    const net=gross.map(x=>x-frictionPct);
    return {roundTripBps,n:net.length,avgNetPct:net.length?round(counterfactualMean(net),2):null,
      positivePct:net.length?round(net.filter(x=>x>0).length/net.length*100,2):null};
  });
  return {
    researchOnly:true,decisionImpact:false,selectedD5Samples:gross.length,
    grossAvgPct:gross.length?round(counterfactualMean(gross),2):null,
    scenarios,
    status:gross.length<30?"ACCUMULATING":"DESCRIPTIVE_READY",
    rule:"成本壓力測試僅做研究，不假設實際成交成本固定；先用30/60/100bps round-trip情境檢查效果是否脆弱。"
  };
}

function researchGovernanceMaturity(snapshotRows,study,counterfactual,regimePersistence,shadowIntegrity,redundancy,costStress) {
  const full=(snapshotRows||[]).filter(row=>row?.snapshot?.sourceCompleteness==="FULL_FORMAL_SCAN");
  const fullDates=[...new Set(full.map(row=>String(row.scan_date||"")).filter(Boolean))].sort();
  const years=[...new Set(fullDates.map(x=>x.slice(0,4)).filter(Boolean))];
  const regimes=[...new Set(full.map(row=>row?.snapshot?.market?.regime||row?.market_regime).filter(x=>x&&x!=="UNKNOWN"))];
  const sectors=[...new Set(full.map(row=>row?.snapshot?.sector?.name||row?.sector).filter(Boolean))];
  const legacy=researchPromotionGate(study);
  const blockers=[...(legacy?.reasons||[])];
  if(full.length<30) blockers.push("前瞻FULL_FORMAL_SCAN快照少於30筆");
  if(fullDates.length<15) blockers.push("前瞻完整快照尚未涵蓋15個獨立選股日");
  if(years.length<2) blockers.push("前瞻完整快照尚未跨至少2個年度");
  if(regimes.length<2) blockers.push("前瞻完整快照尚未跨至少2種市場狀態");
  if((counterfactual?.coverage?.d5||0)<60) blockers.push("Shadow D5成熟結果少於60筆");
  if((regimePersistence?.usableDays||0)<15) blockers.push("Regime/Persistence可用正式研究日少於15日");
  if(shadowIntegrity?.status==="RESEARCH_DATA_GAP") blockers.push("Shadow Archive存在資料完整性缺口");
  if(redundancy?.status==="REVIEW_REQUIRED") blockers.push("存在高冗餘因子組，需完成增量效果檢查");
  if((costStress?.selectedD5Samples||0)<30) blockers.push("正式SELECTED D5成本壓力樣本少於30筆");
  return {
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    eligibleForFormalReview:blockers.length===0,
    blockers:[...new Set(blockers)],
    evidence:{
      fullProspectiveSnapshots:full.length,fullProspectiveScanDates:fullDates.length,years:years.length,
      regimes:regimes.length,sectors:sectors.length,shadowD5Mature:counterfactual?.coverage?.d5||0,
      regimeUsableDays:regimePersistence?.usableDays||0,redundancyStatus:redundancy?.status||"UNKNOWN",
      costStressStatus:costStress?.status||"UNKNOWN",shadowIntegrityStatus:shadowIntegrity?.status||"UNKNOWN"
    },
    policy:"這是升級審查資格 gate，不是自動升級器。即使 blockers=0，也只能提出獨立版本審查；不得自動修改正式A/B線、排名、資金、監控、推播或交易。"
  };
}