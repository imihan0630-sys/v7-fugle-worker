const RESEARCH_V8711_EVIDENCE_ENDPOINTS={
  twseMonthlyRevenue:"https://openapi.twse.com.tw/v1/opendata/t187ap05_L",
  tpexMonthlyRevenue:"https://www.tpex.org.tw/openapi/v1/mopsfin_t187ap05_O"
};

function researchRevenueEvidenceMapV8711(rows,market,endpoint) {
  const base=researchRevenueEvidenceMap(rows);
  const out=new Map();
  for(const [symbol,value] of base) out.set(symbol,{
    ...value,
    sourceMarket:market,
    sourceEndpoint:endpoint,
    pointInTimeHistoryStatus:"CURRENT_SNAPSHOT_ONLY",
    firstKnownAt:null,
    vintagePolicy:"capturedAt is the research observation time; dataMonth is the report period, not proof of first market-known timestamp."
  });
  return out;
}

function researchMergeRevenueEvidenceV8711(symbol,twseMap,tpexMap,providers) {
  const listed=twseMap.get(symbol)||null;
  const otc=tpexMap.get(symbol)||null;
  if(listed&&otc) return {
    status:"AMBIGUOUS_MARKET",
    sourceMarket:"AMBIGUOUS",
    listed,otc,
    pointInTimeHistoryStatus:"CURRENT_SNAPSHOT_ONLY"
  };
  if(listed) return listed;
  if(otc) return otc;
  const twseOk=providers?.twseMonthlyRevenue?.status==="AVAILABLE";
  const tpexOk=providers?.tpexMonthlyRevenue?.status==="AVAILABLE";
  if(twseOk&&tpexOk) return {status:"MISSING_FOR_SYMBOL",sourceMarket:"UNKNOWN"};
  return {
    status:"UNKNOWN_PROVIDER_UNAVAILABLE",
    sourceMarket:"UNKNOWN",
    providerStatus:{
      twse:providers?.twseMonthlyRevenue?.status||"UNKNOWN",
      tpex:providers?.tpexMonthlyRevenue?.status||"UNKNOWN"
    }
  };
}

function researchTwseSblShortEvidenceFromPayload(payload,requestedScanDate) {
  const sourceDate=researchDateFromAny(payload?.date||payload?.Date||payload?.stat||null);
  const dateMatched=sourceDate===String(requestedScanDate||"");
  const map=new Map();
  if(!dateMatched) return {sourceDate,dateMatched:false,map};
  const tables=Array.isArray(payload?.tables)?payload.tables:[payload];
  for(const table of tables) {
    const data=Array.isArray(table?.data)?table.data:[];
    for(const values of data) {
      if(!Array.isArray(values)||values.length<14) continue;
      const symbol=researchNormalizeSymbol(values[0]);
      if(!symbol||!/^[0-9A-Za-z]{4,8}$/.test(symbol)) continue;
      map.set(symbol,{
        status:"AVAILABLE",
        sourceMarket:"TWSE",
        sourceDate,
        sourceDataset:"TWT93U",
        sourceEndpoint:"https://www.twse.com.tw/rwd/zh/marginTrading/TWT93U",
        sblShortPrevBalance:researchLooseNumber(values[8]),
        sblShortSale:researchLooseNumber(values[9]),
        sblShortReturn:researchLooseNumber(values[10]),
        sblShortAdjust:researchLooseNumber(values[11]),
        sblShortBalance:researchLooseNumber(values[12]),
        sblShortNextLimit:researchLooseNumber(values[13]),
        shortSideScope:"ACTUAL_SBL_SHORT_SALE",
        flowWindowStatus:"RAW_DAILY_ONLY_NO_CONTIGUOUS_HISTORY",
        flowWindowPolicy:"Do not label one-day SBL as the 5/20/60-day shorting-flow signal. Rolling flow requires unbiased contiguous daily history."
      });
    }
  }
  return {sourceDate,dateMatched:true,map};
}

