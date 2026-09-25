import fs from "node:fs";
const source=fs.readFileSync(process.env.V7_TEST_WORKER_PATH||"Worker.js","utf8");
const version=source.match(/const VERSION = "(\d+)\.(\d+)\.(\d+)[^"]*";/)?.slice(1,4).map(Number);
if(!version || version[0]!==8 || version[1]<8 || (version[1]===8 && version[2]<1)) throw new Error("V8.8.1+ execution coverage contract requires a non-regressed runtime");
const must=[
'previousClose: quote?.previousClose ?? null',
'avgPrice: quote?.avgPrice ?? null',
'bids: Array.isArray(quote?.bids)',
'asks: Array.isArray(quote?.asks)',
'schemaVersion:"execution-shadow-v2"',
'sessionVwapProxySemantics:avgPrice ? "FUGLE_INTRADAY_QUOTE_AVG_PRICE" : null',
'marketStateLimit:"Does not identify disposition status or a dedicated VI event; UNKNOWN is retained when quote flags are insufficient."',
'marketStateProvenance:"FUGLE_INTRADAY_QUOTE_FLAGS"',
'depthImbalance:depthTotal>0',
'openingGapPct:previousClose&&openPrice'
];
for(const x of must) if(!source.includes(x)) throw new Error("Missing V8.8.1 contract: "+x);
if(source.includes('executionMarketState:"NORMAL"')) throw new Error("Must not coerce unknown state to NORMAL");
const formalStart=source.indexOf("const pullback = stock.mode");
const formalOffset=source.slice(formalStart).search(/return \{\r?\n      ok: true/);
const formalEnd=formalOffset>=0?formalStart+formalOffset:-1;
const quoteResearch=source.indexOf("Research-only passthrough",formalEnd);
if(!(formalStart>=0&&formalEnd>formalStart&&quoteResearch>formalEnd)) throw new Error("Research quote passthrough must remain downstream of formal decision computation");
console.log("V8.8.1+ execution coverage contract OK");
