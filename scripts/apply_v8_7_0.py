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
    'const VERSION = "8.6.3-v7-current-close";',
    'const VERSION = "8.7.0-research-foundation";',
    "runtime version"
)

replace_once(
'''  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_v7_formal_scan_backfill_date
    ON v7_formal_scan_backfill(scan_date,symbol)`).run();
  D1_SCHEMA_READY = true;''',
'''  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_v7_formal_scan_backfill_date
    ON v7_formal_scan_backfill(scan_date,symbol)`).run();
  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS trade_research_days (
    scan_date TEXT PRIMARY KEY,
    market_json TEXT NOT NULL,
    sectors_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`).run();
  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS trade_research_snapshots (
    scan_date TEXT NOT NULL,
    plan_date TEXT,
    symbol TEXT NOT NULL,
    name TEXT,
    strategy TEXT,
    signal_level TEXT,
    sector TEXT,
    market_regime TEXT,
    snapshot_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY(scan_date,symbol)
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_trade_research_snapshots_symbol
    ON trade_research_snapshots(symbol,scan_date)`).run();
  D1_SCHEMA_READY = true;''',
    "research D1 schema"
)

replace_once(
'''  const ret20 = closes.length >= 21 ? (close / closes.at(-21) - 1) * 100 : null;
  const ret60 = closes.length >= 61 ? (close / closes.at(-61) - 1) * 100 : null;''',
'''  const ret5 = closes.length >= 6 ? (close / closes.at(-6) - 1) * 100 : null;
  const ret10 = closes.length >= 11 ? (close / closes.at(-11) - 1) * 100 : null;
  const ret20 = closes.length >= 21 ? (close / closes.at(-21) - 1) * 100 : null;
  const ret60 = closes.length >= 61 ? (close / closes.at(-61) - 1) * 100 : null;
  const dailyReturns20 = closes.slice(-21).map((value, i, arr) => i ? (value / arr[i - 1] - 1) * 100 : null).filter(Number.isFinite);
  const positiveDayRatio20 = dailyReturns20.length ? dailyReturns20.filter(value => value > 0).length / dailyReturns20.length * 100 : null;
  const close20 = closes.slice(-20);
  let peak20 = -Infinity, maxDrawdown20Pct = null;
  for (const value of close20) {
    peak20 = Math.max(peak20, value);
    if (peak20 > 0) {
      const dd = (value / peak20 - 1) * 100;
      maxDrawdown20Pct = maxDrawdown20Pct === null ? dd : Math.min(maxDrawdown20Pct, dd);
    }
  }''',
    "research return features"
)

replace_once(
'''  const maDistance20Pct = ma20 > 0 ? (close / ma20 - 1) * 100 : null;
  const bullishStack''',
'''  const maDistance20Pct = ma20 > 0 ? (close / ma20 - 1) * 100 : null;
  const maDistance60Pct = ma60 > 0 ? (close / ma60 - 1) * 100 : null;
  const prevClose = closes.length >= 2 ? closes.at(-2) : null;
  const gapPct = prevClose > 0 ? (open / prevClose - 1) * 100 : null;
  const breakoutDistancePct = priorHigh20 > 0 ? (close / priorHigh20 - 1) * 100 : null;
  const recentRange = n => {
    const hs=highs.slice(-n),ls=lows.slice(-n);
    if(!hs.length || !ls.length) return null;
    const hi=Math.max(...hs),lo=Math.min(...ls);
    return lo>0 ? (hi/lo-1)*100 : null;
  };
  const range5Pct=recentRange(5),range10Pct=recentRange(10),range20Pct=recentRange(20);
  const compressionScoreResearch = range20Pct>0 && range10Pct!==null && range5Pct!==null
    ? clamp(100 - (range10Pct/range20Pct)*40 - (range5Pct/range20Pct)*60,0,100) : null;
  const bullishStack''',
    "research structure features"
)

replace_once(
'''    ret20, ret60,return20StartDate:history.length>=21 ? history.at(-21).date : null,''',
'''    ret5, ret10, ret20, ret60, positiveDayRatio20, maxDrawdown20Pct,
    maDistance20Pct, maDistance60Pct, gapPct, breakoutDistancePct,
    range5Pct, range10Pct, range20Pct, compressionScoreResearch,
    return20StartDate:history.length>=21 ? history.at(-21).date : null,''',
    "return research features"
)

replace_once(
'''  const sectorStats = buildTodaySectorStats(todayRows, featureRows);
  const sectorPe=new Map();''',
'''  const sectorStats = buildTodaySectorStats(todayRows, featureRows);
  const sectorRanking=Object.entries(sectorStats).sort((a,b)=>(toNumber(b[1]?.score)||0)-(toNumber(a[1]?.score)||0));
  const sectorRankMap=new Map(sectorRanking.map(([industry],index)=>[industry,index+1]));
  const marketResearchContext=buildResearchMarketContext(featureRows,todayRows,marketReturn20,sectorStats,scanDate);
  featureRows=featureRows.map(row=>({...row,researchMarketContext:marketResearchContext,researchSectorRank:sectorRankMap.get(row.industry)||null}));
  const sectorPe=new Map();''',
    "research market context"
)

replace_once(
'''    note: "V7正式策略定義：A=拉回承接，B=突破後承接。18:10分成非千金股池與千金股池獨立篩選；每池最多3檔，未達標名額留空且不得跨池挪用，合計最多6檔。"
  };''',
'''    note: "正式策略定義：A=拉回承接，B=突破後承接。18:10分成非千金股池與千金股池獨立篩選；每池最多3檔，未達標名額留空且不得跨池挪用，合計最多6檔。",
    researchMarketContext: marketResearchContext
  };''',
    "research context diagnostics"
)

