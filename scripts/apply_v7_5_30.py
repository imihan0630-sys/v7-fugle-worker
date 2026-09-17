from pathlib import Path

path = Path("Worker.js")
text = path.read_text(encoding="utf-8")


def replace_once(old: str, new: str, label: str) -> None:
    global text
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly 1 match, found {count}")
    text = text.replace(old, new, 1)


def replace_exact(old: str, new: str, expected: int, label: str) -> None:
    global text
    count = text.count(old)
    if count != expected:
        raise SystemExit(f"{label}: expected exactly {expected} matches, found {count}")
    text = text.replace(old, new)


replace_once(
    'const VERSION = "7.5.29-full-plan-pending-card";',
    'const VERSION = "7.5.30-market-consensus-radar";',
    "version",
)

replace_once(
'''    if(url.pathname==="/api/institution-status") {''',
'''    if(url.pathname==="/api/market-consensus") {
      if(!isAuthorized(request,env)) return json({error:"ADMIN_TOKEN 錯誤"},401,true);
      if(!env.STOCKS_KV) return json({error:"Missing KV"},503,true);
      if(request.method==='GET') {
        await loadTradingCalendar(env,Number(taiwanDate().slice(0,4)));
        const date=normalizeMarketDate(url.searchParams.get('marketDate')) || mostRecentWeekday(taiwanDate());
        return json({marketDate:date,reference:await env.STOCKS_KV.get(`V7_MARKET_CONSENSUS:${date}`,"json"),policy:"僅對已通過技術/法人/RR/風控的候選加分，不可救回不合格股"},200,true);
      }
      if(request.method!=='POST') return json({error:"Method not allowed"},405,true);
      try {
        const body=await request.json(),date=normalizeMarketDate(body.marketDate);
        if(!date || date>taiwanDate() || date<shiftDateString(taiwanDate(),-7)) throw new Error("共識日期無效，不接受未來或過舊資料");
        await loadTradingCalendar(env,Number(date.slice(0,4)));if(!isTradingDate(date)) throw new Error("共識日期不是交易日");
        if(!Array.isArray(body.sources) || body.sources.length<1 || body.sources.length>30) throw new Error("sources需1~30個獨立來源");
        const seenSources=new Set(),bySymbol={};
        const sources=body.sources.map(item=>{
          const source=String(item?.source || '').trim();
          if(!source || source.length>100 || seenSources.has(source)) throw new Error("來源名稱空白、過長或重複");
          seenSources.add(source);
          if(!Array.isArray(item.symbols) || item.symbols.length<1 || item.symbols.length>120) throw new Error(`${source}標的數需1~120`);
          const symbols=[...new Set(item.symbols.map(symbol=>String(symbol).trim()))];
          if(symbols.some(symbol=>!/^[1-9][0-9]{3}$/.test(symbol))) throw new Error(`${source}含非普通股代號`);
          for(const symbol of symbols) {
            const row=bySymbol[symbol] || {symbol,sourceCount:0,sources:[]};
            row.sourceCount+=1;row.sources.push(source);bySymbol[symbol]=row;
          }
          return {source,symbols};
        });
        const ranking=Object.values(bySymbol).map(row=>{
          const sourceCount=row.sourceCount;
          const consensusScore=sourceCount<2 ? 0 : Math.min(100,20+sourceCount*15);
          const bonus=sourceCount<2 ? 0 : Math.min(7,(sourceCount-1)*2);
          return {...row,consensusScore,bonus};
        }).sort((a,b)=>b.sourceCount-a.sourceCount || a.symbol.localeCompare(b.symbol));
        const reference={marketDate:date,sources,sourceCount:sources.length,bySymbol:Object.fromEntries(ranking.map(row=>[row.symbol,row])),ranking,
          notes:String(body.notes || '').slice(0,1500),updatedAt:new Date().toISOString(),
          policy:"市場共識只做加分驗證；至少2個獨立來源才加分；最高+7分；不得改變硬性資格、RR門檻、過熱排除或3+3配額"};
        const key=`V7_MARKET_CONSENSUS:${date}`;await env.STOCKS_KV.put(key,JSON.stringify(reference),{expirationTtl:14*86400});
        const readback=await env.STOCKS_KV.get(key,"json");if(JSON.stringify(readback)!==JSON.stringify(reference)) throw new Error("市場共識KV讀回不一致");
        return json({ok:true,verified:true,marketDate:date,sourceCount:sources.length,symbolCount:ranking.length,top:ranking.slice(0,20),policy:reference.policy},200,true);
      }catch(error){return json({error:String(error)},400,true);}
    }

    if(url.pathname==="/api/institution-status") {''',
    "market consensus api",
)

