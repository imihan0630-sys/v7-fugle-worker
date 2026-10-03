const finite=x=>typeof x==="number"&&Number.isFinite(x)?x:null;
function parse(row){
  let q;
  try{q=typeof row?.quote_json==="string"?JSON.parse(row.quote_json):row?.quote_json;}catch(_){throw new Error("C3_QUOTE_JSON_INVALID");}
  if(q?.schemaVersion!=="SYSTEM1_C3_QUOTE_CONTEXT_V0_1") throw new Error("C3_QUOTE_SCHEMA_INVALID");
  return q;
}
export function adaptC3QuoteRows(rows,{generationId=null,targetTradeDate=null}={}){
  const out=[],seen=new Set();
  for(const row of rows||[]){
    if(generationId&&row?.generation_id!==generationId) throw new Error("C3_QUOTE_GENERATION_MISMATCH");
    if(targetTradeDate&&row?.target_trade_date!==targetTradeDate) throw new Error("C3_QUOTE_TARGET_DATE_MISMATCH");
    if(row?.source_family!=="FUGLE_INTRADAY_QUOTE") throw new Error("C3_QUOTE_SOURCE_FAMILY_INVALID");
    const symbol=String(row?.symbol||""),barStart=String(row?.bar_start||"");
    const key=symbol+"|"+barStart;
    if(!symbol||!Number.isFinite(Date.parse(barStart))||seen.has(key)) throw new Error("C3_QUOTE_DUPLICATE_OR_INVALID_KEY");
    seen.add(key);
    const q=parse(row);
    if(String(q.symbol||symbol)!==symbol) throw new Error("C3_QUOTE_SYMBOL_MISMATCH");
    const limitKnown=typeof q.isLimitUpPrice==="boolean";
    const continuous=q.executionMarketState==="CONTINUOUS";
    const sourceFetchedAt=String(row?.source_fetched_at||"");
    const fetchedAtValid=Number.isFinite(Date.parse(sourceFetchedAt));
    const verified=limitKnown&&continuous&&fetchedAtValid;
    out.push({
      symbol,barStart,verified,limitUp:limitKnown?q.isLimitUpPrice:null,
      marketState:typeof q.executionMarketState==="string"?q.executionMarketState:null,
      sourceFetchedAt:fetchedAtValid?sourceFetchedAt:null,
      quoteContext:{
        bestBid:finite(q.bestBid),bestAsk:finite(q.bestAsk),spreadPct:finite(q.spreadPct),
        bidDepth5:finite(q.bidDepth5),askDepth5:finite(q.askDepth5),depthImbalance:finite(q.depthImbalance),
        isLimitUpPrice:limitKnown?q.isLimitUpPrice:null,
        isLimitDownPrice:typeof q.isLimitDownPrice==="boolean"?q.isLimitDownPrice:null,
        isLimitUpHalt:typeof q.isLimitUpHalt==="boolean"?q.isLimitUpHalt:null,
        isLimitDownHalt:typeof q.isLimitDownHalt==="boolean"?q.isLimitDownHalt:null,
        unknownReasons:Array.isArray(q.unknownReasons)?[...q.unknownReasons]:[]
      },
      intradayDepthScore:null,intradayDepthScoreInvented:false,
      blockers:[...(!limitKnown?["LIMIT_PRICE_STATE_NOT_VERIFIED"]:[]),...(!continuous?["MARKET_STATE_NOT_CONTINUOUS"]:[]),...(!fetchedAtValid?["SOURCE_FETCH_TIME_INVALID"]:[])],
      researchOnly:true,decisionImpact:false,formalCoreImpact:false
    });
  }
  const verifiedN=out.filter(x=>x.verified).length;
  return {schemaVersion:"SYSTEM1_C3_QUOTE_ADAPTER_V0_1",generationId,targetTradeDate,
    rowN:out.length,verifiedN,blockedN:out.length-verifiedN,rows:out,
    rawDepthPreserved:true,intradayDepthScoreInvented:false,missingLimitStateNeverFalse:true,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false};
}
