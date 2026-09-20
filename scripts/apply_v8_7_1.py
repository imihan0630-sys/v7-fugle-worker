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
    'const VERSION = "8.7.0-research-foundation";',
    'const VERSION = "8.7.1-history-research-v2";',
    "runtime version"
)

replace_once(
'''  return rows.map(bar => ({
    date: String(bar.date || "").slice(0, 10), close: marketNumber(bar.close), high: marketNumber(bar.high), low: marketNumber(bar.low),
    volumeShares: marketNumber(bar.volume) || 0, tradeValue: marketNumber(bar.turnover) || 0
  })).filter(bar => bar.date && bar.close !== null);''',
'''  return rows.map(bar => ({
    date: String(bar.date || "").slice(0, 10), open: marketNumber(bar.open), close: marketNumber(bar.close),
    high: marketNumber(bar.high), low: marketNumber(bar.low),
    volumeShares: marketNumber(bar.volume) || 0, tradeValue: marketNumber(bar.turnover) || 0
  })).filter(bar => bar.date && bar.close !== null);''',
    "historical daily open"
)

replace_once(
'''  {key:"price.residualSectorRs20",label:"產業超額RS20",direction:"HIGH"},
  {key:"price.positiveDayRatio20",label:"20日上漲日比例",direction:"HIGH"},''',
'''  {key:"price.residualSectorRs20",label:"產業超額RS20",direction:"HIGH"},
  {key:"price.persistenceScoreResearch",label:"趨勢持續性研究分數",direction:"HIGH"},
  {key:"price.positiveDayRatio20",label:"20日上漲日比例",direction:"HIGH"},''',
    "persistence factor catalog"
)

replace_once(
'''  {key:"price.volatility20",label:"20日波動率",direction:"LOW"},
  {key:"volume.volumeTodayVsPrev5",label:"今日/前5日量",direction:"CONTEXT"},''',
'''  {key:"price.volatility20",label:"20日波動率",direction:"CONTEXT"},
  {key:"price.breakoutTicksResearch",label:"突破距離Tick數",direction:"CONTEXT"},
  {key:"volume.volumeTodayVsPrev5",label:"今日/前5日量",direction:"CONTEXT"},''',
    "tick factor catalog"
)

replace_once(
'''  {key:"price.atrPercent",label:"ATR%",direction:"LOW"},''',
'''  {key:"price.atrPercent",label:"ATR%",direction:"CONTEXT"},''',
    "ATR context factor"
)

