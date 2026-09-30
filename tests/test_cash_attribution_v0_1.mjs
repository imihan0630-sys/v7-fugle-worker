import assert from "node:assert/strict";
import {classifyPlanTimeCash,summarizePlanTimeCash} from "../research/cash_attribution_v0_1.mjs";

let x=classifyPlanTimeCash({
 scanDate:"2026-09-18",selectedCount:3,totalCapital:200000,
 plans:[
  {symbol:"2006",totalAllocation:50000,priorityScore:69.9},
  {symbol:"3105",totalAllocation:64000,priorityScore:89.4},
  {symbol:"6133",totalAllocation:54000,priorityScore:74.9}
 ]
});
assert.equal(x.status,"READY");
assert.equal(x.nominalDeployTargetNTD,170000);
assert.equal(x.plannedDeploymentNTD,168000);
assert.equal(x.designedStrategicReserveNTD,30000);
assert.equal(x.allocationImplementationShortfallNTD,2000);
assert.equal(x.plannedCashNTD,32000);
assert.equal(x.allocatorSplit.status,"READY");
assert.equal(x.allocatorSplit.capInducedReserveNTD,0);
assert.equal(x.allocatorSplit.thousandFloorReserveNTD,2000);
assert.equal(x.executionStateCash.status,"UNKNOWN");

x=classifyPlanTimeCash({
 scanDate:"2026-09-21",selectedCount:1,totalCapital:200000,
 plans:[{symbol:"3006",totalAllocation:70000,priorityScore:66.3}]
});
assert.equal(x.status,"READY");
assert.equal(x.designedStrategicReserveNTD,130000);
assert.equal(x.allocationImplementationShortfallNTD,0);
assert.equal(x.plannedCashNTD,130000);

const z=classifyPlanTimeCash({scanDate:"2026-09-24",selectedCount:0,totalCapital:200000,plans:[]});
assert.equal(z.status,"READY");
assert.equal(z.designedStrategicReserveNTD,200000);
assert.match(z.planTimeCashReason,/NO_ELIGIBLE_OPPORTUNITY/);
assert.equal(z.executionStateCash.amountNTD,null);

assert.equal(classifyPlanTimeCash({selectedCount:0,totalCapital:200000,plans:[{symbol:"A",totalAllocation:1}]}).status,"UNKNOWN");
assert.equal(classifyPlanTimeCash({selectedCount:2,totalCapital:200000,plans:[{symbol:"A",totalAllocation:60000}]}).status,"UNKNOWN");

const s=summarizePlanTimeCash([z,x]);
assert.equal(s.readyDates,2);
assert.equal(s.executionCashKnownDates,0);

console.log(JSON.stringify({
 ok:true,
 rule:"plan-time reserve attribution is PIT-reconstructable; actual broker/execution cash stays UNKNOWN without fills/holdings evidence"
},null,2));