function researchOfficialStatusForMarketV8711(sourceMarket,providerStatus,map,symbol,unknownReason) {
  if(sourceMarket==="TPEX") return {status:unknownReason,flag:null,detail:null};
  if(sourceMarket!=="TWSE") return {status:"UNKNOWN_MARKET",flag:null,detail:null};
  if(providerStatus!=="AVAILABLE") return {status:"UNKNOWN_PROVIDER_UNAVAILABLE",flag:null,detail:null};
  return {status:"AVAILABLE",flag:map.has(symbol),detail:map.get(symbol)||null};
}

function researchExternalEvidenceCoverageV8711(outcomes) {
  const rows=(outcomes||[]).filter(x=>x.externalEvidence);
  const available=(path)=>rows.filter(x=>path(x.externalEvidence)).length;
  return {
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    schemaVersion:"research-external-evidence-v2",
    outcomeRows:(outcomes||[]).length,evidenceRows:rows.length,
    revenueAvailable:available(x=>x?.revenue?.status==="AVAILABLE"),
    twseRevenueAvailable:available(x=>x?.revenue?.status==="AVAILABLE"&&x?.revenue?.sourceMarket==="TWSE"),
    tpexRevenueAvailable:available(x=>x?.revenue?.status==="AVAILABLE"&&x?.revenue?.sourceMarket==="TPEX"),
    actualSblShortAvailable:available(x=>x?.sblShort?.status==="AVAILABLE"&&x?.sblShort?.shortSideScope==="ACTUAL_SBL_SHORT_SALE"),
    marginAvailable:available(x=>x?.margin?.status==="AVAILABLE"),
    attentionAvailable:available(x=>x?.officialAttention?.status==="AVAILABLE"),
    dispositionAvailable:available(x=>x?.disposition?.status==="AVAILABLE"),
    rule:"跨市場coverage分開報告。缺值維持UNKNOWN；TPEX資料不得因TWSE來源未見代號而誤標成false；一日SBL只保存raw evidence，不冒充5/20/60日shorting-flow。"
  };
}