anchor='''function buildResearchMarketContext(featureRows,todayRows,marketReturn20,sectorStats,scanDate) {'''
helpers=r'''function researchTickSize(price) {
  const p=toNumber(price);
  if(p===null || p<=0) return null;
  if(p<10) return 0.01;
  if(p<50) return 0.05;
  if(p<100) return 0.1;
  if(p<500) return 0.5;
  if(p<1000) return 1;
  return 5;
}

function researchLimitState(bar,prevClose) {
  const close=toNumber(bar?.close),high=toNumber(bar?.high),low=toNumber(bar?.low),prev=toNumber(prevClose);
  if(close===null || prev===null || prev<=0) return {state:"UNKNOWN",changePct:null};
  const changePct=(close/prev-1)*100;
  const highPct=((high??close)/prev-1)*100;
  const lowPct=((low??close)/prev-1)*100;
  let state="NORMAL";
  if(highPct>=9.5 && changePct>=9.5) state="CLOSED_NEAR_LIMIT_UP";
  else if(highPct>=9.5) state="TOUCHED_LIMIT_UP";
  else if(changePct>=8) state="NEAR_LIMIT_UP";
  else if(lowPct<=-9.5 && changePct<=-9.5) state="CLOSED_NEAR_LIMIT_DOWN";
  else if(lowPct<=-9.5) state="TOUCHED_LIMIT_DOWN";
  else if(changePct<=-8) state="NEAR_LIMIT_DOWN";
  return {state,changePct:round(changePct,2),highChangePct:round(highPct,2),lowChangePct:round(lowPct,2)};
}

function researchPriceFeaturesFromBars(bars,scanDate) {
  const history=(Array.isArray(bars)?bars:[])
    .filter(x=>x && String(x.date||"").slice(0,10)<=String(scanDate) && toNumber(x.close)!==null)
    .map(x=>({...x,date:String(x.date||"").slice(0,10)}))
    .sort((a,b)=>a.date.localeCompare(b.date));
  if(!history.length || history.at(-1)?.date!==String(scanDate)) return {ok:false,reason:"缺選股日精確日K",historyDays:history.length};
  const closes=history.map(x=>Number(x.close)),highs=history.map(x=>toNumber(x.high)??Number(x.close));
  const lows=history.map(x=>toNumber(x.low)??Number(x.close)),opens=history.map(x=>toNumber(x.open)??Number(x.close));
  const volumes=history.map(x=>toNumber(x.volumeShares)||0),amounts=history.map(x=>toNumber(x.tradeValue)||0);
  const close=closes.at(-1),open=opens.at(-1),high=highs.at(-1),low=lows.at(-1);
  const ret=n=>closes.length>=n+1?(close/closes.at(-(n+1))-1)*100:null;
  const ret5=ret(5),ret10=ret(10),ret20=ret(20),ret60=ret(60);
  const ma20=closes.length>=20?average(closes.slice(-20)):null,ma60=closes.length>=60?average(closes.slice(-60)):null;
  const r20=closes.slice(-21).map((v,i,a)=>i?(v/a[i-1]-1)*100:null).filter(Number.isFinite);
  const positiveDayRatio20=r20.length?r20.filter(v=>v>0).length/r20.length*100:null;
  let peak=-Infinity,maxDrawdown20Pct=null;
  for(const v of closes.slice(-20)){peak=Math.max(peak,v);const dd=peak>0?(v/peak-1)*100:null;if(dd!==null)maxDrawdown20Pct=maxDrawdown20Pct===null?dd:Math.min(maxDrawdown20Pct,dd)}
  const ranges=[];
  for(let i=Math.max(0,history.length-20);i<history.length;i++){const prev=i>0?closes[i-1]:closes[i];ranges.push(Math.max(highs[i]-lows[i],Math.abs(highs[i]-prev),Math.abs(lows[i]-prev)))}
  const atr20=ranges.length?average(ranges):null;
  const priorHigh20=history.length>=2?Math.max(...highs.slice(Math.max(0,highs.length-21),-1)):null;
  const dayRange=Math.max(0,high-low),dailyClosePosition=dayRange>0?(close-low)/dayRange:0.5;
  const dailyUpperShadowRatio=dayRange>0?(high-Math.max(open,close))/dayRange:0;
  const recentRange=n=>{const hs=highs.slice(-n),ls=lows.slice(-n);if(!hs.length||!ls.length)return null;const hi=Math.max(...hs),lo=Math.min(...ls);return lo>0?(hi/lo-1)*100:null};
  const range5=recentRange(5),range10=recentRange(10),range20=recentRange(20);
  const compression=range20>0&&range10!==null&&range5!==null?clamp(100-(range10/range20)*40-(range5/range20)*60,0,100):null;
  const prev5=history.length>=6?average(volumes.slice(-6,-1)):null,prev20=history.length>=21?average(volumes.slice(-21,-1)):null;
  const volVs5=prev5!==null?volumes.at(-1)/Math.max(1,prev5):null;
  const maDist20=ma20>0?(close/ma20-1)*100:null,maDist60=ma60>0?(close/ma60-1)*100:null;
  const prevClose=closes.length>=2?closes.at(-2):null,gapPct=prevClose>0?(open/prevClose-1)*100:null;
  const breakoutPct=priorHigh20>0?(close/priorHigh20-1)*100:null,tick=researchTickSize(close);
  const breakoutTicks=priorHigh20!==null&&tick>0?round((close-priorHigh20)/tick,2):null;
  const horizonReturns=[ret5,ret10,ret20,ret60].filter(Number.isFinite);
  const positiveHorizonPct=horizonReturns.length?horizonReturns.filter(v=>v>0).length/horizonReturns.length*100:null;
  const ddQuality=maxDrawdown20Pct===null?null:clamp(100+maxDrawdown20Pct*5,0,100);
  const maQuality=((ma20!==null&&close>ma20?1:0)+(ma60!==null&&close>ma60?1:0))/2*100;
  const persistence=[positiveDayRatio20,positiveHorizonPct,ddQuality,maQuality].filter(Number.isFinite).length>=3
    ?round((positiveDayRatio20||0)*0.35+(positiveHorizonPct||0)*0.25+(ddQuality||0)*0.2+maQuality*0.2,2):null;
  const breakoutQuality=clamp(dailyClosePosition*35+(1-dailyUpperShadowRatio)*25+clamp((volVs5||0)/2,0,1)*25+clamp(((breakoutPct||0)+1)/4,0,1)*15,0,100);
  const overheat=clamp(Math.max(0,(ret20||0)-20)*1.6+Math.max(0,(maDist20||0)-12)*2.2+Math.max(0,((atr20&&close)?atr20/close*100:0)-6)*5+Math.max(0,Math.abs(gapPct||0)-4)*4,0,100);
  return {ok:true,maxSourceDate:history.at(-1).date,historyDays:history.length,features:{
    close,ret5,ret10,ret20,ret60,positiveDayRatio20,maxDrawdown20Pct,maDistance20Pct:maDist20,maDistance60Pct:maDist60,
    atrPercent:atr20&&close?atr20/close*100:null,volatility20:r20.length?standardDeviation(r20):null,gapPct,
    breakoutDistancePct:breakoutPct,breakoutTicksResearch:breakoutTicks,tickSizeResearch:tick,
    limitStateResearch:researchLimitState(history.at(-1),prevClose),persistenceScoreResearch:persistence,
    dailyClosePosition,dailyUpperShadowRatio,compressionScoreResearch:compression,
    breakoutQualityResearch:round(breakoutQuality,2),overheatPenaltyResearch:round(overheat,2),
    avgVolume20Lots:average(volumes.slice(-20))/1000,avgAmount20:average(amounts.slice(-20)),
    volumeRatio:volumes.length>=20?average(volumes.slice(-5))/Math.max(1,average(volumes.slice(-20))):null,
    volumeTodayVsPrev5:volVs5,volumeContraction5to20:prev5!==null&&prev20!==null?prev5/Math.max(1,prev20):null
  }};
}

''' + anchor
replace_once(anchor,helpers,"research price reconstruction helpers")

