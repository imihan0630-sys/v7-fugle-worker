const RESEARCH_MICROSTRUCTURE_CUTOFF="2020-03-23";
const RESEARCH_OFFICIAL_EVIDENCE_ENDPOINTS={
  monthlyRevenue:"https://openapi.twse.com.tw/v1/opendata/t187ap05_L",
  attention:"https://openapi.twse.com.tw/v1/announcement/notice",
  disposition:"https://openapi.twse.com.tw/v1/announcement/punish"
};

if(!RESEARCH_EXPERIMENT_CATALOG.some(x=>x.id==="R08")) {
  RESEARCH_EXPERIMENT_CATALOG.push({
    id:"R08",version:"1.0",title:"Two-Engine Momentum",family:"MOMENTUM_MECHANISM",status:"ACCUMULATING",
    frozenAt:"2026-09-20",
    definition:"沿用R07同日中位數切分，不新增最佳化門檻：Residual RS較強且相對量低=QUIET_UNDERREACTION_PROXY；Residual RS較強且相對量高=ATTENTION_CONTINUATION_PROXY。比較D5/D10/D20、MFE/MAE與Regime敏感度，僅研究分類，不改正式選股。",
    parameterVariants:1
  });
}

function researchNormalizeSymbol(value) {
  return String(value??"").trim().replace(/^0+(?=\d)/,"");
}

function researchLooseNumber(value) {
  if(value===null||value===undefined||value==="") return null;
  const raw=String(value).replace(/,/g,"").replace(/%/g,"").trim();
  if(!raw||raw==="--"||raw==="-"||raw==="N/A") return null;
  const n=Number(raw);
  return Number.isFinite(n)?n:null;
}

function researchField(row,keys) {
  for(const key of keys) if(row && Object.prototype.hasOwnProperty.call(row,key) && row[key]!=="" && row[key]!==null && row[key]!==undefined) return row[key];
  return null;
}

