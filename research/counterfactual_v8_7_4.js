function researchMean(values) {
  const xs=(values||[]).map(Number).filter(Number.isFinite);
  return xs.length ? xs.reduce((a,b)=>a+b,0)/xs.length : null;
}

function researchMedian(values) {
  const xs=(values||[]).map(Number).filter(Number.isFinite).sort((a,b)=>a-b);
  if(!xs.length) return null;
  const mid=Math.floor(xs.length/2);
  return xs.length%2 ? xs[mid] : (xs[mid-1]+xs[mid])/2;
}

function researchMetricStats(values) {
  const xs=(values||[]).map(Number).filter(Number.isFinite);
  if(!xs.length) return {n:0,avg:null,median:null,positivePct:null};
  return {
    n:xs.length,
    avg:round(researchMean(xs),2),
    median:round(researchMedian(xs),2),
    positivePct:round(xs.filter(x=>x>0).length/xs.length*100,2)
  };
}

function researchShadowBreakoutReference(snapshot) {
  const direct=journalNumber(snapshot?.price?.breakoutReferencePriceResearch);
  if(direct!==null && direct>0) return direct;
  const close=journalNumber(snapshot?.price?.close);
  const distance=journalNumber(snapshot?.price?.breakoutDistancePct);
  if(close!==null && close>0 && distance!==null && distance>-99) return close/(1+distance/100);
  return null;
}

function researchShadowOutcomeForRow(row,bars) {
  const snapshot=row?.snapshot||{};
  const baseline=journalNumber(snapshot?.price?.close);
  const scanDate=String(row?.scan_date||row?.scanDate||"").slice(0,10);
  const post=(Array.isArray(bars)?bars:[])
    .filter(bar=>String(bar?.date||"").slice(0,10)>scanDate && journalNumber(bar?.close)!==null)
    .sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  const metricForSlice=slice=>{
    if(!slice.length || !(baseline>0)) return null;
    const highs=slice.map(x=>journalNumber(x?.high)??journalNumber(x?.close)).filter(Number.isFinite);
    const lows=slice.map(x=>journalNumber(x?.low)??journalNumber(x?.close)).filter(Number.isFinite);
    const last=slice.at(-1),lastClose=journalNumber(last?.close);
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
  const next=post[0]||null,nextOpen=journalNumber(next?.open),nextClose=journalNumber(next?.close);
  const overnightPct=baseline>0 && nextOpen!==null && nextOpen>0 ? round((nextOpen/baseline-1)*100,2) : null;
  const intradayPct=nextOpen!==null && nextOpen>0 && nextClose!==null ? round((nextClose/nextOpen-1)*100,2) : null;
  const breakoutReference=researchShadowBreakoutReference(snapshot);
  const breakoutActive=breakoutReference!==null && baseline!==null && baseline>=breakoutReference;
  const first3=post.slice(0,3);
  const closeFail=breakoutActive ? first3.find(x=>(journalNumber(x?.close)??Infinity)<breakoutReference) : null;
  const intradayViolation=breakoutActive ? first3.find(x=>(journalNumber(x?.low)??Infinity)<breakoutReference) : null;
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
        returnPct:researchMetricStats(metrics.map(x=>x.returnPct)),
        mfePct:researchMetricStats(metrics.map(x=>x.mfePct)),
        maePct:researchMetricStats(metrics.map(x=>x.maePct))
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
        deltas.push(researchMean(selected)-researchMean(controls));
      }
      byComparator[comparator]["d"+h]={...researchMetricStats(deltas),pairedDates:deltas.length,
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
    if(String(row.signal_type)!=="BUY" || journalNumber(row.market_price)===null) continue;
    const key=String(row.plan_scan_date||"")+"|"+String(row.symbol||"");
    if(!firstBuy.has(key)) firstBuy.set(key,row);
  }
  const rows=[];
  for(const plan of plans||[]) {
    const key=String(plan.scan_date||"")+"|"+String(plan.symbol||"");
    const buy=firstBuy.get(key);
    const formal=journalNumber(plan.formal_close),entry=journalNumber(buy?.market_price);
    if(!(formal>0) || !(entry>0)) continue;
    const low=journalNumber(plan.buy_low),high=journalNumber(plan.buy_high);
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
    entryTimingPct:researchMetricStats(rows.map(x=>x.entryTimingPct)),
    buyBandMidAlphaPct:researchMetricStats(rows.map(x=>x.buyBandMidAlphaPct)),
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
    top5SectorRetentionPct:researchMetricStats(retentions),
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
    const med=researchMedian(rows.map(valueFn));
    for(const row of rows) buckets[valueFn(row)>=med?labelHigh:labelLow].push(row.horizons.d5.returnPct);
  }
  return Object.fromEntries(Object.entries(buckets).map(([k,v])=>[k,researchMetricStats(v)]));
}

function researchQuietAttentionStudy(outcomes) {
  const buckets={QUIET_STRENGTH:[],ATTENTION_STRENGTH:[],QUIET_WEAK:[],ATTENTION_WEAK:[]};
  const dates=[...new Set((outcomes||[]).map(x=>x.scanDate))];
  for(const date of dates) {
    const rows=(outcomes||[]).filter(x=>x.scanDate===date && Number.isFinite(x.horizons?.d5?.returnPct) &&
      Number.isFinite(journalNumber(x.snapshot?.price?.residualSectorRs20)) &&
      Number.isFinite(journalNumber(x.snapshot?.volume?.volumeTodayVsPrev5)));
    if(rows.length<4) continue;
    const strengthMed=researchMedian(rows.map(x=>journalNumber(x.snapshot.price.residualSectorRs20)));
    const attentionMed=researchMedian(rows.map(x=>journalNumber(x.snapshot.volume.volumeTodayVsPrev5)));
    for(const row of rows) {
      const strong=journalNumber(row.snapshot.price.residualSectorRs20)>=strengthMed;
      const attention=journalNumber(row.snapshot.volume.volumeTodayVsPrev5)>=attentionMed;
      const key=strong?(attention?"ATTENTION_STRENGTH":"QUIET_STRENGTH"):(attention?"ATTENTION_WEAK":"QUIET_WEAK");
      buckets[key].push(row.horizons.d5.returnPct);
    }
  }
  return {
    method:"WITHIN_SCAN_DATE_MEDIAN_SPLIT",
    groups:Object.fromEntries(Object.entries(buckets).map(([k,v])=>[k,researchMetricStats(v)])),
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
      heldD5:researchMetricStats(held.map(x=>x.horizons?.d5?.returnPct)),
      failedD5:researchMetricStats(failed.map(x=>x.horizons?.d5?.returnPct)),
      definition:"成功/假突破先固定3交易日收盤守住/跌回 priorHigh20，不因結果修改窗口。"
    },
    intradayVsOvernight:{
      n:d1.length,overnightPct:researchMetricStats(d1.map(x=>x.firstDay.overnightPct)),
      intradayPct:researchMetricStats(d1.map(x=>x.firstDay.intradayPct)),
      spreadIntradayMinusOvernightPct:researchMetricStats(d1.map(x=>x.firstDay.intradayPct-x.firstDay.overnightPct))
    },
    residualRS:researchDailyMedianStudy(outcomes,x=>journalNumber(x.snapshot?.price?.residualSectorRs20),"HIGH_RESIDUAL_RS","LOW_RESIDUAL_RS"),
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
