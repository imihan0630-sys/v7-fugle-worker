import fs from "node:fs";
import assert from "node:assert/strict";
import {scoreCapReserve,capBindingScoreShareThreshold} from "../research/score_cap_reserve_v0_1.mjs";

assert.equal(Number(capBindingScoreShareThreshold(2).toFixed(6)),0.583333);
assert.equal(Number(capBindingScoreShareThreshold(3).toFixed(6)),0.411765);
assert.equal(Number(capBindingScoreShareThreshold(6).toFixed(6)),0.411765);

let x=scoreCapReserve([
 {symbol:"A",priorityScore:100},{symbol:"B",priorityScore:50},{symbol:"C",priorityScore:50}
],200000);
assert.equal(x.status,"READY");
assert.deepEqual(x.capBindingSymbols,["A"]);
assert.equal(x.nominalDeployTargetNTD,170000);
assert.equal(x.capInducedReserveNTD,15000);
assert.equal(x.plannedAllocationNTD,154000);
assert.equal(x.thousandFloorReserveNTD,1000);
assert.equal(x.totalNominalToPlannedReserveNTD,16000);

x=scoreCapReserve([
 {symbol:"2006",priorityScore:69.9},{symbol:"3105",priorityScore:89.4},{symbol:"6133",priorityScore:74.9}
],200000);
assert.deepEqual(x.capBindingSymbols,[]);
assert.equal(x.capInducedReserveNTD,0);
assert.equal(x.plannedAllocationNTD,168000);
assert.equal(x.thousandFloorReserveNTD,2000);

const worker=fs.readFileSync("Worker.js","utf8");
assert.ok(worker.includes('const deployRatio = selected.length <= 0 ? 0 : selected.length === 1 ? 0.35 : selected.length === 2 ? 0.60 : 0.85;'));
assert.ok(worker.includes('const ratio = Math.min(MAX_SINGLE_POSITION_RATIO, rawRatio);'));
assert.ok(worker.includes('const totalAllocation = Math.floor(totalCapital * ratio / 1000) * 1000;'));
assert.equal(worker.includes("redistributeCapped"),false);

console.log(JSON.stringify({ok:true,structuralFinding:"per-name cap clips raw score ratio before independent NT$1,000 flooring; no second-pass redistribution is present",hypothetical:"scores 100/50/50 at NT$200k create NT$15k cap reserve + NT$1k floor reserve"},null,2));