async function collectResearchExternalEvidenceV8711(archive) {
  const rows=Array.isArray(archive?.rows)?archive.rows:[];
  const scanDate=String(archive?.scanDate||"");
  if(!rows.length||!scanDate) return {
    scanDate,rows:[],providers:{},schemaVersion:"research-external-evidence-v2",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
  const compactDate=scanDate.replace(/-/g,"");
  const marginUrl="https://www.twse.com.tw/rwd/zh/marginTrading/MI_MARGN?date="+encodeURIComponent(compactDate)+"&selectType=STOCK&response=json";
  const sblUrl="https://www.twse.com.tw/rwd/zh/marginTrading/TWT93U?date="+encodeURIComponent(compactDate)+"&response=json";
  const settled=await Promise.allSettled([
    researchFetchJson(RESEARCH_V8711_EVIDENCE_ENDPOINTS.twseMonthlyRevenue),
    researchFetchJson(RESEARCH_V8711_EVIDENCE_ENDPOINTS.tpexMonthlyRevenue),
    researchFetchJson(marginUrl),
    researchFetchJson(sblUrl),
    researchFetchJson(RESEARCH_OFFICIAL_EVIDENCE_ENDPOINTS.attention),
    researchFetchJson(RESEARCH_OFFICIAL_EVIDENCE_ENDPOINTS.disposition)
  ]);
  const providerNames=["twseMonthlyRevenue","tpexMonthlyRevenue","twseMargin","twseSblShort","twseAttention","twseDisposition"];
  const providers={};
  settled.forEach((result,index)=>providers[providerNames[index]]={
    status:result.status==="fulfilled"?"AVAILABLE":"UNAVAILABLE",
    error:result.status==="rejected"?String(result.reason).slice(0,220):null
  });

  const twseRevenueMap=settled[0].status==="fulfilled"
    ?researchRevenueEvidenceMapV8711(settled[0].value,"TWSE",RESEARCH_V8711_EVIDENCE_ENDPOINTS.twseMonthlyRevenue):new Map();
  const tpexRevenueMap=settled[1].status==="fulfilled"
    ?researchRevenueEvidenceMapV8711(settled[1].value,"TPEX",RESEARCH_V8711_EVIDENCE_ENDPOINTS.tpexMonthlyRevenue):new Map();

  const marginParsed=settled[2].status==="fulfilled"
    ?researchMarginEvidenceFromPayload(settled[2].value,scanDate):{sourceDate:null,dateMatched:false,map:new Map()};
  providers.twseMargin.sourceDate=marginParsed.sourceDate;
  providers.twseMargin.dateMatched=marginParsed.dateMatched;
  if(providers.twseMargin.status==="AVAILABLE"&&!marginParsed.dateMatched) providers.twseMargin.status="SOURCE_DATE_MISMATCH";

  const sblParsed=settled[3].status==="fulfilled"
    ?researchTwseSblShortEvidenceFromPayload(settled[3].value,scanDate):{sourceDate:null,dateMatched:false,map:new Map()};
  providers.twseSblShort.sourceDate=sblParsed.sourceDate;
  providers.twseSblShort.dateMatched=sblParsed.dateMatched;
  if(providers.twseSblShort.status==="AVAILABLE"&&!sblParsed.dateMatched) providers.twseSblShort.status="SOURCE_DATE_MISMATCH";

  const attentionMap=settled[4].status==="fulfilled"?researchOfficialStatusMap(settled[4].value):new Map();
  const dispositionMap=settled[5].status==="fulfilled"?researchOfficialStatusMap(settled[5].value):new Map();
  const capturedAt=new Date().toISOString();

  const evidenceRows=rows.map(row=>{
    const symbol=researchNormalizeSymbol(row.symbol);
    const revenue=researchMergeRevenueEvidenceV8711(symbol,twseRevenueMap,tpexRevenueMap,providers);
    const sourceMarket=revenue?.sourceMarket||"UNKNOWN";
    let margin;
    if(sourceMarket==="TWSE") margin=marginParsed.map.get(symbol)||{
      status:providers.twseMargin.status==="AVAILABLE"?"MISSING_FOR_SYMBOL":"UNKNOWN_"+providers.twseMargin.status,
      sourceMarket:"TWSE"
    };
    else if(sourceMarket==="TPEX") margin={status:"UNKNOWN_TPEX_MARGIN_NOT_CAPTURED_V8_7_11",sourceMarket:"TPEX"};
    else margin={status:"UNKNOWN_MARKET",sourceMarket:"UNKNOWN"};

    let sblShort;
    if(sourceMarket==="TWSE") sblShort=sblParsed.map.get(symbol)||{
      status:providers.twseSblShort.status==="AVAILABLE"?"MISSING_FOR_SYMBOL":"UNKNOWN_"+providers.twseSblShort.status,
      sourceMarket:"TWSE",
      flowWindowStatus:"RAW_DAILY_ONLY_NO_CONTIGUOUS_HISTORY"
    };
    else if(sourceMarket==="TPEX") sblShort={
      status:"UNKNOWN_TPEX_SBL_NOT_CAPTURED_V8_7_11",sourceMarket:"TPEX",
      flowWindowStatus:"NOT_CAPTURED"
    };
    else sblShort={status:"UNKNOWN_MARKET",sourceMarket:"UNKNOWN",flowWindowStatus:"NOT_CAPTURED"};

    return {
      scanDate,symbol:String(row.symbol),name:row.name||"",cohort:row.cohort||"UNKNOWN",
      schemaVersion:"research-external-evidence-v2",researchOnly:true,decisionImpact:false,formalCoreImpact:false,
      sourceMarket,
      microstructureRegime:scanDate>=RESEARCH_MICROSTRUCTURE_CUTOFF?"CONTINUOUS_TRADING":"LEGACY_CALL_AUCTION",
      revenue,margin,sblShort,
      officialAttention:researchOfficialStatusForMarketV8711(sourceMarket,providers.twseAttention.status,attentionMap,symbol,"UNKNOWN_TPEX_ATTENTION_NOT_CAPTURED_V8_7_11"),
      disposition:researchOfficialStatusForMarketV8711(sourceMarket,providers.twseDisposition.status,dispositionMap,symbol,"UNKNOWN_TPEX_DISPOSITION_NOT_CAPTURED_V8_7_11"),
      provenance:{
        capturedAt,scanDate,noForwardFill:true,pointInTime:true,
        sourceReportPeriodIsNotFirstKnownTime:true,
        providers
      }
    };
  });
  return {
    scanDate,rows:evidenceRows,providers,schemaVersion:"research-external-evidence-v2",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    policy:"V8.7.11擴充跨市場證據與來源語意：TWSE/TPEX月營收分開保存；TWSE實際借券賣出(TWT93U)與一般借券成交分離；資料源失敗、日期不符或尚未涵蓋市場一律UNKNOWN。不得以current snapshot偽造歷史first-known時間，不得改正式排名、配資、監控、推播或交易。"
  };
}

async function readResearchExternalEvidenceSummaryV8711(env,days=120) {
  if(!env?.V7_DB) return {
    schemaVersion:"research-external-evidence-v2",researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    total:0,dates:0,status:"NO_D1"
  };
  await ensureD1Schema(env);
  const safeDays=Math.max(1,Math.min(365,Number(days)||120));
  const fromDate=shiftDateString(taiwanDate(),-(safeDays-1));
  const result=await env.V7_DB.withSession("first-primary").prepare(
    "SELECT scan_date,symbol,evidence_json FROM trade_research_external_evidence WHERE scan_date>=?1 ORDER BY scan_date ASC,symbol ASC LIMIT 5000"
  ).bind(fromDate).all();
  const parsed=[];
  for(const row of result?.results||[]){try{parsed.push(JSON.parse(row.evidence_json||"{}"))}catch(_){}}
  const dates=[...new Set(parsed.map(x=>x.scanDate).filter(Boolean))];
  const byMarket={
    TWSE:parsed.filter(x=>x.sourceMarket==="TWSE").length,
    TPEX:parsed.filter(x=>x.sourceMarket==="TPEX").length,
    UNKNOWN:parsed.filter(x=>!["TWSE","TPEX"].includes(x.sourceMarket)).length
  };
  return {
    schemaVersion:"research-external-evidence-v2",researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    total:parsed.length,dates:dates.length,latestDate:dates.sort().at(-1)||null,byMarket,
    revenueAvailable:parsed.filter(x=>x.revenue?.status==="AVAILABLE").length,
    twseRevenueAvailable:parsed.filter(x=>x.revenue?.status==="AVAILABLE"&&x.revenue?.sourceMarket==="TWSE").length,
    tpexRevenueAvailable:parsed.filter(x=>x.revenue?.status==="AVAILABLE"&&x.revenue?.sourceMarket==="TPEX").length,
    actualSblShortAvailable:parsed.filter(x=>x.sblShort?.status==="AVAILABLE"&&x.sblShort?.shortSideScope==="ACTUAL_SBL_SHORT_SALE").length,
    tpexSblUnknown:parsed.filter(x=>x.sblShort?.status==="UNKNOWN_TPEX_SBL_NOT_CAPTURED_V8_7_11").length,
    marginAvailable:parsed.filter(x=>x.margin?.status==="AVAILABLE").length,
    attentionFlags:parsed.filter(x=>x.officialAttention?.flag===true).length,
    dispositionFlags:parsed.filter(x=>x.disposition?.flag===true).length,
    microstructure:{
      continuous:parsed.filter(x=>x.microstructureRegime==="CONTINUOUS_TRADING").length,
      legacy:parsed.filter(x=>x.microstructureRegime==="LEGACY_CALL_AUCTION").length
    },
    status:parsed.length?"ACCUMULATING":"WAITING_FIRST_EVIDENCE_CAPTURE",
    policy:"V8.7.11將上市/上櫃coverage分開，實際SBL short sale只在官方可驗證時標AVAILABLE。current monthly-revenue snapshot只作前瞻觀察，不冒充歷史vintage。"
  };
}