replace_once(
'''function buildResearchSnapshot(item,scanDate) {
  const setup=strategySetupState(item);''',
'''function buildResearchSnapshot(item,scanDate) {
  const setup=strategySetupState(item);
  const historical=researchPriceFeaturesFromBars(item?.history||[],scanDate);
  const researchPrice=historical?.ok?historical.features:{};''',
    "prospective research price v2"
)

replace_once(
'''    schemaVersion:"research-snapshot-v1",researchOnly:true,decisionImpact:false,scanDate,''',
'''    schemaVersion:"research-snapshot-v2",researchOnly:true,decisionImpact:false,scanDate,''',
    "snapshot schema v2"
)

replace_once(
'''      marketRs20:toNumber(item?.relativeStrength),residualSectorRs20:residualSectorRs===null?null:round(residualSectorRs,2),
      positiveDayRatio20:toNumber(item?.positiveDayRatio20),maxDrawdown20Pct:toNumber(item?.maxDrawdown20Pct),''',
'''      marketRs20:toNumber(item?.relativeStrength),residualSectorRs20:residualSectorRs===null?null:round(residualSectorRs,2),
      persistenceScoreResearch:toNumber(researchPrice?.persistenceScoreResearch),
      breakoutTicksResearch:toNumber(researchPrice?.breakoutTicksResearch),tickSizeResearch:toNumber(researchPrice?.tickSizeResearch),
      limitStateResearch:researchPrice?.limitStateResearch||null,
      positiveDayRatio20:toNumber(item?.positiveDayRatio20)??toNumber(researchPrice?.positiveDayRatio20),
      maxDrawdown20Pct:toNumber(item?.maxDrawdown20Pct)??toNumber(researchPrice?.maxDrawdown20Pct),''',
    "snapshot v2 factors"
)

