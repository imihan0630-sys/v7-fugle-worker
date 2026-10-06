import assert from "node:assert/strict";
import {classifyInventoryReceipt} from "./pattern_time_at_price_inventory_v0_1.mjs";
const r=classifyInventoryReceipt({holdingQuantityObserved:true,acquisitionCostObserved:true,asOfKnown:true,replaySafe:true});
assert.equal(r.status,"INVENTORY_AND_COST_OBSERVED");
assert.equal(r.costBasisIdentified,true);
console.log("PASS TP17");
