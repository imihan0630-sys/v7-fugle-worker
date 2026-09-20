function researchNumber(value) {
  if(value===null || value===undefined || value==="") return null;
  const n=Number(value);
  return Number.isFinite(n)?n:null;
}

function counterfactualMean(values) {
  const xs=(values||[]).map(Number).filter(Number.isFinite);
  return xs.length ? xs.reduce((a,b)=>a+b,0)/xs.length : null;
}

function counterfactualMedian(values) {
  const xs=(values||[]).map(Number).filter(Number.isFinite).sort((a,b)=>a-b);
  if(!xs.length) return null;
  const mid=Math.floor(xs.length/2);
  return xs.length%2 ? xs[mid] : (xs[mid-1]+xs[mid])/2;
}

function counterfactualMetricStats(values) {
  const xs=(values||[]).map(Number).filter(Number.isFinite);
  if(!xs.length) return {n:0,avg:null,median:null,positivePct:null};
  return {
    n:xs.length,
    avg:round(counterfactualMean(xs),2),
    median:round(counterfactualMedian(xs),2),
    positivePct:round(xs.filter(x=>x>0).length/xs.length*100,2)
  };
}

function researchShadowBreakoutReference(snapshot) {
  const direct=researchNumber(snapshot?.price?.breakoutReferencePriceResearch);
  if(direct!==null && direct>0) return direct;
  const close=researchNumber(snapshot?.price?.close);
  const distance=researchNumber(snapshot?.price?.breakoutDistancePct);
  if(close!==null && close>0 && distance!==null && distance>-99) return close/(1+distance/100);
  return null;
}

function researchShadowOutcomeForRow(row,bars) {
  const snapshot=row?.snapshot||{};
  const baseline=researchNumber(snapshot?.price?.close);
  const scanDate=String(row?.scan_date||row?.scanDate||"").slice(0,10);
  const post=(Array.isArray(bars)?bars:[])
    .filter(bar=>String(bar?.date||"").slice(0,10)>scanDate && researchNumber(bar?.close)!==null)
    .sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  const metricForSlice=slice=>{
    if(!slice.length || !(baseline>0)) return null;
    const highs=slice.map(x=>researchNumber(x?.high)??researchNumber(x?.close)).filter(Number.isFinite);
    const lows=slice.map(x=>researchNumber(x?.low)??researchNumber(x?.close)).filter(Number.isFinite);
    const last=slice.at(-1),lastClose=researchNumber(last?.close);
    const maxHigh=highs.length?Math.max(...highs):null,minLow=lows.length?Math.min(...lows):null;
    return {
      tradingDays:slice.length,
      asOfDate:String(last?.date||"").slice(0,10),
      returnPct:lastClose===null?null:round((lastClose/baseline-1)*100,2),
      mfePct:maxHigh===null?null:round((maxHigh/baseline-1)*100,2),
      maePct:minLow===null?null:round((minLow/baseline-1)*100,2)
    };
  };
  const horizons={};
  for(const h of [1,3,5,10,20]) horizons["d"+h]=post.length>=h?metricForSlice(post.slice(0,h)):null;
  const next=post[0]||null,nextOpen=researchNumber(next?.open),nextClose=researchNumber(next?.close);
  const overnightPct=baseline>0 && nextOpen!==null && nextOpen>0 ? round((nextOpen/baseline-1)*100,2) : null;
  const intradayPct=nextOpen!==null && nextOpen>0 && nextClose!==null ? round((nextClose/nextOpen-1)*100,2) : null;
  const breakoutReference=researchShadowBreakoutReference(snapshot);
  const breakoutActive=breakoutReference!==null && baseline!==null && baseline>=breakoutReference;
  const first3=post.slice(0,3);
  const closeFail=breakoutActive ? first3.find(x=>(researchNumber(x?.close)??Infinity)<breakoutReference) : null;
  const intradayViolation=breakoutActive ? first3.find(x=>(researchNumber(x?.low)??Infinity)<breakoutReference) : null;
  let breakoutStatus="NO_REFERENCE";
  if(breakoutReference!==null) {
    if(!breakoutActive) breakoutStatus="NOT_ACTIVE_AT_SCAN";
    else if(closeFail) breakoutStatus="FAILED_CLOSE_WITHIN_3D";
    else if(first3.length>=3) breakoutStatus="HELD_3D";
    else breakoutStatus="PENDING";
  }
  return {
    scanDate,symbol:String(row?.symbol||""),name:row?.name||"",cohort:String(row?.cohort||"UNKNOWN"),
    pool:row?.pool||null,exclusionReason:row?.exclusion_reason||null,baselineClose:baseline,
    horizons,
    firstDay:{overnightPct,intradayPct,totalPct:horizons.d1?.returnPct??null,asOfDate:horizons.d1?.asOfDate??null},
    breakout:{
      reference:breakoutReference===null?null:round(breakoutReference,4),
      activeAtScan:breakoutActive,status:breakoutStatus,
      closeFailDate:closeFail?String(closeFail.date).slice(0,10):null,
      intradayViolationDate:intradayViolation?String(intradayViolation.date).slice(0,10):null,
      definition:"突破基準固定為選股日快照 priorHigh20；若選股日收盤在基準之上，未來3交易日任一收盤跌回基準下方=FAILED_CLOSE_WITHIN_3D，3日收盤皆守住=HELD_3D。"
    },
    snapshot
  };
}