replace_once(
'''    sourceCompleteness:"FULL_FORMAL_SCAN"
  };''',
'''    sourceCompleteness:"FULL_FORMAL_SCAN",
    provenance:{capturedAtSelection:true,noForwardFill:true,priceBarsThrough:historical?.ok?historical.maxSourceDate:scanDate}
  };''',
    "prospective snapshot provenance"
)

replace_once(
'''    return {scanDate:String(row.scan_date),symbol:String(row.symbol),snapshot:row.snapshot,outcome:Number.isFinite(outcome)?outcome:null,
      regime:row.snapshot?.market?.regime||row.market_regime||"UNKNOWN"};''',
'''    return {scanDate:String(row.scan_date),symbol:String(row.symbol),snapshot:row.snapshot,outcome:Number.isFinite(outcome)?outcome:null,
      regime:row.snapshot?.market?.regime||row.market_regime||"UNKNOWN",
      sourceCompleteness:row.snapshot?.sourceCompleteness||"UNKNOWN"};''',
    "factor sample provenance"
)

replace_once(
'''  const regimes=[...new Set(samples.map(row=>row.regime).filter(Boolean))];''',
'''  const regimes=[...new Set(samples.map(row=>row.regime).filter(x=>x&&x!=="UNKNOWN"))];''',
    "exclude unknown regime"
)

replace_once(
'''  return {
    horizonTradingDays:horizon,sampleCount:samples.length,distinctScanDates:dates.length,distinctYears:years.length,regimes,''',
'''  const fullMatureCount=samples.filter(x=>x.sourceCompleteness==="FULL_FORMAL_SCAN").length;
  const reconstructedMatureCount=samples.filter(x=>String(x.sourceCompleteness).startsWith("RECONSTRUCTED")).length;
  return {
    horizonTradingDays:horizon,sampleCount:samples.length,fullMatureCount,reconstructedMatureCount,
    distinctScanDates:dates.length,distinctYears:years.length,regimes,''',
    "factor sample source counts"
)

replace_once(
'''  if((study?.sampleCount||0)<60) reasons.push("5日成熟樣本少於60筆");''',
'''  if((study?.sampleCount||0)<60) reasons.push("5日成熟樣本少於60筆");
  if((study?.fullMatureCount||0)<30) reasons.push("前瞻正式完整快照的5日成熟樣本少於30筆");''',
    "prospective promotion gate"
)

