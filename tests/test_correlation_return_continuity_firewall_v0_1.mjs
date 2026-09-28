import assert from "node:assert/strict";
import fs from "node:fs";
import {classifyCorrelationPanelEligibility} from "../research/correlation_return_continuity_firewall_v0_1.mjs";

let x=classifyCorrelationPanelEligibility([{priceSpace:"RAW",continuityState:"UNVERIFIED",pitReplayEligible:true}],{
 synchronizedDates:true,historicalUniverseProven:true,frozenReturnDefinition:true,minCommonObservations:60
});
assert.equal(x.status,"NOT_READY");
assert.ok(x.reasons.includes("RAW_CONTINUITY_NOT_PROVEN"));

x=classifyCorrelationPanelEligibility([{priceSpace:"RAW",continuityState:"CLEAR_NO_ACTION",pitReplayEligible:true}],{
 synchronizedDates:true,historicalUniverseProven:true,frozenReturnDefinition:true,minCommonObservations:60
});
assert.equal(x.status,"CORRELATION_RESEARCH_ELIGIBLE");

x=classifyCorrelationPanelEligibility([{priceSpace:"ADJUSTED",continuityState:"ADJUSTED_CONTINUITY",pitReplayEligible:true}],{
 synchronizedDates:true,historicalUniverseProven:true,frozenReturnDefinition:true,minCommonObservations:60
});
assert.equal(x.status,"CORRELATION_RESEARCH_ELIGIBLE");

const adapter=fs.readFileSync("system2/runtime/official_full_market_daily_history_adapter_v0_1.mjs","utf8");
assert.ok(adapter.includes('priceSpace: "RAW"'));
assert.ok(adapter.includes('continuityState: "UNVERIFIED"'));

const store=fs.readFileSync("system2/runtime/historical_store_v0_1.mjs","utf8");
assert.ok(store.includes('"RAW", "ADJUSTED"'));
assert.ok(store.includes('"ADJUSTED_CONTINUITY"'));
assert.ok(store.includes('"UNVERIFIED"'));

console.log(JSON.stringify({ok:true,currentOfficialAdapter:"RAW_UNVERIFIED_NOT_CORRELATION_READY",schemaCapability:"RAW_OR_ADJUSTED_WITH_CONTINUITY_STATE"},null,2));
