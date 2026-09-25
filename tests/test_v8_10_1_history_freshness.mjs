import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const workerPath=process.env.V7_TEST_WORKER_PATH || new URL("../Worker.js",import.meta.url).pathname;
const source=await readFile(workerPath,"utf8");
const api=await import("data:text/javascript;base64,"+Buffer.from(source+`
export {expectedTradingSessionsBefore,validateHistoryFreshness,updateMarketState,buildEligibleMarketFeature,buildMarketFeatures,strategySetupState};
`).toString("base64")+"#"+Date.now());

assert.match(source,/const VERSION = "8\.10\.1-history-freshness-guard";/);
assert.match(source,/const HISTORY_SEED_SCHEMA = "full-market-v3-history-freshness";/);
assert.match(source,/\.map\(buildEligibleMarketFeature\)/);
assert.match(source,/validateHistoryFreshness\(history,marketDate,\{allowTargetDateBar:true\}\)/);

function barsForDates(dates,{start=50,step=0.35}={}) {
  return dates.map((date,index)=>{
    const close=start+index*step;
    return {date,open:close-0.2,high:close+0.8,low:close-0.7,close,
      volumeShares:900000+index*10000,tradeValue:close*(900000+index*10000)};
  });
}

const targetDate="2026-09-24";
const expected60=api.expectedTradingSessionsBefore(targetDate,60);
assert.equal(expected60.status,"READY");
assert.equal(expected60.sessions.length,60);
assert.equal(expected60.sessions.at(-1),"2026-09-23");

const freshPrior=barsForDates(expected60.sessions);
const fresh=api.validateHistoryFreshness(freshPrior,targetDate);
assert.equal(fresh.usable,true);
assert.equal(fresh.latestPriorDate,"2026-09-23");

// Weekend plus the official 9/25 and 9/28 holidays are legitimate gaps, not missing bars.
const afterHoliday="2026-09-29";
const holidaySessions=api.expectedTradingSessionsBefore(afterHoliday,60);
assert.equal(holidaySessions.status,"READY");
assert.equal(holidaySessions.sessions.at(-1),"2026-09-24");
assert.equal(api.validateHistoryFreshness(barsForDates(holidaySessions.sessions),afterHoliday).usable,true);

// B-130 exact date-shape reproduction: cache ended 9/11, then the 9/24 row was appended.
const through0911=api.expectedTradingSessionsBefore("2026-09-14",60);
assert.equal(through0911.sessions.at(-1),"2026-09-11");
const staleB130=[...barsForDates(through0911.sessions),{
  date:targetDate,open:84,high:85,low:82,close:84,volumeShares:2500000,tradeValue:210000000
}];
const staleResult=api.validateHistoryFreshness(staleB130,targetDate,{allowTargetDateBar:true});
assert.equal(staleResult.usable,false);
assert.equal(staleResult.reason,"STALE_LATEST_SESSION");
assert.equal(staleResult.latestPriorDate,"2026-09-11");
assert.equal(staleResult.expectedPriorDate,"2026-09-23");

// A target-date cache row is an expected warmup/fallback artifact. It is ignored and replaced
// by the official scan row; it is never admitted as a prior session.
const freshWithTarget=[...freshPrior,{date:targetDate,open:999,high:1000,low:998,close:999,volumeShares:1,tradeValue:999}];
const freshWithTargetResult=api.validateHistoryFreshness(freshWithTarget,targetDate,{allowTargetDateBar:true});
assert.equal(freshWithTargetResult.usable,true);
assert.equal(freshWithTargetResult.targetDateBarIgnored,true);

const row={symbol:"2006",name:"東和鋼鐵",market:"TWSE",industry:"鋼鐵",open:88,high:91,low:87,close:90,
  volumeShares:3200000,tradeValue:288000000,changePercent:2.2,marketCapYi:300,
  foreignNet:1000,trustNet:0,dealerNet:0,institutionTotalNet:1000};
const freshState=api.updateMarketState({stocks:{}},[row],{history:{2006:freshWithTarget}},targetDate);
assert.equal(freshState.stocks["2006"].historyFreshness.usable,true);
assert.equal(freshState.stocks["2006"].history.at(-1).close,90);
assert.equal(freshState.stocks["2006"].history.filter(x=>x.date===targetDate).length,1);

