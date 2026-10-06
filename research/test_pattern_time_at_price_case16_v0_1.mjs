import assert from "node:assert/strict";
import {classifyInventoryReceipt} from "./pattern_time_at_price_inventory_v0_1.mjs";
const r=classifyInventoryReceipt({holdingQuantityObserved:true,acquisitionCostObserved:false,transactionLedgerComplete:false,asOfKnown:true,replaySafe:true});
assert.equal(r.status,"INVENTORY_ONLY_COST_UNKNOWN");
assert.equal(r.costBasisIdentified,false);
console.log("PASS TP16");
