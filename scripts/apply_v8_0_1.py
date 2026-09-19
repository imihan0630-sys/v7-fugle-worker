from pathlib import Path

path = Path("Worker.js")
text = path.read_text(encoding="utf-8")


def replace_once(old: str, new: str, label: str) -> None:
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly 1 match, found {count}")
    text = text.replace(old, new, 1)


def replace_between(start: str, end: str, replacement: str, label: str) -> None:
    global text
    i = text.find(start)
    if i < 0:
        raise SystemExit(f"{label}: start marker missing")
    j = text.find(end, i)
    if j < 0:
        raise SystemExit(f"{label}: end marker missing")
    text = text[:i] + replacement + text[j:]


replace_once(
    'const VERSION = "7.5.33-dynamic-watchlist-12";',
    'const VERSION = "8.0.1-requirement11-q4-eps";',
    "runtime version",
)

replace_between(
    '  if(body.kind==="QUARTER_EPS") {',
    '  if(body.kind==="INDEX") {',
'''  if(body.kind==="QUARTER_EPS") {
    if(!Number.isInteger(body.year) || !Number.isInteger(body.quarter) || body.quarter<1 || body.quarter>4 || new Date(Date.UTC(body.year,body.quarter*3,0)).toISOString().slice(0,10)>date || !Array.isArray(body.reports) || body.reports.length>200) throw new Error("單季EPS期間或複核數量無效");
    const stocks={},financial=body.financialSnapshot;
    if(!financial || financial.year!==body.year || financial.quarter!==body.quarter || !financial.stocks) throw new Error("單季EPS缺少同日已驗證FINANCIAL快照");
    const applyQoq=(stock,previous)=>{
      const current=toNumber(stock.quarterEPS),prior=toNumber(previous);
      stock.previousQuarterEPS=prior;
      stock.previousQuarterEpsVerified=current!==null && prior!==null;
      stock.epsQoQReady=stock.previousQuarterEpsVerified;
      stock.epsQoQPercentageReady=stock.previousQuarterEpsVerified && prior>0;
      stock.epsQoQ=stock.epsQoQPercentageReady ? (current/prior-1)*100 : null;
      stock.epsQoQChangeAmount=stock.previousQuarterEpsVerified ? current-prior : null;
      stock.epsQoQTurnedProfitable=stock.previousQuarterEpsVerified && prior<=0 && current>0 ? 1 : 0;
      stock.epsQoQLossNarrowed=stock.previousQuarterEpsVerified && prior<0 && current<=0 && current>prior ? 1 : 0;
      stock.epsQoQLossWidened=stock.previousQuarterEpsVerified && prior<0 && current<prior ? 1 : 0;
      stock.epsQoQMissingReason=!stock.previousQuarterEpsVerified ? "缺前一季已驗證單季EPS" : prior>0 ? null : "前季EPS為負或0；保留變動額與轉盈／虧損變化，不產生誤導QoQ百分比";
      stock.epsQoQBasis="Q1-Q3採MOPS合併綜合損益表直接單季EPS；Q4依TWSE財務比較E點通公開規則，以Q4累計EPS減Q3累計EPS；不自行以淨利／股本重算EPS";
    };
    for(const report of body.reports) {
      if(!/^[1-9][0-9]{3}$/.test(report.symbol) || stocks[report.symbol]) throw new Error("單季EPS候選代號重複／無效");
      const financialStock=financial.stocks[report.symbol];
      if(!financialStock) throw new Error("單季EPS候選缺FINANCIAL對應資料");
      let stock;
      if(body.quarter===4) {
        if(report.sourceUrl!=="https://mopsfin.twse.com.tw/terms" || financialStock.quarterEpsVerified!==true || financialStock.quarterEpsMethod!=="MOPSFIN_OFFICIAL_Q4_CUMULATIVE_MINUS_Q3" || toNumber(financialStock.quarterEPS)===null) throw new Error("Q4單季EPS未依TWSE財務比較E點通官方公式驗證");
        stock={
          eps:financialStock.quarterEPS,quarterEPS:financialStock.quarterEPS,quarterEpsVerified:true,
          reportedPriorYearQuarterEPS:financialStock.reportedPriorYearQuarterEPS ?? null,
          epsYoY:financialStock.epsYoY ?? null,epsComparisonsReady:true,
          epsYoYPercentageReady:financialStock.epsYoYPercentageReady===true,
          epsYoYChangeAmount:financialStock.epsYoYChangeAmount ?? null,
          epsTurnedProfitable:financialStock.epsTurnedProfitable || 0,
          epsLossNarrowed:financialStock.epsLossNarrowed || 0,
          epsLossWidened:financialStock.epsLossWidened || 0,
          epsYoYMissingReason:financialStock.epsYoYMissingReason ?? null,
          epsBasis:financialStock.epsBasis,
          quarterEpsSource:"https://mopsfin.twse.com.tw/terms",
          quarterEpsYear:body.year,quarterEpsQuarter:4,
          quarterEpsMethod:"MOPSFIN_OFFICIAL_Q4_CUMULATIVE_MINUS_Q3"
        };
      } else {
        if(report.sourceUrl!=="https://mopsov.twse.com.tw/mops/web/ajax_t164sb04") throw new Error("單季EPS官方來源不符");
        stock=parseMopsQuarterEpsHtml(report.html,report.symbol,body.year,body.quarter);
      }
      let previous=null;
      if(body.quarter===1) {
        if(financialStock.previousQuarterEpsVerified!==true || financialStock.previousQuarterEpsMethod!=="MOPSFIN_OFFICIAL_Q4_CUMULATIVE_MINUS_Q3") throw new Error("Q1前季Q4缺TWSE官方公式驗證");
        previous=financialStock.previousQuarterEPS;
        stock.previousQuarterEpsYear=body.year-1;
        stock.previousQuarterEpsQuarter=4;
        stock.previousQuarterEpsMethod=financialStock.previousQuarterEpsMethod;
      } else {
        if(report.previousQuarterHtml===undefined) throw new Error("缺前一季直接公告EPS");
        const prior=parseMopsQuarterEpsHtml(report.previousQuarterHtml,report.symbol,body.year,body.quarter-1);
        previous=prior.quarterEPS;
        stock.previousQuarterEpsYear=body.year;
        stock.previousQuarterEpsQuarter=body.quarter-1;
        stock.previousQuarterEpsMethod="MOPS_DIRECT_SINGLE_QUARTER";
      }
      applyQoq(stock,previous);
      stocks[report.symbol]=stock;
    }
    return {asOfDate:date,year:body.year,quarter:body.quarter,count:Object.keys(stocks).length,stocks,
      scope:"通過初步精篩候選的官方單季EPS逐檔核對；Q4使用TWSE財務比較E點通公開公式；不是全市場EPS覆蓋",
      q4Methodology:"https://mopsfin.twse.com.tw/terms"};
  }
''',
    "quarter EPS validation",
)

