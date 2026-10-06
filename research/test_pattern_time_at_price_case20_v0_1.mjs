import assert from "node:assert/strict";
import {buildInformationLineage} from "./pattern_time_at_price_inventory_v0_1.mjs";
const r=buildInformationLineage({occupancyKind:"QUOTE_MID_DWELL_TIME",hasVolume:true,hasInventory:true});
assert.ok(r.informationRoots.includes("QUOTE_TIME"));
assert.ok(r.informationRoots.includes("PARTICIPANT_POSITION"));
assert.equal(r.independentVoteAllowed,false);
console.log("PASS TP20");
