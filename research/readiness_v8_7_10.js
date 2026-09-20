function researchReadinessEligibleDateStats(outcomes,predicate,minRowsPerDate=1) {
  const grouped=new Map();
  for(const row of outcomes||[]) {
    if(!predicate(row)) continue;
    const date=String(row?.scanDate||"");
    if(!date) continue;
    if(!grouped.has(date)) grouped.set(date,[]);
    grouped.get(date).push(row);
  }
  const accepted=[...grouped.entries()].filter(([,rows])=>rows.length>=minRowsPerDate);
  return {
    samples:accepted.reduce((sum,[,rows])=>sum+rows.length,0),
    independentScanDates:accepted.length,
    scanDates:accepted.map(([date])=>date).sort()
  };
}

function researchReadinessEvidenceFromOutcomes(outcomes,twoEngineStudy=null) {
  const rows=Array.isArray(outcomes)?outcomes:[];
  const d5=researchReadinessEligibleDateStats(rows,x=>Number.isFinite(x?.horizons?.d5?.returnPct),1);
  const breakout=researchReadinessEligibleDateStats(rows,x=>
    Number.isFinite(x?.horizons?.d5?.returnPct) &&
    ["HELD_3D","FAILED_CLOSE_WITHIN_3D"].includes(String(x?.breakout?.status||"")),1);
  const residual=researchReadinessEligibleDateStats(rows,x=>
    Number.isFinite(x?.horizons?.d5?.returnPct) &&
    Number.isFinite(researchNumber(x?.snapshot?.price?.residualSectorRs20)),4);
  const timing=researchReadinessEligibleDateStats(rows,x=>
    Number.isFinite(x?.firstDay?.overnightPct) &&
    Number.isFinite(x?.firstDay?.intradayPct),1);
  const attention=researchReadinessEligibleDateStats(rows,x=>
    Number.isFinite(x?.horizons?.d5?.returnPct) &&
    Number.isFinite(researchNumber(x?.snapshot?.price?.residualSectorRs20)) &&
    Number.isFinite(researchNumber(x?.snapshot?.volume?.volumeTodayVsPrev5)),4);
  const selection=researchPairedSelectionAlpha(rows);
  const broadD5=selection?.byComparator?.BROAD_CONTROL?.d5||{};
  const held=rows.filter(x=>x?.breakout?.status==="HELD_3D"&&Number.isFinite(x?.horizons?.d5?.returnPct)).length;
  const failed=rows.filter(x=>x?.breakout?.status==="FAILED_CLOSE_WITHIN_3D"&&Number.isFinite(x?.horizons?.d5?.returnPct)).length;
  const quiet=researchQuietAttentionStudy(rows)?.groups||{};
  const years=[...new Set(rows.map(x=>String(x?.scanDate||"").slice(0,4)).filter(x=>/^\d{4}$/.test(x)))].sort();
  const study=twoEngineStudy||researchTwoEngineStudy(rows);
  return {
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    totalRows:rows.length,d5Samples:d5.samples,d5IndependentScanDates:d5.independentScanDates,years,
    experiments:{
      R01:{matureD5Samples:breakout.samples,independentScanDates:breakout.independentScanDates,held3D:held,failedClose3D:failed},
      R02:{selectionPairedD5Dates:Number(broadD5.pairedDates||0),selectionD5Avg:broadD5.avg??null},
      R04:{matureD5Samples:residual.samples,independentScanDates:residual.independentScanDates},
      R05:{matureD1TimingSamples:timing.samples,independentScanDates:timing.independentScanDates},
      R07:{
        matureD5Samples:attention.samples,independentScanDates:attention.independentScanDates,
        quietStrengthSamples:Number(quiet.QUIET_STRENGTH?.n||0),
        attentionStrengthSamples:Number(quiet.ATTENTION_STRENGTH?.n||0)
      },
      R08:{
        assignments:Number(study?.assignments||0),
        pairedD5Dates:Number(study?.paired?.d5?.pairedDates||0),
        pairedD10Dates:Number(study?.paired?.d10?.pairedDates||0),
        pairedD20Dates:Number(study?.paired?.d20?.pairedDates||0)
      }
    }
  };
}

function researchReadinessRegimeCount(regimePersistence) {
  const states=new Set();
  for(const key of Object.keys(regimePersistence?.transitions||{})) {
    const parts=String(key).split("->").map(x=>x.trim()).filter(Boolean);
    parts.forEach(x=>states.add(x));
  }
  return states.size;
}