function researchOutcomeCohortSummary(outcomes) {
  const groups={};
  for(const row of outcomes||[]) {
    const key=row.cohort||"UNKNOWN";
    (groups[key]||(groups[key]=[])).push(row);
  }
  const result={};
  for(const [cohort,rows] of Object.entries(groups)) {
    const horizons={};
    for(const h of [1,3,5,10,20]) {
      const metrics=rows.map(x=>x.horizons?.["d"+h]).filter(Boolean);
      horizons["d"+h]={
        returnPct:counterfactualMetricStats(metrics.map(x=>x.returnPct)),
        mfePct:counterfactualMetricStats(metrics.map(x=>x.mfePct)),
        maePct:counterfactualMetricStats(metrics.map(x=>x.maePct))
      };
    }
    result[cohort]={n:rows.length,horizons};
  }
  return result;
}

function researchPairedSelectionAlpha(outcomes) {
  const comparators=["BROAD_CONTROL","QUALIFIED_NOT_SELECTED","NEAR_MISS","REJECTED_AFTER_BASE"];
  const dates=[...new Set((outcomes||[]).map(x=>x.scanDate))].sort();
  const byComparator={};
  for(const comparator of comparators) {
    byComparator[comparator]={};
    for(const h of [1,3,5,10,20]) {
      const deltas=[];
      for(const date of dates) {
        const rows=(outcomes||[]).filter(x=>x.scanDate===date);
        const selected=rows.filter(x=>x.cohort==="SELECTED").map(x=>x.horizons?.["d"+h]?.returnPct).filter(Number.isFinite);
        const controls=rows.filter(x=>x.cohort===comparator).map(x=>x.horizons?.["d"+h]?.returnPct).filter(Number.isFinite);
        if(!selected.length || !controls.length) continue;
        deltas.push(counterfactualMean(selected)-counterfactualMean(controls));
      }
      byComparator[comparator]["d"+h]={...counterfactualMetricStats(deltas),pairedDates:deltas.length,
        interpretation:deltas.length>=20?"DESCRIPTIVE_READY":"ACCUMULATING"};
    }
  }
  return {
    method:"SAME_SCAN_DATE_PAIRED_COHORT_DELTA",
    byComparator,
    rule:"每個選股日先算 SELECTED 平均報酬減同日對照組平均報酬，再跨日彙總；不以不同市場日期互相比較。少於20個成熟配對日只累積、不下結論。"
  };
}

