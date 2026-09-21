from pathlib import Path
p=Path("Worker.js"); text=p.read_text(encoding="utf-8")
def one(a,b,label):
 global text
 n=text.count(a)
 if n!=1: raise SystemExit(f"{label}: {n}")
 text=text.replace(a,b,1)

one('const VERSION = "8.8.0-shadow-execution-recorder";','const VERSION = "8.8.1-execution-coverage";',"version")

old='''      quote: {
        closePrice: quote?.closePrice ?? null,
        lastUpdated: quote?.lastUpdated ?? quote?.closeTime ?? null,
        isTrial: quote?.isTrial === true
      }'''
new='''      quote: {
        closePrice: quote?.closePrice ?? null,
        lastUpdated: quote?.lastUpdated ?? quote?.closeTime ?? null,
        isTrial: quote?.isTrial === true,
        // Research-only passthrough from the quote call already required by formal monitoring.
        // These fields do not participate in any formal decision.
        previousClose: quote?.previousClose ?? null,
        openPrice: quote?.openPrice ?? null,
        avgPrice: quote?.avgPrice ?? null,
        bids: Array.isArray(quote?.bids) ? quote.bids.slice(0,5).map(x=>({price:x?.price??null,size:x?.size??null})) : null,
        asks: Array.isArray(quote?.asks) ? quote.asks.slice(0,5).map(x=>({price:x?.price??null,size:x?.size??null})) : null,
        tradingHalt: quote?.tradingHalt ?? null,
        isContinuous: typeof quote?.isContinuous==="boolean" ? quote.isContinuous : null,
        isDelayedOpen: typeof quote?.isDelayedOpen==="boolean" ? quote.isDelayedOpen : null,
        isDelayedClose: typeof quote?.isDelayedClose==="boolean" ? quote.isDelayedClose : null,
        isLimitUpHalt: typeof quote?.isLimitUpHalt==="boolean" ? quote.isLimitUpHalt : null,
        isLimitDownHalt: typeof quote?.isLimitDownHalt==="boolean" ? quote.isLimitDownHalt : null
      }'''
one(old,new,"quote passthrough")

old2='''  return {
    schemaVersion:"execution-shadow-v1",
    researchOnly:true,'''
new2='''  const q=result?.quote||{};
  const previousClose=positiveNumber(q.previousClose),openPrice=positiveNumber(q.openPrice),avgPrice=positiveNumber(q.avgPrice);
  const bestBid=positiveNumber(q?.bids?.[0]?.price),bestAsk=positiveNumber(q?.asks?.[0]?.price);
  const bidDepth=Array.isArray(q.bids) ? q.bids.reduce((s,x)=>s+(positiveNumber(x?.size)||0),0) : null;
  const askDepth=Array.isArray(q.asks) ? q.asks.reduce((s,x)=>s+(positiveNumber(x?.size)||0),0) : null;
  const depthTotal=(bidDepth??0)+(askDepth??0);
  const marketState=q?.tradingHalt?.isHalted===true ? "HALTED"
    : q?.isTrial===true ? "TRIAL"
    : q?.isContinuous===true ? "CONTINUOUS"
    : (q?.isDelayedOpen===true || q?.isDelayedClose===true || q?.isLimitUpHalt===true || q?.isLimitDownHalt===true) ? "NON_CONTINUOUS_FLAGGED"
    : "UNKNOWN";
  const unknownReasons=[];
  if(!(previousClose&&openPrice)) unknownReasons.push("OPENING_REFERENCE_NOT_AVAILABLE");
  if(!avgPrice) unknownReasons.push("SESSION_AVG_PRICE_NOT_AVAILABLE");
  if(!(bestBid&&bestAsk&&bestAsk>=bestBid)) unknownReasons.push("BID_ASK_NOT_AVAILABLE");
  if(!(depthTotal>0)) unknownReasons.push("DEPTH_NOT_AVAILABLE");
  if(marketState==="UNKNOWN") unknownReasons.push("MARKET_MECHANISM_STATE_NOT_VERIFIED");
  // Fugle avgPrice is the official quote field for intraday average transaction price.
  // Keep the raw semantic name alongside the research alias instead of claiming an independently reconstructed VWAP.
  return {
    schemaVersion:"execution-shadow-v2",
    researchOnly:true,'''
one(old2,new2,"payload calculations")

old3='''    openingGapPct:null,
    sessionVwap:null,
    spreadPct:null,
    depthImbalance:null,
    executionMarketState:"UNKNOWN",
    unknownReasons:[
      "OPENING_REFERENCE_NOT_CAPTURED",
      "SESSION_VWAP_NOT_CAPTURED",
      "BID_ASK_NOT_CAPTURED",
      "DEPTH_NOT_CAPTURED",
      "MARKET_MECHANISM_STATE_NOT_VERIFIED"
    ],'''
new3='''    openingGapPct:previousClose&&openPrice ? round((openPrice/previousClose-1)*100,4) : null,
    sessionAvgPrice:avgPrice,
    sessionVwapProxy:avgPrice,
    sessionVwapProxySemantics:avgPrice ? "FUGLE_INTRADAY_QUOTE_AVG_PRICE" : null,
    bestBid,
    bestAsk,
    spreadPct:bestBid&&bestAsk&&bestAsk>=bestBid ? round((bestAsk-bestBid)/((bestAsk+bestBid)/2)*100,4) : null,
    bidDepth5:bidDepth,
    askDepth5:askDepth,
    depthImbalance:depthTotal>0 ? round((bidDepth-askDepth)/depthTotal,4) : null,
    executionMarketState:marketState,
    marketStateProvenance:"FUGLE_INTRADAY_QUOTE_FLAGS",
    marketStateLimit:"Does not identify disposition status or a dedicated VI event; UNKNOWN is retained when quote flags are insufficient.",
    unknownReasons,''';
one(old3,new3,"payload research fields")

p.write_text(text,encoding="utf-8")
print("Applied V8.8.1 execution source coverage")
