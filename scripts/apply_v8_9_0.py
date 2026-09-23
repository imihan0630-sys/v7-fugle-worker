from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text=text.replace(old,new,1)

def insert_before_once(marker,addition,label):
    global text
    count=text.count(marker)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 marker, found {count}")
    text=text.replace(marker,addition+marker,1)

replace_once(
    'const VERSION = "8.8.2-zero-selection-push-guard";',
    'const VERSION = "8.9.0-three-pool-hybrid-shadow";',
    "runtime version"
)

replace_once(
'''    enabled: true,

    symbol,''',
'''    enabled: true,
    strategyPool: String(item.strategyPool || "").trim() || null,

    symbol,''',
    "preserve strategy pool through normalization"
)

replace_once(
    'const THOUSAND_STOCK_PRICE = 1000;',
    '''const THOUSAND_STOCK_PRICE = 1000;
const STRATEGY_POOL_CAPITAL = 200000; // 3+3+3：每池固定20萬，資金不跨池
const HYBRID_MAX_STOCKS = 3; // 第三池最多3檔；沒有符合就是0，不硬湊
const HYBRID_POOL_ID = "HYBRID_THOUSAND_SHADOW";
const HYBRID_KV_KEY = "V9_HYBRID_THOUSAND_SHADOW";''',
    "three-pool constants"
)

# Strategy-pool archive preserves A-only / C-only / A+C overlap without symbol de-duplication across pools.
replace_once(
    '  D1_SCHEMA_READY = true;',
    '''  await env.V7_DB.prepare(`CREATE TABLE IF NOT EXISTS v9_strategy_pool_plans (
    scan_date TEXT NOT NULL,
    pool_id TEXT NOT NULL,
    symbol TEXT NOT NULL,
    name TEXT,
    reference_close REAL,
    capital REAL NOT NULL,
    plan_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY(scan_date,pool_id,symbol)
  )`).run();
  await env.V7_DB.prepare(`CREATE INDEX IF NOT EXISTS idx_v9_strategy_pool_plans_pool_date
    ON v9_strategy_pool_plans(pool_id,scan_date)`).run();
  D1_SCHEMA_READY = true;''',
    "strategy-pool archive schema"
)