function researchExecutionAlphaFromRows(plans,signals) {
  const firstBuy=new Map();
  for(const row of (signals||[]).slice().sort((a,b)=>String(a.occurred_at||"").localeCompare(String(b.occurred_at||"")))) {
    if(String(row.signal_type)!=="BUY" || researchNumber(row.market_price)===null) continue;
    const key=String(row.plan_scan_date||"")+"|"+String(row.symbol||"");
    if(!firstBuy.has(key)) firstBuy.set(key,row);
  }
  const rows=[];
  for(const plan of plans||[]) {
    const key=String(plan.scan_date||"")+"|"+String(plan.symbol||"");
    const buy=firstBuy.get(key);
    const formal=researchNumber(plan.formal_close),entry=researchNumber(buy?.market_price);
    if(!(formal>0) || !(entry>0)) continue;
    const low=researchNumber(plan.buy_low),high=researchNumber(plan.buy_high);
    const mid=low!==null&&high!==null?(low+high)/2:null;
    rows.push({
      scanDate:String(plan.scan_date),symbol:String(plan.symbol),name:plan.name||"",
      formalClose:formal,entryPrice:entry,entryTime:buy.occurred_at||null,
      entryTimingPct:round((formal-entry)/formal*100,2),
      buyBandMidAlphaPct:mid>0?round((mid-entry)/mid*100,2):null
    });
  }
  const selected=(plans||[]).length;
  return {
    researchOnly:true,decisionImpact:false,
    definition:"Execution Alpha 先以首次正式 BUY 實際價相對選股日收盤價的價格改善衡量；正值=等到較低價格才進。選股日收盤價只是研究基準，不是假設可成交價。",
    selectedPlans:selected,buyTriggeredPlans:rows.length,buyTriggerRate:selected?round(rows.length/selected*100,2):null,
    entryTimingPct:counterfactualMetricStats(rows.map(x=>x.entryTimingPct)),
    buyBandMidAlphaPct:counterfactualMetricStats(rows.map(x=>x.buyBandMidAlphaPct)),
    rows:rows.slice(-80)
  };
}

async function readExecutionAlphaResearch(env,days=90) {
  if(!env?.V7_DB) return {researchOnly:true,selectedPlans:0,buyTriggeredPlans:0};
  await ensureD1Schema(env);
  const safeDays=Math.max(1,Math.min(180,Number(days)||90));
  const fromDate=shiftDateString(taiwanDate(),-(safeDays-1));
  const session=env.V7_DB.withSession("first-primary");
  const [p,s]=await Promise.all([
    session.prepare("SELECT scan_date,symbol,name,formal_close,buy_low,buy_high FROM v8_trade_journal_plans WHERE scan_date>=?1 ORDER BY scan_date ASC,symbol ASC").bind(fromDate).all(),
    session.prepare("SELECT plan_scan_date,symbol,occurred_at,market_price,signal_type FROM v8_trade_journal_signals WHERE trade_date>=?1 AND signal_type='BUY' ORDER BY occurred_at ASC").bind(fromDate).all()
  ]);
  return researchExecutionAlphaFromRows(p?.results||[],s?.results||[]);
}

function researchRegimePersistenceFromDays(days) {
  const usable=(days||[]).filter(x=>x?.market?.regime && x.market.regime!=="UNKNOWN").sort((a,b)=>String(a.scanDate).localeCompare(String(b.scanDate)));
  const transitions={},retentions=[];
  const streak={},maxStreak={};
  for(let i=0;i<usable.length;i++) {
    const currentTop=(usable[i].market?.topSectors||[]).slice(0,5).map(x=>String(x.industry||"")).filter(Boolean);
    const currentSet=new Set(currentTop);
    for(const key of Object.keys(streak)) if(!currentSet.has(key)) streak[key]=0;
    for(const sector of currentTop) {
      streak[sector]=(streak[sector]||0)+1;
      maxStreak[sector]=Math.max(maxStreak[sector]||0,streak[sector]);
    }
    if(i>0) {
      const prev=usable[i-1],transition=String(prev.market.regime)+"->"+String(usable[i].market.regime);
      transitions[transition]=(transitions[transition]||0)+1;
      const prevTop=new Set((prev.market?.topSectors||[]).slice(0,5).map(x=>String(x.industry||"")).filter(Boolean));
      if(prevTop.size && currentSet.size) {
        const overlap=[...currentSet].filter(x=>prevTop.has(x)).length;
        retentions.push(overlap/Math.min(prevTop.size,currentSet.size)*100);
      }
    }
  }
  return {
    researchOnly:true,decisionImpact:false,usableDays:usable.length,transitions,
    top5SectorRetentionPct:counterfactualMetricStats(retentions),
    longestTop5Streak:Object.entries(maxStreak).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([sector,days])=>({sector,days})),
    rule:"Regime transition 與產業 persistence 只使用前瞻正式研究日；UNKNOWN/歷史重建市場狀態不補值。"
  };
}

