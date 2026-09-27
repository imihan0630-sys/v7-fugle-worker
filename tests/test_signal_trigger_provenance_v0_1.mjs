import fs from "node:fs";
import assert from "node:assert/strict";
import {classifySignalTriggerEvidence} from "../research/signal_trigger_provenance_classifier_v0_1.mjs";

let x=classifySignalTriggerEvidence({
 sourceType:"APPEND_ONLY_SIGNAL_LEDGER",appendOnly:true,historicalStable:true,
 signalId:"2026-09-29:3105:NONE:BUY:episode-1",signalType:"BUY",tradeDate:"2026-09-29",symbol:"3105",
 currentPrice:1000,suggestedAmount:30000,suggestedShares:30,emittedAt:"2026-09-29T02:31:01Z"
});
assert.equal(x.status,"EXACT_BUY_TRIGGER_PAYLOAD");
assert.equal(x.promotionGradeForTriggerPrice,true);

x=classifySignalTriggerEvidence({sourceType:"V7_SIGNAL_DELIVERY_STATE",signalId:"x",lastEntrySignalBarTime:"2026-09-29T02:30:00Z"});
assert.equal(x.status,"EPISODE_STATE_ONLY");
assert.equal(x.promotionGradeForTriggerPrice,false);

assert.equal(classifySignalTriggerEvidence({sourceType:"V7_LIVE_STATE"}).status,"EPHEMERAL_CURRENT_SNAPSHOT");
assert.equal(classifySignalTriggerEvidence({sourceType:"LAST_MONITOR_KV"}).status,"EPHEMERAL_CURRENT_SNAPSHOT");
assert.equal(classifySignalTriggerEvidence({sourceType:"BAR_RECONSTRUCTION",entryBarTime:"2026-09-29T02:30:00Z"}).status,"APPROXIMATE_BAR_CONTEXT_ONLY");

const s=fs.readFileSync("Worker.js","utf8");
assert.ok(s.includes("CREATE TABLE IF NOT EXISTS v7_signal_delivery_state"),"signal delivery state table missing");
assert.ok(s.includes("state_key TEXT PRIMARY KEY,snapshot_json TEXT"),"signal state remains mutable snapshot keyed by state_key");
assert.ok(s.includes("CREATE TABLE IF NOT EXISTS v7_live_state"),"live state missing");
assert.ok(s.includes("id INTEGER PRIMARY KEY"),"live state PK missing");
assert.ok(s.includes("INSERT INTO v7_live_state (id, snapshot, updated_at)"),"live state writer missing");
assert.ok(s.includes("VALUES (1, ?1, ?2)"),"live state must still overwrite singleton id=1");
assert.ok(s.includes("detail: result?.status || null"),"cron detail semantics changed; re-audit required");
assert.ok(s.includes("pendingDeliveries[firedKey]={signalId:payload.signalId,episode,status:\"RESERVED\",reservedAt:new Date().toISOString()}"),"reservation shape changed; re-audit required");
assert.ok(s.includes("if(outcome.sent) delete pendingDeliveries[firedKey]"),"success cleanup semantics changed; re-audit required");
assert.ok(s.includes("SIGNAL_STATE_TTL_SECONDS = 7 * 24 * 60 * 60"),"signal KV retention changed; re-audit required");
assert.ok(s.includes("{ expirationTtl: 2 * 24 * 60 * 60 }"),"LAST_MONITOR retention changed; re-audit required");

console.log(JSON.stringify({ok:true,contract:"current signal state is operational/dedupe evidence, not append-only exact trigger-price history"},null,2));