hybrid_helpers=r'''
function hybridReject(reason) {
  return {ok:false, reason};
}

// 第三池刻意不呼叫 scoreCandidate()、strategySetupState() 或 A/B RR 門檻。
// Formal 千元池回答「A/B型態＋RR是否已正式確認」；Hybrid 回答
// 「基本面＋Smart Money＋早期價格接受＋未過熱＋仍有可驗證空間，是否足以進Shadow觀察」。
function scoreHybridCandidate(f, sector) {
  if ((toNumber(f.close) || 0) < THOUSAND_STOCK_PRICE) return hybridReject("非千元股");
  if ((f.historyDays || 0) < 60) return hybridReject("歷史資料未滿60日");
  if (toNumber(f.marketCapYi)===null || f.marketCapYi < 30) return hybridReject("市值/品質基礎不足");
  if ((toNumber(f.avgVolume20Lots) || 0) < 300) return hybridReject("千元股20日流動性不足");
  if (toNumber(f.chipConcentration)===null) return hybridReject("缺籌碼集中度");
  if (!(f.quarterRevenue>0) || !f.financialBasis || f.valuationObserved!==true || f.announcementsVerified!==true) {
    return hybridReject("基本面/估值/公告資料不足");
  }
  if ((f.officialAnnouncements || []).some(item=>/停止交易|重大損失|重整|退票|財報不實/.test(item.title))) {
    return hybridReject("官方公告有重大風險事件");
  }

  const fundamental=fundamentalScore(f);
  if (financialDataCount(f)<3 || fundamental<45) return hybridReject("基本面品質未達Hybrid門檻");

  const inst=institutionalScore(f);
  const foreignDays=toNumber(f.foreignBuyDays)||0;
  const trustDays=toNumber(f.trustBuyDays)||0;
  const dealerDays=toNumber(f.dealerBuyDays)||0;
  const net=toNumber(f.institutionTotalNet)||0;
  const smartMoneyPersistent = foreignDays>=2 || trustDays>=2 || dealerDays>=3 || (inst>=55 && net>0);
  if (inst<45 || !smartMoneyPersistent) return hybridReject("Smart Money持續性不足");

  // Hybrid允許早於Formal，但不允許「越漲越追」。
  const ret5=toNumber(f.ret5) ?? 0;
  const ret20=toNumber(f.ret20) ?? 0;
  const change=toNumber(f.changePercent) ?? 0;
  const volumeRatio=toNumber(f.volumeTodayVsPrev5) ?? 0;
  const closePos=toNumber(f.dailyClosePosition) ?? 0.5;
  const upperShadow=toNumber(f.dailyUpperShadowRatio) ?? 0;
  const ma20=positiveNumber(f.ma20);
  const close=positiveNumber(f.close);
  if (!close || !ma20) return hybridReject("價格結構資料不足");
  if (ret5>18 || ret20>30 || change>=9.5 || volumeRatio>2.8 || upperShadow>0.38) return hybridReject("過熱/追高風險");
  if (ret20<-12 || close<ma20*0.97) return hybridReject("尚未出現價格接受");
  const priceAcceptance =
    (close>=ma20 && volumeRatio>=0.75 && closePos>=0.52) ||
    (close>=ma20*0.985 && ret5>=0 && closePos>=0.62);
  if (!priceAcceptance) return hybridReject("早期價格接受尚未成立");

  // 產業只作安全否決，不作Formal同款的主排序核心。
  if (Number.isFinite(sector?.breadth) && sector.breadth<35) return hybridReject("產業廣度過弱");
  if (Number.isFinite(sector?.avgChange) && sector.avgChange<-1.5) return hybridReject("產業動能過弱");

  const entry=close;
  const target=nearestRealResistance(f,entry);
  if (target===null || target<=entry) return hybridReject("上方無可驗證剩餘空間");
  const upsidePct=(target/entry-1)*100;
  if (upsidePct<10) return hybridReject("可驗證剩餘空間不足10%");

  const atr=Math.max(entry*0.02, ((toNumber(f.atrPercent)||0)/100)*entry);
  const structureLow=positiveNumber(f.recentLow5Prev) || ma20;
  let stop=Math.min(ma20*0.975, structureLow-atr*0.10);
  if (!(stop>0 && stop<entry)) stop=entry*0.94;
  const risk=entry-stop;
  const reward=target-entry;
  const rr=risk>0 ? reward/risk : 0;

  const heatPenalty=clamp(Math.max(0,ret5-8)*2 + Math.max(0,ret20-18)*1.5 + Math.max(0,volumeRatio-1.8)*12,0,35);
  const structureScore=clamp(
    48 + Math.max(0,(close/ma20-1)*100)*3 + Math.max(0,closePos-0.5)*45 +
    Math.min(14,Math.max(0,volumeRatio-0.7)*10) - upperShadow*35 - heatPenalty,
    0,100
  );
  const upsideScore=clamp(45+(upsidePct-10)*2.5,45,100);
  const hybridScore=clamp(fundamental*0.30 + inst*0.30 + structureScore*0.25 + upsideScore*0.15,0,100);
  const signalLevel=hybridScore>=78 ? "A" : hybridScore>=66 ? "B" : "C";
  if (signalLevel==="C") return hybridReject("Hybrid綜合信心低於B級");

  const buyLow=entry*0.985;
  const buyHigh=entry*1.012;
  const reasons=[
    "Hybrid Early Conviction（非Formal A/B變形）",
    `基本面${round(fundamental,1)}分`,
    `Smart Money${round(inst,1)}分／外資連買${foreignDays}日／投信${trustDays}日`,
    `價格接受${round(structureScore,1)}分`,
    `5日${round(ret5,1)}%／20日${round(ret20,1)}%／量比${round(volumeRatio,2)}`,
    `可驗證剩餘空間${round(upsidePct,1)}%`,
    `參考RR ${round(rr,2)}（僅描述，不使用Formal RR>=2資格門檻）`
  ];

  return {
    ok:true,...f,channel:"H",mode:"HYBRID",signalLevel,
    priorityScore:round(hybridScore,1),
    rewardRisk:round(rr,2),rewardPerRisk:rr,
    sectorFlow:round(toNumber(sector?.score)||0,1),
    relativeStrength:round(ret20-(toNumber(f.marketReturn20)||0),1),
    entry,stop,target,
    planBuyLow:buyLow,planBuyHigh:buyHigh,
    planBreakout:null,setupQuality:structureScore,
    hybridUpsidePct:round(upsidePct,1),
    hybridFundamentalScore:round(fundamental,1),
    hybridSmartMoneyScore:round(inst,1),
    hybridStructureScore:round(structureScore,1),
    selectedReason:reasons.join("；")
  };
}

function allocateHybridPlans(selected,totalCapital,scanDate) {
  const scoreTotal=selected.reduce((sum,item)=>sum+Math.max(1,toNumber(item.priorityScore)||0),0)||1;
  const deployRatio=selected.length<=0?0:selected.length===1?0.35:selected.length===2?0.60:0.85;
  return selected.map((item,index)=>{
    const rawRatio=deployRatio*Math.max(1,toNumber(item.priorityScore)||0)/scoreTotal;
    const ratio=Math.min(MAX_SINGLE_POSITION_RATIO,rawRatio);
    const totalAllocation=Math.floor(totalCapital*ratio/1000)*1000;
    const firstAmount=Math.round(totalAllocation*0.6);
    const secondAmount=totalAllocation-firstAmount;
    const buyLow=round(item.planBuyLow,2),buyHigh=round(item.planBuyHigh,2);
    return {
      code:item.symbol,symbol:item.symbol,name:item.name,rank:index+1,
      formalClose:item.close,closeDate:scanDate,planDate:nextTradingDate(scanDate),
      mode:"HYBRID",channel:"H",signalLevel:item.signalLevel||"B",
      strategyPool:HYBRID_POOL_ID,shadowOnly:true,pushEnabled:false,
      priorityScore:item.priorityScore,rewardRisk:item.rewardRisk,
      sectorFlow:item.sectorFlow,relativeStrength:item.relativeStrength,
      allocationRatio:round(ratio*100,1),totalAllocation,firstAmount,secondAmount,
      firstShares:sharesFor(firstAmount,buyHigh),secondShares:sharesFor(secondAmount,buyHigh),
      buyLow,buyHigh,breakout:null,maxChase:round(buyHigh,2),
      stop:round(item.stop,2),profitCheck:round(item.target,2),reduceAt:round(item.target,2),
      hybridUpsidePct:item.hybridUpsidePct,
      hybridFundamentalScore:item.hybridFundamentalScore,
      hybridSmartMoneyScore:item.hybridSmartMoneyScore,
      hybridStructureScore:item.hybridStructureScore,
      firstCondition:"Hybrid Shadow：進入承接區後，觀察完整15分K是否守低、收高並維持Smart Money邏輯；僅模擬，不發正式BUY",
      secondCondition:"Hybrid Shadow：第一段模擬成立後，再觀察第二次轉強；僅研究，不改Formal部位",
      selectedReason:`${item.selectedReason}；盤後日 ${scanDate}；第三池Shadow，不改Formal Core`,
      positionStage:"NONE"
    };
  });
}

async function archiveStrategyPools(env,scanDate,pools) {
  if (!env?.V7_DB || isTestMode(env)) return {stored:false,reason:isTestMode(env)?"TEST_MODE":"D1 unavailable"};
  await ensureD1Schema(env);
  const session=env.V7_DB.withSession("first-primary");
  const now=new Date().toISOString();
  let stored=0;
  for (const [poolId,plans] of Object.entries(pools||{})) {
    const list=Array.isArray(plans)?plans:[];
    await session.prepare("DELETE FROM v9_strategy_pool_plans WHERE scan_date=?1 AND pool_id=?2").bind(scanDate,poolId).run();
    for (const plan of list) {
      await session.prepare(`INSERT INTO v9_strategy_pool_plans
        (scan_date,pool_id,symbol,name,reference_close,capital,plan_json,created_at,updated_at)
        VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?8)`)
        .bind(scanDate,poolId,String(plan.symbol||plan.code||""),String(plan.name||""),
          toNumber(plan.formalClose),STRATEGY_POOL_CAPITAL,JSON.stringify(plan),now).run();
      stored+=1;
    }
  }
  return {stored:true,count:stored};
}

'''
insert_before_once("function scoreCandidate(f, sector) {",hybrid_helpers,"hybrid helpers")