async function readResearchRegimePersistence(env,days=180) {
  if(!env?.V7_DB) return researchRegimePersistenceFromDays([]);
  await ensureD1Schema(env);
  const safeDays=Math.max(1,Math.min(365,Number(days)||180));
  const fromDate=shiftDateString(taiwanDate(),-(safeDays-1));
  const result=await env.V7_DB.withSession("first-primary").prepare("SELECT scan_date,market_json FROM trade_research_days WHERE scan_date>=?1 ORDER BY scan_date ASC").bind(fromDate).all();
  const rows=[];
  for(const row of result?.results||[]) {
    try { rows.push({scanDate:String(row.scan_date),market:JSON.parse(row.market_json||"{}")}); } catch(_) {}
  }
  return researchRegimePersistenceFromDays(rows);
}

function researchDailyMedianStudy(outcomes,valueFn,labelHigh,labelLow) {
  const buckets={[labelHigh]:[],[labelLow]:[]};
  const dates=[...new Set((outcomes||[]).map(x=>x.scanDate))];
  for(const date of dates) {
    const rows=(outcomes||[]).filter(x=>x.scanDate===date && Number.isFinite(x.horizons?.d5?.returnPct) && Number.isFinite(valueFn(x)));
    if(rows.length<4) continue;
    const med=counterfactualMedian(rows.map(valueFn));
    for(const row of rows) buckets[valueFn(row)>=med?labelHigh:labelLow].push(row.horizons.d5.returnPct);
  }
  return Object.fromEntries(Object.entries(buckets).map(([k,v])=>[k,counterfactualMetricStats(v)]));
}

function researchQuietAttentionStudy(outcomes) {
  const buckets={QUIET_STRENGTH:[],ATTENTION_STRENGTH:[],QUIET_WEAK:[],ATTENTION_WEAK:[]};
  const dates=[...new Set((outcomes||[]).map(x=>x.scanDate))];
  for(const date of dates) {
    const rows=(outcomes||[]).filter(x=>x.scanDate===date && Number.isFinite(x.horizons?.d5?.returnPct) &&
      Number.isFinite(researchNumber(x.snapshot?.price?.residualSectorRs20)) &&
      Number.isFinite(researchNumber(x.snapshot?.volume?.volumeTodayVsPrev5)));
    if(rows.length<4) continue;
    const strengthMed=counterfactualMedian(rows.map(x=>researchNumber(x.snapshot.price.residualSectorRs20)));
    const attentionMed=counterfactualMedian(rows.map(x=>researchNumber(x.snapshot.volume.volumeTodayVsPrev5)));
    for(const row of rows) {
      const strong=researchNumber(row.snapshot.price.residualSectorRs20)>=strengthMed;
      const attention=researchNumber(row.snapshot.volume.volumeTodayVsPrev5)>=attentionMed;
      const key=strong?(attention?"ATTENTION_STRENGTH":"QUIET_STRENGTH"):(attention?"ATTENTION_WEAK":"QUIET_WEAK");
      buckets[key].push(row.horizons.d5.returnPct);
    }
  }
  return {
    method:"WITHIN_SCAN_DATE_MEDIAN_SPLIT",
    groups:Object.fromEntries(Object.entries(buckets).map(([k,v])=>[k,counterfactualMetricStats(v)])),
    rule:"Attention 目前只用當日相對量 volumeTodayVsPrev5 當 proxy，不等同新聞/搜尋注意力；每個選股日用 Shadow 橫截面中位數切分，避免任意固定倍量門檻。"
  };
}

