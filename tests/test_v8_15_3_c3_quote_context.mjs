import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const source=await readFile(process.env.V7_TEST_WORKER_PATH||new URL("../Worker.js",import.meta.url),"utf8");
const exported=source+"\nexport {c3ResearchLimits,c3ResearchQuotePayload};";
const api=await import("data:text/javascript;base64,"+Buffer.from(exported).toString("base64"));
let n=0;const eq=(a,b)=>{assert.deepEqual(a,b);n++};const ok=x=>{assert.ok(x);n++};

assert.match(source,/const VERSION = "8\.15\.3-c3-quote-context";/);n++;
for(const token of [
  "CREATE TABLE IF NOT EXISTS trade_research_c3_quotes",
  'url.pathname === "/api/research/c3-capture-quotes"',
  "FUGLE_INTRADAY_QUOTE_RAW_CONTEXT",
  "C3_CAPTURE_IMMUTABLE_QUOTE_CONFLICT",
  "rawDepthOnly:true",
  "depthScoreDerived:false",
  '"ret20","maDistance20Pct"',
  '"lateStage"',
  'support:channel==="A"',
  'breakout:channel==="B"'
]){assert.ok(source.includes(token),token);n++;}

const limits=api.c3ResearchLimits({});
eq(limits.ready,true);
eq(limits.providerLimitPerMinute,60);
eq(limits.maxTotalCallsPerMinute,50);
eq(limits.maxSymbols,3);
eq(limits.maxCallsPerSlot,6);
eq(limits.callsPerSession,102);

const quote=api.c3ResearchQuotePayload({
  symbol:"2330",date:"2026-10-05",lastUpdated:Date.parse("2026-10-05T01:16:00Z")*1000,
  previousClose:100,openPrice:101,avgPrice:102,
  bids:[{price:101,size:10},{price:100.5,size:20}],
  asks:[{price:101.5,size:15},{price:102,size:5}],
  tradingHalt:{isHalted:false},isTrial:false,isContinuous:true,
  isDelayedOpen:false,isDelayedClose:false,isLimitUpHalt:false,isLimitDownHalt:false
},"2330","2026-10-05",Date.parse("2026-10-05T01:16:00Z"));
eq(quote.bestBid,101);eq(quote.bestAsk,101.5);
eq(quote.bidDepth5,30);eq(quote.askDepth5,20);
eq(quote.depthImbalance,0.2);
eq(quote.executionMarketState,"CONTINUOUS");
eq(quote.isLimitUpHalt,false);
assert.match(quote.semanticLimit,/not a generic at-limit-up flag/);n++;
assert.match(quote.semanticLimit,/not converted to depthScore/);n++;
assert.equal("depthScore" in quote,false);n++;
assert.throws(()=>api.c3ResearchQuotePayload({...quote,symbol:"9999"},"2330","2026-10-05",Date.now()),/SYMBOL_OR_DATE_MISMATCH/);n++;

const start=source.indexOf("async function captureC3ResearchBarsSafe(");
const end=source.indexOf("async function readC3ResearchQuotes(",start);
ok(start>=0&&end>start);
const segment=source.slice(start,end);
assert.match(segment,/const projectedExtraCalls=rows\.length\*2/);n++;
assert.match(segment,/fetchCandles\(String\(row\.symbol\),15,env\)/);n++;
assert.match(segment,/fetchQuote\(String\(row\.symbol\),env\)/);n++;
assert.match(segment,/rows\.length\*C3_RESEARCH_CAPTURE_SLOTS\.length\*2>limits\.callsPerSession/);n++;
assert.match(segment,/baseCalls\+projectedExtraCalls>limits\.maxTotalCallsPerMinute/);n++;
assert.doesNotMatch(segment,/processSignalState\(/);n++;
assert.doesNotMatch(segment,/sendPush\(/);n++;
assert.doesNotMatch(segment,/saveStockConfig\(/);n++;
assert.doesNotMatch(segment,/monitoringStocks\.push|results\.push/);n++;

const c1Start=source.indexOf("function c1ProjectFeature(");
const c1End=source.indexOf("function c1DerivedState(",c1Start);
const c1Projection=source.slice(c1Start,c1End);
assert.match(c1Projection,/"ret20","maDistance20Pct"/);n++;
assert.match(c1Projection,/"lateStage"/);n++;

const route=source.slice(source.indexOf('if (url.pathname === "/api/research/c3-capture-quotes")'),
  source.indexOf('if (url.pathname === "/api/research/c3-capture-bars")'));
assert.match(route,/isAuthorized\(request,env\)/);n++;
assert.match(route,/request\.method!=="GET"/);n++;
assert.doesNotMatch(route,/processSignalState|sendPush/);n++;

console.log(JSON.stringify({ok:true,assertions:n,version:"8.15.3-c3-quote-context",
  maxShadowSymbols:3,callsPerSlot:6,callsPerSession:102,maxTotalCallsPerMinute:50,
  rawDepthOnly:true,depthScoreDerived:false,formalTargetMutation:false,
  formalSignalPath:false,pushPath:false,orderPath:false,system2Touched:false}));