old_selection='''  thousandScored.sort(rankFn);
  const thousandTop = thousandScored.slice(0, MAX_STOCKS_PER_POOL);

  // 7.5.4：兩個選股池各自保留最多3席，名額完全獨立。
  // 千金股不足3檔時空缺保留；非千金股不得補位。反之亦同。
  const generalTop = scored
    .filter(item => (toNumber(item.close) || 0) < THOUSAND_STOCK_PRICE)
    .slice(0, MAX_STOCKS_PER_POOL);
  const selected = [...generalTop, ...thousandTop].sort(rankFn);
  const finalSymbols = new Set(selected.map(item => item.symbol));'''
new_selection='''  thousandScored.sort(rankFn);
  const thousandTop = thousandScored.slice(0, MAX_STOCKS_PER_POOL);

  // Formal兩池仍使用原A/B核心，但資金各自20萬、不跨池。
  const generalTop = scored
    .filter(item => (toNumber(item.close) || 0) < THOUSAND_STOCK_PRICE)
    .slice(0, MAX_STOCKS_PER_POOL);

  // 第三池：只看千元以上，刻意使用不同於Formal A/B的Hybrid Early Conviction。
  const hybridScored=[];
  const hybridExclusions={};
  for (const f of thousandFeatureRows) {
    const sector=sectorStats[f.industry] || {score:0};
    const result=scoreHybridCandidate(f,sector);
    if (!result.ok) {
      hybridExclusions[result.reason]=(hybridExclusions[result.reason]||0)+1;
      continue;
    }
    hybridScored.push(result);
  }
  hybridScored.sort((a,b)=>b.priorityScore-a.priorityScore || b.hybridUpsidePct-a.hybridUpsidePct || b.hybridSmartMoneyScore-a.hybridSmartMoneyScore);
  const hybridTop=hybridScored.slice(0,HYBRID_MAX_STOCKS);

  const generalPlans=allocateAndBuildPlans(generalTop,STRATEGY_POOL_CAPITAL,scanDate)
    .map(plan=>({...plan,strategyPool:"FORMAL_GENERAL"}));
  const thousandPlans=allocateAndBuildPlans(thousandTop,STRATEGY_POOL_CAPITAL,scanDate)
    .map(plan=>({...plan,strategyPool:"FORMAL_THOUSAND"}));
  const hybridPlans=allocateHybridPlans(hybridTop,STRATEGY_POOL_CAPITAL,scanDate);
  const selected=[...generalTop,...thousandTop].sort(rankFn);
  const finalSymbols = new Set(selected.map(item => item.symbol));
  const formalThousandSymbols=new Set(thousandTop.map(item=>item.symbol));
  const hybridSymbols=new Set(hybridTop.map(item=>item.symbol));
  const overlapSymbols=[...formalThousandSymbols].filter(symbol=>hybridSymbols.has(symbol));'''