function buildShadowResearchDiagnostics(outcomes) {
  const d1=(outcomes||[]).filter(x=>Number.isFinite(x.firstDay?.overnightPct)&&Number.isFinite(x.firstDay?.intradayPct));
  const held=(outcomes||[]).filter(x=>x.breakout?.status==="HELD_3D");
  const failed=(outcomes||[]).filter(x=>x.breakout?.status==="FAILED_CLOSE_WITHIN_3D");
  const active=(outcomes||[]).filter(x=>x.breakout?.activeAtScan);
  return {
    breakout:{
      activeAtScan:active.length,held3D:held.length,failedClose3D:failed.length,pending:active.filter(x=>x.breakout?.status==="PENDING").length,
      heldD5:counterfactualMetricStats(held.map(x=>x.horizons?.d5?.returnPct)),
      failedD5:counterfactualMetricStats(failed.map(x=>x.horizons?.d5?.returnPct)),
      definition:"成功/假突破先固定3交易日收盤守住/跌回 priorHigh20，不因結果修改窗口。"
    },
    intradayVsOvernight:{
      n:d1.length,overnightPct:counterfactualMetricStats(d1.map(x=>x.firstDay.overnightPct)),
      intradayPct:counterfactualMetricStats(d1.map(x=>x.firstDay.intradayPct)),
      spreadIntradayMinusOvernightPct:counterfactualMetricStats(d1.map(x=>x.firstDay.intradayPct-x.firstDay.overnightPct))
    },
    residualRS:researchDailyMedianStudy(outcomes,x=>researchNumber(x.snapshot?.price?.residualSectorRs20),"HIGH_RESIDUAL_RS","LOW_RESIDUAL_RS"),
    quietVsAttention:researchQuietAttentionStudy(outcomes)
  };
}

async function readShadowCounterfactualResearch(env,days=90) {
  if(!env?.V7_DB) return {researchOnly:true,decisionImpact:false,archivedRows:0,outcomeRows:0};
  await ensureD1Schema(env);
  const safeDays=Math.max(1,Math.min(120,Number(days)||90));
  const fromDate=shiftDateString(taiwanDate(),-(safeDays-1));
  const session=env.V7_DB.withSession("first-primary");
  const result=await session.prepare("SELECT scan_date,symbol,name,cohort,cohort_rank,selected_flag,exclusion_reason,pool,snapshot_json FROM trade_research_shadow_candidates WHERE scan_date>=?1 ORDER BY scan_date ASC,cohort ASC,cohort_rank ASC LIMIT 5000").bind(fromDate).all();
  const archived=(result?.results||[]).map(row=>{
    let snapshot={};try{snapshot=JSON.parse(row.snapshot_json||"{}")}catch(_){}
    return {...row,snapshot};
  });
  const symbols=[...new Set(archived.map(x=>String(x.symbol)).filter(Boolean))],histories={};
  for(let i=0;i<symbols.length;i+=40) {
    const chunk=symbols.slice(i,i+40),holders=chunk.map((_,idx)=>"?"+(idx+1)).join(",");
    const h=await session.prepare("SELECT symbol,history_json FROM v7_history_cache WHERE symbol IN ("+holders+")").bind(...chunk).all();
    for(const row of h?.results||[]) {
      try { histories[String(row.symbol)]=JSON.parse(row.history_json||"[]"); } catch(_) { histories[String(row.symbol)]=[]; }
    }
  }
  const outcomes=archived.map(row=>researchShadowOutcomeForRow(row,histories[String(row.symbol)]||[]));
  const coverage={};
  for(const h of [1,3,5,10,20]) coverage["d"+h]=outcomes.filter(x=>Number.isFinite(x.horizons?.["d"+h]?.returnPct)).length;
  return {
    researchOnly:true,decisionImpact:false,formalScoreImpact:false,windowDays:safeDays,
    archivedRows:archived.length,outcomeRows:outcomes.length,historySymbols:Object.keys(histories).length,coverage,
    byCohort:researchOutcomeCohortSummary(outcomes),
    selectionAlpha:researchPairedSelectionAlpha(outcomes),
    diagnostics:buildShadowResearchDiagnostics(outcomes),
    recentOutcomes:outcomes.slice(-80),
    governance:"Counterfactual 結果只用來反證與估計 selection/execution 差異；不得直接升級正式分數或硬門檻。"
  };
}
