import assert from "node:assert/strict";
import {buildInformationLineage} from "./pattern_time_at_price_inventory_v0_1.mjs";
const r=buildInformationLineage({occupancyKind:"BAR_VISIT_OCCUPANCY_PROXY",hasVolume:true,hasInventory:false});
assert.deepEqual(r.informationRoots,["PRICE_OHLC","TRADED_VOLUME"]);
assert.equal(r.effectiveIndependentEvidenceCount,1);
console.log("PASS TP19");