replace_once(
'''      selectedReason: `${item.selectedReason}；18:10盤後日 ${scanDate}；此為隔日等待計畫，不代表開盤直接買`,
      positionStage: "NONE", pushEnabled: true''',
'''      selectedReason: `${item.selectedReason}；18:10盤後日 ${scanDate}；此為隔日等待計畫，不代表開盤直接買`,
      researchSnapshot: buildResearchSnapshot(item,scanDate),
      positionStage: "NONE", pushEnabled: true''',
    "attach research snapshot"
)


replace_once(
'''    pushEnabled: item.pushEnabled !== false
  };''',
'''    pushEnabled: item.pushEnabled !== false,
    researchSnapshot: item?.researchSnapshot && typeof item.researchSnapshot === "object" ? item.researchSnapshot : null
  };''',
    "preserve research snapshot through normalization"
)

anchor='''function journalPerformanceAggregate(rows,keyFn) {'''
helpers=r'''const RESEARCH_FACTOR_CATALOG=[
  {key:"price.residualSectorRs20",label:"產業超額RS20",direction:"HIGH"},
  {key:"price.positiveDayRatio20",label:"20日上漲日比例",direction:"HIGH"},
  {key:"price.maxDrawdown20Pct",label:"20日最大回撤",direction:"HIGH"},
  {key:"price.atrPercent",label:"ATR%",direction:"LOW"},
  {key:"price.volatility20",label:"20日波動率",direction:"LOW"},
  {key:"volume.volumeTodayVsPrev5",label:"今日/前5日量",direction:"CONTEXT"},
  {key:"setup.compressionScoreResearch",label:"波動收斂研究分數",direction:"HIGH"},
  {key:"setup.breakoutQualityResearch",label:"突破品質研究分數",direction:"HIGH"},
  {key:"setup.overheatPenaltyResearch",label:"過熱懲罰研究分數",direction:"LOW"},
  {key:"institution.score",label:"法人品質分數",direction:"HIGH"},
  {key:"fundamental.score",label:"基本面品質分數",direction:"HIGH"},
  {key:"sector.rank",label:"產業強度排名",direction:"LOW"}
];

function buildResearchMarketContext(featureRows,todayRows,marketReturn20,sectorStats,scanDate) {
  const features=Array.isArray(featureRows)?featureRows:[];
  const rows=Array.isArray(todayRows)?todayRows:[];
  const adv=rows.filter(row=>(toNumber(row.changePercent)||0)>0).length;
  const dec=rows.filter(row=>(toNumber(row.changePercent)||0)<0).length;
  const flat=Math.max(0,rows.length-adv-dec);
  const above20=features.filter(row=>row.ma20>0 && row.close>row.ma20).length;
  const above60=features.filter(row=>row.ma60>0 && row.close>row.ma60).length;
  const newHigh20=features.filter(row=>row.priorHigh20>0 && row.close>=row.priorHigh20).length;
  const breadth20=features.length?above20/features.length*100:null;
  const market20=toNumber(marketReturn20);
  let regime="MIXED";
  if(market20!==null && breadth20!==null) {
    if(market20>=3 && breadth20>=55) regime="BULL_BROAD";
    else if(market20<=-3 && breadth20<=45) regime="BEAR_BROAD";
    else if(market20>=0 && breadth20<45) regime="INDEX_STRONG_BREADTH_WEAK";
    else if(market20<0 && breadth20>=55) regime="BREADTH_RECOVERY";
  }
  const sectors=Object.entries(sectorStats||{}).sort((a,b)=>(toNumber(b[1]?.score)||0)-(toNumber(a[1]?.score)||0))
    .slice(0,20).map(([industry,stat],index)=>({rank:index+1,industry,score:round(toNumber(stat?.score)||0,2),
      breadth:round(toNumber(stat?.breadth)||0,2),avgChange:round(toNumber(stat?.avgChange)||0,2),
      amountVs20DayAverage:toNumber(stat?.amountVs20DayAverage)}));
  return {
    schemaVersion:"research-market-v1",scanDate,researchOnly:true,decisionImpact:false,
    regime,marketReturn20:market20===null?null:round(market20,2),
    advanceCount:adv,declineCount:dec,flatCount:flat,
    advancePct:rows.length?round(adv/rows.length*100,2):null,
    aboveMa20Pct:features.length?round(above20/features.length*100,2):null,
    aboveMa60Pct:features.length?round(above60/features.length*100,2):null,
    newHigh20Pct:features.length?round(newHigh20/features.length*100,2):null,
    topSectors:sectors
  };
}

function buildResearchSnapshot(item,scanDate) {
  const setup=strategySetupState(item);
  const market=item?.researchMarketContext||{};
  const institutional=institutionalScore(item);
  const fundamental=fundamentalScore(item);
  const sectorRank=journalInteger(item?.researchSectorRank);
  const residualSectorRs=toNumber(item?.sectorRelativeStrength) ?? (
    toNumber(item?.ret20)!==null && toNumber(item?.sectorReturn20)!==null ? toNumber(item.ret20)-toNumber(item.sectorReturn20) : null
  );
  const breakoutQuality=clamp(
    (toNumber(item?.dailyClosePosition)||0)*35 +
    (1-clamp(toNumber(item?.dailyUpperShadowRatio)||0,0,1))*25 +
    clamp((toNumber(item?.volumeTodayVsPrev5)||0)/2,0,1)*25 +
    clamp(((toNumber(item?.breakoutDistancePct)||0)+1)/4,0,1)*15,0,100
  );
  const overheatPenalty=clamp(
    Math.max(0,(toNumber(item?.ret20)||0)-20)*1.6 +
    Math.max(0,(toNumber(item?.maDistance20Pct)||0)-12)*2.2 +
    Math.max(0,(toNumber(item?.atrPercent)||0)-6)*5 +
    Math.max(0,Math.abs(toNumber(item?.gapPct)||0)-4)*4,0,100
  );
  return {
    schemaVersion:"research-snapshot-v1",researchOnly:true,decisionImpact:false,scanDate,
    symbol:String(item?.symbol||item?.code||""),name:item?.name||"",strategy:item?.channel==="A"?"A拉回承接":item?.channel==="B"?"B突破後承接":item?.channel||null,
    signalLevel:item?.signalLevel||null,
    market,
    sector:{
      name:item?.industry||null,rank:sectorRank,score:toNumber(item?.sectorFlow),
      return20:toNumber(item?.sectorReturn20),residualRs20:residualSectorRs===null?null:round(residualSectorRs,2)
    },
    price:{
      close:toNumber(item?.close),ret5:toNumber(item?.ret5),ret10:toNumber(item?.ret10),ret20:toNumber(item?.ret20),ret60:toNumber(item?.ret60),
      marketRs20:toNumber(item?.relativeStrength),residualSectorRs20:residualSectorRs===null?null:round(residualSectorRs,2),
      positiveDayRatio20:toNumber(item?.positiveDayRatio20),maxDrawdown20Pct:toNumber(item?.maxDrawdown20Pct),
      maDistance20Pct:toNumber(item?.maDistance20Pct),maDistance60Pct:toNumber(item?.maDistance60Pct),
      atrPercent:toNumber(item?.atrPercent),volatility20:toNumber(item?.volatility20),gapPct:toNumber(item?.gapPct),
      breakoutDistancePct:toNumber(item?.breakoutDistancePct),dailyClosePosition:toNumber(item?.dailyClosePosition),
      dailyUpperShadowRatio:toNumber(item?.dailyUpperShadowRatio)
    },
    volume:{
      avgVolume20Lots:toNumber(item?.avgVolume20Lots),avgAmount20:toNumber(item?.avgAmount20),
      volumeRatio:toNumber(item?.volumeRatio),volumeTodayVsPrev5:toNumber(item?.volumeTodayVsPrev5),
      volumeContraction5to20:toNumber(item?.volumeContraction5to20)
    },
    institution:{
      score:round(institutional,2),foreignBuyDays:journalInteger(item?.foreignBuyDays)||0,
      trustBuyDays:journalInteger(item?.trustBuyDays)||0,dealerBuyDays:journalInteger(item?.dealerBuyDays)||0,
      foreignNet:toNumber(item?.foreignNet),trustNet:toNumber(item?.trustNet),dealerNet:toNumber(item?.dealerNet),
      institutionTotalNet:toNumber(item?.institutionTotalNet),chipConcentration:toNumber(item?.chipConcentration)
    },
    fundamental:{
      score:round(fundamental,2),revenueYoY:toNumber(item?.revenueYoY),revenueMoM:toNumber(item?.revenueMoM ?? item?.revenueQoQ),
      revenueQuarterYoY:toNumber(item?.revenueQuarterYoY),revenueQoQ:toNumber(item?.revenueQoQ),revenueYTDYoY:toNumber(item?.revenueYTDYoY),
      eps:toNumber(item?.eps),epsYoY:toNumber(item?.epsYoY),grossMargin:toNumber(item?.grossMargin),
      operatingMargin:toNumber(item?.operatingMargin),priceEarningsRatio:toNumber(item?.priceEarningsRatio),priceBookRatio:toNumber(item?.priceBookRatio)
    },
    setup:{
      pullbackPct:toNumber(setup?.metrics?.pullbackPct),supportDistancePct:toNumber(setup?.metrics?.supportDistancePct),
      setupQuality:toNumber(item?.setupQuality),rewardRisk:toNumber(item?.rewardRisk),
      compressionScoreResearch:toNumber(item?.compressionScoreResearch),
      breakoutQualityResearch:round(breakoutQuality,2),overheatPenaltyResearch:round(overheatPenalty,2),
      A:setup?.A?.checks||{},B:setup?.B?.checks||{}
    },
    sourceCompleteness:"FULL_FORMAL_SCAN"
  };
}

function researchGet(obj,path) {
  return String(path||"").split(".").reduce((value,key)=>value==null?null:value[key],obj);
}

function researchMergeBars(history,currentStock,currentDate) {
  const map=new Map();
  for(const bar of (Array.isArray(history)?history:[])) {
    const date=String(bar?.date||"").slice(0,10);
    if(date) map.set(date,{...bar,date});
  }
  for(const bar of (Array.isArray(currentStock?.history)?currentStock.history:[])) {
    const date=String(bar?.date||"").slice(0,10);
    if(date) map.set(date,{...bar,date});
  }
  if(currentStock && currentDate && toNumber(currentStock.close)!==null) {
    map.set(String(currentDate).slice(0,10),{
      date:String(currentDate).slice(0,10),open:toNumber(currentStock.open),high:toNumber(currentStock.high ?? currentStock.close),
      low:toNumber(currentStock.low ?? currentStock.close),close:toNumber(currentStock.close),
      volumeShares:toNumber(currentStock.volumeShares)||0,tradeValue:toNumber(currentStock.tradeValue)||0
    });
  }
  return [...map.values()].sort((a,b)=>a.date.localeCompare(b.date));
}

function researchPathForSelection(sel,bars) {
  const baseline=journalNumber(sel?.formal_close);
  const scanDate=String(sel?.scan_date||"");
  const post=(bars||[]).filter(bar=>String(bar?.date||"").slice(0,10)>scanDate && journalNumber(bar?.close)!==null);
  const stop=journalNumber(sel?.stop),target=journalNumber(sel?.profit_check);
  const firstTarget=target===null?null:post.find(bar=>(journalNumber(bar?.high)??journalNumber(bar?.close))>=target);
  const firstStop=stop===null?null:post.find(bar=>(journalNumber(bar?.low)??journalNumber(bar?.close))<=stop);
  let firstBarrier=null;
  if(firstTarget && firstStop) {
    const td=String(firstTarget.date).slice(0,10),sd=String(firstStop.date).slice(0,10);
    firstBarrier=td===sd?"AMBIGUOUS_SAME_DAY":td<sd?"TARGET":"STOP";
  } else if(firstTarget) firstBarrier="TARGET";
  else if(firstStop) firstBarrier="STOP";
  const metricForSlice=slice=>{
    if(!slice.length || !(baseline>0)) return null;
    const highs=slice.map(bar=>journalNumber(bar?.high)??journalNumber(bar?.close)).filter(Number.isFinite);
    const lows=slice.map(bar=>journalNumber(bar?.low)??journalNumber(bar?.close)).filter(Number.isFinite);
    const last=slice.at(-1),lastClose=journalNumber(last?.close);
    const maxHigh=highs.length?Math.max(...highs):null,minLow=lows.length?Math.min(...lows):null;
    const peak=maxHigh===null?null:slice.find(bar=>(journalNumber(bar?.high)??journalNumber(bar?.close))===maxHigh);
    const trough=minLow===null?null:slice.find(bar=>(journalNumber(bar?.low)??journalNumber(bar?.close))===minLow);
    return {
      tradingDays:slice.length,asOfDate:String(last?.date||"").slice(0,10),
      returnPct:lastClose===null?null:round((lastClose-baseline)/baseline*100,2),
      mfePct:maxHigh===null?null:round((maxHigh-baseline)/baseline*100,2),
      maePct:minLow===null?null:round((minLow-baseline)/baseline*100,2),
      peakDate:peak?String(peak.date).slice(0,10):null,troughDate:trough?String(trough.date).slice(0,10):null
    };
  };
  const horizons={};
  for(const h of [1,3,5,10,20]) horizons["d"+h]=post.length>=h?metricForSlice(post.slice(0,h)):null;
  return {
    scanDate,planDate:sel?.plan_date||null,symbol:String(sel?.symbol||""),name:sel?.name||"",
    strategy:sel?.strategy||"",signalLevel:sel?.signal_level||"",formalClose:baseline,stop,target,
    observedTradingDays:post.length,latest:metricForSlice(post),horizons,
    firstTargetHitDate:firstTarget?String(firstTarget.date).slice(0,10):null,
    firstStopHitDate:firstStop?String(firstStop.date).slice(0,10):null,firstBarrier
  };
}

async function readResearchSnapshots(env,days=730) {
  if(!env?.V7_DB) return [];
  await ensureD1Schema(env);
  const fromDate=shiftDateString(taiwanDate(),-(Math.max(1,Math.min(730,Number(days)||730))-1));
  const result=await env.V7_DB.withSession("first-primary").prepare(`
    SELECT scan_date,plan_date,symbol,name,strategy,signal_level,sector,market_regime,snapshot_json,created_at,updated_at
    FROM trade_research_snapshots WHERE scan_date>=?1 ORDER BY scan_date ASC,symbol ASC
  `).bind(fromDate).all();
  return (result?.results||[]).map(row=>{
    let snapshot={};try{snapshot=JSON.parse(row.snapshot_json||"{}")}catch(_){}
    return {...row,snapshot};
  });
}

async function readSelectionPathMetrics(env,days=730) {
  if(!env?.V7_DB) return {rows:[],summary:{total:0}};
  await ensureD1Schema(env);
  const safeDays=Math.max(1,Math.min(730,Number(days)||730));
  const fromDate=shiftDateString(taiwanDate(),-(safeDays-1));
  const session=env.V7_DB.withSession("first-primary");
  const [backfillRes,journalRes]=await Promise.all([
    session.prepare(`SELECT scan_date,plan_date,symbol,name,strategy,signal_level,formal_close,stop,profit_check
      FROM v7_formal_scan_backfill WHERE scan_date>=?1`).bind(fromDate).all(),
    session.prepare(`SELECT scan_date,plan_date,symbol,name,strategy,signal_level,formal_close,stop,profit_check
      FROM v8_trade_journal_plans WHERE scan_date>=?1`).bind(fromDate).all()
  ]);
  const merged=new Map();
  for(const row of (backfillRes?.results||[])) merged.set(String(row.scan_date)+"|"+String(row.symbol),row);
  for(const row of (journalRes?.results||[])) merged.set(String(row.scan_date)+"|"+String(row.symbol),row);
  const selections=[...merged.values()];
  const symbols=[...new Set(selections.map(row=>String(row.symbol)).filter(Boolean))];
  const histories={};
  for(let i=0;i<symbols.length;i+=50) {
    const chunk=symbols.slice(i,i+50),placeholders=chunk.map((_,idx)=>"?"+(idx+1)).join(",");
    if(!chunk.length) continue;
    const result=await session.prepare("SELECT symbol,history_json FROM v7_history_cache WHERE symbol IN ("+placeholders+")").bind(...chunk).all();
    for(const row of (result?.results||[])) {
      try{histories[String(row.symbol)]=JSON.parse(row.history_json||"[]")}catch(_){histories[String(row.symbol)]=[]}
    }
  }
  const marketState=await env.STOCKS_KV?.get(MARKET_STATE_KEY,"json");
  const currentDate=marketState?.lastDate?String(marketState.lastDate).slice(0,10):null;
  const rows=selections.map(sel=>researchPathForSelection(sel,
    researchMergeBars(histories[String(sel.symbol)]||[],marketState?.stocks?.[String(sel.symbol)]||null,currentDate)
  )).sort((a,b)=>b.scanDate.localeCompare(a.scanDate)||a.symbol.localeCompare(b.symbol));
  const available=h=>rows.filter(row=>row.horizons["d"+h]!==null);
  const horizonSummary={};
  for(const h of [1,3,5,10,20]) {
    const list=available(h),returns=list.map(row=>row.horizons["d"+h].returnPct).filter(Number.isFinite);
    const mfes=list.map(row=>row.horizons["d"+h].mfePct).filter(Number.isFinite);
    const maes=list.map(row=>row.horizons["d"+h].maePct).filter(Number.isFinite);
    horizonSummary["d"+h]={
      available:list.length,pending:rows.length-list.length,
      positive:returns.filter(v=>v>0).length,
      positiveRate:returns.length?round(returns.filter(v=>v>0).length/returns.length*100,2):null,
      averageReturnPct:returns.length?round(average(returns),2):null,
      averageMfePct:mfes.length?round(average(mfes),2):null,
      averageMaePct:maes.length?round(average(maes),2):null
    };
  }
  return {rows,summary:{total:rows.length,horizons:horizonSummary},
    definition:"正式盤後入選日起算，下一交易日為第1日；追蹤1/3/5/10/20交易日報酬、MFE與MAE。日K同一天同時觸及停損與目標時標記AMBIGUOUS_SAME_DAY，不臆測先後順序。"};
}

function researchMedian(values) {
  const nums=(values||[]).filter(Number.isFinite).sort((a,b)=>a-b);
  if(!nums.length) return null;
  const mid=Math.floor(nums.length/2);
  return nums.length%2?nums[mid]:(nums[mid-1]+nums[mid])/2;
}

function factorStudyFromSnapshots(snapshotRows,pathRows,horizon=5) {
  const paths=new Map((pathRows||[]).map(row=>[row.scanDate+"|"+row.symbol,row]));
  const samples=(snapshotRows||[]).map(row=>{
    const path=paths.get(String(row.scan_date)+"|"+String(row.symbol));
    const outcome=path?.horizons?.["d"+horizon]?.returnPct;
    return {scanDate:String(row.scan_date),symbol:String(row.symbol),snapshot:row.snapshot,outcome:Number.isFinite(outcome)?outcome:null,
      regime:row.snapshot?.market?.regime||row.market_regime||"UNKNOWN"};
  }).filter(row=>row.outcome!==null);
  const dates=[...new Set(samples.map(row=>row.scanDate))].sort();
  const years=[...new Set(dates.map(date=>date.slice(0,4)))];
  const regimes=[...new Set(samples.map(row=>row.regime).filter(Boolean))];
  const splitIndex=Math.max(1,Math.floor(dates.length*0.7));
  const trainDates=new Set(dates.slice(0,splitIndex)),holdoutDates=new Set(dates.slice(splitIndex));
  const factors=RESEARCH_FACTOR_CATALOG.map(meta=>{
    const data=samples.map(sample=>({x:toNumber(researchGet(sample.snapshot,meta.key)),y:sample.outcome,scanDate:sample.scanDate}))
      .filter(point=>point.x!==null&&Number.isFinite(point.y));
    const summarize=sub=>{
      if(sub.length<6) return {n:sub.length,spreadPct:null,median:null};
      const sorted=sub.slice().sort((a,b)=>a.x-b.x),third=Math.max(1,Math.floor(sorted.length/3));
      const low=sorted.slice(0,third),high=sorted.slice(-third);
      const lowAvg=average(low.map(x=>x.y)),highAvg=average(high.map(x=>x.y));
      let spread=highAvg-lowAvg;
      if(meta.direction==="LOW") spread=-spread;
      return {n:sub.length,spreadPct:round(spread,2),median:round(researchMedian(sub.map(x=>x.x)),3)};
    };
    return {...meta,total:summarize(data),train:summarize(data.filter(x=>trainDates.has(x.scanDate))),
      holdout:summarize(data.filter(x=>holdoutDates.has(x.scanDate)))};
  });
  return {
    horizonTradingDays:horizon,sampleCount:samples.length,distinctScanDates:dates.length,distinctYears:years.length,regimes,
    trainDates:trainDates.size,holdoutDates:holdoutDates.size,factors,
    interpretation:"因子研究只做描述與樣本外一致性檢查，不直接改正式選股分數。CONTEXT因子不以單調高低判定。",
    multipleTestingGuard:"同時研究多因子容易產生資料探勘偏誤；未達升級門檻前不將單次漂亮結果視為有效規則。"
  };
}

function researchPromotionGate(study) {
  const reasons=[];
  if((study?.sampleCount||0)<60) reasons.push("5日成熟樣本少於60筆");
  if((study?.distinctScanDates||0)<15) reasons.push("獨立正式選股日至少需要15個");
  if((study?.distinctYears||0)<2) reasons.push("尚未涵蓋至少2個年度");
  if((study?.regimes||[]).length<2) reasons.push("尚未涵蓋至少2種市場狀態");
  if((study?.holdoutDates||0)<5) reasons.push("樣本外期間少於5個選股日");
  const candidates=(study?.factors||[]).filter(f=>f.direction!=="CONTEXT" && f.train?.n>=20 && f.holdout?.n>=10 &&
    toNumber(f.train?.spreadPct)>0 && toNumber(f.holdout?.spreadPct)>0);
  if(!candidates.length) reasons.push("目前沒有因子同時在訓練與樣本外維持同方向改善");
  return {
    promotionEligible:reasons.length===0,candidateFactors:candidates.map(f=>({key:f.key,label:f.label,trainSpreadPct:f.train.spreadPct,holdoutSpreadPct:f.holdout.spreadPct})),
    reasons,policy:"研究因子只有在樣本外、至少兩種市場狀態、至少兩個年度均維持改善後，才有資格提出正式核心修改；系統不會自動改正式選股規則。"
  };
}

async function backfillCurrentResearchSnapshots(env) {
  if(!env?.V7_DB || isTestMode(env)) return {ok:false,simulated:isTestMode(env),error:"Production D1 required"};
  await ensureD1Schema(env);
  const marketState=await env.STOCKS_KV?.get(MARKET_STATE_KEY,"json");
  const scanDate=marketState?.lastDate?String(marketState.lastDate).slice(0,10):null;
  if(!scanDate) throw new Error("找不到正式盤後市場狀態日期");
  const session=env.V7_DB.withSession("first-primary");
  const day=await session.prepare("SELECT diagnostics_json,plan_date FROM v8_trade_journal_days WHERE scan_date=?1").bind(scanDate).first();
  const plans=(await session.prepare("SELECT scan_date,plan_date,symbol,name,strategy,signal_level,priority_score,reward_risk FROM v8_trade_journal_plans WHERE scan_date=?1").bind(scanDate).all())?.results||[];
  if(!plans.length) throw new Error("目前市場狀態日期沒有正式交易日誌計畫");
  let diagnostics={};try{diagnostics=JSON.parse(day?.diagnostics_json||"{}")}catch(_){}
  const sectorStats=diagnostics?.industryRadar||{};
  const sectorRanking=Object.entries(sectorStats).sort((a,b)=>(toNumber(b[1]?.score)||0)-(toNumber(a[1]?.score)||0));
  const sectorRankMap=new Map(sectorRanking.map(([industry],index)=>[industry,index+1]));
  const currentRows=Object.values(marketState?.stocks||{});
  const marketContext=buildResearchMarketContext([],currentRows,toNumber(diagnostics?.marketReturn20),sectorStats,scanDate);
  let imported=0;
  for(const plan of plans) {
    const symbol=String(plan.symbol),stock=marketState?.stocks?.[symbol];
    if(!stock) continue;
    const h=await session.prepare("SELECT history_json FROM v7_history_cache WHERE symbol=?1").bind(symbol).first();
    let history=[];try{history=JSON.parse(h?.history_json||"[]")}catch(_){}
    const mergedHistory=researchMergeBars(history,stock,scanDate);
    const feature=buildMarketFeatures({...stock,history:mergedHistory});
    if(!feature) continue;
    const sector=sectorStats[feature.industry]||{};
    const item={...feature,channel:String(plan.strategy||"").startsWith("A")?"A":String(plan.strategy||"").startsWith("B")?"B":null,
      signalLevel:plan.signal_level,priorityScore:journalNumber(plan.priority_score),rewardRisk:journalNumber(plan.reward_risk),
      sectorFlow:journalNumber(sector.score),sectorReturn20:journalNumber(feature.sectorReturn20),
      relativeStrength:journalNumber(feature.ret20)!==null && journalNumber(diagnostics?.marketReturn20)!==null ? feature.ret20-diagnostics.marketReturn20 : null,
      sectorRelativeStrength:journalNumber(feature.ret20)!==null && journalNumber(feature.sectorReturn20)!==null ? feature.ret20-feature.sectorReturn20 : null,
      researchMarketContext:marketContext,researchSectorRank:sectorRankMap.get(feature.industry)||null};
    const snapshot=buildResearchSnapshot(item,scanDate);
    snapshot.sourceCompleteness="PARTIAL_CURRENT_SCAN_RECONSTRUCTION";
    const now=new Date().toISOString();
    await session.prepare(`INSERT INTO trade_research_snapshots(
      scan_date,plan_date,symbol,name,strategy,signal_level,sector,market_regime,snapshot_json,created_at,updated_at
    ) VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?10)
    ON CONFLICT(scan_date,symbol) DO UPDATE SET
      plan_date=excluded.plan_date,name=excluded.name,strategy=excluded.strategy,signal_level=excluded.signal_level,
      sector=excluded.sector,market_regime=excluded.market_regime,snapshot_json=excluded.snapshot_json,updated_at=excluded.updated_at`)
      .bind(scanDate,plan.plan_date||day?.plan_date||null,symbol,plan.name||stock.name||"",plan.strategy||null,plan.signal_level||null,
        feature.industry||null,marketContext.regime,JSON.stringify(snapshot),now).run();
    imported+=1;
  }
  const now=new Date().toISOString();
  await session.prepare(`INSERT INTO trade_research_days(scan_date,market_json,sectors_json,created_at,updated_at)
    VALUES(?1,?2,?3,?4,?4) ON CONFLICT(scan_date) DO UPDATE SET market_json=excluded.market_json,sectors_json=excluded.sectors_json,updated_at=excluded.updated_at`)
    .bind(scanDate,JSON.stringify(marketContext),JSON.stringify(sectorStats),now).run();
  return {ok:true,scanDate,imported,noPlanChanges:true,noPush:true,noTrade:true};
}

async function readResearchDashboard(env,days=730) {
  const [snapshots,paths]=await Promise.all([readResearchSnapshots(env,days),readSelectionPathMetrics(env,days)]);
  const study=factorStudyFromSnapshots(snapshots,paths.rows,5);
  const promotion=researchPromotionGate(study);
  const full=snapshots.filter(row=>row.snapshot?.sourceCompleteness==="FULL_FORMAL_SCAN").length;
  const partial=snapshots.length-full;
  return {
    systemName:"台股交易決策監控系統",version:VERSION,
    worklist:[
      {id:1,title:"正式選股研究資料層",status:"IMPLEMENTED",detail:"新正式盤後入選會保存完整factor snapshot；只記錄，不影響選股。"},
      {id:2,title:"選股後路徑績效",status:"IMPLEMENTED",detail:"追蹤1/3/5/10/20交易日、MFE、MAE、目標/停損先後。"},
      {id:3,title:"持續研究＋樣本外回測",status:study.sampleCount>=60?"VALIDATING":"ACCUMULATING",detail:"研究因子以5日結果做訓練/樣本外一致性檢查，未達樣本數不下結論。"},
      {id:4,title:"正式核心升級",status:promotion.promotionEligible?"ELIGIBLE_FOR_REVIEW":"LOCKED",detail:"只有通過跨年度、跨市場狀態與樣本外驗證才有資格提出正式規則修改。"}
    ],
    snapshotCoverage:{total:snapshots.length,full,partial,distinctDates:new Set(snapshots.map(row=>row.scan_date)).size},
    pathPerformance:paths,factorStudy:study,promotionGate:promotion,
    hypotheses:RESEARCH_FACTOR_CATALOG
  };
}

function researchCenterPage() {
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>台股交易決策監控系統｜研究驗證中心</title><style>
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft JhengHei",sans-serif;background:#f4f6f8;margin:0;padding:18px;color:#222}
  .wrap{max-width:1450px;margin:auto}.panel,.card{background:#fff;border-radius:12px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,.07)}
  .panel{margin-bottom:14px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.big{font-size:24px;font-weight:900}
  .muted{color:#666;font-size:13px}input,select,button{padding:10px;border-radius:8px;border:1px solid #bbb}button{background:#1f6feb;color:#fff;border:0;font-weight:800;cursor:pointer}
  table{width:100%;border-collapse:collapse;background:#fff}th,td{padding:8px;border-bottom:1px solid #eee;text-align:left;font-size:13px}th{background:#eef2f6;position:sticky;top:0}.scroll{overflow:auto;max-height:520px}
  .ok{color:#15803d;font-weight:800}.lock{color:#b45309;font-weight:800}</style></head><body><div class="wrap">
  <h1>台股交易決策監控系統｜研究驗證中心</h1>`+portalNav("research")+`
  <div class="panel"><label>ADMIN_TOKEN <input id="token" type="password" autocomplete="off"></label>
  <label>期間 <select id="days"><option>90</option><option>180</option><option>365</option><option selected value="730">730</option></select> 天</label>
  <button onclick="loadResearch()">載入研究狀態</button><p id="status" class="muted">研究層只觀察，不會自動修改正式選股、持股或推播。</p></div>
  <div id="work" class="grid"></div>
  <div class="panel"><h2>選股後路徑</h2><div id="pathSummary" class="muted"></div><div class="scroll"><table><thead><tr>
  <th>選股日</th><th>股票</th><th>觀察日</th><th>最新</th><th>1D</th><th>3D</th><th>5D</th><th>10D</th><th>20D</th><th>MFE/MAE</th><th>先觸發</th>
  </tr></thead><tbody id="paths"></tbody></table></div></div>
  <div class="panel"><h2>因子研究／樣本外驗證</h2><div id="studySummary" class="muted"></div><div class="scroll"><table><thead><tr>
  <th>因子</th><th>方向</th><th>總樣本</th><th>訓練spread</th><th>樣本外spread</th></tr></thead><tbody id="factors"></tbody></table></div></div>
  <div class="panel"><h2>正式規則升級門檻</h2><div id="gate" class="muted"></div></div>
  <script>
  const esc=x=>String(x??"").replace(/[&<>]/g,c=>c==="&"?"&amp;":c==="<"?"&lt;":"&gt;");
  const pct=x=>x==null?"-":Number(x).toFixed(2)+"%";
  document.getElementById("token").value=sessionStorage.getItem("v8AdminToken")||"";
  async function api(path){const token=document.getElementById("token").value.trim();if(!token)throw new Error("請輸入 ADMIN_TOKEN");sessionStorage.setItem("v8AdminToken",token);const r=await fetch(path,{headers:{"x-admin-token":token}});const d=await r.json();if(!r.ok)throw new Error(d.error||("HTTP "+r.status));return d}
  async function loadResearch(){const st=document.getElementById("status");st.textContent="載入中…";try{
    const d=await api("/api/research/dashboard?days="+encodeURIComponent(document.getElementById("days").value));
    st.innerHTML="<b>已載入。</b> factor snapshot "+esc(d.snapshotCoverage?.total||0)+" 筆；完整 "+esc(d.snapshotCoverage?.full||0)+"、部分回建 "+esc(d.snapshotCoverage?.partial||0)+"。";
    document.getElementById("work").innerHTML=(d.worklist||[]).map(x=>'<div class="card"><div class="muted">'+esc(x.title)+'</div><div class="big">'+esc(x.status)+'</div><div class="muted">'+esc(x.detail)+'</div></div>').join("");
    const ps=d.pathPerformance?.summary?.horizons||{};document.getElementById("pathSummary").innerHTML=[1,3,5,10,20].map(h=>"D"+h+"：可評估 "+(ps["d"+h]?.available||0)+"，平均 "+pct(ps["d"+h]?.averageReturnPct)+"，正報酬比 "+pct(ps["d"+h]?.positiveRate)).join("｜");
    document.getElementById("paths").innerHTML=(d.pathPerformance?.rows||[]).map(x=>{const h=x.horizons||{},latest=x.latest||{};return '<tr><td>'+esc(x.scanDate)+'</td><td>'+esc(x.symbol+" "+(x.name||""))+'</td><td>'+esc(x.observedTradingDays)+'</td><td>'+pct(latest.returnPct)+'</td><td>'+pct(h.d1?.returnPct)+'</td><td>'+pct(h.d3?.returnPct)+'</td><td>'+pct(h.d5?.returnPct)+'</td><td>'+pct(h.d10?.returnPct)+'</td><td>'+pct(h.d20?.returnPct)+'</td><td>'+pct(latest.mfePct)+" / "+pct(latest.maePct)+'</td><td>'+esc(x.firstBarrier||"-")+'</td></tr>'}).join("");
    const study=d.factorStudy||{};document.getElementById("studySummary").innerHTML="5日成熟樣本 "+esc(study.sampleCount||0)+"；正式選股日 "+esc(study.distinctScanDates||0)+"；年度 "+esc(study.distinctYears||0)+"；市場狀態 "+esc((study.regimes||[]).join(", ")||"-")+"。";
    document.getElementById("factors").innerHTML=(study.factors||[]).map(x=>'<tr><td>'+esc(x.label)+'</td><td>'+esc(x.direction)+'</td><td>'+esc(x.total?.n||0)+'</td><td>'+pct(x.train?.spreadPct)+'</td><td>'+pct(x.holdout?.spreadPct)+'</td></tr>').join("");
    const g=d.promotionGate||{};document.getElementById("gate").innerHTML='<b class="'+(g.promotionEligible?"ok":"lock")+'">'+(g.promotionEligible?"可提出正式升級審查":"目前禁止修改正式核心")+'</b><br>'+esc((g.reasons||[]).join("｜")||"已達研究門檻，仍需人工審查後才可改正式規則。")+"<br>"+esc(g.policy||"");
  }catch(err){st.innerHTML="<b>載入失敗：</b>"+esc(err.message)}}
  </script></div></body></html>`;
}

''' + anchor
replace_once(anchor,helpers,"research helpers")

