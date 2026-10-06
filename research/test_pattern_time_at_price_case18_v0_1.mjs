import assert from "node:assert/strict";
import {classifyInventoryReceipt} from "./pattern_time_at_price_inventory_v0_1.mjs";
const r=classifyInventoryReceipt({holdingQuantityObserved:true,transactionLedgerComplete:true,asOfKnown:true,replaySafe:true});
assert.equal(r.status,"COST_RECONSTRUCTION_CANDIDATE");
assert.equal(r.costBasisIdentified,false);
console.log("PASS TP18");