replace_once(old_selection,new_selection,"three-pool selection")

replace_once(
'''    unusedGeneralSlots: MAX_STOCKS_PER_POOL - generalTop.length,
    unusedThousandSlots: MAX_STOCKS_PER_POOL - thousandTop.length
  };

  const totalCapital = positiveNumber(env.V7_TOTAL_CAPITAL) || DEFAULT_TOTAL_CAPITAL;
  return {
    candidates: allocateAndBuildPlans(selected, totalCapital, scanDate),
    diagnostics,
    thousandStockPool: diagnostics.thousandStockPool,
    shadowArchive
  };''',
'''    unusedGeneralSlots: MAX_STOCKS_PER_POOL - generalTop.length,
    unusedThousandSlots: MAX_STOCKS_PER_POOL - thousandTop.length
  };
  diagnostics.hybridStockPool = {
    definition: `收盤價>=${THOUSAND_STOCK_PRICE}元；Hybrid Early Conviction Shadow`,
    selectedCount: hybridTop.length,
    quota: HYBRID_MAX_STOCKS,
    capital: STRATEGY_POOL_CAPITAL,
    exclusions: hybridExclusions,
    shortlist: hybridTop.map((item,index)=>({
      rank:index+1,symbol:item.symbol,name:item.name,close:round(item.close,2),
      signalLevel:item.signalLevel,priorityScore:item.priorityScore,rewardRisk:item.rewardRisk,
      upsidePct:item.hybridUpsidePct,fundamentalScore:item.hybridFundamentalScore,
      smartMoneyScore:item.hybridSmartMoneyScore,structureScore:item.hybridStructureScore,
      selectedReason:item.selectedReason
    })),
    policy: "0~3檔、不硬湊；只限千元以上；不使用Formal A/B型態資格或RR>=2資格門檻；目前Shadow，不發正式交易訊號"
  };
  diagnostics.strategyOverlap = {
    formalThousandOnly:[...formalThousandSymbols].filter(symbol=>!hybridSymbols.has(symbol)),
    hybridOnly:[...hybridSymbols].filter(symbol=>!formalThousandSymbols.has(symbol)),
    overlapSymbols,
    overlapCount:overlapSymbols.length,
    interpretation:"共同入選僅代表跨邏輯一致性；不自動升級等級、不自動加碼。需長期比較A-only/C-only/A+C績效，避免相關因子造成假共識。"
  };
  diagnostics.finalPoolMerge = {
    ...diagnostics.finalPoolMerge,
    policy:"3+3+3獨立名額；每池0~3檔、不硬湊；每池20萬不跨池；Hybrid目前Shadow",
    hybridQuota:HYBRID_MAX_STOCKS,
    hybridCandidates:hybridTop.length,
    unusedHybridSlots:HYBRID_MAX_STOCKS-hybridTop.length,
    totalVisibleCandidates:generalTop.length+thousandTop.length+hybridTop.length
  };

  return {
    candidates:[...generalPlans,...thousandPlans],
    hybridCandidates:hybridPlans,
    diagnostics,
    thousandStockPool:diagnostics.thousandStockPool,
    hybridStockPool:diagnostics.hybridStockPool,
    strategyOverlap:diagnostics.strategyOverlap
  };''',
"three-pool return and diagnostics"
)

