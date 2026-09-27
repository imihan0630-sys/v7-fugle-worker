import assert from "node:assert/strict";
import {linkedFillFriction} from "../research/linked_fill_friction_v0_1.mjs";

let x=linkedFillFriction(
 {action:"BUY",fillPrice:101,filledShares:100,effectiveAt:"2026-09-29T02:31:10Z",confirmedAt:"2026-09-29T02:31:20Z"},
 {signalType:"BUY",marketPrice:100,occurredAt:"2026-09-29T02:31:00Z"}
);
assert.equal(x.status,"READY");
assert.equal(x.signalToFillLatencyMs,10000);
assert.equal(x.confirmationLagMs,10000);
assert.equal(x.adverseSlippageBps,100);
assert.equal(x.fillProbabilityKnown,false);
assert.equal(x.partialFillKnown,false);

x=linkedFillFriction(
 {action:"SELL",fillPrice:99,filledShares:100,effectiveAt:"2026-09-29T03:00:10Z",confirmedAt:"2026-09-29T03:00:11Z"},
 {signalType:"STOP_LOSS",marketPrice:100,occurredAt:"2026-09-29T03:00:00Z"}
);
assert.equal(x.adverseSlippageBps,100);

x=linkedFillFriction(
 {action:"BUY",fillPrice:99,filledShares:100,effectiveAt:"2026-09-29T02:31:10Z"},
 {signalType:"BUY",marketPrice:100,occurredAt:"2026-09-29T02:31:00Z"}
);
assert.equal(x.adverseSlippageBps,-100);

assert.equal(linkedFillFriction(
 {action:"BUY",fillPrice:100,effectiveAt:"2026-09-29T02:30:00Z"},
 {signalType:"BUY",marketPrice:100,occurredAt:"2026-09-29T02:31:00Z"}
).status,"UNKNOWN");

console.log(JSON.stringify({ok:true,cases:4,rule:"linked fills identify signal-to-fill latency and side-aware slippage; order fill-rate/partial-fill remain UNKNOWN without order-submission evidence"},null,2));
