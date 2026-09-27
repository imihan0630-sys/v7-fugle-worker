import assert from "node:assert/strict";
import fs from "node:fs";
import {planReserveLadder,initialBuySignalBudgetSnapshot,theoreticalFirstStageCapitalCeiling} from "../research/capital_reserve_ladder_v0_1.mjs";

const p918=[
 {symbol:"2006",priorityScore:69.9,totalAllocation:50000,buyHigh:84.84,firstShares:353,secondShares:235,firstAmount:30000,secondAmount:20000},
 {symbol:"3105",priorityScore:89.4,totalAllocation:64000,buyHigh:496.92,firstShares:77,secondShares:51,firstAmount:38400,secondAmount:25600},
 {symbol:"6133",priorityScore:74.9,totalAllocation:54000,buyHigh:25.45,firstShares:1273,secondShares:848,firstAmount:32400,secondAmount:21600}
];
let x=planReserveLadder(p918,200000);
assert.equal(x.status,"READY");
assert.equal(x.designedStrategicReserveNTD,30000);
assert.equal(x.capInducedReserveNTD,0);
assert.equal(x.thousandFloorReserveNTD,2000);
assert.equal(x.planPreviewShareResidualNTD,528.87);
assert.equal(x.totalPlanPreviewReserveNTD,32528.87);
assert.ok(Math.abs(x.reserveIdentityResidualNTD)<1e-8);

const p921=[{symbol:"3006",priorityScore:66.3,totalAllocation:70000,buyHigh:287.08,firstShares:146,secondShares:97,firstAmount:42000,secondAmount:28000}];
x=planReserveLadder(p921,200000);
assert.equal(x.designedStrategicReserveNTD,130000);
assert.equal(x.capInducedReserveNTD,0);
assert.equal(x.thousandFloorReserveNTD,0);
assert.equal(x.planPreviewShareResidualNTD,239.56);
assert.equal(x.totalPlanPreviewReserveNTD,130239.56);

const s=initialBuySignalBudgetSnapshot(p921[0],{symbol:"3006",signalType:"BUY",signalAmount:42000,marketPrice:282.5});
assert.equal(s.status,"READY");
assert.equal(s.liveSuggestedShares,148);
assert.equal(s.liveSuggestedNotionalNTD,41810);
assert.equal(s.liveSignalShareResidualNTD,190);
assert.equal(s.plannedBudgetNotInInitialBuySignalNTD,28000);
assert.equal(s.plannedBudgetNotInInitialBuySignalPctOfPlan,40);

assert.equal(theoreticalFirstStageCapitalCeiling(1).nominalInitialStagePct,21);
assert.equal(theoreticalFirstStageCapitalCeiling(2).nominalInitialStagePct,36);
assert.equal(theoreticalFirstStageCapitalCeiling(3).nominalInitialStagePct,51);
assert.equal(theoreticalFirstStageCapitalCeiling(6).nominalInitialStagePct,51);

const worker=fs.readFileSync("Worker.js","utf8");
assert.ok(worker.includes("const firstAmount = Math.round(totalAllocation * 0.6);"),"Formal first-tranche ratio changed; reserve audit reconstruction requires re-audit");
assert.ok(worker.includes("const secondAmount = totalAllocation - firstAmount;"),"Formal second-tranche remainder rule changed; reserve audit reconstruction requires re-audit");

console.log(JSON.stringify({ok:true,plan918:"30k strategic + 0 cap + 2k grid + 528.87 preview-share residual = 32,528.87 plan-preview reserve",signal3006:"42k first budget -> 148 shares at 282.5 = 41,810 suggested notional + 190 signal residual; 28k remains staged for ADD",firstStageCeilingsPct:{one:21,two:36,threePlus:51}},null,2));