replace_once(
'''        journalInteger(stock?.totalShares),stock?.selectedReason||null,JSON.stringify(stock||{}),now
      ).run();
    }
    const verify=''', 
'''        journalInteger(stock?.totalShares),stock?.selectedReason||null,JSON.stringify(stock||{}),now
      ).run();
      if(stock?.researchSnapshot) {
        const snapshot=stock.researchSnapshot;
        await session.prepare(`INSERT INTO trade_research_snapshots(
          scan_date,plan_date,symbol,name,strategy,signal_level,sector,market_regime,snapshot_json,created_at,updated_at
        ) VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?10)
        ON CONFLICT(scan_date,symbol) DO UPDATE SET
          plan_date=excluded.plan_date,name=excluded.name,strategy=excluded.strategy,signal_level=excluded.signal_level,
          sector=excluded.sector,market_regime=excluded.market_regime,snapshot_json=excluded.snapshot_json,updated_at=excluded.updated_at`)
          .bind(String(scanDate),stock?.planDate||planDate||null,String(stock?.symbol||""),String(stock?.name||""),
            journalStrategy(stock),stock?.signalLevel||null,snapshot?.sector?.name||null,snapshot?.market?.regime||null,
            JSON.stringify(snapshot),now).run();
      }
    }
    const researchMarket=diagnostics?.researchMarketContext||list.find(stock=>stock?.researchSnapshot)?.researchSnapshot?.market||{};
    await session.prepare(`INSERT INTO trade_research_days(scan_date,market_json,sectors_json,created_at,updated_at)
      VALUES(?1,?2,?3,?4,?4) ON CONFLICT(scan_date) DO UPDATE SET
      market_json=excluded.market_json,sectors_json=excluded.sectors_json,updated_at=excluded.updated_at`)
      .bind(String(scanDate),JSON.stringify(researchMarket),JSON.stringify(diagnostics?.industryRadar||{}),now).run();
    const verify=''', 
    "persist factor snapshots"
)

