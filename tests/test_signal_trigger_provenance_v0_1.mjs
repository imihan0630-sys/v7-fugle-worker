import fs from "node:fs";
import assert from "node:assert/strict";
import {classifySignalTriggerEvidence} from "../research/signal_trigger_provenance_classifier_v0_1.mjs";

let x=classifySignalTriggerEvidence({
 sourceType:"V8_TRADE_JOURNAL_SIGNAL",
 eventId:"2026-09-29:3105:NONE:BUY:episode-1",signalType:"BUY",tradeDate:"2026-09-29",symbol:"3105",
 marketPrice:1000,occurredAt:"2026-09-29T02:31:01Z"
});
assert.equal(x.status,"EXACT_POSITIVE_FORMAL_BUY_SIGNAL");
assert.equal(x.exactPositiveTriggerPrice,true);
assert.equal(x.supportsNoBuyAbsence,false);

x=classifySignalTriggerEvidence({sourceType:"V8_TRADE_JOURNAL_SIGNAL",signalType:"BUY",tradeDate:"2026-09-29",symbol:"3105"});
assert.equal(x.status,"INCOMPLETE_FORMAL_SIGNAL_ROW");

x=classifySignalTriggerEvidence({sourceType:"V7_SIGNAL_DELIVERY_STATE",signalId:"x",lastEntrySignalBarTime:"2026-09-29T02:30:00Z"});
assert.equal(x.status,"EPISODE_STATE_ONLY");
assert.equal(x.exactPositiveTriggerPrice,false);

assert.equal(classifySignalTriggerEvidence({sourceType:"V7_LIVE_STATE"}).status,"EPHEMERAL_CURRENT_SNAPSHOT");
assert.equal(classifySignalTriggerEvidence({sourceType:"BAR_RECONSTRUCTION"}).status,"APPROXIMATE_BAR_CONTEXT_ONLY");

const base=fs.readFileSync("Worker.js","utf8");
assert.ok(base.includes("CREATE TABLE IF NOT EXISTS v7_signal_delivery_state"),"base signal delivery state missing");
assert.ok(base.includes("if(outcome.sent) delete pendingDeliveries[firedKey]"),"delivery-state success cleanup changed; re-audit required");

const patch=fs.readFileSync("scripts/apply_v8_5_0.py","utf8");
for(const token of [
 "CREATE TABLE IF NOT EXISTS v8_trade_journal_signals",
 "event_id TEXT PRIMARY KEY",
 "market_price REAL",
 "signal_amount REAL",
 "signal_shares INTEGER",
 "async function recordTradeJournalSignal",
 "marketPrice:journalNumber(result?.currentPrice)",
 "shares:journalInteger(signal?.shares)",
 "INSERT OR IGNORE INTO v8_trade_journal_signals",
 "const journalEvent=await recordTradeJournalSignal(result,signal,payload.signalId,episode,tradeDate,env)",
 "if(journalEvent?.stored!==true && !isTestMode(env)) console.warn",
 "FROM v8_trade_journal_signals WHERE trade_date>=?1 ORDER BY occurred_at ASC LIMIT 6000"
]) assert.ok(patch.includes(token),"V8 signal-journal contract changed: "+token);

const baseSignalIdPos=base.indexOf('payload.signalId += `:episode-${episode}`;');
const baseSendPos=base.indexOf("const outcome = await sendPush(payload, env)",baseSignalIdPos);
assert.ok(baseSignalIdPos>=0&&baseSendPos>baseSignalIdPos,"base signalId anchor must precede push");
const patchAnchor="'''    payload.signalId += `:episode-${episode}`;'''";
const patchWriter="'''    payload.signalId += `:episode-${episode}`;\n    const journalEvent=await recordTradeJournalSignal";
assert.ok(patch.includes(patchAnchor),"V8.5 replacement anchor changed; re-audit writer ordering");
assert.ok(patch.includes(patchWriter),"V8.5 writer must be inserted immediately after signalId anchor");
assert.ok(patch.includes('"record signal occurrence before push"'),"V8.5 replacement label changed; re-audit ordering");


const execPatch=fs.readFileSync("scripts/apply_v8_8_0.py","utf8");
for(const token of [
 "CREATE TABLE IF NOT EXISTS trade_research_execution_snapshots",
 'events.push("OPEN_BASELINE")',
 'events.push("FIRST_10M_COMPLETE")',
 'events.push("FIRST_15M_COMPLETE")',
 'events.push("FIRST_30M_COMPLETE")',
 'events.push("FORMAL_SIGNAL_OBSERVED")',
 "if(!result?.ok || !result?.symbol) continue",
 "RESEARCH_EXECUTION_RECORDER_FAIL_OPEN",
 "ORDER BY trade_date DESC,observed_at DESC LIMIT 500",
 "recent:rows.slice(0,80)"
]) assert.ok(execPatch.includes(token),"V8.8 execution-recorder contract changed: "+token);
assert.equal(execPatch.includes("NO_BUY_EOD"),false,"explicit terminal NO_BUY event now exists; PR-047 must be re-audited");

console.log(JSON.stringify({
 ok:true,
 correction:"positive V8 trade-journal BUY row is exact formal signal-price evidence; absence remains UNKNOWN without completeness",
 caveats:["signal_shares != live recomputed suggestedShares","row != push acceptance","row != fill"]
},null,2));
