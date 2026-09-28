import assert from "node:assert/strict";
import {plannedSelectionHeat,actualPortfolioHeatEligibility} from "../research/portfolio_heat_semantic_firewall_v0_1.mjs";

const h=plannedSelectionHeat([
 {symbol:"2006",totalAllocation:50000,buyLow:98,buyHigh:100,stop:97},
 {symbol:"3105",totalAllocation:64000,buyLow:190,buyHigh:200,stop:180}
],200000);
assert.equal(h.status,"READY");
assert.ok(h.projectedNewPlanHeatPctHigh>0);
assert.equal(h.actualPortfolioHeatKnown,false);

const z=plannedSelectionHeat([],200000,{scanComplete:true});
assert.equal(z.projectedNewPlanHeatPctHigh,0);
assert.equal(z.actualPortfolioHeatKnown,false);
assert.match(z.zeroSelectionRule,/not zero account-wide portfolio heat/);

assert.equal(plannedSelectionHeat([],200000,{scanComplete:false}).status,"UNKNOWN");

let e=actualPortfolioHeatEligibility({
 asOfTimestamp:"2026-09-28T03:00:00Z",
 totalEquityKnown:true,
 appendOnlyFillLedger:true,
 allCarryoverPositionsKnown:true,
 actualSharesKnown:true,
 stopForEveryOpenPositionKnown:true,
 priceReferenceForEveryOpenPositionKnown:true
});
assert.equal(e.status,"ELIGIBLE");

e=actualPortfolioHeatEligibility({
 asOfTimestamp:"2026-09-28T03:00:00Z",
 totalEquityKnown:true,
 appendOnlyFillLedger:false,
 allCarryoverPositionsKnown:true,
 actualSharesKnown:true,
 stopForEveryOpenPositionKnown:true,
 priceReferenceForEveryOpenPositionKnown:true
});
assert.equal(e.status,"NOT_ELIGIBLE");
assert.ok(e.missing.includes("appendOnlyFillLedger"));

console.log(JSON.stringify({ok:true,rule:"zero selected => zero new-plan heat only; actual account heat remains unavailable without PIT holdings/fill completeness"},null,2));