replace_once(
'''  const items=[
    {key:"system",href:"/system",label:"監控總控"},
    {key:"journal",href:"/journal",label:"交易日誌"},
    {key:"performance",href:"/performance",label:"績效分析中心"}
  ];
  return `<nav aria-label="V8主要入口"''',
'''  const items=[
    {key:"system",href:"/system",label:"監控總控"},
    {key:"journal",href:"/journal",label:"交易日誌"},
    {key:"performance",href:"/performance",label:"績效分析中心"},
    {key:"research",href:"/research",label:"研究驗證"}
  ];
  return `<nav aria-label="台股交易決策監控系統主要入口"''',
    "research navigation"
)

replace_once(
'''  <h1>V7/V8 台股半自動交易決策｜系統總控</h1>${portalNav("system")}''',
'''  <h1>台股交易決策監控系統｜系統總控</h1>${portalNav("system")}''',
    "system visible name"
)

replace_once(
'''  </style></head><body><div class="wrap"><h1>V8 選股／訊號交易日誌</h1>${portalNav("journal")}''',
'''  </style></head><body><div class="wrap"><h1>台股交易決策監控系統｜交易日誌</h1>${portalNav("journal")}''',
    "journal visible name"
)

replace_once(
'''  </style></head><body><div class="wrap"><h1>V8 績效分析中心</h1>${portalNav("performance")}''',
'''  </style></head><body><div class="wrap"><h1>台股交易決策監控系統｜績效分析中心</h1>${portalNav("performance")}''',
    "performance visible name"
)