hist_anchor='''async function backfillCurrentResearchSnapshots(env) {'''
hist_helpers=r'''function buildHistoricalResearchSnapshot(plan,priceResult) {
  const p=priceResult.features||{};
  return {
    schemaVersion:"research-snapshot-v2",researchOnly:true,decisionImpact:false,scanDate:String(plan.scan_date),
    symbol:String(plan.symbol),name:plan.name||"",strategy:plan.strategy||"",signalLevel:plan.signal_level||null,
    market:{regime:"UNKNOWN",sourceCompleteness:"HISTORICAL_MARKET_CONTEXT_UNAVAILABLE"},
    sector:{name:null,rank:null,score:null,return20:null,residualRs20:null},
    price:{
      close:toNumber(p.close),ret5:toNumber(p.ret5),ret10:toNumber(p.ret10),ret20:toNumber(p.ret20),ret60:toNumber(p.ret60),
      marketRs20:null,residualSectorRs20:null,persistenceScoreResearch:toNumber(p.persistenceScoreResearch),
      breakoutTicksResearch:toNumber(p.breakoutTicksResearch),tickSizeResearch:toNumber(p.tickSizeResearch),
      limitStateResearch:p.limitStateResearch||null,positiveDayRatio20:toNumber(p.positiveDayRatio20),
      maxDrawdown20Pct:toNumber(p.maxDrawdown20Pct),maDistance20Pct:toNumber(p.maDistance20Pct),
      maDistance60Pct:toNumber(p.maDistance60Pct),atrPercent:toNumber(p.atrPercent),volatility20:toNumber(p.volatility20),
      gapPct:toNumber(p.gapPct),breakoutDistancePct:toNumber(p.breakoutDistancePct),
      dailyClosePosition:toNumber(p.dailyClosePosition),dailyUpperShadowRatio:toNumber(p.dailyUpperShadowRatio)
    },
    volume:{avgVolume20Lots:toNumber(p.avgVolume20Lots),avgAmount20:toNumber(p.avgAmount20),volumeRatio:toNumber(p.volumeRatio),
      volumeTodayVsPrev5:toNumber(p.volumeTodayVsPrev5),volumeContraction5to20:toNumber(p.volumeContraction5to20)},
    institution:{score:null,foreignBuyDays:null,trustBuyDays:null,dealerBuyDays:null,foreignNet:null,trustNet:null,dealerNet:null,institutionTotalNet:null,chipConcentration:null},
    fundamental:{score:null,revenueYoY:null,revenueMoM:null,revenueQuarterYoY:null,revenueQoQ:null,revenueYTDYoY:null,eps:null,epsYoY:null,grossMargin:null,operatingMargin:null,priceEarningsRatio:null,priceBookRatio:null},
    setup:{pullbackPct:null,supportDistancePct:null,setupQuality:null,rewardRisk:journalNumber(plan.reward_risk),
      compressionScoreResearch:toNumber(p.compressionScoreResearch),breakoutQualityResearch:toNumber(p.breakoutQualityResearch),
      overheatPenaltyResearch:toNumber(p.overheatPenaltyResearch),A:{},B:{}},
    sourceCompleteness:"RECONSTRUCTED_PRICE_ONLY",
    provenance:{reconstructed:true,noForwardFill:true,priceBarsThrough:String(plan.scan_date),source:"FUGLE_HISTORICAL_DAILY",
      marketContextBackfilled:false,sectorContextBackfilled:false,institutionBackfilled:false,fundamentalBackfilled:false}
  };
}

function researchSnapshotCompletenessAudit(snapshotRows) {
  const rows=Array.isArray(snapshotRows)?snapshotRows:[],sourceCounts={};
  let reconstructionForwardFillViolations=0;
  for(const row of rows){
    const source=row?.snapshot?.sourceCompleteness||"UNKNOWN";
    sourceCounts[source]=(sourceCounts[source]||0)+1;
    if(String(source).startsWith("RECONSTRUCTED")&&row?.snapshot?.provenance?.noForwardFill!==true) reconstructionForwardFillViolations+=1;
  }
  return {total:rows.length,sourceCounts,reconstructionForwardFillViolations,
    rule:"歷史重建只使用選股日及以前價量資料；缺少的市場、產業、法人、基本面不得用現在資料倒填。"};
}

async function reconstructHistoricalResearchSnapshots(env) {
  if(!env?.V7_DB||isTestMode(env)) return {ok:false,simulated:isTestMode(env),error:"Production D1 required"};
  if(!env?.FUGLE_API_KEY) return {ok:false,error:"Missing FUGLE_API_KEY",noPlanChanges:true,noPush:true,noTrade:true};
  await ensureD1Schema(env);
  const session=env.V7_DB.withSession("first-primary");
  const marketState=await env.STOCKS_KV?.get(MARKET_STATE_KEY,"json");
  const latestMarketDate=marketState?.lastDate?String(marketState.lastDate).slice(0,10):null;
  if(!latestMarketDate) throw new Error("找不到最新正式市場日期");
  const result=await session.prepare(`SELECT scan_date,plan_date,symbol,name,strategy,signal_level,formal_close,stop,profit_check,reward_risk
    FROM v7_formal_scan_backfill WHERE scan_date<?1 ORDER BY scan_date ASC,symbol ASC LIMIT 50`).bind(latestMarketDate).all();
  const rows=result?.results||[];
  let imported=0,refreshedHistory=0,skipped=0;
  const failures=[],dates=new Set();
  for(const plan of rows){
    const scanDate=String(plan.scan_date),symbol=String(plan.symbol);
    try{
      const bars=await fetchHistoricalDaily(symbol,shiftDateString(scanDate,-150),latestMarketDate,env);
      const price=researchPriceFeaturesFromBars(bars,scanDate);
      if(!price.ok){skipped+=1;failures.push({scanDate,symbol,reason:price.reason});continue}
      const fetched=toNumber(price.features?.close),formal=journalNumber(plan.formal_close),tick=researchTickSize(fetched)||0.01;
      const tolerance=Math.max(tick*0.51,(fetched||0)*0.0005);
      if(formal===null||fetched===null||Math.abs(fetched-formal)>tolerance){
        skipped+=1;failures.push({scanDate,symbol,reason:"選股日收盤價與歷史日K不一致",formalClose:formal,fetchedClose:fetched,tolerance:round(tolerance,4)});continue
      }
      const snapshot=buildHistoricalResearchSnapshot(plan,price);
      snapshot.formalCloseAudit={matched:true,formalClose:formal,fetchedClose:fetched,tolerance:round(tolerance,4)};
      const now=new Date().toISOString();
      await session.prepare(`INSERT INTO trade_research_snapshots(
        scan_date,plan_date,symbol,name,strategy,signal_level,sector,market_regime,snapshot_json,created_at,updated_at
      ) VALUES(?1,?2,?3,?4,?5,?6,NULL,'UNKNOWN',?7,?8,?8)
      ON CONFLICT(scan_date,symbol) DO UPDATE SET plan_date=excluded.plan_date,name=excluded.name,strategy=excluded.strategy,
        signal_level=excluded.signal_level,sector=NULL,market_regime='UNKNOWN',snapshot_json=excluded.snapshot_json,updated_at=excluded.updated_at`)
        .bind(scanDate,plan.plan_date||null,symbol,plan.name||"",plan.strategy||null,plan.signal_level||null,JSON.stringify(snapshot),now).run();
      const stored=await writeHistoryCache(env,{[symbol]:bars});refreshedHistory+=Number(stored?.stored||0);
      imported+=1;dates.add(scanDate);
    }catch(error){skipped+=1;failures.push({scanDate,symbol,reason:String(error).slice(0,240)})}
  }
  const now=new Date().toISOString();
  for(const scanDate of dates){
    const market={schemaVersion:"research-market-reconstructed-v1",scanDate,researchOnly:true,decisionImpact:false,regime:"UNKNOWN",
      sourceCompleteness:"HISTORICAL_MARKET_CONTEXT_UNAVAILABLE",noForwardFill:true};
    await session.prepare(`INSERT INTO trade_research_days(scan_date,market_json,sectors_json,created_at,updated_at)
      VALUES(?1,?2,'{}',?3,?3) ON CONFLICT(scan_date) DO UPDATE SET market_json=excluded.market_json,updated_at=excluded.updated_at`)
      .bind(scanDate,JSON.stringify(market),now).run();
  }
  return {ok:imported>0||rows.length===0,latestMarketDate,requested:rows.length,imported,refreshedHistory,skipped,failures,
    noPlanChanges:true,noPush:true,noTrade:true,noSelection:true,noCurrentDataBackfill:true};
}

''' + hist_anchor
replace_once(hist_anchor,hist_helpers,"historical research reconstruction")

