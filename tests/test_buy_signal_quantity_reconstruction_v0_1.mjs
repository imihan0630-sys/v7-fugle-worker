import assert from "node:assert/strict";
import fs from "node:fs";
import {reconstructBuySuggestedShares} from "../research/buy_signal_quantity_reconstruction_v0_1.mjs";

let x=reconstructBuySuggestedShares({
 sourceType:"V8_TRADE_JOURNAL_SIGNAL",eventId:"e1",signalType:"BUY",symbol:"3105",
 occurredAt:"2026-09-29T02:31:01Z",signalAmount:33600,marketPrice:2000
});
assert.equal(x.status,"RECONSTRUCTED_SIGNAL_SUGGESTED_SHARES");
assert.equal(x.suggestedShares,16);
assert.equal(x.orderable,true);

x=reconstructBuySuggestedShares({
 sourceType:"V8_TRADE_JOURNAL_SIGNAL",eventId:"e2",signalType:"BUY",symbol:"H",
 occurredAt:"2026-09-29T02:31:01Z",signalAmount:6000,marketPrice:7000
});
assert.equal(x.suggestedShares,0);
assert.equal(x.orderable,false);

assert.equal(reconstructBuySuggestedShares({sourceType:"V8_TRADE_JOURNAL_SIGNAL",signalType:"BUY"}).reconstructable,false);
assert.equal(reconstructBuySuggestedShares({sourceType:"V8_TRADE_JOURNAL_SIGNAL",signalType:"SELL",eventId:"x",symbol:"A",occurredAt:"2026-09-29T02:31:01Z",signalAmount:1000,marketPrice:10}).status,"NOT_INITIAL_BUY");

const base=fs.readFileSync("Worker.js","utf8");
assert.ok(base.includes('suggestedShares: ["BUY", "ADD"].includes(signal.type) && positiveNumber(result.currentPrice) && toNumber(signal.amount) !== null'));
assert.ok(base.includes('? sharesFor(signal.amount, result.currentPrice) : signal.shares'));

const patch=fs.readFileSync("scripts/apply_v8_5_0.py","utf8");
for(const token of [
 "marketPrice:journalNumber(result?.currentPrice)",
 "amount:journalNumber(signal?.amount)",
 "signal_amount",
 "market_price",
 "record signal occurrence before push"
]) assert.ok(patch.includes(token),"signal quantity provenance changed: "+token);

console.log(JSON.stringify({ok:true,contract:"positive BUY signal market_price + signal_amount exactly reconstruct live push suggestedShares; broker execution remains unproven"},null,2));