const staleState=api.updateMarketState({stocks:{}},[row],{history:{2006:staleB130}},targetDate);
assert.equal(staleState.stocks["2006"].historyFreshness.usable,false);
assert.equal(staleState.stocks["2006"].historyFreshness.status,"DATA_INCOMPLETE");
assert.equal(api.buildEligibleMarketFeature(staleState.stocks["2006"]),null);

// Internal missing session remains invalid even if the array still contains 60 prior bars.
const expected61=api.expectedTradingSessionsBefore(targetDate,61).sessions;
const gappedDates=expected61.filter((_,index)=>index!==30);
assert.equal(gappedDates.length,60);
const gap=api.validateHistoryFreshness(barsForDates(gappedDates),targetDate);
assert.equal(gap.usable,false);
assert.equal(gap.reason,"INTERNAL_SESSION_GAP");

const duplicate=[...freshPrior.slice(0,20),freshPrior[19],...freshPrior.slice(20)];
assert.equal(api.validateHistoryFreshness(duplicate,targetDate).reason,"DUPLICATE_BAR_DATE");
const outOfOrder=freshPrior.map(x=>({...x}));
[outOfOrder[10],outOfOrder[11]]=[outOfOrder[11],outOfOrder[10]];
assert.equal(api.validateHistoryFreshness(outOfOrder,targetDate).reason,"OUT_OF_ORDER_BAR_DATE");
const future=[...freshPrior,{...freshPrior.at(-1),date:"2026-09-30"}];
assert.equal(api.validateHistoryFreshness(future,targetDate).reason,"FUTURE_BAR_DATE");

// Historical recovery is evaluated against its explicit target date, never wall-clock today.
assert.equal(api.validateHistoryFreshness(freshPrior,"2026-09-24").usable,true);

// Unknown calendar proof stays UNKNOWN and cannot become a zero-pick/negative signal.
const unknownDates=[];
for(let cursor=new Date("2027-01-01T12:00:00Z");unknownDates.length<60;cursor.setUTCDate(cursor.getUTCDate()+1)) {
  const day=cursor.getUTCDay();if(day!==0&&day!==6) unknownDates.push(cursor.toISOString().slice(0,10));
}
const unknown=api.validateHistoryFreshness(barsForDates(unknownDates),"2027-04-01");
assert.equal(unknown.usable,false);
assert.equal(unknown.status,"UNKNOWN");
assert.equal(unknown.reason,"CALENDAR_UNAVAILABLE");

// The guard changes admission only. For a fresh series, protected feature and A/B formula outputs
// are identical to direct evaluation of the same 60 prior sessions plus the official target row.
const eligible=api.buildEligibleMarketFeature(freshState.stocks["2006"]);
const direct=api.buildMarketFeatures({...row,history:[...freshPrior,{date:targetDate,open:row.open,high:row.high,low:row.low,close:row.close,
  volumeShares:row.volumeShares,tradeValue:row.tradeValue,foreignNet:row.foreignNet,trustNet:row.trustNet,dealerNet:row.dealerNet,
  institutionTotalNet:row.institutionTotalNet}]});
for(const key of ["close","ret5","ret10","ret20","ret60","priorHigh20","priorLow20","atrPercent","volumeTodayVsPrev5","volumeContraction5to20"]) {
  assert.equal(eligible[key],direct[key],key);
}
assert.deepEqual(api.strategySetupState(eligible),api.strategySetupState(direct));

// Frozen Formal thresholds/formulas remain source-identical in this patch.
const setupSource=source.slice(source.indexOf("function strategySetupState"),source.indexOf("function nearestRealResistance"));
assert.match(setupSource,/volumeA = .*<= 1\.05.*<= 0\.95/);
assert.match(setupSource,/volumeB = .*>= 1\.3/);
assert.match(setupSource,/const pullbackOK = pullbackPct !== null && pullbackPct >= 2 && pullbackPct <= 15/);
assert.match(setupSource,/const breakoutB = f\.priorHigh20 > 0 && f\.close >= f\.priorHigh20 \* 1\.002/);

console.log(JSON.stringify({
  ok:true,version:"8.10.1-history-freshness-guard",class:"B",
  b130StaleHistoryRejected:true,calendarFailure:"UNKNOWN",targetDateBarReplaced:true,
  freshFormalFormulaInvariant:true,formalCoreChanged:false
}));