replace_once(
'''  const full=snapshots.filter(row=>row.snapshot?.sourceCompleteness==="FULL_FORMAL_SCAN").length;
  const partial=snapshots.length-full;''',
'''  const full=snapshots.filter(row=>row.snapshot?.sourceCompleteness==="FULL_FORMAL_SCAN").length;
  const reconstructed=snapshots.filter(row=>String(row.snapshot?.sourceCompleteness||"").startsWith("RECONSTRUCTED")).length;
  const partial=snapshots.length-full-reconstructed;
  const completenessAudit=researchSnapshotCompletenessAudit(snapshots);''',
    "dashboard source audit"
)

replace_once(
'''    snapshotCoverage:{total:snapshots.length,full,partial,distinctDates:new Set(snapshots.map(row=>row.scan_date)).size},
    pathPerformance:paths,factorStudy:study,promotionGate:promotion,''',
'''    snapshotCoverage:{total:snapshots.length,full,partial,reconstructed,distinctDates:new Set(snapshots.map(row=>row.scan_date)).size},
    completenessAudit,pathPerformance:paths,factorStudy:study,promotionGate:promotion,''',
    "dashboard completeness payload"
)

replace_once(
'''    st.innerHTML="<b>已載入。</b> factor snapshot "+esc(d.snapshotCoverage?.total||0)+" 筆；完整 "+esc(d.snapshotCoverage?.full||0)+"、部分回建 "+esc(d.snapshotCoverage?.partial||0)+"。";''',
'''    st.innerHTML="<b>已載入。</b> factor snapshot "+esc(d.snapshotCoverage?.total||0)+" 筆；完整 "+esc(d.snapshotCoverage?.full||0)+"、當期回建 "+esc(d.snapshotCoverage?.partial||0)+"、歷史價量重建 "+esc(d.snapshotCoverage?.reconstructed||0)+"。";''',
    "dashboard source UI"
)