function researchReadinessRow(id,title,evidence,checks,dataQualityBlocked=false) {
  const blockers=[];
  for(const check of checks) if(!check.ok) blockers.push(check.blocker);
  let status="ACCUMULATING";
  if(dataQualityBlocked) status="DATA_QUALITY_BLOCKED";
  else if(checks.some(x=>x.waiting===true)) status="WAITING_DATA";
  else if(blockers.length===0) status="DESCRIPTIVE_READY";
  return {
    id,title,status,evidence,
    blockers:dataQualityBlocked?["Shadow Archive存在資料完整性缺口，先修資料再解讀研究。",...blockers]:blockers,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}

function researchEvidenceReadinessMatrix(baseEvidence,counterfactual,executionAlpha,regimePersistence,externalEvidence,shadowIntegrity) {
  const base=baseEvidence||{experiments:{}};
  const exp=base.experiments||{};
  const dataQualityBlocked=shadowIntegrity?.status==="RESEARCH_DATA_GAP";
  const regimeCount=researchReadinessRegimeCount(regimePersistence);
  const regimeUsableDays=Number(regimePersistence?.usableDays||0);
  const executionCount=Number(executionAlpha?.buyTriggeredPlans||0);
  const selectedPlans=Number(executionAlpha?.selectedPlans||0);
  const externalRows=Number(externalEvidence?.total||0);
  const externalDates=Number(externalEvidence?.dates||0);

  const rows=[
    researchReadinessRow("R01","成功突破 vs 假突破",exp.R01||{},[
      {ok:Number(exp.R01?.matureD5Samples||0)>=60,blocker:"D5成熟突破樣本少於60筆",waiting:Number(exp.R01?.matureD5Samples||0)===0},
      {ok:Number(exp.R01?.independentScanDates||0)>=15,blocker:"獨立選股日少於15日"},
      {ok:Number(exp.R01?.held3D||0)>0,blocker:"尚無HELD_3D成熟樣本"},
      {ok:Number(exp.R01?.failedClose3D||0)>0,blocker:"尚無FAILED_CLOSE_WITHIN_3D成熟樣本"}
    ],dataQualityBlocked),
    researchReadinessRow("R02","Selection Alpha vs Execution Alpha",{
      ...(exp.R02||{}),buyTriggeredPlans:executionCount,selectedPlans
    },[
      {ok:Number(exp.R02?.selectionPairedD5Dates||0)>=20,blocker:"Selection Alpha D5同日配對少於20日",waiting:Number(exp.R02?.selectionPairedD5Dates||0)===0}
    ],dataQualityBlocked),
    researchReadinessRow("R03","產業輪動與 Persistence",{
      usableDays:regimeUsableDays,regimeCount,
      top5SectorRetentionPct:regimePersistence?.top5SectorRetentionPct?.avg??null
    },[
      {ok:regimeUsableDays>=15,blocker:"Regime/Persistence可用正式研究日少於15日",waiting:regimeUsableDays===0}
    ],dataQualityBlocked),
    researchReadinessRow("R04","Residual RS",exp.R04||{},[
      {ok:Number(exp.R04?.matureD5Samples||0)>=60,blocker:"Residual RS D5成熟樣本少於60筆",waiting:Number(exp.R04?.matureD5Samples||0)===0},
      {ok:Number(exp.R04?.independentScanDates||0)>=15,blocker:"Residual RS獨立選股日少於15日"}
    ],dataQualityBlocked),
    researchReadinessRow("R05","盤中動能 vs 隔夜動能",exp.R05||{},[
      {ok:Number(exp.R05?.matureD1TimingSamples||0)>=60,blocker:"盤中/隔夜可比樣本少於60筆",waiting:Number(exp.R05?.matureD1TimingSamples||0)===0},
      {ok:Number(exp.R05?.independentScanDates||0)>=15,blocker:"盤中/隔夜獨立選股日少於15日"}
    ],dataQualityBlocked),
    researchReadinessRow("R06","Market Regime Transition",{
      usableDays:regimeUsableDays,regimeCount,transitions:regimePersistence?.transitions||{}
    },[
      {ok:regimeUsableDays>=15,blocker:"Regime可用正式研究日少於15日",waiting:regimeUsableDays===0},
      {ok:regimeCount>=2,blocker:"尚未涵蓋至少2種Market Regime"}
    ],dataQualityBlocked),
    researchReadinessRow("R07","Quiet Strength vs Attention Strength",exp.R07||{},[
      {ok:Number(exp.R07?.matureD5Samples||0)>=60,blocker:"Quiet/Attention D5成熟樣本少於60筆",waiting:Number(exp.R07?.matureD5Samples||0)===0},
      {ok:Number(exp.R07?.independentScanDates||0)>=15,blocker:"Quiet/Attention獨立選股日少於15日"},
      {ok:Number(exp.R07?.quietStrengthSamples||0)>0,blocker:"尚無Quiet Strength成熟樣本"},
      {ok:Number(exp.R07?.attentionStrengthSamples||0)>0,blocker:"尚無Attention Strength成熟樣本"}
    ],dataQualityBlocked),
    researchReadinessRow("R08","Two-Engine Momentum",{
      ...(exp.R08||{}),externalEvidenceRows:externalRows,externalEvidenceDates:externalDates
    },[
      {ok:Number(exp.R08?.pairedD5Dates||0)>=20,blocker:"Two-Engine D5同日配對少於20日",waiting:Number(exp.R08?.pairedD5Dates||0)===0}
    ],dataQualityBlocked)
  ];

  return {
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    status:dataQualityBlocked?"DATA_QUALITY_BLOCKED":rows.every(x=>x.status==="DESCRIPTIVE_READY")?"ALL_DESCRIPTIVE_READY":"ACCUMULATING",
    descriptiveReady:rows.filter(x=>x.status==="DESCRIPTIVE_READY").length,
    accumulating:rows.filter(x=>x.status==="ACCUMULATING").length,
    waitingData:rows.filter(x=>x.status==="WAITING_DATA").length,
    dataQualityBlocked:rows.filter(x=>x.status==="DATA_QUALITY_BLOCKED").length,
    experiments:rows,
    sharedEvidence:{
      shadowIntegrityStatus:shadowIntegrity?.status||"UNKNOWN",
      d5Samples:Number(base.d5Samples||0),
      d5IndependentScanDates:Number(base.d5IndependentScanDates||0),
      years:Array.isArray(base.years)?base.years:[],
      regimeUsableDays,regimeCount,
      externalEvidenceRows:externalRows,externalEvidenceDates:externalDates
    },
    policy:"Readiness Matrix只把既有研究門檻集中成機器可讀狀態；DESCRIPTIVE_READY不等於可升級正式核心，更不等於買賣訊號。正式升級仍受PURGED_FORWARD_HOLDOUT、跨年度/Regime、成本、冗餘、日期群聚穩健性與人工重要策略決策限制。"
  };
}
