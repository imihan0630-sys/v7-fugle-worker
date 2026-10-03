import assert from "node:assert/strict";
import {adaptC3QuoteRows} from "../research/system1_c3_quote_adapter_v0_1.mjs";

let n=0;const eq=(a,b)=>{assert.deepEqual(a,b);n++};const ok=x=>{assert.ok(x);n++};
const generationId="gen-q",targetTradeDate="2026-10-05",barStart="2026-10-05T01:00:00.000Z";
const base={schemaVersion:"SYSTEM1_C3_QUOTE_CONTEXT_V0_1",symbol:"2330",executionMarketState:"CONTINUOUS",
  bestBid:99.9,bestAsk:100.1,spreadPct:.2,bidDepth5:150,askDepth5:75,depthImbalance:.333333,
  isLimitUpPrice:false,isLimitDownPrice:false,isLimitUpHalt:false,isLimitDownHalt:false,unknownReasons:[]};
const row=(symbol,q,start=barStart)=>({generation_id:generationId,target_trade_date:targetTradeDate,symbol,bar_start:start,
  quote_json:JSON.stringify({...q,symbol}),source_fetched_at:"2026-10-05T01:16:02.000Z",source_family:"FUGLE_INTRADAY_QUOTE"});

const a=adaptC3QuoteRows([row("2330",base)],{generationId,targetTradeDate});
eq(a.schemaVersion,"SYSTEM1_C3_QUOTE_ADAPTER_V0_1");
eq(a.rowN,1);eq(a.verifiedN,1);eq(a.blockedN,0);
eq(a.rows[0].verified,true);eq(a.rows[0].limitUp,false);eq(a.rows[0].marketState,"CONTINUOUS");
eq(a.rows[0].quoteContext.bidDepth5,150);eq(a.rows[0].quoteContext.askDepth5,75);
eq(a.rows[0].intradayDepthScore,null);eq(a.rows[0].intradayDepthScoreInvented,false);
eq(a.rawDepthPreserved,true);eq(a.missingLimitStateNeverFalse,true);

const missingLimit=adaptC3QuoteRows([row("2330",{...base,isLimitUpPrice:null})],{generationId,targetTradeDate});
eq(missingLimit.verifiedN,0);
eq(missingLimit.rows[0].limitUp,null);
ok(missingLimit.rows[0].blockers.includes("LIMIT_PRICE_STATE_NOT_VERIFIED"));

const trial=adaptC3QuoteRows([row("2330",{...base,executionMarketState:"TRIAL"})],{generationId,targetTradeDate});
eq(trial.verifiedN,0);
ok(trial.rows[0].blockers.includes("MARKET_STATE_NOT_CONTINUOUS"));

assert.throws(()=>adaptC3QuoteRows([row("2330",base),row("2330",base)],{generationId,targetTradeDate}),/DUPLICATE/);n++;
assert.throws(()=>adaptC3QuoteRows([{...row("2330",base),source_family:"OTHER"}],{generationId,targetTradeDate}),/SOURCE_FAMILY/);n++;
assert.throws(()=>adaptC3QuoteRows([row("2330",{...base,schemaVersion:"BAD"})],{generationId,targetTradeDate}),/SCHEMA_INVALID/);n++;

console.log(JSON.stringify({ok:true,assertions:n,quoteAdapter:true,rawDepthPreserved:true,
  missingLimitStateNeverFalse:true,intradayDepthScoreInvented:false,continuousMarketRequired:true,
  formalCoreImpact:false,system2Touched:false}));
