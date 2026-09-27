import fs from "node:fs";
import assert from "node:assert/strict";
import {classifyExecutionShadowSignalAttribution} from "../research/execution_shadow_signal_attribution_v0_1.mjs";

let x=classifyExecutionShadowSignalAttribution({
 event_type:"FORMAL_SIGNAL_OBSERVED",event_key:"SIGNAL",symbol:"2006"
});
assert.equal(x.status,"GENERIC_CROSS_SYMBOL_CONTEXT_ONLY");
assert.equal(x.positiveSymbolSignal,false);

x=classifyExecutionShadowSignalAttribution({
 event_type:"FORMAL_SIGNAL_OBSERVED",
 event_key:"2026-09-29:3105:NONE:BUY:episode-1",
 symbol:"3105"
});
assert.equal(x.status,"SYMBOL_SPECIFIC_SIGNAL_CONTEXT");
assert.equal(x.positiveSymbolSignal,true);
assert.deepEqual(x.signalTypes,["BUY"]);

x=classifyExecutionShadowSignalAttribution({
 event_type:"FORMAL_SIGNAL_OBSERVED",
 event_key:"2026-09-29:2006:NONE:BUY:episode-1",
 symbol:"3105"
});
assert.equal(x.status,"SYMBOL_SIGNAL_ID_MISMATCH");
assert.equal(x.positiveSymbolSignal,false);

x=classifyExecutionShadowSignalAttribution({
 event_type:"OPEN_BASELINE",event_key:"OPEN_BASELINE",symbol:"3105"
});
assert.equal(x.status,"NOT_FORMAL_SIGNAL_CONTEXT");

x=classifyExecutionShadowSignalAttribution({
 event_type:"FORMAL_SIGNAL_OBSERVED",
 event_key:"2026-09-29:3105:NONE:BUY:episode-1|2026-09-29:3105:NONE:PLAN_INVALIDATED:episode-2",
 symbol:"3105"
});
assert.equal(x.positiveSymbolSignal,true);
assert.deepEqual(new Set(x.signalTypes),new Set(["BUY","PLAN_INVALIDATED"]));

const patch=fs.readFileSync("scripts/apply_v8_8_0.py","utf8");
for(const token of [
 'if(Array.isArray(notifications) && notifications.length) events.push("FORMAL_SIGNAL_OBSERVED")',
 'for(const result of results)',
 'eventType==="FORMAL_SIGNAL_OBSERVED"',
 'notifications.filter(x=>String(x?.symbol||"")===String(result.symbol))',
 '.sort().join("|")||"SIGNAL"'
]) assert.ok(patch.includes(token),"V8.8 signal-attribution source contract changed: "+token);

console.log(JSON.stringify({
 ok:true,
 finding:"FORMAL_SIGNAL_OBSERVED is run-global; generic SIGNAL rows are not positive per-symbol signal evidence",
 positiveRule:"require parseable symbol-matching signalId in event_key",
 formalImpact:false
},null,2));