# Keep Formal validation capped at 6; Hybrid is a separate Shadow array, so duplicate symbols across A/C are preserved.
replace_once(
'''  const stocks = validateStocks(scan.candidates);
  const storedExternal=await env.STOCKS_KV.get(`V7_EXTERNAL_VALIDATION:${marketDate}`,"json");''',
'''  const stocks = validateStocks(scan.candidates);
  const hybridStocks = Array.isArray(scan.hybridCandidates) ? scan.hybridCandidates.slice(0,HYBRID_MAX_STOCKS) : [];
  const storedExternal=await env.STOCKS_KV.get(`V7_EXTERNAL_VALIDATION:${marketDate}`,"json");''',
"hybrid stocks alongside formal"
)

# Persist Hybrid separately; it never enters Formal STOCK_CONFIG_V7 and therefore cannot de-duplicate a shared symbol.
scan_core=text.find("async function runAfterMarketScanCore(")
if scan_core<0:
    raise SystemExit("runAfterMarketScanCore not found")
save_start=text.find("    saved = await saveStockConfig(",scan_core)
if save_start<0:
    raise SystemExit("formal save line not found")
save_end=text.find("\n",save_start)
text=text[:save_start]+'''    saved = await saveStockConfig(env, stocks, "3+3 Formal pools; each ring-fenced 200k", STRATEGY_POOL_CAPITAL);
    await env.STOCKS_KV.put(HYBRID_KV_KEY,JSON.stringify({
      version:VERSION,scanDate:marketDate,planDate:nextTradingDate(marketDate),
      poolId:HYBRID_POOL_ID,poolCapital:STRATEGY_POOL_CAPITAL,shadowOnly:true,stocks:hybridStocks
    }),{expirationTtl:14*86400});
    await archiveStrategyPools(env,marketDate,{
      FORMAL_GENERAL:stocks.filter(stock=>stock.strategyPool==="FORMAL_GENERAL"),
      FORMAL_THOUSAND:stocks.filter(stock=>stock.strategyPool==="FORMAL_THOUSAND"),
      [HYBRID_POOL_ID]:hybridStocks
    });'''+text[save_end:]