replace_between(
    'function deriveQuarterlyFinancials(periods,year,quarter) {',
    'function mergeEnrichment(rows, enrichment) {',
'''function deriveQuarterlyFinancials(periods,year,quarter) {
  const byPeriod=new Map(periods.map(period=>[`${period.year}Q${period.quarter}`,period.stocks]));
  const current=byPeriod.get(`${year}Q${quarter}`) || {},stocks={};
  const subtractQuarter=(symbol,y,q)=>{
    const cumulative=byPeriod.get(`${y}Q${q}`)?.[symbol],before=q===1 ? {revenueYTD:0,grossYTD:0,operatingYTD:0,epsYTD:0} : byPeriod.get(`${y}Q${q-1}`)?.[symbol];
    if(!cumulative || !before) return null;
    const result={};for(const key of ['revenue','gross','operating']) result[key]=cumulative[key+'YTD']-before[key+'YTD'];
    return result.revenue>0 ? {...result,grossMargin:result.gross/result.revenue*100,operatingMargin:result.operating/result.revenue*100} : null;
  };
  const officialSingleEps=(symbol,y,q)=>{
    const cumulative=byPeriod.get(`${y}Q${q}`)?.[symbol];
    if(!cumulative || !Number.isFinite(cumulative.epsYTD)) return null;
    if(q===1) return {value:cumulative.epsYTD,method:"MOPS_DIRECT_Q1_CUMULATIVE_EQUALS_SINGLE",cumulativeEPS:cumulative.epsYTD,priorCumulativeEPS:0};
    if(q===4) {
      const q3=byPeriod.get(`${y}Q3`)?.[symbol];
      if(!q3 || !Number.isFinite(q3.epsYTD)) return null;
      return {value:round(cumulative.epsYTD-q3.epsYTD,2),method:"MOPSFIN_OFFICIAL_Q4_CUMULATIVE_MINUS_Q3",cumulativeEPS:cumulative.epsYTD,priorCumulativeEPS:q3.epsYTD};
    }
    return null;
  };
  const growth=(now,before)=>Number.isFinite(now) && Number.isFinite(before) && before>0 ? (now/before-1)*100 : null;
  for(const symbol of Object.keys(current)) {
    const latest=subtractQuarter(symbol,year,quarter),previous=subtractQuarter(symbol,quarter===1?year-1:year,quarter===1?4:quarter-1),lastYear=subtractQuarter(symbol,year-1,quarter);
    if(!latest || !previous || !lastYear) continue;
    const latestEps=officialSingleEps(symbol,year,quarter);
    const lastYearEps=officialSingleEps(symbol,year-1,quarter);
    const previousEps=officialSingleEps(symbol,quarter===1?year-1:year,quarter===1?4:quarter-1);
    const epsCurrent=latestEps?.value ?? current[symbol].epsYTD;
    const epsYoY=latestEps && lastYearEps ? growth(latestEps.value,lastYearEps.value) : null;
    const epsYoYCompared=!!(latestEps && lastYearEps);
    stocks[symbol]={financialYear:String(year-1911),financialQuarter:String(quarter),quarterRevenue:latest.revenue,
      quarterEPS:latestEps?.value ?? null,quarterEpsVerified:!!latestEps,quarterEpsMethod:latestEps?.method || null,
      q4CumulativeEPS:quarter===4 ? latestEps?.cumulativeEPS ?? null : null,q3CumulativeEPS:quarter===4 ? latestEps?.priorCumulativeEPS ?? null : null,
      previousQuarterEPS:previousEps?.value ?? null,previousQuarterEpsVerified:!!previousEps,previousQuarterEpsMethod:previousEps?.method || null,
      eps:epsCurrent,reportedCumulativeEPS:current[symbol].epsYTD,
      reportedPriorYearQuarterEPS:lastYearEps?.value ?? null,epsYoY,
      epsComparisonsReady:epsYoYCompared,epsYoYPercentageReady:epsYoYCompared && lastYearEps.value>0,
      epsYoYChangeAmount:epsYoYCompared ? latestEps.value-lastYearEps.value : null,
      epsTurnedProfitable:epsYoYCompared && lastYearEps.value<=0 && latestEps.value>0 ? 1 : 0,
      epsLossNarrowed:epsYoYCompared && lastYearEps.value<0 && latestEps.value<=0 && latestEps.value>lastYearEps.value ? 1 : 0,
      epsLossWidened:epsYoYCompared && lastYearEps.value<0 && latestEps.value<lastYearEps.value ? 1 : 0,
      epsYoYMissingReason:!epsYoYCompared ? "Q2/Q3單季EPS改由候選逐檔MOPS直接報表複核" : lastYearEps.value>0 ? null : "同期EPS為負或0；保留變動額與轉盈／虧損變化，不產生誤導成長百分比",
      epsQoQ:null,epsQoQReady:false,
      epsBasis:latestEps?.method==="MOPSFIN_OFFICIAL_Q4_CUMULATIVE_MINUS_Q3"
        ? "TWSE財務比較E點通公開規則：Q4單季EPS=Q4累計EPS-Q3累計EPS；底層數字均取MOPS官方財報"
        : latestEps ? "MOPS Q1累計期間等同單季；Q2/Q3由候選逐檔直接單季報表覆蓋" : "MOPS截至同季累計EPS；Q2/Q3不以累計差額冒充單季EPS",
      revenueQuarterYoY:growth(latest.revenue,lastYear.revenue),revenueQoQ:growth(latest.revenue,previous.revenue),
      grossMargin:latest.grossMargin,operatingMargin:latest.operatingMargin,grossMarginYoY:latest.grossMargin-lastYear.grossMargin,operatingMarginYoY:latest.operatingMargin-lastYear.operatingMargin,
      grossMarginQoQ:latest.grossMargin-previous.grossMargin,operatingMarginQoQ:latest.operatingMargin-previous.operatingMargin,
      financialBasis:"營收及利益為MOPS累計仟元差額轉單季；EPS Q1直接、Q2/Q3逐檔直接報表、Q4依TWSE財務比較E點通公開公式；負或0基期不捏造成長率"};
  }
  return stocks;
}

''',
    "quarterly financial derivation",
)

