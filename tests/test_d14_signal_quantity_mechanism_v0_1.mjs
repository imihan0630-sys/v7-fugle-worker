import assert from "node:assert/strict";
import {classifySignalQuantityMechanism} from "../research/d14_signal_quantity_mechanism_v0_1.mjs";

let x=classifySignalQuantityMechanism({amount:42000,price:282.5,suggestedShares:148});
assert.equal(x.status,"READY");
assert.equal(x.quantityClass,"ODD_LOT_QUANTITY_IF_SUBMITTED_UNCHANGED");
assert.equal(x.quantizationResidualCashNTD,190);
assert.equal(x.utilizationPct,99.547619);
assert.equal(x.defaultRegularLotQuoteMechanismCompatible,false);

x=classifySignalQuantityMechanism({amount:42000,price:4935,suggestedShares:8});
assert.equal(x.status,"READY");
assert.equal(x.quantityClass,"ODD_LOT_QUANTITY_IF_SUBMITTED_UNCHANGED");
assert.equal(x.suggestedShareNotionalNTD,39480);
assert.equal(x.quantizationResidualCashNTD,2520);
assert.equal(x.quantizationResidualPctOfAmount,6);
assert.equal(x.utilizationPct,94);
assert.ok(x.quantizationResidualCashNTD<x.theoreticalResidualUpperBoundExclusiveNTD);

x=classifySignalQuantityMechanism({amount:120000,price:100,suggestedShares:1200});
assert.equal(x.quantityClass,"MIXED_LOT_QUANTITY_IF_SUBMITTED_UNCHANGED");

x=classifySignalQuantityMechanism({amount:100000,price:100,suggestedShares:1000});
assert.equal(x.quantityClass,"REGULAR_LOT_QUANTITY_IF_SUBMITTED_UNCHANGED");

assert.equal(classifySignalQuantityMechanism({amount:1000,price:2000,suggestedShares:0}).status,"NONORDERABLE");
assert.equal(classifySignalQuantityMechanism({amount:42000,price:4935,suggestedShares:9}).status,"SHARE_RECONSTRUCTION_MISMATCH");

console.log(JSON.stringify({ok:true,rule:"signal-side quantization reserve is not slippage/cost; sub-1000 suggested quantity requires odd-lot-compatible benchmark only if the suggestion is actually submitted unchanged"},null,2));