# Summary keeps legacy totalCapital field for compatibility but explicitly defines the new semantics.
replace_once(
'''    selectedCount: stocks.length,
    totalCapital,
    capitalPlan: {
      totalCapital,
      plannedInvestment: stocks.reduce((sum, stock) => sum + (toNumber(stock.totalAllocation) || 0), 0),
      remainingCash: Math.max(0, totalCapital - stocks.reduce((sum, stock) => sum + (toNumber(stock.totalAllocation) || 0), 0)),
      firstTrancheTotal: stocks.reduce((sum, stock) => sum + (toNumber(stock.firstAmount) || 0), 0),
      secondTrancheTotal: stocks.reduce((sum, stock) => sum + (toNumber(stock.secondAmount) || 0), 0),
      rule: "總資金預設20萬；依priorityScore動態分配；第一筆60%/第二筆40%；3檔以上最多動用約85%；單股最多35%；未用資金保留現金"
    },
    stocks,
    thousandStockPool: scan.thousandStockPool || null,''',
'''    selectedCount: stocks.length,
    hybridSelectedCount: hybridStocks.length,
    totalCapital: STRATEGY_POOL_CAPITAL,
    poolCapital: STRATEGY_POOL_CAPITAL,
    totalStrategyCapital: STRATEGY_POOL_CAPITAL*3,
    capitalPlan: {
      semantics:"PER_POOL_RING_FENCED",
      poolCapital:STRATEGY_POOL_CAPITAL,
      formalGeneral:buildStrategyPoolCapitalSummary(stocks.filter(stock=>stock.strategyPool==="FORMAL_GENERAL")),
      formalThousand:buildStrategyPoolCapitalSummary(stocks.filter(stock=>stock.strategyPool==="FORMAL_THOUSAND")),
      hybridThousandShadow:buildStrategyPoolCapitalSummary(hybridStocks),
      totalStrategyCapital:STRATEGY_POOL_CAPITAL*3,
      rule:"三池各20萬、資金不跨池；每池0~3檔、不硬湊；Hybrid目前Shadow"
    },
    stocks,
    hybridStocks,
    thousandStockPool: scan.thousandStockPool || null,
    hybridStockPool: scan.hybridStockPool || null,
    strategyOverlap: scan.strategyOverlap || null,''',
"summary pool capital and hybrid"
)

# Add helper before public recommendations.
insert_before_once(
"function buildPublicRecommendations(latest, attempt = null) {",
'''function buildStrategyPoolCapitalSummary(stocks) {
  const list=Array.isArray(stocks)?stocks:[];
  const planned=list.reduce((sum,stock)=>sum+(toNumber(stock?.totalAllocation)||0),0);
  return {
    capital:STRATEGY_POOL_CAPITAL,
    selectedCount:list.length,
    plannedInvestment:planned,
    remainingCash:Math.max(0,STRATEGY_POOL_CAPITAL-planned),
    firstTrancheTotal:list.reduce((sum,stock)=>sum+(toNumber(stock?.firstAmount)||0),0),
    secondTrancheTotal:list.reduce((sum,stock)=>sum+(toNumber(stock?.secondAmount)||0),0)
  };
}

''',
"pool capital helper"
)

# Public JSON exposes the third pool and overlap without changing Formal stock list.
replace_once(
'''  const thousand = latest?.thousandStockPool || null;
  const modeLabel = stock =>''',
'''  const thousand = latest?.thousandStockPool || null;
  const hybrid = latest?.hybridStockPool || null;
  const hybridStocks = Array.isArray(latest?.hybridStocks) ? latest.hybridStocks : [];
  const modeLabel = stock =>''',
"public hybrid locals"
)