replace_once(
'''  <div class="panel"><h2>V7 正式盤後選股績效</h2>
  <p class="muted">只包含 V7/V8 系統正式盤後 scan 的入選標的，不包含人工策略、動能 App、候選名單。這裡是「選股日收盤 → 最新收盤」績效；真實交易勝率仍以 BUY → SELL/STOP_LOSS 為準。</p>''',
'''  <div class="panel"><h2>正式盤後選股績效</h2>
  <p class="muted">只包含台股交易決策監控系統正式盤後 scan 的入選標的，不包含人工策略、動能 App、候選名單。這裡是「選股日收盤 → 最新收盤」績效；真實交易勝率仍以 BUY → SELL/STOP_LOSS 為準。</p>''',
    "performance visible naming"
)

route_anchor='''    if (url.pathname === "/performance") return html(performanceCenterPage(),200,true);'''
routes=r'''    if (url.pathname === "/research") return html(researchCenterPage(),200,true);

    if (url.pathname === "/api/research/dashboard") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="GET") return json({error:"Method not allowed"},405,true);
      return json(await readResearchDashboard(env,url.searchParams.get("days")||730),200,true);
    }

    if (url.pathname === "/api/research/backfill-current") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="POST") return json({error:"Method not allowed"},405,true);
      try{return json(await backfillCurrentResearchSnapshots(env),200,true)}
      catch(error){return json({ok:false,error:String(error),noPlanChanges:true,noPush:true,noTrade:true},400,true)}
    }

''' + route_anchor
replace_once(route_anchor,routes,"research routes")

path.write_text(text,encoding="utf-8")
print("Applied V8.7.0 research foundation")
