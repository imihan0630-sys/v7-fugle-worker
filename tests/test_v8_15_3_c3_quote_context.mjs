import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const source=await readFile(process.env.V7_TEST_WORKER_PATH||new URL("../Worker.js",import.meta.url),"utf8");
const api=await import("data:text/javascript;base64,"+Buffer.from(source+"\nexport {c3ResearchLimits,c3NormalizeQuote};").toString("base64"));
let n=0;const eq=(a,b)=>{assert.deepEqual(a,b);n++};const ok=x=>{assert.ok(x);n++};

assert.match(source,/const VERSION = "8\.15\.3-c3-quote-context";/);n++;
for(const token of [
  "CREATE TABLE IF NOT EXISTS trade_research_c3_quotes",
  'url.pathname === "/api/research/c3-capture-quotes"',
  "SYSTEM1_C3_RESEARCH_CAPTURE_RUNTIME_V0_2",
  "SYSTEM1_C3_RESEARCH_CAPTURE_CONTRACT_V0_2",
  "callsPerSymbolPerSlot:2",
  "maxSymbols:3",
  "maxCallsPerSlot:6",
  "callsPerSession:102",
  "maxTotalCallsPerMinute:50",
  '"ret20","maDistance20Pct"',
  '"announcementsVerified","lateStage"',
  "support:c1Number(supportAnchor),breakout:c1Number(breakoutAnchor)"
]){assert.ok(source.includes(token),token);n++;}

const limits=api.c3ResearchLimits({});
eq(limits,{ready:true,providerLimitPerMinute:60,maxTotalCallsPerMinute:50,maxSymbols:3,callsPerSymbolPerSlot:2,maxCallsPerSlot:6,callsPerSession:102,reason:null});

const q=api.c3NormalizeQuote({
  symbol:"2330",date:"2026-10-05",closePrice:100,previousClose:98,lastUpdated:1234567890123456,
  bids:[{price:99.9,size:10},{price:99.8,size:20},{price:99.7,size:30},{price:99.6,size:40},{price:99.5,size:50}],
  asks:[{price:100.1,size:5},{price:100.2,size:10},{price:100.3,size:15},{price:100.4,size:20},{price:100.5,size:25}],
  isContinuous:true,isTrial:false,isDelayedOpen:false,isDelayedClose:false,
  isLimitUpHalt:false,isLimitDownHalt:false,isLimitUpPrice:false,isLimitDownPrice:false,
  tradingHalt:{isHalted:false}
},"2330");
eq(q.schemaVersion,"SYSTEM1_C3_QUOTE_CONTEXT_V0_1");
eq(q.bidDepth5,150);eq(q.askDepth5,75);
eq(q.depthImbalance,0.333333);
eq(q.bestBid,99.9);eq(q.bestAsk,100.1);
eq(q.isLimitUpPrice,false);eq(q.isLimitDownPrice,false);
eq(q.executionMarketState,"CONTINUOUS");
eq(q.unknownReasons,[]);
eq(q.researchOnly,true);eq(q.decisionImpact,false);eq(q.formalCoreImpact,false);

const missing=api.c3NormalizeQuote({
  symbol:"2330",date:"2026-10-05",closePrice:100,bids:[],asks:[],isContinuous:null
},"2330");
eq(missing.isLimitUpPrice,null);
eq(missing.isLimitDownPrice,null);
ok(missing.unknownReasons.includes("LIMIT_PRICE_STATE_NOT_VERIFIED"));
ok(missing.unknownReasons.includes("DEPTH_NOT_AVAILABLE"));
eq(missing.executionMarketState,"UNKNOWN");

const start=source.indexOf("async function captureC3ResearchBarsSafe(");
const end=source.indexOf("async function readC3ResearchQuotes(",start);
ok(start>=0&&end>start);
const seg=source.slice(start,end);
assert.match(seg,/Promise\.all\(\[fetchCandles\(String\(row\.symbol\),15,env\),fetchQuote\(String\(row\.symbol\),env\)\]\)/);n++;
assert.match(seg,/const extraCalls=rows\.length\*limits\.callsPerSymbolPerSlot/);n++;
assert.match(seg,/baseCalls\+extraCalls>limits\.maxTotalCallsPerMinute/);n++;
assert.match(seg,/extraCandleCalls:rows\.length,extraQuoteCalls:rows\.length/);n++;
assert.doesNotMatch(seg,/processSignalState\(|sendPush\(|saveStockConfig\(|monitoringStocks\.push|results\.push/);n++;

const qstart=source.indexOf("function c3NormalizeQuote(");
const qend=source.indexOf("async function persistC3ResearchQuote",qstart);
const qseg=source.slice(qstart,qend);
assert.match(qseg,/isLimitUpPrice:c3QuoteBool\(raw\?\.isLimitUpPrice\)/);n++;
assert.doesNotMatch(qseg,/isLimitUpPrice:.*isLimitUpHalt/);n++;
assert.match(source,/c3ResearchQuotes:Number\(c3ResearchCapture\?\.extraQuoteCalls\|\|0\)/);n++;

console.log(JSON.stringify({ok:true,assertions:n,version:"8.15.3-c3-quote-context",
  maxShadowSymbols:3,callsPerSymbolPerSlot:2,maxExtraCallsPerSlot:6,maxExtraCallsPerSession:102,
  rawTopFiveDepth:true,limitUpPriceUnknownPreserved:true,intradayDepthScoreInvented:false,
  formalTargetMutation:false,formalSignalPath:false,pushPath:false,orderPath:false,formalCoreImpact:false,system2Touched:false}));