replace_once(
'''    thousandStockPool: thousand ? {
      poolCount: Number(thousand.poolCount || 0),
      selectedCount: Number(thousand.selectedCount || 0),
      shortlist: Array.isArray(thousand.shortlist)
        ? thousand.shortlist.slice(0, 6).map(item => ({
            symbol: String(item?.symbol || item?.code || ""),
            name: item?.name || "",
            strategy: modeLabel(item),
            signalLevel: item?.signalLevel || null,
            rewardRisk: toNumber(item?.rewardRisk),
            priorityScore: toNumber(item?.priorityScore)
          }))
        : []
    } : null
  };
}''',
'''    thousandStockPool: thousand ? {
      poolCount: Number(thousand.poolCount || 0),
      selectedCount: Number(thousand.selectedCount || 0),
      shortlist: Array.isArray(thousand.shortlist)
        ? thousand.shortlist.slice(0, 6).map(item => ({
            symbol: String(item?.symbol || item?.code || ""),
            name: item?.name || "",
            strategy: modeLabel(item),
            signalLevel: item?.signalLevel || null,
            rewardRisk: toNumber(item?.rewardRisk),
            priorityScore: toNumber(item?.priorityScore)
          }))
        : []
    } : null,
    hybridStockPool: hybrid ? {
      selectedCount:Number(hybrid.selectedCount||0),
      quota:HYBRID_MAX_STOCKS,
      shadowOnly:true,
      capital:STRATEGY_POOL_CAPITAL,
      shortlist:Array.isArray(hybrid.shortlist)?hybrid.shortlist.slice(0,HYBRID_MAX_STOCKS):[]
    } : null,
    hybridStocks:hybridStocks.map(stock=>({
      symbol:String(stock?.symbol||stock?.code||""),name:stock?.name||"",
      signalLevel:stock?.signalLevel||null,buyLow:toNumber(stock?.buyLow),buyHigh:toNumber(stock?.buyHigh),
      stop:toNumber(stock?.stop),profitCheck:toNumber(stock?.profitCheck),
      priorityScore:toNumber(stock?.priorityScore),rewardRisk:toNumber(stock?.rewardRisk),
      totalAllocation:toNumber(stock?.totalAllocation),selectedReason:stock?.selectedReason||null,shadowOnly:true
    })),
    strategyOverlap:latest?.strategyOverlap||null,
    strategyCapitalPlan:latest?.capitalPlan||null
  };
}''',
"public hybrid payload"
)

# Read-only strategy-pool endpoint for UI/research. It never mutates Formal Core.
route_marker='''    // 只讀既有3Min紀錄並保存驗收證據；不重選、不重送、不更動交易計畫。'''
route=r'''    if (url.pathname === "/api/strategy-pools") {
      if (request.method !== "GET") return json({error:"Method not allowed"},405,true);
      const latest=await env.STOCKS_KV?.get(LAST_SCAN_KEY,"json");
      if (!latest) return json({version:VERSION,status:"尚無盤後策略池結果",poolCapital:STRATEGY_POOL_CAPITAL,pools:[]},200,true);
      const formal=Array.isArray(latest.stocks)?latest.stocks:[];
      const hybrid=Array.isArray(latest.hybridStocks)?latest.hybridStocks:[];
      const pools=[
        {id:"FORMAL_GENERAL",label:"非千元 Formal",capital:STRATEGY_POOL_CAPITAL,shadowOnly:false,
          stocks:formal.filter(stock=>stock.strategyPool==="FORMAL_GENERAL" || (stock.strategyPool==null && (toNumber(stock.formalClose)||0)<THOUSAND_STOCK_PRICE))},
        {id:"FORMAL_THOUSAND",label:"千元 Formal",capital:STRATEGY_POOL_CAPITAL,shadowOnly:false,
          stocks:formal.filter(stock=>stock.strategyPool==="FORMAL_THOUSAND" || (stock.strategyPool==null && (toNumber(stock.formalClose)||0)>=THOUSAND_STOCK_PRICE))},
        {id:HYBRID_POOL_ID,label:"千元 Hybrid",capital:STRATEGY_POOL_CAPITAL,shadowOnly:true,stocks:hybrid}
      ].map(pool=>({...pool,selectedCount:pool.stocks.length,remainingCash:Math.max(0,pool.capital-pool.stocks.reduce((s,x)=>s+(toNumber(x.totalAllocation)||0),0))}));
      return json({
        version:VERSION,scanDate:latest.scanDate||null,generatedAt:latest.generatedAt||null,
        architecture:"3+3+3",rule:"每池0~3檔、不硬湊；各20萬不跨池；Formal千元與Hybrid邏輯刻意分離",
        pools,overlap:latest.strategyOverlap||null,
        formalCoreChanged:false,hybridShadowOnly:true
      },200,true);
    }

'''
insert_before_once(route_marker,route,"strategy-pools endpoint")

# Status text explicitly reports all three pools.
replace_once(
'''status: stocks.length ? `今日選出 ${stocks.length} 檔；非千金股 ${scan.diagnostics?.finalPoolMerge?.finalGeneralSelected || 0}/3、千金股 ${scan.diagnostics?.finalPoolMerge?.finalThousandSelected || 0}/3；空缺不跨池補位` : `今日 0 檔，維持現金；非千金股 0/3、千金股 0/3`,''',
'''status: `3+3+3｜非千元Formal ${scan.diagnostics?.finalPoolMerge?.finalGeneralSelected || 0}/3、千元Formal ${scan.diagnostics?.finalPoolMerge?.finalThousandSelected || 0}/3、千元Hybrid ${hybridStocks.length}/3；沒有符合就是0，不跨池、不硬湊`,''',
"three-pool status"
)