replace_once(
'''function selectTomorrowCandidates(marketState, todayRows, env, scanDate) {''',
'''function applyMarketConsensus(result, consensusReference) {
  if(!result?.ok) return result;
  const row=consensusReference?.bySymbol?.[String(result.symbol)] || null;
  const sourceCount=Number(row?.sourceCount || 0);
  const bonus=sourceCount<2 ? 0 : Math.min(7,(sourceCount-1)*2);
  const consensusScore=sourceCount<2 ? 0 : Math.min(100,20+sourceCount*15);
  return {
    ...result,
    marketConsensusScore:consensusScore,
    marketConsensusSources:sourceCount,
    marketConsensusBonus:bonus,
    priorityScore:round(clamp((toNumber(result.priorityScore)||0)+bonus,0,100),1),
    selectedReason:`${result.selectedReason}；市場共識${sourceCount>=2 ? `${sourceCount}個獨立來源，優先分數+${bonus}` : "未達2個獨立來源，不加分"}`
  };
}

function selectTomorrowCandidates(marketState, todayRows, env, scanDate) {''',
    "consensus overlay helper",
)

replace_once(
'''  const index=env.V7_OFFICIAL_INDEX;
  const marketReturn20=index?.asOfDate===scanDate ? toNumber(index.return20) : null;''',
'''  const index=env.V7_OFFICIAL_INDEX;
  const consensus=env.V7_MARKET_CONSENSUS?.marketDate===scanDate ? env.V7_MARKET_CONSENSUS : null;
  const marketReturn20=index?.asOfDate===scanDate ? toNumber(index.return20) : null;''',
    "consensus load in selector",
)

replace_once(
'''  };
  const scored = [];''',
'''  };
  diagnostics.marketConsensus={
    marketDate:consensus?.marketDate || scanDate,
    sourceCount:Number(consensus?.sourceCount || 0),
    symbolCount:consensus?.bySymbol ? Object.keys(consensus.bySymbol).length : 0,
    applied:consensus?.marketDate===scanDate,
    policy:"至少2個獨立來源才加分；最高+7分；只影響已通過硬條件候選，不救回不合格股"
  };
  const scored = [];''',
    "consensus diagnostics",
)

replace_exact(
'''    const result = scoreCandidate(f, sector);''',
'''    const result = applyMarketConsensus(scoreCandidate(f, sector), consensus);''',
    2,
    "apply consensus to both pools",
)

replace_once(
'''  const rankFn = (a, b) =>
    b.rewardPerRisk - a.rewardPerRisk || b.priorityScore - a.priorityScore ||
    b.setupQuality - a.setupQuality || b.sectorFlow - a.sectorFlow || b.relativeStrength - a.relativeStrength;''',
'''  // 7.5.30：RR仍是硬門檻，但通過後不再獨霸排序；短線優先看綜合品質與市場共識。
  const rankFn = (a, b) =>
    b.priorityScore - a.priorityScore || b.rewardPerRisk - a.rewardPerRisk ||
    (b.marketConsensusScore || 0) - (a.marketConsensusScore || 0) ||
    b.setupQuality - a.setupQuality || b.sectorFlow - a.sectorFlow || b.relativeStrength - a.relativeStrength;''',
    "ranking policy",
)

replace_once(
'''      priorityScore: item.priorityScore, rewardRisk: item.rewardRisk,
      sectorFlow: item.sectorFlow, relativeStrength: item.relativeStrength,''',
'''      priorityScore: item.priorityScore, rewardRisk: item.rewardRisk,
      marketConsensusScore:item.marketConsensusScore || 0, marketConsensusSources:item.marketConsensusSources || 0,
      sectorFlow: item.sectorFlow, relativeStrength: item.relativeStrength,''',
    "plan consensus fields",
)

replace_once(
'''    priorityScore: round(item.priorityScore, 1),
    rewardRisk: round(item.rewardRisk, 2),''',
'''    priorityScore: round(item.priorityScore, 1),
    rewardRisk: round(item.rewardRisk, 2),
    marketConsensusScore:round(item.marketConsensusScore || 0,1),
    marketConsensusSources:Number(item.marketConsensusSources || 0),''',
    "pool preview consensus fields",
)

replace_once(
'''      rewardRisk: toNumber(stock?.rewardRisk),
      priorityScore: toNumber(stock?.priorityScore),''',
'''      rewardRisk: toNumber(stock?.rewardRisk),
      priorityScore: toNumber(stock?.priorityScore),
      marketConsensusScore:toNumber(stock?.marketConsensusScore) || 0,
      marketConsensusSources:Number(stock?.marketConsensusSources || 0),''',
    "public recommendation consensus fields",
)

replace_once(
'''  const scan = selectTomorrowCandidates(marketState, rows, { ...env, V7_TOTAL_CAPITAL: totalCapital, V7_OFFICIAL_INDEX:indexData }, marketDate);''',
'''  const marketConsensus=await env.STOCKS_KV.get(`V7_MARKET_CONSENSUS:${marketDate}`,"json");
  const scan = selectTomorrowCandidates(marketState, rows, { ...env, V7_TOTAL_CAPITAL: totalCapital, V7_OFFICIAL_INDEX:indexData, V7_MARKET_CONSENSUS:marketConsensus }, marketDate);''',
    "load consensus before scan",
)

path.write_text(text, encoding="utf-8")
print("Applied V7.5.30 market consensus radar")
