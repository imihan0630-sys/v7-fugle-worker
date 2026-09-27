import fs from "node:fs";
import assert from "node:assert/strict";

const patch=fs.readFileSync("scripts/apply_v8_5_0.py","utf8");
const start=patch.indexOf("function journalTradeStats");
assert.ok(start>=0,"journalTradeStats missing");
const end=patch.indexOf("\nasync function readTradeJournal",start);
const body=patch.slice(start,end);

for(const token of [
 'events.find(item=>item.signal_type==="BUY"',
 '["SELL","STOP_LOSS"].includes(item.signal_type)',
 'const returnPct=entryPrice>0 ? (exitPrice-entryPrice)/entryPrice*100 : null',
 'const completed=trades.filter(item=>item.status!=="OPEN")',
 'const wins=completed.filter(item=>item.status==="WIN").length',
 'ADD/REDUCE/PROFIT_CHECK完整保留於事件紀錄但不改主勝率口徑'
]) assert.ok(body.includes(token),"signal-path stats semantics changed: "+token);

assert.equal(/fill|broker|commission|fee|slippage/i.test(body),false,"journalTradeStats unexpectedly gained execution/fill semantics; re-audit required");
assert.equal(body.includes("totalAllocation"),false,"main return unexpectedly became allocation-weighted; re-audit required");
assert.equal(body.includes("firstAmount"),false,"main return unexpectedly became amount-weighted; re-audit required");

console.log(JSON.stringify({
 ok:true,
 classification:"SIGNAL_PATH_ROUND_TRIP_RETURN",
 notRealizedPnl:true,
 rightCensoring:"OPEN excluded from winRate and averageReturnPct",
 sizingValidationForbidden:true
},null,2));