replace_once(
'''  <div id="work" class="grid"></div>
  <div class="panel"><h2>選股後路徑</h2>''',
'''  <div id="work" class="grid"></div>
  <div class="panel"><h2>資料完整性稽核</h2><div id="audit" class="muted"></div></div>
  <div class="panel"><h2>選股後路徑</h2>''',
    "audit UI"
)

replace_once(
'''    document.getElementById("work").innerHTML=(d.worklist||[]).map(x=>'<div class="card"><div class="muted">'+esc(x.title)+'</div><div class="big">'+esc(x.status)+'</div><div class="muted">'+esc(x.detail)+'</div></div>').join("");
    const ps=d.pathPerformance?.summary?.horizons||{};''',
'''    document.getElementById("work").innerHTML=(d.worklist||[]).map(x=>'<div class="card"><div class="muted">'+esc(x.title)+'</div><div class="big">'+esc(x.status)+'</div><div class="muted">'+esc(x.detail)+'</div></div>').join("");
    const audit=d.completenessAudit||{};document.getElementById("audit").innerHTML="來源："+esc(Object.entries(audit.sourceCounts||{}).map(x=>x[0]+" "+x[1]).join("｜")||"-")+"<br>歷史重建未來資料違規："+esc(audit.reconstructionForwardFillViolations||0)+"<br>"+esc(audit.rule||"");
    const ps=d.pathPerformance?.summary?.horizons||{};''',
    "audit render"
)

replace_once(
'''    const study=d.factorStudy||{};document.getElementById("studySummary").innerHTML="5日成熟樣本 "+esc(study.sampleCount||0)+"；正式選股日 "+esc(study.distinctScanDates||0)+"；年度 "+esc(study.distinctYears||0)+"；市場狀態 "+esc((study.regimes||[]).join(", ")||"-")+"。";''',
'''    const study=d.factorStudy||{};document.getElementById("studySummary").innerHTML="5日成熟樣本 "+esc(study.sampleCount||0)+"（前瞻完整 "+esc(study.fullMatureCount||0)+"／歷史重建 "+esc(study.reconstructedMatureCount||0)+"）；正式選股日 "+esc(study.distinctScanDates||0)+"；年度 "+esc(study.distinctYears||0)+"；市場狀態 "+esc((study.regimes||[]).join(", ")||"-")+"。";''',
    "mature source UI"
)

route_anchor='''    if (url.pathname === "/api/research/backfill-current") {'''
replace_once(route_anchor,r'''    if (url.pathname === "/api/research/reconstruct-history") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(request.method!=="POST") return json({error:"Method not allowed"},405,true);
      try{return json(await reconstructHistoricalResearchSnapshots(env),200,true)}
      catch(error){return json({ok:false,error:String(error),noPlanChanges:true,noPush:true,noTrade:true,noSelection:true},400,true)}
    }

''' + route_anchor,"historical research route")

replace_once(
'''<title>
台股半自動交易決策監控 V7
</title>''',
'''<title>
台股交易決策監控系統
</title>''',
    "main title naming"
)

replace_once(
'''<h1>
台股半自動交易決策監控 V7
</h1>''',
'''<h1>
台股交易決策監控系統
</h1>''',
    "main heading naming"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.7.1 historical reconstruction + research factors V2")