# Keep daily push mandatory; include Shadow selections as context only, never as Formal trade instructions.
replace_once(
'''    const dailyPayload = buildDailySelectionPayload(marketDate, stocks, scan.diagnostics);''',
'''    const dailyPayload = buildDailySelectionPayload(marketDate, stocks, scan.diagnostics);
    dailyPayload.hybridShadow = hybridStocks.map(stock=>({
      rank:stock.rank||stock.sourceRank,symbol:stock.symbol||stock.code,name:stock.name,
      signalLevel:stock.signalLevel,buyLow:stock.buyLow,buyHigh:stock.buyHigh,stop:stock.stop,
      profitCheck:stock.profitCheck,reason:stock.selectedReason,shadowOnly:true
    }));
    dailyPayload.strategyOverlap = scan.strategyOverlap || null;
    dailyPayload.architecture = "3+3+3";
    dailyPayload.poolCapital = STRATEGY_POOL_CAPITAL;''',
"daily payload hybrid context"
)

# Recalculate capital per Formal pool, not across both pools.
start=text.find("function recalculatePlanCapital(stocks, totalCapital) {")
end=text.find("\n\n// ======================================================\n// 讀取設定",start)
if start<0 or end<0:
    raise SystemExit("recalculatePlanCapital function boundary not found")
replacement=r'''function recalculatePlanCapital(stocks, totalCapital) {
  const poolCapital=Number.isFinite(totalCapital)&&totalCapital>0 ? totalCapital : STRATEGY_POOL_CAPITAL;
  const groups=new Map();
  for (const stock of stocks) {
    if (stock.positionStage!=="NONE") throw new Error(`${stock.name}已有持倉：不可用預算重算覆寫持倉股數`);
    const pool=stock.strategyPool || ((toNumber(stock.formalClose)||0)>=THOUSAND_STOCK_PRICE?"FORMAL_THOUSAND":"FORMAL_GENERAL");
    const list=groups.get(pool)||[];list.push(stock);groups.set(pool,list);
  }
  const next=[];
  const summaries={};
  for (const [pool,list] of groups.entries()) {
    let totalWeight=0;
    for (const stock of list) {
      const weight=toNumber(stock.allocationRatio);
      if (weight===null || weight<0 || weight>100) throw new Error(`${stock.name}缺少有效配置比例，不能猜測權重`);
      totalWeight+=weight;
      const price=positiveNumber(stock.buyHigh)||positiveNumber(stock.breakout);
      if (!price) throw new Error(`${stock.name}缺少計畫價格，不能計算股數`);
      const oldTotal=toNumber(stock.totalAllocation);
      const firstRatio=oldTotal>0 && toNumber(stock.firstAmount)!==null ? stock.firstAmount/oldTotal : 0.6;
      const totalAllocation=Math.floor(poolCapital*weight/100);
      const firstAmount=Math.floor(totalAllocation*firstRatio);
      const secondAmount=totalAllocation-firstAmount;
      next.push({...stock,strategyPool:pool,totalAllocation,firstAmount,secondAmount,
        firstShares:sharesFor(firstAmount,price),secondShares:sharesFor(secondAmount,price),
        totalShares:sharesFor(firstAmount,price)+sharesFor(secondAmount,price)});
    }
    if (totalWeight>100+1e-8) throw new Error(`${pool}配置比例總和超過100%，拒絕儲存`);
    const poolRows=next.filter(stock=>stock.strategyPool===pool);
    summaries[pool]={capital:poolCapital,remainingCash:poolCapital-poolRows.reduce((s,x)=>s+x.totalAllocation,0)};
  }
  return {totalCapital:poolCapital,poolCapital,capitalMode:"PER_POOL_RING_FENCED",poolSummaries:summaries,
    remainingCash:Object.values(summaries).reduce((s,x)=>s+x.remainingCash,0),stocks:next};
}
'''
text=text[:start]+replacement+text[end:]

path.write_text(text,encoding="utf-8")
print("Applied V8.9.0 three-pool Hybrid Shadow architecture")
