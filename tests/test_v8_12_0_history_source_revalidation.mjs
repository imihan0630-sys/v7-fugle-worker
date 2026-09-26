import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const exportTail="\nexport {historyStructuralShape,validateHistorySourceRevalidation,buildHistoryPresenceReceipt,updateMarketState,buildEligibleMarketFeature,buildMarketFeatures,strategySetupState,officialClosingUrl,isTradingDate,shiftDateString};\n";
const api=await import("data:text/javascript;base64,"+Buffer.from(source+exportTail).toString("base64")+"#"+Date.now());

assert.match(source,/const VERSION = "8\.12\.0-history-source-revalidation-v2-3";/);
assert.match(source,/const HISTORY_SEED_SCHEMA = "full-market-v4-history-source-revalidation";/);
assert.match(source,/adjusted=false&fields=open,high,low,close,volume,turnover,change/);
assert.match(source,/\.map\(buildEligibleMarketFeature\)/);
assert.match(source,/historySourceRevalidation=historyAdmission\.summary/);
assert.match(source,/RAW_OFFICIAL_BAR_PRESENCE_BEFORE_FORMAL_FILTERS/);

function tradingDatesBefore(target,count){
  const out=[];
  let cursor=api.shiftDateString(target,-1);
  while(out.length<count){
    if(api.isTradingDate(cursor)) out.push(cursor);
    cursor=api.shiftDateString(cursor,-1);
  }
  return out.reverse();
}
function bars(dates,start=50){
  return dates.map((date,i)=>({
    date,open:start+i,high:start+i+1,low:start+i-1,close:start+i+0.5,
    volumeShares:900000+i*1000,tradeValue:(start+i+0.5)*(900000+i*1000)
  }));
}
function kvEnv(receipts={}){
  return {STOCKS_KV:{async get(key,type){ return receipts[key]??null; },async put(){ throw new Error("test must not write"); }}};
}
function receipt(market,date,tradedSymbols=[]){
  return {
    schemaVersion:"HISTORY_PRESENCE_V1",market,marketDate:date,
    sourceUrl:api.officialClosingUrl(market,date),collectedAt:new Date().toISOString(),
    symbolCount:market==="TWSE"?700:500,tradedSymbols,complete:true,
    semantics:"RAW_OFFICIAL_BAR_PRESENCE_BEFORE_FORMAL_FILTERS"
  };
}

const target="2026-09-24";
const healthyDates=tradingDatesBefore(target,60);
assert.equal(healthyDates.at(-1),"2026-09-23");
const healthyShape=api.historyStructuralShape(bars(healthyDates),target);
assert.equal(healthyShape.usable,true);
assert.deepEqual(healthyShape.gapDates,[]);

{
  const result=await api.validateHistorySourceRevalidation({
    history:bars(healthyDates),symbol:"2006",market:"TWSE",marketDate:target,env:kvEnv()
  });
  assert.equal(result.usable,true);
  assert.equal(result.status,"VALID_EXACT_SESSIONS");
}

{
  const extended=tradingDatesBefore(target,61);
  const missingDate=extended[30];
  const providerDates=extended.filter(d=>d!==missingDate);
  assert.equal(providerDates.length,60);
  const key="V7_HISTORY_PRESENCE:TWSE:"+missingDate;
  const result=await api.validateHistorySourceRevalidation({
    history:bars(providerDates),symbol:"2006",market:"TWSE",marketDate:target,
    env:kvEnv({[key]:receipt("TWSE",missingDate,["2006"])})
  });
  assert.equal(result.usable,false);
  assert.equal(result.status,"DATA_INCOMPLETE");
  assert.equal(result.reason,"MISSING_OFFICIAL_TRADED_BAR");
  assert.equal(result.gapDate,missingDate);
}

{
  const extended=tradingDatesBefore(target,61);
  const missingDate=extended[30];
  const providerDates=extended.filter(d=>d!==missingDate);
  const key="V7_HISTORY_PRESENCE:TWSE:"+missingDate;
  const result=await api.validateHistorySourceRevalidation({
    history:bars(providerDates),symbol:"8422",market:"TWSE",marketDate:target,
    env:kvEnv({[key]:receipt("TWSE",missingDate,["2330"])})
  });
  assert.equal(result.usable,true);
  assert.equal(result.status,"VALID_WITH_VERIFIED_NO_TRADE_GAPS");
  assert.deepEqual(result.verifiedNoTradeDates,[missingDate]);
}