function researchDateFromAny(value) {
  const raw=String(value??"").trim();
  if(!raw) return null;
  if(/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  if(/^\d{8}$/.test(raw) && Number(raw.slice(0,4))>1900) return raw.slice(0,4)+"-"+raw.slice(4,6)+"-"+raw.slice(6,8);
  const digits=raw.replace(/\D/g,"");
  if(/^\d{7}$/.test(digits)) {
    const year=Number(digits.slice(0,3))+1911;
    return String(year).padStart(4,"0")+"-"+digits.slice(3,5)+"-"+digits.slice(5,7);
  }
  if(/^\d{6}$/.test(digits)) {
    const year=Number(digits.slice(0,2))+1911;
    return String(year).padStart(4,"0")+"-"+digits.slice(2,4)+"-"+digits.slice(4,6);
  }
  return null;
}

function researchRevenueEvidenceMap(rows) {
  const map=new Map();
  for(const row of Array.isArray(rows)?rows:[]) {
    const symbol=researchNormalizeSymbol(researchField(row,["公司代號","公司代碼","Code","股票代號","證券代號"]));
    if(!symbol) continue;
    const dataMonth=String(researchField(row,["資料年月","年月","DataMonth"])??"").trim()||null;
    map.set(symbol,{
      status:"AVAILABLE",
      dataMonth,
      currentRevenue:researchLooseNumber(researchField(row,["營業收入-當月營收","當月營收","CurrentMonthRevenue"])),
      previousRevenue:researchLooseNumber(researchField(row,["營業收入-上月營收","上月營收","PreviousMonthRevenue"])),
      lastYearRevenue:researchLooseNumber(researchField(row,["營業收入-去年當月營收","去年當月營收","RevenueSameMonthLastYear"])),
      revenueMoM:researchLooseNumber(researchField(row,["營業收入-上月比較增減(%)","上月比較增減(%)","MoM"])),
      revenueYoY:researchLooseNumber(researchField(row,["營業收入-去年同月增減(%)","去年同月增減(%)","YoY"])),
      cumulativeRevenue:researchLooseNumber(researchField(row,["累計營業收入-當月累計營收","當月累計營收"])),
      cumulativeLastYearRevenue:researchLooseNumber(researchField(row,["累計營業收入-去年累計營收","去年累計營收"])),
      cumulativeYoY:researchLooseNumber(researchField(row,["累計營業收入-前期比較增減(%)","前期比較增減(%)"])),
      persistenceStatus:"ACCUMULATING_DISTINCT_DATA_MONTHS",
      historicalHighStatus:"UNKNOWN_REQUIRES_HISTORY"
    });
  }
  return map;
}

function researchFlattenTwseTablePayload(payload) {
  const out=[];
  const tables=Array.isArray(payload?.tables)?payload.tables:[payload];
  for(const table of tables) {
    const fields=Array.isArray(table?.fields)?table.fields:[];
    const data=Array.isArray(table?.data)?table.data:[];
    if(!fields.length||!data.length) continue;
    for(const values of data) {
      if(!Array.isArray(values)) continue;
      const row={};
      fields.forEach((field,i)=>row[String(field)]=values[i]);
      out.push(row);
    }
  }
  return out;
}

function researchMarginEvidenceFromPayload(payload,requestedScanDate) {
  const sourceDate=researchDateFromAny(payload?.date||payload?.Date||payload?.stat||null);
  const dateMatched=sourceDate===String(requestedScanDate||"");
  const map=new Map();
  if(!dateMatched) return {sourceDate,dateMatched:false,map};
  for(const row of researchFlattenTwseTablePayload(payload)) {
    const symbol=researchNormalizeSymbol(researchField(row,["股票代號","證券代號","代號","Security Code"]));
    if(!symbol) continue;
    const marginPrev=researchLooseNumber(researchField(row,["前日餘額","融資前日餘額","Margin Purchase Balance of Previous Day"]));
    const marginToday=researchLooseNumber(researchField(row,["今日餘額","融資今日餘額","Margin Purchase Balance of the Day"]));
    const shortPrev=researchLooseNumber(researchField(row,["融券前日餘額","Short Sale Balance of Previous Day"]));
    const shortToday=researchLooseNumber(researchField(row,["融券今日餘額","Short Sale Balance of the Day"]));
    map.set(symbol,{
      status:"AVAILABLE",
      sourceDate,
      marginBuy:researchLooseNumber(researchField(row,["融資買進","Margin Purchase"])),
      marginSell:researchLooseNumber(researchField(row,["融資賣出","Margin Sales"])),
      marginPrevBalance:marginPrev,
      marginTodayBalance:marginToday,
      marginBalanceChangePct:marginPrev&&marginToday!==null?round((marginToday/marginPrev-1)*100,2):null,
      marginShortCover:researchLooseNumber(researchField(row,["融券買進","Short Covering"])),
      marginShortSale:researchLooseNumber(researchField(row,["融券賣出","Short Sale"])),
      marginShortPrevBalance:shortPrev,
      marginShortTodayBalance:shortToday,
      shortSideScope:"MARGIN_SHORT_ONLY_NOT_SBL",
      sblShortEvidence:"UNKNOWN_NOT_CAPTURED_IN_V8_7_9"
    });
  }
  return {sourceDate,dateMatched:true,map};
}

function researchOfficialStatusMap(rows) {
  const map=new Map();
  for(const row of Array.isArray(rows)?rows:[]) {
    const symbol=researchNormalizeSymbol(researchField(row,["Code","證券代號","股票代號","代號"]));
    if(!symbol) continue;
    map.set(symbol,{
      sourceDate:researchDateFromAny(researchField(row,["Date","日期","公布日期"])),
      name:researchField(row,["Name","證券名稱","股票名稱"])||null,
      reason:researchField(row,["ReasonsOfDisposition","Reason","注意交易資訊","原因"])||null,
      period:researchField(row,["DispositionPeriod","處置期間"])||null,
      measure:researchField(row,["DispositionMeasures","處置措施"])||null
    });
  }
  return map;
}

async function researchFetchJson(url,timeoutMs=10000) {
  const response=await fetch(url,{headers:{"accept":"application/json","user-agent":"TW-Research-V8.7.9"},signal:AbortSignal.timeout(timeoutMs)});
  if(!response.ok) throw new Error("HTTP "+response.status+" "+url);
  return await response.json();
}

async function collectResearchExternalEvidence(archive) {
  const rows=Array.isArray(archive?.rows)?archive.rows:[];
  const scanDate=String(archive?.scanDate||"");
  if(!rows.length||!scanDate) return {scanDate,rows:[],providers:{},researchOnly:true,decisionImpact:false,formalCoreImpact:false};
  const compactDate=scanDate.replace(/-/g,"");
  const marginUrl="https://www.twse.com.tw/rwd/zh/marginTrading/MI_MARGN?date="+encodeURIComponent(compactDate)+"&selectType=STOCK&response=json";
  const settled=await Promise.allSettled([
    researchFetchJson(RESEARCH_OFFICIAL_EVIDENCE_ENDPOINTS.monthlyRevenue),
    researchFetchJson(marginUrl),
    researchFetchJson(RESEARCH_OFFICIAL_EVIDENCE_ENDPOINTS.attention),
    researchFetchJson(RESEARCH_OFFICIAL_EVIDENCE_ENDPOINTS.disposition)
  ]);
  const providerNames=["monthlyRevenue","margin","attention","disposition"];
  const providers={};
  settled.forEach((result,index)=>providers[providerNames[index]]={
    status:result.status==="fulfilled"?"AVAILABLE":"UNAVAILABLE",
    error:result.status==="rejected"?String(result.reason).slice(0,220):null
  });
  const revenueMap=settled[0].status==="fulfilled"?researchRevenueEvidenceMap(settled[0].value):new Map();
  const marginParsed=settled[1].status==="fulfilled"?researchMarginEvidenceFromPayload(settled[1].value,scanDate):{sourceDate:null,dateMatched:false,map:new Map()};
  providers.margin.sourceDate=marginParsed.sourceDate;
  providers.margin.dateMatched=marginParsed.dateMatched;
  if(providers.margin.status==="AVAILABLE"&&!marginParsed.dateMatched) providers.margin.status="SOURCE_DATE_MISMATCH";
  const attentionMap=settled[2].status==="fulfilled"?researchOfficialStatusMap(settled[2].value):new Map();
  const dispositionMap=settled[3].status==="fulfilled"?researchOfficialStatusMap(settled[3].value):new Map();
  const capturedAt=new Date().toISOString();
  const evidenceRows=rows.map(row=>{
    const symbol=researchNormalizeSymbol(row.symbol);
    const revenue=revenueMap.get(symbol)||{status:providers.monthlyRevenue.status==="AVAILABLE"?"MISSING_FOR_SYMBOL":"UNKNOWN_PROVIDER_UNAVAILABLE"};
    const margin=marginParsed.map.get(symbol)||{status:providers.margin.status==="AVAILABLE"?"MISSING_FOR_SYMBOL":"UNKNOWN_"+providers.margin.status};
    const attentionAvailable=providers.attention.status==="AVAILABLE";
    const dispositionAvailable=providers.disposition.status==="AVAILABLE";
    return {
      scanDate,symbol:String(row.symbol),name:row.name||"",cohort:row.cohort||"UNKNOWN",
      schemaVersion:"research-external-evidence-v1",researchOnly:true,decisionImpact:false,formalCoreImpact:false,
      microstructureRegime:scanDate>=RESEARCH_MICROSTRUCTURE_CUTOFF?"CONTINUOUS_TRADING":"LEGACY_CALL_AUCTION",
      revenue,
      margin,
      officialAttention:attentionAvailable?{status:"AVAILABLE",flag:attentionMap.has(symbol),detail:attentionMap.get(symbol)||null}:{status:"UNKNOWN_PROVIDER_UNAVAILABLE",flag:null,detail:null},
      disposition:dispositionAvailable?{status:"AVAILABLE",flag:dispositionMap.has(symbol),detail:dispositionMap.get(symbol)||null}:{status:"UNKNOWN_PROVIDER_UNAVAILABLE",flag:null,detail:null},
      provenance:{capturedAt,scanDate,noForwardFill:true,providers}
    };
  });
  return {
    scanDate,rows:evidenceRows,providers,researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    policy:"官方外部證據只保存研究上下文。資料源失敗或日期不符一律UNKNOWN，不得轉成BAD，不得改正式排名、配資、監控、推播或交易。"
  };
}

async function persistResearchExternalEvidence(env,bundle) {
  const rows=Array.isArray(bundle?.rows)?bundle.rows:[];
  if(!env?.V7_DB||!rows.length) return {ok:false,saved:0,reason:!env?.V7_DB?"NO_D1":"EMPTY",researchOnly:true};
  await ensureD1Schema(env);
  const session=env.V7_DB.withSession("first-primary");
  const now=new Date().toISOString();
  await session.prepare("DELETE FROM trade_research_external_evidence WHERE scan_date=?1").bind(String(bundle.scanDate)).run();
  let saved=0;
  for(const row of rows) {
    await session.prepare(`INSERT INTO trade_research_external_evidence(scan_date,symbol,name,cohort,evidence_json,created_at,updated_at)
      VALUES(?1,?2,?3,?4,?5,?6,?6)
      ON CONFLICT(scan_date,symbol) DO UPDATE SET name=excluded.name,cohort=excluded.cohort,evidence_json=excluded.evidence_json,updated_at=excluded.updated_at`)
      .bind(row.scanDate,row.symbol,row.name||"",row.cohort||"UNKNOWN",JSON.stringify(row),now).run();
    saved+=1;
  }
  return {ok:true,saved,scanDate:bundle.scanDate,providers:bundle.providers,researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noPush:true,noTrade:true};
}

function researchExternalEvidenceCoverage(outcomes) {
  const rows=(outcomes||[]).filter(x=>x.externalEvidence);
  const revenue=rows.filter(x=>x.externalEvidence?.revenue?.status==="AVAILABLE").length;
  const margin=rows.filter(x=>x.externalEvidence?.margin?.status==="AVAILABLE").length;
  const attention=rows.filter(x=>x.externalEvidence?.officialAttention?.status==="AVAILABLE").length;
  const disposition=rows.filter(x=>x.externalEvidence?.disposition?.status==="AVAILABLE").length;
  return {
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    outcomeRows:(outcomes||[]).length,evidenceRows:rows.length,
    revenueAvailable:revenue,marginAvailable:margin,attentionAvailable:attention,dispositionAvailable:disposition,
    rule:"外部證據缺值維持UNKNOWN；coverage不足時只累積，不做方向性結論。"
  };
}

async function readResearchExternalEvidenceSummary(env,days=120) {
  if(!env?.V7_DB) return {researchOnly:true,decisionImpact:false,formalCoreImpact:false,total:0,dates:0,status:"NO_D1"};
  await ensureD1Schema(env);
  const safeDays=Math.max(1,Math.min(365,Number(days)||120));
  const fromDate=shiftDateString(taiwanDate(),-(safeDays-1));
  const result=await env.V7_DB.withSession("first-primary").prepare(
    "SELECT scan_date,symbol,evidence_json FROM trade_research_external_evidence WHERE scan_date>=?1 ORDER BY scan_date ASC,symbol ASC LIMIT 5000"
  ).bind(fromDate).all();
  const rows=result?.results||[];
  const parsed=[];
  for(const row of rows){try{parsed.push(JSON.parse(row.evidence_json||"{}"))}catch(_){}}
  const dates=[...new Set(parsed.map(x=>x.scanDate).filter(Boolean))];
  return {
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,total:parsed.length,dates:dates.length,latestDate:dates.sort().at(-1)||null,
    revenueAvailable:parsed.filter(x=>x.revenue?.status==="AVAILABLE").length,
    marginAvailable:parsed.filter(x=>x.margin?.status==="AVAILABLE").length,
    attentionFlags:parsed.filter(x=>x.officialAttention?.flag===true).length,
    dispositionFlags:parsed.filter(x=>x.disposition?.flag===true).length,
    microstructure:{continuous:parsed.filter(x=>x.microstructureRegime==="CONTINUOUS_TRADING").length,legacy:parsed.filter(x=>x.microstructureRegime==="LEGACY_CALL_AUCTION").length},
    status:parsed.length?"ACCUMULATING":"WAITING_FIRST_EVIDENCE_CAPTURE",
    policy:"V8.7.9只擴充Shadow研究證據，不建立正式買賣分數。"
  };
}

function researchTwoEngineStudy(outcomes) {
  const assignments=[];
  const dates=[...new Set((outcomes||[]).map(x=>x.scanDate).filter(Boolean))].sort();
  for(const date of dates) {
    const rows=(outcomes||[]).filter(x=>x.scanDate===date &&
      Number.isFinite(researchNumber(x.snapshot?.price?.residualSectorRs20)) &&
      Number.isFinite(researchNumber(x.snapshot?.volume?.volumeTodayVsPrev5)));
    if(rows.length<4) continue;
    const strengthMed=counterfactualMedian(rows.map(x=>researchNumber(x.snapshot.price.residualSectorRs20)));
    const attentionMed=counterfactualMedian(rows.map(x=>researchNumber(x.snapshot.volume.volumeTodayVsPrev5)));
    for(const row of rows) {
      const strong=researchNumber(row.snapshot.price.residualSectorRs20)>=strengthMed;
      if(!strong) continue;
      const attention=researchNumber(row.snapshot.volume.volumeTodayVsPrev5)>=attentionMed;
      assignments.push({...row,engine:attention?"ATTENTION_CONTINUATION_PROXY":"QUIET_UNDERREACTION_PROXY"});
    }
  }
  const engines=["QUIET_UNDERREACTION_PROXY","ATTENTION_CONTINUATION_PROXY"];
  const byEngine={};
  for(const engine of engines) {
    const rows=assignments.filter(x=>x.engine===engine);
    const horizons={};
    for(const h of [5,10,20]) {
      const metrics=rows.map(x=>x.horizons?.["d"+h]).filter(Boolean);
      horizons["d"+h]={
        returnPct:counterfactualMetricStats(metrics.map(x=>x.returnPct)),
        mfePct:counterfactualMetricStats(metrics.map(x=>x.mfePct)),
        maePct:counterfactualMetricStats(metrics.map(x=>x.maePct)),
        independentScanDates:new Set(rows.filter(x=>Number.isFinite(x.horizons?.["d"+h]?.returnPct)).map(x=>x.scanDate)).size
      };
    }
    const regimes={};
    for(const row of rows) {
      const regime=row.snapshot?.market?.regime||"UNKNOWN";
      regimes[regime]=(regimes[regime]||0)+1;
    }
    byEngine[engine]={n:rows.length,horizons,regimes};
  }
  const paired={};
  for(const h of [5,10,20]) {
    const deltas=[];
    for(const date of dates) {
      const q=assignments.filter(x=>x.scanDate===date&&x.engine==="QUIET_UNDERREACTION_PROXY").map(x=>x.horizons?.["d"+h]?.returnPct).filter(Number.isFinite);
      const a=assignments.filter(x=>x.scanDate===date&&x.engine==="ATTENTION_CONTINUATION_PROXY").map(x=>x.horizons?.["d"+h]?.returnPct).filter(Number.isFinite);
      if(!q.length||!a.length) continue;
      deltas.push(counterfactualMean(q)-counterfactualMean(a));
    }
    paired["d"+h]={...counterfactualMetricStats(deltas),pairedDates:deltas.length,interpretation:deltas.length>=20?"DESCRIPTIVE_READY":"ACCUMULATING"};
  }
  return {
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,experimentId:"R08",
    method:"R07_MEDIAN_SPLIT_TWO_ENGINE_COMPARISON",assignments:assignments.length,byEngine,paired,
    status:(paired.d5?.pairedDates||0)>=20?"DESCRIPTIVE_READY":"ACCUMULATING",
    rule:"R08不新增固定倍量或RS門檻；沿用R07同日中位數切分，只比較兩種強勢機制的路徑、風險與Regime敏感度。不得以此直接改正式A/B線。"
  };
}
