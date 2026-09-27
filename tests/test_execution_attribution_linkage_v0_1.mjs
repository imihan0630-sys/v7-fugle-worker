import assert from "node:assert/strict";
import {classifyExecutionAttribution} from "../research/execution_attribution_linkage_v0_1.mjs";

const fill={
 eventKind:"FILL",action:"BUY",symbol:"3006",planScanDate:"2026-09-21",
 signalEventId:"2026-09-22:3006:NONE:BUY:episode-1",
 effectiveAt:"2026-09-22T03:32:00Z"
};
const sig={
 eventId:"2026-09-22:3006:NONE:BUY:episode-1",signalType:"BUY",symbol:"3006",
 planScanDate:"2026-09-21",occurredAt:"2026-09-22T03:31:33.149Z"
};
let x=classifyExecutionAttribution(fill,sig);
assert.equal(x.status,"ATTRIBUTION_ELIGIBLE");
assert.equal(x.attributionEligible,true);

x=classifyExecutionAttribution({...fill,signalEventId:null},{});
assert.equal(x.status,"UNATTRIBUTED_EXECUTION");
assert.equal(x.ledgerUsable,true);
assert.equal(x.attributionEligible,false);

assert.equal(classifyExecutionAttribution({...fill,symbol:"2330"},sig).status,"ATTRIBUTION_REJECTED");
assert.equal(classifyExecutionAttribution({...fill,planScanDate:"2026-09-20"},sig).status,"ATTRIBUTION_REJECTED");
assert.equal(classifyExecutionAttribution({...fill,effectiveAt:"2026-09-22T03:30:00Z"},sig).status,"ATTRIBUTION_REJECTED");
assert.equal(classifyExecutionAttribution({...fill,action:"SELL"},sig).status,"ATTRIBUTION_REJECTED");

const stopFill={...fill,action:"SELL",signalEventId:"s2",effectiveAt:"2026-09-22T04:00:00Z"};
const stopSig={eventId:"s2",signalType:"STOP_LOSS",symbol:"3006",planScanDate:"2026-09-21",occurredAt:"2026-09-22T03:59:00Z"};
assert.equal(classifyExecutionAttribution(stopFill,stopSig).status,"ATTRIBUTION_ELIGIBLE");

console.log(JSON.stringify({ok:true,cases:7,rule:"ledger-valid execution without signalEventId remains usable for holdings but is excluded from Formal signal/sizing attribution"},null,2));
