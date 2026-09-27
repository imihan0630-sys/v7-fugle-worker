import assert from "node:assert/strict";
import {counterfactualInitialBuyOrderability} from "../research/counterfactual_initial_buy_orderability_v0_1.mjs";

let x=counterfactualInitialBuyOrderability(
 [{symbol:"3105",allocation:56000}],
 [{symbol:"3105",triggerPrice:2000}]
);
assert.equal(x.status,"ORDERABLE");
assert.equal(x.rows[0].counterfactualFirstAmountNTD,33600);
assert.equal(x.rows[0].counterfactualSuggestedShares,16);

x=counterfactualInitialBuyOrderability(
 [{symbol:"HIGH",allocation:10000}],
 [{symbol:"HIGH",triggerPrice:7000}]
);
assert.equal(x.status,"COUNTERFACTUAL_ZERO_SHARES");
assert.deepEqual(x.zeroShareSymbols,["HIGH"]);

assert.equal(counterfactualInitialBuyOrderability([{symbol:"A",allocation:50000}],[{symbol:"A"}]).status,"UNKNOWN");
assert.equal(counterfactualInitialBuyOrderability([],[{symbol:"A",triggerPrice:100}]).status,"UNKNOWN");
assert.equal(counterfactualInitialBuyOrderability([{symbol:"A",allocation:50000}],[]).status,"NO_BUY_TRIGGERS");
assert.equal(counterfactualInitialBuyOrderability([{symbol:"A",allocation:50000}],[{symbol:"A",triggerPrice:100}],{firstTrancheRatio:null}).status,"UNKNOWN");

console.log(JSON.stringify({ok:true,cases:6,contract:"shared BUY trigger may be reused; counterfactual amount/shares must be recomputed at observed trigger price; zero-share comparator fails execution feasibility"},null,2));