{
  const extended=tradingDatesBefore(target,61);
  const missingDate=extended[20];
  const providerDates=extended.filter(d=>d!==missingDate);
  const result=await api.validateHistorySourceRevalidation({
    history:bars(providerDates),symbol:"5314",market:"TPEx",marketDate:target,env:kvEnv()
  });
  assert.equal(result.usable,false);
  assert.equal(result.status,"UNKNOWN");
  assert.equal(result.reason,"OFFICIAL_GAP_PROOF_UNAVAILABLE");
}

{
  const through0911=tradingDatesBefore("2026-09-14",60);
  assert.equal(through0911.at(-1),"2026-09-11");
  const stale=api.historyStructuralShape(bars(through0911),target);
  assert.equal(stale.usable,true);
  assert.ok(stale.gapDates.includes("2026-09-23"));
  const result=await api.validateHistorySourceRevalidation({
    history:bars(through0911),symbol:"2006",market:"TWSE",marketDate:target,env:kvEnv()
  });
  assert.equal(result.usable,false);
  assert.equal(result.reason,"OFFICIAL_GAP_PROOF_UNAVAILABLE");
}

{
  const raw=[];
  for(let i=0;i<600;i++){
    const symbol=String(1000+i);
    raw.push({Date:"2021-02-22","證券代號":symbol,"收盤價":"20","成交股數":"1000","成交金額":"20000","成交筆數":"1"});
  }
  raw[0]={Date:"2021-02-22","證券代號":"2007","收盤價":"8.80","成交股數":"1234000","成交金額":"10859200","成交筆數":"777"};
  const r=api.buildHistoryPresenceReceipt(raw,"TWSE","2021-02-22",api.officialClosingUrl("TWSE","2021-02-22"));
  assert.equal(r.complete,true);
  assert.equal(r.symbolCount,600);
  assert.equal(r.tradedSymbols.includes("2007"),true);
}

{
  const row={symbol:"2006",name:"東和鋼鐵",market:"TWSE",industry:"鋼鐵",open:88,high:91,low:87,close:90,
    volumeShares:3200000,tradeValue:288000000,changePercent:2.2,marketCapYi:300,
    foreignNet:1000,trustNet:0,dealerNet:0,institutionTotalNet:1000};
  const enrichment={history:{2006:bars(healthyDates)}};
  const admission={bySymbol:{2006:{usable:true,status:"VALID_EXACT_SESSIONS"}},summary:{usableSymbols:1,unusableSymbols:0}};
  const state=api.updateMarketState({stocks:{}},[row],enrichment,target,admission);
  const eligible=api.buildEligibleMarketFeature(state.stocks["2006"]);
  const direct=api.buildMarketFeatures({...row,history:[...bars(healthyDates),{
    date:target,open:row.open,high:row.high,low:row.low,close:row.close,
    volumeShares:row.volumeShares,tradeValue:row.tradeValue,foreignNet:row.foreignNet,
    trustNet:row.trustNet,dealerNet:row.dealerNet,institutionTotalNet:row.institutionTotalNet
  }]});
  for(const key of ["close","ret20","ret60","priorHigh20","priorLow20","atrPercent","volumeTodayVsPrev5","volumeContraction5to20"]){
    assert.equal(eligible[key],direct[key],key);
  }
  assert.deepEqual(api.strategySetupState(eligible),api.strategySetupState(direct));

  const blocked=api.updateMarketState({stocks:{}},[row],enrichment,target,{
    bySymbol:{2006:{usable:false,status:"UNKNOWN",reason:"OFFICIAL_GAP_PROOF_UNAVAILABLE"}},
    summary:{usableSymbols:0,unusableSymbols:1}
  });
  assert.equal(api.buildEligibleMarketFeature(blocked.stocks["2006"]),null);
}

const setupSource=source.slice(source.indexOf("function strategySetupState"),source.indexOf("function nearestRealResistance"));
assert.match(setupSource,/volumeA = .*<= 1\.05.*<= 0\.95/);
assert.match(setupSource,/volumeB = .*>= 1\.3/);
assert.match(setupSource,/pullbackPct >= 2 && pullbackPct <= 15/);
assert.match(setupSource,/f\.close >= f\.priorHigh20 \* 1\.002/);

console.log(JSON.stringify({
  ok:true,
  version:"8.12.0-history-source-revalidation-v2-3",
  class:"B",
  exactHealthyFastPath:true,
  missingOfficialTradedBarBlocked:true,
  verifiedNoTradeGapAllowed:true,
  lowPricePresencePreserved:true,
  cleanFormalOutputInvariant:true,
  formalStrategyChanged:false
}));