replace_once(
'''        const validated=validateOfficialQualityData(body,marketDate);
        await writeQualitySnapshot(env,body.kind,marketDate,validated);''',
'''        let validationBody=body;
        if(body.kind==="QUARTER_EPS") {
          const financialSnapshot=await readQualitySnapshot(env,"FINANCIAL",marketDate);
          validationBody={...body,financialSnapshot};
        }
        const validated=validateOfficialQualityData(validationBody,marketDate);
        await writeQualitySnapshot(env,body.kind,marketDate,validated);''',
    "trusted financial snapshot injection",
)

replace_once(
'''    requirements30: {complete:false, incompleteRules:[11,17,18,19,26,27,28,29], record:"REQUIREMENTS_30.md",pendingAcceptance:"可核對單季及面額調整EPS、完整payload外部寫入、盤中真實訊號／手機實收；並發鎖已測，網路回覆不明與崩潰不保證絕對只送一次"},''',
'''    requirements30: {complete:false, incompleteRules:[17,18,19,26,27,28,29], record:"REQUIREMENTS_30.md",pendingAcceptance:"第11項財報已完成Q1-Q4單季EPS、YoY/QoQ、營收/毛利/營益、估值與官方公告催化查核；其餘待完整payload外部寫入、盤中真實訊號／手機實收與外部交叉驗證"},''',
    "requirements 30 diagnostics",
)

text = text.replace(
    'qoqBasis:"未獨立核對跨季面額／股數調整，不用未調整QoQ加分"',
    'qoqBasis:"Q1-Q3使用MOPS直接單季EPS，Q4依TWSE財務比較E點通公開公式；前季亦須官方核對後才計QoQ，負或0基期不產生百分比"',
)

path.write_text(text, encoding="utf-8")
print("Applied V8.0.1 requirement 11 Q4 EPS completion")
